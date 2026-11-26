import type { Lesson } from "../types";

export const LESSONS_MYTHOS: Lesson[] = [
	{
		id: "l7-europa-kreta",
		stage: "mythos",
		title: "Europa, Theseus, Daedalus und Ikarus",
		skill: "Die Kreta-Mythen wiedergeben, Ovid als literarische Quelle einordnen und Text mit Bilddarstellungen vergleichen",
		lehrplan: "L7 LB 1 & 3 · Religion, Mythos & Ovid",
		bindings: ["1-mythos", "3-mythen", "3-ovid", "3-bild-text"],
		paragraphs: [
			"Rund um die Mittelmeerinsel Kreta rankt sich eine ganze Kette berühmter griechischer Mythen, die den Römern besonders durch die ‚Metamorphosen‘ (Verwandlungssagen) des Dichters Publius Ovidius Naso (Ovid, 43 v. Chr.–ca. 17 n. Chr.) vertraut waren: Die phönizische Königstochter Europa wird von Jupiter (Zeus) in Gestalt eines sanften weißen Stiers über das Meer nach Kreta entführt — und gibt unserem Kontinent bis heute seinen Namen! Auf Kreta herrscht später ihr Sohn Minos, der im unterirdischen Labyrinth das Ungeheuer Minotaurus (halb Mensch, halb Stier) gefangen hält. Der athenische Held Theseus besiegt den Minotaurus und findet nur dank des Wollfadens der Königstochter Ariadne (‚Ariadnefaden‘) aus dem Labyrinth zurück.",
			"Der geniale Erfinder des Labyrinths war Daedalus. Als Minos ihn und seinen Sohn Ikarus auf Kreta festhielt, baute Daedalus Flügel aus Federn und Wachs. Seine eindringliche Warnung an den Sohn lautete: ‚Halte die Mitte ein!‘ (medio tūtissimus ībis) — nicht zu tief über die Wellen, sonst werden die Federn schwer; nicht zu hoch zur Sonne, sonst schmilzt das Wachs. Doch Ikarus vergaß im Rausch des Fliegens das Maß, stieg zu hoch und stürzte ins Meer (Hybris = menschliche Selbstüberschätzung). Maler von Pieter Bruegel bis heute haben diese Szene in Bildern gedeutet — im Vergleich von Text und Bild erkennst du sofort, welchen Moment ein Künstler besonders betont.",
		],
		diagram: {
			title: "Der kretische Sagenkreis bei Ovid",
			subtitle: "Drei Mythen auf Kreta — und was sie über Maßhalten, Mut und Klugheit erzählen.",
			layout: "flow",
			parts: [
				{
					tag: "Europa",
					title: "Entführung auf dem Stier",
					formula: "Phönizien → Kreta → Name Europas",
					note: "Zeigt die kulturelle Verbindung zwischen Orient und Mittelmeerwelt; bis heute Motiv auf Euro-Münzen und in der Kunst.",
				},
				{
					tag: "Theseus",
					title: "Labyrinth & Ariadnefaden",
					formula: "Mut + Klugheit gegen den Minotaurus",
					note: "Ohne Ariadnes Faden wäre selbst der stärkste Held im Irrgarten verloren — der ‚Ariadnefaden‘ steht bis heute für einen klugen Leitfaden.",
				},
				{
					tag: "Daedalus & Ikarus",
					title: "Erfindergeist vs. Hybris",
					formula: "‚Halte die Mitte ein!‘ (Ovid, Metamorphosen)",
					note: "Spiegel menschlichen Handelns: Technik eröffnet Freiheit, verlangt aber Verantwortung und das Einhalten von Grenzen.",
				},
			],
		},
		material:
			"Daedalus ālās ex pennīs et cērā fēcit, ut cum fīliō Īcarō ex īnsulā Crētā fugeret. Pater fīlium monuit, ut medium cursum tenēret. Sed Īcarus, nimis altē volāns, sōlī appropinquāvit: cērā liquefactā puer in mare cecidit.",
		materialLabel: "Übungstext · Daedalus und Ikarus (frei nach Ovid)",
		materialLanguage: "la",
		sourceIds: ["lp", "antike"],
		quiz: {
			optionLanguage: "de",
			question: "Welcher römische Dichter überlieferte die Mythen von Europa, Daedalus und Ikarus sowie Orpheus besonders wirkungsvoll in seinen ‚Metamorphosen‘?",
			answer: "Ovid (Publius Ovidius Naso).",
			wrong: [
				"Caesar (Gaius Iulius Caesar).",
				"Archimedes von Syrakus.",
			],
			explanation: "Ovids ‚Metamorphosen‘ (Verwandlungssagen) sind bis heute eine der wichtigsten literarischen Quellen für antike Mythen.",
		},
		takeaway:
			"Die Kreta-Mythen (Europa, Theseus, Daedalus und Ikarus) — besonders überliefert durch Ovid — spiegeln menschliche Stärken und Grenzen (Klugheit, Mut, aber auch Hybris). Wendungen wie ‚Ariadnefaden‘ leben bis heute fort.",
		practice: [
			{
				prompt: "Wie nennt man bis heute einen klugen Leitfaden zur Lösung eines schwierigen Problems (nach der Helferin des Theseus)? ___",
				answers: ["Ariadnefaden"],
				feedback: "Mit dem Faden der Ariadne fand Theseus aus dem Labyrinth heraus.",
			},
			{
				prompt: "Wie lautet der griechische Fachbegriff für gefährliche menschliche Selbstüberschätzung (wie bei Ikarus)? ___",
				answers: ["Hybris"],
				feedback: "Hybris bezeichnet das Überschreiten menschlicher Grenzen aus Übermut.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und erkläre die Botschaft des Ikarus-Mythos als Spiegel menschlichen Handelns.",
				model: "Daedalus fertigte Flügel aus Federn und Wachs an, um mit seinem Sohn Ikarus von der Insel Kreta zu fliehen. Der Vater ermahnte den Sohn, die mittlere Flugbahn einzuhalten. Aber Ikarus, der zu hoch flog, näherte sich der Sonne: Nachdem das Wachs geschmolzen war, stürzte der Junge ins Meer. Der Mythos warnt vor Selbstüberschätzung (Hybris) und zeigt, dass Erfindungsgeist Verantwortung und Maßhalten braucht.",
				criteria: [
					"Ich übersetze beide ut-Sätze, das PPA ‚volāns‘ und den Abl. abs. ‚cērā liquefactā‘ richtig.",
					"Ich arbeite das Thema Maßhalten vs. Hybris klar heraus.",
					"Ich beziehe den Mythos auf menschliches Handeln.",
				],
			},
			2: {
				language: "de",
				prompt: "Stell dir zwei bildliche Darstellungen von ‚Daedalus und Ikarus‘ vor: Ein Bild zeigt den Moment des Fliegens hoch am Himmel, das andere (wie bei Bruegel) nur noch Ikarus’ Beine im Meer, während ein Bauer ruhig weiterpflügt. Vergleiche, welche unterschiedliche Aussage beide Bilder gegenüber dem Text treffen.",
				model: "Das erste Bild betont Freiheitsdrang, Kühnheit und den Traum vom Fliegen — der Sturz ist noch nicht geschehen. Das zweite Bild betont die Vergänglichkeit und Gleichgültigkeit der Welt gegenüber dem Scheitern eines Einzelnen: Das Alltagsleben geht weiter, obwohl ein Mensch seine Grenzen überschritten hat. Während der Text den ganzen Verlauf (Warnung, Flug, Sturz) erzählt, spitzt jedes Bild einen einzelnen Augenblick zu.",
				criteria: [
					"Ich vergleiche beide Bildschwerpunkte präzise.",
					"Ich stelle den Unterschied zwischen erzählendem Text und punktuellem Bild heraus.",
					"Ich deute die inhaltliche Wirkung beider Darstellungen nachvollziehbar.",
				],
			},
		},
		workshop: {
			kind: "myth",
			goals: [
				{
					label: "Finalsatz im Mythostext erkennen",
					before: "Daedalus ālās fēcit, ut fugeret →",
					after: "",
					options: ["damit er floh / um zu fliehen", "so dass er geflohen war", "obwohl er floh"],
					answer: "damit er floh / um zu fliehen",
					explanation: "ut + Konjunktiv Imperfekt drückt hier die Absicht (final) aus.",
				},
				{
					label: "Ablativus absolutus im Text deuten",
					before: "cērā liquefactā puer cecidit →",
					after: "",
					options: ["Nachdem das Wachs geschmolzen war", "Während das Wachs schmilzt", "Damit das Wachs schmelze"],
					answer: "Nachdem das Wachs geschmolzen war",
					explanation: "liquefactā ist PPP (vorzeitig/passiv) → Nachdem das Wachs geschmolzen war.",
				},
				{
					label: "Ovid als Quelle sichern",
					before: "Das berühmteste Mythenwerk Ovids trägt den Titel →",
					after: "",
					options: ["Metamorphosen", "Bellum Gallicum", "Annales"],
					answer: "Metamorphosen",
					explanation: "In den ‚Metamorphosen‘ versammelt Ovid rund 250 Verwandlungssagen.",
				},
			],
		},
	},
	{
		id: "l7-orpheus-unterwelt",
		stage: "mythos",
		title: "Orpheus, Eurydike, Tod und Unterwelt",
		skill: "Antike Unterweltsvorstellungen (aufbauend auf L6) am Mythos von Orpheus und Eurydike deuten",
		lehrplan: "L7 LB 1 & 3 · Religion & Mythos (Tod und Unterwelt)",
		bindings: ["1-mythos", "3-mythen", "3-unterwelt", "3-ovid"],
		paragraphs: [
			"Aus Klasse 6 kennst du bereits grundlegende römische Vorstellungen von Tod und Unterwelt: Nach dem Tod bringt der Fährmann Charon die Schatten der Verstorbenen über den Fluss Styx ins Schattenreich (Orcus / Hades), bewacht vom dreiköpfigen Höllenhund Cerberus, wo Pluto (Hades) und Proserpina (Persephone) herrschen. Im Mythos von Orpheus und Eurydike — wieder unvergleichlich erzählt von Ovid — wird diese Grenze zwischen Leben und Tod zum Mittelpunkt einer bewegenden Geschichte.",
			"Der begnadete thrakische Sänger Orpheus konnte mit seiner Leier (lyra) sogar wilde Tiere, Bäume und Felsen rühren. Als seine junge Frau Eurydike kurz nach der Hochzeit an einem Schlangenbiss stirbt, wagt Orpheus das Unmögliche: Er steigt lebendig in die Unterwelt hinab und bewegt durch seinen Gesang selbst die strengen Herrscher Pluto und Proserpina zu Tränen. Sie erlauben Eurydike die Rückkehr ins Licht — unter einer einzigen Bedingung: Orpheus darf sich auf dem Weg nach oben nicht nach ihr umdrehen. Kurz vor dem Ausgang packt ihn die Sorge, ob sie ihm wirklich folgt; er blickt zurück — und verliert sie zum zweiten Mal für immer. Der Mythos zeigt zweierlei: die verbindende Macht der Kunst und die Unausweichlichkeit des Todes.",
		],
		diagram: {
			title: "Orpheus’ Weg durch die Unterwelt",
			subtitle: "Drei Stationen zwischen der Kraft der Musik und der Grenze des Todes.",
			layout: "flow",
			parts: [
				{
					tag: "Abstieg",
					title: "Styx, Charon & Cerberus",
					formula: "Musik überwindet den Schrecken",
					note: "Selbst die düstere Unterwelt hält inne, als Orpheus’ Gesang von Liebe und Verlust erklingt.",
				},
				{
					tag: "Bedingung",
					title: "Plutos Gebot beim Aufstieg",
					formula: "‚Nē respexeris!‘ — Blicke nicht zurück!",
					note: "Vertrauen wird auf die Probe gestellt: Eurydike folgt hinter ihm als leiser Schatten.",
				},
				{
					tag: "Wendepunkt",
					title: "Der Blick zurück & Verlust",
					formula: "Liebe ↔ Ungeduld · Grenze des Menschseins",
					note: "Weil Orpheus aus Sorge und Liebe zweifelt, entgleitet Eurydike endgültig in den Orcus.",
				},
			],
		},
		material:
			"Orpheus ad īnferōs dēscendit, ut uxōrem Eurydicēn redūceret. Cantū suō etiam Plūtōnem et Prōserpinam mōvit. Dī autem hanc lēgem dedērunt, nē Orpheus in itinere respiceret. Cum paene ad lūcem vēnisset, amore impulsus respexit et Eurydicēn iterum āmīsit.",
		materialLabel: "Übungstext · Orpheus und Eurydike in der Unterwelt",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Welche Bedingung stellten Pluto und Proserpina für Eurydikes Rückkehr aus der Unterwelt?",
			answer: "Orpheus durfte sich auf dem Weg ans Tageslicht nicht nach Eurydike umdrehen.",
			wrong: [
				"Orpheus musste seine Leier für immer bei Charon abgeben.",
				"Eurydike musste allein durch das Labyrinth auf Kreta gehen.",
			],
			explanation: "Plutos Bedingung (nē respiceret) prüfte Orpheus’ Vertrauen — sein besorgter Blick zurück brach das Gebot.",
		},
		takeaway:
			"Der Orpheus-Mythos verknüpft die antike Unterweltsvorstellung (Styx, Charon, Pluto und Proserpina) mit der Frage nach der Macht der Kunst, der Stärke der Liebe und der unverrückbaren Grenze des Todes.",
		practice: [
			{
				prompt: "Wie heißt der Fährmann, der nach antikem Mythos die Seelen über den Unterweltsfluss Styx setzt? ___",
				answers: ["Charon"],
				feedback: "Dem Fährmann Charon legte man oft eine Münze (Obolus) als Fährlohn mit ins Grab.",
			},
			{
				prompt: "Mit welchem Instrument rührte Orpheus sogar die Götter der Unterwelt? (die ___): ___",
				answers: ["Leier", "Lyra", "Kithara"],
				feedback: "Die Leier (lyra) war das Instrument Apolls und Orpheus’.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und bestimme die grammatikalische Konstruktion von ‚ut … redūceret‘, ‚nē … respiceret‘ und ‚amore impulsus‘.",
				model: "Orpheus stieg in die Unterwelt hinab, um seine Frau Eurydike zurückzuführen (finaler ut-Satz). Durch seinen Gesang bewegte er sogar Pluto und Proserpina. Die Götter aber gaben diese Bedingung (dieses Gesetz), dass Orpheus sich auf dem Weg nicht umdrehen dürfe (verneinter Begehrsatz / finaler nē-Satz). Als er beinahe ans Licht gekommen war, blickte er, von Liebe getrieben (kausales PC mit PPP impulsus), zurück und verlor Eurydike zum zweiten Mal.",
				criteria: [
					"Ich übersetze alle vier Sätze flüssig und genau.",
					"Ich erkenne die finalen Nebensätze mit ut/nē richtig.",
					"Ich erkenne ‚amōre impulsus‘ als kausales Participium coniunctum.",
				],
			},
			2: {
				language: "de",
				prompt: "Warum verurteilt Ovid Orpheus trotz seines Fehlers nicht hart? Erkläre, weshalb gerade das Scheitern am Ausgang den Mythos bis heute in Oper, Literatur und Film so berühmt macht.",
				model: "Orpheus bricht das Gebot nicht aus Bosheit, sondern aus übergroßer Liebe und Angst um Eurydike — ein zutiefst menschlicher Fehler. Genau dieser tragische Moment kurz vor dem Ziel macht sichtbar, dass kein Mensch den Tod endgültig überlisten kann, während Erinnerung und Kunst (Orpheus’ Gesang) fortdauern.",
				criteria: [
					"Ich erkläre Orpheus’ Motiv (Liebe und Sorge statt Bosheit).",
					"Ich arbeite den Zusammenhang zwischen Kunst, Erinnerung und Tod heraus.",
					"Ich begründe die anhaltende Wirkung des Stoffs in Kultur und Gegenwart.",
				],
			},
		},
		workshop: {
			kind: "myth",
			goals: [
				{
					label: "Herrscherpaar der Unterwelt benennen",
					before: "In der römischen Mythologie herrschen in der Unterwelt →",
					after: "",
					options: ["Pluto und Proserpina", "Jupiter und Juno", "Mars und Venus"],
					answer: "Pluto und Proserpina",
					explanation: "Pluto (griech. Hades) und Proserpina (griech. Persephone) regieren das Schattenreich.",
				},
				{
					label: "Partizip ‚impulsus‘ übersetzen",
					before: "Orpheus amōre impulsus respexit →",
					after: "",
					options: ["von Liebe getrieben / weil er von Liebe getrieben wurde", "während er die Liebe antrieb", "um die Liebe anzutreiben"],
					answer: "von Liebe getrieben / weil er von Liebe getrieben wurde",
					explanation: "impulsus ist PPP von impellere (antreiben) — hier kausal als PC.",
				},
				{
					label: "Wächter der Unterwelt zuordnen",
					before: "Den Eingang zur Unterwelt bewachte der dreiköpfige Hund →",
					after: "",
					options: ["Cerberus", "Minotaurus", "Pegasus"],
					answer: "Cerberus",
					explanation: "Cerberus ließ zwar alle Toten hinein, aber niemanden wieder hinaus — außer Orpheus bezauberte ihn.",
				},
			],
		},
	},
	{
		id: "l7-theben-antigone",
		stage: "mythos",
		title: "Ödipus und Antigone – der thebanische Sagenkreis",
		skill: "Den thebanischen Sagenkreis (Ödipus, Antigone) wiedergeben und antike Wertvorstellungen begründet vergleichen",
		lehrplan: "L7 LB 1 & 3 · Thebanischer Sagenkreis & Wertevergleich",
		bindings: ["1-mythos", "1-stellungnahme", "3-mythen", "3-wertevergleich"],
		paragraphs: [
			"Der thebanische Sagenkreis um die griechische Stadt Theben gehört zu den tiefgründigsten Geschichten der Antike. König Ödipus rettet Theben, indem er das Rätsel der Sphinx löst (‚Was geht morgens auf vier, mittags auf zwei und abends auf drei Beinen?‘ — der Mensch!). Doch ohne es zu ahnen, erfüllt sich an ihm ein dunkles Orakel des Apollon: Er hatte unwissentlich seinen leiblichen Vater erschlagen und seine Mutter geheiratet. Als die Wahrheit ans Licht kommt, erkennt Ödipus die Grenzen menschlicher Klugheit und geht geblendet ins Exil.",
			"Noch schärfer spitzt sich der Wertekonflikt bei seiner Tochter Antigone zu: Nach dem Bruderkrieg ihrer beiden Brüder Eteokles und Polyneikes verbietet der neue König Kreon bei Todesstrafe, den als Landesverräter geltenden Polyneikes zu bestatten. Antigone widersetzt sich dem Befehl des Staates offen und begräbt ihren Bruder dennoch — denn für sie stehen die ungeschriebenen göttlichen Gebote, die Familienehre (pietās) und das eigene Gewissen höher als ein ungerechtes menschliches Gesetz. Damit stellt der Mythos eine zeitlose Frage, die du wunderbar mit Diogenes (Unabhängigkeit), Cicero (Rechtsstaat) und Augustus (Staatsordnung) vergleichen kannst: Wann muss man Gesetzen gehorchen — und wann verlangt das Gewissen Widerspruch?",
		],
		diagram: {
			title: "Konfliktlinien im thebanischen Sagenkreis",
			subtitle: "Von Ödipus’ Schicksal bis zu Antigones Gewissensentscheidung gegen Kreon.",
			layout: "contrast",
			parts: [
				{
					tag: "Ödipus",
					title: "Klugheit vs. Schicksal",
					formula: "Rätsel der Sphinx → Orakel → Erkenntnis",
					note: "Selbst der klügste Mensch durchschaut nicht alles — der Mythos fragt nach Schuld, Wissen und Verantwortung.",
				},
				{
					tag: "Kreon",
					title: "Staatsräson & Gehorsam",
					formula: "Gesetz der Polis · Ordnung über alles",
					note: "Kreon fürchtet Chaos nach dem Bürgerkrieg und will staatliche Autorität mit Härte durchsetzen.",
				},
				{
					tag: "Antigone",
					title: "Gewissen & ungeschriebenes Recht",
					formula: "Geschwisterliebe · göttliches Gebot",
					note: "Antigone beruft sich auf zeitlose Menschen- und Götterpflichten — ein klassisches Leitbild für Zivilcourage.",
				},
			],
		},
		material:
			"Creōn rēx Thēbārum vetuit Polyneicēn sepelīrī, quod contrā patriam pugnāverat. Sed Antigonē lēgem dīvīnam maiōrem esse putāvit quam iussum rēgis; itaque frātrem sepelīvit, quamquam mortem timēbat. ‚Nōn ut ōdissem, sed ut amārem, nāta sum‘.",
		materialLabel: "Übungstext · Der Konflikt zwischen Kreon und Antigone",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Welche beiden Grundsätze prallen im Konflikt zwischen König Kreon und Antigone aufeinander?",
			answer: "Staatliches Gesetz und Ordnung (Kreon) gegen ungeschriebenes göttliches Recht und Gewissen (Antigone).",
			wrong: [
				"Griechische Sprache gegen lateinische Sprache.",
				"Handelsfreiheit gegen Steuerpflicht.",
			],
			explanation: "Antigone stellt die religiös-menschliche Pflicht zur Bestattung des Bruders über Kreons staatliches Verbot.",
		},
		takeaway:
			"Ödipus zeigt die Grenzen menschlicher Einsicht; Antigone verkörpert den Konflikt zwischen staatlichem Befehl und individuellem Gewissen — ein Schlüsselthema für den Wertevergleich mit Diogenes, Cicero, Augustus und unserer Gegenwart.",
		practice: [
			{
				prompt: "Wie lautet die Lösung des berühmten Rätsels der Sphinx, das Ödipus löste? (der ___): ___",
				answers: ["Mensch"],
				feedback: "Als Kleinkind krabbelt der Mensch auf vieren, als Erwachsener geht er auf zweien, im Alter am Stock auf dreien.",
			},
			{
				prompt: "Wie heißt der König von Theben, der die Bestattung von Antigones Bruder Polyneikes verbietet? ___",
				answers: ["Kreon", "Creon", "Creōn"],
				feedback: "Kreon verkörpert die unerbittliche Staatsautorität.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und stelle die Argumente von Kreon und Antigone einander knapp gegenüber.",
				model: "Kreon, der König von Theben, verbot, dass Polyneikes begraben wurde, weil er gegen die Heimat gekämpft hatte. Aber Antigone glaubte, dass das göttliche Gesetz größer sei als der Befehl des Königs; deshalb begrub sie ihren Bruder, obwohl sie den Tod fürchtete. ‚Nicht um zu hassen, sondern um zu lieben, bin ich geboren.‘ Gegenüberstellung: Kreon beruft sich auf Staatssicherheit und Bestrafung von Landesverrat; Antigone auf ungeschriebene göttliche Gebote, Menschenwürde und Geschwisterliebe.",
				criteria: [
					"Ich übersetze den AcI mit Passiv-Infinitiv (Polyneicēn sepelīrī) und den ganzen Text korrekt.",
					"Ich stelle sowohl Kreons als auch Antigones Position sachlich dar.",
					"Ich erläutere Antigones abschließendes Bekenntnis.",
				],
			},
			2: {
				language: "de",
				prompt: "Vergleiche die Wertvorstellungen von Antigone, Diogenes, Cicero und Augustus in einer kurzen Stellungnahme: Welche Haltung überzeugt dich für unser heutiges Zusammenleben am meisten, und warum?",
				model: "Antigone steht für Zivilcourage und Menschenwürde gegen ungerechte Befehle, Diogenes für innere Unabhängigkeit von Konsum und Macht, Cicero für Rechtsstaatlichkeit und politischen Dialog, Augustus für stabilen Frieden (allerdings auf Kosten der Freiheit). Für eine moderne Demokratie sind Ciceros Rechtsstaat und Antigones Schutz der Menschenwürde unverzichtbar — Gesetze sichern Frieden, müssen aber stets an Grundrechten gemessen werden.",
				criteria: [
					"Ich ordne alle vier Gestalten (Antigone, Diogenes, Cicero, Augustus) ihrer zentralen Wertorientierung zu.",
					"Ich stelle einen klaren Bezug zur heutigen Gesellschaft her.",
					"Ich begründe meine eigene Werthaltung nachvollziehbar.",
				],
			},
		},
		workshop: {
			kind: "myth",
			goals: [
				{
					label: "AcI mit Passiv-Infinitiv im Text analysieren",
					before: "Creōn vetuit Polyneicēn sepelīrī → sepelīrī ist",
					after: "",
					options: ["Infinitiv Präsens Passiv", "Infinitiv Perfekt Aktiv", "Konjunktiv Imperfekt"],
					answer: "Infinitiv Präsens Passiv",
					explanation: "sepelīre (begraben) → Inf. Präs. Pass. sepelīrī (begraben werden).",
				},
				{
					label: "Theben geographisch verorten",
					before: "Der thebanische Sagenkreis spielt in der bedeutenden Stadt Theben in →",
					after: "",
					options: ["Griechenland (Böotien)", "Sizilien", "Raetien"],
					answer: "Griechenland (Böotien)",
					explanation: "Das griechische Theben lag nordwestlich von Athen.",
				},
				{
					label: "Wertevergleich präzisieren",
					before: "Wer sich aus Gewissensgründen einem ungerechten Befehl widersetzt, handelt im Geist von →",
					after: "",
					options: ["Antigone", "Kreon", "Hannibal"],
					answer: "Antigone",
					explanation: "Antigone gilt bis heute als klassisches Symbol für Zivilcourage und Menschenwürde.",
				},
			],
		},
	},
	{
		id: "l7-textanalyse-methoden",
		stage: "mythos",
		title: "Lateinische Texte erschließen & übersetzen",
		skill: "Textstrukturen (Leitbegriffe, Konnektoren, Tempus-/Modusprofile) herausarbeiten, Übersetzungsmethoden nutzen und Fehler prüfen",
		lehrplan: "L7 LB 1 & 4 · Textarbeit & Methodik",
		bindings: ["1-strukturen", "1-stellungnahme", "4-analyse", "4-uebersetzen", "4-pruefen", "4-textstruktur", "4-verstehend"],
		paragraphs: [
			"Längere lateinische Texte der 7. Klasse übersetzt du nicht blind Wort für Wort, sondern mit System. Vor dem ersten deutschen Satz verschaffst du dir durch verstehendes Lesen einen Überblick: Welche Personen treten auf (Subjekte, Pronomina)? Welche Leitbegriffe bilden Sachfelder (z. B. Krieg, Frieden, Gericht, Mythos)? Welche Konnektoren gliedern den Gedankengang (prīmum, deinde, autem, sed, itaque, tamen, postrēmō)? Und welches Tempus- und Modusprofil liegt vor (Perfekt = Handlungskette, Imperfekt = Hintergrund/Beschreibung, Konjunktiv = Nebensatz oder Irrealis)? So erkennst du Sinnabschnitte und Gedankenführung schon vor dem Übersetzen!",
			"Beim eigentlichen Übersetzen kombinierst du zwei Methoden: 1. Die analytische Konstruktionsmethode (Prädikat suchen → Subjekt und Objekte erfragen → Partizipial- und Nebensatzklammern abgrenzen) gibt Sicherheit bei langen, verschachtelten Sätzen. 2. Die intuitive (pendelnde) Methode liest Satz für Satz in Sinneinheiten und prüft Erwartungen sofort am nächsten Wort. Zum Schluss folgt der entscheidende Profi-Schritt: die Übersetzungskontrolle! Lies dein deutsches Ergebnis ohne Blick aufs Latein — ergibt jeder Satz Sinn? Stimmen Tempora, Aktiv/Passiv, KNG-Bezüge und die treffende Wortwahl? Wer typische Fehlerquellen (z. B. Perfekt Passiv als Präsens übersetzt, Abl. abs. übersehen) gezielt sucht, verbessert sich am schnellsten.",
		],
		diagram: {
			title: "Die 3-Phasen-Methode für jeden Lateintext",
			subtitle: "Von der Vorentlastung über die Satzanalyse bis zur Qualitätskontrolle.",
			layout: "flow",
			parts: [
				{
					tag: "1 · Vorerschließen",
					title: "Textgliederung & Leitbegriffe",
					formula: "Personen · Konnektoren · Tempora",
					note: "Markiere zuerst Namen, Konnektoren (sed, itaque, tamen) und wiederkehrende Sachfelder — so verstehst du den roten Faden.",
				},
				{
					tag: "2 · Konstruieren",
					title: "Klammern & Satzbau klären",
					formula: "Prädikat → Subjekt → PC / Abl. abs. / AcI",
					note: "Trenne Hauptsatz und Nebensätze sauber und klammere satzwertige Konstruktionen ein, bevor du sie ins Deutsche bringst.",
				},
				{
					tag: "3 · Prüfen",
					title: "Sinn- & Fehlercheck im Deutschen",
					formula: "Stimmt die Logik? Stimmt das Tempus?",
					note: "Lies deine deutsche Übersetzung laut durch und vergleiche jede heikle Stelle (Passiv, Konjunktiv, Kontextbedeutung) noch einmal mit dem Original.",
				},
			],
		},
		material:
			"Prīmum hostēs urbem magnā vī oppugnābant. Cīvēs autem, quamquam numerō īnferiōrēs erant, fortiter resistēbant. Deinde auxiliō sociōrum adventō hostēs fūgērunt. Itaque senātus lēgātīs grātiās ēgit.",
		materialLabel: "Übungstext · Klar gegliederter Bericht mit Konnektoren und Tempusprofil",
		materialLanguage: "la",
		sourceIds: ["lp", "lp-profil"],
		quiz: {
			optionLanguage: "de",
			question: "Was verrät der Wechsel von Imperfekt (oppugnābant, resistēbant) zu Perfekt (fūgērunt, ēgit) im Tempusprofil eines Erzähltextes?",
			answer: "Imperfekt schildert Hintergrund und andauernde Ausgangslage; Perfekt markiert die vorantreibenden Hauptereignisse und Wendepunkte.",
			wrong: [
				"Imperfekt steht immer im Passiv, Perfekt immer im Aktiv.",
				"Imperfekt bezeichnet zukünftige Ereignisse, Perfekt gegenwärtige.",
			],
			explanation: "In lateinischen Erzählungen bildet das Imperfekt die Kulisse/Dauer, das Perfekt den eigentlichen Handlungsschritt.",
		},
		takeaway:
			"Erschließe Texte in drei Schritten: 1. Vorerschließen über Personen, Leitbegriffe, Konnektoren und Tempora; 2. Analytisches und pendelndes Übersetzen; 3. Kritische Fehler- und Stilkontrolle am deutschen Text.",
		practice: [
			{
				prompt: "Welcher Konnektor im Übungstext leitet am Ende die Schlussfolgerung ein (‚deshalb / daher‘)? ___",
				answers: ["Itaque", "itaque"],
				feedback: "itaque (deshalb, daher) verknüpft Ursache und Folge am Textende.",
			},
			{
				prompt: "Mit welchem Satzglied beginnt die klassische analytische Konstruktionsmethode in jedem Hauptsatz? (ein Wort): ___",
				answers: ["Prädikat", "Praedikat"],
				feedback: "Das Prädikat (finites Verb) ist der Motor des Satzes: Es verrät Person, Numerus, Tempus, Modus und benötigte Ergänzungen.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Gliedere den Übungstext anhand der Konnektoren (Prīmum, autem, Deinde, Itaque) in Sinnabschnitte und übersetze alle vier Sätze in flüssiges Deutsch.",
				model: "Gliederung: 1. Ausgangslage/Belagerung (Prīmum … autem), 2. Wendepunkt (Deinde), 3. Folge/Dank (Itaque). Übersetzung: Zuerst griffen die Feinde die Stadt mit großer Gewalt an. Die Bürger aber leisteten tapfer Widerstand, obwohl sie an Zahl unterlegen waren. Dann flohen die Feinde, nachdem die Hilfe der Bundesgenossen eingetroffen war (nach dem Eintreffen der Hilfe). Deshalb dankte der Senat den Gesandten.",
				criteria: [
					"Ich arbeite die Sinnabschnitte über die Konnektoren heraus.",
					"Ich übersetze den Abl. abs. ‚auxiliō sociōrum adventō‘ und alle Tempora treffend.",
					"Ich wähle natürliche deutsche Formulierungen (z. B. ‚an Zahl unterlegen‘).",
				],
			},
			2: {
				language: "de",
				prompt: "Finde und korrigiere die drei typischen Übersetzungsfehler in dieser fehlerhaften Schülerfassung zu ‚Urbs ā mīlitibus servāta est, cum hostēs fūgissent‘: ‚Die Stadt wird von den Soldaten gerettet, weil die Feinde fliehen.‘",
				model: "1. ‚servāta est‘ ist Perfekt Passiv (Vergangenheit), nicht Präsens → ‚wurde gerettet / ist gerettet worden‘. 2. ‚fūgissent‘ ist Konjunktiv Plusquamperfekt (vorzeitig zur Vergangenheit), nicht Präsens → ‚geflohen waren‘. 3. ‚cum‘ passt hier zeitlich/begründend besser als ‚nachdem / weil die Feinde geflohen waren‘. Korrekt: ‚Die Stadt wurde von den Soldaten gerettet, nachdem/weil die Feinde geflohen waren.‘",
				criteria: [
					"Ich erkenne den Tempusfehler bei servāta est (Perfekt Passiv statt Präsens).",
					"Ich erkenne den Tempusfehler bei fūgissent (Plusquamperfekt statt Präsens).",
					"Ich liefere eine sprachlich und grammatikalisch fehlerfreie Verbesserung.",
				],
			},
		},
		workshop: {
			kind: "syntax",
			goals: [
				{
					label: "Konnektor der Gegenüberstellung erkennen",
					before: "‚jedoch / aber‘ (an zweiter Stelle im Satz) →",
					after: "",
					options: ["autem", "itaque", "prīmum"],
					answer: "autem",
					explanation: "autem steht nachgestellt und leitet einen Gegensatz oder eine Weiterführung ein.",
				},
				{
					label: "Sinnabschnitt am Tempusprofil ablesen",
					before: "Imperfekt (oppugnābant) → Perfekt (fūgērunt) signalisiert →",
					after: "",
					options: ["den Übergang von Hintergrund zu Wendepunkt", "den Wechsel von Frage zu Befehl", "einen Irrealis der Gegenwart"],
					answer: "den Übergang von Hintergrund zu Wendepunkt",
					explanation: "Das Perfekt markiert im Erzähltext das entscheidende neue Ereignis.",
				},
				{
					label: "Fehlerdiagnose stellen",
					before: "Wer ‚urbs capta est‘ mit ‚die Stadt wird erobert‘ übersetzt, verwechselt →",
					after: "",
					options: ["Perfekt Passiv mit Präsens Passiv", "PPA mit PPP", "Aktiv mit Passiv"],
					answer: "Perfekt Passiv mit Präsens Passiv",
					explanation: "PPP + est ist immer Perfekt Passiv (Vergangenheit: wurde erobert).",
				},
			],
		},
	},
	{
		id: "l7-lernen-rezeption",
		stage: "mythos",
		title: "Lernstrategien, Rezeption & kreative Textarbeit",
		skill: "Effektive Lerntechniken und Hilfsmittel wählen, Arbeitspläne gestalten und antike Motive in der Gegenwart erkennen",
		lehrplan: "L7 LB 3 & 4 · Rezeption, Lerntechniken & Selbstorganisation",
		bindings: ["3-kulturdokumente", "4-kreativ", "4-hilfsmittel", "4-lerntechniken", "4-organisation", "4-sicherung", "4-offen", "4-kooperativ"],
		paragraphs: [
			"Rund 900 Vokabeln, vier Konjunktive, Passiv und Partizipialkonstruktionen lernt man nicht in einer Nacht vor der Schulaufgabe — sondern mit kluger Selbstorganisation! Wirksame Lerntechniken verbinden mehrere Sinne und Vernetzungen: regelmäßiges aktives Abrufen mit Vokabelkartei oder digitalem Spaced-Repetition-Programm (wie ZAM!), Verknüpfung über Wortfamilien und Fremdwörter (cōnferre ↔ Konferenz), eigene Eselsbrücken (z. B. ‚Weimar‘ / a→e, sonst a für den Konjunktiv Präsens) und realistische Lernpläne (z. B. 10–15 Minuten täglich in drei Bausteinen: Vokabeln, eine Formenreihe, ein Satz zum Übersetzen). Auch im offenen Unterricht (Wochenplan, Lernzirkel) oder in Partnerarbeit helfen klare Rollen und konstruktives Feedback.",
			"Zugleich begegnet dir das antike Erbe überall in unserer Gegenwart — in Sentenzen und geflügelten Worten (‚errāre hūmānum est‘, ‚pāx vōbīscum‘, ‚carpe diem‘), in Werbesprüchen und Markennamen (Nivea, Audi, Nike, Ajax, Apollo), sowie in Theater, Literatur, Comics und Filmen (etwa Asterix, moderne Antigone-Inszenierungen oder Fantasy-Mythen). Wenn du Texte kreativ umsetzt — als Schaukasten, Hörszene, Rollenspiel, übersichtliches Lernplakat oder digitale Visualisierung — sicherst du dein Wissen besonders nachhaltig.",
		],
		diagram: {
			title: "Nachhaltig lernen & Antike heute entdecken",
			subtitle: "Drei Strategien für stressfreie Prüfungsvorbereitung und kreative Textarbeit.",
			layout: "triptych",
			parts: [
				{
					tag: "Lernstrategie",
					title: "Aktiv abrufen & vernetzen",
					formula: "Kartei / ZAM · Wortfamilien · Eselsbrücken",
					note: "Kurze, verteilte Wiederholungen (10–15 min täglich) schlagen stundenlanges Durchlesen deutlich.",
				},
				{
					tag: "Organisation",
					title: "Planen, sichern, kooperieren",
					formula: "Zeitplan · Lernplakat · Partnerfeedback",
					note: "Teile den Schulaufgabenstoff eine Woche vorher in tägliche Etappen ein und überprüfe dich mit Hilfsmitteln und Lernpartnern.",
				},
				{
					tag: "Rezeption",
					title: "Antike in Alltag & Kunst",
					formula: "Sentenzen · Werbung · Theater & Film",
					note: "Mythen und lateinische Sprüche wirken bis heute fort — kreative Projekte (Rollenspiel, Poster, Podcast) machen sie greifbar.",
				},
			],
		},
		material:
			"Antike Sentenzen & Rezeption:\n1. ‚Errāre hūmānum est.‘ (Irren ist menschlich — Seneca/Hieronymus)\n2. ‚Repetitio est māter studiōrum.‘ (Wiederholung ist die Mutter des Lernens.)\n3. ‚Nōn scholae, sed vītae discimus.‘ (Nicht für die Schule, sondern für das Leben lernen wir — nach Seneca)\n4. Produkt- und Kulturbeispiele: Audi (Höre!), Nivea (schneeweiß), Nike (Siegesgöttin), Ikarus- und Antigone-Motive in Theater und Film.",
		materialLabel: "Übungsmaterial · Sentenzen, Lernprinzip und antikes Erbe",
		materialLanguage: "de",
		sourceIds: ["lp", "lp-profil"],
		quiz: {
			optionLanguage: "de",
			question: "Welche Lernstrategie führt beim Aufbau des Grundwortschatzes (ca. 900 Wörter) nachweislich zum nachhaltigsten Erfolg?",
			answer: "Regelmäßiges, zeitlich verteiltes aktives Abrufen (z. B. Karteikasten oder ZAM) kombiniert mit Wortfamilien und Beispielsätzen.",
			wrong: [
				"Die gesamte Vokabelliste einmal am Abend vor der Schulaufgabe stumm durchlesen.",
				"Nur deutsche Übersetzungen auswendig lernen ohne Stammformen und Genus.",
			],
			explanation: "Verteiltes aktives Erinnern (Spaced Repetition) und das Vernetzen mit Stammformen, Wortfamilien und Kontext verankern Vokabeln dauerhaft.",
		},
		takeaway:
			"Nachhaltiges Lateinlernen kombiniert kurze tägliche Wiederholungen (Kartei/ZAM), Vernetzung über Wortfamilien, strukturierte Zeitpläne und kreative wie kooperative Textarbeit. Antike Sentenzen und Mythen begegnen uns bis heute täglich.",
		practice: [
			{
				prompt: "Was bedeutet die bekannte lateinische Sentenz ‚Errāre hūmānum est‘? (___ ist menschlich): ___",
				answers: ["Irren"],
				feedback: "errāre (irren) + hūmānum (menschlich) + est → Irren ist menschlich.",
			},
			{
				prompt: "Wie lautet das lateinische Schlüsselwort für ‚Wiederholung‘ in ‚___ est māter studiōrum‘? ___",
				answers: ["Repetitio", "Repetītiō"],
				feedback: "Repetītiō est māter studiōrum = Wiederholung ist die Mutter des Lernens.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Entwirf einen realistischen 5-Tage-Vorbereitungsplan für eine Latein-7-Schulaufgabe (je ca. 20 Minuten pro Tag), der Wortschatz, Formen (z. B. Passiv/Konjunktiv), Satzkonstruktionen (PC/Abl. abs.) und eine Selbstkontrolle abdeckt.",
				model: "Tag 1: 20 Kernvokabeln mit Stammformen aktiv abrufen + u-/e-Deklination wiederholen. Tag 2: Passiv (Präsens- und Perfektstamm) + 3 kurze Aktiv-Passiv-Umformungen. Tag 3: Partizipien (PPP/PPA) + 2 PC- und 2 Abl.-abs.-Sätze übersetzen. Tag 4: Konjunktiv-Moduszeichen + Consecutio temporum in 3 Nebensätzen üben. Tag 5: Einen kurzen Übungstext unter Zeitdruck übersetzen, mit Musterlösung Fehler analysieren und offene Fragen für die Partnerarbeit notieren.",
				criteria: [
					"Mein Plan verteilt den Stoff realistisch über 5 kurze Einheiten.",
					"Er deckt Wortschatz, Formenlehre, Satzlehre und Fehlerkontrolle ab.",
					"Er enthält aktives Üben statt bloßem Durchlesen.",
				],
			},
			2: {
				language: "de",
				prompt: "Plane eine kurze kreative Umsetzung (z. B. ein Lernplakat, eine 2-Minuten-Rollenspielszene oder einen digitalen Schaukasten) zu einem Mythos oder historischen Thema der 7. Klasse und beschreibe, wie du dabei im Team arbeitest und Ergebnisse übersichtlich präsentierst.",
				model: "Projekt: Rollenspiel ‚Gerichtsverhandlung gegen Antigone vor König Kreon‘. Planung im Dreierteam: Person A bereitet Kreons Argumente mit 2 lateinischen Schlüsselbegriffen (lēx, patria) vor, Person B Antigones Gegenrede (pietās, lēx dīvīna), Person C moderiert als Chor und erstellt eine übersichtliche Tafelgrafik mit Pro/Contra-Spalten. Vor der Präsentation proben wir einmal gemeinsam und geben uns konstruktives Feedback zu Klarheit und Argumentation.",
				criteria: [
					"Ich wähle eine altersgemäße kreative Darstellungsform zu einem L7-Thema.",
					"Ich plane klare, faire Aufgaben für kooperative Partner- oder Gruppenarbeit.",
					"Ich beschreibe eine übersichtliche Sicherung oder Präsentation des Ergebnisses.",
				],
			},
		},
		workshop: {
			kind: "myth",
			goals: [
				{
					label: "Sentenz mit Infinitiv als Subjekt deuten",
					before: "‚Errāre hūmānum est‘ → welches Wort ist das Subjekt?",
					after: "",
					options: ["Errāre (das Irren)", "hūmānum", "est"],
					answer: "Errāre (das Irren)",
					explanation: "Der substantivierte Infinitiv errāre bildet das Subjekt; hūmānum ist Prädikatsnomen.",
				},
				{
					label: "Hilfsmittel gezielt einsetzen",
					before: "Wenn du im Text die Form ‚rettulērunt‘ nicht sofort erkennst, schlägst du nach unter →",
					after: "",
					options: ["den Stammformen von referre (rettulī)", "den Substantiven der u-Deklination", "den römischen Zahlzeichen"],
					answer: "den Stammformen von referre (rettulī)",
					explanation: "Ein Blick in die Stammformenliste deines Lehrbuchs klärt unregelmäßige Perfektstämme sofort.",
				},
				{
					label: "Antike Rezeption im Alltag erkennen",
					before: "Der Markenname ‚Nivea‘ stammt vom lateinischen Adjektiv niveus →",
					after: "",
					options: ["schneeweiß", "schnell", "neu"],
					answer: "schneeweiß",
					explanation: "nix, nivis (Schnee) → niveus (schneeweiß, wegen der weißen Creme).",
				},
			],
		},
	},
];
