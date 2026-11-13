import { fmt } from "../exercises/format";
import { clamp } from "./svg";
import {
  open,
  text,
  line,
  rect,
  circle,
  arrow,
  sectorPath,
  infoBox,
  handle,
  type LabView,
} from "./svg";
import { rail, title } from "./view-helpers";

const DENOMS = [10, 20, 25, 50];

export const PROZENT_RATIONALE_VIEWS: Record<string, LabView> = {
  "percent-grid": {
    render(v) {
      const den = DENOMS[v.nennerIdx ?? 1] ?? 20;
      const numVal = clamp(Math.round(v.zaehler ?? 7), 1, den);
      const pct = (numVal / den) * 100;
      const cellsPerTile = 100 / den;
      const filledCells = Math.round(pct);

      const gx = 55;
      const gy = 52;
      const size = 21;
      let out = open("Hunderterfeld für Prozentsätze");
      out += title(`${numVal}/${den} = ${fmt(pct)} %`);

      for (let i = 0; i < 100; i++) {
        const col = i % 10;
        const row = Math.floor(i / 10);
        const filled = i < filledCells;
        out += rect(
          gx + col * size,
          gy + row * size,
          size - 1.5,
          size - 1.5,
          filled ? "lab-fill-a" : "lab-shape",
          filled
            ? `style="stroke:var(--lab-a);stroke-width:1.1"`
            : `style="stroke:var(--lab-grid);stroke-width:0.8"`,
        );
      }

      out += infoBox(295, 78, [
        [`Bruch: ${numVal} / ${den}`, "lab-text"],
        [`Hundertstelbruch: ${filledCells} / 100`, "lab-text-a"],
        [`Prozentsatz: ${fmt(pct)} %`, "lab-text-big"],
        [`Dezimalzahl: ${fmt(pct / 100, 2)}`, "lab-text-small"],
        [`Blockgröße: 1/${den} = ${cellsPerTile} Felder`, "lab-text-small"],
      ]);

      out += rail("zaehler", "Zähler", numVal, 1, den, 302);
      out += "</svg>";
      return out;
    },
    handles: {
      zaehler: {
        x: "zaehler",
        drag: (p, v) => {
          const den = DENOMS[v.nennerIdx ?? 1] ?? 20;
          return { zaehler: clamp(Math.round(1 + ((p.x - 65) / 390) * (den - 1)), 1, den) };
        },
      },
    },
  },

  "percent-compare": {
    render(v) {
      const aG = v.aTotal ?? 25;
      const aP = clamp(v.aHit ?? 18, 0, aG);
      const bG = v.bTotal ?? 40;
      const bP = clamp(v.bHit ?? 26, 0, bG);
      const pA = (aP / aG) * 100;
      const pB = (bP / bG) * 100;
      const barW = 330;

      let out = open("Anteile über Prozentsätze vergleichen");
      out += title("Prozentvergleich zweier Gruppen");

      // Gruppe A
      out += text(48, 86, `Gruppe A: ${aP} von ${aG}`, "lab-text-a");
      out += rect(48, 96, barW, 34, "lab-shape", 'rx="6"');
      out += rect(48, 96, (barW * pA) / 100, 34, "lab-fill-a", 'rx="6" style="stroke:var(--lab-a);stroke-width:2"');
      out += text(392, 118, `${fmt(pA, 1)} %`, "lab-text-big");

      // Gruppe B
      out += text(48, 174, `Gruppe B: ${bP} von ${bG}`, "lab-text-b");
      out += rect(48, 184, barW, 34, "lab-shape", 'rx="6"');
      out += rect(48, 184, (barW * pB) / 100, 34, "lab-fill-b", 'rx="6" style="stroke:var(--lab-b);stroke-width:2"');
      out += text(392, 206, `${fmt(pB, 1)} %`, "lab-text-big");

      const winner =
        Math.abs(pA - pB) < 0.05
          ? "Beide Anteile sind gleich groß!"
          : pA > pB
            ? `Gruppe A liegt um ${fmt(pA - pB, 1)} Prozentpunkte vorn`
            : `Gruppe B liegt um ${fmt(pB - pA, 1)} Prozentpunkte vorn`;

      out += infoBox(48, 255, [
        [winner, pA >= pB ? "lab-text-a" : "lab-text-b"],
        [`Absolute Zahlen allein (${aP} vs. ${bP}) täuschen bei ungleichem Grundwert!`, "lab-text-small"],
      ]);

      out += handle("aHit", 48 + (barW * pA) / 100, 113, "Treffer A");
      out += "</svg>";
      return out;
    },
    handles: {
      aHit: {
        x: "aHit",
        drag: (p, v) => {
          const g = v.aTotal ?? 25;
          return { aHit: clamp(Math.round(((p.x - 48) / 330) * g), 0, g) };
        },
      },
    },
  },

  "percent-bar": {
    render(v) {
      const g = v.g ?? 200;
      const p = v.p ?? 25;
      const P = (g * p) / 100;
      const x0 = 55;
      const w = 410;
      const hx = x0 + (w * p) / 100;

      let out = open("Prozentstreifen Grundwert Prozentwert Prozentsatz");
      out += title(`G = ${fmt(g)} €  ·  p = ${fmt(p)} %  →  P = ${fmt(P)} €`);

      // Full bar G
      out += text(x0, 76, `100 % = Grundwert G = ${fmt(g)} €`, "lab-text");
      out += text(x0 + w, 76, `P = ${fmt(P)} €`, "lab-text-a", "end");
      out += rect(x0, 94, w, 46, "lab-shape", 'rx="8"');
      out += rect(x0, 94, (w * p) / 100, 46, "lab-fill-a", 'rx="8" style="stroke:var(--lab-a);stroke-width:2"');

      // Scale ticks 0, 25, 50, 75, 100%
      for (const tick of [0, 25, 50, 75, 100]) {
        const tx = x0 + (w * tick) / 100;
        out += line(tx, 142, tx, 152, "lab-axis");
        out += text(tx, 168, `${tick} %`, "lab-text-tick", "middle");
      }

      out += handle("pct", hx, 117, "Prozentsatz p");

      out += infoBox(55, 206, [
        [`Prozentwert: P = G · p : 100 = ${fmt(g)} · ${fmt(p)} : 100 = ${fmt(P)} €`, "lab-text-a"],
        [`Faktor-Schreibweise: P = G · ${fmt(p / 100, 2)} = ${fmt(P)} €`, "lab-text"],
        [`Umkehrung: G = P : ${fmt(p)} · 100  |  p = P : G · 100`, "lab-text-small"],
      ]);
      out += "</svg>";
      return out;
    },
    handles: {
      pct: {
        x: "p",
        drag: (p) => ({ p: clamp(Math.round(((p.x - 55) / 410) * 100 / 5) * 5, 5, 100) }),
      },
    },
  },

  "mixture-ratio": {
    render(v) {
      const a = v.partA ?? 60;
      const b = v.partB ?? 140;
      const sum = a + b;
      const pctA = (a / sum) * 100;
      const pctB = 100 - pctA;

      let out = open("Mischungsverhältnis in Prozent");
      out += title(`Mischung: ${fmt(a)} g + ${fmt(b)} g = ${fmt(sum)} g`);

      // Stacked beaker
      const bx = 90;
      const by = 60;
      const bw = 110;
      const bh = 210;
      const hA = (bh * pctA) / 100;
      const hB = bh - hA;

      out += rect(bx, by, bw, hB, "lab-fill-b", 'style="stroke:var(--lab-b);stroke-width:1.5"');
      out += rect(bx, by + hB, bw, hA, "lab-fill-a", 'style="stroke:var(--lab-a);stroke-width:1.5"');
      out += rect(bx, by, bw, bh, "lab-outline", 'rx="6"');

      if (hB > 22) out += text(bx + bw / 2, by + hB / 2 + 5, `${fmt(pctB, 1)} %`, "lab-text-b", "middle");
      if (hA > 22) out += text(bx + bw / 2, by + hB + hA / 2 + 5, `${fmt(pctA, 1)} %`, "lab-text-a", "middle");

      out += infoBox(235, 86, [
        [`Grundwert G (Gesamtmenge): ${fmt(sum)} g`, "lab-text"],
        [`Anteil A (Konzentrat): ${fmt(a)} g = ${fmt(pctA, 1)} %`, "lab-text-a"],
        [`Anteil B (Wasser/Basis): ${fmt(b)} g = ${fmt(pctB, 1)} %`, "lab-text-b"],
        [`Rechnung: p = (${fmt(a)} : ${fmt(sum)}) · 100 %`, "lab-text-small"],
      ]);

      out += handle("mix", bx + bw / 2, by + hB, "Anteil A");
      out += "</svg>";
      return out;
    },
    handles: {
      mix: {
        y: "partA",
        drag: (p, v) => {
          const b = v.partB ?? 140;
          const fracA = clamp((270 - p.y) / 210, 0.05, 0.9);
          const nextA = Math.round(((fracA * b) / (1 - fracA)) / 10) * 10;
          return { partA: clamp(nextA, 20, 200) };
        },
      },
    },
  },

  "percent-chart": {
    render(v) {
      const a = v.a ?? 45;
      const b = v.b ?? 30;
      const c = v.c ?? 25;
      const sum = a + b + c;
      const pA = (a / sum) * 100;
      const pB = (b / sum) * 100;
      const pC = (c / sum) * 100;
      const mode = v.mode ?? 0;

      let out = open("Diagramme für Prozentangaben");
      out += title(
        mode === 0
          ? "Kreisdiagramm (360° = 100 %)"
          : mode === 1
            ? "Streifendiagramm (Gesamtbreite = 100 %)"
            : "Säulendiagramm",
      );

      if (mode === 0) {
        const cx = 165;
        const cy = 180;
        const r = 98;
        const aEnd = 90 + (pA / 100) * 360;
        const bEnd = aEnd + (pB / 100) * 360;
        out += `<path d="${sectorPath(cx, cy, r, 90, aEnd)}" class="lab-fill-a" stroke="var(--lab-a)" stroke-width="2" />`;
        out += `<path d="${sectorPath(cx, cy, r, aEnd, bEnd)}" class="lab-fill-b" stroke="var(--lab-b)" stroke-width="2" />`;
        out += `<path d="${sectorPath(cx, cy, r, bEnd, 450)}" class="lab-fill-c" stroke="var(--lab-c)" stroke-width="2" />`;
      } else if (mode === 1) {
        const sx = 45;
        const sw = 430;
        const wA = (sw * pA) / 100;
        const wB = (sw * pB) / 100;
        const wC = sw - wA - wB;
        out += rect(sx, 115, wA, 58, "lab-fill-a", 'style="stroke:var(--lab-a);stroke-width:2"');
        out += rect(sx + wA, 115, wB, 58, "lab-fill-b", 'style="stroke:var(--lab-b);stroke-width:2"');
        out += rect(sx + wA + wB, 115, wC, 58, "lab-fill-c", 'style="stroke:var(--lab-c);stroke-width:2"');
        if (wA > 42) out += text(sx + wA / 2, 150, `${fmt(pA, 0)} %`, "lab-text-a", "middle");
        if (wB > 42) out += text(sx + wA + wB / 2, 150, `${fmt(pB, 0)} %`, "lab-text-b", "middle");
        if (wC > 42) out += text(sx + wA + wB + wC / 2, 150, `${fmt(pC, 0)} %`, "lab-text-c", "middle");
      } else {
        const baseY = 268;
        const hMax = 175;
        const cols: Array<[string, number, string, string]> = [
          ["Gruppe A", pA, "lab-fill-a", "var(--lab-a)"],
          ["Gruppe B", pB, "lab-fill-b", "var(--lab-b)"],
          ["Gruppe C", pC, "lab-fill-c", "var(--lab-c)"],
        ];
        out += line(55, baseY, 275, baseY, "lab-axis");
        cols.forEach(([label, pVal, cls, stroke], i) => {
          const x = 75 + i * 68;
          const bh = (hMax * pVal) / 100;
          out += rect(x, baseY - bh, 42, bh, cls, `style="stroke:${stroke};stroke-width:2"`);
          out += text(x + 21, baseY - bh - 8, `${fmt(pVal, 1)} %`, "lab-text-small", "middle");
          out += text(x + 21, baseY + 18, label, "lab-text-tick", "middle");
        });
      }

      const boxX = mode === 1 ? 45 : 300;
      const boxY = mode === 1 ? 208 : 96;
      out += infoBox(boxX, boxY, [
        [`A: ${fmt(pA, 1)} % (${fmt((pA / 100) * 360, 0)}°)`, "lab-text-a"],
        [`B: ${fmt(pB, 1)} % (${fmt((pB / 100) * 360, 0)}°)`, "lab-text-b"],
        [`C: ${fmt(pC, 1)} % (${fmt((pC / 100) * 360, 0)}°)`, "lab-text-c"],
      ]);
      out += "</svg>";
      return out;
    },
  },

  "number-line-op": {
    render(v) {
      const a = v.a ?? 3;
      const b = v.b ?? -5;
      const op = v.op ?? 0; // 0 = +, 1 = -
      const res = op === 0 ? a + b : a - b;
      const xMin = -16;
      const xMax = 16;
      const toX = (n: number) => 45 + ((n - xMin) / (xMax - xMin)) * 430;
      const axisY = 195;

      let out = open("Zahlengerade mit Pfeilen");
      const bStr = b < 0 ? `(${fmt(b)})` : fmt(b);
      out += title(`${fmt(a)} ${op === 0 ? "+" : "−"} ${bStr} = ${fmt(res)}`);

      out += line(35, axisY, 485, axisY, "lab-axis");
      for (let t = xMin; t <= xMax; t += 4) {
        const tx = toX(t);
        out += line(tx, axisY - 5, tx, axisY + 5, "lab-axis");
        out += text(tx, axisY + 20, fmt(t), "lab-text-tick", "middle");
      }
      out += line(toX(0), axisY - 12, toX(0), axisY + 12, "lab-ink");

      // Arrow a from 0 to a
      if (a !== 0) {
        out += arrow(toX(0), 145, toX(a), 145, "lab-curve", 3);
      }
      out += text((toX(0) + toX(a)) / 2, 134, `a = ${fmt(a)}`, "lab-text-a", "middle");

      // Second arrow from a to res (range ±16 covers full a, b ∈ [−8; 8])
      const stepDelta = op === 0 ? b : -b;
      if (stepDelta !== 0) {
        out += arrow(toX(a), 108, toX(res), 108, "lab-curve-2", 3);
      }
      out += text(
        (toX(a) + toX(res)) / 2,
        96,
        `${op === 0 ? "+" : "−"} ${bStr}`,
        "lab-text-b",
        "middle",
      );

      // Result dot
      out += circle(toX(res), axisY, 6, "lab-dot-ok");
      out += text(toX(res), axisY - 14, `Ergebnis: ${fmt(res)}`, "lab-text-ok", "middle");

      out += handle("a", toX(a), 145, "Startwert a");
      out += handle("b", toX(res), 108, "Zweiter Summand/Subtrahend b");
      out += "</svg>";
      return out;
    },
    handles: {
      a: {
        x: "a",
        drag: (p) => ({ a: clamp(Math.round(-16 + ((p.x - 45) / 430) * 32), -8, 8) }),
      },
      b: {
        x: "b",
        drag: (p, v) => {
          const target = Math.round(-16 + ((p.x - 45) / 430) * 32);
          const diff = target - (v.a ?? 0);
          return { b: clamp(v.op === 1 ? -diff : diff, -8, 8) };
        },
      },
    },
  },

  "sign-rules-grid": {
    render(v) {
      const a = v.a ?? -3;
      const bMag = v.bMag ?? 4;
      const bSign = v.bSign ?? 1; // 0 = +, 1 = -
      const b = bSign === 0 ? bMag : -bMag;
      const op = v.op ?? 0; // 0 = ·, 1 = :
      const val = op === 0 ? a * b : a / b;
      const sameSign = (a >= 0 && b >= 0) || (a < 0 && b < 0);

      let out = open("Vorzeichenregeln bei Multiplikation und Division");
      const aStr = a < 0 ? `(${fmt(a)})` : fmt(a);
      const bStr = b < 0 ? `(${fmt(b)})` : fmt(b);
      out += title(`${aStr} ${op === 0 ? "·" : ":"} ${bStr} = ${fmt(val, 2)}`);

      // Balance/Thermometer style block
      out += rect(55, 76, 190, 92, a < 0 ? "lab-fill-b" : "lab-fill-a", 'rx="10"');
      out += text(150, 114, `1. Zahl: ${fmt(a)}`, "lab-text", "middle");
      out += text(150, 140, a < 0 ? "Vorzeichen: −" : a > 0 ? "Vorzeichen: +" : "Null (0)", "lab-text-small", "middle");

      out += rect(275, 76, 190, 92, b < 0 ? "lab-fill-b" : "lab-fill-a", 'rx="10"');
      out += text(370, 114, `2. Zahl: ${fmt(b)}`, "lab-text", "middle");
      out += text(370, 140, b < 0 ? "Vorzeichen: −" : "Vorzeichen: +", "lab-text-small", "middle");

      const ruleText =
        a === 0
          ? "0 · b = 0 und 0 : b = 0"
          : sameSign
            ? "Gleiche Vorzeichen → Ergebnis ist POSITIV (+)"
            : "Ungleiche Vorzeichen → Ergebnis ist NEGATIV (−)";
      out += infoBox(55, 208, [
        [ruleText, sameSign && a !== 0 ? "lab-text-ok" : "lab-text-b"],
        [`Betrag: ${fmt(Math.abs(a))} ${op === 0 ? "·" : ":"} ${fmt(Math.abs(b))} = ${fmt(Math.abs(val), 2)}`, "lab-text"],
        [`Ergebnis: ${fmt(val, 2)}`, "lab-text-big"],
      ]);

      out += handle("a", 55 + ((a + 6) / 12) * 410, 295, "Zahl a");
      out += line(55, 295, 465, 295, "lab-axis");
      out += "</svg>";
      return out;
    },
    handles: {
      a: {
        x: "a",
        drag: (p) => ({ a: clamp(Math.round(-6 + ((p.x - 55) / 410) * 12), -6, 6) }),
      },
    },
  },
};
