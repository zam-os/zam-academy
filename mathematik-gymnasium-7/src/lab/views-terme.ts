import { fmt, MINUS } from "../exercises/format";
import {
  circle,
  handle,
  infoBox,
  line,
  open,
  Plot,
  polygon,
  rect,
  text,
  type LabView,
} from "./svg";
import { rail, railHandle, title } from "./view-helpers";

/** Shared claims for the substitution probe in Stage 1 (4 false, 2 true). */
export const PROBE_CLAIMS: Array<{
  left: string;
  right: string;
  valid: boolean;
  evalLeft: (x: number, y: number) => number;
  evalRight: (x: number, y: number) => number;
}> = [
  {
    left: "x² + x²",
    right: "x⁴",
    valid: false,
    evalLeft: (x) => x * x + x * x,
    evalRight: (x) => x ** 4,
  },
  {
    left: "x² · x³",
    right: "x⁶",
    valid: false,
    evalLeft: (x) => x ** 2 * x ** 3,
    evalRight: (x) => x ** 6,
  },
  {
    left: "3x + 2y",
    right: "5xy",
    valid: false,
    evalLeft: (x, y) => 3 * x + 2 * y,
    evalRight: (x, y) => 5 * x * y,
  },
  {
    left: "−(x − y)",
    right: "−x − y",
    valid: false,
    evalLeft: (x, y) => -(x - y),
    evalRight: (x, y) => -x - y,
  },
  {
    left: "3x + 5x",
    right: "8x",
    valid: true,
    evalLeft: (x) => 3 * x + 5 * x,
    evalRight: (x) => 8 * x,
  },
  {
    left: "(2x)²",
    right: "4x²",
    valid: true,
    evalLeft: (x) => (2 * x) ** 2,
    evalRight: (x) => 4 * x * x,
  },
];

export function probeStats(x: number, y: number) {
  let exposed = 0;
  let slipped = 0;
  for (const claim of PROBE_CLAIMS) {
    if (claim.valid) continue;
    if (Math.abs(claim.evalLeft(x, y) - claim.evalRight(x, y)) > 1e-9) exposed++;
    else slipped++;
  }
  return { exposed, slipped, totalFalse: 4 };
}

const patternTerms: LabView = {
  render(v) {
    const a = v.a;
    const b = v.b;
    const n = v.n;
    const total = a + b * n;
    let out = open("Streichholzkette als Term a + b · n");
    out += title(`Term: ${fmt(a, 0)} + ${fmt(b, 0)} · n = ${fmt(total, 0)} Hölzer`);

    // Draw start segment + n groups of b sticks
    const cellW = Math.min(44, 380 / Math.max(n, 1));
    const x0 = 60;
    const y0 = 105;
    const h = 44;

    // Initial a sticks stacked vertically/angled cleanly on the left
    for (let i = 0; i < a; i++) {
      const sx = x0 - 10 + (i % 2) * 8;
      const sy = y0 + i * 7;
      out += line(sx, sy, sx, sy + 28, "lab-side-a");
    }
    out += text(x0 - 8, y0 + 78, `Start: ${fmt(a, 0)}`, "lab-text-a", "middle");

    for (let step = 0; step < n; step++) {
      const gx = x0 + 18 + step * (cellW + 8);
      out += rect(gx, y0, cellW, h, step % 2 === 0 ? "lab-fill-b" : "lab-fill-a", 'rx="6"');
      for (let k = 0; k < b; k++) {
        const bx = gx + 7 + (k * (cellW - 14)) / Math.max(1, b - 1);
        out += line(bx, y0 + 8, bx, y0 + h - 8, "lab-side-b");
        out += circle(bx, y0 + 8, 2.6, "lab-point-b");
      }
      out += text(gx + cellW / 2, y0 + h + 18, `+${fmt(b, 0)}`, "lab-text-b", "middle");
    }

    out += rect(65, 195, 390, 42, "lab-panel", 'rx="8"');
    out += text(
      260,
      221,
      `n = ${fmt(n, 0)} ⇒ ${fmt(a, 0)} + ${fmt(b, 0)} · ${fmt(n, 0)} = ${fmt(total, 0)}`,
      "lab-text-big",
      "middle",
    );
    out += rail("n", "Anzahl n", n, 1, 8, 295);
    return out + "</svg>";
  },
  handles: { n: railHandle("n", 1, 8) },
};

