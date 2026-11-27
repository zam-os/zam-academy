import { renderCitiesMap, renderQuebecMap, renderRegionMap } from "./france-map";
import { esc } from "./practice";
import type { Lesson } from "./types";

/**
 * Every lesson opens its workshop with one explorer. A pressed step button
 * reveals its panel; figures mark the matching part with `data-mark` (styled
 * through `:has()` in styles.css), so the picture and the text stay in step.
 */
interface Step {
	label: string;
	icon: string;
	example: string;
	detail: string;
}
/** A word tile: text and its role (v = verb, p = pronoun or subject, x = the point of the lesson). */
type Tile = readonly [string, "" | "v" | "p" | "x"];
interface TileStep {
	label: string;
	icon: string;
	tiles: readonly Tile[];
	detail: string;
}

function buttons(label: string, steps: readonly { label: string; icon: string }[]): string {
	return `<div class="step-options" role="group" aria-label="${esc(label)}">${steps
		.map(
			(step, i) =>
				`<button type="button" data-step="${i}" aria-pressed="${i === 0}"><span aria-hidden="true">${esc(step.icon)}</span><strong>${esc(step.label)}</strong></button>`,
		)
		.join("")}</div>`;
}
function panels(contents: readonly string[]): string {
	return `<div class="step-results" aria-live="polite">${contents
		.map((content, i) => `<div data-step-panel="${i}"${i ? " hidden" : ""}>${content}</div>`)
		.join("")}</div>`;
}
const textPanel = (step: Step) =>
	`<p lang="fr">${esc(step.example)}</p><p class="small">${esc(step.detail)}</p>`;

function stepExplorer(label: string, steps: readonly Step[], classes = "", figure = ""): string {
	return `<figure class="step-explorer ${classes}" data-explorer><figcaption>${esc(label)}</figcaption>${figure}${buttons(label, steps)}${panels(steps.map(textPanel))}</figure>`;
}
function tileExplorer(label: string, steps: readonly TileStep[]): string {
	return `<figure class="step-explorer tile-explorer" data-explorer><figcaption>${esc(label)}</figcaption>${buttons(label, steps)}${panels(
		steps.map(
			(step) =>
				`<p class="tiles" lang="fr">${step.tiles
					.map(([text, role]) => `<span class="tile"${role ? ` data-role="${role}"` : ""}>${esc(text)}</span>`)
					.join("")}</p><p class="small">${esc(step.detail)}</p>`,
		),
	)}<p class="tile-legend small" aria-hidden="true"><span class="tile" data-role="p">Subjekt / Pronomen</span><span class="tile" data-role="v">Verb</span><span class="tile" data-role="x">Darauf kommt es an</span></p></figure>`;
}

/** Three distinct points in time on one arrow: earlier → later, never two at the same point. */
function timeline(label: string, steps: readonly Step[], axis: readonly [string, string]): string {
	const xs = [110, 300, 490];
	const svg = `<svg class="timeline-figure" viewBox="0 0 600 130" role="img" aria-label="${esc(`${label}: ${steps.map((s) => s.label).join(", dann ")}`)}">
	<line x1="30" y1="62" x2="560" y2="62" class="axis"/><path d="M560 52 L582 62 L560 72 Z" class="axis-head"/>
	<text x="30" y="118" class="axis-label">${esc(axis[0])}</text><text x="582" y="118" text-anchor="end" class="axis-label">${esc(axis[1])}</text>
	${steps
		.map(
			(step, i) =>
				`<g data-mark="${i}"><circle cx="${xs[i]}" cy="62" r="13"/><text x="${xs[i]}" y="35" text-anchor="middle">${esc(step.label)}</text></g>`,
		)
		.join("")}</svg>`;
	return stepExplorer(label, steps, "timeline-explorer", svg);
}

// ── Échanger et s’entendre ────────────────────────────────────────────────
const board = `<figure class="schedule departure-board"><figcaption>Anzeigetafel · Départs</figcaption>
<table><thead><tr><th scope="col">Train</th><th scope="col">Destination</th><th scope="col">Départ</th><th scope="col">Voie</th><th scope="col">Info</th></tr></thead>
<tbody><tr><td>TER</td><td>Rouen</td><td>16 h 10</td><td><s>3</s> <strong>7</strong></td><td><strong>retard 20 min</strong></td></tr>
<tr><td>TGV</td><td>Paris</td><td>16 h 25</td><td>1</td><td>à l’heure</td></tr></tbody></table>
<p class="small">Gestrichen: was nicht mehr gilt. Die Durchsage nennt dasselbe mit « au lieu de ».</p></figure>`;

