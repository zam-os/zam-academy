import { esc } from "./practice";
import type { LiveModelKind } from "./types";

/* ---------- 1. Roman numerals 1..1000 ---------- */
export interface RomanPart {
	symbol: string;
	value: number;
	subtractive: boolean;
}

const ROMAN_TABLE: ReadonlyArray<readonly [number, string, boolean]> = [
	[1000, "M", false],
	[900, "CM", true],
	[500, "D", false],
	[400, "CD", true],
	[100, "C", false],
	[90, "XC", true],
	[50, "L", false],
	[40, "XL", true],
	[10, "X", false],
	[9, "IX", true],
	[5, "V", false],
	[4, "IV", true],
	[1, "I", false],
];

export function romanBreakdown(value: number): RomanPart[] {
	let remaining = Math.max(1, Math.min(1000, Math.round(value)));
	const parts: RomanPart[] = [];
	for (const [amount, symbol, subtractive] of ROMAN_TABLE) {
		while (remaining >= amount) {
			parts.push({ symbol, value: amount, subtractive });
			remaining -= amount;
		}
	}
	return parts;
}

export function toRoman(value: number): string {
	return romanBreakdown(value)
		.map((part) => part.symbol)
		.join("");
}

export function romanLatinHint(value: number): string {
	const exact: Record<number, string> = {
		1: "ūnus, -a, -um (prīmus)",
		2: "duo, duae, duo (secundus)",
		3: "trēs, tria (tertius)",
		4: "quattuor (quārtus)",
		5: "quīnque (quīntus)",
		10: "decem (decimus)",
		20: "vīgintī (zwanzig · vīcēsimus)",
		50: "quīnquāgintā (fünfzig · quīnquāgēsimus)",
		100: "centum (hundert · centēsimus)",
		200: "ducentī, -ae, -a",
		500: "quīngentī, -ae, -a",
		1000: "mīlle (Pl. mīlia)",
	};
	return (
		exact[value] ??
		(value > 100
			? "Zusammengesetzt aus Hunderter-, Zehner- und Einerbausteinen (Subtraktionsregel bei IV, IX, XL, XC, CD, CM)."
			: "Additions- oder Subtraktionsschreibweise: kleineres Zeichen links zieht ab, rechts addiert.")
	);
}

/* ---------- 2. Active <-> Passive transformer ---------- */
export type PassiveTense =
	| "praesens"
	| "imperfekt"
	| "futur1"
	| "perfekt"
	| "plusquamperfekt"
	| "futur2";
export type Voice = "aktiv" | "passiv";

export interface PassiveSample {
	tenseLabel: string;
	stemLabel: string;
	activeVerb: string;
	passiveVerb: string;
	activeSentence: string;
	passiveSentence: string;
	activeDe: string;
	passiveDe: string;
	anatomy: string;
}

export const PASSIVE_SAMPLES: Record<PassiveTense, PassiveSample> = {
	praesens: {
		tenseLabel: "Präsens",
		stemLabel: "Präsensstamm",
		activeVerb: "laudat",
		passiveVerb: "laudātur",
		activeSentence: "Magister discipulum laudat.",
		passiveSentence: "Discipulus ā magistrō laudātur.",
		activeDe: "Der Lehrer lobt den Schüler.",
		passiveDe: "Der Schüler wird vom Lehrer gelobt.",
		anatomy: "laudā- + -tur (Passivendung 3. Sg.)",
	},
	imperfekt: {
		tenseLabel: "Imperfekt",
		stemLabel: "Präsensstamm",
		activeVerb: "laudābat",
		passiveVerb: "laudābātur",
		activeSentence: "Magister discipulum laudābat.",
		passiveSentence: "Discipulus ā magistrō laudābātur.",
		activeDe: "Der Lehrer lobte den Schüler.",
		passiveDe: "Der Schüler wurde vom Lehrer gelobt.",
		anatomy: "laudā- + -bā- (Imperfekt) + -tur",
	},
	futur1: {
		tenseLabel: "Futur I",
		stemLabel: "Präsensstamm",
		activeVerb: "laudābit",
		passiveVerb: "laudābitur",
		activeSentence: "Magister discipulum laudābit.",
		passiveSentence: "Discipulus ā magistrō laudābitur.",
		activeDe: "Der Lehrer wird den Schüler loben.",
		passiveDe: "Der Schüler wird vom Lehrer gelobt werden.",
		anatomy: "laudā- + -bi- (Futur I) + -tur",
	},
	perfekt: {
		tenseLabel: "Perfekt",
		stemLabel: "PPP + esse (Präs.)",
		activeVerb: "laudāvit",
		passiveVerb: "laudātus est",
		activeSentence: "Magister discipulum laudāvit.",
		passiveSentence: "Discipulus ā magistrō laudātus est.",
		activeDe: "Der Lehrer hat den Schüler gelobt.",
		passiveDe: "Der Schüler ist vom Lehrer gelobt worden / wurde gelobt.",
		anatomy: "PPP laudātus (Nom. Sg. m.) + est",
	},
	plusquamperfekt: {
		tenseLabel: "Plusquamperfekt",
		stemLabel: "PPP + esse (Impf.)",
		activeVerb: "laudāverat",
		passiveVerb: "laudātus erat",
		activeSentence: "Magister discipulum laudāverat.",
		passiveSentence: "Discipulus ā magistrō laudātus erat.",
		activeDe: "Der Lehrer hatte den Schüler gelobt.",
		passiveDe: "Der Schüler war vom Lehrer gelobt worden.",
		anatomy: "PPP laudātus (Nom. Sg. m.) + erat",
	},
	futur2: {
		tenseLabel: "Futur II",
		stemLabel: "PPP + esse (Fut. I)",
		activeVerb: "laudāverit",
		passiveVerb: "laudātus erit",
		activeSentence: "Magister discipulum laudāverit.",
		passiveSentence: "Discipulus ā magistrō laudātus erit.",
		activeDe: "Der Lehrer wird den Schüler gelobt haben.",
		passiveDe: "Der Schüler wird vom Lehrer gelobt worden sein.",
		anatomy: "PPP laudātus (Nom. Sg. m.) + erit",
	},
};

