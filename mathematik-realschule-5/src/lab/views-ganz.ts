import { fmt, paren } from "../exercises/format";
import { arrow, circle, handle, line, open, path, rect, text, type LabView } from "./svg";
import { rail, railHandle, title } from "./view-helpers";

/** A horizontal number line from min to max with labelled whole-number ticks. */
function numberLine(min: number, max: number, y: number, labelEvery = 1, unit = 1): string {
  const span = max - min;
  const x = (n: number) => 40 + (440 * (n - min)) / span;
  let out = arrow(28, y, 495, y, "lab-axis", 1.6);
  for (let n = min; n <= max; n++) {
    const big = n % labelEvery === 0;
    out += line(x(n), big ? y - 8 : y - 4, x(n), big ? y + 8 : y + 4, "lab-axis");
    if (big) out += text(x(n), y + 24, fmt(n * unit, 0), n === 0 ? "lab-text" : "lab-text-tick", "middle");
  }
  return out;
}
const lineX = (n: number, min: number, max: number) => 40 + (440 * (n - min)) / (max - min);

const CONTEXTS = ["°C", "€", "Stockwerk"];
const thermometer: LabView = {
  render(v) {
    const y = (t: number) => 210 - t * 4.8;
    let out = open("Senkrechte Skala mit positiven und negativen Zahlen") + title(["Temperatur", "Kontostand", "Stockwerke"][v.ctx]);
    for (let t = -20; t <= 30; t += 5) {
      out += line(150, y(t), t % 10 === 0 ? 172 : 164, y(t), "lab-axis");
      if (t % 10 === 0) out += text(142, y(t) + 4, fmt(t, 0), t === 0 ? "lab-text" : "lab-text-tick", "end");
    }
    out +=
      rect(160, Math.min(y(0), y(v.t)), 18, Math.abs(v.t) * 4.8, v.t < 0 ? "lab-bar-b" : "lab-bar-a") +
      line(150, y(0), 340, y(0), "lab-dashed") +
      text(346, y(0) + 4, "Null", "lab-text-small") +
      text(300, 70, `${fmt(v.t, 0)} ${CONTEXTS[v.ctx]}`, "lab-text-big", "middle") +
      text(300, 95, v.t < 0 ? "unter der Null" : v.t > 0 ? "über der Null" : "genau null", "lab-text", "middle") +
      handle("t", 169, y(v.t), "Wert ziehen");
    return out + "</svg>";
  },
  handles: { t: { y: "t", drag: (p) => ({ t: (210 - p.y) / 4.8 }) } },
};

const opposite: LabView = {
  render(v) {
    const x = (n: number) => lineX(n, -20, 20);
    const y = 150;
    let out = open("Zahl und Gegenzahl auf der Zahlengeraden") + title("Zahl und Gegenzahl haben denselben Abstand zur Null") + numberLine(-20, 20, y, 5);
    if (v.z !== 0) {
      const r = Math.abs(x(v.z) - x(0));
      out +=
        path(`M${x(0)} ${y} A${r / 2} ${r / 2} 0 0 ${v.z > 0 ? 1 : 0} ${x(v.z)} ${y}`, "lab-curve") +
        text((x(0) + x(v.z)) / 2, y - r / 2 - 8, `Betrag ${Math.abs(v.z)}`, "lab-text-a", "middle") +
        circle(x(-v.z), y, 7, "lab-point-b") +
        text(x(-v.z), y + 44, `Gegenzahl ${fmt(-v.z, 0)}`, "lab-text-b", "middle");
    } else out += text(260, y + 50, "Die Null ist ihre eigene Gegenzahl.", "lab-text", "middle");
    return out + handle("z", x(v.z), y, "Zahl ziehen") + "</svg>";
  },
  handles: { z: { x: "z", drag: (p) => ({ z: -20 + ((p.x - 40) * 40) / 440 }) } },
};

const INT_SCALES = [1, 5, 10, 100];
const integerLine: LabView = {
  render(v) {
    const scale = INT_SCALES[v.scale];
    const x = (k: number) => lineX(k, -10, 10);
    const a = v.a * scale;
    const b = v.b * scale;
    const sign = a < b ? "<" : a > b ? ">" : "=";
    return (
      open("Zahlengerade mit zwei Punkten") +
      title(`Ein Strich bedeutet ${fmt(scale, 0)}`) +
      numberLine(-10, 10, 150, 5, scale) +
      text(x(v.a), 108, `a = ${fmt(a, 0)}`, "lab-text-a", "middle") +
      text(x(v.b), 90, `b = ${fmt(b, 0)}`, "lab-text-b", "middle") +
      text(260, 240, `${fmt(a, 0)} ${sign} ${fmt(b, 0)}`, "lab-text-big", "middle") +
      handle("a", x(v.a), 150, "Punkt a ziehen", "lab-handle lab-handle-a") +
      handle("b", x(v.b), 150, "Punkt b ziehen", "lab-handle lab-handle-b") +
      "</svg>"
    );
  },
  handles: {
    a: { x: "a", drag: (p) => ({ a: -10 + ((p.x - 40) * 20) / 440 }) },
    b: { x: "b", drag: (p) => ({ b: -10 + ((p.x - 40) * 20) / 440 }) },
  },
};

