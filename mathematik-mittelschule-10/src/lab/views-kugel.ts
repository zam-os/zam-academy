import { fmt } from "../exercises/format";
import type { LabValues } from "../model/types";
import { circle, handle, infoBox, line, open, path, polygon, r1, rect, text, W, type LabView, type Pt } from "./svg";
import { legendRow, title } from "./view-helpers";

const ellipse = (cx: number, cy: number, rx: number, ry: number, cls: string) =>
  `<ellipse cx="${r1(cx)}" cy="${r1(cy)}" rx="${r1(rx)}" ry="${r1(ry)}" class="${cls}" />`;

// ─── 5.1 Kugel im Zylinder und Orangenschale (aus Mathematik 9 Realschule) ─

function sphereLayout(v: LabValues) {
  const k = Math.min(16, 75 / v.r);
  const cx = 150;
  const bottom = 310;
  const top = bottom - 2 * v.r * k;
  return { k, cx, bottom, top };
}

/** Water that spills when the sphere sinks `sink` % of its diameter into the full cylinder: a spherical cap. */
export function spilled(r: number, sink: number): number {
  const x = (2 * r * sink) / 100;
  return (Math.PI * x * x * (3 * r - x)) / 3;
}

function sphereInCylinder(v: LabValues): string {
  const { k, cx, bottom, top } = sphereLayout(v);
  const R = v.r * k;
  const x = (2 * v.r * v.sink) / 100;
  const cy = top - R + x * k;
  const ry = Math.max(3, R * 0.22);
  const vCyl = 2 * Math.PI * v.r ** 3;
  const out1 = spilled(v.r, v.sink);
  let out = open("Eine Kugel sinkt in einen randvollen Zylinder mit gleichem Radius und Höhe 2r");
  out += rect(cx - R, top, 2 * R, bottom - top, "lab-water");
  out += circle(cx, cy, R, "lab-sphere");
  out += rect(cx - R, top, 2 * R, bottom - top, "lab-ink");
  out += ellipse(cx, top, R, ry, "lab-thin");
  out += ellipse(cx, bottom, R, ry, "lab-thin");
  out += line(cx, cy, cx + R, cy, "lab-side-a");
  out += text(cx + R / 2, cy - 5, "r", "lab-text lab-text-a", "middle");
  // the beaker that catches the overflow
  const bx = 330;
  const bw = 70;
  const bh = 160;
  const level = (out1 / vCyl) * bh;
  out += rect(bx, bottom - level, bw, level, "lab-water");
  out += rect(bx, bottom - bh, bw, bh, "lab-ink");
  for (const share of [1 / 3, 2 / 3]) out += line(bx - 6, bottom - bh * share, bx, bottom - bh * share, "lab-thin");
  out += text(bx - 9, bottom - (bh * 2) / 3 + 4, "⅔", "lab-text-small", "end");
  out += text(bx - 9, bottom - bh / 3 + 4, "⅓", "lab-text-small", "end");
  out += text(bx + bw / 2, bottom - bh - 10, "übergelaufen", "lab-text-small", "middle");
  out += text(bx + bw / 2, Math.max(bottom - level - 6, bottom - bh + 14), `${fmt((out1 / vCyl) * 100, 1)} %`, "lab-text", "middle");
  out += circle(470, 118, 2 * k, "lab-ghost");
  out += text(470, 118 + 2 * k + 14, "r = 2 cm", "lab-text-small", "middle");
  out += text(W - 14, 26, `V Kugel = 4/3 · πr³ = ${fmt((4 / 3) * Math.PI * v.r ** 3, 1)} cm³`, "lab-text lab-text-big", "end");
  out += text(W - 14, 46, `V Zylinder = πr² · 2r = ${fmt(vCyl, 1)} cm³`, "lab-text-muted", "end");
  out += handle("ball", cx, cy, "Kugel: ziehen lässt sie sinken");
  return out + "</svg>";
}

