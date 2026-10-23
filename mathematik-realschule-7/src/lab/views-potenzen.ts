import type { LabValues } from "../model/types";
import { fmt } from "../exercises/format";
import { decimal, powerText, PREFIXES } from "../powers";
import { handle, line, open, rect, text, type LabView } from "./svg";

function axis(min: number, max: number, y: number, label: string): string {
  let out =
    line(50, y, 470, y, "lab-axis") + text(50, y - 30, label, "lab-text-small");
  for (let value = min; value <= max; value++) {
    const x = position(value, min, max);
    out +=
      line(x, y - 5, x, y + 5, "lab-axis") +
      text(x, y + 23, fmt(value, 0), "lab-text-tick", "middle");
  }
  return out;
}
const position = (value: number, min: number, max: number) =>
  50 + ((value - min) / (max - min)) * 420;
const inverse = (x: number, min: number, max: number) =>
  min + ((x - 50) / 420) * (max - min);

const reciprocal: LabView = {
  render(v) {
    let out = open(
      "Potenzleiter mit ganzzahligen Exponenten; links wird durch die Basis geteilt",
    );
    out += text(
      260,
      42,
      `${powerText(v.a, v.n)} = ${decimal(v.a ** v.n)}`,
      "lab-text-big",
      "middle",
    );
    out += text(
      260,
      78,
      "Ein Schritt nach links: durch die Basis teilen",
      "lab-text-small",
      "middle",
    );
    out += axis(-4, 3, 166, "Exponent n");
    for (let n = -4; n <= 3; n++) {
      const x = position(n, -4, 3);
      out += text(x, 225, powerText(v.a, n), "lab-text", "middle");
      out += text(
        x,
        254,
        n < 0 ? `1/${v.a ** -n}` : String(v.a ** n),
        "lab-text-small",
        "middle",
      );
    }
    out += handle("n", position(v.n, -4, 3), 166, "Exponent n");
    out += text(
      260,
      310,
      "Gegensätzliche Exponenten: ihr Produkt ist 1",
      "lab-text-small",
      "middle",
    );
    return out + "</svg>";
  },
  handles: { n: { x: "n", drag: (p) => ({ n: inverse(p.x, -4, 3) }) } },
};

const sameBase: LabView = {
  render(v, r) {
    let out = open(
      "Exponenten m und n beim Multiplizieren und Dividieren von Potenzen gleicher Basis",
    );
    out += text(
      260,
      40,
      `x${powerText("", v.m)} ${v.op === 0 ? "·" : ":"} x${powerText("", v.n)} = x${powerText("", Number(r.exponent))}`,
      "lab-text-big",
      "middle",
    );
    out += text(
      260,
      73,
      `Ergebnisexponent: ${fmt(v.m, 0)} ${v.op === 0 ? "+" : "−"} (${fmt(v.n, 0)}) = ${fmt(Number(r.exponent), 0)}`,
      "lab-text",
      "middle",
    );
    out += axis(-3, 4, 142, "m") + axis(-3, 4, 245, "n");
    out +=
      handle("m", position(v.m, -3, 4), 142, "Exponent m") +
      handle("n", position(v.n, -3, 4), 245, "Exponent n");
    out += text(
      260,
      319,
      "Die Basis x bleibt gleich. Es gilt x ≠ 0.",
      "lab-text-small",
      "middle",
    );
    return out + "</svg>";
  },
  handles: {
    m: { x: "m", drag: (p) => ({ m: inverse(p.x, -3, 4) }) },
    n: { x: "n", drag: (p) => ({ n: inverse(p.x, -3, 4) }) },
  },
};

const powerRules: LabView = {
  render(v, r) {
    let out = open(
      "Vergleich der Potenzgesetze bei gleichen Exponenten und verschachtelten Potenzen",
    );
    const before =
      v.op === 2
        ? `(${powerText(v.a, v.m)})${powerText("", v.n)}`
        : `${powerText(v.a, v.n)} ${v.op === 0 ? "·" : ":"} ${powerText(v.b, v.n)}`;
    const result =
      v.op === 2
        ? `${powerText(v.a, v.m * v.n)}`
        : `(${v.a} ${v.op === 0 ? "·" : ":"} ${v.b})${powerText("", v.n)}`;
    out += rect(30, 20, 460, 105, "lab-panel", 'rx="10"');
    out += text(260, 53, `${before} = ${result}`, "lab-text-big", "middle");
    out += text(
      260,
      86,
      `Beide Seiten haben den Wert ${String(r.value)}`,
      "lab-text-small",
      "middle",
    );
    if (v.op === 2) {
      out +=
        axis(-3, 3, 182, "innerer Exponent m") +
        handle("m", position(v.m, -3, 3), 182, "Innerer Exponent m");
    } else {
      out += text(
        260,
        185,
        "Gleicher Exponent: die Basen zusammenfassen",
        "lab-text",
        "middle",
      );
    }
    out += axis(
      -3,
      3,
      274,
      v.op === 2 ? "äußerer Exponent n" : "gemeinsamer Exponent n",
    );
    out += handle("n", position(v.n, -3, 3), 274, "Exponent n");
    return out + "</svg>";
  },
  handles: {
    m: { x: "m", drag: (p) => ({ m: inverse(p.x, -3, 3) }) },
    n: { x: "n", drag: (p) => ({ n: inverse(p.x, -3, 3) }) },
  },
};

