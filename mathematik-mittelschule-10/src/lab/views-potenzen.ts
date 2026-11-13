import { fmt, supText } from "../exercises/format";
import {
  arrow,
  circle,
  clipped,
  handle,
  infoBox,
  line,
  open,
  Plot,
  rect,
  text,
  type LabView,
} from "./svg";
import { legendRow, title } from "./view-helpers";

/** "(−2)³" for a negative or fractional base, "2³" otherwise. */
export function powText(b: number, n: number): string {
  const base = b < 0 || !Number.isInteger(b) ? `(${fmt(b)})` : fmt(b);
  return `${base}${supText(n)}`;
}

// 1.1 Potenzen mit beliebiger Basis: n gleiche Faktoren.
const powerChain: LabView = {
  render(v) {
    const value = v.b ** v.n;
    let out = open(`${powText(v.b, v.n)} = ${fmt(value, 4)}`) + title(`${powText(v.b, v.n)} = ${Array.from({ length: v.n }, () => (v.b < 0 ? `(${fmt(v.b)})` : fmt(v.b))).join(" · ")} = ${fmt(value, 4)}`);
    const w = Math.min(54, 440 / v.n);
    for (let i = 0; i < v.n; i++) {
      const x = 40 + i * w;
      out += rect(x, 70, w - 10, 40, v.b < 0 ? "lab-fill-b" : "lab-fill-a", 'rx="6"');
      out += text(x + (w - 10) / 2, 96, fmt(v.b), "lab-text", "middle");
      if (i < v.n - 1) out += text(x + w - 5, 96, "·", "lab-text", "middle");
    }
    out += text(40, 140, "Zwischenergebnisse:", "lab-text-small");
    for (let k = 1; k <= v.n; k++) {
      const partial = v.b ** k;
      const y = 160 + (k - 1) * 18;
      out += text(60, y, `${powText(v.b, k)} = ${fmt(partial, 4)}`, partial < 0 ? "lab-text-b" : "lab-text-a");
    }
    out += infoBox(300, 160, [
      [`Basis ${fmt(v.b)}`, "lab-text"],
      [`Exponent ${v.n}`, "lab-text"],
      [`Potenzwert ${fmt(value, 4)}`, value < 0 ? "lab-text-b" : "lab-text-ok"],
      [v.b < 0 ? (v.n % 2 === 0 ? "gerader Exponent: positiv" : "ungerader Exponent: negativ") : "positive Basis: positiv", "lab-text-small"],
    ]);
    out += legendRow(300, 290, [
      ["lab-fill-a", "positiver Faktor"],
      ["lab-fill-b", "negativer Faktor"],
    ]);
    return out + "</svg>";
  },
};

/** The five power laws of lesson 1.2. */
export const RULES = [
  "aᵐ · aⁿ (gleiche Basis)",
  "aᵐ : aⁿ (gleiche Basis)",
  "(aᵐ)ⁿ (Potenz einer Potenz)",
  "aⁿ · bⁿ (gleicher Exponent)",
  "aⁿ : bⁿ (gleicher Exponent)",
];

/** The result of a law as text. */
export function ruleResult(rule: number, m: number, n: number): string {
  if (rule === 0) return `a${supText(m + n)}`;
  if (rule === 1) return m === n ? "a⁰ = 1" : `a${supText(m - n)}`;
  if (rule === 2) return `a${supText(m * n)}`;
  if (rule === 3) return `(a · b)${supText(n)}`;
  return `(a : b)${supText(n)}`;
}

