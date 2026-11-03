import type { Lesson } from "../model/types";

export const LESSONS_LB3: ReadonlyArray<Lesson> = [
	{
		id: "lebensraeume-wald-gewaesser",
		number: 8,
		stageId: "lb3",
		lb: 3,
		sectionCode: "HSU 3/4 · LB 3.1",
		title: "Lebensräume Wald & Gewässer: Stockwerke, Anpassung & Nahrungsnetze",
		shortTitle: "Wald & Gewässer",
		icon: "🌲",
		hook: "Warum wohnt das Moos ganz unten im schattigen Waldkeller, während die Bachforelle nur in kühlem, klarem Wasser überlebt?",
		foundationNote:
			"Aus der 1. und 2. Klasse kennst du schon Wiese und Hecke – jetzt steigen wir durch alle Stockwerke des Waldes und tauchen in heimische Gewässer ein!",
		storyParagraphs: [
			"Ein naturnaher Mischwald ist wie ein grünes Hochhaus mit fünf Stockwerken aufgebaut: Unter der Erde verankern sich Bäume und Pilzfäden in der Wurzelschicht. Darüber speichert die Moosschicht Regenwasser wie ein Schwamm. In der Krautschicht wachsen Farne, Walderdbeeren und Frühblüher, in der Strauchschicht Haselnuss und Holunder, und ganz oben fangen Laubbäume (Eiche, Buche, Ahorn – werfen im Herbst ihr Laub ab, um im Winter vor Austrocknung zu schützen) und Nadelbäume (Fichte, Tanne, Kiefer – mit Wachsschicht auf den Nadeln; die Lärche wirft ihre Nadeln ab!) in der Baumschicht das meiste Sonnenlicht ein.",
			"Auch im und am Gewässer sind Tiere und Pflanzen erstaunlich an Umweltfaktoren wie Licht, Temperatur, Strömung und Boden angepasst: Die Bachforelle hat einen stromlinienförmigen Körper, Schleimhaut und Kiemen für sauerstoffreiches, kühles Wasser. Die Stockente rudert mit Schwimmhäuten und fettet ihr Gefieder wasserabweisend ein. Die Seerose verankert ihre Wurzeln im Teichboden, während ihre Blätter dank kleiner Luftkammern im Stängel auf der Wasseroberfläche schwimmen.",
			"Alle Lebewesen hängen in Nahrungsketten und Nahrungsnetzen voneinander ab: Grüne Pflanzen sind Erzeuger (Produzenten), Pflanzenfresser (z. B. Raupe, Reh) und Fleischfresser (z. B. Buntspecht, Habicht, Hecht) sind Verbraucher, und Regenwürmer, Asseln, Pilze sowie Bakterien zersetzen totes Laub wieder zu fruchtbarem Humus. Der Mensch beeinflusst beide Lebensräume – negativ durch Müll, Dünger/Abwasser und Begradigung von Bächen, positiv durch Naturschutz, Mischwälder und saubere Uferstreifen.",
		],
		factCards: [
			{
				icon: "🌳",
				title: "5 Stockwerke des Waldes",
				text: "Von unten nach oben: Wurzelschicht, Moosschicht, Krautschicht, Strauchschicht, Baumschicht.",
			},
			{
				icon: "🐟",
				title: "Angepasstheit am Wasser",
				text: "Forelle: Stromlinienform & Kiemen; Stockente: Schwimmhäute & Bürzeldrüse; Seerose: Luftkanäle für Auftrieb.",
			},
			{
				icon: "🔗",
				title: "Nahrungskette",
				text: "Pflanze (Erzeuger) → Pflanzenfresser → Fleischfresser → Zersetzer (machen daraus wieder Nährsalze).",
			},
		],
		workedExample: {
			title: "Was passiert, wenn Dünger in einen Sommerbach gelangt?",
			scenario:
				"An einem Bach werden die schattenspendenden Uferbäume gefällt und Dünger vom Feld wird eingespült.",
			steps: [
				"Ohne Baumschatten erwärmt die Sonne das Wasser stark; warmes Wasser kann weniger gelösten Sauerstoff speichern.",
				"Durch den Dünger wuchern Algen; wenn sie absterben und zersetzt werden, sinkt der Sauerstoffgehalt noch weiter.",
				"Empfindliche Tiere wie Köcherfliegenlarven und Bachforellen finden nicht mehr genug Sauerstoff – die Nahrungskette gerät aus dem Gleichgewicht.",
			],
			conclusion:
				"Naturnahe Uferbäume und Gewässerschutz sichern kühles, sauerstoffreiches Wasser für die Artenvielfalt.",
		},
		merksatz:
			"Der Wald gliedert sich in Wurzel-, Moos-, Kraut-, Strauch- und Baumschicht. Tiere und Pflanzen sind im Körperbau genau an Umweltfaktoren ihres Lebensraums (Wald oder Gewässer) angepasst und über Nahrungsketten miteinander verbunden.",
		probenWissen: [
			{
				term: "Stockwerke des Waldes",
				definition:
					"1. Wurzelschicht, 2. Moosschicht, 3. Krautschicht, 4. Strauchschicht, 5. Baumschicht.",
			},
			{
				term: "Laubwechsel im Herbst",
				definition:
					"Laubbäume werfen Blätter ab, damit sie bei gefrorenem Winterboden kein Wasser über die Blätter verdunsten.",
			},
			{
				term: "Angepasstheit",
				definition:
					"Übereinstimmung von Körperbau und Verhalten einer Art mit den Bedingungen ihres Lebensraums (z. B. Kiemen, Schwimmhäute, Luftkammern).",
			},
			{
				term: "Erzeuger – Verbraucher – Zersetzer",
				definition:
					"Pflanzen bilden mit Licht Nahrung; Tiere fressen Pflanzen/Tiere; Bodenlebewesen & Pilze bauen Reste zu Humus ab.",
			},
		],
		realWorldQuest:
			"Vergleiche bei einem Waldspaziergang einen Fichtenzweig und einen Tannenzweig: ‚Die Fichte sticht, die Tanne nicht!‘ Und fühle, wie kühl und feucht das Moos am Waldboden ist.",
		quickCheck: {
			question:
				"Warum können die großen Blätter der Seerose flach auf der Teichoberfläche schwimmen, obwohl ihre Wurzeln tief im Schlamm stecken?",
			options: [
				"Weil Fische die Blätter von unten mit den Flossen festhalten.",
				"Weil Seerosenblätter aus festem Holz bestehen.",
				"Weil Blätter und lange Stängel luftgefüllte Hohlräume (Luftkammern) besitzen, die Auftrieb geben.",
			],
			correctIndex: 2,
			explanation:
				"Luftgefüllte Kanäle versorgen die Wurzeln im Schlamm mit Luft und halten die Schwimmblätter oben am Sonnenlicht – perfekte Angepasstheit!",
		},
		lab: {
			title: "Wald-Stockwerke & Forellenbach-Modell",
			intro:
				"Erkunde die Lichtverhältnisse im Wald, schütze den Forellenbach und baue eine richtige Nahrungskette auf!",
			controls: [
				{
					key: "stockwerk",
					label: "Beobachtetes Wald-Stockwerk",
					options: [
						{ value: "moos", label: "Moosschicht (schattig & feucht)" },
						{ value: "strauch", label: "Strauchschicht (Hasel & Holunder)" },
						{ value: "baum", label: "Baumschicht (sonnige Baumkronen)" },
					],
				},
				{
					key: "bach",
					label: "Zustand des Baches",
					options: [
						{ value: "belastet", label: "Begradigt, warm & mit Abwasser belastet" },
						{
							value: "naturnah",
							label: "Naturnah, kühl & beschattet durch Uferbäume",
						},
					],
				},
				{
					key: "kette",
					label: "Nahrungskette schalten",
					options: [
						{
							value: "falsch",
							label: "Bachforelle → Alge → Graureiher (verdreht!)",
						},
						{
							value: "wasserKette",
							label: "Alge → Köcherfliegenlarve → Bachforelle → Graureiher",
						},
					],
				},
			],
			initialState: {
				stockwerk: "moos",
				bach: "belastet",
				kette: "falsch",
			},
			goals: [
				{
					id: "g8-baumkrone",
					title: "Untersuche die lichtreiche Baumschicht ganz oben im Wald",
					check: (s) => s.stockwerk === "baum",
					witness: { stockwerk: "baum", bach: "belastet", kette: "falsch" },
				},
				{
					id: "g8-forelle",
					title: "Stelle für die Bachforelle einen kühlen, naturnahen Bach her",
					check: (s) => s.bach === "naturnah",
					witness: { stockwerk: "moos", bach: "naturnah", kette: "falsch" },
				},
				{
					id: "g8-nahrungskette",
					title: "Verbinde naturnahen Bach und richtige Gewässer-Nahrungskette",
					check: (s) => s.bach === "naturnah" && s.kette === "wasserKette",
					witness: {
						stockwerk: "moos",
						bach: "naturnah",
						kette: "wasserKette",
					},
				},
			],
			readouts: (s) => [
				{
					label: "Wald-Beobachtung",
					value:
						s.stockwerk === "baum"
							? "Baumschicht: Volles Sonnenlicht, stärkerer Wind – Heimat von Eichhörnchen, Specht und Eiche."
							: s.stockwerk === "strauch"
								? "Strauchschicht: Halbschatten – Beerensträucher bieten Vögeln Nistplatz und Nahrung."
								: "Moosschicht: Wenig Licht, kühle Feuchtigkeit – Moos speichert ein Vielfaches seines Gewichts an Regenwasser!",
				},
				{
					label: "Gewässer & Nahrungskette",
					value:
						s.bach === "naturnah" && s.kette === "wasserKette"
							? "Intaktes Ökosystem: Viel Sauerstoff für Forellen, Nahrungskette startet beim pflanzlichen Erzeuger (Alge)!"
							: s.bach === "belastet"
								? "Warnung: Zu warmes, verschmutztes Wasser enthält zu wenig Sauerstoff für Bachforellen."
								: "Achtung: Jede Nahrungskette beginnt mit einer grünen Pflanze/Alge als Erzeuger (‚wird gefressen von‘ →)!",
				},
			],
		},
		stamp: {
			id: "stamp-wald",
			title: "Biber- & Waldfährte",
			subtitle: "Wald, Gewässer & Nahrungsnetze erkundet",
			symbol: "🌲",
		},
	},
	{
		id: "tierentwicklung-wolf-hund",
		number: 9,
		stageId: "lb3",
		lb: 3,
		sectionCode: "HSU 3/4 · LB 3.1",
		title: "Verwandlungskünstler der Natur & vom Wolf zum Hund",
		shortTitle: "Metamorphose & Hund",
		icon: "🐸",
		hook: "Wie wird aus einer kiemenatmenden Kaulquappe ein lungenatmender Frosch – und warum stammt jeder Haushund vom Wildtier Wolf ab?",
		foundationNote:
			"Aus der 1. und 2. Klasse weißt du schon, dass man Haustiere rücksichtsvoll behandelt – jetzt vergleichen wir ihre Abstammung vom Wolf und verfolgen ganze Tier-Entwicklungen!",
		storyParagraphs: [
			"Manche Tiere sehen als Jungtier völlig anders aus als ihre Eltern und machen eine Verwandlung (Metamorphose) durch. Der Grasfrosch ist ein Lurch (Amphibium – ‚beidlebig‘ im Wasser und an Land): Im Frühling legt das Weibchen Froschlaich (Eier mit schützender Gallerthülle) ins flache Gewässer. Daraus schlüpft die Kaulquappe mit Ruderschwanz und Kiemen. Erst wachsen die Hinterbeine, dann die Vorderbeine! Gleichzeitig bilden sich Lungen aus, der Schwanz bildet sich zurück, und der kleine Jungfrosch hüpft an Land (Haut- und Lungenatmung).",
			"Insekten wie der Siebenpunkt-Marienkäfer durchlaufen eine vollkommene Verwandlung mit vier Stadien: Aus dem gelben Ei auf der Blattunterseite schlüpft die hungrige Larve (sie frisst hunderte Blattläuse!). Danach heftet sie sich fest und wird zur unbeweglichen Puppe – in dieser Puppenruhe baut sich der ganze Körper zum fertigen Marienkäfer mit Deckflügeln um.",
			"Unser ältester tierischer Begleiter, der Haushund, stammt vom Wildtier Wolf ab. Beide sind Raubtiere mit scharfem Geruchs- und Gehörsinn, Reißzähnen (Fang- und Reißgebiss) und ausgeprägter Körpersprache im Rudel bzw. in der Menschenfamilie. Wölfe sind scheue Wildtiere und jagen selbstständig; Hunde sind durch Jahrtausende der Zucht (Domestikation) auf den Menschen geprägt. Artgerechte Hundehaltung verlangt täglichen Auslauf, Erziehung, Tierarztpflege und klare Sicherheitsregeln: Fremde Hunde nie ungefragt anfassen, nicht beim Fressen oder Schlafen stören und niemals schreiend wegrennen (weckt den Jagdtrieb!).",
		],
		factCards: [
			{
				icon: "🐸",
				title: "Grasfrosch-Entwicklung",
				text: "Laich → Kaulquappe (Kiemen) → erst Hinterbeine, dann Vorderbeine → Jungfrosch an Land (Lunge & feuchte Haut).",
			},
			{
				icon: "🐞",
				title: "Marienkäfer-Verwandlung",
				text: "Ei → Larve (Blattlausjäger) → Puppe (Ruhestadium mit Umbau) → erwachsener Käfer.",
			},
			{
				icon: "🐕",
				title: "Wolf & Haushund",
				text: "Gleiche Abstammung & feine Sinne; beim fremden Hund: ruhig stehen bleiben, Besitzer fragen, Fressplatz tabu!",
			},
		],
		workedExample: {
			title: "Begegnung mit einem freilaufenden Hund im Park",
			scenario:
				"Auf dem Heimweg läuft ein neugieriger fremder Hund bellend auf Samir zu. Samir möchte vor Schreck die Arme hochreißen und wegrennen.",
			steps: [
				"Vom Wolf hat auch der Hund den angeborenen Jagdreflex geerbt: Wer schnell wegrennt und wedelt, wirkt wie flüchtende Beute!",
				"Richtiges Verhalten: Ruhig wie ein Baum stehen bleiben, Arme locker am Körper lassen, den Hund nicht direkt anstarren (Anstarren gilt unter Wölfen und Hunden als Drohung).",
				"Erst wenn Besitzerin oder Besitzer den Hund zurückgerufen hat und es ausdrücklich erlaubt, darf man ruhig die Hand zum Beschnuppern hinhalten.",
			],
			conclusion:
				"Wer die Wolfs-Verwandtschaft und Körpersprache des Hundes kennt, verhält sich sicher und verantwortungsvoll.",
		},
		merksatz:
			"Beim Grasfrosch wachsen der Kaulquappe erst die Hinterbeine, dann die Vorderbeine, während Kiemen durch Lungen abgelöst werden. Beim Marienkäfer liegt zwischen Larve und Käfer das Puppenstadium. Der Hund stammt vom Wolf ab und braucht artgerechte Pflege sowie sichere Verhaltensregeln.",
		probenWissen: [
			{
				term: "Metamorphose (Verwandlung)",
				definition:
					"Entwicklung vom Ei über Jugendstadien mit anderem Körperbau zum erwachsenen Tier (z. B. Frosch, Marienkäfer, Schmetterling).",
			},
			{
				term: "Bein-Reihenfolge beim Frosch",
				definition:
					"Zuerst wachsen der Kaulquappe die Hinterbeine, danach brechen die Vorderbeine durch.",
			},
			{
				term: "Puppe (Insekten)",
				definition:
					"Äußerlich ruhiges Verwandlungsstadium zwischen Larve und erwachsenem Insekt (vollkommene Verwandlung).",
			},
			{
				term: "Abstammung des Hundes",
				definition:
					"Alle Hunderassen stammen vom Wolf ab (Raubtiergebiss, Zehengänger, feine Nase, Rudeltier).",
			},
		],
		realWorldQuest:
			"Schau im Frühling oder Sommer an Blättern im Garten oder Park genau hin (ohne Tiere anzufassen): Entdeckst du die dunkelgrau-orangen Marienkäferlarven auf der Jagd nach Blattläusen?",
		quickCheck: {
			question:
				"Welche Beine wachsen einer Kaulquappe bei der Entwicklung zum Grasfrosch zuerst?",
			options: [
				"Zuerst wachsen die Hinterbeine, erst danach die Vorderbeine.",
				"Zuerst wachsen die Vorderbeine, erst an Land die Hinterbeine.",
				"Alle vier Beine sind schon direkt im Froschlaich fertig vorhanden.",
			],
			correctIndex: 0,
			explanation:
				"Merkhilfe: Erst schieben die kräftigen Hinterbeine mit beim Schwimmen, später brechen die Vorderbeine durch und der Schwanz bildet sich zurück!",
		},
		lab: {
			title: "Metamorphose-Rad & Hunde-Versteher",
			intro:
				"Drehe das Entwicklungsrad von Grasfrosch und Marienkäfer und wähle das sichere Verhalten bei einer Hundebegegnung!",
			controls: [
				{
					key: "art",
					label: "Beobachtete Tierart",
					options: [
						{ value: "frosch", label: "Grasfrosch (Lurch)" },
						{ value: "kaefer", label: "Siebenpunkt-Marienkäfer (Insekt)" },
					],
				},
				{
					key: "stadium",
					label: "Entwicklungsstufe",
					options: [
						{ value: "s1", label: "Stufe 1 (Laich / Ei)" },
						{ value: "s2", label: "Stufe 2 (Kaulquappe / Larve)" },
						{ value: "s3", label: "Stufe 3 (Beine & Lunge / Puppe)" },
						{ value: "s4", label: "Stufe 4 (Erwachsenes Tier)" },
					],
				},
				{
					key: "hund",
					label: "Fremder Hund nähert sich",
					options: [
						{ value: "wegrennen", label: "Schreiend wegrennen & anstarren" },
						{
							value: "ruhig",
							label: "Ruhig stehen bleiben, Blick abwenden, Besitzer fragen",
						},
					],
				},
			],
			initialState: {
				art: "frosch",
				stadium: "s1",
				hund: "wegrennen",
			},
			goals: [
				{
					id: "g9-frosch",
					title: "Verfolge beim Grasfrosch Stufe 3: Übergang zu Beinen und Lungenatmung",
					check: (s) => s.art === "frosch" && s.stadium === "s3",
					witness: { art: "frosch", stadium: "s3", hund: "wegrennen" },
				},
				{
					id: "g9-puppe",
					title: "Entdecke beim Marienkäfer Stufe 3: die Puppenruhe",
					check: (s) => s.art === "kaefer" && s.stadium === "s3",
					witness: { art: "kaefer", stadium: "s3", hund: "wegrennen" },
				},
				{
					id: "g9-hund",
					title: "Wähle das sichere Verhalten gegenüber dem fremden Hund",
					check: (s) => s.hund === "ruhig",
					witness: { art: "frosch", stadium: "s1", hund: "ruhig" },
				},
			],
			readouts: (s) => [
				{
					label: "Entwicklungs-Beobachtung",
					value:
						s.art === "frosch"
							? s.stadium === "s1"
								? "Froschlaich: Schwarze Keime in schützender Gallerthülle im flachen Uferwasser."
								: s.stadium === "s2"
									? "Kaulquappe: Lebt ganz im Wasser, atmet mit Kiemen und rudert mit dem Schwanz."
									: s.stadium === "s3"
										? "Umbau: Erst Hinterbeine, dann Vorderbeine! Lungen lösen die Kiemen ab."
										: "Grasfrosch an Land: Atmet durch Lunge und feuchte Haut, fängt Insekten mit Klappzunge."
							: s.stadium === "s1"
								? "Marienkäfer-Eier: Gelbe Eipakete geschützt unter Blättern nah bei Blattläusen."
								: s.stadium === "s2"
									? "Marienkäferlarve: Häutet sich mehrfach und vertilgt hunderte Blattläuse."
									: s.stadium === "s3"
										? "Puppenruhe: Außen unbeweglich festgeheftet, innen entsteht der fertige Käfer!"
										: "Erwachsener Siebenpunkt: Rote Deckflügel mit 7 Punkten warnen Fressfeinde.",
				},
				{
					label: "Hunde-Sicherheit",
					value:
						s.hund === "ruhig"
							? "Sicher: Kein Jagdreflex ausgelöst, kein Drohstarren – verantwortungsvoll gehandelt!"
							: "Gefahr: Wegrennen weckt das Wolfs-Erbe (Jagdtrieb), Anstarren wirkt bedrohlich!",
				},
			],
		},
		stamp: {
			id: "stamp-metamorphose",
			title: "Frosch- & Pfoten-Siegel",
			subtitle: "Tierentwicklung & Hundeverhalten gemeistert",
			symbol: "🐸",
		},
	},
	{
		id: "bauernhof-und-lebensmittel",
		number: 10,
		stageId: "lb3",
		lb: 3,
		sectionCode: "HSU 3/4 · LB 3.1",
		title: "Vom Bauernhof auf den Teller: Eiercode, Getreide & Regionalität",
		shortTitle: "Bauernhof & Lebensmittel",
		icon: "🌾",
		hook: "Was verrät der rote Zahlencode auf jedem Hühnerei – und warum reisen Erdbeeren im Winter manchmal tausende Kilometer weit?",
		foundationNote:
			"Aus der 1. und 2. Klasse kennst du schon Nutztiere, Nutzpflanzen und die Erntezeit heimischer Obstsorten.",
		storyParagraphs: [
			"Auf bayerischen Bauernhöfen entstehen wichtige pflanzliche und tierische Lebensmittel. Auf den Feldern wachsen unsere heimischen Getreidearten: Weizen (ohne lange Grannen, wichtigstes Brotgetreide), Roggen (kräftiges dunkles Brot), Gerste (erkennbar an sehr langen Grannen) und Hafer (wächst in einer lockeren Rispe statt einer Ähre – für Haferflocken!). Vom Saatkorn über Halm und Ähre, die Ernte mit dem Mähdrescher und das Mahlen in der Mühle bis zur Bäckerei steckt viel Arbeit in jedem Laib Brot.",
			"Am Beispiel Hühnerei siehst du direkt, wie Tierwohl, Umwelt und Preis zusammenhängen. Jedes Ei im Handel trägt einen Erzeugercode wie 0-DE-0912341: Die erste Ziffer verrät die Haltungsform! 0 steht für ökologische Erzeugung (Bio-Futter, viel Platz im Stall und Auslauf im Grünen), 1 für Freilandhaltung (tagsüber Auslauf im Freien), 2 für Bodenhaltung (nur im Stall ohne Auslauf ins Freie, bis zu 9 Hennen pro m²) und 3 für Kleingruppen-/Käfighaltung (sehr wenig Platz). Danach folgt das Land (DE = Deutschland) und in Deutschland das Bundesland (09 = Bayern!). Mehr Platz und Bio-Futter kosten die Bäuerin oder den Bauern mehr – deshalb sind Bio- und Freilandeier teurer, bieten den Tieren aber ein deutlich artgerechteres Leben.",
			"Im Supermarkt liegen heute das ganze Jahr über fast alle Obst- und Gemüsesorten. Doch Erdbeeren oder Spargel im Januar stammen aus fernen Ländern (lange Lkw- oder Flugzeugtransporte mit hohem Treibstoffverbrauch und CO₂-Ausstoß) oder aus stark beheizten Gewächshäusern. Regionale und saisonale Produkte (aus unserer Region zur natürlichen Erntezeit) kommen frisch auf kurzem Weg zu uns und schonen das Klima.",
		],
		factCards: [
			{
				icon: "🥚",
				title: "Eierstempel knacken",
				text: "0 = Bio, 1 = Freiland, 2 = Bodenhaltung, 3 = Käfig/Kleingruppe · DE = Deutschland · 09 = Bayern.",
			},
			{
				icon: "🌾",
				title: "Heimisches Getreide",
				text: "Ährengetreide: Weizen, Roggen, Gerste (lange Grannen). Rispengetreide: Hafer.",
			},
			{
				icon: "🚜",
				title: "Regional & saisonal",
				text: "Kurze Transportwege, keine beheizten Winter-Gewächshäuser, frische Ernte aus der Umgebung.",
			},
		],
		workedExample: {
			title: "Detektiv-Blick auf den Eierkarton: 1-DE-0945121 vs. 2-NL-...",
			scenario:
				"Im Laden kosten zehn Eier mit Code 2-NL-... etwas weniger als zehn Eier mit Code 1-DE-0945121.",
			steps: [
				"Erste Ziffer prüfen: ‚2‘ bedeutet reine Stall-Bodenhaltung ohne grüne Wiese; ‚1‘ bedeutet Freilandhaltung mit Auslauf im Freien.",
				"Länder- und Regionscode prüfen: ‚DE-09‘ zeigt, dass das Ei von einem Hof aus Bayern stammt – also kurze Transportwege hat.",
				"Preis verstehen: Auslauffläche, Pflege und kürzere Herdengrößen kosten mehr Arbeit und Fläche, fördern aber Tierwohl und regionale Höfe.",
			],
			conclusion:
				"Mit unserer Kaufentscheidung an der Kasse bestimmen wir mit, wie Nutztiere gehalten werden und wie weit Lebensmittel reisen.",
		},
		merksatz:
			"Auf jedem Ei zeigt die erste Ziffer die Haltung (0 = Bio, 1 = Freiland, 2 = Boden, 3 = Käfig), gefolgt vom Land (DE) und Bundesland (09 = Bayern). Regionale und saisonale Lebensmittel sparen lange Transporte und Energie.",
		probenWissen: [
			{
				term: "Eiercode 0 – 1 – 2 – 3",
				definition:
					"0 = Ökologische Erzeugung (Bio), 1 = Freilandhaltung, 2 = Bodenhaltung (nur Stall), 3 = Kleingruppen-/Käfighaltung.",
			},
			{
				term: "Ländercode & 09",
				definition:
					"DE = Deutschland (AT = Österreich, NL = Niederlande); die Ziffern 09 nach DE stehen für Bayern.",
			},
			{
				term: "Ähre vs. Rispe",
				definition:
					"Weizen, Roggen und Gerste tragen Körner an einer Ähre; Hafer trägt seine Körner an einer verzweigten Rispe.",
			},
			{
				term: "Ökologische Kosten",
				definition:
					"Belastungen für Klima, Wasser und Natur durch lange Ferntransporte, Flugware oder beheizte Gewächshäuser.",
			},
		],
		realWorldQuest:
			"Öffne zu Hause den Kühlschrank und prüfe bei drei Lebensmitteln (z. B. Eier, Milch, Äpfel), woher sie kommen!",
		quickCheck: {
			question:
				"Wofür steht der Beginn ‚0-DE-09‘ auf einem gestempelten Hühnerei?",
			options: [
				"Käfighaltung mit null Auslauf aus Norddeutschland.",
				"Ökologische Erzeugung (Bio) aus Deutschland, Bundesland Bayern.",
				"Freilandhaltung mit 9 Hühnern aus Dänemark.",
			],
			correctIndex: 1,
			explanation:
				"0 = Bio-Haltung, DE = Deutschland und 09 ist die amtliche Kennzahl für das Bundesland Bayern!",
		},
		lab: {
			title: "Eiercode-Scanner & Saison-Marktstand",
			intro:
				"Stelle den Eierstempel am Scanner ein und vergleiche Tierwohl, Herkunft und Saison-Einkauf!",
			controls: [
				{
					key: "haltung",
					label: "1. Stelle im Eierstempel",
					options: [
						{ value: "3", label: "3 – Kleingruppe / Käfig" },
						{ value: "2", label: "2 – Bodenhaltung (nur Stall)" },
						{ value: "1", label: "1 – Freilandhaltung" },
						{ value: "0", label: "0 – Ökologische Erzeugung (Bio)" },
					],
				},
				{
					key: "herkunft",
					label: "Länder- & Regionskennung",
					options: [
						{ value: "fern", label: "Weiter Ferntransport" },
						{ value: "de09", label: "DE-09 (Hof aus Bayern)" },
					],
				},
				{
					key: "obst",
					label: "Obstkauf für das Frühstück",
					options: [
						{ value: "flugJanuar", label: "Eingeflogene Beeren im Januar" },
						{
							value: "regionalSaison",
							label: "Heimische Ernte passend zur Jahreszeit",
						},
					],
				},
			],
			initialState: {
				haltung: "3",
				herkunft: "fern",
				obst: "flugJanuar",
			},
			goals: [
				{
					id: "g10-bioBayern",
					title: "Stelle den Code 0-DE-09 für ein Bio-Ei aus Bayern ein",
					check: (s) => s.haltung === "0" && s.herkunft === "de09",
					witness: { haltung: "0", herkunft: "de09", obst: "flugJanuar" },
				},
				{
					id: "g10-freiland",
					title: "Prüfe die Freilandhaltung (Code 1) mit täglichem Auslauf",
					check: (s) => s.haltung === "1",
					witness: { haltung: "1", herkunft: "fern", obst: "flugJanuar" },
				},
				{
					id: "g10-saison",
					title: "Kombiniere regionale bayerische Herkunft mit saisonalem Obstkauf",
					check: (s) =>
						(s.haltung === "0" || s.haltung === "1") &&
						s.herkunft === "de09" &&
						s.obst === "regionalSaison",
					witness: {
						haltung: "0",
						herkunft: "de09",
						obst: "regionalSaison",
					},
				},
			],
			readouts: (s) => [
				{
					label: "Entschlüsselter Eierstempel",
					value: `${s.haltung}-${s.herkunft === "de09" ? "DE-09" : "EU-FERN"}… → ${
						s.haltung === "0"
							? "Bio: Grünauslauf, viel Platz im Stall & ökologisches Futter"
							: s.haltung === "1"
								? "Freiland: Tagsüber Auslauf auf der Wiese"
								: s.haltung === "2"
									? "Bodenhaltung: Bewegung im Stall, aber kein Auslauf ins Freie"
									: "Käfig/Kleingruppe: Sehr wenig Platz, kein Auslauf"
					}`,
				},
				{
					label: "Klima- & Transportbilanz",
					value:
						s.herkunft === "de09" && s.obst === "regionalSaison"
							? "Vorbildlich: Kurze Wege aus der Region und natürliche Reifezeit sparen viel Energie!"
							: "Lange Transportwege oder Winter-Flugware verursachen hohe ökologische Kosten.",
				},
			],
		},
		stamp: {
			id: "stamp-bauernhof",
			title: "Goldene Ähre",
			subtitle: "Herkunft, Eiercode & Regionalität geknackt",
			symbol: "🌾",
		},
	},
	{
		id: "strom-und-energie",
		number: 11,
		stageId: "lb3",
		lb: 3,
		sectionCode: "HSU 3/4 · LB 3.2",
		title: "Stromkreise, Leiter, Gefahren & saubere Energie",
		shortTitle: "Strom & Energie",
		icon: "💡",
		hook: "Wann genau leuchtet ein Lämpchen, warum leitet sogar eine Bleistiftmine Strom – und wie erzeugen Sonne und Wind Elektrizität?",
		foundationNote:
			"Aus der 1. und 2. Klasse kennst du schon verschiedene Stoffe wie Metall, Holz, Glas und Kunststoff – heute prüfen wir sie im Stromkreis!",
		storyParagraphs: [
			"Elektrischer Strom fließt nur in einem lückenlos geschlossenen Stromkreis vom einen Pol der Spannungsquelle (z. B. einer 4,5-V-Flachbatterie) durch die Leitungen und das Gerät (z. B. Glühlämpchen) zurück zum anderen Pol! Ein Schalter öffnet oder schließt diese Brücke gezielt. Damit alle auf der Welt Pläne gleich lesen können, zeichnen wir Schaltpläne mit einfachen Schaltzeichen (Batterie: ein langer und ein kurzer dicker Strich; Lampe: Kreis mit Kreuz; Schalter: klappbare Brücke; Leitungen: gerade Linien).",
			"Stoffe, die elektrischen Strom hindurchlassen, heißen elektrische Leiter: Dazu gehören alle Metalle (Kupfer, Eisen, Aluminium, Gold, Silber), außerdem Kohlenstoff als Graphit (unsere Bleistiftmine!) sowie Leitungs- und Salzwasser. Stoffe, die keinen Strom leiten, heißen Nichtleiter (Isolatoren): Kunststoff, Gummi, trockenes Holz, Glas, Porzellan und Wolle – deshalb sind Stromkabel außen mit Kunststoff ummantelt! Elektrische Energie zeigt vier wichtige Wirkungen: Lichtwirkung (Lampe), Wärmewirkung (Toaster, Föhn), Bewegungs-/Kraftwirkung (Mixer, E-Zug) und magnetische Wirkung (Elektromagnet, Türklingel).",
			"ACHTUNG Lebensgefahr: In der Schule experimentieren wir nur mit ungefährlichen Batterien (bis 4,5 V). Die Haushaltssteckdose hat 230 V – niemals Gegenstände hineinstecken, keine defekten Kabel anfassen und niemals Elektrogeräte mit nassen Händen oder an der vollen Badewanne nutzen! Unser Strom entsteht in Kraftwerken: Fossile Kraftwerke (Kohle, Erdgas) liefern zwar wetterunabhängig Strom, verbrauchen aber endliche Rohstoffe und stoßen klimaschädliche Abgase aus. Erneuerbare Energien (Sonne/Photovoltaik, Windräder, Wasserkraft, Biomasse) schonen das Klima; weil Sonne und Wind schwanken, helfen Speicher, Netze und vor allem unser eigenes Energiesparen im Alltag!",
		],
		factCards: [
			{
				icon: "🔌",
				title: "Leiter & Nichtleiter",
				text: "Leiter: Metalle (Kupfer, Eisen), Graphit (Bleistiftmine), Salzwasser. Nichtleiter: Plastik, Gummi, Holz, Glas.",
			},
			{
				icon: "📐",
				title: "Geschlossener Stromkreis",
				text: "Von Pol zu Pol ohne Lücke! Wirkungen: Licht, Wärme, Bewegung und Magnetismus.",
			},
			{
				icon: "⚡",
				title: "230 V Gefahr & Umwelt",
				text: "Steckdose (230 V) = Lebensgefahr, Wasser leitet! Erneuerbare Energien + Stromsparen schützen das Klima.",
			},
		],
		workedExample: {
			title: "Warum leuchtet die Lampe im Prüfstromkreis nicht?",
			scenario:
				"Emilia baut Batterie, Kabel und Lämpchen auf, legt ein Plastiklineal zwischen die Prüfklemmen und schließt den Schalter – dunkel! Danach legt sie eine Bleistiftmine ein – es leuchtet!",
			steps: [
				"Kunststoff (das Lineal) ist ein Nichtleiter (Isolator): Der Stromkreis bleibt elektrisch unterbrochen.",
				"Die Mine im Bleistift besteht nicht aus Blei, sondern aus Graphit (Kohlenstoff) – und Graphit ist ein elektrischer Leiter!",
				"Mit geschlossener Schalterbrücke und dem Leiter Graphit fließt der Strom vollständig von Pol zu Pol durch den Glühdraht.",
			],
			conclusion:
				"Nur bei geschlossenem Stromkreis aus leitfähigen Materialien kann elektrische Energie wirken.",
		},
		merksatz:
			"Strom fließt nur in einem geschlossenen Stromkreis durch elektrische Leiter (alle Metalle, Graphit, Salzwasser). Nichtleiter (Kunststoff, Gummi, Glas, trockenes Holz) schützen als Isolatoren. An 230-V-Steckdosen herrscht Lebensgefahr!",
		probenWissen: [
			{
				term: "Elektrische Leiter",
				definition:
					"Stoffe, die Strom leiten: alle Metalle (Kupfer, Eisen, Alu, Messing), Graphit (Bleistiftmine), Leitungs-/Salzwasser.",
			},
			{
				term: "Nichtleiter (Isolatoren)",
				definition:
					"Stoffe, die keinen Strom leiten: Kunststoff, Gummi, Glas, Porzellan, trockenes Holz, Papier, Stoff.",
			},
			{
				term: "4 Wirkungen des Stroms",
				definition:
					"Lichtwirkung (LED/Lampe), Wärmewirkung (Bügeleisen), Bewegungswirkung (Ventilator), magnetische Wirkung (Kranmagnet).",
			},
			{
				term: "Erneuerbare vs. fossile Stromerzeugung",
				definition:
					"Erneuerbar: Wind, Sonne, Wasser, Biomasse (klimafreundlich, teils wetterabhängig). Fossil: Kohle, Gas (Abgase, endlich).",
			},
		],
		realWorldQuest:
			"Spüre zu Hause ‚Stromfresser‘ im Alltag auf: Welche Geräte leuchten im Stand-by-Modus weiter, und wo hilft eine abschaltbare Steckerleiste?",
		quickCheck: {
			question:
				"Welcher dieser Gegenstände bringt das Lämpchen im geschlossenen Prüfstromkreis zum Leuchten?",
			options: [
				"Ein trockener Holzspatel oder ein Gummiring.",
				"Eine Murmel aus Glas oder ein Legostein aus Kunststoff.",
				"Eine Büroklammer aus Metall oder eine Bleistiftmine aus Graphit.",
			],
			correctIndex: 2,
			explanation:
				"Metalle und Graphit sind elektrische Leiter. Holz, Gummi, Glas und Kunststoff sind Nichtleiter (Isolatoren).",
		},
		lab: {
			title: "Stromkreis-Steckbrett & Schaltplan-Werkstatt",
			intro:
				"Lege verschiedene Prüfstoffe in die Lücke, betätige den Schalter, schalte auf Schaltzeichen um und wähle eine saubere Stromquelle!",
			controls: [
				{
					key: "schalter",
					label: "Schalterstellung",
					options: [
						{ value: "offen", label: "Offen (unterbrochen)" },
						{ value: "zu", label: "Geschlossen" },
					],
				},
				{
					key: "stoff",
					label: "Prüfstoff in den Klemmen",
					options: [
						{ value: "plastik", label: "Kunststoff-Lineal" },
						{ value: "holz", label: "Trockenes Holzstäbchen" },
						{ value: "kupfer", label: "Kupfermünze" },
						{ value: "graphit", label: "Bleistiftmine (Graphit)" },
					],
				},
				{
					key: "darstellung",
					label: "Ansicht & Energiewahl",
					options: [
						{ value: "aufbauKohle", label: "Aufbau-Bild · Kohlestrom" },
						{
							value: "schaltplanSolar",
							label: "Schaltplan mit Symbolen · Solar & Wind",
						},
					],
				},
			],
			initialState: {
				schalter: "offen",
				stoff: "plastik",
				darstellung: "aufbauKohle",
			},
			goals: [
				{
					id: "g11-kupfer",
					title: "Schließe den Stromkreis mit der Kupfermünze, sodass die Lampe leuchtet",
					check: (s) => s.schalter === "zu" && s.stoff === "kupfer",
					witness: {
						schalter: "zu",
						stoff: "kupfer",
						darstellung: "aufbauKohle",
					},
				},
				{
					id: "g11-graphitPlan",
					title: "Bringe die Lampe mit Graphit zum Leuchten und zeige den Schaltplan",
					check: (s) =>
						s.schalter === "zu" &&
						s.stoff === "graphit" &&
						s.darstellung === "schaltplanSolar",
					witness: {
						schalter: "zu",
						stoff: "graphit",
						darstellung: "schaltplanSolar",
					},
				},
				{
					id: "g11-isolator",
					title: "Prüfe bei geschlossenem Schalter, dass trockenes Holz isoliert",
					check: (s) => s.schalter === "zu" && s.stoff === "holz",
					witness: {
						schalter: "zu",
						stoff: "holz",
						darstellung: "aufbauKohle",
					},
				},
			],
			readouts: (s) => {
				const leitet = s.stoff === "kupfer" || s.stoff === "graphit";
				const brennt = s.schalter === "zu" && leitet;
				return [
					{
						label: "Prüflämpchen",
						value: brennt
							? `LEUCHTET HELL! (${s.stoff === "kupfer" ? "Metall Kupfer" : "Graphit"} ist ein elektrischer Leiter)`
							: s.schalter === "offen"
								? "Aus – der Schalter ist noch geöffnet (Lücke im Stromkreis)."
								: `Aus – ${s.stoff === "holz" ? "trockenes Holz" : "Kunststoff"} ist ein Nichtleiter (Isolator).`,
					},
					{
						label: "Schaltplan & Kraftwerk",
						value:
							s.darstellung === "schaltplanSolar"
								? "Norm-Schaltzeichen aktiv (Kreis mit Kreuz = Lampe) · Klimafreundlicher Solar- & Windstrom!"
								: "Aufbau-Ansicht · Tipp: Schalte um auf Schaltzeichen und erneuerbare Energie!",
					},
				];
			},
		},
		stamp: {
			id: "stamp-strom",
			title: "Leuchtende Glühbirne",
			subtitle: "Stromkreis, Leiter & Energie erforscht",
			symbol: "💡",
		},
	},
	{
		id: "feuer-und-brandschutz",
		number: 12,
		stageId: "lb3",
		lb: 3,
		sectionCode: "HSU 3/4 · LB 3.2",
		title: "Feuer verstehen: Verbrennungsdreieck & richtig löschen",
		shortTitle: "Feuer & Brandschutz",
		icon: "🔥",
		hook: "Welche drei Dinge braucht jedes Feuer gleichzeitig – und warum darf man brennendes Öl in der Pfanne niemals mit Wasser löschen?",
		foundationNote:
			"Aus der 1. und 2. Klasse kennst du schon Rauchmelder, Fluchtwege in der Schule und den sicheren Umgang mit Streichhölzern.",
		storyParagraphs: [
			"Feuer spendet Wärme und Licht, kann aber außer Kontrolle geraten. Damit überhaupt eine Verbrennung stattfindet, müssen immer genau drei Voraussetzungen gleichzeitig erfüllt sein – das berühmte Verbrennungsdreieck: 1. ein brennbarer Stoff (z. B. Holz, Wachs, Papier, Öl), 2. Sauerstoff (aus der Luft) und 3. die passende Entzündungstemperatur (Zündwärme, die bei Streichholzkopf, Papier, Holz oder Eisen ganz unterschiedlich hoch liegt).",
			"Aus dem Verbrennungsdreieck kannst du jede Löschmethode logisch ableiten! Denn sobald auch nur EINE der drei Ecken fehlt, erlischt das Feuer sofort: Mit Wasser kühlst du brennendes Holz oder Papier unter seine Entzündungstemperatur ab. Mit einem Glas über dem Teelicht, Sand, einem Topfdeckel oder einer Löschdecke erstickst du die Flamme durch Entzug von Sauerstoff. Und wenn Waldarbeiter eine Schneise schlagen oder man das Gas abdreht, nimmt man den brennbaren Stoff weg.",
			"Lebenswichtige Sicherheitsregel: Einen Fett- oder Ölbrand in der Küche sowie brennende Elektrogeräte darfst du NIEMALS mit Wasser löschen! Heißes Fett ist über 300 °C heiß – ein Schuss Wasser verdampft schlagartig zu einer riesigen Dampfwolke (aus 1 Liter Wasser werden rund 1 700 Liter Wasserdampf!) und reißt brennende Fetttropfen in einer gefährlichen Fettexplosion mit. Richtig: Herd ausschalten, Flamme mit einem passenden Metalldeckel oder einer Löschdecke ersticken (Sauerstoff entziehen!) und im Brandfall: Ruhe bewahren, Raum verlassen, Türen schließen (kein Aufzug!), Notruf 112!",
		],
		factCards: [
			{
				icon: "🔺",
				title: "Das Verbrennungsdreieck",
				text: "1. Brennbarer Stoff + 2. Sauerstoff + 3. Entzündungstemperatur. Fehlt eine Ecke, geht das Feuer aus!",
			},
			{
				icon: "🪣",
				title: "Drei Löschprinzipien",
				text: "Abkühlen (Wasser bei Holz), Ersticken / Sauerstoff entziehen (Deckel, Sand, Löschdecke), Brennstoff entfernen.",
			},
			{
				icon: "⚠️",
				title: "Achtung Fettbrand!",
				text: "Niemals Wasser in brennendes Öl gießen (Fettexplosion)! Immer mit Topfdeckel oder Löschdecke ersticken.",
			},
		],
		workedExample: {
			title: "Das Teelicht unter dem umgestülpten Trinkglas",
			scenario:
				"Im Sachunterricht stülpt die Lehrerin ein feuerfestes Glas über ein brennendes Teelicht. Die Flamme wird kleiner, flackert kurz und erlischt.",
			steps: [
				"Wir prüfen das Verbrennungsdreieck: Brennbarer Stoff (flüssiges Wachs am Docht) ist noch reichlich da, heiß genug ist es auch.",
				"Aber unter dem geschlossenen Glas verbraucht die Flamme den vorhandenen Sauerstoff aus der eingeschlossenen Luft.",
				"Ohne Nachschub an Sauerstoff fehlt die zweite Ecke des Verbrennungsdreiecks – die Kerze erstickt.",
			],
			conclusion:
				"Jede Löschmethode greift gezielt eine Voraussetzung des Verbrennungsdreiecks an.",
		},
		merksatz:
			"Verbrennungsdreieck: Brennbarer Stoff + Sauerstoff + Entzündungstemperatur. Löschen heißt, mindestens eine Ecke wegzunehmen (kühlen, ersticken oder Brennstoff entfernen). Fettbrände nie mit Wasser löschen, sondern mit einem Deckel ersticken!",
		probenWissen: [
			{
				term: "Verbrennungsdreieck",
				definition:
					"Die drei nötigen Bedingungen für Feuer: brennbarer Stoff, Sauerstoff und Entzündungstemperatur.",
			},
			{
				term: "Entzündungstemperatur",
				definition:
					"Mindesttemperatur, ab der ein bestimmter Stoff mit Sauerstoff zu brennen beginnt (Papier niedriger als Holz).",
			},
			{
				term: "Löschen durch Kühlen",
				definition:
					"Wasser senkt die Temperatur unter die Entzündungstemperatur (gut bei Holz, Papier, Stoff).",
			},
			{
				term: "Löschen durch Ersticken",
				definition:
					"Deckel, Löschdecke, Sand oder Schaum schneiden die Sauerstoffzufuhr ab (Pflicht bei Fettbrand!).",
			},
		],
		realWorldQuest:
			"Prüfe gemeinsam mit deinen Eltern in eurer Wohnung: Hängen in den Schlafräumen und Fluren Rauchmelder an der Decke, und kennt jede Person den Fluchtweg nach draußen?",
		quickCheck: {
			question:
				"Warum erlischt ein brennendes Lagerfeuer, wenn die Feuerwehr es kräftig mit Wasser löscht?",
			options: [
				"Das Wasser kühlt das Holz unter seine Entzündungstemperatur ab.",
				"Das Wasser verwandelt das Holz in unbrennbares Metall.",
				"Wasser entzieht der gesamten Außenluft rund um den Wald den Sauerstoff.",
			],
			correctIndex: 0,
			explanation:
				"Wasser nimmt beim Erwärmen und Verdampfen sehr viel Wärme auf – dadurch sinkt die Temperatur des Holzes unter die Entzündungstemperatur!",
		},
		lab: {
			title: "Verbrennungsdreieck- & Lösch-Labor",
			intro:
				"Wähle zu jeder Brandsituation die sichere Löschmethode und beobachte, welche Ecke im Verbrennungsdreieck verschwindet!",
			controls: [
				{
					key: "brand",
					label: "Brandsituation im Labor",
					options: [
						{ value: "kerze", label: "Brennendes Teelicht auf feuerfester Unterlage" },
						{ value: "lagerfeuer", label: "Kleines Holz-Lagerfeuer in Feuerschale" },
						{ value: "fettpfanne", label: "Brennendes Speiseöl in der Pfanne!" },
					],
				},
				{
					key: "loeschmittel",
					label: "Gewählte Lösch-Aktion",
					options: [
						{ value: "brennenLassen", label: "Nichts tun (alle 3 Ecken aktiv)" },
						{ value: "wasser", label: "Mit Wasser übergießen (Kühlen)" },
						{
							value: "ersticken",
							label: "Glas / Metalldeckel / Löschdecke auflegen (Sauerstoff entziehen)",
						},
					],
				},
			],
			initialState: {
				brand: "kerze",
				loeschmittel: "brennenLassen",
			},
			goals: [
				{
					id: "g12-kerze",
					title: "Ersticke das Teelicht durch Entzug von Sauerstoff",
					check: (s) => s.brand === "kerze" && s.loeschmittel === "ersticken",
					witness: { brand: "kerze", loeschmittel: "ersticken" },
				},
				{
					id: "g12-holz",
					title: "Kühle das Holz-Lagerfeuer mit Wasser unter die Entzündungstemperatur",
					check: (s) => s.brand === "lagerfeuer" && s.loeschmittel === "wasser",
					witness: { brand: "lagerfeuer", loeschmittel: "wasser" },
				},
				{
					id: "g12-fett",
					title: "Lösche den Fettbrand in der Pfanne sicher durch Ersticken (ohne Wasser!)",
					check: (s) =>
						s.brand === "fettpfanne" && s.loeschmittel === "ersticken",
					witness: { brand: "fettpfanne", loeschmittel: "ersticken" },
				},
			],
			readouts: (s) => [
				{
					label: "Verbrennungsdreieck",
					value:
						s.loeschmittel === "brennenLassen"
							? "Alle 3 Ecken aktiv: Brennstoff + Sauerstoff + Entzündungstemperatur → Flamme brennt."
							: s.brand === "fettpfanne" && s.loeschmittel === "wasser"
								? "STOPP – LEBENSGEFAHR! Wasser verdampft im 300 °C heißen Öl schlagartig → Fettexplosion!"
								: s.loeschmittel === "wasser"
									? "Ecke ‚Entzündungstemperatur‘ entfernt: Wasser kühlt den Brennstoff ab → Feuer aus!"
									: "Ecke ‚Sauerstoff‘ entfernt: Deckel/Glas schneidet Luftzufuhr ab → Feuer erstickt sicher!",
				},
				{
					label: "Feuerwehr-Urteil",
					value:
						s.brand === "fettpfanne" && s.loeschmittel === "wasser"
							? "Falsch! Bei brennendem Öl immer Herd aus & Metalldeckel/Löschdecke nutzen!"
							: s.loeschmittel === "brennenLassen"
								? "Wähle eine passende Löschmethode zum Testen."
								: "Sicher gelöscht – Ursache im Verbrennungsdreieck richtig erkannt!",
				},
			],
		},
		stamp: {
			id: "stamp-feuer",
			title: "Brandschutz-Schild",
			subtitle: "Verbrennungsdreieck & Löschregeln beherrscht",
			symbol: "🔥",
		},
	},
	{
		id: "wasser-und-wasserkreislauf",
		number: 13,
		stageId: "lb3",
		lb: 3,
		sectionCode: "HSU 3/4 · LB 3.3",
		title: "Wasser erforschen: Zustandsformen, Wasserkreislauf & Schutz",
		shortTitle: "Wasser & Wasserkreislauf",
		icon: "💧",
		hook: "Warum geht auf der Erde kein Tropfen Wasser verloren – und wie reinigen Sand und Kies im Boden unser Trinkwasser?",
		foundationNote:
			"Aus der 1. und 2. Klasse kennst du schon Luft und Wetterbeobachtungen – heute erforschen wir mit Experimenten den ewigen Kreislauf des Wassers!",
		storyParagraphs: [
			"Wasser begegnet uns in drei Zustandsformen (Aggregatzuständen): Unter 0 °C gefriert es zu festem Eis oder Schnee. Zwischen 0 °C und 100 °C ist es flüssiges Wasser (Gefrierpunkt / Schmelzpunkt bei 0 °C!). Ab 100 °C siedet (kocht) Wasser und verdampft zu unsichtbarem, gasförmigem Wasserdampf (die weißen Schwaden über dem Kochtopf sind bereits winzige kondensierte Wassertröpfchen: Nebel!). Wichtig: Verdunsten kann flüssiges Wasser auch schon weit unter 100 °C, etwa wenn eine Pfütze in der Sonne trocknet! Außerdem löst Wasser viele Stoffe wie Salz oder Zucker (Lösungsmittel), Sand oder Speiseöl lösen sich dagegen nicht; und dank des Auftriebs schwimmt ein hohles Schiff, während eine massive Eisenkugel sinkt.",
			"In der Natur bewegt die Sonne das Wasser in einem endlosen Kreislauf: Sonnenwärme erwärmt Meere, Seen, Flüsse und Wälder – Wasser verdunstet und steigt als unsichtbarer Wasserdampf auf. Weiter oben in kühleren Luftschichten kühlt der Wasserdampf ab und kondensiert an feinen Staubteilchen zu winzigen Wassertröpfchen: Wolken entstehen! Werden die Tropfen zu schwer, fallen sie als Niederschlag (Regen, Schnee oder Hagel) zur Erde.",
			"Ein Teil fließt oberirdisch in Bäche und Flüsse, ein großer Teil versickert im Boden: Humus, Sand und Kies filtern Schmutzteilchen natürlich heraus! Trifft das Sickerwasser auf eine wasserundurchlässige Schicht (Ton oder Lehm), sammelt es sich darüber als sauberes Grundwasser, tritt an einer Quelle wieder zutage und fließt über Bäche und Flüsse zurück ins Meer. Weil süßes Trinkwasser kostbar ist und auch in Kleidung, Papier oder Lebensmitteln viel ‚verstecktes‘ (virtuelles) Wasser aus der Herstellung steckt, sparen wir Wasser und halten Waschmittel, Chemikalien, Öl und Müll strikt von Gewässern fern!",
		],
		factCards: [
			{
				icon: "🌡️",
				title: "3 Zustandsformen",
				text: "Fest (Eis unter 0 °C), flüssig (0 °C bis 100 °C), gasförmig (unsichtbarer Wasserdampf; Siedepunkt 100 °C).",
			},
			{
				icon: "☁️",
				title: "Der Wasserkreislauf",
				text: "Verdunstung → Aufsteigen & Abkühlen → Kondensation (Wolken) → Niederschlag → Versickerung → Grundwasser → Quelle → Fluss → Meer.",
			},
			{
				icon: "🪨",
				title: "Bodenfilter & Schutz",
				text: "Sand & Kies lassen Wasser durch und filtern es; Ton/Lehm staut das Grundwasser. Kein Öl oder Gift ins Abwasser!",
			},
		],
		workedExample: {
			title: "Der Bodenfilter-Versuch im Bechertrichter",
			scenario:
				"Deine Forschungsgruppe vermutet: ‚Kies und feiner Sand reinigen trübes Gartenwasser besser als grobe Steine allein, während Ton kein Wasser durchlässt.‘",
			steps: [
				"Versuchsaufbau: In Trichter A liegen Kiesel und feiner gewaschener Sand, in Trichter B liegt fest gedrückter Ton. Oben wird gleich viel Erd-Wasser eingegossen.",
				"Beobachtung: Bei Trichter A tropft unten deutlich klareres Wasser heraus (gelöste Stoffe wie Salz oder Spülmittel bleiben allerdings unsichtbar darin – noch kein Trinkwasser!).",
				"Bei Trichter B bleibt das Wasser auf der dichten Tonschicht stehen – genau wie Grundwasser über einer Tonschicht in der Natur!",
			],
			conclusion:
				"Natürliche Sand- und Kiesschichten filtern Schwebstoffe, aber chemische Verschmutzungen (Öl, Waschmittel, Dünger) gefährden das Grundwasser trotzdem!",
		},
		merksatz:
			"Natürlicher Wasserkreislauf: Verdunstung → Kondensation (Wolkenbildung) → Niederschlag → Versickerung durch wasserdurchlässige Sand-/Kiesschichten → Grundwasser über wasserundurchlässigem Ton/Lehm → Quelle → Fluss → Meer.",
		probenWissen: [
			{
				term: "Verdunstung vs. Verdampfung",
				definition:
					"Verdunsten geschieht an der Oberfläche schon unter 100 °C (z. B. Pfütze, Wäsche); Sieden/Verdampfen im ganzen Wasser bei 100 °C.",
			},
			{
				term: "Kondensation",
				definition:
					"Übergang vom unsichtbaren gasförmigen Wasserdampf zurück zu flüssigen Wassertröpfchen beim Abkühlen (Wolken, beschlagener Spiegel).",
			},
			{
				term: "Wasserdurchlässige vs. stauende Schicht",
				definition:
					"Humus, Sand und Kies lassen Wasser versickern und filtern es; Ton, Lehm und dichter Fels stauen das Grundwasser.",
			},
			{
				term: "Virtuelles (verstecktes) Wasser",
				definition:
					"Wassermenge, die bei der Herstellung von Waren (z. B. Baumwoll-Jeans, Papier, Fleisch) verbraucht wird.",
			},
		],
		realWorldQuest:
			"Mini-Experiment in der Küche: Hauche einen kühlen Badezimmerspiegel an – woher kommen die feinen Tröpfchen? Das ist echte Kondensation wie bei einer Wolke!",
		quickCheck: {
			question:
				"Welche Bodenschicht staut das versickerte Regenwasser im Untergrund, sodass sich darüber Grundwasser sammelt?",
			options: [
				"Eine lockere Schicht aus grobem Flusskies.",
				"Eine wasserundurchlässige Schicht aus Ton oder Lehm.",
				"Eine dünne Schicht aus trockenen Laubblättern.",
			],
			correctIndex: 1,
			explanation:
				"Durch Humus, Sand und Kies sickert das Wasser hindurch und wird gefiltert. Erst eine dichte Ton- oder Lehmschicht ist wasserundurchlässig und staut das Grundwasser!",
		},
		lab: {
			title: "Wasserkreislauf- & Bodenfilter-Modell",
			intro:
				"Steuere Sonnenwärme, Höhenkühle und den Blick in die Bodenschichten, um den gesamten Wasserkreislauf in Gang zu setzen!",
			controls: [
				{
					key: "sonne",
					label: "Sonneneinstrahlung über dem See",
					options: [
						{ value: "schwach", label: "Kühl & bedeckt (kaum Verdunstung)" },
						{ value: "stark", label: "Warme Sonne (starke Verdunstung)" },
					],
				},
				{
					key: "hoehenluft",
					label: "Temperatur hoch oben am Berg",
					options: [
						{ value: "warm", label: "Warme Luft (noch kein Regen)" },
						{ value: "kuehl", label: "Kühle Höhenluft (Kondensation & Regen)" },
					],
				},
				{
					key: "boden",
					label: "Bodenprofil & Gewässerschutz",
					options: [
						{ value: "verdeckt", label: "Boden verdeckt" },
						{
							value: "sichtbarSauber",
							label: "Querschnitt offen: Sand/Kies-Filter + Tonschicht → Quelle",
						},
					],
				},
			],
			initialState: {
				sonne: "schwach",
				hoehenluft: "warm",
				boden: "verdeckt",
			},
			goals: [
				{
					id: "g13-verdunstung",
					title: "Starte mit starker Sonnenwärme die Verdunstung über dem See",
					check: (s) => s.sonne === "stark",
					witness: { sonne: "stark", hoehenluft: "warm", boden: "verdeckt" },
				},
				{
					id: "g13-kondensation",
					title: "Löse durch Verdunstung + kühle Höhenluft Wolkenbildung und Regen aus",
					check: (s) => s.sonne === "stark" && s.hoehenluft === "kuehl",
					witness: { sonne: "stark", hoehenluft: "kuehl", boden: "verdeckt" },
				},
				{
					id: "g13-kreislauf",
					title: "Schließe den gesamten Wasserkreislauf inklusive Bodenfilter und Quelle",
					check: (s) =>
						s.sonne === "stark" &&
						s.hoehenluft === "kuehl" &&
						s.boden === "sichtbarSauber",
					witness: {
						sonne: "stark",
						hoehenluft: "kuehl",
						boden: "sichtbarSauber",
					},
				},
			],
			readouts: (s) => [
				{
					label: "Himmel & Atmosphäre",
					value:
						s.sonne === "stark" && s.hoehenluft === "kuehl"
							? "Verdunstung → Kondensation → Niederschlag: Unsichtbarer Wasserdampf wird zu Wolken und regnet ab!"
							: s.sonne === "stark"
								? "Verdunstung läuft: Unsichtbarer Wasserdampf steigt vom See nach oben."
								: "Ruhezustand: Schalte warme Sonne zu, um die Verdunstung anzutreiben.",
				},
				{
					label: "Untergrund & Grundwasser",
					value:
						s.boden === "sichtbarSauber"
							? "Versickerung sichtbar: Sand & Kies filtern das Regenwasser, die Tonschicht staut das Grundwasser bis zur Bergquelle!"
							: "Öffne das Bodenprofil, um Sand, Kies, Tonschicht und Quelle zu verfolgen.",
				},
			],
		},
		stamp: {
			id: "stamp-wasser",
			title: "Kristall-Wassertropfen",
			subtitle: "Wasser, Kreislauf & Grundwasser erforscht",
			symbol: "💧",
		},
	},
];
