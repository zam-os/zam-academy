import { badge, card, escSvg, label, pill } from "./figures/draw";
import { ROME_PLACES, renderRomeMap, type RomePlace } from "./maps";
import { esc } from "./practice";
import type { Lesson, Workshop } from "./types";

export function workshopGoals(
	workshop: Workshop,
	answers: string[],
): boolean[] {
	return workshop.goals.map((goal, i) => answers[i] === goal.answer);
}

export interface NumeralInfo {
	n: number;
	roman: string;
	cardinal: string;
	ordinal: string;
	note: string;
}

export const NUMERALS: NumeralInfo[] = [
	{ n: 1, roman: "I", cardinal: "ūnus, -a, -um", ordinal: "prīmus, -a, -um", note: "deklinierbar (Gen. ūnīus, Dat. ūnī); dt. Unikat / Union" },
	{ n: 2, roman: "II", cardinal: "duo, duae, duo", ordinal: "secundus, -a, -um", note: "deklinierbar (duōs / duās); dt. Sekunde / Duett" },
	{ n: 3, roman: "III", cardinal: "trēs, trēs, tria", ordinal: "tertius, -a, -um", note: "deklinierbar (3. Dekl., tria n.); dt. Trio / Tertiär" },
	{ n: 4, roman: "IV", cardinal: "quattuor", ordinal: "quārtus, -a, -um", note: "unveränderlich; Subtraktion IV = 5 − 1; dt. Quartett" },
	{ n: 5, roman: "V", cardinal: "quīnque", ordinal: "quīntus, -a, -um", note: "unveränderlich; alter Monatsname Quīntīlis (= Juli)" },
	{ n: 6, roman: "VI", cardinal: "sex", ordinal: "sextus, -a, -um", note: "unveränderlich; alter Monatsname Sextīlis (= August)" },
	{ n: 7, roman: "VII", cardinal: "septem", ordinal: "septimus, -a, -um", note: "unveränderlich; septem collēs (7 Hügel), September" },
	{ n: 8, roman: "VIII", cardinal: "octō", ordinal: "octāvus, -a, -um", note: "unveränderlich; Oktober (urspr. 8. Monat), Oktave" },
	{ n: 9, roman: "IX", cardinal: "novem", ordinal: "nōnus, -a, -um", note: "unveränderlich; Subtraktion IX = 10 − 1; November" },
	{ n: 10, roman: "X", cardinal: "decem", ordinal: "decimus, -a, -um", note: "unveränderlich; Dezember (urspr. 10. Monat), Dezimal" },
	{ n: 11, roman: "XI", cardinal: "ūndecim", ordinal: "ūndecimus, -a, -um", note: "unveränderlich; ūnus + decem = 1 + 10" },
	{ n: 12, roman: "XII", cardinal: "duodecim", ordinal: "duodecimus, -a, -um", note: "unveränderlich; duodecim deī Olympiī, Dutzend" },
];

export function numeralEntry(n: number): NumeralInfo {
	const clamped = Math.max(1, Math.min(12, Math.round(n)));
	return NUMERALS[clamped - 1];
}

export interface ProsodyWord {
	word: string;
	syllables: string[];
	penultLong: boolean;
	stressIndex: number;
	reason: string;
}

export const PROSODY_WORDS: ProsodyWord[] = [
	{ word: "amīcus", syllables: ["a", "mī", "cus"], penultLong: true, stressIndex: 1, reason: "Vorletzte Silbe -mī- ist von Natur aus lang → a-MĪ-cus." },
	{ word: "fēmina", syllables: ["fē", "mi", "na"], penultLong: false, stressIndex: 0, reason: "Vorletzte Silbe -mi- ist kurz und offen → FĒ-mi-na." },
	{ word: "senātor", syllables: ["se", "nā", "tor"], penultLong: true, stressIndex: 1, reason: "Vorletzte Silbe -nā- ist von Natur aus lang → se-NĀ-tor." },
	{ word: "dominus", syllables: ["do", "mi", "nus"], penultLong: false, stressIndex: 0, reason: "Vorletzte Silbe -mi- ist kurz → DO-mi-nus." },
	{ word: "magister", syllables: ["ma", "gis", "ter"], penultLong: true, stressIndex: 1, reason: "Zwei Konsonanten (st) nach i → Positionslänge: ma-GIS-ter." },
	{ word: "lībertātem", syllables: ["lī", "ber", "tā", "tem"], penultLong: true, stressIndex: 2, reason: "Vorletzte Silbe -tā- ist lang → lī-ber-TĀ-tem." },
	{ word: "hominibus", syllables: ["ho", "mi", "ni", "bus"], penultLong: false, stressIndex: 1, reason: "Vorletzte Silbe -ni- ist kurz → Ton auf 3.-letzter Silbe: ho-MI-ni-bus." },
	{ word: "tabula", syllables: ["ta", "bu", "la"], penultLong: false, stressIndex: 0, reason: "Vorletzte Silbe -bu- ist kurz → TA-bu-la." },
];

export interface DeclensionClass {
	id: string;
	label: string;
	stem: string;
	meaning: string;
	sg: [string, string, string, string, string];
	pl: [string, string, string, string, string];
}

export const DECLENSIONS: DeclensionClass[] = [
	{ id: "a", label: "a-Dekl. (domina f.)", stem: "domin", meaning: "Herrin", sg: ["-a", "-ae", "-ae", "-am", "-ā"], pl: ["-ae", "-ārum", "-īs", "-ās", "-īs"] },
	{ id: "om", label: "o-Dekl. m. (amīcus)", stem: "amīc", meaning: "Freund", sg: ["-us", "-ī", "-ō", "-um", "-ō"], pl: ["-ī", "-ōrum", "-īs", "-ōs", "-īs"] },
	{ id: "on", label: "o-Dekl. n. (templum)", stem: "templ", meaning: "Tempel", sg: ["-um", "-ī", "-ō", "-um", "-ō"], pl: ["-a", "-ōrum", "-īs", "-a", "-īs"] },
	{ id: "3k", label: "3. kons. (senātor m.)", stem: "senātōr", meaning: "Senator", sg: ["(senātor)", "-is", "-ī", "-em", "-e"], pl: ["-ēs", "-um", "-ibus", "-ēs", "-ibus"] },
	{ id: "3i", label: "3. i-Stamm (mare n.)", stem: "mar", meaning: "Meer", sg: ["-e", "-is", "-ī", "-e", "-ī"], pl: ["-ia", "-ium", "-ibus", "-ia", "-ibus"] },
	{ id: "u", label: "u-Dekl. (senātus m.)", stem: "senāt", meaning: "Senat", sg: ["-us", "-ūs", "-uī", "-um", "-ū"], pl: ["-ūs", "-uum", "-ibus", "-ūs", "-ibus"] },
	{ id: "e", label: "e-Dekl. (rēs f.)", stem: "r", meaning: "Sache/Staat", sg: ["-ēs", "-eī", "-eī", "-em", "-ē"], pl: ["-ēs", "-ērum", "-ēbus", "-ēs", "-ēbus"] },
];

const KASUS_INFO = [
	{ name: "Nominativ", question: "Wer oder was? (Subjekt)" },
	{ name: "Genitiv", question: "Wessen? (Zugehörigkeit)" },
	{ name: "Dativ", question: "Wem? (Empfänger / Besitzer)" },
	{ name: "Akkusativ", question: "Wen oder was? (Objekt / Dauer)" },
	{ name: "Ablativ", question: "Womit / Warum / Wovon / Wann?" },
];

export function declensionForm(
	classId: string,
	num: "sg" | "pl",
	kasusIndex: number,
): { form: string; ending: string; question: string; meaning: string } {
	const cls = DECLENSIONS.find((d) => d.id === classId) ?? DECLENSIONS[0];
	const idx = Math.max(0, Math.min(4, kasusIndex));
	const ending = cls[num][idx];
	const form = ending.startsWith("(") ? ending.slice(1, -1) : `${cls.stem}${ending.replace("-", "")}`;
	return { form, ending, question: KASUS_INFO[idx].question, meaning: cls.meaning };
}

