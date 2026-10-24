/** Small, explicit school models; no inference from formula strings and no hidden data. */

const SUB = "₀₁₂₃₄₅₆₇₈₉";
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";

/** 12 → "₁₂"; 1 is left out as in every formula. */
export function sub(count: number): string {
  return count === 1 ? "" : [...String(count)].map((d) => SUB[Number(d)]).join("");
}

/** The charge as written behind an ion: +, 2+, 3−. */
export function chargeText(charge: number): string {
  const size = Math.abs(charge);
  return `${size === 1 ? "" : [...String(size)].map((d) => SUP[Number(d)]).join("")}${charge > 0 ? "⁺" : "⁻"}`;
}

export const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII"];

/** An oxidation number as a Roman numeral with sign: +III, −II, 0. */
export function oxText(value: number): string {
  if (value === 0) return "0";
  return `${value > 0 ? "+" : "−"}${ROMAN[Math.abs(value)]}`;
}

export interface Ion {
  /** The formula without charge, e.g. "SO₄". */
  core: string;
  name: string;
  charge: number;
  /** Several atoms: parentheses when more than one ion stands in the formula. */
  poly: boolean;
}

export interface Metal extends Ion {
  /** Name of the element, for Stock names such as Eisen(III)-oxid. */
  element: string;
  /** Metals with several common ion charges need the Roman numeral in the name. */
  variable: boolean;
}

const metal = (core: string, element: string, charge: number, variable = false): Metal => ({
  core,
  name: `${element}ion`,
  element,
  charge,
  poly: false,
  variable,
});

export const CATIONS: Metal[] = [
  metal("Na", "Natrium", 1),
  metal("K", "Kalium", 1),
  metal("Mg", "Magnesium", 2),
  metal("Ca", "Calcium", 2),
  metal("Zn", "Zink", 2),
  metal("Fe", "Eisen", 2, true),
  metal("Fe", "Eisen", 3, true),
  metal("Cu", "Kupfer", 2, true),
  metal("Al", "Aluminium", 3),
];

export const ANIONS: Ion[] = [
  { core: "F", name: "Fluorid", charge: -1, poly: false },
  { core: "Cl", name: "Chlorid", charge: -1, poly: false },
  { core: "Br", name: "Bromid", charge: -1, poly: false },
  { core: "I", name: "Iodid", charge: -1, poly: false },
  { core: "O", name: "Oxid", charge: -2, poly: false },
  { core: "S", name: "Sulfid", charge: -2, poly: false },
  { core: "N", name: "Nitrid", charge: -3, poly: false },
  { core: "OH", name: "Hydroxid", charge: -1, poly: true },
  { core: "NO₃", name: "Nitrat", charge: -1, poly: true },
  { core: "SO₄", name: "Sulfat", charge: -2, poly: true },
  { core: "CO₃", name: "Carbonat", charge: -2, poly: true },
  { core: "PO₄", name: "Phosphat", charge: -3, poly: true },
];

export function ionFormula(ion: Ion): string {
  return `${ion.core}${chargeText(ion.charge)}`;
}

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

/** Smallest whole numbers of cations and anions whose charges cancel. */
export function saltRatio(cationCharge: number, anionCharge: number): [number, number] {
  const p = Math.abs(cationCharge);
  const n = Math.abs(anionCharge);
  const divisor = gcd(p, n);
  return [n / divisor, p / divisor];
}

function part(ion: Ion, count: number): string {
  return ion.poly && count > 1 ? `(${ion.core})${sub(count)}` : `${ion.core}${sub(count)}`;
}

/** A formula with given counts, also a wrong one for a distractor. */
export function formulaWith(cation: Ion, anion: Ion, c: number, a: number): string {
  return part(cation, c) + part(anion, a);
}

/** The Verhältnisformel, e.g. Al₂O₃, Ca(OH)₂, Fe₂(SO₄)₃. */
export function saltFormula(cation: Ion, anion: Ion): string {
  const [c, a] = saltRatio(cation.charge, anion.charge);
  return formulaWith(cation, anion, c, a);
}

/**
 * The salt name as German school books write it: the Roman numeral only for
 * metals with more than one common ion charge (Eisen(III)-oxid), the plain
 * name otherwise (Natriumchlorid). `always: true` adds the numeral everywhere.
 */
export function saltName(cation: Metal, anion: Ion, always = false): string {
  if (always || cation.variable)
    return `${cation.element}(${ROMAN[cation.charge]})-${anion.name.toLowerCase()}`;
  return `${cation.element}${anion.name.toLowerCase()}`;
}

export interface Acid {
  formula: string;
  name: string;
  /** Säurerestionen after each protolysis step: formula with charge and name. */
  steps: Array<[string, string]>;
  organic: boolean;
}

