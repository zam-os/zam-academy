import schoolyard from "./media/schulhof.mp3?inline";
import workshop from "./media/buecherwagen.mp3?inline";
import calmBus from "./media/bus-ruhig.mp3?inline";
import tenseBus from "./media/bus-spannung.mp3?inline";
import { esc } from "./practice";
import type { Lesson } from "./types";

const listeningClips: Record<string, string> = {
	"d8-hoertext-deutung": schoolyard,
	"d8-mitschrift": workshop,
};

function player(label: string, audio: string): string {
	return `<p><strong>${esc(label)}</strong></p><audio controls preload="none" aria-label="${esc(label)}" src="${esc(audio)}"></audio>`;
}

export function renderMaterial(lesson: Lesson): string {
	const text = `<p class="material">${esc(lesson.material)}</p>`;
	const clip = listeningClips[lesson.id];
	if (clip)
		return `<p>Höre zuerst ohne Text. Notiere beim Wiederholen Schlüsselangaben. Die Stimme ist computergeneriert.</p>${player(lesson.title, clip)}<details><summary>Hörtext anzeigen</summary>${text}</details>`;
	if (lesson.id === "d8-ton-und-film")
		return `${text}<p>Höre beide Varianten. Achte auf den Beginn, die Sprechweise und das Geräusch vor dem Satz. Die Stimmen und Geräusche sind computergeneriert.</p>${player("Variante A · ruhige Ansage", calmBus)}${player("Variante B · Motor und Pause", tenseBus)}`;
	return text;
}
