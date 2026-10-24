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
import legacy from "./fixtures/de-by-realschule-9-englisch-grammatik-syntax-kvt.json";
import contract from "./fixtures/public-contract.json";

function required<T>(value: T | undefined): T {
	if (value === undefined) throw new Error("Missing lesson or card fixture");
	return value;
}
const items = cell.atoms.flatMap((atom) => atom.practice_items);
const oldItems = legacy.atoms.flatMap((atom) => atom.practice_items);

describe("curriculum, cards and public lesson links", () => {
	it("separates the thematic path from official curriculum area numbers", () => {
		expect(CORE_LESSONS).toHaveLength(36);
		expect(LESSONS).toHaveLength(40);
		expect(
			STAGES.map(
				(stage) => LESSONS.filter((lesson) => lesson.stage === stage.id).length,
			),
		).toEqual([8, 4, 4, 5, 9, 6, 4]);
		expect(new Set(coverage.areas.flatMap((area) => area.lessons))).toEqual(
			new Set(CORE_LESSONS.map((lesson) => lesson.id)),
		);
		for (const area of coverage.areas)
			for (const id of area.lessons)
				expect(LESSONS.find((lesson) => lesson.id === id)?.bindings).toContain(
					area.code,
				);
		for (const lesson of CORE_LESSONS)
			for (const binding of lesson.bindings)
				expect(
					coverage.areas.find((area) => area.code === binding)?.lessons,
				).toContain(lesson.id);
		expect(coverage.optional.lessons).toEqual(
			LESSONS.filter((lesson) => lesson.optional).map((lesson) => lesson.id),
		);
		for (const lesson of LESSONS.filter((entry) => entry.optional))
			expect(lesson.bindings).toEqual([]);
		expect(
			coverage.areas.find((area) => area.code === "1.1-hoeren")?.status,
		).toBe("partial");
		expect(
			coverage.areas.find((area) => area.code === "1.2-wortschatz")?.status,
		).toBe("partial");
	});
	it("records each competence/theme row with evidence and explicit practice limits", () => {
		expect(coverage.rows).toHaveLength(41);
		expect(new Set(coverage.rows.map((row) => row.code)).size).toBe(41);
		expect(new Set(coverage.rows.flatMap((row) => row.lessons))).toEqual(
			new Set(CORE_LESSONS.map((lesson) => lesson.id)),
		);
		for (const row of coverage.rows) {
			expect(row.evidence.length).toBeGreaterThan(20);
			for (const id of row.lessons) {
				const lesson = LESSONS.find((candidate) => candidate.id === id);
				expect(lesson?.optional).not.toBe(true);
				expect(
					lesson?.bindings.some((binding) => binding[0] === String(row.lb)),
				).toBe(true);
			}
		}
		expect(coverage.optional_lessons).toEqual(
			LESSONS.filter((lesson) => lesson.optional).map((lesson) => lesson.id),
		);
		expect(coverage.neighbouring_grades.map((grade) => grade.grade)).toEqual([
			8, 10,
		]);
	});
	it.each(LESSONS)(
		"contains usable material and distinct production tasks: $id",
		(lesson) => {
			expect(lesson.paragraphs).toHaveLength(2);
			expect(lesson.takeaway.length).toBeGreaterThan(20);
			expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(450);
			expect(lesson.material.length).toBeGreaterThan(250);
			expect(lesson.practice).toHaveLength(3);
			expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
			for (const source of lesson.sourceIds)
				expect(SOURCES.find((entry) => entry.id === source)?.url).toMatch(
					/^https:\/\//,
				);
			expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
			for (const task of Object.values(lesson.tasks)) {
				expect(task.criteria).toHaveLength(3);
				expect(task.model.length).toBeGreaterThan(160);
			}
		},
	);
	it("pins the stable identity and anchor of every card", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(cell.atoms).toHaveLength(40);
		expect(items).toHaveLength(80);
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
		expect(new Set(ids).size).toBe(ids.length);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
		expect(LESSONS.map((lesson) => lessonLink(lesson.id))).toEqual(
			contract.map((entry) => entry.lesson),
		);
	});
	it.each(LESSONS)(
		"keeps the card content and actual curriculum scope in sync: $id",
		(lesson) => {
			const atom = required(
				cell.atoms.find((entry) => entry.slug === lesson.id),
			);
			expect(atom.source_link).toBe(lessonLink(lesson.id));
			const bindings = atom.curricula.filter(
				(entry) => entry.provider === "lehrplanplus-bayern",
			);
			expect(bindings.map((entry) => entry.topic_code)).toEqual([
				...new Set(lesson.bindings.map((binding) => `lb${binding[0]}`)),
			]);
			for (const binding of bindings) {
				expect(binding).toMatchObject({
					school_type: "realschule",
					grade: 9,
					subject: "englisch",
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
			expect(fast.options[fast.correct_index]).toBe(lesson.quiz.answer);
			expect(atom.practice_items[1]).toMatchObject({
				question: expect.any(String),
				concept: expect.any(String),
				language: "en",
			});
			expect(atom.practice_items[1].sample_solution?.length).toBeGreaterThan(
				atom.practice_items[1].concept.length,
			);
			expect(
				atom.practice_items.every((item) => item.materiality === "material"),
			).toBe(true);
			for (const item of atom.practice_items)
				expect(item.source_link).toBe(lessonLink(lesson.id));
			for (const prerequisite of atom.prerequisites)
				expect(
					cell.atoms.some((entry) => entry.id === prerequisite.atom_id),
				).toBe(true);
		},
	);
	it("corrects the relative-clause and passive errors found in the legacy material", () => {
		const relative = required(
			LESSONS.find((lesson) => lesson.id === "e9-relative-extra"),
		);
		expect(relative.material).toContain("whose");
		expect(relative.material).toContain("where");
		expect(relative.material).toContain("when");
		const passive = required(
			LESSONS.find((lesson) => lesson.id === "e9-passive"),
		);
		expect(
			cell.atoms.find((atom) => atom.slug === passive.id)?.practice_items[1]
				.concept,
		).toBe("A bridge is being built.");
		expect(passive.paragraphs.join(" ")).toContain(
			"Objekt des Aktivsatzes zum Subjekt",
		);
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
			australian,
			english,
		]);
		expect(localEnglishVoices([remote, german])).toEqual([]);
		expect(LESSONS.filter((lesson) => lesson.listening)).toHaveLength(2);
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
		expect(completion(p)).toEqual({ completed: 1, total: 36, percent: 3 });
		expect(completion(p, true).total).toBe(40);
	});
	it("requires a listening activity as well as written answers on a listening lesson", () => {
		const p = freshProgress(),
			id = "e9-business-call";
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
		p.listening["e9-business-call"] = { synthetic: false, partner: true };
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
					"e9-business-call": "remote",
					"e9-announcement": "partner",
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
			"e9-announcement": { synthetic: false, partner: true },
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
		expect(parseTrainingDeepLink("#lesson=e9-job-ad&level=2")).toEqual({
			lessonId: "e9-job-ad",
			level: 2,
		});
		expect(parseTrainingDeepLink("", "?lesson=e9-passive&level=1")).toEqual({
			lessonId: "e9-passive",
			level: 1,
		});
		expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=99")).toEqual({});
		expect(parseTrainingDeepLink("#lesson=../../etc/passwd")).toEqual({});
		expect(
			trainingBaseUrl(
				"/englisch-realschule-9/",
				"?lesson=e9-passive&level=2&ref=school",
			),
		).toBe("/englisch-realschule-9/?ref=school");
		expect(
			trainingBaseUrl("/englisch-realschule-9/", "?lesson=unknown&level=9"),
		).toBe("/englisch-realschule-9/");
	});
});
describe("legacy mapping proposal", () => {
	it("accounts for all eight old cards with an immutable source snapshot", () => {
		expect(mapping.approved).toBeNull();
		expect(mapping.status).toBe("proposal-only");
		expect(mapping.rows.map((row) => row.de_by_id).sort()).toEqual(
			oldItems.map((item) => item.id).sort(),
		);
		expect(mapping.rows.filter((row) => row.category === "A")).toHaveLength(3);
		expect(mapping.rows.filter((row) => row.category === "C")).toHaveLength(5);
		expect(items.every((item) => !("replaces" in item))).toBe(true);
		expect("retired_items" in cell).toBe(false);
		for (const row of mapping.rows) {
			if (row.category === "A")
				expect(items.some((item) => item.slug === row.academy_slug)).toBe(true);
			else expect(row.academy_slug).toBeNull();
		}
	});
});
