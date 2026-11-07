import { fmt } from "../exercises/format";
import { NET_PATTERNS, oppositeFace } from "../models";
import {
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
  coords,
  angle,
  "box-net": boxNet,
  "cube-net": cubeNet,
};
