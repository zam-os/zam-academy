import { fmt, MINUS } from "../exercises/format";
import { intersectLines, solve2x2 } from "../curriculum/math";
import {
  circle,
  clipped,
  handle,
  infoBox,
  open,
  Plot,
  rect,
  text,
  type LabView,
} from "./svg";
import { rail, railHandle, title } from "./view-helpers";

/** Lab views for Stage 6: Lineare Gleichungssysteme. */

const lgsModeling: LabView = {
  render(v) {
    const x = v.x;
    const y = v.y;
    const sum1 = 2 * x + 3 * y;
    const sum2 = x + 2 * y;
    let out = open("Sachzusammenhang als 2×2-Gleichungssystem");
    out += title(`Preise testen: x = ${fmt(x, 0)} €, y = ${fmt(y, 0)} €`);

    out += rect(28, 50, 214, 96, "lab-fill-a lab-cell", 'rx="10"');
    out += text(135, 78, "Bedingung I: 2x + 3y", "lab-text-a", "middle");
    out += text(135, 114, `2·${fmt(x, 0)} + 3·${fmt(y, 0)} = ${fmt(sum1, 0)} €`, "lab-text-big", "middle");

    out += rect(278, 50, 214, 96, "lab-fill-b lab-cell", 'rx="10"');
    out += text(385, 78, "Bedingung II: x + 2y", "lab-text-b", "middle");
    out += text(385, 114, `${fmt(x, 0)} + 2·${fmt(y, 0)} = ${fmt(sum2, 0)} €`, "lab-text-big", "middle");

    out += rect(28, 166, 464, 60, "lab-panel", 'rx="8"');
    out += text(260, 192, `Differenz I − 2·II eliminiert y nicht, aber 2·II − I = ${fmt(2 * sum2 - sum1, 0)} (= y)!`, "lab-text-small", "middle");
    out += text(260, 214, `Zielbeispiele: (I = 29, II = 17) oder Summe/Differenz prüfen.`, "lab-text", "middle");

    out += rail("x", "Erwachsenenpreis x", x, 2, 9, 294);
    return out + "</svg>";
  },
  handles: { x: railHandle("x", 2, 9) },
};

