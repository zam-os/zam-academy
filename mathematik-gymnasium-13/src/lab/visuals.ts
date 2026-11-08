import type { LabKind } from "../model/types";
import { INTEGRAL_VIEWS } from "./views-1-integral";
import { NORMALVERTEILUNG_VIEWS } from "./views-2-normalverteilung";
import { RAUMGEOMETRIE_VIEWS } from "./views-3-raumgeometrie";
import { ANWENDUNGEN_VIEWS } from "./views-4-anwendungen";
import type { LabView } from "./svg";

const VIEWS: Record<LabKind, LabView> = {
  ...INTEGRAL_VIEWS,
  ...NORMALVERTEILUNG_VIEWS,
  ...RAUMGEOMETRIE_VIEWS,
  ...ANWENDUNGEN_VIEWS,
};
export const labView = (kind: LabKind): LabView => VIEWS[kind];
export const LAB_KINDS: LabKind[] = Object.keys(VIEWS);
