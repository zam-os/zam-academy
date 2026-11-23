import { esc } from "./practice";
import {
	renderFilmScene,
	renderUsMap,
	renderWalesMap,
	SCENE_NOTES,
} from "./places-map";
import type { Lesson, Workshop } from "./types";

export function workshopGoals(workshop: Workshop, answers: string[]): boolean[] {
	return workshop.goals.map((goal, index) => answers[index] === goal.answer);
}

/* ------------------------------------------------------------------ */
/* Pure explorer models (tested in tests/content.test.ts).             */
/* ------------------------------------------------------------------ */

export type AdverbKind = "fast" | "carefully" | "well";

const ADVERB_FORMS: Record<
	AdverbKind,
	{ verb: string; base: string; comp: string }
> = {
	fast: { verb: "runs", base: "fast", comp: "faster" },
	carefully: { verb: "writes", base: "carefully", comp: "more carefully" },
	well: { verb: "sings", base: "well", comp: "better" },
};

/** A comparison sentence with an adverb for two learners scored 1–5. */
export function adverbSentence(
	lenaScore: number,
	tomScore: number,
	kind: AdverbKind,
): string {
	const lena = Math.max(1, Math.min(5, Math.round(lenaScore)));
	const tom = Math.max(1, Math.min(5, Math.round(tomScore)));
	const form = ADVERB_FORMS[kind];
	if (lena === tom) return `Lena ${form.verb} as ${form.base} as Tom.`;
	return lena > tom
		? `Lena ${form.verb} ${form.comp} than Tom.`
		: `Tom ${form.verb} ${form.comp} than Lena.`;
}

/** Day of the month of the n-th weekday (0 = Sunday) in a month (0 = January). */
export function nthWeekday(
	year: number,
	month: number,
	weekday: number,
	n: number,
): number {
	const first = new Date(Date.UTC(year, month, 1)).getUTCDay();
	return 1 + ((weekday - first + 7) % 7) + (n - 1) * 7;
}

export interface Holiday {
	id: string;
	name: string;
	month: number;
	day: number;
	note: string;
}

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const WEEKDAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

export function holidays(year: number): Holiday[] {
	const date = (month: number, day: number) => {
		const weekday = new Date(Date.UTC(year, month, day)).getUTCDay();
		return `${WEEKDAYS[weekday]}, ${day} ${MONTHS[month]} ${year}`;
	};
	const october = nthWeekday(year, 9, 1, 2);
	const thanksgiving = nthWeekday(year, 10, 4, 4);
	return [
		{
			id: "independence",
			name: "Independence Day",
			month: 6,
			day: 4,
			note: `Independence Day (USA) is always on the Fourth of July: ${date(6, 4)}. Parades, barbecues and fireworks.`,
		},
		{
			id: "october",
			name: "Columbus Day · Indigenous Peoples' Day · Thanksgiving (Canada)",
			month: 9,
			day: october,
			note: `The second Monday in October, ${date(9, october)}: Columbus Day or Indigenous Peoples' Day in the USA, Thanksgiving in Canada.`,
		},
		{
			id: "halloween",
			name: "Halloween",
			month: 9,
			day: 31,
			note: `Halloween is on ${date(9, 31)}: costumes and trick or treating.`,
		},
		{
			id: "thanksgiving",
			name: "Thanksgiving (USA)",
			month: 10,
			day: thanksgiving,
			note: `Thanksgiving (USA) is on the fourth Thursday in November: ${date(10, thanksgiving)}. Turkey, pumpkin pie and family.`,
		},
	];
}

/** x position on the calendar strip (12 months of 36 px, starting at x = 20). */
export const calendarX = (month: number, day: number): number =>
	Math.round((20 + month * 36 + ((day - 0.5) / 31) * 36) * 10) / 10;

/** Piecewise history scale: 1060–1100 and 1500–1625 with a visible break. */
export function historyX(year: number): number {
	if (year <= 1100) return Math.round((40 + ((year - 1060) * 110) / 30) * 10) / 10;
	return Math.round((190 + ((year - 1500) * 280) / 125) * 10) / 10;
}

/* ------------------------------------------------------------------ */
/* Per-lesson explorer data.                                           */
/* ------------------------------------------------------------------ */

interface TransformEntry {
	input: string;
	output: string;
	rule: string;
	example: string;
}

export const TRANSFORMS: Record<string, { label: string; entries: TransformEntry[] }> = {
	"e7-adverbs-manner": {
		label: "Adjektiv wählen",
		entries: [
			{ input: "quick", output: "quickly", rule: "Grundregel: + -ly", example: "She answered quickly." },
			{ input: "careful", output: "carefully", rule: "+ -ly (aus -ful wird -fully)", example: "Cross the road carefully." },
			{ input: "happy", output: "happily", rule: "-y nach Konsonant wird -ily", example: "They laughed happily." },
			{ input: "gentle", output: "gently", rule: "-le wird -ly", example: "He closed the door gently." },
			{ input: "fantastic", output: "fantastically", rule: "-ic wird -ically", example: "The band played fantastically." },
			{ input: "good", output: "well", rule: "unregelmäßig", example: "You did that well." },
			{ input: "fast", output: "fast", rule: "gleiche Form", example: "Don't drive so fast." },
			{ input: "hard", output: "hard", rule: "gleiche Form (hardly = kaum)", example: "We worked hard." },
			{ input: "friendly", output: "in a friendly way", rule: "Adjektiv auf -ly: umschreiben", example: "She smiled in a friendly way." },
		],
	},
	"e7-word-building": {
		label: "Wort wählen",
		entries: [
			{ input: "wash (v)", output: "washable", rule: "Verb + -able: kann gewaschen werden", example: "This jacket is washable." },
			{ input: "enjoy (v)", output: "enjoyable", rule: "Verb + -able", example: "It was an enjoyable trip." },
			{ input: "rely (v)", output: "reliable", rule: "-y wird -i- + -able", example: "She is a reliable friend." },
			{ input: "accept (v)", output: "acceptable", rule: "Verb + -able", example: "Your answer is acceptable." },
			{ input: "possible (adj)", output: "possibility", rule: "-ble wird -bility", example: "There is a possibility of rain." },
			{ input: "active (adj)", output: "activity", rule: "-e fällt weg + -ity", example: "Swimming is my favourite activity." },
			{ input: "popular (adj)", output: "popularity", rule: "Adjektiv + -ity", example: "The popularity of the band is huge." },
			{ input: "creative (adj)", output: "creativity", rule: "-e fällt weg + -ity", example: "Art lessons need creativity." },
			{ input: "real (adj)", output: "reality", rule: "Adjektiv + -ity", example: "In reality, the hotel was small." },
		],
	},
};

