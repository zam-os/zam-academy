import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import publication from "../publication.json";
import replaces from "../replaces-de-by.json";
import {
  CURRICULUM_URL,
  LESSONS,
  SOURCES,
  STAGES,
  findLesson,
} from "../src/curriculum";
import {
  FIGURES,
  gesamtUebersicht,
  heroPanorama,
  renderFigure,
} from "../src/figures";
import { LABS } from "../src/labs";
import {
  STORAGE_KEY,
  freshProgress,
  parseProgress,
  writingKey,
} from "../src/storage/progress";
import {
  canAcceptSelfAssessment,
  canReviewDraft,
  checkWorkshop,
  esc,
  initialOrder,
  moveEntry,
  shuffle,
} from "../src/workshop";
import {
  ZAM_ACADEMY_APP_URL,
  ZAM_CELL_ID,
  ZAM_CELL_TITLE,
  lessonLink,
  parseTrainingDeepLink,
  zamEnrolRequest,
} from "../src/zam/zam-link";
import publicContract from "./fixtures/public-contract.json";

const ULID_RE = /^[0-9A-HJKMNP-TV-Z]{26}$/;
const DIGIT_DOT_DIGIT_RE = /\d\.\d/;
const ASCII_MINUS_DIGIT_RE = /(?<![A-Za-z0-9ÄÖÜäöüß–−-])-\d/;
/** Grade 9 PuG topics (UN-Kinderrechtskonvention, Jugendschutzgesetz/FSK/USK, Strukturprinzipien des GG) stay out of Grade 8 lessons. */
const LATER_GRADE_RE =
  /UN-Kinderrechtskonvention|Kinderrechtskonvention|Jugendschutzgesetz|\bFSK\b|\bUSK\b|Strukturprinzipien des Grundgesetzes/i;

function collectLearnerTexts(lesson: (typeof LESSONS)[number]): string[] {
  const texts = [
    lesson.title,
    lesson.intro,
    ...lesson.paragraphs,
    ...(lesson.sourceExcerpt
      ? [
          lesson.sourceExcerpt.label,
          lesson.sourceExcerpt.quote,
          lesson.sourceExcerpt.attribution,
        ]
      : []),
    lesson.takeaway,
    lesson.quiz.question,
    lesson.quiz.answer,
    ...lesson.quiz.wrong,
    lesson.quiz.explanation,
    lesson.workshop.title,
    lesson.workshop.instruction,
    lesson.workshop.material ?? "",
    ...lesson.workshop.categories,
    ...lesson.workshop.entries.flatMap((entry) => [entry.text, entry.feedback]),
    lesson.workshop.conclusion,
    lesson.tasks[1].prompt,
    ...lesson.tasks[1].hints,
    lesson.tasks[1].model,
    ...lesson.tasks[1].criteria,
    lesson.tasks[2].prompt,
    ...lesson.tasks[2].hints,
    lesson.tasks[2].model,
    ...lesson.tasks[2].criteria,
    ...(lesson.grundwissen ?? []),
    lesson.review ?? "",
    ...(lesson.kriterien ? [lesson.kriterien.title, ...lesson.kriterien.steps] : []),
  ];
  return texts.filter(Boolean);
}

