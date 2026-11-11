import { fmt, point } from "../exercises/format";
import {
  arcPath,
  arrow,
  circle,
  handle,
  line,
  open,
  path,
  Plot,
  polar,
  polygon,
  rect,
  text,
  type LabView,
} from "./svg";
import { rail, railHandle, title } from "./view-helpers";

const sequence: LabView = {
  render: (v) =>
    open("Fünf Zahlen einer Zahlenfolge") +
    title(
      v.mode === 0
        ? "Immer denselben Schritt addieren"
        : "Immer mit demselben Faktor multiplizieren",
    ) +
    Array.from({ length: 5 }, (_, i) =>
      text(
        260,
        68 + i * 40,
        `${i + 1}. ${fmt(v.mode === 0 ? v.start + i * v.step : v.start * v.step ** i, 0)}`,
        i === 4 ? "lab-text-big" : "lab-text",
        "middle",
      ),
    ).join("") +
    rail("start", "Start", v.start, 2, 1000, 300) +
    "</svg>",
  handles: { start: railHandle("start", 2, 1000) },
};

const order: LabView = {
  render(v) {
    const plain = v.a + v.b * v.c,
      bracket = (v.a + v.b) * v.c;
    return (
      open("Zwei Terme mit denselben Zahlen") +
      title("Die Klammer entscheidet, was zuerst gerechnet wird") +
      text(
        260,
        85,
        `${fmt(v.a)} + ${fmt(v.b)} · ${fmt(v.c)} = ${fmt(plain, 3)}`,
        v.mode === 0 ? "lab-text-big" : "lab-text-muted",
        "middle",
      ) +
      text(
        260,
        155,
        `(${fmt(v.a)} + ${fmt(v.b)}) · ${fmt(v.c)} = ${fmt(bracket, 3)}`,
        v.mode === 1 ? "lab-text-big" : "lab-text-muted",
        "middle",
      ) +
      text(
        260,
        222,
        v.mode === 0
          ? "Zuerst das Produkt, dann die Summe."
          : "Zuerst die Summe in der Klammer.",
        "lab-text",
        "middle",
      ) +
      "</svg>"
    );
  },
};

const plot = new Plot(0, 8, 0, 6, { x: 55, y: 45, w: 420, h: 252 });
const firstQuadrant: LabView = {
  render(v) {
    return (
      open("Koordinatensystem mit nicht negativen Koordinaten") +
      title(`P${point(v.x, v.y, 0)} · erst rechts, dann hoch`) +
      plot.grid(1, 1, "Rechtswert", "Hochwert") +
      line(plot.X(v.x), plot.Y(0), plot.X(v.x), plot.Y(v.y), "lab-dashed") +
      line(plot.X(0), plot.Y(v.y), plot.X(v.x), plot.Y(v.y), "lab-dashed") +
      handle("p", plot.X(v.x), plot.Y(v.y), "Punkt P") +
      "</svg>"
    );
  },
  handles: {
    p: {
      x: "x",
      y: "y",
      drag: (p) => ({ x: plot.invX(p.x), y: plot.invY(p.y) }),
    },
  },
};

const angle: LabView = {
  render(v) {
    const p = polar(260, 265, 175, v.a);
    let out =
      open("Winkel von 5 bis 180 Grad mit Bezugsmarken") +
      title(`Öffnung ${fmt(v.a, 0)}°`);
    for (const a of [0, 45, 90, 135, 180]) {
      const tick = polar(260, 265, 190, a);
      out +=
        line(260, 265, tick.x, tick.y, "lab-grid") +
        text(tick.x, tick.y - 10, `${a}°`, "lab-text-tick", "middle");
    }
    return (
      out +
      line(260, 265, 435, 265, "lab-curve") +
      line(260, 265, p.x, p.y, "lab-curve-2") +
      path(arcPath(260, 265, 55, 0, v.a), "lab-angle") +
      text(
        265,
        318,
        "Scheitel S · beide Linien sind Schenkel",
        "lab-text-small",
        "middle",
      ) +
      handle("a", p.x, p.y, "Zweiter Schenkel") +
      "</svg>"
    );
  },
  handles: {
    a: {
      x: "a",
      drag: (p) => ({ a: (Math.atan2(265 - p.y, p.x - 260) * 180) / Math.PI }),
    },
  },
};

