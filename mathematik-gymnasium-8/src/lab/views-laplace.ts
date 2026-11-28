import { fmt } from "../exercises/format";
import { countingTotal, seededSampleSim } from "../curriculum/math";
import {
  circle,
  dashedLine,
  infoBox,
  line,
  open,
  Plot,
  polyline,
  rect,
  sectorPath,
  text,
  type LabView,
} from "./svg";
import { rail, railHandle, title } from "./view-helpers";

/** Lab views for Stage 5: Laplace-Experimente. */

export function sampleEventNumbers(die: number, rule: number) {
  const max = die === 0 ? 6 : 8;
  const omega = Array.from({ length: max }, (_, i) => i + 1);
  const event = omega.filter((n) =>
    rule === 0 ? n % 2 === 0 : rule === 1 ? n > 4 : n % 3 === 0,
  );
  const comp = omega.filter((n) => !event.includes(n));
  return { omega, event, comp };
}

const sampleSpaceSet: LabView = {
  render(v) {
    const { omega, event, comp } = sampleEventNumbers(v.die, v.rule);
    let out = open("Ergebnismenge Ω, Ereignis E und Gegenereignis Ē");
    out += title(`${omega.length}-seitiger Würfel: |Ω| = ${omega.length}`);

    out += rect(22, 46, 476, 174, "lab-cell", 'rx="12"');
    out += rect(38, 66, 212, 136, "lab-fill-a lab-side-a", 'rx="10"');
    out += text(144, 92, "Ereignis E", "lab-text-a", "middle");
    out += text(144, 134, `{${event.join("; ")}}`, "lab-text-big", "middle");
    out += text(144, 180, `|E| = ${event.length}`, "lab-text-a", "middle");

    out += rect(270, 66, 212, 136, "lab-fill-b lab-side-b", 'rx="10"');
    out += text(376, 92, "Gegenereignis Ē", "lab-text-b", "middle");
    out += text(376, 134, `{${comp.join("; ")}}`, "lab-text-big", "middle");
    out += text(376, 180, `|Ē| = ${comp.length}`, "lab-text-b", "middle");

    out += rect(22, 236, 476, 48, "lab-panel", 'rx="8"');
    out += text(260, 265, `E und Ē teilen Ω vollständig auf: ${event.length} + ${comp.length} = ${omega.length}`, "lab-text", "middle");
    return out + "</svg>";
  },
};

const lawLargeNumbers: LabView = {
  render(v) {
    const n = v.n;
    const p = v.p;
    const sim = seededSampleSim(n, p, v.seed);
    const plot = new Plot(0, Math.max(50, n), 0, 1, { x: 48, y: 42, w: 300, h: 205 });
    let out = open("Empirisches Gesetz der großen Zahlen");
    out += title(`n = ${fmt(n, 0)} Versuche: relative Häufigkeit h_n = ${fmt(sim.freq, 3)}`);
    out += plot.grid(Math.max(25, Math.round(n / 4)), Math.max(50, Math.round(n / 2)), "n", "h");
    out += dashedLine(plot.X(0), plot.Y(p), plot.X(Math.max(50, n)), plot.Y(p), "lab-asymptote");
    out += polyline(
      sim.series.map((pt) => plot.P(pt.n, pt.freq)),
      "lab-curve",
    );
    const last = sim.series[sim.series.length - 1];
    out += circle(plot.X(last.n), plot.Y(last.freq), 4.5, "lab-point-ok");
    out += infoBox(505, 86, [
      [`Treffer k = ${fmt(sim.hits, 0)}`, "lab-text-a"],
      [`h_n = ${fmt(sim.freq, 3)}`, "lab-text-ok"],
      [`wahres p = ${fmt(p, 2)}`, "lab-text-bad"],
      [`|h_n − p| = ${fmt(Math.abs(sim.freq - p), 3)}`, "lab-text-small"],
    ], "end");
    out += rail("n", "Anzahl n", n, 10, 500, 294);
    return out + "</svg>";
  },
  handles: { n: railHandle("n", 10, 500) },
};

