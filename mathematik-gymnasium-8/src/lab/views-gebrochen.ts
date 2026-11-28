import { fmt, MINUS } from "../exercises/format";
import {
  hyperbolaDomainGap,
  hyperbolaEval,
  hyperbolaYIntercept,
  hyperbolaZero,
} from "../curriculum/math";
import {
  circle,
  clipped,
  dashedLine,
  handle,
  infoBox,
  open,
  Plot,
  rect,
  text,
  type LabView,
} from "./svg";
import { coordinateHandle, title } from "./view-helpers";

/** Lab views for Stage 3: Elementare gebrochen-rationale Funktionen. */

function hyperbolaFormula(a: number, b: number, c: number): string {
  const denom =
    b === 0 ? "x" : b > 0 ? `(x + ${fmt(b, 0)})` : `(x ${MINUS} ${fmt(-b, 0)})`;
  const shift =
    c === 0 ? "" : c > 0 ? ` + ${fmt(c, 0)}` : ` ${MINUS} ${fmt(-c, 0)}`;
  return `f(x) = ${fmt(a, 0)}/${denom}${shift}`;
}

const hyperbolaDomain: LabView = {
  render(v) {
    const a = v.a;
    const b = v.b;
    const xProbe = v.x;
    const gap = hyperbolaDomainGap(b);
    const yProbe = hyperbolaEval(xProbe, a, b, 0);
    const plot = new Plot(-6, 6, -6, 6, { x: 26, y: 42, w: 292, h: 250 });
    let out = open("Definitionsmenge und Polstelle einer Hyperbel");
    out += title(hyperbolaFormula(a, b, 0));
    out += plot.grid(1, 2, "x", "y");
    out += dashedLine(plot.X(gap), plot.Y(-6), plot.X(gap), plot.Y(6), "lab-asymptote");
    out += clipped(
      "hd-clip",
      plot.clip("hd-clip") + plot.graph((x) => hyperbolaEval(x, a, b, 0), "lab-curve", 320),
    );
    if (Number.isFinite(yProbe) && plot.contains(xProbe, yProbe)) {
      out += circle(plot.X(xProbe), plot.Y(yProbe), 4.5, "lab-point-a");
    }
    out += handle("x", plot.X(xProbe), plot.Y(0), "Stelle x");
    out += infoBox(505, 86, [
      [`Definitionslücke: x = ${fmt(gap, 0)}`, "lab-text-bad"],
      [`D = ℚ \\ {${fmt(gap, 0)}}`, "lab-text-a"],
      [Number.isFinite(yProbe) ? `f(${fmt(xProbe, 0)}) = ${fmt(yProbe, 2)}` : `f(${fmt(xProbe, 0)}) nicht def.!`, Number.isFinite(yProbe) ? "lab-text-ok" : "lab-text-bad"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    x: {
      x: "x",
      drag: (p) => {
        const plot = new Plot(-6, 6, -6, 6, { x: 26, y: 42, w: 292, h: 250 });
        return { x: plot.invX(p.x) };
      },
    },
  },
};

const hyperbolaShift: LabView = {
  render(v) {
    const a = v.a;
    const b = v.b;
    const c = v.c;
    const gap = hyperbolaDomainGap(b);
    const plot = new Plot(-6, 6, -6, 6, { x: 26, y: 42, w: 292, h: 250 });
    let out = open("Asymptoten und Verschiebung der Hyperbel");
    out += title(hyperbolaFormula(a, b, c));
    out += plot.grid(1, 2, "x", "y");
    out += dashedLine(plot.X(gap), plot.Y(-6), plot.X(gap), plot.Y(6), "lab-asymptote");
    out += dashedLine(plot.X(-6), plot.Y(c), plot.X(6), plot.Y(c), "lab-asymptote");
    out += clipped(
      "hs-clip",
      plot.clip("hs-clip") +
        plot.graph((x) => hyperbolaEval(x, a, 0, 0), "lab-ghost", 240) +
        plot.graph((x) => hyperbolaEval(x, a, b, c), "lab-curve-c", 320),
    );
    out += handle("shift", plot.X(gap), plot.Y(c), "Asymptotenkreuz (−b | c)");
    out += infoBox(505, 84, [
      [`senkr. Asymptote: x = ${fmt(gap, 0)}`, "lab-text-bad"],
      [`waagr. Asymptote: y = ${fmt(c, 0)}`, "lab-text-c"],
      [`Kreuz: (${fmt(gap, 0)} | ${fmt(c, 0)})`, "lab-text-ok"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    shift: coordinateHandle("b", "c", (p) => {
      const plot = new Plot(-6, 6, -6, 6, { x: 26, y: 42, w: 292, h: 250 });
      return { x: -plot.invX(p.x), y: plot.invY(p.y) };
    }),
  },
};

const hyperbolaAxes: LabView = {
  render(v) {
    const a = v.a;
    const b = v.b;
    const c = v.c;
    const sy = hyperbolaYIntercept(a, b, c);
    const x0 = hyperbolaZero(a, b, c);
    const gap = hyperbolaDomainGap(b);
    const plot = new Plot(-6, 6, -6, 6, { x: 26, y: 42, w: 292, h: 250 });
    let out = open("Achsenschnittpunkte einer Hyperbel");
    out += title(hyperbolaFormula(a, b, c));
    out += plot.grid(1, 2, "x", "y");
    out += dashedLine(plot.X(gap), plot.Y(-6), plot.X(gap), plot.Y(6), "lab-asymptote");
    out += dashedLine(plot.X(-6), plot.Y(c), plot.X(6), plot.Y(c), "lab-asymptote");
    out += clipped(
      "ha-clip",
      plot.clip("ha-clip") + plot.graph((x) => hyperbolaEval(x, a, b, c), "lab-curve", 320),
    );
    if (sy !== null && plot.contains(0, sy)) out += circle(plot.X(0), plot.Y(sy), 5, "lab-point-b");
    if (x0 !== null && plot.contains(x0, 0)) out += circle(plot.X(x0), plot.Y(0), 5, "lab-point-ok");
    out += handle("c", plot.X(0), plot.Y(c), "Verschiebung c");
    out += infoBox(505, 86, [
      [sy !== null ? `Sy(0 | ${fmt(sy, 2)})` : "kein Sy (x=0 ist Lücke)", sy !== null ? "lab-text-b" : "lab-text-bad"],
      [x0 !== null ? `N(${fmt(x0, 2)} | 0)` : "keine Nullstelle (c=0)", x0 !== null ? "lab-text-ok" : "lab-text-bad"],
      [`D = ℚ \\ {${fmt(gap, 0)}}`, "lab-text-small"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    c: {
      y: "c",
      drag: (p) => {
        const plot = new Plot(-6, 6, -6, 6, { x: 26, y: 42, w: 292, h: 250 });
        return { c: plot.invY(p.y) };
      },
    },
  },
};

const hyperbolaFit: LabView = {
  render(v) {
    const a = v.a;
    const b = v.b;
    const c = v.c;
    const gap = hyperbolaDomainGap(b);
    const targetA = 4;
    const targetB = -2;
    const targetC = 1;
    const match = a === targetA && b === targetB && c === targetC;
    const plot = new Plot(-5, 7, -5, 7, { x: 26, y: 42, w: 292, h: 250 });
    let out = open("Parameter aus dem Graphen ablesen");
    out += title(hyperbolaFormula(a, b, c));
    out += plot.grid(1, 2, "x", "y");
    out += dashedLine(plot.X(2), plot.Y(-5), plot.X(2), plot.Y(7), "lab-ghost");
    out += dashedLine(plot.X(-5), plot.Y(1), plot.X(7), plot.Y(1), "lab-ghost");
    out += clipped(
      "hf-clip",
      plot.clip("hf-clip") +
        plot.graph((x) => hyperbolaEval(x, targetA, targetB, targetC), "lab-curve-dashed", 280) +
        plot.graph((x) => hyperbolaEval(x, a, b, c), match ? "lab-curve-ok" : "lab-curve", 320),
    );
    out += circle(plot.X(4), plot.Y(3), 4.5, "lab-point-ok");
    out += text(plot.X(4) + 7, plot.Y(3) - 6, "P(4|3)", "lab-text-ok");
    out += handle("shift", plot.X(gap), plot.Y(c), "Asymptotenkreuz");
    out += infoBox(505, 82, [
      [`Ziel: gestrichelte Kurve`, "lab-text-b"],
      [`dein a = ${fmt(a, 0)}`, "lab-text-a"],
      [`b = ${fmt(b, 0)}, c = ${fmt(c, 0)}`, "lab-text-small"],
      [match ? "Exakte Deckung ✓" : "Noch anpassen", match ? "lab-text-ok" : "lab-text-bad"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    shift: coordinateHandle("b", "c", (p) => {
      const plot = new Plot(-5, 7, -5, 7, { x: 26, y: 42, w: 292, h: 250 });
      return { x: -plot.invX(p.x), y: plot.invY(p.y) };
    }),
  },
};

const inverseProportion: LabView = {
  render(v) {
    const k = v.k;
    const x = v.x;
    const y = k / x;
    const plot = new Plot(0, 10, 0, 14, { x: 30, y: 42, w: 288, h: 250 });
    let out = open("Indirekte Proportionalität y = a/x");
    out += title(`y = ${fmt(k, 0)} / x   ⇒   x · y = ${fmt(x * y, 0)}`);
    out += plot.grid(1, 2, "x", "y");
    out += rect(
      plot.X(0),
      plot.Y(Math.min(14, y)),
      plot.X(x) - plot.X(0),
      plot.Y(0) - plot.Y(Math.min(14, y)),
      "lab-fill-a",
    );
    out += clipped(
      "ip-clip",
      plot.clip("ip-clip") + plot.graph((xv) => (xv > 0.1 ? k / xv : Number.NaN), "lab-curve", 260),
    );
    if (plot.contains(x, y)) {
      out += handle("x", plot.X(x), plot.Y(y), "Kurvenpunkt x");
    } else {
      out += handle("x", plot.X(x), plot.Y(14), "Kurvenpunkt x");
    }
    out += infoBox(505, 86, [
      [`Größe x = ${fmt(x, 1)}`, "lab-text-a"],
      [`Größe y = ${fmt(y, 2)}`, "lab-text-b"],
      [`Produkt x · y = ${fmt(k, 0)}`, "lab-text-ok"],
      ["Je größer x, desto kleiner y", "lab-text-small"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    x: {
      x: "x",
      drag: (p) => {
        const plot = new Plot(0, 10, 0, 14, { x: 30, y: 42, w: 288, h: 250 });
        return { x: plot.invX(p.x) };
      },
    },
  },
};

export const VIEWS_GEBROCHEN: Record<string, LabView> = {
  "hyperbola-domain": hyperbolaDomain,
  "hyperbola-shift": hyperbolaShift,
  "hyperbola-axes": hyperbolaAxes,
  "hyperbola-fit": hyperbolaFit,
  "inverse-proportion": inverseProportion,
};