interface TimelineMode {
	label: string;
	bars: [number, number][];
	dots: number[];
	arrow?: [number, number];
	captions: { x: number; y: number; text: string }[];
	readout: string;
}

export const TIMELINES: Record<string, { now: number; modes: TimelineMode[] }> = {
	"e7-since-for": {
		now: 415,
		modes: [
			{ label: "since + Zeitpunkt", bars: [[120, 415]], dots: [120], captions: [{ x: 120, y: 104, text: "since 2021" }, { x: 268, y: 34, text: "have lived here (still true)" }], readout: "I have lived here since 2021." },
			{ label: "for + Zeitspanne", bars: [[120, 415]], dots: [], captions: [{ x: 268, y: 34, text: "for five years (until now)" }], readout: "I have lived here for five years." },
			{ label: "ago: abgeschlossen", bars: [], dots: [120], captions: [{ x: 120, y: 104, text: "five years ago" }, { x: 160, y: 34, text: "moved here (finished)" }], readout: "I moved here five years ago." },
		],
	},
	"e7-perfect-progressive": {
		now: 415,
		modes: [
			{ label: "Dauer bis jetzt", bars: [[140, 415]], dots: [], captions: [{ x: 140, y: 104, text: "since nine o'clock" }, { x: 278, y: 34, text: "has been raining" }], readout: "It has been raining since nine o'clock." },
			{ label: "Gerade vorbei, Folgen sichtbar", bars: [[140, 380]], dots: [], captions: [{ x: 260, y: 34, text: "have been cutting onions" }, { x: 400, y: 104, text: "red eyes now" }], readout: "I've been cutting onions, so my eyes are red." },
		],
	},
	"e7-simple-or-progressive": {
		now: 415,
		modes: [
			{ label: "Ergebnis (How many?)", bars: [], dots: [200, 280, 360], captions: [{ x: 280, y: 34, text: "three rooms finished" }], readout: "I have painted three rooms." },
			{ label: "Tätigkeit (How long?)", bars: [[120, 415]], dots: [], captions: [{ x: 268, y: 34, text: "painting all day, until now" }], readout: "I have been painting all day." },
		],
	},
	"e7-past-perfect": {
		now: 415,
		modes: [
			{ label: "Erst – dann", bars: [], dots: [150, 280], arrow: [160, 270], captions: [{ x: 150, y: 104, text: "1 the film had started" }, { x: 280, y: 34, text: "2 we arrived" }], readout: "When we arrived, the film had already started." },
			{ label: "Gleichzeitig", bars: [], dots: [280], captions: [{ x: 280, y: 104, text: "we arrived – the film started" }], readout: "When we arrived, the film started." },
		],
	},
	"e7-tense-sequence": {
		now: 230,
		modes: [
			{ label: "Vergangenheit", bars: [], dots: [80, 170], arrow: [90, 160], captions: [{ x: 80, y: 104, text: "1 had bought tickets" }, { x: 170, y: 34, text: "2 went inside" }], readout: "After we had bought the tickets, we went inside." },
			{ label: "Zukunft", bars: [], dots: [300, 390], arrow: [310, 380], captions: [{ x: 300, y: 104, text: "as soon as I arrive" }, { x: 390, y: 34, text: "I'll phone you" }], readout: "I'll phone you as soon as I arrive." },
		],
	},
};

export const CONDITIONS = [
	{ id: "I", title: "Type I", formula: "if + present, will", sentence: "If I miss the bus, I will be late.", note: "Gut möglich (Wiederholung aus Klasse 6)." },
	{ id: "II", title: "Type II", formula: "if + past, would", sentence: "If I missed the bus, I would be late.", note: "Unwahrscheinlich oder nur gedacht – jetzt oder in Zukunft." },
	{ id: "III", title: "Type III", formula: "if + past perfect, would have + 3. Form", sentence: "If I had missed the bus, I would have been late.", note: "Vergangenheit – es ist nicht passiert." },
	{ id: "mixed", title: "Mischform", formula: "if + past perfect, would + Grundform", sentence: "If I had missed the bus, I would be at home now.", note: "Bedingung früher – Folge jetzt." },
	{ id: "wish", title: "Wish", formula: "I wish + past / past perfect", sentence: "I wish I lived closer to school. I wish I hadn't missed the bus.", note: "Wunsch zur Gegenwart oder Bedauern über die Vergangenheit." },
] as const;

const CONDITION_DEFAULT: Record<string, string> = {
	"e7-conditional-2": "II",
	"e7-conditional-3": "III",
	"e7-mixed-conditionals": "mixed",
	"e7-wishes": "wish",
};

export const PAIRS: Record<
	string,
	{ headers: [string, string]; rows: [string, string, string][] }
