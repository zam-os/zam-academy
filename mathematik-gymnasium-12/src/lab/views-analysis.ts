/**
 * Lab-Visualisierungen für Analysis (Stufen 1 und 4) in Mathematik 12.
 */

import type { LabValues, ReadoutValues } from "../model/types";
import { open, text, line, path, circle, handle, r1, W, H } from "./svg";

/** Zeichnet ein 2D-Koordinatensystem für Funktionsgraphen. */
export function drawAxes(
  cx: number,
  cy: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  scaleX: number,
  scaleY: number,
  xLabel = "x",
  yLabel = "y",
): string {
  let s = "";
  // Gitter
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
    const sx = cx + x * scaleX;
    s += line(sx, cy - yMax * scaleY, sx, cy - yMin * scaleY, "lab-grid-line");
    if (x !== 0 && x % 2 === 0) {
      s += text(sx, cy + 14, String(x), "lab-axis-tick", "middle");
    }
  }
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
    const sy = cy - y * scaleY;
    s += line(cx + xMin * scaleX, sy, cx + xMax * scaleX, sy, "lab-grid-line");
    if (y !== 0 && y % 2 === 0) {
      s += text(cx - 8, sy + 4, String(y), "lab-axis-tick", "end");
    }
  }
  // Achsen
  s += line(cx + xMin * scaleX, cy, cx + xMax * scaleX, cy, "lab-axis");
  s += line(cx, cy - yMin * scaleY, cx, cy - yMax * scaleY, "lab-axis");
  // Beschriftungen
  s += text(cx + xMax * scaleX + 8, cy + 4, xLabel, "lab-axis-label");
  s += text(cx - 12, cy - yMax * scaleY - 8, yLabel, "lab-axis-label", "end");
  return s;
}

/** Erzeugt einen SVG-Pfad aus einer stetigen mathematischen Funktion. */
export function plotFunction(
  fn: (x: number) => number,
  xMin: number,
  xMax: number,
  steps: number,
  cx: number,
  cy: number,
  scaleX: number,
  scaleY: number,
  cls: string,
): string {
  const dx = (xMax - xMin) / steps;
  let inPath = false;
  let d = "";

  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    const y = fn(x);
    if (!Number.isFinite(y)) {
      inPath = false;
      continue;
    }
    const sx = cx + x * scaleX;
    const sy = cy - y * scaleY;
    if (sy < -80 || sy > 420 || sx < -80 || sx > 600) {
      inPath = false;
      continue;
    }
    if (!inPath) {
      d += `M ${r1(sx)} ${r1(sy)} `;
      inPath = true;
    } else {
      d += `L ${r1(sx)} ${r1(sy)} `;
    }
  }
  return d ? path(d, cls) : "";
}

// 1. Kurvenschar ganzrational: f_a(x) = x³ - a·x
export function polynomialFamilyView(v: LabValues, _r: ReadoutValues): string {
  const a = v.a ?? 3;
  const cx = 260;
  const cy = 170;
  const scale = 26;
  let s = open("Ganzrationale Funktionenschar");
  s += drawAxes(cx, cy, -8, 8, -5, 5, scale, scale);
  // Plot Scharkurve
  s += plotFunction((x) => 0.25 * (x * x * x - a * x), -6, 6, 120, cx, cy, scale, scale, "lab-line-thick lab-accent");
  s += text(20, 30, `f_${a}(x) = 0,25 · (x³ − ${a}x)`, "lab-title");
  s += text(20, 52, `Nullstellen bei x = 0 und x = ±√${a > 0 ? a : "—"}`, "lab-legend");
  s += "</svg>";
  return s;
}

