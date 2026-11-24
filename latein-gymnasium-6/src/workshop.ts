import { badge, card, escSvg, label, pill } from "./figures/draw";
import { ITALY_PLACES, renderItalyMap, type ItalyPlace } from "./maps";
import { esc } from "./practice";
import type { Lesson, Workshop } from "./types";

export function workshopGoals(
	workshop: Workshop,
	answers: string[],
): boolean[] {
	return workshop.goals.map((goal, i) => answers[i] === goal.answer);
}

export interface DemonstrativeInfo {
	id: "hic" | "ille" | "iste";
	title: string;
	perspective: string;
	cases: Array<{
		label: string;
		form: string;
		example: string;
		translation: string;
	}>;
}

export const DEMONSTRATIVES: DemonstrativeInfo[] = [
	{
		id: "hic",
		title: "hic, haec, hoc (dieser hier)",
		perspective: "Sprecher-Nähe: hier bei mir / unmittelbar vorliegend",
		cases: [
			{
				label: "Nom. Sg. m./f./n.",
				form: "hic / haec / hoc",
				example: "Hic liber facilis est.",
				translation: "Dieses Buch hier ist leicht.",
			},
			{
				label: "Gen. Sg.",
				form: "huius (alle Gen.)",
				example: "Vōx huius ōrātōris placet.",
				translation: "Die Stimme dieses Redners gefällt.",
			},
			{
				label: "Dat. Sg.",
				form: "huic (alle Gen.)",
				example: "Huic amīcō crēdō.",
				translation: "Diesem Freund hier vertraue ich.",
			},
			{
				label: "Akk. Sg. f.",
				form: "hanc",
				example: "Hanc epistulam legō.",
				translation: "Diesen Brief hier lese ich.",
			},
			{
				label: "Abl. Sg. f.",
				form: "hāc",
				example: "In hāc terrā pāx est.",
				translation: "In diesem unserem Land hier herrscht Frieden.",
			},
		],
	},
	{
		id: "ille",
		title: "ille, illa, illud (jener dort / berühmt)",
		perspective: "Ferne oder hoher Bekanntheitsgrad: jener berühmte …",
		cases: [
			{
				label: "Nom. Sg. m./f./n.",
				form: "ille / illa / illud",
				example: "Ille Homērus carmina scrīpsit.",
				translation: "Jener berühmte Homer schrieb Lieder.",
			},
			{
				label: "Gen. Sg.",
				form: "illīus (alle Gen.)",
				example: "Fāma illīus urbis manet.",
				translation: "Der Ruhm jener Stadt bleibt.",
			},
			{
				label: "Dat. Sg.",
				form: "illī (alle Gen.)",
				example: "Illī deō templum dēdicant.",
				translation: "Jenem Gott weihen sie den Tempel.",
			},
			{
				label: "Akk. Sg. f.",
				form: "illam",
				example: "Illam fābulam nārrat.",
				translation: "Er erzählt jene bekannte Geschichte.",
			},
			{
				label: "Abl. Sg. f.",
				form: "illā",
				example: "Illā nocte nēmō dormīvit.",
				translation: "In jener Nacht schlief niemand.",
			},
		],
	},
	{
		id: "iste",
		title: "iste, ista, istud (dieser dort bei dir)",
		perspective: "Gegenüber / Du-Bereich: oft spöttisch oder abwertend (vor Gericht)",
		cases: [
			{
				label: "Nom. Sg. m./f./n.",
				form: "iste / ista / istud",
				example: "Iste adversārius vēra negat.",
				translation: "Dieser Gegner da (bei euch) leugnet die Wahrheit.",
			},
			{
				label: "Gen. Sg.",
				form: "istīus (alle Gen.)",
				example: "Verba istīus hominis timeō.",
				translation: "Ich misstraue den Worten dieses Menschen da.",
			},
			{
				label: "Dat. Sg.",
				form: "istī (alle Gen.)",
				example: "Istī cōnsiliō nōn pāreō.",
				translation: "Diesem deinem Plan da gehorche ich nicht.",
			},
			{
				label: "Akk. Sg. f.",
				form: "istam",
				example: "Istam fraudem vidēmus.",
				translation: "Diesen deinen Betrug da durchschauen wir.",
			},
			{
				label: "Abl. Sg. f.",
				form: "istā",
				example: "Ex istā fraude nihil bonī venit.",
				translation: "Aus diesem deinem Trug kommt nichts Gutes.",
			},
		],
	},
];

export function demonstrativeForm(
	pronId: string,
	caseIndex: number,
): {
	pron: DemonstrativeInfo;
	entry: DemonstrativeInfo["cases"][number];
} {
	const pron = DEMONSTRATIVES.find((p) => p.id === pronId) ?? DEMONSTRATIVES[0];
	const idx = Math.max(0, Math.min(pron.cases.length - 1, Math.round(caseIndex)));
	return { pron, entry: pron.cases[idx] };
}

export interface Numeral1000Info {
	n: number;
	roman: string;
	latin: string;
	rule: string;
	note: string;
}

export const NUMERALS_1000: Numeral1000Info[] = [
	{
		n: 19,
		roman: "XIX",
		latin: "ūndēvīgintī",
		rule: "Subtraktion IX = 10 − 1 = 9",
		note: "19 = X + (X − I) = XIX; gesprochen „eins von zwanzig weg“.",
	},
	{
		n: 40,
		roman: "XL",
		latin: "quadrāgintā",
		rule: "Subtraktion XL = 50 − 10 = 40",
		note: "40 = XL (niemals XXXX in der klassischen Schulschreibung).",
	},
	{
		n: 79,
		roman: "LXXIX",
		latin: "septuāgintā novem",
		rule: "79 n. Chr.: L (50) + XX (20) + IX (10 − 1)",
		note: "Jahr des Vesuvausbruchs: LXXIX (L = 50, X = 10, IX = 9).",
	},
	{
		n: 90,
		roman: "XC",
		latin: "nōnāgintā",
		rule: "Subtraktion XC = 100 − 10 = 90",
		note: "90 = XC (C steht für centum = 100, X davor zieht 10 ab).",
	},
	{
		n: 218,
		roman: "CCXVIII",
		latin: "ducentī duodēvīgintī",
		rule: "218 v. Chr.: CC (200) + X (10) + VIII (8)",
		note: "Hannibals Zug über die Alpen: 218 v. Chr. = CCXVIII.",
	},
	{
		n: 490,
		roman: "CDXC",
		latin: "quadringentī nōnāgintā",
		rule: "Zweifache Subtraktion: CD (400) + XC (90)",
		note: "490 = CD (500 − 100) + XC (100 − 10), niemals DCCCC oder XD.",
	},
	{
		n: 509,
		roman: "DIX",
		latin: "quīngentī novem",
		rule: "509 v. Chr.: D (500) + IX (9)",
		note: "Beginn der Römischen Republik: D (500) + IX (9) = DIX.",
	},
	{
		n: 753,
		roman: "DCCLIII",
		latin: "septingentī quīnquāgintā trēs",
		rule: "753 v. Chr.: D (500) + CC (200) + L (50) + III (3)",
		note: "Gründungsjahr Roms nach Varro: DCCLIII (ab urbe conditā).",
	},
	{
		n: 1000,
		roman: "M",
		latin: "mīlle (unveränderlich)",
		rule: "M = 1000 · mīlle mīlitēs (Kongruenz)",
		note: "Einmal 1000 (mīlle) bleibt unveränderlich vor dem Nomen.",
	},
	{
		n: 2000,
		roman: "MM",
		latin: "duo mīlia (+ Gen. Pl.)",
		rule: "Ab 2000 Substantiv: duo mīlia mīlitum",
		note: "Plural mīlia regiert den Genitiv Plural: duo mīlia mīlitum!",
	},
];

export function numeral1000Entry(idx: number): Numeral1000Info {
	const clamped = Math.max(0, Math.min(NUMERALS_1000.length - 1, Math.round(idx)));
	return NUMERALS_1000[clamped];
}

export interface PassivTenseInfo {
	id: "pres" | "impf" | "fut";
	label: string;
	activeVerb: string;
	passiveVerb: string;
	activeSentence: string;
	passiveSentence: string;
	germanActive: string;
	germanPassive: string;
	marker: string;
}

export const PASSIV_TENSES: PassivTenseInfo[] = [
	{
		id: "pres",
		label: "Präsens",
		activeVerb: "dēfendunt",
		passiveVerb: "dēfenduntur",
		activeSentence: "Mīlitēs cīvēs dēfendunt.",
		passiveSentence: "Cīvēs ā mīlitibus dēfenduntur.",
		germanActive: "Die Soldaten verteidigen die Bürger.",
		germanPassive: "Die Bürger werden von den Soldaten verteidigt.",
		marker: "Endung -nt → -ntur · Inf. kons.: mittī",
	},
	{
		id: "impf",
		label: "Imperfekt",
		activeVerb: "dēfendēbant",
		passiveVerb: "dēfendēbantur",
		activeSentence: "Mīlitēs cīvēs dēfendēbant.",
		passiveSentence: "Cīvēs ā mīlitibus dēfendēbantur.",
		germanActive: "Die Soldaten verteidigten die Bürger.",
		germanPassive: "Die Bürger wurden von den Soldaten verteidigt.",
		marker: "Tempuszeichen -bā- + Passivendung -ntur",
	},
	{
		id: "fut",
		label: "Futur I",
		activeVerb: "dēfendent",
		passiveVerb: "dēfendentur",
		activeSentence: "Mīlitēs cīvēs dēfendent.",
		passiveSentence: "Cīvēs ā mīlitibus dēfendentur.",
		germanActive: "Die Soldaten werden die Bürger verteidigen.",
		germanPassive: "Die Bürger werden von den Soldaten verteidigt werden.",
		marker: "konsonantisch -ē-/-e- + -ntur (a/e-Konj.: -buntur)",
	},
];

export function passivPreview(
	tenseId: string,
	voice: "act" | "pass",
): {
	tense: PassivTenseInfo;
	voice: "act" | "pass";
	latin: string;
	german: string;
} {
	const tense = PASSIV_TENSES.find((t) => t.id === tenseId) ?? PASSIV_TENSES[0];
	return {
		tense,
		voice,
		latin: voice === "act" ? tense.activeSentence : tense.passiveSentence,
		german: voice === "act" ? tense.germanActive : tense.germanPassive,
	};
}

export interface KonjunktivVerbInfo {
	id: string;
	label: string;
	infinitive: string;
	actForm: string;
	passForm: string;
	actExample: string;
	passExample: string;
	note: string;
}

