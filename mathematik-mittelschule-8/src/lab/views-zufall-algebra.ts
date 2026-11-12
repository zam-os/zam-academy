import { fmt } from "../exercises/format";
import {
  Plot,
  W,
  circle,
  handle,
  infoBox,
  line,
  num,
  open,
  path,
  polygon,
  polyline,
  r1,
  rect,
  sectorPath,
  text,
  type LabView,
  type Pt,
} from "./svg";
import { coordinateHandle, title } from "./view-helpers";

/** 16. Glücksrad & Gesetz der großen Zahlen (relative Häufigkeit vs. Laplace) */
export const chanceWheelView: LabView = {
  render(v, r) {
    const win = v.win ?? 3;
    const totalSeg = v.totalSeg ?? 8;
    const trials = Math.max(0, v.trials ?? 0);
    const hits = Math.max(0, v.hits ?? 0);
    const cx = 132;
    const cy = 170;
    const rad = 88;
    const step = 360 / totalSeg;

    let sectors = "";
    for (let i = 0; i < totalSeg; i++) {
      sectors += path(
        sectorPath(cx, cy, rad, i * step, (i + 1) * step),
        i < win ? "lab-fill-a" : "lab-plot-bg",
      );
    }

    const theo = win / totalSeg;
    const rel = trials > 0 ? hits / trials : 0;
    const bx = 264;
    const by = 82;
    const bw = 216;
    const theoY = by + 130 * (1 - theo);

    return (
      open("Glücksrad und relative Häufigkeit") +
      title(`Glücksrad (${win} von ${totalSeg} Treffer) & Versuchsreihe`) +
      sectors +
      circle(cx, cy, 8, "lab-point") +
      line(cx, cy - rad - 12, cx, cy - rad + 4, "lab-side-a") +
      rect(bx, by, bw, 130, "lab-plot-bg", 'rx="6"') +
      line(bx, theoY, bx + bw, theoY, "lab-axis") +
      text(bx + 8, theoY - 6, `Theorie P = ${fmt(theo * 100, 1)} %`, "lab-text-muted") +
      rect(bx + 36, by + 130 * (1 - theo), 52, 130 * theo, "lab-bar-b", 'rx="4"') +
      rect(bx + 124, by + 130 * (1 - rel), 52, Math.max(2, 130 * rel), "lab-bar-a", 'rx="4"') +
      text(bx + 62, by + 148, `P = ${fmt(theo * 100, 1)} %`, "lab-text-small", "middle") +
      text(bx + 150, by + 148, `h = ${trials > 0 ? fmt(rel * 100, 1) : "0,0"} %`, "lab-text", "middle") +
      infoBox(
        bx,
        262,
        [
          [`Versuche: ${trials} · Treffer: ${hits}`, "lab-text"],
          [`Relative Häufigkeit ≈ ${fmt(num(r, "relPct"), 1)} %`, "lab-text-small"],
        ],
      ) +
      "</svg>"
    );
  },
};

/** 17. Term-Flächenmodell (Distributivgesetz a · (bx + c)) */
export const termDistributiveView: LabView = {
  render(v, r) {
    const a = v.a ?? 3;
    const b = v.b ?? 2;
    const c = v.c ?? 4;
    const x = v.x ?? 2;
    const w1 = Math.max(48, Math.abs(b * x) * 18);
    const w2 = Math.max(48, Math.abs(c) * 18);
    const totalW = Math.min(350, w1 + w2);
    const ratio1 = w1 / (w1 + w2);
    const splitW = totalW * ratio1;
    const hPx = Math.min(130, a * 26);
    const x0 = 96;
    const y0 = 104;

    return (
      open("Distributivgesetz am Flächenmodell") +
      title(`Distributivgesetz: ${a} · (${b}x + ${c}) = ${a * b}x + ${a * c}`) +
      rect(x0, y0, splitW, hPx, "lab-fill-a", 'rx="4"') +
      rect(x0 + splitW, y0, totalW - splitW, hPx, "lab-fill-b", 'rx="4"') +
      text(x0 - 16, y0 + hPx / 2 + 4, `${a}`, "lab-text", "end") +
      text(x0 + splitW / 2, y0 - 10, `${b}x`, "lab-text", "middle") +
      text(x0 + splitW + (totalW - splitW) / 2, y0 - 10, `${c}`, "lab-text", "middle") +
      text(x0 + splitW / 2, y0 + hPx / 2 + 5, `${a * b}x`, "lab-text", "middle") +
      text(x0 + splitW + (totalW - splitW) / 2, y0 + hPx / 2 + 5, `${a * c}`, "lab-text", "middle") +
      infoBox(
        96,
        262,
        [
          [`Wert für x = ${fmt(x, 0)}: ${fmt(num(r, "leftVal"), 0)} = ${fmt(num(r, "rightVal"), 0)}`, "lab-text"],
          [`${a} · (${b}·${x} + ${c}) = ${a * b}·${x} + ${a * c}`, "lab-text-small"],
        ],
      ) +
      "</svg>"
    );
  },
};

