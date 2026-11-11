import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import matrix from "../coverage.json";
import publication from "../publication.json";
import mapping from "../replaces-de-by.json";
import { CHECKED, CURRICULUM_URL, LESSONS, SOURCES, STAGES } from "../src/curriculum";
import { checkWorkshop, initialOrder, moveEntry } from "../src/workshop";
import {
  lessonLink,
  parseTrainingDeepLink,
  ZAM_CELL_ID,
  ZAM_CELL_TITLE,
} from "../src/zam/zam-link";
import contract from "./fixtures/public-contract.json";

interface Item {
  id: string;
  slug: string;
  question: string;
  concept?: string;
  concept_segments?: readonly { type: string; speech?: string }[];
  language: string;
  source_link: string;
  tier: string;
  fast_check?: { type: string; correct_index: number; options: string[] };
  choice_distractors?: { text: string; reason: string }[];
  sample_solution?: unknown;
  replaces?: string[];
}
const items = cell.atoms.flatMap<Item>((atom) => atom.practice_items);

describe("scope and coverage", () => {
  it("maps every ISB competency to a lesson, without implying a regular Grade 11 biology course", () => {
    expect(matrix.curriculum).toBe(CURRICULUM_URL);
    expect(matrix.checked).toBe(CHECKED);
    expect(matrix.areas.map(({ lb, hours }) => [lb, hours])).toEqual(
      STAGES.map(({ lb, hours }) => [lb, hours ?? null]),
    );
    expect(STAGES.reduce((sum, stage) => sum + (stage.hours ?? 0), 0)).toBe(54);
    expect(matrix.coverage.map((row) => row.id)).toEqual(
      [8, 4, 4, 10, 7, 3].flatMap((count, i) =>
        Array.from({ length: count }, (_, j) => `${i + 1}.${j + 1}`),
      ),
    );
    expect(matrix.optional_lessons).toEqual([]);
    expect(STAGES.map((s) => LESSONS.filter((lesson) => lesson.lb === s.lb).length)).toEqual([
      3, 3, 4, 10, 5, 3,
    ]);
    expect(new Set(matrix.coverage.flatMap((row) => row.lessons))).toEqual(
      new Set(LESSONS.map((lesson) => lesson.id)),
    );
    for (const row of matrix.coverage) {
      expect(
        row.lessons.some((id) => LESSONS.find((lesson) => lesson.id === id)?.lb === row.lb),
      ).toBe(true);
      expect(row.evidence.trim().length).toBeGreaterThan(25);
      expect(row.official_text.trim().length).toBeGreaterThan(25);
      expect(row.source_pages.length).toBeGreaterThan(0);
      expect(
        row.source_pages.every((page) => Number.isInteger(page) && page >= 1 && page <= 11),
      ).toBe(true);
    }
    expect(
      cell.atoms
        .flatMap((atom) => atom.curricula)
        .some((entry) => entry.provider === "lehrplanplus-bayern"),
    ).toBe(false);
  });

  it.each(LESSONS)("has two distinct practice cases and a sourced explanation: $id", (lesson) => {
    expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(3);
    expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(450);
    expect(lesson.keyTerms.length).toBeGreaterThanOrEqual(4);
    expect(lesson.takeaway.trim()).not.toBe("");
    expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
    expect(lesson.quiz.explanation.trim()).not.toBe("");
    expect(lesson.sourceIds).toContain("isb");
    for (const id of lesson.sourceIds)
      expect(SOURCES.find((source) => source.id === id)?.url).toMatch(/^https:\/\//);
    expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
    for (const task of Object.values(lesson.tasks)) {
      expect(task.model.length).toBeGreaterThan(100);
      expect(new Set(task.criteria).size).toBe(3);
      expect(task.hints).toHaveLength(2);
    }
  });

  it.each(LESSONS)(
    "starts with an unsolved workshop and has a reachable solution: $id",
    ({ id, workshop }) => {
      expect(workshop.entries.length).toBeGreaterThanOrEqual(4);
      expect(workshop.entries.every(({ feedback }) => feedback.length > 10)).toBe(true);
      if (workshop.kind === "classify") {
        expect(workshop.categories.length).toBeGreaterThanOrEqual(3);
        const solution = workshop.entries.map(({ target }) => target);
        expect(solution.every((target) => target >= 0 && target < workshop.categories.length)).toBe(
          true,
        );
        expect(
          checkWorkshop(
            workshop,
            solution.map(() => -1),
          ).some(Boolean),
        ).toBe(false);
        expect(checkWorkshop(workshop, solution).every(Boolean)).toBe(true);
        expect(checkWorkshop(workshop, solution.slice(1)).some(Boolean)).toBe(false);
        return;
      }
      let order = initialOrder(workshop, id);
      expect(checkWorkshop(workshop, order).every(Boolean)).toBe(false);
      const solution = workshop.entries
        .map((_, index) => index)
        .sort((a, b) => workshop.entries[a].target - workshop.entries[b].target);
      // Solve with the same adjacent moves learners can use in the workshop.
      for (let position = 0; position < solution.length; position++) {
        while (order.indexOf(solution[position]) > position) {
          order = moveEntry(order, order.indexOf(solution[position]), -1);
        }
      }
      expect(checkWorkshop(workshop, order).every(Boolean)).toBe(true);
      expect(
        checkWorkshop(
          workshop,
          order.map(() => order[0]),
        ).some(Boolean),
      ).toBe(false);
    },
  );
});

describe("cell and permanent lesson anchors", () => {
  it("pins all atom and practice identities and declares preview publication", () => {
    expect(publication.status).toBe("preview");
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(cell.title).toBe(ZAM_CELL_TITLE);
    expect(cell.atoms).toHaveLength(28);
    expect(items).toHaveLength(84);
    expect(
      cell.atoms.map((atom) => ({
        id: atom.id,
        slug: atom.slug,
        lesson: atom.source_link,
        items: atom.practice_items.map(({ id, slug }) => ({ id, slug })),
      })),
    ).toEqual(contract);
    expect(LESSONS.map((lesson) => lessonLink(lesson.id))).toEqual(
      contract.map((atom) => atom.lesson),
    );
    expect("retired_items" in cell).toBe(false);
    const ids = [...cell.atoms, ...items].map(({ id }) => id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/.test(id))).toBe(true);
    expect(new Set(items.map(({ slug }) => slug)).size).toBe(items.length);
    expect(new Set(items.map(({ question }) => question)).size).toBe(items.length);
    expect(SOURCES.every((source) => cell.sources.some((entry) => entry.uri === source.url))).toBe(
      true,
    );
  });

  it("declares exactly the history transfer approved by Thomas", () => {
    expect(mapping.status).toBe("approved");
    expect(mapping.approved).toBe("2026-11-10");
    expect(mapping.source).toContain("Thomas explicitly approved");
    expect(mapping.source).toContain("Codex chat");
    expect(mapping.source).toContain("Freigabe erteilt");
    expect(mapping.rows.filter((row) => row.category === "A")).toEqual([
      expect.objectContaining({
        de_by_id: "01K8GBH0000000000000000J01",
        academy_slug: "bio11-photosynthese-vergleichen-sauerstoffquelle",
        action: "replace",
      }),
    ]);
    expect(mapping.rows.filter((row) => row.category === "B")).toEqual([]);
    const kept = mapping.rows.filter((row) => row.category === "C");
    expect(kept).toHaveLength(7);
    expect(kept.every((row) => row.action === "keep-active" && row.academy_slug === null)).toBe(true);
    expect(items.filter((item) => item.replaces).map(({ id, slug, replaces }) => ({ id, slug, replaces }))).toEqual([
      {
        id: "01M724F0PY90SYN1414R4V383V",
        slug: "bio11-photosynthese-vergleichen-sauerstoffquelle",
        replaces: ["01K8GBH0000000000000000J01"],
      },
    ]);
    expect("retired_items" in cell).toBe(false);
  });

  it.each(LESSONS)(
    "binds the lesson, atom, prerequisite and cards to the correct scope: $id",
    (lesson) => {
      const index = cell.atoms.findIndex((atom) => atom.source_link === lessonLink(lesson.id));
      const atom = cell.atoms[index];
      expect(atom.title).toBe(lesson.title);
      expect(atom.atom_uri).toBe("urn:zam:atom:" + atom.id);
      expect(atom.curricula).toEqual([
        expect.objectContaining({ provider: "zam-academy", topic_code: `lb${lesson.lb}` }),
        expect.objectContaining({
          provider: "isb-bayern-einfuehrungsklasse",
          track: "einfuehrungsklasse",
          school_type: "gymnasium",
          grade: 11,
          subject: "biologie",
          topic_code: `lb${lesson.lb}`,
        }),
      ]);
      for (const prerequisite of atom.prerequisites)
        expect(
          cell.atoms.slice(0, index).some((parent) => parent.id === prerequisite.atom_id),
        ).toBe(true);
      expect(atom.practice_items.map((item) => item.tier)).toEqual([
        "tier1_fast",
        "tier1_fast",
        "tier2_synthesis",
      ]);
      const practiceItems: readonly Item[] = atom.practice_items;
      for (const item of practiceItems) {
        expect(item.source_link).toBe(lessonLink(lesson.id));
        expect(parseTrainingDeepLink(new URL(item.source_link).hash)).toEqual({
          lessonId: lesson.id,
        });
        expect(item.language).toBe("de");
        expect(Boolean(item.concept)).not.toBe(Boolean(item.concept_segments));
        if (item.concept_segments) {
          for (const segment of item.concept_segments) {
            if (segment.type === "math") expect(segment.speech?.trim()).toBeTruthy();
          }
        }
        if (item.tier === "tier1_fast") {
          expect(item.fast_check?.type).toBe("binary_choice");
          expect(item.fast_check?.correct_index).toBe(0);
          expect(item.fast_check?.options[0]).toBe(item.concept);
          expect(new Set(item.fast_check?.options).size).toBe(2);
          expect(item.choice_distractors).toHaveLength(2);
          expect(new Set(item.choice_distractors?.map(({ text }) => text)).size).toBe(2);
          expect(item.choice_distractors?.every(({ reason }) => reason.trim().length > 20)).toBe(
            true,
          );
        } else {
          expect(item.sample_solution).toBeTruthy();
        }
      }
    },
  );

  it("reads a stable link in both the served app and an offline file", () => {
    expect(parseTrainingDeepLink("#lesson=meiose-und-vielfalt&level=2")).toEqual({
      lessonId: "meiose-und-vielfalt",
      level: 2,
    });
    expect(parseTrainingDeepLink("", "?lesson=meiose-und-vielfalt")).toEqual({
      lessonId: "meiose-und-vielfalt",
    });
    expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=3")).toEqual({});
  });
});