/* ---------- 3. Time-relation timeline (AcI / PC / Abl. abs.) ---------- */
export type TimelineKind = "aci" | "pc" | "ablabs";
export type MainTense = "praesens" | "perfekt";
export type TimeRelation = "gleichzeitig" | "vorzeitig";

export interface TimelineEntry {
	latin: string;
	german: string;
	formNote: string;
	leftLabel: string;
	rightLabel: string;
}

export function timelineSample(
	kind: TimelineKind,
	mainTense: MainTense,
	relation: TimeRelation,
): TimelineEntry {
	const key = `${kind}:${mainTense}:${relation}`;
	const map: Record<string, TimelineEntry> = {
		"aci:praesens:gleichzeitig": {
			latin: "Scīmus urbem ā mīlitibus dēfendī.",
			german: "Wir wissen, dass die Stadt von den Soldaten verteidigt wird.",
			formNote: "Infinitiv Präsens Passiv (dēfendī) → gleichzeitig zum Präsens.",
			leftLabel: "Hauptsatz & AcI: gleichzeitig (Gegenwart)",
			rightLabel: "dēfendī = wird verteidigt",
		},
		"aci:praesens:vorzeitig": {
			latin: "Scīmus urbem ā mīlitibus dēfēnsam esse.",
			german: "Wir wissen, dass die Stadt von den Soldaten verteidigt worden ist.",
			formNote: "Infinitiv Perfekt Passiv (dēfēnsam esse) → vorzeitig zum Präsens.",
			leftLabel: "1. AcI: vorher geschehen (dēfēnsam esse)",
			rightLabel: "2. Hauptsatz: Gegenwart (scīmus)",
		},
		"aci:perfekt:gleichzeitig": {
			latin: "Scīvimus urbem ā mīlitibus dēfendī.",
			german: "Wir wussten, dass die Stadt von den Soldaten verteidigt wurde.",
			formNote: "Infinitiv Präsens Passiv → gleichzeitig zur Vergangenheit (Präteritum).",
			leftLabel: "Hauptsatz & AcI: gleichzeitig (Vergangenheit)",
			rightLabel: "dēfendī = wurde verteidigt",
		},
		"aci:perfekt:vorzeitig": {
			latin: "Scīvimus urbem ā mīlitibus dēfēnsam esse.",
			german: "Wir wussten, dass die Stadt von den Soldaten verteidigt worden war.",
			formNote: "Infinitiv Perfekt Passiv → vorzeitig zur Vergangenheit (Plusquamperfekt).",
			leftLabel: "1. AcI: noch früher (war verteidigt worden)",
			rightLabel: "2. Hauptsatz: Vergangenheit (scīvimus)",
		},
		"pc:praesens:gleichzeitig": {
			latin: "Mīlitēs clāmantēs ad forum currunt.",
			german: "Während die Soldaten rufen, laufen sie zum Forum.",
			formNote: "PPA (clāmantēs, Nom. Pl. m.) → gleichzeitig und aktiv.",
			leftLabel: "PC (PPA) & Hauptsatz: gleichzeitig",
			rightLabel: "clāmantēs = während sie rufen",
		},
		"pc:praesens:vorzeitig": {
			latin: "Cīvēs perīculō mōtī cōnsulem petunt.",
			german: "Weil die Bürger von der Gefahr beunruhigt worden sind, suchen sie den Konsul auf.",
			formNote: "PPP (mōtī, Nom. Pl. m.) → vorzeitig und passiv.",
			leftLabel: "1. PC (PPP): vorher (beunruhigt worden)",
			rightLabel: "2. Hauptsatz: Gegenwart (petunt)",
		},
		"pc:perfekt:gleichzeitig": {
			latin: "Mīlitēs clāmantēs ad forum cucurrērunt.",
			german: "Während die Soldaten riefen, liefen sie zum Forum.",
			formNote: "PPA → gleichzeitig zur Vergangenheit (Präteritum).",
			leftLabel: "PC (PPA) & Hauptsatz: gleichzeitig",
			rightLabel: "clāmantēs = während sie riefen",
		},
		"pc:perfekt:vorzeitig": {
			latin: "Cīvēs perīculō mōtī cōnsulem petīvērunt.",
			german: "Nachdem die Bürger von der Gefahr beunruhigt worden waren, suchten sie den Konsul auf.",
			formNote: "PPP → vorzeitig zur Vergangenheit (Plusquamperfekt).",
			leftLabel: "1. PC (PPP): noch früher (waren beunruhigt worden)",
			rightLabel: "2. Hauptsatz: Vergangenheit (petīvērunt)",
		},
		"ablabs:praesens:gleichzeitig": {
			latin: "Cōnsule dīcente senātōrēs tacent.",
			german: "Während der Konsul spricht, schweigen die Senatoren.",
			formNote: "Abl. abs. mit PPA (cōnsule dīcente) → gleichzeitig und aktiv.",
			leftLabel: "Abl. abs. (PPA) & Hauptsatz: gleichzeitig",
			rightLabel: "cōnsule dīcente = während der Konsul spricht",
		},
		"ablabs:praesens:vorzeitig": {
			latin: "Urbe capta hostēs discēdunt.",
			german: "Nachdem die Stadt eingenommen worden ist, ziehen die Feinde ab.",
			formNote: "Abl. abs. mit PPP (urbe captā) → vorzeitig und passiv.",
			leftLabel: "1. Abl. abs. (PPP): vorher (eingenommen)",
			rightLabel: "2. Hauptsatz: Gegenwart (discēdunt)",
		},
		"ablabs:perfekt:gleichzeitig": {
			latin: "Cōnsule dīcente senātōrēs tacuērunt.",
			german: "Während der Konsul sprach, schwiegen die Senatoren.",
			formNote: "Abl. abs. mit PPA → gleichzeitig zur Vergangenheit.",
			leftLabel: "Abl. abs. (PPA) & Hauptsatz: gleichzeitig",
			rightLabel: "cōnsule dīcente = während der Konsul sprach",
		},
		"ablabs:perfekt:vorzeitig": {
			latin: "Urbe captā hostēs discessērunt.",
			german: "Nachdem die Stadt eingenommen worden war, zogen die Feinde ab.",
			formNote: "Abl. abs. mit PPP → vorzeitig zur Vergangenheit (Plusquamperfekt).",
			leftLabel: "1. Abl. abs. (PPP): noch früher (war eingenommen worden)",
			rightLabel: "2. Hauptsatz: Vergangenheit (discessērunt)",
		},
	};
	return map[key];
}

