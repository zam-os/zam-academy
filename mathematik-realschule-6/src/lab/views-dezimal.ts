import { fmt } from "../exercises/format";
import { expansion } from "../models";
import { arrow, circle, line, open, rect, text, type LabView } from "./svg";
import { rail, railHandle, title } from "./view-helpers";

const placeValue: LabView = {
  render(v, r) {
    const labels = ["E", "z", "h", "t"];
    const digits = [v.e, v.a, v.b, v.c];
    const names = ["Einer", "Zehntel", "Hundertstel", "Tausendstel"];
    let out = open("Stellenwerttafel mit Einern und drei Stellen nach dem Komma") + title(`Zahl: ${r.number}`);
    labels.forEach((label, i) => {
      const x = 80 + i * 92;
      out +=
        rect(x, 60, 86, 40, "lab-panel") +
        text(x + 43, 86, label, "lab-text", "middle") +
        rect(x, 100, 86, 66, digits[i] > 0 ? "lab-fill-a" : "lab-cell") +
        text(x + 43, 143, String(digits[i]), "lab-text-big", "middle") +
        text(x + 43, 186, names[i], "lab-text-tick", "middle");
    });
    out += circle(80 + 92 - 3, 150, 4, "lab-dot-small");
    return (
      out +
      text(260, 228, `= ${v.e} + ${v.a}/10 + ${v.b}/100 + ${v.c}/1000`, "lab-text", "middle") +
      text(260, 256, `Als gekürzter Bruch: ${r.fraction}`, "lab-text-small", "middle") +
      "</svg>"
    );
  },
};

const longDivision: LabView = {
  render(v, r) {
    const e = expansion(v.z, v.n);
    let out = open(`Schriftliche Division ${v.z} durch ${v.n}`) + title(`${v.z} : ${v.n} = ${r.decimal}`);
    let rest = v.z % v.n;
    const lines: string[] = [`${v.z} : ${v.n} = ${e.integer}, Rest ${rest}`];
    for (let i = 0; i < 5 && rest !== 0; i++) {
      const next = rest * 10;
      const digit = Math.floor(next / v.n);
      const after = next % v.n;
      lines.push(`${next} : ${v.n} = ${digit}, Rest ${after}`);
      rest = after;
    }
    lines.forEach((content, i) => {
      out += text(70, 62 + i * 27, content, "lab-text");
    });
    out += text(70, 240, e.period ? `Ein Rest wiederholt sich: Die Ziffern ${e.period} kehren immer wieder.` : "Der Rest wird 0: Die Dezimalzahl ist endlich.", "lab-text-small");
    return out + rail("n", "Nenner", v.n, 2, 16, 300) + "</svg>";
  },
  handles: { n: railHandle("n", 2, 16) },
};

const rounding: LabView = {
  render(v, r) {
    const x = Number(r.x);
    const unit = 10 ** -v.place;
    const low = Math.floor(x / unit + 1e-9) * unit;
    const high = low + unit;
    const px = (value: number) => 90 + ((value - low) / unit) * 340;
    const rounded = Number(r.rounded);
    let out =
      open("Die Zahl zwischen den beiden Nachbarn der gewählten Stelle") +
      title(`${fmt(x, 3)} ≈ ${fmt(rounded, v.place)}`) +
      line(60, 160, 460, 160, "lab-axis") +
      line(px(low), 148, px(low), 172, "lab-axis") +
      line(px(high), 148, px(high), 172, "lab-axis") +
      line(px(low + unit / 2), 150, px(low + unit / 2), 170, "lab-dashed") +
      text(px(low), 195, fmt(low, v.place), "lab-text", "middle") +
      text(px(high), 195, fmt(high, v.place), "lab-text", "middle") +
      text(px(low + unit / 2), 218, "Mitte", "lab-text-tick", "middle") +
      circle(px(x), 160, 7, "lab-point-a");
    out += arrow(px(x), 130, px(rounded), 130, "lab-curve", 2);
    return (
      out +
      text(px(x), 118, fmt(x, 3), "lab-text-a", "middle") +
      text(260, 262, x - low >= unit / 2 - 1e-9 ? "Ab der Mitte wird aufgerundet." : "Vor der Mitte wird abgerundet.", "lab-text-small", "middle") +
      "</svg>"
    );
  },
};