export function aciPreview(
	mainTense: "pres" | "perf",
	infTense: "pres" | "perf",
): {
	latin: string;
	german: string;
	relation: string;
} {
	const head = mainTense === "pres" ? "Audiō" : "Audīvī";
	const headDe = mainTense === "pres" ? "Ich höre" : "Ich hörte";
	const inf = infTense === "pres" ? "venīre" : "vēnisse";
	const relation =
		infTense === "pres"
			? "Gleichzeitigkeit (Infinitiv Präsens)"
			: "Vorzeitigkeit (Infinitiv Perfekt)";
	let verbDe = "kommt";
	if (mainTense === "pres" && infTense === "perf") verbDe = "gekommen ist";
	else if (mainTense === "perf" && infTense === "pres") verbDe = "kam";
	else if (mainTense === "perf" && infTense === "perf") verbDe = "gekommen war";
	return {
		latin: `${head} [Mārcum ${inf}].`,
		german: `${headDe}, dass Marcus ${verbDe}.`,
		relation,
	};
}

export interface CalendarMonth {
	id: string;
	name: string;
	days: number;
	nonen: number;
	iden: number;
	note: string;
}

export const CALENDAR_MONTHS: CalendarMonth[] = [
	{ id: "ian", name: "Iānuārius (Januar)", days: 31, nonen: 5, iden: 13, note: "Normalmonat: Nonen am 5., Iden am 13." },
	{ id: "mar", name: "Mārtius (März)", days: 31, nonen: 7, iden: 15, note: "M-M-J-O-Monat (ehem. Jahresbeginn): Nonen am 7., Iden am 15." },
	{ id: "mai", name: "Māius (Mai)", days: 31, nonen: 7, iden: 15, note: "M-M-J-O-Monat: Nonen am 7., Iden am 15." },
	{ id: "iul", name: "Iūlius (Juli)", days: 31, nonen: 7, iden: 15, note: "M-M-J-O-Monat, umbenannt nach Iūlius Caesar (früher Quīntīlis)." },
	{ id: "oct", name: "Octōber (Oktober)", days: 31, nonen: 7, iden: 15, note: "M-M-J-O-Monat (urspr. 8. Monat): Nonen am 7., Iden am 15." },
	{ id: "dec", name: "December (Dezember)", days: 31, nonen: 5, iden: 13, note: "Normalmonat (urspr. 10. Monat): Nonen am 5., Iden am 13." },
];

export function calendarDates(monthId: string): CalendarMonth {
	return CALENDAR_MONTHS.find((m) => m.id === monthId) ?? CALENDAR_MONTHS[0];
}

interface GenericInspectorItem {
	btn: string;
	box1: string;
	box2: string;
	box3: string;
	note: string;
}

