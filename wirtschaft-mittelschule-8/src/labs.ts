import { STEP_ICONS } from "./figures/draw";
import type { LabKind } from "./model/types";
import {
  careerProfileMatch,
  checkInternship,
  circularFlow,
  fmt,
  fmtInt,
  MINIMUM_WAGE,
  netPay,
  noiseExposure,
  productionCompare,
  projectSchedule,
  shopGuV,
  wageForms,
} from "./wib";
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
const yesNo = (id: string, title: string): Control => ({
  id,
  title,
  options: [
    ["nein", "nein"],
    ["ja", "ja"],
  ],
});

/** Every lab starts from these values; none of them meets the lab's goal. */
export const LABS: Record<LabKind, LabSpec> = {
  projectPlan: {
    description:
      "Plane das Basarprojekt deiner Klasse: Arbeitspakete in Stunden, ein Zeitpuffer und die Projektstunden pro Woche bestimmen, ob ihr bis zum Basar fertig werdet.",
    goal: "Plane bei unveränderten Arbeitspaketen (6, 14 und 4 Std.) und dem Basar in 8 Wochen mindestens 20 % Zeitpuffer ein, sodass der Plan trotzdem rechtzeitig fertig ist.",
    controls: [
      n("plan", "Planung (Std.)", 2, 12, 1),
      n("exec", "Durchführung (Std.)", 6, 30, 1),
      n("close", "Präsentation und Reflexion (Std.)", 2, 8, 1),
      n("buffer", "Zeitpuffer (%)", 0, 50, 5),
      n("perWeek", "Projektstunden pro Woche", 1, 6, 1),
      n("weeks", "Wochen bis zum Basar", 4, 16, 1),
    ],
    defaults: { plan: 6, exec: 14, close: 4, buffer: 0, perWeek: 2, weeks: 8 },
  },
  careerMatch: {
    description:
      "Vergleiche ein Kompetenzprofil (1 bis 6 Punkte je Bereich) mit den Anforderungsprofilen von drei Ausbildungsberufen. Die Passung sinkt mit jedem Punkt Abstand um 5 %.",
    goal: "Finde ein Profil, das zu mindestens einem der drei Ausbildungsberufe eine Passung von mindestens 90 % erreicht.",
    controls: [
      n("tech", "Technik und Handwerk (1–6)", 1, 6, 1),
      n("social", "Kommunikation und Kundenkontakt (1–6)", 1, 6, 1),
      n("care", "Sorgfalt und Genauigkeit (1–6)", 1, 6, 1),
      n("logic", "Rechnen und Logik (1–6)", 1, 6, 1),
    ],
    defaults: { tech: 2, social: 2, care: 3, logic: 6 },
  },
  shopGuV: {
    description:
      "Euer Punschstand auf dem Weihnachtsmarkt: Ein höherer Preis bringt mehr je Becher, aber weniger Kunden; Werbung bringt Kunden, kostet aber Geld. Die Gewinn- und Verlustrechnung zeigt das Ergebnis.",
    goal: "Erziele bei unverändertem Wareneinsatz (1,20 € je Becher) und unveränderter Standmiete (40 €) einen Gewinn von mindestens 80,00 €.",
    controls: [
      n("price", "Verkaufspreis je Becher (Euro)", 1, 4, 0.1),
      n("advertising", "Werbung (Euro)", 0, 60, 10),
      n("unitCost", "Wareneinsatz je Becher (Euro)", 0.8, 2, 0.1),
      n("rent", "Standmiete (Euro)", 0, 80, 10),
    ],
    defaults: { price: 1.6, advertising: 0, unitCost: 1.2, rent: 40 },
  },
  circularFlow: {
    description:
      "Ein einfacher Wirtschaftskreislauf: Die Beschäftigten eines Betriebs erhalten Einkommen, sparen einen Teil und geben den Rest als Konsumausgaben aus, die wieder zu Einnahmen der Unternehmen werden.",
    goal: "Bei unveränderter Zahl der Beschäftigten (40) sollen die Haushalte mindestens 10 % sparen und die Konsumausgaben trotzdem mindestens 90.000 € erreichen.",
    controls: [
      n("workers", "Beschäftigte", 10, 80, 5),
      n("wage", "Monatseinkommen je Beschäftigten (Euro)", 1500, 3500, 250),
      n("savings", "Sparquote (%)", 0, 30, 5),
    ],
    defaults: { workers: 40, wage: 2250, savings: 20 },
  },
  wageForms: {
    description:
      "Vergleiche Zeitlohn und Akkordlohn für einen Arbeitstag in der Montage. Im Minutenakkord bekommt man je Stück die Vorgabezeit bezahlt, die sich aus der Normalleistung ergibt.",
    goal: "Erreiche bei unverändertem Akkordrichtsatz (18 €), unveränderter Normalleistung (12 Stück/Std.) und 8 Stunden einen Akkordlohn, der mindestens 10 % über dem Zeitlohn liegt.",
    controls: [
      n("rate", "Akkordrichtsatz bzw. Stundenlohn (Euro)", 12, 30, 1),
      n("hours", "Arbeitsstunden", 4, 10, 1),
      n("normal", "Normalleistung (Stück je Std.)", 6, 20, 1),
      n("actual", "Tatsächliche Leistung (Stück je Std.)", 4, 24, 1),
    ],
    defaults: { rate: 18, hours: 8, normal: 12, actual: 10 },
  },
  netPay: {
    description:
      "Prüfe eine vereinfachte Lohnabrechnung: Brutto aus Stunden und Stundenlohn, Lohnsteuer laut Tabelle, Kirchensteuer (8 % der Lohnsteuer) und Arbeitnehmeranteil zur Sozialversicherung. Im Modell bleibt die Lohnsteuer fest; in Wirklichkeit hängt sie vom Brutto ab.",
    goal: "Bei 160 Stunden, 140 € Lohnsteuer, keiner Kirchensteuer und 21 % Sozialversicherung soll der Stundenlohn mindestens den Mindestlohn erreichen und das Netto mindestens 1.700,00 € betragen.",
    controls: [
      n("hourly", "Stundenlohn (Euro)", 10, 25, 0.1),
      n("hours", "Arbeitsstunden im Monat", 40, 180, 4),
      n("tax", "Lohnsteuer laut Tabelle (Euro)", 0, 500, 10),
      yesNo("church", "Kirchenmitglied"),
      n("sv", "Arbeitnehmeranteil Sozialversicherung (%)", 15, 25, 0.5),
    ],
    defaults: { hourly: 12.5, hours: 160, tax: 140, church: "nein", sv: 21 },
  },
  internshipCheck: {
    description:
      "Prüfe den Wochenplan eines Betriebspraktikums während der Vollzeitschulpflicht gegen das Jugendarbeitsschutzgesetz: Uhrzeit, Pausen, Tages- und Wochenstunden, Schichtzeit und Arbeitstage.",
    goal: "Stelle einen zulässigen Plan mit genau 7 Stunden Arbeit am Tag und 35 Stunden in der Woche ein (§§ 5, 7, 11, 12, 14, 15 JArbSchG).",
    controls: [
      n("start", "Arbeitsbeginn (Uhr)", 5, 10, 0.5),
      n("end", "Arbeitsende (Uhr)", 12, 21, 0.5),
      n("pause", "Pausen insgesamt (Min.)", 0, 90, 15),
      n("days", "Arbeitstage pro Woche", 1, 6, 1),
    ],
    defaults: { start: 7, end: 16, pause: 30, days: 6 },
  },
  noiseProtection: {
    description:
      "An einer Kreissäge ist es laut. Prüfe vereinfacht, welche Auslösewerte erreicht sind und wie technische und persönliche Schutzmaßnahmen den Pegel am Arbeitsplatz und am Ohr senken.",
    goal: "Senke bei unverändertem Maschinenpegel (95 dB(A)) den Pegel am Ohr unter 80 dB(A) und nutze dabei zuerst die technische Maßnahme Schallschutzhaube (§ 4 ArbSchG).",
    controls: [
      n("machine", "Maschinenpegel (dB(A))", 70, 105, 1),
      yesNo("enclosure", "Schallschutzhaube (senkt um 10 dB)"),
      yesNo("worn", "Gehörschutz getragen"),
      n("attenuation", "Dämmwert des Gehörschutzes (dB)", 5, 35, 5),
    ],
    defaults: { machine: 95, enclosure: "nein", worn: "nein", attenuation: 20 },
  },
  productionCompare: {
    description:
      "Handarbeit oder Schweißroboter? Vergleiche Jahreskosten und Stückkosten. Die Anschaffung des Roboters wird gleichmäßig auf seine Nutzungsdauer verteilt.",
    goal: "Finde bei unveränderten Kosten (30 € Lohn je Std., 10 Teile je Std. von Hand, 120.000 € Roboter für 8 Jahre, 60 Teile je Std., 36 € je Std. Bedienung) eine Jahresmenge, bei der der Roboter günstiger ist.",
    controls: [
      n("qty", "Teile pro Jahr", 1000, 20000, 1000),
      n("manual", "Teile je Std. von Hand", 4, 20, 1),
      n("wage", "Lohnkosten je Std. (Euro)", 20, 50, 1),
      n("invest", "Anschaffung Roboter (Euro)", 40000, 200000, 10000),
      n("years", "Nutzungsdauer (Jahre)", 4, 12, 1),
      n("machine", "Teile je Std. mit Roboter", 20, 120, 10),
      n("operator", "Bedienung je Std. (Euro)", 20, 60, 1),
    ],
    defaults: { qty: 4000, manual: 10, wage: 30, invest: 120000, years: 8, machine: 60, operator: 36 },
  },
};

