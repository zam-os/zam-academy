/**
 * Every drawing a lesson can show, by id. A lesson lists its ids in `figures`;
 * the tests check that each id exists and renders an accessible SVG.
 */
import { esc } from "../workshop";
import * as F from "./scenes-forschen";
import * as M from "./scenes-mensch";
import * as P from "./scenes-pflanzen";

export interface FigureDef {
  title: string;
  caption: string;
  draw: () => string;
}

const fig = (title: string, caption: string, draw: () => string): FigureDef => ({
  title,
  caption,
  draw,
});

export const FIGURES: Record<string, FigureDef> = {
  erkenntnisweg: fig("Der naturwissenschaftliche Erkenntnisweg", "Jede Untersuchung beginnt mit einer Frage und endet mit einer Folgerung, die oft zu einer neuen Frage führt.", F.erkenntnisweg),
  laborgeraete: fig("Arbeitsgeräte im Fachraum", "Vereinfachte Zeichnungen. Im Unterricht nutzt du die Geräte nach Anleitung.", F.laborgeraete),
  sicherheitsregeln: fig("Sicher arbeiten", "Diese Regeln gelten bei jeder Untersuchung, im Fachraum und draußen.", F.sicherheitsregeln),
  ablesefehler: fig("Fehlerquellen erkennen", "Ein Messwert ist nur so gut wie die Art, wie er gewonnen wurde.", F.ablesefehler),
  "nachweise-tafel": fig("Nachweisreaktionen", "Jeder Nachweis zeigt nur einen bestimmten Stoff an. Ein negatives Ergebnis ist auch ein Ergebnis.", F.nachweiseTafel),
  "mikroskop-bau": fig("Das Lichtmikroskop", "Licht durchstrahlt das dünne Präparat; Objektiv und Okular vergrößern nacheinander.", F.mikroskopBau),
  "praeparat-schritte": fig("Ein Frischpräparat herstellen", "Schräg absenken verhindert Luftblasen; Anfärben macht Zellkerne sichtbar.", F.praeparatSchritte),
  zeichenregeln: fig("Biologisch zeichnen", "Eine Zeichnung zeigt das Gesehene, nicht das Erwartete.", F.zeichenregeln),
  "modell-original": fig("Funktionsmodell der Atmung", "Ein Modell vereinfacht: Vergleiche immer, was es zeigt und was es weglässt.", F.modellOriginal),
  "struktur-funktion": fig("Modelle in der Biologie", "Struktur- und Funktionsmodelle haben verschiedene Aufgaben.", F.strukturFunktion),
  "protokoll-aufbau": fig("Das naturwissenschaftliche Protokoll", "Wer das Protokoll liest, soll den Versuch genauso wiederholen können.", F.protokollAufbau),
  "tabelle-diagramm": fig("Von der Tabelle zum Diagramm", "Dieselben Werte, zwei Darstellungsformen: Die Tabelle ist genau, das Diagramm zeigt den Vergleich auf einen Blick.", F.tabelleDiagramm),
  quellencheck: fig("Quellen auswerten", "Schulbuch und Kinderlexikon sind gute Startpunkte; prüfe trotzdem, wer schreibt und wann.", F.quellencheck),
  fachsprache: fig("Fachsprache verwenden", "Fachbegriffe machen Aussagen eindeutig.", F.fachsprache),
  "redi-versuch": fig("Redis Versuch von 1668", "Mit einem Kontrollansatz widerlegte Redi die Vorstellung, Maden entstünden von selbst aus Fleisch.", F.rediVersuch),
  "wissen-zeitleiste": fig("Wissen verändert sich", "Neue Beobachtungen und Versuche können altes Wissen widerlegen oder ergänzen.", F.wissenZeitleiste),
  "kennzeichen-leben": fig("Kennzeichen der Lebewesen", "Ein Lebewesen zeigt alle Kennzeichen. Einzelne davon findet man auch bei unbelebten Dingen.", F.kennzeichenLeben),
  "lebewesen-vergleich": fig("Lebendig oder nicht?", "Erst der Vergleich aller Kennzeichen zeigt, was ein Lebewesen ist.", F.lebewesenVergleich),
  "zellen-vergleich": fig("Tierzelle und Pflanzenzelle", "Zellwand, Chloroplasten und große Vakuole kennzeichnen die Pflanzenzelle.", F.zellenVergleich),
  organisationsebenen: fig("Von der Zelle zum Organismus", "Jede Ebene baut auf der vorherigen auf.", F.organisationsebenen),
  "gewebe-mikroskop": fig("Gewebe im Mikroskop", "Zeichnungen nach typischen Präparaten, keine Fotos.", F.gewebeMikroskop),
  sinnesorgane: fig("Die Sinnesorgane", "Spezialisierte Sinneszellen nehmen jeweils bestimmte Reize auf.", M.sinnesorgane),
  reizkette: fig("Die Reiz-Reaktions-Kette", "Vom Reiz bis zur Reaktion läuft immer dieselbe Abfolge ab.", M.reizkette),
  "reaktion-einfluesse": fig("Was die Reaktion verlangsamt", "Im Straßenverkehr kann jede Zehntelsekunde zählen.", M.reaktionEinfluesse),
  "lautstaerke-skala": fig("Lautstärke in Dezibel", "Werte nach Klexikon · Lärm. Je länger und lauter, desto größer die Gefahr für das Gehör.", M.lautstaerkeSkala),
  sinnesschutz: fig("Sinnesorgane schützen", "Schäden an Gehör und Augen heilen oft nicht wieder.", M.sinnesschutz),
  skelett: fig("Das Skelett des Menschen", "Vereinfachte Vorderansicht; das Skelett eines Erwachsenen hat etwas über 200 Knochen.", M.skelett),
  wirbelsaeule: fig("Wirbelsäule und Bandscheiben", "Die Form der Wirbelsäule passt zu ihrer Aufgabe beim aufrechten Gang.", M.wirbelsaeule),
  "gelenk-bau": fig("Bau eines Gelenks", "Knorpel und Gelenkschmiere sorgen dafür, dass die Knochen fast reibungslos gleiten.", M.gelenkBau),
  gelenktypen: fig("Gelenktypen am eigenen Körper", "Probiere jede Bewegung an dir selbst aus.", M.gelenktypen),
  "muskel-modell": fig("Ein Armmodell bauen", "Das Modell zeigt das Gegenspielerprinzip, aber keine echten Muskelfasern.", M.muskelModell),
  "bewegung-gesund": fig("Gesund für den Bewegungsapparat", "Vorbeugen ist einfacher als heilen.", M.bewegungGesund),
  "energie-bedarf": fig("Wofür der Körper Energie braucht", "Auch im Schlaf braucht der Körper Energie.", M.energieBedarf),
  "zellatmung-schema": fig("Die Zellatmung", "Die Energie steckt in den Nährstoffen und wird in der Zelle umgewandelt.", M.zellatmungSchema),
  "naehrstoffe-tafel": fig("Bestandteile der Nahrung", "Energiewerte gerundet; sie gelten pro Gramm des Nährstoffs.", M.naehrstoffeTafel),
  ernaehrungspyramide: fig("Ernährungspyramide", "Vereinfachte Darstellung nach dem Prinzip der Ernährungspyramide des Bundeszentrums für Ernährung.", M.ernaehrungspyramide),
  verdauungssystem: fig("Das Verdauungssystem", "Vereinfachtes Schema; Lage und Größe der Organe sind angenähert.", M.verdauungssystem),
  "verdauung-prinzip": fig("Grundprinzip der Verdauung", "Zerlegen, aufnehmen, verteilen.", M.verdauungPrinzip),
  "zotten-lungenblaeschen": fig("Oberflächenvergrößerung im Körper", "Viel Fläche auf kleinem Raum beschleunigt den Stoffaustausch.", M.zottenLungenblaeschen),
  atmungsorgane: fig("Die Atmungsorgane", "Die Luft gelangt über immer feinere Verzweigungen bis in die Lungenbläschen.", M.atmungsorgane),
  gasaustausch: fig("Gasaustausch", "Ungefähre Anteile der Atemluft; Sauerstoff wandert ins Blut, Kohlenstoffdioxid heraus.", M.gasaustausch),
  "kreislauf-schema": fig("Der Blutkreislauf", "Schema des doppelten Kreislaufs; im Körper verzweigen sich die Gefäße viel feiner.", M.kreislaufSchema),
  "wochen-bewegung": fig("Ein Bewegungsprotokoll", "Beispielwoche, keine echten Messwerte. Die 60-Minuten-Marke stammt aus den Empfehlungen der WHO für Kinder und Jugendliche.", M.wochenBewegung),
  "rauchen-lunge": fig("Rauchen schadet", "Schon wenige Zigaretten können abhängig machen.", M.rauchenLunge),
  "weibliche-organe": fig("Weibliche Geschlechtsorgane", "Schema von vorn; die Organe liegen geschützt im Becken.", M.weiblicheOrgane),
  "maennliche-organe": fig("Männliche Geschlechtsorgane", "Der Weg der Spermienzellen als Schema.", M.maennlicheOrgane),
  keimzellen: fig("Eizelle und Spermienzelle", "Nicht maßstabsgerecht: Die Eizelle ist viel größer als eine Spermienzelle.", M.keimzellen),
  pubertaet: fig("Veränderungen in der Pubertät", "Jeder Körper entwickelt sich in seinem eigenen Tempo.", M.pubertaet),
  "naehe-zonen": fig("Nähe und Abstand", "Wie nah dir jemand kommen darf, bestimmst du.", M.naeheZonen),
  "hilfe-wege": fig("Hilfe holen", "Hilfe holen ist kein Petzen. Die Nummer gegen Kummer ist anonym und kostenlos.", M.hilfeWege),
  "bluete-schnitt": fig("Bau einer Blüte", "Längsschnitt durch eine Kirschblüte, vereinfacht.", P.blueteSchnitt),
  "diagramm-symbole": fig("Zeichen im Blütendiagramm", "Das Blütendiagramm ist ein abstrahiertes Modell der Blüte.", P.diagrammSymbole),
  pollenschlauch: fig("Bestäubung und Befruchtung", "Bestäubung bringt den Pollen zur Narbe; erst die Befruchtung vereinigt die Keimzellen.", P.pollenschlauch),
  "vergleich-mensch-pflanze": fig("Fortpflanzung im Vergleich", "Bei Pflanze und Mensch verschmelzen eine männliche und eine weibliche Keimzelle.", P.vergleichMenschPflanze),
  "wind-tier": fig("Wind- und Tierbestäubung", "Beide Wege haben Kosten und Nutzen.", P.windTier),
  "bauplan-samenpflanze": fig("Grundbauplan der Samenpflanze", "Die Aufgaben von Wurzel, Sprossachse und Blatt lernst du genauer in Klasse 6.", P.bauplanSamenpflanze),
  "kreuz-lippen": fig("Zwei Pflanzenfamilien", "Gemeinsame Merkmale zeigen Verwandtschaft.", P.kreuzLippen),
  "schluessel-baum": fig("Ein Bestimmungsschlüssel", "Ausschnitt aus dem Schlüssel des Modells; echte Bestimmungsbücher enthalten viel mehr Arten.", P.schluesselBaum),
  "wiese-lebensgemeinschaft": fig("Ökosystem Wiese", "Vereinfachte Zeichnung; auf einer echten Wiese leben viel mehr Arten.", P.wieseLebensgemeinschaft),
  "umweltfaktoren-messen": fig("Umweltfaktoren messen", "Erst der Vergleich zweier Messstellen zeigt Unterschiede.", P.umweltfaktorenMessen),
  "intensiv-extensiv": fig("Zwei Arten der Bewirtschaftung", "Zahlen der Schnitte sind typische Größenordnungen, sie schwanken je nach Lage und Wetter.", P.intensivExtensiv),
};

export function renderFigure(id: string): string {
  const figure = FIGURES[id];
  if (!figure) return "";
  return `<figure class="lesson-figure">${figure.draw()}<figcaption><strong>${esc(figure.title)}</strong> · ${esc(figure.caption)}</figcaption></figure>`;
}