const termInterpret: LabView = {
  render(v) {
    const x = v.x;
    const y = v.y;
    const c = v.c;
    const area = x * y - c * c;
    let out = open("Ausgeschnittenes Rechteck zur Terminterpretation");
    out += title(`Fläche: x · y ${MINUS} c² = (${fmt(x, 0)} · ${fmt(y, 0)}) ${MINUS} ${fmt(c, 0)}² = ${fmt(area, 0)}`);

    const plot = new Plot(0, 10, 0, 7, { x: 40, y: 42, w: 300, h: 210 });
    out += plot.grid(1, 2, "x", "y");
    const cutY = Math.max(0, y - c);
    // L-shaped region = full rectangle (0..x, 0..y) minus top-right square (x-c..x, y-c..y)
    const pts = [
      plot.P(0, 0),
      plot.P(x, 0),
      plot.P(x, cutY),
      plot.P(Math.max(0, x - c), cutY),
      plot.P(Math.max(0, x - c), y),
      plot.P(0, y),
    ];
    out += polygon(pts, "lab-fill-a lab-side-a");
    // Dashed missing corner
    out += rect(
      plot.X(Math.max(0, x - c)),
      plot.Y(y),
      plot.X(x) - plot.X(Math.max(0, x - c)),
      plot.Y(cutY) - plot.Y(y),
      "lab-dashed",
    );
    out += text(
      (plot.X(x - c) + plot.X(x)) / 2,
      (plot.Y(y) + plot.Y(cutY)) / 2 + 4,
      `${MINUS}c²`,
      "lab-text-bad",
      "middle",
    );
    out += handle("xy", plot.X(x), plot.Y(y), "Breite x und Höhe y");
    out += infoBox(495, 76, [
      [`x = ${fmt(x, 0)}, y = ${fmt(y, 0)}`, "lab-text-a"],
      [`Ausschnitt c = ${fmt(c, 0)}`, "lab-text-bad"],
      [`x·y ${MINUS} c² = ${fmt(area, 0)}`, "lab-text-big"],
      [`(x${MINUS}c)·y + c·(y${MINUS}c) = ${fmt(area, 0)}`, "lab-text-small"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    xy: {
      x: "x",
      y: "y",
      drag: (p) => {
        const plot = new Plot(0, 10, 0, 7, { x: 40, y: 42, w: 300, h: 210 });
        return { x: plot.invX(p.x), y: plot.invY(p.y) };
      },
    },
  },
};

const valueTable: LabView = {
  render(v) {
    const a = v.a;
    const n = v.n;
    const k = v.k;
    const val = a ** n + k;
    let out = open("Wertetabelle mit ganzzahligen Exponenten");
    out += title(`T(n) = ${fmt(a, 0)}ⁿ${k === 0 ? "" : k > 0 ? ` + ${fmt(k, 0)}` : ` ${MINUS} ${fmt(-k, 0)}`}`);

    const cols = [-2, -1, 0, 1, 2, 3];
    const startX = 50;
    const colW = 70;
    out += rect(startX, 62, colW * cols.length, 38, "lab-cell-sum");
    out += rect(startX, 100, colW * cols.length, 46, "lab-cell");
    out += rect(startX, 146, colW * cols.length, 46, "lab-cell");

    cols.forEach((exp, i) => {
      const cx = startX + i * colW + colW / 2;
      const gx = startX + i * colW;
      if (i > 0) out += line(gx, 62, gx, 192, "lab-axis");
      if (exp === n) out += rect(gx + 1, 63, colW - 2, 128, "lab-fill-a");
      out += text(cx, 86, `n = ${fmt(exp, 0)}`, exp === n ? "lab-text-a" : "lab-text-small", "middle");
      const pVal = a ** exp;
      const powStr = exp < 0 ? `1/${fmt(a ** -exp, 0)}` : fmt(pVal, 0);
      out += text(cx, 128, powStr, "lab-text", "middle");
      out += text(cx, 174, fmt(pVal + k, 3), exp === n ? "lab-text-ok" : "lab-text", "middle");
    });

    out += text(42, 86, "n", "lab-text-small", "end");
    out += text(42, 128, `${fmt(a, 0)}ⁿ`, "lab-text-small", "end");
    out += text(42, 174, "T(n)", "lab-text-small", "end");

    out += rect(65, 206, 390, 36, "lab-panel", 'rx="8"');
    out += text(
      260,
      229,
      `Aktuell: ${fmt(a, 0)}^(${fmt(n, 0)}) = ${n < 0 ? `1/${fmt(a ** -n, 0)} ≈ ` : ""}${fmt(a ** n, 3)} ⇒ T = ${fmt(val, 3)}`,
      "lab-text",
      "middle",
    );
    out += rail("n", "Exponent n", n, -2, 3, 295);
    return out + "</svg>";
  },
  handles: { n: railHandle("n", -2, 3) },
};

const spreadsheetSim: LabView = {
  render(v) {
    const m = v.m;
    const t = v.t;
    const x0 = v.x0;
    let out = open("Tabellenkalkulation mit relativen und absoluten Zellbezügen");
    out += title("Tabellenkalkulation: Formelzeile & Zellen");

    // Formula bar
    out += rect(40, 40, 440, 28, "lab-panel", 'rx="6"');
    out += text(52, 59, `B2  fx  = $E$1 * A2 ${t >= 0 ? `+ ${fmt(t, 0)}` : `${MINUS} ${fmt(-t, 0)}`}`, "lab-text-a");

    // Sheet grid
    const headers = ["", "A (x)", "B (= $E$1·A + t)", "C (= A²)"];
    const widths = [38, 100, 170, 132];
    let curX = 40;
    headers.forEach((h, c) => {
      out += rect(curX, 76, widths[c], 28, "lab-cell-sum");
      out += text(curX + widths[c] / 2, 95, h, "lab-text-small", "middle");
      curX += widths[c];
    });

    for (let r = 0; r < 4; r++) {
      const y = 104 + r * 30;
      const xVal = x0 + r;
      const bVal = m * xVal + t;
      const cVal = xVal * xVal;
      const vals = [String(r + 2), fmt(xVal, 0), fmt(bVal, 0), fmt(cVal, 0)];
      let cx = 40;
      vals.forEach((val, col) => {
        out += rect(cx, y, widths[col], 30, col === 0 ? "lab-cell-sum" : r === 0 && col === 1 ? "lab-fill-a" : "lab-cell");
        out += text(cx + widths[col] / 2, y + 20, val, col === 2 ? "lab-text-b" : "lab-text", "middle");
        cx += widths[col];
      });
    }

    // Parameter cell E1 callout
    out += rect(40, 232, 440, 26, "lab-fill-b", 'rx="6"');
    out += text(260, 249, `Feste Parameterzelle $E$1 = ${fmt(m, 0)} (bleibt beim Herunterziehen gleich)`, "lab-text-small", "middle");
    out += rail("x0", "Startwert A2", x0, -3, 3, 298);
    return out + "</svg>";
  },
  handles: { x0: railHandle("x0", -3, 3) },
};

const termTree: LabView = {
  render(v) {
    const mode = v.mode;
    const x = v.x;
    const y = v.y;
    let out = open("Rechenbaum zur Termstruktur");
    const configs = [
      {
        expr: `2 · (x + y)`,
        root: "Produkt",
        leftOp: "2",
        rightOp: "Summe (x + y)",
        val: 2 * (x + y),
      },
      {
        expr: `2 · x + y`,
        root: "Summe",
        leftOp: "Produkt (2 · x)",
        rightOp: "y",
        val: 2 * x + y,
      },
      {
        expr: `(x ${MINUS} y)²`,
        root: "Potenz",
        leftOp: `Differenz (x ${MINUS} y)`,
        rightOp: "Exponent 2",
        val: (x - y) ** 2,
      },
      {
        expr: `(x + y) : 2`,
        root: "Quotient",
        leftOp: "Summe (x + y)",
        rightOp: "2",
        val: (x + y) / 2,
      },
    ];
    const cfg = configs[mode] ?? configs[0];
    out += title(`Term: ${cfg.expr} = ${fmt(cfg.val, 2)}`);

    // Tree edges
    out += line(260, 82, 145, 165, "lab-side-a");
    out += line(260, 82, 375, 165, "lab-side-b");

    // Root node
    out += rect(170, 52, 180, 42, "lab-fill-ok", 'rx="10"');
    out += rect(170, 52, 180, 42, "lab-side-ok", 'rx="10"');
    out += text(260, 78, `Zuletzt: ${cfg.root}`, "lab-text-ok", "middle");

    // Left child
    out += rect(60, 152, 170, 44, "lab-panel", 'rx="8"');
    out += text(145, 179, cfg.leftOp, "lab-text-a", "middle");

    // Right child
    out += rect(290, 152, 170, 44, "lab-panel", 'rx="8"');
    out += text(375, 179, cfg.rightOp, "lab-text-b", "middle");

    out += text(
      260,
      235,
      `Einsetzung x = ${fmt(x, 0)}, y = ${fmt(y, 0)} ⇒ Wert ${fmt(cfg.val, 2)}`,
      "lab-text",
      "middle",
    );
    out += rail("x", "x", x, 1, 6, 295);
    return out + "</svg>";
  },
  handles: { x: railHandle("x", 1, 6) },
};

const powerRulesN: LabView = {
  render(v) {
    const mode = v.mode;
    const a = v.a;
    const m = v.m;
    const n = v.n;
    let out = open("Potenzgesetze mit natürlichen Exponenten");

    if (mode === 0) {
      const exp = m + n;
      out += title(`${fmt(a, 0)}^${fmt(m, 0)} · ${fmt(a, 0)}^${fmt(n, 0)} = ${fmt(a, 0)}^(${fmt(m, 0)}+${fmt(n, 0)}) = ${fmt(a, 0)}^${fmt(exp, 0)}`);
      const left = Array(m).fill(fmt(a, 0)).join("·");
      const right = Array(n).fill(fmt(a, 0)).join("·");
      out += rect(45, 58, 200, 56, "lab-fill-a", 'rx="8"');
      out += text(145, 92, left, "lab-text-a", "middle");
      out += text(260, 92, "·", "lab-text-big", "middle");
      out += rect(275, 58, 200, 56, "lab-fill-b", 'rx="8"');
      out += text(375, 92, right, "lab-text-b", "middle");
      out += rect(45, 132, 430, 44, "lab-fill-ok", 'rx="8"');
      out += text(260, 159, `Insgesamt ${fmt(exp, 0)} Faktoren ⇒ Wert = ${fmt(a ** exp, 0)}`, "lab-text-ok", "middle");
    } else if (mode === 1) {
      const val = a ** n * 3 ** n;
      out += title(`${fmt(a, 0)}^${fmt(n, 0)} · 3^${fmt(n, 0)} = (${fmt(a, 0)}·3)^${fmt(n, 0)} = ${fmt(a * 3, 0)}^${fmt(n, 0)}`);
      out += rect(50, 62, 420, 54, "lab-panel", 'rx="8"');
      const pairs = Array(n).fill(`(${fmt(a, 0)}·3)`).join(" · ");
      out += text(260, 94, pairs, "lab-text-a", "middle");
      out += rect(50, 132, 420, 44, "lab-fill-ok", 'rx="8"');
      out += text(260, 159, `Umsortiert zu ${fmt(n, 0)} gleichen Paaren ⇒ ${fmt(val, 0)}`, "lab-text-ok", "middle");
    } else {
      const exp = m * n;
      out += title(`(${fmt(a, 0)}^${fmt(m, 0)})^${fmt(n, 0)} = ${fmt(a, 0)}^(${fmt(m, 0)}·${fmt(n, 0)}) = ${fmt(a, 0)}^${fmt(exp, 0)}`);
      const block = `${fmt(a, 0)}^${fmt(m, 0)}`;
      out += rect(45, 58, 430, 56, "lab-fill-b", 'rx="8"');
      out += text(260, 92, Array(n).fill(block).join(" · "), "lab-text-b", "middle");
      out += rect(45, 132, 430, 44, "lab-fill-ok", 'rx="8"');
      out += text(260, 159, `${fmt(n, 0)} Blöcke mit je ${fmt(m, 0)} Faktoren = ${fmt(exp, 0)} Faktoren ⇒ ${fmt(a ** exp, 0)}`, "lab-text-ok", "middle");
    }

    out += rail("m", "Exponent m", m, 1, 4, 232);
    out += rail("n", "Exponent n", n, 1, 4, 302);
    return out + "</svg>";
  },
  handles: {
    m: railHandle("m", 1, 4),
    n: railHandle("n", 1, 4),
  },
};

const likeTermsProbe: LabView = {
  render(v) {
    const x = v.x;
    const y = v.y;
    let out = open("Einsetzprobe für sechs Termgleichungen");
    out += title(`Einsetzprobe für x = ${fmt(x, 0)}, y = ${fmt(y, 0)}`);

    const rowY = (i: number) => 52 + i * 29;
    PROBE_CLAIMS.forEach((claim, i) => {
      const l = claim.evalLeft(x, y);
      const r = claim.evalRight(x, y);
      const eq = Math.abs(l - r) < 1e-9;
      const yPos = rowY(i);
      const bg = claim.valid ? "lab-fill-ok" : eq ? "lab-cell-sum" : "lab-cell";
      out += rect(28, yPos, 464, 25, bg, 'rx="5"');
      out += text(40, yPos + 17, `${claim.left} = ${claim.right}`, "lab-text-small");
      out += text(290, yPos + 17, `${fmt(l, 0)}  vs.  ${fmt(r, 0)}`, eq ? "lab-text-small" : "lab-text-bad", "middle");
      const badge = claim.valid
        ? "✓ äquivalent"
        : eq
          ? "⚠ unentdeckt"
          : "✗ widerlegt";
      out += text(480, yPos + 17, badge, claim.valid ? "lab-text-ok" : eq ? "lab-text-b" : "lab-text-bad", "end");
    });

    out += rail("x", "x", x, -2, 4, 260);
    out += rail("y", "y", y, -2, 4, 315);
    return out + "</svg>";
  },
  handles: {
    x: railHandle("x", -2, 4),
    y: railHandle("y", -2, 4),
  },
};

const distributiveArea: LabView = {
  render(v) {
    const k = v.k;
    const a = v.a;
    const b = v.b;
    const total = k * (a + b);
    let out = open("Distributivgesetz k · (a + b) = k·a + k·b");
    out += title(`${fmt(k, 0)} · (${fmt(a, 0)}${b < 0 ? ` ${MINUS} ${fmt(-b, 0)}` : ` + ${fmt(b, 0)}`}) = ${fmt(k * a, 0)}${k * b < 0 ? ` ${MINUS} ${fmt(-k * b, 0)}` : ` + ${fmt(k * b, 0)}`} = ${fmt(total, 0)}`);

    const plot = new Plot(0, 10, 0, 5, { x: 45, y: 45, w: 430, h: 155 });
    out += rect(plot.X(0), plot.Y(k), plot.X(a) - plot.X(0), plot.Y(0) - plot.Y(k), "lab-fill-a lab-side-a");
    out += text((plot.X(0) + plot.X(a)) / 2, (plot.Y(0) + plot.Y(k)) / 2 + 5, `k·a = ${fmt(k * a, 0)}`, "lab-text-a", "middle");

    if (b >= 0) {
      out += rect(plot.X(a), plot.Y(k), plot.X(a + b) - plot.X(a), plot.Y(0) - plot.Y(k), "lab-fill-b lab-side-b");
      if (b > 0) {
        out += text((plot.X(a) + plot.X(a + b)) / 2, (plot.Y(0) + plot.Y(k)) / 2 + 5, `k·b = ${fmt(k * b, 0)}`, "lab-text-b", "middle");
      }
    } else {
      const rem = a + b;
      out += rect(plot.X(rem), plot.Y(k), plot.X(a) - plot.X(rem), plot.Y(0) - plot.Y(k), "lab-fill-c lab-dashed");
      out += text((plot.X(rem) + plot.X(a)) / 2, (plot.Y(0) + plot.Y(k)) / 2 + 5, `${MINUS}${fmt(-k * b, 0)}`, "lab-text-bad", "middle");
    }

    out += rail("k", "Faktor k", k, 1, 5, 240);
    out += rail("b", "Summand b", b, -2, 4, 305);
    return out + "</svg>";
  },
  handles: {
    k: railHandle("k", 1, 5),
    b: railHandle("b", -2, 4),
  },
};

const FACTOR_PRESETS = [
  { a: 12, b: 18, varA: "x", varB: "y", title: "12x + 18y" },
  { a: 15, b: 10, varA: "a", varB: "b", title: "15a + 10b" },
  { a: 8, b: 12, varA: "x²", varB: "x", title: "8x² + 12x" },
] as const;

const factorRect: LabView = {
  render(v) {
    const preset = FACTOR_PRESETS[v.preset] ?? FACTOR_PRESETS[0];
    const f = v.f;
    const fits = preset.a % f === 0 && preset.b % f === 0;
    let out = open("Ausklammern als Rechteck-Zusammenfügung");
    out += title(`Summe: ${preset.title} · gemeinsamer Faktor f = ${fmt(f, 0)}`);

    const h1 = f * 18;
    const w1 = (preset.a / f) * 14;
    const w2 = (preset.b / f) * 14;
    const baseY = 205;
    out += rect(70, baseY - h1, Math.min(w1, 180), Math.min(h1, 130), fits ? "lab-fill-a lab-side-a" : "lab-panel");
    out += text(70 + Math.min(w1, 180) / 2, baseY - Math.min(h1, 130) / 2 + 5, `${fmt(preset.a, 0)}${preset.varA}`, fits ? "lab-text-a" : "lab-text-small", "middle");

    const gap = fits ? 0 : 28;
    const x2 = 70 + Math.min(w1, 180) + gap;
    out += rect(x2, baseY - h1, Math.min(w2, 180), Math.min(h1, 130), fits ? "lab-fill-b lab-side-b" : "lab-panel");
    out += text(x2 + Math.min(w2, 180) / 2, baseY - Math.min(h1, 130) / 2 + 5, `${fmt(preset.b, 0)}${preset.varB}`, fits ? "lab-text-b" : "lab-text-small", "middle");

    const msg = fits
      ? `= ${fmt(f, 0)} · (${fmt(preset.a / f, 0)}${preset.varA} + ${fmt(preset.b / f, 0)}${preset.varB}) ✓ Produkt!`
      : `f = ${fmt(f, 0)} teilt nicht beide Koeffizienten ganzzahlig.`;
    out += text(260, 238, msg, fits ? "lab-text-ok" : "lab-text-bad", "middle");
    out += rail("f", "Ausgeklammerter Faktor f", f, 1, 6, 295);
    return out + "</svg>";
  },
  handles: { f: railHandle("f", 1, 6) },
};

const sumProductGrid: LabView = {
  render(v) {
    const a = v.a;
    const b = v.b;
    const c = v.c;
    const d = v.d;
    let out = open("Vier-Felder-Rechteck (a + b)(c + d)");
    out += title(`(${fmt(a, 0)} + ${fmt(b, 0)}) · (${fmt(c, 0)} + ${fmt(d, 0)}) = ${fmt((a + b) * (c + d), 0)}`);

    const x0 = 95;
    const y0 = 56;
    const scaleX = 28;
    const scaleY = 20;
    const wa = a * scaleX;
    const wb = b * scaleX;
    const hc = c * scaleY;
    const hd = d * scaleY;

    out += rect(x0, y0, wa, hc, "lab-fill-a lab-side-a");
    out += text(x0 + wa / 2, y0 + hc / 2 + 5, `a·c = ${fmt(a * c, 0)}`, "lab-text-a", "middle");

    out += rect(x0 + wa, y0, wb, hc, "lab-fill-b lab-side-b");
    out += text(x0 + wa + wb / 2, y0 + hc / 2 + 5, `b·c = ${fmt(b * c, 0)}`, "lab-text-b", "middle");

    out += rect(x0, y0 + hc, wa, hd, "lab-fill-c lab-side-c");
    out += text(x0 + wa / 2, y0 + hc + hd / 2 + 5, `a·d = ${fmt(a * d, 0)}`, "lab-text-c", "middle");

    out += rect(x0 + wa, y0 + hc, wb, hd, "lab-fill-ok lab-side-ok");
    out += text(x0 + wa + wb / 2, y0 + hc + hd / 2 + 5, `b·d = ${fmt(b * d, 0)}`, "lab-text-ok", "middle");

    out += text(x0 + wa / 2, y0 - 8, `a=${fmt(a, 0)}`, "lab-text-small", "middle");
    out += text(x0 + wa + wb / 2, y0 - 8, `b=${fmt(b, 0)}`, "lab-text-small", "middle");
    out += text(x0 - 10, y0 + hc / 2 + 4, `c=${fmt(c, 0)}`, "lab-text-small", "end");
    out += text(x0 - 10, y0 + hc + hd / 2 + 4, `d=${fmt(d, 0)}`, "lab-text-small", "end");

    out += rail("a", "a", a, 1, 6, 240);
    out += rail("c", "c", c, 1, 5, 305);
    return out + "</svg>";
  },
  handles: {
    a: railHandle("a", 1, 6),
    c: railHandle("c", 1, 5),
  },
};

const binomialSquare: LabView = {
  render(v) {
    const kind = v.kind;
    const a = v.a;
    const b = v.b;
    let out = open("Geometrische Deutung der binomischen Formeln");
    const unit = 20;
    const ox = 85;
    const oy = 52;

    if (kind === 0) {
      out += title(`1. binomische Formel: (${fmt(a, 0)} + ${fmt(b, 0)})² = ${fmt(a * a, 0)} + 2·${fmt(a * b, 0)} + ${fmt(b * b, 0)} = ${fmt((a + b) ** 2, 0)}`);
      const sa = a * unit;
      const sb = b * unit;
      out += rect(ox, oy, sa, sa, "lab-fill-a lab-side-a");
      out += text(ox + sa / 2, oy + sa / 2 + 5, `a²=${fmt(a * a, 0)}`, "lab-text-a", "middle");
      out += rect(ox + sa, oy, sb, sa, "lab-fill-b lab-side-b");
      out += text(ox + sa + sb / 2, oy + sa / 2 + 5, `${fmt(a * b, 0)}`, "lab-text-b", "middle");
      out += rect(ox, oy + sa, sa, sb, "lab-fill-b lab-side-b");
      out += text(ox + sa / 2, oy + sa + sb / 2 + 5, `a·b=${fmt(a * b, 0)}`, "lab-text-b", "middle");
      out += rect(ox + sa, oy + sa, sb, sb, "lab-fill-ok lab-side-ok");
      out += text(ox + sa + sb / 2, oy + sa + sb / 2 + 5, `b²`, "lab-text-ok", "middle");
    } else if (kind === 1) {
      out += title(`2. binomische Formel: (${fmt(a, 0)} ${MINUS} ${fmt(b, 0)})² = ${fmt(a * a, 0)} ${MINUS} 2·${fmt(a * b, 0)} + ${fmt(b * b, 0)} = ${fmt((a - b) ** 2, 0)}`);
      const sa = a * unit;
      const sb = b * unit;
      const sm = (a - b) * unit;
      out += rect(ox, oy, sa, sa, "lab-panel");
      out += rect(ox, oy, sm, sm, "lab-fill-a lab-side-a");
      out += text(ox + sm / 2, oy + sm / 2 + 5, `(a${MINUS}b)²=${fmt((a - b) ** 2, 0)}`, "lab-text-a", "middle");
      out += rect(ox + sm, oy, sb, sa, "lab-fill-c lab-dashed");
      out += rect(ox, oy + sm, sa, sb, "lab-fill-c lab-dashed");
      out += rect(ox + sm, oy + sm, sb, sb, "lab-fill-ok lab-side-ok");
      out += text(ox + sm + sb / 2, oy + sm + sb / 2 + 5, `+b²`, "lab-text-ok", "middle");
    } else {
      out += title(`3. binomische Formel: (${fmt(a, 0)}+${fmt(b, 0)})(${fmt(a, 0)}${MINUS}${fmt(b, 0)}) = ${fmt(a * a, 0)} ${MINUS} ${fmt(b * b, 0)} = ${fmt(a * a - b * b, 0)}`);
      const sa = a * unit;
      const sb = b * unit;
      const sm = (a - b) * unit;
      out += rect(ox, oy, sa, sm, "lab-fill-a lab-side-a");
      out += text(ox + sa / 2, oy + sm / 2 + 5, `a·(a${MINUS}b)`, "lab-text-a", "middle");
      out += rect(ox + sa, oy, sb, sm, "lab-fill-b lab-side-b");
      out += text(ox + sa + sb / 2, oy + sm / 2 + 5, `b(a${MINUS}b)`, "lab-text-b", "middle");
    }

    out += infoBox(495, 78, [
      [`a = ${fmt(a, 0)}, b = ${fmt(b, 0)}`, "lab-text-small"],
      [`2·a·b = ${fmt(2 * a * b, 0)}`, "lab-text-b"],
      [`b² = ${fmt(b * b, 0)}`, "lab-text-ok"],
    ], "end");
    out += rail("a", "a", a, 4, 7, 240);
    out += rail("b", "b", b, 1, 3, 305);
    return out + "</svg>";
  },
  handles: {
    a: railHandle("a", 4, 7),
    b: railHandle("b", 1, 3),
  },
};

const areaScaling: LabView = {
  render(v) {
    const a = v.a;
    const b = v.b;
    const kx = v.kx;
    const ky = v.ky;
    const factor = kx * ky;
    let out = open("Flächenänderung beim Skalieren von Rechteckseiten");
    out += title(`(${fmt(kx, 0)}·a) · (${fmt(ky, 0)}·b) = ${fmt(factor, 0)} · (a·b) ⇒ Faktor ${fmt(factor, 0)}`);

    const cellW = 28;
    const cellH = 24;
    // Original rectangle on left
    out += rect(52, 85, cellW, cellH, "lab-fill-a lab-side-a");
    out += text(66, 102, "A₀", "lab-text-a", "middle");
    out += text(66, 130, `${fmt(a, 0)}×${fmt(b, 0)} = ${fmt(a * b, 0)}`, "lab-text-small", "middle");

    // Scaled grid on right
    const rx = 180;
    const ry = 62;
    for (let ix = 0; ix < kx; ix++) {
      for (let iy = 0; iy < ky; iy++) {
        out += rect(
          rx + ix * cellW,
          ry + iy * cellH,
          cellW,
          cellH,
          (ix + iy) % 2 === 0 ? "lab-fill-b lab-side-b" : "lab-fill-a lab-side-a",
        );
      }
    }
    out += text(rx + (kx * cellW) / 2, ry + ky * cellH + 22, `${fmt(kx, 0)} · ${fmt(ky, 0)} = ${fmt(factor, 0)} Teilrechtecke (${fmt(factor * a * b, 0)})`, "lab-text-ok", "middle");
    out += rail("kx", "Faktor Breite kx", kx, 1, 3, 240);
    out += rail("ky", "Faktor Höhe ky", ky, 1, 3, 305);
    return out + "</svg>";
  },
  handles: {
    kx: railHandle("kx", 1, 3),
    ky: railHandle("ky", 1, 3),
  },
};

export const VIEWS_TERME: Record<string, LabView> = {
  "pattern-terms": patternTerms,
  "term-interpret": termInterpret,
  "value-table": valueTable,
  "spreadsheet-sim": spreadsheetSim,
  "term-tree": termTree,
  "power-rules-n": powerRulesN,
  "like-terms-probe": likeTermsProbe,
  "distributive-area": distributiveArea,
  "factor-rect": factorRect,
  "sum-product-grid": sumProductGrid,
  "binomial-square": binomialSquare,
  "area-scaling": areaScaling,
};
