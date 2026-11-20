import type { LabDefinition, LabValues, Stage } from "../model/types";
import {
  type Command,
  drawFieldCells,
  type Field,
  fieldLabel,
  type FigureState,
  frontFree,
  frontObstacle,
  HEADING_NAMES,
  onStar,
  atEdge,
  runNestedLoop,
  runRepeatTimes,
  runSequence,
  runWhileCondition,
  startAt,
} from "../lab/figur";
import { structBranch, structSequence, structWhile } from "../lab/struktogramm";
import { clamp, line, open, rect, text, W } from "../lab/svg";
import { cases, cc, choiceField, lesson, numberField, withSlips } from "./helpers";
import type { Rng } from "../exercises/rng";

const STAGE_ID = "stage-2-programmieren";

// ─── Lab 7: Abläufe zerlegen, Sequenz & Struktogramm ─────────────────────────

const SEQ_FIELD: Field = {
  size: 5,
  obstacles: [
    { x: 0, y: 2 },
    { x: 1, y: 2 },
  ],
  stars: [{ x: 2, y: 2 }],
};

const SLOT_OPTIONS = [
  { value: 0, label: "– leer –" },
  { value: 1, label: "vor" },
  { value: 2, label: "links drehen" },
  { value: 3, label: "rechts drehen" },
];

const CMD_MAP: Record<number, Command> = {
  1: "vor",
  2: "links",
  3: "rechts",
};

const CMD_LABEL: Record<Command, string> = {
  vor: "vor gehen",
  links: "links drehen",
  rechts: "rechts drehen",
};

function seqProgram(v: LabValues): Command[] {
  const out: Command[] = [];
  for (let i = 0; i < 6; i++) {
    const cmd = CMD_MAP[v[`s${i}`]];
    if (cmd) out.push(cmd);
  }
  return out;
}

const sequenzLab: LabDefinition = {
  kind: "ms6-sequenz-labor",
  title: "Figuren-Sequenz & Struktogramm",
  intro:
    "Karo startet auf A5 mit Blick nach Norden. Setze bis zu sechs eindeutige Anweisungen in die richtige Reihenfolge und beobachte links das Feld und rechts das Struktogramm.",
  params: Array.from({ length: 6 }, (_, i) => ({
    key: `s${i}`,
    type: "choice" as const,
    label: `Anweisung ${i + 1}`,
    options: SLOT_OPTIONS,
    value: 0,
  })),
  actions: [
    {
      id: "clear",
      label: "Alle Slots leeren",
      apply: () => ({ s0: 0, s1: 0, s2: 0, s3: 0, s4: 0, s5: 0 }),
    },
  ],
  readouts: [
    {
      key: "pos",
      label: "Endfeld & Blickrichtung",
      emphasis: true,
      compute: (v) => {
        const s = runSequence(SEQ_FIELD, seqProgram(v), startAt(0, 4, 0));
        return `${fieldLabel(s.x, s.y)}, Blick nach ${HEADING_NAMES[s.heading]}`;
      },
    },
    {
      key: "bumps",
      label: "Zusammenstöße",
      compute: (v) => runSequence(SEQ_FIELD, seqProgram(v), startAt(0, 4, 0)).bumps,
    },
  ],
  goals: [
    {
      id: "g1",
      text: "Steuere Karo ohne Zusammenstoß auf Feld C5.",
      check: (v) => {
        const s = runSequence(SEQ_FIELD, seqProgram(v), startAt(0, 4, 0));
        return s.x === 2 && s.y === 4 && s.bumps === 0;
      },
    },
    {
      id: "g2",
      text: "Steuere Karo ohne Zusammenstoß ganz nach rechts auf Feld E5.",
      check: (v) => {
        const s = runSequence(SEQ_FIELD, seqProgram(v), startAt(0, 4, 0));
        return s.x === 4 && s.y === 4 && s.bumps === 0;
      },
    },
    {
      id: "g3",
      text: "Umfahre die Steine und erreiche ohne Zusammenstoß den Stern auf C3.",
      check: (v) => {
        const s = runSequence(SEQ_FIELD, seqProgram(v), startAt(0, 4, 0));
        return s.x === 2 && s.y === 2 && s.bumps === 0;
      },
    },
  ],
  witnesses: {
    g1: { s0: 3, s1: 1, s2: 1, s3: 0, s4: 0, s5: 0 },
    g2: { s0: 3, s1: 1, s2: 1, s3: 1, s4: 1, s5: 0 },
    g3: { s0: 3, s1: 1, s2: 1, s3: 2, s4: 1, s5: 1 },
  },
  view: {
    render(v) {
      const prog = seqProgram(v);
      const s = runSequence(SEQ_FIELD, prog, startAt(0, 4, 0));
      let out = open("Figuren-Sequenz und Struktogramm");
      out += drawFieldCells(
        SEQ_FIELD,
        s,
        [
          { x: 2, y: 4, label: "C5", reached: s.x === 2 && s.y === 4, tone: "goal" },
          { x: 4, y: 4, label: "E5", reached: s.x === 4 && s.y === 4, tone: "goal" },
          { x: 2, y: 2, label: "★", reached: s.x === 2 && s.y === 2, tone: "goal" },
        ],
        { left: 28, top: 32, maxSpan: 205, caption: "Start A5 (Norden)" },
      );
      out += text(382, 34, "Struktogramm (Sequenz)", "lab-text-small", "middle");
      const struct = structSequence(
        266,
        46,
        232,
        prog.map((c, idx) => `${idx + 1}. ${CMD_LABEL[c]}`),
      );
      out += struct.svg;
      out += text(
        382,
        46 + struct.height + 24,
        s.bumps > 0 ? `Achtung: ${s.bumps} Zusammenstoß` : "Kein Zusammenstoß",
        s.bumps > 0 ? "lab-text-bad" : "lab-text-ok",
        "middle",
      );
      return `${out}</svg>`;
    },
  },
};

function randomCmds(rng: Rng, length: number): Command[] {
  const list: Command[] = [];
  for (let i = 0; i < length; i++) {
    list.push(rng.next() < 0.62 ? "vor" : rng.pick(["links", "rechts"] as const));
  }
  if (!list.includes("vor")) list[0] = "vor";
  return list;
}

const sequenzVerfolgen = {
  id: "ms6-sequenz-verfolgen",
  make(rng: Rng, level: 1 | 2) {
    const field: Field =
      level === 1
        ? { size: 5, obstacles: [] }
        : { size: 5, obstacles: [{ x: 1, y: 2 }, { x: 2, y: 3 }] };
    const program = randomCmds(rng, level === 1 ? 4 : 6);
    const start = startAt(0, 4, 0);
    const end = runSequence(field, program, start);
    const swapped = runSequence(
      field,
      program.map((c) => (c === "links" ? "rechts" : c === "rechts" ? "links" : c)),
      start,
    );
    const fmtAns = (s: FigureState) =>
      level === 1 ? fieldLabel(s.x, s.y) : `${fieldLabel(s.x, s.y)}, Blick nach ${HEADING_NAMES[s.heading]}`;
    const answer = fmtAns(end);
    const pool = [
      fmtAns(swapped),
      ...[1, 2, 3].map((d) => fmtAns({ ...end, heading: ((end.heading + d) % 4) as FigureState["heading"] })),
      ...[
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]
        .map(([dx, dy]) => ({ ...end, x: end.x + dx, y: end.y + dy }))
        .filter((p) => p.x >= 0 && p.y >= 0 && p.x < 5 && p.y < 5)
        .map(fmtAns),
    ];
    const distractors = [...new Set(pool)].filter((o) => o !== answer).slice(0, 2);
    return {
      prompt:
        level === 1
          ? "Karo startet auf A5 und schaut nach Norden. Auf welchem Feld steht die Figur am Ende der Sequenz?"
          : "Verfolge das Struktogramm Schritt für Schritt auf dem 5×5-Feld (Steine auf B3 und C4 halten Karo auf). Wo steht Karo am Ende und wohin schaut die Figur?",
      given: [
        `Sequenz: ${program.join(" · ")}`,
        ...(level === 2 ? ["Steine: B3 und C4 (blockieren „vor“)", "Spalten A–E von links, Zeilen 1–5 von oben"] : ["Spalten A–E von links, Zeilen 1–5 von oben"]),
      ],
      formulaHint: "„links“ und „rechts“ drehen nur auf dem Feld, erst „vor“ bewegt um ein Feld weiter.",
      fields: [choiceField(rng, level === 1 ? "Endfeld" : "Endfeld und Blickrichtung", answer, distractors)],
      steps: [
        "Start bei A5 (Norden), jeden Schritt einzeln eintragen.",
        program
          .map((_, idx) => {
            const st = runSequence(field, program.slice(0, idx + 1), start);
            return `${idx + 1}. ${program[idx]} → ${fieldLabel(st.x, st.y)} (${HEADING_NAMES[st.heading]})`;
          })
          .join("; "),
        `<strong>${answer}</strong>`,
      ],
    };
  },
};

// ─── Lab 8: Bedingungen formulieren und prüfen ────────────────────────────────

const COND_FIELD: Field = {
  size: 5,
  obstacles: [
    { x: 1, y: 2 },
    { x: 2, y: 1 },
    { x: 3, y: 3 },
  ],
  stars: [{ x: 2, y: 2 }],
};

const COND_NAMES = [
  "vorne frei",
  "vorne Hindernis",
  "auf Stern",
  "nicht am Rand",
] as const;

function evalCondLab(v: LabValues): boolean {
  const s = startAt(v.x, v.y, v.blick as FigureState["heading"]);
  if (v.bedingung === 0) return frontFree(COND_FIELD, s);
  if (v.bedingung === 1) return frontObstacle(COND_FIELD, s);
  if (v.bedingung === 2) return onStar(COND_FIELD, s);
  return !atEdge(COND_FIELD, s);
}

function onStone(v: LabValues): boolean {
  return COND_FIELD.obstacles.some((o) => o.x === v.x && o.y === v.y);
}

const bedingungLab: LabDefinition = {
  kind: "ms6-bedingung-labor",
  title: "Bedingungs-Scanner auf dem Spielfeld",
  intro:
    "Ziehe Karo über das 5×5-Feld (oder nutze die Regler), wähle die Blickrichtung und prüfe, wann eine Bedingung wahr oder falsch ist.",
  params: [
    { key: "x", type: "range", label: "Spalte (0=A … 4=E)", unit: "", min: 0, max: 4, step: 1, value: 0 },
    { key: "y", type: "range", label: "Zeile (0=1 … 4=5)", unit: "", min: 0, max: 4, step: 1, value: 4 },
    {
      key: "blick",
      type: "choice",
      label: "Blickrichtung",
      options: HEADING_NAMES.map((name, value) => ({ value, label: name })),
      value: 0,
    },
    {
      key: "bedingung",
      type: "choice",
      label: "Zu prüfende Bedingung",
      options: COND_NAMES.map((label, value) => ({ value, label })),
      value: 1,
    },
  ],
  readouts: [
    { key: "pos", label: "Position", compute: (v) => `${fieldLabel(v.x, v.y)}, Blick ${HEADING_NAMES[v.blick]}` },
    {
      key: "ergebnis",
      label: "Wahrheitswert",
      emphasis: true,
      compute: (v) =>
        onStone(v) ? "Ungültig (Feld ist Stein)" : evalCondLab(v) ? "WAHR" : "FALSCH",
    },
  ],
  goals: [
    {
      id: "g1",
      text: "Stelle Karo auf ein freies Feld direkt vor einen Stein oder den Rand, sodass ‚vorne Hindernis‘ wahr ist.",
      check: (v) => !onStone(v) && v.bedingung === 1 && evalCondLab(v),
    },
    {
      id: "g2",
      text: "Setze Karo auf den Stern C3 und prüfe ‚auf Stern‘ (WAHR).",
      check: (v) => !onStone(v) && v.bedingung === 2 && evalCondLab(v),
    },
    {
      id: "g3",
      text: "Bewege Karo ins Innenfeld (ohne Stein) und mache ‚nicht am Rand‘ wahr.",
      check: (v) => !onStone(v) && v.bedingung === 3 && evalCondLab(v),
    },
  ],
  witnesses: {
    g1: { x: 1, y: 3, blick: 0, bedingung: 1 },
    g2: { x: 2, y: 2, blick: 0, bedingung: 2 },
    g3: { x: 1, y: 1, blick: 0, bedingung: 3 },
  },
  view: {
    handles: {
      figurHandle: {
        x: "x",
        y: "y",
        drag(point): Partial<LabValues> {
          const nx = clamp(Math.floor((point.x - 28) / 42), 0, 4);
          const ny = clamp(Math.floor((point.y - 34) / 42), 0, 4);
          return { x: nx, y: ny };
        },
      },
    },
    render(v) {
      const st = startAt(v.x, v.y, v.blick as FigureState["heading"]);
      const dx = [0, 1, 0, -1][v.blick];
      const dy = [-1, 0, 1, 0][v.blick];
      const ahead = { x: v.x + dx, y: v.y + dy };
      const stoneHere = onStone(v);
      const result = !stoneHere && evalCondLab(v);
      const cell = 42;
      const left = 28;
      const top = 34;
      const hx = left + v.x * cell + 20;
      const hy = top + v.y * cell + 20;

      let out = open("Bedingungs-Scanner");
      out += drawFieldCells(
        COND_FIELD,
        st,
        v.bedingung <= 1
          ? [{ x: ahead.x, y: ahead.y, label: "Blick", tone: "probe" }]
          : [],
        { left, top, maxSpan: 210, caption: "Ziehe die Figur oder prüfe unten" },
      );
      out += `<g class="lab-handle lab-handle-a" data-handle="figurHandle" tabindex="0" role="button" aria-label="Figur verschieben">`;
      out += `<circle cx="${hx}" cy="${hy}" r="18" class="lab-handle-hit" />`;
      out += `<circle cx="${hx}" cy="${hy}" r="6" class="lab-handle-dot" />`;
      out += "</g>";

      out += rect(266, 36, 232, 206, stoneHere ? "lab-bad" : result ? "lab-fill-ok" : "lab-panel", 'rx="12"');
      out += text(382, 68, "Geprüfte Bedingung:", "lab-text-small", "middle");
      out += text(382, 98, COND_NAMES[v.bedingung], "lab-text-big", "middle");
      out += rect(292, 122, 180, 52, stoneHere ? "lab-bad" : result ? "lab-fill-ok" : "lab-fill-b", 'rx="10"');
      out += text(
        382,
        155,
        stoneHere ? "AUF STEIN!" : result ? "WAHR" : "FALSCH",
        stoneHere || !result ? "lab-text-bad" : "lab-text-ok",
        "middle",
      );
      out += text(382, 212, `Feld ${fieldLabel(v.x, v.y)} · ${HEADING_NAMES[v.blick]}`, "lab-text-small", "middle");
      return `${out}</svg>`;
    },
  },
};

