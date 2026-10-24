import { describe, expect, it } from "vitest";
import { LESSONS, WORKSHOPS } from "../src/curriculum";
import { fmt } from "../src/html";
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
  it("formats German numeric readouts", () => {
    expect(fmt(5.5)).toBe("5,5");
    expect(fmt(-2.5)).toBe("−2,5");
  });
});
