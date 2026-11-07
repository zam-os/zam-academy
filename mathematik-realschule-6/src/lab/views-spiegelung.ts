import { fmt } from "../exercises/format";
import { mirrorPoint } from "../models";
import {
  Plot,
  circle,
  clipped,
  handle,
  line,
  open,
  polar,
  polygon,
  text,
  type LabView,
  type Pt,
} from "./svg";
import { title } from "./view-helpers";

const box = { x: 20, y: 10, w: 480, h: 320 };

/** Fixed base of the triangle in the mirror lab; A is the corner the learner drags. */
export const BASE_B = { x: -3, y: -2 };
export const BASE_C = { x: -1, y: -3.5 };

const mirrorPlot = new Plot(-7.5, 7.5, -5, 5, box);
const AXIS_ANGLES = [90, 0, 45, 135];

const mirrorTriangle: LabView = {
  render(v) {
    const p = mirrorPlot;
    const deg = AXIS_ANGLES[v.axis];
    const A = { x: v.ax, y: v.ay };
    const corners = [A, BASE_B, BASE_C];
    const images = corners.map((c) => mirrorPoint(c.x, c.y, deg));
    const t = (deg * Math.PI) / 180;
    const far = 20;
    const P = (q: { x: number; y: number }) => p.P(q.x, q.y);
    let out =
      open("Dreieck, Spiegelachse und Bilddreieck") +
      p.grid(1, 2) +
      `<defs>${p.clip("mirror")}</defs>` +
      clipped(
        "mirror",
        line(p.X(-far * Math.cos(t)), p.Y(-far * Math.sin(t)), p.X(far * Math.cos(t)), p.Y(far * Math.sin(t)), "lab-curve-2") +
          corners.map((c, i) => line(p.X(c.x), p.Y(c.y), p.X(images[i].x), p.Y(images[i].y), "lab-dashed")).join("") +
          polygon(corners.map(P), "lab-fill-a") +
          polygon(images.map(P), "lab-fill-b"),
      );
    const names = ["A", "B", "C"];
    corners.forEach((c, i) => {
      out += text(p.X(c.x) + 8, p.Y(c.y) - 8, names[i], "lab-text-a");
      out += text(p.X(images[i].x) + 8, p.Y(images[i].y) - 8, `${names[i]}'`, "lab-text-b");
    });
    return (
      out +
      handle("a", p.X(v.ax), p.Y(v.ay), "Punkt A") +
      "</svg>"
    );
  },
  handles: {
    a: {
      x: "ax",
      y: "ay",
      drag: (q) => ({ ax: mirrorPlot.invX(q.x), ay: mirrorPlot.invY(q.y) }),
    },
  },
};

const coordsPlot = new Plot(-7.5, 7.5, -5, 5, box);

const mirrorCoords: LabView = {
  render(v, r) {
    const p = coordsPlot;
    const px = Number(r.imageX);
    const py = Number(r.imageY);
    const vertical = v.axis === 0 || v.axis === 2;
    const c = v.axis === 0 || v.axis === 1 ? 0 : v.c;
    let out =
      open("Punkt und Bildpunkt im Koordinatensystem") +
      p.grid(1, 1) +
      (vertical
        ? line(p.X(c), p.Y(-5), p.X(c), p.Y(5), "lab-curve-2")
        : line(p.X(-7.5), p.Y(c), p.X(7.5), p.Y(c), "lab-curve-2")) +
      line(p.X(v.x), p.Y(v.y), p.X(px), p.Y(py), "lab-dashed");
    out += circle(p.X(px), p.Y(py), 7, "lab-point-b");
    out += text(p.X(px) + 10, p.Y(py) - 10, "P'", "lab-text-b");
    out += text(p.X(v.x) + 10, p.Y(v.y) - 10, "P", "lab-text-a");
    return out + handle("p", p.X(v.x), p.Y(v.y), "Punkt P") + "</svg>";
  },
  handles: {
    p: {
      x: "x",
      y: "y",
      drag: (q) => ({ x: coordsPlot.invX(q.x), y: coordsPlot.invY(q.y) }),
    },
  },
};

