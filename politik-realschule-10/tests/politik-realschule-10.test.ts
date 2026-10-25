import { describe, expect, it, vi } from "vitest";
import registry from "../../academy.json";
import tileData from "../cell.json";
import coverage from "../coverage.json";
import { LESSONS, SOURCES, STAGES } from "../src/curriculum";
import {
	councilResult,
	formatNumber,
	productResult,
	renderLab,
} from "../src/labs";
import {
	canAccept,
	canReview,
	checkCases,
	esc,
	quizOptions,
} from "../src/practice";
import {
	completion,
	freshProgress,
	isComplete,
	loadProgress,
	parseProgress,
	saveProgress,
	updateDraft,
	writingKey,
} from "../src/storage/progress";
import { parseTrainingDeepLink, trainingBaseUrl } from "../src/zam/zam-link";
import contract from "./fixtures/public-contract.json";

const tile = tileData;

describe("Lernpfad und veröffentlichbarer Vertrag", () => {
	it("pins 32 unique lesson anchors and all 96 ULIDs independently", () => {
		expect(LESSONS.map((l) => l.id)).toEqual(contract.lessons);
		expect(LESSONS).toHaveLength(32);
		expect(new Set(LESSONS.map((l) => l.id)).size).toBe(32);
		const ids = tile.atoms.flatMap((a) => [
			a.id,
			...a.practice_items.map((i) => i.id),
		]);
		expect(ids.sort()).toEqual(Object.values(contract.ids).sort());
		expect(new Set(ids).size).toBe(96);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
	});
	it("does not transfer or retire existing histories", () => {
		expect("retired_items" in tile).toBe(false);
		for (const atom of tile.atoms)
			for (const item of atom.practice_items)
				expect("replaces" in item).toBe(false);
	});
	it("traces 27 expectations to real lessons and matching sections, with limits", () => {
		expect(coverage.rows).toHaveLength(27);
		expect(
			new Set(coverage.rows.map((e) => `${e.lb}.${e.position}`)).size,
		).toBe(27);
		expect([...new Set(coverage.rows.map((e) => e.lb))]).toHaveLength(4);
		expect(new Set(coverage.rows.flatMap((row) => row.lessons))).toEqual(
			new Set(LESSONS.map((lesson) => lesson.id)),
		);
		expect(coverage.learning_areas.map((area) => area.hours)).toEqual([
			null,
			14,
			14,
			20,
		]);
		for (const row of coverage.rows) {
			expect(row.additional.length).toBeGreaterThan(15);
			expect(["guided", "preparation"]).toContain(row.support);
			for (const id of row.lessons)
				expect(LESSONS.find((l) => l.id === id)?.bindings).toContain(
					String(row.lb),
				);
		}
		expect(
			STAGES.map((stage) => LESSONS.filter((l) => l.stage === stage.id).length),
		).toEqual([6, 8, 10, 8]);
	});
	it.each(LESSONS.map((l) => [l.id, l] as const))(
		"%s has reachable checks, distinct tasks and a consistent cell",
		(_, lesson) => {
			expect(SOURCES.map((s) => s.id)).toEqual(
				expect.arrayContaining(lesson.sourceIds),
			);
			expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(2);
			expect(quizOptions(lesson).sort()).toEqual(
				[lesson.quiz.answer, ...lesson.quiz.wrong].sort(),
			);
			expect(new Set(quizOptions(lesson)).size).toBe(3);
			expect(lesson.quiz.explanation.length).toBeGreaterThan(40);
			expect(lesson.cases).toHaveLength(2);
			for (const c of lesson.cases) {
				expect(c.options).toContain(c.answer);
				expect(new Set(c.options).size).toBe(c.options.length);
				expect(c.feedback.length).toBeGreaterThan(25);
			}
			expect(
				checkCases(
					lesson.cases,
					lesson.cases.map((c) => c.answer),
				),
			).toEqual([true, true]);
			expect(checkCases(lesson.cases, [])).toEqual([false, false]);
			expect(
				checkCases(
					lesson.cases,
					lesson.cases.map((c) => c.options.find((o) => o !== c.answer) ?? ""),
				),
			).toEqual([false, false]);
			expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
			expect(lesson.tasks[1].model).not.toBe(lesson.tasks[2].model);
			expect(lesson.tasks[1].criteria).not.toEqual(lesson.tasks[2].criteria);
			for (const level of [1, 2] as const) {
				expect(lesson.tasks[level].criteria).toHaveLength(3);
				expect(canReview(lesson.tasks[level].model)).toBe(true);
			}
			const atom = tile.atoms.find((a) => a.slug === lesson.id);
			if (!atom) throw new Error("Missing atom");
			const [fast, recall] = atom.practice_items;
			const fastCheck = fast.fast_check;
			if (!fastCheck) throw new Error("Missing fast check");
			expect(fast.question).toBe(lesson.quiz.question);
			expect(fast.concept).toBe(lesson.quiz.answer);
			expect(fastCheck.options[fastCheck.correct_index]).toBe(fast.concept);
			expect(recall.question.length).toBeGreaterThan(15);
			expect(recall.concept).toBe(lesson.takeaway);
			expect(recall.sample_solution).toBe(recall.concept);
			expect(fastCheck.correct_index).toBe(0);
			for (const item of atom.practice_items)
				expect(item.source_link).toBe(
					`https://academy.zam-os.org/politik-realschule-10/#lesson=${lesson.id}`,
				);
			const expectedAreas = [
				...new Set(lesson.bindings.map((b) => `lb${b[0]}`)),
			];
			const bindings = atom.curricula.filter(
				(c) => c.provider === "lehrplanplus-bayern",
			);
			expect(bindings.map((c) => c.topic_code)).toEqual(expectedAreas);
			for (const binding of bindings)
				expect(binding).toMatchObject({
					grade: 10,
					subject: "pug",
					school_type: "realschule",
				});
		},
	);
	it("varies answer positions across both checks and cases", () => {
		expect(
			new Set(LESSONS.map((l) => quizOptions(l).indexOf(l.quiz.answer))).size,
		).toBe(3);
		expect(
			new Set(
				LESSONS.flatMap((l) => l.cases.map((c) => c.options.indexOf(c.answer))),
			).size,
		).toBe(2);
	});
});

