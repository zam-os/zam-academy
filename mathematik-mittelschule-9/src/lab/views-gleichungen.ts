import { fmt, linear } from "../exercises/format";
import {
  circle,
  clipped,
  handle,
  infoBox,
  line,
  open,
  path,
  Plot,
  polygon,
  rect,
  text,
  type LabView,
} from "./svg";
import { legend, legendRow, title } from "./view-helpers";

/** "3(x + 2)" with a real minus for a negative summand. */
export function bracketTerm(p: number, q: number): string {
  const inner = q === 0 ? "x" : `x ${q > 0 ? "+" : "−"} ${fmt(Math.abs(q))}`;
  return `${p === 1 ? "" : fmt(p)}(${inner})`;
}

// 7.1 Die Waage: p(x + q) = m·x + n.
const balance: LabView = {
  render(v) {
    const left = v.p * (v.x + v.q);
    const right = v.m * v.x + v.n;
    const diff = left - right;
    const tilt = Math.max(-14, Math.min(14, diff * 1.2));
    const cx = 260;
    const cy = 120;
    const rad = (tilt * Math.PI) / 180;
    const L = { x: cx - 170 * Math.cos(rad), y: cy + 170 * Math.sin(rad) };
    const R = { x: cx + 170 * Math.cos(rad), y: cy - 170 * Math.sin(rad) };
    const rightSide = linear(v.m, v.n) === "0" ? "0" : linear(v.m, v.n);
    let out =
      open(`Waage: links ${bracketTerm(v.p, v.q)} = ${fmt(left)}, rechts ${rightSide} = ${fmt(right)} bei x = ${fmt(v.x)}`) +
      title(`${bracketTerm(v.p, v.q)} = ${rightSide}`);
    out += polygon([{ x: cx - 16, y: 300 }, { x: cx + 16, y: 300 }, { x: cx, y: cy }], "lab-shape-2");
    out += line(L.x, L.y, R.x, R.y, "lab-ink");
    out += line(L.x, L.y, L.x, L.y + 60, "lab-thin") + line(R.x, R.y, R.x, R.y + 60, "lab-thin");
    out += rect(L.x - 70, L.y + 60, 140, 40, "lab-fill-a", 'rx="8"');
    out += rect(R.x - 70, R.y + 60, 140, 40, "lab-fill-b", 'rx="8"');
    out += text(L.x, L.y + 86, `${bracketTerm(v.p, v.q)} = ${fmt(left)}`, "lab-text-a", "middle");
    out += text(R.x, R.y + 86, `${rightSide} = ${fmt(right)}`, "lab-text-b", "middle");
    const ok = Math.abs(diff) < 1e-9;
    out += infoBox(150, 250, [
      [`x = ${fmt(v.x)}: links ${fmt(left)}, rechts ${fmt(right)}`, "lab-text"],
      [ok ? "Gleichgewicht: x ist eine Lösung." : diff > 0 ? "Links ist schwerer." : "Rechts ist schwerer.", ok ? "lab-text-ok" : "lab-text-bad"],
    ]);
    return out + "</svg>";
  },
};

// 7.2 Mischen: zwei Flüssigkeiten mit verschiedenem Anteil.
const mixing: LabView = {
  render(v) {
    const total = v.a1 + v.a2;
    const mix = total > 0 ? (v.a1 * v.c1 + v.a2 * v.c2) / total : 0;
    let out =
      open(`Mischung aus ${fmt(v.a1)} l mit ${fmt(v.c1)} % und ${fmt(v.a2)} l mit ${fmt(v.c2)} %: ${fmt(mix, 1)} %`) +
      title(total > 0 ? `${fmt(v.a1)} · ${fmt(v.c1)} % + ${fmt(v.a2)} · ${fmt(v.c2)} % = ${fmt(total)} · ${fmt(mix, 2)} %` : "Gieße etwas in die Gefäße.");
    const beaker = (x: number, amount: number, conc: number, cls: string, label: string, max: number) => {
      const h = 150;
      let s = path(`M${x} 70 L${x} ${70 + h} L${x + 90} ${70 + h} L${x + 90} 70`, "lab-ink");
      const level = (amount / max) * h;
      s += rect(x + 2, 70 + h - level, 86, level, cls);
      s += rect(x + 2, 70 + h - level, 86 * (conc / 100), level, "lab-fill-c");
      s += text(x + 45, 70 + h + 18, label, "lab-text-small", "middle");
      return s;
    };
    out += beaker(30, v.a1, v.c1, "lab-fill-a", `${fmt(v.a1)} l, ${fmt(v.c1)} %`, 10);
    out += beaker(160, v.a2, v.c2, "lab-fill-b", `${fmt(v.a2)} l, ${fmt(v.c2)} %`, 10);
    out += beaker(330, total, mix, "lab-fill-ok", `${fmt(total)} l, ${fmt(mix, 1)} %`, 20);
    out += text(140, 150, "+", "lab-text-big", "middle") + text(285, 150, "=", "lab-text-big", "middle");
    out += legendRow(30, 300, [
      ["lab-fill-c", "Anteil des Wirkstoffs (Saft, Salz …)"],
      ["lab-fill-ok", "Mischung"],
    ]);
    out += text(30, 324, "Wirkstoff vorher = Wirkstoff nachher: a₁ · p₁ + a₂ · p₂ = (a₁ + a₂) · p", "lab-text-small");
    return out + "</svg>";
  },
};

