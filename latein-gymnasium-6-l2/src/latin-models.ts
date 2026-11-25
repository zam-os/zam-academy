export interface NumeralSpec {
	value: number;
	roman: string;
	cardinal: string;
	ordinal: string;
	parts: string[];
	rule: string;
}

const NUMERALS: Record<number, NumeralSpec> = {
	1: { value: 1, roman: "I", cardinal: "ūnus, ūna, ūnum", ordinal: "prīmus, -a, -um", parts: ["I"], rule: "Grundzeichen I (1)" },
	2: { value: 2, roman: "II", cardinal: "duo, duae, duo", ordinal: "secundus (alter)", parts: ["I", "+", "I"], rule: "Addition I + I" },
	3: { value: 3, roman: "III", cardinal: "trēs, tria", ordinal: "tertius, -a, -um", parts: ["I", "+", "I", "+", "I"], rule: "Addition I + I + I" },
	4: { value: 4, roman: "IV", cardinal: "quattuor", ordinal: "quārtus, -a, -um", parts: ["V", "−", "I"], rule: "Subtraktion: I vor V bedeutet 5 − 1" },
	5: { value: 5, roman: "V", cardinal: "quīnque", ordinal: "quīntus, -a, -um", parts: ["V"], rule: "Grundzeichen V (5)" },
	6: { value: 6, roman: "VI", cardinal: "sex", ordinal: "sextus, -a, -um", parts: ["V", "+", "I"], rule: "Addition: I nach V bedeutet 5 + 1" },
	7: { value: 7, roman: "VII", cardinal: "septem", ordinal: "septimus, -a, -um", parts: ["V", "+", "I", "+", "I"], rule: "Addition: 5 + 1 + 1" },
	8: { value: 8, roman: "VIII", cardinal: "octō", ordinal: "octāvus, -a, -um", parts: ["V", "+", "I", "+", "I", "+", "I"], rule: "Addition: 5 + 1 + 1 + 1" },
	9: { value: 9, roman: "IX", cardinal: "novem", ordinal: "nōnus, -a, -um", parts: ["X", "−", "I"], rule: "Subtraktion: I vor X bedeutet 10 − 1" },
	10: { value: 10, roman: "X", cardinal: "decem", ordinal: "decimus, -a, -um", parts: ["X"], rule: "Grundzeichen X (10)" },
	11: { value: 11, roman: "XI", cardinal: "ūndecim", ordinal: "ūndecimus, -a, -um", parts: ["X", "+", "I"], rule: "Addition: 10 + 1" },
	12: { value: 12, roman: "XII", cardinal: "duodecim", ordinal: "duodecimus, -a, -um", parts: ["X", "+", "I", "+", "I"], rule: "Addition: 10 + 1 + 1" },
};

export function numeralSpec(value: number): NumeralSpec {
	const n = Math.max(1, Math.min(12, Math.round(value)));
	return NUMERALS[n];
}

export const romanNumeral = (value: number): string => numeralSpec(value).roman;

export type Casus = "nom" | "gen" | "dat" | "akk" | "abl";
export type Numerus = "sg" | "pl";
export type NounId = "serva" | "amicus" | "templum" | "rex" | "urbs" | "nomen" | "mare";

export interface DeclensionResult {
	nounId: NounId;
	label: string;
	declension: string;
	casus: Casus;
	numerus: Numerus;
	stem: string;
	ending: string;
	full: string;
	question: string;
	meaning: string;
}

const CASUS_META: Record<Casus, { label: string; question: string }> = {
	nom: { label: "Nominativ", question: "Wer oder was?" },
	gen: { label: "Genitiv", question: "Wessen?" },
	dat: { label: "Dativ", question: "Wem?" },
	akk: { label: "Akkusativ", question: "Wen oder was?" },
	abl: { label: "Ablativ", question: "Womit? Wodurch? Wo? Wann?" },
};

const NOUN_TABLE: Record<
	NounId,
	{
		label: string;
		declension: string;
		meaning: string;
		sg: Record<Casus, [string, string]>;
		pl: Record<Casus, [string, string]>;
	}
