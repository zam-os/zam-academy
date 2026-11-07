import { fmt } from "../exercises/format";
import {
  angleKind,
  NET_PATTERNS,
  oppositeFace,
  quadrilateral,
  sideKind,
  SOLIDS,
  validTriangle,
} from "../models";
import {
  arcPath,
  circle,
  handle,
  line,
  open,
  path,
  Plot,
  polar,
  polygon,
  rect,
  sectorPath,
  text,
  type LabView,
  type Pt,
} from "./svg";
import { coordinateHandle, rail, railHandle, title } from "./view-helpers";

const degrees = (p: Pt, cx: number, cy: number) => {
  const raw = (Math.atan2(cy - p.y, p.x - cx) * 180) / Math.PI;
  return raw < 0 ? raw + 360 : raw;
};

const GX = (x: number) => 100 + 40 * x;
const GY = (y: number) => 290 - 40 * y;
/** Where the ray from a through b leaves the drawing box. */
function toEdge(a: Pt, b: Pt): Pt {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const limits = [
    dx > 0 ? (440 - a.x) / dx : dx < 0 ? (80 - a.x) / dx : Infinity,
    dy > 0 ? (310 - a.y) / dy : dy < 0 ? (40 - a.y) / dy : Infinity,
  ];
  const t = Math.min(...limits);
  return { x: a.x + dx * t, y: a.y + dy * t };
}
const lineKinds: LabView = {
  render(v) {
    const a = { x: GX(v.ax), y: GY(v.ay) };
    const b = { x: GX(v.bx), y: GY(v.by) };
    let out = open("Punkte A und B auf Karopapier") + title(["Strecke [AB]", "Halbgerade [AB", "Gerade AB"][v.kind]);
    for (let x = 0; x <= 8; x++) out += line(GX(x), GY(0), GX(x), GY(6), "lab-grid");
    for (let y = 0; y <= 6; y++) out += line(GX(0), GY(y), GX(8), GY(y), "lab-grid");
    const same = v.ax === v.bx && v.ay === v.by;
    if (!same) {
      const start = v.kind === 2 ? toEdge(b, a) : a;
      const end = v.kind === 0 ? b : toEdge(a, b);
      out += line(start.x, start.y, end.x, end.y, "lab-side-a");
    } else out += text(260, 325, "A und B dürfen nicht zusammenfallen.", "lab-text-small", "middle");
    return (
      out +
      text(a.x - 14, a.y - 12, "A", "lab-text") +
      text(b.x + 8, b.y - 12, "B", "lab-text") +
      handle("A", a.x, a.y, "Punkt A", "lab-handle lab-handle-a") +
      handle("B", b.x, b.y, "Punkt B", "lab-handle lab-handle-b") +
      "</svg>"
    );
  },
  handles: {
    A: coordinateHandle("ax", "ay", (p) => ({ x: (p.x - 100) / 40, y: (290 - p.y) / 40 })),
    B: coordinateHandle("bx", "by", (p) => ({ x: (p.x - 100) / 40, y: (290 - p.y) / 40 })),
  },
};

const lineRelations: LabView = {
  render(v) {
    const cx = 260;
    const cy = 170;
    const label = v.angle === 0 ? "g ∥ h" : v.angle === 90 ? "g ⊥ h" : "g und h schneiden sich";
    let out = open("Zwei Geraden und ein Punkt") + title(label);
    out += line(40, cy, 490, cy, "lab-side-a") + text(470, cy + 18, "g", "lab-text-a");
    if (v.angle === 0) {
      out += line(40, cy - v.d * 30, 490, cy - v.d * 30, "lab-side-b") + text(470, cy - v.d * 30 - 8, "h", "lab-text-b");
      out += line(420, cy, 420, cy - v.d * 30, "lab-dashed") + text(428, cy - (v.d * 30) / 2, `${v.d} cm`, "lab-text-small");
    } else {
      const p1 = polar(cx, cy, 170, v.angle);
      const p2 = polar(cx, cy, -170, v.angle);
      out += line(p2.x, p2.y, p1.x, p1.y, "lab-side-b") + text(p1.x + 6, p1.y, "h", "lab-text-b");
      if (v.angle === 90) out += rect(cx, cy - 14, 14, 14, "lab-thin") + circle(cx + 7, cy - 7, 1.6, "lab-dot-small");
    }
    const py = cy - v.p * 30;
    if (v.p !== 0) out += line(110, py, 110, cy, "lab-dashed") + text(118, (py + cy) / 2 + 4, `${Math.abs(v.p)} cm`, "lab-text-small");
    const dial = polar(cx, cy, 130, v.angle);
    return (
      out +
      text(86, py - 10, "P", "lab-text") +
      handle("P", 110, py, "Punkt P") +
      handle("h", dial.x, dial.y, "Gerade h drehen", "lab-handle lab-handle-b") +
      "</svg>"
    );
  },
  handles: {
    P: { y: "p", drag: (p) => ({ p: (170 - p.y) / 30 }) },
    h: {
      x: "angle",
      drag: (p) => ({ angle: Math.min(175, degrees(p, 260, 170) % 180) }),
    },
  },
};

