import { fmt, fracText } from "../exercises/format";
import type { LabValues } from "../model/types";
import {
  arcPath,
  circle,
  H,
  handle,
  type LabView,
  line,
  open,
  path,
  type Pt,
  polar,
  polygon,
  r1,
  rect,
  sectorPath,
  text,
  W,
} from "./svg";

function ellipse(cx: number, cy: number, rx: number, ry: number, cls: string): string {
  return `<ellipse cx="${r1(cx)}" cy="${r1(cy)}" rx="${r1(Math.max(rx, 0))}" ry="${r1(Math.max(ry, 0))}" class="${cls}" />`;
}

// ─── 2.1 Rad abrollen und Archimedes' Vielecke ─────────────────────────────

const WHEEL = { ground: 250, x0: 30 };

function wheelLayout(v: LabValues) {
  const k = Math.min(10, 440 / (Math.PI * v.d + v.d));
  const radius = (v.d * k) / 2;
  const u = Math.PI * v.d * k;
  return { k, radius, u };
}

function wheel(v: LabValues): string {
  if (v.exp === 1) return polygons(v);
  const { k, radius, u } = wheelLayout(v);
  const t = v.t / 100;
  const cx = WHEEL.x0 + radius + t * u;
  const cy = WHEEL.ground - radius;
  const turn = t * 360;
  const mark = polar(cx, cy, radius, -90 - turn);
  const start = WHEEL.x0 + radius;
  let out = open("Ein Rad rollt ab und hinterlässt seinen Umfang als Strecke");
  out += line(10, WHEEL.ground, W - 10, WHEEL.ground, "lab-ink");
  // ruler in cm below the ground
  const step = v.d * Math.PI > 60 ? 10 : 5;
  for (let cm = 0; start + cm * k <= W - 10; cm += step) {
    const x = start + cm * k;
    out += line(x, WHEEL.ground, x, WHEEL.ground + (cm % (step * 2) === 0 ? 10 : 6), "lab-thin");
    if (cm % (step * 2) === 0) out += text(x, WHEEL.ground + 24, `${cm}`, "lab-text-tick", "middle");
  }
  out += text(W - 14, WHEEL.ground + 24, "cm", "lab-text-tick", "end");
  out += line(start, WHEEL.ground - 2, start + t * u, WHEEL.ground - 2, "lab-side-b");
  if (t >= 1) {
    out += line(start, WHEEL.ground - 14, start, WHEEL.ground + 2, "lab-side-b") + line(start + u, WHEEL.ground - 14, start + u, WHEEL.ground + 2, "lab-side-b");
    out += text(start + u / 2, WHEEL.ground - 18, `u = ${fmt(Math.PI * v.d, 2)} cm`, "lab-text lab-text-b", "middle");
  }
  out += circle(cx, cy, radius, "lab-shape");
  out += line(cx - radius, cy, cx + radius, cy, "lab-side-a");
  for (let spoke = 0; spoke < 6; spoke++) {
    const p = polar(cx, cy, radius, spoke * 60 - turn);
    out += line(cx, cy, p.x, p.y, "lab-thin");
  }
  out += circle(mark.x, mark.y, 5, "lab-point-b");
  out += text(cx, cy - radius - 8, `d = ${fmt(v.d, 1)} cm`, "lab-text lab-text-a", "middle");
  out += text(16, 26, `u = π · d = ${fmt(Math.PI, 5)} · ${fmt(v.d, 1)} cm = ${fmt(Math.PI * v.d, 2)} cm`, "lab-text lab-text-big");
  out += text(16, 48, `Abgerollt: ${fmt(t * Math.PI * v.d, 2)} cm, also ${fmt(t * Math.PI, 3)} · d`, "lab-text-muted");
  out += handle("roll", cx, cy, "Rad: ziehen rollt es ab");
  out += `</svg>`;
  return out;
}