export const KONJUNKTIV_VERBS: KonjunktivVerbInfo[] = [
	{
		id: "vocare",
		label: "vocāre (a-Konj.)",
		infinitive: "vocāre",
		actForm: "vocāret (3. Sg.)",
		passForm: "vocārēris (2. Sg.)",
		actExample: "Sī amīcus vocāret, gaudērēmus.",
		passExample: "Sī tū ab amīcō vocārēris, venīrēs.",
		note: "Regel: Infinitiv vocāre + Endung → vocāret / vocārēris.",
	},
	{
		id: "capere",
		label: "capere (kurzvok. i)",
		infinitive: "capere",
		actForm: "caperent (3. Pl.)",
		passForm: "caperentur (3. Pl.)",
		actExample: "Ut puerī hostēs caperent, festīnābant.",
		passExample: "Ut hostēs ā puerīs caperentur.",
		note: "Achtung: Vor -re steht kurzes -e- (caperent, nicht capīrent!).",
	},
	{
		id: "venire",
		label: "venīre (langvok. i)",
		infinitive: "venīre",
		actForm: "venīret (3. Sg.)",
		passForm: "audīrētur (3. Sg.)",
		actExample: "Ut cīvis celeriter venīret.",
		passExample: "Ut vōx prōcōnsulis audīrētur.",
		note: "i-Konjugation behält langes -ī- (venīret, audīrētur).",
	},
	{
		id: "esse",
		label: "esse / posse",
		infinitive: "esse / posse",
		actForm: "esset / posset",
		passForm: "(kein Passiv)",
		actExample: "Ut cīvis redīre posset, portam aperuērunt.",
		passExample: "esse und posse bilden nur aktive Konjunktivformen.",
		note: "Inf. Präs. + Endung gilt auch hier: posse → possem, possēs, posset.",
	},
];

export function konjunktivPreview(
	verbId: string,
	voice: "act" | "pass",
): {
	verb: KonjunktivVerbInfo;
	form: string;
	example: string;
	voiceLabel: string;
} {
	const verb = KONJUNKTIV_VERBS.find((v) => v.id === verbId) ?? KONJUNKTIV_VERBS[0];
	const useAct = voice === "act" || verb.id === "esse";
	return {
		verb,
		form: useAct ? verb.actForm : verb.passForm,
		example: useAct ? verb.actExample : verb.passExample,
		voiceLabel: useAct ? "Aktiv (-m, -s, -t ...)" : "Passiv (-r, -ris, -tur ...)",
	};
}

export interface PcModeInfo {
	resId: "rel" | "adv" | "coord" | "prep";
	resLabel: string;
	ppaGerman: string;
	pppGerman: string;
	hint: string;
}

export const PC_MODES: PcModeInfo[] = [
	{
		resId: "rel",
		resLabel: "Relativsatz",
		ppaGerman: "Die Mutter sieht die Tochter, die weint.",
		pppGerman: "Der Konsul, der (zuvor) verwundet worden war, kämpfte dennoch.",
		hint: "Bezugswort (KNG) bleibt fest; das Partizip wird zum Relativsatz.",
	},
	{
		resId: "adv",
		resLabel: "Adverbialsatz",
		ppaGerman: "Die Mutter sieht die Tochter, während diese weint.",
		pppGerman: "Obwohl der Konsul verwundet worden war, kämpfte er weiter (tamen!).",
		hint: "Signalwörter wie tamen im Hauptsatz weisen auf konzessives ‚obwohl‘.",
	},
	{
		resId: "coord",
		resLabel: "Beiordnung (und)",
		ppaGerman: "Die Tochter weint, und die Mutter sieht sie.",
		pppGerman: "Der Brief wurde vom Sohn geschrieben und (danach) vom Vater gelesen.",
		hint: "Das Partizip wird als erstes gleichrangiges Verb mit ‚und (dann)‘ vorangestellt.",
	},
	{
		resId: "prep",
		resLabel: "Präpositionalausdruck",
		ppaGerman: "Die Mutter sieht ihre Tochter beim Weinen.",
		pppGerman: "Trotz seiner Verwundung kämpfte der Konsul weiter.",
		hint: "Verdichtet den Partizipialblock elegant zu einem kurzen Nomen mit Präposition.",
	},
];

export function partizipPreview(
	partType: "ppa" | "ppp",
	resId: string,
): {
	partType: "ppa" | "ppp";
	latin: string;
	kngTag: string;
	german: string;
	mode: PcModeInfo;
} {
	const mode = PC_MODES.find((m) => m.resId === resId) ?? PC_MODES[0];
	if (partType === "ppa") {
		return {
			partType,
			latin: "Māter [fīliam flentem] vīdit.",
			kngTag: "fīliam flentem (Akk. Sg. f. · gleichzeitig aktiv)",
			german: mode.ppaGerman,
			mode,
		};
	}
	return {
		partType,
		latin: "[Cōnsul vulnerātus] tamen pugnāvit.",
		kngTag: "Cōnsul vulnerātus (Nom. Sg. m. · vorzeitig passiv)",
		german: mode.pppGerman,
		mode,
	};
}

export function passivAciPreview(
	mainTense: "pres" | "perf",
	infTense: "pres" | "perf",
): {
	latin: string;
	german: string;
	relation: string;
	infLabel: string;
} {
	const head = mainTense === "pres" ? "Nūntius dīcit" : "Nūntius dīxit";
	const headDe = mainTense === "pres" ? "Der Bote sagt" : "Der Bote sagte";
	const inf = infTense === "pres" ? "servārī" : "servātās esse";
	const infLabel =
		infTense === "pres"
			? "servārī (Inf. Präs. Passiv)"
			: "servātās esse (KNG Akk. Pl. f.!)";
	const relation =
		infTense === "pres"
			? "Gleichzeitigkeit passiv"
			: "Vorzeitigkeit passiv";
	let verbDe = "gerettet werden";
	if (mainTense === "pres" && infTense === "perf") verbDe = "gerettet worden sind";
	else if (mainTense === "perf" && infTense === "pres") verbDe = "gerettet wurden";
	else if (mainTense === "perf" && infTense === "perf") verbDe = "gerettet worden waren";
	return {
		latin: `${head} [fēminās ${inf}].`,
		german: `${headDe}, dass die Frauen ${verbDe}.`,
		relation,
		infLabel,
	};
}

export interface RepublicStation {
	year: string;
	title: string;
	badge: string;
	text: string;
}

export const REPUBLIC_STATIONS: RepublicStation[] = [
	{
		year: "509 v. Chr.",
		title: "Beginn der Republik",
		badge: "Annuität · Kollegialität",
		text: "Sturz des Königs Tarquinius Superbus; zwei Konsuln regieren für ein Jahr mit Vetorecht.",
	},
	{
		year: "494 v. Chr.",
		title: "Sēcessiō plēbis",
		badge: "Volkstribunen · Vetō",
		text: "Erster Auszug der Plebejer auf den Heiligen Berg: Entstehung des Volkstribunats.",
	},
	{
		year: "450 v. Chr.",
		title: "Zwölftafelgesetz",
		badge: "Aufgeschriebenes Recht",
		text: "Festes, für alle auf dem Forum sichtbares Recht schützt vor Willkür.",
	},
	{
		year: "280 v. Chr.",
		title: "König Pyrrhos",
		badge: "Pyrrhussieg in Süditalien",
		text: "Abwehrkampf gegen Pyrrhos von Epirus (280–275 v. Chr.); danach Beherrschung Italiens.",
	},
	{
		year: "218 v. Chr.",
		title: "Hannibals Alpenzug",
		badge: "2. Punischer Krieg",
		text: "Hannibal führt sein Heer mit Kriegselefanten über die Alpen; 216 v. Chr. Niederlage Roms bei Cannae.",
	},
	{
		year: "202 v. Chr.",
		title: "Sieg bei Zama",
		badge: "Scīpiō & sociī",
		text: "Durch den Rückhalt der italischen Bundesgenossen (sociī) besiegt Scīpiō Hannibal bei Zama.",
	},
];

export interface MythGalleryItem {
	id: string;
	title: string;
	hero: string;
	attribute: string;
	rule: string;
	note: string;
}

export const MYTH_GALLERY: MythGalleryItem[] = [
	{
		id: "europa",
		title: "Europa",
		hero: "Iuppiter als weißer Stier",
		attribute: "Stier & Korb (Kreta)",
		rule: "Phönizische Prinzessin → Name unseres Erdteils",
		note: "Iuppiter entführt Europa in Stiergestalt über das Meer nach Kreta.",
	},
	{
		id: "theseus",
		title: "Theseus",
		hero: "Theseus & Ariadne",
		attribute: "Ariadnefaden · schwarzes Segel",
		rule: "Sieg über Minotaurus · Name des Ägäischen Meeres",
		note: "Ariadnes Garnknäuel führt Theseus aus dem Labyrinth des Daedalus.",
	},
	{
		id: "daedalus",
		title: "Daedalus & Ikarus",
		hero: "Daedalus als Erfinder",
		attribute: "Flügel (pennae, līnum, cēra)",
		rule: "Inter utrumque volā! (Met. 8,206) · Hybris",
		note: "Ikarus fliegt der Sonne zu nah; das Wachs schmilzt und er stürzt ins Meer.",
	},
	{
		id: "orpheus",
		title: "Orpheus & Eurydike",
		hero: "Orpheus mit der Leier",
		attribute: "lyra · Plūtō & Prōserpina",
		rule: "Blickverbot (Met. 10,51: ne flectat retro sua lumina)",
		note: "Sein Gesang rührt den Orcus, doch ein einziger Blick zurück kostet Eurydike.",
	},
	{
		id: "troja",
		title: "Trojanischer Krieg",
		hero: "Achilles vs. Hektor",
		attribute: "Zankapfel · Holzpferd",
		rule: "Paris-Urteil · 10 Jahre Krieg · List des Odysseus",
		note: "Griechische Krieger dringen verborgen im hölzernen Pferd in Troja ein.",
	},
	{
		id: "odysseus",
		title: "Odysseus (Ulixēs)",
		hero: "Polyphem · Sirenen · Ithaka",
		attribute: "Deckname Nēmō · Wachs",
		rule: "Heimkehr zu Penelope & Telemachos",
		note: "Klugheit rettet Odysseus vor dem Kyklopen und dem Gesang der Sirenen.",
	},
];

interface GenericInspectorItem {
	btn: string;
	box1: string;
	box2: string;
	box3: string;
	note: string;
}

interface GenericInspectorSpec {
	title: string;
	items: GenericInspectorItem[];
}

