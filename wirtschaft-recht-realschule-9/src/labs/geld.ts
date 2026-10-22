import { fmt, money } from "../format";
import { type LabDef, type LabState, mapRange, points, svg } from "./engine";

const growth = (s: LabState, years: number) =>
  s.re === 1 ? s.K * (1 + s.p / 100) ** years : s.K * (1 + (s.p / 100) * years);
const simple = (s: LabState) => s.K * (1 + (s.p / 100) * s.n);
const real = (s: LabState, years: number) => growth(s, years) / (1 + s.i / 100) ** years;

export const GELDANLAGE: LabDef = {
  kind: "geldanlage",
  title: "Zinsen, Zinseszins und Inflation",
  intro:
    "Lege einen Betrag an und verändere Zinssatz und Laufzeit. Entscheide, ob die Zinsen ausgezahlt oder wieder angelegt werden, und sieh, was die Inflation von deinem Geld übrig lässt.",
  sliders: [
    { key: "K", label: "Anlagebetrag", min: 500, max: 10000, step: 500, unit: "Euro", value: 2000 },
    { key: "p", label: "Zinssatz pro Jahr", min: 0, max: 6, step: 0.5, unit: "%", value: 2 },
    { key: "n", label: "Laufzeit", min: 1, max: 30, step: 1, unit: "Jahre", value: 10 },
    { key: "i", label: "Inflation pro Jahr", min: 0, max: 4, step: 0.5, unit: "%", value: 0 },
  ],
  selects: [
    {
      key: "re",
      label: "Zinsen",
      options: [
        { value: 0, label: "werden ausgezahlt (einfache Zinsen)" },
        { value: 1, label: "werden mitverzinst (Zinseszins)" },
      ],
      value: 0,
    },
  ],
  goals: [
    {
      id: "zinseszins",
      text: "Lass die Zinsen mitverzinsen und erreiche damit mindestens 500 Euro mehr als bei ausgezahlten Zinsen.",
      test: (s) => s.re === 1 && growth(s, s.n) - simple(s) >= 500,
    },
    {
      id: "inflation",
      text: "Zeige, wie die Inflation Zinsen auffrisst: Nach mindestens fünf Jahren ist die Kaufkraft kleiner als der Anlagebetrag.",
      test: (s) => s.n >= 5 && real(s, s.n) < s.K,
    },
    {
      id: "verdoppeln",
      text: "Verdopple dein Geld: Erreiche mit Zinseszins mindestens das Doppelte des Anlagebetrags.",
      test: (s) => s.re === 1 && growth(s, s.n) >= 2 * s.K,
    },
  ],
  witness: {
    zinseszins: { K: 2000, p: 4, n: 20, i: 2, re: 1 },
    inflation: { K: 2000, p: 1, n: 10, i: 3, re: 0 },
    verdoppeln: { K: 2000, p: 4, n: 20, i: 0, re: 1 },
  },
  view(s) {
    const end = growth(s, s.n);
    const years = Array.from({ length: s.n + 1 }, (_, y) => y);
    const top = Math.max(growth(s, s.n), s.K) * 1.05;
    const px = (y: number) => mapRange(y, [0, s.n], [58, 456]);
    const py = (v: number) => mapRange(v, [0, top], [262, 20]);
    const nominal = points(years.map((y) => [px(y), py(growth(s, y))] as [number, number]));
    const purchasing = points(years.map((y) => [px(y), py(real(s, y))] as [number, number]));
    const body = `<line class="lab-axis" x1="58" y1="262" x2="458" y2="262"/><line class="lab-axis" x1="58" y1="262" x2="58" y2="14"/>
      <line class="lab-guide" x1="58" y1="${py(s.K)}" x2="458" y2="${py(s.K)}"/><text class="lab-text lab-text-muted" x="62" y="${py(s.K) + 15}">eingezahlt: ${fmt(s.K)} Euro</text>
      <polyline class="lab-line lab-line-supply" points="${nominal}"/><polyline class="lab-line lab-line-demand lab-dashed" points="${purchasing}"/>
      <text class="lab-text lab-text-supply" x="${px(s.n) - 4}" y="${py(end) - 8}" text-anchor="end">Kontostand</text>
      <text class="lab-text lab-text-demand" x="${px(s.n) - 4}" y="${py(real(s, s.n)) + 18}" text-anchor="end">Kaufkraft von heute</text>
      <text class="lab-text" x="458" y="282" text-anchor="end">Jahre</text>`;
    return {
      figure: svg("Verlauf des Kontostands und der Kaufkraft über die Laufzeit", body),
      readouts: [
        ["Kontostand am Ende", `${fmt(money(end))} Euro`],
        ["Zinsen insgesamt", `${fmt(money(end - s.K))} Euro`],
        ["Mehr als bei ausgezahlten Zinsen", `${fmt(money(growth({ ...s, re: 1 }, s.n) - simple(s)))} Euro`],
        ["Kaufkraft in heutigem Geld", `${fmt(money(real(s, s.n)))} Euro`],
      ],
      note:
        real(s, s.n) < s.K
          ? "Die Zinsen reichen nicht aus, um die Preissteigerung auszugleichen: Auf dem Konto steht mehr, gekauft werden kann weniger."
          : "Der Zinssatz liegt über der Inflation: Das Geld wächst nicht nur auf dem Papier, sondern auch an Kaufkraft.",
    };
  },
};

