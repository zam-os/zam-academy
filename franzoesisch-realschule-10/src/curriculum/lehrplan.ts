/**
 * The units of the Fachlehrplan Französisch 10 (Realschule, Wahlpflichtfächergruppe IIIa,
 * fourth year of the second foreign language) with the number of their Kompetenzerwartungen.
 * A lesson names the ones it teaches as "<unit>.<n>", counted in the order of the Lehrplan:
 * "1.2.2.2" is the second expectation of the Grammatik section of Lernbereich 1.2.
 *
 * Lernbereich 1.1 counts its five sections in one row: Hör- und Hörsehverstehen (1), Leseverstehen (2),
 * Sprechen (3 to 6), Schreiben (7 to 11) and Sprachmittlung (12 to 14). The plan's Lernbereich 1.2 has
 * three sections of its own (Wortschatz, Grammatik, Aussprache und Intonation), so these are three units.
 * `lb` is the stage of the learning path the unit belongs to; the path orders Lernbereich 1.2 as
 * Grammatik first, then Wortschatz und Aussprache. `plan` is the plan's own number, `title` its heading.
 * Read on 26 October 2026 from lehrplanplus.bayern.de.
 */
export const UNITS: Record<string, { lb: number; plan: string; title: string; expectations: number }> = {
  "1.1": { lb: 1, plan: "1.1", title: "Kommunikative Fertigkeiten", expectations: 14 },
  "1.2.2": { lb: 2, plan: "1.2", title: "Sprachliche Mittel: Grammatik", expectations: 4 },
  "1.2.1": { lb: 3, plan: "1.2", title: "Sprachliche Mittel: Wortschatz", expectations: 10 },
  "1.2.3": { lb: 3, plan: "1.2", title: "Sprachliche Mittel: Aussprache und Intonation", expectations: 2 },
  "2": { lb: 4, plan: "2", title: "Interkulturelle Kompetenzen", expectations: 4 },
  "3": { lb: 5, plan: "3", title: "Text- und Medienkompetenzen", expectations: 7 },
  "4": { lb: 6, plan: "4", title: "Methodische Kompetenzen", expectations: 6 },
  "5": { lb: 7, plan: "5", title: "Themengebiete", expectations: 2 },
};

/**
 * The units in the order of the learning path. An array, because the keys "2" to "5" are integer-like and
 * object keys of that kind always come first.
 */
export const UNIT_ORDER = ["1.1", "1.2.2", "1.2.1", "1.2.3", "2", "3", "4", "5"] as const;

/** Every Kompetenzerwartung code of the plan, in path order, for example "1.2.2.4". */
export const ALL_EXPECTATIONS: string[] = UNIT_ORDER.flatMap((unit) =>
  Array.from({ length: UNITS[unit].expectations }, (_, i) => `${unit}.${i + 1}`),
);
