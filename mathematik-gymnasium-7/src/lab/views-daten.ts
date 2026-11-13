import { fmt } from "../exercises/format";
import { fiveNumbers, mean, median, sorted } from "../curriculum/math";
import {
  circle,
  infoBox,
  line,
  open,
  rect,
  text,
  type LabView,
} from "./svg";
import { rail, railHandle, railValue, title } from "./view-helpers";

function scaleX(val: number, min: number, max: number, x0 = 55, w = 410): number {
  return x0 + ((val - min) / (max - min)) * w;
}

const medianOrder: LabView = {
  render(v) {
    const n = v.n;
    const xVal = v.xVal;
    const base = [4, 7, 9, 13, 15, 6, 11].slice(0, n - 1);
    const raw = [...base, xVal];
    const ord = sorted(raw);
    const med = median(raw);
    const avg = mean(raw);
    const midLeft = Math.floor((ord.length - 1) / 2);
    const midRight = Math.ceil((ord.length - 1) / 2);

    let out = open("Median und arithmetisches Mittel einer sortierten Datenreihe");
    out += title(`n = ${fmt(n, 0)} Werte · Median = ${fmt(med, 1)} · Mittelwert = ${fmt(avg, 2)}`);

    out += text(45, 76, `Urliste:  ${raw.map((z) => fmt(z, 0)).join("; ")}`, "lab-text-small");
    out += text(45, 102, "Sortiert:", "lab-text-small");

    ord.forEach((val, idx) => {
      const bx = 115 + idx * 46;
      const isMid = idx === midLeft || idx === midRight;
      out += rect(bx, 82, 40, 28, isMid ? "lab-fill-ok lab-side-ok" : "lab-panel", 'rx="6"');
      out += text(bx + 20, 101, fmt(val, 0), isMid ? "lab-text-ok" : "lab-text", "middle");
    });

    // Number line
    out += line(55, 170, 465, 170, "lab-axis");
    for (let t = 2; t <= 16; t += 2) {
      const tx = scaleX(t, 2, 16);
      out += line(tx, 165, tx, 175, "lab-axis");
      out += text(tx, 191, fmt(t, 0), "lab-text-tick", "middle");
    }
    ord.forEach((val) => {
      out += circle(scaleX(val, 2, 16), 170, 4.5, val === xVal ? "lab-point-b" : "lab-point-a");
    });
    const mx = scaleX(med, 2, 16);
    const ax = scaleX(avg, 2, 16);
    out += line(mx, 140, mx, 178, "lab-side-ok");
    out += text(mx, 134, "Median", "lab-text-ok", "middle");
    out += line(ax, 148, ax, 206, "lab-dashed");
    out += text(ax, 220, "Mittelwert", "lab-text-b", "middle");

    out += rail("xVal", "Veränderlicher Wert", xVal, 2, 16, 295);
    return out + "</svg>";
  },
  handles: { xVal: railHandle("xVal", 2, 16) },
};

const outlierShift: LabView = {
  render(v) {
    const v7 = v.v7;
    const data = [2200, 2400, 2500, 2600, 2800, 3000, v7];
    const med = median(data);
    const avg = mean(data);
    const min = 1000;
    const max = 14000;

    let out = open("Wirkung eines Ausreißers auf Median und Mittelwert");
    out += title(`Median: ${fmt(med, 0)} € (stabil) vs. Mittelwert: ${fmt(avg, 0)} €`);

    out += line(55, 145, 465, 145, "lab-axis");
    for (const tick of [2000, 5000, 8000, 11000, 14000]) {
      const tx = scaleX(tick, min, max);
      out += line(tx, 140, tx, 150, "lab-axis");
      out += text(tx, 168, `${fmt(tick / 1000, 0)} T€`, "lab-text-tick", "middle");
    }

    for (let i = 0; i < 6; i++) {
      out += circle(scaleX(data[i], min, max), 145, 4.5, "lab-point-a");
    }
    const ox = scaleX(v7, min, max);
    out += circle(ox, 145, 6, "lab-point-bad");
    out += text(ox, 128, fmt(v7, 0), "lab-text-bad", "middle");

    const mx = scaleX(med, min, max);
    const ax = scaleX(avg, min, max);
    out += line(mx, 86, mx, 180, "lab-side-ok");
    out += text(mx - 6, 80, `Median: ${fmt(med, 0)} €`, "lab-text-ok", "end");
    out += line(ax, 102, ax, 195, "lab-dashed");
    out += text(Math.min(460, ax + 6), 212, `Mittelwert: ${fmt(avg, 0)} €`, "lab-text-b");

    out += rail("v7", "7. Wert (Ausreißer in €)", v7, 1500, 14000, 295);
    return out + "</svg>";
  },
  handles: { v7: railHandle("v7", 1500, 14000) },
};

