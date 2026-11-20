import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import mapping from "../replaces-de-by.json";
import { ALL_LESSONS, findLessonById } from "../src/curriculum/index";
import { lessonLink, parseTrainingDeepLink, ZAM_CELL_ID } from "../src/zam/zam-link";
import contract from "./fixtures/public-contract.json";
import { LESSON_IDS } from "./lesson-ids";

function must<T>(value: T | undefined | null, label = "expected value"): T {
  if (value === undefined || value === null) throw new Error(label);
  return value;
}

type Segment = { type: "text"; text: string } | { type: "math"; tex: string; speech?: string };
type CellItem = {
  id: string;
  slug: string;
  tier: string;
  question?: string;
  question_segments?: Segment[];
  concept?: string;
  concept_segments?: Segment[];
  sample_solution?: string;
  source_link: string;
  replaces?: string[];
  fast_check?: { options: string[]; correct_index: number };
  choice_distractors?: Array<{ text: string; reason: string }>;
};

const atoms = cell.atoms;
const items: CellItem[] = atoms.flatMap((atom) => atom.practice_items as unknown as CellItem[]);

describe("ZAM cell zam-academy:informatik-mittelschule-6", () => {
  it("has 12 atoms (one per lesson) and 36 cards with frozen ULIDs from the public contract", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(cell.version).toBe("2026.11.1");
    expect(atoms).toHaveLength(12);
    expect(items).toHaveLength(36);
    const ids = [...atoms.map((a) => a.id), ...items.map((i) => i.id)];
    expect(new Set(ids).size).toBe(48);
    for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
    expect(new Set(ids.map((id) => id.slice(10))).size).toBe(ids.length);
    expect(ALL_LESSONS.map((l) => l.id)).toEqual(contract.lessons);
    expect(contract.lessons).toEqual([...LESSON_IDS]);
    const pinned = contract.ids as Record<string, string>;
    for (const atom of atoms) expect(pinned[`atom:${atom.slug}`]).toBe(atom.id);
    for (const item of items) expect(pinned[item.slug]).toBe(item.id);
    expect(Object.keys(pinned)).toHaveLength(48);
    expect(new Set(items.map((i) => i.slug)).size).toBe(items.length);
    expect(new Set(atoms.map((a) => a.source_link))).toEqual(new Set(LESSON_IDS.map((id) => lessonLink(id))));
  });

  it("binds every atom to its lesson, stage and LehrplanPLUS Inf6 Mittelschule, with three cards each", () => {
    const atomIds = new Set(atoms.map((a) => a.id));
    for (const atom of atoms) {
      const lessonId = must(parseTrainingDeepLink(new URL(atom.source_link).hash).lessonId);
      const { lesson, stage } = must(findLessonById(lessonId));
      expect(atom.slug).toBe(lesson.id);
      expect(atom.title).toBe(lesson.title);
      expect(atom.practice_items).toHaveLength(3);
      expect(atom.practice_items.some((item) => item.tier === "tier1_fast"), atom.slug).toBe(true);
      expect(atom.practice_items.some((item) => item.tier === "tier2_synthesis"), atom.slug).toBe(true);
      expect(atom.curricula).toContainEqual(
        expect.objectContaining({ provider: "zam-academy", subject: "informatik-mittelschule-6", topic_code: stage.id }),
      );
      const topicTitles: Record<string, string> = {
        "1": "Digitaler Informationsaustausch",
        "2": "Programmieren",
      };
      const official = atom.curricula.filter((entry) => entry.provider === "lehrplanplus-bayern");
      expect(official).toEqual([
        {
          provider: "lehrplanplus-bayern",
          school_type: "mittelschule",
          grade: 6,
          subject: "informatik",
          topic_code: `lb${lesson.module}`,
          topic_title: topicTitles[lesson.module],
          exam_relevant: false,
        },
      ]);
      for (const prerequisite of atom.prerequisites) expect(atomIds.has(prerequisite.atom_id)).toBe(true);
      for (const item of atom.practice_items as unknown as CellItem[]) {
        expect(item.source_link).toBe(lessonLink(lesson.id));
        expect(item.slug.startsWith(`${lesson.id}-`)).toBe(true);
        expect(item.replaces).toBeUndefined();
      }
    }
  });

  it("keeps cards short and exact: binary fast checks, two curated distractors with reasons, sample solutions", () => {
    for (const item of items) {
      for (const field of ["question", "concept"] as const) {
        expect(item[field] === undefined, `${item.slug}.${field}: plain XOR segments`).toBe(
          item[`${field}_segments`] !== undefined,
        );
      }
      expect(item.choice_distractors, item.slug).toHaveLength(2);
      for (const distractor of item.choice_distractors ?? []) {
        expect(distractor.text).not.toBe(item.concept);
        expect(distractor.reason.length, item.slug).toBeGreaterThan(20);
      }
      if (item.tier === "tier1_fast") {
        expect(item.fast_check?.options).toHaveLength(2);
        expect(item.fast_check?.correct_index).toBe(0);
        expect(item.fast_check?.options[0]).toBe(item.concept);
        expect(item.fast_check?.options[1]).toBe(item.choice_distractors?.[0].text);
        expect(must(item.concept).length, item.slug).toBeLessThanOrEqual(70);
      } else {
        expect(item.tier).toBe("tier2_synthesis");
        expect(must(item.sample_solution).length, item.slug).toBeGreaterThan(120);
      }
    }
  });

  it("keeps the proposal-only mapping clean with no replaces or retired_items", () => {
    expect(mapping.status).toBe("proposal-only");
    expect(mapping.approved).toBeNull();
    expect(mapping.sources).toEqual([]);
    expect(mapping.rows).toEqual([]);
    expect("retired_items" in cell).toBe(false);
    expect(items.every((item) => !("replaces" in item))).toBe(true);
  });
});
