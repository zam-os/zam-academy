import {
  balanceShift,
  fmt,
  fmtInt,
  householdBudget,
  offerPrice,
  percentOf,
  periodOutcome,
  toCents,
  vatFromNet,
  weightedLocation,
  type ShiftKind,
} from "./finance";
import type { LabKind } from "./model/types";
import { esc } from "./workshop";

type Values = Record<string, number | string>;
interface Control {
  id: string;
  title: string;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<[string, string]>;
}
interface LabSpec {
  description: string;
  goal: string;
  controls: Control[];
  defaults: Values;
}

const n = (id: string, title: string, min: number, max: number, step = 1): Control => ({
  id,
  title,
  min,
  max,
  step,
});

const LOCATION_FACTORS = [
  { name: "Verkehrsanbindung & Erweiterungsfläche", a: 6, b: 2 },
  { name: "Miete & Grundstückskosten", a: 5, b: 2 },
  { name: "Fachkräfte im Umkreis", a: 4, b: 4 },
  { name: "Laufkundschaft", a: 1, b: 6 },
] as const;

const BASE_BALANCE = { av: 140000, uv: 70000, ek: 120000, lbkv: 50000, ve: 40000 };

/** Every lab starts from these values; none of them meets the lab's goal. */
export const LABS: Record<LabKind, LabSpec> = {
  budget: {
    description:
      "Familie Weber stellt ihren Monatsplan auf. Prüfe, wie sich laufende Ausgaben und ein Ausgabewunsch auf den monatlichen Überschuss und die Sparquote auswirken.",
    goal: "Erreiche bei unverändertem Einkommen (3.600 Euro) und einem Ausgabewunsch von mindestens 250 Euro eine Sparquote von mindestens 10 % (360 Euro Überschuss).",
    controls: [
      n("income", "Familieneinkommen (Euro)", 500, 20000, 50),
      n("fixed", "Feste Ausgaben: Miete, Strom, Abos (Euro)", 0, 15000, 50),
      n("variable", "Veränderliche Ausgaben: Einkauf, Freizeit (Euro)", 0, 10000, 10),
      n("wish", "Zusätzlicher Ausgabewunsch (Euro)", 0, 5000, 10),
    ],
    defaults: { income: 3600, fixed: 2350, variable: 1150, wish: 250 },
  },
  chart: {
    description:
      "Das Radwerk Brenner verkauft im März 40 und im April 50 Jugendräder. Verschiebe den Startwert der senkrechten Achse und beobachte, wie sich das Bild verändert, obwohl die Zahlen gleich bleiben.",
    goal: "Lass den April-Balken bei unveränderten Stückzahlen (40 und 50) optisch mindestens dreimal so hoch wirken wie den März-Balken, indem du die Achse abschneidest.",
    controls: [
      n("valA", "März-Absatz (Stück)", 10, 100, 2),
      n("valB", "April-Absatz (Stück)", 10, 100, 2),
      n("yMin", "Achsenstart y-Achse (Stück)", 0, 48, 2),
    ],
    defaults: { valA: 40, valB: 50, yMin: 0 },
  },
  location: {
    description:
      "Vergleiche zwei Standorte auf einer Punkteskala von 1 (sehr schlecht) bis 6 (sehr gut): Gewerbepark an der Autobahn (A) und Innenstadtrand (B). Passe die Gewichte so an, dass sie zusammen 100 % ergeben.",
    goal: "Gewichte die Faktoren so (Summe genau 100 %), dass Gewerbepark A insgesamt mindestens 1,50 Punkte vor Innenstadt B liegt.",
    controls: [
      n("wTraffic", "Gewicht Verkehrsanbindung & Platz (%)", 0, 100, 5),
      n("wRent", "Gewicht Miete & Grundstückskosten (%)", 0, 100, 5),
      n("wStaff", "Gewicht Fachkräfte (%)", 0, 100, 5),
      n("wCust", "Gewicht Laufkundschaft (%)", 0, 100, 5),
    ],
    defaults: { wTraffic: 10, wRent: 10, wStaff: 20, wCust: 60 },
  },
  balance: {
    description:
      "Links steht die Mittelverwendung (Vermögen: Aktiva), rechts die Mittelherkunft (Kapital: Passiva). Das Eigenkapital ergibt sich als Vermögen minus Fremdkapital, damit die Bilanzwaage im Gleichgewicht bleibt.",
    goal: "Stelle bei unverändertem Anlagevermögen (150.000 Euro) eine Bilanzsumme von genau 250.000 Euro ein und erreiche mindestens 60 % Eigenkapitalanteil.",
    controls: [
      n("av", "Anlagevermögen (Euro)", 0, 5_000_000, 5000),
      n("uv", "Umlaufvermögen (Euro)", 0, 5_000_000, 5000),
      n("fk", "Schulden / Fremdkapital (Euro)", 0, 5_000_000, 5000),
    ],
    defaults: { av: 150000, uv: 50000, fk: 130000 },
  },
  bilanzChange: {
    description:
      "Jeder bestandsverändernde Geschäftsfall berührt mindestens zwei Bilanzposten. Wähle Art und Betrag ausgehend von einer Bilanzsumme von 210.000 Euro.",
    goal: "Führe eine Bilanzverlängerung (Aktiv-Passiv-Mehrung) auf genau 230.000 Euro Bilanzsumme durch.",
    controls: [
      {
        id: "kind",
        title: "Art der Bilanzveränderung",
        options: [
          ["aktivtausch", "Aktivtausch: Maschine per Bank kaufen"],
          ["passivtausch", "Passivtausch: VE in Darlehen umwandeln"],
          ["mehrung", "Aktiv-Passiv-Mehrung: Maschine auf Ziel kaufen"],
          ["minderung", "Aktiv-Passiv-Minderung: VE per Bank begleichen"],
        ],
      },
      n("amount", "Betrag des Geschäftsfalls (Euro)", 1000, 100000, 1000),
    ],
    defaults: { kind: "aktivtausch", amount: 5000 },
  },
  vat: {
    description:
      "Auf den Warenwert (netto) wird je nach Produktgruppe der Regelsteuersatz (19 %) oder der ermäßigte Steuersatz (7 %) aufgeschlagen. Zusammen ergeben sie den Bruttorechnungsbetrag.",
    goal: "Stelle bei 19 % Umsatzsteuer genau 95,00 Euro Steuerbetrag ein.",
    controls: [
      n("net", "Warenwert / Nettobetrag (Euro)", 10, 50000, 10),
      {
        id: "rate",
        title: "Steuersatz",
        options: [
          ["19", "19 % (Regelsteuersatz)"],
          ["7", "7 % (ermäßigter Steuersatz)"],
        ],
      },
    ],
    defaults: { net: 200, rate: "19" },
  },
  offerCompare: {
    description:
      "Zwei Lieferanten bieten Jugendrad-Rahmen an. Vergleiche die Listenpreise nach Abzug des jeweiligen Sofortrabatts.",
    goal: "Erhöhe bei unveränderten Listenpreisen (8.000 / 8.500 Euro) und 5 % Rabatt bei A den Sofortrabatt von Lieferer B so weit, dass Angebot B netto mindestens 200 Euro günstiger ist als Angebot A.",
    controls: [
      n("priceA", "Listenpreis Lieferer A (Euro netto)", 1000, 50000, 100),
      n("rabA", "Sofortrabatt Lieferer A (%)", 0, 40, 1),
      n("priceB", "Listenpreis Lieferer B (Euro netto)", 1000, 50000, 100),
      n("rabB", "Sofortrabatt Lieferer B (%)", 0, 40, 1),
    ],
    defaults: { priceA: 8000, rabA: 5, priceB: 8500, rabB: 5 },
  },
  closingFlow: {
    description:
      "Die Erfolgskonten (Aufwendungen und Umsatzerlöse) schließen über 8020 GUV ab. Der Reingewinn oder Reinverlust fließt dann in das Konto 3000 EK und bestimmt den Wert im 8010 SBK.",
    goal: "Erziele bei unverändertem Anfangsbestand des Eigenkapitals (180.000 Euro) einen Reingewinn und bringe das End-Eigenkapital auf genau 200.000 Euro.",
    controls: [
      n("ekStart", "Anfangsbestand 3000 EK (Euro)", 50000, 1_000_000, 5000),
      n("uefe", "5000 UEFE · Umsatzerlöse (Euro)", 0, 1_000_000, 5000),
      n("awr", "6000 AWR · Rohstoffe (Euro)", 0, 500_000, 5000),
      n("awf", "6010 AWF · Fremdbauteile (Euro)", 0, 500_000, 5000),
      n("awh", "6020 AWH · Hilfsstoffe (Euro)", 0, 200_000, 1000),
      n("awb", "6030 AWB · Betriebsstoffe (Euro)", 0, 200_000, 1000),
    ],
    defaults: { ekStart: 180000, uefe: 110000, awr: 70000, awf: 35000, awh: 10000, awb: 5000 },
  },
};

