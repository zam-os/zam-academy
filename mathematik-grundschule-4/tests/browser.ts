import {
	DATABASE,
	STORAGE_VERSION,
	ProgressStore,
	DocumentStore,
} from "../src/storage/progress";
import { fresh, grant } from "../src/practice/evidence";
import { ulid } from "../src/id";
import { FOREST_LESSONS } from "../src/course/catalog";
import { ForestSession } from "../src/course/session";
import { freshForest, validForest } from "../src/course/progress";

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
				writtenSession.feedback.includes("Übertrag"),
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
		writtenHost.remove();
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