> = {
	"e7-norman-words": {
		headers: ["In the field (Old English)", "On the table (Norman French)"],
		rows: [
			["cow", "beef", "The animal is a cow; its meat is beef, from French boeuf."],
			["pig", "pork", "The animal is a pig; its meat is pork, from French porc."],
			["sheep", "mutton", "The animal is a sheep; its meat is mutton, from French mouton."],
			["calf", "veal", "The animal is a calf; its meat is veal, from French veau."],
			["deer", "venison", "The animal is a deer; its meat is venison, from French venaison."],
		],
	},
	"e7-language-contrast": {
		headers: ["Deutsch", "English"],
		rows: [
			["Ich wohne seit 2021 hier.", "I have lived here since 2021.", "Dauer bis jetzt: Deutsch Präsens, Englisch present perfect."],
			["Gestern habe ich ihn gesehen.", "I saw him yesterday.", "Vergangene Zeitangabe: Deutsch Perfekt, Englisch simple past."],
			["Wenn ich Zeit hätte, käme ich.", "If I had time, I would come.", "Konjunktiv II: if + simple past, would im Hauptsatz."],
			["Er sagt, er sei müde.", "He says he is tired.", "Kein Konjunktiv I: Nach says bleibt die Zeitform."],
			["Wir treffen uns um acht.", "We meet at eight.", "sich treffen ist im Englischen nicht reflexiv."],
		],
	},
};

interface LayoutZone {
	id: string;
	label: string;
	box: [number, number, number, number];
	text: string;
	note: string;
}

export const LAYOUTS: Record<string, { title: string; zones: LayoutZone[] }> = {
	"e7-media-use": {
		title: "School newspaper article",
		zones: [
			{ id: "headline", label: "Überschrift", box: [20, 14, 420, 34], text: "Can't put it down?", note: "Headline: short and surprising, so that people want to read on." },
			{ id: "intro", label: "Einleitung", box: [20, 56, 420, 36], text: "Most of us reach for our phone as soon as we wake up …", note: "Introduction: present the topic in one or two sentences." },
			{ id: "main", label: "Hauptteil", box: [20, 100, 270, 104], text: "On the one hand … On the other hand … However …", note: "Main part: arguments with examples, linked with on the one hand, however and therefore." },
			{ id: "photo", label: "Foto", box: [300, 100, 140, 104], text: "Photo + caption", note: "A photo with a caption makes the article more attractive." },
			{ id: "end", label: "Schluss", box: [20, 212, 420, 36], text: "In my opinion … – try it for a week!", note: "Conclusion: your opinion or a tip for the readers." },
		],
	},
	"e7-check-sources": {
		title: "Website check",
		zones: [
			{ id: "url", label: "Adresse", box: [10, 10, 440, 22], text: "www.super-berries-shop…", note: "Who runs the site? A shop wants to sell, not to inform." },
			{ id: "headline", label: "Überschrift", box: [20, 40, 290, 36], text: "SUPER-FOOD MIRACLE!", note: "A shouting headline in capital letters is a warning sign." },
			{ id: "ad", label: "Werbung", box: [320, 40, 120, 36], text: "BUY NOW", note: "A big Buy now button shows that the page is an advert." },
			{ id: "photo", label: "Foto", box: [20, 84, 180, 110], text: "smiling students", note: "Photos and captions attract attention, but they prove nothing." },
			{ id: "text", label: "Text", box: [210, 84, 230, 110], text: "better marks! cleverer! (no studies)", note: "Bold key words without sources or links: check the facts elsewhere." },
			{ id: "footer", label: "Autor und Datum", box: [20, 202, 420, 30], text: "no author · no date", note: "No author and no date: you cannot tell who wrote it or if it is up to date." },
		],
	},
	"e7-reading-strategies": {
		title: "Adventure story",
		zones: [
			{ id: "title", label: "Titel", box: [20, 14, 420, 30], text: "Lost in the Canyon", note: "Skimming: the title tells you the topic and the setting." },
			{ id: "picture", label: "Bild", box: [20, 54, 150, 150], text: "canyon + red cap", note: "Skimming: look at pictures and captions first." },
			{ id: "start", label: "Anfang", box: [180, 54, 260, 44], text: "Jake and Mia had left the trail …", note: "Exposition: characters (Jake, Mia) and setting (a desert canyon)." },
			{ id: "climax", label: "Höhepunkt", box: [180, 106, 260, 44], text: "Suddenly … thunder!", note: "Climax: short sentences and suddenly build suspense." },
			{ id: "end", label: "Ende", box: [180, 158, 260, 46], text: "Just in time, a ranger spotted …", note: "Solution: the problem ends. Scanning: look for names and numbers here." },
		],
	},
};

const HISTORY_ERAS = [
	{ id: "norman", label: "1066", note: "In 1066 William of Normandy won the Battle of Hastings. In 1086 the Domesday Book listed land and animals." },
	{ id: "henry", label: "Henry VIII", note: "Henry VIII was king from 1509 to 1547. In 1534 he became Head of the Church of England." },
	{ id: "elizabeth", label: "Elizabeth I", note: "Elizabeth I was queen from 1558 to 1603. In 1588 her navy defeated the Spanish Armada." },
	{ id: "mayflower", label: "Mayflower", note: "In 1620 the Mayflower sailed from Plymouth to North America." },
] as const;

const HISTORY_DEFAULT: Record<string, string> = {
	"e7-1066": "norman",
	"e7-henry-viii": "henry",
	"e7-elizabeth-i": "elizabeth",
};

const SENSES = [
	["look", "You look happy today.", "Look carefully at the map."],
	["sound", "That sounds great!", "(sound wird fast nur als 'klingen' gebraucht)"],
	["smell", "The pizza smells delicious.", "The dog smelled the bag curiously."],
	["taste", "The soup tastes salty.", "He tasted the soup slowly."],
	["feel", "The blanket feels soft.", "She felt the wall carefully in the dark."],
] as const;

