// "Acht Arme, acht Wörter": Tinto holds eight words, one in each arm, and the
// child tells him into which basket each one goes: Nomen, Verben, Adjektive.
// A free game like Milo's Sprungspiel: no stars, no score, no time limit,
// nothing stored. A wrong basket only makes Tinto explain the test that helps.
//
// The words come from the Grundwortschatz 3/4 of the ISB (rights with the ISB,
// see grundwortschatz.ts); tests/game.test.ts checks every word against the
// official list. Only words with one clear word class are used: nouns as
// nouns, verbs in the infinitive, adjectives that are not also adverbs here.
// The words keep their spelling. Written all in capitals they would be
// ambiguous: "das Lachen" passes the article test as well as "der Fisch".
import { esc } from "./format";
import type { Rng } from "./types";

export type WordClass = "nomen" | "verb" | "adjektiv";

export const BASKETS: { id: WordClass; label: string; colour: string }[] = [
	{ id: "nomen", label: "Nomen", colour: "blue" },
	{ id: "verb", label: "Verben", colour: "red" },
	{ id: "adjektiv", label: "Adjektive", colour: "green" },
];

const NOMEN =
	"Boden Finger Fisch Flasche Geschichte Gesicht Licht Luft Nase Stein Tasche Wagen Woche Zeitung Dorf Erde Tür Wurst Brief Tier Zwiebel Zimmer Platz Pfütze Glück Stück Schuh Abend Berg Geld Nacht Saft Hand Wald Straße Fuchs Taxi Pizza Stadt Meer Schnee Käfer Märchen Tiger Maschine Familie";
const VERB =
	"helfen lachen machen reiten schenken sprechen springen weinen werfen lesen riechen schieben verlieren ziehen essen kommen schwimmen vergessen schützen verstecken erschrecken blühen drehen gehen sehen erlauben lieben laufen backen kaufen fahren erzählen singen schlafen trinken tragen rufen schreiben";
const ADJEKTIV = "alt lang kurz stark schwer schnell schlimm tief rund fremd neu reich schlecht schwierig glücklich wahr voll";

export const GAME_WORDS: { word: string; cls: WordClass }[] = [
	...NOMEN.split(" ").map((word) => ({ word, cls: "nomen" as const })),
	...VERB.split(" ").map((word) => ({ word, cls: "verb" as const })),
	...ADJEKTIV.split(" ").map((word) => ({ word, cls: "adjektiv" as const })),
];

export interface Card {
	word: string;
	cls: WordClass;
	/** In a basket already. */
	placed: boolean;
	/** Wrong baskets tried for this word. */
	misses: number;
}

export interface Round {
	cards: Card[];
}

export const ARMS = 8;

