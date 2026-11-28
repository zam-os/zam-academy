import { fmt, MINUS } from "../exercises/format";
import {
  circle,
  clipped,
  dashedLine,
  handle,
  infoBox,
  line,
  open,
  Plot,
  rect,
  text,
  type LabView,
} from "./svg";
import { coordinateHandle, rail, title } from "./view-helpers";

/** Lab views for Stage 1: Funktion und Term. */

const funcRepresentations: LabView = {
  render(v) {
    const base = v.base;
    const rate = v.rate;
    const xSel = v.x;
    const ySel = base + rate * xSel;
    let out = open("Wertetabelle, Term und Graph eines Tarifs");
    out += title(`K(x) = ${fmt(base, 0)} + ${fmt(rate, 1)}·x   ⇒   K(${fmt(xSel, 0)}) = ${fmt(ySel, 1)} €`);

    // Left mini table
    const xs = [0, 10, 20, 30, 40];
    out += rect(20, 44, 150, 28, "lab-cell-sum");
    out += text(60, 62, "x", "lab-text-small", "middle");
    out += text(130, 62, "K(x) in €", "lab-text-small", "middle");
    xs.forEach((xv, i) => {
      const ry = 72 + i * 32;
      const active = xv === xSel;
      out += rect(20, ry, 150, 32, active ? "lab-fill-a lab-cell" : "lab-cell");
      out += text(60, ry + 20, fmt(xv, 0), active ? "lab-text-a" : "lab-text", "middle");
      out += text(130, ry + 20, fmt(base + rate * xv, 1), active ? "lab-text-ok" : "lab-text", "middle");
    });

    // Right plot
    const plot = new Plot(0, 45, 0, 50, { x: 205, y: 44, w: 295, h: 205 });
    out += plot.grid(10, 10, "x", "K");
    out += clipped("frep-clip", plot.clip("frep-clip") + plot.lineThrough(rate, base, "lab-curve"));
    for (const xv of xs) {
      out += circle(plot.X(xv), plot.Y(base + rate * xv), 3.5, "lab-point-b");
    }
    out += dashedLine(plot.X(xSel), plot.Y(0), plot.X(xSel), plot.Y(ySel), "lab-dashed");
    out += dashedLine(plot.X(0), plot.Y(ySel), plot.X(xSel), plot.Y(ySel), "lab-dashed");
    out += handle("x", plot.X(xSel), plot.Y(ySel), "Verbrauch x");
    out += rail("x", "Menge x", xSel, 0, 40, 298);
    return out + "</svg>";
  },
  handles: {
    x: {
      x: "x",
      drag: (p) => {
        const plot = new Plot(0, 45, 0, 50, { x: 205, y: 44, w: 295, h: 205 });
        return { x: plot.invX(p.x) };
      },
    },
  },
};

