/**
 * Registry of all 59 lesson figures (drawings, Schaubilder and
 * Natural-Earth historical maps) plus the Lernpfad panorama and the
 * Nachschlagen timeline.
 */
import { esc } from "../workshop";
import {
  dreifelderSchema,
  grundherrschaftSchema,
  herrschaftsRechtfertigung,
  herzogtuemer,
  hoefischeTugenden,
  juedischesLebenWeg,
  klosterPlan,
  koenigtumAntikeMittelalter,
  pestDeutungen,
  reichskircheKreislauf,
  ritterWeg,
  romanikGotikVergleich,
  stadtGesellschaft,
  staendeBild,
  territorialisierungWeg,
} from "./scenes-lb1-2";
import {
  abschriftDruckVergleich,
  chinaEuropaVergleich,
  druckSchritte,
  entdeckungsVoraussetzungen,
  fuggerAufstieg,
  handelFrueherHeute,
  hanseKogge,
  kolumbianischerAustausch,
  konstantinopelPerspektiven,
  kreuzzugMotive,
  lehnwoerter,
  lieferketteKaffee,
  menschenbildWandel,
  quellenPerspektiven,
  wissenstransfer,
  zhengHeKolumbus,
} from "./scenes-lb3-4";
import {
  aachenPfalz,
  ablassStreit,
  absolutismusSaeulen,
  anspruchWirklichkeit,
  friedenBestimmungen,
  herrschaftsformenVergleich,
  hexenprozess,
  hofzeremoniell,
  kriegsfolgen,
  kriegsparteien,
  ludwigsKriege,
  medienwandel,
  merkantilismusKreislauf,
  reichstagKuppel,
  religionsfriede1555,
  schleissheimVersailles,
  theaterGrundriss,
  treppenhausWuerzburg,
  umbruchKrisen,
  zwoelfArtikel,
} from "./scenes-lb5-7";
import {
  bauernkriegKarte,
  europaeisierungKarte,
  fuggerKarte,
  karlVReich,
  konstantinopelKarte,
  limesHandelKarte,
  pfalzenKarte,
  residenzKarte,
} from "./maps";
import { gesamtZeitleiste, heroPanorama } from "./scenes-overview";

export interface Figure {
  caption: string;
  render: () => string;
}

