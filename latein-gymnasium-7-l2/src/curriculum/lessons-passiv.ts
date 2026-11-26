import type { Lesson } from "../types";

export const LESSONS_PASSIV: Lesson[] = [
	{
		id: "l7-passiv-praesens",
		stage: "passiv",
		title: "Passiv im Präsensstamm (Präsens, Imperfekt, Futur I)",
		skill: "Passivformen im Präsensstamm an den Endungen erkennen, bilden und Urheber von Mittel unterscheiden",
		lehrplan: "L7 LB 2.2 · Formenlehre (Verben im Passiv)",
		bindings: ["2.2-verben", "2.2-bestandteile", "2.2-bilden"],
		paragraphs: [
			"Im Aktiv führt das Subjekt die Handlung aus (Magister discipulum laudat = Der Lehrer lobt den Schüler). Im Passiv erleidet das Subjekt die Handlung — das bisherige Akkusativobjekt wird zum neuen Subjekt (Discipulus ā magistrō laudātur = Der Schüler wird vom Lehrer gelobt). Dieses grammatikalische Merkmal nennt man Genus Verbi (Aktiv oder Passiv).",
			"Für alle drei Tempora des Präsensstamms (Präsens, Imperfekt, Futur I) brauchst du nur eine einzige neue Endungsreihe: -r, -ris, -tur, -mur, -minī, -ntur. Im Präsens treten sie direkt an den Stamm (laudor, laudāris, laudātur; konsonantisch: dūcor, dūceris, dūcitur), im Imperfekt an -ba- (laudābar, laudābātur), im Futur I an -bo-/-bi-/-bu- (a-/e-Konj.: laudābor, laudāberis, laudābitur) oder -a-/-e- (kons./i-Konj.: dūcar, dūcēris, dūcētur). Wichtig für die Übersetzung: Personen als Urheber stehen im Passiv mit ā/ab + Ablativ (ā magistrō), Sachen als Mittel im bloßen Ablativ (verbīs = durch Worte).",
		],
		diagram: {
			title: "Die Passiv-Endungen im Präsensstamm",
			subtitle: "Prüfe Stamm, Tempuszeichen und Passivendung für alle drei Zeiten.",
			layout: "flow",
			parts: [
				{
					tag: "Präsens",
					title: "Stamm + Passivendung",
					formula: "laudā-tur · dūci-tur",
					note: "Die Reihe -r, -ris, -tur, -mur, -minī, -ntur ersetzt -ō/-m, -s, -t, -mus, -tis, -nt. Bei dūceris (2. Sg.) steht ein e vor -ris!",
				},
				{
					tag: "Imperfekt",
					title: "Stamm + -bā- + Passivendung",
					formula: "laudā-bā-tur · dūcē-bā-ntur",
					note: "Das bekannte Imperfektzeichen -ba- bleibt erhalten; nur die Personalendung wechselt ins Passiv (wurde gelobt / wurden geführt).",
				},
				{
					tag: "Futur I",
					title: "b-Futur oder a/e-Futur",
					formula: "laudā-bi-tur · dūc-ē-tur",
					note: "a- und e-Konjugation bilden -bor, -beris, -bitur; konsonantische und i-Konjugation bilden -ar, -ēris, -ētur (wird gelobt/geführt werden).",
				},
			],
		},
		material:
			"Urbs Rōma ā mīlitibus fortibus dēfenditur. Ōlim castra vallō et fossā mūniēbantur. Crās lēgātī ā cōnsule ad senātum mittentur et cīvēs dē perīculō monēbuntur.",
		materialLabel: "Übungstext · Verteidigung Roms im Präsens, Imperfekt und Futur I",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Welche Tempus- und Genus-Verbi-Bestimmung passt zu ‚mittentur‘ (mittere, kons. Konj.)?",
			answer: "3. Person Plural Futur I Passiv (sie werden geschickt werden).",
			wrong: [
				"3. Person Plural Präsens Passiv (sie werden geschickt).",
				"3. Person Plural Imperfekt Passiv (sie wurden geschickt).",
			],
			explanation: "In der konsonantischen Konjugation ist -e- vor -ntur das Futurzeichen (Präsens wäre mittuntur, Imperfekt mittēbantur).",
		},
		takeaway:
			"Im Präsensstamm zeigt die Endungsreihe -r, -ris, -tur, -mur, -minī, -ntur das Passiv an. Personen als Urheber stehen mit ā/ab + Ablativ, Sachen im bloßen Ablativ.",
		practice: [
			{
				prompt: "Setze ‚cōnsul urbem dēfendit‘ ins Passiv (Urbs ā cōnsule ___): ___",
				answers: ["defenditur", "dēfenditur"],
				feedback: "3. Sg. Präsens Passiv von dēfendere lautet dēfenditur.",
			},
			{
				prompt: "Bilde die 3. Pl. Imperfekt Passiv von laudāre: ___",
				answers: ["laudabantur", "laudābantur"],
				feedback: "Stamm laudā- + Imperfektzeichen -ba- + Passivendung -ntur → laudābantur.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den gesamten Übungstext ins Deutsche und erkläre den Unterschied zwischen ‚ā mīlitibus‘ und ‚vallō et fossā‘.",
				model: "Die Stadt Rom wird von tapferen Soldaten verteidigt. Einst wurde das Lager durch Wall und Graben befestigt. Morgen werden Gesandte vom Konsul zum Senat geschickt werden und die Bürger werden vor der Gefahr gewarnt werden. ‚ā mīlitibus‘ nennt handelnde Personen (ā + Abl.), ‚vallō et fossā‘ nennt sachliche Mittel (bloßer Ablativ).",
				criteria: [
					"Ich übersetze Präsens, Imperfekt und Futur I Passiv zeitgerecht.",
					"Ich erkenne castra als Pluralwort mit singularischer deutscher Bedeutung (das Lager).",
					"Ich erkläre die Regel für Personen (ā/ab + Abl.) vs. Sachen (bloßer Abl.).",
				],
			},
			2: {
				language: "la",
				prompt: "Forme die beiden Aktivsätze ins lateinische Passiv um und übersetze deine neuen Sätze ins Deutsche: 1. Hostēs urbem oppugnant. 2. Senātus lēgātum audiet.",
				model: "1. Urbs ab hostibus oppugnātur. (Die Stadt wird von den Feinden angegriffen.) 2. Lēgātus ā senātū audiētur. (Der Gesandte wird vom Senat angehört werden.)",
				criteria: [
					"Ich mache das frühere Akkusativobjekt zum Nominativsubjekt.",
					"Ich setze den früheren Urheber in ā/ab + Ablativ (ab vor h/Vokal).",
					"Ich wähle die richtige Passivendung in Präsens und Futur I.",
				],
			},
		},
		workshop: {
			kind: "forms",
			liveModel: "passive",
			goals: [
				{
					label: "Urheber (Person) anschließen",
					before: "Discipulus ___ magistrō laudātur.",
					after: "",
					options: ["ā", "in", "cum"],
					answer: "ā",
					explanation: "Der handelnde Urheber (Person) steht beim Passiv mit ā/ab + Ablativ.",
				},
				{
					label: "Futur I Passiv (kons. Konj.) erkennen",
					before: "cīvēs crās ad forum (dūcere, 3. Pl. Fut. I Pass.) →",
					after: "",
					options: ["dūcentur", "dūcuntur", "dūcēbantur"],
					answer: "dūcentur",
					explanation: "Konsonantische Verben bilden das Futur I mit -e-: dūcentur.",
				},
				{
					label: "2. Person Singular Präsens Passiv",
					before: "du wirst gelobt (laudāre) →",
					after: "",
					options: ["laudāris", "laudātur", "laudāminī"],
					answer: "laudāris",
					explanation: "Die Endung der 2. Person Singular Passiv ist -ris.",
				},
			],
		},
	},
	{
		id: "l7-passiv-perfekt",
		stage: "passiv",
		title: "Passiv im Perfektstamm (Perfekt, Plusquamperfekt, Futur II)",
		skill: "Zusammengesetzte Passivformen aus PPP und esse sicher bestimmen und in KNG-Kongruenz bilden",
		lehrplan: "L7 LB 2.2 · Formenlehre (Verben im Passiv)",
		bindings: ["2.2-verben", "2.2-bestandteile", "2.2-bilden"],
		paragraphs: [
			"Anders als im Präsensstamm gibt es im Perfektstamm des Passivs keine einzelnen Endungen, sondern zweiteilige Formen: das Partizip Perfekt Passiv (PPP, 4. Stammform wie laudātus, -a, -um) kombiniert mit einer Form von esse. Die Zeitstufe erkennst du am Hilfsverb: PPP + sum/es/est bildet das Perfekt Passiv (laudātus est = er ist gelobt worden / wurde gelobt), PPP + eram bildet das Plusquamperfekt Passiv (laudātus erat = er war gelobt worden) und PPP + erō bildet das Futur II Passiv (laudātus erit = er wird gelobt worden sein).",
			"Achtung Falle: Weil sum im Präsens steht, übersetzen Lernende ‚Urbs capta est‘ oft falsch mit ‚Die Stadt wird eingenommen‘. Merke dir fest: PPP + Präsens von esse ist immer Vergangenheit (Perfekt Passiv: Die Stadt ist eingenommen worden / wurde eingenommen)! Außerdem verhält sich das PPP wie ein Adjektiv der a-/o-Deklination und richtet sich in Kasus (Nominativ), Numerus und Genus nach dem Subjekt: mīles laudātus est, urbs capta est, oppida dēlēta sunt.",
		],
		diagram: {
			title: "Baukasten des Perfektpassivs",
			subtitle: "Das PPP passt sich dem Subjekt an — die Form von esse bestimmt das Tempus.",
			layout: "triptych",
			parts: [
				{
					tag: "Perfekt Passiv",
					title: "PPP + sum / es / est …",
					formula: "urbs capta est",
					note: "Immer Vergangenheit! Übersetzung: ‚Die Stadt wurde eingenommen‘ oder ‚ist eingenommen worden‘ (niemals Präsens!).",
				},
				{
					tag: "Plusquamperfekt",
					title: "PPP + eram / erās / erat …",
					formula: "mīlitēs missī erant",
					note: "Vorvergangenheit: ‚Die Soldaten waren geschickt worden‘. Das PPP steht im Nom. Pl. m. passend zu mīlitēs.",
				},
				{
					tag: "Futur II Passiv",
					title: "PPP + erō / eris / erit …",
					formula: "bellum fīnītum erit",
					note: "Abgeschlossene Zukunft: ‚Der Krieg wird beendet worden sein‘. Vor allem in Nebensätzen mit sī oder cum.",
				},
			],
		},
		material:
			"Postquam Carthāgō ā Rōmānīs dēlēta est, prōvincia Africa cōnstitūta est. Anteā multī mīlitēs in bellō necātī erant et multae nāvēs dēmersae erant. Sī pāx servāta erit, cīvēs gaudēbunt.",
		materialLabel: "Übungstext · Nach dem Fall Karthagos",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Welche Übersetzung von ‚Carthāgō dēlēta est‘ ist richtig?",
			answer: "Karthago wurde zerstört / ist zerstört worden.",
			wrong: [
				"Karthago wird zerstört.",
				"Karthago war zerstört worden.",
			],
			explanation: "PPP + est bildet das Perfekt Passiv (Vergangenheit), niemals Präsens. Plusquamperfekt wäre dēlēta erat.",
		},
		takeaway:
			"Perfekt, Plusquamperfekt und Futur II Passiv bestehen aus dem PPP (in KNG-Kongruenz zum Subjekt) plus Präsens, Imperfekt oder Futur I von esse. PPP + est bedeutet immer Vergangenheit!",
		practice: [
			{
				prompt: "Ergänze das PPP in KNG-Kongruenz (‚Die Tempel sind zerstört worden‘): Templa ___ sunt. (dēlēre → dēlētus)",
				answers: ["deleta", "dēlēta"],
				feedback: "templa ist Nominativ Plural Neutrum; das PPP lautet daher dēlēta.",
			},
			{
				prompt: "Bestimme das Tempus von ‚mīlitēs missī erant‘ (ein Wort): ___",
				answers: ["Plusquamperfekt", "Plusquamperfekt Passiv"],
				feedback: "PPP + Imperfekt von esse (erant) bildet das Plusquamperfekt Passiv.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und ordne jede Passivform (dēlēta est, cōnstitūta est, necātī erant, dēmersae erant, servāta erit) ihrem Tempus zu.",
				model: "Nachdem Karthago von den Römern zerstört worden war, wurde die Provinz Africa eingerichtet. Zuvor waren viele Soldaten im Krieg getötet worden und viele Schiffe waren versenkt worden. Wenn der Frieden bewahrt worden sein wird (bewahrt ist), werden sich die Bürger freuen. Perfekt: dēlēta est, cōnstitūta est; Plusquamperfekt: necātī erant, dēmersae erant; Futur II: servāta erit.",
				criteria: [
					"Ich übersetze alle drei Passivtempora zeitlich sauber.",
					"Ich beachte nach postquam im Deutschen die Vorzeitigkeit (Plusquamperfekt).",
					"Ich ordne alle fünf Passivformen korrekt ihrem Tempus zu.",
				],
			},
			2: {
				language: "de",
				prompt: "Erkläre an drei verschiedenen Subjekten (dux m., urbs f., oppidum n.), wie sich das PPP von capere (captus, -a, -um) im Perfekt und Plusquamperfekt Passiv im Singular und Plural verändert.",
				model: "Im Singular richtet sich das PPP nach dem Genus: dux captus est (m.), urbs capta est (f.), oppidum captum est (n.). Im Plural stehen entsprechend ducēs captī erant (m.), urbēs captae erant (f.) und oppida capta erant (n.).",
				criteria: [
					"Ich bilde alle drei Genera im Singular fehlerfrei.",
					"Ich bilde alle drei Genera im Plural fehlerfrei.",
					"Ich zeige den Wechsel des Hilfsverbs von est/sunt zu erat/erant.",
				],
			},
		},
		workshop: {
			kind: "forms",
			goals: [
				{
					label: "KNG-Kongruenz im Neutrum Plural",
					before: "Multa oppida ā mīlitibus ___",
					after: "sunt.",
					options: ["capta", "captī", "captum"],
					answer: "capta",
					explanation: "oppida ist Nominativ Plural Neutrum → PPP capta.",
				},
				{
					label: "Plusquamperfekt Passiv bilden",
					before: "Die Gesandten waren gehört worden: Lēgātī audītī",
					after: "",
					options: ["erant", "sunt", "erunt"],
					answer: "erant",
					explanation: "Plusquamperfekt Passiv besteht aus PPP + Imperfekt von esse (erant).",
				},
				{
					label: "Präsens Passiv von Perfekt Passiv trennen",
					before: "‚Die Stadt wurde verteidigt‘ → Urbs",
					after: "",
					options: ["dēfēnsa est", "dēfenditur", "dēfēnsa erit"],
					answer: "dēfēnsa est",
					explanation: "dēfenditur ist Präsens (wird verteidigt); dēfēnsa est ist Perfekt Passiv (wurde verteidigt).",
				},
			],
		},
	},
	{
		id: "l7-ferre-infinitive",
		stage: "passiv",
		title: "Das Verb ferre & Infinitive im Passiv",
		skill: "Unregelmäßige Formen von ferre (und Komposita) sowie Infinitiv Präsens und Perfekt Passiv bilden",
		lehrplan: "L7 LB 2.2 · Formenlehre (Verben & Nominalformen)",
		bindings: ["2.2-verben", "2.2-bestandteile", "2.2-bilden"],
		paragraphs: [
			"Das Verb ferre, ferō, tulī, lātum (tragen, bringen, ertragen, berichten) ist eines der produktivsten Verben im Lateinischen, weil es zahlreiche Komposita bildet (afferre = herbeibringen, auferre = wegtragen, cōnferre = zusammentragen, referre = zurückbringen/berichten). Seine Besonderheit liegt im Präsens Aktiv und Passiv sowie im Imperativ: An einigen Stellen fehlt der Bindevokal — fers, fert, fertis (Aktiv), ferris, fertur (Passiv), Imperativ fer! / ferte! und der Infinitiv Präsens Passiv ferrī. Außerdem nutzt es drei verschiedene Stämme: fer- (Präsens), tul- (Perfekt) und lāt- (PPP).",
			"Für Passivsätze und den AcI brauchst du zwei neue Infinitive: Der Infinitiv Präsens Passiv ersetzt im a-, e- und i-Stamm das Schluss-e durch -ī (laudāre → laudārī = gelobt werden; monēre → monērī; audīre → audīrī). Achtung in der konsonantischen Konjugation: Dort fällt die ganze Endung -ere weg und wird durch langes -ī ersetzt (dūcere → dūcī, capere → capī, agere → agī; und ferre → ferrī)! Der Infinitiv Perfekt Passiv besteht immer aus dem PPP + esse (laudātus, -a, -um esse = gelobt worden sein; lātus esse = getragen worden sein).",
		],
		diagram: {
			title: "ferre & die beiden Passiv-Infinitive",
			subtitle: "Vergleiche die Stammformen von ferre mit der Bildung der Passiv-Infinitive.",
			layout: "triptych",
			parts: [
				{
					tag: "ferre",
					title: "3 Stämme, fehlendes i/e",
					formula: "ferō, fers, fert · tulī · lātum",
					note: "Im Präsens ohne Bindevokal: fers, fert, fertis; Passiv ferris, fertur; Inf. Präs. Pass. ferrī. Imperfekt (ferēbam) und Futur (feram) sind völlig regelmäßig.",
				},
				{
					tag: "Inf. Präs. Pass.",
					title: "-rī, aber konsonantisch -ī",
					formula: "laudārī · dūcī · capī · ferrī",
					note: "Wichtigste Stolperfalle in L7: dūcī (geführt werden) sieht kurz aus, ist aber Infinitiv Präsens Passiv, nicht Perfekt Aktiv!",
				},
				{
					tag: "Inf. Perf. Pass.",
					title: "PPP + esse (vorzeitig)",
					formula: "lātus, -a, -um esse",
					note: "Übersetzung: ‚getragen worden sein‘. Im AcI steht das PPP im Akkusativ passend zum Subjektsakkusativ (auxilium lātum esse).",
				},
			],
		},
		material:
			"Cīvēs auxilium ferre dēbent, cum patria in perīculō est. Nūntius fertur celeriter ad senātum. Auxilium ā sociīs ferrī potest, sed multa perīcula anteā lāta sunt. Senātōrēs sciunt lēgem novam ā cōnsule lātam esse.",
		materialLabel: "Übungstext · ferre und Passiv-Infinitive im politischen Alltag",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "la",
			question: "Wie lautet der Infinitiv Präsens Passiv von ‚dūcere‘ (führen)?",
			answer: "dūcī",
			wrong: ["dūcerī", "ductus esse"],
			explanation: "In der konsonantischen Konjugation tritt -ī direkt an den Stamm: dūcere → dūcī (geführt werden).",
		},
		takeaway:
			"ferre nutzt drei Stämme (fer-, tul-, lāt-) und streicht in fers, fert, fertis, ferris, fertur, ferrī den Bindevokal. Der Infinitiv Präsens Passiv endet auf -rī, in der konsonantischen Konjugation auf -ī (dūcī, capī).",
		practice: [
			{
				prompt: "Bilde die 3. Person Singular Präsens Aktiv von ferre: ___",
				answers: ["fert"],
				feedback: "Bei ferre fällt der Bindevokal aus: fert (er/sie/es trägt).",
			},
			{
				prompt: "Bilde den Infinitiv Präsens Passiv von capere (gefangen werden): ___",
				answers: ["capi", "capī"],
				feedback: "capere (konsonantisch mit i-Erweiterung) bildet den Infinitiv Präsens Passiv capī.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und bestimme alle Formen von ferre (ferre, fertur, ferrī, lāta sunt, lātam esse).",
				model: "Die Bürger müssen Hilfe bringen, wenn die Heimat in Gefahr ist. Eine Nachricht wird schnell zum Senat gebracht. Hilfe kann von den Bundesgenossen gebracht werden, aber viele Gefahren sind zuvor ertragen worden. Die Senatoren wissen, dass ein neues Gesetz vom Konsul eingebracht worden ist. ferre: Inf. Präs. Akt.; fertur: 3. Sg. Präs. Pass.; ferrī: Inf. Präs. Pass.; lāta sunt: 3. Pl. Perf. Pass.; lātam esse: Inf. Perf. Pass.",
				criteria: [
					"Ich übersetze alle vier Sätze treffend (inkl. lēgem ferre = ein Gesetz einbringen).",
					"Ich bestimme alle fünf Formen von ferre korrekt.",
					"Ich gebe den AcI mit lātam esse vorzeitig-passivisch wieder.",
				],
			},
			2: {
				language: "de",
				prompt: "Bilde zu den vier Verben laudāre, monēre, vincere (vīcī, victum) und ferre (tulī, lātum) jeweils den Infinitiv Präsens Passiv und den Infinitiv Perfekt Passiv (Maskulinum Singular) und nenne ihre deutsche Bedeutung.",
				model: "laudārī (gelobt werden) / laudātus esse (gelobt worden sein); monērī (gewarnt werden) / monitus esse (gewarnt worden sein); vincī (besiegt werden) / victus esse (besiegt worden sein); ferrī (getragen werden) / lātus esse (getragen worden sein).",
				criteria: [
					"Ich wende -rī bei a-/e-Konj., -ī bei vincere und ferrī bei ferre richtig an.",
					"Ich nutze die korrekte 4. Stammform (PPP) für den Infinitiv Perfekt Passiv.",
					"Ich übersetze Gleichzeitigkeit (werden) und Vorzeitigkeit (worden sein) exakt.",
				],
			},
		},
		workshop: {
			kind: "forms",
			goals: [
				{
					label: "Infinitiv Präsens Passiv (kons. Konj.)",
					before: "mittere (schicken) → geschickt werden:",
					after: "",
					options: ["mittī", "mitterī", "missus esse"],
					answer: "mittī",
					explanation: "Konsonantische Verben ersetzen -ere durch -ī: mittī.",
				},
				{
					label: "Unregelmäßige Form von ferre",
					before: "du bringst Hilfe → auxilium",
					after: "",
					options: ["fers", "feris", "ferris"],
					answer: "fers",
					explanation: "2. Sg. Präsens Aktiv von ferre lautet ohne Bindevokal fers (ferris ist Passiv).",
				},
				{
					label: "Infinitiv Perfekt Passiv mit KNG",
					before: "Scīmus auxilium (n.) ā sociīs",
					after: "",
					options: ["lātum esse", "lātam esse", "ferrī"],
					answer: "lātum esse",
					explanation: "auxilium ist Akk. Sg. Neutrum; vorzeitig-passivisch steht lātum esse.",
				},
			],
		},
	},
	{
		id: "l7-aci-passiv",
		stage: "passiv",
		title: "AcI mit Passiv-Infinitiv & Zeitverhältnisse",
		skill: "Den AcI (Wiederholung aus L6) sicher auf passive Infinitive und relative Zeitverhältnisse erweitern",
		lehrplan: "L7 LB 2.3 · Satzlehre (Satzwertige Konstruktionen)",
		bindings: ["2.3-konstruktionen", "2.3-strukturen", "2.3-sprachvergleich"],
		paragraphs: [
			"Aus der 6. Klasse kennst du den Accusativus cum Infinitivo (AcI) nach Kopfverben des Sagens, Wahrnehmens, Wissens und Fühlens (dīcere, vidēre, audīre, scīre, putāre, gaudēre): Du übersetzt das Kopfverb, setzt ein deutsches ‚dass‘, machst den lateinischen Subjektsakkusativ zum deutschen Subjekt im Nominativ und den Infinitiv zum gebeugten Prädikat. In der 7. Klasse kommt das Passiv im AcI hinzu.",
			"Dabei gelten genau dieselben relativen Zeitverhältnisse wie im Aktiv: Der Infinitiv Präsens Passiv (laudārī, dēfendī) drückt Gleichzeitigkeit zum übergeordneten Verb aus (Scīmus urbem dēfendī = Wir wissen, dass die Stadt verteidigt wird; Scīvimus urbem dēfendī = Wir wussten, dass die Stadt verteidigt wurde). Der Infinitiv Perfekt Passiv (dēfēnsam esse) drückt Vorzeitigkeit aus (Scīvimus urbem dēfēnsam esse = Wir wussten, dass die Stadt verteidigt worden war). Das PPP im Infinitiv Perfekt Passiv steht immer in KNG-Kongruenz zum Subjektsakkusativ — im Text wird ‚esse‘ gelegentlich weggelassen!",
		],
		diagram: {
			title: "AcI-Übersetzung in drei Schritten (Aktiv & Passiv)",
			subtitle: "Verfolge, wie aus lateinischem Akkusativ und Passiv-Infinitiv ein deutscher dass-Satz wird.",
			layout: "flow",
			parts: [
				{
					tag: "1 · Kopfverb",
					title: "Auslöser + ‚dass‘",
					formula: "Scīvimus, … → Wir wussten, dass",
					note: "Das Tempus des Kopfverbs setzt den Anker auf dem Zeitstrahl (Gegenwart oder Vergangenheit).",
				},
				{
					tag: "2 · Subjektsakkusativ",
					title: "Akkusativ → dt. Subjekt",
					formula: "urbem (Akk.) → die Stadt (Nom.)",
					note: "Steht im AcI ein Urheber, begleitet er den Passiv-Infinitiv mit ā/ab + Ablativ (ā mīlitibus = von den Soldaten).",
				},
				{
					tag: "3 · Passiv-Infinitiv",
					title: "Gleichzeitig vs. Vorzeitig",
					formula: "dēfendī (glz.) · dēfēnsam esse (vorz.)",
					note: "Nach Vergangenheit ergibt Inf. Präs. Pass. das Präteritum (wurde verteidigt), Inf. Perf. Pass. das Plusquamperfekt (war verteidigt worden).",
				},
			],
		},
		material:
			"Nūntius dīxit castra Rōmānōrum ab hostibus oppugnārī. Cōnsul autem audīvit montēs iam ā mīlitibus occupātōs esse et sociōs auxilium ferre. Cīvēs spērābant urbem nōn captam esse.",
		materialLabel: "Übungstext · Nachrichten aus dem Feldlager",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Wie wird der Subjektsakkusativ eines lateinischen AcI im deutschen dass-Satz wiedergegeben?",
			answer: "Als Subjekt im Nominativ.",
			wrong: [
				"Als Akkusativobjekt.",
				"Als präpositionales Adverbiale.",
			],
			explanation: "Der lateinische Subjektsakkusativ (z. B. urbem) wird im deutschen dass-Satz immer zum Subjekt im Nominativ (dass die Stadt …).",
		},
		takeaway:
			"Im AcI wird der Subjektsakkusativ zum deutschen Subjekt und der Infinitiv zum Prädikat. Infinitiv Präsens Passiv (-rī/-ī) zeigt Gleichzeitigkeit, Infinitiv Perfekt Passiv (PPP im Akk. + esse) Vorzeitigkeit.",
		practice: [
			{
				prompt: "Welches Zeitverhältnis drückt der Infinitiv Perfekt Passiv (z. B. captam esse) im AcI aus? (ein Wort): ___",
				answers: ["Vorzeitigkeit", "vorzeitig"],
				feedback: "Der Infinitiv Perfekt (Aktiv wie Passiv) drückt stets Vorzeitigkeit zum übergeordneten Verb aus.",
			},
			{
				prompt: "Ergänze das PPP im AcI (‚Ich weiß, dass die Briefe geschickt worden sind‘): Sciō epistulās ___ esse. (mittere → missus)",
				answers: ["missas", "missās"],
				feedback: "epistulās ist Akkusativ Plural Femininum; das PPP steht kongruent im Akk. Pl. f.: missās.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den gesamten Übungstext ins Deutsche und gib für jeden der drei AcI an, ob er gleichzeitig oder vorzeitig ist.",
				model: "Der Bote sagte, dass das Lager der Römer von den Feinden angegriffen wurde (oppugnārī: gleichzeitig). Der Konsul aber hörte, dass die Berge schon von den Soldaten besetzt worden waren (occupātōs esse: vorzeitig) und dass die Bundesgenossen Hilfe brachten (ferre: gleichzeitig). Die Bürger hofften, dass die Stadt nicht eingenommen worden war (captam esse: vorzeitig).",
				criteria: [
					"Ich übersetze alle drei AcI mit dem richtigen deutschen Tempus nach der Vergangenheit.",
					"Ich unterscheide passive und aktive Infinitive genau.",
					"Ich benenne Gleichzeitigkeit und Vorzeitigkeit korrekt.",
				],
			},
			2: {
				language: "de",
				prompt: "Vergleiche die beiden Sätze ‚Audiō urbem dēfendī‘ und ‚Audīvī urbem dēfēnsam esse‘. Übersetze beide und erkläre, welche zwei Dinge sich beim Übersetzen ins Deutsche ändern.",
				model: "1. Ich höre, dass die Stadt verteidigt wird. 2. Ich hörte, dass die Stadt verteidigt worden war. Zwei Dinge ändern sich: das übergeordnete Tempus (Gegenwart → Vergangenheit) und das relative Zeitverhältnis im AcI (Gleichzeitigkeit mit dēfendī → Vorzeitigkeit mit dēfēnsam esse, daher im Deutschen Plusquamperfekt Passiv).",
				criteria: [
					"Ich übersetze beide Sätze zeitlich präzise.",
					"Ich erkläre das Prinzip der relativen Zeitgebung im AcI.",
					"Ich zeige den Unterschied zwischen Inf. Präs. Pass. und Inf. Perf. Pass.",
				],
			},
		},
		workshop: {
			kind: "syntax",
			liveModel: "timeline",
			goals: [
				{
					label: "Gleichzeitig nach Vergangenheit übersetzen",
					before: "Audīvimus mīlitēs laudārī → Wir hörten, dass die Soldaten",
					after: "",
					options: ["gelobt wurden.", "gelobt worden waren.", "lobten."],
					answer: "gelobt wurden.",
					explanation: "laudārī (Inf. Präs. Pass.) ist gleichzeitig zu audīvimus (Vergangenheit) → Präteritum Passiv.",
				},
				{
					label: "Vorzeitig nach Vergangenheit übersetzen",
					before: "Scīvimus urbem captam esse → Wir wussten, dass die Stadt",
					after: "",
					options: ["eingenommen worden war.", "eingenommen wurde.", "eingenommen wird."],
					answer: "eingenommen worden war.",
					explanation: "captam esse (Inf. Perf. Pass.) ist vorzeitig zu scīvimus → Plusquamperfekt Passiv.",
				},
				{
					label: "KNG-Kongruenz im AcI prüfen",
					before: "Cōnsul scit lēgēs (f. Pl.) ā cīvibus",
					after: "esse.",
					options: ["servātās", "servātōs", "servāta"],
					answer: "servātās",
					explanation: "lēgēs ist Akkusativ Plural Femininum → das PPP lautet servātās.",
				},
			],
		},
	},
	{
		id: "l7-kasus-praedikativum",
		stage: "passiv",
		title: "Prädikativum & neue Kasusfunktionen",
		skill: "Prädikativum, doppelten Nominativ/Akkusativ, genitivus subiectivus/obiectivus sowie Dativ des Zwecks und Vorteils übersetzen",
		lehrplan: "L7 LB 2.3 · Satzlehre (Satzglieder & Kasusfunktionen)",
		bindings: ["2.3-satzglieder", "2.3-kasus", "2.3-stil"],
		paragraphs: [
			"In der 7. Klasse lernst du feine Satz- und Kasusfunktionen kennen, die lateinische Sätze kurz und präzise machen. Ein Prädikativum ist ein Adjektiv oder Substantiv in KNG-Kongruenz zum Subjekt oder Objekt, das einen Zustand während der Handlung angibt und im Deutschen oft als Adverb oder mit ‚als‘ übersetzt wird: Mīlitēs laetī domum rediērunt (Die Soldaten kehrten froh nach Hause zurück); Cicerō cōnsul rem pūblicam dēfendit (Cicero verteidigte als Konsul den Staat).",
			"Dazu treten fünf wichtige Kasusfunktionen: 1. Doppelter Akkusativ bei Verben des Nennens/Wählens/Haltens für (Cīvēs Cicerōnem cōnsulem creāvērunt = Die Bürger wählten Cicero zum Konsul) — im Passiv wird daraus der doppelte Nominativ (Cicerō cōnsul creātus est = Cicero wurde zum Konsul gewählt). 2. Genitivus subiectivus (amor patris = die Liebe des Vaters, der Vater liebt) vs. genitivus obiectivus (amor patriae = die Liebe zur Heimat, die Heimat wird geliebt). 3. Dativ des Zwecks (Dativus finalis, z. B. auxiliō venīre = zu Hilfe kommen) und Dativ des Vorteils (Dativus commodi, z. B. patriae labōrāre = für die Heimat arbeiten) — oft zusammen als doppelter Dativ: Hoc mihi cūrae est (Dies ist mir eine Sorge / liegt mir am Herzen).",
		],
		diagram: {
			title: "Neue Satz- und Kasusfunktionen im Überblick",
			subtitle: "Prüfe, wie du Prädikativum, Genitive und Dative treffend ins Deutsche überträgst.",
			layout: "triptych",
			parts: [
				{
					tag: "Prädikativum",
					title: "KNG-kongruent, dt. Adverb / ‚als‘",
					formula: "laetus rediit · cōnsul dīxit",
					note: "Das Lateinische bezieht laetus (froh) oder cōnsul (als Konsul) im Kasus auf die Person, das Deutsche auf die Handlung.",
				},
				{
					tag: "Genitiv & dopp. Kasus",
					title: "subiectivus vs. obiectivus",
					formula: "amor patriae · cōnsulem creāre",
					note: "Bei amor patriae (Liebe zur Heimat) ist die Heimat das Ziel (obiectivus). Doppelter Akk. im Aktiv wird im Passiv zum doppelten Nom.",
				},
				{
					tag: "Dativ",
					title: "Zweck (finalis) & Vorteil (commodi)",
					formula: "auxiliō venīre · cīvibus labōrāre",
					note: "Wozu? → Dativ des Zwecks (zu Hilfe). Für wen? → Dativ des Vorteils (für die Bürger). Oft vereint im doppelten Dativ.",
				},
			],
		},
		material:
			"Cīvēs Cicerōnem cōnsulem creāvērunt; ita Cicerō cōnsul factus est. Amor patriae omnēs cīvēs mōvit. Sociī Rōmānīs auxiliō vēnērunt et mīlitēs fortēs prīmī in proelium cucurrērunt.",
		materialLabel: "Übungstext · Amtswahl und Einsatz für die res publica",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Welche Kasusfunktion liegt in ‚amor patriae‘ (die Liebe zur Heimat) vor?",
			answer: "Genitivus obiectivus (die Heimat ist das Ziel der Liebe).",
			wrong: [
				"Genitivus subiectivus (die Heimat selbst liebt).",
				"Dativ des Zwecks (wozu man liebt).",
			],
			explanation: "Frage: Wen oder was liebt man? Die Heimat → sie ist das Objekt der im Substantiv amor steckenden Handlung (genitivus obiectivus).",
		},
		takeaway:
			"Das Prädikativum übersetzt du oft als Adverb oder mit ‚als‘. Merke dir doppelten Akkusativ/Nominativ (wählen zu), genitivus subiectivus vs. obiectivus sowie Dativ des Zwecks (auxiliō) und des Vorteils (für jemanden).",
		practice: [
			{
				prompt: "Wie übersetzt man ‚auxiliō venīre‘ (Dativ des Zwecks) treffend? ___",
				answers: ["zu Hilfe kommen", "zur Hilfe kommen"],
				feedback: "auxiliō ist Dativ des Zwecks (Dativus finalis): zu Hilfe kommen.",
			},
			{
				prompt: "Welche Funktion hat ‚prīmī‘ im Satz ‚Mīlitēs prīmī cucurrērunt‘ (als Erste)? (ein Fachbegriff): ___",
				answers: ["Prädikativum", "Praedikativum"],
				feedback: "prīmī steht in KNG-Kongruenz zu mīlitēs und gibt an, in welcher Eigenschaft sie liefen → Prädikativum.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und benenne je ein Beispiel für doppelten Akkusativ, doppelten Nominativ, doppelten Dativ und Prädikativum.",
				model: "Die Bürger wählten Cicero zum Konsul; so wurde Cicero Konsul. Die Liebe zur Heimat bewegte alle Bürger. Die Bundesgenossen kamen den Römern zu Hilfe und die tapferen Soldaten liefen als Erste in die Schlacht. Doppelter Akk.: Cicerōnem cōnsulem; doppelter Nom.: Cicerō cōnsul; doppelter Dativ: Rōmānīs (Vorteil) + auxiliō (Zweck); Prädikativum: prīmī (als Erste).",
				criteria: [
					"Ich übersetze alle drei Sätze stilistisch flüssig ins Deutsche.",
					"Ich erkenne Rōmānīs auxiliō als Kombination aus Dativ des Vorteils und des Zwecks.",
					"Ich ordne alle vier Fachbegriffe exakt zu.",
				],
			},
			2: {
				language: "de",
				prompt: "Erkläre an der Wendung ‚metus hostium‘, warum derselbe lateinische Ausdruck je nach Kontext zwei völlig gegensätzliche Bedeutungen haben kann (genitivus subiectivus vs. obiectivus).",
				model: "Als genitivus subiectivus bedeutet ‚metus hostium‘ ‚die Angst der Feinde‘ (die Feinde selbst haben Angst). Als genitivus obiectivus bedeutet es ‚die Angst vor den Feinden‘ (man hat Angst vor den Feinden). Erst der Textzusammenhang entscheidet, welche Richtung gemeint ist.",
				criteria: [
					"Ich gebe beide Übersetzungen für metus hostium exakt an.",
					"Ich ordne beide korrekt subiectivus und obiectivus zu.",
					"Ich erkläre, dass der Kontext die richtige Auflösung bestimmt.",
				],
			},
		},
		workshop: {
			kind: "syntax",
			goals: [
				{
					label: "Doppelter Akkusativ → doppelter Nominativ",
					before: "Im Passiv: Caesar ___ creātus est.",
					after: "",
					options: ["cōnsul", "cōnsulem", "cōnsulī"],
					answer: "cōnsul",
					explanation: "Im Passiv steht bei creārī (gewählt werden zu) der doppelte Nominativ: Caesar cōnsul.",
				},
				{
					label: "Genitivus obiectivus übersetzen",
					before: "cupiditās glōriae →",
					after: "",
					options: ["das Streben nach Ruhm", "der Ruhm des Strebens", "für den Ruhm"],
					answer: "das Streben nach Ruhm",
					explanation: "Der Ruhm ist das Ziel des Strebens (genitivus obiectivus).",
				},
				{
					label: "Dativ des Vorteils + Zwecks",
					before: "Mīlitēs cīvibus ___ vēnērunt.",
					after: "",
					options: ["auxiliō", "auxilium", "auxiliī"],
					answer: "auxiliō",
					explanation: "cīvibus (für die Bürger, Vorteil) + auxiliō (zu Hilfe, Zweck).",
				},
			],
		},
	},
];
