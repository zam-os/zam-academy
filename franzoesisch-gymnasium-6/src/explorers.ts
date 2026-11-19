import { esc } from "./practice";
import type { Lesson } from "./types";

interface Step {
	label: string;
	icon: string;
	example: string;
	detail: string;
}

const scene: Step[] = [
	{ label: "Vordergrund", icon: "👧🎒", example: "Au premier plan, une fille tient un sac.", detail: "Vorne im Bild fällt der rote Rucksack auf." },
	{ label: "Linke Bildseite", icon: "🚲🚲", example: "À gauche, il y a deux vélos.", detail: "Links gilt aus deiner Sicht auf das Bild." },
	{ label: "Hintergrund", icon: "🚌🏛", example: "À l’arrière-plan, on voit un bus.", detail: "Der Bus ist hinter der Person, weiter weg." },
];

const recipe: Step[] = [
	{ label: "D’abord", icon: "🥣", example: "Mettez la farine dans un bol.", detail: "Das Mehl kommt zuerst in die Schüssel." },
	{ label: "Ensuite", icon: "🥚", example: "Ajoutez les œufs et le lait.", detail: "Danach gibst du Eier und Milch dazu." },
	{ label: "Enfin", icon: "🍳", example: "Faites cuire la pâte.", detail: "Den vorbereiteten Teig garst du zum Schluss." },
];

const past: Step[] = [
	{ label: "Gestern", icon: "←", example: "Hier, nous avons joué.", detail: "Avons und joué erzählen von einer abgeschlossenen Handlung." },
	{ label: "Heute", icon: "●", example: "Aujourd’hui, nous jouons.", detail: "Jouons ist eine Präsensform." },
	{ label: "Morgen", icon: "→", example: "Demain, nous allons jouer.", detail: "Allons und der Infinitiv jouer kündigen einen Plan an." },
];

const agreement: Step[] = [
	{ label: "Eine Person", icon: "●", example: "Elle est arrivée.", detail: "Feminin Singular: arrivé + e." },
	{ label: "Gruppe mit elles", icon: "● ●", example: "Elles sont arrivées.", detail: "Feminin Plural: arrivé + es." },
	{ label: "Gruppe mit ils", icon: "● ●", example: "Ils sont arrivés.", detail: "Maskulin oder gemischt im Plural: arrivé + s." },
];

const pronouns: Step[] = [
	{ label: "Ding nennen", icon: "🎫", example: "Je prends le billet.", detail: "Le billet steht als direktes Objekt nach prends." },
	{ label: "Ding ersetzen", icon: "←", example: "Je le prends.", detail: "Le ersetzt le billet und steht vor prends." },
	{ label: "Einen Plan sagen", icon: "→", example: "Je vais le prendre.", detail: "Le gehört zu prendre und steht direkt vor diesem Infinitiv." },
];

const receivers: Step[] = [
	{ label: "sehen", icon: "◉", example: "Je vois Lina. → Je la vois.", detail: "Voir verbindet die Person direkt mit dem Verb." },
	{ label: "etwas geben", icon: "→", example: "Je donne le billet à Lina. → Je lui donne le billet.", detail: "Lui ersetzt die Empfängerin mit à." },
	{ label: "mehreren geben", icon: "⇉", example: "Je donne les billets à mes amis. → Je leur donne les billets.", detail: "Leur ersetzt mehrere Empfänger." },
];

const magnitudes: Step[] = [
	{ label: "201", icon: "100", example: "deux cent un", detail: "2 Hunderter, 0 Zehner, 1 Einer. Vor un bleibt cent ohne s." },
	{ label: "2 345", icon: "1 000", example: "deux mille trois cent quarante-cinq", detail: "2 Tausender, 3 Hunderter, 4 Zehner, 5 Einer." },
	{ label: "1 000 000", icon: "1 M", example: "un million", detail: "1 Million. Bei mehreren lautet das Nomen millions." },
];

const firstStoryboard: Step[] = [
	{ label: "Problem", icon: "❔", example: "Jade : Où est mon billet ?", detail: "Jade sucht ihr Ticket. Die Frage eröffnet die Handlung." },
	{ label: "Suche", icon: "🎒", example: "Malik : Il n’est pas ici.", detail: "Malik schaut im Rucksack nach." },
	{ label: "Lösung", icon: "🎫", example: "Jade : Ah, je l’ai trouvé !", detail: "Jade findet das Ticket in ihrer Kleidertasche." },
];

const secondStoryboard: Step[] = [
	{ label: "Begrüßung", icon: "👋", example: "Léa : Salut, Sam !", detail: "Léa begrüßt Sam." },
	{ label: "Frage", icon: "❔", example: "Sam : Où est le chat ?", detail: "Sam sucht die Katze." },
	{ label: "Antwort", icon: "🐈", example: "Léa : Le chat est dans le sac.", detail: "Léa zeigt auf die Katze in der Tasche." },
];