> = {
	serva: {
		label: "serva, servae f.",
		declension: "1. (a-)Deklination",
		meaning: "die Sklavin",
		sg: { nom: ["serv", "a"], gen: ["serv", "ae"], dat: ["serv", "ae"], akk: ["serv", "am"], abl: ["serv", "ā"] },
		pl: { nom: ["serv", "ae"], gen: ["serv", "ārum"], dat: ["serv", "īs"], akk: ["serv", "ās"], abl: ["serv", "īs"] },
	},
	amicus: {
		label: "amīcus, amīcī m.",
		declension: "2. (o-)Deklination m.",
		meaning: "der Freund",
		sg: { nom: ["amīc", "us"], gen: ["amīc", "ī"], dat: ["amīc", "ō"], akk: ["amīc", "um"], abl: ["amīc", "ō"] },
		pl: { nom: ["amīc", "ī"], gen: ["amīc", "ōrum"], dat: ["amīc", "īs"], akk: ["amīc", "ōs"], abl: ["amīc", "īs"] },
	},
	templum: {
		label: "templum, templī n.",
		declension: "2. (o-)Deklination n.",
		meaning: "der Tempel",
		sg: { nom: ["templ", "um"], gen: ["templ", "ī"], dat: ["templ", "ō"], akk: ["templ", "um"], abl: ["templ", "ō"] },
		pl: { nom: ["templ", "a"], gen: ["templ", "ōrum"], dat: ["templ", "īs"], akk: ["templ", "a"], abl: ["templ", "īs"] },
	},
	rex: {
		label: "rēx, rēgis m.",
		declension: "3. Deklination (konsonantisch)",
		meaning: "der König",
		sg: { nom: ["rēx", ""], gen: ["rēg", "is"], dat: ["rēg", "ī"], akk: ["rēg", "em"], abl: ["rēg", "e"] },
		pl: { nom: ["rēg", "ēs"], gen: ["rēg", "um"], dat: ["rēg", "ibus"], akk: ["rēg", "ēs"], abl: ["rēg", "ibus"] },
	},
	urbs: {
		label: "urbs, urbis f.",
		declension: "3. Deklination (i-Stamm, Mischklasse)",
		meaning: "die Stadt",
		sg: { nom: ["urbs", ""], gen: ["urb", "is"], dat: ["urb", "ī"], akk: ["urb", "em"], abl: ["urb", "e"] },
		pl: { nom: ["urb", "ēs"], gen: ["urb", "ium"], dat: ["urb", "ibus"], akk: ["urb", "ēs"], abl: ["urb", "ibus"] },
	},
	nomen: {
		label: "nōmen, nōminis n.",
		declension: "3. Deklination (konsonantisch n.)",
		meaning: "der Name",
		sg: { nom: ["nōmen", ""], gen: ["nōmin", "is"], dat: ["nōmin", "ī"], akk: ["nōmen", ""], abl: ["nōmin", "e"] },
		pl: { nom: ["nōmin", "a"], gen: ["nōmin", "um"], dat: ["nōmin", "ibus"], akk: ["nōmin", "a"], abl: ["nōmin", "ibus"] },
	},
	mare: {
		label: "mare, maris n.",
		declension: "3. Deklination (i-Stamm n.)",
		meaning: "das Meer",
		sg: { nom: ["mar", "e"], gen: ["mar", "is"], dat: ["mar", "ī"], akk: ["mar", "e"], abl: ["mar", "ī"] },
		pl: { nom: ["mar", "ia"], gen: ["mar", "ium"], dat: ["mar", "ibus"], akk: ["mar", "ia"], abl: ["mar", "ibus"] },
	},
};

export const NOUN_IDS: NounId[] = ["serva", "amicus", "templum", "rex", "urbs", "nomen", "mare"];