const circleParts: LabView = {
  render(v) {
    const cx = 190;
    const cy = 170;
    const s = 38;
    const point = polar(cx, cy, v.p * s, 25);
    const place = v.p < v.r ? "innerhalb" : v.p > v.r ? "außerhalb" : "auf der Kreislinie";
    return (
      open("Kreis mit Mittelpunkt, Radius und Kreissektor") +
      title(`r = ${v.r} cm, d = ${2 * v.r} cm`) +
      circle(cx, cy, v.r * s, "lab-fill-a") +
      (v.sector > 0 ? path(sectorPath(cx, cy, v.r * s, 0, v.sector), "lab-fill-b") : "") +
      line(cx - v.r * s, cy, cx + v.r * s, cy, "lab-dashed") +
      circle(cx, cy, 3, "lab-dot-small") +
      text(cx - 8, cy + 18, "M", "lab-text") +
      circle(point.x, point.y, 5, "lab-point") +
      text(420, 70, `Punkt P liegt`, "lab-text-small", "middle") +
      text(420, 90, place, "lab-text", "middle") +
      text(420, 130, `Abstand zu M: ${fmt(v.p, 1)} cm`, "lab-text-small", "middle") +
      text(420, 160, `Sektor: ${v.sector}°`, "lab-text-small", "middle") +
      handle("r", cx + v.r * s, cy, "Radius ziehen") +
      handle("p", point.x, point.y, "Punkt P ziehen", "lab-handle lab-handle-b") +
      "</svg>"
    );
  },
  handles: {
    r: { x: "r", drag: (p) => ({ r: (p.x - 190) / 38 }) },
    p: { x: "p", drag: (p) => ({ p: Math.hypot(p.x - 190, p.y - 170) / 38 }) },
  },
};

const triangleTypes: LabView = {
  render(v) {
    const s = 32;
    const ax = 110;
    const ay = 270;
    const bx = ax + v.c * s;
    let out = open("Dreieck aus drei Seitenlängen");
    if (!validTriangle(v.a, v.b, v.c)) {
      return (
        out +
        title("Aus diesen Längen wird kein Dreieck") +
        line(ax, ay, bx, ay, "lab-side-c") +
        text(260, 150, "Die zwei kürzeren Seiten sind zusammen zu kurz.", "lab-text", "middle") +
        handle("c", bx, ay, "Seite c ziehen") +
        "</svg>"
      );
    }
    const x = (v.b * v.b + v.c * v.c - v.a * v.a) / (2 * v.c);
    const y = Math.sqrt(Math.max(0, v.b * v.b - x * x));
    const cPt = { x: ax + x * s, y: ay - y * s };
    out +=
      title(`${sideKind(v.a, v.b, v.c)} und ${angleKind(v.a, v.b, v.c)}`) +
      polygon([{ x: ax, y: ay }, { x: bx, y: ay }, cPt], "lab-fill-a") +
      text((ax + bx) / 2, ay + 18, `c = ${v.c}`, "lab-text-c", "middle") +
      text((ax + cPt.x) / 2 - 22, (ay + cPt.y) / 2, `b = ${v.b}`, "lab-text-b", "end") +
      text((bx + cPt.x) / 2 + 12, (ay + cPt.y) / 2, `a = ${v.a}`, "lab-text-a") +
      handle("c", bx, ay, "Seite c ziehen");
    return out + "</svg>";
  },
  handles: { c: { x: "c", drag: (p) => ({ c: (p.x - 110) / 32 }) } },
};

