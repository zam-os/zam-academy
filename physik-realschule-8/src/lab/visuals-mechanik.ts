import { fmt, fmtUnit } from "../exercises/format";
import type { LabKind, LabValues, ReadoutValues } from "../model/types";
import {
  arrow,
  CLOSE,
  circle,
  clamp,
  DEG,
  jitter,
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
import { F_ELASTIC, springExtension } from "./physics";

type Renderer = (v: LabValues, r: ReadoutValues) => string;

// ─── 1.1 Länge messen ─────────────────────────────────────────────────────

function measureLength(v: LabValues, r: ReadoutValues): string {
  const x0 = 30;
  const ppc = 23; // pixels per cm: 20 cm fill the width
  const L = v.L;
  const scale = v.scale;
  const reading = num(r, "reading");
  const dx = num(r, "dx");
  let ticks = "";
  const n = Math.round(20 / scale);
  for (let i = 0; i <= n; i++) {
    const cm = i * scale;
    const x = x0 + cm * ppc;
    const wholeCm = Math.abs(cm - Math.round(cm)) < 1e-6;
    const half = Math.abs(cm * 2 - Math.round(cm * 2)) < 1e-6;
    const len = wholeCm ? 22 : half ? 15 : 10;
    ticks += line(x, 170, x, 170 + len, "lab-axis");
  }
  let labels = "";
  for (let cm = 0; cm <= 20; cm += 2) labels += text(x0 + cm * ppc, 208, String(cm), "lab-text-small", "middle");
  const endX = x0 + L * ppc;
  const readX = x0 + reading * ppc;
  return (
    open("Ein Gegenstand liegt an einem Lineal, sein rechtes Ende wird abgelesen") +
    rect(x0, 110, L * ppc, 34, "lab-crate") +
    line(endX, 144, endX, 170, "lab-normal") +
    rect(x0, 170, 20 * ppc, 34, "lab-ground", 'style="opacity:0.55"') +
    ticks +
    labels +
    text(x0 + 20 * ppc, 226, "cm", "lab-text-small", "end") +
    rect(readX - dx * ppc, 160, 2 * dx * ppc, 10, "lab-pressure", 'style="opacity:0.45"') +
    polygon([[readX, 172], [readX - 6, 160], [readX + 6, 160]], "lab-marker") +
    text(20, 36, `Messwert: ${fmt(reading, 1)} cm ± ${fmt(dx, 2)} cm`, "lab-text lab-text-big") +
    text(20, 60, `relativer Fehler Δx / x = ${fmt(num(r, "rel"), 1)} %`, "lab-text-muted") +
    text(20, 270, "Roter Balken: Bereich, in dem der wahre Wert liegen kann.", "lab-text-small") +
    CLOSE
  );
}

// ─── 1.2 Gleichförmige Bewegung ───────────────────────────────────────────

function uniformMotion(v: LabValues, r: ReadoutValues): string {
  const s = num(r, "s");
  const options = [50, 100, 200, 400, 800];
  const R = options.find((o) => o >= s) ?? 800;
  const carX = 30 + (s / R) * 400;
  const x0 = 70;
  const y0 = 262;
  const cw = 420;
  const ch = 120;
  const tx = x0 + (v.t / 20) * cw;
  const yMax = [100, 200, 400, 800].find((o) => o >= v.v * 20) ?? 800;
  const sy = y0 - (s / yMax) * ch;
  const endY = y0 - clamp((v.v * 20) / yMax, 0, 1) * ch;
  return (
    open("Ein Auto fährt eine Strecke, darunter das Weg-Zeit-Diagramm") +
    rect(30, 52, 440, 22, "lab-ground") +
    line(30, 63, 470, 63, "lab-grid") +
    rect(carX, 40, 36, 14, "lab-crate") +
    circle(carX + 8, 56, 5, "lab-block") +
    circle(carX + 28, 56, 5, "lab-block") +
    text(30, 94, "0 m", "lab-text-small") +
    text(470, 94, `${fmt(R, 0)} m`, "lab-text-small", "end") +
    text(20, 24, `s = v · t = ${fmtUnit(s, "m", 1)}`, "lab-text lab-text-big") +
    // diagram
    line(x0, y0, x0 + cw, y0, "lab-axis") +
    line(x0, y0, x0, y0 - ch - 8, "lab-axis") +
    text(x0 + cw, y0 + 16, "t in s (0 … 20)", "lab-text-small", "end") +
    text(x0 + 4, y0 - ch - 12, `s in m (0 … ${fmt(yMax, 0)})`, "lab-text-small") +
    path(`M${x0} ${y0} L${x0 + cw} ${r1(endY)}`, "lab-curve") +
    line(tx, y0, tx, sy, "lab-normal") +
    line(x0, sy, tx, sy, "lab-normal") +
    circle(tx, sy, 6, "lab-marker") +
    text(470, 24, `v = ${fmtUnit(v.v, "m/s", 0)} = ${fmtUnit(num(r, "kmh"), "km/h", 1)}`, "lab-text-muted", "end") +
    CLOSE
  );
}

// ─── 1.3 Kraftpfeil ───────────────────────────────────────────────────────

function forceArrow(v: LabValues, r: ReadoutValues): string {
  const cx = 260;
  const cy = 236;
  const lenCm = num(r, "len");
  const pxPerCm = 22;
  const lenPx = lenCm * pxPerCm;
  const ux = Math.cos(v.dir * DEG);
  const uy = -Math.sin(v.dir * DEG);
  const x2 = cx + ux * lenPx;
  const y2 = cy + uy * lenPx;
  let ticks = "";
  for (let i = 1; i <= Math.floor(lenCm); i++) {
    const px = cx + ux * i * pxPerCm;
    const py = cy + uy * i * pxPerCm;
    ticks += line(px - uy * 4, py + ux * 4, px + uy * 4, py - ux * 4, "lab-axis");
  }
  return (
    open("Ein Klotz mit einem Kraftpfeil, der am Angriffspunkt beginnt") +
    rect(40, 261, 440, 10, "lab-ground") +
    rect(cx - 36, cy - 24, 72, 48, "lab-block") +
    arrow(cx, cy, x2, y2, "lab-force", 4) +
    ticks +
    circle(cx, cy, 5, "lab-marker") +
    text(cx + 10, cy + 40, "Angriffspunkt", "lab-text-small") +
    text(20, 30, `F = ${fmtUnit(v.F, "N", 0)}`, "lab-text lab-text-big") +
    text(20, 52, `Maßstab: 1 cm ≙ ${fmtUnit(v.scale, "N", 0)}`, "lab-text-muted") +
    text(20, 72, `Pfeillänge ${fmtUnit(lenCm, "cm", 1)} (Striche: 1 cm)`, "lab-text-muted") +
    CLOSE
  );
}

// ─── 1.4 Wechselwirkung und Gleichgewicht ─────────────────────────────────

function interaction(v: LabValues, r: ReadoutValues): string {
  const len = 30 + (v.F / 200) * 80;
  if (v.case === 0) {
    return (
      open("Eine Hand drückt gegen eine Wand: zwei Kräfte an zwei Körpern") +
      rect(330, 60, 26, 200, "lab-block") +
      text(343, 276, "Wand", "lab-text-muted", "middle") +
      line(40, 160, 176, 160, "lab-wire") +
      circle(196, 160, 20, "lab-crate") +
      text(110, 190, "Hand", "lab-text-muted", "middle") +
      arrow(330 - len, 128, 330, 128, "lab-force", 4) +
      text(326, 116, "Kraft auf die Wand", "lab-text lab-text-force", "end") +
      arrow(330, 205, 330 - len, 205, "lab-force-2", 4) +
      text(326, 226, "Kraft auf die Hand", "lab-text lab-text-force-2", "end") +
      text(20, 30, `${str(r, "kind")}`, "lab-text lab-text-big") +
      text(20, 52, `Beide Kräfte: ${fmtUnit(v.F, "N", 0)}. Sie greifen an verschiedenen Körpern an.`, "lab-text-muted") +
      CLOSE
    );
  }
  const arm = len * 0.6;
  return (
    open("Ein Buch liegt auf dem Tisch: zwei Kräfte am selben Buch") +
    rect(140, 190, 240, 14, "lab-crate") +
    rect(150, 204, 12, 56, "lab-crate") +
    rect(358, 204, 12, 56, "lab-crate") +
    rect(60, 268, 400, 20, "lab-ground") +
    text(260, 283, "Erde", "lab-text-muted", "middle") +
    rect(215, 140, 90, 50, "lab-block") +
    text(260, 130, "Buch", "lab-text", "middle") +
    arrow(240, 165, 240, 165 + arm, "lab-force", 4) +
    text(205, 166, "Gewichtskraft", "lab-text lab-text-force", "end") +
    arrow(285, 190, 285, 190 - arm, "lab-force", 4) +
    text(315, 166, "Stützkraft", "lab-text lab-text-force", "start") +
    arrow(430, 210, 430, 210 + len * 0.4, "lab-force-2", 3) +
    text(500, 262, "Buch drückt auf den Tisch", "lab-text-small", "end") +
    arrow(95, 266, 95, 266 - len * 0.4, "lab-force-2", 3) +
    text(20, 206, "Buch zieht die Erde", "lab-text-small", "start") +
    text(20, 30, `${str(r, "kind")}`, "lab-text lab-text-big") +
    text(20, 52, `Rot: beide am Buch, ${fmtUnit(v.F, "N", 0)} und ${fmtUnit(v.F, "N", 0)}, Summe ${fmtUnit(num(r, "sum"), "N", 0)}. Grün: Partner an anderen Körpern.`, "lab-text-muted") +
    CLOSE
  );
}

// ─── 1.5 Feder und Hooke ──────────────────────────────────────────────────

function spring(v: LabValues, r: ReadoutValues): string {
  const sCm = num(r, "s");
  const pxPerCm = 1.8;
  const top = 32;
  const l0 = 60;
  const bottom = top + l0 + sCm * pxPerCm;
  const cx = 190;
  const coils = 14;
  let d = `M${cx} ${top}`;
  for (let i = 1; i <= coils; i++) {
    const y = top + ((bottom - top) * i) / (coils + 1);
    d += ` L${cx + (i % 2 === 0 ? -16 : 16)} ${r1(y)}`;
  }
  d += ` L${cx} ${r1(bottom)}`;
  // ruler on the left
  let ticks = "";
  for (let cm = 0; cm <= 100; cm += 10) {
    const y = top + l0 + cm * pxPerCm;
    ticks += line(110, y, 122, y, "lab-axis") + text(104, y + 4, String(cm), "lab-text-small", "end");
  }
  // F-s diagram
  const gx = 320;
  const gy = 250;
  const gw = 170;
  const gh = 150;
  let curve = "";
  for (let f = 0; f <= 10.001; f += 0.5) {
    const s = springExtension(f, v.D) * 100;
    curve += `${f === 0 ? "M" : "L"}${r1(gx + clamp(s / 100, 0, 1) * gw)} ${r1(gy - (f / 10) * gh)} `;
  }
  const mx = gx + clamp(sCm / 100, 0, 1) * gw;
  const my = gy - (v.F / 10) * gh;
  const plastic = v.F > F_ELASTIC;
  return (
    open("Eine Schraubenfeder wird gedehnt, daneben das Kraft-Dehnungs-Diagramm") +
    rect(120, top - 10, 150, 8, "lab-block") +
    path(d, "lab-coil") +
    rect(cx - 22, bottom, 44, 28, "lab-crate", plastic ? 'style="stroke:var(--danger);stroke-width:3"' : "") +
    text(cx, bottom + 18, `${fmt(v.F, 1)} N`, "lab-charge-text", "middle") +
    ticks +
    text(104, top + l0 - 8, "cm", "lab-text-small", "end") +
    line(gx, gy, gx + gw, gy, "lab-axis") +
    line(gx, gy, gx, gy - gh - 8, "lab-axis") +
    text(gx + gw, gy + 16, "s (0 … 100 cm)", "lab-text-small", "end") +
    text(gx + 4, gy - gh - 12, "F (0 … 10 N)", "lab-text-small") +
    line(gx, gy - (F_ELASTIC / 10) * gh, gx + gw, gy - (F_ELASTIC / 10) * gh, "lab-grid") +
    text(gx + gw, gy - (F_ELASTIC / 10) * gh - 4, "Elastizitätsgrenze", "lab-text-small", "end") +
    path(curve, "lab-curve") +
    line(mx, gy, mx, my, "lab-normal") +
    circle(mx, my, 6, "lab-marker") +
    text(20, 24, `s = ${fmtUnit(sCm, "cm", 1)}`, "lab-text lab-text-big") +
    text(gx, 24, `Zustand: ${str(r, "state")}`, "lab-text", "start") +
    CLOSE
  );
}

// ─── 1.6 Masse und Gewichtskraft ──────────────────────────────────────────

function placeName(g: number): string {
  if (Math.abs(g - 1.62) < 0.01) return "Mond";
  if (Math.abs(g - 3.71) < 0.01) return "Mars";
  if (Math.abs(g - 24.79) < 0.01) return "Jupiter";
  return "Erde";
}

function weightPlaces(v: LabValues, r: ReadoutValues): string {
  const name = placeName(v.g);
  const radius = name === "Jupiter" ? 62 : name === "Erde" ? 46 : name === "Mars" ? 32 : 26;
  const FG = num(r, "FG");
  const frac = clamp(FG / 2500, 0, 1);
  const pointer = 80 + frac * 130;
  return (
    open("Ein Körper auf der Erde oder einem anderen Himmelskörper, mit Balkenwaage und Kraftmesser") +
    circle(110, 270, radius * 1.6, "lab-ground") +
    rect(88, 270 - radius * 1.6 - 34, 44, 34, "lab-block") +
    text(110, 270 - radius * 1.6 - 12, `${fmt(v.m, 0)} kg`, "lab-on-block", "middle") +
    text(110, 292, name, "lab-text-muted", "middle") +
    // balance beam
    line(230, 130, 330, 130, "lab-axis") +
    line(280, 130, 280, 180, "lab-axis") +
    rect(240, 106, 24, 24, "lab-block") +
    text(252, 122, `${fmt(v.m, 0)}`, "lab-on-block", "middle") +
    rect(298, 106, 24, 24, "lab-crate") +
    text(310, 122, `${fmt(v.m, 0)}`, "lab-charge-text", "middle") +
    text(280, 200, "Balkenwaage: Masse", "lab-text-small", "middle") +
    text(280, 216, `${fmtUnit(v.m, "kg", 0)} (überall gleich)`, "lab-text", "middle") +
    // spring scale
    rect(405, 70, 14, 150, "lab-tube") +
    rect(402, pointer, 20, 6, "lab-needle") +
    text(412, 56, "Kraftmesser", "lab-text-small", "middle") +
    text(412, 244, `F_G = ${fmtUnit(FG, "N", 1)}`, "lab-text lab-text-big", "middle") +
    text(412, 264, `g = ${fmtUnit(v.g, "N/kg", 2)}`, "lab-text-muted", "middle") +
    CLOSE
  );
}

// ─── 1.7 Teilchenmodell ───────────────────────────────────────────────────

function particleStates(v: LabValues, r: ReadoutValues): string {
  const bx = 20;
  const by = 60;
  const bw = 280;
  const bh = 200;
  const temp = v.temp;
  let particles = "";
  if (v.state === 0) {
    const amp = 1 + (temp / 100) * 6;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 8; col++) {
        const i = row * 8 + col;
        const x = bx + 30 + col * 32 + (jitter(i, 1) * 2 - 1) * amp;
        const y = by + bh - 28 - row * 30 + (jitter(i, 2) * 2 - 1) * amp;
        particles += circle(x, y, 9, "lab-particle");
      }
    }
  } else if (v.state === 1) {
    const amp = 5 + (temp / 100) * 8;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 8; col++) {
        const i = row * 8 + col;
        const x = bx + 28 + col * 32 + (row % 2) * 15 + (jitter(i, 3) * 2 - 1) * amp;
        const y = by + bh - 26 - row * 28 + (jitter(i, 4) * 2 - 1) * amp;
        particles += circle(clamp(x, bx + 10, bx + bw - 10), y, 9, "lab-particle");
      }
    }
  } else {
    const speed = 12 + (temp / 100) * 26;
    for (let i = 0; i < 14; i++) {
      const x = bx + 20 + jitter(i, 5) * (bw - 40);
      const y = by + 20 + jitter(i, 6) * (bh - 40);
      const a = jitter(i, 7) * Math.PI * 2;
      particles +=
        circle(x, y, 9, "lab-particle") +
        arrow(x, y, x + Math.cos(a) * speed, y + Math.sin(a) * speed, "lab-velocity", 2);
    }
  }
  const surface = v.state === 1 ? line(bx, by + bh - 26 - 4 * 28 - 18, bx + bw, by + bh - 26 - 4 * 28 - 18, "lab-grid") : "";
  return (
    open("Teilchen in einem Behälter im festen, flüssigen oder gasförmigen Zustand") +
    `<path d="M${bx} ${by} V${by + bh} H${bx + bw} V${by}" class="lab-wall" />` +
    surface +
    particles +
    text(312, 90, "Anordnung", "lab-text-small") +
    text(312, 108, str(r, "order"), "lab-text") +
    text(312, 140, "Bewegung", "lab-text-small") +
    text(312, 158, str(r, "move"), "lab-text") +
    text(312, 190, "Form und Volumen", "lab-text-small") +
    text(312, 208, str(r, "shape"), "lab-text") +
    text(20, 30, `${v.state === 0 ? "Fest" : v.state === 1 ? "Flüssig" : "Gasförmig"} bei Temperatur ${fmt(temp, 0)} %`, "lab-text lab-text-big") +
    CLOSE
  );
}

