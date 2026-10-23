/**
 * The units of the Fachlehrplan Deutsch 9 (Realschule, one plan for all
 * Wahlpflichtfächergruppen) with the number of their Kompetenzerwartungen.
 * A lesson names the ones it teaches as "<unit>.<n>", counted in the order
 * of the Lehrplan: "4.2.4" is the fourth expectation of unit 4.2.
 * Read from the Internet-Archive copy of 13 February 2026.
 */
export const UNITS: Record<string, { lb: number; title: string; expectations: number }> = {
  "1.1": { lb: 1, title: "Verstehend zuhören", expectations: 4 },
  "1.2": { lb: 1, title: "Zu und vor anderen sprechen", expectations: 3 },
  "1.3": { lb: 1, title: "Mit anderen sprechen", expectations: 3 },
  "1.4": { lb: 1, title: "Szenisch spielen", expectations: 2 },
  "2.1": { lb: 2, title: "Lesetechniken und -strategien anwenden", expectations: 2 },
  "2.2": { lb: 2, title: "Literarische Texte verstehen und nutzen", expectations: 7 },
  "2.3": { lb: 2, title: "Pragmatische Texte verstehen und nutzen", expectations: 3 },
  "2.4": { lb: 2, title: "Weitere Medien verstehen und nutzen", expectations: 3 },
  "3.1": { lb: 3, title: "Über Schreibfertigkeiten und -fähigkeiten verfügen", expectations: 5 },
  "3.2": { lb: 3, title: "Texte planen und schreiben", expectations: 5 },
  "3.3": { lb: 3, title: "Texte überarbeiten", expectations: 3 },
  "4.1": { lb: 4, title: "Sprachliche Verständigung untersuchen und reflektieren", expectations: 4 },
  "4.2": { lb: 4, title: "Sprachliche Strukturen untersuchen und reflektieren", expectations: 4 },
  "4.3": { lb: 4, title: "Richtig schreiben", expectations: 3 },
};

/** Every Kompetenzerwartung code of the plan, for example "2.2.7". */
export const ALL_EXPECTATIONS: string[] = Object.entries(UNITS).flatMap(([unit, u]) =>
  Array.from({ length: u.expectations }, (_, i) => `${unit}.${i + 1}`),
);
