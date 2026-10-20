import type { LabKind } from "../model/types";
import type { LabView } from "./svg";
import { DREIECKE_VIEWS } from "./views-dreiecke";
import { KREIS_RAUM_VIEWS } from "./views-kreis-raum";
import { GLEICHUNGSSYSTEME_VIEWS } from "./views-gleichungssysteme";
import { QUADRATISCH_VIEWS } from "./views-quadratisch";
import { DATEN_ZUFALL_VIEWS } from "./views-daten-zufall";

/**
 * Every lab draws itself as inline SVG from its values and readouts, and
 * names the points the learner can drag. One file per stage.
 */
const VIEWS: Record<LabKind, LabView> = {
  ...DREIECKE_VIEWS,
  ...KREIS_RAUM_VIEWS,
  ...GLEICHUNGSSYSTEME_VIEWS,
  ...QUADRATISCH_VIEWS,
  ...DATEN_ZUFALL_VIEWS,
};

export function labView(kind: LabKind): LabView {
  return VIEWS[kind];
}
