import poemAudio from "./media/regen.wav?inline";
import reportAudio from "./media/schulradio.wav?inline";
import { esc } from "./practice";
import type { Lesson } from "./types";

export function renderMaterial(lesson: Lesson): string {
	const text = `<p class="material">${esc(lesson.material)}</p>`;
	const audio =
		lesson.id === "d6-hoerbericht"
			? reportAudio
			: lesson.id === "d6-gedicht"
				? poemAudio
				: undefined;
	if (audio) {
		const instruction = lesson.id === "d6-gedicht"
			? "Höre auf Pausen, Betonung und Klang. Lies die Verse anschließend selbst laut."
			: "Höre zuerst ohne Text. Notiere beim zweiten Hören Schlüsselangaben.";
		return `<p>${instruction} Die Aufnahme nutzt eine Computerstimme.</p><audio controls preload="none" aria-label="${esc(lesson.title)} · Computerstimme" src="${esc(audio)}"></audio><details><summary>Hörtext als Text</summary>${text}</details>`;
	}
	if (lesson.id === "d6-diskontinuierlich")
		return `<table class="material-table"><caption>Erfundener Fahrplan · keine aktuelle Verkehrsauskunft</caption><thead><tr><th scope="col">Fahrt</th><th scope="col">Schule ab</th><th scope="col">Museum an</th></tr></thead><tbody><tr><th scope="row">A</th><td>14:10 Uhr</td><td>14:28 Uhr</td></tr><tr><th scope="row">B</th><td>14:30 Uhr</td><td>14:48 Uhr</td></tr><tr><th scope="row">C</th><td>14:50 Uhr</td><td>15:08 Uhr</td></tr></tbody></table>${text}`;
	return text;
}
