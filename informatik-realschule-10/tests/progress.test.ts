import { afterEach, describe, expect, it, vi } from "vitest";
import { findLesson, LESSONS, WORKSHOPS } from "../src/curriculum";
import { esc } from "../src/html";
import {
  canAssess,
  canCompare,
  complete,
  freshProgress,
  invalidateLab,
  invalidateWriting,
  loadProgress,
  parseProgress,
  saveProgress,
  selectedLessons,
  writingKey,
} from "../src/progress";

afterEach(() => vi.unstubAllGlobals());
describe("local learning evidence", () => {
  it("starts with all five modules and no claims of completion", () => {
    const progress = freshProgress();
    expect(selectedLessons(progress)).toHaveLength(36);
    expect(LESSONS.some((lesson) => complete(progress, lesson))).toBe(false);
  });
  it("requires a quiz, case workshop, assessed writing on the chosen level and the relevant lab", () => {
    const progress = freshProgress();
    const lesson = findLesson("it10-bruch")!;
    progress.quiz.push(lesson.id);
    progress.writing.push(writingKey(lesson.id, 1));
    expect(complete(progress, lesson)).toBe(false);
    progress.labs.push("objects-fraction");
    expect(complete(progress, lesson)).toBe(false);
    progress.workshops.push(lesson.id);
    expect(complete(progress, lesson)).toBe(true);
    progress.level = 2;
    expect(complete(progress, lesson)).toBe(false);
    progress.writing.push(writingKey(lesson.id, 2));
    expect(complete(progress, lesson)).toBe(true);
    invalidateLab(progress, "objects-fraction");
    expect(complete(progress, lesson)).toBe(false);
  });
  it("restores only workshop evidence with complete correct saved answers", () => {
    const id = LESSONS[0].id;
    const correct = WORKSHOPS[id].entries.map((entry) => entry.target);
    const state = {
      workshops: [id, "unknown"],
      workshopDrafts: { [id]: correct, unknown: [0] },
    };
    expect(parseProgress(JSON.stringify(state)).workshops).toEqual([id]);
    expect(
      parseProgress(
        JSON.stringify({ ...state, workshopDrafts: { [id]: [999, "0", -1] } }),
      ).workshops,
    ).toEqual([]);
    expect(
      parseProgress(JSON.stringify({ ...state, workshopDrafts: {} })).workshops,
    ).toEqual([]);
  });
  it("never equates an empty text or partial rubric to a self assessment", () => {
    expect(canCompare(" ".repeat(100))).toBe(false);
    expect(
      canAssess("Ein eigener ausreichend langer Gedankengang.", [
        true,
        true,
        false,
      ]),
    ).toBe(false);
    expect(
      canAssess("Ein eigener ausreichend langer Gedankengang.", [true, true]),
    ).toBe(false);
    expect(
      canAssess("Ein eigener ausreichend langer Gedankengang.", [
        true,
        true,
        true,
      ]),
    ).toBe(true);
  });
  it("invalidates only the edited level or edited lab", () => {
    const progress = freshProgress();
    const id = LESSONS[0].id;
    progress.writing = [writingKey(id, 1), writingKey(id, 2)];
    progress.labs = ["logic-xor", "logic-adder"];
    invalidateWriting(progress, id, 1);
    invalidateLab(progress, "logic-adder");
    expect(progress.writing).toEqual([writingKey(id, 2)]);
    expect(progress.labs).toEqual(["logic-xor"]);
  });
  it("restores valid work but strips unknown ids, duplicates and unwritten completions", () => {
    const key = writingKey(LESSONS[0].id, 1);
    const parsed = parseProgress(
      JSON.stringify({
        active: "no-such-lesson",
        level: 9,
        modules: ["ki", "ki", "no-module"],
        quiz: [LESSONS[0].id, LESSONS[0].id, "bad"],
        writing: [key, writingKey(LESSONS[1].id, 1)],
        drafts: {
          [key]: "Eine sinnvolle eigene Erklärung ist schon vorhanden.",
          evil: "discard",
        },
        labs: ["logic-xor", "bad"],
        labDrafts: { "objects-counter": "class Zaehler {}", evil: "discard" },
      }),
    );
    expect(parsed.modules).toEqual(["ki"]);
    expect(parsed.quiz).toEqual([LESSONS[0].id]);
    expect(parsed.writing).toEqual([key]);
    expect(parsed.active).toBe(LESSONS[0].id);
    expect(parsed.level).toBe(1);
    expect(parsed.drafts).not.toHaveProperty("evil");
    expect(parsed.labDrafts).not.toHaveProperty("evil");
    expect(selectedLessons(parsed)).toHaveLength(8);
  });
  it.each([null, "broken", "[]", "42", '{"modules":[]}'])(
    "has a working first run for damaged saved data: %s",
    (raw) => expect(parseProgress(raw).modules.length).toBe(5),
  );
  it("continues in memory when local storage is denied", () => {
    vi.stubGlobal("localStorage", {
      getItem() {
        throw new Error("denied");
      },
      setItem() {
        throw new Error("denied");
      },
    });
    expect(loadProgress()).toEqual(freshProgress());
    expect(saveProgress(freshProgress())).toBe(false);
  });
  it("escapes a learner's text before any HTML rendering", () => {
    expect(esc('<img src=x onerror="bad">')).toBe(
      "&lt;img src=x onerror=&quot;bad&quot;&gt;",
    );
  });
});
