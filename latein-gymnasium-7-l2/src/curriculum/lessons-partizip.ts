import type { Lesson } from "../types";

export const LESSONS_PARTIZIP: Lesson[] = [
	{
		id: "l7-ppp-formen",
		stage: "partizip",
		title: "Partizip Perfekt Passiv (PPP) – Bildung & Bedeutung",
		skill: "Das PPP aus der 4. Stammform erkennen, nach der a-/o-Deklination beugen und vorzeitig-passivisch verstehen",
		lehrplan: "L7 LB 2.2 · Formenlehre (Nominalformen des Verbs)",
		bindings: ["2.2-verben", "2.2-kategorien", "2.2-bilden"],
		paragraphs: [
			"Ein Partizip ist ein ‚Mittelwort‘ zwischen Verb und Adjektiv: Wie ein Verb trägt es eine Handlung und ein Zeitverhältnis in sich, wie ein Adjektiv wird es dekliniert und stimmt mit einem Bezugswort in Kasus, Numerus und Genus (KNG) überein. Das Partizip Perfekt Passiv (PPP) lernst du direkt als vierte Stammform mit: laudāre, laudō, laudāvī, laudātum → laudātus, -a, -um (gelobt); mittere, mittō, mīsī, missum → missus, -a, -um (geschickt); vincere, vincō, vīcī, victum → victus, -a, -um (besiegt).",
			"Die doppelte Grundbedeutung des PPP musst du im Schlaf wissen: Es ist immer vorzeitig und passiv! ‚mīles vocātus‘ bedeutet also wörtlich ‚der gerufene Soldat‘ — einer, der zuvor gerufen worden ist. Dekliniert wird das PPP vollständig wie bonus, bona, bonum nach der a- und o-Deklination. Du begegnest ihm an drei Stellen der 7. Klasse: im Perfektstamm des Passivs (urbs capta est), im Infinitiv Perfekt Passiv (urbem captam esse) und als Baustein von Participium coniunctum und Ablativus absolutus.",
		],
		diagram: {
			title: "Das PPP: Form, Deklination und Doppelbedeutung",
			subtitle: "Jedes PPP vereint zwei Eigenschaften des Verbs mit der a-/o-Deklination.",
			layout: "triptych",
			parts: [
				{
					tag: "Bildung",
					title: "4. Stammform auf -tus / -sus",
					formula: "laudātus · monitus · missus · victus",
					note: "Lerne immer alle vier Stammformen! Bei regelmäßigen a-Verben endet das PPP auf -ātus, bei vielen konsonantischen Verben auf -tus oder -sus.",
				},
				{
					tag: "Bedeutung",
					title: "Immer VORZEITIG & PASSIV",
					formula: "captus = gefangen worden seiend",
					note: "Die Handlung des PPP ist vor dem Hauptsatz geschehen, und das Bezugswort hat sie erlitten (passiv).",
				},
				{
					tag: "Deklination",
					title: "Wie bonus, -a, -um",
					formula: "urbs capta · mīlitēs missī",
					note: "Durch KNG-Kongruenz erkennst du sofort, zu welchem Substantiv das PPP im Satz gehört.",
				},
			],
		},
		material:
			"Lēgātī ā senātū missī epistulam scriptam portant. Hostēs victī arma dēpōnunt, et cīvēs servātī deīs grātiās agunt. Verba dicta memoriā tenēmus.",
		materialLabel: "Übungstext · PPP in verschiedenen Kasus und Genera",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Welche zeitliche und diathese-bezogene Bedeutung hat das lateinische PPP (Partizip Perfekt Passiv, z. B. vocātus, -a, -um)?",
			answer: "Vorzeitig und Passiv (ein gerufener / nachdem er gerufen worden war).",
			wrong: [
				"Gleichzeitig und Aktiv (ein rufender / während er ruft).",
				"Nachzeitig und Aktiv (ein rufen wollender).",
			],
			explanation: "Das PPP (Partizip Perfekt Passiv) bezeichnet immer eine bereits abgeschlossene (vorzeitige) Handlung im Passiv.",
		},
		takeaway:
			"Das PPP (4. Stammform auf -tus/-sus) wird wie bonus, -a, -um dekliniert und hat stets die Doppelbedeutung vorzeitig + passiv.",
		practice: [
			{
				prompt: "Bilde das PPP (Nom. Sg. m.) von vincere (vīcī, victum): ___",
				answers: ["victus"],
				feedback: "Aus der 4. Stammform victum entsteht das PPP victus, -a, -um (besiegt).",
			},
			{
				prompt: "Bilde das PPP zu ‚epistulam‘ (Akk. Sg. f.) von scrībere (scrīpsī, scrīptum): ___",
				answers: ["scriptam", "scrīptam"],
				feedback: "epistulam ist Akk. Sg. f. → das PPP lautet scrīptam.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und bestimme Kasus, Numerus, Genus sowie die Grundform (Infinitiv) der vier PPP missī, scriptam, victī und dicta.",
				model: "Die vom Senat geschickten Gesandten tragen den geschriebenen Brief. Die besiegten Feinde legen die Waffen nieder, und die geretteten Bürger danken den Göttern. Die gesprochenen Worte behalten wir im Gedächtnis. missī: Nom. Pl. m. (mittere); scrīptam: Akk. Sg. f. (scrībere); victī: Nom. Pl. m. (vincere); dicta: Akk. Pl. n. (dīcere).",
				criteria: [
					"Ich übersetze alle vier PPP passivisch und sinnvoll.",
					"Ich bestimme KNG zu jedem PPP richtig.",
					"Ich führe jedes PPP auf seinen Infinitiv zurück.",
				],
			},
			2: {
				language: "de",
				prompt: "Erkläre den Unterschied zwischen ‚mīles vocāvit‘ und ‚mīles vocātus‘. Warum ist ‚mīles vocātus‘ allein noch kein vollständiger lateinischer Satz?",
				model: "‚mīles vocāvit‘ ist eine finite Verbform im Perfekt Aktiv (Der Soldat rief) und bildet einen vollständigen Satz. ‚mīles vocātus‘ enthält dagegen ein Partizip (der gerufene Soldat / der Soldat, nachdem er gerufen worden war) ohne finites Prädikat — erst mit einem zweiten Verb (z. B. venit oder est) entsteht ein vollständiger Satz.",
				criteria: [
					"Ich unterscheide Aktiv (vocāvit) und Passiv (vocātus).",
					"Ich erkläre den Unterschied zwischen finitem Verb und Partizip.",
					"Ich ergänze ‚mīles vocātus‘ sinnvoll zu einem vollständigen Satz.",
				],
			},
		},
		workshop: {
			kind: "participle",
			goals: [
				{
					label: "KNG-Kongruenz im Neutrum Plural",
					before: "die gesprochenen Worte → verba",
					after: "",
					options: ["dicta", "dictī", "dictae"],
					answer: "dicta",
					explanation: "verba ist Nom./Akk. Pl. Neutrum → PPP dicta.",
				},
				{
					label: "Stammform zum PPP erkennen",
					before: "captus, -a, -um gehört zum Verb →",
					after: "",
					options: ["capere", "cadere", "canere"],
					answer: "capere",
					explanation: "capere, capiō, cēpī, captum (fangen, einnehmen).",
				},
				{
					label: "Doppelbedeutung des PPP sichern",
					before: "mīlitēs ā duce monitī →",
					after: "",
					options: ["vorzeitig & passiv", "gleichzeitig & aktiv", "gleichzeitig & passiv"],
					answer: "vorzeitig & passiv",
					explanation: "Das PPP drückt immer Vorzeitigkeit und Passiv aus.",
				},
			],
		},
	},
	{
		id: "l7-ppa-formen",
		stage: "partizip",
		title: "Partizip Präsens Aktiv (PPA) – Bildung & Bedeutung",
		skill: "Das PPA auf -ns/-ntis nach der 3. Deklination bestimmen und gleichzeitig-aktivisch übersetzen",
		lehrplan: "L7 LB 2.2 · Formenlehre (Nominalformen des Verbs)",
		bindings: ["2.2-verben", "2.2-kategorien", "2.2-bilden"],
		paragraphs: [
			"Das Gegenstück zum PPP ist das Partizip Präsens Aktiv (PPA). Du bildest es vom Präsensstamm mit den Kennzeichen -ns im Nominativ Singular und -nt- in allen weiteren Kasus: laudāre → laudāns, laudantis (lobend); monēre → monēns, monentis; dūcere → dūcēns, dūcentis; capere → capiēns, capientis; audīre → audiēns, audientis; ferre → ferēns, ferentis. Beachte das i-e (capiēns, audiēns) in der i-Konjugation und der konsonantischen Konjugation mit i-Erweiterung!",
			"Das PPA ist immer gleichzeitig und aktiv! ‚mīles clāmāns‘ bedeutet ‚der rufende Soldat‘ — er ruft selbst, und zwar genau während die Handlung des Hauptsatzes stattfindet. Dekliniert wird das PPA einendig nach der 3. Deklination: Im Genitiv Plural steht immer -ium (clāmantium), im Nom./Akk. Plural Neutrum -ia (clāmantia). Beim Ablativ Singular merkst du dir eine nützliche Faustregel: Als bloßes Attribut steht meist -ī (ā mīlite clāmantī), als Teil eines Participium coniunctum oder Ablativus absolutus steht -e (cōnsule dīcente = während der Konsul spricht).",
		],
		diagram: {
			title: "Das PPA im Direktvergleich zum PPP",
			subtitle: "Prüfe Stamm, Endung -ns/-nt- und die Bedeutung Gleichzeitigkeit + Aktiv.",
			layout: "contrast",
			parts: [
				{
					tag: "Bildung",
					title: "Präsensstamm + -ns / -nt-",
					formula: "laudāns, -ntis · audiēns, -entis",
					note: "Das Kennzeichen -nt- (Nom. Sg. -ns) verrät jedes PPA sofort. Bei capere und audīre steht -iēns / -ient-.",
				},
				{
					tag: "Bedeutung",
					title: "Immer GLEICHZEITIG & AKTIV",
					formula: "clāmāns = rufend / während er ruft",
					note: "Das Bezugswort handelt selbst (aktiv), zur selben Zeit wie das Hauptverb (gleichzeitig).",
				},
				{
					tag: "3. Deklination",
					title: "Abl. Sg. -e / -ī · Gen. Pl. -ium",
					formula: "mīlitēs clāmantēs · cōnsule dīcente",
					note: "Im Abl. abs. und bei erweitertem Partizip steht im Abl. Sg. -e (cōnsule dīcente).",
				},
			],
		},
		material:
			"Cōnsul ad forum veniēns cīvēs clāmantēs videt. Audīmus ōrātōrem dē pāce dīcentem. Mīlitēs patriam dēfendentēs glōriam quaerunt, et puerī lūdentēs magistrum nōn audiunt.",
		materialLabel: "Übungstext · Szenen auf dem Forum mit PPA",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Welche Bedeutung hat das PPA ‚dēfendentēs‘ in ‚Mīlitēs patriam dēfendentēs‘?",
			answer: "Gleichzeitig und Aktiv: die Soldaten, während sie die Heimat verteidigen.",
			wrong: [
				"Vorzeitig und Passiv: die Soldaten, nachdem sie verteidigt worden waren.",
				"Vorzeitig und Aktiv: die Soldaten, nachdem sie verteidigt hatten.",
			],
			explanation: "Das PPA (-ns/-nt-) ist immer gleichzeitig und aktiv; ‚patriam‘ ist sein Akkusativobjekt.",
		},
		takeaway:
			"Das PPA erkennst du an -ns / -nt- nach der 3. Deklination (laudāns, laudantis; audiēns, audientis). Es drückt stets Gleichzeitigkeit und Aktiv aus.",
		practice: [
			{
				prompt: "Bilde den Nominativ Singular des PPA von audīre (hörend): ___",
				answers: ["audiens", "audiēns"],
				feedback: "Die i-Konjugation bildet das PPA auf -iēns: audiēns, audientis.",
			},
			{
				prompt: "Bilde den Akkusativ Singular Maskulinum des PPA von dīcere (ōrātōrem ___): ___",
				answers: ["dicentem", "dīcentem"],
				feedback: "Stamm dīcent- + Akkusativ-Singular-Endung -em der 3. Deklination → dīcentem.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und bestimme KNG zu veniēns, clāmantēs, dīcentem und dēfendentēs.",
				model: "Während der Konsul zum Forum kommt, sieht er die rufenden Bürger. Wir hören den Redner, wie er über den Frieden spricht. Die Soldaten, die ihre Heimat verteidigen, suchen Ruhm, und die spielenden Knaben hören den Lehrer nicht. veniēns: Nom. Sg. m.; clāmantēs: Akk. Pl. m.; dīcentem: Akk. Sg. m.; dēfendentēs: Nom. Pl. m.",
				criteria: [
					"Ich übersetze alle vier PPA aktivisch und gleichzeitig.",
					"Ich beziehe patriam als Objekt auf dēfendentēs.",
					"Ich bestimme KNG aller vier Partizipien korrekt.",
				],
			},
			2: {
				language: "de",
				prompt: "Stelle ‚mīles vocāns‘ und ‚mīles vocātus‘ gegenüber: Erkläre an beiden Formen Bildung, Deklinationsklasse, Zeitverhältnis und Aktiv/Passiv.",
				model: "vocāns (PPA): vom Präsensstamm + -ns/-nt-, 3. Deklination, gleichzeitig und aktiv (der rufende Soldat). vocātus (PPP): 4. Stammform auf -tus, a-/o-Deklination, vorzeitig und passiv (der gerufene Soldat).",
				criteria: [
					"Ich nenne beide Stammformen und Deklinationsklassen richtig.",
					"Ich stelle gleichzeitig/aktiv und vorzeitig/passiv klar gegenüber.",
					"Ich übersetze beide Formen treffend.",
				],
			},
		},
		workshop: {
			kind: "participle",
			goals: [
				{
					label: "PPA der i-Erweiterung bilden",
					before: "capere (ergreifend, Nom. Sg.) →",
					after: "",
					options: ["capiēns", "capēns", "captus"],
					answer: "capiēns",
					explanation: "capere gehört zur konsonantischen Konjugation mit i-Erweiterung → capiēns.",
				},
				{
					label: "KNG-Kongruenz im Akkusativ Plural",
					before: "Wir sehen die laufenden Soldaten: Vidēmus mīlitēs",
					after: "",
					options: ["currentēs", "currentibus", "currens"],
					answer: "currentēs",
					explanation: "mīlitēs ist Akkusativ Plural Maskulinum → PPA currentēs.",
				},
				{
					label: "PPA und PPP sicher unterscheiden",
					before: "‚der von Freunden gelobte Bürger‘ → cīvis",
					after: "",
					options: ["laudātus", "laudāns", "laudantēs"],
					answer: "laudātus",
					explanation: "Passivisch (gelobt) verlangt das PPP laudātus, nicht das aktive PPA laudāns.",
				},
			],
		},
	},
	{
		id: "l7-pc-attribut",
		stage: "partizip",
		title: "Participium coniunctum (PC) als Attribut & Relativsatz",
		skill: "Die Partizipialklammer durch KNG-Kongruenz abgrenzen und das PC als Attribut oder Relativsatz übersetzen",
		lehrplan: "L7 LB 2.3 & 4 · Satzlehre & Methodik (PC)",
		bindings: ["2.3-konstruktionen", "2.3-binnenaufbau", "4-analyse"],
		paragraphs: [
			"Verbindet sich ein Partizip (PPP oder PPA) durch KNG-Kongruenz mit einem Bezugswort im Satz und nimmt dabei noch eigene Erweiterungen (Objekte, Adverbiale) zu sich, nennt man die ganze Gruppe ein Participium coniunctum (PC = verbundenes Partizip). Im Lateinischen bilden Bezugswort und Partizip häufig eine Klammer, in der alle Erweiterungen des Partizips stehen: ‚Hostēs urbem [ā mīlitibus dēfēnsam] oppugnant‘.",
			"Zuerst markierst du beim Übersetzen diese Klammer: Suche das Partizip, finde sein KNG-kongruentes Bezugswort und prüfe, welche Wörter dazwischen zum Partizip gehören. Wenn das PC das Bezugswort näher beschreibt (attributive Funktion), hast du zwei klare Übersetzungswege: 1. wörtlich als Partizipialattribut (‚die von den Soldaten verteidigte Stadt‘ — klingt im Deutschen nur gut, wenn der Block kurz ist) oder 2. elegant als Relativsatz (‚die Stadt, die von den Soldaten verteidigt worden war‘). Achte im Relativsatz genau auf das Zeitverhältnis: PPP = vorzeitig, PPA = gleichzeitig!",
		],
		diagram: {
			title: "Die PC-Klammer knacken (Attribut & Relativsatz)",
			subtitle: "Arbeite ein Participium coniunctum immer in drei festen Schritten ab.",
			layout: "flow",
			parts: [
				{
					tag: "1 · KNG-Paar",
					title: "Bezugswort ↔ Partizip",
					formula: "urbem (Akk. Sg. f.) … dēfēnsam",
					note: "Gleicher Kasus, gleicher Numerus, gleiches Genus verbinden Bezugswort und Partizip zu einer gedanklichen Klammer.",
				},
				{
					tag: "2 · Binnenblock",
					title: "Erweiterungen einsammeln",
					formula: "[ā mīlitibus dēfēnsam]",
					note: "Alles, was von der Handlung des Partizips abhängt (hier der Urheber ā mīlitibus), gehört mit in den PC-Block.",
				},
				{
					tag: "3 · Übersetzen",
					title: "Attribut oder Relativsatz",
					formula: "die Stadt, die … verteidigt worden war",
					note: "Der Relativsatz ist im Deutschen fast immer die sauberste Lösung für längere PC-Blöcke.",
				},
			],
		},
		material:
			"Cōnsul mīlitēs [in castrīs exspectantēs] vocāvit. Deinde epistulam [ā senātū missam] recitāvit. Rōmānī oppidum [ab hostibus dēlētum] iterum aedificāvērunt.",
		materialLabel: "Übungstext · PC-Klammern mit PPA und PPP",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Welche Relativsatz-Übersetzung trifft ‚Cōnsul epistulam ā senātū missam recitāvit‘ zeitlich genau?",
			answer: "Der Konsul verlas den Brief, der vom Senat geschickt worden war.",
			wrong: [
				"Der Konsul verlas den Brief, der vom Senat geschickt wird.",
				"Der Konsul verlas den Brief, der den Senat schickte.",
			],
			explanation: "missam (PPP) ist vorzeitig zu recitāvit (Vergangenheit) und passiv → Plusquamperfekt Passiv im Relativsatz.",
		},
		takeaway:
			"Im Participium coniunctum bilden Bezugswort und Partizip durch KNG-Kongruenz eine Klammer. Als Attribut übersetzt du es wörtlich oder — meist flüssiger — als Relativsatz mit richtigem Zeitverhältnis.",
		practice: [
			{
				prompt: "Welches Wort ist im Satz ‚Rōmānī oppidum ab hostibus dēlētum aedificāvērunt‘ das Bezugswort zum Partizip dēlētum? ___",
				answers: ["oppidum"],
				feedback: "oppidum und dēlētum stehen beide im Akkusativ Singular Neutrum (KNG-Kongruenz).",
			},
			{
				prompt: "Übersetze das PPA ‚in castrīs exspectantēs‘ nach ‚vocāvit‘ als Relativsatz: die im Lager ___ (ein Verb im Präteritum).",
				answers: ["warteten"],
				feedback: "exspectantēs (PPA) ist gleichzeitig zu vocāvit (Vergangenheit) → Präteritum Aktiv: warteten.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze alle drei Sätze des Übungstextes jeweils mit einem Relativsatz ins Deutsche.",
				model: "Der Konsul rief die Soldaten, die im Lager warteten. Darauf verlas er den Brief, der vom Senat geschickt worden war. Die Römer bauten die Stadt wieder auf, die von den Feinden zerstört worden war.",
				criteria: [
					"Ich gebe das PPA exspectantēs gleichzeitig-aktivisch wieder.",
					"Ich gebe beide PPP (missam, dēlētum) vorzeitig-passivisch wieder.",
					"Ich ordne alle Erweiterungen (in castrīs, ā senātū, ab hostibus) dem richtigen Relativsatz zu.",
				],
			},
			2: {
				language: "de",
				prompt: "Übersetze ‚Cīvēs ducem ab hostibus captum servāvērunt‘ einmal wörtlich (Partizipialattribut) und einmal als Relativsatz. Begründe, welche Variante stilistisch besser klingt.",
				model: "Wörtlich: Die Bürger retteten den von den Feinden gefangen genommenen Anführer. Relativsatz: Die Bürger retteten den Anführer, der von den Feinden gefangen genommen worden war. Der Relativsatz ist leichter lesbar, weil die deutsche Satzklammer ‚den … Anführer‘ sonst überladen wirkt.",
				criteria: [
					"Ich liefere beide Übersetzungsvarianten korrekt.",
					"Ich beachte Vorzeitigkeit und Passiv bei captum.",
					"Ich begründe den stilistischen Vorteil des Relativsatzes im Deutschen.",
				],
			},
		},
		workshop: {
			kind: "participle",
			goals: [
				{
					label: "KNG-Bezugswort identifizieren",
					before: "Puerī canem in viā currentem vīdērunt → Bezugswort zu currentem:",
					after: "",
					options: ["canem", "puerī", "viā"],
					answer: "canem",
					explanation: "canem und currentem stehen beide im Akkusativ Singular Maskulinum.",
				},
				{
					label: "Zeitverhältnis im Relativsatz wählen",
					before: "Hostēs urbem captam incendērunt → die Stadt, die",
					after: "",
					options: ["eingenommen worden war.", "eingenommen wird.", "einnahm."],
					answer: "eingenommen worden war.",
					explanation: "captam (PPP) ist vorzeitig zu incendērunt (Perfekt) → Plusquamperfekt Passiv.",
				},
				{
					label: "Binnenblock richtig zuordnen",
					before: "Im Satz ‚Lēgātus verba ā cōnsule dicta audīvit‘ gehört ‚ā cōnsule‘ zu →",
					after: "",
					options: ["dicta", "audīvit", "lēgātus"],
					answer: "dicta",
					explanation: "ā cōnsule nennt den Urheber des passiven Partizips dicta (vom Konsul gesprochen).",
				},
			],
		},
	},
	{
		id: "l7-pc-adverbiale",
		stage: "partizip",
		title: "Participium coniunctum (PC) als Adverbiale",
		skill: "Ein PC nach dem Sinnzusammenhang als Adverbialsatz (temporal, kausal, konzessiv, konditional, modal) oder Beiordnung übersetzen",
		lehrplan: "L7 LB 2.3 & 4 · Satzlehre & Methodik (PC)",
		bindings: ["2.3-konstruktionen", "2.3-binnenaufbau", "2.3-sprachvergleich", "2.3-stil", "4-analyse"],
		paragraphs: [
			"Oft beschreibt ein Participium coniunctum nicht bloß eine Eigenschaft, sondern gibt den Grund, den Zeitpunkt, einen Gegensatz oder die Art und Weise zur Haupthandlung an (adverbiale Funktion). Im Lateinischen steht keine Subjunktion wie ‚weil‘ oder ‚obwohl‘ — erst du entscheidest aus dem Sinnzusammenhang, welches logische Verhältnis passt!",
			"Dafür kennst du die vier bewährten Übersetzungsmöglichkeiten des PC: 1. Adverbialsatz mit passender Sinnrichtung: temporal (nachdem beim PPP / während beim PPA), kausal (weil, da), konzessiv (obwohl), konditional (wenn, falls) oder modal (indem). 2. Beiordnung zweier Hauptsätze mit ‚und (dann)‘ oder ‚aber‘ (z. B. ‚Die Stadt war verteidigt worden, aber die Feinde eroberten sie dennoch‘). 3. Relativsatz oder 4. präpositionaler Ausdruck / wörtliches Partizip. Wichtige Regel: Wenn der Hauptsatz im Präsens steht, bringt das PPP Perfekt (nachdem … worden ist); steht der Hauptsatz in der Vergangenheit, bringt das PPP Plusquamperfekt (nachdem … worden war).",
		],
		diagram: {
			title: "Vom lateinischen PC zur passenden Sinnrichtung",
			subtitle: "Das Partizip liefert Zeit und Aktiv/Passiv — der Sinnzusammenhang liefert die Konjunktion.",
			layout: "flow",
			parts: [
				{
					tag: "Zeit & Diathese",
					title: "PPP vs. PPA prüfen",
					formula: "PPP: vorzeitig/passiv · PPA: glz./aktiv",
					note: "Zuerst die Grammatik klären: Wer handelt, und geschieht es vorher oder gleichzeitig?",
				},
				{
					tag: "Sinnrichtung",
					title: "Logik zum Hauptsatz prüfen",
					formula: "nachdem · weil · obwohl · indem",
					note: "Passt Zeitfolge (temporal), Ursache (kausal), Gegenargument (konzessiv) oder Mittel/Begleitumstand (modal)?",
				},
				{
					tag: "Stilwahl",
					title: "Adverbialsatz oder Beiordnung",
					formula: "Nebensatz oder ‚… und dann …‘",
					note: "Beiordnung (zwei Hauptsätze) macht lange lateinische Perioden im Deutschen besonders klar und lesbar.",
				},
			],
		},
		material:
			"Mīlitēs perīculō territī nōn fūgērunt, sed locum dēfendērunt. Cōnsul vulnerātus ā sociīs in castra portātus est. Hostēs urbem diū oppugnantēs tandem discēdere coāctī sunt.",
		materialLabel: "Übungstext · Konzessives, kausales und temporales PC",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Welche Sinnrichtung passt inhaltlich am besten zu ‚Mīlitēs perīculō territī nōn fūgērunt‘?",
			answer: "Konzessiv: Obwohl die Soldaten von der Gefahr erschreckt worden waren, flohen sie nicht.",
			wrong: [
				"Kausal: Weil die Soldaten erschreckt worden waren, flohen sie nicht.",
				"Final: Damit die Soldaten erschreckt wurden, flohen sie nicht.",
			],
			explanation: "Erschreckt sein und trotzdem nicht fliehen bildet einen klaren Gegensatz → konzessiv (obwohl).",
		},
		takeaway:
			"Ein adverbiales PC lässt die Sinnrichtung offen: Prüfe den Kontext und wähle temporal (nachdem/während), kausal (weil), konzessiv (obwohl), konditional (wenn), modal (indem) oder eine Beiordnung mit ‚und/aber‘.",
		practice: [
			{
				prompt: "Welche Sinnrichtung (ein Fachwort: temporal, kausal oder konzessiv) passt zu ‚Hostēs urbem diū oppugnantēs tandem discessērunt‘ (Sie griffen lange an, zogen aber schließlich ab)? ___",
				answers: ["konzessiv", "temporal"],
				feedback: "‚Obwohl sie die Stadt lange angriffen‘ (konzessiv) — oder zeitlich ‚während/nachdem‘ — trifft den Gegensatz zu ‚tandem discessērunt‘.",
			},
			{
				prompt: "Welche Konjunktion leitet im Deutschen einen konzessiven Adverbialsatz ein? ___",
				answers: ["obwohl", "obgleich"],
				feedback: "‚obwohl‘ (oder ‚obgleich‘) drückt einen Gegensatz (Einräumung = konzessiv) aus.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und begründe für den ersten und zweiten Satz, welche Sinnrichtung (konzessiv, kausal, temporal) du gewählt hast.",
				model: "Obwohl die Soldaten von der Gefahr erschreckt worden waren, flohen sie nicht, sondern verteidigten ihre Stellung (konzessiv wegen des Gegensatzes). Weil der Konsul verwundet worden war, wurde er von den Gefährten ins Lager getragen (kausal, Grund für den Transport). Obwohl die Feinde die Stadt lange angriffen, wurden sie schließlich zum Abzug gezwungen.",
				criteria: [
					"Ich übersetze alle drei PC mit passenden Sinnrichtungen und Tempora.",
					"Ich begründe den Gegensatz (konzessiv) im ersten Satz.",
					"Ich begründe Ursache und Folge (kausal/temporal) im zweiten Satz.",
				],
			},
			2: {
				language: "de",
				prompt: "Übersetze ‚Cīvēs lēgātum pācem petentem benignē accēpērunt‘ auf drei verschiedene Arten (Adverbialsatz, Relativsatz, Beiordnung) und bewerte, welche Fassung hier am treffendsten ist.",
				model: "Adverbialsatz (kausal/temporal): Weil/Als der Gesandte um Frieden bat, nahmen die Bürger ihn freundlich auf. Relativsatz: Die Bürger nahmen den Gesandten, der um Frieden bat, freundlich auf. Beiordnung: Der Gesandte bat um Frieden, und die Bürger nahmen ihn freundlich auf. Der Relativsatz oder kausale Adverbialsatz macht den Grund der freundlichen Aufnahme am klarsten.",
				criteria: [
					"Ich übersetze den Satz in allen drei geforderten Varianten richtig.",
					"Ich bewahre Gleichzeitigkeit und Aktiv bei petentem.",
					"Ich begründe meine stilistische Bewertung nachvollziehbar.",
				],
			},
		},
		workshop: {
			kind: "participle",
			liveModel: "timeline",
			goals: [
				{
					label: "Kausale Sinnrichtung erkennen",
					before: "Cīvēs famē coāctī pācem petīvērunt →",
					after: "",
					options: ["Weil sie vom Hunger gezwungen worden waren", "Obwohl sie vom Hunger gezwungen worden waren", "Indem sie den Hunger zwangen"],
					answer: "Weil sie vom Hunger gezwungen worden waren",
					explanation: "Hunger ist die Ursache für die Friedensbitte → kausal + vorzeitig-passivisch.",
				},
				{
					label: "Beiordnung korrekt bilden",
					before: "Cōnsul ā senātū monitus signum dedit →",
					after: "",
					options: ["Der Konsul wurde vom Senat ermahnt und gab dann das Zeichen.", "Der Konsul ermahnte den Senat und gab das Zeichen.", "Während der Konsul das Zeichen gab, wurde er ermahnt."],
					answer: "Der Konsul wurde vom Senat ermahnt und gab dann das Zeichen.",
					explanation: "monitus ist PPP (vorzeitig-passivisch): Beiordnung wandelt das Partizip in einen ersten Hauptsatz mit ‚und dann‘ um.",
				},
				{
					label: "Gleichzeitigkeit im PPA sichern",
					before: "Hostēs clāmantēs impetum fēcērunt →",
					after: "",
					options: ["Unter lautem Geschrei / Während sie schrien, griffen die Feinde an.", "Nachdem sie geschrien worden waren, griffen sie an.", "Nachdem sie geschrien hatten, griffen sie an."],
					answer: "Unter lautem Geschrei / Während sie schrien, griffen die Feinde an.",
					explanation: "clāmantēs ist PPA → gleichzeitig und aktiv (modal/temporal).",
				},
			],
		},
	},
	{
		id: "l7-ablativus-absolutus",
		stage: "partizip",
		title: "Der Ablativus absolutus (Abl. abs.)",
		skill: "Den losgelösten Ablativ mit PPP, PPA oder nominalem Prädikat sicher vom PC trennen und stilgerecht übersetzen",
		lehrplan: "L7 LB 2.3 & 4 · Satzlehre & Methodik (Abl. abs.)",
		bindings: ["2.3-konstruktionen", "2.3-binnenaufbau", "2.3-sprachvergleich", "2.3-stil", "4-analyse"],
		paragraphs: [
			"Der Ablativus absolutus (wörtlich: ‚losgelöster Ablativ‘) ist eine der typischsten Konstruktionen des Lateinischen. Er besteht aus mindestens zwei Wörtern im Ablativ: einem Substantiv (oder Pronomen) als Subjekt der Konstruktion und einem KNG-kongruenten Partizip (PPP oder PPA) als Prädikat — z. B. ‚urbe captā‘ (nachdem die Stadt eingenommen worden war) oder ‚cōnsule dīcente‘ (während der Konsul spricht/sprach). ‚Losgelöst‘ heißt er, weil sein Subjekt im Hauptsatz grammatikalisch nicht als Satzglied vorkommt; deshalb darfst du ihn nicht mit einem normalen Ablativ des Mittels oder Ortes verwechseln.",
			"Weil Latein kein PPA von esse besitzt, gibt es auch den nominalen Ablativus absolutus aus zwei Nomina (oder Nomen + Adjektiv) im Ablativ — z. B. ‚Cicerōne cōnsule‘ (als Cicero Konsul war / unter dem Konsulat Ciceros) oder ‚Hannibale vīvō‘ (zu Lebzeiten Hannibals / solange Hannibal lebte). Beim Übersetzen greifst du zu drei eleganten Lösungen: 1. Adverbialsatz (temporal, kausal, konzessiv, konditional — im Zweifel zuerst temporal testen!), 2. Präpositionalausdruck durch Substantivierung (‚nach der Einnahme der Stadt‘, ‚während der Rede des Konsuls‘) oder 3. Beiordnung zweier Hauptsätze. Merke den Hauptunterschied zum PC: Beim PC ist das Bezugswort Teil des Hauptsatzes; beim Abl. abs. bildet der Ablativblock eine eigene, abgeschlossene Szene!",
		],
		diagram: {
			title: "Die drei Formen des Ablativus absolutus",
			subtitle: "Erkenne PPP, PPA und nominalen Abl. abs. an ihren Ablativ-Klammern.",
			layout: "triptych",
			parts: [
				{
					tag: "Mit PPP",
					title: "Vorzeitig & Passiv",
					formula: "urbe captā · hostibus victīs",
					note: "Nach der Einnahme der Stadt / Nachdem die Feinde besiegt worden waren (vor dem Hauptsatz geschehen).",
				},
				{
					tag: "Mit PPA",
					title: "Gleichzeitig & Aktiv",
					formula: "cōnsule dīcente · sōle oriente",
					note: "Während der Konsul sprach / Bei Sonnenaufgang. Im Abl. abs. endet das PPA im Singular immer auf -e!",
				},
				{
					tag: "Nominal",
					title: "Ohne Partizip (‚sein‘ ergänzen)",
					formula: "Cicerōne cōnsule · Caesare duce",
					note: "Zwei Nomina/Adjektive im Ablativ: als Cicero Konsul war / unter Caesars Führung (immer gleichzeitig).",
				},
			],
		},
		material:
			"Hostibus victīs mīlitēs Rōmānī castra posuērunt. Cōnsule dīcente omnēs cīvēs in forō tacuērunt. Cicerōne cōnsule coniūrātiō dētēcta est, et pāce factā Italia quiēvit.",
		materialLabel: "Übungstext · Drei Varianten des Ablativus absolutus",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Wodurch unterscheidet sich der Ablativus absolutus grammatikalisch vom Participium coniunctum (PC)?",
			answer: "Sein Bezugswort steht im Ablativ und ist kein Satzglied des Hauptsatzes (losgelöst).",
			wrong: [
				"Der Ablativus absolutus kann nur mit dem PPA gebildet werden.",
				"Beim Ablativus absolutus entfällt die KNG-Kongruenz.",
			],
			explanation: "Auch im Abl. abs. gilt strenge KNG-Kongruenz (im Ablativ!), aber sein Bezugswort gehört nicht zur Satzstruktur des Hauptsatzes.",
		},
		takeaway:
			"Im Ablativus absolutus stehen Bezugswort und Partizip (oder zweites Nomen) losgelöst im Ablativ: PPP = vorzeitig/passiv, PPA = gleichzeitig/aktiv, nominal = gleichzeitig mit ‚sein‘. Übersetze als Adverbialsatz, Präpositionalausdruck oder Beiordnung.",
		practice: [
			{
				prompt: "Übersetze den nominalen Abl. abs. ‚Caesare duce‘ als Präpositionalausdruck: unter der ___ Caesars (ein Wort).",
				answers: ["Führung", "Leitung"],
				feedback: "Caesare duce heißt wörtlich ‚als Caesar Anführer war‘, elegant: ‚unter der Führung Caesars‘.",
			},
			{
				prompt: "Mit welchem Zeitverhältnis übersetzt man ‚pāce factā‘ (mit PPP)? (ein Wort): ___",
				answers: ["vorzeitig", "Vorzeitigkeit"],
				feedback: "factā ist PPP von facere → vorzeitig und passiv (nachdem Frieden geschlossen worden war / nach dem Friedensschluss).",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und gib für jeden der vier Ablativi absoluti an, ob er mit PPP, PPA oder nominal gebildet ist.",
				model: "Nachdem die Feinde besiegt worden waren, schlugen die römischen Soldaten das Lager auf (hostibus victīs: PPP). Während der Konsul sprach, schwiegen alle Bürger auf dem Forum (cōnsule dīcente: PPA). Als Cicero Konsul war, wurde die Verschwörung aufgedeckt (Cicerōne cōnsule: nominal), und nach dem Friedensschluss kam Italien zur Ruhe (pāce factā: PPP).",
				criteria: [
					"Ich übersetze alle vier Ablativi absoluti zeitlich und inhaltlich exakt.",
					"Ich ordne PPP, PPA und nominalen Abl. abs. richtig zu.",
					"Ich nutze flüssiges Deutsch ohne holprige wörtliche Ablative.",
				],
			},
			2: {
				language: "de",
				prompt: "Übersetze ‚Urbe dēlētā cīvēs fūgērunt‘ auf drei verschiedene Arten (Adverbialsatz, Präpositionalausdruck, Beiordnung) und erkläre, warum ‚Mit zerstörter Stadt flohen die Bürger‘ keine gute Übersetzung ist.",
				model: "Adverbialsatz: Nachdem die Stadt zerstört worden war, flohen die Bürger. Präpositionalausdruck: Nach der Zerstörung der Stadt flohen die Bürger. Beiordnung: Die Stadt wurde zerstört, und daraufhin flohen die Bürger. ‚Mit zerstörter Stadt‘ ist unidiomatisches Deutsch und missversteht den Abl. abs. als Begleitung.",
				criteria: [
					"Ich liefere alle drei stilgerechten Übersetzungsmöglichkeiten.",
					"Ich bewahre das vorzeitige Passiv von dēlētā.",
					"Ich begründe sprachlich, warum eine bloß wörtliche Wiedergabe scheitert.",
				],
			},
		},
		workshop: {
			kind: "participle",
			goals: [
				{
					label: "Abl. abs. mit PPP übersetzen",
					before: "Signō datō mīlitēs prōcessērunt →",
					after: "",
					options: ["Nachdem das Zeichen gegeben worden war", "Während das Zeichen gegeben wird", "Als das Zeichen gab"],
					answer: "Nachdem das Zeichen gegeben worden war",
					explanation: "datō ist PPP (vorzeitig/passiv) zu prōcessērunt (Vergangenheit).",
				},
				{
					label: "Abl. abs. mit PPA bilden",
					before: "während der Lehrer spricht → magistrō",
					after: "",
					options: ["dīcente", "dīcentī", "dictō"],
					answer: "dīcente",
					explanation: "Im Abl. abs. steht das PPA im Ablativ Singular auf -e: magistrō dīcente.",
				},
				{
					label: "Nominalen Abl. abs. deuten",
					before: "Hannibale vīvō →",
					after: "",
					options: ["zu Lebzeiten Hannibals", "nach dem Tod Hannibals", "durch den Sieg Hannibals"],
					answer: "zu Lebzeiten Hannibals",
					explanation: "vīvus (lebendig) bildet mit Hannibale einen nominalen Abl. abs.: solange Hannibal lebte / zu Lebzeiten Hannibals.",
				},
			],
		},
	},
];
