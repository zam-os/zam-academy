import type { LabValues, ReadoutValues } from "../model/types";

/**
 * Small SVG builders the lab drawings share. Colours come from CSS classes
 * (styles.css, "lab-*"), so every drawing follows the light and dark theme.
 */

export const W = 520;
export const H = 340;

/** A point in SVG user units. */
export interface Pt {
  x: number;
  y: number;
}

export function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function r1(value: number): string {
  return (Math.round(value * 10) / 10).toString();
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function open(label: string): string {
  return `<svg class="lab-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}" preserveAspectRatio="xMidYMid meet">`;
}

export function text(
  x: number,
  y: number,
  content: string,
  cls = "lab-text",
  anchor: "start" | "middle" | "end" = "start",
): string {
  return `<text x="${r1(x)}" y="${r1(y)}" class="${cls}" text-anchor="${anchor}">${esc(content)}</text>`;
}

export function line(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cls: string,
): string {
  return `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" class="${cls}" />`;
}

export function circle(cx: number, cy: number, r: number, cls: string): string {
  return `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(Math.max(0, r))}" class="${cls}" />`;
}

export function rect(
  x: number,
  y: number,
  w: number,
  h: number,
  cls: string,
  extra = "",
): string {
  const x0 = Math.min(x, x + w);
  const y0 = Math.min(y, y + h);
  return `<rect x="${r1(x0)}" y="${r1(y0)}" width="${r1(Math.abs(w))}" height="${r1(Math.abs(h))}" class="${cls}" ${extra}/>`;
}

export function polygon(points: Pt[], cls: string, extra = ""): string {
  return `<polygon points="${points.map((p) => `${r1(p.x)},${r1(p.y)}`).join(" ")}" class="${cls}" ${extra}/>`;
}

export function polyline(points: Pt[], cls: string): string {
  return `<polyline points="${points.map((p) => `${r1(p.x)},${r1(p.y)}`).join(" ")}" class="${cls}" />`;
}

export function path(d: string, cls: string, extra = ""): string {
  return `<path d="${d}" class="${cls}" ${extra}/>`;
}

export function arrow(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cls: string,
  width = 2.5,
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 1) return "";
  const ux = dx / len;
  const uy = dy / len;
  const head = Math.min(10, len / 2);
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  const px = -uy * head * 0.5;
  const py = ux * head * 0.5;
  return (
    `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(bx)}" y2="${r1(by)}" class="${cls}" stroke-width="${width}" stroke-linecap="round" />` +
    `<polygon points="${r1(x2)},${r1(y2)} ${r1(bx + px)},${r1(by + py)} ${r1(bx - px)},${r1(by - py)}" class="${cls} lab-arrowhead" />`
  );
}

/** An arc path from angle a0 to a1 (degrees, counter-clockwise on screen, 0° = right). */
export function arcPath(
  cx: number,
  cy: number,
  r: number,
  a0: number,
  a1: number,
): string {
  const p0 = polar(cx, cy, r, a0);
  const p1 = polar(cx, cy, r, a1);
  const sweep = a1 - a0;
  const large = Math.abs(sweep) > 180 ? 1 : 0;
  const dir = sweep > 0 ? 0 : 1;
  return `M${r1(p0.x)} ${r1(p0.y)} A${r1(r)} ${r1(r)} 0 ${large} ${dir} ${r1(p1.x)} ${r1(p1.y)}`;
}

/** A filled circle sector from a0 to a1 (degrees, counter-clockwise on screen). */
export function sectorPath(
  cx: number,
  cy: number,
  r: number,
  a0: number,
  a1: number,
): string {
  if (Math.abs(a1 - a0) >= 359.999) {
    return `M${r1(cx - r)} ${r1(cy)} a${r1(r)} ${r1(r)} 0 1 0 ${r1(2 * r)} 0 a${r1(r)} ${r1(r)} 0 1 0 ${r1(-2 * r)} 0 Z`;
  }
  return `M${r1(cx)} ${r1(cy)} L${arcPath(cx, cy, r, a0, a1).slice(1)} Z`;
}

