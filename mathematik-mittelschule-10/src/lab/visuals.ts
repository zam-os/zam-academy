import type { LabKind } from "../model/types";
import type { LabView } from "./svg";
import { POTENZEN_VIEWS } from "./views-potenzen";
import { WACHSTUM_VIEWS } from "./views-wachstum";
import { AEHNLICHKEIT_VIEWS } from "./views-aehnlichkeit";
import { TRIGONOMETRIE_VIEWS } from "./views-trigonometrie";
import { KUGEL_VIEWS } from "./views-kugel";
import { ZUFALL_VIEWS } from "./views-zufall";
import { FUNKTIONEN_VIEWS } from "./views-funktionen";

/**
 * Every lab draws itself as inline SVG from its values and readouts and names
 * the points the learner can drag. One file per Lernbereich.
 */
const VIEWS: Record<LabKind, LabView> = {
  ...POTENZEN_VIEWS,
  ...WACHSTUM_VIEWS,
  ...AEHNLICHKEIT_VIEWS,
  ...TRIGONOMETRIE_VIEWS,
  ...KUGEL_VIEWS,
  ...ZUFALL_VIEWS,
  ...FUNKTIONEN_VIEWS,
};
export const labView = (kind: LabKind): LabView => VIEWS[kind];
