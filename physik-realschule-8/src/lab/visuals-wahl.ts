import { fmt, fmtUnit } from "../exercises/format";
import type { LabKind, LabValues, ReadoutValues } from "../model/types";
import {
  CLOSE,
  circle,
  clamp,
  line,
  num,
  open,
  path,
  r1,
  rect,
  str,
  stroke,
  text,
} from "./draw";
import { HEARING_MAX, HEARING_MIN, marsLongitude, marsMotion, PLANETS, SOUND_SPEEDS } from "./physics";

type Renderer = (v: LabValues, r: ReadoutValues) => string;

// ─── 6.1 Schwingung ───────────────────────────────────────────────────────

function soundWave(v: LabValues, r: ReadoutValues): string {
  const x0 = 40;
  const cy = 145;
  const w = 440;
  const amp = (v.A / 10) * 70;
  let d = "";
  for (let i = 0; i <= 220; i++) {
    const x = x0 + (i / 220) * w;
    const y = cy - amp * Math.sin(2 * Math.PI * 3 * (i / 220));
    d += `${i === 0 ? "M" : "L"}${r1(x)} ${r1(y)} `;
  }
  const logPos = (f: number) => x0 + ((Math.log10(f) - 1) / 4) * w; // 10 Hz … 100 kHz
  const hearLo = logPos(HEARING_MIN);
  const hearHi = logPos(HEARING_MAX);
  const mx = logPos(clamp(v.f, 10, 100_000));
  return (
    open("Schwingungsbild eines Tons mit Frequenz und Amplitude und der Hörbereich darunter") +
    rect(30, 55, 460, 180, "lab-tube") +
    line(30, cy, 490, cy, "lab-grid") +
    stroke(d, "lab-sound-wave") +
    line(x0, 60, x0, 230, "lab-axis") +
    line(x0 + w / 3, 60, x0 + w / 3, 230, "lab-grid") +
    text(x0 + w / 6, 76, "T", "lab-text-small", "middle") +
    rect(x0, 262, hearLo - x0, 12, "lab-bar-loss", 'style="opacity:0.45"') +
    rect(hearLo, 262, hearHi - hearLo, 12, "lab-bar-kin") +
    rect(hearHi, 262, x0 + w - hearHi, 12, "lab-bar-loss", 'style="opacity:0.45"') +
    circle(mx, 268, 6, "lab-marker") +
    text(x0, 292, "10 Hz", "lab-text-small") +
    text(hearLo, 254, "16 Hz", "lab-text-small", "middle") +
    text(hearHi, 254, "20 kHz", "lab-text-small", "middle") +
    text(x0 + w, 292, "100 kHz", "lab-text-small", "end") +
    text(20, 24, `f = ${fmtUnit(v.f, "Hz", 0)}, T = ${fmtUnit(num(r, "T"), "ms", 3)}`, "lab-text lab-text-big") +
    text(20, 44, `${str(r, "range")}, ${str(r, "pitch")}, ${str(r, "loud")}`, "lab-text-muted") +
    CLOSE
  );
}

// ─── 6.2 Schallgeschwindigkeit ────────────────────────────────────────────

function soundSpeed(v: LabValues, r: ReadoutValues): string {
  const tAir = v.s / 343;
  let bars = "";
  SOUND_SPEEDS.forEach((m, i) => {
    const t = v.s / m.v;
    const wBar = Math.max(3, (t / tAir) * 300);
    const active = m.v === v.v;
    bars +=
      text(40, 188 + i * 30, m.name, "lab-text-small") +
      rect(150, 176 + i * 30, wBar, 16, active ? "lab-bar-kin" : "lab-bar-in", active ? "" : 'style="opacity:0.45"') +
      text(150 + wBar + 6, 189 + i * 30, `${fmt(t, 2)} s`, "lab-text-small");
  });
  return (
    open("Ein Knall breitet sich vom Sender zum Empfänger aus; darunter die Laufzeiten in drei Stoffen") +
    rect(40, 70, 18, 36, "lab-block") +
    path("M58 76 L80 62 V114 L58 100 Z", "lab-block") +
    stroke("M90 70 Q110 88 90 106", "lab-wire") +
    stroke("M104 62 Q132 88 104 114", "lab-wire") +
    stroke("M120 54 Q154 88 120 122", "lab-wire") +
    line(100, 140, 470, 140, "lab-axis") +
    circle(484, 88, 14, "lab-crate") +
    text(484, 120, "Ohr", "lab-text-small", "middle") +
    text(285, 132, `s = ${fmtUnit(v.s, "m", 0)}`, "lab-text-small", "middle") +
    bars +
    text(20, 24, `Laufzeit t = s / v = ${fmtUnit(num(r, "t"), "s", 2)}`, "lab-text lab-text-big") +
    text(20, 44, `Echo (hin und zurück): ${fmtUnit(num(r, "echo"), "s", 2)}`, "lab-text-muted") +
    CLOSE
  );
}

// ─── 7.1 Planetenschleife ─────────────────────────────────────────────────

