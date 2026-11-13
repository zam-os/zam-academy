import { describe, expect, it, vi } from "vitest";
import { CORE_LESSONS } from "../src/curriculum";
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
const today = "2026-10-20";
function filledProject(): GeoProject {
	return {
		place: "Öffentlicher Beispielort",
		event: "Ein aktuell beratenes Vorhaben im öffentlichen Raum.",
		eventDate: "2026-10-18",
		question:
			"Wie verändert das Vorhaben die Erreichbarkeit im untersuchten Gebiet?",
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
		const env = (
			globalThis as unknown as {
				process: { env: Record<string, string | undefined> };
			}
		).process.env;
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
		expect(sourceUrl("https://example.org/article#paragraph")).toBe(
			"https://example.org/article",
		);
		const p = sanitizeProject({
			unknown: "secret",
			question: "x".repeat(5000),
		});
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
