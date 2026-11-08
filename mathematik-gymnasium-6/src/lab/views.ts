import type { LabValues, ReadoutValues } from "../model/types";
import { fmt } from "../exercises/format";
import { RANGES, type Family } from "../curriculum/labs";
import {
  type HandleSpec,
  type LabView,
  type Pt,
  circle,
  clamp,
  handle,
  line,
  open,
  polygon,
  rect,
  sectorPath,
  text,
} from "./svg";

const X0 = 64;
const X1 = 456;

const n = (values: LabValues, key: string, fallback = 0): number => {
  const value = values[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
};

function axisX(key: keyof typeof RANGES, value: number): number {
  const { min, max } = RANGES[key];
  return X0 + ((value - min) / (max - min)) * (X1 - X0);
}

function dragX(key: keyof typeof RANGES): HandleSpec["drag"] {
  return (pt: Pt) => {
    const { min, max } = RANGES[key];
    const t = clamp((pt.x - X0) / (X1 - X0), 0, 1);
    return { [key]: min + t * (max - min) };
  };
}

function tracks(keys: Array<keyof typeof RANGES>, labels: string[], values: LabValues): { svg: string; handles: Record<string, HandleSpec> } {
  const handles: Record<string, HandleSpec> = {};
  const y0 = 214;
  const svg = keys
    .map((key, index) => {
      const y = y0 + index * 28;
      const x = axisX(key, n(values, key, RANGES[key].min));
      const id = `${key}-griff`;
      handles[id] = { x: key, drag: dragX(key) };
      return (
        line(X0, y, X1, y, "lab-axis") +
        text(8, y + 4, labels[index], "lab-text-small") +
        handle(id, x, y, labels[index])
      );
    })
    .join("");
  return { svg, handles };
}

function close(body: string, label: string): string {
  return `${open(label)}${rect(0, 0, 520, 340, "lab-plot-bg")}${body}</svg>`;
}

function share(values: LabValues): string {
  const den = Math.max(1, Math.round(n(values, "den", 2)));
  const num = Math.max(0, Math.round(n(values, "num", 0)));
  const x = 36;
  const y = 36;
  const w = 448;
  const h = 78;
  const parts = Array.from({ length: den }, (_, i) => {
    const px = x + (i * w) / den;
    const filled = i < num;
    return rect(px + 1, y, w / den - 2, h, filled ? "lab-shape" : "lab-ghost");
  }).join("");
  const note = num > den ? text(x, y + h + 22, `${fmt(num, 0)} Teile, das Ganze hat nur ${fmt(den, 0)}.`, "lab-text-small") : text(x, y + h + 22, `${fmt(Math.min(num, den), 0)} von ${fmt(den, 0)} Teilen`, "lab-text");
  return parts + note;
}

function compare(values: LabValues): string {
  const bar = (nx: number, dx: number, y: number, cls: string) => {
    const den = Math.max(1, Math.round(dx));
    const num = Math.max(0, Math.round(nx));
    const x = 120;
    const w = 360;
    const h = 36;
    const cells = Array.from({ length: den }, (_, i) => rect(x + (i * w) / den + 1, y, w / den - 2, h, i < num ? cls : "lab-ghost")).join("");
    return cells;
  };
  return (
    text(16, 58, "links", "lab-text-small") +
    bar(n(values, "n1"), n(values, "d1", 2), 36, "lab-shape") +
    text(16, 128, "rechts", "lab-text-small") +
    bar(n(values, "n2"), n(values, "d2", 2), 106, "lab-shape-2")
  );
}

function sum(values: LabValues): string {
  const den = Math.max(1, Math.round(n(values, "den", 2)));
  const n1 = Math.max(0, Math.round(n(values, "n1")));
  const n2 = Math.max(0, Math.round(n(values, "n2")));
  const x = 36;
  const y = 48;
  const w = 448;
  const h = 72;
  const cells = Array.from({ length: den }, (_, i) => {
    const cls = i < n1 ? "lab-shape" : i < n1 + n2 ? "lab-shape-2" : "lab-ghost";
    return rect(x + (i * w) / den + 1, y, w / den - 2, h, cls);
  }).join("");
  const extra = n1 + n2 > den ? text(x, 150, "Die Summe braucht mehr als ein Ganzes.", "lab-text-small") : text(x, 150, "Blau und orange liegen am selben Ganzen.", "lab-text-small");
  return cells + extra;
}

function mixed(values: LabValues): string {
  const whole = Math.max(0, Math.round(n(values, "whole")));
  const den = Math.max(1, Math.round(n(values, "den", 2)));
  const num = Math.max(0, Math.round(n(values, "num")));
  const boxes = Array.from({ length: Math.min(whole, 6) }, (_, i) => rect(24 + i * 62, 40, 54, 54, "lab-shape")).join("");
  const x = 24;
  const y = 110;
  const parts = Array.from({ length: den }, (_, i) => rect(x + i * 36, y, 32, 40, i < num ? "lab-shape-2" : "lab-ghost")).join("");
  return boxes + parts + text(24, 176, `${fmt(whole, 0)} Ganze und ${fmt(num, 0)}/${fmt(den, 0)}`, "lab-text");
}

function percent(values: LabValues): string {
  const p = clamp(n(values, "p"), 0, 100);
  const w = 280;
  const bar = rect(36, 48, w, 36, "lab-ghost") + rect(36, 48, (w * p) / 100, 36, "lab-shape");
  const angle = (p / 100) * 360;
  const pie =
    p <= 0
      ? circle(420, 78, 52, "lab-ghost")
      : p >= 100
        ? circle(420, 78, 52, "lab-shape")
        : `<path d="${sectorPath(420, 78, 52, 90, 90 - angle)}" class="lab-shape" />` + circle(420, 78, 52, "lab-thin");
  return bar + pie + text(36, 110, `${fmt(p, 0)} %`, "lab-text");
}

function ray(values: LabValues): string {
  const value = n(values, "pos") / 2;
  const x = 40 + ((value + 6) / 12) * 440;
  const ticks = Array.from({ length: 13 }, (_, i) => {
    const tx = 40 + (i / 12) * 440;
    return line(tx, 70, tx, 86, "lab-axis") + text(tx, 104, fmt(-6 + i, 0), "lab-text-tick", "middle");
  }).join("");
  return line(40, 78, 480, 78, "lab-axis") + ticks + circle(clamp(x, 40, 480), 78, 7, "lab-shape");
}

function tenth(values: LabValues): string {
  const value = n(values, "tick") / 10;
  const x = 40 + ((value + 3) / 6) * 440;
  return (
    line(40, 90, 480, 90, "lab-axis") +
    text(40, 70, "−3", "lab-text-small") +
    text(450, 70, "3", "lab-text-small") +
    circle(clamp(x, 40, 480), 90, 7, "lab-shape") +
    text(40, 140, fmt(value, 1), "lab-text-big")
  );
}

function tenth2(values: LabValues): string {
  const a = n(values, "a10") / 10;
  const b = n(values, "b10") / 10;
  return (
    text(40, 70, `erste Zahl  ${fmt(a, 1)}`, "lab-text-big") +
    text(40, 110, `zweite Zahl  ${fmt(b, 1)}`, "lab-text-big") +
    text(40, 160, `Summe  ${fmt(a + b, 1)}`, "lab-text")
  );
}

function digits(values: LabValues): string {
  const cells = [
    ["Einer", n(values, "ones")],
    ["Zehntel", n(values, "tenths")],
    ["Hundertstel", n(values, "hundredths")],
  ];
  return cells
    .map(([label, value], index) => {
      const x = 40 + index * 140;
      return rect(x, 36, 120, 90, "lab-ghost") + text(x + 60, 78, fmt(Number(value), 0), "lab-text-big", "middle") + text(x + 60, 150, String(label), "lab-text-small", "middle");
    })
    .join("") + text(168, 90, ",", "lab-text-big", "middle");
}

function power(values: LabValues, readouts: ReadoutValues): string {
  const shown = readouts.wert;
  const label = typeof shown === "number" ? fmt(shown, 4) : String(shown ?? "—");
  const base = n(values, "base");
  const baseText = base < 0 ? `(${fmt(base, 0)})` : fmt(base, 0);
  return (
    text(40, 80, `${baseText} hoch ${fmt(n(values, "exp"), 0)}`, "lab-text") +
    text(40, 130, label, "lab-text-big")
  );
}

function roundView(values: LabValues, readouts: ReadoutValues): string {
  const rounded = readouts.gerundet;
  const label = typeof rounded === "number" ? fmt(rounded, 2) : "—";
  const place = ["Einer", "Zehntel", "Hundertstel"][n(values, "stelle")] ?? "Einer";
  return text(40, 70, `Zahl  ${fmt(n(values, "tick") / 10, 1)}`, "lab-text-big") + text(40, 120, `gerundet auf ${place}:  ${label}`, "lab-text");
}

function para(values: LabValues): string {
  const g = n(values, "g", 3);
  const h = n(values, "h", 1);
  const s = n(values, "slant");
  const u = 16;
  const baseY = 180;
  const x0 = 70;
  const p = [
    { x: x0 + s * u, y: baseY },
    { x: x0 + s * u + g * u, y: baseY },
    { x: x0 + g * u, y: baseY - h * u },
    { x: x0, y: baseY - h * u },
  ];
  return polygon(p, "lab-shape") + line(p[3].x, p[3].y, p[3].x, baseY, "lab-dashed") + text(p[3].x + 8, (p[3].y + baseY) / 2, "h", "lab-text-small");
}

function tri(values: LabValues): string {
  const g = n(values, "g", 3);
  const h = n(values, "h", 1);
  const u = 18;
  const baseY = 180;
  const x0 = 80;
  const a = { x: x0, y: baseY };
  const b = { x: x0 + g * u, y: baseY };
  const c = { x: x0 + (g * u) / 2, y: baseY - h * u };
  return polygon([a, b, c], "lab-shape") + line(c.x, c.y, c.x, baseY, "lab-dashed") + text(c.x + 8, (c.y + baseY) / 2, "h", "lab-text-small");
}

function trap(values: LabValues): string {
  const a = n(values, "ta", 4);
  const c = n(values, "tc", 2);
  const h = n(values, "th", 1);
  const u = 16;
  const baseY = 180;
  const x0 = 70;
  const top = x0 + ((a - c) * u) / 2;
  const pts = [
    { x: x0, y: baseY },
    { x: x0 + a * u, y: baseY },
    { x: top + c * u, y: baseY - h * u },
    { x: top, y: baseY - h * u },
  ];
  return polygon(pts, "lab-shape") + line((pts[0].x + pts[1].x) / 2, baseY, (pts[3].x + pts[2].x) / 2, baseY - h * u, "lab-dashed");
}

function box(values: LabValues): string {
  const a = n(values, "la", 1);
  const b = n(values, "lb", 1);
  const c = n(values, "lc", 1);
  const u = 18;
  const x = 120;
  const y = 150;
  const dx = b * 10;
  const dy = b * 6;
  const front = [
    { x, y },
    { x: x + a * u, y },
    { x: x + a * u, y: y - c * u },
    { x, y: y - c * u },
  ];
  const top = [front[3], front[2], { x: front[2].x + dx, y: front[2].y - dy }, { x: front[3].x + dx, y: front[3].y - dy }];
  const side = [front[1], front[2], top[2], { x: front[1].x + dx, y: front[1].y - dy }];
  return polygon(front, "lab-shape") + polygon(top, "lab-shape-2") + polygon(side, "lab-ghost");
}

function hole(values: LabValues): string {
  const a = Math.max(2, n(values, "la", 3));
  const b = Math.max(1, n(values, "lb", 1));
  const length = Math.min(n(values, "cut", 1), a - 1);
  const width = Math.min(n(values, "cb", 1), b);
  const outer = rect(80, 40, a * 36, b * 22, "lab-shape");
  const inner = rect(92, 52, Math.max(8, length * 28), Math.max(8, width * 14), "lab-plot-bg");
  return outer + inner + text(80, 40 + b * 22 + 28, `Aussparung ${fmt(length, 0)} cm mal ${fmt(width, 0)} cm`, "lab-text-small");
}

function unlike(values: LabValues): string {
  const left = n(values, "n1") / Math.max(1, n(values, "d1", 2));
  const right = n(values, "n2") / Math.max(1, n(values, "d2", 2));
  return compare(values) + text(36, 170, `Summe ${fmt(left + right, 3)}`, "lab-text");
}

function cut(values: LabValues): string {
  const a = Math.max(2, n(values, "ca", 3));
  const left = Math.min(n(values, "cut", 1), a - 1);
  const right = a - left;
  const h = 70;
  return (
    rect(40, 60, left * 28, h, "lab-shape") +
    rect(48 + left * 28, 60, right * 28, h, "lab-shape-2") +
    text(40, 160, `links ${fmt(left, 0)} cm, rechts ${fmt(right, 0)} cm`, "lab-text-small")
  );
}

function bars(values: LabValues, floor = 0): string {
  const groups = [n(values, "ga"), n(values, "gb"), n(values, "gc")];
  const base = 180;
  return groups
    .map((value, index) => {
      const x = 70 + index * 120;
      const height = Math.max(0, value - floor) * 10;
      return rect(x, base - height, 70, height, index === 1 ? "lab-shape-2" : "lab-shape") + text(x + 35, base + 22, ["A", "B", "C"][index], "lab-text", "middle");
    })
    .join("") + (floor > 0 ? text(40, 40, `Achse beginnt bei ${fmt(floor, 0)}`, "lab-text-bad") : text(40, 40, "Achse beginnt bei 0", "lab-text-small"));
}

function joinSum(left: number, right: number): string {
  return right < 0 ? `${fmt(left, 0)} − ${fmt(-right, 0)}` : `${fmt(left, 0)} + ${fmt(right, 0)}`;
}

function dist(values: LabValues): string {
  const a = n(values, "fa", 1);
  const b = n(values, "fb");
  const c = n(values, "fc");
  return (
    text(36, 70, `${fmt(a, 0)} · (${joinSum(b, c)}) = ${fmt(a * (b + c), 0)}`, "lab-text") +
    text(36, 110, `${joinSum(a * b, a * c)} = ${fmt(a * b + a * c, 0)}`, "lab-text")
  );
}

const FIGURE: Record<Family, (values: LabValues, readouts: ReadoutValues) => string> = {
  share: (v) => share(v),
  compare: (v) => compare(v),
  sum: (v) => sum(v),
  mixed: (v) => mixed(v),
  percent: (v) => percent(v),
  ray: (v) => ray(v),
  tenth: (v) => tenth(v),
  tenth2: (v) => tenth2(v),
  digits: (v) => digits(v),
  power: (v, r) => power(v, r),
  round: (v, r) => roundView(v, r),
  para: (v) => para(v),
  tri: (v) => tri(v),
  trap: (v) => trap(v),
  box: (v) => box(v),
  cut: (v) => cut(v),
  hole: (v) => hole(v),
  unlike: (v) => unlike(v),
  bars: (v) => bars(v, 0),
  trick: (v) => bars(v, n(v, "floor")),
  dist: (v) => dist(v),
};

const TRACKS: Record<Family, Array<[keyof typeof RANGES, string]>> = {
  share: [["num", "Zähler"], ["den", "Nenner"]],
  compare: [["n1", "links Z"], ["d1", "links N"], ["n2", "rechts Z"], ["d2", "rechts N"]],
  sum: [["n1", "Zähler 1"], ["n2", "Zähler 2"], ["den", "Nenner"]],
  mixed: [["whole", "Ganze"], ["num", "Zähler"], ["den", "Nenner"]],
  percent: [["p", "Prozent"]],
  ray: [["pos", "Halbe"]],
  tenth: [["tick", "Zehntel"]],
  tenth2: [["a10", "erste"], ["b10", "zweite"]],
  digits: [["ones", "Einer"], ["tenths", "Zehntel"], ["hundredths", "Hundertstel"]],
  power: [["base", "Basis"], ["exp", "Exponent"]],
  round: [["tick", "Zehntel"], ["stelle", "Stelle"]],
  para: [["g", "g"], ["h", "h"], ["slant", "Überstand"]],
  tri: [["g", "g"], ["h", "h"]],
  trap: [["ta", "a"], ["tc", "c"], ["th", "h"]],
  box: [["la", "a"], ["lb", "b"], ["lc", "c"]],
  cut: [["ca", "Länge"], ["cb", "Breite"], ["cc", "Höhe"], ["cut", "Schnitt"]],
  hole: [["la", "außen L"], ["lb", "außen B"], ["lc", "Höhe"], ["cut", "Loch L"], ["cb", "Loch B"]],
  unlike: [["n1", "links Z"], ["d1", "links N"], ["n2", "rechts Z"], ["d2", "rechts N"]],
  bars: [["ga", "A"], ["gb", "B"], ["gc", "C"]],
  trick: [["ga", "A"], ["gb", "B"], ["gc", "C"], ["floor", "Achse"]],
  dist: [["fa", "a"], ["fb", "b"], ["fc", "c"]],
};

export function viewFor(family: Family, label: string): LabView {
  const spec = TRACKS[family];
  return {
    handles: Object.fromEntries(spec.map(([key]) => [`${key}-griff`, { x: key, drag: dragX(key) }])),
    render: (values, readouts) => {
      const drawn = tracks(spec.map(([key]) => key), spec.map(([, name]) => name), values);
      return close(FIGURE[family](values, readouts) + drawn.svg, label);
    },
  };
}
