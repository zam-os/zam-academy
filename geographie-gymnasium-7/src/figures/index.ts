import radarImage from "../data/rotterdam.jpg?inline";
import { label, svg } from "./draw";
import { connectionsMap, portsMap, regionsMap, reliefMap, seasMap, tectonicMap } from "./maps";
import { climateChart, climateTable, coastProfile, comparisonBars, processFigure, rainfallProfile } from "./models";

const figure = (title: string, body: string, caption: string) =>
  `<figure class="lesson-figure">${body}<figcaption><strong>${title}</strong> · ${caption}</figcaption></figure>`;

const scenes: Record<string, () => string> = {
  haefen: () => figure("Häfen und Hinterland", portsMap(),
    "Das gestrichelte Blau markiert einen schematischen Seeweg. Die kurze violette Linie steht für eine Verbindung ins Hinterland."),
  hafenbild: () => figure("Rotterdam im Radarbild",
    `<img class="geo-photo" src="${radarImage}" width="1050" height="623" loading="eager"
      alt="Radarbild der südwestlichen Niederlande. Dunkle Flächen zeigen Wasser, helle zusammenhängende Flecken Siedlungen und bunte Punkte auf dem Meer Schiffe."/>
    <p class="geo-credit">Enthält veränderte Copernicus-Sentinel-Daten (2022–23), verarbeitet von ESA. Verkleinerte Kopie unter <a href="https://creativecommons.org/licenses/by-sa/3.0/igo/" target="_blank" rel="noopener">CC BY-SA 3.0 IGO</a>.</p>
    ${svg(580, 174, "Hafenskizze mit Wasser, Kai und Wegen ins Hinterland",
      '<rect class="sea" width="580" height="174"/><path class="geo-sand" d="M110 0H580V174H112V126H347V100H112V74H347V48H110Z"/><path class="geo-inland" d="M356 24H435V156H540 M356 92H435 M356 141H435"/>' +
      label(57, 125, "Wasser", "lbl small") + label(291, 68, "Kai", "lbl strong") + label(473, 64, "Hinterland", "lbl strong"))}`,
    "Oben drei überlagerte Radaraufnahmen, unten eine vereinfachte Hafenskizze. Die Skizze verwendet eigene Zeichen für Wasser, Kaikanten und Wege."),
  verkehrsanteile: () => figure("Verkehrsmittel in einer Modellstadt",
    svg(580, 133, "Banddiagramm mit 45 Prozent Bus und Bahn, 35 Prozent Auto und 20 Prozent Rad",
      '<rect class="geo-color-0" x="36" y="42" width="228.6" height="39"/><rect class="geo-color-1" x="264.6" y="42" width="177.8" height="39"/><rect class="geo-color-2" x="442.4" y="42" width="101.6" height="39"/>' +
      label(150, 66, "Bus und Bahn · 45 %", "lbl strong") + label(355, 66, "Auto · 35 %", "lbl strong") + label(493, 66, "Rad · 20 %", "lbl strong") + label(290, 105, "Alle Wege zusammen · 100 %", "lbl small")),
    "Die Länge jedes Bandabschnitts ist proportional zum Anteil. Die Werte sind für die Übung erfunden."),
  staaten: () => figure("Ausgewählte Staaten und Teilräume", regionsMap(),
    "Die Einteilung dient der Orientierung. Andere Karten können Übergangsregionen anders zuordnen."),
  binnenmarkt: () => figure("Vier Freiheiten im Binnenmarkt",
    processFigure("Was kann sich über Grenzen bewegen?", ["Waren", "Personen", "Leistungen", "Kapital"],
      ["Fahrrad", "Arbeitsweg", "Reparatur", "Geldanlage"]), "Die Beispiele stehen für unterschiedliche Freiheiten."),
  migration: () => figure("Perspektiven auf einen Wohnortwechsel",
    processFigure("Eine Person zieht für eine Stelle um", ["Herkunftsort", "Person", "Zielort"],
      ["Stelle wird frei", "neuer Arbeitsweg", "neue Arbeitskraft"]), "Eine Veränderung kann an beiden Orten unterschiedliche Folgen haben."),
  naturraume: () => figure("Gebirge und Ebenen", reliefMap(),
    "Die dicken Linien markieren die grobe Lage von Gebirgen. Sie geben Höhen und Ausdehnung nicht maßstäblich wieder."),
  klima: () => figure("Klimadiagramm und Tabelle", climateChart("coast") + climateTable("coast"),
    "Temperatur als Linie und Niederschlag als Säulen. Die Daten illustrieren ein Muster, sie stammen von keiner Messstation."),
  gebirgsregen: () => figure("Steigungsregen und trockeneres Lee", rainfallProfile(),
    "In der Skizze markiert Blau den Niederschlag an der Windseite. Das Modell zeigt einen typischen Fall, keine Wettervorhersage."),
  plattenkarte: () => figure("Zwei Regionen mit Plattenbewegungen", tectonicMap(),
    "Die Punkte zeigen Lagebeispiele. Das Labor stellt vereinfachte Querschnitte und eine Draufsicht gegenüber."),
  risiko: () => figure("Drei Fragen zum Risiko",
    processFigure("Was beeinflusst mögliche Schäden?", ["Gefahr", "Exposition", "Verwundbarkeit"],
      ["Was kann\npassieren?", "Wer und was\nist betroffen?", "Wie empfindlich\nist der Ort?"]), "Ein Ereignis kann bei gleichen Naturkräften unterschiedliche Schäden verursachen."),
  wasserbilanz: () => figure("Wasserentnahme mit und ohne Flächenwachstum",
    comparisonBars("Entnahme · vereinfachtes Beispiel", [["Ausgangslage", 100], ["Sparsamer je Hektar", 80], ["Plus mehr Fläche", 120]], "%", 125),
    "Die Balken vergleichen die Gesamtentnahme. Im letzten Fall wird die neue Technik auf einer größeren Fläche eingesetzt."),
  "laendlicher-raum": () => figure("Nutzung und Erreichbarkeit",
    processFigure("Vom Standort zum Absatz", ["Naturraum", "Betrieb", "Markt"],
      ["Boden und Regen", "Fläche und Arbeit", "Wege und Preise"]), "Eine Änderung an einer Station kann den ganzen ländlichen Raum beeinflussen."),
  lieferkette: () => figure("Vom Feld bis auf den Teller",
    processFigure("Drei Schritte im Vergleich", ["Anbau", "Transport", "Konsum"],
      ["Wasser und Energie", "Weg und Kühlung", "Lagern und essen"], true), "Für ein Urteil zählen mehrere Schritte."),
  verdichtung: () => figure("Zentrum und Umland",
    processFigure("Verflochtener Verdichtungsraum", ["Wohnorte", "Verkehrsachse", "Zentrum"],
      ["Quartiere im Umland", "Bahn und Straße", "Arbeit, Kultur, Handel"]), "Wege schaffen einen gemeinsamen Raum über Verwaltungsgrenzen hinweg."),
  standorte: () => figure("Branchen vergleichen",
    processFigure("Welche Lage passt zur Aufgabe?", ["Güterlogistik", "Forschung"],
      ["Fläche und Verkehr", "Fachkräfte und Hochschule"]), "Faktoren wirken je nach Betrieb unterschiedlich stark."),
  verbindungen: () => figure("Der Öresund", connectionsMap(),
    "Die Verbindung zwischen Kopenhagen und Malmö führt über eine Brücken- und Tunnelstrecke."),
  meere: () => figure("Europäische Meere", seasMap(),
    "Die Karte hilft bei der Orientierung. Enge Übergänge wirken im kleinen Maßstab vereinfacht."),
  kuestennutzung: () => figure("Eine Küste, mehrere Nutzungen",
    processFigure("Wofür wird der Küstenraum genutzt?", ["Fischerei", "Rohstoffe", "Tourismus"],
      ["Nahrung und Arbeit", "Öl und Gas", "Strand und Erholung"]), "Mehrere Nutzungen können in derselben Bucht um Platz konkurrieren."),
  watt: () => figure("Wattenmeer bei Niedrigwasser", coastProfile("low"),
    "Große Wattflächen fallen trocken. Rinnen können Wasser führen. Die vereinfachte Skizze ist keine Orientierungshilfe für Wattwanderungen."),
};

export function renderFigure(id: string): string {
  return scenes[id]();
}
