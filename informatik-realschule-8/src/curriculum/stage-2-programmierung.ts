import { fmt } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import { caseLab } from "../lab/case-lab";
import {
  drawGarden,
  fieldName,
  type Garden,
  HEADING_NAMES,
  type Instruction,
  repeatTimes,
  repeatWhileFree,
  run,
  startState,
} from "../lab/robot";
import { open, rect, text } from "../lab/svg";
import type { ExerciseGenerator, LabDefinition, LabValues, Stage } from "../model/types";
import { cases, cc, choiceField, lesson, numberField, withSlips } from "./helpers";

const id = "programmierung";

const SLOT_OPTIONS = [
  { value: 0, label: "– leer –" },
  { value: 1, label: "vor" },
  { value: 2, label: "links drehen" },
  { value: 3, label: "rechts drehen" },
];
const INSTRUCTION: Record<number, Instruction> = { 1: "vor", 2: "links", 3: "rechts" };

function programOf(values: LabValues, slots: number): Instruction[] {
  const program: Instruction[] = [];
  for (let i = 0; i < slots; i++) {
    const instruction = INSTRUCTION[values[`s${i}`]];
    if (instruction) program.push(instruction);
  }
  return program;
}

const GARDEN: Garden = { size: 5, obstacles: [{ x: 0, y: 2 }, { x: 1, y: 2 }] };
const BEET = { x: 2, y: 4 };
const HAUS = { x: 4, y: 4 };
const LADEN = { x: 2, y: 2 };

const anweisungLab: LabDefinition = {
  kind: "roboter-anweisungen",
  title: "Rasenroboter programmieren",
  intro:
    "Der Roboter startet auf A5 und schaut nach Norden. Setze bis zu sechs Anweisungen in die richtige Reihenfolge. Steine kann er nicht überfahren.",
  params: Array.from({ length: 6 }, (_, i) => ({
    key: `s${i}`,
    type: "choice" as const,
    label: `Anweisung ${i + 1}`,
    options: SLOT_OPTIONS,
    value: 0,
  })),
  readouts: [
    {
      key: "pos",
      label: "Endposition",
      emphasis: true,
      compute: (v) => {
        const s = run(GARDEN, programOf(v, 6));
        return `${fieldName(s.x, s.y)}, Blick nach ${HEADING_NAMES[s.heading]}`;
      },
    },
    { key: "bumps", label: "Zusammenstöße", compute: (v) => run(GARDEN, programOf(v, 6)).bumps },
    { key: "count", label: "Anweisungen", compute: (v) => programOf(v, 6).length },
  ],
  goals: [
    {
      id: "beet",
      text: "Fahre zum Beet auf C5.",
      check: (v) => {
        const s = run(GARDEN, programOf(v, 6));
        return s.x === BEET.x && s.y === BEET.y;
      },
    },
    {
      id: "haus",
      text: "Fahre zum Gartenhaus auf E5.",
      check: (v) => {
        const s = run(GARDEN, programOf(v, 6));
        return s.x === HAUS.x && s.y === HAUS.y;
      },
    },
    {
      id: "laden",
      text: "Fahre ohne Zusammenstoß zur Ladestation auf C3.",
      check: (v) => {
        const s = run(GARDEN, programOf(v, 6));
        return s.x === LADEN.x && s.y === LADEN.y && s.bumps === 0;
      },
    },
  ],
  witnesses: {
    beet: { s0: 3, s1: 1, s2: 1, s3: 0, s4: 0, s5: 0 },
    haus: { s0: 3, s1: 1, s2: 1, s3: 1, s4: 1, s5: 0 },
    laden: { s0: 1, s1: 3, s2: 1, s3: 1, s4: 2, s5: 1 },
  },
  view: {
    render(v) {
      const s = run(GARDEN, programOf(v, 6));
      const at = (p: { x: number; y: number }) => s.x === p.x && s.y === p.y;
      return drawGarden(
        GARDEN,
        s,
        [
          { ...BEET, label: "Beet", reached: at(BEET) },
          { ...HAUS, label: "Haus", reached: at(HAUS) },
          { ...LADEN, label: "Laden", reached: at(LADEN) },
        ],
        programOf(v, 6).length ? programOf(v, 6).join(" · ") : "Noch keine Anweisung",
      );
    },
  },
};

const OPEN_GARDEN: Garden = { size: 5, obstacles: [] };

function randomProgram(rng: Rng, length: number): Instruction[] {
  const program: Instruction[] = [];
  for (let i = 0; i < length; i++) {
    program.push(rng.next() < 0.6 ? "vor" : rng.pick(["links", "rechts"] as const));
  }
  if (!program.includes("vor")) program[0] = "vor";
  return program;
}

const programmVerfolgen: ExerciseGenerator = {
  id: "programm-verfolgen",
  make(rng, level) {
    const program = randomProgram(rng, level === 1 ? 4 : 6);
    const end = run(OPEN_GARDEN, program);
    const swapped = run(
      OPEN_GARDEN,
      program.map((i) => (i === "links" ? "rechts" : i === "rechts" ? "links" : i)),
    );
    const label = (x: number, y: number, heading: number) =>
      level === 1 ? fieldName(x, y) : `${fieldName(x, y)}, Blick nach ${HEADING_NAMES[heading]}`;
    const answer = label(end.x, end.y, end.heading);
    const candidates = [
      label(swapped.x, swapped.y, swapped.heading),
      ...(level === 2 ? [1, 2, 3].map((d) => label(end.x, end.y, (end.heading + d) % 4)) : []),
      ...[
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]
        .map(([dx, dy]) => [end.x + dx, end.y + dy])
        .filter(([x, y]) => x >= 0 && y >= 0 && x < 5 && y < 5)
        .map(([x, y]) => label(x, y, end.heading)),
    ];
    const variants = [...new Set(candidates)].filter((option) => option !== answer).slice(0, 2);
    return {
      prompt:
        level === 1
          ? `Der Roboter steht auf A5 und schaut nach Norden. Auf welchem Feld steht er nach diesem Programm?`
          : `Verfolge das Programm Schritt für Schritt. Der Roboter startet auf A5 mit Blick nach Norden; Wände halten ihn auf. Wo steht er am Ende und wohin schaut er?`,
      given: [`Programm: ${program.join(" · ")}`, "Spalten A–E von links, Zeilen 1–5 von oben"],
      formulaHint: "„links drehen“ und „rechts drehen“ ändern nur die Blickrichtung, „vor“ bewegt um ein Feld.",
      fields: [choiceField(rng, level === 1 ? "Endfeld" : "Endfeld und Blickrichtung", answer, variants)],
      steps: [
        "Schreibe nach jeder Anweisung Feld und Blickrichtung auf.",
        program
          .map((_, index) => {
            const s = run(OPEN_GARDEN, program.slice(0, index + 1));
            return `${index + 1}. ${program[index]} → ${fieldName(s.x, s.y)} ${HEADING_NAMES[s.heading]}`;
          })
          .join("; "),
        `<strong>${answer}</strong>`,
      ],
    };
  },
};

// ─── Lab: Variablen ──────────────────────────────────────────────────────

