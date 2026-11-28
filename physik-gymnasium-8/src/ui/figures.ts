import { fmt } from "../exercises/format";
import { esc } from "../workshop";

export type Point = readonly [number, number];
type Colour = "ink" | "muted" | "blue" | "gold" | "pink" | "green";
export const label = (
  text: string,
  x: number,
  y: number,
  colour: Colour = "ink",
) => `<text class="ph8-${colour}" x="${x}" y="${y}">${esc(text)}</text>`;
export const line = (
  a: Point,
  b: Point,
  colour: Colour = "ink",
  dashed = false,
) =>
  `<path class="ph8-${colour}" d="M${a.join(" ")}L${b.join(" ")}"${dashed ? ' stroke-dasharray="6 5"' : ""}/>`;
export const dot = (x: number, y: number, colour: Colour = "blue", r = 4) =>
  `<circle class="ph8-${colour}" cx="${x}" cy="${y}" r="${r}"/>`;
export const path = (points: Point[], colour: Colour = "ink") =>
  `<polyline class="ph8-${colour}" points="${points.map((p) => p.join(",")).join(" ")}"/>`;

export function arrow(
  a: Point,
  b: Point,
  colour: Colour = "blue",
  dashed = false,
): string {
  const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (length < 1) return dot(...b, colour);
  const dx = (b[0] - a[0]) / length;
  const dy = (b[1] - a[1]) / length;
  const head = Math.min(9, length * 0.6);
  return (
    line(a, b, colour, dashed) +
    path(
      [
        [
          b[0] - head * dx - head * 0.5 * dy,
          b[1] - head * dy + head * 0.5 * dx,
        ],
        b,
        [
          b[0] - head * dx + head * 0.5 * dy,
          b[1] - head * dy - head * 0.5 * dx,
        ],
      ],
      colour,
    )
  );
}

export function diagram(
  title: string,
  description: string,
  drawing: string,
): string {
  return `<figure class="lab-figure ph8-figure"><svg viewBox="0 0 460 230" role="img" aria-labelledby="lab-svg-title lab-svg-desc"><title id="lab-svg-title">${esc(title)}</title><desc id="lab-svg-desc">${esc(description)}</desc>${drawing}</svg><figcaption>${esc(description)}</figcaption></figure>`;
}

export function graph(
  title: string,
  description: string,
  xLabel: string,
  yLabel: string,
  maxX: number,
  maxY: number,
  points: Point[],
  highlight: Point,
  reference?: Point[],
): string {
  const px = (x: number) => 56 + (345 * x) / maxX;
  const py = (y: number) => 181 - (137 * y) / maxY;
  const plot = (values: Point[], colour: Colour) =>
    path(
      values.map(([x, y]) => [px(x), py(y)]),
      colour,
    );
  const grid = [0, 1, 2, 3, 4]
    .map((n) => {
      const x = (maxX * n) / 4;
      const y = (maxY * n) / 4;
      return (
        line([px(x), 44], [px(x), 181], "muted", true) +
        line([56, py(y)], [401, py(y)], "muted", true) +
        label(fmt(x, 2), px(x) - 6, 204) +
        (n ? label(fmt(y, 2), 10, py(y) + 4) : "")
      );
    })
    .join("");
  return diagram(
    title,
    description,
    grid +
      arrow([56, 181], [420, 181], "ink") +
      arrow([56, 181], [56, 35], "ink") +
      label(xLabel, 300, 224) +
      label(yLabel, 57, 25) +
      (reference ? plot(reference, "muted") : "") +
      plot(points, "blue") +
      points.map(([x, y]) => dot(px(x), py(y), "blue", 2.2)).join("") +
      dot(px(highlight[0]), py(highlight[1]), "pink", 6),
  );
}