/** 18. Balkenwaage in ℚ mit x auf beiden Seiten */
export const balanceScaleQView: LabView = {
  render(v, r) {
    const leftVal = num(r, "leftVal");
    const rightVal = num(r, "rightVal");
    const diff = leftVal - rightVal;
    const tiltDeg = Math.max(-14, Math.min(14, diff * -1.4));
    const rad = (tiltDeg * Math.PI) / 180;
    const cx = 260;
    const cy = 192;
    const arm = 128;
    const lx = cx - arm * Math.cos(rad);
    const ly = cy + arm * Math.sin(rad);
    const rx = cx + arm * Math.cos(rad);
    const ry = cy - arm * Math.sin(rad);
    const eq = Math.abs(diff) < 0.01;

    return (
      open("Balkenwaage in den rationalen Zahlen") +
      title("Gleichung mit x auf beiden Seiten auf die Waage bringen") +
      polygon(
        [
          { x: cx - 22, y: 268 },
          { x: cx + 22, y: 268 },
          { x: cx, y: cy + 6 },
        ],
        "lab-fulcrum",
      ) +
      line(lx, ly, rx, ry, eq ? "lab-side-ok" : "lab-axis") +
      circle(cx, cy, 7, "lab-point") +
      rect(lx - 66, ly - 56, 132, 48, eq ? "lab-fill-ok" : "lab-fill-a", 'rx="8"') +
      text(lx, ly - 35, `Links: ${v.a}·x + (${fmt(v.b, 0)})`, "lab-text-small", "middle") +
      text(lx, ly - 17, `= ${fmt(leftVal, 1)}`, "lab-text", "middle") +
      rect(rx - 66, ry - 56, 132, 48, eq ? "lab-fill-ok" : "lab-fill-b", 'rx="8"') +
      text(rx, ry - 35, `Rechts: ${v.c}·x + (${fmt(v.d, 0)})`, "lab-text-small", "middle") +
      text(rx, ry - 17, `= ${fmt(rightVal, 1)}`, "lab-text", "middle") +
      infoBox(
        310,
        262,
        [
          [eq ? `Gleichgewicht bei x = ${fmt(v.guessX ?? 0, 1)}!` : "Waage hängt schief", "lab-text"],
          [`Probe: ${fmt(leftVal, 1)} ${eq ? "=" : "≠"} ${fmt(rightVal, 1)}`, "lab-text-small"],
        ],
      ) +
      "</svg>"
    );
  },
};