const num = (v: Values, id: string) => Number(v[id]);
const yes = (v: Values, id: string) => v[id] === "ja";
const same = (v: Values, kind: LabKind, ids: string[]) =>
  ids.every((id) => String(v[id]) === String(LABS[kind].defaults[id]));

/** Whether the learner reached the lab's goal; tests prove each goal reachable and unmet at the start. */
export function goalReached(kind: LabKind, v: Values): boolean {
  try {
    switch (kind) {
      case "projectPlan": {
        const r = projectSchedule(num(v, "plan"), num(v, "exec"), num(v, "close"), num(v, "buffer"), num(v, "perWeek"), num(v, "weeks"));
        return same(v, kind, ["plan", "exec", "close", "weeks"]) && num(v, "buffer") >= 20 && r.fits;
      }
      case "careerMatch": {
        const m = careerProfileMatch(num(v, "tech"), num(v, "social"), num(v, "care"), num(v, "logic"));
        return (m[0]?.fitPct ?? 0) >= 90;
      }
      case "shopGuV": {
        const r = shopGuV(num(v, "price"), num(v, "advertising"), num(v, "unitCost"), num(v, "rent"));
        return same(v, kind, ["unitCost", "rent"]) && r.result >= 80;
      }
      case "circularFlow": {
        const r = circularFlow(num(v, "workers"), num(v, "wage"), num(v, "savings"));
        return same(v, kind, ["workers"]) && num(v, "savings") >= 10 && r.consumption >= 90000;
      }
      case "wageForms": {
        const r = wageForms(num(v, "rate"), num(v, "hours"), num(v, "normal"), num(v, "actual"));
        return same(v, kind, ["rate", "hours", "normal"]) && r.pieceWage >= r.timeWage * 1.1;
      }
      case "netPay": {
        const r = netPay(num(v, "hourly"), num(v, "hours"), num(v, "tax"), yes(v, "church"), num(v, "sv"));
        return same(v, kind, ["hours", "tax", "church", "sv"]) && r.minimumWageOk && r.net >= 1700;
      }
      case "internshipCheck": {
        const r = checkInternship(num(v, "start"), num(v, "end"), num(v, "pause"), num(v, "days"));
        return r.allowed && r.workHours === 7 && r.weeklyHours === 35;
      }
      case "noiseProtection": {
        const r = noiseExposure(num(v, "machine"), yes(v, "enclosure"), yes(v, "worn"), num(v, "attenuation"));
        return same(v, kind, ["machine"]) && yes(v, "enclosure") && r.earDb < 80;
      }
      case "productionCompare": {
        const r = productionCompare(num(v, "qty"), num(v, "manual"), num(v, "wage"), num(v, "invest"), num(v, "years"), num(v, "machine"), num(v, "operator"));
        return same(v, kind, ["manual", "wage", "invest", "years", "machine", "operator"]) && r.machineCheaper;
      }
    }
  } catch {
    return false;
  }
}

