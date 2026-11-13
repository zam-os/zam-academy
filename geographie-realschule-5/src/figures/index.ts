import { esc } from "../workshop";
import * as earth from "./earth";
import * as tools from "./tools";
import * as places from "./places";

export interface FigurePart {
	label: string;
	note: string;
}
export interface ConceptFigure {
	title: string;
	alt: string;
	question: string;
	caption: string;
	parts: FigurePart[];
	draw: () => string;
}
const part = (label: string, note: string): FigurePart => ({ label, note });

/** Teaching diagrams supplement the sourced lesson text; they never record mastery. */
export const FIGURES: Record<string, ConceptFigure> = {
	"geo-geographie": {
		title: "Ein Raum, viele Beziehungen",
		draw: tools.humanNature,
		alt: "Ein Fluss und Bäume stehen neben Häusern und einem Weg. Ein Mensch steht im Schatten; ein Pfeil verbindet Baum und bebauten Raum.",
		question: "Wo beeinflussen sich Natur und menschliche Nutzung?",
		caption:
			"Erfundener Schulort: Die Zeichnung zeigt Beziehungen, keine maßstäbliche Karte.",
		parts: [
			part(
				"Natur",
				"Bäume, Wasser und Gelände gehören zu den natürlichen Bedingungen eines Raums.",
			),
			part(
				"Nutzung",
				"Häuser und Wege zeigen, wie Menschen den Raum nutzen und verändern.",
			),
			part(
				"Zusammenwirken",
				"Ein Baum kann Schatten für Menschen spenden. Umgekehrt verändert Bebauung den Lebensraum von Pflanzen.",
			),
		],
	},
	"geo-medien": {
		title: "Drei Blicke auf die Erde",
		draw: tools.media,
		alt: "Ein Globus zeigt die Kugelgestalt. Eine gedachte Ansicht von oben enthält Dach und Baumkrone; eine Karte ersetzt sie durch Zeichen.",
		question: "Welche Darstellung hilft bei welcher Frage?",
		caption:
			"Die Ansicht von oben ist gezeichnet, kein echtes Luftbild. Der Globus zeigt nur schematische Landflächen.",
		parts: [
			part(
				"Globus",
				"Der Globus bewahrt die Kugelgestalt. Er hilft bei der Vorstellung von Lagebeziehungen auf der Erde.",
			),
			part(
				"Luftbild",
				"Ein echtes Luftbild zeigt sichtbare Einzelheiten von oben, zum Beispiel Dächer und Baumkronen.",
			),
			part(
				"Karte",
				"Eine Karte wählt Informationen aus. Eine Legende erklärt, was ihre Zeichen bedeuten.",
			),
		],
	},
	"geo-karten": {
		title: "Vom sichtbaren Detail zum Kartenzeichen",
		draw: tools.mapMaking,
		alt: "Dach, Baumkrone und ein kleiner Stein werden in einer vereinfachten Karte zu Schulzeichen und Baumzeichen; die Legende erklärt sie.",
		question: "Was bleibt erhalten, was wird weggelassen?",
		caption:
			"Erfundenes Beispiel. Die Karte vereinfacht Form und Auswahl; der kleine Stein wird nicht übernommen.",
		parts: [
			part(
				"Beobachten",
				"Du erkennst Dach, Baumkrone und kleine Einzelheiten. Nicht alles ist für die Kartenfrage gleich wichtig.",
			),
			part(
				"Auswählen",
				"Die Karte zeigt nur die ausgewählten Informationen. Sie ist keine verkleinerte Fotografie.",
			),
			part(
				"Legende lesen",
				"Farbe und Form allein reichen nicht: Erst die Legende erklärt hier Schule, Bäume und Weg.",
			),
		],
	},
	"geo-atlas": {
		title: "Drei Schritte zum gesuchten Ort",
		draw: tools.atlas,
		alt: "Ein erfundener Registereintrag Bergstadt verweist auf Seite 24, Feld C3. Im vier mal vier Felder großen Raster ist C3 markiert.",
		question: "Warum brauchst du sowohl Seitenzahl als auch Suchfeld?",
		caption:
			"Bergstadt und Seite 24 sind Übungsangaben. Suchfelder eines Atlas sind kein geographisches Gradnetz.",
		parts: [
			part(
				"1 · Register",
				"Suche den Ortsnamen im Register. Notiere Karten- oder Seitenangabe und das Suchfeld.",
			),
			part(
				"2 · Karte",
				"Öffne die angegebene Karte. Die Seitenzahl führt dich noch nicht an die genaue Stelle.",
			),
			part(
				"3 · Suchfeld",
				"C ist die dritte Spalte, 3 die dritte Zeile. Im markierten Feld suchst du den Ortsnamen.",
			),
		],
	},
	"geo-sonnensystem": {
		title: "Unser Platz im Sonnensystem",
		draw: earth.solarSystem,
		alt: "Von der Sonne nach außen folgen Merkur, Venus, Erde, Mars, Jupiter, Saturn, Uranus und Neptun. Die Erde ist der dritte Planet.",
		question: "Verfolge die Reihenfolge von der Sonne nach außen.",
		caption:
			"Größen, Abstände und Farben sind vereinfacht; die äußeren Planeten liegen in Wirklichkeit viel weiter auseinander.",
		parts: [
			part(
				"Sonne",
				"Die Sonne ist ein Stern. Sie gibt Licht und Wärme ab; Planeten leuchten nicht wie ein Stern aus eigener Kraft.",
			),
			part(
				"Vier innere Planeten",
				"Merkur, Venus, Erde und Mars sind Gesteinsplaneten. Die Erde steht von der Sonne aus an dritter Stelle.",
			),
			part(
				"Vier äußere Planeten",
				"Danach folgen Jupiter, Saturn, Uranus und Neptun. Die Zeichnung zeigt ihre Reihenfolge, keine messbaren Entfernungen.",
			),
		],
	},
	"geo-erdbewegungen": {
		title: "Zwei Bewegungen, zwei Erklärungen",
		draw: earth.movements,
		alt: "Links wird eine Hälfte der rotierenden Erde beleuchtet. Rechts umläuft die Erde die Sonne mit an beiden Positionen gleich gerichteter geneigter Achse.",
		question: "Welche Bewegung erklärt Tag und Nacht, welche die Jahreszeiten?",
		caption:
			"Schematisch und nicht maßstäblich. Die Erdachse behält beim Umlauf annähernd ihre Richtung im Raum.",
		parts: [
			part(
				"Drehung",
				"Die Erde dreht sich um ihre Achse. Ein Ort gelangt dadurch von der beleuchteten Tagseite auf die Nachtseite.",
			),
			part(
				"Umlauf und Neigung",
				"Die Erde umläuft die Sonne. Durch die geneigte Achse ändern sich Tageslänge und Sonnenstand: So entstehen Jahreszeiten, nicht durch wechselnde Sonnennähe.",
			),
		],
	},
	"geo-leben": {
		title: "Bedingungen wirken zusammen",
		draw: earth.life,
		alt: "Ein Wassertropfen, die Sonne und eine von einer Lufthülle umgebene Erde stehen für flüssiges Wasser, Energie und Atmosphäre.",
		question: "Warum reicht eine einzelne günstige Bedingung nicht aus?",
		caption:
			"Symbole für ausgewählte Bedingungen des Lebens auf der Erde; kein vollständiges Entstehungsmodell des Lebens.",
		parts: [
			part(
				"Wasser",
				"Flüssiges Wasser ist eine wichtige Lebensbedingung. Ob Wasser flüssig bleibt, hängt auch von Temperatur und Druck ab.",
			),
			part(
				"Energie",
				"Sonnenenergie treibt viele Vorgänge an. Entscheidend ist das Zusammenwirken der Bedingungen.",
			),
			part(
				"Atmosphäre",
				"Die Lufthülle beeinflusst Temperaturen und schützt vor einem Teil der Strahlung. Sie ist keine feste Schale.",
			),
		],
	},
	"geo-satelliten": {
		title: "Eine Mission braucht mehr als einen Start",
		draw: earth.satellites,
		alt: "Ein Satellit umkreist die Erde. Seine Bilder und Messdaten helfen beim Untersuchen; Trümmervermeidung und Missionsende gehören zur Planung.",
		question: "Was muss eine verantwortliche Mission von Anfang an planen?",
		caption:
			"Schematische Umlaufbahn; Satellit und Atmosphäre sind nicht im Größenverhältnis zur Erde dargestellt.",
		parts: [
			part(
				"Beobachten",
				"Ein Erdbeobachtungssatellit sammelt Bilder und Messdaten. Die Umlaufbahn bestimmt mit, was er beobachten kann.",
			),
			part(
				"Daten nutzen",
				"Erst eine passende Frage und Auswertung machen aus Messwerten brauchbare Informationen, etwa zu Wolken oder Landnutzung.",
			),
			part(
				"Verantwortung",
				"Weltraumschrott gefährdet Raumfahrzeuge. Trümmervermeidung und ein geeignetes Missionsende müssen mitgeplant werden.",
			),
		],
	},
	"geo-erdgeschichte": {
		title: "Eine alte Erde mit innerem Aufbau",
		draw: earth.earthHistory,
		alt: "Ein vereinfachter Schnitt zeigt Kruste, Mantel und Kern. Daneben stehen 46 Punkte für je 100 Millionen Jahre; der letzte Punkt ist hervorgehoben.",
		question: "Wie klein ist die Menschheitsgeschichte gegenüber dem Erdalter?",
		caption:
			"46 · 100 Millionen = 4,6 Milliarden Jahre. Schichtdicken sind nicht maßstäblich; der letzte Punkt umfasst viel mehr Zeit als die Menschheitsgeschichte.",
		parts: [
			part(
				"Schalenbau",
				"Die dünne Kruste liegt über dem Mantel und dem Kern. Ein räumlicher Schnitt erklärt den Aufbau, keine zeitliche Reihenfolge.",
			),
			part(
				"Erdalter",
				"Jeder Punkt steht für 100 Millionen Jahre. Alle 46 Punkte zusammen veranschaulichen ungefähr das Alter der Erde.",
			),
			part(
				"Menschen",
				"Die Menschheitsgeschichte liegt am äußersten Ende dieser langen Zeit. Sie beansprucht nur einen winzigen Bruchteil des letzten Punktes.",
			),
		],
	},
	"geo-weltkarte": {
		title: "Von der Kugel auf die Fläche",
		draw: tools.worldViews,
		alt: "Ein Globus wird einer rechteckigen Weltkarte gegenübergestellt. Die oberen und unteren Kartenränder sind hervorgehoben.",
		question:
			"Warum kann eine flache Weltkarte nicht alle Eigenschaften bewahren?",
		caption:
			"Landformen sind frei gezeichnet. Diese Skizze zeigt die Idee der Abbildung, keine genaue Kartenprojektion.",
		parts: [
			part(
				"Kugel",
				"Auf dem Globus bleibt die Kugelgestalt erhalten. Du kannst nicht gleichzeitig die gesamte Oberfläche sehen.",
			),
			part(
				"Fläche",
				"Eine Weltkarte macht sehr viele Orte gleichzeitig sichtbar. Bei der Übertragung auf die Ebene entstehen Verzerrungen.",
			),
			part(
				"Grenzen",
				"Je nach Projektion werden Flächen, Formen oder Entfernungen verzerrt. Prüfe im Kartenmodell besonders die Polgebiete.",
			),
		],
	},
	"geo-gradnetz": {
		title: "Zwei Angaben bestimmen einen Ort",
		draw: tools.grid,
		alt: "Ein Globus zeigt Äquator und einen Längenkreis. Eine Koordinatenkarte nennt für München gerundet 48 Grad Nord und 11,5 Grad Ost.",
		question: "Von welcher Ausgangslinie zählt jede Angabe?",
		caption:
			"Das Gradnetz ist schematisch. Die Ortsangabe ist gerundet und wird nicht als Punkt auf diesem Symbolglobus eingezeichnet.",
		parts: [
			part(
				"Breite",
				"Die geographische Breite zählt vom Äquator nach Norden oder Süden. Der Äquator hat die Breite 0°.",
			),
			part(
				"Länge",
				"Die geographische Länge zählt vom Nullmeridian nach Osten oder Westen. Sie braucht ebenfalls eine Richtung.",
			),
			part(
				"Zusammen lesen",
				"48° N und 11,5° O beschreiben ungefähr München. Erst beide Angaben gemeinsam grenzen die Lage ein.",
			),
		],
	},
	"geo-massstab": {
		title: "Von der Kartenstrecke zur echten Strecke",
		draw: tools.scale,
		alt: "Bei einem Maßstab von eins zu 50000 entspricht ein Zentimeter auf der Karte 500 Metern in der Wirklichkeit.",
		question: "Welche Einheit musst du vor dem Ergebnis umrechnen?",
		caption:
			"Die Bildschirmstrecke ist kein Zentimetermaß. Das Beispiel bezieht sich auf eine gemessene, unveränderte Papierkarte.",
		parts: [
			part(
				"Karte",
				"1 : 50 000 bedeutet: 1 cm auf der Karte entspricht 50 000 cm in der Wirklichkeit.",
			),
			part(
				"Wirklichkeit",
				"50 000 cm sind 500 m. Multipliziere zuerst mit der Maßstabszahl und rechne dann die Einheit um.",
			),
			part(
				"Vergleichen",
				"Die beiden Linien stehen für dieselbe Strecke. Ihre gezeichneten Längen auf deinem Bildschirm sind nur Symbole.",
			),
		],
	},
	"geo-orientierung": {
		title: "Lagebeziehungen statt bloßer Ortsnamen",
		draw: tools.orientation,
		alt: "Auf einer erfundenen nordorientierten Skizze liegt die Schule südlich des Bahnhofs und westlich des Parks. Eine Windrose zeigt Nord, Ost, Süd und West.",
		question: "Wo liegt die Schule vom Park aus gesehen?",
		caption:
			"Erfundene, nordorientierte Ortsskizze ohne Entfernungsmaßstab. Lage und Weglänge sind verschiedene Informationen.",
		parts: [
			part(
				"Orte",
				"Die Schule liegt südlich des Bahnhofs. Bei einer relativen Lageangabe musst du den Bezugspunkt nennen.",
			),
			part(
				"Beziehungen",
				"Der Park liegt östlich der Schule; vom Park aus liegt die Schule im Westen. Wechsle bewusst den Blickpunkt.",
			),
			part(
				"Windrose",
				"Oben ist hier Norden, rechts Osten. Bei anderen Karten prüfst du zuerst, wie sie ausgerichtet sind.",
			),
		],
	},
	"geo-forschungsreisen": {
		title: "Reisen mit denselben Fragen vergleichen",
		draw: tools.journeys,
		alt: "Ein Segelschiff steht einer heutigen polaren Forschungsstation gegenüber. Zwischen beiden liegt ein Vergleichszeichen.",
		question: "Wie unterscheiden sich Ziele, Hilfsmittel und Folgen?",
		caption:
			"Symbolische Beispiele, keine Rekonstruktion einer bestimmten Reise. Historische und heutige Reisen sind vielfältiger.",
		parts: [
			part(
				"Früher",
				"Prüfe an einer konkreten Reise Ziele, technische Mittel, Risiken und Folgen für betroffene Menschen. Eine Reiseroute allein erklärt sie nicht.",
			),
			part(
				"Heute",
				"Heutige Forschung kann Satellitendaten und moderne Messtechnik nutzen. Auch sie braucht Planung und Verantwortung.",
			),
			part(
				"Fair vergleichen",
				"Stelle beiden Beispielen dieselben Fragen. Mehr Technik allein sagt noch nichts über Absichten oder Folgen aus.",
			),
		],
	},
	"geo-lebensraeume": {
		title: "Unterschiedliche Bedingungen, vielfältige Lösungen",
		draw: tools.environments,
		alt: "Zwei Beispielorte zeigen Wohnhäuser im polaren Raum und in einer heißen Wüste. Kleidung und Schatten sind mögliche Anpassungen.",
		question: "Welche Bedingungen beeinflussen Wohnen und Alltag?",
		caption:
			"Erfundene Beispiele. Menschen leben auch in Polar- und Wüstenräumen auf vielfältige, moderne Weise; die Bilder stehen nicht für alle Bewohner.",
		parts: [
			part(
				"Polarer Raum",
				"Kälte und jahreszeitliche Lichtverhältnisse beeinflussen den Alltag. Vergleiche konkrete Orte und Jahreszeiten statt ein einheitliches Leben zu behaupten.",
			),
			part(
				"Heißer Wüstenraum",
				"Hitze, Trockenheit und Wasserverfügbarkeit sind wichtige Bedingungen. Schatten und angepasste Gebäude sind mögliche Antworten.",
			),
			part(
				"Menschen handeln",
				"Technik, Versorgung und gesellschaftliche Bedingungen spielen ebenfalls eine Rolle. Die Umwelt bestimmt nicht allein, wie Menschen leben.",
			),
		],
	},
	"geo-platten": {
		title: "Drei Arten von Plattenbewegung",
		draw: earth.plates,
		alt: "Pfeile zeigen Platten, die sich auseinander, aufeinander zu oder aneinander vorbei bewegen. In der Mitte ist eine Gebirgsbildung schematisch angedeutet.",
		question: "Welche Richtung zeigen die Pfeile an jeder Grenze?",
		caption:
			"Stark vereinfachte Ausschnitte. Plattenbewegungen sind langsam; die Skizzen zeigen nicht alle möglichen Vorgänge an Plattengrenzen.",
		parts: [
			part(
				"Auseinander",
				"Wo Platten auseinanderweichen, kann Magma aufsteigen und neue Kruste entstehen.",
			),
			part(
				"Aufeinander zu",
				"Beim Zusammenstoßen können Gebirge entstehen. Wo eine Platte abtaucht, sind andere Vorgänge möglich; nicht jede Kollision sieht gleich aus.",
			),
			part(
				"Aneinander vorbei",
				"Platten können sich seitlich gegeneinander verschieben. Verhakungen und plötzliches Lösen können Erdbeben auslösen.",
			),
		],
	},
	"geo-gesteine": {
		title: "Gesteine können sich verändern",
		draw: earth.rocks,
		alt: "Ein möglicher Weg führt von erstarrtem Magma über Verwitterung, Transport und Ablagerung zu Sedimentgestein und durch Druck und Wärme zu umgewandeltem Gestein.",
		question: "Welche Prozesse verändern das Material zwischen den Stationen?",
		caption:
			"Ein möglicher Weg, keine Pflichtreihenfolge. Sedimente werden verfestigt; Aufschmelzen und erneutes Erstarren eröffnen weitere Wege im Kreislauf.",
		parts: [
			part(
				"Erstarrung",
				"Magma oder Lava kühlt ab und erstarrt zu magmatischem Gestein.",
			),
			part(
				"Ablagerung",
				"Gestein verwittert. Material wird abgetragen, transportiert und abgelagert. Erst durch Verfestigung entsteht daraus Sedimentgestein.",
			),
			part(
				"Umwandlung",
				"Druck und Wärme können vorhandenes Gestein umwandeln, ohne dass es dabei vollständig schmilzt. Beim Aufschmelzen entsteht dagegen wieder Magma.",
			),
		],
	},
	"geo-abtragung": {
		title: "Vom Fels zum abgelagerten Material",
		draw: earth.erosion,
		alt: "Ein rissiger Fels, ein Fluss mit bewegtem Stein und abgelagerte Körner zeigen Verwitterung, Transport und Ablagerung.",
		question: "Was geschieht mit dem Material an jeder Station?",
		caption:
			"Schematische Prozessfolge. Verwitterung, Abtragung, Transport und Ablagerung können gleichzeitig an verschiedenen Stellen stattfinden.",
		parts: [
			part(
				"Verwitterung",
				"Gestein zerfällt oder verändert sich an Ort und Stelle, zum Beispiel durch Frost oder chemische Vorgänge.",
			),
			part(
				"Abtragung und Transport",
				"Wasser, Wind oder Eis können lockeres Material aufnehmen und bewegen. Verwitterung allein ist noch kein Transport.",
			),
			part(
				"Ablagerung",
				"Wenn die Transportkraft nachlässt, kann Material liegen bleiben. So verändert sich die Form der Landschaft.",
			),
		],
	},
	"geo-naturrisiken": {
		title: "Naturprozess, Nutzung und Vorsorge",
		draw: earth.risks,
		alt: "Neben einem Vulkan stehen Häuser. Ein Pfeil zeigt einen gedachten Weg aus dem gefährdeten Bereich; Warnung und Vorsorge ergänzen die Darstellung.",
		question: "Warum hängt ein Risiko auch von der Nutzung des Raums ab?",
		caption:
			"Erfundener Ort und symbolischer Weg, keine reale Gefahrenkarte oder Verhaltensempfehlung für einen Ausbruch.",
		parts: [
			part(
				"Naturprozess",
				"Vulkanismus gehört zu den natürlichen Vorgängen. Stärke, Ort und Zeitpunkt bestimmen die mögliche Gefährdung mit.",
			),
			part(
				"Nutzung",
				"Wo Menschen, Gebäude und wichtige Einrichtungen betroffen sein können, können Schäden entstehen.",
			),
			part(
				"Vorsorge",
				"Überwachung, Raumplanung und behördlich geplante Warn- und Evakuierungswege können Risiken vermindern. Schutz ist keine Garantie.",
			),
		],
	},
	"geo-umwelt": {
		title: "Eine Fläche, verschiedene Ansprüche",
		draw: places.landUse,
		alt: "Wald und Feld liegen neben Wohnhaus, Betrieb und Straße. Ein begrünter Streifen begleitet einen Fluss.",
		question: "Welche Vorteile und Nachteile hat eine neue Nutzung?",
		caption:
			"Erfundener Raum. Die Zeichnung ordnet Nutzungskonflikte und liefert keine fertige Standortentscheidung.",
		parts: [
			part(
				"Natur und Landwirtschaft",
				"Boden, Vegetation und Wasser bieten Lebensräume und ermöglichen landwirtschaftliche Nutzung.",
			),
			part(
				"Bauen und Verkehr",
				"Wohnungen, Arbeitsplätze und Wege brauchen Raum. Versiegelung kann Versickerung und Lebensräume beeinträchtigen.",
			),
			part(
				"Abwägen",
				"Ein begrünter Uferstreifen kann Raum für Natur schaffen. Vergleiche Interessen, Belege und mögliche Folgen am konkreten Ort.",
			),
		],
	},
	"geo-deutschland": {
		title: "Staat, Bundesland und Hauptstadt",
		draw: places.germany,
		alt: "Eine verschachtelte Übersicht zeigt Deutschland mit 16 Bundesländern, darin Bayern und darin München. Berlin hat eine eigene Markierung.",
		question: "Welche Funktion haben Berlin und München?",
		caption:
			"Gliederungsschema, keine Grenzkarte. Bayern ist eines der 16 Bundesländer; die anderen 15 sind nicht einzeln gezeichnet.",
		parts: [
			part(
				"Deutschland",
				"Deutschland besteht aus 16 Bundesländern. Berlin ist Bundeshauptstadt und zugleich ein eigenes Bundesland.",
			),
			part(
				"Bayern",
				"Bayern ist ein Bundesland im Südosten Deutschlands. Für seine genaue Lage und Grenzen nutzt du die Karte weiter unten.",
			),
			part(
				"München",
				"München ist eine Stadt innerhalb Bayerns und dessen Landeshauptstadt. Stadt und Bundesland sind unterschiedliche Ebenen.",
			),
		],
	},
	"geo-bayern": {
		title: "Verwaltung und Flüsse getrennt lesen",
		draw: places.bavaria,
		alt: "Sieben Kacheln stehen für Regierungsbezirke. Daneben liegen Würzburg am Main und Regensburg an der Donau in zwei getrennten Flussschemata.",
		question: "Warum ersetzt eine Flusskarte keine Verwaltungskarte?",
		caption:
			"Zwei getrennte Ordnungsschemata ohne Grenzverläufe. Die sieben Kacheln sind keine räumliche Anordnung der Bezirke; Flussläufe sind stark verkürzt.",
		parts: [
			part(
				"Verwaltung",
				"Bayern hat sieben Regierungsbezirke. Jeder besitzt einen Regierungssitz; die größte Stadt muss nicht dieser Sitz sein.",
			),
			part(
				"Donau",
				"Regensburg liegt an der Donau. Die Donau durchquert Bayern überwiegend von Westen nach Osten.",
			),
			part(
				"Main",
				"Würzburg liegt am Main. Der Main gehört zum Flusssystem des Rheins und entwässert zur Nordsee.",
			),
		],
	},
	"geo-grosslandschaften": {
		title: "Von Norden nach Süden durch vier Landschaftsräume",
		draw: places.relief,
		alt: "Die Abfolge von Nord nach Süd lautet Tiefland mit Hamburg, Mittelgebirge mit Harz, Alpenvorland mit München und Alpen mit Zugspitze. Das Gelände enthält Hügel und Täler.",
		question: "Warum ist diese Abfolge keine gleichmäßig ansteigende Rampe?",
		caption:
			"Schematische Raumfolge, kein vermessenes Profil durch diese vier Orte. Breiten und Höhen sind nicht maßstäblich.",
		parts: [
			part(
				"Tiefland",
				"Im Norden liegt das Norddeutsche Tiefland. Auch dort gibt es Hügel und Täler.",
			),
			part(
				"Mittelgebirge",
				"Das Mittelgebirgsland enthält Gebirge, Becken und Täler. Der Harz ist ein Beispiel.",
			),
			part(
				"Alpenvorland",
				"München liegt im Alpenvorland nördlich der Alpen. Teile wurden von Gletschern und Schmelzwasser geprägt.",
			),
			part(
				"Alpen",
				"Die Alpen bilden den Hochgebirgsraum im Süden Deutschlands. Dort liegt die Zugspitze.",
			),
		],
	},
	"geo-themenkarten": {
		title: "Gleicher Raum, unterschiedliche Themen",
		draw: places.thematic,
		alt: "Zwei gleich große erfundene Kartenausschnitte zeigen links violette Siedlungspunkte und rechts gelbe landwirtschaftliche Flächen.",
		question: "Was musst du prüfen, bevor du die Muster vergleichst?",
		caption:
			"Frei erfundene Verteilung ohne Messwerte. Violett steht hier für Siedlung, Gelb für Landwirtschaft; dies ist keine aktuelle Deutschlandstatistik.",
		parts: [
			part(
				"Siedlung",
				"Lies zuerst Titel, Raum, Datum, Legende und Maßstab dieser Karte. Was genau stellen die Punkte dar?",
			),
			part(
				"Landwirtschaft",
				"Lies die zweite Karte ebenso sorgfältig. Dieselbe Farbe könnte in einer anderen Legende etwas anderes bedeuten.",
			),
			part(
				"Vergleich",
				"Vergleiche erst dann räumliche Muster. Räumliche Nähe kann eine Frage begründen, beweist aber noch keinen Ursache-Wirkungs-Zusammenhang.",
			),
		],
	},
	"geo-schutzgebiete": {
		title: "Zwei schutzwürdige Landschaften",
		draw: places.protectedPlaces,
		alt: "Links stehen Bäume vor einem Mittelgebirge für den Bayerischen Wald. Rechts wechseln Wasserflächen und freiliegendes Watt im Wattenmeer.",
		question: "Warum können Schutzgründe und örtliche Regeln verschieden sein?",
		caption:
			"Symbolischer Landschaftsvergleich, keine Karte von Schutzgebietsgrenzen. Konkrete Regeln liest du bei der zuständigen Stelle nach.",
		parts: [
			part(
				"Bayerischer Wald",
				"Der Bayerische Wald liegt im Osten Bayerns. Wälder und Mittelgebirgslandschaft bieten unterschiedliche Lebensräume.",
			),
			part(
				"Wattenmeer",
				"An der Nordseeküste prägen Ebbe und Flut den Lebensraum. Wasser und zeitweise freiliegender Meeresboden wechseln sich ab.",
			),
			part(
				"Schutz begründen",
				"Verbinde Lage, Lebensraum und Schutzgrund. Erfinde keine für alle Schutzgebiete gleichen Regeln.",
			),
		],
	},
	"geo-stadt": {
		title: "Schulort und Umland sind verbunden",
		draw: places.town,
		alt: "Ein alter Ortskern ist von neueren Gebäuden umgeben. Zwei entgegengesetzte Pfeile verbinden einen Umlandort mit dem Zentrum.",
		question: "Welche Wege verbinden deinen Schulort mit anderen Orten?",
		caption:
			"Erfundener Schulort und typisiertes Grundmuster. Gebäudeformen beweisen ihre heutige Nutzung nicht.",
		parts: [
			part(
				"Alter Kern",
				"Ein alter Markt oder Reste einer Stadtmauer können frühere Strukturen zeigen. Prüfe die Hinweise am wirklichen Ort.",
			),
			part(
				"Heutige Funktionen",
				"Bildung, Wohnen, Versorgung und Arbeit können in verschiedenen Stadtteilen liegen. Ihre Lage musst du beobachten oder belegen.",
			),
			part(
				"Stadt und Umland",
				"Menschen fahren zur Schule, zur Arbeit oder zum Einkaufen und wieder zurück. Solche Wege schaffen Verflechtungen, ohne dass jemand umzieht.",
			),
		],
	},
	"geo-exkursion": {
		title: "Aus einer Route wird eine Untersuchung",
		draw: places.excursion,
		alt: "Eine Route verbindet drei nummerierte Haltepunkte. Ein Notizbuch steht für Beobachtungen, eine Lupe für die anschließende Auswertung.",
		question:
			"Was macht aus einem Spaziergang eine geographische Untersuchung?",
		caption:
			"Erfundene Route. Die reale Exkursion und Präsentation finden begleitet im Unterricht statt; die App liefert die Vorbereitung.",
		parts: [
			part(
				"Planen",
				"Lege eine Frage, Route, Haltepunkte, Zuständigkeiten und sichere Durchführung mit der Lehrkraft fest.",
			),
			part(
				"Beobachten",
				"Nutze passende Beobachtungskriterien. Notiere auch Ort, Zeitpunkt und Bedingungen, damit Beobachtungen vergleichbar werden.",
			),
			part(
				"Auswerten",
				"Ordne die Ergebnisse, prüfe deine Frage und präsentiere Belege. Ein ausgefülltes Formular bestätigt noch keine richtige fachliche Deutung.",
			),
		],
	},
	"geo-lebensqualitaet": {
		title: "Ein guter Weg aus mehreren Perspektiven",
		draw: places.qualityOfLife,
		alt: "Ein Baum spendet Schatten, eine Bank bietet eine Pause, und ein Mensch im Rollstuhl steht für die Frage nach stufenlosen Zugängen.",
		question: "Für wen verbessert eine Maßnahme den Weg?",
		caption:
			"Erfundene Situation. Ein Rampensymbol bestätigt keine tatsächliche Barrierefreiheit; Zugänge und Querungen müssen geprüft werden.",
		parts: [
			part(
				"Schatten",
				"Für Menschen zu Fuß kann Schatten an heißen Tagen wichtig sein. Prüfe den Ort und die Tageszeit.",
			),
			part(
				"Pause",
				"Eine Bank kann eine Pause ermöglichen. Sie braucht einen sinnvollen Standort und darf den Gehweg nicht versperren.",
			),
			part(
				"Zugang",
				"Stufenlosigkeit ist eine wichtige Frage, aber nicht die einzige. Für eine Empfehlung brauchst du verlässliche Angaben zum tatsächlichen Weg.",
			),
		],
	},
	"geo-aktuelle-frage": {
		title: "Drei Fragen geben der Recherche eine Richtung",
		draw: tools.inquiry,
		alt: "Ein Globus fragt nach Ort und Zeit, ein Notizbuch nach der Veränderung, zwei Menschen nach den Betroffenen eines Ereignisses.",
		question: "Wie wird aus einer Nachricht eine geographische Frage?",
		caption:
			"Ein Untersuchungsschema ohne erfundenes aktuelles Ereignis. Dein reales Ereignis recherchierst du mit datierten Quellen.",
		parts: [
			part(
				"Ort und Zeit",
				"Verorte das konkrete Ereignis und notiere sein Datum. Veröffentlichungsdatum und Ereignisdatum können verschieden sein.",
			),
			part(
				"Veränderung",
				"Frage, was sich im Raum verändert und welche Ursachen oder Folgen du untersuchen willst.",
			),
			part(
				"Betroffene",
				"Ermittle, welche Menschen, Nutzungen oder Lebensräume betroffen sind. Unterscheide Beobachtungen von Vermutungen.",
			),
		],
	},
	"geo-quellen": {
		title: "Belege miteinander prüfen",
		draw: tools.sources,
		alt: "Eine Fachquelle und ein Medienbericht werden unter einer Lupe verglichen. Die beiden Quellen müssen zur selben Untersuchungsfrage passen.",
		question: "Wo stimmen Quellen überein, wo unterscheiden sie sich?",
		caption:
			"Symbole für Quellenarbeit. Ein bestimmter Quellentyp ist nicht automatisch richtig; Karten prüfst du mit denselben Fragen zusätzlich.",
		parts: [
			part(
				"Fachquelle",
				"Prüfe Urheber, Datum, räumlichen Bezug und Datengrundlage. Eine Fachquelle muss tatsächlich zu deiner Frage passen.",
			),
			part(
				"Nachricht",
				"Prüfe auch beim Medienbericht Herkunft, Datum, Belege und mögliche Verkürzungen. Eine Überschrift ersetzt den Inhalt nicht.",
			),
			part(
				"Abgleichen",
				"Vergleiche konkrete Aussagen mit Fachquelle und Karte. Notiere Unterschiede und offene Fragen statt sie zu übergehen.",
			),
		],
	},
	"geo-urteil": {
		title: "Vom Beleg zum begründeten Urteil",
		draw: tools.judgement,
		alt: "Ein Notizbuch steht für Belege, eine Waage für das Abwägen von Kriterien und eine Tafel für das Erklären eines Urteils.",
		question:
			"Welche Belege tragen dein Urteil, welche Unsicherheiten bleiben?",
		caption:
			"Die Waage ist ein Bild für begründetes Abwägen, keine Berechnung. Präsentation und Rückfragen finden im Unterricht statt.",
		parts: [
			part(
				"Belegen",
				"Benenne deine Frage und passende Belege. Trenne beobachtete Tatsachen von Vermutungen.",
			),
			part(
				"Abwägen",
				"Erkläre die Kriterien und betrachte verschiedene Perspektiven. Nicht jedes Interesse hat dieselben Folgen.",
			),
			part(
				"Erklären",
				"Formuliere dein Urteil mit Begründung und Unsicherheiten. Zeige bei der Präsentation, welche Belege deine Aussage stützen.",
			),
		],
	},
};

