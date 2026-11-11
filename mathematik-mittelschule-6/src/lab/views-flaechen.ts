import { fmt } from "../exercises/format";
import { AREA } from "../models";
import {
  handle,
  line,
  open,
  polygon,
  rect,
  text,
  type LabView,
  type Pt,
} from "./svg";
import { rail, railHandle, title } from "./view-helpers";
import { ladderView } from "./views-groessen";

const RX = 56;
const RY = 300;
const RS = 22;
function rectangleView(mode: "perimeter" | "area"): LabView {
  return {
    render(v) {
      const w = v.a * RS;
      const h = v.b * RS;
      let out =
        open(
          mode === "area"
            ? "Rechteck aus Einheitsquadraten"
            : "Rechteck mit Rand",
        ) + rect(RX, RY - h, w, h, mode === "area" ? "lab-fill-a" : "lab-cell");
      if (mode === "area") {
        for (let x = 1; x < v.a; x++)
          out += line(RX + x * RS, RY, RX + x * RS, RY - h, "lab-thin");
        for (let y = 1; y < v.b; y++)
          out += line(RX, RY - y * RS, RX + w, RY - y * RS, "lab-thin");
      } else {
        out += rect(RX, RY - h, w, h, "lab-side-a");
      }
      const panelX = 345;
      out +=
        text(panelX, 90, `a = ${v.a} cm, b = ${v.b} cm`, "lab-text") +
        (mode === "area"
          ? text(panelX, 125, `A = ${v.a} · ${v.b}`, "lab-text-big") +
            text(panelX, 150, `= ${v.a * v.b} cm²`, "lab-text-big")
          : text(panelX, 125, `U = 2 · (${v.a} + ${v.b})`, "lab-text-big") +
            text(panelX, 150, `= ${2 * (v.a + v.b)} cm`, "lab-text-big")) +
        (v.a === v.b
          ? text(panelX, 185, "Das ist ein Quadrat.", "lab-text-ok")
          : "");
      return out + handle("corner", RX + w, RY - h, "Ecke ziehen") + "</svg>";
    },
    handles: {
      corner: {
        x: "a",
        y: "b",
        drag: (p) => ({ a: (p.x - RX) / RS, b: (RY - p.y) / RS }),
      },
    },
  };
}

const LX = 50;
const LY = 300;
const LS = 24;
const notchPoints = (w: number, h: number, cw: number, ch: number): Pt[] => [
  { x: LX, y: LY },
  { x: LX + w * LS, y: LY },
  { x: LX + w * LS, y: LY - (h - ch) * LS },
  { x: LX + (w - cw) * LS, y: LY - (h - ch) * LS },
  { x: LX + (w - cw) * LS, y: LY - h * LS },
  { x: LX, y: LY - h * LS },
];

const polygonPerimeter: LabView = {
  render(v) {
    const pts = notchPoints(v.w, v.h, v.cw, v.ch);
    const u = 2 * (v.w + v.h);
    return (
      open("Grundstück mit Zaun und Tor") +
      polygon(pts, "lab-fill-a") +
      (v.t > 0 ? line(LX, LY, LX + v.t * LS, LY, "lab-side-ok") : "") +
      text(LX + (v.w * LS) / 2, LY + 20, `${v.w} m`, "lab-text-a", "middle") +
      text(LX - 8, LY - (v.h * LS) / 2, `${v.h} m`, "lab-text-a", "end") +
      text(350, 40, `Umfang: ${u} m`, "lab-text-big") +
      text(350, 64, `Tor: ${v.t} m (grün)`, "lab-text") +
      text(350, 88, `Zaun: ${u - v.t} m`, "lab-text-big") +
      handle("w", LX + v.w * LS, LY, "Breite ziehen") +
      handle("h", LX, LY - v.h * LS, "Höhe ziehen", "lab-handle lab-handle-b") +
      "</svg>"
    );
  },
  handles: {
    w: { x: "w", drag: (p) => ({ w: (p.x - LX) / LS }) },
    h: { y: "h", drag: (p) => ({ h: (LY - p.y) / LS }) },
  },
};