describe("Politik und Gesellschaft 8 Gymnasium: curriculum, figures, conventions", () => {
  it("defines 9 stages (LB 1–5 and Profil 6.1–6.5) and 44 lessons with expected distribution", () => {
    expect(STAGES).toHaveLength(9);
    expect(STAGES.map((stage) => stage.lb)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const stage of STAGES) {
      expect(stage.hours.length).toBeGreaterThan(3);
      expect(stage.title.length).toBeGreaterThan(5);
      expect(stage.shortTitle.length).toBeGreaterThan(3);
      expect(stage.icon).toContain("<svg");
    }
    expect(STAGES.map((stage) => stage.code)).toEqual([
      "LB 1",
      "LB 2",
      "LB 3",
      "LB 4",
      "LB 5",
      "Profil 6.1",
      "Profil 6.2",
      "Profil 6.3",
      "Profil 6.4/6.5",
    ]);

    expect(LESSONS).toHaveLength(44);
    const counts: Record<number, number> = {};
    for (const lesson of LESSONS) {
      counts[lesson.lb] = (counts[lesson.lb] ?? 0) + 1;
      expect(lesson.id).toMatch(/^pg8-[a-z0-9-]+$/);
      expect(findLesson(lesson.id)).toBe(lesson);
      expect("teacherVideo" in lesson).toBe(false);
      expect("stage" in lesson).toBe(false);
    }
    expect(counts).toEqual({
      1: 5,
      2: 5,
      3: 5,
      4: 6,
      5: 4,
      6: 4,
      7: 3,
      8: 5,
      9: 7,
    });
    expect(new Set(LESSONS.map((l) => l.id)).size).toBe(44);
  });

  it("verifies all sources in SOURCES are referenced and formatted properly", () => {
    expect(CURRICULUM_URL).toBe(
      "https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/pug",
    );
    expect(SOURCES.length).toBeGreaterThan(40);
    const sourceIds = new Set(SOURCES.map((s) => s.id));
    expect(sourceIds.size).toBe(SOURCES.length);
    expect(new Set(SOURCES.map((s) => s.url)).size).toBe(SOURCES.length);
    for (const source of SOURCES) {
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.label.trim().length).toBeGreaterThan(3);
    }

    const usedSources = new Set<string>();
    for (const lesson of LESSONS) {
      expect(lesson.sourceIds.length).toBeGreaterThanOrEqual(3);
      expect(lesson.sourceIds[0]).toBe("lehrplan");
      for (const id of lesson.sourceIds) {
        expect(sourceIds.has(id)).toBe(true);
        usedSources.add(id);
      }
    }
    expect(usedSources.size).toBe(SOURCES.length);
  });

  it("validates all 44 interactive SVG figures, overview SVGs, 18 labs, and Kriterienkataloge", () => {
    const figureKeys = Object.keys(FIGURES);
    expect(figureKeys).toHaveLength(44);

    const usedFigures = new Set<string>();
    const usedLabs = new Set<string>();
    let kriterienCount = 0;

    for (const lesson of LESSONS) {
      expect(lesson.figures.length).toBeGreaterThanOrEqual(1);
      for (const figId of lesson.figures) {
        expect(figId in FIGURES).toBe(true);
        usedFigures.add(figId);
        const rendered = renderFigure(figId);
        expect(rendered).toContain("<figure");
        expect(rendered).toContain("<svg");
        expect(rendered).toContain("exp-panel");
        expect(rendered).toContain("data-part=");
        expect(rendered).not.toMatch(/NaN|undefined|Infinity/);
      }
      if (lesson.lab) {
        expect(lesson.lab in LABS).toBe(true);
        usedLabs.add(lesson.lab);
      }
      if (lesson.kriterien) {
        kriterienCount++;
        expect(lesson.kriterien.title.length).toBeGreaterThan(4);
        expect(lesson.kriterien.steps.length).toBeGreaterThanOrEqual(4);
      }
    }

    expect(usedFigures.size).toBe(figureKeys.length);
    expect(usedLabs.size).toBe(Object.keys(LABS).length);
    expect(kriterienCount).toBe(7);
    expect(new Set(LESSONS.filter((l) => l.lab).map((l) => l.lb)).size).toBe(9);

    for (const extraSvg of [heroPanorama(), gesamtUebersicht()]) {
      expect(extraSvg).toContain("<svg");
      expect(extraSvg).toContain("</svg>");
      expect(extraSvg).not.toMatch(/NaN|undefined|Infinity/);
    }
  });

  it.each(LESSONS)(
    "meets German typography, school-level, and exercise standards: $id",
    (lesson) => {
      expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(700);
      expect(lesson.takeaway.length).toBeGreaterThan(20);
      expect(lesson.grundwissen?.length ?? 0).toBeGreaterThanOrEqual(3);
      expect(lesson.quiz.wrong).toHaveLength(2);
      expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
      expect(lesson.quiz.explanation).not.toBe(lesson.quiz.answer);
      expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
      expect(lesson.tasks[1].hints).toHaveLength(2);
      expect(lesson.tasks[2].hints).toHaveLength(2);
      expect(lesson.tasks[1].criteria).toHaveLength(3);
      expect(lesson.tasks[2].criteria).toHaveLength(3);

      for (const text of collectLearnerTexts(lesson)) {
        expect(text).not.toMatch(DIGIT_DOT_DIGIT_RE);
        expect(text).not.toMatch(ASCII_MINUS_DIGIT_RE);
        expect(text).not.toMatch(LATER_GRADE_RE);
        expect(text).not.toMatch(/\bNaN\b|\bundefined\b|TODO|FIXME/);
      }
    },
  );

  it("validates workshop helpers and initial non-solved guarantee", () => {
    expect(esc(`<a>&"b"'c'`)).toBe("&lt;a&gt;&amp;&quot;b&quot;&#39;c&#39;");
    expect(shuffle([1, 2, 3, 4], "key")).toEqual(shuffle([1, 2, 3, 4], "key"));
    expect(canReviewDraft("  kurz  ")).toBe(false);
    expect(canReviewDraft("Ausführliche Erklärung über zwanzig Zeichen.")).toBe(
      true,
    );
    expect(
      canAcceptSelfAssessment(
        "Ausführliche Erklärung über zwanzig Zeichen.",
        [true, false, true],
      ),
    ).toBe(false);
    expect(
      canAcceptSelfAssessment(
        "Ausführliche Erklärung über zwanzig Zeichen.",
        [true, true, true],
      ),
    ).toBe(true);

    for (const lesson of LESSONS) {
      const work = lesson.workshop;
      if (work.kind === "timeline") {
        const order = initialOrder(work, lesson.id);
        expect(order).toHaveLength(work.entries.length);
        expect(checkWorkshop(work, order).every(Boolean)).toBe(false);
        const solved = work.entries.map((_, i) => i);
        expect(checkWorkshop(work, solved).every(Boolean)).toBe(true);
        const moved = moveEntry(solved, 0, 1);
        expect(moved[0]).toBe(1);
        expect(moved[1]).toBe(0);
        expect(moveEntry(solved, 0, -1)).toEqual(solved);
        expect(checkWorkshop(work, solved.slice(1)).some(Boolean)).toBe(false);
        expect(
          checkWorkshop(
            work,
            solved.map(() => 0),
          ).some(Boolean),
        ).toBe(false);
      } else {
        expect(work.categories.length).toBeGreaterThanOrEqual(2);
        const right = work.entries.map((e) => e.target);
        expect(checkWorkshop(work, right).every(Boolean)).toBe(true);
        expect(checkWorkshop(work, []).some(Boolean)).toBe(false);
      }
    }
  });
});

