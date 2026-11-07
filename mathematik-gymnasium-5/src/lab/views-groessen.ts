import { fmt } from "../exercises/format";
import {
  convert,
  LENGTH,
  MASS,
  MONEY,
  TIME,
  type UnitLadder,
} from "../models";
import { arrow, line, open, rect, text, type LabView } from "./svg";
import { rail, railHandle, title } from "./view-helpers";

/** Sliders may name a unit beyond the short ladders; it stays on the last rung. */
export const rung = (ladder: UnitLadder, index: number) =>
  Math.min(index, ladder.units.length - 1);

/** Seconds as h, min and s: times are never written with a comma. */
export function timeText(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const min = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const parts = [h ? `${h} h` : "", min ? `${min} min` : "", s ? `${s} s` : ""].filter(Boolean);
  return parts.join(" ") || "0 s";
}

/** The steps between two units, for the arrow labels. */
function ladderView(ladderOf: (v: Record<string, number>) => UnitLadder): LabView {
  return {
    render(v) {
      const ladder = ladderOf(v);
      const from = rung(ladder, v.from);
      const to = rung(ladder, v.to);
      const count = ladder.units.length;
      const width = Math.min(92, 460 / count);
      const x = (i: number) => 260 + (i - (count - 1) / 2) * width;
      let out =
        open(`Einheitenleiter ${ladder.name}`) +
        title(
          `${fmt(v.amount, 0)} ${ladder.units[from]} = ${
            ladder === TIME && !Number.isInteger(convert(ladder, v.amount, from, to))
              ? timeText(convert(ladder, v.amount, from, 0))
              : `${fmt(convert(ladder, v.amount, from, to), 12)} ${ladder.units[to]}`
          }`,
        );
      ladder.units.forEach((unit, i) => {
        const cls = i === from ? "lab-fill-a" : i === to ? "lab-fill-ok" : "lab-cell";
        out +=
          rect(x(i) - width / 2 + 5, 110, width - 10, 50, cls, 'rx="8"') +
          text(x(i), 141, unit, "lab-text-big", "middle");
        if (i < count - 1) {
          out += text(x(i) + width / 2, 96, `· ${fmt(ladder.factors[i], 0)}`, "lab-text-tick", "middle");
          out += line(x(i) + width / 2 - 8, 104, x(i) + width / 2 + 8, 104, "lab-axis");
        }
      });
      if (from !== to)
        out += arrow(x(from), 178, x(to), 178, from < to ? "lab-curve-2" : "lab-curve", 3);
      out += text(
        260,
        212,
        from === to
          ? "Beide Einheiten sind gleich."
          : from > to
            ? "Zur kleineren Einheit: Die Maßzahl wird größer, du multiplizierst."
            : "Zur größeren Einheit: Die Maßzahl wird kleiner, du dividierst.",
        "lab-text",
        "middle",
      );
      return out + rail("amount", "Maßzahl", v.amount, 1, 5000, 295) + "</svg>";
    },
    handles: { amount: railHandle("amount", 1, 5000) },
  };
}

export const LADDERS_LM = [LENGTH, MASS];
export const LADDERS_GZH = [MONEY, TIME];

const OBJECTS_MAX = 1e6;
const logX = (metres: number) =>
  65 + (390 * (Math.log10(Math.max(metres, 0.001)) + 3)) / (Math.log10(OBJECTS_MAX) + 3);
export const MEASURE_OBJECTS: Array<{ name: string; low: number; high: number }> = [
  { name: "Länge eines Bleistifts", low: 0.1, high: 0.25 },
  { name: "Höhe einer Tür", low: 1.8, high: 2.5 },
  { name: "Weg von München nach Nürnberg", low: 150000, high: 200000 },
];
export const MEASURE_UNITS = ["mm", "cm", "m", "km"];
export const toMetres = (value: number, unit: number) => value * [0.001, 0.01, 1, 1000][unit];

