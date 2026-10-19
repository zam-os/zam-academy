import { describe, expect, it } from "vitest";
import { evaluateDiagramAgainstCriteria } from "../src/checker/graph-evaluator";
import {
  getAllLessons,
  getLearningStages,
  getStarterDiagramForLevel,
  LEARNING_STAGES,
} from "../src/curriculum/learning-path";
import { sanitizeImportedDiagram } from "../src/model/diagram-import";
import {
  exportToMermaid,
  exportToPlantUml,
} from "../src/exporters/code-exporters";
import {
  cloneDiagram,
  UML_DIAGRAM_TYPES,
  type UmlDiagram,
} from "../src/model/uml-types";
import {
  lessonLink,
  parseTrainingDeepLink,
  ZAM_ACADEMY_UML_URL,
} from "../src/zam/zam-link";

describe("UML 2.5.1 Metamodel & 14 Diagram Types", () => {
  it("defines all 14 official UML 2.5.1 diagram types and 6 core learning path types", () => {
    const allTypes = Object.values(UML_DIAGRAM_TYPES);
    expect(allTypes).toHaveLength(14);

    const coreTypes = allTypes.filter((d) => d.isCoreLearningPath);
    expect(coreTypes.map((d) => d.type)).toEqual([
      "use-case",
      "class",
      "activity",
      "state-machine",
      "sequence",
      "component",
    ]);
  });
});