export const ACIDS: Acid[] = [
  { formula: "HCl", name: "Chlorwasserstoff", steps: [["Cl⁻", "Chloridion"]], organic: false },
  { formula: "HNO₃", name: "Salpetersäure", steps: [["NO₃⁻", "Nitration"]], organic: false },
  {
    formula: "H₂SO₄",
    name: "Schwefelsäure",
    steps: [
      ["HSO₄⁻", "Hydrogensulfation"],
      ["SO₄²⁻", "Sulfation"],
    ],
    organic: false,
  },
  {
    formula: "H₂CO₃",
    name: "Kohlensäure",
    steps: [
      ["HCO₃⁻", "Hydrogencarbonation"],
      ["CO₃²⁻", "Carbonation"],
    ],
    organic: false,
  },
  {
    formula: "H₃PO₄",
    name: "Phosphorsäure",
    steps: [
      ["H₂PO₄⁻", "Dihydrogenphosphation"],
      ["HPO₄²⁻", "Hydrogenphosphation"],
      ["PO₄³⁻", "Phosphation"],
    ],
    organic: false,
  },
  {
    formula: "CH₃COOH",
    name: "Ethansäure (Essigsäure)",
    steps: [["CH₃COO⁻", "Ethanoation (Acetation)"]],
    organic: true,
  },
  {
    formula: "HCOOH",
    name: "Methansäure (Ameisensäure)",
    steps: [["HCOO⁻", "Methanoation (Formiation)"]],
    organic: true,
  },
];

/**
 * pH of a strong acid titrated with a strong base at about 25 °C, both
 * one-protic. Volumes in ml, concentrations in mol/l. At the equivalence point
 * the solution is neutral (pH 7); the autoprotolysis of water is neglected
 * elsewhere, which is accurate away from that point.
 */
export function titrationPh(acidMl: number, acidC: number, baseMl: number, baseC: number): number {
  const acid = acidMl * acidC;
  const base = baseMl * baseC;
  const total = acidMl + baseMl;
  if (total <= 0) return 7;
  if (Math.abs(acid - base) < 1e-9) return 7;
  if (acid > base) return Math.min(7, -Math.log10((acid - base) / total));
  return Math.max(7, 14 + Math.log10((base - acid) / total));
}

/** Model colours of three school indicators; ranges at about 25 °C. */
export function indicatorColor(indicator: number, ph: number): string {
  if (indicator === 1) return ph < 6 ? "gelb" : ph <= 7.6 ? "grün" : "blau";
  if (indicator === 2) return ph < 8.2 ? "farblos" : ph <= 12 ? "pink" : "verblassend";
  if (ph < 3) return "rot";
  if (ph < 5) return "orange";
  if (ph < 6.5) return "gelb";
  if (ph <= 7.5) return "grün";
  if (ph < 10) return "blau";
  return "violett";
}

export const INDICATORS = ["Universalindikator", "Bromthymolblau", "Phenolphthalein"];

const STEMS = ["Meth", "Eth", "Prop", "But", "Pent", "Hex", "Hept", "Oct", "Non", "Dec"];
const ALKYL = ["Methyl", "Ethyl", "Propyl", "Butyl", "Pentyl", "Hexyl"];

/** Stem of the alkane with n carbon atoms: Meth, Eth, Prop, … */
export function stem(n: number): string {
  return STEMS[Math.max(1, Math.min(10, n)) - 1];
}

/** Unbranched primary alkanol with n carbon atoms, OH at C1. */
export function alkanolName(n: number): string {
  return n <= 2 ? `${stem(n)}anol` : `${stem(n)}an-1-ol`;
}

export function alkanalName(n: number): string {
  return `${stem(n)}anal`;
}

export function acidName(n: number): string {
  return `${stem(n)}ansäure`;
}

export function alkylName(n: number): string {
  return ALKYL[Math.max(1, Math.min(6, n)) - 1];
}

/** Ester from an alkansäure with n carbon atoms and a primary alkanol with m. */
export function esterName(n: number, m: number): string {
  return `${acidName(n)}${alkylName(m).toLowerCase()}ester`;
}

function chain(n: number): string {
  // The CH₃–(CH₂)ₖ– part before the functional carbon.
  if (n <= 1) return "";
  return ["CH₃", ...Array.from({ length: n - 2 }, () => "CH₂")].join("–") + "–";
}

/** Halbstrukturformel of the n-th member: 0 alkanol, 1 alkanal, 2 alkansäure. */
export function oxidationStepFormula(n: number, step: number): string {
  const head = chain(n);
  if (step === 0) return n === 1 ? "CH₃–OH" : `${head}CH₂–OH`;
  if (step === 1) return n === 1 ? "H–CHO" : `${head}CHO`;
  return n === 1 ? "H–COOH" : `${head}COOH`;
}

