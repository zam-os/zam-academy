import type { LabKind } from "../model/types";
import type { LabView } from "./svg";
import { DREIECKE_VIERECKE_VIEWS } from "./views-dreiecke-vierecke";
import { DREHUNG_VIEWS } from "./views-drehung";
import { RAUMGEOMETRIE_VIEWS } from "./views-raumgeometrie";
import { TERME_GLEICHUNGEN_VIEWS } from "./views-terme-gleichungen";
import { BRUCHTERME_VIEWS } from "./views-bruchterme";
import { FUNKTIONEN_VIEWS } from "./views-funktionen";
import { DATEN_ZUFALL_VIEWS } from "./views-daten-zufall";

/**
 * Every lab draws itself as inline SVG from its values and readouts, and
 * names the points the learner can drag. One file per stage.
 */
const VIEWS: Record<LabKind, LabView> = {
  ...DREIECKE_VIERECKE_VIEWS,
  ...DREHUNG_VIEWS,
  ...RAUMGEOMETRIE_VIEWS,
  ...TERME_GLEICHUNGEN_VIEWS,
  ...BRUCHTERME_VIEWS,
  ...FUNKTIONEN_VIEWS,
  ...DATEN_ZUFALL_VIEWS,
};

export function labView(kind: LabKind): LabView {
  return VIEWS[kind];
}
