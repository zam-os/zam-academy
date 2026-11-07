import { fmt } from "../exercises/format";
import { Plot, clipped, handle, line, open, polygon, rect, text, type LabView } from "./svg";
import { rail, railHandle, title } from "./view-helpers";

/** Height (0 to 10) of the water after time t (0 to 10) in the three vessels at constant inflow. */
export function fillHeight(vessel: number, t: number): number {
  if (vessel === 0) return t;
  if (vessel === 1) return t <= 7.5 ? (5 * t) / 7.5 : 5 + (5 * (t - 7.5)) / 2.5;
  return t <= 2.5 ? (5 * t) / 2.5 : 5 + (5 * (t - 2.5)) / 7.5;
}

const fillPlot = new Plot(0, 10.5, 0, 10.5, { x: 225, y: 30, w: 275, h: 270 });
const fillGraph: LabView = {
  render(v, r) {
    const p = fillPlot;
    const widths = [
      [60, 60],
      [100, 34],
      [34, 100],
    ][v.vessel];
    const cx = 110;
    const bottom = 280;
    const H = 110;
    const h = fillHeight(v.vessel, v.t);
    const y = (level: number) => bottom - (level / 5) * H;
    let out = open("Gefäß mit Wasserstand und zugehöriger Füllgraph");
    const shape = (w: number, from: number, to: number, cls: string) =>
      to > from ? rect(cx - w / 2, y(to), w, y(from) - y(to), cls) : "";
    out +=
      shape(widths[0], 0, 5, "lab-cell") +
      shape(widths[1], 5, 10, "lab-cell") +
      shape(widths[0], 0, Math.min(h, 5), "lab-fill-a") +
      shape(widths[1], 5, Math.max(5, h), "lab-fill-a") +
      text(cx, 306, String(r.vesselName), "lab-text-small", "middle") +
      p.grid(1, 5, "Zeit", "Höhe");
    let d = "";
    for (let i = 0; i <= 40; i++) {
      const t = i / 4;
      d += `${i === 0 ? "M" : "L"}${p.X(t).toFixed(1)} ${p.Y(fillHeight(v.vessel, t)).toFixed(1)} `;
    }
    out += `<defs>${p.clip("fill")}</defs>` + clipped("fill", `<path d="${d.trim()}" class="lab-curve" />`);
    return out + handle("t", p.X(v.t), p.Y(h), "Zeitpunkt auf dem Füllgraphen") + "</svg>";
  },
  handles: { t: { x: "t", drag: (q) => ({ t: fillPlot.invX(q.x) }) } },
};

const checkPlot = new Plot(0, 9, 0, 40, { x: 235, y: 30, w: 265, h: 270 });
const proportionCheck: LabView = {
  render(v, r) {
    const p = checkPlot;
    const f = (x: number) => v.k * x + v.b;
    let out = open("Wertetabelle mit Quotienten und Graph der Zuordnung");
    out += rect(15, 34, 60, 30, "lab-panel") + rect(75, 34, 70, 30, "lab-panel") + rect(145, 34, 75, 30, "lab-panel");
    out += text(45, 54, "x", "lab-text", "middle") + text(110, 54, "y", "lab-text", "middle") + text(182, 54, "y : x", "lab-text", "middle");
    for (let x = 1; x <= 6; x++) {
      const y = 64 + (x - 1) * 32;
      const cls = x === v.x ? "lab-fill-a" : "lab-cell";
      out +=
        rect(15, y, 60, 32, cls) + rect(75, y, 70, 32, cls) + rect(145, y, 75, 32, cls) +
        text(45, y + 21, String(x), "lab-text", "middle") +
        text(110, y + 21, fmt(f(x)), "lab-text", "middle") +
        text(182, y + 21, fmt(f(x) / x), "lab-text", "middle");
    }
    out += text(118, 276, String(r.verdict), "lab-text-small", "middle");
    out += p.grid(1, 1, "x", "y", 5, 5);
    out += `<defs>${p.clip("check")}</defs>` + clipped("check", line(p.X(0), p.Y(f(0)), p.X(9), p.Y(f(9)), "lab-curve"));
    return out + handle("x", p.X(v.x), p.Y(f(v.x)), "Punkt auf dem Graphen") + "</svg>";
  },
  handles: { x: { x: "x", drag: (q) => ({ x: checkPlot.invX(q.x) }) } },
};

