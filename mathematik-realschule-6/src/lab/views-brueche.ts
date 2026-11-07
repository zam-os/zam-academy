import { fmt } from "../exercises/format";
import { reduce } from "../models";
import { circle, handle, line, open, polar, rect, sectorPath, path, text, type LabView } from "./svg";
import { rail, railHandle, title } from "./view-helpers";

/** Rows of n equal cells, the first z coloured: whole after whole as long as z needs them. */
export function strips(
  z: number,
  n: number,
  x: number,
  y: number,
  w: number,
  h: number,
  cls = "lab-fill-a",
  gap = 6,
  wholes = Math.max(1, Math.ceil(z / n)),
): string {
  let out = "";
  const cell = w / n;
  for (let row = 0; row < wholes; row++) {
    const top = y + row * (h + gap);
    for (let i = 0; i < n; i++) {
      const filled = row * n + i < z;
      out += rect(x + i * cell, top, cell, h, filled ? cls : "lab-cell");
    }
  }
  return out;
}

/** A fraction written as text with its value's sign. */
const ft = (a: number, b: number): string => {
  const sign = a * b < 0 ? "−" : "";
  return `${sign}${Math.abs(a)}/${Math.abs(b)}`;
};

const share: LabView = {
  render(v, r) {
    const rows = Math.ceil(v.n / 4);
    const cols = Math.min(4, v.n);
    const w = 105;
    const h = Math.min(44, 210 / rows - 8);
    let out =
      open(`${v.n} Tafeln, jede in ${v.k} Teile geteilt`) +
      title(`${v.n} ${v.n === 1 ? "Tafel" : "Tafeln"} auf ${v.k} Kinder: jedes bekommt ${r.share}`);
    for (let i = 0; i < v.n; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      out += strips(
        1,
        v.k,
        260 - (cols * (w + 12)) / 2 + col * (w + 12),
        50 + row * (h + 8),
        w,
        h,
        "lab-fill-b",
      );
    }
    return (
      out +
      text(260, 268, "Farbig: von jeder Tafel ein Teil für das erste Kind", "lab-text-small", "middle") +
      rail("n", "Tafeln", v.n, 1, 12, 305) +
      "</svg>"
    );
  },
  handles: { n: railHandle("n", 1, 12) },
};

const fractionBar: LabView = {
  render(v) {
    const wholes = Math.max(1, Math.ceil(v.z / v.n));
    const barH = Math.min(46, 130 / wholes - 6);
    let out =
      open(`Bruch ${v.z}/${v.n} als Rechteck und Kreis`) +
      title(`${v.z}/${v.n}: Nenner ${v.n} teilt, Zähler ${v.z} zählt`) +
      strips(v.z, v.n, 40, 55, 270, barH);
    const cx = 410;
    const cy = 115;
    const R = 62;
    for (let i = 0; i < v.n; i++) {
      const a0 = 90 - (i * 360) / v.n;
      const a1 = 90 - ((i + 1) * 360) / v.n;
      out += path(sectorPath(cx, cy, R, a1, a0), i < v.z ? "lab-fill-b" : "lab-cell");
    }
    out +=
      text(40, 212, `Ein Ganzes in ${v.n} gleich große Teile, davon ${v.z} genommen.`, "lab-text-small") +
      text(40, 236, `Als Division: ${v.z} : ${v.n}.  ${v.z}/${v.n} von 120 € sind ${fmt((120 * v.z) / v.n)} €.`, "lab-text-small") +
      rail("z", "Zähler", v.z, 0, 12, 300) +
      "</svg>";
    return out;
  },
  handles: { z: railHandle("z", 0, 12) },
};

const mixed: LabView = {
  render(v, r) {
    const wholes = Math.max(1, Math.ceil(v.z / v.n));
    const h = Math.min(40, 195 / wholes - 6);
    return (
      open(`Unechter Bruch ${v.z}/${v.n} als ganze Streifen`) +
      title(`${v.z}/${v.n} = ${r.mixed}`) +
      strips(v.z, v.n, 110, 48, 300, h) +
      rail("z", "Zähler", v.z, 1, 24, 305) +
      "</svg>"
    );
  },
  handles: { z: railHandle("z", 1, 24) },
};

