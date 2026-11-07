import { fmt, paren } from "../exercises/format";
import {
  additiveEquation,
  boxSurface,
  circleLine,
  circleLinePoints,
  multiplicativeEquation,
  partNames,
  quadName,
  stackSurface,
  termKindPhrase,
  termSolve,
  termText,
  twoCircles,
  twoCirclesPoints,
  type GridPoint,
  type TermNode,
} from "../models";
import {
  arrow,
  circle,
  handle,
  line,
  open,
  Plot,
  polygon,
  rect,
  text,
  type LabView,
} from "./svg";
import { coordinateHandle, rail, railHandle, title } from "./view-helpers";

const n0 = (value: number) => fmt(value, 0);

/** A number line from −20 to 20 for two numbers and their Beträge. */
const compareX = (n: number) => 40 + (440 * (n + 20)) / 40;
const compareAbs: LabView = {
  render(v) {
    const y = 130;
    const relation = v.a > v.b ? ">" : v.a < v.b ? "<" : "=";
    const betrag = Math.abs(v.a) > Math.abs(v.b) ? "a" : Math.abs(v.a) < Math.abs(v.b) ? "b" : "keine";
    const groesser = v.a > v.b ? "a" : v.a < v.b ? "b" : "keine";
    const widerlegt = betrag !== "keine" && groesser !== "keine" && betrag !== groesser;
    let out =
      open("Zwei ganze Zahlen auf der Zahlengeraden") +
      title("Ist die Zahl mit dem größeren Betrag immer die größere?") +
      arrow(28, y, 495, y, "lab-axis", 1.6);
    for (let n = -20; n <= 20; n += 5) {
      out += line(compareX(n), y - 7, compareX(n), y + 7, "lab-axis");
      out += text(compareX(n), y + 24, n0(n), n === 0 ? "lab-text" : "lab-text-tick", "middle");
    }
    return (
      out +
      text(compareX(v.a), y - 28, `a = ${n0(v.a)}`, "lab-text-a", "middle") +
      text(compareX(v.b), y - 48, `b = ${n0(v.b)}`, "lab-text-b", "middle") +
      text(260, 200, `${n0(v.a)} ${relation} ${n0(v.b)}   |   |a| = ${Math.abs(v.a)}, |b| = ${Math.abs(v.b)}`, "lab-text-big", "middle") +
      text(260, 240, widerlegt ? "Gegenbeispiel: größerer Betrag, aber kleinere Zahl." : "Dieses Paar widerlegt die Aussage nicht.", widerlegt ? "lab-text-ok" : "lab-text", "middle") +
      handle("a", compareX(v.a), y, "Zahl a ziehen", "lab-handle lab-handle-a") +
      handle("b", compareX(v.b), y, "Zahl b ziehen", "lab-handle lab-handle-b") +
      "</svg>"
    );
  },
  handles: {
    a: { x: "a", drag: (p) => ({ a: -20 + ((p.x - 40) * 40) / 440 }) },
    b: { x: "b", drag: (p) => ({ b: -20 + ((p.x - 40) * 40) / 440 }) },
  },
};

