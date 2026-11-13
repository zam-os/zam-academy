import { fmt } from "../exercises/format";
import type { LabValues, ReadoutValues } from "../model/types";
import {
  angleMark,
  circle,
  clamp,
  handle,
  infoBox,
  line,
  num,
  open,
  path,
  Plot,
  polar,
  polygon,
  rect,
  sideLabel,
  text,
  W,
  type LabView,
  type Pt,
} from "./svg";
import { title } from "./view-helpers";

const RAD = Math.PI / 180;
const toDeg = (rad: number) => rad / RAD;

/** The pointer's angle around (cx, cy) in [0°; 360°), taken in the turn closest to `current`. */
function turnAngle(p: Pt, cx: number, cy: number, current: number): number {
  let angle = toDeg(Math.atan2(cy - p.y, p.x - cx));
  if (angle < 0) angle += 360;
  let best = angle;
  for (const candidate of [angle - 360, angle + 360, angle + 720]) {
    if (Math.abs(candidate - current) < Math.abs(best - current)) best = candidate;
  }
  return best;
}

// ─── 4.1 Seitenverhältnisse im rechtwinkligen Dreieck ────────────────────

const RATIO = { ax: 40, base: 300, scale: 32 };

function ratioPoints(alpha: number, c: number, share = 1) {
  const k = RATIO.scale * share;
  const A: Pt = { x: RATIO.ax, y: RATIO.base };
  const C: Pt = { x: RATIO.ax + c * Math.cos(alpha * RAD) * k, y: RATIO.base };
  const B: Pt = { x: C.x, y: RATIO.base - c * Math.sin(alpha * RAD) * k };
  return { A, B, C };
}

const trigRatios: LabView = {
  render(v) {
    const { A, B, C } = ratioPoints(v.alpha, v.c);
    const gk = v.c * Math.sin(v.alpha * RAD);
    const ak = v.c * Math.cos(v.alpha * RAD);
    let out =
      open(`Rechtwinkliges Dreieck mit α = ${v.alpha}° und Hypotenuse ${fmt(v.c, 1)} cm`) +
      title("Ähnliche rechtwinklige Dreiecke: gleiche Verhältnisse");
    // Smaller similar triangles with the same angle α.
    for (const share of [0.4, 0.7]) {
      const t = ratioPoints(v.alpha, v.c, share);
      out += polygon([t.A, t.C, t.B], "lab-ghost");
    }
    out += polygon([A, C, B], "lab-shape");
    out += line(A.x, A.y, C.x, C.y, "lab-side-b") + line(C.x, C.y, B.x, B.y, "lab-side-a") + line(A.x, A.y, B.x, B.y, "lab-side-c");
    out += angleMark(A, C, B, 30, "lab-angle");
    if (v.alpha < 88) out += angleMark(C, A, B, 12, "lab-angle", true);
    out += text(A.x + 34, A.y - 6, `α = ${v.alpha}°`, "lab-text-small");
    out += text((A.x + C.x) / 2, RATIO.base + 18, `Ankathete ${fmt(ak, 2)} cm`, "lab-text-b", "middle");
    out += text(C.x + 8, (C.y + B.y) / 2, "Gegen-", "lab-text-a");
    out += text(C.x + 8, (C.y + B.y) / 2 + 16, `kathete ${fmt(gk, 2)}`, "lab-text-a");
    out += sideLabel(A, B, `H = ${fmt(v.c, 1)} cm`, -16, "lab-text-c");
    out += infoBox(354, 70, [
      ["sin α = GK : H", "lab-text-a"],
      [`= ${fmt(Math.sin(v.alpha * RAD), 3)}`, "lab-text-small"],
      ["cos α = AK : H", "lab-text-b"],
      [`= ${fmt(Math.cos(v.alpha * RAD), 3)}`, "lab-text-small"],
      ["tan α = GK : AK", "lab-text-c"],
      [v.alpha < 90 ? `= ${fmt(Math.tan(v.alpha * RAD), 3)}` : "nicht definiert", "lab-text-small"],
    ]);
    out += text(W - 14, 300, "Gestrichelt: kleinere", "lab-text-small", "end");
    out += text(W - 14, 316, "Dreiecke, gleicher Winkel", "lab-text-small", "end");
    return out + handle("B", B.x, B.y, "Ecke B: Winkel α und Hypotenuse") + "</svg>";
  },
  handles: {
    B: {
      x: "c",
      y: "alpha",
      drag: (p) => {
        const dx = p.x - RATIO.ax;
        const dy = RATIO.base - p.y;
        return { alpha: toDeg(Math.atan2(Math.max(dy, 0), Math.max(dx, 0.001))), c: Math.hypot(dx, dy) / RATIO.scale };
      },
    },
  },
};

