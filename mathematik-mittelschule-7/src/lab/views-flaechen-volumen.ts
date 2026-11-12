import { fmt } from "../exercises/format";
import {
  open,
  text,
  line,
  rect,
  polygon,
  angleMark,
  infoBox,
  handle,
  clamp,
  type LabView,
} from "./svg";
import { title } from "./view-helpers";

export const FLAECHEN_VOLUMEN_VIEWS: Record<string, LabView> = {
  "parallelogram-area": {
    render(v) {
      const g = v.g ?? 6;
      const h = v.h ?? 4;
      const shift = v.shift ?? 2;
      const slide = (v.cut ?? 0) / 100;
      const area = g * h;

      const sc = 34;
      const x0 = 95;
      const y0 = 248;
      const topX = x0 + shift * sc;
      const topY = y0 - h * sc;

      let out = open("Parallelogramm-Zerlegung zum Rechteck");
      out += title(`A = g · h = ${fmt(g)} cm · ${fmt(h)} cm = ${fmt(area, 1)} cm²`);

      // Main trapezoid body (unchanged part)
      out += polygon(
        [
          { x: topX, y: y0 },
          { x: x0 + g * sc, y: y0 },
          { x: topX + g * sc, y: topY },
          { x: topX, y: topY },
        ],
        "lab-fill-a",
        'style="stroke:var(--lab-a);stroke-width:2"',
      );

      // Cut right triangle sliding to the right side by g*sc*slide
      const off = g * sc * slide;
      out += polygon(
        [
          { x: x0 + off, y: y0 },
          { x: topX + off, y: y0 },
          { x: topX + off, y: topY },
        ],
        "lab-fill-b",
        'style="stroke:var(--lab-b);stroke-width:2"',
      );

      out += line(topX, topY, topX, y0, "lab-curve-2");
      out += angleMark({ x: topX, y: y0 }, { x: x0 + g * sc, y: y0 }, { x: topX, y: topY }, 14, "lab-angle", true);
      out += text(x0 + (g * sc) / 2, y0 + 22, `g = ${fmt(g)} cm`, "lab-text", "middle");
      out += text(topX + 6, (y0 + topY) / 2, `h = ${fmt(h)} cm`, "lab-text-b");
      out += handle("top", topX, topY, "Höhe h und Neigung");

      out += infoBox(55, 290, [
        [slide > 0.85 ? "Verschoben: Rechteck mit gleichem Inhalt g · h!" : "Schiebe das Dreieck links nach rechts → Rechteck!", "lab-text-small"],
      ]);
      out += "</svg>";
      return out;
    },
    handles: {
      top: {
        x: "shift",
        y: "h",
        drag: (p) => ({
          shift: clamp(Math.round(((p.x - 95) / 34) * 2) / 2, 0.5, 4),
          h: clamp(Math.round(((248 - p.y) / 34) * 2) / 2, 2, 5.5),
        }),
      },
    },
  },

  "triangle-area": {
    render(v) {
      const g = v.g ?? 6;
      const h = v.h ?? 4;
      const cx = v.cx ?? 2;
      const dbl = (v.double ?? 0) / 100;
      const area = (g * h) / 2;

      const sc = 34;
      const x0 = 115;
      const y0 = 248;
      const A = { x: x0, y: y0 };
      const B = { x: x0 + g * sc, y: y0 };
      const C = { x: x0 + cx * sc, y: y0 - h * sc };
      const D = { x: C.x + g * sc, y: C.y };

      let out = open("Dreieck zum Parallelogramm verdoppeln");
      out += title(`A = (g · h) : 2 = ${fmt(area, 1)} cm²`);

      if (dbl > 0.05) {
        const bxShift = A.x + (B.x - A.x) * (1 - dbl);
        const dxShift = C.x + (D.x - C.x) * dbl;
        out += polygon([B, { x: bxShift, y: y0 }, C, { x: dxShift, y: C.y }].slice(0, 3), "lab-fill-b", 'style="stroke:var(--lab-b);stroke-width:1.8;stroke-dasharray:4 3"');
      }
      if (dbl >= 0.99) {
        out += polygon([B, D, C], "lab-fill-b", 'style="stroke:var(--lab-b);stroke-width:2"');
      }

      out += polygon([A, B, C], "lab-fill-a", 'style="stroke:var(--lab-a);stroke-width:2.5"');
      out += line(C.x, C.y, C.x, y0, "lab-curve-2");
      out += text((A.x + B.x) / 2, y0 + 22, `g = ${fmt(g)} cm`, "lab-text", "middle");
      out += text(C.x + 8, (C.y + y0) / 2, `h = ${fmt(h)} cm`, "lab-text-b");
      out += handle("C", C.x, C.y, "Spitze C");

      out += infoBox(45, 290, [
        [dbl >= 0.99 ? `Zwei gleiche Dreiecke = Parallelogramm (A = ${fmt(g * h, 1)} cm²)` : `Dreiecksfläche ist die Hälfte von g · h`, "lab-text-small"],
      ]);
      out += "</svg>";
      return out;
    },
    handles: {
      C: {
        x: "cx",
        y: "h",
        drag: (p) => ({
          cx: clamp(Math.round(((p.x - 115) / 34) * 2) / 2, -2, 6),
          h: clamp(Math.round(((248 - p.y) / 34) * 2) / 2, 2, 5.5),
        }),
      },
    },
  },

  "composite-area": {
    render(v) {
      const w = v.w ?? 8;
      const h1 = v.h1 ?? 3;
      const h2 = v.h2 ?? 2;
      const aRect = w * h1;
      const aTri = (w * h2) / 2;
      const total = aRect + aTri;

      const sc = 28;
      const x0 = 90;
      const y0 = 256;
      const roofY = y0 - h1 * sc;
      const peakY = roofY - h2 * sc;

      let out = open("Zusammengesetzte Fläche Giebelwand");
      out += title(`A_ges = ${fmt(aRect)} + ${fmt(aTri)} = ${fmt(total, 1)} m²`);

      out += rect(x0, roofY, w * sc, h1 * sc, "lab-fill-a", 'style="stroke:var(--lab-a);stroke-width:2"');
      out += polygon(
        [{ x: x0, y: roofY }, { x: x0 + w * sc, y: roofY }, { x: x0 + (w * sc) / 2, y: peakY }],
        "lab-fill-b",
        'style="stroke:var(--lab-b);stroke-width:2"',
      );
      out += line(x0 + (w * sc) / 2, peakY, x0 + (w * sc) / 2, roofY, "lab-axis");
      out += text(x0 + (w * sc) / 2, y0 + 20, `g = ${fmt(w)} m`, "lab-text", "middle");
      out += text(x0 - 10, roofY + (h1 * sc) / 2, `h₁=${fmt(h1)}`, "lab-text-a", "end");
      out += text(x0 + (w * sc) / 2 + 8, (peakY + roofY) / 2, `h₂=${fmt(h2)}`, "lab-text-b");
      out += handle("peak", x0 + (w * sc) / 2, peakY, "Giebelhöhe h2");

      out += infoBox(338, 86, [
        [`Rechteck: ${fmt(w)} · ${fmt(h1)} = ${fmt(aRect)} m²`, "lab-text-a"],
        [`Dreieck: (${fmt(w)} · ${fmt(h2)}) : 2 = ${fmt(aTri)} m²`, "lab-text-b"],
        [`Gesamt: ${fmt(total, 1)} m²`, "lab-text-big"],
      ]);
      out += "</svg>";
      return out;
    },
    handles: {
      peak: {
        y: "h2",
        drag: (p, v) => {
          const roofY = 256 - (v.h1 ?? 3) * 28;
          return { h2: clamp(Math.round((roofY - p.y) / 28), 1, 4) };
        },
      },
    },
  },

  "quad-special-area": {
    render(v) {
      const kind = v.kind ?? 0; // 0: Trapez, 1: Drachen, 2: Raute
      const a = v.a ?? 8;
      const c = v.c ?? 4;
      const h = v.h ?? 4;
      const sc = 26;
      const cx = 200;
      const cy = 185;

      let out = open("Trapez, Drachenviereck und Raute");
      let area = 0;

      if (kind === 0) {
        area = ((a + c) / 2) * h;
        out += title(`Trapez: A = (a + c) : 2 · h = ${fmt(area, 1)} cm²`);
        const x0 = cx - (a * sc) / 2;
        const y0 = cy + (h * sc) / 2;
        const topX = cx - (c * sc) / 2;
        const topY = cy - (h * sc) / 2;
        out += polygon(
          [{ x: x0, y: y0 }, { x: x0 + a * sc, y: y0 }, { x: topX + c * sc, y: topY }, { x: topX, y: topY }],
          "lab-fill-a",
          'style="stroke:var(--lab-a);stroke-width:2.5"',
        );
        out += line(cx, topY, cx, y0, "lab-curve-2");
        out += text(cx, y0 + 18, `a = ${fmt(a)} cm`, "lab-text", "middle");
        out += text(cx, topY - 10, `c = ${fmt(c)} cm`, "lab-text", "middle");
        out += text(cx + 8, cy, `h = ${fmt(h)} cm`, "lab-text-b");
      } else {
        // Kite or Rhombus using diagonals e = a, f = h
        const e = a;
        const f = kind === 2 ? c : h;
        area = (e * f) / 2;
        out += title(`${kind === 1 ? "Drachenviereck" : "Raute"}: A = (e · f) : 2 = ${fmt(area, 1)} cm²`);
        const left = cx - (e * sc) / 2;
        const right = cx + (e * sc) / 2;
        const midX = kind === 1 ? left + (e * sc) * 0.35 : cx;
        const top = cy - (f * sc) / 2;
        const bot = cy + (f * sc) / 2;
        out += polygon(
          [{ x: left, y: cy }, { x: midX, y: top }, { x: right, y: cy }, { x: midX, y: bot }],
          "lab-fill-a",
          'style="stroke:var(--lab-a);stroke-width:2.5"',
        );
        out += line(left, cy, right, cy, "lab-curve-2");
        out += line(midX, top, midX, bot, "lab-curve-2");
        out += text(cx + 12, cy - 8, `e = ${fmt(e)} cm`, "lab-text-b");
        out += text(midX + 8, top + 16, `f = ${fmt(f)} cm`, "lab-text-b");
      }

      out += infoBox(335, 86, [
        kind === 0
          ? [`Mittellinie m = (${fmt(a)} + ${fmt(c)}) : 2 = ${fmt((a + c) / 2, 1)} cm`, "lab-text"]
          : [`Diagonalen stehen senkrecht!`, "lab-text"],
        [`Flächeninhalt: ${fmt(area, 1)} cm²`, "lab-text-big"],
      ]);
      out += "</svg>";
      return out;
    },
  },

  "prism-surface": {
    render(v) {
      const shape = v.shape ?? 0; // 0: Dreieckprisma, 1: Quader
      const g = v.g ?? 4;
      const h = v.h ?? 3;
      const hk = v.hk ?? 5;
      const fold = v.fold ?? 0; // 0: Schrägbild, 1: Netz
      const G = shape === 0 ? (g * h) / 2 : g * h;
      const sideLeg = Math.hypot(g / 2, h);
      const u = shape === 0 ? g + 2 * sideLeg : 2 * (g + h);
      const M = u * hk;
      const O = 2 * G + M;

      let out = open("Oberflächeninhalt gerader Prismen");
      out += title(`O = 2 · G + M = 2 · ${fmt(G, 1)} + ${fmt(M, 1)} = ${fmt(O, 1)} cm²`);

      if (fold === 0) {
        const sc = 22;
        const x0 = 110;
        const y0 = 240;
        const dx = hk * sc * 0.45;
        const dy = -hk * sc * 0.35;
        const front =
          shape === 0
            ? [{ x: x0, y: y0 }, { x: x0 + g * sc, y: y0 }, { x: x0 + (g * sc) / 2, y: y0 - h * sc }]
            : [{ x: x0, y: y0 }, { x: x0 + g * sc, y: y0 }, { x: x0 + g * sc, y: y0 - h * sc }, { x: x0, y: y0 - h * sc }];
        const back = front.map((p) => ({ x: p.x + dx, y: p.y + dy }));
        out += polygon(back, "lab-shape", 'style="stroke:var(--lab-ghost);stroke-dasharray:4 3"');
        front.forEach((p, i) => out += line(p.x, p.y, back[i].x, back[i].y, "lab-axis"));
        out += polygon(front, "lab-fill-a", 'style="stroke:var(--lab-a);stroke-width:2.2"');
      } else {
        const widthsCm = shape === 0 ? [sideLeg, g, sideLeg] : [g, h, g, h];
        const totalCm = widthsCm.reduce((sum, w) => sum + w, 0);
        const sc = Math.min(18, 225 / Math.max(totalCm, 1), 195 / Math.max(hk + 2 * h, 1));
        const mh = hk * sc;
        const mx0 = 38;
        const my0 = Math.round(175 - mh / 2);

        let curX = mx0;
        const starts: number[] = [];
        for (const wCm of widthsCm) {
          const sw = wCm * sc;
          starts.push(curX);
          out += rect(curX, my0, sw, mh, "lab-fill-b", 'style="stroke:var(--lab-b);stroke-width:1.8"');
          curX += sw;
        }
        const baseIdx = shape === 0 ? 1 : 0;
        const baseX = starts[baseIdx];
        const baseW = widthsCm[baseIdx] * sc;
        if (shape === 0) {
          out += polygon(
            [
              { x: baseX, y: my0 },
              { x: baseX + baseW, y: my0 },
              { x: baseX + baseW / 2, y: my0 - h * sc },
            ],
            "lab-fill-a",
            'style="stroke:var(--lab-a);stroke-width:2"',
          );
          out += polygon(
            [
              { x: baseX, y: my0 + mh },
              { x: baseX + baseW, y: my0 + mh },
              { x: baseX + baseW / 2, y: my0 + mh + h * sc },
            ],
            "lab-fill-a",
            'style="stroke:var(--lab-a);stroke-width:2"',
          );
        } else {
          out += rect(baseX, my0 - h * sc, baseW, h * sc, "lab-fill-a", 'style="stroke:var(--lab-a);stroke-width:2"');
          out += rect(baseX, my0 + mh, baseW, h * sc, "lab-fill-a", 'style="stroke:var(--lab-a);stroke-width:2"');
        }
        out += text(baseX + baseW + 10, my0 - Math.max(12, (h * sc) / 2), `G = ${fmt(G, 1)} cm²`, "lab-text-a");
        out += text(mx0 + (totalCm * sc) / 2, my0 + mh / 2 + 5, `M = ${fmt(M, 1)} cm²`, "lab-text-b", "middle");
      }

      out += infoBox(305, 86, [
        [`Grundfläche G = ${fmt(G, 1)} cm²`, "lab-text-a"],
        [`Umfang u = ${fmt(u, 1)} cm`, "lab-text"],
        [`Mantel M = u · hₖ = ${fmt(M, 1)} cm²`, "lab-text-b"],
        [`Oberfläche O = ${fmt(O, 1)} cm²`, "lab-text-big"],
      ]);
      out += "</svg>";
      return out;
    },
  },

  "prism-volume": prismVolumeView(false),
  "prism-gutter": prismVolumeView(true),
};