const num = (v: Values, id: string) => Number(v[id]);
const same = (v: Values, kind: LabKind, ids: string[]) =>
  ids.every((id) => num(v, id) === Number(LABS[kind].defaults[id]));

/** Whether the learner reached the lab's goal; tests prove each goal reachable and unmet at the start. */
export function goalReached(kind: LabKind, v: Values): boolean {
  try {
    switch (kind) {
      case "budget": {
        const r = householdBudget(num(v, "income"), num(v, "fixed"), num(v, "variable"), num(v, "wish"));
        return same(v, kind, ["income"]) && num(v, "wish") >= 250 && r.savingsRate >= 10;
      }
      case "chart": {
        const valA = num(v, "valA");
        const valB = num(v, "valB");
        const yMin = num(v, "yMin");
        if (!same(v, kind, ["valA", "valB"]) || yMin <= 0 || yMin >= valA || yMin >= valB) return false;
        return (valB - yMin) / (valA - yMin) >= 3;
      }
      case "location": {
        const weights = [num(v, "wTraffic"), num(v, "wRent"), num(v, "wStaff"), num(v, "wCust")];
        const r = weightedLocation(
          LOCATION_FACTORS.map((f) => f.a),
          LOCATION_FACTORS.map((f) => f.b),
          weights,
        );
        return toCents(r.diff) >= 150;
      }
      case "balance": {
        const av = num(v, "av");
        const uv = num(v, "uv");
        const fk = num(v, "fk");
        const total = av + uv;
        const ek = total - fk;
        if (!same(v, kind, ["av"]) || fk < 0 || ek < 0 || total <= 0) return false;
        return toCents(total) === 250_000_00 && percentOf(toCents(ek), toCents(total)) >= 60;
      }
      case "bilanzChange": {
        const shiftKind = String(v.kind) as ShiftKind;
        const r = balanceShift(BASE_BALANCE, shiftKind, num(v, "amount"));
        return shiftKind === "mehrung" && toCents(r.total) === 230_000_00;
      }
      case "vat": {
        const rate = Number(v.rate) === 7 ? 7 : 19;
        const r = vatFromNet(num(v, "net"), rate);
        return rate === 19 && toCents(r.vat) === 9500;
      }
      case "offerCompare": {
        const a = offerPrice(num(v, "priceA"), num(v, "rabA"));
        const b = offerPrice(num(v, "priceB"), num(v, "rabB"));
        return same(v, kind, ["priceA", "rabA", "priceB"]) && toCents(a.net) - toCents(b.net) >= 20000;
      }
      case "closingFlow": {
        const out = periodOutcome([num(v, "uefe")], [num(v, "awr"), num(v, "awf"), num(v, "awh"), num(v, "awb")]);
        const ekEnd = num(v, "ekStart") + out.result;
        return same(v, kind, ["ekStart"]) && out.result > 0 && toCents(ekEnd) === 200_000_00;
      }
    }
  } catch {
    return false;
  }
}

