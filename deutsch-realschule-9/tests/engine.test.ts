import { describe, expect, it } from "vitest";
import { findLesson, LESSONS } from "../src/curriculum";
import {
  createRound,
  REQUIRED_ROUNDS,
  revealRound,
  ROUND_SIZE,
  skipRound,
  submitRound,
} from "../src/exercises/practice";
import { esc, hashKey, placeAnswer, rich, shuffle } from "../src/format";
import type { CaseFile, ChooseItem, CommaItem, MarkWorkshop, SortWorkshop } from "../src/model/types";
import { freshProgress, keyOf } from "../src/storage/progress";
import {
  canAcceptSelfAssessment,
  checkCase,
  checkChoose,
  checkCommas,
  checkMarks,
  checkSort,
  chooseSentence,
  commaSentence,
  initialOrder,
  markTargets,
  moveEntry,
  quizOptions,
  shownOptions,
  toggleMark,
} from "../src/workshop";
import { lessonLink, parseTrainingDeepLink } from "../src/zam/zam-link";

const comma: CommaItem = {
  words: ["Ich", "weiß", "dass", "du", "recht", "hast."],
  commas: [1],
  feedback: "Der Nebensatz mit „dass“ wird abgetrennt.",
};
const choose: ChooseItem = {
  before: "Das Ergebnis war ",
  options: ["tödlich", "tötlich"],
  answer: 0,
  after: " für die Pflanze.",
  feedback: "„tödlich“ kommt von „Tod“ und wird mit ö geschrieben.",
};
const mark: MarkWorkshop = {
  kind: "mark",
  title: "Titel der Werkstatt",
  instruction: "Markiere die Stellen im Text, die zu einem Label gehören.",
  labels: ["Metapher", "Vergleich"],
  text: [
    { t: "Der Nebel ist " },
    { t: "eine Zuckerwatte", label: 0, feedback: "Ohne „wie“ gleichgesetzt: eine Metapher." },
    { t: " und er liegt " },
    { t: "wie ein Tuch", label: 1, feedback: "Mit „wie“ verbunden: ein Vergleich." },
    { t: " über dem Tal." },
  ],
  conclusion: "Mit „wie“ ist es ein Vergleich, ohne „wie“ eine Metapher.",
};
const sort: SortWorkshop = {
  kind: "classify",
  title: "Zuordnen",
  instruction: "Ordne zu.",
  categories: ["A", "B"],
  entries: [
    { text: "eins", target: 0, feedback: "a" },
    { text: "zwei", target: 1, feedback: "b" },
    { text: "drei", target: 1, feedback: "c" },
  ],
  conclusion: "ok",
};

describe("commas", () => {
  it("accept exactly the commas of the sentence, in any order and once each", () => {
    expect(checkCommas(comma, [1])).toBe(true);
    expect(checkCommas(comma, [1, 1])).toBe(true);
    expect(checkCommas(comma, [])).toBe(false);
    expect(checkCommas(comma, [1, 3])).toBe(false);
    expect(checkCommas(comma, [2])).toBe(false);
    expect(checkCommas({ ...comma, commas: [0, 2] }, [2, 0])).toBe(true);
    expect(checkCommas({ ...comma, commas: [] }, [])).toBe(true);
  });
  it("write the sentence with its commas", () => {
    expect(commaSentence(comma)).toBe("Ich weiß, dass du recht hast.");
    expect(commaSentence({ ...comma, commas: [] })).toBe("Ich weiß dass du recht hast.");
  });
});

describe("choosing", () => {
  it("accepts only the right option and writes the sentence with it", () => {
    expect(checkChoose(choose, 0)).toBe(true);
    expect(checkChoose(choose, 1)).toBe(false);
    expect(checkChoose(choose, -1)).toBe(false);
    expect(chooseSentence(choose)).toBe("Das Ergebnis war tödlich für die Pflanze.");
  });
});

describe("marking", () => {
  it("lists the targets, toggles a mark and checks every piece", () => {
    expect(markTargets(mark)).toEqual([1, 3]);
    const solved = [undefined, 0, undefined, 1, undefined];
    expect(checkMarks(mark, solved)).toEqual([true, true, true, true, true]);
    expect(checkMarks(mark, [])).toEqual([true, false, true, false, true]);
    // The right piece with the wrong label, and a piece that should stay clear.
    expect(checkMarks(mark, [undefined, 1, undefined, 1, undefined])[1]).toBe(false);
    expect(checkMarks(mark, [0, 0, undefined, 1, undefined])[0]).toBe(false);
    let marking = toggleMark([], 1, 0);
    expect(marking[1]).toBe(0);
    marking = toggleMark(marking, 1, 1);
    expect(marking[1]).toBe(1);
    marking = toggleMark(marking, 1, 1);
    expect(marking[1]).toBeUndefined();
  });
});

