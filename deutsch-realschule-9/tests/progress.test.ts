import { describe, expect, it } from "vitest";
import { CORE_LESSONS, findLesson, LESSONS } from "../src/curriculum";
import { REQUIRED_ROUNDS } from "../src/exercises/practice";
import { looksLikeDraft } from "../src/format";
import { completion, freshProgress, isComplete, keyOf, mergeProgress, parseProgress } from "../src/storage/progress";

const plain = LESSONS.find((l) => !l.practice);
const withPractice = LESSONS.find((l) => l.practice);

describe("learning evidence and local recovery", () => {
  it("counts a lesson only when every kind of evidence is there", () => {
    if (!plain) throw new Error("a lesson without practice is needed");
    const p = freshProgress();
    const key = keyOf(plain.id, 1);
    p.quiz.push(plain.id);
    p.workshop.push(plain.id);
    p.casework.push(plain.id);
    expect(isComplete(p, plain.id)).toBe(false);
    p.assessed.push(key);
    expect(isComplete(p, plain.id)).toBe(false);
    p.drafts[key] = "Ein Komma trennt den Nebensatz vom Hauptsatz.";
    expect(isComplete(p, plain.id)).toBe(true);
    expect(completion(p).done).toBe(1);
    expect(completion(p).total).toBe(CORE_LESSONS.length);
  });
  it("needs the case, the quick check and the workshop on top of the written text", () => {
    if (!plain) throw new Error("a lesson without practice is needed");
    const key = keyOf(plain.id, 1);
    for (const missing of ["quiz", "workshop", "casework"] as const) {
      const p = freshProgress();
      for (const list of ["quiz", "workshop", "casework"] as const)
        if (list !== missing) p[list].push(plain.id);
      p.assessed.push(key);
      p.drafts[key] = "Ein ausführlicher eigener Text zur Aufgabe.";
      expect(isComplete(p, plain.id), missing).toBe(false);
    }
  });
  it("requires two solved practice rounds on level 1 where a lesson has them", () => {
    if (!withPractice) throw new Error("a lesson with practice is needed");
    const p = freshProgress();
    const key = keyOf(withPractice.id, 1);
    p.quiz.push(withPractice.id);
    p.workshop.push(withPractice.id);
    p.casework.push(withPractice.id);
    p.assessed.push(key);
    p.drafts[key] = "Ein ausführlicher eigener Text zur Aufgabe.";
    p.solved[key] = REQUIRED_ROUNDS - 1;
    expect(isComplete(p, withPractice.id)).toBe(false);
    p.solved[key] = REQUIRED_ROUNDS;
    expect(isComplete(p, withPractice.id)).toBe(true);
    // Transfer rounds on level 2 never replace level 1.
    p.solved[key] = 0;
    p.solved[keyOf(withPractice.id, 2)] = 3;
    expect(isComplete(p, withPractice.id)).toBe(false);
  });
  it("sanitizes corrupt storage", () => {
    expect(parseProgress("bad")).toEqual(freshProgress());
    expect(parseProgress("[]")).toEqual(freshProgress());
    expect(parseProgress(null)).toEqual(freshProgress());
    const id = LESSONS[0].id;
    const p = parseProgress(
      JSON.stringify({
        active: id,
        quiz: [id, id, "bad"],
        casework: [id, 5],
        drafts: { [keyOf(id, 1)]: "Ein Satz mit mehreren Wörtern. ".repeat(400), bad: "x" },
        assessed: [keyOf(id, 1), keyOf(LESSONS[1].id, 1)],
        solved: { [keyOf(id, 1)]: 900, [keyOf(LESSONS[1].id, 1)]: -1 },
        serial: { [keyOf(id, 1)]: 999999999 },
      }),
    );
    expect(p.active).toBe(id);
    expect(p.quiz).toEqual([id]);
    expect(p.casework).toEqual([id]);
    expect(p.drafts[keyOf(id, 1)]).toHaveLength(8000);
    expect(p.assessed).toEqual([keyOf(id, 1)]);
    expect(p.solved).toEqual({ [keyOf(id, 1)]: 3 });
    expect(p.serial).toEqual({ [keyOf(id, 1)]: 1000000 });
    expect(completion(p).total).toBe(CORE_LESSONS.length);
  });
  it("opens every lesson by id", () => {
    for (const lesson of LESSONS) expect(findLesson(lesson.id)).toBeDefined();
  });
  it("joins what another tab saved without wiping it", () => {
    const [a, b] = LESSONS;
    const stored = freshProgress();
    stored.quiz.push(a.id);
    stored.solved[keyOf(a.id, 1)] = 2;
    stored.serial[keyOf(a.id, 1)] = 5;
    stored.drafts[keyOf(a.id, 1)] = "Ein Komma trennt den Nebensatz vom Hauptsatz.";
    stored.assessed.push(keyOf(a.id, 1));
    const own = freshProgress();
    own.level = 2;
    own.casework.push(b.id);
    own.solved[keyOf(a.id, 1)] = 1;
    const merged = mergeProgress(stored, own);
    expect(merged.quiz).toEqual([a.id]);
    expect(merged.casework).toEqual([b.id]);
    expect(merged.solved[keyOf(a.id, 1)]).toBe(2);
    expect(merged.serial[keyOf(a.id, 1)]).toBe(5);
    expect(merged.level).toBe(2);
    expect(merged.drafts[keyOf(a.id, 1)]).toBe(stored.drafts[keyOf(a.id, 1)]);
    // The rating stored for the very same text stays ...
    expect(merged.assessed).toEqual([keyOf(a.id, 1)]);
    // ... but not for a text this tab has changed since.
    own.drafts[keyOf(a.id, 1)] = "Ich habe den Text danach noch einmal ganz neu geschrieben.";
    expect(mergeProgress(stored, own).assessed).toEqual([]);
  });
  it("counts a text as an attempt only when it has some words", () => {
    expect(looksLikeDraft("a".repeat(40))).toBe(false);
    expect(looksLikeDraft("la la la la la la la la")).toBe(false);
    expect(looksLikeDraft("zu kurz")).toBe(false);
    expect(looksLikeDraft("Ein Komma trennt den Nebensatz vom Hauptsatz.")).toBe(true);
  });
});
