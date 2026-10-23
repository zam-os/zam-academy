import { fmt, fmtUnit } from "../exercises/format";
import type { LabKind, LabValues, ReadoutValues } from "../model/types";
import {
  arrow,
  CLOSE,
  circle,
  clamp,
  line,
  num,
  open,
  path,
  polygon,
  r1,
  rect,
  str,
  text,
} from "./draw";
import { trackEnergies } from "./physics";

type Renderer = (v: LabValues, r: ReadoutValues) => string;

// ─── 3.1 Schiefe Ebene ────────────────────────────────────────────────────

function inclinedPlane(v: LabValues, r: ReadoutValues): string {
  const k = 30; // px per metre, the same in both directions
  const base = Math.sqrt(v.l * v.l - v.h * v.h);
  const ax = 30;
  const ay = 205;
  const bx = ax + base * k;
  const cy = ay - v.h * k;
  const theta = Math.atan2(v.h, base);
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  // block centre on the slope, half way up
  const t = 0.5;
  const px = ax + base * k * t - sin * 12;
  const py = ay - v.h * k * t - cos * 12;
  const FGpx = 74;
  const gx = px;
  const gy = py + FGpx;
  const FH = FGpx * sin;
  const FN = FGpx * cos;
  const hx = px - cos * FH;
  const hy = py + sin * FH;
  const nx = px + sin * FN;
  const ny = py + cos * FN;
  return (
    open("Eine Kiste auf einer schiefen Ebene: Gewichtskraft, Hangabtriebskraft und Normalkraft") +
    polygon([[ax, ay], [bx, ay], [bx, cy]], "lab-ramp") +
    `<g transform="translate(${r1(px)},${r1(py)}) rotate(${r1((-theta * 180) / Math.PI)})">${rect(-18, -12, 36, 24, "lab-crate")}</g>` +
    line(gx, gy, hx, hy, "lab-grid") +
    line(gx, gy, nx, ny, "lab-grid") +
    arrow(px, py, gx, gy, "lab-force", 3) +
    arrow(px, py, hx, hy, "lab-force-2", 3) +
    arrow(px, py, nx, ny, "lab-velocity", 3) +
    circle(px, py, 3, "lab-marker") +
    text(gx - 8, gy + 6, "F_G", "lab-text lab-text-force", "end") +
    text(hx - 8, hy + 14, "F_H", "lab-text lab-text-force-2", "end") +
    text(nx + 10, ny + 10, "F_N", "lab-text", "start") +
    line(bx + 8, ay, bx + 8, cy, "lab-axis") +
    text(bx + 14, (ay + cy) / 2 + 4, `h = ${fmtUnit(v.h, "m", 1)}`, "lab-text-small") +
    text(ax, 290, `Länge der Ebene l = ${fmtUnit(v.l, "m", 0)}, Höhe h = ${fmtUnit(v.h, "m", 1)}`, "lab-text-small") +
    text(20, 28, `F_G = ${fmtUnit(num(r, "FG"), "N", 0)}`, "lab-text lab-text-big") +
    text(20, 50, `F_H = F_G · h / l = ${fmtUnit(num(r, "FH"), "N", 0)}`, "lab-text lab-text-force-2") +
    CLOSE
  );
}

// ─── 3.2 Hebel ────────────────────────────────────────────────────────────