const intAdd: LabView = {
  render(v) {
    const change = v.op === 0 ? v.b : -v.b;
    const end = v.a + change;
    const x = (n: number) => lineX(n, -30, 30);
    const y = 170;
    return (
      open("Rechnung als Pfeil auf der Zahlengeraden") +
      title(`${paren(v.a, 0)} ${v.op === 0 ? "+" : "−"} ${paren(v.b, 0)} = ${fmt(end, 0)}`) +
      numberLine(-30, 30, y, 10) +
      (change !== 0 ? arrow(x(v.a), y - 34, x(end), y - 34, change > 0 ? "lab-curve" : "lab-curve-2", 3) : "") +
      circle(x(v.a), y, 6, "lab-point-a") +
      circle(x(end), y, 6, "lab-point-ok") +
      text(260, 70, v.op === 1 && v.b < 0 ? `Minus (${fmt(v.b, 0)}) wirkt wie plus ${fmt(-v.b, 0)}.` : v.op === 0 && v.b < 0 ? `Plus (${fmt(v.b, 0)}) wirkt wie minus ${fmt(-v.b, 0)}.` : `Der Pfeil zeigt nach ${change >= 0 ? "rechts" : "links"}.`, "lab-text", "middle") +
      rail("a", "Startzahl", v.a, -15, 15, 290) +
      "</svg>"
    );
  },
  handles: { a: railHandle("a", -15, 15) },
};

const intMult: LabView = {
  render(v) {
    const dividend = v.a * v.b;
    const value = v.op === 0 ? dividend : v.a;
    const row = (signs: string, res: string, on: boolean, y: number) =>
      rect(150, y, 220, 28, on ? "lab-fill-ok" : "lab-cell", 'rx="6"') +
      text(190, y + 19, signs, "lab-text") +
      text(330, y + 19, res, on ? "lab-text-ok" : "lab-text-muted", "middle");
    const pa = v.op === 0 ? v.a : dividend;
    const pb = v.b;
    const nA = pa < 0;
    const nB = pb < 0;
    return (
      open("Vorzeichenregeln mit markierter Zeile") +
      title(
        v.op === 0
          ? `${paren(v.a, 0)} · ${paren(v.b, 0)} = ${fmt(value, 0)}`
          : v.b === 0
            ? "Durch 0 darfst du nicht teilen."
            : `${paren(dividend, 0)} : ${paren(v.b, 0)} = ${fmt(value, 0)}`,
      ) +
      text(190, 62, "Vorzeichen", "lab-text-small") +
      text(330, 62, "Ergebnis", "lab-text-small", "middle") +
      row("plus, plus", "plus", pa !== 0 && pb !== 0 && !nA && !nB, 70) +
      row("minus, minus", "plus", pa !== 0 && pb !== 0 && nA && nB, 104) +
      row("plus, minus", "minus", pa !== 0 && pb !== 0 && !nA && nB, 138) +
      row("minus, plus", "minus", pa !== 0 && pb !== 0 && nA && !nB, 172) +
      text(260, 228, "Gleiche Vorzeichen: plus. Verschiedene Vorzeichen: minus.", "lab-text", "middle") +
      rail("a", "a", v.a, -12, 12, 295) +
      "</svg>"
    );
  },
  handles: { a: railHandle("a", -12, 12) },
};

/** The worked steps of the three integer terms. */
export function intTermSteps(term: number, a: number, b: number, d: number) {
  if (term === 1)
    return { text: `(${fmt(a, 0)} + ${paren(b, 0)}) · ${paren(d, 0)}`, steps: [`${paren(a + b, 0)} · ${paren(d, 0)}`, fmt((a + b) * d, 0)], value: (a + b) * d };
  if (term === 2)
    return { text: `${fmt(a, 0)} − ${paren(b, 0)} · ${paren(d, 0)}`, steps: [`${fmt(a, 0)} − ${paren(b * d, 0)}`, fmt(a - b * d, 0)], value: a - b * d };
  return { text: `${fmt(a, 0)} + ${paren(b, 0)} · ${paren(d, 0)}`, steps: [`${fmt(a, 0)} + ${paren(b * d, 0)}`, fmt(a + b * d, 0)], value: a + b * d };
}

const intMixed: LabView = {
  render(v) {
    const t = intTermSteps(v.term, v.a, v.b, v.d);
    return (
      open("Rechenschritte mit ganzen Zahlen") +
      title("Punkt vor Strich gilt auch hier") +
      text(260, 80, t.text, "lab-text-big", "middle") +
      t.steps.map((step, i) => text(260, 118 + i * 30, `= ${step}`, "lab-text", "middle")).join("") +
      rail("a", "a", v.a, -20, 20, 290) +
      "</svg>"
    );
  },
  handles: { a: railHandle("a", -20, 20) },
};

export const GANZ_VIEWS: Record<string, LabView> = {
  thermometer,
  opposite,
  "integer-line": integerLine,
  "int-add": intAdd,
  "int-mult": intMult,
  "int-mixed": intMixed,
};
