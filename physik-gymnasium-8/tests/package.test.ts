import { describe, expect, it } from "vitest";
import tile from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import { LESSONS, lessonsFor, SOURCES } from "../src/curriculum";
import {
  createAttempt,
  revealSolution,
  submitAnswer,
} from "../src/exercises/attempt";
import { checkAnswer } from "../src/exercises/checker";
import { makeExercise } from "../src/exercises/generators";
import { createRng } from "../src/exercises/rng";
import type { Level } from "../src/model/types";
import { pathLesson, visitLesson } from "../src/navigation";
import {
  experimentSummary,
  freshProgress,
  parseProgress,
  writingKey,
} from "../src/storage/progress";
import { checkWorkshop, initialOrder } from "../src/workshop";
import { lessonLink, parseTrainingDeepLink } from "../src/zam/zam-link";

const pinned = [
  "stromkreis",
  "kennlinie",
  "reihenschaltung",
  "parallel-haushalt",
  "spiegel",
  "brechung",
  "sammellinse",
  "auge",
  "totalreflexion",
  "tempo",
  "vektoren",
  "kraftstoss",
  "beschleunigung",
  "gewichtskraft",
  "gleichgewicht",
  "schiefe-ebene",
  "feder",
  "solarmodule",
  "stromquellen",
  "forschungsauftrag",
];

describe("Curriculum and practice", () => {
  it("keeps the common, NTG and elective paths aligned with the curriculum", () => {
    expect(LESSONS.map((l) => l.id)).toEqual(pinned);
    expect(lessonsFor("ANDERE")).toHaveLength(17);
    expect(lessonsFor("NTG")).toHaveLength(19);
    expect(lessonsFor("NTG", true).map((l) => l.id)).toEqual(pinned);
    expect(coverage.schema).toBe(1);
    expect(coverage.core_lessons).toBe(19);
    expect(coverage.rows).toHaveLength(33);
    expect(coverage.optional_lessons).toEqual(
      LESSONS.filter((lesson) => lesson.optional).map((lesson) => lesson.id),
    );
    expect(coverage.learning_areas.map((l) => l.hours)).toEqual([
      14, 14, 17, 11, 10, 18,
    ]);
    const covered = new Set([
      ...coverage.optional_lessons,
      ...coverage.rows.flatMap((c) => c.lessons),
    ]);
    expect([...covered].sort()).toEqual([...pinned].sort());
    for (const row of coverage.rows) {
      expect(row.track).toBe(row.lb.startsWith("4") ? "NTG" : "alle");
      expect(["implemented", "supported"]).toContain(row.status);
      expect(row.evidence.length).toBeGreaterThan(40);
      expect(row.lessons.length).toBeGreaterThan(0);
      expect(row.lessons.every((id) => pinned.includes(id))).toBe(true);
    }
  });

  it.each(LESSONS)(
    "provides two tasks, sources, a worked example and a solvable workshop ($id)",
    (lesson) => {
      expect(
        lesson.paragraphs.some((text) => text.startsWith("Beispiel:")),
      ).toBe(true);
      expect(lesson.paragraphs.join(" ")).not.toMatch(/\d\.\d/);
      expect(lesson.formulas?.length).toBeGreaterThan(0);
      expect(
        lesson.sourceIds.every((id) => SOURCES.some((s) => s.id === id)),
      ).toBe(true);
      expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
      const work = lesson.workshop;
      const solution = work.entries.map((e) => e.target);
      const initial =
        work.kind === "timeline"
          ? initialOrder(work, lesson.id)
          : work.entries.map(() => -1);
      expect(checkWorkshop(work, initial).every(Boolean)).toBe(false);
      expect(checkWorkshop(work, solution).every(Boolean)).toBe(true);
      expect(lesson.tasks[1].prompt).not.toEqual(lesson.tasks[2].prompt);
      expect(lesson.tasks[1].criteria).toHaveLength(3);
      expect(lesson.tasks[2].criteria).toHaveLength(3);
    },
  );

  it("checks rounded values with decimal comma or point across both levels", () => {
    const calculationLessons = LESSONS.flatMap((l) =>
      l.calculation ? [l.calculation] : [],
    );
    expect(calculationLessons).toHaveLength(12);
    for (const kind of calculationLessons) {
      for (const level of [1, 2] as const) {
        const prompts = new Set<string>();
        for (let seed = 1; seed <= 80; seed++) {
          const task = makeExercise(kind, createRng(seed), level);
          expect(Number.isFinite(task.answer)).toBe(true);
          expect(task.prompt).not.toMatch(/\d\.\d/);
          expect(task.solutionHtml).not.toMatch(/\d\.\d/);
          const rounded = task.answer.toFixed(task.digits);
          expect(checkAnswer(task, rounded).status).toBe("correct");
          expect(checkAnswer(task, rounded.replace(".", ",")).status).toBe(
            "correct",
          );
          expect(checkAnswer(task, String(task.answer * 1000)).status).toBe(
            "wrong",
          );
          prompts.add(task.prompt);
        }
        expect(prompts.size).toBeGreaterThan(3);
      }
      expect(makeExercise(kind, createRng(1), 1).prompt).not.toBe(
        makeExercise(kind, createRng(1), 2).prompt,
      );
    }
  });

  it("preserves independent exercise credit and distinguishes notebook entries", () => {
    const progress = freshProgress();
    const lesson = LESSONS[0];
    const assisted = createAttempt(progress, lesson, 1);
    revealSolution(progress, assisted);
    expect(
      submitAnswer(progress, assisted, String(assisted.task.answer)),
    ).toBeNull();
    for (const level of [1, 2] as Level[]) {
      const attempt = createAttempt(progress, lesson, level);
      expect(
        submitAnswer(progress, attempt, attempt.task.answer.toFixed(3))?.status,
      ).toBe("correct");
      expect(
        submitAnswer(progress, attempt, attempt.task.answer.toFixed(3)),
      ).toBeNull();
      expect(progress.calculationDone[writingKey(lesson.id, level)]).toBe(1);
    }
    const fields = {
      question: "Welche Frage soll untersucht werden?",
      setup: "Diese Größen halten wir dabei konstant.",
      data: "Hier stehen die eigenen Messwerte.",
      conclusion: "Die Messwerte bestätigen die Vermutung.",
    };
    for (const experiment of progress.experiments.filter((e) => e.lb === 1))
      Object.assign(experiment, fields, { status: "done" });
    const saved = parseProgress(JSON.stringify(progress));
    expect(experimentSummary(saved.experiments, "ANDERE")).toEqual({
      count: 2,
      total: 6,
    });
    expect(experimentSummary(saved.experiments, "NTG")).toEqual({
      count: 2,
      total: 8,
    });
    expect(parseProgress("no json")).toEqual(freshProgress());
  });
});

