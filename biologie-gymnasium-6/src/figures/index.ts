/**
 * Every drawing a lesson can show, by id. A lesson lists its ids in `figures`;
 * the tests check that each id exists and renders an accessible SVG.
 */
import { esc } from "../workshop";
import * as F from "./scenes-forschen";
import * as P from "./scenes-pflanzen";
import * as T from "./scenes-tiere";

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
  planungskriterien: fig("Eine Untersuchung planen", "Wer diese Punkte vorher festlegt, erhält ein aussagekräftiges Ergebnis.", F.planungskriterien),
  "variablen-schema": fig("Variable, Konstanten, Kontrollversuch", "Beispiel Keimung: Nur die Feuchtigkeit unterscheidet die Ansätze.", F.variablenSchema),
  ablesefehler: fig("Fehlerquellen erkennen", "Ein Messwert ist nur so gut wie die Art, wie er gewonnen wurde.", F.ablesefehler),
  "fehler-vermeiden": fig("Fehler vermeiden", "Fast jede Fehlerquelle lässt sich schon bei der Planung ausschließen.", F.fehlerVermeiden),
  beobachtungsbogen: fig("Strukturiert beobachten", "Beispielbogen mit erfundenen Einträgen; die Kriterien legst du vor dem Beobachten fest.", F.beobachtungsbogen),
  "protokoll-aufbau": fig("Das naturwissenschaftliche Protokoll", "Wer das Protokoll liest, soll den Versuch genauso wiederholen können.", F.protokollAufbau),
  "mikroskop-bau": fig("Das Lichtmikroskop", "Licht durchstrahlt das dünne Präparat; Objektiv und Okular vergrößern nacheinander.", F.mikroskopBau),
  vergroesserung: fig("Lupe, Binokular, Mikroskop", "Vergrößerungen gerundet; sie hängen vom Gerät ab.", F.vergroesserung),
  zeichenregeln: fig("Biologisch zeichnen", "Eine Zeichnung zeigt das Gesehene, nicht das Erwartete.", F.zeichenregeln),
  "praeparat-schritte": fig("Ein Frischpräparat herstellen", "Schräg absenken verhindert Luftblasen; Anfärben macht Zellkerne sichtbar.", F.praeparatSchritte),
  "schnitt-technik": fig("Einen Querschnitt anfertigen", "Klingen nur nach Anleitung und vom Körper weg benutzen.", F.schnittTechnik),
  "struktur-funktion": fig("Modelle in der Biologie", "Struktur- und Funktionsmodelle haben verschiedene Aufgaben.", F.strukturFunktion),
  "modell-ahornfrucht": fig("Original und Modell", "Ein Modell zeigt nur einen Ausschnitt der Wirklichkeit.", F.modellAhornfrucht),
  "saeule-linie": fig("Säulen- oder Liniendiagramm?", "Beispielwerte aus einem Keimungsversuch; Säulen vergleichen Ansätze, Linien zeigen einen Verlauf.", F.saeuleLinie),
  "je-desto": fig("Eine Je-desto-Beziehung", "Modellwerte wie im Wasserpest-Labor.", F.jeDesto),
  "quellen-kriterien": fig("Quellen einschätzen", "Eine vereinfachte Quelle für Kinder kann richtig sein; Werbung ist es oft nicht.", F.quellenKriterien),
  aussagen: fig("Fakt oder Bewertung?", "Vermenschlichende Aussagen sind Bewertungen, auch wenn sie wie Tatsachen klingen.", F.aussagen),
  bohnensamen: fig("Bau eines Samens", "Vereinfachte Schnittzeichnungen, nicht maßstabsgerecht.", P.bohnensamen),
  "bluete-zur-frucht": fig("Von der Blüte zur Frucht", "Aus jeder befruchteten Samenanlage wird ein Samen.", P.blueteZurFrucht),
  ausbreitungstypen: fig("Wie Samen reisen", "Jede Strategie hat ihren Preis.", P.ausbreitungstypen),
  "bionik-pflanzen": fig("Pflanzen als Ideengeber", "Bionik überträgt ein Prinzip der Natur, nicht ihre genaue Form.", P.bionikPflanzen),
  "erdbeer-auslaeufer": fig("Ausläufer der Erdbeere", "Die Tochterpflanzen haben dasselbe Erbgut wie die Mutterpflanze.", P.erdbeerAuslaeufer),
  "fortpflanzung-kosten": fig("Zwei Wege der Fortpflanzung", "Viele Pflanzen nutzen beide Wege.", P.fortpflanzungKosten),
  "keimung-bohne": fig("Eine Bohne keimt", "Bis die Laubblätter Zucker bilden, lebt der Keimling von den Vorräten im Samen.", P.keimungBohne),
  "pflanze-aufgaben": fig("Wurzel, Sprossachse, Blatt", "Die Teile arbeiten nur zusammen: Keiner kann ohne die anderen.", P.pflanzeAufgaben),
  "photosynthese-teilchen": fig("Photosynthese im Teilchenmodell", "Stark vereinfacht: Kein Teilchen sieht wirklich so aus.", P.photosyntheseTeilchen),
  stoffkreislauf: fig("Photosynthese und Zellatmung", "Was die Photosynthese aufbaut, baut die Zellatmung wieder ab.", P.stoffkreislauf),
  "photosynthese-bedeutung": fig("Ohne Photosynthese kein Leben", "Auch Kohle und Erdöl speichern Sonnenenergie aus der Vorzeit.", P.photosyntheseBedeutung),
  pflanzenreaktionen: fig("Pflanzen reagieren", "Pflanzen haben keine Nerven, reagieren aber trotzdem auf Reize.", P.pflanzenreaktionen),
  "reiz-reaktion-vergleich": fig("Reaktion bei Mensch und Pflanze", "Gleiches Prinzip, verschiedene Wege und Geschwindigkeiten.", P.reizReaktionVergleich),
  "fisch-bau": fig("Bau eines Knochenfisches", "Vereinfachte Seitenansicht; Schwimmblase und Kiemen liegen innen.", T.fischBau),
  "vogel-leichtbau": fig("Gebaut zum Fliegen", "Leicht und trotzdem stabil.", T.vogelLeichtbau),
  flugarten: fig("Flugarten", "Viele Vögel wechseln je nach Lage die Flugart.", T.flugarten),
  fusshaltung: fig("Drei Fußhaltungen", "Schema eines Hinterbeins, nicht maßstabsgerecht.", T.fusshaltung),
  "fortbewegung-lebensraum": fig("Fortbewegung und Lebensraum", "Der Körperbau passt zum Lebensraum.", T.fortbewegungLebensraum),
  "bionik-tiere": fig("Tiere als Ideengeber", "Ingenieure übertragen das Prinzip und passen es an Technik an.", T.bionikTiere),
  gebisse: fig("Gebisse im Vergleich", "Schema des Oberkiefers von unten, stark vereinfacht.", T.gebisse),
  schnaebel: fig("Schnabelformen", "Die Form des Schnabels verrät die Nahrung.", T.schnaebel),
  isolation: fig("Warm halten", "Gleichwarme Tiere sparen so Energie.", T.isolation),
  ueberwinterung: fig("Durch den Winter", "Jede Strategie spart Energie, wenn Nahrung knapp ist.", T.ueberwinterung),
  atmungsorgane: fig("Atmungsorgane im Vergleich", "Alle nehmen Sauerstoff auf und geben Kohlenstoffdioxid ab.", T.atmungsorgane),
  "wasser-land-reihe": fig("Vom Wasser an Land", "Je unabhängiger vom Wasser, desto besser geschützt ist der Nachwuchs.", T.wasserLandReihe),
  "kaulquappe-frosch": fig("Zwei Leben in einem", "Larve und erwachsenes Tier nutzen verschiedene Lebensräume und Nahrung.", T.kaulquappeFrosch),
  vogelei: fig("Das Vogelei", "Längsschnitt durch ein Hühnerei, vereinfacht.", T.vogelei),
  "nesthocker-nestfluechter": fig("Nesthocker und Nestflüchter", "Beide Wege kommen bei Vögeln und Säugetieren vor.", T.nesthockerNestfluechter),
  elternaufwand: fig("Viele Junge oder viel Fürsorge", "Eizahlen nach Wikipedia (Atlantischer Kabeljau, Grasfrosch, Amsel); sie schwanken stark.", T.elternaufwand),
  "balz-signale": fig("Signale an Artgenossen", "Nur Tiere derselben Art verstehen diese Signale richtig.", T.balzSignale),
  "besondere-sinne": fig("Besondere Sinne", "Diese Reize können wir Menschen nicht wahrnehmen.", T.besondereSinne),
  "sinne-lebensraum": fig("Sinne und Lebensweise", "Die besten Sinne hat ein Tier dort, wo es sie braucht.", T.sinneLebensraum),
  "wirbeltier-tabelle": fig("Die fünf Wirbeltierklassen", "Typische Merkmale; einzelne Arten weichen ab.", T.wirbeltierTabelle),
  "variation-auslese": fig("Variation und Auslese", "Stark vereinfachtes Modell, keine echten Zählungen.", T.variationAuslese),
  "zuechtung-evolution": fig("Züchtung und Evolution", "Beide beruhen auf Unterschieden, Vererbung und Auswahl.", T.zuechtungEvolution),
  tiergerecht: fig("Tiergerecht halten", "Vor der Anschaffung klären: Platz, Zeit, Kosten, Urlaub.", T.tiergerecht),
  eiercode: fig("Der Code auf dem Ei", "Beispielcode, kein echter Betrieb.", T.eiercode),
  "gewaesser-messen": fig("Gewässer untersuchen", "Messungen nur mit Erwachsenen und an sicheren Uferstellen.", T.gewaesserMessen),
  "teich-zonen": fig("Lebensraum Teich", "Vereinfachte Zeichnung; in einem echten Teich leben viel mehr Arten.", T.teichZonen),
  "oekosystem-teich": fig("Das Ökosystem Teich", "Lebewesen und unbelebte Natur wirken zusammen.", T.oekosystemTeich),
  "gewaesser-gefahren": fig("Gefahren und Schutz", "Schutz beginnt oft schon am Ufer und auf dem Feld.", T.gewaesserGefahren),
};

export function renderFigure(id: string): string {
  const figure = FIGURES[id];
  if (!figure) return "";
  return `<figure class="lesson-figure">${figure.draw()}<figcaption><strong>${esc(figure.title)}</strong> · ${esc(figure.caption)}</figcaption></figure>`;
}