export function declineNoun(nounId: NounId, numerus: Numerus, casus: Casus): DeclensionResult {
	const spec = NOUN_TABLE[nounId];
	const [stem, ending] = spec[numerus][casus];
	return {
		nounId,
		label: spec.label,
		declension: spec.declension,
		casus,
		numerus,
		stem,
		ending,
		full: `${stem}${ending}`,
		question: `${CASUS_META[casus].label} ${numerus === "sg" ? "Sg." : "Pl."} · ${CASUS_META[casus].question}`,
		meaning: spec.meaning,
	};
}

export type TenseId = "praesens" | "imperfekt" | "perfekt" | "plusquamperfekt" | "futur1" | "futur2";
export type VerbId = "vocare" | "monere" | "ducere" | "capere" | "audire" | "esse" | "posse" | "velle" | "nolle" | "malle" | "ire";

export interface ConjugationResult {
	verbId: VerbId;
	label: string;
	tense: TenseId;
	person: number;
	stem: string;
	marker: string;
	ending: string;
	full: string;
	translation: string;
}

const PRONOUNS_DE = ["ich", "du", "er/sie/es", "wir", "ihr", "sie"] as const;
const PRESENT_ENDINGS = ["ō", "s", "t", "mus", "tis", "nt"] as const;
const PAST_ENDINGS = ["m", "s", "t", "mus", "tis", "nt"] as const;
const PERF_ENDINGS = ["ī", "istī", "it", "imus", "istis", "ērunt"] as const;
const ERA_ENDINGS = ["eram", "erās", "erat", "erāmus", "erātis", "erant"] as const;
const ERI_ENDINGS = ["erō", "eris", "erit", "erimus", "eritis", "erint"] as const;

interface RegularVerbSpec {
	label: string;
	kind: "a" | "e" | "kons" | "gem" | "i";
	presStem: string;
	perfStem: string;
	de: { praesens: string[]; imperfekt: string[]; perfekt: string[]; plusquamperfekt: string[]; futur1: string[]; futur2: string[] };
}