export const INSPECTORS: Record<string, GenericInspectorSpec> = {
	"context-lex": {
		title: "Polysemie: Bedeutungen im Satzkontext bestimmen",
		items: [
			{
				btn: "agere + cum cīvibus",
				box1: "agere (Grundwert)",
				box2: "mit Objekt / Personen?",
				box3: "verhandeln mit / handeln",
				note: "Cōnsul cum cīvibus dē pāce agit = Der Konsul verhandelt über Frieden.",
			},
			{
				btn: "petere + pācem",
				box1: "petere (Grundwert)",
				box2: "Sache / Ort im Akk.?",
				box3: "bitten um vs. aufsuchen",
				note: "pācem petere = um Frieden bitten; Italiam petere = Italien ansteuern.",
			},
			{
				btn: "rēs + pūblica / gestae",
				box1: "rēs (Sache, Lage)",
				box2: "festes Begleitwort",
				box3: "Staat / Taten / Umsturz",
				note: "rēs pūblica (Staat), rēs gestae (Taten), rēs novae (Umsturz).",
			},
		],
	},
	wordfield: {
		title: "Wortfamilien und Sachfelder im Wortschatznetz",
		items: [
			{
				btn: "Wortfamilie scrīb-",
				box1: "Stamm scrīb- / scrīpt-",
				box2: "scrībere · scrīptor",
				box3: "Schriftsteller · Brief",
				note: "Vom Verb scrībere stammen scrīptor (Autor) und scrīptum (Schrift).",
			},
			{
				btn: "Sachfeld Vesuvausbruch",
				box1: "Naturgewalten",
				box2: "ignis et cinis",
				box3: "Feuer, Asche, Bimsstein",
				note: "Plinius beschreibt fūmus (Rauch), ignis (Feuer) und cinis (Asche).",
			},
			{
				btn: "Wortfamilie dūc-",
				box1: "Stamm dūc- / duc-",
				box2: "dūcere · dux, ducis",
				box3: "führen → Feldherr",
				note: "Aus dem Stamm duc- entstehen dux (Führer/Feldherr) und aquaeductus.",
			},
		],
	},
	wordbuild: {
		title: "Wortbildung: Präfixe und Suffixe entschlüsseln",
		items: [
			{
				btn: "trāns- + īre",
				box1: "Präfix trāns-",
				box2: "Basis īre (gehen)",
				box3: "hinübergehen / überqueren",
				note: "trāns- drückt ein Hinüber aus: Alpēs trānsīre = die Alpen überqueren.",
			},
			{
				btn: "in-crēd-ibilis",
				box1: "in- (nicht) + crēd-",
				box2: "Suffix -ibilis (-bar)",
				box3: "un-glaub-lich",
				note: "Das Adjektivsuffix -bilis/-ibilis bedeutet ‚-bar‘ oder ‚-lich‘.",
			},
			{
				btn: "ob-sistere",
				box1: "Präfix ob- (entgegen)",
				box2: "sistere (sich stellen)",
				box3: "entgegentreten + Dat.",
				note: "hostibus obsistere = den Feinden entgegentreten / widerstehen.",
			},
		],
	},
	inscriptions: {
		title: "Inschriften, Junkturen und Weihformeln",
		items: [
			{
				btn: "castra pōnere",
				box1: "Feste Junktur",
				box2: "castra (n. Pl.!)",
				box3: "ein Lager aufschlagen",
				note: "castra steht nur im Plural und heißt zusammen mit pōnere ‚Lager bauen‘.",
			},
			{
				btn: "D. D. (Altar)",
				box1: "Inschrift D. D.",
				box2: "dōnō dedit",
				box3: "hat als Geschenk geweiht",
				note: "Typische Stifterformel neben D. M. (Grabstein) und S. P. Q. R. (Staat).",
			},
			{
				btn: "fidem servāre",
				box1: "fidem + servāre",
				box2: "Wort / Treue wahren",
				box3: "sein Wort halten",
				note: "Gegenteil: fidem fallere oder violāre = ein Versprechen brechen.",
			},
		],
	},
	etymology: {
		title: "Brücken zwischen Latein, Englisch (2. FS) und Romanisch",
		items: [
			{
				btn: "-ōria / -ia → -y",
				box1: "lat. memoria / glōria",
				box2: "Endungswandel zu -y",
				box3: "engl. memory / glory",
				note: "Aus lateinisch -ōria/-ia wird im Englischen oft die Endung -y.",
			},
			{
				btn: "-tās → -té → -ty",
				box1: "lat. lībertās (Akk. -tātem)",
				box2: "französisch liberté",
				box3: "englisch liberty",
				note: "Die lateinischen -tās-Nomen leben über das Französische im Englischen fort.",
			},
			{
				btn: "dīvidere / Division",
				box1: "lat. dīvidere, dīvīsum",
				box2: "engl. divide / division",
				box3: "dt. Division · dividieren",
				note: "PPP-Stamm dīvīs- erklärt das ‚s‘ in Division (dividieren ← dīvidere).",
			},
		],
	},
	"adj-third": {
		title: "3. Deklination: i-Stämme vs. dīves, pauper, vetus",
		items: [
			{
				btn: "pauper (konsonantisch)",
				box1: "cum amīcō paupere",
				box2: "Abl. Sg. -e · Gen. Pl. -um",
				box3: "Neutr. Pl. -a (vetera)",
				note: "dīves, pauper und vetus deklinieren konsonantisch wie Nomen (paupere!).",
			},
			{
				btn: "vetus (veterum)",
				box1: "exempla veterum",
				box2: "Gen. Pl. ohne -i-!",
				box3: "Vorbilder der Alten",
				note: "Gen. Pl. lautet veterum (nicht veterium), Neutr. Pl. lautet vetera.",
			},
			{
				btn: "gravis (i-Stamm)",
				box1: "in bellō gravī",
				box2: "Abl. Sg. -ī · Gen. Pl. -ium",
				box3: "Neutr. Pl. -ia (gravia)",
				note: "Fast alle anderen Adjektive der 3. Dekl. sind i-Stämme (gravī, gravia).",
			},
		],
	},
	"idem-ipse": {
		title: "īdem (derselbe) und ipse (selbst)",
		items: [
			{
				btn: "īdem, eadem, idem",
				box1: "is/ea/id + -dem",
				box2: "eādem hōrā",
				box3: "zur selben Stunde",
				note: "Identität: m → n vor d (eundem, eōrundem), Akk. Sg. n. idem (kurz).",
			},
			{
				btn: "ipse, ipsa, ipsum",
				box1: "Dea ipsa auxilium tulit.",
				box2: "Hervorhebung im Satz",
				box3: "die Göttin persönlich",
				note: "ipse betont die Person selbst; bei -m/-d keine Lautänderung (ipsum).",
			},
			{
				btn: "idem (Akk. n.) vs ipse",
				box1: "Idem carmen legimus.",
				box2: "dasselbe Lied",
				box3: "nicht ‚eundem‘ (mask.)",
				note: "carmen ist Neutrum → Akk. Sg. n. lautet idem (wie Nom. Sg. n.).",
			},
		],
	},
	"ire-stems": {
		title: "īre (gehen), Komposita und Stammformen",
		items: [
			{
				btn: "Stammwechsel ī- / e-",
				box1: "eō, īs, it, īmus, ītis",
				box2: "3. Pl.: eunt / exeunt",
				box3: "vor a, o, u Stamm e-",
				note: "Vor Vokal a/o/u wechselt ī- zu e-: eō, eunt, exeunt, euntēs (PPA).",
			},
			{
				btn: "Imperfekt / Perfekt",
				box1: "adīre → adībat (Impf.)",
				box2: "Perfekt: adiit / rediit",
				box3: "Futur I: adībit / redībunt",
				note: "Imperfekt nutzt regelmäßig -ba- (adībat); Kurzperfekt ohne -v- (adiit).",
			},
			{
				btn: "4 Stammformen",
				box1: "scrībō (Präsens)",
				box2: "scrīpsī (Perfekt)",
				box3: "scrīptum (PPP-Stamm)",
				note: "scrībō, scrīpsī, scrīptum liefert scrīptus (PPP) und engl. script.",
			},
		],
	},
	"passiv-perf": {
		title: "Passiv am Perfektstamm: PPP + esse",
		items: [
			{
				btn: "Perfekt Passiv",
				box1: "Lēgēs datae sunt.",
				box2: "KNG: lēgēs (f. Pl.) = datae",
				box3: "Die Gesetze wurden gegeben",
				note: "PPP richtet sich immer nach dem Subjekt in Kasus, Numerus und Genus.",
			},
			{
				btn: "Plusquamperfekt Passiv",
				box1: "Epistula missa erat.",
				box2: "PPP + erat (Impf. esse)",
				box3: "war geschickt worden",
				note: "Vorvergangenheit Passiv: PPP + eram, erās, erat, erāmus, erātis, erant.",
			},
			{
				btn: "Futur II & Inf. Perf.",
				box1: "servātus erit / esse",
				box2: "Fut. II: wird gerettet worden sein",
				box3: "Inf. Perf. Pass.: servātum esse",
				note: "Beim Infinitiv Perfekt Passiv steht esse immer im Infinitiv Präsens.",
			},
		],
	},
	"konj-plusq": {
		title: "Konjunktiv Plusquamperfekt Aktiv & Passiv",
		items: [
			{
				btn: "Aktiv: Perfektstamm + -isse-",
				box1: "vēn- + -isse- + -t",
				box2: "Sī dux vēnisset ...",
				box3: "wenn er gekommen wäre",
				note: "Infinitiv Perfekt Aktiv (vēnisse) + Personalendungen -m, -s, -t ...",
			},
			{
				btn: "Passiv: PPP + essem",
				box1: "templa (n. Pl.) servāta essent",
				box2: "PPP + Konj. Impf. esse",
				box3: "gerettet worden wären",
				note: "Passiv kombiniert das KNG-angepasste PPP mit essem, essēs, esset ...",
			},
			{
				btn: "posse: potuissēmus",
				box1: "Perfektstamm potu-",
				box2: "potuisse + -mus",
				box3: "wir hätten können",
				note: "Auch bei posse regulär vom Infinitiv Perfekt potuisse abgeleitet.",
			},
		],
	},
	"ppa-forms": {
		title: "Partizip Präsens Aktiv (PPA): Formen und Sonderfälle",
		items: [
			{
				btn: "Bildung & KNG",
				box1: "Māter fīliam flentem vīdit.",
				box2: "Stamm + -ns / -ntem",
				box3: "3. Dekl. (i-Stamm!)",
				note: "PPA drückt gleichzeitiges aktives Tun aus und kongruiert nach 3. Dekl.",
			},
			{
				btn: "i- / kons. Erw.: -iēns",
				box1: "fugere → fugiēns",
				box2: "Pl.: cīvēs fugientēs",
				box3: "immer mit -ie-!",
				note: "Kurz- und langvokalische i-Verben zeigen -iēns, -ientēs (fugiēns).",
			},
			{
				btn: "īre: iēns, euntis",
				box1: "mīlitibus euntibus",
				box2: "Nom. iēns · ab Gen. eunt-",
				box3: "den ziehenden Soldaten",
				note: "īre hat Nom. iēns, aber in allen weiteren Formen eunt- (euntibus).",
			},
		],
	},
	"ppp-forms": {
		title: "Partizip Perfekt Passiv (PPP): Stammform im Einsatz",
		items: [
			{
				btn: "a-/o-Deklination",
				box1: "epistula lēcta (f.)",
				box2: "Stammform lēctum → -us/-a/-um",
				box3: "der gelesene Brief",
				note: "PPP wird wie ein Adjektiv der a-/o-Deklination an sein Bezugswort angepasst.",
			},
			{
				btn: "Kontrast PPA vs. PPP",
				box1: "rēx vincēns (siegen-d)",
				box2: "vs. rēx victus (besiegt)",
				box3: "aktiv vs. passiv!",
				note: "PPA = gleichzeitig aktiv; PPP = vorzeitig passiv (erlittene Handlung).",
			},
			{
				btn: "Neutrum Plural -a",
				box1: "rēs gestae · verba dicta",
				box2: "n. Pl. Endung -a",
				box3: "ausgeführte Taten / Worte",
				note: "Vorsicht bei Neutrum Plural: dicta (n. Pl.) vs. dicta (f. Sg.).",
			},
		],
	},
	praedikativum: {
		title: "Prädikativum, doppelter Nominativ und Akkusativ",
		items: [
			{
				btn: "Doppelter Akkusativ",
				box1: "Populus eum tribūnum creāvit.",
				box2: "Objekt + Gleichsetzungsakk.",
				box3: "wählte ihn zum Tribunen",
				note: "Bei Verben des Nennens/Wählens im Aktiv stehen zwei Akkusative.",
			},
			{
				btn: "Doppelter Nominativ",
				box1: "Hannibal hostis appellābātur.",
				box2: "Subjekt + Gleichsetzungsnom.",
				box3: "wurde Feind genannt",
				note: "Im Passiv werden beide Größen zu Nominativen (mit ‚als / zu‘).",
			},
			{
				btn: "Prädikativum",
				box1: "Eurōpa puella flōrēs lēgit.",
				box2: "bezieht sich auf Subjekt",
				box3: "als junges Mädchen",
				note: "Das Nomen/Adjektiv im gleichen Kasus nennt den Zustand während der Tat.",
			},
		],
	},
	"kasus-erweitert": {
		title: "Genitiv-, Dativ- und Ablativfunktionen im Überblick",
		items: [
			{
				btn: "Datīvus fīnālis (Zweck)",
				box1: "sociīs auxiliō mittere",
				box2: "Empfänger + Zweck (Dat.)",
				box3: "den Bundesgenossen zu Hilfe",
				note: "Zwei Dative nebeneinander: wem (commodī) und wozu (fīnālis).",
			},
			{
				btn: "Gen./Abl. quālitātis",
				box1: "vir summī ingeniī",
				box2: "Adjektiv + Substantiv",
				box3: "Mann von höchstem Verstand",
				note: "Eigenschaften stehen im Genitiv oder Ablativ, immer mit Attribut!",
			},
			{
				btn: "Gen. subiect. / obiect.",
				box1: "dēsīderium patriae",
				box2: "wer empfindet vs. wonach?",
				box3: "Sehnsucht nach der Heimat",
				note: "Obiectīvus nennt das Ziel der Handlung/Empfindung (‚nach‘).",
			},
		],
	},
	irrealis: {
		title: "Irrealis: Unwirkliche Bedingungen in Gegenwart & Vergangenheit",
		items: [
			{
				btn: "Gegenwart (Konj. Impf.)",
				box1: "Sī Rōma portum nōn habēret",
				box2: "Konjunktiv Imperfekt",
				box3: "Wenn Rom keinen Hafen hätte",
				note: "Heute nicht wahr → Konjunktiv Imperfekt im Nebensatz und Hauptsatz.",
			},
			{
				btn: "Vergangenheit (Konj. Plusq.)",
				box1: "Hannibal nōn victus esset",
				box2: "Konjunktiv Plusquamperfekt",
				box3: "wäre nicht besiegt worden",
				note: "In der Vergangenheit nicht passiert → Konjunktiv Plusquamperfekt.",
			},
			{
				btn: "Irrealis ohne sī-Satz",
				box1: "Sine vōbīs periissem.",
				box2: "Bedingung im Ausdruck ‚ohne euch‘",
				box3: "wäre ich zugrunde gegangen",
				note: "Auch ohne sī zeigt der Konjunktiv Imperfekt/Plusq. die Irrealität an.",
			},
		],
	},
	"ut-clauses": {
		title: "Finalsätze und Konsekutivsätze mit ut, nē und ut nōn",
		items: [
			{
				btn: "Finalsatz (nē)",
				box1: "Absicht / Zweck",
				box2: "verneint immer mit nē!",
				box3: "damit ... nicht / um zu",
				note: "Nautae aquam iactāvērunt, nē nāvis perīret (damit es nicht unterging).",
			},
			{
				btn: "Konsekutivsatz (ut nōn)",
				box1: "Signalwort tam / tantus / ita",
				box2: "verneint immer mit ut nōn!",
				box3: "sodass ... nicht",
				note: "Clāmor tam magnus erat, ut hominēs nōn dormīrent.",
			},
			{
				btn: "Modus im ut-Satz",
				box1: "ut urbs servārētur",
				box2: "immer Konjunktiv!",
				box3: "dt. Indikativ (od. sollte)",
				note: "Latein setzt Konjunktiv Impf./Plusq., wir übersetzen meist indikativisch.",
			},
		],
	},
	"cum-clauses": {
		title: "Präposition und Konjunktion cum sicher unterscheiden",
		items: [
			{
				btn: "cum + Konj. Impf./Plusq.",
				box1: "cum nārrātīvum / causāle",
				box2: "Cum Hannibal appropinquāret",
				box3: "Als / Weil er näher kam",
				note: "In der Erzählvergangenheit mit Konj. Impf. (glz.) oder Plusq. (vorz.).",
			},
			{
				btn: "cum concessīvum + tamen",
				box1: "Cum tempestās saeva esset",
				box2: "Signalwort tamen im HS",
				box3: "Obwohl der Sturm wütete",
				note: "Wenn im Hauptsatz tamen (dennoch) steht, heißt cum ‚obwohl‘.",
			},
			{
				btn: "Präposition cum + Abl.",
				box1: "cum elephantīs",
				box2: "kein konjugiertes Verb folgt",
				box3: "mit den Elefanten",
				note: "Folgt nur ein Nomen im Ablativ ohne Verb, ist cum die Präposition ‚mit‘.",
			},
		],
	},
	"vesuv-sites": {
		title: "Vesuvausbruch 79 n. Chr.: Pompeji und Herkulaneum",
		items: [
			{
				btn: "Ausbruch 79 n. Chr.",
				box1: "Sommer/Herbst 79 n. Chr.",
				box2: "Golf von Neapel (Kampanien)",
				box3: "Asche & pyroklastische Ströme",
				note: "Zuvor zerstörte ein Beben 62 n. Chr. Gebäude; 79 folgte der große Ausbruch.",
			},
			{
				btn: "Herkulaneum vs. Pompeji",
				box1: "Pompeji: unter Bimsstein/Asche",
				box2: "Herkulaneum: bis 20 m Glutmasse",
				box3: "Holz & Papyri verkohlt",
				note: "Herkulaneum konservierte organische Stoffe (Villa dei Papiri, Balken).",
			},
			{
				btn: "Alltag: Thermopolium",
				box1: "Straßenimbiss (thermopōlium)",
				box2: "Amphitheātrum & Forum",
				box3: "Brunnen & Läden",
				note: "Überall in Pompeji zeigen Theken mit Tonkrügen das schnelle Alltagsessen.",
			},
		],
	},
	"plinius-letters": {
		title: "Plinius der Jüngere: Die Vesuvbriefe an Tacitus (6,16 & 6,20)",
		items: [
			{
				btn: "Adressat & Briefpaare",
				box1: "Plīnius minor → Tacitus",
				box2: "Epistulae 6,16 und 6,20",
				box3: "Augenzeugenbericht 79 n. Chr.",
				note: "Tacitus bat um Material über den Tod von Plinius d. Ä. beim Ausbruch.",
			},
			{
				btn: "Misenum & Aufbruch",
				box1: "Flottenbasis Misenum",
				box2: "Hilferuf aus Kampanien",
				box3: "Fortēs fortūna iuvat (6,16,11)",
				note: "Plinius d. Ä. stach als Flottenpräfekt von Misenum aus in See, um zu helfen.",
			},
			{
				btn: "Wolke wie eine Pinie",
				box1: "fōrma pīnus (6,16,5)",
				box2: "hoher Stamm · breite Krone",
				box3: "plinianische Eruption",
				note: "Nach seiner präzisen Schilderung nennt man Ausbrüche ‚plinianisch‘.",
			},
		],
	},
	"pompeii-art": {
		title: "Kunst & Alltagsfunde aus Pompeji, Herkulaneum und Athen",
		items: [
			{
				btn: "CAVĒ CANEM (Mosaik)",
				box1: "Schwellenmosaik im Vestibül",
				box2: "cavēre + Akk. (hüten vor)",
				box3: "Vorsicht vor dem Hund!",
				note: "Kleine Steinchen (tessellae) bilden ein Warnschild mit Schutzsymbolik.",
			},
			{
				btn: "Wandmalerei als Fresko",
				box1: "Farbe auf feuchten Kalkputz",
				box2: "vier pompejanische Stile",
				box3: "Scheinarchitektur & Mythen",
				note: "Pigmente verbinden sich chemisch mit dem Kalk (al fresco) und leuchten noch.",
			},
			{
				btn: "Rotfigurige Vasen",
				box1: "Athen ab ca. 530 v. Chr.",
				box2: "helle Figur auf dunklem Grund",
				box3: "feine Pinselzeichnung",
				note: "Erlaubt lebendige Muskeln, Falten und Gefühle bei Mythosszenen.",
			},
		],
	},
	"greek-mind": {
		title: "Griechisches Geistesleben: Athen und Syrakus",
		items: [
			{
				btn: "Attische Demokratie",
				box1: "Volksversammlung (Ekklēsia)",
				box2: "nur freie männliche Vollbürger",
				box3: "keine Frauen/Sklaven/Metöken",
				note: "Bahnbrechend für Abstimmungen, aber eng begrenzter Bürgerkreis.",
			},
			{
				btn: "Archimedes: Physik",
				box1: "Archimedes von Syrakus",
				box2: "Auftriebsprinzip im Wasser",
				box3: "Hebelgesetz & ‚Heureka!‘",
				note: "Die Auftriebskraft entspricht der Gewichtskraft des verdrängten Wassers.",
			},
			{
				btn: "Archimedes & Syrakus",
				box1: "Syrakus auf Sizilien",
				box2: "Belagerung bis 212 v. Chr.",
				box3: "Wurfmaschinen gegen Schiffe",
				note: "Der Erfinder schützte seine Heimatstadt lange gegen die römische Flotte.",
			},
		],
	},
	"republic-organs": {
		title: "Gesellschaft, Klientelwesen und Verfassungsorgane der Republik",
		items: [
			{
				btn: "Annuität & Kollegialität",
				box1: "2 Konsuln (statt 1 König)",
				box2: "Amtszeit genau 1 Jahr",
				box3: "Machtkontrolle gegen Tyrannei",
				note: "Jeder Konsul konnte durch Einspruch den Kollegen bremsen (Kollegialität).",
			},
			{
				btn: "Volkstribunen & Vetō",
				box1: "tribūnī plēbis (unverletzlich)",
				box2: "Ruf ‚Vetō!‘ (Ich verbiete!)",
				box3: "Schutz der Plebejer vor Willkür",
				note: "Das Einspruchsrecht bremste selbst Konsuln und Senatsbeschlüsse aus.",
			},
			{
				btn: "patrōnus ↔ cliēns",
				box1: "patrōnus (Schutzherr)",
				box2: "cliēns (Schützling)",
				box3: "Schutz vor Gericht ↔ Wahlhilfe",
				note: "Gegenseitige Treuepflicht (fidēs) verband Vornehme mit einfachen Bürgern.",
			},
		],
	},
	"punic-wars": {
		title: "Rom gegen Karthago: Die Punischen Kriege",
		items: [
			{
				btn: "Alpenzug 218 v. Chr.",
				box1: "2. Punischer Krieg (218–201)",
				box2: "Hannibal & Kriegselefanten",
				box3: "Überraschungsangriff auf Italien",
				note: "Nach Cannae (216 v. Chr.) war Rom schwer bedroht, gab aber nicht auf.",
			},
			{
				btn: "Entscheidung: Scīpiō",
				box1: "P. Cornēlius Scīpiō",
				box2: "Landung in Nordafrika",
				box3: "Sieg bei Zama (202 v. Chr.)",
				note: "Scīpiō zwang Hannibal zur Heimkehr und besiegte ihn bei Zama (Africānus).",
			},
			{
				btn: "Rolle der sociī",
				box1: "italische Bundesgenossen",
				box2: "stellten große Heereskontingente",
				box3: "blieben Rom meist treu",
				note: "Das Bündnissystem ersetzte Roms Verluste und entschied den Abnutzungskrieg.",
			},
		],
	},
	"values-sacrifice": {
		title: "Römische Werte (cōnstantia, concordia) und religiöses Opfer",
		items: [
			{
				btn: "cōnstantia (Standhaftigkeit)",
				box1: "Ruhig bleiben in schwerster Krise",
				box2: "Roms Haltung nach Cannae 216",
				box3: "Gegenteil: vorschnelle Panik",
				note: "Auch nach vernichtenden Verlusten wahrte der Senat cōnstantia.",
			},
			{
				btn: "dō ut dēs (Opferprinzip)",
				box1: "dō → ut dēs (Geben & Geben)",
				box2: "Vertragslogik mit den Göttern",
				box3: "genaues Ritual ohne Fehler",
				note: "Gab man den Göttern das exakte Opfer (Wein, Weihrauch, Tier), halfen sie.",
			},
			{
				btn: "concordia (Eintracht)",
				box1: "con- + cor, cordis (Herz)",
				box2: "Versöhnung der Stände",
				box3: "innerer Zusammenhalt Roms",
				note: "Nach langen Ständekämpfen wurde Concordia sogar ein eigener Tempel geweiht.",
			},
		],
	},
	"modern-echoes": {
		title: "Antikenbezüge und Redewendungen bis in die Gegenwart",
		items: [
			{
				btn: "Pyrrhussieg",
				box1: "König Pyrrhos (279 v. Chr.)",
				box2: "gewonnen unter riesigen Verlusten",
				box3: "Erfolg, der fast alles kostet",
				note: "„Noch ein solcher Sieg über die Römer, und wir sind völlig verloren!“",
			},
			{
				btn: "Trojaner (IT-Sicherheit)",
				box1: "Holzpferd als ‚Geschenk‘",
				box2: "harmlose Hülle mit Gefahr",
				box3: "verstecktes Schadprogramm",
				note: "Wie in Troja tarnt sich ein Computer-Trojaner als nützliche Datei.",
			},
			{
				btn: "Europa (Kontinent)",
				box1: "Prinzessin aus Phönizien",
				box2: "Mythos bei Ovid (Stiergestalt)",
				box3: "Name unseres Erdteils",
				note: "Europa ziert heute unter anderem die 2-Euro-Münze und die Banknotenserie.",
			},
		],
	},
	"daedalus-wing": {
		title: "Daedalus und Ikarus: Konstruktion und Ovids Warnung",
		items: [
			{
				btn: "Flügelmaterial (Ovid)",
				box1: "pennae (Federn)",
				box2: "līnum (Leinenfäden)",
				box3: "cēra (Wachs zum Kleben)",
				note: "Daedalus ordnet Federn der Größe nach und klebt sie mit Faden und Wachs.",
			},
			{
				btn: "Inter utrumque volā!",
				box1: "Metamorphosen 8,206",
				box2: "nicht zu tief (Meerschaum)",
				box3: "nicht zu hoch (Sonnenglut)",
				note: "Der mittlere Weg zwischen Wasser und Sonne ist das Ideal des rechten Maßes.",
			},
			{
				btn: "Hybris (Übermut)",
				box1: "Rausch des Fliegens",
				box2: "Grenzen werden vergessen",
				box3: "Sturz ins Ikarische Meer",
				note: "Das Missachten menschlicher Grenzen heißt in der Antike Hybris.",
			},
		],
	},
	"underworld-myth": {
		title: "Orpheus und Eurydike: Unterwelt, Verbot und Macht der Kunst",
		items: [
			{
				btn: "Plūtō & Prōserpina",
				box1: "Totenfluss Styx & Charōn",
				box2: "Herrscherpaar im Orcus",
				box3: "gewähren Rückkehr unter Bedingung",
				note: "Plūtō und Prōserpina lassen sich von Orpheus' tiefstem Schmerz rühren.",
			},
			{
				btn: "Blickverbot (Met. 10,51)",
				box1: "ne flectat retro sua lumina",
				box2: "Blickverbot beim Aufstieg",
				box3: "zweiter Verlust Eurydikes",
				note: "Kurz vor dem Tageslicht blickt Orpheus sich um – und Eurydike entschwindet.",
			},
			{
				btn: "Kraft der Leier (lyra)",
				box1: "Gesang + sieben Saiten",
				box2: "Sisyphus & Schatten weinen",
				box3: "Bäume & Felsen lauschen",
				note: "Die Kunst verwandelt sogar die unerbittliche Unterwelt für einen Moment.",
			},
		],
	},
	"trojan-cycle": {
		title: "Der Trojanische Krieg: Vom Paris-Urteil bis zum Fall Trojas",
		items: [
			{
				btn: "Paris-Urteil",
				box1: "Goldener Apfel der Eris",
				box2: "Streit: Iūnō, Minerva, Venus",
				box3: "Versprechen Helenas",
				note: "Paris entscheidet sich für Venus; die Entführung Helenas löst den Krieg aus.",
			},
			{
				btn: "Achilles vs. Hektor",
				box1: "Achilles (bester Grieche)",
				box2: "Hektor (Schutz Trojas)",
				box3: "tragischer Zweikampf",
				note: "Beide Helden zeigen menschliche Größe, Ehre und Trauer mitten im Krieg.",
			},
			{
				btn: "Trojanisches Pferd",
				box1: "Plan des Odysseus (Ulixēs)",
				box2: "Flotte täuscht Rückzug vor",
				box3: "Trojaner ziehen Pferd hinein",
				note: "Timeō Danaōs et dōna ferentēs – Warnung des Laokoon blieb ungehört.",
			},
		],
	},
	"odysseus-route": {
		title: "Irrfahrten und Heimkehr des Odysseus (Ulixēs)",
		items: [
			{
				btn: "Polyphem: Nēmō",
				box1: "Kyklop Polyphem in Höhle",
				box2: "Deckname ‚Niemand‘ (Nēmō)",
				box3: "Flucht unter den Schafen",
				note: "Weil ‚Niemand‘ ihn verletzte, helfen die anderen Kyklopen Polyphem nicht.",
			},
			{
				btn: "Sirenen & Wachs",
				box1: "tödlich schöner Gesang",
				box2: "Wachs in Ohren der Ruderer",
				box3: "Odysseus am Mast gefesselt",
				note: "Voraussicht und Selbstbindung schützen das Schiff vor den Klippen.",
			},
			{
				btn: "Heimkehr zu Penelope",
				box1: "Insel Ithaka nach 20 Jahren",
				box2: "kluge Webelist Penelopes",
				box3: "Sohn Telemachos an seiner Seite",
				note: "Am Ende erweist sich kluge Geduld stärker als rohe Gewalt.",
			},
		],
	},
	"ovid-sources": {
		title: "Ovids Metamorphosen und der Bild-Text-Vergleich",
		items: [
			{
				btn: "Werk: Metamorphosen",
				box1: "P. Ovidius Nāsō (43 v.–17 n. Chr.)",
				box2: "über 200 Verwandlungssagen",
				box3: "vom Chaos bis Rom",
				note: "Ovid verknüpft Sagen zu einem großen Gedicht voller Verwandlungen.",
			},
			{
				btn: "Bildzeichen = Attribute",
				box1: "Vase / Mosaik / Fresko",
				box2: "Leier · Stier · Flügel · Knäuel",
				box3: "machen die Figur erkennbar",
				note: "Ein Bild zeigt den entscheidenden Moment mithilfe typischer Attribute.",
			},
			{
				btn: "Text vs. Bild",
				box1: "Text: Gefühle & Reden",
				box2: "zeitliches Nacheinander",
				box3: "Bild: ein Augenblick zugleich",
				note: "Beim Vergleich fragst du: Was hebt das Bild hervor, was nur der Text?",
			},
		],
	},
	"pc-parse": {
		title: "Satzanalyse: PC-Klammern, Nebensätze und passiver AcI",
		items: [
			{
				btn: "KNG-Klammer beim PC",
				box1: "Hostēs urbēs [ā cīvibus",
				box2: "fortiter dēfēnsās] oppugnant.",
				box3: "urbēs ↔ dēfēnsās (Akk. Pl. f.)",
				note: "Alles zwischen Bezugsnomen und Partizip gehört inhaltlich zur Klammer.",
			},
			{
				btn: "Nebensatz-Ende finden",
				box1: "Einleiter: ut, nē, cum, sī",
				box2: "oft eingeschoben nach Subjekt",
				box3: "schließt beim finiten Verb",
				note: "Ein eingeschobener ut-/cum-Satz endet meist genau bei seinem Prädikat.",
			},
			{
				btn: "Passiver AcI",
				box1: "Plīnius scrīpsit",
				box2: "[Pompēiōs cinere opertōs esse]",
				box3: "Pompēiōs (m. Pl.) ↔ opertōs",
				note: "Auch beim Auslassen von esse zeigt das PPP im Akkusativ den AcI an.",
			},
		],
	},
	"trans-methods": {
		title: "Übersetzungstechniken gezielt kombinieren",
		items: [
			{
				btn: "Konstruktionsmethode",
				box1: "1. Prädikat bestimmen",
				box2: "2. Subjekt & Objekte fragen",
				box3: "ideal bei Schachtelsätzen",
				note: "Wer zuerst das konjugierte Verb sucht, knackt selbst lange Perioden.",
			},
			{
				btn: "Wortblockmethode",
				box1: "von links nach rechts lesen",
				box2: "KNG- & Präpositionalblöcke",
				box3: "Erwartung aufbauen",
				note: "Zusammengehörige Wörter (z. B. ‚in hāc urbe‘) als einen Block erfassen.",
			},
			{
				btn: "Warum keine Wort-für-Wort?",
				box1: "lateinische Endstellung ≠ dt.",
				box2: "Klammerbau zerfällt wörtlich",
				box3: "schiefe Bezüge vermeiden",
				note: "Rohübersetzungen klingen holprig; erst die Umstellung sichert guten Sinn.",
			},
		],
	},
	"error-check": {
		title: "Typische Fehlerquellen am Übersetzungsentwurf prüfen",
		items: [
			{
				btn: "Tempus im Perfekt Passiv",
				box1: "Templum captum est.",
				box2: "ist eingenommen worden / wurde",
				box3: "nicht: ‚wird eingenommen‘!",
				note: "est steht im Präsens, das PPP macht die Zeit aber zur Vergangenheit!",
			},
			{
				btn: "KNG-Bezug im PC",
				box1: "Puer fīliam rīdentem vīdit.",
				box2: "fīliam (Akk. f.) = rīdentem (Akk.)",
				box3: "puer (Nom.) scheidet aus!",
				note: "Nie raten, wer handelt – zuerst Kasus von Nomen und Partizip abgleichen.",
			},
			{
				btn: "ut nōn vs. nē",
				box1: "tam magnus ... ut nōn",
				box2: "Folge: sodass ... nicht",
				box3: "Absicht (ohne tam): nē",
				note: "Signalwörter wie tam, tantus, ita bestimmen das nachfolgende ut nōn.",
			},
		],
	},
	"study-plan": {
		title: "Stammformen lernen, Hilfsmittel nutzen und Prüfungen planen",
		items: [
			{
				btn: "Stammform-Eselsbrücke",
				box1: "capiō, cēpī, captum",
				box2: "engl. capture / captive",
				box3: "verrät PPP-Stamm capt-",
				note: "Englische Fremdwörter leiten sich fast immer vom PPP-Stamm auf -t-/-s- ab.",
			},
			{
				btn: "Wörterbuch-Rückführung",
				box1: "Textform: veterum (Gen. Pl.)",
				box2: "Endung -um abstreifen",
				box3: "Nachschlagen: vetus, veteris",
				note: "Auch bei dīvit- / pauper- / eunt- zuerst auf den Nominativ Sg. zurückführen.",
			},
			{
				btn: "Prüfungsplan",
				box1: "kurze Etappen rechtzeitig",
				box2: "Fehlerdiagnose Passiv / PC",
				box3: "Schlaf statt Nachtschicht",
				note: "Nach jedem Übungstext notieren, ob Form, Bezug oder Modus das Problem war.",
			},
		],
	},
	"team-present": {
		title: "Kreativ gestalten und im Team präsentieren",
		items: [
			{
				btn: "Lateinische Bildunterschrift",
				box1: "Pompēiī (Nom. Pl. m.)",
				box2: "annō LXXIX cinere opertī",
				box3: "KNG: -ī (nicht -ae!)",
				note: "Städtenamen wie Pompēiī sind maskulin Plural → opertī (PPP).",
			},
			{
				btn: "Gutes Lernplakat",
				box1: "klare Leitbegriffe & Bild",
				box2: "wenige treffende Beispiele",
				box3: "keine 40-Zeilen-Textwand",
				note: "Auf Plakaten orientiert man sich mit großen Titeln und Schaubildern.",
			},
			{
				btn: "Stationenlernen im Team",
				box1: "selbständig nachschlagen",
				box2: "Begründung statt bloßer Lösung",
				box3: "faires Partner-Feedback",
				note: "Wer dem Partner erklärt, warum eine Form stimmt, merkt sie sich selbst.",
			},
		],
	},
};