/** The formulas of lesson 7.3. */
export const FORMULAS = [
  { name: "Trapez A = (a + c) · h : 2", unit: "cm²" },
  { name: "Geschwindigkeit s = v · t", unit: "km" },
  { name: "Zylinder V = π · r² · h", unit: "cm³" },
];

/** The value of formula f for the lab's sliders. */
export function formulaValue(v: Record<string, number>): number {
  if (v.f === 0) return ((v.a + v.c) * v.h) / 2;
  if (v.f === 1) return v.v * v.t;
  return Math.PI * v.r * v.r * v.h;
}

// 7.3 Formeln: drei Formeln als Bilder.
const formula: LabView = {
  render(v) {
    const value = formulaValue(v);
    let out =
      open(`${FORMULAS[v.f].name}: Ergebnis ${fmt(value, 2)} ${FORMULAS[v.f].unit}`) +
      title(`${FORMULAS[v.f].name} = ${fmt(value, 2)} ${FORMULAS[v.f].unit}`);
    if (v.f === 0) {
      const k = 20;
      const x0 = 60;
      const y0 = 260;
      const shift = ((v.a - v.c) / 2) * k;
      out += polygon([{ x: x0, y: y0 }, { x: x0 + v.a * k, y: y0 }, { x: x0 + shift + v.c * k, y: y0 - v.h * k }, { x: x0 + shift, y: y0 - v.h * k }], "lab-fill-a");
      out += line(x0 + shift, y0, x0 + shift, y0 - v.h * k, "lab-side-c");
      out += text(x0 + (v.a * k) / 2, y0 + 18, `a = ${fmt(v.a)}`, "lab-text-a", "middle");
      out += text(x0 + shift + (v.c * k) / 2, y0 - v.h * k - 8, `c = ${fmt(v.c)}`, "lab-text-a", "middle");
      out += text(x0 + shift + 6, y0 - (v.h * k) / 2, `h = ${fmt(v.h)}`, "lab-text-c");
    } else if (v.f === 1) {
      const x0 = 40;
      const scale = 400 / 600;
      out += line(x0, 200, x0 + 400, 200, "lab-axis");
      for (let km = 0; km <= 600; km += 100) {
        out += line(x0 + km * scale, 195, x0 + km * scale, 205, "lab-axis");
        out += text(x0 + km * scale, 222, `${km} km`, "lab-text-tick", "middle");
      }
      for (let hour = 1; hour <= v.t; hour++) {
        const x1 = x0 + Math.min(600, v.v * (hour - 1)) * scale;
        const x2 = x0 + Math.min(600, v.v * hour) * scale;
        out += rect(x1, 160, Math.max(0, x2 - x1 - 2), 24, hour % 2 ? "lab-fill-a" : "lab-fill-b");
      }
      const frac = v.t - Math.floor(v.t);
      if (frac > 0) {
        const x1 = x0 + Math.min(600, v.v * Math.floor(v.t)) * scale;
        const x2 = x0 + Math.min(600, v.v * v.t) * scale;
        out += rect(x1, 160, Math.max(0, x2 - x1), 24, "lab-fill-c");
      }
      out += text(x0, 140, `je Stunde ${fmt(v.v)} km, ${fmt(v.t)} Stunden`, "lab-text");
    } else {
      const k = 14;
      const cx = 160;
      const base = 270;
      const rx = v.r * k;
      const ry = rx * 0.35;
      const top = base - v.h * k * 2;
      out += rect(cx - rx, top, 2 * rx, base - top, "lab-fill-a");
      out += `<ellipse cx="${cx}" cy="${top.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" class="lab-fill-b"/>`;
      out += `<ellipse cx="${cx}" cy="${base}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" class="lab-ghost"/>`;
      out += line(cx, top, cx + rx, top, "lab-side-a");
      out += text(cx + rx / 2, top - 6, `r = ${fmt(v.r)}`, "lab-text-a", "middle");
      out += line(cx + rx + 10, top, cx + rx + 10, base, "lab-side-c");
      out += text(cx + rx + 16, (top + base) / 2, `h = ${fmt(v.h)}`, "lab-text-c");
    }
    out += infoBox(330, 250, [[`Ergebnis: ${fmt(value, 2)} ${FORMULAS[v.f].unit}`, "lab-text-ok"]]);
    return out + "</svg>";
  },
};