const QX = 120;
const QY = 270;
const QS = 34;
const quadTypes: LabView = {
  render(v) {
    const q = quadrilateral(v.w, v.h, v.s, v.t);
    const pts = q.points.map((p) => ({ x: QX + p.x * QS, y: QY - p.y * QS }));
    const labels = ["A", "B", "C", "D"];
    let out = open("Viereck zum Verändern") + title(q.name) + polygon(pts, "lab-fill-a");
    pts.forEach((p, i) => {
      out += text(p.x + (i === 0 || i === 3 ? -14 : 8), p.y + (i < 2 ? 16 : -8), labels[i], "lab-text");
    });
    return (
      out +
      handle("B", pts[1].x, pts[1].y, "Ecke B ziehen") +
      handle("D", pts[3].x, pts[3].y, "Ecke D ziehen", "lab-handle lab-handle-b") +
      "</svg>"
    );
  },
  handles: {
    B: { x: "w", drag: (p) => ({ w: (p.x - QX) / QS }) },
    D: {
      x: "s",
      y: "h",
      drag: (p, v) => {
        const inset = Math.min(v.t, Math.floor((v.w - 1) / 2));
        return { s: (p.x - QX) / QS - inset, h: (QY - p.y) / QS };
      },
    },
  },
};

const coordPlot = new Plot(-6, 6, -5, 5);
const coords: LabView = {
  render(v) {
    const pts = [
      coordPlot.P(v.ax, v.ay),
      coordPlot.P(v.bx, v.ay),
      coordPlot.P(v.bx, v.by),
      coordPlot.P(v.ax, v.by),
    ];
    return (
      open("Koordinatensystem mit Rechteck aus zwei Punkten") +
      coordPlot.grid(1, 1) +
      polygon(pts, "lab-fill-a") +
      text(pts[0].x + 10, pts[0].y - 10, `A(${fmt(v.ax, 0)}|${fmt(v.ay, 0)})`, "lab-text-a") +
      text(pts[2].x + 10, pts[2].y - 10, `C(${fmt(v.bx, 0)}|${fmt(v.by, 0)})`, "lab-text-b") +
      handle("A", pts[0].x, pts[0].y, "Punkt A", "lab-handle lab-handle-a") +
      handle("C", pts[2].x, pts[2].y, "Punkt C", "lab-handle lab-handle-b") +
      "</svg>"
    );
  },
  handles: {
    A: coordinateHandle("ax", "ay", (p) => ({ x: coordPlot.invX(p.x), y: coordPlot.invY(p.y) })),
    C: coordinateHandle("bx", "by", (p) => ({ x: coordPlot.invX(p.x), y: coordPlot.invY(p.y) })),
  },
};

const angle: LabView = {
  render(v) {
    const cx = 260;
    const cy = 175;
    const tip = polar(cx, cy, 130, v.a);
    return (
      open("Winkel mit Scheitel und zwei Schenkeln") +
      title(`α = ${v.a}°`) +
      (v.a > 0 ? path(sectorPath(cx, cy, 46, 0, v.a), "lab-fill-a") : "") +
      line(cx, cy, cx + 130, cy, "lab-ink") +
      line(cx, cy, tip.x, tip.y, "lab-ink") +
      circle(cx, cy, 3, "lab-dot-small") +
      text(cx - 18, cy + 20, "S", "lab-text") +
      handle("a", tip.x, tip.y, "Schenkel drehen") +
      "</svg>"
    );
  },
  handles: {
    a: {
      x: "a",
      drag: (p, v) => {
        const deg = degrees(p, 260, 175);
        return { a: deg < 2.5 && v.a > 350 ? 360 : deg };
      },
    },
  },
};

const anglePairs: LabView = {
  render(v) {
    const cx = 260;
    const cy = 170;
    const tip = polar(cx, cy, 150, v.a);
    const back = polar(cx, cy, -150, v.a);
    const label = (mid: number, content: string, cls: string) => {
      const at = polar(cx, cy, 58, mid);
      return text(at.x, at.y + 4, content, cls, "middle");
    };
    const b = 180 - v.a;
    return (
      open("Zwei sich schneidende Geraden mit vier Winkeln") +
      title(`α = γ = ${v.a}° und β = δ = ${b}°`) +
      line(90, cy, 430, cy, "lab-ink") +
      line(back.x, back.y, tip.x, tip.y, "lab-ink") +
      path(arcPath(cx, cy, 34, 0, v.a), "lab-angle-ok") +
      path(arcPath(cx, cy, 34, 180, 180 + v.a), "lab-angle-ok") +
      path(arcPath(cx, cy, 28, v.a, 180), "lab-angle") +
      path(arcPath(cx, cy, 28, 180 + v.a, 360), "lab-angle") +
      label(v.a / 2, "α", "lab-text-ok") +
      label(180 + v.a / 2, "γ", "lab-text-ok") +
      label(v.a + b / 2, "β", "lab-text") +
      label(180 + v.a + b / 2, "δ", "lab-text") +
      handle("a", tip.x, tip.y, "Gerade drehen") +
      "</svg>"
    );
  },
  handles: { a: { x: "a", drag: (p) => ({ a: Math.min(175, Math.max(5, degrees(p, 260, 170))) }) } },
};