// ─── 1.8 Dichte ───────────────────────────────────────────────────────────

function densityColour(rho: number): string {
  if (rho < 0.1) return "#f8fafc";
  if (rho < 0.8) return "#b45309";
  if (rho < 1.5) return "#60a5fa";
  if (rho < 5) return "#cbd5e1";
  if (rho < 8.2) return "#64748b";
  if (rho < 10) return "#ea580c";
  if (rho < 15) return "#475569";
  return "#facc15";
}

function materialName(rho: number): string {
  const names: Array<[number, string]> = [
    [0.03, "Styropor"],
    [0.5, "Fichtenholz"],
    [1, "Wasser"],
    [2.7, "Aluminium"],
    [7.87, "Eisen"],
    [8.96, "Kupfer"],
    [11.34, "Blei"],
    [19.3, "Gold"],
  ];
  return names.find(([value]) => Math.abs(value - rho) < 1e-6)?.[1] ?? "Stoff";
}

function density(v: LabValues, r: ReadoutValues): string {
  const side = 18 + Math.cbrt(v.V) * 9;
  const m = num(r, "m");
  return (
    open("Ein Körper aus einem Stoff auf einer Waage, die seine Masse anzeigt") +
    rect(40, 240, 200, 12, "lab-ground") +
    rect(70, 240 - side, side, side, "lab-block", `style="fill:${densityColour(v.rho)};stroke:var(--lab-wall);stroke-width:2"`) +
    text(70 + side / 2, 240 - side / 2 + 4, `${fmt(v.V, 0)} cm³`, "lab-fixed-dark", "middle") +
    text(40, 276, `${materialName(v.rho)}, ρ = ${fmtUnit(v.rho, "g/cm³", 2)}`, "lab-text-muted") +
    rect(290, 150, 190, 90, "lab-tube") +
    rect(306, 164, 158, 44, "lab-meter") +
    text(385, 194, `${fmt(m, 1)} g`, "lab-charge-text", "middle") +
    text(385, 226, "Waage", "lab-text-small", "middle") +
    text(20, 30, "ρ = m / V und m = ρ · V", "lab-text lab-text-big") +
    text(20, 54, `${fmt(v.rho, 2)} g/cm³ · ${fmt(v.V, 0)} cm³ = ${fmt(m, 1)} g`, "lab-text-muted") +
    CLOSE
  );
}

