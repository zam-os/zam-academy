/**
 * Every drawing and map a lesson can show, by id. A lesson lists its ids in
 * `figures`; the tests check that each id exists and renders an accessible
 * SVG. Drawings are simplified on purpose and say so in their captions.
 */
import { esc } from "../workshop";
import { bavariaDistricts, bavariaNatural, conurbations, farmRegions, germany, worldContinents } from "./maps";
import { chartTypes, fieldTrip, geomedia, graticuleGlobe, mapTypes, sketchAndProfile, specialEarth } from "./scenes-methoden";
import { alpsAndCoast, everydayEnvironment, globeAndMap, landscapeProfile, readingMaps, solarSystem } from "./scenes-lb1";
import { alpsFormation, cityGrowth, cityModel, coastForms, forces, glacialSeries, nationalPark, naturalHazards, organicConventional, rocks, soil, streetRedesign, suburbs, uplands, villageChange } from "./scenes-raum";

export interface FigureDef {
  title: string;
  caption: string;
  draw: () => string;
}

export const FIGURES: Record<string, FigureDef> = {
  kartenarten: { title: "Drei Kartenarten", caption: "Vereinfachte Kartenausschnitte eines erfundenen Gebiets: Die Art einer Karte erkennst du an Titel und Legende.", draw: mapTypes },
  "karte-lesen": { title: "Eine Karte mit Planquadraten lesen", caption: "Erfundenes Dorf zum Üben. Die Legende erklärt die Zeichen, das Gitter aus Buchstaben und Zahlen bildet Planquadrate wie im Atlas.", draw: readingMaps },
  "diagramm-arten": { title: "Drei Diagrammarten, dieselben Werte", caption: "Erfundene Niederschlagswerte einer Schulwoche (Mo 3 mm, Di 0 mm, Mi 11 mm, Do 6 mm, Fr 2 mm), dreimal anders dargestellt.", draw: chartTypes },
  exkursion: { title: "Eine Erkundung in drei Schritten", caption: "Schema: vorbereiten, vor Ort beobachten und messen, auswerten und präsentieren.", draw: fieldTrip },
  sonnensystem: { title: "Unser Sonnensystem", caption: "Acht Planeten kreisen um die Sonne. Größen und Abstände sind nicht maßstabsgetreu: In Wirklichkeit liegen die äußeren Planeten viel weiter draußen.", draw: solarSystem },
  "erde-besonders": { title: "Was die Erde zum Lebensraum macht", caption: "Vereinfachtes Schema; Abstände und Größen sind nicht maßstabsgetreu.", draw: specialEarth },
  "umwelt-alltag": { title: "Kurze Wege und richtig trennen", caption: "Die Entfernung nach Neuseeland ist gerundet. Welche Tonne für was gilt, legt jede Gemeinde selbst fest.", draw: everydayEnvironment },
  kontinente: { title: "Kontinente und Ozeane", caption: "Weltkarte nach Natural Earth. Auf dieser Karte wirken die Gebiete nahe den Polen, besonders die Antarktis, viel größer, als sie sind.", draw: worldContinents },
  "globus-karte": { title: "Globus, Karte und Himmelsrichtungen", caption: "Vereinfachte Zeichnung: Der Globus zeigt die Erde unverzerrt, die Karte macht sie flach und handlich. Die Windrose hilft dir, dich zu orientieren.", draw: globeAndMap },
  "gradnetz-globus": { title: "Das Gradnetz auf dem Globus", caption: "Vereinfachte Zeichnung: Breitenkreise und Längenhalbkreise alle 30 Grad.", draw: graticuleGlobe },
  geomedien: { title: "Orientierung mit Satelliten", caption: "Schema, nicht maßstabsgetreu: Navigationssatelliten kreisen etwa 20 000 km über der Erde.", draw: geomedia },
  deutschland: { title: "Deutschland und seine Bundesländer", caption: "Bayern ist gelb hervorgehoben. Kartengrundlage: Natural Earth (gemeinfrei).", draw: germany },
  "landschaften-profil": { title: "Von der Küste zu den Alpen", caption: "Querschnitt von Norden nach Süden, Höhen stark überhöht. Die Grenzen zwischen den Großlandschaften sind fließend.", draw: landscapeProfile },
  "bayern-naturraum": { title: "Die Naturräume Bayerns", caption: "Die Naturräume sind als vereinfachte Flächen eingezeichnet, die Hauptwasserscheide als vereinfachte Linie. Prüfe genaue Grenzen im Atlas. Kartengrundlage: Natural Earth (gemeinfrei).", draw: bavariaNatural },
  kartenskizze: { title: "Kartenskizze und Profil", caption: "So kann eine eigene Skizze aussehen: wenige Farben, Nordpfeil, Lage stimmt. Das Profil ist ein erfundenes Beispiel und stark überhöht.", draw: sketchAndProfile },
  kraefte: { title: "Endogene und exogene Kräfte", caption: "Schematische Zeichnung, nicht maßstabsgetreu. Beide Kräfte wirken gleichzeitig.", draw: forces },
  gesteine: { title: "Drei Gesteinsgruppen", caption: "Vereinfachte Zeichnungen von Gesteinsproben. Die Säureprobe mit Essig zeigt Kalk an.", draw: rocks },
  "alpen-entstehung": { title: "Wie die Alpen entstanden", caption: "Stark vereinfachte Abfolge über viele Millionen Jahre; nicht maßstabsgetreu.", draw: alpsFormation },
  "glaziale-serie": { title: "Die glaziale Serie", caption: "Vereinfachter Schnitt von den Alpen nach Norden, Höhen überhöht.", draw: glacialSeries },
  "alpen-kueste": { title: "Alpen und Küste", caption: "Zwei vereinfachte Landschaftsbilder: Alpen in Bayern mit Alm und Seilbahn und Nordseeküste.", draw: alpsAndCoast },
  naturgefahren: { title: "Naturgefahren und Schutz", caption: "Schematische Zeichnungen, nicht maßstabsgetreu.", draw: naturalHazards },
  mittelgebirge: { title: "Bruchschollen und Schichtstufen", caption: "Vereinfachte Schnitte durch die Erdkruste, Höhen überhöht.", draw: uplands },
  nationalpark: { title: "Zonen eines Nationalparks", caption: "Vereinfachtes Schema. Wie die Zonen genau heißen und wo sie liegen, legt jeder Nationalpark selbst fest.", draw: nationalPark },
  kuestenformen: { title: "Küstenformen an Nordsee und Ostsee", caption: "Schematische Draufsicht, nicht maßstäblich.", draw: coastForms },
  "dorf-wandel": { title: "Ein Dorf im Wandel", caption: "Gezeichnetes Beispiel, vereinfacht.", draw: villageChange },
  boden: { title: "Boden untersuchen", caption: "Vereinfachtes Bodenprofil und Ergebnis einer Schlämmprobe.", draw: soil },
  agrarraeume: { title: "Agrarräume in Bayern und Deutschland", caption: "Die Nummern markieren ungefähre Lagen, keine Grenzen. Kartengrundlage: Natural Earth (gemeinfrei).", draw: farmRegions },
  "oeko-konventionell": { title: "Zwei Arten der Landwirtschaft", caption: "Vereinfachte Gegenüberstellung; auch innerhalb beider Arten wirtschaften Höfe sehr unterschiedlich.", draw: organicConventional },
  "bayern-bezirke": { title: "Die sieben Regierungsbezirke Bayerns", caption: "Regierungssitze als Sterne; die Grenzen der Bezirke sind nicht eingezeichnet, prüfe sie im Atlas. Kartengrundlage: Natural Earth (gemeinfrei).", draw: bavariaDistricts },
  verdichtungsraeume: { title: "Große Verdichtungsräume in Deutschland", caption: "Die Kreise zeigen ungefähre Lage und Größe, keine gemessenen Grenzen. Kartengrundlage: Natural Earth (gemeinfrei).", draw: conurbations },
  stadtwachstum: { title: "Eine Stadt wächst in Ringen", caption: "Vereinfachtes Schema einer erfundenen Stadt.", draw: cityGrowth },
  stadtmodell: { title: "Funktionale Gliederung einer Stadt", caption: "Vereinfachtes Schema einer erfundenen Stadt; echte Städte sind weniger regelmäßig.", draw: cityModel },
  suburbanisierung: { title: "Die Stadt wächst ins Umland", caption: "Vereinfachtes Schema.", draw: suburbs },
  "strasse-umbau": { title: "Eine Straße wird umgebaut", caption: "Gezeichnetes Beispiel einer erfundenen Straße, vereinfacht.", draw: streetRedesign },
};

export function renderFigure(id: string): string {
  const figure = FIGURES[id];
  if (!figure) return "";
  return `<figure class="lesson-figure" data-figure="${esc(id)}">${figure.draw()}<figcaption><strong>${esc(figure.title)}${figure.title.endsWith(".") ? "" : "."}</strong> ${esc(figure.caption)}</figcaption></figure>`;
}