// 2. Stammfunktion & Ableitungsgraph
export function antiderivativeGraphView(v: LabValues, _r: ReadoutValues): string {
  const c = v.C ?? 0;
  const cx = 260;
  const cy = 170;
  const scale = 26;
  let s = open("Stammfunktion und Ableitungsgraph");
  s += drawAxes(cx, cy, -8, 8, -5, 5, scale, scale);
  // f(x) = x² - 4 (blau)
  s += plotFunction((x) => 0.5 * (x * x - 4), -5, 5, 80, cx, cy, scale, scale, "lab-line lab-primary");
  // F(x) = 0.5 * (x³/3 - 4x) + C (rot/accent)
  s += plotFunction((x) => 0.5 * ((x * x * x) / 3 - 4 * x) + c, -5, 5, 100, cx, cy, scale, scale, "lab-line-thick lab-accent");
  s += text(20, 30, "f(x) = 0,5(x² − 4)  [blau]", "lab-title");
  s += text(20, 52, `F_${c}(x) = 0,5(x³/3 − 4x) + ${c}  [orange]`, "lab-legend");
  s += "</svg>";
  return s;
}

// 3. Exponentialfunktion mit Produkt- und Kettenregel
export function expDerivativesView(v: LabValues, _r: ReadoutValues): string {
  const a = v.a ?? 1;
  const k = v.k ?? -1;
  const cx = 240;
  const cy = 180;
  const scale = 28;
  let s = open("Exponentialfunktion Ableitungsregeln");
  s += drawAxes(cx, cy, -6, 6, -4, 5, scale, scale);
  // f(x) = (x - a) * e^(k*x)
  s += plotFunction((x) => (x - a) * Math.exp(k * x), -4, 5, 120, cx, cy, scale, scale, "lab-line-thick lab-accent");
  s += text(20, 30, `f(x) = (x − ${a}) · e^{${k}x}`, "lab-title");
  s += text(20, 52, "Produkt- & Kettenregel: f'(x) = [1 + k(x − a)] · e^{kx}", "lab-legend");
  s += "</svg>";
  return s;
}

// 4. Grenzwerte: e^x vs. x^n
export function expLimitsView(v: LabValues, _r: ReadoutValues): string {
  const n = v.n ?? 2;
  const cx = 100;
  const cy = 240;
  const scaleX = 40;
  const scaleY = 30;
  let s = open("Grenzwerte im Unendlichen");
  s += drawAxes(cx, cy, -1, 10, -1, 7, scaleX, scaleY);
  // x^n / e^x
  s += plotFunction((x) => Math.pow(Math.max(0, x), n) / Math.exp(x), 0, 9, 120, cx, cy, scaleX, scaleY * 2, "lab-line-thick lab-accent");
  s += text(20, 30, `Verhältnis x^${n} / e^x für x → +∞`, "lab-title");
  s += text(20, 52, "Die e-Funktion wächst stärker als jede Potenz: Limes = 0", "lab-legend");
  s += "</svg>";
  return s;
}

// 5. Kurvendiskussion e-Funktion: f(x) = (x² - a) * e^-x
export function expCurveView(v: LabValues, _r: ReadoutValues): string {
  const a = v.a ?? 4;
  const cx = 200;
  const cy = 180;
  const scale = 25;
  let s = open("Kurvendiskussion e-Funktion");
  s += drawAxes(cx, cy, -5, 8, -5, 5, scale, scale);
  s += plotFunction((x) => (x * x - a) * Math.exp(-0.5 * x), -3, 7, 120, cx, cy, scale, scale, "lab-line-thick lab-accent");
  s += text(20, 30, `f(x) = (x² − ${a}) · e^{−0,5x}`, "lab-title");
  s += text(20, 52, `Nullstellen bei x = ±√${a}`, "lab-legend");
  s += "</svg>";
  return s;
}

// 6. Exponentielles Wachstum & Abklingen
export function expGrowthView(v: LabValues, _r: ReadoutValues): string {
  const n0 = v.N0 ?? 100;
  const k = (v.k ?? -3) * 0.1;
  const cx = 80;
  const cy = 260;
  const scaleX = 35;
  const scaleY = 1.8;
  let s = open("Wachstums- und Abklingmodelle");
  s += drawAxes(cx, cy, 0, 11, 0, 120, scaleX, scaleY, "t", "N(t)");
  s += plotFunction((t) => n0 * Math.exp(k * t), 0, 10, 100, cx, cy, scaleX, scaleY, "lab-line-thick lab-accent");
  s += text(20, 30, `N(t) = ${n0} · e^{${r1(k)}t}`, "lab-title");
  const charTime = k !== 0 ? r1(Math.log(2) / Math.abs(k)) : "—";
  const charLabel = k < 0 ? `Halbwertszeit T_H = ${charTime} Std` : k > 0 ? `Verdopplungszeit T_V = ${charTime} Std` : "Bestand konstant";
  s += text(20, 52, `${charLabel} (Basiswechsel: a^t = e^{(ln a) · t})`, "lab-legend");
  s += "</svg>";
  return s;
}

