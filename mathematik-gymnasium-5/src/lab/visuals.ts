import type { LabKind } from "../model/types";
import { FLAECHEN_VIEWS } from "./views-flaechen";
import { GANZ_VIEWS } from "./views-ganz";
import { GEOMETRIE_VIEWS } from "./views-geometrie";
import { GROESSEN_VIEWS } from "./views-groessen";
import { GYM_VIEWS } from "./views-gym";
import { NATUERLICH_VIEWS } from "./views-natuerlich";
import type { LabView } from "./svg";

const VIEWS: Record<LabKind, LabView> = {
  ...NATUERLICH_VIEWS,
  ...GANZ_VIEWS,
  ...GEOMETRIE_VIEWS,
  ...GROESSEN_VIEWS,
  ...FLAECHEN_VIEWS,
  ...GYM_VIEWS,
};
export const labView = (kind: LabKind): LabView => VIEWS[kind];
export const LAB_KINDS: LabKind[] = Object.keys(VIEWS);
