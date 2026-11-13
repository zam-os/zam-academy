import { fmt } from "../exercises/format";
import { compositeArea, compositeDims, COMPOSITES, regularPolygon } from "../models";
import {
  circle,
  infoBox,
  line,
  open,
  path,
  polar,
  polygon,
  sectorPath,
  text,
  type LabView,
  type Pt,
} from "./svg";
import { legend, legendRow, title } from "./view-helpers";

// 4.1 Flächeninhalt regelmäßiger Vielecke: n Dreiecke, aufgereiht zu einem Band.
const polygonArea: LabView = {
  render(v) {
    const poly = regularPolygon(v.n, v.s);
    const h = poly.apothem;
    const triangle = (v.s * h) / 2;
    const area = v.n * triangle;
    const k = Math.min(70 / poly.radius, 22);
    const cx = 105;
    const cy = 150;
    const R = poly.radius * k;
    const corner = (i: number) => polar(cx, cy, R, 90 + 180 / v.n + (i * 360) / v.n);
    let out =
      open(`Regelmäßiges ${v.n}-Eck aus ${v.n} Bestimmungsdreiecken, Flächeninhalt ${fmt(area, 2)} cm²`) +
      title(`A = ${v.n} · s · h : 2 = ${v.n} · ${fmt(v.s)} · ${fmt(h, 2)} : 2 ≈ ${fmt(area, 2)} cm²`);
    for (let i = 0; i < v.n; i++) {
      out += polygon([{ x: cx, y: cy }, corner(i), corner(i + 1)], i % 2 === 0 ? "lab-fill-a" : "lab-fill-b");
    }
    // Height of one triangle: from the centre to the middle of the lowest side.
    const bottomMid = { x: cx, y: cy + h * k };
    out += line(cx, cy, bottomMid.x, bottomMid.y, "lab-side-c");
    out += text(cx + 5, cy + (h * k) / 2 + 4, "h", "lab-text-c");
    // The triangles laid out in a row: tips alternately up and down.
    const scale = Math.min(k, 300 / ((v.n / 2 + 0.5) * v.s));
    const x0 = 214;
    const y0 = 200;
    const sw = v.s * scale;
    const hh = h * scale;
    for (let i = 0; i < v.n; i++) {
      const left = x0 + (i * sw) / 2;
      const up = i % 2 === 0;
      const pts: Pt[] = up
        ? [{ x: left, y: y0 }, { x: left + sw, y: y0 }, { x: left + sw / 2, y: y0 - hh }]
        : [{ x: left, y: y0 - hh }, { x: left + sw, y: y0 - hh }, { x: left + sw / 2, y: y0 }];
      out += polygon(pts, i % 2 === 0 ? "lab-fill-a" : "lab-fill-b");
    }
    const band = ((v.n + 1) * sw) / 2;
    out += line(x0, y0 + 14, x0 + band, y0 + 14, "lab-thin");
    out += text(x0 + band / 2, y0 + 30, `fast ein Parallelogramm: ${v.n} : 2 Seiten lang`, "lab-text-small", "middle");
    out += line(x0 - 8, y0, x0 - 8, y0 - hh, "lab-side-c");
    out += text(x0 - 12, y0 - hh / 2, "h", "lab-text-c", "end");
    out += infoBox(220, 254, [
      [`ein Dreieck: s · h : 2 = ${fmt(v.s)} · ${fmt(h, 2)} : 2 ≈ ${fmt(triangle, 2)} cm²`, "lab-text"],
      [`alle ${v.n}: A ≈ ${fmt(area, 2)} cm² = u · h : 2`, "lab-text-ok"],
    ]);
    out += legendRow(20, 330, [
      ["lab-fill-a", "Bestimmungsdreiecke"],
      ["lab-fill-c", "Höhe h vom Mittelpunkt zur Seite"],
    ]);
    return out + "</svg>";
  },
};

