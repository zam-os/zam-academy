import { describe, expect, it, vi } from "vitest";
import tileData from "../cell.json";
import coverage from "../coverage.json";
import { LESSONS, SOURCES, STAGES } from "../src/curriculum";
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
import oldData from "./fixtures/de-by-deutsch-10.json";
import contract from "./fixtures/public-contract.json";

const tile = tileData;
const old = oldData;

describe("Lernpfad und veröffentlichbarer Vertrag", () => {
	it("pins 30 unique lesson anchors and all 90 ULIDs independently", () => {
		expect(LESSONS.map((l) => l.id)).toEqual(contract.lessons);
		expect(LESSONS).toHaveLength(30);
		expect(new Set(LESSONS.map((l) => l.id)).size).toBe(30);
		const ids = tile.atoms.flatMap((a) => [
			a.id,
			...a.practice_items.map((i) => i.id),
		]);
		expect(ids.sort()).toEqual(Object.values(contract.ids).sort());
		expect(new Set(ids).size).toBe(90);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
	});
	it("keeps the additional cell separate from all four old retrievals", () => {
		const oldIds = new Set(
			old.atoms.flatMap((a) => a.practice_items.map((i) => i.id)),
		);
		expect(oldIds.size).toBe(4);
		expect("retired_items" in tile).toBe(false);
		for (const atom of tile.atoms)
			for (const item of atom.practice_items) {
				expect("replaces" in item).toBe(false);
				expect(oldIds.has(item.id)).toBe(false);
			}
	});
	it("traces 48 expectations to real lessons and matching sections, with limits", () => {
		expect(coverage.rows).toHaveLength(48);
		expect(
			new Set(coverage.rows.map((e) => `${e.section}.${e.position}`)).size,
		).toBe(48);
		expect([...new Set(coverage.rows.map((e) => e.section))]).toHaveLength(14);
		for (const row of coverage.rows) {
			expect(row.additional.length).toBeGreaterThan(15);
			expect(["guided", "preparation"]).toContain(row.support);
			for (const id of row.lessons)
				expect(LESSONS.find((l) => l.id === id)?.bindings).toContain(
					row.section,
				);
		}
		expect(
			STAGES.map((stage) => LESSONS.filter((l) => l.stage === stage.id).length),
		).toEqual([5, 10, 10, 5]);
		for (const lesson of LESSONS)
			expect(coverage.rows.some((row) => row.lessons.includes(lesson.id))).toBe(
				true,
			);
		expect(
			coverage.rows
				.filter((row) => row.section === "1.1")
				.map((row) => row.position),
		).toEqual([1, 2, 3, 4]);
		expect(
			coverage.rows
				.filter((row) => row.section === "1.3")
				.map((row) => row.position),
		).toEqual([1, 2, 3, 4]);
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
			expect(fastCheck.correct_index).toBe(0);
			expect(recall.question.length).toBeGreaterThan(15);
			expect(recall.concept.length).toBeGreaterThan(20);
			expect(recall.sample_solution?.length ?? 0).toBeGreaterThan(20);
			expect("recall" in lesson).toBe(false);
			expect(lesson.takeaway.length).toBeGreaterThan(30);
			for (const item of atom.practice_items)
				expect(item.source_link).toBe(
					`https://academy.zam-os.org/deutsch-realschule-10/#lesson=${lesson.id}`,
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
					subject: "deutsch",
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
		expect(completion(p)).toEqual({ completed: 1, total: 30 });
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
				"#lesson=d10-roman&level=2",
				"?lesson=d10-daten&level=1",
			),
		).toEqual({ lessonId: "d10-roman", level: 2 });
		expect(parseTrainingDeepLink("", "?lesson=d10-daten")).toEqual({
			lessonId: "d10-daten",
		});
		expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=9")).toEqual({});
	});
	it("removes old query routes when going back to the path", () => {
		expect(
			trainingBaseUrl(
				"/deutsch-realschule-10/",
				"?lesson=d10-roman&level=2&from=zam",
			),
		).toBe("/deutsch-realschule-10/?from=zam");
	});
	it("renders user drafts as text even if they contain markup", () => {
		expect(esc('<img src=x onerror="run()"> &')).toBe(
			"&lt;img src=x onerror=&quot;run()&quot;&gt; &amp;",
		);
	});
});