const triangle: LabView = {
  render(v) {
    const h = Math.sqrt(v.side ** 2 - (v.base / 2) ** 2),
      scale = 18;
    return (
      open("Gleichschenkliges Dreieck mit drei Randlängen") +
      title("Umfang: einmal um den äußeren Rand") +
      polygon(
        [
          { x: 260 - (v.base * scale) / 2, y: 250 },
          { x: 260 + (v.base * scale) / 2, y: 250 },
          { x: 260, y: 250 - h * scale },
        ],
        "lab-fill-a",
      ) +
      text(260, 275, `${v.base} cm`, "lab-text", "middle") +
      text(155, 155, `${v.side} cm`, "lab-text", "middle") +
      text(365, 155, `${v.side} cm`, "lab-text", "middle") +
      rail("base", "Basis", v.base, 2, 10, 310) +
      "</svg>"
    );
  },
  handles: { base: railHandle("base", 2, 10) },
};

const areaUnits: LabView = {
  render(v) {
    let out =
      open("Ein Einheitsquadrat enthält hundert kleinere Quadrate") +
      title("10 Reihen mit je 10 Quadraten = 100");
    for (let y = 0; y < 10; y++)
      for (let x = 0; x < 10; x++)
        out += rect(65 + 19 * x, 55 + 19 * y, 18, 18, "lab-fill-a");
    out +=
      text(370, 120, `${v.amount} · 100`, "lab-text-big", "middle") +
      text(370, 160, `= ${v.amount * 100}`, "lab-text-big", "middle");
    return (
      out + rail("amount", "Große Quadrate", v.amount, 1, 10, 300) + "</svg>"
    );
  },
  handles: { amount: railHandle("amount", 1, 10) },
};

const parts: LabView = {
  render(v) {
    let out =
      open("Ein Ganzes in vier gleichen Teilen") +
      title(["Viertelliter", "Viertelkilogramm", "Viertelstunde"][v.kind]);
    for (let i = 0; i < 4; i++)
      out += rect(
        60 + i * 100,
        100,
        96,
        85,
        i <= v.part ? "lab-fill-a" : "lab-cell",
      );
    return (
      out +
      text(
        260,
        230,
        `${v.whole} Ganze und ${["¼", "½", "¾"][v.part]}`,
        "lab-text-big",
        "middle",
      ) +
      rail("whole", "Zusätzliche Ganze", v.whole, 0, 3, 305) +
      "</svg>"
    );
  },
  handles: { whole: railHandle("whole", 0, 3) },
};

const equation: LabView = {
  render(v) {
    const value = v.mode === 0 ? v.x + v.a : v.a * v.x;
    return (
      open("Linke Seite einer Gleichung und Zielwert") +
      title("Probiere geordnet und vergleiche") +
      text(
        260,
        100,
        `${v.mode === 0 ? `${v.x} + ${v.a}` : `${v.a} · ${v.x}`} = ${value}`,
        "lab-text-big",
        "middle",
      ) +
      text(
        260,
        170,
        `${value} ${value < 24 ? "<" : value > 24 ? ">" : "="} 24`,
        value === 24 ? "lab-text-ok" : "lab-text",
        "middle",
      ) +
      rail("x", "Versuch für x", v.x, 1, 30, 290) +
      "</svg>"
    );
  },
  handles: { x: railHandle("x", 1, 30) },
};

const rectangle: LabView = {
  render(v) {
    let out =
      open("Rechteck mit Einheitsquadraten") +
      title(`Fläche ${v.a * v.b} cm² · Umfang ${2 * (v.a + v.b)} cm`);
    for (let y = 0; y < v.b; y++)
      for (let x = 0; x < v.a; x++)
        out += rect(65 + x * 24, 65 + y * 20, 24, 20, "lab-fill-a");
    return (
      out +
      text(230, 290, `${v.a} cm lang · ${v.b} cm breit`, "lab-text", "middle") +
      handle("corner", 65 + v.a * 24, 65 + v.b * 20, "Länge und Breite") +
      "</svg>"
    );
  },
  handles: {
    corner: {
      x: "a",
      y: "b",
      drag: (p) => ({ a: (p.x - 65) / 24, b: (p.y - 65) / 20 }),
    },
  },
};

const rational: LabView = {
  render(v) {
    const x = (a: number) => 260 + a * 20,
      end = v.a + (v.op === 0 ? v.b : -v.b);
    let out =
      open("Rationale Änderung als Pfeil auf der Zahlengeraden") +
      title(
        `${fmt(v.a, 1)} ${v.op === 0 ? "+" : "−"} ${fmt(v.b, 1)} = ${fmt(end, 1)}`,
      ) +
      arrow(40, 200, 480, 200, "lab-axis");
    for (let n = -10; n <= 10; n += 2)
      out +=
        line(x(n), 193, x(n), 207, "lab-axis") +
        text(x(n), 226, fmt(n, 0), "lab-text-tick", "middle");
    return (
      out +
      arrow(x(v.a), 155, x(end), 155, "lab-curve-2", 3) +
      handle("a", x(v.a), 200, "Start") +
      text(x(end), 130, fmt(end, 1), "lab-text-big", "middle") +
      "</svg>"
    );
  },
  handles: { a: { x: "a", drag: (p) => ({ a: (p.x - 260) / 20 }) } },
};

