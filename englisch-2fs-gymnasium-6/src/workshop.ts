import { esc } from "./practice";
import {
	focusButtons,
	focusItem as item,
	readout,
	renderBritishIsles,
	renderCityCountry,
	renderLondonMap,
	renderNorthAmerica,
	renderTwoCities,
	type FocusEntry,
} from "./places-map";
import type { Lesson, Workshop } from "./types";

export function workshopGoals(workshop: Workshop, answers: string[]): boolean[] {
	return workshop.goals.map((goal, index) => answers[index] === goal.answer);
}

/* ------------------------------------------------------------------ */
/* Pure explorer models (tested in tests/content.test.ts).             */
/* ------------------------------------------------------------------ */

const ONES = [
	"zero",
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
	"ten",
	"eleven",
	"twelve",
	"thirteen",
	"fourteen",
	"fifteen",
	"sixteen",
	"seventeen",
	"eighteen",
	"nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

/** Cardinal numbers 0–99 in words (tens first, with a hyphen). */
export function numberWord(value: number): string {
	const n = Math.max(0, Math.min(99, Math.round(value)));
	if (n < 20) return ONES[n];
	const ten = TENS[Math.floor(n / 10)];
	return n % 10 ? `${ten}-${ONES[n % 10]}` : ten;
}

const ORDINAL_WORDS: Record<string, string> = {
	one: "first",
	two: "second",
	three: "third",
	five: "fifth",
	eight: "eighth",
	nine: "ninth",
	twelve: "twelfth",
};

/** Ordinal numbers 1–31 in words: first, twelfth, twenty-first, thirtieth. */
export function ordinalWord(value: number): string {
	const word = numberWord(value);
	const parts = word.split("-");
	const last = parts.pop()!;
	const ordinal =
		ORDINAL_WORDS[last] ?? (last.endsWith("y") ? `${last.slice(0, -1)}ieth` : `${last}th`);
	return [...parts, ordinal].join("-");
}

/** Ordinal numbers as figures: 1st, 2nd, 3rd, 4th, 11th, 12th, 13th, 21st … */
export function ordinal(value: number): string {
	const n = Math.round(value);
	const suffix =
		n % 100 >= 11 && n % 100 <= 13
			? "th"
			: n % 10 === 1
				? "st"
				: n % 10 === 2
					? "nd"
					: n % 10 === 3
						? "rd"
						: "th";
	return `${n}${suffix}`;
}

export const MONTHS = [
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
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const WEEKDAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

/** A birthday sentence as written and as spoken in British English. */
export function dateSentence(day: number, month: number): { written: string; spoken: string } {
	const m = Math.max(0, Math.min(11, Math.round(month)));
	const d = Math.max(1, Math.min(DAYS_IN_MONTH[m], Math.round(day)));
	return {
		written: `My birthday is on ${ordinal(d)} ${MONTHS[m]}.`,
		spoken: `on the ${ordinalWord(d)} of ${MONTHS[m]}`,
	};
}

const HOUR_WORDS = [
	"twelve",
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
	"ten",
	"eleven",
];
const MINUTE_WORDS: Record<number, string> = {
	5: "five",
	10: "ten",
	15: "quarter",
	20: "twenty",
	25: "twenty-five",
	30: "half",
};

/** The British way to say a time in five-minute steps: quarter past four, twenty to five. */
export function clockLabel(hour: number, minute: number): string {
	const h = ((Math.round(hour) % 24) + 24) % 24;
	const m = Math.max(0, Math.min(55, Math.round(minute / 5) * 5));
	if (m === 0) return h === 0 ? "midnight" : h === 12 ? "twelve o'clock (midday)" : `${HOUR_WORDS[h % 12]} o'clock`;
	if (m <= 30) return `${MINUTE_WORDS[m]} past ${HOUR_WORDS[h % 12]}`;
	return `${MINUTE_WORDS[60 - m]} to ${HOUR_WORDS[(h + 1) % 12]}`;
}

/** 12-hour time with a.m. (before midday) or p.m. (after midday). */
export function ampm(hour: number, minute: number): string {
	const h = ((Math.round(hour) % 24) + 24) % 24;
	const m = Math.max(0, Math.min(55, Math.round(minute / 5) * 5));
	const twelve = h % 12 === 0 ? 12 : h % 12;
	return `${twelve}:${String(m).padStart(2, "0")} ${h < 12 ? "a.m." : "p.m."}`;
}

/** Prices in pence, written the British way (£2.50, 80p). */
export function formatPrice(pence: number): string {
	const p = Math.round(pence);
	if (p < 100) return `${p}p`;
	return `£${Math.floor(p / 100)}.${String(p % 100).padStart(2, "0")}`;
}

/** Prices in pence, spoken: two pounds fifty, eighty p, one pound. */
export function spokenPrice(pence: number): string {
	const p = Math.max(0, Math.round(pence));
	const pounds = Math.floor(p / 100);
	const rest = p % 100;
	if (pounds === 0) return rest === 0 ? "nothing" : `${numberWord(rest)} p`;
	const poundWord = pounds === 1 ? "one pound" : `${numberWord(pounds)} pounds`;
	return rest ? `${poundWord} ${numberWord(rest)}` : poundWord;
}

export interface ShopItem {
	id: string;
	name: string;
	pence: number;
}

export const SHOP_ITEMS: ShopItem[] = [
	{ id: "cap", name: "cap", pence: 800 },
	{ id: "socks", name: "pair of socks", pence: 300 },
	{ id: "postcard", name: "postcard", pence: 80 },
	{ id: "bus", name: "red toy bus", pence: 450 },
	{ id: "tshirt", name: "T-shirt", pence: 1200 },
];
export const NOTES = [500, 1000, 2000];

/** The bill for some quantities and one note: total, change and two sentences. */
export function shopBill(quantities: number[], paid: number): {
	total: number;
	change: number;
	totalText: string;
	changeText: string;
} {
	const total = SHOP_ITEMS.reduce(
		(sum, entry, index) => sum + entry.pence * Math.max(0, Math.round(quantities[index] ?? 0)),
		0,
	);
	const change = paid - total;
	return {
		total,
		change,
		totalText: total
			? `That's ${formatPrice(total)}, please – ${spokenPrice(total)}.`
			: "Choose something from the shelf.",
		changeText: !total
			? ""
			: change >= 0
				? `You pay ${formatPrice(paid)}. Here's your change: ${formatPrice(change)} – ${spokenPrice(change)}.`
				: `Sorry, ${formatPrice(paid)} isn't enough. You need ${spokenPrice(-change)} more.`,
	};
}

export interface Festival {
	id: string;
	name: string;
	month: number;
	day: number;
	lane: 0 | 1;
	custom: string;
}

export const FESTIVALS: Festival[] = [
	{ id: "david", name: "St David's Day", month: 2, day: 1, lane: 0, custom: "Wales celebrates its patron saint; many people wear a daffodil or a leek." },
	{ id: "patrick", name: "St Patrick's Day", month: 2, day: 17, lane: 1, custom: "A national holiday in Ireland, also celebrated in Northern Ireland, with parades and green clothes." },
	{ id: "halloween", name: "Halloween", month: 9, day: 31, lane: 0, custom: "Children wear costumes and go trick or treating." },
	{ id: "bonfire", name: "Bonfire Night", month: 10, day: 5, lane: 1, custom: "Bonfires and fireworks remember the plot against Parliament in 1605." },
	{ id: "christmas", name: "Christmas Day", month: 11, day: 25, lane: 0, custom: "Presents in a stocking, turkey and Christmas crackers." },
	{ id: "boxing", name: "Boxing Day", month: 11, day: 26, lane: 1, custom: "The day after Christmas Day is a holiday too." },
];

/** A festival note with its weekday in a given year. */
export function festivalNote(festival: Festival, year: number): string {
	const weekday = WEEKDAYS[new Date(Date.UTC(year, festival.month, festival.day)).getUTCDay()];
	return `${festival.name} is on ${weekday}, ${ordinal(festival.day)} ${MONTHS[festival.month]} ${year}. ${festival.custom}`;
}

/** x position on the calendar strip (12 months of 36 px, starting at x = 20). */
export const calendarX = (month: number, day: number): number =>
	Math.round((20 + month * 36 + ((day - 0.5) / 31) * 36) * 10) / 10;

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
	"e6s-to-be": {
		label: "Subjekt wählen",
		entries: [
			{ input: "I", output: "I am – I'm – I'm not", rule: "I → am", example: "I'm eleven. I'm not twelve." },
			{ input: "you", output: "you are – you're – you aren't", rule: "you → are", example: "You're my friend. You aren't late." },
			{ input: "he", output: "he is – he's – he isn't", rule: "he, she, it → is", example: "He's from Leeds. He isn't from London." },
			{ input: "she", output: "she is – she's – she isn't", rule: "he, she, it → is", example: "She's hungry. She isn't tired." },
			{ input: "it", output: "it is – it's – it isn't", rule: "he, she, it → is", example: "It's cold. It isn't sunny." },
			{ input: "we", output: "we are – we're – we aren't", rule: "we, you, they → are", example: "We're in Year 7. We aren't in Year 8." },
			{ input: "they", output: "they are – they're – they aren't", rule: "we, you, they → are", example: "They're in the hall. They aren't in the car." },
		],
	},
	"e6s-have-got": {
		label: "Nomen wählen",
		entries: [
			{ input: "cat", output: "cats", rule: "+ -s", example: "We've got two cats." },
			{ input: "box", output: "boxes", rule: "nach s, x, sh, ch: + -es", example: "There are three boxes in the garage." },
			{ input: "watch", output: "watches", rule: "nach s, x, sh, ch: + -es", example: "My dad has got two watches." },
			{ input: "puppy", output: "puppies", rule: "Konsonant + y → -ies", example: "Our dog has got four puppies." },
			{ input: "boy", output: "boys", rule: "Vokal + y → -ys", example: "There are twelve boys in my class." },
			{ input: "child", output: "children", rule: "unregelmäßig", example: "Mrs Green has got four children." },
			{ input: "mouse", output: "mice", rule: "unregelmäßig", example: "Two mice live in the barn." },
			{ input: "foot", output: "feet", rule: "unregelmäßig", example: "My feet are cold." },
			{ input: "sheep", output: "sheep", rule: "gleiche Form", example: "My grandparents have got ten sheep." },
		],
	},
	"e6s-articles": {
		label: "Wort wählen",
		entries: [
			{ input: "dog", output: "a dog", rule: "Konsonantlaut → a", example: "I've got a dog." },
			{ input: "apple", output: "an apple", rule: "Vokallaut → an", example: "I eat an apple every day." },
			{ input: "uniform", output: "a uniform", rule: "Laut [j] ist ein Konsonantlaut → a", example: "We wear a uniform at school." },
			{ input: "hour", output: "an hour", rule: "stummes h, Vokallaut → an", example: "The film is an hour long." },
			{ input: "elephant", output: "an elephant", rule: "Vokallaut → an", example: "There's an elephant at the zoo." },
			{ input: "European city", output: "a European city", rule: "Laut [j] → a", example: "Leeds is a European city." },
			{ input: "doctor (Beruf)", output: "She's a doctor", rule: "Beruf → mit a oder an", example: "My mum is a doctor." },
		],
	},
	"e6s-genitive": {
		label: "Besitz wählen",
		entries: [
			{ input: "the bike – Tom", output: "Tom's bike", rule: "Person + 's", example: "Tom's bike is red." },
			{ input: "the room – my sister", output: "my sister's room", rule: "Person + 's", example: "My sister's room is small." },
			{ input: "the car – my parents", output: "my parents' car", rule: "Plural auf -s: nur '", example: "My parents' car is new." },
			{ input: "the toys – the children", output: "the children's toys", rule: "Plural ohne -s: + 's", example: "The children's toys are everywhere." },
			{ input: "the end – the film", output: "the end of the film", rule: "Ding: of-Genitiv", example: "I cried at the end of the film." },
			{ input: "the name – the street", output: "the name of the street", rule: "Ort: of-Genitiv", example: "What's the name of the street?" },
			{ input: "bei – my grandma", output: "at my grandma's", rule: "bei jemandem: at …'s", example: "We stay at my grandma's." },
		],
	},
	"e6s-question-tags": {
		label: "Satz wählen",
		entries: [
			{ input: "It's cold", output: "isn't it?", rule: "bejaht → verneintes Anhängsel", example: "It's cold, isn't it?" },
			{ input: "You like tea", output: "don't you?", rule: "kein Hilfsverb → do", example: "You like tea, don't you?" },
			{ input: "Tom plays chess", output: "doesn't he?", rule: "kein Hilfsverb, he → does", example: "Tom plays chess, doesn't he?" },
			{ input: "She can dance", output: "can't she?", rule: "gleiches Hilfsverb", example: "She can dance, can't she?" },
			{ input: "They aren't here", output: "are they?", rule: "verneint → bejahtes Anhängsel", example: "They aren't here, are they?" },
			{ input: "You saw the film", output: "didn't you?", rule: "simple past → did", example: "You saw the film, didn't you?" },
			{ input: "I'm late", output: "aren't I?", rule: "I am → aren't I", example: "I'm late, aren't I?" },
		],
	},
	"e6s-word-building": {
		label: "Wort wählen",
		entries: [
			{ input: "happy", output: "unhappy", rule: "un- = nicht", example: "Why are you so unhappy?" },
			{ input: "tidy", output: "untidy", rule: "un- = nicht", example: "My room is untidy." },
			{ input: "friendly", output: "unfriendly", rule: "un- = nicht", example: "The dog isn't unfriendly." },
			{ input: "write", output: "rewrite", rule: "re- = wieder", example: "Please rewrite the sentence." },
			{ input: "use", output: "reuse", rule: "re- = wieder", example: "We reuse our bags." },
			{ input: "teach", output: "teacher", rule: "-er = Person", example: "Mr Patel is our teacher." },
			{ input: "play", output: "player", rule: "-er = Person", example: "She's a good player." },
			{ input: "swim", output: "swimmer", rule: "-er, Konsonant verdoppelt", example: "Leo is a fast swimmer." },
			{ input: "print", output: "printer", rule: "-er = Gerät", example: "The printer doesn't work." },
		],
	},
};

export const PAIRS: Record<
	string,
	{ headers: [string, string]; leftLang: "de" | "en"; rows: [string, string, string][] }
> = {
	"e6s-world": {
		headers: ["Country", "Nationality"],
		leftLang: "en",
		rows: [
			["Germany", "German", "I'm from Germany. I'm German."],
			["Britain", "British", "People from England, Scotland and Wales are British."],
			["Scotland", "Scottish", "Ewan is from Edinburgh. He's Scottish."],
			["Ireland", "Irish", "Dublin is in Ireland. Aoife is Irish."],
			["the USA", "American", "New York is in the USA. Jake is American."],
			["Canada", "Canadian", "Ottawa is in Canada. Chloe is Canadian."],
			["Spain", "Spanish", "Maria is from Spain. She speaks Spanish."],
		],
	},
	"e6s-pronouns": {
		headers: ["Subjekt (wer?)", "Objekt (wen? wem?)"],
		leftLang: "en",
		rows: [
			["I", "me", "I like Sam. Sam likes me. – Besitz: my"],
			["you", "you", "You help Ben. Ben helps you. – Besitz: your"],
			["he", "him", "He calls Mia. Mia calls him. – Besitz: his"],
			["she", "her", "She meets Tom. Tom meets her. – Besitz: her"],
			["it", "it", "It's a cat. I feed it. – Besitz: its"],
			["we", "us", "We visit Grandma. Grandma visits us. – Besitz: our"],
			["they", "them", "They are nice. I like them. – Besitz: their"],
		],
	},
	"e6s-language-links": {
		headers: ["Deutsch", "English"],
		leftLang: "de",
		rows: [
			["bekommen", "get", "I get a bike for my birthday. (become = werden!)"],
			["werden", "become", "She wants to become a vet."],
			["froh, glücklich", "happy", "I'm happy when my friends visit me."],
			["Glück haben", "lucky", "We were lucky – it didn't rain."],
			["Auto fahren", "drive", "My uncle drives a taxi."],
			["mit Bus oder Zug fahren", "go by bus / by train", "We go to Hamburg by train."],
			["Rad fahren, reiten", "ride", "I ride my bike to school."],
		],
	},
};

interface ChatLine {
	who: "a" | "b";
	name: string;
	text: string;
	tags: string[];
}

export const DIALOGUES: Record<string, { tags: FocusEntry[]; lines: ChatLine[] }> = {
	"e6s-hello": {
		tags: [
			{ key: "greet", label: "Begrüßen", note: "Greetings: Good morning, Ms Clark. – Hi, I'm Ben." },
			{ key: "introduce", label: "Vorstellen", note: "Introducing: My name is Lena. I'm from Munich. – Nice to meet you." },
			{ key: "offer", label: "Angebot", note: "Offers: Would you like a biscuit? – Yes, please. / No, thank you." },
		],
		lines: [
			{ who: "a", name: "Ms Clark", text: "Good morning, everybody!", tags: ["greet"] },
			{ who: "b", name: "Lena", text: "Good morning, Ms Clark.", tags: ["greet"] },
			{ who: "a", name: "Ben", text: "Hi, I'm Ben. What's your name?", tags: ["greet", "introduce"] },
			{ who: "b", name: "Lena", text: "My name is Lena. I'm from Munich.", tags: ["introduce"] },
			{ who: "a", name: "Ben", text: "Nice to meet you, Lena. Would you like a biscuit?", tags: ["introduce", "offer"] },
			{ who: "b", name: "Lena", text: "Yes, please. Thank you!", tags: ["offer"] },
		],
	},
	"e6s-classroom": {
		tags: [
			{ key: "instruction", label: "Anweisung", note: "Instructions use the imperative: Open your books. Don't write yet!" },
			{ key: "help", label: "Um Hilfe bitten", note: "Ask for help: Sorry, I don't understand. Can you say that again, please?" },
			{ key: "word", label: "Nach einem Wort fragen", note: "Ask for a word: What's 'Radiergummi' in English? How do you spell that?" },
		],
		lines: [
			{ who: "a", name: "Mr Patel", text: "Open your books at page 20, please.", tags: ["instruction"] },
			{ who: "a", name: "Mr Patel", text: "Look at the picture and listen. Don't write yet!", tags: ["instruction"] },
			{ who: "b", name: "Sam", text: "Sorry, I don't understand. Can you say that again, please?", tags: ["help"] },
			{ who: "b", name: "Emma", text: "What's 'Radiergummi' in English?", tags: ["word"] },
			{ who: "a", name: "Mr Patel", text: "It's 'rubber'.", tags: ["word"] },
			{ who: "b", name: "Emma", text: "How do you spell that?", tags: ["word"] },
		],
	},
	"e6s-friends": {
		tags: [
			{ key: "agree", label: "Me too", note: "Agree with a positive sentence: I love drawing. – Me too!" },
			{ key: "either", label: "not … either", note: "Agree with a negative sentence: I don't like loud music. – I don't like it either." },
			{ key: "wish", label: "I'd like (you) to", note: "Wishes: I'd like to go to the cinema. I'd like you to come with me." },
		],
		lines: [
			{ who: "a", name: "Zoe", text: "I love drawing!", tags: ["agree"] },
			{ who: "b", name: "Me", text: "Me too!", tags: ["agree"] },
			{ who: "a", name: "Zoe", text: "I don't like horror films.", tags: ["either"] },
			{ who: "b", name: "Me", text: "I don't like them either.", tags: ["either"] },
			{ who: "a", name: "Zoe", text: "I'd like to go to the cinema on Saturday.", tags: ["wish"] },
			{ who: "b", name: "Me", text: "Great! I'd like you to meet my cousin there.", tags: ["wish"] },
		],
	},
	"e6s-food": {
		tags: [
			{ key: "offer", label: "Anbieten", note: "Offer food: Would you like some chicken? Help yourself!" },
			{ key: "answer", label: "Annehmen, ablehnen", note: "Answer politely: Yes, please. / No, thank you." },
			{ key: "ask", label: "Bitten", note: "Ask for something: Can I have some rice, please? Can you pass me the salt, please?" },
		],
		lines: [
			{ who: "a", name: "Mrs Taylor", text: "Would you like some chicken, Felix?", tags: ["offer"] },
			{ who: "b", name: "Felix", text: "Yes, please.", tags: ["answer"] },
			{ who: "a", name: "Mr Taylor", text: "And some potatoes?", tags: ["offer"] },
			{ who: "b", name: "Felix", text: "No, thank you. Can I have some rice, please?", tags: ["answer", "ask"] },
			{ who: "a", name: "Mrs Taylor", text: "Of course. Help yourself!", tags: ["offer"] },
			{ who: "b", name: "Felix", text: "Can you pass me the salt, please?", tags: ["ask"] },
		],
	},
};

type Role = "s" | "v" | "o" | "p" | "t" | "neg" | "q" | "aux" | "conj" | "f";

export const ROLE_NAMES: Record<Role, string> = {
	s: "Subjekt",
	v: "Verb",
	o: "Objekt",
	p: "Ort",
	t: "Zeit",
	neg: "Verneinung",
	q: "Fragewort",
	aux: "Hilfsverb",
	conj: "Bindewort",
	f: "Häufigkeit",
};

interface BlockMode {
	label: string;
	blocks: [string, Role][];
	note: string;
}

export const BLOCKS: Record<string, BlockMode[]> = {
	"e6s-word-order": [
		{ label: "S-V-O", blocks: [["Lisa", "s"], ["plays", "v"], ["the piano", "o"]], note: "Subject – verb – object: Lisa plays the piano." },
		{ label: "Ort vor Zeit", blocks: [["We", "s"], ["play", "v"], ["football", "o"], ["in the park", "p"], ["after school", "t"]], note: "Place before time: in the park after school." },
		{ label: "Zeit vorn", blocks: [["On Mondays", "t"], ["Lisa", "s"], ["plays", "v"], ["the piano", "o"]], note: "The time can come first – S-V-O stays: On Mondays Lisa plays the piano." },
		{ label: "Häufigkeit", blocks: [["She", "s"], ["often", "f"], ["goes", "v"], ["to the cinema", "p"]], note: "often, always, never stand before the main verb." },
		{ label: "Verneinung", blocks: [["Tom", "s"], ["doesn't", "neg"], ["like", "v"], ["tomatoes", "o"]], note: "doesn't + base form: Tom doesn't like tomatoes." },
	],
	"e6s-questions": [
		{ label: "Fragewort", blocks: [["Where", "q"], ["do", "aux"], ["you", "s"], ["live", "v"], ["?", "o"]], note: "Question word – do/does – subject – base form." },
		{ label: "does", blocks: [["When", "q"], ["does", "aux"], ["the film", "s"], ["start", "v"], ["?", "o"]], note: "After does the verb has no -s: When does the film start?" },
		{ label: "Ja/Nein-Frage", blocks: [["Do", "aux"], ["you", "s"], ["like", "v"], ["pizza", "o"], ["?", "o"]], note: "Yes/no question: Do you like pizza? – Yes, I do." },
		{ label: "mit can", blocks: [["Can", "aux"], ["you", "s"], ["swim", "v"], ["?", "o"]], note: "No do with can: Can you swim? – No, I can't." },
	],
	"e6s-who-whose": [
		{ label: "Subjektfrage", blocks: [["Who", "q"], ["lives", "v"], ["here", "p"], ["?", "o"]], note: "Asking for the subject: no do, verb with -s. Who lives here? – Tom lives here." },
		{ label: "Objektfrage", blocks: [["Who", "q"], ["does", "aux"], ["Sam", "s"], ["like", "v"], ["?", "o"]], note: "Asking for the object: does + subject + base form. Who does Sam like?" },
		{ label: "whose", blocks: [["Whose", "q"], ["phone", "o"], ["is", "v"], ["this", "s"], ["?", "o"]], note: "whose asks for the owner: Whose phone is this? – It's Maya's." },
		{ label: "Präposition am Ende", blocks: [["Where", "q"], ["do", "aux"], ["you", "s"], ["come", "v"], ["from", "p"], ["?", "o"]], note: "The preposition goes to the end: Where do you come from?" },
	],
	"e6s-clauses": [
		{ label: "because", blocks: [["I'm happy", "s"], ["because", "conj"], ["it", "s"], ["is", "v"], ["Friday", "o"]], note: "because gives a reason – and in the clause S-V-O stays: because it is Friday." },
		{ label: "so", blocks: [["The bus is late", "s"], ["so", "conj"], ["we", "s"], ["walk", "v"], ["to school", "p"]], note: "so gives the result: The bus is late, so we walk." },
		{ label: "when", blocks: [["When", "conj"], ["I", "s"], ["get", "v"], ["home", "p"], [",", "o"], ["I", "s"], ["have", "v"], ["a snack", "o"]], note: "A clause at the start gets a comma: When I get home, I have a snack." },
		{ label: "that", blocks: [["I think", "s"], ["(that)", "conj"], ["English", "s"], ["is", "v"], ["easy", "o"]], note: "Object clause with that – you can leave that out: I think English is easy." },
	],
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
	"e6s-progressive": {
		now: 250,
		modes: [
			{ label: "Gerade jetzt", bars: [[200, 300]], dots: [], captions: [{ x: 250, y: 34, text: "is playing the guitar (now)" }], readout: "Listen! Tom is playing the guitar right now." },
			{ label: "Gewohnheit", bars: [], dots: [70, 130, 190, 310, 370], captions: [{ x: 220, y: 34, text: "plays every evening" }], readout: "Tom plays the guitar every evening." },
		],
	},
	"e6s-simple-past": {
		now: 400,
		modes: [
			{ label: "Gestern", bars: [], dots: [330], captions: [{ x: 330, y: 104, text: "yesterday" }, { x: 300, y: 34, text: "went to London" }], readout: "We went to London yesterday." },
			{ label: "Vor zwei Tagen", bars: [], dots: [250], captions: [{ x: 250, y: 104, text: "two days ago" }, { x: 250, y: 34, text: "saw a fox" }], readout: "I saw a fox two days ago." },
			{ label: "Letzte Woche", bars: [[80, 200]], dots: [], captions: [{ x: 140, y: 104, text: "last week" }, { x: 140, y: 34, text: "was ill all week" }], readout: "Last week I was ill." },
		],
	},
	"e6s-going-to": {
		now: 150,
		modes: [
			{ label: "Plan", bars: [], dots: [150, 340], arrow: [160, 330], captions: [{ x: 120, y: 104, text: "decided now" }, { x: 340, y: 34, text: "visit Grandma (next Saturday)" }], readout: "I'm going to visit my grandma next Saturday." },
			{ label: "Vorhersage", bars: [], dots: [150, 230], arrow: [160, 220], captions: [{ x: 120, y: 104, text: "black clouds now" }, { x: 250, y: 34, text: "rain (soon)" }], readout: "Look at those black clouds! It's going to rain." },
		],
	},
};

export const FREQUENCY: { key: string; label: string; days: number[]; sentence: string }[] = [
	{ key: "always", label: "always", days: [0, 1, 2, 3, 4, 5, 6], sentence: "Chloe always brushes her teeth in the morning." },
	{ key: "usually", label: "usually", days: [0, 1, 2, 3, 4], sentence: "Chloe usually walks to school." },
	{ key: "often", label: "often", days: [0, 2, 4], sentence: "Chloe often goes to the swimming club." },
	{ key: "sometimes", label: "sometimes", days: [5], sentence: "Chloe sometimes visits her grandma." },
	{ key: "never", label: "never", days: [], sentence: "Chloe never watches TV before she finishes her homework." },
];
const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const SIGNS: (FocusEntry & { kind: "can" | "must" | "mustnt" | "neednt"; symbol: string; meaning: string })[] = [
	{ key: "can", kind: "can", symbol: "✓", meaning: "können, dürfen", label: "can", note: "Children can play here. – can: Fähigkeit oder Erlaubnis." },
	{ key: "must", kind: "must", symbol: "!", meaning: "müssen", label: "must", note: "You must have a shower before you swim. – must: Pflicht." },
	{ key: "mustnt", kind: "mustnt", symbol: "✕", meaning: "nicht dürfen", label: "mustn't", note: "You mustn't run near the pool. – mustn't: Verbot!" },
	{ key: "neednt", kind: "neednt", symbol: "○", meaning: "nicht müssen", label: "needn't", note: "You needn't bring a towel. – needn't: keine Pflicht." },
];

interface LayoutZone {
	id: string;
	label: string;
	box: [number, number, number, number];
	text: string;
	note: string;
}

export const LAYOUTS: Record<string, { title: string; zones: LayoutZone[] }> = {
	"e6s-reading": {
		title: "Postcard",
		zones: [
			{ id: "greeting", label: "Anrede", box: [20, 20, 240, 30], text: "Dear Grandma,", note: "A postcard starts with Dear … or Hi …" },
			{ id: "text", label: "Text", box: [20, 58, 240, 120], text: "Greetings from Oxford! It's sunny …", note: "The text: where you are, the weather and what you do." },
			{ id: "closing", label: "Grußformel", box: [20, 186, 240, 26], text: "Love,", note: "A closing: Love, Best wishes or See you soon." },
			{ id: "name", label: "Name", box: [20, 216, 240, 24], text: "Paula", note: "Your name comes last." },
			{ id: "address", label: "Adresse", box: [290, 100, 150, 110], text: "Mrs Ann Smith …", note: "The address is on the right." },
			{ id: "stamp", label: "Briefmarke", box: [380, 20, 60, 60], text: "stamp", note: "The stamp goes at the top on the right." },
		],
	},
	"e6s-writing": {
		title: "Email",
		zones: [
			{ id: "greeting", label: "Anrede", box: [20, 16, 420, 28], text: "Hi Sam,", note: "Start with Hi … or Dear …" },
			{ id: "opening", label: "Einstieg", box: [20, 50, 420, 32], text: "Thanks for your email and the photos!", note: "A friendly opening: Thanks for your email. How are you?" },
			{ id: "body", label: "Hauptteil", box: [20, 88, 420, 70], text: "I've got news too: … Last weekend I …", note: "The body: your news in paragraphs." },
			{ id: "question", label: "Fragen", box: [20, 164, 420, 28], text: "What music do you like?", note: "Ask questions back – it's a conversation." },
			{ id: "closing", label: "Schluss", box: [20, 198, 420, 42], text: "Write soon! Best wishes, Noah", note: "End with Write soon!, a closing (Love, Best wishes) and your name." },
		],
	},
	"e6s-mediation": {
		title: "Leisure centre website",
		zones: [
			{ id: "title", label: "Name", box: [20, 14, 420, 30], text: "Riverside Leisure Centre", note: "The name tells you where the information comes from." },
			{ id: "times", label: "Öffnungszeiten", box: [20, 52, 200, 80], text: "Mon–Fri 7 a.m.–9 p.m. · Sat/Sun 8 a.m.–6 p.m.", note: "Opening times: at weekends 8 a.m. to 6 p.m. – that's 8 bis 18 Uhr." },
			{ id: "prices", label: "Preise", box: [230, 52, 210, 80], text: "adults £5 · children £3 · family £14", note: "Prices: the family ticket (£14) is cheaper than four single tickets (£16)." },
			{ id: "slide", label: "Angebot", box: [20, 140, 200, 46], text: "big slide: weekends 10–4", note: "The slide is open at weekends from 10 a.m. to 4 p.m. only." },
			{ id: "rules", label: "Hinweis", box: [230, 140, 210, 46], text: "bring a padlock", note: "Bring a padlock – a small lock – for the lockers." },
			{ id: "cafe", label: "Extra", box: [20, 194, 420, 34], text: "Café on the first floor", note: "Not everything is important: the café is extra information." },
		],
	},
};

export const SOUND_PAIRS: (FocusEntry & { a: [string, string]; b: [string, string] })[] = [
	{ key: "ship", label: "ship – sheep", a: ["ship", "/ʃɪp/"], b: ["sheep", "/ʃiːp/"], note: "Short [ɪ] in ship, long [iː] in sheep – the colon means long." },
	{ key: "bed", label: "bed – bad", a: ["bed", "/bed/"], b: ["bad", "/bæd/"], note: "[e] in bed, open [æ] in bad." },
	{ key: "think", label: "think – sink", a: ["think", "/θɪŋk/"], b: ["sink", "/sɪŋk/"], note: "[θ]: the tongue between your teeth. [s]: the tongue behind your teeth." },
	{ key: "west", label: "west – vest", a: ["west", "/west/"], b: ["vest", "/vest/"], note: "[w]: round lips. [v]: top teeth on your bottom lip." },
	{ key: "up", label: "Do you like tea? ↗", a: ["Do you like tea?", "↗"], b: ["Can you swim?", "↗"], note: "Yes/no questions: your voice goes up at the end." },
	{ key: "down", label: "Where do you live? ↘", a: ["Where do you live?", "↘"], b: ["What's your name?", "↘"], note: "Questions with a question word: your voice usually goes down." },
];

export const RHYME_FOCUS: FocusEntry[] = [
	{ key: "star", label: "star – are", note: "Lines 1 and 2 rhyme: star – are." },
	{ key: "sky", label: "high – sky", note: "Lines 3 and 4 rhyme: high – sky." },
	{ key: "beat", label: "Rhythmus", note: "TWIN-kle, TWIN-kle, LIT-tle STAR: stressed and unstressed syllables take turns." },
];
const VERSE: { text: string; rhyme: string; keys: string[] }[] = [
	{ text: "Twinkle, twinkle, little", rhyme: "star,", keys: ["star", "beat"] },
	{ text: "How I wonder what you", rhyme: "are!", keys: ["star"] },
	{ text: "Up above the world so", rhyme: "high,", keys: ["sky"] },
	{ text: "Like a diamond in the", rhyme: "sky.", keys: ["sky"] },
];

export const MOODS: (FocusEntry & { mouth: string; brows: string })[] = [
	{ key: "excited", label: "excited", mouth: "M-12 6 Q0 18 12 6 Z", brows: "M-12 -14 l8 -3 M4 -17 l8 3", note: "'Guess what – I've got two tickets! I'm so excited!'" },
	{ key: "happy", label: "happy", mouth: "M-10 6 Q0 14 10 6", brows: "M-12 -14 h8 M4 -14 h8", note: "'Thanks, that's great!' – She sounds happy." },
	{ key: "worried", label: "worried", mouth: "M-9 10 Q0 4 9 10", brows: "M-12 -12 l8 -4 M4 -16 l8 4", note: "'Oh no, I can't find my ticket!' – She sounds worried." },
	{ key: "sad", label: "sad", mouth: "M-10 12 Q0 2 10 12", brows: "M-12 -14 l8 2 M4 -12 l8 -2", note: "'The trip is cancelled.' – He sounds sad and disappointed." },
	{ key: "angry", label: "angry", mouth: "M-10 10 h20", brows: "M-12 -18 l8 5 M4 -13 l8 -5", note: "'Stop that! It's my sandwich!' – He sounds angry." },
];

/* ------------------------------------------------------------------ */
/* Rendering.                                                          */
/* ------------------------------------------------------------------ */

function renderTransform(lessonId: string): string {
	const data = TRANSFORMS[lessonId];
	if (!data) return "";
	const first = data.entries[0];
	return `<div class="transform-explorer"><label>${esc(data.label)} <select data-transform>${data.entries
		.map((entry, index) => `<option value="${index}" lang="en">${esc(entry.input)}</option>`)
		.join("")}</select></label><div class="transform-machine" aria-live="polite"><span class="transform-in" lang="en">${esc(first.input)}</span><span class="transform-gear" aria-hidden="true">⚙</span><span class="transform-out" lang="en">${esc(first.output)}</span></div><p class="small"><strong>Regel:</strong> <span data-transform-rule>${esc(first.rule)}</span> · <span lang="en" data-transform-example>${esc(first.example)}</span></p></div>`;
}

function renderPairs(lessonId: string): string {
	const data = PAIRS[lessonId];
	if (!data) return "";
	const active = data.rows[0][0];
	return `<div class="pairs-explorer" data-focus-root="pairs" data-focus-mode="dim">${focusButtons(
		data.rows.map(([left, right, note]) => ({ key: left, label: `${left} – ${right}`, note })),
		active,
		"Paar wählen",
	)}<div class="pairs-table" role="table"><div class="pairs-row pairs-head" role="row"><span role="columnheader">${esc(data.headers[0])}</span><span role="columnheader">${esc(data.headers[1])}</span></div>${data.rows
		.map(
			([left, right]) =>
				`<div class="pairs-row" role="row" ${item(left, active, "dim")}><span role="cell" lang="${data.leftLang}">${esc(left)}</span><span role="cell" lang="en">${esc(right)}</span></div>`,
		)
		.join("")}</div>${readout(data.rows[0][2])}</div>`;
}

function renderDialogue(lessonId: string): string {
	const data = DIALOGUES[lessonId];
	if (!data) return "";
	const active = data.tags[0].key;
	return `<div class="chat-explorer" data-focus-root="chat" data-focus-mode="dim">${focusButtons(data.tags, active, "Redemittel hervorheben")}<div class="chat" lang="en">${data.lines
		.map(
			(line) =>
				`<div class="bubble bubble-${line.who}" ${item(line.tags, active, "dim")}><span class="speaker">${esc(line.name)}</span>${esc(line.text)}</div>`,
		)
		.join("")}</div>${readout(data.tags[0].note)}</div>`;
}

function renderNumber(): string {
	const start = dateSentence(22, 5);
	return `<div class="number-explorer"><div class="date-controls"><label for="date-day">Tag (1–31)<input id="date-day" type="range" min="1" max="31" value="22"></label><label for="date-month">Monat<select id="date-month">${MONTHS.map((month, index) => `<option value="${index}" lang="en"${index === 5 ? " selected" : ""}>${month}</option>`).join("")}</select></label></div><div class="date-card" aria-hidden="true"><span class="date-month" data-date-month>${MONTHS[5]}</span><span class="date-day" data-date-day>${ordinal(22)}</span></div><p class="explorer-readout" lang="en" aria-live="polite"><span data-date-written>${esc(start.written)}</span><br><span class="small" data-date-spoken>Say: ${esc(start.spoken)}</span></p><p class="small">1st, 2nd, 3rd – aber 11th, 12th, 13th. Ab 4 meist -th: fourth, fifth, twelfth, twentieth.</p></div>`;
}

function renderClock(): string {
	const ticks = Array.from(
		{ length: 12 },
		(_, i) =>
			`<text x="${Math.round((110 + 78 * Math.sin((i * Math.PI) / 6)) * 10) / 10}" y="${Math.round((115 - 78 * Math.cos((i * Math.PI) / 6)) * 10) / 10}" text-anchor="middle">${i || 12}</text>`,
	).join("");
	return `<div class="clock-explorer"><svg viewBox="0 0 220 220" role="img" aria-label="Uhr zum Einstellen"><circle cx="110" cy="110" r="96" class="clock-face"/><path class="clock-past" d="M110 14 A96 96 0 0 1 110 206 L110 110 Z"/><path class="clock-to" d="M110 206 A96 96 0 0 1 110 14 L110 110 Z"/>${ticks}<text class="clock-zone" x="150" y="140">past</text><text class="clock-zone" x="48" y="140">to</text><line id="hour-hand" x1="110" y1="110" x2="110" y2="62"/><line id="minute-hand" x1="110" y1="110" x2="110" y2="30"/><circle cx="110" cy="110" r="5" class="clock-pin"/></svg><div class="clock-controls"><label for="clock-hour">Stunde (0–23)<input id="clock-hour" type="range" min="0" max="23" value="15"></label><label for="clock-minute">Minuten<input id="clock-minute" type="range" min="0" max="55" step="5" value="30"></label><p class="explorer-readout" id="clock-readout" lang="en" aria-live="polite"></p></div></div>`;
}

function renderFamily(): string {
	const people: [string, string, number, number, string[]][] = [
		["grandma", "Grandma Rose", 110, 30, ["me", "tom", "lucy"]],
		["grandpa", "Grandpa Bill", 250, 30, ["me", "tom", "lucy"]],
		["mum", "Mum (Sue)", 115, 100, ["me", "tom"]],
		["aunt", "Aunt Kate", 340, 100, ["me", "lucy"]],
		["me", "me (Lena)", 60, 170, ["me", "tom", "lucy"]],
		["tom", "Tom", 170, 170, ["me", "tom", "lucy"]],
		["lucy", "Lucy", 340, 170, ["me", "tom", "lucy"]],
	];
	const views: FocusEntry[] = [
		{ key: "me", label: "Lena: my …", note: "Lena: Tom is my brother. Kate is my aunt. Lucy is my cousin." },
		{ key: "tom", label: "about Tom: his …", note: "Tom has got a sister: his sister is Lena. His grandparents are Rose and Bill." },
		{ key: "lucy", label: "about Lucy: her …", note: "Lucy is Kate's daughter: her mum is Kate. Her cousins are Lena and Tom." },
		{ key: "their", label: "Lena and Tom: their …", note: "Lena and Tom: their mum is Sue. Their cousin is Lucy." },
	];
	const active = "me";
	const owner = (key: string) =>
		key === "their" ? ["me", "tom"] : [key];
	return `<div class="family-explorer" data-focus-root="family" data-focus-mode="hide">${focusButtons(views, active, "Blickwinkel wählen")}<svg viewBox="0 0 440 210" role="img" aria-label="Stammbaum: Großeltern Rose und Bill; ihre Töchter Sue und Kate. Sue hat zwei Kinder, Lena und Tom; Kate hat eine Tochter, Lucy.">
	<path class="tree-line" d="M160 30 H200 M180 30 V66 H115 V84 M180 66 H340 V84 M115 116 V136 H60 V154 M115 136 H170 V154 M340 116 V154"/>
	${people
		.map(([key, name, x, y]) => {
			const owners = views.filter((view) => owner(view.key).includes(key)).map((view) => view.key);
			return `<g class="person-node node-${key}"><rect x="${x - 50}" y="${y - 16}" width="100" height="32" rx="10" class="node-box"/><rect x="${x - 50}" y="${y - 16}" width="100" height="32" rx="10" class="node-owner" ${item(owners, active, "hide")}/><text x="${x}" y="${y + 5}" text-anchor="middle" lang="en">${esc(name)}</text></g>`;
		})
		.join("")}
	</svg>${readout(views[0].note)}<p class="small">Der gelb umrandete Kasten zeigt, wer spricht oder über wen gesprochen wird.</p></div>`;
}

function renderRoom(): string {
	const spots: FocusEntry[] = [
		{ key: "on", label: "on", note: "The lamp is on the desk." },
		{ key: "under", label: "under", note: "The cat is under the bed." },
		{ key: "between", label: "between", note: "The ball is between the bed and the desk." },
		{ key: "above", label: "above", note: "The poster is above the bed." },
		{ key: "next", label: "next to", note: "The wardrobe is next to the door." },
		{ key: "in", label: "in front of", note: "The chair is in front of the desk." },
	];
	const active = "under";
	return `<div class="room-explorer" data-focus-root="room" data-focus-mode="dim">${focusButtons(spots, active, "Präposition wählen")}<svg viewBox="0 0 460 230" role="img" aria-label="Kinderzimmer: Bett mit Poster darüber, Katze unter dem Bett, Ball zwischen Bett und Schreibtisch, Lampe auf dem Schreibtisch, Stuhl vor dem Schreibtisch, Schrank neben der Tür.">
	<rect width="460" height="230" rx="14" class="room-wall"/><rect y="190" width="460" height="40" class="room-floor"/>
	<rect class="room-window" x="180" y="30" width="70" height="56" rx="4"/>
	<rect class="room-door" x="400" y="70" width="46" height="120"/>
	<g ${item("next", active, "dim")}><rect class="room-wardrobe" x="330" y="60" width="64" height="130"/><text class="room-label" x="362" y="56" text-anchor="middle">wardrobe</text></g>
	<rect class="room-bed" x="20" y="140" width="130" height="40" rx="6"/><rect class="room-pillow" x="26" y="130" width="34" height="16" rx="5"/><text class="room-label" x="85" y="206" text-anchor="middle">bed</text>
	<g ${item("above", active, "dim")}><rect class="room-poster" x="50" y="50" width="70" height="50" rx="3"/><text class="room-label" x="85" y="80" text-anchor="middle">poster</text></g>
	<g ${item("under", active, "dim")}><ellipse class="room-cat" cx="80" cy="186" rx="18" ry="6"/><circle class="room-cat" cx="64" cy="181" r="6"/><text class="room-label" x="120" y="200">cat</text></g>
	<rect class="room-desk" x="200" y="128" width="110" height="10"/><rect class="room-desk" x="206" y="138" width="8" height="52"/><rect class="room-desk" x="296" y="138" width="8" height="52"/><text class="room-label" x="255" y="122" text-anchor="middle">desk</text>
	<g ${item("on", active, "dim")}><path class="room-lamp" d="M282 128 v-22 l-10 -10 h24 l-10 10"/><text class="room-label" x="296" y="94">lamp</text></g>
	<g ${item("in", active, "dim")}><rect class="room-chair" x="230" y="160" width="40" height="8"/><rect class="room-chair" x="232" y="168" width="5" height="22"/><rect class="room-chair" x="263" y="168" width="5" height="22"/><text class="room-label" x="250" y="210" text-anchor="middle">chair</text></g>
	<g ${item("between", active, "dim")}><circle class="room-ball" cx="174" cy="178" r="11"/><text class="room-label" x="174" y="160" text-anchor="middle">ball</text></g>
	</svg>${readout(spots[1].note)}</div>`;
}

function renderDistance(): string {
	const modes: FocusEntry[] = [
		{ key: "this", label: "this (nah, eins)", note: "This book here is mine." },
		{ key: "these", label: "these (nah, mehrere)", note: "These biscuits here are fresh." },
		{ key: "that", label: "that (fern, eins)", note: "Look at that ship over there!" },
		{ key: "those", label: "those (fern, mehrere)", note: "Look at those birds in the sky!" },
	];
	const active = "this";
	return `<div class="distance-explorer" data-focus-root="distance" data-focus-mode="dim">${focusButtons(modes, active, "Wort wählen")}<svg viewBox="0 0 460 190" role="img" aria-label="Eine Person zeigt: Nah bei ihr liegen ein Buch und mehrere Kekse, weit weg fährt ein Schiff, und mehrere Vögel fliegen.">
	<rect width="460" height="190" rx="14" class="sky"/><rect y="150" width="460" height="40" class="field"/>
	<line x1="200" y1="20" x2="200" y2="180" class="distance-line"/><text class="room-label" x="100" y="22" text-anchor="middle">near · nah</text><text class="room-label" x="330" y="22" text-anchor="middle">far · fern</text>
	<circle cx="40" cy="106" r="12" class="person-fill"/><rect x="30" y="118" width="20" height="32" rx="6" class="person-fill"/><path d="M50 124 L76 116" class="pointer"/>
	<g ${item("this", active, "dim")}><rect x="86" y="118" width="34" height="26" rx="3" class="book"/><text class="room-label" x="103" y="168" text-anchor="middle">this book</text></g>
	<g ${item("these", active, "dim")}><circle cx="140" cy="138" r="8" class="biscuit"/><circle cx="160" cy="138" r="8" class="biscuit"/><circle cx="180" cy="138" r="8" class="biscuit"/><text class="room-label" x="160" y="168" text-anchor="middle">these biscuits</text></g>
	<g ${item("that", active, "dim")}><path d="M260 140 h70 l-12 14 h-46 Z" class="ship"/><rect x="286" y="122" width="16" height="18" class="ship"/><text class="room-label" x="296" y="178" text-anchor="middle">that ship</text></g>
	<g ${item("those", active, "dim")}><path d="M350 60 q8 -8 16 0 q8 -8 16 0 M390 44 q8 -8 16 0 q8 -8 16 0 M360 90 q6 -6 12 0 q6 -6 12 0" class="birds"/><text class="room-label" x="390" y="112" text-anchor="middle">those birds</text></g>
	</svg>${readout(modes[0].note)}</div>`;
}

function renderQuantities(): string {
	const modes: FocusEntry[] = [
		{ key: "many", label: "zählbar: many", note: "How many apples have we got? – Five. There aren't many eggs." },
		{ key: "much", label: "unzählbar: much", note: "How much milk is there? – Not much. Rice, juice and homework are uncountable too." },
		{ key: "lot", label: "bejaht: a lot of", note: "We've got a lot of apples and a lot of milk." },
	];
	const active = "many";
	const apples = [0, 1, 2, 3, 4].map((i) => `<circle cx="${40 + i * 24}" cy="120" r="10" class="apple"/>`).join("");
	const eggs = [0, 1].map((i) => `<ellipse cx="${60 + i * 26}" cy="158" rx="8" ry="10" class="egg"/>`).join("");
	return `<div class="quantity-explorer" data-focus-root="quantity" data-focus-mode="dim">${focusButtons(modes, active, "Mengenwort wählen")}<svg viewBox="0 0 460 200" role="img" aria-label="Links zählbare Lebensmittel: fünf Äpfel und zwei Eier. Rechts unzählbare: Milch, Reis und Saft.">
	<rect width="460" height="200" rx="14" class="room-wall"/>
	<text class="room-label strong" x="110" y="30" text-anchor="middle">countable · zählbar</text><text class="room-label strong" x="340" y="30" text-anchor="middle">uncountable · unzählbar</text>
	<line x1="226" y1="20" x2="226" y2="190" class="distance-line"/>
	<g ${item(["many", "lot"], active, "dim")}>${apples}${eggs}<text class="room-label" x="110" y="190" text-anchor="middle">apples, eggs</text></g>
	<g ${item(["much", "lot"], active, "dim")}><rect x="260" y="90" width="34" height="70" rx="4" class="milk"/><text class="room-label" x="277" y="130" text-anchor="middle">milk</text><path d="M310 160 q30 -40 60 0 Z" class="rice"/><text class="room-label" x="340" y="176" text-anchor="middle">rice</text><rect x="388" y="100" width="30" height="60" rx="6" class="juice"/><text class="room-label" x="403" y="190" text-anchor="middle">juice</text></g>
	</svg>${readout(modes[0].note)}</div>`;
}

const ROLE_ORDER: Role[] = ["s", "v", "o", "p", "t", "f", "neg", "q", "aux", "conj"];

function renderBlocks(lessonId: string): string {
	const modes = BLOCKS[lessonId];
	if (!modes) return "";
	const active = "0";
	const used = ROLE_ORDER.filter((role) =>
		modes.some((mode) => mode.blocks.some(([, r]) => r === role)),
	);
	return `<div class="blocks-explorer" data-focus-root="blocks" data-focus-mode="hide">${focusButtons(
		modes.map((mode, index) => ({ key: String(index), label: mode.label, note: mode.note })),
		active,
		"Satzbau wählen",
	)}<div class="block-stage">${modes
		.map(
			(mode, index) =>
				`<div class="block-row" lang="en" ${item(String(index), active, "hide")}>${mode.blocks
					.map(([text, role]) => `<span class="block block-${role}" title="${ROLE_NAMES[role]}">${esc(text)}</span>`)
					.join("")}</div>`,
		)
		.join("")}</div><ul class="block-legend" aria-label="Farblegende">${used
		.map((role) => `<li><span class="block block-${role}">${ROLE_NAMES[role]}</span></li>`)
		.join("")}</ul>${readout(modes[0].note)}</div>`;
}

function renderTimeline(lessonId: string): string {
	const data = TIMELINES[lessonId];
	if (!data) return "";
	const active = "0";
	return `<div class="timeline-explorer" data-focus-root="timeline" data-focus-mode="hide">${focusButtons(
		data.modes.map((mode, index) => ({ key: String(index), label: mode.label, note: mode.readout })),
		active,
		"Zeitform umschalten",
	)}<svg viewBox="0 0 460 120" role="img" aria-label="Zeitstrahl von der Vergangenheit über jetzt in die Zukunft">
		<line x1="28" y1="70" x2="432" y2="70" class="timeline-axis"/>
		<polygon points="432,65 444,70 432,75" class="timeline-arrow"/>
		<line x1="${data.now}" y1="56" x2="${data.now}" y2="84" class="timeline-now"/>
		<text x="${data.now}" y="100" text-anchor="middle" class="timeline-label">NOW</text>
		${data.modes
			.map(
				(mode, index) =>
					`<g ${item(String(index), active, "hide")}>${mode.bars
						.map(([from, to]) => `<rect x="${from}" y="58" width="${to - from}" height="24" rx="12" class="timeline-bar"/>`)
						.join("")}${mode.dots
						.map((x) => `<circle cx="${x}" cy="70" r="9" class="timeline-dot"/>`)
						.join("")}${
						mode.arrow
							? `<path d="M${mode.arrow[0]} 48 Q${(mode.arrow[0] + mode.arrow[1]) / 2} 30 ${mode.arrow[1]} 48" class="timeline-bridge"/>`
							: ""
					}${mode.captions
						.map((caption) => `<text x="${caption.x}" y="${caption.y}" text-anchor="middle" class="timeline-text">${esc(caption.text)}</text>`)
						.join("")}</g>`,
			)
			.join("")}
	</svg>${readout(data.modes[0].readout)}</div>`;
}

function renderFrequency(): string {
	const active = "usually";
	return `<div class="frequency-explorer" data-focus-root="frequency" data-focus-mode="hide">${focusButtons(
		FREQUENCY.map((entry) => ({ key: entry.key, label: entry.label, note: entry.sentence })),
		active,
		"Häufigkeit wählen",
	)}${FREQUENCY.map(
		(entry) =>
			`<div class="week" ${item(entry.key, active, "hide")}>${WEEK.map(
				(day, index) =>
					`<span class="week-day${entry.days.includes(index) ? " on" : ""}"><span class="week-dot" aria-hidden="true">${entry.days.includes(index) ? "●" : "○"}</span><span lang="en">${day}</span></span>`,
			).join("")}<span class="week-count">${entry.days.length}/7</span></div>`,
	).join("")}${readout(FREQUENCY.find((entry) => entry.key === active)!.sentence)}</div>`;
}

function renderSigns(): string {
	const active = "mustnt";
	return `<div class="signs-explorer" data-focus-root="signs" data-focus-mode="dim">${focusButtons(SIGNS, active, "Modalverb wählen")}<div class="sign-row">${SIGNS.map(
		(sign) =>
			`<div class="sign sign-${sign.kind}" ${item(sign.key, active, "dim")}><span class="sign-symbol" aria-hidden="true">${sign.symbol}</span><strong lang="en">${esc(sign.label)}</strong><span class="small">${esc(sign.meaning)}</span></div>`,
	).join("")}</div>${readout(SIGNS.find((sign) => sign.key === active)!.note)}</div>`;
}

function renderSchedule(): string {
	const x = (hour: number) => Math.round((60 + (hour - 8) * 44) * 10) / 10;
	const rows: [string, [number, number, string, string][]][] = [
		[
			"uk",
			[
				[8.75, 9, "reg.", "b-travel"],
				[9, 10.75, "lessons", "b-class"],
				[10.75, 11, "", "b-lunch"],
				[11, 12.5, "lessons", "b-class"],
				[12.5, 13.25, "lunch", "b-lunch"],
				[13.25, 15.25, "lessons", "b-class"],
				[15.25, 16.5, "art club", "b-club"],
			],
		],
		[
			"de",
			[
				[8, 13, "Unterricht mit Pausen", "b-class"],
				[13.25, 14, "lunch", "b-lunch"],
				[14, 15.5, "homework", "b-home"],
				[16, 17, "club", "b-club"],
			],
		],
	];
	const active = "uk";
	return `<div class="schedule-explorer" data-focus-root="schedule" data-focus-mode="dim">${focusButtons(
		[
			{ key: "uk", label: "Amy, Leeds", note: "Amy: registration at 8:45, break at 10:45, lunch at 12:30, school ends at 3:15; on Wednesdays art club until 4:30." },
			{ key: "de", label: "Beispiel Bayern", note: "Example from Bavaria: lessons until one o'clock, lunch at home, homework, then a club." },
		],
		active,
		"Schultag wählen",
	)}<svg viewBox="0 0 480 130" role="img" aria-label="Zwei Schultage von 8 bis 17 Uhr im Vergleich">
		${[8, 10, 12, 14, 16].map((hour) => `<line x1="${x(hour)}" y1="14" x2="${x(hour)}" y2="108" class="grid-line"/><text x="${x(hour)}" y="124" text-anchor="middle" class="month-label">${hour}:00</text>`).join("")}
		${rows
			.map(
				([key, blocks], rowIndex) =>
					`<g ${item(key, active, "dim")}><text x="4" y="${rowIndex * 48 + 42}" class="lane-name">${key === "uk" ? "UK" : "DE"}</text>${blocks
						.map(
							([from, to, label, kind]) =>
								`<rect x="${x(from)}" y="${rowIndex * 48 + 20}" width="${Math.round((x(to) - x(from)) * 10) / 10}" height="34" rx="6" class="${kind}"/>${label ? `<text x="${Math.round(((x(from) + x(to)) / 2) * 10) / 10}" y="${rowIndex * 48 + (x(to) - x(from) < 36 ? 15 : 42)}" text-anchor="middle" class="block-label">${esc(label)}</text>` : ""}`,
						)
						.join("")}</g>`,
			)
			.join("")}
	</svg>${readout("Amy: registration at 8:45, break at 10:45, lunch at 12:30, school ends at 3:15; on Wednesdays art club until 4:30.")}</div>`;
}

function renderShop(): string {
	const bill = shopBill([1, 2, 0, 0, 0], 2000);
	return `<div class="shop-explorer"><div class="shop-shelf">${SHOP_ITEMS.map(
		(entry, index) =>
			`<label class="shop-item"><span class="shop-name" lang="en">${esc(entry.name)}</span><span class="price-tag" lang="en">${formatPrice(entry.pence)}</span><select data-shop-qty="${index}" aria-label="Anzahl ${esc(entry.name)}">${[0, 1, 2, 3].map((n) => `<option value="${n}"${(index === 0 && n === 1) || (index === 1 && n === 2) ? " selected" : ""}>${n}</option>`).join("")}</select></label>`,
	).join("")}</div><label class="shop-pay">Du bezahlst mit <select data-shop-note>${NOTES.map((note) => `<option value="${note}"${note === 2000 ? " selected" : ""}>${formatPrice(note)}</option>`).join("")}</select></label><p class="explorer-readout" lang="en" aria-live="polite"><span data-shop-total>${esc(bill.totalText)}</span><br><span data-shop-change>${esc(bill.changeText)}</span></p><p class="small">Geschrieben steht zwischen Pfund und Pence ein Punkt: £2.50 heißt two pounds fifty.</p></div>`;
}

function renderOutfit(): string {
	const parts: FocusEntry[] = [
		{ key: "cap", label: "cap", note: "She's wearing a red cap." },
		{ key: "scarf", label: "scarf", note: "She's wearing a yellow scarf." },
		{ key: "hoodie", label: "hoodie", note: "She's wearing a green hoodie." },
		{ key: "jeans", label: "jeans", note: "She's wearing blue jeans. (jeans = Plural)" },
		{ key: "trainers", label: "trainers", note: "She's wearing white trainers." },
	];
	const active = "cap";
	return `<div class="outfit-explorer" data-focus-root="outfit" data-focus-mode="dim">${focusButtons(parts, active, "Kleidungsstück wählen")}<svg viewBox="0 0 300 260" role="img" aria-label="Mädchen mit roter Kappe, gelbem Schal, grünem Kapuzenpulli, blauer Jeans und weißen Turnschuhen.">
	<rect width="300" height="260" rx="14" class="room-wall"/>
	<circle cx="150" cy="56" r="24" class="person-fill"/>
	<g ${item("cap", active, "dim")}><path d="M124 50 a26 22 0 0 1 52 0 Z" class="c-cap"/><rect x="166" y="46" width="26" height="6" rx="3" class="c-cap"/></g>
	<g ${item("hoodie", active, "dim")}><path d="M114 88 h72 l14 70 h-20 l-4 -40 v46 h-52 v-46 l-4 40 h-20 Z" class="c-hoodie"/></g>
	<g ${item("scarf", active, "dim")}><rect x="126" y="80" width="48" height="12" rx="6" class="c-scarf"/><rect x="160" y="88" width="10" height="34" rx="4" class="c-scarf"/></g>
	<g ${item("jeans", active, "dim")}><path d="M124 164 h52 l-4 70 h-18 l-4 -50 l-4 50 h-18 Z" class="c-jeans"/></g>
	<g ${item("trainers", active, "dim")}><rect x="120" y="234" width="30" height="12" rx="5" class="c-trainers"/><rect x="152" y="234" width="30" height="12" rx="5" class="c-trainers"/></g>
	</svg>${readout(parts[0].note)}</div>`;
}

export function renderCalendar(year: number): string {
	const active = "bonfire";
	return `<div class="calendar-explorer" data-focus-root="calendar" data-focus-mode="dim" data-year="${year}">
	<div class="calendar-year"><button type="button" class="icon-button" data-calendar-shift="-1" aria-label="Vorheriges Jahr">◀</button><strong data-calendar-year>${year}</strong><button type="button" class="icon-button" data-calendar-shift="1" aria-label="Nächstes Jahr">▶</button></div>
	${focusButtons(
		FESTIVALS.map((festival) => ({ key: festival.id, label: festival.name, note: festivalNote(festival, year) })),
		active,
		"Fest wählen",
	)}
	<svg viewBox="0 0 472 130" role="img" aria-label="Jahreskalender mit Festen im Vereinigten Königreich">
		${MONTHS.map(
			(month, index) =>
				`<rect x="${20 + index * 36}" y="48" width="34" height="34" rx="6" class="month${index % 2 ? " month-alt" : ""}"/><text x="${37 + index * 36}" y="69" text-anchor="middle" class="month-label">${month.slice(0, 3)}</text>`,
		).join("")}
		${FESTIVALS.map((festival) => {
			const x = calendarX(festival.month, festival.day);
			const y = festival.lane ? 104 : 26;
			return `<g ${item(festival.id, active, "dim")}><line x1="${x}" y1="${festival.lane ? 82 : 48}" x2="${x}" y2="${festival.lane ? 94 : 36}" class="grid-line"/><circle cx="${x}" cy="${y}" r="10" class="holiday holiday-${festival.id}"/><text x="${x}" y="${y + 4}" text-anchor="middle" class="holiday-day">${festival.day}</text></g>`;
		}).join("")}
	</svg>${readout(festivalNote(FESTIVALS.find((festival) => festival.id === active)!, year))}</div>`;
}

function renderMoods(): string {
	const active = "excited";
	return `<div class="moods-explorer" data-focus-root="moods" data-focus-mode="dim">${focusButtons(MOODS, active, "Gefühl wählen")}<svg viewBox="0 0 460 110" role="img" aria-label="Fünf Gesichter: excited, happy, worried, sad, angry">${MOODS.map(
		(mood, index) =>
			`<g transform="translate(${50 + index * 90} 50)" ${item(mood.key, active, "dim")}><circle r="32" class="face face-${mood.key}"/><circle cx="-11" cy="-6" r="3.5" class="face-eye"/><circle cx="11" cy="-6" r="3.5" class="face-eye"/><path d="${mood.brows}" class="face-line"/><path d="${mood.mouth}" class="face-line"/><text y="52" text-anchor="middle" class="room-label" lang="en">${mood.label}</text></g>`,
	).join("")}</svg>${readout(MOODS[0].note)}</div>`;
}

function renderSound(): string {
	const active = "ship";
	return `<div class="sound-explorer" data-focus-root="sound" data-focus-mode="hide">${focusButtons(SOUND_PAIRS, active, "Wortpaar wählen")}<div class="sound-stage">${SOUND_PAIRS.map(
		(pair) =>
			`<div class="sound-pair" ${item(pair.key, active, "hide")}>${[pair.a, pair.b]
				.map(([word, ipa]) => `<div class="sound-card"><strong lang="en">${esc(word)}</strong><span class="ipa">${esc(ipa)}</span></div>`)
				.join('<span class="sound-vs" aria-hidden="true">≠</span>')}</div>`,
	).join("")}</div>${readout(SOUND_PAIRS[0].note)}</div>`;
}

function renderRhyme(): string {
	const active = "star";
	return `<div class="rhyme-explorer" data-focus-root="rhyme" data-focus-mode="dim">${focusButtons(RHYME_FOCUS, active, "Reim oder Rhythmus wählen")}<div class="verse" lang="en">${VERSE.map(
		(line) =>
			`<p class="verse-line" ${item(line.keys, active, "dim")}>${line.keys.includes("beat") ? '<span class="beat">TWIN</span>kle, <span class="beat">TWIN</span>kle, <span class="beat">LIT</span>tle ' : esc(line.text) + " "}<mark class="rhyme-word rhyme-${line.keys[0]}">${esc(line.rhyme)}</mark></p>`,
	).join("")}</div>${readout(RHYME_FOCUS[0].note)}</div>`;
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
					`<g ${item(zone.id, active, "dim")}><rect x="${zone.box[0]}" y="${zone.box[1]}" width="${zone.box[2]}" height="${zone.box[3]}" rx="6" class="zone zone-${zone.id}"/><text x="${zone.box[0] + 8}" y="${zone.box[1] + 18}" class="zone-text" lang="en">${esc(zone.text)}</text></g>`,
			)
			.join("")}
	</svg>${readout(data.zones[0].note)}</div>`;
}

function illustration(lesson: Lesson): string {
	switch (lesson.workshop.kind) {
		case "dialogue":
			return renderDialogue(lesson.id);
		case "number":
			return renderNumber();
		case "clock":
			return renderClock();
		case "pairs":
			return renderPairs(lesson.id);
		case "family":
			return renderFamily();
		case "transform":
			return renderTransform(lesson.id);
		case "room":
			return renderRoom();
		case "distance":
			return renderDistance();
		case "quantities":
			return renderQuantities();
		case "blocks":
			return renderBlocks(lesson.id);
		case "timeline":
			return renderTimeline(lesson.id);
		case "frequency":
			return renderFrequency();
		case "signs":
			return renderSigns();
		case "schedule":
			return renderSchedule();
		case "shop":
			return renderShop();
		case "outfit":
			return renderOutfit();
		case "calendar":
			return renderCalendar(new Date().getFullYear());
		case "map-uk":
			return renderBritishIsles();
		case "map-london":
			return renderLondonMap();
		case "map-us":
			return renderNorthAmerica();
		case "map-cities":
			return renderTwoCities();
		case "citycountry":
			return renderCityCountry();
		case "moods":
			return renderMoods();
		case "layout":
			return renderLayout(lesson.id);
		case "sound":
			return renderSound();
		case "rhyme":
			return renderRhyme();
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
		for (const element of root.querySelectorAll<HTMLElement | SVGElement>("[data-focus-item]")) {
			const match = (element.dataset.focusItem ?? "").split(" ").includes(key);
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
	for (const button of root.querySelectorAll<HTMLButtonElement>("[data-calendar-shift]"))
		button.addEventListener("click", () => {
			const year = Number(root.dataset.year) + Number(button.dataset.calendarShift);
			root.dataset.year = String(year);
			root.querySelector("[data-calendar-year]")!.textContent = String(year);
			const pressed =
				root.querySelector<HTMLElement>('[data-focus-key][aria-pressed="true"]')?.dataset
					.focusKey ?? "bonfire";
			for (const festival of FESTIVALS) {
				const note = festivalNote(festival, year);
				const key = root.querySelector<HTMLElement>(`[data-focus-key="${festival.id}"]`);
				if (key) key.dataset.note = note;
				if (festival.id === pressed)
					root.querySelector("[data-focus-readout]")!.textContent = note;
			}
		});
}

export function bindWorkshop(
	lesson: Lesson,
	container: HTMLElement,
	complete: () => void,
): void {
	const inputs = [...container.querySelectorAll<HTMLSelectElement>("[data-workshop]")];
	for (const input of inputs)
		input.addEventListener("change", () => {
			const reached = workshopGoals(
				lesson.workshop,
				inputs.map((entry) => entry.value),
			);
			container.querySelectorAll<HTMLElement>("[data-goal]").forEach((row, index) => {
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

	const transform = container.querySelector<HTMLSelectElement>("[data-transform]");
	const transformData = TRANSFORMS[lesson.id];
	if (transform && transformData)
		transform.addEventListener("change", () => {
			const entry = transformData.entries[Number(transform.value)];
			if (!entry) return;
			container.querySelector(".transform-in")!.textContent = entry.input;
			container.querySelector(".transform-out")!.textContent = entry.output;
			container.querySelector("[data-transform-rule]")!.textContent = entry.rule;
			container.querySelector("[data-transform-example]")!.textContent = entry.example;
		});

	const hour = container.querySelector<HTMLInputElement>("#clock-hour");
	const minute = container.querySelector<HTMLInputElement>("#clock-minute");
	if (hour && minute) {
		const update = () => {
			const h = Number(hour.value);
			const m = Number(minute.value);
			container.querySelector("#hour-hand")!.setAttribute("transform", `rotate(${(h % 12) * 30 + m / 2} 110 110)`);
			container.querySelector("#minute-hand")!.setAttribute("transform", `rotate(${m * 6} 110 110)`);
			container.querySelector("#clock-readout")!.textContent =
				`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} · It's ${clockLabel(h, m)}. · ${ampm(h, m)}`;
		};
		hour.addEventListener("input", update);
		minute.addEventListener("input", update);
		update();
	}

	const day = container.querySelector<HTMLInputElement>("#date-day");
	const month = container.querySelector<HTMLSelectElement>("#date-month");
	if (day && month) {
		const update = () => {
			const sentence = dateSentence(Number(day.value), Number(month.value));
			const max = DAYS_IN_MONTH[Number(month.value)];
			if (Number(day.value) > max) day.value = String(max);
			container.querySelector("[data-date-month]")!.textContent = MONTHS[Number(month.value)];
			container.querySelector("[data-date-day]")!.textContent = ordinal(Number(day.value));
			container.querySelector("[data-date-written]")!.textContent = sentence.written;
			container.querySelector("[data-date-spoken]")!.textContent = `Say: ${sentence.spoken}`;
		};
		day.addEventListener("input", update);
		month.addEventListener("change", update);
	}

	const quantities = [...container.querySelectorAll<HTMLSelectElement>("[data-shop-qty]")];
	const note = container.querySelector<HTMLSelectElement>("[data-shop-note]");
	if (quantities.length && note) {
		const update = () => {
			const bill = shopBill(
				quantities.map((entry) => Number(entry.value)),
				Number(note.value),
			);
			container.querySelector("[data-shop-total]")!.textContent = bill.totalText;
			container.querySelector("[data-shop-change]")!.textContent = bill.changeText;
		};
		for (const entry of [...quantities, note]) entry.addEventListener("change", update);
	}
}