export function renderExplorer(lesson: Lesson): string {
	const kind = lesson.workshop.kind;

	if (kind === "italy-map") {
		return renderItalyMap("all", "pompeji");
	}

	if (kind === "demonstratives") {
		return `<div class="explorer-card" data-explorer="demonstratives">
			<div class="explorer-controls" role="group" aria-label="Demonstrativpronomen wählen">
				${DEMONSTRATIVES.map((p, i) => `<button type="button" data-dem-pron="${p.id}" aria-pressed="${i === 0}">${esc(p.title)}</button>`).join("")}
			</div>
			<div class="explorer-controls" role="group" aria-label="Kasus wählen">
				${DEMONSTRATIVES[0].cases.map((c, idx) => `<button type="button" data-dem-case="${idx}" aria-pressed="${idx === 0}">${esc(c.label)}</button>`).join("")}
			</div>
			<svg id="dem-svg" class="lab-svg" viewBox="0 0 600 125" role="img" aria-label="Sprecherperspektive und Form des Demonstrativpronomens"></svg>
			<p id="dem-readout" class="explorer-readout" aria-live="polite"></p>
		</div>`;
	}

	if (kind === "numerals1000") {
		return `<div class="explorer-card" data-explorer="numerals1000">
			<div class="explorer-controls" role="group" aria-label="Römische Zahl auswählen">
				<label for="num1000-slider">Schlüsselzahl wählen:</label>
				<input id="num1000-slider" type="range" min="0" max="${NUMERALS_1000.length - 1}" step="1" value="0" aria-label="Römische Zahl bis 2000 auswählen" />
				${NUMERALS_1000.map((item, idx) => `<button type="button" data-num1000="${idx}" aria-pressed="${idx === 0}">${esc(item.roman)}</button>`).join("")}
			</div>
			<svg id="num1000-svg" class="lab-svg" viewBox="0 0 600 120" role="img" aria-label="Römische Ziffer und Subtraktionsregel bis 1000"></svg>
			<p id="num1000-readout" class="explorer-readout" aria-live="polite"></p>
		</div>`;
	}

	if (kind === "passiv") {
		return `<div class="explorer-card" data-explorer="passiv">
			<div class="explorer-controls" role="group" aria-label="Tempus und Genus Verbi wählen">
				<span>Tempus:</span>
				${PASSIV_TENSES.map((t, i) => `<button type="button" data-pass-tense="${t.id}" aria-pressed="${i === 0}">${esc(t.label)}</button>`).join("")}
				<span>Genus Verbi:</span>
				<button type="button" data-pass-voice="act" aria-pressed="true">Aktiv (Handelnder = Subjekt)</button>
				<button type="button" data-pass-voice="pass" aria-pressed="false">Passiv (Erleidender = Subjekt)</button>
			</div>
			<svg id="pass-svg" class="lab-svg" viewBox="0 0 600 125" role="img" aria-label="Satzumbau Aktiv und Passiv im Präsensstamm"></svg>
			<p id="pass-readout" class="explorer-readout" aria-live="polite"></p>
		</div>`;
	}

	if (kind === "konjunktiv") {
		return `<div class="explorer-card" data-explorer="konjunktiv">
			<div class="explorer-controls" role="group" aria-label="Verbklasse und Aktiv/Passiv wählen">
				${KONJUNKTIV_VERBS.map((v, i) => `<button type="button" data-konj-verb="${v.id}" aria-pressed="${i === 0}">${esc(v.label)}</button>`).join("")}
				<span>Modus-Form:</span>
				<button type="button" data-konj-voice="act" aria-pressed="true">Aktiv</button>
				<button type="button" data-konj-voice="pass" aria-pressed="false">Passiv</button>
			</div>
			<svg id="konj-svg" class="lab-svg" viewBox="0 0 600 125" role="img" aria-label="Bauplan des Konjunktivs Imperfekt"></svg>
			<p id="konj-readout" class="explorer-readout" aria-live="polite"></p>
		</div>`;
	}

	if (kind === "partizip") {
		return `<div class="explorer-card" data-explorer="partizip">
			<div class="explorer-controls" role="group" aria-label="Partizip und Auflösungsart wählen">
				<span>Partizip:</span>
				<button type="button" data-pc-type="ppa" aria-pressed="true">PPA (flēns · gleichzeitig aktiv)</button>
				<button type="button" data-pc-type="ppp" aria-pressed="false">PPP (vulnerātus · vorzeitig passiv)</button>
				<span>Auflösung:</span>
				${PC_MODES.map((m, i) => `<button type="button" data-pc-res="${m.resId}" aria-pressed="${i === 0}">${esc(m.resLabel)}</button>`).join("")}
			</div>
			<svg id="pc-svg" class="lab-svg" viewBox="0 0 600 125" role="img" aria-label="KNG-Klammer und deutsche Auflösung eines Participium Coniunctum"></svg>
			<p id="pc-readout" class="explorer-readout" aria-live="polite"></p>
		</div>`;
	}

	if (kind === "passiv-aci") {
		return `<div class="explorer-card" data-explorer="passiv-aci">
			<div class="explorer-controls" role="group" aria-label="Tempus des Kopfverbs und passiver AcI-Infinitiv">
				<span>Kopfverb:</span>
				<button type="button" data-paci-main="pres" aria-pressed="true">Nūntius dīcit (Gegenwart)</button>
				<button type="button" data-paci-main="perf" aria-pressed="false">Nūntius dīxit (Vergangenheit)</button>
				<span>Passiver Infinitiv:</span>
				<button type="button" data-paci-inf="pres" aria-pressed="true">servārī (gleichzeitig)</button>
				<button type="button" data-paci-inf="perf" aria-pressed="false">servātās esse (vorzeitig)</button>
			</div>
			<svg id="paci-svg" class="lab-svg" viewBox="0 0 600 125" role="img" aria-label="Live-Zeitverhältnis beim passiven AcI"></svg>
			<p id="paci-readout" class="explorer-readout" aria-live="polite"></p>
		</div>`;
	}

	if (kind === "republic-timeline") {
		return `<div class="explorer-card" data-explorer="republic-timeline">
			<div class="explorer-controls" role="group" aria-label="Epochenstation der Republik wählen">
				${REPUBLIC_STATIONS.map((st, idx) => `<button type="button" data-rep-tl="${idx}" aria-pressed="${idx === 0}">${esc(st.year)} · ${esc(st.title)}</button>`).join("")}
			</div>
			<svg id="rep-tl-svg" class="lab-svg" viewBox="0 0 600 125" role="img" aria-label="Zeitstrahl der Römischen Republik von 509 bis 202 v. Chr."></svg>
			<p id="rep-tl-readout" class="explorer-readout" aria-live="polite"></p>
		</div>`;
	}

	if (kind === "myth-gallery") {
		return `<div class="explorer-card" data-explorer="myth-gallery">
			<div class="explorer-controls" role="group" aria-label="Mythos-Station wählen">
				${MYTH_GALLERY.map((m, idx) => `<button type="button" data-myth="${idx}" aria-pressed="${idx === 0}">${esc(m.title)}</button>`).join("")}
			</div>
			<svg id="myth-svg" class="lab-svg" viewBox="0 0 600 120" role="img" aria-label="Steckbrief eines antiken Mythos mit Attribut und Kernbotschaft"></svg>
			<p id="myth-readout" class="explorer-readout" aria-live="polite"></p>
		</div>`;
	}

	const spec = INSPECTORS[kind];
	if (spec) {
		return `<div class="explorer-card" data-explorer="generic" data-kind="${esc(kind)}">
			<p class="small" style="margin-top:0"><strong>${esc(spec.title)}</strong></p>
			<div class="explorer-controls" role="group" aria-label="Beispiel auswählen">
				${spec.items.map((item, idx) => `<button type="button" data-gen="${idx}" aria-pressed="${idx === 0}">${esc(item.btn)}</button>`).join("")}
			</div>
			<svg id="gen-svg" class="lab-svg" viewBox="0 0 600 115" role="img" aria-label="${esc(spec.title)}"></svg>
			<p id="gen-readout" class="explorer-readout" aria-live="polite"></p>
		</div>`;
	}

	return "";
}

