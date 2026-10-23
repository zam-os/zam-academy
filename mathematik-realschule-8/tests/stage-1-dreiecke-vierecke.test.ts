import { describe, expect, it } from "vitest";
import {
  COMBOS,
  CONGRUENCE_REASONS,
  COUNT_OPTIONS,
  EXIST_OPTIONS,
  FALL_OPTIONS,
  PIECE_CASES,
  PLAN_CASES,
  QUAD_AXES,
  QUAD_NEIGHBOURS,
  RANGE_CONTEXTS,
  SCALE_CONTEXTS,
  STAGE_DREIECKE_VIERECKE,
  STATEMENTS,
  THEOREM_OPTIONS,
} from "../src/curriculum/stage-1-dreiecke-vierecke";
import { createRng, seedFrom } from "../src/exercises/rng";
import { applyAction, computeReadouts, defaultLabValues, enumerateLabGrid } from "../src/lab/engine";
import {
  congruenceResult,
  constructionApexes,
  constructionSteps,
  DREIECKE_VIERECKE_VIEWS,
  existenceTriangle,
  FREEHAND_START,
  familyPoints,
  problemAngles,
  problemArea,
  quadAngles,
  type QuadInfo,
  quadInfo,
  redrawFreehand,
  sideCheck,
  ssaLengths,
  wswApex,
  zugConstructed,
  zugKeeps,
  zugPoints,
} from "../src/lab/views-dreiecke-vierecke";
import type { ChoiceField, DifficultyLevel, ExerciseTask, LabDefinition, LabValues } from "../src/model/types";

