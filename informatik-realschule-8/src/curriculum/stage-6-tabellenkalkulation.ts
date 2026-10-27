import { fmt } from "../exercises/format";
import { caseLab } from "../lab/case-lab";
import { arrow, circle, line, open, path, rect, text } from "../lab/svg";
import type { ExerciseGenerator, LabDefinition, LabValues, Stage } from "../model/types";
import { cases, cc, lesson, numberField, textField, withSlips } from "./helpers";

const id = "tabellenkalkulation";

const COLS = ["A", "B", "C", "D", "E", "F", "G", "H"];

/** A price with two decimals and the decimal comma: "1,50 €". */
const euro = (value: number) => `${value.toFixed(2).replace(".", ",")} €`;

// ─── Lab: Formel kopieren ────────────────────────────────────────────────

const ITEMS = [
  { name: "Heft", price: 1.5 },
  { name: "Füller", price: 12 },
  { name: "Lineal", price: 2.5 },
  { name: "Atlas", price: 24 },
  { name: "Ordner", price: 4 },
];
const RATE = 0.19;
const MODES = ["F1 (relativ)", "$F$1 (absolut)", "F$1 (Zeile fest)", "$F1 (Spalte fest)"];

/** The reference to F1 after copying E2 down to `row`. */
function copiedRef(mode: number, row: number): string {
  const shift = row - 2;
  if (mode === 0) return `F${1 + shift}`;
  if (mode === 1) return "$F$1";
  if (mode === 2) return "F$1";
  return `$F${1 + shift}`;
}

const kopierenLab: LabDefinition = {
  kind: "formel-kopieren",
  title: "Eine Formel nach unten kopieren",
  intro:
    "In F1 steht der Steuersatz 19 %. E2 berechnet die Mehrwertsteuer mit =D2*F1. Wähle, wie F1 adressiert wird, und kopiere die Formel nach unten.",
  params: [
    { key: "mode", type: "choice", label: "Adresse von F1 in E2", options: MODES.map((label, value) => ({ value, label })), value: 0 },
    {
      key: "row",
      type: "choice",
      label: "Formel kopiert nach",
      options: [2, 3, 4, 5, 6].map((row) => ({ value: row, label: row === 2 ? "E2 (Original)" : `E${row}` })),
      value: 2,
    },
  ],
  readouts: [
    { key: "formula", label: "Formel in der Zielzelle", emphasis: true, compute: (v) => `=D${v.row}*${copiedRef(v.mode, v.row)}` },
    {
      key: "result",
      label: "Ergebnis",
      compute: (v) => {
        const ref = copiedRef(v.mode, v.row).replace(/\$/g, "");
        return ref === "F1" ? `${euro(ITEMS[v.row - 2].price * RATE)} ✓` : `0,00 €: ${ref} ist leer`;
      },
    },
  ],
  goals: [
    {
      id: "richtig",
      text: "Kopiere die Formel nach E5, so dass dort richtig gerechnet wird.",
      check: (v) => v.row === 5 && copiedRef(v.mode, v.row).replace(/\$/g, "") === "F1",
    },
    {
      id: "fehler",
      text: "Zeige den typischen Fehler: Mit relativer Adresse rechnet E4 mit einer leeren Zelle.",
      check: (v) => v.mode === 0 && v.row === 4,
    },
    { id: "absolut", text: "Kopiere bis E6 mit vollständig absoluter Adresse.", check: (v) => v.mode === 1 && v.row === 6 },
  ],
  view: {
    render(v) {
      let out = open("Tabellenblatt mit kopierter Formel");
      const y0 = 24;
      const cw = [28, 110, 90, 150, 70];
      const xs = cw.reduce<number[]>((acc, w, i) => [...acc, acc[i] + w], [40]);
      ["", "A", "D", "E", "F"].forEach((h, i) => {
        out += rect(xs[i], y0, cw[i], 26, "lab-fill-c");
        out += text(xs[i] + cw[i] / 2, y0 + 18, h, "lab-text-small", "middle");
      });
      for (let r = 1; r <= 6; r++) {
        const y = y0 + r * 30;
        const cells =
          r === 1
            ? ["1", "Artikel", "Netto", "MwSt", "19 %"]
            : [String(r), ITEMS[r - 2].name, euro(ITEMS[r - 2].price), r <= v.row ? `=D${r}*${copiedRef(v.mode, r)}` : "", ""];
        cells.forEach((c, i) => {
          const cls = i === 3 && r === v.row ? "lab-fill-a" : i === 4 && r === 1 ? "lab-fill-ok" : "lab-shape";
          out += rect(xs[i], y, cw[i], 28, cls);
          out += text(xs[i] + 6, y + 19, c, "lab-text-small");
        });
      }
      const ref = copiedRef(v.mode, v.row).replace(/\$/g, "");
      out += text(260, 268, `Zielzelle E${v.row}: =D${v.row}*${copiedRef(v.mode, v.row)}`, "lab-text", "middle");
      out += text(260, 300, ref === "F1" ? "Der Bezug zeigt weiter auf F1 mit 19 %." : `Der Bezug ist zu ${ref} mitgewandert: Dort steht nichts.`, ref === "F1" ? "lab-text-ok" : "lab-text-bad", "middle");
      return `${out}</svg>`;
    },
  },
};

const formelKopieren: ExerciseGenerator = {
  id: "formel-kopieren",
  make(rng, level) {
    if (level === 1) {
      const target = rng.int(3, 12);
      return {
        prompt: `In D2 steht die Formel <strong>=B2*C2</strong>. Du kopierst sie nach unten in die Zelle D${target}. Welche Formel steht dort?`,
        given: ["D2: =B2*C2", `Ziel: D${target}`],
        formulaHint: "Relative Bezüge wandern beim Kopieren mit: eine Zeile tiefer, jede Zeilennummer + 1.",
        fields: [textField(`D${target}:`, [`=B${target}*C${target}`], "z. B. =B3*C3", [["=B2*C2", "Relative Bezüge ändern sich beim Kopieren."], [`B${target}*C${target}`, "Eine Formel beginnt mit =."]])],
        steps: [`Von Zeile 2 nach Zeile ${target}: ${target - 2} Zeilen tiefer.`, `B2 → B${target}, C2 → C${target}`, `<strong>=B${target}*C${target}</strong>`],
      };
    }
    const target = rng.int(4, 15);
    const right = rng.next() < 0.5;
    const answer = right ? `=E${target}*$F$1` : `=D${target}*$F$1`;
    return {
      prompt: `In E2 steht <strong>=D2*$F$1</strong>. Du kopierst die Formel nach ${right ? `F${target}` : `E${target}`}. Welche Formel steht in der Zielzelle?`,
      given: ["E2: =D2*$F$1", `Ziel: ${right ? `F${target}` : `E${target}`}`],
      fields: [
        textField(`${right ? "F" : "E"}${target}:`, [answer], "z. B. =D3*$F$1", [
          [`=D2*$F$1`, "Der relative Bezug D2 wandert mit."],
          [right ? `=E${target}*$G$${target - 1}` : `=D${target}*$F$${target - 1}`, "Mit $ fixierte Teile bleiben gleich: $F$1 ändert sich nie."],
        ]),
      ],
      steps: [
        right ? `Eine Spalte nach rechts und ${target - 2} Zeilen nach unten: D → E, 2 → ${target}.` : `${target - 2} Zeilen nach unten: D2 → D${target}.`,
        "$F$1 ist absolut adressiert und bleibt unverändert.",
        `<strong>${answer}</strong>`,
      ],
    };
  },
};

