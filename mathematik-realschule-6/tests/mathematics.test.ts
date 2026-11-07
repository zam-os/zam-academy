import { describe, expect, it } from "vitest";
import { ALL_LESSONS, findLessonById } from "../src/curriculum";
import { createRng } from "../src/exercises/rng";
import { fillHeight } from "../src/lab/views-proportion";
import { FIGURES, familyPoints } from "../src/lab/views-spiegelung";
import { classifyFamilyFigure } from "../src/curriculum/stage-2-achsenspiegelung";
import type { ExerciseTask, NumberField } from "../src/model/types";
import {
  addFractions,
  decimalText,
  divFractions,
  expansion,
  fractionKind,
  isFinite25,
  isSymmetryAxis,
  lcm,
  mirrorPoint,
  mixedText,
  mulFractions,
  reduce,
  roundSchool,
  signedArea,
  subFractions,
} from "../src/models";

const numbers = (task: ExerciseTask) =>
  task.fields.filter((f): f is NumberField => f.kind === "number");
const generator = (lesson: string, id: string) =>
  findLessonById(lesson)!.lesson.exercises.find((g) => g.id === id)!;
const close = (a: number, b: number) => expect(a).toBeCloseTo(b, 6);

describe("Bruchrechnung: unabhängige Gegenprobe über Dezimalwerte", () => {
  it("reduces, adds, subtracts, multiplies and divides as the decimal values say", () => {
    for (let a = -6; a <= 6; a++)
      for (let b = 1; b <= 8; b++)
        for (let c = 1; c <= 6; c++)
          for (let d = 1; d <= 8; d++) {
            const [rz, rm] = reduce(a, b);
            close(rz / rm, a / b);
            const check = (
              [z, m]: [number, number],
              value: number,
            ) => {
              expect(m).toBeGreaterThan(0);
              close(z / m, value);
            };
            check(addFractions(a, b, c, d), a / b + c / d);
            check(subFractions(a, b, c, d), a / b - c / d);
            check(mulFractions(a, b, c, d), (a / b) * (c / d));
            check(divFractions(a, b, c, d), a / b / (c / d));
          }
    expect(lcm(4, 6)).toBe(12);
    expect(reduce(6, 8)).toEqual([3, 4]);
    expect(reduce(-6, 8)).toEqual([-3, 4]);
  });

  it("finds finite and periodic decimals exactly as long division does", () => {
    expect(decimalText(3, 8)).toBe("0,375");
    expect(decimalText(1, 3)).toBe("0,3̅");
    expect(decimalText(1, 6)).toBe("0,16̅");
    expect(decimalText(5, 1)).toBe("5");
    expect(decimalText(-1, 4)).toBe("−0,25");
    expect(expansion(2, 7).period).toBe("285714");
    for (let d = 2; d <= 40; d++)
      for (let n = 1; n < d; n++) {
        const e = expansion(n, d);
        expect(e.period === "", `${n}/${d}`).toBe(isFinite25(n, d));
        // The digits reproduce the value.
        const text = (e.pre + e.period.repeat(20)).slice(0, 12);
        close(Number(`0.${text}`), n / d);
      }
  });

  it("names and converts fraction forms", () => {
    expect(mixedText(11, 4)).toBe("2 3/4");
    expect(mixedText(12, 4)).toBe("3");
    expect(mixedText(3, 4)).toBe("3/4");
    expect(mixedText(-7, 4)).toBe("−1 3/4");
    expect(fractionKind(3, 4)).toBe("echter Bruch");
    expect(fractionKind(7, 4)).toBe("unechter Bruch");
    expect(fractionKind(8, 4)).toBe("unechter Bruch, genau ganze Zahl");
  });

  it("rounds as school teaches, also at the binary traps", () => {
    expect(roundSchool(2.96, 1)).toBe(3);
    expect(roundSchool(3.146, 2)).toBe(3.15);
    expect(roundSchool(4.5, 0)).toBe(5);
    expect(roundSchool(1.005, 2)).toBe(1.01);
    expect(roundSchool(2.675, 2)).toBe(2.68);
    expect(roundSchool(-1.25, 1)).toBe(-1.3);
    expect(roundSchool(0.449, 1)).toBe(0.4);
  });
});