const podcast: Step[] = [
	{ label: "Frage", icon: "🎙", example: "Journaliste : « Depuis quand ? »", detail: "Die Frage kündigt an, welches Detail gleich kommt: ein Beginn." },
	{ label: "Antwort", icon: "💬", example: "Inès : « Depuis septembre. »", detail: "Die Antwort enthält das Detail: seit September." },
	{ label: "Füllwort", icon: "…", example: "« Euh… », « Ben… », « Bon… »", detail: "Füllwörter geben Zeit zum Nachdenken. Du kannst sie überhören." },
];
const exchange: Step[] = [
	{ label: "Brigitte-Sauzay", icon: "3 + 3", example: "Trois mois en France, puis trois mois en Allemagne.", detail: "Drei Monate Gastfamilie und Schule in Frankreich, danach drei Monate Gegenbesuch. 8. bis 11. Klasse." },
	{ label: "Voltaire", icon: "6 + 6", example: "Six mois en France, puis six mois en Allemagne.", detail: "Je sechs Monate in beiden Ländern. 8. bis 10. Klasse." },
	{ label: "Dolmetschen", icon: "⇄", example: "Ma mère demande si tu as des allergies.", detail: "Fragen gibst du mit si weiter, Aussagen mit que." },
];
const invitation: Step[] = [
	{ label: "19 h 00", icon: "", example: "Trop tôt : on n’est pas encore prêt.", detail: "Eine halbe Stunde zu früh stört bei den Vorbereitungen." },
	{ label: "19 h 40", icon: "", example: "Le quart d’heure de politesse.", detail: "Ein paar Minuten nach 19:30 Uhr ist bei einer privaten Einladung oft üblich." },
	{ label: "21 h 00", icon: "", example: "Beaucoup trop tard !", detail: "Anderthalb Stunden später ist unhöflich; das Essen ist längst fertig." },
];
const inversion: TileStep[] = [
	{ label: "Intonation", icon: "?", tiles: [["Tu", "p"], ["viens", "v"], ["?", ""]], detail: "Gesprochen reicht die Stimme: Sie geht am Ende nach oben." },
	{ label: "Inversion", icon: "⇄", tiles: [["Viens", "v"], ["-tu", "p"], ["?", ""]], detail: "Verb und Pronomen tauschen den Platz und werden mit Bindestrich verbunden." },
	{ label: "Mit -t-", icon: "-t-", tiles: [["A", "v"], ["-t-", "x"], ["il", "p"], ["un frère ?", ""]], detail: "Zwischen Vokal und il, elle oder on steht -t-." },
];
const lequel: TileStep[] = [
	{ label: "le casque", icon: "♂", tiles: [["le", "x"], ["+", ""], ["quel", "x"], ["→", ""], ["Lequel", "p"], ["veux-tu ?", "v"]], detail: "Maskulin Singular: lequel." },
	{ label: "la casquette", icon: "♀", tiles: [["la", "x"], ["+", ""], ["quelle", "x"], ["→", ""], ["Laquelle", "p"], ["veux-tu ?", "v"]], detail: "Feminin Singular: laquelle. Beide Teile sind feminin." },
	{ label: "les baskets", icon: "♀♀", tiles: [["les", "x"], ["+", ""], ["quelles", "x"], ["→", ""], ["Lesquelles", "p"], ["veux-tu ?", "v"]], detail: "Feminin Plural: lesquelles; maskulin Plural wäre lesquels." },
];
const quiQue: Step[] = [
	{ label: "Person · Subjekt", icon: "👤 S", example: "Qui est-ce qui a gagné ?", detail: "Wer? Die gesuchte Person ist Subjekt; nach der Fragewendung folgt direkt das Verb." },
	{ label: "Person · Objekt", icon: "👤 O", example: "Qui est-ce que tu invites ?", detail: "Wen? Die gesuchte Person ist Objekt; der Satz hat ein eigenes Subjekt: tu." },
	{ label: "Sache · Subjekt", icon: "▢ S", example: "Qu’est-ce qui se passe ?", detail: "Was? Die gesuchte Sache ist Subjekt; nach der Fragewendung folgt direkt das Verb." },
	{ label: "Sache · Objekt", icon: "▢ O", example: "Qu’est-ce que tu cherches ?", detail: "Was? Die gesuchte Sache ist Objekt; der Satz hat ein eigenes Subjekt: tu." },
];
const doctor: Step[] = [
	{ label: "la tête", icon: "🤕", example: "J’ai mal à la tête.", detail: "Feminin: à la." },
	{ label: "les dents", icon: "🦷", example: "J’ai mal aux dents.", detail: "Plural: à + les = aux." },
	{ label: "la fièvre", icon: "🌡", example: "J’ai de la fièvre.", detail: "Fieber mit avoir und Teilungsartikel." },
];