export function drawDemonstrativeSvg(pronId: string, caseIndex: number): string {
	const { pron, entry } = demonstrativeForm(pronId, caseIndex);
	const fillCls =
		pron.id === "hic" ? "v-teal-fill" : pron.id === "ille" ? "v-blue-fill" : "v-coral-fill";
	return `${card(2, 2, 596, 121, "v-panel", 10)}
		${pill(16, 18, 174, 42, pron.id.toUpperCase() + ": " + entry.label, fillCls, "micro")}
		${pill(202, 18, 178, 42, entry.form, "v-gold-fill", "small")}
		${pill(392, 18, 192, 42, entry.example, "v-paper", "micro")}
		${card(16, 72, 568, 40, "v-paper", 8)}
		${label(300, 96, `${entry.translation}`, "small")}`;
}

export function drawNumeral1000Svg(index: number): string {
	const item = numeral1000Entry(index);
	return `${card(2, 2, 596, 116, "v-panel", 10)}
		${card(18, 16, 140, 86, "v-gold-fill", 10)}
		${label(88, 52, item.roman, "heading")}
		${label(88, 78, `Wert ${item.n}`, "micro")}
		${pill(174, 18, 196, 40, item.latin, "v-blue-fill", "micro")}
		${pill(382, 18, 200, 40, item.rule, "v-teal-fill", "micro")}
		${card(174, 68, 408, 34, "v-paper", 8)}
		${label(378, 89, item.note, "micro")}`;
}

