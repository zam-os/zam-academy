import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import html from "../index.html?raw";
import mapping from "../replaces-de-by.json";
import { ALL_LESSONS, findLessonById, lessonsForTrack, STAGES } from "../src/curriculum";
import { createRng } from "../src/exercises/rng";
import main from "../src/main.ts?raw";
import type { Track } from "../src/model/types";
import { DEFAULT_LESSON_ID } from "../src/storage/progress";
import storage from "../src/storage/progress.ts?raw";
import { lessonLink, parseTrainingDeepLink, ZAM_CELL_ID } from "../src/zam/zam-link";
import competences from "./fixtures/curriculum-competences.json";
import publicContract from "./fixtures/public-contract.json";

const ulid = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;
const ZAM_TRACK: Record<Track, string> = { R: "regelklasse", M: "mittlere-reife-klasse" };
type Segment = { type: string; text?: string; tex?: string; speech?: string };
type Item = {
  id: string;
  slug: string;
  tier: string;
  question?: string;
  concept?: string;
  question_segments?: Segment[];
  concept_segments?: Segment[];
  fast_check?: { options: unknown[]; correct_index: number };
  sample_solution?: string;
  choice_distractors: { text: string; reason: string }[];
  source_link: string;
  replaces?: string[];
};
type Binding = { provider: string; school_type?: string; grade?: number; subject: string; track?: string; topic_code: string };

