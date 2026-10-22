import { required } from "../model/required";
import { CONGRUENCE_CASES } from "../curriculum/stage-1-figuren";
import { ROTATION_ANGLES, SYMMETRY_ORDERS } from "../curriculum/stage-2-drehung";
import { fmt } from "../exercises/format";
import { QUADS, rotate, triangleVertex } from "../math";
import type { LabKind, LabValues } from "../model/types";
import {
  arrow,
  circle,
  handle,
  line,
  open,
  Plot,
  polygon,
  text,
  type LabView,
  type Pt,
} from "./svg";

function triangles(v: LabValues, construction: boolean): string {
  const left = Math.min(-v.b, v.c - v.a),
    right = Math.max(v.b, v.c + v.a);
  const s = Math.min(450 / (right - left), 125 / Math.max(v.a, v.b));
  const P = (x: number, y: number): Pt => ({ x: 35 + (x - left) * s, y: 175 - y * s });
  const A = P(0, 0),
    B = P(v.c, 0),
    C = triangleVertex(v.a, v.b, v.c),
    step = construction ? v.step : 4;
  let out =
    open("Dreieck mit Grundseite AB und Konstruktionskreisen") +
    line(A.x, A.y, B.x, B.y, "lab-side-c");
  if (step >= 2) out += circle(A.x, A.y, v.b * s, "lab-ghost");
  if (step >= 3) out += circle(B.x, B.y, v.a * s, "lab-ghost");
  if (C && step >= 3) {
    const upper = P(C.x, C.y),
      lower = P(C.x, -C.y);
    if (step === 4)
      out += polygon([A, B, upper], "lab-shape") + polygon([A, B, lower], "lab-ghost");
    out +=
      circle(upper.x, upper.y, 4, "lab-point-ok") +
      text(upper.x + 8, upper.y - 8, "C") +
      circle(lower.x, lower.y, 4, "lab-point") +
      text(lower.x + 8, lower.y + 15, "C*");
  }
  out +=
    text(A.x - 8, A.y + 20, "A") +
    text(B.x + 8, B.y + 20, "B") +
    text(
      260,
      320,
      C ? "Zwei gespiegelte, kongruente Dreiecke" : "Keine zwei Schnittpunkte: kein echtes Dreieck",
      C ? "lab-text-ok" : "lab-text-bad",
      "middle",
    );
  return `${out}</svg>`;
}

const congruence: LabView = {
  render: (v) => {
    let out = open("Konstruktionsfälle für kongruente Dreiecke");
    const s = 32,
      A = { x: 75, y: 270 };
    const P = (x: number, y: number) => ({ x: A.x + s * x, y: A.y - s * y });
    if (v.case === 4) {
      const B = P(7, 0),
        angle = Math.PI / 6,
        root = Math.sqrt(25 - (7 * Math.sin(angle)) ** 2);
      out +=
        circle(B.x, B.y, 5 * s, "lab-ghost") +
        line(A.x, A.y, P(11, 11 * Math.tan(angle)).x, P(11, 11 * Math.tan(angle)).y, "lab-thin");
      for (const t of [7 * Math.cos(angle) - root, 7 * Math.cos(angle) + root])
        out += polygon([A, B, P(t * Math.cos(angle), t * Math.sin(angle))], "lab-shape");
      out += text(260, 33, "Zwei verschiedene Dreiecke sind möglich", "lab-text-bad", "middle");
    } else if (v.case === 5) {
      const side = (6 * Math.sin(Math.PI / 3)) / Math.sin((80 * Math.PI) / 180);
      const p = {
        x: side * Math.cos((40 * Math.PI) / 180),
        y: side * Math.sin((40 * Math.PI) / 180),
      };
      out +=
        polygon([P(0, 0), P(6, 0), P(p.x, p.y)], "lab-shape") +
        polygon([P(0, 0), P(9, 0), P(p.x * 1.5, p.y * 1.5)], "lab-ghost") +
        text(
          260,
          33,
          "40°, 60°, 80°: gleiche Winkel, verschiedene Größe",
          "lab-text-bad",
          "middle",
        );
    } else {
      let B = P(7, 0),
        C = P(3, 5);
      if (v.case === 0) {
        const p = required(triangleVertex(5, 6, 7));
        C = P(p.x, p.y);
      }
      if (v.case === 1)
        C = P(5 * Math.cos((50 * Math.PI) / 180), 5 * Math.sin((50 * Math.PI) / 180));
      if (v.case === 2) {
        B = P(6, 0);
        const side = (6 * Math.sin((65 * Math.PI) / 180)) / Math.sin((70 * Math.PI) / 180);
        C = P(side / Math.sqrt(2), side / Math.sqrt(2));
      }
      if (v.case === 3) {
        B = P(5, 0);
        const a = (70 * Math.PI) / 180,
          t = 5 * Math.cos(a) + Math.sqrt(49 - (5 * Math.sin(a)) ** 2);
        C = P(t * Math.cos(a), t * Math.sin(a));
      }
      out +=
        polygon([A, B, C], "lab-shape") +
        text(A.x - 10, A.y + 18, "A") +
        text(B.x + 8, B.y + 18, "B") +
        text(C.x, C.y - 10, "C") +
        text(
          260,
          33,
          `${CONGRUENCE_CASES[v.case].label}: Form und Größe festgelegt`,
          "lab-text-ok",
          "middle",
        );
    }
    return `${out}</svg>`;
  },
};