const table = (titles: string[], rows: (number | string)[][]) =>
  `<div class="table-scroll"><table><thead><tr>${titles.map((x) => `<th scope="col">${esc(x)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((x) => `<td>${typeof x === "number" ? fmt(x) : esc(x)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

const bookingLine = (debit: Array<[string, number]>, credit: Array<[string, number]>) =>
  `<p class="booking-line">${debit.map(([a, x]) => `${esc(a)} ${fmt(x)}`).join(" · ")} <strong>an</strong> ${credit.map(([a, x]) => `${esc(a)} ${fmt(x)}`).join(" · ")}</p>`;

function controlHtml(c: Control, value: number | string) {
  if (c.options)
    return `<label>${esc(c.title)}<select id="lab-${c.id}">${c.options.map(([v, t]) => `<option value="${v}" ${v === value ? "selected" : ""}>${esc(t)}</option>`).join("")}</select></label>`;
  return `<label>${esc(c.title)}<input id="lab-${c.id}" type="number" inputmode="decimal" value="${value}" min="${c.min}" max="${c.max}" step="${c.step}"></label>`;
}

export function labHtml(kind: LabKind): string {
  const spec = LABS[kind];
  return `<section class="panel lab"><div class="eyebrow">Was ändert sich, wenn …?</div><h2>Zusammenhänge ausprobieren</h2><p>${esc(spec.description)}</p><p class="goal" id="lab-goal"><span aria-hidden="true">○</span> Ziel: ${esc(spec.goal)}</p><form id="lab-form"><div class="controls">${spec.controls.map((c) => controlHtml(c, spec.defaults[c.id])).join("")}</div><div class="actions"><button type="submit">Modell aktualisieren</button><button type="button" id="lab-reset" class="quiet">Startwerte</button></div></form><div id="lab-result" aria-live="polite"></div></section>`;
}

function renderResult(kind: LabKind, v: Values): string {
  switch (kind) {
    case "budget": {
      const income = num(v, "income"),
        fixed = num(v, "fixed"),
        variable = num(v, "variable"),
        wish = num(v, "wish"),
        r = householdBudget(income, fixed, variable, wish);
      const status =
        r.balance < 0
          ? `Achtung: Die Ausgaben übersteigen das Einkommen um ${fmt(-r.balance)} Euro (Gefahr von Schulden).`
          : r.balance === 0
            ? "Einnahmen und Ausgaben gleichen sich aus, aber es bleibt kein Sparpolster."
            : `Monatlicher Überschuss: ${fmt(r.balance)} Euro (Sparquote ${fmt(r.savingsRate)} %).`;
      return `${table(
        ["Haushaltsposten", "Euro"],
        [
          ["Einnahmen (Familie)", income],
          ["Feste Ausgaben", fixed],
          ["Veränderliche Ausgaben", variable],
          ["Zusatzwunsch", wish],
          ["Summe Ausgaben", r.totalExpenses],
          ["Monatlicher Saldo", r.balance],
        ],
      )}<p class="result">${esc(status)}</p>`;
    }
    case "chart": {
      const valA = num(v, "valA"),
        valB = num(v, "valB"),
        yMin = num(v, "yMin");
      if (yMin >= valA || yMin >= valB) {
        throw new Error("Der Achsenstart muss kleiner als beide Werte bleiben.");
      }
      const span = Math.max(1, Math.max(valA, valB) - yMin);
      const w = 420,
        h = 200,
        base = 170,
        top = 24,
        plotH = base - top;
      const hA = ((valA - yMin) / span) * plotH;
      const hB = ((valB - yMin) / span) * plotH;
      const ratio = (valB - yMin) / (valA - yMin);
      const svg = `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Säulendiagramm mit Achsenstart ${fmtInt(yMin)}"><line class="axis" x1="56" y1="${base}" x2="380" y2="${base}"/><line class="axis" x1="56" y1="${base}" x2="56" y2="${top - 6}"/><text class="chart-label" x="48" y="${base + 4}" text-anchor="end">${fmtInt(yMin)}</text><text class="chart-label" x="48" y="${top + 6}" text-anchor="end">${fmtInt(Math.max(valA, valB))}</text><rect x="112" y="${base - hA}" width="72" height="${hA}" fill="var(--old)" rx="4"/><text class="chart-label" x="148" y="${base - hA - 6}" text-anchor="middle">${fmtInt(valA)} St.</text><text class="chart-label" x="148" y="${base + 18}" text-anchor="middle">März</text><rect x="242" y="${base - hB}" width="72" height="${hB}" fill="var(--new)" rx="4"/><text class="chart-label" x="278" y="${base - hB - 6}" text-anchor="middle">${fmtInt(valB)} St.</text><text class="chart-label" x="278" y="${base + 18}" text-anchor="middle">April</text></svg>`;
      return `${svg}<p class="result">Tatsächliches Verhältnis: ${fmt(valB / valA)} : 1 · Optisches Balkenverhältnis ab Achse ${fmtInt(yMin)}: <strong>${fmt(ratio)} : 1</strong>.</p><p class="small">${yMin > 0 ? "Durch die abgeschnittene y-Achse wirken Unterschiede größer, als sie tatsächlich sind." : "Bei Achsenstart 0 entspricht die Balkenhöhe genau den Zahlen."}</p>`;
    }
    case "location": {
      const weights = [num(v, "wTraffic"), num(v, "wRent"), num(v, "wStaff"), num(v, "wCust")];
      const r = weightedLocation(
        LOCATION_FACTORS.map((f) => f.a),
        LOCATION_FACTORS.map((f) => f.b),
        weights,
      );
      return `${table(
        ["Standortfaktor", "Gewicht (%)", "A (Autobahn)", "B (Innenstadt)"],
        LOCATION_FACTORS.map((f, i) => [f.name, fmtInt(weights[i]), fmtInt(f.a), fmtInt(f.b)]),
      )}<p class="result">Gesamtnote Gewerbepark A: <strong>${fmt(r.scoreA)} Punkte</strong> · Innenstadt B: <strong>${fmt(r.scoreB)} Punkte</strong> · Vorsprung A: <strong>${fmt(r.diff)} Punkte</strong>.</p>`;
    }
    case "balance": {
      const av = num(v, "av"),
        uv = num(v, "uv"),
        fk = num(v, "fk"),
        total = av + uv,
        ek = total - fk;
      if (ek < 0) throw new Error("Die Schulden übersteigen das gesamte Vermögen.");
      const eqShare = total > 0 ? percentOf(toCents(ek), toCents(total)) : 0;
      return `${table(
        ["Aktiva (Vermögen)", "Euro", "Passiva (Kapital)", "Euro"],
        [
          ["Anlagevermögen (AV)", av, "Eigenkapital (EK)", ek],
          ["Umlaufvermögen (UV)", uv, "Schulden / Fremdkapital (FK)", fk],
          ["Bilanzsumme Aktiva", total, "Bilanzsumme Passiva", total],
        ],
      )}<p class="result">Eigenkapitalquote: <strong>${fmt(eqShare)} %</strong> (Bilanzgleichung: Vermögen − Schulden = Eigenkapital).</p>`;
    }
    case "bilanzChange": {
      const shiftKind = String(v.kind) as ShiftKind;
      const amount = num(v, "amount");
      const r = balanceShift(BASE_BALANCE, shiftKind, amount);
      const label =
        shiftKind === "aktivtausch"
          ? "Aktivtausch: AV steigt, UV sinkt; die Bilanzsumme bleibt unverändert."
          : shiftKind === "passivtausch"
            ? "Passivtausch: LBKV steigt, VE sinkt; die Bilanzsumme bleibt unverändert."
            : shiftKind === "mehrung"
              ? "Aktiv-Passiv-Mehrung (Bilanzverlängerung): AV und VE steigen gleichmäßig."
              : "Aktiv-Passiv-Minderung (Bilanzverkürzung): UV und VE sinken gleichmäßig.";
      return `${table(
        ["Aktiva", "Euro", "Passiva", "Euro"],
        [
          ["Anlagevermögen", r.av, "Eigenkapital (3000 EK)", r.ek],
          ["Umlaufvermögen", r.uv, "Langfr. Darlehen (4250 LBKV)", r.lbkv],
          ["", "", "Verbindlichkeiten LL (4400 VE)", r.ve],
          ["Neue Bilanzsumme", r.total, "Neue Bilanzsumme", r.total],
        ],
      )}<p class="result">${esc(label)} Veränderung zur Ausgangsbilanz: ${r.deltaTotal >= 0 ? "+" : ""}${fmt(r.deltaTotal)} Euro.</p>`;
    }
    case "vat": {
      const rate = Number(v.rate) === 7 ? 7 : 19;
      const r = vatFromNet(num(v, "net"), rate);
      return `${table(
        ["Bestandteil", "Anteil (%)", "Euro"],
        [
          ["Warenwert (netto)", "100 %", r.net],
          [`Umsatzsteuer (${rate} %)`, `${rate} %`, r.vat],
          ["Rechnungsbetrag (brutto)", `${100 + rate} %`, r.gross],
        ],
      )}<p class="result">Auf ${fmt(r.net)} Euro netto kommen ${fmt(r.vat)} Euro Umsatzsteuer (${rate} %).</p>`;
    }
    case "offerCompare": {
      const a = offerPrice(num(v, "priceA"), num(v, "rabA"));
      const b = offerPrice(num(v, "priceB"), num(v, "rabB"));
      const diff = toCents(a.net) - toCents(b.net);
      return `${table(
        ["Größe", "Lieferer A", "Lieferer B"],
        [
          ["Listenpreis netto", a.listPrice, b.listPrice],
          ["− Sofortrabatt", a.discount, b.discount],
          ["= Bezugspreis netto", a.net, b.net],
          ["+ 19 % Vorsteuer", a.vat, b.vat],
          ["= Bruttorechnungsbetrag", a.gross, b.gross],
        ],
      )}<p class="result">${diff > 0 ? `Lieferer B ist netto um ${fmt(diff / 100)} Euro günstiger als Lieferer A.` : diff < 0 ? `Lieferer A ist netto um ${fmt(-diff / 100)} Euro günstiger als Lieferer B.` : "Beide Angebote sind netto gleich teuer."}</p>`;
    }
    case "closingFlow": {
      const ekStart = num(v, "ekStart"),
        uefe = num(v, "uefe"),
        awr = num(v, "awr"),
        awf = num(v, "awf"),
        awh = num(v, "awh"),
        awb = num(v, "awb"),
        out = periodOutcome([uefe], [awr, awf, awh, awb]),
        ekEnd = ekStart + out.result;
      const closingBooking =
        out.kind === "profit"
          ? bookingLine([["8020 GUV", out.absResult]], [["3000 EK", out.absResult]])
          : out.kind === "loss"
            ? bookingLine([["3000 EK", out.absResult]], [["8020 GUV", out.absResult]])
            : "<p>Aufwendungen und Erträge sind gleich hoch; das Eigenkapital bleibt unverändert.</p>";
      return `${table(
        ["Rechnungsschritt", "Euro"],
        [
          ["Erträge (5000 UEFE)", out.totalRevenue],
          ["Aufwendungen (6000–6030)", out.totalExpense],
          [out.kind === "loss" ? "Reinverlust" : "Reingewinn / Ergebnis", out.result],
          ["Anfangsbestand 3000 EK", ekStart],
          ["Endbestand 3000 EK (→ 8010 SBK)", ekEnd],
        ],
      )}${closingBooking}`;
    }
  }
}

