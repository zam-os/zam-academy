import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import publication from "../publication.json";
import { findLesson, LESSONS, quizOptions, STAGES } from "../src/curriculum";
import { lessonLink, parseDeepLink } from "../src/zam/zam-link";
import contract from "./fixtures/public-contract.json";
import official from "./fixtures/official-curriculum.json";

const positions = new Set(
	official.expectations.map((e) => `${e.section}-${String(e.position).padStart(2, "0")}`),
);

describe("Lernpfad", () => {
	it("pins the 45 lesson ids in their order", () => {
		expect(LESSONS.map((l) => l.id)).toEqual(contract.lessons);
		expect(new Set(LESSONS.map((l) => l.id)).size).toBe(45);
		for (const l of LESSONS) expect(l.id).toMatch(/^[a-z0-9-]{1,64}$/);
	});

	it("gives every station its lessons, an own accent and a greeting", () => {
		expect(STAGES.map((s) => s.id)).toEqual(["werkstatt", "bahnhof", "detektiv", "woerterschatz", "lesewerkstatt", "schreibwerkstatt", "sprachlabor"]);
		expect(STAGES.map((s) => LESSONS.filter((l) => l.stage === s.id).length)).toEqual([9, 7, 7, 3, 7, 8, 4]);
		for (const s of STAGES) expect(s.greeting.length).toBeGreaterThan(20);
	});

	it("explains every lesson with example, rule, terms and a sticker", () => {
		for (const l of LESSONS) {
			expect(l.paragraphs.length, l.id).toBeGreaterThanOrEqual(2);
			expect(l.example.lines.length, l.id).toBeGreaterThanOrEqual(3);
			expect(l.takeaway.length, l.id).toBeGreaterThan(30);
			expect(l.terms.length, l.id).toBeGreaterThanOrEqual(1);
			expect(l.sticker.emoji.length, l.id).toBeGreaterThan(0);
			expect(l.lehrplan, l.id).toMatch(/^D3\/4 /);
			expect(l.requiredCorrect, l.id).toBe(3);
			for (const p of l.paragraphs) expect(p, l.id).not.toMatch(/<[a-z]/i);
		}
		expect(new Set(LESSONS.map((l) => l.sticker.name)).size).toBe(45);
	});

	it("asks every quick check with three different answers taken from its card", () => {
		for (const l of LESSONS) {
			const options = quizOptions(l);
			expect(new Set(options).size, l.id).toBe(3);
			expect(options, l.id).toContain(l.quiz.answer);
			const atom = cell.atoms.find((a) => a.slug === `gs4d-${l.id}`);
			expect(atom?.practice_items[0].question, l.id).toBe(l.quiz.question);
			expect(l.quiz.explanation.length, l.id).toBeGreaterThan(20);
		}
		// The right answer is not always in the same place.
		const places = new Set(LESSONS.map((l) => quizOptions(l).indexOf(l.quiz.answer)));
		expect(places.size).toBe(3);
	});

	it("binds lessons only to official positions", () => {
		for (const l of LESSONS) {
			expect(l.bindings.length, l.id).toBeGreaterThan(0);
			for (const b of l.bindings) expect(positions.has(b), `${l.id}: ${b}`).toBe(true);
		}
	});

	it("parses deep links and builds card links", () => {
		expect(parseDeepLink("#lesson=vier-faelle&level=2")).toEqual({ lessonId: "vier-faelle", level: 2 });
		expect(parseDeepLink("#lesson=<script>")).toEqual({});
		expect(parseDeepLink("#view=heft")).toEqual({ view: "heft" });
		expect(lessonLink("zeitformen")).toBe("https://academy.zam-os.org/deutsch-grundschule-4/#lesson=zeitformen");
		expect(findLesson("gibt-es-nicht")).toBeUndefined();
	});
});

describe("Lehrplanabgleich", () => {
	it("keeps all 116 official expectations of Deutsch 3/4 verbatim", () => {
		expect(official.expectations).toHaveLength(116);
		expect(coverage.rows).toHaveLength(116);
		coverage.rows.forEach((row, i) => {
			const e = official.expectations[i];
			expect(row.competence).toBe(e.competence);
			expect(row.section).toBe(e.section);
			expect(row.position).toBe(e.position);
			expect(row.lb).toBe(Number(e.section[0]));
		});
		const sections = new Set(official.expectations.map((e) => e.section));
		expect(sections.size).toBe(17);
	});

	it("maps every lesson to a competence and marks every gap honestly", () => {
		const ids = new Set(LESSONS.map((l) => l.id));
		for (const row of coverage.rows) {
			for (const id of row.lessons) expect(ids.has(id), id).toBe(true);
			expect(["partial", "planned", "outside-app"]).toContain(row.status);
			expect(row.lessons.length > 0, `${row.section}.${row.position}`).toBe(row.status === "partial");
			expect(row.evidence.length).toBeGreaterThan(20);
		}
		const used = new Set(coverage.rows.flatMap((r) => r.lessons));
		for (const id of ids) expect(used.has(id), id).toBe(true);
		for (const l of LESSONS)
			for (const b of l.bindings) {
				const [section, position] = b.split("-");
				const row = coverage.rows.find((r) => r.section === section && r.position === Number(position));
				expect(row?.lessons, `${l.id}: ${b}`).toContain(l.id);
			}
		expect(coverage.full_coverage).toBe(false);
		expect(coverage.review_status).toBe("awaiting-primary-teacher");
	});

	it("covers every expectation of 4.3 and all strategy positions of 4.4", () => {
		const row = (s: string, p: number) => coverage.rows.find((r) => r.section === s && r.position === p);
		for (let p = 1; p <= 15; p++) expect(row("4.3", p)?.status, `4.3.${p}`).toBe("partial");
		for (let p = 8; p <= 17; p++) expect(row("4.4", p)?.status, `4.4.${p}`).toBe("partial");
		expect(row("4.4", 1)?.lessons).toEqual(["grundwortschatz-regeln", "grundwortschatz-formen", "grundwortschatz-merkwoerter"]);
	});

	it("is published as a preview", () => {
		expect(publication).toMatchObject({ schema: 1, status: "preview" });
	});
});
