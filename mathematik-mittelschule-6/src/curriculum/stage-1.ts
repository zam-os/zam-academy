import { makeStage } from "./builders";
import { regeln, teilen } from "./stage-1-extra";
import { LESSONS as PART0 } from "./stage-1-part-1";
export const STAGE = makeStage(
  1,
  "Bruchteile verstehen, Darstellungen wechseln und rechnen",
  "#2563eb",
  "\u00bd",
  [...PART0, teilen, regeln],
);
