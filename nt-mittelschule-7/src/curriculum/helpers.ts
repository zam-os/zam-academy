import type {
	ExerciseGenerator,
	LabDefinition,
	Lesson,
	QuizQuestion,
	Stage,
	Track,
} from "../model/types";

export type Check = [
	question: string,
	correct: string,
	distractor1: string,
	distractor2: string,
	explanation: string,
	numeric?: [value: number, unit: string, digits: number],
];
type Pair = [guided: Check, transfer: Check];

function exercise(id: string, pair: Pair, rule: string): ExerciseGenerator {
	return {
		id,
		make(rng, level) {
			const [prompt, correct, ...rest] = pair[level - 1];
			const [wrong1, wrong2, explanation, numeric] = rest;
			const options = [wrong1, wrong2];
			const correctIndex = rng.int(0, 2);
			options.splice(correctIndex, 0, correct);
			return {
				prompt,
				given: [],
				formulaHint: level === 1 ? rule : undefined,
				fields: numeric
					? [
							{
								kind: "number",
								label: "Deine Antwort",
								answer: numeric[0],
								unit: numeric[1],
								digits: numeric[2],
								tolerance: 0,
							},
						]
					: [{ kind: "choice", label: "Deine Antwort", options, correctIndex }],
				steps: [
					"Vergleiche die Aussagen mit dem Modell oder Merksatz.",
					explanation,
					"<strong>" + correct + "</strong>",
				],
			};
		},
	};
}

type LessonData = {
	id: string;
	title: string;
	subtitle: string;
	text: [string, string];
	rule: string;
	quiz: Check;
	practice: [Pair, Pair, Pair];
	lab: LabDefinition;
	tracks?: Track[];
};

export function makeStage(
	stage: Omit<Stage, "lessons">,
	section: string,
	area: number,
	data: LessonData[],
): Stage {
	const lessons: Lesson[] = data.map((entry, i) => {
		const {
			id,
			title,
			subtitle,
			text,
			rule,
			quiz,
			practice,
			lab,
			tracks = ["R", "M"],
		} = entry;
		const [question, correct, wrong1, wrong2, explanation] = quiz;
		const quickCheck: QuizQuestion = {
			question,
			options: [correct, wrong1, wrong2],
			correctIndex: 0,
			explanation,
		};
		return {
			id,
			title,
			subtitle,
			lab,
			tracks,
			stageId: stage.id,
			stepNumber: i + 1,
			lehrplan:
				tracks.map((track) => track + "7").join(" und ") + " · NT " + section,
			bindings: Object.fromEntries(tracks.map((track) => [track, area])),
			whyItMatters: subtitle,
			explanationHtml:
				"<p>" +
				text[0] +
				"</p><div class='example'><strong>Beispiel</strong><p>" +
				text[1] +
				"</p></div><div class='merke'><strong>Merksatz</strong><p>" +
				rule +
				"</p></div>",
			formulas: [{ name: title, html: rule, quantities: subtitle }],
			quiz: quickCheck,
			exercises: practice.map((pair, index) =>
				exercise(id + "-" + (index + 1), pair, rule),
			),
			requiredCorrect: 3,
			celebrationMessage: "",
		};
	});
	return { ...stage, lessons };
}
