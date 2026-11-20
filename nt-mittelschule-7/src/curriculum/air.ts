import { inspection, labs, magnesiumFormula } from "../lab/definitions";
import { makeStage } from "./helpers";

export const AIR = makeStage(
	{
		id: "luft-reaktionen",
		stageNumber: 2,
		title: "Luft und Oxidation",
		subtitle:
			"Gasgemische untersuchen, Verbrennung erklären und Rost verhindern",
		icon: "🌬️",
		accent: "#2463af",
		badgeTitle: "Luft und Oxidation",
		lehrplanLabel: "NT7 · 2.1 Zusammensetzung und Bedeutung der Luft",
	},
	"2.1",
	2,
	[
		{
			id: "luft",
			title: "Was in der Luft steckt",
			subtitle: "Lies Gasanteile und erkläre, warum Luft ein Gemisch ist.",
			text: [
				"Saubere Luft ist durchsichtig und hat keinen eigenen Geruch. Sie hat Masse, nimmt Raum ein und lässt sich zusammendrücken. Trockene Luft enthält dem Volumen nach etwa 78 % Stickstoff (N₂), 21 % Sauerstoff (O₂) und rund 1 % weitere Gase. Im Rest steckt vor allem Argon (Ar), daneben kommen zum Beispiel Kohlenstoffdioxid (CO₂) und andere Edelgase vor. Feuchte Luft enthält zusätzlich eine wechselnde Menge Wasserdampf.",
				"In 100 L trockener Luft stecken rund 78 L Stickstoff und 21 L Sauerstoff, wenn du die Teilvolumina bei gleichem Druck und gleicher Temperatur vergleichst. Im Teilchenbild bewegen sich verschiedene Teilchenarten durcheinander. Die Teilchen behalten ihre Stoffart.",
			],
			rule: "Luft ist ein Gasgemisch. Stickstoff nimmt rund vier Fünftel und Sauerstoff rund ein Fünftel ihres trockenen Volumens ein.",
			quiz: [
				"Welcher Stoff nimmt in trockener Luft am meisten Raum ein?",
				"Stickstoff",
				"Sauerstoff",
				"Argon",
				"Rund 78 % des trockenen Luftvolumens sind Stickstoff.",
			],
			practice: [
				[
					[
						"Welches Symbol gehört zu Sauerstoff in der Luft?",
						"O₂",
						"N₂",
						"CO₂",
						"Ein Sauerstoffmolekül besteht aus zwei O-Atomen.",
					],
					[
						"Ein Schulmodell zeigt nur O₂-Teilchen. Was fehlt, damit es Luft darstellt?",
						"Vor allem N₂ sowie kleine Anteile anderer Gase.",
						"Weitere O₂-Teilchen.",
						"Ein einziges festes Kohlenstoffstück.",
						"Ein Gasgemisch enthält mehrere Teilchenarten.",
					],
				],
				[
					[
						"Wie viel Sauerstoff steckt ungefähr in 100 L trockener Luft?",
						"21 L",
						"78 L",
						"1 L",
						"Sauerstoff macht ungefähr 21 Volumenprozent aus.",
						[21, "L", 0],
					],
					[
						"Wie viel Sauerstoff steckt ungefähr in 200 L trockener Luft?",
						"42 L",
						"21 L",
						"156 L",
						"Verdoppelt sich das Gesamtvolumen unter gleichen Bedingungen, verdoppelt sich auch das Teilvolumen.",
						[42, "L", 0],
					],
				],
				[
					[
						"Welches Gas stellt den größten Teil der übrigen Gase der trockenen Luft?",
						"Argon",
						"Kohlenstoffdioxid",
						"Helium",
						"Von den knapp 1 % Restgasen ist Argon der Hauptbestandteil.",
					],
					[
						"Warum kann feuchte Außenluft von der Tabelle für trockene Luft abweichen?",
						"Wasserdampf kommt in wechselnder Menge dazu.",
						"Sauerstoff wandelt sich bei Feuchte in Stickstoff um.",
						"Argon wird bei Feuchte zum häufigsten Gas.",
						"Die Trockenluft-Tabelle lässt Wasserdampf absichtlich weg.",
					],
				],
			],
			lab: labs.air,
		},
		{
			id: "luftdruck",
			title: "Luft hat Gewicht",
			subtitle: "Verbinde Luftsäule, Teilchenbewegung und Luftdruck.",
			text: [
				"Luftteilchen bewegen sich dauernd. Stoßen sie gegen eine Oberfläche, üben sie Druck aus. Die Luft über dir hat Gewicht. Nahe am Boden lastet eine höhere Luftsäule auf der unteren Luft als hoch am Berg. Dadurch ist bodennahe Luft im Allgemeinen dichter und der Druck höher. Der Luftdruck wird oft in Hektopascal (hPa) angegeben.",
				"Eine Luftprobe am Berg und eine gleich große am Meer können unterschiedlich viele Teilchen enthalten. In der weniger dichten Bergluft stoßen bei gleicher Temperatur weniger Teilchen pro Zeit gegen die Wand. Die Modellwerte gelten für Standardbedingungen. Das Wetter verändert die tatsächlichen Messwerte.",
			],
			rule: "Je höher du kommst, desto weniger Luft lastet über dir und desto geringer ist meist der Luftdruck.",
			quiz: [
				"Was übt im Modell Druck auf eine Wand aus?",
				"Stöße bewegter Luftteilchen",
				"Die Farbe der Luft",
				"Nur stehende Luftteilchen",
				"Bei einem Stoß gibt das Teilchen einen Impuls an die Wand ab.",
			],
			practice: [
				[
					[
						"Wo ist der Luftdruck im Höhenvergleich größer?",
						"Am Meer",
						"Auf dem Berggipfel",
						"An beiden Orten immer gleich",
						"Über dem niedriger gelegenen Ort liegt mehr Luft.",
					],
					[
						"Eine Flasche wird am Berg verschlossen und im Tal eingedrückt. Was erklärt das?",
						"Der höhere Außendruck im Tal drückt die Flasche ein.",
						"Der Luftdruck ist im Tal niedriger.",
						"Die Masse der verschlossenen Luft ist im Tal verschwunden.",
						"Der Druck im Tal kann größer sein als der Druck in der Flasche.",
					],
				],
				[
					[
						"In welcher Einheit ist Luftdruck im Modell angegeben?",
						"hPa",
						"°C",
						"g",
						"Hektopascal ist eine Druckeinheit.",
					],
					[
						"Zwei Stationen melden 1013 hPa und 701 hPa. Welcher Wert passt bei Standardbedingungen zum höheren Ort?",
						"701 hPa",
						"1013 hPa",
						"Beide passen gleich gut.",
						"Mit der Höhe nimmt die Luftmasse über der Station ab.",
					],
				],
				[
					[
						"Was trägt zur Verdichtung der unteren Luft bei?",
						"Das Gewicht der Luft darüber",
						"Der hohe Glasanteil in der Luft",
						"Ein überall gleicher Druck",
						"Die Luftsäule übt mit ihrem Gewicht Druck aus.",
					],
					[
						"Warum kann die Wetterstation auf dem gleichen Berg morgen einen anderen Wert melden?",
						"Wetter und Temperatur beeinflussen die Luftverteilung.",
						"Die Bergeshöhe ändert sich zwangsläufig.",
						"Die Einheit hPa ändert ihre Größe.",
						"Das Höhenmodell verwendet feste Standardbedingungen.",
					],
				],
			],
			lab: labs.pressure,
		},
		{
			id: "zeichensprache",
			title: "Die Sprache der Formeln",
			subtitle: "Unterscheide Atome, Moleküle, Elemente und Verbindungen.",
			text: [
				"Ein Elementsymbol benennt eine Atomsorte. Der erste Buchstabe ist groß, ein zweiter ist klein. Beispiele sind C für Kohlenstoff, S für Schwefel, Fe für Eisen und He, Ne, Ar, Kr für die Edelgase Helium, Neon, Argon und Krypton. Ein Molekül besteht aus verbundenen Atomen. Die tiefgestellte Zahl gilt für das Symbol direkt davor. Bei einer Eins steht keine Zahl.",
				"N₂ und O₂ sind Moleküle von Elementen, denn sie bestehen jeweils aus einer Atomsorte. H₂O, CO₂ und SO₂ enthalten mehrere Atomsorten und sind Verbindungen. Ein H₂O-Molekül hat zwei H-Atome und ein O-Atom. Argon kommt in der Luft als einzelne Ar-Atome vor.",
			],
			rule: "Ein Element besteht aus einer Atomsorte. In einer Verbindung sind verschiedene Atomsorten in einem bestimmten Verhältnis verbunden.",
			quiz: [
				"Was steckt in einem CO₂-Molekül?",
				"Ein C-Atom und zwei O-Atome",
				"Zwei C-Atome und ein O-Atom",
				"Je zwei C- und O-Atome",
				"Die tiefgestellte 2 steht direkt hinter O.",
			],
			practice: [
				[
					[
						"Was steht in der Formel H₂O zweimal?",
						"H",
						"O",
						"H und O",
						"Die tiefgestellte Zahl gehört nur zum H.",
					],
					[
						"Ein Teilchenbild zeigt zwei O-Kugeln, die zusammengehören. Was stellt es dar?",
						"Ein Molekül eines Elements",
						"Ein Molekül einer Verbindung aus zwei Atomsorten",
						"Ein Gemisch aus zwei Gasen",
						"Ein Teilchen mit nur O enthält nur eine Atomsorte.",
					],
				],
				[
					[
						"Welches Symbol steht für Eisen?",
						"Fe",
						"F",
						"Es",
						"Fe ist das Elementsymbol für Eisen. F steht für Fluor.",
					],
					[
						"Was unterscheidet ein He-Teilchen von N₂?",
						"He ist ein einzelnes Atom. N₂ ist ein Molekül aus zwei Atomen.",
						"He enthält zwei Atome und N₂ eines.",
						"He und N₂ enthalten beide zwei verschiedene Atomsorten.",
						"In trockener Luft stehen Edelgase als Einzelatome neben Molekülen.",
					],
				],
				[
					[
						"Welcher Stoff ist eine Verbindung?",
						"Schwefeldioxid (SO₂)",
						"Stickstoff (N₂)",
						"Neon (Ne)",
						"SO₂ enthält S und O und somit zwei Atomsorten.",
					],
					[
						"Ist trockene Luft eine Verbindung wie CO₂?",
						"Sie ist ein Gemisch, weil mehrere Sorten von Teilchen nebeneinander vorkommen.",
						"Sie ist eine Verbindung mit festem Teilchenverband aller Luftgase.",
						"Sie ist ein Element, weil alle Bestandteile gasförmig sind.",
						"Mehrere Gase bleiben in der Mischung verschiedene Stoffe.",
					],
				],
			],
			lab: labs.molecule,
		},
		{
			id: "verbrennung",
			title: "Wann entsteht Feuer?",
			subtitle: "Teste die drei Bedingungen einer Verbrennung im Modell.",
			text: [
				"Zur Verbrennung im Feuerdreieck gehören ein brennbarer Stoff, Sauerstoff und eine ausreichend hohe Temperatur zum Entzünden. Nimmst du eine dieser Bedingungen weg, endet die Verbrennung. Fein verteilte brennbare Stoffe bieten im Verhältnis zu ihrer Masse eine größere Oberfläche. Dadurch haben mehr Teilchen gleichzeitig Kontakt mit der Luft.",
				"Ein festes Stück Holz entzündet sich unter vergleichbaren Bedingungen schwerer als kleine Späne. Das Material ist ähnlich, die Kontaktfläche zur Luft ist verschieden. Bei einer Explosion läuft eine Verbrennung sehr schnell ab, und es entsteht in kurzer Zeit ein starker Druckanstieg. Solche Vorgänge lernst du hier am Modell kennen.",
			],
			rule: "Das Feuerdreieck besteht aus Brennstoff, Sauerstoff und ausreichender Wärme.",
			quiz: [
				"Was passiert im Feuerdreieck, wenn Sauerstoff fehlt?",
				"Die Verbrennung endet.",
				"Die Verbrennung wird heißer.",
				"Es ändert sich nur die Flammenfarbe.",
				"Sauerstoff ist eine der drei notwendigen Bedingungen.",
			],
			practice: [
				[
					[
						"Was muss ein Brennstoff zum Start der Verbrennung erreichen?",
						"Die Entzündungstemperatur",
						"Den Schmelzpunkt von Sauerstoff",
						"Die Temperatur der Umgebung",
						"Ein Brennstoff braucht zunächst genug Wärme zur Entzündung.",
					],
					[
						"Warum kann fein verteiltes Brennmaterial schneller reagieren?",
						"Es hat mehr Kontaktfläche zur Luft.",
						"Es enthält zwangsläufig mehr Sauerstoff.",
						"Es wird allein durch die Zerteilung zu einem anderen Element.",
						"Bei gleicher Masse wächst durch Zerteilung die Oberfläche.",
					],
				],
				[
					[
						"Welche Bedingung fehlt bei einem kalten, noch unentzündeten Brennstoff in Luft?",
						"Ausreichende Wärme",
						"Brennstoff",
						"Sauerstoff",
						"Der Stoff liegt unter seiner Entzündungstemperatur.",
					],
					[
						"Was unterbricht die Reaktion, wenn eine Gaszufuhr fachgerecht abgesperrt wird?",
						"Der Nachschub an Brennstoff endet.",
						"Der Sauerstoff der ganzen Umgebung verschwindet.",
						"Die chemische Formel von Sauerstoff ändert sich.",
						"Ohne Nachschub steht der Flamme bald kein Brennstoff zur Verfügung.",
					],
				],
				[
					[
						"Was kennzeichnet eine explosionsartige Verbrennung?",
						"Eine sehr schnelle Reaktion mit raschem Druckanstieg",
						"Eine besonders langsame Rostbildung",
						"Das Zusammenpressen von Luft ohne Stoffumwandlung",
						"Bei der schnellen Verbrennung kann sich in sehr kurzer Zeit Druck aufbauen.",
					],
					[
						"Warum ist das Feuerdreieck kein Zeitmesser für einen Brand?",
						"Es erklärt Bedingungen, enthält aber keine Angaben zu Wärmefluss oder Reaktionsgeschwindigkeit.",
						"Es liefert immer dieselbe Branddauer.",
						"Seine drei Ecken sind drei gleich lange Zeitabschnitte.",
						"Ein Modell beantwortet ausgewählte Fragen.",
					],
				],
			],
			lab: labs.fire,
		},
		{
			id: "brandschutz",
			title: "Was Brandschutz bewirkt",
			subtitle:
				"Unterscheide Vorbeugung, Flucht und die Prinzipien des Löschens.",
			text: [
				"Brandschutz beginnt vor dem Brand. Schwer entflammbare Materialien können eine Entzündung erschweren. Geschlossene Brandschutztüren bremsen die Ausbreitung von Feuer und Rauch. Halte Fluchtwege und Türen frei. Bei Gefahr verlässt du den Bereich auf einem sicheren Weg, warnst andere und rufst von einem sicheren Ort 112.",
				"Fachgerechtes Löschen entzieht Wärme, trennt Brennstoff ab oder unterbricht Sauerstoffzufuhr. Ein geeignetes Löschmittel wird nach der Brandart ausgewählt. Wasser kann bei geeigneten festen Brennstoffen Wärme entziehen. Bei brennendem Fett ist Wasser gefährlich, weil das heiße Fett explosionsartig verspritzen kann.",
			],
			rule: "Wirksamer Brandschutz verhindert Entzündung oder Ausbreitung. Beim Löschen wird eine Bedingung der Verbrennung unterbrochen.",
			quiz: [
				"Wozu ist eine geschlossene Brandschutztür da?",
				"Sie verlangsamt die Ausbreitung von Rauch und Feuer.",
				"Sie liefert Sauerstoff für den Brandraum.",
				"Sie ersetzt freie Fluchtwege.",
				"Die geschlossene Tür begrenzt die Ausbreitung für eine gewisse Zeit.",
			],
			practice: [
				[
					[
						"Welche Maßnahme gehört zur Vorbeugung?",
						"Fluchtwege freihalten",
						"Durch einen verrauchten Flur laufen",
						"Eine Brandschutztür verkeilen",
						"Ein freier Fluchtweg erleichtert das Verlassen des Gebäudes.",
					],
					[
						"Im Schulhaus gibt es Rauch. Was hat Vorrang?",
						"Über einen sicheren Weg raus, andere warnen und vom sicheren Ort Hilfe rufen.",
						"Erst das Handy und die Tasche holen.",
						"Zuerst durch den Rauch zum Brandherd gehen.",
						"Abstand und ein sicherer Fluchtweg schützen dich.",
					],
				],
				[
					[
						"Welche Bedingung wird beim Kühlen eines geeigneten Brandes angegriffen?",
						"Ausreichende Wärme",
						"Brennbare Stoffe in allen Räumen",
						"Der Sauerstoffanteil der gesamten Luft",
						"Das Löschmittel führt Wärme vom Brandherd ab.",
					],
					[
						"Warum ist Wasser bei einem Fettbrand ungeeignet?",
						"Wasser kann schlagartig verdampfen und brennendes Fett mitreißen.",
						"Es senkt den Sauerstoffanteil der Raumluft zu stark.",
						"Wasser ist selbst ein Brennstoff.",
						"Heißes Fett kann weit verspritzen und den Brand verschlimmern.",
					],
				],
				[
					[
						"Worauf zielt das Abdecken eines dafür geeigneten Brandherdes?",
						"Die Sauerstoffzufuhr zu unterbrechen",
						"Zusätzliche Wärme zuzuführen",
						"Den Brennstoff feiner zu verteilen",
						"Die Abdeckung hält Umgebungsluft vom Brandherd fern.",
					],
					[
						"Warum gibt es verschiedene Löschmittel?",
						"Unterschiedliche Brennstoffe reagieren verschieden auf Löschmittel.",
						"Das Löschmittel bestimmt nur die Farbe des Rauchs.",
						"Jedes Mittel wirkt bei jedem Stoff gleich.",
						"Ein geeignetes Mittel hängt von der Brandart ab.",
					],
				],
			],
			lab: inspection(
				"protection",
				"Schutzmaßnahmen zuordnen",
				"Wähle eine Situation und verfolge, was die Maßnahme bewirkt.",
				[
					"Zeige, wie sich die Ausbreitung von Rauch hemmen lässt.",
					"Finde die Maßnahme, die Wärme entzieht.",
					"Finde das Prinzip, das die Zufuhr von Sauerstoff unterbricht.",
				],
			),
		},
		{
			id: "oxidation",
			title: "Sauerstoff wird Teil des Produkts",
			subtitle:
				"Lies Wortgleichungen und unterscheide Metall- und Nichtmetalloxide.",
			text: [
				"In dieser Lektion heißt Oxidation: Ein Stoff reagiert mit Sauerstoff. Dabei entsteht ein Oxid, also eine Verbindung des Elements mit Sauerstoff. Die Atome werden neu angeordnet. Links vom Pfeil stehen die Ausgangsstoffe, rechts das Produkt. Metall und Sauerstoff ergeben hier ein Metalloxid. Ein Nichtmetall bildet bei seiner Reaktion mit Sauerstoff ein Nichtmetalloxid.",
				"Magnesium + Sauerstoff → Magnesiumoxid. Das neue Produkt ist ein Metalloxid. Auch Kohlenstoff + Sauerstoff → Kohlenstoffdioxid ist eine Wortgleichung. Kohlenstoffdioxid ist ein Nichtmetalloxid. Schwefel + Sauerstoff → Schwefeldioxid zeigt das gleiche Schema für ein anderes Nichtmetall.",
			],
			rule: "Bei der Oxidation in diesem Kapitel wird Sauerstoff in einen neuen Stoff eingebaut. Die Atome bleiben erhalten.",
			quiz: [
				"Was entsteht aus Schwefel und Sauerstoff im Modell?",
				"Schwefeldioxid",
				"Magnesiumoxid",
				"Schwefel und Stickstoff",
				"Die beiden beteiligten Atomsorten bleiben erhalten und bilden ein Nichtmetalloxid.",
			],
			practice: [
				[
					[
						"Auf welcher Seite des Reaktionspfeils stehen die Ausgangsstoffe?",
						"Links",
						"Rechts",
						"Immer auf beiden Seiten",
						"Der Pfeil zeigt von den Ausgangsstoffen zum Produkt.",
					],
					[
						"In einem Modellbild fehlt auf der Produktseite ein O-Atom. Was passt nicht?",
						"Die Anzahl der Sauerstoffatome muss erhalten bleiben.",
						"Alle Sauerstoffatome müssen frei bleiben.",
						"Produkte enthalten grundsätzlich weniger Atome.",
						"Atome werden bei der chemischen Reaktion neu angeordnet.",
					],
				],
				[
					[
						"Welches Produkt ist ein Metalloxid?",
						"Magnesiumoxid",
						"Kohlenstoffdioxid",
						"Schwefeldioxid",
						"Magnesium ist ein Metall.",
					],
					[
						"Eine Wortgleichung lautet: Kohlenstoffdioxid → Kohlenstoff + Sauerstoff. Stellt sie die Oxidation von Kohlenstoff dar?",
						"Nein, für die Oxidation müssen Kohlenstoff und Sauerstoff links stehen.",
						"Ja, die Richtung des Pfeils spielt keine Rolle.",
						"Ja, jedes Vorkommen von CO₂ bedeutet Oxidation.",
						"Gesucht ist die Bildung des Oxids aus den Ausgangsstoffen.",
					],
				],
				[
					[
						"Warum ist ein Oxid ein neuer Stoff?",
						"Die beteiligten Atomsorten liegen als Verbindung mit neuen Eigenschaften vor.",
						"Die Atome werden ausgelöscht.",
						"Sauerstoff bleibt im Produkt ein eigenes Gas.",
						"Eine Verbindung hat andere Eigenschaften als ihre Ausgangsstoffe.",
					],
					[
						"Beim Erhitzen schmilzt Wachs. Zeigt das allein schon eine Oxidation?",
						"Nein, das Schmelzen ändert nur den Zustand.",
						"Ja, jedes Erwärmen ist eine Oxidation.",
						"Ja, flüssiges Wachs ist ein Oxid.",
						"Beim Schmelzen entsteht allein dadurch kein neuer Stoff.",
					],
				],
			],
			lab: labs.oxidation,
		},
		{
			id: "rosten",
			title: "Rost und braune Äpfel",
			subtitle: "Vergleiche stille Oxidation und passende Schutzmaßnahmen.",
			text: [
				"Eine stille Oxidation läuft ohne Flamme ab. Beim Rosten reagieren Eisen, Sauerstoff und Wasser. Es bilden sich rotbraune Eisenverbindungen. Eine intakte Lackschicht hält Feuchtigkeit und Luft vom Eisen fern. Beim Verzinken schützt die Zinkschicht die Oberfläche, und Zink reagiert leichter als Eisen.",
				"Auf einem angeschnittenen Apfel kommt Sauerstoff mit dem Fruchtfleisch in Kontakt. Enzyme helfen dabei, dass Stoffe oxidieren und braune Farbstoffe entstehen. Vitamin C wirkt als Antioxidans und kann die Bräunung verlangsamen. Eine Schutzschicht auf Eisen und ein Antioxidans im Essen greifen auf unterschiedliche Weise ein.",
			],
			rule: "Zum Rosten braucht Eisen Wasser und Sauerstoff. Stille Oxidation läuft ohne sichtbare Flamme ab.",
			quiz: [
				"Was begünstigt Rost an blankem Eisen?",
				"Feuchtigkeit und Zutritt von Sauerstoff",
				"Trockene Luft allein",
				"Wasser ganz ohne Sauerstoff",
				"Zum Rosten müssen sowohl Wasser als auch Sauerstoff verfügbar sein.",
			],
			practice: [
				[
					[
						"Wie schützt intakter Lack Eisen?",
						"Er hält Luft und Feuchtigkeit von der Oberfläche fern.",
						"Er verwandelt Eisen in ein Edelgas.",
						"Er erwärmt den Nagel über die Entzündungstemperatur.",
						"Lack bildet eine Barriere.",
					],
					[
						"Warum kann an einer tiefen Schramme im Fahrradrahmen Rost entstehen?",
						"Luft und Feuchtigkeit können das freiliegende Eisen erreichen.",
						"Lack färbt jeden Kratzer von selbst rostbraun.",
						"Eisen rostet dort allein durch Licht.",
						"Die Schutzschicht ist an der Stelle unterbrochen.",
					],
				],
				[
					[
						"Was ist eine stille Oxidation?",
						"Das Rosten eines Nagels",
						"Das Auflösen von Zucker",
						"Das Schmelzen eines Eiswürfels",
						"Rosten ist eine Stoffumwandlung an Luft ohne Flamme.",
					],
					[
						"Warum hilft Vitamin C gegen schnelles Braunwerden eines Apfels?",
						"Es kann die Oxidationsvorgänge bremsen.",
						"Es baut eine Zinkschicht auf.",
						"Es ändert Sauerstoff in Stickstoff um.",
						"Vitamin C ist ein Antioxidans.",
					],
				],
				[
					[
						"Was wird beim Verzinken aufgebracht?",
						"Eine Zinkschicht",
						"Eine Sauerstoffschicht",
						"Eine Kalkschicht",
						"Das Metall Zink schützt die Eisenoberfläche.",
					],
					[
						"Zwei unbeschichtete Nägel liegen in feuchter Luft bzw. trocken. Welcher rostet schneller?",
						"In feuchter Luft, weil Wasser zur Rostbildung beiträgt.",
						"Der trockene, weil Sauerstoff Feuchtigkeit meidet.",
						"Beide gleich schnell, weil sie aus dem gleichen Metall sind.",
						"Der Aufbau vergleicht direkt den Einfluss des Wassers.",
					],
				],
			],
			lab: labs.rust,
		},
		{
			id: "formelgleichungen",
			title: "Reaktionsgleichungen ausgleichen",
			subtitle: "Zähle Atome und ändere nur die Zahlen vor den Formeln.",
			tracks: ["M"],
			text: [
				"In einer Formelgleichung benutzt du Elementsymbole und Formeln. Eine Zahl vor einer Formel zählt, wie oft die ganze Formel vorkommt. Eine tiefgestellte Zahl gehört zur Formel des Stoffs. Beim Ausgleichen veränderst du nur die Zahlen davor, damit links und rechts gleich viele Atome jeder Sorte stehen. CO (Kohlenstoffmonoxid) und CO₂ (Kohlenstoffdioxid) sind zwei unterschiedliche Stoffe.",
				"Für Mg + O₂ → MgO fehlt rechts ein O-Atom. Mit 2 MgO sind rechts zwei O und zwei Mg. Setze daher auch vor Mg eine 2. Die ausgeglichene Gleichung lautet " +
					magnesiumFormula +
					". Die Zahl 1 vor O₂ bleibt ungeschrieben. MgO beschreibt das kleinste Zahlenverhältnis im festen Magnesiumoxid.",
			],
			rule:
				magnesiumFormula +
				" · Links und rechts stehen jeweils zwei Mg-Atome und zwei O-Atome.",
			quiz: [
				"Welche Änderung ist beim Ausgleichen erlaubt?",
				"Eine Zahl vor einer Formel ändern",
				"O₂ durch O₃ ersetzen",
				"MgO durch MgO₂ ersetzen",
				"Die Zahl vor der Formel gibt an, wie oft die Formeleinheit zählt.",
			],
			practice: [
				[
					[
						"Wie viele O-Atome zeigt 2 CO₂?",
						"Vier",
						"Zwei",
						"Drei",
						"Verdopple beide O-Atome des CO₂-Moleküls.",
						[4, "", 0],
					],
					[
						"Bei 2 Mg + O₂ → MgO: Was muss rechts stehen?",
						"2 MgO",
						"Mg₂O",
						"MgO₂",
						"Rechts müssen zwei Mg und zwei O vorkommen, während die Formel MgO bleibt.",
					],
				],
				[
					[
						"Wie viele N-Atome stehen in 3 N₂?",
						"Sechs",
						"Fünf",
						"Drei",
						"Dreimal zwei N-Atome ergeben sechs.",
					],
					[
						"Welche Gleichung stimmt für Kohlenstoff und Sauerstoff mit dem Produkt Kohlenstoffdioxid?",
						"C + O₂ → CO₂",
						"2 C + O₂ → CO₂",
						"C + 2 O₂ → CO₂",
						"Auf jeder Seite stehen ein C- und zwei O-Atome.",
					],
				],
				[
					[
						"Was bedeutet die 2 in CO₂?",
						"Zwei O-Atome je CO₂-Teilchen",
						"Zwei CO₂-Teilchen",
						"Zwei C-Atome je CO₂-Teilchen",
						"Sie steht tiefgestellt direkt hinter O.",
					],
					[
						"4 Mg + 2 O₂ → 4 MgO stimmt zahlenmäßig. Wie schreibst du dieselbe Gleichung mit kleinsten ganzen Zahlen?",
						magnesiumFormula,
						"Mg + O₂ → MgO",
						"4 Mg + O₂ → 4 MgO",
						"Teile alle drei Koeffizienten durch zwei.",
					],
				],
			],
			lab: labs.equation,
		},
	],
);
