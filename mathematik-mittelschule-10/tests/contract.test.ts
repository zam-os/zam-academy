import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import html from "../index.html?raw";
import mapping from "../replaces-de-by.json";
import { ALL_LESSONS, findLessonById, STAGES } from "../src/curriculum";
import { createRng } from "../src/exercises/rng";
import main from "../src/main.ts?raw";
import { DEFAULT_LESSON_ID } from "../src/storage/progress";
import storage from "../src/storage/progress.ts?raw";
import {
  lessonLink,
  parseTrainingDeepLink,
  ZAM_CELL_ID,
} from "../src/zam/zam-link";
import competences from "./fixtures/curriculum-competences.json";
import publicContract from "./fixtures/public-contract.json";

const grade = 10;
const counts = [6, 3, 5, 5, 2, 4, 10];
const ulid = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;
/** Lernbereich of each verbatim clause: six in LB 1, two in LB 2, five in LB 3, four in LB 4, two in LB 5, four in LB 6, nine in LB 7. */
const competenceAreas = [6, 2, 5, 4, 2, 4, 9].flatMap((n, i) => Array<number>(n).fill(i + 1));
type Segment = { type: string; text?: string; tex?: string; speech?: string };
type Item = {
  id: string;
  slug: string;
  tier: string;
  question?: string;
  concept?: string;
  question_segments?: Segment[];
  concept_segments?: Segment[];
  fast_check?: { options: string[]; correct_index: number };
  sample_solution?: string;
  choice_distractors: { text: string; reason: string }[];
  source_link: string;
  replaces?: string[];
};