function kasse(v: LabValues): { summe: number; first: number } {
  const product = v.preis * v.anzahl;
  if (v.order === 0) {
    const first = product;
    return { first, summe: Math.max(0, first - v.gutschein) };
  }
  return { first: -v.gutschein, summe: product };
}

const variablenLab: LabDefinition = {
  kind: "variablen-kasse",
  title: "Variablen im Kassenprogramm",
  intro:
    "Das Programm berechnet, was du am Schulkiosk zahlst. Ändere die Eingaben und die Reihenfolge der Anweisungen und verfolge den Wert der Variablen summe.",
  params: [
    { key: "preis", type: "range", label: "preis (je Stück)", unit: "€", min: 1, max: 10, step: 1, value: 3 },
    { key: "anzahl", type: "range", label: "anzahl", unit: "", min: 0, max: 6, step: 1, value: 0 },
    {
      key: "gutschein",
      type: "choice",
      label: "gutschein",
      options: [
        { value: 0, label: "0 €" },
        { value: 2, label: "2 €" },
        { value: 5, label: "5 €" },
      ],
      value: 0,
    },
    {
      key: "order",
      type: "choice",
      label: "Reihenfolge",
      options: [
        { value: 0, label: "erst multiplizieren, dann Gutschein abziehen" },
        { value: 1, label: "erst Gutschein abziehen, dann multiplizieren" },
      ],
      value: 0,
    },
  ],
  readouts: [
    {
      key: "z1",
      label: "nach Zeile 1",
      compute: (v) => `summe = ${fmt(kasse(v).first, 0)}`,
    },
    { key: "summe", label: "Ausgabe summe", unit: "€", digits: 0, emphasis: true, compute: (v) => kasse(v).summe },
  ],
  goals: [
    { id: "zwanzig", text: "Lass das Programm genau 20 € ausgeben.", check: (v) => kasse(v).summe === 20 },
    {
      id: "gratis",
      text: "Kaufe mindestens ein Stück, das der Gutschein vollständig bezahlt (Ausgabe 0 €).",
      check: (v) => v.anzahl > 0 && v.order === 0 && kasse(v).summe === 0,
    },
    {
      id: "reihenfolge",
      text: "Vertausche die Anweisungen so, dass der Gutschein verloren geht.",
      check: (v) => v.order === 1 && v.gutschein > 0 && v.anzahl > 0,
    },
  ],
  view: {
    render(v) {
      const k = kasse(v);
      let out = open("Programm mit Variablen");
      out += rect(30, 24, 460, 170, "lab-panel", 'rx="12"');
      const lines =
        v.order === 0
          ? ["summe ← preis · anzahl", "summe ← summe − gutschein", "ausgabe(summe)"]
          : ["summe ← 0 − gutschein", "summe ← preis · anzahl", "ausgabe(summe)"];
      lines.forEach((entry, index) => {
        out += text(54, 64 + index * 40, `${index + 1}  ${entry}`, "lab-text-big");
      });
      out += text(54, 230, `preis = ${v.preis} €   anzahl = ${v.anzahl}   gutschein = ${v.gutschein} €`, "lab-text");
      out += rect(30, 250, 460, 60, k.summe === 0 && v.anzahl > 0 ? "lab-fill-ok" : "lab-fill-a", 'rx="12"');
      out += text(260, 288, `Ausgabe: summe = ${k.summe} €`, "lab-text-big", "middle");
      return `${out}</svg>`;
    },
  },
};

const verfolgen: ExerciseGenerator = {
  id: "variablen-verfolgen",
  make(rng, level) {
    if (level === 1) {
      const a = rng.int(2, 9);
      const b = rng.int(2, 9);
      const result = a + b * 2;
      return {
        prompt: "Welchen Wert gibt das Programm aus?",
        given: [`a ← ${a}`, `b ← ${b}`, "a ← a + b · 2", "ausgabe(a)"],
        formulaHint: "Gehe Zeile für Zeile vor. Punkt vor Strich gilt auch im Programm; eine Zuweisung überschreibt den alten Wert.",
        fields: [
          withSlips(numberField("Ausgabe =", result), [(a + b) * 2, "Punkt vor Strich: Erst b · 2, dann + a."], [a, "a wurde in Zeile 3 überschrieben."]),
        ],
        steps: [`a = ${a}, b = ${b}`, `a ← ${a} + ${b} · 2 = ${result}`, `<strong>Ausgabe ${result}</strong>`],
      };
    }
    const x = rng.int(3, 9);
    const y = rng.int(2, 6);
    const a1 = x;
    const b1 = a1 * y;
    const a2 = b1 - a1;
    const b2 = b1 + a2;
    return {
      prompt: "Verfolge die Variablen in einer Tabelle. Welchen Wert hat <strong>b</strong> am Ende?",
      given: [`a ← ${x}`, `b ← a · ${y}`, "a ← b − a", "b ← b + a", "ausgabe(b)"],
      fields: [
        withSlips(
          numberField("b =", b2),
          [b1 + x, "In Zeile 4 hat a schon den neuen Wert aus Zeile 3."],
          [b1, "Zeile 4 ändert b noch einmal."],
        ),
      ],
      steps: [`a = ${a1}; b = ${a1} · ${y} = ${b1}`, `a = ${b1} − ${a1} = ${a2}`, `<strong>b = ${b1} + ${a2} = ${b2}</strong>`],
    };
  },
};

// ─── Lab: Auswahl ────────────────────────────────────────────────────────

const OPS = [">", "≥", "<"] as const;
const holds = (op: number, left: number, right: number) =>
  op === 0 ? left > right : op === 1 ? left >= right : left < right;

