import { fmt, MINUS } from "../exercises/format";
import { percentAfter, percentChainPercent } from "../curriculum/math";
import {
  circle,
  clipped,
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

const equationModel: LabView = {
  render(v) {
    const a = v.a;
    const b = v.b;
    const x = v.x;
    const target = v.target;
    const leftVal = a * x + b;
    const diff = leftVal - target;
    const solved = diff === 0;
    const maxW = 360;
    const scale = maxW / Math.max(target, leftVal, 24);

    let out = open("Balkenmodell für a·x + b = Zielwert");
    out += title(`${fmt(a, 0)} · x + ${fmt(b, 0)} = ${fmt(target, 0)} · Test x = ${fmt(x, 0)}`);

    // Top bar: a pieces of x + b piece
    let curX = 65;
    for (let i = 0; i < a; i++) {
      const w = x * scale;
      out += rect(curX, 72, w, 36, "lab-fill-a lab-side-a");
      out += text(curX + w / 2, 95, `x=${fmt(x, 0)}`, "lab-text-a", "middle");
      curX += w;
    }
    const wb = b * scale;
    out += rect(curX, 72, wb, 36, "lab-fill-b lab-side-b");
    out += text(curX + wb / 2, 95, fmt(b, 0), "lab-text-b", "middle");
    out += text(curX + wb + 10, 95, `= ${fmt(leftVal, 0)}`, solved ? "lab-text-ok" : "lab-text-a");

    // Target bar
    const wt = target * scale;
    out += rect(65, 132, wt, 36, solved ? "lab-fill-ok lab-side-ok" : "lab-panel");
    out += text(65 + wt / 2, 155, `Ziel: ${fmt(target, 0)}`, solved ? "lab-text-ok" : "lab-text", "middle");

    const verdict = solved
      ? `✓ Beide Balken sind gleich lang: x = ${fmt(x, 0)} löst die Gleichung!`
      : diff < 0
        ? `Links fehlen noch ${fmt(-diff, 0)} bis zum Ziel.`
        : `Links sind ${fmt(diff, 0)} zu viel.`;
    out += text(260, 206, verdict, solved ? "lab-text-ok" : "lab-text-bad", "middle");

    out += rail("x", "Unbekannte x", x, 1, 10, 290);
    return out + "</svg>";
  },
  handles: { x: railHandle("x", 1, 10) },
};

export function eqSideText(xCoef: number, constant: number): string {
  const parts: string[] = [];
  if (xCoef !== 0) {
    parts.push(xCoef === 1 ? "x" : xCoef === -1 ? `${MINUS}x` : `${fmt(xCoef, 0)}x`);
  }
  if (constant !== 0 || parts.length === 0) {
    if (parts.length === 0) parts.push(fmt(constant, 0));
    else parts.push(constant < 0 ? `${MINUS} ${fmt(-constant, 0)}` : `+ ${fmt(constant, 0)}`);
  }
  return parts.join(" ");
}

export const BALANCE_STEPS = [
  { lx: 5, lc: 3, rx: 2, rc: 15, hint: "Ausgangsgleichung: 5x + 3 = 2x + 15" },
  { lx: 3, lc: 3, rx: 0, rc: 15, hint: "Schritt 1 (| − 2x): 3x + 3 = 15" },
  { lx: 3, lc: 0, rx: 0, rc: 12, hint: "Schritt 2 (| − 3): 3x = 12" },
  { lx: 1, lc: 0, rx: 0, rc: 4, hint: "Schritt 3 (| : 3): x = 4" },
] as const;

const balanceScale: LabView = {
  render(v) {
    const step = Math.max(0, Math.min(3, Math.round(v.step ?? 0)));
    const { lx, lc, rx, rc, hint } = BALANCE_STEPS[step];
    const testX = v.testX;
    const leftVal = lx * testX + lc;
    const rightVal = rx * testX + rc;
    const diff = rightVal - leftVal;
    const tiltDeg = Math.max(-14, Math.min(14, diff * 1.4));
    const rad = (tiltDeg * Math.PI) / 180;

    let out = open("Balkenwaage für Äquivalenzumformungen");
    out += title(`${eqSideText(lx, lc)} = ${eqSideText(rx, rc)}`);

    // Fulcrum & tilted beam
    const cx = 260;
    const cy = 175;
    out += polygon(
      [
        { x: cx - 18, y: cy + 32 },
        { x: cx + 18, y: cy + 32 },
        { x: cx, y: cy },
      ],
      "lab-fulcrum",
    );
    const arm = 140;
    const pL = { x: cx - arm * Math.cos(rad), y: cy - arm * Math.sin(rad) };
    const pR = { x: cx + arm * Math.cos(rad), y: cy + arm * Math.sin(rad) };
    out += line(pL.x, pL.y, pR.x, pR.y, "lab-side-a");
    out += rect(pL.x - 52, pL.y - 36, 104, 34, "lab-fill-a lab-side-a", 'rx="6"');
    out += text(pL.x, pL.y - 14, eqSideText(lx, lc), "lab-text-a", "middle");
    out += rect(pR.x - 52, pR.y - 36, 104, 34, "lab-fill-b lab-side-b", 'rx="6"');
    out += text(pR.x, pR.y - 14, eqSideText(rx, rc), "lab-text-b", "middle");

    const isolated = lx === 1 && lc === 0 && rx === 0;
    const equalAtX = Math.abs(diff) < 1e-9;
    out += text(
      260,
      238,
      `Probe x = ${fmt(testX, 0)}: ${fmt(leftVal, 0)} vs. ${fmt(rightVal, 0)} ${equalAtX ? "✓ Gleichgewicht!" : "(schief)"}`,
      equalAtX ? "lab-text-ok" : "lab-text-small",
      "middle",
    );
    if (isolated) {
      out += text(260, 62, "x ist vollständig isoliert (x = 4)!", "lab-text-ok", "middle");
    } else {
      out += text(260, 62, hint, "lab-text-small", "middle");
    }

    out += rail("testX", "Testwert für x", testX, 1, 9, 295);
    return out + "</svg>";
  },
  handles: { testX: railHandle("testX", 1, 9) },
};

const TR_PLOT = new Plot(-1, 6, -6, 16, { x: 26, y: 38, w: 295, h: 205 });

const eqVsTrial: LabView = {
  render(v) {
    const x = v.x;
    const b = v.b;
    // Equation: 3 * (x - 1) = x + b  =>  3x - 3 = x + b  =>  2x = b + 3  => x* = (b+3)/2
    const left = (t: number) => 3 * (t - 1);
    const right = (t: number) => t + b;
    const sol = (b + 3) / 2;
    const hit = Math.abs(left(x) - right(x)) < 1e-9;

    let out = open("Klammergleichung: Termvergleich vs. Probieren");
    out += title(`3 · (x ${MINUS} 1) = x + ${fmt(b, 0)} · Test x = ${fmt(x, 1)}`);
    out += TR_PLOT.grid(1, 2);
    out += TR_PLOT.clip("eq-trial-clip");
    out += clipped(
      "eq-trial-clip",
      TR_PLOT.lineThrough(3, -3, "lab-curve") +
        TR_PLOT.lineThrough(1, b, "lab-curve-2"),
    );

    const pL = TR_PLOT.P(x, left(x));
    const pR = TR_PLOT.P(x, right(x));
    out += circle(pL.x, pL.y, 4.5, "lab-point-a");
    out += circle(pR.x, pR.y, 4.5, "lab-point-b");

    out += infoBox(498, 62, [
      [`Links: ${fmt(left(x), 1)}`, "lab-text-a"],
      [`Rechts: ${fmt(right(x), 1)}`, "lab-text-b"],
      [`Exakt: x = ${fmt(sol, 1)}`, "lab-text-small"],
      [hit ? "✓ Treffer!" : "Zwischenwert nötig?", hit ? "lab-text-ok" : "lab-text-small"],
    ], "end");

    out += rail("x", "Probierwert x (Schrittweite 0,5)", x, -1, 6, 298, 1);
    return out + "</svg>";
  },
  handles: { x: railHandle("x", -1, 6) },
};

const CASE_PLOT = new Plot(-2, 4, -2, 16, { x: 26, y: 38, w: 295, h: 185 });

const eqCases: LabView = {
  render(v) {
    const a = v.a;
    const b = v.b;
    const diffA = a - 3;
    const caseName =
      diffA !== 0
        ? `Eindeutige Lösung: x = ${fmt((b - 2) / diffA, 2)}`
        : b === 2
          ? "Allgemeingültig (0·x = 0 ⇒ 𝕃 = ℚ)"
          : `Unlösbar (0·x = ${fmt(b - 2, 0)} ⇒ 𝕃 = {})`;

    let out = open("Lösungsfälle linearer Gleichungen: a·x + 2 = 3·x + b");
    out += title(`${fmt(a, 0)}·x + 2 = 3·x + ${fmt(b, 0)}`);
    out += CASE_PLOT.grid(1, 2);
    out += CASE_PLOT.clip("eq-case-clip");
    out += clipped(
      "eq-case-clip",
      CASE_PLOT.lineThrough(a, 2, "lab-curve") +
        CASE_PLOT.lineThrough(3, b, "lab-curve-2"),
    );

    if (diffA !== 0) {
      const ix = (b - 2) / diffA;
      const iy = 3 * ix + b;
      if (CASE_PLOT.contains(ix, iy)) {
        out += circle(CASE_PLOT.X(ix), CASE_PLOT.Y(iy), 5, "lab-point-ok");
      }
    }

    out += infoBox(498, 62, [
      [`Links: ${fmt(a, 0)}x + 2`, "lab-text-a"],
      [`Rechts: 3x + ${fmt(b, 0)}`, "lab-text-b"],
      [diffA === 0 && b === 2 ? "Identisch: 𝕃 = ℚ" : diffA === 0 ? "Parallel: 𝕃 = {}" : "Schnittpunkt: 1 Lösung", diffA === 0 && b !== 2 ? "lab-text-bad" : "lab-text-ok"],
    ], "end");
    out += text(174, 240, caseName, diffA === 0 && b !== 2 ? "lab-text-bad" : "lab-text", "middle");
    out += rail("a", "Koeffizient a links", a, 1, 5, 265);
    out += rail("b", "Konstante b rechts", b, 0, 6, 312);
    return out + "</svg>";
  },
  handles: {
    a: railHandle("a", 1, 5),
    b: railHandle("b", 0, 6),
  },
};

const percentEquation: LabView = {
  render(v) {
    const net = v.net;
    const p = v.p;
    const endVal = percentAfter(net, p);
    const trapBack = percentAfter(endVal, -p);
    const factor = 1 + p / 100;
    const maxScale = 260;
    const wOf = (val: number) => Math.max(8, (val / maxScale) * 340);

    let out = open("Prozentrechnung mit linearer Gleichung");
    out += title(`${fmt(factor, 2)} · ${fmt(net, 0)} € = ${fmt(endVal, 2)} €`);

    // Base G
    out += text(48, 86, "Grundwert G", "lab-text-a");
    out += rect(48, 96, wOf(net), 28, "lab-fill-a lab-side-a");
    out += text(48 + wOf(net) + 8, 115, `${fmt(net, 0)} € (100 %)`, "lab-text-a");

    // Modified value W
    out += text(48, 152, `Nach ${p >= 0 ? `+${fmt(p, 0)}` : fmt(p, 0)} % (Faktor ${fmt(factor, 2)})`, "lab-text-ok");
    out += rect(48, 162, wOf(endVal), 28, "lab-fill-ok lab-side-ok");
    out += text(48 + wOf(endVal) + 8, 181, `${fmt(endVal, 2)} €`, "lab-text-ok");

    // Naive reverse check
    out += text(48, 212, `Falle: Endwert ${p >= 0 ? `${MINUS} ${fmt(p, 0)}` : `+ ${fmt(-p, 0)}`} % = ${fmt(trapBack, 2)} € ≠ ${fmt(net, 0)} €!`, "lab-text-bad");

    out += rail("p", "Prozentänderung p (%)", p, -30, 30, 260);
    out += rail("net", "Grundwert G (€)", net, 50, 200, 310);
    return out + "</svg>";
  },
  handles: {
    p: railHandle("p", -30, 30),
    net: railHandle("net", 50, 200),
  },
};

const chainPercent: LabView = {
  render(v) {
    const p1 = v.p1;
    const p2 = v.p2;
    const v1 = percentAfter(100, p1);
    const v2 = percentAfter(v1, p2);
    const totalPct = percentChainPercent(p1, p2);
    const naivePct = p1 + p2;
    const scale = 2.4;

    let out = open("Mehrfache prozentuale Änderung hintereinander");
    out += title(`100 € → (${p1 >= 0 ? "+" : ""}${fmt(p1, 0)} %) → (${p2 >= 0 ? "+" : ""}${fmt(p2, 0)} %) = ${fmt(v2, 2)} €`);

    out += text(48, 72, "Start (100 €)", "lab-text-small");
    out += rect(48, 80, 100 * scale, 24, "lab-panel");

    out += text(48, 126, `1. Schritt: × ${fmt(1 + p1 / 100, 2)} → ${fmt(v1, 1)} €`, "lab-text-a");
    out += rect(48, 134, Math.max(8, v1 * scale), 24, "lab-fill-a lab-side-a");

    out += text(48, 180, `2. Schritt: × ${fmt(1 + p2 / 100, 2)} → ${fmt(v2, 2)} € (gesamt ${totalPct >= 0 ? "+" : ""}${fmt(totalPct, 2)} %)`, "lab-text-ok");
    out += rect(48, 188, Math.max(8, v2 * scale), 24, "lab-fill-ok lab-side-ok");

    out += text(260, 232, `Naives Addieren wäre ${naivePct >= 0 ? "+" : ""}${fmt(naivePct, 0)} % (${fmt(100 + naivePct, 0)} €) · Unterschied: ${fmt(v2 - (100 + naivePct), 2)} €`, "lab-text-bad", "middle");
    out += rail("p1", "1. Änderung p₁ (%)", p1, -30, 30, 265);
    out += rail("p2", "2. Änderung p₂ (%)", p2, -30, 30, 312);
    return out + "</svg>";
  },
  handles: {
    p1: railHandle("p1", -30, 30),
    p2: railHandle("p2", -30, 30),
  },
};

const claimAudit: LabView = {
  render(v) {
    const oldShare = v.v0;
    const newShare = v.v1;
    const pp = newShare - oldShare;
    const rel = ((newShare - oldShare) / oldShare) * 100;
    const wOf = (s: number) => Math.max(10, s * 4);

    let out = open("Prozentpunkte vs. relative Steigerung prüfen");
    out += title(`Anteil von ${fmt(oldShare, 0)} % auf ${fmt(newShare, 0)} %`);

    out += text(48, 86, `Vorher: ${fmt(oldShare, 0)} %`, "lab-text-a");
    out += rect(48, 96, wOf(oldShare), 30, "lab-fill-a lab-side-a");

    out += text(48, 152, `Nachher: ${fmt(newShare, 0)} %`, "lab-text-b");
    out += rect(48, 162, wOf(newShare), 30, "lab-fill-b lab-side-b");

    out += rect(48, 208, 424, 34, "lab-panel", 'rx="8"');
    out += text(
      260,
      230,
      `Unterschied: ${pp >= 0 ? "+" : ""}${fmt(pp, 0)} Prozentpunkte · relativ ${rel >= 0 ? "+" : ""}${fmt(rel, 1)} %`,
      "lab-text",
      "middle",
    );

    out += rail("v0", "Vorher-Anteil (%)", oldShare, 10, 80, 268);
    out += rail("v1", "Nachher-Anteil (%)", newShare, 10, 90, 312);
    return out + "</svg>";
  },
  handles: {
    v0: railHandle("v0", 10, 80),
    v1: railHandle("v1", 10, 90),
  },
};

export const VIEWS_GLEICHUNGEN: Record<string, LabView> = {
  "equation-model": equationModel,
  "balance-scale": balanceScale,
  "eq-vs-trial": eqVsTrial,
  "eq-cases": eqCases,
  "percent-equation": percentEquation,
  "chain-percent": chainPercent,
  "claim-audit": claimAudit,
};