const STRESS_WORDS = [
	{ id: "photograph", syllables: ["pho", "to", "graph"], stress: 0, note: "ˈphotograph – noun" },
	{ id: "photographer", syllables: ["pho", "to", "gra", "pher"], stress: 1, note: "phoˈtographer – a person" },
	{ id: "photographic", syllables: ["pho", "to", "gra", "phic"], stress: 2, note: "photoˈgraphic – -ic: stress before the ending" },
	{ id: "possibility", syllables: ["pos", "si", "bi", "li", "ty"], stress: 2, note: "possiˈbility – -ity: stress before the ending" },
	{ id: "record-n", syllables: ["re", "cord"], stress: 0, note: "a ˈrecord – noun" },
	{ id: "record-v", syllables: ["re", "cord"], stress: 1, note: "to reˈcord – verb" },
] as const;

/* ------------------------------------------------------------------ */
/* Rendering helpers.                                                  */
/* ------------------------------------------------------------------ */

/**
 * A focus group: buttons with data-focus-key switch which items are shown
 * (mode "hide") or highlighted (mode "dim") and write their note to the readout.
 */
function focusButtons(
	entries: { key: string; label: string; note: string }[],
	active: string,
	label: string,
): string {
	return `<div class="map-controls" role="group" aria-label="${esc(label)}">${entries
		.map(
			(entry) =>
				`<button type="button" class="button secondary" data-focus-key="${esc(entry.key)}" data-note="${esc(entry.note)}" aria-pressed="${entry.key === active}">${esc(entry.label)}</button>`,
		)
		.join("")}</div>`;
}
const item = (key: string, active: string, mode: "hide" | "dim") =>
	`data-focus-item="${esc(key)}"${key === active ? "" : mode === "hide" ? " hidden" : ' data-dim="true"'}`;

function readout(text: string): string {
	return `<p class="explorer-readout" data-focus-readout lang="en" aria-live="polite">${esc(text)}</p>`;
}

function renderTransform(lessonId: string): string {
	const data = TRANSFORMS[lessonId];
	if (!data) return "";
	const first = data.entries[0];
	return `<div class="transform-explorer"><label>${esc(data.label)} <select data-transform>${data.entries
		.map(
			(entry, index) =>
				`<option value="${index}" lang="en">${esc(entry.input)}</option>`,
		)
		.join("")}</select></label><div class="transform-machine" aria-live="polite"><span class="transform-in" lang="en">${esc(first.input)}</span><span class="transform-gear" aria-hidden="true">⚙</span><span class="transform-out" lang="en">${esc(first.output)}</span></div><p class="small"><strong>Regel:</strong> <span data-transform-rule>${esc(first.rule)}</span> · <span lang="en" data-transform-example>${esc(first.example)}</span></p></div>`;
}

function renderAdverbRace(): string {
	return `<div class="comparison-explorer adverb-race">
		<div class="comparison-controls">
			<label for="adv-kind">Adverb
				<select id="adv-kind">
					<option value="fast">fast → faster → fastest</option>
					<option value="carefully">carefully → more carefully → most carefully</option>
					<option value="well">well → better → best</option>
				</select>
			</label>
			<label for="adv-lena">Lena (1–5)<input id="adv-lena" type="range" min="1" max="5" value="4"></label>
			<label for="adv-tom">Tom (1–5)<input id="adv-tom" type="range" min="1" max="5" value="2"></label>
		</div>
		<svg viewBox="0 0 460 96" role="img" aria-label="Zwei Bahnen: Je weiter rechts eine Figur steht, desto höher ihr Wert.">
			<rect x="20" y="12" width="420" height="30" rx="15" class="lane"/>
			<rect x="20" y="54" width="420" height="30" rx="15" class="lane"/>
			<line x1="420" y1="8" x2="420" y2="88" class="finish"/>
			<text x="30" y="32" class="lane-name">Lena</text><text x="30" y="74" class="lane-name">Tom</text>
			<circle id="adv-lena-dot" cx="${110 + 3 * 70}" cy="27" r="11" class="runner runner-a"/>
			<circle id="adv-tom-dot" cx="${110 + 1 * 70}" cy="69" r="11" class="runner runner-b"/>
		</svg>
		<p id="adv-readout" class="explorer-readout" lang="en" aria-live="polite">${esc(adverbSentence(4, 2, "fast"))}</p>
	</div>`;
}

function renderSenses(): string {
	const active = "impression";
	return `<div class="senses-explorer" data-focus-root="senses" data-focus-mode="hide">${focusButtons(
		[
			{ key: "impression", label: "Eindruck → Adjektiv", note: "look, sound, smell, taste and feel + adjective describe an impression." },
			{ key: "action", label: "Handlung → Adverb", note: "When the verb describes an action, an adverb follows." },
		],
		active,
		"Bedeutung wählen",
	)}<div class="senses-grid">${SENSES.map(
		([verb, impression, action]) =>
			`<div class="sense-card"><strong lang="en">${verb}</strong><p lang="en" ${item("impression", active, "hide")}>${esc(impression)}</p><p lang="en" ${item("action", active, "hide")}>${esc(action)}</p></div>`,
	).join("")}</div>${readout("look, sound, smell, taste and feel + adjective describe an impression.")}</div>`;
}

