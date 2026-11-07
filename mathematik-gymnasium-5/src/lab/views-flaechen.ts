import { fmt } from "../exercises/format";
import { AREA } from "../models";
import { handle, line, open, polygon, rect, text, type LabView, type Pt } from "./svg";
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
        open(mode === "area" ? "Rechteck aus Einheitsquadraten" : "Rechteck mit Rand") +
        rect(RX, RY - h, w, h, mode === "area" ? "lab-fill-a" : "lab-cell");
      if (mode === "area") {
        for (let x = 1; x < v.a; x++) out += line(RX + x * RS, RY, RX + x * RS, RY - h, "lab-thin");
        for (let y = 1; y < v.b; y++) out += line(RX, RY - y * RS, RX + w, RY - y * RS, "lab-thin");
      } else {
        out += rect(RX, RY - h, w, h, "lab-side-a");
      }
      const panelX = 345;
      out +=
        text(panelX, 90, `a = ${v.a} cm, b = ${v.b} cm`, "lab-text") +
        (mode === "area"
          ? text(panelX, 125, `A = ${v.a} · ${v.b}`, "lab-text-big") + text(panelX, 150, `= ${v.a * v.b} cm²`, "lab-text-big")
          : text(panelX, 125, `U = 2 · (${v.a} + ${v.b})`, "lab-text-big") + text(panelX, 150, `= ${2 * (v.a + v.b)} cm`, "lab-text-big")) +
        (v.a === v.b ? text(panelX, 185, "Das ist ein Quadrat.", "lab-text-ok") : "");
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

/** The units the two figures of the area comparison are counted in. */

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
        rect(LX + (v.w - v.cw) * LS, LY - v.h * LS, v.cw * LS, v.ch * LS, "lab-fill-c");
    }
    out += polygon(pts, "lab-ink");
    const lines =
      v.method === 0
        ? [`${v.w} · ${low} = ${v.w * low}`, `${v.w - v.cw} · ${v.ch} = ${(v.w - v.cw) * v.ch}`, `zusammen ${fmt(total, 0)} m²`]
        : [`${v.w} · ${v.h} = ${v.w * v.h}`, `− ${v.cw} · ${v.ch} = ${v.cw * v.ch}`, `bleiben ${fmt(total, 0)} m²`];
    lines.forEach((content, i) => {
      out += text(352, 50 + i * 24, content, i === 2 ? "lab-text-big" : "lab-text");
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
  "area-ladder": ladderView(() => AREA),
  "area-rect": rectangleView("area"),
  composite,
};
