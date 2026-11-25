import { esc } from "./practice";
import type { Lesson, Workshop } from "./types";

export function workshopGoals(workshop: Workshop, answers: string[]): boolean[] {
	return workshop.goals.map((goal, index) => answers[index] === goal.answer);
}

const romanTimeline = [
	"Vor 43 · Gemeinschaften mit keltischen Sprachen",
	"Ab 43 · römische Eroberung",
	"2. Jh. · Bau des Hadrianswalls",
];

const maps = {
	romans: {
		title: "Hadrianswall und Bath in England",
		places: [
			[
				"Hadrianswall",
				50,
				21,
				"Der Hadrianswall liegt in Nordengland und markierte eine Grenze des Römischen Reiches.",
			],
			[
				"Bath",
				49,
				65,
				"In Bath nutzten die Römer heiße Quellen. Der damalige Name war Aquae Sulis.",
			],
		],
	},
	cornwall: {
		title: "Cornwall im Südwesten Englands",
		places: [
			["Cornwall", 23, 79, "Cornwall liegt am südwestlichen Ende von England."],
			[
				"Bath",
				49,
				65,
				"Bath liegt nordöstlich von Cornwall. Hier nutzten die Römer heiße Quellen.",
			],
			["London", 72, 68, "London liegt östlich von Cornwall, im Südosten Englands."],
		],
	},
	florida: {
		title: "Regionen der zusammenhängenden USA",
		places: [
			["Illinois", 61, 38, "Illinois ist ein Bundesstaat im Midwest."],
			[
				"New England",
				88,
				14,
				"New England liegt im Nordosten. Massachusetts ist einer seiner sechs Bundesstaaten.",
			],
			[
				"Florida",
				75,
				77,
				"Florida liegt im Südosten. Die Everglades befinden sich im Süden Floridas.",
			],
		],
	},
} as const;

const scene = {
	picture: [
		["Vorhang", "▰", "In the background, there’s a blue curtain."],
		["Links", "▣", "On the left, two people are carrying a box."],
		["Rechts", "♫", "On the right, a drummer is checking a drum."],
		["Vorn", "◉", "In the foreground, a student is holding a camera."],
	],
	storyboard: [
		[
			"Rae vor dem Auftritt",
			"♫",
			"Rae stands backstage with a guitar case and searches her pockets.",
		],
		["Leo am Gitarrenkoffer", "▣", "Leo points to a ticket lying next to the guitar case."],
		["Bühne", "★", "Both head towards the stage. A band is about to start."],
	],
	directions: [
		["Norden", "↑", "Du blickst nach Norden."],
		["Kino", "←", "Das Kino liegt links vom Platz."],
		["Platz", "◆", "Am Platz kannst du links oder rechts abbiegen."],
		["Museum", "→", "Das Museum liegt rechts vom Platz, neben der Bibliothek."],
		["Bahnhof", "↑", "Starte am Bahnhof und gehe geradeaus zum Platz."],
	],
} as const;

type Visual = NonNullable<Workshop["visual"]>;

function illustrate(visual?: Visual): string {
	if (!visual) return "";
	if (Array.isArray(visual))
		return `<figure class="explorer sequence">${visual.map((entry) => `<span>${esc(entry)}</span>`).join("")}</figure>`;

	if (visual === "cornwall" || visual === "florida" || visual === "romans") {
		const { title, places } = maps[visual];
		return `<figure class="explorer" aria-label="${title}"><div class="locator ${visual}"><span class="north" aria-hidden="true">N ↑</span>${places.map(([name, x, y, note]) => `<button type="button" class="pin" style="--x:${x}%;--y:${y}%" data-note="${esc(note)}" aria-pressed="false">${name}</button>`).join("")}</div><figcaption class="visual-note" aria-live="polite">Lernskizze · Wähle einen Ort.</figcaption></figure>${visual === "romans" ? illustrate(romanTimeline) : ""}`;
	}

	return `<figure class="explorer scene ${visual}"><div class="scene-pieces">${scene[visual].map(([name, icon, note]) => `<button type="button" class="scene-piece" data-note="${esc(note)}" aria-pressed="false"><span aria-hidden="true">${icon}</span>${name}</button>`).join("")}</div><figcaption class="visual-note" lang="${visual === "directions" ? "de" : "en"}" aria-live="polite"></figcaption></figure>`;
}

export function renderWorkshop(lesson: Lesson): string {
	return `<section class="panel workshop" aria-labelledby="workshop-title"><h2 id="workshop-title">Entdeckerwerkstatt</h2>${illustrate(lesson.workshop.visual)}<div class="construction">${lesson.workshop.goals
		.map((goal, index) => {
			const offset = (index + 1) % goal.options.length;
			const options = [...goal.options.slice(offset), ...goal.options.slice(0, offset)];
			return `<div class="construction-row" data-goal="${index}"><span class="goal-number" aria-hidden="true">${index + 1}</span><div><label for="workshop-${index}">${esc(goal.label)}</label><p class="word-piece" lang="en">${esc(goal.before)}</p><select id="workshop-${index}" data-workshop="${index}"><option value="">Antwort wählen …</option>${options.map((option) => `<option lang="en" value="${esc(option)}">${esc(option)}</option>`).join("")}</select><p class="assembled" lang="en" hidden></p><p class="goal-feedback small" role="status"></p></div></div>`;
		})
		.join("")}</div><p id="workshop-status" role="status">0 von 3 Zielen erreicht.</p></section>`;
}

export function bindWorkshop(lesson: Lesson, container: HTMLElement, complete: () => void): void {
	const inputs = [...container.querySelectorAll<HTMLSelectElement>("[data-workshop]")];
	const rows = [...container.querySelectorAll<HTMLElement>("[data-goal]")];
	for (const input of inputs) {
		input.addEventListener("change", () => {
			const answers = inputs.map((entry) => entry.value);
			const reached = workshopGoals(lesson.workshop, answers);
			rows.forEach((row, index) => {
				const { before, explanation } = lesson.workshop.goals[index];
				const answer = answers[index];
				row.dataset.reached = String(reached[index]);
				const assembled = row.querySelector<HTMLElement>(".assembled")!;
				assembled.hidden = !answer || !before.includes("…");
				assembled.textContent = assembled.hidden
					? ""
					: before.replace("…", answer).replace(/ +([.!?])/g, "$1");
				row.querySelector(".goal-feedback")!.textContent = reached[index]
					? `✓ ${explanation}`
					: answer
						? "Prüfe deine Auswahl am Beispiel oder im Material."
						: "";
			});
			const count = reached.filter(Boolean).length;
			container.querySelector("#workshop-status")!.textContent =
				`${count} von 3 Zielen erreicht.${count === 3 ? " Werkstatt gespeichert." : ""}`;
			if (count === 3) complete();
		});
	}
	const figures = container.querySelectorAll<HTMLElement>(".explorer");
	for (const figure of figures) {
		const buttons = figure.querySelectorAll<HTMLButtonElement>("[data-note]");
		for (const button of buttons) {
			button.addEventListener("click", () => {
				for (const other of buttons) other.setAttribute("aria-pressed", String(other === button));
				figure.querySelector(".visual-note")!.textContent = button.dataset.note ?? "";
			});
		}
	}
}