function lever(v: LabValues, r: ReadoutValues): string {
  const px = 260;
  const py = 150;
  const k = 3.8;
  const M1 = v.F1 * v.a1;
  const M2 = v.F2 * v.a2;
  const tilt = clamp(((M1 - M2) / Math.max(M1, M2)) * 12, -12, 12);
  const phi = (tilt * Math.PI) / 180;
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);
  const end = 62 * k;
  const lx = px - end * cos;
  const ly = py + end * sin;
  const rx = px + end * cos;
  const ry = py - end * sin;
  const weight = (side: -1 | 1, a: number, F: number, label: string, cls: string) => {
    const x = px + side * a * k * cos;
    const y = py - side * a * k * sin;
    const hang = 30 + F * 0.25;
    return (
      line(x, y, x, y + hang, "lab-wire") +
      rect(x - 18, y + hang, 36, 24, cls) +
      text(x, y + hang + 17, label, "lab-on-block", "middle") +
      line(px, py + 26, x, py + 26, "lab-grid") +
      text((px + x) / 2, py + 44, `${fmt(a, 0)} cm`, "lab-text-small", "middle")
    );
  };
  return (
    open("Ein Hebel mit Drehpunkt, links und rechts hängt je ein Gewicht an einem Hebelarm") +
    polygon([[px, py + 4], [px - 18, py + 40], [px + 18, py + 40]], "lab-block") +
    line(lx, ly, rx, ry, "lab-wall", 'stroke-width="7"') +
    weight(-1, v.a1, v.F1, `${fmt(v.F1, 0)} N`, "lab-crate") +
    weight(1, v.a2, v.F2, `${fmt(v.F2, 0)} N`, "lab-crate") +
    circle(px, py, 5, "lab-marker") +
    text(20, 28, str(r, "state"), "lab-text lab-text-big") +
    text(20, 50, `links: ${fmt(M1, 0)} N·cm, rechts: ${fmt(M2, 0)} N·cm`, "lab-text-muted") +
    CLOSE
  );
}

// ─── 3.3 Flaschenzug ──────────────────────────────────────────────────────

function pulley(v: LabValues, r: ReadoutValues): string {
  const n = v.n;
  const topY = 60;
  const botY = 150;
  const cx = 240;
  const step = 14;
  const x0 = cx - ((n - 1) * step) / 2;
  let strands = "";
  for (let i = 0; i < n; i++) strands += line(x0 + i * step, topY, x0 + i * step, botY, "lab-wire");
  const pullX = x0 + (n - 1) * step + 38;
  const pullLen = 30 + clamp(num(r, "F") / 900, 0, 1) * 90;
  return (
    open("Ein Flaschenzug mit tragenden Seilstücken, Last und Zugkraft") +
    rect(150, 40, 180, 12, "lab-block") +
    rect(cx - 36, topY - 8, 72, 14, "lab-block") +
    strands +
    rect(cx - 36, botY, 72, 14, "lab-block") +
    line(cx, botY + 14, cx, botY + 40, "lab-wire") +
    rect(cx - 30, botY + 40, 60, 40, "lab-crate") +
    text(cx, botY + 66, `${fmt(v.m, 0)} kg`, "lab-charge-text", "middle") +
    arrow(cx, botY + 84, cx, botY + 84 + 40, "lab-force", 3) +
    text(cx + 8, botY + 120, `F_G = ${fmtUnit(num(r, "FG"), "N", 0)}`, "lab-text lab-text-force") +
    line(x0 + (n - 1) * step, topY, pullX, topY, "lab-wire") +
    arrow(pullX, topY, pullX, topY + pullLen, "lab-force-2", 4) +
    text(pullX + 8, topY + pullLen / 2 + 4, `F = ${fmtUnit(num(r, "F"), "N", 0)}`, "lab-text lab-text-force-2") +
    text(20, 28, `${n} tragende${n === 1 ? "s Seilstück" : " Seilstücke"}`, "lab-text lab-text-big") +
    text(20, 52, `Seilweg s = n · h = ${fmtUnit(num(r, "s"), "m", 1)}`, "lab-text-muted") +
    text(20, 72, `Arbeit W = F · s = ${fmtUnit(num(r, "W"), "J", 0)}`, "lab-text-muted") +
    CLOSE
  );
}

// ─── 3.4 Arbeit ───────────────────────────────────────────────────────────

