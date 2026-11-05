import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearTexts, loadText, MAX_TEXT, parseTexts, saveText, TEXTS_KEY } from "../src/storage/texts";

describe("Schreibtisch", () => {
	let store: Map<string, string>;
	beforeEach(() => {
		store = new Map();
		vi.stubGlobal("localStorage", {
			getItem: (k: string) => store.get(k) ?? null,
			setItem: (k: string, v: string) => void store.set(k, v),
			removeItem: (k: string) => void store.delete(k),
		});
	});
	afterEach(() => vi.unstubAllGlobals());

	it("keeps each lesson's text apart and removes an emptied one", () => {
		expect(saveText("berichten", "Am Montag")).toBe(true);
		expect(saveText("ideen-sammeln", "Igel")).toBe(true);
		expect(loadText("berichten")).toBe("Am Montag");
		expect(loadText("ideen-sammeln")).toBe("Igel");
		saveText("berichten", "");
		expect(JSON.parse(store.get(TEXTS_KEY) ?? "{}")).toEqual({ "ideen-sammeln": "Igel" });
	});

	it("limits the length and survives damaged data", () => {
		saveText("berichten", "x".repeat(MAX_TEXT + 50));
		expect(loadText("berichten")).toHaveLength(MAX_TEXT);
		for (const bad of ["{kaputt", "[1,2]", "null", '"text"']) expect(parseTexts(bad)).toEqual({});
		expect(parseTexts('{"a":"Text","b":3,"c":""}')).toEqual({ a: "Text" });
	});

	it("clears everything", () => {
		saveText("berichten", "Text");
		clearTexts();
		expect(loadText("berichten")).toBe("");
		expect(store.has(TEXTS_KEY)).toBe(false);
	});

	it("reports when the browser refuses to store and never throws", () => {
		vi.stubGlobal("localStorage", {
			getItem: () => {
				throw new Error("blocked");
			},
			setItem: () => {
				throw new Error("blocked");
			},
			removeItem: () => {
				throw new Error("blocked");
			},
		});
		expect(saveText("berichten", "Text")).toBe(false);
		expect(loadText("berichten")).toBe("");
		expect(() => clearTexts()).not.toThrow();
	});
});
