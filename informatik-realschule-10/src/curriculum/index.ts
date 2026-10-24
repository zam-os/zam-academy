import type { Lesson, Module, Source, Workshop } from "../types";
import data from "./lessons.json";
import modules from "./modules.json";
import sources from "./sources.json";
import workshops from "./workshops.json";

export const WORKSHOPS: Record<string, Workshop> = workshops;
export const LESSONS = data as Lesson[];
export const MODULES = modules as Module[];
export const SOURCES: Source[] = sources;
export const APP_URL = "https://academy.zam-os.org/informatik-realschule-10/";
export const CELL_ID = "zam-academy:informatik-realschule-10";
export const CELL_TITLE =
  "Informatik 10 Realschule · IT-Vertiefungen (ZAM Academy)";
export const lessonLink = (id: string): string =>
  `${APP_URL}#lesson=${encodeURIComponent(id)}`;
export const findLesson = (id: string) =>
  LESSONS.find((lesson) => lesson.id === id);