function orangePeel(v: LabValues): string {
  const k = Math.min(16, 60 / v.r);
  const R = v.r * k;
  let out = open("Die Schale einer Kugel bedeckt vier Großkreise");
  out += circle(110, 170, R * 1.6, "lab-sphere");
  out += ellipse(110, 170, R * 1.6, R * 0.45, "lab-thin");
  out += text(110, 170 + R * 1.6 + 20, `Kugel, r = ${fmt(v.r, 1)} cm`, "lab-text", "middle");
  const centres: Pt[] = [
    { x: 300, y: 110 },
    { x: 300 + 2.2 * R, y: 110 },
    { x: 300, y: 110 + 2.2 * R },
    { x: 300 + 2.2 * R, y: 110 + 2.2 * R },
  ];
  for (const c of centres) out += circle(c.x, c.y, R, "lab-fill-b");
  out += text(300 + 1.1 * R, 110 + 3.3 * R + 22, "vier Kreise πr² = Schale", "lab-text", "middle");
  out += text(16, 26, `O = 4 · πr² = ${fmt(4 * Math.PI * v.r * v.r, 1)} cm²`, "lab-text lab-text-big");
  out += text(16, 46, "Die Schale bedeckt genau die Fläche von vier Großkreisen.", "lab-text-muted");
  return out + "</svg>";
}

const sphere: LabView = {
  render: (v) => (v.view === 1 ? orangePeel(v) : sphereInCylinder(v)),
  handles: {
    ball: {
      y: "sink",
      drag: (p, v) => {
        const { k, top } = sphereLayout(v);
        const R = v.r * k;
        return { sink: ((p.y - top + R) / (2 * R)) * 100 };
      },
    },
  },
};

// ─── 5.2 Zusammengesetzte Körper mit Halbkugel oder Kugel ────────────────

/** The bodies of lesson 5.2. */
export const BODIES = ["Silo: Zylinder mit Halbkugel", "Eistüte: Kegel mit Halbkugel", "Verpackung: Kugel im Würfel"];

/** Volumes of the parts of body `kind` with radius r and height h (cm). */
export function compositeVolumes(kind: number, r: number, h: number): { part: number; sphere: number; total: number } {
  const half = (2 / 3) * Math.PI * r ** 3;
  if (kind === 0) {
    const cyl = Math.PI * r * r * h;
    return { part: cyl, sphere: half, total: cyl + half };
  }
  if (kind === 1) {
    const cone = (Math.PI * r * r * h) / 3;
    return { part: cone, sphere: half, total: cone + half };
  }
  const cube = (2 * r) ** 3;
  const ball = 2 * half;
  return { part: cube, sphere: ball, total: cube };
}

/** The outer surface of body `kind` (cm²); for the box the surface of the cube. */
export function compositeSurface(kind: number, r: number, h: number): number {
  const dome = 2 * Math.PI * r * r;
  if (kind === 0) return Math.PI * r * r + 2 * Math.PI * r * h + dome;
  if (kind === 1) return Math.PI * r * Math.hypot(r, h) + dome;
  return 6 * (2 * r) ** 2;
}

const COMP = { cx: 160, base: 318, k: 15 };

