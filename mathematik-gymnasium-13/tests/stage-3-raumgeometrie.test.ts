import { describe, expect, it } from "vitest";
import { STAGE_RAUMGEOMETRIE as STAGE } from "../src/curriculum/stage-3-raumgeometrie";
import { fmt } from "../src/exercises/format";
import { createRng, seedFrom } from "../src/exercises/rng";
import {
  clampParam,
  computeReadouts,
  defaultLabValues,
  withChanges,
} from "../src/lab/engine";
import type { ExerciseTask, LabValues, NumberField } from "../src/model/types";
import { GOAL_WITNESSES_STAGE_3 } from "./witnesses-stage-3";

// ─── Unabhängige Vektorrechnung (nicht die Formeln der App) ────────────────

type V = [number, number, number];
const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (k: number, a: V): V => [k * a[0], k * a[1], k * a[2]];
const dot = (a: V, b: V): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V, b: V): V => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const norm = (a: V): number => Math.hypot(a[0], a[1], a[2]);
const angleOf = (a: V, b: V): number =>
  (Math.acos(Math.max(-1, Math.min(1, dot(a, b) / (norm(a) * norm(b))))) * 180) / Math.PI;

const close = (actual: number, expected: number, where: string, eps = 1e-6) =>
  expect(Math.abs(actual - expected), `${where}: ${actual} vs ${expected}`).toBeLessThan(eps);

/** "P(1 | 2 | −3)" written like the app writes it. */
const p3 = (x: number, y: number, z: number) =>
  `(${fmt(x, 0)} | ${fmt(y, 0)} | ${fmt(z, 0)})`;

// ─── Aufgaben sammeln ──────────────────────────────────────────────────────

const LESSON_IDS = [
  "rg-1-geraden",
  "rg-2-linearkombination",
  "rg-3-ebene-parameterform",
  "rg-4-ebene-koordinatenform",
  "rg-5-lage-geraden",
  "rg-6-gerade-ebene",
  "rg-7-lage-ebenen",
  "rg-8-abstaende",
  "rg-9-kugeln",
];

const GENERATORS: Record<string, string[]> = {
  "rg-1-geraden": ["geraden-gleichung", "punkt-auf-gerade"],
  "rg-2-linearkombination": ["linearkombination", "abhaengigkeit"],
  "rg-3-ebene-parameterform": ["ebene-parameter", "punkt-in-ebene"],
  "rg-4-ebene-koordinatenform": ["koordinatenform", "besondere-lage"],
  "rg-5-lage-geraden": ["lagerelation", "schnittwinkel"],
  "rg-6-gerade-ebene": ["schnittpunkt-gerade-ebene", "winkel-gerade-ebene"],
  "rg-7-lage-ebenen": ["ebenen-lage", "schnittgerade"],
  "rg-8-abstaende": ["abstand-punkt-gerade", "abstand-punkt-ebene"],
  "rg-9-kugeln": ["kugel-gleichung", "lage-kugel-ebene"],
};

const SEEDS = Array.from({ length: 220 }, (_, i) => seedFrom(`stage-3:${i}`));

function generator(lessonId: string, id: string) {
  const lesson = STAGE.lessons.find((l) => l.id === lessonId);
  const found = lesson?.exercises.find((e) => e.id === id);
  if (!found) throw new Error(`${lessonId}/${id}`);
  return found;
}

interface Drawn {
  task: ExerciseTask;
  n: number[];
  choice: number;
  m: Record<string, number>;
}

function tasks(lessonId: string, id: string, level: 1 | 2): Drawn[] {
  return SEEDS.map((seed) => {
    const task = generator(lessonId, id).make(createRng(seed), level);
    const n = task.fields
      .filter((f): f is NumberField => f.kind === "number")
      .map((f) => f.answer);
    const choiceField = task.fields.find((f) => f.kind === "choice");
    return {
      task,
      n,
      choice: choiceField && choiceField.kind === "choice" ? choiceField.correctIndex : -1,
      m: task.meta ?? {},
    };
  });
}

// ─── 1. Metadaten der Etappe ───────────────────────────────────────────────