/** A bank account: a balance, one booking, and the new balance on a line. */
const accountX = (n: number) => 40 + (440 * (n + 100)) / 200;
const account: LabView = {
  render(v) {
    const change = v.op === 0 ? v.c : -v.c;
    const end = v.s + change;
    const y = 150;
    let out =
      open("Kontostand vor und nach einer Buchung") +
      title(`${paren(v.s, 0)} ${v.op === 0 ? "+" : "−"} ${paren(v.c, 0)} = ${n0(end)}`) +
      rect(40, y - 26, 220, 52, "lab-fill-b") +
      rect(260, y - 26, 220, 52, "lab-fill-a") +
      text(150, y - 34, "Schulden", "lab-text-b", "middle") +
      text(370, y - 34, "Guthaben", "lab-text-a", "middle") +
      line(accountX(0), y - 32, accountX(0), y + 32, "lab-axis") +
      text(accountX(0), y + 48, "0 €", "lab-text", "middle");
    if (change !== 0)
      out += arrow(accountX(v.s), y, accountX(end), y, change > 0 ? "lab-curve" : "lab-curve-2", 3);
    return (
      out +
      circle(accountX(end), y, 6, "lab-point-ok") +
      text(260, 228, `Neuer Kontostand: ${n0(end)} €`, "lab-text-big", "middle") +
      text(260, 252, v.c < 0 ? `Das Vorzeichen von ${n0(v.c)} kehrt die Richtung des Rechenzeichens um.` : "Das Rechenzeichen sagt, ob dazukommt oder wegkommt.", "lab-text-small", "middle") +
      rail("s", "Kontostand vorher", v.s, -50, 50, 300) +
      "</svg>"
    );
  },
  handles: { s: railHandle("s", -50, 50) },
};

/** Tries a value for x and shows the Umkehraufgabe once it fits. */
function equationView(model: typeof additiveEquation, min: number, max: number): LabView {
  return {
    render(v) {
      const equation = model(v.form, v.a, v.b);
      const left = equation.left(v.x);
      const fits = left === v.b;
      return (
        open("Gleichung mit einem eingesetzten Wert") +
        title("Setze einen Wert für x ein") +
        text(260, 80, equation.text("x"), "lab-text-big", "middle") +
        text(260, 125, equation.text(paren(v.x, 0)), "lab-text", "middle") +
        text(
          260,
          160,
          Number.isFinite(left)
            ? (Number.isInteger(left) ? `Die linke Seite hat den Wert ${n0(left)}.` : "Die linke Seite ergibt keine ganze Zahl.")
            : "Durch 0 darfst du nicht teilen.",
          "lab-text-small",
          "middle",
        ) +
        text(260, 200, fits ? "Passt: Beide Seiten sind gleich." : "Passt noch nicht.", fits ? "lab-text-ok" : "lab-text-bad", "middle") +
        (fits ? text(260, 232, `Umkehraufgabe: ${equation.inverse}`, "lab-text", "middle") : "") +
        rail("x", "x", v.x, min, max, 295) +
        "</svg>"
      );
    },
    handles: { x: railHandle("x", min, max) },
  };
}

const TREE_X0 = 20;
const TREE_W = 480;
/** Draws a term as a tree: the calculation that comes last stands on top. */
function treeNodes(node: TermNode, x0: number, x1: number, y: number): string {
  const x = (x0 + x1) / 2;
  if (typeof node === "number")
    return text(x, y + 5, node < 0 ? `−${-node}` : String(node), "lab-text", "middle");
  const mid = x;
  const [leftName, rightName] = partNames(node.op);
  const ly = y + 56;
  const leftX = (x0 + mid) / 2;
  const rightX = (mid + x1) / 2;
  return (
    line(x, y + 12, leftX, ly - 10, "lab-thin") +
    line(x, y + 12, rightX, ly - 10, "lab-thin") +
    (x1 - x0 > 200
      ? text(leftX - 6, y + 38, leftName, "lab-text-tick", "end") +
        text(rightX + 6, y + 38, rightName, "lab-text-tick", "start")
      : "") +
    rect(x - 13, y - 11, 26, 24, "lab-cell", 'rx="7"') +
    text(x, y + 6, node.op === "^" ? "hoch" : node.op, "lab-text-a", "middle") +
    treeNodes(node.left, x0, mid, ly) +
    treeNodes(node.right, mid, x1, ly)
  );
}