function renderMirror(): string {
	const active = "themselves";
	return `<div class="mirror-explorer" data-focus-root="mirror" data-focus-mode="hide">${focusButtons(
		[
			{ key: "themselves", label: "themselves", note: "They are looking at themselves in the mirror (each at herself)." },
			{ key: "each-other", label: "each other", note: "They are looking at each other (einander)." },
		],
		active,
		"Pronomen wählen",
	)}<svg viewBox="0 0 460 140" role="img" aria-label="Zwei Figuren: entweder schaut jede in ihren eigenen Spiegel oder sie schauen einander an.">
		<g ${item("themselves", active, "hide")}>
			<rect x="40" y="20" width="16" height="96" rx="4" class="mirror"/><rect x="404" y="20" width="16" height="96" rx="4" class="mirror"/>
			<circle cx="120" cy="50" r="18" class="figure figure-a"/><rect x="104" y="70" width="32" height="46" rx="10" class="figure figure-a"/>
			<circle cx="340" cy="50" r="18" class="figure figure-b"/><rect x="324" y="70" width="32" height="46" rx="10" class="figure figure-b"/>
			<path d="M100 50 L62 50" class="look-arrow"/><path d="M360 50 L398 50" class="look-arrow"/>
			<text x="230" y="132" text-anchor="middle" class="scene-label">themselves</text>
		</g>
		<g ${item("each-other", active, "hide")}>
			<circle cx="150" cy="50" r="18" class="figure figure-a"/><rect x="134" y="70" width="32" height="46" rx="10" class="figure figure-a"/>
			<circle cx="310" cy="50" r="18" class="figure figure-b"/><rect x="294" y="70" width="32" height="46" rx="10" class="figure figure-b"/>
			<path d="M172 44 L286 44" class="look-arrow"/><path d="M288 58 L174 58" class="look-arrow"/>
			<text x="230" y="132" text-anchor="middle" class="scene-label">each other</text>
		</g>
	</svg>${readout("They are looking at themselves in the mirror (each at herself).")}</div>`;
}

function renderTimeline(lessonId: string): string {
	const data = TIMELINES[lessonId];
	if (!data) return "";
	const active = "0";
	return `<div class="timeline-explorer" data-focus-root="timeline" data-focus-mode="hide">${focusButtons(
		data.modes.map((mode, index) => ({
			key: String(index),
			label: mode.label,
			note: mode.readout,
		})),
		active,
		"Zeitform umschalten",
	)}<svg viewBox="0 0 460 120" role="img" aria-label="Zeitstrahl von der Vergangenheit bis jetzt">
		<line x1="28" y1="70" x2="432" y2="70" class="timeline-axis"/>
		<polygon points="432,65 444,70 432,75" class="timeline-arrow"/>
		<line x1="${data.now}" y1="56" x2="${data.now}" y2="84" class="timeline-now"/>
		<text x="${data.now}" y="100" text-anchor="middle" class="timeline-label">NOW</text>
		${data.modes
			.map(
				(mode, index) =>
					`<g ${item(String(index), active, "hide")}>${mode.bars
						.map(
							([from, to]) =>
								`<rect x="${from}" y="58" width="${to - from}" height="24" rx="12" class="timeline-bar"/>`,
						)
						.join("")}${mode.dots
						.map((x) => `<circle cx="${x}" cy="70" r="9" class="timeline-dot"/>`)
						.join("")}${
						mode.arrow
							? `<path d="M${mode.arrow[0]} 48 Q${(mode.arrow[0] + mode.arrow[1]) / 2} 30 ${mode.arrow[1]} 48" class="timeline-bridge"/>`
							: ""
					}${mode.captions
						.map(
							(caption) =>
								`<text x="${caption.x}" y="${caption.y}" text-anchor="middle" class="timeline-text">${esc(caption.text)}</text>`,
						)
						.join("")}</g>`,
			)
			.join("")}
	</svg>${readout(data.modes[0].readout)}</div>`;
}

function renderConditions(lessonId: string): string {
	const active = CONDITION_DEFAULT[lessonId] ?? "II";
	const activeEntry = CONDITIONS.find((entry) => entry.id === active)!;
	return `<div class="conditions-explorer" data-focus-root="conditions" data-focus-mode="dim">${focusButtons(
		CONDITIONS.map((entry) => ({
			key: entry.id,
			label: entry.title,
			note: entry.sentence,
		})),
		active,
		"Bedingungstyp wählen",
	)}<div class="reality-scale" aria-hidden="true"><span>real, gut möglich</span><span>gedacht, unwahrscheinlich</span><span>vorbei, nicht passiert</span></div><div class="condition-cards">${CONDITIONS.map(
		(entry) =>
			`<div class="condition-card condition-${entry.id}" ${item(entry.id, active, "dim")}><strong>${esc(entry.title)}</strong><code>${esc(entry.formula)}</code><p lang="en">${esc(entry.sentence)}</p><p class="small">${esc(entry.note)}</p></div>`,
	).join("")}</div>${readout(activeEntry.sentence)}</div>`;
}

export function renderCalendar(year: number): string {
	const list = holidays(year);
	const active = "thanksgiving";
	return `<div class="calendar-explorer" data-focus-root="calendar" data-focus-mode="dim" data-year="${year}">
	<div class="calendar-year"><button type="button" class="icon-button" data-calendar-shift="-1" aria-label="Vorheriges Jahr">◀</button><strong data-calendar-year>${year}</strong><button type="button" class="icon-button" data-calendar-shift="1" aria-label="Nächstes Jahr">▶</button></div>
	${focusButtons(
		list.map((holiday) => ({ key: holiday.id, label: holiday.name, note: holiday.note })),
		active,
		"Feiertag wählen",
	)}
	<svg viewBox="0 0 472 96" role="img" aria-label="Jahreskalender mit Feiertagen in Nordamerika">
		${MONTHS.map(
			(month, index) =>
				`<rect x="${20 + index * 36}" y="34" width="34" height="34" rx="6" class="month${index % 2 ? " month-alt" : ""}"/><text x="${37 + index * 36}" y="86" text-anchor="middle" class="month-label">${month.slice(0, 3)}</text>`,
		).join("")}
		${list
			.map(
				(holiday) =>
					`<g ${item(holiday.id, active, "dim")}><circle data-holiday="${holiday.id}" cx="${calendarX(holiday.month, holiday.day)}" cy="51" r="8" class="holiday holiday-${holiday.id}"/><text data-holiday-day="${holiday.id}" x="${calendarX(holiday.month, holiday.day)}" y="24" text-anchor="middle" class="holiday-day">${holiday.day}</text></g>`,
			)
			.join("")}
	</svg>${readout(list.find((holiday) => holiday.id === active)!.note)}</div>`;
}

