import type { LabKind } from "../model/types";
import type { LabView } from "./svg";
import { PROZENT_RATIONALE_VIEWS } from "./views-prozent-rationale";
import { GEOMETRIE_VIEWS } from "./views-geometrie";
import { FLAECHEN_VOLUMEN_VIEWS } from "./views-flaechen-volumen";
import { DATEN_ALGEBRA_VIEWS } from "./views-daten-algebra";

const VIEWS: Record<LabKind, LabView> = {
  ...(PROZENT_RATIONALE_VIEWS as Record<string, LabView>),
  ...(GEOMETRIE_VIEWS as Record<string, LabView>),
  ...(FLAECHEN_VOLUMEN_VIEWS as Record<string, LabView>),
  ...(DATEN_ALGEBRA_VIEWS as Record<string, LabView>),
} as Record<LabKind, LabView>;

export const labView = (kind: LabKind): LabView => VIEWS[kind];