function termTreeView(terms: TermNode[]): LabView {
  return {
    render(v) {
      const term = terms[v.term];
      const steps = termSolve(term);
      const shown = Math.min(v.step, steps.length);
      return (
        open("Gliederung eines Terms als Baum") +
        title(`${termText(term)}: ${termKindPhrase(term)}`) +
        treeNodes(term, TREE_X0, TREE_X0 + TREE_W, 54) +
        (shown === 0
          ? text(260, 256, "Ziehe den Regler: So rechnest du Schritt für Schritt.", "lab-text-small", "middle")
          : text(260, 256, `= ${steps.slice(0, shown).join(" = ")}`, shown === steps.length ? "lab-text-ok" : "lab-text", "middle")) +
        rail("step", "Rechenschritt", v.step, 0, 4, 296) +
        "</svg>"
      );
    },
    handles: { step: railHandle("step", 0, 4) },
  };
}

/** Terms the labs of Lernbereich 1.2 and 3.2 break up; both are tested in mathematics.test.ts. */
export const ADD_TERMS: TermNode[] = [
  { op: "−", left: { op: "+", left: 34, right: -12 }, right: 9 },
  { op: "+", left: 25, right: { op: "−", left: 8, right: 15 } },
  { op: "−", left: { op: "−", left: 40, right: 7 }, right: { op: "+", left: 12, right: -5 } },
];
export const MIXED_TERMS: TermNode[] = [
  { op: "+", left: 6, right: { op: "·", left: 3, right: -4 } },
  { op: "·", left: { op: "+", left: 6, right: 3 }, right: -4 },
  { op: "−", left: { op: ":", left: 48, right: -6 }, right: { op: "^", left: 2, right: 3 } },
  { op: ":", left: { op: "−", left: 30, right: { op: "·", left: 2, right: 9 } }, right: 4 },
];

const SCALE = 42;
/** A circle around M and a line at distance d from M, as in a Geodreieck drawing. */
const circleLineView: LabView = {
  render(v) {
    const cx = 200;
    const cy = 165;
    const ly = cy - v.d * SCALE;
    const place = circleLine(v.d, v.r);
    const points = circleLinePoints(v.d, v.r);
    let out =
      open("Kreis und Gerade") +
      title(`${place}: ${points === 0 ? "kein gemeinsamer Punkt" : points === 1 ? "ein gemeinsamer Punkt" : "zwei gemeinsame Punkte"}`) +
      circle(cx, cy, v.r * SCALE, "lab-fill-a") +
      circle(cx, cy, 3, "lab-dot-small") +
      text(cx - 10, cy + 18, "M", "lab-text") +
      line(30, ly, 490, ly, "lab-side-b") +
      text(482, ly - 8, "g", "lab-text-b", "end") +
      line(cx, cy, cx, ly, "lab-dashed") +
      text(cx + 8, (cy + ly) / 2 + 4, `Abstand ${v.d} cm`, "lab-text-small");
    if (points === 1) out += circle(cx, ly, 5, "lab-point-ok");
    if (points === 2) {
      const half = Math.sqrt(v.r * v.r - v.d * v.d) * SCALE;
      out += circle(cx - half, ly, 5, "lab-point-ok") + circle(cx + half, ly, 5, "lab-point-ok");
    }
    return (
      out +
      text(cx - v.r * SCALE, cy + 4, "", "lab-text-small") +
      text(430, 280, `r = ${v.r} cm`, "lab-text-a", "middle") +
      text(430, 305, `k(M; ${v.r} cm)`, "lab-text-small", "middle") +
      handle("d", 80, ly, "Gerade g verschieben", "lab-handle lab-handle-b") +
      handle("r", cx + v.r * SCALE, cy, "Radius ziehen", "lab-handle lab-handle-a") +
      "</svg>"
    );
  },
  handles: {
    d: { y: "d", drag: (p) => ({ d: (165 - p.y) / SCALE }) },
    r: { x: "r", drag: (p) => ({ r: (p.x - 200) / SCALE }) },
  },
};

