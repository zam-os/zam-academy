import { DocumentStore, DATABASE } from "../storage/progress";
import type { ForestLesson } from "./catalog";
import {
	activeForestTask,
	advanceForest,
	forestKey,
	forestRecallEligible,
	freshForest,
	recordForest,
	startForestPractice,
	validForest,
	type ForestProgress,
} from "./progress";
import { forestInput, forestMistake, type Answer } from "./tasks";
import {
	forestGraphic,
	forestLessonView,
	forestParentView,
	forestTeacherPanel,
} from "./view";
export type ForestEvent = "correct" | "encourage" | "reward" | "snack";
export class ForestSession {
	readonly store: DocumentStore<ForestProgress>;
	feedback = "";
	draft = "";
	busy = false;
	private key = "";
	private opening: Promise<void> | null = null;
	private rangeRevision = 0;
	private editingRange = false;
	private rangeDraft: { key: string; position: number } | null = null;
	constructor(
		readonly lesson: ForestLesson,
		private notify: (event?: ForestEvent) => void,
		databaseName = `${DATABASE}-${lesson.id}`,
	) {
		this.store = new DocumentStore(
			databaseName,
			() => freshForest(lesson.id),
			(value): value is ForestProgress =>
				validForest(value) && value.lesson === lesson.id,
		);
		this.store.onChange = () => {
			if (!this.editingRange) notify();
		};
	}
	open(): Promise<void> {
		this.opening ??= this.store.open();
		return this.opening;
	}
	lessonView(): string {
		const key = forestKey(this.store.state);
		if (key !== this.key) {
			this.key = key;
			this.feedback = "";
			this.draft = "";
		}
		return forestLessonView(
			this.lesson,
			this.rangeDraft?.key === key
				? { ...this.store.state, position: this.rangeDraft.position }
				: this.store.state,
			this.feedback,
			this.draft,
		);
	}
	parentView(): string {
		return forestParentView(this.lesson, this.store.state);
	}
	teacherPanel(): string {
		return forestTeacherPanel(this.lesson);
	}
	bind(root: HTMLElement): void {
		const input = root.querySelector<HTMLInputElement>("#forest-answer");
		input?.addEventListener("input", () => {
			this.draft = input.value;
		});
		input?.addEventListener("keydown", (event) => {
			if (event.key === "Enter")
				root
					.querySelector<HTMLButtonElement>('[data-action="forest-check"]')
					?.click();
		});
		const range = root.querySelector<HTMLInputElement>("#forest-position");
		range?.addEventListener("input", () => {
			this.editingRange = true;
			this.rangeRevision += 1;
			this.rangeDraft = {
				key: forestKey(this.store.state),
				position: Number(range.value),
			};
			const task = activeForestTask(this.store.state),
				host = root.querySelector<HTMLElement>("#forest-graphic");
			if (task && host)
				host.innerHTML = forestGraphic(task, Number(range.value));
		});
		range?.addEventListener("change", () => {
			const value = Number(range.value),
				key = forestKey(this.store.state),
				revision = this.rangeRevision;
			void this.store
				.update((p) => {
					if (forestKey(p) === key) p.position = value;
				})
				.catch(() => {
					this.feedback =
						"Der Schritt konnte nicht gespeichert werden. Probiere es noch einmal.";
				})
				.finally(() => {
					if (revision !== this.rangeRevision) return;
					this.editingRange = false;
					this.rangeDraft = null;
					this.notify();
				});
		});
	}
	async act(button: HTMLButtonElement, root: HTMLElement): Promise<void> {
		if (this.busy) return;
		const action = button.dataset.action,
			key = forestKey(this.store.state),
			task = activeForestTask(this.store.state),
			explanationShown = task && this.feedback === task.explanation;
		const input = root.querySelector<HTMLInputElement>("#forest-answer");
		if (input) this.draft = input.value;
		let event: ForestEvent | undefined;
		this.busy = true;
		try {
			await this.store.update((p) => {
				if (action === "rest") {
					p.resting = !p.resting;
					return;
				}
				if (action === "snack") {
					if (
						p.rewards.includes("mission-b") &&
						!p.consumed.includes("mission-b")
					) {
						p.consumed.push("mission-b");
						p.resting = false;
						event = "snack";
					}
					return;
				}
				if (forestKey(p) !== key || p.resting) return;
				if (action === "forest-practice") {
					startForestPractice(
						p,
						button.dataset.level === "2" ? 2 : 1,
						crypto.getRandomValues(new Uint32Array(1))[0],
					);
					return;
				}
				if (action === "forest-stop" && p.optional) {
					p.optional = null;
					p.index = 0;
					return;
				}
				if (
					action === "forest-recall" &&
					forestRecallEligible(p) &&
					!p.recall &&
					!p.optional
				) {
					p.recall = {
						seed: crypto.getRandomValues(new Uint32Array(1))[0],
						at: Date.now(),
						index: 0,
					};
					return;
				}
				if (action === "forest-next") {
					const before = p.rewards.length;
					if (advanceForest(p) && p.rewards.length > before) event = "reward";
					return;
				}
				if (!task || p.attempts.some((a) => a.key === key && a.outcome)) return;
				if (action === "forest-hint" || action === "forest-solution") {
					if (!p.helped.includes(key)) p.helped.push(key);
					p.helped = p.helped.slice(-1000);
					this.feedback =
						action === "forest-hint" ? task.hint : task.explanation;
					event = "encourage";
					return;
				}
				if (action === "forest-left" || action === "forest-right") {
					p.position = Math.max(
						0,
						Math.min(10, p.position + (action === "forest-left" ? -1 : 1)),
					);
					return;
				}
				if (action === "forest-select") {
					const value = Number(button.dataset.value);
					if (!task.numbers?.includes(value)) return;
					if (task.kind === "parts" && p.selection.includes(value))
						p.selection = p.selection.filter((n) => n !== value);
					else if (!p.selection.includes(value)) p.selection.push(value);
					return;
				}
				if (action === "forest-back") {
					p.selection.pop();
					return;
				}
				if (action === "forest-clear") {
					p.selection = [];
					return;
				}
				if (
					action === "forest-check" ||
					action === "forest-choice" ||
					action === "forest-worked"
				) {
					let answer: Answer | null;
					if (action === "forest-worked") {
						if (!p.helped.includes(key) || !explanationShown) return;
						answer = task.answer;
					} else if (action === "forest-choice")
						answer = Number(button.dataset.value);
					else if (task.kind === "parts" || task.kind === "order")
						answer = [...p.selection];
					else if (task.kind === "line" || task.kind === "split")
						answer = p.position;
					else answer = forestInput(this.draft);
					const right = recordForest(p, task, answer);
					event = right ? "correct" : "encourage";
					this.feedback = right
						? task.explanation
						: forestMistake(task, answer);
				}
			});
		} finally {
			this.busy = false;
			this.notify(event);
		}
	}
}