const REGULAR_VERBS: Record<"vocare" | "monere" | "ducere" | "capere" | "audire", RegularVerbSpec> = {
	vocare: {
		label: "vocāre (a-Konj.) · rufen",
		kind: "a",
		presStem: "voc",
		perfStem: "vocāv",
		de: {
			praesens: ["rufe", "rufst", "ruft", "rufen", "ruft", "rufen"],
			imperfekt: ["rief", "riefst", "rief", "riefen", "rieft", "riefen"],
			perfekt: ["habe gerufen", "hast gerufen", "hat gerufen", "haben gerufen", "habt gerufen", "haben gerufen"],
			plusquamperfekt: ["hatte gerufen", "hattest gerufen", "hatte gerufen", "hatten gerufen", "hattet gerufen", "hatten gerufen"],
			futur1: ["werde rufen", "wirst rufen", "wird rufen", "werden rufen", "werdet rufen", "werden rufen"],
			futur2: ["werde gerufen haben", "wirst gerufen haben", "wird gerufen haben", "werden gerufen haben", "werdet gerufen haben", "werden gerufen haben"],
		},
	},
	monere: {
		label: "monēre (e-Konj.) · ermahnen",
		kind: "e",
		presStem: "mon",
		perfStem: "monu",
		de: {
			praesens: ["ermahne", "ermahnst", "ermahnt", "ermahnen", "ermahnt", "ermahnen"],
			imperfekt: ["ermahnte", "ermahntest", "ermahnte", "ermahnten", "ermahntet", "ermahnten"],
			perfekt: ["habe ermahnt", "hast ermahnt", "hat ermahnt", "haben ermahnt", "habt ermahnt", "haben ermahnt"],
			plusquamperfekt: ["hatte ermahnt", "hattest ermahnt", "hatte ermahnt", "hatten ermahnt", "hattet ermahnt", "hatten ermahnt"],
			futur1: ["werde ermahnen", "wirst ermahnen", "wird ermahnen", "werden ermahnen", "werdet ermahnen", "werden ermahnen"],
			futur2: ["werde ermahnt haben", "wirst ermahnt haben", "wird ermahnt haben", "werden ermahnt haben", "werdet ermahnt haben", "werden ermahnt haben"],
		},
	},
	ducere: {
		label: "dūcere (kons. Konj.) · führen",
		kind: "kons",
		presStem: "dūc",
		perfStem: "dūx",
		de: {
			praesens: ["führe", "führst", "führt", "führen", "führt", "führen"],
			imperfekt: ["führte", "führtest", "führte", "führten", "führtet", "führten"],
			perfekt: ["habe geführt", "hast geführt", "hat geführt", "haben geführt", "habt geführt", "haben geführt"],
			plusquamperfekt: ["hatte geführt", "hattest geführt", "hatte geführt", "hatten geführt", "hattet geführt", "hatten geführt"],
			futur1: ["werde führen", "wirst führen", "wird führen", "werden führen", "werdet führen", "werden führen"],
			futur2: ["werde geführt haben", "wirst geführt haben", "wird geführt haben", "werden geführt haben", "werdet geführt haben", "werden geführt haben"],
		},
	},
	capere: {
		label: "capere (gem. Konj.) · ergreifen",
		kind: "gem",
		presStem: "cap",
		perfStem: "cēp",
		de: {
			praesens: ["ergreife", "ergreifst", "ergreift", "ergreifen", "ergreift", "ergreifen"],
			imperfekt: ["ergriff", "ergriffst", "ergriff", "ergriffen", "ergrifft", "ergriffen"],
			perfekt: ["habe ergriffen", "hast ergriffen", "hat ergriffen", "haben ergriffen", "habt ergriffen", "haben ergriffen"],
			plusquamperfekt: ["hatte ergriffen", "hattest ergriffen", "hatte ergriffen", "hatten ergriffen", "hattet ergriffen", "hatten ergriffen"],
			futur1: ["werde ergreifen", "wirst ergreifen", "wird ergreifen", "werden ergreifen", "werdet ergreifen", "werden ergreifen"],
			futur2: ["werde ergriffen haben", "wirst ergriffen haben", "wird ergriffen haben", "werden ergriffen haben", "werdet ergriffen haben", "werden ergriffen haben"],
		},
	},
	audire: {
		label: "audīre (i-Konj.) · hören",
		kind: "i",
		presStem: "aud",
		perfStem: "audīv",
		de: {
			praesens: ["höre", "hörst", "hört", "hören", "hört", "hören"],
			imperfekt: ["hörte", "hörtest", "hörte", "hörten", "hörtet", "hörten"],
			perfekt: ["habe gehört", "hast gehört", "hat gehört", "haben gehört", "habt gehört", "haben gehört"],
			plusquamperfekt: ["hatte gehört", "hattest gehört", "hatte gehört", "hatten gehört", "hattet gehört", "hatten gehört"],
			futur1: ["werde hören", "wirst hören", "wird hören", "werden hören", "werdet hören", "werden hören"],
			futur2: ["werde gehört haben", "wirst gehört haben", "wird gehört haben", "werden gehört haben", "werdet gehört haben", "werden gehört haben"],
		},
	},
};

const IRREGULAR_VERBS: Record<
	"esse" | "posse" | "velle" | "nolle" | "malle" | "ire",
	{
		label: string;
		perfStem: string;
		praesens: [string, string, string][];
		imperfektPrefix: string;
		futur1: [string, string, string][];
		de: { praesens: string[]; imperfekt: string[]; perfekt: string[]; plusquamperfekt: string[]; futur1: string[]; futur2: string[] };
	}