const constructPlot = new Plot(-7.5, 7.5, -5, 5, box);

/** Both intersections of two equal circles around A and B, when they exist. */
function circlesMeet(A: Pt, B: Pt, radius: number): [Pt, Pt] | null {
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const dist = Math.hypot(dx, dy);
  if (radius <= dist / 2) return null;
  const h = Math.sqrt(radius * radius - (dist * dist) / 4);
  const mx = (A.x + B.x) / 2;
  const my = (A.y + B.y) / 2;
  return [
    { x: mx - (dy / dist) * h, y: my + (dx / dist) * h },
    { x: mx + (dy / dist) * h, y: my - (dx / dist) * h },
  ];
}

const constructPerp: LabView = {
  render(v, r) {
    const p = constructPlot;
    const C = (q: Pt, radius: number, cls: string) =>
      `<circle cx="${p.X(q.x)}" cy="${p.Y(q.y)}" r="${radius * p.sx}" class="${cls}" fill="none" />`;
    let out =
      open("Konstruktion mit Zirkel und Lineal in Schritten") +
      title(String(r.stepText));
    const mark = (q: Pt, name: string) =>
      circle(p.X(q.x), p.Y(q.y), 4, "lab-dot-small") +
      text(p.X(q.x) + 7, p.Y(q.y) - 7, name, "lab-text");
    if (v.mode === 0) {
      const A = { x: -3, y: -1 };
      const B = { x: 3, y: -1 };
      out += line(p.X(A.x), p.Y(A.y), p.X(B.x), p.Y(B.y), "lab-axis") + mark(A, "A") + mark(B, "B");
      if (v.step >= 1) out += C(A, v.r, "lab-thin");
      if (v.step >= 2) out += C(B, v.r, "lab-thin");
      const meet = circlesMeet(A, B, v.r);
      if (v.step >= 3 && meet)
        out +=
          line(p.X(0), p.Y(-5), p.X(0), p.Y(4.2), "lab-curve") +
          mark(meet[0], "S₁") +
          mark(meet[1], "S₂");
    } else {
      // The line g is horizontal; the point lies above it (Lot) or on it (Senkrechte).
      const yLine = -2;
      const P = v.mode === 1 ? { x: 0, y: 2 } : { x: 0, y: yLine };
      out += line(p.X(-7.5), p.Y(yLine), p.X(7.5), p.Y(yLine), "lab-axis") + text(p.X(6.3), p.Y(yLine) - 8, "g", "lab-text") + mark(P, "P");
      const drop = Math.abs(P.y - yLine);
      if (v.step >= 1) out += C(P, v.r, "lab-thin");
      if (v.r > drop) {
        const half = Math.sqrt(v.r * v.r - drop * drop);
        const A = { x: -half, y: yLine };
        const B = { x: half, y: yLine };
        if (v.step >= 1) out += mark(A, "A") + mark(B, "B");
        // On the line, circles of the same radius would only touch in P.
        const second = v.mode === 2 ? v.r * 1.5 : v.r;
        if (v.step >= 2) out += C(A, second, "lab-thin") + C(B, second, "lab-thin");
        if (v.step >= 3) out += line(p.X(0), p.Y(-5), p.X(0), p.Y(4.2), "lab-curve");
      }
    }
    return out + "</svg>";
  },
};