// 7. Ableitung von Sinus und Kosinus
export function trigTangentView(v: LabValues, _r: ReadoutValues): string {
  const x0 = (v.x0 ?? 0) * 0.25 * Math.PI;
  const cx = 260;
  const cy = 170;
  const scaleX = 35;
  const scaleY = 60;
  let s = open("Ableitung Sinus und Kosinus");
  s += drawAxes(cx, cy, -6, 6, -2, 2, scaleX, scaleY);
  // f(x) = sin(x)
  s += plotFunction(Math.sin, -5, 5, 100, cx, cy, scaleX, scaleY, "lab-line-thick lab-primary");
  // f'(x) = cos(x)
  s += plotFunction(Math.cos, -5, 5, 100, cx, cy, scaleX, scaleY, "lab-line lab-accent");
  // Tangente bei x0
  const y0 = Math.sin(x0);
  const m = Math.cos(x0);
  const sx0 = cx + x0 * scaleX;
  const sy0 = cy - y0 * scaleY;
  s += handle("x0", sx0, sy0, "Berührstelle x0");
  const slopeScreen = m * (scaleY / scaleX);
  s += line(sx0 - 40, sy0 + 40 * slopeScreen, sx0 + 40, sy0 - 40 * slopeScreen, "lab-line-dashed");
  s += text(20, 30, "f(x) = sin(x) [blau] und f'(x) = cos(x) [orange]", "lab-title");
  s += text(20, 52, `Tangentensteigung bei x = ${r1(x0 / Math.PI)}π: m = ${r1(m)}`, "lab-legend");
  s += "</svg>";
  return s;
}

// 8. Trigonometrische Verknüpfungen
export function trigCompositionView(v: LabValues, _r: ReadoutValues): string {
  const a = v.a ?? 2;
  const omega = v.omega ?? 1;
  const cx = 260;
  const cy = 170;
  const scaleX = 35;
  const scaleY = 30;
  let s = open("Trigonometrische Schwingungen");
  s += drawAxes(cx, cy, -6, 6, -4, 4, scaleX, scaleY);
  s += plotFunction((x) => a * Math.sin(omega * x), -5, 5, 120, cx, cy, scaleX, scaleY, "lab-line-thick lab-accent");
  s += text(20, 30, `f(x) = ${a} · sin(${omega}x)`, "lab-title");
  s += text(20, 52, `Ableitung nach Kettenregel: f'(x) = ${a * omega} · cos(${omega}x)`, "lab-legend");
  s += "</svg>";
  return s;
}

// 9. Quotientenregel: f(x) = (ax + b) / (cx + d)
export function quotientRuleView(v: LabValues, _r: ReadoutValues): string {
  const a = v.a ?? 2;
  const b = v.b ?? 1;
  const pole = v.pole ?? 2;
  const cx = 260;
  const cy = 170;
  const scale = 25;
  let s = open("Quotientenregel bei gebrochen-rationalen Funktionen");
  s += drawAxes(cx, cy, -7, 7, -5, 5, scale, scale);
  // f(x) = (a*x + b) / (x - pole)
  s += plotFunction((x) => Math.abs(x - pole) < 0.2 ? NaN : (a * x + b) / (x - pole), -6, 6, 140, cx, cy, scale, scale, "lab-line-thick lab-accent");
  // Senkrechte Asymptote bei x = pole
  const sxPole = cx + pole * scale;
  s += line(sxPole, 30, sxPole, H - 30, "lab-line-dashed");
  // Waagrechte Asymptote bei y = a
  const syAsymp = cy - a * scale;
  s += line(30, syAsymp, W - 30, syAsymp, "lab-line-dashed");
  s += text(20, 30, `f(x) = (${a}x + ${b}) / (x − ${pole})`, "lab-title");
  s += text(20, 52, `Senkrechte Asymptote x = ${pole}, waagrechte Asymptote y = ${a}`, "lab-legend");
  s += "</svg>";
  return s;
}

