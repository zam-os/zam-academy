import type { LabValues } from "../model/types";
import type { GoalSpec } from "./labs";

export const goal = (
  id: string,
  text: string,
  at: Record<string, number>,
  check: (values: LabValues) => boolean,
): GoalSpec => ({ id, text, at, check });

const half = (v: LabValues) => v.num * 2 === v.den && v.den >= 2;
const threeQuarters = (v: LabValues) => v.num * 4 === v.den * 3 && v.den > 0;
const empty = (v: LabValues) => v.num === 0;
const overOne = (v: LabValues) => v.num > v.den;
const oneHalf = (v: LabValues) => v.num === 1 && v.den === 2;

export const shareBasic = (a: string, b: string, c: string): GoalSpec[] => [
  goal("haelfte", a, { num: 2, den: 4 }, half),
  goal("drei-viertel", b, { num: 3, den: 4 }, threeQuarters),
  goal("leer", c, { num: 0, den: 4 }, empty),
];

export const sharePeriod = (): GoalSpec[] => [
  goal("drittel", "Stelle 1/3 ein. Der Dezimalbruch wird periodisch.", { num: 1, den: 3 }, (v) => v.num === 1 && v.den === 3),
  goal("halb", "Stelle 1/2 ein. Der Dezimalbruch bricht ab.", { num: 1, den: 2 }, oneHalf),
  goal("sechstel", "Stelle 1/6 ein.", { num: 1, den: 6 }, (v) => v.num === 1 && v.den === 6),
];

export const shareExtend = (): GoalSpec[] => [
  goal("halb", "Stelle den Bruch 1/2 ein.", { num: 1, den: 2 }, oneHalf),
  goal("erweitert", "Stelle einen Bruch ein, der gleich 1/2 ist, aber den Nenner 4 hat.", { num: 2, den: 4 }, (v) => v.num === 2 && v.den === 4),
  goal("ueber-eins", "Stelle einen Bruch ein, der größer als 1 ist.", { num: 6, den: 4 }, overOne),
];

const equalFrac = (v: LabValues) => v.n1 * v.d2 === v.n2 * v.d1;
const leftSmaller = (v: LabValues) => v.n1 * v.d2 < v.n2 * v.d1;
const sameDen = (v: LabValues) => v.d1 === v.d2 && v.n1 > v.n2;

export const compareBasic = (a: string, b: string, c: string): GoalSpec[] => [
  goal("gleich", a, { n1: 1, d1: 2, n2: 2, d2: 4 }, equalFrac),
  goal("kleiner", b, { n1: 1, d1: 4, n2: 1, d2: 2 }, leftSmaller),
  goal("gleichnamig", c, { n1: 3, d1: 4, n2: 1, d2: 4 }, sameDen),
];

export const sumBasic = (): GoalSpec[] => [
  goal("eins", "Mache die Summe genau 1.", { n1: 2, n2: 3, den: 5 }, (v) => v.n1 + v.n2 === v.den),
  goal("mehr", "Mache die Summe größer als 1.", { n1: 4, n2: 3, den: 5 }, (v) => v.n1 + v.n2 > v.den),
  goal("null", "Setze beide Zähler auf 0.", { n1: 0, n2: 0 }, (v) => v.n1 === 0 && v.n2 === 0),
];

export const mixedBasic = (): GoalSpec[] => [
  goal("ganz", "Mache eine ganze Zahl ohne Bruchteil.", { num: 0 }, (v) => v.num === 0),
  goal("zwei", "Stelle genau 2 ein.", { whole: 1, num: 3, den: 3 }, (v) => v.whole * v.den + v.num === 2 * v.den),
  goal("gross", "Mache die Zahl größer als 3.", { whole: 4 }, (v) => v.whole + v.num / v.den > 3),
];

export const percentMarks = (a: string, b: string, c: string): GoalSpec[] => [
  goal("viertel", a, { p: 25 }, (v) => v.p === 25),
  goal("haelfte", b, { p: 50 }, (v) => v.p === 50),
  goal("drei-viertel", c, { p: 75 }, (v) => v.p === 75),
];

export const rayBasic = (): GoalSpec[] => [
  goal("minus-zwei", "Setze den Punkt auf −2.", { pos: -4 }, (v) => v.pos === -4),
  goal("null", "Setze den Punkt auf 0.", { pos: 0 }, (v) => v.pos === 0),
  goal("vier", "Setze den Punkt auf 4.", { pos: 8 }, (v) => v.pos === 8),
];

