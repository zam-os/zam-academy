import { fmt, pow10Text, sciText } from "../exercises/format";
import { decimalString, PREFIXES, sci } from "../models";
import {
  arrow,
  infoBox,
  line,
  open,
  rect,
  text,
  type LabView,
} from "./svg";
import { legendRow, rail, railHandle, title } from "./view-helpers";

/** Exponents shown in the place-value chart, from 10⁹ down to 10⁻⁹. */
const COLUMNS = Array.from({ length: 19 }, (_, i) => 9 - i);

/** The digit of m · 10ᵉ (m with one decimal) in the column of 10ᵏ, or "" for an empty column. */
function digitAt(m: number, e: number, k: number): string {
  const [d1, d2] = String(Math.round(m * 10)).padStart(2, "0");
  if (k === e) return d1;
  if (k === e - 1) return d2 === "0" && k < 0 ? "" : d2;
  if (k > e) return e < 0 && k <= 0 ? "0" : "";
  return k >= 0 ? "0" : "";
}

// 2.1 Die Stellenwerttafel: Das Komma wandert um n Stellen.
const placeValue: LabView = {
  render(v) {
    const cw = 25;
    const x0 = 22;
    const y0 = 92;
    const decimal = decimalString(v.m, v.e);
    let out =
      open(`Stellenwerttafel: ${sciText(v.m, v.e, 1)} = ${decimal}`) +
      title(`${sciText(v.m, v.e, 1)} = ${decimal}`);
    COLUMNS.forEach((k, i) => {
      const x = x0 + i * cw;
      const lead = k === v.e || k === v.e - 1;
      out += rect(x, y0, cw - 2, 34, lead ? "lab-fill-a" : "lab-cell", 'rx="3"');
      out += text(x + cw / 2 - 1, y0 - 8, k === 0 ? "E" : k % 3 === 0 ? pow10Text(k) : "", "lab-text-tick", "middle");
      const digit = digitAt(v.m, v.e, k);
      if (digit !== "")
        out += text(x + cw / 2 - 1, y0 + 23, digit, lead ? "lab-text-a lab-text-big" : "lab-text", "middle");
    });
    // The decimal comma sits right of the ones column.
    const comma = x0 + COLUMNS.indexOf(0) * cw + cw - 1;
    out += line(comma, y0 - 4, comma, y0 + 40, "lab-side-b");
    out += text(comma, y0 + 54, "Komma", "lab-text-b", "middle");
    // Arrow: from the comma of a (after its first digit) to its place in the number.
    const from = x0 + COLUMNS.indexOf(v.e) * cw + cw - 1;
    if (v.e !== 0)
      out += arrow(from, y0 + 72, comma, y0 + 72, "lab-side-c", 2);
    out += text(
      260,
      y0 + 98,
      v.e === 0
        ? "Exponent 0: Das Komma bleibt, wo es ist."
        : v.e > 0
          ? `Exponent ${v.e}: Das Komma wandert ${v.e} ${v.e === 1 ? "Stelle" : "Stellen"} nach rechts.`
          : `Exponent ${fmt(v.e)}: Das Komma wandert ${-v.e} ${v.e === -1 ? "Stelle" : "Stellen"} nach links.`,
      "lab-text-c",
      "middle",
    );
    out += legendRow(70, 228, [
      ["lab-fill-a", "Ziffern der Vorzahl"],
      ["lab-fill-b", "Komma"],
      ["lab-fill-c", "Verschiebung um n Stellen"],
    ]);
    out += text(22, 70, "E = Einer; links große, rechts kleine Stellenwerte", "lab-text-small");
    return out + rail("e", "Exponent n", v.e, -9, 9, 290) + "</svg>";
  },
  handles: { e: railHandle("e", -9, 9) },
};

