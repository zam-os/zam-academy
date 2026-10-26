import type { Stage } from "../model/types";

/**
 * The seven stages of the learning path. They follow the Fachlehrplan Französisch 10: Lernbereich 1.1
 * (Fertigkeiten), the three sections of Lernbereich 1.2 (Grammatik, Wortschatz und Aussprache),
 * Lernbereiche 2 to 4 and the Themengebiete of Lernbereich 5. Each has its own colour in the app.
 */
export const STAGES: Stage[] = [
  { lb: 1, title: "Verstehen und sich mitteilen", subtitle: "Hören, Lesen, Sprechen, Schreiben und Sprachmittlung", glyph: "💬" },
  { lb: 2, title: "Grammatik", subtitle: "Verneinung, ce qui und ce que, Adverbien, conditionnel, irreale Bedingung und Wiederholung", glyph: "🧩" },
  { lb: 3, title: "Wortschatz und Aussprache", subtitle: "Beruf und Engagement, Wendungen mit Subjonctif, Passiversatz, Konnektoren und Wortbildung", glyph: "🔤" },
  { lb: 4, title: "Frankreich und Europa", subtitle: "Zeitgeschehen, deutsch-französische Freundschaft, Persönlichkeiten und Meinungsvielfalt", glyph: "🤝" },
  { lb: 5, title: "Texte und Medien", subtitle: "Textfragen, Zusammenfassung, Rollenspiel, Chat, formelle Briefe und Argumentation", glyph: "📰" },
  { lb: 6, title: "Lernen lernen", subtitle: "Vokabelnetze, Sprachvergleich, Strategien, Prüfungsvorbereitung, Quellen und Fehlerprotokoll", glyph: "🧠" },
  { lb: 7, title: "Themengebiete", subtitle: "Engagement, Stars, Errungenschaften, Berufswelt, Frankophonie und aktuelle Themen", glyph: "🎯" },
];

/** Where the content was read. Only sources that a lesson really used are listed on it. */
export const SOURCES: Array<{ id: string; label: string; url: string }> = [
  {
    id: "lp",
    label: "LehrplanPLUS Bayern: Fachlehrplan Französisch, Realschule, Jahrgangsstufe 10",
    url: "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/franzoesisch",
  },
  {
    id: "lp9",
    label: "LehrplanPLUS Bayern: Fachlehrplan Französisch, Realschule, Jahrgangsstufe 9 (Vorwissen)",
    url: "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/franzoesisch",
  },
  { id: "larousse", label: "Larousse: Dictionnaires de français, Grammaire et conjugaison", url: "https://www.larousse.fr/dictionnaires/francais" },
  { id: "lingolia", label: "Lingolia: Französische Grammatik mit deutschen Erklärungen", url: "https://francais.lingolia.com/de" },
  { id: "lepointdufle", label: "Le Point du FLE: Ressources pour apprendre le français", url: "https://www.lepointdufle.net/" },
  { id: "dfjw", label: "Deutsch-Französisches Jugendwerk (DFJW/OFAJ): Austausch, Praktikum und Sprache", url: "https://www.dfjw.org/" },
  { id: "elysee", label: "Auswärtiges Amt: Deutschland und Frankreich, Élysée-Vertrag und Aachener Vertrag", url: "https://www.auswaertiges-amt.de/de/service/laender/frankreich-node/bilateral-209530" },
  { id: "oif", label: "Organisation internationale de la Francophonie (OIF)", url: "https://www.francophonie.org/" },
  { id: "onisep", label: "Onisep: Orientation, formations et métiers en France", url: "https://www.onisep.fr/" },
  { id: "servicecivique", label: "Service Civique: Engagement für junge Menschen in Frankreich", url: "https://www.service-civique.gouv.fr/" },
];

export const EDITORIAL_DATE = "26. Oktober 2026";