const spreadsheetRefs: LabView = {
  render(v) {
    const absolute = v.mode === 0;
    const hits = v.hits;
    const total = v.total;
    const rel = hits / total;
    let out = open("Absoluter vs. relativer Zellbezug in Tabellenkalkulationen");
    out += title(absolute ? "Formel C2: = B2 / $B$5 (korrekt)" : "Formel C2: = B2 / B5 (Fehler beim Herunterziehen!)");

    out += rect(24, 44, 472, 30, "lab-panel", 'rx="6"');
    out += text(38, 64, absolute ? "C3 (heruntergezogen):  = B3 / $B$5" : "C3 (heruntergezogen):  = B3 / B6  (B6 ist leer = 0!)", absolute ? "lab-text-ok" : "lab-text-bad");

    const rows = [
      ["Ergebnis", "Anzahl (B)", "Rel. Häufigkeit (C)"],
      ["Treffer 1 (Z2)", fmt(hits, 0), fmt(rel, 3)],
      ["Treffer 2 (Z3)", fmt(total - hits, 0), absolute ? fmt(1 - rel, 3) : "#DIV/0!"],
      ["Summe (Z5 = $B$5)", fmt(total, 0), "1,000"],
    ];
    const widths = [166, 126, 180];
    rows.forEach((row, r) => {
      let cx = 24;
      const ry = 84 + r * 36;
      row.forEach((cell, c) => {
        const cls = r === 0 ? "lab-cell-sum" : r === 3 && c === 1 ? "lab-fill-b lab-cell" : !absolute && r === 2 && c === 2 ? "lab-fill-b lab-cell" : "lab-cell";
        out += rect(cx, ry, widths[c], 36, cls);
        out += text(cx + widths[c] / 2, ry + 23, cell, !absolute && r === 2 && c === 2 ? "lab-text-bad" : "lab-text-small", "middle");
        cx += widths[c];
      });
    });

    out += rail("hits", "Treffer B2", hits, 10, 80, 294);
    return out + "</svg>";
  },
  handles: { hits: railHandle("hits", 10, 80) },
};

const laplaceSymmetryCheck: LabView = {
  render(v) {
    const s1 = v.s1;
    const s2 = v.s2;
    const s3 = 360 - s1 - s2;
    const isLaplace = s1 === s2 && s2 === s3;
    const cx = 160;
    const cy = 165;
    const r = 92;
    let out = open("Laplace-Experiment vs. ungleich wahrscheinliche Ergebnisse");
    out += title(`Sektoren: ${fmt(s1, 0)}°, ${fmt(s2, 0)}°, ${fmt(s3, 0)}°`);
    out += `<path d="${sectorPath(cx, cy, r, 0, s1)}" class="lab-fill-a lab-side-a"/>`;
    out += `<path d="${sectorPath(cx, cy, r, s1, s1 + s2)}" class="lab-fill-b lab-side-b"/>`;
    out += `<path d="${sectorPath(cx, cy, r, s1 + s2, 360)}" class="lab-fill-ok lab-side-ok"/>`;
    out += infoBox(498, 92, [
      [`Sektor 1: ${fmt(s1 / 360, 2)}`, "lab-text-a"],
      [`Sektor 2: ${fmt(s2 / 360, 2)}`, "lab-text-b"],
      [`Sektor 3: ${fmt(s3 / 360, 2)}`, "lab-text-ok"],
      [isLaplace ? "Laplace-Experiment ✓" : "Kein Laplace-Exp.", isLaplace ? "lab-text-ok" : "lab-text-bad"],
    ], "end");
    return out + "</svg>";
  },
};