const CIRCLE_S = 30;
const twoCirclesView: LabView = {
  render(v) {
    const cx = 170;
    const cy = 150;
    const other = cx + v.d * CIRCLE_S;
    const points = twoCirclesPoints(v.d, v.r, v.s);
    return (
      open("Zwei Kreise") +
      title(`Die Kreise ${twoCircles(v.d, v.r, v.s)}.`) +
      circle(cx, cy, v.r * CIRCLE_S, "lab-fill-a") +
      circle(other, cy, v.s * CIRCLE_S, "lab-fill-b") +
      circle(cx, cy, 3, "lab-dot-small") +
      circle(other, cy, 3, "lab-dot-small") +
      line(cx, cy, other, cy, "lab-dashed") +
      text(cx - 6, cy + 18, "M₁", "lab-text-small") +
      text(other + 4, cy + 18, "M₂", "lab-text-small") +
      text(260, 278, `Abstand der Mittelpunkte: ${v.d} cm; Radien: ${v.r} cm und ${v.s} cm`, "lab-text-small", "middle") +
      text(260, 302, Number.isFinite(points) ? `Gemeinsame Punkte: ${points}` : "Die Kreise sind deckungsgleich.", "lab-text", "middle") +
      handle("d", other, cy, "Zweiten Kreis verschieben", "lab-handle lab-handle-b") +
      "</svg>"
    );
  },
  handles: { d: { x: "d", drag: (p) => ({ d: (p.x - 170) / CIRCLE_S }) } },
};

export const locusPlot = new Plot(-7, 7, -3, 6, { x: 42, y: 40, w: 436, h: 280 });
/** Where points lie that have a given distance from A(0|0) and from the x-axis as g. */
const locus: LabView = {
  render(v) {
    const p = locusPlot.P(v.px, v.py);
    const a = locusPlot.P(0, 0);
    const up = locusPlot.Y(v.d);
    const down = locusPlot.Y(-v.d);
    const dist = v.px * v.px + v.py * v.py;
    const place = dist === v.r * v.r ? "auf der Kreislinie" : dist < v.r * v.r ? "innerhalb des Kreises" : "außerhalb des Kreises";
    return (
      open("Punkte mit vorgegebenem Abstand") +
      text(260, 16, `P(${n0(v.px)}|${n0(v.py)}) liegt ${place}.`, "lab-text", "middle") +
      text(260, 32, `Abstand von g: ${Math.abs(v.py)} Kästchen`, "lab-text-small", "middle") +
      locusPlot.grid(1, 1, "g", "") +
      circle(a.x, a.y, v.r * locusPlot.sx, "lab-fill-a") +
      circle(a.x, a.y, 4, "lab-point-a") +
      text(a.x + 7, a.y + 15, "A", "lab-text-a") +
      line(42, up, 478, up, "lab-side-b") +
      (down <= 320 ? line(42, down, 478, down, "lab-side-b") : "") +
      handle("P", p.x, p.y, "Punkt P ziehen", "lab-handle lab-handle-b") +
      "</svg>"
    );
  },
  handles: {
    P: coordinateHandle("px", "py", (p) => ({ x: locusPlot.invX(p.x), y: locusPlot.invY(p.y) })),
  },
};

