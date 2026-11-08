import type { LabKind } from "../model/types";
import type { LabView } from "./svg";
import { FUNKTIONEN_VIEWS } from "./views-funktionen";
import { GEBROCHEN_RATIONAL_VIEWS } from "./views-gebrochen-rational";
import { WAHRSCHEINLICHKEIT_VIEWS } from "./views-wahrscheinlichkeit";
import { DIFFERENZIEREN_VIEWS } from "./views-differenzieren";
import { KURVENUNTERSUCHUNG_VIEWS } from "./views-kurvenuntersuchung";

/**
 * Every lab draws itself as inline SVG from its values and readouts, and
 * names the points the learner can drag. One file per stage.
 */
const VIEWS: Record<string, LabView> = {
  ...FUNKTIONEN_VIEWS,
  ...GEBROCHEN_RATIONAL_VIEWS,
  ...WAHRSCHEINLICHKEIT_VIEWS,
  ...DIFFERENZIEREN_VIEWS,
  ...KURVENUNTERSUCHUNG_VIEWS,
};

export function labView(kind: LabKind): LabView {
  return VIEWS[kind];
}
