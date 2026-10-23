import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import { ALL_EXPECTATIONS, findLesson, LESSONS, STAGES, UNITS } from "../src/curriculum";
import { lessonLink } from "../src/zam/zam-link";
import legacy from "./fixtures/de-by-realschule-9-deutsch-argumentation-eroerterung-kvt.json";
import legacyBytes from "./fixtures/de-by-realschule-9-deutsch-argumentation-eroerterung-kvt.json?raw";
import contract from "./fixtures/public-contract.json";

const ITEMS = cell.atoms.flatMap((a) => a.practice_items);
const LB_TITLES: Record<number, string> = {
  1: "Sprechen und Zuhören",
  2: "Lesen – mit Texten und weiteren Medien umgehen",
  3: "Schreiben",
  4: "Sprachgebrauch und Sprache untersuchen und reflektieren",
};

describe("public learning contract", () => {
  it("pins every lesson id and every atom and card id that ZAM cites", () => {
    expect(LESSONS.map((l) => l.id)).toEqual(contract.lessons);
    expect(contract.tile_id).toBe(cell.tile_id);
    expect(
      cell.atoms.map((a) => ({
        id: a.id,
        slug: a.slug,
        items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug, source_link: i.source_link })),
      })),
    ).toEqual(contract.atoms);
  });
  it("has one atom per lesson, in lesson order, citing that lesson", () => {
    expect(cell.atoms).toHaveLength(LESSONS.length);
    cell.atoms.forEach((atom, i) => {
      const lesson = LESSONS[i];
      expect(atom.slug).toBe(`de9-${lesson.id.slice("de-".length)}`);
      expect(atom.title).toBe(lesson.title);
      expect(atom.source_link).toBe(lessonLink(lesson.id));
      expect(new URL(atom.source_link).hash).toBe(`#lesson=${lesson.id}`);
      expect(atom.namespace).toBe("zam-academy-deutsch-realschule-9");
    });
  });
  it("binds every lesson to its Lernbereich for all of Realschule 9, with no group named", () => {
    for (const atom of cell.atoms) {
      const lesson = findLesson(new URL(atom.source_link).hash.slice("#lesson=".length));
      if (!lesson) throw new Error("Unbekannter Lektionsanker");
      expect(atom.curricula).toEqual([
        {
          provider: "zam-academy",
          subject: "deutsch-realschule-9",
          topic_code: `lb${lesson.lb}`,
          topic_title: LB_TITLES[lesson.lb],
        },
        {
          provider: "lehrplanplus-bayern",
          school_type: "realschule",
          grade: 9,
          subject: "deutsch",
          topic_code: `lb${lesson.lb}`,
          topic_title: LB_TITLES[lesson.lb],
          exam_relevant: true,
        },
      ]);
    }
  });
  it("gives each lesson three single-point cards that ask without the lesson", () => {
    const ids = new Set<string>();
    for (const atom of cell.atoms) {
      const lesson = findLesson(new URL(atom.source_link).hash.slice("#lesson=".length));
      expect(atom.practice_items.map((i) => i.slug.slice(atom.slug.length + 1))).toEqual(["check", "kern", "extra"]);
      for (const item of atom.practice_items) {
        expect(item.slug.startsWith(`${atom.slug}-`)).toBe(true);
        expect(item.source_link).toBe(atom.source_link);
        expect(item.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
        expect(ids.has(item.id)).toBe(false);
        ids.add(item.id);
        expect(item.language).toBe("de");
        expect(item.concept.trim().length).toBeGreaterThan(0);
        expect(item.concept).not.toBe(lesson?.takeaway);
        expect(`${item.question} ${item.concept}`).not.toMatch(/\*\*|Lektion|im Text|siehe oben/);
        if (item.tier === "tier1_fast") {
          expect(item.fast_check?.options[item.fast_check.correct_index]).toBe(item.concept);
          expect(item.choice_distractors).toHaveLength(2);
        } else {
          expect(item.sample_solution?.length).toBeGreaterThan(60);
        }
      }
      expect(atom.practice_items[0].tier).toBe("tier1_fast");
      expect(atom.practice_items[1].tier).toBe("tier2_synthesis");
    }
    expect(new Set([...cell.atoms.map((a) => a.id), ...ids]).size).toBe(cell.atoms.length + ITEMS.length);
  });
  it("uses real ULIDs, generated once: a date of this year and random tails", () => {
    const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
    const time = (id: string) => [...id.slice(0, 10)].reduce((n, ch) => n * 32 + alphabet.indexOf(ch), 0);
    const ids = [...cell.atoms.map((a) => a.id), ...ITEMS.map((i) => i.id)];
    for (const id of ids) {
      expect(time(id)).toBeGreaterThan(Date.UTC(2026, 9, 1));
      expect(time(id)).toBeLessThan(Date.UTC(2026, 11, 31));
    }
    // Sixteen random characters: no id repeats its tail, and none is a pattern.
    expect(new Set(ids.map((id) => id.slice(10))).size).toBe(ids.length);
    for (const id of ids) expect(new Set(id.slice(10)).size).toBeGreaterThan(5);
  });
  it("links each lesson to the earlier lessons it builds on", () => {
    const index = new Map(cell.atoms.map((atom, i) => [atom.id, i]));
    let edges = 0;
    cell.atoms.forEach((atom, i) => {
      for (const pre of atom.prerequisites) {
        edges += 1;
        expect(["hard", "soft"]).toContain(pre.type);
        expect(pre.rationale.length).toBeGreaterThan(20);
        expect(index.get(pre.atom_id), atom.slug).toBeLessThan(i);
      }
    });
    expect(edges).toBe(52);
  });
  it("describes itself with the real count and links its sources", () => {
    expect(cell.description).toContain(`${LESSONS.length} Lektionen`);
    expect(cell.sources.map((s) => s.uri)).toContain("https://academy.zam-os.org/deutsch-realschule-9/");
    expect(cell.sources.map((s) => s.uri)).toContain("https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/deutsch");
  });
});