const quads: Pt[][] = [
  [
    { x: 80, y: 265 },
    { x: 430, y: 265 },
    { x: 350, y: 90 },
    { x: 160, y: 90 },
  ],
  [
    { x: 260, y: 55 },
    { x: 410, y: 175 },
    { x: 260, y: 285 },
    { x: 110, y: 175 },
  ],
  [
    { x: 70, y: 265 },
    { x: 340, y: 265 },
    { x: 440, y: 90 },
    { x: 170, y: 90 },
  ],
  [
    { x: 90, y: 175 },
    { x: 260, y: 75 },
    { x: 430, y: 175 },
    { x: 260, y: 275 },
  ],
  [
    { x: 90, y: 85 },
    { x: 430, y: 85 },
    { x: 430, y: 265 },
    { x: 90, y: 265 },
  ],
  [
    { x: 160, y: 70 },
    { x: 360, y: 70 },
    { x: 360, y: 270 },
    { x: 160, y: 270 },
  ],
];
const quadrilaterals: LabView = {
  render: (v) => {
    const pts = quads[v.shape];
    let out = open(`Eigenschaften des Vierecks ${QUADS[v.shape]}`) + polygon(pts, "lab-shape");
    if (v.diagonals)
      out +=
        line(pts[0].x, pts[0].y, pts[2].x, pts[2].y, "lab-side-a") +
        line(pts[1].x, pts[1].y, pts[3].x, pts[3].y, "lab-side-b");
    pts.forEach((p, i) => {
      out += text(p.x + 8, p.y - 8, "ABCD"[i]);
    });
    return out + text(260, 325, QUADS[v.shape], "lab-text-big", "middle") + "</svg>";
  },
};

const quadConstruction: LabView = {
  render: (v, r) => {
    const s = 24,
      x = 70,
      y = 285;
    let pts: Pt[];
    if (v.shape === 2) {
      const cx = 110 + (v.a * s * v.shift) / 5;
      pts = [
        { x: 110, y: 175 },
        { x: cx, y: 175 - (v.h * s) / 2 },
        { x: 110 + v.a * s, y: 175 },
        { x: cx, y: 175 + (v.h * s) / 2 },
      ];
    } else
      pts = [
        { x, y },
        { x: x + v.a * s, y },
        { x: x + (v.shift + (v.shape === 0 ? v.a : v.c)) * s, y: y - v.h * s },
        { x: x + v.shift * s, y: y - v.h * s },
      ];
    let out = open("Konstruierbares Viereck und seine Fläche") + polygon(pts, "lab-shape");
    if (v.shape === 2)
      out +=
        line(pts[0].x, pts[0].y, pts[2].x, pts[2].y, "lab-side-a") +
        line(pts[1].x, pts[1].y, pts[3].x, pts[3].y, "lab-side-b");
    else
      out +=
        line(pts[3].x, pts[3].y, pts[3].x, y, "lab-dashed") +
        text(pts[3].x + 8, (pts[3].y + y) / 2, `h = ${v.h}`);
    out += text(260, 325, `A = ${fmt(Number(r.area), 1)} cm²`, "lab-text-big", "middle");
    return `${out}</svg>`;
  },
};

