import { afterEach, describe, expect, it, vi } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import { findLesson, LESSONS, SOURCES, STAGES } from "../src/curriculum";
import rawLessons from "../src/curriculum/lessons.json";
import { renderMaterial } from "../src/material";
import {
	canAccept,
	canReview,
	checkCases,
	esc,
	quizOptions,
} from "../src/practice";
import {
	completion,
	confirmWriting,
	freshProgress,
	isComplete,
	loadProgress,
	parseProgress,
	recordQuizAnswer,
	STORAGE_KEY,
	saveProgress,
	submitCaseAnswers,
	updateDraft,
	writingKey,
} from "../src/storage/progress";
import {
	lessonLink,
	parseTrainingDeepLink,
	trainingBaseUrl,
	ZAM_CELL_ID,
} from "../src/zam/zam-link";
import official from "./fixtures/official-curriculum.json";
import contract from "./fixtures/public-contract.json";

const GRADE = 5;
const COUNT = 51;
const EXPECTATIONS = 71;
const APP = `deutsch-mittelschule-${GRADE}`;
afterEach(() => vi.unstubAllGlobals());

describe("Curriculum and publication contract", () => {
	it("pins every lesson anchor and randomly generated ULID", () => {
		expect(LESSONS.map((l) => l.id)).toEqual(contract.lessons);
		expect(LESSONS).toHaveLength(COUNT);
		expect(new Set(LESSONS.map((l) => l.id)).size).toBe(COUNT);
		const ids = cell.atoms.flatMap((a) => [
			a.id,
			...a.practice_items.map((i) => i.id),
		]);
		expect(ids.slice().sort()).toEqual(Object.values(contract.ids).sort());
		expect(new Set(ids).size).toBe(COUNT * 3);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
	});
	it("covers every fetched expectation verbatim and every lesson at its real section", () => {
		expect(coverage.rows).toHaveLength(EXPECTATIONS);
		expect(coverage.curriculum).toBe(official.url);
		expect(coverage.curriculum_sha256).toBe(official.curriculum_sha256);
		expect(
			coverage.rows.map((r) => ({
				section: r.section,
				position: r.position,
				competence: r.competence,
			})),
		).toEqual(official.expectations);
		expect(
			new Set(coverage.rows.map((r) => `${r.section}.${r.position}`)).size,
		).toBe(EXPECTATIONS);
		expect(new Set(coverage.rows.map((r) => r.section)).size).toBe(14);
		expect(
			[...new Set(coverage.rows.flatMap((r) => r.lessons))].sort(),
		).toEqual(LESSONS.map((l) => l.id).sort());
		for (const r of coverage.rows) {
			expect(r.lb).toBe(Number(r.section[0]));
			expect(r.lessons.length).toBeGreaterThan(0);
			expect(r.evidence.length).toBeGreaterThan(50);
			expect(r.additional.length).toBeGreaterThan(50);
			expect(["implemented", "supported"]).toContain(r.status);
			if (["1", "2", "3"].includes(r.section[0]))
				expect(r.status).toBe("supported");
			for (const id of r.lessons)
				expect(findLesson(id)?.bindings).toContain(r.section);
		}
		expect(coverage.optional_lessons).toEqual([]);
	});
	it("keeps card text in the cell and declares no history transfer", () => {
		expect(
			rawLessons.every(
				(l) =>
					!("quiz" in l) &&
					!("recall" in l) &&
					!("question" in l) &&
					!("concept" in l),
			),
		).toBe(true);
		expect("retired_items" in cell).toBe(false);
		expect(mapping).toMatchObject({
			status: "proposal-only",
			approved: null,
			sources: [],
			rows: [],
		});
		for (const a of cell.atoms)
			for (const i of a.practice_items) expect("replaces" in i).toBe(false);
	});
	it("uses separate school, grade, links and browser storage", () => {
		expect(STORAGE_KEY).toBe(`deutsch_ms${GRADE}_progress_v1`);
		for (const a of cell.atoms) {
			const bindings = a.curricula.filter(
				(c) => c.provider === "lehrplanplus-bayern",
			);
			expect(bindings.length).toBeGreaterThan(0);
			for (const c of bindings)
				expect(c).toMatchObject({
					school_type: "mittelschule",
					grade: GRADE,
					subject: "deutsch",
				});
			expect(a.source_link).toBe(lessonLink(a.slug));
		}
	});
	it("contains real local prerequisite references and no cycle", () => {
		const graph = new Map(
			cell.atoms.map((a) => [a.id, a.prerequisites.map((p) => p.atom_id)]),
		);
		function visit(id: string, ancestors: Set<string>): void {
			expect(ancestors.has(id)).toBe(false);
			const children = graph.get(id);
			expect(children).toBeDefined();
			for (const child of children ?? [])
				visit(child, new Set([...ancestors, id]));
		}
		for (const id of graph.keys()) visit(id, new Set());
		expect(cell.atoms.some((a) => a.prerequisites.length > 0)).toBe(true);
	});
	it.each(LESSONS.map((l) => [l.id, l] as const))(
		"%s has substantive material and reachable workshop decisions",
		(_, l) => {
			expect(STAGES.some((s) => s.id === l.stage)).toBe(true);
			expect(l.paragraphs.length).toBeGreaterThanOrEqual(2);
			expect(l.paragraphs.join(" ").length).toBeGreaterThan(250);
			expect(l.material.length).toBeGreaterThan(35);
			expect(l.takeaway.length).toBeGreaterThan(30);
			expect(l.lehrplan).toContain(`D${GRADE} LB`);
			for (const id of l.sourceIds)
				expect(SOURCES.some((s) => s.id === id)).toBe(true);
			expect(new Set(quizOptions(l)).size).toBe(3);
			expect(quizOptions(l).slice().sort()).toEqual(
				[l.quiz.answer, ...l.quiz.wrong].sort(),
			);
			expect(l.quiz.explanation.length).toBeGreaterThan(35);
			expect(l.cases).toHaveLength(2);
			expect(checkCases(l.cases, [])).toEqual([false, false]);
			expect(
				checkCases(
					l.cases,
					l.cases.map((c) => c.answer),
				),
			).toEqual([true, true]);
			expect(
				checkCases(
					l.cases,
					l.cases.map((c) => c.options.find((o) => o !== c.answer) ?? ""),
				),
			).toEqual([false, false]);
			for (const c of l.cases) {
				expect(c.options).toContain(c.answer);
				expect(new Set(c.options).size).toBe(c.options.length);
				expect(c.feedback.length).toBeGreaterThan(25);
			}
			expect(l.tasks[1].prompt).not.toBe(l.tasks[2].prompt);
			expect(l.tasks[1].model).not.toBe(l.tasks[2].model);
			expect(l.tasks[1].criteria).not.toEqual(l.tasks[2].criteria);
			for (const level of [1, 2] as const) {
				expect(l.tasks[level].criteria).toHaveLength(3);
				expect(new Set(l.tasks[level].criteria).size).toBe(3);
				expect(l.tasks[level].prompt.length).toBeGreaterThan(35);
				expect(canReview(l.tasks[level].model)).toBe(true);
			}
			const a = cell.atoms.find((a) => a.slug === l.id);
			if (!a) throw new Error("Missing atom");
			const [fast, recall] = a.practice_items;
			expect(a.practice_items).toHaveLength(2);
			expect(fast.question).toBe(l.quiz.question);
			expect(fast.concept).toBe(l.quiz.answer);
			expect(fast.fast_check?.options).toHaveLength(2);
			expect(fast.fast_check?.correct_index).toBe(0);
			expect(fast.fast_check?.options[0]).toBe(fast.concept);
			expect(recall.sample_solution?.length).toBeGreaterThan(20);
			expect(recall.question.length).toBeGreaterThan(20);
			for (const i of a.practice_items)
				expect(i.source_link).toBe(
					`https://academy.zam-os.org/${APP}/#lesson=${l.id}`,
				);
			expect(renderMaterial(l)).not.toContain("undefined");
		},
	);
	it("varies quick-check and case answer positions", () => {
		expect(
			new Set(LESSONS.map((l) => quizOptions(l).indexOf(l.quiz.answer))).size,
		).toBe(3);
		expect(
			new Set(
				LESSONS.flatMap((l) => l.cases.map((c) => c.options.indexOf(c.answer))),
			).size,
		).toBe(2);
	});
	it("bundles a listening story with a transcript and native controls", () => {
		const l = findLesson(`d${GRADE}-fabelhoeren`);
		if (!l) throw new Error("Missing listening lesson");
		const rendered = renderMaterial(l);
		expect(rendered).toContain('<audio controls preload="none"');
		expect(rendered).toContain("<details>");
		expect(rendered).toContain("Computerstimme");
		expect(rendered).not.toMatch(/src="https?:/);
	});
});

describe("Honest progress and separate writing levels", () => {
	const l = LESSONS[0];
	function completed() {
		const p = freshProgress();
		recordQuizAnswer(p, l.id, true);
		submitCaseAnswers(
			p,
			l.id,
			l.cases.map((c) => c.answer),
		);
		const text = "Meine eigene begründete Antwort mit ausreichend Text.";
		updateDraft(p, l.id, 1, text);
		confirmWriting(p, l.id, 1, text);
		return p;
	}
	it("requires every component rather than treating a draft as a score", () => {
		const p = completed();
		expect(isComplete(p, l.id)).toBe(true);
		expect(completion(p)).toEqual({ completed: 1, total: COUNT });
		p.level = 2;
		expect(isComplete(p, l.id)).toBe(false);
		p.level = 1;
		recordQuizAnswer(p, l.id, false);
		expect(isComplete(p, l.id)).toBe(false);
		recordQuizAnswer(p, l.id, true);
		submitCaseAnswers(p, l.id, ["wrong", l.cases[1].answer]);
		expect(isComplete(p, l.id)).toBe(false);
	});
	it("invalidates only the edited level and rejects a stale comparison", () => {
		const p = completed();
		updateDraft(p, l.id, 2, "Ein eigenständiger neuer Entwurf auf Level zwei.");
		confirmWriting(p, l.id, 2, p.drafts[writingKey(l.id, 2)]);
		const old = p.drafts[writingKey(l.id, 1)];
		updateDraft(
			p,
			l.id,
			1,
			"Ein überarbeiteter Entwurf braucht einen neuen Vergleich.",
		);
		expect(confirmWriting(p, l.id, 1, old)).toBe(false);
		expect(isComplete(p, l.id, 1)).toBe(false);
		expect(isComplete(p, l.id, 2)).toBe(true);
		expect(parseProgress(JSON.stringify(p))).toEqual(p);
	});
	it("requires a substantial draft and all three self-check criteria", () => {
		expect(canReview("kurz")).toBe(false);
		expect(
			canAccept("Eine ausreichend lange eigene Antwort.", [true, true, false]),
		).toBe(false);
		expect(canAccept("Eine ausreichend lange eigene Antwort.", [])).toBe(false);
		expect(
			canAccept("Eine ausreichend lange eigene Antwort.", [true, true, true]),
		).toBe(true);
	});
	it.each(["{", "null", "[]", "7", '"text"'])(
		"recovers from corrupt storage %s",
		(raw) => {
			expect(parseProgress(raw)).toEqual(freshProgress());
		},
	);
	it("filters unknown and malformed evidence", () => {
		const p = parseProgress(
			JSON.stringify({
				level: 7,
				quizDone: [l.id, l.id, "unknown"],
				cases: { [l.id]: ["<script>", 123] },
				drafts: { unknown: "x" },
				writingDone: ["unknown"],
			}),
		);
		expect(p.level).toBe(1);
		expect(p.quizDone).toEqual([l.id]);
		expect(p.cases[l.id]).toEqual(["", ""]);
		expect(p.writingDone).toEqual([]);
		expect(isComplete(p, l.id)).toBe(false);
	});
	it("keeps a blocked-storage visit usable and reports save failure", async () => {
		vi.stubGlobal("localStorage", {
			getItem() {
				throw new Error("blocked");
			},
			setItem() {
				throw new Error("blocked");
			},
		});
		expect(loadProgress()).toEqual(freshProgress());
		expect(await saveProgress(freshProgress())).toBe(false);
	});
});

describe("Navigation and escaped text", () => {
	const id = LESSONS[0].id;
	it("uses fragment precedence, validates ids and supports query links", () => {
		expect(
			parseTrainingDeepLink(`#lesson=${id}&level=2`, `?lesson=other&level=1`),
		).toEqual({ lessonId: id, level: 2 });
		expect(parseTrainingDeepLink("", `?lesson=${id}`)).toEqual({
			lessonId: id,
		});
		expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=9")).toEqual({});
		expect(trainingBaseUrl(`/${APP}/`, `?lesson=${id}&level=2&from=zam`)).toBe(
			`/${APP}/?from=zam`,
		);
	});
	it("escapes a draft instead of executing markup", () => {
		expect(esc('<img src=x onerror="run()"> &')).toBe(
			"&lt;img src=x onerror=&quot;run()&quot;&gt; &amp;",
		);
	});
});

describe("Learner-language and corrected examples", () => {
	const prose = LESSONS.flatMap((l) => [
		l.title,
		l.skill,
		...l.paragraphs,
		l.material,
		l.takeaway,
		l.quiz.question,
		l.quiz.answer,
		...l.quiz.wrong,
		l.quiz.explanation,
		...l.cases.flatMap((c) => [c.prompt, ...c.options, c.feedback]),
		...([1, 2] as const).flatMap((level) => [
			l.tasks[level].prompt,
			l.tasks[level].model,
			...l.tasks[level].criteria,
		]),
		l.extension ?? "",
	]);
	it("uses German number and unit conventions in learner prose, excluding curriculum labels", () => {
		for (const text of prose) {
			expect(text).not.toMatch(/\d\.\d/);
			expect(text).not.toMatch(/(?:^|[\s(])-[\s]*\d|\d\s*-\s*\d/);
			expect(text).not.toMatch(/\d(?:cm|mm|km|kg|Euro|Minuten)\b/);
		}
	});
	it("keeps model-email sign-offs consistent with the taught letter convention", () => {
		for (const l of LESSONS)
			for (const level of [1, 2] as const) {
				expect(l.tasks[level].model).not.toMatch(/(?:Viele|Liebe) Grüße,/);
				if (/(?:Viele|Liebe) Grüße\n/.test(l.tasks[level].model))
					expect(l.tasks[level].model).toMatch(/\n(?:Viele|Liebe) Grüße\n\S/);
			}
	});
	it("keeps cited grammatical forms distinct from surrounding case grammar", () => {
		expect(prose.join("\n")).not.toContain("nach den Stamm");
		expect(prose.join("\n")).not.toContain("in der Napf des Hundes");
		for (const l of LESSONS)
			for (const c of l.cases) expect(c.prompt).toBe(c.prompt.trim());
	});
});

it("links the syllable-separating h method to D5 4.3.1", () => {
	expect(
		coverage.rows.find((r) => r.section === "4.3" && r.position === 1)?.lessons,
	).toContain("d5-silbentrennung");
});