> = {
	esse: {
		label: "esse · sein",
		perfStem: "fu",
		praesens: [
			["s", "", "um"],
			["es", "", ""],
			["es", "", "t"],
			["su", "", "mus"],
			["es", "", "tis"],
			["su", "", "nt"],
		],
		imperfektPrefix: "erā",
		futur1: [
			["er", "", "ō"],
			["er", "i", "s"],
			["er", "i", "t"],
			["er", "i", "mus"],
			["er", "i", "tis"],
			["er", "u", "nt"],
		],
		de: {
			praesens: ["bin", "bist", "ist", "sind", "seid", "sind"],
			imperfekt: ["war", "warst", "war", "waren", "wart", "waren"],
			perfekt: ["bin gewesen", "bist gewesen", "ist gewesen", "sind gewesen", "seid gewesen", "sind gewesen"],
			plusquamperfekt: ["war gewesen", "warst gewesen", "war gewesen", "waren gewesen", "wart gewesen", "waren gewesen"],
			futur1: ["werde sein", "wirst sein", "wird sein", "werden sein", "werdet sein", "werden sein"],
			futur2: ["werde gewesen sein", "wirst gewesen sein", "wird gewesen sein", "werden gewesen sein", "werdet gewesen sein", "werden gewesen sein"],
		},
	},
	posse: {
		label: "posse · können",
		perfStem: "potu",
		praesens: [
			["pos", "", "sum"],
			["pot", "", "es"],
			["pot", "", "est"],
			["pos", "", "sumus"],
			["pot", "", "estis"],
			["pos", "", "sunt"],
		],
		imperfektPrefix: "poterā",
		futur1: [
			["poter", "", "ō"],
			["poter", "i", "s"],
			["poter", "i", "t"],
			["poter", "i", "mus"],
			["poter", "i", "tis"],
			["poter", "u", "nt"],
		],
		de: {
			praesens: ["kann", "kannst", "kann", "können", "könnt", "können"],
			imperfekt: ["konnte", "konntest", "konnte", "konnten", "konntet", "konnten"],
			perfekt: ["habe gekonnt", "hast gekonnt", "hat gekonnt", "haben gekonnt", "habt gekonnt", "haben gekonnt"],
			plusquamperfekt: ["hatte gekonnt", "hattest gekonnt", "hatte gekonnt", "hatten gekonnt", "hattet gekonnt", "hatten gekonnt"],
			futur1: ["werde können", "wirst können", "wird können", "werden können", "werdet können", "werden können"],
			futur2: ["werde gekonnt haben", "wirst gekonnt haben", "wird gekonnt haben", "werden gekonnt haben", "werdet gekonnt haben", "werden gekonnt haben"],
		},
	},
	velle: {
		label: "velle · wollen",
		perfStem: "volu",
		praesens: [
			["vol", "", "ō"],
			["vīs", "", ""],
			["vul", "", "t"],
			["vol", "u", "mus"],
			["vul", "", "tis"],
			["vol", "u", "nt"],
		],
		imperfektPrefix: "volēbā",
		futur1: [
			["vol", "a", "m"],
			["vol", "ē", "s"],
			["vol", "e", "t"],
			["vol", "ē", "mus"],
			["vol", "ē", "tis"],
			["vol", "e", "nt"],
		],
		de: {
			praesens: ["will", "willst", "will", "wollen", "wollt", "wollen"],
			imperfekt: ["wollte", "wolltest", "wollte", "wollten", "wolltet", "wollten"],
			perfekt: ["habe gewollt", "hast gewollt", "hat gewollt", "haben gewollt", "habt gewollt", "haben gewollt"],
			plusquamperfekt: ["hatte gewollt", "hattest gewollt", "hatte gewollt", "hatten gewollt", "hattet gewollt", "hatten gewollt"],
			futur1: ["werde wollen", "wirst wollen", "wird wollen", "werden wollen", "werdet wollen", "werden wollen"],
			futur2: ["werde gewollt haben", "wirst gewollt haben", "wird gewollt haben", "werden gewollt haben", "werdet gewollt haben", "werden gewollt haben"],
		},
	},
	nolle: {
		label: "nōlle · nicht wollen",
		perfStem: "nōlu",
		praesens: [
			["nōl", "", "ō"],
			["nōn ", "", "vīs"],
			["nōn ", "", "vult"],
			["nōl", "u", "mus"],
			["nōn ", "", "vultis"],
			["nōl", "u", "nt"],
		],
		imperfektPrefix: "nōlēbā",
		futur1: [
			["nōl", "a", "m"],
			["nōl", "ē", "s"],
			["nōl", "e", "t"],
			["nōl", "ē", "mus"],
			["nōl", "ē", "tis"],
			["nōl", "e", "nt"],
		],
		de: {
			praesens: ["will nicht", "willst nicht", "will nicht", "wollen nicht", "wollt nicht", "wollen nicht"],
			imperfekt: ["wollte nicht", "wolltest nicht", "wollte nicht", "wollten nicht", "wolltet nicht", "wollten nicht"],
			perfekt: ["habe nicht gewollt", "hast nicht gewollt", "hat nicht gewollt", "haben nicht gewollt", "habt nicht gewollt", "haben nicht gewollt"],
			plusquamperfekt: ["hatte nicht gewollt", "hattest nicht gewollt", "hatte nicht gewollt", "hatten nicht gewollt", "hattet nicht gewollt", "hatten nicht gewollt"],
			futur1: ["werde nicht wollen", "wirst nicht wollen", "wird nicht wollen", "werden nicht wollen", "werdet nicht wollen", "werden nicht wollen"],
			futur2: ["werde nicht gewollt haben", "wirst nicht gewollt haben", "wird nicht gewollt haben", "werden nicht gewollt haben", "werdet nicht gewollt haben", "werden nicht gewollt haben"],
		},
	},
	malle: {
		label: "mālle · lieber wollen",
		perfStem: "mālu",
		praesens: [
			["māl", "", "ō"],
			["mā", "", "vīs"],
			["mā", "", "vult"],
			["māl", "u", "mus"],
			["mā", "", "vultis"],
			["māl", "u", "nt"],
		],
		imperfektPrefix: "mālēbā",
		futur1: [
			["māl", "a", "m"],
			["māl", "ē", "s"],
			["māl", "e", "t"],
			["māl", "ē", "mus"],
			["māl", "ē", "tis"],
			["māl", "e", "nt"],
		],
		de: {
			praesens: ["will lieber", "willst lieber", "will lieber", "wollen lieber", "wollt lieber", "wollen lieber"],
			imperfekt: ["wollte lieber", "wolltest lieber", "wollte lieber", "wollten lieber", "wolltet lieber", "wollten lieber"],
			perfekt: ["habe lieber gewollt", "hast lieber gewollt", "hat lieber gewollt", "haben lieber gewollt", "habt lieber gewollt", "haben lieber gewollt"],
			plusquamperfekt: ["hatte lieber gewollt", "hattest lieber gewollt", "hatte lieber gewollt", "hatten lieber gewollt", "hattet lieber gewollt", "hatten lieber gewollt"],
			futur1: ["werde lieber wollen", "wirst lieber wollen", "wird lieber wollen", "werden lieber wollen", "werdet lieber wollen", "werden lieber wollen"],
			futur2: ["werde lieber gewollt haben", "wirst lieber gewollt haben", "wird lieber gewollt haben", "werden lieber gewollt haben", "werdet lieber gewollt haben", "werden lieber gewollt haben"],
		},
	},
	ire: {
		label: "īre · gehen",
		perfStem: "i",
		praesens: [
			["e", "", "ō"],
			["ī", "", "s"],
			["i", "", "t"],
			["ī", "", "mus"],
			["ī", "", "tis"],
			["e", "u", "nt"],
		],
		imperfektPrefix: "ībā",
		futur1: [
			["ī", "b", "ō"],
			["ī", "bi", "s"],
			["ī", "bi", "t"],
			["ī", "bi", "mus"],
			["ī", "bi", "tis"],
			["ī", "bu", "nt"],
		],
		de: {
			praesens: ["gehe", "gehst", "geht", "gehen", "geht", "gehen"],
			imperfekt: ["ging", "gingst", "ging", "gingen", "gingt", "gingen"],
			perfekt: ["bin gegangen", "bist gegangen", "ist gegangen", "sind gegangen", "seid gegangen", "sind gegangen"],
			plusquamperfekt: ["war gegangen", "warst gegangen", "war gegangen", "waren gegangen", "wart gegangen", "waren gegangen"],
			futur1: ["werde gehen", "wirst gehen", "wird gehen", "werden gehen", "werdet gehen", "werden gehen"],
			futur2: ["werde gegangen sein", "wirst gegangen sein", "wird gegangen sein", "werden gegangen sein", "werdet gegangen sein", "werden gegangen sein"],
		},
	},
};