export const tenthBasic = (): GoalSpec[] => [
  goal("minus", "Stelle −1,5 ein.", { tick: -15 }, (v) => v.tick === -15),
  goal("eins", "Stelle 1 ein.", { tick: 10 }, (v) => v.tick === 10),
  goal("null", "Stelle 0 ein.", { tick: 0 }, (v) => v.tick === 0),
];

export const tenth2Basic = (): GoalSpec[] => [
  goal("null", "Mache die Summe gleich 0.", { a10: 4, b10: -4 }, (v) => v.a10 + v.b10 === 0),
  goal("positiv", "Mache das Produkt positiv.", { a10: 4, b10: 2 }, (v) => v.a10 * v.b10 > 0),
  goal("differenz", "Mache die Differenz gleich 1.", { a10: 6, b10: -4 }, (v) => v.a10 - v.b10 === 10),
];

export const digitsBasic = (): GoalSpec[] => [
  goal("ganz", "Mache eine ganze Zahl.", { ones: 3, tenths: 0, hundredths: 0 }, (v) => v.tenths === 0 && v.hundredths === 0),
  goal("fuenf", "Setze die Hundertstel auf 5.", { hundredths: 5 }, (v) => v.hundredths === 5),
  goal("gross", "Mache die Zahl größer als 5.", { ones: 7 }, (v) => v.ones > 5),
];

export const powerBasic = (): GoalSpec[] => [
  goal("quadrat", "Stelle 5 hoch 2 ein.", { base: 5, exp: 2 }, (v) => v.base === 5 && v.exp === 2),
  goal("viertel", "Stelle 2 hoch −2 ein.", { base: 2, exp: -2 }, (v) => v.base === 2 && v.exp === -2),
  goal("neun", "Stelle (−3) hoch 2 ein.", { base: -3, exp: 2 }, (v) => v.base === -3 && v.exp === 2),
];

export const roundBasic = (): GoalSpec[] => [
  goal("abrunden", "Runde 1,4 auf Einer.", { tick: 14, stelle: 0 }, (v) => v.tick === 14 && v.stelle === 0),
  goal("zehntel", "Runde 1,6 auf Zehntel.", { tick: 16, stelle: 1 }, (v) => v.tick === 16 && v.stelle === 1),
  goal("drei", "Stelle 3 ein und runde auf Einer.", { tick: 30, stelle: 0 }, (v) => v.tick === 30 && v.stelle === 0),
];

export const paraBasic = (): GoalSpec[] => [
  goal("flaeche", "Mache den Flächeninhalt gleich 24 cm².", { g: 8, h: 3 }, (v) => v.g * v.h === 24),
  goal("rechteck", "Mache den Überstand zu 0.", { slant: 0 }, (v) => v.slant === 0),
  goal("quadrat", "Mache Grundlinie und Höhe gleich lang.", { g: 4, h: 4 }, (v) => v.g === v.h),
];

export const triBasic = (): GoalSpec[] => [
  goal("zwoelf", "Mache den Flächeninhalt gleich 12 cm².", { g: 8, h: 3 }, (v) => v.g * v.h === 24),
  goal("gleich", "Mache Grundlinie und Höhe gleich lang.", { g: 4, h: 4 }, (v) => v.g === v.h),
  goal("doppelt", "Halte die Grundlinie bei 6 cm und setze die Höhe auf 4 cm.", { g: 6, h: 4 }, (v) => v.g === 6 && v.h === 4),
];

export const trapBasic = (): GoalSpec[] => [
  goal("flaeche", "Mache den Flächeninhalt gleich 24 cm².", { ta: 10, tc: 6, th: 3 }, (v) => ((v.ta + v.tc) / 2) * v.th === 24),
  goal("rechteck", "Mache die beiden parallelen Seiten gleich lang.", { ta: 6, tc: 6 }, (v) => v.ta === v.tc),
  goal("achtzehn", "Mache den Flächeninhalt gleich 18 cm².", { ta: 8, tc: 4, th: 3 }, (v) => ((v.ta + v.tc) / 2) * v.th === 18),
];

export const boxBasic = (volumeText: string, surfaceText: string, cubeText: string): GoalSpec[] => [
  goal("wuerfel", cubeText, { la: 2, lb: 2, lc: 2 }, (v) => v.la === v.lb && v.lb === v.lc),
  goal("volumen", volumeText, { la: 4, lb: 3, lc: 2 }, (v) => v.la * v.lb * v.lc === 24),
  goal("oberflaeche", surfaceText, { la: 5, lb: 3, lc: 2 }, (v) => 2 * (v.la * v.lb + v.la * v.lc + v.lb * v.lc) > 60),
];