const compositeSphere: LabView = {
  render(v) {
    const { cx, base, k } = COMP;
    const R = v.r * k;
    const vols = compositeVolumes(v.kind, v.r, v.h);
    let out = open(`${BODIES[v.kind]}, r = ${fmt(v.r, 1)} cm${v.kind < 2 ? `, h = ${fmt(v.h, 1)} cm` : ""}`) + title(BODIES[v.kind]);
    let topY = base;
    if (v.kind === 0) {
      const rim = base - v.h * k;
      out += rect(cx - R, rim, 2 * R, v.h * k, "lab-fill-a");
      out += path(`M${r1(cx - R)} ${r1(rim)} A${r1(R)} ${r1(R)} 0 0 1 ${r1(cx + R)} ${r1(rim)} Z`, "lab-fill-b");
      out += line(cx - R - 14, base, cx - R - 14, rim, "lab-side-a") + text(cx - R - 20, (base + rim) / 2, `h = ${fmt(v.h, 1)}`, "lab-text-a", "end");
      out += line(cx, rim, cx + R, rim, "lab-side-b") + text(cx + R / 2 - 6, rim - 8, `r = ${fmt(v.r, 1)}`, "lab-text-b", "middle");
      topY = rim - R;
    } else if (v.kind === 1) {
      const rim = base - v.h * k;
      out += polygon([{ x: cx - R, y: rim }, { x: cx + R, y: rim }, { x: cx, y: base }], "lab-fill-a");
      out += path(`M${r1(cx - R)} ${r1(rim)} A${r1(R)} ${r1(R)} 0 0 1 ${r1(cx + R)} ${r1(rim)} Z`, "lab-fill-b");
      out += line(cx, rim, cx, base, "lab-dashed");
      out += text(cx + 6, (rim + base) / 2, `h = ${fmt(v.h, 1)}`, "lab-text-a");
      out += line(cx, rim, cx + R, rim, "lab-side-b") + text(cx + R / 2 - 6, rim - 8, `r = ${fmt(v.r, 1)}`, "lab-text-b", "middle");
      topY = rim - R;
    } else {
      out += rect(cx - R, base - 2 * R, 2 * R, 2 * R, "lab-fill-a");
      out += circle(cx, base - R, R, "lab-fill-b");
      out += line(cx, base - R, cx + R, base - R, "lab-side-b") + text(cx + R / 2, base - R - 6, `r = ${fmt(v.r, 1)}`, "lab-text-b", "middle");
      out += text(cx, base + 16, `Kante 2r = ${fmt(2 * v.r, 1)} cm`, "lab-text-a", "middle");
    }
    const lines: Array<[string, string]> =
      v.kind === 2
        ? [
            [`Würfel ${fmt(vols.part, 1)} cm³`, "lab-text-a"],
            [`Kugel ${fmt(vols.sphere, 1)} cm³`, "lab-text-b"],
            [`Luft ${fmt(vols.part - vols.sphere, 1)} cm³`, "lab-text-small"],
            [`= ${fmt(((vols.part - vols.sphere) / vols.part) * 100, 1)} % des Würfels`, "lab-text-c"],
          ]
        : [
            [`${v.kind === 0 ? "Zylinder" : "Kegel"} ${fmt(vols.part, 1)} cm³`, "lab-text-a"],
            [`Halbkugel ${fmt(vols.sphere, 1)} cm³`, "lab-text-b"],
            [`gesamt ${fmt(vols.total, 1)} cm³`, "lab-text-c"],
            [`Halbkugel: ${fmt((vols.sphere / vols.total) * 100, 1)} %`, "lab-text-small"],
          ];
    out += infoBox(330, 70, lines);
    out += legendRow(330, 200, [["lab-fill-a", v.kind === 0 ? "Zylinder" : v.kind === 1 ? "Kegel" : "Würfel"]]);
    out += legendRow(330, 222, [["lab-fill-b", v.kind === 2 ? "Kugel" : "Halbkugel"]]);
    out += text(330, 252, `Oberfläche ${fmt(compositeSurface(v.kind, v.r, v.h), 1)} cm²`, "lab-text-small");
    if (v.kind < 2) out += handle("h", cx, topY, "Höhe h des Teilkörpers");
    out += handle("r", cx + R, v.kind === 2 ? base - R : base - v.h * k, "Radius r");
    return out + "</svg>";
  },
  handles: {
    h: { y: "h", drag: (p, v) => ({ h: (COMP.base - p.y) / COMP.k - v.r }) },
    r: { x: "r", drag: (p) => ({ r: (p.x - COMP.cx) / COMP.k }) },
  },
};

export const KUGEL_VIEWS: Record<string, LabView> = {
  sphere,
  "composite-sphere": compositeSphere,
};