const IDS = ["dv-1-dreiecksexistenz", "dv-2-dreieckskonstruktion", "dv-3-kongruenz", "dv-4-vierecke", "dv-5-viereckskonstruktion", "dv-6-vierecke-anwenden"];

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
/** A German number as fmt() writes it, for comparing with texts. */
const de = (x: number) => new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format(x).replace("-", "−");

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
            expect(text, `${l.id}/${g.id}: negative angle or length`).not.toMatch(/= −[\d,]+ ?(°|cm|m\b|dm|km)/);
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
    const possible = [0, 0];
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
        expect(num(task, 0)).toBe(m.x + m.y);
        if (m.x + m.y >= 180) {
          expect(picked(task, 1)).toContain("gibt es nicht");
          possible[1] += 1;
        } else {
          expect(picked(task, 1)).toBe(`Das Beet gibt es: Für den Winkel bei C bleiben ${180 - m.x - m.y}° übrig.`);
          expect(180 - m.x - m.y).toBeGreaterThanOrEqual(5);
          possible[0] += 1;
        }
      }
    }
    expect(contexts.every((n) => n > 30), `${contexts}`).toBe(true);
    // plans to check: both verdicts occur, so "prüfe" gives nothing away
    expect(Math.min(...possible), `${possible}`).toBeGreaterThan(15);
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
      }
      expect(picked(task, 0)).toBe(FALL_OPTIONS[kind]);
      expect(picked(task, 1)).toBe(COUNT_OPTIONS[exists ? 0 : 1]);
      // the same two questions in every case: no extra field gives the case away
      expect(task.fields).toHaveLength(2);
      kinds[kind] += 1;
      if (!exists) none += 1;
    }
    expect(kinds.every((n) => n > 20), `${kinds}`).toBe(true);
    expect(none).toBeGreaterThan(20);
    expect(none).toBeLessThan(90);
  });

  it("1.2 a side and two angles in a real situation: the case, the missing angle and the length on paper", () => {
    const seen = new Set<string>();
    for (const task of tasks("dv-2-dreieckskonstruktion", "fall", 2)) {
      const { ctx, L, x, y, angle, drawn } = meta(task);
      const c = SCALE_CONTEXTS[ctx];
      // the case from the given angles: the second one at B (WSW) or at C (SWW)
      const atB = task.given.some((g) => g.startsWith("∢CBA"));
      const atC = task.given.some((g) => g.startsWith("∢ACB"));
      expect(atB !== atC).toBe(true);
      expect(picked(task, 0)).toBe(atB ? "WSW" : "SWW");
      seen.add(`${ctx}:${atB ? "WSW" : "SWW"}`);
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
    // every context with both cases, so that the context does not give the case away
    expect(seen.size).toBe(6);
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
    const variants = [0, 0];
    const claims = [0, 0];
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
      } else {
        // the claim "two triangles" is right exactly when the construction gives two
        const count = ssaLengths(m.c, m.a, m.alpha).length;
        expect(count).toBe(m.two ? 2 : 1);
        expect(picked(task, 0).startsWith(count === 2 ? "Das ist möglich" : "Das geht nicht")).toBe(true);
        expect(picked(task, 1)).toBe(m.a < m.c ? "der kürzeren der beiden Seiten" : "der längeren der beiden Seiten");
        claims[m.two] += 1;
      }
    }
    expect(variants.every((n) => n > 40), `${variants}`).toBe(true);
    expect(claims.every((n) => n > 25), `${claims}`).toBe(true);
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
      // the case: 0 SSS, 1 SWS, 2 WSW, 3 SWW, 4 SsW, 5 SSW (angle opposite the shorter side), 6 WWW
      let kind: number;
      if (names.length === 3) kind = 0;
      else if (angles.length === 3) kind = 6;
      else if (names.length === 1) kind = angles.every((vertex) => names[0].includes(vertex)) ? 2 : 3;
      else {
        const vertex = angles[0];
        if (names.every((n) => n.includes(vertex))) kind = 1;
        else {
          const opposite = names.find((n) => !n.includes(vertex))!;
          const other = names.find((n) => n !== opposite)!;
          kind = sides[opposite] > sides[other] ? 4 : 5;
        }
      }
      const expected = [0, 1, 2, 2, 3, 4, 4][kind];
      expect(picked(task, 0), task.given.join("; ")).toBe(THEOREM_OPTIONS[expected]);
      expect(picked(task, 1), task.given.join("; ")).toBe(CONGRUENCE_REASONS[kind]);
      // the reasons offered mix both kinds, so the second question gives nothing away
      expect(choice(task, 1).options).toHaveLength(4);
      expect(task.fields).toHaveLength(2);
      answers[expected] += 1;
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

// ─── Vierecke ──────────────────────────────────────────────────────────────

type P2 = { x: number; y: number };
const RADIANS = Math.PI / 180;
const dir = (r: number, degrees: number): P2 => ({ x: r * Math.cos(degrees * RADIANS), y: r * Math.sin(degrees * RADIANS) });
const plus = (p: P2, q: P2): P2 => ({ x: p.x + q.x, y: p.y + q.y });
const minus = (p: P2, q: P2): P2 => ({ x: p.x - q.x, y: p.y - q.y });

/** The angle at q between the rays to p and r, in degrees. */
function angleAt(p: P2, q: P2, r: P2): number {
  const u = minus(p, q);
  const w = minus(r, q);
  return Math.acos((u.x * w.x + u.y * w.y) / Math.hypot(u.x, u.y) / Math.hypot(w.x, w.y)) / RADIANS;
}

/** The names of the Haus der Vierecke as predicates on the lab's classification. */
const is: Record<string, (q: QuadInfo) => boolean> = {
  Trapez: (q) => q.simple && (q.par[0] || q.par[1]),
  Parallelogramm: (q) => q.simple && q.par[0] && q.par[1],
  Rechteck: (q) => q.simple && q.par[0] && q.par[1] && q.right[0],
  Raute: (q) => q.simple && q.allEqual,
  Quadrat: (q) => q.simple && q.allEqual && q.right[0],
  Drachenviereck: (q) => q.simple && (q.axes.includes("AC") || q.axes.includes("BD")),
  "gleichschenkliges Trapez": (q) => q.simple && (q.par[0] || q.par[1]) && q.axes.some((a) => a.includes("|")),
};

/** Every convex quadrilateral with vertices on the grid 0 … 4, counterclockwise. */
const LATTICE: QuadInfo[] = (() => {
  const pts: P2[] = [];
  for (let x = 0; x <= 4; x++) for (let y = 0; y <= 4; y++) pts.push({ x, y });
  const out: QuadInfo[] = [];
  for (const A of pts)
    for (const B of pts)
      for (const C of pts)
        for (const D of pts) {
          const turn = (p: P2, q: P2, r: P2) => (q.x - p.x) * (r.y - q.y) - (q.y - p.y) * (r.x - q.x);
          if (turn(A, B, C) <= 0 || turn(B, C, D) <= 0 || turn(C, D, A) <= 0 || turn(D, A, B) <= 0) continue;
          const info = quadInfo([A, B, C, D]);
          if (info.convex) out.push(info);
        }
  return out;
})();

/** The statements of 1.4 in logic: subject and claim. */
const STATEMENT_LOGIC: Record<string, [(q: QuadInfo) => boolean, (q: QuadInfo) => boolean]> = {
  "Jedes Quadrat ist ein Rechteck.": [is.Quadrat, is.Rechteck],
  "Jedes Rechteck ist ein Quadrat.": [is.Rechteck, is.Quadrat],
  "Jede Raute ist ein Parallelogramm.": [is.Raute, is.Parallelogramm],
  "Jedes Parallelogramm ist eine Raute.": [is.Parallelogramm, is.Raute],
  "Jede Raute ist ein Drachenviereck.": [is.Raute, is.Drachenviereck],
  "Jedes Drachenviereck ist eine Raute.": [is.Drachenviereck, is.Raute],
  "Jedes Rechteck ist ein gleichschenkliges Trapez.": [is.Rechteck, is["gleichschenkliges Trapez"]],
  "Jedes Parallelogramm ist ein Trapez.": [is.Parallelogramm, is.Trapez],
  "Jedes Trapez ist ein Parallelogramm.": [is.Trapez, is.Parallelogramm],
  "Jedes Quadrat ist eine Raute.": [is.Quadrat, is.Raute],
  "Jede Raute ist ein Quadrat.": [is.Raute, is.Quadrat],
  "Jedes gleichschenklige Trapez ist ein Rechteck.": [is["gleichschenkliges Trapez"], is.Rechteck],
  "Die Diagonalen jedes Rechtecks sind gleich lang.": [is.Rechteck, (q) => q.diagEqual],
  "Die Diagonalen jedes Rechtecks stehen senkrecht aufeinander.": [is.Rechteck, (q) => q.diagPerp],
  "Die Diagonalen jeder Raute stehen senkrecht aufeinander.": [is.Raute, (q) => q.diagPerp],
  "Die Diagonalen jedes Parallelogramms halbieren sich.": [is.Parallelogramm, (q) => q.diagBisect],
  "Die Diagonalen jedes Parallelogramms sind gleich lang.": [is.Parallelogramm, (q) => q.diagEqual],
  "Jedes Parallelogramm ist achsensymmetrisch.": [is.Parallelogramm, (q) => q.axes.length > 0],
  "Jedes Drachenviereck hat zueinander senkrechte Diagonalen.": [is.Drachenviereck, (q) => q.diagPerp],
  "In jedem gleichschenkligen Trapez sind die Diagonalen gleich lang.": [is["gleichschenkliges Trapez"], (q) => q.diagEqual],
  "Jedes Quadrat ist ein Drachenviereck.": [is.Quadrat, is.Drachenviereck],
  "Jedes Trapez hat eine Symmetrieachse.": [is.Trapez, (q) => q.axes.length > 0],
};

/** The "zugleich" combinations of 1.4 in logic. */
const COMBO_LOGIC: Record<string, (q: QuadInfo) => boolean> = {
  "zugleich ein Drachenviereck und ein Trapez": (q) => is.Drachenviereck(q) && is.Trapez(q),
  "zugleich ein Drachenviereck und ein Parallelogramm": (q) => is.Drachenviereck(q) && is.Parallelogramm(q),
  "zugleich ein Drachenviereck und ein Rechteck": (q) => is.Drachenviereck(q) && is.Rechteck(q),
  "zugleich eine Raute und ein Rechteck": (q) => is.Raute(q) && is.Rechteck(q),
  "zugleich ein gleichschenkliges Trapez und ein Parallelogramm": (q) => is["gleichschenkliges Trapez"](q) && is.Parallelogramm(q),
  "zugleich eine Raute und ein gleichschenkliges Trapez": (q) => is.Raute(q) && is["gleichschenkliges Trapez"](q),
  "ein Parallelogramm mit einem rechten Winkel": (q) => is.Parallelogramm(q) && q.right.some(Boolean),
  "ein Parallelogramm mit zueinander senkrechten Diagonalen": (q) => is.Parallelogramm(q) && q.diagPerp,
  "ein Parallelogramm mit gleich langen Diagonalen": (q) => is.Parallelogramm(q) && q.diagEqual,
  "ein Rechteck mit zueinander senkrechten Diagonalen": (q) => is.Rechteck(q) && q.diagPerp,
  "eine Raute mit gleich langen Diagonalen": (q) => is.Raute(q) && q.diagEqual,
  "ein Drachenviereck, dessen Diagonalen sich gegenseitig halbieren": (q) => is.Drachenviereck(q) && q.diagBisect,
  "ein Trapez mit einer Symmetrieachse durch die Mitten der parallelen Seiten": (q) => is.Trapez(q) && q.axes.some((a) => a.includes("|")),
  "ein Trapez, dessen Diagonalen sich gegenseitig halbieren": (q) => is.Trapez(q) && q.diagBisect,
};

/** The quadrilateral a property description of 1.4, Level 1 describes, built with these numbers. */
function buildFromProperties(kind: number, s: number, t: number, phi: number, psi: number): P2[] {
  const O = { x: 0, y: 0 };
  if (kind === 0) return [O, { x: s, y: 0 }, plus({ x: s, y: 0 }, dir(s, phi)), dir(s, phi)];
  if (kind === 1) return [O, { x: s, y: 0 }, { x: s, y: t }, { x: 0, y: t }];
  if (kind === 2) return [O, { x: s, y: 0 }, { x: s, y: s }, { x: 0, y: s }];
  if (kind === 3) return [O, { x: s, y: 0 }, plus({ x: s, y: 0 }, dir(t, phi)), dir(t, phi)];
  if (kind === 4) {
    const d = 3;
    const L = 2 * d * Math.cos(phi * RADIANS) + 4;
    return [O, { x: L, y: 0 }, { x: L - d * Math.cos(phi * RADIANS), y: d * Math.sin(phi * RADIANS) }, dir(d, phi)];
  }
  if (kind === 5) {
    const h = 3;
    const L = 12;
    return [O, { x: L, y: 0 }, { x: L - h / Math.tan(psi * RADIANS), y: h }, { x: h / Math.tan(phi * RADIANS), y: h }];
  }
  const e = (Math.abs(s - t) + s + t) / 2;
  const x = (s * s - t * t + e * e) / (2 * e);
  const y = Math.sqrt(s * s - x * x);
  return [O, { x, y: -y }, { x: e, y: 0 }, { x, y }];
}

/** The quadrilateral two sticks of 1.4, Level 2 describe; an angle of 65° where the text says "not right". */
function buildFromDiagonals(kind: number, p: number, q: number, u: number, w: number): P2[] {
  const long = Math.max(p, q);
  const short = Math.min(p, q);
  const sticks = (a1: number, a2: number, b1: number, b2: number, theta: number): P2[] => {
    const d2 = dir(1, theta);
    return [{ x: -a1, y: 0 }, { x: -b1 * d2.x, y: -b1 * d2.y }, { x: a2, y: 0 }, { x: b2 * d2.x, y: b2 * d2.y }];
  };
  if (kind === 0 || kind === 5) return sticks(p / 2, p / 2, p / 2, p / 2, 65);
  if (kind === 1) return [{ x: 0, y: 0 }, { x: 0.3 * long, y: -short / 2 }, { x: long, y: 0 }, { x: 0.3 * long, y: short / 2 }];
  if (kind === 2) return sticks(p / 2, p / 2, p / 2, p / 2, 90);
  if (kind === 3) return sticks(long / 2, long / 2, short / 2, short / 2, 90);
  if (kind === 4) return sticks(long / 2, long / 2, short / 2, short / 2, 65);
  return sticks(u, w, u, w, 65);
}

/** The pieces of given lines such as "a = 6 cm", "α = 70°", "∢BAC = 30°". */
function quadPieces(lines: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const line of lines) {
    const m = /^([a-hα-δ]|∢BAC) = ([\d,]+)(?: cm|°)$/.exec(line);
    if (!m) throw new Error(`unknown piece ${line}`);
    out[m[1]] = parseDe(m[2]);
  }
  return out;
}