export function drawPassivSvg(tenseId: string, voice: "act" | "pass"): string {
	const data = passivPreview(tenseId, voice);
	if (voice === "act") {
		return `${card(2, 2, 596, 121, "v-panel", 10)}
			${pill(18, 18, 152, 40, "Mīlitēs (Subj. Nom.)", "v-blue-fill", "micro")}
			${pill(182, 18, 160, 40, "cīvēs (Akk.-Obj.)", "v-purple-fill", "micro")}
			${pill(354, 18, 228, 40, `${data.tense.activeVerb} (${data.tense.label} Aktiv)`, "v-teal-fill", "micro")}
			${card(18, 72, 564, 40, "v-paper", 8)}
			${label(300, 96, data.german, "small")}`;
	}
	return `${card(2, 2, 596, 121, "v-panel", 10)}
		${pill(18, 18, 154, 40, "Cīvēs (neues Subj.)", "v-teal-fill", "micro")}
		${pill(184, 18, 174, 40, "ā mīlitibus (Urheber)", "v-orange-fill", "micro")}
		${pill(370, 18, 212, 40, `${data.tense.passiveVerb} (${data.tense.label} Pass.)`, "v-coral-fill", "micro")}
		${card(18, 72, 564, 40, "v-paper", 8)}
		${label(300, 96, data.german, "small")}`;
}