const formelRechnen: ExerciseGenerator = {
  id: "formel-rechnen",
  make(rng, level) {
    const b = rng.pick([2.5, 4, 6, 12, 15]);
    const c = rng.int(2, 9);
    if (level === 1) {
      return {
        prompt: "Welchen Wert zeigt die Zelle D2 an?",
        given: [`B2: ${fmt(b, 2)}`, `C2: ${c}`, "D2: =B2*C2"],
        formulaHint: "Setze die Zellinhalte für die Adressen ein und rechne.",
        fields: [withSlips(numberField("D2 =", b * c, "", 2), [b + c, "Das Zeichen * bedeutet mal."])],
        steps: [`=B2*C2 → ${fmt(b, 2)} · ${c}`, `= ${fmt(b * c, 2)}`, `<strong>${fmt(b * c, 2)}</strong>`],
      };
    }
    const rabatt = rng.pick([10, 15, 20]);
    const result = b * c * (1 - rabatt / 100);
    return {
      prompt: `B2 enthält den Stückpreis, C2 die Menge, F1 den Rabatt in Prozent. Welchen Wert berechnet D2?`,
      given: [`B2: ${fmt(b, 2)} €`, `C2: ${c}`, `F1: ${rabatt} %`, "D2: =B2*C2*(1-$F$1)"],
      fields: [withSlips(numberField("D2 =", result, "€", 2), [b * c * (rabatt / 100), "Das ist nur der Rabatt. Die Formel rechnet mit 1 − Rabatt."], [b * c - rabatt, "Prozent heißt Anteil vom Preis: Ziehe nicht die Prozentzahl in Euro ab."])],
      steps: [`${fmt(b, 2)} · ${c} = ${fmt(b * c, 2)}`, `· (1 − ${fmt(rabatt / 100, 2)}) = · ${fmt(1 - rabatt / 100, 2)}`, `<strong>${fmt(result, 2)} €</strong>`],
    };
  },
};

// ─── Lab: Funktionen ─────────────────────────────────────────────────────

const VALUES = [12, 7, 15, 9, 21, 14];
const FUNCS = ["SUMME", "MIN", "MAX", "MITTELWERT"];

