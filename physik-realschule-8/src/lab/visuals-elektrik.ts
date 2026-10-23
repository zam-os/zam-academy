import { fmt, fmtUnit } from "../exercises/format";
import type { LabKind, LabValues, ReadoutValues } from "../model/types";
import {
  arrow,
  CLOSE,
  circle,
  clamp,
  jitter,
  line,
  num,
  open,
  path,
  polygon,
  r1,
  rect,
  str,
  stroke,
  text,
} from "./draw";
import { fieldAt, magnetPoles, TRIBO_SERIES, type Pole } from "./physics";

type Renderer = (v: LabValues, r: ReadoutValues) => string;

// ─── 5.1 Elementarmagnete ─────────────────────────────────────────────────

function elementaryMagnets(v: LabValues, r: ReadoutValues): string {
  const a = num(r, "align") / 100;
  const x0 = 170;
  const y0 = 108;
  let cells = "";
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      const i = row * 8 + col;
      const base = jitter(i, 31) * 360;
      const angle = base * (1 - a);
      const x = x0 + 22 + col * 29;
      const y = y0 + 20 + row * 28;
      cells += `<g transform="translate(${r1(x)},${r1(y)}) rotate(${r1(angle)})">${rect(-11, -4, 11, 8, "lab-pole-s")}${rect(0, -4, 11, 8, "lab-pole-n")}</g>`;
    }
  }
  const clips = num(r, "align") >= 40 ? 3 : num(r, "align") >= 10 ? 1 : 0;
  let clipsDraw = "";
  for (let i = 0; i < clips; i++) clipsDraw += rect(420 + i * 4, 196 + i * 12, 12, 9, "lab-clip");
  if (clips === 0) clipsDraw = rect(430, 262, 12, 9, "lab-clip") + rect(446, 262, 12, 9, "lab-clip") + text(438, 252, "Klammern liegen", "lab-text-small", "middle");
  return (
    open("Ein Eisen- oder Stahlstab aus Elementarmagneten, mit oder ohne Magnet in der Nähe") +
    rect(x0, y0, 250, 96, "lab-ground", 'style="opacity:0.45"') +
    cells +
    (v.phase === 1 ? rect(50, 130, 50, 36, "lab-pole-s") + rect(100, 130, 50, 36, "lab-pole-n") + text(75, 153, "S", "lab-pole-text", "middle") + text(125, 153, "N", "lab-pole-text", "middle") : "") +
    clipsDraw +
    text(20, 28, `${v.material === 0 ? "Weiches Eisen" : "Stahl"}: ${["vor dem Magneten", "am Magneten", "Magnet entfernt"][v.phase]}`, "lab-text lab-text-big") +
    text(20, 50, `${fmt(num(r, "align"), 0)} % der Elementarmagnete ausgerichtet`, "lab-text-muted") +
    text(20, 285, "Elementarmagnet: rot = Nordpol, grün = Südpol", "lab-text-small") +
    CLOSE
  );
}

// ─── 5.2 Feldlinien ───────────────────────────────────────────────────────

const FIELD_SCALE = 55;
const FIELD_OX = 260;
const FIELD_OY = 150;

function traceLine(poles: Pole[], start: Pole, angle: number): string {
  const r0 = 0.16;
  let x = start.x + r0 * Math.cos(angle);
  let y = start.y + r0 * Math.sin(angle);
  const h = 0.06;
  let d = `M${r1(FIELD_OX + x * FIELD_SCALE)} ${r1(FIELD_OY - y * FIELD_SCALE)}`;
  for (let step = 0; step < 600; step++) {
    const b1 = fieldAt(poles, x, y);
    const m1 = Math.hypot(b1.bx, b1.by) || 1;
    const mx = x + ((b1.bx / m1) * h) / 2;
    const my = y + ((b1.by / m1) * h) / 2;
    const b2 = fieldAt(poles, mx, my);
    const m2 = Math.hypot(b2.bx, b2.by) || 1;
    x += (b2.bx / m2) * h;
    y += (b2.by / m2) * h;
    d += ` L${r1(FIELD_OX + x * FIELD_SCALE)} ${r1(FIELD_OY - y * FIELD_SCALE)}`;
    if (Math.abs(x) > 4.7 || Math.abs(y) > 2.8) break;
    if (poles.some((p) => p.q < 0 && Math.hypot(x - p.x, y - p.y) < 0.14)) break;
  }
  return stroke(d, "lab-field", 'style="stroke-dasharray:none;stroke-width:1.6"');
}