// 7.4 Produkte von Summen: das Rechteckmodell (x + a)(x + b).
const areaProduct: LabView = {
  render(v) {
    const k = Math.min(24, 260 / (v.x + Math.max(v.a, v.b)));
    const x0 = 40;
    const y0 = 40;
    const X = v.x * k;
    const A = v.a * k;
    const B = v.b * k;
    let out =
      open(`Rechteck (x + ${v.a})(x + ${v.b}) = x² + ${v.a + v.b}x + ${v.a * v.b} bei x = ${fmt(v.x)}`) +
      title(`(x + ${v.a})(x + ${v.b}) = x² + ${v.a + v.b}x + ${v.a * v.b}`);
    out += rect(x0, y0, X, X, "lab-fill-c");
    out += rect(x0 + X, y0, B, X, "lab-fill-a");
    out += rect(x0, y0 + X, X, A, "lab-fill-b");
    out += rect(x0 + X, y0 + X, B, A, "lab-fill-ok");
    out += text(x0 + X / 2, y0 + X / 2 + 4, "x²", "lab-text-c", "middle");
    out += text(x0 + X + B / 2, y0 + X / 2 + 4, `${v.b}x`, "lab-text-a", "middle");
    out += text(x0 + X / 2, y0 + X + A / 2 + 4, `${v.a}x`, "lab-text-b", "middle");
    out += text(x0 + X + B / 2, y0 + X + A / 2 + 4, `${v.a * v.b}`, "lab-text-ok", "middle");
    out += text(x0 + X / 2, y0 - 6, "x", "lab-text-small", "middle") + text(x0 + X + B / 2, y0 - 6, String(v.b), "lab-text-small", "middle");
    out += text(x0 - 6, y0 + X / 2, "x", "lab-text-small", "end") + text(x0 - 6, y0 + X + A / 2, String(v.a), "lab-text-small", "end");
    const value = (v.x + v.a) * (v.x + v.b);
    out += infoBox(330, 70, [
      [`x = ${fmt(v.x)}`, "lab-text"],
      [`(${fmt(v.x)} + ${v.a}) · (${fmt(v.x)} + ${v.b}) = ${fmt(value)}`, "lab-text"],
      [`x² + ${v.a + v.b}x + ${v.a * v.b} = ${fmt(v.x * v.x + (v.a + v.b) * v.x + v.a * v.b)}`, "lab-text-ok"],
    ]);
    out += legend(330, 170, [
      ["lab-fill-c", "x · x = x²"],
      ["lab-fill-a", `x · ${v.b}`],
      ["lab-fill-b", `${v.a} · x`],
      ["lab-fill-ok", `${v.a} · ${v.b}`],
    ]);
    return out + "</svg>";
  },
};

// 7.5 Bruchgleichung a : (x − b) = c als Schnitt von Hyperbel und Gerade.
const fractionGraph: LabView = {
  render(v) {
    const plot = new Plot(-6, 10, -4, 10);
    const f = (x: number) => v.a / (x - v.b);
    const solution = v.b + v.a / v.c;
    let out =
      open(`Bruchgleichung ${fmt(v.a)} : (x − ${fmt(v.b)}) = ${fmt(v.c)}: Lösung x = ${fmt(solution, 2)}, ausgeschlossen x = ${fmt(v.b)}`) +
      title(`${fmt(v.a)} / (x ${v.b < 0 ? "+" : "−"} ${fmt(Math.abs(v.b))}) = ${fmt(v.c)}   D = ℚ ∖ {${fmt(v.b)}}`);
    out += plot.clip("frac-clip");
    out += plot.grid(1, 2);
    out += clipped(
      "frac-clip",
      plot.graph((x) => (x > v.b ? f(x) : Number.NaN), "lab-curve", 300) +
        plot.graph((x) => (x < v.b ? f(x) : Number.NaN), "lab-curve", 300) +
        plot.lineThrough(0, v.c, "lab-side-b") +
        line(plot.X(v.b), plot.box.y, plot.X(v.b), plot.box.y + plot.box.h, "lab-bad-stroke"),
    );
    if (plot.contains(solution, v.c)) out += circle(plot.X(solution), plot.Y(v.c), 6, "lab-point-ok");
    const y = Number.isFinite(f(v.x)) && Math.abs(v.x - v.b) > 1e-9 ? f(v.x) : Number.NaN;
    const handleY = Number.isFinite(y) ? Math.max(plot.ymin, Math.min(plot.ymax, y)) : 0;
    out += line(plot.X(v.x), plot.box.y, plot.X(v.x), plot.box.y + plot.box.h, "lab-dashed");
    out += infoBox(360, 236, [
      [Number.isFinite(y) ? `x = ${fmt(v.x)}: links ${fmt(y, 2)}` : `x = ${fmt(v.x)} ist nicht erlaubt`, Number.isFinite(y) ? "lab-text" : "lab-text-bad"],
      [`rechts ${fmt(v.c)}`, "lab-text-b"],
    ]);
    return out + handle("x", plot.X(v.x), plot.Y(handleY), "Probe-x") + "</svg>";
  },
  handles: {
    x: { x: "x", drag: (p) => ({ x: -6 + ((p.x - 20) / 480) * 16 }) },
  },
};

