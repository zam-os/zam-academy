import { makeStage } from "./builders";
import { folgen, regeln } from "./stage-1-extra";
import { LESSONS as PART0 } from "./stage-1-part-1";
export const STAGE = makeStage(
  1,
  "Große Zahlen darstellen, sicher rechnen und Ergebnisse prüfen",
  "#2563eb",
  "\ud83d\udd22",
  [...PART0, folgen, regeln],
);
