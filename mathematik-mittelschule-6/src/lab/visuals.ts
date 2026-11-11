import type { LabKind } from "../model/types";
import type { LabView } from "./svg";
import { BRUECHE_VIEWS } from "./views-brueche";
import { DATEN_VIEWS } from "./views-daten";
import { DEZIMAL_VIEWS } from "./views-dezimal";
import { EXTRA_VIEWS } from "./views-extra";
import { GEOMETRIE_VIEWS } from "./views-geometrie";
import { RAUM_VIEWS } from "./views-raum";
import { SURFACE_VIEWS } from "./views-surface";

const VIEWS: Record<LabKind, LabView> = {
  ...BRUECHE_VIEWS,
  ...DEZIMAL_VIEWS,
  ...RAUM_VIEWS,
  ...SURFACE_VIEWS,
  ...EXTRA_VIEWS,
  ...GEOMETRIE_VIEWS,
  ...DATEN_VIEWS,
};
export const labView = (kind: LabKind): LabView => VIEWS[kind];
