import { euro, fmt } from "../format";
import { type LabDef, type LabState, mapRange, points, svg } from "./engine";

/* ------------------------------------------------------------------ */
/* Entscheidungsmatrix: weighted criteria decide between three offers. */

const CRITERIA = ["Preis", "Klang", "Akku", "Nachhaltigkeit"] as const;
const WEIGHT_KEYS = ["wP", "wK", "wA", "wN"] as const;
/** Invented ratings from 1 (schwach) to 5 (stark); each offer sums to 13, so equal weights tie. */
const OFFERS = [
  { name: "Kopfhörer A · günstig", ratings: [5, 2, 4, 2] },
  { name: "Kopfhörer B · klangstark", ratings: [2, 5, 4, 2] },
  { name: "Kopfhörer C · reparierbar", ratings: [3, 3, 2, 5] },
] as const;

/** Weighted sums as whole numbers, so ties are exact. */
const weightedSums = (s: LabState): number[] =>
  OFFERS.map((o) => WEIGHT_KEYS.reduce((sum, key, i) => sum + s[key] * o.ratings[i], 0));
const weightTotal = (s: LabState) => WEIGHT_KEYS.reduce((sum, key) => sum + s[key], 0);
const leader = (s: LabState): number => {
  const sums = weightedSums(s);
  const best = Math.max(...sums);
  const top = sums.flatMap((v, i) => (v === best ? [i] : []));
  return weightTotal(s) === 0 || top.length !== 1 ? -1 : top[0];
};

export const NUTZWERT: LabDef = {
  kind: "nutzwert",
  title: "Die Entscheidungsmatrix: Kriterien gewichten",
  intro:
    "Drei erfundene Kopfhörer sind nach vier Kriterien von 1 bis 5 bewertet. Du legst fest, wie wichtig dir jedes Kriterium ist. Der Nutzwert ist der gewichtete Durchschnitt der Bewertungen.",
  sliders: CRITERIA.map((label, i) => ({
    key: WEIGHT_KEYS[i],
    label: `Gewicht: ${label}`,
    min: 0,
    max: 10,
    step: 1,
    unit: "",
    value: 5,
  })),
  selects: [],
  goals: [
    { id: "a", text: "Gewichte so, dass der günstige Kopfhörer A allein vorne liegt.", test: (s) => leader(s) === 0 },
    { id: "b", text: "Gewichte so, dass der klangstarke Kopfhörer B allein vorne liegt.", test: (s) => leader(s) === 1 },
    { id: "c", text: "Gewichte so, dass der reparierbare Kopfhörer C allein vorne liegt.", test: (s) => leader(s) === 2 },
    {
      id: "ein-gewicht",
      text: "Bei gleichen Gewichten liegen alle gleichauf. Ändere nur ein einziges Gewicht und erzeuge einen klaren Sieger.",
      test: (s) => WEIGHT_KEYS.filter((key) => s[key] === 5).length === 3 && leader(s) !== -1,
    },
  ],
  witness: {
    a: { wP: 10, wK: 0, wA: 0, wN: 0 },
    b: { wP: 0, wK: 10, wA: 0, wN: 0 },
    c: { wP: 0, wK: 0, wA: 0, wN: 10 },
    "ein-gewicht": { wP: 6, wK: 5, wA: 5, wN: 5 },
  },
  view(s) {
    const total = weightTotal(s);
    const scores = weightedSums(s).map((sum) => (total === 0 ? 0 : sum / total));
    const lead = leader(s);
    const rows = OFFERS.map((offer, i) => {
      const y = 34 + i * 82;
      return `<text class="lab-text lab-text-strong" x="12" y="${y - 10}">${offer.name}</text>
        <rect class="lab-track" x="12" y="${y}" width="330" height="28" rx="8"/>
        <rect class="lab-bar lab-bar-${i}${lead === i ? " lab-bar-win" : ""}" x="12" y="${y}" width="${Math.round((scores[i] / 5) * 330)}" height="28" rx="8"/>
        <text class="lab-text lab-text-strong" x="352" y="${y + 19}">${fmt(Math.round(scores[i] * 100) / 100)}${lead === i ? " 🏆" : ""}</text>
        <text class="lab-text lab-text-muted" x="12" y="${y + 46}">${CRITERIA.map((c, k) => `${c} ${offer.ratings[k]}`).join(" · ")}</text>`;
    }).join("");
    return {
      figure: svg("Nutzwerte der drei Kopfhörer als Balken", rows, 480, 270),
      readouts: [
        ...OFFERS.map((o, i) => [o.name, fmt(Math.round(scores[i] * 100) / 100)] as [string, string]),
        ["Summe der Gewichte", String(total)],
      ],
      note:
        lead === -1
          ? "Gleichstand oder kein Gewicht gesetzt: Die Matrix nimmt dir die Entscheidung nicht ab, solange du nicht sagst, was dir wichtig ist."
          : `Mit deinen Gewichten gewinnt ${OFFERS[lead].name}. Dieselben Bewertungen führen bei anderen Gewichten zu einem anderen Sieger: Die Gewichte sind deine persönlichen Anreize.`,
    };
  },
};