function conjugatePerfekt(perfStem: string, tense: "perfekt" | "plusquamperfekt" | "futur2", p: number): [string, string, string] {
	if (tense === "perfekt") return [perfStem, "", PERF_ENDINGS[p]];
	if (tense === "plusquamperfekt") return [perfStem, ERA_ENDINGS[p].slice(0, 3), ERA_ENDINGS[p].slice(3)];
	return [perfStem, ERI_ENDINGS[p].slice(0, 3), ERI_ENDINGS[p].slice(3)];
}

export function conjugateVerb(verbId: VerbId, tense: TenseId, personIndex: number): ConjugationResult {
	const p = Math.max(0, Math.min(5, Math.round(personIndex)));
	if (verbId in REGULAR_VERBS) {
		const spec = REGULAR_VERBS[verbId as keyof typeof REGULAR_VERBS];
		let stem = spec.presStem;
		let marker = "";
		let ending: string = PRESENT_ENDINGS[p];
		if (tense === "praesens") {
			if (spec.kind === "a") {
				marker = p === 0 ? "" : p === 2 || p === 5 ? "a" : "ā";
			} else if (spec.kind === "e") {
				marker = p === 0 ? "e" : p === 2 || p === 5 ? "e" : "ē";
			} else if (spec.kind === "kons") {
				marker = p === 0 ? "" : p === 5 ? "u" : "i";
			} else if (spec.kind === "gem") {
				marker = p === 0 ? "i" : p === 5 ? "iu" : "i";
			} else {
				marker = p === 0 ? "i" : p === 2 ? "i" : p === 5 ? "iu" : "ī";
			}
		} else if (tense === "imperfekt") {
			const theme = spec.kind === "a" ? "ā" : spec.kind === "e" ? "ē" : spec.kind === "kons" ? "ē" : "iē";
			marker = `${theme}b${p === 0 || p === 2 || p === 5 ? "a" : "ā"}`;
			ending = PAST_ENDINGS[p];
		} else if (tense === "futur1") {
			if (spec.kind === "a" || spec.kind === "e") {
				const theme = spec.kind === "a" ? "ā" : "ē";
				marker = `${theme}${p === 0 ? "b" : p === 5 ? "bu" : "bi"}`;
				ending = p === 0 ? "ō" : PAST_ENDINGS[p];
			} else {
				const pre = spec.kind === "kons" ? "" : "i";
				marker = `${pre}${p === 0 ? "a" : p === 2 || p === 5 ? "e" : "ē"}`;
				ending = PAST_ENDINGS[p];
			}
		} else {
			[stem, marker, ending] = conjugatePerfekt(spec.perfStem, tense, p);
		}
		return {
			verbId,
			label: spec.label,
			tense,
			person: p,
			stem,
			marker,
			ending,
			full: `${stem}${marker}${ending}`,
			translation: `${PRONOUNS_DE[p]} ${spec.de[tense][p]}`,
		};
	}
	const irr = IRREGULAR_VERBS[verbId as keyof typeof IRREGULAR_VERBS];
	let stem = "";
	let marker = "";
	let ending = "";
	if (tense === "praesens") [stem, marker, ending] = irr.praesens[p];
	else if (tense === "imperfekt") {
		const raw = irr.imperfektPrefix;
		const short = p === 0 || p === 2 || p === 5 ? `${raw.slice(0, -1)}a` : raw;
		stem = short.slice(0, -2);
		marker = short.slice(-2);
		ending = PAST_ENDINGS[p];
	} else if (tense === "futur1") [stem, marker, ending] = irr.futur1[p];
	else [stem, marker, ending] = conjugatePerfekt(irr.perfStem, tense, p);
	return {
		verbId,
		label: irr.label,
		tense,
		person: p,
		stem,
		marker,
		ending,
		full: `${stem}${marker}${ending}`,
		translation: `${PRONOUNS_DE[p]} ${irr.de[tense][p]}`,
	};
}

