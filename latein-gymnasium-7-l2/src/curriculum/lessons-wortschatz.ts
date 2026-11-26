import type { Lesson } from "../types";

export const LESSONS_WORTSCHATZ: Lesson[] = [
	{
		id: "l7-kontext-polysemie",
		stage: "wortschatz",
		title: "Mehrdeutige Wörter & Kontext erschließen",
		skill: "Kontextspezifische Bedeutungen mehrdeutiger Wörter wählen und feste Wendungen wörtlich wie übertragen übersetzen",
		lehrplan: "L7 LB 2.1 · Wortschatz (Kontext & Wendungen)",
		bindings: ["2.1-grundwortschatz", "2.1-polysemie", "2.1-wendungen"],
		paragraphs: [
			"Bis zum Ende der 7. Klasse wächst dein Grundwortschatz auf rund 900 lateinische Wörter plus Kulturwortschatz. Viele häufige Wörter — etwa rēs (Sache, Lage, Tat, Staat), ratiō (Vernunft, Grund, Plan, Berechnung), signum (Zeichen, Feldzeichen, Statue), fidēs (Treue, Vertrauen, Schutz, Glaubwürdigkeit) oder agere (treiben, handeln, verhandeln, verbringen) — sind mehrdeutig (polysem). Eine mechanische Wort-für-Wort-Übersetzung führt hier oft in die Irre: Erst die Nachbarwörter und das Thema des Textes legen fest, welche Bedeutung passt.",
			"Dasselbe gilt für feste lateinische Wendungen (Phraseologismen): ‚grātiās agere‘ heißt wörtlich ‚Dank betreiben‘, im guten Deutsch aber ‚danken‘; ‚castra pōnere‘ heißt wörtlich ‚das Lager setzen‘, idiomatisch ‚ein Lager aufschlagen‘; ‚cōnsilium capere‘ heißt ‚einen Entschluss fassen‘; ‚operam dare‘ bedeutet ‚sich Mühe geben‘; ‚fidem servāre‘ heißt ‚Wort halten / die Treue bewahren‘. Wenn du zuerst die wörtliche Vorstellung kennst und sie dann in natürliches Deutsch überträgst, behältst du Wendungen dauerhaft.",
		],
		diagram: {
			title: "Vom mehrdeutigen Wort zur treffenden Übersetzung",
			subtitle: "Prüfe das Grundbild, die Nachbarwörter und die deutsche Zielformulierung.",
			layout: "flow",
			parts: [
				{
					tag: "1 · Grundbild",
					title: "Kernbedeutung abrufen",
					formula: "signum · ratiō · agere",
					note: "Jedes mehrdeutige Wort hat eine anschauliche Grundvorstellung (z. B. signum = Zeichen/Merkmal).",
				},
				{
					tag: "2 · Kontext",
					title: "Thema & Partnerwörter prüfen",
					formula: "signum dare (Militär) vs. signum deī (Kunst)",
					note: "Im Feldlager ist signum das Feldzeichen oder Angriffssignal, im Tempel dagegen eine Götterstatue.",
				},
				{
					tag: "3 · Idiomatik",
					title: "Wörtlich → gutes Deutsch",
					formula: "grātiās agere → danken",
					note: "Feste Verbindungen übersetzt du als geschlossene deutsche Wendung (z. B. castra pōnere = ein Lager aufschlagen).",
				},
			],
		},
		material:
			"Cōnsul mīlitibus signum dedit, ut castra pōnerent. In templō autem cīvēs signum deae admīrābantur. Dux bonā ratiōne cōnsilium cēpit, vītam cīvium servāvit et deīs grātiās ēgit.",
		materialLabel: "Übungstext · Polysemie von signum und feste Wendungen",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Welche Bedeutung passt zu ‚signum‘ im Satz ‚In templō cīvēs signum deae admīrābantur‘?",
			answer: "Die Statue / das Standbild der Göttin.",
			wrong: [
				"Das Angriffssignal der Göttin.",
				"Das Feldzeichen der Legion.",
			],
			explanation: "Der Kontext ‚in templō‘ und ‚admīrābantur‘ (sie bewunderten) weist eindeutig auf eine Götterstatue hin.",
		},
		takeaway:
			"Mehrdeutige Wörter (rēs, ratiō, signum, fidēs, agere) erschließt du aus ihren Nachbarwörtern und dem Textthema. Feste Wendungen wie castra pōnere oder grātiās agere übersetzt du idiomatisch ins Deutsche.",
		practice: [
			{
				prompt: "Wie übersetzt man ‚castra pōnere‘ in angemessenem Deutsch? (ein Lager ___): ___",
				answers: ["aufschlagen"],
				feedback: "castra pōnere = ein Lager aufschlagen (wörtlich: das Lager setzen).",
			},
			{
				prompt: "Wie übersetzt man ‚cōnsilium capere‘ idiomatisch? (einen Entschluss/Plan ___): ___",
				answers: ["fassen"],
				feedback: "cōnsilium capere = einen Entschluss oder Plan fassen.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und erläutere den Bedeutungswechsel von ‚signum‘ im ersten und zweiten Satz.",
				model: "Der Konsul gab den Soldaten das Zeichen, ein Lager aufzuschlagen. Im Tempel aber bewunderten die Bürger die Statue der Göttin. Der Feldherr fasste mit guter Überlegung (Vernunft) einen Entschluss, rettete das Leben der Bürger und dankte den Göttern. Im ersten Satz bedeutet signum militärisch ‚Signal/Befehl‘, im zweiten Satz im Tempel ‚Standbild/Statue‘.",
				criteria: [
					"Ich übersetze signum kontextgerecht unterschiedlich.",
					"Ich gebe castra pōnere, cōnsilium capere und grātiās agere idiomatisch wieder.",
					"Ich begründe den Bedeutungswechsel mit den Nachbarwörtern.",
				],
			},
			2: {
				language: "de",
				prompt: "Erkläre wörtliche und übertragene Bedeutung der drei Wendungen ‚fidem servāre‘, ‚operam dare‘ und ‚vītam agere‘ und bilde zu jeder einen kurzen deutschen Beispielsatz.",
				model: "fidem servāre: wörtl. ‚die Treue bewahren‘ → ‚sein Wort halten‘ (Der Freund hielt in der Not sein Wort). operam dare: wörtl. ‚Mühe geben‘ → ‚sich anstrengen / sich Mühe geben‘ (Wir geben uns beim Übersetzen Mühe). vītam agere: wörtl. ‚das Leben treiben‘ → ‚ein Leben führen‘ (Diogenes führte ein einfaches Leben).",
				criteria: [
					"Ich unterscheide jeweils wörtliche und übertragene Übersetzung.",
					"Ich gebe für alle drei Wendungen angemessenes Deutsch an.",
					"Ich formuliere drei passende Beispielsätze.",
				],
			},
		},
		workshop: {
			kind: "vocab",
			goals: [
				{
					label: "Kontextbedeutung von agere wählen",
					before: "cum lēgātīs dē pāce agere →",
					after: "",
					options: ["über den Frieden verhandeln", "den Frieden wegtreiben", "den Frieden ertragen"],
					answer: "über den Frieden verhandeln",
					explanation: "Mit Gesandten (cum lēgātīs dē …) bedeutet agere ‚verhandeln‘.",
				},
				{
					label: "Kontextbedeutung von fidēs wählen",
					before: "fidem alicuī habēre →",
					after: "",
					options: ["jemandem Vertrauen schenken", "jemanden beschützen", "jemandem ein Versprechen abnehmen"],
					answer: "jemandem Vertrauen schenken",
					explanation: "fidem habēre + Dativ heißt ‚Vertrauen haben zu / jemandem glauben‘.",
				},
				{
					label: "Kontextbedeutung von ratiō wählen",
					before: "hāc ratiōne (in einer Erklärung) →",
					after: "",
					options: ["auf diese Weise / aus diesem Grund", "mit dieser Rechnung", "mit diesem Heer"],
					answer: "auf diese Weise / aus diesem Grund",
					explanation: "ratiō bedeutet im Zusammenhang von Argumentation und Methode ‚Grund, Art und Weise, Überlegung‘.",
				},
			],
		},
	},
	{
		id: "l7-wortbildung",
		stage: "wortschatz",
		title: "Wortbildung: Präfixe, Suffixe & Wortfamilien",
		skill: "Unbekannte Wörter über Präfixe, Suffixe, Wortfamilien und Sachfelder systematisch erschließen",
		lehrplan: "L7 LB 2.1 · Wortschatz (Wortbildung & Wortfelder)",
		bindings: ["2.1-ordnung", "2.1-wortbildung", "2.1-erschliessen"],
		paragraphs: [
			"Statt jedes neue Wort isoliert zu pauken, nutzt du in Klasse 7 die lateinische Wortbildungslehre wie einen Baukasten. Verben bilden mit Vorsilben (Präfixen) ganze Familien von Komposita — oft mit Lautangleichung (Assimilation): Aus ad + ferre wird afferre (herbeibringen), aus ab + ferre wird auferre (wegtragen), aus con + ferre wird cōnferre (zusammentragen, vergleichen), aus re + ferre wird referre (zurückbringen, berichten), aus prae + ferre wird praeferre (vorziehen). Wer die 8 wichtigsten Präfixe kennt (ad-, ab-, con-, dē-, ex-, in-, prae-, re-), erschließt Dutzende unbekannte Verben sofort!",
			"Genauso planvoll wirken Nachsilben (Suffixe) bei Substantiven und Adjektiven: -tor / -trix bezeichnet handelnde Personen (vincere → victor = Sieger; dēfendere → dēfēnsor = Verteidiger), -tās / -tūdō bildet abstrakte Eigenschaften (līber → lībertās = Freiheit; magnus → magnitūdō = Größe), -bilis drückt eine Möglichkeit aus (laudāre → laudābilis = lobenswert). Außerdem ordnest du Wörter nach Wortfamilien (gleicher Stamm: cīvis, cīvitās, cīvīlis) und Sachfeldern (gleiches Thema, z. B. Militär: exercitus, castra, proelium, signum, mīles).",
		],
		diagram: {
			title: "Der lateinische Wortbildungs-Baukasten",
			subtitle: "Zerlege unbekannte Wörter in Präfix, Wortstamm und Suffix.",
			layout: "flow",
			parts: [
				{
					tag: "Präfix (Vorne)",
					title: "Richtung oder Verstärkung",
					formula: "ad- · ab- · con- · dē- · ex- · re-",
					note: "ad- (heran), ab- (weg), con- (zusammen), dē- (herab), ex- (heraus), re- (zurück/wieder). Achte auf Angleichung: ad+ferre → afferre.",
				},
				{
					tag: "Wortstamm (Mitte)",
					title: "Kernbedeutung & Wortfamilie",
					formula: "dūc- · fer- · cīv- · līber-",
					note: "Alle Wörter derselben Wortfamilie teilen einen Stamm (dūcere, dux, ēdūcere, redūcere).",
				},
				{
					tag: "Suffix (Hinten)",
					title: "Wortart & Funktion",
					formula: "-tor (Person) · -tās (Eigenschaft) · -bilis",
					note: "Aus dem Verb ‚servāre‘ wird der ‚servātor‘ (Retter); aus ‚cīvis‘ wird ‚cīvitās‘ (Bürgerschaft/Staat).",
				},
			],
		},
		material:
			"Victor ā cīvibus laudātur, quia pācem et lībertātem cīvitātī attulit. Lēgātī dē proeliō ad senātum rettulērunt et virtūtem dēfēnsōrum praedicāvērunt. Factum eius vērē laudābile erat.",
		materialLabel: "Übungstext · Wortbildung und Komposita im Kontext",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Welche Bedeutung erschließt du aus den Bestandteilen von ‚in-crēd-i-bilis‘ (in- = un-, crēdere = glauben, -bilis = -bar)?",
			answer: "Unglaublich (nicht glaubbar).",
			wrong: [
				"Sehr gläubig.",
				"Ein Gläubiger.",
			],
			explanation: "Präfix in- (Verneinung bei Adjektiven) + Stamm crēd- (glauben) + Suffix -bilis (-bar) = unglaublich.",
		},
		takeaway:
			"Zerlege unbekannte Wörter in Präfix (Richtung/Verneinung), Stamm (Wortfamilie) und Suffix (-tor Person, -tās Eigenschaft, -bilis Möglichkeit) und prüfe deine Vermutung am Kontext.",
		practice: [
			{
				prompt: "Aus welchen zwei Teilen besteht ‚afferre‘ (herbeibringen)? (Präfix + Grundverb, z. B. ab + ferre): ___",
				answers: ["ad + ferre", "ad+ferre"],
				feedback: "ad + ferre gleicht das d an das f an (Assimilation) → afferre.",
			},
			{
				prompt: "Welches deutsche Substantiv erschließt du aus ‚līber‘ (frei) + Suffix ‚-tās‘ (lībertās)? ___",
				answers: ["Freiheit", "die Freiheit"],
				feedback: "Das Suffix -tās bildet feminine Abstrakta für Eigenschaften: lībertās = die Freiheit.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Übersetze den Übungstext ins Deutsche und zerlege die vier Wörter ‚victor‘, ‚lībertātem‘, ‚attulit‘ und ‚laudābile‘ in ihre Wortbildungsbestandteile.",
				model: "Der Sieger wird von den Bürgern gelobt, weil er der Bürgerschaft (dem Staat) Frieden und Freiheit gebracht hat. Die Gesandten berichteten dem Senat über die Schlacht und rühmten die Tapferkeit der Verteidiger. Seine Tat war wirklich lobenswert. Zerlegung: vic-tor (vincere + -tor), līber-tās (līber + -tās), at-tulit (ad + ferre, Perf. tulit), laudā-bile (laudāre + -bilis).",
				criteria: [
					"Ich übersetze alle drei Sätze korrekt ins Deutsche.",
					"Ich zerlege alle vier Wörter genau in Stamm und Präfix/Suffix.",
					"Ich erkenne die Perfektformen attulit (afferre) und rettulērunt (referre).",
				],
			},
			2: {
				language: "de",
				prompt: "Ordne diese acht Wörter in zwei Gruppen — einmal eine Wortfamilie und einmal ein Sachfeld — und begründe deine Zuordnung: cīvis, exercitus, cīvitās, castra, cīvīlis, mīles, proelium, cīvicus.",
				model: "Wortfamilie ‚cīvis‘ (gleicher Wortstamm cīv-): cīvis (Bürger), cīvitās (Bürgerschaft/Staat), cīvīlis (bürgerlich), cīvicus (Bürger-). Sachfeld ‚Militär/Krieg‘ (unterschiedliche Stämme, gemeinsamer Lebensbereich): exercitus (Heer), castra (Lager), mīles (Soldat), proelium (Schlacht).",
				criteria: [
					"Ich trenne Wortfamilie (gleicher Stamm) und Sachfeld (gemeinsames Thema) sauber.",
					"Ich ordne alle acht Wörter richtig zu.",
					"Ich begründe das Ordnungskriterium nachvollziehbar.",
				],
			},
		},
		workshop: {
			kind: "vocab",
			goals: [
				{
					label: "Kompositum von ferre erschließen",
					before: "ab + ferre (wegtragen) →",
					after: "",
					options: ["auferre", "afferre", "cōnferre"],
					answer: "auferre",
					explanation: "ab- wird vor f zu au-: auferre (wegtragen, rauben).",
				},
				{
					label: "Suffix für Handelnde erkennen",
					before: "dēfendere → der Verteidiger:",
					after: "",
					options: ["dēfēnsor", "dēfēnsiō", "dēfēnsus"],
					answer: "dēfēnsor",
					explanation: "Die Endung -tor/-sor bezeichnet die handelnde Person (dēfēnsor = Verteidiger).",
				},
				{
					label: "Wortfamilie von Wortfeld abgrenzen",
					before: "dūcere, dux, ēdūcere, redūcere bilden eine →",
					after: "",
					options: ["Wortfamilie", "Konjugation", "Deklination"],
					answer: "Wortfamilie",
					explanation: "Wörter mit demselben Wortstamm (dūc-/duc-) gehören zu einer Wortfamilie.",
				},
			],
		},
	},
	{
		id: "l7-aussprache-betonung",
		stage: "wortschatz",
		title: "Quantitäten, Betonung & verständnisgeleitetes Vortragen",
		skill: "Vokallängen (Naturlänge und Positionslänge) beachten, das Pänultimagesetz anwenden und Texte sinngestaltend vortragen",
		lehrplan: "L7 LB 2.1 & 1 · Aussprache, Betonung & Textvortrag",
		bindings: ["2.1-aussprache", "1-vortragen"],
		readingAloud: true,
		paragraphs: [
			"Latein klingt lebendig und wird sofort verständlicher, wenn du Wörter quantitätsgerecht (mit langen und kurzen Silben) und richtig betont aussprichst. Dafür gilt im Lateinischen eine einzige, extrem verlässliche Regel für Wörter ab drei Silben — das Pänultimagesetz: Ist die vorletzte Silbe (die Paenultima) lang, trägt sie den Ton (im-pe-RĀ-tor, Car-THĀ-gō). Ist die vorletzte Silbe kurz, wandert der Ton auf die drittletzte Silbe, die Antepaenultima (MĪ-li-tēs, dī-VI-de-re, prō-VIN-ci-a). Zweisilbige Wörter werden immer auf der ersten Silbe betont (RŌ-ma, PĀ-cem).",
			"Wann ist eine Silbe lang? Es gibt zwei Gründe: 1. Naturlänge — ein von Natur aus langer Vokal (im Lernbuch oft mit Balken/Makron markiert, z. B. rēgīna, imperātor) oder ein Diphthong (ae, au, oe). 2. Positionslänge — auf einen kurzen Vokal folgen zwei oder mehr Konsonanten (oder x/z), wie in ma-GIS-ter (-st-) oder ex-er-CI-tus hat dagegen nur ein t vor -us, aber i ist kurz → ex-ER-ci-tus! Beachte auch, dass Längen Bedeutungen trennen: ‚venit‘ (er kommt, kurzes e) vs. ‚vēnit‘ (er kam, langes ē); ‚populus‘ (Volk) vs. ‚pōpulus‘ (Pappel). Beim lauten Vortragen gliederst du Sätze außerdem nach Sinnabschnitten und Pausen — das stärkt auch dein Textverständnis.",
		],
		diagram: {
			title: "Das Pänultimagesetz in drei Schritten",
			subtitle: "Zähle immer von hinten: Ultima (letzte), Paenultima (vorletzte), Antepaenultima (drittletzte).",
			layout: "flow",
			parts: [
				{
					tag: "1 · Zweisilber",
					title: "Immer vorn betont",
					formula: "RŌ-ma · CŌN-sul · FĪ-dēs",
					note: "Im klassischen Latein wird die allerletzte Silbe (Ultima) bei mehrsilbigen Wörtern nie betont.",
				},
				{
					tag: "2 · Paenultima lang",
					title: "Ton auf vorletzter Silbe",
					formula: "im-pe-RĀ-tor · ma-GIS-ter",
					note: "Lang durch Naturlänge (ā, ē, ī, ō, ū, ae, au) oder Positionslänge (zwei Konsonanten nach dem Vokal).",
				},
				{
					tag: "3 · Paenultima kurz",
					title: "Ton auf drittletzter Silbe",
					formula: "MĪ-li-tēs · ex-ER-ci-tus",
					note: "Ist der Vokal der vorletzten Silbe kurz und folgt höchstens ein Konsonant, trägt die Antepaenultima den Ton.",
				},
			],
		},
		material:
			"Imperātor Rōmānus mīlitēs in prōvinciam dūcit. ‚Audīte, cīvēs!‘ clāmat cōnsul. ‚Nōn vī sōlā, sed cōnsiliō et fidē rēs pūblica servātur.‘",
		materialLabel: "Vortragstext · Lautes, quantitäts- und sinngerechtes Lesen",
		materialLanguage: "la",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Welche Silbe trägt im Wort ‚ma-gis-ter‘ den Ton, und warum?",
			answer: "Die vorletzte Silbe (-gis-), weil nach dem i zwei Konsonanten (-st-) folgen (Positionslänge).",
			wrong: [
				"Die erste Silbe (ma-), weil das i kurz ist.",
				"Die letzte Silbe (-ter), weil das Wort auf einen Konsonanten endet.",
			],
			explanation: "Nach dem kurzen i folgen s und t → die vorletzte Silbe ist positionslang und trägt daher den Ton: ma-GIS-ter.",
		},
		takeaway:
			"Pänultimagesetz (ab 3 Silben): Ist die vorletzte Silbe natur- oder positionslang, wird sie betont; ist sie kurz, trägt die drittletzte Silbe den Ton. Zweisilber werden immer auf der ersten Silbe betont.",
		practice: [
			{
				prompt: "Welche Silbe ist in ‚dī-vi-de-re‘ (teilen, kurzes -de-) betont? Schreibe nur die betonte Silbe: ___",
				answers: ["vi"],
				feedback: "Die vorletzte Silbe (-de-) ist kurz → der Ton rückt auf die drittletzte Silbe: dī-VI-de-re.",
			},
			{
				prompt: "Welche Silbe ist in ‚Car-thā-gō‘ (langes ā) betont? Schreibe nur die betonte Silbe: ___",
				answers: ["tha", "thā"],
				feedback: "Die vorletzte Silbe (-thā-) ist naturlang → Car-THĀ-gō.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Lies den Vortragstext zweimal laut vor. Notiere anschließend zu den vier Wörtern ‚imperātor‘, ‚mīlitēs‘, ‚prōvinciam‘ und ‚servātur‘ die Silbentrennung, markiere die betonte Silbe in Großbuchstaben und nenne kurz die Regel.",
				model: "im-pe-RĀ-tor (Paenultima naturlang), MĪ-li-tēs (Paenultima -li- kurz → Antepaenultima), prō-VIN-ci-am (Paenultima -ci- vor Vokal kurz → Antepaenultima), ser-VĀ-tur (Paenultima -vā- naturlang).",
				criteria: [
					"Ich habe den Text laut mit Pausen an den Satzzeichen vorgetragen.",
					"Ich trenne alle vier Wörter sauber in Silben und betone sie richtig.",
					"Ich begründe die Betonung mit dem Pänultimagesetz.",
				],
			},
			2: {
				language: "de",
				prompt: "Erkläre an den Wortpaaren ‚venit / vēnit‘ und ‚rēgēs (mīlitēs) / servābant‘, warum falsche Vokallängen oder falsche Betonung beim Vorlesen das Verständnis im Lateinischen stören können.",
				model: "Bei ‚venit‘ (kurzes e = Präsens: er kommt) vs. ‚vēnit‘ (langes ē = Perfekt: er kam) unterscheidet allein die Vokallänge das Tempus. Eine richtige Betonung (z. B. ser-VĀ-bant) und sinnvolle Pausen machen Satzgrenzen und wörtliche Rede (‚Audīte, cīvēs!‘) für Zuhörende sofort verständlich.",
				criteria: [
					"Ich zeige an venit/vēnit die bedeutungsunterscheidende Funktion der Vokallänge.",
					"Ich erkläre, wie Betonung und Pausen das Satzverständnis unterstützen.",
					"Ich formuliere eine konkrete Vortragsempfehlung für den Beispieltext.",
				],
			},
		},
		workshop: {
			kind: "vocab",
			liveModel: "paenultima",
			goals: [
				{
					label: "Positionslänge anwenden",
					before: "Betonung von ‚exercitus‘ (kurzes i, nur ein t) →",
					after: "",
					options: ["ex-ER-ci-tus", "ex-er-CI-tus", "EX-er-ci-tus"],
					answer: "ex-ER-ci-tus",
					explanation: "Die Paenultima -ci- ist kurz → Betonung auf der Antepaenultima: ex-ER-ci-tus.",
				},
				{
					label: "Naturlänge anwenden",
					before: "Betonung von ‚rēgīna‘ (langes ī) →",
					after: "",
					options: ["rē-GĪ-na", "RĒ-gī-na", "rē-gī-NA"],
					answer: "rē-GĪ-na",
					explanation: "Langes ī in der vorletzten Silbe zieht den Ton auf sich: rē-GĪ-na.",
				},
				{
					label: "Tempusunterschied durch Vokallänge",
					before: "‚vēnit‘ (langes ē) bedeutet →",
					after: "",
					options: ["er/sie kam (Perfekt)", "er/sie kommt (Präsens)", "er/sie wird kommen (Futur)"],
					answer: "er/sie kam (Perfekt)",
					explanation: "vēnit mit langem ē ist 3. Sg. Perfekt Aktiv von venīre.",
				},
			],
		},
	},
	{
		id: "l7-sprachbruecken",
		stage: "wortschatz",
		title: "Latein als Brücke: Deutsch, Englisch & Romanisch",
		skill: "Bezüge zwischen dem Lateinischen, deutschen Lehn- und Fremdwörtern, dem Englischen und romanischen Sprachen herstellen",
		lehrplan: "L7 LB 2.1 · Wortschatz (Mehrsprachigkeit & Sprachvergleich)",
		bindings: ["2.1-sprachbruecken", "2.1-erschliessen"],
		paragraphs: [
			"Latein ist keine isolierte Sprache der Vergangenheit, sondern der gemeinsame Werkzeugkasten Europas. Ins Deutsche gelangten schon durch den Kontakt mit den Römern am Rhein und an der Donau frühe Lehnwörter, die heute ganz deutsch klingen: mūrus → Mauer, fenestra → Fenster, porta → Pforte, strāta → Straße, vīnum → Wein. Später kamen über Wissenschaft, Recht und Politik zahlreiche Fremdwörter hinzu, die man direkt aus deinem Klasse-7-Wortschatz ableiten kann: prōvincia → Provinz, rēs pūblica → Republik, exercitus → Exerzitium, cōnferre → Konferenz, dīvidere → dividieren.",
			"Noch enger ist die Verwandtschaft zu den romanischen Tochtersprachen (Französisch, Spanisch, Italienisch, Portugiesisch, Rumänisch), die sich direkt aus dem gesprochenen Latein entwickelten, und zum Englischen, dessen Wortschatz zu über der Hälfte aus dem Lateinischen und Französischen stammt. Vergleiche nur drei Wörter aus deinem Grundwortschatz: ‚pāx‘ → frz. paix, span. paz, ital. pace, engl. peace/pacifist; ‚manus‘ → frz. main, span./ital. mano, engl. manual; ‚dēfendere‘ → frz. défendre, span. defender, engl. defend. Achte aber auf ‚falsche Freunde‘ wie lat. familia (Hausgemeinschaft inkl. Sklaven) vs. dt. Familie!",
		],
		diagram: {
			title: "Drei Brücken aus dem Lateinischen",
			subtitle: "Entdecke, wie ein einziger lateinischer Stamm in vier modernen Sprachen weiterlebt.",
			layout: "triptych",
			parts: [
				{
					tag: "Deutsch",
					title: "Lehn- & Fremdwörter",
					formula: "mūrus → Mauer · prōvincia → Provinz",
					note: "Lehnwörter passten sich früh der deutschen Aussprache an (Fenster, Straße); Fremdwörter bleiben nahe am Latein (Toleranz, Republik).",
				},
				{
					tag: "Englisch",
					title: "Wissenschaft & Alltag",
					formula: "victōria → victory · lībertās → liberty",
					note: "Über das Normannisch-Französische und die Gelehrtensprache übernahm das Englische tausende lateinische Stämme (civil, military, memory).",
				},
				{
					tag: "Romanisch",
					title: "Frz. · Span. · Ital.",
					formula: "manus → main / mano / mano",
					note: "Die romanischen Sprachen sind direkte Nachfahren des Lateinischen — wer Latein kann, liest viele Wörter in Süd- und Westeuropa sofort mit.",
				},
			],
		},
		material:
			"Lat. pāx (Frieden) → frz. la paix · span. la paz · ital. la pace · dt. Pazifismus · engl. peace.\nLat. manus (Hand) → frz. la main · span. la mano · ital. la mano · dt. Manuskript · engl. manual.\nLat. cīvis (Bürger) → frz. citoyen/civil · span. civil · ital. civile · dt. Zivilisation · engl. citizen/civil.",
		materialLabel: "Sprachvergleichstabelle · Lateinische Wurzeln in Europa",
		materialLanguage: "de",
		sourceIds: ["lp"],
		quiz: {
			optionLanguage: "de",
			question: "Welche Aussage unterscheidet ein deutsches Lehnwort (z. B. Mauer) von einem Fremdwort (z. B. Provinz)?",
			answer: "Ein Lehnwort hat sich in Lautung und Schreibung völlig dem Deutschen angepasst; ein Fremdwort lässt seine fremde Herkunft noch deutlich erkennen.",
			wrong: [
				"Lehnwörter stammen nur aus dem Griechischen, Fremdwörter aus dem Lateinischen.",
				"Fremdwörter wurden vor 2000 Jahren übernommen, Lehnwörter erst gestern.",
			],
			explanation: "Frühe Lehnwörter wie Mauer (mūrus), Fenster (fenestra) oder Straße (strāta) wirken völlig deutsch; Fremdwörter wie Provinz oder Republik zeigen noch die lateinische Form.",
		},
		takeaway:
			"Dein Lateinwortschatz erschließt deutsche Lehn- und Fremdwörter, englische Vokabeln und die romanischen Tochtersprachen (Französisch, Spanisch, Italienisch). Achte bei ‚falschen Freunden‘ auf Bedeutungsverschiebungen.",
		practice: [
			{
				prompt: "Welches lateinische Substantiv (4. Deklination) steckt im Fremdwort ‚Manuskript‘ (wörtlich: mit der Hand geschrieben)? ___",
				answers: ["manus"],
				feedback: "manus (Hand) + scrīptum (PPP von scrībere = geschrieben) = Manuskript.",
			},
			{
				prompt: "Welches lateinische Verb steckt im englischen ‚to defend‘ und deutschen ‚Defensivspiel‘? ___",
				answers: ["defendere", "dēfendere"],
				feedback: "dēfendere (verteidigen) lebt im Englischen (defend) und in deutschen Fremdwörtern weiter.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Erkläre die Herkunft der vier Fremdwörter ‚Konferenz‘, ‚Division‘, ‚Föderalismus‘ und ‚Pazifist‘ aus dem Lateinischen (cōnferre, dīvidere, foedus, pāx) und nenne je ein englisches verwandtes Wort.",
				model: "Konferenz ← cōnferre (zusammentragen, engl. conference); Division ← dīvidere (teilen, engl. division/divide); Föderalismus ← foedus (Bündnis/Vertrag, engl. federal); Pazifist ← pāx + facere (Friedensstifter, engl. pacifist/peace).",
				criteria: [
					"Ich führe alle vier Fremdwörter korrekt auf ihre lateinischen Grundwörter zurück.",
					"Ich erkläre die Bedeutung anhand des lateinischen Wortstamms.",
					"Ich nenne jeweils ein passendes englisches Cognate.",
				],
			},
			2: {
				language: "de",
				prompt: "Vergleiche die Wortreihe ‚rēx / rēgīna / rēgnum‘ und ‚tempus / temporis‘ mit dem Deutschen, Englischen und einer romanischen Sprache. Nenne zusätzlich ein Beispiel für einen ‚falschen Freund‘ zwischen Latein und Deutsch.",
				model: "rēx/rēgnum → dt. regieren/Regime, engl. royal/reign, frz. roi/règne (ital. re). tempus → dt. Tempo/temporär, engl. temporary/tense, frz. temps (span. tiempo). Falscher Freund: lat. familia bezeichnet die gesamte Hausgemeinschaft einschließlich der Sklaven unter dem pater familiās, nicht nur Eltern und Kinder wie im heutigen Deutsch.",
				criteria: [
					"Ich zeige nachvollziehbare Bezüge in mindestens drei modernen Sprachen.",
					"Ich trenne Wortstamm und Bedeutung präzise.",
					"Ich erkläre einen echten ‚falschen Freund‘ sachlich richtig.",
				],
			},
		},
		workshop: {
			kind: "vocab",
			goals: [
				{
					label: "Lehnwort aus der Römerzeit erkennen",
					before: "lat. via strāta (gepflasterte Straße) → dt.",
					after: "",
					options: ["Straße", "Strategie", "Struktur"],
					answer: "Straße",
					explanation: "strāta (PPP von sternere = pflastern) wurde früh als Lehnwort ‚Straße‘ ins Deutsche übernommen.",
				},
				{
					label: "Englisches Wort aus Latein ableiten",
					before: "lat. mīles, mīlitis (Soldat) → engl.",
					after: "",
					options: ["military", "million", "mild"],
					answer: "military",
					explanation: "Aus dem Stamm mīlit- stammt engl. military (und dt. Militär).",
				},
				{
					label: "Romanisches Wort erschließen",
					before: "lat. aqua → span. agua / ital. acqua / frz.",
					after: "",
					options: ["eau", "mer", "terre"],
					answer: "eau",
					explanation: "frz. eau entwickelte sich lautgeschichtlich aus lat. aqua (Wasser).",
				},
			],
		},
	},
	{
		id: "l7-inschriften-abkuerzungen",
		stage: "wortschatz",
		title: "Latein in unserer Umwelt: Inschriften & Abkürzungen",
		skill: "Lateinische Inschriften, Bau- und Grabformeln sowie alltägliche Abkürzungen sicher auflösen und deuten",
		lehrplan: "L7 LB 2.1 & 3 · Inschriften, Abkürzungen & Fortwirken",
		bindings: ["2.1-inschriften", "3-kulturdokumente"],
		paragraphs: [
			"Latein begegnet dir jeden Tag im Straßenbild, in Büchern, an Rathäusern, Kirchen und Denkmälern — oft stark abgekürzt, weil das Meißeln in Stein Platz und Zeit kostete. Die berühmteste römische Formel ist S. P. Q. R. = Senātus Populusque Rōmānus (Der Senat und das römische Volk), das Staatssymbol Roms. Auf römischen Grabsteinen in Bayern (z. B. in München oder Kempten) liest du häufig D. M. = Dīs Mānibus (Den Totengöttern geweiht) und am Ende H. S. E. = Hīc situs/sita est (Hier liegt begraben) oder F. C. = Faciendum cūrāvit (Er/Sie ließ es errichten).",
			"Auch in deutschen, englischen und wissenschaftlichen Texten wimmelt es von lateinischen Abkürzungen: etc. = et cētera (und das Übrige / und so weiter), p. s. / P. S. = post scrīptum (nach dem Geschriebenen / Nachschrift), a. D. = annō Dominī (im Jahre des Herrn), c. t. = cum tempore (mit akademischem Viertel, 15 Minuten später), N. B. = notā bene (merke wohl!), im Englischen e. g. = exemplī grātiā (zum Beispiel) und i. e. = id est (das heißt). Wer die lateinischen Wörter dahinter kennt, verwechselt sie nie wieder!",
		],
		diagram: {
			title: "Lateinische Kürzel im Alltag & auf Stein",
			subtitle: "Drei Lebensbereiche, in denen du lateinische Formeln sofort entschlüsseln kannst.",
			layout: "triptych",
			parts: [
				{
					tag: "Staat & Stein",
					title: "S.P.Q.R. · D.M. · a. D.",
					formula: "Senātus Populusque Rōmānus",
					note: "Auf römischen Münzen, Bauwerken, Kanaldeckeln in Rom und bayerischen Grabsteinen (D. M. = Dīs Mānibus).",
				},
				{
					tag: "Text & Brief",
					title: "etc. · P.S. · N.B.",
					formula: "et cētera · post scrīptum",
					note: "Abkürzungen für ‚und so weiter‘, ‚Nachschrift am Briefende‘ und ‚beachte gut!‘.",
				},
				{
					tag: "Wissenschaft & Englisch",
					title: "e. g. · i. e. · c. t.",
					formula: "exemplī grātiā · id est",
					note: "Im Englischen trennst du dank Latein sofort ‚e. g.‘ (zum Beispiel) und ‚i. e.‘ (das heißt).",
				},
			],
		},
		material:
			"Römische Inschrift (nach antikem Formular):\nS. P. Q. R. · IMP. CAESARI AVGVSTO · P. P.\nGrabinschrift in Raetien:\nD. M. · L. VALERIO MILITI LEG. III · VIXIT ANN. XXXV · H. S. E.\nAlltagskürzel: etc. (et cētera) · P. S. (post scrīptum) · e. g. (exemplī grātiā) · i. e. (id est).",
		materialLabel: "Übungsmaterial · Inschriftenformulare und moderne Abkürzungen",
		materialLanguage: "la",
		sourceIds: ["lp", "archbayern", "cambodunum"],
		quiz: {
			optionLanguage: "de",
			question: "Wofür steht die weltbekannte römische Abkürzung ‚S. P. Q. R.‘?",
			answer: "Senātus Populusque Rōmānus (Der Senat und das römische Volk).",
			wrong: [
				"Salvēte Patrēs Quiritēsque Rōmae.",
				"Sub Potestāte Quīntī Rēgis.",
			],
			explanation: "Das angehängte -que bedeutet ‚und‘: Senātus Populusque Rōmānus war die offizielle Bezeichnung des römischen Staates.",
		},
		takeaway:
			"Inschriften (S.P.Q.R., D.M., H.S.E.) und Alltagskürzel (etc., P.S., a. D., e. g., i. e., N.B.) lassen sich mit deinem Lateinwortschatz direkt auflösen und fehlerfrei verwenden.",
		practice: [
			{
				prompt: "Wofür steht ‚P. S.‘ am Ende eines Briefes im Lateinischen? (zwei Wörter): ___",
				answers: ["post scriptum", "post scrīptum"],
				feedback: "post scrīptum = nach dem Geschriebenen (scrīptum ist das PPP von scrībere!).",
			},
			{
				prompt: "Wie lautet die lateinische Auflösung von ‚etc.‘? (zwei Wörter): ___",
				answers: ["et cetera", "et cētera"],
				feedback: "et cētera = und das Übrige / und so weiter.",
			},
		],
		tasks: {
			1: {
				language: "de",
				prompt: "Löse die abgebildete Grabinschrift ‚D. M. · L. VALERIO MILITI LEG. III · VIXIT ANN. XXXV · H. S. E.‘ Wort für Wort auf und übersetze sie ins Deutsche.",
				model: "Dīs Mānibus — Lūciō Valeriō, mīlitī legiōnis tertiae — vīxit annōs trīgintā quīnque (35) — hīc situs est. Übersetzung: Den Totengöttern geweiht. Für Lucius Valerius, Soldat der dritten Legion. Er lebte 35 Jahre. Hier liegt er begraben.",
				criteria: [
					"Ich löse D. M. und H. S. E. korrekt auf.",
					"Ich übersetze die römischen Zahlen III (3.) und XXXV (35) richtig.",
					"Ich erkenne den Dativ (L. Valeriō mīlitī) als Widmung auf Grabsteinen.",
				],
			},
			2: {
				language: "de",
				prompt: "Erkläre einer Mitschülerin den genauen Unterschied zwischen den beiden im Englischen oft verwechselten Kürzeln ‚e. g.‘ und ‚i. e.‘ mithilfe ihrer lateinischen Vollformen und nenne ein Beispiel aus deiner Umgebung (Gebäude, Motto, Produktname) mit lateinischem Ursprung.",
				model: "‚e. g.‘ steht für exemplī grātiā (‚um eines Beispiels willen‘ = zum Beispiel) und nennt einzelne Beispiele. ‚i. e.‘ steht für id est (‚das ist‘ = das heißt) und erklärt oder präzisiert den vorangehenden Begriff. Beispiel aus dem Alltag: ‚Nivea‘ (von lat. niveus = schneeweiß) oder ‚Audi‘ (Imperativ von audīre = höre!, Übersetzung des Gründernamens Horch).",
				criteria: [
					"Ich löse e. g. und i. e. lateinisch richtig auf und trenne ihre Verwendung.",
					"Ich nenne ein reales Beispiel für Latein in der heutigen Umwelt.",
					"Ich erkläre die lateinische Bedeutung des gewählten Beispiels korrekt.",
				],
			},
		},
		workshop: {
			kind: "vocab",
			goals: [
				{
					label: "Inschriftenkürzel auf Grabsteinen",
					before: "D. M. am Kopf eines römischen Grabsteins →",
					after: "",
					options: ["Dīs Mānibus (Den Totengöttern)", "Dominus Magnus (Großer Herr)", "Diēs Mortis (Tag des Todes)"],
					answer: "Dīs Mānibus (Den Totengöttern)",
					explanation: "Fast alle kaiserzeitlichen Grabsteine beginnen mit der Weiheformel Dīs Mānibus.",
				},
				{
					label: "Englisches Kürzel richtig einsetzen",
					before: "‚das heißt‘ (präzisierende Erklärung) →",
					after: "",
					options: ["i. e. (id est)", "e. g. (exemplī grātiā)", "p. s. (post scrīptum)"],
					answer: "i. e. (id est)",
					explanation: "id est bedeutet ‚das ist / das heißt‘.",
				},
				{
					label: "Jahresangabe auflösen",
					before: "a. D. MMXXVI →",
					after: "",
					options: ["annō Dominī (im Jahre des Herrn)", "ante diem (vor dem Tag)", "ad Deum (zu Gott)"],
					answer: "annō Dominī (im Jahre des Herrn)",
					explanation: "a. D. steht für den Ablativ der Zeit annō Dominī.",
				},
			],
		},
	},
];