function fieldLines(v: LabValues, r: ReadoutValues): string {
  const poles = magnetPoles(v.kind);
  let lines = "";
  const perPole = v.kind === 2 ? 8 : 10;
  for (const p of poles) {
    if (p.q < 0) continue;
    for (let k = 0; k < perPole; k++) lines += traceLine(poles, p, (k * 2 * Math.PI) / perPole + 0.15);
  }
  const px = (x: number) => FIELD_OX + x * FIELD_SCALE;
  const py = (y: number) => FIELD_OY - y * FIELD_SCALE;
  let body = "";
  if (v.kind === 0) {
    body = rect(px(-1.6), py(0.35), 3.2 * FIELD_SCALE, 0.7 * FIELD_SCALE, "lab-pole-s") + rect(px(0), py(0.35), 1.6 * FIELD_SCALE, 0.7 * FIELD_SCALE, "lab-pole-n");
  } else if (v.kind === 1) {
    body = path(`M${px(-0.7)} ${py(0)} V${py(-1.2)} H${px(0.7)} V${py(0)}`, "lab-wall") + rect(px(-0.9), py(0.25), 0.4 * FIELD_SCALE, 0.5 * FIELD_SCALE, "lab-pole-n") + rect(px(0.5), py(0.25), 0.4 * FIELD_SCALE, 0.5 * FIELD_SCALE, "lab-pole-s");
  } else if (v.kind === 4) {
    body = circle(px(0), py(0), 1.6 * FIELD_SCALE, "lab-fluid", 'style="opacity:0.35"') + rect(px(-0.3), py(0.9), 0.6 * FIELD_SCALE, 0.9 * FIELD_SCALE, "lab-pole-s") + rect(px(-0.3), py(0), 0.6 * FIELD_SCALE, 0.9 * FIELD_SCALE, "lab-pole-n") + text(px(0), py(1.75), "geografisch Norden", "lab-text-small", "middle") + text(px(0), py(-1.75) + 12, "geografisch Süden", "lab-text-small", "middle");
  } else {
    const rightNorth = poles[1].q > 0;
    body =
      rect(px(-3.2), py(0.3), 1.6 * FIELD_SCALE, 0.6 * FIELD_SCALE, "lab-pole-s") +
      rect(px(-3.2) + 0.8 * FIELD_SCALE, py(0.3), 0.8 * FIELD_SCALE, 0.6 * FIELD_SCALE, "lab-pole-n") +
      rect(px(1.6), py(0.3), 1.6 * FIELD_SCALE, 0.6 * FIELD_SCALE, rightNorth ? "lab-pole-n" : "lab-pole-s") +
      rect(px(1.6) + 0.8 * FIELD_SCALE, py(0.3), 0.8 * FIELD_SCALE, 0.6 * FIELD_SCALE, rightNorth ? "lab-pole-s" : "lab-pole-n");
  }
  // compass needle
  const b = fieldAt(poles, v.cx, v.cy);
  const mag = Math.hypot(b.bx, b.by);
  const ang = Math.atan2(b.by, b.bx);
  const cx = px(v.cx);
  const cy = py(v.cy);
  const ux = Math.cos(ang);
  const uy = -Math.sin(ang);
  const faint = mag < 0.05;
  const needle = faint
    ? line(cx - 16, cy, cx + 16, cy, "lab-axis", 'stroke-dasharray="3 3" stroke-width="3"')
    : polygon([[cx + ux * 17, cy + uy * 17], [cx - uy * 4.5, cy + ux * 4.5], [cx + uy * 4.5, cy - ux * 4.5]], "lab-pole-n") +
      polygon([[cx - ux * 17, cy - uy * 17], [cx - uy * 4.5, cy + ux * 4.5], [cx + uy * 4.5, cy - ux * 4.5]], "lab-pole-s");
  return (
    open("Magnetfeldlinien eines Magneten mit einer Kompassnadel an einer wählbaren Stelle") +
    lines +
    body +
    circle(cx, cy, 20, "lab-clock") +
    needle +
    text(20, 24, `Nadel zeigt ${str(r, "dir")}`, "lab-text lab-text-big") +
    text(20, 44, "Rot: Nordpol und Nordspitze der Nadel", "lab-text-small") +
    CLOSE
  );
}

