import { fmt } from "../exercises/format";
import type { LabValues } from "../model/types";
import { handle, line, rect, text, type HandleSpec } from "./svg";
export const railX = (value: number, min: number, max: number) =>
  65 + (390 * (value - min)) / (max - min);
export const railValue = (x: number, min: number, max: number) =>
  min + ((x - 65) / 390) * (max - min);
export function rail(
  key: string,
  label: string,
  value: number,
  min: number,
  max: number,
  y = 295,
): string {
  return (
    line(65, y, 455, y, "lab-axis") +
    text(65, y - 20, `${label}: ${fmt(value)}`, "lab-text-small") +
    text(65, y + 22, fmt(min), "lab-text-tick", "middle") +
    text(455, y + 22, fmt(max), "lab-text-tick", "middle") +
    handle(key, railX(value, min, max), y, label)
  );
}
export const railHandle = (
  key: string,
  min: number,
  max: number,
): HandleSpec => ({
  x: key,
  drag: (p) => ({ [key]: railValue(p.x, min, max) }),
});
export const title = (content: string) =>
  text(260, 25, content, "lab-text", "middle");
export function coordinateHandle(
  x: string,
  y: string,
  from: (p: { x: number; y: number }, v: LabValues) => { x: number; y: number },
): HandleSpec {
  return {
    x,
    y,
    drag: (p, v) => {
      const next = from(p, v);
      return { [x]: next.x, [y]: next.y };
    },
  };
}

/**
 * A colour legend: one small swatch per entry, in the colour class the
 * drawing uses for that quantity (lab-fill-a blue, -b orange, -c purple,
 * -ok green), so learners read colour and meaning together.
 */
export function legend(
  x: number,
  y: number,
  items: Array<[string, string]>,
  gap = 18,
): string {
  return items
    .map(
      ([cls, label], i) =>
        rect(x, y + i * gap - 10, 12, 12, cls, 'rx="2"') +
        text(x + 18, y + i * gap, label, "lab-text-small"),
    )
    .join("");
}

/** The same legend in one row; `widths` are the space each entry takes. */
export function legendRow(
  x: number,
  y: number,
  items: Array<[string, string]>,
): string {
  let at = x;
  return items
    .map(([cls, label]) => {
      const out =
        rect(at, y - 10, 12, 12, cls, 'rx="2"') +
        text(at + 17, y, label, "lab-text-small");
      at += 30 + label.length * 6.1;
      return out;
    })
    .join("");
}