const partWhole: LabView = {
  render(v, r) {
    const whole = Number(r.whole);
    const x = 40;
    const w = 440;
    const scale = (w * v.n) / Math.max(v.z, v.n);
    const unit = scale / v.n;
    let out =
      open("Das Ganze und sein Bruchteil als Balken") +
      title(v.mode === 0 ? `${v.z}/${v.n} von ${v.a} = ${fmt(Number(r.part))}` : `${v.z}/${v.n} sind ${v.a}: Ganzes = ${fmt(whole)}`);
    out += text(x, 60, `Das Ganze: ${fmt(whole)}`, "lab-text");
    out += strips(v.n, v.n, x, 70, scale, 45, "lab-fill-a");
    out += text(x, 150, `Der Bruchteil ${v.z}/${v.n}: ${fmt(Number(r.part))}`, "lab-text");
    for (let i = 0; i < v.z; i++)
      out += rect(x + i * unit, 160, unit, 45, "lab-fill-b");
    out += text(x, 232, `Ein ${v.n}-tel: ${fmt(whole / v.n)}`, "lab-text-small");
    return out + rail("a", v.mode === 0 ? "Das Ganze" : "Der Bruchteil", v.a, 6, 120, 300) + "</svg>";
  },
  handles: { a: railHandle("a", 6, 120) },
};

const expand: LabView = {
  render(v) {
    const zk = v.z * v.k;
    const nk = v.n * v.k;
    return (
      open(`${v.z}/${v.n} und der erweiterte Bruch ${zk}/${nk}`) +
      title(`${v.z}/${v.n} = ${zk}/${nk}`) +
      text(40, 60, `${v.z}/${v.n}`, "lab-text") +
      strips(v.z, v.n, 40, 70, 440, Math.min(50, 66 / Math.max(1, Math.ceil(v.z / v.n)) - 4), "lab-fill-a", 4) +
      text(40, 150, v.k === 1 ? `${zk}/${nk}: noch nicht erweitert` : `${zk}/${nk}: jedes Teil in ${v.k} Stücke geschnitten`, "lab-text") +
      strips(zk, nk, 40, 160, 440, Math.min(50, 66 / Math.max(1, Math.ceil(v.z / v.n)) - 4), "lab-fill-b", 4) +
      text(260, 240, `Die gefärbte Fläche bleibt gleich groß. Gekürzt: ${reduce(v.z, v.n).join("/")}`, "lab-text-small", "middle") +
      rail("k", "Erweitern mit", v.k, 1, 6, 300) +
      "</svg>"
    );
  },
  handles: { k: railHandle("k", 1, 6) },
};

const representations: LabView = {
  render(v, r) {
    let out =
      open(`${v.p} Hundertstel als Quadratgitter und als Kreissektor`) +
      title(`${r.frac} = ${r.dec} = ${v.p} %`);
    const size = 18;
    for (let i = 0; i < 100; i++) {
      const col = i % 10;
      const row = Math.floor(i / 10);
      out += rect(45 + col * size, 50 + row * size, size, size, i < v.p ? "lab-fill-a" : "lab-cell");
    }
    const cx = 370;
    const cy = 140;
    const R = 88;
    out += circle(cx, cy, R, "lab-cell");
    if (v.p > 0) out += path(sectorPath(cx, cy, R, 90 - (v.p * 360) / 100, 90), "lab-fill-b");
    const tip = polar(cx, cy, R, 90);
    out += line(cx, cy, tip.x, tip.y, "lab-thin");
    return (
      out +
      text(cx, 250, `Winkel: ${fmt(v.p * 3.6, 1)}°`, "lab-text-small", "middle") +
      rail("p", "Prozent", v.p, 0, 100, 300) +
      "</svg>"
    );
  },
  handles: { p: railHandle("p", 0, 100) },
};