// ─── 4.2 Leiter: Sinus und Kosinus (aus Mathematik 9 Realschule) ─────────

const LADDER = { ground: 312, wall: 430, scale: 34 };

function ladderPoints(v: LabValues) {
  const k = LADDER.scale;
  const gk = v.L * Math.sin(v.alpha * RAD);
  const ak = v.L * Math.cos(v.alpha * RAD);
  const foot: Pt = { x: LADDER.wall - ak * k, y: LADDER.ground };
  const top: Pt = { x: LADDER.wall, y: LADDER.ground - gk * k };
  return { gk, ak, foot, top };
}

function ladder(v: LabValues): string {
  const { gk, ak, foot, top } = ladderPoints(v);
  const corner: Pt = { x: LADDER.wall, y: LADDER.ground };
  const safe = v.alpha >= 65 && v.alpha <= 75;
  let out = open("Eine Leiter lehnt an einer Wand und bildet ein rechtwinkliges Dreieck");
  out += rect(LADDER.wall, 20, 40, LADDER.ground - 20, "lab-shape-2");
  out += line(20, LADDER.ground, W - 10, LADDER.ground, "lab-ink");
  const s0 = polar(foot.x, foot.y, 110, 65);
  const s1 = polar(foot.x, foot.y, 110, 75);
  out += path(`M${foot.x} ${foot.y} L${s0.x} ${s0.y} A110 110 0 0 0 ${s1.x} ${s1.y} Z`, "lab-fill-ok");
  out += polygon([foot, corner, top], "lab-fill-c");
  out += line(foot.x, foot.y, corner.x, corner.y, "lab-side-b");
  out += line(corner.x, corner.y, top.x, top.y, "lab-side-a");
  // the ladder: two rails and rungs
  const dx = top.x - foot.x;
  const dy = top.y - foot.y;
  const len = Math.hypot(dx, dy);
  const nx = (-dy / len) * 5;
  const ny = (dx / len) * 5;
  out += line(foot.x + nx, foot.y + ny, top.x + nx, top.y + ny, "lab-ink") + line(foot.x - nx, foot.y - ny, top.x - nx, top.y - ny, "lab-ink");
  const rungs = Math.max(2, Math.round(v.L * 3));
  for (let i = 1; i < rungs; i++) {
    const t = i / rungs;
    out += line(foot.x + dx * t + nx, foot.y + dy * t + ny, foot.x + dx * t - nx, foot.y + dy * t - ny, "lab-thin");
  }
  out += angleMark(foot, corner, top, 34, safe ? "lab-angle-ok" : "lab-angle");
  out += angleMark(corner, foot, top, 14, "lab-angle", true);
  out += text(foot.x + 40, foot.y - 8, `α = ${v.alpha}°`, safe ? "lab-text lab-text-ok" : "lab-text");
  out += text((foot.x + corner.x) / 2, LADDER.ground + 18, `Ankathete ${fmt(ak, 2)} m`, "lab-text lab-text-b", "middle");
  out += text(LADDER.wall + 20, (corner.y + top.y) / 2 - 6, "GK", "lab-text lab-text-a", "middle");
  out += text(LADDER.wall + 20, (corner.y + top.y) / 2 + 10, `${fmt(gk, 2)} m`, "lab-text-small", "middle");
  out += text(16, 24, `sin α = ${fmt(gk, 2)} : ${fmt(v.L, 1)} = ${fmt(gk / v.L, 3)}`, "lab-text lab-text-big");
  out += text(16, 46, `cos α = ${fmt(ak, 2)} : ${fmt(v.L, 1)} = ${fmt(ak / v.L, 3)}`, "lab-text lab-text-big");
  out += text(16, 66, `Leiter (Hypotenuse): ${fmt(v.L, 1)} m · grüner Bereich: 65° bis 75°`, "lab-text-muted");
  out += handle("top", top.x, top.y, "Oberes Leiterende an der Wand");
  out += handle("foot", foot.x, foot.y, "Leiterfuß am Boden");
  return out + "</svg>";
}