function polygons(v: LabValues): string {
  const n = v.n;
  const cx = 150;
  const cy = 170;
  const R = 130;
  const inner: Pt[] = [];
  const outer: Pt[] = [];
  const Ro = R / Math.cos(Math.PI / n);
  for (let i = 0; i < n; i++) {
    inner.push(polar(cx, cy, R, (360 * i) / n + 90));
    outer.push(polar(cx, cy, Ro, (360 * (i + 0.5)) / n + 90));
  }
  const low = n * Math.sin(Math.PI / n);
  const high = n * Math.tan(Math.PI / n);
  let out = open("Ein Kreis zwischen einem einbeschriebenen und einem umbeschriebenen Vieleck");
  out += polygon(outer, "lab-fill-b");
  out += circle(cx, cy, R, "lab-fill-c");
  out += polygon(inner, "lab-fill-a");
  out += line(cx - R, cy, cx + R, cy, "lab-thin");
  out += text(cx, cy - 6, "d = 1", "lab-text-small", "middle");
  out += text(312, 50, `${n}-Eck, Durchmesser d = 1`, "lab-text lab-text-big");
  out += text(312, 86, `innen: Umfang ${fmt(low, 5)}`, "lab-text lab-text-a");
  out += text(312, 108, `Kreis: Umfang π`, "lab-text lab-text-c");
  out += text(312, 130, `außen: Umfang ${fmt(high, 5)}`, "lab-text lab-text-b");
  out += text(312, 172, `${fmt(low, 4)} < π < ${fmt(high, 4)}`, "lab-text lab-text-big");
  out += text(312, 196, `Lücke: ${fmt(high - low, 4)}`, "lab-text-muted");
  out += text(312, 236, "Archimedes kam mit dem 96-Eck", "lab-text-muted");
  out += text(312, 254, "auf 3 10/71 < π < 3 1/7.", "lab-text-muted");
  out += `</svg>`;
  return out;
}

// ─── 2.2 Pizza in ein Rechteck verwandeln ──────────────────────────────────

const PIZZA = { cx: 260, cy: 186, k: 22 };

function pizza(v: LabValues): string {
  const { cx, cy, k } = PIZZA;
  const n = v.n;
  const t = v.t / 100;
  const R = v.r * k;
  const theta = 360 / n;
  const w = (2 * Math.PI * R) / n;
  const rowWidth = (n / 2) * w + w / 2;
  const xStart = cx - rowWidth / 2;
  const yBottom = cy + R / 2;
  const yTop = cy - R / 2;
  let out = open("Ein Kreis in Stücke geschnitten und abwechselnd zu einem fast-Rechteck gelegt");
  // reference circle r = 2 cm
  out += circle(54, 54, 2 * k, "lab-ghost");
  out += text(54, 54 + 2 * k + 14, "r = 2 cm", "lab-text-small", "middle");
  for (let i = 0; i < n; i++) {
    const startAngle = (i + 0.5) * theta;
    const even = i % 2 === 0;
    const half = Math.floor(i / 2);
    const target: Pt = even ? { x: xStart + half * w + w / 2, y: yBottom } : { x: xStart + half * w + w, y: yTop };
    const targetAngle = even ? 90 : 270;
    let delta = targetAngle - startAngle;
    while (delta > 180) delta -= 360;
    while (delta <= -180) delta += 360;
    const apex: Pt = { x: cx + (target.x - cx) * t, y: cy + (target.y - cy) * t };
    const bisector = startAngle + delta * t;
    out += path(sectorPath(apex.x, apex.y, R, bisector - theta / 2, bisector + theta / 2), even ? "lab-fill-b" : "lab-fill-a");
  }
  if (t >= 1) {
    out += line(xStart + w / 2, yBottom + 14, xStart + w / 2 + (n / 2) * w, yBottom + 14, "lab-side-c");
    out += text(cx, yBottom + 30, `Breite ≈ halber Umfang = π · r = ${fmt(Math.PI * v.r, 2)} cm`, "lab-text lab-text-c", "middle");
    out += line(xStart - 10, yTop, xStart - 10, yBottom, "lab-side-a");
    out += text(xStart - 14, cy + 4, "r", "lab-text lab-text-a", "end");
  }
  out += text(W - 16, 26, `A = π · r² = ${fmt(Math.PI * v.r * v.r, 2)} cm²`, "lab-text lab-text-big", "end");
  out += text(W - 16, 46, `${n} Stücke`, "lab-text-muted", "end");
  if (t === 0) out += handle("rim", cx + R, cy, "Kreisrand: Radius ändern");
  out += `</svg>`;
  return out;
}