describe("Coverage matrix, ZAM cell, and legacy proposal contract", () => {
  it("covers all 66 verbatim Kompetenzerwartungen and binds every lesson", () => {
    expect(coverage.curriculum).toBe(CURRICULUM_URL);
    expect(coverage.curriculum_sha256).toBe(
      "f38e22bf2a21285265ac9a5c4c2e519d4166239387f3ec177c6641093c218697",
    );
    expect(coverage.school_type).toBe("gymnasium");
    expect(coverage.grade).toBe(8);
    expect(coverage.subject).toBe("pug");
    expect(coverage.optional_lessons).toEqual([]);
    expect(coverage.rows).toHaveLength(66);

    const perLb: Record<string, number> = {};
    const statusCounts: Record<string, number> = {};
    const lessonIds = new Set(LESSONS.map((l) => l.id));
    const coveredLessons = new Set<string>();

    for (const row of coverage.rows) {
      perLb[row.lb] = (perLb[row.lb] ?? 0) + 1;
      statusCounts[row.status] = (statusCounts[row.status] ?? 0) + 1;
      expect(row.lessons.length).toBeGreaterThanOrEqual(1);
      expect(row.evidence.length).toBeGreaterThan(20);
      for (const lessonId of row.lessons) {
        expect(lessonIds.has(lessonId)).toBe(true);
        coveredLessons.add(lessonId);
      }
    }

    expect(perLb).toEqual({
      "1": 6,
      "2": 6,
      "3": 6,
      "4": 7,
      "5": 4,
      "6.1": 6,
      "6.2": 4,
      "6.3": 8,
      "6.4": 6,
      "6.5": 13,
    });
    expect(statusCounts.implemented).toBeGreaterThan(30);
    expect(statusCounts.supported).toBeGreaterThan(10);
    expect(coveredLessons.size).toBe(LESSONS.length);
  });

  it("matches publication 0.0, public-contract ULIDs, and ZAM cell standards", () => {
    expect(publication).toEqual({ schema: 1, status: "ready", version: "0.0" });
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(cell.title).toBe(ZAM_CELL_TITLE);
    expect(publicContract.tileId).toBe(ZAM_CELL_ID);
    expect(cell.atoms).toHaveLength(44);
    expect(publicContract.lessonIds).toHaveLength(44);
    expect(publicContract.itemIds).toHaveLength(88);

    const allUlids = new Set<string>();
    const lessonSlugs = LESSONS.map((l) => l.id);
    const atomSlugs: string[] = [];
    const itemIds: string[] = [];

    for (let i = 0; i < cell.atoms.length; i++) {
      const atom = cell.atoms[i];
      expect(atom.slug).toBe(publicContract.lessonIds[i]);
      expect(atom.id).toMatch(ULID_RE);
      expect(allUlids.has(atom.id)).toBe(false);
      allUlids.add(atom.id);
      atomSlugs.push(atom.slug);

      const curricula = atom.curricula as Array<{
        provider: string;
        track?: string;
        exam_relevant?: boolean;
      }>;
      expect(curricula).toHaveLength(2);
      expect(curricula[1].track).toBe("SWG");
      const lesson = findLesson(atom.slug)!;
      expect(curricula[1].exam_relevant).toBe(lesson.lb <= 5);

      for (const prereq of atom.prerequisites)
        expect(cell.atoms.some((a) => a.id === prereq.atom_id)).toBe(true);

      expect(atom.practice_items).toHaveLength(2);
      const expectedLink = lessonLink(atom.slug);
      expect(atom.source_link).toBe(expectedLink);

      for (let j = 0; j < 2; j++) {
        const item = atom.practice_items[j] as Record<string, unknown>;
        const id = String(item.id);
        expect(id).toMatch(ULID_RE);
        expect(allUlids.has(id)).toBe(false);
        allUlids.add(id);
        itemIds.push(id);
        expect(item.source_link).toBe(expectedLink);
        expect("replaces" in item).toBe(false);
        expect(String(item.question)).not.toMatch(DIGIT_DOT_DIGIT_RE);

        if (j === 0) {
          expect(item.slug).toBe(`${atom.slug}-check`);
          expect(item.tier).toBe("tier1_fast");
          const fc = item.fast_check as {
            options: string[];
            correct_index: number;
          };
          expect(fc.options).toHaveLength(2);
          expect(fc.correct_index).toBe(0);
          expect(fc.options[0]).toBe(item.concept);
          expect(fc.options[0]).not.toBe(fc.options[1]);
          const distractors = item.choice_distractors as Array<{
            text: string;
            reason: string;
          }>;
          expect(distractors).toHaveLength(2);
          for (const d of distractors) expect(d.reason.length).toBeGreaterThan(10);
        } else {
          expect(item.slug).toBe(`${atom.slug}-recall`);
          expect(item.tier).toBe("tier2_synthesis");
          expect(typeof item.sample_solution).toBe("string");
          expect(String(item.sample_solution).trim().length).toBeGreaterThan(10);
        }
      }
    }

    expect(atomSlugs).toEqual(lessonSlugs);
    expect(itemIds).toEqual(publicContract.itemIds);
    expect(allUlids.size).toBe(132);
    expect(JSON.stringify(cell)).not.toMatch(/"replaces"|"retired_items"/);
  });

  it("records proposal-only replaces-de-by.json with empty legacy rows", () => {
    expect(replaces.status).toBe("proposal-only");
    expect(replaces.approved).toBeNull();
    expect(replaces.sources).toEqual([]);
    expect(replaces.rows).toEqual([]);
  });

  it("parses deep links, ZAM requests, and localStorage progress safely", () => {
    expect(ZAM_ACADEMY_APP_URL).toBe(
      "https://academy.zam-os.org/politik-gymnasium-8/",
    );
    expect(zamEnrolRequest()).toContain(ZAM_CELL_TITLE);
    expect(
      parseTrainingDeepLink("#lesson=pg8-kompromiss-minderheit&level=2"),
    ).toEqual({
      lessonId: "pg8-kompromiss-minderheit",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=bad/id!&level=9")).toEqual({});

    expect(STORAGE_KEY).toBe("politik_gy8_academy_progress_v1");
    expect(parseProgress("not-json")).toEqual(freshProgress());
    const parsed = parseProgress(
      JSON.stringify({
        activeLessonId: "pg8-konflikte",
        level: 2,
        quizDone: ["pg8-konflikte", "unbekannt"],
        workshopDone: ["pg8-sozialisation"],
        writingDone: [
          writingKey("pg8-konflikte", 2),
          writingKey("pg8-sozialisation", 1),
        ],
        drafts: {
          [writingKey("pg8-konflikte", 2)]:
            "Ausführliche begründete Antwort auf Niveau 2.",
          [writingKey("pg8-sozialisation", 1)]: "zu kurz",
        },
      }),
    );
    expect(parsed.activeLessonId).toBe("pg8-konflikte");
    expect(parsed.level).toBe(2);
    expect(parsed.quizDone).toEqual(["pg8-konflikte"]);
    expect(parsed.writingDone).toEqual(["pg8-konflikte:2"]);
  });
});
