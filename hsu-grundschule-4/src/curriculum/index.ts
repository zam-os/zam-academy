import type { Lesson, Stage, StageId } from "../model/types";
import { LESSONS_LB1_LB2 } from "./lessons-lb1-lb2";
import { LESSONS_LB3 } from "./lessons-lb3";
import { LESSONS_LB4_LB6 } from "./lessons-lb4-lb6";
import { buildLexikonGroups, REFERENCE_TABLES } from "./lexikon";
import { STAGES } from "./stages";

export { STAGES, REFERENCE_TABLES };
export type { LexikonEntry, LexikonStageGroup, ReferenceTable } from "./lexikon";

export const LESSONS: ReadonlyArray<Lesson> = [
	...LESSONS_LB1_LB2,
	...LESSONS_LB3,
	...LESSONS_LB4_LB6,
];

export const LESSON_BY_ID: ReadonlyMap<string, Lesson> = new Map(
	LESSONS.map((lesson) => [lesson.id, lesson]),
);

export const STAGE_BY_ID: ReadonlyMap<StageId, Stage> = new Map(
	STAGES.map((stage) => [stage.id, stage]),
);

export const LEXIKON_GROUPS = buildLexikonGroups(STAGES, LESSONS);