function prismVolumeView(isGutter: boolean): LabView {
  return {
    render(v) {
      const shape = v.shape ?? 0;
      const g = v.g ?? 6;
      const h = v.h ?? 4;
      const hk = v.hk ?? 5;
      const fill = v.fill ?? 100;

      // In prism-volume: 0 Rechteck, 1 Dreieck, 2 Parallelogramm, 3 Trapez, 4 Drachen
      // In prism-gutter: 0 Rechteck, 1 Dreieck, 2 Trapez
      const kind = isGutter ? [0, 1, 3][shape] ?? 0 : shape;
      const G =
        kind === 0 || kind === 2
          ? g * h
          : kind === 3
            ? ((g + Math.max(2, g - 2)) / 2) * h
            : (g * h) / 2;
      const V = G * hk * (fill / 100);

      const unitLen = isGutter ? "dm" : "cm";
      const unitArea = isGutter ? "dm²" : "cm²";
      const unitVol = isGutter ? "l" : "cm³";
      const heading = isGutter
        ? "Werkstück- & Behältervolumen (1 dm³ = 1 Liter)"
        : "Rauminhalt gerader Prismen";
      const shapeNames = ["Rechteck", "Dreieck", "Parallelogramm", "Trapez", "Drachenviereck"];

      const sc = 22;
      const x0 = 95;
      const y0 = 262;
      const bw = g * sc;
      const bh = hk * sc * (fill / 100);
      const totalH = hk * sc;

      let out = open(heading);
      out += title(`V = G · hₖ = ${fmt(G, 1)} · ${fmt(hk * (fill / 100), 1)} = ${fmt(V, 1)} ${unitVol}`);

      // Standing container column
      out += rect(x0, y0 - totalH, bw, totalH, "lab-shape", 'style="stroke:var(--lab-axis);stroke-width:1.6"');
      out += rect(x0, y0 - bh, bw, bh, "lab-fill-a", 'style="stroke:var(--lab-a);stroke-width:2"');
      out += line(x0 + 22, y0 - totalH - 22, x0 + bw + 22, y0 - totalH - 22, "lab-axis");
      out += line(x0, y0 - totalH, x0 + 22, y0 - totalH - 22, "lab-axis");
      out += line(x0 + bw, y0 - totalH, x0 + bw + 22, y0 - totalH - 22, "lab-axis");
      out += line(x0 + bw, y0, x0 + bw + 22, y0 - 22, "lab-axis");
      out += line(x0 + bw + 22, y0 - 22, x0 + bw + 22, y0 - totalH - 22, "lab-axis");

      // Cross-section glyph in upper-right info panel
      const gx = 32;
      const gy = 86;
      const gw = 46;
      const gh = 34;
      const profile =
        kind === 0
          ? [{ x: gx, y: gy }, { x: gx + gw, y: gy }, { x: gx + gw, y: gy + gh }, { x: gx, y: gy + gh }]
          : kind === 1
            ? [{ x: gx, y: gy + gh }, { x: gx + gw, y: gy + gh }, { x: gx + gw / 2, y: gy }]
            : kind === 2
              ? [{ x: gx, y: gy + gh }, { x: gx + gw - 10, y: gy + gh }, { x: gx + gw, y: gy }, { x: gx + 10, y: gy }]
              : kind === 3
                ? [{ x: gx, y: gy + gh }, { x: gx + gw, y: gy + gh }, { x: gx + gw - 8, y: gy }, { x: gx + 8, y: gy }]
                : [{ x: gx + gw / 2, y: gy }, { x: gx + gw, y: gy + gh * 0.42 }, { x: gx + gw / 2, y: gy + gh }, { x: gx, y: gy + gh * 0.42 }];
      out += polygon(profile, "lab-fill-b", 'style="stroke:var(--lab-b);stroke-width:1.8"');
      out += text(gx + gw / 2, gy + gh + 14, "Querschnitt", "lab-text-small", "middle");

      out += handle("fill", x0 + bw / 2, y0 - bh, "Füllhöhe");

      out += infoBox(280, 86, [
        [`Grundfläche (${shapeNames[kind] ?? "Prisma"})`, "lab-text"],
        [`G = ${fmt(G, 1)} ${unitArea}`, "lab-text-a"],
        [`hₖ = ${fmt(hk, 1)} ${unitLen} (${fill} % voll)`, "lab-text-b"],
        [`Volumen V = ${fmt(V, 1)} ${unitVol}`, "lab-text-big"],
      ]);
      out += "</svg>";
      return out;
    },
    handles: {
      fill: {
        y: "fill",
        drag: (p, v) => {
          const totalH = (v.hk ?? 5) * 22;
          return { fill: clamp(Math.round(((262 - p.y) / totalH) * 100 / 10) * 10, 20, 100) };
        },
      },
    },
  };
}