/* ---------- 4. Consecutio temporum 2x2 matrix ---------- */
export type TempGroup = "haupt" | "neben";

export interface ConsecutioCell {
	subjunctive: string;
	activeForm: string;
	passiveForm: string;
	latin: string;
	german: string;
	anatomy: string;
}

export function consecutioSample(
	group: TempGroup,
	relation: TimeRelation,
	voice: Voice,
): ConsecutioCell {
	const cells: Record<`${TempGroup}:${TimeRelation}`, ConsecutioCell> = {
		"haupt:gleichzeitig": {
			subjunctive: "Konjunktiv Präsens",
			activeForm: "laudet",
			passiveForm: "laudētur",
			latin:
				voice === "aktiv"
					? "Rogō, cūr magister discipulum laudet."
					: "Rogō, cūr discipulus ā magistrō laudētur.",
			german:
				voice === "aktiv"
					? "Ich frage, warum der Lehrer den Schüler lobt."
					: "Ich frage, warum der Schüler vom Lehrer gelobt wird.",
			anatomy:
				voice === "aktiv"
					? "a-Konj.: -e- als Moduszeichen (laud-e-t)"
					: "a-Konj.: -ē- + Passivendung -tur (laud-ē-tur)",
		},
		"haupt:vorzeitig": {
			subjunctive: "Konjunktiv Perfekt",
			activeForm: "laudāverit",
			passiveForm: "laudātus sit",
			latin:
				voice === "aktiv"
					? "Rogō, cūr magister discipulum laudāverit."
					: "Rogō, cūr discipulus ā magistrō laudātus sit.",
			german:
				voice === "aktiv"
					? "Ich frage, warum der Lehrer den Schüler gelobt hat."
					: "Ich frage, warum der Schüler vom Lehrer gelobt worden ist.",
			anatomy:
				voice === "aktiv"
					? "Perfektstamm + -eri- + -t (laudāv-eri-t)"
					: "PPP + Konj. Präs. von esse (laudātus sit)",
		},
		"neben:gleichzeitig": {
			subjunctive: "Konjunktiv Imperfekt",
			activeForm: "laudāret",
			passiveForm: "laudārētur",
			latin:
				voice === "aktiv"
					? "Rogāvī, cūr magister discipulum laudāret."
					: "Rogāvī, cūr discipulus ā magistrō laudārētur.",
			german:
				voice === "aktiv"
					? "Ich fragte, warum der Lehrer den Schüler lobte."
					: "Ich fragte, warum der Schüler vom Lehrer gelobt wurde.",
			anatomy:
				voice === "aktiv"
					? "Infinitiv Präs. Aktiv + -t (laudāre-t)"
					: "Infinitiv Präs. Aktiv + -tur (laudārē-tur)",
		},
		"neben:vorzeitig": {
			subjunctive: "Konjunktiv Plusquamperfekt",
			activeForm: "laudāvisset",
			passiveForm: "laudātus esset",
			latin:
				voice === "aktiv"
					? "Rogāvī, cūr magister discipulum laudāvisset."
					: "Rogāvī, cūr discipulus ā magistrō laudātus esset.",
			german:
				voice === "aktiv"
					? "Ich fragte, warum der Lehrer den Schüler gelobt hatte."
					: "Ich fragte, warum der Schüler vom Lehrer gelobt worden war.",
			anatomy:
				voice === "aktiv"
					? "Infinitiv Perfekt Aktiv + -t (laudāvisse-t)"
					: "PPP + Konj. Impf. von esse (laudātus esset)",
		},
	};
	return cells[`${group}:${relation}`];
}

/* ---------- 5. Paenultima stress model ---------- */
export interface PaenultimaWord {
	id: string;
	word: string;
	meaning: string;
	syllables: string[];
	stressedIndex: number;
	paenultimaLong: boolean;
	reason: string;
}

export const PAENULTIMA_WORDS: PaenultimaWord[] = [
	{
		id: "imperator",
		word: "imperātor",
		meaning: "Feldherr",
		syllables: ["im", "pe", "rā", "tor"],
		stressedIndex: 2,
		paenultimaLong: true,
		reason: "Die vorletzte Silbe (-rā-) ist naturlang → Betonung auf der Paenultima: im-pe-RĀ-tor.",
	},
	{
		id: "milites",
		word: "mīlitēs",
		meaning: "die Soldaten",
		syllables: ["mī", "li", "tēs"],
		stressedIndex: 0,
		paenultimaLong: false,
		reason: "Die vorletzte Silbe (-li-) ist kurz → Betonung wandert auf die Antepaenultima: MĪ-li-tēs.",
	},
	{
		id: "magister",
		word: "magister",
		meaning: "Lehrer",
		syllables: ["ma", "gis", "ter"],
		stressedIndex: 1,
		paenultimaLong: true,
		reason: "Nach dem i folgen zwei Konsonanten (-st-): Positionslänge → ma-GIS-ter.",
	},
	{
		id: "dividere",
		word: "dīvidere",
		meaning: "teilen",
		syllables: ["dī", "vi", "de", "re"],
		stressedIndex: 1,
		paenultimaLong: false,
		reason: "Die vorletzte Silbe (-de-) ist in der konsonantischen Konjugation kurz → dī-VI-de-re.",
	},
	{
		id: "provincia",
		word: "prōvincia",
		meaning: "Provinz",
		syllables: ["prō", "vin", "ci", "a"],
		stressedIndex: 1,
		paenultimaLong: false,
		reason: "Vor Vokal ist -i- in -ci- kurz → Betonung auf der drittletzten Silbe: prō-VIN-ci-a.",
	},
	{
		id: "carthago",
		word: "Carthāgō",
		meaning: "Karthago",
		syllables: ["Car", "thā", "gō"],
		stressedIndex: 1,
		paenultimaLong: true,
		reason: "Das ā in der vorletzten Silbe ist naturlang → Car-THĀ-gō.",
	},
];

