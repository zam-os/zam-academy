import { fmt } from "../exercises/format";
import {
  Plot,
  handle,
  line,
  open,
  polygon,
  rect,
  text,
  type LabView,
  type Pt,
} from "./svg";
import { title } from "./view-helpers";

/** Units of the area labs: one length unit is 34 drawing units, always on the same grid. */
const areaPlot = new Plot(0, 14, 0, 9, { x: 22, y: 22, w: 476, h: 306 });
const P = (x: number, y: number): Pt => areaPlot.P(x, y);

const parallelogram: LabView = {
  render(v, r) {
    const x0 = 2;
    const y0 = 1;
    const corners = [P(x0, y0), P(x0 + v.g, y0), P(x0 + v.g + v.s, y0 + v.h), P(x0 + v.s, y0 + v.h)];
    let out =
      open("Parallelogramm und flächengleiches Rechteck") +
      areaPlot.grid(1, 100, "", "") +
      polygon(corners, v.cut === 1 ? "lab-fill-ok" : "lab-fill-a");
    if (v.cut === 1) {
      // The triangle cut off on the left is moved to the right end.
      out +=
        polygon([P(x0, y0), P(x0 + v.s, y0), P(x0 + v.s, y0 + v.h)], "lab-fill-b") +
        polygon([P(x0 + v.g, y0), P(x0 + v.g + v.s, y0), P(x0 + v.g + v.s, y0 + v.h)], "lab-fill-b") +
        line(areaPlot.X(x0 + v.s), areaPlot.Y(y0), areaPlot.X(x0 + v.s), areaPlot.Y(y0 + v.h), "lab-curve-2");
    } else {
      out += line(areaPlot.X(x0 + v.s), areaPlot.Y(y0), areaPlot.X(x0 + v.s), areaPlot.Y(y0 + v.h), "lab-dashed");
    }
    return (
      out +
      text(areaPlot.X(x0 + v.g / 2), areaPlot.Y(y0) + 18, `g = ${fmt(v.g)}`, "lab-text", "middle") +
      text(areaPlot.X(x0 + v.s) + 6, areaPlot.Y(y0 + v.h / 2), `h = ${fmt(v.h)}`, "lab-text") +
      text(260, 18, `A = g · h = ${fmt(Number(r.area))}`, "lab-text", "middle") +
      handle("s", areaPlot.X(x0 + v.s), areaPlot.Y(y0 + v.h), "Obere Ecke verschieben") +
      "</svg>"
    );
  },
  handles: {
    s: { x: "s", drag: (q) => ({ s: areaPlot.invX(q.x) - 2 }) },
  },
};

const triangle: LabView = {
  render(v, r) {
    const x0 = 3;
    const y0 = 1;
    const apex = P(x0 + v.s, y0 + v.h);
    const out =
      open("Dreieck mit Grundseite und zugehöriger Höhe") +
      areaPlot.grid(1, 100, "", "") +
      polygon([P(x0, y0), P(x0 + v.g, y0), P(x0 + v.g + v.s, y0 + v.h), apex], "lab-ghost-fill") +
      polygon([P(x0, y0), P(x0 + v.g, y0), apex], "lab-fill-a") +
      line(apex.x, apex.y, apex.x, areaPlot.Y(y0), "lab-curve-2") +
      (v.s < 0 || v.s > v.g
        ? line(areaPlot.X(x0 + Math.min(0, v.s)), areaPlot.Y(y0), areaPlot.X(x0 + Math.max(v.g, v.s)), areaPlot.Y(y0), "lab-dashed")
        : "");
    return (
      out +
      text(areaPlot.X(x0 + v.g / 2), areaPlot.Y(y0) + 18, `g = ${fmt(v.g)}`, "lab-text", "middle") +
      text(apex.x + 8, areaPlot.Y(y0 + v.h / 2), `h = ${fmt(v.h)}`, "lab-text-b") +
      text(260, 18, `A = g · h : 2 = ${fmt(Number(r.area))}. Hell: das halbe Parallelogramm`, "lab-text", "middle") +
      handle("apex", apex.x, apex.y, "Spitze des Dreiecks") +
      "</svg>"
    );
  },
  handles: {
    apex: {
      x: "s",
      y: "h",
      drag: (q) => ({ s: areaPlot.invX(q.x) - 3, h: areaPlot.invY(q.y) - 1 }),
    },
  },
};

const trapezoid: LabView = {
  render(v, r) {
    const x0 = 1;
    const y0 = 1;
    const D = P(x0 + v.s, y0 + v.h);
    const C = P(x0 + v.s + v.c, y0 + v.h);
    return (
      open("Trapez mit zwei parallelen Seiten und Höhe") +
      areaPlot.grid(1, 100, "", "") +
      polygon([P(x0, y0), P(x0 + v.a, y0), C, D], "lab-fill-a") +
      line(D.x, D.y, D.x, areaPlot.Y(y0), "lab-curve-2") +
      text(areaPlot.X(x0 + v.a / 2), areaPlot.Y(y0) + 18, `a = ${fmt(v.a)}`, "lab-text", "middle") +
      text((C.x + D.x) / 2, D.y - 8, `c = ${fmt(v.c)}`, "lab-text", "middle") +
      text(D.x + 6, areaPlot.Y(y0 + v.h / 2), `h = ${fmt(v.h)}`, "lab-text-b") +
      text(260, 18, `A = (a + c) · h : 2 = ${fmt(Number(r.area))}`, "lab-text", "middle") +
      handle("d", D.x, D.y, "Obere Ecke D") +
      "</svg>"
    );
  },
  handles: {
    d: {
      x: "s",
      y: "h",
      drag: (q) => ({ s: areaPlot.invX(q.x) - 1, h: areaPlot.invY(q.y) - 1 }),
    },
  },
};