export const unlikeBasic = (): GoalSpec[] => {
  const numerator = (v: LabValues) => v.n1 * v.d2 + v.n2 * v.d1;
  const denominator = (v: LabValues) => v.d1 * v.d2;
  return [
    goal("eins", "Mache die Summe genau 1.", { n1: 1, d1: 2, n2: 1, d2: 2 }, (v) => numerator(v) === denominator(v)),
    goal("mehr", "Mache die Summe größer als 1.", { n1: 3, d1: 4, n2: 1, d2: 2 }, (v) => numerator(v) > denominator(v)),
    goal("gleich", "Stelle zwei verschiedene Schreibweisen derselben Zahl ein.", { n1: 1, d1: 3, n2: 2, d2: 6 }, (v) => v.n1 * v.d2 === v.n2 * v.d1 && v.d1 !== v.d2),
  ];
};

const holeVolume = (v: LabValues) =>
  Math.min(v.cut, Math.max(1, v.la - 1)) * Math.min(v.cb, Math.max(1, v.lb - 1)) * v.lc;

export const holeBasic = (): GoalSpec[] => [
  goal("rest", "Mache das Restvolumen gleich 36 cm³.", { la: 6, lb: 4, lc: 2, cut: 3, cb: 2 }, (v) => v.la * v.lb * v.lc - holeVolume(v) === 36),
  goal("loch", "Mache das ausgeschnittene Volumen gleich 16 cm³.", { la: 6, lb: 4, lc: 2, cut: 4, cb: 2 }, (v) => holeVolume(v) === 16),
  goal("wuerfel", "Mache den großen Quader zu einem Würfel.", { la: 4, lb: 4, lc: 4 }, (v) => v.la === v.lb && v.lb === v.lc),
];

export const cutBasic = (): GoalSpec[] => [
  goal("mitte", "Schneide genau in der Mitte.", { ca: 6, cut: 3 }, (v) => v.cut * 2 === v.ca),
  goal("eins", "Schneide nach genau 1 cm.", { cut: 1 }, (v) => v.cut === 1),
  goal("wuerfel", "Mache alle drei Kanten gleich lang.", { ca: 4, cb: 4, cc: 4 }, (v) => v.ca === v.cb && v.cb === v.cc),
];

export const barsBasic = (): GoalSpec[] => [
  goal("gleich", "Mache alle drei Gruppen gleich groß und nicht 0.", { ga: 4, gb: 4, gc: 4 }, (v) => v.ga === v.gb && v.gb === v.gc && v.ga > 0),
  goal("mittel", "Mache das arithmetische Mittel zu einer ganzen Zahl, die Gruppen aber verschieden.", { ga: 1, gb: 2, gc: 3 }, (v) => (v.ga + v.gb + v.gc) % 3 === 0 && (v.ga !== v.gb || v.gb !== v.gc)),
  goal("spitze", "Mache Gruppe A zur größten.", { ga: 8, gb: 2, gc: 1 }, (v) => v.ga > v.gb && v.ga > v.gc),
];

export const trickBasic = (): GoalSpec[] => [
  goal("achse", "Lass die Achse bei 4 beginnen, ohne eine Säule abzuschneiden.", { floor: 4 }, (v) => v.floor === 4 && v.ga >= 4 && v.gb >= 4 && v.gc >= 4),
  goal("gleich", "Mache alle drei Säulen gleich hoch.", { ga: 5, gb: 5, gc: 5 }, (v) => v.ga === v.gb && v.gb === v.gc),
  goal("null", "Setze eine Gruppe auf 0.", { ga: 0 }, (v) => v.ga === 0 || v.gb === 0 || v.gc === 0),
];

export const distBasic = (): GoalSpec[] => [
  goal("vierundzwanzig", "Mache a · (b + c) gleich 24.", { fa: 4, fb: 3, fc: 3 }, (v) => v.fa * (v.fb + v.fc) === 24),
  goal("nullsumme", "Mache die Summe in der Klammer gleich 0.", { fa: 2, fb: 2, fc: -2 }, (v) => v.fb + v.fc === 0),
  goal("dreissig", "Mache a · (b + c) gleich 30.", { fa: 6, fb: 4, fc: 1 }, (v) => v.fa * (v.fb + v.fc) === 30),
];
