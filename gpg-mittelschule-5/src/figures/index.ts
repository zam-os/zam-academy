/**
 * Every drawing and map a lesson can show, by id. A lesson lists its ids in
 * `figures`; the tests check that each id exists and renders an accessible
 * SVG. Drawings are simplified on purpose and say so in their captions.
 */
import { esc } from "../workshop";
import {
  bavaria,
  climateZones,
  egypt,
  germany,
  limes,
  romanEmpire,
  worldContinents,
} from "./maps";
import {
  alpsAndCoast,
  earthFormation,
  energyHome,
  everydayEnvironment,
  globeAndMap,
  landscapeProfile,
  readingMaps,
  solarSystem,
} from "./scenes-lb1";
import {
  huntersToFarmers,
  limesStructure,
  newStoneAge,
  nileAchievements,
  nileToday,
  nileYear,
  oldStoneAge,
  romanTraces,
  timeline,
} from "./scenes-lb2";
import {
  assembly,
  classCouncil,
  classElection,
  classRules,
  conflictStairs,
  democracyThenNow,
  egyptWork,
  familyChange,
  familyForms,
  greekLegacy,
  iMessage,
  inclusion,
  societyPyramid,
} from "./scenes-lb34";

export interface FigureDef {
  title: string;
  caption: string;
  draw: () => string;
}

