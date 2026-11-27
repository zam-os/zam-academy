/**
 * A lab provides the controls, drawing and three goals used by the
 * course and its tests. The UI records goals reached during exploration.
 */
import type { LabId } from "../model/types";
import { esc } from "../workshop";

export type LabValue = number | string | boolean;
export type LabState = Record<string, LabValue>;

export interface LabGoal {
  text: string;
  reached: (s: LabState) => boolean;
}

export interface LabDef {
  id: LabId;
  title: string;
  intro: string;
  initial: () => LabState;
  goals: [LabGoal, LabGoal, LabGoal];
  /** Controls, drawing and readout for a state. */
  render: (s: LabState) => string;
  /** One state per goal that reaches it; used by the tests. */
  witnesses: [LabState, LabState, LabState];
  /** What the model simplifies. */
  note: string;
}

export const num = (s: LabState, key: string): number => Number(s[key]);
export const str = (s: LabState, key: string): string => String(s[key]);
export function range(
  key: string,
  label: string,
  value: number,
  min: number,
  max: number,
  step: number,
  shown: string,
): string {
  return `<label class="lab-range"><span>${esc(label)} <output>${esc(shown)}</output></span><input type="range" data-lab-range="${key}" min="${min}" max="${max}" step="${step}" value="${value}" aria-label="${esc(label)}"></label>`;
}

export function choice(
  key: string,
  label: string,
  current: LabValue,
  options: Array<[string, string]>,
): string {
  return `<div class="lab-choice" role="group" aria-label="${esc(label)}"><span>${esc(label)}</span>${options
    .map(
      ([value, text]) =>
        `<button type="button" data-lab-set="${key}" data-lab-value="${esc(value)}" aria-pressed="${String(current) === value}">${esc(text)}</button>`,
    )
    .join("")}</div>`;
}

export function readout(text: string, tone: "" | "good" | "warn" = ""): string {
  return `<p class="lab-readout ${tone}" role="status">${text}</p>`;
}
