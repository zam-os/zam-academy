/**
 * Lab-Visualisierungen für 3D-Koordinatengeometrie im Raum (Stufe 5).
 */

import type { LabValues, ReadoutValues } from "../model/types";
import { open, text, line, polygon, circle, fmtDez } from "./svg";
import { project3D, add3, cross3, dot3, len3, type Vec3 } from "../math/vectors";

// 26. 3D-Koordinatensystem und Raumpunkte
export function coordinates3dView(v: LabValues, _r: ReadoutValues): string {
  const p: Vec3 = [v.x1 ?? 3, v.x2 ?? 4, v.x3 ?? 5];
  const cx = 260;
  const cy = 200;
  const scale = 22;

  let s = open("3D-Koordinatensystem und Raumpunkt");
  const orig = project3D([0, 0, 0], cx, cy, scale);
  const ax1 = project3D([7, 0, 0], cx, cy, scale);
  const ax2 = project3D([0, 7, 0], cx, cy, scale);
  const ax3 = project3D([0, 0, 7], cx, cy, scale);

  // Achsen
  s += line(orig.x, orig.y, ax1.x, ax1.y, "lab-axis-thick");
  s += text(ax1.x - 14, ax1.y + 16, "x1", "lab-axis-label");
  s += line(orig.x, orig.y, ax2.x, ax2.y, "lab-axis-thick");
  s += text(ax2.x + 8, ax2.y + 4, "x2", "lab-axis-label");
  s += line(orig.x, orig.y, ax3.x, ax3.y, "lab-axis-thick");
  s += text(ax3.x, ax3.y - 10, "x3", "lab-axis-label", "middle");

  // Hilfslinien zum Punkt P(x1, x2, x3)
  const p12 = project3D([p[0], p[1], 0], cx, cy, scale);
  const p1 = project3D([p[0], 0, 0], cx, cy, scale);
  const pPt = project3D(p, cx, cy, scale);

  s += line(p1.x, p1.y, p12.x, p12.y, "lab-line-dashed");
  s += line(p12.x, p12.y, pPt.x, pPt.y, "lab-line-dashed");
  s += circle(pPt.x, pPt.y, 6, "lab-handle");
  s += text(pPt.x + 10, pPt.y - 8, `P(${p[0]}|${p[1]}|${p[2]})`, "lab-text-bold");

  s += text(20, 30, `Punkt P(${p[0]}|${p[1]}|${p[2]}) im Raum R³`, "lab-title");
  s += text(20, 52, `Spiegelung an x1-x2-Ebene: P'(${p[0]}|${p[1]}|−${p[2]})`, "lab-legend");
  s += "</svg>";
  return s;
}

// 27. Vektoralgebra: Summe und Skalierung
export function vectorAlgebraView(v: LabValues, _r: ReadoutValues): string {
  const a: Vec3 = [v.a1 ?? 2, v.a2 ?? 3, v.a3 ?? 2];
  const b: Vec3 = [v.b1 ?? 1, v.b2 ?? 2, v.b3 ?? 3];
  const sum = add3(a, b);

  const cx = 220;
  const cy = 220;
  const scale = 22;

  let s = open("Vektoraddition im Raum");
  const orig = project3D([0, 0, 0], cx, cy, scale);
  const pA = project3D(a, cx, cy, scale);
  const pSum = project3D(sum, cx, cy, scale);

  // Vektor a
  s += line(orig.x, orig.y, pA.x, pA.y, "lab-line-thick lab-primary");
  s += text(pA.x - 12, pA.y, "a", "lab-axis-label");
  // Vektor b angehängt an a
  s += line(pA.x, pA.y, pSum.x, pSum.y, "lab-line-thick lab-muted");
  s += text(pSum.x + 10, pSum.y, "a + b", "lab-text-accent");
  // Summenvektor a + b
  s += line(orig.x, orig.y, pSum.x, pSum.y, "lab-line-thick lab-accent");

  s += text(20, 30, `Vektoraddition: a + b = (${sum[0]}|${sum[1]}|${sum[2]})`, "lab-title");
  s += text(20, 52, "Grafische Aneinanderhängung nach dem Parallelogrammgesetz", "lab-legend");
  s += "</svg>";
  return s;
}

