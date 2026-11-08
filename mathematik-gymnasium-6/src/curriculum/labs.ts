import type { LabDefinition, LabValues } from "../model/types";
import { clampParam } from "../lab/engine";
import { fracText, fmt } from "../exercises/format";
import { isTerminating, reduce, roundTo } from "./math";
import { lab, output as o, range } from "./builders";

/**
 * Slider ranges shared by every lab of a family and by its drag handles.
 * A handle inverts the same min and max, so dragging it back to where it
 * is drawn changes nothing.
 */
export const RANGES = {
  num: { min: 0, max: 12, step: 1 },
  den: { min: 2, max: 12, step: 1 },
  n1: { min: 0, max: 8, step: 1 },
  d1: { min: 2, max: 8, step: 1 },
  n2: { min: 0, max: 8, step: 1 },
  d2: { min: 2, max: 8, step: 1 },
  whole: { min: 0, max: 6, step: 1 },
  p: { min: 0, max: 100, step: 5 },
  pos: { min: -12, max: 12, step: 1 },
  tick: { min: -30, max: 30, step: 1 },
  a10: { min: -20, max: 20, step: 1 },
  b10: { min: -20, max: 20, step: 1 },
  ones: { min: 0, max: 9, step: 1 },
  tenths: { min: 0, max: 9, step: 1 },
  hundredths: { min: 0, max: 9, step: 1 },
  base: { min: -5, max: 5, step: 1 },
  exp: { min: -3, max: 5, step: 1 },
  g: { min: 3, max: 12, step: 1 },
  h: { min: 1, max: 8, step: 1 },
  slant: { min: 0, max: 6, step: 1 },
  ta: { min: 4, max: 14, step: 1 },
  tc: { min: 2, max: 10, step: 1 },
  th: { min: 1, max: 8, step: 1 },
  la: { min: 1, max: 8, step: 1 },
  lb: { min: 1, max: 6, step: 1 },
  lc: { min: 1, max: 6, step: 1 },
  ca: { min: 3, max: 8, step: 1 },
  cb: { min: 1, max: 6, step: 1 },
  cc: { min: 1, max: 6, step: 1 },
  cut: { min: 1, max: 5, step: 1 },
  ga: { min: 0, max: 12, step: 1 },
  gb: { min: 0, max: 12, step: 1 },
  gc: { min: 0, max: 12, step: 1 },
  floor: { min: 0, max: 8, step: 1 },
  fa: { min: 1, max: 9, step: 1 },
  fb: { min: -5, max: 8, step: 1 },
  fc: { min: -5, max: 8, step: 1 },
  stelle: { min: 0, max: 2, step: 1 },
} as const;

type RangeKey = keyof typeof RANGES;

const slider = (key: RangeKey, label: string, value: number, unit = "") => {
  const spec = RANGES[key];
  return range(key, label, spec.min, spec.max, value, spec.step, unit);
};

export type Family =
  | "share"
  | "compare"
  | "sum"
  | "mixed"
  | "percent"
  | "ray"
  | "tenth"
  | "tenth2"
  | "digits"
  | "power"
  | "round"
  | "para"
  | "tri"
  | "trap"
  | "box"
  | "cut"
  | "hole"
  | "unlike"
  | "bars"
  | "trick"
  | "dist";

/** Which drawing a lab kind uses. Kinds are unique; families are shared. */
export const KIND_FAMILY = {
  "share-anteile": "share",
  "share-ganzes": "share",
  "share-erweitern": "share",
  "compare-groesse": "compare",
  "percent-schreibweise": "percent",
  "ray-rational": "ray",
  "digits-stellen": "digits",
  "round-dezimal": "round",
  "share-vorstellung": "share",
  "share-endlich": "share",
  "tenth-umwandeln": "tenth",
  "sum-gleichnamig": "sum",
  "compare-ungleich": "unlike",
  "mixed-gemischt": "mixed",
  "tenth2-dezimal": "tenth2",
  "tenth2-vorteile": "tenth2",
  "tenth2-terme": "tenth2",
  "compare-mal": "compare",
  "compare-div": "compare",
  "tenth2-dezimal-mal": "tenth2",
  "power-potenz": "power",
  "tenth2-mal-vorteil": "tenth2",
  "tenth2-struktur": "tenth2",
  "tenth2-kopf": "tenth2",
  "dist-gesetz": "dist",
  "compare-anteil": "compare",
  "tenth2-sach": "tenth2",
  "para-herleitung": "para",
  "tri-herleitung": "tri",
  "trap-herleitung": "trap",
  "para-anwenden": "para",
  "tri-vergleich": "tri",
  "box-oberflaeche": "box",
  "box-messen": "box",
  "box-einheiten": "box",
  "box-quader": "box",
  "box-naeherung": "box",
  "cut-zerlegen": "cut",
  "cut-kopf": "hole",
  "percent-grund": "percent",
  "percent-schluss": "percent",
  "percent-rabatt": "percent",
  "percent-text": "percent",
  "bars-haeufig": "bars",
  "bars-diagramm": "bars",
  "bars-trick": "trick",
  "bars-mittel": "bars",
} as const;