const auswahlLab: LabDefinition = {
  kind: "auswahl-luefter",
  title: "Lüftersteuerung mit Auswahl",
  intro:
    "Ein Temperatursensor liefert einen Messwert. Die Auswahl entscheidet, ob der Lüfter läuft. Mit „sonst“ wird daraus eine zweiseitige Auswahl.",
  params: [
    { key: "temp", type: "range", label: "Messwert temperatur", unit: "°C", min: 15, max: 35, step: 1, value: 20 },
    { key: "limit", type: "range", label: "Grenzwert", unit: "°C", min: 20, max: 30, step: 1, value: 25 },
    { key: "op", type: "choice", label: "Vergleichsoperator", options: OPS.map((label, value) => ({ value, label })), value: 0 },
    {
      key: "two",
      type: "choice",
      label: "Art der Auswahl",
      options: [
        { value: 0, label: "einseitig (nur „dann“)" },
        { value: 1, label: "zweiseitig (mit „sonst“)" },
      ],
      value: 0,
    },
  ],
  readouts: [
    {
      key: "cond",
      label: "Bedingung",
      compute: (v) => `${v.temp} ${OPS[v.op]} ${v.limit} ist ${holds(v.op, v.temp, v.limit) ? "wahr" : "falsch"}`,
    },
    {
      key: "out",
      label: "Ausgabe",
      emphasis: true,
      compute: (v) =>
        holds(v.op, v.temp, v.limit) ? "Lüfter an" : v.two === 1 ? "Anzeige „Fenster zu“" : "keine Anweisung (einseitig)",
    },
  ],
  goals: [
    {
      id: "grenze",
      text: "Der Lüfter soll schon bei genau 25 °C laufen: Messwert 25 °C, Grenzwert 25 °C, Bedingung wahr.",
      check: (v) => v.temp === 25 && v.limit === 25 && holds(v.op, v.temp, v.limit),
    },
    {
      id: "sonst",
      text: "Zeige den „sonst“-Zweig: zweiseitige Auswahl mit falscher Bedingung.",
      check: (v) => v.two === 1 && !holds(v.op, v.temp, v.limit),
    },
    {
      id: "ab28",
      text: "Stelle die Bedingung so ein, dass der Lüfter genau ab 28 °C läuft (Grenzwert 28 und ≥).",
      check: (v) => v.limit === 28 && v.op === 1,
    },
  ],
  view: {
    render(v) {
      const on = holds(v.op, v.temp, v.limit);
      let out = open("Struktogramm einer Auswahl");
      out += rect(40, 30, 440, 50, "lab-panel");
      out += text(260, 62, `wenn temperatur ${OPS[v.op]} ${v.limit}`, "lab-text-big", "middle");
      out += text(70, 104, "wahr", "lab-text-small");
      out += text(450, 104, "falsch", "lab-text-small", "end");
      out += rect(40, 112, 220, 80, on ? "lab-fill-ok" : "lab-shape");
      out += rect(260, 112, 220, 80, !on && v.two === 1 ? "lab-fill-a" : "lab-shape");
      out += text(150, 158, "Lüfter an", "lab-text", "middle");
      out += text(370, 158, v.two === 1 ? "zeige „Fenster zu“" : "(leer)", "lab-text", "middle");
      out += text(260, 240, `Messwert: ${v.temp} °C`, "lab-text-big", "middle");
      out += text(260, 280, on ? "Lüfter läuft" : "Lüfter steht", on ? "lab-text-ok" : "lab-text-muted", "middle");
      return `${out}</svg>`;
    },
  },
};

const auswahlAuswerten: ExerciseGenerator = {
  id: "auswahl-auswerten",
  make(rng, level) {
    if (level === 1) {
      const punkte = rng.int(10, 30);
      const grenze = rng.int(12, 28);
      const bonus = rng.int(2, 5);
      const result = punkte > grenze ? punkte + bonus : punkte;
      return {
        prompt: "Welchen Wert hat <strong>punkte</strong> nach der einseitigen Auswahl?",
        given: [`punkte ← ${punkte}`, `wenn punkte > ${grenze} dann punkte ← punkte + ${bonus}`],
        formulaHint: "Prüfe zuerst, ob die Bedingung wahr oder falsch ist. Ist sie falsch, passiert bei der einseitigen Auswahl nichts.",
        fields: [
          withSlips(
            numberField("punkte =", result),
            [punkte > grenze ? punkte : punkte + bonus, `Prüfe noch einmal: Ist ${punkte} > ${grenze} wahr?`],
          ),
        ],
        steps: [
          `${punkte} > ${grenze} ist ${punkte > grenze ? "wahr" : "falsch"}.`,
          punkte > grenze ? `punkte ← ${punkte} + ${bonus}` : "Die Anweisung wird übersprungen.",
          `<strong>punkte = ${result}</strong>`,
        ],
      };
    }
    const alter = rng.pick([12, 13, 14, 15, 16, 17]);
    const grenze = rng.pick([12, 14, 16]);
    const inclusive = rng.next() < 0.5;
    const cond = inclusive ? alter >= grenze : alter > grenze;
    const preis = cond ? 8 : 5;
    return {
      prompt: `Ein Kino berechnet mit einer zweiseitigen Auswahl den Eintritt. Welchen Preis gibt das Programm für ein Alter von ${alter} Jahren aus?`,
      given: [
        `alter ← ${alter}`,
        `wenn alter ${inclusive ? "≥" : ">"} ${grenze} dann preis ← 8 sonst preis ← 5`,
        "ausgabe(preis)",
      ],
      fields: [
        withSlips(numberField("preis =", preis, "€"), [cond ? 5 : 8, `Achte auf den Operator: ${inclusive ? "≥ schließt den Grenzwert ein" : "> schließt den Grenzwert aus"}.`]),
      ],
      steps: [
        `${alter} ${inclusive ? "≥" : ">"} ${grenze} ist ${cond ? "wahr" : "falsch"}.`,
        cond ? "Der „dann“-Zweig wird ausgeführt." : "Der „sonst“-Zweig wird ausgeführt.",
        `<strong>preis = ${preis} €</strong>`,
      ],
    };
  },
};

// ─── Lab: Wiederholung ───────────────────────────────────────────────────

const LOOP_GARDEN: Garden = { size: 6, obstacles: [] };
const BODIES: Instruction[][] = [["vor"], ["vor", "rechts"], ["vor", "vor", "rechts"]];

function loop(v: LabValues) {
  const body = BODIES[v.body];
  return v.kind === 0 ? repeatTimes(LOOP_GARDEN, body, v.n) : repeatWhileFree(LOOP_GARDEN, body);
}

const wiederholungLab: LabDefinition = {
  kind: "schleifen-roboter",
  title: "Wiederholungen mit dem Roboter",
  intro:
    "Wähle die Art der Wiederholung, die Anzahl und den Schleifenkörper. „solange vorne frei“ prüft die Bedingung vor jedem Durchlauf.",
  params: [
    {
      key: "kind",
      type: "choice",
      label: "Wiederholung",
      options: [
        { value: 0, label: "wiederhole n-mal (feste Anzahl)" },
        { value: 1, label: "wiederhole solange vorne frei (Anfangsbedingung)" },
      ],
      value: 0,
    },
    { key: "n", type: "range", label: "Anzahl n", unit: "", min: 1, max: 8, step: 1, value: 1, showIf: (v) => v.kind === 0 },
    {
      key: "body",
      type: "choice",
      label: "Schleifenkörper",
      options: [
        { value: 0, label: "vor" },
        { value: 1, label: "vor · rechts drehen" },
        { value: 2, label: "vor · vor · rechts drehen" },
      ],
      value: 0,
    },
  ],
  readouts: [
    { key: "rounds", label: "Durchläufe", compute: (v) => (loop(v).endless ? "endlos (abgebrochen)" : loop(v).rounds) },
    {
      key: "pos",
      label: "Endposition",
      emphasis: true,
      compute: (v) => {
        const r = loop(v);
        return r.endless ? "Endlosschleife: Die Bedingung wird nie falsch." : `${fieldName(r.state.x, r.state.y)}, Blick nach ${HEADING_NAMES[r.state.heading]}`;
      },
    },
  ],
  goals: [
    {
      id: "quadrat1",
      text: "Fahre ein kleines Quadrat und komme auf A6 mit Blick nach Norden zurück.",
      check: (v) => v.kind === 0 && v.body === 1 && v.n === 4,
    },
    {
      id: "wand",
      text: "Lass den Roboter mit einer Wiederholung mit Anfangsbedingung genau bis zur Wand fahren.",
      check: (v) => v.kind === 1 && v.body === 0,
    },
    {
      id: "quadrat2",
      text: "Fahre ein Quadrat mit zwei Feldern Seitenlänge zurück zum Start.",
      check: (v) => v.kind === 0 && v.body === 2 && v.n === 4,
    },
  ],
  view: {
    render(v) {
      const r = loop(v);
      const start = startState(LOOP_GARDEN);
      return drawGarden(
        LOOP_GARDEN,
        r.state,
        [{ x: start.x, y: start.y, label: "Start", reached: false }],
        r.endless
          ? "Endlosschleife: Der Roboter kreist, die Wand kommt nie."
          : `${v.kind === 0 ? `wiederhole ${v.n}-mal` : "solange vorne frei"}: ${BODIES[v.body].join(" · ")}`,
      );
    },
  },
};