/** The point at `angle` degrees (counter-clockwise on screen, 0° = right). */
export function polar(cx: number, cy: number, r: number, angle: number): Pt {
  const rad = (angle * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

/** A small arc that marks an angle at a vertex, with an optional square for 90°. */
export function angleMark(
  vertex: Pt,
  from: Pt,
  to: Pt,
  r: number,
  cls = "lab-angle",
  rightAngle = false,
): string {
  const a0 = (Math.atan2(vertex.y - from.y, from.x - vertex.x) * 180) / Math.PI;
  let a1 = (Math.atan2(vertex.y - to.y, to.x - vertex.x) * 180) / Math.PI;
  let sweep = a1 - a0;
  while (sweep > 180) sweep -= 360;
  while (sweep < -180) sweep += 360;
  a1 = a0 + sweep;
  if (rightAngle) {
    const u = unit(vertex, from);
    const v = unit(vertex, to);
    const s = r * 0.7;
    const p1 = { x: vertex.x + u.x * s, y: vertex.y + u.y * s };
    const p2 = { x: vertex.x + (u.x + v.x) * s, y: vertex.y + (u.y + v.y) * s };
    const p3 = { x: vertex.x + v.x * s, y: vertex.y + v.y * s };
    return (
      `<path d="M${r1(p1.x)} ${r1(p1.y)} L${r1(p2.x)} ${r1(p2.y)} L${r1(p3.x)} ${r1(p3.y)}" class="${cls}" />` +
      circle(
        vertex.x + (u.x + v.x) * s * 0.5,
        vertex.y + (u.y + v.y) * s * 0.5,
        1.6,
        "lab-dot-small",
      )
    );
  }
  return `<path d="${arcPath(vertex.x, vertex.y, r, a0, a1)}" class="${cls}" />`;
}

function unit(from: Pt, to: Pt): Pt {
  const len = Math.hypot(to.x - from.x, to.y - from.y) || 1;
  return { x: (to.x - from.x) / len, y: (to.y - from.y) / len };
}

/** A label beside the middle of a segment, pushed outwards by `offset`. */
export function sideLabel(
  a: Pt,
  b: Pt,
  content: string,
  offset = 14,
  cls = "lab-text",
): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const u = unit(a, b);
  return text(mx - u.y * offset, my + u.x * offset + 4, content, cls, "middle");
}

/**
 * A point the learner drags. `id` names the handle in the lab view's handle
 * table; the element is focusable, so arrow keys move it too.
 */
export function handle(
  id: string,
  x: number,
  y: number,
  label: string,
  cls = "lab-handle",
): string {
  return (
    `<g class="${cls}" data-handle="${id}" tabindex="0" role="button" aria-label="${esc(label)} (ziehen oder Pfeiltasten)">` +
    `<circle cx="${r1(x)}" cy="${r1(y)}" r="16" class="lab-handle-hit" />` +
    `<circle cx="${r1(x)}" cy="${r1(y)}" r="7.5" class="lab-handle-dot" />` +
    `</g>`
  );
}

export function num(r: ReadoutValues, key: string): number {
  const value = r[key];
  return typeof value === "number" ? value : Number.NaN;
}

export function str(r: ReadoutValues, key: string): string {
  const value = r[key];
  return typeof value === "string" ? value : "";
}

/**
 * What a drag handle does: the params arrow keys step (Left/Right the x
 * param, Up/Down the y param), and the values a drag to an SVG point sets.
 */
export interface HandleSpec {
  x?: string;
  y?: string;
  drag: (p: Pt, values: LabValues) => Partial<LabValues>;
}

export interface LabView {
  render: (values: LabValues, readouts: ReadoutValues) => string;
  handles?: Record<string, HandleSpec>;
}

/**
 * A coordinate system inside the drawing: maths coordinates (x right, y up)
 * mapped onto a box of the SVG.
 */
export class Plot {
  readonly sx: number;
  readonly sy: number;

  constructor(
    readonly xmin: number,
    readonly xmax: number,
    readonly ymin: number,
    readonly ymax: number,
    readonly box = { x: 20, y: 14, w: 480, h: 312 },
  ) {
    this.sx = box.w / (xmax - xmin);
    this.sy = box.h / (ymax - ymin);
  }

  X(x: number): number {
    return this.box.x + (x - this.xmin) * this.sx;
  }

  Y(y: number): number {
    return this.box.y + (this.ymax - y) * this.sy;
  }

  P(x: number, y: number): Pt {
    return { x: this.X(x), y: this.Y(y) };
  }

  invX(px: number): number {
    return this.xmin + (px - this.box.x) / this.sx;
  }

  invY(py: number): number {
    return this.ymax - (py - this.box.y) / this.sy;
  }

  /** Grid lines every `step` units, axes with arrows and numbers every `labelEvery` units. */
  grid(step = 1, labelEvery = 1, xLabel = "x", yLabel = "y"): string {
    let out = rect(
      this.box.x,
      this.box.y,
      this.box.w,
      this.box.h,
      "lab-plot-bg",
    );
    for (
      let x = Math.ceil(this.xmin / step) * step;
      x <= this.xmax + 1e-9;
      x += step
    ) {
      out += line(
        this.X(x),
        this.box.y,
        this.X(x),
        this.box.y + this.box.h,
        "lab-grid",
      );
    }
    for (
      let y = Math.ceil(this.ymin / step) * step;
      y <= this.ymax + 1e-9;
      y += step
    ) {
      out += line(
        this.box.x,
        this.Y(y),
        this.box.x + this.box.w,
        this.Y(y),
        "lab-grid",
      );
    }
    const x0 = clamp(this.X(0), this.box.x, this.box.x + this.box.w);
    const y0 = clamp(this.Y(0), this.box.y, this.box.y + this.box.h);
    out += arrow(
      this.box.x,
      y0,
      this.box.x + this.box.w + 4,
      y0,
      "lab-axis",
      1.4,
    );
    out += arrow(
      x0,
      this.box.y + this.box.h,
      x0,
      this.box.y - 4,
      "lab-axis",
      1.4,
    );
    out += text(
      this.box.x + this.box.w - 4,
      y0 - 6,
      xLabel,
      "lab-text-axis",
      "end",
    );
    out += text(x0 + 6, this.box.y + 10, yLabel, "lab-text-axis");
    for (
      let x = Math.ceil(this.xmin / labelEvery) * labelEvery;
      x <= this.xmax - 0.5 * labelEvery + 1e-9;
      x += labelEvery
    ) {
      if (Math.abs(x) < 1e-9) continue;
      out += text(this.X(x), y0 + 13, fmtTick(x), "lab-text-tick", "middle");
    }
    for (
      let y = Math.ceil(this.ymin / labelEvery) * labelEvery;
      y <= this.ymax - 0.5 * labelEvery + 1e-9;
      y += labelEvery
    ) {
      if (Math.abs(y) < 1e-9) continue;
      out += text(x0 - 5, this.Y(y) + 4, fmtTick(y), "lab-text-tick", "end");
    }
    return out;
  }

  /** The graph of f as a path; wrap it in `clipped()` to cut it at the box. */
  graph(f: (x: number) => number, cls = "lab-curve", samples = 240): string {
    let d = "";
    let pen = false;
    const top = this.ymax + (this.ymax - this.ymin);
    const bottom = this.ymin - (this.ymax - this.ymin);
    for (let i = 0; i <= samples; i++) {
      const x = this.xmin + ((this.xmax - this.xmin) * i) / samples;
      const y = f(x);
      if (!Number.isFinite(y) || y > top || y < bottom) {
        pen = false;
        continue;
      }
      d += `${pen ? "L" : "M"}${r1(this.X(x))} ${r1(this.Y(y))} `;
      pen = true;
    }
    return d ? path(d.trim(), cls) : "";
  }

  /** A line through the box: y = m x + t, or x = c when vertical. */
  lineThrough(m: number, t: number, cls: string): string {
    return line(
      this.X(this.xmin),
      this.Y(m * this.xmin + t),
      this.X(this.xmax),
      this.Y(m * this.xmax + t),
      cls,
    );
  }

  /** A clip path id for this box; draw curves inside `<g clip-path>`. */
  clip(id: string): string {
    return `<clipPath id="${id}"><rect x="${this.box.x}" y="${this.box.y}" width="${this.box.w}" height="${this.box.h}" /></clipPath>`;
  }

  contains(x: number, y: number): boolean {
    return x >= this.xmin && x <= this.xmax && y >= this.ymin && y <= this.ymax;
  }
}

function fmtTick(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return String(rounded).replace(".", ",").replace("-", "−");
}

/** Inside a clip group so curves and lines never cross the plot's border. */
export function clipped(id: string, content: string): string {
  return `<g clip-path="url(#${id})">${content}</g>`;
}

/**
 * Lines of text on a soft panel, so they stay readable over grids and
 * graphs. Each line is [content, class]; the panel is sized to the longest.
 */
export function infoBox(
  x: number,
  y: number,
  lines: Array<[string, string]>,
  anchor: "start" | "end" = "start",
): string {
  const shown = lines.filter(([content]) => content);
  if (shown.length === 0) return "";
  const widthOf = ([content, cls]: [string, string]) =>
    content.length *
    (cls.includes("big") ? 9.2 : cls.includes("small") ? 6.2 : 7.3);
  const width = Math.max(...shown.map(widthOf)) + 16;
  const height = shown.length * 20 + 8;
  const left = anchor === "start" ? x - 8 : x - width + 8;
  let out = rect(left, y - 17, width, height, "lab-panel", 'rx="8"');
  shown.forEach(([content, cls], i) => {
    out += text(x, y + i * 20, content, cls, anchor);
  });
  return out;
}
