import { fmt, fmtUnit } from "../exercises/format";
import type { LabDefinition, LabValues, ReadoutValues } from "../model/types";

/**
 * Every lab draws itself as inline SVG from the current slider values and
 * readouts. Colours come from CSS classes (styles.css, "lab-*"), so the
 * drawings follow the light and dark theme.
 */

const W = 520;
const H = 300;

function open(label: string): string {
  return `<svg class="lab-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}" preserveAspectRatio="xMidYMid meet">`;
}

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function text(
  x: number,
  y: number,
  content: string,
  cls = "lab-text",
  anchor: "start" | "middle" | "end" = "start",
): string {
  return `<text x="${r1(x)}" y="${r1(y)}" class="${cls}" text-anchor="${anchor}">${esc(content)}</text>`;
}

function arrow(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cls: string,
  width = 3,
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 1) return "";
  const ux = dx / len;
  const uy = dy / len;
  const head = Math.min(12, len / 2);
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  const px = -uy * head * 0.5;
  const py = ux * head * 0.5;
  return (
    `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(bx)}" y2="${r1(by)}" class="${cls}" stroke-width="${width}" stroke-linecap="round" />` +
    `<polygon points="${r1(x2)},${r1(y2)} ${r1(bx + px)},${r1(by + py)} ${r1(bx - px)},${r1(by - py)}" class="${cls} lab-arrowhead" />`
  );
}

