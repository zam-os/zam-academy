import { makeStage } from "./builders";
import { schreibweisen } from "./stage-5-extra";
import { LESSONS as PART0 } from "./stage-5-part-1";
export const STAGE = makeStage(
  5,
  "Schätzen, messen, umrechnen und sinnvoll entscheiden",
  "#c2410c",
  "\u2696",
  [...PART0, schreibweisen],
);
