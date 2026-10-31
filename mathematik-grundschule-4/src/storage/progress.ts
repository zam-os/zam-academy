import { fresh, validProgress, type Progress } from "../practice/evidence";

export type StorageMode = "persistent" | "memory" | "recovery";
export const DATABASE = "zam-entdeckerinsel-mathe4-v1";
const STORE = "progress";

/** A single document makes mission completion and reward grants atomic. */
export class ProgressStore {
	readonly name: string;
	state: Progress = fresh();
	mode: StorageMode = "memory";
	raw: unknown = null;
	private db: IDBDatabase | null = null;
	private channel: BroadcastChannel | null = null;
	private tail: Promise<unknown> = Promise.resolve();
	onChange: (() => void) | null = null;

	constructor(name = DATABASE) {
		this.name = name;
	}

	async open(factory?: IDBFactory): Promise<void> {
		try {
			const storageFactory = factory ?? globalThis.indexedDB;
			if (!storageFactory) return;
			this.db = await new Promise<IDBDatabase>((resolve, reject) => {
				const req = storageFactory.open(this.name, 1);
				req.onupgradeneeded = () => req.result.createObjectStore(STORE);
				req.onsuccess = () => resolve(req.result);
				req.onerror = () => reject(req.error);
				req.onblocked = () => reject(new Error("Speicher ist blockiert."));
			});
			this.db.onversionchange = () => {
				this.db?.close();
				this.db = null;
				this.mode = "memory";
				this.onChange?.();
			};
			await this.read();
			if (this.mode !== "recovery") this.mode = "persistent";
			if (typeof BroadcastChannel !== "undefined") {
				this.channel = new BroadcastChannel(this.name);
				this.channel.onmessage = () => {
					void this.read()
						.then(() => this.onChange?.())
						.catch(() => {
							this.mode = "memory";
							this.onChange?.();
						});
				};
			}
		} catch {
			this.mode = "memory";
		}
	}

	private async read(): Promise<void> {
		if (!this.db) return;
		const db = this.db;
		const raw = await new Promise<unknown>((resolve, reject) => {
			const tx = db.transaction(STORE, "readonly");
			const req = tx.objectStore(STORE).get("learner");
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error);
			tx.onabort = () => reject(tx.error);
		});
		if (raw === undefined) return;
		this.raw = raw;
		if (validProgress(raw)) this.state = raw;
		else this.mode = "recovery";
	}

	update(change: (state: Progress) => void): Promise<void> {
		const operation = this.tail.then(() => this.apply(change));
		this.tail = operation.catch(() => {});
		return operation;
	}

	private async apply(change: (state: Progress) => void): Promise<void> {
		if (this.mode === "recovery")
			throw new Error("Bitte wähle zuerst die Speicherwiederherstellung.");
		if (!this.db || this.mode === "memory") {
			const next = structuredClone(this.state);
			change(next);
			if (!validProgress(next))
				throw new Error("Der Lernstand konnte nicht geprüft werden.");
			this.state = next;
			this.onChange?.();
			return;
		}
		let next: Progress | undefined;
		try {
			const db = this.db;
			await new Promise<void>((resolve, reject) => {
				const tx = db.transaction(STORE, "readwrite");
				const req = tx.objectStore(STORE).get("learner");
				req.onsuccess = () => {
					if (req.result !== undefined && !validProgress(req.result)) {
						this.raw = req.result;
						this.mode = "recovery";
						tx.abort();
						return;
					}
					const candidate: Progress = structuredClone(req.result ?? this.state);
					next = candidate;
					try {
						change(candidate);
						if (!validProgress(next)) throw new Error("Ungültiger Lernstand.");
						tx.objectStore(STORE).put(next, "learner");
					} catch (error) {
						next = undefined;
						tx.abort();
						reject(error);
					}
				};
				tx.oncomplete = () => resolve();
				tx.onabort = () =>
					reject(tx.error ?? new Error("Speichern unterbrochen."));
				tx.onerror = () => reject(tx.error);
			});
			if (!next) throw new Error("Der Lernstand fehlt nach dem Speichern.");
			this.state = next;
			this.channel?.postMessage("updated");
		} catch (error) {
			if ((this.mode as StorageMode) === "recovery") {
				this.onChange?.();
				throw error;
			}
			if (!next) throw error;
			this.state = next;
			this.mode = "memory";
		}
		this.onChange?.();
	}

	async freshStart(): Promise<void> {
		const next = fresh();
		const db = this.db;
		if (db) {
			await new Promise<void>((resolve, reject) => {
				const tx = db.transaction(STORE, "readwrite");
				tx.objectStore(STORE).put(next, "learner");
				tx.oncomplete = () => resolve();
				tx.onabort = () => reject(tx.error);
				tx.onerror = () => reject(tx.error);
			});
			this.mode = "persistent";
		} else this.mode = "memory";
		this.state = next;
		this.raw = null;
		this.channel?.postMessage("updated");
		this.onChange?.();
	}

	close(): void {
		this.channel?.close();
		this.db?.close();
	}
}