// ── Décrire et nuancer ────────────────────────────────────────────────────
const countries: Step[] = [
	{ label: "en", icon: "la", example: "la France → en France · l’Italie → en Italie", detail: "Feminine Länder (und maskuline mit Vokal) stehen mit en." },
	{ label: "au", icon: "le", example: "le Canada → au Canada · le Mexique → au Mexique", detail: "Maskuline Länder: au, auch le Mexique mit -e am Ende." },
	{ label: "aux", icon: "les", example: "les États-Unis → aux États-Unis", detail: "Länder im Plural: aux." },
];
const adverbs: TileStep[] = [
	{ label: "lent", icon: "→", tiles: [["lent", ""], ["→", ""], ["lente", "x"], ["→", ""], ["lentement", "v"]], detail: "Feminine Form + -ment." },
	{ label: "vrai", icon: "→", tiles: [["vrai", "x"], ["→", ""], ["vraiment", "v"]], detail: "Männliche Form auf Vokal + -ment." },
	{ label: "bon", icon: "!", tiles: [["bon", ""], ["→", ""], ["bien", "x"]], detail: "Unregelmäßig: bon → bien, mauvais → mal." },
];
const emment: TileStep[] = [
	{ label: "-ent", icon: "e", tiles: [["évid", ""], ["ent", "x"], ["→", ""], ["évid", ""], ["emment", "v"]], detail: "-ent wird zu -emment, gesprochen [amɑ̃]." },
	{ label: "-ant", icon: "a", tiles: [["cour", ""], ["ant", "x"], ["→", ""], ["cour", ""], ["amment", "v"]], detail: "-ant wird zu -amment, gleich gesprochen." },
	{ label: "-ément", icon: "é", tiles: [["précis", ""], ["→", ""], ["précis", ""], ["ément", "v"]], detail: "Hier hörst du [e]: précisément, énormément." },
];
const race = `<div class="race" aria-hidden="true">${[
	["Inès", 96],
	["Jade", 80],
	["Sami", 64],
	["Hugo", 64],
]
	.map(
		([name, width], i) =>
			`<div class="lane" data-mark="${i === 0 ? 2 : i === 1 ? 0 : 1}"><span class="lane-name">${name}</span><span class="lane-bar" style="width:${width}%">🏃</span></div>`,
	)
	.join("")}</div>`;
const compare: Step[] = [
	{ label: "plus … que", icon: ">", example: "Jade court plus vite que Sami.", detail: "Jades Balken ist länger als der von Sami." },
	{ label: "aussi … que", icon: "=", example: "Sami court aussi vite qu’Hugo.", detail: "Gleich lange Balken: aussi … que." },
	{ label: "le plus", icon: "↑", example: "Inès court le plus vite.", detail: "Der längste Balken: le plus, auch bei einem Mädchen mit le." },
];
const negation: TileStep[] = [
	{ label: "Personne ne", icon: "∅", tiles: [["Personne", "p"], ["ne", "x"], ["répond", "v"], [".", ""]], detail: "Personne als Subjekt am Anfang, danach ne, ohne pas." },
	{ label: "Rien ne", icon: "∅", tiles: [["Rien", "p"], ["n’", "x"], ["a changé", "v"], [".", ""]], detail: "Rien als Subjekt, auch im passé composé ohne pas." },
	{ label: "ne … personne", icon: "↔", tiles: [["Je", "p"], ["n’", "x"], ["ai vu", "v"], ["personne", "x"], [".", ""]], detail: "Als Objekt steht personne hinter dem Partizip, rien davor." },
];
const relief: TileStep[] = [
	{ label: "Subjekt", icon: "S", tiles: [["C’est", "x"], ["Léa", "p"], ["qui", "x"], ["a gagné", "v"], [".", ""]], detail: "C’est … qui rahmt das Subjekt." },
	{ label: "Ort", icon: "⌖", tiles: [["C’est", "x"], ["à Lille", ""], ["que", "x"], ["j’", "p"], ["habite", "v"], [".", ""]], detail: "C’est … que rahmt andere Satzteile." },
	{ label: "Pronomen", icon: "!", tiles: [["C’est", "x"], ["moi", "p"], ["qui", "x"], ["ai raison", "v"], [".", ""]], detail: "Betonte Form moi; das Verb passt zu moi: ai." },
];
const opinion: Step[] = [
	{ label: "Zustimmung", icon: "+", example: "C’est parfait !", detail: "Du bist ganz einverstanden." },
	{ label: "Meinung", icon: "≈", example: "Je trouve que c’est une bonne idée parce que …", detail: "Meinung mit que, Begründung mit parce que." },
	{ label: "Bedauern", icon: "−", example: "C’est dommage, il pleut.", detail: "Du bedauerst etwas." },
];
function pie(): string {
	const slices = [
		{ from: 0, to: 0.5, mark: 0, label: "à vélo · 1/2 (12)" },
		{ from: 0.5, to: 0.75, mark: 1, label: "en bus · 1/4 (6)" },
		{ from: 0.75, to: 11 / 12, mark: 2, label: "à pied · 1/6 (4)" },
		{ from: 11 / 12, to: 1, mark: -1, label: "en voiture · 1/12 (2)" },
	];
	const point = (t: number) => {
		const a = 2 * Math.PI * t - Math.PI / 2;
		return `${(100 + 88 * Math.cos(a)).toFixed(1)} ${(105 + 88 * Math.sin(a)).toFixed(1)}`;
	};
	return `<svg class="pie-figure" viewBox="0 0 400 210" role="img" aria-label="Kreisdiagramm: Hälfte mit dem Fahrrad, ein Viertel mit dem Bus, ein Sechstel zu Fuß, ein Zwölftel mit dem Auto.">${slices
		.map(
			(s, i) =>
				`<g${s.mark >= 0 ? ` data-mark="${s.mark}"` : ""} class="slice pie-legend"><path d="M100 105 L${point(s.from)} A88 88 0 ${s.to - s.from > 0.5 ? 1 : 0} 1 ${point(s.to)} Z"/><rect x="212" y="${44 + i * 36}" width="16" height="16" rx="3"/><text x="236" y="${57 + i * 36}">${esc(s.label)}</text></g>`,
		)
		.join("")}</svg>`;
}
const fractions: Step[] = [
	{ label: "la moitié", icon: "½", example: "La moitié des élèves vient à vélo.", detail: "12 von 24: die Hälfte." },
	{ label: "un quart", icon: "¼", example: "Un quart vient en bus.", detail: "6 von 24: ein Viertel." },
	{ label: "un sixième", icon: "⅙", example: "Un sixième vient à pied.", detail: "4 von 24: ein Sechstel, Zahl + -ième." },
];