// ─── 5.3 Reibungselektrizität ─────────────────────────────────────────────

function chargeSymbols(x: number, y: number, count: number, sign: 1 | -1, cols = 5): string {
  let out = "";
  for (let i = 0; i < count; i++) {
    const cx = x + (i % cols) * 22;
    const cy = y + Math.floor(i / cols) * 22;
    out += circle(cx, cy, 9, sign > 0 ? "lab-pos" : "lab-neg") + text(cx, cy + 4, sign > 0 ? "+" : "−", "lab-charge-text", "middle");
  }
  return out;
}

function chargeTransfer(v: LabValues, r: ReadoutValues): string {
  const qA = num(r, "qA");
  const qB = num(r, "qB");
  const count = Math.min(10, Math.round(v.n));
  const aPos = qA > 0;
  const none = qA === 0;
  return (
    open("Zwei aneinander geriebene Stoffe: Elektronen gehen vom einen auf den anderen über") +
    rect(50, 90, 160, 100, "lab-block", 'style="opacity:0.25"') +
    rect(310, 90, 160, 100, "lab-block", 'style="opacity:0.25"') +
    text(130, 80, TRIBO_SERIES[v.A], "lab-text", "middle") +
    text(390, 80, TRIBO_SERIES[v.B], "lab-text", "middle") +
    (none ? "" : chargeSymbols(78, 118, count, aPos ? 1 : -1) + chargeSymbols(338, 118, count, aPos ? -1 : 1)) +
    (none
      ? text(260, 150, "gleicher Stoff: keine Ladungstrennung", "lab-text-muted", "middle")
      : aPos
        ? stroke("M190 200 Q260 250 330 200", "lab-axis") + arrow(320, 205, 332, 196, "lab-neg", 2) + text(260, 246, "Elektronen e⁻ wandern von A nach B", "lab-text-small", "middle")
        : stroke("M330 200 Q260 250 190 200", "lab-axis") + arrow(200, 205, 188, 196, "lab-neg", 2) + text(260, 246, "Elektronen e⁻ wandern von B nach A", "lab-text-small", "middle")) +
    text(130, 214, `${fmt(qA, 1)} nC`, "lab-text lab-text-big", "middle") +
    text(390, 214, `${fmt(qB, 1)} nC`, "lab-text lab-text-big", "middle") +
    // atom
    circle(260, 130, 7, "lab-pos") +
    `<ellipse cx="260" cy="130" rx="26" ry="12" fill="none" stroke="var(--lab-axis)" stroke-width="1" />` +
    circle(286, 130, 3.5, "lab-neg") +
    circle(234, 130, 3.5, "lab-neg") +
    text(260, 164, "Atom", "lab-text-small", "middle") +
    text(20, 28, `Summe der Ladungen: ${fmt(qA + qB, 1)} nC`, "lab-text lab-text-big") +
    text(20, 50, `${fmt(num(r, "N"), 1)} Milliarden Elektronen verschoben`, "lab-text-muted") +
    CLOSE
  );
}

