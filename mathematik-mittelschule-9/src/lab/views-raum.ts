import { fmt } from "../exercises/format";
import { compositeSolid, COMPOSITE_SOLIDS, regularPolygon } from "../models";
import {
  infoBox,
  line,
  open,
  polygon,
  text,
  type LabView,
  type Pt,
} from "./svg";
import { legend, title } from "./view-helpers";

/** Oblique projection: depth at 45°, shortened to half. */
function oblique(x: number, y: number, z: number, u: number, ox: number, oy: number): Pt {
  const q = 0.5 * Math.SQRT1_2;
  return { x: ox + (x + y * q) * u, y: oy - (z + y * q) * u };
}

/** Corners of a regular n-gon with side s around (cx, cy) in the ground plane. */
function regularBase(n: number, s: number, cx: number, cy: number): Array<{ x: number; y: number }> {
  const R = regularPolygon(n, s).radius;
  return Array.from({ length: n }, (_, i) => {
    const t = -Math.PI / 2 + Math.PI / n + (i * 2 * Math.PI) / n;
    return { x: cx + R * Math.cos(t), y: cy + R * Math.sin(t) };
  });
}

/** An ellipse (a circle in oblique view) as a polygon. */
function ring(r: number, z: number, cx: number, cy: number, P: (x: number, y: number, z: number) => Pt): Pt[] {
  return Array.from({ length: 48 }, (_, i) => {
    const t = (i / 48) * 2 * Math.PI;
    return P(cx + r * Math.cos(t), cy + r * Math.sin(t), z);
  });
}

// 5.1 Prisma: Grundfläche mal Körperhöhe, Schicht für Schicht.
const prismVolume: LabView = {
  render(v) {
    const poly = regularPolygon(v.n, v.s);
    const G = (v.n * v.s * poly.apothem) / 2;
    const V = G * v.hk;
    const R = poly.radius;
    const u = Math.min(16, 210 / (2 * R * 1.36), 240 / (v.hk + R));
    const P = (x: number, y: number, z: number) => oblique(x, y, z, u, 110, 300);
    const base = regularBase(v.n, v.s, R, R);
    let out =
      open(`Prisma mit regelmäßigem ${v.n}-Eck als Grundfläche: G ≈ ${fmt(G, 2)} cm², V ≈ ${fmt(V, 2)} cm³`) +
      title(`V = G · hₖ ≈ ${fmt(G, 2)} cm² · ${fmt(v.hk)} cm ≈ ${fmt(V, 2)} cm³`);
    const bottom = base.map((p) => P(p.x, p.y, 0));
    const top = base.map((p) => P(p.x, p.y, v.hk));
    // Layers of 1 cm, alternately coloured; side faces from back to front.
    const order = base
      .map((p, i) => ({ i, depth: p.y + base[(i + 1) % v.n].y }))
      .sort((p, q) => q.depth - p.depth)
      .map((f) => f.i);
    for (let z = 0; z < v.hk; z++) {
      for (const i of order) {
        const j = (i + 1) % v.n;
        out += polygon([P(base[i].x, base[i].y, z), P(base[j].x, base[j].y, z), P(base[j].x, base[j].y, z + 1), P(base[i].x, base[i].y, z + 1)], z % 2 === 0 ? "lab-fill-b" : "lab-shape-2");
      }
    }
    out += polygon(top, "lab-fill-a");
    bottom.forEach((p, i) => {
      out += line(p.x, p.y, top[i].x, top[i].y, "lab-ink");
    });
    out += polygon(bottom, "lab-ghost");
    out += line(top[0].x - 14, top[0].y, bottom[0].x - 14, bottom[0].y, "lab-side-c");
    out += text(bottom[0].x - 18, (top[0].y + bottom[0].y) / 2, "hₖ", "lab-text-c", "end");
    out += infoBox(320, 70, [
      [`${v.n}-Eck, s = ${fmt(v.s)} cm`, "lab-text-a"],
      [`G ≈ ${fmt(G, 2)} cm²`, "lab-text-a"],
      [`${fmt(v.hk)} Schichten zu je 1 cm`, "lab-text-b"],
      [`V ≈ ${fmt(V, 2)} cm³`, "lab-text-ok"],
      [`= ${fmt(V / 1000, 3)} l`, "lab-text-ok"],
    ]);
    out += legend(320, 200, [
      ["lab-fill-a", "Grundfläche G (oben gleich unten)"],
      ["lab-fill-b", "eine Schicht: G · 1 cm"],
      ["lab-fill-c", "Körperhöhe hₖ"],
    ]);
    return out + "</svg>";
  },
};

