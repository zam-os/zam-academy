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
import legacy from "./fixtures/de-by-realschule-5-englisch-grundlagen-to-be-have-got-kvt.json";
import contract from "./fixtures/public-contract.json";

function required<T>(value: T | undefined): T {
	if (value === undefined) throw new Error("Missing lesson or card fixture");
	return value;
}
const items = cell.atoms.flatMap((atom) => atom.practice_items);
const oldItems = legacy.atoms.flatMap((atom) =>
	atom.practice_items.map((item) => ({
		id: item.id,
		question: item.question,
		concept: item.concept,
		fast_check: "fast_check" in item ? item.fast_check : undefined,
	})),
);
// Thomas approved the mapping on 2026-11-08: each A successor carries the
// history of exactly one old card from 2026.11.2 on.
const APPROVED_REPLACES: Record<string, string> = {
	"e5-to-be-check": "01K4E5B0000000000000000J01",
	"e5-have-got-check": "01K4E5B0000000000000000J03",
	"e5-articles-nouns-check": "01K4E5B0000000000000000J05",
	"e5-imperatives-check": "01K4E5B0000000000000000J07",
};
const replacesOf = (item: object): string[] =>
	"replaces" in item ? (item as { replaces: string[] }).replaces : [];
const lesson = (id: string) =>
	required(LESSONS.find((entry) => entry.id === id));

