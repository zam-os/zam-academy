import {
  accrual,
  breakEven,
  calculation,
  distribute,
  fmt,
  fmtInt,
  makeOrBuy,
  monthName,
  percentOf,
  provisionRelease,
  ratios,
  toCents,
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

/** Every lab starts from these values; none of them meets the lab's goal. */
export const LABS: Record<LabKind, LabSpec> = {
  accrual: {
    description:
      "Eine Zahlung im alten Jahr deckt einen Zeitraum ab dem Ersten des Beginnmonats. Die Zeitleiste zeigt, welcher Teil wirtschaftlich ins neue Jahr gehört und abgegrenzt wird.",
    goal: "Stelle einen Fall ein, in dem genau drei Viertel des Betrags ins neue Jahr gehören.",
    controls: [
      n("amount", "Betrag (Euro, netto)", 1, 1_000_000, 1),
      n("start", "Beginnmonat (1–12)", 1, 12),
      n("months", "Laufzeit (Monate, 1–12)", 1, 12),
      {
        id: "type",
        title: "Art",
        options: [
          ["expense", "Aufwand im Voraus bezahlt"],
          ["income", "Ertrag im Voraus erhalten"],
        ],
      },
    ],
    defaults: { amount: 1200, start: 7, months: 12, type: "expense" },
  },
  provision: {
    description:
      "Zum 31. Dezember wurde eine Rückstellung in Höhe des geschätzten Nettobetrags gebildet. Im neuen Jahr kommt die Rechnung mit 19 Prozent Umsatzsteuer, zahlbar auf Ziel.",
    goal: "Finde einen Fall, in dem die Auflösung einen periodenfremden Ertrag ergibt.",
    controls: [
      n("rst", "Rückstellung (Euro)", 1, 1_000_000, 1),
      n("net", "Tatsächlicher Nettobetrag (Euro)", 1, 1_000_000, 1),
      {
        id: "purpose",
        title: "Anlass",
        options: [
          ["6160", "Verschobene Reparatur (6160 FRI)"],
          ["6770", "Laufender Prozess (6770 RBK)"],
        ],
      },
    ],
    defaults: { rst: 2000, net: 2400, purpose: "6160" },
  },
  balance: {
    description:
      "Aufbereitete Bilanz mit sieben Posten. Das kurzfristige Fremdkapital ergibt sich als Rest, damit Gesamtvermögen und Gesamtkapital gleich bleiben.",
    goal: "Erreiche eine Barliquidität von mindestens 20 % und eine Anlagendeckung II über 100 %.",
    controls: [
      n("av", "Anlagevermögen", 0, 100_000_000, 1000),
      n("vorraete", "Vorräte", 0, 100_000_000, 1000),
      n("forderungen", "Forderungen", 0, 100_000_000, 1000),
      n("fluessig", "Flüssige Mittel", 0, 100_000_000, 1000),
      n("ek", "Eigenkapital (31.12.)", 0, 100_000_000, 1000),
      n("lfk", "Langfristiges Fremdkapital", 0, 100_000_000, 1000),
      n("profit", "Jahresgewinn", -10_000_000, 10_000_000, 1000),
      n("ekStart", "Eigenkapital am 1. Januar", 0, 100_000_000, 1000),
    ],
    defaults: {
      av: 400000,
      vorraete: 60000,
      forderungen: 80000,
      fluessig: 12000,
      ek: 180000,
      lfk: 160000,
      profit: 18000,
      ekStart: 170000,
    },
  },
  bab: {
    description:
      "Die Miete wird nach Fläche auf die vier Kostenstellen verteilt; die übrigen Gemeinkosten sind schon verteilt. Aus Gemeinkosten und Einzelkosten entstehen die Zuschlagssätze für Material und Fertigung.",
    goal: "Die Fertigung bezieht eine größere Halle: Bringe den FGK-Zuschlag über 120 %, nur durch die Fläche der Fertigung.",
    controls: [
      n("rent", "Miete gesamt (Euro)", 0, 10_000_000, 100),
      n("m1", "Fläche Material (m²)", 0, 100000, 10),
      n("m2", "Fläche Fertigung (m²)", 0, 100000, 10),
      n("m3", "Fläche Verwaltung (m²)", 0, 100000, 10),
      n("m4", "Fläche Vertrieb (m²)", 0, 100000, 10),
      n("mgk", "Übrige MGK (Euro)", 0, 10_000_000, 100),
      n("fgk", "Übrige FGK (Euro)", 0, 10_000_000, 100),
      n("fm", "Fertigungsmaterial (Euro)", 0, 10_000_000, 100),
      n("fl", "Fertigungslöhne (Euro)", 0, 10_000_000, 100),
    ],
    defaults: {
      rent: 24000,
      m1: 100,
      m2: 400,
      m3: 100,
      m4: 200,
      mgk: 6000,
      fgk: 30000,
      fm: 60000,
      fl: 40000,
    },
  },
  calc: {
    description:
      "Zuschlagskalkulation eines Auftrags bis zum Listenverkaufspreis. Jeder Schritt wird auf Cent gerundet; Skonto und Rabatt werden im Hundert gerechnet.",
    goal: "Ein Kunde zahlt höchstens 1.500 Euro Listenpreis. Erreiche das nur über Gewinn, Skonto und Rabatt, mit mindestens 5 % Gewinn.",
    controls: [
      n("fm", "Fertigungsmaterial (Euro)", 0, 1_000_000, 1),
      n("mgk", "MGK (%)", 0, 1000, 0.5),
      n("fl", "Fertigungslöhne (Euro)", 0, 1_000_000, 1),
      n("fgk", "FGK (%)", 0, 1000, 0.5),
      n("sek", "Sondereinzelkosten der Fertigung (Euro)", 0, 1_000_000, 1),
      n("vwvt", "VwVtGK (%)", 0, 1000, 0.5),
      n("profit", "Gewinn (%)", 0, 1000, 0.5),
      n("discount", "Kundenskonto (%)", 0, 49, 0.5),
      n("rebate", "Kundenrabatt (%)", 0, 49, 0.5),
    ],
    defaults: {
      fm: 200,
      mgk: 10,
      fl: 300,
      fgk: 150,
      sek: 0,
      vwvt: 25,
      profit: 20,
      discount: 2,
      rebate: 10,
    },
  },
  breakeven: {
    description:
      "Erlöse und Gesamtkosten in Abhängigkeit von der Menge. Wo sich die Geraden schneiden, liegt die Gewinnschwelle. Die Kapazität begrenzt die Menge.",
    goal: "Senke die Gewinnschwelle auf höchstens die halbe Kapazität, ohne den Preis über 50 Euro zu erhöhen oder die Kapazität zu ändern.",
    controls: [
      n("price", "Nettoverkaufspreis (Euro)", 1, 100000, 0.5),
      n("kv", "Variable Stückkosten (Euro)", 0, 100000, 0.5),
      n("kf", "Fixkosten (Euro)", 0, 100_000_000, 1000),
      n("capacity", "Kapazität (Stück)", 0, 1_000_000, 100),
    ],
    defaults: { price: 50, kv: 30, kf: 60000, capacity: 5000 },
  },
  makebuy: {
    description:
      "Eigenfertigung verursacht Fixkosten und variable Stückkosten, Fremdbezug nur den Einstandspreis je Stück. Ab der kritischen Menge ist Eigenfertigung günstiger.",
    goal: "Finde bei unveränderten Kosten eine Bedarfsmenge, bei der Eigenfertigung günstiger ist als Fremdbezug.",
    controls: [
      n("kf", "Fixkosten Eigenfertigung (Euro)", 0, 100_000_000, 100),
      n("kv", "Variable Stückkosten (Euro)", 0, 100000, 0.5),
      n("ep", "Einstandspreis Fremdbezug (Euro)", 0, 100000, 0.5),
      n("x", "Bedarfsmenge (Stück)", 0, 1_000_000, 100),
    ],
    defaults: { kf: 12000, kv: 4, ep: 10, x: 1500 },
  },
};

const num = (v: Values, id: string) => Number(v[id]);
const same = (v: Values, kind: LabKind, ids: string[]) =>
  ids.every((id) => num(v, id) === Number(LABS[kind].defaults[id]));

/** Whether the learner reached the lab's goal; tests prove each goal reachable and unmet at the start. */
export function goalReached(kind: LabKind, v: Values): boolean {
  try {
    switch (kind) {
      case "accrual": {
        const r = accrual(num(v, "amount"), num(v, "start"), num(v, "months"));
        return r.newMonths * 4 === num(v, "months") * 3;
      }
      case "provision":
        return provisionRelease(num(v, "rst"), num(v, "net")).kind === "income";
      case "balance": {
        const b = condensed(v),
          r = ratios(b, num(v, "profit"), num(v, "ekStart"));
        return r.cash >= 20 && r.coverage2 > 100;
      }
      case "bab":
        return (
          same(v, kind, ["rent", "m1", "m3", "m4", "mgk", "fgk", "fm", "fl"]) && babRates(v).fgk > 120
        );
      case "calc":
        return (
          same(v, kind, ["fm", "mgk", "fl", "fgk", "sek", "vwvt"]) &&
          num(v, "profit") >= 5 &&
          calculation(calcInput(v)).lvp <= 1500
        );
      case "breakeven":
        return (
          num(v, "price") <= 50 &&
          same(v, kind, ["capacity"]) &&
          breakEven(num(v, "kf"), num(v, "price"), num(v, "kv")).quantity * 2 <= num(v, "capacity")
        );
      case "makebuy": {
        const r = makeOrBuy(num(v, "kf"), num(v, "kv"), num(v, "ep"), num(v, "x"));
        return same(v, kind, ["kf", "kv", "ep"]) && r.make < r.buy;
      }
    }
  } catch {
    return false;
  }
}

function condensed(v: Values) {
  const total = ["av", "vorraete", "forderungen", "fluessig"].reduce((s, id) => s + num(v, id), 0);
  const kfk = total - num(v, "ek") - num(v, "lfk");
  if (kfk <= 0)
    throw new Error(
      "Eigenkapital und langfristiges Fremdkapital übersteigen das Gesamtvermögen. Prüfe die Eingaben.",
    );
  return {
    av: num(v, "av"),
    vorraete: num(v, "vorraete"),
    forderungen: num(v, "forderungen"),
    fluessig: num(v, "fluessig"),
    ek: num(v, "ek"),
    lfk: num(v, "lfk"),
    kfk,
  };
}
function babRates(v: Values) {
  const rent = distribute(num(v, "rent"), [num(v, "m1"), num(v, "m2"), num(v, "m3"), num(v, "m4")]);
  const mgk = num(v, "mgk") + rent[0],
    fgk = num(v, "fgk") + rent[1];
  return {
    rent,
    mgkTotal: mgk,
    fgkTotal: fgk,
    mgk: percentOf(toCents(mgk), toCents(num(v, "fm"))),
    fgk: percentOf(toCents(fgk), toCents(num(v, "fl"))),
  };
}
const calcInput = (v: Values) => ({
  fm: num(v, "fm"),
  mgk: num(v, "mgk"),
  fl: num(v, "fl"),
  fgk: num(v, "fgk"),
  sek: num(v, "sek"),
  vwvt: num(v, "vwvt"),
  profit: num(v, "profit"),
  discount: num(v, "discount"),
  rebate: num(v, "rebate"),
});

const table = (titles: string[], rows: (number | string)[][]) =>
  `<div class="table-scroll"><table><thead><tr>${titles.map((x) => `<th scope="col">${esc(x)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((x) => `<td>${typeof x === "number" ? fmt(x) : esc(x)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const bookingLine = (debit: Array<[string, number]>, credit: Array<[string, number]>) =>
  `<p class="booking-line">${debit.map(([a, x]) => `${esc(a)} ${fmt(x)}`).join(" · ")} <strong>an</strong> ${credit.map(([a, x]) => `${esc(a)} ${fmt(x)}`).join(" · ")}</p>`;

/** A small line chart: costs and revenues over the quantity. */
function chart(
  maxX: number,
  lines: Array<{ label: string; cls: string; at: (x: number) => number }>,
  marker?: { x: number; label: string },
) {
  const w = 560,
    h = 260,
    pad = 44,
    maxY = Math.max(1, ...lines.map((l) => Math.max(l.at(0), l.at(maxX))));
  const sx = (x: number) => pad + (x / maxX) * (w - pad - 12),
    sy = (y: number) => h - pad + 8 - (Math.max(0, y) / maxY) * (h - pad - 4);
  const paths = lines
    .map(
      (l) =>
        `<line class="${l.cls}" x1="${sx(0)}" y1="${sy(l.at(0))}" x2="${sx(maxX)}" y2="${sy(l.at(maxX))}"/><text class="chart-label ${l.cls}" x="${sx(maxX) - 4}" y="${Math.max(16, sy(l.at(maxX)) - 6)}" text-anchor="end">${esc(l.label)}</text>`,
    )
    .join("");
  const mark =
    marker && Number.isFinite(marker.x) && marker.x <= maxX
      ? `<line class="chart-marker" x1="${sx(marker.x)}" y1="${sy(0)}" x2="${sx(marker.x)}" y2="12"/><text class="chart-label" x="${sx(marker.x) + 5}" y="24">${esc(marker.label)}</text>`
      : "";
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Kosten und Erlöse nach Menge"><line class="axis" x1="${pad}" y1="${sy(0)}" x2="${w - 8}" y2="${sy(0)}"/><line class="axis" x1="${pad}" y1="${sy(0)}" x2="${pad}" y2="8"/><text class="chart-label" x="${w - 8}" y="${h - 6}" text-anchor="end">Menge (Stück) bis ${fmtInt(maxX)}</text><text class="chart-label" x="${pad + 4}" y="14">Euro</text>${paths}${mark}</svg>`;
}

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
    case "accrual": {
      const amount = num(v, "amount"),
        start = num(v, "start"),
        months = num(v, "months"),
        r = accrual(amount, start, months),
        expense = v.type === "expense";
      const cells = Array.from({ length: months }, (_, i) => {
        const m = ((start - 1 + i) % 12) + 1;
        return `<span class="${i < r.oldMonths ? "old" : "new"}" title="${esc(monthName(m))}">${esc(monthName(m).slice(0, 3))}</span>`;
      }).join("");
      const account = expense ? "Aufwandskonto" : "Ertragskonto";
      return `<div class="timeline" role="img" aria-label="${r.oldMonths} Monate im alten, ${r.newMonths} Monate im neuen Jahr">${cells}</div><p class="small">Grün: altes Jahr bis 31. Dezember · Blau: neues Jahr</p>${table(
        ["", "Monate", "Euro"],
        [
          ["Altes Jahr", String(r.oldMonths), r.oldPart],
          ["Neues Jahr (abgrenzen)", String(r.newMonths), r.newPart],
        ],
      )}${
        r.newPart > 0
          ? `<p><strong>31. Dezember:</strong></p>${expense ? bookingLine([["2900 ARA", r.newPart]], [[account, r.newPart]]) : bookingLine([[account, r.newPart]], [["4900 PRA", r.newPart]])}<p><strong>1. Januar:</strong></p>${expense ? bookingLine([[account, r.newPart]], [["2900 ARA", r.newPart]]) : bookingLine([["4900 PRA", r.newPart]], [[account, r.newPart]])}`
          : "<p>Der ganze Betrag gehört ins alte Jahr. Es wird nichts abgegrenzt.</p>"
      }`;
    }
    case "provision": {
      const rst = num(v, "rst"),
        net = num(v, "net"),
        r = provisionRelease(rst, net),
        purpose = v.purpose === "6770" ? "6770 RBK" : "6160 FRI";
      const debit: Array<[string, number]> = [["3900 RST", rst]];
      const credit: Array<[string, number]> = [["4400 VE", r.gross]];
      if (r.kind === "expense") debit.push(["6990 PFAW", r.difference]);
      debit.push(["2600 VORST", r.vat]);
      if (r.kind === "income") credit.push(["5490 PFE", r.difference]);
      const text =
        r.kind === "equal"
          ? "Die Schätzung war genau. Die Auflösung ist erfolgsneutral."
          : r.kind === "income"
            ? "Es wurde zu viel zurückgestellt. Der Unterschied ist ein periodenfremder Ertrag im neuen Jahr."
            : "Es wurde zu wenig zurückgestellt. Der Unterschied ist ein periodenfremder Aufwand im neuen Jahr.";
      return `<p><strong>31. Dezember, Bildung:</strong></p>${bookingLine([[purpose, rst]], [["3900 RST", rst]])}<p><strong>Rechnungseingang im neuen Jahr:</strong></p>${bookingLine(debit, credit)}<p class="result">${text}</p>`;
    }
    case "balance": {
      const b = condensed(v),
        r = ratios(b, num(v, "profit"), num(v, "ekStart")),
        total = b.av + b.vorraete + b.forderungen + b.fluessig;
      const flag = (ok: boolean) => (ok ? "erreicht" : "nicht erreicht");
      return `${table(
        ["Aktiva", "Euro", "Passiva", "Euro"],
        [
          ["Anlagevermögen", b.av, "Eigenkapital", b.ek],
          ["Vorräte", b.vorraete, "Langfristiges Fremdkapital", b.lfk],
          ["Forderungen", b.forderungen, "Kurzfristiges Fremdkapital", b.kfk],
          ["Flüssige Mittel", b.fluessig, "", ""],
          ["Gesamtvermögen", total, "Gesamtkapital", total],
        ],
      )}${table(
        ["Kennzahl", "Wert (%)", "Richtwert"],
        [
          ["Barliquidität", r.cash, `20 % · ${flag(r.cash >= 20)}`],
          ["Einzugsliquidität", r.quick, `100 % · ${flag(r.quick >= 100)}`],
          ["Anlagendeckung I", r.coverage1, `70 bis 100 % · ${flag(r.coverage1 >= 70)}`],
          ["Anlagendeckung II", r.coverage2, `über 100 % · ${flag(r.coverage2 > 100)}`],
          ["Eigenkapitalrentabilität", r.roe, `10 bis 20 % · ${flag(r.roe >= 10)}`],
        ],
      )}<p class="small">Richtwerte sind Orientierungen aus dem Unterricht, keine gesetzlichen Grenzen. Erst der Zeit- oder Branchenvergleich zeigt, ob ein Wert gut ist.</p>`;
    }
    case "bab": {
      const r = babRates(v),
        areas = ["m1", "m2", "m3", "m4"].map((id) => num(v, id));
      return `${table(
        ["", "Material", "Fertigung", "Verwaltung", "Vertrieb"],
        [
          ["Fläche (m²)", ...areas.map((a) => fmtInt(a))],
          ["Miete", ...r.rent],
          ["Übrige Gemeinkosten", num(v, "mgk"), num(v, "fgk"), "", ""],
          ["Gemeinkosten", r.mgkTotal, r.fgkTotal, r.rent[2], r.rent[3]],
          ["Zuschlagsgrundlage", num(v, "fm"), num(v, "fl"), "HKU", "HKU"],
        ],
      )}<p class="result">MGK-Zuschlag: <strong>${fmt(r.mgk)} %</strong> · FGK-Zuschlag: <strong>${fmt(r.fgk)} %</strong></p><p class="small">Verwaltung und Vertrieb beziehen ihre Zuschläge auf die Herstellkosten des Umsatzes; sie werden hier nicht berechnet. Ein Rundungsrest der Mietverteilung fällt auf den Vertrieb.</p>`;
    }
    case "calc": {
      const r = calculation(calcInput(v));
      return table(
        ["Kalkulationsschema", "Euro"],
        [
          ["Fertigungsmaterial (FM)", r.fm],
          [`+ MGK ${fmt(num(v, "mgk"))} %`, r.mgk],
          ["= Materialkosten (MK)", r.mk],
          ["Fertigungslöhne (FL)", r.fl],
          [`+ FGK ${fmt(num(v, "fgk"))} %`, r.fgk],
          ["+ Sondereinzelkosten der Fertigung", r.sek],
          ["= Fertigungskosten (FK)", r.fk],
          ["= Herstellkosten (MK + FK)", r.hk],
          [`+ VwVtGK ${fmt(num(v, "vwvt"))} %`, r.vwvt],
          ["= Selbstkosten (SK)", r.sk],
          [`+ Gewinn ${fmt(num(v, "profit"))} %`, r.profit],
          ["= Barverkaufspreis (BVP)", r.bvp],
          [`+ Kundenskonto ${fmt(num(v, "discount"))} % (im Hundert)`, r.discount],
          ["= Zielverkaufspreis (ZVP)", r.zvp],
          [`+ Kundenrabatt ${fmt(num(v, "rebate"))} % (im Hundert)`, r.rebate],
          ["= Listenverkaufspreis (netto)", r.lvp],
        ],
      );
    }
    case "breakeven": {
      const p = num(v, "price"),
        kv = num(v, "kv"),
        kf = num(v, "kf"),
        cap = num(v, "capacity"),
        be = breakEven(kf, p, kv);
      const result = (p - kv) * cap - kf;
      return `${chart(
        cap,
        [
          { label: "Erlöse", cls: "line-revenue", at: (x) => p * x },
          { label: "Gesamtkosten", cls: "line-cost", at: (x) => kf + kv * x },
          { label: "Fixkosten", cls: "line-fixed", at: () => kf },
        ],
        Number.isFinite(be.quantity) ? { x: be.quantity, label: `${fmtInt(be.quantity)} Stück` } : undefined,
      )}<p class="result">Stückdeckungsbeitrag: <strong>${fmt(be.db)} Euro</strong> · Gewinnschwelle: <strong>${Number.isFinite(be.quantity) ? `${fmtInt(be.quantity)} Stück` : "keine, der Preis deckt die variablen Kosten nicht"}</strong></p><p>Betriebsergebnis bei voller Kapazität: ${fmt(result)} Euro.${Number.isFinite(be.quantity) && be.quantity > cap ? " Die Gewinnschwelle liegt über der Kapazität: Mit dieser Anlage ist kein Gewinn möglich." : ""}</p>`;
    }
    case "makebuy": {
      const kf = num(v, "kf"),
        kv = num(v, "kv"),
        ep = num(v, "ep"),
        x = num(v, "x"),
        r = makeOrBuy(kf, kv, ep, x),
        maxX = Math.max(x, Number.isFinite(r.critical) ? Math.ceil(r.critical * 1.5) : x, 100);
      return `${chart(
        maxX,
        [
          { label: "Eigenfertigung", cls: "line-cost", at: (q) => kf + kv * q },
          { label: "Fremdbezug", cls: "line-revenue", at: (q) => ep * q },
        ],
        Number.isFinite(r.critical) ? { x: r.critical, label: `kritische Menge ${Number.isInteger(r.critical) ? fmtInt(r.critical) : fmt(r.critical)} Stück` } : undefined,
      )}${table(["", "Euro"], [["Kosten Eigenfertigung", r.make], ["Kosten Fremdbezug", r.buy]])}<p class="result">${r.make < r.buy ? "Eigenfertigung ist bei dieser Menge günstiger." : r.make > r.buy ? "Fremdbezug ist bei dieser Menge günstiger." : "Beide Möglichkeiten kosten gleich viel."}</p><p class="small">Die Kostenrechnung ist nur ein Teil der Entscheidung: Qualität, Abhängigkeit vom Lieferer, Know-how und Arbeitsplätze gehören ebenso dazu.</p>`;
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
