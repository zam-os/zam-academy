import { fmt } from "../exercises/format";
import { circle, clipped, handle, infoBox, line, open, Plot, rect, text, type LabView } from "./svg";
import { legendRow, title } from "./view-helpers";

/** First whole step n ≥ 1 in which a·qⁿ exceeds a + d·n, or −1 within 40 steps. */
export function overtakeYear(a: number, d: number, p: number): number {
  const q = 1 + p / 100;
  for (let n = 1; n <= 40; n++) if (a * q ** n > a + d * n + 1e-9) return n;
  return -1;
}

// 2.1 Linear oder exponentiell: zwei Kurven, zwei Tabellen.
const growthCompare: LabView = {
  render(v) {
    const q = 1 + v.p / 100;
    const lin = (x: number) => v.a + v.d * x;
    const exp = (x: number) => v.a * q ** x;
    const top = Math.max(lin(15), exp(15)) * 1.1;
    const plot = new Plot(0, 15.5, 0, top, { x: 50, y: 40, w: 280, h: 260 });
    let out =
      open(`Linear: ${fmt(v.a)} + ${fmt(v.d)} · x, exponentiell: ${fmt(v.a)} · ${fmt(q, 2)}^x; Jahr ${v.x}`) +
      title(`linear + ${fmt(v.d)} pro Schritt · exponentiell · ${fmt(q, 2)} pro Schritt`);
    out += plot.clip("gc-clip");
    out += rect(plot.box.x, plot.box.y, plot.box.w, plot.box.h, "lab-plot-bg");
    for (let x = 0; x <= 15; x += 5) {
      out += line(plot.X(x), plot.box.y, plot.X(x), plot.box.y + plot.box.h, "lab-grid");
      out += text(plot.X(x), plot.box.y + plot.box.h + 14, String(x), "lab-text-tick", "middle");
    }
    out += clipped("gc-clip", plot.graph(lin, "lab-side-a", 60) + plot.graph(exp, "lab-side-b", 200));
    out += line(plot.X(v.x), plot.box.y, plot.X(v.x), plot.box.y + plot.box.h, "lab-dashed");
    out += circle(plot.X(v.x), plot.Y(lin(v.x)), 5, "lab-point-a") + circle(plot.X(v.x), plot.Y(exp(v.x)), 5, "lab-point-b");
    // Small tables of the first steps.
    out += text(350, 54, "x", "lab-text-small") + text(378, 54, "linear", "lab-text-a") + text(446, 54, "expon.", "lab-text-b");
    for (let x = 0; x <= 5; x++) {
      const y = 74 + x * 20;
      out += text(350, y, String(x), "lab-text-small");
      out += text(378, y, fmt(lin(x), 1), "lab-text-small");
      out += text(446, y, fmt(exp(x), 1), "lab-text-small");
    }
    out += text(350, 200, `immer + ${fmt(v.d)}`, "lab-text-a");
    out += text(350, 218, `immer · ${fmt(q, 2)}`, "lab-text-b");
    const year = overtakeYear(v.a, v.d, v.p);
    out += text(350, 250, year > 0 ? `überholt in Schritt ${year}` : "kein Überholen bis 40", "lab-text-small");
    out += legendRow(50, 334, [
      ["lab-fill-a", "linear: gleiche Summanden"],
      ["lab-fill-b", "exponentiell: gleiche Faktoren"],
    ]);
    return out + handle("x", plot.X(v.x), plot.Y(exp(v.x)), "Schritt x") + "</svg>";
  },
  handles: { x: { x: "x", drag: (p) => ({ x: ((p.x - 50) / 280) * 15.5 }) } },
};

/** The start values of lesson 2.2: an amount of money, a culture, a town. */
export const STARTS = [100, 1000, 50000];

