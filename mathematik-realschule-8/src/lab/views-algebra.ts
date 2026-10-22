import { fmt } from "../exercises/format";
import { solveLinear, solveRatio } from "../math";
import type { LabKind } from "../model/types";
import { arrow, circle, clipped, handle, line, open, Plot, rect, text, type LabView } from "./svg";

const operations: LabView = {
  render: (v) => {
    let out = open("Vier Teilprodukte werden zu gleichartigen Gliedern zusammengefasst");
    const cells = [
      { x: 95, y: 75, title: "a·xᵖ × c·xᵖ", value: `${v.a * v.c}x^${2 * v.p}`, cls: "lab-fill-a" },
      { x: 275, y: 75, title: "a·xᵖ × y", value: `${v.a}x^${v.p}y`, cls: "lab-fill-b" },
      { x: 95, y: 175, title: "b·y × c·xᵖ", value: `${v.b * v.c}x^${v.p}y`, cls: "lab-fill-b" },
      { x: 275, y: 175, title: "b·y × y", value: `${v.b}y²`, cls: "lab-fill-c" },
    ];
    for (const c of cells)
      out +=
        rect(c.x, c.y, 150, 80, c.cls) +
        text(c.x + 75, c.y + 25, c.title, "lab-text-small", "middle") +
        text(c.x + 75, c.y + 55, c.value, "lab-text", "middle");
    return (
      out +
      text(260, 35, `( ${v.a}x^${v.p} + (${v.b})y )( ${v.c}x^${v.p} + y )`, "lab-text", "middle") +
      text(
        260,
        310,
        `Gemischt: ${v.a} + (${v.b * v.c}) = ${v.a + v.b * v.c}`,
        "lab-text-big",
        "middle",
      ) +
      "</svg>"
    );
  },
};

const binomial: LabView = {
  render: (v) => {
    let out = open("Flächenzerlegung zu einer binomischen Formel");
    if (v.formula === 0) {
      const s = 240 / (v.a + v.b),
        a = v.a * s,
        b = v.b * s,
        x = 140,
        y = 45;
      out +=
        rect(x, y, a, a, "lab-fill-a") +
        rect(x + a, y, b, a, "lab-fill-b") +
        rect(x, y + a, a, b, "lab-fill-b") +
        rect(x + a, y + a, b, b, "lab-fill-c") +
        text(x + a / 2, y + a / 2, `a²=${v.a ** 2}`, "lab-text", "middle") +
        text(x + a + b / 2, y + a / 2, "ab", "lab-text-small", "middle") +
        text(x + a / 2, y + a + b / 2 + 4, "ab", "lab-text-small", "middle") +
        text(x + a + b / 2, y + a + b / 2 + 4, "b²", "lab-text-small", "middle");
    } else if (v.formula === 1) {
      const s = 23,
        a = v.a * s,
        b = v.b * s,
        x = 140,
        y = 40;
      out +=
        rect(x, y, a, a, "lab-fill-a") +
        rect(x + a - b, y, b, a, "lab-negative") +
        rect(x, y + a - b, a, b, "lab-negative") +
        rect(x + a - b, y + a - b, b, b, "lab-fill-c") +
        rect(x, y, a - b, a - b, "lab-shape") +
        text(x + (a - b) / 2, y + (a - b) / 2 + 4, `(a−b)²`, "lab-text", "middle") +
        text(260, 295, "Zwei Streifen abziehen, Ecke einmal zurück", "lab-text-small", "middle");
    } else {
      const s = 17,
        a = v.a * s,
        b = v.b * s;
      out +=
        rect(45, 55, a, a, "lab-fill-a") +
        rect(45 + a - b, 55 + a - b, b, b, "lab-negative") +
        text(130, 285, "a² − b²", "lab-text", "middle") +
        rect(285, 55, (v.a + v.b) * 15, (v.a - v.b) * 15, "lab-shape-2") +
        text(385, 285, "(a+b)(a−b)", "lab-text", "middle");
    }
    const total =
      v.formula === 0 ? (v.a + v.b) ** 2 : v.formula === 1 ? (v.a - v.b) ** 2 : v.a ** 2 - v.b ** 2;
    return (
      out +
      text(260, 328, `Gesamter Flächeninhalt: ${total} cm²`, "lab-text-big", "middle") +
      "</svg>"
    );
  },
};