const measureSense: LabView = {
  render(v) {
    const object = MEASURE_OBJECTS[v.object];
    const metres = toMetres(v.value, v.unit);
    let out =
      open("Logarithmische Längenleiter mit Vergleichsgrößen") +
      title(`${object.name}: ${fmt(v.value, 0)} ${MEASURE_UNITS[v.unit]}?`) +
      line(65, 170, 455, 170, "lab-axis");
    const marks: Array<[number, string]> = [[0.001, "1 mm"], [0.01, "1 cm"], [1, "1 m"], [1000, "1 km"], [1e6, "1.000 km"]];
    for (const [m, label] of marks)
      out += line(logX(m), 162, logX(m), 178, "lab-axis") + text(logX(m), 196, label, "lab-text-tick", "middle");
    out += rect(logX(object.low), 158, Math.max(6, logX(object.high) - logX(object.low)), 24, "lab-fill-ok");
    const ok = metres >= object.low && metres <= object.high;
    out +=
      text(logX(metres), 142, "▼", ok ? "lab-text-ok" : "lab-text-bad", "middle") +
      text(260, 240, ok ? "Das passt." : metres > object.high ? "Das ist viel zu groß." : "Das ist viel zu klein.", ok ? "lab-text-ok" : "lab-text-bad", "middle");
    return out + rail("value", "Maßzahl", v.value, 1, 1000, 295) + "</svg>";
  },
  handles: { value: railHandle("value", 1, 1000) },
};

/** Notation lab: 1 big unit is `base` small units. */
export const NOTATION_KINDS = [
  { big: "€", small: "ct", base: 100, digits: 2 },
  { big: "m", small: "cm", base: 100, digits: 2 },
  { big: "kg", small: "g", base: 1000, digits: 3 },
  { big: "km", small: "m", base: 1000, digits: 3 },
];

const notation: LabView = {
  render(v) {
    const kind = NOTATION_KINDS[v.kind];
    const part = (kind.base * v.pct) / 100;
    const comma = (v.whole + v.pct / 100).toFixed(kind.digits).replace(".", ",");
    let out = open("Streifen aus ganzen und angefangenen Einheiten") + title(`${comma} ${kind.big}`);
    const unit = 60;
    for (let i = 0; i < Math.max(v.whole + 1, 1); i++) {
      out += rect(40 + i * unit + 2, 70, unit - 4, 50, "lab-cell");
      const share = i < v.whole ? 1 : v.pct / 100;
      if (share > 0) out += rect(40 + i * unit + 2, 70, (unit - 4) * share, 50, "lab-fill-a");
    }
    return (
      out +
      text(260, 160, `${v.whole} ${kind.big} ${fmt(part, 0)} ${kind.small}`, "lab-text-big", "middle") +
      text(260, 190, `${fmt(v.whole * kind.base + part, 0)} ${kind.small}`, "lab-text", "middle") +
      rail("pct", "Anteil der nächsten Einheit (von 100)", v.pct, 0, 95, 295) +
      "</svg>"
    );
  },
  handles: { pct: railHandle("pct", 0, 95) },
};

export const SCALES: Array<{ label: string; factor: number }> = [
  { label: "1 : 10", factor: 10 },
  { label: "1 : 100", factor: 100 },
  { label: "1 : 25.000", factor: 25000 },
  { label: "5 : 1", factor: 0.2 },
];

/** A length in cm in the largest sensible unit. */
export function lengthText(cm: number): string {
  if (cm >= 100000) return `${fmt(cm / 100000, 3)} km`;
  if (cm >= 100) return `${fmt(cm / 100, 2)} m`;
  if (cm >= 1) return `${fmt(cm, 2)} cm`;
  return `${fmt(cm * 10, 1)} mm`;
}

