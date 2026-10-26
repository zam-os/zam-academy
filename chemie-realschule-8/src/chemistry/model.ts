import { fmt, gcd, MINUS, round } from "../exercises/format";

const SUB = "₀₁₂₃₄₅₆₇₈₉";
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";

export function sub(n: number): string {
  return n <= 1
    ? ""
    : String(Math.round(n))
        .split("")
        .map((ch) => SUB[Number(ch)] ?? ch)
        .join("");
}

export function supNum(n: number): string {
  return String(Math.round(n))
    .split("")
    .map((ch) => SUP[Number(ch)] ?? ch)
    .join("");
}

export function ionChargeText(charge: number): string {
  if (charge === 0) return "";
  const abs = Math.abs(charge);
  const sign = charge > 0 ? "⁺" : "⁻";
  return abs === 1 ? sign : `${supNum(abs)}${sign}`;
}

// ─── LB 2: Stoffe, Kenngrößen, Phasen, Linde-Verfahren ─────────────────────

export interface SubstanceSample {
  name: string;
  formula: string;
  density: number; // g/cm³
  mp: number; // °C
  bp: number; // °C
  solubleInWater: string;
  condSolid: boolean;
  condLiquid: boolean;
}

export const SUBSTANCES: readonly SubstanceSample[] = [
  {
    name: "Aluminium",
    formula: "Al",
    density: 2.7,
    mp: 660,
    bp: 2470,
    solubleInWater: "unlöslich",
    condSolid: true,
    condLiquid: true,
  },
  {
    name: "Eisen",
    formula: "Fe",
    density: 7.87,
    mp: 1538,
    bp: 2862,
    solubleInWater: "unlöslich",
    condSolid: true,
    condLiquid: true,
  },
  {
    name: "Kupfer",
    formula: "Cu",
    density: 8.96,
    mp: 1085,
    bp: 2562,
    solubleInWater: "unlöslich",
    condSolid: true,
    condLiquid: true,
  },
  {
    name: "Natriumchlorid (Kochsalz)",
    formula: "NaCl",
    density: 2.17,
    mp: 801,
    bp: 1465,
    solubleInWater: "gut löslich (359 g/l)",
    condSolid: false,
    condLiquid: true,
  },
  {
    name: "Destilliertes Wasser",
    formula: "H₂O",
    density: 1.0,
    mp: 0,
    bp: 100,
    solubleInWater: "Reinstoff (Lösungsmittel)",
    condSolid: false,
    condLiquid: false,
  },
  {
    name: "Ethanol",
    formula: "C₂H₅OH",
    density: 0.79,
    mp: -114,
    bp: 78,
    solubleInWater: "unbegrenzt mischbar",
    condSolid: false,
    condLiquid: false,
  },
];

export function heatingCurveTemp(saltPercent: number, minutes: number): number {
  const start = 20;
  if (saltPercent <= 0) {
    // Reinstoff Wasser: konstanter Siedepunkt bei 100 °C ab Minute 6.
    if (minutes <= 6) return round(start + ((100 - start) * minutes) / 6, 1);
    return 100;
  }
  const boilStart = 100 + 0.35 * saltPercent;
  const boilMinute = 6 + 0.04 * saltPercent;
  if (minutes <= boilMinute) {
    return round(start + ((boilStart - start) * minutes) / boilMinute, 1);
  }
  // Gemisch: Siedebereich — Temperatur steigt beim Sieden weiter an.
  return round(boilStart + (minutes - boilMinute) * (0.28 + 0.05 * saltPercent), 1);
}

export interface PhaseSubstance {
  name: string;
  formula: string;
  mp: number;
  bp: number;
  sublimates: boolean;
}

export const PHASE_SUBSTANCES: readonly PhaseSubstance[] = [
  { name: "Wasser", formula: "H₂O", mp: 0, bp: 100, sublimates: false },
  { name: "Ethanol", formula: "C₂H₅OH", mp: -114, bp: 78, sublimates: false },
  { name: "Iod (offenes Gefäß)", formula: "I₂", mp: 114, bp: 114, sublimates: true },
  { name: "Kohlenstoffdioxid (Trockeneis)", formula: "CO₂", mp: -78.5, bp: -78.5, sublimates: true },
];

export function stateOfMatter(substance: PhaseSubstance, tempC: number): "fest" | "flüssig" | "gasförmig" {
  if (substance.sublimates) {
    return tempC < substance.mp ? "fest" : "gasförmig";
  }
  if (tempC < substance.mp) return "fest";
  if (tempC < substance.bp) return "flüssig";
  return "gasförmig";
}

