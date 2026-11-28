import { euro, fmt } from "../format";
import { type LabDef, type LabState, mapRange, points, svg } from "./engine";

/* ------------------------------------------------------------------ */
/* Arbeitsteilung am Waffelstand: specialisation needs coordination.   */

const STATIONS = ["Teig rühren", "Backen", "Verkaufen"] as const;

/** Waffles per hour: invented, round model values. */
export function waffles(s: LabState): number {
  if (s.n === 1) return 8;
  if (s.org === 0) return s.n * 8 * (s.coord === 1 ? 1 : 0.95);
  return s.n * 12 * (s.coord === 1 ? 1 : 0.6);
}

export const ARBEITSTEILUNG: LabDef = {
  kind: "arbeitsteilung",
  title: "Der Waffelstand beim Schulfest",
  intro:
    "Deine Klasse verkauft Waffeln. Wer alles allein macht, schafft 8 Waffeln pro Stunde. Wer sich auf eine Station spezialisiert, wird schneller. Stelle Teamgröße, Arbeitsteilung und Absprache ein. Die Werte sind Modellannahmen.",
  sliders: [{ key: "n", label: "Helferinnen und Helfer", min: 1, max: 6, step: 1, unit: "", value: 1 }],
  selects: [
    { key: "org", label: "Organisation", options: [{ value: 0, label: "Alle machen alles" }, { value: 1, label: "Jede Person hat eine Station (Spezialisierung)" }], value: 0 },
    { key: "coord", label: "Koordination", options: [{ value: 0, label: "Keine Absprache" }, { value: 1, label: "Plan: wer wann was übernimmt" }], value: 0 },
  ],
  goals: [
    {
      id: "drei-spezialisten",
      text: "Drei Personen teilen sich die Stationen auf und sprechen sich ab. Erreiche so 36 Waffeln pro Stunde.",
      test: (s) => s.n === 3 && s.org === 1 && s.coord === 1,
    },
    {
      id: "ohne-plan",
      text: "Zeige, dass Spezialisierung ohne Koordination sogar weniger bringt als Alleskönner.",
      test: (s) => s.n >= 2 && s.org === 1 && s.coord === 0,
    },
    { id: "achtundvierzig", text: "Schaffe mindestens 48 Waffeln pro Stunde.", test: (s) => waffles(s) >= 48 },
  ],
  witness: {
    "drei-spezialisten": { n: 3, org: 1, coord: 1 },
    "ohne-plan": { n: 3, org: 1, coord: 0 },
    achtundvierzig: { n: 4, org: 1, coord: 1 },
  },
  view(s) {
    const out = waffles(s);
    const special = s.org === 1 && s.n > 1;
    const people = Array.from({ length: s.n }, (_, i) => {
      const station = special ? i % 3 : -1;
      const slot = special ? Math.floor(i / 3) : i;
      const cx = special ? 80 + station * 150 + slot * 30 - 15 : 60 + i * 64;
      const cy = special ? 150 : 205;
      return special
        ? `<circle class="lab-person lab-person-${station}" cx="${cx}" cy="${cy}" r="12"/>`
        : `<g><circle class="lab-person lab-person-all" cx="${cx}" cy="${cy}" r="12"/><text class="lab-text lab-text-muted" x="${cx}" y="${cy + 28}" text-anchor="middle">alles</text></g>`;
    }).join("");
    const stations = STATIONS.map(
      (name, i) => `<rect class="lab-station lab-station-${i}" x="${20 + i * 150}" y="40" width="130" height="70" rx="12"/>
        <text class="lab-text lab-text-strong" x="${85 + i * 150}" y="80" text-anchor="middle">${name}</text>
        ${i < 2 ? `<path class="lab-flow lab-flow-goods" d="M${152 + i * 150} 75 h14"/><path class="lab-arrow-head" d="M${166 + i * 150} 69 l8 6 l-8 6 z"/>` : ""}`,
    ).join("");
    const bar = `<text class="lab-text lab-text-strong" x="20" y="262">Waffeln pro Stunde</text><rect class="lab-track" x="160" y="248" width="280" height="20" rx="6"/><rect class="lab-bar-2" x="160" y="248" width="${(out / 72) * 280}" height="20" rx="6"/><text class="lab-text lab-text-strong" x="${168 + (out / 72) * 280}" y="263">${fmt(out)}</text>`;
    return {
      figure: svg("Stationen des Waffelstands mit dem eingesetzten Team", stations + people + bar, 470, 280),
      readouts: [
        ["Waffeln pro Stunde", fmt(out)],
        ["Je Person", fmt(Math.round((out / s.n) * 10) / 10)],
        ["Wenn eine Person ausfällt", special ? "Eine Station steht still" : "Die anderen machen weiter"],
      ],
      note:
        s.n === 1
          ? "Allein gibt es nichts zu teilen: Du rührst, backst und verkaufst nacheinander."
          : special && s.coord === 0
            ? "Ohne Absprache warten die Bäcker auf Teig, und an der Kasse staut es sich: Spezialisierung braucht Kooperation und Koordination."
            : special
              ? "Spezialisierung, Kooperation und Koordination greifen ineinander: Jede Person wird in ihrer Station geübt, die Teilergebnisse wandern weiter, der Plan verhindert Leerlauf."
              : "Alleskönner sind flexibel, aber langsamer: Bei jedem Wechsel zwischen Rühren, Backen und Kasse geht Zeit verloren.",
    };
  },
};

