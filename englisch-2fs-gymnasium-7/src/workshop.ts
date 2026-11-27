import { britainOutline, britainPoint, britainViewBox } from "./britain";
import { esc } from "./practice";
import type { Lesson, WorkshopPiece, WorkshopVisual } from "./types";

type MapPiece = WorkshopPiece & { point: readonly [number, number] };

const bath = {
	id: "bath",
	label: "Bath",
	point: britainPoint(-2.359, 51.381),
	note: "Bath liegt im Südwesten Englands. In Aquae Sulis nutzten die Römer die heißen Quellen.",
} satisfies MapPiece;

const maps = {
	cornwall: {
		title:
			"Großbritannien, Norden oben. Markierung 1 ist ganz im Südwesten. Markierung 2 liegt weiter nordöstlich im Landesinneren. Markierung 3 liegt weiter östlich in Südengland.",
		places: [
			{
				id: "cornwall",
				label: "Cornwall",
				point: britainPoint(-5.052, 50.262),
				note: "Cornwall liegt an der südwestlichen Spitze Englands. Die Markierung liegt bei Truro.",
			},
			bath,
			{
				id: "london",
				label: "London",
				point: britainPoint(-0.1276, 51.5072),
				note: "London liegt im Südosten Englands, östlich von Bath.",
			},
		],
	},
	romans: {
		title:
			"Großbritannien mit heutigen Grenzen, Norden oben. Markierung 1 liegt an einer Linie quer durch den Norden Englands. Markierung 2 ist im Südwesten Englands. Markierung 3 liegt nördlich von Markierung 1 in Schottland.",
		places: [
			{
				id: "wall",
				label: "Hadrian’s Wall",
				point: britainPoint(-2.37, 55.13),
				note: "Hadrian’s Wall verlief zwischen dem Solway Firth im Westen und Wallsend im Osten.",
			},
			bath,
			{
				id: "scotland",
				label: "Scotland",
				point: britainPoint(-4.05, 56.12),
				note: "Das heutige Schottland liegt nördlich der Mauer. Die Karte zeigt heutige Grenzen.",
			},
		],
	},
	florida: {
		title:
			"Zusammenhängende USA, Norden oben. Markierung 1 liegt im Landesinneren am Michigansee, Markierung 2 im Nordosten, Markierung 3 auf einer Halbinsel im Südosten.",
		places: [
			{
				id: "illinois",
				label: "Illinois",
				point: [61, 38],
				note: "Illinois ist ein Bundesstaat im Midwest.",
			},
			{
				id: "new-england",
				label: "New England",
				point: [87, 16],
				note: "New England liegt im Nordosten. Massachusetts ist einer seiner sechs Bundesstaaten.",
			},
			{
				id: "florida",
				label: "Florida",
				point: [75, 78],
				note: "Die Everglades liegen im Süden Floridas.",
			},
		],
	},
} as const;

type ScenePiece = WorkshopPiece & { icon: string };

const scenes = {
	picture: [
		{
			id: "curtain",
			label: "Vorhang",
			icon: "▰",
			note: "In the background, there’s a blue curtain.",
		},
		{ id: "left", label: "Links", icon: "▣", note: "On the left, two people are carrying a box." },
		{
			id: "right",
			label: "Rechts",
			icon: "♫",
			note: "On the right, a drummer is checking a drum.",
		},
		{
			id: "camera",
			label: "Vorn",
			icon: "◉",
			note: "In the foreground, a student is holding a camera.",
		},
	],
	storyboard: [
		{
			id: "opening",
			label: "Rae vor dem Auftritt",
			icon: "♫",
			note: "Rae stands backstage with a guitar case and searches her pockets.",
		},
		{
			id: "clue",
			label: "Leo am Gitarrenkoffer",
			icon: "▣",
			note: "Leo points to a ticket lying next to the guitar case.",
		},
		{
			id: "stage",
			label: "Bühne",
			icon: "★",
			note: "Both head towards the stage. A band is about to start.",
		},
	],
	directions: [
		{ id: "north", label: "Norden", icon: "↑", note: "Du blickst nach Norden." },
		{ id: "cinema", label: "Kino", icon: "←", note: "Das Kino liegt westlich vom Platz." },
		{ id: "square", label: "Platz", icon: "◆", note: "Hier kannst du links oder rechts abbiegen." },
		{
			id: "museum",
			label: "Museum",
			icon: "→",
			note: "Das Museum liegt östlich vom Platz, neben der Bibliothek.",
		},
		{
			id: "station",
			label: "Bahnhof",
			icon: "↑",
			note: "Vom Bahnhof führt der Weg geradeaus zum Platz.",
		},
	],
} as const;

export function workshopPieces(visual: WorkshopVisual): readonly WorkshopPiece[] {
	if (visual.kind === "map") return maps[visual.id].places;
	if (visual.kind === "scene") return scenes[visual.id];
	return visual.pieces;
}

function pieceButton(piece: WorkshopPiece, marker = "", language?: "en" | "de"): string {
	return `<button type="button" class="explorer-piece" data-piece="${esc(piece.id)}" aria-pressed="false"${language ? ` lang="${language}"` : ""}>${marker}${esc(piece.label)}</button>`;
}

const marker = (number: number): string => `<span class="piece-marker">${number}</span>`;

