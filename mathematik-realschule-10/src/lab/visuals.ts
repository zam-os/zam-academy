import type { LabKind } from "../model/types";
import type { LabView } from "./svg";
import { EINHEITSKREIS_VIEWS } from "./views-einheitskreis";
import { DREIECKE_VIEWS } from "./views-dreiecke";
import { VEKTOREN_ABBILDUNGEN_VIEWS } from "./views-vektoren-abbildungen";
import { POTENZEN_VIEWS } from "./views-potenzen";
import { EXPONENTIAL_LOGARITHMUS_VIEWS } from "./views-exponential-logarithmus";
import { RAUMGEOMETRIE_VIEWS } from "./views-raumgeometrie";
import { QUADRATISCH_VIEWS } from "./views-quadratisch";
import { DATEN_ZUFALL_VIEWS } from "./views-daten-zufall";

/**
 * Every lab draws itself as inline SVG from its values and readouts, and
 * names the points the learner can drag. One file per stage.
 */
const VIEWS: Record<LabKind, LabView> = {
  ...EINHEITSKREIS_VIEWS,
  ...DREIECKE_VIEWS,
  ...VEKTOREN_ABBILDUNGEN_VIEWS,
  ...POTENZEN_VIEWS,
  ...EXPONENTIAL_LOGARITHMUS_VIEWS,
  ...RAUMGEOMETRIE_VIEWS,
  ...QUADRATISCH_VIEWS,
  ...DATEN_ZUFALL_VIEWS,
};

export function labView(kind: LabKind): LabView {
  return VIEWS[kind];
}