export const QUAD_A: GridPoint = { x: 1, y: 1 };
export const quadPlot = new Plot(0, 11, 0, 7, { x: 20, y: 44, w: 480, h: 264 });
export const quadPoints = (v: Record<string, number>): GridPoint[] => [
  QUAD_A,
  { x: v.bx, y: 1 },
  { x: v.cx, y: v.cy },
  { x: v.dx, y: v.dy },
];
const quadLab: LabView = {
  render(v) {
    const points = quadPoints(v);
    const pts = points.map((p) => quadPlot.P(p.x, p.y));
    const names = ["A", "B", "C", "D"];
    let out =
      open("Viereck mit verschiebbaren Ecken") +
      title(`Genauester Name: ${quadName(points)}`) +
      quadPlot.grid(1, 1, "", "") +
      polygon(pts, "lab-fill-a");
    pts.forEach((p, i) => {
      out += text(p.x + (i === 0 || i === 3 ? -14 : 8), p.y + (i < 2 ? 18 : -10), names[i], "lab-text");
    });
    return (
      out +
      circle(pts[0].x, pts[0].y, 5, "lab-point-a") +
      handle("B", pts[1].x, pts[1].y, "Ecke B") +
      handle("C", pts[2].x, pts[2].y, "Ecke C", "lab-handle lab-handle-a") +
      handle("D", pts[3].x, pts[3].y, "Ecke D", "lab-handle lab-handle-b") +
      "</svg>"
    );
  },
  handles: {
    B: { x: "bx", drag: (p) => ({ bx: quadPlot.invX(p.x) }) },
    C: coordinateHandle("cx", "cy", (p) => ({ x: quadPlot.invX(p.x), y: quadPlot.invY(p.y) })),
    D: coordinateHandle("dx", "dy", (p) => ({ x: quadPlot.invX(p.x), y: quadPlot.invY(p.y) })),
  },
};

/** Forward and backward through the same three calculations. */
const chain: LabView = {
  render(v) {
    const r1 = v.x * v.a;
    const r2 = r1 + v.b;
    const forward = v.dir === 0;
    const xs = [70, 220, 370];
    const box = (x: number, content: string, cls: string) =>
      rect(x - 42, 92, 84, 44, cls, 'rx="8"') + text(x, 120, content, "lab-text", "middle");
    const op = (x: number, label: string) =>
      arrow(forward ? x + 44 : x + 106, 114, forward ? x + 106 : x + 44, 114, forward ? "lab-curve" : "lab-curve-2", 2.5) +
      text(x + 75, 84, label, "lab-text-small", "middle");
    return (
      open("Rechenkette vorwärts und rückwärts") +
      title(forward ? "Vorwärtsarbeiten: vom Start zum Ziel" : "Rückwärtsarbeiten: vom Ziel zum Start") +
      box(xs[0], n0(v.x), "lab-fill-a") +
      op(xs[0], forward ? `· ${paren(v.a, 0)}` : `: ${paren(v.a, 0)}`) +
      box(xs[1], n0(r1), "lab-cell") +
      op(xs[1], forward ? `+ ${paren(v.b, 0)}` : `− ${paren(v.b, 0)}`) +
      box(xs[2], n0(r2), "lab-fill-ok") +
      text(260, 190, forward ? `${paren(v.x, 0)} · ${paren(v.a, 0)} + ${paren(v.b, 0)} = ${n0(r2)}` : v.a === 0 ? "Durch 0 kannst du nicht zurückrechnen." : `(${paren(r2, 0)} − ${paren(v.b, 0)}) : ${paren(v.a, 0)} = ${n0(v.x)}`, "lab-text-big", "middle") +
      text(260, 225, forward ? "Jede Rechnung baut auf der vorigen auf." : "Du machst jede Rechnung rückgängig, von hinten nach vorn.", "lab-text-small", "middle") +
      rail("x", "Startzahl", v.x, -20, 20, 295) +
      "</svg>"
    );
  },
  handles: { x: railHandle("x", -20, 20) },
};