describe("sorting", () => {
  it("rejects incomplete, duplicate and out-of-range answers", () => {
    expect(checkSort(sort, [0, 1, 1])).toEqual([true, true, true]);
    expect(checkSort(sort, [0, 1])).toEqual([false, false, false]);
    expect(checkSort(sort, [1, 1, 1])).toEqual([false, true, true]);
    const timeline: SortWorkshop = { ...sort, kind: "timeline", categories: [], entries: sort.entries.map((e, i) => ({ ...e, target: i })) };
    expect(checkSort(timeline, [0, 1, 2])).toEqual([true, true, true]);
    expect(checkSort(timeline, [0, 0, 2])).toEqual([false, false, false]);
    expect(checkSort(timeline, [2, 1, 0])).toEqual([false, true, false]);
  });
  it("never starts a timeline in its solved order and moves entries within bounds", () => {
    const timeline: SortWorkshop = { ...sort, kind: "timeline", categories: [], entries: sort.entries.slice(0, 2).map((e, i) => ({ ...e, target: i })) };
    for (const key of ["a", "b", "c", "d", "e", "f"])
      expect(initialOrder(timeline, key)).not.toEqual([0, 1]);
    expect(moveEntry([0, 1, 2], 0, -1)).toEqual([0, 1, 2]);
    expect(moveEntry([0, 1, 2], 2, 1)).toEqual([0, 1, 2]);
    expect(moveEntry([0, 1, 2], 0, 1)).toEqual([1, 0, 2]);
  });
});

describe("case work and self-assessment", () => {
  const file: CaseFile = {
    title: "Fall",
    story: "Geschichte",
    verdict: "Urteil",
    steps: [
      { question: "A?", options: ["x", "y", "z"], answer: 1, explanation: "weil" },
      { question: "B?", options: ["x", "y"], answer: 0, explanation: "darum" },
    ],
  };
  it("shows the options in a fixed shuffled order and finds the right one there", () => {
    const first = shownOptions(file, 0, "lesson");
    expect(shownOptions(file, 0, "lesson")).toEqual(first);
    expect([...first.options].sort()).toEqual(["x", "y", "z"]);
    expect(first.options[first.answer]).toBe("y");
    const a = shownOptions(file, 0, "lesson").answer;
    const b = shownOptions(file, 1, "lesson").answer;
    expect(checkCase(file, "lesson", [a, b])).toEqual([true, true]);
    expect(checkCase(file, "lesson", [a])).toEqual([true, false]);
  });
  it("accepts a self-assessment only for a real text and all three criteria", () => {
    expect(canAcceptSelfAssessment("zu kurz", [true, true, true])).toBe(false);
    expect(canAcceptSelfAssessment("a".repeat(40), [true, true, true])).toBe(false);
    const text = "Ein ganzer Satz als Antwort auf die Aufgabe.";
    expect(canAcceptSelfAssessment(text, [true, true])).toBe(false);
    expect(canAcceptSelfAssessment(text, [true, false, true])).toBe(false);
    expect(canAcceptSelfAssessment(text, [true, true, true])).toBe(true);
  });
});

