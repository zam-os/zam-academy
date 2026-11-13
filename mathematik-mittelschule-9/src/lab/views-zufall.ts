import { fmt, fracText } from "../exercises/format";
import { diceEvent, diceCount, DICE_EVENTS, EVENTS, EXPERIMENTS, outcomes, setText } from "../models";
import {
  circle,
  infoBox,
  line,
  open,
  path,
  polar,
  rect,
  sectorPath,
  text,
  type LabView,
} from "./svg";
import { legend, legendRow, title } from "./view-helpers";

const pct = (p: number) => `${fmt(p * 100, 1)} %`;

/** Pips of a die face with `k` dots, centred at (x, y), side `size`. */
function dieFace(x: number, y: number, size: number, k: number, cls: string): string {
  const d = size / 4;
  const spots: Record<number, Array<[number, number]>> = {
    1: [[0, 0]],
    2: [[-1, -1], [1, 1]],
    3: [[-1, -1], [0, 0], [1, 1]],
    4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
    5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
    6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
  };
  let out = rect(x - size / 2, y - size / 2, size, size, cls, 'rx="6"');
  for (const [dx, dy] of spots[k] ?? []) out += circle(x + dx * d, y + dy * d, size / 11, "lab-dot-small");
  return out;
}

// 6.1 Ergebnismenge und Ereignis.
const outcomeSet: LabView = {
  render(v) {
    const exp = EXPERIMENTS[v.exp] ?? EXPERIMENTS[0];
    const { omega, favourable } = outcomes(exp.n, v.event);
    const fav = new Set(favourable);
    let out =
      open(`${exp.name}: Ereignis ${EVENTS[v.event].name}, ${favourable.length} von ${exp.n} Ergebnissen`) +
      title(`${exp.name}: Ω = ${setText(omega)}`);
    if (v.exp === 0) {
      omega.forEach((k, i) => {
        out += dieFace(60 + (i % 3) * 66, 80 + Math.floor(i / 3) * 66, 52, k, fav.has(k) ? "lab-fill-b" : "lab-fill-a");
      });
    } else if (v.exp === 1) {
      const cx = 125;
      const cy = 145;
      omega.forEach((k, i) => {
        const a0 = 90 - (i * 360) / exp.n;
        const a1 = a0 - 360 / exp.n;
        out += path(sectorPath(cx, cy, 95, a1, a0), fav.has(k) ? "lab-fill-b" : "lab-fill-a");
        const at = polar(cx, cy, 65, (a0 + a1) / 2);
        out += text(at.x, at.y + 5, String(k), "lab-text", "middle");
      });
      out += `<polygon points="${cx - 8},${cy - 104} ${cx + 8},${cy - 104} ${cx},${cy - 88}" class="lab-ink"/>`;
    } else {
      const cols = v.exp === 2 ? 5 : 6;
      omega.forEach((k, i) => {
        const x = 40 + (i % cols) * 42;
        const y = 80 + Math.floor(i / cols) * 46;
        out += circle(x, y, 18, fav.has(k) ? "lab-fill-b" : "lab-fill-a");
        out += text(x, y + 5, String(k), "lab-text", "middle");
      });
      if (v.exp === 2) out += path("M24 52 Q 20 200 60 200 L 210 200 Q 250 200 246 52", "lab-thin");
    }
    out += infoBox(300, 70, [
      [`Ereignis E: ${EVENTS[v.event].name}`, "lab-text-b"],
      [`E = ${setText(favourable)}`, "lab-text-b"],
      [`günstig: ${favourable.length}`, "lab-text-b"],
      [`möglich: ${exp.n}`, "lab-text-a"],
    ]);
    out += legend(300, 200, [
      ["lab-fill-b", "Ergebnis gehört zu E"],
      ["lab-fill-a", "Ergebnis gehört nicht zu E"],
    ]);
    return out + "</svg>";
  },
};

/** Ball colours of the urn lab. */
export const COLOURS = ["rot", "blau", "grün"];
const BALL_CLASS = ["lab-ball-red", "lab-ball-blue", "lab-fill-ok"];

// 6.2 Laplace-Wahrscheinlichkeit: Urne und einstufiges Baumdiagramm.
const laplaceUrn: LabView = {
  render(v) {
    const counts = [v.red, v.blue, v.green];
    const total = counts.reduce((s, c) => s + c, 0);
    let out =
      open(`Urne mit ${counts[0]} roten, ${counts[1]} blauen und ${counts[2]} grünen Kugeln`) +
      title(total ? `P(${COLOURS[v.target]}) = ${counts[v.target]}/${total} = ${fracText(counts[v.target], total)} ≈ ${pct(counts[v.target] / total)}` : "Lege Kugeln in die Urne.");
    out += path("M30 60 Q 26 240 70 246 L 200 246 Q 244 240 240 60", "lab-ink");
    let i = 0;
    counts.forEach((c, colour) => {
      for (let j = 0; j < c; j++) {
        const x = 52 + (i % 8) * 24;
        const y = 228 - Math.floor(i / 8) * 24;
        out += circle(x, y, 10, BALL_CLASS[colour]);
        if (colour === v.target) out += `<circle cx="${x}" cy="${y}" r="13" class="lab-ok-stroke" fill="none" stroke-width="2.5"/>`;
        i++;
      }
    });
    // One-stage tree.
    const root = { x: 290, y: 150 };
    COLOURS.forEach((name, colour) => {
      const y = 70 + colour * 80;
      const end = { x: 430, y };
      const on = colour === v.target;
      out += line(root.x, root.y, end.x, end.y, on ? "lab-side-b" : "lab-thin");
      out += circle(end.x, end.y, 9, BALL_CLASS[colour]);
      out += text(end.x + 16, end.y + 5, name, on ? "lab-text-b" : "lab-text");
      out += text((root.x + end.x) / 2 - 6, (root.y + end.y) / 2 - 6, total ? fracText(counts[colour], total) : "–", on ? "lab-text-b" : "lab-text-small", "middle");
    });
    out += circle(root.x, root.y, 4, "lab-dot-small");
    out += text(290, 300, "Einstufiges Baumdiagramm: an jedem Ast die Wahrscheinlichkeit", "lab-text-small", "middle");
    if (total) {
      out += rect(270, 312, 220, 12, "lab-cell");
      out += rect(270, 312, (220 * counts[v.target]) / total, 12, "lab-fill-b");
    }
    return out + "</svg>";
  },
};

