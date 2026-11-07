import type { LabKind } from "../model/types";
import { BRUECHE_VIEWS } from "./views-brueche";
import { DEZIMAL_VIEWS } from "./views-dezimal";
import { SPIEGELUNG_VIEWS } from "./views-spiegelung";
import { FLAECHEN_VIEWS } from "./views-flaechen";
import { RAUM_VIEWS } from "./views-raum";
import { TERME_VIEWS } from "./views-terme";
import { PROPORTION_VIEWS } from "./views-proportion";
import type { LabView } from "./svg";

const VIEWS: Record<LabKind, LabView> = {
  ...BRUECHE_VIEWS,
  ...DEZIMAL_VIEWS,
  ...SPIEGELUNG_VIEWS,
  ...FLAECHEN_VIEWS,
  ...RAUM_VIEWS,
  ...TERME_VIEWS,
  ...PROPORTION_VIEWS,
};
export const labView = (kind: LabKind): LabView => VIEWS[kind];