// ─── 1.9 Reibung ──────────────────────────────────────────────────────────

function friction(v: LabValues, r: ReadoutValues): string {
  const groundY = 170;
  const state = str(r, "state");
  const F = v.F;
  const FR = num(r, "FR");
  const haftMax = num(r, "haftMax");
  const w = 56 + v.m * 0.5;
  const x = 150;
  const lift = v.mode === 1 ? 10 : 0;
  const moving = state !== "haftet";
  const speedLines = moving
    ? line(x - 40, groundY - 50, x - 10, groundY - 50, "lab-grid") + line(x - 50, groundY - 34, x - 14, groundY - 34, "lab-grid")
    : "";
  const barX = 40;
  const barW = 440;
  const scaleMax = Math.max(600, haftMax * 1.1);
  const px = (value: number) => barX + clamp(value / scaleMax, 0, 1) * barW;
  return (
    open("Eine Kiste wird gezogen, darunter die Zugkraft im Vergleich zur Haftreibung") +
    rect(30, groundY, 460, 12, "lab-ground") +
    speedLines +
    rect(x, groundY - 50 - lift, w, 50, "lab-crate") +
    (v.mode === 1
      ? circle(x + 14, groundY - 5, 8, "lab-block") + circle(x + w - 14, groundY - 5, 8, "lab-block")
      : "") +
    arrow(x + w, groundY - 25 - lift, x + w + clamp(F / 6, 6, 110), groundY - 25 - lift, "lab-force", 4) +
    text(x + w + 6, groundY - 66 - lift, `Zugkraft ${fmtUnit(F, "N", 0)}`, "lab-text lab-text-force") +
    arrow(x, groundY - 8, x - clamp(FR / 6, 6, 110), groundY - 8, "lab-force-2", 4) +
    text(x, groundY + 28, `Reibungskraft ${fmtUnit(FR, "N", 0)}`, "lab-text lab-text-force-2") +
    // force bar
    rect(barX, 232, barW, 18, "lab-bar-in", 'style="opacity:0.3"') +
    rect(barX, 232, px(F) - barX, 18, "lab-bar-loss") +
    line(px(haftMax), 224, px(haftMax), 258, "lab-axis", 'stroke-width="3"') +
    text(px(haftMax), 272, `Höchstwert Haftreibung ${fmtUnit(haftMax, "N", 0)}`, "lab-text-small", haftMax > scaleMax * 0.6 ? "end" : "start") +
    text(20, 30, `Zustand: ${state}`, "lab-text lab-text-big") +
    text(20, 52, `Anpresskraft ${fmtUnit(num(r, "FN"), "N", 0)}`, "lab-text-muted") +
    CLOSE
  );
}

export const MECHANIK_RENDERERS: Partial<Record<LabKind, Renderer>> = {
  "measure-length": measureLength,
  "uniform-motion": uniformMotion,
  "force-arrow": forceArrow,
  interaction,
  spring,
  "weight-places": weightPlaces,
  "particle-states": particleStates,
  density,
  friction,
};