const annuity = (credit: number, percent: number, months: number) => {
  const monthly = percent / 1200;
  return monthly === 0
    ? credit / months
    : (credit * monthly) / (1 - (1 + monthly) ** -months);
};
const credit = (s: LabState) => {
  const instalment = annuity(s.K, s.p, s.n);
  return { instalment, cost: instalment * s.n - s.K };
};
const dispo = (s: LabState) => annuity(s.K, s.d, s.n) * s.n - s.K;

export const KREDIT: LabDef = {
  kind: "kredit",
  title: "Was ein Kredit wirklich kostet",
  intro:
    "Ein Ratenkredit wird in gleichen Monatsraten zurückgezahlt. Verändere Summe, Laufzeit und Zinssatz und vergleiche mit einer Finanzierung über den teuren Dispo.",
  sliders: [
    { key: "K", label: "Kreditsumme", min: 1000, max: 20000, step: 1000, unit: "Euro", value: 6000 },
    { key: "n", label: "Laufzeit", min: 6, max: 60, step: 6, unit: "Monate", value: 24 },
    { key: "p", label: "Sollzins des Ratenkredits", min: 0, max: 15, step: 0.5, unit: "% pro Jahr", value: 7 },
    { key: "d", label: "Zins des Dispokredits", min: 8, max: 16, step: 1, unit: "% pro Jahr", value: 12 },
  ],
  selects: [],
  goals: [
    {
      id: "rate-und-kosten",
      text: "Finde Werte, bei denen die Monatsrate unter 150 Euro liegt und die Kreditkosten trotzdem unter 1.000 Euro bleiben.",
      test: (s) => credit(s).instalment < 150 && credit(s).cost < 1000,
    },
    {
      id: "gegen-dispo",
      text: "Finde Werte, bei denen der Ratenkredit mindestens 500 Euro günstiger ist als dieselbe Summe über den Dispo.",
      test: (s) => dispo(s) - credit(s).cost >= 500,
    },
    {
      id: "teuer",
      text: "Zeige, wie teuer eine lange Laufzeit werden kann: Die Kreditkosten übersteigen 20 Prozent der Kreditsumme.",
      test: (s) => credit(s).cost > 0.2 * s.K,
    },
  ],
  witness: {
    "rate-und-kosten": { K: 6000, n: 48, p: 7, d: 12 },
    "gegen-dispo": { K: 10000, n: 36, p: 6, d: 12 },
    teuer: { K: 6000, n: 60, p: 9, d: 12 },
  },
  view(s) {
    const { instalment, cost } = credit(s);
    const dispoCost = dispo(s);
    const effective = ((1 + s.p / 1200) ** 12 - 1) * 100;
    const scale = Math.max(s.K + Math.max(cost, dispoCost), 1);
    const row = (y: number, label: string, extra: number, tone: string) => {
      const base = (s.K / scale) * 290;
      const more = (extra / scale) * 290;
      return `<text class="lab-text" x="10" y="${y - 8}">${label}</text><rect class="lab-bar lab-bar-0" x="10" y="${y}" width="${base}" height="30" rx="5"/><rect class="lab-bar ${tone}" x="${10 + base}" y="${y}" width="${Math.max(more, 0)}" height="30" rx="5"/><text class="lab-text lab-text-strong" x="${14 + base + more}" y="${y + 20}">+ ${fmt(money(extra))} Euro Kosten</text>`;
    };
    const body = `${row(60, "Ratenkredit", cost, "lab-bar-1")}${row(140, "Gleiche Summe über den Dispo", dispoCost, "lab-bar-2")}<text class="lab-text lab-text-muted" x="10" y="220">Blau: geliehenes Geld · Farbig: Kosten des Kredits</text>`;
    return {
      figure: svg("Kreditkosten von Ratenkredit und Dispo im Vergleich", body, 480, 240),
      readouts: [
        ["Monatsrate", `${fmt(money(instalment))} Euro`],
        ["Kreditkosten insgesamt", `${fmt(money(cost))} Euro`],
        ["Effektiver Jahreszins", `${fmt(money(effective))} %`],
        ["Kosten über den Dispo", `${fmt(money(dispoCost))} Euro`],
      ],
      note: `Der Dispo ist hier mit den gleichen Raten zurückgezahlt gedacht. Der Unterschied kommt allein vom höheren Zins. Ein Kredit mit längerer Laufzeit hat niedrigere Raten, aber höhere Gesamtkosten. Der Effektivzins nennt die Kosten pro Jahr; für Vergleiche gilt er, nicht der Sollzins.`,
    };
  },
};

