import {
	arrow,
	badge,
	card,
	type ConceptFigure,
	label,
	partGroup,
	pill,
	threeColumns,
} from "./draw";

export const STAGE3_4_FIGURES: Record<string, ConceptFigure> = {
	"l5-praesens-konjugationen": {
		title: "Die fünf Konjugationsklassen im Präsens und Imperativ",
		question: "Woran erkennst du die Konjugation und wie füllen Bindevokale die 3. Person Plural?",
		alt: "Dreiteiliges Schaubild zu vokalischen Stämmen (a/e/i), konsonantischer Konjugation mit -u- und kurzvokalischer i-Konjugation.",
		caption: "Der Infinitiv plus 1. Sg. zeigt die Klasse; achte besonders auf -unt und -iunt.",
		parts: [
			{
				label: "Vokalstämme (a / e / i)",
				note: "vocāre → vocant; monēre → monent; audīre braucht in der 3. Plural ein -u-: audiunt.",
			},
			{
				label: "Konsonantische & kurzvok. i-Klasse",
				note: "mittere (mittō) → mittis, mittit, mittunt; capere (capiō) → capis, capit, capiunt.",
			},
			{
				label: "Imperativ I (Sg. / Pl.)",
				note: "Singular = reiner Stamm (vocā! mitte! – kurz dīc! dūc! fac!), Plural = Stamm + -(i)te (mittite!).",
			},
		],
		draw: () =>
			threeColumns(
				"Präsensstamm, Bindevokale und Imperativ I",
				[
					{
						badge: "1",
						fill: "v-green-fill",
						heading: "a- / e- / i-Klasse",
						lines: ["vocāre → vocat / vocant", "monēre → monet / monent", "audīre → audit / audiunt", "Endungen -ō,-s,-t,-mus,-tis,-nt"],
						footer: "Stamm vor -re klar",
					},
					{
						badge: "2",
						fill: "v-blue-fill",
						heading: "kons. & kurzvok. i",
						lines: ["mittere (mittō) → mittis", "3. Pl. mitt-u-nt", "capere (capiō) → capis", "3. Pl. capi-u-nt"],
						footer: "-i- / -u- als Bindevokal",
					},
					{
						badge: "3",
						fill: "v-orange-fill",
						heading: "Imperativ I",
						lines: ["Sg.: vocā! monē! audī!", "mitt-e! · dīc! dūc! fac!", "Pl.: vocāte! mittite!", "Aufforderungssatz"],
						footer: "dīc, dūc, fac ohne -e",
					},
				],
				false,
			),
	},
	"l5-esse-posse-velle": {
		title: "Unregelmäßige Verben: esse, posse, velle, nōlle, mālle",
		question: "Wie hängen esse und posse zusammen, und wie verneint man Befehle höflich?",
		alt: "Dreiteiliges Schaubild zu esse (sum/eram/erō), posse (pot-/pos-) und velle/nōlle/mālle samt nōlī + Infinitiv.",
		caption: "posse baut auf esse auf; nōlī / nōlīte + Infinitiv bildet jedes Verbot.",
		parts: [
			{
				label: "esse & posse",
				note: "sum, es, est, sumus, estis, sunt; mit pot-/pos- davor entsteht possum, potes, potest, possumus, potestis, possunt.",
			},
			{
				label: "velle, nōlle, mālle",
				note: "volō, vīs, vult; nōlō, nōn vīs, nōn vult; mālō, māvīs, māvult (und wollen/nicht wollen/lieber wollen).",
			},
			{
				label: "Verbot mit nōlī / nōlīte",
				note: "Nōlī timēre (Sg.) / Nōlīte clāmāre (Pl.) = Fürchte dich nicht / Schreit nicht!",
			},
		],
		draw: () =>
			threeColumns(
				"Hilfs- und Modalverben im Überblick",
				[
					{
						badge: "1",
						fill: "v-teal-fill",
						heading: "esse & posse",
						lines: ["sum, es, est · eram · erō", "pos-sum, pot-es, pot-est", "poteram · poterō", "Perf. fuī · potuī"],
						footer: "pot- vor s → pos-",
					},
					{
						badge: "2",
						fill: "v-purple-fill",
						heading: "velle / nōlle / mālle",
						lines: ["volō, vīs, vult, volumus", "nōlō, nōn vīs, nōn vult", "mālō, māvīs, māvult", "3. Pl. volunt/nōlunt/mālunt"],
						footer: "unregelmäßiges Präsens",
					},
					{
						badge: "3",
						fill: "v-coral-fill",
						heading: "Verbot: nōlī + Inf.",
						lines: ["Nōlī timēre! (an 1 Pers.)", "Nōlīte clāmāre! (an mehrere)", "wörtl.: Wolle nicht...", "→ Tu das bitte nicht!"],
						footer: "verneinter Imperativ",
					},
				],
				false,
			),
	},
	"l5-imperfekt-futur1": {
		title: "Tempuszeichen am Präsensstamm: Imperfekt & Futur I",
		question: "Warum heißt mittit 'er schickt', mittet aber 'er wird schicken'?",
		alt: "Dreiteiliges Schaubild zur Zweiteilung des Futur I (-bo/-bi/-bu vs. -a-/-ē-) und dem Imperfektzeichen -ba-/-ēba-.",
		caption: "Beide Tempora sitzen auf dem Präsensstamm; beim Futur I trennt sich a/e von kons./i.",
		parts: [
			{
				label: "Imperfekt: -bā- / -ēbā-",
				note: "vocābam, monēbam (a/e-Klasse) und mittēbam, audiēbam, capiēbam (kons./i). 1. Sg. immer auf -m!",
			},
			{
				label: "Futur I (a-/e-Konj.): -b-/-bi-/-bu-",
				note: "vocābō, vocābis, vocābit, vocābimus, vocābitis, vocābunt (wie erō/eris).",
			},
			{
				label: "Futur I (kons./i-Konj.): -a-/-ē-",
				note: "mittam, mittēs, mittet; audiam, audiēs, audiet! Das -e- zeigt hier Zukunft statt Präsens (-i-).",
			},
		],
		draw: () =>
			threeColumns(
				"Präsensstamm → Imperfekt und Futur I",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "Imperfekt (-bā-/-ēbā-)",
						lines: ["a/e: vocā-ba-t", "kons.: mitt-ēba-t", "i: audi-ēba-t", "1. Sg. immer auf -m"],
						footer: "Signal: ba",
					},
					{
						badge: "2",
						fill: "v-orange-fill",
						heading: "Futur I: a-/e-Klasse",
						lines: ["vocā-bō · vocā-bi-s", "vocā-bi-t · -bi-mus", "vocā-bi-tis · -bu-nt", "Merkwort: bo - bi - bu"],
						footer: "wie monēbō / erō",
					},
					{
						badge: "3",
						fill: "v-green-fill",
						heading: "Futur I: kons./i-Klasse",
						lines: ["1. Sg.: mitt-am / audi-am", "2. Sg.: mitt-ēs / audi-ēs", "3. Sg.: mitt-et (vs. mittit!)", "3. Pl.: mitt-ent / audi-ent"],
						footer: "Merkwort: a - e - e",
					},
				],
				false,
			),
	},
	"l5-perfektbildung": {
		title: "Die sechs Wege zum Perfektstamm",
		question: "Wie findest du die Grundform eines Verbs trotz verändertem Perfektstamm?",
		alt: "Dreiteiliges Schaubild zu den sechs Perfektarten (v/u, s/x, Dehnung/Reduplikation/stammgleich) und den Perfektendungen.",
		caption: "Schneide eine Perfektendung (-ī, -istī, -it, -imus, -istis, -ērunt) ab, um den Stamm zu isolieren.",
		parts: [
			{
				label: "v- und u-Perfekt",
				note: "Regelmäßig an Vokalstämmen: vocā-v-ī, audī-v-ī (v-Perfekt) sowie mon-u-ī, hab-u-ī (u-Perfekt).",
			},
			{
				label: "s-Perfekt (s / x)",
				note: "Oft bei konsonantischen Stämmen: dīc + s → dīxī, scrīb + s → scrīpsī, mitt + s → mīsī.",
			},
			{
				label: "Dehnung, Reduplikation & stammgleich",
				note: "Vokallängung/Wechsel (vīdī, fēcī, vēnī), Verdopplung (dedī, cucurrī) oder unverändert (dēfendī).",
			},
		],
		draw: () =>
			threeColumns(
				"Perfektstamm + Perfektendungen (-ī, -istī, -it... -ērunt)",
				[
					{
						badge: "1",
						fill: "v-green-fill",
						heading: "v- & u-Perfekt",
						lines: ["vocāvī (vocāre)", "audīvī (audīre)", "monuī (monēre)", "habuī (habēre)"],
						footer: "häufig bei a / e / i",
					},
					{
						badge: "2",
						fill: "v-orange-fill",
						heading: "s-Perfekt",
						lines: ["dīc + s → dīxī", "scrīb + s → scrīpsī", "mitt + s → mīsī", "c/g + s = x"],
						footer: "Signal: s oder x",
					},
					{
						badge: "3",
						fill: "v-purple-fill",
						heading: "Dehnung / Redupl.",
						lines: ["Dehnung: vīdī, fēcī, vēnī", "Redupl.: dedī, cucurrī", "stammgleich: dēfendī", "Endung: -ērunt (3. Pl.)"],
						footer: "Stammformen mitlernen!",
					},
				],
				false,
			),
	},
	"l5-plusquamperfekt-futur2": {
		title: "Perfektstamm-Baukasten: Plusquamperfekt & Futur II",
		question: "Wie entstehen aus einem einzigen Perfektstamm drei ganze Zeitformen?",
		alt: "Zeitstrahl-Diagramm vom Perfektstamm zu Plusquamperfekt (-eram), Perfekt (-ī) und Futur II (-erō/-erint).",
		caption: "Plusquamperfekt liegt vor der Vergangenheit, Futur II liegt abgeschlossen vor der Zukunft.",
		parts: [
			{
				label: "Plusquamperfekt (-erā-)",
				note: "Perfektstamm + eram/erās/erat/erāmus/erātis/erant → 'ich hatte gerufen' (Vorvergangenheit).",
			},
			{
				label: "Perfekt (-ī, -istī, -it...)",
				note: "Perfektstamm + Perfektendungen → 'ich rief / habe gerufen' (Haupthandlung).",
			},
			{
				label: "Futur II (-erō / -eri-)",
				note: "Perfektstamm + erō/eris/erit/erimus/eritis/erint → 'ich werde gerufen haben' (3. Pl. -erint!).",
			},
		],
		draw: () =>
			threeColumns(
				"Drei Tempora auf demselben Perfektstamm (z. B. vocāv- / mīs-)",
				[
					{
						badge: "1",
						fill: "v-purple-fill",
						heading: "Plusquamperfekt",
						lines: ["Perf.-Stamm + eram", "vocāveram · mīserant", "'ich hatte gerufen'", "vor der Vergangenheit"],
						footer: "Signal: -era-",
					},
					{
						badge: "2",
						fill: "v-teal-fill",
						heading: "Perfekt",
						lines: ["Perf.-Stamm + -ī/-ērunt", "vocāvī · mīsērunt", "'ich rief / habe gerufen'", "Vergangenheit / Ergebnis"],
						footer: "Basisstamm der 3. Reihe",
					},
					{
						badge: "3",
						fill: "v-orange-fill",
						heading: "Futur II",
						lines: ["Perf.-Stamm + erō/-erint", "vocāverō · mīserint!", "'werde gerufen haben'", "vor der Zukunft"],
						footer: "3. Pl. -erint (≠ -unt)",
					},
				],
				true,
			),
	},
	"l5-imperfekt-perfekt-gebrauch": {
		title: "Hintergrund (Imperfekt) und Haupthandlung (Perfekt)",
		question: "Warum wechseln lateinische Erzähler zwischen Imperfekt und Perfekt?",
		alt: "Bühnenbild-Diagramm: Das Imperfekt malt die Kulisse und Dauer, das Perfekt liefert die Handlungsschritte.",
		caption: "Im Deutschen stehen beide meist im Präteritum; im Lateinischen trennen sie Bühne und Aktion.",
		parts: [
			{
				label: "Imperfekt = Kulisse & Dauer",
				note: "Beschreibt Zustände, laufende Vorgänge und Gewohnheiten (cotīdiē, semper): Nox erat, cīvēs stābant.",
			},
			{
				label: "Perfekt = Aktion & Ereignis",
				note: "Bringt neue Handlungsschritte, plötzliche Ereignisse (subitō) und Ketten: Cōnsul vēnit et dīxit.",
			},
			{
				label: "Übersetzung ins Deutsche",
				note: "In Erzählungen stehen beide im Präteritum; in direkter Rede (hodiē!) gibt deutsches Perfekt Ergebnisse wieder.",
			},
		],
		draw: () =>
			threeColumns(
				"Erzählperspektive: Bühne vs. Handlung",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "Imperfekt: Kulisse",
						lines: ["Zustand / Hintergrund", "Wiederholung (cotīdiē)", "Nox erat · stābant", "Malt die Szene aus"],
						footer: "Präteritum (damals/oft)",
					},
					{
						badge: "2",
						fill: "v-coral-fill",
						heading: "Perfekt: Aktion",
						lines: ["Handlungskette", "Plötzlich (subitō)", "vēnit → vīdit → dīxit", "Treibt Geschichte voran"],
						footer: "Präteritum im Text",
					},
					{
						badge: "3",
						fill: "v-green-fill",
						heading: "Direkte Rede",
						lines: ["Gegenwartsbezug (hodiē)", "Bene labōrāvistī!", "'Du hast gut gearbeitet!'", "Ergebnis bis jetzt"],
						footer: "dt. Perfekt passend",
					},
				],
				false,
			),
	},
	"l5-satzglieder-abfrage": {
		title: "Das Abfrageschema in drei festen Zügen",
		question: "In welcher Reihenfolge knackst du jeden unbekannten lateinischen Satz?",
		alt: "Flussdiagramm vom Prädikat über das Subjekt (Nom.) zu Objekten, Prädikatsnomen und Adverbialen.",
		caption: "Beginne immer beim gebeugten Prädikat, niemals blind beim ersten Wort links.",
		parts: [
			{
				label: "1. Prädikat & Subjekt",
				note: "Suche das finite Verb (oft am Satzende) und frage 'Wer/was tut das?' → Nominativ passend in Person & Numerus.",
			},
			{
				label: "2. Objekte oder Prädikatsnomen",
				note: "Frage vom Prädikat: Wen/was? (Akk.), Wem? (Dat.) oder bei esse: Wer/was ist das Subjekt? (Prädikatsnomen Nom.).",
			},
			{
				label: "3. Adverbiale & Attribute",
				note: "Kläre Wo/Wann/Womit (Abl./Präp.) und ordne Genitive sowie Adjektive nach KNG ihren Bezugswörtern zu.",
			},
		],
		draw: () =>
			threeColumns(
				"Das Abfrageschema Schritt für Schritt",
				[
					{
						badge: "1",
						fill: "v-coral-fill",
						heading: "1. Prädikat + Subjekt",
						lines: ["Verb bestimmen (dat)", "Wer gibt? → Nominativ", "Numerus abgleichen", "dux dat (Sg. + Sg.)"],
						footer: "Motor des Satzes",
					},
					{
						badge: "2",
						fill: "v-blue-fill",
						heading: "2. Objekte / Präd.N.",
						lines: ["Wen? → Akk. (signum)", "Wem? → Dat. (mīlitibus)", "bei esse → Prädikatsnomen", "(Rōma urbs est)"],
						footer: "Ergänzungen zum Verb",
					},
					{
						badge: "3",
						fill: "v-teal-fill",
						heading: "3. Adv. & Attribute",
						lines: ["Wo/Wann? → in forō", "Wessen? → Genitiv", "KNG → Adjektive", "amīcus bonus"],
						footer: "Details einfügen",
					},
				],
				true,
			),
	},
	"l5-rektion-wortstellung": {
		title: "Rektion und Satzbau: Deutsch vs. Latein",
		question: "Wo verlangt Latein einen anderen Kasus oder eine andere Wortstellung?",
		alt: "Dreiteiliges Schaubild zur Verb-Rektion (iuvāre + Akk., pārēre + Dat.), Wechselpräpositionen (in/sub) und Endstellung des Prädikats.",
		caption: "Latein steuert Beziehungen über Endungen, daher sind Sperrungen und Verb-Endstellung normal.",
		parts: [
			{
				label: "Rektion von Verben",
				note: "iuvāre/adiuvāre/dēlectāre + Akkusativ ('amīcum iuvō'); pārēre/nocēre/studēre + Dativ.",
			},
			{
				label: "Rektion von Präpositionen",
				note: "in/sub: 'Wo?' → Ablativ ('in forō'), 'Wohin?' → Akkusativ ('in forum'). cum/ā/ē/dē/sine nur + Abl.; ad/per/post nur + Akk.",
			},
			{
				label: "Wortstellung & Sperrung",
				note: "Im Deutschen steht das Verb an Position 2, im Lateinischen am Ende. Sperrungen ('magnā cum cūrā') sind im Lateinischen stilvoll.",
			},
		],
		draw: () =>
			threeColumns(
				"Rektion und Satzbau im Vergleich",
				[
					{
						badge: "1",
						fill: "v-orange-fill",
						heading: "Verb-Rektion",
						lines: ["iuvāre + Akk. (amīcum!)", "pārēre + Dat. (mātrī)", "nocēre + Dat. (cīvī)", "nicht dt. Kasus raten"],
						footer: "mit Vokabel lernen",
					},
					{
						badge: "2",
						fill: "v-teal-fill",
						heading: "Präpositionen",
						lines: ["in + Abl. (Wo?): in forō", "in + Akk. (Wohin?): in forum", "ā/cum/dē/ē/sine + Abl.", "ad/per/post/propter + Akk."],
						footer: "Frage Wo? vs. Wohin?",
					},
					{
						badge: "3",
						fill: "v-purple-fill",
						heading: "Satzbau DE vs. LA",
						lines: ["LA: Prädikat am Ende", "DE: Verb auf Position 2", "Sperrung: magnā cum cūrā", "Endung zeigt Bezug"],
						footer: "frei vs. fest",
					},
				],
				false,
			),
	},
	"l5-kasus-gen-dat-akk": {
		title: "Genitiv der Zugehörigkeit, Dativ des Besitzers, Zeit-Akkusativ",
		question: "Wie übersetzt man diese drei besonderen Kasusfunktionen in gutes Deutsch?",
		alt: "Dreiteiliges Schaubild für Genitivus possessivus, Dativus possessivus (mit esse = haben) und Akkusativ der zeitlichen Ausdehnung.",
		caption: "Bei 'Dativ + esse' wird der Besitzer im Deutschen zum Subjekt mit 'haben'.",
		parts: [
			{
				label: "Genitiv der Zugehörigkeit",
				note: "Antwortet auf 'wessen?' als Attribut (vīlla dominī) oder nach esse (Templum deōrum est = gehört den Göttern).",
			},
			{
				label: "Dativ des Besitzers",
				note: "Dativ + esse: 'Mārcō multī librī sunt' → Der Dativ wird Subjekt: 'Marcus hat viele Bücher.'",
			},
			{
				label: "Akkusativ der Zeitdauer",
				note: "Ohne Präposition auf die Frage 'wie lange?': 'trēs hōrās' = drei Stunden lang.",
			},
		],
		draw: () =>
			threeColumns(
				"Drei besondere Kasusfunktionen",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "Genitiv Zugehörigkeit",
						lines: ["vīlla dominī", "wessen Landhaus?", "Templum deōrum est", "→ gehört den Göttern"],
						footer: "Besitzer als Attribut",
					},
					{
						badge: "2",
						fill: "v-green-fill",
						heading: "Dativ des Besitzers",
						lines: ["Dativ + esse (sunt/est)", "Līberīs librī sunt", "Dativ → dt. Subjekt", "→ Die Kinder haben..."],
						footer: "Umformung mit 'haben'",
					},
					{
						badge: "3",
						fill: "v-gold-fill",
						heading: "Zeit-Akkusativ",
						lines: ["Frage: Wie lange?", "ohne Präposition!", "trēs hōrās lūdimus", "decem annōs (lang)"],
						footer: "Zeitspanne / Dauer",
					},
				],
				false,
			),
	},
	"l5-ablativ-funktionen": {
		title: "Die vier Funktionen des reinen Ablativs",
		question: "Welche Fragewörter erschließen einen Ablativ ohne Präposition?",
		alt: "Vier-Felder-Kompass in 3 Gruppen: Mittel (womit?), Grund (warum?), Trennung (wovon?) und Zeit (wann?).",
		caption: "Bei Personen als Begleitung steht immer cum; bei Werkzeug, Grund, Trennung und Zeitpunkt entfällt die Präposition.",
		parts: [
			{
				label: "Mittel & Grund",
				note: "Mittel (womit/wodurch?): gladiō pugnat. Grund (warum/aus welchem Grund?): gaudiō rīdet, timōre fugit.",
			},
			{
				label: "Trennung (wovon?)",
				note: "Bei Verben wie līberāre oder prohibēre: urbem perīculō līberat = befreit die Stadt von der Gefahr.",
			},
			{
				label: "Zeitpunkt (wann?)",
				note: "Bei Zeitnomen: hōrā tertiā = zur dritten Stunde, nocte = nachts (Gegensatz zur Dauer im Akkusativ!).",
			},
		],
		draw: () =>
			threeColumns(
				"Die Ablativ-Frageprobe (ohne Präposition)",
				[
					{
						badge: "1",
						fill: "v-orange-fill",
						heading: "Mittel & Grund",
						lines: ["Womit? → stilō scrībit", "(Person braucht cum!)", "Warum? → gaudiō rīdet", "vor/aus Freude"],
						footer: "īnstrūmentī · causae",
					},
					{
						badge: "2",
						fill: "v-coral-fill",
						heading: "Trennung (Wovon?)",
						lines: ["līberāre / prohibēre", "cīvēs metū līberat", "hostēs urbe prohibet", "von der Furcht / Stadt"],
						footer: "sēparātiōnis",
					},
					{
						badge: "3",
						fill: "v-teal-fill",
						heading: "Zeitpunkt (Wann?)",
						lines: ["tertiā hōrā", "eōdem diē · nocte", "zur 3. Std. / nachts", "vs. Dauer (Akk.)!"],
						footer: "temporis",
					},
				],
				false,
			),
	},
	"l5-satzarten-nebensaetze": {
		title: "Satzarten, Adverbialsätze und relativer Satzanschluss",
		question: "Wie erkennst du Fragesignale, die vier Adverbialsätze und Satzanschlüsse?",
		alt: "Dreiteiliges Schaubild zu Fragesignalen (-ne, nōnne, num), vier Nebensatz-Sinnrichtungen und dem relativen Satzanschluss nach Punkt.",
		caption: "Subjunktionen ordnen Nebensätze unter; ein Relativpronomen nach einem Punkt schließt als Hauptsatz an.",
		parts: [
			{
				label: "Satzarten & Fragen",
				note: "Aussagesatz (Ind.), Aufforderung (Imp./nōlī), Fragesatz: Fragewort (quis/ubi), -ne (offen), nōnne (Ja?), num (Nein?).",
			},
			{
				label: "Vier Adverbialsätze",
				note: "temporal (postquam, ubi, dum), kausal (quod, quia), konditional (sī, nisi), konzessiv (quamquam).",
			},
			{
				label: "Relativer Satzanschluss",
				note: "Relativpronomen nach Punkt/Semikolon am Satzanfang ('Quī statim vēnit') → übersetzt mit 'Dieser / Und dieser'.",
			},
		],
		draw: () =>
			threeColumns(
				"Satzarten und Nebensätze mit Indikativ",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "Fragen erkennen",
						lines: ["-ne → offen (Kommst du?)", "nōnne → erwartet Ja", "num → erwartet Nein", "quis? ubi? cūr?"],
						footer: "Aussage · Frage · Befehl",
					},
					{
						badge: "2",
						fill: "v-green-fill",
						heading: "4 Adverbialsätze",
						lines: ["temporal: postquam, dum", "kausal: quod, quia", "konditional: sī, nisi", "konzessiv: quamquam"],
						footer: "im Hauptsatz + Nebensatz",
					},
					{
						badge: "3",
						fill: "v-purple-fill",
						heading: "Rel. Satzanschluss",
						lines: ["... scrīpsit. Quam...", "nach Punkt am Anfang", "kein Nebensatz!", "→ 'Diesen (Brief)...'"],
						footer: "als Demonstrativpronomen",
					},
				],
				false,
			),
	},
	"l5-aci": {
		title: "Der AcI (Accusativus cum Infinitivo, aktiv)",
		question: "Wie baust du den AcI in einen deutschen 'dass'-Satz mit richtiger Zeitstufe um?",
		alt: "Dreiteiliges Pfeildiagramm: Kopfverb + 'dass' -> Subjektsakkusativ wird Nominativ -> Infinitiv Präs./Perf. zeigt Gleich- vs. Vorzeitigkeit.",
		caption: "Der Infinitiv steht im AcI relativ zur Zeit des übergeordneten Kopfverbs.",
		parts: [
			{
				label: "1. Kopfverb + ', dass'",
				note: "Verben des Sagens (dīcere), Wahrnehmens (vidēre, audīre), Denkens (scīre, putāre), Fühlens (gaudēre).",
			},
			{
				label: "2. Subjektsakkusativ → Subjekt",
				note: "Der Akkusativ im AcI wird im deutschen 'dass'-Satz zum Nominativ-Subjekt ('Mārcum' → 'dass Marcus').",
			},
			{
				label: "3. Infinitiv → Zeitverhältnis",
				note: "Inf. Präsens = gleichzeitig (Präs./Prät.). Inf. Perfekt (-isse) = vorzeitig (Perf./Plusquamperfekt).",
			},
		],
		draw: () => {
			return `${card(4, 4, 592, 242, "v-banner-bg", 14)}${label(300, 26, "Der AcI-Umbau zum deutschen 'dass'-Satz", "heading")}
			${partGroup(
				1,
				`${card(16, 44, 174, 186, "v-paper", 12)}
				${badge(34, 44, 1)}
				${pill(30, 56, 146, 28, "1. Kopfverb + , dass", "v-blue-fill", "micro")}
				${label(103, 108, "Audiō / Audīvī", "small")}
				${label(103, 132, "Sagen · Sehen · Wissen", "micro")}
				${pill(30, 188, 146, 28, "→ höre/hörte, dass", "v-blue-fill", "micro")}`,
			)}
			${arrow(192, 136, 206, 136)}
			${partGroup(
				2,
				`${card(208, 44, 178, 186, "v-paper", 12)}
				${badge(226, 44, 2)}
				${pill(222, 56, 150, 28, "2. Subjektsakkusativ", "v-purple-fill", "micro")}
				${label(297, 108, "Mārcum / sē", "small")}
				${label(297, 132, "Akk. wird Nominativ!", "micro")}
				${pill(222, 188, 150, 28, "→ ... Marcus / er ...", "v-purple-fill", "micro")}`,
			)}
			${arrow(388, 136, 402, 136)}
			${partGroup(
				3,
				`${card(404, 44, 180, 186, "v-paper", 12)}
				${badge(422, 44, 3)}
				${pill(418, 56, 152, 28, "3. Infinitiv (Zeit)", "v-teal-fill", "micro")}
				${label(494, 106, "venīre = gleichzeitig", "micro")}
				${label(494, 128, "vēnisse = vorzeitig", "micro")}
				${label(494, 152, "nach Audīvī:", "micro")}
				${pill(418, 188, 152, 28, "kam / gekommen war", "v-teal-fill", "micro")}`,
			)}`;
		},
	},
};
