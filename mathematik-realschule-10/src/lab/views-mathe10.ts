import type { LabValues, ReadoutValues } from "../model/types";
import {
  open,
  text,
  line,
  polygon,
  polyline,
  circle,
  rect,
  angleArc,
  close,
  r1,
  type Pt,
  type LabView,
  W,
  H,
} from "./svg";

const CX = W / 2;
const CY = H / 2;

export const MATHE10_VIEWS: Record<string, LabView> = {
  "unit-circle": {
    render(values: LabValues, readouts: ReadoutValues): string {
      const alpha = values.alpha ?? 45;
      const rad = (alpha * Math.PI) / 180;
      const R = 110;
      const px = CX + R * Math.cos(rad);
      const py = CY - R * Math.sin(rad);

      let out = open("Einheitskreis mit Sinus und Kosinus");
      // Coordinate axes
      out += line(CX - 140, CY, CX + 140, CY, "lab-axis");
      out += line(CX, CY + 140, CX, CY - 140, "lab-axis");
      out += text(CX + 145, CY + 5, "x", "lab-axis-label");
      out += text(CX + 5, CY - 145, "y", "lab-axis-label");

      // Unit circle
      out += circle(CX, CY, R, "lab-circle");

      // Angle sector / arc
      out += angleArc(CX, CY, 35, 0, alpha, "lab-angle-fill");

      // Triangle projections
      // Cosine projection (horizontal on x-axis)
      out += line(CX, CY, px, CY, "lab-edge lab-cosine");
      // Sinus projection (vertical)
      out += line(px, CY, px, py, "lab-edge lab-sine");

      // Vector / pointer
      out += line(CX, CY, px, py, "lab-vector");
      out += circle(px, py, 6, "lab-handle");

      // Labels
      out += text(CX + (px - CX) / 2, CY + 16, `cos = ${readouts.cosVal ?? ""}`, "lab-cosine-label", "middle");
      out += text(px + 8, CY - (CY - py) / 2, `sin = ${readouts.sinVal ?? ""}`, "lab-sine-label", "start");
      out += text(CX + 20, CY - 10, `${Math.round(alpha)}°`, "lab-angle-label");

      out += close();
      return out;
    },
    handles: {
      pointer: {
        drag: (pt: Pt, _values: LabValues) => {
          const dx = pt.x - CX;
          const dy = CY - pt.y;
          let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
          if (deg < 0) deg += 360;
          return { alpha: Math.round(deg) };
        },
      },
    },
  },

  "sine-cosine-law": {
    render(values: LabValues, readouts: ReadoutValues): string {
      const a = values.a ?? 7;
      const b = values.b ?? 8;
      const gamma = values.gamma ?? 60;
      const scale = 14;

      const A: Pt = { x: 90, y: 260 };
      const B: Pt = { x: A.x + b * scale, y: 260 };
      const rad = (gamma * Math.PI) / 180;
      const C: Pt = {
        x: A.x + a * scale * Math.cos(rad),
        y: A.y - a * scale * Math.sin(rad),
      };

      let out = open("Dreieck für Sinus- und Kosinussatz");
      out += polygon([A, B, C], "lab-triangle-fill");
      out += polyline([A, B, C, A], "lab-triangle-stroke");

      out += circle(A.x, A.y, 4, "lab-point");
      out += circle(B.x, B.y, 4, "lab-point");
      out += circle(C.x, C.y, 4, "lab-point");

      out += text(A.x - 12, A.y + 16, "A", "lab-vertex-label");
      out += text(B.x + 8, B.y + 16, "B", "lab-vertex-label");
      out += text(C.x, C.y - 10, "C", "lab-vertex-label", "middle");

      out += text((A.x + B.x) / 2, A.y + 20, `c = ${readouts.cVal ?? ""}`, "lab-side-label", "middle");
      out += text(A.x - 20, (A.y + C.y) / 2, `b = ${b}`, "lab-side-label");
      out += text((B.x + C.x) / 2 + 10, (B.y + C.y) / 2, `a = ${a}`, "lab-side-label");

      out += close();
      return out;
    },
  },

  "triangle-area": {
    render(values: LabValues, readouts: ReadoutValues): string {
      const a = values.a ?? 6;
      const b = values.b ?? 8;
      const gamma = values.gamma ?? 50;
      const scale = 16;

      const A: Pt = { x: 100, y: 250 };
      const B: Pt = { x: A.x + b * scale, y: 250 };
      const rad = (gamma * Math.PI) / 180;
      const C: Pt = {
        x: A.x + a * scale * Math.cos(rad),
        y: A.y - a * scale * Math.sin(rad),
      };

      let out = open("Dreiecksfläche mit Sinus");
      out += polygon([A, B, C], "lab-area-fill");
      out += polyline([A, B, C, A], "lab-edge");
      out += line(C.x, C.y, C.x, A.y, "lab-altitude-line");

      out += text((A.x + B.x) / 2, A.y + 20, `b = ${b} cm`, "lab-text", "middle");
      out += text((A.x + C.x) / 2 - 20, (A.y + C.y) / 2, `a = ${a} cm`, "lab-text");
      out += text((A.x + B.x) / 2, (A.y + C.y) / 2 + 10, `A = ${readouts.areaVal ?? ""} cm²`, "lab-emphasis-text", "middle");

      out += close();
      return out;
    },
  },

  "radian-arc": {
    render(values: LabValues, readouts: ReadoutValues): string {
      const deg = values.deg ?? 90;
      const R = 90;
      const rad = (deg * Math.PI) / 180;
      const px = CX + R * Math.cos(rad);
      const py = CY - R * Math.sin(rad);

      let out = open("Bogenmaß am Kreis");
      out += circle(CX, CY, R, "lab-circle");
      out += line(CX, CY, CX + R, CY, "lab-axis");
      out += line(CX, CY, px, py, "lab-vector");
      out += angleArc(CX, CY, 30, 0, deg, "lab-angle-fill");

      out += text(CX, CY + R + 25, `Bogenmaß x = ${readouts.radVal ?? ""} rad`, "lab-text", "middle");
      out += text(CX, CY + R + 45, `Winkel α = ${deg}°`, "lab-muted-text", "middle");

      out += close();
      return out;
    },
  },

  "vector-plane": {
    render(values: LabValues, readouts: ReadoutValues): string {
      const vx = values.vx ?? 4;
      const vy = values.vy ?? 3;
      const scale = 22;
      const ox = 140;
      const oy = 240;
      const tx = ox + vx * scale;
      const ty = oy - vy * scale;

      let out = open("Ebene Vektorgeometrie");
      // Grid & Axes
      out += line(ox - 30, oy, ox + 220, oy, "lab-axis");
      out += line(ox, oy + 30, ox, oy - 180, "lab-axis");
      out += text(ox + 225, oy + 5, "x", "lab-axis-label");
      out += text(ox + 5, oy - 185, "y", "lab-axis-label");

      // Components
      out += line(ox, oy, tx, oy, "lab-component-x");
      out += line(tx, oy, tx, ty, "lab-component-y");

      // Vector
      out += line(ox, oy, tx, ty, "lab-vector-bold");
      out += circle(tx, ty, 6, "lab-handle");

      out += text(tx + 10, ty - 10, `v = (${vx}|${vy})`, "lab-vector-label");
      out += text(ox + 120, oy - 150, `|v| = ${readouts.lenVal ?? ""} LE`, "lab-emphasis-text");

      out += close();
      return out;
    },
    handles: {
      tip: {
        drag: (pt: Pt, _values: LabValues) => {
          const scale = 22;
          const ox = 140;
          const oy = 240;
          const vx = Math.round((pt.x - ox) / scale);
          const vy = Math.round((oy - pt.y) / scale);
          return { vx: Math.max(-5, Math.min(8, vx)), vy: Math.max(-4, Math.min(7, vy)) };
        },
      },
    },
  },

  "dot-product": {
    render(values: LabValues, readouts: ReadoutValues): string {
      const ax = values.ax ?? 4;
      const ay = values.ay ?? 2;
      const bx = values.bx ?? -2;
      const by = values.by ?? 4;
      const scale = 20;

      let out = open("Skalarprodukt zweier Vektoren");
      out += line(CX - 150, CY, CX + 150, CY, "lab-axis");
      out += line(CX, CY + 120, CX, CY - 120, "lab-axis");

      const axPt: Pt = { x: CX + ax * scale, y: CY - ay * scale };
      const bxPt: Pt = { x: CX + bx * scale, y: CY - by * scale };

      out += line(CX, CY, axPt.x, axPt.y, "lab-vector-a");
      out += line(CX, CY, bxPt.x, bxPt.y, "lab-vector-b");

      out += circle(axPt.x, axPt.y, 5, "lab-point");
      out += circle(bxPt.x, bxPt.y, 5, "lab-point");

      out += text(axPt.x + 8, axPt.y, "a", "lab-vector-label");
      out += text(bxPt.x + 8, bxPt.y, "b", "lab-vector-label");

      const dotVal = readouts.dotVal ?? 0;
      const isOrth = dotVal === 0 || dotVal === "0";
      out += text(CX, CY - 130, `a · b = ${dotVal} ${isOrth ? "→ ORTHOGONAL (90°)" : ""}`, isOrth ? "lab-orth-text" : "lab-emphasis-text", "middle");

      out += close();
      return out;
    },
  },

  "determinant-area": {
    render(values: LabValues, readouts: ReadoutValues): string {
      const ax = values.ax ?? 4;
      const ay = values.ay ?? 1;
      const bx = values.bx ?? 1;
      const by = values.by ?? 4;
      const scale = 20;

      const O: Pt = { x: 120, y: 260 };
      const A: Pt = { x: O.x + ax * scale, y: O.y - ay * scale };
      const B: Pt = { x: O.x + bx * scale, y: O.y - by * scale };
      const C: Pt = { x: O.x + (ax + bx) * scale, y: O.y - (ay + by) * scale };

      let out = open("2x2-Determinante und Flächeninhalt");
      out += polygon([O, A, C, B], "lab-parallelogram-fill");
      out += polygon([O, A, B], "lab-triangle-fill");

      out += line(O.x, O.y, A.x, A.y, "lab-edge");
      out += line(O.x, O.y, B.x, B.y, "lab-edge");
      out += line(A.x, A.y, C.x, C.y, "lab-dashed");
      out += line(B.x, B.y, C.x, C.y, "lab-dashed");

      out += text((A.x + B.x) / 2, (A.y + B.y) / 2, `det = ${readouts.detVal ?? ""}`, "lab-emphasis-text", "middle");
      out += text(O.x + 160, 40, `Dreiecksfläche = ${readouts.areaVal ?? ""} FE`, "lab-text");

      out += close();
      return out;
    },
  },

  "vector-rotation": {
    render(values: LabValues, _readouts: ReadoutValues): string {
      const phi = values.phi ?? 90;
      const vx = values.vx ?? 4;
      const vy = values.vy ?? 0;
      const scale = 22;
      const rad = (phi * Math.PI) / 180;

      const rx = vx * Math.cos(rad) - vy * Math.sin(rad);
      const ry = vx * Math.sin(rad) + vy * Math.cos(rad);

      let out = open("Vektordrehung um den Ursprung");
      out += line(CX - 140, CY, CX + 140, CY, "lab-axis");
      out += line(CX, CY + 140, CX, CY - 140, "lab-axis");

      const origPt: Pt = { x: CX + vx * scale, y: CY - vy * scale };
      const rotPt: Pt = { x: CX + rx * scale, y: CY - ry * scale };

      out += line(CX, CY, origPt.x, origPt.y, "lab-vector-muted");
      out += line(CX, CY, rotPt.x, rotPt.y, "lab-vector-bold");
      out += angleArc(CX, CY, 40, 0, phi, "lab-angle-fill");

      out += text(origPt.x + 8, origPt.y, "v", "lab-text");
      out += text(rotPt.x + 8, rotPt.y, "v'", "lab-emphasis-text");
      out += text(CX + 20, CY - 20, `${phi}°`, "lab-angle-label");

      out += close();
      return out;
    },
  },

  "power-graph": {
    render(values: LabValues, readouts: ReadoutValues): string {
      const exp = values.exp ?? 2;
      const scaleX = 35;
      const scaleY = 15;

      let out = open("Graph der Potenzfunktion");
      out += line(CX - 180, CY, CX + 180, CY, "lab-axis");
      out += line(CX, CY + 130, CX, CY - 130, "lab-axis");

      const pts: Pt[] = [];
      for (let x = -4; x <= 4; x += 0.2) {
        let y = 0;
        if (exp > 0) y = Math.pow(x, exp);
        else if (exp < 0 && Math.abs(x) > 0.1) y = Math.pow(x, exp);
        if (Number.isFinite(y) && Math.abs(y) <= 8) {
          pts.push({ x: CX + x * scaleX, y: CY - y * scaleY });
        }
      }

      if (pts.length > 1) {
        out += polyline(pts, "lab-curve-bold");
      }

      out += text(CX + 60, CY - 90, `f(x) = x^${exp}`, "lab-emphasis-text");
      out += text(CX, CY + 150, `${readouts.typeVal ?? ""}`, "lab-text", "middle");

      out += close();
      return out;
    },
  },

  "exponential-growth": {
    render(values: LabValues, _readouts: ReadoutValues): string {
      const a = values.a ?? 1.5;
      const b = values.b ?? 2;
      const scaleX = 40;
      const scaleY = 12;

      let out = open("Graph der Exponentialfunktion");
      out += line(CX - 180, CY, CX + 180, CY, "lab-axis");
      out += line(CX, CY + 130, CX, CY - 130, "lab-axis");
      // Asymptote y = 0
      out += line(CX - 180, CY, CX + 180, CY, "lab-asymptote-line");

      const pts: Pt[] = [];
      for (let x = -4; x <= 4; x += 0.2) {
        const y = b * Math.pow(a, x);
        if (y >= -1 && y <= 10) {
          pts.push({ x: CX + x * scaleX, y: CY - y * scaleY });
        }
      }

      if (pts.length > 1) {
        out += polyline(pts, "lab-curve-bold");
      }

      out += text(CX + 50, CY - 80, `f(x) = ${b} · ${a}^x`, "lab-emphasis-text");
      out += text(CX - 140, CY - 10, "Asymptote: y = 0", "lab-asymptote-label");

      out += close();
      return out;
    },
  },

  "logarithm-scale": {
    render(values: LabValues, _readouts: ReadoutValues): string {
      const base = values.base ?? 2;
      const arg = values.arg ?? 8;
      const logVal = Math.log(arg) / Math.log(base);

      let out = open("Logarithmus-Beziehung");
      out += rect(80, 80, W - 160, 160, "lab-card-rect");
      out += text(CX, 120, `Basis b = ${base}`, "lab-text", "middle");
      out += text(CX, 160, `${base}^x = ${arg}  ⟺  x = log_${base}(${arg})`, "lab-emphasis-text", "middle");
      out += text(CX, 200, `Ergebnis: x = ${r1(logVal)}`, "lab-result-text", "middle");

      out += close();
      return out;
    },
  },

  "composite-body": {
    render(values: LabValues, readouts: ReadoutValues): string {
      const r = values.r ?? 4;
      const h = values.h ?? 8;

      let out = open("Zusammengesetzter Körper");
      // Cylinder outline
      const scale = 14;
      const rw = r * scale;
      const rh = h * scale;
      out += rect(CX - rw, CY - rh / 2, rw * 2, rh, "lab-body-cylinder");
      // Cone top
      out += polygon(
        [
          { x: CX - rw, y: CY - rh / 2 },
          { x: CX + rw, y: CY - rh / 2 },
          { x: CX, y: CY - rh / 2 - 50 },
        ],
        "lab-body-cone",
      );

      out += text(CX, CY + rh / 2 + 25, `Gesamtvolumen: ${readouts.volVal ?? ""} cm³`, "lab-emphasis-text", "middle");

      out += close();
      return out;
    },
  },

  "probability-tree": {
    render(values: LabValues, readouts: ReadoutValues): string {
      const pA = (values.pA ?? 60) / 100;
      const pB_given_A = (values.pB_A ?? 70) / 100;

      let out = open("Wahrscheinlichkeitsbaum & bedingte Wahrscheinlichkeit");
      const rootPt: Pt = { x: 80, y: CY };
      const topA: Pt = { x: 220, y: CY - 60 };
      const notA: Pt = { x: 220, y: CY + 60 };

      out += line(rootPt.x, rootPt.y, topA.x, topA.y, "lab-tree-branch");
      out += line(rootPt.x, rootPt.y, notA.x, notA.y, "lab-tree-branch");

      out += text(topA.x + 10, topA.y + 5, `A (P=${r1(pA)})`, "lab-text");
      out += text(notA.x + 10, notA.y + 5, `¬A (P=${r1(1 - pA)})`, "lab-text");

      const topAB: Pt = { x: 380, y: topA.y - 30 };
      const topA_notB: Pt = { x: 380, y: topA.y + 30 };

      out += line(topA.x + 30, topA.y, topAB.x, topAB.y, "lab-tree-branch");
      out += line(topA.x + 30, topA.y, topA_notB.x, topA_notB.y, "lab-tree-branch");

      out += text(topAB.x + 10, topAB.y + 5, `B (P_A(B)=${r1(pB_given_A)})`, "lab-text");
      out += text(CX, CY + 120, `P(A ∩ B) = ${readouts.jointVal ?? ""}`, "lab-emphasis-text", "middle");

      out += close();
      return out;
    },
  },
};
