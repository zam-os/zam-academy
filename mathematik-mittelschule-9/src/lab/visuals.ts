import type { LabKind } from "../model/types";
import type { LabView } from "./svg";
import { FLAECHEN_VIEWS } from "./views-flaechen";
import { FUNKTIONEN_VIEWS } from "./views-funktionen";
import { GEOMETRIE_VIEWS } from "./views-geometrie";
import { GLEICHUNGEN_VIEWS } from "./views-gleichungen";
import { POTENZEN_VIEWS } from "./views-potenzen";
import { RAUM_VIEWS } from "./views-raum";
import { ZINSEN_VIEWS } from "./views-zinsen";
import { ZUFALL_VIEWS } from "./views-zufall";

/**
 * Every lab draws itself as inline SVG from its values and readouts and names
 * the points the learner can drag. One file per Lernbereich.
 */
const VIEWS: Record<LabKind, LabView> = {
  ...ZINSEN_VIEWS,
  ...POTENZEN_VIEWS,
  ...GEOMETRIE_VIEWS,
  ...FLAECHEN_VIEWS,
  ...RAUM_VIEWS,
  ...ZUFALL_VIEWS,
  ...GLEICHUNGEN_VIEWS,
  ...FUNKTIONEN_VIEWS,
};
export const labView = (kind: LabKind): LabView => VIEWS[kind];