const bedingungAuswerten = {
  id: "ms6-bedingung-auswerten",
  make(rng: Rng, level: 1 | 2) {
    if (level === 1) {
      const punkte = rng.pick([8, 12, 15, 20]);
      const answer = `punkte > ${punkte - 2}`;
      const wrong1 = `punkte < ${punkte}`;
      const wrong2 = `punkte = ${punkte + 3}`;
      return {
        prompt: `Ein Spielstand zeigt genau ${punkte} Punkte. Welche der drei Bedingungen ist in diesem Moment WAHR?`,
        given: [`Aktueller Stand: punkte = ${punkte}`],
        formulaHint: "Setze die gegebene Zahl links ein und prüfe, ob der Vergleich stimmt.",
        fields: [choiceField(rng, "Wahre Bedingung", answer, [wrong1, wrong2])],
        steps: [
          `Setze ${punkte} ein: ${punkte} > ${punkte - 2} stimmt.`,
          `${punkte} < ${punkte} und ${punkte} = ${punkte + 3} sind falsch.`,
          `<strong>${answer}</strong>`,
        ],
      };
    }
    const val = rng.pick([10, 14, 18]);
    const useInclusive = rng.next() < 0.5;
    if (useInclusive) {
      const answer = `nicht (wert < ${val}) und wert ≥ ${val}`;
      const wrong1 = `wert > ${val}`;
      const wrong2 = `nicht (wert ≥ ${val})`;
      return {
        prompt: `Der gemessene Abstand beträgt genau ${val} cm. Welche zusammengesetzte oder verneinte Bedingung ergibt jetzt WAHR?`,
        given: [`Abstand: wert = ${val} cm`, "Beachte den Unterschied zwischen ‚>‘ und ‚≥‘ sowie ‚nicht‘."],
        fields: [choiceField(rng, "Wahre Bedingung", answer, [wrong1, wrong2])],
        steps: [
          `${val} > ${val} ist falsch, aber ${val} ≥ ${val} ist wahr.`,
          `‚nicht (${val} < ${val})‘ kehrt falsch zu wahr um.`,
          `<strong>${answer}</strong>`,
        ],
      };
    }
    const answer = `nicht (alter < ${val})`;
    const wrong1 = `alter > ${val}`;
    const wrong2 = `alter < ${val}`;
    return {
      prompt: `Ein Ticket gilt ab genau ${val} Jahren. Die Prüfung lautet für einen Wert von genau ${val} Jahren. Welche Bedingung ist WAHR?`,
      given: [`Alter = ${val} Jahre`],
      fields: [choiceField(rng, "Wahre Bedingung", answer, [wrong1, wrong2])],
      steps: [
        `${val} < ${val} ist falsch; die Verneinung ‚nicht (falsch)‘ ist wahr.`,
        `Streng größer (${val} > ${val}) wäre bei Gleichheit falsch.`,
        `<strong>${answer}</strong>`,
      ],
    };
  },
};

// ─── Lab 9: Alternative (wenn–dann / wenn–dann–sonst) ────────────────────────

const ALT_DANN = ["vor gehen", "rechts drehen", "links drehen"] as const;
const ALT_SONST = ["links drehen", "vor gehen", "rechts drehen"] as const;

function altActionText(v: LabValues): string {
  if (v.sensor === 1) return ALT_DANN[v.dannAktion];
  if (v.art === 1) return ALT_SONST[v.sonstAktion];
  return "keine Anweisung (leer)";
}

const alternativeLab: LabDefinition = {
  kind: "ms6-alternative-labor",
  title: "Struktogramm der Alternative",
  intro:
    "Prüfe das Struktogramm ‚wenn vorne Hindernis‘ bei freiem Weg und vor einem Stein. Stelle einseitige oder zweiseitige Alternative ein.",
  params: [
    {
      key: "sensor",
      type: "choice",
      label: "Situation vor Karo",
      options: [
        { value: 0, label: "vorne frei (Bedingung falsch)" },
        { value: 1, label: "Stein vor Karo (Bedingung wahr)" },
      ],
      value: 0,
    },
    {
      key: "art",
      type: "choice",
      label: "Art der Alternative",
      options: [
        { value: 0, label: "einseitig (nur wenn–dann)" },
        { value: 1, label: "zweiseitig (wenn–dann–sonst)" },
      ],
      value: 0,
    },
    {
      key: "dannAktion",
      type: "choice",
      label: "dann-Zweig (wenn Hindernis)",
      options: ALT_DANN.map((label, value) => ({ value, label })),
      value: 0,
    },
    {
      key: "sonstAktion",
      type: "choice",
      label: "sonst-Zweig (wenn frei)",
      options: ALT_SONST.map((label, value) => ({ value, label })),
      value: 0,
      showIf: (v) => v.art === 1,
    },
  ],
  readouts: [
    {
      key: "cond",
      label: "Bedingung ‚vorne Hindernis‘",
      compute: (v) => (v.sensor === 1 ? "wahr → dann-Zweig" : "falsch → sonst-Zweig / weiter"),
    },
    {
      key: "out",
      label: "Ausgeführte Aktion",
      emphasis: true,
      compute: (v) => altActionText(v),
    },
  ],
  goals: [
    {
      id: "g1",
      text: "Löse eine einseitige Alternative im ‚dann‘-Zweig vor einem Stein aus, sodass Karo abdreht (links oder rechts).",
      check: (v) => v.art === 0 && v.sensor === 1 && v.dannAktion >= 1,
    },
    {
      id: "g2",
      text: "Baue eine sichere zweiseitige Alternative (bei Hindernis abdrehen, sonst vor gehen) und teste sie bei freiem Weg.",
      check: (v) => v.art === 1 && v.sensor === 0 && v.dannAktion >= 1 && v.sonstAktion === 1,
    },
    {
      id: "g3",
      text: "Teste dieselbe sichere zweiseitige Alternative direkt vor dem Stein.",
      check: (v) => v.art === 1 && v.sensor === 1 && v.dannAktion >= 1 && v.sonstAktion === 1,
    },
  ],
  witnesses: {
    g1: { sensor: 1, art: 0, dannAktion: 1, sonstAktion: 0 },
    g2: { sensor: 0, art: 1, dannAktion: 1, sonstAktion: 1 },
    g3: { sensor: 1, art: 1, dannAktion: 1, sonstAktion: 1 },
  },
  view: {
    render(v) {
      const field: Field = {
        size: 3,
        obstacles: v.sensor === 1 ? [{ x: 1, y: 1 }] : [],
      };
      const start = startAt(1, 2, 0);
      let cmd: Command | null = null;
      if (v.sensor === 1) cmd = (["vor", "rechts", "links"] as Command[])[v.dannAktion];
      else if (v.art === 1) cmd = (["links", "vor", "rechts"] as Command[])[v.sonstAktion];
      const end = cmd ? runSequence(field, [cmd], start) : start;

      let out = open("Struktogramm einer Alternative");
      out += drawFieldCells(field, end, [], {
        left: 36,
        top: 64,
        maxSpan: 170,
        caption: end.bumps > 0 ? "Zusammenstoß!" : `Ergebnis: ${altActionText(v)}`,
      });
      const struct = structBranch(
        244,
        64,
        252,
        "vorne Hindernis?",
        ALT_DANN[v.dannAktion],
        ALT_SONST[v.sonstAktion],
        v.sensor === 1 ? "then" : "else",
        v.art === 1,
        52,
        66,
      );
      out += struct.svg;
      out += text(370, 44, "Nassi-Shneiderman-Struktogramm", "lab-text-small", "middle");
      return `${out}</svg>`;
    },
  },
};

const altAuswerten = {
  id: "ms6-alt-auswerten",
  make(rng: Rng, level: 1 | 2) {
    if (level === 1) {
      const punkte = rng.int(12, 32);
      const grenze = rng.int(14, 30);
      const bonus = rng.int(2, 6);
      const hit = punkte > grenze;
      const result = hit ? punkte + bonus : punkte;
      return {
        prompt: "Ein Spiel prüft eine einseitige Alternative. Wie viele Punkte stehen am Ende auf der Anzeige?",
        given: [
          `Startwert: ${punkte} Punkte`,
          `Regel: wenn Punkte > ${grenze} dann +${bonus} Bonuspunkte`,
        ],
        formulaHint: "Prüfe zuerst, ob die Bedingung wahr ist. Bei ‚falsch‘ bleibt die Punktzahl unverändert.",
        fields: [
          withSlips(
            numberField("Punkte =", result),
            [hit ? punkte : punkte + bonus, `Prüfe genau: Ist ${punkte} > ${grenze} wahr oder falsch?`],
          ),
        ],
        steps: [
          `${punkte} > ${grenze} ist ${hit ? "wahr" : "falsch"}.`,
          hit ? `${punkte} + ${bonus} = ${result}` : "Bedingung falsch → nichts addieren.",
          `<strong>${result} Punkte</strong>`,
        ],
      };
    }
    const dist = rng.pick([10, 12, 15, 20]);
    const limit = rng.pick([10, 15]);
    const inclusive = rng.next() < 0.5;
    const cond = inclusive ? dist >= limit : dist > limit;
    const speed = cond ? 60 : 25;
    return {
      prompt: `Ein autonomer Rollwagen nutzt eine zweiseitige Alternative für die Geschwindigkeit. Welche Geschwindigkeit stellt er bei einem Abstand von ${dist} cm ein?`,
      given: [
        `Gemessener Abstand: ${dist} cm`,
        `Regel: wenn Abstand ${inclusive ? "≥" : ">"} ${limit} cm dann Tempo 60 sonst Tempo 25`,
      ],
      fields: [
        withSlips(
          numberField("Tempo =", speed),
          [cond ? 25 : 60, `Achte auf den Vergleich: ${inclusive ? "≥ schließt den Grenzwert ein" : "> verlangt echt größer"}.`],
        ),
      ],
      steps: [
        `Prüfe ${dist} ${inclusive ? "≥" : ">"} ${limit}: ${cond ? "wahr" : "falsch"}.`,
        cond ? "Der dann-Zweig gilt → Tempo 60." : "Der sonst-Zweig gilt → Tempo 25.",
        `<strong>Tempo ${speed}</strong>`,
      ],
    };
  },
};

// ─── Lab 10: Bedingte Wiederholung (solange …) ───────────────────────────────

function schleifenErgebnis(v: LabValues) {
  const field: Field = {
    size: 6,
    obstacles: [{ x: 0, y: v.hindernisZeile - 1 }],
  };
  const body: Command[] =
    v.koerper === 0 ? ["rechts"] : v.koerper === 1 ? ["vor"] : ["links", "rechts"];
  const start = startAt(0, 5, 0);
  const exec =
    v.schleifenArt === 0
      ? runRepeatTimes(field, body, 3, start)
      : runWhileCondition(field, frontFree, body, start, 25);
  return { field, body, exec };
}