const kite: LabView = {
  render(v, r) {
    const cx = 7;
    const cy = 4.5;
    const top = P(cx, cy + v.e / 2);
    const bottom = P(cx, cy - v.e / 2);
    const left = P(cx - v.f / 2, cy + v.s);
    const right = P(cx + v.f / 2, cy + v.s);
    return (
      open("Drachenviereck in seinem umgebenden Rechteck") +
      areaPlot.grid(1, 100, "", "") +
      rect(left.x, top.y, right.x - left.x, bottom.y - top.y, "lab-fill-b") +
      polygon([top, right, bottom, left], "lab-fill-a") +
      line(top.x, top.y, bottom.x, bottom.y, "lab-curve-2") +
      line(left.x, left.y, right.x, right.y, "lab-curve") +
      text(top.x + 8, (top.y + bottom.y) / 2 - 14, `e = ${fmt(v.e)}`, "lab-text-b") +
      text(right.x + 8, right.y + 4, `f = ${fmt(v.f)}`, "lab-text-a") +
      text(260, 18, `A = e · f : 2 = ${fmt(Number(r.area))}. Rechteck außen: ${fmt(v.e * v.f)}`, "lab-text", "middle") +
      handle("right", right.x, right.y, "Rechte Ecke") +
      "</svg>"
    );
  },
  handles: {
    right: {
      x: "f",
      y: "s",
      drag: (q) => ({ f: 2 * (areaPlot.invX(q.x) - 7), s: areaPlot.invY(q.y) - 4.5 }),
    },
  },
};

const polygonArea: LabView = {
  render(v, r) {
    const x0 = 1;
    const y0 = 1;
    let out = open("Zusammengesetzte Figur in Teilflächen") + areaPlot.grid(1, 100, "", "");
    if (v.mode === 0) {
      // L-shape: wide bottom rectangle a × d and upper rectangle c × (b − d).
      out +=
        rect(areaPlot.X(x0), areaPlot.Y(y0 + v.d), v.a * areaPlot.sx, v.d * areaPlot.sy, "lab-fill-a") +
        rect(areaPlot.X(x0), areaPlot.Y(y0 + v.b), v.c * areaPlot.sx, (v.b - v.d) * areaPlot.sy, "lab-fill-b");
    } else {
      // The same L-shape as a big rectangle minus the corner.
      out +=
        rect(areaPlot.X(x0), areaPlot.Y(y0 + v.b), v.a * areaPlot.sx, v.b * areaPlot.sy, "lab-fill-a") +
        rect(areaPlot.X(x0 + v.c), areaPlot.Y(y0 + v.b), (v.a - v.c) * areaPlot.sx, (v.b - v.d) * areaPlot.sy, "lab-bad-fill");
    }
    return (
      out +
      text(260, 18, String(r.calc), "lab-text", "middle") +
      text(areaPlot.X(x0 + v.a / 2), areaPlot.Y(y0) + 18, `a = ${fmt(v.a)}`, "lab-text", "middle") +
      "</svg>"
    );
  },
};

/** The net of a cuboid: the belt of four faces with bottom and top on it. */
const surface: LabView = {
  render(v, r) {
    const u = Math.min(28, 430 / (2 * v.a + 2 * v.b), 300 / (v.c + 2 * v.b));
    const x0 = 260 - ((2 * v.a + 2 * v.b) * u) / 2;
    const y0 = 185 - (v.c * u) / 2;
    const faces: Array<[number, number, number, number, string]> = [
      [0, 0, v.b, v.c, "lab-fill-c"],
      [v.b, 0, v.a, v.c, "lab-fill-a"],
      [v.b + v.a, 0, v.b, v.c, "lab-fill-c"],
      [2 * v.b + v.a, 0, v.a, v.c, "lab-fill-a"],
      [v.b, -v.b, v.a, v.b, "lab-fill-b"],
      [v.b, v.c, v.a, v.b, "lab-fill-b"],
    ];
    let out = open("Netz eines Quaders mit drei Paaren gleicher Flächen") + title(`O = 2 · (${fmt(v.a * v.b)} + ${fmt(v.a * v.c)} + ${fmt(v.b * v.c)}) = ${fmt(Number(r.surface))}`);
    for (const [x, y, w, h, cls] of faces)
      out += rect(x0 + x * u, y0 + y * u, w * u, h * u, cls);
    return (
      out +
      text(260, 330, "Farben: Boden und Deckel, Vorder- und Rückseite, linke und rechte Seite", "lab-text-small", "middle") +
      "</svg>"
    );
  },
};

export const FLAECHEN_VIEWS = {
  "area-parallelogram": parallelogram,
  "area-triangle": triangle,
  "area-trapezoid": trapezoid,
  "area-kite": kite,
  "area-polygon": polygonArea,
  "surface-net": surface,
};