const scale: LabView = {
  render(v) {
    const s = SCALES[v.scale];
    const real = v.b * s.factor;
    const w = v.b * 20;
    return (
      open("Länge im Bild und in Wirklichkeit") +
      title(`Maßstab ${s.label}`) +
      text(40, 80, "im Bild", "lab-text-small") +
      rect(40, 88, w, 34, "lab-fill-a") +
      text(40 + w / 2, 110, `${v.b} cm`, "lab-text", "middle") +
      text(40, 170, "in Wirklichkeit", "lab-text-small") +
      rect(40, 178, 440, 34, "lab-fill-ok") +
      text(260, 200, lengthText(real), "lab-text-big", "middle") +
      text(260, 245, s.factor < 1 ? "Das Bild ist eine Vergrößerung." : "Das Bild ist eine Verkleinerung.", "lab-text", "middle") +
      rail("b", "Länge im Bild", v.b, 1, 20, 295) +
      "</svg>"
    );
  },
  handles: { b: railHandle("b", 1, 20) },
};

const dreisatz: LabView = {
  render(v) {
    const total = v.n * v.p;
    const rows: Array<[string, string, string]> = [
      [`${v.n} Stück`, `${fmt(total, 0)} €`, "lab-fill-a"],
      ["1 Stück", `${fmt(v.p, 0)} €`, "lab-fill-b"],
      [`${v.t} Stück`, `${fmt(v.t * v.p, 0)} €`, "lab-fill-ok"],
    ];
    let out = open("Dreisatz in drei Zeilen") + title("Dreisatz: über die Einheit rechnen");
    rows.forEach(([left, right, cls], i) => {
      const y = 62 + i * 68;
      out +=
        rect(120, y, 280, 44, cls, 'rx="8"') +
        text(190, y + 28, left, "lab-text-big", "middle") +
        text(330, y + 28, right, "lab-text-big", "middle");
    });
    return (
      out +
      text(108, 118, `: ${v.n}`, "lab-text-b", "end") +
      text(412, 118, `: ${v.n}`, "lab-text-b") +
      text(108, 186, `· ${v.t}`, "lab-text-a", "end") +
      text(412, 186, `· ${v.t}`, "lab-text-a") +
      rail("t", "Gesuchte Anzahl", v.t, 1, 20, 300) +
      "</svg>"
    );
  },
  handles: { t: railHandle("t", 1, 20) },
};

export const PACK_SIZES = [6, 8, 10];
const shopping: LabView = {
  render(v) {
    const need = v.k * v.s;
    const size = PACK_SIZES[v.pack];
    const packs = Math.ceil(need / size);
    const rest = packs * size - need;
    let out = open("Packungen für den benötigten Vorrat") + title(`${v.k} · ${v.s} = ${need} Brötchen`);
    const cell = Math.min(40, 460 / Math.max(packs, 1));
    for (let i = 0; i < packs; i++) {
      const filled = i < packs - 1 || rest === 0;
      out += rect(30 + i * cell + 1, 70, cell - 2, 80, filled ? "lab-fill-a" : "lab-fill-b");
      if (cell > 24) out += text(30 + i * cell + cell / 2, 115, String(size), "lab-text-tick", "middle");
    }
    return (
      out +
      text(260, 190, `${packs} ${packs === 1 ? "Packung" : "Packungen"} zu je ${size} Stück`, "lab-text-big", "middle") +
      text(260, 220, rest ? `${rest} bleiben übrig.` : "Es bleibt nichts übrig.", "lab-text", "middle") +
      rail("k", "Kinder", v.k, 2, 30, 295) +
      "</svg>"
    );
  },
  handles: { k: railHandle("k", 2, 30) },
};

export const GROESSEN_VIEWS: Record<string, LabView> = {
  "measure-sense": measureSense,
  "ladder-length-mass": ladderView((v) => LADDERS_LM[v.kind]),
  "ladder-money-time": ladderView((v) => LADDERS_GZH[v.kind]),
  notation,
  scale,
  dreisatz,
  shopping,
};
export { ladderView };
