import type { ProjectStep } from "./model/types";

export const PROJECT_FIELDS = {
  place: { label: "Öffentlicher Ort oder Untersuchungsgebiet", step: "question", min: 3 },
  event: {
    label: "Ökosystem: früherer und heutiger Zustand, untersuchter Eingriff",
    step: "question",
    min: 20,
  },
  eventDate: {
    label: "Datum deines aktuellen Beobachtungs- oder Dokumentationsstands",
    step: "question",
    min: 10,
    date: true,
  },
  question: { label: "Deine biologische Untersuchungsfrage zum Wandel", step: "question", min: 20 },
  sourceA: { label: "Fachliche oder amtliche Quelle · URL", step: "evidence", min: 1, url: true },
  sourceADate: {
    label: "Datum der Fachquelle oder des dokumentierten Abrufs",
    step: "evidence",
    min: 10,
    date: true,
  },
  sourceB: {
    label: "Zweite geeignete Quelle oder öffentliches historisches Dokument · URL",
    step: "evidence",
    min: 1,
    url: true,
  },
  sourceBDate: {
    label: "Datum der zweiten Quelle oder des dokumentierten Abrufs",
    step: "evidence",
    min: 10,
    date: true,
  },
  map: {
    label: "Vergleichsgrundlage: Lage, Zeitraum, Jahreszeit, Daten oder Abbildung mit Herkunft",
    step: "evidence",
    min: 40,
  },
  findings: {
    label: "Konkrete Belege, Herkunft und Grenzen der beiden Quellen; Beziehungen im Ökosystem",
    step: "evidence",
    min: 60,
  },
  judgment: {
    label: "Dein Urteil: Beleg, Maßstab, Abwägung und mögliche Handlung",
    step: "judgment",
    min: 80,
  },
  limits: {
    label: "Unsicherheiten oder offene Fragen deiner Untersuchung",
    step: "judgment",
    min: 30,
  },
  presentation: {
    label: "Plan für deine Präsentation: Aufbau, geeignete Darstellung, Quellen und Besprechung",
    step: "judgment",
    min: 40,
  },
} satisfies Record<
  string,
  { label: string; step: ProjectStep; min: number; date?: boolean; url?: boolean }
>;
export type ProjectField = keyof typeof PROJECT_FIELDS;
export type BioProject = Record<ProjectField, string>;
export function freshProject(): BioProject {
  return Object.fromEntries(Object.keys(PROJECT_FIELDS).map((key) => [key, ""])) as BioProject;
}
export function sanitizeProject(value: unknown): BioProject {
  const project = freshProject();
  if (!value || typeof value !== "object" || Array.isArray(value)) return project;
  for (const key of Object.keys(PROJECT_FIELDS) as ProjectField[]) {
    const raw = (value as Record<string, unknown>)[key];
    if (typeof raw === "string") project[key] = raw.slice(0, 4000);
  }
  return project;
}
export function sourceUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (
      !["http:", "https:"].includes(url.protocol) ||
      !url.hostname ||
      url.username ||
      url.password
    )
      return null;
    url.hash = "";
    return url.href;
  } catch {
    return null;
  }
}
/** The learner's calendar day as YYYY-MM-DD; UTC would lag behind German dates after midnight. */
export function localDateString(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
export function validProjectDate(value: string, today = localDateString()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < "1900-01-01" || value > today) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function missingProjectFields(
  project: BioProject,
  step: ProjectStep,
  today?: string,
): ProjectField[] {
  const steps: ProjectStep[] = ["question", "evidence", "judgment"];
  const allowed = steps.slice(0, steps.indexOf(step) + 1);
  const missing = (Object.keys(PROJECT_FIELDS) as ProjectField[]).filter((key) => {
    const def: { step: ProjectStep; min: number; date?: boolean; url?: boolean } =
      PROJECT_FIELDS[key];
    if (!allowed.includes(def.step)) return false;
    const value = project[key].trim();
    return (
      value.length < def.min ||
      (def.date && !validProjectDate(value, today)) ||
      (def.url && !sourceUrl(value))
    );
  });
  if (
    allowed.includes("evidence") &&
    sourceUrl(project.sourceA) &&
    sourceUrl(project.sourceA) === sourceUrl(project.sourceB) &&
    !missing.includes("sourceB")
  )
    missing.push("sourceB");
  return missing;
}
export const projectReady = (project: BioProject, step: ProjectStep, today?: string): boolean =>
  missingProjectFields(project, step, today).length === 0;
