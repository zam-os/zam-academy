import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import replacesDeBy from "../replaces-de-by.json";
import legacyAlg from "./fixtures/de-by-gymnasium-7-mathematik-rationale-zahlen-gleichungen-prozent-kvt.json";
import legacyGeo from "./fixtures/de-by-gymnasium-7-mathematik-symmetrie-winkel-dreiecke-kongruenz-kvt.json";
import publicContract from "./fixtures/public-contract.json";
import { ALL_LESSONS, STAGES } from "../src/curriculum";
import { createRng } from "../src/exercises/rng";

const ULID_RE = /^[0-9A-HJKMNP-TV-Z]{26}$/;
const GRADE_8_FORBIDDEN =
  /\b(lineare funktion|y-achsenabschnitt|funktionsgleichung|gleichungssystem|bruchgleichung|bruchterm|definitionsmenge|strahlensatz|kreiszahl|kreisumfang|kreisfläche|pythagoras|zylinder|laplace)\b/i;

function plainTextOf(item: {
  question?: string;
  question_segments?: Array<{ type: string; text?: string; tex?: string }>;
  concept?: string;
  concept_segments?: Array<{ type: string; text?: string; tex?: string }>;
}) {
  const join = (
    fallback: string | undefined,
    segs: Array<{ type: string; text?: string; tex?: string }> | undefined,
  ) => {
    if (!segs) return fallback ?? "";
    return segs.map((s) => (s.type === "text" ? (s.text ?? "") : (s.tex ?? ""))).join("");
  };
  return {
    question: join(item.question, item.question_segments),
    concept: join(item.concept, item.concept_segments),
  };
}

