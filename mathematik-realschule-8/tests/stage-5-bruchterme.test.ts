import { describe, expect, it } from "vitest";
import { STAGE_BRUCHTERME } from "../src/curriculum/stage-5-bruchterme";
import { createRng, seedFrom } from "../src/exercises/rng";
import { computeReadouts, defaultLabValues, enumerateLabGrid } from "../src/lab/engine";
import { builderPoly, builderText, builderZeros, polyEval, sides, solveProportion, t1, t2, t2Zeros } from "../src/lab/views-bruchterme";
import type { DifficultyLevel, ExerciseTask } from "../src/model/types";
import { GOAL_WITNESSES_STAGE_5 } from "./witnesses-stage-5";

const IDS = ["br-1-bruchterme", "br-2-definitionsmenge", "br-3-verhaeltnisgleichungen"];
const SEEDS = Array.from({ length: 200 }, (_, i) => seedFrom(`stage-5:${i}`));

const lesson = (id: string) => {
  const found = STAGE_BRUCHTERME.lessons.find((l) => l.id === id);
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

function chosen(task: ExerciseTask, index: number): string {
  const field = task.fields[index];
  if (field?.kind !== "choice") throw new Error(`field ${index} of ${task.prompt} is no choice`);
  return field.options[field.correctIndex];
}

const meta = (task: ExerciseTask) => task.meta ?? {};
const close = (actual: number, expected: number, where = "") => expect(Math.abs(actual - expected), `${where} ${actual} vs ${expected}`).toBeLessThan(1e-9);
const twoDecimals = (value: number) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-9;
const G_NAMES = ["ℚ", "ℤ", "ℕ"];
const inG = (x: number, G: number) => G === 0 || (Number.isInteger(x) && (G === 1 || x >= 1));

/** A number as the school writes it in a set, independently of the app: 2,5 / −3 / 2/3. */
function written(value: number): string {
  if (twoDecimals(value)) return String(Math.round(value * 100) / 100).replace(".", ",").replace("-", "−");
  for (let d = 3; d <= 12; d++) {
    const n = value * d;
    if (Math.abs(n - Math.round(n)) < 1e-9) return `${Math.round(n) < 0 ? "−" : ""}${Math.abs(Math.round(n))}/${d}`;
  }
  throw new Error(`no fraction for ${value}`);
}

/** "D = ℚ ∖ {−3; 2}" or "D = ℕ". */
const domain = (zeros: number[], G: number) => (zeros.length === 0 ? `D = ${G_NAMES[G]}` : `D = ${G_NAMES[G]} ∖ {${[...zeros].sort((a, b) => a - b).map(written).join("; ")}}`);

describe("Etappe 5: Bruchterme und Bruchgleichungen", () => {
  it("has its lessons in order, for both Zweige, with the stage meta of the package", () => {
    expect(STAGE_BRUCHTERME.id).toBe("stage-5-bruchterme");
    expect(STAGE_BRUCHTERME.stageNumber).toBe(5);
    expect(STAGE_BRUCHTERME.title).toBe("Bruchterme und Bruchgleichungen");
    expect(STAGE_BRUCHTERME.accent).toBe("#db2777");
    expect(STAGE_BRUCHTERME.lehrplanLabel).toBe("LB 5 (I) · LB 4 (II/III)");
    expect(STAGE_BRUCHTERME.lessons.map((l) => l.id)).toEqual(IDS);
    expect(STAGE_BRUCHTERME.lessons.map((l) => l.title)).toEqual(["5.1 Bruchterme", "5.2 Die Definitionsmenge bestimmen", "5.3 Verhältnisgleichungen"]);
    expect(STAGE_BRUCHTERME.lessons.map((l) => l.lab.kind)).toEqual(["fraction-term", "domain", "proportion-equation"]);
    for (const l of STAGE_BRUCHTERME.lessons) {
      expect(l.tracks).toEqual(["I", "II_III"]);
      expect(l.lehrplan.startsWith("M8 LB 5 (I) · M8 LB 4 (II/III): "), l.lehrplan).toBe(true);
    }
  });

  it("uses no content of later grades or of Zweig I only, and writes the set minus as ∖", () => {
    for (const l of STAGE_BRUCHTERME.lessons) {
      const plain = [l.explanationHtml, l.whyItMatters, l.quiz.question, ...l.quiz.options, l.quiz.explanation, l.lab.intro, ...l.lab.goals.map((g) => g.text), ...l.formulas.map((f) => f.html)].join(" ");
      expect(plain, l.id).not.toMatch(/Asymptote|Parabel|ℝ|Wurzel|Determinante|y = mx|Ungleichung/);
      expect(plain, `${l.id}: set minus`).not.toMatch(/ℚ \\|ℕ \\/);
    }
    // the tasks too
    for (const l of STAGE_BRUCHTERME.lessons) {
      for (const g of l.exercises) {
        for (const level of [1, 2] as const) {
          for (const task of tasks(l.id, g.id, level)) {
            const html = [task.prompt, ...task.given, ...task.steps, task.formulaHint ?? "", ...task.fields.map((f) => (f.kind === "choice" ? f.options.join(" ") : f.label))].join(" ");
            expect(html, `${l.id}/${g.id}`).not.toMatch(/ℝ|\\|(^|[^\d,])1x|\+ 0(?![\d,])|− 0(?![\d,])|= ≈|\)\(x\)|: \(x\)|ist 0 = 0/);
            // no doubled step such as "x = 0 ⇔ x = 0"
            for (const step of task.steps) {
              const parts = step.replace(/<[^>]+>/g, "").split("⇔").map((p) => p.trim());
              parts.forEach((part, i) => {
                if (i > 0) expect(part, `${l.id}/${g.id}: ${step}`).not.toBe(parts[i - 1]);
              });
            }
          }
        }
      }
    }
  });
});

