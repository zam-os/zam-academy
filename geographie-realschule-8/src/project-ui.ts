import { esc } from "./practice";
import {
	type GeoProject,
	localDateString,
	missingProjectFields,
	PROJECT_FIELDS,
	type ProjectField,
} from "./project";
import type { Lesson } from "./types";

export function projectStatus(lesson: Lesson, project: GeoProject): string {
	if (!lesson.projectStep) return "";
	const missing = missingProjectFields(project, lesson.projectStep);
	return missing.length
		? `Noch offen oder ungültig: ${missing.map((key) => PROJECT_FIELDS[key].label).join("; ")}. Frage und Belege bearbeitest du in der ersten Projektlektion.`
		: "✓ Die benötigten Felder sind formal ausgefüllt. Prüfe Inhalt, Aktualität, Unabhängigkeit der Quellen und Urteil selbst oder gemeinsam im Unterricht.";
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
	).filter(([, def]) =>
		lesson.projectStep === "evidence"
			? def.step !== "judgment"
			: def.step === "judgment",
	);
	return `<section class="panel project"><span class="eyebrow">DEIN REALES AKTUELLES PROJEKT</span><h2>Deine Untersuchung festhalten</h2><p>Beide Projektlektionen verwenden diesen gemeinsamen Bogen. Die Notizen bleiben in diesem Browser. Bitte nur öffentliche Ortsangaben und keine persönlichen Daten eintragen.</p>${fields.map(([key, def]) => `<label class="project-field" for="project-${key}">${esc(def.label)}${def.date ? `<input id="project-${key}" data-project="${key}" type="date" min="1900-01-01" max="${localDateString()}" value="${esc(project[key])}">` : def.url ? `<input id="project-${key}" data-project="${key}" type="url" maxlength="4000" placeholder="https://…" value="${esc(project[key])}">` : `<textarea id="project-${key}" data-project="${key}" rows="${def.min > 30 ? 4 : 2}" maxlength="4000">${esc(project[key])}</textarea>`}</label>`).join("")}<p class="feedback hint small" id="project-status" role="status">${esc(projectStatus(lesson, project))}</p><p class="small">Die App prüft nur ausgefüllte Felder, Datumsformate und zwei unterschiedliche Webadressen. Sie ruft die Adressen nicht ab und bestätigt weder Tatsachen noch die Präsentation. Alte Daten dürfen einen weiterhin aktuellen Vorgang betreffen; begründe den aktuellen Anlass.</p></section>`;
}