function workForce(v: LabValues, r: ReadoutValues): string {
  const gx = 70;
  const gy = 262;
  const gw = 420;
  const gh = 110;
  const w = (v.s / 10) * gw;
  const h = (v.F / 500) * gh;
  const W = num(r, "W");
  const carrying = v.dir === 1;
  const crateX = 70;
  return (
    open("Eine Kiste wird mit einer Kraft bewegt, darunter das Kraft-Weg-Diagramm mit der Arbeit als Fläche") +
    rect(30, 98, 460, 8, "lab-ground") +
    rect(crateX, 62, 40, 36, "lab-crate") +
    (carrying
      ? arrow(crateX + 20, 62, crateX + 20, 18, "lab-force", 4) + text(crateX + 28, 30, `F = ${fmtUnit(v.F, "N", 0)} nach oben`, "lab-text lab-text-force") + arrow(crateX + 44, 82, crateX + 44 + clamp(v.s * 20, 20, 200), 82, "lab-velocity", 3) + text(crateX + 50 + clamp(v.s * 20, 20, 200), 86, "Weg waagerecht", "lab-text-small")
      : arrow(crateX + 40, 80, crateX + 40 + clamp(v.F / 4, 20, 140), 80, "lab-force", 4) + text(crateX + 44 + clamp(v.F / 4, 20, 140), 76, `F = ${fmtUnit(v.F, "N", 0)}`, "lab-text lab-text-force") + line(crateX, 114, crateX + clamp(v.s * 28, 20, 400), 114, "lab-velocity", 'stroke-width="3"') + text(crateX + clamp(v.s * 28, 20, 400) + 6, 118, `s = ${fmtUnit(v.s, "m", 1)}`, "lab-text-small")) +
    line(gx, gy, gx + gw, gy, "lab-axis") +
    line(gx, gy, gx, gy - gh - 10, "lab-axis") +
    text(gx + gw, gy + 16, "s in m (0 … 10)", "lab-text-small", "end") +
    text(gx + 4, gy - gh - 14, "F in N (0 … 500)", "lab-text-small") +
    rect(gx, gy - h, w, h, "lab-pie") +
    (carrying ? "" : text(gx + w / 2, gy - h / 2 + 4, `W = ${fmt(W, 0)} J`, "lab-text lab-text-big", "middle")) +
    (carrying ? text(gx + 12, gy - 20, "Kraft senkrecht zum Weg: W = 0 J", "lab-text lab-text-big") : "") +
    CLOSE
  );
}

// ─── 3.5 Leistung ─────────────────────────────────────────────────────────

function powerStairs(v: LabValues, r: ReadoutValues): string {
  const steps = Math.max(2, Math.round(v.h / 0.18));
  const stepsShown = Math.min(steps, 36);
  const totalH = (v.h / 10) * 130;
  const x0 = 30;
  const y0 = 150;
  const run = 230 / stepsShown;
  const rise = totalH / stepsShown;
  let d = `M${x0} ${y0}`;
  for (let i = 0; i < stepsShown; i++) d += ` L${r1(x0 + i * run)} ${r1(y0 - (i + 1) * rise)} L${r1(x0 + (i + 1) * run)} ${r1(y0 - (i + 1) * rise)}`;
  const P = num(r, "P");
  const barX = 40;
  const barW = 440;
  const pMax = 1500;
  const px = (value: number) => barX + clamp(value / pMax, 0, 1) * barW;
  return (
    open("Eine Person läuft eine Treppe hinauf, darunter die Leistung im Vergleich") +
    path(d + ` L${r1(x0 + 230)} ${y0} Z`, "lab-ramp") +
    rect(x0 + 230 - 24, y0 - totalH - 30, 20, 30, "lab-block") +
    circle(x0 + 230 - 14, y0 - totalH - 38, 7, "lab-crate") +
    line(x0 + 260, y0, x0 + 260, y0 - totalH, "lab-axis") +
    text(x0 + 266, y0 - totalH / 2 + 4, `h = ${fmtUnit(v.h, "m", 1)}`, "lab-text-small") +
    text(350, 60, `m = ${fmtUnit(v.m, "kg", 0)}`, "lab-text-muted") +
    text(350, 82, `t = ${fmtUnit(v.t, "s", 0)}`, "lab-text-muted") +
    text(350, 104, `W = ${fmtUnit(num(r, "W"), "J", 0)}`, "lab-text-muted") +
    rect(barX, 214, barW, 18, "lab-bar-in", 'style="opacity:0.3"') +
    rect(barX, 214, px(P) - barX, 18, "lab-bar-kin") +
    line(px(100), 206, px(100), 240, "lab-axis") +
    text(px(100), 254, "100 W Dauerleistung", "lab-text-small", "middle") +
    line(px(1000), 206, px(1000), 240, "lab-axis") +
    text(px(1000), 254, "1 kW Spitze", "lab-text-small", "middle") +
    text(20, 28, `P = W / t = ${fmtUnit(P, "W", 0)}`, "lab-text lab-text-big") +
    CLOSE
  );
}