/* ------------------------------------------------------------------ */
/* Preisschild: threshold prices and anchor prices.                     */

const AVERAGE = 19;
const shownDiscount = (s: LabState) => (s.anker > s.price ? 1 - s.price / s.anker : 0);

export const PREISSCHILD: LabDef = {
  kind: "preisschild",
  title: "Preisschild-Werkstatt: Schwelle und Anker",
  intro:
    "Du gestaltest das Preisschild für eine Powerbank. Im Durchschnitt kostet ein vergleichbares Modell 19,00 €. Stelle Endpreis und Streichpreis ein und beobachte, was das Schild dem Gehirn erzählt.",
  sliders: [
    { key: "price", label: "Endpreis", min: 17.5, max: 21, step: 0.01, unit: "€", value: 20, show: euro },
    { key: "anker", label: "Streichpreis (0 = keiner)", min: 0, max: 40, step: 1, unit: "€", value: 0, show: euro },
  ],
  selects: [],
  goals: [
    {
      id: "schwelle",
      text: "Setze einen Schwellenpreis: knapp unter 20 €, sodass vorne eine 1 statt einer 2 steht.",
      test: (s) => s.price >= 19.895 && s.price < 19.995,
    },
    {
      id: "anker",
      text: "Setze einen Streichpreis, der einen Rabatt von mindestens 30 % vorgaukelt.",
      test: (s) => shownDiscount(s) >= 0.3,
    },
    {
      id: "teuer-trotz-rabatt",
      text: "Zeige, wie ein Anker täuscht: Das Schild wirbt mit mindestens 25 % Rabatt, der Endpreis liegt aber über dem Durchschnitt von 19 €.",
      test: (s) => shownDiscount(s) >= 0.25 && s.price > AVERAGE,
    },
  ],
  witness: {
    schwelle: { price: 19.99, anker: 0 },
    anker: { price: 20, anker: 29 },
    "teuer-trotz-rabatt": { price: 20.5, anker: 28 },
  },
  view(s) {
    const discount = shownDiscount(s);
    const whole = Math.floor(s.price + 1e-9);
    const cents = Math.round((s.price - whole) * 100);
    const anchorText = s.anker > s.price ? `<text class="lab-text lab-text-muted lab-strike" x="80" y="98" style="font-size:24px">${euro(s.anker)} €</text><line class="lab-guide" x1="76" y1="90" x2="${80 + 18 * euro(s.anker).length}" y2="90"/>` : "";
    const badge =
      discount > 0
        ? `<circle class="lab-badge" cx="372" cy="88" r="44"/><text class="lab-badge-text" x="372" y="96" text-anchor="middle" style="font-size:26px">−${Math.round(discount * 100)} %</text>`
        : "";
    const body = `<path class="lab-tag" d="M40 40 H400 Q420 40 420 60 V240 Q420 260 400 260 H40 L12 150 Z"/>
      <circle class="lab-tag-hole" cx="44" cy="150" r="9"/>
      <text class="lab-text lab-text-muted" x="80" y="66" style="font-size:15px">Powerbank 10.000 mAh</text>
      ${anchorText}
      <text class="lab-text lab-text-strong lab-price-big" x="80" y="190" style="font-size:76px">${whole}</text>
      <text class="lab-text lab-text-strong" x="${80 + 44 * String(whole).length}" y="160" style="font-size:38px">,${String(cents).padStart(2, "0")} €</text>
      <text class="lab-text lab-text-muted" x="80" y="228" style="font-size:14px">Durchschnittspreis vergleichbarer Modelle: ${euro(AVERAGE)} €</text>
      ${badge}`;
    return {
      figure: svg("Preisschild mit Endpreis, Streichpreis und Rabattangabe", body, 440, 280),
      readouts: [
        ["Endpreis", `${euro(s.price)} €`],
        ["Erste Ziffer", String(whole).slice(0, 1)],
        ["Rabatt laut Streichpreis", `${Math.round(discount * 100)} %`],
        ["Abstand zum Durchschnitt", `${s.price >= AVERAGE ? "" : "−"}${euro(Math.abs(s.price - AVERAGE))} €`],
      ],
      note:
        s.price >= 19.895 && s.price < 19.995
          ? "Schwelleneffekt: Wir lesen von links nach rechts und gewichten die erste Ziffer stark. 19,99 € wirkt deutlich billiger als 20 €, obwohl nur ein Cent fehlt."
          : discount >= 0.25
            ? "Ankereffekt: Der durchgestrichene Preis setzt einen Vergleichsmaßstab. Ob das Angebot günstig ist, verrät erst der Vergleich mit anderen Anbietern."
            : "Noch wirkt das Schild nüchtern. Probiere einen Preis knapp unter einer runden Zahl oder einen hohen Streichpreis.",
    };
  },
};