describe("Lehrplan und Lektionsvertrag M7", () => {
  it("defines 5 stages and 44 complete lessons without Grade 8 drift", () => {
    expect(STAGES).toHaveLength(5);
    expect(STAGES.map((s) => s.id)).toEqual([
      "stage-1-terme",
      "stage-2-symmetrie",
      "stage-3-gleichungen",
      "stage-4-daten",
      "stage-5-kongruenz",
    ]);
    expect(ALL_LESSONS).toHaveLength(44);

    const lessonIds = new Set<string>();
    const exerciseIds = new Set<string>();
    for (const lesson of ALL_LESSONS) {
      expect(lessonIds.has(lesson.id)).toBe(false);
      lessonIds.add(lesson.id);

      expect(lesson.lehrplan.startsWith("M7 LB ")).toBe(true);
      expect(lesson.explanationHtml).toContain('<div class="example">');
      expect(lesson.explanationHtml).toContain('<div class="merke">');
      expect(lesson.quiz.options.length).toBeGreaterThanOrEqual(3);
      expect(lesson.quiz.correctIndex).toBeGreaterThanOrEqual(0);
      expect(lesson.quiz.correctIndex).toBeLessThan(lesson.quiz.options.length);
      expect(lesson.teacherVideo).toBeUndefined();
      expect(lesson.requiredCorrect).toBe(3);
      expect(lesson.lab.goals).toHaveLength(3);
      expect(lesson.exercises).toHaveLength(2);
      const t1 = lesson.exercises[0].make(createRng(17), 1);
      const t2 = lesson.exercises[0].make(createRng(17), 2);
      expect(t1.formulaHint).toBeTruthy();
      expect(t1.prompt).not.toBe(t2.prompt);

      for (const ex of lesson.exercises) {
        expect(exerciseIds.has(ex.id)).toBe(false);
        exerciseIds.add(ex.id);
      }

      const combinedText = `${lesson.title} ${lesson.subtitle} ${lesson.whyItMatters} ${lesson.explanationHtml}`;
      expect(combinedText).not.toMatch(GRADE_8_FORBIDDEN);
      expect(lesson.title).not.toMatch(/\b\d+\.\d+\.\d+\b/);
      // No unescaped ASCII minus inside numeric values (strip HTML tags & attributes first)
      const proseOnly = lesson.explanationHtml
        .replace(/<[^>]+>/g, " ")
        .replace(/&[a-z]+;/g, " ");
      expect(proseOnly).not.toMatch(/\b\d+\.\d+\b/);
    }
  });

  it("maps all 32 curriculum competences to all 44 lessons", () => {
    expect(coverage.schema).toBe(1);
    expect(coverage.school_type).toBe("gymnasium");
    expect(coverage.grade).toBe(7);
    expect(coverage.subject).toBe("mathematik");
    expect(coverage.curriculum_sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(coverage.optional_lessons).toEqual([]);
    expect(coverage.rows).toHaveLength(32);

    const validIds = new Set<string>();
    for (const l of ALL_LESSONS) {
      validIds.add(l.id);
      validIds.add(l.lab.kind);
      for (const e of l.exercises) validIds.add(e.id);
    }

    const coveredLessons = new Set<string>();
    for (const row of coverage.rows) {
      expect(["implemented", "supported"]).toContain(row.status);
      expect(row.lessons.length).toBeGreaterThan(0);
      expect(row.evidence.length).toBeGreaterThan(20);
      for (const lid of row.lessons) {
        expect(ALL_LESSONS.some((l) => l.id === lid)).toBe(true);
        coveredLessons.add(lid);
      }
      for (const m of row.evidence.matchAll(/\b[a-z]+(?:-[a-z0-9]+)+\b/g)) {
        expect(validIds.has(m[0])).toBe(true);
      }
    }

    expect(coveredLessons.size).toBe(44);
  });
});

describe("ZAM-Zelle und Vorschlags-Mapping M7", () => {
  it("aligns cell.json with 44 atoms, 132 cards and pinned public contract IDs", () => {
    expect(cell.tile_id).toBe("zam-academy:mathematik-gymnasium-7");
    expect((cell as Record<string, unknown>).retired_items).toBeUndefined();
    expect(cell.atoms).toHaveLength(44);
    expect(publicContract).toHaveLength(44);

    const atomIds = new Set<string>();
    const cardIds = new Set<string>();
    const cardSlugs = new Set<string>();

    for (let i = 0; i < ALL_LESSONS.length; i++) {
      const lesson = ALL_LESSONS[i];
      const atom = cell.atoms[i];
      const pinned = publicContract[i];

      expect(atom.slug).toBe(lesson.id);
      expect(atom.id).toMatch(ULID_RE);
      expect(atomIds.has(atom.id)).toBe(false);
      atomIds.add(atom.id);

      expect(pinned.lesson).toBe(lesson.id);
      expect(pinned.slug).toBe(atom.slug);
      expect(pinned.atom_id).toBe(atom.id);

      expect(atom.source_link).toBe(`https://academy.zam-os.org/mathematik-gymnasium-7/#lesson=${lesson.id}`);
      expect(atom.curricula).toHaveLength(2);
      expect(atom.curricula[1].school_type).toBe("gymnasium");
      expect(atom.curricula[1].grade).toBe(7);

      expect(atom.practice_items).toHaveLength(3);
      expect(pinned.items).toHaveLength(3);

      for (let j = 0; j < atom.practice_items.length; j++) {
        const item = atom.practice_items[j] as {
          id: string;
          slug: string;
          tier: string;
          choice_distractors: Array<{ text: string; reason: string }>;
          fast_check?: { type: string; options: string[]; correct_index: number };
          sample_solution?: string;
          replaces?: string[];
          question?: string;
          question_segments?: Array<{ type: string; text?: string; tex?: string }>;
          concept?: string;
          concept_segments?: Array<{ type: string; text?: string; tex?: string }>;
        };
        expect(item.replaces).toBeUndefined();
        expect(item.id).toMatch(ULID_RE);
        expect(cardIds.has(item.id)).toBe(false);
        cardIds.add(item.id);
        expect(cardSlugs.has(item.slug)).toBe(false);
        cardSlugs.add(item.slug);

        expect(pinned.items[j]).toEqual({ id: item.id, slug: item.slug });

        expect(item.choice_distractors).toHaveLength(2);
        for (const d of item.choice_distractors) {
          expect(d.text.trim().length).toBeGreaterThan(5);
          expect(d.reason.trim().length).toBeGreaterThan(5);
        }

        if (item.tier === "tier1_fast") {
          expect(item.fast_check).toBeDefined();
          expect(item.fast_check?.type).toBe("binary_choice");
          expect(item.fast_check?.options).toHaveLength(2);
          expect(item.fast_check?.correct_index).toBe(0);
        } else {
          expect(item.tier).toBe("tier2_synthesis");
          expect(item.sample_solution && item.sample_solution.length > 20).toBe(true);
        }

        const plain = plainTextOf(item);
        expect(`${plain.question} ${plain.concept}`).not.toMatch(GRADE_8_FORBIDDEN);
      }
    }

    // Prerequisites form an acyclic DAG over known atom IDs
    const deps = new Map(
      cell.atoms.map((a) => [a.id, a.prerequisites.map((p) => p.atom_id)]),
    );
    const state = new Map<string, number>();
    const visit = (id: string) => {
      const s = state.get(id) ?? 0;
      if (s === 2) return;
      if (s === 1) throw new Error(`Cycle in prerequisites at ${id}`);
      state.set(id, 1);
      for (const dep of deps.get(id) ?? []) {
        expect(atomIds.has(dep)).toBe(true);
        visit(dep);
      }
      state.set(id, 2);
    };
    for (const id of atomIds) visit(id);
  });

  it("keeps replaces-de-by.json as unapproved proposal covering all 12 legacy items", () => {
    expect(replacesDeBy.approved).toBeNull();
    expect(replacesDeBy.status).toBe("proposal-only");

    const allLegacyIds = [
      ...legacyAlg.atoms.flatMap((a) => a.practice_items.map((p) => p.id)),
      ...legacyGeo.atoms.flatMap((a) => a.practice_items.map((p) => p.id)),
    ];
    expect(allLegacyIds).toHaveLength(12);
    expect(replacesDeBy.rows).toHaveLength(12);

    const cardSlugs = new Set(
      cell.atoms.flatMap((a) => a.practice_items.map((p) => p.slug)),
    );
    const mappedLegacyIds = new Set<string>();
    const proposedTargets = new Set<string>();

    for (const row of replacesDeBy.rows) {
      expect(allLegacyIds).toContain(row.de_by_id);
      expect(mappedLegacyIds.has(row.de_by_id)).toBe(false);
      mappedLegacyIds.add(row.de_by_id);

      if (row.category === "A") {
        expect(row.action).toBe("propose-replace-after-approval");
        expect(row.academy_slug).toBeTruthy();
        expect(cardSlugs.has(row.academy_slug!)).toBe(true);
        expect(proposedTargets.has(row.academy_slug!)).toBe(false);
        proposedTargets.add(row.academy_slug!);
      } else {
        expect(row.category).toBe("C");
        expect(row.action).toBe("keep-active");
        expect(row.academy_slug).toBeNull();
      }
    }

    expect(mappedLegacyIds.size).toBe(12);
    expect(proposedTargets.size).toBe(4);
  });
});
