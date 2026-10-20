/** Small, explicit school models; no inference from formula strings or EN cut-offs. */
export interface Element {
  symbol: string;
  name: string;
  z: number;
  massNumber: number;
  group: number;
}

export const ELEMENTS: Element[] = [
  ["H", "Wasserstoff", 1, 1, 1],
  ["He", "Helium", 2, 4, 8],
  ["Li", "Lithium", 3, 7, 1],
  ["Be", "Beryllium", 4, 9, 2],
  ["B", "Bor", 5, 11, 3],
  ["C", "Kohlenstoff", 6, 12, 4],
  ["N", "Stickstoff", 7, 14, 5],
  ["O", "Sauerstoff", 8, 16, 6],
  ["F", "Fluor", 9, 19, 7],
  ["Ne", "Neon", 10, 20, 8],
  ["Na", "Natrium", 11, 23, 1],
  ["Mg", "Magnesium", 12, 24, 2],
  ["Al", "Aluminium", 13, 27, 3],
  ["Si", "Silicium", 14, 28, 4],
  ["P", "Phosphor", 15, 31, 5],
  ["S", "Schwefel", 16, 32, 6],
  ["Cl", "Chlor", 17, 35, 7],
  ["Ar", "Argon", 18, 40, 8],
  ["K", "Kalium", 19, 39, 1],
  ["Ca", "Calcium", 20, 40, 2],
].map(([symbol, name, z, massNumber, group]) => ({
  symbol: String(symbol),
  name: String(name),
  z: Number(z),
  massNumber: Number(massNumber),
  group: Number(group),
}));

export function element(z: number): Element {
  return ELEMENTS.find((entry) => entry.z === z) ?? ELEMENTS[0];
}

/** Ground-state occupancies for the first twenty neutral atoms, not a filling rule for all atoms. */
export function shells(z: number): number[] {
  const result: number[] = [];
  let left = Math.max(0, Math.min(20, Math.trunc(z)));
  for (const capacity of [2, 8, 8, 2]) {
    if (!left) break;
    const count = Math.min(left, capacity);
    result.push(count);
    left -= count;
  }
  return result;
}

export function clouds(valence: number): number[] {
  return Array.from(
    { length: 4 },
    (_, index) => Number(valence > index) + Number(valence > index + 4),
  );
}

export function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

export function saltRatio(cationCharge: number, anionCharge: number): [number, number] {
  const common = gcd(cationCharge, anionCharge);
  return [anionCharge / common, cationCharge / common];
}

export function reaction(hydrogen: number, oxygen: number) {
  const runs = Math.min(Math.floor(hydrogen / 2), oxygen);
  return { water: 2 * runs, hydrogen: hydrogen - 2 * runs, oxygen: oxygen - runs };
}

export const MOLECULES = [
  { formula: "H₂", center: "H", bonds: 1, lone: 0, domains: 1, shape: "linear", angle: 180 },
  { formula: "O₂", center: "O", bonds: 2, lone: 2, domains: 1, shape: "linear", angle: 180 },
  { formula: "N₂", center: "N", bonds: 3, lone: 1, domains: 1, shape: "linear", angle: 180 },
  { formula: "H₂O", center: "O", bonds: 2, lone: 2, domains: 2, shape: "gewinkelt", angle: 104.5 },
  { formula: "NH₃", center: "N", bonds: 3, lone: 1, domains: 3, shape: "pyramidal", angle: 107 },
  {
    formula: "CH₄",
    center: "C",
    bonds: 4,
    lone: 0,
    domains: 4,
    shape: "tetraedrisch",
    angle: 109.5,
  },
  { formula: "CO₂", center: "C", bonds: 4, lone: 0, domains: 2, shape: "linear", angle: 180 },
] as const;

export const SHAPES = ["linear", "gewinkelt", "pyramidal", "tetraedrisch"];

export const SUBSCRIPT = (value: number): string =>
  String(value).replace(/\d/g, (n) => "₀₁₂₃₄₅₆₇₈₉"[Number(n)]);

export function hydrocarbon(
  carbons: number,
  bond: number,
): { formula: string; name: string; h: number } {
  const roots = ["", "Meth", "Eth", "Prop", "But", "Pent", "Hex"];
  const h = 2 * carbons + (bond === 1 ? 2 : bond === 2 ? 0 : -2);
  return {
    formula: `C${carbons === 1 ? "" : SUBSCRIPT(carbons)}H${SUBSCRIPT(h)}`,
    name: `${roots[carbons]}${bond === 1 ? "an" : bond === 2 ? "en" : "in"}`,
    h,
  };
}
