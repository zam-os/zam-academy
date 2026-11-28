import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import { CORE_LESSONS, findLesson, LESSONS, STAGES } from "../src/curriculum";
import { lessonLink } from "../src/zam/zam-link";
import legacy from "./fixtures/de-by-gymnasium-8-wirtschaft-recht-markt-geld-verbraucherschutz-kvt.json";
import legacyBytes from "./fixtures/de-by-gymnasium-8-wirtschaft-recht-markt-geld-verbraucherschutz-kvt.json?raw";
import contract from "./fixtures/public-contract.json";

const ITEMS = cell.atoms.flatMap((a) => a.practice_items);
const lessonOf = (link: string) => findLesson(new URL(link).hash.slice("#lesson=".length));

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
    expect(cell.tile_id).toBe("zam-academy:wirtschaft-recht-gymnasium-8");
    expect(cell.atoms).toHaveLength(LESSONS.length);
    cell.atoms.forEach((atom, i) => {
      const lesson = LESSONS[i];
      expect(atom.slug).toBe(`wrg8-${lesson.id}`);
      expect(atom.title).toBe(lesson.title);
      expect(atom.source_link).toBe(lessonLink(lesson.id));
      expect(atom.atom_uri).toBe(`urn:zam:atom:${atom.id}`);
      expect(atom.namespace).toBe("zam-academy-wirtschaft-recht-gymnasium-8");
    });
  });
  it("binds every atom to Gymnasium 8, Wirtschaft und Recht, the WWG and its Lernbereich", () => {
    for (const atom of cell.atoms) {
      const lesson = lessonOf(atom.source_link);
      if (!lesson) throw new Error(`Unbekannter Lektionsanker: ${atom.source_link}`);
      const stage = STAGES.find((s) => s.lb === lesson.lb);
      const bindings = atom.curricula.filter((c) => c.provider === "lehrplanplus-bayern");
      expect(bindings).toHaveLength(1);
      expect(bindings[0]).toEqual({
        provider: "lehrplanplus-bayern",
        school_type: "gymnasium",
        grade: 8,
        subject: "wirtschaft-und-recht",
        track: "WWG",
        topic_code: `lb${lesson.lb}`,
        topic_title: stage?.title,
        // The Profilbereich is chosen by each class.
        exam_relevant: !lesson.optional,
      });
      expect(atom.curricula.find((c) => c.provider === "zam-academy")).toMatchObject({
        subject: "wirtschaft-recht-gymnasium-8",
        topic_code: `lb${lesson.lb}`,
      });
    }
  });
  it("gives each lesson two to four single-point cards that ask without the lesson", () => {
    const ids = new Set<string>();
    for (const atom of cell.atoms) {
      expect(atom.practice_items.length).toBeGreaterThanOrEqual(2);
      expect(atom.practice_items.length).toBeLessThanOrEqual(4);
      const lesson = lessonOf(atom.source_link);
      for (const item of atom.practice_items) {
        expect(item.source_link).toBe(atom.source_link);
        expect(item.slug.startsWith(`${atom.slug}-`)).toBe(true);
        expect(item.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
        expect(ids.has(item.id)).toBe(false);
        ids.add(item.id);
        expect(item.language).toBe("de");
        expect(item.question.trim().endsWith("?")).toBe(true);
        expect(item.concept.trim().length).toBeGreaterThan(0);
        expect(item.concept).not.toBe(lesson?.takeaway);
        expect(`${item.question} ${item.concept}`).not.toMatch(/\*\*|Lektion|im Text|siehe oben/);
        if (item.tier === "tier1_fast") {
          const fast = "fast_check" in item ? item.fast_check : undefined;
          expect(fast?.options).toHaveLength(2);
          expect(fast?.correct_index).toBe(0);
          expect(fast?.options[0]).toBe(item.concept);
          // Curated distractors: exactly two, each with the misconception it targets.
          const distractors = "choice_distractors" in item ? item.choice_distractors : [];
          expect(distractors).toHaveLength(2);
          for (const d of distractors ?? []) {
            expect(d.text).not.toBe(item.concept);
            expect(d.reason.length).toBeGreaterThan(20);
          }
          expect(fast?.options[1]).toBe(distractors?.[0].text);
        } else {
          expect(item.tier).toBe("tier2_synthesis");
          expect(("sample_solution" in item ? item.sample_solution : "")?.length).toBeGreaterThan(60);
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
        expect(index.has(pre.atom_id)).toBe(true);
        expect(index.get(pre.atom_id), atom.slug).toBeLessThan(i);
      }
    });
    expect(edges).toBeGreaterThan(40);
  });
  it("describes itself with the real counts", () => {
    expect(cell.description).toContain(`${CORE_LESSONS.length} Kernlektionen`);
    expect(cell.description).toContain(`${LESSONS.length - CORE_LESSONS.length} Lektionen des Profilbereichs`);
    expect(cell.description).toContain(`${ITEMS.length} Karten`);
  });
});

