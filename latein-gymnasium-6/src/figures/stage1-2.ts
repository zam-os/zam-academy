import { type ConceptFigure, threeColumns } from "./draw";

export const STAGE1_2_FIGURES: Record<string, ConceptFigure> = {
	"l6-kontext-wortschatz": {
		title: "Kontext entscheidet: agere, petere und rēs",
		question: "Warum bedeuten dieselben Grundwörter im Satz plötzlich etwas ganz anderes?",
		alt: "Dreiteiliges Schaubild zur Kontextbedeutung bei agere, petere und res.",
		caption: "Mitspieler (Objekt, Präposition, Adjektiv) legen die treffende Übersetzung fest.",
		parts: [
			{
				label: "agere im Kontext",
				note: "grātiās agere = danken; vītam agere = leben; cum cīvibus dē pāce agere = verhandeln.",
			},
			{
				label: "petere nach Objekt",
				note: "urbem petere = eine Stadt ansteuern; auxilium ā senātū petere = um Hilfe bitten.",
			},
			{
				label: "rēs & signum",
				note: "rēs pūblica = Staat, rēs gestae = Taten; signum = Zeichen, Feldzeichen oder Statue.",
			},
		],
		draw: () =>
			threeColumns(
				"Mehrdeutigkeit über Satzpartner klären",
				[
					{
						badge: "1",
						fill: "v-orange-fill",
						heading: "agere",
						lines: ["grātiās agere", "→ Dank abstatten", "cum cīvibus agere", "→ verhandeln"],
						footer: "Kern: betreiben",
					},
					{
						badge: "2",
						fill: "v-teal-fill",
						heading: "petere",
						lines: ["urbem petere", "→ Stadt ansteuern", "auxilium petere", "→ um Hilfe bitten"],
						footer: "Objekt entscheidet",
					},
					{
						badge: "3",
						fill: "v-gold-fill",
						heading: "rēs & signum",
						lines: ["rēs pūblica = Staat", "rēs gestae = Taten", "signum dare / portāre", "Signal · Standarte"],
						footer: "Sinn prüfen",
					},
				],
				false,
			),
	},
	"l6-wortfelder-familien": {
		title: "Ordnung im 900-Wörter-Netz: Familie vs. Sachfeld",
		question: "Wie unterscheidest du gemeinsame Wurzel (Wortfamilie) und gemeinsames Thema (Sachfeld)?",
		alt: "Dreiteiliges Schaubild zu Wortfamilien scrīb-/dūc- und dem Sachfeld Vesuvausbruch.",
		caption: "Beide Ordnungen verknüpfen neue Jgst.-6-Vokabeln mit bekanntem Wissen.",
		parts: [
			{
				label: "Wortfamilie scrīb-",
				note: "Gleicher Stamm (schreiben): scrībere, scrīptor (Autor), dēscrībere, īnscrīptiō (Inschrift).",
			},
			{
				label: "Wortfamilie dūc-",
				note: "Gleicher Stamm (führen): dūcere, dux (Anführer), prōdūcere (hervorführen), ēducāre.",
			},
			{
				label: "Sachfeld Vesuv / Staat",
				note: "Verschiedene Wurzeln unter einem Thema: mōns, ignis, cinis, fūmus oder cōnsul, lēx, tribūnus.",
			},
		],
		draw: () =>
			threeColumns(
				"Zwei Wege zum sicheren Wortschatznetz",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "Wortfamilie scrīb-",
						lines: ["scrībere (Verb)", "scrīptor (Person)", "īnscrīptiō (Subst.)", "dēscrībere (Komp.)"],
						footer: "gleiche Wurzel",
					},
					{
						badge: "2",
						fill: "v-teal-fill",
						heading: "Wortfamilie dūc-",
						lines: ["dūcere (führen)", "dux, ducis (Führer)", "ēducāre (erziehen)", "prōdūcere (vorführen)"],
						footer: "über Wortarten hinweg",
					},
					{
						badge: "3",
						fill: "v-coral-fill",
						heading: "Sachfeld Vesuv",
						lines: ["mōns (Berg)", "ignis (Feuer)", "cinis (Asche)", "fūmus (Rauch)"],
						footer: "gleiches Thema",
					},
				],
				false,
			),
	},
	"l6-wortbildung-erschliessen": {
		title: "Erweiterte Wortbildung: Präfix + Stamm + Suffix",
		question: "Wie zerlegst du längere Wörter in bekannte Bausteine?",
		alt: "Dreiteiliges Schaubild zu Präfixen (con-, trāns-, ob-), Suffixen (-bilis, -tūdō, -mentum) und Satzzusammenhang.",
		caption: "Zerlegen spart das Nachschlagen und verankert Bedeutungen doppelt.",
		parts: [
			{
				label: "Neue Verb-Präfixe",
				note: "con- (zusammen), dē- (herab), dis- (auseinander), ob- (entgegen), trāns- (hinüber).",
			},
			{
				label: "Neue Nomen-Suffixe",
				note: "-bilis (-bar/-lich), -tūdō (Eigenschaft f.), -mentum (Mittel/Ergebnis n.).",
			},
			{
				label: "Erschließen im Satz",
				note: "Bausteine zuerst wörtlich kombinieren (in-crēd-ibilis = un-glaub-lich), dann am Satz prüfen.",
			},
		],
		draw: () =>
			threeColumns(
				"Bausteine für unbekannte Wörter",
				[
					{
						badge: "1",
						fill: "v-orange-fill",
						heading: "Präfixe (Richtung)",
						lines: ["con-venīre (zusammen)", "trāns-īre (hinüber)", "dē-scendere (herab)", "ob-sistere (entgegen)"],
						footer: "vor dem Verbstamm",
					},
					{
						badge: "2",
						fill: "v-purple-fill",
						heading: "Suffixe (Wortart)",
						lines: ["-bilis → mīrābilis", "-tūdō → magnitūdō", "-mentum → monumentum", "dis-cēdere (fortgehen)"],
						footer: "Adjektiv oder Nomen",
					},
					{
						badge: "3",
						fill: "v-green-fill",
						heading: "Praxisbeispiel",
						lines: ["in + crēd + ibilis", "un + glaub + lich", "magni + tūdō", "= Größe"],
						footer: "im Kontext testen",
					},
				],
				true,
			),
	},
	"l6-wendungen-inschriften": {
		title: "Wendungen und Inschriften richtig deuten",
		question: "Warum darf man feste Wendungen nicht starr Wort für Wort stehen lassen?",
		alt: "Dreiteiliges Schaubild zu festen Wendungen (bellum gerere, castra pōnere), Inschriftenkürzeln (D. D., P. P., V. S. L. M.) und deutschem Zieltext.",
		caption: "Präge dir Verb-Objekt-Verbindungen als feste Einheit ein.",
		parts: [
			{
				label: "Feste Wortpaare",
				note: "bellum gerere (Krieg führen), castra pōnere (Lager aufschlagen), fidem servāre (Treue halten).",
			},
			{
				label: "Altar & Bauinschrift",
				note: "D. D. (dōnō dedit = gestiftet), P. P. (pecūniā pūblicā), V. S. L. M. (Gelübde erfüllt).",
			},
			{
				label: "In unserem Umfeld",
				note: "Jahreszahlen bis M (z. B. MDCCLXX) und Abkürzungen an Rathäusern, Kirchen und Museen.",
			},
		],
		draw: () =>
			threeColumns(
				"Kollokationen und Steininschriften entschlüsseln",
				[
					{
						badge: "1",
						fill: "v-teal-fill",
						heading: "Wortverbindungen",
						lines: ["bellum gerere", "→ Krieg führen", "castra pōnere", "→ Lager aufschlagen"],
						footer: "als Block lernen",
					},
					{
						badge: "2",
						fill: "v-gold-fill",
						heading: "Inschriften (Stein)",
						lines: ["D. D. = dōnō dedit", "P. P. = pecūniā pūbl.", "V. S. L. M. (Gelübde)", "S. P. Q. R. · D. M."],
						footer: "Altar & Bauwerk",
					},
					{
						badge: "3",
						fill: "v-blue-fill",
						heading: "Gutes Deutsch",
						lines: ["fidem servāre", "→ Wort halten", "memoriā tenēre", "→ im Sinn behalten"],
						footer: "Treffend übersetzen",
					},
				],
				false,
			),
	},
	"l6-englisch-romanisch": {
		title: "Sprachbrücken zu Englisch (2. FS) und Romanisch",
		question: "Wie erkennst du hinter englischen Lernwörtern sofort deine Latein-Vokabeln?",
		alt: "Dreiteiliges Schaubild zur Sprachverwandtschaft von Latein über Englisch bis zu romanischen Sprachen und deutschen Fremdwörtern.",
		caption: "Wer Latein beherrscht, entschlüsselt englische und romanische Wörter im Flug.",
		parts: [
			{
				label: "Latein als Quelle",
				note: "Verbstämme und abstrakte Suffixe wanderten ins Französische und direkt ins Englische.",
			},
			{
				label: "Muster zum Englischen",
				note: "-tās → -ty (lībertās → liberty), -ōria → -ory (victōria → victory), -ibilis → -ible.",
			},
			{
				label: "Europäisches Netz",
				note: "Dieselben Stämme erscheinen im Deutschen (Fremdwort) und in allen romanischen Sprachen.",
			},
		],
		draw: () =>
			threeColumns(
				"Von Rom ins Englische und in die Nachbarsprachen",
				[
					{
						badge: "1",
						fill: "v-orange-fill",
						heading: "Latein (Basis)",
						lines: ["dēfendere", "lībertās", "memoria", "incrēdibilis"],
						footer: "Ursprungswort",
					},
					{
						badge: "2",
						fill: "v-blue-fill",
						heading: "Englisch (2. FS)",
						lines: ["to defend", "liberty", "memory", "incredible"],
						footer: "gleicher Stamm",
					},
					{
						badge: "3",
						fill: "v-green-fill",
						heading: "Romanisch & Dt.",
						lines: ["frz. défendre / liberté", "it. memoria / libertà", "dt. defensiv / Division", "victōria → victory"],
						footer: "Brücke durch Europa",
					},
				],
				true,
			),
	},
	"l6-dritte-deklination-adjektive": {
		title: "3. Deklination: Normale i-Stämme vs. dīves, pauper, vetus",
		question: "Wann endet ein Adjektiv der 3. Deklination auf -e/-um/-a statt -ī/-ium/-ia?",
		alt: "Dreiteiliges Schaubild zur Unterscheidung zwischen i-stämmigen Adjektiven (fortis) und konsonantischen Adjektiven (dīves, pauper, vetus).",
		caption: "Merke das Trio dīves, pauper, vetus als reine konsonantische Ausnahme.",
		parts: [
			{
				label: "Neue 3.-Dekl.-Nomen",
				note: "Stammveränderung im Genitiv genau lernen: iter → itineris n., cinis → cineris m., scelus → sceleris n.",
			},
			{
				label: "Regel: i-Adjektive",
				note: "fortis/-e, ācer/-cris/-cre, fēlīx (-īcis): Abl. Sg. -ī, Gen. Pl. -ium, Neutrum Pl. -ia.",
			},
			{
				label: "Sonderklasse: dīves/pauper/vetus",
				note: "Rein konsonantisch! Abl. Sg. -e (paupere, vetere), Gen. Pl. -um (veterum), Neutrum Pl. vetera.",
			},
		],
		draw: () =>
			threeColumns(
				"Adjektive der 3. Deklination sauber trennen",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "Substantive (Gen.!)",
						lines: ["iter, itineris n.", "cinis, cineris m.", "scelus, sceleris n.", "rēx, rēgis m."],
						footer: "Stamm vom Genitiv",
					},
					{
						badge: "2",
						fill: "v-teal-fill",
						heading: "Normale i-Adjektive",
						lines: ["fortis, -e · ācer · fēlīx", "Abl. Sg.: fortī", "Gen. Pl.: fortium", "Ntr. Pl.: fortia"],
						footer: "-ī · -ium · -ia",
					},
					{
						badge: "3",
						fill: "v-coral-fill",
						heading: "dīves, pauper, vetus",
						lines: ["konsonantische Gruppe", "Abl. Sg.: paupere / vetere", "Gen. Pl.: veterum / dīvitum", "Ntr. Pl.: vetera"],
						footer: "-e · -um · -a",
					},
				],
				false,
			),
	},
	"l6-demonstrativa-hic-ille-iste": {
		title: "Blickwinkel der Demonstrativa: hic, ille, iste",
		question: "Worauf zeigen hic, ille und iste im Raum und im Urteil des Sprechers?",
		alt: "Dreiteiliges Schaubild zu hic (beim Sprecher), iste (beim Gegenüber/kritisch) und ille (in der Ferne/berühmt).",
		caption: "Pronominale Sonderformen im Singular: huius/huic (hic), illīus/illī (ille) und istīus/istī (iste).",
		parts: [
			{
				label: "hic, haec, hoc",
				note: "Hier bei mir (1. Person): hunc/hanc/hoc; Gen. huius, Dat. huic; haec = f. Sg. UND n. Pl.!",
			},
			{
				label: "iste, ista, istud",
				note: "Dort bei dir (2. Person) – im Gericht und Streit oft abwertend ('dieser Kerl da').",
			},
			{
				label: "ille, illa, illud",
				note: "Dort drüben / in der Ferne (3. Person) – oft anerkennend ('jener berühmte ...').",
			},
		],
		draw: () =>
			threeColumns(
				"Die drei Zeigepronomina nach Nähe und Wertung",
				[
					{
						badge: "1",
						fill: "v-green-fill",
						heading: "hic, haec, hoc",
						lines: ["bei mir / gegenwärtig", "Gen. huius · Dat. huic", "Akk. hunc / hanc / hoc", "haec = f. Sg. / n. Pl."],
						footer: "dieser hier (nah)",
					},
					{
						badge: "2",
						fill: "v-coral-fill",
						heading: "iste, ista, istud",
						lines: ["bei dir / gegenüber", "Gen. istīus · Dat. istī", "oft kritisch/abwertend:", "'dieser da!'"],
						footer: "gegenüber",
					},
					{
						badge: "3",
						fill: "v-blue-fill",
						heading: "ille, illa, illud",
						lines: ["dort drüben / entfernt", "Gen. illīus · Dat. illī", "oft rühmend:", "'ille Homērus'"],
						footer: "jener berühmte",
					},
				],
				true,
			),
	},
	"l6-idem-ipse": {
		title: "Unterscheidung īdem (derselbe) vs. ipse (selbst)",
		question: "Wann steht īdem, wann ipse – und wann braucht man stattdessen sē?",
		alt: "Dreiteiliges Schaubild zur Abgrenzung von īdem (Identität), ipse (Hervorhebung) und sē (Reflexiv).",
		caption: "Verwechsle niemals Hervorhebung (ipse = persönlich) mit Rückbezug (sē = sich).",
		parts: [
			{
				label: "īdem, eadem, idem",
				note: "is/ea/id + -dem ('derselbe'); Lautwandel m→n vor d: eundem, eandem, eōrundem.",
			},
			{
				label: "ipse, ipsa, ipsum",
				note: "'selbst / persönlich' (Gen. ipsīus, Dat. ipsī). Betont Nomen/Subjekt neben sich.",
			},
			{
				label: "Kontrast zu sē",
				note: "Cōnsul ipse laudat (persönlich) vs. Cōnsul sē laudat (lobt sich selbst als Objekt).",
			},
		],
		draw: () =>
			threeColumns(
				"Identität, Hervorhebung und Rückbezug auseinanderhalten",
				[
					{
						badge: "1",
						fill: "v-purple-fill",
						heading: "īdem, eadem, idem",
						lines: ["= derselbe / dasselbe", "eōdem diē (Abl.)", "eundem / eandem (Akk.)", "is + -dem (-md- → -nd-)"],
						footer: "Identität",
					},
					{
						badge: "2",
						fill: "v-teal-fill",
						heading: "ipse, ipsa, ipsum",
						lines: ["= selbst / persönlich", "Gen. ipsīus · Dat. ipsī", "Dea ipsa iūvit", "(höchstpersönlich)"],
						footer: "Hervorhebung",
					},
					{
						badge: "3",
						fill: "v-orange-fill",
						heading: "vs. sē / suus (Reflexiv)",
						lines: ["Cōnsul ipse vēnit", "= Der Konsul selbst kam", "Cōnsul sē laudat", "= lobt sich selbst"],
						footer: "nie verwechseln!",
					},
				],
				false,
			),
	},
	"l6-numeralia-1000": {
		title: "Zahlen bis 1000: Grundzeichen, Subtraktion und mīlia",
		question: "Wie liest man jede römische Zahl bis M (1000) – und wann regiert 'tausend' den Genitiv?",
		alt: "Dreiteiliges Schaubild zu den sieben Zeichen I–M, Subtraktionspaaren (XL, XC, CD, CM) und mīlle vs. mīlia.",
		caption: "mīlle ist ein unveränderliches Adjektiv; mīlia verlangt als Nomen den Genitiv Plural.",
		parts: [
			{
				label: "Sieben Zeichen I–M",
				note: "I (1), V (5), X (10), L (50), C (100), D (500), M (1000). Rechts stehendes wird addiert.",
			},
			{
				label: "Subtraktionspaare",
				note: "Ein kleineres I/X/C links vor dem Nächstgrößeren zieht ab: IV=4, IX=9, XL=40, XC=90, CD=400, CM=900.",
			},
			{
				label: "mīlle vs. mīlia + Gen.",
				note: "mīlle mīlitēs (1000 Soldaten), aber duo mīlia mīlitum (zweitausend [an] Soldaten).",
			},
		],
		draw: () =>
			threeColumns(
				"Das römische Zahlensystem bis 1000",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "Sieben Zeichen",
						lines: ["I = 1 · V = 5 · X = 10", "L = 50 · C = 100", "D = 500 · M = 1000", "LXXIX = 79 · CCXVIII = 218"],
						footer: "Addition nach rechts",
					},
					{
						badge: "2",
						fill: "v-orange-fill",
						heading: "Subtraktion links",
						lines: ["IV = 4 · IX = 9", "XL = 40 · XC = 90", "CD = 400 · CM = 900", "Beispiel: CDXLIV = 444"],
						footer: "nur I, X, C vorab",
					},
					{
						badge: "3",
						fill: "v-teal-fill",
						heading: "mīlle & mīlia",
						lines: ["Sg. mīlle mīlitēs", "(unveränderlich)", "Pl. duo mīlia mīlitum", "(+ Genitiv Plural!)"],
						footer: "Ordinalia: centēsimus",
					},
				],
				false,
			),
	},
	"l6-stammformen-ire": {
		title: "Das Verb īre (gehen) und wichtige Stammformen",
		question: "Wann springt der Stamm von īre auf e-, und wie beugen die Komposita?",
		alt: "Dreiteiliges Schaubild zu īre im Präsensstamm (eō/īs/it/eunt, ībam, ībō), Perfekt (iī/īstī/iērunt) und Komposita.",
		caption: "Vor a, o, u (eō, eunt, euntis) wechselt ī- zu e-; im Perfekt heißt es iī, īstī, iit, iērunt.",
		parts: [
			{
				label: "Präsensstamm (ī- / e-)",
				note: "eō, īs, it, īmus, ītis, eunt · Impf. ībam · Fut. I ībō · PPA iēns, euntis.",
			},
			{
				label: "Perfektstamm (i-)",
				note: "iī, īstī, iit, iimus, īstis, iērunt; Plusq. ieram; Inf. Perf. īsse / īvisse.",
			},
			{
				label: "Komposita & Stammformen",
				note: "adīre, exīre, trānsīre, redīre (-d-!), perīre; dazu scrībō/scrīpsī/scrīptum u. a.",
			},
		],
		draw: () =>
			threeColumns(
				"īre (gehen) und seine Zusammensetzungen",
				[
					{
						badge: "1",
						fill: "v-teal-fill",
						heading: "Präsens, Impf., Fut. I",
						lines: ["eō, īs, it, īmus, ītis, eunt", "Imperfekt: ībam, ībās", "Futur I: ībō, ībis", "PPA: iēns, Gen. euntis"],
						footer: "ī- → e- vor a/o/u",
					},
					{
						badge: "2",
						fill: "v-purple-fill",
						heading: "Perfektstamm",
						lines: ["iī, īstī, iit", "iimus, īstis, iērunt", "Plusq.: ieram / īveram", "Konj. Impf.: īrem"],
						footer: "Stamm i- (ohne -v-)",
					},
					{
						badge: "3",
						fill: "v-gold-fill",
						heading: "Komposita",
						lines: ["ad-īre (besuchen)", "ex-īre (hinausgehen)", "red-īre (zurückkehren)", "trāns-īre · per-īre"],
						footer: "wie īre gebeugt",
					},
				],
				false,
			),
	},
};
