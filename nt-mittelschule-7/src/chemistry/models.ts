/** Rounded volume shares of dry air. Variable water vapour is outside this model. */
export const AIR_GASES = [
	{ name: "Stickstoff", formula: "N₂", share: 78, color: "nitrogen" },
	{ name: "Sauerstoff", formula: "O₂", share: 21, color: "oxygen" },
	{ name: "Übrige Gase", formula: "vor allem Ar", share: 1, color: "argon" },
] as const;

export const MOLECULES = [
	{ name: "Stickstoff", formula: "N₂", atoms: ["N", "N"] },
	{ name: "Sauerstoff", formula: "O₂", atoms: ["O", "O"] },
	{ name: "Wasserdampf", formula: "H₂O", atoms: ["H", "O", "H"] },
	{ name: "Kohlenstoffdioxid", formula: "CO₂", atoms: ["O", "C", "O"] },
	{ name: "Schwefeldioxid", formula: "SO₂", atoms: ["O", "S", "O"] },
	{ name: "Helium", formula: "He", atoms: ["He"] },
	{ name: "Argon", formula: "Ar", atoms: ["Ar"] },
] as const;

export const ISOTOPES = [
	{ name: "Helium", symbol: "He", z: 2, a: 4 },
	{ name: "Kohlenstoff", symbol: "C", z: 6, a: 12 },
	{ name: "Kohlenstoff", symbol: "C", z: 6, a: 13 },
	{ name: "Sauerstoff", symbol: "O", z: 8, a: 16 },
	{ name: "Natrium", symbol: "Na", z: 11, a: 23 },
	{ name: "Aluminium", symbol: "Al", z: 13, a: 27 },
] as const;

export function neutralAtom(z: number, a: number) {
	return { protons: z, neutrons: a - z, electrons: z };
}

export const ELEMENTS = [
	["H", "Wasserstoff", 1, 1],
	["He", "Helium", 1, 18],
	["Li", "Lithium", 2, 1],
	["Be", "Beryllium", 2, 2],
	["B", "Bor", 2, 13],
	["C", "Kohlenstoff", 2, 14],
	["N", "Stickstoff", 2, 15],
	["O", "Sauerstoff", 2, 16],
	["F", "Fluor", 2, 17],
	["Ne", "Neon", 2, 18],
	["Na", "Natrium", 3, 1],
	["Mg", "Magnesium", 3, 2],
	["Al", "Aluminium", 3, 13],
	["Si", "Silicium", 3, 14],
	["P", "Phosphor", 3, 15],
	["S", "Schwefel", 3, 16],
	["Cl", "Chlor", 3, 17],
	["Ar", "Argon", 3, 18],
] as const;

export const ELEMENT_EXAMPLES = [
	{ z: 2, group: "Edelgas", use: "Helium ist leicht und füllt Ballons." },
	{
		z: 9,
		group: "Nichtmetall",
		use: "Fluor ist hochreaktiv. Zahnpasta kann Fluoride enthalten.",
	},
	{
		z: 10,
		group: "Edelgas",
		use: "Neon leuchtet in Gasentladungsröhren rotorange.",
	},
	{
		z: 11,
		group: "Metall",
		use: "Natriumdampf erzeugt in manchen Lampen gelbes Licht.",
	},
	{
		z: 13,
		group: "Metall",
		use: "Aluminium ist leicht und wird zum Beispiel für Fahrradrahmen verwendet.",
	},
	{
		z: 17,
		group: "Nichtmetall",
		use: "Chlor wird unter anderem zur Herstellung von Kunststoffen verwendet.",
	},
] as const;

/** Simplified energy-level model for the first 18 elements in the ground state. */
export function shells(z: number): number[] {
	return [
		Math.min(2, z),
		Math.min(8, Math.max(0, z - 2)),
		Math.max(0, z - 10),
	].filter(Boolean);
}

export function magnesiumEquation(mg: number, oxygen: number, oxide: number) {
	const left = { mg, o: 2 * oxygen };
	const right = { mg: oxide, o: oxide };
	return { left, right, balanced: left.mg === right.mg && left.o === right.o };
}

/** Illustrative standard-atmosphere values, not a weather forecast. */
export const ALTITUDES = [
	{ name: "Meereshöhe", height: 0, pressure: 1013 },
	{ name: "Hochplateau", height: 1500, pressure: 846 },
	{ name: "Berggipfel", height: 3000, pressure: 701 },
] as const;