/** The units the two figures of the area comparison are counted in. */
export const TILES = [
  { label: "Kästchen", size: 1 },
  { label: "Zweier-Fliesen", size: 2 },
  { label: "Vierer-Fliesen", size: 4 },
];
export const tileCount = (area: number, size: number) =>
  size === 1 || area % size === 0
    ? `${Math.floor(area / size)}`
    : `${Math.floor(area / size)} und ${area % size} Kästchen Rest`;

const CS = 20;
const figure = (
  x0: number,
  y0: number,
  w: number,
  h: number,
  k: number,
  cls: string,
): string => {
  let out = "";
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (x >= w - k && y >= h - k) continue;
      out += rect(x0 + x * CS, y0 - (y + 1) * CS, CS, CS, cls);
    }
  return out;
};
const tileCompare: LabView = {
  render(v) {
    const areaA = v.a * v.b;
    const areaB = v.d * v.e - v.k * v.k;
    const tile = TILES[v.unit];
    return (
      open("Zwei Figuren aus Kästchen") +
      title(
        areaA === areaB
          ? "Beide Figuren sind gleich groß."
          : areaA > areaB
            ? "Figur A ist größer."
            : "Figur B ist größer.",
      ) +
      text(
        30,
        55,
        `A: ${tileCount(areaA, tile.size)} ${tile.label}`,
        "lab-text-a",
      ) +
      text(
        280,
        55,
        `B: ${tileCount(areaB, tile.size)} ${tile.label}`,
        "lab-text-b",
      ) +
      figure(30, 250, v.a, v.b, 0, "lab-fill-a") +
      figure(280, 250, v.d, v.e, v.k, "lab-fill-b") +
      rail("a", "Breite von A", v.a, 2, 8, 305) +
      "</svg>"
    );
  },
  handles: { a: railHandle("a", 2, 8) },
};

const composite: LabView = {
  render(v) {
    const pts = notchPoints(v.w, v.h, v.cw, v.ch);
    const low = v.h - v.ch;
    const total = v.w * v.h - v.cw * v.ch;
    let out = open("Vieleck zerlegt oder ergänzt");
    if (v.method === 0) {
      out +=
        rect(LX, LY - low * LS, v.w * LS, low * LS, "lab-fill-a") +
        rect(LX, LY - v.h * LS, (v.w - v.cw) * LS, v.ch * LS, "lab-fill-b");
    } else {
      out +=
        rect(LX, LY - v.h * LS, v.w * LS, v.h * LS, "lab-fill-a") +
        rect(
          LX + (v.w - v.cw) * LS,
          LY - v.h * LS,
          v.cw * LS,
          v.ch * LS,
          "lab-fill-c",
        );
    }
    out += polygon(pts, "lab-ink");
    const lines =
      v.method === 0
        ? [
            `${v.w} · ${low} = ${v.w * low}`,
            `${v.w - v.cw} · ${v.ch} = ${(v.w - v.cw) * v.ch}`,
            `zusammen ${fmt(total, 0)} m²`,
          ]
        : [
            `${v.w} · ${v.h} = ${v.w * v.h}`,
            `− ${v.cw} · ${v.ch} = ${v.cw * v.ch}`,
            `bleiben ${fmt(total, 0)} m²`,
          ];
    lines.forEach((content, i) => {
      out += text(
        352,
        50 + i * 24,
        content,
        i === 2 ? "lab-text-big" : "lab-text",
      );
    });
    return (
      out +
      handle("w", LX + v.w * LS, LY, "Breite ziehen") +
      handle("h", LX, LY - v.h * LS, "Höhe ziehen", "lab-handle lab-handle-b") +
      "</svg>"
    );
  },
  handles: {
    w: { x: "w", drag: (p) => ({ w: (p.x - LX) / LS }) },
    h: { y: "h", drag: (p) => ({ h: (LY - p.y) / LS }) },
  },
};

export const FLAECHEN_VIEWS: Record<string, LabView> = {
  perimeter: rectangleView("perimeter"),
  "polygon-perimeter": polygonPerimeter,
  "tile-compare": tileCompare,
  "area-ladder": ladderView(() => AREA),
  "area-rect": rectangleView("area"),
  composite,
};
