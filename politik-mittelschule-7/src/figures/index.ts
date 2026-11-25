/**
 * Every drawing a lesson can show, by id. A lesson lists its ids in
 * `figures`; the tests check that each id exists and renders an accessible
 * SVG. Drawings are schematic on purpose and say so in their captions.
 */
import { esc } from "../workshop";
import {
  alliances,
  debate,
  districts,
  dominoes,
  factoryHall,
  fivePillars,
  helpers,
  jobs,
  modelTown,
  sectors,
  shields,
  strike,
  tenement,
  versaillesMap,
  voices,
} from "./scenes";

export interface FigureDef {
  title: string;
  caption: string;
  draw: () => string;
}

export const FIGURES: Record<string, FigureDef> = {
  fabrikhalle: {
    title: "Eine Fabrikhalle um 1880",
    caption:
      "Schematische Zeichnung, keine bestimmte Fabrik: Eine Dampfmaschine treibt über Welle und Treibriemen alle Maschinen an.",
    draw: factoryHall,
  },
  mietskaserne: {
    title: "Querschnitt durch eine Mietskaserne",
    caption:
      "Vereinfachte Zeichnung nach Berliner Mietshäusern: Vorderhaus, enger Hof und Hinterhaus. Seitenflügel und weitere Höfe sind weggelassen.",
    draw: tenement,
  },
  streik: {
    title: "Arbeiter schließen sich zusammen",
    caption:
      "Gezeichnete Szene eines Streiks vor dem Fabriktor. Oben die drei Formen des Zusammenschlusses.",
    draw: strike,
  },
  helfer: {
    title: "Drei Antworten auf die Soziale Frage",
    caption:
      "Vereinfachte Übersicht: Kirchen, Unternehmer und die Arbeiter selbst versuchten, die Not zu lindern.",
    draw: helpers,
  },
  schutzschilde: {
    title: "Bismarcks drei Versicherungen",
    caption:
      "Wer die Beiträge zahlte, nach der Darstellung im Lebendigen Museum Online (LeMO). Der Staat gab je Rente einen jährlichen Grundbetrag von 50 Mark dazu.",
    draw: shields,
  },
  "fuenf-saeulen": {
    title: "Fünf Säulen der Sozialversicherung",
    caption:
      "Vereinfachtes Bild: Beamte und viele Selbstständige sichern sich auf anderen Wegen ab.",
    draw: fivePillars,
  },
  sektoren: {
    title: "Von der Agrar- zur Industriegesellschaft",
    caption:
      "Anteile aller Beschäftigten, gerundet nach LeMO. Der Rest (übrige Bereiche) ist aus den beiden Angaben berechnet und nicht beschriftet.",
    draw: sectors,
  },
  modellstadt: {
    title: "Modellstadt mit Zeitregler",
    caption:
      "Erfundene Modellstadt, kein echter Ort. Die Jahreszahlen zeigen eine typische Abfolge, die in jeder Stadt etwas anders verlief.",
    draw: modelTown,
  },
  stadtviertel: {
    title: "Viertel einer Industriestadt",
    caption:
      "Schematischer Plan einer erfundenen Stadt. In Berlin lagen Arbeiterviertel vor allem im Osten und Norden, Villenviertel etwa in Grunewald und Dahlem.",
    draw: districts,
  },
  berufe: {
    title: "Neue Berufe um 1900",
    caption: "Sechs Beispiele, gezeichnet als Bildkarten. Es gab viele weitere neue Berufe.",
    draw: jobs,
  },
  buendnisse: {
    title: "Zwei Blöcke vor 1914",
    caption:
      "Vereinfachtes Schema, keine Landkarte: Die Kästen stehen nur ungefähr in der Himmelsrichtung der Länder.",
    draw: alliances,
  },
  julikrise: {
    title: "Wie Dominosteine",
    caption:
      "Vereinfachtes Bild: Die Staaten fielen nicht zwangsläufig, jede Regierung traf eigene Entscheidungen.",
    draw: dominoes,
  },
  debatte: {
    title: "Hundert Jahre Streit um die Kriegsschuld",
    caption:
      "Vereinfachte Zusammenfassungen der Positionen nach dem Beitrag von Annika Mombauer (bpb), keine Zitate.",
    draw: debate,
  },
  "versailles-karte": {
    title: "Gebietsverluste nach dem Versailler Vertrag",
    caption:
      "Schema, keine maßstabsgetreue Karte: Die Kästen stehen nur ungefähr in der Himmelsrichtung der Gebiete.",
    draw: versaillesMap,
  },
  stimmen: {
    title: "Stimmen aus dem Jahr 1919",
    caption: "Erfundene Personen, gebildet nach den Bestimmungen des Vertrags. Die Sprechblasen sind keine Zitate.",
    draw: voices,
  },
};

export function renderFigure(id: string): string {
  const figure = FIGURES[id];
  if (!figure) return "";
  return `<figure class="lesson-figure" data-figure="${esc(id)}"${id === "modellstadt" ? ' data-town="1850"' : ""}>${figure.draw()}<figcaption><strong>${esc(figure.title)}${figure.title.endsWith(".") ? "" : "."}</strong> ${esc(figure.caption)}</figcaption></figure>`;
}
