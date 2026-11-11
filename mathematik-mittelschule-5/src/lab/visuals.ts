import type { LabKind } from "../model/types";
import type { LabView } from "./svg";
import { DATEN_VIEWS } from "./views-daten";
import { EXTRA_VIEWS } from "./views-extra";
import { FLAECHEN_VIEWS } from "./views-flaechen";
import { GANZ_VIEWS } from "./views-ganz";
import { GEOMETRIE_VIEWS } from "./views-geometrie";
import { GROESSEN_VIEWS } from "./views-groessen";
import { NATUERLICH_VIEWS } from "./views-natuerlich";

const VIEWS: Record<LabKind, LabView> = {
  ...EXTRA_VIEWS,
  ...NATUERLICH_VIEWS,
  ...GANZ_VIEWS,
  ...GEOMETRIE_VIEWS,
  ...GROESSEN_VIEWS,
  ...FLAECHEN_VIEWS,
  ...DATEN_VIEWS,
};
export const labView = (kind: LabKind): LabView => VIEWS[kind];
