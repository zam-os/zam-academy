import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import publication from "../publication.json";
import migration from "../replaces-de-by.json";
import { LESSONS, SOURCES, STAGES, findLesson } from "../src/curriculum";
import { completion, freshProgress, parseProgress, writingKey } from "../src/storage/progress";
import { mapViewCount, renderVisual } from "../src/visuals";
import { canAcceptSelfAssessment, checkWorkshop, initialOrder, moveEntry } from "../src/workshop";
import { ZAM_CELL_ID, lessonLink, parseTrainingDeepLink } from "../src/zam/zam-link";
import legacy8 from "./fixtures/de-by-gymnasium-8-geschichte-absolutismus-franzoesische-revolution-1848-kvt.json";
import legacy8Raw from "./fixtures/de-by-gymnasium-8-geschichte-absolutismus-franzoesische-revolution-1848-kvt.json?raw";
import legacy11 from "./fixtures/de-by-gymnasium-11-geschichte-reichsgruendung-bismarck-imperialismus-erster-weltkrieg-kvt.json";
import legacy11Raw from "./fixtures/de-by-gymnasium-11-geschichte-reichsgruendung-bismarck-imperialismus-erster-weltkrieg-kvt.json?raw";
import contract from "./lesson-contract.json";

const items = cell.atoms.flatMap((atom) => atom.practice_items);
const ulid = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;