const verticalLineTest: LabView = {
  render(v) {
    const mode = v.mode;
    const xProbe = v.x;
    const plot = new Plot(-4, 4, -4, 4, { x: 30, y: 42, w: 300, h: 250 });
    let out = open("Senkrechtentest für Eindeutigkeit");
    const names = ["Gerade y = 0,5x + 1", "Parabel y = 0,4x² − 1", "Kreis x² + y² = 9", "Waagrechter Pfeil ±√x"];
    out += title(names[mode] ?? names[0]);
    out += plot.grid(1, 2, "x", "y");

    let hits: number[] = [];
    let curve = "";
    if (mode === 0) {
      curve = plot.lineThrough(0.5, 1, "lab-curve-ok");
      hits = [0.5 * xProbe + 1];
    } else if (mode === 1) {
      curve = plot.graph((x) => 0.4 * x * x - 1, "lab-curve-ok");
      hits = [0.4 * xProbe * xProbe - 1];
    } else if (mode === 2) {
      const rx = plot.X(3) - plot.X(0);
      const ry = plot.Y(0) - plot.Y(3);
      curve = `<ellipse cx="${plot.X(0)}" cy="${plot.Y(0)}" rx="${rx}" ry="${ry}" class="lab-curve-2"/>`;
      const d = 9 - xProbe * xProbe;
      if (d > 1e-6) hits = [-Math.sqrt(d), Math.sqrt(d)];
      else if (Math.abs(d) <= 1e-6) hits = [0];
    } else {
      curve =
        plot.graph((x) => (x >= -1 ? Math.sqrt(x + 1) * 1.4 : Number.NaN), "lab-curve-2") +
        plot.graph((x) => (x >= -1 ? -Math.sqrt(x + 1) * 1.4 : Number.NaN), "lab-curve-2");
      if (xProbe > -1) hits = [-Math.sqrt(xProbe + 1) * 1.4, Math.sqrt(xProbe + 1) * 1.4];
      else if (Math.abs(xProbe + 1) < 1e-6) hits = [0];
    }
    out += clipped("vlt-clip", plot.clip("vlt-clip") + curve);
    out += dashedLine(plot.X(xProbe), plot.Y(-4), plot.X(xProbe), plot.Y(4), "lab-asymptote");
    for (const yh of hits) {
      out += circle(plot.X(xProbe), plot.Y(yh), 5, hits.length > 1 ? "lab-point-bad" : "lab-point-ok");
    }
    out += handle("x", plot.X(xProbe), plot.Y(0), "Prüfstelle x");
    const isFunc = mode < 2;
    out += infoBox(505, 86, [
      [`x = ${fmt(xProbe, 1)}`, "lab-text-a"],
      [`Schnittpunkte: ${hits.length}`, hits.length > 1 ? "lab-text-bad" : "lab-text-ok"],
      [isFunc ? "Funktion (eindeutig)" : "Keine Funktion", isFunc ? "lab-text-ok" : "lab-text-bad"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    x: {
      x: "x",
      drag: (p) => {
        const plot = new Plot(-4, 4, -4, 4, { x: 30, y: 42, w: 300, h: 250 });
        return { x: plot.invX(p.x) };
      },
    },
  },
};

const domainRangeMapper: LabView = {
  render(v) {
    const a = v.a;
    const minX = v.minX;
    const maxX = Math.max(minX + 1, v.maxX);
    const yMin = Math.min(a * minX * minX, a * maxX * maxX, minX <= 0 && maxX >= 0 ? 0 : Number.POSITIVE_INFINITY);
    const yMax = Math.max(a * minX * minX, a * maxX * maxX);
    const plot = new Plot(-4, 4, 0, 16, { x: 36, y: 42, w: 280, h: 240 });
    let out = open("Definitionsmenge D und Wertemenge W");
    out += title(`f(x) = ${fmt(a, 1)}·x² auf D = [${fmt(minX, 0)}; ${fmt(maxX, 0)}]`);
    out += plot.grid(1, 2, "x", "y");
    // Highlight D on x-axis and W on y-axis
    out += line(plot.X(minX), plot.Y(0), plot.X(maxX), plot.Y(0), "lab-side-a");
    out += line(plot.X(0), plot.Y(yMin), plot.X(0), plot.Y(yMax), "lab-side-ok");
    out += clipped(
      "drm-clip",
      plot.clip("drm-clip") +
        plot.graph((x) => a * x * x, "lab-ghost") +
        plot.graph((x) => (x >= minX && x <= maxX ? a * x * x : Number.NaN), "lab-curve"),
    );
    out += handle("minX", plot.X(minX), plot.Y(0), "Linke Grenze");
    out += handle("maxX", plot.X(maxX), plot.Y(0), "Rechte Grenze");
    out += infoBox(504, 86, [
      [`D = [${fmt(minX, 0)}; ${fmt(maxX, 0)}]`, "lab-text-a"],
      [`kleinstes y: ${fmt(yMin, 1)}`, "lab-text-ok"],
      [`größtes y: ${fmt(yMax, 1)}`, "lab-text-ok"],
      [`W = [${fmt(yMin, 1)}; ${fmt(yMax, 1)}]`, "lab-text-big"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    minX: {
      x: "minX",
      drag: (p) => {
        const plot = new Plot(-4, 4, 0, 16, { x: 36, y: 42, w: 280, h: 240 });
        return { minX: plot.invX(p.x) };
      },
    },
    maxX: {
      x: "maxX",
      drag: (p) => {
        const plot = new Plot(-4, 4, 0, 16, { x: 36, y: 42, w: 280, h: 240 });
        return { maxX: plot.invX(p.x) };
      },
    },
  },
};

const pointProbeAxes: LabView = {
  render(v) {
    const m = v.m;
    const t = v.t;
    const px = v.px;
    const py = v.py;
    const fx = m * px + t;
    const onGraph = Math.abs(py - fx) < 1e-6;
    const plot = new Plot(-5, 5, -5, 5, { x: 30, y: 42, w: 290, h: 250 });
    let out = open("Punktprobe und Schnittpunkte mit den Achsen");
    out += title(`f(x) = ${fmt(m, 1)}x${t >= 0 ? ` + ${fmt(t, 0)}` : ` ${MINUS} ${fmt(-t, 0)}`}`);
    out += plot.grid(1, 2, "x", "y");
    out += clipped("ppa-clip", plot.clip("ppa-clip") + plot.lineThrough(m, t, "lab-curve"));
    if (plot.contains(0, t)) out += circle(plot.X(0), plot.Y(t), 5, "lab-point-b");
    const x0 = -t / m;
    if (Number.isFinite(x0) && plot.contains(x0, 0)) {
      out += circle(plot.X(x0), plot.Y(0), 5, "lab-point-ok");
    }
    out += handle("p", plot.X(px), plot.Y(py), "Testpunkt P");
    out += infoBox(505, 76, [
      [`P(${fmt(px, 0)} | ${fmt(py, 0)})`, "lab-text-a"],
      [`f(${fmt(px, 0)}) = ${fmt(fx, 1)}`, "lab-text"],
      [onGraph ? "P liegt AUF dem Graphen" : py > fx ? "P liegt ÜBER dem Graphen" : "P liegt UNTER dem Graphen", onGraph ? "lab-text-ok" : "lab-text-bad"],
      [`Sy(0 | ${fmt(t, 0)}), N(${fmt(x0, 2)} | 0)`, "lab-text-small"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    p: coordinateHandle("px", "py", (pt) => {
      const plot = new Plot(-5, 5, -5, 5, { x: 30, y: 42, w: 290, h: 250 });
      return { x: plot.invX(pt.x), y: plot.invY(pt.y) };
    }),
  },
};

const valueChangeExplorer: LabView = {
  render(v) {
    const mode = v.mode;
    const x1 = v.x1;
    const x2 = x1 + v.dx;
    const f = (x: number) => (mode === 0 ? 1.5 * x - 1 : mode === 1 ? -x + 4 : 0.4 * x * x);
    const y1 = f(x1);
    const y2 = f(x2);
    const dy = y2 - y1;
    const plot = new Plot(-3, 5, -4, 8, { x: 30, y: 42, w: 290, h: 245 });
    let out = open("Veränderung des Funktionswerts Δy");
    out += title(mode === 0 ? "f(x) = 1,5x − 1" : mode === 1 ? "f(x) = −x + 4" : "f(x) = 0,4x²");
    out += plot.grid(1, 2, "x", "y");
    out += clipped("vce-clip", plot.clip("vce-clip") + plot.graph(f, "lab-curve"));
    out += line(plot.X(x1), plot.Y(y1), plot.X(x2), plot.Y(y1), "lab-side-a");
    out += line(plot.X(x2), plot.Y(y1), plot.X(x2), plot.Y(y2), dy >= 0 ? "lab-side-ok" : "lab-side-b");
    out += circle(plot.X(x1), plot.Y(y1), 4.5, "lab-point-a");
    out += circle(plot.X(x2), plot.Y(y2), 4.5, "lab-point-b");
    out += handle("x1", plot.X(x1), plot.Y(y1), "Startpunkt x₁");
    out += infoBox(505, 86, [
      [`x₁ = ${fmt(x1, 0)} → x₂ = ${fmt(x2, 0)}`, "lab-text-a"],
      [`f(x₁) = ${fmt(y1, 1)}`, "lab-text"],
      [`f(x₂) = ${fmt(y2, 1)}`, "lab-text"],
      [`Δy = ${fmt(dy, 1)}`, dy >= 0 ? "lab-text-ok" : "lab-text-bad"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    x1: {
      x: "x1",
      drag: (p) => {
        const plot = new Plot(-3, 5, -4, 8, { x: 30, y: 42, w: 290, h: 245 });
        return { x1: plot.invX(p.x) };
      },
    },
  },
};

export const VIEWS_FUNKTIONEN: Record<string, LabView> = {
  "func-representations": funcRepresentations,
  "vertical-line-test": verticalLineTest,
  "domain-range-mapper": domainRangeMapper,
  "point-probe-axes": pointProbeAxes,
  "value-change-explorer": valueChangeExplorer,
};