// ── Raconter dans le temps ─────────────────────────────────────────────────
const nearTime: Step[] = [
	{ label: "venir de", icon: "", example: "Je viens de faire mes devoirs.", detail: "Gerade eben fertig geworden." },
	{ label: "être en train de", icon: "", example: "Je suis en train de faire mes devoirs.", detail: "Gerade mittendrin." },
	{ label: "aller", icon: "", example: "Je vais faire mes devoirs.", detail: "Gleich, in naher Zukunft." },
];
const pqp: TileStep[] = [
	{ label: "avoir", icon: "a", tiles: [["j’", "p"], ["avais", "x"], ["mangé", "v"]], detail: "Imparfait von avoir + Partizip." },
	{ label: "être", icon: "ê", tiles: [["elle", "p"], ["était", "x"], ["partie", "v"]], detail: "Imparfait von être; bei partir wird das Partizip an elle angeglichen." },
	{ label: "reflexiv", icon: "se", tiles: [["elle", "p"], ["s’", ""], ["était", "x"], ["lavé", "v"], ["les mains", "x"]], detail: "Reflexiv immer mit être; folgt ein direktes Objekt wie les mains, bleibt lavé unverändert (sonst: elle s’était lavée)." },
];
const before: Step[] = [
	{ label: "plus-que-parfait", icon: "", example: "Le train était déjà parti.", detail: "Zuerst: Der Zug fährt ab." },
	{ label: "passé composé", icon: "", example: "Je suis arrivé à la gare.", detail: "Danach: Ich komme an. Das ist das Ereignis der Erzählung." },
	{ label: "présent", icon: "", example: "Maintenant, je raconte l’histoire.", detail: "Der Moment, in dem du erzählst." },
];
const reflexive: TileStep[] = [
	{ label: "Bejaht", icon: "+", tiles: [["Elle", "p"], ["s’", ""], ["est", "x"], ["levée", "v"]], detail: "Pronomen + être + Partizip, angeglichen, weil kein direktes Objekt folgt." },
	{ label: "Verneint", icon: "−", tiles: [["Je", "p"], ["ne", "x"], ["me", ""], ["suis", "x"], ["pas", "x"], ["réveillé", "v"]], detail: "Ne … pas umschließen Pronomen und Hilfsverb." },
	{ label: "Plural", icon: "●●", tiles: [["Les filles", "p"], ["se", ""], ["sont", "x"], ["amusées", "v"]], detail: "Feminin Plural: -ées." },
];
const agreement: TileStep[] = [
	{ label: "que", icon: "←", tiles: [["la photo", "x"], ["que", ""], ["j’", "p"], ["ai", ""], ["prise", "x"]], detail: "Das Objekt la photo steht vor dem Verb: prise." },
	{ label: "les", icon: "←", tiles: [["Je", "p"], ["les", "x"], ["ai", ""], ["écrites", "x"]], detail: "Les steht für les lettres: écrites." },
	{ label: "danach", icon: "→", tiles: [["J’", "p"], ["ai", ""], ["pris", "v"], ["une photo", "x"]], detail: "Steht das Objekt nach dem Verb, bleibt das Partizip unverändert." },
];
const courir: Step[] = [
	{ label: "courir", icon: "🏃", example: "je cours · nous courons · ils courent · j’ai couru", detail: "Präsens mit einem r; Partizip couru." },
	{ label: "rire", icon: "😄", example: "je ris · nous rions · ils rient · j’ai ri", detail: "Partizip ri, ohne -t." },
	{ label: "sourire", icon: "🙂", example: "il sourit · il a souri", detail: "Wie rire." },
];
const croire: Step[] = [
	{ label: "croire", icon: "💭", example: "je crois · nous croyons · ils croient · j’ai cru", detail: "Bei nous und vous steht y." },
	{ label: "mourir", icon: "✝", example: "je meurs · nous mourons · ils meurent", detail: "eu im betonten Stamm, ou bei nous und vous." },
	{ label: "passé composé", icon: "ê", example: "il est mort · elle est morte", detail: "Mourir mit être, Partizip angeglichen." },
];
const news = `<div class="news-card" lang="fr" aria-hidden="true"><p class="news-title" data-mark="0">UN PERROQUET À L’ÉCOLE !</p><p><span data-mark="1">Lundi matin, à Toulouse, les élèves d’une école primaire</span> ont eu une drôle de surprise … Il s’était échappé <span data-mark="2">deux jours avant</span>.</p></div>`;
const reading: Step[] = [
	{ label: "Titel", icon: "▤", example: "UN PERROQUET À L’ÉCOLE !", detail: "Der Titel nennt das Thema: quoi ?" },
	{ label: "Erster Satz", icon: "?", example: "Lundi matin, à Toulouse, les élèves …", detail: "Quand ? Où ? Qui ? stehen gleich am Anfang." },
	{ label: "Detail", icon: "⌕", example: "… deux jours avant.", detail: "Für Details liest du gezielt weiter." },
];
const story: Step[] = [
	{ label: "Anfang", icon: "", example: "C’était un soir de novembre. Il pleuvait.", detail: "Hintergrund im imparfait." },
	{ label: "Wende", icon: "", example: "Soudain, la porte s’est ouverte.", detail: "Das Ereignis im passé composé, eingeleitet mit soudain." },
	{ label: "Ende", icon: "", example: "Finalement, le chat s’est endormi.", detail: "Finalement schließt die Geschichte." },
];