const turnPlot = new Plot(-8, 8, -8, 8, { x: 110, y: 15, w: 300, h: 300 });
const rotation: LabView = {
  render: (v) => {
    const p = turnPlot,
      Z = p.P(v.zx, v.zy),
      P = p.P(v.x, v.y),
      q = rotate({ x: v.x, y: v.y }, v.angle, { x: v.zx, y: v.zy }),
      Q = p.P(q.x, q.y);
    const tri = [
      { x: v.x, y: v.y },
      { x: v.x + 0.8, y: v.y },
      { x: v.x, y: v.y + 0.8 },
    ];
    return (
      open("Drehung von Punkt und Dreieck um ein Zentrum") +
      p.grid(2, 4) +
      polygon(
        tri.map((t) => p.P(t.x, t.y)),
        "lab-shape",
      ) +
      polygon(
        tri.map((t) => {
          const q = rotate(t, v.angle, { x: v.zx, y: v.zy });
          return p.P(q.x, q.y);
        }),
        "lab-shape-2",
      ) +
      circle(Z.x, Z.y, Math.hypot(P.x - Z.x, P.y - Z.y), "lab-ghost") +
      line(Z.x, Z.y, P.x, P.y, "lab-side-a") +
      line(Z.x, Z.y, Q.x, Q.y, "lab-side-b") +
      circle(Z.x, Z.y, 4, "lab-point") +
      text(Z.x + 6, Z.y - 8, "Z") +
      text(Q.x + 8, Q.y - 8, "P′") +
      handle("P", P.x, P.y, "Punkt P") +
      text(260, 335, `Drehwinkel ${fmt(v.angle)}°`, "lab-text", "middle") +
      "</svg>"
    );
  },
  handles: {
    P: { x: "x", y: "y", drag: (p) => ({ x: turnPlot.invX(p.x), y: turnPlot.invY(p.y) }) },
  },
};

const symmetry: LabView = {
  render: (v) => {
    const n = SYMMETRY_ORDERS[v.shape],
      shape =
        v.shape === 4
          ? [
              { x: -4, y: -2 },
              { x: 4, y: -2 },
              { x: 4, y: 2 },
              { x: -4, y: 2 },
            ]
          : Array.from({ length: n }, (_, i) => ({
              x: 4.8 * Math.cos(Math.PI / 2 + (i * 2 * Math.PI) / n),
              y: 4.8 * Math.sin(Math.PI / 2 + (i * 2 * Math.PI) / n),
            }));
    const P = (t: { x: number; y: number }) => ({ x: 260 + t.x * 23, y: 170 - t.y * 23 });
    return (
      open("Ursprüngliche Figur und gedrehte Kopie") +
      polygon(shape.map(P), "lab-shape") +
      polygon(
        shape.map((q) => P(rotate(q, v.angle))),
        "lab-shape-2",
      ) +
      circle(260, 170, 4, "lab-point") +
      text(260, 320, `Drehung ${v.angle}°; Grundwinkel ${360 / n}°`, "lab-text", "middle") +
      "</svg>"
    );
  },
};

const vecPlot = new Plot(-6, 6, -6, 6, { x: 105, y: 15, w: 300, h: 300 });
const vectors: LabView = {
  render: (v) => {
    const p = vecPlot,
      A = p.P(0, 0),
      B = p.P(v.x, v.y),
      r = rotate({ x: v.x, y: v.y }, ROTATION_ANGLES[v.turn]),
      C = p.P(r.x, r.y);
    return (
      open("Vektor und sein gedrehter Bildvektor") +
      p.grid(1, 2) +
      arrow(A.x, A.y, B.x, B.y, "lab-side-a") +
      arrow(A.x, A.y, C.x, C.y, "lab-side-b") +
      handle("v", B.x, B.y, "Vektorspitze") +
      text(B.x + 10, B.y - 10, "v") +
      text(C.x + 10, C.y - 10, "v′") +
      text(260, 335, `(${v.x}|${v.y}) → (${fmt(r.x)}|${fmt(r.y)})`, "lab-text", "middle") +
      "</svg>"
    );
  },
  handles: { v: { x: "x", y: "y", drag: (p) => ({ x: vecPlot.invX(p.x), y: vecPlot.invY(p.y) }) } },
};

export const FIGUREN_VIEWS: Partial<Record<LabKind, LabView>> = {
  "triangle-existence": { render: (v) => triangles(v, false) },
  "triangle-construction": { render: (v) => triangles(v, true) },
  congruence,
  quadrilaterals,
  "quad-construction": quadConstruction,
  rotation,
  "rotational-symmetry": symmetry,
  "vector-rotation": vectors,
};