export interface AciModelResult {
	headLatin: string;
	subjAcc: string;
	infinitive: string;
	relation: string;
	german: string;
	rule: string;
}

export function aciTransform(headTense: "praesens" | "perfekt", infTense: "praesens" | "perfekt"): AciModelResult {
	const headLatin = headTense === "praesens" ? "Mārcus videt" : "Mārcus vīdit";
	const infinitive = infTense === "praesens" ? "venīre" : "vēnisse";
	const relation = infTense === "praesens" ? "Gleichzeitigkeit (Infinitiv Präsens)" : "Vorzeitigkeit (Infinitiv Perfekt)";
	const map: Record<string, { german: string; rule: string }> = {
		"praesens:praesens": {
			german: "Marcus sieht, dass der Freund kommt.",
			rule: "Gleichzeitig zur Gegenwart → im dass-Satz steht Präsens.",
		},
		"praesens:perfekt": {
			german: "Marcus sieht, dass der Freund gekommen ist.",
			rule: "Vorzeitig zur Gegenwart → im dass-Satz steht Perfekt oder Präteritum.",
		},
		"perfekt:praesens": {
			german: "Marcus sah, dass der Freund kam.",
			rule: "Gleichzeitig zur Vergangenheit → im dass-Satz steht Präteritum.",
		},
		"perfekt:perfekt": {
			german: "Marcus sah, dass der Freund gekommen war.",
			rule: "Vorzeitig zur Vergangenheit → im dass-Satz steht Plusquamperfekt.",
		},
	};
	const entry = map[`${headTense}:${infTense}`];
	return {
		headLatin,
		subjAcc: "amīcum",
		infinitive,
		relation,
		german: entry.german,
		rule: entry.rule,
	};
}