// ─── 5.4 Influenz ─────────────────────────────────────────────────────────

function influence(v: LabValues, r: ReadoutValues): string {
  const cy = 150;
  const rad = 36;
  const gap = v.split === 1 ? 26 : 0;
  const s1 = 330;
  const s2 = s1 + 2 * rad + gap;
  const tip = s1 - rad - (10 + v.d * 6);
  const rodSign: 1 | -1 = v.sign === 0 ? -1 : 1;
  const n = Math.round(num(r, "Qi") / 2.2);
  let rodSymbols = "";
  for (let i = 0; i < 4; i++) rodSymbols += circle(tip - 20 - i * 24, cy, 9, rodSign > 0 ? "lab-pos" : "lab-neg") + text(tip - 20 - i * 24, cy + 4, rodSign > 0 ? "+" : "−", "lab-charge-text", "middle");
  let nearSym = "";
  let farSym = "";
  for (let i = 0; i < n; i++) {
    const yy = cy - 16 + (i % 3) * 16 + (i >= 3 ? 8 : 0);
    nearSym += circle(s1 - rad + 12 + Math.floor(i / 3) * 14, yy, 6.5, rodSign > 0 ? "lab-neg" : "lab-pos") + text(s1 - rad + 12 + Math.floor(i / 3) * 14, yy + 3, rodSign > 0 ? "−" : "+", "lab-charge-text", "middle");
    farSym += circle(s2 + rad - 12 - Math.floor(i / 3) * 14, yy, 6.5, rodSign > 0 ? "lab-pos" : "lab-neg") + text(s2 + rad - 12 - Math.floor(i / 3) * 14, yy + 3, rodSign > 0 ? "+" : "−", "lab-charge-text", "middle");
  }
  let field = "";
  for (const dy of [-20, 0, 20]) field += line(tip + 4, cy + dy, s1 - rad - 2, cy + dy * 0.7, "lab-field");
  return (
    open("Ein geladener Stab nähert sich zwei Metallkugeln, in denen Ladungen verschoben werden") +
    rect(tip - 110, cy - 14, 110, 28, "lab-block", 'style="opacity:0.35"') +
    rodSymbols +
    field +
    circle(s1, cy, rad, "lab-metal") +
    circle(s2, cy, rad, "lab-metal") +
    nearSym +
    farSym +
    text(s1, cy + rad + 22, v.split === 1 ? "getrennt im Feld" : "berühren sich", "lab-text-small", "middle") +
    text(20, 28, `Verschobene Ladung: ${fmtUnit(num(r, "Qi"), "nC", 1)}`, "lab-text lab-text-big") +
    text(20, 50, `zugewandte Seite: ${str(r, "near")}, abgewandte Seite: ${str(r, "far")}`, "lab-text-muted") +
    CLOSE
  );
}

// ─── 5.5 Elektrofilter ────────────────────────────────────────────────────