const laplaceUrnGrid: LabView = {
  render(v) {
    const r = v.red;
    const b = v.blue;
    const g = v.green;
    const total = r + b + g;
    const pR = r / total;
    const pComp = 1 - pR;
    let out = open("Laplace-Wahrscheinlichkeit und Gegenereignis in der Urne");
    out += title(`|Ω| = ${fmt(total, 0)} Kugeln   ·   P(rot) = ${fmt(r, 0)}/${fmt(total, 0)} = ${fmt(pR, 2)}`);

    // Urn box
    out += rect(24, 50, 224, 174, "lab-cell", 'rx="12"');
    const drawRow = (count: number, y: number, cls: string) => {
      for (let i = 0; i < count; i++) {
        out += circle(52 + i * 33, y, 12, cls);
      }
    };
    drawRow(r, 84, "lab-ball-red");
    drawRow(b, 134, "lab-ball-blue");
    drawRow(g, 184, "lab-fill-ok lab-side-ok");

    // Bars on right
    const barW = 200;
    out += rect(274, 70, barW, 24, "lab-cell", 'rx="6"');
    out += rect(274, 70, barW * pR, 24, "lab-bar-bad", 'rx="6"');
    out += text(274, 62, `P(rot) = ${fmt(pR, 2)}`, "lab-text-bad");

    out += rect(274, 128, barW, 24, "lab-cell", 'rx="6"');
    out += rect(274, 128, barW * (b / total), 24, "lab-bar-a", 'rx="6"');
    out += text(274, 120, `P(blau) = ${fmt(b / total, 2)}`, "lab-text-a");

    out += rect(274, 186, barW, 24, "lab-cell", 'rx="6"');
    out += rect(274, 186, barW * pComp, 24, "lab-bar-ok", 'rx="6"');
    out += text(274, 178, `P(nicht rot) = 1 − P(rot) = ${fmt(pComp, 2)}`, "lab-text-ok");

    out += rail("red", "Rote Kugeln", r, 1, 6, 294);
    return out + "</svg>";
  },
  handles: { red: railHandle("red", 1, 6) },
};

const countingTree: LabView = {
  render(v) {
    const n1 = v.n1;
    const n2 = v.n2;
    const total = countingTotal([n1, n2]);
    const fav = Math.min(v.fav, total);
    let out = open("Zählprinzip und Baumdiagramm");
    out += title(`${fmt(n1, 0)} × ${fmt(n2, 0)} = ${fmt(total, 0)} Pfade   ·   P = ${fmt(fav, 0)}/${fmt(total, 0)} = ${fmt(fav / total, 2)}`);

    const rootX = 52;
    const rootY = 148;
    const midX = 186;
    const leafX = 336;
    out += circle(rootX, rootY, 5, "lab-point-a");

    let leafIdx = 0;
    const step1H = 210 / n1;
    for (let i = 0; i < n1; i++) {
      const y1 = 46 + (i + 0.5) * step1H;
      out += line(rootX, rootY, midX, y1, "lab-side-a");
      out += circle(midX, y1, 4, "lab-point-a");
      const subH = (step1H - 8) / n2;
      for (let j = 0; j < n2; j++) {
        const y2 = y1 - (step1H - 8) / 2 + (j + 0.5) * subH;
        const ok = leafIdx < fav;
        out += line(midX, y1, leafX, y2, ok ? "lab-side-ok" : "lab-axis");
        out += circle(leafX, y2, 3.5, ok ? "lab-point-ok" : "lab-dot-tn");
        leafIdx++;
      }
    }

    out += infoBox(505, 86, [
      [`Stufe 1: ${fmt(n1, 0)} Äste`, "lab-text-a"],
      [`Stufe 2: je ${fmt(n2, 0)} Äste`, "lab-text-b"],
      [`|Ω| = ${fmt(n1, 0)} · ${fmt(n2, 0)} = ${fmt(total, 0)}`, "lab-text"],
      [`P = ${fmt(fav, 0)} / ${fmt(total, 0)}`, "lab-text-ok"],
    ], "end");
    out += rail("fav", "Günstige Pfade", fav, 1, 6, 294);
    return out + "</svg>";
  },
  handles: { fav: railHandle("fav", 1, 6) },
};

export const VIEWS_LAPLACE: Record<string, LabView> = {
  "sample-space-set": sampleSpaceSet,
  "law-large-numbers": lawLargeNumbers,
  "spreadsheet-refs": spreadsheetRefs,
  "laplace-symmetry-check": laplaceSymmetryCheck,
  "laplace-urn-grid": laplaceUrnGrid,
  "counting-tree": countingTree,
};
