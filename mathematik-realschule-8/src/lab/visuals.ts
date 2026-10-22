import type { LabKind } from "../model/types";
import type { LabView } from "./svg";
import { ALGEBRA_VIEWS } from "./views-algebra";
import { FIGUREN_VIEWS } from "./views-figuren";
import { FUNKTIONEN_VIEWS } from "./views-funktionen";
import { RAUM_VIEWS } from "./views-raum";
import { ZUFALL_VIEWS } from "./views-zufall";

const VIEWS = {
  ...FIGUREN_VIEWS,
  ...RAUM_VIEWS,
  ...ALGEBRA_VIEWS,
  ...FUNKTIONEN_VIEWS,
  ...ZUFALL_VIEWS,
};
export function labView(kind: LabKind): LabView {
  const view = VIEWS[kind];
  if (!view) throw new Error(`Missing lab drawing: ${kind}`);
  return view;
}