describe("Aufgaben: Rechnung der Generatoren gegengerechnet", () => {
  const seeds = Array.from({ length: 40 }, (_, i) => i + 1);

  it("adds, multiplies and divides fractions in the tasks correctly", () => {
    for (const seed of seeds) {
      const add = generator("rz-12-brueche-addieren", "summe").make(createRng(seed), 1);
      const { a, b, c0, d } = add.meta!;
      const [z, m] = numbers(add).map((f) => f.answer);
      close(z / (m ?? 1), a / b + c0 / d);

      const mul = generator("rz-13-brueche-multiplizieren", "bruch-mal-bruch").make(createRng(seed), 1);
      const p = mul.meta!;
      const [mz, mm] = numbers(mul).map((f) => f.answer);
      close(mz / (mm ?? 1), (p.a / p.b) * (p.c0 / p.d));

      const div = generator("rz-14-brueche-dividieren", "kehrwert").make(createRng(seed), 1);
      const q = div.meta!;
      const [dz, dm] = numbers(div).map((f) => f.answer);
      close(dz / (dm ?? 1), q.a / q.b / (q.c0 / q.d));
    }
  });

  it("computes every area and volume by its formula", () => {
    for (const seed of seeds) {
      const tri = generator("fl-2-dreieck", "flaeche").make(createRng(seed), 1);
      close(numbers(tri)[0].answer, (tri.meta!.g * tri.meta!.h) / 2);
      const trap = generator("fl-3-trapez", "flaeche").make(createRng(seed), 1);
      close(numbers(trap)[0].answer, ((trap.meta!.a + trap.meta!.c0) * trap.meta!.h) / 2);
      const kite = generator("fl-4-drachen-raute", "flaeche").make(createRng(seed), 1);
      close(numbers(kite)[0].answer, (kite.meta!.e * kite.meta!.f) / 2);
      const box = generator("fl-6-oberflaeche", "quader").make(createRng(seed), 1);
      const { a, b, c0 } = box.meta!;
      // Independently: sum all six faces.
      close(numbers(box)[0].answer, a * b + a * b + a * c0 + a * c0 + b * c0 + b * c0);
      const vol = generator("rg-3-quader-volumen", "volumen").make(createRng(seed), 1);
      close(numbers(vol)[0].answer, vol.meta!.a * vol.meta!.b * vol.meta!.h);
    }
  });

  it("gives triangle and parallelogram heights that really can exist", () => {
    for (const seed of seeds) {
      const par = generator("fl-1-parallelogramm", "flaeche").make(createRng(seed), 2);
      const { side, heightOnSide, longSide } = par.meta!;
      // A height is never longer than the other side.
      expect(heightOnSide).toBeLessThanOrEqual(longSide);
      expect(numbers(par)[1].answer).toBeLessThanOrEqual(side + 0.01);
      const tri = generator("fl-2-dreieck", "hoehen").make(createRng(seed), 2);
      expect(tri.meta!.ha).toBeLessThanOrEqual(tri.meta!.b);
      const rhombus = generator("fl-4-drachen-raute", "diagonale").make(createRng(seed), 2);
      const k = rhombus.meta!.k;
      // Half diagonals 3k and 4k: the side from Pythagoras is the side the task names.
      close(Math.hypot(3 * k, 4 * k), 5 * k);
      close(numbers(rhombus)[0].answer, (6 * k * 8 * k) / 2);
    }
  });

  it("solves equations whose solution passes the check", () => {
    for (const seed of seeds) {
      const plus = generator("tg-6-aequivalenzumformungen", "plus").make(createRng(seed), 1);
      expect(numbers(plus)[0].answer + plus.meta!.b).toBe(plus.meta!.x + plus.meta!.b);
      const said = generator("tg-5-gleichungen-strategien", "uebersetzen").make(createRng(seed), 1);
      const { a, b, x } = said.meta!;
      expect(a * numbers(said)[0].answer + b).toBe(a * x + b);
    }
  });

  it("computes percent tasks by W : G = p : 100", () => {
    for (const seed of seeds) {
      const w = generator("dp-5-prozent-rechnen", "prozentwert").make(createRng(seed), 1);
      close(numbers(w)[1].answer / w.meta!.G, w.meta!.p / 100);
      const g = generator("dp-5-prozent-rechnen", "grundwert").make(createRng(seed), 1);
      close((numbers(g)[0].answer * g.meta!.p) / 100, (g.meta!.G * g.meta!.p) / 100);
      const s = generator("dp-5-prozent-rechnen", "prozentsatz").make(createRng(seed), 1);
      expect(numbers(s)[0].answer).toBe(s.meta!.p);
    }
  });

  it("keeps the shares of a survey at no more than 100 %", () => {
    for (const seed of seeds) {
      const survey = generator("dp-4-prozent-begriffe", "anteil").make(createRng(seed), 2);
      const { G, p, q } = survey.meta!;
      const [rest, people] = numbers(survey).map((f) => f.answer);
      expect(rest).toBeGreaterThan(0);
      expect(p + q + rest).toBe(100);
      expect(people).toBe((G * rest) / 100);
    }
  });

  it("keeps fractions, probabilities of a share and counts plausible", () => {
    for (const lesson of ALL_LESSONS)
      for (const g of lesson.exercises)
        for (const level of [1, 2] as const)
          for (const seed of seeds) {
            const task = g.make(createRng(seed), level);
            for (const f of numbers(task))
              if (/Anzahl|Gläser|Busse|Kinder|Personen|Eimer|Stücke/.test(f.label))
                expect(Number.isInteger(f.answer) && f.answer >= 0, `${lesson.id}/${g.id}: ${f.label} = ${f.answer}`).toBe(true);
          }
  });
});

