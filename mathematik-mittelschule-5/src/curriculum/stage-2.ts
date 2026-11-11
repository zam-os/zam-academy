import { makeStage } from "./builders";
import { aenderungen } from "./stage-2-extra";
import { LESSONS as PART0 } from "./stage-2-part-1";
export const STAGE = makeStage(
  2,
  "Zustand, Reihenfolge und Änderungen am Zahlenstrahl",
  "#0891b2",
  "\ud83c\udf21",
  [...PART0, aenderungen],
);