const quartilesSplit: LabView = {
  render(v) {
    const low = v.low;
    const high = v.high;
    const raw = [low, 8, 10, 14, 16, 18, high];
    const fn = fiveNumbers(raw);
    const ord = sorted(raw);

    let out = open("Quartile und Spannweite an sieben Werten");
    out += title(`Spannweite R = ${fmt(fn.span, 0)} · Quartilsabstand = ${fmt(fn.iqr, 0)}`);

    ord.forEach((val, idx) => {
      const bx = 55 + idx * 59;
      const cls =
        idx < 3
          ? idx === 1
            ? "lab-fill-a lab-side-a"
            : "lab-panel"
          : idx === 3
            ? "lab-fill-ok lab-side-ok"
            : idx === 5
              ? "lab-fill-b lab-side-b"
              : "lab-panel";
      out += rect(bx, 74, 52, 34, cls, 'rx="6"');
      out += text(bx + 26, 96, fmt(val, 0), idx === 3 ? "lab-text-ok" : idx === 1 ? "lab-text-a" : idx === 5 ? "lab-text-b" : "lab-text", "middle");
    });

    out += text(55 + 59 + 26, 128, `q₁ = ${fmt(fn.q1, 1)}`, "lab-text-a", "middle");
    out += text(55 + 3 * 59 + 26, 128, `q₂ = ${fmt(fn.q2, 1)}`, "lab-text-ok", "middle");
    out += text(55 + 5 * 59 + 26, 128, `q₃ = ${fmt(fn.q3, 1)}`, "lab-text-b", "middle");

    out += rect(55, 150, 405, 42, "lab-panel", 'rx="8"');
    out += text(
      257,
      176,
      `Min=${fmt(fn.min, 0)} · q₁=${fmt(fn.q1, 1)} · Median=${fmt(fn.q2, 1)} · q₃=${fmt(fn.q3, 1)} · Max=${fmt(fn.max, 0)}`,
      "lab-text-small",
      "middle",
    );

    out += rail("low", "Kleinster Wert", low, 2, 8, 240);
    out += rail("high", "Größter Wert", high, 18, 30, 305);
    return out + "</svg>";
  },
  handles: {
    low: railHandle("low", 2, 8),
    high: railHandle("high", 18, 30),
  },
};

function drawBoxplot(
  yCenter: number,
  height: number,
  minV: number,
  q1V: number,
  medV: number,
  q3V: number,
  maxV: number,
  axisMin: number,
  axisMax: number,
  cls: string,
  medCls: string,
): string {
  const xMin = scaleX(minV, axisMin, axisMax);
  const xQ1 = scaleX(q1V, axisMin, axisMax);
  const xMed = scaleX(medV, axisMin, axisMax);
  const xQ3 = scaleX(q3V, axisMin, axisMax);
  const xMax = scaleX(maxV, axisMin, axisMax);
  let out = "";
  // Whiskers
  out += line(xMin, yCenter, xQ1, yCenter, "lab-side-a");
  out += line(xQ3, yCenter, xMax, yCenter, "lab-side-a");
  out += line(xMin, yCenter - height / 3, xMin, yCenter + height / 3, "lab-side-a");
  out += line(xMax, yCenter - height / 3, xMax, yCenter + height / 3, "lab-side-a");
  // Box
  out += rect(xQ1, yCenter - height / 2, xQ3 - xQ1, height, cls, 'rx="3"');
  // Median line
  out += line(xMed, yCenter - height / 2, xMed, yCenter + height / 2, medCls);
  return out;
}

