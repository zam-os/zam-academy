import { describe, expect, it } from "vitest";
import {
  COUNT_OPTIONS,
  EXIST_OPTIONS,
  FALL_OPTIONS,
  RANGE_CONTEXTS,
  SCALE_CONTEXTS,
  STAGE_DREIECKE_VIERECKE,
  THEOREM_OPTIONS,
} from "../src/curriculum/stage-1-dreiecke-vierecke";
import { createRng, seedFrom } from "../src/exercises/rng";
import { applyAction, computeReadouts, defaultLabValues, enumerateLabGrid } from "../src/lab/engine";
import { congruenceResult, constructionApexes, constructionSteps, DREIECKE_VIERECKE_VIEWS, existenceTriangle, sideCheck, ssaLengths } from "../src/lab/views-dreiecke-vierecke";
import type { ChoiceField, DifficultyLevel, ExerciseTask, LabDefinition, LabValues } from "../src/model/types";

const IDS = ["dv-1-dreiecksexistenz", "dv-2-dreieckskonstruktion", "dv-3-kongruenz"];

const SEEDS = Array.from({ length: 200 }, (_, i) => seedFrom(`stage-1:${i}`));

const lesson = (id: string) => {
  const found = STAGE_DREIECKE_VIERECKE.lessons.find((l) => l.id === id);
  if (!found) throw new Error(id);
  return found;
};

function tasks(lessonId: string, generatorId: string, level: DifficultyLevel): ExerciseTask[] {
  const generator = lesson(lessonId).exercises.find((e) => e.id === generatorId);
  if (!generator) throw new Error(`${lessonId}/${generatorId}`);
  return SEEDS.map((seed) => generator.make(createRng(seed), level));
}

function num(task: ExerciseTask, index: number): number {
  const field = task.fields[index];
  if (field?.kind !== "number") throw new Error(`field ${index} of ${task.prompt} is no number`);
  return field.answer;
}

function choice(task: ExerciseTask, index: number): ChoiceField {
  const field = task.fields[index];
  if (field?.kind !== "choice") throw new Error(`field ${index} of ${task.prompt} is no choice`);
  return field;
}

/** The text of the right option of a choice field. */
const picked = (task: ExerciseTask, index: number) => choice(task, index).options[choice(task, index).correctIndex];
const meta = (task: ExerciseTask) => task.meta ?? {};
const plain = (html: string) => html.replace(/<[^>]+>/g, " ");

function close(x: number, y: number, eps = 1e-9): void {
  expect(Math.abs(x - y), `${x} ≈ ${y}`).toBeLessThanOrEqual(eps * Math.max(1, Math.abs(y)));
}

/** A German number as written in the tasks: "7,5". */
const parseDe = (s: string) => Number(s.replace("−", "-").replace(/\./g, "").replace(",", "."));

/** The sides and angles named in given lines such as "a = 5 cm" and "α = 40°". */
function parsePieces(lines: string[]): { sides: Record<string, number>; angles: Record<string, number> } {
  const sides: Record<string, number> = {};
  const angles: Record<string, number> = {};
  for (const line of lines) {
    const s = /^([abc]) = ([\d,]+) cm$/.exec(line);
    const w = /^([αβγ]) = (\d+)°$/.exec(line);
    if (s) sides[s[1]] = parseDe(s[2]);
    else if (w) angles[w[1]] = Number(w[2]);
    else throw new Error(`unknown piece ${line}`);
  }
  return { sides, angles };
}

const OPPOSITE: Record<string, string> = { α: "a", β: "b", γ: "c" };

const at = (lab: LabDefinition, values: Partial<LabValues>) => {
  const v = { ...defaultLabValues(lab), ...values } as LabValues;
  return { v, r: computeReadouts(lab, v) };
};

/** Every text of a task a learner reads, without tags. */
const allTexts = (task: ExerciseTask) =>
  [task.prompt, ...task.given, task.formulaHint ?? "", ...task.steps, ...task.fields.flatMap((f) => (f.kind === "number" ? [f.label, ...(f.slips ?? []).map((s) => s.hint)] : [f.label, ...f.options]))]
    .map(plain)
    .join(" \n ");