function renderSchedule(): string {
	const x = (hour: number) => 60 + (hour - 7) * 40;
	const rows: [string, [number, number, string, string][]][] = [
		[
			"usa",
			[
				[7.08, 7.75, "bus", "b-travel"],
				[7.75, 8, "", "b-home"],
				[8, 11.5, "classes", "b-class"],
				[11.5, 12, "lunch", "b-lunch"],
				[12, 15.25, "classes", "b-class"],
				[15.25, 17, "soccer practice", "b-club"],
			],
		],
		[
			"germany",
			[
				[7.5, 8, "", "b-travel"],
				[8, 13, "lessons", "b-class"],
				[13.25, 14, "lunch", "b-lunch"],
				[14, 15.5, "homework", "b-home"],
				[16, 17, "club", "b-club"],
			],
		],
	];
	const active = "usa";
	return `<div class="schedule-explorer" data-focus-root="schedule" data-focus-mode="dim">${focusButtons(
		[
			{ key: "usa", label: "Marcus, Texas", note: "Marcus: bus at 7:05, homeroom at 7:45, the same six classes every day, lunch in the cafeteria, soccer practice until five." },
			{ key: "germany", label: "Beispiel Deutschland", note: "Example from Germany: lessons until about one o'clock, lunch at home, homework, then a sports club." },
		],
		active,
		"Schultag wählen",
	)}<svg viewBox="0 0 480 130" role="img" aria-label="Zwei Tagespläne von 7 bis 17 Uhr im Vergleich">
		${[7, 9, 11, 13, 15, 17]
			.map(
				(hour) =>
					`<line x1="${x(hour)}" y1="14" x2="${x(hour)}" y2="108" class="grid-line"/><text x="${x(hour)}" y="124" text-anchor="middle" class="month-label">${hour}:00</text>`,
			)
			.join("")}
		${rows
			.map(
				([key, blocks], rowIndex) =>
					`<g ${item(key, active, "dim")}><text x="4" y="${rowIndex * 48 + 42}" class="lane-name">${key === "usa" ? "USA" : "DE"}</text>${blocks
						.map(
							([from, to, label, kind]) =>
								`<rect x="${x(from)}" y="${rowIndex * 48 + 20}" width="${x(to) - x(from)}" height="34" rx="6" class="${kind}"/>${label ? `<text x="${(x(from) + x(to)) / 2}" y="${rowIndex * 48 + 42}" text-anchor="middle" class="block-label">${label}</text>` : ""}`,
						)
						.join("")}</g>`,
			)
			.join("")}
	</svg>${readout("Marcus: bus at 7:05, homeroom at 7:45, the same six classes every day, lunch in the cafeteria, soccer practice until five.")}</div>`;
}

function renderLayout(lessonId: string): string {
	const data = LAYOUTS[lessonId];
	if (!data) return "";
	const active = data.zones[0].id;
	return `<div class="layout-explorer" data-focus-root="layout" data-focus-mode="dim">${focusButtons(
		data.zones.map((zone) => ({ key: zone.id, label: zone.label, note: zone.note })),
		active,
		"Bereich wählen",
	)}<svg viewBox="0 0 460 250" role="img" aria-label="${esc(data.title)}: schematische Seite mit markierten Bereichen">
		<rect width="460" height="250" rx="12" class="page"/>
		${data.zones
			.map(
				(zone) =>
					`<g ${item(zone.id, active, "dim")}><rect x="${zone.box[0]}" y="${zone.box[1]}" width="${zone.box[2]}" height="${zone.box[3]}" rx="6" class="zone zone-${zone.id}"/><text x="${zone.box[0] + 8}" y="${zone.box[1] + 18}" class="zone-text">${esc(zone.text)}</text></g>`,
			)
			.join("")}
	</svg>${readout(data.zones[0].note)}</div>`;
}

function renderHistory(lessonId: string): string {
	const active = HISTORY_DEFAULT[lessonId] ?? "norman";
	const marker = (year: number, label: string, y: number) =>
		`<line x1="${historyX(year)}" y1="62" x2="${historyX(year)}" y2="${y + 4}" class="grid-line"/><circle cx="${historyX(year)}" cy="70" r="6" class="history-dot"/><text x="${historyX(year)}" y="${y}" text-anchor="middle" class="timeline-text">${label}</text>`;
	return `<div class="history-explorer" data-focus-root="history" data-focus-mode="dim">${focusButtons(
		HISTORY_ERAS.map((era) => ({ key: era.id, label: era.label, note: era.note })),
		active,
		"Epoche wählen",
	)}<svg viewBox="0 0 500 130" role="img" aria-label="Geschichtsfries von 1066 bis 1620 mit einer Lücke zwischen 1100 und 1500">
		<line x1="30" y1="70" x2="160" y2="70" class="timeline-axis"/>
		<path d="M164 62 L172 78 M174 62 L182 78" class="timeline-axis"/>
		<line x1="186" y1="70" x2="476" y2="70" class="timeline-axis"/>
		<polygon points="476,65 488,70 476,75" class="timeline-arrow"/>
		<g ${item("norman", active, "dim")}>${marker(1066, "1066 Hastings", 40)}${marker(1086, "1086 Domesday", 108)}</g>
		<g ${item("henry", active, "dim")}><rect x="${historyX(1509)}" y="60" width="${historyX(1547) - historyX(1509)}" height="20" rx="8" class="reign-henry"/>${marker(1534, "1534 Church of England", 40)}<text x="${(historyX(1509) + historyX(1547)) / 2}" y="108" text-anchor="middle" class="timeline-text">Henry VIII</text></g>
		<g ${item("elizabeth", active, "dim")}><rect x="${historyX(1558)}" y="60" width="${historyX(1603) - historyX(1558)}" height="20" rx="8" class="reign-elizabeth"/>${marker(1588, "1588 Armada", 22)}<text x="${(historyX(1558) + historyX(1603)) / 2}" y="108" text-anchor="middle" class="timeline-text">Elizabeth I</text></g>
		<g ${item("mayflower", active, "dim")}>${marker(1620, "1620", 40)}<text x="${historyX(1620)}" y="122" text-anchor="end" class="timeline-text">Mayflower</text></g>
	</svg>${readout(HISTORY_ERAS.find((era) => era.id === active)!.note)}</div>`;
}