export function bindLab(kind: LabKind, onGoal: () => void) {
  const form = document.querySelector<HTMLFormElement>("#lab-form");
  const out = document.querySelector<HTMLElement>("#lab-result");
  const goal = document.querySelector<HTMLElement>("#lab-goal");
  if (!form || !out || !goal) return;
  const spec = LABS[kind];
  const read = (): Values =>
    Object.fromEntries(
      spec.controls.map((c) => {
        const raw = document.querySelector<HTMLInputElement | HTMLSelectElement>(`#lab-${c.id}`)?.value ?? "";
        return [c.id, c.options ? raw : Number(raw)];
      }),
    );
  const render = () => {
    if (!form.reportValidity()) return;
    const values = read();
    try {
      out.innerHTML = renderResult(kind, values);
    } catch (error) {
      out.textContent = error instanceof Error ? error.message : "Eingaben prüfen.";
    }
    const reached = goalReached(kind, values);
    goal.classList.toggle("done", reached);
    goal.innerHTML = `<span aria-hidden="true">${reached ? "✓" : "○"}</span> ${reached ? "Ziel erreicht: " : "Ziel: "}${esc(spec.goal)}`;
    if (reached) onGoal();
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    render();
  });
  document.querySelector("#lab-reset")?.addEventListener("click", () => {
    for (const c of spec.controls) {
      const el = document.querySelector<HTMLInputElement | HTMLSelectElement>(`#lab-${c.id}`);
      if (el) el.value = String(spec.defaults[c.id]);
    }
    render();
  });
  render();
}