/** Sum with a chosen order of the summands: the tidy order gives round steps. */
export const REGROUP_TERMS: number[][] = [
  [27, -13, 23, -7],
  [-48, 95, -52, 5],
  [64, 17, -14, -7, 40],
];
const regroupOrder = (numbers: number[], sorted: boolean): number[] => {
  if (!sorted) return numbers;
  // Pair the numbers whose sum is a multiple of ten; what stays pairs up at the end.
  const rest = [...numbers];
  const out: number[] = [];
  while (rest.length > 0) {
    const first = rest.shift()!;
    const partner = rest.findIndex((n) => (first + n) % 10 === 0);
    out.push(first);
    if (partner >= 0) out.push(rest.splice(partner, 1)[0]);
  }
  return out;
};
export const regroupSteps = (numbers: number[], sorted: boolean): number[] => {
  const order = regroupOrder(numbers, sorted);
  const sums: number[] = [];
  order.reduce((sum, n) => {
    sums.push(sum + n);
    return sum + n;
  }, 0);
  return sums.slice(1);
};
const sumText = (numbers: number[]) =>
  numbers
    .map((n, i) => (i === 0 ? n0(n) : n < 0 ? `− ${-n}` : `+ ${n}`))
    .join(" ");
const regroup: LabView = {
  render(v) {
    const numbers = REGROUP_TERMS[v.term];
    const order = regroupOrder(numbers, v.order === 1);
    const steps = regroupSteps(numbers, v.order === 1);
    return (
      open("Eine Summe in zwei Reihenfolgen") +
      title(v.order === 1 ? "Geschickt geordnet" : "In der gegebenen Reihenfolge") +
      text(260, 80, sumText(order), "lab-text-big", "middle") +
      steps
        .map((s, i) => {
          const round = s % 10 === 0;
          return (
            rect(140, 102 + i * 34, 240, 28, round ? "lab-fill-ok" : "lab-cell", 'rx="6"') +
            text(260, 121 + i * 34, `Zwischenergebnis ${i + 1}: ${n0(s)}`, round ? "lab-text-ok" : "lab-text", "middle")
          );
        })
        .join("") +
      text(260, 300, "Jede Differenz ist eine Summe: 27 − 13 = 27 + (−13).", "lab-text-small", "middle") +
      "</svg>"
    );
  },
};

/** The Distributivgesetz as a rectangle: a · (b + c) and a · (b − c). */
const distributive: LabView = {
  render(v) {
    const minus = v.op === 1;
    const total = minus ? v.b - v.c : v.b + v.c;
    const s = 420 / (minus ? v.b : v.b + v.c);
    const height = Math.min(120, v.a * 12);
    const top = 78;
    const leftWidth = v.b * s;
    return (
      open("Rechteck zerlegt in zwei Teile") +
      title(`${v.a} · (${v.b} ${minus ? "−" : "+"} ${v.c}) = ${v.a} · ${v.b} ${minus ? "−" : "+"} ${v.a} · ${v.c}`) +
      rect(50, top, leftWidth, height, "lab-fill-a") +
      (minus
        ? rect(50 + leftWidth - v.c * s, top, v.c * s, height, "lab-fill-b")
        : rect(50 + leftWidth, top, v.c * s, height, "lab-fill-b")) +
      text(260, 226, `${fmt(v.a * v.b, 0)} ${minus ? "−" : "+"} ${fmt(v.a * v.c, 0)} = ${fmt(v.a * total, 0)}`, "lab-text-big", "middle") +
      text(260, 252, minus ? "Das helle Stück wird vom ganzen Rechteck abgezogen." : "Beide Teile zusammen sind das ganze Rechteck.", "lab-text-small", "middle") +
      rail("a", "a", v.a, 2, 12, 300) +
      "</svg>"
    );
  },
  handles: { a: railHandle("a", 2, 12) },
};