const pointOf = (text: string, name: string): P2 => {
  const m = new RegExp(`${name}\\(([−\\d,]+) \\| ([−\\d,]+)\\)`).exec(text);
  if (!m) throw new Error(`no ${name} in ${text}`);
  return { x: parseDe(m[1]), y: parseDe(m[2]) };
};

describe("Aufgaben zu den Vierecken rechnen richtig", () => {
  it("1.4 the lab's classifier knows every special quadrilateral, the dart and the crossed one", () => {
    const name = (pts: number[][]) => quadInfo(pts.map(([x, y]) => ({ x, y }))).name;
    expect(name([[0, 0], [4, 0], [4, 4], [0, 4]])).toBe("Quadrat");
    expect(name([[0, 0], [5, 0], [5, 2], [0, 2]])).toBe("Rechteck");
    expect(name([[0, 0], [2, 1], [3, 3], [1, 2]])).toBe("Raute");
    expect(name([[0, 0], [4, 0], [5, 2], [1, 2]])).toBe("Parallelogramm");
    expect(name([[0, 0], [6, 0], [4, 3], [2, 3]])).toBe("gleichschenkliges Trapez");
    expect(name([[0, 0], [6, 0], [5, 3], [2, 3]])).toBe("Trapez");
    expect(name([[0, 2], [2, 0], [7, 2], [2, 4]])).toBe("Drachenviereck");
    expect(name([[0, 2], [5, 0], [2, 2], [5, 4]])).toBe("Drachenviereck (nicht konvex)");
    expect(name([[0, 0], [5, 1], [6, 4], [1, 5]])).toBe("allgemeines Viereck");
    expect(name([[0, 0], [4, 4], [4, 0], [0, 4]])).toBe("kein Viereck");
    expect(name([[0, 0], [2, 0], [4, 0], [2, 3]])).toBe("kein Viereck");
    // the symmetry axes: 4, 2, 2, 1, 1, 0
    const axes = (pts: number[][]) => quadInfo(pts.map(([x, y]) => ({ x, y }))).axes.length;
    expect([axes([[0, 0], [4, 0], [4, 4], [0, 4]]), axes([[0, 0], [5, 0], [5, 2], [0, 2]]), axes([[0, 0], [2, 1], [3, 3], [1, 2]]), axes([[0, 0], [6, 0], [4, 3], [2, 3]]), axes([[0, 2], [2, 0], [7, 2], [2, 4]]), axes([[0, 0], [4, 0], [5, 2], [1, 2]])]).toEqual([4, 2, 2, 1, 1, 0]);
  });

  it("1.4 every statement is true exactly when no grid quadrilateral contradicts it", () => {
    expect(LATTICE.length).toBeGreaterThan(1000);
    for (const [text, truth] of STATEMENTS) {
      const logic = STATEMENT_LOGIC[text];
      expect(logic, text).toBeDefined();
      const [subject, claim] = logic;
      expect(LATTICE.some(subject), `${text}: no example of the subject`).toBe(true);
      expect(LATTICE.every((q) => !subject(q) || claim(q)), text).toBe(truth);
    }
    for (const task of tasks("dv-4-vierecke", "aussagen", 1)) {
      const { i, j } = meta(task);
      expect(i).not.toBe(j);
      expect(choice(task, 0).correctIndex).toBe(STATEMENTS[i][1] ? 0 : 1);
      expect(choice(task, 1).correctIndex).toBe(STATEMENTS[j][1] ? 0 : 1);
    }
  });

  it("1.4 every combination is surely the named quadrilateral, sometimes not more, with the fewest axes named", () => {
    for (const [text, answer] of COMBOS) {
      const logic = COMBO_LOGIC[text];
      expect(logic, text).toBeDefined();
      const matching = LATTICE.filter(logic);
      expect(matching.length, text).toBeGreaterThan(0);
      expect(matching.every((q) => is[answer](q)), `${text} is always ${answer}`).toBe(true);
      expect(matching.some((q) => q.name === answer), `${text} is sometimes no more than ${answer}`).toBe(true);
      expect(Math.min(...matching.map((q) => q.axes.length)), text).toBe(QUAD_AXES[answer]);
    }
    for (const task of tasks("dv-4-vierecke", "aussagen", 2)) {
      const { k, axes } = meta(task);
      expect(picked(task, 0)).toBe(COMBOS[k][1]);
      expect(axes).toBe(QUAD_AXES[COMBOS[k][1]]);
      expect(num(task, 1)).toBe(axes);
      expect(choice(task, 0).options.sort()).toEqual([COMBOS[k][1], ...QUAD_NEIGHBOURS[COMBOS[k][1]]].sort());
    }
  });

  it("1.4 a description by sides and angles, rebuilt and classified, has the name and the axes of the answer", () => {
    const kinds = new Set<number>();
    for (const task of tasks("dv-4-vierecke", "name", 1)) {
      const m = meta(task);
      kinds.add(m.kind);
      const info = quadInfo(buildFromProperties(m.kind, m.s, m.t, m.phi, m.psi), 1e-6);
      expect(picked(task, 0), task.prompt).toBe(info.name);
      expect(num(task, 1), task.prompt).toBe(info.axes.length);
      expect(m.phi).not.toBe(90);
    }
    expect(kinds.size).toBe(7);
  });

  it("1.4 two sticks as diagonals, rebuilt and classified, give the name and the fewest axes of the answer", () => {
    for (const task of tasks("dv-4-vierecke", "name", 2)) {
      const m = meta(task);
      const info = quadInfo(buildFromDiagonals(m.kind, m.p, m.q, m.u, m.w), 1e-6);
      expect(picked(task, 0), task.prompt).toBe(info.name);
      expect(num(task, 1), task.prompt).toBe(info.axes.length);
    }
  });

  it("1.5 which pieces fix a quadrilateral: the answers of the table, with plausible values", () => {
    for (const task of tasks("dv-5-viereckskonstruktion", "stuecke", 1)) {
      const c = PIECE_CASES[meta(task).k];
      expect(choice(task, 0).correctIndex).toBe(c.fixed ? 0 : 1);
      expect(num(task, 1)).toBe(c.need);
      const v = quadPieces(task.given);
      expect(Object.keys(v).sort()).toEqual([...c.pieces].sort());
      if (c.type === "Drachenviereck" && "e" in v) expect(sideCheck(v.e, v.a, v.b).meet).toBe("two");
      if (c.type === "Rechteck" && "a" in v && "e" in v) expect(v.e).toBeGreaterThan(v.a);
      if ("c" in v) expect(v.c).toBeLessThan(v.a);
      if ("α" in v) expect(v.α).not.toBe(90);
      if ("β" in v) expect(v.α + v.β).toBe(180);
    }
    // the table itself: the numbers of pieces of the curriculum's quadrilaterals
    const need = Object.fromEntries(PIECE_CASES.map((c) => [c.type, c.need]));
    expect(need).toEqual({ Parallelogramm: 3, Raute: 2, Rechteck: 2, Quadrat: 1, Drachenviereck: 3, Trapez: 4, "gleichschenkliges Trapez": 3, "allgemeines Viereck": 5 });
  });

  it("1.5 construction plans: the first triangle holds every given piece, the theorem matches, the figure exists", () => {
    // the vertices each piece involves
    const involves: Record<string, string> = { a: "AB", b: "BC", c: "CD", d: "AD", e: "AC", f: "BD", α: "ABD", "∢BAC": "ABC" };
    for (const task of tasks("dv-5-viereckskonstruktion", "stuecke", 2)) {
      const c = PLAN_CASES[meta(task).k];
      expect(picked(task, 0)).toBe(c.triangle);
      expect(choice(task, 1).correctIndex).toBe(c.theorem);
      const v = quadPieces(task.given);
      // the pieces named in the plan lie in the first triangle, or follow from the figure's equal sides
      const own = c.pieces.filter((p) => [...involves[p]].every((vertex) => c.triangle.includes(vertex)));
      expect(own.length + (c.type === "Raute" || c.type === "Drachenviereck" ? 1 : 0), c.why).toBeGreaterThanOrEqual(2);
      for (const other of c.others) expect(c.pieces.every((p) => [...involves[p]].every((vertex) => other.includes(vertex))), `${other} would also work`).toBe(false);
      // three sides: a theorem SSS; two sides and the angle between: SWS
      const angles = c.pieces.filter((p) => p === "α" || p === "∢BAC").length;
      expect(c.theorem).toBe(angles === 0 ? 0 : 1);
      if (c.type === "Parallelogramm" && "b" in v) expect(sideCheck(v.a, v.b, v.e).meet).toBe("two");
      if (c.type === "Raute" && "e" in v) expect(v.e).toBeLessThan(2 * v.a);
      if (c.type === "Raute" && "f" in v) expect(v.f).toBeLessThan(2 * v.a);
      if (c.type === "Drachenviereck" && "b" in v) expect(sideCheck(v.e, v.a, v.b).meet).toBe("two");
      if (c.type === "gleichschenkliges Trapez") expect(v.a - 2 * v.d * Math.cos(v.α * RADIANS)).toBeGreaterThan(0.9);
    }
  });

  it("1.5 the fourth vertex of a parallelogram in coordinates, and the figure really is one", () => {
    for (const task of tasks("dv-5-viereckskonstruktion", "koordinaten", 1)) {
      const m = meta(task);
      const A = { x: m.ax, y: m.ay };
      const B = { x: m.bx, y: m.by };
      const C = { x: m.cx, y: m.cy };
      const D = plus(A, minus(C, B));
      expect([num(task, 0), num(task, 1), num(task, 2), num(task, 3)]).toEqual([C.x - B.x, C.y - B.y, D.x, D.y]);
      expect(is.Parallelogramm(quadInfo([A, B, C, D]))).toBe(true);
      expect(C.x - B.x).not.toBe(0);
      expect(C.y - B.y).not.toBe(0);
      expect(task.prompt).toContain(`A(${de(A.x)} | ${de(A.y)})`);
    }
    const variants = [0, 0, 0];
    for (const task of tasks("dv-5-viereckskonstruktion", "koordinaten", 2)) {
      const m = meta(task);
      variants[m.variant] += 1;
      const text = plain(task.prompt);
      if (m.variant === 0) {
        const A = pointOf(text, "A");
        const D = pointOf(text, "D");
        if (m.missingB) {
          const C = pointOf(text, "C");
          const B = { x: num(task, 0), y: num(task, 1) };
          expect(is.Parallelogramm(quadInfo([A, B, C, D]))).toBe(true);
        } else {
          const B = pointOf(text, "B");
          const C = { x: num(task, 0), y: num(task, 1) };
          expect(is.Parallelogramm(quadInfo([A, B, C, D]))).toBe(true);
        }
      } else if (m.variant === 1) {
        const A = pointOf(text, "A");
        const B = pointOf(text, "B");
        const M = pointOf(text, "M");
        const C = { x: num(task, 0), y: num(task, 1) };
        const D = { x: num(task, 2), y: num(task, 3) };
        expect(is.Parallelogramm(quadInfo([A, B, C, D]))).toBe(true);
        expect((A.x + C.x) / 2).toBe(M.x);
        expect((B.y + D.y) / 2).toBe(M.y);
      } else {
        const A = pointOf(text, "A");
        const B = pointOf(text, "B");
        const C = pointOf(text, "C");
        const D = { x: num(task, 0), y: num(task, 1) };
        const info = quadInfo([A, B, C, D]);
        expect(info.convex).toBe(true);
        expect(info.axes).toContain("AC");
        expect(choice(task, 2).correctIndex).toBe(info.allEqual ? 0 : 1);
      }
    }
    expect(variants.every((n) => n > 40), `${variants}`).toBe(true);
  });

  it("1.6 angles from properties: Level 1 recomputed, every angle between 0° and 180°", () => {
    for (const task of tasks("dv-6-vierecke-anwenden", "winkel", 1)) {
      const m = meta(task);
      const expected = [
        [180 - m.alpha, m.alpha],
        [m.alpha, 180 - m.alpha],
        [(360 - m.alpha - m.gamma) / 2, m.alpha / 2],
        [180 - m.alpha, m.alpha / 2],
        [180 - m.beta, 180 - m.alpha],
      ][m.kind];
      expect([num(task, 0), num(task, 1)]).toEqual(expected);
      for (const x of expected) {
        expect(x).toBeGreaterThan(0);
        expect(x).toBeLessThan(180);
      }
      if (m.kind === 0 || m.kind === 3) expect(m.alpha).not.toBe(90);
    }
  });

  it("1.6 angles in combined figures: the figure is built from the given angles and measured", () => {
    for (const task of tasks("dv-6-vierecke-anwenden", "winkel", 2)) {
      const m = meta(task);
      const O = { x: 0, y: 0 };
      if (m.ctx === 0) {
        // rhombus with side 1 and α = first answer; the diagonal BD makes ∢MBA with AB
        const alpha = num(task, 0);
        const A = O;
        const B = { x: 1, y: 0 };
        const D = dir(1, alpha);
        const M = { x: (B.x + D.x) / 2, y: (B.y + D.y) / 2 };
        close(angleAt(M, B, A), m.x, 1e-9);
        expect(num(task, 1)).toBe(180 - alpha);
      } else if (m.ctx === 1 || m.ctx === 4) {
        // triangle ABC over AC with the angles x at A and y at C
        const apex = wswApex(1, m.x, m.y)!;
        const A = O;
        const C = { x: 1, y: 0 };
        const B = { x: apex.x, y: -apex.y };
        close(angleAt(A, B, C), num(task, 0), 1e-9);
        if (m.ctx === 1) {
          const D = plus(A, minus(C, B));
          close(angleAt(D, A, C), m.y, 1e-9);
          close(angleAt(A, C, B), num(task, 1), 1e-9);
        } else {
          const D = { x: B.x, y: -B.y };
          close(angleAt(B, C, D), num(task, 1), 1e-9);
          expect(num(task, 1)).toBeLessThan(180);
        }
      } else if (m.ctx === 2) {
        // parallelogram with AB = CD = q, AD = p, α = 2w; the bisector of α meets [CD] in E
        const A = O;
        const B = { x: m.q, y: 0 };
        const D = dir(m.p, 2 * m.w);
        const C = plus(B, D);
        const t = D.y / Math.sin(m.w * RADIANS);
        const E = dir(t, m.w);
        expect(E.x).toBeGreaterThan(D.x);
        expect(E.x).toBeLessThan(C.x);
        close(angleAt(D, E, A), num(task, 0), 1e-9);
        close(Math.hypot(C.x - E.x, C.y - E.y), num(task, 1), 1e-9);
      } else {
        // isosceles trapezoid: α = β = x + y, AD = 1, and ∢CAB = x
        const alpha = m.x + m.y;
        const D = dir(1, alpha);
        const L = D.x + D.y / Math.tan(m.x * RADIANS);
        const A = O;
        const B = { x: L, y: 0 };
        const C = { x: L - D.x, y: D.y };
        close(angleAt(C, A, B), m.x, 1e-9);
        close(angleAt(B, C, D), num(task, 0), 1e-9);
        close(angleAt(A, C, D), num(task, 1), 1e-9);
        expect(C.x).toBeGreaterThan(D.x);
      }
    }
  });

  it("1.6 areas forwards and backwards, with values that end after two decimals", () => {
    const twoDecimals = (x: number) => Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
    for (const task of tasks("dv-6-vierecke-anwenden", "flaeche", 1)) {
      const m = meta(task);
      if (m.kind === 0) {
        expect(num(task, 0)).toBe(m.g * m.h);
        expect(m.b).toBeGreaterThan(m.h);
      } else if (m.kind === 1) {
        close(num(task, 0), (m.a + m.c) / 2);
        close(num(task, 1), ((m.a + m.c) / 2) * m.h);
        expect(m.c).toBeLessThan(m.a);
      } else {
        close(num(task, 0), m.e * m.f);
        close(num(task, 1), (m.e * m.f) / 2);
      }
      for (const f of task.fields) if (f.kind === "number") expect(twoDecimals(f.answer), task.prompt).toBe(true);
    }
    for (const task of tasks("dv-6-vierecke-anwenden", "flaeche", 2)) {
      const m = meta(task);
      if (m.ctx === 0) {
        expect(num(task, 0)).toBe(m.h);
        expect(task.given.join(" ")).toContain(`A = ${de(((m.a + m.c) / 2) * m.h)} m²`);
      } else if (m.ctx === 1) {
        expect(((m.e * num(task, 0)) / 2) % 1).toBe(0);
        expect(num(task, 0)).toBeLessThan(m.e);
      } else if (m.ctx === 2) {
        close(num(task, 0), m.a * m.ha);
        close(num(task, 1), (m.a * m.ha) / m.b);
        // the height to b is shorter than a, the height to a shorter than b
        expect(num(task, 1)).toBeLessThan(m.a);
        expect(m.ha).toBeLessThan(m.b);
      } else {
        close(num(task, 0), m.a + m.c);
        close(num(task, 1), ((m.a + m.c) * m.h) / 2);
        expect(twoDecimals(num(task, 1))).toBe(true);
      }
    }
  });
});