interface Wire {
  corners: Pt[];
  edges: Array<[number, number, boolean?]>;
}
const CUBE: Wire = {
  corners: [
    { x: 150, y: 250 }, { x: 290, y: 250 }, { x: 290, y: 110 }, { x: 150, y: 110 },
    { x: 220, y: 200 }, { x: 360, y: 200 }, { x: 360, y: 60 }, { x: 220, y: 60 },
  ],
  edges: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 5], [5, 6], [2, 6], [3, 7], [6, 7], [0, 4, true], [4, 5, true], [4, 7, true]],
};
const BOX: Wire = {
  corners: [
    { x: 100, y: 250 }, { x: 330, y: 250 }, { x: 330, y: 140 }, { x: 100, y: 140 },
    { x: 170, y: 200 }, { x: 400, y: 200 }, { x: 400, y: 90 }, { x: 170, y: 90 },
  ],
  edges: CUBE.edges,
};
const PRISM: Wire = {
  corners: [
    { x: 110, y: 250 }, { x: 330, y: 250 }, { x: 220, y: 120 },
    { x: 200, y: 195 }, { x: 420, y: 195 }, { x: 310, y: 65 },
  ],
  edges: [[0, 1], [1, 2], [2, 0], [1, 4], [4, 5], [2, 5], [0, 3, true], [3, 4, true], [3, 5, true]],
};
const PYRAMID: Wire = {
  corners: [
    { x: 120, y: 250 }, { x: 330, y: 250 }, { x: 400, y: 195 }, { x: 190, y: 195 }, { x: 260, y: 60 },
  ],
  edges: [[0, 1], [1, 2], [0, 4], [1, 4], [2, 4], [2, 3, true], [3, 0, true], [3, 4, true]],
};
const solids: LabView = {
  render(v) {
    const body = SOLIDS[v.body];
    let out = open(`Körper: ${body.name}`) + title(body.name);
    const wire = [CUBE, BOX, PRISM, PYRAMID][v.body];
    if (wire) {
      for (const [a, b, hidden] of wire.edges) {
        const p = wire.corners[a];
        const q = wire.corners[b];
        out += line(p.x, p.y, q.x, q.y, hidden ? "lab-dashed" : v.show === 1 ? "lab-side-a" : "lab-ink");
      }
      if (v.show === 0) for (const p of wire.corners) out += circle(p.x, p.y, 6, "lab-point-b");
    } else if (v.body === 4) {
      out +=
        `<ellipse cx="260" cy="90" rx="90" ry="26" class="${v.show === 1 ? "lab-side-a" : "lab-ink"}" />` +
        line(170, 90, 170, 240, "lab-ink") +
        line(350, 90, 350, 240, "lab-ink") +
        path(arcPath(260, 240, 90, 180, 360).replace(/A90 90/, "A90 26"), v.show === 1 ? "lab-side-a" : "lab-ink") +
        path(arcPath(260, 240, 90, 0, 180).replace(/A90 90/, "A90 26"), "lab-dashed");
    } else if (v.body === 5) {
      out +=
        line(170, 240, 260, 60, "lab-ink") +
        line(350, 240, 260, 60, "lab-ink") +
        path(arcPath(260, 240, 90, 180, 360).replace(/A90 90/, "A90 26"), v.show === 1 ? "lab-side-a" : "lab-ink") +
        path(arcPath(260, 240, 90, 0, 180).replace(/A90 90/, "A90 26"), "lab-dashed") +
        (v.show === 0 ? circle(260, 60, 6, "lab-point-ok") : "");
    } else {
      out +=
        circle(260, 160, 100, "lab-fill-a") +
        `<ellipse cx="260" cy="160" rx="100" ry="24" class="lab-dashed" />`;
    }
    return out + text(260, 300, body.form, "lab-text", "middle") + "</svg>";
  },
};