const schleifeLab: LabDefinition = {
  kind: "ms6-schleife-labor",
  title: "Bedingte Wiederholung mit Hindernis",
  intro:
    "Karo startet auf A6 (Norden). Ziehe den Stein in Spalte A auf und ab und vergleiche eine feste Wiederholung mit ‚solange vorne frei‘.",
  params: [
    { key: "hindernisZeile", type: "range", label: "Stein auf Zeile A", unit: "", min: 1, max: 5, step: 1, value: 5 },
    {
      key: "schleifenArt",
      type: "choice",
      label: "Wiederholungsart",
      options: [
        { value: 0, label: "wiederhole 3-mal (feste Anzahl)" },
        { value: 1, label: "solange vorne frei (bedingte Wiederholung)" },
      ],
      value: 0,
    },
    {
      key: "koerper",
      type: "choice",
      label: "Anweisungen in der Schleife",
      options: [
        { value: 0, label: "rechts drehen" },
        { value: 1, label: "vor" },
        { value: 2, label: "links drehen · rechts drehen" },
      ],
      value: 0,
    },
  ],
  readouts: [
    {
      key: "rounds",
      label: "Durchläufe",
      compute: (v) => {
        const { exec } = schleifenErgebnis(v);
        return exec.endless ? "Endlosschleife (gestoppt)" : `${exec.rounds}`;
      },
    },
    {
      key: "pos",
      label: "Endzustand",
      emphasis: true,
      compute: (v) => {
        const { exec } = schleifenErgebnis(v);
        if (exec.endless) return "Bedingung ‚vorne frei‘ wird nie falsch!";
        return `${fieldLabel(exec.state.x, exec.state.y)} · ${exec.state.bumps} Zusammenstöße`;
      },
    },
  ],
  goals: [
    {
      id: "g1",
      text: "Setze den Stein auf A2 und fahre mit ‚solange vorne frei: vor‘ ohne Zusammenstoß genau bis A3.",
      check: (v) => v.hindernisZeile === 2 && v.schleifenArt === 1 && v.koerper === 1,
    },
    {
      id: "g2",
      text: "Prüfe den Randfall: Stein auf A5 direkt vor Karo mit ‚solange vorne frei: vor‘ (0 Durchläufe).",
      check: (v) => v.hindernisZeile === 5 && v.schleifenArt === 1 && v.koerper === 1,
    },
    {
      id: "g3",
      text: "Erzeuge gezielt eine Endlosschleife (‚solange vorne frei‘ bleibt dauerhaft wahr).",
      check: (v) => schleifenErgebnis(v).exec.endless,
    },
  ],
  witnesses: {
    g1: { hindernisZeile: 2, schleifenArt: 1, koerper: 1 },
    g2: { hindernisZeile: 5, schleifenArt: 1, koerper: 1 },
    g3: { hindernisZeile: 2, schleifenArt: 1, koerper: 2 },
  },
  view: {
    handles: {
      steinHandle: {
        y: "hindernisZeile",
        drag(point): Partial<LabValues> {
          const row = Math.round((point.y - 43) / 36) + 1;
          return { hindernisZeile: clamp(row, 1, 5) };
        },
      },
    },
    render(v) {
      const { field, body, exec } = schleifenErgebnis(v);
      const cell = 36;
      const left = 26;
      const top = 26;
      const sy = top + (v.hindernisZeile - 1) * cell + 17;
      const sx = left + 17;

      let out = open("Bedingte Wiederholung");
      out += drawFieldCells(field, exec.state, [], {
        left,
        top,
        maxSpan: 216,
        caption: "Ziehe den Stein in Spalte A",
      });
      out += `<g class="lab-handle lab-handle-b" data-handle="steinHandle" tabindex="0" role="slider" aria-label="Stein auf Zeile A" aria-valuemin="1" aria-valuemax="5" aria-valuenow="${v.hindernisZeile}">`;
      out += `<circle cx="${sx}" cy="${sy}" r="16" class="lab-handle-hit" />`;
      out += `<circle cx="${sx}" cy="${sy}" r="6.5" class="lab-handle-dot" />`;
      out += "</g>";

      const condLabel = v.schleifenArt === 0 ? "wiederhole 3-mal" : "solange vorne frei";
      const bodyLabel = body.map((c) => CMD_LABEL[c]).join(" · ");
      const st = structWhile(
        268,
        54,
        230,
        condLabel,
        56,
        (bx, by, bw) => structSequence(bx, by, bw, [bodyLabel], -1, 56).svg,
        exec.rounds > 0,
        exec.endless,
      );
      out += text(383, 38, "Kopfgesteuerte Schleife", "lab-text-small", "middle");
      out += st.svg;
      out += text(
        383,
        54 + st.height + 28,
        exec.endless
          ? "Endlosschleife!"
          : `${exec.rounds} Durchläufe · ${exec.state.bumps} Stöße`,
        exec.endless || exec.state.bumps > 0 ? "lab-text-bad" : "lab-text-ok",
        "middle",
      );
      return `${out}</svg>`;
    },
  },
};

const schleifeDurchlaeufe = {
  id: "ms6-schleife-durchlaeufe",
  make(rng: Rng, level: 1 | 2) {
    if (level === 1) {
      const freeCells = rng.pick([0, 2, 3, 4, 5]);
      return {
        prompt: `Vor Karo sind genau ${freeCells} freie Felder bis zu einem Stein. Die Figur führt aus: ‚solange vorne frei: vor‘. Wie oft wird ‚vor‘ ausgeführt?`,
        given: [
          `Freie Felder direkt vor der Figur: ${freeCells}`,
          "Die Bedingung ‚vorne frei‘ wird vor jedem Schritt geprüft.",
        ],
        formulaHint: "Ist das Feld direkt vor der Figur sofort blockiert (0 frei), läuft der Schleifenkörper 0-mal.",
        fields: [
          withSlips(
            numberField("Durchläufe =", freeCells),
            [freeCells + 1, "Sobald der Stein vor Karo steht, wird die Bedingung falsch – Karo fährt nicht in den Stein."],
            [Math.max(0, freeCells - 1), "Zähle alle freien Felder bis unmittelbar vor das Hindernis."],
          ),
        ],
        steps: [
          freeCells === 0
            ? "Vor der Figur ist sofort ein Stein: 0 Durchläufe."
            : `Karo geht ${freeCells}-mal vor, dann blockiert der Stein ‚vorne frei‘.`,
          `Die Schleife prüft vor dem nächsten Schritt und bricht ab.`,
          `<strong>${freeCells} Durchläufe</strong>`,
        ],
      };
    }
    const start = rng.pick([18, 22, 27, 30]);
    const step = rng.pick([4, 5, 6]);
    const limit = rng.pick([5, 6]);
    let rest = start;
    let rounds = 0;
    while (rest >= limit) {
      rest -= step;
      rounds += 1;
    }
    const askRest = rng.next() < 0.5;
    return {
      prompt: askRest
        ? `Ein Automat prüft eine bedingte Wiederholung. Wie viele Euro bleiben am Ende auf dem Guthaben übrig?`
        : `Ein Automat prüft eine bedingte Wiederholung. Wie viele Fahrkarten (Durchläufe) werden gebucht?`,
      given: [
        `Startguthaben: ${start} €`,
        `Schleife: solange Guthaben ≥ ${limit} € → ziehe ${step} € ab`,
      ],
      fields: [
        askRest
          ? withSlips(
              numberField("Restguthaben =", rest, "€"),
              [rest + step, `Bei ${rest + step} € war die Bedingung ≥ ${limit} € noch wahr, es wird noch einmal abgezogen.`],
            )
          : withSlips(
              numberField("Durchläufe =", rounds),
              [rounds - 1, `Auch beim Gleichstand oder Rest ≥ ${limit} € läuft die Schleife weiter.`],
              [rounds + 1, `Prüfe ab wann Guthaben < ${limit} € ist: danach bricht die Schleife ab.`],
            ),
      ],
      steps: [
        `Start ${start} €; pro Durchlauf −${step} €, solange Rest ≥ ${limit} €.`,
        `Nach ${rounds} Durchläufen bleibt ${rest} € (< ${limit} €) → Ende.`,
        `<strong>${askRest ? `${rest} €` : `${rounds} Durchläufe`}</strong>`,
      ],
    };
  },
};

// ─── Lab 11: Grundstrukturen schachteln ──────────────────────────────────────

