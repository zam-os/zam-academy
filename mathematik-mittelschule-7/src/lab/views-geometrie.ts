import { fmt } from "../exercises/format";
import { classifyGridTriangle } from "../curriculum/helpers";
import {
  open,
  text,
  line,
  rect,
  circle,
  polygon,
  angleMark,
  sideLabel,
  infoBox,
  handle,
  Plot,
  polar,
  arcPath,
  clamp,
  type LabView,
  type Pt,
} from "./svg";
import { title } from "./view-helpers";

export const GEOMETRIE_VIEWS: Record<string, LabView> = {
  "perp-bisector": {
    render(v) {
      const plot = new Plot(-6, 6, -1, 7, { x: 24, y: 36, w: 472, h: 286 });
      const ax = v.ax ?? -4;
      const bx = v.bx ?? 4;
      const px = v.px ?? 2;
      const py = v.py ?? 4;

      const A = plot.P(ax, 0);
      const B = plot.P(bx, 0);
      const M = plot.P((ax + bx) / 2, 0);
      const P = plot.P(px, py);
      const F = plot.P(px, 0);

      let out = open("Mittelsenkrechte und Lot durch Punkt P");
      out += plot.grid(1, 2);
      out += line(A.x, A.y, B.x, B.y, "lab-ink");
      out += circle(A.x, A.y, 4.5, "lab-dot");
      out += circle(B.x, B.y, 4.5, "lab-dot");
      out += text(A.x - 10, A.y + 16, "A", "lab-text");
      out += text(B.x + 6, B.y + 16, "B", "lab-text");

      // Mittelsenkrechte
      out += line(M.x, plot.Y(6.5), M.x, plot.Y(-0.5), "lab-curve");
      out += angleMark(M, B, { x: M.x, y: M.y - 40 }, 16, "lab-angle", true);
      out += circle(M.x, M.y, 4, "lab-dot");
      out += text(M.x + 6, M.y + 16, "M", "lab-text-a");

      // Lot from P to AB
      out += line(P.x, P.y, F.x, F.y, "lab-curve-2");
      out += angleMark(F, B, P, 14, "lab-angle", true);
      out += circle(F.x, F.y, 4, "lab-dot-2");
      out += text(F.x + 6, F.y - 8, "F", "lab-text-b");

      // Construction arc around M
      const radPx = Math.abs(B.x - A.x) * 0.62;
      out += `<circle cx="${A.x.toFixed(1)}" cy="${A.y.toFixed(1)}" r="${radPx.toFixed(1)}" class="lab-ghost" fill="none" stroke-dasharray="4 4" />`;
      out += `<circle cx="${B.x.toFixed(1)}" cy="${B.y.toFixed(1)}" r="${radPx.toFixed(1)}" class="lab-ghost" fill="none" stroke-dasharray="4 4" />`;

      out += handle("P", P.x, P.y, "Punkt P");
      out += text(P.x + 10, P.y - 6, `P(${fmt(px)}|${fmt(py)})`, "lab-text-b");

      const distM = Math.abs(px - (ax + bx) / 2);
      out += infoBox(34, 62, [
        [`Abstand P zur Geraden AB: ${fmt(py)} cm`, "lab-text-b"],
        [`Abstand P zur Mittelsenkrechten: ${fmt(distM, 1)} cm`, "lab-text-a"],
        [distM < 0.15 ? "P liegt genau auf der Mittelsenkrechten!" : "Mittelsenkrechte halbiert AB im 90°-Winkel", "lab-text-small"],
      ]);
      out += "</svg>";
      return out;
    },
    handles: {
      P: {
        x: "px",
        y: "py",
        drag: (p) => {
          const plot = new Plot(-6, 6, -1, 7, { x: 24, y: 36, w: 472, h: 286 });
          return {
            px: clamp(Math.round(plot.invX(p.x) * 2) / 2, -5, 5),
            py: clamp(Math.round(plot.invY(p.y) * 2) / 2, 1, 6),
          };
        },
      },
    },
  },

  "angle-bisector": {
    render(v) {
      const alpha = v.alpha ?? 60;
      const rPt = v.r ?? 4;
      const sx = 95;
      const sy = 255;
      const scale = 42;
      const rayLen = 280;

      const s1End = polar(sx, sy, rayLen, 0);
      const s2End = polar(sx, sy, rayLen, alpha);
      const bisEnd = polar(sx, sy, rayLen, alpha / 2);

      // Point P on angle bisector (with optional offset to explore distances)
      const pPt = polar(sx, sy, rPt * scale, alpha / 2);
      const rad = (alpha / 2) * (Math.PI / 180);
      const distCm = rPt * Math.sin(rad);
      // Perpendicular feet on both rays
      const foot1: Pt = { x: sx + rPt * scale * Math.cos(rad), y: sy };
      const foot2 = polar(sx, sy, rPt * scale * Math.cos(rad), alpha);

      let out = open("Winkelhalbierende");
      out += title(`Winkel α = ${fmt(alpha)}°  ·  α/2 = ${fmt(alpha / 2, 1)}°`);

      out += line(sx, sy, s1End.x, s1End.y, "lab-ink");
      out += line(sx, sy, s2End.x, s2End.y, "lab-ink");
      out += line(sx, sy, bisEnd.x, bisEnd.y, "lab-curve");
      out += `<path d="${arcPath(sx, sy, 52, 0, alpha)}" class="lab-angle" />`;
      out += `<path d="${arcPath(sx, sy, 130, -5, alpha + 5)}" class="lab-ghost" fill="none" stroke-dasharray="4 4" />`;

      // Equal distances to legs
      out += line(pPt.x, pPt.y, foot1.x, foot1.y, "lab-curve-2");
      out += line(pPt.x, pPt.y, foot2.x, foot2.y, "lab-curve-2");
      out += angleMark(foot1, { x: sx, y: sy }, pPt, 12, "lab-angle", true);
      out += angleMark(foot2, { x: sx, y: sy }, pPt, 12, "lab-angle", true);

      out += circle(sx, sy, 4, "lab-dot");
      out += text(sx - 14, sy + 14, "S", "lab-text");
      out += handle("ray", pPt.x, pPt.y, "Punkt P auf Winkelhalbierender");
      out += text(pPt.x + 12, pPt.y - 6, "P", "lab-text-a");

      out += infoBox(295, 76, [
        [`Halber Winkel: ${fmt(alpha / 2, 1)}°`, "lab-text-a"],
        [`Abstand zu Schenkel 1: ${fmt(distCm, 2)} cm`, "lab-text-b"],
        [`Abstand zu Schenkel 2: ${fmt(distCm, 2)} cm`, "lab-text-b"],
        [`Jeder Punkt auf w hat gleichen Abstand!`, "lab-text-small"],
      ]);
      out += "</svg>";
      return out;
    },
    handles: {
      ray: {
        x: "r",
        drag: (p) => {
          const sx = 95;
          const sy = 255;
          const d = Math.hypot(p.x - sx, p.y - sy) / 42;
          return { r: clamp(Math.round(d * 2) / 2, 2, 6) };
        },
      },
    },
  },

  "scale-coord": {
    render(v) {
      const plot = new Plot(0, 12, 0, 8, { x: 32, y: 34, w: 456, h: 282 });
      const w = v.w ?? 3;
      const h = v.h ?? 2;
      const k = v.k ?? 2;

      const orig = [plot.P(1, 1), plot.P(1 + w, 1), plot.P(1 + w, 1 + h), plot.P(1, 1 + h)];
      const scaled = [
        plot.P(1, 1),
        plot.P(1 + w * k, 1),
        plot.P(1 + w * k, 1 + h * k),
        plot.P(1, 1 + h * k),
      ];

      let out = open("Maßstäbliches Vergrößern im Koordinatensystem");
      out += title(`Maßstab ${k >= 1 ? `${fmt(k, 1)} : 1` : `1 : ${fmt(1 / k, 1)}`} (Faktor k = ${fmt(k, 1)})`);
      out += plot.grid(1, 2);

      out += polygon(scaled, "lab-fill-b", 'style="stroke:var(--lab-b);stroke-width:2"');
      out += polygon(orig, "lab-fill-a", 'style="stroke:var(--lab-a);stroke-width:2"');

      const handlePt = plot.P(1 + w * k, 1 + h * k);
      out += handle("scale", handlePt.x, handlePt.y, "Ecke skalieren");

      out += infoBox(292, 64, [
        [`Original: ${fmt(w)} cm × ${fmt(h)} cm`, "lab-text-a"],
        [`Bild: ${fmt(w * k, 1)} cm × ${fmt(h * k, 1)} cm`, "lab-text-b"],
        [`Fläche × k² = × ${fmt(k * k, 2)}`, "lab-text-small"],
      ]);
      out += "</svg>";
      return out;
    },
    handles: {
      scale: {
        x: "k",
        drag: (p, v) => {
          const plot = new Plot(0, 12, 0, 8, { x: 32, y: 34, w: 456, h: 282 });
          const rawX = plot.invX(p.x) - 1;
          const kNext = rawX / (v.w ?? 3);
          return { k: clamp(Math.round(kNext * 2) / 2, 0.5, 3) };
        },
      },
    },
  },

  "triangle-classify": {
    render(v) {
      const plot = new Plot(-6, 6, -1, 7, { x: 24, y: 34, w: 472, h: 286 });
      const A = { x: -3, y: 0 };
      const B = { x: 3, y: 0 };
      const C = { x: v.cx ?? 0, y: clamp(v.cy ?? 4, 1, 6) };

      const { a: aLen, b: bLen, c: cLen, alpha, beta, gamma, rightVertex, summary } =
        classifyGridTriangle(C.x, C.y);

      const sA = plot.P(A.x, A.y);
      const sB = plot.P(B.x, B.y);
      const sC = plot.P(C.x, C.y);

      let out = open("Dreieck-Klassifikation und Innenwinkelsumme");
      out += title(`${summary} (α + β + γ = 180°)`);
      out += plot.grid(1, 2);

      out += polygon([sA, sB, sC], "lab-fill-a", 'style="stroke:var(--lab-a);stroke-width:2.5"');
      out += angleMark(sA, sB, sC, 22, "lab-angle", rightVertex === "A");
      out += angleMark(sB, sC, sA, 22, "lab-angle", rightVertex === "B");
      out += angleMark(sC, sA, sB, 22, "lab-angle", rightVertex === "C");

      out += sideLabel(sA, sB, `c = ${fmt(cLen, 1)}`, 16);
      out += sideLabel(sB, sC, `a = ${fmt(aLen, 1)}`, 16);
      out += sideLabel(sC, sA, `b = ${fmt(bLen, 1)}`, 16);

      out += text(sA.x - 12, sA.y + 15, "A", "lab-text");
      out += text(sB.x + 8, sB.y + 15, "B", "lab-text");
      out += text(sC.x + 10, sC.y - 8, "C", "lab-text-b");
      out += handle("C", sC.x, sC.y, "Eckpunkt C");

      out += infoBox(34, 62, [
        [`α = ${fmt(alpha, 1)}°  β = ${fmt(beta, 1)}°  γ = ${fmt(gamma, 1)}°`, "lab-text-a"],
        [`Summe: ${fmt(alpha + beta + gamma, 0)}°`, "lab-text-ok"],
      ]);
      out += "</svg>";
      return out;
    },
    handles: {
      C: {
        x: "cx",
        y: "cy",
        drag: (p) => {
          const plot = new Plot(-6, 6, -1, 7, { x: 24, y: 34, w: 472, h: 286 });
          return {
            cx: clamp(Math.round(plot.invX(p.x) * 2) / 2, -4, 4),
            cy: clamp(Math.round(plot.invY(p.y) * 2) / 2, 1, 6),
          };
        },
      },
    },
  },

  "triangle-construct": {
    render(v) {
      const mode = v.mode ?? 0; // 0: sss, 1: sws, 2: wsw
      const a = v.a ?? 5;
      const b = v.b ?? 5;
      const c = v.c ?? 6;
      const alpha = v.alpha ?? 55;
      const beta = v.beta ?? 50;

      let out = open("Dreieckskonstruktion sss, sws, wsw");
      const scale = 30;
      const ax = 120;
      const ay = 265;
      const bx = ax + c * scale;
      const by = ay;

      let valid = true;
      let cx = ax;
      let cy = ay;

      if (mode === 0) {
        valid = a + b > c && a + c > b && b + c > a;
        out += title(`SSS: c = ${fmt(c)} cm, b = ${fmt(b)} cm, a = ${fmt(a)} cm`);
        if (valid) {
          const xLoc = (b * b + c * c - a * a) / (2 * c);
          const yLoc = Math.sqrt(Math.max(0, b * b - xLoc * xLoc));
          cx = ax + xLoc * scale;
          cy = ay - yLoc * scale;
        }
        out += circle(ax, ay, b * scale, "lab-ghost");
        out += circle(bx, by, a * scale, "lab-ghost");
      } else if (mode === 1) {
        valid = b > 0 && c > 0 && alpha > 0 && alpha < 180;
        out += title(`SWS: c = ${fmt(c)} cm, α = ${fmt(alpha)}°, b = ${fmt(b)} cm`);
        const rad = (alpha * Math.PI) / 180;
        cx = ax + b * scale * Math.cos(rad);
        cy = ay - b * scale * Math.sin(rad);
      } else {
        valid = alpha + beta < 180;
        out += title(`WSW: c = ${fmt(c)} cm, α = ${fmt(alpha)}°, β = ${fmt(beta)}°`);
        if (valid) {
          const gamma = 180 - alpha - beta;
          const bComp = (c * Math.sin((beta * Math.PI) / 180)) / Math.sin((gamma * Math.PI) / 180);
          const rad = (alpha * Math.PI) / 180;
          cx = ax + bComp * scale * Math.cos(rad);
          cy = ay - bComp * scale * Math.sin(rad);
        }
      }

      if (valid) {
        out += polygon([{ x: ax, y: ay }, { x: bx, y: by }, { x: cx, y: cy }], "lab-fill-a", 'style="stroke:var(--lab-a);stroke-width:2.5"');
        out += circle(cx, cy, 4.5, "lab-dot-2");
        out += text(cx + 8, cy - 6, "C", "lab-text-b");
      } else {
        out += line(ax, ay, bx, by, "lab-bad");
      }
      out += text(ax - 12, ay + 16, "A", "lab-text");
      out += text(bx + 6, by + 16, "B", "lab-text");

      out += infoBox(295, 70, [
        [valid ? "Dreieck eindeutig konstruierbar!" : "Kein Dreieck möglich!", valid ? "lab-text-ok" : "lab-text-bad"],
        [mode === 0 ? "Prüfung: a + b > c?" : mode === 1 ? "SWS: Winkel zwischen b und c" : "Prüfung: α + β < 180°?", "lab-text-small"],
      ]);
      out += "</svg>";
      return out;
    },
  },

  "prism-net": {
    render(v) {
      const shape = v.shape ?? 0; // 0: Rechteck, 1: Parallelogramm, 2: Dreieck
      const g = v.g ?? 5;
      const h = v.h ?? 3;
      const hk = v.hk ?? 4;
      const fold = v.fold ?? 0; // 0 = Schrägbild, 1 = Netz

      let out = open("Prisma als Schrägbild und Netz");
      const name = shape === 0 ? "Rechteckprisma (Quader)" : shape === 1 ? "Parallelogrammprisma" : "Dreiecksprisma";
      out += title(`${name}: ${fold === 0 ? "Schrägbild" : "Netz"}`);

      if (fold === 0) {
        const sc = 24;
        const dx = hk * sc * 0.45;
        const dy = -hk * sc * 0.35;
        const x0 = 155;
        const y0 = 245;
        const pts: Pt[] =
          shape === 0
            ? [{ x: x0, y: y0 }, { x: x0 + g * sc, y: y0 }, { x: x0 + g * sc, y: y0 - h * sc }, { x: x0, y: y0 - h * sc }]
            : shape === 1
              ? [{ x: x0, y: y0 }, { x: x0 + g * sc, y: y0 }, { x: x0 + (g + 1.5) * sc, y: y0 - h * sc }, { x: x0 + 1.5 * sc, y: y0 - h * sc }]
              : [{ x: x0, y: y0 }, { x: x0 + g * sc, y: y0 }, { x: x0 + g * sc * 0.5, y: y0 - h * sc }];
        const back = pts.map((p) => ({ x: p.x + dx, y: p.y + dy }));
        out += polygon(back, "lab-shape", 'style="stroke:var(--lab-ghost);stroke-width:1.4;stroke-dasharray:4 4"');
        pts.forEach((p, i) => out += line(p.x, p.y, back[i].x, back[i].y, "lab-axis"));
        out += polygon(pts, "lab-fill-a", 'style="stroke:var(--lab-a);stroke-width:2.5"');
        out += text(x0 + (g * sc) / 2, y0 + 20, `g = ${fmt(g)} cm`, "lab-text", "middle");
        out += text(back[1].x + 12, (pts[1].y + back[1].y) / 2, `hₖ = ${fmt(hk)} cm`, "lab-text-b");
      } else {
        // Unfolded net: edge-matched mantle strip + 2 base polygons
        const widthsCm =
          shape === 2
            ? (() => {
                const leg = Math.hypot(g / 2, h);
                return [leg, g, leg];
              })()
            : shape === 1
              ? (() => {
                  const slant = Math.hypot(1.5, h);
                  return [g, slant, g, slant];
                })()
              : [g, h, g, h];
        const totalCm = widthsCm.reduce((sum, w) => sum + w, 0);
        const sc = Math.min(18, 280 / Math.max(totalCm, 1), 195 / Math.max(hk + 2 * h, 1));
        const mh = hk * sc;
        const mx0 = 38;
        const my0 = Math.round(170 - mh / 2);

        let curX = mx0;
        const stripStarts: number[] = [];
        for (let i = 0; i < widthsCm.length; i++) {
          const sw = widthsCm[i] * sc;
          stripStarts.push(curX);
          out += rect(curX, my0, sw, mh, "lab-fill-a", 'style="stroke:var(--lab-a);stroke-width:1.6"');
          if (sw >= 24) {
            out += text(curX + sw / 2, my0 + mh / 2 + 4, `${fmt(widthsCm[i], 1)}`, "lab-text-small", "middle");
          }
          curX += sw;
        }
        const attachIdx = shape === 2 ? 1 : 0;
        const baseX = stripStarts[attachIdx];
        const baseW = widthsCm[attachIdx] * sc;
        if (shape === 2) {
          out += polygon(
            [
              { x: baseX, y: my0 },
              { x: baseX + baseW, y: my0 },
              { x: baseX + baseW / 2, y: my0 - h * sc },
            ],
            "lab-fill-b",
            'style="stroke:var(--lab-b);stroke-width:2"',
          );
          out += polygon(
            [
              { x: baseX, y: my0 + mh },
              { x: baseX + baseW, y: my0 + mh },
              { x: baseX + baseW / 2, y: my0 + mh + h * sc },
            ],
            "lab-fill-b",
            'style="stroke:var(--lab-b);stroke-width:2"',
          );
        } else {
          const shift = shape === 1 ? 1.5 * sc : 0;
          out += polygon(
            [
              { x: baseX, y: my0 },
              { x: baseX + baseW, y: my0 },
              { x: baseX + baseW + shift, y: my0 - h * sc },
              { x: baseX + shift, y: my0 - h * sc },
            ],
            "lab-fill-b",
            'style="stroke:var(--lab-b);stroke-width:2"',
          );
          out += polygon(
            [
              { x: baseX, y: my0 + mh },
              { x: baseX + baseW, y: my0 + mh },
              { x: baseX + baseW + shift, y: my0 + mh + h * sc },
              { x: baseX + shift, y: my0 + mh + h * sc },
            ],
            "lab-fill-b",
            'style="stroke:var(--lab-b);stroke-width:2"',
          );
        }
      }

      const flaechen = shape === 2 ? 5 : 6;
      const ecken = shape === 2 ? 6 : 8;
      const kanten = shape === 2 ? 9 : 12;
      out += infoBox(335, 272, [
        [`Ecken: ${ecken} · Kanten: ${kanten}`, "lab-text"],
        [`Flächen: ${flaechen} (2G + ${flaechen - 2}M)`, "lab-text-a"],
      ]);
      out += "</svg>";
      return out;
    },
  },
};
