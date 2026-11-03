import { isWorldLesson } from "../src/course/worlds";
import { freshWorkshop } from "../src/course/workshop";
import { quantityText } from "../src/course/quantity";
import { FOREST_LESSONS } from "../src/course/catalog";
import {
	allowedCombination,
	combinationCode,
	combinationTuple,
	combinationTuples,
} from "../src/course/combinations";
import { INVESTIGATION_IDS } from "../src/course/investigations";
import {
	activeForestTask,
	freshForest,
	independentForest,
	validForest,
} from "../src/course/progress";
import { ForestSession } from "../src/course/session";
import { algorithmModel } from "../src/course/written-algorithms";
import {
	bundleValue,
	freshSubtractionWork,
	subtractionColumns,
} from "../src/course/written-subtraction";
import { ulid } from "../src/id";
import { fresh, grant } from "../src/practice/evidence";
import {
	DATABASE,
	DocumentStore,
	ProgressStore,
	STORAGE_VERSION,
} from "../src/storage/progress";

const required = <T>(value: T | null | undefined): T => {
	if (value == null) throw new Error("Expected test value");
	return value;
};

const output = document.querySelector<HTMLPreElement>("#results");
if (!output) throw new Error("Test output missing");
const run = document.querySelector<HTMLButtonElement>("#run");
if (!run) throw new Error("Test button missing");
const assert = (condition: unknown, label: string) => {
	if (!condition) throw new Error(label);
	output.textContent += `\nPASS ${label}`;
};