export interface LindeGas {
  symbol: string;
  name: string;
  bp: number; // °C
  airPercent: number;
}

export const LINDE_GASES: readonly LindeGas[] = [
  { symbol: "N₂", name: "Stickstoff", bp: -196, airPercent: 78 },
  { symbol: "Ar", name: "Argon (Edelgas)", bp: -186, airPercent: 0.9 },
  { symbol: "O₂", name: "Sauerstoff", bp: -183, airPercent: 21 },
];

export function lindeFractionation(tempC: number): {
  n2: "flüssig" | "gasförmig";
  ar: "flüssig" | "gasförmig";
  o2: "flüssig" | "gasförmig";
  summary: string;
} {
  const n2 = tempC >= -196 ? "gasförmig" : "flüssig";
  const ar = tempC >= -186 ? "gasförmig" : "flüssig";
  const o2 = tempC >= -183 ? "gasförmig" : "flüssig";
  const summary =
    tempC < -196
      ? "Flüssige Luft: N₂, Ar und O₂ sind alle flüssig"
      : tempC < -186
        ? "Nur N₂ siedet ab (Kopfprodukt), Ar und O₂ bleiben flüssig"
        : tempC < -183
          ? "N₂ und Ar sind gasförmig, flüssiger Sauerstoff bleibt im Sumpf"
          : "Alle drei Hauptbestandteile liegen wieder gasförmig vor";
  return { n2, ar, o2, summary };
}

// ─── LB 3: Elementklassen, Bindigkeit, binäre Nichtmetallverbindungen & Salze

export interface ElementEntry {
  symbol: string;
  name: string;
  kind: "Metall" | "Nichtmetall";
  density: number; // g/cm³
  mp: number;
  bp: number;
  sublimates?: boolean;
  conductive: boolean;
  appearance: string;
}

export const ELEMENT_SYSTEM: readonly ElementEntry[] = [
  { symbol: "Al", name: "Aluminium", kind: "Metall", density: 2.7, mp: 660, bp: 2470, conductive: true, appearance: "silbrig glänzend, verformbar" },
  { symbol: "Fe", name: "Eisen", kind: "Metall", density: 7.87, mp: 1538, bp: 2862, conductive: true, appearance: "grau glänzend, ferromagnetisch" },
  { symbol: "Cu", name: "Kupfer", kind: "Metall", density: 8.96, mp: 1085, bp: 2562, conductive: true, appearance: "rötlich glänzend, sehr dehnbar" },
  { symbol: "Hg", name: "Quecksilber", kind: "Metall", density: 13.55, mp: -39, bp: 357, conductive: true, appearance: "silbrig flüssiges Metall" },
  { symbol: "S", name: "Schwefel", kind: "Nichtmetall", density: 2.07, mp: 115, bp: 445, conductive: false, appearance: "gelber, spröder Feststoff" },
  { symbol: "C", name: "Kohlenstoff (Graphit)", kind: "Nichtmetall", density: 2.26, mp: 3650, bp: 4200, conductive: true, appearance: "grauschwarz, leitet als Nichtmetall-Ausnahme" },
  { symbol: "Br₂", name: "Brom", kind: "Nichtmetall", density: 3.12, mp: -7, bp: 59, conductive: false, appearance: "rotbraune Flüssigkeit" },
  { symbol: "I₂", name: "Iod", kind: "Nichtmetall", density: 4.93, mp: 114, bp: 114, sublimates: true, conductive: false, appearance: "grauschwarze, violett glänzende Kristalle (sublimiert ab 114 °C)" },
];

export function elementStateAt(el: ElementEntry, tempC: number): "fest" | "flüssig" | "gasförmig" {
  if (el.sublimates) {
    return tempC < el.mp ? "fest" : "gasförmig";
  }
  return tempC < el.mp ? "fest" : tempC < el.bp ? "flüssig" : "gasförmig";
}

export interface NonmetalAtom {
  symbol: string;
  name: string;
  stem: string; // für das zweite Element im Namen: -oxid, -chlorid, -hydrid, -sulfid, -nitrid
  bindigkeit: number;
}

