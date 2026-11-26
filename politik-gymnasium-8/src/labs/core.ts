/**
 * Shared frame for every interactive model in src/labs. Pure data + pure
 * functions so tests can drive every state transition without a DOM.
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
      type: "actions";
      key: string;
      label: string;
      options: Array<{ value: string; label: string }>;
    };

export interface LabDef {
  title: string;
  prompt: string;
  init: () => LabState;
  controls: (state: LabState) => LabControl[];
  set?: (state: LabState, key: string, value: LabValue) => void;
  goals: (state: LabState) => LabGoal[];
  draw: (state: LabState) => string;
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

/** German number format with decimal comma and real minus sign (U+2212). */
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
export const bool = (state: LabState, key: string): boolean =>
  Boolean(state[key]);
