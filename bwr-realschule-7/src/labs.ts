import { STEP_ICONS } from "./figures/draw";
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
      "Die Erfolgskonten (Aufwendungen und Umsatzerlöse) schließen über GUV ab. Der Reingewinn oder Reinverlust fließt dann in das Konto EK und bestimmt den Wert im SBK.",
    goal: "Erziele bei unverändertem Anfangsbestand des Eigenkapitals (180.000 Euro) einen Reingewinn und bringe das End-Eigenkapital auf genau 200.000 Euro.",
    controls: [
      n("ekStart", "Anfangsbestand EK (Euro)", 50000, 1_000_000, 5000),
      n("uefe", "UEFE · Umsatzerlöse (Euro)", 0, 1_000_000, 5000),
      n("awr", "AWR · Rohstoffe (Euro)", 0, 500_000, 5000),
      n("awf", "AWF · Fremdbauteile (Euro)", 0, 500_000, 5000),
      n("awh", "AWH · Hilfsstoffe (Euro)", 0, 200_000, 1000),
      n("awb", "AWB · Betriebsstoffe (Euro)", 0, 200_000, 1000),
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
  return `<section class="panel lab"><div class="eyebrow">${STEP_ICONS.lab}<span>Was ändert sich, wenn …?</span></div><h2>Zusammenhänge ausprobieren</h2><p>${esc(spec.description)}</p><p class="goal" id="lab-goal"><span aria-hidden="true">○</span> Ziel: ${esc(spec.goal)}</p><form id="lab-form"><div class="controls">${spec.controls.map((c) => controlHtml(c, spec.defaults[c.id])).join("")}</div><div class="actions"><button type="submit">Modell aktualisieren</button><button type="button" id="lab-reset" class="quiet">Startwerte</button></div></form><div id="lab-result" aria-live="polite"></div></section>`;
}

const r1 = (nVal: number) => Math.round(nVal * 10) / 10;

