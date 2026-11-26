import type { Lesson } from "../types";

export const LESSONS_IMPERIUM: Lesson[] = [
	{
		id: "l7-mittelmeerraum",
		stage: "imperium",
		title: "Das Imperium Romanum & seine Provinzen",
		skill: "Die Topografie des Mittelmeerraums, die Ausdehnung des Imperium Romanum und die Provinzverwaltung erklären",
		lehrplan: "L7 LB 1 & 3 · Topografie & Kultureller Kontext",
		bindings: ["1-topografie", "3-topografie", "3-ausdehnung", "3-provinz"],
		paragraphs: [
			"Aus dem kleinen Stadtstaat am Tiber wuchs in den Jahrhunderten der mittleren und späten Republik bis in die Augusteische Zeit ein Weltreich, das den gesamten Mittelmeerraum umspannte: Die Römer nannten das Mittelmeer selbstbewusst ‚Mare Nostrum‘ (unser Meer). Zu den wichtigsten Regionen und Orten in Klasse 7 gehören Italien mit Rom, die Kornkammer Sizilien (Sicilia, Roms allererste Provinz seit 241 v. Chr.), Karthago in Nordafrika (später Provinz Africa), Kreta (Crēta), Griechenland mit Athen und Theben, Kleinasien (Asia), Ägypten (Aegyptus), Gallien (Gallia) und im Norden das Alpenvorland — unsere heutige bayerische Region als Provinz Raetia!",
			"Das Wort ‚prōvincia‘ bezeichnete ursprünglich den Aufgaben- und Kommandobereich eines römischen Feldherrn und später ein unterworfenes, außerhalb Italiens gelegenes Verwaltungsgebiet. An der Spitze einer Provinz stand ein römischer Statthalter (Prokonsul oder Proprätor), der für Rechtsprechung, militärische Sicherheit und Steuereintreibung verantwortlich war. Ein dichtes Netz gepflasterter Fernstraßen, sicherer Seewege, einheitlicher Währung und lateinischer Verwaltungssprache verband Europa, Nordafrika und Vorderasien — gleichzeitig führte die Provinzherrschaft oft zu hoher Steuerlast und Ausbeutung, gegen die Redner wie Cicero (etwa gegen den Statthalter Verres auf Sizilien) eintraten.",
		],
		diagram: {
			title: "Wie das Imperium Romanum funktionierte",
			subtitle: "Vom Zentrum Rom über die Provinzen bis zur Infrastruktur des Weltreichs.",
			layout: "hierarchy",
			parts: [
				{
					tag: "Zentrum",
					title: "Rom & Senat / Princeps",
					formula: "Italia · caput mundī",
					note: "Von Rom aus wurden Gesetze erlassen, Statthalter entsandt und Legionen zur Grenzsicherung verteilt.",
				},
				{
					tag: "Prōvincia",
					title: "Statthalter & Verwaltung",
					formula: "Sicilia (241 v. Chr.) · Africa · Raetia",
					note: "Die Provinz zahlte Steuern (tributum) und lieferte Getreide; im Gegenzug garantierte Rom Rechtsschutz und Straßenbau.",
				},
				{
					tag: "Vernetzung",
					title: "Mare Nostrum & Fernstraßen",
					formula: "Handel · Sprache · Romanisierung",
					note: "Über Häfen, gepflasterte Straßen (viae) und Städte verbreiteten sich römische Kultur und Latein über weite Teile Europas.",
				},
			],
		},
		material:
			"Imperium Rōmānum ā Britanniā et Raetiā usque ad Āfricam et Aegyptum patēbat. Sicilia prīma prōvincia Rōmānōrum facta est. In prōvinciīs magistrātūs Rōmānī iūs dīcēbant, viās mūniēbant et tribūta exigēbant.",
		materialLabel: "Übungstext · Ausdehnung und Verwaltung der Provinzen",
		materialLanguage: "la",
		sourceIds: ["lp", "cambodunum"],
		quiz: {
			optionLanguage: "de",
			question: "Welches Gebiet wurde 241 v. Chr. nach dem 1. Punischen Krieg zur allerersten römischen Provinz (prōvincia)?",
			answer: "Sizilien (Sicilia).",
			wrong: [
				"Gallien (Gallia).",
				"Ägypten (Aegyptus).",
			],
			explanation: "Nach dem Sieg über Karthago im 1. Punischen Krieg richtete Rom 241 v. Chr. auf Sizilien seine erste Provinz ein.",
		},
		takeaway:
			"Das Imperium Romanum umschloss das gesamte Mittelmeer (Mare Nostrum) und gliederte unterworfene Gebiete in Provinzen (prōvinciae) unter römischen Statthaltern — angefangen mit Sizilien bis hin zu Raetien im heutigen Bayern.",
		practice: [
			{
				prompt: "Wie nannten die Römer das Mittelmeer als Binnenmeer ihres Weltreichs? (zwei lateinische Wörter): ___",
				answers: ["Mare Nostrum", "mare nostrum"],
				feedback: "Mare Nostrum = ‚unser Meer‘.",
			},
			{
				prompt: "Wie hieß die römische Provinz im heutigen bayerischen Alpenvorland (mit dem Hauptort Cambodunum)? ___",
				answers: ["Raetia", "Raetien", "Rätien"],
				feedback: "Raetia umfasste große Teile Südbayerns südlich der Donau.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und ordne mithilfe der Karte die Orte Rom, Karthago, Sizilien, Kreta, Theben und Cambodunum geographisch ein.",
				model: "Das Römische Reich erstreckte sich von Britannien und Raetien bis nach Afrika und Ägypten. Sizilien wurde die erste Provinz der Römer. In den Provinzen sprachen römische Beamte Recht, bauten Straßen und trieben Steuern ein. Einordnung: Rom in Mittelitalien; Sizilien südlich Italiens; Karthago an der nordafrikanischen Küste gegenüber von Sizilien; Theben in Griechenland; Kreta als große Insel südlich der Ägäis; Cambodunum (Kempten) nördlich der Alpen in Raetien.",
				criteria: [
					"Ich übersetze alle drei Sätze sachlich genau.",
					"Ich verorte alle sechs genannten Stätten/Regionen richtig im Mittelmeerraum bzw. Alpenvorland.",
					"Ich nenne mindestens zwei Aufgaben der Provinzverwaltung.",
				],
			},
			2: {
				language: "de",
				prompt: "Diskutiere Chancen und Schattenseiten der römischen Provinzherrschaft aus Sicht einer Provinzbewohnerin (z. B. auf Sizilien oder in Raetien).",
				model: "Chancen: Rechtssicherheit, Schutz vor Seeräubern und Überfällen, ausgebaute Straßen, Fernhandel, Wasserleitungen und Städtebau (Romanisierung). Schattenseiten: Verlust der politischen Unabhängigkeit, hohe Abgaben (tributa), Gefahr der Ausbeutung durch korrupte Statthalter (wie Verres auf Sizilien) und militärische Unterdrückung bei Aufständen.",
				criteria: [
					"Ich nenne konkrete Vorteile der römischen Infrastruktur und Ordnung.",
					"Ich benenne realistische Nachteile und Konflikte der Provinzherrschaft.",
					"Ich komme zu einem abgewogenen, begründeten Urteil.",
				],
			},
		},
		workshop: {
			kind: "map",
			liveModel: "mediterranean",
			goals: [
				{
					label: "Lage Karthagos bestimmen",
					before: "Karthago lag gegenüber von Sizilien in der späteren Provinz →",
					after: "",
					options: ["Africa", "Gallia", "Asia"],
					answer: "Africa",
					explanation: "Karthago beherrschte das westliche Mittelmeer von Nordafrika (heutiges Tunesien) aus.",
				},
				{
					label: "Heimatregion im Imperium verorten",
					before: "Cambodunum (Kempten) war eine bedeutende Stadt der Provinz →",
					after: "",
					options: ["Raetia", "Sicilia", "Aegyptus"],
					answer: "Raetia",
					explanation: "Das heutige Allgäu und weite Teile Südbayerns gehörten zur Provinz Raetia.",
				},
				{
					label: "Bedeutung von prōvincia klären",
					before: "Eine römische prōvincia wurde verwaltet von einem →",
					after: "",
					options: ["römischen Statthalter", "gewählten Volkstribunen vor Ort", "griechischen Orakel"],
					answer: "römischen Statthalter",
					explanation: "Gewesene Konsuln oder Prätoren verwalteten die Provinzen als Statthalter.",
				},
			],
		},
	},
	{
		id: "l7-weltwunder",
		stage: "imperium",
		title: "Die sieben Weltwunder der Antike",
		skill: "Die sieben Weltwunder im Mittelmeerraum verorten und ihre architektonische sowie kulturelle Bedeutung erläutern",
		lehrplan: "L7 LB 1 & 3 · Topografie, Architektur & Kunst",
		bindings: ["1-topografie", "3-topografie", "3-architektur"],
		paragraphs: [
			"Reisende und Schriftsteller der hellenistischen und römischen Zeit (wie Antipatros von Sidon) stellten eine berühmte Liste von sieben herausragenden Bau- und Kunstwerken zusammen — die ‚septem mīrācula mundī‘ (sieben Weltwunder der Antike). Fast alle lagen rund um das östliche Mittelmeer und im Vorderen Orient: 1. die Pyramiden von Gizeh in Ägypten (das älteste und einzig bis heute erhaltene Weltwunder), 2. die Hängenden Gärten von Babylon (Mesopotamien), 3. die gold-elfenbeinerne Zeusstatue des Phidias in Olympia, 4. der riesige Artemistempel in Ephesos, 5. das Grabmal (Mausoleum) des Herrschers Maussolos in Halikarnassos, 6. der bronzene Koloss von Rhodos (Sonnengott Helios) und 7. der über 100 Meter hohe Leuchtturm (Pharos) von Alexandria.",
			"Diese sieben Bauwerke spiegeln das Selbstverständnis antiker Kulturen: Götterverehrung (Olympia, Ephesos), Herrscherrepräsentation und Ewigkeitshoffnung (Gizeh, Halikarnassos), aber auch technische Meisterleistungen für Handel und Seefahrt (Pharos von Alexandria). Interessant für deine Spracharbeit: Gleich zwei Weltwunder haben eigene deutsche Wörter hervorgebracht — ein prächtiges Grabmal heißt bis heute ‚Mausoleum‘, und ein gigantisches Bauwerk oder Lebewesen nennen wir ‚kolossal‘ (nach dem Koloss von Rhodos)!",
		],
		diagram: {
			title: "Die sieben Weltwunder nach Funktion",
			subtitle: "Ordne die sieben antiken Meisterwerke ihren drei großen Zweckbereichen zu.",
			layout: "triptych",
			parts: [
				{
					tag: "Götter & Kult",
					title: "Olympia & Ephesos",
					formula: "Zeusstatue · Artemistempel",
					note: "Monumentale Heiligtümer zeigten religiöse Verehrung und den Reichtum griechischer Städte.",
				},
				{
					tag: "Herrscher & Ewigkeit",
					title: "Gizeh · Halikarnassos · Babylon",
					formula: "Pyramiden · Mausoleum · Gärten",
					note: "Die Pyramiden von Gizeh überdauerten Jahrtausende als einziges erhaltenes antikes Weltwunder; Halikarnassos prägte das Wort ‚Mausoleum‘.",
				},
				{
					tag: "Seefahrt & Technik",
					title: "Alexandria & Rhodos",
					formula: "Pharos-Leuchtturm · Koloss",
					note: "Der Pharos wies Schiffen mit Feuer und Spiegeln den Weg in den Hafen Alexandrias; der Koloss von Rhodos ehrte den Sonnengott Helios.",
				},
			],
		},
		material:
			"Antīquī scriptōrēs septem mīrācula mundī laudābant. In Aegyptō pyramides adhūc stant; prope Alexandrīam Pharos nāvibus viam mōnstrābat. In Graeciā signum Iovis Olympiī et in Asiā templum Diānae Ephesiae omnēs viātōrēs dēlectābant.",
		materialLabel: "Übungstext · Antike Reiseberichte zu den Weltwundern",
		materialLanguage: "la",
		sourceIds: ["lp", "antike"],
		quiz: {
			optionLanguage: "de",
			question: "Welches der sieben antiken Weltwunder steht bis heute nahezu vollständig erhalten?",
			answer: "Die Pyramiden von Gizeh in Ägypten.",
			wrong: [
				"Der Koloss von Rhodos.",
				"Der Leuchtturm (Pharos) von Alexandria.",
			],
			explanation: "Nur die Pyramiden von Gizeh haben Jahrtausende, Erdbeben und Kriege überdauert; die übrigen sechs gingen unter.",
		},
		takeaway:
			"Die sieben Weltwunder lagen rund um das östliche Mittelmeer und in Babylon. Sie zeigen religiöse Verehrung, Herrscherrepräsentation und antike Ingenieurskunst; Wörter wie ‚Mausoleum‘ und ‚kolossal‘ erinnern bis heute an sie.",
		practice: [
			{
				prompt: "Welches Weltwunder war ein berühmter Leuchtturm vor der Küste Ägyptens? (der ___ von Alexandria): ___",
				answers: ["Pharos", "Leuchtturm"],
				feedback: "Der Pharos von Alexandria leitete Schiffe sicher in den Hafen (daher auch frz. phare = Leuchtturm!).",
			},
			{
				prompt: "Welches moderne Wort für ein monumentales Grabmal stammt vom Grab des Maussolos in Halikarnassos? ___",
				answers: ["Mausoleum"],
				feedback: "Das Grabmal des Königs Maussolos gab allen späteren Mausoleen ihren Namen.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und zähle alle sieben antiken Weltwunder mit ihrem jeweiligen Ort auf.",
				model: "Die antiken Schriftsteller lobten sieben Weltwunder. In Ägypten stehen die Pyramiden bis heute; bei Alexandria zeigte der Pharos den Schiffen den Weg. In Griechenland erfreuten das Standbild des olympischen Zeus (Jupiter) und in Kleinasien der Tempel der Artemis (Diana) von Ephesos alle Reisenden. Alle sieben: Pyramiden (Gizeh), Hängende Gärten (Babylon), Zeusstatue (Olympia), Artemistempel (Ephesos), Mausoleum (Halikarnassos), Koloss (Rhodos), Pharos (Alexandria).",
				criteria: [
					"Ich übersetze alle drei Sätze flüssig und erkenne Iovis = Jupiter/Zeus sowie Diānae = Diana/Artemis.",
					"Ich nenne alle sieben Weltwunder vollständig mit ihren Standorten.",
					"Ich beachte, dass nur die Pyramiden von Gizeh noch stehen.",
				],
			},
			2: {
				language: "de",
				prompt: "Vergleiche den Pharos von Alexandria mit den Pyramiden von Gizeh hinsichtlich ihres Zwecks und erkläre, warum fast alle antiken Weltwunder im östlichen Mittelmeerraum lagen.",
				model: "Die Pyramiden waren monumentale Königsgräber mit religiös-repräsentativem Zweck; der Pharos diente dagegen praktisch der Seefahrt und dem Fernhandel einer hellenistischen Metropole. Fast alle sieben lagen im östlichen Mittelmeer, weil griechisch-hellenistische Reiseschriftsteller des 2. Jahrhunderts v. Chr. vor allem die ihnen bekannte Kulturwelt zwischen Griechenland, Kleinasien, Ägypten und Mesopotamien bereisten.",
				criteria: [
					"Ich vergleiche sakral-repräsentativen Zweck (Pyramiden) und technischen Nutzen (Pharos).",
					"Ich erkläre die geographische Konzentration historisch aus der Perspektive der hellenistischen Autoren.",
					"Ich benutze präzise historische Fachbegriffe.",
				],
			},
		},
		workshop: {
			kind: "map",
			goals: [
				{
					label: "Römischen und griechischen Götternamen verbinden",
					before: "Im lateinischen Text heißt der Artemistempel von Ephesos → templum",
					after: "",
					options: ["Diānae", "Minerva", "Veneris"],
					answer: "Diānae",
					explanation: "Die römische Entsprechung der griechischen Göttin Artemis ist Diana.",
				},
				{
					label: "Weltwunder auf der Insel Rhodos zuordnen",
					before: "Auf der Insel Rhodos stand die riesige Bronzestatue des Sonnengottes Helios →",
					after: "",
					options: ["Koloss von Rhodos", "Mausoleum", "Zeusstatue"],
					answer: "Koloss von Rhodos",
					explanation: "Der Koloss von Rhodos stürzte später durch ein Erdbeben ein.",
				},
				{
					label: "Sprachbrücke aus dem Pharos erkennen",
					before: "Vom Leuchtturm Pharos leitet sich das französische Wort für Leuchtturm ab →",
					after: "",
					options: ["le phare", "le pont", "le port"],
					answer: "le phare",
					explanation: "Frz. phare (und ital./span. faro) bewahren bis heute den Namen der Insel Pharos vor Alexandria.",
				},
			],
		},
	},
	{
		id: "l7-archaeologie-bayern",
		stage: "imperium",
		title: "Antike Spuren: Sizilien, Cambodunum & München",
		skill: "Ausgrabungsstätten auf Sizilien, Cambodunum in Bayern und die Münchner Antikenmuseen als Zeugen antiker Kultur erschließen",
		lehrplan: "L7 LB 3 · Kultureller Kontext (Archäologie & Museen)",
		bindings: ["3-architektur", "3-bild-text"],
		paragraphs: [
			"Um antike Architektur und Kunst zu erleben, musst du nicht nur nach Rom fahren. Schon auf Sizilien (etwa im Tal der Tempel von Agrigent oder im griechisch-römischen Theater von Syrakus und Taormina) siehst du hautnah, wie griechische Baukunst (Säulenordnungen: dorisch, ionisch, korinthisch) und römische Bautechnik (Rundbogen, Gewölbe, Ziegel- und Betonbau) ineinandergriffen.",
			"Und die Antike liegt direkt vor unserer Haustür in Bayern! Cambodunum — das heutige Kempten im Allgäu — gilt als eine der ältesten schriftlich erwähnten Städte Deutschlands und war im 1. Jahrhundert n. Chr. ein bedeutender Verwaltungssitz der römischen Provinz Raetia mit Forum, Basilika, Thermen und Gallo-Römischem Tempelbezirk (heute im Archäologischen Park Cambodunum erlebbar). Wer originale griechische Vasen, römische Porträtbüsten, Marmorstatuen oder Funde aus bayerischen Römerlagern sehen will, findet sie in München in der Glyptothek und den Staatlichen Antikensammlungen am Königsplatz sowie in der Archäologischen Staatssammlung.",
		],
		diagram: {
			title: "Drei Fenster in die antike Baukunst",
			subtitle: "Vergleiche Ausgrabungen im Süden, römisches Leben in Bayern und Originale im Museum.",
			layout: "triptych",
			parts: [
				{
					tag: "Sizilien",
					title: "Agrigent & Syrakus",
					formula: "Dorische Tempel · Theater",
					note: "Auf Sizilien verschmolzen griechische Städte (Magna Graecia) mit römischer Provinzkultur — hier wirkte auch Archimedes.",
				},
				{
					tag: "Bayern · Raetia",
					title: "Cambodunum (Kempten)",
					formula: "Forum · Thermen · Tempelbezirk",
					note: "Römer brachten Fußbodenheizung (Hypokausten), Steinhäuser, Straßen und Schriftkultur ins bayerische Alpenvorland.",
				},
				{
					tag: "München",
					title: "Königsplatz & Staatssammlung",
					formula: "Glyptothek · Antikensammlungen",
					note: "Original-Skulpturen (z. B. Ägineten), bemalte Vasen und römische Funde aus Bayern machen Texte bildlich greifbar.",
				},
			],
		},
		material:
			"Nōn sōlum in Ītaliā et Siciliā, sed etiam in prōvinciā Raetiā vestīgia Rōmānōrum inveniuntur. Cambodūnī archaeologī forum, thermās et templa effōdērunt. In mūsēīs Monācēnsibus statuae antīquae et vāsa Graeca spectārī possunt.",
		materialLabel: "Übungstext · Archäologische Spuren zwischen Sizilien und Bayern",
		materialLanguage: "la",
		sourceIds: ["lp", "cambodunum", "antike", "archbayern"],
		quiz: {
			optionLanguage: "de",
			question: "Welche heutige bayerische Stadt geht auf die römische Siedlung ‚Cambodunum‘ in der Provinz Raetia zurück?",
			answer: "Kempten im Allgäu.",
			wrong: [
				"Nürnberg in Franken.",
				"Bamberg an der Regnitz.",
			],
			explanation: "Cambodunum (Kempten) war eine der wichtigsten römischen Städte in Raetien; heute zeigt dort der Archäologische Park Cambodunum die Ausgrabungen.",
		},
		takeaway:
			"Griechische Tempel auf Sizilien, die Römerstadt Cambodunum (Kempten) in Raetien und die Münchner Antikenmuseen am Königsplatz zeigen, wie greifbar die Antike bis nach Bayern hinein geblieben ist.",
		practice: [
			{
				prompt: "Wie nennt man das berühmte Münchner Skulpturenmuseum am Königsplatz für griechische und römische Bildhauerkunst? ___",
				answers: ["Glyptothek"],
				feedback: "Die Glyptothek (von griech. glyphein = meißeln) beherbergt berühmte antike Marmorskulpturen.",
			},
			{
				prompt: "Wie hieß die römische Fußbodenheizung, die Archäologen in den Thermen von Cambodunum fanden? (___heizung oder Plural ___): ___",
				answers: ["Hypokausten", "Hypokaustenheizung", "Hypokaustum"],
				feedback: "Bei einer Hypokaustenheizung strömte heiße Luft unter dem auf Pfeilern ruhenden Fußboden hindurch.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und nenne je zwei konkrete Beispiele dafür, was man in Cambodunum (Kempten) und in den Münchner Antikenmuseen über die Antike lernen kann.",
				model: "Nicht nur in Italien und auf Sizilien, sondern auch in der Provinz Raetien werden Spuren der Römer gefunden. In Cambodunum haben Archäologen das Forum, Thermen und Tempel ausgegraben. In den Münchner Museen können antike Statuen und griechische Vasen betrachtet werden. Cambodunum zeigt römischen Städtebau (Forum, Tempelbezirk, Thermen mit Fußbodenheizung); München zeigt originale Kunstwerke (griechische Vasen mit Mythenbildern, antike Marmorstatuen und bayerische Römerfunde).",
				criteria: [
					"Ich übersetze alle drei Sätze (inkl. Passiv inveniuntur und spectārī possunt) richtig.",
					"Ich nenne konkrete Befunde aus Cambodunum.",
					"Ich nenne passende Ausstellungsbereiche der Münchner Antikenmuseen.",
				],
			},
			2: {
				language: "de",
				prompt: "Wähle eine der drei verlinkten offiziellen Websites (Cambodunum, Antike am Königsplatz oder Archäologische Staatssammlung) und plane einen kurzen Steckbrief für einen möglichen Klassenbesuch (3 Leitfragen, die du vor Ort an einem Originalobjekt klären möchtest).",
				model: "Ziel: Archäologischer Park Cambodunum (Kempten). Leitfragen: 1. Wie waren der Gallo-Römische Tempelbezirk und die kleinen Thermen aufgebaut? 2. Welche Inschriften und Alltagsgegenstände (Keramik, Münzen, Werkzeuge) zeigen das Zusammenleben von Römern und Einheimischen? 3. Wie wurden die Gebäude im kalten Alpenvorland beheizt?",
				criteria: [
					"Ich beziehe mich konkret auf eine reale Stätte oder ein Museum.",
					"Ich formuliere drei ergiebige, fachlich sinnvolle Leitfragen.",
					"Ich verknüpfe den Museumsbesuch mit Themen unseres Lateinunterrichts.",
				],
			},
		},
		workshop: {
			kind: "map",
			goals: [
				{
					label: "Römische Baukunst von griechischer unterscheiden",
					before: "Typische technische Neuerungen der römischen Architektur waren →",
					after: "",
					options: ["Rundbogen, Gewölbe & römischer Beton", "nur Holzbalken ohne Steine", "Spitzbögen der Gotik"],
					answer: "Rundbogen, Gewölbe & römischer Beton",
					explanation: "Rundbögen, Gewölbe und opus caementicium (römischer Beton) ermöglichten Thermen, Aquädukte und Theater.",
				},
				{
					label: "Cambodunum einordnen",
					before: "Cambodunum lag in der Provinz Raetia und ist heute →",
					after: "",
					options: ["Kempten im Allgäu", "Syrakus auf Sizilien", "Karthago in Tunesien"],
					answer: "Kempten im Allgäu",
					explanation: "Das römische Cambodunum bildet die Wurzel des heutigen Kempten.",
				},
				{
					label: "Passiv-Infinitiv im Text deuten",
					before: "statuae spectārī possunt → die Statuen können",
					after: "",
					options: ["betrachtet werden", "betrachten", "betrachtet worden sein"],
					answer: "betrachtet werden",
					explanation: "spectārī ist Infinitiv Präsens Passiv (betrachtet werden).",
				},
			],
		},
	},
	{
		id: "l7-alexander-hellenismus",
		stage: "imperium",
		title: "Alexander der Große & der Hellenismus",
		skill: "Alexanders Feldzug, die Epoche des Hellenismus und ihren kulturellen Einfluss auf Rom erläutern",
		lehrplan: "L7 LB 1 & 3 · Geschichte & Kultureller Kontext",
		bindings: ["1-geschichte", "3-griechenland", "3-epochen"],
		paragraphs: [
			"Noch bevor Rom zur Mittelmeermacht aufstieg, veränderte ein junger makedonischer König die antike Welt: Alexander der Große (356–323 v. Chr.), Schüler des Philosophen Aristoteles. Nach der Einigung Griechenlands brach er 334 v. Chr. mit seinem Heer gegen das riesige Perserreich auf, besiegte König Dareios III. (u. a. bei Issos und Gaugamela), wurde in Ägypten als Pharao begrüßt, gründete dort die Hafenstadt Alexandria und zog bis an den Fluss Indus in Indien. Mit erst 32 Jahren starb er 323 v. Chr. in Babylon.",
			"Obwohl sein Großreich nach seinem Tod unter seinen Generälen (den Diadochen) in mehrere Königreiche zerfiel, begann mit ihm eine prägende Epoche: der Hellenismus (ca. 323–30 v. Chr.). Griechische Sprache (Koine), Wissenschaft, Architektur und Theater verschmolzen mit den Kulturen Ägyptens und des Orients. Zentren wie Alexandria mit seiner berühmten Bibliothek und dem Pharos strahlten weit aus. Als Rom später Griechenland und den Osten eroberte, übernahm es begierig hellenistische Kunst, Rhetorik, Literatur und Philosophie — der römische Dichter Horaz fasste es berühmt zusammen: ‚Graecia capta ferum victōrem cēpit‘ (Das eroberte Griechenland nahm den rauen Sieger gefangen).",
		],
		diagram: {
			title: "Alexander der Große & das Erbe des Hellenismus",
			subtitle: "Verfolge die Linie vom Feldzug über die Kulturverschmelzung bis nach Rom.",
			layout: "flow",
			parts: [
				{
					tag: "334–323 v. Chr.",
					title: "Alexanders Perserfeldzug",
					formula: "Makedonien → Ägypten → Persien → Indien",
					note: "Binnen elf Jahren stürzte Alexander das Perserreich und gründete zahlreiche Städte, allen voran Alexandria.",
				},
				{
					tag: "Hellenismus",
					title: "Kulturbegegnung im Osten",
					formula: "Griechisch als Weltsprache · Bibliothek",
					note: "Griechische und orientalische Traditionen verbanden sich in Wissenschaft, Kunst, Städtebau und Handel.",
				},
				{
					tag: "Wirkung auf Rom",
					title: "Graecia capta …",
					formula: "Militärischer Sieg Roms ↔ kultureller Einfluss",
					note: "Römische Feldherren wie Caesar bewunderten Alexander; römische Bildung übernahm griechische Literatur, Philosophie und Kunst.",
				},
			],
		},
		material:
			"Alexander Magnus, rēx Macedonum, exercitum trāns mare in Asiam dūxit et rēgem Persārum vīcit. Multās urbēs condidit, inter eās Alexandrīam, quae urbs lūmen scientiae et artium facta est. Etiam Rōmānī cultūram Graecam magnō opere admīrābantur.",
		materialLabel: "Übungstext · Alexander und die Ausstrahlung griechischer Kultur",
		materialLanguage: "la",
		sourceIds: ["lp", "antike"],
		quiz: {
			optionLanguage: "de",
			question: "Was bezeichnet der historische Begriff ‚Hellenismus‘?",
			answer: "Die Epoche nach Alexander dem Großen, in der sich griechische Kultur und Sprache mit den Kulturen des Orients und Ägyptens verbanden.",
			wrong: [
				"Die Zeit der römischen Könige vor 509 v. Chr.",
				"Die alleinige Herrschaft Spartas über Italien.",
			],
			explanation: "Der Hellenismus (323–30 v. Chr.) prägte den gesamten östlichen Mittelmeerraum und wirkte tief auf die römische Kultur.",
		},
		takeaway:
			"Alexander der Große (356–323 v. Chr.) schuf ein Weltreich bis Indien und begründete den Hellenismus — die Verschmelzung griechischer und orientalischer Kultur, die später auch Rom tief prägte.",
		practice: [
			{
				prompt: "Welche berühmte ägyptische Hafen- und Bibliotheksstadt gründete Alexander der Große? ___",
				answers: ["Alexandria", "Alexandrīa"],
				feedback: "Alexandria im Nildelta wurde zum wichtigsten Wissenschafts- und Kulturzentrum des Hellenismus.",
			},
			{
				prompt: "Wie hieß der berühmte griechische Philosoph, der Alexander in seiner Jugend unterrichtete? ___",
				answers: ["Aristoteles"],
				feedback: "Aristoteles vermittelte Alexander griechische Literatur (besonders Homer) und Naturkunde.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und erkläre in drei Sätzen, warum der berühmte Ausspruch des Horaz ‚Graecia capta ferum victōrem cēpit‘ das Verhältnis zwischen Rom und Griechenland gut trifft.",
				model: "Alexander der Große, der König der Makedonen, führte ein Heer über das Meer nach Asien und besiegte den König der Perser. Er gründete viele Städte, darunter Alexandria, welche Stadt zu einem Licht der Wissenschaft und der Künste wurde. Auch die Römer bewunderten die griechische Kultur sehr. Horaz meint: Militärisch besiegte Rom Griechenland (capta), aber kulturell ‚eroberte‘ Griechenland die Römer durch Literatur, Philosophie, Kunst und Architektur.",
				criteria: [
					"Ich übersetze alle drei Sätze sachlich und sprachlich sauber.",
					"Ich erkläre das Paradoxon in Horaz’ Satz (militärischer vs. kultureller Sieg).",
					"Ich nenne konkrete Gebiete des griechisch-hellenistischen Einflusses auf Rom.",
				],
			},
			2: {
				language: "de",
				prompt: "Bewerte Alexanders Handeln aus zwei Blickwinkeln: Was spricht für den Beinamen ‚der Große‘, und welche kritischen Einwände lassen sich gegen seinen Feldzug erheben?",
				model: "Für ‚der Große‘ sprechen sein strategisches Talent, die Gründung von Handels- und Bildungszentren wie Alexandria und der langfristige Kulturaustausch des Hellenismus. Kritisch sind die enormen Menschenverluste durch jahrelange Eroberungskriege, die Zerstörung von Städten (z. B. Theben, Persepolis), die Erschöpfung seines eigenen Heeres und zunehmender Herrscherkult.",
				criteria: [
					"Ich führe sachliche Argumente für die historische Bedeutung Alexanders an.",
					"Ich benenne begründete Kritikpunkte an Krieg und Machtausübung.",
					"Ich unterscheide antike Bewunderung von heutiger historischer Bewertung.",
				],
			},
		},
		workshop: {
			kind: "history",
			goals: [
				{
					label: "Kulturelles Zentrum des Hellenismus",
					before: "Die berühmteste Bibliothek der Antike entstand in →",
					after: "",
					options: ["Alexandria", "Karthago", "Cambodunum"],
					answer: "Alexandria",
					explanation: "In Alexandria sammelten Gelehrte hunderttausende Schriftrollen der antiken Welt.",
				},
				{
					label: "Zeitliche Einordnung Alexanders",
					before: "Alexander der Große lebte im →",
					after: "",
					options: ["4. Jahrhundert v. Chr. (356–323)", "1. Jahrhundert n. Chr.", "6. Jahrhundert v. Chr."],
					answer: "4. Jahrhundert v. Chr. (356–323)",
					explanation: "Alexander starb 323 v. Chr. in Babylon — über ein Jahrhundert vor Hannibal.",
				},
				{
					label: "Wirkung auf Rom erfassen",
					before: "Römische Familien ließen ihre Kinder oft unterrichten von →",
					after: "",
					options: ["griechischen Hauslehrern und Rhetoren", "ägyptischen Pharaonen", "karthagischen Seefahrern"],
					answer: "griechischen Hauslehrern und Rhetoren",
					explanation: "Gebildete Römer sprachen neben Latein fließend Griechisch und lernten nach griechischen Vorbildern.",
				},
			],
		},
	},
	{
		id: "l7-griechisches-geistesleben",
		stage: "imperium",
		title: "Athen, Archimedes & Diogenes",
		skill: "Attische Demokratie, naturwissenschaftliche Leistungen des Archimedes und die Philosophie des Diogenes deuten und vergleichen",
		lehrplan: "L7 LB 3 · Griechisches Geistesleben & Wertevergleich",
		bindings: ["3-griechenland", "3-wertevergleich"],
		paragraphs: [
			"Neben den Mythen verdankte Rom dem griechischen Geistesleben drei große Ideenfelder, die bis heute in Europa nachwirken: 1. Politik: In Athen entstand im 5. Jahrhundert v. Chr. die attische Demokratie (dēmos = Volk, kratos = Herrschaft), in der männliche Vollbürger in der Volksversammlung direkt über Gesetze und Ämter abstimmten — Frauen, Sklaven und Fremde (Metöken) blieben allerdings ausgeschlossen. 2. Wissenschaft und Technik: Auf Sizilien lebte der geniale Mathematiker und Erfinder Archimedes von Syrakus (ca. 287–212 v. Chr.), der Hebelgesetze und den Auftrieb im Wasser (‚Heureka!‘) erforschte und Syrakus im 2. Punischen Krieg mit geschickten Verteidigungsmaschinen gegen die Römer schützte.",
			"3. Philosophie als Lebensweise: Diogenes von Sinope (4. Jh. v. Chr.), der bekannteste Kyniker (von griech. kyōn = Hund — wegen seiner bewusst einfachen, unkonventionellen Lebensart in einer Tonne), stellte Besitz, Luxus und Macht radikal infrage. Als Alexander der Große ihm einen Wunsch freistellte, soll Diogenes trocken geantwortet haben: ‚Geh mir ein wenig aus der Sonne!‘ Seine Botschaft — innere Freiheit entsteht durch Bedürfnislosigkeit, nicht durch Reichtum — fordert auch unsere moderne Konsumgesellschaft zum Nachdenken heraus.",
		],
		diagram: {
			title: "Drei Säulen des griechischen Geisteslebens",
			subtitle: "Politik, Wissenschaft und Philosophie — und was sie für unsere Gegenwart bedeuten.",
			layout: "triptych",
			parts: [
				{
					tag: "Politik · Athen",
					title: "Attische Demokratie",
					formula: "dēmos (Volk) + kratos (Herrschaft)",
					note: "Direkte Mitbestimmung der männlichen Vollbürger; wichtiges Vorbild, aber noch ohne Rechte für Frauen und Sklaven.",
				},
				{
					tag: "Technik · Syrakus",
					title: "Archimedes (ca. 287–212 v. Chr.)",
					formula: "Hebel · Auftrieb · ‚Nōlī turbāre circulōs meōs!‘",
					note: "Verband Mathematik mit praktischer Ingenieurskunst; fiel 212 v. Chr. bei der Eroberung von Syrakus durch die Römer.",
				},
				{
					tag: "Philosophie · Kyniker",
					title: "Diogenes von Sinope",
					formula: "Bedürfnislosigkeit = innere Freiheit",
					note: "Widersprach sogar Alexander dem Großen und zeigte, dass Selbstbestimmung nicht von Geld oder Titeln abhängt.",
				},
			],
		},
		material:
			"Cum Alexander Magnus Diogenem philosophum rogāvisset, quid cuperet, Diogenēs respondit: ‚Paululum ā sōle recēde!‘ Syrācūsīs autem Archimēdēs mīrīs māchinīs urbem dēfendit; mīlitī Rōmānō dīxisse fertur: ‚Nōlī turbāre circulōs meōs!‘",
		materialLabel: "Übungstext · Berühmte Aussprüche von Diogenes und Archimedes",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Welche Haltung drückt Diogenes’ Antwort an Alexander den Großen (‚Geh mir ein wenig aus der Sonne!‘) aus?",
			answer: "Innere Unabhängigkeit von Macht und Reichtum (kynische Bedürfnislosigkeit).",
			wrong: [
				"Angst vor der Strafe des Königs.",
				"Den Wunsch nach einem Palast in Makedonien.",
			],
			explanation: "Diogenes zeigt, dass selbst der mächtigste König der Welt ihm nichts schenken kann, was die Natur nicht schon frei gibt.",
		},
		takeaway:
			"Attische Demokratie, Archimedes’ naturwissenschaftliche Entdeckungen und Diogenes’ kynische Kritik an Besitz und Macht zeigen die Breite griechischen Denkens — und liefern direkte Fragen an unsere eigene Lebenswelt.",
		practice: [
			{
				prompt: "In welcher griechischen Stadt auf Sizilien lebte und forschte Archimedes? ___",
				answers: ["Syrakus", "Syracusae", "Syrācūsae"],
				feedback: "Archimedes lebte in Syrakus und starb 212 v. Chr. bei der Eroberung der Stadt im 2. Punischen Krieg.",
			},
			{
				prompt: "Wie nennt man die Philosophenschule des Diogenes (abgeleitet vom griechischen Wort für ‚Hund‘)? (die ___): ___",
				answers: ["Kyniker"],
				feedback: "Die Kyniker (gr. kynikoi) lebten bewusst bedürfnislos und spotteten über leere Konventionen.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und erkläre, warum man ‚Nōlī turbāre circulōs meōs!‘ bis heute als geflügeltes Wort verwendet.",
				model: "Als Alexander der Große den Philosophen Diogenes gefragt hatte, was er sich wünsche, antwortete Diogenes: ‚Tritt ein wenig aus der Sonne!‘ In Syrakus aber verteidigte Archimedes die Stadt mit erstaunlichen Maschinen; er soll einem römischen Soldaten gesagt haben: ‚Störe meine Kreise nicht!‘ Die Wendung bedeutet heute: ‚Unterbrich mich nicht bei meiner konzentrierten Arbeit oder Forschung!‘",
				criteria: [
					"Ich übersetze den cum-Satz, die indirekte Frage (quid cuperet) und beide Aussprüche korrekt.",
					"Ich deute ‚Nōlī turbāre‘ als verneinten Imperativ (Störe nicht!).",
					"Ich erkläre die heutige Verwendung als geflügeltes Wort.",
				],
			},
			2: {
				language: "de",
				prompt: "Vergleiche Diogenes’ Ideal der radikalen Bedürfnislosigkeit mit deinem eigenen Alltag heute: Wo kann uns seine Haltung weiterhelfen, und wo stößt sie an Grenzen?",
				model: "Diogenes erinnert daran, dass Marken, ständiger Konsum oder Statussymbole nicht automatisch glücklich machen — bewusster Verzicht kann Freiheit und Gelassenheit schaffen. An Grenzen stößt sein radikales Ideal dort, wo Gemeinschaft, Bildung, Gesundheitsversorgung und verlässliche soziale Zusammenarbeit materielle Grundlagen brauchen.",
				criteria: [
					"Ich erfasse Diogenes’ Grundgedanken sachlich richtig.",
					"Ich stelle einen konkreten Bezug zu meinem heutigen Alltag her.",
					"Ich wäge Chancen und Grenzen begründet ab.",
				],
			},
		},
		workshop: {
			kind: "history",
			goals: [
				{
					label: "Attische Demokratie mit heute vergleichen",
					before: "In der attischen Demokratie hatten kein Stimmrecht →",
					after: "",
					options: ["Frauen, Sklaven und Fremde", "nur die Feldherren", "alle Bürger über 20 Jahre"],
					answer: "Frauen, Sklaven und Fremde",
					explanation: "Anders als moderne Demokratien schloss Athen Frauen, Sklaven und Zuwanderer (Metöken) aus.",
				},
				{
					label: "Archimedes richtig verorten",
					before: "Archimedes verteidigte 212 v. Chr. seine Heimatstadt →",
					after: "",
					options: ["Syrakus", "Theben", "Karthago"],
					answer: "Syrakus",
					explanation: "Syrakus auf Sizilien war eine der bedeutendsten griechischen Städte des Westens.",
				},
				{
					label: "Indirekte Frage im Text erkennen",
					before: "Alexander rogāvit, quid Diogenēs cuperet → Consecutio temporum:",
					after: "",
					options: ["Nebentempus + Gleichzeitigkeit (Konj. Impf.)", "Haupttempus + Vorzeitigkeit", "Irrealis der Vergangenheit"],
					answer: "Nebentempus + Gleichzeitigkeit (Konj. Impf.)",
					explanation: "rogāvit ist Nebentempus; cuperet (Konj. Impf.) zeigt Gleichzeitigkeit an.",
				},
			],
		},
	},
];
