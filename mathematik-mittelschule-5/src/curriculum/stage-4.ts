import { makeStage } from "./builders";
import { einheiten } from "./stage-4-extra";
import { LESSONS as PART0 } from "./stage-4-part-1";
export const STAGE = makeStage(
  4,
  "Einheitsquadrate, Rechtecke und zusammengesetzte Flächen",
  "#059669",
  "\u25a6",
  [...PART0, einheiten],
);
