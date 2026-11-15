import { describe, expect, it } from "vitest";
import { findLesson } from "../src/curriculum";
import {
	createAttempt,
	revealSolution,
	skipAttempt,
	submitAnswer,
} from "../src/exercises/attempt";
import { MODEL_SCENARIOS } from "../src/models";
import { pathLesson, visitLesson } from "../src/navigation";
import {
	completion,
	experimentSummary,
	freshExperiment,
	freshProgress,
	isComplete,
	parseProgress,
	writingKey,
} from "../src/storage/progress";
import { canAcceptSelfAssessment, checkWorkshop } from "../src/workshop";

describe("independent practice credit and storage recovery", () => {
	const lesson = findLesson("me-bewegung")!;
	it("consumes a revealed attempt before reload and awards no credit", () => {
		const p = freshProgress(),
			attempt = createAttempt(p, lesson, 1);
		revealSolution(p, attempt);
		expect(p.exerciseSerial[attempt.key]).toBe(1);
		expect(p.calculationDone[attempt.key] ?? 0).toBe(0);
		expect(submitAnswer(p, attempt, String(attempt.task.answer))).toBeNull();
		const restored = parseProgress(JSON.stringify(p)),
			next = createAttempt(restored, lesson, 1);
		expect(next.task.prompt).not.toBe(attempt.task.prompt);
		expect(next.solution).toBe(false);
		skipAttempt(p, attempt);
		revealSolution(p, attempt);
		expect(p.exerciseSerial[attempt.key]).toBe(1);
	});
	it("credits a successful attempt exactly once and separates the two levels", () => {
		const p = freshProgress(),
			attempt = createAttempt(p, lesson, 2);
		expect(submitAnswer(p, attempt, "")?.status).toBe("invalid");
		expect(submitAnswer(p, attempt, "99999")?.status).toBe("wrong");
		expect(submitAnswer(p, attempt, String(attempt.task.answer))?.status).toBe(
			"correct",
		);
		expect(submitAnswer(p, attempt, String(attempt.task.answer))).toBeNull();
		skipAttempt(p, attempt);
		expect(p.calculationDone[writingKey(lesson.id, 2)]).toBe(1);
		expect(p.calculationDone[writingKey(lesson.id, 1)]).toBeUndefined();
		expect(p.exerciseSerial[attempt.key]).toBe(1);
	});
	it("requires the workshop, quiz, self-assessment, comparisons and three numeric tasks on each level", () => {
		const p = freshProgress(),
			id = lesson.id,
			key = writingKey(id, 1);
		p.quizDone = [id];
		p.workshopDone = [id];
		p.writingDone = [key];
		p.drafts[key] = "Meine eigene Begründung zu Weg, Zeit und Geschwindigkeit.";
		expect(isComplete(p, id)).toBe(false);
		p.explored[id] = MODEL_SCENARIOS.motion.map((s) => s.id);
		p.calculationDone[key] = 3;
		expect(isComplete(p, id)).toBe(false);
		p.calculationDone[writingKey(id, 2)] = 2;
		expect(isComplete(p, id)).toBe(false);
		p.calculationDone[writingKey(id, 2)] = 3;
		expect(isComplete(p, id)).toBe(true);
		expect(completion(p)).toMatchObject({ total: 24, completed: 1 });
		expect(canAcceptSelfAssessment("kurz", [true, true, true])).toBe(false);
		expect(canAcceptSelfAssessment(p.drafts[key], [true, false, true])).toBe(
			false,
		);
		expect(canAcceptSelfAssessment(p.drafts[key], [true, true, true])).toBe(
			true,
		);
	});
	it("restores corrupted input safely and keeps this package on Group I", () => {
		expect(parseProgress("broken")).toEqual(freshProgress());
		expect(parseProgress("[]")).toEqual(freshProgress());
		const p = parseProgress(
			JSON.stringify({
				track: "II_III",
				includeExtra: true,
				activeLessonId: "el-trafo",
				drafts: {
					"me-bewegung:1": "x".repeat(9000),
					"me-messen:1": "short",
					bad: "unsafe",
				},
				writingDone: ["me-bewegung:1", "me-messen:1"],
				calculationDone: {
					"me-bewegung:1": 999,
					"me-messen:1": -1,
					"me-feder:1": 1.5,
				},
				explored: { "me-bewegung": ["slow", "unknown", "slow"] },
			}),
		);
		expect(p.track).toBe("I");
		expect(p.includeExtra).toBe(false);
		expect(p.activeLessonId).toBe("me-messen");
		expect(p.drafts["me-bewegung:1"]).toHaveLength(8000);
		expect(p.drafts.bad).toBeUndefined();
		expect(p.writingDone).toEqual(["me-bewegung:1"]);
		expect(p.calculationDone).toEqual({ "me-bewegung:1": 3 });
		expect(p.explored["me-bewegung"]).toEqual(["slow"]);
		expect(visitLesson(p, "op-linsen")?.id).toBe("op-linsen");
		expect(pathLesson(p).id).toBe("op-linsen");
		expect(visitLesson(p, "unknown")).toBeUndefined();
	});
	it("does not accept duplicate or partial answers as a solved sequence", () => {
		const w = findLesson("me-volumen")!.workshop;
		expect(checkWorkshop(w, [0, 0, 0, 0]).some(Boolean)).toBe(false);
		expect(checkWorkshop(w, [0, 1]).some(Boolean)).toBe(false);
	});
});

describe("five self-reported experiments, all three areas", () => {
	const done = {
		...freshExperiment(),
		status: "done" as const,
		question: "Fragestellung mit hinreichend genauer Beschreibung",
		setup: "Aufbau und konstant gehaltene Bedingungen",
		data: "Messdaten mit Einheiten und Unsicherheiten",
		conclusion: "Begründete Auswertung und Grenzen des Versuchs",
	};
	it("requires five documented entries and at least one per area", () => {
		expect(freshProgress().experiments.map((e) => e.lb)).toEqual([
			1, 1, 1, 2, 3,
		]);
		expect(experimentSummary([done, done, done, done, done]).ready).toBe(false);
		expect(
			experimentSummary([
				done,
				done,
				done,
				{ ...done, lb: 2 },
				{ ...done, lb: 3 },
			]).ready,
		).toBe(true);
		expect(
			experimentSummary([done, { ...done, lb: 2 }, { ...done, lb: 3 }]).ready,
		).toBe(false);
		expect(experimentSummary([{ ...done, data: "" }]).count).toBe(0);
		expect(experimentSummary([{ ...done, status: "planned" }]).count).toBe(0);
	});
	it("recovers each slot's own default and supports Optics as a distinct area", () => {
		expect(parseProgress("{}").experiments).toEqual(
			freshProgress().experiments,
		);
		const p = parseProgress(
			JSON.stringify({
				experiments: [{ lb: 3 }, { lb: "bad" }, {}, { lb: 2 }, { lb: 0 }],
			}),
		);
		expect(p.experiments.map((e) => e.lb)).toEqual([3, 1, 1, 2, 3]);
	});
});
