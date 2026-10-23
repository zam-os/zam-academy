import type { LabKind } from "../model/types";

export type LabState = Record<string, number>;

export interface Slider {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  value: number;
  /** How the current value reads next to the slider; defaults to the plain number. */
  show?: (value: number) => string;
}

export interface Select {
  key: string;
  label: string;
  options: Array<{ value: number; label: string }>;
  value: number;
}

export interface Goal {
  id: string;
  text: string;
  test: (state: LabState) => boolean;
}

export interface LabView {
  /** Inline SVG or a styled flow of boxes; built only from escaped text and numbers. */
  figure: string;
  readouts: Array<[label: string, value: string]>;
  note: string;
}

export interface LabDef {
  kind: LabKind;
  title: string;
  intro: string;
  sliders: Slider[];
  selects: Select[];
  goals: Goal[];
  view: (state: LabState) => LabView;
  /** For every goal one state that reaches it; the tests walk through them. */
  witness: Record<string, LabState>;
}

export const initialState = (def: LabDef): LabState => {
  const state: LabState = {};
  for (const s of def.sliders) state[s.key] = s.value;
  for (const s of def.selects) state[s.key] = s.value;
  return state;
};

/** Keeps every value inside its control's range and on its step grid. */
export function clampState(def: LabDef, raw: LabState): LabState {
  const state = initialState(def);
  for (const s of def.sliders) {
    const value = raw[s.key];
    if (typeof value !== "number" || !Number.isFinite(value)) continue;
    const steps = Math.round((Math.min(s.max, Math.max(s.min, value)) - s.min) / s.step);
    state[s.key] = Math.round((s.min + steps * s.step) * 1e6) / 1e6;
  }
  for (const s of def.selects) {
    const value = raw[s.key];
    if (s.options.some((o) => o.value === value)) state[s.key] = value;
  }
  return state;
}

export const goalsReached = (def: LabDef, state: LabState): string[] =>
  def.goals.filter((g) => g.test(state)).map((g) => g.id);

/** A drawing area with a fixed viewBox; classes carry every colour so both themes work. */
export const svg = (label: string, body: string, width = 480, height = 300): string =>
  `<svg class="lab-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">${body}</svg>`;

export const mapRange = (
  value: number,
  from: [number, number],
  to: [number, number],
): number => to[0] + ((value - from[0]) / (from[1] - from[0])) * (to[1] - to[0]);

export const points = (list: Array<[number, number]>): string =>
  list.map(([x, y]) => `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`).join(" ");

/** One box of a step-by-step flow: `state` is "ok", "no" or "skip". */
export const step = (state: "ok" | "no" | "skip", title: string, text: string): string =>
  `<div class="flow-step flow-${state}"><span class="flow-mark" aria-hidden="true">${state === "ok" ? "✓" : state === "no" ? "✕" : "–"}</span><div><strong>${title}</strong><p>${text}</p></div></div>`;
