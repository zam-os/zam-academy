import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import { ALL_EXPECTATIONS, findLesson, LESSONS, STAGES, UNITS } from "../src/curriculum";
import { lessonLink } from "../src/zam/zam-link";
import legacy from "./fixtures/de-by-realschule-9-franzoesisch-imparfait-futur-objektpronomen-kvt.json";
import legacyBytes from "./fixtures/de-by-realschule-9-franzoesisch-imparfait-futur-objektpronomen-kvt.json?raw";
import contract from "./fixtures/public-contract.json";

const ITEMS = cell.atoms.flatMap((a) => a.practice_items);
/** The stage of the learning path (zam-academy provider) and the Lernbereich of the plan (lehrplanplus-bayern provider). */
const STAGE_CODES: Record<number, [string, string]> = {
  1: ["verstehen-mitteilen", "Verstehen und sich mitteilen"],
  2: ["grammatik", "Grammatik"],
  3: ["wortschatz-aussprache", "Wortschatz und Aussprache"],
  4: ["frankreich-erleben", "Frankreich erleben"],
  5: ["texte-medien", "Texte und Medien"],
  6: ["lernen-lernen", "Lernen lernen"],
  7: ["themengebiete", "Themengebiete"],
};
const PLAN_CODES: Record<string, [string, string]> = {
  "1.1": ["lb1-1", "Kommunikative Fertigkeiten"],
  "1.2.1": ["lb1-2", "Verfügen über sprachliche Mittel"],
  "1.2.2": ["lb1-2", "Verfügen über sprachliche Mittel"],
  "1.2.3": ["lb1-2", "Verfügen über sprachliche Mittel"],
  "2": ["lb2", "Interkulturelle Kompetenzen"],
  "3": ["lb3", "Text- und Medienkompetenzen"],
  "4": ["lb4", "Methodische Kompetenzen"],
  "5": ["lb5", "Themengebiete"],
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
      expect(atom.slug).toBe(`fr9-${lesson.id.slice("fr-".length)}`);
      expect(atom.title).toBe(lesson.title);
      expect(atom.source_link).toBe(lessonLink(lesson.id));
      expect(new URL(atom.source_link).hash).toBe(`#lesson=${lesson.id}`);
      expect(atom.namespace).toBe("zam-academy-franzoesisch-realschule-9");
    });
  });
  it("binds every lesson to its stage and to its Lernbereich for Wahlpflichtfächergruppe IIIa", () => {
    for (const atom of cell.atoms) {
      const lesson = findLesson(new URL(atom.source_link).hash.slice("#lesson=".length));
      if (!lesson) throw new Error("Unbekannter Lektionsanker");
      expect(atom.curricula).toEqual([
        {
          provider: "zam-academy",
          subject: "franzoesisch-realschule-9",
          topic_code: STAGE_CODES[lesson.lb][0],
          topic_title: STAGE_CODES[lesson.lb][1],
        },
        {
          provider: "lehrplanplus-bayern",
          school_type: "realschule",
          grade: 9,
          track: "IIIa",
          subject: "franzoesisch",
          topic_code: PLAN_CODES[lesson.unit][0],
          topic_title: PLAN_CODES[lesson.unit][1],
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
  it("links each lesson to the lessons it builds on, without a cycle", () => {
    const ids = new Set(cell.atoms.map((atom) => atom.id));
    const edges = new Map<string, string[]>();
    let count = 0;
    for (const atom of cell.atoms) {
      edges.set(atom.id, atom.prerequisites.map((pre) => pre.atom_id));
      for (const pre of atom.prerequisites) {
        count += 1;
        expect(["hard", "soft"]).toContain(pre.type);
        expect(pre.rationale.length).toBeGreaterThan(20);
        expect(ids.has(pre.atom_id), atom.slug).toBe(true);
        expect(pre.atom_id, atom.slug).not.toBe(atom.id);
      }
    }
    // Walking the prerequisites of each atom never returns to it.
    for (const atom of cell.atoms) {
      const seen = new Set<string>();
      const stack = [...(edges.get(atom.id) ?? [])];
      while (stack.length) {
        const next = stack.pop() as string;
        expect(next, `${atom.slug}: Kreis in den Voraussetzungen`).not.toBe(atom.id);
        if (seen.has(next)) continue;
        seen.add(next);
        stack.push(...(edges.get(next) ?? []));
      }
    }
    expect(count).toBe(27);
  });
  it("files the grammar lessons under the area ZAM's Wissensatlas already has for Französisch", () => {
    // `franzoesisch/grammatik` is an alias of the atlas area "grammaire". The other segments (kommunikation,
    // wortschatz, landeskunde, methodik) have no area in the Französisch seed yet; they are new domains.
    const counts: Record<string, number> = {};
    for (const atom of cell.atoms) counts[atom.domain] = (counts[atom.domain] ?? 0) + 1;
    expect(counts).toEqual({
      "franzoesisch/kommunikation": 16,
      "franzoesisch/grammatik": 21,
      "franzoesisch/wortschatz": 10,
      "franzoesisch/landeskunde": 5,
      "franzoesisch/methodik": 4,
    });
  });
  it("describes itself with the real count and links its sources", () => {
    expect(cell.description).toContain(`${LESSONS.length} Lektionen`);
    expect(cell.sources.map((s) => s.uri)).toContain("https://academy.zam-os.org/franzoesisch-realschule-9/");
    expect(cell.sources.map((s) => s.uri)).toContain("https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/franzoesisch");
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
  it("accounts for all 51 competence expectations of the Fachlehrplan, in the order of the learning path", () => {
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
      // The competence text is the plan's own, not a paraphrase: it starts with the verb the plan uses.
      expect(row.competence).toMatch(/^[a-zäöü]/);
      expect(row.competence.length).toBeGreaterThan(60);
      expect(row.evidence.length).toBeGreaterThan(30);
      expect(row.lessons.length).toBeGreaterThan(0);
    }
    expect(coverage.core_lessons).toBe(LESSONS.length);
    expect(coverage.curriculum).toBe("https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/franzoesisch");
    expect(coverage.track).toBe("IIIa");
  });
  it("lists for every competence exactly the lessons that name it, and every lesson at least once", () => {
    for (const row of rows) {
      const taught = LESSONS.filter((l) => l.covers.includes(row.code)).map((l) => l.id);
      expect(row.lessons, row.code).toEqual(taught);
      for (const id of row.lessons) expect(findLesson(id), id).toBeDefined();
    }
    const covered = new Set(rows.flatMap((r) => r.lessons));
    expect(covered).toEqual(new Set(LESSONS.map((l) => l.id)));
  });
  it("names the seven stages and says what stays outside the app", () => {
    expect(STAGES.map((s) => s.title)).toHaveLength(7);
    expect(coverage.outside_app.length).toBeGreaterThanOrEqual(3);
    // Listening and speaking are not checked by the app, and the matrix says so on the rows concerned.
    const rowOf = (code: string) => rows.find((r) => r.code === code)?.evidence ?? "";
    expect(rowOf("1.1.1")).toContain("keinen Ton");
    expect(rowOf("1.2.3.1")).toContain("keine Aussprache");
  });
});

describe("approved retirement of the old partial cell", () => {
  const rows = mapping.rows as Array<{
    de_by_cell: string;
    de_by_id: string;
    category: string;
    academy_slug: string | null;
    action?: string;
    reason: string;
  }>;
  const oldIds = legacy.atoms.flatMap((a) => a.practice_items.map((i) => i.id));
  const slugs = ITEMS.map((i) => i.slug);

  it("accounts for each of the four old cards once, against a snapshot that has not changed", async () => {
    expect(rows.map((r) => r.de_by_id)).toEqual(oldIds);
    expect(rows).toHaveLength(4);
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
    expect(hex).toBe("bb11c43e238059b978c3e6e8442763a549d4617e42f7cc9f1d5bd14cb11493ff");
    expect(source.sha256).toBe(hex);
    expect(source.tile_id).toBe(legacy.tile_id);
  });
  it("moves no history and retires each old card as category C, naming only cards that exist", () => {
    for (const row of rows) {
      expect(row.category).toBe("C");
      expect(row.academy_slug).toBeNull();
      expect(row).not.toHaveProperty("action");
      // A reason that points at a new card names it by slug, and the card exists.
      for (const slug of row.reason.match(/fr9-[a-z0-9-]+/g) ?? []) expect(slugs, slug).toContain(slug);
    }
  });
  it("is approved by Thomas and the cell declares exactly the four retirements and no replaces", () => {
    expect(mapping.approved).toBe("2026-10-24");
    expect(mapping).not.toHaveProperty("status");
    expect((cell as { retired_items?: Array<{ id: string; reason: string }> }).retired_items).toEqual(
      rows.map((r) => ({ id: r.de_by_id, reason: r.reason })),
    );
    for (const item of ITEMS) expect(item).not.toHaveProperty("replaces");
    expect(cell.version).toBe("2026.10.2");
  });
});