const repeated: LabView = {
  render(v) {
    const x = (a: number) => 260 + a * 17;
    let out =
      open("Wiederholte Änderungen mit gleich langen Pfeilen") +
      title(`${v.k} gleiche Schritte von ${fmt(v.a)}`) +
      arrow(30, 220, 490, 220, "lab-axis") +
      text(260, 248, "0", "lab-text-tick", "middle");
    for (let i = 0; i < v.k; i++)
      out += arrow(
        x(i * v.a),
        110 + (i % 2) * 36,
        x((i + 1) * v.a),
        110 + (i % 2) * 36,
        "lab-curve",
        3,
      );
    return (
      out +
      text(
        260,
        285,
        `Gesamtänderung ${fmt(v.a * v.k)}`,
        "lab-text-big",
        "middle",
      ) +
      "</svg>"
    );
  },
};

const division: LabView = {
  render(v) {
    const total = v.z / v.d,
      portion = total / v.k;
    let out =
      open("Gesamtmenge und Anteil einer Person") +
      title(`${v.z}/${v.d} verteilt auf ${v.k} Personen`);
    for (let i = 0; i < 4; i++)
      out +=
        rect(55 + 100 * i, 85, 100, 35, "lab-cell") +
        rect(55 + 100 * i, 185, 100, 35, "lab-cell");
    out +=
      rect(55, 85, 100 * total, 35, "lab-fill-a") +
      rect(55, 185, 100 * portion, 35, "lab-fill-b") +
      text(55, 72, "Insgesamt", "lab-text-small") +
      text(55, 172, "Eine Person", "lab-text-small");
    return out + rail("k", "Personen", v.k, 2, 6, 295) + "</svg>";
  },
  handles: { k: railHandle("k", 2, 6) },
};

function box(x: number, y: number, w: number, d: number, h: number): string {
  return (
    polygon(
      [
        { x, y },
        { x: x + w, y },
        { x: x + w, y: y - h },
        { x, y: y - h },
      ],
      "lab-fill-a",
    ) +
    polygon(
      [
        { x: x + w, y },
        { x: x + w + d, y: y - d * 0.55 },
        { x: x + w + d, y: y - h - d * 0.55 },
        { x: x + w, y: y - h },
      ],
      "lab-fill-b",
    ) +
    polygon(
      [
        { x, y: y - h },
        { x: x + w, y: y - h },
        { x: x + w + d, y: y - h - d * 0.55 },
        { x: x + d, y: y - h - d * 0.55 },
      ],
      "lab-cell",
    )
  );
}
const contact: LabView = {
  render(v) {
    const s = v.a * 17;
    return (
      open("Zwei Würfel ergeben einen länglichen Quader") +
      title("Die Kontaktflächen liegen innen") +
      box(70, 250, 2 * s, s * 0.7, s) +
      line(70 + s, 250, 70 + s, 250 - s, "lab-dashed") +
      text(
        260,
        290,
        `12 · ${v.a}² − 2 · ${v.a}² = ${10 * v.a ** 2} cm²`,
        "lab-text",
        "middle",
      ) +
      "</svg>"
    );
  },
};

const stacks: LabView = {
  render(v) {
    let out =
      open("Würfelbau mit Bauplan und Vorderansicht") +
      title("Bau ohne Lücken unter den Stapeln");
    const entries = [
      { x: 0, y: 1, h: v.c },
      { x: 1, y: 1, h: v.d },
      { x: 0, y: 0, h: v.a },
      { x: 1, y: 0, h: v.b },
    ];
    for (const e of entries)
      for (let z = 0; z < e.h; z++)
        out += box(
          75 + e.x * 38 + e.y * 21,
          245 - e.y * 13 - z * 30,
          38,
          21,
          30,
        );
    for (const [i, h] of [v.c, v.d, v.a, v.b].entries())
      out +=
        rect(
          300 + (i % 2) * 56,
          60 + Math.floor(i / 2) * 48,
          54,
          46,
          "lab-cell",
        ) +
        text(
          327 + (i % 2) * 56,
          90 + Math.floor(i / 2) * 48,
          String(h),
          "lab-text-big",
          "middle",
        );
    out += text(355, 178, "Bauplan: vorne unten", "lab-text-small", "middle");
    for (const [i, h] of [Math.max(v.a, v.c), Math.max(v.b, v.d)].entries())
      for (let j = 0; j < h; j++)
        out += rect(315 + i * 35, 290 - j * 24, 34, 23, "lab-fill-a");
    return (
      out +
      text(350, 327, "Vorderansicht", "lab-text-small", "middle") +
      "</svg>"
    );
  },
};

