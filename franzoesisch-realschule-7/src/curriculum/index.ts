import type { Lesson, Source, Stage } from "../types";
import bonjour from "./lessons-1-bonjour.json";
import famille from "./lessons-2-famille.json";
import verbes from "./lessons-3-verbes.json";
import echanges from "./lessons-4-echanges.json";
import journee from "./lessons-5-journee.json";
import ville from "./lessons-6-ville.json";
import france from "./lessons-7-france.json";
import outils from "./lessons-8-outils.json";
import outline from "./outline.json";

// One file per stage, in learning-path order. JSON shape and all referenced
// identifiers are checked by the content suite.
export const LESSONS = [
	...bonjour,
	...famille,
	...verbes,
	...echanges,
	...journee,
	...ville,
	...france,
	...outils,
] as unknown as Lesson[];
export const STAGES = outline.stages as Stage[];
export const SOURCES = outline.sources as Source[];
export const findLesson = (id: string): Lesson | undefined =>
	LESSONS.find((lesson) => lesson.id === id);
