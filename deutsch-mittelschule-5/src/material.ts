import announcement from "./media/buecherei-durchsage.mp3?inline";
import listening from "./media/fabel.wav?inline";
import { esc } from "./practice";
import type { Lesson } from "./types";

export function renderMaterial(lesson: Lesson): string {
	const text = `<p class="material">${esc(lesson.material)}</p>`;
	if (lesson.id === "d5-fabelhoeren")
		return `<p>Hör den Text zuerst. Notiere beim zweiten Hören wichtige Hinweise. Die Textfassung hilft dir beim Nachprüfen.</p><audio controls preload="none" aria-label="Hörgeschichte mit Computerstimme" src="${esc(listening)}"></audio><details><summary>Hörtext als Text</summary>${text}</details>`;
	if (lesson.id === "d5-zuhoeren") {
		return `<p>Hör die Durchsage zuerst. Schreib beim zweiten Hören die wichtigsten Stichwörter auf.</p>
			<audio controls preload="none" aria-label="Durchsage aus der Schulbücherei" src="${esc(announcement)}"></audio>
			<details><summary>Durchsage als Text</summary>${text}</details>`;
	}
	if (lesson.id === "d5-sachtext") {
		return `<table class="material-table">
			<caption>Plan für den Büchertausch</caption>
			<thead><tr><th scope="col">Tag</th><th scope="col">Was?</th><th scope="col">Wo?</th></tr></thead>
			<tbody><tr><th scope="row">Dienstag</th><td>Abgabe</td><td>Aula</td></tr>
			<tr><th scope="row">Donnerstag</th><td>Auswahl</td><td>Bücherei</td></tr></tbody>
		</table>${text}`;
	}
	return text;
}