function shuffle<T>(rng: Rng, list: T[]): T[] {
	const copy = [...list];
	for (let i = copy.length - 1; i > 0; i -= 1) {
		const j = Math.floor(rng() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Eight different words, at least two of each class, none from the last round. */
export function newRound(rng: Rng, avoid: string[] = []): Round {
	const fresh = GAME_WORDS.filter((w) => !avoid.includes(w.word));
	const pool = (cls: WordClass) => shuffle(rng, fresh.filter((w) => w.cls === cls));
	const [n, v, a] = [pool("nomen"), pool("verb"), pool("adjektiv")];
	// 3 + 3 + 2 or similar: two of each, the rest drawn freely.
	const chosen = [...n.slice(0, 2), ...v.slice(0, 2), ...a.slice(0, 2)];
	const rest = shuffle(rng, [...n.slice(2), ...v.slice(2), ...a.slice(2)]).slice(0, ARMS - chosen.length);
	return { cards: shuffle(rng, [...chosen, ...rest]).map((w) => ({ ...w, placed: false, misses: 0 })) };
}

export interface DropResult {
	round: Round;
	right: boolean;
}

/** Put card `index` into a basket. A wrong basket leaves the card with Tinto. */
export function drop(round: Round, index: number, basket: WordClass): DropResult {
	const card = round.cards[index];
	if (!card || card.placed) return { round, right: false };
	const right = card.cls === basket;
	const cards = round.cards.map((c, i) =>
		i === index ? { ...c, placed: right || c.placed, misses: c.misses + (right ? 0 : 1) } : c,
	);
	return { round: { cards }, right };
}

export const finished = (round: Round): boolean => round.cards.every((c) => c.placed);

/** What Tinto says after a wrong basket: the test that shows the word class. */
export function hint(card: Card, basket: WordClass): string {
	const wrong = BASKETS.find((b) => b.id === basket)?.label ?? "";
	const test =
		card.cls === "nomen"
			? "Passt der, die oder das davor? Dann ist es ein Nomen."
			: card.cls === "verb"
				? `Passt „wir ${card.word}“? Dann ist es ein Verb.`
				: `Passt „sehr ${card.word}“? Dann ist es ein Adjektiv.`;
	return `„${card.word}“ gehört nicht zu den ${wrong}. ${test}`;
}

/**
 * Where the eight words hang, in percent of the stage: four to Tinto's left,
 * four to his right, the outer ones a little further out, like a fan.
 */
export const SLOTS: { x: number; y: number }[] = [
	{ x: 16, y: 13 },
	{ x: 14, y: 37 },
	{ x: 14, y: 61 },
	{ x: 16, y: 85 },
	{ x: 84, y: 13 },
	{ x: 86, y: 37 },
	{ x: 86, y: 61 },
	{ x: 84, y: 85 },
];

/** One tentacle from Tinto's body to the inner edge of a word card. */
export function tentacle(slot: number): string {
	const { x, y } = SLOTS[slot];
	const left = x < 50;
	const k = slot % 4;
	const sx = left ? 46 - (k % 2) : 54 + (k % 2);
	const sy = 50 + k * 4;
	const ex = left ? x + 12 : x - 12;
	const dir = left ? -1 : 1;
	return `M${sx} ${sy} C${sx + dir * 6} ${sy + 12} ${ex - dir * 10} ${y - 6} ${ex} ${y}`;
}

/** The game page. `selected` is the card Tinto holds up. */
export function gameHtml(round: Round, selected: number | null, tintoSvg: string, line: string): string {
	const placed = (cls: WordClass) => round.cards.filter((c) => c.placed && c.cls === cls);
	const done = round.cards.filter((c) => c.placed).length;
	const arms = round.cards
		.map(
			(c, i) =>
				`<path d="${tentacle(i)}" class="tentacle${c.placed ? " free" : ""}${selected === i ? " holding" : ""}" vector-effect="non-scaling-stroke"/>`,
		)
		.join("");
	const cards = round.cards
		.map((c, i) => {
			const at = `style="left:${SLOTS[i].x}%;top:${SLOTS[i].y}%"`;
			return c.placed
				? `<li class="arm-slot empty" ${at} aria-hidden="true"></li>`
				: `<li class="arm-slot" ${at}><button type="button" class="word-card${selected === i ? " lifted" : ""}" data-action="game-card" data-card="${i}" aria-pressed="${selected === i}">${esc(c.word)}</button></li>`;
		})
		.join("");
	const baskets = BASKETS.map(
		(b) =>
			`<button type="button" class="basket pen-${b.colour}" data-action="game-basket" data-basket="${b.id}" ${selected === null ? "disabled" : ""} aria-label="In den Korb ${b.label}${selected !== null ? ` legen: ${esc(round.cards[selected]?.word ?? "")}` : ""}"><span class="basket-label">${b.label}</span><span class="basket-words">${placed(b.id)
				.map((c) => `<span class="basket-word">${esc(c.word)}</span>`)
				.join("")}</span><span class="basket-weave" aria-hidden="true"></span></button>`,
	).join("");
	return `<section class="game" aria-labelledby="game-title">
<div class="game-head"><h1 id="game-title">Acht Arme, acht Wörter</h1>
<p>Tinto hält in jedem Arm ein Wort. Tippe ein Wort an und dann den Korb, in den es gehört. Du hast so viel Zeit, wie du brauchst.</p>
<p class="game-count" aria-live="polite">${done} von ${round.cards.length} einsortiert</p></div>
<div class="game-stage">
	<div class="octo">
		<svg class="tentacles" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">${arms}</svg>
		<div class="octo-body"><button type="button" class="tinto-button" data-action="wave" aria-label="Tinto zuwinken">${tintoSvg}</button></div>
		<ol class="arms" aria-label="Wörter in Tintos Armen">${cards}</ol>
	</div>
	<p class="bubble game-bubble" id="tinto-message" aria-live="polite">${esc(line)}</p>
	<div class="baskets" role="group" aria-label="Körbe">${baskets}</div>
	${finished(round) ? '<p class="game-done"><button type="button" class="button big" data-action="game-new">Noch eine Runde 🎲</button></p>' : ""}
</div>
<p class="small">Die Wörter stammen aus dem Grundwortschatz 3/4 des ISB München. Das Spiel zählt für keinen Stern und speichert nichts.</p>
</section>`;
}