function retrograde(v: LabValues, r: ReadoutValues): string {
  const cx = 120;
  const cy = 150;
  const rE = 46;
  const rM = 70;
  const thetaE = (2 * Math.PI * v.day) / 365.25;
  const thetaM = (2 * Math.PI * v.day) / 687;
  const ex = cx + rE * Math.cos(thetaE);
  const ey = cy - rE * Math.sin(thetaE);
  const mx = cx + rM * Math.cos(thetaM);
  const my = cy - rM * Math.sin(thetaM);
  const len = Math.hypot(mx - ex, my - ey) || 1;
  const sx = ex + ((mx - ex) / len) * (len + 90);
  const sy = ey + ((my - ey) / len) * (len + 90);
  // graph
  const gx = 270;
  const gy = 245;
  const gw = 220;
  const gh = 170;
  const xOf = (d: number) => gx + ((d + 100) / 200) * gw;
  const yOf = (lon: number) => gy - ((lon + 15) / 30) * gh;
  let curve = "";
  let band = "";
  let retroStart: number | null = null;
  let retroEnd: number | null = null;
  for (let d = -100; d <= 100; d += 2) {
    curve += `${d === -100 ? "M" : "L"}${r1(xOf(d))} ${r1(yOf(marsLongitude(d)))} `;
    if (marsMotion(d) === "rückläufig") {
      if (retroStart === null) retroStart = d;
      retroEnd = d;
    }
  }
  if (retroStart !== null && retroEnd !== null) band = rect(xOf(retroStart), gy - gh, xOf(retroEnd) - xOf(retroStart), gh, "lab-pressure", 'style="opacity:0.12"');
  return (
    open("Bahnen von Erde und Mars um die Sonne und die scheinbare Richtung von Mars am Sternenhimmel") +
    circle(cx, cy, rE, "lab-orbit") +
    circle(cx, cy, rM, "lab-orbit") +
    circle(cx, cy, 9, "lab-sun") +
    line(ex, ey, sx, sy, "lab-grid") +
    circle(ex, ey, 6, "lab-neg") +
    circle(mx, my, 5, "lab-crate") +
    text(ex + 8, ey - 8, "Erde", "lab-text-small") +
    text(mx + 8, my - 8, "Mars", "lab-text-small") +
    band +
    line(gx, gy, gx + gw, gy, "lab-axis") +
    line(gx, gy, gx, gy - gh - 6, "lab-axis") +
    line(xOf(0), gy, xOf(0), gy - gh, "lab-grid") +
    text(gx + gw, gy + 16, "Tage (−100 … 100)", "lab-text-small", "end") +
    text(gx + 4, gy - gh - 10, "Richtung zu Mars am Himmel", "lab-text-small") +
    path(curve, "lab-curve") +
    circle(xOf(v.day), yOf(marsLongitude(v.day)), 6, "lab-marker") +
    text(20, 24, `${str(r, "motion")} · Tag ${fmt(v.day, 0)}`, "lab-text lab-text-big") +
    text(20, 44, "Rot unterlegt: Zeit der Rückläufigkeit", "lab-text-small") +
    CLOSE
  );
}

// ─── 7.2 Planetenweg ──────────────────────────────────────────────────────

function solarScale(v: LabValues, r: ReadoutValues): string {
  const cx = 185;
  const cy = 150;
  let orbits = "";
  let planets = "";
  PLANETS.forEach((p, i) => {
    const rad = 24 * Math.sqrt(p.au);
    const a = (i * 2.2 + 0.4) % (2 * Math.PI);
    const x = cx + rad * Math.cos(a);
    const y = cy - rad * Math.sin(a);
    const active = p.au === v.planet;
    orbits += circle(cx, cy, rad, "lab-orbit");
    planets += circle(x, y, active ? 7 : 4, active ? "lab-marker" : "lab-planet") + (active ? text(x + 10, y - 8, p.name, "lab-text") : "");
  });
  return (
    open("Die Bahnen der acht Planeten in Wurzelskala, der gewählte Planet ist markiert") +
    orbits +
    circle(cx, cy, 8, "lab-sun") +
    planets +
    text(350, 70, "Abstand zur Sonne", "lab-text-small") +
    text(350, 90, `${fmtUnit(v.planet, "AE", 2)}`, "lab-text lab-text-big") +
    text(350, 112, `${fmtUnit(num(r, "mkm"), "Mio. km", 0)}`, "lab-text-muted") +
    text(350, 146, "Lichtlaufzeit", "lab-text-small") +
    text(350, 166, `${fmtUnit(num(r, "lmin"), "min", 1)}`, "lab-text lab-text-big") +
    text(350, 200, "Im Modell", "lab-text-small") +
    text(350, 220, `${fmtUnit(num(r, "model"), "cm", 0)}`, "lab-text lab-text-big") +
    text(20, 292, "Darstellung nicht maßstäblich: Wurzelskala", "lab-text-small") +
    CLOSE
  );
}

export const WAHL_RENDERERS: Partial<Record<LabKind, Renderer>> = {
  "sound-wave": soundWave,
  "sound-speed": soundSpeed,
  retrograde,
  "solar-scale": solarScale,
};