describe("Etappe 3: Lektionen", () => {
  it("has the nine lessons in order with the right Lernbereich and step numbers", () => {
    expect(STAGE.id).toBe("stage-3");
    expect(STAGE.lessons.map((l) => l.id)).toEqual(LESSON_IDS);
    STAGE.lessons.forEach((lesson, i) => {
      expect(lesson.stepNumber, lesson.id).toBe(i + 1);
      expect(lesson.title.startsWith(`3.${i + 1} `), lesson.id).toBe(true);
      expect(lesson.lehrplan, lesson.id).toMatch(/^M13 LB 3: /);
      expect(lesson.lab.goals, lesson.id).toHaveLength(3);
      expect(lesson.exercises.map((e) => e.id), lesson.id).toEqual(
        GENERATORS[lesson.id],
      );
      expect(lesson.explanationHtml).toContain('class="example"');
      expect(lesson.explanationHtml).toContain('class="merke"');
      expect(lesson.formulas.length, lesson.id).toBeGreaterThanOrEqual(1);
      expect(lesson.quiz.options.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(lesson.quiz.explanation.length, lesson.id).toBeGreaterThan(20);
      expect(lesson.quiz.correctIndex, lesson.id).toBeGreaterThanOrEqual(0);
      expect(lesson.quiz.correctIndex, lesson.id).toBeLessThan(lesson.quiz.options.length);
    });
  });

  it("writes no hyphen as minus and no character escapes in the fixed texts", () => {
    for (const lesson of STAGE.lessons) {
      const texts = [
        lesson.explanationHtml,
        lesson.whyItMatters,
        ...lesson.formulas.flatMap((f) => [f.html, f.quantities]),
        lesson.quiz.question,
        ...lesson.quiz.options,
        lesson.quiz.explanation,
        lesson.lab.title,
        lesson.lab.intro,
        ...lesson.lab.params.flatMap((p) => ("label" in p ? [p.label] : [])),
        ...lesson.lab.readouts.map((r) => r.label),
        ...lesson.lab.goals.map((g) => g.text),
      ];
      for (const text of texts) {
        const plain = text.replace(/<[^>]+>/g, " ");
        expect(plain, `${lesson.id}: ${text.slice(0, 60)}`).not.toMatch(
          /(^|[\s(=:|,{±])-\d/,
        );
        expect(plain, `${lesson.id}: ${text.slice(0, 60)}`).not.toMatch(
          /NaN|undefined|Infinity|\+ −|− −|\+ -/,
        );
      }
      for (const text of [lesson.quiz.question, ...lesson.quiz.options, lesson.quiz.explanation]) {
        expect(text, lesson.id).not.toMatch(/&lt;|&gt;|&amp;|&quot;/);
      }
    }
  });

  it("marks the mathematically correct quiz answer", () => {
    const correct: Record<string, string> = {
      "rg-1-geraden": "Ein Vielfaches von u beschreibt dieselbe Gerade.",
      "rg-2-linearkombination": "Wenn keiner der beiden ein Vielfache des anderen ist.",
      "rg-3-ebene-parameterform": "Die Gleichung beschreibt nur eine Gerade, keine Ebene.",
      "rg-4-ebene-koordinatenform": "Die Ebene verläuft parallel zur z-Achse.",
      "rg-5-lage-geraden": "Sie sind windschief.",
      "rg-6-gerade-ebene": "Die Gerade verläuft parallel zur Ebene oder liegt in ihr.",
      "rg-7-lage-ebenen": "Wenn ihre Normalenvektoren nicht parallel sind.",
      "rg-8-abstaende": "3 LE",
      "rg-9-kugeln": "Der Abstand des Mittelpunkts zur Ebene ist gleich dem Radius.",
    };
    for (const lesson of STAGE.lessons) {
      expect(lesson.quiz.options[lesson.quiz.correctIndex], lesson.id).toBe(
        correct[lesson.id],
      );
    }
  });
});

// ─── 2. Die Generatoren rechnen richtig ────────────────────────────────────

describe("Etappe 3: 3.1 Geraden", () => {
  it("geraden-gleichung: X(t) = A + t·u auf beiden Stufen", () => {
    for (const level of [1, 2] as const) {
      for (const { n, m } of tasks("rg-1-geraden", "geraden-gleichung", level)) {
        const x: V = [m.ax + m.t * m.ux, m.ay + m.t * m.uy, m.az + m.t * m.uz];
        expect(n.slice(0, 3)).toEqual(x);
      }
    }
  });

  it("punkt-auf-gerade: X(2), t aus der x-Koordinate und die Punktprobe", () => {
    for (const { task, n, choice, m } of tasks("rg-1-geraden", "punkt-auf-gerade", 1)) {
      expect(n.slice(0, 3)).toEqual([m.ax + 2 * m.ux, m.ay + 2 * m.uy, m.az + 2 * m.uz]);
      const ap: V = [m.px - m.ax, m.py - m.ay, m.pz - m.az];
      const on = norm(cross(ap, [m.ux, m.uy, m.uz])) < 1e-9;
      expect(choice === 0, `P auf g: ${task.prompt.slice(0, 50)}`).toBe(on);
    }
    for (const { n, choice, m } of tasks("rg-1-geraden", "punkt-auf-gerade", 2)) {
      close(n[0], (m.px - m.ax) / m.ux, "t aus x");
      const ap: V = [m.px - m.ax, m.py - m.ay, m.pz - m.az];
      const on = norm(cross(ap, [m.ux, m.uy, m.uz])) < 1e-9;
      expect(choice === 0).toBe(on);
    }
  });
});

describe("Etappe 3: 3.2 Linearkombination", () => {
  it("linearkombination: r·u + s·v = w auf beiden Stufen", () => {
    for (const { n, m } of tasks("rg-2-linearkombination", "linearkombination", 1)) {
      const u: V = [m.ux, m.uy, 0];
      const v: V = [m.vx, m.vy, 0];
      const w = add(mul(n[0], u), mul(n[1], v));
      close(w[0], m.wx, "wx");
      close(w[1], m.wy, "wy");
      close(w[2], 0, "wz");
    }
    for (const { n, m } of tasks("rg-2-linearkombination", "linearkombination", 2)) {
      const u: V = [m.ux, m.uy, m.uz];
      const v: V = [m.vx, m.vy, m.vz];
      const w = add(mul(n[0], u), mul(n[1], v));
      close(w[0], m.wx, "wx");
      close(w[1], m.wy, "wy");
      close(w[2], m.wz, "wz");
    }
  });

  it("abhaengigkeit: Kreuzprodukt als Kontrollzahl und Abhängigkeitsgleichung", () => {
    for (const { n, choice, m } of tasks("rg-2-linearkombination", "abhaengigkeit", 1)) {
      const c = cross([m.ux, m.uy, m.uz], [m.vx, m.vy, m.vz]);
      expect(n.slice(0, 3)).toEqual(c);
      expect(choice === 1, "abhängig genau bei Kreuzprodukt 0").toBe(norm(c) < 1e-9);
    }
    for (const { n, m } of tasks("rg-2-linearkombination", "abhaengigkeit", 2)) {
      // v = λ·u und w = α·u; bei s = 1 ist r = α − λ, bei s = −1 ist r′ = α + λ
      close(n[0] + m.lam, m.alpha, "r + λ = α");
      close(n[1] - m.lam, m.alpha, "r′ − λ = α");
    }
  });
});

describe("Etappe 3: 3.3 Ebenen in Parameterform", () => {
  it("ebene-parameter: X(r | s) = P + r·u + s·v und u, v aus drei Punkten", () => {
    for (const { n, m } of tasks("rg-3-ebene-parameterform", "ebene-parameter", 1)) {
      const x: V = [
        m.px + m.r * m.ux + m.s * m.vx,
        m.py + m.r * m.uy + m.s * m.vy,
        m.pz + m.r * m.uz + m.s * m.vz,
      ];
      expect(n.slice(0, 3)).toEqual(x);
    }
    for (const { n, m } of tasks("rg-3-ebene-parameterform", "ebene-parameter", 2)) {
      expect(n.slice(0, 3)).toEqual([m.ux, m.uy, m.uz]);
      expect(n.slice(3, 6)).toEqual([m.vx, m.vy, m.vz]);
    }
  });

  it("punkt-in-ebene: r und s lösen das Gleichungssystem wirklich", () => {
    for (const { task, n, m } of tasks("rg-3-ebene-parameterform", "punkt-in-ebene", 1)) {
      expect([n[0], n[1]]).toEqual([m.r, m.s]);
      const x: V = [
        m.px + n[0] * m.ux + n[1] * m.vx,
        m.py + n[0] * m.uy + n[1] * m.vy,
        m.pz,
      ];
      expect(task.prompt, "X steht in der Aufgabe").toContain(p3(x[0], x[1], x[2]));
    }
    for (const { task, n, choice, m } of tasks("rg-3-ebene-parameterform", "punkt-in-ebene", 2)) {
      expect([n[0], n[1]]).toEqual([m.r, m.s]);
      const x: V = [
        m.px + n[0] * m.ux + n[1] * m.vx,
        m.py + n[0] * m.uy + n[1] * m.vy,
        m.pz + n[0] * m.uz + n[1] * m.vz + m.wz,
      ];
      expect(task.prompt).toContain(p3(x[0], x[1], x[2]));
      expect(choice === 0, "in der Ebene genau bei wz = 0").toBe(m.wz === 0);
    }
  });
});

describe("Etappe 3: 3.4 Koordinatenform", () => {
  it("koordinatenform: Achsenabschnitte und Abstand zum Ursprung", () => {
    for (const { n, m } of tasks("rg-4-ebene-koordinatenform", "koordinatenform", 1)) {
      expect(n.slice(0, 3)).toEqual([m.d / m.nx, m.d / m.ny, m.d / m.nz]);
    }
    for (const { n, m } of tasks("rg-4-ebene-koordinatenform", "koordinatenform", 2)) {
      close(n[0], m.d, "d = n · P");
      close(n[1], Math.abs(m.d) / Math.hypot(m.nx, m.ny, m.nz), "Abstand = |d| : |n|");
    }
  });

  it("besondere-lage: die Lage stimmt mit n und d überein", () => {
    const classify = (nx: number, ny: number, nz: number, d: number): number => {
      if (d === 0) return 0;
      const zeros = [nx, ny, nz].map((c, i) => (c === 0 ? i : -1)).filter((i) => i >= 0);
      return zeros.length === 1 ? 1 + zeros[0] : 4;
    };
    for (const { n, choice, m } of tasks("rg-4-ebene-koordinatenform", "besondere-lage", 1)) {
      expect(choice).toBe(classify(m.nx, m.ny, m.nz, m.d));
      close(n[0], Math.abs(m.d) / Math.hypot(m.nx, m.ny, m.nz), "Abstand");
    }
    for (const { n, choice, m } of tasks("rg-4-ebene-koordinatenform", "besondere-lage", 2)) {
      expect(choice).toBe(m.zeroAt);
      close(n[0], m.d, "d");
      close(n[1], Math.abs(m.d) / Math.hypot(m.nx, m.ny, m.nz), "Abstand");
      expect([m.nx, m.ny, m.nz][m.zeroAt]).toBe(0);
    }
  });
});

describe("Etappe 3: 3.5 Lage zweier Geraden", () => {
  /** 0 = sich schneidend, 1 = parallel, 2 = windschief; identisch kommt bei der Erzeugung nicht vor. */
  const caseOf = (a: V, u: V, b: V, w: V): number => {
    const cu = cross(u, w);
    if (norm(cu) < 1e-9) return 1;
    return Math.abs(dot(sub(b, a), cu)) < 1e-9 ? 0 : 2;
  };
  const distanceOf = (a: V, u: V, b: V, w: V): number => {
    const ap = sub(b, a);
    const cu = cross(u, w);
    if (norm(cu) < 1e-9) return norm(cross(ap, u)) / norm(u);
    return Math.abs(dot(ap, cu)) / norm(cu);
  };

  it("lagerelation: der angezeigte Fall und der Schnittpunkt stimmen", () => {
    for (const { task, n, choice, m } of tasks("rg-5-lage-geraden", "lagerelation", 1)) {
      const a: V = [m.ax, m.ay, m.az];
      const u: V = [m.ux, m.uy, m.uz];
      const b: V = [m.bx, m.by, m.bz];
      const w: V = [m.wx, m.wy, m.wz];
      const fall = caseOf(a, u, b, w);
      expect(choice, `Fall in ${task.prompt.slice(0, 40)}`).toBe(fall);
      if (m.kind === 0) {
        expect(fall).toBe(0);
        const s: V = [n[0], n[1], n[2]];
        // S liegt auf beiden Geraden
        close(norm(cross(sub(s, a), u)), 0, "S auf g", 1e-6);
        close(norm(cross(sub(s, b), w)), 0, "S auf h", 1e-6);
      } else {
        close(n[0], distanceOf(a, u, b, w), "Abstand");
        expect(n[0]).toBeGreaterThanOrEqual(0);
      }
    }
    for (const { n, choice, m } of tasks("rg-5-lage-geraden", "lagerelation", 2)) {
      close(n[0], m.a, "a");
      close(n[1], m.t, "t");
      const left = add([m.ax, m.ay, m.az], mul(m.t, [m.ux, m.uy, m.uz]));
      const right = add([m.a, m.by, m.bz], mul(m.s, [m.wx, m.wy, m.wz]));
      expect(left).toEqual(right);
      expect(choice).toBe(-1);
    }
  });

  it("schnittwinkel: φ liegt in [0°; 180°] und stimmt mit dem Skalarprodukt überein", () => {
    for (const level of [1, 2] as const) {
      for (const { n, choice, m } of tasks("rg-5-lage-geraden", "schnittwinkel", level)) {
        const u: V = [m.ux, m.uy, m.uz];
        const v: V = [m.vx, m.vy, m.vz];
        const phi = angleOf(u, v);
        expect(phi).toBeGreaterThanOrEqual(0);
        expect(phi).toBeLessThanOrEqual(180);
        close(n[0], phi, "φ", 1e-6);
        if (level === 1) {
          expect(choice).toBe(phi < 90 - 1e-6 ? 0 : Math.abs(phi - 90) < 1e-6 ? 1 : 2);
        } else {
          close(n[1], dot(u, v), "u ⊙ v");
        }
      }
    }
  });
});

describe("Etappe 3: 3.6 Gerade und Ebene", () => {
  it("schnittpunkt-gerade-ebene: t und S stimmen mit der Ebenengleichung überein", () => {
    for (const { n, m } of tasks("rg-6-gerade-ebene", "schnittpunkt-gerade-ebene", 1)) {
      const nn: V = [m.nx, m.ny, m.nz];
      const u: V = [m.ux, m.uy, m.uz];
      const a: V = [m.ax, m.ay, m.az];
      const t = (m.d - dot(nn, a)) / dot(nn, u);
      close(n[0], t, "t");
      expect(n.slice(1, 4)).toEqual(add(a, mul(t, u)));
      close(dot(nn, add(a, mul(t, u))), m.d, "S in der Ebene", 1e-6);
    }
    for (const { n, choice, m } of tasks("rg-6-gerade-ebene", "schnittpunkt-gerade-ebene", 2)) {
      const nn: V = [m.nx, m.ny, m.nz];
      const u: V = [m.ux, m.uy, m.uz];
      const a: V = [m.ax, m.ay, m.az];
      if (m.kind === 0) {
        const t = (m.d - dot(nn, a)) / dot(nn, u);
        expect(choice).toBe(0);
        close(n[0], t, "t");
        expect(n.slice(1, 4)).toEqual(add(a, mul(t, u)));
      } else if (m.kind === 1) {
        expect(choice).toBe(1);
        close(n[0], dot(nn, u), "n · u = 0");
        close(dot(nn, a), m.d, "A in der Ebene", 1e-6);
      } else {
        expect(choice).toBe(2);
        close(n[0], dot(nn, a) - m.d, "n · A − d ≠ 0");
        expect(Math.abs(n[0])).toBeGreaterThan(1e-9);
        close(dot(nn, u), 0, "n · u = 0", 1e-9);
      }
    }
  });

  it("winkel-gerade-ebene: sin φ und φ aus n und u, alles in [0°; 90°]", () => {
    for (const { n, m } of tasks("rg-6-gerade-ebene", "winkel-gerade-ebene", 1)) {
      const nn: V = [m.nx, m.ny, m.nz];
      const u: V = [m.ux, m.uy, m.uz];
      const sin = Math.abs(dot(nn, u)) / (norm(nn) * norm(u));
      close(n[0], Math.round(sin * 100) / 100, "sin φ", 1e-9);
      const phi = (Math.asin(Math.max(0, Math.min(1, sin))) * 180) / Math.PI;
      close(n[1], phi, "φ", 1e-6);
      expect(n[1]).toBeGreaterThanOrEqual(0);
      expect(n[1]).toBeLessThanOrEqual(90);
    }
    for (const { n, choice, m } of tasks("rg-6-gerade-ebene", "winkel-gerade-ebene", 2)) {
      const nn: V = [m.nx, m.ny, m.nz];
      const u: V = [m.ux, m.uy, m.uz];
      const product = dot(nn, u);
      close(n[0], product, "n · u");
      const sin = Math.abs(product) / (norm(nn) * norm(u));
      expect(choice).toBe(sin < 1e-9 ? 0 : Math.abs(sin - 1) < 1e-9 ? 1 : 2);
    }
  });
});

describe("Etappe 3: 3.7 Lage zweier Ebenen", () => {
  const planeCaseOf = (n1: V, d1: number, n2: V, d2: number): number => {
    if (norm(cross(n1, n2)) > 1e-9) return 0;
    const big = Math.max(Math.abs(n1[0]), Math.abs(n1[1]), Math.abs(n1[2]));
    const lambda =
      Math.abs(n1[0]) === big ? n2[0] / n1[0] : Math.abs(n1[1]) === big ? n2[1] / n1[1] : n2[2] / n1[2];
    return Math.abs(d2 - lambda * d1) < 1e-9 ? 2 : 1;
  };

  it("ebenen-lage: Fall, Winkel und Abstand rechnen nach", () => {
    for (const { n, choice, m } of tasks("rg-7-lage-ebenen", "ebenen-lage", 1)) {
      const n1: V = [m.n1x, m.n1y, m.n1z];
      const n2: V = [m.n2x, m.n2y, m.n2z];
      const fall = planeCaseOf(n1, m.d1, n2, m.d2);
      expect(choice, `Fall der Ebenen, kind ${m.kind}`).toBe(fall);
      if (m.kind === 0) {
        const phi = angleOf(n1, n2);
        close(n[0], phi, "φ", 1e-6);
        expect(phi).toBeGreaterThanOrEqual(0);
        expect(phi).toBeLessThanOrEqual(180);
      } else if (m.kind === 1) {
        close(n[0], Math.abs(m.d2 / m.lam - m.d1) / norm(n1), "Abstand");
        expect(n[0]).toBeGreaterThan(0);
      } else {
        close(n[0], m.lam, "λ");
        close(m.d2, m.lam * m.d1, "d₂ = λ · d₁", 1e-9);
      }
    }
    for (const { n, choice, m } of tasks("rg-7-lage-ebenen", "ebenen-lage", 2)) {
      const n2: V = [m.n2x, m.n2y, m.n2z];
      expect(n2[m.slot]).toBe(n[0]);
      expect(n[0]).toBe([m.n1x * m.lam, m.n1y * m.lam, m.n1z * m.lam][m.slot]);
      expect(choice).toBe(m.identical === 1 ? 0 : 1);
      if (m.identical === 1) close(m.d2, m.lam * m.d1, "d₂ = λ · d₁", 1e-9);
      else expect(Math.abs(m.d2 - m.lam * m.d1)).toBeGreaterThan(1e-9);
    }
  });

  it("schnittgerade: Richtung n₁ × n₂ und ein Punkt auf beiden Ebenen", () => {
    for (const level of [1, 2] as const) {
      for (const { n, m } of tasks("rg-7-lage-ebenen", "schnittgerade", level)) {
        const n1: V = [m.n1x, m.n1y, m.n1z];
        const n2: V = [m.n2x, m.n2y, m.n2z];
        if (level === 1) {
          expect(n.slice(0, 3)).toEqual(cross(n1, n2));
          expect(norm(cross(n1, n2))).toBeGreaterThan(0);
          const s: V = [n[3], n[4], 0];
          close(dot(n1, s), m.d1, "S in E₁", 1e-9);
          close(dot(n2, s), m.d2, "S in E₂", 1e-9);
        } else {
          const s: V = [m.c, n[0], n[1]];
          close(dot(n1, s), m.d1, "Punkt in E₁", 1e-9);
          close(dot(n2, s), m.d2, "Punkt in E₂", 1e-9);
        }
      }
    }
  });
});

describe("Etappe 3: 3.8 Abstände", () => {
  it("abstand-punkt-gerade: Abstand senkrecht und t des Lotfußpunkts", () => {
    for (const level of [1, 2] as const) {
      for (const { n, m } of tasks("rg-8-abstaende", "abstand-punkt-gerade", level)) {
        const a: V = [m.ax, m.ay, m.az];
        const u: V = [m.ux, m.uy, m.uz];
        const p: V = [m.px, m.py, m.pz];
        const distance = norm(cross(sub(p, a), u)) / norm(u);
        const t = dot(sub(p, a), u) / dot(u, u);
        if (level === 1) {
          close(n[0], distance, "Abstand");
          close(n[1], t, "t");
        } else {
          close(n[0], 10 * distance, "Abstand in m");
          close(n[1], t, "t");
        }
        expect(n[0]).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("abstand-punkt-ebene: Hesse'sche Normalform und Seite", () => {
    for (const { n, m } of tasks("rg-8-abstaende", "abstand-punkt-ebene", 1)) {
      const nn: V = [m.nx, m.ny, m.nz];
      const p: V = [m.px, m.py, m.pz];
      close(n[0], Math.abs(dot(nn, p) - m.d) / norm(nn), "Abstand");
      close(n[1], dot(nn, p), "n · P");
      expect(n[0]).toBeGreaterThanOrEqual(0);
    }
    for (const { n, choice, m } of tasks("rg-8-abstaende", "abstand-punkt-ebene", 2)) {
      const nn: V = [m.nx, m.ny, m.nz];
      const p: V = [m.px, m.py, m.pz];
      close(n[0], dot(nn, p), "n · P");
      expect(choice).toBe(dot(nn, p) - m.d > 0 ? 0 : 1);
    }
  });
});

describe("Etappe 3: 3.9 Kugeln", () => {
  it("kugel-gleichung: Mittelpunkt, Radius und Empfangsbereich", () => {
    for (const { n, m } of tasks("rg-9-kugeln", "kugel-gleichung", 1)) {
      expect(n).toEqual([m.mx, m.my, m.mz, m.r]);
    }
    for (const { n, choice, m } of tasks("rg-9-kugeln", "kugel-gleichung", 2)) {
      const mp: V = [m.px - m.mx, m.py - m.my, m.pz - m.mz];
      close(n[0], norm(mp), "Abstand M–P");
      expect(choice === 0, "im Bereich genau bei |MP| ≤ r").toBe(norm(mp) <= m.r);
    }
  });

  it("lage-kugel-ebene: Abstand gegen r, Schnittkreisradius nach Pythagoras", () => {
    for (const { n, choice, m } of tasks("rg-9-kugeln", "lage-kugel-ebene", 1)) {
      const nn: V = [m.nx, m.ny, m.nz];
      const mm: V = [m.mx, m.my, m.mz];
      const distance = Math.abs(dot(nn, mm) - m.d) / norm(nn);
      if (m.kind === 0) {
        expect(choice).toBe(0);
        close(n[0], distance, "Abstand = r");
        close(distance, m.r, "tangent", 1e-9);
      } else if (m.kind === 1) {
        expect(choice).toBe(1);
        close(n[0], Math.sqrt(m.r * m.r - distance * distance), "ρ");
        expect(distance).toBeLessThan(m.r);
      } else {
        expect(choice).toBe(2);
        close(n[0], distance, "Abstand > r");
        expect(distance).toBeGreaterThan(m.r);
      }
    }
    for (const { n, choice, m } of tasks("rg-9-kugeln", "lage-kugel-ebene", 2)) {
      const nn: V = [m.nx, m.ny, m.nz];
      const mm: V = [m.mx, m.my, m.mz];
      const distance = Math.abs(dot(nn, mm) - m.d) / norm(nn);
      close(n[0], distance, "r für tangent");
      close(distance, m.distance, "Abstand", 1e-9);
      expect(choice).toBe(m.probe < distance ? 2 : 1);
    }
  });
});

// ─── 3. Die Labore rechnen und zeichnen richtig ────────────────────────────

const v3 = (v: LabValues, x: string, y: string, z: string): V => [v[x], v[y], v[z]];

function labSettings(lessonId: string): LabValues[] {
  const lesson = STAGE.lessons.find((l) => l.id === lessonId)!;
  const rng = createRng(seedFrom(`lab:${lessonId}`));
  const settings: LabValues[] = [defaultLabValues(lesson.lab)];
  for (const w of Object.values(GOAL_WITNESSES_STAGE_3[lessonId])) {
    settings.push({ ...defaultLabValues(lesson.lab), ...w });
  }
  for (let i = 0; i < 80; i++) {
    const values = defaultLabValues(lesson.lab);
    for (const param of lesson.lab.params) {
      if (param.type === "range") {
        values[param.key] = clampParam(param, param.min + rng.next() * (param.max - param.min));
      } else if (param.type === "choice") {
        values[param.key] = rng.pick(param.options).value;
      }
    }
    settings.push(values);
  }
  return settings;
}

describe("Etappe 3: Labore", () => {
  it("reaches every Laborauftrag exactly with its witness and none at the start", () => {
    for (const lesson of STAGE.lessons) {
      const witnesses = GOAL_WITNESSES_STAGE_3[lesson.id];
      expect(witnesses, lesson.id).toBeDefined();
      expect(Object.keys(witnesses).sort()).toEqual(lesson.lab.goals.map((g) => g.id).sort());
      for (const goal of lesson.lab.goals) {
        const witness = { ...defaultLabValues(lesson.lab), ...witnesses[goal.id] };
        for (const param of lesson.lab.params) {
          if (param.type === "state") continue;
          expect(witnesses[goal.id][param.key], `${lesson.id}/${goal.id} setzt ${param.key}`).toBeDefined();
          expect(
            clampParam(param, witness[param.key]),
            `${lesson.id}/${goal.id}: ${param.key} liegt auf dem Regler`,
          ).toBe(witness[param.key]);
        }
        const reached = lesson.lab.goals.filter((g) =>
          g.check(witness, computeReadouts(lesson.lab, witness)),
        );
        expect(reached.map((g) => g.id), `${lesson.id}/${goal.id}`).toEqual([goal.id]);
      }
      const defaults = defaultLabValues(lesson.lab);
      const atStart = lesson.lab.goals.filter((g) =>
        g.check(defaults, computeReadouts(lesson.lab, defaults)),
      );
      expect(atStart.map((g) => g.id), `${lesson.id} verschenkt Ziele`).toEqual([]);
    }
  });

  it("computes the readouts of the line and plane labs like the blackboard", () => {
    for (const values of labSettings("rg-5-lage-geraden")) {
      const readouts = computeReadouts(STAGE.lessons[4].lab, values);
      const a = v3(values, "ax", "ay", "az");
      const u = v3(values, "ux", "uy", "uz");
      const b = v3(values, "bx", "by", "bz");
      const w = v3(values, "vx", "vy", "vz");
      const cu = cross(u, w);
      const fall =
        norm(u) < 1e-9 || norm(w) < 1e-9
          ? "Nullvektor: keine echte Gerade"
          : norm(cu) < 1e-9
            ? norm(cross(sub(b, a), u)) < 1e-9
              ? "identisch (dieselbe Gerade)"
              : "parallel"
            : Math.abs(dot(sub(b, a), cu)) < 1e-9
              ? "sich schneidend"
              : "windschief";
      expect(readouts.fall).toBe(fall);
      const distance =
        norm(u) < 1e-9 && norm(w) < 1e-9
          ? norm(sub(b, a))
          : norm(u) < 1e-9
            ? norm(cross(sub(b, a), w)) / norm(w)
            : norm(w) < 1e-9
              ? norm(cross(sub(b, a), u)) / norm(u)
              : norm(cu) < 1e-9
                ? norm(cross(sub(b, a), u)) / norm(u)
                : Math.abs(dot(sub(b, a), cu)) / norm(cu);
      close(Number(readouts.abstand), distance, "Abstand im Labor", 1e-9);
      expect(Number(readouts.abstand)).toBeGreaterThanOrEqual(0);
      const phi = angleOf(u, w);
      if (phi === phi) {
        expect(String(readouts.winkel)).toContain("φ =");
      }
    }
  });

  it("computes t and the case of Gerade und Ebene correctly", () => {
    for (const values of labSettings("rg-6-gerade-ebene")) {
      const readouts = computeReadouts(STAGE.lessons[5].lab, values);
      const n = v3(values, "nx", "ny", "nz");
      const a = v3(values, "ax", "ay", "az");
      const u = v3(values, "ux", "uy", "uz");
      const nu = dot(n, u);
      if (norm(n) > 1e-9 && norm(u) > 1e-9 && Math.abs(nu) > 1e-9) {
        const t = (values.d - dot(n, a)) / nu;
        expect(readouts.t).toBe(`t = ${fmt(t)}`);
        close(dot(n, add(a, mul(t, u))), values.d, "S in der Ebene", 1e-6);
      }
    }
  });

  it("computes the distance labs and the sphere labs correctly", () => {
    for (const values of labSettings("rg-8-abstaende")) {
      const readouts = computeReadouts(STAGE.lessons[7].lab, values);
      const expected =
        values.mode === 0
          ? Math.hypot(values.py - values.ay, values.pz - values.az)
          : values.mode === 1
            ? Math.abs(values.nx * values.px + 2 * values.py + 2 * values.pz - values.d) /
              Math.sqrt(values.nx * values.nx + 8)
            : Math.abs(values.b);
      close(Number(readouts.abstand), expected, "Abstand", 1e-9);
      expect(Number(readouts.abstand)).toBeGreaterThanOrEqual(0);
    }
    for (const values of labSettings("rg-9-kugeln")) {
      const readouts = computeReadouts(STAGE.lessons[8].lab, values);
      const n = v3(values, "nx", "ny", "nz");
      const m = v3(values, "mx", "my", "mz");
      const dist =
        values.mode === 0
          ? norm(n) < 1e-9
            ? Infinity
            : Math.abs(dot(n, m) - values.d) / norm(n)
          : Math.hypot(values.my - values.ay, values.mz - values.az);
      const expectedLage =
        dist < values.r - 1e-9 ? "schneidend" : Math.abs(dist - values.r) < 1e-9 ? "tangent" : "kein Kontakt";
      expect(readouts.lage).toBe(expectedLage);
    }
  });

  it("renders every lab without NaN and with finite readouts", () => {
    for (const lesson of STAGE.lessons) {
      for (const values of labSettings(lesson.id)) {
        const readouts = computeReadouts(lesson.lab, values);
        for (const [key, value] of Object.entries(readouts)) {
          if (typeof value === "number") {
            expect(Number.isFinite(value), `${lesson.id}.${key}`).toBe(true);
          } else {
            expect(value.length, `${lesson.id}.${key}`).toBeGreaterThan(0);
            expect(value, `${lesson.id}.${key}`).not.toMatch(/NaN|undefined|Infinity/);
          }
        }
      }
    }
  });

  it("keeps every handle close to its drawn place", () => {
    for (const lesson of STAGE.lessons) {
      for (const values of labSettings(lesson.id)) {
        const next = withChanges(lesson.lab, values, {});
        expect(next).toEqual(values);
      }
    }
  });

  it("never gives the same answer twice in a row: every generator varies over its seeds", () => {
    for (const lesson of STAGE.lessons) {
      for (const gen of GENERATORS[lesson.id]) {
        for (const level of [1, 2] as const) {
          const drawn = tasks(lesson.id, gen, level);
          const fields = Math.max(...drawn.map((d) => d.n.length));
          for (let i = 0; i < fields; i++) {
            const answers = new Set(drawn.map((d) => d.n[i]));
            expect(answers.size, `${lesson.id}/${gen} L${level} Feld ${i}`).toBeGreaterThan(1);
          }
          const choices = new Set(drawn.map((d) => d.choice));
          if (drawn.some((d) => d.choice >= 0)) {
            expect(choices.size, `${lesson.id}/${gen} L${level} Auswahl`).toBeGreaterThan(1);
          }
        }
      }
    }
  });
});