export const NONMETAL_BINDIGKEIT: readonly NonmetalAtom[] = [
  { symbol: "C", name: "Kohlenstoff", stem: "carbid", bindigkeit: 4 },
  { symbol: "Si", name: "Silicium", stem: "silicid", bindigkeit: 4 },
  { symbol: "N", name: "Stickstoff", stem: "nitrid", bindigkeit: 3 },
  { symbol: "P", name: "Phosphor", stem: "phosphid", bindigkeit: 3 },
  { symbol: "S", name: "Schwefel", stem: "sulfid", bindigkeit: 2 },
  { symbol: "O", name: "Sauerstoff", stem: "oxid", bindigkeit: 2 },
  { symbol: "H", name: "Wasserstoff", stem: "hydrid", bindigkeit: 1 },
  { symbol: "Cl", name: "Chlor", stem: "chlorid", bindigkeit: 1 },
  { symbol: "F", name: "Fluor", stem: "fluorid", bindigkeit: 1 },
  { symbol: "I", name: "Iod", stem: "iodid", bindigkeit: 1 },
];

const GREEK_NUMERALS: Record<number, string> = {
  1: "mono",
  2: "di",
  3: "tri",
  4: "tetra",
  5: "penta",
  6: "hexa",
};

/** Smallest integer counts [nA, nB] saturating bindigkeitA * nA = bindigkeitB * nB. */
export function moleculeRatio(bindigkeitA: number, bindigkeitB: number): [number, number] {
  const g = gcd(bindigkeitA, bindigkeitB);
  return [bindigkeitB / g, bindigkeitA / g];
}

export function binaryMoleculeFormula(symA: string, countA: number, symB: string, countB: number): string {
  return `${symA}${sub(countA)}${symB}${sub(countB)}`;
}

/** Systematic name of a binary nonmetal compound using Greek prefixes ("mono-" omitted on the first atom). */
export function binaryNonmetalName(
  firstName: string,
  firstCount: number,
  secondStem: string,
  secondCount: number,
): string {
  const p1 = firstCount > 1 ? (GREEK_NUMERALS[firstCount] ?? String(firstCount)) : "";
  const rawP2 = GREEK_NUMERALS[secondCount] ?? String(secondCount);
  const p2 =
    secondStem.startsWith("o") && (rawP2.endsWith("a") || rawP2.endsWith("o"))
      ? rawP2.slice(0, -1)
      : rawP2;
  const firstPart = p1 ? `${p1[0].toUpperCase()}${p1.slice(1)}${firstName.toLowerCase()}` : firstName;
  return `${firstPart}${p2}${secondStem}`;
}

export interface BinaryCation {
  symbol: string;
  name: string;
  charge: number;
  variableCharge: boolean;
}

export interface BinaryAnion {
  symbol: string;
  elementName: string;
  stem: string;
  charge: number; // negative integer
}

export const CATIONS: readonly BinaryCation[] = [
  { symbol: "Na", name: "Natrium", charge: 1, variableCharge: false },
  { symbol: "K", name: "Kalium", charge: 1, variableCharge: false },
  { symbol: "Mg", name: "Magnesium", charge: 2, variableCharge: false },
  { symbol: "Ca", name: "Calcium", charge: 2, variableCharge: false },
  { symbol: "Al", name: "Aluminium", charge: 3, variableCharge: false },
  { symbol: "Ag", name: "Silber", charge: 1, variableCharge: false },
  { symbol: "Zn", name: "Zink", charge: 2, variableCharge: false },
  { symbol: "Cu", name: "Kupfer", charge: 1, variableCharge: true },
  { symbol: "Cu", name: "Kupfer", charge: 2, variableCharge: true },
  { symbol: "Fe", name: "Eisen", charge: 2, variableCharge: true },
  { symbol: "Fe", name: "Eisen", charge: 3, variableCharge: true },
];

export const ANIONS: readonly BinaryAnion[] = [
  { symbol: "F", elementName: "Fluor", stem: "fluorid", charge: -1 },
  { symbol: "Cl", elementName: "Chlor", stem: "chlorid", charge: -1 },
  { symbol: "Br", elementName: "Brom", stem: "bromid", charge: -1 },
  { symbol: "I", elementName: "Iod", stem: "iodid", charge: -1 },
  { symbol: "O", elementName: "Sauerstoff", stem: "oxid", charge: -2 },
  { symbol: "S", elementName: "Schwefel", stem: "sulfid", charge: -2 },
  { symbol: "N", elementName: "Stickstoff", stem: "nitrid", charge: -3 },
];