export const INSPECTORS: Record<string, { title: string; items: GenericInspectorItem[] }> = {
	"vocab-card": {
		title: "Kontext-Schalter: Welches Objekt verändert die Bedeutung?",
		items: [
			{ btn: "pācem petit", box1: "pācem (Frieden)", box2: "petere (erstreben)", box3: "bittet um Frieden", note: "Bei einem Gut oder Hilfe bedeutet petere 'bitten um / erstreben'." },
			{ btn: "hostem petit", box1: "hostem (Feind)", box2: "petere (losgehen)", box3: "greift den Feind an", note: "Bei Gegnern im Kampf bedeutet petere 'angreifen'." },
			{ btn: "Rōmam petit", box1: "Rōmam (Zielort)", box2: "petere (ansteuern)", box3: "eilt nach Rom", note: "Bei Orten bedeutet petere 'aufsuchen / reisen nach'." },
			{ btn: "dē lēge agit", box1: "dē lēge (Gesetz)", box2: "agere (verhandeln)", box3: "berät über ein Gesetz", note: "Auf dem Forum heißt agere 'verhandeln'; auf dem Feld 'antreiben'." },
		],
	},
	wordfield: {
		title: "Wortnetz-Prüfer: Wortart · Wortfamilie · Sachfeld",
		items: [
			{ btn: "Wortfamilie am-", box1: "Stamm am-", box2: "amāre · amīcus · amīcitia", box3: "gleiche Wurzel", note: "Alle Wörter teilen denselben Kern und gehören zu einer Familie." },
			{ btn: "Wortfamilie rēg-", box1: "Stamm rēg-", box2: "rēx · rēgnum · rēgius", box3: "gleiche Wurzel", note: "König, Königsherrschaft und königlich teilen den Stamm rēg-." },
			{ btn: "Sachfeld Forum", box1: "Thema Politik", box2: "cūria · senātor · lēx · dīcere", box3: "verschiedene Stämme", note: "Im Sachfeld treffen sich Nomen und Verben desselben Lebensbereichs." },
			{ btn: "Unveränderlich", box1: "keine Endung", box2: "sed · in · cum · nunc", box3: "Partikel / Präp.", note: "Konjunktionen, Adverbien und Präpositionen verändern sich nie." },
		],
	},
	wordbuild: {
		title: "Wortzerleger: Präfix + Stamm + Suffix",
		items: [
			{ btn: "revocāre", box1: "re- (zurück)", box2: "voc- (rufen)", box3: "-āre (Verb)", note: "Präfix re- dreht die Richtung um → zurückrufen." },
			{ btn: "infēlīx", box1: "in- (un-)", box2: "fēlīc- (glücklich)", box3: "Adjektiv", note: "Vor Adjektiven verneint in- die Eigenschaft → unglücklich." },
			{ btn: "victor", box1: "—", box2: "vict- (siegen)", box3: "-or (Person)", note: "Das Suffix -tor/-sor/-or bezeichnet eine handelnde Person → Sieger." },
			{ btn: "lībertās", box1: "—", box2: "līber- (frei)", box3: "-tās (Zustand)", note: "-tās bildet weibliche Eigenschafts-Substantive → Freiheit." },
		],
	},
	inscription: {
		title: "Inschriften- und Redewendungs-Dekoder",
		items: [
			{ btn: "S. P. Q. R.", box1: "Inschrift", box2: "Senātus Populusque Rōmānus", box3: "Senat und Volk von Rom", note: "Stand auf Bauwerken, Münzen und Feldzeichen als Zeichen der Republik." },
			{ btn: "cōnsilium capere", box1: "wörtl. Rat nehmen", box2: "feste Wendung", box3: "einen Plan fassen", note: "Viele lateinische Verben verlangen im Deutschen ein anderes Treffwort." },
			{ btn: "grātiās agere", box1: "wörtl. Dank treiben", box2: "mit Dativ", box3: "jemandem danken", note: "Steht im Lateinischen regelmäßig mit dem Dativ (z. B. tibi grātiās agō)." },
			{ btn: "P. S. / etc.", box1: "Alltag", box2: "post scrīptum / et cētera", box3: "Nachtrag / und so weiter", note: "Beide Abkürzungen nutzen wir bis heute in deutschen Briefen und Texten." },
		],
	},
	etymology: {
		title: "Europäischer Stammbaum: Ein lateinisches Wort, viele Töchter",
		items: [
			{ btn: "aqua", box1: "lat. aqua (Wasser)", box2: "it. acqua · sp. agua", box3: "dt. Aquarium · en. aquatic", note: "Über die romanischen Sprachen und Fachsprachen überall wiedererkennbar." },
			{ btn: "porta", box1: "lat. porta (Tor)", box2: "frz. porte · it. porta · sp. puerta", box3: "dt. Portal · en. portal", note: "Das einfache Konsonanten-Gerüst p-r-t hilft sofort beim Erschließen." },
			{ btn: "mūrus", box1: "lat. mūrus (Mauer)", box2: "frz. mur · it. muro", box3: "dt. Lehnwort: Mauer", note: "Schon in der Antike übernahmen Germanen das Wort beim Steinbau." },
			{ btn: "schola", box1: "lat. schola (Schule)", box2: "frz. école · it. scuola", box3: "dt. Schule · en. school", note: "Schul- und Buchwörter (liber → library) wanderten quer durch Europa." },
		],
	},
	kng: {
		title: "KNG-Prüfbank über Deklinationsgrenzen",
		items: [
			{ btn: "nauta bonus", box1: "nauta (a-Dekl., m.)", box2: "Nom. Sg. m.", box3: "bonus (o-Dekl., m.)", note: "Berufswort nauta ist maskulin → Adjektiv wählt die maskuline Endung -us!" },
			{ btn: "manus magna", box1: "manus (u-Dekl., f.!)", box2: "Nom. Sg. f.", box3: "magna (a-Dekl., f.)", note: "manus ist weiblich trotz -us → das Adjektiv erhält -a!" },
			{ btn: "mīlite fortī", box1: "mīlite (3. kons., m.)", box2: "Abl. Sg. m.", box3: "fortī (3. i-Adj., -ī)", note: "Substantive enden oft auf -e, Adjektive der 3. Dekl. im Abl. Sg. auf -ī." },
			{ btn: "verba fortia", box1: "verba (o-Dekl., n.)", box2: "Nom./Akk. Pl. n.", box3: "fortia (3. i-Adj., -ia)", note: "Neutra Plural fordern beim Adjektiv der 3. Dekl. immer -ia!" },
		],
	},
	pronoun: {
		title: "Pronomen-Kompass: Wer ist gemeint?",
		items: [
			{ btn: "amīcum suum", box1: "Subjekt (Mārcus)", box2: "suus, -a, -um (reflexiv)", box3: "sein eigener Freund", note: "suus verweist immer zurück zum Subjekt desselben Satzes." },
			{ btn: "amīcum eius", box1: "Subjekt ≠ Besitzer", box2: "eius (Gen. zu is/ea)", box3: "dessen/deren Freund", note: "eius zeigt auf eine andere, zuvor genannte Person." },
			{ btn: "sibi dat", box1: "Subjekt = Empfänger", box2: "sibi (Dativ reflexiv)", box3: "gibt sich selbst", note: "meī/mihi/mē für mich, suī/sibi/sē zurück aufs 3.-Person-Subjekt." },
			{ btn: "quī / quem / quōrum", box1: "Bezugswort → G & N", box2: "Relativsatz → Kasus", box3: "der / den / deren", note: "Das Relativpronomen holt sein Geschlecht vorn und seinen Fall im Relativsatz." },
		],
	},
	conjugation: {
		title: "Konjugations-Prüfstand (3. Plural und Imperativ I)",
		items: [
			{ btn: "vocāre (a)", box1: "Stamm vocā-", box2: "3. Pl. vocant", box3: "Imp. vocā! / vocāte!", note: "Reiner a-Stamm ohne zusätzlichen Bindevokal." },
			{ btn: "monēre (e)", box1: "Stamm monē-", box2: "3. Pl. monent", box3: "Imp. monē! / monēte!", note: "Reiner e-Stamm; 1. Sg. mon-e-ō." },
			{ btn: "mittere (kons.)", box1: "Stamm mitt-", box2: "3. Pl. mitt-u-nt", box3: "Imp. mitte! / mittite!", note: "Braucht -i- (Sg.) und -u- (3. Pl.); Ausnahmen dīc, dūc, fac ohne -e!" },
			{ btn: "audīre / capere (i)", box1: "Stamm audī- / capi-", box2: "3. Pl. audiunt / capiunt", box3: "Imp. audī! / cape!", note: "Beide haben -iunt in der 3. Person Plural Präsens." },
		],
	},
	irregulars: {
		title: "Modalverben-Tafel: esse, posse, velle, nōlle, mālle",
		items: [
			{ btn: "esse / posse", box1: "sum · es · est", box2: "possum · potes · potest", box3: "eram / poteram · fuī / potuī", note: "pot- vor s wird zu pos-; alle Stämme gehen auf esse zurück." },
			{ btn: "velle (wollen)", box1: "volō · vīs · vult", box2: "volumus · vultis · volunt", box3: "volēbam · voluī", note: "Achte auf die unregelmäßigen Formen vīs und vult!" },
			{ btn: "nōlle & mālle", box1: "nōlō · nōn vīs · nōn vult", box2: "mālō · māvīs · māvult", box3: "nicht wollen / lieber wollen", note: "nōn + velle → nōlle; magis + velle → mālle." },
			{ btn: "nōlī / nōlīte", box1: "Imperativ Sg. nōlī", box2: "Imperativ Pl. nōlīte", box3: "+ Infinitiv = Tu das nicht!", note: "Nōlī timēre = Hab keine Angst! Nōlīte clāmāre = Schreit nicht!" },
		],
	},
	"tense-timeline": {
		title: "Tempus-Baukasten: Präsensstamm und Perfektstamm",
		items: [
			{ btn: "Imperfekt (-bā-/-ēbā-)", box1: "Präsensstamm", box2: "vocā-ba-t / mitt-ēba-t", box3: "er rief / schickte (damals)", note: "Signal -ba- / -ēba-; 1. Person Singular endet immer auf -m." },
			{ btn: "Futur I (-bo/-bi/-bu vs. -a/-ē)", box1: "Präsensstamm", box2: "vocā-bi-t vs. mitt-e-t", box3: "er wird rufen / schicken", note: "a-/e-Konj. nutzt -b-/-bi-/-bu-; kons./i-Konj. nutzt -a- (1. Sg.) und -ē-." },
			{ btn: "Plusquamperfekt (-erā-)", box1: "Perfektstamm", box2: "vocāv-erat / mīs-erat", box3: "er hatte gerufen / geschickt", note: "Perfektstamm + Imperfekt von esse (-eram, -erās, -erat...)." },
			{ btn: "Futur II (-erō/-eri-)", box1: "Perfektstamm", box2: "vocāv-erō / mīs-erint", box3: "wird geschickt haben", note: "3. Person Plural endet auf -erint (nicht -erunt!)." },
		],
	},
	perfekt: {
		title: "Perfekt-Detektiv: Alle sechs Bildungsarten",
		items: [
			{ btn: "v- / u-Perfekt", box1: "v-Perf.: vocāvī, audīvī", box2: "u-Perf.: monuī, habuī", box3: "Perf.-Endungen: -ī,-istī,-it...", note: "Typisch für viele regelmäßige Verben der a-, e- und i-Konjugation." },
			{ btn: "s-Perfekt", box1: "dīcere → dīxī", box2: "scrībere → scrīpsī", box3: "mittere → mīsī", note: "c/g + s verschmelzen zu x; b + s = ps." },
			{ btn: "Dehnung / Reduplikation", box1: "vidēre → vīdī", box2: "facere → fēcī · venīre → vēnī", box3: "dare → dedī · currere → cucurrī", note: "Entweder langer Stammvokal (mit Wechsel) oder doppelte Anlautsilbe." },
			{ btn: "Ohne Stammänderung", box1: "dēfendere → dēfendī", box2: "3. Sg. dēfendit = Präs. / Perf.", box3: "Nachbarsätze prüfen!", note: "Erst Zeitwörter (heri) und eindeutige Nachbarverben zeigen das Tempus." },
		],
	},
	aspect: {
		title: "Szenen-Umschalter: Hintergrund (Imperfekt) vs. Aktion (Perfekt)",
		items: [
			{ btn: "Kulisse (Imperfekt)", box1: "Nox erat; servī dormiēbant.", box2: "Zustand / Gleichzeitigkeit", box3: "Es war Nacht; die Sklaven schliefen.", note: "Das Imperfekt malt den ruhigen Hintergrund der Szene." },
			{ btn: "Gewohnheit (Imperfekt)", box1: "Cotīdiē ad scholam ambulābat.", box2: "Wiederholung (cotīdiē)", box3: "Jeden Tag ging er zur Schule.", note: "Dauerhafte Gewohnheiten in der Vergangenheit stehen im Imperfekt." },
			{ btn: "Ereignis (Perfekt)", box1: "Subitō canis lātrāvit.", box2: "Signalwort subitō + -vit", box3: "Plötzlich bellte der Hund.", note: "Das Perfekt bringt die neue, unerwartete Haupthandlung." },
			{ btn: "Direkte Rede (Perfekt)", box1: "Hodiē bene labōrāvistī!", box2: "Bezug zur Gegenwart", box3: "Heute hast du gut gearbeitet!", note: "In wörtlicher Rede mit hodiē übersetzen wir gern mit deutschem Perfekt." },
		],
	},
	abfrage: {
		title: "Satzglied-Scanner im Abfrageschema",
		items: [
			{ btn: "1. Prädikat → Subjekt", box1: "dat (3. Sg. Präs.)", box2: "Wer gibt? → dux (Nom. Sg.)", box3: "Der Feldherr gibt...", note: "Das gebeugte Verb steuert immer die Suche nach dem passenden Subjekt." },
			{ btn: "2. Akkusativobjekt", box1: "Wen / was gibt er?", box2: "signum (Akk. Sg. n.)", box3: "... das Zeichen", note: "Direktes Objekt auf die Frage Wen oder was?" },
			{ btn: "3. Dativobjekt & Adv.", box1: "Wem? → mīlitibus (Dat. Pl.)", box2: "Wo? → in campō (Abl.)", box3: "... den Soldaten auf dem Feld", note: "Empfänger und Orts-/Zeitangaben vervollständigen das Satzbild." },
			{ btn: "Prädikatsnomen bei esse", box1: "Rōma (Subjekt)", box2: "est (Kopula)", box3: "magna urbs (Nom.!)", note: "Nach esse steht kein Akkusativ, sondern ein Prädikatsnomen im Nominativ." },
		],
	},
	syntax: {
		title: "Rektions- & Stellungsvergleich Latein ↔ Deutsch",
		items: [
			{ btn: "iuvāre + Akk.", box1: "Mīles ducem iuvat.", box2: "Rektion: Akkusativ!", box3: "Der Soldat hilft dem Feldherrn.", note: "Anders als deutsches 'helfen + Dativ' verlangt iuvāre den Akkusativ." },
			{ btn: "pārēre + Dat.", box1: "Līberī mātrī pārent.", box2: "Rektion: Dativ!", box3: "Die Kinder gehorchen der Mutter.", note: "Wie bei nocēre (schaden) und studēre steht hier der Dativ." },
			{ btn: "in: Wo? vs. Wohin?", box1: "in forō (Abl. = Wo?)", box2: "in forum (Akk. = Wohin?)", box3: "auf dem Forum vs. aufs Forum", note: "Auch sub wechselt zwischen Ruhe (Ablativ) und Richtung (Akkusativ)." },
			{ btn: "Sperrung & Endstellung", box1: "Magnā cum cūrā ... scrībit", box2: "Attribut klammert Präp.", box3: "dt. Verb auf Position 2", note: "Latein stellt das finite Verb ans Ende und darf Wortgruppen verschränken." },
		],
	},
	cases: {
		title: "Kasusfunktionen mit der passenden Frage aufdecken",
		items: [
			{ btn: "Dativ des Besitzers", box1: "Mārcō multī librī sunt.", box2: "Dativ + esse", box3: "Marcus hat viele Bücher.", note: "Der Dativ wird zum deutschen Subjekt; esse übersetzt man mit 'haben'." },
			{ btn: "Akk. der Zeitdauer", box1: "Trēs hōrās lūdimus.", box2: "Frage: Wie lange?", box3: "Wir spielen drei Stunden lang.", note: "Zeitspanne steht ohne Präposition im Akkusativ." },
			{ btn: "Abl. Mittel / Grund", box1: "gladiō / gaudiō", box2: "Womit? / Warum?", box3: "mit dem Schwert / vor Freude", note: "Werkzeug (Sache!) und Ursache stehen ohne Präposition im Ablativ." },
			{ btn: "Abl. Trennung / Zeit", box1: "metū līberat / nocte", box2: "Wovon? / Wann?", box3: "befreit von Furcht / nachts", note: "Ablātīvus sēparātiōnis (wovon?) und temporis (Zeitpunkt: wann?)." },
		],
	},
	clauses: {
		title: "Nebensatz- und Fragesignale",
		items: [
			{ btn: "Fragen (-ne / nōnne / num)", box1: "-ne (offen) · nōnne (Ja!)", box2: "num (etwa? → Nein!)", box3: "richtiger Antwortton", note: "Die Fragepartikel am Satzbeginn verrät die Erwartung des Sprechers." },
			{ btn: "temporal & kausal", box1: "postquam · dum · ubi", box2: "quod · quia", box3: "nachdem / während · weil", note: "Beachte bei postquam: lat. Perfekt wird nach Vergangenheit zu Plusquamperfekt!" },
			{ btn: "konditional & konzessiv", box1: "sī / nisi (wenn / wenn nicht)", box2: "quamquam (obwohl)", box3: "Bedingung vs. Einräumung", note: "Alle vier Adverbialsätze stehen in Klasse 5 im Indikativ." },
			{ btn: "Relativer Satzanschluss", box1: "... epistulam. Quam legī.", box2: "Relativpron. nach Punkt!", box3: "... Diesen las ich.", note: "Kein Nebensatz! Übersetze mit Demonstrativpronomen (Dieser / Diese / Dieses)." },
		],
	},
	arch: {
		title: "Architektur- und Kunst-Labor: Was machte Rom zum caput mundī?",
		items: [
			{ btn: "Rundbogen & Gewölbe", box1: "arcus (Rundbogen)", box2: "leitet Last seitlich ab", box3: "Aquädukte · Kolosseum · Brücken", note: "Der Rundbogen ermöglichte mehrstöckige Monumentalbauten." },
			{ btn: "Kuppel & Gussbeton", box1: "opus caementicium", box2: "Pantheon-Kuppel", box3: "riesige freie Innenräume", note: "Wasserfester römischer Mörtelbeton härtete sogar im Hafenwasser aus." },
			{ btn: "Realistisches Porträt", box1: "Büste mit Falten", box2: "Charakter statt Ideal", box3: "Antikenmuseen (München)", note: "Römische Ahnenporträts betonten Erfahrung, Würde und Einzelzüge." },
			{ btn: "Spuren bei uns", box1: "Castra Rēgina (Regensburg)", box2: "Augusta Vindelicōrum", box3: "Säulen & Bögen an Rathäusern", note: "Römische Bauformen und Stadtgründungen leben bis heute in Bayern fort." },
		],
	},
	"compare-gr": {
		title: "Kulturvergleich: Griechisch vs. Römisch",
		items: [
			{ btn: "Tempelbau", box1: "GR: Stufen ringsum", box2: "RO: hohes Podium + Treppe", box3: "beide: dor./ion./kor. Säulen", note: "Römische Tempel richten die ganze Schauseite auf den Platz davor aus." },
			{ btn: "Götterwelt", box1: "GR: Zeus · Athene · Ares", box2: "RO: Iuppiter · Minerva · Mārs", box3: "Übernahme griech. Mythen", note: "Römische Götter übernahmen Eigenschaften und Sagen der Olympier." },
			{ btn: "Heldensage", box1: "GR: Homer (Troja)", box2: "RO: Vergil (Aeneas)", box3: "Trojaner als Urahn Roms", note: "Der trojanische Prinz Aeneas verband Roms Ursprung mit der großen Sagenwelt." },
			{ btn: "Sprache & Bildung", box1: "griechische Hauslehrer", box2: "Rhetorik & Philosophie", box3: "Latein als Rechtssprache", note: "Gebildete Römer lernten Griechisch und bauten Latein ebenbürtig aus." },
		],
	},
	values: {
		title: "Römische Grundwerte (mōs maiōrum) im Praxistest",
		items: [
			{ btn: "pietās (3 Richtungen)", box1: "Götter · Eltern · Staat", box2: "Aeneas rettet Vater & Penaten", box3: "Pflicht & Respekt", note: "Meint in Rom tätiges Verantwortungsgefühl, nicht bloß Mitleid." },
			{ btn: "virtūs", box1: "von vir (Tatkraft)", box2: "Mut, Ausdauer, Leistung", box3: "Vorbild: Herkules", note: "Bewährung in Notlagen zum Nutzen der Gemeinschaft." },
			{ btn: "fidēs", box1: "Worttreue / Vertrauen", box2: "Verträge & Freundschaft halten", box3: "Fundament der Gesellschaft", note: "Verlässlichkeit zwischen Bürgern, Partnern und dem Staat." },
			{ btn: "Senat (senātus)", box1: "Rat der Erfahrenen", box2: "Tagungsort: Cūria am Forum", box3: "lātus clāvus (Purpurstreifen)", note: "Beriet Konsuln und Volk über Krieg, Verträge und Religion." },
		],
	},
	"tria-nomina": {
		title: "Römischer Namensbaukasten (Tria Nomina)",
		items: [
			{ btn: "C. Iūlius Caesar", box1: "Praenōmen: Gāius (C.)", box2: "Nōmen gentīle: Iūlius", box3: "Cognōmen: Caesar", note: "Vorname + Sippenname (gens Iūlia) + Zweig-Beiname." },
			{ btn: "M. Tullius Cicerō", box1: "Praenōmen: Mārcus (M.)", box2: "Nōmen gentīle: Tullius", box3: "Cognōmen: Cicerō", note: "Tullius nennt das Geschlecht; Cicerō ('Kichererbse') den Familienzweig." },
			{ btn: "Töchter (Iūlia / Tullia)", box1: "kein Praenōmen", box2: "weibl. Sippenname", box3: "Iūlia / Cornēlia / Tullia", note: "Mehrere Töchter unterschied man durch Maior/Minor oder Prīma/Secunda." },
			{ btn: "pater familiās", box1: "Eltern + Kinder + Sklaven", box2: "patria potestās", box3: "mātrōna leitet Haus", note: "Die familia umfasste den ganzen Hausstand unter Leitung des Hausvaters." },
		],
	},
	"society-scale": {
		title: "Rechte und Wege in der römischen Gesellschaft",
		items: [
			{ btn: "servus (Land / Mine)", box1: "unfrei (Besitz)", box2: "Schwerstarbeit", box3: "kaum Rechte", note: "Kriegsgefangene auf Großgütern und in Bergwerken litten besonders hart." },
			{ btn: "servus (Stadthaus)", box1: "unfrei (Besitz)", box2: "Arzt · Lehrer · Sekretär", box3: "Chance auf Freilassung", note: "Gebildete griechische Sklaven genossen oft Vertrauen in der Familie." },
			{ btn: "manūmissiō → lībertus", box1: "Freilassung", box2: "Status: Freigelassener", box3: "meist römisches Bürgerrecht", note: "Als lībertus blieb er oft wirtschaftlich mit dem früheren Herrn verbunden." },
			{ btn: "Gladiator (lūdus)", box1: "strenges Training", box2: "teurer Berufskämpfer", box3: "missiō (oft Begnadigung)", note: "Kämpfe waren blutige Unterhaltung, endeten aber oft ohne Tod." },
		],
	},
	"school-kit": {
		title: "Schule, Schriftträger und Kleidung im antiken Rom",
		items: [
			{ btn: "tabula & stilus", box1: "Wachstafel + Griffel", box2: "Ritzen & Glätten", box3: "wiederverwendbar", note: "Das flache Ende des stilus radierte Fehler sofort im Wachs aus." },
			{ btn: "volūmen & cōdex", box1: "Papyrusrolle / gebundenes Buch", box2: "Rohrfeder (calamus) + Tinte", box3: "dauerhafte Literatur", note: "Dichter und Redner wurden auf langen Papyrusrollen aufbewahrt." },
			{ btn: "toga & tunica", box1: "tunica (Unterhemd)", box2: "toga (weißer Wollumhang)", box3: "nur für männliche Bürger!", note: "Jungen bis zur Volljährigkeit trugen die toga praetexta mit Bulla." },
			{ btn: "stola & palla", box1: "tunica darunter", box2: "stola (langes Kleid)", box3: "palla (Umhangtuch draußen)", note: "Das Ehrenkleid der verheirateten römischen Bürgerin (mātrōna)." },
		],
	},
	religion: {
		title: "Römisches Ritual: Tempel, Opfer und Vogelschau",
		items: [
			{ btn: "Cella vs. Āra", box1: "Cella (innen)", box2: "Götterbild wohnt darin", box3: "Āra (draußen): Volksopfer", note: "Der Gottesdienst fand im Freien vor der Tempelfront statt." },
			{ btn: "dō ut dēs", box1: "Mensch bringt Opfergabe", box2: "fehlerfreies Gebet", box3: "Gott gewährt Schutz", note: "Vertragsverhältnis auf Gegenseitigkeit statt innerem Bekenntnis." },
			{ btn: "Auspizien (Augur)", box1: "avis + specere", box2: "Vogelflug & Himmelsfeld", box3: "Zustimmung oder Warnung", note: "Vor Wahlen, Senatssitzungen und Schlachten Pflicht für Beamte." },
			{ btn: "Orakel (Delphi)", box1: "Priesterin Pythia", box2: "rätselhafter Spruch", box3: "Deutung nötig", note: "In großen Krisen befragte Rom auch das griechische Orakel in Delphi." },
		],
	},
	underworld: {
		title: "Stationen der Seele auf dem Weg in den Orcus",
		items: [
			{ btn: "Via Appia & D. M.", box1: "Gräber außerhalb der Stadt", box2: "Dīs Mānibus (D. M.)", box3: "Erinnerung beim Vorbeigehen", note: "Ohne ordentliche Bestattung und Totengedenken fand die Seele keine Ruhe." },
			{ btn: "Charōn & Styx", box1: "Münze im Mund (Obolus)", box2: "Fährmann Charōn", box3: "Fahrt über Fluss Styx", note: "Der Fährlohn sicherte den Platz in Charons kleinem Boot." },
			{ btn: "Cerberus & Richter", box1: "dreiköpfiger Wachhund", box2: "Totengericht", box3: "Abwägen der Taten", note: "Cerberus begrüßt Ankommende, lässt aber niemanden wieder zurück." },
			{ btn: "Ēlysium vs. Tartarus", box1: "Plūtō & Prōserpina", box2: "Ēlysium (Selige/Helden)", box3: "Tartarus (Strafort)", note: "Hier trennt der Mythos gerechtes von frevelhaftem Handeln." },
		],
	},
	"myth-heroes": {
		title: "Helden-Steckbriefe: Herakles/Herkules und Aeneas",
		items: [
			{ btn: "Herkules: 12 Taten", box1: "Löwe · Hydra · Cerberus", box2: "Ausdauer & Körperkraft", box3: "röm. Vorbild für virtūs", note: "Im Dienst des Eurystheus bezwang er zwölf scheinbar unlösbare Aufgaben." },
			{ btn: "Aeneas: Flucht Troja", box1: "Vater Anchises auf Schulter", box2: "Sohn Iulus an der Hand", box3: "Hausgötter (Penaten)", note: "Er rettete Familie, Vergangenheit und Zukunft – Inbegriff der pietās." },
			{ btn: "Aeneas: Latium", box1: "Sohn der Venus", box2: "Irrfahrt über Karthago", box3: "Landung in Italien", note: "Durch Sohn Iulus (Ascanius) entstand der Stammbaum zu Alba Longa und Rom." },
		],
	},
	"text-map": {
		title: "Text-Radar vor dem ersten Übersetzen",
		items: [
			{ btn: "1. Titel & Namen", box1: "De incendio in Forō", box2: "Forum · Vesta · Cōnsul", box3: "Schauplatz & Akteure klar", note: "Großbuchstaben zeigen sofort handelnde Figuren und heilige Orte." },
			{ btn: "2. Sachfeld-Netz", box1: "flammae · ignis", box2: "aqua · dēfendere · opprimere", box3: "Feuer & Rettung!", note: "Das Wortfeld schließt falsche Bedeutungen schon vorab aus." },
			{ btn: "3. W-Fragen-Check", box1: "Wer? (cīvēs, mīlitēs)", box2: "Wann? (nocte)", box3: "Was? (Feuer bekämpfen)", note: "Erst wenn der rote Faden steht, übersetzt man Satz für Satz." },
		],
	},
	"error-check": {
		title: "Fehler-Werkbank: Entwurf → Diagnose → Korrektur",
		items: [
			{ btn: "Subjekt vs. Akkusativ", box1: "Senātōrem cīvēs salūtant", box2: "-em = Akk. · -ēs = Nom.", box3: "Die Bürger begrüßen den Senator.", note: "Niemals blind das erste Wort zum Subjekt erklären!" },
			{ btn: "Tempus-Falle (-it/-et)", box1: "audit vs. audiet", box2: "-e- in kons./i-Konj. = Futur!", box3: "er hört vs. er wird hören", note: "Ein einziger Vokal vor dem -t entscheidet über Gegenwart oder Zukunft." },
			{ btn: "AcI-Zeitverhältnis", box1: "Audīvī eum vēnisse", box2: "Inf. Perf. = vorzeitig", box3: "... dass er gekommen war", note: "Infinitiv Perfekt nach Vergangenheit verlangt deutsches Plusquamperfekt." },
			{ btn: "Numerus & KNG", box1: "dōna magna dedit", box2: "dōna = Neutrum Plural!", box3: "gab große Geschenke", note: "-a bei Neutra nicht mit feminin Singular verwechseln!" },
		],
	},
	"study-plan": {
		title: "Lernwerkzeuge und 5-Tage-Planung",
		items: [
			{ btn: "Vokabelkartei", box1: "10–15 Min. täglich", box2: "Fach 1 → Fach 3", box3: "mit Genitiv & Eselsbrücke", note: "Regelmäßige kurze Wiederholung verankert Wörter im Langzeitgedächtnis." },
			{ btn: "Eigener Merkkasten", box1: "Stamm vs. Endung farbig", box2: "Ausnahmen markieren", box3: "selbst gezeichnet", note: "Selbst Strukturieren schafft Verständnis statt bloßem Auswendiglernen." },
			{ btn: "5-Tage-Plan", box1: "T1–2: Wortschatz", box2: "T3–4: Formen & Übungstext", box3: "T5: Checkliste & Schlaf", note: "Verteilte Vorbereitung schlägt Panik am letzten Abend." },
		],
	},
	"team-roles": {
		title: "Kooperatives Arbeiten und Feedback-Leitfaden",
		items: [
			{ btn: "Standbild / Spielszene", box1: "Blickrichtung & Haltung", box2: "Rollen im Text spüren", box3: "passendes Latein-Zitat", note: "Macht Machtverhältnisse und Gefühle der Szene für alle sichtbar." },
			{ btn: "Lernzirkel / Stationen", box1: "Reihenfolge planen", box2: "erst selbst lösen", box3: "ehrlich kontrollieren", note: "Offenes Lernen funktioniert nur mit ehrlicher Selbstprüfung." },
			{ btn: "Faires Feedback", box1: "1. Konkret loben", box2: "2. Respektvoller Tipp", box3: "Gemeinsam verbessern", note: "Nie pauschal abwerten – immer sachlich und ermutigend rückmelden." },
		],
	},
};