function electroFilter(v: LabValues, r: ReadoutValues): string {
  const eta = num(r, "eta");
  const x0 = 50;
  const x1 = 470;
  const top = 80;
  const bottom = 220;
  let dust = "";
  const total = 36;
  const caught = Math.round((eta / 100) * total);
  for (let i = 0; i < total; i++) {
    if (i < caught) {
      const upper = i % 2 === 0;
      dust += circle(x0 + 30 + jitter(i, 41) * (x1 - x0 - 60), upper ? top + 7 : bottom - 7, 4, "lab-block");
    } else {
      dust += circle(x0 + 20 + jitter(i, 42) * (x1 - x0 - 40), top + 20 + jitter(i, 43) * (bottom - top - 40), 4, "lab-block");
    }
  }
  let spikes = "";
  for (let i = 0; i < 12; i++) {
    const x = x0 + 30 + i * 33;
    spikes += line(x, 150, x - 6, 140, "lab-axis") + line(x, 150, x - 6, 160, "lab-axis");
  }
  return (
    open("Ein Elektrofilter: Staub wird aufgeladen und im elektrischen Feld an den Platten abgeschieden") +
    rect(x0, top - 8, x1 - x0, 8, "lab-block") +
    rect(x0, bottom, x1 - x0, 8, "lab-block") +
    line(x0, 150, x1, 150, "lab-axis", 'stroke-width="3"') +
    spikes +
    dust +
    arrow(8, 150, x0 - 6, 150, "lab-velocity", 3) +
    arrow(x1 + 6, 150, 512, 150, "lab-velocity", 3) +
    arrow(260, 124, 260, top + 8, "lab-field-arrow", 2) +
    arrow(260, 176, 260, bottom - 4, "lab-field-arrow", 2) +
    text(x0 + 4, top - 14, "geerdete Platte", "lab-text-small") +
    text(x0 + 4, bottom + 22, "geerdete Platte", "lab-text-small") +
    text(x0 + 4, 130, "Sprühelektrode: Hochspannung", "lab-text-small") +
    text(20, 28, `Abscheidegrad ${fmt(eta, 1)} %`, "lab-text lab-text-big") +
    text(20, 48, `Gas ${fmtUnit(v.v, "m/s", 0)}, Spannung ${fmtUnit(v.U, "kV", 0)}`, "lab-text-muted") +
    CLOSE
  );
}

// ─── 5.6 Stromstärke ──────────────────────────────────────────────────────

function currentFlow(v: LabValues, r: ReadoutValues): string {
  const wireTop = 120;
  const wireBottom = 190;
  const drift = 10 + v.I * 9;
  let ions = "";
  for (let col = 0; col < 14; col++) {
    for (let row = 0; row < 3; row++) {
      ions += circle(60 + col * 31, wireTop + 15 + row * 20, 7, "lab-pos", 'style="opacity:0.55"');
    }
  }
  let electrons = "";
  for (let i = 0; i < 22; i++) {
    const x = 60 + jitter(i, 51) * 400;
    const y = wireTop + 10 + jitter(i, 52) * 50;
    electrons += circle(x, y, 4.5, "lab-neg") + arrow(x, y, x - drift, y, "lab-velocity", 2);
  }
  return (
    open("Ein Metalldraht: Leitungselektronen bewegen sich gerichtet durch den Querschnitt") +
    rect(40, wireTop, 440, wireBottom - wireTop, "lab-conductor") +
    ions +
    electrons +
    line(260, wireTop - 14, 260, wireBottom + 14, "lab-force", 'stroke-dasharray="5 4" stroke-width="2"') +
    text(264, wireBottom + 30, "Querschnitt", "lab-text-small") +
    arrow(150, 88, 360, 88, "lab-force-2", 3) +
    text(255, 78, "technische Stromrichtung", "lab-text-small", "middle") +
    text(255, 238, "Elektronen bewegen sich entgegengesetzt", "lab-text-small", "middle") +
    text(20, 28, `Q = I · t = ${fmtUnit(num(r, "Q"), "C", 1)}`, "lab-text lab-text-big") +
    text(20, 48, `${fmt(num(r, "N"), 1)} · 10¹⁸ Elektronen in ${fmtUnit(v.t, "s", 0)}`, "lab-text-muted") +
    CLOSE
  );
}

// ─── 5.7 Stromkreis ───────────────────────────────────────────────────────

const WIRE = "lab-wire";

function bulb(cx: number, cy: number, on: number): string {
  const glow = on > 0 ? circle(cx, cy, 30, "lab-sun", `style="opacity:${on === 2 ? 0.2 : 0.45}"`) : "";
  return glow + circle(cx, cy, 18, on > 0 ? "lab-bulb-on" : "lab-bulb-off") + line(cx - 12, cy - 12, cx + 12, cy + 12, "lab-axis") + line(cx - 12, cy + 12, cx + 12, cy - 12, "lab-axis");
}