// ─── 2.3 Kreissektor und Kreisbogen ────────────────────────────────────────

const SECTOR = { cx: 160, cy: 172, k: 24 };

/** α/360° as a short fraction when it has a small denominator, else as a decimal. */
export function shareText(alpha: number): string {
  const text = fracText(alpha, 360);
  const denominator = Number(text.split("/")[1] ?? 1);
  return denominator <= 12 ? text : fmt(alpha / 360, 3);
}

function sector(v: LabValues): string {
  const { cx, cy, k } = SECTOR;
  const R = v.r * k;
  const b = 2 * Math.PI * v.r * (v.alpha / 360);
  const area = Math.PI * v.r * v.r * (v.alpha / 360);
  const end = polar(cx, cy, R, v.alpha);
  let out = open("Ein Kreis mit einem Sektor, dessen Mittelpunktswinkel einstellbar ist");
  out += circle(cx, cy, R, "lab-shape");
  if (v.alpha > 0) {
    out += path(sectorPath(cx, cy, R, 0, v.alpha), "lab-fill-c");
    if (v.alpha < 360) out += path(arcPath(cx, cy, R, 0, v.alpha), "lab-side-b");
    else out += circle(cx, cy, R, "lab-side-b");
    out += path(arcPath(cx, cy, 26, 0, Math.min(v.alpha, 359.9)), "lab-angle");
  }
  out += line(cx, cy, cx + R, cy, "lab-side-a");
  out += line(cx, cy, end.x, end.y, "lab-ink");
  const mid = polar(cx, cy, 44, v.alpha / 2);
  out += text(mid.x, mid.y + 4, `${v.alpha}°`, "lab-text", "middle");
  out += text(cx + R / 2, cy + 16, `r = ${fmt(v.r, 1)}`, "lab-text lab-text-a", "middle");
  const x = 340;
  out += text(x, 46, `Anteil: ${v.alpha}° / 360° = ${shareText(v.alpha)}`, "lab-text lab-text-big");
  out += text(x, 90, "Bogen b = 2πr · α/360°", "lab-text-muted");
  out += text(x, 110, `= ${fmt(b, 2)} cm`, "lab-text lab-text-b");
  out += text(x, 150, "Sektor A = πr² · α/360°", "lab-text-muted");
  out += text(x, 170, `= ${fmt(area, 2)} cm²`, "lab-text lab-text-c");
  out += text(x, 210, `b : r = ${fmt(b / v.r, 3)}`, "lab-text-muted");
  out += handle("edge", end.x, end.y, "Rand des Sektors: Winkel ändern");
  out += `</svg>`;
  return out;
}

// ─── 2.4 Zylinder: Dose abwickeln ──────────────────────────────────────────

function canLayout(v: LabValues) {
  const k = Math.min(14, 300 / (v.h + 4 * v.r), 300 / (2 * Math.PI * v.r));
  const cx = 30 + v.r * k;
  const bottom = H - 30;
  return { k, cx, top: bottom - v.h * k, bottom };
}