/* ------------------------------------------------------------------ */
/* Fertigungstypen und Fertigungsverfahren.                            */

const AMOUNTS = [1, 10, 100, 1000, 10000, 100000, 1000000];
type FType = "einzel" | "serie" | "varianten" | "masse";
const typeOf = (s: LabState): FType =>
  s.wunsch === 0 ? "einzel" : s.wunsch === 1 ? "varianten" : s.menge >= 4 ? "masse" : "serie";
const TYPE_NAME: Record<FType, string> = {
  einzel: "Einzelfertigung",
  serie: "Serienfertigung (kleine Stückzahl gleicher Produkte)",
  varianten: "Variantenfertigung",
  masse: "Massenfertigung",
};
function fits(s: LabState): boolean {
  const t = typeOf(s);
  if (s.verfahren === 0) return t === "einzel" || t === "serie" || (t === "varianten" && s.menge < 3);
  return t === "masse" || (t === "varianten" && s.menge >= 3);
}

export const FERTIGUNG: LabDef = {
  kind: "fertigung",
  title: "Fertigung planen: Typ und Verfahren",
  intro:
    "Eine Möbelfirma plant ein neues Produkt. Stelle ein, wie viele Stück sie im Jahr herstellt, wie stark die Kundinnen und Kunden mitbestimmen und wie die Produktion angeordnet ist.",
  sliders: [{ key: "menge", label: "Stückzahl im Jahr", min: 0, max: 6, step: 1, unit: "Stück", value: 2, show: (v) => fmt(AMOUNTS[v] ?? 1) }],
  selects: [
    {
      key: "wunsch",
      label: "Kundenwunsch",
      options: [
        { value: 0, label: "Jedes Stück ein Einzelstück nach Wunsch" },
        { value: 1, label: "Grundmodell in wählbaren Varianten" },
        { value: 2, label: "Alle Stücke gleich" },
      ],
      value: 2,
    },
    { key: "verfahren", label: "Fertigungsverfahren", options: [{ value: 0, label: "Werkstattfertigung" }, { value: 1, label: "Fließfertigung" }], value: 0 },
  ],
  goals: [
    { id: "einzel", text: "Plane ein Einzelstück nach Kundenwunsch in einer passenden Werkstattfertigung.", test: (s) => typeOf(s) === "einzel" && s.verfahren === 0 },
    { id: "varianten", text: "Plane mindestens 1.000 Stück in Varianten auf einer Fließfertigung.", test: (s) => typeOf(s) === "varianten" && s.menge >= 3 && s.verfahren === 1 },
    { id: "masse", text: "Plane eine Massenfertigung mit dem passenden Verfahren.", test: (s) => typeOf(s) === "masse" && s.verfahren === 1 },
    { id: "fehlgriff", text: "Zeige einen Fehlgriff: ein Fließband für Einzelstücke nach Kundenwunsch.", test: (s) => typeOf(s) === "einzel" && s.verfahren === 1 },
  ],
  witness: {
    einzel: { menge: 2, wunsch: 0, verfahren: 0 },
    varianten: { menge: 4, wunsch: 1, verfahren: 1 },
    masse: { menge: 5, wunsch: 2, verfahren: 1 },
    fehlgriff: { menge: 2, wunsch: 0, verfahren: 1 },
  },
  view(s) {
    const t = typeOf(s);
    const ok = fits(s);
    const products = Array.from({ length: 6 }, (_, i) => {
      const shape = t === "einzel" ? i % 3 : 0;
      const tone = t === "varianten" ? i % 3 : t === "einzel" ? (i + 1) % 3 : 0;
      const x = 40 + i * 64;
      return shape === 0
        ? `<rect class="lab-piece lab-piece-${tone}" x="${x}" y="226" width="34" height="34" rx="6"/>`
        : shape === 1
          ? `<circle class="lab-piece lab-piece-${tone}" cx="${x + 17}" cy="243" r="18"/>`
          : `<path class="lab-piece lab-piece-${tone}" d="M${x + 17} 224 l19 36 h-38 z"/>`;
    }).join("");
    const floor =
      s.verfahren === 0
        ? `${["Sägen", "Bohren", "Lackieren"].map((n, i) => `<rect class="lab-station lab-station-${i}" x="${30 + (i % 2) * 220}" y="${30 + Math.floor(i / 2) * 90}" width="180" height="70" rx="12"/><text class="lab-text lab-text-strong" x="${120 + (i % 2) * 220}" y="${70 + Math.floor(i / 2) * 90}" text-anchor="middle">Werkstatt ${n}</text>`).join("")}
           <path class="lab-flow lab-flow-money lab-dashed" d="M120 100 C 150 150, 300 40, 340 100 M340 100 C 320 160, 140 120, 120 120"/>`
        : `${["Sägen", "Bohren", "Lackieren", "Montage"].map((n, i) => `<rect class="lab-station lab-station-${i % 3}" x="${20 + i * 110}" y="60" width="96" height="60" rx="10"/><text class="lab-text lab-text-strong" x="${68 + i * 110}" y="95" text-anchor="middle">${n}</text>`).join("")}
           <path class="lab-conveyor" d="M20 140 H450"/><text class="lab-text lab-text-muted" x="20" y="164">Fließband im festen Takt</text>`;
    return {
      figure: svg("Anordnung der Fertigung und Beispiele der Produkte", `${floor}<text class="lab-text lab-text-muted" x="40" y="214">So sehen die Produkte aus:</text>${products}`, 470, 280),
      readouts: [
        ["Stückzahl im Jahr", fmt(AMOUNTS[s.menge] ?? 1)],
        ["Fertigungstyp", TYPE_NAME[t]],
        ["Passt das Verfahren?", ok ? "ja" : "nein"],
      ],
      note: ok
        ? s.verfahren === 0
          ? "Werkstattfertigung: Gleichartige Maschinen stehen zusammen, das Werkstück wandert von Werkstatt zu Werkstatt. Das ist flexibel, aber die Wege und Wartezeiten sind lang."
          : "Fließfertigung: Die Stationen stehen in der Reihenfolge des Ablaufs, das Werkstück läuft im Takt weiter. Das ist schnell und günstig je Stück, aber teuer in der Anschaffung und wenig flexibel."
        : s.verfahren === 1
          ? "Ein Fließband lohnt sich erst bei großen Stückzahlen gleichartiger Produkte. Für Einzelstücke oder kleine Serien ist es zu starr und zu teuer."
          : "Für so viele Stücke ist die Werkstattfertigung zu langsam: Transportwege, Zwischenlager und Umrüsten treiben die Kosten je Stück.",
    };
  },
};