/* ------------------------------------------------------------------ */
/* Kaufkraft: what 1.000 € can buy after years of inflation.           */

const START = 1000;
const realValue = (s: LabState, years = s.years) => START * ((1 + s.zins / 100) / (1 + s.inflation / 100)) ** years;
const nominalValue = (s: LabState, years = s.years) => START * (1 + s.zins / 100) ** years;

export const KAUFKRAFT: LabDef = {
  kind: "kaufkraft",
  title: "Was sind 1.000 € in einigen Jahren noch wert?",
  intro:
    "Du legst 1.000 € zurück. Stelle Inflationsrate, Sparzins und Jahre ein. Die Kurve zeigt den Kontostand und die Kaufkraft, gemessen in heutigen Preisen. Alle Werte sind Modellannahmen.",
  sliders: [
    { key: "inflation", label: "Inflationsrate pro Jahr", min: -2, max: 10, step: 0.5, unit: "%", value: 2 },
    { key: "zins", label: "Sparzins pro Jahr", min: 0, max: 6, step: 0.5, unit: "%", value: 0 },
    { key: "years", label: "Anlagedauer", min: 1, max: 20, step: 1, unit: "Jahre", value: 1 },
  ],
  selects: [],
  goals: [
    { id: "verlust", text: "Lass die Kaufkraft der 1.000 € unter 900 € fallen.", test: (s) => realValue(s) < 900 },
    {
      id: "ausgleich",
      text: "Es gibt Inflation. Wähle einen Sparzins, der den Kaufkraftverlust genau ausgleicht.",
      test: (s) => s.inflation > 0 && s.zins === s.inflation,
    },
    { id: "halbiert", text: "Finde eine Lage, in der sich die Kaufkraft mindestens halbiert.", test: (s) => realValue(s) <= 500 },
    {
      id: "deflation",
      text: "Zeige eine Deflation: Ohne Zinsen kann man mit dem Geld später mehr kaufen als heute.",
      test: (s) => s.inflation < 0 && s.zins === 0 && realValue(s) > START,
    },
  ],
  witness: {
    verlust: { inflation: 4, zins: 0, years: 3 },
    ausgleich: { inflation: 3, zins: 3, years: 1 },
    halbiert: { inflation: 10, zins: 0, years: 8 },
    deflation: { inflation: -1, zins: 0, years: 1 },
  },
  view(s) {
    const years = s.years;
    const top = Math.max(1200, nominalValue(s) * 1.05, realValue(s) * 1.05);
    const x = (n: number) => mapRange(n, [0, years], [56, 450]);
    const y = (v: number) => mapRange(v, [0, top], [250, 24]);
    const series = (f: (n: number) => number) =>
      points(Array.from({ length: years + 1 }, (_, n) => [x(n), y(f(n))] as [number, number]));
    const real = realValue(s);
    const body = `<line class="lab-axis" x1="56" y1="250" x2="456" y2="250"/><line class="lab-axis" x1="56" y1="20" x2="56" y2="250"/>
      <line class="lab-guide" x1="56" y1="${y(START)}" x2="456" y2="${y(START)}"/>
      <text class="lab-text lab-text-muted" x="8" y="${y(START) + 4}">1.000</text>
      <text class="lab-text lab-text-muted" x="8" y="254">0 €</text>
      <polyline class="lab-line lab-line-supply" points="${series((n) => nominalValue(s, n))}"/>
      <polyline class="lab-line lab-line-demand" points="${series((n) => realValue(s, n))}"/>
      <circle class="lab-dot-demand" cx="${x(years)}" cy="${y(real)}" r="6"/>
      <text class="lab-text lab-text-supply lab-text-strong" x="64" y="20">Kontostand</text>
      <text class="lab-text lab-text-demand lab-text-strong" x="160" y="20">Kaufkraft in heutigen Preisen</text>
      <text class="lab-text lab-text-muted" x="56" y="270">heute</text>
      <text class="lab-text lab-text-muted" x="400" y="270">in ${years} ${years === 1 ? "Jahr" : "Jahren"}</text>`;
    const change = real - START;
    return {
      figure: svg("Kontostand und Kaufkraft im Zeitverlauf", body, 470, 280),
      readouts: [
        ["Kontostand", `${euro(nominalValue(s))} €`],
        ["Kaufkraft in heutigen Preisen", `${euro(real)} €`],
        ["Veränderung der Kaufkraft", `${change < 0 ? "−" : "+"}${euro(Math.abs(change))} €`],
      ],
      note:
        s.inflation < 0
          ? "Bei Deflation sinken die Preise: Gespartes Geld gewinnt Kaufkraft. Wer aber auf noch tiefere Preise wartet und Käufe aufschiebt, bremst die Wirtschaft."
          : s.zins > s.inflation
            ? "Der Zins liegt über der Inflationsrate: Die Kaufkraft deines Ersparten wächst."
            : s.zins === s.inflation
              ? "Zins und Inflationsrate sind gleich hoch: Der Kontostand wächst, die Kaufkraft bleibt gleich."
              : "Die Preise steigen schneller als der Kontostand: Sparer verlieren Kaufkraft, auch wenn die Zahl auf dem Konto gleich bleibt oder wächst.",
    };
  },
};