// 1.2 Potenzgesetze: Faktoren zählen.
const powerRules: LabView = {
  render(v) {
    let out = open(`Potenzgesetz ${RULES[v.rule]} mit m = ${v.m}, n = ${v.n}: ${ruleResult(v.rule, v.m, v.n)}`) + title(`${RULES[v.rule]}: Ergebnis ${ruleResult(v.rule, v.m, v.n)}`);
    const box = (x: number, y: number, label: string, cls: string, crossed = false) =>
      rect(x, y, 30, 30, cls, 'rx="4"') + text(x + 15, y + 20, label, "lab-text", "middle") + (crossed ? line(x + 2, y + 28, x + 28, y + 2, "lab-bad-stroke") : "");
    if (v.rule === 0) {
      for (let i = 0; i < v.m; i++) out += box(30 + i * 34, 70, "a", "lab-fill-a");
      for (let i = 0; i < v.n; i++) out += box(30 + (v.m + i) * 34 + 20, 70, "a", "lab-fill-b");
      out += text(30, 140, `${v.m} Faktoren a und ${v.n} Faktoren a: zusammen ${v.m + v.n}`, "lab-text");
    } else if (v.rule === 1) {
      const cancel = Math.min(v.m, v.n);
      for (let i = 0; i < v.m; i++) out += box(30 + i * 34, 70, "a", "lab-fill-a", i < cancel);
      out += line(24, 116, 30 + Math.max(v.m, v.n) * 34, 116, "lab-ink");
      for (let i = 0; i < v.n; i++) out += box(30 + i * 34, 124, "a", "lab-fill-b", i < cancel);
      out += text(30, 190, v.m === v.n ? "Alles kürzt sich weg: a⁰ = 1" : v.m > v.n ? `Oben bleiben ${v.m - v.n} Faktoren` : `Unten bleiben ${v.n - v.m} Faktoren: a${supText(v.m - v.n)} = 1 : a${supText(v.n - v.m)}`, "lab-text");
    } else if (v.rule === 2) {
      for (let g = 0; g < v.n; g++)
        for (let i = 0; i < v.m; i++) out += box(30 + i * 34 + (g % 2) * 230, 60 + Math.floor(g / 2) * 40, "a", g % 2 === 0 ? "lab-fill-a" : "lab-fill-c");
      out += text(30, 60 + Math.ceil(v.n / 2) * 40 + 20, `${v.n} Gruppen zu je ${v.m} Faktoren: ${v.m * v.n}`, "lab-text");
    } else {
      for (let i = 0; i < v.n; i++) {
        const x = 30 + i * 70;
        out += box(x, 70, "a", "lab-fill-a") + box(x + 32, 70, "b", "lab-fill-b");
        out += rect(x - 3, 67, 68, 36, "lab-ghost", 'rx="6"');
        out += text(x + 31, 64, v.rule === 3 ? "a · b" : "a : b", "lab-text-small", "middle");
      }
      out += text(30, 140, `${v.n} Paare (a ${v.rule === 3 ? "·" : ":"} b): (a ${v.rule === 3 ? "·" : ":"} b)${supText(v.n)}`, "lab-text");
    }
    out += infoBox(300, 250, [[`Ergebnis: ${ruleResult(v.rule, v.m, v.n)}`, "lab-text-ok"]]);
    return out + "</svg>";
  },
};

// 1.3 Negative Exponenten: die Potenzleiter.
const powerLadder: LabView = {
  render(v) {
    const value = v.base ** v.e;
    let out = open(`${v.base}${supText(v.e)} = ${v.e < 0 ? `1/${v.base ** -v.e}` : fmt(value, 4)}`) + title(`${v.base}${supText(v.e)} = ${v.e < 0 ? `1 : ${v.base}${supText(-v.e)} = 1/${fmt(v.base ** -v.e)} = ${fmt(value, 6)}` : fmt(value)}`);
    for (let e = 4; e >= -4; e--) {
      const y = 48 + (4 - e) * 31;
      const on = e === v.e;
      out += rect(150, y, 170, 26, on ? "lab-fill-ok" : e < 0 ? "lab-fill-b" : e === 0 ? "lab-fill-c" : "lab-fill-a", 'rx="5"');
      out += text(165, y + 18, `${v.base}${supText(e)}`, "lab-text");
      out += text(305, y + 18, e < 0 ? `1/${fmt(v.base ** -e)}` : fmt(v.base ** e), "lab-text", "end");
    }
    out += arrow(120, 300, 120, 60, "lab-side-a", 2);
    out += text(112, 180, `· ${v.base}`, "lab-text-a", "end");
    out += arrow(350, 60, 350, 300, "lab-side-b", 2);
    out += text(358, 180, `: ${v.base}`, "lab-text-b");
    out += infoBox(390, 110, [
      ["a⁰ = 1", "lab-text-c"],
      ["a⁻ⁿ = 1 : aⁿ", "lab-text-b"],
    ]);
    return out + "</svg>";
  },
};

