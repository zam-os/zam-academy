import { LESSON_BY_ID } from "../curriculum";
import { createRng } from "../model/format";
import type { ExerciseTask } from "../model/types";
import { generateLb1ToLb3Task } from "./generators-lb1-lb3";
import { generateLb4ToLb6Task } from "./generators-lb4-lb6";

export function generateExerciseTask(
	lessonId: string,
	level: 1 | 2,
	seed: number,
): ExerciseTask {
	const lesson = LESSON_BY_ID.get(lessonId);
	if (!lesson) {
		throw new Error(`Unbekannte Lektion: ${lessonId}`);
	}
	const combinedSeed = (seed * 2654435761 + lesson.number * 97 + level * 31) >>> 0;
	const rng = createRng(combinedSeed);
	if (lesson.lb <= 3) {
		return generateLb1ToLb3Task(lessonId, level, rng, seed);
	}
	return generateLb4ToLb6Task(lessonId, level, rng, seed);
}