// 4.2 Zusammengesetzte Figuren: zerlegen oder ergänzen.
const composite: LabView = {
  render(v) {
    const area = compositeArea(v.shape, v.w, v.h, v.x, v.y);
    const { x, y } = compositeDims(v.shape, v.w, v.h, v.x, v.y);
    const top = v.shape === 1 ? y : 0;
    const k = Math.min(260 / v.w, 230 / (v.h + top));
    const ox = 40;
    const oy = 300;
    const P = (px: number, py: number): Pt => ({ x: ox + px * k, y: oy - py * k });
    const split = v.method === 0;
    let out =
      open(`${COMPOSITES[v.shape]}: Flächeninhalt ${fmt(area.area, 2)} m², ${split ? "zerlegt" : "ergänzt"}`) +
      title(`${COMPOSITES[v.shape]}: A = ${fmt(area.area, 2)} m² (${split ? "Zerlegen" : "Ergänzen"})`);
    if (v.shape === 0) {
      if (split) {
        out += polygon([P(0, 0), P(v.w, 0), P(v.w, v.h - y), P(0, v.h - y)], "lab-fill-a");
        out += polygon([P(0, v.h - y), P(v.w - x, v.h - y), P(v.w - x, v.h), P(0, v.h)], "lab-fill-b");
      } else {
        out += polygon([P(0, 0), P(v.w, 0), P(v.w, v.h), P(0, v.h)], "lab-fill-a");
        out += polygon([P(v.w - x, v.h - y), P(v.w, v.h - y), P(v.w, v.h), P(v.w - x, v.h)], "lab-fill-c");
      }
      out += polygon([P(0, 0), P(v.w, 0), P(v.w, v.h - y), P(v.w - x, v.h - y), P(v.w - x, v.h), P(0, v.h)], "lab-ink");
    } else if (v.shape === 1) {
      out += polygon([P(0, 0), P(v.w, 0), P(v.w, v.h), P(0, v.h)], "lab-fill-a");
      out += polygon([P(0, v.h), P(v.w, v.h), P(v.w / 2, v.h + y)], "lab-fill-b");
      const wx = (v.w - x) / 2;
      out += polygon([P(wx, v.h / 4), P(wx + x, v.h / 4), P(wx + x, (3 * v.h) / 4), P(wx, (3 * v.h) / 4)], "lab-fill-c");
      out += line(P(v.w / 2, v.h).x, P(0, v.h).y, P(v.w / 2, v.h + y).x, P(v.w / 2, v.h + y).y, "lab-dashed");
    } else {
      if (split) {
        out += polygon([P(0, 0), P(v.w, 0), P(v.w, x), P(0, x)], "lab-fill-a");
        out += polygon([P(0, v.h - x), P(v.w, v.h - x), P(v.w, v.h), P(0, v.h)], "lab-fill-a");
        out += polygon([P(0, x), P(x, x), P(x, v.h - x), P(0, v.h - x)], "lab-fill-b");
        out += polygon([P(v.w - x, x), P(v.w, x), P(v.w, v.h - x), P(v.w - x, v.h - x)], "lab-fill-b");
      } else {
        out += polygon([P(0, 0), P(v.w, 0), P(v.w, v.h), P(0, v.h)], "lab-fill-a");
        out += polygon([P(x, x), P(v.w - x, x), P(v.w - x, v.h - x), P(x, v.h - x)], "lab-fill-c");
      }
    }
    out += text(P(v.w / 2, 0).x, oy + 18, `${fmt(v.w)} m`, "lab-text-small", "middle");
    out += text(ox - 6, P(0, v.h / 2).y, `${fmt(v.h)} m`, "lab-text-small", "end");
    const lines: Array<[string, string]> =
      v.shape === 1
        ? [
            [`Rechteck: ${fmt(v.w)} · ${fmt(v.h)} = ${fmt(area.parts[0], 2)}`, "lab-text-a"],
            [`+ Dreieck: ${fmt(v.w)} · ${fmt(y)} : 2 = ${fmt(area.parts[1], 2)}`, "lab-text-b"],
            [`− Fenster: ${fmt(x)} · ${fmt(v.h / 2)} = ${fmt(area.missing, 2)}`, "lab-text-c"],
            [`= ${fmt(area.area, 2)} m²`, "lab-text-ok"],
          ]
        : split
          ? [
              [`Teil 1: ${fmt(area.parts[0], 2)}`, "lab-text-a"],
              [`Teil 2: ${fmt(area.parts[1], 2)}${v.shape === 2 ? " (beide Seitenstreifen)" : ""}`, "lab-text-b"],
              [`Summe: ${fmt(area.area, 2)} m²`, "lab-text-ok"],
            ]
          : [
              [`großes Rechteck: ${fmt(area.whole, 2)}`, "lab-text-a"],
              [`− fehlendes Stück: ${fmt(area.missing, 2)}`, "lab-text-c"],
              [`= ${fmt(area.area, 2)} m²`, "lab-text-ok"],
            ];
    out += infoBox(330, 70, lines);
    out += legend(330, 190, [
      ["lab-fill-a", v.shape === 2 && split ? "Streifen oben und unten" : "Rechteck"],
      ["lab-fill-b", v.shape === 1 ? "Dreieck" : v.shape === 2 ? "Streifen links und rechts" : "zweites Rechteck"],
      ["lab-fill-c", v.shape === 1 ? "Fenster (abziehen)" : "ergänztes Stück (abziehen)"],
    ]);
    return out + "</svg>";
  },
};