// 7.6 Zwei Geraden: das Gleichungssystem als Schnittpunkt.
const twoLines: LabView = {
  render(v) {
    const plot = new Plot(-8, 8, -8, 8);
    const det = v.m1 - v.m2;
    const sx = det !== 0 ? (v.t2 - v.t1) / det : Number.NaN;
    const sy = v.m1 * sx + v.t1;
    let out =
      open(`Zwei Geraden y = ${linear(v.m1, v.t1)} und y = ${linear(v.m2, v.t2)}`) +
      title(det !== 0 ? `Schnittpunkt S(${fmt(sx, 2)} | ${fmt(sy, 2)})` : v.t1 === v.t2 ? "gleiche Gerade: unendlich viele Lösungen" : "parallel: keine Lösung");
    out += plot.clip("lines-clip");
    out += plot.grid(1, 2);
    out += clipped("lines-clip", plot.lineThrough(v.m1, v.t1, "lab-side-a") + plot.lineThrough(v.m2, v.t2, "lab-side-b"));
    if (det !== 0 && plot.contains(sx, sy)) out += circle(plot.X(sx), plot.Y(sy), 6, "lab-point-ok");
    out += legendRow(30, 332, [
      ["lab-fill-a", `I: y = ${linear(v.m1, v.t1)}`],
      ["lab-fill-b", `II: y = ${linear(v.m2, v.t2)}`],
    ]);
    return out + "</svg>";
  },
};

// 7.7 Reinquadratisch: a · x² = c als Schnitt der Parabel mit einer Geraden.
const pureQuadratic: LabView = {
  render(v) {
    const plot = new Plot(-6, 6, -4, 20);
    const rhs = v.c / v.a;
    const sol = rhs > 0 ? Math.sqrt(rhs) : rhs === 0 ? 0 : Number.NaN;
    let out =
      open(`${fmt(v.a)}x² = ${fmt(v.c)}: ${rhs > 0 ? `x = ±${fmt(sol, 2)}` : rhs === 0 ? "x = 0" : "keine Lösung"}`) +
      title(`${v.a === 1 ? "" : fmt(v.a)}x² = ${fmt(v.c)}  ⇒  x² = ${fmt(rhs, 2)}  ⇒  ${rhs > 0 ? `L = {−${fmt(sol, 2)}; ${fmt(sol, 2)}}` : rhs === 0 ? "L = {0}" : "L = { }"}`);
    out += plot.clip("pq-clip");
    out += plot.grid(1, 2);
    out += clipped("pq-clip", plot.graph((x) => x * x, "lab-curve", 200) + plot.lineThrough(0, rhs, "lab-side-b"));
    if (rhs > 0 && plot.contains(sol, rhs)) {
      out += circle(plot.X(sol), plot.Y(rhs), 6, "lab-point-ok") + circle(plot.X(-sol), plot.Y(rhs), 6, "lab-point-ok");
    } else if (rhs === 0) out += circle(plot.X(0), plot.Y(0), 6, "lab-point-ok");
    out += infoBox(340, 250, [
      [`y = x² (Normalparabel)`, "lab-text"],
      [`y = ${fmt(rhs, 2)}`, "lab-text-b"],
      [rhs > 0 ? "zwei Lösungen" : rhs === 0 ? "eine Lösung" : "keine Lösung", "lab-text-ok"],
    ]);
    return out + "</svg>";
  },
};

export const GLEICHUNGEN_VIEWS: Record<string, LabView> = {
  balance,
  mixing,
  formula,
  "area-product": areaProduct,
  "fraction-graph": fractionGraph,
  "two-lines": twoLines,
  "pure-quadratic": pureQuadratic,
};