describe("6-Stage, 24-Lesson Curriculum, Varied Quiz Answers & Bilingual Support", () => {
  it("has 6 stages and 24 lessons with varied correct quiz answer indices (not always Option 1)", () => {
    expect(LEARNING_STAGES).toHaveLength(6);
    const deLessons = getAllLessons("de");
    const enLessons = getAllLessons("en");
    expect(deLessons).toHaveLength(24);
    expect(enLessons).toHaveLength(24);

    const deIndices = new Set<number>();
    const enIndices = new Set<number>();

    for (const lesson of deLessons) {
      expect(lesson.visualCheck.options.length).toBeGreaterThanOrEqual(2);
      expect(lesson.visualCheck.correctIndex).toBeGreaterThanOrEqual(0);
      expect(lesson.visualCheck.correctIndex).toBeLessThan(
        lesson.visualCheck.options.length,
      );
      deIndices.add(lesson.visualCheck.correctIndex);
      expect(lesson.level2ScenarioPrompt?.length).toBeGreaterThan(20);
    }

    for (const lesson of enLessons) {
      expect(lesson.visualCheck.options.length).toBeGreaterThanOrEqual(2);
      expect(lesson.visualCheck.correctIndex).toBeGreaterThanOrEqual(0);
      expect(lesson.visualCheck.correctIndex).toBeLessThan(
        lesson.visualCheck.options.length,
      );
      enIndices.add(lesson.visualCheck.correctIndex);
      expect(lesson.level2ScenarioPrompt?.length).toBeGreaterThan(20);
    }

    // Ensure correct answers are distributed across options 0, 1, and 2
    expect(deIndices.has(0)).toBe(true);
    expect(deIndices.has(1)).toBe(true);
    expect(deIndices.has(2)).toBe(true);
    expect(enIndices.has(0)).toBe(true);
    expect(enIndices.has(1)).toBe(true);
    expect(enIndices.has(2)).toBe(true);
  });

  it("verifies that every lesson's starterDiagram is incomplete and sampleSolutionDiagram passes 100% in both German and English", () => {
    for (const locale of ["de", "en"] as const) {
      for (const lesson of getAllLessons(locale)) {
        const starterEval = evaluateDiagramAgainstCriteria(
          lesson.starterDiagram,
          lesson.criteria,
          locale,
        );
        expect(
          starterEval.allPassed,
          `[${locale}] Starter diagram for ${lesson.id} should not already pass all criteria`,
        ).toBe(false);

        const solutionEval = evaluateDiagramAgainstCriteria(
          lesson.sampleSolutionDiagram,
          lesson.criteria,
          locale,
        );
        expect(
          solutionEval.allPassed,
          `[${locale}] Sample solution for ${lesson.id} failed criteria: ${JSON.stringify(solutionEval.results)}`,
        ).toBe(true);
        expect(solutionEval.scorePercent).toBe(100);
      }
    }
  });

  it("provides a blank canvas in Level 2 for build/connection/capstone lessons and keeps faulty diagram for bug-detective", () => {
    for (const lesson of getAllLessons("de")) {
      const l1 = getStarterDiagramForLevel(lesson, 1);
      const l2 = getStarterDiagramForLevel(lesson, 2);

      if (lesson.mode === "bug-detective") {
        expect(l2.nodes.length).toBe(l1.nodes.length);
        expect(l2.edges.length).toBe(l1.edges.length);
      } else {
        expect(l2.nodes).toHaveLength(0);
        expect(l2.edges).toHaveLength(0);
      }
    }
  });

  it("provides specific diagnostic hints in both DE and EN when edge direction is reversed or edge kind is wrong", () => {
    const classLessonDe = getAllLessons("de").find(
      (l) => l.id === "cls-2-connections",
    )!;
    const wrongKindDiagram: UmlDiagram = cloneDiagram(
      classLessonDe.starterDiagram,
    );

    // Connect Bestellung -> Bestellposition with aggregation instead of composition
    wrongKindDiagram.edges.push({
      id: "e_wrong_kind",
      kind: "aggregation",
      sourceId: "cls2_order",
      targetId: "cls2_item",
    });

    const resWrongKind = evaluateDiagramAgainstCriteria(
      wrongKindDiagram,
      classLessonDe.criteria,
      "de",
    );
    expect(resWrongKind.isSpecificMistake).toBe(true);
    const compResult = resWrongKind.results.find(
      (r) => r.criterionId === "cls2-comp",
    )!;
    expect(compResult.passed).toBe(false);
    expect(compResult.diagnosticHint).toContain("Aggregation");
    expect(compResult.diagnosticHint).toContain("Komposition");

    // Reversed direction in English
    const classLessonEn = getAllLessons("en").find(
      (l) => l.id === "cls-2-connections",
    )!;
    const reversedDiagramEn: UmlDiagram = cloneDiagram(
      classLessonEn.starterDiagram,
    );
    reversedDiagramEn.edges.push({
      id: "e_reversed_en",
      kind: "composition",
      sourceId: "cls2_item",
      targetId: "cls2_order",
    });

    const resReversedEn = evaluateDiagramAgainstCriteria(
      reversedDiagramEn,
      classLessonEn.criteria,
      "en",
    );
    expect(resReversedEn.isSpecificMistake).toBe(true);
    const revResultEn = resReversedEn.results.find(
      (r) => r.criterionId === "cls2-comp",
    )!;
    expect(revResultEn.passed).toBe(false);
    expect(revResultEn.diagnosticHint).toContain("Reverse Direction");
  });
});

describe("PlantUML & Mermaid Exporters", () => {
  it("exports valid PlantUML and Mermaid code for all 6 stage capstone solutions in DE and EN", () => {
    for (const locale of ["de", "en"] as const) {
      for (const stage of getLearningStages(locale)) {
        const capstone = stage.lessons[stage.lessons.length - 1]!;
        const puml = exportToPlantUml(capstone.sampleSolutionDiagram);
        expect(puml).toContain("@startuml");
        expect(puml).toContain("@enduml");

        const mermaid = exportToMermaid(capstone.sampleSolutionDiagram);
        expect(mermaid.length).toBeGreaterThan(20);
      }
    }
  });
});

