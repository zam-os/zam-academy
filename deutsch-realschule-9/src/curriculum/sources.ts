import type { Stage } from "../model/types";

/** The four Lernbereiche of the Fachlehrplan Deutsch 9 and their look in the app. */
export const STAGES: Stage[] = [
  { lb: 1, title: "Sprechen und Zuhören", subtitle: "Zuhören, präsentieren, Gespräche führen und Szenen spielen", glyph: "🎙️" },
  { lb: 2, title: "Lesen und Medien", subtitle: "Texte erschließen, Literatur verstehen, Sachtexte und Medien beurteilen", glyph: "📖" },
  { lb: 3, title: "Schreiben", subtitle: "Bewerbungen, Zitate, Kommentare und Texte überarbeiten", glyph: "✍️" },
  { lb: 4, title: "Sprache untersuchen", subtitle: "Satzbau, Stilmittel, Sprachebenen und Rechtschreibung", glyph: "🔤" },
];

/** Where the content was read. Only sources that a lesson really used are listed on it. */
export const SOURCES: Array<{ id: string; label: string; url: string }> = [
  {
    id: "lp",
    label: "LehrplanPLUS Bayern: Fachlehrplan Deutsch, Realschule, Jahrgangsstufe 9",
    url: "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/deutsch",
  },
  {
    id: "regelwerk",
    label: "Amtliches Regelwerk der deutschen Rechtschreibung (Rat für deutsche Rechtschreibung)",
    url: "https://www.rechtschreibrat.com/regeln-und-woerterverzeichnis/",
  },
  { id: "dwds", label: "DWDS: Digitales Wörterbuch der deutschen Sprache", url: "https://www.dwds.de/" },
  { id: "duden", label: "Duden online: Nachschlagewerk zu Rechtschreibung und Grammatik", url: "https://www.duden.de/" },
  { id: "wikisource", label: "Wikisource: Volltexte gemeinfreier Werke", url: "https://de.wikisource.org/" },
  { id: "gutenberg", label: "Projekt Gutenberg: Volltexte gemeinfreier Werke", url: "https://projekt-gutenberg.org/" },
  { id: "klicksafe", label: "klicksafe: Sicher im Netz, Medienkompetenz", url: "https://www.klicksafe.de/" },
  { id: "bpb", label: "Bundeszentrale für politische Bildung", url: "https://www.bpb.de/" },
  { id: "jim", label: "JIM-Studie: Jugend, Information, Medien", url: "https://mpfs.de/studien/jim-studie/" },
  { id: "arbeitsagentur", label: "Bundesagentur für Arbeit: Bewerbung und Berufswahl", url: "https://www.arbeitsagentur.de/bildung" },
  { id: "unwort", label: "Unwort des Jahres: Sprachkritische Aktion", url: "https://www.unwortdesjahres.net/" },
];

export const EDITORIAL_DATE = "22. Oktober 2026";
