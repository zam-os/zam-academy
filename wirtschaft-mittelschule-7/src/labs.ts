import { STEP_ICONS } from "./figures/draw";
import type { LabKind } from "./model/types";
import {
  applianceUsageCost,
  careerProfileMatch,
  checkHolidayJob,
  fmt,
  fmtInt,
  fourWeekBudget,
  marketState,
  money,
  projectBudgetPlan,
  selfEmployedResult,
  workplaceScore,
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

/** Every lab starts from these values; none of them meets the lab's goal. */
export const LABS: Record<LabKind, LabSpec> = {
  projectPlan: {
    description:
      "Dein Team plant ein Pausenmarkt-Projekt mit Obstbechern. Teste, wie Stückkosten, Fixkosten und Verkaufspreis zusammen den Projektüberschuss bestimmen.",
    goal: "Erreiche bei unverändertem Einkauf (1,00 €), Fixkosten (30 €) und Absatzmenge (50 Stück) einen Projektüberschuss von mindestens 30,00 €.",
    controls: [
      n("team", "Teamgröße (Schülerinnen)", 2, 10, 1),
      n("prepHours", "Vorbereitungszeit je Person (Std.)", 1, 10, 0.5),
      n("fixedCost", "Feste Projektkosten (Euro)", 0, 100, 2),
      n("unitCost", "Einkaufskosten je Stück (Euro)", 0.4, 4, 0.2),
      n("sellPrice", "Verkaufspreis je Stück (Euro)", 0.6, 6, 0.2),
      n("demandQty", "Verkaufte Menge (Stück)", 10, 150, 5),
    ],
    defaults: {
      team: 4,
      prepHours: 3,
      fixedCost: 30,
      unitCost: 1,
      sellPrice: 1.4,
      demandQty: 50,
    },
  },
  workplaceCheck: {
    description:
      "Bewerte einen erkundeten betrieblichen Arbeitsplatz auf einer Skala von 1 (sehr schlecht) bis 6 (sehr gut). Die vier Arbeitsplatzmerkmale sind unterschiedlich gewichtet.",
    goal: "Verbessere die Bewertung so, dass die gewichtete Gesamtpunktzahl mindestens 5,00 von 6,00 Punkten erreicht und kein Einzelmerkmal unter 4 Punkten liegt.",
    controls: [
      n("lightNoise", "Licht & Lärmschutz · 25 % (1–6)", 1, 6, 1),
      n("ergonomics", "Ergonomie & Körperhaltung · 30 % (1–6)", 1, 6, 1),
      n("tools", "Arbeitsmittel & Sicherheit · 25 % (1–6)", 1, 6, 1),
      n("breaksHours", "Arbeitszeit & Pausenregelung · 20 % (1–6)", 1, 6, 1),
    ],
    defaults: { lightNoise: 2, ergonomics: 2, tools: 4, breaksHours: 3 },
  },
  selfEmployedSim: {
    description:
      "Schlüpfe im Planspiel in die Rolle einer selbständigen Handwerkerin. Beobachte, wie verrechnete Auftragsstunden, Materialquote und monatliche Fixkosten das Ergebnis bestimmen.",
    goal: "Erwirtschafte bei unverändertem Stundensatz (50 €), Materialanteil (30 %) und Fixkosten (1.800 €) mindestens 2.400,00 € Ergebnis vor Steuern.",
    controls: [
      n("hours", "Verrechenbare Auftragsstunden / Monat", 20, 160, 5),
      n("rate", "Stundensatz netto (Euro)", 25, 120, 5),
      n("matPct", "Materialanteil am Umsatz (%)", 5, 60, 5),
      n("fixed", "Feste Monatskosten: Miete, Fahrzeug (Euro)", 400, 4000, 100),
    ],
    defaults: { hours: 70, rate: 50, matPct: 30, fixed: 1800 },
  },
  careerMatch: {
    description:
      "Vergleiche deine persönlichen Stärken und Interessen (1 bis 6 Punkte) mit drei typischen Ausbildungsberufen verschiedener Kammern.",
    goal: "Passe dein Profil so an, dass mindestens ein Ausbildungsberuf eine Passung von mindestens 90 % erreicht.",
    controls: [
      n("tech", "Technik & Handwerk (1–6)", 1, 6, 1),
      n("social", "Kontakt & Menschen helfen (1–6)", 1, 6, 1),
      n("care", "Sorgfalt & Ordnung (1–6)", 1, 6, 1),
      n("creative", "Gestalten & Kreativität (1–6)", 1, 6, 1),
    ],
    defaults: { tech: 2, social: 2, care: 2, creative: 5 },
  },
  householdBudget: {
    description:
      "Plane Einnahmen, feste Ausgaben und veränderliche Ausgaben über einen Zeitraum von vier Wochen und prüfe dein Sparziel.",
    goal: "Erreiche bei unveränderten Wocheneinnahmen (25 €) und 4-Wochen-Sparziel (40 €) nach vier Wochen mindestens 40,00 € Überschuss.",
    controls: [
      n("weeklyIncome", "Einnahmen je Woche (Euro)", 10, 100, 5),
      n("weeklyFixed", "Feste Ausgaben je Woche (Euro)", 0, 60, 1),
      n("weeklyVariable", "Veränderliche Ausgaben je Woche (Euro)", 0, 80, 1),
      n("fourWeekGoal", "4-Wochen-Sparziel (Euro)", 10, 200, 5),
    ],
    defaults: { weeklyIncome: 25, weeklyFixed: 7, weeklyVariable: 14, fourWeekGoal: 40 },
  },
  marketMechanism: {
    description:
      "Untersuche am Pausenkiosk das Zusammenspiel von Angebot und Nachfrage. Verändere Stückpreis, Nachfrageimpuls und Angebotskapazität.",
    goal: "Bringe den Markt bei unverändertem Nachfrageimpuls (0) und Angebotskapazität (60) durch Änderung des Stückpreises ins Gleichgewicht (Abweichung höchstens 2 Stück).",
    controls: [
      n("price", "Verkaufspreis je Stück (Euro)", 1, 4.5, 0.25),
      n("demandShift", "Nachfrageimpuls (−30 bis +60)", -30, 60, 10),
      n("supplyCap", "Angebotskapazität (20 bis 80)", 20, 80, 10),
    ],
    defaults: { price: 1.5, demandShift: 0, supplyCap: 60 },
  },
  schoolSale: {
    description:
      "Steuere einen schulischen Pausenverkauf (10,00 € feste Standkosten): Einkaufsmenge, Einkaufskosten, Verkaufspreis und tatsächliche Kundennachfrage bestimmen Reste und Überschuss.",
    goal: "Passe bei unveränderter Kundennachfrage (60 Stück) und Stückkosten (1,00 €) Einkaufsmenge und Preis so an, dass mindestens 40,00 € Überschuss bleiben und 0 Stück übrig bleiben.",
    controls: [
      n("buyQty", "Eingekaufte Menge (Stück)", 20, 150, 10),
      n("unitCost", "Einkaufskosten je Stück (Euro)", 0.5, 2, 0.1),
      n("sellPrice", "Verkaufspreis je Stück (Euro)", 1, 4, 0.2),
      n("demand", "Tatsächliche Nachfrage (Stück)", 20, 150, 10),
    ],
    defaults: { buyQty: 100, unitCost: 1, sellPrice: 1.8, demand: 60 },
  },
  holidayJobCheck: {
    description:
      "Prüfe einen geplanten Ferienjob-Vertrag gegen die Schutzregeln des Jugendarbeitsschutzgesetzes (§§ 2, 5, 8, 11, 15 JArbSchG).",
    goal: "Stelle den Vertrag so ein, dass er in allen Punkten gesetzlich zulässig ist und Jugendliche ab 15 Jahren genau 8 Stunden täglich und 40 Stunden wöchentlich arbeiten dürfen.",
    controls: [
      n("age", "Alter (Jahre)", 12, 17, 1),
      n("hoursPerDay", "Arbeitszeit pro Tag (Std.)", 1, 10, 0.5),
      n("daysPerWeek", "Arbeitstage pro Woche", 1, 7, 1),
      n("weeksPerYear", "Ferienjob-Wochen im Jahr", 1, 6, 1),
      n("breakMinutes", "Vereinbarte Ruhepause je Tag (Min.)", 0, 90, 15),
    ],
    defaults: { age: 14, hoursPerDay: 7, daysPerWeek: 6, weeksPerYear: 5, breakMinutes: 30 },
  },
  applianceCheck: {
    description:
      "Berechne jährlichen Stromverbrauch, Stromkosten und den versteckten Standby-Anteil eines Haushaltsgeräts über 52 Wochen.",
    goal: "Senke bei unveränderter Leistung (1.500 W), Nutzung (4 Std./Woche), Strompreis (35 ct/kWh) und Kaufpreis (300 €) die Jahresstromkosten unter 115,00 € und den Standby-Anteil auf 0 %.",
    controls: [
      n("watts", "Geräteleistung aktiv (Watt)", 50, 2500, 50),
      n("hoursPerWeek", "Aktive Nutzung pro Woche (Std.)", 1, 50, 1),
      n("standbyWatts", "Standby-Leistung im Ruhezustand (Watt)", 0, 25, 1),
      n("centsPerKwh", "Strompreis (ct/kWh)", 20, 50, 5),
      n("purchasePrice", "Anschaffungspreis (Euro)", 50, 1200, 50),
    ],
    defaults: {
      watts: 1500,
      hoursPerWeek: 4,
      standbyWatts: 10,
      centsPerKwh: 35,
      purchasePrice: 300,
    },
  },
};

const num = (v: Values, id: string) => Number(v[id]);
const same = (v: Values, kind: LabKind, ids: string[]) =>
  ids.every((id) => num(v, id) === Number(LABS[kind].defaults[id]));

/** Whether the learner reached the lab's goal; tests prove each goal reachable and unmet at the start. */
export function goalReached(kind: LabKind, v: Values): boolean {
  try {
    switch (kind) {
      case "projectPlan": {
        const res = projectBudgetPlan(
          num(v, "team"),
          num(v, "prepHours"),
          num(v, "fixedCost"),
          num(v, "unitCost"),
          num(v, "sellPrice"),
          num(v, "demandQty"),
        );
        return (
          same(v, kind, ["fixedCost", "unitCost", "demandQty"]) &&
          res.surplus >= 30
        );
      }
      case "workplaceCheck": {
        const s = [
          num(v, "lightNoise"),
          num(v, "ergonomics"),
          num(v, "tools"),
          num(v, "breaksHours"),
        ];
        const res = workplaceScore(s[0], s[1], s[2], s[3]);
        return res.total >= 5 && s.every((x) => x >= 4);
      }
      case "selfEmployedSim": {
        const res = selfEmployedResult(
          num(v, "hours"),
          num(v, "rate"),
          num(v, "matPct"),
          num(v, "fixed"),
        );
        return same(v, kind, ["rate", "matPct", "fixed"]) && res.profit >= 2400;
      }
      case "careerMatch": {
        const matches = careerProfileMatch(
          num(v, "tech"),
          num(v, "social"),
          num(v, "care"),
          num(v, "creative"),
        );
        return (matches[0]?.fitPct ?? 0) >= 90;
      }
      case "householdBudget": {
        const res = fourWeekBudget(
          num(v, "weeklyIncome"),
          num(v, "weeklyFixed"),
          num(v, "weeklyVariable"),
          num(v, "fourWeekGoal"),
        );
        return (
          same(v, kind, ["weeklyIncome", "fourWeekGoal"]) && res.surplus4 >= 40
        );
      }
      case "marketMechanism": {
        const res = marketState(
          num(v, "price"),
          num(v, "demandShift"),
          num(v, "supplyCap"),
        );
        return (
          same(v, kind, ["demandShift", "supplyCap"]) &&
          Math.abs(res.demandQty - res.supplyQty) <= 2
        );
      }
      case "schoolSale": {
        const buyQty = num(v, "buyQty");
        const demand = num(v, "demand");
        const sold = Math.min(buyQty, demand);
        const unsold = Math.max(0, buyQty - sold);
        const revenue = money(sold * num(v, "sellPrice"));
        const expense = money(buyQty * num(v, "unitCost") + 10);
        const surplus = money(revenue - expense);
        return (
          same(v, kind, ["unitCost", "demand"]) &&
          surplus >= 40 &&
          unsold === 0
        );
      }
      case "holidayJobCheck": {
        const res = checkHolidayJob(
          num(v, "age"),
          num(v, "hoursPerDay"),
          num(v, "daysPerWeek"),
          num(v, "weeksPerYear"),
          num(v, "breakMinutes"),
        );
        return res.allowed && res.hoursPerDay === 8 && res.weeklyHours === 40;
      }
      case "applianceCheck": {
        const res = applianceUsageCost(
          num(v, "watts"),
          num(v, "hoursPerWeek"),
          num(v, "standbyWatts"),
          num(v, "centsPerKwh"),
          num(v, "purchasePrice"),
        );
        return (
          same(v, kind, ["watts", "hoursPerWeek", "centsPerKwh", "purchasePrice"]) &&
          res.totalCostYear < 115 &&
          res.standbySharePct === 0
        );
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

export function renderResult(kind: LabKind, v: Values): string {
  switch (kind) {
    case "projectPlan": {
      const fixedCost = num(v, "fixedCost");
      const unitCost = num(v, "unitCost");
      const sellPrice = num(v, "sellPrice");
      const demandQty = num(v, "demandQty");
      const r = projectBudgetPlan(
        num(v, "team"),
        num(v, "prepHours"),
        fixedCost,
        unitCost,
        sellPrice,
        demandQty,
      );
      const maxVal = Math.max(1, r.revenue, r.totalCost);
      const barMax = 290;
      const wRev = r1((r.revenue / maxVal) * barMax);
      const wFix = r1((fixedCost / maxVal) * barMax);
      const wVar = r1((r.variableTotal / maxVal) * barMax);
      const svg = `<svg class="chart lab-svg" viewBox="0 0 540 132" role="img" aria-label="Projektvergleich: Einnahmen ${fmt(r.revenue)} € gegenüber Kosten ${fmt(r.totalCost)} €"><text class="visual-label micro" x="108" y="42" text-anchor="end">Einnahmen</text><rect x="116" y="24" width="${wRev}" height="26" rx="4" class="v-green"/><text class="visual-label micro" x="${122 + wRev}" y="42" text-anchor="start">${esc(fmt(r.revenue))} €</text><text class="visual-label micro" x="108" y="82" text-anchor="end">Gesamtkosten</text><rect x="116" y="64" width="${wFix}" height="26" rx="3" class="v-orange"/><rect x="${116 + wFix}" y="64" width="${wVar}" height="26" rx="3" class="v-coral"/><text class="visual-label micro" x="${122 + wFix + wVar}" y="82" text-anchor="start">${esc(fmt(r.totalCost))} €</text><text class="visual-label micro" x="116" y="116" text-anchor="start">Mindestabsatz: ${Number.isFinite(r.breakEvenQty) ? `${fmtInt(r.breakEvenQty)} Stück` : "Preis über Stückkosten nötig"} · Überschuss: ${esc(fmt(r.surplus))} €</text></svg>`;
      return `${svg}${table(
        ["Projektkennzahl", "Wert"],
        [
          ["Gesamte Team-Vorbereitungszeit", `${fmt(r.totalPrepHours)} Std.`],
          ["Stückbeitrag (Preis − Stückkosten)", `${fmt(r.contribution)} €`],
          [
            "Mindestabsatz zur Kostendeckung",
            Number.isFinite(r.breakEvenQty) ? `${fmtInt(r.breakEvenQty)} Stück` : "nicht möglich",
          ],
          ["Einnahmen", `${fmt(r.revenue)} €`],
          ["Gesamtkosten (fix + variabel)", `${fmt(r.totalCost)} €`],
          ["Projektüberschuss", `${fmt(r.surplus)} €`],
        ],
      )}<p class="result">Ergebnis: ${r.surplus >= 0 ? `Überschuss von ${fmt(r.surplus)} Euro (${fmt(r.returnPerHour)} Euro je Projektstunde).` : `Fehlbetrag von ${fmt(-r.surplus)} Euro — Preis erhöhen oder Kosten senken.`}</p>`;
    }

    case "workplaceCheck": {
      const s = [
        num(v, "lightNoise"),
        num(v, "ergonomics"),
        num(v, "tools"),
        num(v, "breaksHours"),
      ];
      const r = workplaceScore(s[0], s[1], s[2], s[3]);
      const rows: Array<[string, string, number, number]> = [
        ["Licht & Lärm", "25 %", r.lightNoise, 24],
        ["Ergonomie", "30 %", r.ergonomics, 56],
        ["Arbeitsmittel", "25 %", r.tools, 88],
        ["Pausen & Zeit", "20 %", r.breaksHours, 120],
      ];
      const svg = `<svg class="chart lab-svg" viewBox="0 0 540 164" role="img" aria-label="Arbeitsplatzbewertung: ${fmt(r.total)} von 6,00 Punkten">${rows
        .map(([name, w, val, y]) => {
          const bw = r1((val / 6) * 270);
          const cls = val >= 4 ? "v-green" : val >= 3 ? "v-gold" : "v-coral";
          return `<text class="visual-label micro" x="136" y="${y + 16}" text-anchor="end">${esc(name)} (${w})</text><rect x="144" y="${y}" width="270" height="22" rx="4" class="v-soft-fill"/><rect x="144" y="${y}" width="${bw}" height="22" rx="4" class="${cls}"/><text class="visual-label micro" x="424" y="${y + 16}" text-anchor="start">${fmtInt(val)} / 6</text>`;
        })
        .join("")}<text class="visual-label small" x="144" y="156" text-anchor="start">Gewichtetes Gesamtergebnis: ${esc(fmt(r.total))} / 6,00 Punkte</text></svg>`;
      return `${svg}${table(
        ["Arbeitsplatzmerkmal", "Gewicht", "Punkte (1–6)"],
        [
          ["Licht & Lärmschutz", "25 %", fmtInt(r.lightNoise)],
          ["Ergonomie", "30 %", fmtInt(r.ergonomics)],
          ["Arbeitsmittel & Sicherheit", "25 %", fmtInt(r.tools)],
          ["Arbeitszeit & Pausen", "20 %", fmtInt(r.breaksHours)],
          ["Gesamtergebnis", "100 %", `${fmt(r.total)} Punkte`],
        ],
      )}<p class="result">Gesamtbewertung: <strong>${fmt(r.total)} von 6,00 Punkten</strong>${r.weakPoints.length ? ` · Kritische Schwachstellen: ${r.weakPoints.join(", ")}.` : " · Alle Merkmale mindestens ordentlich erfüllt."}</p>`;
    }

    case "selfEmployedSim": {
      const hours = num(v, "hours"),
        rate = num(v, "rate"),
        matPct = num(v, "matPct"),
        fixed = num(v, "fixed");
      const r = selfEmployedResult(hours, rate, matPct, fixed);
      const maxBar = Math.max(1, r.revenue, r.materialCost + fixed);
      const scale = 300;
      const wRev = r1((r.revenue / maxBar) * scale);
      const wMat = r1((r.materialCost / maxBar) * scale);
      const wFix = r1((fixed / maxBar) * scale);
      const wProf = r.profit > 0 ? r1((r.profit / maxBar) * scale) : 0;
      const svg = `<svg class="chart lab-svg" viewBox="0 0 540 132" role="img" aria-label="Planspiel Selbständigkeit: Umsatz ${fmt(r.revenue)} € gegen Kosten und Gewinn ${fmt(r.profit)} €"><text class="visual-label micro" x="98" y="42" text-anchor="end">Umsatz</text><rect x="106" y="24" width="${wRev}" height="26" rx="4" class="v-blue"/><text class="visual-label micro" x="${112 + wRev}" y="42" text-anchor="start">${esc(fmt(r.revenue))} €</text><text class="visual-label micro" x="98" y="82" text-anchor="end">Aufteilung</text><rect x="106" y="64" width="${wMat}" height="26" rx="3" class="v-orange"/><rect x="${106 + wMat}" y="64" width="${wFix}" height="26" rx="3" class="v-coral"/>${wProf > 2 ? `<rect x="${106 + wMat + wFix}" y="64" width="${wProf}" height="26" rx="3" class="v-green"/>` : ""}<text class="visual-label micro" x="106" y="116" text-anchor="start">Material ${esc(fmt(r.materialCost))} € · Fix ${esc(fmt(fixed))} € · Vor Steuern: ${esc(fmt(r.profit))} €</text></svg>`;
      return `${svg}${table(
        ["Planspiel-Posten", "Euro"],
        [
          ["Umsatz (Stunden · Stundensatz)", r.revenue],
          [`− Materialkosten (${fmtInt(matPct)} %)`, r.materialCost],
          ["− Feste Monatskosten", fixed],
          ["= Ergebnis vor Steuern & Vorsorge", r.profit],
        ],
      )}<p class="result">${r.profit >= 0 ? `Betriebsergebnis vor Steuern: ${fmt(r.profit)} Euro (${fmt(r.marginPct)} % Umsatzmarge).` : `Verlust von ${fmt(-r.profit)} Euro — mehr Aufträge oder höherer Stundensatz nötig.`}</p>`;
    }

    case "careerMatch": {
      const matches = careerProfileMatch(
        num(v, "tech"),
        num(v, "social"),
        num(v, "care"),
        num(v, "creative"),
      );
      const svg = `<svg class="chart lab-svg" viewBox="0 0 540 132" role="img" aria-label="Berufspassung: bester Treffer ${matches[0].name} mit ${fmt(matches[0].fitPct)} %">${matches
        .map((m, i) => {
          const y = 20 + i * 36;
          const w = r1((m.fitPct / 100) * 230);
          const cls = m.fitPct >= 90 ? "v-green" : m.fitPct >= 75 ? "v-blue" : "v-orange";
          return `<text class="visual-label micro" x="218" y="${y + 16}" text-anchor="end">${esc(m.name)}</text><rect x="226" y="${y}" width="230" height="22" rx="4" class="v-soft-fill"/><rect x="226" y="${y}" width="${w}" height="22" rx="4" class="${cls}"/><text class="visual-label micro" x="464" y="${y + 16}" text-anchor="start">${esc(fmt(m.fitPct))} %</text>`;
        })
        .join("")}</svg>`;
      return `${svg}${table(
        ["Ausbildungsberuf", "Kammer", "Abstand", "Passung (%)"],
        matches.map((m) => [m.name, m.body, `${fmtInt(m.distance)} Pkt.`, `${fmt(m.fitPct)} %`]),
      )}<p class="result">Stärkste Übereinstimmung: <strong>${esc(matches[0].name)}</strong> (${esc(matches[0].body)}, ${fmt(matches[0].fitPct)} % Passung).</p>`;
    }

    case "householdBudget": {
      const r = fourWeekBudget(
        num(v, "weeklyIncome"),
        num(v, "weeklyFixed"),
        num(v, "weeklyVariable"),
        num(v, "fourWeekGoal"),
      );
      const maxScale = Math.max(1, r.income4, r.expenses4, r.fourWeekGoal);
      const barMax = 300;
      const wInc = r1((r.income4 / maxScale) * barMax);
      const wFix = r1((r.fixed4 / maxScale) * barMax);
      const wVar = r1((r.variable4 / maxScale) * barMax);
      const wSur = r.surplus4 > 0 ? r1((r.surplus4 / maxScale) * barMax) : 0;
      const svg = `<svg class="chart lab-svg" viewBox="0 0 540 132" role="img" aria-label="4-Wochen-Plan: Einnahmen ${fmt(r.income4)} € gegen Ausgaben ${fmt(r.expenses4)} €"><text class="visual-label micro" x="108" y="40" text-anchor="end">4-Wo.-Einnahmen</text><rect x="116" y="22" width="${wInc}" height="26" rx="4" class="v-green"/><text class="visual-label micro" x="${122 + wInc}" y="40" text-anchor="start">${esc(fmt(r.income4))} €</text><text class="visual-label micro" x="108" y="80" text-anchor="end">Aufteilung</text><rect x="116" y="62" width="${wFix}" height="26" rx="3" class="v-blue"/><rect x="${116 + wFix}" y="62" width="${wVar}" height="26" rx="3" class="v-orange"/>${wSur > 2 ? `<rect x="${116 + wFix + wVar}" y="62" width="${wSur}" height="26" rx="3" class="v-teal"/>` : ""}<text class="visual-label micro" x="116" y="114" text-anchor="start">Fest: ${esc(fmt(r.fixed4))} € · Veränd.: ${esc(fmt(r.variable4))} € · Überschuss: ${esc(fmt(r.surplus4))} € (Ziel ${esc(fmt(r.fourWeekGoal))} €)</text></svg>`;
      return `${svg}${table(
        ["4-Wochen-Übersicht", "Euro"],
        [
          ["Einnahmen (4 Wochen)", r.income4],
          ["Feste Ausgaben (4 Wochen)", r.fixed4],
          ["Veränderliche Ausgaben (4 Wochen)", r.variable4],
          ["Überschuss nach 4 Wochen", r.surplus4],
          ["Sparziel (4 Wochen)", r.fourWeekGoal],
        ],
      )}<p class="result">${r.gapToGoal <= 0 ? `Sparziel erreicht! Überschuss: ${fmt(r.surplus4)} Euro (Sparquote ${fmt(r.saveRatePct)} %).` : `Zum Sparziel fehlen nach vier Wochen noch ${fmt(r.gapToGoal)} Euro.`}</p>`;
    }

    case "marketMechanism": {
      const r = marketState(
        num(v, "price"),
        num(v, "demandShift"),
        num(v, "supplyCap"),
      );
      const maxQty = Math.max(1, r.demandQty, r.supplyQty, 120);
      const scale = 290;
      const wDem = r1((r.demandQty / maxQty) * scale);
      const wSup = r1((r.supplyQty / maxQty) * scale);
      const svg = `<svg class="chart lab-svg" viewBox="0 0 540 132" role="img" aria-label="Marktmodell bei ${fmt(r.price)} €: Nachfrage ${r.demandQty} Stück gegen Angebot ${r.supplyQty} Stück"><text class="visual-label micro" x="108" y="40" text-anchor="end">Nachfrage</text><rect x="116" y="22" width="${wDem}" height="26" rx="4" class="v-orange"/><text class="visual-label micro" x="${122 + wDem}" y="40" text-anchor="start">${fmtInt(r.demandQty)} Stück</text><text class="visual-label micro" x="108" y="80" text-anchor="end">Angebot</text><rect x="116" y="62" width="${wSup}" height="26" rx="4" class="v-blue"/><text class="visual-label micro" x="${122 + wSup}" y="80" text-anchor="start">${fmtInt(r.supplyQty)} Stück</text><text class="visual-label micro" x="116" y="114" text-anchor="start">Handelsmenge: ${fmtInt(r.tradedQty)} Stück · Umsatz: ${esc(fmt(r.revenue))} €</text></svg>`;
      return `${svg}${table(
        ["Marktgröße bei aktuellem Preis", "Wert"],
        [
          ["Stückpreis", `${fmt(r.price)} €`],
          ["Nachgefragte Menge", `${fmtInt(r.demandQty)} Stück`],
          ["Angebotene Menge", `${fmtInt(r.supplyQty)} Stück`],
          ["Tatsächlich verkauft", `${fmtInt(r.tradedQty)} Stück`],
          ["Umsatz", `${fmt(r.revenue)} €`],
        ],
      )}<p class="result">Marktlage: <strong>${esc(r.stateLabel)}</strong>.</p>`;
    }

    case "schoolSale": {
      const buyQty = num(v, "buyQty");
      const unitCost = num(v, "unitCost");
      const sellPrice = num(v, "sellPrice");
      const demand = num(v, "demand");
      const soldQty = Math.min(buyQty, demand);
      const unsoldQty = Math.max(0, buyQty - soldQty);
      const revenue = money(soldQty * sellPrice);
      const expense = money(buyQty * unitCost + 10);
      const surplus = money(revenue - expense);
      const maxEuro = Math.max(1, revenue, expense);
      const scale = 290;
      const wRev = r1((revenue / maxEuro) * scale);
      const wExp = r1((expense / maxEuro) * scale);
      const svg = `<svg class="chart lab-svg" viewBox="0 0 540 132" role="img" aria-label="Pausenverkauf: Einnahmen ${fmt(revenue)} € gegen Ausgaben ${fmt(expense)} €"><text class="visual-label micro" x="108" y="40" text-anchor="end">Einnahmen</text><rect x="116" y="22" width="${wRev}" height="26" rx="4" class="v-green"/><text class="visual-label micro" x="${122 + wRev}" y="40" text-anchor="start">${esc(fmt(revenue))} € (${fmtInt(soldQty)} verk.)</text><text class="visual-label micro" x="108" y="80" text-anchor="end">Ausgaben</text><rect x="116" y="62" width="${wExp}" height="26" rx="4" class="v-coral"/><text class="visual-label micro" x="${122 + wExp}" y="80" text-anchor="start">${esc(fmt(expense))} € (Rest: ${fmtInt(unsoldQty)})</text><text class="visual-label micro" x="116" y="114" text-anchor="start">Überschuss: ${esc(fmt(surplus))} € · Standkosten fest: 10,00 €</text></svg>`;
      return `${svg}${table(
        ["Pausenverkauf-Übersicht", "Wert"],
        [
          ["Eingekaufte Menge", `${fmtInt(buyQty)} Stück`],
          ["Verkaufte Menge", `${fmtInt(soldQty)} Stück`],
          ["Unverkaufte Reste", `${fmtInt(unsoldQty)} Stück`],
          ["Einnahmen", `${fmt(revenue)} €`],
          ["Gesamtausgaben (Ware + 10,00 € Stand)", `${fmt(expense)} €`],
          ["Überschuss", `${fmt(surplus)} €`],
        ],
      )}<p class="result">${surplus >= 0 ? `Überschuss von ${fmt(surplus)} Euro` : `Verlust von ${fmt(-surplus)} Euro`} bei ${fmtInt(unsoldQty)} unverkauften Reststücken.</p>`;
    }

    case "holidayJobCheck": {
      const r = checkHolidayJob(
        num(v, "age"),
        num(v, "hoursPerDay"),
        num(v, "daysPerWeek"),
        num(v, "weeksPerYear"),
        num(v, "breakMinutes"),
      );
      const rows: Array<[string, string, boolean]> = [
        [`Mindestalter 15 Jahre (aktuell ${r.age})`, r.ageOk ? "erfüllt" : "verletzt", r.ageOk],
        [
          `Max. 8 Std./Tag & 40 Std./Woche (${fmt(r.hoursPerDay)} / ${fmt(r.weeklyHours)} Std.)`,
          r.dailyHoursOk && r.weeklyHoursOk ? "erfüllt" : "verletzt",
          r.dailyHoursOk && r.weeklyHoursOk,
        ],
        [
          `5-Tage-Woche & max. 4 Wochen/Jahr (${r.daysPerWeek} Tg. / ${r.weeksPerYear} Wo.)`,
          r.daysOk && r.weeksOk ? "erfüllt" : "verletzt",
          r.daysOk && r.weeksOk,
        ],
        [
          `Ruhepause mind. ${r.requiredBreak} Min. (aktuell ${r.breakMinutes} Min.)`,
          r.breakOk ? "erfüllt" : "verletzt",
          r.breakOk,
        ],
      ];
      const svg = `<svg class="chart lab-svg" viewBox="0 0 540 144" role="img" aria-label="JArbSchG-Prüfung: ${r.allowed ? "zulässig" : "unzulässig"}">${rows
        .map(([text, state, ok], i) => {
          const y = 16 + i * 31;
          return `<rect x="16" y="${y}" width="508" height="24" rx="5" class="${ok ? "v-green-fill" : "v-coral-fill"}"/><text class="visual-label micro" x="28" y="${y + 16}" text-anchor="start">${esc(text)}</text><text class="visual-label micro" x="512" y="${y + 16}" text-anchor="end">${esc(state)}</text>`;
        })
        .join("")}</svg>`;
      return `${svg}${table(
        ["Prüfkriterium (JArbSchG)", "Wert", "Status"],
        [
          ["Alter", `${r.age} Jahre`, r.ageOk ? "zulässig" : "unter 15 Jahre"],
          ["Tägliche Arbeitszeit", `${fmt(r.hoursPerDay)} Std.`, r.dailyHoursOk ? "ok (<= 8)" : "zu lang"],
          ["Wöchentliche Arbeitszeit", `${fmt(r.weeklyHours)} Std.`, r.weeklyHoursOk ? "ok (<= 40)" : "zu lang"],
          ["Wochen im Kalenderjahr", `${r.weeksPerYear} Wochen`, r.weeksOk ? "ok (<= 4)" : "über 4 Wo."],
          ["Ruhepause täglich", `${r.breakMinutes} Min.`, r.breakOk ? `ok (>= ${r.requiredBreak})` : `zu kurz (< ${r.requiredBreak})`],
        ],
      )}<p class="result">${r.allowed ? "Alle gesetzlichen Vorgaben des JArbSchG sind eingehalten (Arbeitszeit zwischen 6 und 20 Uhr sowie Verbot gefährlicher Arbeiten zusätzlich beachten)." : `Unzulässig: ${r.violations.join(" · ")}.`}</p>`;
    }

    case "applianceCheck": {
      const r = applianceUsageCost(
        num(v, "watts"),
        num(v, "hoursPerWeek"),
        num(v, "standbyWatts"),
        num(v, "centsPerKwh"),
        num(v, "purchasePrice"),
      );
      const maxKwh = Math.max(1, r.totalKwhYear);
      const scale = 300;
      const wAct = r1((r.activeKwhYear / maxKwh) * scale);
      const wStb = r1((r.standbyKwhYear / maxKwh) * scale);
      const svg = `<svg class="chart lab-svg" viewBox="0 0 540 132" role="img" aria-label="Stromverbrauch pro Jahr: ${fmt(r.activeKwhYear)} kWh aktiv plus ${fmt(r.standbyKwhYear)} kWh Standby"><text class="visual-label micro" x="112" y="42" text-anchor="end">Jahresstrom</text><rect x="120" y="24" width="${wAct}" height="28" rx="4" class="v-blue"/>${wStb > 1 ? `<rect x="${120 + wAct}" y="24" width="${wStb}" height="28" rx="4" class="v-coral"/>` : ""}<text class="visual-label micro" x="${126 + wAct + wStb}" y="42" text-anchor="start">${esc(fmt(r.totalKwhYear))} kWh/Jahr</text><text class="visual-label micro" x="120" y="78" text-anchor="start">Aktiv: ${esc(fmt(r.activeKwhYear))} kWh (${esc(fmt(r.activeCostYear))} €) · Standby: ${esc(fmt(r.standbyKwhYear))} kWh (${esc(fmt(r.standbyCostYear))} € = ${esc(fmt(r.standbySharePct))} %)</text><text class="visual-label micro" x="120" y="106" text-anchor="start">5-Jahres-Gesamtkosten (Kaufpreis + Strom): ${esc(fmt(r.fiveYearCost))} €</text></svg>`;
      return `${svg}${table(
        ["Kennzahl pro Jahr (52 Wochen)", "Energie / Kosten"],
        [
          ["Aktiver Stromverbrauch", `${fmt(r.activeKwhYear)} kWh (${fmt(r.activeCostYear)} €)`],
          ["Standby-Verlust", `${fmt(r.standbyKwhYear)} kWh (${fmt(r.standbyCostYear)} €)`],
          ["Standby-Anteil am Gesamtstrom", `${fmt(r.standbySharePct)} %`],
          ["Gesamte Jahresstromkosten", `${fmt(r.totalCostYear)} €`],
          ["5-Jahres-Gesamtkosten inkl. Kaufpreis", `${fmt(r.fiveYearCost)} €`],
        ],
      )}<p class="result">Jährliche Stromkosten: <strong>${fmt(r.totalCostYear)} Euro</strong> (${fmt(r.standbySharePct)} % davon reiner Standby-Verlust).</p>`;
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