describe("Labore der Etappe 5", () => {
  it("5.1: the term values, the excluded numbers and the goals follow the terms", () => {
    const lab = lesson("br-1-bruchterme").lab;
    for (const v of enumerateLabGrid(lab, 9)) {
      for (const x of [-5, -1.5, 0, 0.5, 2, 4.5]) {
        if (x === v.b) expect(Number.isNaN(t1(v, x))).toBe(true);
        else close(t1(v, x), 6 / (x - v.b));
        const n = v.typ === 1 ? x * x + 1 : v.typ === 2 ? x * x - 4 : v.a * x + v.c;
        if (n === 0) expect(Number.isNaN(t2(v, x))).toBe(true);
        else close(t2(v, x), (x + 1) / n);
      }
      for (const z of t2Zeros(v)) close(v.typ === 2 ? z * z - 4 : v.a * z + v.c, 0);
    }
    const r = computeReadouts(lab, defaultLabValues(lab));
    expect(r.werte).toBe("T₁(3) = 6; T₂(3) ≈ 1,33");
    expect(r.t2).toBe("(x + 1) : (2x − 3); D₂ = ℚ ∖ {1,5}");
    expect(computeReadouts(lab, { b: 2, typ: 0, a: 0, c: 4, x: 1 }).t2).toBe("(x + 1) : 4; D₂ = ℚ, aber T₂ ist kein Bruchterm: Im Nenner steht keine Variable.");
    expect(computeReadouts(lab, { b: 2, typ: 0, a: 0, c: 0, x: 1 }).t2).toContain("D₂ = { }");
    // "ueberall" needs a · x + c with a = 0: choosing x² + 1 from the list is no investigation
    const ueberall = lab.goals.find((g) => g.id === "ueberall")!;
    for (const v of enumerateLabGrid(lab, 9)) {
      const r = computeReadouts(lab, v);
      expect(ueberall.check(v, r), JSON.stringify(v)).toBe(v.typ === 0 && v.a === 0 && v.c !== 0);
    }
  });

  it("5.2: the builder excludes exactly the zeros of its Nenner and writes the product as the board does", () => {
    const lab = lesson("br-2-definitionsmenge").lab;
    for (const v of enumerateLabGrid(lab, 9)) {
      const p = builderPoly(v);
      const zeros = builderZeros(v);
      for (const z of zeros) close(polyEval(p, z), 0, JSON.stringify(v));
      // no other zero on a fine grid of halves
      for (let x = -6; x <= 6; x += 0.5) if (!zeros.includes(x)) expect(Math.abs(polyEval(p, x)), `${JSON.stringify(v)} at ${x}`).toBeGreaterThan(1e-9);
    }
    expect(builderText(defaultLabValues(lab))).toBe("x − 2");
    expect(builderText({ k: 2, f1: 1, a1: 0, f2: 1, a2: 4 })).toBe("2x(x − 4)");
    expect(builderText({ k: -2, f1: 3, a1: 0, f2: 1, a2: -4.5 })).toBe("−2(x² + 1)(x + 4,5)");
    expect(builderText({ k: 1, f1: 2, a1: 0, f2: 1, a2: 0 })).toBe("x · x²");
    const witness = { ...defaultLabValues(lab), ...GOAL_WITNESSES_STAGE_5["br-2-definitionsmenge"].faktor };
    expect(computeReadouts(lab, witness)).toMatchObject({ aus: "N(x) = 2x² − 8x", d: "D = ℚ ∖ {0; 4}" });
  });

  it("5.3: the cross product gives the solution, or an excluded number, for every equation on the slider grid", () => {
    let excludedCases = 0;
    for (let a = -6; a <= 6; a++) {
      for (let b = -6; b <= 6; b++) {
        for (let c = -6; c <= 6; c++) {
          for (let d = -6; d <= 6; d++) {
            const v = { a, b, c, d, x: 0, rechnung: 0 };
            const s = solveProportion(v);
            if (a === c) {
              expect(s.kind).toBe(a * (b - d) === 0 ? 2 : 1);
              continue;
            }
            close(a * (s.x0 + d) - c * (s.x0 + b), 0);
            expect(s.excludedCandidate).toBe(s.x0 === -b || s.x0 === -d);
            if (s.excludedCandidate) excludedCases++;
            else {
              const { left, right } = sides(v, s.x0);
              close(left, right);
            }
          }
        }
      }
    }
    expect(excludedCases).toBeGreaterThan(0);
    const lab = lesson("br-3-verhaeltnisgleichungen").lab;
    expect(solveProportion(defaultLabValues(lab))).toMatchObject({ kind: 0, x0: -7, excludedCandidate: false, excluded: [-1, 2] });
    expect(computeReadouts(lab, defaultLabValues(lab)).waage).toBe("Die linke Seite ist größer.");
    expect(computeReadouts(lab, { ...defaultLabValues(lab), x: -7 }).waage).toBe("Gleichgewicht: Beide Seiten haben den Wert −2/3.");
    expect(computeReadouts(lab, { ...defaultLabValues(lab), x: 2 }).waage).toContain("hat die linke Seite einen Wert");
  });
});