/** A lake on a grid and the rectangle that replaces it. Its true area: LAKE_AREA km². */
const LAKE: GridPoint[] = [
  { x: 2, y: 1 }, { x: 5, y: 1 }, { x: 8, y: 2 }, { x: 9, y: 4 }, { x: 7, y: 5 }, { x: 4, y: 5 }, { x: 2, y: 4 }, { x: 1, y: 2 },
];
export const LAKE_AREA = Math.abs(
  LAKE.reduce((sum, p, i) => {
    const q = LAKE[(i + 1) % LAKE.length];
    return sum + p.x * q.y - q.x * p.y;
  }, 0),
) / 2;
const lakePlot = new Plot(0, 10, 0, 6, { x: 40, y: 44, w: 440, h: 240 });
const approxRect: LabView = {
  render(v) {
    const left = 5 - v.w / 2;
    const bottom = 3 - v.h / 2;
    const a = lakePlot.P(left, bottom + v.h);
    return (
      open("See auf Karopapier und ein Rechteck als Näherung") +
      title(`Rechteck: ${v.w} km · ${v.h} km = ${v.w * v.h} km²`) +
      lakePlot.grid(1, 2, "", "") +
      polygon(LAKE.map((p) => lakePlot.P(p.x, p.y)), "lab-fill-b") +
      rect(a.x, a.y, v.w * lakePlot.sx, v.h * lakePlot.sy, "lab-fill-a") +
      text(260, 310, "Ein Kästchen hat 1 km Seitenlänge.", "lab-text-tick", "middle") +
      handle("w", a.x + v.w * lakePlot.sx, lakePlot.Y(3), "Breite ziehen", "lab-handle lab-handle-a") +
      handle("h", lakePlot.X(5), a.y, "Höhe ziehen", "lab-handle lab-handle-b") +
      "</svg>"
    );
  },
  handles: {
    w: { x: "w", drag: (p) => ({ w: 2 * (lakePlot.invX(p.x) - 5) }) },
    h: { y: "h", drag: (p) => ({ h: 2 * (lakePlot.invY(p.y) - 3) }) },
  },
};

/** A box with a cube on top, as an oblique drawing. */
const OB = 22;
const boxStack: LabView = {
  render(v) {
    const k = Math.min(v.k, v.a, v.c);
    const x0 = 120;
    const y0 = 285;
    const iso = (x: number, y: number, z: number) => ({
      x: x0 + x * OB + z * OB * 0.35,
      y: y0 - y * OB - z * OB * 0.35,
    });
    const face = (pts: Array<[number, number, number]>, cls: string) =>
      polygon(pts.map(([x, y, z]) => iso(x, y, z)), cls);
    const drawBox = (x: number, y: number, z: number, a: number, b: number, c: number, cls: string) =>
      face([[x, y, z], [x + a, y, z], [x + a, y + b, z], [x, y + b, z]], cls) +
      face([[x + a, y, z], [x + a, y, z + c], [x + a, y + b, z + c], [x + a, y + b, z]], cls) +
      face([[x, y + b, z], [x + a, y + b, z], [x + a, y + b, z + c], [x, y + b, z + c]], cls);
    return (
      open("Quader mit aufgesetztem Würfel im Schrägbild") +
      title(`Oberflächeninhalt: ${fmt(stackSurface(v.a, v.b, v.c, k), 0)} cm²`) +
      drawBox(0, 0, 0, v.a, v.b, v.c, "lab-fill-a") +
      drawBox((v.a - k) / 2, v.b, (v.c - k) / 2, k, k, k, "lab-fill-b") +
      text(420, 90, `Quader allein: ${fmt(boxSurface(v.a, v.b, v.c), 0)} cm²`, "lab-text-small", "middle") +
      text(420, 112, `Würfel Kantenlänge ${k} cm`, "lab-text-small", "middle") +
      text(420, 134, `+ 4 · ${k * k} cm² dazu`, "lab-text-small", "middle") +
      handle("a", iso(v.a, 0, 0).x, iso(v.a, 0, 0).y, "Länge a ziehen", "lab-handle lab-handle-a") +
      "</svg>"
    );
  },
  handles: { a: { x: "a", drag: (p) => ({ a: (p.x - 120) / OB }) } },
};

