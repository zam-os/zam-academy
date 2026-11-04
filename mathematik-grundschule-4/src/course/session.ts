import { isWorldLesson } from "./worlds";
import { freshWorkshop, stepWorkshop, validWorkshop } from "./workshop";
import { quantityText, quantityNote } from "./quantity";
import { DATABASE, DocumentStore } from "../storage/progress";
import type { ForestLesson } from "./catalog";
import { combinationCode, validCombinationChoice } from "./combinations";
import {
	investigationInput,
	isInvestigation,
	validInvestigationWork,
} from "./investigations";
import {
	activeForestTask,
	advanceForest,
	type ForestProgress,
	forestKey,
	forestRecallEligible,
	freshForest,
	recordForest,
	startForestPractice,
	validForest,
} from "./progress";
import { type Answer, forestInput, forestMistake } from "./tasks";
import {
	forestGraphic,
	forestLessonView,
	forestParentView,
	forestTeacherPanel,
} from "./view";
import {
	additionColumns,
	columnAnswer,
	columnOrder,
	columnValidation,
	emptyColumnWork,
} from "./written-addition";
import {
	algorithmAnswer,
	algorithmModel,
	algorithmValidation,
	isWrittenAlgorithm,
} from "./written-algorithms";
import {
	freshSubtractionWork,
	subtractionAnswer,
	subtractionValidation,
	unbundleSubtraction,
} from "./written-subtraction";
export type ForestEvent = "correct" | "encourage" | "reward" | "snack";
export class ForestSession {
	readonly store: DocumentStore<ForestProgress>;
	feedback = "";
	draft = "";
	busy = false;
	private key = "";
	private actionQueue: Promise<void> = Promise.resolve();
	private opening: Promise<void> | null = null;
	private rangeRevision = 0;
	private editingRange = false;
	private columnRevision = 0;
	private columnScroll = new Map<string, number>();
	private editingColumns = false;
	private columnDraft: { key: string; values: string[] } | null = null;
	private rangeDraft: { key: string; position: number } | null = null;
	private writtenDraft: {
		key: string;
		kind: "subtraction" | "algorithm" | "investigation";
		values: string[];
	} | null = null;
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
		let current =
			this.columnDraft?.key === key
				? { ...this.store.state, columnWork: this.columnDraft.values }
				: this.store.state;
		if (this.writtenDraft?.key === key) {
			if (this.writtenDraft.kind === "investigation")
				current = { ...current, investigationWork: this.writtenDraft.values };
			else if (this.writtenDraft.kind === "algorithm")
				current = { ...current, algorithmWork: this.writtenDraft.values };
			else {
				const task = activeForestTask(current);
				if (task?.subtraction)
					current = {
						...current,
						subtractionWork: {
							...(current.subtractionWork ??
								freshSubtractionWork(task.subtraction.a)),
							result: this.writtenDraft.values,
						},
					};
			}
		}
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
		root
			.querySelectorAll<HTMLElement>(".column-scroll")
			.forEach((scroller, index) => {
				const key = `${forestKey(this.store.state)}/${index}`;
				scroller.scrollLeft =
					this.columnScroll.get(key) ?? scroller.scrollWidth;
				scroller.addEventListener("scroll", () => {
					this.columnScroll.set(key, scroller.scrollLeft);
				});
			});
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
		root
			.querySelectorAll<HTMLInputElement>(
				'[data-action="forest-subtract-digit"]',
			)
			.forEach((input) => {
				const cells = () => [
					...root.querySelectorAll<HTMLInputElement>(
						'[data-action="forest-subtract-digit"]',
					),
				];
				input.addEventListener("click", () => input.select());
				input.addEventListener("focus", () => {
					cells().forEach((cell) => {
						cell.tabIndex = cell === input ? 0 : -1;
					});
					input.select();
				});
				input.addEventListener("keydown", (event) => {
					if (event.key !== "Tab") return;
					const col = Number(input.dataset.col) + (event.shiftKey ? -1 : 1);
					const next = cells().find((cell) => Number(cell.dataset.col) === col);
					if (next) {
						event.preventDefault();
						next.focus();
					}
				});
				input.addEventListener("input", () => {
					const value = input.value,
						index = Number(input.dataset.col),
						key = forestKey(this.store.state);
					const error = root.querySelector("#subtraction-input-error");
					if (!/^[0-9]?$/.test(value)) {
						input.setAttribute("aria-invalid", "true");
						if (error)
							error.textContent =
								"Pro Ergebnisfeld nur eine Ziffer. Bitte verbessere die markierte Zelle.";
						return;
					}
					input.removeAttribute("aria-invalid");
					if (error && !root.querySelector('[aria-invalid="true"]'))
						error.textContent = "";

					const currentTask = activeForestTask(this.store.state);
					if (!currentTask?.subtraction) return;
					const values = [
						...(this.writtenDraft?.key === key &&
						this.writtenDraft.kind === "subtraction"
							? this.writtenDraft.values
							: (
									this.store.state.subtractionWork ??
									freshSubtractionWork(currentTask.subtraction.a)
								).result),
					];
					values[index] = value;
					this.writtenDraft = { key, kind: "subtraction", values };

					this.editingColumns = true;
					const revision = ++this.columnRevision;
					let failed = false;
					void this.store
						.update((p) => {
							const task = activeForestTask(p);
							if (forestKey(p) !== key || !task?.subtraction) return;
							p.subtractionWork ??= freshSubtractionWork(task.subtraction.a);
							p.subtractionWork.result[index] = value;
						})
						.catch(() => {
							failed = true;
							this.feedback =
								"Die Ziffer konnte nicht gespeichert werden. Probiere es noch einmal.";
						})
						.finally(() => {
							if (revision !== this.columnRevision) return;
							this.editingColumns = false;
							this.writtenDraft = null;
							if (failed) this.notify();
						});
				});
			});
		root
			.querySelectorAll<HTMLInputElement>('[data-action="forest-algorithm"]')
			.forEach((input) => {
				const cells = () => [
					...root.querySelectorAll<HTMLInputElement>(
						'[data-action="forest-algorithm"]',
					),
				];
				input.addEventListener("click", () => input.select());
				input.addEventListener("focus", () => {
					cells().forEach((cell) => {
						cell.tabIndex = cell === input ? 0 : -1;
					});
					input.select();
				});
				input.addEventListener("keydown", (event) => {
					if (event.key !== "Tab") return;
					const next = cells().find(
						(cell) =>
							Number(cell.dataset.col) ===
							Number(input.dataset.col) + (event.shiftKey ? -1 : 1),
					);
					if (next) {
						event.preventDefault();
						next.focus();
					}
				});
				input.addEventListener("input", () => {
					const value = input.value,
						index = Number(input.dataset.col),
						max = Number(input.dataset.max),
						key = forestKey(this.store.state);
					const error = root.querySelector("#algorithm-input-error");
					if (
						value !== "" &&
						(!/^(0|[1-9][0-9]?)$/.test(value) || Number(value) > max)
					) {
						input.setAttribute("aria-invalid", "true");
						if (error)
							error.textContent = `Hier passt eine ganze Zahl von 0 bis ${max}.`;
						return;
					}
					input.removeAttribute("aria-invalid");
					if (error && !root.querySelector('[aria-invalid="true"]'))
						error.textContent = "";
					root
						.querySelectorAll<HTMLElement>(
							`.algorithm-preview[data-from="${index}"]`,
						)
						.forEach((span) => {
							span.textContent = value || "?";
						});

					const currentTask = activeForestTask(this.store.state);
					if (!currentTask?.algorithm) return;
					const values = [
						...(this.writtenDraft?.key === key &&
						this.writtenDraft.kind === "algorithm"
							? this.writtenDraft.values
							: (this.store.state.algorithmWork ??
								algorithmModel(currentTask.algorithm).fields.map(() => ""))),
					];
					values[index] = value;
					this.writtenDraft = { key, kind: "algorithm", values };

					this.editingColumns = true;
					const revision = ++this.columnRevision;
					let failed = false;
					void this.store
						.update((p) => {
							const task = activeForestTask(p);
							if (forestKey(p) !== key || !task?.algorithm) return;
							p.algorithmWork ??= algorithmModel(task.algorithm).fields.map(
								() => "",
							);
							p.algorithmWork[index] = value;
						})
						.catch(() => {
							failed = true;
							this.feedback =
								"Der Rechenschritt konnte nicht gespeichert werden. Probiere es noch einmal.";
						})
						.finally(() => {
							if (revision !== this.columnRevision) return;
							this.editingColumns = false;
							this.writtenDraft = null;
							if (failed) this.notify();
						});
				});
			});
		root
			.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
				'[data-action="forest-investigation"]',
			)
			.forEach((input) => {
				input.addEventListener("input", () => {
					if (
						input instanceof HTMLInputElement &&
						input.type === "radio" &&
						!input.checked
					)
						return;
					const currentTask = activeForestTask(this.store.state);
					if (!currentTask?.investigation) return;
					const board = currentTask.investigation,
						index = Number(input.dataset.col),
						value = input.value,
						key = forestKey(this.store.state);
					const error = root.querySelector("#investigation-error");
					if (
						!validInvestigationWork([value], {
							...board,
							fields: [board.fields[index]],
						})
					) {
						input.setAttribute("aria-invalid", "true");
						if (error)
							error.textContent = quantityNote(board.fields[index].format);
						return;
					}
					input.removeAttribute("aria-invalid");
					if (error && !root.querySelector('[aria-invalid="true"]'))
						error.textContent = "";
					const values = [
						...(this.writtenDraft?.key === key &&
						this.writtenDraft.kind === "investigation"
							? this.writtenDraft.values
							: (this.store.state.investigationWork ??
								board.fields.map(() => ""))),
					];
					values[index] = value;
					this.writtenDraft = { key, kind: "investigation", values };
					this.editingColumns = true;
					const revision = ++this.columnRevision;
					let failed = false;
					void this.store
						.update((p) => {
							const task = activeForestTask(p);
							if (forestKey(p) !== key || !task?.investigation) return;
							p.investigationWork ??= task.investigation.fields.map(() => "");
							p.investigationWork[index] = value;
						})
						.catch(() => {
							failed = true;
							this.feedback =
								"Dein Schritt konnte nicht gespeichert werden. Probiere es noch einmal.";
						})
						.finally(() => {
							if (revision !== this.columnRevision) return;
							this.editingColumns = false;
							this.writtenDraft = null;
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
	act(button: HTMLButtonElement, root: HTMLElement): Promise<void> {
		if (
			this.lesson.id !== "systematisch-kombinieren" &&
			this.lesson.id !== "teiler-vielfache" &&
			!isWorldLesson(this.lesson.id)
		)
			return this.actNow(button, root);
		const key = forestKey(this.store.state);
		const next = this.actionQueue.then(async () => {
			if (forestKey(this.store.state) !== key) return;
			await this.actNow(button, root);
		});
		this.actionQueue = next.catch(() => {});
		return next;
	}
	private async actNow(
		button: HTMLButtonElement,
		root: HTMLElement,
	): Promise<void> {
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
		const algorithmValues = task?.algorithm
			? [
					...(this.writtenDraft?.key === key &&
					this.writtenDraft.kind === "algorithm"
						? this.writtenDraft.values
						: (this.store.state.algorithmWork ??
							algorithmModel(task.algorithm).fields.map(() => ""))),
				]
			: [];
		root
			.querySelectorAll<HTMLInputElement>('[data-action="forest-algorithm"]')
			.forEach((cell) => {
				algorithmValues[Number(cell.dataset.col)] = cell.value;
			});
		const investigationValues = task?.investigation
			? [
					...(this.writtenDraft?.key === key &&
					this.writtenDraft.kind === "investigation"
						? this.writtenDraft.values
						: (this.store.state.investigationWork ??
							task.investigation.fields.map(() => ""))),
				]
			: [];
		root
			.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
				'[data-action="forest-investigation"]',
			)
			.forEach((cell) => {
				if (
					!(cell instanceof HTMLInputElement) ||
					cell.type !== "radio" ||
					cell.checked
				)
					investigationValues[Number(cell.dataset.col)] = cell.value;
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
					if (isWrittenAlgorithm(p.lesson)) p.algorithmWork = null;
					if (isInvestigation(p.lesson) || isWorldLesson(p.lesson))
						p.investigationWork = null;
					if (isWorldLesson(p.lesson)) p.modelWork = null;
					if (p.lesson === "systematisch-kombinieren") {
						p.combinationChoice = null;
						p.selection = [];
					}
					if (p.lesson === "schriftlich-subtrahieren") p.subtractionWork = null;
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
				if (
					task.subtraction &&
					(action === "forest-unbundle" || action === "forest-reset-bundles")
				) {
					p.subtractionWork ??= freshSubtractionWork(task.subtraction.a);
					root
						.querySelectorAll<HTMLInputElement>(
							'[data-action="forest-subtract-digit"]',
						)
						.forEach((cell) => {
							if (/^[0-9]?$/.test(cell.value) && p.subtractionWork)
								p.subtractionWork.result[Number(cell.dataset.col)] = cell.value;
						});
					const bundles =
						action === "forest-reset-bundles"
							? freshSubtractionWork(task.subtraction.a).bundles
							: unbundleSubtraction(
									p.subtractionWork.bundles,
									Number(button.dataset.col),
								);
					if (bundles) p.subtractionWork.bundles = bundles;
					this.feedback = "";
					return;
				}

				if (
					task.model?.scene.chart?.collection &&
					action === "forest-data-observe"
				) {
					const m = task.model,
						c = task.model.scene.chart,
						state = [...(p.modelWork ?? freshWorkshop(m))],
						col = c.labels.length;
					if (state[col] < (c.observations?.length ?? 0)) state[col]++;
					if (validWorkshop(state, m)) p.modelWork = state;
					this.feedback = "";
					return;
				}
				if (
					task.model?.scene.experiment &&
					[
						"forest-experiment-predict",
						"forest-experiment-draw",
						"forest-experiment-conclude",
						"forest-experiment-change",
					].includes(action ?? "")
				) {
					const m = task.model,
						e = task.model.scene.experiment,
						state = [...(p.modelWork ?? freshWorkshop(m))];
					if (
						action === "forest-experiment-change" &&
						e.variable &&
						state[1] === 0
					) {
						const delta = Number(button.dataset.value);
						if ([-1, 1].includes(delta)) {
							state[5] = Math.max(
								1,
								Math.min(e.variable.total - 1, state[5] + delta),
							);
							state[0] = 0;
						}
					}
					if (action === "forest-experiment-predict" && state[1] === 0)
						state[0] = Number(button.dataset.value);
					if (
						action === "forest-experiment-draw" &&
						state[0] > 0 &&
						state[1] < e.draws &&
						(!e.variable || state[5] === e.red)
					)
						state[1]++;
					if (
						action === "forest-experiment-conclude" &&
						state[1] === e.draws &&
						[3, 4].includes(Number(button.dataset.col))
					)
						state[Number(button.dataset.col)] = Number(button.dataset.value);
					if (validWorkshop(state, m)) p.modelWork = state;
					this.feedback = "";
					return;
				}

				if (task.model && action === "forest-model-set") {
					const state = [...(p.modelWork ?? freshWorkshop(task.model))],
						col = Number(button.dataset.col);
					if (
						!Number.isInteger(col) ||
						!task.model.controls[col] ||
						task.model.controls[col].locked
					)
						return;
					state[col] = (state[col] + 1) % (task.model.controls[col].max + 1);
					if (validWorkshop(state, task.model)) p.modelWork = state;
					this.feedback = "";
					return;
				}

				if (
					task.model &&
					(action === "forest-model" || action === "forest-model-reset")
				) {
					p.modelWork =
						action === "forest-model-reset"
							? freshWorkshop(task.model)
							: stepWorkshop(
									task.model,
									p.modelWork ?? freshWorkshop(task.model),
									Number(button.dataset.col),
									Number(button.dataset.value),
								);
					this.feedback = "";
					return;
				}
				if (task.combination) {
					if (action === "forest-combination-choice") {
						const axis = Number(button.dataset.col),
							value = Number(button.dataset.value);
						const choice = [
							...(p.combinationChoice ?? task.combination.axes.map(() => -1)),
						];
						if (!Number.isInteger(axis) || !task.combination.axes[axis]) return;
						choice[axis] = value;
						if (validCombinationChoice(choice, task.combination))
							p.combinationChoice = choice;
						this.feedback = "";
						return;
					}
					if (action === "forest-combination-add") {
						if (
							!p.combinationChoice ||
							p.combinationChoice.some((n) => n < 0)
						) {
							this.feedback =
								"Wähle zuerst in jeder Reihe genau eine Möglichkeit.";
							return;
						}
						const code = combinationCode(p.combinationChoice);
						if (p.selection.includes(code))
							this.feedback =
								"Diese Zusammenstellung steht schon in deiner Liste. Gleiche Möglichkeiten zählen nur einmal.";
						else {
							p.selection.push(code);
							this.feedback =
								"Eingetragen. Wechsle jetzt eine Auswahl und gehe systematisch weiter.";
						}
						return;
					}
					if (action === "forest-combination-remove") {
						p.selection = p.selection.filter(
							(n) => n !== Number(button.dataset.value),
						);
						this.feedback = "";
						return;
					}
				}
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
					if (
						(task.kind === "parts" || task.kind === "divisors") &&
						p.selection.includes(value)
					)
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
					if (action === "forest-check" && task.subtraction) {
						p.subtractionWork ??= freshSubtractionWork(task.subtraction.a);
						root
							.querySelectorAll<HTMLInputElement>(
								'[data-action="forest-subtract-digit"]',
							)
							.forEach((cell) => {
								if (p.subtractionWork)
									p.subtractionWork.result[Number(cell.dataset.col)] =
										cell.value;
							});
						const notice = subtractionValidation(
							task.subtraction.a,
							task.subtraction.b,
							p.subtractionWork,
						);
						if (notice) {
							// Malformed input is validation and is never persisted.
							if (
								p.subtractionWork.result.some(
									(value) => !/^[0-9]?$/.test(value),
								)
							)
								p.subtractionWork.result = p.subtractionWork.result.map(
									(value) => (/^[0-9]?$/.test(value) ? value : ""),
								);
							this.feedback = notice;
							return;
						}
					}
					if (action === "forest-check" && task.algorithm) {
						const notice = algorithmValidation(task.algorithm, algorithmValues),
							model = algorithmModel(task.algorithm);
						p.algorithmWork = algorithmValues.map((value, i) =>
							value === "" ||
							(/^(0|[1-9][0-9]?)$/.test(value) &&
								Number(value) <= model.fields[i].max)
								? value
								: "",
						);
						if (notice) {
							this.feedback = notice;
							return;
						}
					}
					if (action === "forest-check" && task.investigation) {
						if (validInvestigationWork(investigationValues, task.investigation))
							p.investigationWork = investigationValues;
						if (
							investigationInput(task.investigation, investigationValues) ===
							null
						) {
							this.feedback = forestMistake(task, null);
							return;
						}
					}
					if (
						action === "forest-check" &&
						(task.combination || task.kind === "divisors") &&
						p.selection.length === 0
					) {
						this.feedback = forestMistake(task, null);
						return;
					}

					if (action === "forest-check" && task.model?.scene.experiment) {
						const state = p.modelWork ?? freshWorkshop(task.model),
							e = task.model.scene.experiment;
						if (
							!state[0] ||
							state[1] < e.draws ||
							!state[3] ||
							!state[4] ||
							(e.variable && state[5] !== e.red)
						) {
							this.feedback =
								"Wähle eine Vermutung, führe alle Ziehungen durch und beantworte danach beide Fragen zu den Chancen.";
							return;
						}
					}
					if (
						action === "forest-check" &&
						task.model?.scene.chart?.collection
					) {
						const c = task.model.scene.chart,
							state = p.modelWork ?? freshWorkshop(task.model);
						if (state[c.labels.length] < (c.observations?.length ?? 0)) {
							this.feedback =
								"Decke erst alle Beobachtungen auf und trage ihre Häufigkeiten in die Säulen ein.";
							return;
						}
					}
					let answer: Answer | null;
					if (action === "forest-worked") {
						if (!p.helped.includes(key) || !explanationShown) return;

						if (task.model?.scene.experiment) {
							const state = p.modelWork ?? freshWorkshop(task.model),
								e = task.model.scene.experiment;
							if (!state[0] || state[1] < e.draws) {
								this.feedback =
									"Wähle zuerst deine eigene Vermutung und führe alle Ziehungen durch. Danach können wir die Auswertung gemeinsam vervollständigen.";
								return;
							}
							answer = [...task.model.target];
							answer[0] = state[0];
						} else answer = task.answer;
					} else if (action === "forest-choice")
						answer = Number(button.dataset.value);
					else if (task.model)
						answer = p.modelWork ?? freshWorkshop(task.model);
					else if (task.investigation)
						answer = investigationInput(
							task.investigation,
							investigationValues,
						);
					else if (task.algorithm)
						answer = algorithmAnswer(task.algorithm, algorithmValues);
					else if (task.subtraction)
						answer = subtractionAnswer(
							task.subtraction.a,
							task.subtraction.b,
							p.subtractionWork ?? freshSubtractionWork(task.subtraction.a),
						);
					else if (task.kind === "columns" && task.columns)
						answer = columnAnswer(task.columns.a, task.columns.b, columnValues);
					else if (
						task.kind === "parts" ||
						task.kind === "order" ||
						task.kind === "divisors" ||
						task.kind === "combinations"
					)
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
					if (right && task.subtraction && Array.isArray(task.answer))
						p.subtractionWork = {
							result: task.answer.slice(0, 7).map(String),
							bundles: task.answer.slice(7),
						};
					if (right && task.combination && Array.isArray(task.answer))
						p.selection = [...task.answer];
					if (right && task.investigation && Array.isArray(task.answer))
						p.investigationWork = task.answer.map((n, i) =>
							quantityText(n, task.investigation?.fields[i].format),
						);
					if (right && task.model && action === "forest-worked")
						p.modelWork = Array.isArray(answer)
							? [...answer]
							: [...task.model.target];
					if (right && task.algorithm && Array.isArray(task.answer))
						p.algorithmWork = task.answer.map(String);
					event = right ? "correct" : "encourage";
					this.feedback = right
						? task.explanation
						: forestMistake(task, answer);
				}
			});
		} finally {
			this.busy = false;
			this.notify(event);
			if (action === "forest-unbundle" || action === "forest-reset-bundles") {
				const col = Number(button.dataset.col);
				const buttons = [
					...root.querySelectorAll<HTMLButtonElement>(
						'[data-action="forest-unbundle"]',
					),
				];
				const next =
					buttons.find(
						(cell) => Number(cell.dataset.col) === col && !cell.disabled,
					) ??
					buttons.find(
						(cell) => Number(cell.dataset.col) < col && !cell.disabled,
					) ??
					root.querySelector<HTMLInputElement>("#subtraction-0");
				next?.focus({ preventScroll: true });
			}
		}
	}
}