// ─── 3.6 Energieformen ────────────────────────────────────────────────────

function energyForms(v: LabValues, r: ReadoutValues): string {
  const Epot = num(r, "Epot");
  const Ekin = num(r, "Ekin");
  const top = Math.max(Epot, Ekin, 1);
  const groundY = 250;
  const crateY = groundY - 30 - v.h * 8;
  const barMax = 140;
  const carX = 250 + 0;
  const vLen = (v.v / 30) * 110;
  return (
    open("Links ein Kran mit angehobener Masse, rechts ein fahrender Wagen, dazu die beiden Energien als Balken") +
    rect(20, groundY, 480, 10, "lab-ground") +
    line(70, groundY, 70, 70, "lab-wall") +
    line(70, 70, 150, 70, "lab-wall") +
    line(130, 70, 130, crateY, "lab-wire") +
    rect(112, crateY, 36, 30, "lab-crate") +
    text(130, crateY + 20, `${fmt(v.m, 0)} kg`, "lab-charge-text", "middle") +
    line(160, groundY, 160, crateY + 30, "lab-grid") +
    text(166, (groundY + crateY + 30) / 2 + 4, `h = ${fmt(v.h, 0)} m`, "lab-text-small") +
    rect(carX, groundY - 28, 60, 24, "lab-crate") +
    circle(carX + 12, groundY - 3, 6, "lab-block") +
    circle(carX + 48, groundY - 3, 6, "lab-block") +
    (v.v > 0 ? arrow(carX + 62, groundY - 16, carX + 62 + vLen, groundY - 16, "lab-velocity", 3) : "") +
    text(carX + 10, groundY - 36, `v = ${fmt(v.v, 0)} m/s`, "lab-text-small") +
    rect(402, groundY - (Epot / top) * barMax, 34, (Epot / top) * barMax, "lab-bar-pot") +
    rect(448, groundY - (Ekin / top) * barMax, 34, (Ekin / top) * barMax, "lab-bar-kin") +
    text(419, groundY + 22, "E_pot", "lab-text-muted", "middle") +
    text(465, groundY + 22, "E_kin", "lab-text-muted", "middle") +
    text(419, groundY - (Epot / top) * barMax - 6, `${fmt(Epot, 0)} J`, "lab-text-small", "middle") +
    text(465, groundY - (Ekin / top) * barMax - 6, `${fmt(Ekin, 0)} J`, "lab-text-small", "middle") +
    text(20, 28, `E_pot = ${fmtUnit(Epot, "J", 0)}`, "lab-text lab-text-big") +
    text(20, 50, `E_kin = ${fmtUnit(Ekin, "J", 0)}`, "lab-text lab-text-big") +
    CLOSE
  );
}

// ─── 3.7 Energieerhaltung ─────────────────────────────────────────────────

