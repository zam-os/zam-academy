import type { Stage } from "../model/types";

/**
 * The seven stages of the learning path. They follow the Fachlehrplan Französisch 9: Lernbereich 1.1
 * (Fertigkeiten), the three sections of Lernbereich 1.2 (Grammatik, Wortschatz und Aussprache),
 * Lernbereiche 2 to 4 and the Themengebiete of Lernbereich 5. Each has its own colour in the app.
 */
export const STAGES: Stage[] = [
  { lb: 1, title: "Verstehen und sich mitteilen", subtitle: "Lesen, Hören, Sprechen, Schreiben und Sprachmittlung", glyph: "💬" },
  { lb: 2, title: "Grammatik", subtitle: "Relativsatz, Steigerung, Pronomen, Vergangenheit, Zukunft und Bedingung", glyph: "🧩" },
  { lb: 3, title: "Wortschatz und Aussprache", subtitle: "Wendungen, Konnektoren, Wortbildung und Laut-Schrift-Zusammenhänge", glyph: "🔤" },
  { lb: 4, title: "Frankreich erleben", subtitle: "Reisen, Paris, Schule, Ausbildung und Gespräche über Praktikum und Austausch", glyph: "🗼" },
  { lb: 5, title: "Texte und Medien", subtitle: "Bilder und Bandes dessinées, Rollenspiel und kreatives Schreiben", glyph: "📰" },
  { lb: 6, title: "Lernen lernen", subtitle: "Vokabeln, Sprachvergleich, Hilfsmittel und Fehleranalyse", glyph: "🧠" },
  { lb: 7, title: "Themengebiete", subtitle: "Freundschaft, Medien, Nachbarländer und aktuelle Themen", glyph: "🎯" },
];

/** Where the content was read. Only sources that a lesson really used are listed on it. */
export const SOURCES: Array<{ id: string; label: string; url: string }> = [
  {
    id: "lp",
    label: "LehrplanPLUS Bayern: Fachlehrplan Französisch, Realschule, Jahrgangsstufe 9",
    url: "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/franzoesisch",
  },
  { id: "larousse", label: "Larousse: Dictionnaires de français, Grammaire et conjugaison", url: "https://www.larousse.fr/dictionnaires/francais" },
  { id: "cnrtl", label: "CNRTL: Centre national de ressources textuelles et lexicales", url: "https://www.cnrtl.fr/" },
  { id: "lingolia", label: "Lingolia: Französische Grammatik mit deutschen Erklärungen", url: "https://francais.lingolia.com/de" },
  { id: "lepointdufle", label: "Le Point du FLE: Ressources pour apprendre le français", url: "https://www.lepointdufle.net/" },
  { id: "dfjw", label: "Deutsch-Französisches Jugendwerk (DFJW/OFAJ): Austausch, Praktikum und Sprache", url: "https://www.dfjw.org/" },
  { id: "onisep", label: "Onisep: Orientation, formations et métiers en France", url: "https://www.onisep.fr/" },
  { id: "belgium", label: "belgium.be: Offizielles Portal Belgiens", url: "https://www.belgium.be/fr" },
  { id: "francefr", label: "France.fr: Offizielle Tourismusseite Frankreichs", url: "https://www.france.fr/fr" },
];

export const EDITORIAL_DATE = "24. Oktober 2026";