const constructBisector: LabView = {
  render(v, r) {
    const S = { x: 180, y: 250 };
    // Rays stop below the title line.
    const reach = (deg: number) =>
      Math.min(320, (S.y - 42) / Math.max(0.01, Math.sin((deg * Math.PI) / 180)));
    const ray = (deg: number, length = reach(deg)) => polar(S.x, S.y, length, deg);
    const a = ray(0, 320);
    const b = ray(v.alpha);
    const R = 80;
    const A = ray(0, R);
    const B = ray(v.alpha, R);
    const half = ray(v.alpha / 2);
    const dist = Math.hypot(A.x - B.x, A.y - B.y);
    const radiusTwo = Math.max(70, dist / 2 + 20);
    const W = ray(
      v.alpha / 2,
      R * Math.cos(((v.alpha / 2) * Math.PI) / 180) +
        Math.sqrt(radiusTwo * radiusTwo - (dist * dist) / 4),
    );
    let out =
      open("Winkelhalbierende mit Zirkel und Lineal in Schritten") +
      title(String(r.stepText)) +
      line(S.x, S.y, a.x, a.y, "lab-axis") +
      line(S.x, S.y, b.x, b.y, "lab-axis") +
      text(S.x - 16, S.y + 6, "S", "lab-text");
    if (v.step >= 1)
      out +=
        `<circle cx="${S.x}" cy="${S.y}" r="${R}" class="lab-thin" fill="none" />` +
        circle(A.x, A.y, 4, "lab-dot-small") +
        circle(B.x, B.y, 4, "lab-dot-small") +
        text(A.x + 6, A.y + 18, "A", "lab-text") +
        text(B.x + 8, B.y, "B", "lab-text");
    if (v.step >= 2)
      out +=
        `<circle cx="${A.x}" cy="${A.y}" r="${radiusTwo}" class="lab-thin" fill="none" />` +
        `<circle cx="${B.x}" cy="${B.y}" r="${radiusTwo}" class="lab-thin" fill="none" />` +
        circle(W.x, W.y, 4, "lab-dot-small") +
        text(W.x + 8, W.y - 6, "W", "lab-text");
    if (v.step >= 3) out += line(S.x, S.y, half.x, half.y, "lab-curve");
    return out + "</svg>";
  },
};

/** Figures centred on the axis point (0 | 0), so every axis runs through the origin. */
export const FIGURES: Array<{ name: string; points: Pt[]; axes: number }> = [
  { name: "Rechteck", axes: 2, points: [{ x: -3, y: -1.5 }, { x: 3, y: -1.5 }, { x: 3, y: 1.5 }, { x: -3, y: 1.5 }] },
  { name: "Quadrat", axes: 4, points: [{ x: -2, y: -2 }, { x: 2, y: -2 }, { x: 2, y: 2 }, { x: -2, y: 2 }] },
  {
    name: "gleichseitiges Dreieck",
    axes: 3,
    points: [90, 210, 330].map((deg) => ({
      x: 3 * Math.cos((deg * Math.PI) / 180),
      y: 3 * Math.sin((deg * Math.PI) / 180),
    })),
  },
  { name: "gleichschenkliges Dreieck", axes: 1, points: [{ x: -2.5, y: -1.5 }, { x: 2.5, y: -1.5 }, { x: 0, y: 3 }] },
  { name: "gleichschenkliges Trapez", axes: 1, points: [{ x: -3.5, y: -1.5 }, { x: 3.5, y: -1.5 }, { x: 1.5, y: 1.5 }, { x: -1.5, y: 1.5 }] },
  { name: "Parallelogramm", axes: 0, points: [{ x: -3.5, y: -1.5 }, { x: 1.5, y: -1.5 }, { x: 3.5, y: 1.5 }, { x: -1.5, y: 1.5 }] },
  {
    name: "regelmäßiges Sechseck",
    axes: 6,
    points: [0, 60, 120, 180, 240, 300].map((deg) => ({
      x: 3 * Math.cos((deg * Math.PI) / 180),
      y: 3 * Math.sin((deg * Math.PI) / 180),
    })),
  },
];

const axisPlot = new Plot(-7.5, 7.5, -5, 5, box);
const AXIS_REACH = 3.9;

const symmetryAxes: LabView = {
  render(v, r) {
    const p = axisPlot;
    const fig = FIGURES[v.figure];
    const t = (v.theta * Math.PI) / 180;
    const image = fig.points.map((q) => mirrorPoint(q.x, q.y, v.theta));
    const on = r.isAxis === "ja";
    return (
      open(`${fig.name} mit prüfbarer Spiegelachse`) +
      polygon(fig.points.map((q) => p.P(q.x, q.y)), "lab-fill-a") +
      polygon(image.map((q) => p.P(q.x, q.y)), on ? "lab-fill-ok" : "lab-fill-b") +
      line(p.X(-4.25 * Math.cos(t)), p.Y(-4.25 * Math.sin(t)), p.X(4.25 * Math.cos(t)), p.Y(4.25 * Math.sin(t)), "lab-curve-2") +
      handle("theta", p.X(AXIS_REACH * Math.cos(t)), p.Y(AXIS_REACH * Math.sin(t)), "Spiegelachse drehen") +
      text(260, 24, on ? "Bild und Figur decken sich: Symmetrieachse!" : "Bild und Figur decken sich nicht.", "lab-text", "middle") +
      "</svg>"
    );
  },
  handles: {
    theta: {
      x: "theta",
      drag: (q) => {
        const deg = (Math.atan2(axisPlot.invY(q.y), axisPlot.invX(q.x)) * 180) / Math.PI;
        const folded = ((deg % 180) + 180) % 180;
        return { theta: folded > 172.5 ? 0 : folded };
      },
    },
  },
};

