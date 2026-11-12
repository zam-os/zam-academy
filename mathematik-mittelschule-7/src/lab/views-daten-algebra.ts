import { fmt } from "../exercises/format";
import {
  open,
  text,
  line,
  rect,
  circle,
  infoBox,
  handle,
  Plot,
  clipped,
  clamp,
  type LabView,
} from "./svg";
import { title } from "./view-helpers";

export const DATEN_ALGEBRA_VIEWS: Record<string, LabView> = {
  "chart-critique": {
    render(v) {
      const v1 = v.v1 ?? 60;
      const v2 = v.v2 ?? 75;
      const y0 = clamp(v.y0 ?? 0, 0, Math.min(v1, v2) - 5);
      const wide = v.wide ?? 1;
      const baseY = 264;
      const hPlot = 180;
      const yMax = 100;

      const h1 = ((v1 - y0) / (yMax - y0)) * hPlot;
      const h2 = ((v2 - y0) / (yMax - y0)) * hPlot;
      const ratioVisual = h2 / Math.max(1, h1);
      const ratioTrue = v2 / Math.max(1, v1);

      let out = open("Diagramme und manipulative Skalierung");
      out += title(
        y0 > 0
          ? `Achse startet bei ${fmt(y0)} → optisch ${fmt(ratioVisual, 1)}-fach!`
          : `Ehrliche y-Achse (Start bei 0): ${fmt(v2)} : ${fmt(v1)} = ${fmt(ratioTrue, 2)}`,
      );

      out += line(65, baseY, 265, baseY, "lab-axis");
      out += line(65, baseY - hPlot, 65, baseY, "lab-axis");
      out += text(58, baseY + 4, fmt(y0), y0 > 0 ? "lab-text-bad" : "lab-text-tick", "end");
      out += text(58, baseY - hPlot + 4, fmt(yMax), "lab-text-tick", "end");

      const w1 = 42;
      const w2 = 42 * (wide > 1 ? 1.8 : 1);
      out += rect(92, baseY - h1, w1, h1, "lab-fill-a", 'style="stroke:var(--lab-a);stroke-width:2"');
      out += rect(170, baseY - h2, w2, h2, "lab-fill-b", 'style="stroke:var(--lab-b);stroke-width:2"');
      out += text(113, baseY - h1 - 8, fmt(v1), "lab-text-a", "middle");
      out += text(170 + w2 / 2, baseY - h2 - 8, fmt(v2), "lab-text-b", "middle");

      out += handle("axis", 65, baseY - (y0 / 50) * 60, "y-Achsen-Start");

      out += infoBox(285, 86, [
        [`Echtes Verhältnis: ${fmt(ratioTrue, 2)} : 1`, "lab-text"],
        [`Optisches Höhenverhältnis: ${fmt(ratioVisual, 2)} : 1`, y0 > 0 ? "lab-text-bad" : "lab-text-ok"],
        [wide > 1 ? "Warnung: Unterschiedliche Balkenbreite!" : "Balkenbreiten gleich (korrekt)", wide > 1 ? "lab-text-bad" : "lab-text-small"],
      ]);
      out += "</svg>";
      return out;
    },
    handles: {
      axis: {
        y: "y0",
        drag: (p) => ({ y0: clamp(Math.round(((264 - p.y) / 60) * 50 / 10) * 10, 0, 50) }),
      },
    },
  },

  "stats-measures": {
    render(v) {
      const vals = [v.a ?? 2, v.b ?? 3, v.c ?? 3, v.d ?? 4, v.e ?? 12];
      const sorted = [...vals].sort((x, y) => x - y);
      const mean = vals.reduce((s, x) => s + x, 0) / vals.length;
      const median = sorted[2];
      const span = sorted[4] - sorted[0];

      const x0 = 55;
      const xW = 410;
      const toX = (n: number) => x0 + ((n - 1) / 14) * xW;
      const lineY = 178;

      let out = open("Arithmetisches Mittel, Zentralwert und Spannweite");
      out += title(`Mittelwert ${fmt(mean, 2)}  ·  Zentralwert ${fmt(median)}  ·  Spannweite ${fmt(span)}`);

      out += line(x0, lineY, x0 + xW, lineY, "lab-axis");
      for (let i = 1; i <= 15; i++) {
        const tx = toX(i);
        out += line(tx, lineY - 4, tx, lineY + 4, "lab-axis");
        out += text(tx, lineY + 20, String(i), "lab-text-tick", "middle");
      }

      // Vertical markers for mean & median
      out += line(toX(mean), 86, toX(mean), lineY, "lab-curve-2");
      out += text(toX(mean), 78, `Mittel ${fmt(mean, 1)}`, "lab-text-b", "middle");

      out += line(toX(median), 108, toX(median), lineY, "lab-curve");
      out += text(toX(median), 100, `Zentralwert ${fmt(median)}`, "lab-text-a", "middle");

      sorted.forEach((x, idx) => {
        out += circle(toX(x), lineY - 12 - (idx % 2) * 10, 5.5, "lab-dot");
      });

      out += handle("outlier", toX(v.e ?? 12), lineY - 14, "Ausreißerwert e");
      out += infoBox(55, 224, [
        [`Sortierte Reihe: ${sorted.join("  ;  ")}`, "lab-text"],
        [`Spannweite = Max − Min = ${sorted[4]} − ${sorted[0]} = ${span}`, "lab-text-small"],
        [`Der Ausreißer zieht das Mittel nach oben, der Zentralwert bleibt stabil!`, "lab-text-small"],
      ]);
      out += "</svg>";
      return out;
    },
    handles: {
      outlier: {
        x: "e",
        drag: (p) => ({ e: clamp(Math.round(1 + ((p.x - 55) / 410) * 14), 1, 15) }),
      },
    },
  },

  "term-eval": {
    render(v) {
      const a = v.a ?? 3;
      const b = v.b ?? -4;
      const x = v.x ?? 2;
      const val = a * x + b;

      let out = open("Termmaschine und Einsetzen");
      const bStr = b < 0 ? `− ${Math.abs(b)}` : `+ ${b}`;
      out += title(`T(x) = ${fmt(a)} · x ${bStr}   |   T(${fmt(x)}) = ${fmt(val)}`);

      // Visual blocks: Input -> Factor · a -> + b -> Output
      out += rect(45, 95, 95, 76, "lab-fill-a", 'rx="10" style="stroke:var(--lab-a);stroke-width:2"');
      out += text(92, 126, "Eingabe x", "lab-text-small", "middle");
      out += text(92, 152, fmt(x), "lab-text-big", "middle");

      out += rect(185, 95, 145, 76, "lab-shape", 'rx="10" style="stroke:var(--lab-ink);stroke-width:1.8"');
      out += text(257, 124, `· (${fmt(a)})  ${bStr}`, "lab-text", "middle");
      out += text(257, 152, `${fmt(a * x)} ${bStr}`, "lab-text-small", "middle");

      out += rect(375, 95, 100, 76, "lab-fill-b", 'rx="10" style="stroke:var(--lab-b);stroke-width:2"');
      out += text(425, 126, "Termwert", "lab-text-small", "middle");
      out += text(425, 152, fmt(val), "lab-text-big", "middle");

      out += handle("xval", 45 + ((x + 4) / 9) * 430, 290, "Variable x");
      out += line(45, 290, 475, 290, "lab-axis");

      out += infoBox(45, 206, [
        [`Veränderung um Δx = +1 verändert T(x) um ${fmt(a)}`, "lab-text"],
        [`Klammer-/Distributivprobe: ${fmt(a)} · (${fmt(x)} + 1) ${bStr} = ${fmt(a * (x + 1) + b)}`, "lab-text-small"],
      ]);
      out += "</svg>";
      return out;
    },
    handles: {
      xval: {
        x: "x",
        drag: (p) => ({ x: clamp(Math.round(-4 + ((p.x - 45) / 430) * 9), -4, 5) }),
      },
    },
  },

  "balance-scale": {
    render(v) {
      const a = v.a ?? 2;
      const b = v.b ?? 3;
      const xTrue = v.xTrue ?? 4;
      const c = a * xTrue + b;
      const guessX = v.guessX ?? 1;
      const lhs = a * guessX + b;
      const diff = lhs - c;
      const balanced = diff === 0;

      const tilt = clamp(diff * 2.5, -18, 18);
      const cx = 260;
      const cy = 148;
      const arm = 135;
      const lx = cx - arm;
      const rx = cx + arm;
      const ly = cy + tilt;
      const ry = cy - tilt;

      let out = open("Balkenwaage für Gleichungen");
      out += title(`${fmt(a)}x + ${fmt(b)} = ${fmt(c)}  (dein x = ${fmt(guessX)} → links ${fmt(lhs)})`);

      // Fulcrum & beam
      out += line(cx, cy, cx - 22, 225, "lab-axis");
      out += line(cx, cy, cx + 22, 225, "lab-axis");
      out += line(lx, ly, rx, ry, balanced ? "lab-ok" : "lab-ink");
      out += circle(cx, cy, 5, "lab-dot");

      // Left & right pans
      out += rect(lx - 58, ly + 18, 116, 44, balanced ? "lab-fill-ok" : "lab-fill-a", 'rx="8" style="stroke:var(--lab-a);stroke-width:2"');
      out += text(lx, ly + 45, `${fmt(a)}·(${fmt(guessX)})+${fmt(b)} = ${fmt(lhs)}`, "lab-text-small", "middle");

      out += rect(rx - 52, ry + 18, 104, 44, balanced ? "lab-fill-ok" : "lab-fill-b", 'rx="8" style="stroke:var(--lab-b);stroke-width:2"');
      out += text(rx, ry + 45, `rechts = ${fmt(c)}`, "lab-text-small", "middle");

      out += handle("guess", 55 + ((guessX + 4) / 10) * 410, 296, "Probe x");
      out += line(55, 296, 465, 296, "lab-axis");

      out += infoBox(115, 232, [
        [balanced ? `Waage im Gleichgewicht! Lösung x = ${fmt(guessX)}` : diff < 0 ? "Links zu leicht → vergrößere x!" : "Links zu schwer → verkleinere x!", balanced ? "lab-text-ok" : "lab-text-b"],
      ]);
      out += "</svg>";
      return out;
    },
    handles: {
      guess: {
        x: "guessX",
        drag: (p) => ({ guessX: clamp(Math.round(-4 + ((p.x - 55) / 410) * 10), -4, 6) }),
      },
    },
  },

  "linear-vs-nonlinear": {
    render(v) {
      const plot = new Plot(0, 6, 0, 18, { x: 34, y: 34, w: 452, h: 282 });
      const kind = v.kind ?? 0; // 0: proportional y = m*x, 1: linear y = m*x + t, 2: nicht linear y = x^2
      const m = v.m ?? 2;
      const t = v.t ?? 3;
      const fn = (x: number) =>
        kind === 0 ? m * x : kind === 1 ? m * x + t : 0.5 * x * x;

      let out = open("Proportionale, lineare und nicht lineare Zuordnungen");
      const label =
        kind === 0
          ? `Proportional: Ursprungsgerade y = ${fmt(m, 1)} · x`
          : kind === 1
            ? `Linear (nicht proportional): y = ${fmt(m, 1)} · x + ${fmt(t)}`
            : "Nicht linear: gekrümmte Kurve (z. B. Quadratfläche)";
      out += title(label);
      out += plot.grid(1, 2);
      out += plot.clip("clip-lvnl");
      out += clipped("clip-lvnl", plot.graph(fn, "lab-curve"));

      for (const x of [1, 2, 3, 4, 5]) {
        const pt = plot.P(x, fn(x));
        if (fn(x) <= 18) out += circle(pt.x, pt.y, 4, "lab-dot");
      }

      out += infoBox(46, 62, [
        [kind === 0 ? "Quotientengleich: y : x bleibt immer gleich!" : kind === 1 ? "Gerade, geht aber nicht durch (0|0)!" : "Keine Gerade → doppeltes x gibt NICHT doppeltes y", kind === 0 ? "lab-text-ok" : "lab-text"],
      ]);
      out += "</svg>";
      return out;
    },
  },

  "proportion-dreisatz": {
    render(v) {
      const plot = new Plot(0, 8, 0, 32, { x: 34, y: 34, w: 452, h: 282 });
      const unitPrice = v.unitPrice ?? 2.5;
      const qty = v.qty ?? 4;
      const cost = unitPrice * qty;
      const pt = plot.P(qty, cost);

      let out = open("Proportionale Zuordnung und Dreisatz");
      out += title(`${fmt(qty)} Stück → ${fmt(cost, 2)} €  (Faktor ${fmt(unitPrice, 2)} €/Stück)`);
      out += plot.grid(1, 2);
      out += plot.clip("clip-prop");
      out += clipped("clip-prop", plot.graph((x) => unitPrice * x, "lab-curve"));

      out += line(pt.x, plot.Y(0), pt.x, pt.y, "lab-curve-2");
      out += line(plot.X(0), pt.y, pt.x, pt.y, "lab-curve-2");
      out += handle("P", pt.x, pt.y, "Menge wählen");

      out += infoBox(48, 62, [
        [`1 Stück → ${fmt(unitPrice, 2)} €`, "lab-text"],
        [`${fmt(qty)} Stück → ${fmt(cost, 2)} €`, "lab-text-a"],
        [`Quotient y : x = ${fmt(cost / qty, 2)} (konstant)`, "lab-text-ok"],
      ]);
      out += "</svg>";
      return out;
    },
    handles: {
      P: {
        x: "qty",
        drag: (p) => {
          const plot = new Plot(0, 8, 0, 32, { x: 34, y: 34, w: 452, h: 282 });
          return { qty: clamp(Math.round(plot.invX(p.x)), 1, 8) };
        },
      },
    },
  },
};
