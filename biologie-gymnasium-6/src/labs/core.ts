/**
 * The frame every interactive model shares. A lab is pure data plus pure
 * functions: `init` gives the start state, `set` applies one control,
 * `goals` says which exploration goals are reached and `draw` returns the
 * SVG. The DOM code in index.ts only wires controls to `set`, so the tests
 * can drive every lab without a browser.
 */

export type LabValue = number | string | boolean;
export type LabState = Record<string, LabValue>;

export interface LabGoal {
  text: string;
  met: boolean;
}

export type LabControl =
  | {
      type: "range";
      key: string;
      label: string;
      min: number;
      max: number;
      step: number;
      /** Shown after the label, e.g. "20 cm". */
      format: (value: number) => string;
    }
  | {
      type: "choice";
      key: string;
      label: string;
      options: Array<{ value: string; label: string }>;
    }
  | { type: "toggle"; key: string; label: string }
  | {
      /** Buttons that send `value` to `set` without keeping a pressed state. */
      type: "actions";
      key: string;
      label: string;
      options: Array<{ value: string; label: string }>;
    };

export interface LabDef {
  title: string;
  /** One sentence above the model: what to try. */
  prompt: string;
  init: () => LabState;
  controls: (state: LabState) => LabControl[];
  /** Applies one control; the default stores the value under its key. */
  set?: (state: LabState, key: string, value: LabValue) => void;
  goals: (state: LabState) => LabGoal[];
  draw: (state: LabState) => string;
  /** Short text result under the drawing (values, observation). */
  readout: (state: LabState) => string;
}

export function applyControl(
  def: LabDef,
  state: LabState,
  key: string,
  value: LabValue,
): void {
  if (def.set) def.set(state, key, value);
  else state[key] = value;
}

/** German number format with decimal comma and the real minus sign. */
export const fmtDe = (value: number, digits = 0): string => {
  const rounded = Number(value.toFixed(digits));
  const safe = Object.is(rounded, -0) ? 0 : rounded;
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
    .format(safe)
    .replace(/-/g, "−");
};

export const num = (state: LabState, key: string): number =>
  Number(state[key]);
export const str = (state: LabState, key: string): string =>
  String(state[key]);

/** Adds `item` to a comma-separated list stored in `key` (for "seen" goals). */
export function remember(state: LabState, key: string, item: string): void {
  const list = String(state[key] ?? "")
    .split(",")
    .filter(Boolean);
  if (!list.includes(item)) list.push(item);
  state[key] = list.join(",");
}

export const seen = (state: LabState, key: string, item: string): boolean =>
  String(state[key] ?? "")
    .split(",")
    .includes(item);