const ROMAN_CHARGE = ["", "I", "II", "III", "IV"];

export function ionText(symbol: string, charge: number): string {
  return `${symbol}${ionChargeText(charge)}`;
}

export function saltRatio(cationCharge: number, anionCharge: number): [number, number] {
  const c = Math.abs(cationCharge);
  const a = Math.abs(anionCharge);
  const g = gcd(c, a);
  return [a / g, c / g];
}

export function saltFormula(cation: BinaryCation, anion: BinaryAnion): string {
  const [nc, na] = saltRatio(cation.charge, anion.charge);
  return `${cation.symbol}${sub(nc)}${anion.symbol}${sub(na)}`;
}

export function saltName(cation: BinaryCation, anion: BinaryAnion): string {
  return cation.variableCharge
    ? `${cation.name}(${ROMAN_CHARGE[cation.charge]})-${anion.stem}`
    : `${cation.name}${anion.stem}`;
}

// ─── LB 4: Chemische Reaktion, Energetik, Quantitätsgrößen, Alkane ─────────

export interface BalancedReaction {
  title: string;
  leftFormulas: [string, string];
  rightFormula: string;
  target: [number, number, number]; // [a, b, c] for a A + b B -> c C (or c A -> a B + b C)
  isDecomposition?: boolean;
  atoms: Array<{ symbol: string; counts: [number, number, number] }>;
}

export const EQUATION_REACTIONS: readonly BalancedReaction[] = [
  {
    title: "Synthese von Wasser",
    leftFormulas: ["H₂", "O₂"],
    rightFormula: "H₂O",
    target: [2, 1, 2],
    atoms: [
      { symbol: "H", counts: [2, 0, 2] },
      { symbol: "O", counts: [0, 2, 1] },
    ],
  },
  {
    title: "Synthese von Ammoniak",
    leftFormulas: ["N₂", "H₂"],
    rightFormula: "NH₃",
    target: [1, 3, 2],
    atoms: [
      { symbol: "N", counts: [2, 0, 1] },
      { symbol: "H", counts: [0, 2, 3] },
    ],
  },
  {
    title: "Verbrennung von Aluminium",
    leftFormulas: ["Al", "O₂"],
    rightFormula: "Al₂O₃",
    target: [4, 3, 2],
    atoms: [
      { symbol: "Al", counts: [1, 0, 2] },
      { symbol: "O", counts: [0, 2, 3] },
    ],
  },
  {
    title: "Thermolyse von Diiodpentoxid",
    leftFormulas: ["I₂", "O₂"],
    rightFormula: "I₂O₅",
    target: [2, 5, 2],
    isDecomposition: true,
    atoms: [
      { symbol: "I", counts: [2, 0, 2] },
      { symbol: "O", counts: [0, 2, 5] },
    ],
  },
];

/** Avogadro constant in 10^23 mol^-1 and unified atomic mass unit in 10^-24 g. */
export const AVOGADRO_E23 = 6.022;
export const U_IN_G_E24 = 1.66054;
export const VM_NORM = 22.4; // l/mol bei 0 °C, 1013 hPa

export interface ParticleSpecies {
  formula: string;
  name: string;
  massU: number; // in u (= Zahlenwert von M in g/mol)
  massE24g: number; // m(Teilchen) in 10^-24 g
  molarMass: number; // M in g/mol
}

export const PARTICLE_SPECIES: readonly ParticleSpecies[] = [
  { formula: "H", name: "Wasserstoffatom", massU: 1.0, massE24g: 1.66, molarMass: 1.0 },
  { formula: "H₂", name: "Wasserstoffmolekül", massU: 2.0, massE24g: 3.32, molarMass: 2.0 },
  { formula: "C", name: "Kohlenstoffatom", massU: 12.0, massE24g: 19.93, molarMass: 12.0 },
  { formula: "O₂", name: "Sauerstoffmolekül", massU: 32.0, massE24g: 53.14, molarMass: 32.0 },
  { formula: "H₂O", name: "Wassermolekül", massU: 18.0, massE24g: 29.89, molarMass: 18.0 },
  { formula: "CH₄", name: "Methanmolekül", massU: 16.0, massE24g: 26.57, molarMass: 16.0 },
  { formula: "NH₃", name: "Ammoniakmolekül", massU: 17.0, massE24g: 28.23, molarMass: 17.0 },
  { formula: "CO₂", name: "Kohlenstoffdioxidmolekül", massU: 44.0, massE24g: 73.06, molarMass: 44.0 },
  { formula: "SO₂", name: "Schwefeldioxidmolekül", massU: 64.1, massE24g: 106.44, molarMass: 64.1 },
];