const factoring: LabView = {
  render: (v, r) =>
    open("Summenterm wird durch Erkennen gemeinsamer Faktoren zur Produktform") +
    rect(35, 40, 450, 85, "lab-shape") +
    text(260, 90, String(r.sum), "lab-text-big", "middle") +
    arrow(260, 140, 260, 195, "lab-side-b") +
    rect(35, 215, 450, 85, "lab-shape-2") +
    text(260, 265, String(r.product), "lab-text-big", "middle") +
    text(
      260,
      330,
      v.mode === 0
        ? "Gemeinsamen Faktor ausklammern"
        : v.mode === 1
          ? "Dritte binomische Formel rückwärts"
          : "Vollständiges Quadrat erkennen",
      "lab-text-small",
      "middle",
    ) +
    "</svg>",
};

const termPlot = new Plot(-7, 7, -8, 20, { x: 55, y: 25, w: 420, h: 280 });
const extrema: LabView = {
  render: (v) => {
    const p = termPlot,
      a = [-2, -1, 0.5, 1, 2][v.factor],
      f = (x: number) => a * (x - v.h) ** 2 + v.k,
      S = p.P(v.h, v.k),
      P = p.P(v.x, f(v.x));
    let out =
      open("Werte eines quadratischen Terms und sein Extremwert") +
      p.grid(2, 4, "x", "T(x)") +
      p.clip("term-area") +
      clipped("term-area", p.graph(f)) +
      circle(S.x, S.y, 5, "lab-point-ok") +
      text(S.x + 8, S.y - 10, `${v.factor < 2 ? "Max" : "Min"} ${v.k}`);
    if (p.contains(v.x, f(v.x))) out += handle("x", P.x, P.y, "Prüfstelle x");
    return (
      out + text(260, 334, `T(${fmt(v.x, 1)}) = ${fmt(f(v.x), 2)}`, "lab-text", "middle") + "</svg>"
    );
  },
  handles: { x: { x: "x", drag: (p) => ({ x: termPlot.invX(p.x) }) } },
};

const equations: LabView = {
  render: (v) => {
    const s = solveLinear(v.a, v.b, v.c, v.d),
      result =
        s.kind === "all"
          ? "Alle rationalen Zahlen"
          : s.kind === "none"
            ? "Keine Lösung"
            : `x = (${v.d - v.b})/(${v.a - v.c})`;
    return (
      open("Äquivalenzumformung einer linearen Gleichung") +
      rect(25, 35, 470, 70, "lab-shape") +
      text(260, 78, `${v.a}x + (${v.b}) = ${v.c}x + (${v.d})`, "lab-text-big", "middle") +
      arrow(260, 120, 260, 155, "lab-side-b") +
      text(280, 140, "−cx, −b", "lab-text-small") +
      text(260, 190, `${v.a - v.c}x = ${v.d - v.b}`, "lab-text-big", "middle") +
      rect(35, 235, 450, 65, s.kind === "none" ? "lab-negative" : "lab-shape-2") +
      text(260, 275, result, "lab-text-big", "middle") +
      "</svg>"
    );
  },
};

const words: LabView = {
  render: (v) => {
    const cost = v.base + v.unit * v.count,
      scale = 400 / Math.max(60, cost, v.budget);
    return (
      open("Kosten setzen sich aus Grundpreis und variablem Betrag zusammen") +
      text(35, 45, `Kosten: ${v.base} + ${v.unit} · ${v.count} = ${cost} €`) +
      rect(35, 70, v.base * scale, 60, "lab-fill-a") +
      rect(35 + v.base * scale, 70, v.unit * v.count * scale, 60, "lab-fill-b") +
      text(35, 180, `Zielbetrag: ${v.budget} €`) +
      rect(35, 205, v.budget * scale, 60, "lab-shape-2") +
      text(
        260,
        315,
        `Differenz: ${cost - v.budget} €`,
        cost === v.budget ? "lab-text-ok" : "lab-text",
        "middle",
      ) +
      "</svg>"
    );
  },
};

const numberPlot = new Plot(-14, 14, 0, 1, { x: 35, y: 80, w: 450, h: 180 });
const inequalities: LabView = {
  render: (v) => {
    const p = numberPlot,
      a = [-3, -2, -1, 1, 2, 3][v.factor],
      boundary = (v.d - v.b) / a,
      xx = p.X(boundary),
      y = 180,
      left = a > 0 ? xx : p.X(-14),
      right = a > 0 ? p.X(14) : xx;
    let out =
      open("Lösungsmenge einer Ungleichung auf der Zahlengeraden") +
      text(260, 50, `${a}x + (${v.b}) ≥ ${v.d}`, "lab-text-big", "middle") +
      rect(left, y - 9, right - left, 18, "lab-fill-b") +
      arrow(p.X(-14), y, p.X(14), y, "lab-axis");
    for (let i = -12; i <= 12; i += 2)
      out +=
        line(p.X(i), y - 5, p.X(i), y + 5, "lab-thin") +
        text(p.X(i), y + 22, fmt(i), "lab-text-tick", "middle");
    out +=
      circle(xx, y, 6, "lab-point-ok") +
      text(xx, y - 20, `(${v.d - v.b})/(${a})`, "lab-text-small", "middle") +
      handle("x", p.X(v.x), y + 55, "Prüfwert x") +
      text(
        260,
        320,
        a * v.x + v.b >= v.d
          ? `x = ${fmt(v.x, 1)} ist erlaubt`
          : `x = ${fmt(v.x, 1)} ist nicht erlaubt`,
        a * v.x + v.b >= v.d ? "lab-text-ok" : "lab-text-bad",
        "middle",
      );
    return `${out}</svg>`;
  },
  handles: { x: { x: "x", drag: (p) => ({ x: numberPlot.invX(p.x) }) } },
};

