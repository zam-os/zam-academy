// The same corridor is redrawn at each camera setting. The maze uses a
// single legal route so the thread always leads back to the same entrance.
export function renderStoryModel(kind: string, selection: number): string {
	if (kind === "camera") {
		const framing = ["wide", "detail", "low"][selection] ?? "wide";
		const description = {
			wide: "Totale: Ein Kind steht links im Flur. Rechts ist die ganze Tür zu sehen.",
			detail: "Detailaufnahme: Eine Hand berührt die Klinke. Der Rest des Flurs liegt außerhalb des Bildes.",
			low: "Untersicht: Vom Boden aus gesehen ragt die Tür über dem Kind auf.",
		}[framing];
		return `<div class="camera-model camera-${framing}" data-camera="${framing}" role="img" aria-label="${description}"><div class="camera-floor"></div><div class="camera-door"><span class="camera-knob"></span></div><div class="camera-person"><span></span></div><span class="camera-hand"></span></div>`;
	}
	if (kind !== "maze") return "";
	const cells = [
		"#########",
		"........#",
		"#.#####.#",
		"#.#...#.#",
		"#.###.#.#",
		"#.....#.#",
		"#########",
	].join("");
	const route = [9, 10, 11, 12, 13, 14, 15, 16, 25, 34, 43, 52];
	const active = selection === 0 ? route.slice(0, 2) : selection > 0 ? route : [];
	const end = selection === 2 ? route[0] : active.at(-1);
	const description = [
		"Am Eingang ist der Faden festgebunden.",
		"Auf dem Hinweg liegt der Faden bis zum letzten Feld.",
		"Die Spur führt zurück zum Eingang, an dem das erste Ende befestigt ist.",
	][selection] ?? "Labyrinth mit Eingang links und dem Ziel in der unteren rechten Ecke.";
	return `<div class="maze-model" data-maze-step="${selection}" role="img" aria-label="${description}">${Array.from(cells, (cell, index) => `<span class="${cell === "#" ? "maze-wall" : "maze-floor"}${active.includes(index) ? " maze-thread" : ""}${index === end ? " maze-current" : ""}" aria-hidden="true">${index === route[0] ? "↪" : index === route.at(-1) ? "◆" : ""}</span>`).join("")}</div>`;
}
