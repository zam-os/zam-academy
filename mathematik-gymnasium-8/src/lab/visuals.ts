import type { LabView } from "./svg";
import { VIEWS_FUNKTIONEN } from "./views-funktionen";
import { VIEWS_LINEAR } from "./views-linear";
import { VIEWS_GEBROCHEN } from "./views-gebrochen";
import { VIEWS_BRUCHTERME } from "./views-bruchterme";
import { VIEWS_LAPLACE } from "./views-laplace";
import { VIEWS_LGS } from "./views-lgs";
import { VIEWS_KREIS_ZYLINDER } from "./views-kreis-zylinder";

const VIEWS: Record<string, LabView> = {
  ...VIEWS_FUNKTIONEN,
  ...VIEWS_LINEAR,
  ...VIEWS_GEBROCHEN,
  ...VIEWS_BRUCHTERME,
  ...VIEWS_LAPLACE,
  ...VIEWS_LGS,
  ...VIEWS_KREIS_ZYLINDER,
};

export const LAB_KINDS = Object.keys(VIEWS);

export function labView(kind: string): LabView {
  const view = VIEWS[kind];
  if (!view) {
    throw new Error(`Missing lab view for kind "${kind}"`);
  }
  return view;
}