function circuit(v: LabValues, r: ReadoutValues): string {
  const lamp = str(r, "lamp");
  const on = lamp === "Lampe leuchtet" ? 1 : lamp === "Lampe leuchtet schwach" ? 2 : 0;
  const closed = v.switch === 1;
  return (
    open("Ein Stromkreis aus Batterie, Lampe, Schalter und einer Prüfstrecke") +
    path("M60 70 H228 M292 70 H460 V120 M460 180 V230 H300 M200 230 H60 V176 M60 124 V70", WIRE) +
    bulb(260, 70, on) +
    text(260, 36, "Lampe", "lab-text-small", "middle") +
    // battery
    line(44, 124, 76, 124, "lab-axis", 'stroke-width="4"') +
    line(52, 134, 68, 134, "lab-axis", 'stroke-width="4"') +
    text(86, 130, "+", "lab-text") +
    text(86, 156, "Batterie", "lab-text-small") +
    // switch
    circle(200, 230, 4, "lab-block") +
    circle(300, 230, 4, "lab-block") +
    (closed ? line(200, 230, 300, 230, "lab-block", 'stroke-width="4"') : line(200, 230, 284, 205, "lab-block", 'stroke-width="4"')) +
    text(250, 258, closed ? "Schalter geschlossen" : "Schalter offen", "lab-text-small", "middle") +
    // test gap
    circle(460, 120, 5, "lab-block") +
    circle(460, 180, 5, "lab-block") +
    rect(450, 128, 20, 44, CIRCUIT_PARTS_CLASS(v.part), "") +
    text(442, 148, CIRCUIT_NAMES[v.part], "lab-text-small", "end") +
    text(442, 166, "Prüfstrecke", "lab-text-small", "end") +
    (on > 0 ? arrow(150, 56, 210, 56, "lab-force-2", 2) : "") +
    text(20, 24, lamp, "lab-text lab-text-big") +
    text(20, 285, str(r, "type") ? `Gegenstand: ${str(r, "type")}` : "", "lab-text-muted") +
    CLOSE
  );
}

const CIRCUIT_NAMES = ["Kupferdraht", "Eisennagel", "Graphitmine", "Salzwasser", "Radiergummi", "Kunststofflineal", "Glasstab", "dest. Wasser"];

function CIRCUIT_PARTS_CLASS(part: number): string {
  return part <= 2 ? "lab-wire-cu" : part === 3 ? "lab-glass" : "lab-ground";
}

// ─── 5.8 Amperemeter ──────────────────────────────────────────────────────

function ammeter(v: LabValues, r: ReadoutValues): string {
  const series = v.conn === 0;
  const frac = clamp(num(r, "frac"), 0, 1.1);
  const state = str(r, "state");
  const bad = state !== "gut ablesbar";
  const gx = 410;
  const gy = 205;
  const gr = 80;
  const needleAngle = Math.PI + frac * Math.PI;
  let ticks = "";
  for (let i = 0; i <= 10; i++) {
    const a = Math.PI + (i / 10) * Math.PI;
    ticks += line(gx + Math.cos(a) * (gr - 8), gy + Math.sin(a) * (gr - 8), gx + Math.cos(a) * gr, gy + Math.sin(a) * gr, "lab-axis");
  }
  const meter = (cx: number, cy: number) => circle(cx, cy, 16, "lab-clock") + text(cx, cy + 5, "A", "lab-text lab-text-big", "middle");
  return (
    open("Ein Stromkreis mit Lampe und Amperemeter, rechts die Skala des Messgeräts") +
    path("M60 90 H150 M210 90 H300 V230 H220 M140 230 H60 V176 M60 124 V90", WIRE) +
    bulb(180, 90, series ? 1 : 0) +
    text(180, 126, "Lampe", "lab-text-small", "middle") +
    line(44, 124, 76, 124, "lab-axis", 'stroke-width="4"') +
    line(52, 134, 68, 134, "lab-axis", 'stroke-width="4"') +
    text(86, 130, "+", "lab-text") +
    (series
      ? line(140, 230, 220, 230, WIRE) + meter(180, 230) + text(180, 262, "Amperemeter in Reihe", "lab-text-small", "middle")
      : path("M150 90 V40 H165 M195 40 H210 V90", WIRE) + meter(180, 40) + text(180, 20, "Amperemeter parallel zur Lampe", "lab-text-small", "middle")) +
    `<path d="M${gx - gr} ${gy} A${gr} ${gr} 0 0 1 ${gx + gr} ${gy}" fill="none" stroke="var(--lab-wall)" stroke-width="2" />` +
    ticks +
    line(gx, gy, gx + Math.cos(needleAngle) * (gr - 12), gy + Math.sin(needleAngle) * (gr - 12), "lab-needle") +
    circle(gx, gy, 5, "lab-block") +
    text(gx, gy + 24, `Bereich ${fmt(v.range * 1000, 0)} mA`, "lab-text-small", "middle") +
    text(gx, gy - gr - 14, bad ? "!" : "", "lab-text lab-text-force", "middle") +
    text(20, 292, state, bad ? "lab-text lab-text-force" : "lab-text", "start") +
    CLOSE
  );
}