const decimalAdd: LabView = {
  render(v, r) {
    const px = (value: number) => 60 + (value / 12) * 400;
    const result = Number(r.result);
    let out =
      open("Rechnung auf der Zahlengeraden und mit Komma unter Komma") +
      title(`${fmt(v.a)} ${v.op === 0 ? "+" : "−"} ${fmt(v.b)} = ${fmt(result)}`) +
      line(50, 120, 470, 120, "lab-axis");
    for (let t = 0; t <= 12; t += 1) {
      out += line(px(t), 112, px(t), 128, "lab-axis") + text(px(t), 146, String(t), "lab-text-tick", "middle");
    }
    out += arrow(px(0), 95, px(v.a), 95, "lab-curve", 2.5);
    out += arrow(px(v.a), 75, px(Math.max(0, Math.min(12, result))), 75, "lab-curve-2", 2.5);
    const pad = (n: number) => n.toFixed(2).replace(".", ",");
    return (
      out +
      rect(180, 170, 160, 84, "lab-panel") +
      text(320, 194, pad(v.a), "lab-text", "end") +
      text(320, 216, `${v.op === 0 ? "+" : "−"} ${pad(v.b)}`, "lab-text", "end") +
      line(195, 224, 325, 224, "lab-axis") +
      text(320, 246, pad(Math.abs(result)).replace(/^/, result < 0 ? "−" : ""), "lab-text", "end") +
      rail("b", "Zweite Zahl", v.b, 0, 6, 305) +
      "</svg>"
    );
  },
  handles: { b: railHandle("b", 0, 6) },
};

const decimalMult: LabView = {
  render(v, r) {
    const size = 110;
    const x = 40;
    const y = 50;
    let out =
      open("Flächenmodell: Dezimalzahl mal Dezimalzahl in Einheitsquadraten") +
      title(`${fmt(v.a, 1)} · ${fmt(v.b, 1)} = ${fmt(Number(r.product), 2)}`);
    for (let i = 0; i < 2; i++)
      for (let j = 0; j < 2; j++)
        out += rect(x + i * size, y + j * size, size, size, "lab-cell");
    out += rect(x, y, v.a * size, v.b * size, "lab-fill-b");
    return (
      out +
      text(285, 90, `Jedes Quadrat hat die Fläche 1.`, "lab-text-small") +
      text(285, 118, `${Math.round(v.a * 10)} Zehntel · ${Math.round(v.b * 10)} Zehntel`, "lab-text-small") +
      text(285, 146, `= ${Math.round(v.a * 10) * Math.round(v.b * 10)} Hundertstel`, "lab-text-small") +
      text(285, 186, `Zwei Stellen nach dem Komma:`, "lab-text-small") +
      text(285, 212, `${fmt(Number(r.product), 2)}`, "lab-text") +
      "</svg>"
    );
  },
};

const signLine: LabView = {
  render(v, r) {
    const px = (value: number) => 260 + value * 18;
    const result = Number(r.result);
    const ok = Number.isFinite(result);
    let out =
      open("Rechnung mit Vorzeichen auf der Zahlengeraden") +
      title(String(r.term)) +
      line(30, 170, 490, 170, "lab-axis");
    for (let t = -12; t <= 12; t += 2) {
      out += line(px(t), 162, px(t), 178, "lab-axis") + text(px(t), 196, fmt(t), "lab-text-tick", "middle");
    }
    const clampLine = (value: number) => px(Math.max(-12.5, Math.min(12.5, value)));
    out += circle(clampLine(v.a), 170, 6, "lab-point-a") + text(clampLine(v.a), 150, "a", "lab-text-a", "middle");
    if (ok) {
      out += arrow(clampLine(v.a), 125, clampLine(result), 125, "lab-curve", 2.5);
      out += circle(clampLine(result), 170, 7, "lab-point-b") + text(clampLine(result), 225, fmt(result), "lab-text-b", "middle");
    }
    return (
      out +
      text(260, 262, String(r.rule), "lab-text-small", "middle") +
      rail("b", "b", v.b, -6, 6, 305) +
      "</svg>"
    );
  },
  handles: { b: railHandle("b", -6, 6) },
};

const laws: LabView = {
  render(v, r) {
    const unit = 32;
    const x = 40;
    const y = 60;
    const h = v.a * unit;
    return (
      open("Distributivgesetz als Rechteckfläche") +
      title(`${fmt(v.a)} · (${v.b} + ${v.c}) = ${fmt(Number(r.left))}`) +
      rect(x, y, v.b * unit * 0.85, h, "lab-fill-a") +
      rect(x + v.b * unit * 0.85, y, v.c * unit * 0.85, h, "lab-fill-b") +
      text(x + (v.b * unit * 0.85) / 2, y - 8, String(v.b), "lab-text-a", "middle") +
      text(x + v.b * unit * 0.85 + (v.c * unit * 0.85) / 2, y - 8, String(v.c), "lab-text-b", "middle") +
      text(x - 8, y + h / 2, fmt(v.a), "lab-text", "end") +
      text(260, 262, `${fmt(v.a)} · ${v.b} + ${fmt(v.a)} · ${v.c} = ${fmt(v.a * v.b)} + ${fmt(v.a * v.c)} = ${fmt(Number(r.right))}`, "lab-text", "middle") +
      rail("b", "b", v.b, 1, 9, 305) +
      "</svg>"
    );
  },
  handles: { b: railHandle("b", 1, 9) },
};

export const DEZIMAL_VIEWS = {
  "place-value": placeValue,
  "long-division": longDivision,
  rounding,
  "decimal-add": decimalAdd,
  "decimal-mult": decimalMult,
  "sign-line": signLine,
  laws,
};