// 1.4 Potenzieren und Radizieren: zwei Pfeile, die sich aufheben.
const rootInverse: LabView = {
  render(v) {
    const a = v.b ** v.n;
    let out = open(`${fmt(v.b)}${supText(v.n)} = ${fmt(a, 4)} und ${v.n}-te Wurzel aus ${fmt(a, 4)} = ${fmt(v.b)}`) + title(`${fmt(v.b)}${supText(v.n)} = ${fmt(a, 4)}  ⇔  ${v.n === 2 ? "" : supText(v.n)}√${fmt(a, 4)} = ${fmt(v.b)}`);
    out += rect(40, 70, 120, 50, "lab-fill-a", 'rx="10"') + text(100, 102, fmt(v.b), "lab-text-big", "middle");
    out += rect(330, 70, 150, 50, "lab-fill-b", 'rx="10"') + text(405, 102, fmt(a, 4), "lab-text-big", "middle");
    out += arrow(170, 82, 320, 82, "lab-side-a", 2.5) + text(245, 74, `hoch ${v.n} (potenzieren)`, "lab-text-a", "middle");
    out += arrow(320, 112, 170, 112, "lab-side-b", 2.5) + text(245, 132, `${v.n}-te Wurzel (radizieren)`, "lab-text-b", "middle");
    // A square for n = 2, a cube for n = 3.
    const s = Math.min(90, 20 * v.b + 10);
    if (v.n === 2) {
      out += rect(60, 170, s, s, "lab-fill-a") + text(60 + s / 2, 170 + s + 16, `Seite ${fmt(v.b)}`, "lab-text-small", "middle") + text(60 + s + 10, 170 + s / 2, `Fläche ${fmt(a)}`, "lab-text-small");
    } else if (v.n === 3) {
      const d = s * 0.35;
      out += rect(60, 170 + d, s, s, "lab-fill-a");
      out += `<polygon points="${60},${170 + d} ${60 + d},${170} ${60 + s + d},${170} ${60 + s},${170 + d}" class="lab-fill-c"/>`;
      out += `<polygon points="${60 + s},${170 + d} ${60 + s + d},${170} ${60 + s + d},${170 + s} ${60 + s},${170 + s + d}" class="lab-fill-c"/>`;
      out += text(60 + s / 2, 170 + s + d + 16, `Kante ${fmt(v.b)}`, "lab-text-small", "middle") + text(60 + s + d + 10, 170 + s / 2, `Volumen ${fmt(a)}`, "lab-text-small");
    } else out += text(60, 220, `${v.n} gleiche Faktoren ${fmt(v.b)} ergeben ${fmt(a, 4)}.`, "lab-text");
    out += infoBox(330, 190, [
      [`${v.n === 2 ? "" : supText(v.n)}√${fmt(a, 4)} = ${fmt(v.b)}`, "lab-text-b"],
      [`denn ${fmt(v.b)}${supText(v.n)} = ${fmt(a, 4)}`, "lab-text-a"],
    ]);
    return out + "</svg>";
  },
};

export const ROOT_BASES = [4, 8, 9, 16, 27, 32, 64, 81, 125];

