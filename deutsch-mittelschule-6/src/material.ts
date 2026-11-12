import listening from "./media/detektivgeschichte.wav?inline";
import { esc } from "./practice";
import type { Lesson } from "./types";

const filmFrames = `<div class="film-frames">
	<figure>
		<svg viewBox="0 0 240 120" role="img" aria-label="Heller Hof, die ganze Figur ist vor dem Schuppen zu sehen">
			<rect width="240" height="120" fill="#bce1ef"/>
			<circle cx="39" cy="27" r="13" fill="#f5c761"/>
			<path d="M0 83h240v37H0z" fill="#89ad78"/>
			<path d="M148 48h74v54h-74z" fill="#aa7253"/>
			<path d="M139 50l44-25 47 25z" fill="#624436"/>
			<path d="M175 58h26v44h-26z" fill="#775a4c"/>
			<circle cx="94" cy="66" r="7" fill="#634235"/>
			<path d="M94 74v14m0-11 10 7m-10 4-7 13m7-13 8 13" fill="none" stroke="#314564" stroke-width="5" stroke-linecap="round"/>
		</svg>
		<figcaption>A · Totale</figcaption>
	</figure>
	<figure>
		<svg viewBox="0 0 240 120" role="img" aria-label="Im Dunkeln ist nur eine Hand am Türgriff zu sehen">
			<rect width="240" height="120" fill="#382e39"/>
			<path d="M28 0v120m60-120v120m60-120v120m60-120v120" stroke="#554150" stroke-width="5"/>
			<rect x="146" y="35" width="20" height="46" rx="6" fill="#c49e75"/>
			<path d="M154 57h-40" stroke="#e0c29e" stroke-width="9" stroke-linecap="round"/>
			<path d="M40 120l43-52q12-17 28-21l19 3q7 7-2 12l-16 2-14 16 6 7-25 33z" fill="#ae7c69"/>
			<path d="M114 75l9 7m-17 4 8 8" stroke="#e0c29e" stroke-width="2" stroke-linecap="round"/>
		</svg>
		<figcaption>B · Detailaufnahme</figcaption>
	</figure>
</div>`;

export function renderMaterial(lesson: Lesson): string {
	const text = `<p class="material">${esc(lesson.material)}</p>`;
	if (lesson.id === "d6-detektivgeschichte")
		return `<p>Hör den Text zuerst. Notiere beim zweiten Hören wichtige Hinweise. Die Textfassung hilft dir beim Nachprüfen.</p><audio controls preload="none" aria-label="Hörgeschichte mit Computerstimme" src="${esc(listening)}"></audio><details><summary>Hörtext als Text</summary>${text}</details>`;
	if (lesson.id === "d6-film") return filmFrames + text;
	if (lesson.id === "d6-sachtext") {
		return `<table class="material-table">
			<caption>Plan für den Büchertausch</caption>
			<thead><tr><th scope="col">Tag</th><th scope="col">Was?</th><th scope="col">Wo?</th></tr></thead>
			<tbody><tr><th scope="row">Dienstag</th><td>Abgabe</td><td>Aula</td></tr>
			<tr><th scope="row">Donnerstag</th><td>Auswahl</td><td>Bücherei</td></tr></tbody>
		</table>${text}`;
	}
	return text;
}