const ruleOfThree: LabView = {
  render(v, r) {
    const perUnit = v.b / v.a;
    const target = perUnit * v.x;
    const s = 300 / Math.max(v.b, target, perUnit);
    const row = (y: number, left: string, value: number, cls: string) =>
      text(150, y + 26, left, "lab-text", "end") +
      rect(165, y, Math.max(1, value * s), 40, cls) +
      text(165 + Math.max(1, value * s) + 8, y + 26, `${fmt(value)} €`, "lab-text");
    return (
      open("Dreisatz in drei Zeilen") +
      title(String(r.calc)) +
      row(50, `${v.a} kg`, v.b, "lab-fill-a") +
      row(110, "1 kg", perUnit, "lab-fill-c") +
      row(170, `${v.x} kg`, target, "lab-fill-b") +
      text(260, 240, `: ${v.a}, dann · ${v.x}`, "lab-text-small", "middle") +
      rail("x", "Gesuchte Menge in kg", v.x, 1, 12, 300) +
      "</svg>"
    );
  },
  handles: { x: railHandle("x", 1, 12) },
};

const percentTerms: LabView = {
  render(v, r) {
    const x = 40;
    const w = 440;
    let out = open("Grundwert, Prozentsatz und Prozentwert als Balken") + title(`${v.p} % von ${v.G} € sind ${fmt(Number(r.W))} €`);
    out += text(x, 62, `Grundwert G = ${v.G} € entspricht 100 %`, "lab-text-a");
    out += rect(x, 72, w, 45, "lab-fill-a");
    out += text(x, 152, `Prozentwert W = ${fmt(Number(r.W))} € entspricht ${v.p} %`, "lab-text-b");
    out += rect(x, 162, (w * v.p) / 100, 45, "lab-fill-b");
    for (let i = 1; i < 10; i++) out += line(x + (w * i) / 10, 72, x + (w * i) / 10, 207, "lab-grid");
    return out + rail("p", "Prozentsatz", v.p, 5, 100, 295) + "</svg>";
  },
  handles: { p: railHandle("p", 5, 100) },
};

const percentCalc: LabView = {
  render(_v, r) {
    const G = Number(r.G);
    const W = Number(r.W);
    const p = Number(r.pct);
    const rows = [
      `${fmt(100)} %  ≙  ${fmt(G)} €`,
      `1 %  ≙  ${fmt(G / 100)} €`,
      `${fmt(p)} %  ≙  ${fmt(W)} €`,
    ];
    let out = open("Dreisatz zur Prozentrechnung") + title(String(r.task));
    rows.forEach((content, i) => {
      out += rect(110, 52 + i * 52, 300, 44, "lab-panel") + text(260, 80 + i * 52, content, "lab-text", "middle");
    });
    const barW = 400;
    return (
      out +
      polygon(
        [
          { x: 60, y: 222 },
          { x: 60 + barW, y: 222 },
          { x: 60 + barW, y: 252 },
          { x: 60, y: 252 },
        ],
        "lab-fill-a",
      ) +
      rect(60, 222, (barW * Math.min(p, 100)) / 100, 30, "lab-fill-b") +
      text(260, 280, String(r.proportion), "lab-text-small", "middle") +
      "</svg>"
    );
  },
};

export const PROPORTION_VIEWS = {
  "fill-graph": fillGraph,
  "proportion-check": proportionCheck,
  "rule-of-three": ruleOfThree,
  "percent-terms": percentTerms,
  "percent-calc": percentCalc,
};