/* ------------------------------------------------------------------ */
/* Produktlebenszyklus mit passenden Maßnahmen.                        */

const PHASES = [
  { name: "Einführung", from: 0, to: 8 },
  { name: "Wachstum", from: 9, to: 20 },
  { name: "Reife", from: 21, to: 34 },
  { name: "Sättigung", from: 35, to: 46 },
  { name: "Rückgang", from: 47, to: 60 },
] as const;
const phaseOf = (month: number) => PHASES.findIndex((p) => month >= p.from && month <= p.to);
/** Umsatz und Gewinn als Index (Höchstwert Umsatz = 100). */
export const revenue = (t: number) => 100 * Math.exp(-(((t - 32) / 14) ** 2));
export const profit = (t: number) => 0.9 * revenue(t + 3) - 25;
const MEASURES = [
  "Bekanntheit schaffen: Einführungswerbung, Proben",
  "Kunden binden: Treueaktionen, Verkaufsförderung",
  "Produkt verändern: neue Variante, Relaunch",
  "Produkt vom Markt nehmen (Elimination)",
];
const PRICES = ["Abschöpfung: hoch einsteigen", "Durchdringung: niedrig einsteigen", "Preis halten", "Preis senken (Abverkauf)"];

export const LEBENSZYKLUS: LabDef = {
  kind: "lebenszyklus",
  title: "Produktlebenszyklus einer Trinkflasche",
  intro:
    "Eine neue Trinkflasche kommt auf den Markt. Bewege dich mit dem Regler durch fünf Jahre und wähle Maßnahmen. Umsatz und Gewinn sind als Index dargestellt, der höchste Umsatz entspricht 100.",
  sliders: [{ key: "t", label: "Monate seit Markteinführung", min: 0, max: 60, step: 1, unit: "Monate", value: 2 }],
  selects: [
    { key: "m", label: "Maßnahme", options: MEASURES.map((label, value) => ({ value, label })), value: 3 },
    { key: "p", label: "Preisstrategie", options: PRICES.map((label, value) => ({ value, label })), value: 2 },
  ],
  goals: [
    { id: "reife", text: "Finde die Phase, in der der Umsatz am höchsten ist.", test: (s) => phaseOf(s.t) === 2 },
    { id: "variation", text: "Der Markt ist gesättigt. Wähle die Maßnahme, die den Zyklus verlängern kann.", test: (s) => phaseOf(s.t) === 3 && s.m === 2 },
    { id: "elimination", text: "Der Umsatz bricht ein und der Gewinn wird negativ. Wähle die passende Maßnahme.", test: (s) => phaseOf(s.t) === 4 && profit(s.t) < 0 && s.m === 3 },
    {
      id: "konzept-start",
      text: "Stelle ein stimmiges Konzept für die Einführung zusammen: Bekanntheit schaffen und eine Einführungspreisstrategie.",
      test: (s) => phaseOf(s.t) === 0 && s.m === 0 && (s.p === 0 || s.p === 1),
    },
    { id: "konzept-reife", text: "Stelle ein stimmiges Konzept für die Reife zusammen: Kunden binden und den Preis halten.", test: (s) => phaseOf(s.t) === 2 && s.m === 1 && s.p === 2 },
    { id: "konzept-ende", text: "Stelle ein stimmiges Konzept für das Ende zusammen: Produkt auslaufen lassen und Restbestände abverkaufen.", test: (s) => phaseOf(s.t) === 4 && s.m === 3 && s.p === 3 },
  ],
  witness: {
    reife: { t: 30, m: 3, p: 2 },
    variation: { t: 40, m: 2, p: 2 },
    elimination: { t: 56, m: 3, p: 2 },
    "konzept-start": { t: 2, m: 0, p: 1 },
    "konzept-reife": { t: 30, m: 1, p: 2 },
    "konzept-ende": { t: 56, m: 3, p: 3 },
  },
  view(s) {
    const x = (t: number) => mapRange(t, [0, 60], [40, 450]);
    const y = (v: number) => mapRange(v, [-30, 110], [250, 20]);
    const bands = PHASES.map(
      (p, i) => `<rect class="lab-phase lab-phase-${i}" x="${x(p.from)}" y="20" width="${x(p.to + 1) - x(p.from)}" height="230"/><text class="lab-text lab-text-muted" x="${(x(p.from) + x(p.to + 1)) / 2}" y="270" text-anchor="middle">${p.name}</text>`,
    ).join("");
    const curve = (f: (t: number) => number) => points(Array.from({ length: 61 }, (_, t) => [x(t), y(f(t))] as [number, number]));
    const phase = phaseOf(s.t);
    const body = `${bands}<line class="lab-axis" x1="40" y1="${y(0)}" x2="450" y2="${y(0)}"/>
      <polyline class="lab-line lab-line-demand" points="${curve(revenue)}"/>
      <polyline class="lab-line lab-line-supply lab-dashed" points="${curve(profit)}"/>
      <line class="lab-marker" x1="${x(s.t)}" y1="20" x2="${x(s.t)}" y2="250"/>
      <circle class="lab-dot-demand" cx="${x(s.t)}" cy="${y(revenue(s.t))}" r="6"/>
      <circle class="lab-dot-supply" cx="${x(s.t)}" cy="${y(profit(s.t))}" r="6"/>
      <text class="lab-text lab-text-demand lab-text-strong" x="48" y="36">Umsatz</text>
      <text class="lab-text lab-text-supply lab-text-strong" x="110" y="36">Gewinn</text>
      <text class="lab-text lab-text-muted" x="6" y="${y(0) + 4}">0</text>`;
    const fitting = [
      [0],
      [0, 1],
      [1],
      [2, 1],
      [3],
    ][phase].includes(s.m);
    const g = Math.round(profit(s.t));
    return {
      figure: svg("Produktlebenszyklus mit Umsatz- und Gewinnkurve", body, 470, 280),
      readouts: [
        ["Phase", PHASES[phase].name],
        ["Umsatz (Index)", fmt(Math.round(revenue(s.t)))],
        ["Gewinn (Index)", fmt(g === 0 ? 0 : g)],
        ["Maßnahme passt zur Phase", fitting ? "ja" : "eher nicht"],
      ],
      note: [
        "Einführung: Kaum jemand kennt das Produkt, die Kosten für Entwicklung und Werbung sind hoch, der Gewinn ist negativ.",
        "Wachstum: Der Umsatz steigt schnell, das Produkt wird bekannt, Nachahmer kommen auf den Markt.",
        "Reife: Der Umsatz erreicht seinen Höhepunkt. Jetzt geht es darum, Kunden zu halten.",
        "Sättigung: Fast alle, die das Produkt wollen, haben es. Eine Variation oder ein Relaunch kann den Zyklus verlängern.",
        "Rückgang: Umsatz und Gewinn sinken. Das Unternehmen prüft, ob es das Produkt vom Markt nimmt.",
      ][phase],
    };
  },
};