// ── La France et le Québec ─────────────────────────────────────────────────
const mediation: Step[] = [
	{ label: "Führung", icon: "🚶", example: "une visite guidée du vieux centre", detail: "Altstadt umschreibst du mit le vieux centre." },
	{ label: "Schifffahrt", icon: "⛴", example: "une promenade en bateau sur le Danube", detail: "Die Donau heißt le Danube." },
	{ label: "Dom", icon: "⛪", example: "le Dom, c’est la cathédrale", detail: "Ein deutscher Eigenname wird kurz erklärt." },
];
const cities: Step[] = [
	{ label: "Marseille", icon: "⚓", example: "Marseille est au bord de la Méditerranée.", detail: "Großer Hafen: Seit Jahrhunderten kamen hier Menschen aus vielen Ländern an." },
	{ label: "Lille", icon: "🏭", example: "Lille se trouve près de la Belgique.", detail: "Früher Bergbau und Textilindustrie: Arbeiter kamen aus Polen, Italien und Nordafrika." },
];
const quebec: Step[] = [
	{ label: "Québec", icon: "★", example: "Québec est la capitale de la province.", detail: "Die Hauptstadt liegt am Saint-Laurent." },
	{ label: "Montréal", icon: "●", example: "Montréal est la plus grande ville.", detail: "Größte Stadt der Provinz, ebenfalls am Fluss." },
	{ label: "Saint-Laurent", icon: "≈", example: "le fleuve Saint-Laurent", detail: "Der Strom fließt nach Nordosten in den Atlantik." },
];
const meals: Step[] = [
	{ label: "morgens", icon: "🌅", example: "France : le petit-déjeuner · Québec : le déjeuner", detail: "Dasselbe Wort, andere Mahlzeit." },
	{ label: "mittags", icon: "☀", example: "France : le déjeuner · Québec : le dîner", detail: "Le dîner ist in Québec das Mittagessen." },
	{ label: "abends", icon: "🌙", example: "France : le dîner · Québec : le souper", detail: "Le souper ist in Québec das Abendessen." },
];
const crenels = (x: number, y: number, count: number, width: number) =>
	Array.from({ length: count }, (_, i) => `<rect x="${x + i * 2 * width}" y="${y - 14}" width="${width}" height="14"/>`).join("");