/** Milliarden, Millionen and Tausender set apart, as a number is read aloud. */
export const numberName = (mrd: number, mio: number, tsd: number, rest = 0): string => {
  const parts: string[] = [];
  if (mrd > 0) parts.push(`${mrd} ${mrd === 1 ? "Milliarde" : "Milliarden"}`);
  if (mio > 0) parts.push(`${mio} ${mio === 1 ? "Million" : "Millionen"}`);
  if (tsd > 0) parts.push(`${tsd} Tausend`);
  if (rest > 0 || parts.length === 0) parts.push(String(rest));
  return parts.join(" ");
};
const numberNames: LabView = {
  render(v) {
    const value = v.mrd * 1e9 + v.mio * 1e6 + v.tsd * 1e3;
    const groups = [
      ["Milliarden", v.mrd],
      ["Millionen", v.mio],
      ["Tausender", v.tsd],
      ["Einer", 0],
    ] as const;
    let out = open("Dreiergruppen einer großen Zahl") + title("Von rechts in Dreiergruppen");
    groups.forEach(([name, group], i) => {
      const x = 44 + i * 112;
      out +=
        rect(x, 70, 100, 70, i === 3 ? "lab-cell" : "lab-fill-a", 'rx="8"') +
        text(x + 50, 92, name, "lab-text-small", "middle") +
        text(x + 50, 125, String(group).padStart(3, "0"), "lab-text-big", "middle");
    });
    return (
      out +
      text(260, 182, fmt(value, 0), "lab-text-big", "middle") +
      text(260, 212, numberName(v.mrd, v.mio, v.tsd), "lab-text", "middle") +
      rail("mio", "Millionen", v.mio, 0, 999, 295) +
      "</svg>"
    );
  },
  handles: { mio: railHandle("mio", 0, 999) },
};

export const SIZE_KINDS = [
  { big: "m", small: "cm", base: 100 },
  { big: "kg", small: "g", base: 1000 },
  { big: "€", small: "ct", base: 100 },
];
/** A size in two units times a whole number, written again in the two units. */
export function sizeTimes(kind: number, whole: number, part: number, k: number): string {
  const { big, small, base } = SIZE_KINDS[kind];
  const total = (whole * base + part) * k;
  const bigs = Math.floor(total / base);
  const smalls = total % base;
  return smalls === 0 ? `${n0(bigs)} ${big}` : `${n0(bigs)} ${big} ${n0(smalls)} ${small}`;
}
const sizeTimesView: LabView = {
  render(v) {
    const { big, small, base } = SIZE_KINDS[v.kind];
    const value = v.whole * base + v.part;
    const rows = [
      (v.part === 0 ? `${v.whole} ${big}` : `${v.whole} ${big} ${v.part} ${small}`),
      `= ${n0(value)} ${small}`,
      `${n0(value)} ${small} · ${v.k} = ${n0(value * v.k)} ${small}`,
      `= ${sizeTimes(v.kind, v.whole, v.part, v.k)}`,
    ];
    let out = open("Eine Größe mit einem Faktor malnehmen") + title("Erst die Einheit angleichen, dann die Maßzahl vervielfachen");
    rows.forEach((row, i) => {
      out += text(260, 90 + i * 38, row, i === 3 ? "lab-text-ok" : "lab-text-big", "middle");
    });
    return out + rail("k", "Faktor", v.k, 1, 9, 295) + "</svg>";
  },
  handles: { k: railHandle("k", 1, 9) },
};

export const GYM_VIEWS: Record<string, LabView> = {
  "number-names": numberNames,
  "size-times": sizeTimesView,
  "compare-abs": compareAbs,
  account,
  "equation-add": equationView(additiveEquation, -40, 40),
  "equation-mul": equationView(multiplicativeEquation, -60, 60),
  "term-tree-add": termTreeView(ADD_TERMS),
  "term-tree-mixed": termTreeView(MIXED_TERMS),
  "circle-line": circleLineView,
  "two-circles": twoCirclesView,
  locus,
  "quad-lab": quadLab,
  chain,
  regroup,
  distributive,
  "approx-rect": approxRect,
  "box-stack": boxStack,
};