// 10. Gebrochen-rationale Kurvendiskussion
export function rationalCurveView(v: LabValues, _r: ReadoutValues): string {
  const a = v.a ?? 4;
  const cx = 260;
  const cy = 170;
  const scale = 25;
  let s = open("Kurvendiskussion rationaler Funktionen");
  s += drawAxes(cx, cy, -7, 7, -5, 5, scale, scale);
  // f(x) = (x² - a) / (x² + 1)
  s += plotFunction((x) => (x * x - a) / (x * x + 1), -6, 6, 120, cx, cy, scale, scale * 1.5, "lab-line-thick lab-accent");
  s += text(20, 30, `f(x) = (x² − ${a}) / (x² + 1)`, "lab-title");
  s += text(20, 52, `Nullstellen x = ±√${a}, Asymptote y = 1`, "lab-legend");
  s += "</svg>";
  return s;
}

// 11. Quotientenregel mit e-Funktion / Trigonometrie
export function quotientCompositionsView(v: LabValues, _r: ReadoutValues): string {
  const a = v.a ?? 1;
  const cx = 260;
  const cy = 170;
  const scale = 28;
  let s = open("Verknüpfungen mit Quotientenregel");
  s += drawAxes(cx, cy, -6, 6, -4, 4, scale, scale);
  // f(x) = e^x / (x + a)
  s += plotFunction((x) => Math.abs(x + a) < 0.25 ? NaN : Math.exp(0.5 * x) / (x + a), -5, 5, 140, cx, cy, scale, scale, "lab-line-thick lab-accent");
  s += text(20, 30, `f(x) = e^{0,5x} / (x + ${a})`, "lab-title");
  s += text(20, 52, "Quotientenregel: f'(x) = [u'v − uv'] / v²", "lab-legend");
  s += "</svg>";
  return s;
}

// 12. Umkehrfunktion & Wurzelfunktion
export function inverseFunctionView(v: LabValues, _r: ReadoutValues): string {
  const a = v.a ?? 1;
  const cx = 160;
  const cy = 240;
  const scale = 30;
  let s = open("Umkehrbarkeit und Wurzelfunktion");
  s += drawAxes(cx, cy, -1, 8, -1, 7, scale, scale);
  // Winkelhalbierende y = x
  s += line(cx - 30, cy + 30, cx + 200, cy - 200, "lab-line-dashed");
  // f(x) = a * x² (x >= 0)
  s += plotFunction((x) => a * x * x, 0, 3, 60, cx, cy, scale, scale, "lab-line lab-primary");
  // f^-1(x) = sqrt(x / a)
  s += plotFunction((x) => Math.sqrt(x / a), 0, 7, 80, cx, cy, scale, scale, "lab-line-thick lab-accent");
  s += text(20, 30, `f(x) = ${a}x² [blau] und f^{−1}(x) = √(x/${a}) [orange]`, "lab-title");
  s += text(20, 52, "Spiegelung an der ersten Winkelhalbierenden y = x", "lab-legend");
  s += "</svg>";
  return s;
}

// 13. Potenzen mit rationalen Exponenten
export function rationalPowersView(v: LabValues, _r: ReadoutValues): string {
  const p = v.p ?? 1;
  const q = v.q ?? 3;
  const exp = p / q;
  const cx = 140;
  const cy = 220;
  const scale = 32;
  let s = open("Rationale Exponenten");
  s += drawAxes(cx, cy, -1, 8, -1, 6, scale, scale);
  s += plotFunction((x) => Math.pow(Math.max(0, x), exp), 0, 7, 80, cx, cy, scale, scale, "lab-line-thick lab-accent");
  const rootSymbol = q === 2 ? "√" : `${q}√`;
  const radicand = p === 1 ? "x" : `x^${p}`;
  s += text(20, 30, `f(x) = x^{${p}/${q}} = ${rootSymbol}${radicand}`, "lab-title");
  s += text(20, 52, `Ableitung: f'(x) = (${p}/${q}) · x^{${p - q}/${q}}`, "lab-legend");
  s += "</svg>";
  return s;
}