// 2.2 Wachstumsmodelle: y = a · qˣ mit Zu- oder Abnahme.
const growthModel: LabView = {
  render(v) {
    const q = 1 + v.p / 100;
    const f = (x: number) => v.a * q ** x;
    const top = Math.max(v.a, f(20), f(v.x)) * 1.1;
    const plot = new Plot(0, 20.5, 0, top, { x: 60, y: 40, w: 300, h: 260 });
    let out =
      open(`y = ${fmt(v.a)} · ${fmt(q, 2)}^x; nach ${v.x} Schritten ${fmt(f(v.x), 2)}`) +
      title(`y = ${fmt(v.a)} · ${fmt(q, 2)}ˣ  (${v.p >= 0 ? "Zunahme" : "Abnahme"} um ${fmt(Math.abs(v.p))} % pro Schritt)`);
    out += plot.clip("gm-clip");
    out += rect(plot.box.x, plot.box.y, plot.box.w, plot.box.h, "lab-plot-bg");
    for (const share of [0.5, 1, 2]) {
      const yv = v.a * share;
      if (yv < top) {
        out += line(plot.box.x, plot.Y(yv), plot.box.x + plot.box.w, plot.Y(yv), "lab-grid");
        out += text(plot.box.x - 4, plot.Y(yv) + 4, `${share === 1 ? "a" : share === 2 ? "2a" : "a/2"}`, "lab-text-tick", "end");
      }
    }
    for (let x = 0; x <= 20; x += 5) out += text(plot.X(x), plot.box.y + plot.box.h + 14, String(x), "lab-text-tick", "middle");
    out += clipped("gm-clip", plot.graph(f, v.p >= 0 ? "lab-curve" : "lab-side-b", 200));
    for (let x = 0; x <= 20; x++) out += circle(plot.X(x), plot.Y(f(x)), 2.2, "lab-dot-small");
    const P = plot.P(v.x, f(v.x));
    out += line(P.x, plot.Y(0), P.x, P.y, "lab-dashed");
    out += infoBox(380, 80, [
      [`Startwert a = ${fmt(v.a)}`, "lab-text-a"],
      [`Faktor q = ${fmt(q, 2)}`, "lab-text-b"],
      [`nach ${v.x}: ${fmt(f(v.x), 2)}`, "lab-text-ok"],
      [`${fmt((q ** v.x - 1) * 100, 1)} % insgesamt`, "lab-text-small"],
    ]);
    return out + handle("x", P.x, Math.max(plot.box.y, P.y), "Schritt") + "</svg>";
  },
  handles: { x: { x: "x", drag: (p) => ({ x: ((p.x - 60) / 300) * 20.5 }) } },
};

// 2.3 Wachstum berechnen: Faktor aus Start, Ende und Dauer.
const SOLVER_BOX = { x: 50, y: 40, w: 280, h: 260 };
const growthSolver: LabView = {
  render(v) {
    const q = (v.y / v.a) ** (1 / v.n);
    const f = (x: number) => v.a * q ** x;
    const top = Math.max(v.a, v.y) * 1.25;
    const plot = new Plot(0, 12.5, 0, top, SOLVER_BOX);
    let out =
      open(`Von ${fmt(v.a)} auf ${fmt(v.y)} in ${v.n} Schritten: Faktor ${fmt(q, 4)}`) +
      title(`q = ${v.n === 1 ? "" : `${v.n}-te Wurzel aus `}(${fmt(v.y)} : ${fmt(v.a)}) ≈ ${fmt(q, 4)}`);
    out += plot.clip("gs-clip");
    out += rect(plot.box.x, plot.box.y, plot.box.w, plot.box.h, "lab-plot-bg");
    for (let x = 0; x <= 12; x += 2) out += text(plot.X(x), plot.box.y + plot.box.h + 14, String(x), "lab-text-tick", "middle");
    // Solid between the two given points, dashed where the model is extended.
    const solid = (x: number) => (x <= v.n ? f(x) : Number.NaN);
    const beyond = (x: number) => (x >= v.n ? f(x) : Number.NaN);
    out += clipped("gs-clip", plot.graph(beyond, "lab-curve-dashed", 200) + plot.graph(solid, "lab-curve", 200));
    out += circle(plot.X(0), plot.Y(v.a), 6, "lab-point-a") + circle(plot.X(v.n), plot.Y(v.y), 6, "lab-point-b");
    out += text(plot.X(0) + 8, plot.Y(v.a) + 18, `a = ${fmt(v.a)}`, "lab-text-a");
    out += text(plot.X(v.n) + 12, plot.Y(v.y) + 22, `${fmt(v.y)} nach ${v.n}`, "lab-text-b");
    const doubling = q > 1 ? Math.log(2) / Math.log(q) : q < 1 ? Math.log(0.5) / Math.log(q) : Number.NaN;
    out += infoBox(352, 80, [
      [`q ≈ ${fmt(q, 4)}`, "lab-text-c"],
      [`Rate ≈ ${fmt((q - 1) * 100, 2)} %`, "lab-text-c"],
      [q === 1 ? "kein Wachstum" : q > 1 ? "Verdopplung nach" : "Halbierung nach", "lab-text-small"],
      [q === 1 ? "" : `≈ ${fmt(doubling, 2)} Schritten`, "lab-text-ok"],
    ]);
    return out + handle("end", plot.X(v.n), plot.Y(v.y), "Endwert") + "</svg>";
  },
  handles: {
    end: { x: "n", y: "y", drag: (p) => ({ n: ((p.x - SOLVER_BOX.x) / SOLVER_BOX.w) * 12.5 }) },
  },
};

export const WACHSTUM_VIEWS: Record<string, LabView> = {
  "growth-compare": growthCompare,
  "growth-model": growthModel,
  "growth-solver": growthSolver,
};
