import type {
  LabDefinition,
  LabKind,
  LabValues,
  ReadoutValues,
} from "../model/types";
import { MECHANIK_RENDERERS } from "./visuals-mechanik";
import { ELEKTRIK_RENDERERS } from "./visuals-elektrik";
import { ENERGIE_RENDERERS } from "./visuals-energie";
import { OPTIK_RENDERERS } from "./visuals-optik";
import { WAERME_RENDERERS } from "./visuals-waerme";
import { WAHL_RENDERERS } from "./visuals-wahl";

/**
 * Every lab draws itself as inline SVG from the current slider values and
 * readouts (see draw.ts). One module per stage keeps the drawings together
 * with the lessons they belong to.
 */
export type Renderer = (v: LabValues, r: ReadoutValues) => string;

const RENDERERS: Partial<Record<LabKind, Renderer>> = {
  ...MECHANIK_RENDERERS,
  ...OPTIK_RENDERERS,
  ...ENERGIE_RENDERERS,
  ...WAERME_RENDERERS,
  ...ELEKTRIK_RENDERERS,
  ...WAHL_RENDERERS,
};

/** True when a drawing exists for the lab kind; the tests prove it for every lesson. */
export function hasLabVisual(kind: LabKind): boolean {
  return RENDERERS[kind] !== undefined;
}

export function renderLabVisual(
  lab: LabDefinition,
  values: LabValues,
  readouts: ReadoutValues,
): string {
  const render = RENDERERS[lab.kind];
  if (!render) throw new Error(`No drawing for lab kind "${lab.kind}"`);
  return render(values, readouts);
}
