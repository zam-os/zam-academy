import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import { CORE_LESSONS, findLesson, LESSONS, STAGES } from "../src/curriculum";
import { lessonLink } from "../src/zam/zam-link";
import legacy from "./fixtures/de-by-realschule-9-wirtschaft-recht-markt-vertraege-kvt.json";
import legacyBytes from "./fixtures/de-by-realschule-9-wirtschaft-recht-markt-vertraege-kvt.json?raw";
import contract from "./fixtures/public-contract.json";

const ITEMS = cell.atoms.flatMap((a) => a.practice_items);

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
      expect(atom.slug).toBe(`wr9-${lesson.id}`);
      expect(atom.title).toBe(lesson.title);
      expect(atom.source_link).toBe(lessonLink(lesson.id));
      expect(new URL(atom.source_link).hash).toBe(`#lesson=${lesson.id}`);
      expect(atom.namespace).toBe("zam-academy-wirtschaft-recht-realschule-9");
    });
  });
  it("binds core lessons to Realschule 9 in both Wahlpflichtfächergruppen and keeps optional ones unbound", () => {
    for (const atom of cell.atoms) {
      const lesson = findLesson(new URL(atom.source_link).hash.slice(8));
      expect(lesson).toBeDefined();
      if (!lesson) throw new Error("Unbekannter Lektionsanker");
      const bindings = atom.curricula.filter((c) => c.provider === "lehrplanplus-bayern");
      if (lesson.optional) {
        expect(bindings).toHaveLength(0);
        continue;
      }
      expect(bindings.map((b) => ("track" in b ? b.track : ""))).toEqual(["I", "III"]);
      for (const b of bindings)
        expect(b).toMatchObject({
          school_type: "realschule",
          grade: 9,
          subject: "wirtschaft-und-recht",
          topic_code: `lb${lesson.lb}`,
        });
    }
  });
  it("gives each lesson two or three single-point cards that ask without the lesson", () => {
    const ids = new Set<string>();
    for (const atom of cell.atoms) {
      expect(atom.practice_items.length).toBeGreaterThanOrEqual(2);
      expect(atom.practice_items.length).toBeLessThanOrEqual(3);
      const lesson = findLesson(new URL(atom.source_link).hash.slice(8));
      for (const item of atom.practice_items) {
        expect(item.source_link).toBe(atom.source_link);
        expect(item.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
        expect(ids.has(item.id)).toBe(false);
        ids.add(item.id);
        expect(item.language).toBe(lesson?.lb === 5 ? "en" : "de");
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
    expect(edges).toBeGreaterThan(30);
  });
  it("describes itself with the real counts", () => {
    expect(cell.description).toContain(`${CORE_LESSONS.length} Kernlektionen`);
    expect(cell.description).toContain(`${LESSONS.length - CORE_LESSONS.length} optionale`);
  });
});

describe("curriculum coverage", () => {
  it("accounts for all 37 competence expectations of the Fachlehrplan", () => {
    expect(coverage.rows).toHaveLength(37);
    const perUnit: Record<string, number> = {};
    for (const row of coverage.rows) perUnit[row.unit] = (perUnit[row.unit] ?? 0) + 1;
    expect(perUnit).toEqual({ "1.1": 4, "1.2": 6, "2.1": 4, "2.2": 4, "3": 6, "4.1": 3, "4.2": 4, "4.3": 6 });
  });
  it("uses the row form of the package standard: Lernbereich, Zweige, competence, lessons, evidence", () => {
    for (const row of [...coverage.rows, ...coverage.optional_rows]) {
      expect(row.track).toBe("I, III");
      expect(row.evidence.length).toBeGreaterThan(30);
      expect(row.lb).toBe(Number(row.unit[0]) === 5 ? 5 : Number(row.unit[0]));
      for (const id of row.lessons) expect(findLesson(id)?.lb, id).toBe(row.lb);
    }
    expect(coverage.core_lessons).toBe(CORE_LESSONS.length);
    expect(coverage.optional_lessons).toEqual(LESSONS.filter((l) => l.optional).map((l) => l.id));
  });
  it("covers every core lesson and only uses lessons of the same unit", () => {
    const covered = new Set(coverage.rows.flatMap((row) => row.lessons));
    expect(new Set(CORE_LESSONS.map((l) => l.id))).toEqual(covered);
    for (const row of coverage.rows) {
      expect(row.lessons.length).toBeGreaterThan(0);
      for (const id of row.lessons) {
        const lesson = findLesson(id);
        expect(lesson, id).toBeDefined();
        expect(lesson?.unit, `${id} in unit ${row.unit}`).toBe(row.unit);
      }
    }
  });
  it("covers the optional English lessons separately", () => {
    const optional = LESSONS.filter((l) => l.optional).map((l) => l.id);
    for (const row of coverage.optional_rows) expect(row.lessons).toEqual(optional);
  });
  it("lists the four Lernbereiche of the Fachlehrplan plus the bilingual option", () => {
    expect(STAGES.map((s) => s.lb)).toEqual([1, 2, 3, 4, 5]);
    expect(STAGES.slice(0, 4).reduce((sum, s) => sum + s.hours, 0)).toBe(56);
  });
});

describe("takeover of the old partial cell", () => {
  const oldIds = legacy.atoms.flatMap((a) => a.practice_items.map((i) => i.id));
  const successors = (id: string) =>
    (ITEMS as Array<{ slug: string; replaces?: string[] }>).filter((i) => i.replaces?.includes(id));

  it("accounts for each of the eight old cards once, against a snapshot that has not changed", async () => {
    expect(mapping.rows.map((r) => r.de_by_id)).toEqual(oldIds);
    expect(mapping.rows).toHaveLength(8);
    for (const row of mapping.rows) expect(["A", "C"]).toContain(row.category);
    const source = mapping.sources[0];
    // The hash is of the file with line feeds, however the checkout stores it.
    const normalised = legacyBytes.replaceAll("\r\n", "\n");
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalised));
    const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
    expect(hex).toBe(source.sha256);
    expect(source.tile_id).toBe(legacy.tile_id);
  });
  it("names an existing card for every A row and none for a C row", () => {
    const slugs = ITEMS.map((i) => i.slug);
    for (const row of mapping.rows) {
      if (row.category === "A") expect(slugs.filter((s) => s === row.academy_slug)).toHaveLength(1);
      else expect(row.academy_slug).toBeNull();
    }
    expect(mapping.rows.filter((r) => r.category === "A")).toHaveLength(3);
  });
  it("changes no history until the mapping is approved", () => {
    if (mapping.approved === null) {
      expect(cell).not.toHaveProperty("retired_items");
      for (const item of ITEMS) expect(item).not.toHaveProperty("replaces");
      return;
    }
    for (const row of mapping.rows)
      expect(successors(row.de_by_id).map((i) => i.slug)).toEqual(row.category === "A" ? [row.academy_slug] : []);
  });
});
