import type { NumberField, ChoiceField } from "../model/types";

/** True when `value` is within `tolerance` (relative) of `target`. */
export function near(value: number, target: number, tolerance = 0.02): boolean {
  if (!Number.isFinite(value) || !Number.isFinite(target)) return false;
  if (target === 0) return Math.abs(value) <= tolerance;
  return Math.abs(value - target) <= Math.abs(target) * tolerance;
}

/** True when `value` is within `delta` (absolute) of `target`. */
export function within(value: number, target: number, delta: number): boolean {
  return Number.isFinite(value) && Math.abs(value - target) <= delta;
}

export const DEG = Math.PI / 180;

export const sinD = (deg: number): number => Math.sin(deg * DEG);
export const cosD = (deg: number): number => Math.cos(deg * DEG);
export const tanD = (deg: number): number => Math.tan(deg * DEG);
export const asinD = (ratio: number): number => Math.asin(ratio) / DEG;
export const acosD = (ratio: number): number => Math.acos(ratio) / DEG;
export const atanD = (ratio: number): number => Math.atan(ratio) / DEG;

/** A number field; `digits` decimals in the solution. */
export function numberField(
  label: string,
  answer: number,
  unit = "",
  digits = 2,
  extra: Partial<NumberField> = {},
): NumberField {
  // A slip that happens to equal the answer (sin 45° = cos 45°) is no slip.
  const slips = extra.slips?.filter(
    (slip) =>
      Number.isFinite(slip.value) &&
      Math.abs(slip.value - answer) >
        Math.max(1e-9, 0.02 * Math.abs(answer), 0.51 * 10 ** -digits),
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

/** "ja"/"nein" as a choice field. */
export function yesNo(label: string, yes: boolean): ChoiceField {
  return choiceField(label, ["ja", "nein"], yes ? 0 : 1);
}

/** The slip a calculator set to RAD gives for c · sin(α°), so the hint can name it. */
export const RAD_HINT =
  "Steht dein Taschenrechner auf RAD? Für Winkel in Grad muss er auf DEG (D) stehen.";

export interface GridTriangleClassification {
  a: number;
  b: number;
  c: number;
  alpha: number;
  beta: number;
  gamma: number;
  sideType: "gleichseitig" | "gleichschenklig" | "unregelmäßig";
  angleType: "rechtwinklig" | "stumpfwinklig" | "spitzwinklig";
  rightVertex: "A" | "B" | "C" | null;
  summary: string;
}

/** Exact geometric classification for base A = (−3|0), B = (3|0), C = (cx|cy). */
export function classifyGridTriangle(cx: number, cy: number): GridTriangleClassification {
  const ux = cx + 3;
  const uy = cy;
  const vx = cx - 3;
  const vy = cy;
  const a2 = vx * vx + vy * vy;
  const b2 = ux * ux + uy * uy;
  const c2 = 36;
  const a = Math.sqrt(a2);
  const b = Math.sqrt(b2);
  const c = 6;
  const radToDeg = 180 / Math.PI;
  const cosA = Math.max(-1, Math.min(1, (b2 + c2 - a2) / (2 * b * c)));
  const cosB = Math.max(-1, Math.min(1, (a2 + c2 - b2) / (2 * a * c)));
  const alpha = Math.acos(cosA) * radToDeg;
  const beta = Math.acos(cosB) * radToDeg;
  const gamma = 180 - alpha - beta;

  const eps = 1e-6;
  const rightVertex: "A" | "B" | "C" | null =
    Math.abs(a2 + b2 - c2) < eps || Math.abs(gamma - 90) < 0.05
      ? "C"
      : Math.abs(b2 + c2 - a2) < eps || Math.abs(alpha - 90) < 0.05
        ? "A"
        : Math.abs(a2 + c2 - b2) < eps || Math.abs(beta - 90) < 0.05
          ? "B"
          : null;
  const angleType = rightVertex
    ? "rechtwinklig"
    : alpha > 90 + 0.05 || beta > 90 + 0.05 || gamma > 90 + 0.05
      ? "stumpfwinklig"
      : "spitzwinklig";
  const sideType =
    Math.abs(a - b) < 0.05 && Math.abs(b - c) < 0.05
      ? "gleichseitig"
      : Math.abs(a - b) < 0.05 || Math.abs(b - c) < 0.05 || Math.abs(a - c) < 0.05
        ? "gleichschenklig"
        : "unregelmäßig";
  return {
    a,
    b,
    c,
    alpha,
    beta,
    gamma,
    sideType,
    angleType,
    rightVertex,
    summary: `${sideType}, ${angleType}`,
  };
}
