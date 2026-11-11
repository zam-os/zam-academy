import { makeStage } from "./builders";
import { dreiecksUmfang, koordinaten, winkel } from "./stage-3-extra";
import { LESSONS as PART0 } from "./stage-3-part-1";
import { LESSONS as PART1 } from "./stage-3-part-2";
export const STAGE = makeStage(
  3,
  "Punkte, Linien, Winkel und Umfang",
  "#7c3aed",
  "\ud83d\udcd0",
  [...PART0, ...PART1, koordinaten, winkel, dreiecksUmfang],
);