function mapGraphic(visual: Extract<WorkshopVisual, { kind: "map" }>): string {
	const { title, places } = maps[visual.id];
	if (visual.id === "florida") {
		return `<div class="locator florida" role="img" aria-label="${esc(title)}"><span class="north" aria-hidden="true">N ↑</span>${places.map(({ id, point: [x, y] }, index) => `<span class="map-marker" data-map-marker="${id}" style="--x:${x}%;--y:${y}%" aria-hidden="true">${index + 1}</span>`).join("")}</div>`;
	}
	const wall = [
		[-3.214, 54.954],
		[-2.89, 54.99],
		[-2.4, 55.004],
		[-1.532, 54.987],
	] as const;
	const wallPoints = wall.map(([lon, lat]) => britainPoint(lon, lat).join(",")).join(" ");
	return `<svg class="britannia" viewBox="${britainViewBox}" role="img" aria-label="${esc(title)}"><text class="compass" x="325" y="35">N ↑</text>${britainOutline()}${visual.id === "romans" ? `<polyline class="roman-wall" points="${wallPoints}"/>` : ""}${places.map(({ id, point: [x, y] }, index) => `<g class="britain-marker" data-map-marker="${id}" transform="translate(${x} ${y})" aria-hidden="true"><circle r="12"/><text y="5" text-anchor="middle">${index + 1}</text></g>`).join("")}</svg>`;
}

function illustrate(visual: WorkshopVisual): string {
	if (visual.kind === "map") {
		const places = maps[visual.id].places;
		return `<figure class="explorer workshop-map" aria-labelledby="workshop-visual-caption">${mapGraphic(visual)}<figcaption id="workshop-visual-caption">Wähle den passenden Ort anhand der Karte und der Nummern.${visual.id === "florida" ? " Die Karte ist eine Skizze." : " Die Karte zeigt heutige Grenzen. Kartengrundlage: Natural Earth."}</figcaption><div class="explorer-options map-options">${places.map((piece, index) => pieceButton(piece, marker(index + 1), "en")).join("")}</div></figure>`;
	}
	if (visual.kind === "scene") {
		const pieces: readonly ScenePiece[] = scenes[visual.id];
		return `<figure class="explorer scene ${visual.id}" aria-labelledby="workshop-visual-caption"><figcaption id="workshop-visual-caption">Wähle den passenden Ausschnitt.</figcaption><div class="explorer-options scene-pieces">${pieces.map((piece) => pieceButton(piece, `<span class="scene-icon" aria-hidden="true">${piece.icon}</span>`)).join("")}</div></figure>`;
	}
	return `<figure class="explorer workshop-${visual.kind}" aria-labelledby="workshop-visual-caption"><figcaption id="workshop-visual-caption">${esc(visual.caption)}</figcaption><div class="explorer-options">${visual.pieces.map((piece) => pieceButton(piece, "", visual.language ?? "en")).join("")}</div></figure>`;
}

export function renderWorkshop(lesson: Lesson): string {
	return `<section class="panel workshop" aria-labelledby="workshop-title"><h2 id="workshop-title">Entdeckerwerkstatt</h2><p id="workshop-question" class="workshop-question" aria-live="polite">${esc(lesson.workshop.goals[0].label)}</p>${illustrate(lesson.workshop.visual)}<p id="workshop-feedback" class="visual-note" role="status"></p><p id="workshop-status" class="workshop-status">0 von 3 Zielen erreicht.</p><button type="button" class="button secondary" id="workshop-restart" hidden>Werkstatt erneut starten</button></section>`;
}

export function bindWorkshop(lesson: Lesson, container: HTMLElement, complete: () => void): void {
	const workshop = lesson.workshop;
	const buttons = [...container.querySelectorAll<HTMLButtonElement>("[data-piece]")];
	const pieces = new Map(workshopPieces(workshop.visual).map((piece) => [piece.id, piece]));
	const question = container.querySelector<HTMLElement>("#workshop-question")!;
	const status = container.querySelector<HTMLElement>("#workshop-status")!;
	const feedback = container.querySelector<HTMLElement>("#workshop-feedback")!;
	const restart = container.querySelector<HTMLButtonElement>("#workshop-restart")!;
	let reached = 0;

	function select(id?: string): void {
		for (const button of buttons)
			button.setAttribute("aria-pressed", String(button.dataset.piece === id));
		for (const mark of container.querySelectorAll<HTMLElement | SVGElement>("[data-map-marker]"))
			mark.dataset.selected = String(mark.dataset.mapMarker === id);
	}

	for (const button of buttons) {
		button.addEventListener("click", () => {
			const piece = pieces.get(button.dataset.piece ?? "");
			if (!piece) return;
			select(piece.id);
			const goal = workshop.goals[reached];
			if (!goal) {
				feedback.textContent = piece.note;
				return;
			}
			if (piece.id !== goal.answer) {
				feedback.textContent = `${piece.note} Wähle für dieses Ziel ein anderes Feld.`;
				return;
			}
			reached += 1;
			feedback.textContent = `✓ ${goal.explanation}`;
			status.textContent = `${reached} von ${workshop.goals.length} Zielen erreicht.`;
			const next = workshop.goals[reached];
			question.textContent = next?.label ?? "Werkstatt abgeschlossen.";
			if (!next) {
				restart.hidden = false;
				complete();
			}
		});
	}

	restart.addEventListener("click", () => {
		reached = 0;
		select();
		status.textContent = "0 von 3 Zielen erreicht.";
		question.textContent = workshop.goals[0].label;
		feedback.textContent = "";
		restart.hidden = true;
		buttons[0]?.focus();
	});
}
