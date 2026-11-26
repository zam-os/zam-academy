import type { Lesson } from "../types";

export const LESSONS_NOMINA: Lesson[] = [
	{
		id: "l7-u-deklination",
		stage: "nomina",
		title: "Die u-Deklination (4. Deklination)",
		skill: "Substantive auf -us und -ū in allen Kasus sicher bestimmen und von der o-Deklination trennen",
		lehrplan: "L7 LB 2.2 · Formenlehre (Nomina)",
		bindings: ["2.2-nomina", "2.2-kategorien", "2.2-bilden"],
		paragraphs: [
			"Aus der 6. Klasse kennst du die a-, o- und 3. Deklination. In der 7. Klasse lernst du die 4. Deklination kennen, auch u-Deklination genannt, weil der Kennlaut u in fast jeder Endung steckt. Die meisten Wörter auf -us sind Maskulina wie exercitus, exercitūs (das Heer) oder senātus, senātūs (der Senat); zwei sehr wichtige Feminina sind manus, manūs (die Hand, die Schar) und domus, domūs (das Haus).",
			"Achtung Verwechslungsgefahr: Ein Wort auf -us kann zur o-Deklination (amīcus, Gen. amīcī) oder zur u-Deklination (exercitus, Gen. exercitūs) gehören. Immer der Genitiv Singular auf -ūs verrät die u-Deklination! Im Plural enden Nominativ und Akkusativ ebenfalls auf langes -ūs (exercitūs), Genitiv Plural auf -uum (exercituum) und Dativ/Ablativ Plural auf -ibus (exercitibus). Neutra wie cornū, cornūs (das Horn, der Heeresflügel) enden im Singular fast überall auf -ū und im Nominativ/Akkusativ Plural auf -ua (cornua).",
		],
		diagram: {
			title: "Kasus-Signale der u-Deklination",
			subtitle: "Klicke die drei Gruppen an und vergleiche den Kennlaut u mit der o-Deklination.",
			layout: "triptych",
			parts: [
				{
					tag: "Erkennen",
					title: "Genitiv Singular -ūs",
					formula: "exercitus, -ūs m.",
					note: "Die Lernform im Vokabelverzeichnis entscheidet: -ī zeigt die o-Deklination (servus, -ī), -ūs zeigt die u-Deklination (exercitus, -ūs).",
				},
				{
					tag: "Mask. / Fem.",
					title: "u in fast jedem Kasus",
					formula: "-us, -ūs, -uī, -um, -ū",
					note: "Im Plural stehen -ūs (Nom./Akk.), -uum (Gen.) und -ibus (Dat./Abl.). Wichtig: manus (Hand, Schar) ist Femininum: magna manus.",
				},
				{
					tag: "Neutrum",
					title: "cornū im Sg. und Pl.",
					formula: "Sg. cornū · Pl. cornua",
					note: "Neutra der u-Deklination wie cornū (Flügel des Heeres) oder genū (Knie) haben im Nom./Akk. Pl. die Endung -ua.",
				},
			],
		},
		material:
			"Cōnsul exercitum Rōmānum contrā hostēs dūcit. Impetus hostium ācer est, sed mīlitēs in dextrō cornū manū fortī resistunt. Cīvēs dē salūte exercitūs et dē cōnsiliō senātūs cōgitant.",
		materialLabel: "Übungstext · Römische Republik und Militär",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Woran erkennst du im Vokabelverzeichnis eindeutig, dass ein Substantiv zur u-Deklination gehört?",
			answer: "Am Genitiv Singular auf -ūs (z. B. exercitus, exercitūs).",
			wrong: [
				"An der Nominativendung -us (wie bei amīcus).",
				"An der Akkusativendung -um im Singular.",
			],
			explanation: "Sowohl die o- als auch die u-Deklination haben -us im Nominativ und -um im Akkusativ Singular; erst der Genitiv Singular (-ī vs. -ūs) trennt sie eindeutig.",
		},
		takeaway:
			"Die u-Deklination erkennst du am Genitiv Singular -ūs (exercitus, -ūs). Merke dir manus (f.) und cornū (n., Pl. cornua) sowie die Dativ-/Ablativ-Pluralendung -ibus.",
		practice: [
			{
				prompt: "Bilde den Genitiv Plural von exercitus, -ūs m.: ___",
				answers: ["exercituum"],
				feedback: "Der Stamm exercit- erhält im Genitiv Plural der u-Deklination die Endung -uum.",
			},
			{
				prompt: "Bilde den Nominativ Plural von cornū, -ūs n.: ___",
				answers: ["cornua"],
				feedback: "Neutra der u-Deklination enden im Nominativ und Akkusativ Plural auf -ua.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den ersten und zweiten Satz des Übungstextes ins Deutsche und benenne Kasus und Numerus von exercitum und manū.",
				model: "Der Konsul führt das römische Heer gegen die Feinde. Der Angriff der Feinde ist heftig, aber die Soldaten leisten auf dem rechten Flügel mit tapferer Hand Widerstand. exercitum: Akk. Sg.; manū: Abl. Sg.",
				criteria: [
					"Ich übersetze beide Sätze sachlich richtig und flüssig.",
					"Ich bestimme exercitum als Akkusativ Singular.",
					"Ich bestimme manū als Ablativ Singular (Femininum).",
				],
			},
			2: {
				language: "de",
				prompt: "Übersetze den gesamten Übungstext und erkläre an exercitūs im letzten Satz, warum diese Form im Kontext nur Genitiv Singular sein kann und nicht Nominativ oder Akkusativ Plural.",
				model: "Der Konsul führt das römische Heer gegen die Feinde. Der Angriff der Feinde ist heftig, aber die Soldaten leisten auf dem rechten Flügel mit tapferer Hand Widerstand. Die Bürger denken an die Rettung des Heeres und an den Beschluss des Senats. exercitūs hängt von salūte ab (dē salūte exercitūs = Rettung wessen?) und steht parallel zu senātūs; als Subjekt steht bereits cīvēs.",
				criteria: [
					"Ich übersetze alle drei Sätze vollständig und treffend.",
					"Ich begründe den Genitiv Singular von exercitūs aus dem Satzbau.",
					"Ich berücksichtige das feminine Genus von manus und das Neutrum cornū.",
				],
			},
		},
		workshop: {
			kind: "forms",
			goals: [
				{
					label: "Genitiv Singular erkennen",
					before: "cōnsilium + senātus (Gen. Sg.) →",
					after: "",
					options: ["senātūs", "senātī", "senātuī"],
					answer: "senātūs",
					explanation: "senātus gehört zur u-Deklination; sein Genitiv Singular endet auf -ūs.",
				},
				{
					label: "KNG-Kongruenz bei manus (f.)",
					before: "mit tapferer Schar (Abl. Sg.) →",
					after: "manū",
					options: ["fortī", "fortem", "fortēs"],
					answer: "fortī",
					explanation: "manū ist Ablativ Singular Femininum; fortī stimmt in Kasus, Numerus und Genus überein.",
				},
				{
					label: "Dativ/Ablativ Plural bilden",
					before: "cum + exercitus (Abl. Pl.) →",
					after: "",
					options: ["exercitibus", "exercitīs", "exercituum"],
					answer: "exercitibus",
					explanation: "Dativ und Ablativ Plural der u-Deklination enden auf -ibus.",
				},
			],
		},
	},
	{
		id: "l7-e-deklination",
		stage: "nomina",
		title: "Die e-Deklination (5. Deklination) & 3. Deklination",
		skill: "Substantive auf -ēs (rēs, diēs, fidēs, spēs) und wichtige Sonderfälle der 3. Deklination bestimmen",
		lehrplan: "L7 LB 2.2 · Formenlehre (Nomina)",
		bindings: ["2.2-nomina", "2.2-kategorien", "2.2-bilden"],
		paragraphs: [
			"Die 5. Deklination heißt e-Deklination, weil der Kennlaut e in allen Kasus auftaucht. Fast alle Substantive sind Feminina — zum Beispiel rēs, reī (Sache, Ding, Angelegenheit), fidēs, fideī (Treue, Vertrauen) und spēs, speī (Hoffnung). Nur diēs, diēī (Tag) ist im Normalfall Maskulinum (im Sinne von ‚festgesetzter Termin‘ auch Femininum). Vollständig im Plural gebräuchlich sind vor allem rēs und diēs: rēs, rērum, rēbus, rēs, rēbus.",
			"Gleichzeitig erweitert die 7. Klasse deinen Bestand in der 3. Deklination um häufige, aber eigenwillige Wörter: Besonders wichtig ist vīs (f., Kraft, Gewalt), das im Singular nur Nom. vīs, Akk. vim und Abl. vī bildet, im Plural aber den Stamm vīr- nutzt (vīrēs, vīrium, vīribus = die Kräfte, Streitkräfte — nicht verwechseln mit vir, virī = der Mann!). Auch die Wendung rēs pūblica (Staat; beide Teile werden dekliniert: reī pūblicae, rem pūblicam) begegnet dir in Texten zur Republik ständig.",
		],
		diagram: {
			title: "e-Deklination & Sonderfall vīs im Vergleich",
			subtitle: "Vergleiche die regelmäßigen e-Endungen mit der Deklination von rēs pūblica und vīs.",
			layout: "contrast",
			parts: [
				{
					tag: "e-Deklination",
					title: "rēs, reī f. · diēs, diēī m.",
					formula: "-ēs, -eī, -eī, -em, -ē",
					note: "Im Plural stehen -ēs, -ērum, -ēbus, -ēs, -ēbus. Nach Vokal (diēī) ist das e lang, nach Konsonant (reī, fideī) kurz.",
				},
				{
					tag: "rēs pūblica",
					title: "Zwei Wörter, eine Einheit",
					formula: "reī pūblicae · rē pūblicā",
					note: "rēs (5. Dekl.) und das Adjektiv pūblica (a-Dekl.) werden beide nach ihrer eigenen Deklination gebeugt.",
				},
				{
					tag: "3. Dekl. Spezial",
					title: "vīs (Gewalt) vs. vīrēs (Kräfte)",
					formula: "Sg. vīs/vim/vī · Pl. vīrēs",
					note: "vīs (f.) wechselt im Plural den Stamm zu vīrēs, vīrium. Achte auf den Unterschied zu vir, virī m. (der Mann).",
				},
			],
		},
		material:
			"Cīvēs Rōmānī spem nōn dēpōnunt, nam fidēs et concordia rem pūblicam servant. Multīs diēbus vīrēs hostium crēscunt, sed senātus rēbus difficilibus cōnsilium capit et vim inimīcōrum frangit.",
		materialLabel: "Übungstext · Bewährung der Republik",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Welche Bedeutung und Form hat vīrēs im Satz ‚Vīrēs hostium crēscunt‘?",
			answer: "Nominativ Plural von vīs (f.): die Kräfte / Streitkräfte.",
			wrong: [
				"Nominativ Plural von vir (m.): die Männer.",
				"Genitiv Singular von vīs (f.): der Gewalt.",
			],
			explanation: "vīs bildet den Plural vīrēs, vīrium (Kräfte, Streitkräfte). Der Nominativ Plural von vir (Mann) lautet dagegen virī.",
		},
		takeaway:
			"In der e-Deklination sind fast alle Wörter feminin (rēs, fidēs, spēs), nur diēs ist meist maskulin. Bei vīs unterscheidet sich der Singular (vim, vī) klar vom Plural vīrēs (Kräfte).",
		practice: [
			{
				prompt: "Bilde den Ablativ Singular von rēs pūblica: ___",
				answers: ["re publica", "rē pūblicā"],
				feedback: "rēs bildet den Ablativ Singular rē, pūblica bildet pūblicā: rē pūblicā.",
			},
			{
				prompt: "Wie lautet der Akkusativ Singular von vīs (Gewalt)? ___",
				answers: ["vim"],
				feedback: "vīs hat im Singular die i-Formen vim (Akk.) und vī (Abl.).",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und bestimme Kasus und Numerus von spem, diēbus und rēbus.",
				model: "Die römischen Bürger geben die Hoffnung nicht auf, denn Treue und Eintracht retten den Staat. Viele Tage lang wachsen die Kräfte der Feinde, aber der Senat fasst in schwierigen Lagen einen Beschluss und bricht die Gewalt der Gegner. spem: Akk. Sg.; diēbus: Abl. Pl.; rēbus: Abl. Pl.",
				criteria: [
					"Ich gebe spem, fidēs, rem pūblicam und rēbus treffend auf Deutsch wieder.",
					"Ich unterscheide vīrēs (Kräfte) und vim (Gewalt) sauber.",
					"Ich bestimme Kasus und Numerus der drei genannten Formen korrekt.",
				],
			},
			2: {
				language: "de",
				prompt: "Erkläre, warum man ‚rēbus difficilibus‘ hier besser nicht wörtlich mit ‚in schwierigen Dingen‘ übersetzt, und nenne drei verschiedene Kontextbedeutungen von rēs mit je einem Beispiel.",
				model: "rēs ist ein Allerweltswort und richtet sich nach dem Zusammenhang: Hier bedeutet rēbus difficilibus ‚in schwierigen Lagen / Umständen‘. Weitere Bedeutungen: rēs pūblica (Staat), rēs gestae (Taten), rēs mīlitāris (Kriegswesen).",
				criteria: [
					"Ich begründe die kontextgerechte Übersetzung von rēbus difficilibus.",
					"Ich nenne mindestens drei verschiedene Kontextbedeutungen von rēs.",
					"Ich belege jede Bedeutung mit einer passenden lateinischen Wendung.",
				],
			},
		},
		workshop: {
			kind: "forms",
			goals: [
				{
					label: "Genitiv Plural der e-Deklination",
					before: "multārum + rēs (Gen. Pl.) →",
					after: "",
					options: ["rērum", "rēbus", "reī"],
					answer: "rērum",
					explanation: "Der Genitiv Plural der e-Deklination endet auf -ērum (rērum, diērum).",
				},
				{
					label: "Genus von diēs beachten",
					before: "an jenem Tag (Abl. Sg.) →",
					after: "diē",
					options: ["illō", "illā", "illud"],
					answer: "illō",
					explanation: "diēs ist in der Grundbedeutung ‚Tag‘ maskulin, also illō diē.",
				},
				{
					label: "vīs im Singular einsetzen",
					before: "mit großer Gewalt (Abl. Sg.) → magnā",
					after: "",
					options: ["vī", "vīre", "virō"],
					answer: "vī",
					explanation: "Der Ablativ Singular von vīs lautet vī (virō wäre der Ablativ von vir, der Mann).",
				},
			],
		},
	},
	{
		id: "l7-adjektive-sonder",
		stage: "nomina",
		title: "Besondere Adjektive: dīves, pauper, vetus",
		skill: "Konsonantische Adjektive der 3. Deklination (dīves, pauper, vetus) sicher erkennen und kongruent verbinden",
		lehrplan: "L7 LB 2.2 · Formenlehre (Nomina)",
		bindings: ["2.2-nomina", "2.2-kategorien", "2.2-bilden"],
		paragraphs: [
			"Die meisten Adjektive der 3. Deklination aus Klasse 6 (wie ācer, fortis oder fēlīx) folgen der i-Deklination: Ablativ Singular auf -ī, Nominativ/Akkusativ Plural Neutrum auf -ia und Genitiv Plural auf -ium. Eine kleine, aber sehr häufige Gruppe weicht davon ab und folgt rein konsonantischen Endungen: dīves, dīvitis (reich), pauper, pauperis (arm) und vetus, veteris (alt).",
			"Bei dīves, pauper und vetus endet der Ablativ Singular auf -e (dīvite, paupere, vetere), der Genitiv Plural auf -um (dīvitum, pauperum, veterum) und bei vetus der Nominativ/Akkusativ Plural Neutrum auf -a (vetera, z. B. vetera templa = alte Tempel). Alle drei sind einendig: Im Nominativ Singular gilt dieselbe Form für Maskulinum, Femininum und Neutrum. Im Text erkennst du ihre Zugehörigkeit immer an der KNG-Kongruenz zu ihrem Bezugswort — oder sie stehen substantiviert (dīvitēs = die Reichen, pauperēs = die Armen).",
		],
		diagram: {
			title: "i-Adjektive vs. konsonantische Adjektive",
			subtitle: "Vergleiche die drei typischen Abweichungen bei dīves, pauper und vetus.",
			layout: "contrast",
			parts: [
				{
					tag: "Abl. Sg.",
					title: "-e statt -ī",
					formula: "ā cīve paupere / vetere",
					note: "Während fortis im Abl. Sg. fortī bildet, haben dīves, pauper und vetus die konsonantische Endung -e.",
				},
				{
					tag: "Gen. Pl.",
					title: "-um statt -ium",
					formula: "dīvitum · pauperum · veterum",
					note: "Im Genitiv Plural fehlt das i: domūs dīvitum (die Häuser der Reichen), mōrēs veterum (die Sitten der Alten).",
				},
				{
					tag: "Nom./Akk. Pl. n.",
					title: "vetera statt *-ia",
					formula: "vetera templa / opera",
					note: "Bei vetus endet das Neutrum Plural auf bloßes -a (vetera), nicht auf -ia wie bei fortia.",
				},
			],
		},
		material:
			"In urbe Rōmā dīvitēs in magnīs domibus habitant, sed vīta pauperum saepe dūra est. Senātōrēs vetera lēgum exempla laudant et ā cīve vetere cōnsilium petunt. Etiam vir pauper fidem servāre potest.",
		materialLabel: "Übungstext · Gesellschaft und Tradition in Rom",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "la",
			question: "Welche Form passt korrekt zu ‚templa‘ (Nom./Akk. Pl. n.)?",
			answer: "vetera templa",
			wrong: ["veteria templa", "vetus templa"],
			explanation: "vetus folgt der konsonantischen Deklination und bildet im Nom./Akk. Plural Neutrum vetera.",
		},
		takeaway:
			"dīves (dīvitis), pauper (pauperis) und vetus (veteris) sind einendige Adjektive mit rein konsonantischen Endungen: Abl. Sg. -e, Gen. Pl. -um und bei vetus Nom./Akk. Pl. n. vetera.",
		practice: [
			{
				prompt: "Bilde den Genitiv Plural von pauper, pauperis (der Armen): ___",
				answers: ["pauperum"],
				feedback: "pauper bildet den Genitiv Plural konsonantisch auf -um: pauperum.",
			},
			{
				prompt: "Bilde den Ablativ Singular von vetus, veteris (ā cīve ___): ___",
				answers: ["vetere"],
				feedback: "Der Ablativ Singular von vetus lautet konsonantisch vetere.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und markiere, wo dīvitēs und pauperum substantiviert gebraucht werden.",
				model: "In der Stadt Rom wohnen die Reichen in großen Häusern, aber das Leben der Armen ist oft hart. Die Senatoren loben die alten Beispiele der Gesetze und bitten einen alten Bürger um Rat. Auch ein armer Mann kann Treue bewahren. Substantiviert sind dīvitēs (die Reichen) und pauperum (der Armen).",
				criteria: [
					"Ich übersetze alle drei Sätze korrekt ins Deutsche.",
					"Ich erkenne dīvitēs und pauperum als substantivierte Adjektive.",
					"Ich beziehe vetera auf exempla und vetere auf cīve.",
				],
			},
			2: {
				language: "de",
				prompt: "Vergleiche die Formen ‚ā mīlite fortī‘ und ‚ā cīve paupere‘ sowie ‚fortium mīlitum‘ und ‚dīvitum cīvium‘. Erkläre die grammatikalische Ursache für den Unterschied.",
				model: "fortis gehört zu den regelmäßigen i-Adjektiven der 3. Deklination (Abl. Sg. -ī, Gen. Pl. -ium). pauper und dīves gehören dagegen zu den konsonantischen Adjektiven der 3. Deklination und erhalten deshalb -e im Ablativ Singular (paupere) und -um im Genitiv Plural (dīvitum).",
				criteria: [
					"Ich benenne den Unterschied zwischen i-Deklination und konsonantischer Deklination.",
					"Ich ordne fortis und pauper/dīves der richtigen Gruppe zu.",
					"Ich belege meine Erklärung an beiden Beispielpaaren.",
				],
			},
		},
		workshop: {
			kind: "forms",
			goals: [
				{
					label: "Genitiv Plural konsonantisch bilden",
					before: "pecūnia + dīves (Gen. Pl.) →",
					after: "",
					options: ["dīvitum", "dīvitium", "dīvitibus"],
					answer: "dīvitum",
					explanation: "dīves hat im Genitiv Plural die konsonantische Endung -um.",
				},
				{
					label: "Neutrum Plural zu moenia/templa",
					before: "alte Gesetzesbeispiele →",
					after: "exempla",
					options: ["vetera", "veteria", "veterēs"],
					answer: "vetera",
					explanation: "exempla ist Nom./Akk. Pl. n.; vetus bildet dazu vetera.",
				},
				{
					label: "Ablativ Singular mit Präposition",
					before: "cum cīve + pauper (Abl. Sg.) →",
					after: "",
					options: ["paupere", "pauperī", "pauperem"],
					answer: "paupere",
					explanation: "pauper bildet den Ablativ Singular auf -e: cum cīve paupere.",
				},
			],
		},
	},
	{
		id: "l7-demonstrativa",
		stage: "nomina",
		title: "Demonstrativpronomina: hic, ille, iste · īdem, ipse",
		skill: "Nähe, Ferne, Abwertung, Identität und Hervorhebung bei Demonstrativpronomina unterscheiden",
		lehrplan: "L7 LB 2.2 · Formenlehre (Pronomina)",
		bindings: ["2.2-pronomina", "2.2-kategorien", "2.2-bilden"],
		paragraphs: [
			"Mit Demonstrativpronomina zeigen Sprecher im Raum oder im Text auf Personen und Dinge. hic, haec, hoc (dieser hier) weist auf das Naheliegende oder gerade Erwähnte; ille, illa, illud (jener dort) zeigt in die Ferne oder hebt Berühmtes hervor (Alexander ille = jener berühmte Alexander); iste, ista, istud (dieser da bei dir) richtet sich an das Gegenüber und klingt vor Gericht oft abwertend (iste hostis = dieser Gegner da).",
			"Hinzu kommen zwei unverzichtbare Begleiter: īdem, eadem, idem (derselbe, der gleiche) entsteht aus is, ea, id + -dem (achte auf eundem, eandem, eōrundem mit n statt m vor d!) und ipse, ipsa, ipsum (selbst, persönlich, gerade) betont ein Wort im Satz (ipse cōnsul = der Konsul selbst). Alle fünf Pronomina teilen die typischen Pronominalendungen im Genitiv Singular (-īus / huius) und Dativ Singular (-ī / huic).",
		],
		diagram: {
			title: "Zeigefelder der lateinischen Pronomina",
			subtitle: "Entdecke die drei Perspektiven von hic, ille/iste sowie īdem und ipse.",
			layout: "triptych",
			parts: [
				{
					tag: "Nähe · hic",
					title: "hic, haec, hoc",
					formula: "Gen. huius · Dat. huic",
					note: "Zeigt auf Nahes beim Sprecher (dieser hier) oder im Text auf das zuletzt Genannte (der letztere).",
				},
				{
					tag: "Ferne · ille / iste",
					title: "ille, illa, illud · iste",
					formula: "Gen. illīus · Dat. illī",
					note: "ille zeigt auf Entferntes oder Berühmtes (jener); iste zeigt auf die Seite des Gegenübers, oft kritisch (dieser da).",
				},
				{
					tag: "Fokus · īdem / ipse",
					title: "Identität vs. Hervorhebung",
					formula: "īdem (derselbe) · ipse (selbst)",
					note: "īdem setzt zwei Dinge gleich (eōdem diē = am selben Tag); ipse hebt eine Person oder Sache hervor (rēx ipse = der König persönlich).",
				},
			],
		},
		material:
			"Hic cīvis pācem cupit, ille bellum parat. Cūr istīs verbīs crēditis? Eōdem diē cōnsul ipse in forum vēnit et huius perīculī causam explicāvit.",
		materialLabel: "Übungstext · Rede auf dem Forum Romanum",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Was bedeutet die Wendung ‚eōdem diē cōnsul ipse vēnit‘?",
			answer: "Am selben Tag kam der Konsul selbst.",
			wrong: [
				"An diesem Tag kam jener Konsul.",
				"Am nächsten Tag kam derselbe Konsul.",
			],
			explanation: "eōdem (Abl. Sg. m. zu īdem) heißt ‚am selben‘, ipse (Nom. Sg. m.) bedeutet ‚selbst / persönlich‘.",
		},
		takeaway:
			"Merke die Trias hic (hier), iste (dort bei dir / oft abwertend), ille (dort fern / berühmt) sowie den Unterschied zwischen īdem (derselbe) und ipse (selbst). Genitiv Sg. endet auf -īus/huius, Dativ Sg. auf -ī/huic.",
		practice: [
			{
				prompt: "Wie lautet der Genitiv Singular von hic, haec, hoc? ___",
				answers: ["huius"],
				feedback: "hic, haec, hoc bildet in allen drei Genera den Genitiv Singular huius.",
			},
			{
				prompt: "Ergänze ‚denselben Freund‘ (Akk. Sg. m. von īdem): ___ amīcum",
				answers: ["eundem"],
				feedback: "Vor -dem wird eum zu eundem (m wird vor d zu n).",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und gib für hic, ille, istīs, eōdem und ipse jeweils das Grundwort an.",
				model: "Dieser Bürger wünscht den Frieden, jener bereitet den Krieg vor. Warum glaubt ihr diesen Worten da? Am selben Tag kam der Konsul selbst auf das Forum und erklärte die Ursache dieser Gefahr. Grundwörter: hic, ille, iste, īdem, ipse.",
				criteria: [
					"Ich übersetze die Gegensätze hic/ille und den Ton von istīs passend.",
					"Ich gebe eōdem diē und cōnsul ipse präzise wieder.",
					"Ich nenne alle fünf Grundwörter fehlerfrei.",
				],
			},
			2: {
				language: "de",
				prompt: "Erkläre den Bedeutungsunterschied zwischen ‚Cōnsul eundem mīlitem laudat‘ und ‚Cōnsul ipse mīlitem laudat‘ sowie zwischen ‚ille cīvis‘ und ‚iste cīvis‘ in einer Gerichtsrede Ciceros.",
				model: "‚eundem mīlitem‘ heißt ‚denselben Soldaten‘ (Identität), ‚cōnsul ipse‘ heißt ‚der Konsul persönlich‘ (Hervorhebung). In einer Gerichtsrede bezeichnet ‚ille cīvis‘ einen geachteten oder bekannten Bürger (jener berühmte Bürger), ‚iste cīvis‘ dagegen abwertend den Gegner (dieser Bürger da).",
				criteria: [
					"Ich trenne īdem (Identität) und ipse (Hervorhebung) klar.",
					"Ich übersetze beide Beispielsätze genau.",
					"Ich erkläre die unterschiedliche Wertung von ille und iste.",
				],
			},
		},
		workshop: {
			kind: "forms",
			goals: [
				{
					label: "Dativ Singular von hic wählen",
					before: "diesem Bürger (Dat. Sg.) →",
					after: "cīvī",
					options: ["huic", "huius", "hōc"],
					answer: "huic",
					explanation: "Der Dativ Singular von hic, haec, hoc lautet in allen Genera huic.",
				},
				{
					label: "Identität ausdrücken",
					before: "dieselbe Sache (Nom. Sg. f.) →",
					after: "rēs",
					options: ["eadem", "ipsa", "haec"],
					answer: "eadem",
					explanation: "eadem (Nom. Sg. f. zu īdem) drückt aus, dass es sich um dieselbe Sache handelt.",
				},
				{
					label: "Person hervorheben",
					before: "der Feldherr persönlich → imperātor",
					after: "",
					options: ["ipse", "īdem", "istud"],
					answer: "ipse",
					explanation: "ipse, ipsa, ipsum betont eine Person oder Sache (selbst, persönlich).",
				},
			],
		},
	},
	{
		id: "l7-interrogativa-zahlen",
		stage: "nomina",
		title: "Fragepronomina & römische Zahlen bis 1000",
		skill: "Substantivische und adjektivische Fragepronomina unterscheiden sowie Kardinalia bis 1000 und Ordinalia anwenden",
		lehrplan: "L7 LB 2.2 · Formenlehre (Pronomina & Numeralia)",
		bindings: ["2.2-pronomina", "2.2-numeralia", "2.2-bilden"],
		paragraphs: [
			"Im Lateinischen unterscheidet das Fragepronomen im Nominativ Singular (und im Akkusativ Neutrum), ob es allein steht oder ein Substantiv begleitet. Alleinstehend (substantivisch) fragt man mit quis? (wer?) nach Personen und mit quid? (was?) nach Sachen: Quis venit? Quid facis? Begleitet das Fragepronomen ein Substantiv (adjektivisch), nutzt man die Formen des Relativpronomens quī, quae, quod? (welcher, welche, welches?): Quī mīles venit? Quod cōnsilium capis?",
			"In Klasse 6 hast du Zahlen von 1 bis 12 kennengelernt. In Klasse 7 erweiterst du die Kardinalzahlen bis 1000 und lernst alle römischen Zahlzeichen: I (1), V (5), X (10), L (50), C (100), D (500) und M (1000). Steht ein kleineres Zeichen links vor einem größeren (IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900), wird es abgezogen; rechts wird addiert. Bei den lateinischen Zahlwörtern werden ūnus, duo, trēs, die Hunderter (ducentī, -ae, -a bis nōngentī) und mīlia (Pl. Tausende + Genitiv: duo mīlia mīlitum) dekliniert; ausgewählte Ordinalia wie prīmus (1.), secundus (2.), tertius (3.), decimus (10.) und centēsimus (100.) werden wie Adjektive gebeugt.",
		],
		diagram: {
			title: "Fragepronomina & Zahlzeichen auf einen Blick",
			subtitle: "Vergleiche substantivisches und adjektivisches Fragen mit dem Aufbau römischer Zahlen.",
			layout: "triptych",
			parts: [
				{
					tag: "Substantivisch",
					title: "quis? (wer?) · quid? (was?)",
					formula: "Quis venit? Quid vidēs?",
					note: "Steht allein ohne Bezugsnomen. Genitiv cuius?, Dativ cui?, Akkusativ quem? / quid?, Ablativ quō?.",
				},
				{
					tag: "Adjektivisch",
					title: "quī, quae, quod? (welcher?)",
					formula: "Quod bellum? Quī dux?",
					note: "Steht in KNG-Kongruenz bei einem Substantiv und hat dieselben Formen wie das Relativpronomen.",
				},
				{
					tag: "Numeralia",
					title: "I V X L C D M (1–1000)",
					formula: "CD = 400 · CM = 900 · M = 1000",
					note: "Subtraktionsregel spart lange Zeichenketten: 749 = DCCXLIX (500 + 200 + 40 + 9). Ordinalia (prīmus, decimus) zeigen die Reihenfolge.",
				},
			],
		},
		material:
			"Quis contrā Rōmam prōcēdit? Quod iter per Alpēs ēligit? Historicī nārrant Hannibalem cum multīs mīlibus mīlitum vēnisse: nōn modo CC (ducentī), sed plūs quam D (quīngentī) equitēs in prīmō agmine ībant. Annō CCXVIII (ducentēsimō duodēvīcēsimō) ante Chrīstum nātum bellum coepit.",
		materialLabel: "Übungstext · Fragen und Zahlen zum 2. Punischen Krieg",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "la",
			question: "Welche Frage ist im Lateinischen grammatikalisch richtig für ‚Welchen Beschluss fasst der Senat?‘?",
			answer: "Quod cōnsilium senātus capit?",
			wrong: [
				"Quid cōnsilium senātus capit?",
				"Quis cōnsilium senātus capit?",
			],
			explanation: "Weil cōnsilium (n.) dabei steht, braucht man das adjektivische Fragepronomen quod (nicht das substantivische quid).",
		},
		takeaway:
			"Substantivisch fragt man quis?/quid? (wer?/was?), adjektivisch quī/quae/quod? (welcher/welche/welches?). Die sieben römischen Zahlzeichen sind I, V, X, L, C, D, M (bis 1000); mīlia steht im Plural mit Genitiv.",
		practice: [
			{
				prompt: "Schreibe die arabische Zahl 490 in römischen Ziffern: ___",
				answers: ["CDXC"],
				feedback: "400 = CD (500 − 100) und 90 = XC (100 − 10), zusammen CDXC.",
			},
			{
				prompt: "Ergänze das adjektivische Fragepronomen (‚Welcher Tag?‘): ___ diēs est?",
				answers: ["Qui", "Quī"],
				feedback: "diēs ist Maskulinum Singular; adjektivisch lautet das Fragepronomen Quī.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze die ersten drei Sätze des Übungstextes ins Deutsche und löse die römischen Zahlen CC, D und CCXVIII in arabische Zahlen auf.",
				model: "Wer rückt gegen Rom vor? Welchen Weg über die Alpen wählt er? Die Geschichtsschreiber berichten, dass Hannibal mit vielen Tausend Soldaten gekommen ist: Nicht nur 200, sondern mehr als 500 Reiter gingen im ersten Heereszug. CC = 200, D = 500, CCXVIII = 218.",
				criteria: [
					"Ich übersetze die Fragen mit quis/quod und die Zahlenangaben richtig.",
					"Ich löse CC (200), D (500) und CCXVIII (218) fehlerfrei auf.",
					"Ich gebe prīmō agmine sinnvoll als Ordnungszahl (im ersten Zug) wieder.",
				],
			},
			2: {
				language: "de",
				prompt: "Formuliere zwei eigene lateinische Fragen (eine mit substantivischem quis/quid, eine mit adjektivischem quī/quae/quod) und schreibe die Jahre 753, 509 und 444 als römische Zahlen mit Zerlegung.",
				model: "Quid cīvēs timent? (Was fürchten die Bürger?) Quae urbs ā Rōmānīs dēlēta est? (Welche Stadt wurde von den Römern zerstört?) 753 = DCCLIII (500 + 200 + 50 + 3), 509 = DIX (500 + 9), 444 = CDXLIV (400 + 40 + 4).",
				criteria: [
					"Ich bilde je eine korrekte substantivische und adjektivische Frage.",
					"Ich zerlege 753, 509 und 444 korrekt mit Subtraktionsregel.",
					"Ich überprüfe KNG-Kongruenz bei der adjektivischen Frage.",
				],
			},
		},
		workshop: {
			kind: "forms",
			liveModel: "numeral",
			goals: [
				{
					label: "Substantivisch fragen (‚Was?‘)",
					before: "Frage ohne Substantiv: ___",
					after: "senātus dēcernit?",
					options: ["Quid", "Quod", "Quae"],
					answer: "Quid",
					explanation: "Allein stehendes ‚was?‘ heißt im Lateinischen quid.",
				},
				{
					label: "Adjektivisch fragen (‚Welche Stadt?‘)",
					before: "Frage mit urbs (f.): ___",
					after: "urbs dēfenditur?",
					options: ["Quae", "Quis", "Quid"],
					answer: "Quae",
					explanation: "urbs ist Femininum Singular; das adjektivische Fragepronomen lautet Quae.",
				},
				{
					label: "Römische Subtraktionszahl 940 bilden",
					before: "940 (900 + 40) →",
					after: "",
					options: ["CMXL", "DCCCCXXXX", "MCXL"],
					answer: "CMXL",
					explanation: "900 wird als CM (1000 − 100) und 40 als XL (50 − 10) geschrieben.",
				},
			],
		},
	},
];
