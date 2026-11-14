/**
 * The interactive labs. A lab is a small model with a state, a drawing and
 * exactly three goals. No goal is reached in the initial state; the tests
 * prove each goal reachable with a witness state.
 *
 * The page binds controls generically by data attributes, so a lab only
 * describes its state and its drawing:
 * - `data-lab-range="key"` on an <input type="range">: state[key] = number
 * - `data-lab-set="key" data-lab-value="v"` on a button: state[key] = v
 * - `data-lab-paint="key"` on an SVG element: state[key] = state.pen
 * - `data-lab-drag="handle"` on an SVG element: pointer and arrow keys move
 *   the handle; `handles[handle].move` turns a point of the drawing into state.
 */
import type { LabId } from "../model/types";
import { esc } from "../workshop";

export type LabValue = number | string | boolean;
export type LabState = Record<string, LabValue>;

export interface LabGoal {
  text: string;
  reached: (s: LabState) => boolean;
}

export interface LabHandle {
  /** Current position of the handle in the coordinates of the drawing. */
  pos: (s: LabState) => [number, number];
  /** New state when the handle is put at (x, y); the lab clamps and snaps. */
  move: (s: LabState, x: number, y: number) => LabState;
  /** Distance in drawing units that one arrow key press moves the handle. */
  step: number;
}

export interface LabDef {
  id: LabId;
  title: string;
  intro: string;
  initial: () => LabState;
  goals: [LabGoal, LabGoal, LabGoal];
  /** Controls, drawing and readout for a state. */
  render: (s: LabState) => string;
  handles?: Record<string, LabHandle>;
  /** Runs after every change, e.g. to remember what was already found. */
  update?: (s: LabState) => LabState;
  /** One state per goal that reaches it; used by the tests. */
  witnesses: [LabState, LabState, LabState];
  /** What the model simplifies. */
  note: string;
}

export const num = (s: LabState, key: string): number => Number(s[key]);
export const str = (s: LabState, key: string): string => String(s[key]);
export const clamp = (v: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, v));
export const snap = (v: number, step: number): number =>
  Math.round(v / step) * step;
export const f1 = (n: number): string => (Math.round(n * 10) / 10).toString();

/**
 * German number format: decimal comma, the real minus sign, no grouping up
 * to four digits (6371 km) and a no-break space in groups of three above
 * (25 000), as in German school books. Intl alone writes "6.371" and "-3".
 */
export const fmt = (n: number, digits = 1): string => {
  const plain = new Intl.NumberFormat("de-DE", {
    maximumFractionDigits: digits,
    useGrouping: false,
  }).format(n);
  const [int, frac] = plain.replace("-", "").split(",");
  const grouped =
    int.length > 4 ? int.replace(/\B(?=(\d{3})+$)/g, " ") : int;
  return `${n < 0 && plain.startsWith("-") ? "−" : ""}${grouped}${frac ? `,${frac}` : ""}`;
};

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

export function labSvg(
  width: number,
  height: number,
  title: string,
  body: string,
): string {
  return `<svg class="figure-svg lab-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(title)}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}

/** A round draggable handle with an accessible name. */
export function handle(
  id: string,
  x: number,
  y: number,
  name: string,
  cls = "",
  r = 13,
): string {
  return `<g class="handle ${cls}" data-lab-drag="${id}" tabindex="0" role="button" aria-label="${esc(name)}: mit der Maus ziehen oder mit den Pfeiltasten bewegen"><circle class="handle-hit" cx="${f1(x)}" cy="${f1(y)}" r="${r + 10}"/><circle class="handle-dot" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/></g>`;
}

export function readout(text: string, tone: "" | "good" | "warn" = ""): string {
  return `<p class="lab-readout ${tone}" role="status">${text}</p>`;
}

export function text(
  x: number,
  y: number,
  value: string,
  cls = "lbl",
  anchor: "start" | "middle" | "end" = "middle",
): string {
  return `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}">${esc(value)}</text>`;
}