/** M = m(Teilchen) · N_A with m(Teilchen) in 10^-24 g and N_A = 6,022 · 10^23 mol^-1 => factor 0,6022. */
export function molarMassFromParticleMassE24(massE24g: number): number {
  return round(massE24g * 0.6022, 1);
}

export interface StoichReaction {
  equation: string;
  eduktName: string;
  eduktFormula: string;
  eduktM: number;
  eduktNu: number;
  produktName: string;
  produktFormula: string;
  produktM: number;
  produktNu: number;
  produktIsGas: boolean;
}

export const STOICH_REACTIONS: readonly StoichReaction[] = [
  {
    equation: "2 H₂ + O₂ → 2 H₂O",
    eduktName: "Wasserstoff",
    eduktFormula: "H₂",
    eduktM: 2,
    eduktNu: 2,
    produktName: "Wasser",
    produktFormula: "H₂O",
    produktM: 18,
    produktNu: 2,
    produktIsGas: false,
  },
  {
    equation: "C + O₂ → CO₂",
    eduktName: "Kohlenstoff",
    eduktFormula: "C",
    eduktM: 12,
    eduktNu: 1,
    produktName: "Kohlenstoffdioxid",
    produktFormula: "CO₂",
    produktM: 44,
    produktNu: 1,
    produktIsGas: true,
  },
  {
    equation: "N₂ + 3 H₂ → 2 NH₃",
    eduktName: "Stickstoff",
    eduktFormula: "N₂",
    eduktM: 28,
    eduktNu: 1,
    produktName: "Ammoniak",
    produktFormula: "NH₃",
    produktM: 17,
    produktNu: 2,
    produktIsGas: true,
  },
  {
    equation: "CH₄ + 2 O₂ → CO₂ + 2 H₂O",
    eduktName: "Methan",
    eduktFormula: "CH₄",
    eduktM: 16,
    eduktNu: 1,
    produktName: "Kohlenstoffdioxid",
    produktFormula: "CO₂",
    produktM: 44,
    produktNu: 1,
    produktIsGas: true,
  },
];

export const ALKANE_NAMES = [
  "",
  "Methan",
  "Ethan",
  "Propan",
  "Butan",
  "Pentan",
  "Hexan",
  "Heptan",
  "Octan",
] as const;

export function alkaneFormula(n: number): string {
  return `C${sub(n)}H${sub(2 * n + 2)}`;
}

export function alkaneMolarMass(n: number): number {
  return 12 * n + (2 * n + 2) * 1;
}

export function alkaneCombustion(
  n: number,
  oxygenSupply: number, // 0 = stark gedrosselt, 1 = eingeschränkt, 2 = ausreichend O2
): {
  mode: string;
  flame: string;
  mainCarbonProduct: string;
  equation: string;
} {
  const alkane = alkaneFormula(n);
  if (oxygenSupply === 2) {
    // Vollständige Verbrennung: C_n H_{2n+2} + (3n+1)/2 O_2 -> n CO_2 + (n+1) H_2O
    const needDouble = (3 * n + 1) % 2 !== 0;
    const fAlk = needDouble ? "2 " : "";
    const fO2 = needDouble ? 3 * n + 1 : (3 * n + 1) / 2;
    const fCO2 = needDouble ? 2 * n : n;
    const fH2O = needDouble ? 2 * (n + 1) : n + 1;
    return {
      mode: "vollständige Verbrennung",
      flame: "blau, rauschend, rußfrei",
      mainCarbonProduct: "Kohlenstoffdioxid (CO₂)",
      equation: `${fAlk}${alkane} + ${fO2} O₂ → ${fCO2 === 1 ? "" : `${fCO2} `}CO₂ + ${fH2O} H₂O`,
    };
  }
  if (oxygenSupply === 1) {
    // Unvollständige Verbrennung zu Kohlenstoffmonoxid: C_n H_{2n+2} + (2n+1)/2 O_2 -> n CO + (n+1) H_2O
    const fO2 = 2 * n + 1;
    return {
      mode: "unvollständige Verbrennung (Sauerstoffmangel)",
      flame: "gelblich-bläulich, giftiges Abgas",
      mainCarbonProduct: "Kohlenstoffmonoxid (CO, Atemgift!)",
      equation: `2 ${alkane} + ${fO2} O₂ → ${2 * n} CO + ${2 * (n + 1)} H₂O`,
    };
  }
  // Stark gedrosselte Luftzufuhr: Rußbildung C_n H_{2n+2} + (n+1)/2 O_2 -> n C + (n+1) H_2O
  const needDouble = (n + 1) % 2 !== 0;
  const fAlk = needDouble ? "2 " : "";
  const fO2 = needDouble ? n + 1 : (n + 1) / 2;
  const fC = needDouble ? 2 * n : n;
  const fH2O = needDouble ? 2 * (n + 1) : n + 1;
  return {
    mode: "stark unvollständige Verbrennung (Rußbildung)",
    flame: "gelb leuchtend, stark rußend",
    mainCarbonProduct: "Ruß (C, Feinstaub)",
    equation: `${fAlk}${alkane} + ${fO2 === 1 ? "" : `${fO2} `}O₂ → ${fC === 1 ? "" : `${fC} `}C + ${fH2O} H₂O`,
  };
}

