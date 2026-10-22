import type { LabKind } from "../model/types";
import type { LabView } from "./svg";
import { MATHE10_VIEWS } from "./views-mathe10";

export function labView(kind: LabKind): LabView {
  const view = MATHE10_VIEWS[kind];
  if (!view) {
    throw new Error(`Unknown lab kind: ${kind}`);
  }
  return view;
}