const castle = `<svg class="castle-figure" viewBox="0 0 600 300" role="img" aria-label="Burgskizze: hoher Hauptturm hinter einer Mauer mit Zinnen, davor ein Wassergraben mit heruntergelassener Zugbrücke am Tor.">
	<rect x="0" y="250" width="600" height="50" class="castle-water"/>
	<g data-mark="0" class="castle-part"><rect x="250" y="44" width="100" height="160"/>${crenels(250, 44, 3, 20)}<text x="300" y="20" text-anchor="middle">le donjon</text></g>
	<g data-mark="2" class="castle-part"><rect x="60" y="140" width="480" height="110"/>${crenels(60, 140, 12, 20)}<text x="76" y="176">le rempart</text></g>
	<g data-mark="1" class="castle-part"><rect x="270" y="186" width="60" height="64" class="castle-gate"/><path d="M270 250 H330 L346 294 H254 Z"/><text x="356" y="290">le pont-levis</text></g>
	<text x="470" y="276" class="castle-label">les douves</text>
</svg>`;
const castleSteps: Step[] = [
	{ label: "le donjon", icon: "♜", example: "Le seigneur habite dans le donjon.", detail: "Der höchste, stärkste Turm, nicht das Verlies." },
	{ label: "le pont-levis", icon: "⇡", example: "On entre par le pont-levis.", detail: "Die Zugbrücke führt über die douves, den Wassergraben." },
	{ label: "le rempart", icon: "▥", example: "Le rempart protège le château.", detail: "Die dicke Mauer mit Zinnen." },
];
const feasts: Step[] = [
	{ label: "2 février", icon: "", example: "la Chandeleur : des crêpes", detail: "Crêpes wenden, mit einer Münze in der anderen Hand." },
	{ label: "14 février", icon: "", example: "la Saint-Valentin", detail: "Der Tag der Verliebten." },
	{ label: "fin mai", icon: "", example: "la fête des mères : le dernier dimanche de mai", detail: "In Deutschland der zweite Sonntag im Mai." },
];
const ladder = `<div class="ladder" aria-hidden="true">
	<div class="ladder-col"><strong>France</strong><span>maternelle · 3–6</span><span>élémentaire · 6–11</span><span data-mark="0">collège · 6e 5e <b data-mark="1">4e</b> 3e · brevet</span><span data-mark="2">lycée · seconde, première, terminale · bac</span></div>
	<div class="ladder-col"><strong>Bayern</strong><span>Kindergarten</span><span>Grundschule · 1.–4. Klasse</span><span data-mark="0">Gymnasium · 5.–7. <b data-mark="1">8.</b> Klasse …</span><span data-mark="2">… bis zur 13. Klasse · Abitur</span></div></div>`;
const school: Step[] = [
	{ label: "collège", icon: "▦", example: "Tous les élèves vont au collège : 6e, 5e, 4e, 3e.", detail: "Die Klassen zählen rückwärts, am Ende steht le brevet." },
	{ label: "4e = 8. Klasse", icon: "≈", example: "La huitième classe, c’est à peu près la 4e.", detail: "Deine Klasse entspricht ungefähr der 4e." },
	{ label: "lycée", icon: "🎓", example: "seconde, première, terminale : le bac", detail: "Der lycée endet mit dem baccalauréat." },
];

// ── Jeunes, médias et langue ───────────────────────────────────────────────
const tastes: Step[] = [
	{ label: "J’adore", icon: "♥", example: "J’adore les vidéos de foot.", detail: "Nach adorer steht der bestimmte Artikel." },
	{ label: "Je préfère", icon: "★", example: "Je préfère les BD.", detail: "Préférer: lieber mögen." },
	{ label: "Je déteste", icon: "✕", example: "Je n’aime pas du tout les réseaux sociaux.", detail: "Ne … pas du tout: überhaupt nicht." },
];
const comic = `<div class="comic" aria-hidden="true" data-mark="0">${[
	["🧒🐕", "J’ai peur…"],
	["🐕💨🐈", ""],
	["🧒✋", "Stop ! Arrête !"],
	["👵🙂", "Merci, Nino !"],
]
	.map(
		([scene, bubble], i) =>
			`<div class="comic-case"${i === 2 ? ' data-mark="1"' : ""}>${bubble ? `<span class="comic-bubble"${i === 0 ? ' data-mark="2"' : ""} lang="fr">${bubble}</span>` : ""}<span class="comic-scene">${scene}</span></div>`,
	)
	.join("")}</div>`;
