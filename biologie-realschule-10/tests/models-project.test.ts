import { afterEach, describe, expect, it, vi } from "vitest";
import { LESSONS } from "../src/curriculum";
import {
  applyScenario,
  dihybrid,
  divisionStates,
  dnaComplement,
  ecosystemSeries,
  initialModelState,
  MODEL_SCENARIOS,
  modelReady,
  monohybrid,
  recordExploration,
  screeningTable,
  translateCodingDNA,
} from "../src/models";
import {
  freshProject,
  localDateString,
  missingProjectFields,
  PROJECT_FIELDS,
  projectReady,
  sanitizeProject,
  sourceUrl,
  validProjectDate,
} from "../src/project";
import { renderModel } from "../src/ui/models";

describe("DNA, inheritance and chromosome models", () => {
  it("pairs opposite directions without silently accepting non-DNA symbols", () => {
    expect(dnaComplement("atgc")).toBe("TACG");
    expect(dnaComplement(dnaComplement("AGCTT")!)).toBe("AGCTT");
    for (const value of ["", "AUCG", "A<GC", "A G", "G".repeat(61)])
      expect(dnaComplement(value)).toBeNull();
  });
  it("derives uniformity and monohybrid segregation as probabilities", () => {
    expect(monohybrid("AA", "aa")).toMatchObject({
      squares: ["Aa", "Aa", "Aa", "Aa"],
      dominant: 4,
      recessive: 0,
    });
    expect(monohybrid("Aa", "Aa")).toMatchObject({
      counts: { AA: 1, Aa: 2, aa: 1 },
      dominant: 3,
      recessive: 1,
    });
    expect(monohybrid("Aa", "aa")).toMatchObject({ counts: { AA: 0, Aa: 2, aa: 2 } });
    for (const a of ["AA", "Aa", "aa"] as const)
      for (const b of ["AA", "Aa", "aa"] as const) {
        const r = monohybrid(a, b);
        expect(r.squares).toHaveLength(4);
        expect(Object.values(r.counts).reduce((n, v) => n + v, 0)).toBe(4);
      }
  });
  it("derives 9:3:3:1 from sixteen independent combinations", () => {
    const r = dihybrid();
    expect(r.gametes).toEqual(["AB", "Ab", "aB", "ab"]);
    expect(r.squares).toHaveLength(16);
    expect(r.counts).toEqual({ both: 9, onlyA: 3, onlyB: 3, neither: 1 });
  });
  it("counts chromosomes per nucleus and distinguishes duplication from reduction", () => {
    const m = divisionStates("mitosis"),
      g = divisionStates("meiosis");
    expect(m[1]).toMatchObject({ chromosomes: 46, chromatids: 92, ploidy: "2n" });
    expect(m.at(-1)).toMatchObject({ nuclei: 2, chromosomes: 46, chromatids: 46, ploidy: "2n" });
    expect(g[2]).toMatchObject({ nuclei: 2, chromosomes: 23, chromatids: 46, ploidy: "1n" });
    expect(g[3]).toMatchObject({ nuclei: 4, chromosomes: 23, chromatids: 23, ploidy: "1n" });
    expect(g[3].nuclei * g[3].chromatids).toBe(m[1].chromatids);
    expect(() => divisionStates("meiosis", 3)).toThrow();
  });
  it("uses coding DNA orientation and stops before translating further codons", () => {
    expect(translateCodingDNA("ATGGCTTAA")).toEqual({
      rna: "AUGGCUUAA",
      codons: ["AUG", "GCU", "UAA"],
      amino: ["Methionin", "Alanin"],
      stopped: true,
    });
    expect(translateCodingDNA("ATGTAATGG")?.amino).toEqual(["Methionin"]);
    expect(translateCodingDNA("TTTGGTTGG")?.amino).toEqual([
      "Phenylalanin",
      "Glycin",
      "Tryptophan",
    ]);
    for (const sequence of ["", "AT", "ATGA", "AUG", "<script>"])
      expect(translateCodingDNA(sequence)).toBeNull();
    for (const x of "ATGC")
      for (const y of "ATGC")
        for (const z of "ATGC") {
          const translated = translateCodingDNA(x + y + z)!;
          expect(translated.amino.every(Boolean)).toBe(true);
          expect(translated.stopped || translated.amino.length === 1).toBe(true);
        }
  });
});
describe("screening and deliberately fictional ecosystem model", () => {
  it("distinguishes sensitivity from the positive predictive value", () => {
    const r = screeningTable(1);
    expect(r).toMatchObject({ affected: 100, unaffected: 9900, tp: 90, fn: 10, tn: 9405, fp: 495 });
    expect(r.positivePredictiveValue).toBeCloseTo(15.384615);
    expect(screeningTable(10).positivePredictiveValue).toBeCloseTo(66.666667);
    expect(screeningTable(0, 10000, 90, 100).positivePredictiveValue).toBeNull();
    for (const prevalence of [0, 1, 5, 10, 100]) {
      const v = screeningTable(prevalence);
      expect(v.tp + v.fn + v.fp + v.tn).toBe(10000);
    }
    expect(() => screeningTable(Number.NaN)).toThrow();
    expect(() => screeningTable(-1)).toThrow();
  });
  it("preserves mass at every step and shows a delayed non-linear return", () => {
    for (const load of [0, 2, 8, 10])
      for (const retention of [0, 30, 70, 100]) {
        const rows = ecosystemSeries(load, retention);
        expect(rows).toHaveLength(12);
        for (const row of rows) {
          expect(row.store).toBeGreaterThanOrEqual(0);
          expect(row.totalRemoved + row.store).toBeCloseTo(row.totalInput);
        }
        expect(rows.slice(6).every((r) => r.input === 0)).toBe(true);
      }
    const low = ecosystemSeries(2, 70),
      high = ecosystemSeries(8, 70),
      buffer = ecosystemSeries(8, 30);
    expect(low.some((r) => r.feedback)).toBe(false);
    expect(high.some((r) => r.feedback)).toBe(true);
    expect(buffer.some((r) => r.feedback)).toBe(false);
    expect(high[11].store).toBeGreaterThan(0);
    expect(high[11].store).toBeLessThan(high[5].store);
    expect(() => ecosystemSeries(11, 70)).toThrow();
  });
  it("records only allowed explicit comparisons and renders accessible explanatory text", () => {
    for (const lesson of LESSONS.filter((l) => l.model)) {
      const kind = lesson.model!,
        original = initialModelState();
      let seen: string[] = [];
      expect(modelReady(kind, seen)).toBe(false);
      for (const scenario of MODEL_SCENARIOS[kind]) {
        const state = applyScenario(kind, original, scenario.id);
        expect(original.selected).toBe("");
        seen = recordExploration(kind, seen, scenario.id);
        const html = renderModel(lesson, seen, state);
        expect(html).toContain("<section");
        expect(html).toContain("data-scenario");
        expect(html).not.toContain("undefined");
        expect(html).not.toContain("NaN");
      }
      expect(modelReady(kind, seen)).toBe(true);
      expect(recordExploration(kind, seen, "bad")).toEqual(seen);
    }
    const lesson = LESSONS.find((l) => l.model === "dna")!;
    expect(renderModel(lesson, [], { ...initialModelState(), sequence: "<script>" })).not.toContain(
      'value="<script>',
    );
  });
});
describe("own ecosystem research worksheet", () => {
  afterEach(() => vi.useRealTimers());
  const fill = () =>
    Object.fromEntries(
      Object.keys(PROJECT_FIELDS).map((key) => [
        key,
        "Ein konkret formulierter Vergleich mit Quellenangaben und einer nachvollziehbaren Begründung. ".repeat(
          2,
        ),
      ]),
    );
  it("requires earlier steps and does not count an empty or unsupported worksheet", () => {
    const p = freshProject();
    expect(projectReady(p, "question")).toBe(false);
    expect(projectReady(p, "judgment")).toBe(false);
    const filled = sanitizeProject({
      ...fill(),
      eventDate: "2026-10-20",
      sourceA: "https://example.org/report-a#part",
      sourceADate: "2020-02-29",
      sourceB: "https://other.example.org/archive",
      sourceBDate: "2026-10-20",
    });
    expect(projectReady(filled, "judgment", "2026-10-21")).toBe(true);
    filled.sourceB = "https://example.org/report-a#another";
    expect(missingProjectFields(filled, "evidence", "2026-10-21")).toContain("sourceB");
    filled.event = "";
    expect(projectReady(filled, "judgment", "2026-10-21")).toBe(false);
  });
  it("refuses malformed URLs and impossible dates, and bounds saved input", () => {
    for (const value of [
      "javascript:alert(1)",
      "file:///tmp/private",
      "https://name:secret@example.org/",
      "plain text",
    ])
      expect(sourceUrl(value)).toBeNull();
    for (const date of ["2026-02-30", "2026-13-01", "2026-10-22", "2024-2-01"])
      expect(validProjectDate(date, "2026-10-21")).toBe(false);
    expect(validProjectDate("2024-02-29", "2026-10-21")).toBe(true);
    const clean = sanitizeProject({ place: "a".repeat(10000), unknown: "keep?" });
    expect(clean.place).toHaveLength(4000);
    expect("unknown" in clean).toBe(false);
  });
  it("uses the local calendar day after German midnight instead of yesterday in UTC", () => {
    try {
      vi.stubEnv("TZ", "Europe/Berlin");
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-10-20T22:30:00Z"));
      expect(localDateString()).toBe("2026-10-21");
      expect(validProjectDate("2026-10-21")).toBe(true);
    } finally {
      vi.unstubAllEnvs();
      vi.useRealTimers();
    }
  });
});
