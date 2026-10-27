/** Dual numbers, ASCII and Morse code for the Informationsaustausch lessons. */

/** `toDual(13)` → "1101"; with `width` padded with leading zeros: `toDual(13, 8)` → "00001101". */
export function toDual(value: number, width = 0): string {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`not a natural number: ${value}`);
  return value.toString(2).padStart(width, "0");
}

export function fromDual(bits: string): number {
  if (!/^[01]+$/.test(bits)) throw new Error(`not a dual number: ${bits}`);
  return Number.parseInt(bits, 2);
}

/** Every accepted spelling of a dual number: without leading zeros, with 4 and with 8 digits. */
export function dualSpellings(value: number): string[] {
  const plain = toDual(value);
  return [...new Set([plain, toDual(value, 4), toDual(value, 8)].filter((s) => s.length >= plain.length))];
}

/** The ASCII code of an upper-case letter A–Z: A = 65 … Z = 90. */
export function asciiCode(letter: string): number {
  const code = letter.charCodeAt(0);
  if (letter.length !== 1 || code < 65 || code > 90) throw new Error(`not A–Z: ${letter}`);
  return code;
}

export const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

/** International Morse code, written with "·" (kurz) and "−" (lang). */
export const MORSE: Record<string, string> = {
  A: "·−", B: "−···", C: "−·−·", D: "−··", E: "·", F: "··−·", G: "−−·", H: "····", I: "··",
  J: "·−−−", K: "−·−", L: "·−··", M: "−−", N: "−·", O: "−−−", P: "·−−·", Q: "−−·−", R: "·−·",
  S: "···", T: "−", U: "··−", V: "···−", W: "·−−", X: "−··−", Y: "−·−−", Z: "−−··",
};

export function ones(bits: string): number {
  return [...bits].filter((bit) => bit === "1").length;
}