const boxNet: LabView = {
  render(v) {
    const scale = Math.min(440 / (2 * (v.a + v.c)), 225 / (v.b + 2 * v.c));
    const left = 260 - scale * (v.a + v.c);
    const top = 34;
    const cell = (x: number, y: number, w: number, h: number, cls: string, label: string) =>
      rect(left + x * scale, top + y * scale, w * scale, h * scale, cls) +
      text(left + (x + w / 2) * scale, top + (y + h / 2) * scale + 4, label, "lab-text-tick", "middle");
    return (
      open("Netz eines Quaders") +
      cell(v.c, 0, v.a, v.c, "lab-fill-a", `${v.a} · ${v.c}`) +
      cell(0, v.c, v.c, v.b, "lab-fill-c", `${v.c} · ${v.b}`) +
      cell(v.c, v.c, v.a, v.b, "lab-fill-b", `${v.a} · ${v.b}`) +
      cell(v.c + v.a, v.c, v.c, v.b, "lab-fill-c", `${v.c} · ${v.b}`) +
      cell(2 * v.c + v.a, v.c, v.a, v.b, "lab-fill-b", `${v.a} · ${v.b}`) +
      cell(v.c, v.c + v.b, v.a, v.c, "lab-fill-a", `${v.a} · ${v.c}`) +
      rail("a", "Länge a", v.a, 1, 5, 300) +
      "</svg>"
    );
  },
  handles: { a: railHandle("a", 1, 5) },
};

const OB_X = 80;
const OB_Y = 292;
const OB_S = 28;
const oblique: LabView = {
  render(v) {
    const dx = (v.c / 2) * OB_S * Math.SQRT1_2;
    const w = v.a * OB_S;
    const h = v.b * OB_S;
    const p = (x: number, y: number): Pt => ({ x: OB_X + x, y: OB_Y - y });
    const edge = (a: Pt, b: Pt, cls: string) => line(a.x, a.y, b.x, b.y, cls);
    const [f0, f1, f2, f3] = [p(0, 0), p(w, 0), p(w, h), p(0, h)];
    const [b0, b1, b2, b3] = [p(dx, dx), p(w + dx, dx), p(w + dx, h + dx), p(dx, h + dx)];
    return (
      open("Schrägbild eines Quaders") +
      text(500, 30, `a = ${v.a} cm, b = ${v.b} cm, c = ${v.c} cm`, "lab-text", "end") +
      text(500, 52, `Tiefe gezeichnet: ${fmt(v.c / 2, 1)} cm unter 45°`, "lab-text-b", "end") +
      edge(f0, b0, "lab-dashed") +
      edge(b0, b1, "lab-dashed") +
      edge(b0, b3, "lab-dashed") +
      polygon([f0, f1, f2, f3], "lab-fill-a") +
      edge(f1, b1, "lab-ink") +
      edge(b1, b2, "lab-ink") +
      edge(f2, b2, "lab-ink") +
      edge(f3, b3, "lab-ink") +
      edge(b3, b2, "lab-ink") +
      handle("corner", f2.x, f2.y, "Breite und Höhe ziehen") +
      "</svg>"
    );
  },
  handles: {
    corner: {
      x: "a",
      y: "b",
      drag: (p) => ({ a: (p.x - OB_X) / OB_S, b: (OB_Y - p.y) / OB_S }),
    },
  },
};

const cubeNet: LabView = {
  render(v) {
    const pattern = NET_PATTERNS[v.pattern];
    const other = oppositeFace(pattern, v.face);
    const cols = Math.max(...pattern.cells.map(([x]) => x)) + 1;
    const rows = Math.max(...pattern.cells.map(([, y]) => y)) + 1;
    const s = Math.min(64, 440 / cols);
    const left = 260 - (cols * s) / 2;
    const top = 60 + (4 - rows) * 20;
    let out = open("Sechs Quadrate als mögliches Würfelnetz") + title(other === null ? "Dieses Muster ergibt keinen Würfel" : `Fläche ${v.face} liegt ${other} gegenüber`);
    pattern.cells.forEach(([x, y], i) => {
      const face = i + 1;
      const cls = face === v.face ? "lab-fill-a" : face === other ? "lab-fill-ok" : "lab-cell";
      out +=
        rect(left + x * s, top + y * s, s, s, cls) +
        text(left + (x + 0.5) * s, top + (y + 0.5) * s + 6, String(face), "lab-text-big", "middle");
    });
    return out + "</svg>";
  },
};

export const GEOMETRIE_VIEWS: Record<string, LabView> = {
  "line-kinds": lineKinds,
  "line-relations": lineRelations,
  "circle-parts": circleParts,
  "triangle-types": triangleTypes,
  "quad-types": quadTypes,
  coords,
  angle,
  "angle-pairs": anglePairs,
  solids,
  "box-net": boxNet,
  oblique,
  "cube-net": cubeNet,
};