describe("ZAM", () => {
  it("matches the byte hashes of the recorded legacy snapshots", async () => {
    const fixtures = import.meta.glob<string>("./fixtures/*.json", {
      eager: true,
      import: "default",
      query: "?raw",
    });
    expect(Object.keys(fixtures)).toHaveLength(mapping.sources.length);
    for (const source of mapping.sources) {
      const contents = fixtures[source.file.replace(/^tests/, ".")];
      expect(contents, source.file).toBeDefined();
      const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(contents),
      );
      const hex = Array.from(new Uint8Array(digest), (byte) =>
        byte.toString(16).padStart(2, "0"),
      ).join("");
      expect(hex, source.file).toBe(source.sha256);
    }
  });

  it("links one atom and three distinct stable cards to each lesson", () => {
    expect(tile.tile_id).toBe("zam-academy:physik-gymnasium-8");
    expect(tile.atoms.map((atom) => atom.source_link)).toEqual(
      pinned.map(lessonLink),
    );
    const ids = new Set<string>();
    for (const atom of tile.atoms) {
      const isNtg = atom.curricula[1].topic_code.startsWith("lb4");
      expect(
        "track" in atom.curricula[1] ? atom.curricula[1].track : undefined,
      ).toBe(isNtg ? "NTG" : undefined);
      expect(atom.curricula[1].grade).toBe(8);
      expect(atom.prerequisites.every((p) => ids.has(p.atom_id))).toBe(true);
      expect(atom.practice_items).toHaveLength(3);
      for (const entry of [atom, ...atom.practice_items]) {
        expect(entry.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
        expect(ids.has(entry.id)).toBe(false);
        expect(entry.source_link).toBe(atom.source_link);
        ids.add(entry.id);
      }
      expect(
        atom.practice_items
          .slice(0, 2)
          .every((item) => item.fast_check?.options.length === 2),
      ).toBe(true);
      expect(atom.practice_items[2].sample_solution).toBeTruthy();
    }
    expect(ids.size).toBe(80);
  });

  it("opens card deep links without switching the learner's curriculum", () => {
    const progress = freshProgress();
    const parsed = parseTrainingDeepLink("#lesson=forschungsauftrag&level=2");
    expect(parsed.level).toBe(2);
    expect(visitLesson(progress, parsed.lessonId!)?.id).toBe(
      "forschungsauftrag",
    );
    expect(progress.track).toBe("ANDERE");
    expect(pathLesson(progress).id).toBe("stromkreis");
  });

  it("accounts for every legacy item with proposal-only actions", () => {
    const fixtures = Object.values(
      import.meta.glob("./fixtures/*.json", { eager: true, import: "default" }),
    ) as { atoms: { practice_items: { id: string }[] }[] }[];
    const oldIds = fixtures.flatMap((cell) =>
      cell.atoms.flatMap((atom) => atom.practice_items.map((item) => item.id)),
    );
    const slugs = tile.atoms.flatMap((atom) =>
      atom.practice_items.map((item) => item.slug),
    );
    expect(mapping.status).toBe("proposal-only");
    expect(mapping.approved).toBeNull();
    for (const row of mapping.rows) {
      expect(row.reason.length).toBeGreaterThan(20);
      expect(row.action).toBe(
        row.category === "A" ? "propose-replace-after-approval" : "keep-active",
      );
      expect(row.academy_slug === null).toBe(row.category === "C");
    }
    expect(mapping.rows.map((row) => row.de_by_id).sort()).toEqual(
      oldIds.sort(),
    );
    expect(oldIds).toHaveLength(24);
    expect(mapping.rows.filter((row) => row.category === "A")).toHaveLength(7);
    const proposed = mapping.rows.flatMap((row) =>
      row.academy_slug ? [row.academy_slug] : [],
    );
    expect(new Set(proposed).size).toBe(proposed.length);
    expect(
      proposed.every(
        (slug) => slugs.filter((value) => value === slug).length === 1,
      ),
    ).toBe(true);
    expect(JSON.stringify(tile)).not.toMatch(/"(replaces|retired_items)":/);
  });
});
