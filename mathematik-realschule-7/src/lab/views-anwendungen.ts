import { fmt, linear, sum, term as formatTerm } from "../exercises/format";
import { flipRelation } from "../models";
import { compare, RELATIONS } from "../curriculum/stage-6-algebra";
import {
  Plot,
  circle,
  clipped,
  handle,
  line,
  open,
  rect,
  text,
  type LabView,
} from "./svg";
import { rail, railHandle, railX, title } from "./view-helpers";
const term: LabView = {
  render(v, r) {
    const expressions = [
      sum([
        [v.a, "x"],
        [v.b, "x"],
      ]),
      `(${formatTerm(v.a, "x", true) || "0"}) · (${formatTerm(v.b, "x", true) || "0"})`,
      formatTerm(v.a, `(${linear(1, v.b)})`, true) || "0",
    ];
    return (
      open("Originalterm und vereinfachter Term mit derselben Probezahl") +
      title(`x = ${fmt(v.x)}`) +
      rect(35, 55, 450, 80, "lab-panel", 'rx="10"') +
      text(260, 85, expressions[v.mode], "lab-text-big", "middle") +
      text(260, 116, `Wert: ${fmt(Number(r.original))}`, "lab-text", "middle") +
      text(260, 165, "↓ Rechengesetz anwenden", "lab-text-small", "middle") +
      rect(35, 180, 450, 65, "lab-panel", 'rx="10"') +
      text(260, 205, String(r.simple), "lab-text-big", "middle") +
      text(260, 233, `Wert: ${fmt(Number(r.check))}`, "lab-text", "middle") +
      rail("x", "Probezahl x", v.x, -3, 3, 300) +
      "</svg>"
    );
  },
  handles: { x: railHandle("x", -3, 3) },
};
const equation: LabView = {
  render(v, r) {
    const left = Number(r.left),
      right = Number(r.right),
      extent = Math.max(10, Math.abs(left), Math.abs(right)),
      s = 200 / extent;
    return (
      open(
        "Zwei Gleichungsseiten als gerichtete Werte um eine gemeinsame Null",
      ) +
      title(`${linear(v.a, v.b)} = ${linear(v.d, v.c)}`) +
      line(260, 65, 260, 240, "lab-dashed") +
      text(260, 58, "0", "lab-text-tick", "middle") +
      rect(260, 90, left * s, 38, "lab-fill-a") +
      rect(260, 175, right * s, 38, "lab-fill-b") +
      text(35, 82, `Links: ${fmt(left)}`) +
      text(35, 165, `Rechts: ${fmt(right)}`) +
      text(
        260,
        252,
        left === right
          ? "Gleichheit getroffen"
          : "Die Seitenwerte sind verschieden",
        "lab-text",
        "middle",
      ) +
      rail("x", "Probezahl x", v.x, -5, 5, 300) +
      "</svg>"
    );
  },
  handles: { x: railHandle("x", -5, 5) },
};
const inequality: LabView = {
  render(v) {
    const y = 145,
      min = -6,
      max = 6,
      px = (n: number) => railX(n, min, max);
    let out =
      open("Lösungsmenge einer linearen Ungleichung auf der Zahlengeraden") +
      title(`${linear(v.a, v.b)} ${RELATIONS[v.relation]} ${fmt(v.c)}`) +
      line(65, y, 455, y, "lab-axis");
    for (let n = min; n <= max; n++)
      out +=
        line(px(n), y - 5, px(n), y + 5, "lab-axis") +
        text(px(n), y + 23, fmt(n, 0), "lab-text-tick", "middle");
    if (v.a !== 0) {
      const bound = (v.c - v.b) / v.a,
        rel =
          v.a < 0 ? flipRelation(RELATIONS[v.relation]) : RELATIONS[v.relation],
        left = rel === "<" || rel === "≤",
        closed = rel === "≤" || rel === "≥",
        cut = Math.max(min, Math.min(max, bound)),
        start = left ? min : cut,
        end = left ? cut : max;
      out += rect(px(start), y - 15, px(end) - px(start), 30, "lab-fill-a");
      if (bound >= min && bound <= max)
        out += circle(px(bound), y, 6, closed ? "lab-dot-small" : "lab-open");
      out += text(
        260,
        220,
        `x ${rel} ${fmt(bound)}${closed ? " (Rand eingeschlossen)" : " (Rand offen)"}`,
        "lab-text",
        "middle",
      );
    } else
      out += text(
        260,
        220,
        compare(v.b, v.c, v.relation)
          ? "Jede rationale Zahl ist Lösung"
          : "Keine Lösung",
        "lab-text",
        "middle",
      );
    return out + rail("x", "Probezahl x", v.x, min, max, 295) + "</svg>";
  },
  handles: { x: railHandle("x", -6, 6) },
};
const cost: LabView = {
  render(v) {
    const actual = v.fee + v.price * v.n,
      max = Math.max(1, actual, v.budget),
      s = 390 / max;
    return (
      open("Grundkosten und variable Kosten im Vergleich mit dem Budget") +
      title(`${v.fee} € + ${v.price} € · ${v.n} = ${actual} €`) +
      rect(65, 80, v.fee * s, 45, "lab-fill-b") +
      rect(65 + v.fee * s, 80, v.price * v.n * s, 45, "lab-fill-a") +
      text(65, 65, `Kosten ${actual} €`) +
      rect(65, 165, v.budget * s, 45, "lab-fill-ok") +
      text(
        65,
        150,
        `${"strict" in v ? (v.strict === 0 ? "Höchstens" : "Weniger als") : "Gesamtpreis"} ${v.budget} €`,
      ) +
      text(
        260,
        245,
        "Orange: Grundpreis · Blau: Anzahl × Stückpreis",
        "lab-text-small",
        "middle",
      ) +
      rail("n", "Anzahl", v.n, 0, "strict" in v ? 9 : 8, 300) +
      "</svg>"
    );
  },
  handles: {
    n: {
      x: "n",
      drag: (p, v) => railHandle("n", 0, "strict" in v ? 9 : 8).drag(p, v),
    },
  },
};
const percentView = (reverse: boolean): LabView => ({
  render(v) {
    const factor = 1 + ((v.mode === 0 ? -1 : 1) * v.p) / 100,
      base = reverse ? v.new / factor : v.base,
      value = reverse ? v.new : base * factor,
      max = Math.max(base, value),
      s = 390 / max;
    return (
      open("Ursprünglicher und veränderter Grundwert als Vergleichsbalken") +
      title(
        `Faktor ${fmt(factor)}${reverse ? " – rückwärts durch den Faktor teilen" : ""}`,
      ) +
      text(65, 65, `Alter Wert: ${fmt(base, 2)} €`) +
      rect(65, 80, base * s, 45, "lab-fill-a") +
      text(65, 158, `Neuer Wert: ${fmt(value, 2)} €`) +
      rect(65, 175, value * s, 45, "lab-fill-b") +
      rail("p", "Änderung in Prozent", v.p, 5, 50, 300) +
      "</svg>"
    );
  },
  handles: { p: railHandle("p", 5, 50) },
});
const interest: LabView = {
  render(v) {
    const z = (v.capital * v.p) / 100,
      s = 390 / (v.capital + z);
    return (
      open("Kapital und Jahreszinsen als Anteile des Endbetrags") +
      title("Genau ein Jahr, ohne weitere Zahlungen") +
      text(65, 95, `Kapital ${v.capital} €`) +
      rect(65, 115, v.capital * s, 55, "lab-fill-a") +
      rect(65 + v.capital * s, 115, z * s, 55, "lab-fill-b") +
      text(65, 207, `Zinsen ${fmt(z, 2)} € bei ${fmt(v.p)} %`) +
      text(65, 238, `Endbetrag ${fmt(v.capital + z, 2)} €`) +
      rail("capital", "Kapital in Euro", v.capital, 200, 2000, 300) +
      "</svg>"
    );
  },
  handles: { capital: railHandle("capital", 200, 2000) },
};
const inversePlot = new Plot(0, 13, 0, 52, { x: 55, y: 40, w: 420, h: 250 });
const inverse: LabView = {
  render(v) {
    const p = inversePlot,
      y = v.k / v.x;
    return (
      open("Hyperbelast und Rechteck mit konstantem Flächenprodukt") +
      p.grid(1, 4, "Anzahl x", "Zeit y") +
      `<defs>${p.clip("inverse")}</defs>` +
      clipped(
        "inverse",
        rect(p.X(0), p.Y(y), v.x * p.sx, y * p.sy, "lab-fill-a") +
          p.graph((x) => (x === 0 ? Number.NaN : v.k / x)) +
          line(p.X(v.x), p.Y(0), p.X(v.x), p.Y(y), "lab-dashed"),
      ) +
      handle("point", p.X(v.x), p.Y(y), "Punkt auf dem Hyperbelast") +
      text(
        260,
        325,
        `x · y = ${v.k}; (${v.x} | ${fmt(y)})`,
        "lab-text",
        "middle",
      ) +
      "</svg>"
    );
  },
  handles: { point: { x: "x", drag: (p) => ({ x: inversePlot.invX(p.x) }) } },
};
const comparePlot = new Plot(0, 9, 0, 33, { x: 55, y: 40, w: 420, h: 250 });
const proportion: LabView = {
  render(v) {
    const p = comparePlot,
      f = (x: number) =>
        v.mode === 0 ? 3 * x : v.mode === 1 ? 24 / x : 4 + 3 * x,
      y = f(v.x);
    return (
      open(
        "Graph einer direkten, indirekten oder nicht proportionalen Zuordnung",
      ) +
      p.grid(1, 4) +
      `<defs>${p.clip("compare")}</defs>` +
      clipped("compare", p.graph(f)) +
      handle("point", p.X(v.x), p.Y(y), "Punkt auf dem Graphen") +
      text(
        260,
        325,
        [
          "Gerade durch den Ursprung",
          "Hyperbelast für positive x",
          "Gerade mit Grundbetrag 4",
        ][v.mode],
        "lab-text",
        "middle",
      ) +
      "</svg>"
    );
  },
  handles: { point: { x: "x", drag: (p) => ({ x: comparePlot.invX(p.x) }) } },
};
const data: LabView = {
  render(v, r) {
    let out =
      open("Fünf veränderbare Datenpunkte und statistische Kenngrößen") +
      title(`Mittel ${fmt(Number(r.mean))}; Median ${fmt(Number(r.median))}`);
    const keys = ["a", "b", "c", "d", "e"];
    keys.forEach((key, i) => {
      const y = 65 + i * 42;
      out +=
        line(65, y, 455, y, "lab-axis") +
        text(35, y + 5, key.toUpperCase()) +
        handle(key, railX(v[key], 0, 12), y, `Datenwert ${key.toUpperCase()}`) +
        text(480, y + 5, String(v[key]), "lab-text", "end");
    });
    return (
      out +
      text(65, 290, "0", "lab-text-tick") +
      text(455, 290, "12", "lab-text-tick", "end") +
      text(
        260,
        325,
        `Spannweite ${r.range}; geordnet: ${r.ordered}`,
        "lab-text-small",
        "middle",
      ) +
      "</svg>"
    );
  },
  handles: Object.fromEntries(
    ["a", "b", "c", "d", "e"].map((key) => [key, railHandle(key, 0, 12)]),
  ),
};
const outlier: LabView = {
  render(v, r) {
    let out =
      open("Vier kleine Datenwerte und ein veränderbarer Ausreißer") +
      title(`Mittel ${fmt(Number(r.mean))}; Median 4`);
    [3, 4, 4, 5, v.last].forEach((n, i) => {
      const y = 70 + i * 36;
      out +=
        line(65, y, 455, y, "lab-axis") +
        (i === 4
          ? handle("last", railX(n, 0, 100), y, "Fünfter Datenwert")
          : circle(railX(n, 0, 100), y, 5, "lab-dot-small")) +
        text(480, y + 4, String(n), "lab-text", "end");
    });
    return (
      out +
      line(railX(4, 0, 100), 50, railX(4, 0, 100), 250, "lab-curve-2") +
      line(
        railX(Number(r.mean), 0, 100),
        50,
        railX(Number(r.mean), 0, 100),
        250,
        "lab-curve",
      ) +
      text(65, 285, "Orange: Median · Blau: Mittelwert", "lab-text-small") +
      text(
        65,
        315,
        "0 bis 100 auf jeder Zeile; nur den letzten Punkt ziehen.",
        "lab-text-small",
      ) +
      "</svg>"
    );
  },
  handles: {
    last: { x: "last", drag: (p) => ({ last: ((p.x - 65) / 390) * 100 }) },
  },
};
const sample: LabView = {
  render(v, r) {
    const sum = v.a + v.b,
      width = sum === 0 ? 0 : (390 * v.a) / sum;
    return (
      open("Zusammensetzung einer Stichprobe aus zwei gleich großen Gruppen") +
      title("Grundgesamtheit: A und B gleich groß") +
      rect(65, 60, 195, 35, "lab-fill-a") +
      rect(260, 60, 195, 35, "lab-fill-b") +
      text(65, 119, "Gruppe A: 50 % der Schule", "lab-text-small") +
      text(455, 119, "Gruppe B: 50 % der Schule", "lab-text-small", "end") +
      rect(65, 145, width, 30, "lab-fill-a") +
      rect(65 + width, 145, sum === 0 ? 0 : 390 - width, 30, "lab-fill-b") +
      text(
        260,
        198,
        `Anteil A in der Stichprobe: ${r.sampleA}`,
        "lab-text",
        "middle",
      ) +
      rail("a", "Befragte aus A", v.a, 0, 50, 245) +
      rail("b", "Befragte aus B", v.b, 0, 50, 310) +
      "</svg>"
    );
  },
  handles: { a: railHandle("a", 0, 50), b: railHandle("b", 0, 50) },
};
const chart: LabView = {
  render(v) {
    const y = (n: number) =>
      250 - ((n - v.baseline) / (100 - v.baseline)) * 200;
    let out =
      open(
        "Säulendiagramm für unveränderte Daten 90 und 100 mit veränderbarer Achse",
      ) +
      title("Daten bleiben 90 und 100") +
      line(105, 45, 105, 250, "lab-axis") +
      line(105, 250, 440, 250, "lab-axis");
    for (const n of [v.baseline, 90, 100])
      out +=
        line(100, y(n), 440, y(n), "lab-grid") +
        text(92, y(n) + 5, String(n), "lab-text-tick", "end");
    out +=
      rect(155, y(90), 85, 250 - y(90), "lab-fill-a") +
      rect(310, y(100), 85, 250 - y(100), "lab-fill-b") +
      text(197, 273, "A", "lab-text", "middle") +
      text(352, 273, "B", "lab-text", "middle");
    if (v.baseline > 0)
      out +=
        text(40, 240, "//", "lab-text-big") +
        text(115, 45, "Ausschnitt!", "lab-text-small");
    return (
      out + rail("baseline", "Achsenbeginn", v.baseline, 0, 85, 310) + "</svg>"
    );
  },
  handles: { baseline: railHandle("baseline", 0, 85) },
};
export const ANWENDUNG_VIEWS = {
  term,
  equation,
  inequality,
  "word-equation": cost,
  "word-inequality": cost,
  percent: percentView(false),
  "reverse-percent": percentView(true),
  interest,
  inverse,
  "proportion-compare": proportion,
  data,
  outlier,
  sample,
  chart,
};