function apply(fn: number, values: number[]): number {
  if (fn === 0) return values.reduce((a, b) => a + b, 0);
  if (fn === 1) return Math.min(...values);
  if (fn === 2) return Math.max(...values);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

const funktionenLab: LabDefinition = {
  kind: "funktionen",
  title: "Funktionen über einen Zellbereich",
  intro:
    "In B2 bis B7 stehen die Kilometer, die eine Klasse an sechs Tagen geradelt ist. Wähle eine Funktion und das Ende des Bereichs.",
  params: [
    { key: "fn", type: "choice", label: "Funktion", options: FUNCS.map((label, value) => ({ value, label })), value: 0 },
    { key: "end", type: "range", label: "Bereich endet in Zeile", unit: "", min: 3, max: 7, step: 1, value: 3 },
  ],
  readouts: [
    { key: "formula", label: "Formel", emphasis: true, compute: (v) => `=${FUNCS[v.fn]}(B2:B${v.end})` },
    { key: "count", label: "Zellen im Bereich", compute: (v) => v.end - 1 },
    { key: "result", label: "Ergebnis", digits: 2, compute: (v) => apply(v.fn, VALUES.slice(0, v.end - 1)) },
  ],
  goals: [
    { id: "summe", text: "Berechne die Summe aller sechs Tage.", check: (v) => v.fn === 0 && v.end === 7 },
    { id: "mittel", text: "Berechne den Durchschnitt pro Tag über alle sechs Tage.", check: (v) => v.fn === 3 && v.end === 7 },
    { id: "max4", text: "Finde den größten Wert der ersten vier Tage.", check: (v) => v.fn === 2 && v.end === 5 },
  ],
  view: {
    render(v) {
      let out = open("Spalte mit Werten und Funktion");
      out += rect(60, 20, 40, 26, "lab-fill-c");
      out += rect(100, 20, 120, 26, "lab-fill-c");
      out += text(160, 38, "B: km", "lab-text-small", "middle");
      VALUES.forEach((value, i) => {
        const y = 46 + i * 30;
        const inRange = i + 2 <= v.end;
        out += rect(60, y, 40, 30, "lab-shape");
        out += text(80, y + 20, String(i + 2), "lab-text-small", "middle");
        out += rect(100, y, 120, 30, inRange ? "lab-fill-a" : "lab-shape");
        out += text(210, y + 20, String(value), "lab-text", "end");
      });
      out += rect(260, 120, 230, 80, "lab-panel", 'rx="10"');
      out += text(375, 152, `=${FUNCS[v.fn]}(B2:B${v.end})`, "lab-text-big", "middle");
      out += text(375, 184, `= ${fmt(apply(v.fn, VALUES.slice(0, v.end - 1)), 2)}`, "lab-text-big", "middle");
      return `${out}</svg>`;
    },
  },
};

const funktionRechnen: ExerciseGenerator = {
  id: "funktion-rechnen",
  make(rng, level) {
    const n = level === 1 ? 4 : 5;
    const values = Array.from({ length: n }, () => rng.int(1, 6));
    if (level === 1) {
      const fn = rng.int(0, 2);
      const result = apply(fn, values);
      return {
        prompt: `In C2 bis C5 stehen ${values.join(", ")}. Welches Ergebnis liefert <strong>=${FUNCS[fn]}(C2:C5)</strong>?`,
        given: values.map((value, i) => `C${i + 2}: ${value}`),
        formulaHint: "SUMME addiert, MIN liefert den kleinsten, MAX den größten Wert des Bereichs.",
        fields: [withSlips(numberField("Ergebnis =", result), ...(fn === 0 ? [] : [[apply(0, values), "Das ist die Summe."] as [number, string]]))],
        steps: [`Bereich C2:C5 = ${values.join("; ")}`, `${FUNCS[fn]} → ${fn === 0 ? values.join(" + ") : fn === 1 ? "kleinster Wert" : "größter Wert"}`, `<strong>${result}</strong>`],
      };
    }
    const avg = apply(3, values);
    return {
      prompt: `In D2 bis D6 stehen die Noten einer Gruppe: ${values.join(", ")}. Welchen Notendurchschnitt berechnet <strong>=MITTELWERT(D2:D6)</strong>?`,
      given: values.map((value, i) => `D${i + 2}: ${value}`),
      fields: [withSlips(numberField("Durchschnitt =", avg, "", 2), [apply(0, values), "Das ist die Summe. MITTELWERT teilt noch durch die Anzahl."], [apply(0, values) / (n - 1), "Teile durch die Anzahl der Zellen: D2 bis D6 sind 5 Zellen."])],
      steps: [`Summe = ${values.join(" + ")} = ${apply(0, values)}`, `${apply(0, values)} ÷ ${n}`, `<strong>${fmt(avg, 2)}</strong>`],
    };
  },
};

const funktionSchreiben: ExerciseGenerator = {
  id: "funktion-schreiben",
  make(rng, level) {
    const col = rng.pick(["B", "C", "D", "E"]);
    const start = rng.int(2, 4);
    const end = start + rng.int(4, 12);
    if (level === 1) {
      const fn = rng.pick([0, 2]);
      const what = fn === 0 ? "die Summe" : "den größten Wert";
      const answer = `=${FUNCS[fn]}(${col}${start}:${col}${end})`;
      return {
        prompt: `Schreibe die Funktion, die ${what} der Zellen ${col}${start} bis ${col}${end} berechnet.`,
        given: [`Bereich: ${col}${start} bis ${col}${end}`],
        formulaHint: "Aufbau: =FUNKTION(erste Zelle:letzte Zelle), z. B. =SUMME(A1:A5)",
        fields: [textField("Formel:", [answer], "=SUMME(A1:A5)", [[`${FUNCS[fn]}(${col}${start}:${col}${end})`, "Jede Formel beginnt mit ="], [`=${FUNCS[fn]}(${col}${start};${col}${end})`, "Das Semikolon trennt einzelne Zellen. Ein Bereich von … bis wird mit Doppelpunkt geschrieben."]])],
        steps: [`Funktion: ${FUNCS[fn]}`, `Bereich: ${col}${start}:${col}${end}`, `<strong>${answer}</strong>`],
      };
    }
    const answer = `=MITTELWERT(${col}${start}:${col}${end})`;
    return {
      prompt: `Die Tageshöchsttemperaturen stehen in ${col}${start} bis ${col}${end}. Schreibe die Formel für die durchschnittliche Höchsttemperatur.`,
      given: [`Werte in ${col}${start}:${col}${end}`],
      fields: [textField("Formel:", [answer], "=…", [[`=SUMME(${col}${start}:${col}${end})`, "SUMME addiert nur. Für den Durchschnitt gibt es eine eigene Funktion."], [`=MAX(${col}${start}:${col}${end})`, "MAX liefert den höchsten Wert, nicht den Durchschnitt."]])],
      steps: ["Durchschnitt → MITTELWERT", `Bereich ${col}${start}:${col}${end}`, `<strong>${answer}</strong>`],
    };
  },
};

// ─── Lab: Mehrwertsteuer ─────────────────────────────────────────────────

const mwst = (v: LabValues) => (v.netto * v.rate) / 100;

const mwstLab: LabDefinition = {
  kind: "mwst-datenfluss",
  title: "Datenflussdiagramm Mehrwertsteuer",
  intro:
    "Das Modell zeigt, wie aus dem Nettopreis und dem Steuersatz die Mehrwertsteuer und der Bruttopreis entstehen. Genau so baust du es danach in der Tabelle auf.",
  params: [
    { key: "netto", type: "range", label: "Nettopreis", unit: "€", min: 10, max: 200, step: 10, value: 20 },
    {
      key: "rate",
      type: "choice",
      label: "Steuersatz",
      options: [
        { value: 19, label: "19 % (Regelsteuersatz)" },
        { value: 7, label: "7 % (ermäßigt, z. B. Bücher, Lebensmittel)" },
      ],
      value: 19,
    },
  ],
  readouts: [
    { key: "mwst", label: "Mehrwertsteuer", unit: "€", digits: 2, compute: mwst },
    { key: "brutto", label: "Bruttopreis", unit: "€", digits: 2, emphasis: true, compute: (v) => v.netto + mwst(v) },
  ],
  goals: [
    { id: "119", text: "Erzeuge einen Bruttopreis von genau 119 €.", check: (v) => Math.abs(v.netto + mwst(v) - 119) < 1e-9 },
    { id: "sieben", text: "Erzeuge eine Mehrwertsteuer von genau 7 € beim ermäßigten Satz.", check: (v) => v.rate === 7 && Math.abs(mwst(v) - 7) < 1e-9 },
    { id: "buch", text: "Ein Buch kostet netto 50 €. Stelle den passenden Steuersatz ein.", check: (v) => v.netto === 50 && v.rate === 7 },
  ],
  view: {
    render(v) {
      let out = open("Datenflussdiagramm");
      const box = (x: number, y: number, label: string, value: string, cls = "lab-fill-a") =>
        rect(x, y, 140, 56, cls, 'rx="10"') + text(x + 70, y + 22, label, "lab-text-small", "middle") + text(x + 70, y + 44, value, "lab-text", "middle");
      out += box(20, 30, "Nettopreis", `${fmt(v.netto, 2)} €`);
      out += box(20, 130, "Steuersatz", `${v.rate} %`);
      out += circle(250, 110, 26, "lab-fill-c");
      out += text(250, 116, "·", "lab-text-big", "middle");
      out += arrow(160, 58, 228, 98, "lab-axis");
      out += arrow(160, 158, 228, 122, "lab-axis");
      out += box(300, 82, "Mehrwertsteuer", `${fmt(mwst(v), 2)} €`, "lab-fill-b");
      out += circle(370, 230, 26, "lab-fill-c");
      out += text(370, 238, "+", "lab-text-big", "middle");
      out += arrow(370, 138, 370, 202, "lab-axis");
      out += path("M90 86 L90 230 L342 230", "lab-axis");
      out += box(300, 270, "Bruttopreis", `${fmt(v.netto + mwst(v), 2)} €`, "lab-fill-ok");
      out += line(370, 256, 370, 270, "lab-axis");
      return `${out}</svg>`;
    },
  },
};

const mwstTask: ExerciseGenerator = {
  id: "mwst-rechnen",
  make(rng, level) {
    const rate = rng.pick([7, 19]);
    if (level === 1) {
      const netto = rng.pick([20, 35, 48, 80, 150, 240]);
      const brutto = netto * (1 + rate / 100);
      return {
        prompt: `Ein Artikel kostet netto ${fmt(netto, 2)} €. Der Steuersatz beträgt ${rate} %. Berechne den Bruttopreis.`,
        given: [`Netto: ${fmt(netto, 2)} €`, `Steuersatz: ${rate} %`],
        formulaHint: `Brutto = Netto · (1 + ${rate} %) = Netto · ${fmt(1 + rate / 100, 2)}`,
        fields: [withSlips(numberField("Brutto =", brutto, "€", 2), [(netto * rate) / 100, "Das ist nur die Steuer. Addiere den Nettopreis."], [netto + rate, "Prozent heißt Anteil vom Nettopreis, nicht plus 19 €."])],
        steps: [`MwSt = ${fmt(netto, 2)} € · ${fmt(rate / 100, 2)} = ${fmt((netto * rate) / 100, 2)} €`, `Brutto = ${fmt(netto, 2)} € + ${fmt((netto * rate) / 100, 2)} €`, `<strong>${fmt(brutto, 2)} €</strong>`],
      };
    }
    const netto = rng.pick([40, 60, 100, 250, 400]);
    const brutto = netto * (1 + rate / 100);
    return {
      prompt: `Im Laden kostet ein Gerät ${fmt(brutto, 2)} € einschließlich ${rate} % Mehrwertsteuer. Für die Buchhaltung brauchst du den Nettopreis. Wie hoch ist er?`,
      given: [`Brutto: ${fmt(brutto, 2)} €`, `Steuersatz: ${rate} %`],
      fields: [withSlips(numberField("Netto =", netto, "€", 2), [brutto * (1 - rate / 100), `Brutto ist 100 % + ${rate} %. Teile durch ${fmt(1 + rate / 100, 2)}, statt ${rate} % abzuziehen.`], [brutto - rate, "Prozent heißt Anteil, nicht Euro."])],
      steps: [`Brutto = Netto · ${fmt(1 + rate / 100, 2)}`, `Netto = ${fmt(brutto, 2)} € ÷ ${fmt(1 + rate / 100, 2)}`, `<strong>${fmt(netto, 2)} €</strong>`],
    };
  },
};

// ─── Lab: Diagramme ──────────────────────────────────────────────────────

const DATASETS = [
  { name: "Lieblingsfächer der 8b (Anteile)", labels: ["Sport", "Kunst", "IT", "Mathe"], values: [40, 20, 25, 15], best: 0 },
  { name: "Temperatur von Montag bis Freitag", labels: ["Mo", "Di", "Mi", "Do", "Fr"], values: [12, 15, 14, 18, 21], best: 2 },
  { name: "Schülerzahl je Klasse", labels: ["8a", "8b", "8c", "8d"], values: [27, 24, 29, 22], best: 1 },
];
const CHARTS = ["Kreisdiagramm", "Säulendiagramm", "Liniendiagramm"];

const diagrammLab: LabDefinition = {
  kind: "diagrammwahl",
  title: "Den passenden Diagrammtyp wählen",
  intro: "Wähle einen Datensatz und einen Diagrammtyp. Welcher Typ zeigt die Aussage der Daten am klarsten?",
  params: [
    { key: "data", type: "choice", label: "Datensatz", options: DATASETS.map((d, value) => ({ value, label: d.name })), value: 0 },
    { key: "chart", type: "choice", label: "Diagrammtyp", options: CHARTS.map((label, value) => ({ value, label })), value: 2 },
  ],
  readouts: [
    {
      key: "fit",
      label: "Aussagekraft",
      emphasis: true,
      compute: (v) =>
        v.chart === DATASETS[v.data].best
          ? "✓ passt"
          : v.chart === 0
            ? "Ein Kreis zeigt Anteile an einem Ganzen; diese Werte ergeben kein Ganzes."
            : v.chart === 2
              ? "Eine Linie verbindet Werte, als gäbe es einen zeitlichen Verlauf."
              : "Säulen gehen, aber der Typ zeigt die Aussage nicht am klarsten.",
    },
  ],
  goals: DATASETS.map((dataset, index) => ({
    id: `d${index}`,
    text: `Zeige „${dataset.name}“ mit dem passenden Diagrammtyp.`,
    check: (v: LabValues) => v.data === index && v.chart === dataset.best,
  })),
  view: {
    render(v) {
      const d = DATASETS[v.data];
      let out = open(`${CHARTS[v.chart]}: ${d.name}`);
      const total = d.values.reduce((a, b) => a + b, 0);
      const fills = ["lab-fill-a", "lab-fill-b", "lab-fill-c", "lab-fill-ok", "lab-shape"];
      if (v.chart === 0) {
        let angle = -Math.PI / 2;
        d.values.forEach((value, i) => {
          const sweep = (value / total) * 2 * Math.PI;
          const x1 = 260 + 110 * Math.cos(angle);
          const y1 = 160 + 110 * Math.sin(angle);
          const x2 = 260 + 110 * Math.cos(angle + sweep);
          const y2 = 160 + 110 * Math.sin(angle + sweep);
          out += path(`M260 160 L${x1.toFixed(1)} ${y1.toFixed(1)} A110 110 0 ${sweep > Math.PI ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`, fills[i % fills.length]);
          const mid = angle + sweep / 2;
          out += text(260 + 70 * Math.cos(mid), 164 + 70 * Math.sin(mid), d.labels[i], "lab-text-small", "middle");
          angle += sweep;
        });
      } else {
        const max = Math.max(...d.values);
        const step = 380 / d.values.length;
        out += line(70, 290, 470, 290, "lab-axis");
        let poly = "";
        d.values.forEach((value, i) => {
          const x = 80 + i * step + step / 2;
          const h = (value / max) * 230;
          if (v.chart === 1) out += rect(x - step * 0.3, 290 - h, step * 0.6, h, "lab-fill-a");
          else {
            poly += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${(290 - h).toFixed(1)} `;
            out += circle(x, 290 - h, 4, "lab-fill-b");
          }
          out += text(x, 306, d.labels[i], "lab-text-small", "middle");
        });
        if (poly) out += path(poly.trim(), "lab-curve");
      }
      out += text(260, 334, d.name, "lab-text-small", "middle");
      return `${out}</svg>`;
    },
  },
};

const kreiswinkel: ExerciseGenerator = {
  id: "kreisdiagramm-winkel",
  make(rng, level) {
    if (level === 1) {
      const pct = rng.pick([10, 20, 25, 30, 40, 45, 60]);
      return {
        prompt: `In einem Kreisdiagramm hat ein Anteil ${pct} %. Wie groß ist der Mittelpunktswinkel seines Kreisausschnitts?`,
        given: [`Anteil: ${pct} %`, "Vollkreis: 360°"],
        formulaHint: "Winkel = Anteil in % · 3,6°",
        fields: [withSlips(numberField("Winkel =", pct * 3.6, "°", 1), [pct, "Der ganze Kreis hat 360°, nicht 100°."])],
        steps: ["1 % entspricht 360° ÷ 100 = 3,6°", `${pct} · 3,6°`, `<strong>${fmt(pct * 3.6, 1)}°</strong>`],
      };
    }
    const total = rng.pick([20, 24, 25, 30]);
    const part = rng.int(3, Math.floor(total / 2));
    const angle = (part / total) * 360;
    return {
      prompt: `Von ${total} Schülerinnen und Schülern fahren ${part} mit dem Bus. Wie groß wird der Winkel für „Bus“ im Kreisdiagramm?`,
      given: [`Gesamt: ${total}`, `Bus: ${part}`],
      fields: [withSlips(numberField("Winkel =", angle, "°", 1), [(part / total) * 100, "Das ist der Anteil in Prozent. Rechne ihn in Grad um."], [part * 3.6, "Erst den Anteil am Ganzen bestimmen: Anzahl ÷ Gesamt."])],
      steps: [`Anteil = ${part} ÷ ${total} = ${fmt(part / total, 4)}`, `${fmt(part / total, 4)} · 360°`, `<strong>${fmt(angle, 1)}°</strong>`],
    };
  },
};

export const STAGE_TABELLENKALKULATION: Stage = {
  id,
  stageNumber: 6,
  title: "Einführung in die Tabellenkalkulation",
  subtitle: "Tabellen, Datentypen, Formeln, Zellbezüge, Funktionen, Modelle und Diagramme",
  icon: "📊",
  accent: "#16a34a",
  badgeTitle: "Tabellenprofi",
  lehrplanLabel: "IT 1.6 · ca. 14 Std.",
  module: "1.6",
  lessons: [
    lesson(id, "1.6", 1, {
      id: "it8-tabellen-datentypen",
      title: "Tabellenblatt, Zelladressen und Datentypen",
      subtitle: "Tabellen erstellen und gestalten, Text, Zahl, Datum und Formel unterscheiden",
      why: "Taschengeld, Notenspiegel oder Klassenkasse: In einer Tabelle stehen Zahlen übersichtlich, und das Programm rechnet für dich.",
      html: `<p>Ein <strong>Tabellenkalkulationsprogramm</strong> arbeitet mit einem <strong>Tabellenblatt</strong> aus <strong>Spalten</strong> (A, B, C, …) und <strong>Zeilen</strong> (1, 2, 3, …). Jede <strong>Zelle</strong> hat eine eindeutige <strong>Zelladresse</strong> aus Spaltenbuchstabe und Zeilennummer, z. B. <strong>C4</strong>. Ein zusammenhängender <strong>Bereich</strong> wird mit Doppelpunkt angegeben: <strong>B2:D6</strong> heißt „von B2 bis D6“ und umfasst 3 Spalten · 5 Zeilen = 15 Zellen.</p>
<p>Jede Zelle hat einen <strong>Datentyp</strong>: <strong>Text</strong> (Beschriftungen, standardmäßig linksbündig), <strong>Zahl</strong> (auch als Währung oder Prozent formatiert, standardmäßig rechtsbündig), <strong>Datum</strong> (intern eine Zahl, mit der man rechnen kann) oder eine <strong>Formel</strong>, die mit <strong>=</strong> beginnt. Telefonnummern oder Postleitzahlen mit führender Null gibst du als Text ein. Eine übersichtliche Tabelle hat eine hervorgehobene <strong>Kopfzeile</strong>, Rahmenlinien und einheitliche Zahlenformate.</p>
<div class="example"><strong>Beispiel:</strong> In A1 steht „Datum“ (Text), in A2 „27.10.2026“ (Datum), in B2 „4,50 €“ (Zahl im Währungsformat), in C2 „=B2*2“ (Formel). Das Programm zeigt in C2 das Ergebnis 9,00 € an.</div>
<div class="merke"><strong>Merke:</strong> Zelladresse = Spalte + Zeile (C4). Bereich mit Doppelpunkt (B2:D6). Datentypen: Text, Zahl, Datum, Formel (beginnt mit =).</div>`,
      rule: "Zelladresse = Spaltenbuchstabe + Zeilennummer; Bereich B2:D6 = von B2 bis D6; Formeln beginnen mit =",
      terms: [
        ["Zelle · Zelladresse · Bereich", "Schnittpunkt von Spalte und Zeile · z. B. C4 · z. B. B2:D6", "Zellen im Bereich = Spalten · Zeilen"],
        ["Datentypen", "Text · Zahl (auch Währung, Prozent) · Datum · Formel", "Zahlen rechtsbündig, Text linksbündig"],
      ],
      quiz: [
        "Mit welchem Zeichen beginnt jede Formel in einer Tabellenkalkulation?",
        "=",
        ":",
        "$",
        "Das Gleichheitszeichen kennzeichnet eine Formel; der Doppelpunkt trennt Bereichsanfang und -ende, $ fixiert Adressen.",
      ],
      lab: caseLab({
        kind: "datentypen",
        title: "Welcher Datentyp steckt in der Zelle?",
        intro: "Ordne jede Eingabe dem Datentyp zu, mit dem das Programm sie speichert.",
        categories: ["Text", "Zahl", "Datum", "Formel"],
        cases: [
          { short: "Klasse 8b", text: "Eingabe: Klasse 8b", answer: 0, why: "Eine Beschriftung, kein Rechenwert.", hint: "Kann man damit rechnen?" },
          { short: "27.10.2026", text: "Eingabe: 27.10.2026", answer: 2, why: "Ein Datum, mit dem man Tage berechnen kann.", hint: "Tag, Monat und Jahr?" },
          { short: "12,50 €", text: "Eingabe: 12,50 €", answer: 1, why: "Eine Zahl im Währungsformat.", hint: "Das €-Zeichen ist nur das Format." },
          { short: "=B2*C2", text: "Eingabe: =B2*C2", answer: 3, why: "Beginnt mit = und rechnet mit Zellbezügen.", hint: "Womit beginnt die Eingabe?" },
          { short: "0911 123456", text: "Eingabe: 0911 123456 (Telefonnummer)", answer: 0, why: "Als Text, sonst verschwindet die führende Null.", hint: "Rechnet man mit Telefonnummern?" },
          { short: "19 %", text: "Eingabe: 19 %", answer: 1, why: "Eine Zahl (0,19) im Prozentformat.", hint: "Prozent ist ein Zahlenformat." },
        ],
        goals: [
          { text: "Unterscheide die Beschriftung vom Datum.", cases: [0, 1] },
          { text: "Erkenne Währung und Prozent als Zahlen.", cases: [2, 5] },
          { text: "Ordne alle sechs Eingaben richtig zu.", cases: [0, 1, 2, 3, 4, 5] },
        ],
      }),
      exercises: [
        {
          id: "zelladresse",
          make(rng, level) {
            if (level === 1) {
              const col = rng.int(0, 7);
              const row = rng.int(1, 20);
              const answer = `${COLS[col]}${row}`;
              return {
                prompt: `Wie lautet die Adresse der Zelle in Spalte ${COLS[col]} und Zeile ${row}?`,
                given: [`Spalte ${COLS[col]} (die ${col + 1}. Spalte)`, `Zeile ${row}`],
                formulaHint: "Zuerst der Spaltenbuchstabe, dann die Zeilennummer, z. B. C4.",
                fields: [textField("Adresse:", [answer], "z. B. C4", [[`${row}${COLS[col]}`, "Der Spaltenbuchstabe steht vorne."]])],
                steps: ["Spalte zuerst, dann Zeile.", `${COLS[col]} und ${row}`, `<strong>${answer}</strong>`],
              };
            }
            const c1 = rng.int(0, 3);
            const c2 = c1 + rng.int(1, 3);
            const r1 = rng.int(1, 5);
            const r2 = r1 + rng.int(2, 9);
            const count = (c2 - c1 + 1) * (r2 - r1 + 1);
            return {
              prompt: `Wie viele Zellen umfasst der Bereich <strong>${COLS[c1]}${r1}:${COLS[c2]}${r2}</strong>?`,
              given: [`Bereich ${COLS[c1]}${r1}:${COLS[c2]}${r2}`],
              fields: [withSlips(numberField("Zellen =", count), [(c2 - c1) * (r2 - r1), "Die Randspalte und die Randzeile gehören zum Bereich dazu: zähle beide Enden mit."], [c2 - c1 + 1 + (r2 - r1 + 1), "Spalten und Zeilen werden multipliziert, nicht addiert."])],
              steps: [`Spalten ${COLS[c1]} bis ${COLS[c2]}: ${c2 - c1 + 1}`, `Zeilen ${r1} bis ${r2}: ${r2 - r1 + 1}`, `<strong>${c2 - c1 + 1} · ${r2 - r1 + 1} = ${count} Zellen</strong>`],
            };
          },
        },
        cases(
          "tabelle-gestalten",
          [
            cc("Wie richtet ein Tabellenkalkulationsprogramm Zahlen standardmäßig aus?", "rechtsbündig", ["linksbündig", "zentriert"], "Rechtsbündig stehen Einer unter Einern; so lassen sich Zahlen vergleichen.", "Wie stehen Zahlen in einer Rechnung untereinander?"),
            cc("Was bedeutet der Bereich A1:A10?", "Die Zellen A1 bis A10", ["Nur A1 und A10", "A1 geteilt durch A10"], "Der Doppelpunkt heißt „von … bis“.", "Doppelpunkt = bis."),
            cc("Was macht eine Tabelle übersichtlich?", "Eine hervorgehobene Kopfzeile und einheitliche Zahlenformate", ["Möglichst viele verschiedene Schriftarten", "Zahlen als Text eingeben"], "Kopfzeile und gleiche Formate machen Spalten leicht lesbar.", "Woran erkennt man, was in einer Spalte steht?"),
          ],
          [
            cc(
              "Du tippst die Postleitzahl 01067 ein, die Zelle zeigt 1067. Was ist passiert, und was hilft?",
              "Das Programm hat sie als Zahl gespeichert; als Text eingeben, dann bleibt die Null.",
              ["Die Zelle ist zu schmal; Spalte verbreitern.", "Die Datei ist beschädigt."],
              "Bei Zahlen sind führende Nullen bedeutungslos; Postleitzahlen sind Text.",
              "Was macht das Programm mit führenden Nullen bei Zahlen?",
            ),
            cc(
              "In einer Klassenkasse stehen Beträge teils als „5 Euro“, teils als 5,00 €. Die Summe stimmt nicht. Warum?",
              "„5 Euro“ ist Text und wird nicht mitgerechnet; alle Beträge als Zahl mit Währungsformat eingeben.",
              ["Die Summe rechnet nur jede zweite Zeile.", "Euro-Beträge kann man nicht addieren."],
              "Text wird bei Berechnungen ignoriert; erst das einheitliche Zahlenformat liefert die richtige Summe.",
              "Welcher Datentyp ist „5 Euro“?",
            ),
            cc(
              "Mit welchem Datentyp kannst du berechnen, wie viele Tage bis zu den Ferien bleiben?",
              "Datum",
              ["Text", "Prozent"],
              "Ein Datum wird intern als Zahl gespeichert; die Differenz zweier Daten ergibt die Tage.",
              "Mit welchem Typ lässt sich zwischen Tagen rechnen?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, "1.6", 2, {
      id: "it8-formeln-bezuege",
      title: "Formeln, relative und absolute Zelladressierung",
      subtitle: "Formeln aus Zellbezügen bauen und richtig kopieren",
      why: "Eine Formel schreibst du einmal und kopierst sie in hundert Zeilen. Damit das klappt, musst du wissen, welche Bezüge mitwandern und welche nicht.",
      html: `<p>Eine <strong>Formel</strong> beginnt mit <strong>=</strong> und besteht aus <strong>Zellbezügen</strong>, Zahlen und <strong>Rechenzeichen</strong> (+, −, * für mal, / für geteilt). <code>=B2*C2</code> multipliziert die Inhalte von B2 und C2. Ändert sich ein Wert, rechnet die Formel automatisch neu.</p>
<p>Beim Kopieren einer Formel ändern sich <strong>relative Bezüge</strong>: Eine Zeile tiefer wird aus B2 dann B3. Soll ein Bezug fest bleiben, z. B. auf den Steuersatz in F1, schreibst du ihn <strong>absolut</strong> mit Dollarzeichen: <code>$F$1</code>. Das $ vor dem Buchstaben fixiert die Spalte, das $ vor der Zahl die Zeile. Beim Kopieren nach unten genügt auch <code>F$1</code>.</p>
<div class="example"><strong>Beispiel:</strong> E2 enthält <code>=D2*$F$1</code>. Kopiert nach E5 steht dort <code>=D5*$F$1</code>: D wandert mit, F1 bleibt. Hätte man <code>=D2*F1</code> geschrieben, stünde in E5 <code>=D5*F4</code>, und F4 ist leer: Das Ergebnis wäre 0.</div>
<div class="merke"><strong>Merke:</strong> Relativ (B2) wandert beim Kopieren mit, absolut ($F$1) bleibt fest. Feste Werte wie Steuersatz oder Rabatt absolut adressieren.</div>`,
      rule: "relativ: B2 → B3 beim Kopieren nach unten; absolut: <code>$F$1</code> bleibt; <code>F$1</code> fixiert nur die Zeile",
      terms: [
        ["Rechenzeichen", "+ · − · * (mal) · / (geteilt) · ( )", "Punkt vor Strich gilt auch in Formeln"],
        ["Zelladressierung", "relativ B2 · absolut $B$2 · gemischt B$2 oder $B2", "$ fixiert das, was danach steht"],
      ],
      quiz: [
        "D2 enthält =B2*C2. Was steht nach dem Kopieren in D3?",
        "=B3*C3",
        "=B2*C2",
        "=B3*C2",
        "Beide Bezüge sind relativ und wandern eine Zeile mit.",
      ],
      lab: kopierenLab,
      exercises: [formelKopieren, formelRechnen],
    }),
    lesson(id, "1.6", 3, {
      id: "it8-funktionen",
      title: "Einfache Funktionen: SUMME, MIN, MAX, MITTELWERT",
      subtitle: "Aufbau einer Funktion und Auswertung eines Zellbereichs",
      why: "Für 30 Zahlen schreibt niemand =B2+B3+…+B31. Funktionen erledigen das in einer kurzen Formel.",
      html: `<p>Eine <strong>Funktion</strong> ist eine vorgefertigte Berechnung. Ihr <strong>Aufbau</strong>: Gleichheitszeichen, Funktionsname, in Klammern die <strong>Argumente</strong>, meist ein Bereich: <code>=SUMME(B2:B7)</code>. Mehrere einzelne Zellen trennt ein Semikolon: <code>=SUMME(B2;B5)</code> addiert nur B2 und B5.</p>
<p>Wichtige Funktionen: <strong>SUMME</strong> addiert alle Werte, <strong>MIN</strong> liefert den kleinsten, <strong>MAX</strong> den größten Wert, <strong>MITTELWERT</strong> den Durchschnitt (Summe ÷ Anzahl). Funktionen lassen sich in Formeln einbauen, z. B. <code>=MAX(B2:B7)-MIN(B2:B7)</code> für die Spannweite.</p>
<div class="example"><strong>Beispiel:</strong> In B2:B7 stehen die geradelten Kilometer 12, 7, 15, 9, 21, 14. <code>=SUMME(B2:B7)</code> ergibt 78, <code>=MITTELWERT(B2:B7)</code> ergibt 78 ÷ 6 = 13, <code>=MAX(B2:B5)</code> ergibt 15.</div>
<div class="merke"><strong>Merke:</strong> =FUNKTION(Bereich). SUMME addiert, MIN und MAX finden kleinsten und größten Wert, MITTELWERT = Summe ÷ Anzahl.</div>`,
      rule: "<code>=SUMME(B2:B7)</code> · <code>=MIN(…)</code> · <code>=MAX(…)</code> · <code>=MITTELWERT(…)</code> = Summe ÷ Anzahl",
      terms: [
        ["Aufbau einer Funktion", "= NAME ( Argumente )", "Bereich mit :, einzelne Zellen mit ;"],
        ["MITTELWERT", "Summe der Werte ÷ Anzahl der Werte", "auch Durchschnitt oder arithmetisches Mittel"],
      ],
      quiz: [
        "Welche Formel berechnet den Durchschnitt der Werte in C2 bis C9?",
        "=MITTELWERT(C2:C9)",
        "=SUMME(C2:C9)",
        "=MITTELWERT(C2;C9)",
        "MITTELWERT mit dem Bereich C2:C9; mit Semikolon würden nur C2 und C9 gemittelt.",
      ],
      lab: funktionenLab,
      exercises: [funktionRechnen, funktionSchreiben],
    }),
    lesson(id, "1.6", 4, {
      id: "it8-modell-mwst",
      title: "Mit Modellen planen: Mehrwertsteuer berechnen",
      subtitle: "Datenflussdiagramm, Struktogramm und Umsetzung in der Tabelle",
      why: "Bevor du eine Tabelle baust, planst du den Lösungsweg. Ein Modell zeigt, welche Werte du brauchst und wie sie zusammenhängen.",
      html: `<p>Für eine Aufgabe wie die Berechnung der <strong>Mehrwertsteuer</strong> entwickelst du zuerst ein <strong>Modell</strong> des Lösungswegs. Ein <strong>Datenflussdiagramm</strong> zeigt, welche Eingabewerte in welche Berechnung fließen und welches Ergebnis entsteht. Ein <strong>Struktogramm</strong> oder ein <strong>Aktivitätsdiagramm</strong> zeigt die Reihenfolge der Schritte.</p>
<p>Für den Bruttopreis fließen <strong>Nettopreis</strong> und <strong>Steuersatz</strong> in eine Multiplikation: <strong>Mehrwertsteuer = Netto · Steuersatz</strong>. Dann gilt <strong>Brutto = Netto + Mehrwertsteuer</strong> = Netto · (1 + Steuersatz). Der Regelsteuersatz beträgt in Deutschland <strong>19 %</strong>, der ermäßigte <strong>7 %</strong> (z. B. Lebensmittel, Bücher). In der Tabelle wird jede Eingabe eine Zelle und jede Berechnung eine Formel, z. B. <code>=B2*$B$1</code> für die Steuer und <code>=B2+C2</code> für den Bruttopreis. Vom Brutto zum Netto teilst du durch 1,19 bzw. 1,07.</p>
<div class="example"><strong>Beispiel:</strong> Netto 50 €, Steuersatz 19 %: Mehrwertsteuer 50 € · 0,19 = 9,50 €, Brutto 59,50 €. Rückwärts: 59,50 € ÷ 1,19 = 50 €. 19 % von 59,50 € abzuziehen ergäbe dagegen falsch 48,20 €.</div>
<div class="merke"><strong>Merke:</strong> Erst modellieren, dann umsetzen. Brutto = Netto · 1,19 (bzw. 1,07); Netto = Brutto ÷ 1,19 (bzw. 1,07).</div>`,
      rule: "MwSt = Netto · Steuersatz; Brutto = Netto · (1 + Steuersatz); Netto = Brutto ÷ (1 + Steuersatz)",
      terms: [
        ["Datenflussdiagramm", "Eingaben → Verarbeitung → Ergebnis als Kästen und Pfeile", "zeigt, welche Werte wohin fließen"],
        ["Steuersätze", "19 % Regelsteuersatz · 7 % ermäßigt", "z. B. Elektronik · Bücher, Lebensmittel"],
      ],
      quiz: [
        "Ein Rad kostet 238 € brutto (19 % MwSt). Wie berechnest du den Nettopreis?",
        "238 € ÷ 1,19",
        "238 € · 0,81",
        "238 € − 19 €",
        "Brutto ist 119 % vom Netto; also teilst du durch 1,19 und erhältst 200 €. 19 % abziehen ergäbe 192,78 €.",
      ],
      lab: mwstLab,
      exercises: [
        mwstTask,
        cases(
          "modell-umsetzen",
          [
            cc("Welches Modell zeigt, welche Werte in welche Berechnung fließen?", "Datenflussdiagramm", ["Kreisdiagramm", "Seitenansicht"], "Es zeigt Eingaben, Verarbeitung und Ergebnis mit Pfeilen.", "Daten fließen."),
            cc("In B2 steht der Nettopreis, in B1 der Steuersatz 19 %. Welche Formel berechnet die Steuer und lässt sich nach unten kopieren?", "=B2*$B$1", ["=B2*B1", "=B2+19"], "Der Steuersatz steht nur in B1 und muss beim Kopieren fest bleiben.", "Welcher Bezug soll fest bleiben?"),
            cc("Welcher Steuersatz gilt in Deutschland für Bücher?", "7 %", ["19 %", "0 %"], "Bücher und Lebensmittel haben den ermäßigten Steuersatz.", "ermäßigt"),
          ],
          [
            cc(
              "Ein Shop will Bruttopreise für 200 Artikel berechnen. Wie planst du die Tabelle sinnvoll?",
              "Steuersatz einmal in eine Zelle, Netto je Zeile, Formel mit absolutem Bezug auf den Steuersatz nach unten kopieren.",
              ["In jede Zeile den Steuersatz neu eintippen und von Hand rechnen.", "Die Bruttopreise mit dem Taschenrechner ausrechnen und eintippen."],
              "Ein Wert an einer Stelle lässt sich zentral ändern; die kopierte Formel rechnet für alle Zeilen.",
              "Was passiert, wenn sich der Steuersatz ändert?",
            ),
            cc(
              "Max rechnet den Nettopreis mit =C2-C2*19%. Warum ist das falsch?",
              "Die 19 % beziehen sich auf den Nettopreis, nicht auf den Bruttopreis; richtig ist =C2/1,19.",
              ["Weil man in Formeln keine Prozente verwenden darf.", "Weil das Minuszeichen in Formeln nicht erlaubt ist."],
              "Vom Brutto 19 % abzuziehen ergibt einen zu kleinen Nettopreis.",
              "Wovon sind die 19 % berechnet?",
            ),
            cc(
              "Ein Struktogramm für die Preisberechnung beginnt mit „Netto eingeben“. Was kommt danach?",
              "MwSt ← Netto · Steuersatz, dann Brutto ← Netto + MwSt, dann Brutto ausgeben.",
              ["Brutto ausgeben, dann MwSt berechnen.", "Brutto ← Netto, dann MwSt ← Brutto · 2."],
              "Erst die Werte berechnen, die man braucht, dann ausgeben: Eingabe, Verarbeitung, Ausgabe.",
              "Welcher Wert wird zuerst gebraucht?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, "1.6", 5, {
      id: "it8-diagramme",
      title: "Diagramme gestalten und interpretieren",
      subtitle: "Kreis-, Säulen- und Liniendiagramm passend wählen und kritisch bewerten",
      why: "Ein Diagramm macht Zahlen auf einen Blick verständlich, aber nur, wenn der Typ zur Aussage passt.",
      html: `<p>Ein <strong>Kreisdiagramm</strong> zeigt <strong>Anteile an einem Ganzen</strong>: Alle Ausschnitte zusammen sind 100 % bzw. 360°. Ein Anteil von p % bekommt einen Winkel von p · 3,6°. Ein <strong>Säulendiagramm</strong> (oder Balkendiagramm) <strong>vergleicht Werte</strong> verschiedener Kategorien. Ein <strong>Liniendiagramm</strong> zeigt einen <strong>Verlauf</strong>, meist über die Zeit; die Linie zwischen zwei Punkten bedeutet, dass es Zwischenwerte gibt.</p>
<p>Zu einem guten Diagramm gehören Titel, Achsenbeschriftungen mit Einheiten und eine Legende. Bewerte Diagramme kritisch: Passt der Typ zur Aussage? Beginnt die Achse bei 0? Verzerren 3D-Effekte die Größen? Ein Kreisdiagramm für Werte, die kein Ganzes bilden, oder eine Linie zwischen Klassen erzeugt eine falsche Aussage.</p>
<div class="example"><strong>Beispiel:</strong> In der 8b mögen 40 % Sport am liebsten: Im Kreisdiagramm bekommt Sport 40 · 3,6° = 144°. Die Temperatur von Montag bis Freitag zeigt ein Liniendiagramm, die Schülerzahlen der vier achten Klassen ein Säulendiagramm.</div>
<div class="merke"><strong>Merke:</strong> Anteile → Kreis, Vergleich → Säulen, Verlauf → Linie. Winkel im Kreis = Anteil in % · 3,6°.</div>`,
      rule: "Anteile → Kreisdiagramm (p % ≙ p · 3,6°), Vergleich → Säulendiagramm, Verlauf → Liniendiagramm",
      terms: [
        ["Diagrammtypen", "Kreis · Säulen/Balken · Linien", "Anteile · Vergleich · Verlauf"],
        ["Bestandteile", "Titel · Achsenbeschriftung mit Einheit · Legende", "ohne sie ist ein Diagramm nicht interpretierbar"],
      ],
      quiz: [
        "Du willst zeigen, wie sich deine Körpergröße von Klasse 5 bis 8 entwickelt hat. Welcher Diagrammtyp passt?",
        "Liniendiagramm",
        "Kreisdiagramm",
        "Tortendiagramm in 3D",
        "Eine Entwicklung über die Zeit ist ein Verlauf; dafür ist das Liniendiagramm gemacht.",
      ],
      lab: diagrammLab,
      exercises: [
        kreiswinkel,
        cases(
          "diagramm-waehlen",
          [
            cc("Wie viele Schüler jeder Klasse beim Sportfest mitmachen, willst du vergleichen. Welcher Typ passt?", "Säulendiagramm", ["Liniendiagramm", "Kreisdiagramm"], "Säulen vergleichen Werte verschiedener Kategorien.", "Vergleich oder Verlauf?"),
            cc("Wofür eignet sich ein Kreisdiagramm?", "Für Anteile an einem Ganzen", ["Für einen Verlauf über Monate", "Für Werte ohne gemeinsames Ganzes"], "Alle Ausschnitte ergeben zusammen 100 %.", "Was ergibt der ganze Kreis?"),
            cc("Was gehört immer an die Achsen eines Diagramms?", "Eine Beschriftung mit Einheit", ["Eine Hintergrundfarbe", "Ein 3D-Effekt"], "Ohne Beschriftung weiß niemand, was gezeigt wird.", "Woher weiß der Leser, was gemessen wurde?"),
          ],
          [
            cc(
              "In einer Umfrage durften Schüler mehrere Lieblingsfächer nennen; die Prozente ergeben zusammen 160 %. Ist ein Kreisdiagramm geeignet?",
              "Nein, die Werte bilden kein Ganzes von 100 %; ein Säulendiagramm passt.",
              ["Ja, man verkleinert einfach alle Ausschnitte.", "Ja, Kreisdiagramme passen immer zu Prozenten."],
              "Bei Mehrfachnennungen überlappen die Anteile; ein Kreis würde eine falsche Aufteilung vortäuschen.",
              "Ergeben die Werte zusammen 100 %?",
            ),
            cc(
              "Ein Liniendiagramm verbindet die Schülerzahlen der Klassen 8a, 8b, 8c und 8d mit einer Linie. Was ist daran irreführend?",
              "Die Linie täuscht einen Verlauf mit Zwischenwerten vor, den es zwischen Klassen nicht gibt.",
              ["Nichts, Linien sehen moderner aus.", "Die Werte sind zu klein für eine Linie."],
              "Klassen sind getrennte Kategorien; für sie passt ein Säulendiagramm.",
              "Gibt es eine Klasse „zwischen“ 8a und 8b?",
            ),
            cc(
              "Ein 3D-Kreisdiagramm lässt den vorderen Ausschnitt größer wirken als einen gleich großen hinteren. Wie bewertest du das?",
              "Der 3D-Effekt verzerrt die Wirkung; ein flaches Diagramm zeigt die Anteile ehrlich.",
              ["3D macht Diagramme genauer.", "Das ist egal, weil die Prozentzahlen gleich bleiben."],
              "Perspektive vergrößert Vordergrund und verkleinert Hintergrund.",
              "Wirkt gleich Großes gleich groß?",
            ),
          ],
        ),
      ],
    }),
  ],
};