describe("Spiegelung und Symmetrie", () => {
  it("mirrors twice back to the start, keeps lengths and reverses the sense of rotation", () => {
    const tri = [
      { x: 1, y: 2 },
      { x: 4, y: 3 },
      { x: 2, y: 5 },
    ];
    for (const deg of [0, 30, 45, 90, 135]) {
      const image = tri.map((p) => mirrorPoint(p.x, p.y, deg));
      image.forEach((p, i) => {
        const back = mirrorPoint(p.x, p.y, deg);
        close(back.x, tri[i].x);
        close(back.y, tri[i].y);
      });
      close(
        Math.hypot(image[0].x - image[1].x, image[0].y - image[1].y),
        Math.hypot(tri[0].x - tri[1].x, tri[0].y - tri[1].y),
      );
      close(signedArea(image), -signedArea(tri));
    }
  });

  it("states the right number of axes for every figure of the lab", () => {
    for (const figure of FIGURES) {
      const axes = Array.from({ length: 12 }, (_, i) => i * 15).filter((deg) =>
        isSymmetryAxis(figure.points, deg),
      );
      expect(axes.length, figure.name).toBe(figure.axes);
    }
  });

  it("classifies each family figure so that its promised axes are real axes", () => {
    for (let a = 1; a <= 7; a++)
      for (let b = 1; b <= 7; b++)
        for (let s = -2; s <= 2; s++) {
          // Triangles: independently, an axis exists exactly when two sides are equal.
          const [A, B, C] = familyPoints(2, a, b, s);
          const sides = [
            Math.hypot(A.x - B.x, A.y - B.y),
            Math.hypot(B.x - C.x, B.y - C.y),
            Math.hypot(C.x - A.x, C.y - A.y),
          ];
          const equal = sides.some((x, i) =>
            sides.some((y, j) => i < j && Math.abs(x - y) < 1e-9),
          );
          expect(
            classifyFamilyFigure({ family: 2, a, b, s }).axes,
            `triangle ${a}, ${b}, ${s}`,
          ).toBe(equal ? 1 : 0);
        }
    for (const family of [0, 1])
      for (let a = 1; a <= 7; a++)
        for (let b = 1; b <= 7; b++)
          for (let s = -2; s <= 2; s++) {
            const { axes, list, name } = classifyFamilyFigure({ family, a, b, s });
            const points = familyPoints(family, a, b, s);
            const degs = [90, 0, 45, 135].filter((deg) =>
              isSymmetryAxis(points, deg),
            );
            const where = `${name}: family ${family}, ${a}, ${b}, ${s}`;
            expect(degs.length, where).toBe(axes);
            expect(list.includes("senkrecht"), where).toBe(degs.includes(90));
            expect(list.includes("waagerecht"), where).toBe(degs.includes(0));
          }
  });
});

describe("Füllgraphen", () => {
  it("rises from 0 to 10 and bends where the vessel changes its width", () => {
    for (const vessel of [0, 1, 2]) {
      expect(fillHeight(vessel, 0)).toBe(0);
      close(fillHeight(vessel, 10), 10);
      for (let t = 0; t < 10; t += 0.5)
        expect(fillHeight(vessel, t + 0.5)).toBeGreaterThan(fillHeight(vessel, t));
    }
    close(fillHeight(1, 7.5), 5);
    close(fillHeight(2, 2.5), 5);
    // Constant inflow: the wide part is three times as wide and takes three times as long.
    close(7.5 / 2.5, 3);
  });
});