describe("Links from ZAM cards", () => {
  // ZAM cards (zam-os/zam, cell zam-academy:uml) cite these ids. Renaming a
  // lesson breaks every card that cites it: change the cell in the same step.
  it("keeps the lesson ids ZAM cards cite", () => {
    expect(getAllLessons("de").map((lesson) => lesson.id)).toEqual([
      "uc-1-boxes",
      "uc-2-connections",
      "uc-3-detective",
      "uc-4-capstone",
      "cls-1-boxes",
      "cls-2-connections",
      "cls-3-detective",
      "cls-4-capstone",
      "act-1-boxes",
      "act-2-connections",
      "act-3-detective",
      "act-4-capstone",
      "stm-1-boxes",
      "stm-2-connections",
      "stm-3-detective",
      "stm-4-capstone",
      "seq-1-boxes",
      "seq-2-connections",
      "seq-3-detective",
      "seq-4-capstone",
      "cmp-1-boxes",
      "cmp-2-connections",
      "cmp-3-detective",
      "cmp-4-capstone",
    ]);
  });

  it("opens every lesson from the link a card cites", () => {
    for (const lesson of getAllLessons("de")) {
      const link = lessonLink(lesson.id);
      expect(link.startsWith(`${ZAM_ACADEMY_UML_URL}#lesson=`)).toBe(true);
      const hash = link.slice(link.indexOf("#"));
      expect(parseTrainingDeepLink(hash).lessonId).toBe(lesson.id);
    }
  });

  it("reads level and language next to the lesson", () => {
    expect(
      parseTrainingDeepLink("#lesson=cls-4-capstone&level=2", "?lang=en"),
    ).toEqual({ lessonId: "cls-4-capstone", level: 2, locale: "en" });
  });

  it("ignores a lesson value that is not a lesson id", () => {
    expect(parseTrainingDeepLink("#lesson=%3Cscript%3E")).toEqual({});
    expect(parseTrainingDeepLink("#lesson=1.2")).toEqual({});
  });
});

describe("Importing a shared diagram file", () => {
  it("keeps a well-formed diagram", () => {
    const diagram = getAllLessons("de")[1].sampleSolutionDiagram;
    const imported = sanitizeImportedDiagram(
      JSON.parse(JSON.stringify(diagram)),
    );
    expect(imported?.nodes.map((n) => n.id)).toEqual(
      diagram.nodes.map((n) => n.id),
    );
    expect(imported?.edges).toHaveLength(diagram.edges.length);
  });

  it("strips markup from ids and numbers before the canvas sees them", () => {
    const evil = '"><img src=x onerror=alert(1)>';
    const imported = sanitizeImportedDiagram({
      title: "Shared",
      diagramType: "class",
      nodes: [
        { id: evil, kind: "class", name: "A", x: evil, y: 10, width: evil, height: 60, attributes: [], operations: [] },
        { id: "b", kind: "class", name: "B", x: 0, y: 0, width: 100, height: 60, accentColor: `red;${evil}` },
        { id: "c", kind: `class ${evil}`, name: "C" },
      ],
      edges: [
        { id: evil, kind: "association", sourceId: evil, targetId: "b" },
        { id: "e2", kind: "association", sourceId: "b", targetId: "missing" },
      ],
    });
    expect(imported).not.toBeNull();
    const text = JSON.stringify(imported);
    expect(text).not.toContain("<img");
    expect(imported?.nodes).toHaveLength(2);
    expect(imported?.nodes[0]).toMatchObject({ id: "node_0", x: 0, width: 160 });
    expect(imported?.nodes[1].accentColor).toBeUndefined();
    expect(imported?.edges).toEqual([
      { id: "edge_0", kind: "association", sourceId: "node_0", targetId: "b" },
    ]);
  });

  it("refuses what is not a diagram", () => {
    expect(sanitizeImportedDiagram(null)).toBeNull();
    expect(sanitizeImportedDiagram({ nodes: [], edges: [] })).toBeNull();
    expect(
      sanitizeImportedDiagram({ diagramType: "<b>", nodes: [], edges: [] }),
    ).toBeNull();
  });
});