// ─── LB 5: Atombau, Energiestufen, PSE, Kugelwolkenmodell, Isotopie ────────

export interface PseElement {
  z: number;
  symbol: string;
  name: string;
  massNumber: number; // häufigstes Nuklid A
  period: number;
  hauptgruppe: number; // 1..8 (Helium = 8, hat aber 2 Außenelektronen!)
  shells: number[];
  kind: "Metall" | "Halbmetall" | "Nichtmetall" | "Edelgas";
  flameColor: string;
  ionCharge: number | null; // typische Edelgas-Ionenladung, null wenn keine einfache einatomige Ionenbildung
}

export const PSE_ELEMENTS: readonly PseElement[] = [
  { z: 1, symbol: "H", name: "Wasserstoff", massNumber: 1, period: 1, hauptgruppe: 1, shells: [1], kind: "Nichtmetall", flameColor: "keine charakteristische", ionCharge: 1 },
  { z: 2, symbol: "He", name: "Helium", massNumber: 4, period: 1, hauptgruppe: 8, shells: [2], kind: "Edelgas", flameColor: "keine charakteristische", ionCharge: 0 },
  { z: 3, symbol: "Li", name: "Lithium", massNumber: 7, period: 2, hauptgruppe: 1, shells: [2, 1], kind: "Metall", flameColor: "karminrot", ionCharge: 1 },
  { z: 4, symbol: "Be", name: "Beryllium", massNumber: 9, period: 2, hauptgruppe: 2, shells: [2, 2], kind: "Metall", flameColor: "keine charakteristische", ionCharge: 2 },
  { z: 5, symbol: "B", name: "Bor", massNumber: 11, period: 2, hauptgruppe: 3, shells: [2, 3], kind: "Halbmetall", flameColor: "grün", ionCharge: null },
  { z: 6, symbol: "C", name: "Kohlenstoff", massNumber: 12, period: 2, hauptgruppe: 4, shells: [2, 4], kind: "Nichtmetall", flameColor: "keine charakteristische", ionCharge: null },
  { z: 7, symbol: "N", name: "Stickstoff", massNumber: 14, period: 2, hauptgruppe: 5, shells: [2, 5], kind: "Nichtmetall", flameColor: "keine charakteristische", ionCharge: -3 },
  { z: 8, symbol: "O", name: "Sauerstoff", massNumber: 16, period: 2, hauptgruppe: 6, shells: [2, 6], kind: "Nichtmetall", flameColor: "keine charakteristische", ionCharge: -2 },
  { z: 9, symbol: "F", name: "Fluor", massNumber: 19, period: 2, hauptgruppe: 7, shells: [2, 7], kind: "Nichtmetall", flameColor: "keine charakteristische", ionCharge: -1 },
  { z: 10, symbol: "Ne", name: "Neon", massNumber: 20, period: 2, hauptgruppe: 8, shells: [2, 8], kind: "Edelgas", flameColor: "keine charakteristische", ionCharge: 0 },
  { z: 11, symbol: "Na", name: "Natrium", massNumber: 23, period: 3, hauptgruppe: 1, shells: [2, 8, 1], kind: "Metall", flameColor: "gelb-orange", ionCharge: 1 },
  { z: 12, symbol: "Mg", name: "Magnesium", massNumber: 24, period: 3, hauptgruppe: 2, shells: [2, 8, 2], kind: "Metall", flameColor: "weiß blendend (Verbrennung)", ionCharge: 2 },
  { z: 13, symbol: "Al", name: "Aluminium", massNumber: 27, period: 3, hauptgruppe: 3, shells: [2, 8, 3], kind: "Metall", flameColor: "keine charakteristische", ionCharge: 3 },
  { z: 14, symbol: "Si", name: "Silicium", massNumber: 28, period: 3, hauptgruppe: 4, shells: [2, 8, 4], kind: "Halbmetall", flameColor: "keine charakteristische", ionCharge: null },
  { z: 15, symbol: "P", name: "Phosphor", massNumber: 31, period: 3, hauptgruppe: 5, shells: [2, 8, 5], kind: "Nichtmetall", flameColor: "keine charakteristische", ionCharge: -3 },
  { z: 16, symbol: "S", name: "Schwefel", massNumber: 32, period: 3, hauptgruppe: 6, shells: [2, 8, 6], kind: "Nichtmetall", flameColor: "bläulich (Verbrennung)", ionCharge: -2 },
  { z: 17, symbol: "Cl", name: "Chlor", massNumber: 35, period: 3, hauptgruppe: 7, shells: [2, 8, 7], kind: "Nichtmetall", flameColor: "keine charakteristische", ionCharge: -1 },
  { z: 18, symbol: "Ar", name: "Argon", massNumber: 40, period: 3, hauptgruppe: 8, shells: [2, 8, 8], kind: "Edelgas", flameColor: "keine charakteristische", ionCharge: 0 },
  { z: 19, symbol: "K", name: "Kalium", massNumber: 39, period: 4, hauptgruppe: 1, shells: [2, 8, 8, 1], kind: "Metall", flameColor: "violett", ionCharge: 1 },
  { z: 20, symbol: "Ca", name: "Calcium", massNumber: 40, period: 4, hauptgruppe: 2, shells: [2, 8, 8, 2], kind: "Metall", flameColor: "ziegelrot", ionCharge: 2 },
];