// ─── 4.3 Steigung: tan α und Prozent (aus Mathematik 9 Realschule) ───────

function slopeGeometry(v: LabValues) {
  const ratio = v.h / v.run;
  let w = 240;
  let hgt = w * ratio;
  if (hgt > 250) {
    w *= 250 / hgt;
    hgt = 250;
  }
  const start: Pt = { x: 60, y: 300 };
  const end: Pt = { x: start.x + w, y: start.y - hgt };
  return { ratio, start, end, corner: { x: end.x, y: start.y } };
}

function slope(v: LabValues, r: ReadoutValues): string {
  const { start, end, corner } = slopeGeometry(v);
  const alpha = num(r, "alpha");
  let out = open("Eine ansteigende Straße mit Steigungsdreieck und Verkehrsschild");
  out += polygon([start, corner, end], "lab-fill-c");
  out += line(start.x, start.y, corner.x, corner.y, "lab-side-b") + line(corner.x, corner.y, end.x, end.y, "lab-side-a");
  out += line(start.x, start.y, end.x, end.y, "lab-ink");
  out += line(20, start.y, start.x, start.y, "lab-ink") + line(end.x, end.y, end.x + 60, end.y, "lab-ink");
  if (v.h > 0) {
    out += angleMark(start, corner, end, 40, "lab-angle");
    out += angleMark(corner, start, end, 12, "lab-angle", true);
  }
  out += text(start.x + 46, start.y - 6, `α = ${fmt(alpha, 2)}°`, "lab-text");
  out += text((start.x + corner.x) / 2, start.y + 18, `waagrecht ${fmt(v.run, 0)} m`, "lab-text lab-text-b", "middle");
  out += text(corner.x + 8, (corner.y + end.y) / 2 + 4, `${fmt(v.h, 0)} m hoch`, "lab-text lab-text-a");
  // traffic sign
  const sx = 420;
  const sy = 36;
  out += polygon([{ x: sx, y: sy }, { x: sx + 56, y: sy + 96 }, { x: sx - 56, y: sy + 96 }], "lab-sign");
  out += polygon([{ x: sx, y: sy + 16 }, { x: sx + 42, y: sy + 88 }, { x: sx - 42, y: sy + 88 }], "lab-sign-inner");
  const ramp = Math.min(26, 60 * (v.h / v.run));
  out += polygon([{ x: sx - 30, y: sy + 82 }, { x: sx + 30, y: sy + 82 }, { x: sx + 30, y: sy + 82 - ramp }], "lab-sign-ramp");
  out += line(sx, sy + 99, sx, sy + 116, "lab-ink");
  out += rect(sx - 44, sy + 116, 88, 30, "lab-sign-plate");
  out += text(sx, sy + 137, `${fmt(num(r, "percent"), 1)} %`, "lab-sign-text", "middle");
  out += line(sx, sy + 146, sx, sy + 190, "lab-ink");
  out += text(16, 24, `tan α = ${fmt(v.h, 0)} : ${fmt(v.run, 0)} = ${fmt(v.h / v.run, 4)}`, "lab-text lab-text-big");
  out += text(16, 44, `Steigung ${fmt(num(r, "percent"), 1)} %: ${fmt(num(r, "percent"), 1)} m hoch auf 100 m waagrecht`, "lab-text-muted");
  out += handle("top", end.x, end.y, "Oberes Ende der Straße");
  return out + "</svg>";
}

// ─── 4.4 Einheitskreis ────────────────────────────────────────────────────