describe("Fortschritt mit getrennter Selbsteinschätzung", () => {
	const lesson = LESSONS[0];
	function completed() {
		const p = freshProgress();
		p.quizDone.push(lesson.id);
		p.cases[lesson.id] = lesson.cases.map((c) => c.answer);
		updateDraft(
			p,
			lesson.id,
			1,
			"Meine eigene ausführliche Antwort mit einer Begründung.",
		);
		p.writingDone.push(writingKey(lesson.id, 1));
		return p;
	}
	it("requires every evidence component and uses the selected level", () => {
		const p = completed();
		expect(isComplete(p, lesson.id)).toBe(true);
		expect(completion(p)).toEqual({ completed: 1, total: 32 });
		p.level = 2;
		expect(isComplete(p, lesson.id)).toBe(false);
		p.level = 1;
		p.cases[lesson.id][0] = "wrong";
		expect(isComplete(p, lesson.id)).toBe(false);
		p.cases[lesson.id] = lesson.cases.map((c) => c.answer);
		p.quizDone = [];
		expect(isComplete(p, lesson.id)).toBe(false);
	});
	it("invalidates only the edited draft and preserves level separation on reload", () => {
		const p = completed();
		updateDraft(
			p,
			lesson.id,
			2,
			"Ein anderer Transfertext auf dem zweiten Niveau.",
		);
		p.writingDone.push(writingKey(lesson.id, 2));
		updateDraft(
			p,
			lesson.id,
			1,
			"Mein geänderter Entwurf braucht einen neuen Vergleich.",
		);
		expect(isComplete(p, lesson.id, 1)).toBe(false);
		expect(isComplete(p, lesson.id, 2)).toBe(true);
		const restored = parseProgress(JSON.stringify(p));
		expect(restored).toEqual(p);
		expect(isComplete(restored, lesson.id, 2)).toBe(true);
	});
	it("does not invalidate an unchanged draft, and cannot accept empty criteria", () => {
		const p = completed();
		updateDraft(p, lesson.id, 1, p.drafts[writingKey(lesson.id, 1)]);
		expect(isComplete(p, lesson.id)).toBe(true);
		expect(
			canAccept("Eine genügend lange eigene Antwort.", [true, true, false]),
		).toBe(false);
		expect(canAccept("Eine genügend lange eigene Antwort.", [])).toBe(false);
		expect(canAccept("kurz", [true, true, true])).toBe(false);
		expect(
			canAccept("Eine genügend lange eigene Antwort.", [true, true, true]),
		).toBe(true);
	});
	it.each(["{", "null", "[]", "7", '"text"'])(
		"recovers from invalid stored data: %s",
		(raw) => {
			expect(parseProgress(raw)).toEqual(freshProgress());
		},
	);
	it("drops unknown keys, invalid selections, duplicate evidence and empty drafts", () => {
		const key = writingKey(lesson.id, 1);
		const p = parseProgress(
			JSON.stringify({
				level: 7,
				quizDone: [lesson.id, lesson.id, "unknown"],
				cases: { [lesson.id]: ["<script>", 123], unknown: ["yes"] },
				drafts: { [key]: "", unknown: "x" },
				writingDone: [key, "unknown"],
			}),
		);
		expect(p.level).toBe(1);
		expect(p.quizDone).toEqual([lesson.id]);
		expect(p.cases).toEqual({ [lesson.id]: ["", ""] });
		expect(p.writingDone).toEqual([]);
		expect(isComplete(p, lesson.id)).toBe(false);
	});
});

describe("Gesperrter Browserspeicher", () => {
	it("keeps the visit usable and reports save failure", () => {
		vi.stubGlobal("localStorage", {
			getItem() {
				throw new Error("blocked");
			},
			setItem() {
				throw new Error("blocked");
			},
		});
		try {
			expect(loadProgress()).toEqual(freshProgress());
			expect(saveProgress(freshProgress())).toBe(false);
		} finally {
			vi.unstubAllGlobals();
		}
	});
});