export type LabKind = keyof typeof KIND_FAMILY;

const safePow = (base: number, exp: number): number | string => {
  if (base === 0 && exp <= 0) return "nicht definiert";
  const value = base ** exp;
  return Number.isFinite(value) ? value : "nicht definiert";
};

function paramsOf(family: Family) {
  switch (family) {
    case "share":
      return [slider("num", "Zähler", 1), slider("den", "Nenner", 4)];
    case "compare":
    case "unlike":
      return [
        slider("n1", "Zähler links", 1),
        slider("d1", "Nenner links", 2),
        slider("n2", "Zähler rechts", 1),
        slider("d2", "Nenner rechts", 3),
      ];
    case "sum":
      return [
        slider("n1", "erster Zähler", 1),
        slider("n2", "zweiter Zähler", 1),
        slider("den", "gemeinsamer Nenner", 5),
      ];
    case "mixed":
      return [
        slider("whole", "Ganze", 1),
        slider("num", "Zähler", 1),
        slider("den", "Nenner", 3),
      ];
    case "percent":
      return [slider("p", "Prozentsatz", 10, "%")];
    case "ray":
      return [slider("pos", "Punkt in Halben", 1)];
    case "tenth":
      return [slider("tick", "Zahl in Zehnteln", 16)];
    case "tenth2":
      return [
        slider("a10", "erste Zahl in Zehnteln", 4),
        slider("b10", "zweite Zahl in Zehnteln", -2),
      ];
    case "digits":
      return [
        slider("ones", "Einer", 1),
        slider("tenths", "Zehntel", 2),
        slider("hundredths", "Hundertstel", 0),
      ];
    case "power":
      return [slider("base", "Basis", 2), slider("exp", "Exponent", 3)];
    case "round":
      return [
        slider("tick", "Zahl in Zehnteln", 16),
        slider("stelle", "Stelle: 0 Einer, 1 Zehntel, 2 Hundertstel", 0),
      ];
    case "para":
      return [
        slider("g", "Grundlinie g", 6, "cm"),
        slider("h", "Höhe h", 2, "cm"),
        slider("slant", "Überstand", 1, "cm"),
      ];
    case "tri":
      return [slider("g", "Grundlinie g", 6, "cm"), slider("h", "Höhe h", 2, "cm")];
    case "trap":
      return [
        slider("ta", "Seite a", 8, "cm"),
        slider("tc", "Seite c", 4, "cm"),
        slider("th", "Höhe h", 2, "cm"),
      ];
    case "box":
      return [
        slider("la", "Länge a", 3, "cm"),
        slider("lb", "Breite b", 2, "cm"),
        slider("lc", "Höhe c", 2, "cm"),
      ];
    case "cut":
      return [
        slider("ca", "Länge", 6, "cm"),
        slider("cb", "Breite", 2, "cm"),
        slider("cc", "Höhe", 2, "cm"),
        slider("cut", "Schnittstelle", 2, "cm"),
      ];
    case "hole":
      return [
        slider("la", "Länge außen", 6, "cm"),
        slider("lb", "Breite außen", 4, "cm"),
        slider("lc", "Höhe", 2, "cm"),
        slider("cut", "Länge der Aussparung", 2, "cm"),
        slider("cb", "Breite der Aussparung", 2, "cm"),
      ];
    case "bars":
      return [
        slider("ga", "Gruppe A", 2),
        slider("gb", "Gruppe B", 5),
        slider("gc", "Gruppe C", 3),
      ];
    case "trick":
      return [
        slider("ga", "Gruppe A", 4),
        slider("gb", "Gruppe B", 6),
        slider("gc", "Gruppe C", 5),
        slider("floor", "Achse beginnt bei", 0),
      ];
    case "dist":
      return [
        slider("fa", "Faktor a", 2),
        slider("fb", "Summand b", 3),
        slider("fc", "Summand c", 1),
      ];
  }
}

