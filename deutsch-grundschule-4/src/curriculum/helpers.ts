// Compact notations for Werkstatt puzzles. Every helper returns plain data;
// tests check each puzzle through the engine, not through these strings.
import type { Part, SlotPuzzle, SlotWorkshop } from "../types";
import { solveGoal } from "../workshop/engine";

const PUNCTUATION = /^[.,:;!?„“"]+$/;

/**
 * Marking: tokens separated by spaces, `word|PEN` expects the pen, `_` joins
 * the words of one Satzglied. Pure punctuation stays fixed text.
 * Example: "Tinto|S schenkt|P seiner_Oma|DO einen_Kuchen|AO ."
 */
export function marks(
	id: string,
	source: string,
	label?: string,
	help?: string,
): SlotPuzzle {
	const parts: Part[] = source
		.trim()
		.split(/\s+/)
		.map((token) => {
			if (PUNCTUATION.test(token)) return token;
			const [word, pen = ""] = token.split("|");
			return { text: word.replace(/_/g, " "), answer: pen };
		});
	return { id, label, help, parts };
}

/**
 * Cutting a word: every gap between two letters is a slot. The source shows
 * the expected cuts with `cut` (default "-"): "Son-nen-schirm".
 */
export function cuts(
	id: string,
	source: string,
	cut = "-",
	label?: string,
	help?: string,
): SlotPuzzle {
	const letters = [...source.replaceAll(cut, "")];
	const parts: Part[] = [];
	let position = 0;
	const expected = new Set<number>();
	for (const piece of source.split(cut).slice(0, -1)) {
		position += [...piece].length;
		expected.add(position);
	}
	letters.forEach((letter, i) => {
		parts.push(letter);
		if (i < letters.length - 1)
			parts.push({ answer: expected.has(i + 1) ? cut : "" });
	});
	return { id, label, help, parts };
}

/**
 * Gaps with their own choices: "Mu{tt|t}er" – the first choice is right.
 * Options are shown in alphabetical order so their position gives nothing away.
 */
export function gaps(
	id: string,
	source: string,
	label?: string,
	help?: string,
): SlotPuzzle {
	const parts: Part[] = [];
	const pattern = /\{([^}]*)\}/g;
	let last = 0;
	for (const match of source.matchAll(pattern)) {
		const index = match.index ?? 0;
		if (index > last) parts.push(source.slice(last, index));
		const options = match[1].split("|");
		parts.push({
			answer: options[0],
			options: [...options].sort((a, b) => a.localeCompare(b, "de")),
		});
		last = index + match[0].length;
	}
	if (last < source.length) parts.push(source.slice(last));
	return { id, label, help, parts };
}

/**
 * Marks between words: "Tinto ruft {:} {„} Komm {} schnell her {!} {“}".
 * `{x}` expects the pen x, `{}` must stay empty.
 */
export function marksBetween(
	id: string,
	source: string,
	label?: string,
	help?: string,
): SlotPuzzle {
	const parts: Part[] = source
		.trim()
		.split(/\s+/)
		.map((token) => {
			const slot = token.match(/^\{(.*)\}$/);
			return slot ? { answer: slot[1] } : token;
		});
	return { id, label, help, parts };
}

/** A slot Werkstatt whose three goals are its first three puzzles. */
export function slotWorkshop(
	base: Omit<SlotWorkshop, "kind" | "goals">,
	labels: [string, string, string],
): SlotWorkshop {
	const ws = { kind: "slots", ...base } as SlotWorkshop;
	ws.goals = labels.map((label, i) =>
		solveGoal(() => ws, base.puzzles[i].id, label),
	) as SlotWorkshop["goals"];
	return ws;
}