export const FIGURES: Record<string, FigureDef> = {
  sonnensystem: {
    title: "Unser Sonnensystem",
    caption:
      "Acht Planeten kreisen um die Sonne. Größen und Abstände sind nicht maßstabsgetreu: In Wirklichkeit liegen die äußeren Planeten viel weiter draußen.",
    draw: solarSystem,
  },
  "erde-entstehung": {
    title: "Wie die Erde entstand",
    caption:
      "Vereinfachte Abfolge über viele Hundert Millionen Jahre. Zwischen den Bildern liegen sehr lange Zeiträume.",
    draw: earthFormation,
  },
  kontinente: {
    title: "Kontinente und Ozeane",
    caption:
      "Weltkarte nach Natural Earth. Auf dieser Karte wirken die Gebiete nahe den Polen, besonders die Antarktis, viel größer, als sie sind.",
    draw: worldContinents,
  },
  "globus-karte": {
    title: "Globus, Karte und Himmelsrichtungen",
    caption:
      "Der Globus zeigt die Erde unverzerrt, die Karte macht sie flach und handlich. Die Windrose hilft dir, dich zu orientieren.",
    draw: globeAndMap,
  },
  klimazonen: {
    title: "Die Klimazonen der Erde",
    caption:
      "Vereinfacht nach Breitenkreisen: Echte Klimazonen verlaufen unregelmäßiger, weil Meere, Gebirge und Winde mitwirken.",
    draw: climateZones,
  },
  "karte-lesen": {
    title: "Eine Karte lesen: Lindenau",
    caption:
      "Erfundenes Dorf zum Üben. Die Legende erklärt die Zeichen, das Gitter aus Buchstaben und Zahlen bildet Planquadrate.",
    draw: readingMaps,
  },
  deutschland: {
    title: "Deutschland und seine Bundesländer",
    caption:
      "Bayern ist gelb hervorgehoben. Kartengrundlage: Natural Earth (gemeinfrei).",
    draw: germany,
  },
  "landschaften-profil": {
    title: "Von der Küste zu den Alpen",
    caption:
      "Querschnitt von Norden nach Süden, Höhen stark überhöht. Die Grenzen zwischen den Großlandschaften sind fließend.",
    draw: landscapeProfile,
  },
  bayern: {
    title: "Bayern",
    caption:
      "Die Zahlen markieren sechs große Städte. Die Flüsse helfen dir, sie zu finden. Der Lech ist vereinfacht eingezeichnet. Kartengrundlage: Natural Earth (gemeinfrei).",
    draw: bavaria,
  },
  "alpen-kueste": {
    title: "Alpen und Küste",
    caption:
      "Zwei vereinfachte Landschaftsbilder: Alpen in Bayern und Nordseeküste.",
    draw: alpsAndCoast,
  },
  energie: {
    title: "Wo Energie verloren geht",
    caption: "Vier typische Stellen in einer Wohnung und was hilft.",
    draw: energyHome,
  },
  "umwelt-alltag": {
    title: "Kurze Wege und richtig trennen",
    caption:
      "Die Entfernung nach Neuseeland ist gerundet. Welche Tonne für was gilt, legt jede Gemeinde selbst fest.",
    draw: everydayEnvironment,
  },
  zeitleiste: {
    title: "Zeitleiste von der Steinzeit bis zu den Römern",
    caption:
      "Die Jahreszahlen sind gerundet. Die Altsteinzeit begann vor etwa 2,5 Millionen Jahren und passt deshalb nicht auf die Leiste.",
    draw: timeline,
  },
  altsteinzeit: {
    title: "Altsteinzeit",
    caption:
      "Gezeichnete Szene nach archäologischen Funden: Jäger und Sammler in der Eiszeit.",
    draw: oldStoneAge,
  },
  jungsteinzeit: {
    title: "Jungsteinzeit",
    caption:
      "Gezeichnete Szene nach archäologischen Funden: ein Dorf mit Langhaus, Feld und Haustieren.",
    draw: newStoneAge,
  },
  "jaeger-bauern": {
    title: "Vom Jäger und Sammler zum Bauern",
    caption:
      "Der Wandel dauerte viele Generationen und verlief nicht überall gleichzeitig.",
    draw: huntersToFarmers,
  },
  "nil-karte": {
    title: "Ägypten und der Nil",
    caption:
      "Der grüne Streifen zeigt das fruchtbare Land am Fluss, vereinfacht. Kartengrundlage: Natural Earth (gemeinfrei).",
    draw: egypt,
  },
  "nil-jahr": {
    title: "Das Jahr am Nil",
    caption:
      "Die drei Jahreszeiten richteten sich nach der Nilflut, nicht nach Sommer und Winter wie bei uns.",
    draw: nileYear,
  },
  "nil-leistungen": {
    title: "Was die Ägypter dem Nil verdanken",
    caption: "Fünf Leistungen, die mit dem Fluss zusammenhängen.",
    draw: nileAchievements,
  },
  "nil-heute": {
    title: "Der Nil früher und heute",
    caption:
      "Schema, nicht maßstabsgetreu. Der Assuan-Hochdamm wurde 1971 fertiggestellt.",
    draw: nileToday,
  },
  "rom-karte": {
    title: "Das Römische Reich um 117 n. Chr.",
    caption:
      "Vereinfachte Skizze der größten Ausdehnung; abhängige Königreiche am Rand sind nicht eingezeichnet. Kartengrundlage: Natural Earth (gemeinfrei).",
    draw: romanEmpire,
  },
  "limes-karte": {
    title: "Der Limes in Süddeutschland",
    caption:
      "Verlauf vereinfacht. Zwischen Rhein und Donau sicherte der Limes die Grenze, sonst bildeten die Flüsse die Grenze.",
    draw: limes,
  },
  "limes-aufbau": {
    title: "So war der Limes gebaut",
    caption:
      "Schema nach Funden, Obergermanien. Graben und Wall kamen später hinzu oder ersetzten die Palisade; nicht an jeder Stelle gab es alle Teile.",
    draw: limesStructure,
  },
  "roemer-spuren": {
    title: "Römische Spuren heute",
    caption: "Überreste in Bayern und Wörter, die aus dem Lateinischen kommen.",
    draw: romanTraces,
  },
  "aegypten-alltag": {
    title: "Arbeiten im alten Ägypten",
    caption: "Gezeichnet nach Darstellungen in Gräbern; stark vereinfacht.",
    draw: egyptWork,
  },
  pyramide: {
    title: "Die Gesellschaftspyramide",
    caption:
      "Ein Modell: Die Breite zeigt, wie viele Menschen zu einer Gruppe gehörten, die Höhe, wie viel Macht sie hatten. Sklaven waren eine kleine Gruppe. Einzelne Menschen konnten aufsteigen, etwa über die Schreiberschule.",
    draw: societyPyramid,
  },
  volksversammlung: {
    title: "Die Volksversammlung in Athen",
    caption: "Gezeichnete Szene; die Zahl der Figuren ist kein Mengenverhältnis.",
    draw: assembly,
  },
  "demokratie-vergleich": {
    title: "Demokratie damals und heute",
    caption: "Vereinfachter Vergleich von Athen und Deutschland.",
    draw: democracyThenNow,
  },
  "griechen-erbe": {
    title: "Das Erbe der Griechen",
    caption: "Sechs Beispiele, die bis heute wirken.",
    draw: greekLegacy,
  },
  konflikttreppe: {
    title: "Die Konflikttreppe",
    caption:
      "Ein Streit kann Stufe für Stufe schlimmer werden. Auf jeder Stufe kannst du aussteigen oder Hilfe holen.",
    draw: conflictStairs,
  },
  "ich-botschaft": {
    title: "Du-Botschaft und Ich-Botschaft",
    caption: "Dieselbe Situation, zwei Arten zu sprechen.",
    draw: iMessage,
  },
  klassenregeln: {
    title: "Regeln für die Klasse",
    caption: "Beispiel eines Regelplakats, das eine Klasse gemeinsam beschlossen hat.",
    draw: classRules,
  },
  klassensprecherwahl: {
    title: "Die Klassensprecherwahl",
    caption: "Drei Grundsätze machen die Wahl fair.",
    draw: classElection,
  },
  klassenrat: {
    title: "Der Klassenrat",
    caption: "Rollen und Ablauf einer Sitzung; viele Klassen wechseln die Rollen jede Woche.",
    draw: classCouncil,
  },
  familienformen: {
    title: "Viele Formen von Familie",
    caption: "Eine Auswahl; in jeder Form können Menschen füreinander sorgen.",
    draw: familyForms,
  },
  familienwandel: {
    title: "Warum sich Familien verändern",
    caption: "Mehrere Gründe wirken zusammen.",
    draw: familyChange,
  },
  inklusion: {
    title: "Barrieren abbauen",
    caption: "Vier Beispiele, wie alle teilnehmen können.",
    draw: inclusion,
  },
};

export function renderFigure(id: string): string {
  const figure = FIGURES[id];
  if (!figure) return "";
  return `<figure class="lesson-figure" data-figure="${esc(id)}">${figure.draw()}<figcaption><strong>${esc(figure.title)}${figure.title.endsWith(".") ? "" : "."}</strong> ${esc(figure.caption)}</figcaption></figure>`;
}