/* ---------- 6. Mediterranean & Imperium Romanum SVG map ---------- */
export function renderMediterraneanMap(): string {
	return `<figure class="med-map" data-med-map>
		<div class="map-controls" role="group" aria-label="Kartenebenen hervorheben">
			<button type="button" class="chip-button" data-map-focus="provinces" aria-pressed="false">Provinzen & Regionen</button>
			<button type="button" class="chip-button" data-map-focus="places" aria-pressed="false">Städte & Stätten</button>
			<button type="button" class="chip-button" data-map-focus="wonders" aria-pressed="false">7 Weltwunder</button>
		</div>
		<svg viewBox="0 0 720 380" role="img" aria-label="Schematische Karte des Mittelmeerraums und des Imperium Romanum mit Provinzen, Städten, Cambodunum und den sieben Weltwundern">
			<rect x="0" y="0" width="720" height="380" rx="14" class="sea"/>
			<!-- Stylized land masses: Europe/North, Italy, Greece, Asia Minor, North Africa -->
			<path class="land" d="M12,18 L698,18 L698,210 L620,210 L580,235 L520,215 L470,222 L442,190 L416,245 L392,235 L380,175 L340,145 L302,152 L322,226 L296,242 L268,180 L236,158 L195,180 L132,196 L88,242 L18,225 Z"/>
			<path class="land" d="M18,288 L198,274 L268,266 L328,312 L462,318 L556,310 L698,325 L698,368 L18,368 Z"/>
			<!-- Sicily & Crete -->
			<polygon class="land" points="282,248 314,244 304,264"/>
			<rect class="land" x="414" y="274" width="66" height="14" rx="5"/>

			<text x="128" y="254" class="sea-label">MARE NOSTRUM</text>

			<g data-map-layer="provinces" class="map-provinces">
				<text x="148" y="96" data-province>GALLIA</text>
				<text x="268" y="74" data-province>RAETIA</text>
				<text x="72" y="182" data-province>HISPANIA</text>
				<text x="278" y="138" data-province>ITALIA</text>
				<text x="294" y="284" data-province>SICILIA</text>
				<text x="424" y="285" data-province>CRETA</text>
				<text x="195" y="334" data-province>AFRICA</text>
				<text x="536" y="176" data-province>ASIA</text>
				<text x="546" y="362" data-province>AEGYPTUS</text>
			</g>

			<g data-map-layer="places" class="map-places">
				<circle cx="272" cy="90" r="5" data-place/><text x="282" y="94">Cambodunum</text>
				<circle cx="276" cy="176" r="6.5" data-place/><text x="286" y="180" class="place-main">Rom</text>
				<circle cx="242" cy="276" r="5.5" data-place/><text x="172" y="294">Karthago</text>
				<circle cx="312" cy="256" r="4.5" data-place/><text x="322" y="261">Syrakus</text>
				<circle cx="404" cy="204" r="4.5" data-place/><text x="415" y="198">Theben</text>
				<circle cx="412" cy="222" r="5" data-place/><text x="423" y="226">Athen</text>
				<circle cx="536" cy="316" r="5" data-place/><text x="548" y="317">Alexandria</text>
			</g>

			<g data-map-layer="wonders" class="map-wonders">
				<polygon points="390,224 395,234 385,234" data-wonder/><text x="316" y="229" class="wonder-txt">1 Olympia</text>
				<polygon points="482,212 487,222 477,222" data-wonder/><text x="492" y="208" class="wonder-txt">2 Ephesos</text>
				<polygon points="492,232 497,242 487,242" data-wonder/><text x="502" y="241" class="wonder-txt">3 Halikarnassos</text>
				<polygon points="494,258 499,268 489,268" data-wonder/><text x="504" y="268" class="wonder-txt">4 Rhodos</text>
				<polygon points="528,302 533,312 523,312" data-wonder/><text x="448" y="315" class="wonder-txt">5 Pharos</text>
				<polygon points="548,330 553,340 543,340" data-wonder/><text x="560" y="341" class="wonder-txt">6 Gizeh</text>
				<polygon points="658,248 663,258 653,258" data-wonder/><text x="614" y="274" class="wonder-txt">7 Babylon →</text>
			</g>
		</svg>
		<figcaption class="small">Schematische Offline-Karte des Mittelmeerraums (nicht maßstabsgetreu; Babylon liegt weiter östlich in Mesopotamien). Nutze die Schaltflächen, um Provinzen, Städte oder die sieben Weltwunder hervorzuheben.</figcaption>
	</figure>`;
}

/* ---------- 7. Epochs timeline (Republic -> Augustus) ---------- */
export interface EpochStop {
	id: string;
	year: string;
	title: string;
	people: string;
	detail: string;
	x: number;
}

export const EPOCH_STOPS: EpochStop[] = [
	{
		id: "punic",
		year: "218–201 v. Chr.",
		title: "2. Punischer Krieg",
		people: "Hannibal · Scipio Africanus",
		detail: "Mittlere Republik: Hannibals Alpenübergang, Niederlage bei Cannae (216), Entscheidung bei Zama (202). Rom wird westliche Großmacht.",
		x: 110,
	},
	{
		id: "carthage",
		year: "146 v. Chr.",
		title: "Zerstörung Karthagos",
		people: "Cato · Scipio Aemilianus",
		detail: "Nach dem 3. Punischen Krieg wird Karthago zerstört und die Provinz Africa eingerichtet; im selben Jahr fällt Korinth.",
		x: 270,
	},
	{
		id: "late",
		year: "63–44 v. Chr.",
		title: "Späte Republik & Bürgerkriege",
		people: "Cicero · Caesar",
		detail: "Machtkämpfe einzelner Feldherren erschüttern die Republik. Cicero verteidigt die res publica als Redner; Caesar erobert Gallien und wird Diktator († 44 v. Chr.).",
		x: 445,
	},
	{
		id: "augustus",
		year: "27 v.–14 n. Chr.",
		title: "Augusteische Zeit",
		people: "Augustus · Horaz · Ovid",
		detail: "Prinzipat nach den Bürgerkriegen: Restaurationspolitik, pax Augusta und aurea aetas; neue Konflikte an Rhein und Donau (Römer und Germanen).",
		x: 615,
	},
];