describe("Aufgaben der Etappe 5 rechnen richtig", () => {
  it("5.1 termwert: Termwerte, ausgeschlossene Zahl, Bus, Fahrzeit und Rechteck", () => {
    let excluded = 0;
    for (const task of tasks("br-1-bruchterme", "termwert", 1)) {
      const m = meta(task);
      const value = (x: number) => (m.p1 * x + m.p0) / (m.q1 * x + m.q0);
      close(num(task, 0), value(m.x1));
      close(num(task, 1), value(m.x2));
      expect(twoDecimals(num(task, 0)) && twoDecimals(num(task, 1))).toBe(true);
      expect(m.x1).not.toBe(m.x2);
      const zero = -m.q0 / m.q1;
      expect(m.x3 === zero).toBe(m.excluded === 1);
      expect(chosen(task, 2)).toBe(m.excluded ? "nein, der Nenner ist dann 0" : "ja");
      if (m.excluded) excluded++;
    }
    expect(excluded).toBeGreaterThan(70);
    expect(excluded).toBeLessThan(130);
    for (const task of tasks("br-1-bruchterme", "termwert", 2)) {
      const m = meta(task);
      if (m.kind === 0) {
        close(num(task, 0), m.total / m.n1);
        close(num(task, 1), m.total / m.n1 - m.total / m.n2);
        expect(twoDecimals(m.total / m.n1) && twoDecimals(m.total / m.n2)).toBe(true);
      } else if (m.kind === 1) {
        close(num(task, 0), m.s / m.v1);
        close(num(task, 1), (m.s / m.v1 - m.s / m.v2) * 60);
        expect(Number.isInteger(num(task, 1))).toBe(true);
        // the steps show both times with "=": they must be exact
        expect(twoDecimals(m.s / m.v1) && twoDecimals(m.s / m.v2)).toBe(true);
      } else {
        close(num(task, 0), m.area / m.w1);
        close(num(task, 1), 2 * m.w2 + (2 * m.area) / m.w2);
      }
      expect(num(task, 2)).toBe(0);
    }
  });

  it("5.1 erkennen: der Bruchterm, seine ausgeschlossene Zahl und die Behauptung über Zähler und Nenner", () => {
    for (const task of tasks("br-1-bruchterme", "erkennen", 1)) {
      const m = meta(task);
      close(num(task, 1), -m.q0 / m.q1);
      const answer = chosen(task, 0);
      // a Bruchterm has an x after its last ":"
      const isFraction = answer.includes(":") && answer.slice(answer.lastIndexOf(":")).includes("x");
      expect(isFraction).toBe(m.findFraction === 1);
      const field = task.fields[0];
      if (field.kind === "choice") {
        const fractions = field.options.filter((o) => o.includes(":") && o.slice(o.lastIndexOf(":")).includes("x"));
        expect(fractions.length).toBe(m.findFraction ? 1 : 3);
      }
    }
    for (const task of tasks("br-1-bruchterme", "erkennen", 2)) {
      const m = meta(task);
      const zero = -m.s / m.r;
      close(num(task, 1), zero);
      expect(num(task, 2)).toBe(0);
      expect(m.r * -m.p + m.s).not.toBe(0);
      expect(chosen(task, 0)).toBe(m.right ? "ja" : "nein");
    }
  });

  it("5.2 nenner-null: eine Nullstelle des Nenners, Produkte, Faktorisieren und zwei Nenner", () => {
    for (const task of tasks("br-2-definitionsmenge", "nenner-null", 1)) {
      const m = meta(task);
      const zero = -m.n / m.m;
      close(num(task, 0), zero);
      expect(chosen(task, 1)).toBe(domain([zero], 0));
      expect(Math.abs(-m.p / m.pm - zero)).toBeGreaterThan(1e-9);
    }
    for (const task of tasks("br-2-definitionsmenge", "nenner-null", 2)) {
      const m = meta(task);
      const zeros =
        m.kind === 0 ? [m.u, -m.w / m.m] : m.kind === 1 ? [-m.c, m.c] : m.kind === 2 ? [0, m.z] : m.kind === 3 ? [-m.c, -m.e] : [-m.n / m.m, -m.e];
      const sorted = [...new Set(zeros.map((z) => z + 0))].sort((a, b) => a - b);
      expect(sorted).toHaveLength(2);
      close(num(task, 0), sorted[0]);
      close(num(task, 1), sorted[1]);
      expect(task.steps[task.steps.length - 1]).toContain(domain(sorted, 0));
    }
  });

  it("5.2 grundmenge: no wrong option names the right set (ℕ ∖ {−1} is ℕ)", () => {
    const parse = (t: string) => {
      const [n, d] = t.replace("−", "-").replace(",", ".").split("/");
      return d === undefined ? Number(n) : Number(n) / Number(d);
    };
    for (const level of [1, 2] as const) {
      for (const task of tasks("br-2-definitionsmenge", "grundmenge", level)) {
        const field = task.fields[1];
        if (field.kind !== "choice") throw new Error("no choice");
        const G = meta(task).G;
        const setOf = (option: string): string | null => {
          const match = option.match(/^D = ([ℚℤℕ])(?: ∖ \{(.*)\})?$/);
          if (!match || match[1] !== G_NAMES[G]) return null;
          const numbers = match[2] ? match[2].split("; ").map(parse) : [];
          return numbers.filter((x) => inG(x, G)).sort((a, b) => a - b).join(";");
        };
        const right = setOf(field.options[field.correctIndex]);
        field.options.forEach((option, i) => {
          if (i !== field.correctIndex) expect(setOf(option), `${task.prompt}: ${option}`).not.toBe(right);
        });
      }
    }
  });

  it("5.2 grundmenge: nur was in G liegt wird ausgeschlossen", () => {
    const seen = new Set<string>();
    for (const task of tasks("br-2-definitionsmenge", "grundmenge", 1)) {
      const m = meta(task);
      const zeros = m.form === 0 ? [m.k1] : m.form === 1 ? [-m.k2 / m.k1] : m.form === 2 ? [-m.k1, m.k1] : [];
      const inside = zeros.filter((z) => inG(z, m.G));
      expect(num(task, 0)).toBe(inside.length);
      expect(chosen(task, 1)).toBe(domain(inside, m.G));
      const field = task.fields[1];
      if (field.kind === "choice") expect(new Set(field.options).size).toBe(3);
      seen.add(`${m.form}/${m.G}`);
    }
    expect(seen.size).toBeGreaterThanOrEqual(10);
    for (const task of tasks("br-2-definitionsmenge", "grundmenge", 2)) {
      const m = meta(task);
      const zeros = [...(m.shape === 0 ? [-m.c, m.c] : [0, m.c]), -m.n / m.m];
      const inside = [...new Set(zeros.filter((z) => inG(z, m.G)))];
      expect(num(task, 0)).toBe(inside.length);
      expect(chosen(task, 1)).toBe(domain(inside, m.G));
    }
  });

  it("5.3 kreuz: über Kreuz lösen, leere Lösungsmenge und Gleichungen, in denen x² wegfällt", () => {
    for (const task of tasks("br-3-verhaeltnisgleichungen", "kreuz", 1)) {
      const { a, b, c, d, x0 } = meta(task);
      close(a * (x0 + d), c * (x0 + b));
      expect([num(task, 0), num(task, 1)]).toEqual([Math.min(-b, -d) + 0, Math.max(-b, -d) + 0]);
      expect(num(task, 2)).toBe(x0);
      expect(x0 === -b || x0 === -d).toBe(false);
      expect(a).not.toBe(c);
    }
    let empty = 0;
    for (const task of tasks("br-3-verhaeltnisgleichungen", "kreuz", 2)) {
      const m = meta(task);
      if (m.kind === 1) {
        const x = (m.c - m.p) / m.m;
        expect(num(task, 0)).toBe(m.e);
        close(num(task, 1), x);
        expect(chosen(task, 2)).toBe(x === m.e ? "L = { }" : `L = {${written(x)}}`);
        if (x === m.e) empty++;
      } else {
        const x = num(task, 2);
        close((x + m.p) * (x + m.s), (x + m.r) * (x + m.q));
        expect(x === -m.q || x === -m.s).toBe(false);
        expect([num(task, 0), num(task, 1)]).toEqual([Math.min(-m.q, -m.s) + 0, Math.max(-m.q, -m.s) + 0]);
      }
    }
    expect(empty).toBeGreaterThan(15);
  });

  it("5.3 anwendung: Verhältnisgleichung, gleiche Zeit, Mischung, Maßstab und Rezept", () => {
    for (const task of tasks("br-3-verhaeltnisgleichungen", "anwendung", 1)) {
      const { a, b, cc, dd } = meta(task);
      const x = num(task, 1);
      expect(num(task, 0)).toBe(-b);
      close(a / (x + b), cc / dd);
      expect(Number.isInteger(x)).toBe(true);
    }
    const kinds = new Set<number>();
    for (const task of tasks("br-3-verhaeltnisgleichungen", "anwendung", 2)) {
      const m = meta(task);
      kinds.add(m.kind);
      if (m.kind === 0) {
        const x = num(task, 0);
        close(m.s1 / (x + m.delta), m.s2 / x);
        close(num(task, 1), (m.s2 / x) * 60);
      } else if (m.kind === 1) {
        const x = num(task, 0);
        close(x / (m.total - x), m.p / m.q);
        close(num(task, 1), m.total - x);
        expect(twoDecimals(x)).toBe(true);
      } else if (m.kind === 2) {
        const x = num(task, 0);
        const km = (m.cm * m.scale) / 100000;
        close(1 / x, m.cm / (km * 100000));
        close(num(task, 1), (m.otherKm * 100000) / x);
      } else {
        const x = num(task, 0);
        close((m.people * m.per) / m.people, m.more / x);
        expect(Number.isInteger(x)).toBe(true);
        close(num(task, 1), m.ask * m.per);
        expect(m.ask).not.toBe(x);
      }
    }
    expect(kinds.size).toBe(4);
  });
});
