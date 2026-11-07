import type { NumberField, ChoiceField } from "../model/types";

/** A number field; `digits` decimals in the solution. */
export function numberField(
  label: string,
  answer: number,
  unit = "",
  digits = 2,
  extra: Partial<NumberField> = {},
): NumberField {
  // A slip that happens to equal the answer is no slip. Grade 5 answers are exact,
  // so a neighbouring whole number of a large answer stays a slip with its hint.
  const slips = extra.slips?.filter(
    (slip) =>
      Number.isFinite(slip.value) &&
      Math.abs(slip.value - answer) >
        Math.max(1e-9, 0.51 * 10 ** -digits),
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

/** A choice field among a few options. */
export function choiceField(
  label: string,
  options: string[],
  correctIndex: number,
): ChoiceField {
  return { kind: "choice", label, options, correctIndex };
}