const schleifeZaehlen: ExerciseGenerator = {
  id: "schleife-zaehlen",
  make(rng, level) {
    if (level === 1) {
      const start = rng.int(0, 10);
      const n = rng.int(3, 8);
      const plus = rng.int(2, 6);
      const result = start + n * plus;
      return {
        prompt: "Welchen Wert hat <strong>zaehler</strong> nach der Wiederholung mit fester Anzahl?",
        given: [`zaehler ← ${start}`, `wiederhole ${n}-mal: zaehler ← zaehler + ${plus}`],
        formulaHint: "Der Schleifenkörper läuft genau n-mal: Endwert = Startwert + n · Schritt.",
        fields: [withSlips(numberField("zaehler =", result), [n * plus, "Der Startwert zählt mit."], [start + (n - 1) * plus, "Die Schleife läuft genau n-mal, nicht n − 1-mal."])],
        steps: [`${n} Durchläufe zu je + ${plus}`, `${start} + ${n} · ${plus}`, `<strong>zaehler = ${result}</strong>`],
      };
    }
    const start = rng.pick([1, 2, 3]);
    const limit = rng.pick([20, 30, 50, 100]);
    let value = start;
    let rounds = 0;
    while (value < limit) {
      value *= 2;
      rounds += 1;
    }
    const askRounds = rng.next() < 0.5;
    return {
      prompt: askRounds
        ? "Wie oft wird der Schleifenkörper ausgeführt? Die Bedingung wird vor jedem Durchlauf geprüft."
        : "Welchen Wert hat <strong>zahl</strong>, wenn die Wiederholung endet?",
      given: [`zahl ← ${start}`, `solange zahl < ${limit}: zahl ← zahl · 2`],
      fields: [
        askRounds
          ? withSlips(numberField("Durchläufe =", rounds), [rounds + 1, "Wird die Bedingung falsch, läuft der Körper nicht mehr."])
          : withSlips(numberField("zahl =", value), [value / 2, `Die Schleife läuft weiter, solange zahl < ${limit} ist.`]),
      ],
      steps: [
        Array.from({ length: rounds }, (_, i) => `${start * 2 ** i} < ${limit} → ${start * 2 ** (i + 1)}`).join("; "),
        `${value} < ${limit} ist falsch: Ende nach ${rounds} Durchläufen.`,
        `<strong>${askRounds ? `${rounds} Durchläufe` : `zahl = ${fmt(value, 0)}`}</strong>`,
      ],
    };
  },
};

