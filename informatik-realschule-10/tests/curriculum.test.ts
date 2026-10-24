import { describe, expect, it } from "vitest";
import tile from "../cell.json";
import matrix from "../coverage.json";
import currentPackage from "../package.json";
import { APP_URL, CELL_ID, LESSONS, MODULES, SOURCES } from "../src/curriculum";
import { parseLink, shuffled } from "../src/html";
import { LABS } from "../src/lab-ui";
import {
  EVALUATION,
  scoreTree,
  TRAINING,
  trainTree,
} from "../src/labs/learning";
import { evaluateLogic, parseLogic } from "../src/labs/logic";
import contract from "./fixtures/public-contract.json";

describe("curriculum and released identity contract", () => {
  it("pins all 36 lesson anchors and 108 allocated ULIDs", () => {
    expect(LESSONS.map((lesson) => lesson.id)).toEqual(contract.lesson_ids);
    const ids = Object.values(contract.ids).flatMap((entry) =>
      Object.values(entry),
    );
    expect(new Set(ids).size).toBe(108);
    for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
    for (const lesson of LESSONS) {
      const expected = contract.ids[lesson.id as keyof typeof contract.ids];
      const atom = tile.atoms.find((atom) => atom.slug === lesson.id)!;
      expect(atom.id).toBe(expected.atom);
      expect(atom.practice_items.map((item) => item.id)).toEqual([
        expected.check,
        expected.transfer,
      ]);
    }
  });
  it("uses module bindings without inventing a fixed grade, track or exam relevance", () => {
    expect(MODULES.map((module) => module.code)).toEqual([
      "2.5.2",
      "2.6.2",
      "2.7.1",
      "2.7.2",
      "2.7.3",
    ]);
    expect(
      MODULES.map(
        (module) =>
          LESSONS.filter((lesson) => lesson.module === module.id).length,
      ),
    ).toEqual([8, 7, 7, 6, 8]);
    const titles = [
      "Datennetze II",
      "Objektorientierte Softwareentwicklung",
      "Logische Schaltungen",
      "Robotik und eingebettete Systeme",
      "Künstliche Intelligenz",
    ];
    expect(MODULES.map((module) => module.title)).toEqual(titles);
    expect(matrix.modules.map((module) => module.title)).toEqual(titles);
    for (const atom of tile.atoms) {
      const binding = atom.curricula.find(
        (binding) => binding.provider === "lehrplanplus-bayern",
      )!;
      expect(binding.topic_title).toBe(
        titles[
          MODULES.findIndex(
            (module) => `it-${module.code}` === binding.topic_code,
          )
        ],
      );
      expect(binding.subject).toBe("it");
      expect(binding.school_type).toBe("realschule");
      expect(binding).not.toHaveProperty("grade");
      expect(binding).not.toHaveProperty("track");
      expect(binding).not.toHaveProperty("exam_relevant");
      expect(binding.topic_code).toMatch(/^it-2\.(5\.2|6\.2|7\.[123])$/);
    }
  });
  it("has substantive explanations and distinct guided and transfer work in every lesson", () => {
    const sources = new Set(SOURCES.map((source) => source.id));
    const labs = new Set(LABS.map((lab) => lab.id));
    const questions = new Set<string>();
    for (const lesson of LESSONS) {
      expect(lesson.paragraphs.join(" ").length, lesson.id).toBeGreaterThan(
        400,
      );
      expect(lesson.sourceIds.length).toBeGreaterThan(0);
      for (const source of lesson.sourceIds)
        expect(sources.has(source)).toBe(true);
      if (lesson.lab) expect(labs.has(lesson.lab)).toBe(true);
      expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
      expect(lesson.tasks[1].criteria).not.toEqual(lesson.tasks[2].criteria);
      expect(lesson.tasks[1].model).not.toBe(lesson.tasks[2].model);
      expect(lesson.quiz.explanation).not.toBe(lesson.takeaway);
      expect(lesson.quiz.wrong).toHaveLength(2);
      expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
      for (const level of [1, 2] as const) {
        const task = lesson.tasks[level];
        expect(task.criteria).toHaveLength(3);
        expect(task.model.length).toBeGreaterThan(100);
        expect(questions.has(task.prompt)).toBe(false);
        questions.add(task.prompt);
      }
    }
  });
  it("keeps the overfitting transfer task consistent with measured workshop scores", () => {
    const lesson = LESSONS.find((entry) => entry.id === "it10-bias")!;
    for (const depth of [1, 4]) {
      const tree = trainTree(TRAINING, ["mass", "color"], depth);
      const training = scoreTree(tree, TRAINING).correct;
      const comparison = scoreTree(tree, EVALUATION).correct;
      expect(lesson.tasks[2].prompt).toContain(
        `Tiefe ${depth} erreicht ${training} von 12`,
      );
      expect(lesson.tasks[2].prompt).toContain(`${comparison} von 6`);
    }
  });
  it("uses the stated door coding in the safety transfer explanation", () => {
    const task = LESSONS.find((entry) => entry.id === "it10-gatter")!.tasks[2];
    const term = task.model.match(/Der Term ist ([^.]+)\./)![1];
    expect(evaluateLogic(parseLogic(term), { A: 1, B: 0, C: 0 })).toBe(1);
    expect(evaluateLogic(parseLogic(term), { A: 1, B: 1, C: 0 })).toBe(0);
    expect(task.model).toContain("geschlossener Tür (Sensor B = 0)");
    expect(task.model).not.toContain("offener Tür 0");
  });
  it("keeps all lesson references internal and the prerequisite graph acyclic", () => {
    const finished = new Set<string>();
    const active = new Set<string>();
    function visit(id: string) {
      expect(active.has(id), `Cycle at ${id}`).toBe(false);
      if (finished.has(id)) return;
      const lesson = LESSONS.find((lesson) => lesson.id === id);
      expect(lesson).toBeDefined();
      active.add(id);
      for (const predecessor of lesson!.prerequisites) visit(predecessor);
      active.delete(id);
      finished.add(id);
    }
    for (const lesson of LESSONS) visit(lesson.id);
    expect(
      tile.atoms.reduce((count, atom) => count + atom.prerequisites.length, 0),
    ).toBe(33);
  });
  it("maps the 19 official expectations without claiming a complete subject", () => {
    expect(matrix.subject).toBe("it");
    expect(matrix.complete_subject_coverage).toBe(false);
    expect(matrix.modules.map((module) => module.competencies.length)).toEqual([
      3, 4, 4, 4, 4,
    ]);
    expect(matrix.rows).toHaveLength(19);
    expect(new Set(matrix.rows.flatMap((row) => row.lessons))).toEqual(
      new Set(LESSONS.map((lesson) => lesson.id)),
    );
    for (const row of matrix.rows) {
      expect(row.evidence.length).toBeGreaterThan(0);
      expect(row.competence.length).toBeGreaterThan(0);
    }
    for (const module of matrix.modules) {
      expect(module.lessons).toEqual(
        LESSONS.filter((lesson) => lesson.module === module.id).map(
          (lesson) => lesson.id,
        ),
      );
      for (const row of [...module.competencies, ...module.content_map]) {
        expect(row.lessons.length).toBeGreaterThan(0);
        for (const id of row.lessons)
          expect(
            LESSONS.some(
              (lesson) => lesson.id === id && lesson.module === module.id,
            ),
          ).toBe(true);
      }
    }
  });
  it("keeps the cell the sole card source, with 72 cards citing existing lessons", () => {
    expect(tile.tile_id).toBe(CELL_ID);
    expect(tile.atoms).toHaveLength(36);
    const items = tile.atoms.flatMap((atom) => atom.practice_items);
    expect(items).toHaveLength(72);
    expect(tile).not.toHaveProperty("retired_items");
    for (const atom of tile.atoms) {
      for (const item of atom.practice_items) {
        expect(item.source_link).toBe(`${APP_URL}#lesson=${atom.slug}`);
        expect(item).not.toHaveProperty("replaces");
        const lesson = LESSONS.find((lesson) => lesson.id === atom.slug)!;
        if (item.tier === "tier1_fast") {
          expect(item.question).toBe(lesson.quiz.question);
          expect(item.concept).toBe(lesson.quiz.answer);
        } else {
          expect(item.question).toBe(lesson.tasks[2].prompt);
          expect(item.concept).toBe(lesson.tasks[2].model);
        }
        for (const field of [item.question, item.concept])
          expect(field).not.toMatch(/\\[a-zA-Z]+|\$\$|<\/?[a-z]|```/);
      }
    }
  });
  it("opens lesson links from query or fragment, with fragment taking precedence", () => {
    expect(parseLink("#lesson=it10-baum&level=2")).toEqual({
      lesson: "it10-baum",
      level: 2,
    });
    expect(parseLink("", "?lesson=it10-bruch&level=1")).toEqual({
      lesson: "it10-bruch",
      level: 1,
    });
    expect(parseLink("#lesson=it10-klasse", "?lesson=it10-bruch").lesson).toBe(
      "it10-klasse",
    );
    for (const view of ["path", "labs", "sources"])
      expect(parseLink(`#view=${view}`, "?lesson=it10-baum&level=2")).toEqual({
        view,
      });
    expect(parseLink("#lesson=<script>&level=999")).toEqual({});
  });
  it("varies the correct quick-check position rather than always showing it first", () => {
    const positions = new Set(
      LESSONS.map((lesson) =>
        shuffled(
          [lesson.quiz.answer, ...lesson.quiz.wrong],
          `${lesson.id}:quiz`,
        ).indexOf(lesson.quiz.answer),
      ),
    );
    expect([...positions].sort()).toEqual([0, 1, 2]);
  });
  it("ships the same toolchain as the existing Academy apps without extra dependencies", () => {
    expect(currentPackage.devDependencies).toEqual({
      typescript: "^6.0.3",
      vite: "^8.1.5",
      "vite-plugin-singlefile": "^2.3.3",
      vitest: "^4.1.10",
    });
    expect(currentPackage).not.toHaveProperty("dependencies");
  });
});