function can(v: LabValues): string {
  const { k, cx, top, bottom } = canLayout(v);
  const R = v.r * k;
  const ry = Math.max(4, R * 0.28);
  const t = v.t / 100;
  let out = open("Eine Dose und ihr Netz aus Rechteck und zwei Kreisen");
  out += ellipse(cx, bottom, R, ry, "lab-shape");
  out += rect(cx - R, top, 2 * R, bottom - top, "lab-fill-only");
  out += ellipse(cx, top, R, ry, "lab-fill-a");
  out += line(cx - R, top, cx - R, bottom, "lab-ink") + line(cx + R, top, cx + R, bottom, "lab-ink");
  out += line(cx, top, cx + R, top, "lab-side-a");
  out += text(cx + R / 2, top - ry - 6, `r = ${fmt(v.r, 1)}`, "lab-text lab-text-a", "middle");
  out += line(cx + R + 10, top, cx + R + 10, bottom, "lab-side-b");
  out += text(cx + R + 14, (top + bottom) / 2, `h = ${fmt(v.h, 1)}`, "lab-text lab-text-b");
  // the net on the right
  const nx = cx + R + 70;
  const width = 2 * Math.PI * R * t;
  const mantleTop = 20 + 2 * R;
  if (t > 0) {
    out += rect(nx, mantleTop, width, v.h * k, "lab-fill-c");
    if (t >= 1) {
      out += circle(nx + R, mantleTop - R, R, "lab-fill-a");
      out += circle(nx + R, mantleTop + v.h * k + R, R, "lab-fill-a");
      out += text(nx + 2 * Math.PI * R / 2, mantleTop + (v.h * k) / 2 + 4, `M = 2πr · h`, "lab-text lab-text-c", "middle");
      out += text(nx + 2 * Math.PI * R / 2, mantleTop - 6, `2πr = ${fmt(2 * Math.PI * v.r, 1)} cm`, "lab-text-small", "middle");
    }
  }
  out += text(W - 14, 22, `V = πr²h = ${fmt(Math.PI * v.r * v.r * v.h, 1)} cm³`, "lab-text lab-text-big", "end");
  out += text(W - 14, 42, `O = 2πr² + 2πrh = ${fmt(2 * Math.PI * v.r * v.r + 2 * Math.PI * v.r * v.h, 1)} cm²`, "lab-text", "end");
  out += handle("top", cx - R * 0.6, top, "Deckel: Höhe ändern");
  out += handle("side", cx + R, (top + bottom) / 2 + 18, "Mantel: Radius ändern");
  out += `</svg>`;
  return out;
}

// ─── 2.5 Kegel und Pyramide: ein Drittel ───────────────────────────────────

export function coneSlant(v: LabValues): number {
  return v.body === 0 ? Math.hypot(v.r, v.h) : Math.hypot(v.h, v.a / 2);
}

function coneLayout(v: LabValues) {
  const half = v.body === 0 ? v.r : v.a / 2;
  const k = Math.min(18, 230 / v.h, 100 / half);
  return { k, half, base: 290, left: 40 + half * k, right: 300 + half * k };
}