const boxplotBuilder: LabView = {
  render(v) {
    const min = 2;
    const q1 = v.q1;
    const med = v.med;
    const q3 = v.q3;
    const max = v.max;

    let out = open("Boxplot mit Fünf-Punkte-Zusammenfassung");
    out += title(`Boxplot: Spannweite ${fmt(max - min, 0)} · Boxbreite (IQR) ${fmt(q3 - q1, 0)}`);

    // Axis 0..30
    out += line(55, 190, 465, 190, "lab-axis");
    for (let t = 0; t <= 30; t += 5) {
      const tx = scaleX(t, 0, 30);
      out += line(tx, 185, tx, 195, "lab-axis");
      out += text(tx, 211, fmt(t, 0), "lab-text-tick", "middle");
    }

    out += drawBoxplot(118, 48, min, q1, med, q3, max, 0, 30, "lab-fill-a lab-side-a", "lab-side-ok");
    out += text(scaleX(min, 0, 30), 82, fmt(min, 0), "lab-text-small", "middle");
    out += text(scaleX(q1, 0, 30), 82, `q₁=${fmt(q1, 0)}`, "lab-text-a", "middle");
    out += text(scaleX(med, 0, 30), 164, `Med=${fmt(med, 0)}`, "lab-text-ok", "middle");
    out += text(scaleX(q3, 0, 30), 82, `q₃=${fmt(q3, 0)}`, "lab-text-b", "middle");
    out += text(scaleX(max, 0, 30), 82, fmt(max, 0), "lab-text-small", "middle");

    // Quarter labels above
    out += text(260, 54, "Jeder der 4 Abschnitte enthält ≈ 25 % der Daten", "lab-text-muted", "middle");

    out += rail("q1", "Unteres Quartil q₁", q1, 4, 9, 250);
    out += rail("q3", "Oberes Quartil q₃", q3, 16, 21, 305);
    return out + "</svg>";
  },
  handles: {
    q1: railHandle("q1", 4, 9),
    q3: railHandle("q3", 16, 21),
  },
};

const boxplotCompare: LabView = {
  render(v) {
    const medB = 18 + v.shiftB;
    const halfB = v.spreadB;
    const q1B = medB - halfB;
    const q3B = medB + halfB;
    const minB = Math.max(2, q1B - 4);
    const maxB = Math.min(34, q3B + 4);

    let out = open("Vergleich zweier Datensätze anhand von Boxplots");
    out += title(`Gruppe A (Median 18, IQR 8) vs. Gruppe B (Median ${fmt(medB, 0)}, IQR ${fmt(2 * halfB, 0)})`);

    out += line(55, 200, 465, 200, "lab-axis");
    for (let t = 0; t <= 35; t += 5) {
      const tx = scaleX(t, 0, 35);
      out += line(tx, 195, tx, 205, "lab-axis");
      out += text(tx, 220, fmt(t, 0), "lab-text-tick", "middle");
    }

    out += text(48, 86, "A", "lab-text-a", "end");
    out += drawBoxplot(82, 34, 10, 14, 18, 22, 28, 0, 35, "lab-fill-a lab-side-a", "lab-side-ok");

    out += text(48, 152, "B", "lab-text-b", "end");
    out += drawBoxplot(148, 34, minB, q1B, medB, q3B, maxB, 0, 35, "lab-fill-b lab-side-b", "lab-side-ok");

    out += infoBox(495, 58, [
      [`Median A = 18 · B = ${fmt(medB, 0)}`, medB > 18 ? "lab-text-ok" : medB < 18 ? "lab-text-bad" : "lab-text-small"],
      [`IQR A = 8 · B = ${fmt(2 * halfB, 0)}`, "lab-text-small"],
    ], "end");

    out += rail("shiftB", "Verschiebung Median B", v.shiftB, -4, 6, 255);
    out += rail("spreadB", "Halbe Boxbreite B", v.spreadB, 2, 6, 305);
    return out + "</svg>";
  },
  handles: {
    shiftB: {
      x: "shiftB",
      drag: (p) => ({ shiftB: railValue(p.x, -4, 6) }),
    },
    spreadB: {
      x: "spreadB",
      drag: (p) => ({ spreadB: railValue(p.x, 2, 6) }),
    },
  },
};

export const VIEWS_DATEN: Record<string, LabView> = {
  "median-order": medianOrder,
  "outlier-shift": outlierShift,
  "quartiles-split": quartilesSplit,
  "boxplot-builder": boxplotBuilder,
  "boxplot-compare": boxplotCompare,
};
