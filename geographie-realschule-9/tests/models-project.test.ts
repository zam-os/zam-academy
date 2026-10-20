import { describe, expect, it, vi } from "vitest";
import { CORE_LESSONS, LESSONS } from "../src/curriculum";
import {
  AGE_PROFILES,
  CITY_PLANS,
  CLIMATE_PROFILES,
  climateStats,
  EU_COUNTRIES,
  EUROPE_BOUNDS,
  GERMANY_BOUNDS,
  greenhouse,
  LANDMARKS,
  MODEL_SCENARIOS,
  mapPoint,
  mapSize,
  modelReady,
  populationBalance,
  recordExploration,
  runoff,
} from "../src/models";
import {
  freshProject,
  type GeoProject,
  localDateString,
  missingProjectFields,
  projectReady,
  sanitizeProject,
  sourceUrl,
  validProjectDate,
} from "../src/project";
import { freshProgress, isComplete, writingKey } from "../src/storage/progress";
import { applyScenario, initialModelState, renderModel } from "../src/ui/models";

const today = "2026-10-20";
function filledProject(): GeoProject {
  return {
    place: "Öffentlicher Beispielort",
    event: "Ein aktuell beratenes Vorhaben im öffentlichen Raum.",
    eventDate: "2026-10-18",
    question: "Wie verändert das Vorhaben die Erreichbarkeit im untersuchten Gebiet?",
    sourceA: "https://example.org/amt/plan",
    sourceADate: "2026-10-15",
    sourceB: "https://example.org/zeitung/bericht",
    sourceBDate: "2026-10-19",
    map: "Karte mit Quelle, Maßstab und beschriebener Lage am Fluss sowie Verkehrsbeziehungen.",
    findings:
      "Die Quellen beschreiben den Plan und verschiedene Perspektiven. Ich unterscheide Absichten und tatsächlich gemessene Wirkungen.",
    judgment:
      "Ich wäge den belegten Nutzen für die Erreichbarkeit gegen Flächenverbrauch und Kosten ab. Mein Maßstab ist ein fairer Zugang für verschiedene Gruppen.",
    limits: "Es fehlen noch Messdaten zu Wirkungen nach der Umsetzung.",
    presentation:
      "Frage, Karte, Belege und Urteil werden mit Quellen und offenen Fragen im Unterricht vorgestellt.",
  };
}
describe("transparent geographical models", () => {
  it("conserves water volume and responds to sealing and saturation", () => {
    const green = runoff(40, 20, false);
    expect(green.total).toBe(400000);
    expect(green.fast).toBeCloseTo(136000, 6);
    expect(runoff(40, 80, false).fast).toBeGreaterThan(green.fast);
    expect(runoff(40, 20, true).fast).toBeGreaterThan(green.fast);
    for (let rain = 0; rain <= 100; rain += 5)
      for (let paved = 0; paved <= 100; paved += 10)
        for (const wet of [false, true]) {
          const r = runoff(rain, paved, wet);
          expect(r.fast + r.remaining).toBeCloseTo(r.total, 6);
          expect(r.fast).toBeGreaterThanOrEqual(0);
          expect(r.fast).toBeLessThanOrEqual(r.total);
        }
    expect(runoff(Number.NaN, -10, false).total).toBe(0);
  });
  it("warms the idealised surface with fixed incoming power and finite boundary values", () => {
    const cold = greenhouse(0),
      warm = greenhouse(78);
    expect(cold.surfaceCelsius).toBeCloseTo(-18.57, 1);
    expect(warm.surfaceCelsius).toBeGreaterThan(14);
    expect(warm.surfaceCelsius).toBeLessThan(16);
    expect(warm.absorbedSolar).toBe(cold.absorbedSolar);
    for (let p = 0; p <= 100; p++) expect(Number.isFinite(greenhouse(p).surfaceCelsius)).toBe(true);
    expect(greenhouse(100).surfaceCelsius).toBeGreaterThan(warm.surfaceCelsius);
  });
  it("conserves population and distinguishes natural and migration balances", () => {
    expect(populationBalance(10, 15, 30, 20)).toMatchObject({
      natural: -5,
      migration: 10,
      change: 5,
      end: 1005,
    });
    expect(populationBalance(10, 15, 10, 30).end).toBe(975);
    for (const values of [
      [0, 200, 0, 200],
      [200, 0, 200, 0],
      [10, 10, 10, 10],
      [NaN, -1, Infinity, 0],
    ]) {
      const b = populationBalance(...(values as [number, number, number, number]));
      expect(b.end).toBe(b.start + b.births - b.deaths + b.arrivals - b.departures);
      expect(b.end).toBeGreaterThanOrEqual(0);
    }
  });
  it("uses consistent invented comparison datasets", () => {
    for (const p of Object.values(AGE_PROFILES)) expect(p.reduce((s, v) => s + v, 0)).toBe(1000);
    for (const p of Object.values(CITY_PLANS)) expect(p.housing + p.transport + p.green).toBe(100);
    for (const p of Object.values(CLIMATE_PROFILES)) {
      expect(p.temperature).toHaveLength(12);
      expect(p.rain).toHaveLength(12);
    }
    expect(climateStats(CLIMATE_PROFILES.maritime).amplitude).toBeLessThan(
      climateStats(CLIMATE_PROFILES.continental).amplitude,
    );
  });
  it("shows 27 EU members and projects orientation points inside map bounds", () => {
    expect(EU_COUNTRIES).toHaveLength(27);
    expect(new Set(EU_COUNTRIES.map((c) => c[0])).size).toBe(27);
    expect(EU_COUNTRIES.some((c) => (c[0] as string) === "NOR")).toBe(false);
    expect(EU_COUNTRIES.some((c) => (c[0] as string) === "GBR")).toBe(false);
    for (const [bounds, points] of [
      [GERMANY_BOUNDS, Object.values(LANDMARKS).map((p) => [p.lon, p.lat])],
      [EUROPE_BOUNDS, EU_COUNTRIES.map((c) => [c[2], c[3]])],
    ] as const) {
      const size = mapSize(bounds);
      for (const [lon, lat] of points) {
        const p = mapPoint(lon, lat, bounds);
        expect(p.x).toBeGreaterThan(0);
        expect(p.x).toBeLessThan(size.x);
        expect(p.y).toBeGreaterThan(0);
        expect(p.y).toBeLessThan(size.y);
      }
    }
  });
  it.each(LESSONS.filter((l) => l.model))(
    "makes each required comparison reachable without accepting unknown ids: $id",
    (lesson) => {
      const kind = lesson.model!;
      let visited: string[] = [];
      let state = initialModelState(kind);
      expect(modelReady(kind, visited)).toBe(false);
      for (const scenario of MODEL_SCENARIOS[kind]) {
        visited = recordExploration(kind, visited, scenario.id);
        state = applyScenario(kind, state, scenario.id);
      }
      expect(modelReady(kind, visited)).toBe(true);
      expect(recordExploration(kind, visited, "unknown")).toEqual(visited);
      expect(renderModel(lesson, visited, state)).toContain("Alle Vergleichssituationen geöffnet");
    },
  );
});
describe("actual local research with formal validation", () => {
  it("requires real questions, dated different sources, map context and an argument in sequence", () => {
    expect(projectReady(freshProject(), "question", today)).toBe(false);
    const p = filledProject();
    expect(projectReady(p, "judgment", today)).toBe(true);
    p.sourceB = p.sourceA + "#fragment";
    expect(missingProjectFields(p, "evidence", today)).toContain("sourceB");
    p.sourceB = "https://example.org/other";
    p.question = "";
    expect(projectReady(p, "judgment", today)).toBe(false);
  });
  it("rejects impossible or future dates without imposing a false age limit on ongoing issues", () => {
    expect(validProjectDate("2026-02-30", today)).toBe(false);
    expect(validProjectDate("2026-10-21", today)).toBe(false);
    expect(validProjectDate("2024-02-29", today)).toBe(true);
    expect(validProjectDate("2026-10-20", today)).toBe(true);
    expect(validProjectDate("20.10.2026", today)).toBe(false);
  });
  it("uses the learner's local calendar day, not the UTC date, as today", () => {
    // Vitest runs in Node; the app has no Node types, so reach the env through globalThis.
    const env = (globalThis as unknown as { process: { env: Record<string, string | undefined> } })
      .process.env;
    const tz = env.TZ;
    env.TZ = "Europe/Berlin";
    vi.useFakeTimers();
    try {
      // 00:30 on 21 October in Germany (CEST) is still 20 October in UTC.
      vi.setSystemTime(new Date("2026-10-20T22:30:00Z"));
      expect(localDateString()).toBe("2026-10-21");
      expect(validProjectDate("2026-10-21")).toBe(true);
      expect(validProjectDate("2026-10-22")).toBe(false);
    } finally {
      vi.useRealTimers();
      if (tz === undefined) delete env.TZ;
      else env.TZ = tz;
    }
  });
  it("accepts ordinary source URLs and drops unknown or oversized fields", () => {
    for (const url of [
      "javascript:alert(1)",
      "file:///secret",
      "data:text/html,test",
      "https://user:pass@example.org/",
      "not a URL",
    ])
      expect(sourceUrl(url)).toBeNull();
    expect(sourceUrl("https://example.org/article#paragraph")).toBe("https://example.org/article");
    const p = sanitizeProject({ unknown: "secret", question: "x".repeat(5000) });
    expect(p.question).toHaveLength(4000);
    expect("unknown" in p).toBe(false);
  });
  it("does not complete the local project with quiz and model answers alone", () => {
    const p = freshProgress(),
      l = CORE_LESSONS.find((l) => l.projectStep === "judgment")!;
    p.quizDone.push(l.id);
    p.workshopDone.push(l.id);
    p.writingDone.push(writingKey(l.id, 1));
    expect(isComplete(p, l.id)).toBe(false);
    p.project = filledProject();
    expect(isComplete(p, l.id)).toBe(true);
    p.project.findings = "";
    expect(isComplete(p, l.id)).toBe(false);
  });
});