const decimalScale: LabView = {
  render(v) {
    let out = open(
      "Zehnerpotenzleiter und Dezimaldarstellung einer positiven Zahl",
    );
    out += text(
      260,
      42,
      `${fmt(v.a, 1)} · ${powerText(10, v.n)}`,
      "lab-text-big",
      "middle",
    );
    out += text(260, 87, `= ${decimal(v.a * 10 ** v.n)}`, "lab-text", "middle");
    out += line(50, 187, 470, 187, "lab-axis");
    for (let n = -9; n <= 9; n++) {
      const x = position(n, -9, 9);
      out += line(x, 181, x, 193, "lab-axis");
      if (n % 3 === 0)
        out += text(x, 222, powerText(10, n), "lab-text-small", "middle");
    }
    out += handle("n", position(v.n, -9, 9), 187, "Exponent n");
    out += text(
      260,
      275,
      "Links: kleinere Stellenwerte. Rechts: größere.",
      "lab-text-small",
      "middle",
    );
    out += text(
      260,
      308,
      "Faktor a liegt zwischen 1 einschließlich und 10 ausschließlich.",
      "lab-text-small",
      "middle",
    );
    return out + "</svg>";
  },
  handles: { n: { x: "n", drag: (p) => ({ n: inverse(p.x, -9, 9) }) } },
};

function prefixAxis(y: number, label: string): string {
  let out =
    line(50, y, 470, y, "lab-axis") + text(50, y - 38, label, "lab-text-small");
  PREFIXES.forEach((prefix, i) => {
    const x = position(i, 0, PREFIXES.length - 1);
    out += line(x, y - 4, x, y + 4, "lab-axis");
    out += text(x, y + 22, `${prefix.symbol}m`, "lab-text-tick", "middle");
  });
  return out;
}
const prefixIndex = (exponent: number) =>
  PREFIXES.findIndex((p) => p.exponent === exponent);
const prefixDrag = (key: "from" | "to", x: number): Partial<LabValues> => {
  const index = Math.max(
    0,
    Math.min(
      PREFIXES.length - 1,
      Math.round(inverse(x, 0, PREFIXES.length - 1)),
    ),
  );
  return { [key]: PREFIXES[index].exponent };
};
const prefixScale: LabView = {
  render(v) {
    const from = PREFIXES.find((p) => p.exponent === v.from)!;
    const to = PREFIXES.find((p) => p.exponent === v.to)!;
    let out = open(
      "Vorsilbenleiter, Quelleinheit und Zieleinheit; gleiche Abstände zeigen Tabellenpositionen, keine Längenskala",
    );
    out += text(
      260,
      34,
      `${v.amount} ${from.symbol}m = ${v.amount} · ${powerText(10, v.from - v.to)} ${to.symbol}m`,
      "lab-text-big",
      "middle",
    );
    out += text(
      260,
      65,
      `Exponent: ${fmt(v.from, 0)} − (${fmt(v.to, 0)}) = ${fmt(v.from - v.to, 0)}`,
      "lab-text-small",
      "middle",
    );
    out += prefixAxis(150, "Quelleinheit") + prefixAxis(261, "Zieleinheit");
    out += handle(
      "from",
      position(prefixIndex(v.from), 0, PREFIXES.length - 1),
      150,
      "Quelleinheit",
    );
    out += handle(
      "to",
      position(prefixIndex(v.to), 0, PREFIXES.length - 1),
      261,
      "Zieleinheit",
    );
    out += text(
      260,
      320,
      "Vorsilbentabelle; keine maßstäbliche Längenskala",
      "lab-text-small",
      "middle",
    );
    return out + "</svg>";
  },
  handles: {
    from: { x: "from", drag: (p) => prefixDrag("from", p.x) },
    to: { x: "to", drag: (p) => prefixDrag("to", p.x) },
  },
};

export const POTENZEN_VIEWS = {
  reciprocal,
  "same-base": sameBase,
  "power-rules": powerRules,
  "decimal-scale": decimalScale,
  "prefix-scale": prefixScale,
};