const lineX = (x: number) => 60 + ((x + 2) / 4) * 400;
const compare: LabView = {
  render(v, r) {
    const p = v.a / v.b;
    const q = v.c / v.d;
    let out =
      open("Zwei rationale Zahlen auf der Zahlengeraden von −2 bis 2") +
      title(`${ft(v.a, v.b)} ${r.relation} ${ft(v.c, v.d)}`) +
      line(40, 160, 480, 160, "lab-axis");
    for (let t = -8; t <= 8; t++) {
      const x = lineX(t / 4);
      out += line(x, t % 4 === 0 ? 150 : 155, x, t % 4 === 0 ? 170 : 165, "lab-axis");
      if (t % 4 === 0) out += text(x, 188, fmt(t / 4), "lab-text-tick", "middle");
    }
    const clampX = (value: number) => lineX(Math.max(-2, Math.min(2, value)));
    out += circle(clampX(p), 135, 8, "lab-point-a") + text(clampX(p), 118, ft(v.a, v.b), "lab-text-a", "middle");
    out += circle(clampX(q), 200, 8, "lab-point-b") + text(clampX(q), 228, ft(v.c, v.d), "lab-text-b", "middle");
    return (
      out +
      text(260, 270, `Hauptnenner ${r.common}: ${r.ext}`, "lab-text-small", "middle") +
      (Math.abs(p) > 2 || Math.abs(q) > 2
        ? text(260, 292, "Eine Zahl liegt außerhalb der gezeichneten Strecke.", "lab-text-small", "middle")
        : "") +
      "</svg>"
    );
  },
};

const STEPS = [1 / 2, 1 / 4, 1 / 5, 1 / 10];
const numberLineX = (t: number) => 260 + t * 11;
const numberLine: LabView = {
  render(v, r) {
    const s = STEPS[v.s];
    let out =
      open("Zahlengerade mit wählbarer Skalierung") +
      title(`Punkt P = ${r.value}`) +
      line(20, 170, 500, 170, "lab-axis");
    for (let t = -20; t <= 20; t++) {
      const x = numberLineX(t);
      const value = t * s;
      const whole = Math.abs(value - Math.round(value)) < 1e-9;
      out += line(x, whole ? 158 : 164, x, whole ? 182 : 176, "lab-axis");
      if (whole) out += text(x, 202, fmt(value), "lab-text-tick", "middle");
    }
    return (
      out +
      handle("t", numberLineX(v.t), 170, "Punkt P") +
      text(numberLineX(v.t), 140, "P", "lab-text", "middle") +
      text(260, 250, `Ein Strich entspricht ${["1/2", "1/4", "1/5", "1/10"][v.s]}. P liegt ${Math.abs(v.t)} Striche ${v.t < 0 ? "links" : "rechts"} von 0.`, "lab-text-small", "middle") +
      "</svg>"
    );
  },
  handles: { t: { x: "t", drag: (p) => ({ t: (p.x - 260) / 11 }) } },
};

const addFractionsView: LabView = {
  render(v, r) {
    const common = Number(r.common);
    const left = (v.a * common) / v.b;
    const right = (v.c * common) / v.d;
    const result = v.op === 0 ? left + right : left - right;
    const op = v.op === 0 ? "+" : "−";
    // One row of equal cells long enough for the biggest of the three numbers.
    const cells = common * Math.max(1, Math.ceil(Math.max(left, right, result) / common));
    return (
      open("Zwei Brüche, auf den Hauptnenner gebracht") +
      title(`${v.a}/${v.b} ${op} ${v.c}/${v.d} = ${r.result}`) +
      text(40, 55, `${v.a}/${v.b} = ${left}/${common}`, "lab-text-a") +
      strips(left, cells, 40, 65, 440, 42, "lab-fill-a", 6, 1) +
      text(40, 135, `${v.c}/${v.d} = ${right}/${common}`, "lab-text-b") +
      strips(right, cells, 40, 145, 440, 42, "lab-fill-b", 6, 1) +
      text(40, 215, `Ergebnis: ${result < 0 ? "−" : ""}${Math.abs(result)}/${common}`, "lab-text") +
      strips(Math.max(0, result), cells, 40, 225, 440, 42, "lab-fill-ok", 6, 1) +
      text(260, 295, result < 0 ? "Das Ergebnis ist negativ: Der zweite Bruch ist größer." : `Eine Zelle ist 1/${common}.`, "lab-text-small", "middle") +
      "</svg>"
    );
  },
};

