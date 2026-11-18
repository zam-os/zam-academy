import type { Lesson } from "../model/types";
import {
	type GeoProject,
	localDateString,
	missingProjectFields,
	PROJECT_FIELDS,
	type ProjectField,
} from "../project";
import { esc } from "../workshop";

export function projectStatus(lesson: Lesson, project: GeoProject): string {
	const missing = missingProjectFields(project, lesson.projectStep!);
	return missing.length
		? `Prüfe noch diese Felder. ${missing.map((key) => PROJECT_FIELDS[key].label).join(" · ")}`
		: "✓ Die nötigen Felder sind ausgefüllt.";
}
export function renderProject(lesson: Lesson, project: GeoProject): string {
	const fields = (
		Object.entries(PROJECT_FIELDS) as Array<
			[
				ProjectField,
				{
					label: string;
					step: string;
					min: number;
					date?: boolean;
					url?: boolean;
				},
			]
		>
	).filter(
		([, def]) =>
			def.step === lesson.projectStep ||
			(lesson.projectStep === "evidence" && def.step === "question"),
	);
	const country = lesson.projectStep === "country";
	return `<section class="panel project"><h2>${country ? "Dein Länderporträt" : "Dein Recherchebogen"}</h2><p>${
		country
			? "Trage Land und Lage jetzt ein. Ergänze die übrigen Felder über das Jahr mit deiner Frage, dem Befund und der Quelle."
			: "Wähle ein aktuelles Ereignis und verwende öffentliche Ortsangaben. Eigene Notizen bleiben in diesem Browser."
	}</p>${lesson.projectStep === "judgment" ? '<button type="button" class="text-button" data-open="aktuelles-quellen">Zurück zu Frage und Quellen</button>' : ""}${fields.map(([key, def]) => `<label class="project-field" for="project-${key}">${esc(def.label)}${def.date ? `<input id="project-${key}" data-project="${key}" type="date" min="1900-01-01" max="${localDateString()}" value="${esc(project[key])}">` : def.url ? `<input id="project-${key}" data-project="${key}" type="url" maxlength="4000" placeholder="https://…" value="${esc(project[key])}">` : `<textarea id="project-${key}" data-project="${key}" rows="${def.min > 30 ? 4 : 2}" maxlength="4000">${esc(project[key])}</textarea>`}</label>`).join("")}<p class="feedback hint small" id="project-status" role="status">${esc(projectStatus(lesson, project))}</p>${country ? "" : '<p class="small">Prüfe Inhalt, Unabhängigkeit der Quellen und Aktualität selbst. Die App öffnet keine eingegebenen Adressen.</p>'}</section>`;
}
