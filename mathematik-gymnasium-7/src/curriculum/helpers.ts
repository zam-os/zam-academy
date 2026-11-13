import type { ChoiceField, NumberField } from "../model/types";

type SlipHint = { value: number; hint: string };

/** A field whose input expects a single number; duplicate slip values keep the first hint. */
export function numberField(
  label: string,
  answer: number,
  unit = "",
  digits = 2,
  extra: Partial<NumberField> = {},
): NumberField {
  const slips = extra.slips?.filter(
    (slip: SlipHint, index: number, all: SlipHint[]) =>
      all.findIndex((other) => Math.abs(other.value - slip.value) < 1e-9) === index,
  );
  return {
    kind: "number",
    label,
    answer,
    unit,
    digits,
    ...extra,
    ...(slips ? { slips } : {}),
  };
}

/** Whole-number shortcut (`digits = 0`). */
export function intField(
  label: string,
  answer: number,
  slips?: SlipHint[],
  unit = "",
): NumberField {
  return numberField(label, answer, unit, 0, slips ? { slips } : {});
}

/** A field with selectable options; `correctIndex` points to the right one. */
export function choiceField(
  label: string,
  options: string[],
  correctIndex: number,
): ChoiceField {
  return { kind: "choice", label, options, correctIndex };
}