describe("Mittelschule 10 package contract", () => {
  it("pins every lesson and its order, with seven complete learning areas", () => {
    expect(STAGES.map((s) => s.lessons.length)).toEqual(counts);
    expect(ALL_LESSONS.map((l) => l.id)).toEqual(publicContract.lessons);
    expect(new Set(ALL_LESSONS.map((l) => l.id)).size).toBe(ALL_LESSONS.length);
    expect(findLessonById(DEFAULT_LESSON_ID)).toBeDefined();
    for (const stage of STAGES)
      for (const [index, lesson] of stage.lessons.entries()) {
        expect(lesson.stageId).toBe(stage.id);
        expect(lesson.stepNumber).toBe(index + 1);
        expect(lesson.lehrplan).toMatch(
          new RegExp(`^M${grade} LB ${stage.stageNumber}`),
        );
        expect(lesson.lehrplan).not.toContain("undefined");
        expect(lesson.explanationHtml).toContain('class="example"');
        expect(lesson.explanationHtml).toContain('class="merke"');
        expect(lesson.formulas.length).toBeGreaterThan(0);
        expect(lesson.quiz.options.length).toBeGreaterThanOrEqual(3);
        expect(lesson.quiz.correctIndex).toBeGreaterThanOrEqual(0);
        expect(lesson.quiz.correctIndex).toBeLessThan(
          lesson.quiz.options.length,
        );
        expect(lesson.quiz.explanation.length).toBeGreaterThan(20);
        expect(lesson.lab.goals).toHaveLength(3);
        expect(lesson.exercises.length).toBeGreaterThanOrEqual(2);
        expect(lesson.requiredCorrect).toBe(3);
        expect(lesson.teacherVideo).toBeUndefined();
        for (const generator of lesson.exercises) {
          const guided = generator.make(createRng(1234), 1);
          const transfer = generator.make(createRng(1234), 2);
          expect(
            guided.prompt,
            `${lesson.id}/${generator.id}: distinct levels`,
          ).not.toBe(transfer.prompt);
          expect(guided.formulaHint).toBeTruthy();
          expect(transfer.formulaHint).toBeUndefined();
        }
      }
  });

  it("maps all official verbatim clauses and every lesson in both directions", () => {
    expect(coverage.rows.map((r) => r.competence)).toEqual(competences);
    expect(coverage.rows).toHaveLength(32);
    expect(coverage.rows.map((r) => r.lb)).toEqual(competenceAreas);
    expect(coverage.curriculum).toContain(`/mittelschule/${grade}/mathematik`);
    expect(coverage.curriculum_sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(coverage.optional_lessons).toEqual([]);
    expect(new Set(coverage.rows.flatMap((r) => r.lessons))).toEqual(
      new Set(ALL_LESSONS.map((l) => l.id)),
    );
    for (const row of coverage.rows) {
      expect(row.lessons.length).toBeGreaterThan(0);
      for (const id of row.lessons)
        expect(findLessonById(id), id).toBeDefined();
      expect(["implemented", "supported"]).toContain(row.status);
      expect(row.evidence.length).toBeGreaterThan(50);
      if (row.status === "supported") expect(row.evidence).toContain("class");
    }
  });

  it("pins random ULIDs, lesson links, school bindings and two cards per atom", () => {
    expect(ZAM_CELL_ID).toBe(cell.tile_id);
    expect(cell.tile_id).toBe(publicContract.tile_id);
    expect(
      cell.atoms.map((a) => ({
        id: a.id,
        slug: a.slug,
        items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })),
      })),
    ).toEqual(publicContract.atoms);
    expect(cell.atoms.map((a) => a.slug)).toEqual(publicContract.lessons);
    const ids: string[] = [];
    const slugs: string[] = [];
    for (const atom of cell.atoms) {
      ids.push(atom.id);
      expect(atom.id).toMatch(ulid);
      expect(atom.atom_uri).toBe(`urn:zam:atom:${atom.id}`);
      expect(atom.source_link).toBe(lessonLink(atom.slug));
      expect(
        parseTrainingDeepLink(new URL(atom.source_link).hash).lessonId,
      ).toBe(atom.slug);
      const binding = atom.curricula.find(
        (c) => c.provider === "lehrplanplus-bayern",
      )!;
      expect(binding.school_type).toBe("mittelschule");
      expect(binding.grade).toBe(grade);
      expect(binding.subject).toBe("mathematik");
      expect("track" in binding).toBe(false);
      expect(binding.topic_code).toBe(`lb${findLessonById(atom.slug)!.stage.stageNumber}`);
      expect(atom.practice_items).toHaveLength(2);
      for (const item of atom.practice_items as Item[]) {
        ids.push(item.id);
        slugs.push(item.slug);
        expect(item.id).toMatch(ulid);
        expect(item.source_link).toBe(atom.source_link);
        expect(item.replaces).toBeUndefined();
        expect(item.choice_distractors).toHaveLength(2);
        expect(new Set(item.choice_distractors.map((d) => d.text)).size).toBe(
          2,
        );
        for (const d of item.choice_distractors)
          expect(d.reason.length).toBeGreaterThan(15);
        for (const key of ["question", "concept"] as const) {
          const segments = item[`${key}_segments`];
          expect(Boolean(item[key]) !== Boolean(segments)).toBe(true);
          expect(item[key] ?? "").not.toMatch(
            /<\/?[a-z]|\\(?:frac|cdot)|\*\*/i,
          );
          for (const segment of segments ?? []) {
            if (segment.type === "math") {
              expect(segment.tex?.length).toBeGreaterThan(0);
              expect(segment.speech?.length).toBeGreaterThan(0);
            } else
              expect(segment.text ?? "").not.toMatch(
                /<\/?[a-z]|\\(?:frac|cdot)|\*\*/i,
              );
          }
        }
        if (item.tier === "tier1_fast") {
          expect(item.fast_check?.options).toHaveLength(2);
          expect(item.fast_check?.correct_index).toBe(0);
        } else {
          expect(item.tier).toBe("tier2_transfer");
          expect(item.sample_solution?.length).toBeGreaterThan(30);
        }
      }
    }
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has an acyclic prerequisite graph with all targets inside the cell", () => {
    const atoms = new Map(cell.atoms.map((a) => [a.id, a]));
    const visited = new Set<string>();
    function visit(id: string, path = new Set<string>()) {
      expect(path.has(id), `cycle at ${id}`).toBe(false);
      if (visited.has(id)) return;
      const atom = atoms.get(id);
      expect(atom, id).toBeDefined();
      for (const p of atom!.prerequisites)
        visit(p.atom_id, new Set([...path, id]));
      visited.add(id);
    }
    for (const id of atoms.keys()) visit(id);
  });

  it("starts fresh histories and uses independent browser keys and offline navigation", () => {
    expect(mapping.approved).toBeNull();
    expect(mapping.status).toBe("proposal-only");
    expect(mapping.rows).toEqual([]);
    expect("retired_items" in cell).toBe(false);
    expect(storage).toContain(`mathe_ms${grade}_academy_progress_v1`);
    expect(main).toContain(`mathe_ms${grade}_theme`);
    expect(html).toContain(`mathe_ms${grade}_theme`);
    for (const source of [storage, main, html])
      expect(source).not.toMatch(/mathe_rs|Realschule|mathematik-realschule/);
    expect(html).toMatch(
      /<a\b[^>]*href="https:\/\/academy\.zam-os\.org\/"[^>]*class="zam-home-link"/,
    );
  });
});