// ─── 5.9 Ionen ────────────────────────────────────────────────────────────

function ionsField(v: LabValues, r: ReadoutValues): string {
  const x0 = 130;
  const x1 = 390;
  const top = 80;
  const bottom = 220;
  const arrowLen = 6 + (v.U / 100) * 26;
  const moving = v.U > 0;
  let particles = "";
  const ionized = v.medium === 2 && v.U >= 60;
  if (v.medium === 0) {
    for (let col = 0; col < 7; col++) for (let row = 0; row < 3; row++) particles += circle(x0 + 24 + col * 36, top + 30 + row * 40, 9, "lab-pos", 'style="opacity:0.5"');
    for (let i = 0; i < 14; i++) {
      const x = x0 + 14 + jitter(i, 61) * (x1 - x0 - 28);
      const y = top + 14 + jitter(i, 62) * (bottom - top - 28);
      particles += circle(x, y, 4.5, "lab-neg") + (moving ? arrow(x, y, x - arrowLen, y, "lab-velocity", 2) : "");
    }
  } else if (v.medium === 1) {
    for (let i = 0; i < 16; i++) {
      const x = x0 + 16 + jitter(i, 63) * (x1 - x0 - 32);
      const y = top + 14 + jitter(i, 64) * (bottom - top - 28);
      const positive = i % 2 === 0;
      particles +=
        circle(x, y, 8, positive ? "lab-pos" : "lab-neg") +
        text(x, y + 4, positive ? "+" : "−", "lab-charge-text", "middle") +
        (moving ? arrow(x + (positive ? 10 : -10), y, x + (positive ? 10 + arrowLen : -10 - arrowLen), y, "lab-velocity", 2) : "");
    }
  } else {
    for (let i = 0; i < 18; i++) {
      const x = x0 + 14 + jitter(i, 65) * (x1 - x0 - 28);
      const y = top + 14 + jitter(i, 66) * (bottom - top - 28);
      if (ionized && i % 3 !== 0) {
        const positive = i % 3 === 1;
        particles +=
          circle(x, y, positive ? 8 : 4.5, positive ? "lab-pos" : "lab-neg") +
          arrow(x + (positive ? 10 : -6), y, x + (positive ? 10 + arrowLen : -6 - arrowLen), y, "lab-velocity", 2);
      } else {
        particles += circle(x, y, 8, "lab-neutral");
      }
    }
  }
  return (
    open("Ladungsträger zwischen zwei Elektroden: Elektronen im Metall, Ionen in der Salzlösung, Elektronen und Ionen im Gas") +
    rect(x0, top, x1 - x0, bottom - top, ionized ? "lab-light-bg" : "lab-ground", 'style="opacity:0.45"') +
    rect(x0 - 22, top, 22, bottom - top, "lab-pos") +
    rect(x1, top, 22, bottom - top, "lab-neg") +
    text(x0 - 11, top + 66, "+", "lab-charge-text", "middle") +
    text(x1 + 11, top + 66, "−", "lab-charge-text", "middle") +
    particles +
    text(20, 28, str(r, "current"), "lab-text lab-text-big") +
    text(20, 48, `Ladungsträger: ${str(r, "carrier")}`, "lab-text-muted") +
    text(260, 250, "Pluspol links, Minuspol rechts", "lab-text-small", "middle") +
    CLOSE
  );
}