/* ------------------------------------------------------------------ */
/* Vier-Felder-Portfolio.                                              */

const FIELD = (s: LabState) => {
  const high = s.wachstum >= 10;
  const strong = s.anteil >= 1 - 1e-9;
  if (high && strong) return { name: "Star", strategy: "investieren und den Vorsprung ausbauen", role: "wächst mit dem Markt und hält ihn an der Spitze" };
  if (!high && strong) return { name: "Cash Cow (Melkkuh)", strategy: "Position halten und Gewinne abschöpfen", role: "bringt hohe Überschüsse, mit denen andere Produkte finanziert werden" };
  if (high && !strong) return { name: "Question Mark (Fragezeichen)", strategy: "gezielt investieren oder aufgeben", role: "hat Chancen, kostet aber viel Geld" };
  return { name: "Poor Dog (armer Hund)", strategy: "Rückzug prüfen", role: "bringt wenig und hat kaum Aussicht auf Wachstum" };
};

export const PORTFOLIO: LabDef = {
  kind: "portfolio",
  title: "Vier-Felder-Portfolio: Wo steht das Produkt?",
  intro:
    "Ein Sportartikelhersteller prüft seine Produkte. Stelle das Wachstum des Marktes und den relativen Marktanteil ein. Der relative Marktanteil vergleicht den eigenen Anteil mit dem des größten Konkurrenten: 1 bedeutet gleich groß.",
  sliders: [
    { key: "wachstum", label: "Marktwachstum pro Jahr", min: 0, max: 20, step: 1, unit: "%", value: 4 },
    { key: "anteil", label: "Relativer Marktanteil", min: 0.2, max: 2, step: 0.1, unit: "", value: 0.5 },
  ],
  selects: [],
  goals: [
    { id: "star", text: "Mache das Produkt zum Star.", test: (s) => FIELD(s).name === "Star" },
    { id: "cash", text: "Mache das Produkt zur Cash Cow.", test: (s) => FIELD(s).name.startsWith("Cash") },
    { id: "question", text: "Mache das Produkt zum Question Mark.", test: (s) => FIELD(s).name.startsWith("Question") },
  ],
  witness: {
    star: { wachstum: 12, anteil: 1.5 },
    cash: { wachstum: 4, anteil: 1.5 },
    question: { wachstum: 15, anteil: 0.5 },
  },
  view(s) {
    const f = FIELD(s);
    const x = (v: number) => mapRange(v, [0.2, 2], [70, 450]);
    const y = (v: number) => mapRange(v, [0, 20], [250, 20]);
    const cells = [
      { name: "Question Mark", x0: x(0.2), y0: y(20), cls: 0 },
      { name: "Star", x0: x(1), y0: y(20), cls: 1 },
      { name: "Poor Dog", x0: x(0.2), y0: y(10), cls: 2 },
      { name: "Cash Cow", x0: x(1), y0: y(10), cls: 3 },
    ];
    const body = `${cells
      .map(
        (c) =>
          `<rect class="lab-quad lab-quad-${c.cls}${f.name.startsWith(c.name) ? " lab-quad-on" : ""}" x="${c.x0}" y="${c.y0}" width="${c.x0 === x(0.2) ? x(1) - x(0.2) : x(2) - x(1)}" height="${y(10) - y(20)}"/><text class="lab-text lab-text-strong" x="${c.x0 + 10}" y="${c.y0 + 22}">${c.name}</text>`,
      )
      .join("")}
      <line class="lab-axis" x1="70" y1="250" x2="450" y2="250"/><line class="lab-axis" x1="70" y1="20" x2="70" y2="250"/>
      <text class="lab-text lab-text-muted" x="70" y="270">relativer Marktanteil 0,2</text><text class="lab-text lab-text-muted" x="${x(1) - 6}" y="270">1</text><text class="lab-text lab-text-muted" x="430" y="270">2</text>
      <text class="lab-text lab-text-muted" x="4" y="${y(10) + 4}">10 %</text><text class="lab-text lab-text-muted" x="4" y="28">20 %</text><text class="lab-text lab-text-muted" x="4" y="254">0 %</text>
      <circle class="lab-bubble" cx="${x(s.anteil)}" cy="${y(s.wachstum)}" r="16"/>`;
    return {
      figure: svg("Vier-Felder-Matrix mit der Lage des Produkts", body, 470, 280),
      readouts: [
        ["Feld", f.name],
        ["Normstrategie", f.strategy],
        ["Marktwachstum", `${fmt(s.wachstum)} %`],
        ["Relativer Marktanteil", fmt(s.anteil)],
      ],
      note: `Das Produkt liegt im Feld ${f.name}: Es ${f.role}. Ein ausgewogenes Sortiment braucht Produkte in mehreren Feldern.`,
    };
  },
};