export function renderFigure(lessonId: string, requestedFocus = 0): string {
	const figure = Object.hasOwn(FIGURES, lessonId)
		? FIGURES[lessonId]
		: undefined;
	if (!figure) return "";
	const focus =
		Number.isInteger(requestedFocus) &&
		requestedFocus >= 0 &&
		requestedFocus <= figure.parts.length
			? requestedFocus
			: 0;
	const titleId = `${lessonId}-figure-title`,
		descriptionId = `${lessonId}-figure-description`;
	const drawing = figure
		.draw()
		.replace(
			/class="visual-part" data-part="(\d+)"/g,
			(_match, partIndex: string) =>
				`class="visual-part${focus && Number(partIndex) !== focus ? " is-muted" : ""}" data-part="${partIndex}"`,
		);
	return `<figure class="concept-figure" data-figure="${esc(lessonId)}" data-focus="${focus}">
    <figcaption><span class="eyebrow">IM BILD VERSTEHEN</span><h2 id="${titleId}">${esc(figure.title)}</h2><p class="figure-question">${esc(figure.question)}</p></figcaption>
    <div class="figure-scroll" tabindex="0" role="region" aria-label="${esc(figure.title)} · bei Bedarf seitlich verschieben"><svg class="concept-svg" viewBox="0 0 600 270" role="img" aria-labelledby="${titleId} ${descriptionId}"><desc id="${descriptionId}">${esc(figure.alt)}</desc>${drawing}</svg></div>
    <p class="figure-pan-hint small">Die Grafik kannst du seitlich verschieben.</p>
    <div class="figure-controls" role="group" aria-label="Bildteile hervorheben"><button type="button" data-figure-focus="0" aria-pressed="${focus === 0}">Alles ansehen</button>${figure.parts.map((entry, i) => `<button type="button" data-figure-focus="${i + 1}" aria-pressed="${focus === i + 1}"><span aria-hidden="true">${i + 1}</span>${esc(entry.label)}</button>`).join("")}</div>
    <p class="figure-note" role="status" aria-live="polite">${focus ? `<strong>${esc(figure.parts[focus - 1].label)}:</strong> ${esc(figure.parts[focus - 1].note)}` : "Wähle einen Bildteil und entdecke den Zusammenhang. Mit „Alles ansehen“ hebst du alle Bildteile wieder hervor."}</p>
    <p class="figure-caption">${esc(figure.caption)}</p>
  </figure>`;
}

export function renderStageArt(lb: number): string {
	const draw = [
		tools.media,
		earth.solarSystem,
		tools.orientation,
		earth.plates,
		places.relief,
		places.town,
		tools.inquiry,
	][lb - 1];
	return draw
		? `<div class="stage-art" aria-hidden="true"><svg viewBox="0 0 600 270" focusable="false">${draw()}</svg></div>`
		: "";
}
export const renderHeroArt = (): string =>
	`<svg class="hero-art" viewBox="0 0 600 270" aria-hidden="true" focusable="false">${places.explorer()}</svg>`;