const mean: LabView = {
  render(v) {
    const avg = (v.a + v.b + v.c + v.d) / 4;
    let out =
      open("Vier Säulen und eine Linie für das arithmetische Mittel") +
      title(`Arithmetisches Mittel ${fmt(avg)}`) +
      line(55, 255, 465, 255, "lab-axis");
    for (const [i, n] of [v.a, v.b, v.c, v.d].entries())
      out +=
        rect(85 + i * 92, 255 - n * 7, 50, n * 7, "lab-fill-a") +
        text(110 + i * 92, 245 - n * 7, fmt(n, 0), "lab-text", "middle");
    return (
      out +
      line(55, 255 - avg * 7, 465, 255 - avg * 7, "lab-curve-2") +
      rail("a", "Wert 1", v.a, 0, 30, 310) +
      "</svg>"
    );
  },
  handles: { a: railHandle("a", 0, 30) },
};

const volume: LabView = {
  render: (v) =>
    open("Quader mit unbekannter Höhe als veränderbarem Modell") +
    title(`V = ${v.a} · ${v.b} · ${v.h} = ${v.a * v.b * v.h} dm³`) +
    box(95, 265, v.a * 28, v.b * 18, v.h * 17) +
    text(
      260,
      315,
      `Länge ${v.a} dm · Breite ${v.b} dm · Höhe ${v.h} dm`,
      "lab-text-small",
      "middle",
    ) +
    "</svg>",
};

const bigPlace: LabView = {
  render(v) {
    const keys = ["billions", "millions", "thousands", "ones"];
    const names = ["Milliarden", "Millionen", "Tausender", "Einer"];
    let out =
      open("Stellenwerttafel in Dreiergruppen") +
      title("Jede Gruppe umfasst drei Dezimalstellen");
    keys.forEach((key, i) => {
      out +=
        rect(38 + i * 120, 90, 114, 85, "lab-cell") +
        text(95 + i * 120, 72, names[i], "lab-text-small", "middle") +
        text(
          95 + i * 120,
          141,
          String(v[key]).padStart(i === 0 ? 1 : 3, "0"),
          "lab-text-big",
          "middle",
        );
    });
    out += text(
      260,
      230,
      fmt(v.billions * 1e9 + v.millions * 1e6 + v.thousands * 1000 + v.ones, 0),
      "lab-text-big",
      "middle",
    );
    return (
      out + rail("billions", "Milliarden", v.billions, 0, 9, 300) + "</svg>"
    );
  },
  handles: { billions: railHandle("billions", 0, 9) },
};
const circleMs: LabView = {
  render(v) {
    return (
      open("Kreis mit Mittelpunkt, Radius, Durchmesser und Punkt P") +
      title(`Radius ${v.r} cm · Durchmesser ${2 * v.r} cm`) +
      circle(220, 180, v.r * 23, "lab-outline") +
      line(220 - v.r * 23, 180, 220 + v.r * 23, 180, "lab-dashed") +
      line(220, 180, 220, 180 - v.r * 23, "lab-curve") +
      text(202, 200, "M", "lab-text") +
      text(232, 180 - v.r * 11, "r", "lab-text") +
      handle("r", 220, 180 - v.r * 23, "Radius") +
      handle("p", 220 + v.p * 23, 180, "Punkt P") +
      text(220 + v.p * 23, 213, "P", "lab-text") +
      "</svg>"
    );
  },
  handles: {
    r: { y: "r", drag: (p) => ({ r: (180 - p.y) / 23 }) },
    p: { x: "p", drag: (p) => ({ p: (p.x - 220) / 23 }) },
  },
};

export const EXTRA_VIEWS: Record<string, LabView> = {
  "big-place-value": bigPlace,
  "circle-ms": circleMs,
  sequence,
  order,
  "first-quadrant": firstQuadrant,
  "angle-180": angle,
  "triangle-perimeter": triangle,
  "area-units-ms": areaUnits,
  "everyday-parts": parts,
  equation,
  "inverse-rectangle": rectangle,
  "rational-change": rational,
  "repeated-change": repeated,
  "divide-natural": division,
  "contact-surface": contact,
  "cube-stacks": stacks,
  mean,
  "inverse-volume": volume,
};