const paris: Step[] = [
	{ label: "Tour Eiffel", icon: "🗼", example: "On va à la tour Eiffel.", detail: "Der Eiffelturm steht westlich von Louvre und Notre-Dame." },
	{ label: "Louvre", icon: "◈", example: "On visite le Louvre.", detail: "Der Louvre ist ein Museum. Seine Glaspyramide markiert einen Eingang." },
	{ label: "Notre-Dame", icon: "♜", example: "Notre-Dame est sur une île.", detail: "Die Kathedrale steht auf der Île de la Cité in der Seine." },
];

function stepExplorer(label: string, steps: Step[], classes = ""): string {
	return `<figure class="step-explorer ${classes}" data-explorer>
		<figcaption>${esc(label)}</figcaption>
		<div class="step-options" role="group" aria-label="${esc(label)}">${steps.map((step, i) =>
			`<button type="button" data-step="${i}" aria-pressed="${i === 0}"><span aria-hidden="true">${esc(step.icon)}</span><strong>${esc(step.label)}</strong></button>`,
		).join("")}</div>
		<div class="step-results" aria-live="polite">${steps.map((step, i) =>
			`<div data-step-panel="${i}"${i ? " hidden" : ""}><p lang="fr">${esc(step.example)}</p><p class="small">${esc(step.detail)}</p></div>`,
		).join("")}</div></figure>`;
}

function routeExplorer(): string {
	return `<figure class="step-explorer route-explorer" data-explorer>
		<figcaption>Wegskizze · Wähle ein Ziel</figcaption>
		<div class="route-grid" aria-label="Die Bibliothek liegt links der Kreuzung am Café, das Museum rechts. Der Start liegt darunter.">
			<button type="button" data-step="0" aria-pressed="true"><span aria-hidden="true">▤</span><strong>Bibliothèque</strong></button>
			<span class="route-cafe"><span aria-hidden="true">☕</span> Café</span>
			<button type="button" data-step="1" aria-pressed="false"><span aria-hidden="true">◇</span><strong>Musée</strong></button>
			<span class="route-origin"><span aria-hidden="true">↑</span> Start</span>
		</div>
		<div class="step-results" aria-live="polite">
			<div data-step-panel="0"><p lang="fr">Allez tout droit jusqu’au café, puis tournez à gauche.</p></div>
			<div data-step-panel="1" hidden><p lang="fr">Allez tout droit jusqu’au café, puis tournez à droite.</p></div>
		</div></figure>`;
}

export function renderExplorer(lesson: Lesson): string {
	if (lesson.id === "f6-2-paris") return stepExplorer("Drei Orte an der Seine", paris);
	if (lesson.id.endsWith("-objets-directs")) return stepExplorer("Satzbau · Wo steht das direkte Objekt?", pronouns);
	if (lesson.id === "f6-1-objets-indirects") return stepExplorer("Wer ist beteiligt?", receivers);
	if (lesson.id === "f6-1-avoir-passe" || lesson.id === "f6-1-weekend")
		return stepExplorer("Zeitstrahl · Vergleiche die Formen", past);
	if (lesson.id === "f6-1-etre-passe") return stepExplorer("Partizip · Wer ist angekommen?", agreement);
	if (lesson.id === "f6-1-trajet")
		return `<figure class="schedule"><figcaption>Beispiel einer Anzeigetafel · anderer Zug als in der Hörübung</figcaption>
		<table><thead><tr><th scope="col">Destination</th><th scope="col">Départ</th><th scope="col">Voie</th></tr></thead>
		<tbody><tr><td>Rennes</td><td><s>14 h</s> <strong>14 h 20</strong></td><td>3</td></tr></tbody></table>
		<p class="small">Lies die neue Uhrzeit neben der gestrichenen. Das Gleis steht in einer eigenen Spalte.</p></figure>`;
	switch (lesson.workshop.kind) {
		case "scene": return stepExplorer("Bildskizze · Welche Ebene beschreibst du?", scene, "scene-explorer");
		case "recipe": return stepExplorer("Rezeptfolge · Wähle einen Schritt", recipe);
		case "magnitude": return stepExplorer("Stellenwerte · Wähle eine Zahl", magnitudes);
		case "route": return routeExplorer();
		case "storyboard": return stepExplorer("Storyboard · Wähle eine Szene", lesson.track === "f1" ? firstStoryboard : secondStoryboard);
		default: return "";
	}
}

export function bindExplorers(container: HTMLElement): void {
	for (const explorer of container.querySelectorAll<HTMLElement>("[data-explorer]")) {
		const steps = explorer.querySelectorAll<HTMLButtonElement>("[data-step]");
		const panels = explorer.querySelectorAll<HTMLElement>("[data-step-panel]");
		for (const button of steps) {
			button.addEventListener("click", () => {
				for (const step of steps) step.setAttribute("aria-pressed", String(step === button));
				for (const panel of panels) panel.hidden = panel.dataset.stepPanel !== button.dataset.step;
			});
		}
	}
}