function energyTrack(v: LabValues): string {
  const x0 = 30;
  const kx = 150;
  const baseY = 255;
  const ky = 15;
  const X = (x: number) => x0 + x * kx;
  const Y = (x: number) => baseY - v.h0 * (x - 1) ** 2 * ky;
  let d = "";
  for (let i = 0; i <= 40; i++) {
    const x = (2 * i) / 40;
    d += `${i === 0 ? "M" : "L"}${r1(X(x))} ${r1(Y(x))} `;
  }
  const e = trackEnergies(v.m, v.h0, v.x, v.fric);
  const bx = 370;
  const bw = 60;
  const total = 170;
  const potH = e.reachable ? (e.Epot / e.E0) * total : 0;
  const kinH = e.reachable ? (e.Ekin / e.E0) * total : 0;
  const intH = e.reachable ? (e.Eint / e.E0) * total : 0;
  const restH = Math.max(0, total - potH - kinH - intH);
  const ballX = X(v.x);
  const ballY = Y(v.x) - 9;
  return (
    open("Ein Wagen auf einer Bahn im Tal mit den Energien als gestapelter Balken") +
    path(d, "lab-curve") +
    line(X(0), Y(0), X(2), Y(0), "lab-grid") +
    text(X(2) + 4, Y(0) - 4, "Starthöhe", "lab-text-small", "end") +
    circle(ballX, ballY, 9, "lab-crate") +
    rect(bx, baseY - potH, bw, potH, "lab-bar-pot") +
    rect(bx, baseY - potH - kinH, bw, kinH, "lab-bar-kin") +
    rect(bx, baseY - potH - kinH - intH, bw, intH, "lab-bar-loss") +
    rect(bx, baseY - total, bw, restH, "lab-bar-in", 'style="opacity:0.2"') +
    (potH > 8 ? text(bx + bw + 8, baseY - potH / 2 + 4, "E_pot", "lab-text-small") : "") +
    (kinH > 8 ? text(bx + bw + 8, baseY - potH - kinH / 2 + 4, "E_kin", "lab-text-small") : "") +
    (intH > 8 ? text(bx + bw + 8, baseY - potH - kinH - intH / 2 + 4, "innere Energie", "lab-text-small") : "") +
    text(bx + bw / 2, baseY + 18, "Energie (Summe bleibt gleich)", "lab-text-small", "middle") +
    text(20, 28, e.reachable ? `v = ${fmtUnit(e.v, "m/s", 1)}` : "Der Wagen kehrt vorher um", "lab-text lab-text-big") +
    text(20, 50, `Höhe an dieser Stelle: ${fmtUnit(e.h, "m", 1)}`, "lab-text-muted") +
    CLOSE
  );
}

// ─── 3.8 Wirkungsgrad ─────────────────────────────────────────────────────

function efficiency(v: LabValues, r: ReadoutValues): string {
  const eta = v.device;
  const full = 360;
  const useW = full * eta;
  const lossW = full - useW;
  return (
    open("Energiefluss: zugeführte Energie teilt sich in Nutzenergie und Verluste") +
    text(20, 50, `zugeführt E_zu = ${fmtUnit(v.Ezu, "kJ", 0)}`, "lab-text") +
    rect(20, 60, full, 40, "lab-bar-in") +
    path(`M${20 + full} 60 L420 60 L420 100 L${20 + full} 100 Z`, "lab-bar-in") +
    rect(20, 130, useW, 40, "lab-bar-kin") +
    rect(20 + useW + 10, 130, lossW, 40, "lab-bar-loss") +
    text(20, 192, `Nutzenergie ${fmtUnit(num(r, "Enutz"), "kJ", 1)} (${fmt(eta * 100, 0)} %)`, "lab-text") +
    text(20 + useW + 10, 212, `Verluste, meist Wärme: ${fmtUnit(num(r, "Everlust"), "kJ", 1)}`, "lab-text-muted") +
    text(20, 260, `η = E_nutz / E_zu = ${fmt(eta, 2)} = ${fmt(eta * 100, 0)} %`, "lab-text lab-text-big") +
    CLOSE
  );
}

export const ENERGIE_RENDERERS: Partial<Record<LabKind, Renderer>> = {
  "inclined-plane": inclinedPlane,
  lever,
  pulley,
  "work-force": workForce,
  "power-stairs": powerStairs,
  "energy-forms": energyForms,
  "energy-track": energyTrack,
  efficiency,
};
