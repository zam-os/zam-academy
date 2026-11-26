import type { Lesson } from "../types";

export const LESSONS_KONJUNKTIV: Lesson[] = [
	{
		id: "l7-konjunktiv-bildung",
		stage: "konjunktiv",
		title: "Konjunktiv Präsens & Imperfekt (Aktiv & Passiv)",
		skill: "Die Moduszeichen des Konjunktivs Präsens und Imperfekt im Aktiv und Passiv sicher erkennen und bilden",
		lehrplan: "L7 LB 2.2 · Formenlehre (Verben im Konjunktiv)",
		bindings: ["2.2-verben", "2.2-bestandteile", "2.2-bilden"],
		paragraphs: [
			"Neben dem Indikativ (Wirklichkeitsform) und Imperativ (Befehlsform) ist der Konjunktiv der dritte Modus des Lateinischen. Im Konjunktiv Präsens ändert sich der Kennvokal vor der Personalendung nach einer leicht merkbaren Faustregel: Die a-Konjugation tauscht ihr a gegen -e- (laudem, laudēs, laudet / lauder, laudēris, laudētur), alle anderen Konjugationen (e-, i- und konsonantische Konjugation sowie ferre) erhalten das Moduszeichen -a- (moneam, dūcam, capiam, audiam, feram / monear, dūcar, capiar, audiar, ferar). Unregelmäßig sind esse (sim, sīs, sit, sīmus, sītis, sint), posse (possim) und velle (velim).",
			"Der Konjunktiv Imperfekt ist die einfachste Form der gesamten lateinischen Verbgrammatik: Du nimmst den vollständigen Infinitiv Präsens Aktiv und hängst direkt die Personalendungen an — Aktiv -m, -s, -t, -mus, -tis, -nt und Passiv -r, -ris, -tur, -mur, -minī, -ntur! Beispiele: laudāre → laudārem / laudārer; dūcere → dūcerem / dūcerer; esse → essem, essēs, esset; ferre → ferrem / ferrer. Achtung Verwechslung im Konjunktiv Präsens: ‚dūcam‘ und ‚audiam‘ können sowohl 1. Sg. Futur I Indikativ als auch 1. Sg. Konjunktiv Präsens sein — erst ab der 2. Person (dūcēs Futur vs. dūcās Konjunktiv) trennen sich die Vokale!",
		],
		diagram: {
			title: "Signalzeichen für Konjunktiv Präsens & Imperfekt",
			subtitle: "Erkenne das Moduszeichen auf den ersten Blick im Aktiv und Passiv.",
			layout: "contrast",
			parts: [
				{
					tag: "Konj. Präsens",
					title: "a → e · alle anderen → a",
					formula: "laud-e-t / laud-ē-tur · dūc-a-t / dūc-ā-tur",
					note: "Die a-Konjugation bekommt e, die e-/kons./i-Konjugation bekommt a. Bei esse heißt es sim, sīs, sit.",
				},
				{
					tag: "Konj. Imperfekt",
					title: "Infinitiv Präs. Akt. + Endung",
					formula: "laudāre-t · dūcerē-tur · esse-t",
					note: "Gilt ausnahmslos für alle Verben, sogar für esse (essem), posse (possem), velle (vellem) und ferre (ferrem)!",
				},
				{
					tag: "Stolperfalle",
					title: "Futur I vs. Konj. Präsens",
					formula: "dūcēs (Fut. I) vs. dūcās (Konj.)",
					note: "In der kons./i-Konjugation zeigt -e- (ab 2. Sg.) das Futur I Indikativ, -a- dagegen den Konjunktiv Präsens.",
				},
			],
		},
		material:
			"Cōnsul mīlitēs hortātur, ut patriam fortiter dēfendant et ab hostibus nē vincantur. Senātōrēs rogābant, cūr lēgātus tam sērō venīret et quōmodo urbs servārētur.",
		materialLabel: "Übungstext · Konjunktiv Präsens und Imperfekt im Nebensatz",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "la",
			question: "Welche Form ist die 3. Person Singular Konjunktiv Imperfekt Passiv von ‚servāre‘?",
			answer: "servārētur",
			wrong: ["servābātur", "servētur"],
			explanation: "Infinitiv Präsens Aktiv servāre + Passivendung -tur ergibt servārētur (servābātur ist Indikativ Imperfekt, servētur Konjunktiv Präsens).",
		},
		takeaway:
			"Konjunktiv Präsens: a-Konjugation mit -e- (laudet), alle anderen mit -a- (moneat, dūcat, audiat), esse → sim. Konjunktiv Imperfekt: immer Infinitiv Präsens Aktiv + Personalendung (Aktiv oder Passiv).",
		practice: [
			{
				prompt: "Bilde die 3. Person Plural Konjunktiv Präsens Aktiv von laudāre: ___",
				answers: ["laudent"],
				feedback: "a-Konjugation nutzt im Konjunktiv Präsens das Moduszeichen -e-: laudent.",
			},
			{
				prompt: "Bilde die 3. Person Singular Konjunktiv Imperfekt Aktiv von ferre: ___",
				answers: ["ferret"],
				feedback: "Infinitiv Präsens Aktiv ferre + Endung -t ergibt ferret.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und bestimme Tempus, Modus und Genus Verbi von dēfendant, vincantur, venīret und servārētur.",
				model: "Der Konsul ermutigt die Soldaten, dass sie die Heimat tapfer verteidigen und von den Feinden nicht besiegt werden. Die Senatoren fragten, warum der Gesandte so spät komme/kam und wie die Stadt gerettet werde/wurde. dēfendant: 3. Pl. Konj. Präs. Akt.; vincantur: 3. Pl. Konj. Präs. Pass.; venīret: 3. Sg. Konj. Impf. Akt.; servārētur: 3. Sg. Konj. Impf. Pass.",
				criteria: [
					"Ich übersetze beide Sätze sinnvoll ins Deutsche.",
					"Ich bestimme Tempus, Modus und Aktiv/Passiv aller vier Konjunktivformen.",
					"Ich erkläre das Moduszeichen (-a- bzw. Infinitivstamm).",
				],
			},
			2: {
				language: "la",
				prompt: "Bilde zu ‚monēre‘ (mahnen) und ‚dūcere‘ (führen) jeweils die 3. Person Singular im Konjunktiv Präsens Aktiv, Konjunktiv Präsens Passiv, Konjunktiv Imperfekt Aktiv und Konjunktiv Imperfekt Passiv.",
				model: "monēre: moneat, moneātur, monēret, monērētur. dūcere: dūcat, dūcātur, dūceret, dūcerētur.",
				criteria: [
					"Ich verwende -a- im Konjunktiv Präsens beider Verben.",
					"Ich nutze den Infinitiv + Endung im Konjunktiv Imperfekt.",
					"Ich setze Aktiv- (-t) und Passivendungen (-tur) fehlerfrei.",
				],
			},
		},
		workshop: {
			kind: "mood",
			goals: [
				{
					label: "Konjunktiv Präsens der a-Konjugation",
					before: "rogāre → 3. Sg. Konj. Präs. Akt.:",
					after: "",
					options: ["roget", "rogat", "rogāret"],
					answer: "roget",
					explanation: "In der a-Konjugation ersetzt -e- das -a- im Konjunktiv Präsens.",
				},
				{
					label: "Konjunktiv Präsens der kons. Konjugation",
					before: "mittere → 3. Pl. Konj. Präs. Pass.:",
					after: "",
					options: ["mittantur", "mittentur", "mittuntur"],
					answer: "mittantur",
					explanation: "mittantur ist Konj. Präs. Pass. (mittentur ist Futur I Pass., mittuntur Ind. Präs. Pass.).",
				},
				{
					label: "Konjunktiv Imperfekt von esse",
					before: "esse → 3. Pl. Konj. Impf.:",
					after: "",
					options: ["essent", "sint", "erant"],
					answer: "essent",
					explanation: "Infinitiv esse + -nt ergibt essent.",
				},
			],
		},
	},
	{
		id: "l7-konjunktiv-perfekt",
		stage: "konjunktiv",
		title: "Konjunktiv Perfekt & Plusquamperfekt (Aktiv & Passiv)",
		skill: "Die beiden Vergangenheitskonjunktive im Aktiv und Passiv bilden und sicher von Futur II trennen",
		lehrplan: "L7 LB 2.2 · Formenlehre (Verben im Konjunktiv)",
		bindings: ["2.2-verben", "2.2-bestandteile", "2.2-bilden"],
		paragraphs: [
			"Auch im Perfektstamm bilden alle lateinischen Verben zwei Konjunktive ohne Ausnahme nach einer klaren Regel. Im Aktiv erhält der Konjunktiv Perfekt das Moduszeichen -eri- am Perfektstamm (laudāv-eri-m, laudāv-erī-s, laudāv-eri-t, laudāv-erī-mus, laudāv-erī-tis, laudāv-eri-nt). Der Konjunktiv Plusquamperfekt Aktiv ist genauso leicht wie der Konjunktiv Imperfekt: Du nimmst den Infinitiv Perfekt Aktiv (-isse) und hängst die Personalendungen an: laudāvissem, laudāvissēs, laudāvisset, laudāvissēmus, laudāvissētis, laudāvissent!",
			"Im Passiv kombinierst du — genau wie im Indikativ — das PPP in KNG-Kongruenz zum Subjekt mit dem Konjunktiv von esse: Konjunktiv Perfekt Passiv = PPP + sim, sīs, sit, sīmus, sītis, sint (urbs capta sit); Konjunktiv Plusquamperfekt Passiv = PPP + essem, essēs, esset, essēmus, essētis, essent (urbs capta esset). Achte beim Konjunktiv Perfekt Aktiv auf die Ähnlichkeit mit dem Futur II (laudāverit): Nur in der 1. Person Singular trennen sie sich direkt (Futur II laudāverō vs. Konj. Perf. laudāverim); in den anderen Personen zeigt dir der Satzbau (z. B. indirekte Frage oder cum), dass ein Konjunktiv vorliegt.",
		],
		diagram: {
			title: "Perfektstamm im Konjunktiv (Aktiv & Passiv)",
			subtitle: "Aktiv nutzt den Perfektstamm, Passiv kombiniert das PPP mit sim oder essem.",
			layout: "contrast",
			parts: [
				{
					tag: "Konj. Perfekt",
					title: "Perfektstamm + -eri- / PPP + sim",
					formula: "laudāverit · laudātus sit",
					note: "Steht in Nebensätzen für Vorzeitigkeit nach einem Haupttempus (Ich weiß nicht, wer den Brief geschrieben hat: scrīpserit).",
				},
				{
					tag: "Konj. Plusquamperfekt",
					title: "Inf. Perf. + Endung / PPP + essem",
					formula: "laudāvisset · laudātus esset",
					note: "Am Signal -isse- oder am PPP + essem sofort unverwechselbar! Wichtig für den Irrealis der Vergangenheit und die Vorzeitigkeit nach Nebentempus.",
				},
				{
					tag: "KNG im Passiv",
					title: "PPP richtet sich nach dem Subjekt",
					formula: "mīlitēs missī sint · urbs capta esset",
					note: "Wie im Indikativ Perfekt Passiv trägt das PPP Kasus (Nom.), Numerus und Genus des Subjekts.",
				},
			],
		},
		material:
			"Nescīmus, quis epistulam scrīpserit et cūr lēgātus ā senātū missus sit. Cum hostēs urbem cēpissent et templa dēlēta essent, cīvēs tamen spem nōn dēposuērunt.",
		materialLabel: "Übungstext · Konjunktiv Perfekt und Plusquamperfekt in Nebensätzen",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "la",
			question: "Welche Form ist die 3. Person Plural Konjunktiv Plusquamperfekt Passiv von ‚mittere‘ (Subjekt: lēgātī)?",
			answer: "missī essent",
			wrong: ["mīsissent", "missī sint"],
			explanation: "Konjunktiv Plusquamperfekt Passiv besteht aus PPP (missī, Nom. Pl. m.) + Konjunktiv Imperfekt von esse (essent).",
		},
		takeaway:
			"Konjunktiv Perfekt: Perfektstamm + -eri- (Aktiv) / PPP + sim (Passiv). Konjunktiv Plusquamperfekt: Infinitiv Perfekt + Endung (-issem, Aktiv) / PPP + essem (Passiv).",
		practice: [
			{
				prompt: "Bilde die 3. Person Singular Konjunktiv Plusquamperfekt Aktiv von capere (Perf. cēpī): ___",
				answers: ["cepisset", "cēpisset"],
				feedback: "Infinitiv Perfekt Aktiv cēpisse + -t ergibt cēpisset.",
			},
			{
				prompt: "Bilde die 3. Person Singular Konjunktiv Perfekt Passiv von dēlēre (Subjekt: urbs f.): ___",
				answers: ["deleta sit", "dēlēta sit"],
				feedback: "PPP (dēlēta, Nom. Sg. f.) + Konjunktiv Präsens von esse (sit) → dēlēta sit.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und bestimme Tempus, Modus und Genus Verbi von scrīpserit, missus sit, cēpissent und dēlēta essent.",
				model: "Wir wissen nicht, wer den Brief geschrieben hat und warum der Gesandte vom Senat geschickt worden ist. Obwohl (oder: Nachdem) die Feinde die Stadt eingenommen hatten und die Tempel zerstört worden waren, gaben die Bürger dennoch die Hoffnung nicht auf. scrīpserit: 3. Sg. Konj. Perf. Akt.; missus sit: 3. Sg. Konj. Perf. Pass.; cēpissent: 3. Pl. Konj. Plusq. Akt.; dēlēta essent: 3. Pl. Konj. Plusq. Pass.",
				criteria: [
					"Ich übersetze alle vier Vergangenheitskonjunktive im deutschen Indikativ zeitgerecht.",
					"Ich deute ‚cum … tamen‘ im zweiten Satz konzessiv (obwohl … dennoch).",
					"Ich bestimme alle vier Formen exakt nach Tempus, Modus und Genus Verbi.",
				],
			},
			2: {
				language: "la",
				prompt: "Wandle ‚mīlitēs urbem dēfendērunt‘ um in: 1. Konjunktiv Perfekt Aktiv, 2. Konjunktiv Plusquamperfekt Aktiv, 3. Konjunktiv Perfekt Passiv (mit Subjekt urbs), 4. Konjunktiv Plusquamperfekt Passiv (mit Subjekt urbs).",
				model: "1. mīlitēs urbem dēfenderint; 2. mīlitēs urbem dēfendissent; 3. urbs ā mīlitibus dēfēnsa sit; 4. urbs ā mīlitibus dēfēnsa esset.",
				criteria: [
					"Ich nutze den richtigen Perfektstamm dēfend- und das PPP dēfēnsa.",
					"Ich wähle -erint / -issent im Aktiv und sit / esset im Passiv.",
					"Ich setze mīlitēs beim Passiv korrekt in ā mīlitibus.",
				],
			},
		},
		workshop: {
			kind: "mood",
			goals: [
				{
					label: "Signal -isse- erkennen",
					before: "dīxissent ist →",
					after: "",
					options: ["3. Pl. Konj. Plusq. Akt.", "3. Pl. Konj. Perf. Akt.", "3. Pl. Konj. Impf. Akt."],
					answer: "3. Pl. Konj. Plusq. Akt.",
					explanation: "Infinitiv Perfekt dīxisse + -nt bildet den Konjunktiv Plusquamperfekt Aktiv.",
				},
				{
					label: "Konjunktiv Perfekt Passiv bilden",
					before: "dass die Gesetze bewahrt worden sind: lēgēs servātae",
					after: "",
					options: ["sint", "essent", "sunt"],
					answer: "sint",
					explanation: "Konjunktiv Perfekt Passiv = PPP + Konjunktiv Präsens von esse (sint).",
				},
				{
					label: "1. Sg. Konjunktiv Perfekt vs. Futur II",
					before: "1. Sg. Konjunktiv Perfekt Aktiv von vidēre (vīdī) →",
					after: "",
					options: ["vīderim", "vīderō", "vīdissem"],
					answer: "vīderim",
					explanation: "vīderim ist Konjunktiv Perfekt (vīderō ist Futur II, vīdissem Konjunktiv Plusquamperfekt).",
				},
			],
		},
	},
	{
		id: "l7-irrealis",
		stage: "konjunktiv",
		title: "Konjunktiv im Hauptsatz: Der Irrealis",
		skill: "Irrealis der Gegenwart und der Vergangenheit im Hauptsatz und in Bedingungsgefügen mit sī/nisi sicher übersetzen",
		lehrplan: "L7 LB 2.3 · Satzlehre (Modi im Hauptsatz)",
		bindings: ["2.3-modi", "2.3-sprachvergleich", "2.3-stil"],
		paragraphs: [
			"In Klasse 7 lernst du als erste Hauptsatzfunktion des Konjunktivs den Irrealis kennen (weitere Hauptsatzkonjunktive wie Hortativ, Jussiv oder Optativ folgen erst in Klasse 8). Der Irrealis stellt einen Sachverhalt vor, der in Wirklichkeit nicht zutrifft — oft als Bedingungsgefüge mit sī (wenn) oder nisi (wenn nicht), verneint mit nōn.",
			"Dabei gilt eine glasklare Zweiteilung der Tempora: Der Konjunktiv Imperfekt drückt den Irrealis der Gegenwart aus (Sī tacērēs, philosophus manērēs = Wenn du jetzt schwiegest / schweigen würdest, bliebest du ein Philosoph). Der Konjunktiv Plusquamperfekt drückt den Irrealis der Vergangenheit aus (Sī mīlitēs celerius vēnissent, urbs servāta esset = Wenn die Soldaten schneller gekommen wären, wäre die Stadt gerettet worden). Auch ohne sī-Satz kommt der Irrealis vor: Quis hoc crēderet? (Wer würde das glauben?).",
		],
		diagram: {
			title: "Irrealis der Gegenwart vs. Vergangenheit",
			subtitle: "Das Tempus des Konjunktivs zeigt dir exakt die Zeitstufe der Nichtwirklichkeit.",
			layout: "contrast",
			parts: [
				{
					tag: "Gegenwart",
					title: "Konjunktiv Imperfekt",
					formula: "Sī hoc scīrem, gaudērem.",
					note: "Übersetzung im deutschen Konjunktiv II der Gegenwart: ‚Wenn ich das wüsste, würde ich mich freuen‘ (in Wirklichkeit weiß ich es nicht).",
				},
				{
					tag: "Vergangenheit",
					title: "Konjunktiv Plusquamperfekt",
					formula: "Sī vēnissēs, tē vīdissem.",
					note: "Übersetzung im deutschen Konjunktiv II der Vergangenheit: ‚Wenn du gekommen wärest, hätte ich dich gesehen‘ (du bist aber nicht gekommen).",
				},
				{
					tag: "Verneinung & Signale",
					title: "sī · nisi · nōn",
					formula: "Nisi pāx esset, cīvēs nōn gaudērent.",
					note: "Der Irrealis wird stets mit nōn (niemals nē) verneint; ‚nisi‘ bedeutet ‚wenn nicht‘.",
				},
			],
		},
		material:
			"Sī Hannibal statim post pugnam ad Cannās Rōmam oppugnāvisset, fōrtasse urbs capta esset. Nisi cīvēs Rōmānī tantam cōnstantiam habuissent, rēs pūblica nōn servāta esset. Sī hodiē idem perīculum adesset, omnēs concordiam quaererēmus.",
		materialLabel: "Übungstext · Was wäre gewesen, wenn …? (Hannibal und Rom)",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Welches Tempus zeigt im Lateinischen den Irrealis der Gegenwart an?",
			answer: "Der Konjunktiv Imperfekt.",
			wrong: [
				"Der Konjunktiv Präsens.",
				"Der Konjunktiv Plusquamperfekt.",
			],
			explanation: "Merke die zeitliche Verschiebung: Konjunktiv Imperfekt = Irrealis der Gegenwart; Konjunktiv Plusquamperfekt = Irrealis der Vergangenheit.",
		},
		takeaway:
			"Irrealis der Gegenwart = Konjunktiv Imperfekt (wenn … wäre / würde); Irrealis der Vergangenheit = Konjunktiv Plusquamperfekt (wenn … gewesen wäre / hätte). Verneinung immer mit nōn (nisi = wenn nicht).",
		practice: [
			{
				prompt: "Welche Art von Irrealis liegt in ‚Sī hodiē perīculum adesset, concordiam quaererēmus‘ vor? (Irrealis der ___): ___",
				answers: ["Gegenwart"],
				feedback: "adesset und quaererēmus stehen im Konjunktiv Imperfekt → Irrealis der Gegenwart.",
			},
			{
				prompt: "Ergänze das lateinische Wort für ‚wenn nicht‘: ___ auxilium vēnisset, periissēmus.",
				answers: ["Nisi", "nisi"],
				feedback: "‚nisi‘ leitet einen verneinten Bedingungssatz ein (wenn nicht).",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und ordne jeden der drei Sätze dem Irrealis der Vergangenheit oder der Gegenwart zu.",
				model: "Wenn Hannibal sofort nach der Schlacht bei Cannae Rom angegriffen hätte, wäre die Stadt vielleicht eingenommen worden (Irrealis der Vergangenheit). Wenn die römischen Bürger nicht eine so große Standhaftigkeit besessen hätten, wäre der Staat nicht gerettet worden (Irrealis der Vergangenheit). Wenn heute dieselbe Gefahr bestünde, würden wir alle Eintracht suchen (Irrealis der Gegenwart).",
				criteria: [
					"Ich verwende im Deutschen den passenden Konjunktiv II (hätte/wäre bzw. bestünde/würden).",
					"Ich übersetze nisi mit ‚wenn nicht‘ und nōn korrekt.",
					"Ich ordne Gegenwart und Vergangenheit anhand der Konjunktivtempora richtig zu.",
				],
			},
			2: {
				language: "de",
				prompt: "Vergleiche ‚Sī pācem habēmus, gaudēmus‘ (Realis), ‚Sī pācem habērēmus, gaudērēmus‘ und ‚Sī pācem habuissēmus, gāvīsī essēmus‘ (bzw. ‚laetī fuissēmus‘). Übersetze alle drei und erkläre den Unterschied in Modus und Aussage.",
				model: "1. Wenn wir Frieden haben, freuen wir uns (Indikativ Präsens: Realis, wirklicher Fall). 2. Wenn wir Frieden hätten, würden wir uns freuen (Konjunktiv Imperfekt: Irrealis der Gegenwart, wir haben ihn gerade nicht). 3. Wenn wir Frieden gehabt hätten, wären wir froh gewesen (Konjunktiv Plusquamperfekt: Irrealis der Vergangenheit, es war damals nicht so).",
				criteria: [
					"Ich übersetze alle drei Bedingungsgefüge präzise.",
					"Ich benenne Indikativ, Konj. Imperfekt und Konj. Plusquamperfekt.",
					"Ich erkläre jeweils den Wirklichkeitsbezug.",
				],
			},
		},
		workshop: {
			kind: "mood",
			goals: [
				{
					label: "Irrealis der Gegenwart erkennen",
					before: "Sī pecūniam habērem, librum emerem →",
					after: "",
					options: ["Wenn ich Geld hätte, würde ich das Buch kaufen.", "Wenn ich Geld gehabt hätte, hätte ich das Buch gekauft.", "Wenn ich Geld habe, kaufe ich das Buch."],
					answer: "Wenn ich Geld hätte, würde ich das Buch kaufen.",
					explanation: "habērem / emerem sind Konjunktiv Imperfekt → Irrealis der Gegenwart.",
				},
				{
					label: "Irrealis der Vergangenheit vervollständigen",
					before: "Wenn wir gewarnt worden wären (monēre, 1. Pl. Konj. Plusq. Pass.): Sī monitī",
					after: "",
					options: ["essēmus", "sīmus", "erāmus"],
					answer: "essēmus",
					explanation: "Irrealis der Vergangenheit im Passiv verlangt PPP + Konj. Impf. von esse (essēmus).",
				},
				{
					label: "Verneinung im Irrealis wählen",
					before: "Ohne Hilfe wäre die Stadt nicht gerettet worden: Urbs",
					after: "servāta esset.",
					options: ["nōn", "nē", "num"],
					answer: "nōn",
					explanation: "Der Irrealis wird stets mit nōn verneint.",
				},
			],
		},
	},
	{
		id: "l7-ut-ne-cum",
		stage: "konjunktiv",
		title: "Subjunktionen mit Indikativ & Konjunktiv: ut, nē, cum",
		skill: "Finale und konsekutive Nebensätze sowie cum mit Indikativ und Konjunktiv anhand von Signalwörtern treffend übersetzen",
		lehrplan: "L7 LB 2.3 · Satzlehre (Nebensätze)",
		bindings: ["2.3-nebensaetze", "2.3-modi", "2.3-strukturen"],
		paragraphs: [
			"Die zwei häufigsten Subjunktionen im Lateinischen — ut und cum — wechseln ihre Bedeutung je nachdem, ob im Nebensatz Indikativ oder Konjunktiv steht! Mit Indikativ bedeutet ut ‚wie‘ oder ‚sobald‘ (ut cōnsul dīxit = wie der Konsul sagte). Mit Konjunktiv hat ut zwei zentrale Sinnrichtungen: 1. Final (Absicht: ‚damit‘, ‚um zu‘; Verneinung nē = ‚damit nicht‘): Mīlitēs pugnant, ut urbem servent / nē urbs capiātur. 2. Konsekutiv (Folge: ‚so dass‘; Verneinung ut nōn = ‚so dass nicht‘), fast immer angekündigt durch ein Signalwort im Hauptsatz wie tam (so), tantus (so groß), ita/sīc (so) oder tot (so viele): Perīculum tantum erat, ut cīvēs timerent.",
			"Genauso planvoll entschlüsselst du cum: Mit Indikativ ist es rein zeitlich (cum temporale = ‚wenn‘, ‚als‘, ‚sooft‘). Mit Konjunktiv gibt es drei klassische Sinnrichtungen: cum narrātīvum (erzählend: ‚als‘ beim Konj. Impf., ‚nachdem‘ beim Konj. Plusq.), cum causāle (begründend: ‚weil‘, ‚da‘) und cum concessīvum (einräumend: ‚obwohl‘, oft mit dem Signalwort tamen = ‚dennoch‘ im Hauptsatz). Wichtige Übersetzungsregel: Den lateinischen Konjunktiv nach ut, nē und cum gibst du im Deutschen fast immer im Indikativ wieder!",
		],
		diagram: {
			title: "Entscheidungsbaum für ut/nē und cum",
			subtitle: "Prüfe zuerst den Modus (Indikativ vs. Konjunktiv) und dann die Signalwörter im Hauptsatz.",
			layout: "triptych",
			parts: [
				{
					tag: "ut / nē (final)",
					title: "Absicht: damit / damit nicht",
					formula: "ut + Konj. · Verneinung: nē",
					note: "Nach Verben des Bittens, Befehlens, Ermahnens auch als Begehrsatz (‚dass … soll‘ / Infinitiv mit ‚zu‘).",
				},
				{
					tag: "ut / ut nōn (konsek.)",
					title: "Folge: so dass / so dass nicht",
					formula: "tam / tantus / ita … ut + Konj.",
					note: "Signalwörter wie tam, tantus, ita oder tot im Hauptsatz zeigen fast immer einen Konsekutivsatz an.",
				},
				{
					tag: "cum + Ind. / Konj.",
					title: "Indikativ: als/wenn · Konj.: 3 Sinne",
					formula: "cum + Konj. → als/nachdem · weil · obwohl",
					note: "Steht im Hauptsatz ‚tamen‘ (dennoch), ist cum + Konjunktiv sicher konzessiv (obwohl).",
				},
			],
		},
		material:
			"Cōnsul mīlitēs hortātus est, ut fortiter pugnārent nē hostēs castra caperent. Impetus Rōmānōrum tam ācer erat, ut inimīcī statim fugerent. Cum nox adesset, dux tamen vigiliās posuit; ut enim semper dīcēbat, cūra salūtem affert.",
		materialLabel: "Übungstext · Finales ut/nē, konsekutives ut, konzessives cum und ut + Indikativ",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Woran erkennst du im Satz ‚Impetus tam ācer erat, ut inimīcī fugerent‘ sofort den Konsekutivsatz?",
			answer: "Am Signalwort ‚tam‘ (so) im Hauptsatz in Verbindung mit ‚ut + Konjunktiv‘.",
			wrong: [
				"Am Indikativ im Nebensatz.",
				"An der Verneinung ‚nē‘.",
			],
			explanation: "tam (so), tantus (so groß), ita/sīc (so) kündigen einen Konsekutivsatz (Folgesatz: so …, dass) mit ut + Konjunktiv an.",
		},
		takeaway:
			"ut + Indikativ = wie/sobald; ut + Konjunktiv = final (damit; verneint nē) oder konsekutiv nach tam/tantus/ita (so dass; verneint ut nōn). cum + Indikativ = wenn/als; cum + Konjunktiv = als/nachdem, weil oder obwohl (oft mit tamen).",
		practice: [
			{
				prompt: "Mit welchem Wort wird ein finaler Nebensatz verneint (‚damit nicht‘)? ___",
				answers: ["ne", "nē"],
				feedback: "Finale Nebensätze werden mit nē (damit nicht), konsekutive mit ut nōn (so dass nicht) verneint.",
			},
			{
				prompt: "Welche Sinnrichtung von ‚cum + Konjunktiv‘ kündigt das Signalwort ‚tamen‘ (dennoch) im Hauptsatz an? (ein Wort): ___",
				answers: ["konzessiv", "Konzessiv", "obwohl"],
				feedback: "cum … tamen drückt einen Gegensatz aus: konzessiv (obwohl … dennoch).",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den gesamten Übungstext ins Deutsche und bestimme alle vier Nebensätze (ut … pugnārent, nē … caperent, ut … fugerent, Cum … adesset, ut … dīcēbat).",
				model: "Der Konsul ermutigte die Soldaten, tapfer zu kämpfen (damit sie tapfer kämpften), damit die Feinde das Lager nicht einnähmen. Der Angriff der Römer war so heftig, dass die Gegner sofort flohen. Obwohl die Nacht da war, stellte der Anführer dennoch Wachen auf; denn wie er immer sagte, bringt Sorgfalt Rettung. 1. ut/nē: final; 2. tam … ut: konsekutiv; 3. cum … tamen: konzessiv; 4. ut + Ind. dīcēbat: vergleichend (wie).",
				criteria: [
					"Ich übersetze alle fünf Nebensätze sinn- und modusgerecht ins Deutsche.",
					"Ich unterscheide finales ut/nē, konsekutives tam … ut und ut + Indikativ sauber.",
					"Ich erkenne cum … tamen als konzessiv.",
				],
			},
			2: {
				language: "de",
				prompt: "Erkläre den Bedeutungsunterschied zwischen ‚Mīlitēs tam fessī erant, ut nōn pugnārent‘ und ‚Mīlitēs fūgērunt, nē pugnārent‘. Warum steht einmal ‚ut nōn‘ und einmal ‚nē‘?",
				model: "1. Die Soldaten waren so müde, dass sie nicht kämpften (Konsekutivsatz mit Signalwort tam → tatsächliche Folge, daher ut nōn). 2. Die Soldaten flohen, damit sie nicht kämpfen mussten (Finalsatz → Absicht/Zweck, daher nē).",
				criteria: [
					"Ich übersetze beide Sätze exakt.",
					"Ich ordne ut nōn dem Konsekutivsatz und nē dem Finalsatz zu.",
					"Ich benenne den Unterschied zwischen Folge und Absicht.",
				],
			},
		},
		workshop: {
			kind: "mood",
			goals: [
				{
					label: "Verneinten Konsekutivsatz bilden",
					before: "Nox tam obscūra erat, ___ viam vidērēmus.",
					after: "",
					options: ["ut nōn", "nē", "num"],
					answer: "ut nōn",
					explanation: "Nach tam (konsekutiv) lautet die Verneinung ‚ut nōn‘ (so dass nicht).",
				},
				{
					label: "ut + Indikativ richtig übersetzen",
					before: "Ut rēx iussit, mīlitēs fēcērunt →",
					after: "",
					options: ["Wie der König befohlen hatte", "Damit der König befahl", "So dass der König befahl"],
					answer: "Wie der König befohlen hatte",
					explanation: "iussit steht im Indikativ → ut bedeutet ‚wie‘.",
				},
				{
					label: "cum narrativum mit Konj. Plusq. übersetzen",
					before: "Cum cōnsul urbem servāvisset, cīvēs gaudēbant →",
					after: "",
					options: ["Nachdem der Konsul die Stadt gerettet hatte", "Während der Konsul die Stadt rettet", "Damit der Konsul die Stadt rette"],
					answer: "Nachdem der Konsul die Stadt gerettet hatte",
					explanation: "cum + Konjunktiv Plusquamperfekt zeigt Vorzeitigkeit → ‚nachdem‘ + Plusquamperfekt.",
				},
			],
		},
	},
	{
		id: "l7-indirekte-fragen",
		stage: "konjunktiv",
		title: "Indirekte Fragesätze & Consecutio temporum",
		skill: "Indirekte Fragesätze am Fragewort und Konjunktiv erkennen und die Zeitenfolge (consecutio temporum) sicher anwenden",
		lehrplan: "L7 LB 2.3 · Satzlehre (Modi & Consecutio temporum)",
		bindings: ["2.3-modi", "2.3-nebensaetze", "2.3-strukturen", "2.3-sprachvergleich"],
		paragraphs: [
			"Eine direkte Frage steht selbstständig im Indikativ: Cūr tū rīdēs? (Warum lachst du?). Hängt die Frage von einem übergeordneten Verb des Fragens, Wissens, Sagens oder Prüfens ab (rogāre, quaerere, scīre, nescīre, vidēre), entsteht ein indirekter Fragesatz — und der steht im Lateinischen ausnahmslos im Konjunktiv: Rogō, cūr rīdeās (Ich frage, warum du lachst). Typische Einleiter sind Fragepronomina (quis, quid, quī), Frageadverbien (cūr, ubi, quandō, quōmodo) und bei Ja/Nein-Fragen die Partikeln -ne oder num (beide heißen im indirekten Fragesatz einfach ‚ob‘!).",
			"Welcher der vier Konjunktive im Nebensatz steht, regelt die Consecutio temporum (Zeitenfolge). Sie hängt nur von zwei Fragen ab: 1. Steht das übergeordnete Verb im Haupttempus (Präsens, Futur I/II) oder im Nebentempus (Imperfekt, Perfekt, Plusquamperfekt)? 2. Geschieht der Nebensatz gleichzeitig oder vorzeitig? Nach Haupttempus steht Konjunktiv Präsens (gleichzeitig) oder Konjunktiv Perfekt (vorzeitig). Nach Nebentempus steht Konjunktiv Imperfekt (gleichzeitig) oder Konjunktiv Plusquamperfekt (vorzeitig). Merke: Im Deutschen übersetzt du indirekte Fragesätze meistens ganz natürlich im Indikativ!",
		],
		diagram: {
			title: "Die Regel der Consecutio temporum",
			subtitle: "Zwei Entscheidungen führen dich ohne Raten zum exakten Konjunktiv.",
			layout: "flow",
			parts: [
				{
					tag: "1 · Hauptsatz",
					title: "Haupttempus vs. Nebentempus",
					formula: "Präs./Fut. vs. Impf./Perf./Plusq.",
					note: "Prüfe zuerst das Tempus des einleitenden Verbs (z. B. rogō = Haupttempus, rogāvī = Nebentempus).",
				},
				{
					tag: "2 · Zeitverhältnis",
					title: "Gleichzeitig vs. Vorzeitig",
					formula: "HT: Präs./Perf. · NT: Impf./Plusq.",
					note: "Nach Haupttempus: Konj. Präs. (glz.) / Konj. Perf. (vorz.). Nach Nebentempus: Konj. Impf. (glz.) / Konj. Plusq. (vorz.).",
				},
				{
					tag: "3 · Fragewort",
					title: "W-Frage oder ‚ob‘ (-ne / num)",
					formula: "Rogō, num veniās = Ich frage, ob du kommst",
					note: "Im direkten Fragesatz heißt num ‚etwa?‘, im indirekten Fragesatz bedeutet num neutral ‚ob‘!",
				},
			],
		},
		material:
			"Senātus quaerit, ubi Hannibal sit et quās urbēs iam cēperit. Cōnsul lēgātōs rogāvit, num sociī auxilium ferrent et cūr nūntius tam sērō missus esset.",
		materialLabel: "Übungstext · Indirekte Fragen nach Haupt- und Nebentempus",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Welcher Konjunktiv steht nach einem Nebentempus (z. B. rogāvī) bei Vorzeitigkeit gemäß der Consecutio temporum?",
			answer: "Der Konjunktiv Plusquamperfekt.",
			wrong: [
				"Der Konjunktiv Perfekt.",
				"Der Konjunktiv Imperfekt.",
			],
			explanation: "Nach einem Nebentempus drückt Konjunktiv Imperfekt Gleichzeitigkeit und Konjunktiv Plusquamperfekt Vorzeitigkeit aus.",
		},
		takeaway:
			"Indirekte Fragesätze stehen im Lateinischen immer im Konjunktiv (-ne / num = ob). Consecutio temporum: Haupttempus → Konj. Präs. (glz.) / Konj. Perf. (vorz.); Nebentempus → Konj. Impf. (glz.) / Konj. Plusq. (vorz.).",
		practice: [
			{
				prompt: "Wie übersetzt man ‚num‘ als Einleiter eines indirekten Fragesatzes (z. B. rogāvit, num venīrēs)? (ein Wort): ___",
				answers: ["ob"],
				feedback: "In indirekten Fragesätzen bedeutet num neutral ‚ob‘.",
			},
			{
				prompt: "Ergänze nach Haupttempus bei Vorzeitigkeit (‚Ich weiß nicht, wer den Brief geschrieben hat‘): Nesciō, quis epistulam ___. (scrībere → scrīpsī)",
				answers: ["scripserit", "scrīpserit"],
				feedback: "Haupttempus (nesciō) + Vorzeitigkeit verlangt Konjunktiv Perfekt: scrīpserit.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und erkläre bei allen vier Nebensatzverben (sit, cēperit, ferrent, missus esset) die Consecutio temporum.",
				model: "Der Senat fragt, wo Hannibal ist (sit: HT + glz. → Konj. Präs.) und welche Städte er schon eingenommen hat (cēperit: HT + vorz. → Konj. Perf.). Der Konsul fragte die Gesandten, ob die Bundesgenossen Hilfe brachten (ferrent: NT + glz. → Konj. Impf.) und warum der Bote so spät geschickt worden war (missus esset: NT + vorz. → Konj. Plusq. Pass.).",
				criteria: [
					"Ich übersetze alle vier indirekten Fragen zeitlich korrekt ins Deutsche.",
					"Ich gebe num mit ‚ob‘ wieder.",
					"Ich begründe alle vier Konjunktive mit Haupt-/Nebentempus und Zeitverhältnis.",
				],
			},
			2: {
				language: "la",
				prompt: "Setze den Satz ‚Rogō, cūr cīvēs timeant et quid mīlitēs fēcerint‘ in die Vergangenheit (Hauptsatz ‚Rogāvī‘) und übersetze die entstandene Fassung ins Deutsche.",
				model: "Rogāvī, cūr cīvēs timērent et quid mīlitēs fēcissent. Übersetzung: Ich fragte, warum die Bürger Angst hatten (fürchteten) und was die Soldaten getan hatten.",
				criteria: [
					"Ich verwandle timeant (Konj. Präs.) in timērent (Konj. Impf.).",
					"Ich verwandle fēcerint (Konj. Perf.) in fēcissent (Konj. Plusq.).",
					"Ich übersetze die Vergangenheitsfassung zeitlich exakt ins Deutsche.",
				],
			},
		},
		workshop: {
			kind: "mood",
			liveModel: "consecutio",
			goals: [
				{
					label: "Haupttempus + Gleichzeitigkeit",
					before: "Sciō, quid cōnsul (facere, 3. Sg.) →",
					after: "",
					options: ["faciat", "faceret", "fēcerit"],
					answer: "faciat",
					explanation: "sciō (Haupttempus) + gleichzeitig verlangt Konjunktiv Präsens: faciat.",
				},
				{
					label: "Nebentempus + Gleichzeitigkeit",
					before: "Scībam, quid cōnsul (facere, 3. Sg.) →",
					after: "",
					options: ["faceret", "faciat", "fēcisset"],
					answer: "faceret",
					explanation: "scībam (Nebentempus) + gleichzeitig verlangt Konjunktiv Imperfekt: faceret.",
				},
				{
					label: "Nebentempus + Vorzeitigkeit (Passiv)",
					before: "Rogāvī, cūr urbs (capere, 3. Sg. Pass.) →",
					after: "",
					options: ["capta esset", "capta sit", "caperētur"],
					answer: "capta esset",
					explanation: "rogāvī (Nebentempus) + vorzeitig im Passiv verlangt Konjunktiv Plusquamperfekt Passiv: capta esset.",
				},
			],
		},
	},
];
