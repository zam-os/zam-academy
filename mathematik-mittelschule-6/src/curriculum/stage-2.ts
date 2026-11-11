import { makeStage } from "./builders";
import { aenderungen, wiederholen } from "./stage-2-extra";
import { LESSONS as PART0 } from "./stage-2-part-1";
export const STAGE = makeStage(
  2,
  "Rationale Zahlen ordnen und Änderungen anschaulich verstehen",
  "#0891b2",
  "\u2194",
  [...PART0, aenderungen, wiederholen],
);