const comicSteps: Step[] = [
	{ label: "la planche", icon: "▦", example: "une planche de quatre cases", detail: "Die ganze Comicseite." },
	{ label: "la case", icon: "▢", example: "Case 3 : Nino court vers le chien.", detail: "Ein einzelnes Bild." },
	{ label: "la bulle", icon: "💬", example: "« J’ai peur… »", detail: "Die Sprechblase enthält, was die Figur sagt." },
];
const scale = `<div class="register-scale" aria-hidden="true"><span class="scale-end">familier</span><span class="scale-bar"><i data-mark="0"></i><i data-mark="1"></i><i data-mark="2"></i></span><span class="scale-end">standard, höflich</span></div>`;
const registers: Step[] = [
	{ label: "familier", icon: "😎", example: "T’as vu le match ? C’était ouf !", detail: "Unter Freunden." },
	{ label: "standard", icon: "🙂", example: "Tu as vu le match ? C’était génial !", detail: "Vollständige Formen: passt fast immer." },
	{ label: "höflich", icon: "🎩", example: "Avez-vous vu le match ?", detail: "Für Erwachsene, Lehrkräfte und Gastfamilie." },
];
const email: Step[] = [
	{ label: "Anrede", icon: "✉", example: "Madame, Monsieur,", detail: "Formell an Unbekannte; an Freunde: Salut !" },
	{ label: "Text", icon: "¶", example: "Je suis élève … Pouvez-vous m’envoyer des informations ?", detail: "Ein Gedanke pro Absatz, klares Anliegen." },
	{ label: "Gruß", icon: "✍", example: "Cordialement, Anna", detail: "Formell: Cordialement; an Freunde: À bientôt." },
];
const talk: Step[] = [
	{ label: "Einleitung", icon: "1", example: "Aujourd’hui, je vais vous présenter …", detail: "Das Thema ankündigen." },
	{ label: "Hauptteil", icon: "2", example: "D’abord … Ensuite …", detail: "Zwei bis drei Punkte mit Konnektoren." },
	{ label: "Schluss", icon: "3", example: "Merci de votre attention. Avez-vous des questions ?", detail: "Danken und Fragen zulassen." },
];
const words: TileStep[] = [
	{ label: "Präfix re-", icon: "↺", tiles: [["re", "x"], ["faire", ""]], detail: "re- bedeutet wieder: noch einmal machen." },
	{ label: "Präfix im-", icon: "≠", tiles: [["im", "x"], ["possible", ""]], detail: "in- oder im- (vor p, b) bedeutet un-." },
	{ label: "Suffix -eur", icon: "👤", tiles: [["chant", ""], ["eur", "x"]], detail: "-eur oder -euse bildet die Person." },
];
const paraphrase: Step[] = [
	{ label: "Person", icon: "👤", example: "C’est une personne qui soigne les malades.", detail: "Le médecin: qui für die Person als Subjekt." },
	{ label: "Gegenstand", icon: "☂", example: "C’est un objet qu’on utilise quand il pleut.", detail: "Le parapluie: qu’on utilise pour … oder quand …" },
	{ label: "Ort", icon: "⌂", example: "C’est un endroit où on achète du pain.", detail: "La boulangerie: où für den Ort." },
];
const dictionary = `<div class="dict-card" lang="fr" aria-hidden="true"><strong>glace</strong> <span data-mark="0">[glas]</span> <em data-mark="1">n. f.</em><ol data-mark="2"><li lang="de">Eis (gefrorenes Wasser)</li><li lang="de">(Speise-)Eis : <span lang="fr">une glace à la vanille</span></li><li lang="de">Spiegel : <span lang="fr">se regarder dans la glace</span></li></ol></div>`;
const dictSteps: Step[] = [
	{ label: "Lautschrift", icon: "[ ]", example: "[glas]", detail: "So spricht man das Wort aus." },
	{ label: "Wortart", icon: "n. f.", example: "nom féminin : la glace", detail: "Feminines Nomen, also la glace." },
	{ label: "Bedeutung", icon: "1 2 3", example: "Elle se regarde dans la glace.", detail: "Wähle die Bedeutung, die in den Satz passt: hier Spiegel." },
];
const sounds: TileStep[] = [
	{ label: "-tion", icon: "[sjɔ̃]", tiles: [["nata", ""], ["tion", "x"], ["→", ""], ["[sjɔ̃]", "v"]], detail: "Kein t-Laut, Nasal am Ende." },
	{ label: "-eille", icon: "[ɛj]", tiles: [["bout", ""], ["eille", "x"], ["→", ""], ["[ɛj]", "v"]], detail: "Das ll klingt wie j." },
	{ label: "eau", icon: "[o]", tiles: [["bat", ""], ["eau", "x"], ["→", ""], ["[o]", "v"]], detail: "eau, au und o klingen gleich." },
];
const valences: TileStep[] = [
	{ label: "aider", icon: "≠", tiles: [["jemandem helfen", ""], ["→", ""], ["aider", "v"], ["qn", "x"]], detail: "Deutsch mit Dativ, Französisch mit direktem Objekt: je l’aide." },
	{ label: "téléphoner", icon: "≠", tiles: [["jemanden anrufen", ""], ["→", ""], ["téléphoner", "v"], ["à qn", "x"]], detail: "Deutsch mit Akkusativ, Französisch mit à: je lui téléphone." },
	{ label: "jouer de", icon: "♪", tiles: [["Gitarre spielen", ""], ["→", ""], ["jouer", "v"], ["de la guitare", "x"]], detail: "Instrumente mit de, Sport und Spiele mit à." },
];