/* ------------------------------------------------------------------ */
/* Haushaltsplan: a small spreadsheet with a savings goal.             */

const GOAL = 240;
const income = (s: LabState) => s.tg + s.job;
const spending = (s: LabState) => s.handy + s.freizeit + s.snacks;
const surplus = (s: LabState) => income(s) - spending(s);

export const BUDGET: LabDef = {
  kind: "budget",
  title: "Haushaltsplan in der Tabellenkalkulation",
  intro:
    "Lea spart auf ein gebrauchtes Fahrrad für 240 €. Ändere ihre monatlichen Einnahmen und Ausgaben. Die Tabelle rechnet mit Formeln wie in einem Tabellenkalkulationsprogramm.",
  sliders: [
    { key: "tg", label: "Taschengeld", min: 20, max: 80, step: 5, unit: "€", value: 40 },
    { key: "job", label: "Nebenjob", min: 0, max: 100, step: 10, unit: "€", value: 0 },
    { key: "handy", label: "Handyvertrag (fix)", min: 0, max: 30, step: 5, unit: "€", value: 15 },
    { key: "freizeit", label: "Freizeit (variabel)", min: 0, max: 80, step: 5, unit: "€", value: 30 },
    { key: "snacks", label: "Snacks (variabel)", min: 0, max: 40, step: 5, unit: "€", value: 15 },
  ],
  selects: [],
  goals: [
    { id: "ausgeglichen", text: "Gleiche den Plan genau aus: Einnahmen und Ausgaben sind gleich hoch.", test: (s) => surplus(s) === 0 },
    { id: "zehn-monate", text: "Plane so, dass Lea das Fahrrad in höchstens zehn Monaten zusammenhat.", test: (s) => surplus(s) >= GOAL / 10 },
    {
      id: "nur-variabel",
      text: "Erreiche ohne mehr Einnahmen und ohne den Handyvertrag zu ändern eine Sparrate von mindestens 20 €.",
      test: (s) => s.tg === 40 && s.job === 0 && s.handy === 15 && surplus(s) >= 20,
    },
  ],
  witness: {
    ausgeglichen: { tg: 40, job: 0, handy: 15, freizeit: 10, snacks: 15 },
    "zehn-monate": { tg: 40, job: 50, handy: 15, freizeit: 30, snacks: 15 },
    "nur-variabel": { tg: 40, job: 0, handy: 15, freizeit: 5, snacks: 0 },
  },
  view(s) {
    const rest = surplus(s);
    const months = rest > 0 ? Math.ceil(GOAL / rest) : 0;
    const cell = (value: number) => `${value < 0 ? "−" : ""}${euro(Math.abs(value))}`;
    const row = (n: number, a: string, b: string, cls = "") =>
      `<tr class="${cls}"><th scope="row">${n}</th><td>${a}</td><td>${b}</td></tr>`;
    const table = `<table class="sheet"><thead><tr><th></th><th>A</th><th>B</th></tr></thead><tbody>
      ${row(1, "<b>Posten</b>", "<b>€ im Monat</b>")}
      ${row(2, "Taschengeld", cell(s.tg))}
      ${row(3, "Nebenjob", cell(s.job))}
      ${row(4, "Summe Einnahmen <code>=SUMME(B2:B3)</code>", cell(income(s)), "sheet-sum")}
      ${row(5, "Handyvertrag (fix)", cell(s.handy))}
      ${row(6, "Freizeit (variabel)", cell(s.freizeit))}
      ${row(7, "Snacks (variabel)", cell(s.snacks))}
      ${row(8, "Summe Ausgaben <code>=SUMME(B5:B7)</code>", cell(spending(s)), "sheet-sum")}
      ${row(9, "Sparrate <code>=B4-B8</code>", cell(rest), rest < 0 ? "sheet-bad" : "sheet-good")}
      ${row(10, "Monate bis 240 € <code>=AUFRUNDEN(240/B9;0)</code>", rest > 0 ? String(months) : "nicht erreichbar", rest > 0 ? "" : "sheet-bad")}
      </tbody></table>`;
    const full = Math.max(income(s), spending(s), 1);
    const bars = svg(
      "Einnahmen und Ausgaben im Vergleich",
      `<text class="lab-text lab-text-strong" x="8" y="22">Einnahmen</text>
       <rect class="lab-track" x="100" y="8" width="320" height="22" rx="6"/><rect class="lab-bar-1" x="100" y="8" width="${(income(s) / full) * 320}" height="22" rx="6"/>
       <text class="lab-text lab-text-strong" x="8" y="58">Ausgaben</text>
       <rect class="lab-track" x="100" y="44" width="320" height="22" rx="6"/><rect class="lab-bar-2" x="100" y="44" width="${(spending(s) / full) * 320}" height="22" rx="6"/>`,
      440,
      76,
    );
    return {
      figure: `<div class="sheet-wrap">${table}</div>${bars}`,
      readouts: [
        ["Sparrate", `${cell(rest)} €`],
        ["Bis zum Fahrrad", rest > 0 ? `${months} Monate` : "kein Fortschritt"],
      ],
      note:
        rest < 0
          ? "Die Ausgaben übersteigen die Einnahmen. Ohne Änderung muss Lea Geld leihen oder ihr Erspartes angreifen."
          : rest === 0
            ? "Ausgeglichen, aber ohne Sparrate: Für das Sparziel braucht Lea einen Überschuss."
            : "Ein Überschuss bringt Lea dem Sparziel näher. Fixe Kosten ändern sich kurzfristig kaum, variable Ausgaben kann sie selbst steuern.",
    };
  },
};