export function drawKonjunktivSvg(verbId: string, voice: "act" | "pass"): string {
	const data = konjunktivPreview(verbId, voice);
	return `${card(2, 2, 596, 121, "v-panel", 10)}
		${pill(16, 18, 152, 40, `Infinitiv: ${data.verb.infinitive}`, "v-blue-fill", "micro")}
		${pill(180, 18, 178, 40, data.voiceLabel, "v-orange-fill", "micro")}
		${pill(370, 18, 214, 40, `→ ${data.form}`, "v-purple-fill", "small")}
		${card(16, 72, 568, 40, "v-paper", 8)}
		${label(300, 96, data.example, "small")}`;
}

export function drawPartizipSvg(partType: "ppa" | "ppp", resId: string): string {
	const data = partizipPreview(partType, resId);
	return `${card(2, 2, 596, 121, "v-panel", 10)}
		${pill(16, 18, 250, 40, data.latin, "v-blue-fill", "micro")}
		${pill(278, 18, 170, 40, data.kngTag, "v-teal-fill", "micro")}
		${pill(460, 18, 124, 40, data.mode.resLabel, "v-gold-fill", "micro")}
		${card(16, 72, 568, 40, "v-paper", 8)}
		${label(300, 96, data.german, "micro")}`;
}

export function drawPassivAciSvg(mainTense: "pres" | "perf", infTense: "pres" | "perf"): string {
	const data = passivAciPreview(mainTense, infTense);
	const head = mainTense === "pres" ? "Nūntius dīcit" : "Nūntius dīxit";
	return `${card(2, 2, 596, 121, "v-panel", 10)}
		${pill(16, 18, 126, 42, head, "v-blue-fill", "micro")}
		${pill(152, 18, 136, 42, "fēminās (Akk. f. Pl.)", "v-purple-fill", "micro")}
		${pill(298, 18, 152, 42, data.infLabel, "v-teal-fill", "micro")}
		${pill(460, 18, 124, 42, data.relation, "v-orange-fill", "micro")}
		${card(16, 72, 568, 40, "v-paper", 8)}
		${label(300, 96, `Übersetzung: „${data.german}“`, "small")}`;
}

export function drawRepublicTimelineSvg(index: number): string {
	const clamped = Math.max(0, Math.min(REPUBLIC_STATIONS.length - 1, Math.round(index)));
	const st = REPUBLIC_STATIONS[clamped];
	const nodes = REPUBLIC_STATIONS.map((entry, idx) => {
		const cx = 56 + idx * 96;
		const active = idx === clamped;
		return `<g>
			<circle cx="${cx}" cy="44" r="${active ? 12 : 8}" class="${active ? "v-coral" : "v-paper"}"/>
			<text x="${cx}" y="22" text-anchor="middle" class="visual-label micro">${escSvg(entry.year)}</text>
		</g>`;
	}).join("");
	return `${card(2, 2, 596, 121, "v-panel", 10)}
		<line x1="56" y1="44" x2="536" y2="44" class="v-outline-thick"/>
		${nodes}
		${card(20, 68, 560, 44, "v-paper", 8)}
		${label(300, 94, `${st.title} (${st.badge})`, "small")}`;
}

export function drawMythSvg(index: number): string {
	const clamped = Math.max(0, Math.min(MYTH_GALLERY.length - 1, Math.round(index)));
	const m = MYTH_GALLERY[clamped];
	return `${card(2, 2, 596, 116, "v-panel", 10)}
		${pill(18, 22, 172, 44, `Mythos: ${m.title}`, "v-coral-fill", "micro")}
		${pill(204, 22, 182, 44, `Figuren: ${m.hero}`, "v-blue-fill", "micro")}
		${pill(400, 22, 182, 44, `Attribut: ${m.attribute}`, "v-gold-fill", "micro")}
		${label(300, 94, m.rule, "small")}`;
}

export function drawGenericSvg(kind: string, index: number): string {
	const spec = INSPECTORS[kind];
	const item = spec?.items[index] ?? spec?.items[0];
	if (!item) return "";
	return `${card(2, 2, 596, 111, "v-panel", 10)}
		${badge(28, 22, 1)}
		${pill(20, 30, 172, 48, item.box1, "v-blue-fill", "micro")}
		${badge(216, 22, 2)}
		${pill(208, 30, 184, 48, item.box2, "v-teal-fill", "micro")}
		${badge(416, 22, 3)}
		${pill(408, 30, 174, 48, item.box3, "v-gold-fill", "micro")}
		${label(300, 98, item.note, "micro")}`;
}

export function renderWorkshop(lesson: Lesson): string {
	return `<section class="panel workshop" aria-labelledby="workshop-title"><h2 id="workshop-title">Deine Entdeckerwerkstatt</h2><p>Nutze die interaktive Ansicht und verbinde unten alle drei Bausteine richtig, um die Werkstatt abzuschließen.</p>${renderExplorer(lesson)}<div class="construction">${lesson.workshop.goals.map((goal, i) => `<div class="construction-row" data-goal="${i}"><span class="goal-number" aria-hidden="true">${i + 1}</span><div><label for="workshop-${i}">${esc(goal.label)}</label><div class="word-chain"><span class="word-piece">${esc(goal.before)}</span><span aria-hidden="true">→</span><select id="workshop-${i}" data-workshop="${i}"><option value="">Baustein wählen…</option>${[...goal.options.slice(i + 1), ...goal.options.slice(0, i + 1)].map((option) => `<option value="${esc(option)}">${esc(option)}</option>`).join("")}</select>${goal.after ? `<span class="word-piece">${esc(goal.after)}</span>` : ""}</div><p class="goal-feedback small" role="status">Ziel noch offen.</p></div></div>`).join("")}</div><p id="workshop-status" role="status">0 von 3 Zielen erreicht.</p></section>`;
}