// 1.5 Wurzeln als Potenzen mit Stammbrüchen.
const rootExponent: LabView = {
  render(v) {
    const value = v.a ** (v.m / v.n);
    let out = open(`${v.a} hoch ${v.m}/${v.n} = ${fmt(value, 4)}`) + title(`${v.a}^(${v.m}/${v.n}) = ${v.n === 2 ? "" : supText(v.n)}√(${v.a}${supText(v.m)}) ≈ ${fmt(value, 4)}`);
    out += text(60, 110, `${v.a}`, "lab-text-big");
    out += text(90, 92, `${v.m}`, "lab-text-a");
    out += line(86, 98, 106, 98, "lab-ink");
    out += text(90, 116, `${v.n}`, "lab-text-b");
    out += text(140, 110, "=", "lab-text-big");
    out += text(170, 104, v.n === 2 ? "" : `${v.n}`, "lab-text-b");
    out += text(180, 112, "√", "lab-text-big");
    out += line(196, 92, 260, 92, "lab-ink");
    out += text(200, 112, `${v.a}`, "lab-text-big");
    out += text(232, 100, `${v.m}`, "lab-text-a");
    out += text(60, 160, "Zähler: hoch nehmen", "lab-text-a");
    out += text(60, 180, "Nenner: Wurzel ziehen", "lab-text-b");
    const root = v.a ** (1 / v.n);
    out += infoBox(300, 80, [
      [`${v.n === 2 ? "" : supText(v.n)}√${v.a} ≈ ${fmt(root, 4)}`, "lab-text-b"],
      [`(${fmt(root, 4)})${supText(v.m)} ≈ ${fmt(value, 4)}`, "lab-text-a"],
      [Math.abs(value - Math.round(value)) < 1e-9 ? "ganze Zahl" : "keine ganze Zahl", "lab-text-ok"],
    ]);
    const plot = new Plot(0, 130, -1, 1, { x: 40, y: 250, w: 440, h: 40 });
    out += line(plot.X(0), 270, plot.X(130), 270, "lab-axis");
    for (let t = 0; t <= 125; t += 25) out += text(plot.X(t), 290, String(t), "lab-text-tick", "middle");
    out += circle(plot.X(Math.min(value, 130)), 270, 6, "lab-point-ok");
    return out + "</svg>";
  },
};

// 1.6 Logarithmus: den Exponenten finden.
const logCurve: LabView = {
  render(v) {
    const value = v.base ** v.x;
    const top = Math.max(2, value * 1.3);
    const plot = new Plot(-3, 10, 0, top, { x: 40, y: 40, w: 300, h: 270 });
    let out = open(`${v.base} hoch ${fmt(v.x)} = ${fmt(value, 4)}, also log zur Basis ${v.base} von ${fmt(value, 4)} = ${fmt(v.x)}`) + title(`${v.base}${v.x < 0 || !Number.isInteger(v.x) ? `^${fmt(v.x)}` : supText(v.x)} = ${fmt(value, 4)}  ⇔  log${v.base === 10 ? "" : subText(v.base)}(${fmt(value, 4)}) = ${fmt(v.x)}`);
    out += plot.clip("log-clip");
    out += rect(plot.box.x, plot.box.y, plot.box.w, plot.box.h, "lab-plot-bg");
    out += line(plot.X(0), plot.box.y, plot.X(0), plot.box.y + plot.box.h, "lab-axis");
    for (let x = -2; x <= 10; x += 2) out += text(plot.X(x), plot.box.y + plot.box.h + 14, fmt(x), "lab-text-tick", "middle");
    out += clipped("log-clip", plot.graph((x) => v.base ** x, "lab-curve", 300));
    const P = plot.P(v.x, value);
    out += line(plot.X(v.x), plot.Y(0), P.x, P.y, "lab-side-a") + line(plot.X(-3), P.y, P.x, P.y, "lab-side-b");
    out += text(P.x + 6, P.y - 6, fmt(value, 4), "lab-text-b");
    out += infoBox(360, 80, [
      [`gesucht: Exponent x`, "lab-text-small"],
      [`${v.base}ˣ = ${fmt(value, 4)}`, "lab-text-b"],
      [`x = ${fmt(v.x)}`, "lab-text-a"],
      ["log = Exponent", "lab-text-ok"],
    ]);
    out += legendRow(360, 220, [["lab-fill-a", "x"]]) + legendRow(360, 240, [["lab-fill-b", "Wert"]]);
    return out + handle("x", P.x, Math.max(plot.box.y, P.y), "Exponent x") + "</svg>";
  },
  handles: { x: { x: "x", drag: (p) => ({ x: -3 + ((p.x - 40) / 300) * 13 }) } },
};

/** An integer as subscript text. */
export function subText(n: number): string {
  const sub = "₀₁₂₃₄₅₆₇₈₉";
  return [...String(n)].map((d) => sub[Number(d)]).join("");
}

export const POTENZEN_VIEWS: Record<string, LabView> = {
  "power-chain": powerChain,
  "power-rules": powerRules,
  "power-ladder": powerLadder,
  "root-inverse": rootInverse,
  "root-exponent": rootExponent,
  "log-curve": logCurve,
};