describe("curriculum and lessons", () => {
  it("uses all six common learning areas and matches the curriculum matrix", () => {
    expect(STAGES.map(({ lb, hours }) => [lb, hours])).toEqual([[1, 10], [2, 9], [3, 6], [4, 9], [5, 9], [6, 13]]);
    expect(STAGES.map(({ lb }) => coverage.rows.filter((row) => row.lb === lb).length)).toEqual([7, 6, 5, 5, 6, 7]);
    expect(coverage.curriculum_sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(coverage.core_lessons).toBe(25);
    expect(LESSONS).toHaveLength(25);
    expect(new Set(coverage.rows.map((row) => row.competence)).size).toBe(36);
    expect(new Set(coverage.rows.flatMap((row) => row.lessons))).toEqual(new Set(LESSONS.map(({ id }) => id)));
    for (const row of coverage.rows) {
      expect(row.evidence.length).toBeGreaterThan(35);
      expect(["supported", "implemented"]).toContain(row.status);
      expect(row.lessons.length).toBeGreaterThan(0);
      for (const id of row.lessons) expect(findLesson(id)).toBeDefined();
    }
  });

  for (const lesson of LESSONS) {
    it(`${lesson.id} contains an explanation, checked links and two distinct tasks`, () => {
      expect(lesson.id).toMatch(/^[a-z0-9-]+$/);
      expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
      expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
      for (const task of Object.values(lesson.tasks)) {
        expect(task.criteria).toHaveLength(3);
        expect(new Set(task.criteria).size).toBe(3);
        expect(task.hints).toHaveLength(2);
        expect(task.model.length).toBeGreaterThan(80);
      }
      for (const id of lesson.sourceIds) expect(SOURCES.find((source) => source.id === id)?.url).toMatch(/^https:\/\//);
      const materialSource = lesson.workshop.sourceExcerpt?.sourceId ?? lesson.workshop.dataTable?.sourceId;
      if (materialSource) expect(lesson.sourceIds).toContain(materialSource);
    });

    it(`${lesson.id} has a reachable workshop with an initially unsolved state`, () => {
      const workshop = lesson.workshop;
      expect(workshop.entries.length).toBeGreaterThanOrEqual(3);
      const initial = workshop.kind === "timeline" ? initialOrder(workshop, lesson.id) : workshop.entries.map(() => -1);
      expect(checkWorkshop(workshop, initial).every(Boolean)).toBe(false);
      expect(checkWorkshop(workshop, [])).toEqual(workshop.entries.map(() => false));
      const solution = workshop.entries.map(({ target }) => target);
      const wrong = workshop.kind === "timeline" ? solution.map(() => 0) : solution.map(() => -1);
      expect(checkWorkshop(workshop, solution).every(Boolean)).toBe(true);
      expect(checkWorkshop(workshop, wrong).every(Boolean)).toBe(false);
      if (workshop.kind === "classify") {
        expect(new Set(solution).size).toBe(workshop.categories.length);
      } else {
        expect(moveEntry(initial, 0, -1)).toEqual(initial);
        expect(moveEntry(initial, 1, -1).slice(0, 2)).toEqual([initial[1], initial[0]]);
      }
    });
  }

  it("changes the map text and key with the selected historical viewpoint", () => {
    expect(mapViewCount("bayern-karten")).toBe(4);
    expect(renderVisual("bayern-karten", 2)).toContain("Westlich des Rheins");
    expect(renderVisual("bayern-karten", 3)).toContain("Rheinland-Pfalz");
    expect(renderVisual("friedensordnung", 0)).toContain("Österreich-Ungarn");
    expect(renderVisual("friedensordnung", 1)).toContain("Tschechoslowakei");
    expect(renderVisual("reichsverfassung")).toContain("ernennt");
    expect(renderVisual("reichsgruendung")).toContain("data:image/jpeg;base64,");
  });
});

describe("local progress and Academy links", () => {
  it("accepts valid saved data, drops unknown ids and counts the guided level", () => {
    const id = LESSONS[0].id;
    const key = writingKey(id, 1);
    expect(completion(freshProgress())).toEqual({ completed: 0, total: 25, percent: 0 });
    expect(parseProgress("{broken")).toEqual(freshProgress());
    const progress = parseProgress(JSON.stringify({
      activeLessonId: "unknown", level: 2, quizDone: [id, "unknown", id], workshopDone: [id],
      writingDone: [key, writingKey(id, 2)], drafts: { [key]: "Eine begründete historische Antwort." },
    }));
    expect(progress.activeLessonId).toBe(id);
    expect(progress.level).toBe(2);
    expect(progress.quizDone).toEqual([id]);
    expect(progress.writingDone).toEqual([key]);
    expect(completion(progress)).toEqual({ completed: 1, total: 25, percent: 4 });
    expect(canAcceptSelfAssessment("Eine begründete historische Antwort.", [true, true, false])).toBe(false);
    expect(canAcceptSelfAssessment("Eine begründete historische Antwort.", [true, true, true])).toBe(true);
  });

  it("reads card anchors and optional level with sensible query fallback", () => {
    expect(parseTrainingDeepLink("#lesson=napoleon&level=2")).toEqual({ lessonId: "napoleon", level: 2 });
    expect(parseTrainingDeepLink("", "?lesson=hambach&level=1")).toEqual({ lessonId: "hambach", level: 1 });
    expect(parseTrainingDeepLink("#lesson=../bad&level=3")).toEqual({});
  });
});

describe("cell and proposal-only migration", () => {
  it("has one correctly bound atom per lesson and 75 stable linked practice items", () => {
    expect(publication).toEqual({ schema: 1, status: "ready", version: "0.0" });
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(items).toHaveLength(75);
    const ids = [...cell.atoms.map(({ id }) => id), ...items.map(({ id }) => id)];
    expect(ids.length).toBe(new Set(ids).size);
    expect(ids.every((id) => ulid.test(id))).toBe(true);
    expect(new Set(items.map(({ slug }) => slug)).size).toBe(items.length);
    expect(cell.atoms.map((atom) => ({
      lesson: atom.source_link.split("#lesson=")[1], atom: atom.id,
      items: atom.practice_items.map(({ id, slug }) => ({ id, slug })),
    }))).toEqual(contract);

    const precedingAtoms = new Set<string>();
    for (const [index, atom] of cell.atoms.entries()) {
      const lesson = LESSONS[index];
      expect(atom.source_link).toBe(lessonLink(lesson.id));
      expect(atom.practice_items.map((item) => item.source_link)).toEqual(Array(3).fill(atom.source_link));
      expect(atom.curricula.find((entry) => entry.provider === "lehrplanplus-bayern")).toMatchObject({
        grade: 8, school_type: "gymnasium", subject: "geschichte", topic_code: `lb${lesson.lb}`,
      });
      expect(atom.prerequisites.every((edge) => precedingAtoms.has(edge.atom_id))).toBe(true);
      precedingAtoms.add(atom.id);
      for (const card of atom.practice_items) {
        if (card.tier === "tier1_fast") {
          expect(card.fast_check?.options).toHaveLength(2);
          expect(card.fast_check?.options[0]).toBe(card.concept);
          expect(card.fast_check?.options[1]).not.toBe(card.concept);
          expect(card.fast_check?.correct_index).toBe(0);
        } else expect(card.sample_solution?.length).toBeGreaterThan(50);
      }
    }
  });

  it("keeps the snapshots byte-exact and needs approval before either proposed transfer", async () => {
    expect(migration).toMatchObject({ status: "proposal-only", approved: null });
    const records = [legacy8, legacy11].flatMap((old) =>
      old.atoms.flatMap((atom) => atom.practice_items.map((item) => [old.tile_id, item.id])),
    );
    expect(migration.rows.map((row) => [row.de_by_cell, row.de_by_id])).toEqual(records);
    const raw = [legacy8Raw, legacy11Raw];
    for (const [index, source] of migration.sources.entries()) {
      const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw[index]));
      const digest = Array.from(new Uint8Array(bytes), (value) => value.toString(16).padStart(2, "0")).join("");
      expect(source.sha256).toBe(digest);
    }
    expect(migration.rows.filter((row) => row.category === "A")).toHaveLength(2);
    for (const row of migration.rows) {
      if (row.category === "A") {
        expect(row.action).toBe("propose-replace-after-approval");
        expect(items.filter((item) => item.slug === row.academy_slug)).toHaveLength(1);
      } else {
        expect(row.action).toBe("keep-active");
        expect(row.academy_slug).toBeNull();
      }
    }
    expect(cell).not.toHaveProperty("retired_items");
    expect(items.some((item) => "replaces" in item)).toBe(false);
  });
});