export function oxidationStepName(n: number, step: number): string {
  return [alkanolName(n), alkanalName(n), acidName(n)][Math.max(0, Math.min(2, step))];
}

/**
 * Oxidation number of a carbon atom from its partners: each bond to an O
 * atom counts +1, each H atom −1, bonds to C atoms count 0.
 */
export function carbonOxidation(hydrogens: number, oxygenBonds: number): number {
  return oxygenBonds - hydrogens;
}

/** The functional carbon of the oxidation series: number of H and of bonds to O. */
export function functionalCarbon(n: number, step: number): { h: number; o: number } {
  const h = [3, 2, 1][step] - (n === 1 ? 0 : 1);
  return { h, o: [1, 2, 3][step] };
}

export function esterFormula(n: number, m: number): string {
  const acidPart = n === 1 ? "H–COO–" : `${chain(n)}COO–`;
  return acidPart + [...Array.from({ length: m - 1 }, () => "CH₂"), "CH₃"].join("–");
}

export function esterSum(n: number, m: number): string {
  const c = n + m;
  return `C${sub(c)}H${sub(2 * c)}O₂`;
}

export interface FattyAcid {
  name: string;
  carbons: number;
  doubleBonds: number;
}

export const FATTY_ACIDS: FattyAcid[] = [
  { name: "Palmitinsäure", carbons: 16, doubleBonds: 0 },
  { name: "Stearinsäure", carbons: 18, doubleBonds: 0 },
  { name: "Ölsäure", carbons: 18, doubleBonds: 1 },
  { name: "Linolsäure", carbons: 18, doubleBonds: 2 },
  { name: "Linolensäure", carbons: 18, doubleBonds: 3 },
];

/** Glycerin C₃H₈O₃ plus three fatty acids minus three water molecules. */
export function fatFormula(acids: FattyAcid[]): string {
  const c = 3 + acids.reduce((total, acid) => total + acid.carbons, 0);
  const h =
    8 + acids.reduce((total, acid) => total + 2 * acid.carbons - 2 * acid.doubleBonds, 0) - 6;
  return `C${sub(c)}H${sub(h)}O₆`;
}

/**
 * State at 20 °C in a deliberately simple model: at most one unsaturated
 * chain → fest, two or three → flüssig (Öl). Real fats are mixtures.
 */
export function fatState(acids: FattyAcid[]): "fest" | "flüssig" {
  return acids.filter((acid) => acid.doubleBonds > 0).length >= 2 ? "flüssig" : "fest";
}

export interface LatticeSalt {
  formula: string;
  cation: number;
  anion: number;
  /** Distance of the ion centres in pm (sum of ionic radii, rounded). */
  distance: number;
  /** Gitterenergie in kJ/mol, rounded table value. */
  energy: number;
  /** Schmelztemperatur in °C. */
  melting: number;
}

export const LATTICE_SALTS: LatticeSalt[] = [
  { formula: "NaF", cation: 1, anion: 1, distance: 235, energy: 923, melting: 993 },
  { formula: "NaCl", cation: 1, anion: 1, distance: 283, energy: 786, melting: 801 },
  { formula: "NaBr", cation: 1, anion: 1, distance: 298, energy: 747, melting: 747 },
  { formula: "KF", cation: 1, anion: 1, distance: 271, energy: 821, melting: 858 },
  { formula: "KCl", cation: 1, anion: 1, distance: 319, energy: 715, melting: 770 },
  { formula: "KBr", cation: 1, anion: 1, distance: 334, energy: 682, melting: 734 },
  { formula: "MgO", cation: 2, anion: 2, distance: 212, energy: 3791, melting: 2852 },
  { formula: "CaO", cation: 2, anion: 2, distance: 240, energy: 3401, melting: 2613 },
];

/** Atoms of the photosynthesis model: 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂ with light. */
export function photosynthesis(
  co2: number,
  water: number,
  light: boolean,
): { glucose: number; oxygen: number; co2: number; water: number } {
  const glucose = light ? Math.floor(Math.min(co2, water) / 6) : 0;
  return { glucose, oxygen: 6 * glucose, co2: co2 - 6 * glucose, water: water - 6 * glucose };
}

/** Energy content in kJ per gram, rounded nutrition-table values. */
export const FUELS = [
  { name: "Zucker", energy: 17 },
  { name: "Erdnuss", energy: 25 },
  { name: "Pflanzenöl", energy: 37 },
];

/** Specific heat capacity of water in J/(g·K). */
export const C_WATER = 4.19;

/** Temperature rise of the water in an ideal calorimeter without heat loss. */
export function temperatureRise(energyKj: number, waterG: number): number {
  return (energyKj * 1000) / (C_WATER * waterG);
}