describe("curriculum coverage", () => {
  const rows = coverage.rows as Array<{
    lb: number;
    unit: string;
    code: string;
    competence: string;
    lessons: string[];
    evidence: string;
  }>;
  it("accounts for all 51 competence expectations of the Fachlehrplan, in the order of the plan", () => {
    expect(rows).toHaveLength(51);
    expect(rows.map((r) => r.code)).toEqual(ALL_EXPECTATIONS);
    const perUnit: Record<string, number> = {};
    for (const row of rows) perUnit[row.unit] = (perUnit[row.unit] ?? 0) + 1;
    expect(perUnit).toEqual(Object.fromEntries(Object.entries(UNITS).map(([unit, u]) => [unit, u.expectations])));
  });
  it("uses the row form of the package standard: Lernbereich, competence, lessons, evidence", () => {
    for (const row of rows) {
      expect(row.lb).toBe(UNITS[row.unit].lb);
      expect(row.code.startsWith(`${row.unit}.`)).toBe(true);
      expect(row.competence.length).toBeGreaterThan(60);
      expect(row.evidence.length).toBeGreaterThan(30);
      expect(row.lessons.length).toBeGreaterThan(0);
    }
    expect(coverage.core_lessons).toBe(LESSONS.length);
    expect(coverage.curriculum).toBe("https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/deutsch");
  });
  it("lists for every competence exactly the lessons that name it, and every lesson at least once", () => {
    for (const row of rows) {
      const taught = LESSONS.filter((l) => l.covers.includes(row.code)).map((l) => l.id);
      expect(row.lessons, row.code).toEqual(taught);
      for (const id of row.lessons) expect(findLesson(id)?.lb, id).toBe(row.lb);
    }
    const covered = new Set(rows.flatMap((r) => r.lessons));
    expect(covered).toEqual(new Set(LESSONS.map((l) => l.id)));
  });
  it("names the four Lernbereiche of the plan and says what stays outside the app", () => {
    expect(STAGES.map((s) => s.title)).toHaveLength(4);
    expect(coverage.outside_app.length).toBeGreaterThanOrEqual(3);
  });
});

describe("takeover of the old partial cell", () => {
  const rows = mapping.rows as Array<{
    de_by_cell: string;
    de_by_id: string;
    category: string;
    academy_slug: string | null;
    reason: string;
  }>;
  const oldIds = legacy.atoms.flatMap((a) => a.practice_items.map((i) => i.id));
  const successors = (id: string) =>
    (ITEMS as Array<{ slug: string; replaces?: string[] }>).filter((i) => i.replaces?.includes(id));

  it("accounts for each of the eight old cards once, against a snapshot that has not changed", async () => {
    expect(rows.map((r) => r.de_by_id)).toEqual(oldIds);
    expect(rows).toHaveLength(8);
    for (const row of rows) {
      expect(["A", "B", "C"]).toContain(row.category);
      expect(row.reason.length).toBeGreaterThan(60);
      expect(row.de_by_cell).toBe(legacy.tile_id);
    }
    const source = mapping.sources[0];
    // The hash is of the file with line feeds, however the checkout stores it.
    const normalised = legacyBytes.replaceAll("\r\n", "\n");
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalised));
    const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
    // Pinned here as well as in the mapping, so changing the snapshot and its hash together does not pass unnoticed.
    expect(hex).toBe("77734aac15cf57c4d6f514a31993cf42c6f80057c8a1d1ff66f71e7e4441ecdc");
    expect(source.sha256).toBe(hex);
    expect(source.tile_id).toBe(legacy.tile_id);
  });
  it("names an existing card for every A or B row and none for a C row", () => {
    const slugs = ITEMS.map((i) => i.slug);
    for (const row of rows) {
      if (row.category === "C") expect(row.academy_slug).toBeNull();
      else expect(slugs.filter((s) => s === row.academy_slug)).toHaveLength(1);
    }
  });
  it("changes no history until the mapping is approved", () => {
    const approved = mapping.approved as string | null;
    expect(approved === null || /^\d{4}-\d{2}-\d{2}$/.test(approved)).toBe(true);
    if (approved === null) {
      expect(mapping.status).toBe("proposal-only");
      expect(cell).not.toHaveProperty("retired_items");
      for (const item of ITEMS) expect(item).not.toHaveProperty("replaces");
      return;
    }
    expect(String(mapping.source)).toContain("Thomas");
    for (const row of rows)
      expect(successors(row.de_by_id).map((i) => i.slug)).toEqual(row.category === "C" ? [] : [row.academy_slug]);
  });
});