/* ------------------------------------------------------------------ */
/* Ratenkauf: what an instalment purchase really costs.                */

export function instalment(price: number, months: number, rate: number): number {
  if (rate === 0) return price / months;
  const q = rate / 1200;
  return (price * q) / (1 - (1 + q) ** -months);
}

export const KREDIT: LabDef = {
  kind: "kredit",
  title: "Ratenkauf: kleine Rate, große Summe?",
  intro:
    "Ein Laptop wird auf Raten angeboten. Stelle Kaufpreis, Laufzeit und effektiven Jahreszins ein. Das Modell rechnet mit gleich hohen Monatsraten.",
  sliders: [
    { key: "preis", label: "Kaufpreis", min: 300, max: 1500, step: 100, unit: "€", value: 600 },
    { key: "monate", label: "Laufzeit", min: 6, max: 48, step: 6, unit: "Monate", value: 12 },
    { key: "zins", label: "Effektiver Jahreszins", min: 0, max: 20, step: 1, unit: "%", value: 9 },
  ],
  selects: [],
  goals: [
    {
      id: "mehrkosten",
      text: "Stelle einen Kauf ein, bei dem die Zinsen mehr als 100 € zusätzlich kosten.",
      test: (s) => instalment(s.preis, s.monate, s.zins) * s.monate - s.preis > 100,
    },
    {
      id: "kleine-rate",
      text: "Drücke beim Laptop für 600 € die Monatsrate unter 30 € und vergleiche, was du insgesamt zahlst.",
      test: (s) => s.preis === 600 && s.zins > 0 && instalment(s.preis, s.monate, s.zins) < 30,
    },
    {
      id: "null-prozent",
      text: "Wähle eine Nullprozentfinanzierung über mindestens zwei Jahre.",
      test: (s) => s.zins === 0 && s.monate >= 24,
    },
  ],
  witness: {
    mehrkosten: { preis: 1500, monate: 24, zins: 9 },
    "kleine-rate": { preis: 600, monate: 24, zins: 9 },
    "null-prozent": { preis: 600, monate: 24, zins: 0 },
  },
  view(s) {
    const rate = instalment(s.preis, s.monate, s.zins);
    const total = rate * s.monate;
    const extra = total - s.preis;
    const scale = 340 / 2400;
    const blocks = Array.from({ length: s.monate }, (_, i) => {
      const col = i % 24;
      const line = Math.floor(i / 24);
      return `<rect class="lab-bar-0" x="${100 + col * 14}" y="${150 + line * 18}" width="11" height="12" rx="2"/>`;
    }).join("");
    const body = `<text class="lab-text lab-text-strong" x="8" y="34">Kaufpreis</text>
      <rect class="lab-bar-1" x="100" y="18" width="${s.preis * scale}" height="24" rx="6"/>
      <text class="lab-text" x="${108 + s.preis * scale}" y="35">${euro(s.preis)} €</text>
      <text class="lab-text lab-text-strong" x="8" y="84">Du zahlst</text>
      <rect class="lab-bar-1" x="100" y="68" width="${s.preis * scale}" height="24" rx="6"/>
      <rect class="lab-bar-2" x="${100 + s.preis * scale}" y="68" width="${Math.max(0, extra) * scale}" height="24" rx="6"/>
      <text class="lab-text" x="${108 + total * scale}" y="85">${euro(total)} €</text>
      <text class="lab-text lab-text-muted" x="100" y="116">orange: Zinsen und Kosten des Kredits</text>
      <text class="lab-text lab-text-strong" x="8" y="162">${s.monate} Raten</text>
      ${blocks}
      <text class="lab-text lab-text-muted" x="100" y="${s.monate > 24 ? 206 : 188}">je ${euro(rate)} € im Monat</text>`;
    return {
      figure: svg("Kaufpreis, Gesamtbetrag und Monatsraten", body, 460, 220),
      readouts: [
        ["Monatsrate", `${euro(rate)} €`],
        ["Gesamtbetrag", `${euro(total)} €`],
        ["Mehrkosten", `${euro(extra)} €`],
      ],
      note:
        s.zins === 0
          ? "Bei 0 % kostet der Kredit keine Zinsen. Trotzdem bindet die Rate dein Budget über die ganze Laufzeit, und oft lockt sie zu Käufen, die sonst nicht ins Budget passen."
          : "Eine längere Laufzeit senkt die Monatsrate, erhöht aber die Zinsen. Prüfe immer den Gesamtbetrag und frage, ob die Rate auch dann noch passt, wenn etwas Unerwartetes passiert.",
    };
  },
};