// 28. Skalarprodukt und Schnittwinkel
export function dotProductView(v: LabValues, _r: ReadoutValues): string {
  const a: Vec3 = [v.a1 ?? 3, v.a2 ?? 0, v.a3 ?? 0];
  const b: Vec3 = [v.b1 ?? 2, v.b2 ?? (v.b2 ?? 2), v.b3 ?? 0];
  const dot = dot3(a, b);
  const lenA = len3(a);
  const lenB = len3(b);
  const cosW = Math.max(-1, Math.min(1, dot / (lenA * lenB)));
  const angle = (Math.acos(cosW) * 180) / Math.PI;

  const cx = 200;
  const cy = 200;
  const scale = 26;

  let s = open("Skalarprodukt und Winkel");
  const orig = project3D([0, 0, 0], cx, cy, scale);
  const pA = project3D(a, cx, cy, scale);
  const pB = project3D(b, cx, cy, scale);

  s += line(orig.x, orig.y, pA.x, pA.y, "lab-line-thick lab-primary");
  s += line(orig.x, orig.y, pB.x, pB.y, "lab-line-thick lab-accent");
  s += text(pA.x + 8, pA.y + 4, "a", "lab-axis-label");
  s += text(pB.x + 8, pB.y - 4, "b", "lab-axis-label");

  s += text(20, 30, `Skalarprodukt: a · b = ${fmtDez(dot, 1)}`, "lab-title");
  s += text(20, 52, `Schnittwinkel: φ = ${fmtDez(angle, 1)}° (Orthogonal wenn a · b = 0)`, "lab-legend");
  s += "</svg>";
  return s;
}

// 29. Vektorprodukt (Kreuzprodukt) & Flächeninhalt
export function crossProductView(v: LabValues, _r: ReadoutValues): string {
  const a: Vec3 = [v.a1 ?? 3, v.a2 ?? 0, v.a3 ?? 0];
  const b: Vec3 = [v.b1 ?? 0, v.b2 ?? 3, v.b3 ?? 0];
  const n = cross3(a, b);
  const area = len3(n);

  const cx = 240;
  const cy = 220;
  const scale = 20;

  let s = open("Vektorprodukt und Parallelogrammfläche");
  const p0 = project3D([0, 0, 0], cx, cy, scale);
  const pA = project3D(a, cx, cy, scale);
  const pB = project3D(b, cx, cy, scale);
  const pAB = project3D(add3(a, b), cx, cy, scale);
  const pN = project3D(n, cx, cy, scale * 0.3);

  // Parallelogrammfläche
  s += polygon([p0, pA, pAB, pB], "lab-polygon-accent");
  s += line(p0.x, p0.y, pA.x, pA.y, "lab-line-thick lab-primary");
  s += line(p0.x, p0.y, pB.x, pB.y, "lab-line-thick lab-primary");
  // Normalenvektor
  s += line(p0.x, p0.y, pN.x, pN.y, "lab-line-thick lab-accent");
  s += text(pN.x + 8, pN.y - 8, "n = a × b", "lab-text-accent");

  s += text(20, 30, `Vektorprodukt: n = a × b = (${n[0]}|${n[1]}|${n[2]})`, "lab-title");
  s += text(20, 52, `Flächeninhalt Parallelogramm: A = |a × b| = ${fmtDez(area, 2)}`, "lab-legend");
  s += "</svg>";
  return s;
}

// 30. Geometrische Körper im Raum (Pyramide)
export function solids3dView(v: LabValues, _r: ReadoutValues): string {
  const a = v.a ?? 4;
  const h = v.h ?? 5;
  const vol = (1 / 3) * a * a * h;

  const cx = 260;
  const cy = 230;
  const scale = 20;

  let s = open("Geometrische Körper im Raum");
  const A = project3D([a / 2, -a / 2, 0], cx, cy, scale);
  const B = project3D([a / 2, a / 2, 0], cx, cy, scale);
  const C = project3D([-a / 2, a / 2, 0], cx, cy, scale);
  const D = project3D([-a / 2, -a / 2, 0], cx, cy, scale);
  const S = project3D([0, 0, h], cx, cy, scale);

  // Grundfläche
  s += polygon([A, B, C, D], "lab-polygon-base");
  // Kanten
  s += line(A.x, A.y, B.x, B.y, "lab-edge");
  s += line(B.x, B.y, C.x, C.y, "lab-edge");
  s += line(C.x, C.y, D.x, D.y, "lab-edge-dashed");
  s += line(D.x, D.y, A.x, A.y, "lab-edge");

  s += line(A.x, A.y, S.x, S.y, "lab-edge");
  s += line(B.x, B.y, S.x, S.y, "lab-edge");
  s += line(C.x, C.y, S.x, S.y, "lab-edge");
  s += line(D.x, D.y, S.x, S.y, "lab-edge-dashed");

  s += circle(S.x, S.y, 5, "lab-handle");
  s += text(S.x + 8, S.y - 6, `Spitze S(0|0|${h})`, "lab-text-bold");

  s += text(20, 30, `Pyramide mit quadratischer Grundfläche (${a} × ${a}) und Höhe h = ${h}`, "lab-title");
  s += text(20, 52, `Volumen V = ⅓ · G · h = ${fmtDez(vol, 2)}`, "lab-legend");
  s += "</svg>";
  return s;
}