function cone(v: LabValues): string {
  if (v.view === 1) return coneNet(v);
  const { k, half, base, left, right } = coneLayout(v);
  const Hh = v.h * k;
  const B = half * k;
  const ry = Math.max(3, B * 0.25);
  const cone = v.body === 0;
  const fill = Math.min(v.pours, 3) / 3;
  const overflow = v.pours > 3;
  let out = open(cone ? "Kegel und Zylinder mit gleicher Grundfläche und Höhe" : "Pyramide und Prisma mit gleicher Grundfläche und Höhe");
  out += line(10, base, W - 10, base, "lab-ink");
  // the pointed body, filled with water
  out += polygon([{ x: left - B, y: base }, { x: left + B, y: base }, { x: left, y: base - Hh }], "lab-water");
  out += polygon([{ x: left - B, y: base }, { x: left + B, y: base }, { x: left, y: base - Hh }], "lab-ink");
  if (cone) out += ellipse(left, base, B, ry, "lab-ink");
  else out += polygon([{ x: left - B, y: base }, { x: left - B * 0.4, y: base - ry * 1.6 }, { x: left + B * 1.6, y: base - ry * 1.6 }, { x: left + B, y: base }], "lab-thin");
  out += text(left, base + 24, cone ? "Kegel" : "Pyramide", "lab-text", "middle");
  // the column, filled `pours` times
  out += rect(right - B, base - Hh * fill, 2 * B, Hh * fill, "lab-water");
  out += rect(right - B, base - Hh, 2 * B, Hh, "lab-ink");
  if (cone) {
    out += ellipse(right, base - Hh, B, ry, "lab-ink");
    out += ellipse(right, base, B, ry, "lab-thin");
  }
  if (overflow) {
    out += ellipse(right - B - 34, base - 3, 30, 6, "lab-water");
    out += text(right - B - 34, base - 16, "läuft über!", "lab-text lab-text-bad", "middle");
  }
  out += text(right, base + 24, cone ? "Zylinder" : "Prisma", "lab-text", "middle");
  for (let i = 1; i <= 2; i++) out += line(right - B - 6, base - (Hh * i) / 3, right - B, base - (Hh * i) / 3, "lab-thin");
  out += text(16, 26, `${v.pours} Füllung${v.pours === 1 ? "" : "en"} des ${cone ? "Kegels" : "der Pyramide"} → ${v.pours <= 3 ? fracText(v.pours, 3) : "mehr als 1"} ${cone ? "des Zylinders" : "des Prismas"}`, "lab-text lab-text-big");
  out += text(16, 48, `V = ⅓ · G · h = ${fmt(spitzVolume(v), 1)} cm³`, "lab-text-muted");
  out += handle("apex", left, base - Hh, "Spitze: Höhe ändern");
  out += `</svg>`;
  return out;
}

export function spitzVolume(v: LabValues): number {
  const G = v.body === 0 ? Math.PI * v.r * v.r : v.a * v.a;
  return (G * v.h) / 3;
}

function coneNet(v: LabValues): string {
  const s = coneSlant(v);
  let out = open(v.body === 0 ? "Abgewickelter Kegelmantel: ein Kreissektor" : "Netz einer quadratischen Pyramide");
  if (v.body === 0) {
    const angle = (360 * v.r) / s;
    const k = Math.min(20, 130 / s);
    const cx = 170;
    const cy = 180;
    out += path(sectorPath(cx, cy, s * k, 90 - angle / 2, 90 + angle / 2), "lab-fill-c");
    out += circle(cx, cy, s * k, "lab-ghost");
    const p = polar(cx, cy, s * k, 90 + angle / 2);
    out += line(cx, cy, p.x, p.y, "lab-side-b");
    out += text((cx + p.x) / 2 - 6, (cy + p.y) / 2, `s = ${fmt(s, 2)}`, "lab-text lab-text-b", "end");
    out += text(cx, cy + 16, "Spitze", "lab-text-small", "middle");
    out += text(350, 50, `Mantellinie s = √(r² + h²) = ${fmt(s, 2)} cm`, "lab-text");
    out += text(350, 80, `Bogen = Umfang der Grundfläche`, "lab-text-muted");
    out += text(350, 100, `= 2πr = ${fmt(2 * Math.PI * v.r, 2)} cm`, "lab-text-muted");
    out += text(350, 140, `Mittelpunktswinkel = 360° · r/s`, "lab-text-muted");
    out += text(350, 162, `= ${fmt(angle, 1)}°`, "lab-text lab-text-big");
    out += text(350, 202, `M = π · r · s = ${fmt(Math.PI * v.r * s, 2)} cm²`, "lab-text lab-text-c");
  } else {
    const a = v.a;
    const k = Math.min(16, 300 / (a + 2 * s));
    const cx = 170;
    const cy = 172;
    const half = (a * k) / 2;
    const hs = s * k;
    out += rect(cx - half, cy - half, a * k, a * k, "lab-fill-a");
    out += polygon([{ x: cx - half, y: cy - half }, { x: cx + half, y: cy - half }, { x: cx, y: cy - half - hs }], "lab-fill-c");
    out += polygon([{ x: cx - half, y: cy + half }, { x: cx + half, y: cy + half }, { x: cx, y: cy + half + hs }], "lab-fill-c");
    out += polygon([{ x: cx - half, y: cy - half }, { x: cx - half, y: cy + half }, { x: cx - half - hs, y: cy }], "lab-fill-c");
    out += polygon([{ x: cx + half, y: cy - half }, { x: cx + half, y: cy + half }, { x: cx + half + hs, y: cy }], "lab-fill-c");
    out += line(cx, cy - half, cx, cy - half - hs, "lab-side-b");
    out += text(cx + 4, cy - half - hs / 2, `h_s = ${fmt(s, 2)}`, "lab-text lab-text-b");
    out += text(350, 50, `Seitenhöhe h_s = √(h² + (a/2)²)`, "lab-text");
    out += text(350, 72, `= ${fmt(s, 2)} cm`, "lab-text lab-text-b");
    out += text(350, 112, `M = 4 · ½ · a · h_s = ${fmt(2 * a * s, 2)} cm²`, "lab-text lab-text-c");
    out += text(350, 142, `G = a² = ${fmt(a * a, 2)} cm²`, "lab-text lab-text-a");
  }
  out += `</svg>`;
  return out;
}