// 5.2 Umschütten: Pyramide (Kegel) und Prisma (Zylinder) mit gleicher Grundfläche und Höhe.
const pour: LabView = {
  render(v) {
    const cone = v.body === 1;
    const a = v.a;
    const h = v.h;
    const G = cone ? Math.PI * (a / 2) ** 2 : a * a;
    const V = (G * h) / 3;
    const u = Math.min(18, 160 / (a * 1.36), 220 / (h + a * 0.36));
    const left = (x: number, y: number, z: number) => oblique(x, y, z, u, 40, 290);
    const right = (x: number, y: number, z: number) => oblique(x, y, z, u, 280, 290);
    const level = Math.min(3, v.pours) / 3;
    let out =
      open(`${cone ? "Kegel und Zylinder" : "Pyramide und Prisma"} mit gleicher Grundfläche und Höhe; ${v.pours}-mal umgeschüttet`) +
      title(`${v.pours} von 3 Füllungen: V = ⅓ · G · h ≈ ${fmt(V, 2)} cm³`);
    if (cone) {
      const r = a / 2;
      const apex = left(r, r, h);
      out += polygon(ring(r, 0, r, r, left), "lab-fill-a");
      out += polygon([left(0, r, 0), left(a, r, 0), apex], "lab-fill-b");
      const bottom = ring(r, 0, r, r, right);
      const top = ring(r, h, r, r, right);
      const water = ring(r, h * level, r, r, right);
      out += polygon([right(0, r, 0), right(a, r, 0), right(a, r, h), right(0, r, h)], "lab-shape-2");
      if (level > 0) out += polygon([right(0, r, 0), right(a, r, 0), right(a, r, h * level), right(0, r, h * level)], "lab-fill-b");
      out += polygon(bottom, "lab-ghost") + polygon(water, level > 0 ? "lab-fill-b" : "lab-ghost") + polygon(top, "lab-ghost");
    } else {
      const sq = (P: typeof left, z: number) => [P(0, 0, z), P(a, 0, z), P(a, a, z), P(0, a, z)];
      const apex = left(a / 2, a / 2, h);
      out += polygon(sq(left, 0), "lab-fill-a");
      out += polygon([left(0, 0, 0), left(a, 0, 0), apex], "lab-fill-b");
      out += polygon([left(a, 0, 0), left(a, a, 0), apex], "lab-fill-b");
      out += polygon([right(0, 0, 0), right(a, 0, 0), right(a, 0, h), right(0, 0, h)], "lab-shape-2");
      out += polygon([right(a, 0, 0), right(a, a, 0), right(a, a, h), right(a, 0, h)], "lab-shape-2");
      if (level > 0) {
        out += polygon([right(0, 0, 0), right(a, 0, 0), right(a, 0, h * level), right(0, 0, h * level)], "lab-fill-b");
        out += polygon([right(a, 0, 0), right(a, a, 0), right(a, a, h * level), right(a, 0, h * level)], "lab-fill-b");
        out += polygon(sq(right, h * level), "lab-fill-b");
      }
      out += polygon(sq(right, h), "lab-ghost");
    }
    for (let k = 1; k <= 2; k++) {
      const mark = right(0, 0, (h * k) / 3);
      out += line(mark.x - 8, mark.y, mark.x, mark.y, "lab-axis");
      out += text(mark.x - 10, mark.y + 4, `${k}/3`, "lab-text-tick", "end");
    }
    out += text(130, 316, cone ? "Kegel" : "Pyramide", "lab-text-b", "middle");
    out += text(370, 316, cone ? "Zylinder" : "Prisma (Quader)", "lab-text", "middle");
    out += infoBox(380, 64, [
      [`G = ${cone ? `π · ${fmt(a / 2)}²` : `${fmt(a)}²`} ≈ ${fmt(G, 2)} cm²`, "lab-text-a"],
      [`Prisma: G · h ≈ ${fmt(G * h, 2)} cm³`, "lab-text"],
      [`Spitzer Körper: ⅓ davon`, "lab-text-b"],
      [`V ≈ ${fmt(V, 2)} cm³`, "lab-text-ok"],
    ]);
    return out + "</svg>";
  },
};