export const ROMAN_GROUP = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"] as const;

export function valenceElectrons(el: PseElement): number {
  return el.shells[el.shells.length - 1];
}

/** Distribution of outer electrons on Kugelwolken for Z = 1..18. */
export function kugelwolkenConfig(z: number): {
  maxOuterClouds: number;
  pairs: number;
  singles: number;
  empty: number;
  bindigkeit: number;
} {
  const el = PSE_ELEMENTS.find((item) => item.z === z) ?? PSE_ELEMENTS[0];
  const v = valenceElectrons(el);
  if (el.period === 1) {
    const pairs = v === 2 ? 1 : 0;
    const singles = v === 1 ? 1 : 0;
    return { maxOuterClouds: 1, pairs, singles, empty: 0, bindigkeit: singles };
  }
  const pairs = v > 4 ? v - 4 : 0;
  const singles = v <= 4 ? v : 8 - v;
  const empty = Math.max(0, 4 - pairs - singles);
  return { maxOuterClouds: 4, pairs, singles, empty, bindigkeit: singles };
}

export interface IsotopePair {
  symbol: string;
  name: string;
  z: number;
  a1: number;
  a2: number;
  naturalPct1: number;
}

export const ISOTOPE_PAIRS: readonly IsotopePair[] = [
  { symbol: "Cl", name: "Chlor", z: 17, a1: 35, a2: 37, naturalPct1: 76 },
  { symbol: "Cu", name: "Kupfer", z: 29, a1: 63, a2: 65, naturalPct1: 69 },
  { symbol: "B", name: "Bor", z: 5, a1: 10, a2: 11, naturalPct1: 20 },
  { symbol: "Br", name: "Brom", z: 35, a1: 79, a2: 81, naturalPct1: 51 },
];

export function averageMolarMass(a1: number, a2: number, pct1: number): number {
  const p = Math.min(100, Math.max(0, pct1)) / 100;
  return round(p * a1 + (1 - p) * a2, 2);
}

export function fmtSigned(value: number, digits = 0, unit = ""): string {
  const text = fmt(value, digits);
  const prefixed = value > 0 ? `+${text}` : value < 0 ? text : "0";
  return unit ? `${prefixed} ${unit}` : prefixed;
}

export function fmtTemp(value: number, digits = 0): string {
  return `${fmt(value, digits).replace("-", MINUS)} °C`;
}