const domainPlot = new Plot(-6, 6, 0, 1, { x: 40, y: 100, w: 440, h: 150 });
const domain: LabView = {
  render: (v) => {
    const p = domainPlot,
      y = 180;
    let out =
      open("Definitionsmenge mit bleibenden Ausschlüssen nach dem Kürzen") +
      text(
        260,
        45,
        v.cancel ? `1/(x − (${v.q}))` : `(x − (${v.p}))/((x − (${v.p}))(x − (${v.q})))`,
        "lab-text",
        "middle",
      ) +
      arrow(40, y, 480, y, "lab-axis");
    for (let x = -5; x <= 5; x++)
      out +=
        line(p.X(x), y - 4, p.X(x), y + 4, "lab-thin") +
        text(p.X(x), y + 22, fmt(x), "lab-text-tick", "middle");
    for (const x of new Set([v.p, v.q])) out += circle(p.X(x), y, 7, "lab-hole");
    out +=
      handle("x", p.X(v.x), y + 60, "Prüfwert x") +
      text(
        260,
        320,
        "Die Löcher stammen immer aus dem ursprünglichen Nenner.",
        "lab-text-small",
        "middle",
      );
    return `${out}</svg>`;
  },
  handles: { x: { x: "x", drag: (p) => ({ x: domainPlot.invX(p.x) }) } },
};

const ratio: LabView = {
  render: (v) => {
    const s = solveRatio(v.a, v.p, v.b, v.q);
    return (
      open("Bruchgleichung, Nennerbeseitigung und Prüfung der Definitionsmenge") +
      text(260, 45, `${v.a}/(x − (${v.p})) = ${v.b}/(x − (${v.q}))`, "lab-text-big", "middle") +
      text(
        260,
        90,
        `Verboten: ${v.p}${v.p === v.q ? "" : ` und ${v.q}`}`,
        "lab-text-bad",
        "middle",
      ) +
      arrow(260, 110, 260, 150, "lab-side-b") +
      text(260, 185, `${v.a}(x − (${v.q})) = ${v.b}(x − (${v.p}))`, "lab-text", "middle") +
      text(260, 225, `${v.a - v.b}x = ${v.a * v.q - v.b * v.p}`, "lab-text", "middle") +
      rect(30, 260, 460, 55, "lab-shape-2") +
      text(
        260,
        294,
        s.kind === "one"
          ? `Zulässige Lösung: (${v.a * v.q - v.b * v.p})/(${v.a - v.b})`
          : s.kind === "all"
            ? "Alle Zahlen aus D"
            : "Keine zulässige Lösung",
        "lab-text",
        "middle",
      ) +
      "</svg>"
    );
  },
};

const rearrange: LabView = {
  render: (v) => {
    const hours = v.distance / v.speed,
      scale = 390 / 240;
    return (
      open("Wegstrecke und Fahrzeit bei konstanter Geschwindigkeit") +
      text(260, 45, `t = ${v.distance} km / (${v.speed} km/h)`, "lab-text-big", "middle") +
      line(55, 160, 445, 160, "lab-ink") +
      rect(55, 150, v.distance * scale, 20, "lab-fill-a") +
      circle(55 + v.distance * scale, 160, 9, "lab-point-ok") +
      text(55, 200, "0 km", "lab-text-small") +
      text(445, 200, "240 km", "lab-text-small", "end") +
      text(260, 280, `Zeit: ${fmt(hours, 2)} h`, "lab-text-big", "middle") +
      text(
        260,
        325,
        "Gleicher Weg: doppelte Geschwindigkeit → halbe Zeit",
        "lab-text-small",
        "middle",
      ) +
      "</svg>"
    );
  },
};

export const ALGEBRA_VIEWS: Partial<Record<LabKind, LabView>> = {
  "term-operations": operations,
  binomial,
  factoring,
  "term-extremum": extrema,
  equation: equations,
  "word-equation": words,
  inequality: inequalities,
  domain,
  "rational-equation": ratio,
  rearrange,
};