function renderPairs(lessonId: string): string {
	const data = PAIRS[lessonId];
	if (!data) return "";
	const active = data.rows[0][0];
	return `<div class="pairs-explorer" data-focus-root="pairs" data-focus-mode="dim">${focusButtons(
		data.rows.map(([left, right, note]) => ({
			key: left,
			label: `${left} – ${right}`,
			note,
		})),
		active,
		"Paar wählen",
	)}<div class="pairs-table" role="table"><div class="pairs-row pairs-head" role="row"><span role="columnheader">${esc(data.headers[0])}</span><span role="columnheader">${esc(data.headers[1])}</span></div>${data.rows
		.map(
			([left, right]) =>
				`<div class="pairs-row" role="row" ${item(left, active, "dim")}><span role="cell" lang="${lessonId === "e7-language-contrast" ? "de" : "en"}">${esc(left)}</span><span role="cell" lang="en">${esc(right)}</span></div>`,
		)
		.join("")}</div>${readout(data.rows[0][2])}</div>`;
}

function renderStress(): string {
	const active = STRESS_WORDS[1].id;
	return `<div class="stress-explorer" data-focus-root="stress" data-focus-mode="hide">${focusButtons(
		STRESS_WORDS.map((word) => ({ key: word.id, label: word.syllables.join(""), note: word.note })),
		active,
		"Wort wählen",
	)}<div class="stress-stage">${STRESS_WORDS.map(
		(word) =>
			`<div class="syllables" lang="en" ${item(word.id, active, "hide")}>${word.syllables
				.map(
					(syllable, index) =>
						`<span class="syllable${index === word.stress ? " stressed" : ""}">${esc(index === word.stress ? syllable.toUpperCase() : syllable)}</span>`,
				)
				.join("")}</div>`,
	).join("")}</div><p class="small" lang="en">She didn't take them in <strong>SUMMER</strong> – she took them in <strong>WINTER</strong>.</p>${readout(STRESS_WORDS[1].note)}</div>`;
}

function illustration(lesson: Lesson): string {
	switch (lesson.workshop.kind) {
		case "transform":
			return renderTransform(lesson.id);
		case "adverbs":
			return renderAdverbRace();
		case "senses":
			return renderSenses();
		case "mirror":
			return renderMirror();
		case "timeline":
			return renderTimeline(lesson.id);
		case "conditions":
			return renderConditions(lesson.id);
		case "calendar":
			return renderCalendar(new Date().getFullYear());
		case "schedule":
			return renderSchedule();
		case "layout":
			return renderLayout(lesson.id);
		case "picture":
			return renderFilmScene();
		case "map-uk":
			return renderWalesMap();
		case "map-us":
			return renderUsMap();
		case "history":
			return renderHistory(lesson.id);
		case "pairs":
			return renderPairs(lesson.id);
		case "sound":
			return renderStress();
		default:
			return "";
	}
}

export function renderWorkshop(lesson: Lesson): string {
	return `<section class="panel workshop" aria-labelledby="workshop-title"><h2 id="workshop-title">Deine Entdeckerwerkstatt</h2><p>Probiere die Grafik aus, verbinde dann die Bausteine und erreiche die drei Ziele. Du kannst jede Auswahl ändern.</p>${illustration(lesson)}<div class="construction">${lesson.workshop.goals
		.map((goal, index) => {
			const options = [
				...goal.options.slice(index + 1),
				...goal.options.slice(0, index + 1),
			];
			return `<div class="construction-row" data-goal="${index}"><span class="goal-number" aria-hidden="true">${index + 1}</span><div><label for="workshop-${index}">${esc(goal.label)}</label><div class="word-chain">${goal.before ? `<span class="word-piece" lang="en">${esc(goal.before)}</span><span aria-hidden="true">→</span>` : ""}<select id="workshop-${index}" data-workshop="${index}"><option value="">Baustein wählen…</option>${options.map((option) => `<option lang="en" value="${esc(option)}">${esc(option)}</option>`).join("")}</select>${goal.after ? `<span class="word-piece" lang="en">${esc(goal.after)}</span>` : ""}</div><p class="goal-feedback small" role="status">Ziel noch offen.</p></div></div>`;
		})
		.join("")}</div><p id="workshop-status" role="status">0 von 3 Zielen erreicht.</p></section>`;
}

/* ------------------------------------------------------------------ */
/* Behaviour.                                                          */
/* ------------------------------------------------------------------ */