describe("practice rounds", () => {
  const lesson = findLesson("de-zeichensetzung");
  if (!lesson?.practice) throw new Error("de-zeichensetzung needs a practice round");
  const solved = (round: ReturnType<typeof createRound>) => round.items.map(() => true);

  it("draws the same three sentences for the same serial and other ones later", () => {
    const p = freshProgress();
    const a = createRound(p, lesson, 1);
    expect(a.items).toHaveLength(ROUND_SIZE);
    expect(createRound(p, lesson, 1).items).toEqual(a.items);
    expect(new Set(a.items.map((i) => ("words" in i ? i.words.join(" ") : ""))).size).toBe(ROUND_SIZE);
    const seen = new Set<string>();
    for (let serial = 0; serial < 12; serial++) {
      p.serial[keyOf(lesson.id, 1)] = serial;
      for (const item of createRound(p, lesson, 1).items) seen.add("words" in item ? item.words.join(" ") : "");
    }
    expect(seen.size).toBeGreaterThan(ROUND_SIZE);
    const level2 = createRound(p, lesson, 2);
    for (const item of level2.items) expect(lesson.practice?.pool[2]).toContain(item);
  });
  it("counts a round only when every sentence is right and the solution stayed shut", () => {
    const p = freshProgress();
    const key = keyOf(lesson.id, 1);
    const round = createRound(p, lesson, 1);
    expect(submitRound(p, round, [true, false, true])).toBe(false);
    expect(submitRound(p, round, [true, true])).toBe(false);
    expect(p.solved[key]).toBeUndefined();
    expect(submitRound(p, round, solved(round))).toBe(true);
    expect(p.solved[key]).toBe(1);
    expect(p.serial[key]).toBe(1);
    // A finished round cannot be counted twice.
    expect(submitRound(p, round, solved(round))).toBe(false);
    expect(p.solved[key]).toBe(1);

    const peeked = createRound(p, lesson, 1);
    revealRound(p, peeked);
    expect(submitRound(p, peeked, solved(peeked))).toBe(false);
    expect(p.solved[key]).toBe(1);
    expect(p.serial[key]).toBe(2);

    const skipped = createRound(p, lesson, 1);
    skipRound(p, skipped);
    expect(p.serial[key]).toBe(3);
    expect(REQUIRED_ROUNDS).toBe(2);
  });
});

describe("text helpers and links", () => {
  it("escapes everything and allows bold only", () => {
    expect(esc('<a href="x">&</a>')).toBe("&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;");
    expect(rich("Das **Wort** <b>x</b>")).toBe("Das <strong>Wort</strong> &lt;b&gt;x&lt;/b&gt;");
  });
  it("shuffles the same way for the same key and keeps every element", () => {
    const items = [1, 2, 3, 4, 5, 6];
    expect(shuffle(items, "k")).toEqual(shuffle(items, "k"));
    expect([...shuffle(items, "k")].sort()).toEqual(items);
  });
  it("builds and reads the link a ZAM card cites", () => {
    expect(lessonLink("de-stilmittel")).toBe("https://academy.zam-os.org/deutsch-realschule-9/#lesson=de-stilmittel");
    expect(parseTrainingDeepLink("#lesson=de-stilmittel&level=2")).toEqual({ lessonId: "de-stilmittel", level: 2 });
    expect(parseTrainingDeepLink("#lesson=../x")).toEqual({});
    expect(parseTrainingDeepLink("", "?lesson=de-zeichensetzung")).toEqual({ lessonId: "de-zeichensetzung" });
  });
});

describe("placing the right option", () => {
  it("gives keys that differ in one character unrelated hashes", () => {
    const hashes = ["l:case:0", "l:case:1", "l:case:2", "l:case:3"].map(hashKey);
    expect(new Set(hashes).size).toBe(4);
    expect(new Set(hashes.map((h) => h % 3)).size).toBeGreaterThan(1);
  });
  it("moves the right option from step to step and keeps every option once", () => {
    const wrong = ["a", "b"];
    const places = [0, 1, 2].map((step) => placeAnswer("R", wrong, "key", step).answer);
    expect(new Set(places).size).toBe(3);
    for (let step = 0; step < 4; step++) {
      const { items, answer } = placeAnswer("R", wrong, "key", step);
      expect(items[answer]).toBe("R");
      expect([...items].sort()).toEqual(["R", "a", "b"]);
      expect(placeAnswer("R", wrong, "key", step)).toEqual({ items, answer });
    }
  });
  it("never keeps the right answer at one place through all steps of a lesson", () => {
    for (const lesson of LESSONS) {
      const places = lesson.casework.steps.map((_, i) => {
        const shown = shownOptions(lesson.casework, i, lesson.id);
        expect(shown.options[shown.answer]).toBe(lesson.casework.steps[i].options[lesson.casework.steps[i].answer]);
        return shown.answer;
      });
      expect(new Set(places).size, lesson.id).toBeGreaterThan(1);
    }
  });
  it("spreads the right answers of the quick checks over the three places", () => {
    const count = [0, 0, 0];
    for (const lesson of LESSONS) {
      const { options, answer } = quizOptions(lesson);
      expect(options[answer]).toBe(lesson.quiz.answer);
      expect([...options].sort()).toEqual([lesson.quiz.answer, ...lesson.quiz.wrong].sort());
      count[answer] += 1;
    }
    for (const n of count) {
      expect(n).toBeGreaterThan(LESSONS.length / 3 - 8);
      expect(n).toBeLessThan(LESSONS.length / 3 + 8);
    }
  });
});