function readoutsOf(family: Family): LabDefinition["readouts"] {
  switch (family) {
    case "share":
      return [
        o("bruch", "Bruch", (v) => fracText(v.num, v.den)),
        o("wert", "Wert", (v) => v.num / v.den, "", 3),
        o("endlich", "Dezimalbruch", (v) => (isTerminating(v.num, v.den) ? "endlich" : "periodisch")),
      ];
    case "compare":
      return [
        o("links", "links", (v) => fracText(v.n1, v.d1)),
        o("rechts", "rechts", (v) => fracText(v.n2, v.d2)),
        o("produkt", "Produkt", (v) => (v.n1 / v.d1) * (v.n2 / v.d2), "", 4),
        o("quotient", "Quotient", (v) => (v.n2 === 0 ? "nicht definiert" : (v.n1 / v.d1) / (v.n2 / v.d2)), "", 4),
      ];
    case "unlike":
      return [
        o("links", "erster Bruch", (v) => fracText(v.n1, v.d1)),
        o("rechts", "zweiter Bruch", (v) => fracText(v.n2, v.d2)),
        o("summe", "Summe", (v) => fracText(v.n1 * v.d2 + v.n2 * v.d1, v.d1 * v.d2)),
        o("wert", "Wert", (v) => v.n1 / v.d1 + v.n2 / v.d2, "", 3),
      ];
    case "sum":
      return [
        o("summe", "Summe", (v) => fracText(v.n1 + v.n2, v.den)),
        o("wert", "Wert", (v) => (v.n1 + v.n2) / v.den, "", 3),
      ];
    case "mixed":
      return [
        o("unecht", "als Bruch", (v) => fracText(v.whole * v.den + v.num, v.den)),
        o("wert", "Wert", (v) => v.whole + v.num / v.den, "", 3),
      ];
    case "percent":
      return [
        o("bruch", "als Bruch", (v) => fracText(v.p, 100)),
        o("dezimal", "als Dezimalbruch", (v) => v.p / 100, "", 2),
        o("winkel", "Winkel im Kreis", (v) => (v.p / 100) * 360, "°", 0),
      ];
    case "ray":
      return [o("zahl", "Zahl", (v) => v.pos / 2, "", 1)];
    case "tenth":
      return [o("zahl", "Zahl", (v) => v.tick / 10, "", 1)];
    case "tenth2":
      return [
        o("summe", "Summe", (v) => (v.a10 + v.b10) / 10, "", 1),
        o("differenz", "Differenz", (v) => (v.a10 - v.b10) / 10, "", 1),
        o("produkt", "Produkt", (v) => (v.a10 / 10) * (v.b10 / 10), "", 2),
      ];
    case "digits":
      return [
        o("zahl", "Zahl", (v) => v.ones + v.tenths / 10 + v.hundredths / 100, "", 2),
      ];
    case "power":
      return [
        o("wert", "Wert", (v) => safePow(v.base, v.exp), "", 4),
        o("bruch", "bei negativem Exponenten", (v) =>
          v.exp < 0 && v.base !== 0 ? fracText(v.base < 0 && v.exp % 2 !== 0 ? -1 : 1, Math.abs(v.base) ** Math.abs(v.exp)) : "—",
        ),
      ];
    case "round":
      return [
        o("zahl", "Zahl", (v) => v.tick / 10, "", 1),
        o("gerundet", "gerundet", (v) => {
          const digits = v.stelle === 0 ? 0 : v.stelle === 1 ? 1 : 2;
          return roundTo(v.tick / 10, digits);
        }, "", 2),
      ];
    case "para":
      return [
        o("flaeche", "Flächeninhalt", (v) => v.g * v.h, "cm²", 0),
        o("rechteck", "gleich großes Rechteck", (v) => `${fmt(v.g, 0)} cm · ${fmt(v.h, 0)} cm`),
      ];
    case "tri":
      return [o("flaeche", "Flächeninhalt", (v) => (v.g * v.h) / 2, "cm²", 1)];
    case "trap":
      return [
        o("mittel", "Mittelparallele", (v) => (v.ta + v.tc) / 2, "cm", 1),
        o("flaeche", "Flächeninhalt", (v) => ((v.ta + v.tc) / 2) * v.th, "cm²", 1),
      ];
    case "box":
      return [
        o("volumen", "Volumen", (v) => v.la * v.lb * v.lc, "cm³", 0),
        o("oberflaeche", "Oberfläche", (v) => 2 * (v.la * v.lb + v.la * v.lc + v.lb * v.lc), "cm²", 0),
      ];
    case "cut":
      return [
        o("links", "linker Quader", (v) => Math.min(v.cut, v.ca - 1) * v.cb * v.cc, "cm³", 0),
        o("rechts", "rechter Quader", (v) => (v.ca - Math.min(v.cut, v.ca - 1)) * v.cb * v.cc, "cm³", 0),
        o("volumen", "zusammen", (v) => v.ca * v.cb * v.cc, "cm³", 0),
      ];
    case "hole": {
      const opening = (v: LabValues) =>
        Math.min(v.cut, Math.max(1, v.la - 1)) * Math.min(v.cb, Math.max(1, v.lb - 1)) * v.lc;
      return [
        o("gross", "großer Quader", (v) => v.la * v.lb * v.lc, "cm³", 0),
        o("loch", "Aussparung", opening, "cm³", 0),
        o("rest", "Rest", (v) => v.la * v.lb * v.lc - opening(v), "cm³", 0),
      ];
    }
    case "bars":
      return [
        o("summe", "Summe", (v) => v.ga + v.gb + v.gc, "", 0),
        o("mittel", "arithmetisches Mittel", (v) => (v.ga + v.gb + v.gc) / 3, "", 2),
      ];
    case "trick":
      return [
        o("summe", "Summe", (v) => v.ga + v.gb + v.gc, "", 0),
        o("achse", "Achsenanfang", (v) => v.floor, "", 0),
      ];
    case "dist":
      return [
        o("links", "a · (b + c)", (v) => v.fa * (v.fb + v.fc), "", 0),
        o("rechts", "a · b + a · c", (v) => v.fa * v.fb + v.fa * v.fc, "", 0),
      ];
  }
}