describe("curriculum coverage", () => {
  it("accounts for all 23 competence expectations of the Fachlehrplan", () => {
    expect(coverage.rows).toHaveLength(19);
    expect(coverage.optional_rows).toHaveLength(4);
    const perUnit: Record<string, number> = {};
    for (const row of coverage.rows) perUnit[row.unit] = (perUnit[row.unit] ?? 0) + 1;
    expect(perUnit).toEqual({ "1.1": 2, "1.2": 4, "2.1": 4, "2.2": 4, "3": 5 });
    expect(coverage.optional_rows.map((r) => r.unit)).toEqual(["4.1", "4.2", "4.3", "4.4"]);
    expect(coverage.curriculum_sha256).toMatch(/^[0-9a-f]{64}$/);
  });
  it("uses the row form of the package standard: Lernbereich, track, competence, lessons, evidence", () => {
    for (const row of [...coverage.rows, ...coverage.optional_rows]) {
      expect(row.track).toBe("WWG");
      expect(row.evidence.length).toBeGreaterThan(30);
      expect(row.lb).toBe(Number(row.unit[0]));
      expect(["implemented", "supported"]).toContain(row.status);
      expect(row.lessons.length).toBeGreaterThan(0);
      for (const id of row.lessons) {
        const lesson = findLesson(id);
        expect(lesson, id).toBeDefined();
        expect(lesson?.unit, `${id} in unit ${row.unit}`).toBe(row.unit);
      }
    }
    expect(coverage.core_lessons).toBe(CORE_LESSONS.length);
    expect(coverage.optional_lessons).toEqual(LESSONS.filter((l) => l.optional).map((l) => l.id));
  });
  it("covers every core lesson with a competence and every Profil lesson with a Profil row", () => {
    expect(new Set(CORE_LESSONS.map((l) => l.id))).toEqual(new Set(coverage.rows.flatMap((row) => row.lessons)));
    expect(new Set(coverage.optional_lessons)).toEqual(new Set(coverage.optional_rows.flatMap((row) => row.lessons)));
  });
  it("maps every content of the Fachlehrplan to existing lessons", () => {
    expect(coverage.contents.length).toBeGreaterThanOrEqual(45);
    for (const row of coverage.contents) {
      expect(row.lessons.length).toBeGreaterThan(0);
      for (const id of row.lessons) expect(findLesson(id), `${row.content}: ${id}`).toBeDefined();
    }
  });
  it("lists the three Lernbereiche with their 84 hours plus the Profilbereich", () => {
    expect(STAGES.map((s) => s.lb)).toEqual([1, 2, 3, 4]);
    expect(STAGES.slice(0, 3).reduce((sum, s) => sum + s.hours, 0)).toBe(84);
    expect(coverage.required_hours).toBe(84);
    const unitHours = coverage.units.filter((u) => u.hours !== null).reduce((sum, u) => sum + (u.hours ?? 0), 0);
    expect(unitHours).toBe(84);
  });
});

describe("approved mapping of the old Grade 8 cell", () => {
  const oldIds = legacy.atoms.flatMap((a) => a.practice_items.map((i) => i.id));

  it("accounts for each of the four old cards once, against a snapshot that has not changed", async () => {
    expect(mapping.rows.map((r) => r.de_by_id)).toEqual(oldIds);
    expect(mapping.rows).toHaveLength(4);
    const source = mapping.sources[0];
    // The hash is of the file with line feeds, however the checkout stores it.
    const normalised = legacyBytes.replaceAll("\r\n", "\n");
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalised));
    const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
    expect(hex).toBe(source.sha256);
    expect(source.tile_id).toBe(legacy.tile_id);
    expect(source.version).toBe(legacy.version);
    // § 6: where the snapshot was taken.
    expect(mapping.source_repository).toBe("zam-os/zam");
    expect(mapping.source_commit).toMatch(/^[0-9a-f]{40}$/);
  });
  it("activates exactly the decision Thomas approved: retire J04, keep J01 to J03", () => {
    expect(mapping.status).toBe("approved");
    expect(mapping.approved).toBe("2026-11-28");
    expect(mapping.source).toContain("J04 stilllegen, J01–J03 aktiv lassen");
    for (const row of mapping.rows) {
      expect(row.category).toBe("C");
      expect(row.academy_slug).toBeNull();
      expect(row.reason.length).toBeGreaterThan(60);
    }
    const retired = mapping.rows.filter((row) => row.action === "retire");
    const kept = mapping.rows.filter((row) => row.action === "keep-active");
    expect(retired.map((row) => row.de_by_id)).toEqual(["01K8G8S0000000000000000J04"]);
    expect(kept.map((row) => row.de_by_id)).toEqual(oldIds.slice(0, 3));
    // C rows never transfer a history; only the retirement reaches the cell.
    expect(ITEMS.some((item) => "replaces" in item)).toBe(false);
    expect(cell.retired_items).toEqual(retired.map((row) => ({ id: row.de_by_id, reason: row.reason })));
  });
});
