import debatteAudio from "./media/debatte.wav?inline";
import rundfunkAudio from "./media/rundfunk.wav?inline";
import { esc } from "./practice";
import type { Lesson } from "./types";

export function renderMaterial(lesson: Lesson): string {
	const text = `<p class="material">${esc(lesson.material)}</p>`;
	const audio =
		lesson.id === "d7-notizen-debatte"
			? debatteAudio
			: lesson.id === "d7-hoerbeitrag-gestaltung"
				? rundfunkAudio
				: undefined;
	if (audio)
		return `<p>Höre zuerst ohne Text. Notiere beim zweiten Hören Schlüsselangaben. Die Aufnahme nutzt eine Computerstimme und ist ein Übungsmodell.</p><audio controls preload="none" aria-label="${esc(lesson.title)} · Computerstimme" src="${esc(audio)}"></audio><details><summary>Hörtext als Text</summary>${text}</details>`;
	if (lesson.id === "d7-diskontinuierliche-texte")
		return `<table class="material-table"><caption>Erfundene Umfrage der Klasse 7 · Lesewunsch-Projekt</caption><thead><tr><th scope="col">Lesebereich</th><th scope="col">Stimmen</th><th scope="col">Anteil</th></tr></thead><tbody><tr><th scope="row">Jugendbuch</th><td>12</td><td>40 %</td></tr><tr><th scope="row">Sachbuch</th><td>8</td><td>etwa 27 %</td></tr><tr><th scope="row">Balladen</th><td>6</td><td>20 %</td></tr><tr><th scope="row">Hörbuch</th><td>4</td><td>etwa 13 %</td></tr></tbody></table>${text}`;
	return text;
}