describe("Etappe 1: Dreiecke und Vierecke", () => {
  it("has its lessons in order, with the Zweige and Lernbereiche of the curriculum", () => {
    expect(STAGE_DREIECKE_VIERECKE.id).toBe("stage-1-dreiecke-vierecke");
    expect(STAGE_DREIECKE_VIERECKE.stageNumber).toBe(1);
    expect(STAGE_DREIECKE_VIERECKE.accent).toBe("#2563eb");
    expect(STAGE_DREIECKE_VIERECKE.lessons.map((l) => l.id)).toEqual(IDS);
    STAGE_DREIECKE_VIERECKE.lessons.forEach((l, index) => {
      expect(l.stepNumber).toBe(index + 1);
      expect(l.title.startsWith(`1.${index + 1} `), l.title).toBe(true);
      const triangles = index < 3;
      expect(l.tracks).toEqual(triangles ? ["II_III"] : ["I", "II_III"]);
      expect(l.lehrplan.startsWith(triangles ? "M8 LB 1 (II/III): " : "M8 LB 1 (I) · M8 LB 1 (II/III): "), l.lehrplan).toBe(true);
      expect(l.lab.goals).toHaveLength(3);
      expect(l.exercises.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("keeps trigonometry, Pythagoras and the Drehung out of the triangle lessons", () => {
    for (const l of STAGE_DREIECKE_VIERECKE.lessons) {
      const text = plain([l.explanationHtml, l.whyItMatters, l.quiz.question, ...l.quiz.options, l.quiz.explanation, l.lab.intro, ...l.lab.goals.map((g) => g.text), ...l.formulas.map((f) => `${f.html} ${f.quantities}`)].join(" "));
      expect(text, l.id).not.toMatch(/\b(sin|cos|tan)\b|Sinus|Kosinus|Pythagoras|Hypotenuse|Kathete|ℝ|Parabel|Strahlensatz/);
      if (l.tracks.length === 1) expect(text, `${l.id}: Zweig II/III does not know the Drehung`).not.toMatch(/Drehung|drehen|Punktspiegelung/);
    }
  });

  it("writes tasks without programmer notation, doubled steps, hyphens as minus or decimal points", () => {
    for (const l of STAGE_DREIECKE_VIERECKE.lessons) {
      for (const g of l.exercises) {
        for (const level of [1, 2] as const) {
          for (const task of tasks(l.id, g.id, level)) {
            const text = allTexts(task);
            expect(text, `${l.id}/${g.id}`).not.toMatch(/[a-z]_[A-Za-z]|\\|NaN|undefined/);
            expect(text, `${l.id}/${g.id}: trigonometry`).not.toMatch(/\b(sin|cos|tan)\b|Pythagoras/);
            expect(text, `${l.id}/${g.id}: hyphen as minus`).not.toMatch(/(^|[\s(=:|,{±;[\]])-\d/);
            expect(text, `${l.id}/${g.id}: decimal point`).not.toMatch(/\d\.(\d{1,2}|\d{4,})(?!\d)/);
            expect(text, `${l.id}/${g.id}: negative angle or length`).not.toMatch(/= −\d/);
            if (l.tracks.length === 1) expect(text, `${l.id}/${g.id}: Drehung`).not.toMatch(/Drehung|drehen/);
          }
        }
      }
    }
  });
});

describe("Aufgaben der Etappe 1 rechnen richtig", () => {
  it("1.1 three sides: the sum of the two shorter ones and the verdict; all three verdicts occur", () => {
    const seen = [0, 0, 0];
    for (const task of tasks("dv-1-dreiecksexistenz", "existenz", 1)) {
      const { a, b, c } = meta(task);
      const sorted = [a, b, c].sort((x, y) => x - y);
      const sum = sorted[0] + sorted[1];
      close(num(task, 0), sum);
      const verdict = sum > sorted[2] + 1e-9 ? 0 : sum < sorted[2] - 1e-9 ? 1 : 2;
      expect(picked(task, 1)).toBe(EXIST_OPTIONS[verdict]);
      seen[verdict] += 1;
      for (const s of [a, b, c]) expect(s).toBeGreaterThanOrEqual(1);
    }
    expect(seen.every((n) => n >= 30), `${seen}`).toBe(true);
  });

  it("1.1 the range of a third side: counted by trying every whole length", () => {
    const contexts = [0, 0, 0];
    for (const task of tasks("dv-1-dreiecksexistenz", "existenz", 2)) {
      const { p, q, ctx } = meta(task);
      contexts[ctx] += 1;
      const fits = Array.from({ length: 40 }, (_, n) => n).filter((n) => n > 0 && sideCheck(p, q, n).meet === "two");
      expect(num(task, 0)).toBe(Math.min(...fits));
      expect(num(task, 1)).toBe(Math.max(...fits));
      expect(num(task, 2)).toBe(fits.length);
      expect(task.fields[0].label).toBe(RANGE_CONTEXTS[ctx].labels[0]);
      expect(p).toBeLessThan(q);
    }
    expect(contexts.every((n) => n > 40), `${contexts}`).toBe(true);
  });

  it("1.1 two angles: the third from the Winkelsumme and the longest side opposite the largest angle", () => {
    for (const task of tasks("dv-1-dreiecksexistenz", "seiten-winkel", 1)) {
      const { alpha, beta, gamma, missing } = meta(task);
      expect(alpha + beta + gamma).toBe(180);
      expect(Math.min(alpha, beta, gamma)).toBeGreaterThanOrEqual(15);
      expect(num(task, 0)).toBe([alpha, beta, gamma][missing]);
      const largest = [alpha, beta, gamma].indexOf(Math.max(alpha, beta, gamma));
      expect(picked(task, 1).charAt(0)).toBe("abc"[largest]);
      // the shown angles are the other two
      expect(task.given.join(" ")).not.toContain(`${"αβγ"[missing]} =`);
    }
    const contexts = [0, 0, 0];
    for (const task of tasks("dv-1-dreiecksexistenz", "seiten-winkel", 2)) {
      const m = meta(task);
      contexts[m.ctx] += 1;
      if (m.ctx === 0) {
        expect(m.phi).not.toBe(60);
        expect(num(task, 0)).toBe(180 - 2 * m.phi);
        // the base lies opposite the top angle: longer exactly when the top angle is larger than a base angle
        expect(picked(task, 1)).toBe(180 - 2 * m.phi > m.phi ? "länger als eine Dachschräge" : "kürzer als eine Dachschräge");
      } else if (m.ctx === 1) {
        const z = 180 - m.x - m.y;
        expect(z).toBeGreaterThanOrEqual(20);
        expect(num(task, 0)).toBe(z);
        const largest = [m.x, m.y, z].indexOf(Math.max(m.x, m.y, z));
        expect(picked(task, 1)).toBe(["[BC]", "[CA]", "[AB]"][largest]);
      } else {
        expect(m.x + m.y).toBeGreaterThanOrEqual(180);
        expect(num(task, 0)).toBe(m.x + m.y);
        expect(picked(task, 1)).toContain("gibt es nicht");
      }
    }
    expect(contexts.every((n) => n > 30), `${contexts}`).toBe(true);
  });

  it("1.2 the case of three pieces, recomputed from the given lines", () => {
    const kinds = [0, 0, 0, 0, 0];
    let none = 0;
    for (const task of tasks("dv-2-dreieckskonstruktion", "fall", 1)) {
      const { sides, angles } = parsePieces(task.given);
      const sideNames = Object.keys(sides);
      const angleNames = Object.keys(angles);
      let kind: number;
      let exists: boolean;
      let missing = Number.NaN;
      if (sideNames.length === 3) {
        kind = 0;
        exists = sideCheck(sides.a, sides.b, sides.c).meet === "two";
      } else if (sideNames.length === 2) {
        const opposite = OPPOSITE[angleNames[0]];
        if (!sideNames.includes(opposite)) kind = 1;
        else {
          const other = sideNames.find((s) => s !== opposite)!;
          expect(sides[opposite], "the angle lies opposite the longer side").toBeGreaterThan(sides[other]);
          kind = 4;
        }
        exists = true;
      } else {
        const sum = angles[angleNames[0]] + angles[angleNames[1]];
        exists = sum < 180;
        kind = angleNames.some((w) => OPPOSITE[w] === sideNames[0]) ? 3 : 2;
        if (kind === 3 && exists) missing = 180 - sum;
      }
      expect(picked(task, 0)).toBe(FALL_OPTIONS[kind]);
      expect(picked(task, 1)).toBe(COUNT_OPTIONS[exists ? 0 : 1]);
      if (Number.isNaN(missing)) expect(task.fields).toHaveLength(2);
      else expect(num(task, 2)).toBe(missing);
      kinds[kind] += 1;
      if (!exists) none += 1;
    }
    expect(kinds.every((n) => n > 20), `${kinds}`).toBe(true);
    expect(none).toBeGreaterThan(20);
    expect(none).toBeLessThan(90);
  });

  it("1.2 a side and two angles in a real situation: the case, the missing angle and the length on paper", () => {
    for (const task of tasks("dv-2-dreieckskonstruktion", "fall", 2)) {
      const { ctx, L, x, y, angle, drawn } = meta(task);
      const c = SCALE_CONTEXTS[ctx];
      expect(picked(task, 0)).toBe(FALL_OPTIONS[c.kind]);
      expect(angle).toBe(180 - x - y);
      expect(num(task, 1)).toBe(180 - x - y);
      expect(angle).toBeGreaterThanOrEqual(30);
      const real = c.unit === "km" ? L * 100000 : L * 100;
      close(num(task, 2), real / c.scale);
      close(drawn, real / c.scale);
      expect(drawn).toBeGreaterThanOrEqual(3);
      expect(drawn).toBeLessThanOrEqual(10);
      expect(Math.abs(drawn * 10 - Math.round(drawn * 10))).toBeLessThan(1e-9);
    }
  });

  it("1.2 the next two construction steps are the ones of the Konstruktionsbeschreibung", () => {
    const falls = [0, 0, 0, 0];
    for (const task of tasks("dv-2-dreieckskonstruktion", "schritt", 1)) {
      const m = meta(task);
      const v = { fall: m.fall, a: m.a, b: m.b, c: m.c, alpha: m.alpha, beta: m.beta, step: 4 };
      falls[m.fall] += 1;
      expect(constructionApexes(v)).toHaveLength(1);
      const steps = constructionSteps(v);
      expect(task.given).toEqual([`1. ${steps[0]}`, `2. ${steps[1]}`]);
      expect(picked(task, 0)).toBe(steps[2]);
      expect(picked(task, 1)).toBe(steps[3]);
      for (const i of [0, 1]) {
        expect(choice(task, i).options).toHaveLength(3);
        expect(new Set(choice(task, i).options).size).toBe(3);
      }
    }
    expect(falls.every((n) => n > 30), `${falls}`).toBe(true);
  });

  it("1.2 SsW conditions: obtuse angles need the longest side, two solutions only opposite the shorter side", () => {
    const variants = [0, 0, 0];
    for (const task of tasks("dv-2-dreieckskonstruktion", "schritt", 2)) {
      const m = meta(task);
      variants[m.variant] += 1;
      if (m.variant === 0) {
        expect(m.alpha).toBeGreaterThanOrEqual(90);
        const aMin = num(task, 0);
        expect(Number.isInteger(aMin)).toBe(true);
        expect(ssaLengths(m.c, aMin, m.alpha)).toHaveLength(1);
        expect(ssaLengths(m.c, aMin - 1, m.alpha)).toHaveLength(0);
        expect(picked(task, 1)).toBe("genau eines");
      } else if (m.variant === 1) {
        expect(m.a).toBeLessThan(m.c);
        expect(ssaLengths(m.c, m.a, m.alpha)).toHaveLength(2);
        expect(picked(task, 0)).toContain("Zwei Dreiecke sind möglich");
      } else {
        expect(m.a).toBeGreaterThan(m.c);
        expect(ssaLengths(m.c, m.a, m.alpha)).toHaveLength(1);
        expect(num(task, 0)).toBe(1);
      }
    }
    expect(variants.every((n) => n > 40), `${variants}`).toBe(true);
  });

  it("1.3 which theorem: recomputed from the given equal pieces", () => {
    const answers = [0, 0, 0, 0, 0];
    for (const task of tasks("dv-3-kongruenz", "satz", 1)) {
      const sides: Record<string, number> = {};
      const angles: string[] = [];
      for (const line of task.given) {
        const s = /^([A-C]{2}) = ([D-F]{2}) = ([\d,]+) cm$/.exec(line);
        const w = /^∢([A-C])([A-C])([A-C]) = ∢([D-F])([D-F])([D-F]) = (\d+)°$/.exec(line);
        if (s) {
          // the correspondence A ↦ D, B ↦ E, C ↦ F
          expect(s[2]).toBe(s[1].replace("A", "D").replace("B", "E").replace("C", "F"));
          sides[s[1]] = parseDe(s[3]);
        } else if (w) {
          expect(w.slice(4, 7).join("")).toBe(w.slice(1, 4).join("").replace(/A/g, "D").replace(/B/g, "E").replace(/C/g, "F"));
          angles.push(w[2]);
        } else throw new Error(line);
      }
      const names = Object.keys(sides);
      let expected: number;
      if (names.length === 3) expected = 0;
      else if (angles.length === 3) expected = 4;
      else if (names.length === 1) expected = 2;
      else {
        const vertex = angles[0];
        if (names.every((n) => n.includes(vertex))) expected = 1;
        else {
          const opposite = names.find((n) => !n.includes(vertex))!;
          const other = names.find((n) => n !== opposite)!;
          expected = sides[opposite] > sides[other] ? 3 : 4;
        }
      }
      expect(picked(task, 0), task.given.join("; ")).toBe(THEOREM_OPTIONS[expected]);
      answers[expected] += 1;
      if (expected === 4) expect(picked(task, 1)).toBe(angles.length === 3 ? "Gleiche Winkel legen die Größe nicht fest." : "Der Winkel liegt der kürzeren Seite gegenüber.");
      else {
        // the second question names the corresponding piece: replace A, B, C by D, E, F
        const label = plain(choice(task, 1).label);
        const piece = /(\[[A-C]{2}\]|∢[A-C]{3})/.exec(label)![1];
        expect(picked(task, 1)).toBe(piece.replace(/A/g, "D").replace(/B/g, "E").replace(/C/g, "F"));
      }
    }
    expect(answers.every((n) => n > 15), `${answers}`).toBe(true);
  });

  it("1.3 theorems in figures and what follows from them", () => {
    const expected = [0, 0, 0, 1, 1, 2];
    const contexts = [0, 0, 0, 0, 0, 0];
    for (const task of tasks("dv-3-kongruenz", "satz", 2)) {
      const m = meta(task);
      contexts[m.ctx] += 1;
      expect(choice(task, 0).correctIndex).toBe(expected[m.ctx]);
      const value = [m.x, 2 * m.y, m.gamma / 2, m.s, m.d, m.w][m.ctx];
      close(num(task, 1), value);
      if (m.ctx === 0) expect(m.x).not.toBe(90);
      if (m.ctx === 2) expect(m.gamma % 2).toBe(0);
    }
    expect(contexts.every((n) => n > 15), `${contexts}`).toBe(true);
  });

  it("1.3 missing pieces of congruent triangles, with any correspondence and inside figures", () => {
    for (const task of tasks("dv-3-kongruenz", "stuecke", 1)) {
      const m = meta(task);
      const perm = [m.p0, m.p1, m.p2];
      expect(new Set(perm).size).toBe(3);
      expect(perm).not.toEqual([0, 1, 2]);
      const img = (i: number) => "DEF"[perm[i]];
      const side = [img(0), img(1)].sort().join("");
      expect(plain(task.fields[0].label)).toContain(side);
      close(num(task, 0), m.ab);
      expect(plain(task.fields[1].label)).toBe(`∢${img(0)}${img(2)}${img(1)} =`);
      expect(num(task, 1)).toBe(180 - m.alpha - m.beta);
    }
    for (const task of tasks("dv-3-kongruenz", "stuecke", 2)) {
      const m = meta(task);
      if (m.ctx === 0) {
        // kite: the angles add up to 360° and the kite is convex
        expect(num(task, 0)).toBe(m.y);
        expect(num(task, 1)).toBe(2 * (180 - m.x - m.y));
        expect(2 * m.x + 2 * m.y + num(task, 1)).toBe(360);
        expect(num(task, 1)).toBeLessThan(180);
        expect(2 * m.x).toBeLessThan(180);
      } else if (m.ctx === 1) {
        expect(num(task, 0)).toBe(180 - m.x - m.y);
        expect(num(task, 1)).toBe(m.x + m.y);
      } else if (m.ctx === 2) {
        close(num(task, 0), m.s);
        expect(num(task, 1)).toBe(180 - m.x - m.z);
      } else {
        expect(num(task, 0)).toBe(m.gamma / 2);
        expect(num(task, 1)).toBe((180 - m.gamma) / 2);
      }
    }
  });
});

describe("Labore der Etappe 1 zeigen das Richtige", () => {
  it("1.1 the compass test: circles meet, touch or miss; a 3-4-5 triangle has a right angle", () => {
    const lab = lesson("dv-1-dreiecksexistenz").lab;
    expect(at(lab, {}).r.dreieck).toContain("nein: Summe kleiner");
    expect(at(lab, { a: 5, b: 3, c: 8 }).r.dreieck).toContain("gleich");
    const right = existenceTriangle({ ...defaultLabValues(lab), a: 3, b: 4, c: 5 })!;
    close(right.gamma, 90, 1e-9);
    expect(at(lab, { a: 3, b: 4, c: 5 }).r.gegenueber).toContain("γ gegenüber der längsten Seite c");
    expect(at(lab, { a: 5, b: 5, c: 5 }).r.gegenueber).toContain("60°");
    expect(at(lab, { view: 1, alpha: 70, beta: 60 }).r.winkel).toBe("γ = 180° − α − β = 50°");
    expect(at(lab, { view: 1, alpha: 100, beta: 80 }).r.dreieck).toContain("parallel");
  });

  it("1.2 the construction ends with none, one or two apexes, as the theory says", () => {
    const base = { a: 5, b: 4, c: 6, alpha: 50, beta: 60, step: 4 };
    expect(constructionApexes({ ...base, fall: 3, c: 7, a: 5, alpha: 40 })).toHaveLength(2);
    expect(constructionApexes({ ...base, fall: 3, c: 5, a: 7, alpha: 40 })).toHaveLength(1);
    expect(constructionApexes({ ...base, fall: 3, c: 6, a: 3, alpha: 30 })).toHaveLength(1); // the circle touches the leg
    expect(constructionApexes({ ...base, fall: 3, c: 6, a: 6, alpha: 100 })).toHaveLength(0);
    expect(constructionApexes({ ...base, fall: 0, a: 3, b: 4, c: 8 })).toHaveLength(0);
    expect(constructionApexes({ ...base, fall: 2, alpha: 100, beta: 80 })).toHaveLength(0);
    // SSS with 3, 4 and 5: C lies right above A
    const [C] = constructionApexes({ ...base, fall: 0, a: 5, b: 3, c: 4 });
    close(C.x, 0, 1e-9);
    close(C.y, 3, 1e-9);
  });

  it("1.2 draws every step of every case cleanly, and the buttons walk the steps", () => {
    const lab = lesson("dv-2-dreieckskonstruktion").lab;
    const view = DREIECKE_VIERECKE_VIEWS["triangle-construction"];
    for (const values of enumerateLabGrid(lab, 4)) {
      for (let step = 0; step <= 4; step++) {
        const v = { ...values, step };
        const svg = view.render(v, computeReadouts(lab, v));
        expect(svg, JSON.stringify(v)).not.toMatch(/NaN|undefined|Infinity/);
      }
    }
    let v = defaultLabValues(lab);
    for (let i = 0; i < 6; i++) v = applyAction(lab, v, "weiter");
    expect(v.step).toBe(4);
    v = applyAction(lab, v, "zurueck");
    expect(v.step).toBe(3);
    expect(applyAction(lab, v, "neu").step).toBe(0);
  });

  it("1.3 the congruence lab: SsW, the angle opposite the shorter side, WWW", () => {
    const lab = lesson("dv-3-kongruenz").lab;
    expect(congruenceResult({ ...defaultLabValues(lab), art: 3, c: 7, a: 5, alpha: 40 }).count).toBe("zwei");
    expect(congruenceResult({ ...defaultLabValues(lab), art: 3, c: 5, a: 7, alpha: 40 }).theorem).toBe("SsW");
    expect(congruenceResult({ ...defaultLabValues(lab), art: 3, c: 6, a: 3, alpha: 30 }).count).toBe("eins");
    expect(congruenceResult({ ...defaultLabValues(lab), art: 3, c: 6, a: 3, alpha: 30 }).theorem).toBe("");
    expect(at(lab, { art: 4 }).r.anzahl).toBe("unendlich viele verschiedene Größen");
    expect(at(lab, { art: 4, alpha: 100, beta: 80 }).r.anzahl).toBe("keines");
    expect(at(lab, { art: 2, alpha: 50, beta: 60 }).r.stuecke).toContain("γ = 70°");
  });
});