// 5.3 Zusammengesetzte Körper: Haus, Turm, Silo.
const compositeSolidView: LabView = {
  render(v) {
    const solid = compositeSolid(v.shape, v.a, v.b, v.h1, v.h2);
    const depth = v.shape === 0 ? v.b : v.a;
    const u = Math.min(16, 230 / (v.a + depth * 0.36), 250 / (v.h1 + v.h2 + depth * 0.36));
    const P = (x: number, y: number, z: number) => oblique(x, y, z, u, 60, 305);
    let out =
      open(`${COMPOSITE_SOLIDS[v.shape]}: unten ${fmt(solid.lower, 2)} m³, oben ${fmt(solid.upper, 2)} m³, zusammen ${fmt(solid.total, 2)} m³`) +
      title(`${COMPOSITE_SOLIDS[v.shape]}: V = ${fmt(solid.lower, 2)} + ${fmt(solid.upper, 2)} = ${fmt(solid.total, 2)} m³`);
    if (v.shape === 2) {
      const r = v.a / 2;
      out += polygon([P(0, r, 0), P(v.a, r, 0), P(v.a, r, v.h1), P(0, r, v.h1)], "lab-fill-a");
      out += polygon(ring(r, 0, r, r, P), "lab-ghost");
      out += polygon(ring(r, v.h1, r, r, P), "lab-fill-a");
      out += polygon([P(0, r, v.h1), P(v.a, r, v.h1), P(r, r, v.h1 + v.h2)], "lab-fill-b");
    } else {
      const d = depth;
      const box = (z0: number, z1: number, cls: string) =>
        polygon([P(0, 0, z0), P(v.a, 0, z0), P(v.a, 0, z1), P(0, 0, z1)], cls) +
        polygon([P(v.a, 0, z0), P(v.a, d, z0), P(v.a, d, z1), P(v.a, 0, z1)], cls) +
        polygon([P(0, 0, z1), P(v.a, 0, z1), P(v.a, d, z1), P(0, d, z1)], cls);
      out += box(0, v.h1, "lab-fill-a");
      if (v.shape === 0) {
        const ridgeFront = P(v.a / 2, 0, v.h1 + v.h2);
        const ridgeBack = P(v.a / 2, d, v.h1 + v.h2);
        out += polygon([P(0, 0, v.h1), P(v.a, 0, v.h1), ridgeFront], "lab-fill-b");
        out += polygon([P(v.a, 0, v.h1), P(v.a, d, v.h1), ridgeBack, ridgeFront], "lab-fill-b");
      } else {
        const apex = P(v.a / 2, d / 2, v.h1 + v.h2);
        out += polygon([P(0, 0, v.h1), P(v.a, 0, v.h1), apex], "lab-fill-b");
        out += polygon([P(v.a, 0, v.h1), P(v.a, d, v.h1), apex], "lab-fill-b");
      }
    }
    out += infoBox(340, 64, [
      [solid.lowerName, "lab-text-a"],
      [`${solid.lowerFormula} = ${fmt(solid.lower, 2)} m³`, "lab-text-a"],
      [solid.upperName, "lab-text-b"],
      [`${solid.upperFormula} = ${fmt(solid.upper, 2)} m³`, "lab-text-b"],
      [`zusammen ${fmt(solid.total, 2)} m³`, "lab-text-ok"],
    ]);
    out += legend(340, 200, [
      ["lab-fill-a", "unterer Körper"],
      ["lab-fill-b", "aufgesetzter Körper"],
    ]);
    return out + "</svg>";
  },
};

export const RAUM_VIEWS: Record<string, LabView> = {
  "prism-volume": prismVolume,
  pour,
  "composite-solid": compositeSolidView,
};
