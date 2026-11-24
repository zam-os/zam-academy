import { type ConceptFigure, threeColumns } from "./draw";

export const STAGE1_2_FIGURES: Record<string, ConceptFigure> = {
	"l5-aussprache-betonung": {
		title: "Klangregeln und Paenultima-Betonung",
		question: "Wie klingen lateinische Laute und wohin wandert der Wortton?",
		alt: "Dreiteiliges Schaubild zur klassischen Aussprache (c wie k, v wie w) und der Paenultima-Regel bei se-NA-tor und FE-mi-na.",
		caption: "Die Länge der vorletzten Silbe entscheidet ab drei Silben über den Ton.",
		parts: [
			{
				label: "Klassischer Klang",
				note: "c klingt vor allen Vokalen wie k (Cicero = Kikero), v wie w (villa = willa), qu wie kw.",
			},
			{
				label: "Lange Paenultima",
				note: "Ist die vorletzte Silbe lang (Natur: se-NĀ-tor oder Position: ma-GIS-ter), trägt sie den Ton.",
			},
			{
				label: "Kurze Paenultima",
				note: "Ist die vorletzte Silbe kurz und offen (fē-mi-na), springt der Ton auf die drittletzte Silbe (FĒ-mi-na).",
			},
		],
		draw: () =>
			threeColumns(
				"Aussprache und Silbenwaage",
				[
					{
						badge: "1",
						fill: "v-orange-fill",
						heading: "Klassischer Klang",
						lines: ["c = k · v = w", "Cicero → Kikero", "vīlla → willa", "ae / oe / au = 1 Silbe"],
						footer: "kein stummes -e",
					},
					{
						badge: "2",
						fill: "v-teal-fill",
						heading: "Paenultima lang",
						lines: ["se - NĀ - tor", "a - MĪ - cus", "ma - GIS - ter", "2 Konsonanten → lang"],
						footer: "Ton bleibt vorn vor -tor",
					},
					{
						badge: "3",
						fill: "v-blue-fill",
						heading: "Paenultima kurz",
						lines: ["FĒ - mi - na", "DO - mi - nus", "TA - bu - la", "-mi- / -bu- sind kurz"],
						footer: "Ton auf 3.-letzte Silbe",
					},
				],
				false,
			),
	},
	"l5-grundwortschatz-lernen": {
		title: "Vokabelkarte und Kontext-Wahl",
		question: "Warum gehören Genitiv, Genus und Satzkontext zusammen?",
		alt: "Dreiteiliges Schaubild zur vollständigen Vokabelkarte und zur Kontextbedeutung von petere.",
		caption: "Stammformen zeigen die Klasse; der Satzkontext entscheidet die genaue Bedeutung.",
		parts: [
			{
				label: "Vollständige Karte",
				note: "Substantive lernst du mit Nominativ, Genitiv und Genus (rēx, rēgis m.), Verben mit den Stammformen.",
			},
			{
				label: "Mehrdeutiges Wort",
				note: "Wörter wie petere oder agere haben ein Bedeutungsfeld statt einer einzigen starren Übersetzung.",
			},
			{
				label: "Objekt entscheidet",
				note: "pācem petere = um Frieden bitten; hostem petere = angreifen; Rōmam petere = nach Rom eilen.",
			},
		],
		draw: () =>
			threeColumns(
				"Von der Vokabelkarte zum richtigen Satzsinn",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "Vokabelkarte komplett",
						lines: ["rēx, rēgis m.", "Stamm = rēg-", "vocāre, vocō, vocāvī", "Präs. + Perf.-Stamm"],
						footer: "nie ohne Genitiv!",
					},
					{
						badge: "2",
						fill: "v-gold-fill",
						heading: "Bedeutungsfächer",
						lines: ["petere = ?", "agere = ?", "rēs = ?", "mehrere Bedeutungen"],
						footer: "Wortfeld merken",
					},
					{
						badge: "3",
						fill: "v-green-fill",
						heading: "Kontext entscheidet",
						lines: ["pācem petit → bitten", "hostem petit → angreifen", "Rōmam petit → aufsuchen", "Objekt zeigt den Weg"],
						footer: "Sinn aus dem Satz",
					},
				],
				true,
			),
	},
	"l5-wortarten-wortfelder": {
		title: "Wortarten, Wortfamilie und Wortfeld",
		question: "Wie verknüpft man Wörter nach Grammatik, Stamm und Thema?",
		alt: "Dreiteiliges Schaubild zu Wortarten (flektierbar vs. unveränderlich), Wortfamilie am- und Sachfeld Forum.",
		caption: "Wortarten trennen die Grammatik, Wortfamilien teilen die Wurzel, Sachfelder das Thema.",
		parts: [
			{
				label: "Wortarten",
				note: "Deklinierbar (Nomen, Adjektiv, Pronomen), konjugierbar (Verb) und unveränderlich (Adverb, Präposition, Konjunktion).",
			},
			{
				label: "Wortfamilie (Stamm)",
				note: "Alle Wörter mit demselben Wortstamm: am-āre, am-īcus, am-īcitia, in-im-īcus.",
			},
			{
				label: "Sachfeld (Thema)",
				note: "Verschiedene Stämme zu einem Lebensbereich: Forum, senātor, lēx, dīcere, iūdicāre.",
			},
		],
		draw: () =>
			threeColumns(
				"Drei Netze für deinen Wortschatz",
				[
					{
						badge: "1",
						fill: "v-purple-fill",
						heading: "Wortarten",
						lines: ["Nomen / Adj. (dekl.)", "Verb (konj.)", "sed / in / nunc", "unveränderlich"],
						footer: "Grammatik-Ordnung",
					},
					{
						badge: "2",
						fill: "v-teal-fill",
						heading: "Wortfamilie am-",
						lines: ["am-āre (lieben)", "am-īcus (Freund)", "am-īcitia", "in-imīcus (Feind)"],
						footer: "gleiche Wurzel",
					},
					{
						badge: "3",
						fill: "v-orange-fill",
						heading: "Sachfeld Forum",
						lines: ["senātor (Senator)", "lēx (Gesetz)", "dīcere (sprechen)", "cīvis (Bürger)"],
						footer: "gleiches Thema",
					},
				],
				false,
			),
	},
	"l5-wortbildung-kontext": {
		title: "Baukasten Wortbildung: Präfix + Stamm + Suffix",
		question: "Wie entschlüsselst du unbekannte zusammengesetzte Wörter?",
		alt: "Dreiteiliges Baukasten-Schaubild mit Präfixen (re-, in-, ex-), Stamm und Suffixen (-tor, -tas, -osus).",
		caption: "Vorsilbe ändert Richtung oder verneint; Nachsilbe bestimmt Wortart und Rolle.",
		parts: [
			{
				label: "Präfix (Vorsilbe)",
				note: "re- (zurück), ad- (herzu), ex-/ē- (heraus), prō- (vor), in- vor Adjektiven (un-).",
			},
			{
				label: "Wortstamm (Kern)",
				note: "Der bekannte Wortkern trägt die Grundbedeutung (z. B. vict-, līber-, voc-, glōri-).",
			},
			{
				label: "Suffix (Nachsilbe)",
				note: "-tor/-sor (Person: Sieger), -tās/-tiō (Eigenschaft/Vorgang), -ōsus (reich an).",
			},
		],
		draw: () =>
			threeColumns(
				"Wortbildung im Dreier-Baukasten",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "Präfix (vorn)",
						lines: ["re- (zurück): revocāre", "ex- (heraus): ēdūcere", "prō- (vor): prōcēdere", "in- (un-): infēlīx"],
						footer: "Richtung / Verneinung",
					},
					{
						badge: "2",
						fill: "v-gold-fill",
						heading: "Wortstamm (Mitte)",
						lines: ["voc- (rufen)", "līber- (frei)", "vict- (siegen)", "glōri- (Ruhm)"],
						footer: "Grundbedeutung",
					},
					{
						badge: "3",
						fill: "v-teal-fill",
						heading: "Suffix (hinten)",
						lines: ["-tor → victor (Sieger)", "-tās → lībertās", "-tiō → nāvigātiō", "-ōsus → glōriōsus"],
						footer: "Wortart & Rolle",
					},
				],
				true,
			),
	},
	"l5-wendungen-sentenzen": {
		title: "Inschriften, Sentenzen und Übertragung",
		question: "Wie werden antike Abkürzungen und feste Wendungen entschlüsselt?",
		alt: "Dreiteiliges Schaubild zu S. P. Q. R., Abkürzungen wie P. S. und etc. sowie wörtlicher vs. übertragener Bedeutung.",
		caption: "Feste Wendungen erst wörtlich verstehen, dann in natürliches Deutsch übertragen.",
		parts: [
			{
				label: "Römische Inschriften",
				note: "S. P. Q. R. = Senātus Populusque Rōmānus; A. D. = Annō Dominī.",
			},
			{
				label: "Alltagsabkürzungen",
				note: "etc. (et cētera), P. S. (post scrīptum), e. g. (exemplī grātiā), R. I. P. (Requiēscat in pāce).",
			},
			{
				label: "Übertragung",
				note: "cōnsilium capere = einen Plan fassen; carpe diem = nutze den Tag; grātiās agere = danken.",
			},
		],
		draw: () =>
			threeColumns(
				"Von der Steininschrift zur treffenden Wendung",
				[
					{
						badge: "1",
						fill: "v-coral-fill",
						heading: "Inschriften",
						lines: ["S. P. Q. R.", "Senātus Populusque", "Rōmānus", "A. D. = Annō Dominī"],
						footer: "Staat & Geschichte",
					},
					{
						badge: "2",
						fill: "v-purple-fill",
						heading: "Abkürzungen",
						lines: ["etc. = et cētera", "P. S. = post scrīptum", "R. I. P. = in pāce", "e. g. = zum Beispiel"],
						footer: "heute noch genutzt",
					},
					{
						badge: "3",
						fill: "v-green-fill",
						heading: "Wörtlich → Sinn",
						lines: ["cōnsilium capere", "→ einen Plan fassen", "grātiās agere", "→ Dank abstatten"],
						footer: "natürliches Deutsch",
					},
				],
				false,
			),
	},
	"l5-europa-sprachen": {
		title: "Latein als Mutter der romanischen Sprachen und Brückensprache",
		question: "Wie lebt Latein in Italienisch, Französisch, Spanisch, Englisch und Deutsch fort?",
		alt: "Dreiteiliges Schaubild zur Wortverwandtschaft in romanischen Sprachen, deutschen Lehnwörtern und Fremdwörtern.",
		caption: "Wer ein lateinisches Ursprungswort kennt, erkennt seine Nachkommen in ganz Europa.",
		parts: [
			{
				label: "Romanische Sprachen",
				note: "Aus dem gesprochenen Latein entstanden Italienisch, Französisch, Spanisch, Portugiesisch und Rumänisch.",
			},
			{
				label: "Lehnwort vs. Fremdwort",
				note: "Lehnwörter wurden früh eingedeutscht (mūrus → Mauer, fenestra → Fenster); Fremdwörter behielten die Endung (Aquarium).",
			},
			{
				label: "Brücke ins Englische",
				note: "Über die Hälfte des englischen Wortschatzes stammt vom Lateinischen ab (schola → school, liber → library).",
			},
		],
		draw: () =>
			threeColumns(
				"Sprachbrücken von Rom nach Europa",
				[
					{
						badge: "1",
						fill: "v-orange-fill",
						heading: "Romanische Töchter",
						lines: ["lat. aqua / porta", "it. acqua / porta", "frz. porte · sp. agua", "direkte Abstammung"],
						footer: "IT · FR · ES · PT · RO",
					},
					{
						badge: "2",
						fill: "v-blue-fill",
						heading: "Deutsch: Lehn vs. Fremd",
						lines: ["Lehnwort (angepasst):", "mūrus → Mauer", "fenestra → Fenster", "Fremdwort: Aquarium"],
						footer: "früh vs. gelehrt",
					},
					{
						badge: "3",
						fill: "v-teal-fill",
						heading: "Englischer Wortschatz",
						lines: ["audīre → audience", "liber → library", "schola → school", "vōx → voice"],
						footer: "Lernhilfe für EN & FR",
					},
				],
				false,
			),
	},
	"l5-a-o-deklination": {
		title: "a- und o-Deklination: Stamm, Kasus und Neutrum-Regel",
		question: "Woran erkennst du Endungen der a- und o-Deklination und maskuline Ausnahmen?",
		alt: "Dreiteiliges Schaubild zur a-Deklination (inkl. nauta m.), o-Deklination m. (-us/-er) und o-Deklination Neutrum (-um/-a).",
		caption: "Im Dativ/Ablativ Plural teilen a- und o-Deklination -īs; beim Neutrum ist Nom. = Akk.",
		parts: [
			{
				label: "a-Deklination (f. / m.)",
				note: "Endungen -a, -ae, -ae, -am, -ā | -ae, -ārum, -īs, -ās, -īs. Berufs-Männer wie nauta, poēta sind maskulin!",
			},
			{
				label: "o-Deklination m. (-us / -er)",
				note: "Endungen -us/-er, -ī, -ō, -um, -ō | -ī, -ōrum, -īs, -ōs, -īs. Bei ager/agrī fällt das e im Stamm weg!",
			},
			{
				label: "o-Deklination n. (-um)",
				note: "Eiserne Neutrum-Regel: Nom. = Akk. (Sg. -um, Pl. -a: templum / templa). Genitiv & Dat./Abl. wie o-m.",
			},
		],
		draw: () =>
			threeColumns(
				"Die drei Tabellen der a- und o-Deklination",
				[
					{
						badge: "1",
						fill: "v-coral-fill",
						heading: "a-Deklination",
						lines: ["domina / nauta (m.!)", "Gen. Sg. -ae · Akk. -am", "Gen. Pl. -ārum", "Akk. Pl. -ās"],
						footer: "Dat./Abl. Pl. -īs",
					},
					{
						badge: "2",
						fill: "v-blue-fill",
						heading: "o-Dekl. m. (-us/-er)",
						lines: ["amīcus / ager, agrī", "Gen. Sg. -ī · Akk. -um", "Gen. Pl. -ōrum", "Akk. Pl. -ōs"],
						footer: "Dat./Abl. Pl. -īs",
					},
					{
						badge: "3",
						fill: "v-teal-fill",
						heading: "o-Dekl. Neutrum",
						lines: ["templum, templī n.", "Nom. = Akk. Sg. -um", "Nom. = Akk. Pl. -a", "templa (Pl.)"],
						footer: "Subjekt od. Objekt?",
					},
				],
				false,
			),
	},
	"l5-dritte-deklination": {
		title: "3. Deklination: Genitiv-Trick und i-Stämme",
		question: "Wie gewinnst du den Stamm und wann stehen -ium / -ia / -ī?",
		alt: "Dreiteiliges Schaubild zur Stammbestimmung über den Genitiv (-is weg) sowie konsonantischen und i-Stämmen.",
		caption: "In der 3. Deklination versteckt sich der echte Wortstamm immer vor dem -is des Genitivs.",
		parts: [
			{
				label: "Genitiv-Stammregel",
				note: "Streicht man -is vom Genitiv Singular (mīlit-is, rēg-is, corpor-is), bleibt der reine Stamm übrig.",
			},
			{
				label: "Konsonantische Stämme",
				note: "Normalfall: Abl. Sg. -e (mīlite), Gen. Pl. -um (mīlitum), Neutrum Nom./Akk. Pl. -a (corpora).",
			},
			{
				label: "i-Stämme (nāvis, urbs, mare)",
				note: "Gen. Pl. -ium (cīvium, urbium). Neutra auf -e/-al/-ar (mare) haben Abl. Sg. -ī (marī) und Pl. -ia (maria).",
			},
		],
		draw: () =>
			threeColumns(
				"Schlüssel zur 3. Deklination",
				[
					{
						badge: "1",
						fill: "v-gold-fill",
						heading: "Genitiv-Trick (-is)",
						lines: ["mīles → mīlit-is", "rēx → rēg-is", "corpus → corpor-is", "nōmen → nōmin-is"],
						footer: "-is weg = Stamm",
					},
					{
						badge: "2",
						fill: "v-blue-fill",
						heading: "Konsonantisch",
						lines: ["Abl. Sg. -e (patre)", "Akk. Sg. -em (patrem)", "Gen. Pl. -um (patrum)", "Neutr. Pl. -a (corpora)"],
						footer: "Dat./Abl. Pl. -ibus",
					},
					{
						badge: "3",
						fill: "v-teal-fill",
						heading: "i-Stämme",
						lines: ["nāvis, cīvis, urbs", "Gen. Pl. -ium (urbium)", "mare: Abl. Sg. marī", "Neutr. Pl. maria"],
						footer: "Erkennen an -ium/-ia",
					},
				],
				true,
			),
	},
	"l5-u-e-deklination": {
		title: "u- und e-Deklination: Lange Endungen und Ausnahmen",
		question: "Woran unterscheidest du senātus (u) von servus (o) und rēs (e) von mīles (3.)?",
		alt: "Dreiteiliges Schaubild zu u-Deklination (senātus, manus f.), e-Deklination (rēs f., diēs m.) und den langen Endungen.",
		caption: "Der Genitiv Singular (-ūs vs. -ī; -ēī vs. -is) trennt u- und e-Deklination eindeutig ab.",
		parts: [
			{
				label: "u-Deklination",
				note: "Meist maskulin (senātus, exercitus), aber manus (Hand) ist feminin! Langes -ūs = Gen. Sg., Nom. Pl., Akk. Pl.",
			},
			{
				label: "e-Deklination",
				note: "Meist feminin (rēs, fidēs), aber diēs (Tag) in der Regel maskulin! Gen. Pl. -ērum, Dat./Abl. Pl. -ēbus.",
			},
			{
				label: "Verwechslungs-Check",
				note: "senātus (Gen. -ūs, Dat. -uī) vs. servus (Gen. -ī, Dat. -ō). rēs (Gen. reī) vs. mīles (Gen. mīlitis).",
			},
		],
		draw: () =>
			threeColumns(
				"u- und e-Deklination sicher trennen",
				[
					{
						badge: "1",
						fill: "v-purple-fill",
						heading: "u-Deklination",
						lines: ["senātus, -ūs m.", "manus, -ūs f.!", "Dat. Sg. -uī · Abl. -ū", "-ūs = Gen.Sg / Nom.Akk.Pl"],
						footer: "Dat./Abl. Pl. -ibus",
					},
					{
						badge: "2",
						fill: "v-green-fill",
						heading: "e-Deklination",
						lines: ["rēs, reī f. · diēs m.", "Dat. Sg. -eī/-ēī", "Abl. Sg. -ē (rē / diē)", "Gen. Pl. -ērum"],
						footer: "Dat./Abl. Pl. -ēbus",
					},
					{
						badge: "3",
						fill: "v-orange-fill",
						heading: "Verwechslungs-Check",
						lines: ["servus → servī (o)", "senātus → senātūs (u)", "mīles → mīlitis (3.)", "rēs → reī (e)"],
						footer: "Genitiv entscheidet!",
					},
				],
				false,
			),
	},
	"l5-adjektive-kng": {
		title: "KNG-Kongruenz über Deklinationsgrenzen hinweg",
		question: "Warum stimmen nauta bonus und manū fortī überein, obwohl die Endungen verschieden klingen?",
		alt: "Dreiteiliges Waage-Schaubild zur KNG-Kongruenz (Kasus, Numerus, Genus) bei ungleichen Deklinationen.",
		caption: "KNG prüft drei Kategorien (Fall, Zahl, Geschlecht), niemals identische Endungsbuchstaben.",
		parts: [
			{
				label: "Die 3 KNG-Prüfpunkte",
				note: "Bezugswort und Adjektiv teilen genau denselben Kasus (K), Numerus (N) und dasselbe Genus (G).",
			},
			{
				label: "Klasse 1: a-/o-Adjektive",
				note: "bonus, -a, -um / pulcher, -chra, -chrum wählen bei maskulinen a-Wörtern die o-Endung: nauta bonus.",
			},
			{
				label: "Klasse 2: 3. Deklination",
				note: "fortis, forte / fēlīx sind i-Stämme: Ablativ Singular endet immer auf -ī (manū fortī, mīlite fortī).",
			},
		],
		draw: () =>
			threeColumns(
				"Die KNG-Regel (Kasus · Numerus · Genus)",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "K · N · G prüfen",
						lines: ["K = Kasus (1.–5. Fall)", "N = Numerus (Sg./Pl.)", "G = Genus (m./f./n.)", "Inhalt zählt, nicht Optik"],
						footer: "3 × Übereinstimmung",
					},
					{
						badge: "2",
						fill: "v-teal-fill",
						heading: "Verschiedene Klassen",
						lines: ["nauta (a, m.) + bonus", "→ nauta bonus!", "poētae bonō (Dat. m.)", "manus (u, f.) magna"],
						footer: "a/o trifft a/u",
					},
					{
						badge: "3",
						fill: "v-purple-fill",
						heading: "Adjektive 3. Dekl.",
						lines: ["fortis, forte · fēlīx", "Abl. Sg. -ī (fortī)", "Gen. Pl. -ium (fortium)", "Neutr. Pl. -ia (fortia)"],
						footer: "fast alle i-Stämme",
					},
				],
				false,
			),
	},
	"l5-pronomina": {
		title: "Pronomina: Reflexiv (suus/sē) vs. is (eius) und quī",
		question: "Wann steht suus statt eius, und woher holt sich das Relativpronomen quī seinen Kasus?",
		alt: "Dreiteiliges Schaubild zur Unterscheidung von reflexivem sē/suus und nicht-reflexivem is/eius sowie der Regel für quī.",
		caption: "suus/sē zeigt zurück aufs Satzsubjekt; eius verweist heraus auf jemand anderen.",
		parts: [
			{
				label: "Reflexiv (suus / sē / sibi)",
				note: "Zeigt immer zurück auf das eigene Satzsubjekt ('sein/ihr eigenes', 'sich selbst').",
			},
			{
				label: "is, ea, id / eius / eōrum",
				note: "Zeigt auf eine andere, zuvor genannte Person oder Sache ('er/sie/es', 'dessen/deren').",
			},
			{
				label: "Relativpronomen quī",
				note: "Genus und Numerus kommen vom Bezugswort im Hauptsatz; den Kasus bestimmt der Relativsatz!",
			},
		],
		draw: () =>
			threeColumns(
				"Verweispfeile der Pronomina",
				[
					{
						badge: "1",
						fill: "v-green-fill",
						heading: "Reflexiv: sē / suus",
						lines: ["Mārcus ← amīcum suum", "zeigt aufs Subjekt!", "sē (Akk.), sibi (Dat.)", "eigenes Eigentum"],
						footer: "zurück zum Subjekt",
					},
					{
						badge: "2",
						fill: "v-orange-fill",
						heading: "Nicht-reflexiv: is/eius",
						lines: ["Mārcus → amīcum eius", "fremder Besitzer!", "eius (Sg.) / eōrum (Pl.)", "dessen / deren"],
						footer: "auf andere Person",
					},
					{
						badge: "3",
						fill: "v-blue-fill",
						heading: "Relativ: quī, quae, quod",
						lines: ["Bezugswort → G & N", "Relativsatz → Kasus", "Senātor, quem audiō", "(m. Sg. + Akkusativ)"],
						footer: "Brücke zwischen Sätzen",
					},
				],
				false,
			),
	},
	"l5-numeralia": {
		title: "Zahlen 1 bis 12 und römische Zahlzeichen",
		question: "Welche Zahlen werden dekliniert, und wie funktionieren IV und IX?",
		alt: "Dreiteiliges Schaubild zu den deklinierbaren Zahlen 1-3, den unveränderlichen 4-12 und den römischen Ziffern I, V, X.",
		caption: "Nur 1 bis 3 und alle Ordinalia werden gebeugt; 4 bis 12 bleiben unveränderlich.",
		parts: [
			{
				label: "Deklinierbar: 1, 2, 3",
				note: "ūnus, -a, -um; duo, duae, duo; trēs, trēs, tria passen sich in Kasus und Genus ihrem Bezugswort an.",
			},
			{
				label: "Unveränderlich: 4–12 & Ordinalia",
				note: "Kardinalia quattuor bis duodecim sind starr; alle Ordnungszahlen (prīmus bis duodecimus) flektieren wie bonus.",
			},
			{
				label: "Römische Ziffern I, V, X",
				note: "Rechts addieren (VI = 6, XII = 12); I direkt links vor V oder X subtrahieren (IV = 4, IX = 9).",
			},
		],
		draw: () =>
			threeColumns(
				"Das Zahlensystem I bis XII",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "1–3 (deklinierbar)",
						lines: ["I: ūnus, ūna, ūnum", "II: duo, duae, duo", "III: trēs, trēs, tria", "KNG-anpassbar!"],
						footer: "prīmus, secundus, tert.",
					},
					{
						badge: "2",
						fill: "v-teal-fill",
						heading: "4–12 (unveränderlich)",
						lines: ["IV–VI: quattuor, quīnque, sex", "VII–IX: septem, octō, novem", "X–XII: decem, ūndecim,", "duodecim (starr)"],
						footer: "Ordinalia (-us,-a,-um)",
					},
					{
						badge: "3",
						fill: "v-gold-fill",
						heading: "Zahlzeichen I, V, X",
						lines: ["I = 1 · V = 5 · X = 10", "Addition: VI = 6", "Subtraktion: IV = 4", "und IX = 9"],
						footer: "klein vor groß = minus",
					},
				],
				false,
			),
	},
};