export const STAGE_PROGRAMMIERUNG: Stage = {
  id,
  stageNumber: 2,
  title: "Einführung in die Programmierung",
  subtitle: "Handlungsvorschriften, Ereignisse, Variablen, Auswahl und Wiederholung",
  icon: "🤖",
  accent: "#7c3aed",
  badgeTitle: "Roboter-Programmiererin",
  lehrplanLabel: "IT 1.2 · ca. 14 Std.",
  module: "1.2",
  lessons: [
    lesson(id, "1.2", 1, {
      id: "it8-handlungsvorschriften",
      title: "Handlungsvorschriften und Programme",
      subtitle: "Abläufe eindeutig beschreiben, Software, Programmiersprache und Entwicklungsumgebung",
      why: "Ein Roboter tut genau, was im Programm steht, nicht was du meinst. Wer Abläufe eindeutig beschreibt, kann Maschinen steuern.",
      html: `<p>Eine <strong>Handlungsvorschrift</strong> (ein Algorithmus) beschreibt Schritt für Schritt, wie eine Aufgabe gelöst wird. Damit ein Computer sie ausführen kann, muss sie <strong>eindeutig</strong> (jeder Schritt hat genau eine Bedeutung), <strong>ausführbar</strong> (jeder Schritt ist machbar) und <strong>endlich</strong> (sie kommt zu einem Ende) sein. „Fahre ein Stück nach vorn“ ist nicht eindeutig, „fahre ein Feld vor“ schon.</p>
<p>Ein <strong>Programm</strong> ist eine Handlungsvorschrift in einer <strong>Programmiersprache</strong>, z. B. in Blöcken (Scratch) oder als Text (Python). Programme heißen zusammen <strong>Software</strong>. Geschrieben und getestet werden sie in einer <strong>Entwicklungsumgebung</strong>: einem Programm mit Editor, Startknopf und Fehleranzeige.</p>
<div class="example"><strong>Beispiel:</strong> Der Rasenroboter steht auf A5 und schaut nach Norden. Das Beet liegt auf C5. Das Programm „rechts drehen · vor · vor“ dreht ihn nach Osten und fährt ihn zwei Felder weiter auf C5. Die Reihenfolge zählt: „vor · vor · rechts drehen“ endet auf A3.</div>
<div class="merke"><strong>Merke:</strong> Eine Handlungsvorschrift ist eindeutig, ausführbar und endlich. Die Anweisungen werden der Reihe nach ausgeführt; eine andere Reihenfolge ergibt ein anderes Ergebnis.</div>`,
      rule: "Handlungsvorschrift = eindeutige, ausführbare, endliche Folge von Anweisungen",
      terms: [
        ["Software", "Programme und ihre Daten", "z. B. Betriebssystem, Textverarbeitung, Spiele"],
        ["Programmiersprache · Entwicklungsumgebung", "Sprache mit festen Regeln für Anweisungen · Werkzeug zum Schreiben, Starten und Testen", "z. B. Scratch, Python · Editor mit Startknopf"],
      ],
      quiz: [
        "Welche Anweisung ist für einen Roboter eindeutig?",
        "Fahre drei Felder vor.",
        "Fahre ein Stück vor.",
        "Fahre vor, bis es reicht.",
        "Nur „drei Felder“ legt genau fest, was passiert; „ein Stück“ und „bis es reicht“ lassen offen, wie weit.",
      ],
      lab: anweisungLab,
      exercises: [
        programmVerfolgen,
        cases(
          "begriffe-vorschrift",
          [
            cc(
              "Wie heißt das Werkzeug, in dem du ein Programm schreibst, startest und auf Fehler prüfst?",
              "Entwicklungsumgebung",
              ["Betriebssystem", "Tabellenkalkulation"],
              "Eine Entwicklungsumgebung verbindet Editor, Ausführen und Fehlersuche.",
              "Es ist ein Werkzeug zum Entwickeln.",
            ),
            cc(
              "Welche Eigenschaft fehlt der Vorschrift „Gieße die Pflanzen, bis sie genug haben“?",
              "Sie ist nicht eindeutig.",
              ["Sie ist nicht endlich, weil Pflanzen immer wachsen.", "Sie ist zu kurz."],
              "„genug“ ist nicht festgelegt; ein Roboter weiß nicht, wann er aufhören soll.",
              "Weiß jeder genau, wann „genug“ ist?",
            ),
            cc(
              "Was ist Software?",
              "Programme mit ihren Daten, die auf einem Computer laufen.",
              ["Alle Geräte, die man anfassen kann.", "Nur Computerspiele."],
              "Hardware kann man anfassen, Software sind die Programme.",
              "Gegenteil von Hardware.",
            ),
          ],
          [
            cc(
              "Ein Mähroboter soll mähen „solange Rasen da ist“. Ein Kind hat einen Ball im Garten liegen lassen. Was fehlt der Vorschrift?",
              "Eine eindeutige Regel für Hindernisse, z. B. „Hindernis vorne: rechts drehen“.",
              ["Eine schnellere Geschwindigkeit.", "Eine zweite Programmiersprache."],
              "Eine Handlungsvorschrift muss jede Situation festlegen, die vorkommen kann, sonst bleibt der Ablauf unklar.",
              "Was macht der Roboter am Ball?",
            ),
            cc(
              "Zwei Programme enthalten dieselben Anweisungen in anderer Reihenfolge. Was gilt?",
              "Sie können zu unterschiedlichen Ergebnissen führen.",
              ["Sie führen immer zum selben Ergebnis.", "Eines davon ist immer fehlerhaft."],
              "Anweisungen werden nacheinander ausgeführt; drehen vor oder nach dem Fahren ergibt andere Wege.",
              "Vergleiche „rechts · vor“ mit „vor · rechts“.",
            ),
            cc(
              "Eine Vorschrift lautet: „1. Gehe zu Schritt 2. 2. Gehe zu Schritt 1.“ Welche Eigenschaft verletzt sie?",
              "Sie ist nicht endlich.",
              ["Sie ist nicht eindeutig.", "Sie ist nicht ausführbar."],
              "Beide Schritte sind klar und machbar, aber der Ablauf kommt nie an ein Ende.",
              "Hört der Ablauf irgendwann auf?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, "1.2", 2, {
      id: "it8-eingabe-ausgabe",
      title: "Eingabe- und Ausgabeereignisse",
      subtitle: "Benutzereingaben und Sensorwerte auslösen, optische und akustische Ausgaben antworten",
      why: "Eine Ampel, ein Spiel oder ein Mähroboter reagieren auf ihre Umgebung. Wer Eingaben und Ausgaben trennt, versteht, wie ein Programm mit der Welt verbunden ist.",
      html: `<p>Ein Programm erhält Daten über <strong>Eingabeereignisse</strong>: eine <strong>Benutzereingabe</strong> (Taste gedrückt, Bildschirm berührt, Text eingegeben) oder einen <strong>Sensorwert</strong> (Helligkeit, Temperatur, Abstand, Neigung). Es antwortet mit <strong>Ausgabeereignissen</strong>: <strong>optisch</strong> (LED leuchtet, Text oder Bild auf dem Display) oder <strong>akustisch</strong> (Ton, Melodie). Auch ein Motor, der sich dreht, ist eine Ausgabe.</p>
<p>Viele Programme sind <strong>ereignisgesteuert</strong>: „Wenn Taste A gedrückt wird, zeige ein Herz.“ Das Programm wartet, bis das Ereignis eintritt, und führt dann die zugehörigen Anweisungen aus.</p>
<div class="example"><strong>Beispiel:</strong> Ein Mikrocontroller misst mit seinem Lichtsensor die Helligkeit. Wird es dunkel (Sensorwert unter 30), schaltet er die LED an und piept. Eingabe: Sensorwert Helligkeit. Ausgaben: LED (optisch) und Piepton (akustisch).</div>
<div class="merke"><strong>Merke:</strong> Eingabe = Daten kommen ins Programm (Benutzer oder Sensor). Ausgabe = das Programm wirkt nach außen (Licht, Bild, Ton, Bewegung).</div>`,
      rule: "Eingabe (Benutzereingabe, Sensorwert) → Verarbeitung im Programm → Ausgabe (optisch, akustisch, Bewegung)",
      terms: [
        ["Eingabeereignis", "Taste, Touch, Mausklick · Sensorwert: Licht, Temperatur, Abstand", "Daten kommen ins Programm"],
        ["Ausgabeereignis", "LED, Display, Bild · Ton, Melodie · Motor", "Das Programm wirkt nach außen"],
      ],
      quiz: [
        "Ein Programm spielt einen Ton, wenn der Abstandssensor ein Hindernis unter 10 cm misst. Was ist hier die Eingabe?",
        "Der Messwert des Abstandssensors",
        "Der Ton aus dem Lautsprecher",
        "Die Zahl 10 im Programmtext",
        "Der Sensor liefert dem Programm Daten von außen; der Ton ist die Ausgabe, die 10 ein fester Grenzwert.",
      ],
      lab: caseLab({
        kind: "eingabe-ausgabe",
        title: "Ereignisse eines Mikrocontrollers",
        intro: "Ordne jedes Ereignis ein: Kommt es als Eingabe ins Programm oder geht es als Ausgabe nach außen?",
        categories: ["Eingabe: Benutzereingabe", "Eingabe: Sensorwert", "Ausgabe: optisch", "Ausgabe: akustisch"],
        cases: [
          { short: "Taste A wird gedrückt", text: "Taste A wird gedrückt.", answer: 0, why: "Ein Mensch gibt etwas ein.", hint: "Wer löst das Ereignis aus?" },
          { short: "Lichtsensor misst 25", text: "Der Lichtsensor misst den Wert 25.", answer: 1, why: "Ein Sensor liefert einen Messwert.", hint: "Kommt der Wert von einem Menschen oder einem Messfühler?" },
          { short: "LED-Matrix zeigt Pfeil", text: "Die LED-Matrix zeigt einen Pfeil.", answer: 2, why: "Licht nach außen: optische Ausgabe.", hint: "Sieht oder hört man es?" },
          { short: "Lautsprecher piept", text: "Der Lautsprecher piept dreimal.", answer: 3, why: "Ton nach außen: akustische Ausgabe.", hint: "Sieht oder hört man es?" },
          { short: "Gerät wird geschüttelt", text: "Der Bewegungssensor meldet: Gerät wird geschüttelt.", answer: 1, why: "Der Beschleunigungssensor misst die Bewegung.", hint: "Welches Bauteil erkennt das Schütteln?" },
          { short: "Display zeigt Punkte", text: "Das Display zeigt den Punktestand 12.", answer: 2, why: "Text auf dem Display ist eine optische Ausgabe.", hint: "Geht das Ereignis ins Programm hinein oder heraus?" },
        ],
        goals: [
          { text: "Trenne Benutzereingabe und Sensorwert (Fälle 1 und 2).", cases: [0, 1] },
          { text: "Ordne beide Ausgaben der LED-Matrix und des Lautsprechers zu.", cases: [2, 3] },
          { text: "Ordne alle sechs Ereignisse richtig zu.", cases: [0, 1, 2, 3, 4, 5] },
        ],
      }),
      exercises: [
        cases(
          "ereignis-einordnen",
          [
            cc("Ein Thermometer-Programm erhält 22 °C vom Temperaturfühler. Was ist das?", "Eingabe: Sensorwert", ["Ausgabe: optisch", "Eingabe: Benutzereingabe"], "Der Fühler misst die Temperatur und liefert sie dem Programm.", "Woher kommt der Wert?"),
            cc("Ein Spiel zeigt nach dem Ende „Game over“ an. Was ist das?", "Ausgabe: optisch", ["Ausgabe: akustisch", "Eingabe: Sensorwert"], "Der Text erscheint sichtbar auf dem Bildschirm.", "Sieht oder hört man es?"),
            cc("Du tippst deinen Namen in ein Eingabefeld. Was ist das?", "Eingabe: Benutzereingabe", ["Eingabe: Sensorwert", "Ausgabe: optisch"], "Ein Mensch gibt Daten über die Tastatur ein.", "Wer liefert die Daten?"),
          ],
          [
            cc(
              "Eine Alarmanlage soll losheulen, wenn nachts ein Fenster geöffnet wird. Welche Ereignisse braucht das Programm?",
              "Eingabe: Fenstersensor meldet „offen“; Ausgabe: Sirene (akustisch).",
              ["Eingabe: Sirene; Ausgabe: Fenstersensor.", "Nur eine Ausgabe, eine Eingabe ist nicht nötig."],
              "Das Programm muss das Öffnen erst erfahren (Sensor) und antwortet dann nach außen (Ton).",
              "Was kommt zuerst: erkennen oder reagieren?",
            ),
            cc(
              "Ein Fahrradlicht soll angehen, sobald es dunkel wird. Welche Eingabe ist geeignet?",
              "Der Helligkeitswert eines Lichtsensors.",
              ["Eine Taste, die der Fahrer drückt, wenn es dunkel ist.", "Ein Lautsprecher am Lenker."],
              "„Sobald es dunkel wird“ verlangt eine Messung der Helligkeit, keine Handlung des Fahrers.",
              "Wer oder was erkennt Dunkelheit selbst?",
            ),
            cc(
              "Ein Programm reagiert erst, wenn eine Taste gedrückt wird, und wartet sonst. Wie nennt man diese Art der Steuerung?",
              "Ereignisgesteuert",
              ["Zufallsgesteuert", "Zeitlos"],
              "Das Programm verbindet Ereignisse mit Anweisungen und wartet auf das Ereignis.",
              "Was löst die Anweisungen aus?",
            ),
          ],
        ),
        {
          id: "sensorprogramm",
          make(rng, level) {
            const grenze = rng.pick([30, 40, 50]);
            const wert = rng.pick([10, 20, 35, 45, 60, 80].filter((w) => w !== grenze));
            const dunkel = wert < grenze;
            if (level === 1) {
              const answer = dunkel ? "LED an" : "LED aus";
              return {
                prompt: `Der Lichtsensor misst ${wert}. Was gibt das Programm aus?`,
                given: [`wenn lichtwert < ${grenze} dann LED an sonst LED aus`],
                formulaHint: `Vergleiche den Messwert mit ${grenze}: Ist ${wert} < ${grenze}?`,
                fields: [choiceField(rng, "Ausgabe", answer, [dunkel ? "LED aus" : "LED an", "Lautsprecher piept"])],
                steps: [`${wert} < ${grenze} ist ${dunkel ? "wahr" : "falsch"}.`, dunkel ? "Der „dann“-Zweig läuft." : "Der „sonst“-Zweig läuft.", `<strong>${answer}</strong>`],
              };
            }
            const taste = rng.next() < 0.5;
            const outputs = [dunkel ? "LED an" : "LED aus", taste ? "Ton" : "kein Ton"];
            const answer = outputs.join(", ");
            return {
              prompt: `Der Lichtsensor misst ${wert}, und Taste A wird ${taste ? "gedrückt" : "nicht gedrückt"}. Welche Ausgaben erzeugt das Programm?`,
              given: [`wenn lichtwert < ${grenze} dann LED an sonst LED aus`, "wenn Taste A gedrückt dann spiele Ton"],
              fields: [
                choiceField(rng, "Ausgaben", answer, [
                  [dunkel ? "LED aus" : "LED an", outputs[1]].join(", "),
                  [outputs[0], taste ? "kein Ton" : "Ton"].join(", "),
                ]),
              ],
              steps: [`Sensor: ${wert} < ${grenze} ist ${dunkel ? "wahr" : "falsch"} → ${outputs[0]}.`, `Taste A ${taste ? "gedrückt → Ton" : "nicht gedrückt → kein Ton"}.`, `<strong>${answer}</strong>`],
            };
          },
        },
      ],
    }),
    lesson(id, "1.2", 3, {
      id: "it8-variablen-sequenz",
      title: "Variablen, Wertzuweisung und Sequenz",
      subtitle: "Bezeichner, Werte, Rechenoperatoren und Anweisungen der Reihe nach",
      why: "Ein Spiel muss sich Punkte, Leben und Zeit merken. Dafür gibt es Variablen, und ihr Wert hängt davon ab, in welcher Reihenfolge die Anweisungen laufen.",
      html: `<p>Eine <strong>Variable</strong> ist ein benannter Speicherplatz für einen Wert. Ihr Name heißt <strong>Bezeichner</strong> (z. B. <code>punkte</code>, <code>preis</code>). Mit einer <strong>Wertzuweisung</strong> bekommt sie einen neuen Wert: <code>punkte ← 0</code> (in Python <code>punkte = 0</code>). Der alte Wert wird dabei <strong>überschrieben</strong>. Rechts vom Pfeil darf die Variable selbst stehen: <code>punkte ← punkte + 10</code> heißt „neuer Wert = alter Wert plus 10“.</p>
<p>Mit <strong>Rechenoperatoren</strong> (+, −, ·, :) berechnet das Programm neue Werte; wie in der Mathematik gilt Punkt vor Strich. Eine <strong>Sequenz</strong> ist eine Folge von Anweisungen, die genau in dieser Reihenfolge ausgeführt wird.</p>
<div class="example"><strong>Beispiel:</strong> <code>preis ← 3</code>, <code>anzahl ← 4</code>, <code>summe ← preis · anzahl</code>, <code>summe ← summe − 2</code>. Nach Zeile 3 ist summe = 12, nach Zeile 4 ist summe = 10. Vertauschst du die Zeilen 3 und 4, überschreibt Zeile 3 den Abzug und summe ist am Ende 12.</div>
<div class="merke"><strong>Merke:</strong> Eine Wertzuweisung überschreibt den alten Wert. Eine Sequenz läuft Zeile für Zeile; wer Variablen verfolgt, schreibt nach jeder Zeile ihre Werte in eine Tabelle.</div>`,
      rule: "<code>variable ← Ausdruck</code>: erst rechts ausrechnen, dann links speichern; der alte Wert ist weg",
      terms: [
        ["Variable · Bezeichner", "benannter Speicherplatz · sein Name", "z. B. punkte, preis, anzahl"],
        ["Rechenoperatoren", "+ · − · · (mal) · : (geteilt)", "Punkt vor Strich, Klammern zuerst"],
      ],
      quiz: [
        "Welchen Wert hat x nach den Anweisungen x ← 5, x ← x · 2, x ← x − 3?",
        "7",
        "5",
        "10",
        "x ist erst 5, dann 5 · 2 = 10, dann 10 − 3 = 7. Jede Zuweisung überschreibt den vorigen Wert.",
      ],
      lab: variablenLab,
      exercises: [
        verfolgen,
        cases(
          "variablen-begriffe",
          [
            cc("Was bewirkt die Anweisung leben ← leben − 1?", "Der Wert von leben wird um 1 kleiner.", ["leben wird auf −1 gesetzt.", "Es wird geprüft, ob leben gleich leben − 1 ist."], "Rechts wird mit dem alten Wert gerechnet, das Ergebnis links gespeichert.", "Rechne erst die rechte Seite aus."),
            cc("Welcher Bezeichner ist für eine Variable mit dem Punktestand am besten geeignet?", "punkte", ["x7", "variable"], "Ein sprechender Bezeichner zeigt, was gespeichert wird.", "Woran erkennt jemand anderes, was gespeichert ist?"),
            cc("Wie heißt eine Folge von Anweisungen, die nacheinander ausgeführt werden?", "Sequenz", ["Auswahl", "Wiederholung"], "Die Sequenz ist der einfachste algorithmische Grundbaustein.", "Nacheinander, ohne Bedingung."),
          ],
          [
            cc(
              "Ein Spiel zeigt immer 0 Punkte an, obwohl man trifft. Im Programm steht in jeder Runde: punkte ← 0, dann punkte ← punkte + 10. Was ist der Fehler?",
              "punkte ← 0 steht in der Runde und setzt den Wert jedes Mal zurück; es gehört vor die Runden.",
              ["Statt + muss · stehen.", "Der Bezeichner punkte ist zu lang."],
              "Die Wertzuweisung überschreibt den alten Stand; nur einmal am Anfang auf 0 setzen.",
              "Was passiert mit dem alten Wert bei punkte ← 0?",
            ),
            cc(
              "Zwei Variablen a = 3 und b = 8 sollen ihre Werte tauschen. Welche Sequenz klappt?",
              "hilf ← a, a ← b, b ← hilf",
              ["a ← b, b ← a", "b ← a, a ← b"],
              "Ohne Hilfsvariable geht ein Wert verloren: Nach a ← b ist die 3 überschrieben.",
              "Was steht in a, nachdem a ← b ausgeführt wurde?",
            ),
            cc(
              "Ein Programm soll den Durchschnitt zweier Noten berechnen: schnitt ← note1 + note2 : 2. Warum ist das Ergebnis falsch?",
              "Punkt vor Strich: Es fehlen Klammern um note1 + note2.",
              ["Durch 2 teilen ist nicht erlaubt.", "Variablen dürfen keine Ziffern enthalten."],
              "Ohne Klammern wird nur note2 halbiert; richtig ist (note1 + note2) : 2.",
              "Welche Rechnung wird zuerst ausgeführt?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, "1.2", 4, {
      id: "it8-auswahl",
      title: "Auswahl und Vergleichsoperatoren",
      subtitle: "Einseitige und zweiseitige Auswahl mit wenn, dann und sonst",
      why: "Ein Programm soll nicht immer dasselbe tun. Mit einer Auswahl reagiert es unterschiedlich auf unterschiedliche Werte.",
      html: `<p>Eine <strong>Auswahl</strong> (Verzweigung) prüft eine <strong>Bedingung</strong>, die wahr oder falsch ist. Die Bedingung vergleicht Werte mit <strong>Vergleichsoperatoren</strong>: = (gleich), ≠ (ungleich), &lt;, &gt;, ≤ (kleiner oder gleich), ≥ (größer oder gleich).</p>
<p>Bei der <strong>einseitigen Auswahl</strong> („wenn … dann …“) wird der Dann-Teil nur ausgeführt, wenn die Bedingung wahr ist; sonst passiert nichts. Die <strong>zweiseitige Auswahl</strong> („wenn … dann … sonst …“) hat für den Fall „falsch“ einen eigenen Sonst-Teil. Im <strong>Struktogramm</strong> steht die Bedingung oben im Dreieck, darunter links der Wahr-, rechts der Falsch-Zweig.</p>
<div class="example"><strong>Beispiel:</strong> „Der Lüfter läuft ab 25 °C“ heißt <code>wenn temperatur ≥ 25 dann Lüfter an</code>. Mit <code>&gt; 25</code> liefe er bei genau 25 °C nicht. Mit „sonst zeige ‚Fenster zu‘“ wird daraus eine zweiseitige Auswahl.</div>
<div class="merke"><strong>Merke:</strong> Achte am Grenzwert auf den Operator: „ab 25“ ist ≥ 25, „über 25“ ist &gt; 25. Einseitig: nur dann. Zweiseitig: dann oder sonst.</div>`,
      rule: "<code>wenn Bedingung dann A [sonst B]</code>; „ab“ → ≥, „über“ → &gt;, „unter“ → &lt;, „höchstens“ → ≤",
      terms: [
        ["Vergleichsoperatoren", "= · ≠ · &lt; · &gt; · ≤ · ≥", "Ergebnis eines Vergleichs: wahr oder falsch"],
        ["Ein- und zweiseitige Auswahl", "wenn … dann · wenn … dann … sonst", "Struktogramm: Bedingung oben, Wahr links, Falsch rechts"],
      ],
      quiz: [
        "Ein Programm soll „Bestanden“ ausgeben, wenn jemand mindestens 50 Punkte hat. Welche Bedingung ist richtig?",
        "punkte ≥ 50",
        "punkte > 50",
        "punkte < 50",
        "„Mindestens 50“ schließt die 50 ein, also ≥. Mit > würde genau 50 nicht reichen.",
      ],
      lab: auswahlLab,
      exercises: [
        auswahlAuswerten,
        cases(
          "bedingung-formulieren",
          [
            cc("Der Rasenroboter soll umkehren, wenn der Abstand unter 10 cm liegt. Welche Bedingung passt?", "abstand < 10", ["abstand > 10", "abstand = 10"], "„unter 10“ heißt kleiner als 10.", "unter → <"),
            cc("Eine Ampel soll bei einem Wartezeitwert von höchstens 30 Sekunden grün zeigen. Welcher Operator passt?", "≤", [">", "≠"], "„höchstens 30“ schließt 30 ein: kleiner oder gleich.", "höchstens → ≤"),
            cc("Welche Auswahl hat einen Sonst-Zweig?", "Die zweiseitige Auswahl", ["Die einseitige Auswahl", "Die Sequenz"], "Nur die zweiseitige Auswahl legt auch für „falsch“ eine Anweisung fest.", "zwei Seiten = zwei Zweige"),
          ],
          [
            cc(
              "Ein Shop gibt ab einem Einkaufswert von 50 € keine Versandkosten an, sonst 4,90 €. Welche Auswahl passt?",
              "wenn wert ≥ 50 dann versand ← 0 sonst versand ← 4,90",
              ["wenn wert > 50 dann versand ← 0", "wenn wert ≥ 50 dann versand ← 4,90 sonst versand ← 0"],
              "„ab 50“ schließt 50 € ein, und für den anderen Fall braucht es einen Sonst-Zweig mit 4,90 €.",
              "Zwei Fälle mit zwei Preisen: einseitig oder zweiseitig?",
            ),
            cc(
              "Ein Programm meldet bei 18 Jahren „minderjährig“. Im Programm steht wenn alter > 18 dann „volljährig“ sonst „minderjährig“. Was ist falsch?",
              "Es muss alter ≥ 18 heißen, weil man mit 18 volljährig ist.",
              ["Es muss alter < 18 heißen.", "Die Auswahl muss einseitig sein."],
              "Am Grenzwert entscheidet der Operator: > 18 schließt die 18 aus.",
              "Prüfe genau den Wert 18.",
            ),
            cc(
              "Ein Thermostat soll heizen, wenn es kälter als 20 °C ist, und sonst nichts tun. Welche Struktur ist ausreichend?",
              "Eine einseitige Auswahl: wenn temperatur < 20 dann heizen",
              ["Eine zweiseitige Auswahl mit leerem Dann-Zweig", "Eine Wiederholung mit fester Anzahl"],
              "Wenn bei „falsch“ nichts passieren soll, genügt die einseitige Auswahl.",
              "Gibt es für den Sonst-Fall eine Anweisung?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, "1.2", 5, {
      id: "it8-wiederholung",
      title: "Wiederholung mit fester Anzahl und mit Anfangsbedingung",
      subtitle: "wiederhole n-mal, wiederhole solange, Endlosschleifen erkennen",
      why: "Ein Roboter soll 20 Bahnen mähen, ein Spiel so lange laufen, bis die Leben verbraucht sind. Wiederholungen sparen Anweisungen und passen sich an.",
      html: `<p>Eine <strong>Wiederholung</strong> (Schleife) führt ihren <strong>Schleifenkörper</strong> mehrmals aus. Bei der <strong>Wiederholung mit fester Anzahl</strong> steht vorher fest, wie oft: <code>wiederhole 4-mal</code>. Bei der <strong>Wiederholung mit Anfangsbedingung</strong> wird <strong>vor jedem Durchlauf</strong> eine Bedingung geprüft: <code>wiederhole solange vorne frei</code>. Ist sie schon zu Beginn falsch, läuft der Körper kein einziges Mal.</p>
<p>Die Bedingung muss irgendwann falsch werden. Ändert der Schleifenkörper nichts, was die Bedingung beeinflusst, entsteht eine <strong>Endlosschleife</strong>: Das Programm hört nie auf.</p>
<div class="example"><strong>Beispiel:</strong> <code>wiederhole 4-mal: vor · rechts drehen</code> fährt ein kleines Quadrat und endet am Start. <code>solange vorne frei: vor</code> fährt bis zur Wand, egal wie weit sie weg ist. <code>solange vorne frei: vor · rechts drehen</code> kreist dagegen im Quadrat und erreicht nie die Wand: eine Endlosschleife.</div>
<div class="merke"><strong>Merke:</strong> Anzahl bekannt → feste Anzahl. Anzahl hängt von einer Bedingung ab → Anfangsbedingung, die vor jedem Durchlauf geprüft wird und irgendwann falsch werden muss.</div>`,
      rule: "<code>wiederhole n-mal</code> (Anzahl bekannt) · <code>wiederhole solange Bedingung</code> (Prüfung vor jedem Durchlauf)",
      terms: [
        ["Schleifenkörper", "Anweisungen, die wiederholt werden", "eingerückt bzw. im Block der Schleife"],
        ["Endlosschleife", "Bedingung wird nie falsch", "Der Körper muss etwas ändern, das die Bedingung beeinflusst."],
      ],
      quiz: [
        "Wie oft läuft „zahl ← 10; solange zahl < 5: zahl ← zahl + 1“ den Schleifenkörper durch?",
        "Kein einziges Mal",
        "Fünfmal",
        "Unendlich oft",
        "Die Anfangsbedingung 10 < 5 ist schon vor dem ersten Durchlauf falsch; der Körper wird übersprungen.",
      ],
      lab: wiederholungLab,
      exercises: [
        schleifeZaehlen,
        cases(
          "schleife-waehlen",
          [
            cc("Ein Roboter soll genau 8 Bahnen mähen. Welche Wiederholung passt?", "wiederhole 8-mal", ["wiederhole solange vorne frei", "eine einseitige Auswahl"], "Die Anzahl ist bekannt: feste Anzahl.", "Steht die Zahl vorher fest?"),
            cc("Ein Roboter soll vorwärts fahren, bis er an eine Wand kommt. Welche Wiederholung passt?", "wiederhole solange vorne frei", ["wiederhole 5-mal", "wiederhole 100-mal"], "Wie weit die Wand weg ist, weiß das Programm vorher nicht.", "Hängt die Anzahl von einer Bedingung ab?"),
            cc("Wann prüft eine Wiederholung mit Anfangsbedingung ihre Bedingung?", "Vor jedem Durchlauf", ["Nur nach dem letzten Durchlauf", "Nur einmal ganz am Anfang des Programms"], "Die Bedingung wird jedes Mal vor dem Körper geprüft.", "„Anfangsbedingung“"),
          ],
          [
            cc(
              "Ein Spiel läuft mit „solange leben > 0: spiele Runde“. In der Runde wird leben aber nie verändert. Was passiert?",
              "Eine Endlosschleife: Das Spiel endet nie.",
              ["Das Spiel endet nach einer Runde.", "Das Spiel startet gar nicht."],
              "Ohne Änderung von leben bleibt die Bedingung immer wahr.",
              "Ändert der Körper etwas an der Bedingung?",
            ),
            cc(
              "Ein Programm soll so lange würfeln, bis eine 6 kommt. Welche Wiederholung ist geeignet?",
              "wiederhole solange wurf ≠ 6: würfle",
              ["wiederhole 6-mal: würfle", "wiederhole 1-mal: würfle"],
              "Wie viele Würfe nötig sind, ist vorher nicht bekannt; die Bedingung entscheidet.",
              "Weiß man vorher, wie oft gewürfelt wird?",
            ),
            cc(
              "Statt „vor · vor · vor · vor · vor · vor“ schreibt Ben „wiederhole 6-mal: vor“. Was ist der Vorteil?",
              "Das Programm ist kürzer und die Anzahl lässt sich an einer Stelle ändern.",
              ["Der Roboter fährt schneller.", "Der Roboter kann so nicht mehr anstoßen."],
              "Wiederholungen vermeiden doppelte Anweisungen und machen Programme leichter änderbar.",
              "Wo musst du ändern, wenn es 7 Felder werden?",
            ),
          ],
        ),
      ],
    }),
  ],
};