function bindFocusRoot(root: HTMLElement): void {
	const mode = root.dataset.focusMode === "hide" ? "hide" : "dim";
	const apply = (key: string, note: string) => {
		for (const button of root.querySelectorAll<HTMLElement>("[data-focus-key]"))
			button.setAttribute("aria-pressed", String(button.dataset.focusKey === key));
		for (const element of root.querySelectorAll<HTMLElement | SVGElement>(
			"[data-focus-item]",
		)) {
			const match = element.dataset.focusItem === key;
			if (mode === "hide") element.toggleAttribute("hidden", !match);
			else element.setAttribute("data-dim", String(!match));
		}
		const out = root.querySelector("[data-focus-readout]");
		if (out) out.textContent = note;
	};
	for (const button of root.querySelectorAll<HTMLButtonElement>("[data-focus-key]"))
		button.addEventListener("click", () =>
			apply(button.dataset.focusKey ?? "", button.dataset.note ?? ""),
		);
}

function bindCalendar(root: HTMLElement): void {
	for (const button of root.querySelectorAll<HTMLButtonElement>(
		"[data-calendar-shift]",
	))
		button.addEventListener("click", () => {
			const year =
				Number(root.dataset.year) + Number(button.dataset.calendarShift);
			root.dataset.year = String(year);
			root.querySelector("[data-calendar-year]")!.textContent = String(year);
			const pressed =
				root.querySelector<HTMLElement>('[data-focus-key][aria-pressed="true"]')
					?.dataset.focusKey ?? "thanksgiving";
			for (const holiday of holidays(year)) {
				const x = String(calendarX(holiday.month, holiday.day));
				root.querySelector(`[data-holiday="${holiday.id}"]`)?.setAttribute("cx", x);
				const day = root.querySelector(`[data-holiday-day="${holiday.id}"]`);
				if (day) {
					day.setAttribute("x", x);
					day.textContent = String(holiday.day);
				}
				const key = root.querySelector<HTMLElement>(
					`[data-focus-key="${holiday.id}"]`,
				);
				if (key) key.dataset.note = holiday.note;
				if (holiday.id === pressed)
					root.querySelector("[data-focus-readout]")!.textContent = holiday.note;
			}
		});
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
				.forEach((row, index) => {
					row.dataset.reached = String(reached[index]);
					row.querySelector(".goal-feedback")!.textContent = reached[index]
						? `✓ ${lesson.workshop.goals[index].explanation}`
						: inputs[index].value
							? "Noch offen. Vergleiche den Baustein mit der Erklärung und dem Material."
							: "Ziel noch offen.";
				});
			const count = reached.filter(Boolean).length;
			container.querySelector("#workshop-status")!.textContent =
				`${count} von 3 Zielen erreicht.${count === 3 ? " Werkstatt gespeichert." : ""}`;
			if (count === 3) complete();
		});

	for (const root of container.querySelectorAll<HTMLElement>("[data-focus-root]"))
		bindFocusRoot(root);
	const calendar = container.querySelector<HTMLElement>('[data-focus-root="calendar"]');
	if (calendar) bindCalendar(calendar);

	for (const button of container.querySelectorAll<HTMLButtonElement>(
		"[data-map-focus]",
	))
		button.addEventListener("click", () => {
			const selected = button.getAttribute("aria-pressed") !== "true";
			for (const other of container.querySelectorAll("[data-map-focus]"))
				other.setAttribute("aria-pressed", String(other === button && selected));
			for (const layer of container.querySelectorAll<SVGGElement>(
				"[data-map-layer]",
			))
				layer.style.opacity =
					selected &&
					layer.dataset.mapLayer !== button.dataset.mapFocus &&
					layer.dataset.mapLayer !== "regions"
						? "0.18"
						: "1";
		});

	for (const button of container.querySelectorAll<HTMLButtonElement>(
		"[data-scene-focus]",
	))
		button.addEventListener("click", () => {
			const selected = button.getAttribute("aria-pressed") !== "true";
			const zone = button.dataset.sceneFocus ?? "";
			for (const other of container.querySelectorAll("[data-scene-focus]"))
				other.setAttribute("aria-pressed", String(other === button && selected));
			for (const group of container.querySelectorAll<SVGGElement>(
				"[data-scene-zone]",
			))
				group.style.opacity =
					selected && group.dataset.sceneZone !== zone ? "0.25" : "1";
			const out = container.querySelector("#scene-readout");
			if (out)
				out.textContent = selected
					? (SCENE_NOTES[zone] ?? "")
					: "The picture shows a rainy evening at a bus stop.";
		});

	const transform = container.querySelector<HTMLSelectElement>("[data-transform]");
	const transformData = TRANSFORMS[lesson.id];
	if (transform && transformData)
		transform.addEventListener("change", () => {
			const entry = transformData.entries[Number(transform.value)];
			if (!entry) return;
			container.querySelector(".transform-in")!.textContent = entry.input;
			container.querySelector(".transform-out")!.textContent = entry.output;
			container.querySelector("[data-transform-rule]")!.textContent = entry.rule;
			container.querySelector("[data-transform-example]")!.textContent =
				entry.example;
		});

	const kind = container.querySelector<HTMLSelectElement>("#adv-kind");
	const lena = container.querySelector<HTMLInputElement>("#adv-lena");
	const tom = container.querySelector<HTMLInputElement>("#adv-tom");
	if (kind && lena && tom) {
		const update = () => {
			container
				.querySelector("#adv-lena-dot")
				?.setAttribute("cx", String(40 + Number(lena.value) * 70));
			container
				.querySelector("#adv-tom-dot")
				?.setAttribute("cx", String(40 + Number(tom.value) * 70));
			container.querySelector("#adv-readout")!.textContent = adverbSentence(
				Number(lena.value),
				Number(tom.value),
				kind.value as AdverbKind,
			);
		};
		kind.addEventListener("change", update);
		lena.addEventListener("input", update);
		tom.addEventListener("input", update);
		update();
	}
}