export interface SyllableWord {
	id: string;
	word: string;
	syllables: string[];
	stressIndex: number;
	penultLength: "lang" | "kurz";
	rule: string;
}

export const SYLLABLE_WORDS: Record<string, SyllableWord> = {
	amicus: {
		id: "amicus",
		word: "a·mī·cus",
		syllables: ["a", "mī", "cus"],
		stressIndex: 1,
		penultLength: "lang",
		rule: "Die vorletzte Silbe (-mī-) ist lang → sie trägt die Betonung.",
	},
	dominus: {
		id: "dominus",
		word: "do·mi·nus",
		syllables: ["do", "mi", "nus"],
		stressIndex: 0,
		penultLength: "kurz",
		rule: "Die vorletzte Silbe (-mi-) ist kurz → die Betonung wandert auf die drittletzte Silbe (do-).",
	},
	imperator: {
		id: "imperator",
		word: "im·pe·rā·tor",
		syllables: ["im", "pe", "rā", "tor"],
		stressIndex: 2,
		penultLength: "lang",
		rule: "Die vorletzte Silbe (-rā-) ist lang → sie trägt die Betonung.",
	},
	insula: {
		id: "insula",
		word: "īn·su·la",
		syllables: ["īn", "su", "la"],
		stressIndex: 0,
		penultLength: "kurz",
		rule: "Die vorletzte Silbe (-su-) ist kurz → betont wird die drittletzte Silbe (īn-).",
	},
	regina: {
		id: "regina",
		word: "rē·gī·na",
		syllables: ["rē", "gī", "na"],
		stressIndex: 1,
		penultLength: "lang",
		rule: "Die vorletzte Silbe (-gī-) ist lang → sie trägt die Betonung.",
	},
};

export const syllableStress = (id: string): SyllableWord =>
	SYLLABLE_WORDS[id] ?? SYLLABLE_WORDS.amicus;
