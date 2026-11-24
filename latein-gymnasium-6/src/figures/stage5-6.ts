import { type ConceptFigure, threeColumns } from "./draw";

export const STAGE5_6_FIGURES: Record<string, ConceptFigure> = {
	"l6-topografie-italien-mittelmeer": {
		title: "Italien, Magna Graecia und Mittelmeerraum",
		question: "Welche drei Kulturräume prägen die römische Welt im 2. Lernjahr?",
		alt: "Dreiteiliges Schaubild zur Topografie: Golf von Neapel mit Vesuv und Misenum, Großgriechenland mit Syrakus und Athen sowie Karthago und Zama.",
		caption: "Kampanien, Großgriechenland und Nordafrika verbinden römisches und griechisches Erbe.",
		parts: [
			{
				label: "Kampanien & Vesuv",
				note: "Am Golf von Neapel liegen der Vesuv, Pompeji, Herkulaneum und der Flottenhafen Misenum.",
			},
			{
				label: "Magna Graecia & Athen",
				note: "Griechische Städte in Süditalien und Sizilien (Syrakus) sowie Athen und Kreta.",
			},
			{
				label: "Karthago & Zama",
				note: "Roms große Rivalin in Nordafrika: Schauplatz des 2. Punischen Krieges bis 202 v. Chr.",
			},
		],
		draw: () =>
			threeColumns(
				"Schauplätze im Mittelmeerraum (Mare Nostrum)",
				[
					{
						badge: "Kampanien",
						fill: "v-coral-fill",
						heading: "Golf von Neapel",
						lines: ["Vesuv · Misenum", "Pompeji", "Herkulaneum"],
						footer: "79 n. Chr.",
					},
					{
						badge: "Griechenland",
						fill: "v-blue-fill",
						heading: "Magna Graecia",
						lines: ["Syrakus (Sizilien)", "Athen · Kreta", "Troja (Kleinasien)"],
						footer: "griechische Welt",
					},
					{
						badge: "Afrika",
						fill: "v-gold-fill",
						heading: "Karthago",
						lines: ["Rivalin Roms", "Zama (202 v. Chr.)", "Seeherrschaft"],
						footer: "Punische Kriege",
					},
				],
				true,
			),
	},
	"l6-vesuv-pompeji-herkulaneum": {
		title: "Vesuvausbruch 79 n. Chr.: Pompeji und Herkulaneum",
		question: "Wie unterscheidet sich die Verschüttung beider Städte am Golf von Neapel?",
		alt: "Dreiteiliges Schaubild zum Vesuvausbruch 79 n. Chr.: Vorzeichen und Ausbruch, Pompeji unter Bimsstein und Asche sowie Herkulaneum unter pyroklastischer Masse.",
		caption: "Pompeji bewahrt Häuser, Straßen und Thermopolia; Herkulaneum schützt verkohltes Holz und Papyri.",
		parts: [
			{
				label: "Beben & Ausbruch 79 n. Chr.",
				note: "Nach einem Erdbeben 62 n. Chr. bricht der Vesuv 79 n. Chr. verheerend aus.",
			},
			{
				label: "Pompeji (Asche & Bimsstein)",
				note: "Rund 4–6 m Bimsstein und Asche konservieren Straßen, Foren und Imbissstände.",
			},
			{
				label: "Herkulaneum (Glutmasse)",
				note: "Bis zu 20 m heiße Schlamm- und Ascheströme erhalten Holzbalken und Papyrusrollen.",
			},
		],
		draw: () =>
			threeColumns(
				"Unter der Asche des Vesuvs (79 n. Chr.)",
				[
					{
						badge: "Katastrophe",
						fill: "v-coral-fill",
						heading: "Vesuv 79 n. Chr.",
						lines: ["Vorbeben 62 n. Chr.", "Aschewolke · Glut", "plötzliche Flucht"],
						footer: "Golf von Neapel",
					},
					{
						badge: "Pompeji",
						fill: "v-gold-fill",
						heading: "Pompēiī",
						lines: ["Bimsstein & Asche", "thermopōlium", "Straßen · Forum"],
						footer: "Alltag erhalten",
					},
					{
						badge: "Herkulaneum",
						fill: "v-teal-fill",
						heading: "Herculāneum",
						lines: ["bis 20 m Glutstrom", "Holz & Türen", "verkohlte Papyri"],
						footer: "Villa dei Papiri",
					},
				],
				true,
			),
	},
	"l6-plinius-vesuvbriefe": {
		title: "Plinius d. J. an Tacitus: Epistulae 6,16 und 6,20",
		question: "Was berichtet der Augenzeuge über den Aufbruch von Misenum und die Pinienwolke?",
		alt: "Dreiteiliges Schaubild zu den Vesuvbriefen des Plinius: Blick von Misenum auf die Pinienwolke, Rettungsfahrt von Plinius d. Ä. mit Tacitus-Bericht und Aschenregen.",
		caption: "Geologen nennen diesen Eruptionstyp nach Plinius' Beschreibung bis heute plinianisch.",
		parts: [
			{
				label: "Die Pinienwolke (6,16,5)",
				note: "Von Misenum aus sieht man eine Wolke in Form einer Pinie (fōrma pīnus) aufsteigen.",
			},
			{
				label: "Plinius d. Ä. bricht auf",
				note: "Mit der Flotte eilt er den Menschen zu Hilfe: Fortēs fortūna iuvat!",
			},
			{
				label: "Briefe an Tacitus",
				note: "Plinius d. J. schildert dem Historiker Tacitus Beobachtung, Flucht und Schicksal.",
			},
		],
		draw: () =>
			threeColumns(
				"Augenzeugenbericht an den Historiker Tacitus",
				[
					{
						badge: "Beobachtung",
						fill: "v-purple-fill",
						heading: "fōrma pīnus",
						lines: ["Wolke wie Pinie", "von Misenum sichtbar", "hoher Aschestamm"],
						footer: "Brief 6,16",
					},
					{
						badge: "Rettungsfahrt",
						fill: "v-orange-fill",
						heading: "Plīnius maior",
						lines: ["Flottenpräfekt", "Fortēs fortūna iuvat", "Fahrt nach Stabiae"],
						footer: "Mut & Pflicht",
					},
					{
						badge: "Überlieferung",
						fill: "v-blue-fill",
						heading: "Epistulae 6,16 & 6,20",
						lines: ["Briefe an Tacitus", "Dunkelheit & Flucht", "Sachbericht"],
						footer: "plinianisch",
					},
				],
				true,
			),
	},
	"l6-funde-kunst-museen": {
		title: "Funde aus Pompeji und griechische Vasenkunst",
		question: "Welche Kunsttechniken begegnen uns im Haus in Pompeji und im Museum?",
		alt: "Dreiteiliges Schaubild zu pompejanischem Mosaik (CAVĒ CANEM), Freskomalerei auf feuchtem Kalkputz und rotfiguriger attischer Vasenmalerei.",
		caption: "Mosaik, Fresko und Vasenmalerei überliefern römischen Alltag und griechische Sagen.",
		parts: [
			{
				label: "Mosaik (CAVĒ CANEM)",
				note: "Kleine Steinchen im Eingang warnen Besucher humorvoll: Vorsicht vor dem Hund!",
			},
			{
				label: "Fresko (Wandmalerei)",
				note: "Auf feuchten Kalkputz aufgetragen (al fresco), verbindet sich Farbe haltbar.",
			},
			{
				label: "Rotfigurige Vase",
				note: "Ab ca. 530 v. Chr. in Athen: helle Tonfiguren auf dunklem Glanzton-Grund.",
			},
		],
		draw: () =>
			threeColumns(
				"Antike Bildkunst in Haus und Museum",
				[
					{
						badge: "Bodenbild",
						fill: "v-gold-fill",
						heading: "Mosaik",
						lines: ["CAVĒ CANEM!", "bunte Steinchen", "Schwelle im Haus"],
						footer: "tessellae",
					},
					{
						badge: "Wandmalerei",
						fill: "v-coral-fill",
						heading: "Fresko",
						lines: ["feuchter Kalkputz", "vier Stile", "Gärten & Mythen"],
						footer: "leuchtende Farbe",
					},
					{
						badge: "Keramik",
						fill: "v-teal-fill",
						heading: "Rotfigurige Vase",
						lines: ["Athen ab 530 v. Chr.", "dunkler Hintergrund", "feine Details"],
						footer: "Antikenmuseum",
					},
				],
				false,
			),
	},
	"l6-griechisches-geistesleben": {
		title: "Griechisches Geistesleben: Athen und Archimedes",
		question: "Was verbindet die Attische Demokratie und den Forscher Archimedes?",
		alt: "Dreiteiliges Schaubild zu Volksversammlung in Athen (mit Ausschluss von Frauen, Sklaven und Metöken), Archimedes' Auftriebsprinzip und der Verteidigung von Syrakus.",
		caption: "Politisches Denken in Athen und Naturwissenschaft in Syrakus strahlen bis nach Rom.",
		parts: [
			{
				label: "Attische Demokratie",
				note: "Freie männliche Vollbürger stimmen in der Ekklēsia ab; Frauen, Sklaven und Metöken fehlen.",
			},
			{
				label: "Auftrieb & Hebelgesetz",
				note: "Archimedes entdeckt das Auftriebsprinzip im Wasser (Heureka!) und Hebelkräfte.",
			},
			{
				label: "Verteidigung von Syrakus",
				note: "In Magna Graecia schützt Archimedes Syrakus bis 212 v. Chr. mit Wurfmaschinen.",
			},
		],
		draw: () =>
			threeColumns(
				"Geistesleben und Technik der Griechen",
				[
					{
						badge: "Politik",
						fill: "v-blue-fill",
						heading: "Ekklēsia (Athen)",
						lines: ["Vollbürger wählen", "ohne Frauen/Sklaven", "ohne Metöken"],
						footer: "Demokratie",
					},
					{
						badge: "Physik",
						fill: "v-teal-fill",
						heading: "Archimedes",
						lines: ["Auftrieb im Wasser", "Hebelgesetz", "Heureka!"],
						footer: "Mathematik",
					},
					{
						badge: "Magna Graecia",
						fill: "v-orange-fill",
						heading: "Syrakus",
						lines: ["Wurfmaschinen", "Belagerung Roms", "erobert 212 v. Chr."],
						footer: "Sizilien",
					},
				],
				true,
			),
	},
	"l6-fruehe-republik-staendekaempfe": {
		title: "Frühe Republik: Ständekämpfe und Aufstieg in Italien",
		question: "Wie errangen die Plebejer Rechte und wie einigte Rom Italien?",
		alt: "Dreiteiliges Schaubild zur frühen Republik: Sēcessiō plēbis 494 v. Chr., Zwölftafelgesetz um 450 v. Chr. und Abwehr des Königs Pyrrhos 280–275 v. Chr.",
		caption: "Aus inneren Konflikten wuchsen geschriebene Gesetze; nach Pyrrhos beherrschte Rom Italien.",
		parts: [
			{
				label: "494 v. Chr.: Sēcessiō plēbis",
				note: "Die Plebejer ziehen auf den Heiligen Berg aus und setzen eigene Volkstribunen durch.",
			},
			{
				label: "ca. 450 v. Chr.: Zwölf Tafeln",
				note: "Erstes öffentlich aufgestelltes, geschriebenes Recht schützt vor Willkür.",
			},
			{
				label: "280–275 v. Chr.: Pyrrhos",
				note: "Roms Zähigkeit erschöpft König Pyrrhos (‚Pyrrhussieg‘); Italien wird geeint.",
			},
		],
		draw: () =>
			threeColumns(
				"Der Weg der Römischen Republik (509–270 v. Chr.)",
				[
					{
						badge: "494 v. Chr.",
						fill: "v-coral-fill",
						heading: "Sēcessiō plēbis",
						lines: ["Auszug der Plebejer", "auf Heiligen Berg", "Volkstribunen"],
						footer: "Ständekämpfe",
					},
					{
						badge: "ca. 450 v. Chr.",
						fill: "v-blue-fill",
						heading: "Zwölftafelgesetz",
						lines: ["Recht für alle", "auf dem Forum", "Ende der Willkür"],
						footer: "lēgēs scrīptae",
					},
					{
						badge: "280–275 v. Chr.",
						fill: "v-gold-fill",
						heading: "König Pyrrhos",
						lines: ["Süditalien", "teure Siege", "Herrschaft Roms"],
						footer: "Pyrrhussieg",
					},
				],
				true,
			),
	},
	"l6-gesellschaft-klientel-organe": {
		title: "Verfassungsorgane und Klientelwesen der Republik",
		question: "Wie kontrollierten sich Ämter und wie wirkte die Klientelbeziehung?",
		alt: "Dreiteiliges Schaubild zur römischen Gesellschaft: Annuität und Kollegialität der Konsuln, Einspruchsrecht Vetō der Volkstribunen sowie patrōnus und cliēns.",
		caption: "Annuität, Kollegialität und Vetō verhinderten die Rückkehr eines Königs.",
		parts: [
			{
				label: "Annuität & Kollegialität",
				note: "Hohe Beamte wie die zwei Konsuln regieren genau ein Jahr und kontrollieren sich gegenseitig.",
			},
			{
				label: "Volkstribunen & Vetō",
				note: "Mit ‚Vetō!‘ (Ich verbiete!) stoppen Volkstribunen ungerechte Maßnahmen gegen Plebejer.",
			},
			{
				label: "patrōnus und cliēns",
				note: "Schutzherr (patrōnus) und Schützling (cliēns) sind durch fidēs gegenseitig verbunden.",
			},
		],
		draw: () =>
			threeColumns(
				"Machtkontrolle und Gesellschaftsnetz der Republik",
				[
					{
						badge: "Ämterprinzip",
						fill: "v-blue-fill",
						heading: "Konsulat",
						lines: ["Annuität = 1 Jahr", "Kollegialität = 2", "Senat berät"],
						footer: "keine Alleinherrschaft",
					},
					{
						badge: "Schutzrecht",
						fill: "v-coral-fill",
						heading: "tribūnī plēbis",
						lines: ["unverletzlich", "Ruf: ‚Vetō!‘", "Schutz für Bürger"],
						footer: "Einspruchsrecht",
					},
					{
						badge: "Klientelwesen",
						fill: "v-teal-fill",
						heading: "patrōnus ↔ cliēns",
						lines: ["Schutz vor Gericht", "Wahlhilfe & Gefolge", "gegenseitige fidēs"],
						footer: "soziales Band",
					},
				],
				true,
			),
	},
	"l6-hannibal-punische-kriege": {
		title: "Hannibal und die Punischen Kriege",
		question: "Warum scheiterte Hannibal trotz Siegen in Italien bei Zama an Rom?",
		alt: "Dreiteiliges Schaubild zum 2. Punischen Krieg: Hannibals Alpenzug 218 v. Chr., Niederlage Roms bei Cannae 216 v. Chr. samt Treue der sociī sowie Scīpiōs Sieg bei Zama 202 v. Chr.",
		caption: "Roms italische Bundesgenossen (sociī) hielten durch, bis Scīpiō Hannibal bei Zama besiegte.",
		parts: [
			{
				label: "218 v. Chr.: Alpenzug",
				note: "Hannibal überquert mit Truppen und Elefanten die Alpen und bedroht Italien.",
			},
			{
				label: "216 v. Chr.: Cannae & sociī",
				note: "Trotz der schweren Niederlage bei Cannae bleiben die meisten italischen sociī Rom treu.",
			},
			{
				label: "202 v. Chr.: Zama (Scīpiō)",
				note: "P. Cornēlius Scīpiō trägt den Krieg nach Afrika und siegt bei Zama.",
			},
		],
		draw: () =>
			threeColumns(
				"Roms Überlebenskampf gegen Karthago",
				[
					{
						badge: "218 v. Chr.",
						fill: "v-orange-fill",
						heading: "Alpenzug",
						lines: ["Hannibal", "Kriegselefanten", "2. Punischer Krieg"],
						footer: "Angriff auf Italien",
					},
					{
						badge: "216 v. Chr.",
						fill: "v-coral-fill",
						heading: "Cannae & sociī",
						lines: ["schwere Niederlage", "kein Frieden", "Rückhalt der sociī"],
						footer: "Widerstand",
					},
					{
						badge: "202 v. Chr.",
						fill: "v-green-fill",
						heading: "Scīpiō bei Zama",
						lines: ["Gegenstoß Afrika", "Sieg über Karthago", "Scīpiō Africānus"],
						footer: "Entscheidung",
					},
				],
				true,
			),
	},
	"l6-roemische-werte-opfer": {
		title: "Römische Werte und das Opferprinzip dō ut dēs",
		question: "Welche Haltungen stützten Staat und Religion in schweren Krisen?",
		alt: "Dreiteiliges Schaubild zu cōnstantia (Standhaftigkeit), concordia (Eintracht der Bürgerschaft) und dem Opferprinzip dō ut dēs.",
		caption: "Cōnstantia nach außen, concordia im Inneren und dō ut dēs gegenüber den Göttern prägen Rom.",
		parts: [
			{
				label: "cōnstantia (Standhaftigkeit)",
				note: "Auch nach Katastrophen wie Cannae halten Römer besonnen an Ziel und Recht fest.",
			},
			{
				label: "concordia (Eintracht)",
				note: "Nach den Ständekämpfen versöhnt concordia (Herz zu Herz) Patrizier und Plebejer.",
			},
			{
				label: "Opferprinzip: dō ut dēs",
				note: "‚Ich gebe, damit du gibst‘: exaktes Opfer verlangt zuverlässig göttlichen Beistand.",
			},
		],
		draw: () =>
			threeColumns(
				"Innere Haltung und Vertragsreligion in Rom",
				[
					{
						badge: "Haltung",
						fill: "v-blue-fill",
						heading: "cōnstantia",
						lines: ["Standhaftigkeit", "in höchster Not", "Besonnenheit"],
						footer: "Charakterwert",
					},
					{
						badge: "Staat",
						fill: "v-teal-fill",
						heading: "concordia",
						lines: ["con + cor (Herz)", "Eintracht der Stände", "innerer Friede"],
						footer: "Versöhnung",
					},
					{
						badge: "Religion",
						fill: "v-gold-fill",
						heading: "dō ut dēs",
						lines: ["Ich gebe, damit", "du gibst", "genaues Ritual"],
						footer: "Opfervertrag",
					},
				],
				false,
			),
	},
	"l6-gegenwart-antikenbezuege": {
		title: "Römisches Erbe und Antikenbezüge heute",
		question: "Wo begegnen uns Begriffe aus Geschichte und Mythos der 6. Klasse im Alltag?",
		alt: "Dreiteiliges Schaubild zu heutigen Antikenbezügen: Pyrrhussieg aus der Geschichte, Trojaner in der Informatik und Europa aus Ovids Mythos.",
		caption: "Pyrrhussieg, Trojaner und der Name Europa zeigen lebendige Antike in Sprache und Technik.",
		parts: [
			{
				label: "Pyrrhussieg",
				note: "Nach Pyrrhos (279 v. Chr.) heißt ein zu teuer bezahlter Erfolg noch heute Pyrrhussieg.",
			},
			{
				label: "Trojaner (IT-Sicherheit)",
				note: "Wie das Holzpferd von Troja verbirgt ein Computer-Trojaner Gefahr in nützlicher Hülle.",
			},
			{
				label: "Europa",
				note: "Die phönizische Prinzessin Europa gibt unserem Erdteil Namen und Münzmotiv.",
			},
		],
		draw: () =>
			threeColumns(
				"Antike Begriffe mitten in unserer Gegenwart",
				[
					{
						badge: "Geschichte",
						fill: "v-orange-fill",
						heading: "Pyrrhussieg",
						lines: ["König Pyrrhos 279", "Sieg kostet zu viel", "Sprichwort heute"],
						footer: "teurer Erfolg",
					},
					{
						badge: "Informatik",
						fill: "v-coral-fill",
						heading: "Trojaner",
						lines: ["Trojanisches Pferd", "harmlose Tarnung", "Schadprogramm"],
						footer: "IT-Metapher",
					},
					{
						badge: "Kultur & Politik",
						fill: "v-blue-fill",
						heading: "Europa",
						lines: ["Prinzessin bei Ovid", "Name des Erdteils", "auf Euro-Münzen"],
						footer: "Mythos lebt",
					},
				],
				false,
			),
	},
};