describe("curriculum, cards and public lesson links", () => {
	it("keeps the thematic path distinct from all official competency areas", () => {
		expect(CORE_LESSONS).toHaveLength(43);
		expect(LESSONS).toHaveLength(43);
		expect(
			STAGES.map(
				(stage) => LESSONS.filter((lesson) => lesson.stage === stage.id).length,
			),
		).toEqual([5, 8, 5, 6, 15, 4]);
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
		expect(coverage.rows).toHaveLength(36);
		expect(new Set(coverage.rows.map((row) => row.code)).size).toBe(36);
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
		).toEqual([20, 45, 25, 35, 15]);
		expect(
			coverage.neighbouring_grades.map((grade) => [
				grade.grade,
				grade.school_type,
			]),
		).toEqual([
			[3, "grundschule"],
			[6, "realschule"],
		]);
	});
	it("maps every listed grammar and vocabulary structure to a lesson that teaches it", () => {
		const structured = coverage.rows.filter((row) => "structures" in row);
		expect(structured.map((row) => row.code)).toEqual([
			"vocab-1",
			"grammar-1",
			"grammar-2",
			"grammar-3",
		]);
		const listed = structured.flatMap((row) =>
			(
				row as {
					structures: { structure: string; use?: string; lessons: string[] }[];
				}
			).structures,
		);
		expect(listed).toHaveLength(35);
		for (const row of structured)
			for (const entry of (
				row as {
					structures: { structure: string; use?: string; lessons: string[] }[];
				}
			).structures) {
				expect(row.curriculum_text).toContain(entry.structure);
				if (entry.use !== undefined)
					expect(["productive", "receptive"]).toContain(entry.use);
				expect(entry.lessons.length).toBeGreaterThan(0);
				for (const id of entry.lessons)
					expect(row.lessons).toContain(id);
			}
		const grammar2 = coverage.rows.find((row) => row.code === "grammar-2") as
			| {
					curriculum_text: string;
					structures: { structure: string; use: string; lessons: string[] }[];
			  }
			| undefined;
		expect(grammar2?.curriculum_text).toContain(
			"receptive: future meaning in combination with expressions of time",
		);
		expect(
			grammar2?.structures.filter((entry) => entry.use === "productive"),
		).toHaveLength(7);
		expect(
			grammar2?.structures.filter((entry) => entry.use === "receptive"),
		).toEqual([
			{
				structure:
					"receptive: future meaning in combination with expressions of time",
				scope: "simple present (timetables and schedules)",
				use: "receptive",
				lessons: ["e5-simple-present", "e5-present-contrast"],
			},
			{
				structure:
					"receptive: future meaning in combination with expressions of time",
				scope: "present progressive (fixed arrangements)",
				use: "receptive",
				lessons: [
					"e5-present-progressive",
					"e5-present-contrast",
					"e5-holiday-listening",
				],
			},
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
	it("pins 129 distinct ULIDs and all 43 lesson anchors independently", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(cell.version).toBe("2026.11.2");
		expect(cell.published_at).toMatch(/^2026-11-07T/);
		expect(cell.atoms).toHaveLength(43);
		expect(items).toHaveLength(86);
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
		expect(new Set(ids).size).toBe(129);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
		expect(LESSONS.map((lesson) => lessonLink(lesson.id))).toEqual(
			contract.map((entry) => entry.lesson),
		);
	});
	it.each(LESSONS)(
		"binds sources, grade 5 without exam claim, prerequisites and two standalone cards: $id",
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
					grade: 5,
					subject: "englisch",
					exam_relevant: false,
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
			expect(atom.typical_age_min).toBe(10);
			expect(atom.curricula[0]).toMatchObject({
				provider: "zam-academy",
				subject: "englisch-realschule-5",
				topic_code: lesson.stage,
			});
			expect(atom.practice_items[1].sample_solution?.length).toBeGreaterThan(
				atom.practice_items[1].concept.length,
			);
			for (const item of atom.practice_items) {
				expect(item.source_link).toBe(lessonLink(lesson.id));
				expect(item.materiality).toBe("material");
				expect(item.language).toBe("en");
				expect(replacesOf(item)).toEqual(
					APPROVED_REPLACES[item.slug] ? [APPROVED_REPLACES[item.slug]] : [],
				);
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
			"e5-smart-consumer",
			"e5-way-to-school",
		]);
		for (const lesson of charts) {
			const chart = required(lesson.graphic);
			expect(chart.title.length).toBeGreaterThan(5);
			expect(chart.unit.length).toBeGreaterThan(1);
			expect(chart.values).toHaveLength(4);
			for (const entry of chart.values) {
				expect(Number.isFinite(entry.value)).toBe(true);
				expect(entry.value).toBeGreaterThan(0);
				expect(lesson.material).toContain(String(entry.value));
			}
		}
	});
	it("labels every scene item in the text and keeps it inside the picture", () => {
		const scenes = LESSONS.filter((lesson) => lesson.scene);
		expect(scenes.map((lesson) => lesson.id)).toEqual(["e5-pets-animals"]);
		const scene = required(scenes[0].scene);
		expect(scene.items.length).toBeGreaterThanOrEqual(6);
		for (const item of scene.items) {
			expect(scenes[0].material).toContain(item.label);
			expect(item.x).toBeGreaterThanOrEqual(0);
			expect(item.y).toBeGreaterThanOrEqual(0);
			expect(item.x + item.w).toBeLessThanOrEqual(620);
			expect(item.y + item.h).toBeLessThanOrEqual(340);
		}
	});
	it("quotes the public-domain Stevenson poems as an original and labels invented material", () => {
		const stevenson = lesson("e5-poems-rhymes");
		expect(stevenson.materialLabel).toContain("Originaltext");
		expect(stevenson.materialLabel).toContain("gemeinfrei");
		expect(stevenson.material).toContain("A birdie with a yellow bill");
		expect(stevenson.material).toContain("own summary");
		for (const entry of LESSONS)
			expect(entry.materialLabel).toMatch(
				/erfunden|fiktiv|Originaltext|Quelle|verlinkt|Grundwissen/i,
			);
		expect(lesson("e5-health-illness").materialLabel).toContain(
			"keine medizinische Beratung",
		);
	});
	it("teaches E5 grammar and leaves Present Perfect and will-future to Englisch 6", () => {
		const grammar = LESSONS.filter((entry) => entry.stage === "language");
		expect(
			grammar.some((entry) =>
				/present perfect|past progressive|if-clause/i.test(
					JSON.stringify(entry),
				),
			),
		).toBe(false);
		expect(
			coverage.neighbouring_grades.find((grade) => grade.grade === 6)
				?.boundary,
		).toContain("Present Perfect");
		expect(lesson("e5-hello-uk").paragraphs[0]).toContain(
			"Wiederholung aus der Grundschule",
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
	it("never shows a short answer in its own prompt, except in explicit either/or choices", () => {
		const escape = (text: string) =>
			text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		for (const lesson of LESSONS)
			for (const item of lesson.practice) {
				const prompt = normalise(item.prompt);
				const shown = item.answers.filter((answer) =>
					new RegExp(`(?<![\\w'])${escape(normalise(answer))}(?![\\w'])`).test(
						prompt,
					),
				);
				if (shown.length === 0) continue;
				expect(prompt, `${lesson.id}: ${item.prompt}`).toMatch(
					/“[^”]+” or “[^”]+”|\ba noun or a verb\b/,
				);
			}
	});
	it("does not accept a wrong verb form after didn’t or a broken negative imperative", () => {
		const irregular = required(
			LESSONS.find((lesson) => lesson.id === "e5-simple-past-irregular-did"),
		).practice[1];
		expect(checkPractice([irregular], ["took"])).toEqual([false]);
		expect(checkPractice([irregular], ["take"])).toEqual([true]);
		const imperative = required(
			LESSONS.find((lesson) => lesson.id === "e5-imperatives"),
		).practice[0];
		for (const changed of ["Not", "Doesn't"])
			expect(checkPractice([imperative], [changed])).toEqual([false]);
	});
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
		expect(
			LESSONS.filter((lesson) => lesson.listening).map((lesson) => lesson.id),
		).toEqual([
			"e5-classroom-phrases",
			"e5-family-listening",
			"e5-holiday-listening",
		]);
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
		expect(completion(p)).toEqual({ completed: 1, total: 43, percent: 2 });
		expect(completion(p, true).total).toBe(43);
	});
	it("requires a listening activity as well as written answers on a listening lesson", () => {
		const p = freshProgress(),
			id = "e5-classroom-phrases";
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
		p.listening["e5-classroom-phrases"] = { synthetic: false, partner: true };
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
					"e5-classroom-phrases": "remote",
					"e5-family-listening": "partner",
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
			"e5-family-listening": { synthetic: false, partner: true },
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
		expect(parseTrainingDeepLink("#lesson=e5-school-life&level=2")).toEqual({
			lessonId: "e5-school-life",
			level: 2,
		});
		expect(parseTrainingDeepLink("", "?lesson=e5-to-be&level=1")).toEqual({
			lessonId: "e5-to-be",
			level: 1,
		});
		expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=99")).toEqual({});
		expect(parseTrainingDeepLink("#lesson=../../etc/passwd")).toEqual({});
		expect(
			trainingBaseUrl(
				"/englisch-realschule-5/",
				"?lesson=e5-to-be&level=2&ref=school",
			),
		).toBe("/englisch-realschule-5/?ref=school");
		expect(
			trainingBaseUrl("/englisch-realschule-5/", "?lesson=unknown&level=9"),
		).toBe("/englisch-realschule-5/");
	});
});

describe("approved legacy mapping", () => {
	it("is approved and ships exactly the four A transfers, without retired_items", () => {
		expect(mapping.approved).toBe("2026-11-08");
		expect(mapping.status).toBe("approved");
		expect(mapping.rows.map((row) => row.de_by_id).sort()).toEqual(
			oldItems.map((item) => item.id).sort(),
		);
		expect(mapping.rows).toHaveLength(8);
		expect("retired_items" in cell).toBe(false);
		for (const row of mapping.rows) {
			expect(row.reason.length).toBeGreaterThan(60);
			expect(oldItems.find((item) => item.id === row.de_by_id)?.question).toBe(
				row.de_by_question,
			);
		}
		expect(
			mapping.rows.map((row) => [row.category, row.action, row.academy_slug]),
		).toEqual([
			["A", "replace", "e5-to-be-check"],
			["C", "keep-active", null],
			["A", "replace", "e5-have-got-check"],
			["C", "keep-active", null],
			["A", "replace", "e5-articles-nouns-check"],
			["C", "keep-active", null],
			["A", "replace", "e5-imperatives-check"],
			["C", "keep-active", null],
		]);
		const oldIds = new Set(oldItems.map((item) => item.id));
		for (const item of items) {
			expect(oldIds.has(item.id)).toBe(false);
			expect(replacesOf(item)).toEqual(
				APPROVED_REPLACES[item.slug] ? [APPROVED_REPLACES[item.slug]] : [],
			);
		}
		for (const row of mapping.rows.filter((entry) => entry.category === "A"))
			expect(APPROVED_REPLACES[row.academy_slug as string]).toBe(row.de_by_id);
	});
	it("proposes A only where the successor asks the same single retrieval", () => {
		const checks: [string, string, string][] = [
			["01K4E5B0000000000000000J01", "e5-to-be-check", "isn’t"],
			[
				"01K4E5B0000000000000000J03",
				"e5-have-got-check",
				"has got (he/she/it has got)",
			],
			[
				"01K4E5B0000000000000000J05",
				"e5-articles-nouns-check",
				"Before a spoken vowel sound (an apple, an hour)",
			],
			[
				"01K4E5B0000000000000000J07",
				"e5-imperatives-check",
				"Don’t + base form (Don’t run!)",
			],
		];
		for (const [oldId, slug, expectedConcept] of checks) {
			const old = required(oldItems.find((item) => item.id === oldId));
			const successor = required(items.find((item) => item.slug === slug));
			expect(successor.concept).toBe(expectedConcept);
			expect(successor.fast_check?.correct_index).toBe(
				old.fast_check?.correct_index,
			);
			expect(successor.fast_check?.options).toHaveLength(2);
		}
	});
});
