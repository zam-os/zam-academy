// Pure helpers behind the visible effects of the Werkstätten: what changed
// in a machine's sentence, how a word is cut right now, and the capital
// letter Tinto's typewriter strikes.

/** The word with its first letter in upper case (also ä, ö, ü). */
export function capitalFirst(word: string): string {
	const [first = "", ...rest] = [...word];
	return first.toLocaleUpperCase("de-DE") + rest.join("");
}

/**
 * Which words of `after` are new or changed compared with `before`: the
 * words outside their longest common subsequence. Without a `before`
 * nothing counts as changed.
 */
export function changedWords(before: string | undefined, after: string): boolean[] {
	const next = after.split(" ");
	if (before === undefined || before === after) return next.map(() => false);
	const prev = before.split(" ");
	// lcs[i][j]: length of the common subsequence of prev[i..] and next[j..].
	const lcs = Array.from({ length: prev.length + 1 }, () => new Array<number>(next.length + 1).fill(0));
	for (let i = prev.length - 1; i >= 0; i -= 1)
		for (let j = next.length - 1; j >= 0; j -= 1)
			lcs[i][j] = prev[i] === next[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
	const changed = next.map(() => true);
	let i = 0;
	let j = 0;
	while (i < prev.length && j < next.length) {
		if (prev[i] === next[j]) {
			changed[j] = false;
			i += 1;
			j += 1;
		} else if (lcs[i + 1][j] >= lcs[i][j + 1]) i += 1;
		else j += 1;
	}
	return changed;
}

/**
 * The pieces of a cut word as the child cut it: `letters` are the letters,
 * `cuts[k]` tells whether the gap after letter k is cut.
 */
export function cutPieces(letters: string[], cuts: boolean[]): string[] {
	const pieces: string[] = [];
	let piece = "";
	letters.forEach((letter, k) => {
		piece += letter;
		if (cuts[k]) {
			pieces.push(piece);
			piece = "";
		}
	});
	if (piece) pieces.push(piece);
	return pieces;
}
