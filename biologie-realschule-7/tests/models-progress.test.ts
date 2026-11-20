import { expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import type { ModelKind } from "../src/model/types";
import { MODEL_SCENARIOS, modelReady, recordExploration } from "../src/models";
import { completion, freshProgress, isComplete, parseProgress } from "../src/storage/progress";
import { renderModel } from "../src/ui/models";
import { canAcceptSelfAssessment, canReviewDraft } from "../src/workshop";

const kinds = Object.keys(MODEL_SCENARIOS) as ModelKind[];
it.each(kinds)("%s has reachable model goals and a different drawing for each state", (kind) => {
	const lesson = LESSONS.find((entry) => entry.model === kind)!;
	let explored: string[] = [];
	expect(modelReady(kind, explored)).toBe(false);
	expect(recordExploration(kind, explored)).toEqual([]);
	expect(recordExploration(kind, explored, "invalid")).toEqual([]);
	expect(renderModel(lesson, explored)).toContain('id="record-model" disabled');
	const drawings = new Set<string>();
	for (const scenario of MODEL_SCENARIOS[kind]) {
		const html = renderModel(lesson, explored, scenario.id);
		expect(html).toContain(`aria-pressed="true" data-model-case="${scenario.id}"`);
		const svg = html.match(/<svg[\s\S]*<\/svg>/)?.[0] ?? "";
		expect(svg).toContain("viewBox");
		drawings.add(svg.replace(/<title.*?<\/title>/, ""));
		expect(recordExploration(kind, [], scenario.id)).toEqual([scenario.id]);
		explored = recordExploration(kind, explored, scenario.id);
		expect(recordExploration(kind, explored, scenario.id)).toEqual(explored);
	}
	expect(drawings.size).toBe(MODEL_SCENARIOS[kind].length);
	expect(modelReady(kind, explored)).toBe(true);
});

it("handles corrupt or stale browser progress and keeps the two levels separate", () => {
	expect(parseProgress("{")).toEqual(freshProgress());
	const id = "b7-ohr";
	const draft = "Die Knöchelchen leiten Schwingungen weiter.";
	const data = parseProgress(JSON.stringify({
		activeLessonId: "b6-mikroskop",
		level: 2,
		explored: { [id]: ["outer", "middle", "inner", "invalid"], invalid: ["outer"] },
		quizDone: [id, id, "invalid"], workshopDone: [id],
		writingDone: [`${id}:1`, `${id}:2`], drafts: { [`${id}:2`]: draft },
	}));
	expect(data.activeLessonId).toBe(LESSONS[0].id);
	expect(data.level).toBe(2);
	expect(data.explored).toEqual({ [id]: ["outer", "middle", "inner"] });
	expect(data.quizDone).toEqual([id]);
	expect(data.writingDone).toEqual([`${id}:2`]);
	expect(isComplete(data, id)).toBe(false);
	data.writingDone.push(`${id}:1`);
	expect(isComplete(data, id)).toBe(true);
	expect(completion(data).completed).toBe(1);
	expect(canReviewDraft("kurz")).toBe(false);
	expect(canAcceptSelfAssessment(draft, [true, false, true])).toBe(false);
	expect(canAcceptSelfAssessment(draft, [true, true, true])).toBe(true);
});