export function renderResult(kind: LabKind, v: Values): string {
  switch (kind) {
    case "budget": {
      const income = num(v, "income"),
        fixed = num(v, "fixed"),
        variable = num(v, "variable"),
        wish = num(v, "wish"),
        r = householdBudget(income, fixed, variable, wish);
      const maxScale = Math.max(1, income, r.totalExpenses);
      const barMax = 290;
      const wInc = r1((income / maxScale) * barMax);
      const wFix = r1((fixed / maxScale) * barMax);
      const wVar = r1((variable / maxScale) * barMax);
      const wWish = r1((wish / maxScale) * barMax);
      const wSurplus = r.balance > 0 ? r1((r.balance / maxScale) * barMax) : 0;
      const goalX = 112 + r1(((income * 0.9) / maxScale) * barMax);
      const goalAnchor = goalX > 360 ? "end" : "middle";
      const goalLabelX = goalAnchor === "end" ? goalX - 4 : goalX;
      const svg = `<svg class="chart lab-svg" viewBox="0 0 520 164" role="img" aria-label="Balkenvergleich von Einnahmen (${fmt(income)} €) und Ausgaben (${fmt(r.totalExpenses)} €)"><line x1="${goalX}" y1="18" x2="${goalX}" y2="108" class="chart-marker"/><text class="chart-label" x="${goalLabelX}" y="13" text-anchor="${goalAnchor}">90-%-Limit (10 % Sparziel)</text><text class="visual-label micro" x="104" y="45" text-anchor="end">Einnahmen</text><rect x="112" y="26" width="${wInc}" height="28" rx="5" class="v-green"/><text class="visual-label micro" x="${118 + wInc}" y="45" text-anchor="start">${esc(fmt(income))} €</text><text class="visual-label micro" x="104" y="88" text-anchor="end">Ausgaben</text><rect x="112" y="69" width="${wFix}" height="28" rx="4" class="v-blue"/><rect x="${112 + wFix}" y="69" width="${wVar}" height="28" rx="4" class="v-orange"/><rect x="${112 + wFix + wVar}" y="69" width="${wWish}" height="28" rx="4" class="v-purple"/>${wSurplus > 2 ? `<rect x="${112 + wFix + wVar + wWish}" y="69" width="${wSurplus}" height="28" rx="4" class="v-teal"/>` : ""}<rect x="112" y="120" width="12" height="12" rx="3" class="v-blue"/><text class="visual-label micro" x="130" y="130" text-anchor="start">Fest: ${esc(fmt(fixed))} €</text><rect x="306" y="120" width="12" height="12" rx="3" class="v-orange"/><text class="visual-label micro" x="324" y="130" text-anchor="start">Veränderlich: ${esc(fmt(variable))} €</text><rect x="112" y="142" width="12" height="12" rx="3" class="v-purple"/><text class="visual-label micro" x="130" y="152" text-anchor="start">Wunsch: ${esc(fmt(wish))} €</text><rect x="306" y="142" width="12" height="12" rx="3" class="${r.balance >= 0 ? "v-teal" : "v-coral"}"/><text class="visual-label micro" x="324" y="152" text-anchor="start">Saldo: ${r.balance >= 0 ? `+${esc(fmt(r.balance))}` : esc(fmt(r.balance))} €</text></svg>`;
      const status =
        r.balance < 0
          ? `Achtung: Die Ausgaben übersteigen das Einkommen um ${fmt(-r.balance)} Euro (Gefahr von Schulden).`
          : r.balance === 0
            ? "Einnahmen und Ausgaben gleichen sich aus, aber es bleibt kein Sparpolster."
            : `Monatlicher Überschuss: ${fmt(r.balance)} Euro (Sparquote ${fmt(r.savingsRate)} %).`;
      return `${svg}${table(
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
      const maxVal = Math.max(1, valA, valB);
      const span = Math.max(1, maxVal - yMin);
      const base = 166,
        top = 38,
        plotH = base - top;
      const hHonestA = r1((valA / maxVal) * plotH);
      const hHonestB = r1((valB / maxVal) * plotH);
      const hCutA = r1(((valA - yMin) / span) * plotH);
      const hCutB = r1(((valB - yMin) / span) * plotH);
      const ratio = (valB - yMin) / (valA - yMin);
      const svg = `<svg class="chart lab-svg" viewBox="0 0 520 200" role="img" aria-label="Säulenvergleich ehrlich ab 0 gegen abgeschnittene Achse ab ${fmtInt(yMin)}"><rect x="10" y="6" width="240" height="188" rx="10" class="v-soft-fill"/><text class="visual-label micro" x="130" y="24" text-anchor="middle">Ehrlich · Achse ab 0</text><line class="axis" x1="48" y1="${base}" x2="226" y2="${base}"/><line class="axis" x1="48" y1="${base}" x2="48" y2="${top - 4}"/><text class="chart-label" x="42" y="${base + 4}" text-anchor="end">0</text><text class="chart-label" x="42" y="${top + 6}" text-anchor="end">${fmtInt(maxVal)}</text><rect x="76" y="${base - hHonestA}" width="44" height="${hHonestA}" fill="var(--old)" rx="4"/><text class="chart-label" x="98" y="${base - hHonestA - 5}" text-anchor="middle">${fmtInt(valA)}</text><text class="chart-label" x="98" y="${base + 15}" text-anchor="middle">März</text><rect x="148" y="${base - hHonestB}" width="44" height="${hHonestB}" fill="var(--new)" rx="4"/><text class="chart-label" x="170" y="${base - hHonestB - 5}" text-anchor="middle">${fmtInt(valB)}</text><text class="chart-label" x="170" y="${base + 15}" text-anchor="middle">April</text><rect x="270" y="6" width="240" height="188" rx="10" class="v-soft-fill"/><text class="visual-label micro" x="390" y="24" text-anchor="middle">Aktuell · Achse ab ${fmtInt(yMin)}</text><line class="axis" x1="308" y1="${base}" x2="486" y2="${base}"/><line class="axis" x1="308" y1="${base}" x2="308" y2="${top - 4}"/><text class="chart-label" x="302" y="${base + 4}" text-anchor="end">${fmtInt(yMin)}</text><text class="chart-label" x="302" y="${top + 6}" text-anchor="end">${fmtInt(maxVal)}</text><rect x="336" y="${base - hCutA}" width="44" height="${hCutA}" fill="var(--old)" rx="4"/><text class="chart-label" x="358" y="${base - hCutA - 5}" text-anchor="middle">${fmtInt(valA)}</text><text class="chart-label" x="358" y="${base + 15}" text-anchor="middle">März</text><rect x="408" y="${base - hCutB}" width="44" height="${hCutB}" fill="var(--new)" rx="4"/><text class="chart-label" x="430" y="${base - hCutB - 5}" text-anchor="middle">${fmtInt(valB)}</text><text class="chart-label" x="430" y="${base + 15}" text-anchor="middle">April</text></svg>`;
      return `${svg}<p class="result">Tatsächliches Verhältnis: ${fmt(valB / valA)} : 1 · Optisches Balkenverhältnis ab Achse ${fmtInt(yMin)}: <strong>${fmt(ratio)} : 1</strong>.</p><p class="small">${yMin > 0 ? "Durch die abgeschnittene y-Achse wirken Unterschiede größer, als sie tatsächlich sind." : "Bei Achsenstart 0 entspricht die Balkenhöhe genau den Zahlen."}</p>`;
    }
    case "location": {
      const weights = [num(v, "wTraffic"), num(v, "wRent"), num(v, "wStaff"), num(v, "wCust")];
      const r = weightedLocation(
        LOCATION_FACTORS.map((f) => f.a),
        LOCATION_FACTORS.map((f) => f.b),
        weights,
      );
      const barMax = 280;
      const wA = r1((r.scoreA / 6) * barMax);
      const wB = r1((r.scoreB / 6) * barMax);
      const segs = weights.map((w) => r1((w / 100) * 356));
      const svg = `<svg class="chart lab-svg" viewBox="0 0 520 170" role="img" aria-label="Nutzwertvergleich: Gewerbepark A ${fmt(r.scoreA)} Punkte, Innenstadt B ${fmt(r.scoreB)} Punkte"><text class="visual-label micro" x="122" y="34" text-anchor="end">Gewerbepark A</text><rect x="130" y="16" width="${wA}" height="26" rx="5" class="v-teal"/><text class="visual-label micro" x="${136 + wA}" y="34" text-anchor="start">${esc(fmt(r.scoreA))} / 6,00 Pkt.</text><text class="visual-label micro" x="122" y="72" text-anchor="end">Innenstadt B</text><rect x="130" y="54" width="${wB}" height="26" rx="5" class="v-orange"/><text class="visual-label micro" x="${136 + wB}" y="72" text-anchor="start">${esc(fmt(r.scoreB))} / 6,00 Pkt.</text><text class="visual-label micro" x="122" y="114" text-anchor="end">Gewichte (100 %)</text><rect x="130" y="98" width="${segs[0]}" height="20" rx="3" class="v-blue"/><rect x="${130 + segs[0]}" y="98" width="${segs[1]}" height="20" rx="3" class="v-teal"/><rect x="${130 + segs[0] + segs[1]}" y="98" width="${segs[2]}" height="20" rx="3" class="v-gold"/><rect x="${130 + segs[0] + segs[1] + segs[2]}" y="98" width="${segs[3]}" height="20" rx="3" class="v-coral"/><text class="visual-label micro" x="130" y="138" text-anchor="start">Verkehr ${fmtInt(weights[0])} % · Miete ${fmtInt(weights[1])} %</text><text class="visual-label micro" x="130" y="156" text-anchor="start">Fachkräfte ${fmtInt(weights[2])} % · Kunden ${fmtInt(weights[3])} %</text></svg>`;
      return `${svg}${table(
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
      const scaleTotal = Math.max(1, total);
      const maxH = 112;
      const hAv = r1((av / scaleTotal) * maxH);
      const hUv = r1((uv / scaleTotal) * maxH);
      const hEk = r1((ek / scaleTotal) * maxH);
      const hFk = r1((fk / scaleTotal) * maxH);
      const base = 148;
      const goalY = base - r1(maxH * 0.6);
      const svg = `<svg class="chart lab-svg" viewBox="0 0 520 186" role="img" aria-label="Bilanzwaage: Aktiva ${fmt(total)} € (AV + UV) gleich Passiva ${fmt(total)} € (EK ${fmt(eqShare)} % + FK)"><line x1="260" y1="150" x2="260" y2="174" class="axis"/><rect x="218" y="172" width="84" height="8" rx="4" class="v-accent-solid"/><line x1="76" y1="150" x2="444" y2="150" class="v-accent-stroke"/><rect x="96" y="${base - hAv}" width="110" height="${hAv}" rx="4" class="v-blue"/><rect x="96" y="${base - hAv - hUv}" width="110" height="${hUv}" rx="4" class="v-teal"/><rect x="314" y="${base - hFk}" width="110" height="${hFk}" rx="4" class="v-orange"/><rect x="314" y="${base - hFk - hEk}" width="110" height="${hEk}" rx="4" class="v-green"/>${total > 0 ? `<line x1="296" y1="${goalY}" x2="440" y2="${goalY}" class="chart-marker"/><text class="chart-label" x="444" y="${goalY + 4}" text-anchor="start">60 % EK</text>` : ""}<text class="visual-label micro" x="151" y="24" text-anchor="middle">Aktiva: ${esc(fmtInt(total))} €</text><text class="visual-label micro" x="369" y="24" text-anchor="middle">Passiva: ${esc(fmtInt(total))} €</text><text class="chart-label" x="151" y="167" text-anchor="middle">AV ${esc(fmtInt(av))} · UV ${esc(fmtInt(uv))}</text><text class="chart-label" x="369" y="167" text-anchor="middle">EK ${esc(fmt(eqShare))} % · FK ${esc(fmtInt(fk))}</text></svg>`;
      return `${svg}${table(
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
      const oldTotal = BASE_BALANCE.av + BASE_BALANCE.uv;
      const scaleMax = Math.max(oldTotal, r.total, 240_000);
      const maxH = 112;
      const base = 152;
      const colH = (val: number) => r1((val / scaleMax) * maxH);
      const goalY = base - colH(230_000);
      const label =
        shiftKind === "aktivtausch"
          ? "Aktivtausch: AV steigt, UV sinkt; die Bilanzsumme bleibt unverändert."
          : shiftKind === "passivtausch"
            ? "Passivtausch: LBKV steigt, VE sinkt; die Bilanzsumme bleibt unverändert."
            : shiftKind === "mehrung"
              ? "Aktiv-Passiv-Mehrung (Bilanzverlängerung): AV und VE steigen gleichmäßig."
              : "Aktiv-Passiv-Minderung (Bilanzverkürzung): UV und VE sinken gleichmäßig.";
      const svg = `<svg class="chart lab-svg" viewBox="0 0 520 184" role="img" aria-label="Vorher-Nachher-Vergleich der Bilanzsumme: Ausgang ${fmtInt(oldTotal)} €, Neu ${fmtInt(r.total)} €"><rect x="46" y="${base - colH(BASE_BALANCE.av)}" width="54" height="${colH(BASE_BALANCE.av)}" rx="3" class="v-blue"/><rect x="46" y="${base - colH(oldTotal)}" width="54" height="${colH(BASE_BALANCE.uv)}" rx="3" class="v-teal"/><rect x="110" y="${base - colH(BASE_BALANCE.lbkv + BASE_BALANCE.ve)}" width="54" height="${colH(BASE_BALANCE.lbkv + BASE_BALANCE.ve)}" rx="3" class="v-orange"/><rect x="110" y="${base - colH(oldTotal)}" width="54" height="${colH(BASE_BALANCE.ek)}" rx="3" class="v-green"/><text class="visual-label micro" x="105" y="24" text-anchor="middle">Vorher: ${esc(fmtInt(oldTotal))} €</text><rect x="296" y="${base - colH(r.av)}" width="54" height="${colH(r.av)}" rx="3" class="v-blue"/><rect x="296" y="${base - colH(r.total)}" width="54" height="${colH(r.uv)}" rx="3" class="v-teal"/><rect x="360" y="${base - colH(r.lbkv + r.ve)}" width="54" height="${colH(r.lbkv + r.ve)}" rx="3" class="v-orange"/><rect x="360" y="${base - colH(r.total)}" width="54" height="${colH(r.ek)}" rx="3" class="v-green"/><text class="visual-label micro" x="355" y="24" text-anchor="middle">Neu: ${esc(fmtInt(r.total))} € (${r.deltaTotal >= 0 ? "+" : ""}${esc(fmtInt(r.deltaTotal))} €)</text><line x1="200" y1="${goalY}" x2="438" y2="${goalY}" class="chart-marker"/><text class="chart-label" x="444" y="${goalY + 4}" text-anchor="start">Ziel 230.000</text><text class="chart-label" x="73" y="170" text-anchor="middle">A</text><text class="chart-label" x="137" y="170" text-anchor="middle">P</text><text class="chart-label" x="323" y="170" text-anchor="middle">A neu</text><text class="chart-label" x="387" y="170" text-anchor="middle">P neu</text></svg>`;
      return `${svg}${table(
        ["Aktiva", "Euro", "Passiva", "Euro"],
        [
          ["Anlagevermögen", r.av, "Eigenkapital (EK)", r.ek],
          ["Umlaufvermögen", r.uv, "Langfr. Darlehen (LBKV)", r.lbkv],
          ["", "", "Verbindlichkeiten LL (VE)", r.ve],
          ["Neue Bilanzsumme", r.total, "Neue Bilanzsumme", r.total],
        ],
      )}<p class="result">${esc(label)} Veränderung zur Ausgangsbilanz: ${r.deltaTotal >= 0 ? "+" : ""}${fmt(r.deltaTotal)} Euro.</p>`;
    }
    case "vat": {
      const rate = Number(v.rate) === 7 ? 7 : 19;
      const r = vatFromNet(num(v, "net"), rate);
      const totalBar = 440;
      const wNet = r1((100 / (100 + rate)) * totalBar);
      const wVat = r1(totalBar - wNet);
      const svg = `<svg class="chart lab-svg" viewBox="0 0 520 124" role="img" aria-label="Zusammensetzung aus ${fmt(r.net)} € Netto (100 %) und ${fmt(r.vat)} € USt (${rate} %)"><rect x="40" y="34" width="${wNet}" height="36" rx="5" class="v-blue"/><rect x="${40 + wNet}" y="34" width="${wVat}" height="36" rx="5" class="v-gold"/><text class="visual-label micro" x="40" y="24" text-anchor="start">Netto 100 % = ${esc(fmt(r.net))} €</text><text class="visual-label micro" x="480" y="24" text-anchor="end">+ ${rate} % USt = ${esc(fmt(r.vat))} €</text><text class="visual-label micro on-fill" x="${40 + wNet / 2}" y="57" text-anchor="middle">100 % Warenwert</text><text class="visual-label micro" x="${40 + wNet + wVat / 2}" y="57" text-anchor="middle">${rate}%</text><text class="visual-label small" x="260" y="102" text-anchor="middle">Rechnungsbetrag brutto (${100 + rate} %) = ${esc(fmt(r.gross))} €</text></svg>`;
      return `${svg}${table(
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
      const maxList = Math.max(1, a.listPrice, b.listPrice);
      const scaleW = 240;
      const wNetA = r1((a.net / maxList) * scaleW);
      const wRabA = r1((a.discount / maxList) * scaleW);
      const wNetB = r1((b.net / maxList) * scaleW);
      const wRabB = r1((b.discount / maxList) * scaleW);
      const svg = `<svg class="chart lab-svg" viewBox="0 0 520 132" role="img" aria-label="Angebotsvergleich netto: Lieferer A ${fmt(a.net)} €, Lieferer B ${fmt(b.net)} €"><text class="visual-label micro" x="96" y="42" text-anchor="end">Lieferer A</text><rect x="104" y="24" width="${wNetA}" height="28" rx="4" class="v-blue"/>${wRabA > 1 ? `<rect x="${104 + wNetA}" y="24" width="${wRabA}" height="28" rx="4" class="v-coral"/>` : ""}<text class="visual-label micro" x="${112 + wNetA + wRabA}" y="42" text-anchor="start">Netto ${esc(fmt(a.net))} €</text><text class="visual-label micro" x="96" y="84" text-anchor="end">Lieferer B</text><rect x="104" y="66" width="${wNetB}" height="28" rx="4" class="v-teal"/>${wRabB > 1 ? `<rect x="${104 + wNetB}" y="66" width="${wRabB}" height="28" rx="4" class="v-coral"/>` : ""}<text class="visual-label micro" x="${112 + wNetB + wRabB}" y="84" text-anchor="start">Netto ${esc(fmt(b.net))} €</text><rect x="104" y="108" width="12" height="12" rx="3" class="v-blue"/><text class="visual-label micro" x="122" y="118" text-anchor="start">Bezugspreis netto (A / B)</text><rect x="306" y="108" width="12" height="12" rx="3" class="v-coral"/><text class="visual-label micro" x="324" y="118" text-anchor="start">Sofortrabatt</text></svg>`;
      return `${svg}${table(
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
          ? bookingLine([["GUV", out.absResult]], [["EK", out.absResult]])
          : out.kind === "loss"
            ? bookingLine([["EK", out.absResult]], [["GUV", out.absResult]])
            : "<p>Aufwendungen und Erträge sind gleich hoch; das Eigenkapital bleibt unverändert.</p>";
      const outcomeLabel =
        out.kind === "profit"
          ? `+ Gewinn ${fmtInt(out.absResult)} €`
          : out.kind === "loss"
            ? `− Verlust ${fmtInt(out.absResult)} €`
            : "± 0 €";
      const svg = `<svg class="chart lab-svg" viewBox="0 0 520 140" role="img" aria-label="Abschlussfluss von GUV (${outcomeLabel}) über EK (Endbestand ${fmtInt(ekEnd)} €) ins SBK"><rect x="12" y="20" width="144" height="98" rx="10" class="v-panel"/><text class="visual-label micro" x="84" y="40" text-anchor="middle">1 · GUV-Konto</text><text class="visual-label micro" x="84" y="64" text-anchor="middle">Ertrag ${esc(fmtInt(out.totalRevenue))} €</text><text class="visual-label micro" x="84" y="84" text-anchor="middle">Aufw. ${esc(fmtInt(out.totalExpense))} €</text><text class="visual-label micro" x="84" y="106" text-anchor="middle">${esc(outcomeLabel)}</text><line x1="158" y1="69" x2="186" y2="69" class="v-accent-stroke"/><polygon points="186,69 178,64 178,74" class="v-accent-solid"/><rect x="188" y="20" width="144" height="98" rx="10" class="v-panel"/><text class="visual-label micro" x="260" y="40" text-anchor="middle">2 · Eigenkapital (EK)</text><text class="visual-label micro" x="260" y="66" text-anchor="middle">AB ${esc(fmtInt(ekStart))} €</text><text class="visual-label micro" x="260" y="88" text-anchor="middle">${esc(outcomeLabel)}</text><text class="visual-label micro" x="260" y="108" text-anchor="middle">EB ${esc(fmtInt(ekEnd))} €</text><line x1="334" y1="69" x2="362" y2="69" class="v-accent-stroke"/><polygon points="362,69 354,64 354,74" class="v-accent-solid"/><rect x="364" y="20" width="144" height="98" rx="10" class="v-panel"/><text class="visual-label micro" x="436" y="40" text-anchor="middle">3 · SBK-Konto</text><text class="visual-label micro" x="436" y="68" text-anchor="middle">EK neu im Haben:</text><text class="visual-label small" x="436" y="94" text-anchor="middle">${esc(fmtInt(ekEnd))} €</text></svg>`;
      return `${svg}${table(
        ["Rechnungsschritt", "Euro"],
        [
          ["Erträge (UEFE)", out.totalRevenue],
          ["Aufwendungen (AWR–AWB)", out.totalExpense],
          [out.kind === "loss" ? "Reinverlust" : "Reingewinn / Ergebnis", out.result],
          ["Anfangsbestand EK", ekStart],
          ["Endbestand EK (→ SBK)", ekEnd],
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