/* ---------- 8. Cursus honorum step pyramid ---------- */
export interface CursusTier {
	id: string;
	office: string;
	latin: string;
	count: string;
	duty: string;
	y: number;
	w: number;
}

export const CURSUS_TIERS: CursusTier[] = [
	{
		id: "consul",
		office: "Konsul",
		latin: "cōnsul",
		count: "2 Beamte · 1 Jahr",
		duty: "Höchstes Amt der Republik: Oberbefehl im Krieg, Leitung von Senat und Volksversammlung, Namensgeber des Jahres.",
		y: 20,
		w: 190,
	},
	{
		id: "praetor",
		office: "Prätor",
		latin: "praetor",
		count: "Rechtsprechung & Militär",
		duty: "Leitung des Gerichtswesens in Rom und Vertretung der Konsuln; später auch Statthalter einer Provinz.",
		y: 62,
		w: 260,
	},
	{
		id: "aedilis",
		office: "Ädil",
		latin: "aedīlis",
		count: "freiwillige Zwischenstufe",
		duty: "Aufsicht über Märkte, Straßen, Getreideversorgung und öffentliche Spiele — ideal, um beim Volk bekannt zu werden.",
		y: 104,
		w: 330,
	},
	{
		id: "quaestor",
		office: "Quästor",
		latin: "quaestor",
		count: "Einstieg in den Senat",
		duty: "Verwaltung der Staatskasse (aerārium) und der Kriegskasse; öffnet den Weg in die politische Laufbahn.",
		y: 146,
		w: 400,
	},
];

export function renderLiveModel(kind: LiveModelKind): string {
	switch (kind) {
		case "numeral":
			return `<div class="live-model" data-model="numeral">
				<h3>Interaktives Labor: Römische Zahlen bis 1000</h3>
				<label for="roman-slider">Arabische Zahl einstellen (1 bis 1000): <strong id="roman-dec">749</strong> = <strong id="roman-out" lang="la">DCCXLIX</strong></label>
				<input id="roman-slider" type="range" min="1" max="1000" value="749" />
				<svg id="roman-svg" viewBox="0 0 720 118" role="img" aria-label="Maßstäbliche Balkenzerlegung der römischen Zahl"></svg>
				<p id="roman-hint" class="small" aria-live="polite"></p>
			</div>`;
		case "passive":
			return `<div class="live-model" data-model="passive">
				<h3>Interaktives Labor: Aktiv-Passiv-Umformer</h3>
				<div class="model-controls">
					<div class="chip-row" role="group" aria-label="Genus Verbi wählen">
						<button type="button" class="chip-button" data-voice="aktiv" aria-pressed="true">Aktiv</button>
						<button type="button" class="chip-button" data-voice="passiv" aria-pressed="false">Passiv</button>
					</div>
					<label class="inline-select" for="passive-tense">Tempus
						<select id="passive-tense">
							<option value="praesens">Präsens</option>
							<option value="imperfekt">Imperfekt</option>
							<option value="futur1">Futur I</option>
							<option value="perfekt">Perfekt</option>
							<option value="plusquamperfekt">Plusquamperfekt</option>
							<option value="futur2">Futur II</option>
						</select>
					</label>
				</div>
				<svg id="passive-svg" viewBox="0 0 720 175" role="img" aria-label="Aktiv-Passiv-Schema mit Subjekt-Objekt-Tausch"></svg>
				<p id="passive-readout" class="small" aria-live="polite"></p>
			</div>`;
		case "timeline":
			return `<div class="live-model" data-model="timeline">
				<h3>Interaktives Labor: Zeitstrahl für AcI, PC & Ablativus absolutus</h3>
				<div class="model-controls">
					<label class="inline-select" for="tl-kind">Konstruktion
						<select id="tl-kind">
							<option value="aci">AcI (Passiv)</option>
							<option value="pc">Participium coniunctum (PC)</option>
							<option value="ablabs">Ablativus absolutus</option>
						</select>
					</label>
					<label class="inline-select" for="tl-main">Hauptsatz
						<select id="tl-main">
							<option value="praesens">Präsens (Gegenwart)</option>
							<option value="perfekt">Perfekt (Vergangenheit)</option>
						</select>
					</label>
					<label class="inline-select" for="tl-rel">Zeitverhältnis
						<select id="tl-rel">
							<option value="gleichzeitig">Gleichzeitigkeit</option>
							<option value="vorzeitig">Vorzeitigkeit</option>
						</select>
					</label>
				</div>
				<svg id="timeline-svg" viewBox="0 0 720 156" role="img" aria-label="Zeitstrahl zum relativen Zeitverhältnis"></svg>
				<p id="timeline-readout" class="small" aria-live="polite"></p>
			</div>`;
		case "consecutio":
			return `<div class="live-model" data-model="consecutio">
				<h3>Interaktives Labor: Consecutio temporum & Konjunktiv-Matrix</h3>
				<div class="model-controls">
					<label class="inline-select" for="ct-group">Hauptsatztempus
						<select id="ct-group">
							<option value="haupt">Haupttempus (Präsens / Futur)</option>
							<option value="neben">Nebentempus (Imperfekt / Perfekt / Plusq.)</option>
						</select>
					</label>
					<label class="inline-select" for="ct-rel">Zeitverhältnis
						<select id="ct-rel">
							<option value="gleichzeitig">Gleichzeitigkeit</option>
							<option value="vorzeitig">Vorzeitigkeit</option>
						</select>
					</label>
					<label class="inline-select" for="ct-voice">Genus Verbi
						<select id="ct-voice">
							<option value="aktiv">Aktiv</option>
							<option value="passiv">Passiv</option>
						</select>
					</label>
				</div>
				<svg id="consecutio-svg" viewBox="0 0 720 176" role="img" aria-label="2-mal-2-Matrix der Consecutio temporum"></svg>
				<p id="consecutio-readout" class="small" aria-live="polite"></p>
			</div>`;
		case "paenultima":
			return `<div class="live-model" data-model="paenultima">
				<h3>Interaktives Labor: Pänultima-Silbenwaage</h3>
				<div class="chip-row" role="group" aria-label="Lateinisches Wort prüfen">
					${PAENULTIMA_WORDS.map(
						(entry, i) =>
							`<button type="button" class="chip-button" data-paen="${entry.id}" aria-pressed="${i === 0 ? "true" : "false"}" lang="la">${esc(entry.word)}</button>`,
					).join("")}
				</div>
				<svg id="paen-svg" viewBox="0 0 720 154" role="img" aria-label="Silbenbogen und Betonungsregel"></svg>
				<p id="paen-readout" class="small" aria-live="polite"></p>
			</div>`;
		case "mediterranean":
			return renderMediterraneanMap();
		case "epochs":
			return `<div class="live-model" data-model="epochs">
				<h3>Interaktives Labor: Epochen-Zeitleiste (Republik bis Augustus)</h3>
				<div class="chip-row" role="group" aria-label="Epoche wählen">
					${EPOCH_STOPS.map(
						(stop, i) =>
							`<button type="button" class="chip-button" data-epoch="${stop.id}" aria-pressed="${i === 0 ? "true" : "false"}">${esc(stop.year)}</button>`,
					).join("")}
				</div>
				<svg id="epochs-svg" viewBox="0 0 720 132" role="img" aria-label="Zeitleiste von 218 v. Chr. bis 14 n. Chr."></svg>
				<p id="epochs-readout" class="small" aria-live="polite"></p>
			</div>`;
		case "cursus":
			return `<div class="live-model" data-model="cursus">
				<h3>Interaktives Labor: Cursus honorum & Mischverfassung</h3>
				<div class="chip-row" role="group" aria-label="Amt wählen">
					${CURSUS_TIERS.map(
						(tier, i) =>
							`<button type="button" class="chip-button" data-cursus="${tier.id}" aria-pressed="${i === 3 ? "true" : "false"}">${esc(tier.office)}</button>`,
					).join("")}
				</div>
				<svg id="cursus-svg" viewBox="0 0 720 202" role="img" aria-label="Stufenpyramide des cursus honorum zwischen Senat und Volksversammlung"></svg>
				<p id="cursus-readout" class="small" aria-live="polite"></p>
			</div>`;
	}
}