export const FIGURES: Record<string, Figure> = {
  herzogtuemer: {
    caption: "Das Ostfrankenreich bestand aus großen Herzogtümern; die Ottonen kamen aus Sachsen.",
    render: herzogtuemer,
  },
  herrschaftsRechtfertigung: {
    caption: "Otto I. stützte seine Herrschaft auf mehrere Begründungen zugleich.",
    render: herrschaftsRechtfertigung,
  },
  koenigtumAntikeMittelalter: {
    caption: "Vergleich: Die Monarchie des Augustus und das Königtum Ottos I.",
    render: koenigtumAntikeMittelalter,
  },
  reichskircheKreislauf: {
    caption: "Das Reichskirchensystem band Bischöfe an den König – bis zum Investiturstreit.",
    render: reichskircheKreislauf,
  },
  territorialisierungWeg: {
    caption: "Aus Lehen wurden über Generationen eigene Landesherrschaften.",
    render: territorialisierungWeg,
  },
  staendeBild: {
    caption: "Die Ständelehre erklärte die Ungleichheit der Menschen als gottgewollt.",
    render: staendeBild,
  },
  grundherrschaftSchema: {
    caption: "Schaubild: Leistungen und Gegenleistungen in der Grundherrschaft.",
    render: grundherrschaftSchema,
  },
  dreifelderSchema: {
    caption: "In der Dreifelderwirtschaft wechseln die Felder jedes Jahr ihre Nutzung.",
    render: dreifelderSchema,
  },
  klosterPlan: {
    caption: "Ein Kloster war Kirche, Schule, Krankenhaus und Wirtschaftsbetrieb zugleich (vereinfacht).",
    render: klosterPlan,
  },
  ritterWeg: {
    caption: "Vom Pagen zum Ritter dauerte die Ausbildung viele Jahre.",
    render: ritterWeg,
  },
  hoefischeTugenden: {
    caption: "Höfische Tugenden beschreiben ein Ideal – nicht unbedingt den Alltag.",
    render: hoefischeTugenden,
  },
  romanikGotikVergleich: {
    caption: "Bogenform, Mauerdicke und Fenstergröße verraten den Baustil (Zeichnung, vereinfacht).",
    render: romanikGotikVergleich,
  },
  stadtGesellschaft: {
    caption: "Nicht alle Stadtbewohner besaßen das Bürgerrecht.",
    render: stadtGesellschaft,
  },
  juedischesLebenWeg: {
    caption: "Jüdisches Leben im Reich zwischen Blüte, Schutz und Verfolgung.",
    render: juedischesLebenWeg,
  },
  pestDeutungen: {
    caption: "Wie man die Pest erklärte, bestimmte, wie man auf sie reagierte.",
    render: pestDeutungen,
  },
  kreuzzugMotive: {
    caption: "Religiöse und weltliche Motive der Kreuzfahrer wirkten zusammen.",
    render: kreuzzugMotive,
  },
  quellenPerspektiven: {
    caption: "Dasselbe Ereignis aus christlicher und aus muslimischer Sicht.",
    render: quellenPerspektiven,
  },
  wissenstransfer: {
    caption: "Wissen und Waren erreichten Europa auf vielen Wegen, oft über Spanien, Sizilien und Italien.",
    render: wissenstransfer,
  },
  konstantinopelPerspektiven: {
    caption: "„Fall“ oder „Eroberung“: Die Wortwahl verrät die Perspektive.",
    render: konstantinopelPerspektiven,
  },
  menschenbildWandel: {
    caption: "Bedeutungsperspektive und Zentralperspektive im Vergleich (Zeichnung).",
    render: menschenbildWandel,
  },
  druckSchritte: {
    caption: "Gutenbergs Erfindung war ein ganzes System von Arbeitsschritten.",
    render: druckSchritte,
  },
  abschriftDruckVergleich: {
    caption: "Abschrift und Druck im Vergleich (Größenordnung nach Schätzungen).",
    render: abschriftDruckVergleich,
  },
  entdeckungsVoraussetzungen: {
    caption: "Technik und Wissen machten die Fahrten über den Ozean möglich.",
    render: entdeckungsVoraussetzungen,
  },
  kolumbianischerAustausch: {
    caption: "Pflanzen, Tiere, Krankheiten und Menschen überquerten den Atlantik.",
    render: kolumbianischerAustausch,
  },
  lehnwoerter: {
    caption: "Lateinische Lehnwörter zeigen, was die Germanen von den Römern übernahmen.",
    render: lehnwoerter,
  },
  chinaEuropaVergleich: {
    caption: "China und Europa zur Zeit des europäischen Mittelalters im Vergleich.",
    render: chinaEuropaVergleich,
  },
  zhengHeKolumbus: {
    caption: "Die Flotten Zheng Hes und des Kolumbus im Größenvergleich.",
    render: zhengHeKolumbus,
  },
  hanseKogge: {
    caption: "Die Kogge transportierte die Massengüter der Hanse (Zeichnung).",
    render: hanseKogge,
  },
  fuggerAufstieg: {
    caption: "Vom Weber zum Geldgeber des Kaisers: der Aufstieg der Fugger.",
    render: fuggerAufstieg,
  },
  lieferketteKaffee: {
    caption: "Viele Stationen, viele Beteiligte: eine Lieferkette heute.",
    render: lieferketteKaffee,
  },
  handelFrueherHeute: {
    caption: "Längsschnitt: Was am Welthandel alt ist und was neu.",
    render: handelFrueherHeute,
  },
  umbruchKrisen: {
    caption: "Im 16. Jahrhundert trafen Aufbruch und Krise zusammen.",
    render: umbruchKrisen,
  },
  hexenprozess: {
    caption: "Folter und Besagung ließen Hexenprozesse zu Verfolgungswellen anwachsen.",
    render: hexenprozess,
  },
  ablassStreit: {
    caption: "Der Streit um den Ablass stand am Beginn der Reformation.",
    render: ablassStreit,
  },
  medienwandel: {
    caption: "Vom Buchdruck bis zum Internet: Medien verändern, wie Menschen sich informieren.",
    render: medienwandel,
  },
  zwoelfArtikel: {
    caption: "Die Bauern begründeten ihre Forderungen mit der Bibel (Auswahl, vereinfacht).",
    render: zwoelfArtikel,
  },
  religionsfriede1555: {
    caption: "Der Augsburger Religionsfriede brachte Frieden zwischen den Fürsten, nicht Glaubensfreiheit für alle.",
    render: religionsfriede1555,
  },
  kriegsparteien: {
    caption: "Religion und Machtpolitik bestimmten die Bündnisse im Dreißigjährigen Krieg.",
    render: kriegsparteien,
  },
  kriegsfolgen: {
    caption: "Bevölkerungsverluste im Reich nach Schätzungen der Forschung (Bildstatistik).",
    render: kriegsfolgen,
  },
  friedenBestimmungen: {
    caption: "Der Westfälische Friede ordnete Konfessionen und Grenzen neu.",
    render: friedenBestimmungen,
  },
  absolutismusSaeulen: {
    caption: "Schaubild: Worauf stützte sich die Macht Ludwigs XIV.?",
    render: absolutismusSaeulen,
  },
  merkantilismusKreislauf: {
    caption: "Der Merkantilismus sollte die Staatskasse füllen.",
    render: merkantilismusKreislauf,
  },
  hofzeremoniell: {
    caption: "Selbst das Aufstehen des Königs war eine Zeremonie.",
    render: hofzeremoniell,
  },
  herrschaftsformenVergleich: {
    caption: "Legitimation, Machtmittel und Mitsprache im Vergleich der Epochen.",
    render: herrschaftsformenVergleich,
  },
  anspruchWirklichkeit: {
    caption: "Der absolutistische Anspruch stieß in der Wirklichkeit an Grenzen.",
    render: anspruchWirklichkeit,
  },
  schleissheimVersailles: {
    caption: "Schleißheim übernahm das Vorbild Versailles und passte es an.",
    render: schleissheimVersailles,
  },
  ludwigsKriege: {
    caption: "Ludwigs Streben nach Vorherrschaft führte zu immer neuen Kriegen.",
    render: ludwigsKriege,
  },
  theaterGrundriss: {
    caption: "Grundriss des Dionysostheaters (Zeichnung, vereinfacht).",
    render: theaterGrundriss,
  },
  aachenPfalz: {
    caption: "Plan und Schnitt der Aachener Pfalz (Zeichnung, vereinfacht).",
    render: aachenPfalz,
  },
  treppenhausWuerzburg: {
    caption: "Das Treppenhaus der Würzburger Residenz inszeniert den Landesherrn (Zeichnung, vereinfacht).",
    render: treppenhausWuerzburg,
  },
  reichstagKuppel: {
    caption: "Schnitt durch das Reichstagsgebäude mit begehbarer Kuppel (Zeichnung, vereinfacht).",
    render: reichstagKuppel,
  },
  pfalzenKarte: {
    caption: "Wichtige Pfalzen im Reich auf Basis von Natural-Earth-Geodaten.",
    render: pfalzenKarte,
  },
  konstantinopelKarte: {
    caption: "Die Belagerung Konstantinopels 1453 als Schema.",
    render: konstantinopelKarte,
  },
  europaeisierungKarte: {
    caption: "Die Europäisierung der Welt um 1650 auf Basis von Natural-Earth-Geodaten.",
    render: europaeisierungKarte,
  },
  limesHandelKarte: {
    caption: "Der Obergermanisch-Raetische Limes als kontrollierte Grenze (vereinfacht).",
    render: limesHandelKarte,
  },
  fuggerKarte: {
    caption: "Das Handelsnetz der Fugger auf Basis von Natural-Earth-Geodaten.",
    render: fuggerKarte,
  },
  karlVReich: {
    caption: "Die Länder Karls V. auf Basis von Natural-Earth-Geodaten.",
    render: karlVReich,
  },
  bauernkriegKarte: {
    caption: "Zentren des Bauernkriegs 1524/25 (Aufstandsgebiete vereinfacht).",
    render: bauernkriegKarte,
  },
  residenzKarte: {
    caption: "Barocke Residenzen in Bayern auf Basis von Natural-Earth-Geodaten.",
    render: residenzKarte,
  },
};

export function renderFigure(id: string): string {
  const figure = FIGURES[id];
  if (!figure) return "";
  return `<figure class="lesson-figure" data-figure="${esc(id)}">${figure.render()}<figcaption><strong>Abbildung</strong> · ${esc(figure.caption)}</figcaption></figure>`;
}

export { gesamtZeitleiste, heroPanorama };
