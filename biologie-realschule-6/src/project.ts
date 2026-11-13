import type { ProjectStep } from "./model/types";
export const PROJECT_FIELDS = {
	place: {
		label: "Öffentliches Untersuchungsgebiet und Umgebung, keine Privatadresse",
		step: "question",
		min: 5,
	},
	question: {
		label: "Deine Frage zu Licht, Feuchte oder Lebewesen",
		step: "question",
		min: 20,
	},
	date: { label: "Beobachtungsdatum", step: "question", min: 10, date: true },
	conditions: {
		label: "Wetter, Jahreszeit, Messorte und verwendete Methode",
		step: "evidence",
		min: 30,
	},
	observations: {
		label:
			"Beobachtungen oder Messwerte mit Einheiten; Vermutungen getrennt notieren",
		step: "evidence",
		min: 40,
	},
	source: {
		label: "Herkunft deiner Daten oder Name deiner Bestimmungshilfe",
		step: "evidence",
		min: 10,
	},
	judgment: {
		label:
			"Zwei Handlungsoptionen, mögliche Folgen und dein entscheidendes Kriterium",
		step: "judgment",
		min: 60,
	},
	limits: {
		label: "Offene Frage und eine mögliche Fehlerquelle",
		step: "judgment",
		min: 25,
	},
	presentation: {
		label:
			"Plan für einen kurzen Vortrag: Frage, Beleg, Antwort; dein eigenes Handeln",
		step: "judgment",
		min: 40,
	},
} satisfies Record<
	string,
	{ label: string; step: ProjectStep; min: number; date?: boolean }
>;
export type ProjectField = keyof typeof PROJECT_FIELDS;
export type BioProject = Record<ProjectField, string>;
export const freshProject = (): BioProject =>
	Object.fromEntries(
		Object.keys(PROJECT_FIELDS).map((key) => [key, ""]),
	) as BioProject;
export function sanitizeProject(value: unknown): BioProject {
	const project = freshProject();
	if (!value || typeof value !== "object" || Array.isArray(value))
		return project;
	for (const key of Object.keys(PROJECT_FIELDS) as ProjectField[]) {
		const raw = (value as Record<string, unknown>)[key];
		if (typeof raw === "string") project[key] = raw.slice(0, 4000);
	}
	return project;
}
/** Use the learner's calendar day rather than UTC at local midnight. */
export function localDateString(now = new Date()): string {
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
export function validProjectDate(
	value: string,
	today = localDateString(),
): boolean {
	if (
		!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
		value < "1900-01-01" ||
		value > today
	)
		return false;
	const date = new Date(`${value}T12:00:00Z`);
	return (
		Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
	);
}
export function missingProjectFields(
	project: BioProject,
	step: ProjectStep,
	today?: string,
): ProjectField[] {
	const steps: ProjectStep[] = ["question", "evidence", "judgment"];
	const allowed = steps.slice(0, steps.indexOf(step) + 1);
	return (Object.keys(PROJECT_FIELDS) as ProjectField[]).filter((key) => {
		const def: { step: ProjectStep; min: number; date?: boolean } =
			PROJECT_FIELDS[key];
		return (
			allowed.includes(def.step) &&
			(project[key].trim().length < def.min ||
				(def.date && !validProjectDate(project[key], today)))
		);
	});
}
export const projectReady = (
	project: BioProject,
	step: ProjectStep,
	today?: string,
): boolean => missingProjectFields(project, step, today).length === 0;
