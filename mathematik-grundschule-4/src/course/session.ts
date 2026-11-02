import {
	columnAnswer,
	columnValidation,
	columnOrder,
	additionColumns,
	emptyColumnWork,
} from "./written-addition";
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
	private columnRevision = 0;
	private columnScroll: { key: string; left: number } | null = null;
	private editingColumns = false;
	private columnDraft: { key: string; values: string[] } | null = null;
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
			if (!this.editingRange && !this.editingColumns) notify();
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
		const current =
			this.columnDraft?.key === key
				? { ...this.store.state, columnWork: this.columnDraft.values }
				: this.store.state;
		return forestLessonView(
			this.lesson,
			this.rangeDraft?.key === key
				? { ...current, position: this.rangeDraft.position }
				: current,
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
		const scroller = root.querySelector<HTMLElement>(".column-scroll");
		if (scroller) {
			const key = forestKey(this.store.state);
			scroller.scrollLeft =
				this.columnScroll?.key === key
					? this.columnScroll.left
					: scroller.scrollWidth;
			scroller.addEventListener("scroll", () => {
				this.columnScroll = { key, left: scroller.scrollLeft };
			});
		}
		root
			.querySelectorAll<HTMLInputElement>('[data-action="forest-column"]')
			.forEach((input) => {
				const all = () => [
					...root.querySelectorAll<HTMLInputElement>(
						'[data-action="forest-column"]',
					),
				];
				input.addEventListener("click", () => input.select());
				input.addEventListener("focus", () => {
					all().forEach((cell) => {
						cell.tabIndex = cell === input ? 0 : -1;
					});
					input.select();
				});
				input.addEventListener("keydown", (event) => {
					if (event.key !== "Tab") return;
					const task = activeForestTask(this.store.state);
					if (!task?.columns) return;
					const order = columnOrder(
						additionColumns(task.columns.a, task.columns.b).width,
					);
					const position =
						order.indexOf(Number(input.dataset.col)) +
						(event.shiftKey ? -1 : 1);
					const next = all().find(
						(cell) => Number(cell.dataset.col) === order[position],
					);
					if (next) {
						event.preventDefault();
						next.focus();
					}
				});
				input.addEventListener("input", () => {
					const index = Number(input.dataset.col),
						value = input.value,
						key = forestKey(this.store.state);
					const allowed = index < 7 ? /^[0-9]?$/ : /^[01]?$/;
					if (!allowed.test(value)) {
						input.setAttribute("aria-invalid", "true");
						const note = root.querySelector("#column-input-error");
						if (note)
							note.textContent =
								"Pro Ergebnisfeld nur eine Ziffer, pro Übertrag nur 0 oder 1. Bitte verbessere die markierte Zelle.";
						return;
					}
					input.removeAttribute("aria-invalid");
					const errorNote = root.querySelector("#column-input-error");
					if (errorNote && !root.querySelector('[aria-invalid="true"]'))
						errorNote.textContent = "";
					const values = [
						...(this.columnDraft?.key === key
							? this.columnDraft.values
							: (this.store.state.columnWork ?? emptyColumnWork())),
					];
					values[index] = value;
					this.columnDraft = { key, values };
					this.editingColumns = true;
					const revision = ++this.columnRevision;
					let failed = false;
					void this.store
						.update((p) => {
							if (
								forestKey(p) === key &&
								p.lesson === "schriftlich-addieren" &&
								p.columnWork
							)
								p.columnWork[index] = value;
						})
						.catch(() => {
							failed = true;
							this.feedback =
								"Die Ziffer konnte nicht gespeichert werden. Probiere es noch einmal.";
						})
						.finally(() => {
							if (revision !== this.columnRevision) return;
							this.editingColumns = false;
							this.columnDraft = null;
							// A successful digit save changes no other UI. Keep the input node and focus.
							if (failed) this.notify();
						});
				});
			});
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
		const columnValues = [
			...(this.columnDraft?.key === key
				? this.columnDraft.values
				: (this.store.state.columnWork ?? emptyColumnWork())),
		];
		root
			.querySelectorAll<HTMLInputElement>('[data-action="forest-column"]')
			.forEach((cell) => {
				columnValues[Number(cell.dataset.col)] = cell.value;
			});
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
					if (
						action === "forest-check" &&
						task.kind === "columns" &&
						task.columns
					) {
						const notice = columnValidation(
							task.columns.a,
							task.columns.b,
							columnValues,
						);
						if (notice) {
							this.feedback = notice;
							return;
						}
					}
					let answer: Answer | null;
					if (action === "forest-worked") {
						if (!p.helped.includes(key) || !explanationShown) return;
						answer = task.answer;
					} else if (action === "forest-choice")
						answer = Number(button.dataset.value);
					else if (task.kind === "columns" && task.columns)
						answer = columnAnswer(task.columns.a, task.columns.b, columnValues);
					else if (task.kind === "parts" || task.kind === "order")
						answer = [...p.selection];
					else if (
						task.kind === "line" ||
						task.kind === "split" ||
						task.kind === "hops" ||
						task.kind === "groups"
					)
						answer = p.position;
					else answer = forestInput(this.draft);
					if (answer === null) {
						this.feedback = forestMistake(task, null);
						return;
					}
					const right = recordForest(p, task, answer);
					if (right && task.kind === "columns" && Array.isArray(task.answer))
						p.columnWork = task.answer.map(String);
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