const PARCOURS_0: Field = {
  size: 5,
  obstacles: [
    { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 },
    { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
    { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 },
    { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 },
  ],
  stars: [{ x: 4, y: 0 }],
};

const PARCOURS_1: Field = {
  size: 5,
  obstacles: [
    { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
    { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 },
    { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 },
    { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 },
  ],
  stars: [{ x: 4, y: 4 }],
};

function runSchachtel(v: LabValues) {
  const field = v.parcours === 0 ? PARCOURS_0 : PARCOURS_1;
  const start = startAt(0, 4, 0);
  const thenCmds: Command[] = v.wennFrei === 1 ? ["vor"] : [];
  const elseCmds: Command[] = v.sonst === 1 ? ["links"] : v.sonst === 2 ? ["rechts"] : [];
  const exec =
    v.aussen === 0
      ? (() => {
          let st = start;
          for (let i = 0; i < 4; i++) {
            const br = frontFree(field, st) ? thenCmds : elseCmds;
            st = runSequence(field, br, st);
          }
          return { state: st, rounds: 4, endless: false };
        })()
      : runNestedLoop(
          field,
          (f, s) => !onStar(f, s),
          frontFree,
          thenCmds,
          elseCmds,
          start,
          30,
        );
  return { field, exec };
}

const schachtelLab: LabDefinition = {
  kind: "ms6-schachtel-labor",
  title: "Geschachtelte Strukturen im Parcours",
  intro:
    "Setze eine Alternative IN eine Schleife ein, sodass Karo automatisch um jede Kurve bis zum Stern navigiert.",
  params: [
    {
      key: "parcours",
      type: "choice",
      label: "Parcours",
      options: [
        { value: 0, label: "Parcours 1: L-Kurve bis E1" },
        { value: 1, label: "Parcours 2: U-Gang bis E5" },
      ],
      value: 0,
    },
    {
      key: "aussen",
      type: "choice",
      label: "Äußere Wiederholung",
      options: [
        { value: 0, label: "wiederhole 4-mal" },
        { value: 1, label: "solange nicht auf Stern" },
      ],
      value: 0,
    },
    {
      key: "wennFrei",
      type: "choice",
      label: "wenn vorne frei dann …",
      options: [
        { value: 0, label: "nichts tun" },
        { value: 1, label: "vor gehen" },
      ],
      value: 0,
    },
    {
      key: "sonst",
      type: "choice",
      label: "sonst (vorne Hindernis) …",
      options: [
        { value: 0, label: "nichts tun" },
        { value: 1, label: "links drehen" },
        { value: 2, label: "rechts drehen" },
      ],
      value: 0,
    },
  ],
  readouts: [
    {
      key: "ziel",
      label: "Lauf-Ergebnis",
      emphasis: true,
      compute: (v) => {
        const { field, exec } = runSchachtel(v);
        if (exec.endless) return "Endlosschleife (Karo steckt fest)";
        return onStar(field, exec.state)
          ? `Stern erreicht auf ${fieldLabel(exec.state.x, exec.state.y)}!`
          : `Steht auf ${fieldLabel(exec.state.x, exec.state.y)} (Stern verfehlt)`;
      },
    },
    {
      key: "runden",
      label: "Durchläufe",
      compute: (v) => {
        const { exec } = runSchachtel(v);
        return exec.endless ? "Endlos (abgebrochen)" : exec.rounds;
      },
    },
  ],
  goals: [
    {
      id: "g1",
      text: "Löse Parcours 1 (Stern auf E1) mit geschachtelter Schleife und Alternative.",
      check: (v) => {
        const { field, exec } = runSchachtel(v);
        return v.parcours === 0 && !exec.endless && onStar(field, exec.state);
      },
    },
    {
      id: "g2",
      text: "Löse auch den längeren U-Gang (Parcours 2, Stern auf E5) mit demselben geschachtelten Prinzip.",
      check: (v) => {
        const { field, exec } = runSchachtel(v);
        return v.parcours === 1 && !exec.endless && onStar(field, exec.state);
      },
    },
    {
      id: "g3",
      text: "Erzeuge eine Endlosschleife, indem bei ‚solange nicht auf Stern‘ im ‚sonst‘-Zweig ‚nichts tun‘ steht.",
      check: (v) => v.aussen === 1 && v.sonst === 0 && runSchachtel(v).exec.endless,
    },
  ],
  witnesses: {
    g1: { parcours: 0, aussen: 1, wennFrei: 1, sonst: 2 },
    g2: { parcours: 1, aussen: 1, wennFrei: 1, sonst: 2 },
    g3: { parcours: 0, aussen: 1, wennFrei: 1, sonst: 0 },
  },
  view: {
    render(v) {
      const { field, exec } = runSchachtel(v);
      const starReached = onStar(field, exec.state);
      let out = open("Geschachtelte Strukturen im Parcours");
      out += drawFieldCells(field, exec.state, [], {
        left: 26,
        top: 34,
        maxSpan: 205,
        caption: v.parcours === 0 ? "Parcours 1 (Ziel E1)" : "Parcours 2 (Ziel E5)",
      });
      const outer = v.aussen === 0 ? "wiederhole 4-mal" : "solange nicht auf Stern";
      const thenTxt = v.wennFrei === 1 ? "vor gehen" : "(nichts)";
      const elseTxt = v.sonst === 1 ? "links" : v.sonst === 2 ? "rechts" : "(nichts)";
      const nested = structWhile(
        262,
        54,
        236,
        outer,
        92,
        (bx, by, bw) =>
          structBranch(bx, by, bw, "vorne frei?", thenTxt, elseTxt, "none", true, 44, 48).svg,
        !starReached && exec.rounds > 0,
        exec.endless,
      );
      out += text(380, 38, "Geschachteltes Struktogramm", "lab-text-small", "middle");
      out += nested.svg;
      out += text(
        380,
        54 + nested.height + 28,
        exec.endless
          ? "Endlosschleife!"
          : starReached
            ? `✓ Ziel in ${exec.rounds} Runden erreicht`
            : `Nach ${exec.rounds} Runden bei ${fieldLabel(exec.state.x, exec.state.y)}`,
        exec.endless ? "lab-text-bad" : starReached ? "lab-text-ok" : "lab-text-muted",
        "middle",
      );
      return `${out}</svg>`;
    },
  },
};

const schachtelVerfolgen = {
  id: "ms6-schachtel-verfolgen",
  make(rng: Rng, level: 1 | 2) {
    if (level === 1) {
      const n = rng.pick([3, 4, 5]);
      const up = Math.min(2, n);
      const turns = n > 2 ? 1 : 0;
      const right = Math.max(0, n - 3);
      const endField = fieldLabel(right, 4 - up);
      const answer = `${endField} (${turns} Drehung)`;
      const wrong1 = `${fieldLabel(0, Math.max(0, 4 - n))} (0 Drehungen)`;
      const wrong2 = `${fieldLabel(right + 1, 4 - up)} (1 Drehung)`;
      return {
        prompt: `Karo startet auf A5 (Norden). Auf A2 liegt ein Stein (A5 und A4 sind frei, A3 ist frei, A2 blockiert; B3 und C3 sind frei). Führe die geschachtelte Struktur ‚wiederhole ${n}-mal‘ aus.`,
        given: [
          `Äußere Schleife: wiederhole ${n}-mal`,
          "Innen: wenn vorne frei dann vor gehen sonst rechts drehen",
          "Hinweis: Eine Drehung verbraucht bereits einen Schleifendurchlauf.",
        ],
        formulaHint: "Zähle genau ab: 2-mal ‚vor‘ bis A3, der 3. Durchlauf trifft auf A2-Stein und dreht rechts.",
        fields: [choiceField(rng, "Endfeld und Drehungen", answer, [wrong1, wrong2])],
        steps: [
          "1. Durchlauf: A5 → A4 (vor); 2. Durchlauf: A4 → A3 (vor).",
          n >= 3 ? "3. Durchlauf: A2 blockiert → rechts drehen (Osten); danach weiter nach B3, C3." : "Noch innerhalb der freien Nord-Strecke.",
          `<strong>${answer}</strong>`,
        ],
      };
    }
    const gangA = rng.pick([2, 3]);
    const gangB = rng.pick([2, 3]);
    const total = gangA + 1 + gangB;
    return {
      prompt: `Ein L-Korridor hat zuerst ${gangA} freie Felder nach Norden, danach eine Rechtskurve und anschließend ${gangB} freie Felder bis zum Stern. Wie viele Schleifendurchläufe braucht ‚solange nicht auf Stern: wenn vorne frei dann vor sonst rechts drehen‘ bis auf den Stern?`,
      given: [
        `Gerade 1: ${gangA} Schritte vor`,
        "Kurve: 1 Durchlauf für ‚rechts drehen‘",
        `Gerade 2: ${gangB} Schritte vor bis zum Stern`,
      ],
      fields: [
        withSlips(
          numberField("Durchläufe =", total),
          [gangA + gangB, "Vergiss den einzelnen Durchlauf für das Rechtsdrehen an der Ecke nicht!"],
          [total + 1, "Auf dem Stern bricht ‚solange nicht auf Stern‘ vor dem nächsten Durchlauf ab."],
        ),
      ],
      steps: [
        `Erste Gerade: ${gangA} Durchläufe (vor gehen).`,
        "Ecke: 1 Durchlauf (vorne blockiert → rechts drehen).",
        `Zweite Gerade: ${gangB} Durchläufe → <strong>${total} Durchläufe insgesamt</strong>.`,
      ],
    };
  },
};

// ─── Lab 12: Testen und Optimieren in Entwicklungsumgebungen ─────────────────

interface DebugSummary {
  field: Field;
  state: FigureState;
  blocks: number;
  endless: boolean;
  okCurrent: boolean;
  okLen0: boolean;
  okLen3: boolean;
  okLen5: boolean;
}

const PROG_NAMES = [
  "Starre Sequenz (vor · vor · vor)",
  "Umständlich (vor · links · rechts · vor · vor)",
  "Fehler: solange vorne Hindernis: vor",
  "Optimiert: solange vorne frei: vor",
] as const;

function runDebugOnLen(prog: number, gangLaenge: number) {
  const field: Field = {
    size: 6,
    obstacles: gangLaenge < 5 ? [{ x: gangLaenge + 1, y: 0 }] : [],
    stars: [{ x: gangLaenge, y: 0 }],
  };
  const start = startAt(0, 0, 1); // A1 Blick Osten
  if (prog === 0) {
    const state = runSequence(field, ["vor", "vor", "vor"], start);
    return { field, state, blocks: 3, endless: false, ok: state.bumps === 0 && onStar(field, state) };
  }
  if (prog === 1) {
    const state = runSequence(field, ["vor", "links", "rechts", "vor", "vor"], start);
    return { field, state, blocks: 5, endless: false, ok: state.bumps === 0 && onStar(field, state) };
  }
  if (prog === 2) {
    const exec = runWhileCondition(field, frontObstacle, ["vor"], start, 12);
    return { field, state: exec.state, blocks: 2, endless: exec.endless, ok: !exec.endless && exec.state.bumps === 0 && onStar(field, exec.state) };
  }
  const exec = runWhileCondition(field, frontFree, ["vor"], start, 20);
  return { field, state: exec.state, blocks: 2, endless: exec.endless, ok: !exec.endless && exec.state.bumps === 0 && onStar(field, exec.state) };
}

function debugSummary(v: LabValues): DebugSummary {
  const cur = runDebugOnLen(v.programm, v.gangLaenge);
  return {
    field: cur.field,
    state: cur.state,
    blocks: cur.blocks,
    endless: cur.endless,
    okCurrent: cur.ok,
    okLen0: runDebugOnLen(v.programm, 0).ok,
    okLen3: runDebugOnLen(v.programm, 3).ok,
    okLen5: runDebugOnLen(v.programm, 5).ok,
  };
}

const debugLab: LabDefinition = {
  kind: "ms6-debug-labor",
  title: "Test- und Optimierungswerkstatt",
  intro:
    "Karo soll in einem Korridor bis vor die Zielwand fahren (auch bei Länge 0). Verschiebe die Wand und prüfe jedes Programm in allen Testfällen.",
  params: [
    { key: "gangLaenge", type: "range", label: "Freie Ganglänge (Testfall)", unit: "Felder", min: 0, max: 5, step: 1, value: 3 },
    {
      key: "programm",
      type: "choice",
      label: "Programm in der Entwicklungsumgebung",
      options: PROG_NAMES.map((label, value) => ({ value, label })),
      value: 0,
    },
  ],
  readouts: [
    {
      key: "testfall",
      label: "Aktueller Testfall",
      emphasis: true,
      compute: (v) => {
        const sum = debugSummary(v);
        if (sum.endless) return "Fehler: Endlosschleife gegen die Wand!";
        return sum.okCurrent ? `Bestanden (Ziel bei ${v.gangLaenge} Feldern erreicht)` : "Fehlgeschlagen (Ziel verfehlt oder Stoß)";
      },
    },
    {
      key: "bausteine",
      label: "Befehlsbausteine",
      compute: (v) => `${debugSummary(v).blocks} Bausteine`,
    },
  ],
  goals: [
    {
      id: "g1",
      text: "Entlarve die starre oder umständliche Sequenz: teste sie bei Ganglänge 0 oder ≥ 4.",
      check: (v) => (v.programm === 0 || v.programm === 1) && (v.gangLaenge === 0 || v.gangLaenge >= 4),
    },
    {
      id: "g2",
      text: "Wähle die optimierte Schleife (2 Bausteine) und bestehe Testfall Ganglänge 5.",
      check: (v) => v.programm === 3 && v.gangLaenge === 5 && debugSummary(v).okCurrent,
    },
    {
      id: "g3",
      text: "Teste dieselbe optimierte Lösung auch im Randfall Ganglänge 0 erfolgreich.",
      check: (v) => v.programm === 3 && v.gangLaenge === 0 && debugSummary(v).okCurrent,
    },
  ],
  witnesses: {
    g1: { gangLaenge: 0, programm: 0 },
    g2: { gangLaenge: 5, programm: 3 },
    g3: { gangLaenge: 0, programm: 3 },
  },
  view: {
    handles: {
      wandHandle: {
        x: "gangLaenge",
        drag(point): Partial<LabValues> {
          const steps = clamp(Math.round((point.x - 80) / 72), 0, 5);
          return { gangLaenge: steps };
        },
      },
    },
    render(v) {
      const sum = debugSummary(v);
      const cell = 72;
      const left = 44;
      const top = 36;
      const hx = left + v.gangLaenge * cell + 36;

      let out = open("Test- und Optimierungswerkstatt");
      // Korridor A1..F1 zeichnen
      for (let x = 0; x < 6; x++) {
        const cx = left + x * cell;
        const isStone = x === v.gangLaenge + 1;
        const isStar = x === v.gangLaenge;
        out += rect(cx, top, cell - 4, 62, isStone ? "lab-fill-b" : isStar ? "lab-fill-c" : "lab-shape", 'rx="8"');
        out += text(cx + 34, top + 78, `${String.fromCharCode(65 + x)}1`, "lab-text-tick", "middle");
        if (isStone) out += text(cx + 34, top + 36, "Wand", "lab-text-small", "middle");
        else if (isStar) out += text(cx + 34, top + 15, "★ Ziel", "lab-text-c", "middle");
      }

      // Figur
      const fx = left + sum.state.x * cell + 34;
      out += `<circle cx="${fx}" cy="${top + 41}" r="14" class="lab-fill-a" />`;
      out += text(fx, top + 46, "→", "lab-text-big", "middle");

      // Ziehpunkt für Ziel/Wand
      out += line(78, 134, 440, 134, "lab-thin");
      out += `<g class="lab-handle lab-handle-b" data-handle="wandHandle" tabindex="0" role="slider" aria-label="Freie Ganglänge" aria-valuemin="0" aria-valuemax="5" aria-valuenow="${v.gangLaenge}">`;
      out += `<circle cx="${hx}" cy="134" r="16" class="lab-handle-hit" />`;
      out += `<circle cx="${hx}" cy="134" r="7.5" class="lab-handle-dot" />`;
      out += text(hx, 158, `Länge ${v.gangLaenge}`, "lab-text-b", "middle");
      out += "</g>";

      // Testmatrix über drei Testfälle
      const tests = [
        { label: "Randfall 0", ok: sum.okLen0 },
        { label: "Standard 3", ok: sum.okLen3 },
        { label: "Lang 5", ok: sum.okLen5 },
      ];
      tests.forEach((t, idx) => {
        const tx = 24 + idx * 162;
        out += rect(tx, 178, 150, 66, t.ok ? "lab-fill-ok" : "lab-bad", 'rx="10"');
        out += text(tx + 75, 204, t.label, "lab-text-small", "middle");
        out += text(tx + 75, 228, t.ok ? "✓ bestanden" : "✗ Fehler", t.ok ? "lab-text-ok" : "lab-text-bad", "middle");
      });

      out += rect(24, 260, W - 48, 56, sum.okCurrent ? "lab-fill-ok" : "lab-panel", 'rx="10"');
      out += text(260, 286, `${PROG_NAMES[v.programm]} · ${sum.blocks} Bausteine`, "lab-text-small", "middle");
      out += text(
        260,
        304,
        sum.endless ? "Endlosschleife bei diesem Test!" : sum.okCurrent ? "Aktueller Testfall bestanden" : "Ziel verfehlt oder Zusammenstoß",
        sum.okCurrent ? "lab-text-ok" : "lab-text-bad",
        "middle",
      );
      return `${out}</svg>`;
    },
  },
};

const debugSchritteSparen = {
  id: "ms6-debug-schritte-sparen",
  make(rng: Rng, level: 1 | 2) {
    if (level === 1) {
      const straight = rng.pick([2, 3, 4]);
      const redundantPair = rng.pick(["links drehen · rechts drehen", "rechts drehen · links drehen"]);
      const fullCount = straight + 2 + 1;
      const minCount = straight + 1;
      return {
        prompt: `Ein Programm soll eine Figur zuerst ${straight}-mal ‚vor‘ bewegen und danach einmal nach rechts drehen. Darin hat sich ein überflüssiges Drehen-Paar eingeschlichen. Wie viele Anweisungen braucht das bereinigte Programm mindestens?`,
        given: [
          `Unbereinigtes Programm: ${straight}× vor · ${redundantPair} · rechts drehen (${fullCount} Anweisungen)`,
        ],
        formulaHint: "‚links drehen · rechts drehen‘ hebt sich vollständig auf und kann ersatzlos gestrichen werden.",
        fields: [
          withSlips(
            numberField("Mindestanzahl =", minCount),
            [fullCount, "Streiche das überflüssige Paar (links + rechts) komplett."],
            [straight, "Die abschließende Drehung nach rechts bleibt weiterhin nötig."],
          ),
        ],
        steps: [
          `Das Paar ‚${redundantPair}‘ dreht die Figur wieder in die Ausgangsrichtung zurück (0 Wirkung).`,
          `Es bleiben ${straight}× ‚vor‘ plus 1× ‚rechts drehen‘.`,
          `<strong>${minCount} Anweisungen</strong>`,
        ],
      };
    }
    const reps = rng.pick([4, 5, 6]);
    const inner = rng.pick([2, 3]);
    const unrolled = reps * inner;
    const looped = 1 + inner;
    const saved = unrolled - looped;
    return {
      prompt: `In einer Block-Umgebung wird eine ${inner}-teilige Befehlsfolge ${reps}-mal direkt hintereinander kopiert. Du fasst sie stattdessen mit einer Schleife ‚wiederhole ${reps}-mal‘ zusammen (1 Schleifenblock + ${inner} Innenblöcke). Wie viele Blöcke sparst du dadurch?`,
      given: [
        `Vorher (ohne Schleife): ${reps} · ${inner} = ${unrolled} Blöcke`,
        `Nachher (mit Schleife): 1 Schleifenblock + ${inner} Innenblöcke = ${looped} Blöcke`,
      ],
      fields: [
        withSlips(
          numberField("Eingesparte Blöcke =", saved),
          [looped, "Gefragt ist, wie viele Blöcke du im Vergleich zu vorher einsparst (Vorher − Nachher)."],
          [unrolled - inner, "Zähle auch den 1 Schleifenblock bei ‚Nachher‘ mit."],
        ),
      ],
      steps: [
        `Vorher: ${reps} · ${inner} = ${unrolled} Blöcke`,
        `Nachher: 1 + ${inner} = ${looped} Blöcke`,
        `<strong>Ersparnis: ${unrolled} − ${looped} = ${saved} Blöcke</strong>`,
      ],
    };
  },
};

// ─── Stage 2 Definition ───────────────────────────────────────────────────────

export const STAGE_PROGRAMMIERUNG: Stage = {
  id: STAGE_ID,
  stageNumber: 2,
  title: "Programmieren",
  subtitle: "Abläufe zerlegen, Struktogramme, Bedingungen, Alternativen, bedingte Wiederholung, Schachtelung und Testen",
  icon: "🤖",
  accent: "#4f46e5",
  badgeTitle: "Struktogramm-Profi",
  lehrplanLabel: "Inf6 LB 2",
  module: "2",
  lessons: [
    lesson(STAGE_ID, "2", 1, {
      id: "ms6-ablaeufe-sequenz",
      title: "Abläufe zerlegen: Anweisung, Sequenz und Struktogramm",
      subtitle: "Bewegungen in eindeutige Teilschritte gliedern und als Struktogramm notieren",
      why: "Ein Computer rät nicht, was du meinst – erst eine lückenlose, eindeutige Schrittfolge führt ans Ziel.",
      html: `<p>In Klasse 5 hast du bereits kennengelernt, was ein Algorithmus ist und wie einfache Abläufe mit Anweisungen und festen Wiederholungen beschrieben werden. Jetzt zerlegst du auch komplexere Alltags- und Bewegungsabläufe gezielt in <strong>sinnvolle Teilschritte</strong>.</p>
<p>Die zwei einfachsten Bausteine sind:</p>
<ul>
<li><strong>Anweisung:</strong> Ein einzelner, eindeutiger und ausführbarer Befehl (z. B. <code>vor gehen</code> oder <code>rechts drehen</code>). „Geh ein Stück weiter“ ist zu ungenau.</li>
<li><strong>Sequenz:</strong> Mehrere Anweisungen genau in fester Reihenfolge hintereinander. Vertauschst du zwei Schritte, ändert sich oft das Endergebnis.</li>
<li><strong>Struktogramm (Nassi-Shneiderman-Diagramm):</strong> Eine genormte, programmiersprachen-unabhängige Zeichnung. Du liest die Anweisungs-Kästen streng <strong>von oben nach unten</strong>.</li>
</ul>
<div class="example"><strong>Beispiel:</strong> Karo steht auf <code>A5</code> (Norden) und soll auf <code>C4</code>. Zerlegt in Teilschritte: <code>vor gehen</code> (<code>A4</code>) → <code>rechts drehen</code> (Osten) → <code>vor gehen</code> (<code>B4</code>) → <code>vor gehen</code> (<code>C4</code>). Im Struktogramm stehen diese vier Blöcke einfach als Kästchen übereinander.</div>
<div class="merke"><strong>Merke:</strong> Zerlege jeden Ablauf in eindeutige Teilschritte, beachte in der <strong>Sequenz</strong> die genaue Reihenfolge und lies das <strong>Struktogramm</strong> stets von oben nach unten.</div>`,
      rule: "Anweisung = eindeutiger Einzelschritt · Sequenz = feste Reihenfolge · Struktogramm von oben nach unten",
      terms: [
        ["Anweisung", "Kleinster eindeutiger, ausführbarer Schritt eines Programms", "z. B. vor gehen, links drehen"],
        ["Sequenz", "Feste Abfolge mehrerer Anweisungen nacheinander", "Reihenfolge bestimmt das Ergebnis"],
        ["Struktogramm", "Rechteck-Notationsform ohne Programmiersprachen-Details", "Wird von oben nach unten ausgeführt"],
      ],
      quiz: [
        "In welcher Reihenfolge werden Anweisungen in einem Sequenz-Struktogramm ausgeführt?",
        "Streng der Reihe nach von oben nach unten",
        "Immer von unten nach oben, beginnend beim letzten Kasten",
        "Zuerst alle Drehungen oben und erst ganz am Ende die Bewegungen",
        "Ein Nassi-Shneiderman-Struktogramm folgt bei einer Sequenz immer der Leserichtung von oben nach unten.",
      ],
      lab: sequenzLab,
      exercises: [
        sequenzVerfolgen,
        cases(
          "ms6-sequenz-struktogramm",
          [
            cc(
              "Welche Handlungsanweisung für eine Spielfigur ist eindeutig und ausführbar?",
              "Ein Feld vor gehen",
              ["Ein kleines Stück weiter nach vorne rücken", "Möglichst zügig in Richtung Ziel bewegen"],
              "Nur ‚ein Feld vor gehen‘ legt exakt fest, was die Figur in genau diesem Schritt tun soll.",
              "Woran erkennt man eine eindeutige Anweisung ohne Auslegungsspielraum?",
            ),
            cc(
              "Zwei Sequenzen bestehen aus denselben drei Bausteinen ‚vor · vor · rechts drehen‘ und ‚rechts drehen · vor · vor‘. Was gilt?",
              "Die veränderte Reihenfolge führt meist auf ein anderes Zielfeld",
              [
                "Beide Programme enden immer auf demselben Feld, weil alle Befehle vorkommen",
                "Drehungen werden vor allen ‚vor‘-Befehlen automatisch zuerst ausgeführt",
              ],
              "Bei einer Sequenz entscheidet die Reihenfolge der Schritte über das Ergebnis.",
              "Macht es einen Unterschied, ob du erst drehst oder erst geradeaus läufst?",
            ),
            cc(
              "Warum nutzt man in der Informatik ein Struktogramm vor dem Programmieren am Rechner?",
              "Um die Schrittfolge und Struktur eines Ablaufs übersichtlich und unabhängig von einer bestimmten Programmiersprache zu planen",
              [
                "Weil ein Struktogramm ohne weitere Umsetzung direkt wie fertiger Programmcode läuft",
                "Weil man in einem Struktogramm die genaue Reihenfolge noch offenlassen darf",
              ],
              "Das Struktogramm klärt den gedanklichen Plan, bevor du ihn in Blöcke oder Text umsetzt.",
              "Hilft das Struktogramm beim Planen vor dem Umsetzen?",
            ),
          ],
          [
            cc(
              "Du willst einen Tee kochen und als Ablauf zerlegen: ‚Teebeutel einhängen · Wasser einfüllen · Wasser kochen · Tasse holen‘. Welcher Fehler steckt in dieser Sequenz?",
              "Die Reihenfolge ist unlogisch: Tasse holen und Wasser kochen müssen vor dem Einfüllen und Einhängen stehen",
              [
                "Die Schritte sind noch zu klein zerlegt und gehören in einen einzigen Satz",
                "Im Struktogramm dürfen nur Bewegungen nach rechts oder links stehen",
              ],
              "Beim Zerlegen eines Ablaufs prüfst du nicht nur die Teilschritte, sondern auch ihre sachlich richtige Reihenfolge.",
              "Prüfe Schritt für Schritt, ob jeder Schritt auf das Vorherige aufbauen kann.",
            ),
            cc(
              "Karo soll in einem 5×5-Feld ein Hindernis vor sich umgehen (1 Feld links, 2 Felder vor, 1 Feld rechts, 1 Feld vor). Was ist die kürzeste erste Teilaufgabe?",
              "Links abbiegen und neben das Hindernis fahren",
              [
                "Sofort ‚vor gehen‘ ausführen und gegen das Hindernis fahren",
                "Erst einmal alle Randfelder des 5×5-Spielfelds komplett umrunden",
              ],
              "Sinnvolle Teilschritte gliedern ein Problem in kleine, überprüfbare Abschnitte.",
              "Wie beginnt ein sinnvoller Umgehungs-Teilschritt direkt vor einem Stein?",
            ),
            cc(
              "Welchen Vorteil bietet eine Notationsform wie das Struktogramm beim Arbeiten im Team?",
              "Alle im Team verstehen die Programmstruktur auf einen Blick, egal welche Block- oder Textumgebung später genutzt wird",
              [
                "Es übersetzt jeden Entwurf automatisch in fehlerfreien Programmcode",
                "Es ersetzt anschließend alle Testläufe in der Entwicklungsumgebung",
              ],
              "Genormte Notationsformen machen Abläufe zwischen verschiedenen Personen eindeutig lesbar.",
              "Warum einigen sich Informatiker auf gemeinsame Notationsformen?",
            ),
          ],
        ),
      ],
    }),

    lesson(STAGE_ID, "2", 2, {
      id: "ms6-bedingungen",
      title: "Bedingungen formulieren und prüfen",
      subtitle: "Eindeutige Wahr-oder-Falsch-Aussagen, Vergleiche und Verneinungen",
      why: "Nur wenn ein Programm die Umgebung prüft (z. B. ‚vorne frei?‘), kann es auf Steine, Ränder oder Messwerte reagieren.",
      html: `<p>Eine starre Sequenz läuft immer gleich ab – auch dann, wenn plötzlich ein Stein im Weg liegt. Damit ein Programm auf Situationen reagieren kann, braucht es eine <strong>Bedingung</strong>.</p>
<p>In der Informatik ist eine Bedingung eine Aussage, die zu einem Zeitpunkt eindeutig entweder <strong>wahr</strong> oder <strong>falsch</strong> ist (nie „vielleicht“). Typische Bedingungen sind:</p>
<ul>
<li><strong>Sensor- oder Zustandsbedingungen:</strong> <code>vorne frei</code>, <code>vorne Hindernis</code>, <code>auf Stern</code>, <code>am Rand</code>.</li>
<li><strong>Vergleiche mit Zahlen:</strong> <code>&lt;</code> (kleiner), <code>&gt;</code> (größer), <code>≤</code> (kleiner oder gleich), <code>≥</code> (größer oder gleich), <code>=</code> (gleich). Wichtig ist der Unterschied zwischen <code>&gt; 10</code> (erst ab 11) und <code>≥ 10</code> (schon bei genau 10 wahr).</li>
<li><strong>Verneinung (<code>nicht …</code>):</strong> Kehrt den Wahrheitswert um. Ist <code>am Rand</code> falsch, dann ist <code>nicht am Rand</code> wahr.</li>
</ul>
<div class="example"><strong>Beispiel:</strong> Karo steht auf <code>B4</code> mit Blick nach Norden, auf <code>B3</code> liegt ein Stein. Dann ist <code>vorne Hindernis</code> <strong>wahr</strong>, <code>vorne frei</code> ist <strong>falsch</strong> und <code>nicht am Rand</code> ist ebenfalls <strong>wahr</strong>.</div>
<div class="merke"><strong>Merke:</strong> Eine <strong>Bedingung</strong> ist eine Prüf-Aussage, die eindeutig <strong>wahr</strong> oder <strong>falsch</strong> ergibt – etwa über Sensoren, Zahlenvergleiche (<code>&lt;</code>, <code>&gt;</code>, <code>≤</code>, <code>≥</code>) oder Verneinung (<code>nicht</code>).</div>`,
      rule: "Bedingung = eindeutige Aussage (nur wahr oder falsch) · Verneinung ‚nicht‘ dreht den Wert um",
      terms: [
        ["Bedingung", "Aussage, die eindeutig wahr oder falsch liefert", "Grundlage für Alternative und bedingte Wiederholung"],
        ["Vergleichszeichen", "<, >, ≤, ≥ und = vergleichen Werte genau an Grenzen", "≥ schließt den Grenzwert ein, > schließt ihn aus"],
        ["Verneinung (nicht)", "Macht aus ‚wahr‘ → ‚falsch‘ und aus ‚falsch‘ → ‚wahr‘", "z. B. ‚nicht am Rand‘"],
      ],
      quiz: [
        "Wann ist die Bedingung ‚Temperatur ≥ 20 °C‘ genau erfüllt (wahr)?",
        "Bei genau 20 °C und jedem Wert darüber (z. B. 21 °C)",
        "Ausschließlich bei Temperaturen über 20 °C, also erst ab 21 °C",
        "Nur bei Temperaturen bis höchstens 20 °C, darunter immer falsch",
        "Das Zeichen ‚≥‘ bedeutet ‚größer oder gleich‘ und schließt den Grenzwert 20 °C mit ein.",
      ],
      lab: bedingungLab,
      exercises: [
        bedingungAuswerten,
        cases(
          "ms6-bedingung-formulieren",
          [
            cc(
              "Welche Aussage ist für ein Programm als eindeutige Bedingung geeignet?",
              "vorne Hindernis",
              ["vielleicht ein bisschen eng", "möglichst zügig nach rechts abbiegen"],
              "‚vorne Hindernis‘ lässt sich eindeutig mit ‚wahr‘ oder ‚falsch‘ prüfen.",
              "Welche Formulierung lässt genau zwei Antworten (wahr oder falsch) zu?",
            ),
            cc(
              "Karo steht mitten auf C3 ohne Stern-Ziel, und die Bedingung lautet ‚auf Stern‘. Wie lautet der Wahrheitswert ‚nicht auf Stern‘?",
              "wahr, weil ‚auf Stern‘ falsch ist und ‚nicht‘ den Wert umdreht",
              [
                "falsch, weil auf C3 tatsächlich kein Stern liegt",
                "unbestimmt, solange die Figur noch in Bewegung ist",
              ],
              "Verneinung (nicht) kehrt falsch in wahr um.",
              "Dreht ‚nicht‘ einen Wahrheitswert um?",
            ),
            cc(
              "Wann prüft eine Figur die Bedingung ‚vorne frei‘ als FALSCH?",
              "Wenn unmittelbar vor ihr ein Stein liegt oder die Spielfeldwand beginnt",
              [
                "Wenn hinter der Figur bereits ein Stein überfahren wurde",
                "Immer dann, wenn rechts oder links von der Figur eine Mauer steht",
              ],
              "Der Sensor ‚vorne frei‘ blickt genau auf das nächste Feld in Blickrichtung.",
              "Welches Feld schaut sich ‚vorne frei‘ genau an?",
            ),
          ],
          [
            cc(
              "Ein Freizeitpark lässt Kinder ‚unter 12 Jahren‘ kostenlos hinein, eine Gruppe formuliert die Bedingung ‚Alter ≤ 12‘. Stimmt diese Umsetzung für einen genau 12-Jährigen?",
              "Nein, ‚unter 12‘ heißt ‚Alter < 12‘; mit ‚≤ 12‘ käme auch ein 12-Jähriger gratis hinein",
              [
                "Ja, ‚<‘ und ‚≤‘ verhalten sich bei ganzen Jahreszahlen genau gleich",
                "Ja, weil ‚≤ 12‘ erst ab dem dreizehnten Lebensjahr greift",
              ],
              "An Grenzen entscheidet genau die Wahl zwischen streng kleiner (<) und kleiner-gleich (≤).",
              "Prüfe das Alter 12 bei beiden Operatoren ‚< 12‘ und ‚≤ 12‘!",
            ),
            cc(
              "In einem Labyrinth soll eine Spielfigur prüfen, ob sie ‚nicht am Rand‘ steht. Auf welchem Feld eines 5×5-Feldes (A–E, 1–5) ist diese Bedingung WAHR?",
              "Auf B2 (oder C3, D4 – keines von Spalte A/E oder Zeile 1/5)",
              ["Auf A1", "Auf E3"],
              "Randfelder liegen in Spalte A oder E bzw. Zeile 1 oder 5 – nur das Innenfeld (B–D, 2–4) liegt nicht am Rand.",
              "Welche Spalten und Zeilen bilden den äußeren Rand eines 5×5-Feldes?",
            ),
            cc(
              "Warum ist die Anweisung ‚wenn es warm wird‘ als Informatik-Bedingung ungeeignet?",
              "Weil kein fester Schwellenwert genannt ist, ab dem ‚warm‘ eindeutig wahr wird",
              [
                "Weil Bedingungen in Struktogrammen nur mit Richtungen arbeiten dürfen",
                "Weil Messwerte erst nach drei Durchläufen verglichen werden können",
              ],
              "Erst ein konkreter Vergleich (z. B. ‚Temperatur ≥ 25 °C‘) macht den Test eindeutig wahr oder falsch.",
              "Wann wissen zwei Sensoren exakt denselben Schwellenwert?",
            ),
          ],
        ),
      ],
    }),

    lesson(STAGE_ID, "2", 3, {
      id: "ms6-alternative",
      title: "Verzweigung (Alternative): wenn–dann und wenn–dann–sonst",
      subtitle: "Einseitige und zweiseitige Entscheidungen im Struktogramm modellieren",
      why: "Ohne Alternative kann ein Programm nicht zwischen ‚Weg frei‘ und ‚Hindernis voraus‘ unterscheiden.",
      html: `<p>Sobald dein Programm abhängig von einer <strong>Bedingung</strong> unterschiedliche Wege gehen soll, nutzt du eine <strong>Alternative (Verzweigung)</strong>:</p>
<ul>
<li><strong>Einseitige Alternative (<code>wenn … dann …</code>):</strong> Ist die Bedingung <strong>wahr</strong>, wird der <code>dann</code>-Zweig ausgeführt. Ist sie <strong>falsch</strong>, passiert nichts Besonderes und das Programm läuft einfach danach weiter.</li>
<li><strong>Zweiseitige Alternative (<code>wenn … dann … sonst …</code>):</strong> Ist die Bedingung <strong>wahr</strong>, läuft der <code>dann</code>-Zweig; ist sie <strong>falsch</strong>, läuft stattdessen der <code>sonst</code>-Zweig. Es wird immer genau <strong>einer</strong> der beiden Zweige ausgeführt!</li>
<li><strong>Im Struktogramm:</strong> Das geteilte Dreieck oben nennt die Bedingung. Links steht <code>wahr</code> (<code>dann</code>), rechts steht <code>falsch</code> (<code>sonst</code> bzw. leer bei einseitiger Alternative).</li>
</ul>
<div class="example"><strong>Beispiel:</strong> Ein Türöffner prüft: <code>wenn Bewegung erkannt dann Tür öffnen sonst Tür geschlossen halten</code>. Bei Bewegung öffnet die Tür; ohne Bewegung bleibt sie zu – niemals beides gleichzeitig.</div>
<div class="merke"><strong>Merke:</strong> Bei einer <strong>einseitigen Alternative</strong> gibt es nur einen <code>dann</code>-Zweig; bei einer <strong>zweiseitigen Alternative</strong> wird je nach Bedingung genau entweder der <code>dann</code>- oder der <code>sonst</code>-Zweig ausgeführt.</div>`,
      rule: "wenn B dann A1 [sonst A2]: bei wahr → A1, bei falsch → nichts (einseitig) oder A2 (zweiseitig)",
      terms: [
        ["Einseitige Alternative", "wenn <Bedingung> dann <Anweisung>", "Bei ‚falsch‘ wird der Zweig einfach übersprungen"],
        ["Zweiseitige Alternative", "wenn <Bedingung> dann <A1> sonst <A2>", "Genau einer der beiden Zweige wird ausgeführt"],
        ["Struktogramm der Alternative", "Kopf mit schrägen Linien (wahr links, falsch rechts)", "Zeigt auf einen Blick beide Entscheidungswege"],
      ],
      quiz: [
        "Wie viele Zweige werden bei einer zweiseitigen Alternative (wenn–dann–sonst) bei einem Durchlauf ausgeführt?",
        "Genau einer – je nach Prüfung ‚dann‘ oder ‚sonst‘",
        "Immer beide Zweige nacheinander von links nach rechts",
        "Höchstens einer – bei ‚falsch‘ wird der Kasten übersprungen",
        "Eine Bedingung ist zu jedem Prüfzeitpunkt entweder wahr oder falsch; deshalb wird exakt ein Zweig betreten.",
      ],
      lab: alternativeLab,
      exercises: [
        altAuswerten,
        cases(
          "ms6-alt-struktogramm",
          [
            cc(
              "Woran erkennst du im Nassi-Shneiderman-Struktogramm eine einseitige Alternative gegenüber einer zweiseitigen?",
              "Bei der einseitigen Alternative bleibt die rechte ‚falsch‘-Spalte leer (∅), bei der zweiseitigen steht dort der ‚sonst‘-Ablauf",
              [
                "Die einseitige Alternative besitzt im Struktogramm keinen Dreiecks-Kopf",
                "Bei der zweiseitigen Alternative stehen beide Bedingungen ganz unten",
              ],
              "Beide tragen das Entscheidungs-Dreieck oben, aber nur die zweiseitige Alternative füllt auch den ‚falsch‘-Bereich.",
              "Schau im Struktogramm auf die rechte Seite unter ‚falsch‘!",
            ),
            cc(
              "Eine Figur soll nur dann nach rechts drehen, wenn ein Stein vor ihr steht; ist der Weg frei, braucht sie gar nichts zu tun. Welche Struktur passt genau?",
              "Einseitige Alternative: wenn vorne Hindernis dann rechts drehen",
              [
                "Zweiseitige Alternative: wenn vorne Hindernis dann rechts sonst auch rechts",
                "Reine Sequenz ohne jede Bedingung",
              ],
              "Wenn bei ‚falsch‘ nichts geschehen soll, genügt die einseitige Alternative (ohne sonst-Zweig).",
              "Brauchst du einen eigenen ‚sonst‘-Zweig, wenn bei freiem Weg nichts passieren soll?",
            ),
            cc(
              "In einer zweiseitigen Alternative steht: ‚wenn Regen dann Schirm mitnehmen sonst Sonnenbrille einstecken‘. Heute scheint die Sonne (Regen = falsch). Was passiert?",
              "Nur der ‚sonst‘-Zweig (Sonnenbrille einstecken) wird ausgeführt",
              [
                "Beide Zweige werden nacheinander ausgeführt",
                "Bei falscher Bedingung wird die Alternative ganz übersprungen",
              ],
              "Weil die Bedingung ‚Regen‘ falsch ist, springt der Ablauf direkt in den rechten ‚sonst‘-Zweig.",
              "Welcher Zweig gehört zur Antwort ‚falsch‘?",
            ),
          ],
          [
            cc(
              "Ein Schüler schreibt zwei getrennte einseitige Alternativen hintereinander: (1) wenn Temp < 18 dann Heizung an; (2) wenn Temp ≥ 18 dann Heizung aus. Wie lässt sich das kürzer und sauberer in einer einzigen Struktur ausdrücken?",
              "Als eine zweiseitige Alternative: wenn Temp < 18 dann Heizung an sonst Heizung aus",
              [
                "Als reine Sequenz aus ‚Heizung an‘ und direkt danach ‚Heizung aus‘",
                "Als Wiederholung, die dreimal ‚Heizung an‘ prüft",
              ],
              "Da ‚Temp ≥ 18‘ genau das Gegenteil von ‚Temp < 18‘ ist, fasst eine einzige zweiseitige Alternative beide Fälle elegant zusammen.",
              "Prüfe, ob die zweite Bedingung genau der ‚falsch‘-Fall der ersten Bedingung ist.",
            ),
            cc(
              "Ein Roboter prüft ‚wenn auf Stern dann Stern einsammeln‘ und direkt danach ohne ‚sonst‘ immer ‚vor gehen‘. Was passiert, wenn er NICHT auf einem Stern steht?",
              "Er überspringt das Einsammeln und geht anschließend ‚vor‘",
              [
                "Er bleibt vor dem Entscheidungskasten stehen, bis ein Stern auftaucht",
                "Das Programm bricht ab, weil der ‚sonst‘-Zweig fehlt",
              ],
              "Nach einer einseitigen Alternative läuft das Programm unterhalb des Entscheidungskastens ganz normal in der Sequenz weiter.",
              "Was geschieht im Struktogramm nach dem Ende des Entscheidungskastens?",
            ),
            cc(
              "Auf einem Plakat prüft ein Getränkeautomat ‚wenn Münze ≥ 2 € dann Getränk ausgeben sonst Anzeige: Zu wenig‘. Was passiert bei genau 2 €?",
              "2 ≥ 2 ist wahr → das Getränk wird ausgegeben",
              [
                "2 ≥ 2 ist falsch → Anzeige ‚Zu wenig‘",
                "Bei Gleichstand laufen sowohl Ausgabe als auch Meldung",
              ],
              "Das Zeichen ‚≥‘ schließt die Gleichheit (2 = 2) mit ein, daher greift der ‚dann‘-Zweig.",
              "Beachte ‚≥‘ beim Grenzwert 2 €!",
            ),
          ],
        ),
      ],
    }),

    lesson(STAGE_ID, "2", 4, {
      id: "ms6-bedingte-wiederholung",
      title: "Bedingte Wiederholung (solange …) und Endlosschleifen",
      subtitle: "Kopfgesteuerte Schleifen vor dem Lauf prüfen und Abbruchbedingungen sichern",
      why: "Oft weißt du vorab nicht, wie viele Schritte bis zur Wand fehlen – dann hilft ‚solange vorne frei‘ statt fester Schrittzahl.",
      html: `<p>In Klasse 5 hast du die <strong>Wiederholung mit fester Anzahl</strong> (z. B. <code>wiederhole 4-mal</code>) genutzt. Doch was, wenn Karo an einem unbekannt weiten Hindernis halten soll?</p>
<p>Dann nutzt du eine <strong>bedingte Wiederholung</strong> (Kopf-gesteuerte Schleife: <code>solange &lt;Bedingung&gt;</code>):</p>
<ul>
<li><strong>Prüfung vor jedem Durchlauf:</strong> Bevor der Schleifenkörper läuft, prüft das Programm die Bedingung. Ist sie <strong>falsch</strong>, startet der Körper gar nicht erst (<code>0</code> Durchläufe sind möglich!).</li>
<li><strong>Solange wahr:</strong> Ist die Bedingung wahr, läuft der Körper einmal durch; danach springt das Programm zurück nach oben und prüft erneut.</li>
<li><strong>Gefahr der Endlosschleife:</strong> Verändert der Schleifenkörper nichts an der Bedingung (z. B. dreht Karo nur links und rechts, statt vorwärts zu fahren), bleibt die Bedingung ewig wahr – das Programm hört nie auf!</li>
<li><strong>Im Struktogramm:</strong> Ein L-förmiger Rahmen umschließt oben den Bedingungskopf und innen eingerückt den wiederholten Block.</li>
</ul>
<div class="example"><strong>Beispiel:</strong> <code>solange vorne frei: vor gehen</code>. Stehen <code>3</code> freie Felder vor Karo, geht sie <code>3</code>-mal vor und stoppt sicher vor dem Stein. Steht der Stein sofort vor Karo, stoppt die Schleife bereits nach <code>0</code> Durchläufen!</div>
<div class="merke"><strong>Merke:</strong> Eine <strong>bedingte Wiederholung</strong> prüft ihre Bedingung <strong>vor jedem Durchlauf</strong>. Im Körper muss sich etwas verändern, sonst entsteht eine <strong>Endlosschleife</strong>.</div>`,
      rule: "solange <Bedingung> (kopfgesteuert): erst prüfen, dann laufen (0-mal möglich) · Änderung im Körper nötig!",
      terms: [
        ["Bedingte Wiederholung (solange …)", "Wiederholt den Körper, solange die Bedingung vor dem Lauf wahr ist", "Kann bei falscher Startbedingung 0-mal laufen"],
        ["Endlosschleife", "Schleife, deren Bedingung niemals falsch wird", "Entsteht, wenn im Körper keine Veränderung Richtung Ziel erfolgt"],
        ["Feste vs. bedingte Wiederholung", "n-mal (Anzahl vorab bekannt) vs. solange (Anzahl erst zur Laufzeit klar)", "z. B. Quadrat (4-mal) vs. bis zur Wand (solange frei)"],
      ],
      quiz: [
        "Karo steht direkt vor einer Mauer (‚vorne frei‘ ist sofort falsch). Wie oft läuft der Körper von ‚solange vorne frei: vor gehen‘?",
        "0-mal – die Bedingung prüft vorab und ist sofort falsch",
        "1-mal – die Schleife prüft erst nach dem ersten Schritt",
        "Endlos oft, solange die Wand auf demselben Feld bleibt",
        "Bei der kopfgesteuerten bedingten Wiederholung wird die Bedingung immer zuerst geprüft; ist sie falsch, wird der Körper kein einziges Mal ausgeführt.",
      ],
      lab: schleifeLab,
      exercises: [
        schleifeDurchlaeufe,
        cases(
          "ms6-schleife-wahl",
          [
            cc(
              "Für welche Aufgabe brauchst du eine bedingte Wiederholung statt ‚wiederhole n-mal‘?",
              "Bis zur nächsten Wand laufen, obwohl du vorher nicht weißt, wie viele Felder sie entfernt ist",
              [
                "Genau 4-mal ein Quadrat mit fester Seitenlänge von 2 Feldern umrunden",
                "Genau einmal ‚rechts drehen‘ ausführen",
              ],
              "Immer wenn die genaue Anzahl der Schritte vorab unbekannt ist, entscheidet eine Bedingung zur Laufzeit.",
              "Wann kennst du die Schrittzahl schon vor dem Start und wann erst unterwegs?",
            ),
            cc(
              "Warum gerät ‚solange vorne frei: links drehen · rechts drehen‘ bei freiem Weg vor der Figur in eine Endlosschleife?",
              "Weil sich weder Feld noch Blickrichtung dauerhaft ändern – ‚vorne frei‘ bleibt bei jeder Prüfung wahr",
              [
                "Weil zwei entgegengesetzte Drehungen in einer Schleife doppelt zählen",
                "Weil ein Schleifenkörper mindestens einmal ‚vor‘ vor einer Drehung braucht",
              ],
              "Jede sinnvolle bedingte Schleife muss in ihrem Körper auf das Falsch-Werden der Bedingung hinarbeiten.",
              "Verändert sich nach ‚links · rechts‘ die Situation vor der Figur?",
            ),
            cc(
              "Woran erkennst du im Struktogramm eine Wiederholung?",
              "An einem L-förmigen Rahmen mit Bedingung oben und eingerücktem Wiederholungsteil innen",
              [
                "An einem Dreieck oben in der Mitte mit ‚wahr‘ und ‚falsch‘",
                "An zwei geschweiften Pfeilen neben einer normalen Sequenz",
              ],
              "Der L-Rahmen umschließt im Nassi-Shneiderman-Struktogramm alle Schritte des Schleifenkörpers.",
              "Wie unterscheidet sich das Schleifen-Symbol optisch vom Alternative-Dreieck?",
            ),
          ],
          [
            cc(
              "Ein Programm nutzt ‚solange noch Wasser im Tank: Blume gießen‘. Der Tank ist zu Beginn völlig leer. Was passiert?",
              "Die Schleife endet nach 0 Durchläufen sofort, ohne dass gegossen wird",
              [
                "Sie führt erst einmal einen Gieß-Schritt aus und prüft danach",
                "Sie startet mit einem Fehler, weil ‚solange‘ mindestens 1 Durchlauf braucht",
              ],
              "Kopfgesteuerte Prüfung vor dem ersten Durchlauf verhindert Fehler bei leeren Startbedingungen.",
              "Prüft ‚solange‘ vor oder nach dem ersten Gieß-Durchlauf?",
            ),
            cc(
              "Ein Schüler möchte von A6 bis direkt vor einen Stein laufen und schreibt ‚solange vorne Hindernis: vor‘. Warum läuft Karo gar nicht los, wenn der Weg eigentlich frei ist?",
              "Weil die Bedingung verdreht wurde: solange der Weg frei ist, ist ‚vorne Hindernis‘ falsch, also startet die Schleife 0-mal",
              [
                "Weil eine Schleife ‚solange‘ nur in Richtung Osten und Süden prüfen darf",
                "Weil eine bedingte Wiederholung nach jedem ‚vor‘-Befehl automatisch anhält",
              ],
              "Die Schleifenbedingung nennt immer den Zustand, unter dem WEITERGEMACHT werden soll (‚solange vorne frei‘), nicht die Abbruchursache.",
              "Prüfe, ob die Bedingung ‚vorne Hindernis‘ bei freiem Weg wahr oder falsch ist!",
            ),
            cc(
              "Ein Download-Fortschritt prüft ‚solange geladene_MB < Gesamt_MB: nächstes Paket laden‘. Warum ist dies keine Endlosschleife?",
              "Weil jedes geladene Paket die geladenen MB erhöht, bis der Gesamtwert erreicht ist und die Bedingung falsch wird",
              [
                "Weil jedes ‚solange‘ nach zehn Durchläufen selbständig beendet wird",
                "Weil man in der Bedingung zwei Zahlengrößen höchstens einmal prüft",
              ],
              "Fortschritt im Schleifenkörper sorgt dafür, dass die Abbruchgrenze verlässlich erreicht wird.",
              "Verändert der Körper den Wert in Richtung Abbruch?",
            ),
          ],
        ),
      ],
    }),

    lesson(STAGE_ID, "2", 5, {
      id: "ms6-schachtelung",
      title: "Grundstrukturen schachteln",
      subtitle: "Alternativen in Schleifen einsetzen und verschachtelte Struktogramme von außen nach innen lesen",
      why: "Erst durch das Ineinander-Setzen von Schleife und Verzweigung findet eine Figur selbständig durch Kurven bis ans Ziel.",
      html: `<p>Einzelne Bausteine reichen oft nicht für reale Aufgaben. Deshalb lassen sich die algorithmischen Grundstrukturen ineinander <strong>schachteln</strong> – besonders häufig eine <strong>Alternative innerhalb einer bedingten Wiederholung</strong>.</p>
<p>So liest du ein verschachteltes Struktogramm sicher <strong>von außen nach innen</strong>:</p>
<ol class="steps">
<li><strong>Äußere Schleife prüfen:</strong> Solange das Ziel noch nicht erreicht ist (z. B. <code>solange nicht auf Stern</code>), beginnt ein neuer Durchlauf.</li>
<li><strong>Innere Alternative prüfen:</strong> Im Schleifenkörper entscheidet <code>wenn vorne frei dann vor gehen sonst rechts drehen</code>, ob Karo geradeaus fährt oder an einer Ecke abbiegt.</li>
<li><strong>Rücksprung nach oben:</strong> Nach dem jeweiligen Zweig springt der Ablauf an den Kopf der äußeren Schleife zurück und prüft erneut, ob der Stern erreicht ist.</li>
</ol>
<div class="example"><strong>Beispiel:</strong> Ein Gang führt nach Norden und knickt am Ende rechtwinklig nach Osten zum Stern ab. Die innere Alternative fährt entlang jeder Geraden vorwärts und dreht an der Wand genau einmal nach rechts – so funktioniert dasselbe Programm sogar bei einem langen U-Gang mit zwei Ecken!</div>
<div class="merke"><strong>Merke:</strong> Beim <strong>Schachteln</strong> arbeitet eine Struktur innerhalb einer anderen. Lies das Struktogramm von <strong>außen nach innen</strong> und verfolge jeden Durchlauf bis zur äußeren Schleifenprüfung zurück.</div>`,
      rule: "Schachteln = Struktur in Struktur (z. B. Alternative in Schleife) · Lesen: von außen nach innen",
      terms: [
        ["Schachtelung", "Einsetzen einer Grundstruktur in eine andere (z. B. Alternative in Schleife)", "Macht Programme flexibel für Kurven und Verzweigungen"],
        ["Äußerer Rahmen", "Steuert die gesamte Wiederholung bis zum Abbruch (z. B. ‚solange nicht auf Stern‘)", "Wird vor jedem Durchlauf zuerst geprüft"],
        ["Innerer Zweig", "Wählt innerhalb eines Durchlaufs genau die passende Reaktion", "Darf den Fortschritt nicht blockieren (sonst Endlosschleife)"],
      ],
      quiz: [
        "In welcher Reihenfolge liest und verfolgst du ein Struktogramm, in dem eine Alternative in einer bedingten Wiederholung liegt?",
        "Von außen nach innen: zuerst äußere Schleife, dann innere Verzweigung",
        "Von innen nach außen: zuerst den ‚sonst‘-Zweig, danach einmal den Kopf",
        "Alle Kästen nacheinander von unten nach oben, ganz ohne Schleifenprüfung",
        "Wie bei Klammern entscheidet zuerst die äußere Struktur, ob der innere Bereich überhaupt durchlaufen wird.",
      ],
      lab: schachtelLab,
      exercises: [
        schachtelVerfolgen,
        cases(
          "ms6-schachtel-struktur",
          [
            cc(
              "In einem Programm liegt ‚wenn vorne frei dann vor sonst rechts drehen‘ innerhalb von ‚solange nicht auf Stern‘. Wann endet das gesamte Programm?",
              "Sobald die Figur auf einem Stern steht und ‚nicht auf Stern‘ vor dem nächsten Durchlauf falsch wird",
              [
                "Sofort nach der allerersten Rechtsdrehung an einer Ecke",
                "Nach genau einem Schritt vorwärts im ersten Zweig",
              ],
              "Die äußere Schleifenbedingung steuert, wann das gesamte Konstrukt beendet wird.",
              "Welche Bedingung bestimmt das Ende der Wiederholung?",
            ),
            cc(
              "Was passiert in ‚solange nicht auf Stern: wenn vorne frei dann vor sonst nichts tun‘, sobald die Figur gegen eine Wand vor einer Kurve trifft?",
              "Sie bleibt stehen und verharrt in einer Endlosschleife, weil sie weder dreht noch den Stern erreicht",
              [
                "Die Schleife bricht automatisch ab, sobald ‚nichts tun‘ ausgeführt wird",
                "Sie dreht automatisch um 180 Grad zurück und sucht den Startpunkt",
              ],
              "Ohne Drehung im sonst-Zweig verändert sich der Zustand nicht mehr.",
              "Wie kommt die Figur nach dem ‚nichts tun‘ um die Ecke?",
            ),
            cc(
              "Warum ist eine geschachtelte Kombination aus Schleife und Alternative einer langen starren Sequenz bei mehreren Parcours überlegen?",
              "Dasselbe kurze Programm meistert unterschiedlich lange Gänge und beliebig viele passende Kurven",
              [
                "Weil eine reine Sequenz im Struktogramm gar nicht mehr als zwei Bausteine erlaubt",
                "Weil geschachtelte Programme im Struktogramm ohne Bedingung auskommen",
              ],
              "Schachtelung macht Programme allgemein und anpassungsfähig für verschiedene Weglängen.",
              "Funktioniert eine starre Schrittfolge auch in einem anders gebauten Gang?",
            ),
          ],
          [
            cc(
              "Zwei Strukturen werden vertauscht: Jemand schreibt AUßEN ‚wenn vorne frei‘ und INNEN im dann-Zweig ‚solange nicht auf Stern: vor‘. Welcher Fehler entsteht vor einer Kurve?",
              "Die innere Schleife ‚vor‘ prüft unterwegs gar nicht mehr, ob die Wand kommt, und fährt in die Wand hinein",
              [
                "Die äußere Bedingung prüft bei jedem einzelnen Feld vor der Kurve erneut",
                "Das Programm bricht schon vor dem ersten Schritt ab, obwohl Weg frei ist",
              ],
              "Weil die Prüfung auf Hindernisse nicht mehr in jedem Schritt läuft, knallt die Figur bei der Kurve gegen die Wand.",
              "Wird ‚vorne frei‘ bei jedem Einzelschritt geprüft, wenn es ganz außen nur einmal am Start steht?",
            ),
            cc(
              "Ein Kassenprogramm läuft ‚solange noch Artikel auf dem Band: wenn Artikel hat Rabatt dann 10 % abziehen sonst vollen Preis addieren‘. Wann wird ‚10 % abziehen‘ ausgeführt?",
              "Nur bei Artikeln auf dem Band, für die ‚hat Rabatt‘ wahr ist",
              [
                "Nur am Ende nach dem letzten Artikel für alle zusammen einmal",
                "Auch dann, wenn gar kein Artikel auf dem Band liegt",
              ],
              "Die äußere Schleife sorgt dafür, dass jeder Artikel durchlaufen wird; die innere Alternative prüft für genau diesen einen Artikel den Rabatt.",
              "Was prüft die innere Alternative bei jedem einzelnen Schleifendurchlauf?",
            ),
            cc(
              "Wie viele Anweisungen führt der Körper pro Durchlauf aus in: ‚solange nicht am Ziel: wenn vorne frei dann vor sonst (rechts drehen · vor)‘ an einer offenen Ecke?",
              "Entweder 1 Anweisung (vor) bei freiem Weg oder die 2-schrittige Sequenz (rechts drehen · vor) bei blockiertem Weg",
              [
                "Immer alle drei Anweisungen gleichzeitig bei jedem einzelnen Durchlauf",
                "Keine, weil ein Zweig im Struktogramm höchstens eine Anweisung enthalten darf",
              ],
              "Jeder Zweig einer Alternative darf selbst wieder aus einer ganzen Sequenz bestehen.",
              "Können in einem Zweig einer Alternative mehrere Schritte nacheinander stehen?",
            ),
          ],
        ),
      ],
    }),

    lesson(STAGE_ID, "2", 6, {
      id: "ms6-testen-optimieren",
      title: "Programme in Entwicklungsumgebungen testen und optimieren",
      subtitle: "Systematisch mit Randfällen testen, Fehler beheben und Programme vereinfachen",
      why: "Ein Programm, das nur auf deinem Schreibtisch bei genau einem Beispiel klappt, versagt beim kleinsten Sonderfall – erst Testen und Optimieren macht es zuverlässig.",
      html: `<p>Sobald du deinen Entwurf aus dem Struktogramm in einer einfachen <strong>Entwicklungsumgebung</strong> (z. B. mit Blöcken oder Befehlen für die Figur) modelliert und implementiert hast, folgt der entscheidende Schritt: <strong>Testen und Optimieren</strong>.</p>
<ul>
<li><strong>Systematisch testen (Normal- und Randfälle):</strong> Prüfe dein Programm nicht nur an einem Beispiel (z. B. Ganglänge <code>3</code>), sondern auch an <strong>Randfällen</strong> wie Länge <code>0</code> (Hindernis direkt vor der Figur) oder sehr langen Wegen.</li>
<li><strong>Typische Fehler finden:</strong> Verdrehte Reihenfolge in einer Sequenz, verwechselte Grenzoperatoren (<code>&gt;</code> statt <code>≥</code>), vertauschte Bedingung (<code>vorne Hindernis</code> statt <code>vorne frei</code>) oder fehlende Veränderung in einer Schleife (Endlosschleife).</li>
<li><strong>Optimieren:</strong> Überflüssige Befehle streichen (z. B. <code>links drehen · rechts drehen</code> hebt sich auf), sich wiederholende Folgen in einer Schleife bündeln und starre Zahlen durch bedingte Wiederholungen für beliebige Situationen tauglich machen.</li>
</ul>
<div class="example"><strong>Beispiel:</strong> Ein Programm bewegt Karo per <code>vor · vor · vor</code> zur Wand – bei Abstand <code>3</code> sieht alles gut aus. Ein Test mit Abstand <code>0</code> zeigt sofort den Zusammenstoß, Abstand <code>5</code> verfehlt die Wand. Die optimierte Lösung <code>solange vorne frei: vor</code> braucht nur <code>2</code> Bausteine und besteht jeden Testfall!</div>
<div class="merke"><strong>Merke:</strong> Teste Programme immer auch mit <strong>Randfällen</strong> (z. B. 0 oder sehr groß), behebe Logikfehler gezielt und <strong>optimiere</strong> durch Streichen überflüssiger Befehle und Nutzen von Schleifen.</div>`,
      rule: "Testen = Normal- und Randfälle prüfen · Optimieren = Überflüssiges streichen & allgemeine Schleifen nutzen",
      terms: [
        ["Testen mit Randfällen", "Prüfen von Sonder- und Grenzfällen (z. B. Abstand 0, Maximum, Gleichheit)", "Deckt Fehler auf, die beim Standardbeispiel unsichtbar sind"],
        ["Fehlersuche (Debugging)", "Schrittweises Verfolgen, ab welchem Baustein Erwartung und Ist-Wert abweichen", "Hilft bei falscher Reihenfolge, Bedingung oder Endlosschleife"],
        ["Optimieren", "Überflüssige Schritte streichen, Wiederholungen bündeln, allgemein formulieren", "Kürzere, verständlichere und vielseitigere Programme"],
      ],
      quiz: [
        "Warum genügt ein einzelner erfolgreicher Testlauf bei Ganglänge 3 in der Entwicklungsumgebung nicht?",
        "Randfälle wie Länge 0 decken Fehler starrer Abläufe auf",
        "Ganglänge 3 zeigt bei jedem Aufbau alle Fehler anderer Wege",
        "Erst mehrere identische Läufe bei Länge 3 schließen Lücken aus",
        "Erst Tests mit unterschiedlichen Ausgangslagen und Randfällen zeigen, ob die Logik wirklich allgemein stimmt.",
      ],
      lab: debugLab,
      exercises: [
        cases(
          "ms6-debug-fehlerfinden",
          [
            cc(
              "Ein Programm dreht eine Figur zuerst ‚links‘, direkt danach ‚rechts‘ und fährt dann zwei Felder vor. Wie optimierst du es ohne Änderung des Ergebnisses?",
              "Die beiden gegenläufigen Drehungen ‚links · rechts‘ komplett streichen, sodass nur ‚vor · vor‘ bleibt",
              [
                "Am Ende noch ein passendes Paar ‚links · rechts‘ ergänzen",
                "Beide Drehungen durch ‚wiederhole 2-mal: rechts‘ ersetzen",
              ],
              "‚links drehen‘ und ‚rechts drehen‘ heben sich exakt auf – ihr Entfernen macht das Programm kürzer und klarer.",
              "Welche zwei aufeinanderfolgenden Befehle heben ihre Wirkung gegenseitig auf?",
            ),
            cc(
              "Du testest ein Fahr-Programm für einen 4-Felder-Gang und es klappt prima. Was solltest du trotzdem mindestens noch testen?",
              "Einen Randfall wie Ganglänge 0 (Wand direkt voraus) und eine andere Länge wie 6 Felder",
              [
                "Denselben 4-Felder-Gang noch mehrfach nacheinander ohne Änderung testen",
                "Gar nichts weiter, da ein bestandener Standardtest die allgemeine Logik beweist",
              ],
              "Randfälle prüfen die kleinstmögliche (0) und veränderte Größen – genau dort scheitern zu starre Programme.",
              "Welche Testfälle fordern ein Programm neben dem Normalfall heraus?",
            ),
            cc(
              "Eine Figur dreht in einem Testlauf viermal hintereinander nach rechts, bevor sie losfährt. Wie optimierst du diese vier Drehungen?",
              "Alle vier Rechtsdrehungen komplett entfernen, weil 4 · 90 Grad genau wieder die Ausgangsrichtung ergibt",
              [
                "Die vier Rechtsdrehungen durch zwei Linksdrehungen ersetzen",
                "Sie in ‚wiederhole 4-mal: rechts drehen‘ umbauen und stehen lassen",
              ],
              "Eine volle 360-Grad-Drehung am Ort leistet gar nichts – Weglassen spart alle 4 Befehle ein.",
              "Wohin schaut eine Figur nach vier 90-Grad-Drehungen in dieselbe Richtung?",
            ),
          ],
          [
            cc(
              "Für einen Parkplatz-Zähler lautet der Tarif: ‚Ab 60 Minuten wird bezahlt‘. Im Code steht ‚wenn minuten > 60 dann bezahlen‘. Welcher Testfall deckt den versteckten Fehler auf?",
              "Der exakte Grenzwert minuten = 60 (fälschlich gratis statt bezahlt)",
              [
                "minuten = 15 (unter einer Stunde)",
                "minuten = 120 (zwei volle Stunden)",
              ],
              "Bei 15 und 120 stimmen beide Operatoren; genau der Randfall 60 entlarvt den Fehler zwischen ‚>‘ und ‚≥‘.",
              "An welchem exakten Zahlenwert unterscheiden sich ‚> 60‘ und ‚≥ 60‘?",
            ),
            cc(
              "Ein Programm in einer Entwicklungsumgebung schickt Karo auf dem Rückweg viermal im Kreis, weil eine Schleife nie endet. Wie gehst du beim gezielten Fehlersuchen vor?",
              "Das Programm Schritt für Schritt (Einzelschritt-Modus oder Verfolgung) beobachten und prüfen, warum die Schleifenbedingung nie falsch wird",
              [
                "Die äußere Schleife streichen und alle Wege nur als lange starre Sequenz neu schreiben",
                "Die Schleifenbedingung löschen, damit das Programm garantiert weiterläuft",
              ],
              "Schrittweises Beobachten in der Entwicklungsumgebung macht genau die Stelle sichtbar, an der sich der Zustand nicht wie geplant ändert.",
              "Wie findest du heraus, welche Zeile oder Bedingung bei der Schleife hakt?",
            ),
            cc(
              "Ein Mitschüler hat ‚vor · vor · vor · vor · vor · vor‘ programmiert. Eine Schülerin baut denselben Ablauf mit ‚wiederhole 6-mal: vor‘ – und eine dritte ersetzt es für beliebige Wände durch ‚solange vorne frei: vor‘. Wann wählst du ‚solange vorne frei: vor‘?",
              "Immer dann, wenn die Wandentfernung wechseln kann und dieselbe Lösung allgemein für alle Gänge gelten soll",
              [
                "Nur dann, wenn die Ganglänge garantiert dauerhaft bei sechs Feldern bleibt",
                "Nur dann, wenn sechs feste ‚vor‘-Blöcke in der Entwicklungsumgebung zu langsam laufen",
              ],
              "Die bedingte Schleife löst das Problem nicht nur kürzer, sondern auch für unbekannte und wechselnde Ganglängen.",
              "Welche Lösung übersteht auch eine verschobene Wand ohne Umprogrammieren?",
            ),
          ],
        ),
        debugSchritteSparen,
      ],
    }),
  ],
};