function r1(value: number): string {
  return (Math.round(value * 10) / 10).toString();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** A deterministic pseudo-random position in [0, 1) for particle i. */
function jitter(i: number, salt: number): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Blue for cold, red for hot, as a CSS colour. */
function heatColor(theta: number, min = 0, max = 100): string {
  const t = clamp((theta - min) / (max - min), 0, 1);
  const hue = 215 - 215 * t;
  return `hsl(${Math.round(hue)} 80% 55%)`;
}

function num(r: ReadoutValues, key: string): number {
  const value = r[key];
  return typeof value === "number" ? value : Number.NaN;
}

function str(r: ReadoutValues, key: string): string {
  const value = r[key];
  return typeof value === "string" ? value : "";
}

// ─── Stage 1: Druck ────────────────────────────────────────────────────────

function pressureStamp(v: LabValues, r: ReadoutValues): string {
  const p = num(r, "p");
  const width = 40 + Math.sqrt(v.A) * 5;
  const x = 260 - width / 2;
  const top = 170;
  const forceLen = 30 + (v.F / 1000) * 90;
  const opacity = clamp((Math.log10(Math.max(p, 1)) - 2) / 5, 0.06, 1);
  return (
    open("Ein Klotz drückt mit einer Kraft auf eine Fläche") +
    `<rect x="40" y="230" width="440" height="30" class="lab-ground" />` +
    `<rect x="${r1(x)}" y="230" width="${r1(width)}" height="30" class="lab-pressure" style="opacity:${opacity.toFixed(2)}" />` +
    `<rect x="${r1(x)}" y="${top}" width="${r1(width)}" height="60" rx="4" class="lab-block" />` +
    arrow(260, top - forceLen - 6, 260, top - 4, "lab-force", 4) +
    text(272, top - forceLen / 2, `F = ${fmtUnit(v.F, "N", 0)}`, "lab-text lab-text-force") +
    text(260, 285, `A = ${fmtUnit(v.A, "cm²", 1)}`, "lab-text", "middle") +
    text(40, 40, `p = F / A = ${fmtUnit(p, "Pa", 0)}`, "lab-text lab-text-big") +
    text(40, 64, `= ${fmtUnit(p / 100, "hPa", 1)} = ${fmtUnit(p / 100_000, "bar", 3)}`, "lab-text-muted") +
    `</svg>`
  );
}

function hydraulicPress(v: LabValues, r: ReadoutValues): string {
  const F2 = num(r, "F2");
  const s2 = num(r, "s2");
  const w1 = 20 + Math.sqrt(v.A1) * 8;
  const w2 = 20 + Math.sqrt(v.A2) * 5;
  const x1 = 130;
  const x2 = 370;
  const floor = 250;
  const fluidTop = 150;
  const d1 = clamp(v.s1 * 1.6, 0, 60);
  const d2 = clamp(s2 * 1.6, 0, 60);
  const p1y = fluidTop + d1;
  const p2y = fluidTop - d2;
  const f1Len = 30 + (v.F1 / 500) * 70;
  const f2Len = 30 + clamp(F2 / 20000, 0, 1) * 90;
  return (
    open("Hydraulische Presse mit zwei Kolben") +
    // fluid in both cylinders and the connecting pipe
    `<rect x="${r1(x1 - w1 / 2)}" y="${r1(p1y)}" width="${r1(w1)}" height="${r1(floor - p1y)}" class="lab-fluid" />` +
    `<rect x="${r1(x2 - w2 / 2)}" y="${r1(p2y)}" width="${r1(w2)}" height="${r1(floor - p2y)}" class="lab-fluid" />` +
    `<rect x="${r1(x1)}" y="${floor - 26}" width="${r1(x2 - x1)}" height="26" class="lab-fluid" />` +
    // cylinder walls
    `<path d="M${r1(x1 - w1 / 2)} 90 V${floor} H${r1(x1 + w1 / 2)} V90" class="lab-wall" />` +
    `<path d="M${r1(x2 - w2 / 2)} 90 V${floor} H${r1(x2 + w2 / 2)} V90" class="lab-wall" />` +
    // pistons
    `<rect x="${r1(x1 - w1 / 2)}" y="${r1(p1y - 10)}" width="${r1(w1)}" height="10" class="lab-block" />` +
    `<rect x="${r1(x2 - w2 / 2)}" y="${r1(p2y - 10)}" width="${r1(w2)}" height="10" class="lab-block" />` +
    arrow(x1, p1y - 14 - f1Len, x1, p1y - 14, "lab-force", 4) +
    arrow(x2, p2y - 14, x2, p2y - 14 - f2Len, "lab-force-2", 4) +
    text(x1, 40, `F₁ = ${fmtUnit(v.F1, "N", 0)}`, "lab-text lab-text-force", "middle") +
    text(x1, 275, `A₁ = ${fmtUnit(v.A1, "cm²", 1)}`, "lab-text", "middle") +
    text(x2, 40, `F₂ = ${fmtUnit(F2, "N", 0)}`, "lab-text lab-text-force-2", "middle") +
    text(x2, 275, `A₂ = ${fmtUnit(v.A2, "cm²", 0)}`, "lab-text", "middle") +
    text(250, 110, `p = ${fmtUnit(num(r, "p") / 1000, "kPa", 1)}`, "lab-text-muted", "middle") +
    text(250, 130, `s₁ = ${fmtUnit(v.s1, "cm", 1)} → s₂ = ${fmtUnit(s2, "cm", 2)}`, "lab-text-muted", "middle") +
    `</svg>`
  );
}

function hydrostatic(v: LabValues, r: ReadoutValues): string {
  const depthPx = (v.h / 40) * 200;
  const surface = 60;
  const bottom = 270;
  const diverY = surface + depthPx;
  let layers = "";
  for (let i = 0; i < 8; i++) {
    const y = surface + (i * (bottom - surface)) / 8;
    layers += `<rect x="120" y="${r1(y)}" width="280" height="${r1((bottom - surface) / 8)}" class="lab-fluid" style="opacity:${(0.45 + i * 0.07).toFixed(2)}" />`;
  }
  return (
    open("Taucher in einem Wasserbecken, der Druck wächst mit der Tiefe") +
    layers +
    `<path d="M120 ${surface} V${bottom} H400 V${surface}" class="lab-wall" />` +
    text(398, surface - 6, `Oberfläche, Luftdruck ${fmtUnit(1013, "hPa", 0)}`, "lab-text-small", "end") +
    // diver
    `<circle cx="260" cy="${r1(diverY - 10)}" r="8" class="lab-block" />` +
    `<rect x="252" y="${r1(diverY - 2)}" width="16" height="22" rx="4" class="lab-block" />` +
    text(275, diverY + 8, `h = ${fmtUnit(v.h, "m", 1)}`, "lab-text") +
    // depth scale on the right
    `<line x1="430" y1="${surface}" x2="430" y2="${bottom}" class="lab-axis" />` +
    text(438, surface + 4, "0 m", "lab-text-muted") +
    text(438, surface + 100 + 4, "20 m", "lab-text-muted") +
    text(438, bottom + 4, "40 m", "lab-text-muted") +
    text(20, 32, `Schweredruck ρ·g·h = ${fmtUnit(num(r, "pS") / 100, "hPa", 0)}`, "lab-text lab-text-big") +
    text(20, 290, `Gesamtdruck = Luftdruck + Schweredruck = ${fmtUnit(num(r, "pTotalBar"), "bar", 2)}`, "lab-text") +
    `</svg>`
  );
}

function buoyancy(v: LabValues, r: ReadoutValues): string {
  const state = str(r, "state");
  const frac = clamp(num(r, "frac") / 100, 0, 1);
  const side = 30 + Math.cbrt(v.V) * 20;
  const surface = 90;
  const bottom = 270;
  let top: number;
  if (state === "sinkt") top = bottom - side;
  else if (state === "schwebt") top = (surface + bottom) / 2 - side / 2;
  else top = surface - side * (1 - frac);
  const FG = num(r, "FG");
  const FA = num(r, "FA");
  const scale = 80 / Math.max(FG, FA, 1);
  const cx = 230;
  const cy = top + side / 2;
  return (
    open("Ein Körper in einer Flüssigkeit mit Gewichtskraft und Auftriebskraft") +
    `<rect x="100" y="${surface}" width="260" height="${bottom - surface}" class="lab-fluid" />` +
    `<path d="M100 60 V${bottom} H360 V60" class="lab-wall" />` +
    `<rect x="${r1(cx - side / 2)}" y="${r1(top)}" width="${r1(side)}" height="${r1(side)}" rx="4" class="lab-block" />` +
    arrow(cx - 14, cy, cx - 14, cy + FG * scale, "lab-force", 4) +
    arrow(cx + 14, cy, cx + 14, cy - FA * scale, "lab-force-2", 4) +
    text(cx - 20, cy + FG * scale + 16, `F_G = ${fmtUnit(FG, "N", 2)}`, "lab-text lab-text-force", "end") +
    text(cx + 20, cy - FA * scale - 8, `F_A = ${fmtUnit(FA, "N", 2)}`, "lab-text lab-text-force-2") +
    text(380, 110, `Körper: ${fmtUnit(v.rhoK, "kg/m³", 0)}`, "lab-text") +
    text(380, 134, `Flüssigkeit: ${fmtUnit(v.rhoFl, "kg/m³", 0)}`, "lab-text") +
    text(380, 170, `Der Körper ${state}.`, "lab-text lab-text-big") +
    (state === "schwimmt"
      ? text(380, 194, `${fmt(frac * 100, 0)} % eingetaucht`, "lab-text-muted")
      : "") +
    `</svg>`
  );
}

function boyle(v: LabValues, r: ReadoutValues): string {
  const p2 = num(r, "p2");
  const barrelX = 100;
  const barrelW = 320;
  const gasW = (v.V2 / 300) * barrelW;
  const pistonX = barrelX + gasW;
  let dots = "";
  for (let i = 0; i < 28; i++) {
    const px = barrelX + 8 + jitter(i, 1) * (gasW - 16);
    const py = 118 + jitter(i, 2) * 64;
    dots += `<circle cx="${r1(px)}" cy="${r1(py)}" r="4" class="lab-particle" />`;
  }
  const gaugeOpacity = clamp(p2 / 6000, 0.1, 1);
  return (
    open("Spritze mit eingeschlossenem Gas, der Kolben ändert das Volumen") +
    `<rect x="${barrelX}" y="110" width="${r1(gasW)}" height="80" class="lab-gas" style="opacity:${gaugeOpacity.toFixed(2)}" />` +
    `<path d="M${barrelX} 110 H${barrelX + barrelW} M${barrelX} 190 H${barrelX + barrelW} M${barrelX} 110 V190" class="lab-wall" />` +
    `<rect x="${r1(pistonX)}" y="106" width="12" height="88" class="lab-block" />` +
    `<rect x="${r1(pistonX + 12)}" y="146" width="${r1(barrelX + barrelW + 60 - pistonX)}" height="8" class="lab-block" />` +
    dots +
    text(barrelX + gasW / 2, 215, `V₂ = ${fmtUnit(v.V2, "cm³", 0)}`, "lab-text", "middle") +
    text(20, 40, `p₂ = p₁ · V₁ / V₂ = ${fmtUnit(p2, "hPa", 0)}`, "lab-text lab-text-big") +
    text(20, 64, `p₁ · V₁ = ${fmt(num(r, "pv1"), 0)} · p₂ · V₂ = ${fmt(num(r, "pv2"), 0)} (hPa · cm³)`, "lab-text-muted") +
    text(20, 285, `Start: p₁ = ${fmtUnit(v.p1, "hPa", 0)}, V₁ = ${fmtUnit(v.V1, "cm³", 0)}, Temperatur konstant`, "lab-text-muted") +
    `</svg>`
  );
}

// ─── Stage 2: Mechanik und Energie ────────────────────────────────────────

function inclinedPlane(v: LabValues, r: ReadoutValues): string {
  const F = num(r, "F");
  const FG = num(r, "FG");
  const scale = Math.min(380 / v.l, 180 / v.h);
  const base = Math.sqrt(Math.max(v.l * v.l - v.h * v.h, 0)) * scale;
  const hPx = v.h * scale;
  const x0 = 60;
  const y0 = 250;
  const angle = Math.atan2(hPx, base);
  const mx = x0 + base / 2;
  const my = y0 - hPx / 2;
  const fLen = 40 + (F / Math.max(FG, 1)) * 80;
  const ux = Math.cos(angle);
  const uy = -Math.sin(angle);
  return (
    open("Kiste auf einer schiefen Ebene mit Hangabtriebskraft und Gewichtskraft") +
    `<polygon points="${x0},${y0} ${r1(x0 + base)},${y0} ${r1(x0 + base)},${r1(y0 - hPx)}" class="lab-ramp" />` +
    `<g transform="translate(${r1(mx)} ${r1(my)}) rotate(${r1((-angle * 180) / Math.PI)})">` +
    `<rect x="-22" y="-36" width="44" height="36" rx="3" class="lab-block" /></g>` +
    arrow(mx, my - 18, mx + ux * fLen, my - 18 + uy * fLen, "lab-force", 4) +
    arrow(mx, my - 18, mx, my - 18 + 70, "lab-force-2", 3) +
    text(mx + ux * fLen + 8, my - 24 + uy * fLen, `F = ${fmtUnit(F, "N", 0)}`, "lab-text lab-text-force") +
    text(mx + 8, my + 60, `F_G = ${fmtUnit(FG, "N", 0)}`, "lab-text lab-text-force-2") +
    text(x0 + base + 10, y0 - hPx / 2, `h = ${fmtUnit(v.h, "m", 1)}`, "lab-text") +
    text(x0 + base / 2, y0 + 22, `Länge l = ${fmtUnit(v.l, "m", 1)}`, "lab-text", "middle") +
    text(20, 40, `Kraftersparnis: F = F_G · h / l, Faktor ${fmt(num(r, "factor"), 1)}`, "lab-text lab-text-big") +
    text(20, 64, `Arbeit W = F · l = ${fmtUnit(num(r, "W"), "J", 0)} (gleich der Hubarbeit m · g · h)`, "lab-text-muted") +
    `</svg>`
  );
}

function workPower(v: LabValues, r: ReadoutValues): string {
  const W_ = num(r, "W");
  const P = num(r, "P");
  const hPx = (v.h / 30) * 180;
  const groundY = 260;
  const topY = groundY - hPx;
  const steps = Math.max(2, Math.round(v.h));
  let stairs = "";
  for (let i = 0; i < steps; i++) {
    const sx = 120 + (i * 200) / steps;
    const sy = groundY - ((i + 1) * hPx) / steps;
    stairs += `<rect x="${r1(sx)}" y="${r1(sy)}" width="${r1(200 / steps + 1)}" height="${r1(groundY - sy)}" class="lab-ground" />`;
  }
  const clockFrac = clamp(v.t / 120, 0, 1);
  const cx = 420;
  const cy = 90;
  const rad = 36;
  const endX = cx + rad * Math.sin(clockFrac * 2 * Math.PI);
  const endY = cy - rad * Math.cos(clockFrac * 2 * Math.PI);
  const large = clockFrac > 0.5 ? 1 : 0;
  const pie =
    clockFrac >= 0.999
      ? `<circle cx="${cx}" cy="${cy}" r="${rad}" class="lab-pie" />`
      : clockFrac > 0.001
        ? `<path d="M${cx} ${cy} L${cx} ${cy - rad} A${rad} ${rad} 0 ${large} 1 ${r1(endX)} ${r1(endY)} Z" class="lab-pie" />`
        : "";
  return (
    open("Eine Person trägt eine Kiste eine Treppe hinauf, eine Uhr misst die Zeit") +
    stairs +
    `<rect x="60" y="${groundY}" width="400" height="20" class="lab-ground" />` +
    `<circle cx="340" cy="${r1(topY - 44)}" r="9" class="lab-block" />` +
    `<rect x="332" y="${r1(topY - 34)}" width="16" height="30" rx="4" class="lab-block" />` +
    `<rect x="350" y="${r1(topY - 30)}" width="22" height="18" rx="2" class="lab-crate" />` +
    arrow(100, groundY, 100, topY, "lab-axis", 2) +
    text(94, (groundY + topY) / 2, `h = ${fmtUnit(v.h, "m", 1)}`, "lab-text", "end") +
    `<circle cx="${cx}" cy="${cy}" r="${rad}" class="lab-clock" />` +
    pie +
    text(cx, cy + rad + 18, `t = ${fmtUnit(v.t, "s", 0)}`, "lab-text", "middle") +
    text(20, 40, `W = m · g · h = ${fmtUnit(W_, "J", 0)}`, "lab-text lab-text-big") +
    text(20, 64, `P = W / t = ${fmtUnit(P, "W", 1)}`, "lab-text lab-text-big") +
    text(20, 290, `m = ${fmtUnit(v.m, "kg", 1)}, F_G = ${fmtUnit(num(r, "FG"), "N", 1)}`, "lab-text-muted") +
    `</svg>`
  );
}

function energyRamp(v: LabValues, r: ReadoutValues): string {
  const Epot = num(r, "Epot");
  const Ekin = num(r, "Ekin");
  const Eges = Math.max(num(r, "Eges"), 1);
  const x0 = 60;
  const y0 = 70;
  const x1 = 330;
  const y1 = 250;
  const t = clamp(v.x / 100, 0, 1);
  const px = x0 + (x1 - x0) * t;
  const py = y0 + (y1 - y0) * t;
  const barMax = 150;
  const potH = (Epot / Eges) * barMax;
  const kinH = (Ekin / Eges) * barMax;
  return (
    open("Skater auf einer Rampe mit Energiebalken für Lage- und Bewegungsenergie") +
    `<polygon points="${x0},${y0} ${x1},${y1} ${x0},${y1}" class="lab-ramp" />` +
    `<line x1="${x0}" y1="${y1}" x2="400" y2="${y1}" class="lab-axis" />` +
    `<circle cx="${r1(px)}" cy="${r1(py - 12)}" r="11" class="lab-block" />` +
    text(x0 - 6, (y0 + y1) / 2, `h₀ = ${fmtUnit(v.h0, "m", 1)}`, "lab-text", "end") +
    text(px + 16, py - 14, `h = ${fmtUnit(num(r, "h"), "m", 1)}`, "lab-text") +
    // bars
    `<rect x="420" y="${r1(y1 - potH)}" width="34" height="${r1(potH)}" class="lab-bar-pot" />` +
    `<rect x="466" y="${r1(y1 - kinH)}" width="34" height="${r1(kinH)}" class="lab-bar-kin" />` +
    text(437, y1 + 16, "E_pot", "lab-text-muted", "middle") +
    text(483, y1 + 16, "E_kin", "lab-text-muted", "middle") +
    text(437, y1 - potH - 6, fmt(Epot / 1000, 1), "lab-text-small", "middle") +
    text(483, y1 - kinH - 6, fmt(Ekin / 1000, 1), "lab-text-small", "middle") +
    text(460, 60, "kJ", "lab-text-muted", "middle") +
    text(20, 36, `E_ges = ${fmtUnit(Eges / 1000, "kJ", 2)} bleibt erhalten`, "lab-text lab-text-big") +
    text(20, 290, `v = ${fmtUnit(num(r, "v"), "m/s", 1)} = ${fmtUnit(num(r, "vKmh"), "km/h", 0)}`, "lab-text lab-text-big") +
    `</svg>`
  );
}

function efficiency(v: LabValues, r: ReadoutValues): string {
  const eta = num(r, "eta");
  const full = 360;
  const useW = full * eta;
  const lossW = full - useW;
  return (
    open("Energiefluss: zugeführte Energie teilt sich in Nutzenergie und Verluste") +
    text(20, 50, `zugeführt E_zu = ${fmtUnit(v.Ezu, "kJ", 1)}`, "lab-text") +
    `<rect x="20" y="60" width="${full}" height="40" class="lab-bar-in" />` +
    `<path d="M${20 + full} 60 L420 60 L420 100 L${20 + full} 100 Z" class="lab-bar-in" />` +
    // split
    `<path d="M20 130 H${r1(20 + useW)} V170 H20 Z" class="lab-bar-kin" />` +
    `<path d="M${r1(20 + useW + 10)} 130 H${r1(20 + useW + 10 + lossW)} V170 H${r1(20 + useW + 10)} Z" class="lab-bar-loss" />` +
    text(20, 192, `Nutzenergie ${fmtUnit(num(r, "Enutz"), "kJ", 1)} (${fmt(eta * 100, 0)} %)`, "lab-text") +
    text(20 + useW + 10, 212, `Verluste, meist Wärme: ${fmtUnit(num(r, "Everlust"), "kJ", 1)}`, "lab-text-muted") +
    text(20, 260, `η = E_nutz / E_zu = ${fmt(eta, 2)} = ${fmt(eta * 100, 0)} %`, "lab-text lab-text-big") +
    `</svg>`
  );
}

// ─── Stage 3: Wärmelehre ──────────────────────────────────────────────────

function temperatureParticles(v: LabValues, r: ReadoutValues): string {
  const T = num(r, "T");
  const speed = Math.sqrt(Math.max(T, 0) / 300) * 22;
  let particles = "";
  for (let i = 0; i < 18; i++) {
    const px = 70 + jitter(i, 3) * 280;
    const py = 80 + jitter(i, 4) * 150;
    const ang = jitter(i, 5) * Math.PI * 2;
    particles += `<circle cx="${r1(px)}" cy="${r1(py)}" r="6" class="lab-particle" />`;
    if (speed > 0.5) {
      particles += arrow(px, py, px + Math.cos(ang) * speed, py + Math.sin(ang) * speed, "lab-velocity", 2);
    }
  }
  const fill = clamp((v.theta + 273.15) / 773, 0, 1);
  const tubeTop = 60;
  const tubeBottom = 240;
  const level = tubeBottom - (tubeBottom - tubeTop) * fill;
  return (
    open("Teilchen in einem Kasten bewegen sich umso schneller, je höher die Temperatur ist") +
    `<rect x="60" y="60" width="300" height="190" class="lab-wall" fill="none" />` +
    particles +
    // thermometer
    `<rect x="430" y="${tubeTop}" width="18" height="${tubeBottom - tubeTop}" rx="9" class="lab-tube" />` +
    `<rect x="430" y="${r1(level)}" width="18" height="${r1(tubeBottom - level)}" rx="9" style="fill:${heatColor(v.theta, -273, 500)}" />` +
    `<circle cx="439" cy="${tubeBottom + 14}" r="16" style="fill:${heatColor(v.theta, -273, 500)}" />` +
    text(439, 40, `${fmt(v.theta, 0)} °C`, "lab-text lab-text-big", "middle") +
    text(470, 110, `${fmt(T, 1)} K`, "lab-text") +
    text(20, 285, `Temperatur ist ein Maß für die mittlere Bewegungsenergie der Teilchen: ${str(r, "example")}`, "lab-text-muted") +
    `</svg>`
  );
}

function heating(v: LabValues, r: ReadoutValues): string {
  const theta = num(r, "theta");
  const boiling = theta >= 99.95;
  const waterTop = 110;
  const waterBottom = 230;
  const fill = clamp(v.m / 3, 0.15, 1);
  const top = waterBottom - (waterBottom - waterTop) * fill;
  // temperature curve: from theta0 at t=0 to theta at t (clipped at 100)
  const cx0 = 330;
  const cy0 = 240;
  const cw = 170;
  const ch = 160;
  const tMax = 600;
  const thetaPx = (th: number) => cy0 - (clamp(th, 0, 100) / 100) * ch;
  const tPx = (t: number) => cx0 + (t / tMax) * cw;
  const tBoil = num(r, "tBoil");
  let path = `M${r1(tPx(0))} ${r1(thetaPx(v.theta0))}`;
  if (boiling && Number.isFinite(tBoil) && tBoil < v.t) {
    path += ` L${r1(tPx(tBoil))} ${r1(thetaPx(100))} L${r1(tPx(v.t))} ${r1(thetaPx(100))}`;
  } else {
    path += ` L${r1(tPx(v.t))} ${r1(thetaPx(theta))}`;
  }
  const steam = boiling
    ? `<path d="M120 95 q6 -12 0 -24 M150 95 q6 -12 0 -24 M180 95 q6 -12 0 -24" class="lab-steam" />`
    : "";
  return (
    open("Wasserkocher mit Thermometer und Temperaturkurve") +
    `<rect x="80" y="${r1(top)}" width="160" height="${r1(waterBottom - top)}" style="fill:${heatColor(theta)}" class="lab-water-fill" />` +
    `<path d="M80 100 V240 H240 V100" class="lab-wall" />` +
    `<rect x="70" y="240" width="180" height="14" rx="3" class="lab-heater" style="opacity:${clamp(v.P / 3000, 0.15, 1).toFixed(2)}" />` +
    steam +
    text(160, 275, `P = ${fmtUnit(v.P, "W", 0)} · t = ${fmtUnit(v.t, "s", 0)} → Q = ${fmtUnit(num(r, "Q") / 1000, "kJ", 1)}`, "lab-text", "middle") +
    // chart
    `<line x1="${cx0}" y1="${cy0}" x2="${cx0 + cw}" y2="${cy0}" class="lab-axis" />` +
    `<line x1="${cx0}" y1="${cy0}" x2="${cx0}" y2="${cy0 - ch}" class="lab-axis" />` +
    `<line x1="${cx0}" y1="${r1(thetaPx(100))}" x2="${cx0 + cw}" y2="${r1(thetaPx(100))}" class="lab-grid" />` +
    text(cx0 - 6, thetaPx(100) + 4, "100 °C", "lab-text-small", "end") +
    text(cx0 - 6, cy0 + 4, "0 °C", "lab-text-small", "end") +
    text(cx0 + cw, cy0 + 16, `${tMax} s`, "lab-text-small", "end") +
    `<path d="${path}" class="lab-curve" />` +
    `<circle cx="${r1(tPx(v.t))}" cy="${r1(thetaPx(theta))}" r="5" class="lab-marker" />` +
    text(20, 40, `ϑ = ${fmt(v.theta0, 0)} °C + Δϑ ${fmt(num(r, "dtheta"), 1)} K → ${fmt(theta, 1)} °C${boiling ? " (kocht)" : ""}`, "lab-text lab-text-big") +
    text(20, 64, `Δϑ = Q / (c · m) mit c = 4,19 kJ/(kg·K), m = ${fmtUnit(v.m, "kg", 2)}`, "lab-text-muted") +
    `</svg>`
  );
}

function mixing(v: LabValues, r: ReadoutValues): string {
  const tm = num(r, "tm");
  const beaker = (x: number, m: number, theta: number, label: string) => {
    const h = 20 + (m / 5) * 100;
    return (
      `<rect x="${x}" y="${r1(230 - h)}" width="90" height="${r1(h)}" style="fill:${heatColor(theta)}" class="lab-water-fill" />` +
      `<path d="M${x} 100 V230 H${x + 90} V100" class="lab-wall" />` +
      text(x + 45, 255, label, "lab-text", "middle")
    );
  };
  return (
    open("Zwei Wassermengen werden gemischt") +
    beaker(40, v.m1, v.t1, `${fmtUnit(v.m1, "kg", 1)} · ${fmt(v.t1, 0)} °C`) +
    beaker(160, v.m2, v.t2, `${fmtUnit(v.m2, "kg", 1)} · ${fmt(v.t2, 0)} °C`) +
    arrow(270, 170, 320, 170, "lab-axis", 3) +
    beaker(340, Math.min(v.m1 + v.m2, 5), tm, `${fmtUnit(v.m1 + v.m2, "kg", 1)} · ${fmt(tm, 1)} °C`) +
    text(20, 40, `Mischtemperatur ϑ_m = ${fmt(tm, 1)} °C`, "lab-text lab-text-big") +
    text(20, 64, `Das warme Wasser gibt ${fmtUnit(num(r, "Q") / 1000, "kJ", 1)} ab, das kalte nimmt sie auf.`, "lab-text-muted") +
    `</svg>`
  );
}

function phaseChange(v: LabValues, r: ReadoutValues): string {
  const m = v.m;
  const Q1 = 2100 * m * 20;
  const Q2 = 334_000 * m;
  const Q3 = 4190 * m * 100;
  const Q4 = 2_257_000 * m;
  const Q5 = 2000 * m * 20;
  const total = Q1 + Q2 + Q3 + Q4 + Q5;
  const cx0 = 60;
  const cy0 = 240;
  const cw = 280;
  const ch = 170;
  const qPx = (q: number) => cx0 + (clamp(q, 0, total) / total) * cw;
  const thPx = (th: number) => cy0 - ((th + 20) / 140) * ch;
  const pts = [
    [0, -20],
    [Q1, 0],
    [Q1 + Q2, 0],
    [Q1 + Q2 + Q3, 100],
    [Q1 + Q2 + Q3 + Q4, 100],
    [total, 120],
  ];
  const path = pts
    .map(([q, th], i) => `${i === 0 ? "M" : "L"}${r1(qPx(q))} ${r1(thPx(th))}`)
    .join(" ");
  const Q = v.Q * 1000;
  const theta = num(r, "theta");
  const phase = str(r, "phase");
  const icon =
    phase === "Eis" ? "🧊" : phase === "Dampf" ? "♨️" : phase.includes("Eis") ? "🧊💧" : "💧";
  return (
    open("Erwärmungskurve von Eis über Wasser zu Dampf") +
    `<line x1="${cx0}" y1="${cy0}" x2="${cx0 + cw}" y2="${cy0}" class="lab-axis" />` +
    `<line x1="${cx0}" y1="${cy0}" x2="${cx0}" y2="${cy0 - ch}" class="lab-axis" />` +
    text(cx0 - 6, thPx(0) + 4, "0 °C", "lab-text-small", "end") +
    text(cx0 - 6, thPx(100) + 4, "100 °C", "lab-text-small", "end") +
    text(cx0 - 6, thPx(-20) + 4, "−20 °C", "lab-text-small", "end") +
    text(cx0 + cw, cy0 + 16, "zugeführte Energie Q →", "lab-text-small", "end") +
    `<path d="${path}" class="lab-curve" />` +
    text((qPx(Q1) + qPx(Q1 + Q2)) / 2, thPx(0) - 8, "schmilzt", "lab-text-small", "middle") +
    text((qPx(Q1 + Q2 + Q3) + qPx(total - Q5)) / 2, thPx(100) - 8, "siedet", "lab-text-small", "middle") +
    `<circle cx="${r1(qPx(Q))}" cy="${r1(thPx(clamp(theta, -20, 120)))}" r="6" class="lab-marker" />` +
    `<text x="430" y="150" class="lab-emoji" text-anchor="middle">${icon}</text>` +
    text(430, 190, phase, "lab-text", "middle") +
    text(430, 214, `${fmt(theta, 1)} °C`, "lab-text lab-text-big", "middle") +
    text(20, 36, `Q = ${fmtUnit(v.Q, "kJ", 0)} für m = ${fmtUnit(m, "kg", 2)}: ${str(r, "stage")}`, "lab-text") +
    text(20, 285, `Schmelzen braucht ${fmtUnit(num(r, "Qmelt"), "kJ", 0)}, Verdampfen ${fmtUnit(num(r, "Qvap"), "kJ", 0)}`, "lab-text-muted") +
    `</svg>`
  );
}

function waterAnomaly(v: LabValues, r: ReadoutValues): string {
  const cx0 = 60;
  const cy0 = 240;
  const cw = 260;
  const ch = 170;
  const rhoOf = (th: number) =>
    999.84 + 0.0675 * th - 0.00894 * th * th + 0.0000869 * th * th * th;
  const xPx = (th: number) => cx0 + (th / 40) * cw;
  const yPx = (rho: number) => cy0 - ((rho - 992) / 8.5) * ch;
  let path = "";
  for (let th = 0; th <= 40; th += 0.5) {
    path += `${th === 0 ? "M" : "L"}${r1(xPx(th))} ${r1(yPx(rhoOf(th)))} `;
  }
  const layers = ["Eis 0 °C", "1 °C", "2 °C", "3 °C", "4 °C"];
  let lake = "";
  layers.forEach((label, i) => {
    const y = 110 + i * 28;
    lake +=
      `<rect x="360" y="${y}" width="140" height="28" class="${i === 0 ? "lab-ice" : "lab-fluid"}" style="opacity:${(0.5 + i * 0.12).toFixed(2)}" />` +
      text(430, y + 19, label, "lab-text-small", "middle");
  });
  return (
    open("Dichte von Wasser in Abhängigkeit von der Temperatur und ein See im Winter") +
    `<line x1="${cx0}" y1="${cy0}" x2="${cx0 + cw}" y2="${cy0}" class="lab-axis" />` +
    `<line x1="${cx0}" y1="${cy0}" x2="${cx0}" y2="${cy0 - ch}" class="lab-axis" />` +
    text(cx0 + cw, cy0 + 16, "40 °C", "lab-text-small", "end") +
    text(cx0, cy0 + 16, "0 °C", "lab-text-small", "middle") +
    text(cx0 - 6, yPx(1000) + 4, "1000", "lab-text-small", "end") +
    text(cx0 - 6, yPx(995) + 4, "995", "lab-text-small", "end") +
    text(cx0 - 6, 60, "ρ in kg/m³", "lab-text-small", "end") +
    `<path d="${path}" class="lab-curve" />` +
    `<line x1="${r1(xPx(4))}" y1="${cy0}" x2="${r1(xPx(4))}" y2="${r1(yPx(rhoOf(4)))}" class="lab-grid" />` +
    `<circle cx="${r1(xPx(v.theta))}" cy="${r1(yPx(rhoOf(v.theta)))}" r="6" class="lab-marker" />` +
    text(xPx(v.theta) + 10, yPx(rhoOf(v.theta)) - 8, `${fmt(v.theta, 1)} °C: ${fmt(num(r, "rho"), 2)} kg/m³`, "lab-text") +
    lake +
    text(430, 100, "See im Winter", "lab-text-muted", "middle") +
    text(20, 36, `Wasser ist bei 4 °C am dichtesten (Anomalie des Wassers).`, "lab-text lab-text-big") +
    `</svg>`
  );
}

function gasLaw(v: LabValues, r: ReadoutValues): string {
  const T = num(r, "T");
  const p = num(r, "p");
  const barrelBottom = 250;
  const gasH = 20 + (v.V / 10) * 160;
  const top = barrelBottom - gasH;
  const speed = Math.sqrt(Math.max(T, 1) / 300) * 16;
  let particles = "";
  for (let i = 0; i < 16; i++) {
    const px = 110 + jitter(i, 6) * 140;
    const py = top + 10 + jitter(i, 7) * (gasH - 20);
    const ang = jitter(i, 8) * Math.PI * 2;
    particles +=
      `<circle cx="${r1(px)}" cy="${r1(py)}" r="4" class="lab-particle" />` +
      arrow(px, py, px + Math.cos(ang) * speed, py + Math.sin(ang) * speed, "lab-velocity", 2);
  }
  const gaugeAngle = -120 + clamp(p / 3000, 0, 1) * 240;
  return (
    open("Gas in einem Zylinder mit Kolben, Thermometer und Manometer") +
    `<rect x="100" y="${r1(top)}" width="160" height="${r1(gasH)}" class="lab-gas" style="opacity:${clamp(p / 3000, 0.15, 1).toFixed(2)}" />` +
    `<path d="M100 60 V250 H260 V60" class="lab-wall" />` +
    `<rect x="100" y="${r1(top - 10)}" width="160" height="10" class="lab-block" />` +
    `<rect x="174" y="${r1(top - 40)}" width="12" height="30" class="lab-block" />` +
    particles +
    text(180, 275, `V = ${fmtUnit(v.V, "L", 1)}`, "lab-text", "middle") +
    // gauge
    `<circle cx="400" cy="120" r="50" class="lab-clock" />` +
    `<line x1="400" y1="120" x2="${r1(400 + 40 * Math.sin((gaugeAngle * Math.PI) / 180))}" y2="${r1(120 - 40 * Math.cos((gaugeAngle * Math.PI) / 180))}" class="lab-needle" />` +
    text(400, 190, `p = ${fmtUnit(p, "hPa", 0)}`, "lab-text lab-text-big", "middle") +
    text(400, 230, `T = ${fmt(v.theta, 0)} °C = ${fmt(T, 1)} K`, "lab-text", "middle") +
    text(20, 36, `p · V / T = ${fmt(num(r, "pvT"), 3)} hPa · L / K bleibt konstant`, "lab-text lab-text-big") +
    `</svg>`
  );
}

// ─── Stage 4: Elektrizitätslehre ──────────────────────────────────────────

function electromagnet(v: LabValues, r: ReadoutValues): string {
  const strength = clamp(num(r, "strength"), 0, 1);
  const clips = Math.min(Math.round(num(r, "clips")), 24);
  const north = str(r, "northSide");
  const turns = clamp(Math.round(v.N / 60), 3, 18);
  let coil = "";
  for (let i = 0; i < turns; i++) {
    const x = 150 + (i * 200) / turns;
    coil += `<ellipse cx="${r1(x)}" cy="150" rx="7" ry="34" class="lab-coil" />`;
  }
  let field = "";
  for (let i = 1; i <= 3; i++) {
    field += `<ellipse cx="250" cy="150" rx="${140 + i * 30}" ry="${50 + i * 24}" class="lab-field" style="opacity:${(strength * (1 - i * 0.22)).toFixed(2)}" />`;
  }
  let clipShapes = "";
  for (let i = 0; i < clips; i++) {
    const x = (north === "links" ? 380 : 90) + (i % 6) * 10;
    const y = 200 + Math.floor(i / 6) * 14;
    clipShapes += `<rect x="${x}" y="${y}" width="4" height="12" rx="2" class="lab-clip" />`;
  }
  return (
    open("Spule mit Eisenkern, Feldlinien und angezogenen Büroklammern") +
    field +
    (v.core === 1
      ? `<rect x="120" y="134" width="260" height="32" rx="4" class="lab-core" />`
      : "") +
    coil +
    `<line x1="150" y1="184" x2="100" y2="240" class="lab-wire" /><line x1="${r1(150 + ((turns - 1) * 200) / turns)}" y1="184" x2="400" y2="240" class="lab-wire" />` +
    text(250, 262, `Stromstärke I = ${fmtUnit(v.I, "A", 1)} · ${fmt(v.N, 0)} Windungen`, "lab-text", "middle") +
    text(96, 120, north === "links" ? "N" : "S", "lab-pole-text", "middle") +
    text(404, 120, north === "links" ? "S" : "N", "lab-pole-text", "middle") +
    clipShapes +
    text(20, 36, `Durchflutung N · I = ${fmtUnit(num(r, "NI"), "A", 0)}${v.core === 1 ? " mit Eisenkern" : " ohne Eisenkern"}`, "lab-text lab-text-big") +
    text(20, 60, `Modell: hält etwa ${fmt(num(r, "clips"), 0)} Büroklammern`, "lab-text-muted") +
    `</svg>`
  );
}

function lorentz(v: LabValues, r: ReadoutValues): string {
  const dir = str(r, "dir");
  const F = clamp(num(r, "F"), 0, 1);
  const northLeft = v.b === 0;
  const electronsIn = v.e === 0;
  const fieldArrows = [100, 140, 180, 220].map((y) =>
    northLeft ? arrow(150, y, 370, y, "lab-field-arrow", 2) : arrow(370, y, 150, y, "lab-field-arrow", 2),
  );
  const len = 30 + F * 90;
  const forceArrow =
    dir === "nach oben"
      ? arrow(260, 160, 260, 160 - len, "lab-force", 5)
      : dir === "nach unten"
        ? arrow(260, 160, 260, 160 + len, "lab-force", 5)
        : "";
  const symbol = electronsIn
    ? `<line x1="250" y1="150" x2="270" y2="170" class="lab-wire" /><line x1="270" y1="150" x2="250" y2="170" class="lab-wire" />`
    : `<circle cx="260" cy="160" r="4" class="lab-wire-dot" />`;
  return (
    open("Leiter im Magnetfeld zwischen Nordpol und Südpol mit Kraftpfeil") +
    `<rect x="60" y="80" width="80" height="160" rx="4" class="${northLeft ? "lab-pole-n" : "lab-pole-s"}" />` +
    `<rect x="380" y="80" width="80" height="160" rx="4" class="${northLeft ? "lab-pole-s" : "lab-pole-n"}" />` +
    text(100, 168, northLeft ? "N" : "S", "lab-pole-text", "middle") +
    text(420, 168, northLeft ? "S" : "N", "lab-pole-text", "middle") +
    fieldArrows.join("") +
    `<circle cx="260" cy="160" r="16" class="lab-conductor" />` +
    symbol +
    forceArrow +
    text(284, 176, electronsIn ? "Elektronen in den Bildschirm hinein ⊗" : "Elektronen aus dem Bildschirm heraus ⊙", "lab-text-small") +
    text(20, 36, `Kraft auf den Leiter: ${dir}${v.I === 0 ? " (kein Strom)" : ""}`, "lab-text lab-text-big") +
    text(20, 60, `Magnetfeld zeigt vom Nordpol zum Südpol (${northLeft ? "nach rechts" : "nach links"}), I = ${fmtUnit(v.I, "A", 1)}`, "lab-text-muted") +
    text(260, 280, "UVW-Regel der linken Hand: Daumen Ursache (Elektronenstrom), Zeigefinger Vermittlung (Feld), Mittelfinger Wirkung (Kraft)", "lab-text-small", "middle") +
    `</svg>`
  );
}

function electricPower(v: LabValues, r: ReadoutValues): string {
  const P = num(r, "P");
  const W_ = num(r, "W");
  const glow = clamp(P / 3000, 0.1, 1);
  return (
    open("Ein Gerät am Stromnetz mit Zähler für die elektrische Energie") +
    `<rect x="60" y="100" width="70" height="90" rx="8" class="lab-socket" />` +
    `<circle cx="84" cy="145" r="6" class="lab-socket-hole" /><circle cx="106" cy="145" r="6" class="lab-socket-hole" />` +
    `<path d="M130 145 H200" class="lab-wire" />` +
    `<rect x="200" y="90" width="140" height="110" rx="10" class="lab-device" style="opacity:${glow.toFixed(2)}" />` +
    text(270, 138, `${fmtUnit(v.U, "V", 0)}`, "lab-text", "middle") +
    text(270, 162, `${fmtUnit(v.I, "A", 2)}`, "lab-text", "middle") +
    text(270, 220, `P = U · I = ${fmtUnit(P, "W", 0)}`, "lab-text lab-text-big", "middle") +
    `<rect x="380" y="90" width="120" height="110" rx="6" class="lab-meter" />` +
    text(440, 116, "Zähler", "lab-text-muted", "middle") +
    text(440, 146, `${fmt(W_, 3)} kWh`, "lab-text lab-text-big", "middle") +
    text(440, 176, `${fmt(num(r, "cost"), 2)} €`, "lab-text", "middle") +
    text(20, 36, `W = P · t = ${fmtUnit(P, "W", 0)} · ${fmtUnit(v.t, "h", 1)} = ${fmtUnit(W_, "kWh", 3)}`, "lab-text lab-text-big") +
    text(20, 60, `Preis ${fmt(v.price, 0)} ct pro kWh`, "lab-text-muted") +
    `</svg>`
  );
}

function characteristic(v: LabValues, r: ReadoutValues): string {
  const I = num(r, "I");
  const isLamp = v.device === 1;
  const cx0 = 70;
  const cy0 = 250;
  const cw = 260;
  const ch = 180;
  const uMax = 12;
  const iMax = Math.max((uMax / v.R) * 1.15, 0.01);
  const xPx = (u: number) => cx0 + (u / uMax) * cw;
  const yPx = (i: number) => cy0 - clamp(i / iMax, 0, 1) * ch;
  const currentAt = (u: number) =>
    isLamp ? u / (v.R * (1 + (1.5 * u) / 12)) : u / v.R;
  let path = "";
  for (let u = 0; u <= uMax + 1e-9; u += 0.5) {
    path += `${u === 0 ? "M" : "L"}${r1(xPx(u))} ${r1(yPx(currentAt(u)))} `;
  }
  return (
    open("U-I-Kennlinie eines Leiters mit Messpunkt") +
    `<line x1="${cx0}" y1="${cy0}" x2="${cx0 + cw}" y2="${cy0}" class="lab-axis" />` +
    `<line x1="${cx0}" y1="${cy0}" x2="${cx0}" y2="${cy0 - ch}" class="lab-axis" />` +
    text(cx0 + cw, cy0 + 16, "U in V →", "lab-text-small", "end") +
    text(cx0 - 6, cy0 - ch + 4, "I in A", "lab-text-small", "end") +
    text(xPx(12), cy0 + 16, "12", "lab-text-small", "middle") +
    text(xPx(6), cy0 + 16, "6", "lab-text-small", "middle") +
    text(cx0 - 6, yPx(iMax / 1.15) + 4, fmt(iMax / 1.15, 2), "lab-text-small", "end") +
    `<path d="${path}" class="lab-curve" />` +
    `<circle cx="${r1(xPx(v.U))}" cy="${r1(yPx(I))}" r="6" class="lab-marker" />` +
    `<line x1="${r1(xPx(v.U))}" y1="${cy0}" x2="${r1(xPx(v.U))}" y2="${r1(yPx(I))}" class="lab-grid" />` +
    `<line x1="${cx0}" y1="${r1(yPx(I))}" x2="${r1(xPx(v.U))}" y2="${r1(yPx(I))}" class="lab-grid" />` +
    // circuit sketch
    `<rect x="370" y="90" width="120" height="70" rx="6" class="lab-wall" fill="none" />` +
    (isLamp
      ? `<circle cx="430" cy="90" r="12" class="lab-wall" fill="none" /><line x1="421" y1="81" x2="439" y2="99" class="lab-wall" /><line x1="439" y1="81" x2="421" y2="99" class="lab-wall" />`
      : `<rect x="410" y="82" width="40" height="16" class="lab-wall" fill="none" />`) +
    text(430, 180, isLamp ? "Glühlampe" : "Metallwiderstand (ϑ konstant)", "lab-text-small", "middle") +
    text(20, 36, `U = ${fmtUnit(v.U, "V", 1)} → I = ${fmtUnit(I, "A", 3)}`, "lab-text lab-text-big") +
    text(20, 60, `R = U / I = ${fmtUnit(num(r, "Reff"), "Ω", 1)}${isLamp ? " (steigt mit der Temperatur)" : " (konstant: Gesetz von Ohm)"}`, "lab-text-muted") +
    `</svg>`
  );
}

function resistanceWire(v: LabValues, r: ReadoutValues): string {
  const length = 60 + Math.log10(v.l / 0.1) * 110;
  const thick = 2 + Math.sqrt(v.A) * 6;
  const matClass = ["lab-wire-cu", "lab-wire-al", "lab-wire-fe", "lab-wire-konst"][v.mat] ?? "lab-wire-cu";
  const x0 = 70;
  return (
    open("Ein Draht zwischen zwei Klemmen, ein Ohmmeter zeigt den Widerstand") +
    `<rect x="40" y="130" width="30" height="40" rx="4" class="lab-block" />` +
    `<rect x="${r1(x0 + length)}" y="130" width="30" height="40" rx="4" class="lab-block" />` +
    `<rect x="${x0}" y="${r1(150 - thick / 2)}" width="${r1(length)}" height="${r1(thick)}" rx="${r1(thick / 2)}" class="${matClass}" />` +
    text(x0 + length / 2, 200, `l = ${fmtUnit(v.l, "m", 1)}`, "lab-text", "middle") +
    text(x0 + length / 2, 222, `A = ${fmtUnit(v.A, "mm²", 2)}`, "lab-text", "middle") +
    `<rect x="380" y="60" width="120" height="70" rx="6" class="lab-meter" />` +
    text(440, 86, "Ω", "lab-text-muted", "middle") +
    text(440, 114, fmt(num(r, "R"), 3), "lab-text lab-text-big", "middle") +
    text(20, 36, `R = ρ · l / A = ${fmtUnit(num(r, "R"), "Ω", 3)}`, "lab-text lab-text-big") +
    text(20, 60, `ρ = ${fmt(num(r, "rho"), 4)} Ω·mm²/m (${str(r, "material")})`, "lab-text-muted") +
    `</svg>`
  );
}

function semiconductor(v: LabValues, r: ReadoutValues): string {
  const cx0 = 70;
  const cy0 = 250;
  const cw = 280;
  const ch = 180;
  let path = "";
  let marker = "";
  let xLabel = "";
  let yLabel = "";
  if (v.dev === 0) {
    // NTC: R over temperature 0..100 °C, R in kΩ 0..30
    const R = (th: number) => 10 * Math.exp(3500 * (1 / (th + 273.15) - 1 / 298.15));
    for (let th = 0; th <= 100; th += 2) {
      path += `${th === 0 ? "M" : "L"}${r1(cx0 + (th / 100) * cw)} ${r1(cy0 - clamp(R(th) / 30, 0, 1) * ch)} `;
    }
    marker = `<circle cx="${r1(cx0 + (v.theta / 100) * cw)}" cy="${r1(cy0 - clamp(num(r, "RN") / 30, 0, 1) * ch)}" r="6" class="lab-marker" />`;
    xLabel = "ϑ in °C (0 … 100) →";
    yLabel = "R in kΩ (0 … 30)";
  } else if (v.dev === 1) {
    // LDR: R over illuminance 1..1000 lx (log axis), R in kΩ 0..500
    const R = (E: number) => 100 * (E / 10) ** -0.7;
    for (let k = 0; k <= 60; k++) {
      const E = 10 ** (k / 20);
      path += `${k === 0 ? "M" : "L"}${r1(cx0 + (k / 60) * cw)} ${r1(cy0 - clamp(R(E) / 500, 0, 1) * ch)} `;
    }
    marker = `<circle cx="${r1(cx0 + (Math.log10(v.E) / 3) * cw)}" cy="${r1(cy0 - clamp(num(r, "RL") / 500, 0, 1) * ch)}" r="6" class="lab-marker" />`;
    xLabel = "Beleuchtungsstärke in lx (1 … 1000, logarithmisch) →";
    yLabel = "R in kΩ (0 … 500)";
  } else {
    // Diode: I over U −5 … 0.9 V, I in mA 0..60
    const I = (u: number) => (u < 0 ? 0 : 1e-8 * (Math.exp(u / 0.04) - 1));
    for (let u = -5; u <= 0.9 + 1e-9; u += 0.05) {
      path += `${u === -5 ? "M" : "L"}${r1(cx0 + ((u + 5) / 5.9) * cw)} ${r1(cy0 - clamp(I(u) / 60, 0, 1) * ch)} `;
    }
    marker = `<circle cx="${r1(cx0 + ((v.U + 5) / 5.9) * cw)}" cy="${r1(cy0 - clamp(num(r, "ID") / 60, 0, 1) * ch)}" r="6" class="lab-marker" />`;
    xLabel = "U in V (−5 … 0,9) →";
    yLabel = "I in mA (0 … 60)";
  }
  return (
    open("Kennlinie eines Halbleiterbauteils mit Messpunkt") +
    `<line x1="${cx0}" y1="${cy0}" x2="${cx0 + cw}" y2="${cy0}" class="lab-axis" />` +
    `<line x1="${cx0}" y1="${cy0}" x2="${cx0}" y2="${cy0 - ch}" class="lab-axis" />` +
    text(cx0 + cw, cy0 + 18, xLabel, "lab-text-small", "end") +
    text(cx0 + 6, cy0 - ch + 4, yLabel, "lab-text-small") +
    `<path d="${path}" class="lab-curve" />` +
    marker +
    text(20, 36, str(r, "active"), "lab-text lab-text-big") +
    text(430, 120, v.dev === 0 ? "NTC" : v.dev === 1 ? "LDR" : "Diode", "lab-pole-text", "middle") +
    text(430, 150, v.dev === 0 ? "Heißleiter" : v.dev === 1 ? "Fotowiderstand" : "Si-Halbleiterdiode", "lab-text-small", "middle") +
    `</svg>`
  );
}

const RENDERERS: Record<LabDefinition["kind"], (v: LabValues, r: ReadoutValues) => string> = {
  "pressure-stamp": pressureStamp,
  "hydraulic-press": hydraulicPress,
  hydrostatic,
  buoyancy,
  boyle,
  "inclined-plane": inclinedPlane,
  "work-power": workPower,
  "energy-ramp": energyRamp,
  efficiency,
  "temperature-particles": temperatureParticles,
  heating,
  mixing,
  "phase-change": phaseChange,
  "water-anomaly": waterAnomaly,
  "gas-law": gasLaw,
  electromagnet,
  lorentz,
  "electric-power": electricPower,
  characteristic,
  "resistance-wire": resistanceWire,
  semiconductor,
};

export function renderLabVisual(
  lab: LabDefinition,
  values: LabValues,
  readouts: ReadoutValues,
): string {
  return RENDERERS[lab.kind](values, readouts);
}