export function bindWorkshop(
	lesson: Lesson,
	container: HTMLElement,
	complete: () => void,
): void {
	const inputs = [
		...container.querySelectorAll<HTMLSelectElement>("[data-workshop]"),
	];
	for (const input of inputs)
		input.addEventListener("change", () => {
			const reached = workshopGoals(
				lesson.workshop,
				inputs.map((entry) => entry.value),
			);
			container
				.querySelectorAll<HTMLElement>("[data-goal]")
				.forEach((row, i) => {
					row.dataset.reached = String(reached[i]);
					row.querySelector(".goal-feedback")!.textContent = reached[i]
						? `✓ ${lesson.workshop.goals[i].explanation}`
						: inputs[i].value
							? "Noch offen. Vergleiche den Baustein mit der Erklärung und dem Schaubild."
							: "Ziel noch offen.";
				});
			const count = reached.filter(Boolean).length;
			container.querySelector("#workshop-status")!.textContent =
				`${count} von 3 Zielen erreicht.${count === 3 ? " Werkstatt gespeichert." : ""}`;
			if (count === 3) complete();
		});

	// Italy / Mediterranean map binding
	const mapEl = container.querySelector<HTMLElement>(".rome-map");
	if (mapEl) {
		let layer: "all" | ItalyPlace["layer"] = "all";
		const bindMapControls = () => {
			const fresh = container.querySelector<HTMLElement>(".rome-map");
			if (!fresh) return;
			fresh
				.querySelectorAll<HTMLButtonElement>("[data-map-focus]")
				.forEach((btn) => {
					btn.addEventListener("click", () => {
						layer = btn.dataset.mapFocus as "all" | ItalyPlace["layer"];
						fresh
							.querySelectorAll("[data-map-focus]")
							.forEach((b) =>
								b.setAttribute("aria-pressed", String(b === btn)),
							);
						fresh
							.querySelectorAll<SVGGElement>("[data-map-layer]")
							.forEach((g) => {
								g.style.opacity =
									layer === "all" || g.dataset.mapLayer === layer ? "1" : "0.22";
							});
					});
				});
			const selectPlace = (id: string) => {
				const p = ITALY_PLACES.find((entry) => entry.id === id);
				if (!p) return;
				fresh
					.querySelectorAll("[data-place-btn]")
					.forEach((b) =>
						b.setAttribute(
							"aria-pressed",
							String((b as HTMLElement).dataset.placeBtn === id),
						),
					);
				fresh
					.querySelectorAll<SVGCircleElement>("[data-place] circle")
					.forEach((c) => {
						const parentId = (c.parentElement as HTMLElement)?.dataset.place;
						const active = parentId === id;
						c.setAttribute("r", active ? "7.5" : "5.5");
						c.setAttribute(
							"fill",
							active ? "var(--stage-color, var(--accent))" : "var(--v-paper)",
						);
					});
				const note = fresh.querySelector("#rome-map-note");
				if (note) note.innerHTML = `<strong>${esc(p.name)}:</strong> ${esc(p.note)}`;
			};
			fresh
				.querySelectorAll<HTMLButtonElement>("[data-place-btn]")
				.forEach((btn) =>
					btn.addEventListener("click", () =>
						selectPlace(btn.dataset.placeBtn ?? "pompeji"),
					),
				);
			fresh
				.querySelectorAll<SVGGElement>("[data-place]")
				.forEach((g) => {
					const activate = () => selectPlace(g.dataset.place ?? "pompeji");
					g.addEventListener("click", activate);
					g.addEventListener("keydown", (event) => {
						if (event.key === "Enter" || event.key === " ") {
							event.preventDefault();
							activate();
						}
					});
				});
		};
		bindMapControls();
	}

	// Demonstratives
	const demRoot = container.querySelector<HTMLElement>('[data-explorer="demonstratives"]');
	if (demRoot) {
		let pronId = "hic";
		let caseIdx = 0;
		const update = () => {
			const { pron, entry } = demonstrativeForm(pronId, caseIdx);
			const svg = demRoot.querySelector("#dem-svg");
			if (svg) svg.innerHTML = drawDemonstrativeSvg(pronId, caseIdx);
			const out = demRoot.querySelector("#dem-readout");
			if (out)
				out.textContent = `${pron.perspective}. Beispiel: ${entry.example} (${entry.translation})`;
		};
		demRoot.querySelectorAll<HTMLButtonElement>("[data-dem-pron]").forEach((btn) =>
			btn.addEventListener("click", () => {
				pronId = btn.dataset.demPron ?? "hic";
				demRoot
					.querySelectorAll("[data-dem-pron]")
					.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				update();
			}),
		);
		demRoot.querySelectorAll<HTMLButtonElement>("[data-dem-case]").forEach((btn) =>
			btn.addEventListener("click", () => {
				caseIdx = Number(btn.dataset.demCase);
				demRoot
					.querySelectorAll("[data-dem-case]")
					.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				update();
			}),
		);
		update();
	}

	// Numerals up to 1000+
	const numRoot = container.querySelector<HTMLElement>('[data-explorer="numerals1000"]');
	if (numRoot) {
		const slider = numRoot.querySelector<HTMLInputElement>("#num1000-slider");
		let idx = 0;
		const update = () => {
			if (slider) slider.value = String(idx);
			numRoot
				.querySelectorAll("[data-num1000]")
				.forEach((b) =>
					b.setAttribute(
						"aria-pressed",
						String(Number((b as HTMLElement).dataset.num1000) === idx),
					),
				);
			const svg = numRoot.querySelector("#num1000-svg");
			if (svg) svg.innerHTML = drawNumeral1000Svg(idx);
			const info = numeral1000Entry(idx);
			const out = numRoot.querySelector("#num1000-readout");
			if (out) out.textContent = `${info.roman} (${info.n}) = ${info.latin}: ${info.note}`;
		};
		if (slider) {
			slider.addEventListener("input", () => {
				idx = Number(slider.value);
				update();
			});
		}
		numRoot.querySelectorAll<HTMLButtonElement>("[data-num1000]").forEach((btn) =>
			btn.addEventListener("click", () => {
				idx = Number(btn.dataset.num1000);
				update();
			}),
		);
		update();
	}

	// Passiv explorer
	const passRoot = container.querySelector<HTMLElement>('[data-explorer="passiv"]');
	if (passRoot) {
		let tenseId = "pres";
		let voice: "act" | "pass" = "act";
		const update = () => {
			const svg = passRoot.querySelector("#pass-svg");
			if (svg) svg.innerHTML = drawPassivSvg(tenseId, voice);
			const p = passivPreview(tenseId, voice);
			const out = passRoot.querySelector("#pass-readout");
			if (out)
				out.textContent = `${p.latin} → ${p.german} (${p.tense.marker})`;
		};
		passRoot.querySelectorAll<HTMLButtonElement>("[data-pass-tense]").forEach((btn) =>
			btn.addEventListener("click", () => {
				tenseId = btn.dataset.passTense ?? "pres";
				passRoot
					.querySelectorAll("[data-pass-tense]")
					.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				update();
			}),
		);
		passRoot.querySelectorAll<HTMLButtonElement>("[data-pass-voice]").forEach((btn) =>
			btn.addEventListener("click", () => {
				voice = btn.dataset.passVoice === "pass" ? "pass" : "act";
				passRoot
					.querySelectorAll("[data-pass-voice]")
					.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				update();
			}),
		);
		update();
	}

	// Konjunktiv Imperfekt
	const konjRoot = container.querySelector<HTMLElement>('[data-explorer="konjunktiv"]');
	if (konjRoot) {
		let verbId = "vocare";
		let voice: "act" | "pass" = "act";
		const update = () => {
			const svg = konjRoot.querySelector("#konj-svg");
			if (svg) svg.innerHTML = drawKonjunktivSvg(verbId, voice);
			const data = konjunktivPreview(verbId, voice);
			const out = konjRoot.querySelector("#konj-readout");
			if (out) out.textContent = `${data.example} — ${data.verb.note}`;
		};
		konjRoot.querySelectorAll<HTMLButtonElement>("[data-konj-verb]").forEach((btn) =>
			btn.addEventListener("click", () => {
				verbId = btn.dataset.konjVerb ?? "vocare";
				konjRoot
					.querySelectorAll("[data-konj-verb]")
					.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				update();
			}),
		);
		konjRoot.querySelectorAll<HTMLButtonElement>("[data-konj-voice]").forEach((btn) =>
			btn.addEventListener("click", () => {
				voice = btn.dataset.konjVoice === "pass" ? "pass" : "act";
				konjRoot
					.querySelectorAll("[data-konj-voice]")
					.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				update();
			}),
		);
		update();
	}

	// Participium Coniunctum
	const pcRoot = container.querySelector<HTMLElement>('[data-explorer="partizip"]');
	if (pcRoot) {
		let partType: "ppa" | "ppp" = "ppa";
		let resId = "rel";
		const update = () => {
			const svg = pcRoot.querySelector("#pc-svg");
			if (svg) svg.innerHTML = drawPartizipSvg(partType, resId);
			const data = partizipPreview(partType, resId);
			const out = pcRoot.querySelector("#pc-readout");
			if (out)
				out.textContent = `${data.latin} → ${data.german} (${data.mode.hint})`;
		};
		pcRoot.querySelectorAll<HTMLButtonElement>("[data-pc-type]").forEach((btn) =>
			btn.addEventListener("click", () => {
				partType = btn.dataset.pcType === "ppp" ? "ppp" : "ppa";
				pcRoot
					.querySelectorAll("[data-pc-type]")
					.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				update();
			}),
		);
		pcRoot.querySelectorAll<HTMLButtonElement>("[data-pc-res]").forEach((btn) =>
			btn.addEventListener("click", () => {
				resId = btn.dataset.pcRes ?? "rel";
				pcRoot
					.querySelectorAll("[data-pc-res]")
					.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				update();
			}),
		);
		update();
	}

	// Passive AcI
	const paciRoot = container.querySelector<HTMLElement>('[data-explorer="passiv-aci"]');
	if (paciRoot) {
		let mainTense: "pres" | "perf" = "pres";
		let infTense: "pres" | "perf" = "pres";
		const update = () => {
			const svg = paciRoot.querySelector("#paci-svg");
			if (svg) svg.innerHTML = drawPassivAciSvg(mainTense, infTense);
			const preview = passivAciPreview(mainTense, infTense);
			const out = paciRoot.querySelector("#paci-readout");
			if (out)
				out.textContent = `${preview.latin} → „${preview.german}“ (${preview.relation})`;
		};
		paciRoot.querySelectorAll<HTMLButtonElement>("[data-paci-main]").forEach((btn) =>
			btn.addEventListener("click", () => {
				mainTense = btn.dataset.paciMain === "perf" ? "perf" : "pres";
				paciRoot
					.querySelectorAll("[data-paci-main]")
					.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				update();
			}),
		);
		paciRoot.querySelectorAll<HTMLButtonElement>("[data-paci-inf]").forEach((btn) =>
			btn.addEventListener("click", () => {
				infTense = btn.dataset.paciInf === "perf" ? "perf" : "pres";
				paciRoot
					.querySelectorAll("[data-paci-inf]")
					.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				update();
			}),
		);
		update();
	}

	// Republic timeline
	const repRoot = container.querySelector<HTMLElement>('[data-explorer="republic-timeline"]');
	if (repRoot) {
		let idx = 0;
		const update = () => {
			const svg = repRoot.querySelector("#rep-tl-svg");
			if (svg) svg.innerHTML = drawRepublicTimelineSvg(idx);
			const st = REPUBLIC_STATIONS[idx];
			const out = repRoot.querySelector("#rep-tl-readout");
			if (out) out.textContent = `${st.year} · ${st.title}: ${st.text}`;
		};
		repRoot.querySelectorAll<HTMLButtonElement>("[data-rep-tl]").forEach((btn) =>
			btn.addEventListener("click", () => {
				idx = Number(btn.dataset.repTl);
				repRoot
					.querySelectorAll("[data-rep-tl]")
					.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				update();
			}),
		);
		update();
	}

	// Myth gallery
	const mythRoot = container.querySelector<HTMLElement>('[data-explorer="myth-gallery"]');
	if (mythRoot) {
		let idx = 0;
		const update = () => {
			const svg = mythRoot.querySelector("#myth-svg");
			if (svg) svg.innerHTML = drawMythSvg(idx);
			const m = MYTH_GALLERY[idx];
			const out = mythRoot.querySelector("#myth-readout");
			if (out)
				out.textContent = `${m.title} (${m.hero}): ${m.note} Erkennungszeichen: ${m.attribute}.`;
		};
		mythRoot.querySelectorAll<HTMLButtonElement>("[data-myth]").forEach((btn) =>
			btn.addEventListener("click", () => {
				idx = Number(btn.dataset.myth);
				mythRoot
					.querySelectorAll("[data-myth]")
					.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				update();
			}),
		);
		update();
	}

	// Generic SVG inspector
	const genRoot = container.querySelector<HTMLElement>('[data-explorer="generic"]');
	if (genRoot) {
		const kind = genRoot.dataset.kind ?? "";
		let idx = 0;
		const spec = INSPECTORS[kind];
		const update = () => {
			const svg = genRoot.querySelector("#gen-svg");
			if (svg) svg.innerHTML = drawGenericSvg(kind, idx);
			const item = spec?.items[idx];
			const out = genRoot.querySelector("#gen-readout");
			if (out && item) out.textContent = item.note;
		};
		genRoot.querySelectorAll<HTMLButtonElement>("[data-gen]").forEach((btn) =>
			btn.addEventListener("click", () => {
				idx = Number(btn.dataset.gen);
				genRoot
					.querySelectorAll("[data-gen]")
					.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				update();
			}),
		);
		update();
	}
}