const UC = { cx: 150, cy: 178, r: 125 };

/** The quadrant of α (1 to 4), or 0 on an axis. */
export function quadrant(alpha: number): number {
  const a = ((alpha % 360) + 360) % 360;
  if (a % 90 === 0) return 0;
  return Math.floor(a / 90) + 1;
}

const unitCircle: LabView = {
  render(v) {
    const { cx, cy, r } = UC;
    const s = Math.sin(v.alpha * RAD);
    const c = Math.cos(v.alpha * RAD);
    const P = polar(cx, cy, r, v.alpha);
    const F: Pt = { x: P.x, y: cy };
    let out =
      open(`Einheitskreis: α = ${v.alpha}°, P(${fmt(c, 3)} | ${fmt(s, 3)})`) +
      title(`α = ${v.alpha}°: P(cos α | sin α) = (${fmt(c, 3)} | ${fmt(s, 3)})`);
    out += line(cx - r - 18, cy, cx + r + 18, cy, "lab-axis") + line(cx, cy + r + 18, cx, cy - r - 18, "lab-axis");
    out += circle(cx, cy, r, "lab-ghost");
    for (const [x, y, label] of [
      [cx + r, cy + 16, "1"],
      [cx - r, cy + 16, "−1"],
      [cx - 8, cy - r + 4, "1"],
      [cx - 8, cy + r + 4, "−1"],
    ] as const) {
      out += text(x, y, label, "lab-text-tick", "end");
    }
    if (v.alpha > 0) out += path(sectorArc(cx, cy, 26, v.alpha), "lab-angle");
    out += line(cx, cy, P.x, P.y, "lab-side-c");
    out += line(cx, cy, F.x, F.y, "lab-side-b") + line(F.x, F.y, P.x, P.y, "lab-side-a");
    out += circle(P.x, P.y, 5, "lab-point");
    out += text(cx + 30, cy - 8, `${v.alpha}°`, "lab-text-small");
    const q = quadrant(v.alpha);
    out += infoBox(320, 70, [
      [`cos α = ${fmt(c, 3)}`, "lab-text-b"],
      [`sin α = ${fmt(s, 3)}`, "lab-text-a"],
      [q === 0 ? "P liegt auf einer Achse" : `${q}. Quadrant`, "lab-text-small"],
      [`sin α ${s > 1e-9 ? "positiv" : s < -1e-9 ? "negativ" : "null"}, cos α ${c > 1e-9 ? "positiv" : c < -1e-9 ? "negativ" : "null"}`, "lab-text-small"],
    ]);
    out += infoBox(320, 196, [
      ["Wertebereich", "lab-text-c"],
      ["−1 ≤ sin α ≤ 1", "lab-text-small"],
      ["−1 ≤ cos α ≤ 1", "lab-text-small"],
    ]);
    return out + handle("P", P.x, P.y, "Punkt P auf dem Einheitskreis") + "</svg>";
  },
  handles: {
    P: { y: "alpha", drag: (p, v) => ({ alpha: clamp(turnAngle(p, UC.cx, UC.cy, v.alpha), 0, 360) }) },
  },
};