// 6.3 Gegenereignis: Glücksrad mit Gewinn- und Nietenfeldern.
const wheelFair: LabView = {
  render(v) {
    const k = Math.min(v.k, v.n);
    const pWin = k / v.n;
    const cx = 130;
    const cy = 165;
    let out =
      open(`Glücksrad mit ${v.n} Feldern, ${k} Gewinnfeldern: P(E) = ${fracText(k, v.n)}, P(Ē) = ${fracText(v.n - k, v.n)}`) +
      title(`P(Gewinn) = ${fracText(k, v.n)}  ·  P(kein Gewinn) = 1 − ${fracText(k, v.n)} = ${fracText(v.n - k, v.n)}`);
    for (let i = 0; i < v.n; i++) {
      const a0 = 90 - (i * 360) / v.n;
      const a1 = a0 - 360 / v.n;
      out += path(sectorPath(cx, cy, 110, a1, a0), i < k ? "lab-fill-b" : "lab-fill-a");
    }
    out += `<polygon points="${cx - 8},${cy - 120} ${cx + 8},${cy - 120} ${cx},${cy - 104}" class="lab-ink"/>`;
    const bar = (y: number, p: number, cls: string, label: string) =>
      rect(290, y, 200, 22, "lab-cell", 'rx="4"') + rect(290, y, 200 * p, 22, cls, 'rx="4"') + text(290, y - 6, `${label}: ${pct(p)}`, "lab-text-small");
    out += bar(90, pWin, "lab-fill-b", "Ereignis E (Gewinn)");
    out += bar(150, 1 - pWin, "lab-fill-a", "Gegenereignis Ē (kein Gewinn)");
    out += line(390, 80, 390, 180, "lab-dashed");
    out += text(390, 196, "50 %", "lab-text-tick", "middle");
    const verdict = Math.abs(pWin - 0.5) < 1e-9 ? "gleiche Chancen" : pWin > 0.5 ? "Gewinn wahrscheinlicher" : "Verlust wahrscheinlicher";
    out += text(290, 240, verdict, Math.abs(pWin - 0.5) < 1e-9 ? "lab-text-ok" : "lab-text", "start");
    out += legendRow(290, 280, [
      ["lab-fill-b", "E"],
      ["lab-fill-a", "Ē"],
    ]);
    return out + "</svg>";
  },
};

// 6.4 Zwei unterscheidbare Würfel: 36 Ergebnisse in einer Tabelle.
const twoDice: LabView = {
  render(v) {
    const count = diceCount(v.type, v.s);
    const cell = 33;
    const x0 = 70;
    const y0 = 84;
    let out =
      open(`Zwei Würfel, rot und blau: ${count} von 36 Ergebnissen gehören zu „${DICE_EVENTS[v.type]}“`) +
      title(`${DICE_EVENTS[v.type].replace(" s", ` ${v.s}`)}: P = ${count}/36 = ${fracText(count, 36)} ≈ ${pct(count / 36)}`);
    for (let r = 1; r <= 6; r++) {
      out += text(x0 - 14, y0 + (r - 0.5) * cell + 5, String(r), "lab-text-b", "middle");
      out += text(x0 + (r - 0.5) * cell, y0 - 8, String(r), "lab-text-a", "middle");
      for (let b = 1; b <= 6; b++) {
        const on = diceEvent(v.type, v.s, r, b);
        out += rect(x0 + (b - 1) * cell, y0 + (r - 1) * cell, cell - 3, cell - 3, on ? "lab-fill-ok" : "lab-cell", 'rx="4"');
        out += text(x0 + (b - 0.5) * cell - 1, y0 + (r - 0.5) * cell + 4, `${r}|${b}`, "lab-text-small", "middle");
      }
    }
    out += text(x0 + 3 * cell, y0 - 24, "blauer Würfel (Spalte)", "lab-text-a", "middle");
    out += text(x0 - 40, y0 + 3 * cell, "rot", "lab-text-b", "middle");
    out += infoBox(300, 80, [
      [`günstig: ${count}`, "lab-text-ok"],
      ["möglich: 36", "lab-text"],
      [`P(E) = ${fracText(count, 36)} ≈ ${pct(count / 36)}`, "lab-text-ok"],
      [`P(Ē) = ${fracText(36 - count, 36)} ≈ ${pct(1 - count / 36)}`, "lab-text"],
    ]);
    out += legend(300, 200, [
      ["lab-fill-ok", "Ergebnis gehört zu E"],
      ["lab-fill-b", "Augenzahl rot (Zeile)"],
      ["lab-fill-a", "Augenzahl blau (Spalte)"],
    ]);
    return out + "</svg>";
  },
};

export const ZUFALL_VIEWS: Record<string, LabView> = {
  "outcome-set": outcomeSet,
  "laplace-urn": laplaceUrn,
  "wheel-fair": wheelFair,
  "two-dice": twoDice,
};
