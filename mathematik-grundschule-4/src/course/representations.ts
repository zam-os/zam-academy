import { format } from "../math/place-value";
import { random } from "../practice/tasks";
import { worksheet } from "./measurement";
import type { ForestTask } from "./tasks";

const ones = [
	"",
	"ein",
	"zwei",
	"drei",
	"vier",
	"fünf",
	"sechs",
	"sieben",
	"acht",
	"neun",
	"zehn",
	"elf",
	"zwölf",
	"dreizehn",
	"vierzehn",
	"fünfzehn",
	"sechzehn",
	"siebzehn",
	"achtzehn",
	"neunzehn",
];
const tens = [
	"",
	"",
	"zwanzig",
	"dreißig",
	"vierzig",
	"fünfzig",
	"sechzig",
	"siebzig",
	"achtzig",
	"neunzig",
];
function underThousand(n: number): string {
	const h = Math.floor(n / 100),
		rest = n % 100;
	return (
		(h ? `${ones[h]}hundert` : "") +
		(rest < 20
			? ones[rest]
			: `${rest % 10 ? `${ones[rest % 10]}und` : ""}${tens[Math.floor(rest / 10)]}`)
	);
}
export function numberWord(n: number): string {
	if (!Number.isInteger(n) || n < 0 || n > 1_000_000)
		throw new Error("Number-word range");
	if (n === 0) return "null";
	if (n === 1_000_000) return "eine Million";
	return `${n >= 1000 ? `${underThousand(Math.floor(n / 1000))}tausend` : ""}${underThousand(n % 1000)}${n % 100 === 1 ? "s" : ""}`;
}
export function representationTask(
	level: 1 | 2,
	seed: number,
	index: number,
): ForestTask {
	const next = random(
		(seed + Math.imul(index + 1, 2654435761) + level * 104729) >>> 0,
	);
	let thousands = 1 + Math.floor(next() * (level === 1 ? 98 : 800));
	// The explanation has already exposed 4 024.
	if (level === 1 && thousands === 4) thousands = 99;
	const n = thousands * 1000 + (level === 1 ? 20 : 200) + 4;
	const stages = ["E", "Z", "H", "T", "ZT", "HT"]
		.flatMap((label, i) =>
			Math.floor(n / 10 ** i) % 10
				? [`${Math.floor(n / 10 ** i) % 10}${label}`]
				: [],
		)
		.reverse()
		.join(" ");
	const hint =
		"Lies das Zahlwort in Tausendern, Hundertern, Zehnern und Einern. Unbesetzte Stellen brauchen eine 0 in der Ziffernschreibweise.";
	return worksheet(
		3,
		level === 1
			? "Übertrage das Zahlwort in Ziffern und prüfe die Stufenschrift."
			: "Vergleiche Zahlwort, Ziffern und Stufenschrift. Welche Darstellung beschreibt denselben Wert?",
		["number-word", n],
		"Eine Zahl in mehreren Darstellungen",
		["Darstellung", "Angabe"],
		[
			["Zahlwort", numberWord(n)],
			...(level === 1 ? [["Stufenschrift", stages]] : []),
		],
		[
			{ label: "Zahl in Ziffern", value: n, hint },
			{
				label: "Passende Stufenschrift",
				value: 1,
				hint,
				choices: [
					{ value: 1, label: stages },
					{ value: 2, label: stages.replace("4E", "4Z") },
					{ value: 3, label: `${thousands}H 4E` },
				],
			},
		],
		hint,
		`${numberWord(n)} = ${format(n)} = ${stages}. Jede Ziffer steht für ihren Stellenwert; eine leere Stelle verschiebt keine andere Ziffer.`,
	);
}
