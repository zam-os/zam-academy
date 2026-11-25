import { renderRegionMap } from "./france-map";
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

const story: Step[] = [
	{ label: "Beginn", icon: "⚽", example: "Zoé : « J’adore le foot ! »", detail: "Zoé freut sich auf das Fußballspiel." },
	{ label: "Problem", icon: "?", example: "Zoé : « Oh non, mon ballon ! »", detail: "Die zweite Sprechblase sagt, was Zoé vermisst." },
	{ label: "Lösung", icon: "✓", example: "Mila trouve le ballon sous un banc.", detail: "Der Ball ist wieder da. Zoé und Mila können spielen." },
];

const alesia: Step[] = [
	{ label: "Historischer Ort", icon: "◇", example: "Le siège a lieu à Alésia.", detail: "Die Belagerung ereignete sich 52 vor unserer Zeitrechnung." },
	{ label: "Materielle Spur", icon: "▤", example: "On trouve des traces des camps romains.", detail: "Spuren von Lagern lassen sich archäologisch untersuchen." },
	{ label: "Erfundene Szene", icon: "…", example: "« Regarde la colline ! »", detail: "Linas Comic erfindet, wer dort spricht und was gesagt wird." },
];

const narrative: Step[] = [
	{ label: "Hintergrund", icon: "━━━━", example: "Il pleuvait et je lisais.", detail: "Imparfait. Regen und Lesen sind bereits im Gang." },
	{ label: "Ereignis", icon: "◆", example: "Tout à coup, le téléphone a sonné.", detail: "Passé composé. Das Klingeln tritt in die Szene ein." },
	{ label: "Nächster Schritt", icon: "→", example: "Puis j’ai répondu.", detail: "Passé composé. Puis ordnet die nächste Handlung nach dem Klingeln ein." },
];

const quantities: Step[] = [
	{ label: "Ohne Zahl", icon: "◐", example: "Nous achetons des pommes.", detail: "Des bezeichnet Äpfel in einer unbestimmten Menge." },
	{ label: "Mit Zahl", icon: "3", example: "Nous achetons trois pommes.", detail: "Die Zahl trois nennt die genaue Menge; des entfällt." },
	{ label: "Mit en", icon: "←", example: "Nous en achetons trois.", detail: "En ersetzt pommes und steht vor dem Verb. Trois bleibt nach dem Verb." },
];

const comparisons: Step[] = [
	{ label: "60 cm und 40 cm", icon: ">", example: "Le sac A est plus haut que le sac B.", detail: "A ist höher als B. Plus haut que verbindet die beiden Größen." },
	{ label: "40 cm und 40 cm", icon: "=", example: "Le sac B est aussi haut que le sac C.", detail: "Beide Taschen sind gleich hoch. Das zeigt aussi haut que." },
	{ label: "Spitzenplatz", icon: "↑", example: "Le sac A est le plus haut des trois.", detail: "Le plus haut nennt den höchsten aus der Gruppe." },
];

const instructions: Step[] = [
	{ label: "Eine Person", icon: "●", example: "Sois à l’heure !", detail: "Sois ist die Form zu tu. Das Subjekt wird beim Imperativ weggelassen." },
	{ label: "Mehrere Personen", icon: "● ●", example: "Ayez vos billets en main !", detail: "Ayez ist die Form zu vous." },
	{ label: "Auf etwas zurückverweisen", icon: "→", example: "Montrez-les !", detail: "Les steht hier für vos billets und folgt dem bejahten Imperativ." },
];

const relative: Step[] = [
	{ label: "Wer handelt?", icon: "S", example: "Voici la fille qui chante.", detail: "Qui steht für die Sängerin. Sie ist Subjekt von chante." },
	{ label: "Was trägt sie?", icon: "O", example: "Voici le chapeau qu’elle porte.", detail: "Qu’ greift den Hut auf. Elle trägt ihn und ist das Subjekt." },
	{ label: "An welchem Ort?", icon: "⌖", example: "Voici la salle où elle chante.", detail: "Où bezieht sich auf den Raum, in dem sie singt." },
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
	const slug = lesson.id.split("-").slice(2).join("-");
	switch (slug) {
		case "regions": return renderRegionMap();
		case "objets-indirects": return stepExplorer("Wer ist beteiligt?", receivers);
		case "relatifs": return stepExplorer("Ein Nomen, drei mögliche Rollen", relative);
		case "avoir-passe":
		case "weekend": return stepExplorer("Zeitstrahl · Vergleiche die Formen", past, "time-explorer");
		case "etre-passe": return stepExplorer("Partizip · Wer ist angekommen?", agreement);
		case "deux-temps":
		case "journal": return stepExplorer("Zeitstrahl · Wechsle zwischen Hintergrund und Ereignis", narrative, "time-explorer");
		case "partitif":
		case "en": return stepExplorer("Wie viel? · Wähle eine Mengenform", quantities);
		case "comparaison": return stepExplorer("Vergleich · Wähle zwei Höhen oder eine Rangfolge", comparisons);
		case "imperatif": return stepExplorer("Aufforderungen · Wähle eine Situation", instructions);
		case "alesia": return stepExplorer("Alésia · Was lässt sich belegen?", alesia, "scene-explorer");
		case "histoire": return stepExplorer("Comic · Wähle ein Bild", story, "scene-explorer");
		case "trajet": return `<figure class="schedule"><figcaption>Beispiel einer Anzeigetafel · anderer Zug als in der Hörübung</figcaption>
		<table><thead><tr><th scope="col">Destination</th><th scope="col">Départ</th><th scope="col">Voie</th></tr></thead>
		<tbody><tr><td>Rennes</td><td><s>14 h</s> <strong>14 h 20</strong></td><td>3</td></tr></tbody></table>
		<p class="small">Lies die neue Uhrzeit neben der gestrichenen. Das Gleis steht in einer eigenen Spalte.</p></figure>`;
	}
	switch (lesson.workshop.kind) {
		case "scene": return stepExplorer("Bildskizze · Welche Ebene beschreibst du?", scene, "scene-explorer");
		case "recipe": return stepExplorer("Rezeptfolge · Wähle einen Schritt", recipe);
		case "magnitude": return stepExplorer("Stellenwerte · Wähle eine Zahl", magnitudes);
		case "route": return routeExplorer();
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
