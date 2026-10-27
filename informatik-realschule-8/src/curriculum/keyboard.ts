/**
 * The German QWERTZ letter keys and the finger that types each of them in
 * the Zehnfingersystem. Grundstellung: A S D F (links) and J K L Ö (rechts),
 * the thumbs rest on the space bar.
 */
export const FINGERS = [
  "linker kleiner Finger",
  "linker Ringfinger",
  "linker Mittelfinger",
  "linker Zeigefinger",
  "rechter Zeigefinger",
  "rechter Mittelfinger",
  "rechter Ringfinger",
  "rechter kleiner Finger",
] as const;

export type Row = "oben" | "grund" | "unten";

export interface KeyInfo {
  key: string;
  row: Row;
  /** Index into FINGERS. */
  finger: number;
}

export const KEY_ROWS: Record<Row, string[]> = {
  oben: ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P", "Ü"],
  grund: ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä"],
  unten: ["Y", "X", "C", "V", "B", "N", "M"],
};

/** Column → finger for the eleven columns of the upper two rows (and the first seven of the lower). */
const COLUMN_FINGER = [0, 1, 2, 3, 3, 4, 4, 5, 6, 7, 7];

export const KEYS: KeyInfo[] = (Object.keys(KEY_ROWS) as Row[]).flatMap((row) =>
  KEY_ROWS[row].map((key, column) => ({ key, row, finger: COLUMN_FINGER[column] })),
);

export const HOME_KEYS = ["A", "S", "D", "F", "J", "K", "L", "Ö"];

export function fingerOf(letter: string): number {
  const found = KEYS.find((entry) => entry.key === letter.toUpperCase());
  if (!found) throw new Error(`no key for ${letter}`);
  return found.finger;
}

export function isLeftHand(letter: string): boolean {
  return fingerOf(letter) <= 3;
}

/** Letters of a lower-case word typed by the left hand. */
export function leftHandStrokes(word: string): number {
  return [...word].filter((letter) => isLeftHand(letter)).length;
}