/* ------------------------------------------------------------------ */
/* Diagramme: choosing a chart and spotting a cut axis.                */

const SHARES = [
  { label: "Snacks", value: 30 },
  { label: "Freizeit", value: 25 },
  { label: "Kleidung", value: 20 },
  { label: "Handy und Apps", value: 15 },
  { label: "Sparen", value: 10 },
];
const MONTHS = [
  { label: "Jan.", value: 8 },
  { label: "Feb.", value: 8.4 },
  { label: "März", value: 8.8 },
  { label: "Apr.", value: 9.2 },
];

function pie(values: number[], labels: string[]): string {
  const total = values.reduce((a, b) => a + b, 0);
  let angle = -Math.PI / 2;
  return values
    .map((v, i) => {
      const next = angle + (v / total) * 2 * Math.PI;
      const large = next - angle > Math.PI ? 1 : 0;
      const p = (a: number, r = 100) => `${Math.round((150 + r * Math.cos(a)) * 10) / 10} ${Math.round((150 + r * Math.sin(a)) * 10) / 10}`;
      const mid = (angle + next) / 2;
      const [lx, ly] = p(mid, 128).split(" ");
      const path = `<path class="lab-slice lab-slice-${i % 5}" d="M150 150 L${p(angle)} A100 100 0 ${large} 1 ${p(next)} Z"/><text class="lab-text" x="${lx}" y="${ly}" text-anchor="${Number(lx) < 150 ? "end" : "start"}">${labels[i]}</text>`;
      angle = next;
      return path;
    })
    .join("");
}

