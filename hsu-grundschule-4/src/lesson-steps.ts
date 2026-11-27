import { renderLottaSvg, type LottaMood } from "./companion/lotta";
import { escapeHtml } from "./model/format";
import type { LabGoal, Lesson } from "./model/types";
import type { CouncilPhase } from "./labs/council";

type Content =
	| { kind: "discover"; index: number }
	| { kind: "quiz" }
	| { kind: "lab"; goal: LabGoal }
	| { kind: "council"; goal: LabGoal; phase: CouncilPhase }
	| { kind: "practice"; level: 1 | 2 }
	| { kind: "book" };

export type LessonStep = Content & { label: string; prompt: string };
export interface LottaReaction {
	mood: LottaMood;
	message: string;
}

export function lessonSteps(lesson: Lesson): LessonStep[] {
	const steps: LessonStep[] = lesson.factCards.map((card, index) => ({
		kind: "discover",
		index,
		label: card.title,
		prompt: card.lottaPrompt,
	}));
	steps.push({
		kind: "quiz",
		label: "Schlaufuchs-Check",
		prompt: "Welche Antwort passt? Ich bin gespannt auf deine Idee.",
	});
	for (const goal of lesson.lab.goals) {
		if (goal.controls.includes("vorschlag")) {
			steps.push(
				{
					kind: "council",
					goal,
					phase: "places",
					label: "Zwei Orte vergleichen",
					prompt: goal.lottaPrompt,
				},
				{
					kind: "council",
					goal,
					phase: "voices",
					label: "Menschen befragen",
					prompt:
						"Frag zwei Menschen im Dorf. Was ist ihnen an diesem Ort wichtig?",
				},
				{
					kind: "council",
					goal,
					phase: "proposal",
					label: "Im Gemeinderat",
					prompt:
						"Welchen Ort schlägst du vor? Überlege, wem deine Idee hilft.",
				},
			);
		} else {
			steps.push({
				kind: "lab",
				goal,
				label: goal.label,
				prompt: goal.lottaPrompt,
			});
		}
	}
	steps.push(
		{
			kind: "practice",
			level: 1,
			label: "Spürnase",
			prompt:
				"Jetzt bist du dran. Wenn du eine Spur brauchst, frag mich nach einem Tipp.",
		},
		{
			kind: "practice",
			level: 2,
			label: "Proben-Profi",
			prompt: "Ein neuer Fall! Was kannst du von eben dafür nutzen?",
		},
		{
			kind: "book",
			label: "Mein Forscherbuch",
			prompt: "Schau in dein Forscherbuch. Was hast du schon entdeckt?",
		},
	);
	return steps;
}

export function firstMissingLabStep(steps: LessonStep[], reached: readonly string[]): number {
	return steps.findIndex((s) => (s.kind === "lab" || s.kind === "council") && !reached.includes(s.goal.id));
}

export function renderLottaPanel(reaction: LottaReaction): string {
	return `<aside class="lesson-lotta" aria-label="Deine Begleiterin Lotta" data-mood="${reaction.mood}">
		<div class="lotta-portrait" aria-hidden="true">${renderLottaSvg(reaction.mood)}</div>
		<div class="lotta-bubble"><strong>Lotta</strong><p>${escapeHtml(reaction.message)}</p></div>
	</aside>`;
}
