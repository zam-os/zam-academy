import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import mapping from "../replaces-de-by.json";
import { ALL_LESSONS, findLessonById } from "../src/curriculum/index";
import { lessonLink, parseTrainingDeepLink, ZAM_CELL_ID } from "../src/zam/zam-link";
import legacy6 from "./fixtures/de-by-realschule-6-informatik-textverarbeitung-praesentation-kvt.json";
import legacy7 from "./fixtures/de-by-realschule-7-informatik-informationsdarstellung-dateisystem-kvt.json";
import legacy8 from "./fixtures/de-by-realschule-8-informatik-objektorientierung-vektorgrafik-kvt.json";
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

describe("ZAM cell zam-academy:informatik-realschule-8", () => {
  it("has 40 atoms (one per lesson) and 87 cards with frozen ULIDs from the public contract", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(cell.version).toBe("2026.10.2");
    expect(atoms).toHaveLength(40);
    expect(items).toHaveLength(87);
    const ids = [...atoms.map((a) => a.id), ...items.map((i) => i.id)];
    expect(new Set(ids).size).toBe(127);
    for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
    expect(new Set(ids.map((id) => id.slice(10))).size).toBe(ids.length);
    expect(ALL_LESSONS.map((l) => l.id)).toEqual(contract.lessons);
    expect(contract.lessons).toEqual([...LESSON_IDS]);
    const pinned = contract.ids as Record<string, string>;
    for (const atom of atoms) expect(pinned[`atom:${atom.slug}`]).toBe(atom.id);
    for (const item of items) expect(pinned[item.slug]).toBe(item.id);
    expect(Object.keys(pinned)).toHaveLength(127);
    expect(new Set(items.map((i) => i.slug)).size).toBe(items.length);
    expect(new Set(atoms.map((a) => a.source_link))).toEqual(new Set(LESSON_IDS.map((id) => lessonLink(id))));
  });

  it("binds every atom to its lesson, stage and IT module, with two to four cards each", () => {
    const atomIds = new Set(atoms.map((a) => a.id));
    for (const atom of atoms) {
      const lessonId = must(parseTrainingDeepLink(new URL(atom.source_link).hash).lessonId);
      const { lesson, stage } = must(findLessonById(lessonId));
      expect(atom.slug).toBe(lesson.id);
      expect(atom.title).toBe(lesson.title);
      expect(atom.practice_items.length).toBeGreaterThanOrEqual(2);
      expect(atom.practice_items.length).toBeLessThanOrEqual(4);
      expect(atom.practice_items.some((item) => item.tier === "tier2_synthesis"), atom.slug).toBe(true);
      expect(atom.curricula).toContainEqual(
        expect.objectContaining({ provider: "zam-academy", subject: "informatik-realschule-8", topic_code: stage.id }),
      );
      expect(atom.curricula).toContainEqual(
        expect.objectContaining({ provider: "lehrplanplus-bayern", school_type: "realschule", grade: 8, subject: "it", topic_code: `it-${lesson.module}` }),
      );
      for (const prerequisite of atom.prerequisites) expect(atomIds.has(prerequisite.atom_id)).toBe(true);
      for (const item of atom.practice_items as unknown as CellItem[]) {
        expect(item.source_link).toBe(lessonLink(lesson.id));
        expect(item.slug.startsWith(`${lesson.id}-`)).toBe(true);
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
      if (item.tier === "tier1_fast") {
        expect(item.fast_check?.options).toHaveLength(2);
        expect(item.fast_check?.correct_index).toBe(0);
        expect(item.fast_check?.options[0]).toBe(item.concept);
        expect(item.choice_distractors).toHaveLength(2);
        expect(item.fast_check?.options[1]).toBe(item.choice_distractors?.[0].text);
        for (const distractor of item.choice_distractors ?? []) {
          expect(distractor.text).not.toBe(item.concept);
          expect(distractor.reason.length, item.slug).toBeGreaterThan(20);
        }
        expect(must(item.concept).length, item.slug).toBeLessThanOrEqual(70);
      } else {
        expect(item.tier).toBe("tier2_synthesis");
        expect(must(item.sample_solution).length, item.slug).toBeGreaterThan(120);
      }
    }
  });

  it("ships exactly the approved mapping: A/B rows replaced by one successor, C rows retired", () => {
    expect(mapping.status).toBe("approved");
    expect(mapping.approved).toBe("2026-10-27");
    expect(mapping.source).toContain("Freigabe erteilt");
    const replaced = items.filter((item) => item.replaces !== undefined);
    expect(replaced).toHaveLength(11);
    for (const item of replaced) {
      expect(item.replaces).toHaveLength(1);
      const row = must(mapping.rows.find((r) => r.de_by_id === must(item.replaces)[0]));
      expect(row.category).not.toBe("C");
      expect(row.academy_slug).toBe(item.slug);
      expect(row.action).toBe("replace");
    }
    const retired = must(cell.retired_items).map((entry) => entry.id).sort();
    expect(retired).toEqual(mapping.rows.filter((r) => r.category === "C").map((r) => r.de_by_id).sort());
    for (const row of mapping.rows.filter((r) => r.category === "C")) expect(row.action).toBe("retire");
    type LegacyTile = { atoms: Array<{ practice_items: CellItem[] }> };
    const originals = ([legacy6, legacy7, legacy8] as unknown as LegacyTile[]).flatMap((tile) =>
      tile.atoms.flatMap((atom) => atom.practice_items),
    );
    expect(mapping.rows).toHaveLength(24);
    expect(mapping.rows.map((r) => r.de_by_id).sort()).toEqual(originals.map((item) => item.id).sort());
    expect(mapping.sources.map((s) => s.tile_id)).toEqual([legacy6.tile_id, legacy7.tile_id, legacy8.tile_id]);
    const bySlug = new Map(items.map((i) => [i.slug, i]));
    const successors = mapping.rows.filter((r) => r.category !== "C").map((r) => must(r.academy_slug));
    expect(new Set(successors).size).toBe(successors.length);
    for (const row of mapping.rows) {
      expect(row.reason.length).toBeGreaterThan(40);
      if (row.category === "C") expect(row.academy_slug).toBeNull();
      else expect(bySlug.has(must(row.academy_slug)), row.de_by_id).toBe(true);
    }
    expect(mapping.rows.filter((r) => r.category === "A")).toHaveLength(10);
    expect(mapping.rows.filter((r) => r.category === "B")).toHaveLength(1);
    expect(mapping.rows.filter((r) => r.category === "C")).toHaveLength(13);
    const b = must(mapping.rows.find((r) => r.category === "B"));
    const old = must(originals.find((item) => item.id === b.de_by_id));
    const successor = must(bySlug.get(must(b.academy_slug)));
    expect(successor.question).toBe(old.question);
    expect(successor.concept).toBe(old.concept);
    expect(successor.sample_solution).toBe(old.sample_solution);
  });
});