export function bindLiveModel(
	kind: LiveModelKind,
	container: HTMLElement,
): void {
	if (kind === "numeral") {
		const slider = container.querySelector<HTMLInputElement>("#roman-slider");
		const decEl = container.querySelector<HTMLElement>("#roman-dec");
		const outEl = container.querySelector<HTMLElement>("#roman-out");
		const svg = container.querySelector<SVGSVGElement>("#roman-svg");
		const hint = container.querySelector<HTMLElement>("#roman-hint");
		if (!slider || !decEl || !outEl || !svg || !hint) return;
		const update = () => {
			const n = Number(slider.value);
			const parts = romanBreakdown(n);
			const roman = toRoman(n);
			decEl.textContent = String(n);
			outEl.textContent = roman;
			const totalW = 688;
			let acc = 0;
			const segments = parts
				.map((part, idx) => {
					const x0 = 16 + Math.round((acc / n) * totalW);
					acc += part.value;
					const x1 = 16 + Math.round((acc / n) * totalW);
					const w = Math.max(4, x1 - x0);
					const drawW = Math.max(3, w - 2);
					return `<g class="roman-seg ${part.subtractive ? "subtractive" : ""}">
						<rect x="${x0}" y="18" width="${drawW}" height="52" rx="6" data-seg="${idx}"/>
						${drawW >= 32 ? `<text x="${x0 + drawW / 2}" y="42" text-anchor="middle" class="seg-sym">${esc(part.symbol)}</text><text x="${x0 + drawW / 2}" y="60" text-anchor="middle" class="seg-val">${part.value}</text>` : ""}
					</g>`;
				})
				.join("");
			const equation = parts.map((p) => `${p.symbol} (${p.value})`).join(" + ");
			svg.innerHTML = `${segments}<text x="16" y="98" class="model-caption">${esc(`${n} = ${equation}`)}</text>`;
			hint.textContent = romanLatinHint(n);
		};
		slider.addEventListener("input", update);
		update();
		return;
	}

	if (kind === "passive") {
		const buttons = [...container.querySelectorAll<HTMLButtonElement>("[data-voice]")];
		const select = container.querySelector<HTMLSelectElement>("#passive-tense");
		const svg = container.querySelector<SVGSVGElement>("#passive-svg");
		const readout = container.querySelector<HTMLElement>("#passive-readout");
		if (!select || !svg || !readout) return;
		let voice: Voice = "aktiv";
		const update = () => {
			const sample = PASSIVE_SAMPLES[select.value as PassiveTense];
			const isPass = voice === "passiv";
			buttons.forEach((b) =>
				b.setAttribute("aria-pressed", String(b.dataset.voice === voice)),
			);
			svg.innerHTML = `
				<rect x="16" y="16" width="206" height="66" rx="10" class="box-node ${isPass ? "box-accent" : ""}"/>
				<text x="119" y="39" text-anchor="middle" class="box-kicker">${isPass ? "NEUES SUBJEKT (Nom.)" : "SUBJEKT (Nom.)"}</text>
				<text x="119" y="64" text-anchor="middle" class="box-main">${isPass ? "Discipulus" : "Magister"}</text>

				<rect x="256" y="16" width="206" height="66" rx="10" class="box-node"/>
				<text x="359" y="39" text-anchor="middle" class="box-kicker">${isPass ? "URHEBER (ā/ab + Abl.)" : "AKKUSATIVOBJEKT"}</text>
				<text x="359" y="64" text-anchor="middle" class="box-main">${isPass ? "ā magistrō" : "discipulum"}</text>

				<rect x="496" y="16" width="208" height="66" rx="10" class="box-node box-accent"/>
				<text x="600" y="39" text-anchor="middle" class="box-kicker">PRÄDIKAT (${esc(sample.tenseLabel)})</text>
				<text x="600" y="64" text-anchor="middle" class="box-main">${esc(isPass ? sample.passiveVerb : sample.activeVerb)}</text>

				<path d="M119 86 C119 112, 359 112, 359 86" fill="none" class="swap-arc"/>
				<text x="360" y="128" text-anchor="middle" class="model-sentence">${esc(isPass ? sample.passiveSentence : sample.activeSentence)}</text>
				<text x="360" y="152" text-anchor="middle" class="model-caption">${esc(isPass ? sample.passiveDe : sample.activeDe)}</text>
			`;
			readout.textContent = `${sample.tenseLabel} (${sample.stemLabel}) · Baustein: ${sample.anatomy}`;
		};
		buttons.forEach((b) =>
			b.addEventListener("click", () => {
				voice = b.dataset.voice as Voice;
				update();
			}),
		);
		select.addEventListener("change", update);
		update();
		return;
	}

	if (kind === "timeline") {
		const kindSel = container.querySelector<HTMLSelectElement>("#tl-kind");
		const mainSel = container.querySelector<HTMLSelectElement>("#tl-main");
		const relSel = container.querySelector<HTMLSelectElement>("#tl-rel");
		const svg = container.querySelector<SVGSVGElement>("#timeline-svg");
		const readout = container.querySelector<HTMLElement>("#timeline-readout");
		if (!kindSel || !mainSel || !relSel || !svg || !readout) return;
		const update = () => {
			const k = kindSel.value as TimelineKind;
			const m = mainSel.value as MainTense;
			const r = relSel.value as TimeRelation;
			const entry = timelineSample(k, m, r);
			const mainX = m === "praesens" ? 540 : 370;
			const subX = r === "gleichzeitig" ? mainX : mainX - 190;
			svg.innerHTML = `
				<line x1="40" y1="74" x2="680" y2="74" class="axis-line"/>
				<polygon points="680,74 668,68 668,80" class="axis-arrow"/>
				<text x="58" y="96" class="model-caption">Vorvergangenheit</text>
				<text x="335" y="96" class="model-caption">Vergangenheit</text>
				<text x="512" y="96" class="model-caption">Gegenwart</text>
				${
					r === "vorzeitig"
						? `<line x1="${subX}" y1="42" x2="${mainX}" y2="42" class="span-line"/>`
						: ""
				}
				<circle cx="${subX}" cy="${r === "gleichzeitig" ? 50 : 74}" r="11" class="dot-sub"/>
				<circle cx="${mainX}" cy="74" r="11" class="dot-main"/>
				<text x="${subX}" y="28" text-anchor="middle" class="box-kicker">${r === "gleichzeitig" ? "Konstruktion = gleichzeitig" : "1. Konstruktion (vorher)"}</text>
				<text x="${mainX}" y="118" text-anchor="middle" class="box-kicker">Hauptsatz (${m === "praesens" ? "Präsens" : "Perfekt"})</text>
				<text x="360" y="144" text-anchor="middle" class="model-sentence">${esc(entry.latin)}</text>
			`;
			readout.textContent = `${entry.german} — ${entry.formNote}`;
		};
		[kindSel, mainSel, relSel].forEach((el) => el.addEventListener("change", update));
		update();
		return;
	}

	if (kind === "consecutio") {
		const grpSel = container.querySelector<HTMLSelectElement>("#ct-group");
		const relSel = container.querySelector<HTMLSelectElement>("#ct-rel");
		const voiceSel = container.querySelector<HTMLSelectElement>("#ct-voice");
		const svg = container.querySelector<SVGSVGElement>("#consecutio-svg");
		const readout = container.querySelector<HTMLElement>("#consecutio-readout");
		if (!grpSel || !relSel || !voiceSel || !svg || !readout) return;
		const update = () => {
			const g = grpSel.value as TempGroup;
			const r = relSel.value as TimeRelation;
			const v = voiceSel.value as Voice;
			const active = consecutioSample(g, r, v);
			const grid: Array<{
				g: TempGroup;
				r: TimeRelation;
				x: number;
				y: number;
				title: string;
				form: string;
			}> = [
				{
					g: "haupt",
					r: "gleichzeitig",
					x: 180,
					y: 34,
					title: "Konj. Präsens",
					form: v === "aktiv" ? "laudet" : "laudētur",
				},
				{
					g: "haupt",
					r: "vorzeitig",
					x: 446,
					y: 34,
					title: "Konj. Perfekt",
					form: v === "aktiv" ? "laudāverit" : "laudātus sit",
				},
				{
					g: "neben",
					r: "gleichzeitig",
					x: 180,
					y: 102,
					title: "Konj. Imperfekt",
					form: v === "aktiv" ? "laudāret" : "laudārētur",
				},
				{
					g: "neben",
					r: "vorzeitig",
					x: 446,
					y: 102,
					title: "Konj. Plusquamperfekt",
					form: v === "aktiv" ? "laudāvisset" : "laudātus esset",
				},
			];
			svg.innerHTML = `
				<text x="308" y="22" text-anchor="middle" class="box-kicker">GLEICHZEITIG</text>
				<text x="574" y="22" text-anchor="middle" class="box-kicker">VORZEITIG</text>
				<text x="16" y="70" class="box-kicker">HAUPTTEMPUS</text>
				<text x="16" y="86" class="model-caption">Präs. / Fut.</text>
				<text x="16" y="136" class="box-kicker">NEBENTEMPUS</text>
				<text x="16" y="152" class="model-caption">Impf. / Perf. / Plusq.</text>
				${grid
					.map((cell) => {
						const on = cell.g === g && cell.r === r;
						return `<rect x="${cell.x}" y="${cell.y}" width="256" height="58" rx="10" class="box-node ${on ? "box-accent" : ""}"/>
							<text x="${cell.x + 128}" y="${cell.y + 24}" text-anchor="middle" class="box-kicker">${esc(cell.title)}</text>
							<text x="${cell.x + 128}" y="${cell.y + 46}" text-anchor="middle" class="box-main">${esc(cell.form)}</text>`;
					})
					.join("")}
			`;
			readout.textContent = `${active.latin} → ${active.german} (${active.anatomy})`;
		};
		[grpSel, relSel, voiceSel].forEach((el) => el.addEventListener("change", update));
		update();
		return;
	}

	if (kind === "paenultima") {
		const buttons = [...container.querySelectorAll<HTMLButtonElement>("[data-paen]")];
		const svg = container.querySelector<SVGSVGElement>("#paen-svg");
		const readout = container.querySelector<HTMLElement>("#paen-readout");
		if (!svg || !readout) return;
		const select = (id: string) => {
			const entry = PAENULTIMA_WORDS.find((w) => w.id === id) ?? PAENULTIMA_WORDS[0];
			buttons.forEach((b) =>
				b.setAttribute("aria-pressed", String(b.dataset.paen === entry.id)),
			);
			const count = entry.syllables.length;
			const boxW = 136;
			const gap = 18;
			const startX = (720 - (count * boxW + (count - 1) * gap)) / 2;
			const roleOf = (i: number) => {
				const fromEnd = count - 1 - i;
				if (fromEnd === 0) return "Ultima";
				if (fromEnd === 1) return entry.paenultimaLong ? "Paenultima (lang)" : "Paenultima (kurz)";
				if (fromEnd === 2) return "Antepaenultima";
				return "Vorsilbe";
			};
			svg.innerHTML = entry.syllables
				.map((syl, i) => {
					const x = startX + i * (boxW + gap);
					const stressed = i === entry.stressedIndex;
					return `<g>
						${stressed ? `<text x="${x + boxW / 2}" y="26" text-anchor="middle" class="stress-mark">BETONT ↓</text>` : ""}
						<rect x="${x}" y="38" width="${boxW}" height="68" rx="12" class="box-node ${stressed ? "box-accent" : ""}"/>
						<text x="${x + boxW / 2}" y="79" text-anchor="middle" class="box-main">${esc(syl)}</text>
						<text x="${x + boxW / 2}" y="128" text-anchor="middle" class="model-caption">${esc(roleOf(i))}</text>
					</g>`;
				})
				.join("");
			readout.textContent = `${entry.word} (${entry.meaning}): ${entry.reason}`;
		};
		buttons.forEach((b) => b.addEventListener("click", () => select(b.dataset.paen!)));
		select(PAENULTIMA_WORDS[0].id);
		return;
	}

	if (kind === "mediterranean") {
		for (const button of container.querySelectorAll<HTMLButtonElement>(
			"[data-map-focus]",
		))
			button.addEventListener("click", () => {
				const selected = button.getAttribute("aria-pressed") !== "true";
				for (const other of container.querySelectorAll("[data-map-focus]"))
					other.setAttribute(
						"aria-pressed",
						String(other === button && selected),
					);
				for (const layer of container.querySelectorAll<SVGGElement>(
					"[data-map-layer]",
				))
					layer.style.opacity =
						selected && layer.dataset.mapLayer !== button.dataset.mapFocus
							? "0.18"
							: "1";
			});
		return;
	}

	if (kind === "epochs") {
		const buttons = [...container.querySelectorAll<HTMLButtonElement>("[data-epoch]")];
		const svg = container.querySelector<SVGSVGElement>("#epochs-svg");
		const readout = container.querySelector<HTMLElement>("#epochs-readout");
		if (!svg || !readout) return;
		const select = (id: string) => {
			const current = EPOCH_STOPS.find((s) => s.id === id) ?? EPOCH_STOPS[0];
			buttons.forEach((b) =>
				b.setAttribute("aria-pressed", String(b.dataset.epoch === current.id)),
			);
			svg.innerHTML = `
				<line x1="40" y1="62" x2="680" y2="62" class="axis-line"/>
				<polygon points="680,62 668,56 668,68" class="axis-arrow"/>
				${EPOCH_STOPS.map((stop) => {
					const on = stop.id === current.id;
					return `<g>
						<circle cx="${stop.x}" cy="62" r="${on ? 13 : 8}" class="${on ? "dot-main" : "dot-sub"}"/>
						<text x="${stop.x}" y="34" text-anchor="middle" class="box-kicker">${esc(stop.year)}</text>
						<text x="${stop.x}" y="98" text-anchor="middle" class="${on ? "box-main-sm" : "model-caption"}">${esc(stop.title)}</text>
					</g>`;
				}).join("")}
			`;
			readout.textContent = `${current.title} (${current.year}) · ${current.people}: ${current.detail}`;
		};
		buttons.forEach((b) => b.addEventListener("click", () => select(b.dataset.epoch!)));
		select(EPOCH_STOPS[0].id);
		return;
	}

	if (kind === "cursus") {
		const buttons = [...container.querySelectorAll<HTMLButtonElement>("[data-cursus]")];
		const svg = container.querySelector<SVGSVGElement>("#cursus-svg");
		const readout = container.querySelector<HTMLElement>("#cursus-readout");
		if (!svg || !readout) return;
		const select = (id: string) => {
			const current = CURSUS_TIERS.find((t) => t.id === id) ?? CURSUS_TIERS[3];
			buttons.forEach((b) =>
				b.setAttribute("aria-pressed", String(b.dataset.cursus === current.id)),
			);
			svg.innerHTML = `
				<rect x="16" y="42" width="116" height="140" rx="10" class="box-node"/>
				<text x="74" y="96" text-anchor="middle" class="box-kicker">SENATUS</text>
				<text x="74" y="118" text-anchor="middle" class="model-caption">Beratung &</text>
				<text x="74" y="135" text-anchor="middle" class="model-caption">Außenpolitik</text>

				<rect x="588" y="42" width="116" height="140" rx="10" class="box-node"/>
				<text x="646" y="96" text-anchor="middle" class="box-kicker">POPULUS</text>
				<text x="646" y="118" text-anchor="middle" class="model-caption">Wahlen &</text>
				<text x="646" y="135" text-anchor="middle" class="model-caption">Gesetze</text>

				${CURSUS_TIERS.map((tier) => {
					const x = 360 - tier.w / 2;
					const on = tier.id === current.id;
					return `<rect x="${x}" y="${tier.y}" width="${tier.w}" height="36" rx="8" class="box-node ${on ? "box-accent" : ""}"/>
						<text x="360" y="${tier.y + 23}" text-anchor="middle" class="box-main-sm">${esc(tier.office)} (${esc(tier.latin)})</text>`;
				}).join("")}
			`;
			readout.textContent = `${current.office} (${current.count}): ${current.duty}`;
		};
		buttons.forEach((b) => b.addEventListener("click", () => select(b.dataset.cursus!)));
		select("quaestor");
	}
}
