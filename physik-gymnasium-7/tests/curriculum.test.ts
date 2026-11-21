import { describe, expect, it } from "vitest";
import cellData from "../cell.json";
import coverageData from "../coverage.json";
import mappingData from "../replaces-de-by.json";
import { CURRICULUM_URL, findLesson, LESSONS, SOURCES, STAGES } from "../src/curriculum";
import { MODEL_SCENARIOS } from "../src/models";
import {
  completion,
  EXPERIMENT_SLOTS,
  experimentSummary,
  freshExperiment,
  freshProgress,
  isComplete,
  parseProgress,
  STORAGE_KEY,
  writingKey,
} from "../src/storage/progress";
import { canAcceptSelfAssessment, checkWorkshop, initialOrder, moveEntry } from "../src/workshop";
import { lessonLink, parseTrainingDeepLink, ZAM_CELL_ID } from "../src/zam/zam-link";
import curriculumHtml from "./fixtures/curriculum.html?raw";
import mechanicsRaw from "./fixtures/de-by-gymnasium-7-physik-mechanik-kraefte-masse-dichte-druck-kvt.json?raw";
import opticsRaw from "./fixtures/de-by-gymnasium-7-physik-optik-lichtbrechung-totalreflexion-linsen-kvt.json?raw";

interface Item {
  id: string;
  slug: string;
  tier: string;
  source_link: string;
  question: string;
  concept?: string;
  concept_segments?: unknown[];
  sample_solution?: string;
  fast_check?: { options: unknown[]; correct_index: number };
  replaces?: string[];
}
interface Binding {
  provider: string;
  track?: string;
  school_type?: string;
  grade?: number;
  subject?: string;
  topic_code?: string;
}
interface Tile {
  tile_id: string;
  atoms: Array<{
    id: string;
    slug: string;
    title: string;
    source_link: string;
    prerequisites: Array<{ atom_id: string }>;
    curricula: Binding[];
    practice_items: Item[];
  }>;
  retired_items?: Array<{ id: string }>;
}
interface Mapping {
  status: string;
  approved: string | null;
  source_commit: string;
  sources: Array<{ file: string; sha256: string; tile_id: string }>;
  rows: Array<{
    de_by_id: string;
    category: "A" | "B" | "C";
    academy_slug: string | null;
    action: string;
    reason: string;
  }>;
}
interface Coverage {
  curriculum: string;
  curriculum_sha256: string;
  optional_lessons: string[];
  rows: Array<{ lb: number; section: string; competence: string; lessons: string[]; status: string; evidence: string }>;
  contents: Array<{ section: string; content: string; lessons: string[] }>;
}
const cell = cellData as unknown as Tile;
const mapping = mappingData as unknown as Mapping;
const coverage = coverageData as unknown as Coverage;
const legacy = { mechanicsRaw, opticsRaw };

const PINNED_IDS = [
  "beobachten",
  "magnete",
  "elementarmagnete",
  "erdmagnetfeld",
  "dichte",
  "dichte-messen",
  "dichte-bewerten",
  "sehen",
  "farben",
  "farbige-schatten",
  "schatten",
  "kernschatten",
  "mondphasen",
  "finsternisse",
  "licht-sicherheit",
  "ladungen",
  "reibungselektrizitaet",
  "strom",
  "waerme-licht",
  "elektromagnet",
  "schaltungen",
];
/** The text of the fetched Fachlehrplan, tags removed and whitespace normalised. */
const curriculumText = curriculumHtml
  .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/&quot;/g, '"')
  .replace(/\s+/g, " ");
const normal = (text: string) => text.replace(/\s+/g, " ").trim();
async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

