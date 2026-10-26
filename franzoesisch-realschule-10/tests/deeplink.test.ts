// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { findLesson, LESSONS } from "../src/curriculum";

const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s) as T;

/** Starts the page as a first visit: empty storage, the given URL. */
async function visit(url: string) {
  Object.defineProperty(globalThis, "localStorage", { value: window.localStorage, configurable: true, writable: true });
  window.localStorage.clear();
  window.history.replaceState(null, "", url);
  document.body.innerHTML = '<div id="app"></div>';
  window.scrollTo = () => {};
  vi.resetModules();
  await import("../src/main");
}

describe("the first visit", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  it("opens the map when nothing names a lesson", async () => {
    await visit("/");
    expect(document.querySelector(".hero")).not.toBeNull();
    expect(document.querySelector(".lesson-title")).toBeNull();
  });
  it("opens the lesson a ?lesson= link names, although the profile is new", async () => {
    const lesson = findLesson("fr-frankophonie");
    if (!lesson) throw new Error("fr-frankophonie missing");
    await visit("/?lesson=fr-frankophonie");
    expect($(".lesson-title").textContent).toBe(lesson.title);
    expect(document.querySelector(".hero")).toBeNull();
  });
  it("opens the lesson a #lesson= link names and the level that goes with it", async () => {
    const lesson = LESSONS[4];
    await visit(`/#lesson=${lesson.id}&level=2`);
    expect($(".lesson-title").textContent).toBe(lesson.title);
    expect($<HTMLSelectElement>("#level").value).toBe("2");
  });
});
