import { DATABASE, ProgressStore } from "../src/storage/progress";
import { fresh, grant } from "../src/practice/evidence";
import { ulid } from "../src/id";

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
	const stores: ProgressStore[] = [];
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
			const r = indexedDB.open(name, 1);
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
		assert(fresh().schema === 1, "Fresh state is versioned");
		output.textContent += "\nALL BROWSER STORAGE CHECKS PASSED";
	} catch (error) {
		output.textContent += `\nFAIL ${String(error)}`;
	} finally {
		stores.forEach((s) => {
			s.close();
		});
		indexedDB.deleteDatabase(name);
	}
});