run.addEventListener("click", async (event) => {
	(event.target as HTMLButtonElement).disabled = true;
	output.textContent = "Isolated native IndexedDB integration tests";
	const name = `${DATABASE}-test-${ulid()}`;
	const stores: { close(): void }[] = [];
	const extraNames = [
		`${name}-comparison`,
		`${name}-line`,
		`${name}-range`,
		`${name}-written`,
		`${name}-numeric`,
		`${name}-subtraction`,
		`${name}-multiply`,
		`${name}-divide`,
		`${name}-muster-zahlbeziehungen`,
		`${name}-sachaufgaben-mehrschrittig`,
		`${name}-teiler-vielfache`,
		`${name}-combinations`,
	];
	try {
		const a = new ProgressStore(name);
		const b = new ProgressStore(name);
		stores.push(a, b);
		await a.open();
		await b.open();
		assert(
			a.mode === "persistent" && b.mode === "persistent",
			"Native storage opens",
		);
		await Promise.all([
			a.update((p) => grant(p, "mission-a", 1000)),
			b.update((p) => grant(p, "mission-b", 2000)),
		]);
		const c = new ProgressStore(name);
		stores.push(c);
		await c.open();
		assert(
			c.state.rewards.length === 2 &&
				!!c.state.completed["mission-a"] &&
				!!c.state.completed["mission-b"],
			"Concurrent transactions preserve both rewards",
		);
		await Promise.all(
			Array.from({ length: 10 }, () =>
				a.update((p) => grant(p, "mission-a", 3000)),
			),
		);
		const d = new ProgressStore(name);
		stores.push(d);
		await d.open();
		assert(
			d.state.rewards.length === 2 && d.state.completed["mission-a"] === 1000,
			"Repeated and cross-tab grants are idempotent",
		);
		await d.update((p) => {
			p.step = "build-large";
			p.workspace = [7, 4, 0, 2];
			p.resting = true;
		});
		const e = new ProgressStore(name);
		stores.push(e);
		await e.open();
		assert(
			e.state.step === "build-large" &&
				e.state.workspace[3] === 2 &&
				e.state.resting,
			"New instance resumes workspace and peaceful rest",
		);
		let interrupted = false;
		try {
			await e.update((p) => {
				p.consumed.push("mission-b");
				throw new Error("Injected transaction interruption");
			});
		} catch {
			interrupted = true;
		}
		const afterAbort = new ProgressStore(name);
		stores.push(afterAbort);
		await afterAbort.open();
		assert(
			interrupted &&
				afterAbort.state.consumed.length === 0 &&
				afterAbort.state.workspace[3] === 2,
			"Interrupted transaction leaves the previous state intact",
		);
		await e.update((p) => {
			p.resting = false;
		});
		const resumed = new ProgressStore(name);
		stores.push(resumed);
		await resumed.open();
		assert(
			resumed.state.resting === false && resumed.state.rewards.length === 2,
			"Write queue recovers after an aborted transaction",
		);
		stores.forEach((s) => {
			s.close();
		});
		const raw = await new Promise<IDBDatabase>((resolve, reject) => {
			const r = indexedDB.open(name, STORAGE_VERSION);
			r.onsuccess = () => resolve(r.result);
			r.onerror = () => reject(r.error);
		});
		await new Promise<void>((resolve, reject) => {
			const tx = raw.transaction("progress", "readwrite");
			tx.objectStore("progress").put(
				{ schema: 999, marker: "keep-original" },
				"learner",
			);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
		raw.close();
		const corrupt = new ProgressStore(name);
		stores.push(corrupt);
		await corrupt.open();
		assert(
			corrupt.mode === "recovery" &&
				(corrupt.raw as { marker: string }).marker === "keep-original",
			"Corrupt saved data is retained for recovery",
		);
		let refused = false;
		try {
			await corrupt.update((p) => {
				p.resting = false;
			});
		} catch {
			refused = true;
		}
		assert(
			refused && corrupt.mode === "recovery",
			"Recovery mode refuses implicit overwrite",
		);
		await corrupt.freshStart();
		assert(
			String(corrupt.mode) !== "recovery" && corrupt.state.step === "welcome",
			"Explicit fresh start recovers storage",
		);
		const memory = new ProgressStore(`${name}-disabled`);
		stores.push(memory);
		await memory.open({
			open() {
				throw new Error("blocked");
			},
		} as unknown as IDBFactory);
		await memory.update((p) => {
			p.step = "build-small";
		});
		assert(
			memory.mode === "memory" && memory.state.step === "build-small",
			"Blocked storage keeps an honest playable memory session",
		);
		const comparison = new DocumentStore(
			extraNames[0],
			() => freshForest("zahlen-vergleichen-ordnen"),
			validForest,
		);
		const line = new DocumentStore(
			extraNames[1],
			() => freshForest("zahlenstrahl-zahlenspruenge"),
			validForest,
		);
		stores.push(comparison, line);
		await comparison.open();
		await line.open();
		await comparison.update((p) => {
			p.stage = "lab";
			p.position = 7;
		});
		const comparisonAgain = new DocumentStore(
			extraNames[0],
			() => freshForest("zahlen-vergleichen-ordnen"),
			validForest,
		);
		stores.push(comparisonAgain);
		await comparisonAgain.open();
		assert(
			comparisonAgain.state.stage === "lab" &&
				comparisonAgain.state.position === 7,
			"New lesson progress resumes through the shared transactional store",
		);
		assert(
			line.state.stage === "welcome" &&
				line.state.position === 0 &&
				line.state.attempts.length === 0,
			"Switching lessons keeps progress and evidence isolated",
		);
		const rangeHost = document.createElement("section");
		document.body.append(rangeHost);
		const rangeSession = new ForestSession(
			FOREST_LESSONS[1],
			() => {
				rangeHost.innerHTML = rangeSession.lessonView();
				rangeSession.bind(rangeHost);
			},
			extraNames[2],
		);
		stores.push(rangeSession.store);
		await rangeSession.open();
		await rangeSession.store.update((p) => {
			p.stage = "lab";
			p.index = 1;
			p.labGoals = [0];
		});
		let range = rangeHost.querySelector<HTMLInputElement>("#forest-position");
		if (!range) throw new Error("Range missing");
		range.value = "1";
		range.dispatchEvent(new Event("input"));
		range.dispatchEvent(new Event("change"));
		range.value = "2";
		range.dispatchEvent(new Event("input"));
		await rangeSession.store.update(() => {});
		range = rangeHost.querySelector<HTMLInputElement>("#forest-position");
		assert(
			range?.value === "2",
			"A pending save cannot overwrite a newer range gesture",
		);
		range?.dispatchEvent(new Event("change"));
		await rangeSession.store.update(() => {});
		assert(
			rangeSession.store.state.position === 2,
			"The final range value is saved after the gesture",
		);
		rangeHost.remove();
		const writtenHost = document.createElement("section");
		document.body.append(writtenHost);
		const writtenDef = FOREST_LESSONS.find(
			(lesson) => lesson.id === "schriftlich-addieren",
		);
		if (!writtenDef) throw new Error("Written lesson missing");
		const writtenSession = new ForestSession(
			writtenDef,
			() => {
				writtenHost.innerHTML = writtenSession.lessonView();
				writtenSession.bind(writtenHost);
			},
			extraNames[3],
		);
		stores.push(writtenSession.store);
		await writtenSession.open();
		await writtenSession.store.update((p) => {
			p.stage = "lab";
		});
		const edit = (index: number, value: string) => {
			const cell = writtenHost.querySelector<HTMLInputElement>(
				`#column-${index}`,
			);
			if (!cell) throw new Error("Column missing");
			cell.value = value;
			cell.dispatchEvent(new Event("input"));
		};
		const firstCell = writtenHost.querySelector<HTMLInputElement>("#column-0");
		if (!firstCell) throw new Error("First column missing");
		firstCell.focus();
		let committed = () => {};
		const savedFirst = new Promise<void>((resolve) => {
			committed = resolve;
		});
		const priorChange = writtenSession.store.onChange;
		writtenSession.store.onChange = () => {
			priorChange?.();
			committed();
		};
		edit(0, "8");
		await savedFirst;
		writtenSession.store.onChange = priorChange;
		await new Promise<void>((resolve) => setTimeout(resolve, 0));
		assert(
			writtenHost.querySelector("#column-0") === firstCell &&
				document.activeElement === firstCell,
			"Saving a digit preserves the input node and keyboard focus",
		);
		edit(0, "8");
		edit(1, "6");
		await writtenSession.store.update(() => {});
		assert(
			writtenSession.store.state.columnWork?.[0] === "8" &&
				writtenSession.store.state.columnWork?.[1] === "6" &&
				writtenHost.querySelector<HTMLInputElement>("#column-1")?.value === "6",
			"Rapid column inputs preserve both digits and the newer visible value",
		);
		const writtenAgain = new DocumentStore(
			extraNames[3],
			() => freshForest("schriftlich-addieren"),
			validForest,
		);
		stores.push(writtenAgain);
		await writtenAgain.open();
		assert(
			writtenAgain.state.columnWork?.[0] === "8" &&
				writtenAgain.state.columnWork?.[1] === "6",
			"Written digits resume in a second native storage instance",
		);
		const keyCell = writtenHost.querySelector<HTMLInputElement>("#column-0");
		if (!keyCell) throw new Error("Keyboard cell missing");
		keyCell.focus();
		assert(
			keyCell.selectionStart === 0 && keyCell.selectionEnd === 1,
			"Focusing a filled digit selects its content for replacement",
		);
		keyCell.dispatchEvent(
			new KeyboardEvent("keydown", {
				key: "Tab",
				bubbles: true,
				cancelable: true,
			}),
		);
		const carryFocus = document.activeElement?.id;
		document.activeElement?.dispatchEvent(
			new KeyboardEvent("keydown", {
				key: "Tab",
				bubbles: true,
				cancelable: true,
			}),
		);
		assert(
			carryFocus === "column-7" && document.activeElement?.id === "column-1",
			"Tab follows result E, carry Z, result Z",
		);
		edit(2, "4");
		edit(3, "2");
		edit(7, "1");
		await writtenSession.store.update(() => {});
		const checkWritten = async () => {
			const button = writtenHost.querySelector<HTMLButtonElement>(
				'[data-action="forest-check"]',
			);
			if (!button) throw new Error("Written check missing");
			await writtenSession.act(button, writtenHost);
		};
		await checkWritten();
		assert(
			writtenSession.store.state.attempts.at(-1)?.outcome === false &&
				writtenSession.feedback.includes("kein voller Zehner") &&
				writtenSession.feedback.includes("leer oder schreibe 0"),
			"Correct sum digits with an incorrect carry do not pass the written task",
		);
		edit(7, "");
		await writtenSession.store.update(() => {});
		await checkWritten();
		assert(
			writtenSession.store.state.attempts.at(-1)?.outcome === true &&
				writtenSession.store.state.attempts.at(-1)?.helped === true,
			"Correct written work succeeds after correction and remains assisted",
		);
		await writtenSession.store.update((p) => {
			p.stage = "exit";
			p.index = 2;
			p.seed = 54321;
			p.labGoals = [0, 1, 2];
			p.quiz = true;
			p.solved = { 1: 3, 2: 3 };
			p.rewards = ["mission-a"];
			p.completed = { "mission-a": Date.now() };
			p.columnWork = Array<string>(13).fill("");
		});
		const exitTask = activeForestTask(writtenSession.store.state),
			beforeAttempts = writtenSession.store.state.attempts.length;
		if (!exitTask?.columns || !Array.isArray(exitTask.answer))
			throw new Error("Missing written exit");
		await checkWritten();
		assert(
			writtenSession.store.state.attempts.length === beforeAttempts,
			"An incomplete exit board does not spend an attempt",
		);
		for (const cell of writtenHost.querySelectorAll<HTMLInputElement>(
			'[data-action="forest-column"]',
		)) {
			const index = Number(cell.dataset.col);
			if (index < 7) edit(index, String(exitTask.answer[index]));
		}
		await writtenSession.store.update(() => {});
		await checkWritten();
		assert(
			writtenSession.store.state.attempts.length === beforeAttempts &&
				writtenSession.feedback.includes("Trage auch deine Überträge"),
			"A correct result with wholly blank carries gets an unrecorded completion notice",
		);
		for (const cell of writtenHost.querySelectorAll<HTMLInputElement>(
			'[data-action="forest-column"]',
		)) {
			const index = Number(cell.dataset.col);
			if (index >= 7)
				edit(
					index,
					exitTask.answer[index] === 0 ? "" : String(exitTask.answer[index]),
				);
		}
		await writtenSession.store.update(() => {});
		await checkWritten();
		const exitAttempt = writtenSession.store.state.attempts.at(-1);
		assert(
			exitAttempt &&
				independentForest(exitAttempt) &&
				writtenSession.store.state.attempts.length === beforeAttempts + 1,
			"Completing the exit after notices still records a first independent answer with visible blank zero carries",
		);
		writtenHost.remove();
		const subtractionHost = document.createElement("section");
		document.body.append(subtractionHost);
		const subtractionDef = FOREST_LESSONS.find(
			(lesson) => lesson.id === "schriftlich-subtrahieren",
		);
		if (!subtractionDef) throw new Error("Subtraction lesson missing");
		const subtractionSession = new ForestSession(
			subtractionDef,
			() => {
				subtractionHost.innerHTML = subtractionSession.lessonView();
				subtractionSession.bind(subtractionHost);
			},
			extraNames[5],
		);
		stores.push(subtractionSession.store);
		await subtractionSession.open();
		await subtractionSession.store.update((p) => {
			p.stage = "exit";
			p.index = 2;
			p.seed = 54321;
			p.labGoals = [0, 1, 2];
			p.quiz = true;
			p.solved = { 1: 3, 2: 3 };
			p.rewards = ["mission-a"];
			p.completed = { "mission-a": Date.now() };
		});
		const subtractTask = activeForestTask(subtractionSession.store.state);
		if (!subtractTask?.subtraction) throw new Error("Subtraction exit missing");
		const operands = subtractTask.subtraction,
			subtractModel = subtractionColumns(operands.a, operands.b);
		const subtractAct = async (action: string, col?: number) => {
			const button = subtractionHost.querySelector<HTMLButtonElement>(
				`[data-action="${action}"]${col === undefined ? "" : `[data-col="${col}"]`}`,
			);
			if (!button) throw new Error("Subtraction action missing");
			await subtractionSession.act(button, subtractionHost);
		};
		await subtractAct("forest-check");
		assert(
			subtractionSession.store.state.attempts.length === 0,
			"Incomplete subtraction input does not consume the exit attempt",
		);
		const editSubtract = (col: number, value: string) => {
			const input = subtractionHost.querySelector<HTMLInputElement>(
				`#subtraction-${col}`,
			);
			if (!input) throw new Error("Subtraction input missing");
			input.value = value;
			input.dispatchEvent(new Event("input"));
		};
		for (let col = 0; col < subtractModel.width; col++)
			editSubtract(col, String(subtractModel.result[col]));
		await subtractionSession.store.update(() => {});
		const firstSubtract =
			subtractionHost.querySelector<HTMLInputElement>("#subtraction-0");
		if (!firstSubtract) throw new Error("Subtraction focus missing");
		firstSubtract.focus();
		const subtractionPriorChange = subtractionSession.store.onChange;
		let subtractionCommitted = () => {};
		const subtractionSaved = new Promise<void>((resolve) => {
			subtractionCommitted = resolve;
		});
		subtractionSession.store.onChange = () => {
			subtractionPriorChange?.();
			subtractionCommitted();
		};
		editSubtract(0, String(subtractModel.result[0]));
		await subtractionSaved;
		subtractionSession.store.onChange = subtractionPriorChange;
		await new Promise<void>((resolve) => setTimeout(resolve, 0));
		assert(
			document.activeElement === firstSubtract &&
				subtractionHost.querySelector("#subtraction-0") === firstSubtract,
			"Saving subtraction digits preserves the input node and focus",
		);
		const changedDigit = String((subtractModel.result[0] + 1) % 10);
		editSubtract(0, changedDigit);
		subtractionHost.innerHTML = subtractionSession.lessonView();
		subtractionSession.bind(subtractionHost);
		assert(
			subtractionHost.querySelector<HTMLInputElement>("#subtraction-0")
				?.value === changedDigit,
			"A render before the subtraction commit keeps the newest digit",
		);
		editSubtract(0, String(subtractModel.result[0]));
		await subtractionSession.store.update(() => {});
		subtractionHost
			.querySelector<HTMLInputElement>("#subtraction-0")
			?.dispatchEvent(
				new KeyboardEvent("keydown", {
					key: "Tab",
					bubbles: true,
					cancelable: true,
				}),
			);
		assert(
			document.activeElement?.id === "subtraction-1",
			"Subtraction Tab order follows E then Z",
		);
		await subtractAct("forest-check");
		assert(
			subtractionSession.store.state.attempts.length === 0 &&
				subtractionSession.feedback.includes("Zeige auch das Entbündeln"),
			"A correct rest with missing regrouping gets an unrecorded completion notice",
		);
		for (const col of subtractModel.exchanges)
			await subtractAct("forest-unbundle", col);
		assert(
			bundleValue(
				subtractionSession.store.state.subtractionWork?.bundles ?? [],
			) === operands.a,
			"Native exchanges preserve the upper number across zero columns",
		);
		const subtractionAgain = new DocumentStore(
			extraNames[5],
			() => freshForest("schriftlich-subtrahieren"),
			validForest,
		);
		stores.push(subtractionAgain);
		await subtractionAgain.open();
		assert(
			JSON.stringify(subtractionAgain.state.subtractionWork) ===
				JSON.stringify(subtractionSession.store.state.subtractionWork),
			"Regrouped bundles and result digits resume in another native storage instance",
		);
		const extraExchange = subtractModel.bundles.findIndex(
			(n, col) => col > 0 && n > 0 && subtractModel.bundles[col - 1] <= 9,
		);
		if (extraExchange < 1) throw new Error("Extra exchange witness missing");
		await subtractAct("forest-unbundle", extraExchange);
		await subtractAct("forest-check");
		assert(
			subtractionSession.feedback.includes("Bündel zurücksetzen") &&
				subtractionSession.store.state.attempts.length === 0,
			"An unnecessary extra exchange directs the child to reset bundles without spending the correct exit",
		);
		await subtractAct("forest-reset-bundles");
		assert(
			JSON.stringify(
				subtractionSession.store.state.subtractionWork?.bundles,
			) === JSON.stringify(freshSubtractionWork(operands.a).bundles),
			"Resetting exchanges preserves the task and the typed result",
		);
		for (const col of subtractModel.exchanges)
			await subtractAct("forest-unbundle", col);
		await subtractAct("forest-check");
		const subtractionAttempt = subtractionSession.store.state.attempts.at(-1);
		assert(
			subtractionAttempt && independentForest(subtractionAttempt),
			"A completed subtraction correction after validation notices remains an independent first answer",
		);
		await subtractAct("forest-next");
		assert(
			subtractionSession.store.state.stage === "finished" &&
				subtractionSession.store.state.rewards.includes("mission-b") &&
				subtractionSession.store.state.subtractionWork === null,
			"Subtraction completion saves one mission reward and clears transient board work",
		);
		await subtractAct("forest-practice");
		editSubtract(0, "1");
		await subtractionSession.store.update(() => {});
		await subtractAct("forest-stop");
		assert(
			subtractionSession.store.state.optional === null &&
				subtractionSession.store.state.subtractionWork === null &&
				subtractionSession.store.state.rewards.length === 2,
			"Stopping a partly filled optional subtraction round keeps rewards and clears its board",
		);
		subtractionHost.remove();
		for (const [lessonIndex, lessonId] of (
			["schriftlich-multiplizieren", "schriftlich-dividieren"] as const
		).entries()) {
			const host = document.createElement("section");
			document.body.append(host);
			const def = FOREST_LESSONS.find((lesson) => lesson.id === lessonId);
			if (!def) throw new Error("Algorithm lesson missing");
			const session = new ForestSession(
				def,
				() => {
					host.innerHTML = session.lessonView();
					session.bind(host);
				},
				extraNames[6 + lessonIndex],
			);
			stores.push(session.store);
			await session.open();
			await session.store.update((p) => {
				p.stage = "lab";
				p.index = 1;
			});
			const task = activeForestTask(session.store.state);
			if (!task?.algorithm) throw new Error("Algorithm lab missing");
			const model = algorithmModel(task.algorithm);
			const editAlgorithm = (index: number, value: string) => {
				const input = host.querySelector<HTMLInputElement>(
					`#algorithm-${index}`,
				);
				if (!input) throw new Error("Algorithm input missing");
				input.value = value;
				input.dispatchEvent(new Event("input"));
			};
			const first = host.querySelector<HTMLInputElement>("#algorithm-0");
			if (!first) throw new Error("Algorithm focus missing");
			first.focus();
			let committed = () => {};
			const saved = new Promise<void>((resolve) => {
				committed = resolve;
			});
			const beforeChange = session.store.onChange;
			session.store.onChange = () => {
				beforeChange?.();
				committed();
			};
			editAlgorithm(0, String(model.answer[0]));
			await saved;
			session.store.onChange = beforeChange;
			await new Promise<void>((resolve) => setTimeout(resolve, 0));
			assert(
				document.activeElement === first &&
					host.querySelector("#algorithm-0") === first,
				`${lessonId}: saving a field keeps its input node and focus`,
			);
			first.dispatchEvent(
				new KeyboardEvent("keydown", {
					key: "Tab",
					bubbles: true,
					cancelable: true,
				}),
			);
			assert(
				document.activeElement?.id === "algorithm-1",
				`${lessonId}: Tab follows the calculation order`,
			);
			const changed = String((model.answer[0] + 1) % (model.fields[0].max + 1));
			editAlgorithm(0, changed);
			host.innerHTML = session.lessonView();
			session.bind(host);
			assert(
				host.querySelector<HTMLInputElement>("#algorithm-0")?.value === changed,
				`${lessonId}: an unrelated render before commit keeps the newest field`,
			);
			editAlgorithm(0, String(model.answer[0]));
			editAlgorithm(1, String(model.answer[1]));
			editAlgorithm(2, String(model.answer[2]));
			await session.store.update(() => {});
			const again = new DocumentStore(
				extraNames[6 + lessonIndex],
				() => freshForest(lessonId),
				validForest,
			);
			stores.push(again);
			await again.open();
			assert(
				again.state.algorithmWork?.[0] === String(model.answer[0]) &&
					again.state.algorithmWork?.[2] === String(model.answer[2]),
				`${lessonId}: rapid field edits resume in a second storage instance`,
			);
			const actAlgorithm = async (action: string) => {
				const button = host.querySelector<HTMLButtonElement>(
					`[data-action="${action}"]`,
				);
				if (!button) throw new Error("Algorithm action missing");
				await session.act(button, host);
			};
			for (let i = 0; i < model.answer.length; i++)
				editAlgorithm(i, String(model.answer[i]));
			const wrongValue = (model.answer[0] + 1) % (model.fields[0].max + 1);
			editAlgorithm(0, String(wrongValue));
			await session.store.update(() => {});
			await actAlgorithm("forest-check");
			assert(
				session.store.state.attempts.at(-1)?.outcome === false &&
					session.feedback.length > 20,
				`${lessonId}: a wrong computed step receives targeted feedback`,
			);
			editAlgorithm(0, String(model.answer[0]));
			await session.store.update(() => {});
			await actAlgorithm("forest-check");
			assert(
				session.store.state.attempts.at(-1)?.outcome === true &&
					session.store.state.attempts.at(-1)?.helped === true,
				`${lessonId}: a corrected retry remains assisted`,
			);
			if (lessonId === "schriftlich-multiplizieren")
				assert(
					session.feedback.includes(
						"Z: 4 · 6 + 4 ankommender Übertrag = 28; schreibe 8, übertrage 2 zu H",
					) &&
						session.feedback.includes(
							"T: 0 · 6 + 2 ankommender Übertrag = 2; schreibe 2, kein weiterer Übertrag",
						),
					"Multiplication success feedback distinguishes incoming and outgoing carries",
				);
			await session.store.update((p) => {
				p.stage = "exit";
				p.index = 2;
				p.seed = 54321;
				p.labGoals = [0, 1, 2];
				p.quiz = true;
				p.solved = { 1: 3, 2: 3 };
				p.rewards = ["mission-a"];
				p.completed = { "mission-a": Date.now() };
				p.algorithmWork = null;
			});
			const exit = activeForestTask(session.store.state);
			if (!exit?.algorithm) throw new Error("Algorithm exit missing");
			const exitModel = algorithmModel(exit.algorithm),
				count = session.store.state.attempts.length;
			await actAlgorithm("forest-check");
			assert(
				session.store.state.attempts.length === count,
				`${lessonId}: incomplete input does not consume an exit attempt`,
			);
			for (let i = 0; i < exitModel.answer.length; i++)
				editAlgorithm(
					i,
					exitModel.fields[i].blankZero ? "" : String(exitModel.answer[i]),
				);
			await session.store.update(() => {});
			if (lessonId === "schriftlich-multiplizieren") {
				await actAlgorithm("forest-check");
				assert(
					session.store.state.attempts.length === count &&
						session.feedback.includes("Trage auch deine Überträge"),
					"Multiplication: a complete product with no carries gets an unrecorded completion notice",
				);
				for (let i = 0; i < exitModel.answer.length; i++)
					if (exitModel.fields[i].blankZero)
						editAlgorithm(
							i,
							exitModel.answer[i] === 0 ? "" : String(exitModel.answer[i]),
						);
				await session.store.update(() => {});
			}
			await actAlgorithm("forest-check");
			const attempt = session.store.state.attempts.at(-1);
			assert(
				attempt && independentForest(attempt),
				`${lessonId}: completing the corrected exit after validation stays independent`,
			);
			await actAlgorithm("forest-next");
			assert(
				session.store.state.stage === "finished" &&
					session.store.state.rewards.length === 2 &&
					session.store.state.algorithmWork === null,
				`${lessonId}: completion grants one reward and clears the board`,
			);
			await actAlgorithm("forest-practice");
			editAlgorithm(0, "1");
			await session.store.update(() => {});
			await actAlgorithm("forest-stop");
			assert(
				session.store.state.optional === null &&
					session.store.state.algorithmWork === null &&
					session.store.state.rewards.length === 2,
				`${lessonId}: stopping partial optional work preserves rewards`,
			);
			if (lessonId === "schriftlich-multiplizieren") {
				for (const goal of [0, 2]) {
					await session.store.update((p) => {
						Object.assign(p, freshForest(lessonId));
						p.stage = "lab";
						p.index = goal;
					});
					const carryTask = activeForestTask(session.store.state);
					if (!carryTask?.algorithm)
						throw new Error("Carry review task missing");
					const carryModel = algorithmModel(carryTask.algorithm),
						row = goal === 0 ? carryModel.rows[0] : carryModel.rows[2],
						carryIndex = row.carries[1];
					for (let i = 0; i < carryModel.answer.length; i++)
						editAlgorithm(i, String(carryModel.answer[i]));
					editAlgorithm(carryIndex, "1");
					await session.store.update(() => {});
					await actAlgorithm("forest-check");
					assert(
						session.store.state.attempts.at(-1)?.outcome === false &&
							session.feedback.includes("kein voller Zehner") &&
							session.feedback.includes("leer oder schreibe 0"),
						`Unnecessary ${goal === 0 ? "product" : "sum"} carry gets explicit zero-carry feedback`,
					);
					editAlgorithm(carryIndex, "");
					await session.store.update(() => {});
					await actAlgorithm("forest-check");
					assert(
						session.store.state.attempts.at(-1)?.outcome === true &&
							session.store.state.attempts.at(-1)?.helped === true,
						`Correcting an unnecessary ${goal === 0 ? "product" : "sum"} carry to blank succeeds as assisted`,
					);
				}
				await session.store.update((p) => {
					Object.assign(p, freshForest(lessonId));
					p.stage = "lab";
					p.index = 1;
				});
				await actAlgorithm("forest-hint");
				await actAlgorithm("forest-solution");
				assert(
					session.feedback.includes("schreibe 8, übertrage 2 zu H") &&
						session.store.state.helped.length === 1,
					"Worked-solution feedback uses the same explicit outgoing carry and marks help",
				);
			}
			host.remove();
		}
		const numericHost = document.createElement("section");
		document.body.append(numericHost);
		const numericSession = new ForestSession(
			FOREST_LESSONS[1],
			() => {
				numericHost.innerHTML = numericSession.lessonView();
				numericSession.bind(numericHost);
			},
			extraNames[4],
		);
		stores.push(numericSession.store);
		await numericSession.open();
		await numericSession.store.update((p) => {
			p.seed = 12345;
			p.stage = "exit";
			p.index = 0;
			p.labGoals = [0, 1, 2];
			p.quiz = true;
			p.solved = { 1: 3, 2: 3 };
			p.rewards = ["mission-a"];
			p.completed = { "mission-a": Date.now() };
		});
		const numericCheck = async () => {
			const button = numericHost.querySelector<HTMLButtonElement>(
				'[data-action="forest-check"]',
			);
			if (!button) throw new Error("Numeric check missing");
			await numericSession.act(button, numericHost);
		};
		await numericCheck();
		assert(
			numericSession.store.state.attempts.length === 0,
			"An empty numeric exit answer is validation rather than a failed attempt",
		);
		const numericTask = activeForestTask(numericSession.store.state),
			numericInput =
				numericHost.querySelector<HTMLInputElement>("#forest-answer");
		if (!numericTask || !numericInput) throw new Error("Numeric exit missing");
		numericInput.value = String(numericTask.answer).replace(
			/(\d)(?=(\d{3})+$)/g,
			"$1.",
		);
		assert(
			numericInput.value.includes("."),
			"Numeric exit accepts German thousands grouping in an actual answer",
		);
		await numericCheck();
		const numericAttempt = numericSession.store.state.attempts.at(-1);
		assert(
			numericAttempt && independentForest(numericAttempt),
			"A correct numeric answer after validation remains independent",
		);
		numericHost.remove();
		for (const id of INVESTIGATION_IDS) {
			const lesson = FOREST_LESSONS.find((l) => l.id === id);
			if (!lesson) throw new Error("Investigation lesson missing");
			const host = document.createElement("section");
			document.body.append(host);
			const session = new ForestSession(
				lesson,
				() => {
					host.innerHTML = session.lessonView();
					session.bind(host);
				},
				`${name}-${id}`,
			);
			stores.push(session.store);
			await session.open();
			await session.store.update((p) => {
				p.stage = "lab";
			});
			const act = async (action: string) => {
				const button = host.querySelector<HTMLButtonElement>(
					`[data-action="${action}"]`,
				);
				if (!button) throw new Error(`Missing ${action}`);
				await session.act(button, host);
			};
			const edit = (i: number, value: string) => {
				const candidates = [
					...host.querySelectorAll<HTMLInputElement>(
						`[data-action="forest-investigation"][data-col="${i}"]`,
					),
				];
				const input = candidates.find(
					(c) => c.type !== "radio" || c.value === value,
				);
				if (!input) throw new Error("Investigation input missing");
				if (input.type === "radio") input.checked = true;
				else input.value = value;
				input.focus();
				input.dispatchEvent(new Event("input", { bubbles: true }));
				return input;
			};
			await act("forest-check");
			assert(
				session.store.state.attempts.length === 0,
				`${id}: empty worksheet is validation, with no attempt`,
			);
			const task = required(activeForestTask(session.store.state));
			const fields = required(task.investigation).fields;
			const numeric = fields.findIndex((f) => !f.choices);
			let changed = 0;
			let committed = () => {};
			const saved = new Promise<void>((resolve) => {
				committed = resolve;
			});
			const beforeChange = session.store.onChange;
			session.store.onChange = () => {
				beforeChange?.();
				if (++changed === 3) committed();
			};
			const first = edit(numeric, String(fields[numeric].value));
			edit(numeric, String(fields[numeric].value + 1));
			host.innerHTML = session.lessonView();
			session.bind(host);
			assert(
				host.querySelector<HTMLInputElement>(`#investigation-${numeric}`)
					?.value === String(fields[numeric].value + 1),
				`${id}: pending latest edit survives an unrelated redraw`,
			);
			const focus = edit(numeric, String(fields[numeric].value));
			await saved;
			session.store.onChange = beforeChange;
			await new Promise<void>((resolve) => setTimeout(resolve, 0));
			assert(
				document.activeElement === focus &&
					focus.isConnected &&
					!first.isConnected,
				`${id}: successful save keeps the latest input node and focus`,
			);
			const again = new DocumentStore(
				`${name}-${id}`,
				() => freshForest(id),
				validForest,
			);
			stores.push(again);
			await again.open();
			assert(
				again.state.investigationWork?.[numeric] ===
					String(fields[numeric].value),
				`${id}: numeric work resumes in another store instance`,
			);
			edit(numeric, "1.5");
			await act("forest-check");
			assert(
				session.store.state.attempts.length === 0 &&
					session.store.state.investigationWork?.[numeric] ===
						String(fields[numeric].value),
				`${id}: malformed text is not persisted or counted`,
			);
			fields.forEach((f, i) => {
				edit(i, String(f.value));
			});
			if (id === "muster-zahlbeziehungen") {
				edit(
					numeric,
					String(fields[numeric].value).replace(/(\d)(?=(\d{3})+$)/g, "$1."),
				);
				await session.store.update(() => {});
				const grouped = new DocumentStore(
					`${name}-${id}`,
					() => freshForest(id),
					validForest,
				);
				stores.push(grouped);
				await grouped.open();
				assert(
					grouped.mode === "persistent" &&
						grouped.state.investigationWork?.[numeric] === "2.000",
					"Worksheet dot-grouped input saves and resumes without recovery",
				);
			}

			const choice = fields.findIndex((f) => f.choices);
			edit(choice, "2");
			await session.store.update(() => {});
			await act("forest-check");
			assert(
				session.store.state.attempts.at(-1)?.outcome === false &&
					session.feedback.includes(fields[choice].label),
				`${id}: wrong reasoning receives feedback about that field`,
			);
			edit(choice, "1");
			await session.store.update(() => {});
			await act("forest-check");
			assert(
				session.store.state.attempts.at(-1)?.outcome === true &&
					session.store.state.attempts.at(-1)?.helped === true,
				`${id}: corrected worksheet remains assisted`,
			);
			await act("forest-next");
			assert(
				session.store.state.investigationWork === null,
				`${id}: moving to another task clears work`,
			);
			await act("forest-hint");
			await act("forest-solution");
			await act("forest-worked");
			assert(
				session.store.state.attempts.at(-1)?.helped === true &&
					session.store.state.investigationWork?.every((v) => v !== ""),
				`${id}: worked continuation fills the solved board and records help`,
			);
			await act("forest-next");
			if (id === "teiler-vielfache") {
				const one = host.querySelector<HTMLButtonElement>(
						'[data-action="forest-select"][data-value="1"]',
					),
					two = host.querySelector<HTMLButtonElement>(
						'[data-action="forest-select"][data-value="2"]',
					);
				if (!one || !two) throw new Error("Divisor selection missing");
				await Promise.all([session.act(one, host), session.act(two, host)]);
				assert(
					session.store.state.selection.join() === "1,2",
					"Divisors: rapid different selections preserve both taps",
				);
				await Promise.all([session.act(one, host), session.act(one, host)]);
				assert(
					session.store.state.selection.join() === "2,1",
					"Divisors: two rapid toggles are both applied",
				);
				await act("forest-clear");
			}
			// Finish the actual public session journey, including both levels and exits.
			for (
				let step = 0;
				step < 40 && session.store.state.stage !== "finished";
				step++
			) {
				const current = activeForestTask(session.store.state);
				if (current?.investigation) {
					current.investigation.fields.forEach((f, i) => {
						edit(i, String(f.value));
					});
					await session.store.update(() => {});
					await act("forest-check");
				} else if (current?.kind === "divisors") {
					for (const n of current.answer as number[]) {
						const button = host.querySelector<HTMLButtonElement>(
							`[data-action="forest-select"][data-value="${n}"]`,
						);
						if (!button) throw new Error("Divisor choice missing");
						await session.act(button, host);
					}
					await act("forest-check");
				} else if (current?.kind === "choice") {
					const button = host.querySelector<HTMLButtonElement>(
						`[data-action="forest-choice"][data-value="${current.answer}"]`,
					);
					if (!button) throw new Error("Quiz choice missing");
					await session.act(button, host);
				}
				await act("forest-next");
			}
			assert(
				session.store.state.stage === "finished" &&
					session.store.state.rewards.length === 2,
				`${id}: both full practice levels and exits finish with exactly two rewards`,
			);
			const optional = host.querySelector<HTMLButtonElement>(
				'[data-action="forest-practice"][data-level="2"]',
			);
			if (!optional) throw new Error("Optional practice missing");
			await session.act(optional, host);
			const extra = required(activeForestTask(session.store.state));
			required(extra.investigation).fields.forEach((f, i) => {
				edit(i, String(f.value));
			});
			await session.store.update(() => {});
			await act("forest-check");
			await act("forest-next");
			await act("forest-stop");
			assert(
				session.store.state.rewards.length === 2 &&
					session.store.state.investigationWork === null,
				`${id}: optional practice grants no extra reward and clears its worksheet`,
			);
			host.remove();
		}
		{
			const lesson = FOREST_LESSONS.find(
				(l) => l.id === "systematisch-kombinieren",
			);
			if (!lesson) throw new Error("Combination lesson missing");
			const host = document.createElement("section");
			document.body.append(host);
			const session = new ForestSession(
				lesson,
				() => {
					host.innerHTML = session.lessonView();
					session.bind(host);
				},
				`${name}-combinations`,
			);
			stores.push(session.store);
			await session.open();
			await session.store.update((p) => {
				p.stage = "lab";
			});
			const button = (action: string, extra = "") => {
				const b = host.querySelector<HTMLButtonElement>(
					`[data-action="${action}"]${extra}`,
				);
				if (!b) throw new Error(`Combination button missing: ${action}`);
				return b;
			};
			const act = async (action: string, extra = "") =>
				session.act(button(action, extra), host);
			const addTuple = async (tuple: number[]) => {
				for (let i = 0; i < tuple.length; i++)
					await act(
						"forest-combination-choice",
						`[data-col="${i}"][data-value="${tuple[i]}"]`,
					);
				await act("forest-combination-add");
			};
			const solve = async () => {
				const task = required(activeForestTask(session.store.state)),
					model = required(task.combination);
				for (const code of task.answer as number[])
					await addTuple(required(combinationTuple(model, code)));
				await act("forest-check");
			};
			await act("forest-check");
			assert(
				session.store.state.attempts.length === 0,
				"Combinations: empty list is validation, not an attempt",
			);
			await act("forest-combination-add");
			assert(
				session.store.state.selection.length === 0 &&
					session.store.state.attempts.length === 0,
				"Combinations: an incomplete builder cannot add a row or spend an attempt",
			);
			const first = button(
					"forest-combination-choice",
					'[data-col="0"][data-value="0"]',
				),
				second = button(
					"forest-combination-choice",
					'[data-col="1"][data-value="0"]',
				),
				add = button("forest-combination-add");
			await Promise.all([
				session.act(first, host),
				session.act(second, host),
				session.act(add, host),
			]);
			assert(
				session.store.state.selection.join() === "11" &&
					session.store.state.combinationChoice?.join() === "0,0",
				"Combinations: rapid choices and add are queued without losing a tap",
			);
			await Promise.all([
				act("forest-combination-add"),
				act("forest-combination-add"),
			]);
			assert(
				session.store.state.selection.length === 1 &&
					session.store.state.attempts.length === 0,
				"Combinations: duplicate rows are suppressed without recording a wrong answer",
			);
			const again = new DocumentStore(
				`${name}-combinations`,
				() => freshForest("systematisch-kombinieren"),
				validForest,
			);
			stores.push(again);
			await again.open();
			assert(
				again.state.selection.join() === "11" &&
					again.state.combinationChoice?.join() === "0,0",
				"Combinations: list and builder choices resume in another native store",
			);
			await act("forest-combination-remove", '[data-value="11"]');
			assert(
				session.store.state.selection.length === 0 &&
					session.store.state.combinationChoice?.join() === "0,0",
				"Combinations: removing an entry preserves the current builder choices",
			);
			await solve();
			assert(
				session.store.state.attempts.at(-1)?.outcome === true,
				"Combinations: a complete two-axis list passes",
			);
			const next = button("forest-next");
			await Promise.all([session.act(next, host), session.act(next, host)]);
			assert(
				session.store.state.index === 1 &&
					session.store.state.selection.length === 0 &&
					session.store.state.combinationChoice === null,
				"Combinations: duplicate next taps advance once and clear the builder",
			);
			await act("forest-hint");
			await act("forest-solution");
			await act("forest-worked");
			const worked = required(activeForestTask(session.store.state));
			assert(
				session.store.state.selection.length ===
					(worked.answer as number[]).length &&
					session.store.state.attempts.at(-1)?.helped,
				"Combinations: worked continuation fills the list and records assistance",
			);
			await act("forest-next");
			const restricted = required(
				required(activeForestTask(session.store.state)).combination,
			);
			for (const tuple of combinationTuples(restricted)) await addTuple(tuple);
			await act("forest-check");
			assert(
				session.store.state.attempts.at(-1)?.outcome === false &&
					session.feedback.includes("Einschränkung"),
				"Combinations: a forbidden row receives restriction-specific feedback",
			);
			for (const tuple of combinationTuples(restricted).filter(
				(t) => !allowedCombination(restricted, t),
			))
				await act(
					"forest-combination-remove",
					`[data-value="${combinationCode(tuple)}"]`,
				);
			await act("forest-check");
			assert(
				session.store.state.attempts.at(-1)?.outcome === true &&
					session.store.state.attempts.at(-1)?.helped,
				"Combinations: repaired restriction work remains assisted",
			);
			await act("forest-next");
			for (
				let step = 0;
				step < 40 && session.store.state.stage !== "finished";
				step++
			) {
				const current = activeForestTask(session.store.state);
				if (current?.combination) await solve();
				else if (current?.kind === "choice")
					await act("forest-choice", `[data-value="${current.answer}"]`);
				await act("forest-next");
			}
			assert(
				session.store.state.stage === "finished" &&
					session.store.state.rewards.length === 2,
				"Combinations: both practice levels and three fresh exits complete with two rewards",
			);
			await act("forest-practice", '[data-level="2"]');
			await addTuple([0, 0]);
			await act("forest-stop");
			assert(
				session.store.state.rewards.length === 2 &&
					session.store.state.selection.length === 0 &&
					session.store.state.combinationChoice === null,
				"Combinations: stopping an optional list clears work without extra rewards",
			);
			host.remove();
		}
		for (const definition of FOREST_LESSONS.filter((l) =>
			isWorldLesson(l.id),
		)) {
			const database = `${name}-world-${definition.id}`;
			extraNames.push(database);
			const host = document.createElement("section");
			document.body.append(host);
			const session = new ForestSession(
				definition,
				() => {
					host.innerHTML = session.lessonView();
					session.bind(host);
				},
				database,
			);
			stores.push(session.store);
			await session.open();
			const render = () => {
				host.innerHTML = session.lessonView();
				session.bind(host);
			};
			render();
			const act = async (action: string, extra = "") => {
				const b = required(
					host.querySelector<HTMLButtonElement>(
						`[data-action="${action}"]${extra}`,
					),
				);
				await session.act(b, host);
			};
			await act("forest-next");
			await act("forest-next");
			const initial = required(activeForestTask(session.store.state)),
				model = required(initial.model);
			await act("forest-model", '[data-col="0"][data-value="1"]');
			const saved = required(session.store.state.modelWork)[0];
			const restored = new DocumentStore(
				database,
				() => freshForest(definition.id),
				validForest,
			);
			stores.push(restored);
			await restored.open();
			assert(
				restored.state.modelWork?.[0] === saved,
				`${definition.id}: model action resumes in a second store`,
			);
			await act("forest-model-reset");
			assert(
				JSON.stringify(session.store.state.modelWork) ===
					JSON.stringify(freshWorkshop(model)),
				`${definition.id}: reset model leaves attempts unchanged`,
			);
			for (let n = 0; n < 40 && session.store.state.stage !== "finished"; n++) {
				const task = activeForestTask(session.store.state);
				if (task?.model) {
					const m = task.model;
					for (let col = 0; col < m.controls.length; col++) {
						for (let step = 0; step < 100; step++) {
							const current = (session.store.state.modelWork ??
								freshWorkshop(m))[col];
							if (current === m.target[col]) break;
							await act(
								"forest-model",
								`[data-col="${col}"][data-value="${Math.sign(m.target[col] - current)}"]`,
							);
						}
					}
					await act("forest-check");
				} else if (task?.investigation) {
					task.investigation.fields.forEach((field, i) => {
						const value = quantityText(field.value, field.format);
						const inputs = [
							...host.querySelectorAll<HTMLInputElement>(
								`[data-action="forest-investigation"][data-col="${i}"]`,
							),
						];
						const input = required(
							inputs.find((c) => c.type !== "radio" || c.value === value),
						);
						if (input.type === "radio") input.checked = true;
						else input.value = value;
						input.dispatchEvent(new Event("input", { bubbles: true }));
					});
					await act("forest-check");
					assert(
						!host.textContent?.includes("NaN"),
						`${definition.id}: solved quantities render in their labelled units`,
					);
				} else if (task?.kind === "choice")
					await act("forest-choice", `[data-value="${task.answer}"]`);
				await act("forest-next");
			}
			assert(
				session.store.state.stage === "finished" &&
					session.store.state.rewards.length === 2 &&
					session.store.state.attempts.filter((a) => a.mode === "exit")
						.length === 3,
				`${definition.id}: complete native journey has two rewards and three exit records`,
			);
			host.remove();
		}

		assert(fresh().schema === 1, "Fresh state is versioned");
		output.textContent += "\nALL BROWSER STORAGE CHECKS PASSED";
	} catch (error) {
		output.textContent += `\nFAIL ${String(error)}`;
	} finally {
		stores.forEach((s) => {
			s.close();
		});
		indexedDB.deleteDatabase(name);
		extraNames.forEach((database) => {
			indexedDB.deleteDatabase(database);
		});
	}
});
