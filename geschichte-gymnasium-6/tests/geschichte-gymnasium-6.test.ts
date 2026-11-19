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
  gesamtZeitleiste,
  heroPanorama,
  renderFigure,
} from "../src/figures";
import { FRANKS_CITIES, FRANKS_FRAME, atCrop } from "../src/figures/maps";
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
import legacyRom from "./fixtures/de-by-gymnasium-6-geschichte-rom-imperium-limes-bayern-kvt.json";
import legacyUrgeschichte from "./fixtures/de-by-gymnasium-6-geschichte-urgeschichte-aegypten-griechenland-kvt.json";
import publicContract from "./fixtures/public-contract.json";

const ULID_RE = /^[0-9A-HJKMNP-TV-Z]{26}$/;
const DIGIT_DOT_DIGIT_RE = /\d\.\d/;
const ASCII_MINUS_DIGIT_RE = /(?<![A-Za-z0-9ÄÖÜäöüß–−-])-\d/;
const LATER_GRADE_RE =
  /Investiturstreit|Canossa|Lehnswesen|Kurfürsten|Buchdruck|Reformation|Absolutismus/i;

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

describe("Geschichte 6 Gymnasium: curriculum, figures, conventions", () => {
  it("defines 7 Lernbereiche and 36 lessons with expected distribution", () => {
    expect(STAGES).toHaveLength(7);
    expect(STAGES.map((stage) => stage.lb)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    for (const stage of STAGES) {
      expect(stage.code).toBe(`LB ${stage.lb}`);
      expect(stage.hours.length).toBeGreaterThan(3);
      expect(stage.title.length).toBeGreaterThan(5);
      expect(stage.shortTitle.length).toBeGreaterThan(3);
    }

    expect(LESSONS).toHaveLength(36);
    const counts: Record<number, number> = {};
    for (const lesson of LESSONS) {
      counts[lesson.lb] = (counts[lesson.lb] ?? 0) + 1;
      expect(lesson.id).toMatch(/^gg6-[a-z0-9-]+$/);
      expect(findLesson(lesson.id)).toBe(lesson);
      expect("teacherVideo" in lesson).toBe(false);
    }
    expect(counts).toEqual({ 1: 5, 2: 5, 3: 6, 4: 4, 5: 7, 6: 5, 7: 4 });
    expect(new Set(LESSONS.map((l) => l.id)).size).toBe(36);
  });

  it("verifies all 104 sources are referenced and formatted properly", () => {
    expect(CURRICULUM_URL).toBe(
      "https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/geschichte",
    );
    expect(SOURCES).toHaveLength(104);
    const sourceIds = new Set(SOURCES.map((s) => s.id));
    expect(sourceIds.size).toBe(SOURCES.length);
    for (const source of SOURCES) {
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.label.trim().length).toBeGreaterThan(3);
    }

    const usedSources = new Set<string>();
    for (const lesson of LESSONS) {
      expect(lesson.sourceIds.length).toBeGreaterThanOrEqual(2);
      for (const id of lesson.sourceIds) {
        expect(sourceIds.has(id)).toBe(true);
        usedSources.add(id);
      }
    }
    expect(usedSources.size).toBe(SOURCES.length);

    for (const slug of ["gg6-kultur-olympia-theater", "gg6-hatschepsut-herrscherin"]) {
      const lesson = findLesson(slug);
      expect(lesson?.sourceExcerpt?.quote.length).toBeGreaterThan(30);
      expect(lesson?.sourceExcerpt?.attribution.length).toBeGreaterThan(10);
    }

    for (const city of FRANKS_CITIES) {
      const [x, y] = atCrop(FRANKS_FRAME, city.lon, city.lat);
      expect(x).toBeGreaterThanOrEqual(24);
      expect(x).toBeLessThanOrEqual(FRANKS_FRAME.width - 24);
      expect(y).toBeGreaterThanOrEqual(24);
      expect(y).toBeLessThanOrEqual(FRANKS_FRAME.height - 30);
    }
  });

  it("validates all 47 SVG figures, hero panorama, global timeline, 15 labs, and Kriterienkataloge", () => {
    const figureKeys = Object.keys(FIGURES);
    expect(figureKeys).toHaveLength(47);

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
        expect(rendered).not.toMatch(/NaN|undefined|Infinity/);
      }
      if (lesson.lab) {
        expect(lesson.lab in LABS).toBe(true);
        usedLabs.add(lesson.lab);
      }
      if (lesson.kriterien) {
        kriterienCount++;
        expect(lesson.kriterien.title.length).toBeGreaterThan(4);
        expect(lesson.kriterien.steps.length).toBeGreaterThanOrEqual(3);
      }
    }

    expect(usedFigures.size).toBe(figureKeys.length);
    expect(usedLabs.size).toBe(Object.keys(LABS).length);
    expect(kriterienCount).toBeGreaterThanOrEqual(4);

    for (const extraSvg of [heroPanorama(), gesamtZeitleiste()]) {
      expect(extraSvg).toContain("<svg");
      expect(extraSvg).toContain("</svg>");
      expect(extraSvg).not.toMatch(/NaN|undefined|Infinity/);
    }
  });

  it.each(LESSONS)(
    "meets German typography, school-level, and exercise standards: $id",
    (lesson) => {
      expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(2);
      expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(700);
      expect(lesson.takeaway.length).toBeGreaterThan(20);
      expect(lesson.grundwissen?.length ?? 0).toBeGreaterThanOrEqual(2);
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
  it("covers all 40 verbatim Kompetenzerwartungen and binds every lesson", () => {
    expect(coverage.curriculum).toBe(CURRICULUM_URL);
    expect(coverage.curriculum_sha256).toBe(
      "8783baf2fb7616069c7ded0533c1f0badc05fe05f700d4dd0a01d9ae59c1cef1",
    );
    expect(coverage.school_type).toBe("gymnasium");
    expect(coverage.grade).toBe(6);
    expect(coverage.subject).toBe("geschichte");
    expect(coverage.optional_lessons).toEqual([]);
    expect(coverage.rows).toHaveLength(40);

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
      if (row.status === "supported") {
        expect(typeof row.in_class).toBe("string");
        expect(row.in_class!.length).toBeGreaterThan(10);
      }
    }

    expect(perLb).toEqual({
      "1": 5,
      "2": 5,
      "3": 8,
      "4": 5,
      "5": 8,
      "6": 5,
      "7": 4,
    });
    expect(statusCounts).toEqual({ implemented: 37, supported: 3 });
    expect(coveredLessons.size).toBe(LESSONS.length);
  });

  it("matches publication 0.0, public-contract ULIDs, and ZAM cell standards", () => {
    expect(publication).toEqual({ schema: 1, status: "ready", version: "0.0" });
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(cell.title).toBe(ZAM_CELL_TITLE);
    expect(cell.atoms).toHaveLength(36);
    expect(publicContract).toHaveLength(36);

    const allUlids = new Set<string>();
    const lessonSlugs = LESSONS.map((l) => l.id);
    const atomSlugs: string[] = [];

    const approvedReplacements = new Map(
      replaces.rows
        .filter((row) => row.category !== "C")
        .map((row) => [row.academy_slug!, [row.de_by_id]]),
    );

    for (let i = 0; i < cell.atoms.length; i++) {
      const atom = cell.atoms[i];
      const contract = publicContract[i];
      expect(atom.id).toBe(contract.id);
      expect(atom.slug).toBe(contract.slug);
      expect(atom.id).toMatch(ULID_RE);
      expect(allUlids.has(atom.id)).toBe(false);
      allUlids.add(atom.id);
      atomSlugs.push(atom.slug);

      expect(atom.practice_items).toHaveLength(2);
      expect(contract.items).toHaveLength(2);

      const expectedLink = lessonLink(atom.slug);
      expect(contract.lesson).toBe(expectedLink);

      for (let j = 0; j < 2; j++) {
        const item = atom.practice_items[j] as Record<string, unknown>;
        expect(item.id).toBe(contract.items[j].id);
        expect(item.slug).toBe(contract.items[j].slug);
        expect(String(item.id)).toMatch(ULID_RE);
        expect(allUlids.has(String(item.id))).toBe(false);
        allUlids.add(String(item.id));
        expect(item.source_link).toBe(expectedLink);
        expect(item.replaces).toEqual(
          approvedReplacements.get(String(item.slug)),
        );

        if (j === 0) {
          expect(item.tier).toBe("tier1_fast");
          const fc = item.fast_check as {
            options: string[];
            correct_index: number;
          };
          expect(fc.options).toHaveLength(2);
          expect(fc.correct_index).toBe(0);
        } else {
          expect(item.tier).toBe("tier2_synthesis");
          expect(String(item.concept).length).toBeLessThanOrEqual(200);
          expect(typeof item.sample_solution).toBe("string");
          expect(String(item.sample_solution).trim().length).toBeGreaterThan(
            10,
          );
        }

        if (Array.isArray(item.choice_distractors)) {
          expect(item.choice_distractors).toHaveLength(2);
          for (const dist of item.choice_distractors as Array<{
            text: string;
            reason: string;
          }>) {
            expect(dist.text.trim().length).toBeGreaterThan(0);
            expect(dist.reason.trim().length).toBeGreaterThan(5);
          }
        }
      }
    }

    expect(atomSlugs).toEqual(lessonSlugs);
    expect(allUlids.size).toBe(108);
    expect("replaces" in cell).toBe(false);
    expect("retired_items" in cell).toBe(false);
  });

  it("maps every legacy Grade 6 item cleanly under Thomas's approved mapping", () => {
    expect(replaces.status).toBe("approved");
    expect(replaces.approved).toBe("2026-11-18");
    expect(replaces.sources).toHaveLength(2);
    for (const src of replaces.sources) {
      expect(src.sha256).toMatch(/^[0-9a-f]{64}$/);
    }

    const legacyItems = [
      ...legacyUrgeschichte.atoms.flatMap((atom) =>
        atom.practice_items.map((item) => ({
          cell: legacyUrgeschichte.tile_id,
          id: item.id,
          question: item.question,
        })),
      ),
      ...legacyRom.atoms.flatMap((atom) =>
        atom.practice_items.map((item) => ({
          cell: legacyRom.tile_id,
          id: item.id,
          question: item.question,
        })),
      ),
    ];

    expect(legacyItems).toHaveLength(16);
    expect(replaces.rows).toHaveLength(16);

    const rowsByOldId = new Map(replaces.rows.map((row) => [row.de_by_id, row]));
    expect(rowsByOldId.size).toBe(16);

    const itemsBySlug = new Map(
      cell.atoms.flatMap((atom) =>
        atom.practice_items.map(
          (item) => [item.slug, item as Record<string, unknown>] as const,
        ),
      ),
    );
    const proposedSuccessors = new Set<string>();
    const categories = { A: 0, B: 0, C: 0 };

    for (const item of legacyItems) {
      const row = rowsByOldId.get(item.id);
      expect(row).toBeDefined();
      expect(row!.de_by_cell).toBe(item.cell);
      expect(row!.old_question).toBe(item.question);
      categories[row!.category as "A" | "B" | "C"]++;

      if (row!.category === "A" || row!.category === "B") {
        expect(row!.action).toBe("replace");
        expect(typeof row!.academy_slug).toBe("string");
        const successor = itemsBySlug.get(row!.academy_slug!);
        expect(successor).toBeDefined();
        expect(successor!.replaces).toEqual([row!.de_by_id]);
        expect(proposedSuccessors.has(row!.academy_slug!)).toBe(false);
        proposedSuccessors.add(row!.academy_slug!);
      } else {
        expect(row!.category).toBe("C");
        expect(row!.action).toBe("keep-active");
        expect(row!.academy_slug).toBeNull();
      }
    }

    expect(categories).toEqual({ A: 8, B: 0, C: 8 });
  });

  it("parses deep links, ZAM requests, and localStorage progress safely", () => {
    expect(ZAM_ACADEMY_APP_URL).toBe(
      "https://academy.zam-os.org/geschichte-gymnasium-6/",
    );
    expect(zamEnrolRequest()).toContain(ZAM_CELL_TITLE);
    expect(
      parseTrainingDeepLink("#lesson=gg6-provinzen-bayern-limes&level=2"),
    ).toEqual({
      lessonId: "gg6-provinzen-bayern-limes",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=bad/id!&level=9")).toEqual({});

    expect(STORAGE_KEY).toBe("geschichte_gy6_academy_progress_v1");
    expect(parseProgress("not-json")).toEqual(freshProgress());
    const parsed = parseProgress(
      JSON.stringify({
        activeLessonId: "gg6-alexander-weltreich",
        level: 2,
        quizDone: ["gg6-alexander-weltreich", "unbekannt"],
        workshopDone: ["gg6-altsteinzeit"],
        writingDone: [
          writingKey("gg6-alexander-weltreich", 2),
          writingKey("gg6-altsteinzeit", 1),
        ],
        drafts: {
          [writingKey("gg6-alexander-weltreich", 2)]:
            "Ausführliche begründete Antwort auf Niveau 2.",
          [writingKey("gg6-altsteinzeit", 1)]: "zu kurz",
        },
      }),
    );
    expect(parsed.activeLessonId).toBe("gg6-alexander-weltreich");
    expect(parsed.level).toBe(2);
    expect(parsed.quizDone).toEqual(["gg6-alexander-weltreich"]);
    expect(parsed.writingDone).toEqual(["gg6-alexander-weltreich:2"]);
  });
});