export const PANTHEON_DATA = [
	{ r: "Iuppiter", g: "Zeus", sym: "Blitz & Adler", role: "Göttervater, Himmel & Recht" },
	{ r: "Iūnō", g: "Hera", sym: "Pfau & Diadem", role: "Ehe, Familie & Schutz" },
	{ r: "Minerva", g: "Athene", sym: "Eule & Helm", role: "Weisheit, Kunst & Handwerk" },
	{ r: "Neptūnus", g: "Poseidon", sym: "Dreizack", role: "Meer, Flüsse & Erdbeben" },
	{ r: "Apollō", g: "Apollon", sym: "Leier & Lorbeer", role: "Licht, Musik & Weissagung" },
	{ r: "Diāna", g: "Artemis", sym: "Bogen & Köcher", role: "Jagd, Wald & Mond" },
	{ r: "Mārs", g: "Ares", sym: "Lanze & Schild", role: "Krieg, Vater des Romulus" },
	{ r: "Venus", g: "Aphrodite", sym: "Taube & Spiegel", role: "Liebe, Schönheit, Mutter des Aeneas" },
	{ r: "Mercurius", g: "Hermes", sym: "Flügelschuhe & Stab", role: "Götterbote, Handel & Reisen" },
	{ r: "Volcānus", g: "Hephaistos", sym: "Hammer & Zange", role: "Feuer & Schmiedekunst" },
	{ r: "Cerēs", g: "Demeter", sym: "Ährenkranz", role: "Ackerbau, Getreide & Ernte" },
	{ r: "Vesta", g: "Hestia", sym: "Ewiges Feuer", role: "Herd & Staatsfeuer am Forum" },
];

