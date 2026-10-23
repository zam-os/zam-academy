import type { LabKind } from "../model/types";
import { POTENZEN_VIEWS } from "./views-potenzen";
import { VERSCHIEBUNG_VIEWS } from "./views-verschiebung";
import { DREIECKE_VIEWS } from "./views-dreiecke";
import { RAUM_VIEWS } from "./views-raum";
import { ORTSLINIEN_VIEWS } from "./views-ortslinien";
import { ANWENDUNG_VIEWS } from "./views-anwendungen";
import type { LabView } from "./svg";

const VIEWS: Record<LabKind, LabView> = {
  ...POTENZEN_VIEWS,
  ...VERSCHIEBUNG_VIEWS,
  ...DREIECKE_VIEWS,
  ...RAUM_VIEWS,
  ...ORTSLINIEN_VIEWS,
  ...ANWENDUNG_VIEWS,
};
export const labView = (kind: LabKind): LabView => VIEWS[kind];
