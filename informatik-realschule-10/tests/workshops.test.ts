import { describe, expect, it } from "vitest";
import { LESSONS, WORKSHOPS } from "../src/curriculum";
import { fmt } from "../src/html";
import { rsLatch } from "../src/labs/logic";
import { checkWorkshop, workshopSolved } from "../src/workshop";

describe("lesson-specific case workshops", () => {
  it("covers every lesson exactly once", () => {
    expect(Object.keys(WORKSHOPS).sort()).toEqual(
      LESSONS.map((lesson) => lesson.id).sort(),
    );
  });
  it.each(LESSONS)(
    "has an initially open, reachable and discriminating goal: $id",
    (lesson) => {
      const workshop = WORKSHOPS[lesson.id];
      expect(workshop.entries.length).toBeGreaterThanOrEqual(3);
      expect(workshop.categories.length).toBeGreaterThanOrEqual(2);
      const witness = workshop.entries.map((entry) => entry.target);
      expect(
        workshopSolved(
          workshop,
          workshop.entries.map(() => -1),
        ),
      ).toBe(false);
      expect(workshopSolved(workshop, [])).toBe(false);
      expect(workshopSolved(workshop, witness)).toBe(true);
      for (const [index, entry] of workshop.entries.entries()) {
        expect(entry.target).toBeGreaterThanOrEqual(0);
        expect(entry.target).toBeLessThan(workshop.categories.length);
        const wrong = [...witness];
        wrong[index] = (entry.target + 1) % workshop.categories.length;
        expect(workshopSolved(workshop, wrong)).toBe(false);
        expect(checkWorkshop(workshop, wrong).filter(Boolean)).toHaveLength(
          witness.length - 1,
        );
      }
    },
  );
  it("distinguishes set and hold operations even when the stored bit is already 1", () => {
    const workshop = WORKSHOPS["it10-speicher"];
    const set = workshop.entries.find(
      (entry) => entry.text === "S = 1, R = 0",
    )!;
    const hold = workshop.entries.find(
      (entry) => entry.text === "S = 0, R = 0",
    )!;
    expect(rsLatch(1, 1, 0).q).toBe(1);
    expect(rsLatch(1, 0, 0).q).toBe(1);
    expect(workshop.categories[set.target]).toBe("Setzen (Q = 1)");
    expect(workshop.categories[hold.target]).toBe("Halten (Q bleibt 1)");
    expect(workshop.instruction).toContain("Operation");
  });
  it("formats German numeric readouts", () => {
    expect(fmt(5.5)).toBe("5,5");
    expect(fmt(-2.5)).toBe("−2,5");
  });
});
