import { type ConceptFigure, threeColumns } from "./draw";

export const STAGE3_4_FIGURES: Record<string, ConceptFigure> = {
	"l6-genus-verbi-passiv-praesens": {
		title: "Passiv am Präsensstamm und Infinitiv Präsens Passiv",
		question: "Wie wechselt Aktiv zu Passiv in Präsens, Imperfekt und Futur I?",
		alt: "Dreiteiliges Schaubild zu den Passiv-Endungen (-r, -ris, -tur, -mur, -minī, -ntur), wichtigen 2.-Sg.-Fallen und dem Passivinfinitiv (-rī vs. -ī).",
		caption: "Ersetze die Aktivendung durch die Passivreihe; Urheber = ā/ab + Ablativ.",
		parts: [
			{
				label: "Passiv-Endungsreihe",
				note: "-r (-or), -ris, -tur, -mur, -minī, -ntur an Präsens-, -bā-/-ēbā- und Futurstamm.",
			},
			{
				label: "Stolperfalle 2. Sg. & Inf.",
				note: "kons. Präs. mitteris vs. Futur I mittēris (lang); Infinitiv Präs. Passiv: -ārī/-ērī/-īrī, aber mittī, capī!",
			},
			{
				label: "Satzumbau & Urheber",
				note: "Akk.-Objekt → Nom.-Subjekt; Person im Passivsatz mit ā/ab + Abl., Sache im bloßen Ablativ.",
			},
		],
		draw: () =>
			threeColumns(
				"Aktiv → Passiv am Präsensstamm",
				[
					{
						badge: "1",
						fill: "v-green-fill",
						heading: "Personalendungen",
						lines: ["-r (-or) · -ris · -tur", "-mur · -minī · -ntur", "vocātur · dēfenditur", "vocābātur · mittētur"],
						footer: "Genus Verbi Passiv",
					},
					{
						badge: "2",
						fill: "v-coral-fill",
						heading: "Wichtige Ausnahmen",
						lines: ["Präs. mitteris (kurz -e-)", "Fut. I mittēris (lang -ē-)", "Inf. -ārī / -ērī / -īrī", "kons./i: mittī · capī!"],
						footer: "genau prüfen!",
					},
					{
						badge: "3",
						fill: "v-blue-fill",
						heading: "Satzrolle & Urheber",
						lines: ["Objekt → Subjekt (Nom.)", "Person: ā / ab + Abl.", "ā mīlitibus servātur", "Sache: ferrō (Abl.)"],
						footer: "Wovon / Von wem?",
					},
				],
				true,
			),
	},
	"l6-passiv-perfektstamm": {
		title: "Passiv am Perfektstamm: PPP + esse",
		question: "Warum bedeutet 'urbs capta est' Vergangenheit – und wie stimmst du das PPP ab?",
		alt: "Dreiteiliges Schaubild zum Bauplan PPP + esse für Perfekt, Plusquamperfekt und Futur II Passiv sowie Infinitiv Perfekt Passiv.",
		caption: "Das PPP richtet sich in Kasus, Numerus und Genus immer nach dem Subjekt.",
		parts: [
			{
				label: "KNG-Kongruenz des PPP",
				note: "Mārcus laudātus, Iūlia laudāta, oppidum captum, lēgēs datae, cīvēs servātī.",
			},
			{
				label: "Perfekt / Plusq. / Fut. II",
				note: "PPP + sum/est = wurde / ist worden (Perfekt!); + eram/erat = war worden (Plusq.); + erō/erit = Fut. II.",
			},
			{
				label: "Tempusfalle & Inf. Perf.",
				note: "'est' macht aus 'capta est' KEINE Gegenwart! Infinitiv Perfekt Passiv = PPP + esse (laudātus esse).",
			},
		],
		draw: () =>
			threeColumns(
				"Perfekt, Plusquamperfekt und Futur II Passiv",
				[
					{
						badge: "1",
						fill: "v-teal-fill",
						heading: "PPP im KNG",
						lines: ["Puer laudātus", "Puella laudāta", "Templum captum", "Lēgēs scrīptae (f. Pl.)"],
						footer: "wie bonus, -a, -um",
					},
					{
						badge: "2",
						fill: "v-purple-fill",
						heading: "+ Hilfsverb esse",
						lines: ["+ est = Perfekt Passiv", "(wurde / ist ... worden)", "+ erat = Plusq. Passiv", "(war ... worden)"],
						footer: "+ erit = Futur II Pass.",
					},
					{
						badge: "3",
						fill: "v-coral-fill",
						heading: "Falle & Infinitiv",
						lines: ["capta est ≠ wird erobert", "richtig: wurde erobert", "Präsens = capitur", "Inf. Perf. = capta esse"],
						footer: "Tempus exakt halten",
					},
				],
				true,
			),
	},
	"l6-konjunktiv-imperfekt": {
		title: "Konjunktiv Imperfekt: Ein Rezept für alle Verben",
		question: "Wie baust du den Konjunktiv Imperfekt Aktiv und Passiv ohne eine einzige Ausnahme?",
		alt: "Dreiteiliges Schaubild zum Rezept Infinitiv Präsens Aktiv + Personalendung (Aktiv, Passiv und unregelmäßige Verben).",
		caption: "Infinitiv Präsens Aktiv + Endung gilt für a-, e-, kons., i-, kurzvok. i- und alle unregelmäßigen Verben!",
		parts: [
			{
				label: "Aktiv-Formel",
				note: "Infinitiv Präs. Aktiv + -m, -s, -t, -mus, -tis, -nt: vocārem, monērem, mitterem, caperem.",
			},
			{
				label: "Passiv-Formel",
				note: "Infinitiv Präs. Aktiv + -r, -ris, -tur, -mur, -minī, -ntur: vocārer, mitterer, caperētur.",
			},
			{
				label: "Unregelmäßige Verben",
				note: "Genauso ohne Ausnahme: esse → essem, posse → possem, velle → vellem, īre → īrem!",
			},
		],
		draw: () =>
			threeColumns(
				"Ausnahmslose Bildung des Konjunktivs Imperfekt",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "Aktiv (-m/-s/-t...)",
						lines: ["vocāre + t = vocāret", "mittere + nt = mitterent", "capere + m = caperem", "audīre + mus = audīrēmus"],
						footer: "Infinitiv + Aktivendung",
					},
					{
						badge: "2",
						fill: "v-green-fill",
						heading: "Passiv (-r/-ris/-tur...)",
						lines: ["vocāre + tur = vocārētur", "mittere + ris = mitterēris", "capere + ntur = caperentur", "audīre + r = audīrer"],
						footer: "Infinitiv + Passivendung",
					},
					{
						badge: "3",
						fill: "v-purple-fill",
						heading: "Unregelmäßige",
						lines: ["esse → essem, essēs", "posse → possem, posset", "velle / nōlle → vellem", "īre → īrem, īrēs, īret"],
						footer: "keine Ausnahme!",
					},
				],
				false,
			),
	},
	"l6-konjunktiv-plusquamperfekt": {
		title: "Konjunktiv Plusquamperfekt Aktiv und Passiv",
		question: "Wie unterscheidest du Konjunktiv Plusquamperfekt Aktiv (-isse-) und Passiv (PPP + essem)?",
		alt: "Dreiteiliges Schaubild zur Bildung des Konjunktivs Plusquamperfekt Aktiv (-isse-) und Passiv (PPP + essem) sowie seiner zeitlichen Bedeutung.",
		caption: "Er steht für Vorzeitigkeit im Nebensatz (cum) oder Irrealis der Vergangenheit.",
		parts: [
			{
				label: "Aktiv: -isse- + Endung",
				note: "Infinitiv Perfekt Aktiv + Personalendungen: vocāvissem, mīsisset, fuisset, potuissēmus.",
			},
			{
				label: "Passiv: PPP + essem",
				note: "KNG-kongruentes PPP + Konjunktiv Imperfekt von esse: urbs capta esset, cīvēs servātī essent.",
			},
			{
				label: "Wann steht er?",
				note: "Vorzeitigkeit nach 'cum' ('als/nachdem er gemacht hatte') und im Irrealis der Vergangenheit ('hätte').",
			},
		],
		draw: () =>
			threeColumns(
				"Konjunktiv Plusquamperfekt Aktiv vs. Passiv",
				[
					{
						badge: "1",
						fill: "v-purple-fill",
						heading: "Aktiv (-isse-)",
						lines: ["vocāv-isse-m", "mīs-isse-t", "fu-issē-mus · potu-isse-nt", "ī-sse-t / īvisset"],
						footer: "Perfektstamm + -isse-",
					},
					{
						badge: "2",
						fill: "v-teal-fill",
						heading: "Passiv (PPP + essem)",
						lines: ["urbs capta esset", "templum dēlētum esset", "cīvēs servātī essent", "KNG stimmt zum Subjekt"],
						footer: "PPP + Konj. Impf. esse",
					},
					{
						badge: "3",
						fill: "v-orange-fill",
						heading: "Bedeutung im Satz",
						lines: ["cum vēnisset:", "als er gekommen war", "sī vēnisset (Irrealis):", "wenn er gekommen wäre"],
						footer: "immer vorzeitig!",
					},
				],
				false,
			),
	},
	"l6-partizip-praesens-aktiv": {
		title: "Partizip Präsens Aktiv (PPA): gleichzeitig & aktiv",
		question: "Woran erkennst du das PPA, und wie dekliniert dieses Verbaladjektiv?",
		alt: "Dreiteiliges Schaubild zur Bildung (-ns/-ntis), Deklination (3. Dekl. i-Stamm) und Wirkung des PPA (gleichzeitig aktiv).",
		caption: "PPA verbindet einen Verbstamm mit KNG-Endungen der 3. Deklination.",
		parts: [
			{
				label: "Bildung (-ns / -ntis)",
				note: "Präsensstamm + -ns/-ntis (vocāns, mittēns); i-/kurzvok. i-Konj. mit -ē-: audiēns, capiēns; īre: iēns, euntis.",
			},
			{
				label: "Deklination (3. Dekl.)",
				note: "m./f. Akk. Sg. -ntem, Pl. -ntēs; Ntr. Pl. -ntia; Gen. Pl. -ntium; Abl. Sg. -nte / -ntī.",
			},
			{
				label: "Funktion (gleichzeitig)",
				note: "Bezugswort handelt gleichzeitig aktiv mit ('Mīles pugnāns clāmat') und nimmt Objekte mit.",
			},
		],
		draw: () =>
			threeColumns(
				"Partizip Präsens Aktiv (PPA)",
				[
					{
						badge: "1",
						fill: "v-green-fill",
						heading: "Bildung",
						lines: ["vocāns, vocantis", "mittēns, mittentis", "audiēns · capiēns", "īre → iēns, euntis"],
						footer: "Signal: -ns / -nt-",
					},
					{
						badge: "2",
						fill: "v-blue-fill",
						heading: "Deklination (3. Dekl.)",
						lines: ["m./f. Akk. -ntem", "Nom./Akk. Pl. -ntēs", "Gen. Pl. -ntium", "Ntr. Pl. -ntia"],
						footer: "KNG zum Bezugswort",
					},
					{
						badge: "3",
						fill: "v-orange-fill",
						heading: "Sinn im Satz",
						lines: ["gleichzeitig + aktiv", "puerōs lūdentēs", "die spielenden Jungen", "(kann Akk.-Obj. regieren)"],
						footer: "Adjektiv & Verb zugleich",
					},
				],
				false,
			),
	},
	"l6-partizip-perfekt-passiv": {
		title: "Partizip Perfekt Passiv (PPP): vorzeitig & passiv",
		question: "Wie unterscheidest du ein PPP allein vom zusammengesetzten Perfekt Passiv?",
		alt: "Dreiteiliges Schaubild zu 3. Stammform (-us/-a/-um), a-/o-Deklination und dem Einsatz ohne vs. mit esse.",
		caption: "Ohne esse ist das PPP Attribut/PC; zusammen mit esse bildet es ein volles Passivprädikat.",
		parts: [
			{
				label: "3. Stammform lernen",
				note: "vocātus, monitus, missus, audītus, captus, gestus, scrīptus, victus, dēlētus (-us, -a, -um).",
			},
			{
				label: "Zeit & Passivrichtung",
				note: "Immer abgeschlossen (vorzeitig) und passiv ('urbs capta' = die eingenommene Stadt).",
			},
			{
				label: "Mit esse vs. ohne esse",
				note: "Mit esse: 'Urbs capta est' (Prädikat Passiv). Ohne esse: 'Urbem captam incendērunt' (PC/Attribut).",
			},
		],
		draw: () =>
			threeColumns(
				"Partizip Perfekt Passiv (PPP)",
				[
					{
						badge: "1",
						fill: "v-purple-fill",
						heading: "Stammform (-us/-a/-um)",
						lines: ["vocō → vocātus", "mittō → missus", "capiō → captus", "vincō → victus"],
						footer: "a-/o-Dekl. wie bonus",
					},
					{
						badge: "2",
						fill: "v-coral-fill",
						heading: "Bedeutung",
						lines: ["vorzeitig (abgeschlossen)", "+ passiv (erlitten)", "epistula scrīpta =", "der geschriebene Brief"],
						footer: "Gegenpol zum PPA",
					},
					{
						badge: "3",
						fill: "v-teal-fill",
						heading: "Rolle im Satz",
						lines: ["mit esse: capta est", "= wurde erobert", "ohne esse: urbem captam", "= Attribut / PC-Block"],
						footer: "auf esse achten!",
					},
				],
				false,
			),
	},
	"l6-praedikativum-doppelter-kasus": {
		title: "Prädikativum, doppelter Nominativ und doppelter Akkusativ",
		question: "Wie übersetzt du ein Nomen oder Adjektiv, das direkt eine Rolle während der Handlung nennt?",
		alt: "Dreiteiliges Schaubild zu Prädikativum (Adverb / 'als ...'), doppeltem Akkusativ (Aktiv) und doppeltem Nominativ (Passiv).",
		caption: "Im Deutschen klingen Prädikativa oft wie Adverbien oder Ausdrücke mit 'als / zum'.",
		parts: [
			{
				label: "Prädikativum im KNG",
				note: "laetus (froh), invītus (ungern), sōlus (allein), prīmus (als Erster), puer (als Knabe).",
			},
			{
				label: "Doppelter Akkusativ",
				note: "Aktiv: appellāre, creāre, vocāre, docēre + zweimal Akkusativ (Scīpiōnem cōnsulem creāre).",
			},
			{
				label: "Doppelter Nominativ",
				note: "Passiv: appellārī, creārī, habērī, vidērī + zweimal Nominativ (Scīpiō cōnsul creātus est).",
			},
		],
		draw: () =>
			threeColumns(
				"Rollen und Titel im lateinischen Satz",
				[
					{
						badge: "1",
						fill: "v-orange-fill",
						heading: "Prädikativum",
						lines: ["Puer prīmus vēnit", "→ kam als Erster", "Fīlia invīta discessit", "→ ging ungern fort"],
						footer: "Zustand während Tun",
					},
					{
						badge: "2",
						fill: "v-blue-fill",
						heading: "Doppelter Akk. (Akt.)",
						lines: ["cōnsulem creāre", "patrem appellāre", "puerōs litterās docēre", "Person + Amt/Sache"],
						footer: "im Aktiv",
					},
					{
						badge: "3",
						fill: "v-teal-fill",
						heading: "Doppelter Nom. (Pass.)",
						lines: ["Scīpiō cōnsul creātus", "est = zum Konsul", "Rōma caput appellātur", "Gleichsetzung"],
						footer: "im Passiv",
					},
				],
				true,
			),
	},
	"l6-kasusfunktionen-gen-dat-abl": {
		title: "Erweiterte Kasusfunktionen: Genitiv, Dativ, Ablativ",
		question: "Wann übersetzt man denselben Genitiv als 'des …' und wann mit 'vor / auf / nach'?",
		alt: "Dreiteiliges Schaubild zu Gen. subiectīvus/obiectīvus, Gen./Abl. quālitātis und Dat. commodī/fīnālis.",
		caption: "Der Kontext entscheidet die logische Richtung von Genitiv und Dativ.",
		parts: [
			{
				label: "Gen. subiectīvus / obiectīvus",
				note: "amor patris (Liebe des Vaters) vs. metus hostium (Furcht vor den Feinden = Ziel!).",
			},
			{
				label: "Gen. & Abl. quālitātis",
				note: "Beschaffenheit immer mit Adjektiv: vir magnae virtūtis / vir magnō ingeniō ('von ...').",
			},
			{
				label: "Dat. commodī & fīnālis",
				note: "Vorteil (für wen? amīcīs) und Zweck (wozu? auxiliō venīre = zu Hilfe kommen).",
			},
		],
		draw: () =>
			threeColumns(
				"Präzise Bedeutungen der Kasus in Klasse 6",
				[
					{
						badge: "1",
						fill: "v-purple-fill",
						heading: "Gen. subi. / obi.",
						lines: ["amor mātris (Täter)", "→ Liebe der Mutter", "metus hostium (Ziel)", "→ Furcht vor Feinden"],
						footer: "Subjekt vs. Objekt",
					},
					{
						badge: "2",
						fill: "v-gold-fill",
						heading: "Beschaffenheit (+ Adj.)",
						lines: ["vir summae virtūtis", "(Gen. quālitātis)", "vir magnō ingeniō", "(Abl. quālitātis)"],
						footer: "dt. 'von großer ...'",
					},
					{
						badge: "3",
						fill: "v-green-fill",
						heading: "Dat. commodī & fīnālis",
						lines: ["cīvibus auxiliō venīre", "cīvibus = für wen?", "auxiliō = wozu?", "→ zur Hilfe kommen"],
						footer: "Vorteil + Zweck",
					},
				],
				false,
			),
	},
	"l6-konjunktiv-irrealis": {
		title: "Der Irrealis: Konjunktiv Imperfekt vs. Plusquamperfekt",
		question: "Woran erkennst du, ob etwas jetzt oder damals nur gedacht und unwirklich ist?",
		alt: "Dreiteiliges Schaubild zum Irrealis der Gegenwart (Konj. Imperfekt) und Irrealis der Vergangenheit (Konj. Plusquamperfekt) sowie Allein-Hauptsatz.",
		caption: "Nicht die Endung allein, sondern das Konjunktiv-Tempus steuert die irreale Zeitstufe.",
		parts: [
			{
				label: "Irrealis Gegenwart",
				note: "Konjunktiv Imperfekt → heute nicht wahr: Sī adesset, laetī essēmus (Wenn er jetzt da wäre...).",
			},
			{
				label: "Irrealis Vergangenheit",
				note: "Konjunktiv Plusquamperfekt → damals nicht wahr: Sī adfuisset, nōn periissēmus (wäre... gewesen).",
			},
			{
				label: "Ohne sī-Nebensatz",
				note: "Auch allein im Hauptsatz: Vellem (ich möchte gern), Sine vōbīs perīrem / periissem.",
			},
		],
		draw: () =>
			threeColumns(
				"Die beiden Zeitstufen der Nichtwirklichkeit",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "Gegenwart (Konj. Impf.)",
						lines: ["Sī pecūniam habērem,", "domum emerem.", "Wenn ich jetzt hätte,", "würde ich kaufen."],
						footer: "heute unwirklich",
					},
					{
						badge: "2",
						fill: "v-purple-fill",
						heading: "Vergang. (Konj. Plusq.)",
						lines: ["Sī pecūniam habuissem,", "domum ēmissem.", "Wenn ich gehabt hätte,", "hätte ich gekauft."],
						footer: "damals verpasst",
					},
					{
						badge: "3",
						fill: "v-teal-fill",
						heading: "Passiv & ohne sī",
						lines: ["nōn capta esset", "wäre nicht erobert", "worden", "Sine tē periissem."],
						footer: "Konjunktiv II im Dt.",
					},
				],
				false,
			),
	},
	"l6-final-konsekutiv-ut": {
		title: "Finalsätze (ut / nē) vs. Konsekutivsätze (ut / ut nōn)",
		question: "Wie unterscheidest du Absicht ('damit') von Folge ('sodass') beim selben Wort ut?",
		alt: "Dreiteiliges Schaubild zur Unterscheidung von Finalsatz (Wozu?, verneint nē), Konsekutivsatz (Korrelat tam/ita/tantus, verneint ut nōn) und Indikativ-ut.",
		caption: "Signalwörter im Hauptsatz und die Verneinungsform trennen beide Sätze messerscharf.",
		parts: [
			{
				label: "Finalsatz (Absicht)",
				note: "Frage 'Wozu?': ut = 'damit' (um zu); Verneinung immer nē = 'damit nicht'.",
			},
			{
				label: "Konsekutivsatz (Folge)",
				note: "Angekündigt durch tam/ita/sīc/tantus ... ut = 'sodass'; Verneinung immer ut nōn!",
			},
			{
				label: "Achtung: ut + Indikativ",
				note: "Ohne Konjunktiv bedeutet ut meist 'wie' (Vergleich) oder zeitlich 'sobald als'.",
			},
		],
		draw: () =>
			threeColumns(
				"Signalprobe für ut-Nebensätze",
				[
					{
						badge: "1",
						fill: "v-green-fill",
						heading: "Final (Absicht)",
						lines: ["Frage: Wozu?", "ut = damit / um ... zu", "Verneinung: nē!", "nē urbs caperētur"],
						footer: "Ziel im Konjunktiv",
					},
					{
						badge: "2",
						fill: "v-orange-fill",
						heading: "Konsekutiv (Folge)",
						lines: ["tam · ita · tantus ... ut", "→ sodass (im Dt. Ind.!)", "Verneinung: ut nōn!", "ut cīvēs nōn vidērent"],
						footer: "Wirkung / Folge",
					},
					{
						badge: "3",
						fill: "v-blue-fill",
						heading: "Kontrolle: Indikativ",
						lines: ["ut + Indikativ =", "'wie' oder 'sobald'", "z. B. ut scrīpsī", "= wie ich schrieb"],
						footer: "Modus prüfen!",
					},
				],
				false,
			),
	},
	"l6-cum-nebensaetze": {
		title: "Orientierung bei cum: Präposition, Indikativ & Konjunktiv",
		question: "Wie wählst du zwischen 'mit', 'als/nachdem', 'da/weil' und 'obwohl'?",
		alt: "Dreiteiliges Schaubild zu cum als Präposition (+ Abl.), cum + Indikativ und cum + Konjunktiv (nārrātīvum, causāle, concessīvum).",
		caption: "Schau zuerst nach dem Kasus oder Modus hinter cum, danach auf ein Signalwort wie tamen.",
		parts: [
			{
				label: "Präposition vs. Indikativ",
				note: "cum + Ablativ (ohne Verb) = 'mit'. cum + Indikativ = rein zeitlich 'als / wenn / sooft'.",
			},
			{
				label: "nārrātīvum & causāle",
				note: "cum + Konjunktiv: zeitlich-erzählend 'als/nachdem' oder begründend 'da/weil' (Impf.=glz., Plusq.=vz.).",
			},
			{
				label: "concessīvum (+ tamen)",
				note: "Steht im Hauptsatz 'tamen' ('dennoch'), heißt cum + Konjunktiv fast immer 'obwohl'.",
			},
		],
		draw: () =>
			threeColumns(
				"Die fünf Gesichter von cum",
				[
					{
						badge: "1",
						fill: "v-gold-fill",
						heading: "+ Ablativ / + Ind.",
						lines: ["cum amīcīs (+ Abl.)", "= mit den Freunden", "cum + Indikativ", "= wenn / sooft / als"],
						footer: "kein Konjunktiv",
					},
					{
						badge: "2",
						fill: "v-purple-fill",
						heading: "nārrātīvum & causāle",
						lines: ["cum + Konj. Impf./Plusq.", "Erzählung: als/nachdem", "Begründung: da / weil", "(Zeitstufe beachten!)"],
						footer: "Sinn aus Kontext",
					},
					{
						badge: "3",
						fill: "v-coral-fill",
						heading: "concessīvum",
						lines: ["cum + Konjunktiv", "... im Hauptsatz: tamen!", "Cum perīculum esset,", "tamen nōn fūgērunt = obwohl"],
						footer: "Signalwort tamen!",
					},
				],
				false,
			),
	},
	"l6-passiver-aci": {
		title: "Der passive AcI im Zeitstufensystem",
		question: "Wie stimmt das Zeit- und KNG-System beim passiven Infinitiv Präsens und Perfekt im AcI?",
		alt: "Dreiteiliges Schaubild zum Aufbau des passiven AcI, gleichzeitiger Infinitiv Präsens Passiv (-ārī/-ī) und vorzeitiger Infinitiv Perfekt Passiv (PPP im Akkusativ + esse).",
		caption: "Im vorzeitigen passiven AcI steht das PPP immer im Akkusativ (wie das AcI-Subjekt).",
		parts: [
			{
				label: "3-Schritte-Bauplan",
				note: "Kopfverb + ', dass' → Subjektsakkusativ wird deutsches Subjekt → Passiv-Prädikat im 'dass'-Satz.",
			},
			{
				label: "Gleichzeitig (-ārī/-ī)",
				note: "Inf. Präs. Passiv: wird (bei Kopfverb Präs.) / wurde (bei Kopfverb Vergangenheit) gemacht.",
			},
			{
				label: "Vorzeitig (PPP + esse)",
				note: "KNG im Akkusativ! urbem captam esse = dass die Stadt eingenommen worden ist / worden war.",
			},
		],
		draw: () =>
			threeColumns(
				"Passiver AcI: Gleichzeitig vs. Vorzeitig",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "Satzklammer",
						lines: ["Nūntius dīcit / dīxit", "[urbem ā mīlitibus ...]", "Subjektsakkusativ =", "deutsches Passivsubjekt"],
						footer: "Urheber mit ā/ab",
					},
					{
						badge: "2",
						fill: "v-teal-fill",
						heading: "Gleichzeitig (-ārī/-ī)",
						lines: ["urbem dēfendī", "Präs. dīcit → verteidigt wird", "Verg. dīxit → verteidigt", "wurde"],
						footer: "Inf. Präs. Passiv",
					},
					{
						badge: "3",
						fill: "v-purple-fill",
						heading: "Vorzeitig (Akk. + esse)",
						lines: ["urbem captam esse", "fēminās servātās esse", "→ worden ist / war", "(PPP immer im Akk.!)"],
						footer: "Inf. Perf. Passiv",
					},
				],
				true,
			),
	},
	"l6-participium-coniunctum": {
		title: "Participium Coniunctum (PC): Klammer und vier Übersetzungswege",
		question: "Wie grenzt du ein PC ab – und welche vier Übersetzungsmöglichkeiten stehen zur Wahl?",
		alt: "Dreiteiliges Schaubild zur KNG-Klammer [Nomen ... Partizip], Zeitverhältnis PPA/PPP und den vier deutschen Auflösungen.",
		caption: "Erst die KNG-Brücke schließen, dann die für den Text beste deutsche Form wählen.",
		parts: [
			{
				label: "KNG-Klammer finden",
				note: "Bezugswort + Partizip teilen Kasus, Numerus, Genus; Erweiterungen stehen dazwischen.",
			},
			{
				label: "PPA vs. PPP prüfen",
				note: "PPA (-ns/-ntis) = gleichzeitig aktiv; PPP (-tus/-a/-um) = vorzeitig passiv.",
			},
			{
				label: "Vier Übersetzungswege",
				note: "1. Relativsatz · 2. Adverbialsatz (als/nachdem/weil/obwohl) · 3. Beiordnung ('und') · 4. Substantivierung.",
			},
		],
		draw: () =>
			threeColumns(
				"Vom PC-Block zur flüssigen Übersetzung",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "KNG-Klammer",
						lines: ["Dux [ab hostibus victus]", "pācem petīvit.", "dux (Nom. Sg. m.)", "↔ victus (Nom. Sg. m.)"],
						footer: "Block einschließen",
					},
					{
						badge: "2",
						fill: "v-orange-fill",
						heading: "Zeit & Richtung",
						lines: ["PPA pugnāns:", "während er kämpft", "PPP victus:", "nachdem er besiegt wurde"],
						footer: "glz. akt. vs. vz. pass.",
					},
					{
						badge: "3",
						fill: "v-green-fill",
						heading: "4 Auflösungen im Dt.",
						lines: ["1. Relativsatz (der ...)", "2. weil / nachdem / obwohl", "3. ... wurde besiegt und ...", "4. Nach der Niederlage ..."],
						footer: "auch post urbem captam",
					},
				],
				true,
			),
	},
};
