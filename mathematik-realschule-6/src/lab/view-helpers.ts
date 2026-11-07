import type { LabValues } from "../model/types";
import { fmt } from "../exercises/format";
import { handle, line, text, type HandleSpec } from "./svg";
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
