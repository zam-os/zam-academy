import { classify, lesson, task } from "./helpers";

export const OPTICS = [
	lesson(2, {
		id: "op-sehen",
		title: "Sehen: Licht vom Sender zum Empfänger",
		illustration: "light",
		model: "light",
		intro:
			"Dein Auge sendet keine Sehstrahlen aus. Du siehst, wenn Licht in dein Auge gelangt.",
		paragraphs: [
			"Eine Lichtquelle sendet selbst Licht aus, etwa die Sonne oder eine eingeschaltete Lampe. Ein Buch ist meist keine Lichtquelle: Es streut einfallendes Licht. Du siehst es, wenn ein Teil dieses Lichts dein Auge erreicht. Im Sender-Empfänger-Modell ist die Quelle der Sender und dein Auge der Empfänger; ein beleuchteter Gegenstand vermittelt den Lichtweg.",
			"Zeichne für ein beleuchtetes Buch Pfeile von der Lampe zum Buch und vom Buch zum Auge. Ein Pfeil vom Auge zum Buch würde den Sehprozess falsch beschreiben. Im völlig dunklen Zimmer siehst du ein nicht selbstleuchtendes Buch auch dann nicht, wenn die Augen offen sind. Nebel oder Staub machen einen Lichtweg von der Seite sichtbar, weil sie Licht in dein Auge streuen.",
			"Im geradlinigen Lichtstrahlmodell beschreiben dünne Linien die Ausbreitungsrichtung in einem gleichartigen durchsichtigen Medium. Lichtstrahlen sind gezeichnete Hilfslinien, keine sichtbaren Fäden. Die Lichtgeschwindigkeit im Vakuum beträgt ungefähr 300 000 km/s. Das Modell erklärt viele Lichtwege, aber nicht alle Eigenschaften des Lichts.",
		],
		takeaway:
			"Sehen heißt: Licht gelangt von einer Quelle, oft über einen streuenden Gegenstand, in dein Auge.",
		quiz: {
			question: "Welcher Lichtweg erklärt das Sehen eines beleuchteten Buchs?",
			answer: "Lampe → Buch → Auge",
			wrong: [
				"Auge → Buch → Lampe",
				"Buch → Lampe → Auge, ohne Beleuchtung des Buchs",
			],
			explanation:
				"Die Lampe beleuchtet das Buch. Von dort gestreutes Licht erreicht das Auge.",
		},
		workshop: classify(
			"Wer sendet selbst Licht aus?",
			["Selbstleuchtend", "Beleuchtet"],
			[
				["Die Sonne", 0, "Die Sonne sendet selbst Licht aus."],
				["Der Mond", 1, "Der Mond streut Sonnenlicht."],
				["Eine eingeschaltete LED", 0, "Die LED ist eine Lichtquelle."],
				[
					"Ein weißes Blatt im Lampenlicht",
					1,
					"Das Blatt streut das einfallende Licht.",
				],
			],
			"Helligkeit allein macht einen Körper nicht zur eigenen Lichtquelle.",
		),
		tasks: {
			1: task(
				"Zeichne den Lichtweg beim Lesen unter einer Schreibtischlampe und erkläre die Richtung der Pfeile.",
				"Die Lampe sendet Licht auf das Blatt. Das Blatt streut einen Teil davon in mein Auge, das als Empfänger wirkt. Die Pfeile zeigen deshalb von der Lampe zum Blatt und vom Blatt zum Auge; mein Auge sendet keine Sehstrahlen aus.",
				[
					"Quelle und Empfänger benannt",
					"Streuung am Blatt",
					"Pfeile in Ausbreitungsrichtung",
				],
				["Wer leuchtet selbst?", "Wie kommt Licht vom Blatt ins Auge?"],
			),
			2: task(
				"Warum sieht man einen Scheinwerferstrahl im Nebel oft seitlich, in sauberer Luft aber kaum? Verwende das Sender-Empfänger-Modell.",
				"Nebeltröpfchen streuen einen Teil des Scheinwerferlichts seitlich in mein Auge. In sauberer Luft wird viel weniger Licht aus dem Strahl zu mir umgelenkt. Ich sehe nicht einen Lichtfaden selbst, sondern Licht, das nach Streuung meinen Empfänger erreicht.",
				[
					"Streuung an Tröpfchen",
					"Lichtweg ins Auge",
					"Modellstrahl von sichtbarem Gegenstand getrennt",
				],
				[
					"Was liegt im Strahlengang?",
					"Welches Licht erreicht dich von der Seite?",
				],
			),
		},
	}),
	lesson(2, {
		id: "op-schatten",
		title: "Schatten und Finsternisse modellieren",
		illustration: "light",
		model: "light",
		intro:
			"Geradlinige Lichtwege erklären scharfe Schatten, Halbschatten und die Stellung von Sonne, Erde und Mond.",
		paragraphs: [
			"Ein undurchsichtiger Körper hält Licht auf. Hinter ihm liegt bei einer kleinen, näherungsweise punktförmigen Quelle ein scharf begrenzter Schattenraum. Zeichne die Randstrahlen von der Quelle an den Kanten des Hindernisses vorbei bis zum Schirm. Der Schatten wird bei gleicher Anordnung größer, wenn das Hindernis näher zur Quelle rückt.",
			"Eine ausgedehnte Lichtquelle kannst du durch viele einzelne Quellpunkte modellieren. Im Kernschatten erreicht kein direktes Licht der Quelle den Schirm. Im Halbschatten ist nur ein Teil der Quelle verdeckt. Beispiel: Eine breite Deckenlampe liefert an einem Stift oft einen unscharfen Schattenrand. Eine kleine Quelle und größere Abstände können die Randunschärfe verringern.",
			"Bei einer Sonnenfinsternis steht der Mond zwischen Sonne und Erde; sein Schatten trifft einen Teil der Erde. Bei einer Mondfinsternis steht die Erde zwischen Sonne und Mond; der Mond gerät in den Erdschatten. Die Umlaufbahnen sind gegeneinander geneigt, deshalb entstehen Finsternisse nicht bei jedem Neu- oder Vollmond. Die Zeichnungen sind nicht maßstäblich. Schaue nie ungeschützt in die Sonne und richte keine Linse darauf.",
		],
		takeaway:
			"Kernschatten: ganze Quelle verdeckt. Halbschatten: teilweise verdeckt. Die Stellung der drei Himmelskörper bestimmt die Finsternis.",
		quiz: {
			question: "Welche Reihenfolge gehört zur Mondfinsternis?",
			answer: "Sonne → Erde → Mond",
			wrong: ["Sonne → Mond → Erde", "Erde → Sonne → Mond"],
			explanation:
				"Der Mond liegt bei einer Mondfinsternis im Schatten der Erde.",
		},
		workshop: classify(
			"Welcher Schattenfall?",
			["Kernschatten", "Halbschatten", "Sonnenfinsternis", "Mondfinsternis"],
			[
				[
					"Kein Teil der Quelle direkt sichtbar",
					0,
					"Die gesamte Quelle ist verdeckt.",
				],
				[
					"Nur ein Teil der Quelle sichtbar",
					1,
					"Direktes Licht aus dem übrigen Teil trifft ein.",
				],
				[
					"Mondschatten fällt auf die Erde",
					2,
					"Der Mond steht zwischen Sonne und Erde.",
				],
				[
					"Der Mond durchquert den Erdschatten",
					3,
					"Die Erde steht zwischen Sonne und Mond.",
				],
			],
			"Zeichne zuerst Quelle, Hindernis und Empfänger, danach die Randstrahlen.",
		),
		tasks: {
			1: task(
				"Eine breite Lampe beleuchtet einen Ball vor einer Wand. Erkläre Kern- und Halbschatten mit zwei Randpunkten der Lampe.",
				"Jeder Randpunkt der Lampe liefert einen eigenen Schatten. Wo beide und auch alle dazwischenliegenden Quellpunkte verdeckt sind, liegt Kernschatten. Wo nur ein Teil verdeckt ist, bleibt die Wand schwächer beleuchtet: Dort liegt Halbschatten.",
				[
					"Ausgedehnte Quelle berücksichtigt",
					"Kernschatten richtig",
					"Halbschatten richtig",
				],
				[
					"Ist die ganze Lampe verdeckt?",
					"Von welchen Quellpunkten kommt noch Licht?",
				],
			),
			2: task(
				"Ein Kind erwartet bei jedem Vollmond eine Mondfinsternis. Erkläre mit einer räumlichen Skizze, warum das nicht stimmt.",
				"Vollmond bedeutet, dass die Erde ungefähr zwischen Sonne und Mond steht. Die Mondbahn ist aber gegen die Erdbahnebene geneigt. Der Mond läuft deshalb meist oberhalb oder unterhalb des Erdschattens vorbei; nur nahe der passenden Bahnknoten kommt es zur Finsternis.",
				[
					"Vollmondstellung erkannt",
					"Bahnneigung erwähnt",
					"Vorbeilaufen am Schatten erklärt",
				],
				[
					"Müssen alle drei genau auf einer Linie liegen?",
					"Welche räumliche Information fehlt einer flachen Skizze?",
				],
			),
		},
	}),
	lesson(2, {
		id: "op-reflexion",
		title: "Reflexion: Winkel immer zum Lot messen",
		illustration: "reflection",
		model: "reflection",
		intro:
			"Am Spiegel bleibt der Winkel zum Lot gleich. Eine raue Fläche verteilt das Licht in viele Richtungen.",
		paragraphs: [
			"Trifft Licht auf eine Oberfläche, kann ein Teil zurückgeworfen werden. Zeichne am Auftreffpunkt das Lot: eine Gerade senkrecht zur Oberfläche. Der Einfallswinkel liegt zwischen einfallendem Strahl und Lot, der Reflexionswinkel zwischen reflektiertem Strahl und Lot. Beide sind gleich groß. Einfallender Strahl, Lot und reflektierter Strahl liegen in einer Ebene.",
			"Beispiel: Ein Strahl trifft unter 30° zum Lot auf einen ebenen Spiegel. Er wird unter 30° zum Lot reflektiert; zur Spiegeloberfläche sind es jeweils 60°. Miss die Winkel nicht versehentlich zur Oberfläche. Ein glatter Spiegel reflektiert paralleles Licht gerichtet. Deshalb kannst du klare Spiegelbilder sehen.",
			"Bei einer rauen Fläche haben kleine Oberflächenstücke unterschiedliche Richtungen und damit verschiedene lokale Lote. Auch dort gilt jeweils das Reflexionsgesetz, insgesamt wird das Licht aber in viele Richtungen verteilt: diffuse Reflexion. Ein Blatt Papier wird so aus vielen Richtungen sichtbar. Fahrradreflektoren nutzen besondere Anordnungen zur Rücklenkung zur Lichtquelle; eine einzelne glatte Fläche leistet das nicht aus allen Richtungen.",
		],
		takeaway:
			"Einfallswinkel = Reflexionswinkel, jeweils zum lokalen Lot. Rauheit verteilt die reflektierten Richtungen.",
		quiz: {
			question:
				"Ein Lichtstrahl trifft unter 20° zum Lot auf einen ebenen Spiegel. Wie groß ist der Reflexionswinkel zum Lot?",
			answer: "20°",
			wrong: ["70°", "40°"],
			explanation: "Beide Winkel werden zum Lot gemessen und sind gleich groß.",
		},
		workshop: classify(
			"Wie wird Licht zurückgeworfen?",
			["Gerichtete Reflexion", "Diffuse Reflexion", "Falsche Winkelangabe"],
			[
				[
					"Paralleles Licht an einer glatten Spiegelfläche",
					0,
					"Die lokalen Lote zeigen gleich.",
				],
				[
					"Licht an rauem Papier in viele Richtungen",
					1,
					"Unterschiedliche lokale Lote verteilen die Richtungen.",
				],
				[
					"Einfallswinkel wird zur Oberfläche gemessen",
					2,
					"Das Reflexionsgesetz benutzt den Winkel zum Lot.",
				],
				[
					"Einfall 40° zum Lot, Reflexion 40° zum Lot",
					0,
					"Das Winkelpaar erfüllt das Reflexionsgesetz.",
				],
			],
			"Diffuse Reflexion verletzt das Reflexionsgesetz nicht.",
		),
		tasks: {
			1: task(
				"Zeichne einen Spiegel, das Lot und einen einfallenden Strahl mit 35° zum Lot. Ergänze den reflektierten Strahl und beschrifte beide Winkel.",
				"Das Lot steht senkrecht auf dem Spiegel am Auftreffpunkt. Der reflektierte Strahl liegt auf der anderen Seite des Lots und bildet ebenfalls 35° mit ihm. Beide Strahlen und das Lot liegen in derselben Ebene; Pfeile zeigen zum Spiegel hin und von ihm weg.",
				[
					"Lot senkrecht",
					"Beide Winkel 35° zum Lot",
					"Pfeilrichtungen stimmen",
				],
				[
					"Wo treffen sich die Linien?",
					"Ist der Winkel zur Fläche oder zum Lot markiert?",
				],
			),
			2: task(
				"Warum erkennst du auf weißem Papier kein scharfes Spiegelbild, kannst es aber aus vielen Richtungen sehen? Widerlege dabei „Papier reflektiert kein Licht“.",
				"Papier reflektiert Licht diffus. Seine kleinen rauen Flächen haben unterschiedliche Lote, sodass die jeweils gesetzmäßig reflektierten Strahlen in viele Richtungen gelangen. Dadurch sehen viele Beobachter das Papier; die geordnete Zuordnung für ein scharfes Spiegelbild fehlt.",
				[
					"Diffuse Reflexion benannt",
					"Lokale Lote erklärt",
					"Sichtbarkeit von Spiegelbild getrennt",
				],
				[
					"Was erreicht die Augen der Beobachter?",
					"Wie liegen die kleinen Oberflächenstücke?",
				],
			),
		},
	}),
	lesson(2, {
		id: "op-spiegelbild",
		title: "Wo liegt das Bild im ebenen Spiegel?",
		illustration: "reflection",
		intro:
			"Das Licht kommt von der Spiegelfläche. Die rückwärtigen Verlängerungen weisen auf ein virtuelles Bild.",
		paragraphs: [
			"Licht von einem Gegenstand wird am Spiegel reflektiert und gelangt ins Auge. Verlängerst du die reflektierten Strahlen geradlinig hinter den Spiegel zurück, scheinen sie von einem Bildpunkt dort zu kommen. Tatsächlich läuft an diesem Ort kein Licht vom Gegenstand zusammen. Das Spiegelbild ist deshalb virtuell und lässt sich dort nicht auf einem Schirm auffangen.",
			"Beim ebenen Spiegel liegt der Bildpunkt genauso weit hinter der Spiegelebene wie der Gegenstand davor. Das Bild ist gleich groß und aufrecht. Steht ein Spielstein 15 cm vor dem Spiegel, erscheint sein Bild 15 cm dahinter. Der Abstand zwischen Spielstein und Bild beträgt dann 30 cm. Die Strahlen sind nur vor dem Spiegel echte Lichtwege; rückwärtige Verlängerungen zeichnest du gestrichelt.",
			"Der Spiegel kehrt die Richtung senkrecht zur Spiegelfläche um. Die alltagssprachliche „Links-rechts-Vertauschung“ hängt davon ab, wie du dich mit deinem Spiegelbild vergleichst. Eine Schrift erscheint spiegelverkehrt. Für die Konstruktion reichen zwei geeignete Strahlen oder die Symmetrie zur Spiegelebene; das Reflexionsgesetz begründet die Lage des Bildes.",
		],
		takeaway:
			"Ebenes Spiegelbild: aufrecht, gleich groß und virtuell; Bildweite hinter dem Spiegel = Gegenstandsweite davor.",
		quiz: {
			question:
				"Ein Gegenstand steht 12 cm vor einem ebenen Spiegel. Wo erscheint sein Bild?",
			answer: "12 cm hinter der Spiegelebene",
			wrong: ["Auf der Spiegeloberfläche", "24 cm hinter der Spiegelebene"],
			explanation:
				"Gegenstands- und Bildabstand zur Spiegelebene sind gleich groß.",
		},
		workshop: classify(
			"Bild oder wirklicher Lichtweg?",
			[
				"Eigenschaft des Spiegelbilds",
				"Wirklicher Lichtweg",
				"Rückwärtige Verlängerung",
			],
			[
				[
					"Gleich groß und aufrecht",
					0,
					"Ein ebener Spiegel verändert die Bildgröße nicht.",
				],
				[
					"Gegenstand → Spiegel → Auge",
					1,
					"Dort breitet sich Licht tatsächlich aus.",
				],
				[
					"Gestrichelte Linie hinter dem Spiegel",
					2,
					"Dort wird der reflektierte Strahl nur zurückverlängert.",
				],
				[
					"Nicht auf einem Schirm hinter dem Spiegel auffangbar",
					0,
					"Das Bild ist virtuell.",
				],
			],
			"Trenne reale Strahlen vor der Fläche von gedachten Verlängerungen dahinter.",
		),
		tasks: {
			1: task(
				"Ein Spielstein steht 8 cm vor dem ebenen Spiegel. Beschreibe Bildlage, Bildgröße und den Abstand zwischen Spielstein und Bild.",
				"Das Bild liegt 8 cm hinter der Spiegelebene, ist gleich groß und aufrecht. Zwischen Stein und Bild liegen insgesamt 16 cm. Es ist virtuell: Hinter dem Spiegel treffen keine vom Stein kommenden realen Lichtstrahlen zusammen.",
				[
					"Bildlage 8 cm dahinter",
					"Größe und Orientierung",
					"16 cm und virtuelles Bild",
				],
				[
					"Wie weit ist das Bild von der Fläche entfernt?",
					"Wo laufen echte Lichtstrahlen?",
				],
			),
			2: task(
				"Jemand möchte das Spiegelbild auf ein Blatt hinter dem Spiegel projizieren. Begründe, warum das mit einem ebenen Spiegel nicht gelingt, und beschreibe eine passende Strahlenzeichnung.",
				"Die reflektierten Strahlen laufen vor dem Spiegel zum Auge. Nur ihre rückwärtigen Verlängerungen schneiden sich hinter dem Spiegel. Ich zeichne diese gestrichelt; an ihrem Schnittpunkt konzentriert sich kein echtes Licht für eine Projektion auf das Blatt.",
				[
					"Virtuell erklärt",
					"Reale Strahlen vor dem Spiegel",
					"Verlängerungen gestrichelt",
				],
				[
					"Wo befindet sich der echte Strahl?",
					"Was bedeutet ein virtueller Bildpunkt?",
				],
			),
		},
	}),
	lesson(2, {
		id: "op-brechung",
		title: "Brechung: Licht wechselt das Medium",
		illustration: "refraction",
		model: "refraction",
		intro:
			"Ein Strohhalm scheint an der Wasseroberfläche geknickt. Das Licht ändert dort seine Richtung.",
		paragraphs: [
			"In Wasser breitet sich Licht langsamer aus als in Luft. Beim schrägen Übergang zwischen diesen Medien ändert ein Teil des Lichts seine Richtung: Es wird gebrochen. Beim Übergang Luft → Wasser wird der Strahl zum Lot hin gebrochen, beim Übergang Wasser → Luft vom Lot weg. Ein senkrecht einfallender Strahl ändert seine Richtung nicht, obwohl sich seine Geschwindigkeit ändert.",
			"Beispiel Strohhalm: Licht vom untergetauchten Teil wird beim Austritt aus dem Wasser vom Lot weg gebrochen. Dein Auge verlängert den ankommenden Strahl gedanklich geradlinig zurück. Deshalb erscheint der Gegenstand näher an der Wasseroberfläche; man spricht von optischer Hebung. Der Strohhalm selbst ist nicht geknickt.",
			"Zeichne Grenzfläche und Lot am Übergang, dann Einfalls- und gebrochenen Strahl mit Pfeilen. „Optisch dichter“ bezeichnet hier die geringere Lichtgeschwindigkeit, nicht automatisch die größere Massendichte. Das Modell berechnet die Strahlrichtung im Hintergrund für ebene, gleichartige Medien; du erklärst den Verlauf qualitativ, ohne ein Brechungsgesetz zu rechnen.",
		],
		takeaway:
			"Luft → Wasser: zum Lot. Wasser → Luft: vom Lot. Ursache ist die unterschiedliche Lichtgeschwindigkeit.",
		quiz: {
			question:
				"Wie wird ein schräger Lichtstrahl beim Übergang von Luft in Wasser gebrochen?",
			answer: "Zum Lot hin",
			wrong: ["Vom Lot weg", "Immer um genau 90°"],
			explanation:
				"In Wasser ist die Lichtgeschwindigkeit geringer; bei schrägem Eintritt wird der Strahl zum Lot gebrochen.",
		},
		workshop: classify(
			"Welche Richtungsänderung?",
			["Zum Lot", "Vom Lot", "Keine Richtungsänderung"],
			[
				[
					"Schräger Übergang Luft → Wasser",
					0,
					"Das zweite Medium ist optisch dichter.",
				],
				[
					"Schräger Austritt Wasser → Luft unterhalb des Grenzwinkels",
					1,
					"Der austretende Strahl liegt weiter vom Lot entfernt.",
				],
				[
					"Senkrechter Eintritt in Wasser",
					2,
					"Der Strahl verläuft auf dem Lot weiter.",
				],
				[
					"Senkrechter Austritt aus Wasser",
					2,
					"Die Geschwindigkeit ändert sich, die Richtung nicht.",
				],
			],
			"Beziehe die Richtung immer auf das Lot und auf die Reihenfolge der Medien.",
		),
		tasks: {
			1: task(
				"Zeichne einen schrägen Strahl von Luft in Wasser mit Grenzfläche und Lot. Erkläre, welche Eigenschaft des Lichts sich ändert und wie der Strahl weiterläuft.",
				"An der Wasseroberfläche zeichne ich ein senkrechtes Lot. Der Strahl wird in Wasser zum Lot hin gebrochen, weil Licht dort langsamer als in Luft ist. Seine Ausbreitungsrichtung und Geschwindigkeit ändern sich; das Wasser muss dafür nicht bewegt werden.",
				["Grenzfläche und Lot", "Zum Lot hin", "Geschwindigkeitsunterschied"],
				["Wo ist Licht langsamer?", "Welche Linie ist der Winkelbezug?"],
			),
			2: task(
				"Ein Gegenstand am Beckenboden erscheint höher zu liegen. Erkläre den Lichtweg bis zum Auge und die scheinbare Lage ohne eine Rechenformel.",
				"Licht vom Gegenstand tritt schräg aus Wasser in Luft aus und wird vom Lot weg gebrochen. Das Auge ordnet die ankommenden Strahlen ihren geraden rückwärtigen Verlängerungen zu. Diese weisen auf einen höher liegenden scheinbaren Ort, obwohl der Körper am Boden bleibt.",
				[
					"Austrittsrichtung korrekt",
					"Geradlinige Rückverlängerung",
					"Scheinbare von echter Lage getrennt",
				],
				[
					"Wie verläuft der Strahl nach dem Austritt?",
					"Woher scheint er zu kommen?",
				],
			),
		},
	}),
	lesson(2, {
		id: "op-totalreflexion",
		title: "Totalreflexion: Licht bleibt im Medium",
		illustration: "refraction",
		model: "refraction",
		intro:
			"Beim richtigen Übergang und einem großen Einfallswinkel kann das Licht vollständig zurückbleiben.",
		paragraphs: [
			"Beim Übergang vom optisch dichteren ins optisch dünnere Medium wird Licht vom Lot weg gebrochen. Mit wachsendem Einfallswinkel läuft der gebrochene Strahl immer flacher an der Grenzfläche entlang. Beim Grenzwinkel verläuft er entlang der Grenzfläche. Für noch größere Einfallswinkel gibt es keinen austretenden gebrochenen Strahl mehr: Totalreflexion tritt auf.",
			"Für Wasser → Luft liegt der Grenzwinkel ungefähr bei 49°. Ein Einfallswinkel von 35° lässt noch Licht austreten; bei 55° tritt im idealisierten Modell Totalreflexion auf. Beim umgekehrten Übergang Luft → Wasser entsteht diese Totalreflexion nicht. Vergleiche im Modell die Reihenfolge der Medien, statt nur einen großen Winkel einzustellen.",
			"Lichtleiter führen Licht durch wiederholte Totalreflexion an geeigneten Grenzflächen. Dafür müssen Material und Winkel passen. In echten Leitern treten trotzdem Verluste auf. Eine glänzende Oberfläche allein ist kein Nachweis für Totalreflexion: Ein gewöhnlicher Spiegel arbeitet durch Reflexion an seiner Beschichtung. Unterscheide Ursache und beobachteten Lichtweg.",
		],
		takeaway:
			"Totalreflexion braucht den Übergang optisch dichter → optisch dünner und einen Einfallswinkel oberhalb des Grenzwinkels.",
		quiz: {
			question:
				"Unter welchen Bedingungen ist Totalreflexion an Wasser und Luft möglich?",
			answer: "Von Wasser nach Luft bei genügend großem Einfallswinkel",
			wrong: [
				"Von Luft nach Wasser bei jedem Winkel",
				"Nur bei senkrechtem Einfall",
			],
			explanation:
				"Erforderlich sind der Übergang ins optisch dünnere Medium und ein Winkel oberhalb des Grenzwinkels.",
		},
		workshop: classify(
			"Tritt Totalreflexion auf?",
			["Möglich im beschriebenen Modell", "Nicht bei diesen Bedingungen"],
			[
				[
					"Wasser → Luft, 55° zum Lot",
					0,
					"Der Winkel liegt oberhalb des Grenzwinkels von ungefähr 49°.",
				],
				["Wasser → Luft, senkrecht", 1, "Der Einfallswinkel ist null."],
				[
					"Luft → Wasser, 60° zum Lot",
					1,
					"Die Reihenfolge der optischen Dichte passt nicht.",
				],
				[
					"Wasser → Luft, 35° zum Lot",
					1,
					"Unterhalb des Grenzwinkels tritt ein Strahl aus.",
				],
			],
			"Ein großer Winkel allein reicht nicht.",
		),
		tasks: {
			1: task(
				"Vergleiche im Modell Wasser → Luft bei 35° und bei 55°. Beschreibe den austretenden und den reflektierten Lichtweg.",
				"Bei 35° tritt ein gebrochener Anteil in die Luft aus; ein Anteil wird reflektiert. Bei 55° liegt der Einfallswinkel oberhalb des Grenzwinkels. Im idealisierten Modell wird das Licht vollständig ins Wasser zurückreflektiert und kein gebrochener Strahl tritt aus.",
				[
					"Beide Winkel verglichen",
					"Medienreihenfolge genannt",
					"Kein austretender Strahl bei 55°",
				],
				[
					"Liegt der Winkel über dem Grenzwinkel?",
					"Welcher Strahl fehlt dann?",
				],
			),
			2: task(
				"Ein Lichtleiter funktioniert nach einem Materialwechsel nicht mehr wie zuvor. Begründe, welche Eigenschaften und Winkel du prüfen würdest, statt sofort einen stärkeren Sender einzubauen.",
				"Ich prüfe, ob der Kern optisch dichter als die Umgebung ist und ob die Strahlen an der Grenzfläche oberhalb des passenden Grenzwinkels auftreffen. Ein Materialwechsel kann Lichtgeschwindigkeit und Grenzwinkel ändern. Mehr Eingangslicht behebt einen ungeeigneten Lichtweg nicht.",
				[
					"Optische Dichte geprüft",
					"Winkelbedingung geprüft",
					"Helligkeit nicht als Ursache verwechselt",
				],
				[
					"Welche zwei Bedingungen braucht Totalreflexion?",
					"Was ändert ein Materialwechsel?",
				],
			),
		},
	}),
	lesson(2, {
		id: "op-dispersion",
		title: "Weißes Licht und sein Spektrum",
		illustration: "spectrum",
		model: "spectrum",
		intro:
			"Ein Prisma sortiert die Farben, die im weißen Licht bereits enthalten sind.",
		paragraphs: [
			"Weißes Licht kann aus vielen Spektralfarben zusammengesetzt sein. Ein Prisma bricht verschiedene Farben unterschiedlich stark: Im üblichen Glas wird violettes Licht stärker abgelenkt als rotes. Diese Abhängigkeit der Brechung von der Farbe heißt Dispersion. Aus einem weißen Lichtbündel kann so ein kontinuierliches Spektrum entstehen.",
			"Das Spektrum verläuft ohne scharfe Lücken von Rot über Orange, Gelb und Grün zu Blau und Violett. Die Farbnamen unterteilen einen kontinuierlichen Übergang; das Prisma stellt nicht erst neue Farben her. Schickst du nur rotes Licht hinein, entsteht kein vollständiger Regenbogen. Das Modell verwendet zur Übersicht einzelne Farblinien und ersetzt damit nicht den kontinuierlichen Übergang.",
			"Auch in Regentropfen wird Licht gebrochen und nach Farben getrennt; für einen Regenbogen gehört zudem Reflexion im Tropfen zum Lichtweg. Ein Prisma und ein Regentropfen haben also verwandte, aber nicht identische Strahlengänge. Experimentiere mit schulischen Lichtquellen nach Anleitung; nutze weder die Sonne noch Laser als unkontrollierte Quelle.",
		],
		takeaway:
			"Dispersion trennt vorhandene Farben durch unterschiedlich starke Brechung. Weißes Licht kann ein kontinuierliches Spektrum liefern.",
		quiz: {
			question:
				"Was zeigt ein Prisma bei ausschließlich rotem einfallendem Licht?",
			answer: "Abgelenktes rotes Licht, kein vollständiges Spektrum",
			wrong: [
				"Alle Spektralfarben entstehen neu.",
				"Rotes Licht wird immer vollständig verschluckt.",
			],
			explanation:
				"Das Prisma trennt enthaltene Farben. Fehlende Farben werden durch Brechung nicht erzeugt.",
		},
		workshop: classify(
			"Welche Aussage passt?",
			["Physikalisch passend", "Verbessern"],
			[
				[
					"Violett wird im üblichen Glas stärker abgelenkt als Rot",
					0,
					"Das ist Dispersion.",
				],
				[
					"Das Prisma erzeugt Farben aus farblosem Nichts",
					1,
					"Die Farben sind im weißen Licht enthalten.",
				],
				[
					"Ein kontinuierliches Spektrum hat fließende Übergänge",
					0,
					"Farbwörter sind keine Lücken im Spektrum.",
				],
				[
					"Jeder rote Lichtstrahl liefert einen vollständigen Regenbogen",
					1,
					"Einfarbiges Licht enthält nicht alle Spektralfarben.",
				],
			],
			"Eine übersichtliche Zeichnung mit sechs Linien ist nur ein Modell des kontinuierlichen Spektrums.",
		),
		tasks: {
			1: task(
				"Vergleiche weißes und rotes Licht im Prismamodell. Erkläre, weshalb das Ergebnis verschieden ist.",
				"Weißes Licht enthält viele Farben, die das Prisma unterschiedlich stark bricht und räumlich trennt. Rotes Licht bleibt nach der Ablenkung rot. Das Prisma erzeugt keine fehlenden Farben; die gezeichneten Farblinien stehen vereinfacht für ein kontinuierliches Spektrum.",
				[
					"Zusammensetzung des weißen Lichts",
					"Unterschiedliche Brechung",
					"Keine Farberzeugung behauptet",
				],
				["Was war vorher im Licht enthalten?", "Was bedeutet kontinuierlich?"],
			),
			2: task(
				"Auf einem Plakat steht: „Ein Regenbogen entsteht genau wie hinter einem Prisma.“ Formuliere eine fachlich genauere Erklärung mit Gemeinsamkeit und Unterschied.",
				"Gemeinsam sind Brechung und die unterschiedliche Ablenkung der Farben. Beim Regenbogen läuft das Licht durch Wassertropfen und wird im Tropfen auch reflektiert. Ein Prisma hat einen anderen Strahlengang; beide Erscheinungen lassen sich deshalb nicht mit derselben Skizze vollständig erklären.",
				[
					"Dispersion als Gemeinsamkeit",
					"Reflexion im Tropfen",
					"Modellgrenze benannt",
				],
				[
					"Welche Grenzflächen trifft Licht?",
					"Was passiert zusätzlich im Regentropfen?",
				],
			),
		},
	}),
	lesson(2, {
		id: "op-linsen",
		title: "Sammellinsen: reelle und virtuelle Bilder",
		illustration: "lens",
		model: "lens",
		intro:
			"Konstruiere den Bildort mit Lichtstrahlen und prüfe, ob ein Schirm ein Bild auffangen kann.",
		paragraphs: [
			"Eine Sammellinse bündelt achsenparalleles Licht im Brennpunkt hinter der Linse. Der Abstand von der Linsenmitte zum Brennpunkt heißt Brennweite. Eine Zerstreuungslinse lässt ein paralleles Bündel dagegen auseinanderlaufen. Zur Konstruktion am dünnen Sammellinsenmodell nutzt du zwei besondere Strahlen von der Gegenstandsspitze: Ein Parallelstrahl läuft hinter der Linse durch den bildseitigen Brennpunkt; ein Mittelpunktstrahl verläuft näherungsweise gerade.",
			"Steht der Gegenstand weiter als die Brennweite vor der Linse, schneiden sich die echten Strahlen hinter ihr. Das Bild ist reell, umgekehrt und auf einem passenden Schirm auffangbar. Bei einer Gegenstandsweite von zweimal der Brennweite ist es gleich groß. Weiter draußen wird es kleiner; zwischen einfacher und doppelter Brennweite wird es größer. Die Grafik zeigt echte Lichtwege durchgezogen.",
			"Steht der Gegenstand innerhalb der Brennweite, laufen die Strahlen hinter der Linse auseinander. Ihre rückwärtigen Verlängerungen schneiden sich auf der Gegenstandsseite: ein aufrechtes vergrößertes virtuelles Bild, wie bei einer Lupe. Im Brennpunkt selbst entsteht im idealen Modell kein Bild in endlicher Entfernung. Die Grafik nutzt eine dünne Linse und achsennahe Strahlen; du konstruierst und vergleichst, ohne eine Linsengleichung zu rechnen.",
		],
		takeaway:
			"Außerhalb der Brennweite: reelles umgekehrtes Bild. Innerhalb: virtuelles aufrechtes Lupenbild. Im Brennpunkt: kein endlicher Bildort.",
		quiz: {
			question:
				"Welches Bild kann eine Sammellinse auf einem Schirm auffangen lassen?",
			answer:
				"Ein reelles Bild bei einer Gegenstandsweite größer als die Brennweite",
			wrong: [
				"Jedes virtuelle Lupenbild",
				"Ein endliches Bild bei Gegenstandsweite genau gleich Brennweite",
			],
			explanation:
				"Für ein Schirmbild müssen echte Strahlen am Bildort zusammentreffen.",
		},
		workshop: classify(
			"Welche Bildart?",
			["Reell", "Virtuell", "Kein endlicher Bildort"],
			[
				[
					"Gegenstand außerhalb der Brennweite",
					0,
					"Echte Strahlen schneiden sich hinter der Linse.",
				],
				[
					"Gegenstand zwischen Linse und Brennpunkt",
					1,
					"Nur rückwärtige Verlängerungen schneiden sich.",
				],
				[
					"Gegenstand genau im Brennpunkt",
					2,
					"Die austretenden Strahlen verlaufen parallel.",
				],
				[
					"Umgekehrtes Bild auf einem Schirm",
					0,
					"Ein auffangbares Schirmbild ist reell.",
				],
			],
			"Prüfe echte Lichtwege und verwende für gedachte Verlängerungen gestrichelte Linien.",
		),
		tasks: {
			1: task(
				"Konstruiere mit Parallel- und Mittelpunktstrahl das Bild eines Gegenstands bei dreifacher Brennweite. Beschreibe Orientierung und Auffangbarkeit.",
				"Der Parallelstrahl wird durch den bildseitigen Brennpunkt gelenkt; der Mittelpunktstrahl läuft näherungsweise gerade. Ihr Schnittpunkt liegt hinter der Linse unterhalb der Achse. Das Bild ist umgekehrt, verkleinert und reell, also auf einem passend platzierten Schirm auffangbar.",
				[
					"Zwei Konstruktionsstrahlen",
					"Umgekehrt und verkleinert",
					"Reell durch echten Schnittpunkt erklärt",
				],
				[
					"Wo treffen die Strahlen tatsächlich zusammen?",
					"Was bedeutet die Lage unter der Achse?",
				],
			),
			2: task(
				"Du schiebst einen Gegenstand aus großer Entfernung bis zwischen Linse und Brennpunkt. Beschreibe, warum du irgendwann kein scharfes Schirmbild mehr findest und dennoch ein Lupenbild sehen kannst.",
				"Außerhalb der Brennweite wandert der reale Bildort beim Annähern weiter nach hinten. Im Brennpunkt liegt kein endlicher Bildort vor. Innerhalb laufen die Strahlen auseinander; nur ihre rückwärtigen Verlängerungen bilden ein aufrechtes virtuelles Bild, das ein Schirm dort nicht auffängt.",
				[
					"Weg bis zum Brennpunkt",
					"Sonderfall im Brennpunkt",
					"Virtuelles Lupenbild richtig erklärt",
				],
				[
					"Was geschieht mit dem Schnittpunkt?",
					"Welche Linien treffen sich beim virtuellen Bild?",
				],
			),
		},
	}),
	lesson(2, {
		id: "op-geraete",
		title: "Auge, Kamera und optische Geräte erklären",
		illustration: "lens",
		model: "lens",
		intro:
			"Verknüpfe Linsenbilder mit Alltagstechnik und prüfe eigene Quellen zu einem optischen Gerät.",
		paragraphs: [
			"Eine Kamera nutzt eine Sammellinse oder ein Linsensystem, um ein reelles umgekehrtes Bild auf einem Sensor zu erzeugen. Zum Scharfstellen werden Linsen passend zum Gegenstandsabstand eingestellt. Beispiel: Ein naher Gegenstand erfordert beim einfachen Linsenmodell einen anderen Abstand zwischen Linse und Sensor als ein ferner. Die Blende begrenzt das einfallende Licht; sie ist kein Ersatz für das Scharfstellen.",
			"Im Auge erzeugen Hornhaut und Linse ein reelles Bild auf der Netzhaut. Das Auge stellt vor allem durch Änderung seiner Linsenform scharf. Beim kurzsichtigen Auge liegt der Bildfokus ferner Gegenstände vor der Netzhaut; eine Zerstreuungslinse hilft. Beim weitsichtigen Auge reicht die Brechkraft für nahe Gegenstände nicht aus; der Fokus läge hinter der Netzhaut, eine Sammellinse kann helfen. Die Beschreibung ist ein vereinfachtes optisches Modell und ersetzt keine Untersuchung.",
			"Für einen eigenen Kurzbericht wählst du ein optisches Gerät, etwa Kamera, Fernrohr oder Lupe. Recherchiere in mindestens zwei geeigneten Quellen zu Strahlengang, geschichtlicher Entwicklung und heutiger Nutzung. Halte Titel, Herausgeber und Abrufdatum fest; unterscheide belegte Aussagen und Werbung. Das Paket übt den physikalischen Vergleich, führt aber keine eigenständige Recherche oder Präsentation für dich durch.",
		],
		takeaway:
			"Kamera und Auge brauchen ein reelles Bild am Empfänger. Kurzsichtigkeit: Zerstreuungslinse; Weitsichtigkeit: Sammellinse.",
		quiz: {
			question:
				"Welche Linse kann die Kurzsichtigkeit beim Blick in die Ferne korrigieren?",
			answer: "Eine Zerstreuungslinse",
			wrong: [
				"Eine zusätzliche Sammellinse in jedem Fall",
				"Ein ebener Spiegel vor dem Auge",
			],
			explanation:
				"Die Zerstreuungslinse schwächt die zu starke Bündelung im einfachen Modell, sodass der Fokus auf die Netzhaut gelangt.",
		},
		workshop: classify(
			"Bildempfänger und Korrektur",
			["Kamera", "Auge", "Kurzsichtigkeit", "Weitsichtigkeit"],
			[
				[
					"Reelles Bild auf einem Sensor",
					0,
					"Die Kamera stellt das Bild auf dem Sensor scharf.",
				],
				[
					"Reelles Bild auf der Netzhaut",
					1,
					"Hornhaut und Linse bilden auf die Netzhaut ab.",
				],
				[
					"Fokus ferner Gegenstände vor der Netzhaut",
					2,
					"Eine Zerstreuungslinse kann helfen.",
				],
				[
					"Nahfokus läge hinter der Netzhaut",
					3,
					"Eine Sammellinse kann helfen.",
				],
			],
			"Lichtweg und Empfänger begründen die Gerätefunktion.",
		),
		tasks: {
			1: task(
				"Vergleiche das Scharfstellen bei einer einfachen Kamera und beim Auge. Benenne jeweils den Bildempfänger und eine wichtige Veränderung.",
				"Die Kamera erzeugt ihr reelles Bild auf einem Sensor; im einfachen Modell wird der Abstand der Linse zum Sensor angepasst. Im Auge liegt der Empfänger auf der Netzhaut. Dort verändert sich vor allem die Linsenform und damit die Brechkraft, um verschiedene Gegenstandsabstände scharf abzubilden.",
				["Beide Empfänger", "Kameraeinstellung", "Linsenform des Auges"],
				["Wo muss das Bild liegen?", "Was kann am Auge verändert werden?"],
			),
			2: task(
				"Plane einen Kurzbericht zur Entwicklung der Kamera. Erkläre den grundlegenden Strahlengang und nenne, wie du Geschichte und heutige Nutzung mit Quellen prüfst.",
				"Ich beginne mit Gegenstand, Sammellinse und reellem Bild am Sensor und zeichne zwei Konstruktionsstrahlen. Für die Geschichte und aktuelle Nutzung suche ich zwei geeignete voneinander unabhängige Quellen, etwa ein Museum und eine Fachinstitution. Ich notiere Herkunft und Datum und kennzeichne Werbeaussagen. Den Bericht und die Präsentation erstelle ich selbst.",
				[
					"Strahlengang erklärt",
					"Historische und heutige Perspektive",
					"Quellenprüfung konkret geplant",
				],
				[
					"Welche Behauptungen brauchen einen Beleg?",
					"Was unterscheidet eine Fachquelle von Werbung?",
				],
			),
		},
	}),
];
