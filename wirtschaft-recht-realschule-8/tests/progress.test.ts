import { describe, expect, it } from "vitest";
import { CORE_LESSONS, findLesson, LESSONS } from "../src/curriculum";
import { goalsOf } from "../src/labs/registry";
import {
  completion,
  freshProgress,
  goalKey,
  isComplete,
  keyOf,
  labReached,
  noteDocumented,
  parseProgress,
} from "../src/storage/progress";

const plain = LESSONS.find((l) => !l.lab && !l.practice);
const withLab = LESSONS.find((l) => l.lab && !l.practice);
const withPractice = LESSONS.find((l) => l.practice);

describe("learning evidence and local recovery", () => {
  it("counts a lesson only when every kind of evidence is there", () => {
    if (!plain) throw new Error("a lesson without lab and practice is needed");
    const p = freshProgress();
    const key = keyOf(plain.id, 1);
    p.quiz.push(plain.id);
    p.workshop.push(plain.id);
    p.casework.push(plain.id);
    expect(isComplete(p, plain.id)).toBe(false);
    p.assessed.push(key);
    expect(isComplete(p, plain.id)).toBe(false);
    p.drafts[key] = "Das Recht schützt, indem es Regeln festlegt.";
    expect(isComplete(p, plain.id)).toBe(true);
    expect(completion(p).done).toBe(1);
    expect(completion(p).total).toBe(CORE_LESSONS.length);
  });
  it("needs the case, the quick check and the sorting on top of the written reasoning", () => {
    if (!plain) throw new Error("a lesson without lab and practice is needed");
    const key = keyOf(plain.id, 1);
    for (const missing of ["quiz", "workshop", "casework"] as const) {
      const p = freshProgress();
      for (const list of ["quiz", "workshop", "casework"] as const)
        if (list !== missing) p[list].push(plain.id);
      p.assessed.push(key);
      p.drafts[key] = "Eine ausführliche eigene Begründung.";
      expect(isComplete(p, plain.id), missing).toBe(false);
    }
  });
  it("requires every lab assignment the lesson asks for", () => {
    if (!withLab) throw new Error("a lesson with a lab is needed");
    const p = freshProgress();
    const goals = goalsOf(withLab);
    expect(goals.length).toBeGreaterThan(0);
    expect(labReached(p, withLab.id)).toBe(false);
    for (const g of goals.slice(0, -1)) p.goals.push(goalKey(withLab.id, g.id));
    expect(labReached(p, withLab.id)).toBe(goals.length === 1);
    p.goals.push(goalKey(withLab.id, goals[goals.length - 1].id));
    expect(labReached(p, withLab.id)).toBe(true);
  });
  it("requires three self-solved tasks on level 1 where a lesson has numbers", () => {
    if (!withPractice) throw new Error("a lesson with numbers is needed");
    const p = freshProgress();
    const key = keyOf(withPractice.id, 1);
    p.quiz.push(withPractice.id);
    p.workshop.push(withPractice.id);
    p.casework.push(withPractice.id);
    p.assessed.push(key);
    p.drafts[key] = "Eine ausführliche eigene Begründung.";
    for (const g of goalsOf(withPractice)) p.goals.push(goalKey(withPractice.id, g.id));
    p.solved[key] = 2;
    expect(isComplete(p, withPractice.id)).toBe(false);
    p.solved[key] = 3;
    expect(isComplete(p, withPractice.id)).toBe(true);
    // Transfer tasks on level 2 never replace level 1.
    p.solved[key] = 0;
    p.solved[keyOf(withPractice.id, 2)] = 3;
    expect(isComplete(p, withPractice.id)).toBe(false);
  });
  it("sanitizes corrupt storage and keeps optional lessons out of the denominator", () => {
    expect(parseProgress("bad")).toEqual(freshProgress());
    expect(parseProgress("[]")).toEqual(freshProgress());
    expect(parseProgress(null)).toEqual(freshProgress());
    const id = LESSONS[0].id;
    const optional = LESSONS.find((l) => l.optional);
    const p = parseProgress(
      JSON.stringify({
        active: optional?.id ?? id,
        quiz: [id, id, "bad"],
        casework: [id, 5],
        goals: ["nope:nope", `${id}:nope`],
        drafts: { [keyOf(id, 1)]: "x".repeat(9000), bad: "x" },
        assessed: [keyOf(id, 1), keyOf(LESSONS[1].id, 1)],
        solved: { [keyOf(id, 1)]: 900, [keyOf(LESSONS[1].id, 1)]: -1 },
        serial: { [keyOf(id, 1)]: 999999999 },
      }),
    );
    expect(p.active).toBe(optional?.id ?? id);
    expect(p.extra).toBe(false);
    expect(p.quiz).toEqual([id]);
    expect(p.casework).toEqual([id]);
    expect(p.goals).toEqual([]);
    expect(p.drafts[keyOf(id, 1)]).toHaveLength(8000);
    expect(p.assessed).toEqual([keyOf(id, 1)]);
    expect(p.solved).toEqual({ [keyOf(id, 1)]: 3 });
    expect(p.serial).toEqual({ [keyOf(id, 1)]: 1000000 });
    expect(completion(p).total).toBe(CORE_LESSONS.length);
  });
  it("only accepts lab assignments that exist for that lesson", () => {
    if (!withLab) throw new Error("a lesson with a lab is needed");
    const goal = goalsOf(withLab)[0];
    const p = parseProgress(
      JSON.stringify({ goals: [goalKey(withLab.id, goal.id), goalKey(withLab.id, "erfunden")] }),
    );
    expect(p.goals).toEqual([goalKey(withLab.id, goal.id)]);
  });
  it("keeps a documented external activity separate from lesson completion", () => {
    const p = freshProgress();
    p.note = {
      question: "x".repeat(25),
      source: "x".repeat(25),
      observation: "x".repeat(25),
      conclusion: "x".repeat(25),
      performed: false,
    };
    expect(noteDocumented(p.note)).toBe(false);
    p.note.performed = true;
    expect(noteDocumented(p.note)).toBe(true);
    expect(completion(p).done).toBe(0);
  });
  it("opens every lesson by id", () => {
    for (const lesson of LESSONS) expect(findLesson(lesson.id)).toBeDefined();
  });
});