// ─── 2.6 Kugel im Zylinder ─────────────────────────────────────────────────

function sphereLayout(v: LabValues) {
  const k = Math.min(16, 75 / v.r);
  const cx = 150;
  const bottom = 310;
  const top = bottom - 2 * v.r * k;
  return { k, cx, bottom, top };
}

/** Water that spills when the sphere sinks `x` deep into the full cylinder: a spherical cap. */
export function spilled(r: number, sink: number): number {
  const x = (2 * r * sink) / 100;
  return (Math.PI * x * x * (3 * r - x)) / 3;
}

function sphere(v: LabValues): string {
  if (v.view === 1) return orangePeel(v);
  const { k, cx, bottom, top } = sphereLayout(v);
  const R = v.r * k;
  const x = (2 * v.r * v.sink) / 100;
  const cy = top - R + x * k;
  const ry = Math.max(3, R * 0.22);
  const vCyl = 2 * Math.PI * v.r ** 3;
  const out1 = spilled(v.r, v.sink);
  let out = open("Eine Kugel sinkt in einen randvollen Zylinder mit gleichem Radius und Höhe 2r");
  out += rect(cx - R, top, 2 * R, bottom - top, "lab-water");
  out += circle(cx, cy, R, "lab-sphere");
  out += rect(cx - R, top, 2 * R, bottom - top, "lab-ink");
  out += ellipse(cx, top, R, ry, "lab-thin");
  out += ellipse(cx, bottom, R, ry, "lab-thin");
  out += line(cx, cy, cx + R, cy, "lab-side-a");
  out += text(cx + R / 2, cy - 5, "r", "lab-text lab-text-a", "middle");
  // the beaker that catches the overflow
  const bx = 330;
  const bw = 70;
  const bh = 160;
  const level = (out1 / vCyl) * bh;
  out += rect(bx, bottom - level, bw, level, "lab-water");
  out += rect(bx, bottom - bh, bw, bh, "lab-ink");
  for (const share of [1 / 3, 2 / 3]) out += line(bx - 6, bottom - bh * share, bx, bottom - bh * share, "lab-thin");
  out += text(bx - 9, bottom - (bh * 2) / 3 + 4, "⅔", "lab-text-small", "end");
  out += text(bx - 9, bottom - bh / 3 + 4, "⅓", "lab-text-small", "end");
  out += text(bx + bw / 2, bottom - bh - 10, "übergelaufen", "lab-text-small", "middle");
  out += text(bx + bw / 2, Math.max(bottom - level - 6, bottom - bh + 14), `${fmt((out1 / vCyl) * 100, 1)} %`, "lab-text", "middle");
  out += circle(470, 118, 2 * k, "lab-ghost");
  out += text(470, 118 + 2 * k + 14, "r = 2 cm", "lab-text-small", "middle");
  out += text(W - 14, 26, `V Kugel = 4/3 · πr³ = ${fmt((4 / 3) * Math.PI * v.r ** 3, 1)} cm³`, "lab-text lab-text-big", "end");
  out += text(W - 14, 46, `V Zylinder = πr² · 2r = ${fmt(vCyl, 1)} cm³`, "lab-text-muted", "end");
  out += handle("ball", cx, cy, "Kugel: ziehen lässt sie sinken");
  out += `</svg>`;
  return out;
}

