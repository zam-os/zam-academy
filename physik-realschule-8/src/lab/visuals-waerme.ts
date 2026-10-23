import { fmt, fmtUnit } from "../exercises/format";
import type { LabKind, LabValues, ReadoutValues } from "../model/types";
import {
  arrow,
  CLOSE,
  circle,
  clamp,
  heatColor,
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
import {
  conductionTemp,
  diffusivity,
  heatingState,
  ICE_DENSITY,
  PROBE_POSITION,
  waterDensity,
} from "./physics";

type Renderer = (v: LabValues, r: ReadoutValues) => string;

// ─── 4.1 Innere Energie ───────────────────────────────────────────────────

function internalEnergy(v: LabValues, r: ReadoutValues): string {
  const speed = num(r, "speed");
  const dU = num(r, "dU");
  const bx = 160;
  const by = 70;
  const bw = 210;
  const bh = 160;
  let particles = "";
  for (let i = 0; i < 16; i++) {
    const x = bx + 20 + jitter(i, 11) * (bw - 40);
    const y = by + 20 + jitter(i, 12) * (bh - 40);
    const a = jitter(i, 13) * Math.PI * 2;
    const len = 6 + speed * 16;
    particles += circle(x, y, 7, "lab-particle") + arrow(x, y, x + Math.cos(a) * len, y + Math.sin(a) * len, "lab-velocity", 2);
  }
  const wLen = (v.W / 500) * 90;
  const qLen = (Math.abs(v.Q) / 300) * 80;
  const barMax = 2000;
  const total = clamp(1000 + dU, 0, barMax);
  const ub = 400;
  return (
    open("Ein Körper, dessen Teilchen durch Reibungsarbeit und Wärme schneller oder langsamer werden") +
    `<path d="M${bx} ${by} V${by + bh} H${bx + bw} V${by}" class="lab-wall" />` +
    particles +
    (v.W > 0 ? arrow(bx - 10 - wLen, by + 40, bx - 4, by + 40, "lab-force", 4) + text(20, by + 64, `Reibungsarbeit W = ${fmt(v.W, 0)} J`, "lab-text-small") : "") +
    (v.Q > 0 ? arrow(bx + bw / 2, by + bh + 50, bx + bw / 2, by + bh + 4, "lab-force-2", 4) : "") +
    (v.Q < 0 ? arrow(bx + bw / 2, by + bh + 4, bx + bw / 2, by + bh + 4 + qLen, "lab-velocity", 4) : "") +
    (v.Q !== 0 ? text(bx + bw / 2 + 10, by + bh + 36, `Wärme Q = ${v.Q > 0 ? "+" : "−"}${fmt(Math.abs(v.Q), 0)} J`, "lab-text-small") : "") +
    rect(ub + 50, 60, 24, 180, "lab-bar-in", 'style="opacity:0.25"') +
    rect(ub + 50, 240 - (total / barMax) * 180, 24, (total / barMax) * 180, dU >= 0 ? "lab-bar-kin" : "lab-bar-pot") +
    line(ub + 44, 240 - (1000 / barMax) * 180, ub + 80, 240 - (1000 / barMax) * 180, "lab-axis") +
    text(ub + 62, 254, "U", "lab-text-muted", "middle") +
    text(ub + 84, 240 - (1000 / barMax) * 180 + 4, "Start", "lab-text-small") +
    text(20, 28, `ΔU = W + Q = ${fmtUnit(dU, "J", 0)}`, "lab-text lab-text-big") +
    text(20, 50, `Temperatur ${str(r, "temp")}`, "lab-text-muted") +
    CLOSE
  );
}

// ─── 4.2 Temperaturskalen ─────────────────────────────────────────────────

function thermometer(v: LabValues, r: ReadoutValues): string {
  const top = 50;
  const bottom = 250;
  const yOf = (theta: number) => bottom - ((theta + 273.15) / 473.15) * (bottom - top);
  const y = yOf(v.theta);
  const columns: Array<{ x: number; name: string; ticks: Array<{ value: number; theta: number }>; value: string }> = [
    { x: 110, name: "°C", ticks: [-273, -200, -100, 0, 100, 200].map((c) => ({ value: c, theta: c })), value: `${fmt(v.theta, 0)} °C` },
    { x: 250, name: "K", ticks: [0, 100, 200, 300, 400].map((k) => ({ value: k, theta: k - 273.15 })), value: `${fmt(num(r, "T"), 2)} K` },
    { x: 390, name: "°F", ticks: [-400, -200, 0, 200, 400].map((f) => ({ value: f, theta: (f - 32) / 1.8 })), value: `${fmt(num(r, "F"), 1)} °F` },
  ];
  let cols = "";
  for (const c of columns) {
    cols += rect(c.x - 5, top, 10, bottom - top, "lab-tube") + rect(c.x - 5, y, 10, bottom - y, "lab-heater");
    for (const t of c.ticks) {
      const ty = yOf(t.theta);
      if (ty < top - 1 || ty > bottom + 1) continue;
      cols += line(c.x + 5, ty, c.x + 14, ty, "lab-axis") + text(c.x + 18, ty + 4, String(t.value), "lab-text-small");
    }
    cols += text(c.x, top - 14, c.name, "lab-text lab-text-big", "middle") + text(c.x, bottom + 22, c.value, "lab-text", "middle");
  }
  const ek = clamp(num(r, "Ekin"), 0, 3);
  return (
    open("Ein Thermometer mit drei Skalen: Celsius, Kelvin und Fahrenheit") +
    cols +
    line(60, y, 430, y, "lab-force", 'stroke-width="2" stroke-dasharray="5 4"') +
    rect(470, bottom - ek * 60, 24, ek * 60, "lab-bar-kin") +
    text(482, top - 14, "Teilchen", "lab-text-small", "middle") +
    text(482, bottom + 22, "E_kin", "lab-text-small", "middle") +
    CLOSE
  );
}

// ─── 4.3 Erwärmungskurve ──────────────────────────────────────────────────

function heatingCurve(v: LabValues): string {
  const gx = 60;
  const gy = 245;
  const gw = 420;
  const gh = 195;
  const xOf = (e: number) => gx + (e / 100) * gw;
  const yOf = (theta: number) => gy - ((theta + 20) / 140) * gh;
  let curve = "";
  for (let e = 0; e <= 100; e += 1) {
    const s = heatingState(e);
    curve += `${e === 0 ? "M" : "L"}${r1(xOf(e))} ${r1(yOf(s.theta))} `;
  }
  const cur = heatingState(v.E);
  // mini particle picture
  const px0 = 330;
  const py0 = 150;
  const pw = 150;
  const ph = 80;
  let dots = "";
  const solidShare = cur.state.startsWith("Eis") ? (cur.state === "Eis wird erwärmt" ? 1 : 1 - cur.fraction) : 0;
  const gasShare = cur.state.startsWith("Dampf") ? 1 : cur.state.startsWith("Wasser siedet") ? cur.fraction : 0;
  for (let i = 0; i < 24; i++) {
    const col = i % 6;
    const row = Math.floor(i / 6);
    const frac = i / 24;
    let x: number;
    let y: number;
    let cls = "lab-particle";
    if (frac < solidShare && solidShare > 0) {
      x = px0 + 14 + col * 24;
      y = py0 + ph - 12 - row * 18;
    } else if (frac >= 1 - gasShare && gasShare > 0) {
      x = px0 + 10 + jitter(i, 21) * (pw - 20);
      y = py0 + 10 + jitter(i, 22) * (ph - 20);
      cls = "lab-particle";
    } else {
      x = px0 + 14 + col * 24 + (jitter(i, 23) - 0.5) * 8;
      y = py0 + ph - 12 - row * 18 + (jitter(i, 24) - 0.5) * 8;
    }
    dots += circle(x, y, 5, cls);
  }
  return (
    open("Erwärmungskurve von Wasser mit Plateaus beim Schmelzen und Sieden") +
    line(gx, gy, gx + gw, gy, "lab-axis") +
    line(gx, gy, gx, gy - gh - 10, "lab-axis") +
    line(gx, yOf(0), gx + gw, yOf(0), "lab-grid") +
    line(gx, yOf(100), gx + gw, yOf(100), "lab-grid") +
    text(gx - 6, yOf(0) + 4, "0 °C", "lab-text-small", "end") +
    text(gx - 6, yOf(100) + 4, "100 °C", "lab-text-small", "end") +
    text(gx + gw, gy + 16, "zugeführte Energie →", "lab-text-small", "end") +
    path(curve, "lab-curve") +
    circle(xOf(v.E), yOf(cur.theta), 6, "lab-marker") +
    `<path d="M${px0} ${py0} V${py0 + ph} H${px0 + pw} V${py0}" class="lab-wall" />` +
    dots +
    text(20, 28, `${fmt(cur.theta, 0)} °C: ${cur.state}`, "lab-text lab-text-big") +
    CLOSE
  );
}

// ─── 4.4 Ausdehnung ───────────────────────────────────────────────────────

function expansion(v: LabValues, r: ReadoutValues): string {
  const base = 330;
  const dL = num(r, "dL");
  const rel = dL / (v.L0 * 1000);
  const ext = clamp(rel * 100 * base, 0, 110);
  const hot = v.dT / 100;
  return (
    open("Ein Stab vor und nach der Erwärmung, die Verlängerung ist stark übertrieben gezeichnet") +
    rect(60, 80, base, 30, "lab-metal") +
    text(60, 70, `vorher: L₀ = ${fmtUnit(v.L0, "m", 0)}`, "lab-text-small") +
    rect(60, 160, base, 30, "lab-hot", `style="opacity:${(0.35 + hot * 0.5).toFixed(2)}"`) +
    rect(60 + base, 160, ext, 30, "lab-hot", `style="opacity:${(0.35 + hot * 0.5).toFixed(2)}"`) +
    line(60 + base, 120, 60 + base, 200, "lab-grid") +
    line(60 + base + ext, 120, 60 + base + ext, 200, "lab-force", 'stroke-width="2"') +
    text(60, 150, `nachher: um ${fmtUnit(v.dT, "K", 0)} wärmer`, "lab-text-small") +
    text(60 + base + ext + 8, 180, `ΔL = ${fmtUnit(dL, "mm", 2)}`, "lab-text lab-text-force") +
    rect(60, 235, 14, 40, "lab-tube") +
    rect(60, 275 - hot * 40, 14, hot * 40, "lab-heater") +
    text(84, 262, "Erwärmung", "lab-text-small") +
    text(20, 28, `ΔL = α · L₀ · ΔT = ${fmtUnit(dL, "mm", 2)}`, "lab-text lab-text-big") +
    text(20, 50, "Verlängerung im Bild 100-fach übertrieben", "lab-text-muted") +
    CLOSE
  );
}

// ─── 4.5 Anomalie des Wassers ─────────────────────────────────────────────

function waterAnomaly(v: LabValues, r: ReadoutValues): string {
  const gx = 50;
  const gy = 240;
  const gw = 220;
  const gh = 160;
  const rhoMin = 999.6;
  const rhoMax = 1000.0;
  const xOf = (theta: number) => gx + (theta / 10) * gw;
  const yOf = (rho: number) => gy - ((rho - rhoMin) / (rhoMax - rhoMin)) * gh;
  let curve = "";
  for (let t = 0; t <= 10.001; t += 0.5) curve += `${t === 0 ? "M" : "L"}${r1(xOf(t))} ${r1(yOf(waterDensity(t)))} `;
  const isIce = v.phase === 1;
  const rho = num(r, "rho");
  const lakeX = 330;
  const layers = [
    { label: "Eis, 0 °C", color: "#e0f2fe" },
    { label: "1 °C", color: "#bfdbfe" },
    { label: "2 °C", color: "#93c5fd" },
    { label: "3 °C", color: "#60a5fa" },
    { label: "4 °C", color: "#3b82f6" },
  ];
  let lake = "";
  layers.forEach((layer, i) => {
    lake += rect(lakeX, 70 + i * 24, 120, 24, "lab-fluid", `style="fill:${layer.color};opacity:1"`) + text(lakeX + 126, 87 + i * 24, layer.label, "lab-text-small");
  });
  const iceSide = 56 * Math.sqrt(1e6 / ICE_DENSITY / 1000);
  return (
    open("Dichte von Wasser zwischen 0 und 10 Grad Celsius und ein See im Winter") +
    line(gx, gy, gx + gw, gy, "lab-axis") +
    line(gx, gy, gx, gy - gh - 10, "lab-axis") +
    text(gx + gw, gy + 16, "θ in °C (0 … 10)", "lab-text-small", "end") +
    text(gx + 4, gy - gh - 14, "Dichte (999,6 … 1000,0 kg/m³)", "lab-text-small") +
    path(curve, "lab-curve") +
    (isIce ? "" : line(xOf(v.theta), gy, xOf(v.theta), yOf(rho), "lab-normal") + circle(xOf(v.theta), yOf(rho), 6, "lab-marker")) +
    line(xOf(4), gy, xOf(4), gy - gh, "lab-grid") +
    text(xOf(4), gy + 16, "4 °C", "lab-text-small", "middle") +
    lake +
    text(lakeX, 56, "See im Winter", "lab-text-muted") +
    rect(lakeX, 220, 56, 56, "lab-fluid", 'style="opacity:0.6"') +
    rect(lakeX + 70, 276 - iceSide, iceSide, iceSide, "lab-ice", 'style="stroke:var(--lab-wall);stroke-width:1.5"') +
    text(lakeX + 28, 212, "1000 g Wasser", "lab-text-small", "middle") +
    text(lakeX + 70 + iceSide / 2, 212, "1000 g Eis", "lab-text-small", "middle") +
    text(20, 28, isIce ? `Eis: ${fmtUnit(rho, "kg/m³", 0)}` : `ρ = ${fmtUnit(rho, "kg/m³", 2)}`, "lab-text lab-text-big") +
    CLOSE
  );
}

// ─── 4.6 Wärmeleitung ─────────────────────────────────────────────────────

function conduction(v: LabValues, r: ReadoutValues): string {
  const x0 = 70;
  const ppm = 380 / 0.5; // px per metre: 50 cm rod
  const y0 = 150;
  const a = diffusivity(v.lambda);
  const t = v.t * 60;
  let segments = "";
  let profile = "";
  for (let i = 0; i < 50; i++) {
    const x = (i + 0.5) / 100;
    const theta = conductionTemp(a, t, x);
    segments += rect(x0 + i * 7.6, y0, 7.8, 30, "lab-metal", `style="fill:${heatColor(theta, 20, 100)};stroke:none"`);
    profile += `${i === 0 ? "M" : "L"}${r1(x0 + i * 7.6 + 3.8)} ${r1(130 - ((theta - 20) / 80) * 70)} `;
  }
  const px = x0 + PROBE_POSITION * ppm;
  return (
    open("Ein Stab, dessen linkes Ende auf 100 Grad Celsius gehalten wird, mit Temperaturverlauf und Messstelle") +
    polygon([[x0 - 36, y0 - 6], [x0 - 4, y0 - 6], [x0 - 4, y0 + 36], [x0 - 36, y0 + 36]], "lab-heater") +
    text(x0 - 20, y0 + 56, "100 °C", "lab-text-small", "middle") +
    segments +
    path(profile, "lab-curve") +
    line(x0, 130, x0 + 380, 130, "lab-grid") +
    line(px, y0 - 12, px, y0 + 44, "lab-axis", 'stroke-width="3"') +
    circle(px, y0 + 56, 7, "lab-marker") +
    text(px, y0 + 82, `Messstelle 30 cm: ${fmt(num(r, "probe"), 1)} °C`, "lab-text", "middle") +
    text(x0 + 380, y0 + 52, "50 cm", "lab-text-small", "end") +
    text(20, 28, `Nach ${fmt(v.t, 0)} min`, "lab-text lab-text-big") +
    text(20, 50, "Kurve: Temperatur entlang des Stabes (oben 100 °C)", "lab-text-small") +
    CLOSE
  );
}

// ─── 4.7 Thermoskanne ─────────────────────────────────────────────────────

function thermos(v: LabValues, r: ReadoutValues): string {
  const x0 = 150;
  const x1 = 270;
  const top = 95;
  const bottom = 272;
  const loss = (key: string) => num(r, key);
  const len = (watts: number) => 14 + watts * 16;
  const steam = v.lid === 0 ? path(`M185 ${top - 4} q8 -8 0 -16 q-8 -8 0 -16 M215 ${top - 4} q8 -8 0 -16 q-8 -8 0 -16 M245 ${top - 4} q8 -8 0 -16 q-8 -8 0 -16`, "lab-steam") : "";
  return (
    open("Eine Thermoskanne mit Vakuum, Verspiegelung und Stopfen und den Wärmeverlusten nach außen") +
    rect(x0, top, x1 - x0, bottom - top, "lab-tube") +
    rect(x0 + 14, top + 24, x1 - x0 - 28, bottom - top - 38, "lab-fluid", 'style="fill:#b45309;opacity:0.55"') +
    (v.vac === 1 ? rect(x0 + 4, top + 4, 6, bottom - top - 8, "lab-grid", 'style="stroke:none;fill:var(--lab-axis);opacity:0.25"') + rect(x1 - 10, top + 4, 6, bottom - top - 8, "lab-grid", 'style="stroke:none;fill:var(--lab-axis);opacity:0.25"') + text(x0 - 6, top + 70, "Vakuum", "lab-text-small", "end") : "") +
    (v.mirror === 1 ? line(x0 + 12, top + 6, x0 + 12, bottom - 6, "lab-mirror") + line(x1 - 12, top + 6, x1 - 12, bottom - 6, "lab-mirror") + text(x0 - 6, top + 100, "Spiegelschicht", "lab-text-small", "end") : "") +
    (v.lid === 1 ? rect(x0 + 8, top - 14, x1 - x0 - 16, 16, "lab-block") + text(x0 + 8, top - 20, "Stopfen", "lab-text-small", "start") : steam) +
    arrow(x1 + 4, 125, x1 + 4 + len(loss("conduction")), 125, "lab-force", 3) +
    text(x1 + 12 + len(loss("conduction")), 129, `Leitung ${fmt(loss("conduction"), 1)} W`, "lab-text-small") +
    arrow(x1 + 4, 165, x1 + 4 + len(loss("convection")), 165, "lab-force", 3) +
    text(x1 + 12 + len(loss("convection")), 169, `Konvektion ${fmt(loss("convection"), 1)} W`, "lab-text-small") +
    arrow(x1 + 4, 205, x1 + 4 + len(loss("radiation")), 205, "lab-force", 3) +
    text(x1 + 12 + len(loss("radiation")), 209, `Strahlung ${fmt(loss("radiation"), 1)} W`, "lab-text-small") +
    arrow(x1 + 4, 245, x1 + 4 + len(loss("opening")), 245, "lab-force", 3) +
    text(x1 + 12 + len(loss("opening")), 249, `Öffnung ${fmt(loss("opening"), 1)} W`, "lab-text-small") +
    text(20, 28, `Verlust ${fmtUnit(loss("total"), "W", 1)}`, "lab-text lab-text-big") +
    text(20, 50, `Tee nach 8 h: ${fmtUnit(loss("tea"), "°C", 0)} (Start 90 °C)`, "lab-text-muted") +
    CLOSE
  );
}

export const WAERME_RENDERERS: Partial<Record<LabKind, Renderer>> = {
  "internal-energy": internalEnergy,
  thermometer,
  "heating-curve": heatingCurve,
  expansion,
  "water-anomaly": waterAnomaly,
  conduction,
  thermos,
};
