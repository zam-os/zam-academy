import { fmt } from "../exercises/format";
import { triangle } from "../models";
import {
  Plot,
  circle,
  handle,
  line,
  open,
  polygon,
  text,
  type LabView,
} from "./svg";
import { coordinateHandle, rail, railHandle, title } from "./view-helpers";

const triangleView = (construction: boolean): LabView => ({
  render(v) {
    const scale = 24,
      A = { x: 95, y: 222 },
      B = { x: 95 + v.c * scale, y: 222 },
      C = triangle(v.a, v.b, v.c);
    let out =
      open("SSS-Konstruktion mit Grundseite und Abstandskreisen") +
      title(`a = ${v.a}; b = ${v.b}; c = ${v.c} cm`);
    out +=
      `<defs><clipPath id="triangle-box"><rect x="20" y="40" width="480" height="215" /></clipPath></defs><g clip-path="url(#triangle-box)">` +
      line(A.x, A.y, B.x, B.y, "lab-side-c");
    if (!construction || v.step >= 2)
      out += circle(A.x, A.y, v.b * scale, "lab-dashed");
    if (!construction || v.step >= 3)
      out += circle(B.x, B.y, v.a * scale, "lab-dashed");
    if (C && (!construction || v.step >= 4))
      out +=
        polygon(
          [A, B, { x: A.x + C.x * scale, y: A.y - C.y * scale }],
          "lab-fill-a",
        ) + text(A.x + C.x * scale + 8, A.y - C.y * scale - 6, "C");
    out +=
      "</g>" + text(A.x - 12, A.y + 19, "A") + text(B.x + 10, B.y + 19, "B");
    if (!C && (!construction || v.step >= 3))
      out += text(
        260,
        264,
        "Keine nicht entarteten Dreiecke möglich",
        "lab-text",
        "middle",
      );
    return (
      out +
      (construction
        ? rail("step", "Konstruktionsschritt", v.step, 1, 4, 305)
        : rail("a", "Seite a", v.a, 1, 9, 305)) +
      "</svg>"
    );
  },
  handles: construction
    ? { step: railHandle("step", 1, 4) }
    : { a: railHandle("a", 1, 9) },
});
const ssw: LabView = {
  render(v) {
    const s = 27,
      A = { x: 70, y: 230 },
      B = { x: 70 + 6 * s, y: 230 },
      rad = Math.PI / 6,
      disc = v.a * v.a - 9;
    let out =
      open("SsW-Konstruktion: Kreis schneidet den Winkelschenkel") +
      title("AB = 6 cm, α = 30°; BC = a") +
      line(A.x, A.y, B.x, B.y, "lab-side-c") +
      line(
        A.x,
        A.y,
        A.x + 13 * s * Math.cos(rad),
        A.y - 13 * s * Math.sin(rad),
        "lab-ink",
      ) +
      text(85, 218, "30°");
    if (v.step >= 2) out += circle(B.x, B.y, v.a * s, "lab-dashed");
    if (v.step >= 3 && disc >= 0) {
      const roots = [
        6 * Math.cos(rad) - Math.sqrt(disc),
        6 * Math.cos(rad) + Math.sqrt(disc),
      ].filter(
        (t, i, all) => t > 1e-8 && (i === 0 || Math.abs(t - all[0]) > 1e-8),
      );
      roots.forEach((t, i) => {
        const C = {
          x: A.x + t * s * Math.cos(rad),
          y: A.y - t * s * Math.sin(rad),
        };
        out +=
          polygon([A, B, C], i === 0 ? "lab-fill-a" : "lab-fill-b") +
          circle(C.x, C.y, 4, "lab-dot-small") +
          text(C.x + 8, C.y - 8, `C${i + 1}`);
      });
    }
    return (
      out + rail("a", "Gegenüberliegende Seite a", v.a, 2, 8, 305) + "</svg>"
    );
  },
  handles: { a: railHandle("a", 2, 8) },
};
const congruencePlot = new Plot(-5, 5, 0, 6, { x: 40, y: 35, w: 440, h: 264 });
const congruence: LabView = {
  render(v) {
    const p = congruencePlot,
      A = p.P(-v.half, 0),
      B = p.P(v.half, 0),
      M = p.P(0, 0),
      C = p.P(v.x, v.h);
    return (
      open("Zwei Teildreiecke über einer halbierten Basis") +
      title(
        v.x === 0
          ? "AC = BC: SSS begründet die Kongruenz"
          : "AC ≠ BC: eine Voraussetzung für SSS fehlt",
      ) +
      polygon([A, M, C], "lab-fill-a") +
      polygon([B, M, C], "lab-fill-b") +
      line(M.x, M.y, C.x, C.y, "lab-side-c") +
      text(A.x, A.y + 20, "A") +
      text(B.x, B.y + 20, "B") +
      text(M.x, M.y + 20, "M") +
      text(C.x + 12, C.y - 8, "C") +
      handle("C", C.x, C.y, "Punkt C") +
      "</svg>"
    );
  },
  handles: {
    C: coordinateHandle("x", "h", (p) => ({
      x: congruencePlot.invX(p.x),
      y: congruencePlot.invY(p.y),
    })),
  },
};
const centresPlot = new Plot(-7, 7, -5, 7, { x: 106, y: 25, w: 308, h: 264 });
const centres: LabView = {
  render(v) {
    const p = centresPlot,
      A = p.P(-3, 0),
      B = p.P(3, 0),
      C = p.P(v.x, v.h),
      isCircum = v.mode === 0;
    const uY = (v.x * v.x + v.h * v.h - 9) / (2 * v.h),
      a = Math.hypot(v.x - 3, v.h),
      b = Math.hypot(v.x + 3, v.h),
      perimeter = a + b + 6,
      ix = (-3 * a + 3 * b + 6 * v.x) / perimeter,
      iy = (6 * v.h) / perimeter,
      centre = p.P(isCircum ? 0 : ix, isCircum ? uY : iy),
      radius = isCircum ? Math.hypot(3, uY) : iy;
    let out =
      open("Dreieck mit Umkreis oder Inkreis und Konstruktionslinien") +
      title(
        isCircum
          ? "Umkreis: Mittelsenkrechte"
          : "Inkreis: innere Winkelhalbierende",
      ) +
      polygon([A, B, C], "lab-fill-a");
    if (isCircum) {
      out += line(p.X(0), p.Y(-5), p.X(0), p.Y(7), "lab-dashed");
      const mid = { x: (3 + v.x) / 2, y: v.h / 2 },
        dx = v.x - 3,
        dy = v.h;
      out += line(
        p.X(mid.x - dy * 1.5),
        p.Y(mid.y + dx * 1.5),
        p.X(mid.x + dy * 1.5),
        p.Y(mid.y - dx * 1.5),
        "lab-dashed",
      );
    } else
      out +=
        line(A.x, A.y, centre.x, centre.y, "lab-dashed") +
        line(B.x, B.y, centre.x, centre.y, "lab-dashed") +
        line(centre.x, centre.y, centre.x, p.Y(0), "lab-side-c");
    out +=
      `<defs>${p.clip("centres")}</defs><g clip-path="url(#centres)">` +
      circle(centre.x, centre.y, radius * p.sx, "lab-curve-2") +
      "</g>" +
      circle(centre.x, centre.y, 4, "lab-dot-small") +
      text(centre.x + 9, centre.y - 6, isCircum ? "U" : "I") +
      handle("C", C.x, C.y, "Punkt C");
    return (
      out +
      text(
        260,
        325,
        "Die Kreise sind maßstäblich; U kann außerhalb liegen.",
        "lab-text-small",
        "middle",
      ) +
      "</svg>"
    );
  },
  handles: {
    C: coordinateHandle("x", "h", (p) => ({
      x: centresPlot.invX(p.x),
      y: centresPlot.invY(p.y),
    })),
  },
};
const centroidPlot = new Plot(-5, 5, 0, 7, { x: 60, y: 30, w: 400, h: 280 });
const centroid: LabView = {
  render(v) {
    const p = centroidPlot,
      A = p.P(-3, 0),
      B = p.P(3, 0),
      C = p.P(v.x, v.h),
      S = p.P(v.x / 3, v.h / 3);
    return (
      open("Drei Seitenhalbierende und Schwerpunkt im Dreieck") +
      title(`S(${fmt(v.x / 3)} | ${fmt(v.h / 3)}), Verhältnis 2 : 1`) +
      polygon([A, B, C], "lab-fill-a") +
      line(C.x, C.y, p.X(0), p.Y(0), "lab-side-c") +
      line(A.x, A.y, p.X((3 + v.x) / 2), p.Y(v.h / 2), "lab-dashed") +
      line(B.x, B.y, p.X((-3 + v.x) / 2), p.Y(v.h / 2), "lab-dashed") +
      circle(S.x, S.y, 5, "lab-dot-small") +
      text(S.x + 10, S.y - 6, "S") +
      handle("C", C.x, C.y, "Punkt C") +
      "</svg>"
    );
  },
  handles: {
    C: coordinateHandle("x", "h", (p) => ({
      x: centroidPlot.invX(p.x),
      y: centroidPlot.invY(p.y),
    })),
  },
};
export const DREIECKE_VIEWS = {
  "triangle-existence": triangleView(false),
  "triangle-construction": triangleView(true),
  "triangle-ssw": ssw,
  congruence,
  "triangle-centres": centres,
  centroid,
};