const lgsGraphical: LabView = {
  render(v) {
    const m1 = v.m1;
    const t1 = v.t1;
    const m2 = v.m2;
    const t2 = v.t2;
    const res = intersectLines(m1, t1, m2, t2);
    const plot = new Plot(-4, 5, -4, 5, { x: 26, y: 42, w: 292, h: 250 });
    let out = open("Graphisches Lösen eines LGS");
    out += title(res.kind === "one" ? `Schnittpunkt S(${fmt(res.point.x, 2)} | ${fmt(res.point.y, 2)})` : res.kind === "parallel" ? "Parallel → keine Lösung" : "Identisch → ∞ viele");
    out += plot.grid(1, 2, "x", "y");
    out += clipped(
      "lgsg-clip",
      plot.clip("lgsg-clip") +
        plot.lineThrough(m1, t1, "lab-curve") +
        plot.lineThrough(m2, t2, "lab-curve-2"),
    );
    if (res.kind === "one" && plot.contains(res.point.x, res.point.y)) {
      out += circle(plot.X(res.point.x), plot.Y(res.point.y), 5.5, "lab-point-ok");
    }
    out += handle("t1", plot.X(0), plot.Y(t1), "Gerade I: t₁");
    out += handle("t2", plot.X(0), plot.Y(t2), "Gerade II: t₂");
    out += infoBox(505, 86, [
      [`I: y = ${fmt(m1, 0)}x${t1 >= 0 ? `+${fmt(t1, 0)}` : `${MINUS}${fmt(-t1, 0)}`}`, "lab-text-a"],
      [`II: y = ${fmt(m2, 0)}x${t2 >= 0 ? `+${fmt(t2, 0)}` : `${MINUS}${fmt(-t2, 0)}`}`, "lab-text-b"],
      [res.kind === "one" ? `L = {(${fmt(res.point.x, 2)} | ${fmt(res.point.y, 2)})}` : res.kind === "parallel" ? "L = ∅" : "L = Gerade", "lab-text-ok"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    t1: {
      y: "t1",
      drag: (p) => {
        const plot = new Plot(-4, 5, -4, 5, { x: 26, y: 42, w: 292, h: 250 });
        return { t1: plot.invY(p.y) };
      },
    },
    t2: {
      y: "t2",
      drag: (p) => {
        const plot = new Plot(-4, 5, -4, 5, { x: 26, y: 42, w: 292, h: 250 });
        return { t2: plot.invY(p.y) };
      },
    },
  },
};

const lgsSubstitution: LabView = {
  render(v) {
    const c1 = v.c1;
    const a2 = v.a2;
    const c2 = v.c2;
    const x = (c1 + c2) / (a2 + 1);
    const y = c1 - x;
    let out = open("Einsetzungsverfahren Schritt für Schritt");
    out += title(`I: x + y = ${fmt(c1, 0)}   und   II: ${fmt(a2, 0)}x − y = ${fmt(c2, 0)}`);

    out += rect(24, 48, 472, 46, "lab-fill-a lab-cell", 'rx="8"');
    out += text(260, 76, `1. I nach x umstellen:  x = ${fmt(c1, 0)} − y`, "lab-text-a", "middle");

    out += rect(24, 108, 472, 46, "lab-cell", 'rx="8"');
    out += text(260, 136, `2. In II einsetzen:  ${fmt(a2, 0)}·(${fmt(c1, 0)} − y) − y = ${fmt(c2, 0)}  ⇒  ${fmt(a2 + 1, 0)}y = ${fmt(a2 * c1 - c2, 0)}`, "lab-text", "middle");

    out += rect(24, 168, 472, 56, "lab-fill-ok lab-cell", 'rx="8"');
    out += text(260, 202, `3. Lösung:  y = ${fmt(y, 2)}   ⇒   x = ${fmt(x, 2)}   ⇒   L = {(${fmt(x, 2)} | ${fmt(y, 2)})}`, "lab-text-ok", "middle");

    out += rail("c1", "Summe c₁", c1, 3, 9, 294);
    return out + "</svg>";
  },
  handles: { c1: railHandle("c1", 3, 9) },
};

const lgsElimination: LabView = {
  render(v) {
    const m = v.m;
    const c1 = v.c1;
    const c2 = v.c2;
    const x = (c1 + m * c2) / (2 + m);
    const y = x - c2;
    let out = open("Additionsverfahren im Vergleich");
    out += title(`I: 2x + ${fmt(m, 0)}y = ${fmt(c1, 0)}   ·   II: x − y = ${fmt(c2, 0)}`);

    out += rect(24, 48, 224, 92, "lab-cell", 'rx="8"');
    out += text(136, 80, `II · ${fmt(m, 0)}:`, "lab-text-small", "middle");
    out += text(136, 110, `${fmt(m, 0)}x − ${fmt(m, 0)}y = ${fmt(m * c2, 0)}`, "lab-text-b", "middle");

    out += text(260, 98, "+", "lab-text-big", "middle");

    out += rect(274, 48, 224, 92, "lab-fill-a lab-cell", 'rx="8"');
    out += text(386, 80, "I + m·II (y fällt weg!):", "lab-text-small", "middle");
    out += text(386, 110, `${fmt(2 + m, 0)}x = ${fmt(c1 + m * c2, 0)}`, "lab-text-a", "middle");

    out += rect(24, 162, 474, 62, "lab-fill-ok lab-cell", 'rx="8"');
    out += text(261, 199, `x = ${fmt(x, 2)}   und   y = ${fmt(y, 2)}   ⇒   L = {(${fmt(x, 2)} | ${fmt(y, 2)})}`, "lab-text-ok", "middle");

    out += rail("c1", "Rechte Seite c₁", c1, 4, 12, 294);
    return out + "</svg>";
  },
  handles: { c1: railHandle("c1", 4, 12) },
};

const lgsCases: LabView = {
  render(v) {
    const a2 = v.a2;
    const b2 = v.b2;
    const c2 = v.c2;
    const sol = solve2x2(2, -1, 4, a2, b2, c2);
    const plot = new Plot(-4, 5, -4, 5, { x: 26, y: 42, w: 292, h: 250 });
    let out = open("Lösbarkeit und Lösungsvielfalt eines 2×2-LGS");
    out += title(`I: 2x − y = 4   ·   II: ${fmt(a2, 0)}x ${b2 >= 0 ? `+ ${fmt(b2, 0)}` : `− ${fmt(-b2, 0)}`}y = ${fmt(c2, 0)}`);
    out += plot.grid(1, 2, "x", "y");
    const m2 = -a2 / b2;
    const t2 = c2 / b2;
    out += clipped(
      "lgsc-clip",
      plot.clip("lgsc-clip") +
        plot.lineThrough(2, -4, "lab-curve") +
        plot.lineThrough(m2, t2, sol.kind === "infinite" ? "lab-curve-dashed" : "lab-curve-2"),
    );
    if (sol.kind === "unique" && plot.contains(sol.x, sol.y)) {
      out += circle(plot.X(sol.x), plot.Y(sol.y), 5.5, "lab-point-ok");
    }
    out += handle("c2", plot.X(0), plot.Y(t2), "Gleichung II verschieben");
    out += infoBox(505, 86, [
      [sol.kind === "unique" ? "1 eindeutige Lösung" : sol.kind === "none" ? "0 Lösungen (parallel)" : "∞ viele (identisch)", sol.kind === "unique" ? "lab-text-ok" : sol.kind === "none" ? "lab-text-bad" : "lab-text-a"],
      [sol.kind === "unique" ? `S(${fmt(sol.x, 2)} | ${fmt(sol.y, 2)})` : sol.kind === "none" ? "L = ∅" : "identische Geraden", "lab-text-small"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    c2: {
      y: "c2",
      drag: (p, v) => {
        const plot = new Plot(-4, 5, -4, 5, { x: 26, y: 42, w: 292, h: 250 });
        return { c2: plot.invY(p.y) * v.b2 };
      },
    },
  },
};

export const VIEWS_LGS: Record<string, LabView> = {
  "lgs-modeling": lgsModeling,
  "lgs-graphical": lgsGraphical,
  "lgs-substitution": lgsSubstitution,
  "lgs-elimination": lgsElimination,
  "lgs-cases": lgsCases,
};
