import { makeStage } from "./builders";
import { bauten } from "./stage-5-extra";
import { LESSONS as PART0 } from "./stage-5-part-1";
export const STAGE = makeStage(
  5,
  "Einheitswürfel, Raumeinheiten und zusammengesetzte Körper",
  "#c2410c",
  "\u25a3",
  [...PART0, bauten],
);