/* ------------------------------------------------------------------ */
/* Preiskalkulation mit Umsatzsteuer und Aktionsrabatt.                */

export const VAT = 0.19;
const net = (s: LabState) => s.sk * (1 + s.gz / 100);
const gross = (s: LabState) => net(s) * (1 + VAT);
const unitProfit = (s: LabState) => net(s) * (1 - s.rabatt / 100) - s.sk;

export const KALKULATION: LabDef = {
  kind: "kalkulation",
  title: "Vom Selbstkostenpreis zum Ladenpreis",
  intro:
    "Ein Fahrradladen kalkuliert den Preis für einen Helm. Auf die Selbstkosten kommt ein Gewinnzuschlag, auf den Nettopreis 19 % Umsatzsteuer. Ein Aktionsrabatt senkt den Ladenpreis und damit auch den Gewinn.",
  sliders: [
    { key: "sk", label: "Selbstkosten je Helm", min: 20, max: 100, step: 5, unit: "€", value: 40 },
    { key: "gz", label: "Gewinnzuschlag", min: 0, max: 50, step: 5, unit: "%", value: 20 },
    { key: "rabatt", label: "Aktionsrabatt", min: 0, max: 30, step: 5, unit: "%", value: 0 },
  ],
  selects: [],
  goals: [
    {
      id: "schwelle",
      text: "Kalkuliere einen Ladenpreis knapp unter 50 €, also zwischen 49,00 € und 49,99 €.",
      test: (s) => gross(s) >= 49 - 1e-9 && gross(s) < 50 - 0.005,
    },
    { id: "verlust", text: "Zeige, wie ein zu hoher Rabatt den Helm unter Selbstkosten verkauft.", test: (s) => unitProfit(s) < -1e-9 },
    { id: "rabatt-gewinn", text: "Gib mindestens 10 % Rabatt und erziele trotzdem noch Gewinn.", test: (s) => s.rabatt >= 10 && unitProfit(s) > 1e-9 },
  ],
  witness: {
    schwelle: { sk: 35, gz: 20, rabatt: 0 },
    verlust: { sk: 40, gz: 10, rabatt: 20 },
    "rabatt-gewinn": { sk: 40, gz: 30, rabatt: 10 },
  },
  view(s) {
    const n = net(s);
    const g = gross(s);
    const action = g * (1 - s.rabatt / 100);
    const profit = unitProfit(s);
    // Fit the gross price into the drawing; the marker and the labels move with it.
    const scale = 300 / Math.max(60, g);
    const seg = (x: number, w: number, cls: string, y: number, label: string) =>
      `<rect class="${cls}" x="${x}" y="${y}" width="${Math.max(0, w)}" height="30" rx="4"/>${w > 46 ? `<text class="lab-node-text" x="${x + w / 2}" y="${y + 20}" text-anchor="middle" style="font-size:12px">${label}</text>` : ""}`;
    const body = `<text class="lab-text lab-text-strong" x="8" y="22">Kalkulation</text>
      ${seg(90, s.sk * scale, "lab-bar-0", 34, "Selbstkosten")}
      ${seg(90 + s.sk * scale, (n - s.sk) * scale, "lab-bar-1", 34, "Gewinn")}
      ${seg(90 + n * scale, (g - n) * scale, "lab-bar-2", 34, "USt")}
      <text class="lab-text lab-text-strong" x="${96 + g * scale}" y="55">${euro(g)} €</text>
      <text class="lab-text lab-text-strong" x="8" y="112">Aktion</text>
      <rect class="lab-bar-2" x="90" y="96" width="${action * scale}" height="30" rx="4"/>
      <line class="lab-marker" x1="${90 + s.sk * (1 + VAT) * scale}" y1="88" x2="${90 + s.sk * (1 + VAT) * scale}" y2="134"/>
      <text class="lab-text lab-text-muted" x="${Math.min(300, 92 + s.sk * (1 + VAT) * scale)}" y="150">Selbstkosten mit USt</text>
      <text class="lab-text lab-text-strong" x="${96 + action * scale}" y="117">${euro(action)} €</text>
      <text class="lab-text" x="8" y="190">Gewinn je Helm in der Aktion: ${profit < 0 ? "−" : ""}${euro(Math.abs(profit))} €</text>`;
    return {
      figure: svg("Preiskalkulation als Balken aus Selbstkosten, Gewinn und Umsatzsteuer", body, 470, 210),
      readouts: [
        ["Nettoverkaufspreis", `${euro(n)} €`],
        ["Bruttoverkaufspreis", `${euro(g)} €`],
        ["Aktionspreis", `${euro(action)} €`],
        ["Gewinn je Helm", `${profit < 0 ? "−" : ""}${euro(Math.abs(profit))} €`],
      ],
      note:
        profit < -1e-9
          ? "Verlust: Der Rabatt ist größer als der eingerechnete Gewinn. Das kann als Lockangebot gewollt sein, auf Dauer aber nicht."
          : "Die Umsatzsteuer gehört nicht dem Laden, er führt sie an das Finanzamt ab. Sein Gewinn ist der Nettopreis abzüglich der Selbstkosten.",
    };
  },
};