const needed = (s: LabState) => (s.q / 100) * s.rn;

export const GENERATIONEN: LabDef = {
  kind: "generationen",
  title: "Der Generationenvertrag in Zahlen",
  intro:
    "In der Rentenversicherung zahlen die Beitragszahler von heute die Renten von heute. Dieses stark vereinfachte Modell zeigt, welchen Beitragssatz ein bestimmtes Verhältnis von Rentnern und Beitragszahlern bei einem bestimmten Rentenniveau braucht.",
  sliders: [
    { key: "q", label: "Rentner je 100 Beitragszahler", min: 30, max: 70, step: 5, unit: "", value: 40 },
    {
      key: "rn",
      label: "Rente in Prozent des Durchschnittslohns",
      min: 40,
      max: 60,
      step: 5,
      unit: "%",
      value: 50,
    },
  ],
  selects: [],
  goals: [
    {
      id: "alterung",
      text: "Bei 55 Rentnern je 100 Beitragszahlern: Senke die Rente so weit, dass der nötige Beitragssatz unter 25 Prozent bleibt.",
      test: (s) => s.q >= 55 && needed(s) < 25,
    },
    {
      id: "rente-halten",
      text: "Halte bei mindestens 60 Rentnern je 100 Beitragszahlern die Rente bei mindestens 50 Prozent: Der nötige Beitragssatz steigt über 28 Prozent.",
      test: (s) => s.q >= 60 && s.rn >= 50 && needed(s) > 28,
    },
    {
      id: "beitrag-deckeln",
      text: "Halte den Beitragssatz bei mindestens 50 Rentnern je 100 Beitragszahlern auf höchstens 20 Prozent: Was musst du an der Rente ändern?",
      test: (s) => s.q >= 50 && needed(s) <= 20,
    },
  ],
  witness: {
    alterung: { q: 55, rn: 45 },
    "rente-halten": { q: 60, rn: 50 },
    "beitrag-deckeln": { q: 50, rn: 40 },
  },
  view(s) {
    const rate = needed(s);
    const squares = (count: number, y: number, tone: string) =>
      Array.from({ length: count }, (_, i) => {
        const col = i % 20;
        const row = Math.floor(i / 20);
        return `<rect class="lab-square ${tone}" x="${12 + col * 22}" y="${y + row * 22}" width="18" height="18" rx="4"/>`;
      }).join("");
    const bar = mapRange(rate, [0, 45], [0, 440]);
    const body = `<text class="lab-text" x="12" y="20">Beitragszahler (100 Personen, ein Kästchen = 5)</text>${squares(20, 28, "lab-square-0")}
      <text class="lab-text" x="12" y="82">Rentner (ein Kästchen = 5)</text>${squares(Math.round(s.q / 5), 90, "lab-square-1")}
      <text class="lab-text" x="12" y="170">Nötiger Beitragssatz</text>
      <rect class="lab-track" x="12" y="178" width="440" height="30" rx="6"/><rect class="lab-bar ${rate > 25 ? "lab-bar-2" : "lab-bar-1"}" x="12" y="178" width="${bar}" height="30" rx="6"/>
      <text class="lab-text lab-text-strong" x="${Math.min(16 + bar, 380)}" y="198">${fmt(Math.round(rate * 10) / 10)} %</text>
      <line class="lab-guide" x1="${12 + mapRange(20, [0, 45], [0, 440])}" y1="172" x2="${12 + mapRange(20, [0, 45], [0, 440])}" y2="216"/><text class="lab-text lab-text-muted" x="${12 + mapRange(20, [0, 45], [0, 440])}" y="232" text-anchor="middle">20 %</text>
      <line class="lab-guide" x1="${12 + mapRange(25, [0, 45], [0, 440])}" y1="172" x2="${12 + mapRange(25, [0, 45], [0, 440])}" y2="216"/><text class="lab-text lab-text-muted" x="${12 + mapRange(25, [0, 45], [0, 440])}" y="232" text-anchor="middle">25 %</text>`;
    return {
      figure: svg("Beitragszahler und Rentner im Umlageverfahren", body, 480, 244),
      readouts: [
        ["Rentner je 100 Beitragszahler", fmt(s.q)],
        ["Nötiger Beitragssatz", `${fmt(Math.round(rate * 10) / 10)} %`],
      ],
      note: "Nötiger Beitragssatz = Rentner je Beitragszahler · Rentenniveau. Das Modell lässt Bundeszuschuss, Rentenalter und Beitragsbemessungsgrenze weg: Es zeigt nur die Richtung, nicht die genaue Höhe.",
    };
  },
};