export interface GoalSpec {
  id: string;
  text: string;
  at: Record<string, number>;
  check: (values: LabValues) => boolean;
}

/** Filled while the stages build their labs. Tests read the same object. */
export const WITNESSES: Record<string, Record<string, Record<string, number>>> = {};

export function familyLab(
  lessonId: string,
  kind: LabKind,
  title: string,
  intro: string,
  goals: GoalSpec[],
): LabDefinition {
  if (KIND_FAMILY[kind] === undefined) throw new Error(`unknown lab kind ${kind}`);
  const family = KIND_FAMILY[kind];
  const params = paramsOf(family);
  const defaults: LabValues = {};
  for (const param of params) defaults[param.key] = param.value;
  if (WITNESSES[lessonId]) throw new Error(`duplicate lab for ${lessonId}`);
  WITNESSES[lessonId] = {};
  const seen = new Set<string>();
  for (const goal of goals) {
    if (seen.has(goal.id)) throw new Error(`${lessonId}: duplicate goal ${goal.id}`);
    seen.add(goal.id);
    const witness = { ...defaults, ...goal.at };
    for (const param of params) {
      if (witness[param.key] === undefined) throw new Error(`${lessonId}/${goal.id} misses ${param.key}`);
      if (clampParam(param, witness[param.key]) !== witness[param.key]) {
        throw new Error(`${lessonId}/${goal.id}: ${param.key}=${witness[param.key]} is off the slider`);
      }
    }
    if (!goal.check(witness)) throw new Error(`${lessonId}/${goal.id} witness does not reach the goal`);
    if (goal.check(defaults)) throw new Error(`${lessonId}/${goal.id} is already reached at the start`);
    WITNESSES[lessonId][goal.id] = witness;
  }
  if (goals.length !== 3) throw new Error(`${lessonId} needs exactly 3 goals`);
  return lab(
    kind,
    title,
    intro,
    params,
    readoutsOf(family),
    goals.map((goal) => ({ id: goal.id, text: goal.text, check: (values) => goal.check(values) })),
  );
}

/** Reduced fraction text for a readout that must not depend on a view. */
export function reducedLabel(numerator: number, denominator: number): string {
  const { n, d } = reduce(numerator, denominator);
  return fracText(n, d);
}