// ─── 5.10 Körperstrom ─────────────────────────────────────────────────────

function bodyCurrent(v: LabValues, r: ReadoutValues): string {
  const effect = str(r, "effect");
  const logPos = (mA: number) => 190 + ((Math.log10(mA) - Math.log10(0.1)) / (Math.log10(300) - Math.log10(0.1))) * 300;
  const zones: Array<{ from: number; to: number; cls: string; label: string }> = [
    { from: 0.1, to: 1, cls: "lab-bar-kin", label: "kaum spürbar" },
    { from: 1, to: 10, cls: "lab-bar-pot", label: "spürbar" },
    { from: 10, to: 30, cls: "lab-bar-in", label: "Krampf" },
    { from: 30, to: 300, cls: "lab-bar-loss", label: "gefährlich" },
  ];
  let bar = "";
  for (const z of zones) {
    bar += rect(logPos(z.from), 150, logPos(z.to) - logPos(z.from), 26, z.cls) + text((logPos(z.from) + logPos(z.to)) / 2, 192, z.label, "lab-text-small", "middle");
  }
  const mx = logPos(v.I);
  const fiShort = String(effect).startsWith("kurzer Schlag");
  return (
    open("Ein Mensch, durch den ein Strom fließt, und eine Skala der Wirkungen") +
    circle(80, 62, 18, "lab-crate") +
    line(80, 80, 80, 170, "lab-wall", 'stroke-width="6"') +
    line(80, 100, 40, 140, "lab-wall", 'stroke-width="5"') +
    line(80, 100, 120, 140, "lab-wall", 'stroke-width="5"') +
    line(80, 170, 55, 235, "lab-wall", 'stroke-width="5"') +
    line(80, 170, 105, 235, "lab-wall", 'stroke-width="5"') +
    stroke("M120 140 L88 108 L72 130 L55 235", "lab-force", 'stroke-width="4"') +
    circle(76, 112, 8, "lab-pos") +
    text(80, 258, "Hand → Herz → Fuß", "lab-text-small", "middle") +
    bar +
    line(mx, 138, mx, 180, "lab-axis", 'stroke-width="3"') +
    circle(mx, 144, 6, "lab-marker") +
    text(190, 136, "0,1 mA", "lab-text-small", "start") +
    text(490, 136, "300 mA", "lab-text-small", "end") +
    text(190, 228, `${fmt(v.I, 1)} mA über ${fmt(v.t, 1)} s${v.fi === 1 ? ", FI-Schalter 30 mA" : ""}`, "lab-text-muted") +
    text(190, 252, fiShort ? "FI schaltet sofort ab" : "", "lab-text lab-text-force-2") +
    text(20, 24, effect, "lab-text lab-text-big") +
    text(190, 46, "Skala (logarithmisch): Körperstrom in mA", "lab-text-small") +
    CLOSE
  );
}

export const ELEKTRIK_RENDERERS: Partial<Record<LabKind, Renderer>> = {
  "elementary-magnets": elementaryMagnets,
  "field-lines": fieldLines,
  "charge-transfer": chargeTransfer,
  influence,
  "electro-filter": electroFilter,
  "current-flow": currentFlow,
  circuit,
  ammeter,
  "ions-field": ionsField,
  "body-current": bodyCurrent,
};