// 4.3 Oberfläche von Pyramide und Kegel: das Netz.
const surfaceNet: LabView = {
  render(v) {
    const cone = v.body === 1;
    let out: string;
    if (!cone) {
      const hs = Math.hypot(v.h, v.a / 2);
      const M = 2 * v.a * hs;
      const G = v.a * v.a;
      const k = Math.min(200 / (v.a + 2 * hs), 26);
      const cx = 150;
      const cy = 175;
      const half = (v.a * k) / 2;
      const sq = [
        { x: cx - half, y: cy - half },
        { x: cx + half, y: cy - half },
        { x: cx + half, y: cy + half },
        { x: cx - half, y: cy + half },
      ];
      out =
        open(`Netz einer quadratischen Pyramide: Grundfläche ${fmt(G, 2)} cm², Mantel ${fmt(M, 2)} cm²`) +
        title(`O = a² + 4 · a · hₛ : 2 = ${fmt(G, 2)} + ${fmt(M, 2)} = ${fmt(G + M, 2)} cm²`);
      out += polygon(sq, "lab-fill-a");
      const tips = [
        { x: cx, y: cy - half - hs * k },
        { x: cx + half + hs * k, y: cy },
        { x: cx, y: cy + half + hs * k },
        { x: cx - half - hs * k, y: cy },
      ];
      sq.forEach((p, i) => {
        out += polygon([p, sq[(i + 1) % 4], tips[i]], "lab-fill-b");
      });
      out += line(cx, cy - half, tips[0].x, tips[0].y, "lab-side-c");
      out += text(cx + 5, cy - half - (hs * k) / 2, "hₛ", "lab-text-c");
      out += text(cx, cy + 4, "G", "lab-text-a", "middle");
      out += infoBox(316, 80, [
        [`a = ${fmt(v.a)} cm, h = ${fmt(v.h)} cm`, "lab-text"],
        ["hₛ = √(h² + (a : 2)²)", "lab-text-small"],
        [`hₛ ≈ ${fmt(hs, 2)} cm`, "lab-text-c"],
        [`G = a² = ${fmt(G, 2)} cm²`, "lab-text-a"],
        [`M = 2 · a · hₛ ≈ ${fmt(M, 2)} cm²`, "lab-text-b"],
        [`O ≈ ${fmt(G + M, 2)} cm²`, "lab-text-ok"],
      ]);
    } else {
      const r = v.a / 2;
      const s = Math.hypot(r, v.h);
      const angle = (360 * r) / s;
      const M = Math.PI * r * s;
      const G = Math.PI * r * r;
      const k = Math.min(120 / s, 26);
      const sx = 120;
      const sy = 150;
      out =
        open(`Netz eines Kegels: Kreisausschnitt mit ${fmt(angle, 1)}°, Mantel ${fmt(M, 2)} cm²`) +
        title(`O = π · r² + π · r · s ≈ ${fmt(G, 2)} + ${fmt(M, 2)} = ${fmt(G + M, 2)} cm²`);
      out += path(sectorPath(sx, sy, s * k, 270 - angle / 2, 270 + angle / 2), "lab-fill-b");
      const rim = polar(sx, sy, s * k, 270);
      out += line(sx, sy, polar(sx, sy, s * k, 270 + angle / 2).x, polar(sx, sy, s * k, 270 + angle / 2).y, "lab-side-c");
      out += text(sx - 18, sy + (s * k) / 2, "s", "lab-text-c");
      const base = { x: rim.x, y: rim.y + r * k };
      out += circle(base.x, base.y, r * k, "lab-fill-a");
      out += text(base.x, base.y + 4, "G", "lab-text-a", "middle");
      out += text(sx, sy - 8, `${fmt(angle, 1)}°`, "lab-text-small", "middle");
      out += infoBox(316, 80, [
        [`r = ${fmt(r)} cm, h = ${fmt(v.h)} cm`, "lab-text"],
        [`s = √(r² + h²) ≈ ${fmt(s, 2)} cm`, "lab-text-c"],
        [`G = π · r² ≈ ${fmt(G, 2)} cm²`, "lab-text-a"],
        [`M = π · r · s ≈ ${fmt(M, 2)} cm²`, "lab-text-b"],
        [`O ≈ ${fmt(G + M, 2)} cm²`, "lab-text-ok"],
      ]);
    }
    out += legend(316, 236, [
      ["lab-fill-a", "Grundfläche G"],
      ["lab-fill-b", "Mantel M"],
      ["lab-fill-c", cone ? "Mantellinie s = Radius des Ausschnitts" : "Seitenhöhe hₛ"],
    ]);
    return out + "</svg>";
  },
};

export const FLAECHEN_VIEWS: Record<string, LabView> = {
  "polygon-area": polygonArea,
  composite,
  "surface-net": surfaceNet,
};