const multFractions: LabView = {
  render(v, r) {
    const size = 240;
    const x = 40;
    const y = 50;
    const cols = Math.max(v.a, v.b);
    const rows = Math.max(v.c, v.d);
    const cw = size / cols;
    const ch = size / rows;
    let out =
      open("Flächenmodell: Bruch mal Bruch als Teil eines Einheitsquadrats") +
      title(`${v.a}/${v.b} · ${v.c}/${v.d} = ${r.result}`);
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++) {
        const both = i < v.a && j < v.c;
        const one = i < v.a || j < v.c;
        out += rect(x + i * cw, y + j * ch, cw, ch, both ? "lab-fill-b" : one ? "lab-fill-a" : "lab-cell");
      }
    out += rect(x, y, cw * v.b, ch * v.d, "lab-unit");
    return (
      out +
      text(310, 90, `${v.a} Spalten, ${v.b} ergeben ein Ganzes`, "lab-text-small") +
      text(310, 115, `${v.c} Zeilen, ${v.d} ergeben ein Ganzes`, "lab-text-small") +
      text(310, 150, `Doppelt gefärbt: ${v.a * v.c}`, "lab-text-small") +
      text(310, 175, `Das Ganze hat ${v.b * v.d} Teile`, "lab-text-small") +
      text(310, 210, `${v.a * v.c}/${v.b * v.d} = ${r.result}`, "lab-text") +
      "</svg>"
    );
  },
};

const divFractions: LabView = {
  render(v, r) {
    const x = 40;
    const w = 440;
    const total = v.a / v.b;
    const unit = v.c / v.d;
    const scale = w / Math.max(1, total, unit);
    let out =
      open("Wie oft passt der zweite Bruch in den ersten?") +
      title(`${v.a}/${v.b} : ${v.c}/${v.d} = ${r.result}`) +
      text(x, 62, `${v.a}/${v.b}`, "lab-text-a") +
      rect(x, 72, total * scale, 46, "lab-fill-a") +
      text(x, 150, `So oft passt ${v.c}/${v.d} hinein:`, "lab-text-b");
    const times = Math.floor(total / unit + 1e-9);
    for (let i = 0; i < Math.min(times, 48); i++)
      out += rect(x + i * unit * scale, 160, unit * scale, 46, "lab-fill-b");
    const rest = total / unit - times;
    if (rest > 1e-9)
      out += rect(x + times * unit * scale, 160, rest * unit * scale, 46, "lab-fill-c");
    return (
      out +
      text(260, 240, `Kehrwert: ${v.a}/${v.b} · ${v.d}/${v.c} = ${r.result}`, "lab-text", "middle") +
      text(260, 268, rest > 1e-9 ? "Es passt nicht glatt: Der helle Rest ist ein Bruchteil." : "Es passt genau.", "lab-text-small", "middle") +
      "</svg>"
    );
  },
};

const recipe: LabView = {
  render(v, r) {
    const rows: Array<[string, number, string, string]> = [
      ["Mehl", (v.p * 500) / 4, "g", "lab-fill-a"],
      ["Milch", (v.p * 0.75) / 4, "l", "lab-fill-b"],
      ["Zucker", (v.p * 60) / 4, "g", "lab-fill-c"],
    ];
    const max = [1500, 2.25, 180];
    let out = open("Rezept: Zutaten wachsen mit der Personenzahl") + title(`Rezept für ${v.p} Personen`);
    rows.forEach(([name, value, unit, cls], i) => {
      const y = 55 + i * 62;
      out +=
        text(40, y, `${name}: ${fmt(value, 3)} ${unit}`, "lab-text") +
        rect(40, y + 8, 440, 26, "lab-cell") +
        rect(40, y + 8, (440 * value) / max[i], 26, cls);
    });
    return (
      out +
      text(40, 252, `Kosten: ${r.cost} €, Rückgeld von 20 €: ${r.change} €`, "lab-text-small") +
      rail("p", "Personen", v.p, 1, 12, 305) +
      "</svg>"
    );
  },
  handles: { p: railHandle("p", 1, 12) },
};

export const BRUECHE_VIEWS = {
  share,
  "fraction-bar": fractionBar,
  mixed,
  "part-whole": partWhole,
  expand,
  representations,
  compare,
  "number-line": numberLine,
  "add-fractions": addFractionsView,
  "mult-fractions": multFractions,
  "div-fractions": divFractions,
  recipe,
};
