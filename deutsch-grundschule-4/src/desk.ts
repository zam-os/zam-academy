import { esc } from "./format";
import { MAX_TEXT } from "./storage/texts";
import type { Lesson } from "./types";

/** The free writing field of a lesson. The stored text is escaped like any other. */
export function deskHtml(lessonId: string, desk: NonNullable<Lesson["desk"]>, text: string): string {
	return `<section class="card desk" id="desk-card">
	<h2>✍️ Dein Schreibtisch</h2>
	<p class="small">Freiwillig und ohne Stern. Tinto liest nicht mit und gibt keine Noten.</p>
	<details class="desk-info small">
		<summary><span aria-hidden="true">ⓘ</span> Wo bleibt mein Text?</summary>
		<p>Dein Text bleibt nur in diesem Browser auf diesem Gerät. Niemand sonst bekommt ihn. Hast du dein eigenes Benutzerkonto oder teilst du es mit anderen? Falls du es teilst, lösche am Ende deinen Text oder setze unter „Für Eltern“ alles zurück.</p>
	</details>
	<p>${esc(desk.task)}</p>
	<label for="desk-text" class="small">Dein Text</label>
	<textarea id="desk-text" data-lesson="${esc(lessonId)}" rows="8" maxlength="${MAX_TEXT}" autocomplete="off" spellcheck="false">${esc(text)}</textarea>
	<p id="desk-status" class="small" role="status"></p>
	<h3>Prüfe selbst</h3>
	<ul class="desk-check">${desk.checklist.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
	<p class="small">Zeige deinen Text auch jemandem: Was ist gelungen? Was könntest du noch ändern?</p>
	<button type="button" class="text-button" data-action="desk-clear">Text löschen</button>
</section>`;
}
