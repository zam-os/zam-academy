import type { LabView } from "./svg";
import { VIEWS_TERME } from "./views-terme";
import { VIEWS_SYMMETRIE } from "./views-symmetrie";
import { VIEWS_GLEICHUNGEN } from "./views-gleichungen";
import { VIEWS_DATEN } from "./views-daten";
import { VIEWS_KONGRUENZ } from "./views-kongruenz";

const VIEWS: Record<string, LabView> = {
  ...VIEWS_TERME,
  ...VIEWS_SYMMETRIE,
  ...VIEWS_GLEICHUNGEN,
  ...VIEWS_DATEN,
  ...VIEWS_KONGRUENZ,
};

export const LAB_KINDS = Object.keys(VIEWS);

export function labView(kind: string): LabView {
  const view = VIEWS[kind];
  if (!view) {
    throw new Error(`Missing lab view for kind "${kind}"`);
  }
  return view;
}
