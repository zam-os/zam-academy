import { describe, expect, it, vi } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import { CORE_LESSONS, LESSONS, SOURCES, STAGES } from "../src/curriculum";
import { localEnglishVoices } from "../src/listening";
import {
	canAccept,
	checkPractice,
	esc,
	normalise,
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
import {
	lessonLink,
	parseTrainingDeepLink,
	trainingBaseUrl,
	ZAM_CELL_ID,
} from "../src/zam/zam-link";
import legacy from "./fixtures/de-by-realschule-10-englisch-abschlusspruefung-text-production-mediation-kvt.json";
import contract from "./fixtures/public-contract.json";

function required<T>(value: T | undefined): T {
	if (value === undefined) throw new Error("Missing lesson or card fixture");
	return value;
}
const items = cell.atoms.flatMap((atom) => atom.practice_items);
const oldItems = legacy.atoms.flatMap((atom) =>
	atom.practice_items.map((item) => ({ id: item.id, question: item.question })),
);

describe("curriculum, cards and public lesson links", () => {
	it("keeps the thematic path distinct from all official competency areas", () => {
		expect(CORE_LESSONS).toHaveLength(46);
		expect(LESSONS).toHaveLength(46);
		expect(
			STAGES.map(
				(stage) => LESSONS.filter((lesson) => lesson.stage === stage.id).length,
			),
		).toEqual([6, 6, 6, 4, 4, 12, 4, 4]);
		expect(new Set(coverage.areas.flatMap((area) => area.lessons))).toEqual(
			new Set(CORE_LESSONS.map((lesson) => lesson.id)),
		);
		for (const area of coverage.areas)
			for (const id of area.lessons)
				expect(LESSONS.find((lesson) => lesson.id === id)?.bindings).toContain(
					area.code,
				);
		for (const lesson of CORE_LESSONS)
			for (const code of lesson.bindings)
				expect(
					coverage.areas.find((area) => area.code === code)?.lessons,
				).toContain(lesson.id);
		expect(coverage.optional_lessons).toEqual([]);
		expect(
			coverage.areas.find((area) => area.code === "1.1-hoeren")?.status,
		).toBe("partial");
		expect(
			coverage.areas.find((area) => area.code === "1.2-wortschatz")?.status,
		).toBe("partial");
	});
	it("traces each competency and theme row with evidence and explicit limits", () => {
		expect(coverage.rows).toHaveLength(40);
		expect(new Set(coverage.rows.map((row) => row.code)).size).toBe(40);
		expect(new Set(coverage.rows.flatMap((row) => row.lessons))).toEqual(
			new Set(CORE_LESSONS.map((lesson) => lesson.id)),
		);
		for (const row of coverage.rows) {
			expect(row.curriculum_text.length).toBeGreaterThan(40);
			expect(row.evidence.length).toBeGreaterThan(20);
			expect(row.additional.length).toBeGreaterThan(20);
			expect(row.lessons.length).toBeGreaterThan(0);
			for (const id of row.lessons)
				expect(LESSONS.find((lesson) => lesson.id === id)?.bindings).toContain(
					row.area,
				);
		}
		expect(
			coverage.rows
				.filter((row) => "hours_approx" in row)
				.map((row) => row.hours_approx),
		).toEqual([20, 20, 20, 20, 8, 5]);
		expect(
			coverage.neighbouring_grades.map((grade) => [
				grade.grade,
				grade.school_type,
			]),
		).toEqual([
			[9, "realschule"],
			[11, "fos"],
		]);
	});
	it.each(LESSONS)(
		"contains usable material and distinct production tasks: $id",
		(lesson) => {
			expect(lesson.paragraphs).toHaveLength(2);
			expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(450);
			expect(lesson.takeaway.length).toBeGreaterThan(20);
			expect(lesson.material.length).toBeGreaterThan(250);
			expect(lesson.practice).toHaveLength(3);
			expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
			for (const id of lesson.sourceIds)
				expect(SOURCES.find((source) => source.id === id)?.url).toMatch(
					/^https:\/\//,
				);
			expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
			expect(lesson.tasks[1].model).not.toBe(lesson.tasks[2].model);
			for (const task of Object.values(lesson.tasks)) {
				expect(task.criteria).toHaveLength(3);
				expect(task.model.length).toBeGreaterThan(160);
			}
		},
	);
	it("pins 138 distinct ULIDs and all 46 lesson anchors independently", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(cell.version).toBe("2026.10.1");
		expect(cell.published_at).toMatch(/^2026-10-25T/);
		expect(cell.atoms).toHaveLength(46);
		expect(items).toHaveLength(92);
		expect(
			cell.atoms.map((atom) => ({
				id: atom.id,
				slug: atom.slug,
				lesson: atom.source_link,
				items: atom.practice_items.map((item) => ({
					id: item.id,
					slug: item.slug,
				})),
			})),
		).toEqual(contract);
		const ids = [...cell.atoms, ...items].map((entry) => entry.id);
		expect(new Set(ids).size).toBe(138);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
		expect(LESSONS.map((lesson) => lessonLink(lesson.id))).toEqual(
			contract.map((entry) => entry.lesson),
		);
	});
	it.each(LESSONS)(
		"binds sources, exam relevance, prerequisites and two standalone cards: $id",
		(lesson) => {
			const atom = required(
				cell.atoms.find((entry) => entry.slug === lesson.id),
			);
			expect(atom.source_link).toBe(lessonLink(lesson.id));
			expect([
				"englisch/writing",
				"englisch/grammar",
				"englisch/landeskunde",
				"englisch/literatur",
			]).toContain(atom.domain);
			const bindings = atom.curricula.filter(
				(entry) => entry.provider === "lehrplanplus-bayern",
			);
			expect(new Set(bindings.map((entry) => entry.topic_code))).toEqual(
				new Set(lesson.bindings.map((code) => `lb${code[0]}`)),
			);
			for (const binding of bindings) {
				expect(binding).toMatchObject({
					school_type: "realschule",
					grade: 10,
					subject: "englisch",
					exam_relevant: true,
				});
				expect("track" in binding).toBe(false);
			}
			expect(atom.practice_items[0]).toMatchObject({
				question: lesson.quiz.question,
				concept: lesson.quiz.answer,
				language: "en",
			});
			const fast = required(atom.practice_items[0].fast_check);
			expect(fast.correct_index).toBe(0);
			expect(fast.options).toHaveLength(2);
			expect(fast.options[0]).toBe(lesson.quiz.answer);
			expect(fast.options[1]).toBe(lesson.quiz.wrong[0]);
			expect(atom.practice_items[1].sample_solution?.length).toBeGreaterThan(
				atom.practice_items[1].concept.length,
			);
			for (const item of atom.practice_items) {
				expect(item.source_link).toBe(lessonLink(lesson.id));
				expect(item.materiality).toBe("material");
				expect(item.language).toBe("en");
				expect("replaces" in item).toBe(false);
			}
			for (const edge of atom.prerequisites)
				expect(
					cell.atoms.some((candidate) => candidate.id === edge.atom_id),
				).toBe(true);
		},
	);
	it("keeps supplied chart values and accessibility labels attached to their lesson", () => {
		const charts = LESSONS.filter((lesson) => lesson.graphic);
		expect(charts.map((lesson) => lesson.id)).toEqual([
			"e10-water-reading",
			"e10-energy",
			"e10-data-visuals",
		]);
		for (const lesson of charts) {
			const chart = required(lesson.graphic);
			expect(chart.title.length).toBeGreaterThan(5);
			expect(chart.unit.length).toBeGreaterThan(1);
			expect(chart.values).toHaveLength(3);
			for (const entry of chart.values) {
				expect(Number.isFinite(entry.value)).toBe(true);
				expect(entry.value).toBeGreaterThan(0);
				expect(lesson.material).toContain(String(entry.value));
			}
		}
	});
	it("does not carry forward blanket bans or overstate the authentic reading", () => {
		const complaint = required(
			LESSONS.find((lesson) => lesson.id === "e10-complaint"),
		);
		expect(complaint.paragraphs.join(" ")).toContain(
			"kein allgemeines Prüfungsverbot",
		);
		const reading = required(
			LESSONS.find((lesson) => lesson.id === "e10-mansfield"),
		);
		expect(reading.materialLabel).toContain("Originaltext");
		expect(reading.tasks[2].prompt).toContain("Do not invent references");
	});
});
describe("practice and honest self-assessment", () => {
	it.each(LESSONS)(
		"checks authored short answers and rejects incomplete input: $id",
		(lesson) => {
			const correct = lesson.practice.map((item) => item.answers[0]);
			expect(checkPractice(lesson.practice, correct)).toEqual([
				true,
				true,
				true,
			]);
			for (const [index, item] of lesson.practice.entries())
				for (const alternative of item.answers) {
					const changed = [...correct];
					changed[index] = `${alternative.toUpperCase()}.`;
					expect(checkPractice(lesson.practice, changed).every(Boolean)).toBe(
						true,
					);
				}
			for (const answers of [
				[],
				correct.slice(1),
				[...correct, "extra"],
				correct.map(() => ""),
			])
				expect(checkPractice(lesson.practice, answers).every(Boolean)).toBe(
					false,
				);
		},
	);
	it("normalises typography without accepting different grammar", () => {
		expect(normalise("  I’m   READY. ")).toBe("i'm ready");
		const practice = [
			{ prompt: "past", answers: ["worked"], feedback: "past" },
		];
		expect(checkPractice(practice, ["work"])).toEqual([false]);
		expect(
			canAccept("A meaningful original explanation.", [true, true, true]),
		).toBe(true);
		expect(
			canAccept("A meaningful original explanation.", [true, false, true]),
		).toBe(false);
		expect(canAccept("short", [true, true, true])).toBe(false);
		expect(esc('<img src=x onerror="alert(1)">')).toBe(
			"&lt;img src=x onerror=&quot;alert(1)&quot;&gt;",
		);
		expect(
			new Set(
				LESSONS.map((lesson) =>
					quizOptions(lesson).indexOf(lesson.quiz.answer),
				),
			).size,
		).toBe(3);
	});
	it("only offers local English speech and never treats a remote voice as a fallback", () => {
		const voice = (lang: string, localService: boolean) =>
			({ lang, localService }) as SpeechSynthesisVoice;
		const remote = voice("en-AU", false),
			german = voice("de-DE", true),
			english = voice("en-GB", true),
			australian = voice("en-AU", true);
		expect(localEnglishVoices([remote, german, english, australian])).toEqual([
			english,
			australian,
		]);
		expect(localEnglishVoices([remote, german])).toEqual([]);
		expect(LESSONS.filter((lesson) => lesson.listening)).toHaveLength(3);
		expect(
			LESSONS.filter((lesson) => lesson.listening).every(
				(lesson) => lesson.material.length > 600,
			),
		).toBe(true);
	});
});
describe("local progress and routes", () => {
	it("requires all three steps at level 1 and leaves transfer and refreshers separate", () => {
		const p = freshProgress(),
			id = CORE_LESSONS[0].id;
		p.quizDone.push(id);
		p.practiceDone.push(id);
		updateDraft(
			p,
			id,
			2,
			"A sufficiently detailed original transfer response.",
		);
		p.writingDone.push(writingKey(id, 2));
		expect(isComplete(p, id)).toBe(false);
		updateDraft(
			p,
			id,
			1,
			"A sufficiently detailed original level one response.",
		);
		p.writingDone.push(writingKey(id, 1));
		expect(isComplete(p, id)).toBe(true);
		expect(completion(p)).toEqual({ completed: 1, total: 46, percent: 2 });
		expect(completion(p, true).total).toBe(46);
	});
	it("requires a listening activity as well as written answers on a listening lesson", () => {
		const p = freshProgress(),
			id = "e10-abroad-listening";
		p.quizDone.push(id);
		p.practiceDone.push(id);
		updateDraft(
			p,
			id,
			1,
			"I listened first and then wrote these original notes.",
		);
		p.writingDone.push(writingKey(id, 1));
		expect(isComplete(p, id)).toBe(false);
		p.listening[id] = { synthetic: false, partner: true };
		expect(isComplete(p, id)).toBe(true);
	});
	it("invalidates only the edited draft’s old assessment and round trips all meaningful state", () => {
		const p = freshProgress(),
			id = p.activeLessonId,
			key = writingKey(id, 1),
			transfer = writingKey(id, 2);
		updateDraft(p, id, 1, "A sufficiently detailed original answer.");
		updateDraft(p, id, 2, "A sufficiently detailed original transfer.");
		p.writingDone.push(key, transfer);
		p.listening["e10-abroad-listening"] = { synthetic: false, partner: true };
		expect(parseProgress(JSON.stringify(p))).toEqual(p);
		updateDraft(p, id, 1, "A changed sufficiently detailed original answer.");
		expect(p.writingDone).toEqual([transfer]);
	});
	it("filters malformed, oversized and unknown persisted values", () => {
		const base = freshProgress(),
			key = writingKey(base.activeLessonId, 1);
		const p = parseProgress(
			JSON.stringify({
				...base,
				activeLessonId: "unknown",
				level: 9,
				quizDone: [base.activeLessonId, base.activeLessonId, "unknown"],
				drafts: { [key]: "x".repeat(9000), unknown: "bad" },
				writingDone: [key, "unknown"],
				listening: {
					"e10-abroad-listening": "remote",
					"e10-meeting-listening": "partner",
					unknown: "partner",
				},
			}),
		);
		expect(p.activeLessonId).toBe(base.activeLessonId);
		expect(p.level).toBe(1);
		expect(p.quizDone).toEqual([base.activeLessonId]);
		expect(p.drafts[key]).toHaveLength(8000);
		expect(p.drafts.unknown).toBeUndefined();
		expect(p.writingDone).toEqual([key]);
		expect(p.listening).toEqual({
			"e10-meeting-listening": { synthetic: false, partner: true },
		});
	});
	it.each([null, "null", "[]", "22", "{", '"string"'])(
		"recovers from invalid storage: %s",
		(raw) => expect(parseProgress(raw)).toEqual(freshProgress()),
	);
	it("continues to work when browser storage is blocked", () => {
		vi.stubGlobal("localStorage", {
			getItem() {
				throw Error("blocked");
			},
			setItem() {
				throw Error("blocked");
			},
		});
		try {
			expect(loadProgress()).toEqual(freshProgress());
			expect(saveProgress(freshProgress(), freshProgress())).toBe(false);
		} finally {
			vi.unstubAllGlobals();
		}
	});
	it("parses public links and refuses markup, paths and unsupported levels", () => {
		expect(parseTrainingDeepLink("#lesson=e10-choices&level=2")).toEqual({
			lessonId: "e10-choices",
			level: 2,
		});
		expect(parseTrainingDeepLink("", "?lesson=e10-tenses&level=1")).toEqual({
			lessonId: "e10-tenses",
			level: 1,
		});
		expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=99")).toEqual({});
		expect(parseTrainingDeepLink("#lesson=../../etc/passwd")).toEqual({});
		expect(
			trainingBaseUrl(
				"/englisch-realschule-10/",
				"?lesson=e10-tenses&level=2&ref=school",
			),
		).toBe("/englisch-realschule-10/?ref=school");
		expect(
			trainingBaseUrl("/englisch-realschule-10/", "?lesson=unknown&level=9"),
		).toBe("/englisch-realschule-10/");
	});
});
describe("proposal-only legacy mapping", () => {
	it("records all four legacy questions without transferring or retiring any history", () => {
		expect(mapping.approved).toBeNull();
		expect(mapping.status).toBe("proposal-only");
		expect(mapping.rows.map((row) => row.de_by_id).sort()).toEqual(
			oldItems.map((item) => item.id).sort(),
		);
		expect(mapping.rows).toHaveLength(4);
		expect("retired_items" in cell).toBe(false);
		for (const row of mapping.rows) {
			expect(row.category).toBe("C");
			expect(row.action).toBe("keep-active");
			expect(row.academy_slug).toBeNull();
			expect(row.reason.length).toBeGreaterThan(60);
			expect(oldItems.find((item) => item.id === row.de_by_id)?.question).toBe(
				row.de_by_question,
			);
		}
		const oldIds = new Set(oldItems.map((item) => item.id));
		for (const item of items) {
			expect(oldIds.has(item.id)).toBe(false);
			expect("replaces" in item).toBe(false);
		}
	});
});
