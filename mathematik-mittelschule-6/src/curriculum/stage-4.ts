import { makeStage } from "./builders";
import { kontakt } from "./stage-4-extra";
import { LESSONS as PART0 } from "./stage-4-part-1";
export const STAGE = makeStage(
  4,
  "Flächen eines Körpers im Netz wiederfinden",
  "#059669",
  "\u25b1",
  [...PART0, kontakt],
);