const table = (titles: string[], rows: (number | string)[][]) =>
  `<div class="table-scroll"><table><thead><tr>${titles.map((x) => `<th scope="col">${esc(x)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((x) => `<td>${typeof x === "number" ? fmt(x) : esc(x)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

function controlHtml(c: Control, value: number | string) {
  if (c.options)
    return `<label>${esc(c.title)}<select id="lab-${c.id}">${c.options.map(([v, t]) => `<option value="${v}" ${v === value ? "selected" : ""}>${esc(t)}</option>`).join("")}</select></label>`;
  return `<label>${esc(c.title)}<input id="lab-${c.id}" type="number" inputmode="decimal" value="${value}" min="${c.min}" max="${c.max}" step="${c.step}"></label>`;
}

export function labHtml(kind: LabKind): string {
  const spec = LABS[kind];
  return `<section class="panel lab"><div class="eyebrow">${STEP_ICONS.lab}<span>Was ändert sich, wenn …?</span></div><h2>Zusammenhänge ausprobieren</h2><p>${esc(spec.description)}</p><p class="goal" id="lab-goal"><span aria-hidden="true">○</span> Ziel: ${esc(spec.goal)}</p><form id="lab-form"><div class="controls">${spec.controls.map((c) => controlHtml(c, spec.defaults[c.id])).join("")}</div><div class="actions"><button type="submit">Modell aktualisieren</button><button type="button" id="lab-reset" class="quiet">Startwerte</button></div></form><div id="lab-result" aria-live="polite"></div></section>`;
}

const r1 = (val: number) => Math.round(val * 10) / 10;
const clock = (h: number) => `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;
const clampW = (val: number) => Math.max(0, Math.min(300, r1(val)));
const t = (x: number, y: number, text: string, anchor: "start" | "middle" | "end" = "start", cls = "micro") =>
  `<text class="visual-label ${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${esc(text)}</text>`;
const bar = (x: number, y: number, w: number, h: number, cls: string) =>
  `<rect x="${r1(x)}" y="${y}" width="${clampW(w)}" height="${h}" rx="4" class="${cls}"/>`;
const svg = (h: number, label: string, body: string) =>
  `<svg class="chart lab-svg" viewBox="0 0 540 ${h}" role="img" aria-label="${esc(label)}">${body}</svg>`;

export function renderResult(kind: LabKind, v: Values): string {
  switch (kind) {
    case "projectPlan": {
      const r = projectSchedule(num(v, "plan"), num(v, "exec"), num(v, "close"), num(v, "buffer"), num(v, "perWeek"), num(v, "weeks"));
      const weeks = num(v, "weeks");
      const shown = Number.isFinite(r.weeksNeeded) ? r.weeksNeeded : weeks;
      const maxW = Math.max(1, weeks, shown);
      const unit = 380 / maxW;
      const segments: Array<[string, number, string]> = [
        ["Planung", num(v, "plan"), "v-teal"],
        ["Durchführung", num(v, "exec"), "v-blue"],
        ["Abschluss", num(v, "close"), "v-orange"],
        ["Puffer", r.bufferHours, "v-gold"],
      ];
      const perWeek = Math.max(1, num(v, "perWeek"));
      let x = 120;
      const blocks = segments
        .map(([name, hours, cls]) => {
          const w = (hours / perWeek) * unit;
          const out = `${bar(x, 30, w, 26, cls)}${w > 46 ? t(x + w / 2, 47, name, "middle") : ""}`;
          x += Math.min(300, w);
          return out;
        })
        .join("");
      const deadline = r1(120 + weeks * unit);
      const body = `${t(112, 47, "Zeitplan", "end")}${blocks}<line x1="${deadline}" y1="20" x2="${deadline}" y2="70" class="v-outline-thick"/>${t(deadline, 86, `Basar: Woche ${weeks}`, "middle")}${t(120, 112, `Benötigt: ${Number.isFinite(r.weeksNeeded) ? `${fmtInt(r.weeksNeeded)} Wochen` : "nicht planbar"} · Gesamtzeit ${fmt(r.totalHours)} Std. (davon Puffer ${fmt(r.bufferHours)} Std.)`)}`;
      return `${svg(124, `Projektzeitplan: ${fmt(r.totalHours)} Stunden in ${fmtInt(shown)} Wochen`, body)}${table(
        ["Kennzahl", "Wert"],
        [
          ["Arbeitszeit ohne Puffer", `${fmt(r.workHours)} Std.`],
          ["Zeitpuffer", `${fmt(r.bufferHours)} Std.`],
          ["Gesamtzeit", `${fmt(r.totalHours)} Std.`],
          ["Benötigte Wochen", Number.isFinite(r.weeksNeeded) ? `${fmtInt(r.weeksNeeded)} Wochen` : "nicht planbar"],
          ["Wochen bis zum Basar", `${fmtInt(weeks)} Wochen`],
        ],
      )}<p class="result">${r.fits ? `Der Plan hält: ${fmtInt(r.spareWeeks)} Woche(n) Reserve bis zum Basar.` : "Der Plan hält nicht: mehr Projektstunden pro Woche einplanen oder Arbeitspakete verkleinern."}</p>`;
    }

    case "careerMatch": {
      const m = careerProfileMatch(num(v, "tech"), num(v, "social"), num(v, "care"), num(v, "logic"));
      const body = m
        .map((c, i) => {
          const y = 8 + i * 42;
          const cls = c.fitPct >= 90 ? "v-green" : c.fitPct >= 70 ? "v-gold" : "v-coral";
          return `${t(20, y + 12, `${c.name} (${c.body})`)}${bar(20, y + 18, 300, 18, "v-soft-fill")}${bar(20, y + 18, (c.fitPct / 100) * 300, 18, cls)}${t(330, y + 32, `${fmtInt(c.fitPct)} %`)}`;
        })
        .join("");
      return `${svg(136, `Profilvergleich: beste Passung ${fmtInt(m[0].fitPct)} %`, body)}${table(
        ["Ausbildungsberuf", "Anforderungen (T/K/S/R)", "Abstand", "Passung"],
        m.map((c) => [c.name, c.weights.join(" / "), `${c.distance} Punkte`, `${fmt(c.fitPct)} %`]),
      )}<p class="result">Beste Passung: <strong>${esc(m[0].name)}</strong> mit ${fmt(m[0].fitPct)} %. Das Modell ersetzt keine Entscheidung; prüfe die Anforderungen in BERUFENET und im Praktikum.</p>`;
    }

    case "shopGuV": {
      const r = shopGuV(num(v, "price"), num(v, "advertising"), num(v, "unitCost"), num(v, "rent"));
      const maxVal = Math.max(1, r.revenue, r.expenses);
      const s = 300 / maxVal;
      const wGoods = r.goodsCost * s;
      const wRent = r.standRent * s;
      const body = `${t(110, 40, "Erträge", "end")}${bar(118, 24, r.revenue * s, 24, "v-green")}${t(124 + clampW(r.revenue * s), 40, `${fmt(r.revenue)} €`)}${t(110, 80, "Aufwendungen", "end")}${bar(118, 64, wGoods, 24, "v-orange")}${bar(118 + clampW(wGoods), 64, wRent, 24, "v-coral")}${bar(118 + clampW(wGoods) + clampW(wRent), 64, r.advertising * s, 24, "v-purple")}${t(124 + Math.min(300, clampW(wGoods) + clampW(wRent) + clampW(r.advertising * s)), 80, `${fmt(r.expenses)} €`)}${t(118, 112, `${fmtInt(r.sold)} Becher verkauft · ${r.result >= 0 ? "Gewinn" : "Verlust"}: ${fmt(Math.abs(r.result))} €`)}`;
      return `${svg(124, `GuV des Marktstands: Erträge ${fmt(r.revenue)} €, Aufwendungen ${fmt(r.expenses)} €`, body)}${table(
        ["Aufwendungen", "Euro", "Erträge", "Euro"],
        [
          ["Wareneinsatz", fmt(r.goodsCost), "Umsatzerlöse", fmt(r.revenue)],
          ["Standmiete", fmt(r.standRent), "", ""],
          ["Werbung", fmt(r.advertising), "", ""],
          [r.result >= 0 ? "Gewinn" : "", r.result >= 0 ? fmt(r.result) : "", r.result < 0 ? "Verlust" : "", r.result < 0 ? fmt(-r.result) : ""],
        ],
      )}<p class="result">${r.result >= 0 ? `Gewinn: ${fmt(r.result)} Euro.` : `Verlust: ${fmt(-r.result)} Euro.`} Verkauft werden im Modell 200 − 50 · Preis + Werbung (in Euro) Becher.</p>`;
    }

    case "circularFlow": {
      const r = circularFlow(num(v, "workers"), num(v, "wage"), num(v, "savings"));
      const k = (x: number) => `${fmtInt(x)} €`;
      const body = `<rect x="20" y="40" width="140" height="70" rx="12" class="v-blue-fill"/>${t(90, 70, "Haushalte", "middle", "small")}${t(90, 90, `${fmtInt(num(v, "workers"))} Beschäftigte`, "middle")}<rect x="380" y="40" width="140" height="70" rx="12" class="v-orange-fill"/>${t(450, 70, "Unternehmen", "middle", "small")}<g class="v-arrow"><line x1="380" y1="52" x2="168" y2="52"/><polygon class="v-arrow-head" points="160,52 170,47 170,57"/></g>${t(270, 46, `Einkommen ${k(r.income)}`, "middle")}<g class="v-arrow"><line x1="160" y1="98" x2="372" y2="98"/><polygon class="v-arrow-head" points="380,98 370,93 370,103"/></g>${t(270, 116, `Konsumausgaben ${k(r.consumption)}`, "middle")}<rect x="215" y="134" width="110" height="30" rx="8" class="v-gold-fill"/>${t(270, 154, `Sparen ${k(r.saving)}`, "middle")}<line x1="90" y1="110" x2="215" y2="149" class="v-outline"/>`;
      return `${svg(176, `Wirtschaftskreislauf: Einkommen ${k(r.income)}, Konsum ${k(r.consumption)}, Sparen ${k(r.saving)}`, body)}${table(
        ["Strom", "Euro pro Monat"],
        [
          ["Einkommen (Unternehmen → Haushalte)", fmtInt(r.income)],
          ["Ersparnis der Haushalte", fmtInt(r.saving)],
          ["Konsumausgaben (Haushalte → Unternehmen)", fmtInt(r.consumption)],
        ],
      )}<p class="result">Von ${k(r.income)} Einkommen fließen ${k(r.consumption)} als Konsumausgaben zurück; ${k(r.saving)} werden gespart und stehen über Banken für Kredite bereit.</p>`;
    }

    case "wageForms": {
      const r = wageForms(num(v, "rate"), num(v, "hours"), num(v, "normal"), num(v, "actual"));
      const maxVal = Math.max(1, r.timeWage, r.pieceWage);
      const s = 300 / maxVal;
      const body = `${t(110, 40, "Zeitlohn", "end")}${bar(118, 24, r.timeWage * s, 24, "v-blue")}${t(124 + clampW(r.timeWage * s), 40, `${fmt(r.timeWage)} €`)}${t(110, 80, "Akkordlohn", "end")}${bar(118, 64, r.pieceWage * s, 24, r.pieceWage >= r.timeWage ? "v-green" : "v-coral")}${t(124 + clampW(r.pieceWage * s), 80, `${fmt(r.pieceWage)} €`)}${t(118, 112, `${fmtInt(r.pieces)} Stück · Leistungsgrad ${fmt(r.performancePct)} % · Akkord je Std. ${fmt(r.pieceHourly)} €`)}`;
      return `${svg(124, `Zeitlohn ${fmt(r.timeWage)} € gegen Akkordlohn ${fmt(r.pieceWage)} €`, body)}${table(
        ["Kennzahl", "Wert"],
        [
          ["Vorgabezeit je Stück", `${fmt(60 / Math.max(1, num(v, "normal")))} Min.`],
          ["Hergestellte Stück", `${fmtInt(r.pieces)} Stück`],
          ["Zeitlohn", `${fmt(r.timeWage)} €`],
          ["Akkordlohn", `${fmt(r.pieceWage)} €`],
          ["Leistungsgrad", `${fmt(r.performancePct)} %`],
        ],
      )}<p class="result">Akkordlohn je Stunde: ${fmt(r.pieceHourly)} € (${r.pieceHourly >= MINIMUM_WAGE ? "über" : "unter"} dem Mindestlohn von ${fmt(MINIMUM_WAGE)} €). In der Praxis sichern Tarifverträge im Akkord oft einen Mindestverdienst; Jugendliche dürfen nicht im Akkord arbeiten (§ 23 JArbSchG).</p>`;
    }

    case "netPay": {
      const r = netPay(num(v, "hourly"), num(v, "hours"), num(v, "tax"), yes(v, "church"), num(v, "sv"));
      const maxVal = Math.max(1, r.gross);
      const s = 300 / maxVal;
      const wNet = Math.max(0, r.net) * s;
      const wTax = r.taxes * s;
      const body = `${t(110, 40, "Brutto", "end")}${bar(118, 24, r.gross * s, 24, "v-blue")}${t(124 + clampW(r.gross * s), 40, `${fmt(r.gross)} €`)}${t(110, 80, "Aufteilung", "end")}${bar(118, 64, wNet, 24, "v-green")}${bar(118 + clampW(wNet), 64, wTax, 24, "v-coral")}${bar(118 + clampW(wNet) + clampW(wTax), 64, r.social * s, 24, "v-orange")}${t(118, 112, `Netto ${fmt(r.net)} € · Steuern ${fmt(r.taxes)} € · Sozialversicherung ${fmt(r.social)} €`)}`;
      return `${svg(124, `Lohnabrechnung: Brutto ${fmt(r.gross)} €, Netto ${fmt(r.net)} €`, body)}${table(
        ["Position", "Euro"],
        [
          ["Bruttolohn", fmt(r.gross)],
          ["− Lohnsteuer", fmt(r.incomeTax)],
          ["− Kirchensteuer", fmt(r.churchTax)],
          ["− Arbeitnehmeranteil Sozialversicherung", fmt(r.social)],
          ["= Nettolohn", fmt(r.net)],
        ],
      )}<p class="result">Mindestlohn (${fmt(MINIMUM_WAGE)} € je Stunde seit 1. Januar 2026): ${r.minimumWageOk ? "eingehalten" : "unterschritten"}. Netto: <strong>${fmt(r.net)} Euro</strong>.</p>`;
    }

    case "internshipCheck": {
      const start = num(v, "start");
      const end = num(v, "end");
      const r = checkInternship(start, end, num(v, "pause"), num(v, "days"));
      const hx = (h: number) => r1(60 + ((h - 4) / 18) * 440);
      const day = `<rect x="${hx(6)}" y="26" width="${r1(hx(20) - hx(6))}" height="34" rx="6" class="v-soft-fill"/>${t(hx(6), 20, "6 Uhr", "middle")}${t(hx(20), 20, "20 Uhr", "middle")}<rect x="${hx(start)}" y="32" width="${r1(Math.max(0, hx(end) - hx(start)))}" height="22" rx="4" class="${r.checks.timeWindow ? "v-teal" : "v-coral"}"/>`;
      const items: Array<[string, boolean]> = [
        ["6–20 Uhr", r.checks.timeWindow],
        ["≤ 7 Std./Tag", r.checks.daily],
        ["≤ 35 Std./Woche", r.checks.weekly],
        ["Pausen", r.checks.breaks],
        ["Schicht ≤ 10 Std.", r.checks.shift],
        ["≤ 5 Tage", r.checks.days],
      ];
      const checks = items
        .map(([name, ok], i) => {
          const x = 20 + (i % 3) * 170;
          const y = 72 + Math.floor(i / 3) * 34;
          return `<rect x="${x}" y="${y}" width="160" height="26" rx="13" class="${ok ? "v-green-fill" : "v-coral-fill"}"/>${t(x + 80, y + 17, `${ok ? "✓" : "✗"} ${name}`, "middle")}`;
        })
        .join("");
      const body = `${day}${checks}${t(20, 160, `Arbeit ${fmt(r.workHours)} Std. am Tag · ${fmt(r.weeklyHours)} Std. in der Woche · Pflichtpause ${r.requiredBreak} Min.`)}`;
      return `${svg(172, `Praktikumsplan: ${fmt(r.workHours)} Stunden täglich, ${r.allowed ? "zulässig" : "nicht zulässig"}`, body)}${table(
        ["Prüfpunkt (JArbSchG)", "Wert", "Status"],
        [
          ["Uhrzeit (§ 14)", `${clock(start)} bis ${clock(end)} Uhr`, r.checks.timeWindow ? "ok" : "außerhalb 6–20 Uhr"],
          ["Arbeitszeit täglich (§ 7)", `${fmt(r.workHours)} Std.`, r.checks.daily ? "ok (≤ 7)" : "zu lang"],
          ["Arbeitszeit wöchentlich (§ 7)", `${fmt(r.weeklyHours)} Std.`, r.checks.weekly ? "ok (≤ 35)" : "zu lang"],
          ["Ruhepausen (§ 11)", `${fmtInt(num(v, "pause"))} Min.`, r.checks.breaks ? `ok (≥ ${r.requiredBreak})` : `zu kurz (< ${r.requiredBreak})`],
          ["Schichtzeit (§ 12)", `${fmt(r.shiftHours)} Std.`, r.checks.shift ? "ok (≤ 10)" : "zu lang"],
          ["Arbeitstage (§ 15)", `${fmtInt(num(v, "days"))} Tage`, r.checks.days ? "ok (≤ 5)" : "zu viele"],
        ],
      )}<p class="result">${r.allowed ? "Der Plan erfüllt die geprüften Grenzen. Zusätzlich gelten Samstags- und Sonntagsruhe (§§ 16, 17), das Verbot gefährlicher Arbeiten (§ 22) und die Unterweisung vor Beginn (§ 29 JArbSchG)." : `Nicht zulässig: ${r.violations.join(" · ") || "keine Arbeitszeit eingeplant"}.`}</p>`;
    }

    case "noiseProtection": {
      const r = noiseExposure(num(v, "machine"), yes(v, "enclosure"), yes(v, "worn"), num(v, "attenuation"));
      const dx = (db: number) => r1(60 + ((Math.max(40, Math.min(110, db)) - 40) / 70) * 440);
      const body = `<rect x="${dx(40)}" y="30" width="${r1(dx(80) - dx(40))}" height="18" class="v-green-fill"/><rect x="${dx(80)}" y="30" width="${r1(dx(85) - dx(80))}" height="18" class="v-gold-fill"/><rect x="${dx(85)}" y="30" width="${r1(dx(110) - dx(85))}" height="18" class="v-coral-fill"/>${t(dx(80), 22, "80", "middle")}${t(dx(85), 22, "85 dB(A)", "start")}<circle cx="${dx(r.workplaceDb)}" cy="68" r="7" class="v-orange"/>${t(dx(r.workplaceDb), 92, `Arbeitsplatz ${fmtInt(r.workplaceDb)}`, "middle")}<circle cx="${dx(r.earDb)}" cy="108" r="7" class="v-blue"/>${t(dx(r.earDb), 128, `Ohr ${fmtInt(r.earDb)}`, "middle")}`;
      return `${svg(138, `Lärm: ${fmtInt(r.workplaceDb)} dB(A) am Arbeitsplatz, ${fmtInt(r.earDb)} dB(A) am Ohr`, body)}${table(
        ["Kennzahl (vereinfacht)", "Wert"],
        [
          ["Maschinenpegel", `${fmtInt(num(v, "machine"))} dB(A)`],
          ["Pegel am Arbeitsplatz (ohne Gehörschutz)", `${fmtInt(r.workplaceDb)} dB(A)`],
          ["Einstufung nach § 6 LärmVibrationsArbSchV", r.zone],
          ["Pegel am Ohr", `${fmtInt(r.earDb)} dB(A)`],
        ],
      )}<p class="result">Am Arbeitsplatz: ${esc(r.zone)}. ${r.earOk ? "Der Pegel am Ohr liegt unter dem Höchstwert von 85 dB(A) (§ 8 Abs. 2)." : "Der Pegel am Ohr überschreitet 85 dB(A): weitere Maßnahmen nötig."} Vereinfachtes Modell: Dämmwerte werden einfach abgezogen.</p>`;
    }

    case "productionCompare": {
      const r = productionCompare(num(v, "qty"), num(v, "manual"), num(v, "wage"), num(v, "invest"), num(v, "years"), num(v, "machine"), num(v, "operator"));
      const maxVal = Math.max(1, r.manualCost, r.machineCost);
      const s = 300 / maxVal;
      const wDep = r.depreciation * s;
      const body = `${t(110, 40, "Handarbeit", "end")}${bar(118, 24, r.manualCost * s, 24, "v-blue")}${t(124 + clampW(r.manualCost * s), 40, `${fmtInt(r.manualCost)} €`)}${t(110, 80, "Roboter", "end")}${bar(118, 64, wDep, 24, "v-purple")}${bar(118 + clampW(wDep), 64, (r.machineCost - r.depreciation) * s, 24, "v-orange")}${t(124 + Math.min(300, clampW(wDep) + clampW((r.machineCost - r.depreciation) * s)), 80, `${fmtInt(r.machineCost)} €`)}${t(118, 112, `Kostengleichheit ab ${Number.isFinite(r.breakEvenQty) ? `${fmtInt(r.breakEvenQty)} Teilen` : "nie (keine Ersparnis je Teil)"} · ${fmtInt(r.hoursSaved)} Arbeitsstunden weniger`)}`;
      return `${svg(124, `Jahreskosten: Handarbeit ${fmtInt(r.manualCost)} €, Roboter ${fmtInt(r.machineCost)} €`, body)}${table(
        ["Kennzahl", "Handarbeit", "Roboter"],
        [
          ["Arbeitsstunden pro Jahr", fmt(r.manualHours), fmt(r.machineHours)],
          ["Anschaffung je Jahr", "0,00", fmt(r.depreciation)],
          ["Jahreskosten (Euro)", fmt(r.manualCost), fmt(r.machineCost)],
          ["Kosten je Teil (Euro)", fmt(r.manualPiece), fmt(r.machinePiece)],
        ],
      )}<p class="result">${r.machineCheaper ? "Bei dieser Menge ist der Roboter günstiger." : "Bei dieser Menge ist die Handarbeit günstiger."} Die Rechnung zeigt nur die Kosten; Gesundheit, Qualität und Arbeitsplätze gehören ebenfalls in die Abwägung.</p>`;
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
        const raw =
          document.querySelector<HTMLInputElement | HTMLSelectElement>(`#lab-${c.id}`)?.value ?? "";
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
  form.addEventListener("input", render);
  form.addEventListener("change", render);
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
