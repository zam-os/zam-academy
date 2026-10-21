import { describe, expect, it } from "vitest";
import {
	checkCode,
	EN_LESSONS,
	findLesson,
	LESSONS,
	lessonFromHash,
} from "../src/curriculum";
import { runProgram, TRACE_ACTIONS } from "../src/engine";
import {
	asLocale,
	type Locale,
	localeFromHash,
	progressLabel,
	stageNames,
	trainingHash,
	UI,
} from "../src/i18n";
import {
	draftFor,
	isComplete,
	parseProgress,
	saveDraft,
	switchProgressLocale,
} from "../src/progress";

describe("complete English refresher", () => {
	it("keeps every public anchor, stage and quiz meaning in both languages", () => {
		expect(EN_LESSONS.map((l) => l.id)).toEqual(LESSONS.map((l) => l.id));
		for (const en of EN_LESSONS) {
			const de = findLesson(en.id)!;
			expect(en.stage).toBe(de.stage);
			expect(en.correct).toBe(de.correct);
			expect(en.title).not.toBe(de.title);
			expect(en.task).not.toBe(de.task);
			expect(en.paragraphs).toHaveLength(2);
			for (const text of en.paragraphs)
				expect(text.length).toBeGreaterThan(110);
			expect(en.model.length).toBe(de.model.length);
			expect(en.hint.length).toBeGreaterThan(20);
			expect(new Set(en.options).size).toBe(3);
			expect(en.explanation.length).toBeGreaterThan(20);
		}
	});
	for (const locale of ["de", "en"] as const)
		for (const lesson of locale === "en" ? EN_LESSONS : LESSONS)
			it(`${locale}/${lesson.id}: the localized solution and test values agree`, () => {
				const run = checkCode(lesson, lesson.solution, locale);
				expect(run.passed, JSON.stringify(run.results)).toBe(true);
				expect(checkCode(lesson, lesson.starter, locale).passed).toBe(false);
				expect(checkCode(lesson, "", locale).passed).toBe(false);
			});
	it("uses English identifiers and literal outputs in English exercises", () => {
		const lesson = findLesson("algo-bedingungen", "en")!;
		expect(lesson.solution).toContain("score");
		expect(lesson.solution).toContain('"passed"');
		expect(lesson.tests[1].expected).toEqual(["passed"]);
		expect(findLesson("algo-parameter", "en")!.solution).toContain('"Hello "');
		expect(findLesson("algo-zahlen", "en")!.paragraphs.join(" ")).toContain(
			'"Price: "',
		);
	});
	it("provides every UI, stage, error and trace label in English", () => {
		expect(Object.keys(UI.en).sort()).toEqual(Object.keys(UI.de).sort());
		for (const value of Object.values(UI.en))
			expect(value.length).toBeGreaterThan(2);
		expect(stageNames.en).toHaveLength(stageNames.de.length);
		for (const code of [
			"let n = ;",
			"let x = 1;\nprint(noSuchValue);",
			"while (true) {}",
			'print(1 == "1");',
			"let a=[0];\na[0]=a;",
		]) {
			const en = runProgram(code, [], 1200, "en"),
				de = runProgram(code);
			expect(en.ok).toBe(false);
			expect(en.error!.message).not.toBe(de.error!.message);
			expect(en.error!.line).toBe(de.error!.line);
			expect(en.error!.message).toBe(en.error!.messages.en);
		}
		const english = runProgram(
			"let score=0; while(score<2){score=score+1;} print(score);",
			[],
			1200,
			"en",
		);
		expect(english.output).toEqual(["2"]);
		for (const frame of english.trace)
			expect(frame.action).toBe(TRACE_ACTIONS[frame.actionKey].en);
		expect(english.trace[0].action).toBe("Value stored");
	});
	it("preserves existing German drafts and learning evidence while saving English independently", () => {
		const original = parseProgress(
			JSON.stringify({
				completed: ["algo-while"],
				quiz: ["algo-while"],
				drafts: { "algo-while": "let zaehler=3;" },
			}),
		);
		expect(original.locale).toBe("de");
		expect(isComplete(original, "algo-while")).toBe(true);
		let next = switchProgressLocale(
			original,
			"en",
			"algo-while",
			"let zaehler=4;",
		);
		expect(draftFor(next, "de", "algo-while")).toBe("let zaehler=4;");
		expect(draftFor(next, "en", "algo-while")).toBeUndefined();
		saveDraft(next, "en", "algo-while", "let counter=6;");
		next = switchProgressLocale(next, "de", "algo-while", "let counter=7;");
		expect(draftFor(next, "en", "algo-while")).toBe("let counter=7;");
		expect(draftFor(next, "de", "algo-while")).toBe("let zaehler=4;");
		expect(isComplete(next, "algo-while")).toBe(true);
		expect(original.drafts["algo-while"]).toBe("let zaehler=3;");
		expect(parseProgress(JSON.stringify(next))).toEqual(next);
		expect(progressLabel("en", 1, 20)).toBe("1 of 20 lessons practised");
	});
	it("gives explicit URL language precedence, uses saved preference otherwise and refuses unknown locales", () => {
		expect(localeFromHash("#lesson=algo-while&lang=en", "de")).toBe("en");
		expect(localeFromHash("#lesson=algo-while&lang=de", "en")).toBe("de");
		expect(localeFromHash("#lesson=algo-while", "en")).toBe("en");
		expect(localeFromHash("#lesson=algo-while&lang=xx", "en")).toBe("de");
		expect(asLocale(null)).toBe("de");
		expect(
			parseProgress(
				JSON.stringify({ locale: "xx", draftsEn: { unknown: "x" } }),
			).locale,
		).toBe("de");
		for (const locale of ["de", "en"] as Locale[]) {
			const hash = trainingHash("algo-while", locale);
			expect(lessonFromHash(hash)?.title).toBe(
				findLesson("algo-while", locale)?.title,
			);
			expect(lessonFromHash(hash)?.id).toBe("algo-while");
		}
	});
});