// 14. Kurvendiskussion Wurzelfunktion
export function rootCurveView(v: LabValues, _r: ReadoutValues): string {
  const c = v.c ?? 2;
  const cx = 160;
  const cy = 200;
  const scale = 30;
  let s = open("Kurvendiskussion Wurzelfunktion");
  s += drawAxes(cx, cy, -3, 8, -2, 5, scale, scale);
  s += plotFunction((x) => (x + c >= 0 ? Math.sqrt(x + c) : NaN), -c, 7, 80, cx, cy, scale, scale, "lab-line-thick lab-accent");
  s += text(20, 30, `f(x) = √(x + ${c})`, "lab-title");
  s += text(20, 52, `Definitionsbereich D = [−${c}; +∞[, Randsteigung → +∞`, "lab-legend");
  s += "</svg>";
  return s;
}

// 15. Ableitung der natürlichen Logarithmusfunktion
export function lnDerivativeView(v: LabValues, _r: ReadoutValues): string {
  const x0 = v.x0 ?? 2;
  const cx = 160;
  const cy = 180;
  const scale = 35;
  let s = open("Natürliche Logarithmusfunktion");
  s += drawAxes(cx, cy, -1, 7, -4, 4, scale, scale);
  // f(x) = ln(x)
  s += plotFunction((x) => (x > 0.05 ? Math.log(x) : NaN), 0.05, 6.5, 100, cx, cy, scale, scale, "lab-line-thick lab-accent");
  // f'(x) = 1/x
  s += plotFunction((x) => (x > 0.1 ? 1 / x : NaN), 0.1, 6.5, 80, cx, cy, scale, scale, "lab-line lab-primary");
  // Tangente bei x0
  const y0 = Math.log(x0);
  const m = 1 / x0;
  const sx0 = cx + x0 * scale;
  const sy0 = cy - y0 * scale;
  s += handle("x0", sx0, sy0, "Stelle x0");
  s += line(sx0 - 40, sy0 + 40 * m, sx0 + 40, sy0 - 40 * m, "lab-line-dashed");
  s += text(20, 30, "f(x) = ln(x) [orange], f'(x) = 1/x [blau]", "lab-title");
  s += text(20, 52, `Steigung bei x = ${x0}: m = 1/${x0} = ${r1(m)}`, "lab-legend");
  s += "</svg>";
  return s;
}

// 16. Grenzwerte mit ln-Funktion
export function lnLimitsView(v: LabValues, _r: ReadoutValues): string {
  const zoom = Math.max(1, Math.min(4, v.zoom ?? 1));
  const cx = 100;
  const cy = 200;
  const scaleX = 40 * zoom;
  const scaleY = 50 * zoom;
  let s = open("Grenzwerte mit ln");
  s += drawAxes(cx, cy, -0.5, 6 / zoom, -2 / zoom, 2 / zoom, scaleX, scaleY);
  // f(x) = x * ln(x)
  s += plotFunction((x) => (x > 0.005 ? x * Math.log(x) : NaN), 0.005, 5 / zoom, 100, cx, cy, scaleX, scaleY, "lab-line-thick lab-accent");
  const minX = 1 / Math.E;
  const minY = -1 / Math.E;
  const sMinX = cx + minX * scaleX;
  const sMinY = cy - minY * scaleY;
  s += circle(sMinX, sMinY, 4, "lab-primary");
  s += text(sMinX + 8, sMinY + 4, "T(1/e | −1/e)", "lab-axis-label");
  s += text(20, 30, `f(x) = x · ln(x) (Zoom ${zoom}×)`, "lab-title");
  s += text(20, 52, "Grenzwerte: lim_{x→0+} x·ln(x) = 0 und lim_{x→+∞} ln(x)/x = 0", "lab-legend");
  s += "</svg>";
  return s;
}