export function renderExplorer(lesson: Lesson): string {
	const slug = lesson.id.split("-").slice(2).join("-");
	switch (slug) {
		case "annonce": return board;
		case "podcast": return stepExplorer("Interview · Wer spricht?", podcast);
		case "echange": return stepExplorer("Austauschprogramme des DFJW", exchange);
		case "invitation": return timeline("Einladung um 19:30 Uhr · Wann klingelst du?", invitation, ["früher", "später"]);
		case "inversion": return tileExplorer("Wortstellung · drei Arten zu fragen", inversion);
		case "lequel": return tileExplorer("Welcher? · quel + Nomen wird lequel", lequel);
		case "qui-quoi": return stepExplorer("Wer, wen, was? · Wähle ein Feld", quiQue, "grid-2");
		case "medecin": return stepExplorer("Beim Arzt · Was tut weh?", doctor);
		case "pays": return stepExplorer("Länder · en, au oder aux?", countries);
		case "adverbes": return tileExplorer("Adverbwerkstatt · vom Adjektiv zum Adverb", adverbs);
		case "emment": return tileExplorer("Endungen · -emment, -amment, -ément", emment);
		case "plus-vite": return stepExplorer("Crosslauf · Vergleiche die Balken", compare, "race-explorer", race);
		case "personne-rien": return tileExplorer("Verneinung · Wo steht was?", negation);
		case "mise-en-relief": return tileExplorer("Hervorheben · der Rahmen c’est … qui / que", relief);
		case "avis": return stepExplorer("Meinungsbarometer", opinion);
		case "statistiques": return stepExplorer("Umfrage in einer 4e · 24 Schülerinnen und Schüler", fractions, "pie-explorer", pie());
		case "venir-de": return timeline("Zeitleiste · gerade eben, gerade jetzt, gleich", nearTime, ["vorher", "nachher"]);
		case "plus-que-parfait": return tileExplorer("Bauplan des plus-que-parfait", pqp);
		case "avant-apres": return timeline("Zeitleiste · Was war zuerst?", before, ["früher", "jetzt"]);
		case "pronominaux-passe": return tileExplorer("Reflexive Verben im passé composé", reflexive);
		case "accord-avoir": return tileExplorer("Angleichung nach avoir · Wo steht das Objekt?", agreement);
		case "courir-rire": return stepExplorer("Verbkarten · Wähle ein Verb", courir);
		case "croire-mourir": return stepExplorer("Verbkarten · Wähle ein Verb", croire);
		case "fait-divers": return stepExplorer("Lesestrategie · Wo stehen die Antworten?", reading, "news-explorer", news);
		case "recit": return timeline("Erzählbogen · Anfang, Wende, Ende", story, ["Anfang", "Ende"]);
		case "regions": return renderRegionMap();
		case "programme": return stepExplorer("Sprachmittlung · Deutsch → Französisch", mediation);
		case "marseille-lille": return stepExplorer("Zwei Großstädte · Wähle eine Stadt", cities, "map-explorer", renderCitiesMap());
		case "quebec": return stepExplorer("Québec auf der Lernskizze · Wähle einen Ort", quebec, "map-explorer", renderQuebecMap());
		case "accents": return stepExplorer("Mahlzeiten · Frankreich und Québec", meals);
		case "chateau": return stepExplorer("Burgskizze · Wähle einen Teil", castleSteps, "castle-explorer", castle);
		case "fetes": return timeline("Festkalender · von Februar bis Mai", feasts, ["Februar", "Mai"]);
		case "ecole": return stepExplorer("Schulwege · Frankreich und Bayern", school, "ladder-explorer", ladder);
		case "ecrans": return stepExplorer("Vorlieben · Wähle eine Stufe", tastes);
		case "bd": return stepExplorer("Comicseite · Wähle einen Begriff", comicSteps, "comic-explorer", comic);
		case "registre": return stepExplorer("Sprachebenen · Wähle eine Stufe", registers, "scale-explorer", scale);
		case "post": return stepExplorer("Aufbau einer E-Mail", email);
		case "expose": return stepExplorer("Mini-Vortrag · drei Teile", talk);
		case "mots": return tileExplorer("Wortbausteine", words);
		case "synonymes": return stepExplorer("Umschreiben · Wähle ein Muster", paraphrase);
		case "dictionnaire": return stepExplorer("Wörterbucheintrag · Wähle einen Teil", dictSteps, "dict-explorer", dictionary);
		case "sons": return tileExplorer("Schreibung und Laut", sounds);
		case "valences": return tileExplorer("Verbvalenzen · Deutsch und Französisch", valences);
		default: return "";
	}
}

export function bindExplorers(container: HTMLElement): void {
	for (const explorer of container.querySelectorAll<HTMLElement>("[data-explorer]")) {
		const steps = explorer.querySelectorAll<HTMLButtonElement>("[data-step]");
		const shown = explorer.querySelectorAll<HTMLElement>("[data-step-panel]");
		for (const button of steps) {
			button.addEventListener("click", () => {
				for (const step of steps) step.setAttribute("aria-pressed", String(step === button));
				for (const panel of shown) panel.hidden = panel.dataset.stepPanel !== button.dataset.step;
			});
		}
	}
}