export const ROME_TIMELINE_STATIONS = [
	{ id: "troja", year: "Mythos", title: "Fall Trojas & Flucht", text: "Aeneas rettet Vater Anchises, Sohn Iulus und die Penaten." },
	{ id: "latium", year: "Latium", title: "Ankunft in Italien", text: "Nach Irrfahrten (Karthago) landet Aeneas in Latium; Sohn Iulus gründet Alba Longa." },
	{ id: "romulus", year: "753 v. Chr.", title: "Romulus & Remus", text: "Von der Wölfin gesäugt; Auspizienstreit; Romulus gründet Rom auf dem Palatin." },
	{ id: "sabiner", year: "Frühzeit", title: "Raub der Sabinerinnen", text: "Die Frauen versöhnen Römer und Sabiner; beide Völker wachsen zusammen." },
	{ id: "koenige", year: "7 Könige", title: "Königszeit bis 509 v. Chr.", text: "Vertreibung des hochmütigen Tarquinius Superbus → Beginn der Republik." },
	{ id: "quellen", year: "1. Jh. v. Chr.", title: "Vergil & Livius", text: "Vergil dichtet die 'Aeneis'; Titus Livius verfasst 'Ab urbe conditā'." },
];

function renderExplorer(lesson: Lesson): string {
	const kind = lesson.workshop.kind;
	if (kind === "rome-map") return renderRomeMap("all", "forum");

	if (kind === "prosody") {
		const initial = PROSODY_WORDS[0];
		return `<div class="explorer-card" data-explorer="prosody">
			<div class="explorer-controls">
				<label for="prosody-select">Wort testen:</label>
				<select id="prosody-select">${PROSODY_WORDS.map((w, i) => `<option value="${i}">${esc(w.word)}</option>`).join("")}</select>
			</div>
			<svg id="prosody-svg" class="lab-svg" viewBox="0 0 600 120" role="img" aria-label="Silben- und Betonungsmodell"></svg>
			<p id="prosody-readout" class="explorer-readout" aria-live="polite">${esc(initial.reason)}</p>
		</div>`;
	}

	if (kind === "declension") {
		const initialClass =
			lesson.id === "l5-dritte-deklination"
				? "3k"
				: lesson.id === "l5-u-e-deklination"
					? "u"
					: "a";
		return `<div class="explorer-card" data-explorer="declension" data-init-class="${initialClass}">
			<div class="explorer-controls">
				<label for="decl-class">Klasse:</label>
				<select id="decl-class">${DECLENSIONS.map((d) => `<option value="${d.id}" ${d.id === initialClass ? "selected" : ""}>${esc(d.label)}</option>`).join("")}</select>
				<button type="button" data-decl-num="sg" aria-pressed="true">Singular</button>
				<button type="button" data-decl-num="pl" aria-pressed="false">Plural</button>
				${KASUS_INFO.map((k, idx) => `<button type="button" data-decl-case="${idx}" aria-pressed="${idx === 0}">${esc(k.name)}</button>`).join("")}
			</div>
			<svg id="decl-svg" class="lab-svg" viewBox="0 0 600 120" role="img" aria-label="Deklinations-Baukasten"></svg>
			<p id="decl-readout" class="explorer-readout" aria-live="polite"></p>
		</div>`;
	}

	if (kind === "numerals") {
		return `<div class="explorer-card" data-explorer="numerals">
			<div class="explorer-controls">
				<label for="num-slider">Zahl einstellen (1 bis 12): <strong id="num-val">7</strong></label>
				<input id="num-slider" type="range" min="1" max="12" value="7">
			</div>
			<svg id="num-svg" class="lab-svg" viewBox="0 0 600 120" role="img" aria-label="Römische Zahlentafel von I bis XII"></svg>
			<p id="num-readout" class="explorer-readout" aria-live="polite"></p>
		</div>`;
	}

	if (kind === "aci") {
		return `<div class="explorer-card" data-explorer="aci">
			<div class="explorer-controls">
				<span>Hauptsatz:</span>
				<button type="button" data-aci-main="pres" aria-pressed="true">Audiō (Präsens)</button>
				<button type="button" data-aci-main="perf" aria-pressed="false">Audīvī (Perfekt)</button>
				<span>AcI-Infinitiv:</span>
				<button type="button" data-aci-inf="pres" aria-pressed="true">venīre (gleichzeitig)</button>
				<button type="button" data-aci-inf="perf" aria-pressed="false">vēnisse (vorzeitig)</button>
			</div>
			<svg id="aci-svg" class="lab-svg" viewBox="0 0 600 125" role="img" aria-label="Live-AcI-Zeitverhältnis"></svg>
			<p id="aci-readout" class="explorer-readout" aria-live="polite"></p>
		</div>`;
	}

	if (kind === "calendar") {
		return `<div class="explorer-card" data-explorer="calendar">
			<div class="explorer-controls">
				<label for="cal-month">Monat wählen:</label>
				<select id="cal-month">${CALENDAR_MONTHS.map((m) => `<option value="${m.id}">${esc(m.name)}</option>`).join("")}</select>
			</div>
			<svg id="cal-svg" class="lab-svg" viewBox="0 0 600 120" role="img" aria-label="Römischer Monatsstreifen mit Kalenden, Nonen und Iden"></svg>
			<p id="cal-readout" class="explorer-readout" aria-live="polite"></p>
		</div>`;
	}

	if (kind === "pantheon") {
		return `<div class="explorer-card" data-explorer="pantheon">
			<div class="explorer-controls" role="group" aria-label="Gottheit wählen">
				${PANTHEON_DATA.map((g, idx) => `<button type="button" data-god="${idx}" aria-pressed="${idx === 0}">${esc(g.r)} (${esc(g.g)})</button>`).join("")}
			</div>
			<svg id="god-svg" class="lab-svg" viewBox="0 0 600 115" role="img" aria-label="Steckbrief des ausgewählten Olympiers"></svg>
			<p id="god-readout" class="explorer-readout" aria-live="polite"></p>
		</div>`;
	}

	if (kind === "timeline-rome") {
		return `<div class="explorer-card" data-explorer="timeline-rome">
			<div class="explorer-controls" role="group" aria-label="Zeitpunkt wählen">
				${ROME_TIMELINE_STATIONS.map((st, idx) => `<button type="button" data-tl="${idx}" aria-pressed="${idx === 0}">${esc(st.year)} · ${esc(st.title)}</button>`).join("")}
			</div>
			<svg id="tl-svg" class="lab-svg" viewBox="0 0 600 120" role="img" aria-label="Zeitstrahl des römischen Gründungsmythos"></svg>
			<p id="tl-readout" class="explorer-readout" aria-live="polite"></p>
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

export function drawProsodySvg(word: ProsodyWord): string {
	const count = word.syllables.length;
	const boxW = 110;
	const gap = 16;
	const totalW = count * boxW + (count - 1) * gap;
	const startX = Math.round((600 - totalW) / 2);
	const boxes = word.syllables
		.map((syl, idx) => {
			const x = startX + idx * (boxW + gap);
			const stressed = idx === word.stressIndex;
			const isPenult = idx === count - 2;
			const role =
				idx === count - 1
					? "Ultima"
					: idx === count - 2
						? word.penultLong
							? "Paenultima (lang ¯)"
							: "Paenultima (kurz ˘)"
						: idx === count - 3
							? "Antepaenultima"
							: "Anlautsilbe";
			return `<g>
				${card(x, 26, boxW, 56, stressed ? "v-orange-fill" : isPenult ? "v-teal-fill" : "v-paper", 10)}
				${label(x + boxW / 2, 54, stressed ? syl.toUpperCase() : syl, stressed ? "heading" : "small")}
				${label(x + boxW / 2, 74, stressed ? "★ BETONT" : "unbetont", "micro")}
				${label(x + boxW / 2, 102, role, "micro")}
			</g>`;
		})
		.join("");
	return `${card(2, 2, 596, 116, "v-panel", 10)}${label(300, 18, `Silbenwaage: ${word.word}`, "micro")}${boxes}`;
}

export function drawDeclensionSvg(classId: string, num: "sg" | "pl", kasusIndex: number): string {
	const d = declensionForm(classId, num, kasusIndex);
	const cls = DECLENSIONS.find((entry) => entry.id === classId) ?? DECLENSIONS[0];
	const stemPart = d.ending.startsWith("(") ? d.form : cls.stem;
	const endPart = d.ending.startsWith("(") ? "∅" : d.ending;
	return `${card(2, 2, 596, 116, "v-panel", 10)}
		${pill(22, 26, 148, 52, `Stamm: ${stemPart}`, "v-blue-fill", "small")}
		${label(184, 57, "+", "heading")}
		${pill(198, 26, 134, 52, `Endung: ${endPart}`, "v-orange-fill", "small")}
		${label(346, 57, "=", "heading")}
		${pill(360, 26, 218, 52, d.form, "v-teal-fill", "heading")}
		${label(300, 102, `${KASUS_INFO[kasusIndex].name} ${num === "sg" ? "Singular" : "Plural"} · Frage: ${d.question}`, "micro")}`;
}

export function drawNumeralSvg(info: NumeralInfo): string {
	return `${card(2, 2, 596, 116, "v-panel", 10)}
		${card(18, 18, 120, 84, "v-gold-fill", 10)}
		${label(78, 56, info.roman, "heading")}
		${label(78, 82, `Zahl ${info.n}`, "micro")}
		${pill(156, 24, 206, 36, `Kardinale: ${info.cardinal}`, "v-blue-fill", "micro")}
		${pill(156, 68, 206, 36, `Ordinale: ${info.ordinal}`, "v-teal-fill", "micro")}
		${card(378, 18, 204, 84, "v-paper", 10)}
		${label(480, 46, info.n <= 3 ? "deklinierbar (KNG)" : "unveränderlich (4–12)", "small")}
		${label(480, 74, info.n === 4 || info.n === 9 ? "Subtraktionsregel!" : "Addition / Basis", "micro")}`;
}

export function drawAciSvg(mainTense: "pres" | "perf", infTense: "pres" | "perf"): string {
	const data = aciPreview(mainTense, infTense);
	const head = mainTense === "pres" ? "Audiō" : "Audīvī";
	const inf = infTense === "pres" ? "venīre" : "vēnisse";
	return `${card(2, 2, 596, 121, "v-panel", 10)}
		${pill(16, 20, 122, 42, head, "v-blue-fill", "small")}
		${pill(150, 20, 152, 42, "Mārcum (Akk.)", "v-purple-fill", "small")}
		${pill(314, 20, 130, 42, inf, "v-teal-fill", "small")}
		${pill(456, 20, 128, 42, infTense === "pres" ? "gleichzeitig" : "vorzeitig", "v-orange-fill", "micro")}
		${card(16, 74, 568, 38, "v-paper", 8)}
		${label(300, 98, `Übersetzung: „${data.german}“`, "small")}`;
}

export function drawCalendarSvg(m: CalendarMonth): string {
	const cellW = 17.5;
	const startX = 28;
	const bars = Array.from({ length: m.days }, (_, idx) => {
		const day = idx + 1;
		const x = startX + idx * cellW;
		const isKal = day === 1;
		const isNon = day === m.nonen;
		const isId = day === m.iden;
		const cls = isKal ? "v-blue" : isNon ? "v-gold" : isId ? "v-coral" : "v-paper";
		return `<rect x="${x.toFixed(1)}" y="34" width="14" height="${isKal || isNon || isId ? 38 : 24}" rx="3" class="${cls}"/>`;
	}).join("");
	return `${card(2, 2, 596, 116, "v-panel", 10)}
		${label(300, 22, `${m.name}: ${m.days} Tage`, "small")}
		${bars}
		${pill(34, 84, 156, 24, "Kalenden = 1.", "v-blue-fill", "micro")}
		${pill(222, 84, 156, 24, `Nonen = ${m.nonen}.`, "v-gold-fill", "micro")}
		${pill(410, 84, 156, 24, `Iden = ${m.iden}.`, "v-coral-fill", "micro")}`;
}

export function drawPantheonSvg(index: number): string {
	const g = PANTHEON_DATA[index] ?? PANTHEON_DATA[0];
	return `${card(2, 2, 596, 111, "v-panel", 10)}
		${pill(18, 24, 172, 42, `Römisch: ${g.r}`, "v-coral-fill", "small")}
		${pill(204, 24, 178, 42, `Griechisch: ${g.g}`, "v-blue-fill", "small")}
		${pill(396, 24, 186, 42, `Zeichen: ${g.sym}`, "v-gold-fill", "micro")}
		${label(300, 92, `Zuständigkeit: ${g.role}`, "small")}`;
}

export function drawTimelineSvg(index: number): string {
	const st = ROME_TIMELINE_STATIONS[index] ?? ROME_TIMELINE_STATIONS[0];
	const nodes = ROME_TIMELINE_STATIONS.map((entry, idx) => {
		const cx = 56 + idx * 96;
		const active = idx === index;
		return `<g>
			<circle cx="${cx}" cy="44" r="${active ? 12 : 8}" class="${active ? "v-coral" : "v-paper"}"/>
			<text x="${cx}" y="22" text-anchor="middle" class="visual-label micro">${escSvg(entry.year)}</text>
		</g>`;
	}).join("");
	return `${card(2, 2, 596, 116, "v-panel", 10)}
		<line x1="56" y1="44" x2="536" y2="44" class="v-outline-thick"/>
		${nodes}
		${card(24, 68, 552, 40, "v-paper", 8)}
		${label(300, 93, `${st.title}: ${st.text}`, "micro")}`;
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

	// Rome map binding
	const mapEl = container.querySelector<HTMLElement>(".rome-map");
	if (mapEl) {
		let layer: "all" | RomePlace["layer"] = "all";
		let placeId = "forum";
		const rerenderMap = () => {
			mapEl.outerHTML = renderRomeMap(layer, placeId);
			bindRomeControls();
		};
		const bindRomeControls = () => {
			const fresh = container.querySelector<HTMLElement>(".rome-map");
			if (!fresh) return;
			fresh
				.querySelectorAll<HTMLButtonElement>("[data-map-focus]")
				.forEach((btn) => {
					btn.addEventListener("click", () => {
						layer = btn.dataset.mapFocus as "all" | RomePlace["layer"];
						fresh
							.querySelectorAll("[data-map-focus]")
							.forEach((b) =>
								b.setAttribute("aria-pressed", String(b === btn)),
							);
						fresh
							.querySelectorAll<SVGGElement>("[data-map-layer]")
							.forEach((g) => {
								g.style.opacity =
									layer === "all" || g.dataset.mapLayer === layer ? "1" : "0.2";
							});
					});
				});
			const selectPlace = (id: string) => {
				placeId = id;
				const p = ROME_PLACES.find((entry) => entry.id === id);
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
						c.setAttribute("r", active ? "8" : "6");
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
						selectPlace(btn.dataset.placeBtn ?? "forum"),
					),
				);
			fresh
				.querySelectorAll<SVGGElement>("[data-place]")
				.forEach((g) => {
					const activate = () => selectPlace(g.dataset.place ?? "forum");
					g.addEventListener("click", activate);
					g.addEventListener("keydown", (event) => {
						if (event.key === "Enter" || event.key === " ") {
							event.preventDefault();
							activate();
						}
					});
				});
		};
		void rerenderMap;
		bindRomeControls();
	}

	// Prosody
	const prosodySelect = container.querySelector<HTMLSelectElement>("#prosody-select");
	if (prosodySelect) {
		const update = () => {
			const w = PROSODY_WORDS[Number(prosodySelect.value)] ?? PROSODY_WORDS[0];
			const svg = container.querySelector("#prosody-svg");
			if (svg) svg.innerHTML = drawProsodySvg(w);
			const out = container.querySelector("#prosody-readout");
			if (out) out.textContent = w.reason;
		};
		prosodySelect.addEventListener("change", update);
		update();
	}

	// Declension
	const declRoot = container.querySelector<HTMLElement>('[data-explorer="declension"]');
	if (declRoot) {
		const clsSel = declRoot.querySelector<HTMLSelectElement>("#decl-class")!;
		let num: "sg" | "pl" = "sg";
		let kIdx = 0;
		const update = () => {
			const svg = declRoot.querySelector("#decl-svg");
			if (svg) svg.innerHTML = drawDeclensionSvg(clsSel.value, num, kIdx);
			const d = declensionForm(clsSel.value, num, kIdx);
			const out = declRoot.querySelector("#decl-readout");
			if (out)
				out.textContent = `Form: ${d.form} (${d.meaning}) · ${KASUS_INFO[kIdx].name} ${num === "sg" ? "Singular" : "Plural"} (${d.question}).`;
		};
		clsSel.addEventListener("change", update);
		declRoot.querySelectorAll<HTMLButtonElement>("[data-decl-num]").forEach((btn) =>
			btn.addEventListener("click", () => {
				num = btn.dataset.declNum === "pl" ? "pl" : "sg";
				declRoot
					.querySelectorAll("[data-decl-num]")
					.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				update();
			}),
		);
		declRoot.querySelectorAll<HTMLButtonElement>("[data-decl-case]").forEach((btn) =>
			btn.addEventListener("click", () => {
				kIdx = Number(btn.dataset.declCase);
				declRoot
					.querySelectorAll("[data-decl-case]")
					.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				update();
			}),
		);
		update();
	}

	// Numerals
	const numSlider = container.querySelector<HTMLInputElement>("#num-slider");
	if (numSlider) {
		const update = () => {
			const info = numeralEntry(Number(numSlider.value));
			const val = container.querySelector("#num-val");
			if (val) val.textContent = String(info.n);
			const svg = container.querySelector("#num-svg");
			if (svg) svg.innerHTML = drawNumeralSvg(info);
			const out = container.querySelector("#num-readout");
			if (out)
				out.textContent = `${info.roman} (${info.n}): ${info.cardinal} · ${info.ordinal} — ${info.note}.`;
		};
		numSlider.addEventListener("input", update);
		update();
	}

	// AcI
	const aciRoot = container.querySelector<HTMLElement>('[data-explorer="aci"]');
	if (aciRoot) {
		let mainTense: "pres" | "perf" = "pres";
		let infTense: "pres" | "perf" = "pres";
		const update = () => {
			const svg = aciRoot.querySelector("#aci-svg");
			if (svg) svg.innerHTML = drawAciSvg(mainTense, infTense);
			const data = aciPreview(mainTense, infTense);
			const out = aciRoot.querySelector("#aci-readout");
			if (out)
				out.textContent = `${data.latin} → ${data.german} (${data.relation}).`;
		};
		aciRoot.querySelectorAll<HTMLButtonElement>("[data-aci-main]").forEach((btn) =>
			btn.addEventListener("click", () => {
				mainTense = btn.dataset.aciMain === "perf" ? "perf" : "pres";
				aciRoot
					.querySelectorAll("[data-aci-main]")
					.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				update();
			}),
		);
		aciRoot.querySelectorAll<HTMLButtonElement>("[data-aci-inf]").forEach((btn) =>
			btn.addEventListener("click", () => {
				infTense = btn.dataset.aciInf === "perf" ? "perf" : "pres";
				aciRoot
					.querySelectorAll("[data-aci-inf]")
					.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				update();
			}),
		);
		update();
	}

	// Calendar
	const calMonth = container.querySelector<HTMLSelectElement>("#cal-month");
	if (calMonth) {
		const update = () => {
			const m = calendarDates(calMonth.value);
			const svg = container.querySelector("#cal-svg");
			if (svg) svg.innerHTML = drawCalendarSvg(m);
			const out = container.querySelector("#cal-readout");
			if (out) out.textContent = m.note;
		};
		calMonth.addEventListener("change", update);
		update();
	}

	// Pantheon
	const godRoot = container.querySelector<HTMLElement>('[data-explorer="pantheon"]');
	if (godRoot) {
		let idx = 0;
		const update = () => {
			const svg = godRoot.querySelector("#god-svg");
			if (svg) svg.innerHTML = drawPantheonSvg(idx);
			const g = PANTHEON_DATA[idx];
			const out = godRoot.querySelector("#god-readout");
			if (out) out.textContent = `${g.r} (griech. ${g.g}): ${g.role}. Erkennungszeichen: ${g.sym}.`;
		};
		godRoot.querySelectorAll<HTMLButtonElement>("[data-god]").forEach((btn) =>
			btn.addEventListener("click", () => {
				idx = Number(btn.dataset.god);
				godRoot
					.querySelectorAll("[data-god]")
					.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				update();
			}),
		);
		update();
	}

	// Timeline Rome
	const tlRoot = container.querySelector<HTMLElement>('[data-explorer="timeline-rome"]');
	if (tlRoot) {
		let idx = 0;
		const update = () => {
			const svg = tlRoot.querySelector("#tl-svg");
			if (svg) svg.innerHTML = drawTimelineSvg(idx);
			const st = ROME_TIMELINE_STATIONS[idx];
			const out = tlRoot.querySelector("#tl-readout");
			if (out) out.textContent = `${st.year} · ${st.title}: ${st.text}`;
		};
		tlRoot.querySelectorAll<HTMLButtonElement>("[data-tl]").forEach((btn) =>
			btn.addEventListener("click", () => {
				idx = Number(btn.dataset.tl);
				tlRoot
					.querySelectorAll("[data-tl]")
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