describe("Navigation und sichere Textdarstellung", () => {
	it("accepts fragment and query links with fragment precedence", () => {
		expect(
			parseTrainingDeepLink(
				"#lesson=p10-bip&level=2",
				"?lesson=p10-quellen&level=1",
			),
		).toEqual({ lessonId: "p10-bip", level: 2 });
		expect(parseTrainingDeepLink("", "?lesson=p10-quellen")).toEqual({
			lessonId: "p10-quellen",
		});
		expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=9")).toEqual({});
	});
	it("removes old query routes when going back to the path", () => {
		expect(
			trainingBaseUrl(
				"/politik-realschule-10/",
				"?lesson=p10-bip&level=2&from=zam",
			),
		).toBe("/politik-realschule-10/?from=zam");
	});
	it("renders user drafts as text even if they contain markup", () => {
		expect(esc('<img src=x onerror="run()"> &')).toBe(
			"&lt;img src=x onerror=&quot;run()&quot;&gt; &amp;",
		);
	});
});

describe("Zwei verschiedene Kompromisse und klare Modellgrenzen", () => {
	it("finds all three two-group compromises and refuses spending beyond 100", () => {
		expect(councilResult({ bus: 40, green: 40, culture: 20 })).toMatchObject({
			votes: 75,
			majority: true,
			remaining: 0,
		});
		expect(councilResult({ bus: 40, green: 20, culture: 40 })).toMatchObject({
			votes: 65,
			majority: true,
		});
		expect(councilResult({ bus: 20, green: 40, culture: 40 })).toMatchObject({
			votes: 60,
			majority: true,
		});
		expect(councilResult({ bus: 40, green: 40, culture: 40 })).toMatchObject({
			affordable: false,
			votes: 0,
			majority: false,
		});
		expect(councilResult({ bus: 30, green: 30, culture: 30 })).toMatchObject({
			votes: 0,
			majority: false,
			remaining: 10,
		});
	});
	it.each([-1, NaN, Infinity, 101, 0.5])(
		"rejects invalid allocation %s",
		(bus) => {
			expect(councilResult({ bus, green: 20, culture: 20 }).majority).toBe(
				false,
			);
		},
	);
	it("never gives all groups their minimum within budget", () => {
		for (let bus = 0; bus <= 100; bus += 10)
			for (let green = 0; green <= 100; green += 10)
				for (let culture = 0; culture <= 100; culture += 10) {
					const result = councilResult({ bus, green, culture });
					expect(result.votes).toBeLessThan(100);
					if (result.majority) expect(result.total).toBeLessThanOrEqual(100);
				}
	});
	it("separates equal nominal values with different real production", () => {
		expect(productResult(100, 12)).toMatchObject({
			nominal: 1200,
			real: 1000,
			realChange: 0,
		});
		expect(productResult(120, 10)).toMatchObject({
			nominal: 1200,
			real: 1200,
			realChange: 20,
		});
		expect(productResult(0, 0)).toMatchObject({
			nominal: 0,
			real: 0,
			realChange: -100,
		});
	});
	it.each([
		[NaN, 12],
		[100, Infinity],
		[-1, 10],
		[201, 10],
		[100, 31],
	])("refuses invalid product inputs %s / %s", (q, p) => {
		expect(productResult(q, p)).toBe(null);
	});
	it("includes only local accessible illustration and bounded labs", () => {
		expect(renderLab("p10-satire")).toContain('role="img"');
		expect(renderLab("p10-debatte")).toContain('max="100"');
		expect(renderLab("p10-bip")).toContain('max="200"');
		expect(renderLab("p10-verfassung")).toBe("");
	});
});

describe("Reviewregression: Fachangebot und Zahlendarstellung", () => {
	it("keeps PuG 8 at Gymnasium but excludes the five non-subject school fields", () => {
		expect(registry.faecher.find((subject) => subject.id === "pug")?.from).toBe(
			8,
		);
		const absent = registry.kein_unterricht.filter(
			(entry) => entry.fach === "pug",
		);
		expect(
			absent.map((entry) => `${entry.school}:${entry.grade}`).sort(),
		).toEqual([
			"mittelschule:10",
			"mittelschule:8",
			"mittelschule:9",
			"realschule:8",
			"realschule:9",
		]);
		for (const entry of absent) {
			expect(entry.note.length).toBeGreaterThan(20);
			expect(entry.source).toBe(
				`https://www.gesetze-bayern.de/Content/Document/${entry.school === "realschule" ? "BayRSO" : "BayMSO"}-ANL_1`,
			);
		}
		expect(
			registry.pakete.find((pkg) => pkg.app === "politik-realschule-10"),
		).toMatchObject({ fach: "pug", grade: 10, school: "realschule" });
	});
	it("uses the German decimal comma and real minus sign for declining model values", () => {
		expect(formatNumber(-40)).toBe("−40");
		expect(formatNumber(-0.5)).toBe("−0,5");
		expect(formatNumber(12.5)).toBe("12,5");
	});
});