function orangePeel(v: LabValues): string {
  const k = Math.min(16, 60 / v.r);
  const R = v.r * k;
  let out = open("Die Schale einer Kugel bedeckt vier Großkreise");
  out += circle(110, 170, R * 1.6, "lab-sphere");
  out += `<ellipse cx="110" cy="170" rx="${r1(R * 1.6)}" ry="${r1(R * 0.45)}" class="lab-thin" />`;
  out += text(110, 170 + R * 1.6 + 20, `Kugel, r = ${fmt(v.r, 1)}`, "lab-text", "middle");
  const centres: Pt[] = [
    { x: 300, y: 110 },
    { x: 300 + 2.2 * R, y: 110 },
    { x: 300, y: 110 + 2.2 * R },
    { x: 300 + 2.2 * R, y: 110 + 2.2 * R },
  ];
  for (const c of centres) out += circle(c.x, c.y, R, "lab-fill-b");
  out += text(300 + 1.1 * R, 110 + 3.3 * R + 22, "vier Kreise πr² = Schale", "lab-text", "middle");
  out += text(16, 26, `O = 4 · πr² = ${fmt(4 * Math.PI * v.r * v.r, 1)} cm²`, "lab-text lab-text-big");
  out += text(16, 46, "So viel Schale bedeckt die Kugel: genau die Fläche von vier Großkreisen.", "lab-text-muted");
  out += `</svg>`;
  return out;
}

export const KREIS_RAUM_VIEWS: Record<"wheel" | "pizza" | "sector" | "can" | "cone" | "sphere", LabView> = {
  wheel: {
    render: wheel,
    handles: {
      roll: {
        x: "t",
        drag: (p, v) => {
          const { radius, u } = wheelLayout(v);
          return { t: ((p.x - WHEEL.x0 - radius) / u) * 100 };
        },
      },
    },
  },
  pizza: {
    render: pizza,
    handles: {
      rim: { x: "r", drag: (p) => ({ r: (p.x - PIZZA.cx) / PIZZA.k }) },
    },
  },
  sector: {
    render: sector,
    handles: {
      edge: {
        x: "alpha",
        drag: (p, v) => {
          let angle = (Math.atan2(SECTOR.cy - p.y, p.x - SECTOR.cx) * 180) / Math.PI;
          if (angle < 0) angle += 360;
          // Crossing the start edge keeps a full or an empty circle instead of jumping.
          if (v.alpha > 300 && angle < 60) angle = 360;
          if (v.alpha < 60 && angle > 300) angle = 0;
          return { alpha: angle };
        },
      },
    },
  },
  can: {
    render: can,
    handles: {
      top: {
        y: "h",
        drag: (p, v) => {
          const { k, bottom } = canLayout(v);
          return { h: (bottom - p.y) / k };
        },
      },
      side: {
        x: "r",
        drag: (p, v) => {
          const { k } = canLayout(v);
          return { r: (p.x - 30) / (2 * k) };
        },
      },
    },
  },
  cone: {
    render: cone,
    handles: {
      apex: {
        y: "h",
        drag: (p, v) => {
          const { k, base } = coneLayout(v);
          return { h: (base - p.y) / k };
        },
      },
    },
  },
  sphere: {
    render: sphere,
    handles: {
      ball: {
        y: "sink",
        drag: (p, v) => {
          const { k, top } = sphereLayout(v);
          const R = v.r * k;
          return { sink: ((p.y - top + R) / (2 * R)) * 100 };
        },
      },
    },
  },
};