// 2.2 Rechnen mit Zehnerpotenzen: Vorzahlen malnehmen, Exponenten addieren.
const powerProduct: LabView = {
  render(v) {
    const raw = v.a * v.b;
    const result = sci(raw * 10 ** 0, 6);
    const n = v.m + v.n + result.n;
    let out =
      open(`(${sciText(v.a, v.m, 1)}) · (${sciText(v.b, v.n, 1)}) = ${sciText(result.a, n, 4)}`) +
      title(`(${sciText(v.a, v.m, 1)}) · (${sciText(v.b, v.n, 1)})`);
    // Calculator keys.
    const keys = [fmt(v.a, 1), "EE", fmt(v.m), "×", fmt(v.b, 1), "EE", fmt(v.n), "="];
    keys.forEach((key, i) => {
      const x = 30 + i * 58;
      out += rect(x, 46, 50, 30, key === "EE" ? "lab-fill-c" : key === "×" || key === "=" ? "lab-fill-b" : "lab-fill-a", 'rx="6"');
      out += text(x + 25, 66, key, "lab-text", "middle");
    });
    out += rect(110, 90, 300, 40, "lab-panel", 'rx="6"');
    out += text(400, 117, `${fmt(result.a, 4)} E ${fmt(n)}`, "lab-text-big", "end");
    out += text(120, 106, "Anzeige", "lab-text-small");
    // Exponent ruler from −12 to 18.
    const X = (k: number) => 40 + ((k + 12) / 30) * 440;
    const y = 200;
    out += line(X(-12), y, X(18), y, "lab-axis");
    for (let k = -12; k <= 18; k += 3) {
      out += line(X(k), y - 4, X(k), y + 4, "lab-axis");
      out += text(X(k), y + 18, fmt(k), "lab-text-tick", "middle");
    }
    out += arrow(X(0), y - 14, X(v.m), y - 14, "lab-side-a", 2);
    out += arrow(X(v.m), y - 30, X(v.m + v.n), y - 30, "lab-side-b", 2);
    if (result.n !== 0) out += arrow(X(v.m + v.n), y - 46, X(n), y - 46, "lab-side-c", 2);
    out += text(40, 160, "Exponenten:", "lab-text-small");
    out += infoBox(70, 252, [
      [`Vorzahlen: ${fmt(v.a, 1)} · ${fmt(v.b, 1)} = ${fmt(raw, 2)}`, "lab-text-a"],
      [`Exponenten: ${fmt(v.m)} + ${fmt(v.n)} = ${fmt(v.m + v.n)}`, "lab-text-b"],
      [
        result.n === 0
          ? `Ergebnis: ${sciText(result.a, n, 4)}`
          : `${fmt(raw, 2)} ≥ 10: ${fmt(raw, 2)} = ${sciText(result.a, 1, 4)}, also ${sciText(result.a, n, 4)}`,
        "lab-text-c",
      ],
    ]);
    return out + "</svg>";
  },
};

// 2.3 Vorsilben: eine Leiter von Nano bis Peta.
const prefixLadder: LabView = {
  render(v) {
    const unit = v.unit === 1 ? "B" : "m";
    const from = PREFIXES[v.from] ?? PREFIXES[5];
    const to = PREFIXES[v.to] ?? PREFIXES[5];
    const shift = from.exp - to.exp;
    const result = sci(v.v * 10 ** 0, 6);
    const value = decimalString(result.a, result.n + shift);
    let out =
      open(`${fmt(v.v)} ${from.symbol}${unit} = ${value} ${to.symbol}${unit}`) +
      title(`${fmt(v.v)} ${from.symbol}${unit} = ${value} ${to.symbol}${unit}`);
    const rows = [...PREFIXES].reverse();
    const top = 44;
    const gap = 23;
    rows.forEach((prefix, i) => {
      const y = top + i * gap;
      const unusual = unit === "B" && prefix.exp < 0;
      const cls = prefix === from ? "lab-fill-a" : prefix === to ? "lab-fill-b" : "lab-cell";
      out += rect(40, y, 190, gap - 3, cls, 'rx="4"');
      out += text(52, y + 15, prefix.exp === 0 ? "ohne Vorsilbe" : prefix.name, unusual ? "lab-text-muted" : "lab-text");
      out += text(150, y + 15, `${prefix.symbol}${unit}`, unusual ? "lab-text-muted" : "lab-text");
      out += text(222, y + 15, prefix.exp === 0 ? "1" : pow10Text(prefix.exp), "lab-text-small", "end");
    });
    const yOf = (p: typeof from) => top + rows.indexOf(p) * gap + 10;
    if (from !== to) out += arrow(250, yOf(from), 250, yOf(to), "lab-side-c", 2.5);
    out += infoBox(280, 90, [
      [`von ${from.exp === 0 ? `${unit} (ohne Vorsilbe)` : from.name}: ${from.exp === 0 ? "1" : pow10Text(from.exp)}`, "lab-text-a"],
      [`nach ${to.exp === 0 ? `${unit} (ohne Vorsilbe)` : to.name}: ${to.exp === 0 ? "1" : pow10Text(to.exp)}`, "lab-text-b"],
      [shift === 0 ? "gleiche Einheit" : `Faktor ${pow10Text(shift)}`, "lab-text-c"],
      [`= ${value} ${to.symbol}${unit}`, "lab-text"],
    ]);
    out += text(280, 220, shift > 0 ? "Zur kleineren Einheit:" : shift < 0 ? "Zur größeren Einheit:" : "", "lab-text-small");
    out += text(280, 236, shift > 0 ? "die Maßzahl wird größer." : shift < 0 ? "die Maßzahl wird kleiner." : "", "lab-text-small");
    if (unit === "B")
      out += text(280, 260, "Speicher: nur Vorsilben ab Kilo", "lab-text-small");
    return out + "</svg>";
  },
};

export const POTENZEN_VIEWS: Record<string, LabView> = {
  "place-value": placeValue,
  "power-product": powerProduct,
  "prefix-ladder": prefixLadder,
};