/** 19. Funktionsvergleich (proportional vs. linear vs. nicht linear + Maßstab) */
export const funcCompareView: LabView = {
  render(v, r) {
    const kind = v.kind ?? 0;
    const m = v.m ?? 2;
    const t = kind === 0 ? 0 : (v.t ?? 2);
    const yMax = v.scaleZoom === 1 ? 10 : 20;
    const plot = new Plot(0, 5, 0, yMax, { x: 72, y: 54, w: 340, h: 224 });

    const fn = (x: number) => (kind === 2 ? 0.5 * x * x : m * x + t);
    const pts: Pt[] = [];
    for (let x = 0; x <= 5.01; x += 0.25) {
      const y = fn(x);
      if (y <= yMax + 2) pts.push(plot.P(x, Math.min(yMax, y)));
    }

    const cls = kind === 0 ? "proportional" : kind === 1 ? "linear" : "nicht linear";
    const p0 = plot.P(0, Math.min(yMax, fn(0)));
    const p3 = plot.P(3, Math.min(yMax, fn(3)));
    return (
      open("Funktionale Zusammenhänge") +
      title(`Darstellung: ${cls} · Achsen-Obergrenze ${yMax}`) +
      plot.grid(1, yMax / 5, "x", "y") +
      polyline(pts, "lab-curve") +
      circle(p0.x, p0.y, 5, "lab-point") +
      circle(p3.x, p3.y, 5, "lab-point") +
      infoBox(
        314,
        74,
        [
          [`Typ: ${cls}`, "lab-text"],
          [`y(3) = ${fmt(num(r, "y3"), 1)}`, "lab-text-small"],
        ],
      ) +
      "</svg>"
    );
  },
};

const SLOPE_PLOT = new Plot(-2, 6, -4, 10, { x: 72, y: 52, w: 336, h: 232 });

/** 20. Lineare Funktionen y = mx + t mit Steigungsdreieck und Ziehpunkten */
export const linearSlopeTriangleView: LabView = {
  render(v, _r) {
    const m = v.m ?? 1.5;
    const t = v.t ?? 2;
    const pStart = SLOPE_PLOT.P(-2, m * -2 + t);
    const pEnd = SLOPE_PLOT.P(6, m * 6 + t);
    const p0 = SLOPE_PLOT.P(0, t);
    const pCorner = SLOPE_PLOT.P(2, t);
    const pTop = SLOPE_PLOT.P(2, 2 * m + t);

    return (
      open("Lineare Funktion und Steigungsdreieck") +
      title(`Funktionsgleichung y = ${fmt(m, 1)}·x ${t >= 0 ? `+ ${fmt(t, 1)}` : `− ${fmt(Math.abs(t), 1)}`}`) +
      SLOPE_PLOT.grid(1, 2, "x", "y") +
      line(pStart.x, pStart.y, pEnd.x, pEnd.y, "lab-curve") +
      polygon([p0, pCorner, pTop], "lab-fill-a") +
      line(p0.x, p0.y, pCorner.x, pCorner.y, "lab-axis") +
      line(pCorner.x, pCorner.y, pTop.x, pTop.y, "lab-side-a") +
      text((p0.x + pCorner.x) / 2, p0.y + 16, "Δx = +2", "lab-text-small", "middle") +
      text(pCorner.x + 8, (pCorner.y + pTop.y) / 2, `Δy = ${fmt(2 * m, 1)}`, "lab-text") +
      handle("t", p0.x, p0.y, "y-Achsenabschnitt t") +
      handle("slope", pTop.x, pTop.y, "Steigung m") +
      infoBox(
        312,
        74,
        [
          [`m = ${fmt(m, 1)},  t = ${fmt(t, 1)}`, "lab-text"],
          [`y(4) = ${fmt(4 * m + t, 1)}`, "lab-text-small"],
        ],
      ) +
      "</svg>"
    );
  },
  handles: {
    t: {
      ...coordinateHandle("t", "t", (pt) => ({
        x: Math.round(SLOPE_PLOT.invY(pt.y)),
        y: Math.max(-3, Math.min(5, Math.round(SLOPE_PLOT.invY(pt.y)))),
      })),
      x: undefined,
      drag(pt) {
        return { t: Math.max(-3, Math.min(5, Math.round(SLOPE_PLOT.invY(pt.y)))) };
      },
    },
    slope: {
      y: "m",
      drag(pt, v) {
        const mathY = SLOPE_PLOT.invY(pt.y);
        const t = v.t ?? 0;
        const mRaw = (mathY - t) / 2;
        return { m: Math.max(-2, Math.min(3, Math.round(mRaw * 2) / 2)) };
      },
    },
  },
};

export { W, r1 };
