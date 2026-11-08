import type { NumberField, ChoiceField } from "../model/types";

/** Ein Zahlenfeld; `digits` Nachkommastellen in der Anzeige der Lösung. */
export function numberField(
  label: string,
  answer: number,
  unit = "",
  digits = 2,
  extra: Partial<NumberField> = {},
): NumberField {
  const slips = extra.slips?.filter(
    (slip) =>
      Number.isFinite(slip.value) &&
      Math.abs(slip.value - answer) > Math.max(1e-9, 0.51 * 10 ** -digits),
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

/** Ein Auswahlfeld für Mehrfachauswahl. */
export function choiceField(
  label: string,
  options: string[],
  correctIndex: number,
): ChoiceField {
  return { kind: "choice", label, options, correctIndex };
}
