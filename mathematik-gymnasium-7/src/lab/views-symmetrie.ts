import { fmt, MINUS } from "../exercises/format";
import { angleDeg, dist2D, midpoint, polygonAngleSum } from "../curriculum/math";
import {
  angleMark,
  circle,
  handle,
  infoBox,
  line,
  open,
  path,
  Plot,
  polar,
  polygon,
  sectorPath,
  text,
  type LabView,
} from "./svg";
import { rail, railHandle, title } from "./view-helpers";

const SYM_PLOT = new Plot(-5, 5, -3.5, 4.5, { x: 24, y: 38, w: 300, h: 256 });

const axisSym: LabView = {
  render(v) {
    const ax = v.ax;
    const p = { x: -3, y: 2 };
    const q = { x: v.qx, y: v.qy };
    const target = { x: 2 * ax - p.x, y: p.y };
    const mid = midpoint(p, q);
    const sameY = Math.abs(p.y - q.y) < 1e-6;
    const midOnAxis = Math.abs(mid.x - ax) < 1e-6;
    const isMirror = sameY && midOnAxis && Math.abs(q.x - p.x) > 1e-6;

    let out = open("Achsenspiegelung: Symmetrieachse, Punkt P und Testpunkt Q");
    out += title(`Achsenspiegelung an x = ${fmt(ax, 0)} (P(${fmt(p.x, 0)}|${fmt(p.y, 0)}))`);
    out += SYM_PLOT.grid(1, 2);

    // Axis line
    out += line(SYM_PLOT.X(ax), SYM_PLOT.box.y, SYM_PLOT.X(ax), SYM_PLOT.box.y + SYM_PLOT.box.h, "lab-side-b");
    out += text(SYM_PLOT.X(ax) + 6, SYM_PLOT.box.y + 22, "a", "lab-text-b");

    // Connecting segment [PQ]
    const P = SYM_PLOT.P(p.x, p.y);
    const Q = SYM_PLOT.P(q.x, q.y);
    const M = SYM_PLOT.P(mid.x, mid.y);
    out += line(P.x, P.y, Q.x, Q.y, isMirror ? "lab-side-ok" : "lab-dashed");

    // Subtle ghost hint at axis crossing if perpendicular
    if (isMirror) {
      out += angleMark(
        SYM_PLOT.P(ax, p.y),
        P,
        SYM_PLOT.P(ax, p.y + 1),
        12,
        "lab-angle-ok",
        true,
      );
    }

    out += circle(P.x, P.y, 5, "lab-point-a");
    out += text(P.x - 10, P.y - 8, "P", "lab-text-a", "end");
    out += circle(M.x, M.y, 3.5, midOnAxis ? "lab-point-ok" : "lab-point");
    out += handle("q", Q.x, Q.y, "Testpunkt Q");
    out += text(Q.x + 12, Q.y - 8, "Q", "lab-text-b");

    const dPa = Math.abs(p.x - ax);
    const dQa = Math.abs(q.x - ax);
    out += infoBox(498, 64, [
      [`Q(${fmt(q.x, 1)}|${fmt(q.y, 1)})`, "lab-text-b"],
      [`Abstand zu a: ${fmt(dPa, 1)} vs. ${fmt(dQa, 1)}`, "lab-text-small"],
      [`Senkrecht zu a: ${sameY ? "ja" : "nein"}`, sameY ? "lab-text-ok" : "lab-text-bad"],
      [isMirror ? `✓ Q = P' (${fmt(target.x, 0)}|${fmt(target.y, 0)})` : "Verschiebe Q zu P'", isMirror ? "lab-text-ok" : "lab-text-small"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    q: {
      x: "qx",
      y: "qy",
      drag: (pt) => ({ qx: SYM_PLOT.invX(pt.x), qy: SYM_PLOT.invY(pt.y) }),
    },
  },
};

const pointSym: LabView = {
  render(v) {
    const p = { x: -3, y: 2 };
    const z = { x: v.zx, y: 0 };
    const q = { x: v.qx, y: v.qy };
    const mid = midpoint(p, q);
    const isMirror = dist2D(mid, z) < 0.05 && dist2D(p, q) > 0.2;

    let out = open("Punktspiegelung am Zentrum Z");
    out += title(`Punktspiegelung an Z(${fmt(z.x, 0)}|0)`);
    out += SYM_PLOT.grid(1, 2);

    const P = SYM_PLOT.P(p.x, p.y);
    const Z = SYM_PLOT.P(z.x, z.y);
    const Q = SYM_PLOT.P(q.x, q.y);
    const M = SYM_PLOT.P(mid.x, mid.y);

    // Auxiliary triangle around P to illustrate 180° flip
    const p2 = { x: p.x + 1.5, y: p.y - 2 };
    const p3 = { x: p.x - 0.5, y: p.y - 2.5 };
    out += polygon([P, SYM_PLOT.P(p2.x, p2.y), SYM_PLOT.P(p3.x, p3.y)], "lab-fill-a lab-side-a");

    // Mirrored ghost triangle at true image
    const tp1 = { x: 2 * z.x - p.x, y: 2 * z.y - p.y };
    const tp2 = { x: 2 * z.x - p2.x, y: 2 * z.y - p2.y };
    const tp3 = { x: 2 * z.x - p3.x, y: 2 * z.y - p3.y };
    if (isMirror) {
      out += polygon([SYM_PLOT.P(tp1.x, tp1.y), SYM_PLOT.P(tp2.x, tp2.y), SYM_PLOT.P(tp3.x, tp3.y)], "lab-fill-ok lab-side-ok");
    }

    out += line(P.x, P.y, Q.x, Q.y, isMirror ? "lab-side-ok" : "lab-dashed");
    out += circle(Z.x, Z.y, 5.5, "lab-point-b");
    out += text(Z.x + 8, Z.y + 14, "Z", "lab-text-b");
    out += circle(P.x, P.y, 4.5, "lab-point-a");
    out += text(P.x - 8, P.y - 8, "P", "lab-text-a", "end");
    out += circle(M.x, M.y, 3.5, isMirror ? "lab-point-ok" : "lab-point");
    out += handle("q", Q.x, Q.y, "Bildpunkt Q");
    out += text(Q.x + 12, Q.y - 8, "Q", "lab-text-b");

    out += infoBox(498, 64, [
      [`P(${fmt(p.x, 0)}|${fmt(p.y, 0)}), Q(${fmt(q.x, 1)}|${fmt(q.y, 1)})`, "lab-text-small"],
      [`Mittelpunkt M(${fmt(mid.x, 1)}|${fmt(mid.y, 1)})`, "lab-text-small"],
      [`|PZ| = ${fmt(dist2D(p, z), 2)}, |ZQ| = ${fmt(dist2D(z, q), 2)}`, "lab-text-small"],
      [isMirror ? "✓ M = Z ⇒ Q = P'" : "Bringe M auf Z", isMirror ? "lab-text-ok" : "lab-text-bad"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    q: {
      x: "qx",
      y: "qy",
      drag: (pt) => ({ qx: SYM_PLOT.invX(pt.x), qy: SYM_PLOT.invY(pt.y) }),
    },
  },
};

const lociModel: LabView = {
  render(v) {
    const a = { x: -3, y: 0 };
    const b = { x: 3, y: 0 };
    const p = { x: v.px, y: v.py };
    const r = v.r;
    const dA = dist2D(p, a);
    const dB = dist2D(p, b);
    const onPerp = Math.abs(dA - dB) < 0.05;
    const onCircle = Math.abs(dA - r) < 0.15;

    let out = open("Ortslinien: Mittelsenkrechte und Kreis als Abstandsmodell");
    out += title("Standortsuche: d(P, A) = d(P, B) und Kreis k(A; r)");
    out += SYM_PLOT.grid(1, 2);

    const A = SYM_PLOT.P(a.x, a.y);
    const B = SYM_PLOT.P(b.x, b.y);
    const P = SYM_PLOT.P(p.x, p.y);
    const radPx = r * SYM_PLOT.sx;

    // Show circle k(A; r) and segment [AB]
    out += `<circle cx="${A.x.toFixed(1)}" cy="${A.y.toFixed(1)}" r="${radPx.toFixed(1)}" class="lab-curve-dashed" />`;
    out += line(A.x, A.y, B.x, B.y, "lab-axis");
    // Faint vertical reference along x = 0 when near it
    out += line(SYM_PLOT.X(0), SYM_PLOT.box.y, SYM_PLOT.X(0), SYM_PLOT.box.y + SYM_PLOT.box.h, onPerp ? "lab-side-ok" : "lab-grid");
    out += line(A.x, A.y, P.x, P.y, "lab-side-a");
    out += line(B.x, B.y, P.x, P.y, "lab-side-b");

    out += circle(A.x, A.y, 5, "lab-point-a");
    out += text(A.x - 6, A.y + 16, "A", "lab-text-a", "end");
    out += circle(B.x, B.y, 5, "lab-point-b");
    out += text(B.x + 8, B.y + 16, "B", "lab-text-b");
    out += handle("p", P.x, P.y, "Standort P");
    out += text(P.x + 12, P.y - 8, "P", "lab-text-ok");

    out += infoBox(498, 64, [
      [`d(P, A) = ${fmt(dA, 2)}`, "lab-text-a"],
      [`d(P, B) = ${fmt(dB, 2)}`, "lab-text-b"],
      [`Kreisradius r = ${fmt(r, 1)}`, "lab-text-small"],
      [onPerp && onCircle ? "✓ Schnittpunkt m ∩ k" : onPerp ? "✓ Auf Mittelsenkrechte" : onCircle ? "Auf Kreis k(A; r)" : "Ziehe P", onPerp ? "lab-text-ok" : "lab-text-small"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    p: {
      x: "px",
      y: "py",
      drag: (pt) => ({ px: SYM_PLOT.invX(pt.x), py: SYM_PLOT.invY(pt.y) }),
    },
  },
};

const LOT_PLOT = new Plot(0, 8, -1, 5, { x: 24, y: 38, w: 300, h: 256 });

const perpBisectAngle: LabView = {
  render(v) {
    const mode = v.mode;
    const f = { x: v.fx, y: v.fy };
    let out = open("Lot und Winkelhalbierende konstruieren");

    if (mode === 0) {
      // Drop perpendicular from P(4, 3.5) to line y = 0
      const p = { x: 4, y: 3.5 };
      out += title("Lot fällen: Von P(4|3,5) senkrecht auf g (y = 0)");
      out += LOT_PLOT.grid(1, 2);
      out += line(LOT_PLOT.X(0), LOT_PLOT.Y(0), LOT_PLOT.X(8), LOT_PLOT.Y(0), "lab-side-a");
      out += text(LOT_PLOT.X(7.5), LOT_PLOT.Y(0) + 16, "g", "lab-text-a");
      const P = LOT_PLOT.P(p.x, p.y);
      const F = LOT_PLOT.P(f.x, f.y);
      const isFoot = Math.abs(f.x - 4) < 0.05 && Math.abs(f.y) < 0.05;
      out += line(P.x, P.y, F.x, F.y, isFoot ? "lab-side-ok" : "lab-dashed");
      // Auxiliary compass intersection points on g
      out += circle(LOT_PLOT.X(1.5), LOT_PLOT.Y(0), 3.5, "lab-point-b");
      out += circle(LOT_PLOT.X(6.5), LOT_PLOT.Y(0), 3.5, "lab-point-b");
      if (isFoot) {
        out += angleMark(F, P, LOT_PLOT.P(7, 0), 14, "lab-angle-ok", true);
      }
      out += circle(P.x, P.y, 5, "lab-point-a");
      out += text(P.x + 8, P.y - 8, "P", "lab-text-a");
      out += handle("f", F.x, F.y, "Lotfußpunkt F");
      out += text(F.x + 10, F.y + 14, "F", "lab-text-b");
      const ang = angleDeg(f, p, { x: 8, y: 0 });
      out += infoBox(498, 64, [
        [`F(${fmt(f.x, 1)}|${fmt(f.y, 1)})`, "lab-text-b"],
        [`Winkel bei F: ${fmt(ang, 1)}°`, isFoot ? "lab-text-ok" : "lab-text-small"],
        [`|PF| = ${fmt(dist2D(p, f), 2)}`, "lab-text-small"],
        [isFoot ? "✓ Lotfußpunkt (90°)" : "Suche Lot auf g", isFoot ? "lab-text-ok" : "lab-text-bad"],
      ], "end");
    } else {
      // Angle bisector of 60° corner at S(1, 0): ray1 horizontal (y=0), ray2 at 60°
      const s = { x: 1, y: 0 };
      const r1End = { x: 7.5, y: 0 };
      const r2End = { x: 1 + 5.5 * Math.cos(Math.PI / 3), y: 5.5 * Math.sin(Math.PI / 3) };
      out += title("Winkelhalbierende: α = 60° am Scheitel S(1|0)");
      out += LOT_PLOT.grid(1, 2);
      const S = LOT_PLOT.P(s.x, s.y);
      const R1 = LOT_PLOT.P(r1End.x, r1End.y);
      const R2 = LOT_PLOT.P(r2End.x, r2End.y);
      const F = LOT_PLOT.P(f.x, f.y);
      out += line(S.x, S.y, R1.x, R1.y, "lab-side-a");
      out += line(S.x, S.y, R2.x, R2.y, "lab-side-a");
      const wAng = angleDeg(s, r1End, f);
      const onBisector = f.x > 1.3 && f.y > 0.1 && Math.abs(wAng - 30) < 1.2;
      out += line(S.x, S.y, F.x, F.y, onBisector ? "lab-side-ok" : "lab-side-b");
      const dRay1 = Math.abs(f.y);
      const dRay2 = Math.abs(
        Math.sin(Math.PI / 3) * (f.x - 1) - Math.cos(Math.PI / 3) * f.y,
      );
      out += circle(S.x, S.y, 4.5, "lab-point-a");
      out += text(S.x - 6, S.y + 16, "S", "lab-text-a", "end");
      out += handle("f", F.x, F.y, "Punkt F auf der Halbierenden");
      out += text(F.x + 10, F.y - 8, "F", "lab-text-b");
      out += infoBox(498, 64, [
        [`Winkel zu Schenkel 1: ${fmt(wAng, 1)}°`, onBisector ? "lab-text-ok" : "lab-text-b"],
        [`Abstand S1: ${fmt(dRay1, 2)}`, "lab-text-small"],
        [`Abstand S2: ${fmt(dRay2, 2)}`, "lab-text-small"],
        [onBisector ? "✓ Auf Winkelhalbierender (30°)" : "Stelle 30° ein", onBisector ? "lab-text-ok" : "lab-text-small"],
      ], "end");
    }
    return out + "</svg>";
  },
  handles: {
    f: {
      x: "fx",
      y: "fy",
      drag: (pt) => ({ fx: LOT_PLOT.invX(pt.x), fy: LOT_PLOT.invY(pt.y) }),
    },
  },
};

export const QUADS = [
  {
    name: "Achsensymmetrisches Trapez",
    axes: 1,
    pointSym: false,
    pts: (s: number) => [
      { x: 260 - 40 * s, y: 185 },
      { x: 260 + 40 * s, y: 185 },
      { x: 260 + 24 * s, y: 90 },
      { x: 260 - 24 * s, y: 90 },
    ],
    info: "1 Symmetrieachse (Mittellinie)",
  },
  {
    name: "Drachenviereck",
    axes: 1,
    pointSym: false,
    pts: (s: number) => [
      { x: 260, y: 65 },
      { x: 260 + 34 * s, y: 125 },
      { x: 260, y: 215 },
      { x: 260 - 34 * s, y: 125 },
    ],
    info: "1 Diagonale als Symmetrieachse",
  },
  {
    name: "Parallelogramm",
    axes: 0,
    pointSym: true,
    pts: (s: number) => [
      { x: 180, y: 195 },
      { x: 180 + 50 * s, y: 195 },
      { x: 225 + 50 * s, y: 90 },
      { x: 225, y: 90 },
    ],
    info: "0 Achsen · punktsymmetrisch am Schnittpunkt Z",
  },
  {
    name: "Raute",
    axes: 2,
    pointSym: true,
    pts: (s: number) => [
      { x: 260, y: 65 },
      { x: 260 + 38 * s, y: 140 },
      { x: 260, y: 215 },
      { x: 260 - 38 * s, y: 140 },
    ],
    info: "2 Diagonalen als Symmetrieachsen · punktsymmetrisch",
  },
  {
    name: "Rechteck",
    axes: 2,
    pointSym: true,
    pts: (s: number) => [
      { x: 260 - 44 * s, y: 190 },
      { x: 260 + 44 * s, y: 190 },
      { x: 260 + 44 * s, y: 85 },
      { x: 260 - 44 * s, y: 85 },
    ],
    info: "2 Mittelsenkrechten als Achsen · 4 rechte Winkel",
  },
  {
    name: "Quadrat",
    axes: 4,
    pointSym: true,
    pts: (s: number) => {
      const h = 32 * s;
      return [
        { x: 260 - h, y: 138 + h },
        { x: 260 + h, y: 138 + h },
        { x: 260 + h, y: 138 - h },
        { x: 260 - h, y: 138 - h },
      ];
    },
    info: "4 Symmetrieachsen · Rechteck + Raute zugleich",
  },
] as const;

const quadHouse: LabView = {
  render(v) {
    const idx = v.shape;
    const scale = v.scale;
    const q = QUADS[idx] ?? QUADS[0];
    const pts = q.pts(scale);
    let out = open("Haus der symmetrischen Vierecke");
    out += title(q.name);

    out += polygon([...pts], "lab-fill-a lab-side-a");
    // Draw diagonals & symmetry axes cleanly
    if (q.pointSym) {
      const cx = (pts[0].x + pts[2].x) / 2;
      const cy = (pts[0].y + pts[2].y) / 2;
      out += line(pts[0].x, pts[0].y, pts[2].x, pts[2].y, "lab-grid");
      out += line(pts[1].x, pts[1].y, pts[3].x, pts[3].y, "lab-grid");
      out += circle(cx, cy, 4.5, "lab-point-b");
      out += text(cx + 8, cy - 6, "Z", "lab-text-b");
    }
    if (idx === 0 || idx === 1 || idx === 3 || idx === 5) {
      out += line(260, 52, 260, 228, "lab-side-ok");
    }
    if (idx === 3 || idx === 5) {
      const cy = idx === 3 ? 140 : 138;
      out += line(145, cy, 375, cy, "lab-side-ok");
    }
    if (idx === 4) {
      out += line(260, 62, 260, 212, "lab-side-ok");
      out += line(145, 137.5, 375, 137.5, "lab-side-ok");
    }
    if (idx === 5) {
      out += line(pts[0].x, pts[0].y, pts[2].x, pts[2].y, "lab-side-ok");
      out += line(pts[1].x, pts[1].y, pts[3].x, pts[3].y, "lab-side-ok");
    }

    out += text(260, 248, q.info, "lab-text", "middle");
    out += rail("shape", "Vierecktyp (0..5)", idx, 0, 5, 298);
    return out + "</svg>";
  },
  handles: { shape: railHandle("shape", 0, 5) },
};

const lineCross: LabView = {
  render(v) {
    const alpha = v.alpha;
    const beta = 180 - alpha;
    const cx = 260;
    const cy = 140;
    let out = open("Geradenkreuzung mit Scheitelwinkel und Nebenwinkel");
    out += title(`α = ${fmt(alpha, 0)}° · Nebenwinkel β = ${fmt(beta, 0)}°`);

    // Sectors
    out += path(sectorPath(cx, cy, 46, 0, alpha), "lab-fill-a");
    out += path(sectorPath(cx, cy, 46, 180, 180 + alpha), "lab-fill-a");
    out += path(sectorPath(cx, cy, 36, alpha, 180), "lab-fill-b");
    out += path(sectorPath(cx, cy, 36, 180 + alpha, 360), "lab-fill-b");

    // Horizontal line g and rotated line h
    out += line(85, cy, 435, cy, "lab-side-a");
    const h1 = polar(cx, cy, 145, alpha);
    const h2 = polar(cx, cy, 145, alpha + 180);
    out += line(h2.x, h2.y, h1.x, h1.y, "lab-side-b");

    const lA = polar(cx, cy, 62, alpha / 2);
    const lA2 = polar(cx, cy, 62, 180 + alpha / 2);
    const lB = polar(cx, cy, 56, alpha + beta / 2);
    out += text(lA.x, lA.y + 4, `α = ${fmt(alpha, 0)}°`, "lab-text-a", "middle");
    out += text(lA2.x, lA2.y + 4, `α' = ${fmt(alpha, 0)}°`, "lab-text-a", "middle");
    out += text(lB.x, lB.y + 4, `β = ${fmt(beta, 0)}°`, "lab-text-b", "middle");
    out += circle(cx, cy, 4, "lab-point");

    out += rail("alpha", "Winkel α", alpha, 25, 155, 295);
    return out + "</svg>";
  },
  handles: { alpha: railHandle("alpha", 25, 155) },
};

const parallelTransversal: LabView = {
  render(v) {
    const alpha = v.alpha;
    const tilt = v.tilt;
    const isParallel = Math.abs(tilt) < 1e-6;
    const gY = 175;
    const hY = 92;
    let out = open("Doppelkreuzung mit Stufenwinkel und Wechselwinkel");
    out += title(isParallel ? `g ∥ h: Stufen- & Wechselwinkel gleich (${fmt(alpha, 0)}°)` : `Neigung Δ = ${fmt(tilt, 0)}°: Geraden nicht parallel`);

    // Transversal intersecting g at (225, gY)
    const pG = { x: 225, y: gY };
    const radA = (alpha * Math.PI) / 180;
    const cotA = Math.cos(radA) / Math.sin(radA);
    // Lower and upper points along transversal
    const sLow = { x: pG.x - 50 * cotA, y: gY + 50 };
    const dyS = hY - gY;
    const tiltRad = (tilt * Math.PI) / 180;
    const sHigh = { x: pG.x - (gY - 35) * cotA, y: 35 };

    // Exact line h through (260, hY) with slope tan(tiltRad) and intersection with s
    const mH = Math.tan(tiltRad);
    const hYAt = (x: number) => hY - mH * (x - 260);
    const denom = 1 - mH * cotA;
    const yCross =
      Math.abs(denom) > 0.1
        ? (hY - mH * (pG.x + gY * cotA - 260)) / denom
        : hY;
    const xCross = pG.x - (yCross - gY) * cotA;
    void dyS;

    out += line(60, gY, 460, gY, "lab-side-a");
    out += line(60, hYAt(60), 460, hYAt(460), isParallel ? "lab-side-ok" : "lab-side-b");
    out += line(sLow.x, sLow.y, sHigh.x, sHigh.y, "lab-axis");

    out += angleMark(pG, { x: 460, y: gY }, sHigh, 28, "lab-angle");
    out += angleMark({ x: xCross, y: yCross }, { x: 460, y: hYAt(460) }, sHigh, 28, isParallel ? "lab-angle-ok" : "lab-angle");
    out += text(pG.x + 34, gY - 12, `α₁ = ${fmt(alpha, 0)}°`, "lab-text-a");
    const betaTop = Math.round((alpha - tilt) * 10) / 10;
    out += text(xCross + 34, yCross - 12, `α₂ = ${fmt(betaTop, 0)}°`, isParallel ? "lab-text-ok" : "lab-text-b");

    out += rail("alpha", "Schnittwinkel α₁", alpha, 45, 130, 245);
    out += rail("tilt", "Neigung von h (0° = parallel)", tilt, -15, 15, 305);
    return out + "</svg>";
  },
  handles: {
    alpha: railHandle("alpha", 45, 130),
    tilt: railHandle("tilt", -15, 15),
  },
};

const triangleProof: LabView = {
  render(v) {
    const A = { x: 105, y: 235 };
    const B = { x: 415, y: 235 };
    const C = { x: v.cx, y: v.cy };
    const showAux = v.showAux === 1;
    const alpha = Math.round(angleDeg(A, B, C));
    const beta = Math.round(angleDeg(B, A, C));
    const gamma = 180 - alpha - beta;

    let out = open("Beweis der Innenwinkelsumme im Dreieck über Hilfsparallele");
    out += title(`α (${fmt(alpha, 0)}°) + β (${fmt(beta, 0)}°) + γ (${fmt(gamma, 0)}°) = 180°`);

    out += polygon([A, B, C], "lab-fill-a lab-side-a");
    out += angleMark(A, B, C, 26, "lab-angle");
    out += angleMark(B, C, A, 26, "lab-angle");
    out += angleMark(C, A, B, 26, "lab-angle-ok");

    if (showAux) {
      out += line(50, C.y, 470, C.y, "lab-side-ok");
      out += text(60, C.y - 8, "h ∥ AB", "lab-text-ok");
      // Alternate interior angles at C!
      out += angleMark(C, { x: C.x - 80, y: C.y }, A, 24, "lab-angle");
      out += angleMark(C, B, { x: C.x + 80, y: C.y }, 24, "lab-angle");
      out += text(C.x - 42, C.y + 18, `α'`, "lab-text-a", "end");
      out += text(C.x + 42, C.y + 18, `β'`, "lab-text-b", "start");
    }

    out += text(A.x - 8, A.y + 16, `A (${fmt(alpha, 0)}°)`, "lab-text-a", "middle");
    out += text(B.x + 8, B.y + 16, `B (${fmt(beta, 0)}°)`, "lab-text-b", "middle");
    out += handle("c", C.x, C.y, "Ecke C");
    out += text(C.x, C.y - 16, `C (γ = ${fmt(gamma, 0)}°)`, "lab-text-ok", "middle");

    return out + "</svg>";
  },
  handles: {
    c: {
      x: "cx",
      y: "cy",
      drag: (pt) => ({ cx: pt.x, cy: pt.y }),
    },
  },
};

const polygonTriangulation: LabView = {
  render(v) {
    const n = v.n;
    const showDiag = v.showDiag === 1;
    const total = polygonAngleSum(n);
    const triangles = n - 2;
    const cx = 240;
    const cy = 148;
    const R = 98;
    const pts = Array.from({ length: n }, (_, i) => {
      const ang = -Math.PI / 2 + (2 * Math.PI * i) / n;
      return { x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang) };
    });

    let out = open("Innenwinkelsumme im Vieleck über Dreieckszerlegung");
    out += title(`${fmt(n, 0)}-Eck: (${fmt(n, 0)} ${MINUS} 2) · 180° = ${fmt(triangles, 0)} · 180° = ${fmt(total, 0)}°`);
    out += polygon(pts, "lab-fill-a lab-side-a");

    if (showDiag) {
      for (let i = 2; i < n - 1; i++) {
        out += line(pts[0].x, pts[0].y, pts[i].x, pts[i].y, "lab-side-b");
      }
      for (let i = 1; i < n - 1; i++) {
        const mx = (pts[0].x + pts[i].x + pts[i + 1].x) / 3;
        const my = (pts[0].y + pts[i].y + pts[i + 1].y) / 3;
        out += text(mx, my + 4, `Δ${i}`, "lab-text-b", "middle");
      }
    }

    pts.forEach((p, i) => {
      out += circle(p.x, p.y, i === 0 && showDiag ? 5 : 3.5, i === 0 ? "lab-point-b" : "lab-point-a");
    });

    out += infoBox(498, 72, [
      [`Ecken n = ${fmt(n, 0)}`, "lab-text-a"],
      [`Teildreiecke: ${fmt(triangles, 0)}`, showDiag ? "lab-text-ok" : "lab-text-small"],
      [`Winkelsumme: ${fmt(total, 0)}°`, "lab-text-big"],
      [`Regelmäßig: ${fmt(total / n, 1)}°`, "lab-text-small"],
    ], "end");

    out += rail("n", "Anzahl der Ecken n", n, 3, 9, 298);
    return out + "</svg>";
  },
  handles: { n: railHandle("n", 3, 9) },
};

const multiCrossing: LabView = {
  render(v) {
    const alpha = 65;
    const beta = 55;
    const eps = v.eps;
    const isParallel = Math.abs(eps - alpha) < 1e-6;
    const topGamma = 180 - alpha - beta;
    const A = { x: 105, y: 230 };
    const B = { x: 405, y: 230 };
    const C = { x: 235, y: 55 };

    // Point D halfway along AC; line DE leaves at angle eps relative to AC downward
    const D = { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 };
    const dirAB = Math.atan2(B.y - A.y, B.x - A.x);
    const tilt = ((eps - alpha) * Math.PI) / 180;
    const E = { x: D.x + 165 * Math.cos(dirAB + tilt), y: D.y + 165 * Math.sin(dirAB + tilt) };

    let out = open("Mehrfache Geradenkreuzung: Parallelität über Winkel prüfen");
    out += title(isParallel ? `ε = ${fmt(eps, 0)}° = α ⇒ DE ∥ AB!` : `ε = ${fmt(eps, 0)}° ≠ α (${fmt(alpha, 0)}°) ⇒ nicht parallel`);

    out += line(65, A.y, 445, B.y, "lab-side-a");
    out += line(A.x, A.y, C.x, C.y, "lab-axis");
    out += line(B.x, B.y, C.x, C.y, "lab-axis");
    out += line(D.x - 45 * Math.cos(dirAB + tilt), D.y - 45 * Math.sin(dirAB + tilt), E.x, E.y, isParallel ? "lab-side-ok" : "lab-side-b");

    out += angleMark(A, B, C, 24, "lab-angle");
    out += angleMark(D, E, C, 24, isParallel ? "lab-angle-ok" : "lab-angle");
    out += text(A.x + 28, A.y - 10, `α = ${fmt(alpha, 0)}°`, "lab-text-a");
    out += text(B.x - 42, B.y - 10, `β = ${fmt(beta, 0)}°`, "lab-text-small");
    out += text(C.x + 12, C.y + 22, `γ = ${fmt(topGamma, 0)}°`, "lab-text-small");
    out += text(D.x + 26, D.y - 10, `ε = ${fmt(eps, 0)}°`, isParallel ? "lab-text-ok" : "lab-text-b");
    out += text(125, A.y + 18, "AB", "lab-text-a");
    out += text(D.x - 24, D.y - 6, "D", "lab-text-b");

    out += rail("eps", "Stufenwinkel ε bei D", eps, 45, 95, 295);
    return out + "</svg>";
  },
  handles: { eps: railHandle("eps", 45, 95) },
};

export const VIEWS_SYMMETRIE: Record<string, LabView> = {
  "axis-sym": axisSym,
  "point-sym": pointSym,
  "loci-model": lociModel,
  "perp-bisect-angle": perpBisectAngle,
  "quad-house": quadHouse,
  "line-cross": lineCross,
  "parallel-transversal": parallelTransversal,
  "triangle-proof": triangleProof,
  "polygon-triangulation": polygonTriangulation,
  "multi-crossing": multiCrossing,
};