/** An arc from 0° to `alpha` (up to 720°, drawn once round at most). */
function sectorArc(cx: number, cy: number, r: number, alpha: number): string {
  const a = Math.min(alpha, 359.9);
  const p0 = polar(cx, cy, r, 0);
  const p1 = polar(cx, cy, r, a);
  return `M${p0.x.toFixed(1)} ${p0.y.toFixed(1)} A${r} ${r} 0 ${a > 180 ? 1 : 0} 0 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
}

// ─── 4.5 Sinusfunktion: periodische Vorgänge ──────────────────────────────

const WAVE = { cx: 78, cy: 176, r: 60 };
const wavePlot = new Plot(0, 720, -1.2, 1.2, { x: 160, y: WAVE.cy - 72, w: 340, h: 144 });

const sineWave: LabView = {
  render(v) {
    const { cx, cy, r } = WAVE;
    const plot = wavePlot;
    const s = Math.sin(v.alpha * RAD);
    const P = polar(cx, cy, r, v.alpha);
    const Q = plot.P(v.alpha, s);
    let out =
      open(`Sinusfunktion: sin ${v.alpha}° = ${fmt(s, 3)}`) +
      title(`y = sin α: bei α = ${v.alpha}° ist y = ${fmt(s, 3)}`);
    out += circle(cx, cy, r, "lab-ghost");
    out += line(cx - r - 10, cy, cx + r + 10, cy, "lab-axis") + line(cx, cy - r - 10, cx, cy + r + 10, "lab-axis");
    out += line(cx, cy, P.x, P.y, "lab-side-c") + line(P.x, cy, P.x, P.y, "lab-side-a");
    out += rect(plot.box.x, plot.box.y, plot.box.w, plot.box.h, "lab-plot-bg");
    for (let a = 0; a <= 720; a += 90) {
      out += line(plot.X(a), plot.box.y, plot.X(a), plot.box.y + plot.box.h, "lab-grid");
      out += text(plot.X(a), plot.box.y + plot.box.h + 16, `${a}°`, "lab-text-tick", "middle");
    }
    for (const y of [-1, 1]) {
      out += line(plot.box.x, plot.Y(y), plot.box.x + plot.box.w, plot.Y(y), "lab-grid");
      out += text(plot.box.x - 4, plot.Y(y) + 4, y > 0 ? "1" : "−1", "lab-text-tick", "end");
    }
    out += line(plot.box.x, plot.Y(0), plot.box.x + plot.box.w, plot.Y(0), "lab-axis");
    out += plot.graph((a) => Math.sin(a * RAD), "lab-curve", 240);
    // one period marked under the graph
    out += line(plot.X(0), plot.box.y + plot.box.h + 30, plot.X(360), plot.box.y + plot.box.h + 30, "lab-side-ok");
    out += text(plot.X(180), plot.box.y + plot.box.h + 46, "eine Periode: 360°", "lab-text-ok", "middle");
    out += line(P.x, P.y, Q.x, Q.y, "lab-dashed");
    out += line(Q.x, plot.Y(0), Q.x, Q.y, "lab-side-a");
    out += circle(P.x, P.y, 5, "lab-point") + circle(Q.x, Q.y, 5, "lab-point-a");
    out += text(16, 318, "Die Höhe des Punkts auf dem Kreis (Radius 1) ist sin α.", "lab-text-small");
    out += text(16, 334, "Nach jeder vollen Umdrehung wiederholt sich alles.", "lab-text-small");
    out += handle("P", P.x, P.y, "Punkt auf dem Kreis");
    out += handle("Q", Q.x, Q.y, "Punkt auf dem Graphen");
    return out + "</svg>";
  },
  handles: {
    P: { y: "alpha", drag: (p, v) => ({ alpha: clamp(turnAngle(p, WAVE.cx, WAVE.cy, v.alpha), 0, 720) }) },
    Q: { x: "alpha", drag: (p) => ({ alpha: wavePlot.invX(p.x) }) },
  },
};

export const TRIGONOMETRIE_VIEWS: Record<string, LabView> = {
  "trig-ratios": trigRatios,
  ladder: {
    render: ladder,
    handles: {
      top: {
        y: "alpha",
        drag: (p, v) => ({ alpha: toDeg(Math.asin(clamp((LADDER.ground - p.y) / (v.L * LADDER.scale), 0, 1))) }),
      },
      foot: {
        x: "alpha",
        drag: (p, v) => ({ alpha: toDeg(Math.acos(clamp((LADDER.wall - p.x) / (v.L * LADDER.scale), 0, 1))) }),
      },
    },
  },
  slope: {
    render: slope,
    handles: {
      top: {
        y: "h",
        drag: (p, v) => {
          const { start } = slopeGeometry(v);
          const angle = Math.atan2(Math.max(start.y - p.y, 0), Math.max(p.x - start.x, 1));
          return { h: v.run * Math.tan(Math.min(angle, 1.37)) };
        },
      },
    },
  },
  "unit-circle": unitCircle,
  "sine-wave": sineWave,
};
