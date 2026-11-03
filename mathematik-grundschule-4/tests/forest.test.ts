import { describe, expect, it } from "vitest";
import { EXTRA_LESSON_IDS, FOREST_LESSONS } from "../src/course/catalog";
import {
	activeForestTask,
	advanceForest,
	forestKey,
	forestQuizTask,
	forestRecallEligible,
	freshForest,
	independentForest,
	recordForest,
	startForestPractice,
	validForest,
} from "../src/course/progress";
import {
	comparisonExplanation,
	correctForest,
	forestExit,
	forestLab,
	forestTask,
} from "../src/course/tasks";
import {
	forestGraphic,
	forestParentView,
	forestTeacherPanel,
} from "../src/course/view";
import { DocumentStore } from "../src/storage/progress";
import { lessonIdFromHash, validLessonHash } from "../src/zam/zam-link";

const need = <T>(value: T | null | undefined): T => {
	if (value == null) throw new Error("Expected a generated value");
	return value;
};
const complete = (p: ReturnType<typeof freshForest>) => {
	for (let step = 0; step < 40 && p.stage !== "finished"; step++) {
		const task = activeForestTask(p);
		if (task) recordForest(p, task, task.answer, 2000 + step);
		expect(advanceForest(p, 3000 + step)).toBe(true);
		expect(validForest(p)).toBe(true);
	}
	expect(p.stage).toBe("finished");
};
describe("Number Forest lessons", () => {
	it("has complete explanations and stable direct links for each lesson", () => {
		expect(FOREST_LESSONS).toHaveLength(12);
		for (const lesson of FOREST_LESSONS) {
			expect(lesson.goals).toHaveLength(3);
			expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(4);
			expect(lesson.example.length).toBeGreaterThan(100);
			expect(lesson.takeaway.length).toBeGreaterThan(40);
			expect(lesson.quiz.choices).toHaveLength(3);
			expect(validLessonHash(`#lesson=${lesson.id}`)).toBe(true);
			expect(lessonIdFromHash(`#lesson=${lesson.id}`)).toBe(lesson.id);
			expect(forestTeacherPanel(lesson)).toContain("Lehrervideo kommt noch");
			expect(forestTeacherPanel(lesson)).not.toContain("<video");
		}
		expect(lessonIdFromHash("#lesson=unknown")).toBe("stellenwerte-buendeln");
	});
	it("has exactly three reachable lab goals per lesson, none reached initially", () => {
		for (const id of EXTRA_LESSON_IDS)
			for (let goal = 0; goal < 3; goal++) {
				const task = forestLab(id, goal);
				const start =
					task.kind === "line" ||
					task.kind === "split" ||
					task.kind === "hops" ||
					task.kind === "groups"
						? 0
						: task.kind === "order"
							? []
							: null;
				expect(correctForest(task, start)).toBe(false);
				expect(correctForest(task, task.answer)).toBe(true);
				if (task.line)
					expect(
						task.line.start + Number(task.answer) * task.line.step,
					).toBeGreaterThan(task.line.start);
				if (task.whole)
					expect((task.whole * Number(task.answer)) / 10).toBeGreaterThan(0);
			}
	});
	it("agrees with independent numeric oracles over both levels and varied seeds", () => {
		for (const id of EXTRA_LESSON_IDS)
			for (const level of [1, 2] as const) {
				const variants = new Set<string>();
				for (let i = 0; i < 160; i++) {
					const task = forestTask(id, level, i * 7919, i % 12);
					variants.add(
						JSON.stringify([task.prompt, task.numbers, task.line, task.answer]),
					);
					expect(correctForest(task, task.answer)).toBe(true);
					if (task.kind === "order")
						expect(task.answer).toEqual(
							[...need(task.numbers)].sort((a, b) => a - b),
						);
					if (task.kind === "parts") {
						const answer = task.answer as number[];
						expect(new Set(task.numbers).size).toBe(need(task.numbers).length);
						expect(answer).toHaveLength(3);
						expect(answer.reduce((s, n) => s + n, 0)).toBe(
							Number(
								task.prompt.match(/für ([\d\s]+)\./)?.[1].replace(/\s/g, ""),
							),
						);
						expect(answer.every((n) => need(task.numbers).includes(n))).toBe(
							true,
						);
					}
					if (task.line) {
						expect(task.line.start).toBeGreaterThanOrEqual(0);
						expect(task.line.start + 10 * task.line.step).toBeLessThanOrEqual(
							1000000,
						);
						if (level === 1)
							expect(task.answer).toBe(
								task.line.start + task.line.marker * task.line.step,
							);
						else if ((i % 12) % 3 === 0)
							expect(task.answer).toBe(task.line.step);
						else {
							const match = need(
								task.prompt.match(
									/Er springt (\d+) Abschnitte nach (rechts|links)/,
								),
							);
							expect(task.answer).toBe(
								task.line.start +
									(task.line.marker +
										Number(match[1]) * (match[2] === "rechts" ? 1 : -1)) *
										task.line.step,
							);
						}
					}
					if (task.whole && task.kind === "number")
						expect(task.answer).toBe(task.whole - need(task.numbers)[0]);
					if (
						id === "zahlen-vergleichen-ordnen" &&
						level === 2 &&
						task.goal === 2
					) {
						const match = need(
							task.prompt.match(/„([\d\s]+) ist größer als ([\d\s]+)/),
						);
						expect(Number(match[1].replace(/\s/g, ""))).toBeGreaterThan(
							Number(match[2].replace(/\s/g, "")),
						);
						expect(need(task.numbers)[0]).toBeGreaterThan(
							need(task.numbers)[1],
						);
					}
					if (
						id === "zahlen-vergleichen-ordnen" &&
						task.kind === "choice" &&
						task.numbers &&
						task.goal === 1
					)
						expect(task.answer).toBe(
							Math.sign(task.numbers[0] - task.numbers[1]),
						);
				}
				expect(variants.size).toBeGreaterThan(80);
			}
	});
	it("balances the three comparison signs without teaching a fixed answer sequence", () => {
		const firstAnswers = new Set<number>();
		for (let seed = 0; seed < 80; seed++) {
			const answers = [0, 1, 2].map((index) =>
				Number(forestTask("zahlen-vergleichen-ordnen", 1, seed, index).answer),
			);
			expect([...answers].sort()).toEqual([-1, 0, 1]);
			firstAnswers.add(answers[0]);
		}
		expect(firstAnswers.size).toBe(3);
	});
	it("requires lab, quiz, three tasks per level and three exit tasks before both rewards", () => {
		for (const id of EXTRA_LESSON_IDS) {
			const p = freshForest(id, 1000);
			advanceForest(p);
			advanceForest(p);
			expect(p.stage).toBe("lab");
			expect(advanceForest(p)).toBe(false);
			complete(p);
			expect(p.labGoals).toEqual([0, 1, 2]);
			expect(p.quiz).toBe(true);
			expect(p.solved).toEqual({ 1: 3, 2: 3 });
			expect(p.attempts.filter((a) => a.mode === "exit")).toHaveLength(3);
			expect(p.rewards).toEqual(["mission-a", "mission-b"]);
			expect(advanceForest(p)).toBe(false);
			const rewards = [...p.rewards],
				completed = { ...p.completed };
			startForestPractice(p, 2, 123456);
			for (let i = 0; i < 4; i++) {
				const task = need(activeForestTask(p));
				recordForest(p, task, task.answer);
				advanceForest(p);
			}
			expect(p.rewards).toEqual(rewards);
			expect(p.completed).toEqual(completed);
		}
	});
	it("never turns hints, retries or an already seen task into independent evidence", () => {
		const p = freshForest(EXTRA_LESSON_IDS[0], 1000);
		complete(p);
		p.recall = { seed: 10, at: 100000000, index: 0 };
		const task = need(activeForestTask(p));
		p.helped.push(forestKey(p));
		recordForest(p, task, task.answer, 100000000);
		expect(independentForest(need(p.attempts.at(-1)))).toBe(false);
		p.recall.at++;
		recordForest(p, task, task.answer, 100000001);
		expect(independentForest(need(p.attempts.at(-1)))).toBe(false);
		p.recall = { seed: 300, at: 100000002, index: 0 };
		const fresh = need(activeForestTask(p));
		recordForest(
			p,
			fresh,
			Array.isArray(fresh.answer) ? [] : Number(fresh.answer) + 1,
			100000002,
		);
		recordForest(p, fresh, fresh.answer, 100000003);
		expect(independentForest(need(p.attempts.at(-1)))).toBe(false);
	});
	it("does not call a permuted copy of an ordering task fresh evidence", () => {
		const p = freshForest("zahlen-vergleichen-ordnen", 1000);
		complete(p);
		p.recall = { seed: 987654, at: 100000000, index: 1 };
		const task = need(activeForestTask(p));
		recordForest(p, task, task.answer, 100000000);
		p.recall.at++;
		recordForest(
			p,
			{ ...task, numbers: [...need(task.numbers)].reverse() },
			task.answer,
			100000001,
		);
		expect(independentForest(need(p.attempts.at(-1)))).toBe(false);
	});
	it("keeps scale labels truthful and does not print the marked answer on read tasks", () => {
		const task = forestTask("zahlenstrahl-zahlenspruenge", 1, 12, 0),
			graphic = forestGraphic(task);
		const textOnly = graphic.replace(/<[^>]*>/g, "");
		expect(textOnly).not.toContain(String(task.answer));
		expect(graphic).toContain("zehn gleich großen Abschnitten");
		expect(graphic).toContain('viewBox="0 0 700 150"');
		expect(comparisonExplanation(507030, 507003)).toContain("Zehnerstelle");
		expect(comparisonExplanation(100000, 99999)).toContain(
			"Anzahl der Stellen",
		);
		expect(comparisonExplanation(20000, 20000)).toContain("gleich groß");
	});
	it("preserves parent examples as observed tasks and distinguishes guided work", () => {
		const lesson = FOREST_LESSONS[2],
			p = freshForest(lesson.id, 1000);
		expect(forestParentView(lesson, p)).toContain("Noch offen");
		p.stage = "lab";
		const task = need(activeForestTask(p));
		recordForest(p, task, task.answer, 2000);
		const view = forestParentView(lesson, p);
		expect(view).toContain("Ausprobiert");
		expect(view).not.toContain("NEUE AUFGABE");
		const prompt = p.attempts[0].prompt;
		p.seed = 999;
		expect(p.attempts[0].prompt).toBe(prompt);
		expect(forestParentView(lesson, p)).toContain(prompt);
	});
	it("rejects malformed, mismatched or impossible progress rather than upgrading it", () => {
		const p = freshForest(EXTRA_LESSON_IDS[0], 1000);
		expect(validForest(p)).toBe(true);
		for (const bad of [
			null,
			{ ...p, lesson: "unknown" },
			{ ...p, position: 11 },
			{ ...p, stage: "lab", index: 99 },
			{ ...p, solved: { 1: 4, 2: 0 } },
			{ ...p, rewards: ["mission-a"], completed: { "mission-a": 2000 } },
			{ ...p, stage: "finished" },
			{ ...p, recall: { seed: 1, at: 1000, index: 0 } },
		])
			expect(validForest(bad)).toBe(false);
	});
	it("allows delayed checks only after a real elapsed day and keeps histories isolated", async () => {
		const a = freshForest(EXTRA_LESSON_IDS[0], 1000),
			b = freshForest(EXTRA_LESSON_IDS[1], 1000);
		complete(a);
		const done = a.completed["mission-b"];
		expect(forestRecallEligible(a, done - 1)).toBe(false);
		expect(forestRecallEligible(a, done + 86400000 - 1)).toBe(false);
		expect(forestRecallEligible(a, done + 86400000)).toBe(true);
		expect(b.rewards).toEqual([]);
		expect(b.stage).toBe("welcome");
		const memory = new DocumentStore(
			"isolated-forest-memory",
			() => freshForest(b.lesson),
			(v): v is typeof b => validForest(v) && v.lesson === b.lesson,
		);
		await memory.open({
			open() {
				throw new Error("blocked");
			},
		} as unknown as IDBFactory);
		await memory.update((p) => {
			p.stage = "learn";
		});
		expect(memory.mode).toBe("memory");
		expect(memory.state.stage).toBe("learn");
		memory.close();
	});
	it("has fresh exit variations and three relevant goal types for every lesson", () => {
		for (const id of EXTRA_LESSON_IDS) {
			const goals = new Set(
				[0, 1, 2].map((index) => forestExit(id, 0, index).goal),
			);
			expect([...goals].sort()).toEqual([1, 2, 3]);
			const variants = new Set(
				Array.from({ length: 80 }, (_, seed) =>
					JSON.stringify([0, 1, 2].map((index) => forestExit(id, seed, index))),
				),
			);
			expect(variants.size).toBeGreaterThan(60);
		}
	});
});

it("keeps quiz grading attached to explicit correct markers when options move", () => {
	for (const lesson of FOREST_LESSONS) {
		const quiz = lesson.quiz;
		expect(quiz.choices.filter((choice) => choice.correct)).toHaveLength(1);
		const reordered = {
			...quiz,
			choices: [
				quiz.choices[1],
				quiz.choices[2],
				quiz.choices[0],
			] as typeof quiz.choices,
		};
		const task = forestQuizTask(reordered);
		expect(
			task.choices?.find((choice) => choice.value === task.answer)?.label,
		).toBe(quiz.choices.find((choice) => choice.correct)?.label);
		expect(() =>
			forestQuizTask({
				...quiz,
				choices: quiz.choices.map((choice) => ({
					...choice,
					correct: false,
				})) as typeof quiz.choices,
			}),
		).toThrow();
	}
});
