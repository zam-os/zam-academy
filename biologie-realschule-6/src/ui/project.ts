import type { Lesson } from "../model/types";
import {
	type BioProject,
	localDateString,
	missingProjectFields,
	PROJECT_FIELDS,
	type ProjectField,
} from "../project";
import { esc } from "../workshop";
export function projectStatus(lesson: Lesson, project: BioProject): string {
	const missing = missingProjectFields(project, lesson.projectStep!);
	return missing.length
		? `Noch offen oder ungültig: ${missing.map((key) => PROJECT_FIELDS[key].label).join("; ")}. Frühere Schritte findest du in „Ein Ökosystem vor deiner Haustür“ und „Ein Lebensraum verändert sich“.`
		: "✓ Die Felder sind formal ausgefüllt. Prüfe deine Beobachtungen und Schlussfolgerungen selbst oder gemeinsam im Unterricht.";
}
export function renderProject(lesson: Lesson, project: BioProject): string {
	const fields = (
		Object.entries(PROJECT_FIELDS) as Array<
			[
				ProjectField,
				{ label: string; step: string; min: number; date?: boolean },
			]
		>
	).filter(([, def]) => def.step === lesson.projectStep);
	return `<section class="panel project"><span class="eyebrow">DEIN FELDBOGEN</span><h2>Deine Untersuchung festhalten</h2><p>Drei Lektionen verwenden denselben Bogen. Trage nur Angaben zu öffentlichen Orten ein. Du kannst auch bereitgestellte Beobachtungen aus dem Unterricht nutzen und ihre Herkunft nennen.</p>${fields.map(([key, def]) => `<label class="project-field" for="project-${key}">${esc(def.label)}${def.date ? `<input id="project-${key}" data-project="${key}" type="date" min="1900-01-01" max="${localDateString()}" value="${esc(project[key])}">` : `<textarea id="project-${key}" data-project="${key}" rows="3" maxlength="4000">${esc(project[key])}</textarea>`}</label>`).join("")}<p class="feedback hint small" id="project-status" role="status">${esc(projectStatus(lesson, project))}</p><p class="small">Deine Texte bleiben in diesem Browser. Geprüft werden nur ausgefüllte Felder und das Datum. Eine reale Untersuchung und ein gehaltener Vortrag werden damit nicht bestätigt.</p></section>`;
}