describe("Mittelschule 9 package contract", () => {
  it("pins every lesson and its order, with eight complete learning areas and both Züge", () => {
    expect(STAGES.map((s) => s.lessons.length)).toEqual([7, 3, 8, 3, 3, 4, 7, 5]);
    expect(ALL_LESSONS.map((l) => l.id)).toEqual(publicContract.lessons);
    expect(new Set(ALL_LESSONS.map((l) => l.id)).size).toBe(ALL_LESSONS.length);
    expect(lessonsForTrack("R")).toHaveLength(27);
    expect(lessonsForTrack("M")).toHaveLength(ALL_LESSONS.length);
    expect(findLessonById(DEFAULT_LESSON_ID)?.lesson.tracks).toContain("R");
    for (const stage of STAGES)
      for (const [index, lesson] of stage.lessons.entries()) {
        expect(lesson.stageId).toBe(stage.id);
        expect(lesson.stepNumber).toBe(index + 1);
        expect(lesson.title.startsWith(`${stage.stageNumber}.${index + 1} `), lesson.id).toBe(true);
        expect(lesson.tracks.length).toBeGreaterThan(0);
        // Every lesson the Regelklasse needs is also an M9 lesson: M9 extends R9.
        expect(lesson.tracks).toContain("M");
        const expected = lesson.tracks.map((t) => `${t === "R" ? "R9" : "M9"} LB ${stage.stageNumber}`).join(" · ");
        expect(lesson.lehrplan.startsWith(expected), lesson.id).toBe(true);
        expect(lesson.lehrplan).not.toContain("undefined");
        expect(lesson.explanationHtml).toContain('class="example"');
        expect(lesson.explanationHtml).toContain('class="merke"');
        expect(lesson.explanationHtml.replace(/<[^>]+>/g, " "), `${lesson.id}: decimal point`).not.toMatch(/\d\.\d(?!\d\d)/);
        expect(lesson.formulas.length).toBeGreaterThan(0);
        expect(lesson.quiz.options.length).toBeGreaterThanOrEqual(3);
        expect(lesson.quiz.correctIndex).toBeGreaterThanOrEqual(0);
        expect(lesson.quiz.correctIndex).toBeLessThan(lesson.quiz.options.length);
        expect(new Set(lesson.quiz.options).size).toBe(lesson.quiz.options.length);
        expect(lesson.quiz.explanation.length).toBeGreaterThan(20);
        expect(lesson.lab.goals).toHaveLength(3);
        expect(lesson.exercises.length).toBeGreaterThanOrEqual(2);
        expect(lesson.requiredCorrect).toBe(3);
        expect(lesson.teacherVideo).toBeUndefined();
        for (const generator of lesson.exercises) {
          const guided = generator.make(createRng(1234), 1);
          const transfer = generator.make(createRng(1234), 2);
          expect(guided.prompt, `${lesson.id}/${generator.id}: distinct levels`).not.toBe(transfer.prompt);
          expect(guided.formulaHint).toBeTruthy();
          expect(transfer.formulaHint).toBeUndefined();
        }
      }
  });

  it("maps all official verbatim clauses of R9 and M9 and every lesson of each Zug in both directions", () => {
    expect(coverage.rows.map((r) => ({ track: r.track, lb: r.lb, competence: r.competence }))).toEqual(competences);
    expect(coverage.rows.filter((r) => r.track === "R")).toHaveLength(29);
    expect(coverage.rows.filter((r) => r.track === "M")).toHaveLength(34);
    expect(coverage.curriculum.R).toContain("/mittelschule/9/mathematik/regelklasse");
    expect(coverage.curriculum.M).toContain("/mittelschule/9/mathematik/mittlere-reife-klasse");
    for (const sha of Object.values(coverage.curriculum_sha256)) expect(sha).toMatch(/^[0-9a-f]{64}$/);
    expect(coverage.optional_lessons).toEqual([]);
    for (const row of coverage.rows) {
      expect(row.lessons.length).toBeGreaterThan(0);
      for (const id of row.lessons) {
        const found = findLessonById(id);
        expect(found, id).toBeDefined();
        // A competence of a Zug is taught only by lessons of that Zug.
        expect(found!.lesson.tracks, `${id} serves ${row.track}`).toContain(row.track);
      }
      expect(["implemented", "supported"]).toContain(row.status);
      expect(row.evidence.length).toBeGreaterThan(50);
      if (row.status === "supported") expect(row.evidence).toContain("class");
    }
    for (const lesson of ALL_LESSONS)
      for (const track of lesson.tracks)
        expect(
          coverage.rows.some((r) => r.track === track && r.lessons.includes(lesson.id)),
          `${lesson.id} has a ${track} competence`,
        ).toBe(true);
  });

  it("pins random ULIDs, lesson links, Zug bindings and two cards per atom", () => {
    expect(ZAM_CELL_ID).toBe(cell.tile_id);
    expect(
      cell.atoms.map((a) => ({ id: a.id, slug: a.slug, items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })) })),
    ).toEqual(publicContract.atoms);
    expect(cell.atoms.map((a) => a.slug)).toEqual(publicContract.lessons);
    const ids: string[] = [];
    const slugs: string[] = [];
    for (const atom of cell.atoms) {
      ids.push(atom.id);
      expect(atom.id).toMatch(ulid);
      expect(atom.atom_uri).toBe(`urn:zam:atom:${atom.id}`);
      expect(atom.source_link).toBe(lessonLink(atom.slug));
      expect(parseTrainingDeepLink(new URL(atom.source_link).hash).lessonId).toBe(atom.slug);
      const lesson = findLessonById(atom.slug)!.lesson;
      const bindings = (atom.curricula as Binding[]).filter((c) => c.provider === "lehrplanplus-bayern");
      expect(bindings.map((b) => b.track).sort()).toEqual(lesson.tracks.map((t) => ZAM_TRACK[t]).sort());
      for (const binding of bindings) {
        expect(binding.school_type).toBe("mittelschule");
        expect(binding.grade).toBe(9);
        expect(binding.subject).toBe("mathematik");
        expect(binding.topic_code).toBe(`lb${findLessonById(atom.slug)!.stage.stageNumber}`);
      }
      expect(atom.practice_items).toHaveLength(2);
      for (const item of atom.practice_items as Item[]) {
        ids.push(item.id);
        slugs.push(item.slug);
        expect(item.id).toMatch(ulid);
        expect(item.source_link).toBe(atom.source_link);
        expect(item.replaces).toBeUndefined();
        expect(item.choice_distractors).toHaveLength(2);
        expect(new Set(item.choice_distractors.map((d) => d.text)).size).toBe(2);
        for (const d of item.choice_distractors) expect(d.reason.length).toBeGreaterThan(15);
        for (const key of ["question", "concept"] as const) {
          const segments = item[`${key}_segments`];
          expect(Boolean(item[key]) !== Boolean(segments)).toBe(true);
          expect(item[key] ?? "").not.toMatch(/<\/?[a-z]|\\(?:frac|cdot)|\*\*/i);
          for (const segment of segments ?? []) {
            if (segment.type === "math") {
              expect(segment.tex?.length).toBeGreaterThan(0);
              expect(segment.speech?.length).toBeGreaterThan(0);
            } else expect(segment.text ?? "").not.toMatch(/<\/?[a-z]|\\(?:frac|cdot)|\*\*/i);
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
      for (const p of atom!.prerequisites) visit(p.atom_id, new Set([...path, id]));
      visited.add(id);
    }
    for (const id of atoms.keys()) visit(id);
  });

  it("starts fresh histories and uses independent browser keys and offline navigation", () => {
    expect(mapping.approved).toBeNull();
    expect(mapping.status).toBe("proposal-only");
    expect(mapping.rows).toEqual([]);
    expect("retired_items" in cell).toBe(false);
    expect(storage).toContain("mathe_ms9_academy_progress_v1");
    expect(main).toContain("mathe_ms9_theme");
    expect(html).toContain("mathe_ms9_theme");
    for (const source of [storage, main, html]) expect(source).not.toMatch(/mathe_rs|mathe_ms6|Realschule|mittelschule-6/);
    expect(html).toMatch(/<a\b[^>]*href="https:\/\/academy\.zam-os\.org\/"[^>]*class="zam-home-link"/);
  });
});