/** The corners of one member of a family of figures, around the origin. */
export function familyPoints(family: number, a: number, b: number, s: number): Pt[] {
  if (family === 0) {
    // Kite: vertical diagonal a, horizontal diagonal b, crossing moved by s.
    const half = b / 2;
    return [
      { x: 0, y: a / 2 },
      { x: half, y: s },
      { x: 0, y: -a / 2 },
      { x: -half, y: s },
    ];
  }
  if (family === 1) {
    // Bottom side b, top side a, height 3, top side moved by s.
    return [
      { x: -b / 2, y: -1.5 },
      { x: b / 2, y: -1.5 },
      { x: s + a / 2, y: 1.5 },
      { x: s - a / 2, y: 1.5 },
    ];
  }
  // Triangle: base a, height b, apex moved by s.
  return [
    { x: -a / 2, y: -b / 2 },
    { x: a / 2, y: -b / 2 },
    { x: s, y: b / 2 },
  ];
}

const familyPlot = new Plot(-7.5, 7.5, -5, 5, box);
const special: LabView = {
  render(v, r) {
    const p = familyPlot;
    const points = familyPoints(v.family, v.a, v.b, v.s);
    let out =
      open("Figur aus einer Familie mit ihren Symmetrieachsen") +
      polygon(points.map((q) => p.P(q.x, q.y)), "lab-fill-a");
    const axes = String(r.axesList);
    if (axes.includes("senkrecht"))
      out += line(p.X(0), p.Y(-4.3), p.X(0), p.Y(4.1), "lab-curve-2");
    if (axes.includes("waagerecht"))
      out += line(p.X(-7.5), p.Y(0), p.X(7.5), p.Y(0), "lab-curve-2");
    if (axes.includes("schräg")) {
      // The axis runs from the corner between the equal sides to the opposite midpoint.
      const [A, B, C] = points;
      const corner = (C.x - A.x) ** 2 + (C.y - A.y) ** 2 === v.a * v.a ? A : B;
      const other = corner === A ? B : A;
      const mid = { x: (other.x + C.x) / 2, y: (other.y + C.y) / 2 };
      const dx = mid.x - corner.x;
      const dy = mid.y - corner.y;
      out += line(p.X(corner.x - dx), p.Y(corner.y - dy), p.X(corner.x + 3 * dx), p.Y(corner.y + 3 * dy), "lab-curve-2");
    }
    if (axes.includes("Diagonalen")) {
      out += line(p.X(-4.1), p.Y(-4.1), p.X(4.1), p.Y(4.1), "lab-curve-2");
      out += line(p.X(-4.1), p.Y(4.1), p.X(4.1), p.Y(-4.1), "lab-curve-2");
    }
    return (
      out +
      text(260, 32, `${r.name}: ${r.axes} Symmetrieachse${r.axes === 1 ? "" : "n"}`, "lab-text", "middle") +
      text(260, 320, `Maße: ${fmt(v.a)} und ${fmt(v.b)}, Versatz ${fmt(v.s)}`, "lab-text-small", "middle") +
      "</svg>"
    );
  },
};

export const SPIEGELUNG_VIEWS = {
  "mirror-triangle": mirrorTriangle,
  "mirror-coords": mirrorCoords,
  "construct-perp": constructPerp,
  "construct-bisector": constructBisector,
  "symmetry-axes": symmetryAxes,
  "special-figures": special,
};
