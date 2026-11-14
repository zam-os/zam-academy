import type { Lesson, Source, Stage } from "../model/types";
import methods from "./lessons-methods.json";
import water from "./lessons-water.json";
import aquatic from "./lessons-aquatic.json";
import soil from "./lessons-soil.json";
import health from "./lessons-health.json";
import forces from "./lessons-forces.json";
import tools from "./lessons-tools.json";
import motion from "./lessons-motion.json";
import outline from "./outline.json";

/** Curriculum sequence; original lesson identifiers remain stable. */
export const LESSONS: Lesson[] = [
	...methods,
	...water,
	...aquatic,
	...soil,
	...health,
	...forces,
	...tools,
	...motion,
] as unknown as Lesson[];
export const CORE_LESSONS = LESSONS;
export const STAGES: Stage[] = outline.stages;
export const SOURCES: Source[] = outline.sources;
export const CURRICULUM_URL = SOURCES[0].url;
export const findLesson = (id: string) =>
	LESSONS.find((lesson) => lesson.id === id);