export const DIAGRAMM: LabDef = {
  kind: "diagramm",
  title: "Diagramm-Werkstatt: Konsum in Grafiken",
  intro:
    "Zwei erfundene Datensätze einer 8. Klasse: wofür das Taschengeld ausgegeben wird (Anteile) und wie viel die Klasse pro Woche für Snacks ausgibt (Januar bis April). Wähle Datensatz, Diagrammtyp und den Beginn der Hochachse.",
  sliders: [{ key: "start", label: "Hochachse beginnt bei", min: 0, max: 7, step: 1, unit: "€", value: 0 }],
  selects: [
    { key: "ds", label: "Datensatz", options: [{ value: 0, label: "Verwendung des Taschengelds (Anteile)" }, { value: 1, label: "Snackausgaben pro Woche (Januar bis April)" }], value: 0 },
    { key: "type", label: "Diagrammtyp", options: [{ value: 0, label: "Säulendiagramm" }, { value: 1, label: "Kreisdiagramm" }, { value: 2, label: "Liniendiagramm" }], value: 0 },
  ],
  goals: [
    { id: "anteile-kreis", text: "Stelle die Anteile am Taschengeld als Kreisdiagramm dar.", test: (s) => s.ds === 0 && s.type === 1 },
    { id: "verlauf-linie", text: "Stelle die Entwicklung der Snackausgaben als Liniendiagramm mit einer Achse ab 0 dar.", test: (s) => s.ds === 1 && s.type === 2 && s.start === 0 },
    {
      id: "uebertreibung",
      text: "Lass den Anstieg der Snackausgaben dramatisch aussehen, indem du die Hochachse erst bei 7 € beginnen lässt.",
      test: (s) => s.ds === 1 && s.type !== 1 && s.start >= 7,
    },
  ],
  witness: {
    "anteile-kreis": { ds: 0, type: 1, start: 0 },
    "verlauf-linie": { ds: 1, type: 2, start: 0 },
    uebertreibung: { ds: 1, type: 0, start: 7 },
  },
  view(s) {
    const data = s.ds === 0 ? SHARES : MONTHS;
    const values = data.map((d) => d.value);
    const labels = data.map((d) => d.label);
    // Anteile always start at 0 %; only the money series uses the cut axis.
    const start = s.ds === 1 ? s.start : 0;
    const top = s.ds === 0 ? 35 : 10;
    let body: string;
    if (s.type === 1) {
      body = pie(values, labels.map((l, i) => `${l} ${fmt(values[i])}${s.ds === 0 ? " %" : " €"}`));
    } else {
      const left = 56;
      const width = 380;
      const x = (i: number) => left + 30 + (i * (width - 60)) / Math.max(1, data.length - 1);
      const y = (v: number) => mapRange(Math.max(v, start), [start, top], [250, 30]);
      const axis = `<line class="lab-axis" x1="${left}" y1="250" x2="${left + width}" y2="250"/><line class="lab-axis" x1="${left}" y1="24" x2="${left}" y2="250"/>
        <text class="lab-text lab-text-muted" x="6" y="254">${fmt(start)}${s.ds === 0 ? " %" : " €"}</text><text class="lab-text lab-text-muted" x="6" y="34">${fmt(top)}${s.ds === 0 ? " %" : " €"}</text>
        ${start > 0 ? `<path class="lab-cut" d="M${left - 8} 236 l16 -6 M${left - 8} 244 l16 -6"/>` : ""}`;
      const marks =
        s.type === 0
          ? data.map((d, i) => `<rect class="lab-slice lab-slice-${i % 5}" x="${x(i) - 22}" y="${y(d.value)}" width="44" height="${250 - y(d.value)}" rx="4"/>`).join("")
          : `<polyline class="lab-line lab-line-demand" points="${points(data.map((d, i) => [x(i), y(d.value)]))}"/>${data.map((d, i) => `<circle class="lab-dot-demand" cx="${x(i)}" cy="${y(d.value)}" r="5"/>`).join("")}`;
      const names = data.map((d, i) => `<text class="lab-text" x="${x(i)}" y="268" text-anchor="middle">${d.label}</text>`).join("");
      body = axis + marks + names;
    }
    const first = MONTHS[0].value;
    const last = MONTHS[MONTHS.length - 1].value;
    const real = Math.round((last / first - 1) * 100);
    const seen = Math.round(((last - s.start) / (first - s.start) - 1) * 100);
    const suitable =
      s.ds === 0 ? (s.type === 1 ? "gut: Teile eines Ganzen" : s.type === 0 ? "möglich: Anteile vergleichen" : "ungeeignet: kein Verlauf") : s.type === 2 ? "gut: Entwicklung über die Zeit" : s.type === 0 ? "möglich: Monate vergleichen" : "ungeeignet: kein Ganzes";
    return {
      figure: svg("Diagramm zum gewählten Datensatz", body, 450, 280),
      readouts:
        s.ds === 0
          ? [["Eignung des Diagrammtyps", suitable], ["Summe der Anteile", "100 %"]]
          : [["Eignung des Diagrammtyps", suitable], ["Tatsächlicher Anstieg Jan. bis Apr.", `+${real} %`], ["Sichtbarer Anstieg der Höhe", s.type === 1 ? "nicht ablesbar" : `+${seen} %`]],
      note:
        s.ds === 1 && s.type !== 1 && s.start >= 7
          ? "Die abgeschnittene Achse vergrößert den Unterschied optisch um ein Vielfaches. Prüfe bei jeder Grafik, wo die Achse beginnt und welche Quelle die Zahlen hat."
          : s.type === 1 && s.ds === 1
            ? "Ein Kreisdiagramm zeigt Teile eines Ganzen. Monatswerte bilden kein Ganzes, ihre Entwicklung zeigt ein Linien- oder Säulendiagramm besser."
            : "Jeder Diagrammtyp beantwortet eine andere Frage: Kreis für Anteile, Linie für Entwicklungen, Säulen für Vergleiche.",
    };
  },
};