describe("Labore zu den Vierecken zeigen das Richtige", () => {
  it("1.4 names the start as a general quadrilateral and the witnesses as the goals say", () => {
    const lab = lesson("dv-4-vierecke").lab;
    expect(at(lab, {}).r.name).toBe("allgemeines Viereck");
    expect(at(lab, { xA: 1, yA: 1, xB: 9, yB: 1, xC: 7, yC: 5, xD: 3, yD: 5 }).r.name).toBe("gleichschenkliges Trapez");
    expect(at(lab, { xA: 1, yA: 1, xB: 9, yB: 1, xC: 7, yC: 5, xD: 3, yD: 5 }).r.diagonalen).toBe("gleich lang");
    expect(at(lab, { xA: 1, yA: 1, xB: 5, yB: 2, xC: 6, yC: 6, xD: 2, yD: 5 }).r.symmetrie).toBe("2 Symmetrieachsen; punktsymmetrisch");
    expect(quadInfo(familyPoints(defaultLabValues(lab))).simple).toBe(true);
  });

  it("1.5 constructs a parallelogram, a rhombus and a kite from the free vertices; freehand vertices stay put", () => {
    const A = { x: 1, y: 1 };
    const B = { x: 6, y: 1 };
    const C = { x: 8, y: 4 };
    expect(is.Parallelogramm(quadInfo(zugConstructed(0, A, B, C, 3), 1e-6))).toBe(true);
    const rhombus = quadInfo(zugConstructed(1, A, B, C, 3), 1e-6);
    expect(rhombus.allEqual && rhombus.diagPerp && rhombus.diagBisect).toBe(true);
    const kite = quadInfo(zugConstructed(2, A, B, C, 3), 1e-6);
    expect(kite.axes).toContain("AC");
    expect(FREEHAND_START.p).toEqual({ x: 3, y: 4 });
    const lab = lesson("dv-5-viereckskonstruktion").lab;
    const start = defaultLabValues(lab);
    // freehand at the start: D where it belongs, still a parallelogram; after moving B it breaks
    expect(zugKeeps(0, quadInfo(zugPoints({ ...start, modus: 1 }).P, 1e-6))).toBe(true);
    const moved = { ...start, modus: 1, xB: 5 };
    expect(zugKeeps(0, quadInfo(zugPoints(moved).P, 1e-6))).toBe(false);
    expect(zugKeeps(0, quadInfo(zugPoints(redrawFreehand(moved)).P, 1e-6))).toBe(true);
    // by eye, the rhombus is only a parallelogram: rounding to half units breaks the equal sides
    expect(zugKeeps(1, quadInfo(zugPoints({ ...start, fig: 1, modus: 1 }).P, 1e-6))).toBe(false);
    expect(at(lab, {}).r.zustand).toBe("ja, ABCD ist ein Parallelogramm");
  });

  it("1.6 areas do not change when the top side slides or the crossing moves; angles add up to 360°", () => {
    const lab = lesson("dv-6-vierecke-anwenden").lab;
    const base = defaultLabValues(lab);
    expect(problemArea(base)).toBe(24);
    for (const s of [-2, 0, 2, 6]) expect(problemArea({ ...base, s })).toBe(24);
    for (const p of [10, 50, 90]) expect(problemArea({ ...base, fig: 1, p })).toBe(20);
    close(problemArea({ ...base, fig: 2 }), 8 * 4 * Math.sin(60 * RADIANS), 1e-12);
    for (const values of enumerateLabGrid(lab, 3)) {
      const w = problemAngles(values);
      close(w[0] + w[1] + w[2] + w[3], 360, 1e-9);
      if (values.fig === 0) {
        close(w[0] + w[3], 180, 1e-9);
        close(w[1] + w[2], 180, 1e-9);
      }
    }
    // the trapezoid's measured angles match the rounded readout
    const raw = quadAngles([
      { x: 0, y: 0 },
      { x: 8, y: 0 },
      { x: 5, y: 4 },
      { x: 1, y: 4 },
    ]);
    expect(problemAngles(base).map(Math.round)).toEqual(raw.map(Math.round));
  });
});