describe("published lesson and cell contract", () => {
  it("pins every lesson anchor and the three sections of NT7 Lernbereich 1", () => {
    expect(LESSONS.map((l) => l.id)).toEqual(PINNED_IDS);
    expect(STAGES.map((s) => s.section)).toEqual(["1.1", "1.2", "1.3"]);
    expect(STAGES.reduce((sum, s) => sum + s.hours, 0)).toBe(28);
    expect(LESSONS.filter((l) => l.lb === 1)).toHaveLength(7);
    expect(LESSONS.filter((l) => l.lb === 2)).toHaveLength(8);
    expect(LESSONS.filter((l) => l.lb === 3)).toHaveLength(6);
    for (const lesson of LESSONS) {
      const stage = STAGES.find((s) => s.lb === lesson.lb)!;
      expect(lesson.period.startsWith(`NT7 ${stage.section} · `)).toBe(true);
    }
    expect(CURRICULUM_URL).toBe("https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/nt_gym");
    expect(STORAGE_KEY).toBe("physik_gym7_academy_progress_v1");
  });
  for (const lesson of LESSONS)
    it(`${lesson.id}: explanation, example, terms, quiz and a solvable workshop`, () => {
      expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(3);
      for (const paragraph of lesson.paragraphs) {
        expect(paragraph.length).toBeGreaterThan(200);
        // The JSON shell escapes its text: plain text only.
        expect(paragraph).not.toMatch(/<[a-z/]/i);
      }
      // Every lesson works through a concrete case.
      // The shell sets a paragraph apart as the example only when it opens with "Beispiel: ".
      expect(lesson.paragraphs.filter((p) => p.startsWith("Beispiel: "))).toHaveLength(1);
      expect(lesson.takeaway.length).toBeGreaterThan(40);
      expect(lesson.formulas.length).toBeGreaterThanOrEqual(3);
      expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
      expect(lesson.quiz.question.trim().endsWith("?")).toBe(true);
      expect(lesson.quiz.explanation.length).toBeGreaterThan(40);
      expect(lesson.sourceIds[0]).toBe("lp");
      for (const source of lesson.sourceIds) expect(SOURCES.some((s) => s.id === source)).toBe(true);
      for (const level of [1, 2] as const) {
        const task = lesson.tasks[level];
        expect(task.prompt.length).toBeGreaterThan(60);
        expect(task.model.length).toBeGreaterThan(120);
        expect(task.criteria).toHaveLength(3);
        expect(task.hints).toHaveLength(2);
      }
      expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
      const work = lesson.workshop,
        solution = work.kind === "timeline" ? work.entries.map((_, i) => i) : work.entries.map((e) => e.target);
      expect(work.entries.length).toBeGreaterThanOrEqual(4);
      expect(checkWorkshop(work, solution).every(Boolean)).toBe(true);
      expect(checkWorkshop(work, []).some(Boolean)).toBe(false);
      if (work.kind === "timeline") {
        expect(work.entries.map((e) => e.target)).toEqual(solution);
        expect(initialOrder(work, lesson.id)).not.toEqual(solution);
      } else {
        // Every category is used, so no pile stays empty.
        expect(new Set(work.entries.map((e) => e.target)).size).toBe(work.categories.length);
      }
      // German learner text: decimal comma, real minus, "·" for products.
      // The period label carries section numbers such as "1.1".
      const text = JSON.stringify({ ...lesson, period: "" });
      expect(text).not.toMatch(/\d\.\d/);
      expect(text).not.toMatch(/\d \* \d|\d x \d/);
      expect(text).not.toMatch(/ - \d|[=(] ?-\d/);
      expect(text).not.toMatch(/\d(cm|ml|kg|km|g\/)/);
    });
  it("gives the interactive parts to the lessons that need them", () => {
    const models = LESSONS.filter((l) => l.model).map((l) => l.model);
    expect(new Set(models).size).toBe(models.length);
    expect(models).toHaveLength(Object.keys(MODEL_SCENARIOS).length);
    expect(models).toHaveLength(20);
    expect(LESSONS.filter((l) => !l.model).map((l) => l.id)).toEqual(["waerme-licht"]);
    expect(LESSONS.filter((l) => l.calculation).map((l) => l.id)).toEqual(["dichte", "dichte-messen", "dichte-bewerten"]);
  });
  it("maps every competence of the Fachlehrplan to lessons and every lesson to a competence", async () => {
    expect(coverage.curriculum).toBe(CURRICULUM_URL);
    expect(await sha256(curriculumHtml)).toBe(coverage.curriculum_sha256);
    expect(coverage.rows).toHaveLength(14);
    expect(coverage.optional_lessons).toEqual([]);
    const perSection: Record<string, number> = {};
    for (const row of coverage.rows) {
      perSection[row.section] = (perSection[row.section] ?? 0) + 1;
      // Verbatim: every competence occurs in the text of the fetched page.
      expect(curriculumText.includes(normal(row.competence)), row.competence.slice(0, 60)).toBe(true);
      expect(row.evidence.length).toBeGreaterThan(60);
      expect(["implemented", "supported"]).toContain(row.status);
      for (const id of row.lessons) {
        const lesson = findLesson(id);
        expect(lesson, id).toBeDefined();
        expect(STAGES.find((s) => s.lb === lesson!.lb)!.section).toBe(row.section);
      }
    }
    expect(perSection).toEqual({ "1.1": 5, "1.2": 4, "1.3": 5 });
    // Real experiments, photos and building circuits happen in class.
    expect(coverage.rows.filter((r) => r.status === "supported")).toHaveLength(7);
    for (const content of coverage.contents) {
      expect(curriculumText.includes(normal(content.content)), content.content).toBe(true);
      for (const id of content.lessons) expect(findLesson(id), id).toBeDefined();
    }
    expect(coverage.contents).toHaveLength(15);
    const covered = new Set(coverage.rows.flatMap((row) => row.lessons));
    for (const lesson of LESSONS) expect(covered.has(lesson.id), lesson.id).toBe(true);
    // Lernbereich 2 (Schwerpunkt Informatik) is not part of this package.
    expect(curriculumText).toContain("NT7 2 Schwerpunkt Informatik");
  });
  it("keeps cards solely in the cell and binds each atom to its section", () => {
    const items = cell.atoms.flatMap((a) => a.practice_items);
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(cell.atoms.map((a) => a.slug)).toEqual(PINNED_IDS.map((id) => `ph7g-${id}`));
    expect(items).toHaveLength(63);
    expect(new Set([...cell.atoms, ...items].map((x) => x.id)).size).toBe(84);
    expect(new Set(items.map((i) => i.slug)).size).toBe(63);
    const seen = new Set<string>();
    for (const atom of cell.atoms) {
      const lesson = findLesson(new URL(atom.source_link).hash.slice(8))!;
      expect(lesson).toBeDefined();
      expect(atom.source_link).toBe(lessonLink(lesson.id));
      expect(atom.title).toBe(lesson.title);
      expect(atom.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
      // Prerequisites point to atoms earlier in the path: no cycles.
      for (const prerequisite of atom.prerequisites) expect(seen.has(prerequisite.atom_id)).toBe(true);
      seen.add(atom.id);
      const section = STAGES.find((s) => s.lb === lesson.lb)!.section,
        bindings = atom.curricula.filter((b) => b.provider === "lehrplanplus-bayern");
      expect(bindings).toHaveLength(1);
      expect(bindings[0].track).toBeUndefined();
      expect([bindings[0].school_type, bindings[0].grade, bindings[0].subject, bindings[0].topic_code]).toEqual([
        "gymnasium",
        7,
        "nt_gym",
        `lb${section}`,
      ]);
      expect(atom.curricula.find((b) => b.provider === "zam-academy")?.subject).toBe("physik-gymnasium-7");
      expect(atom.practice_items).toHaveLength(3);
      expect(atom.practice_items.filter((i) => i.tier === "tier1_fast")).toHaveLength(2);
      for (const item of atom.practice_items) {
        expect(item.source_link).toBe(atom.source_link);
        expect(item.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
        expect(item.slug.startsWith("ph7g-")).toBe(true);
        expect(item.question.trim().length).toBeGreaterThan(12);
        expect(item.replaces).toBeUndefined();
        // Plain text or segments, never both.
        expect(Boolean(item.concept) !== Boolean(item.concept_segments)).toBe(true);
        if (item.tier === "tier1_fast") {
          expect(item.fast_check?.options).toHaveLength(2);
          expect(item.fast_check?.correct_index).toBe(0);
          expect(item.fast_check?.options[0]).toEqual(item.concept ?? item.concept_segments);
          expect(item.fast_check?.options[1]).not.toEqual(item.fast_check?.options[0]);
        } else {
          expect(item.tier).toBe("tier2_synthesis");
          expect(item.sample_solution?.length).toBeGreaterThan(80);
        }
      }
    }
    expect(JSON.stringify(LESSONS)).not.toContain('"practice_items"');
  });
  it("documents every legacy card once and transfers no history without approval", async () => {
    const tiles = [mechanicsRaw, opticsRaw].map(
      (raw) => JSON.parse(raw) as { tile_id: string; atoms: Array<{ practice_items: Array<{ id: string }> }> },
    );
    const legacyIds = tiles.flatMap((tile) => tile.atoms.flatMap((a) => a.practice_items.map((i) => i.id)));
    expect(legacyIds).toHaveLength(8);
    expect(mapping.source_commit).toMatch(/^[0-9a-f]{40}$/);
    expect(mapping.sources.map((s) => s.tile_id).sort()).toEqual(tiles.map((t) => t.tile_id).sort());
    for (const [i, raw] of [legacy.mechanicsRaw, legacy.opticsRaw].entries()) {
      const source = mapping.sources.find((s) => s.tile_id === tiles[i].tile_id)!;
      expect(await sha256(raw)).toBe(source.sha256);
      expect(raw).not.toContain("\r");
    }
    expect(mapping.rows).toHaveLength(8);
    expect(new Set(mapping.rows.map((r) => r.de_by_id))).toEqual(new Set(legacyIds));
    for (const row of mapping.rows) {
      expect(row.reason.length).toBeGreaterThan(60);
      expect(row.category).toBe("C");
      expect(row.academy_slug).toBeNull();
      expect(row.action).toBe("keep-active");
    }
    // A proposal only: nothing is approved, replaced or retired.
    expect(mapping.status).toBe("proposal-only");
    expect(mapping.approved).toBeNull();
    expect(cell.atoms.flatMap((a) => a.practice_items).filter((i) => i.replaces)).toEqual([]);
    expect(cell.retired_items).toBeUndefined();
  });
});

describe("learner progress", () => {
  it("starts with nothing reached and requires calculation, self-assessment and every model comparison", () => {
    const p = freshProgress(),
      id = "dichte",
      key = writingKey(id, 1);
    for (const lesson of LESSONS) expect(isComplete(p, lesson.id)).toBe(false);
    expect(p.explored).toEqual({});
    expect(completion(p)).toEqual({ completed: 0, total: 21, percent: 0 });
    p.quizDone = [id];
    p.workshopDone = [id];
    p.writingDone = [key];
    p.drafts[key] = "Eine eigene ausführliche Begründung zu den Messwerten.";
    expect(isComplete(p, id)).toBe(false);
    p.explored[id] = MODEL_SCENARIOS.dichte.map((s) => s.id);
    expect(isComplete(p, id)).toBe(false);
    p.calculationDone[key] = 2;
    expect(isComplete(p, id)).toBe(false);
    p.calculationDone[key] = 3;
    expect(isComplete(p, id)).toBe(true);
    expect(completion(p).completed).toBe(1);
    // A lesson without a model and without calculation needs the three core steps.
    const text = "waerme-licht",
      textKey = writingKey(text, 1);
    p.quizDone.push(text);
    p.workshopDone.push(text);
    expect(isComplete(p, text)).toBe(false);
    p.drafts[textKey] = "Der Heizdraht erwärmt sich durch die Wärmewirkung.";
    p.writingDone.push(textKey);
    expect(isComplete(p, text)).toBe(true);
    expect(canAcceptSelfAssessment("Kurz", [true, true, true])).toBe(false);
    expect(canAcceptSelfAssessment(p.drafts[key], [true, true, false])).toBe(false);
  });
  it("recovers corrupt storage and sanitizes counters", () => {
    expect(parseProgress("broken")).toEqual(freshProgress());
    expect(parseProgress("[]")).toEqual(freshProgress());
    const p = parseProgress(
      JSON.stringify({
        activeLessonId: "kb-groessen",
        drafts: { "dichte:1": "x".repeat(9000), unknown: "bad" },
        writingDone: ["dichte:1", "unknown"],
        calculationDone: { "dichte:1": 99, "magnete:1": -1, "dichte-messen:1": 2.5 },
        explored: { dichte: ["alu1", "unknown", "alu1"] },
      }),
    );
    expect(p.activeLessonId).toBe("beobachten");
    expect(p.drafts["dichte:1"]).toHaveLength(8000);
    expect(p.drafts.unknown).toBeUndefined();
    expect(p.calculationDone).toEqual({ "dichte:1": 3 });
    expect(p.explored.dichte).toEqual(["alu1"]);
    expect(parseProgress(JSON.stringify({ activeLessonId: "schaltungen" })).activeLessonId).toBe("schaltungen");
  });
  it("keeps one notebook slot for each of the six Schülerexperimente", () => {
    expect(EXPERIMENT_SLOTS.map((s) => s.lb)).toEqual([1, 1, 2, 2, 3, 3]);
    for (const slot of EXPERIMENT_SLOTS) expect(curriculumText).toContain(`Schülerexperiment: ${slot.title}`);
    const completed = {
      ...freshExperiment(),
      status: "done" as const,
      question: "x".repeat(20),
      setup: "x".repeat(20),
      data: "x".repeat(20),
      conclusion: "x".repeat(20),
    };
    const fresh = freshProgress().experiments;
    expect(experimentSummary(fresh)).toMatchObject({ count: 0, total: 6, ready: false });
    expect(experimentSummary([completed, ...fresh.slice(1)]).count).toBe(1);
    expect(experimentSummary(fresh.map(() => completed)).ready).toBe(true);
    expect(experimentSummary([{ ...completed, status: "planned" }]).count).toBe(0);
    expect(experimentSummary([{ ...completed, data: "" }]).count).toBe(0);
    const restored = parseProgress(JSON.stringify({ experiments: [completed, { status: "weird", data: 5 }] }));
    expect(restored.experiments).toHaveLength(6);
    expect(restored.experiments[0].status).toBe("done");
    expect(restored.experiments[1]).toEqual(freshExperiment());
  });
  it("accepts published deep links without permitting arbitrary lesson strings", () => {
    expect(parseTrainingDeepLink("#lesson=mondphasen&level=2")).toEqual({ lessonId: "mondphasen", level: 2 });
    expect(parseTrainingDeepLink("#lesson=<script>&level=7")).toEqual({});
    expect(lessonLink("dichte-messen")).toBe("https://academy.zam-os.org/physik-gymnasium-7/#lesson=dichte-messen");
    expect(moveEntry([0, 1, 2], 0, -1)).toEqual([0, 1, 2]);
  });
});
