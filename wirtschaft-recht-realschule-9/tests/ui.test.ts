// @vitest-environment jsdom
import { beforeAll, describe, expect, it } from "vitest";
import { CORE_LESSONS, LESSONS } from "../src/curriculum";
import { createRng, seedFrom } from "../src/exercises/rng";
import { makeExercise } from "../src/exercises/generators";
import { goalsOf, LABS } from "../src/labs/registry";
import type { Lesson } from "../src/model/types";
import { completion, isComplete, parseProgress, STORAGE_KEY } from "../src/storage/progress";
import { shownOptions } from "../src/workshop";

const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s) as T;
const all = <T extends Element = HTMLElement>(s: string) => [...document.querySelectorAll<T>(s)];
const fire = (el: Element, type: string) => el.dispatchEvent(new Event(type, { bubbles: true, cancelable: true }));
const submit = (form: Element) => form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

function open(id: string) {
  window.location.hash = `#lesson=${id}`;
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

function solveWorkshop(lesson: Lesson) {
  const w = lesson.workshop;
  if (w.kind === "classify") {
    w.entries.forEach((entry, i) => {
      $<HTMLSelectElement>(`[name="case-${i}"]`).value = String(entry.target);
    });
    submit($("#workshop"));
    return;
  }
  const desired = [...w.entries].sort((a, b) => a.target - b.target).map((e) => e.text);
  for (let i = 0; i < desired.length; i++) {
    let rows = all(".order-row > span:first-child").map((s) => s.textContent);
    let j = rows.indexOf(desired[i]);
    while (j > i) {
      $<HTMLButtonElement>(`[data-move="${j}:-1"]`).click();
      rows = all(".order-row > span:first-child").map((s) => s.textContent);
      j = rows.indexOf(desired[i]);
    }
  }
  $<HTMLButtonElement>("#check-order").click();
}

function complete(lesson: Lesson) {
  open(lesson.id);
  expect($(".lesson-title").textContent, lesson.id).toBe(lesson.title);
  // Quick check.
  const right = all<HTMLLabelElement>("#quiz .option").find((l) => l.textContent?.trim() === lesson.quiz.answer);
  (right?.querySelector("input") as HTMLInputElement).checked = true;
  submit($("#quiz"));
  expect($("#quiz-feedback").textContent).toContain("Richtig");
  // Lab.
  if (lesson.lab) {
    for (const goal of goalsOf(lesson)) {
      for (const [key, value] of Object.entries(LABS[lesson.lab].witness[goal.id])) {
        const control = $<HTMLInputElement>(`#lab [data-key="${key}"]`);
        control.value = String(value);
        fire(control, control.tagName === "SELECT" ? "change" : "input");
      }
    }
    expect(all("#lab-goals li.done"), `${lesson.id} lab`).toHaveLength(goalsOf(lesson).length);
  }
  // Sorting or ordering.
  solveWorkshop(lesson);
  expect($("#workshop-feedback").textContent, `${lesson.id} workshop`).toContain("Alles richtig");
  // Case.
  lesson.casework.steps.forEach((_, i) => {
    const { answer } = shownOptions(lesson.casework, i, lesson.id);
    all<HTMLInputElement>(`input[name="step-${i}"]`)[answer].checked = true;
  });
  submit($("#casework"));
  expect($("#case-feedback").textContent, `${lesson.id} case`).toContain("Fall gelöst");
  // Calculations.
  if (lesson.practice) {
    for (let n = 0; n < 3; n++) {
      const task = makeExercise(lesson.practice, createRng(seedFrom(`${lesson.id}:1:${n}`)), 1);
      const inputs = all<HTMLInputElement>("#calculation input");
      expect(inputs).toHaveLength(task.fields.length);
      task.fields.forEach((f, i) => {
        inputs[i].value = String(f.answer).replace(".", ",");
      });
      submit($("#calculation"));
      expect($("#calculation-feedback").textContent, `${lesson.id} practice`).toContain("Selbst gelöst");
      if (n < 2) $<HTMLButtonElement>("#new-exercise").click();
    }
  }
  // Written reasoning with a self-assessment.
  const draft = $<HTMLTextAreaElement>("#draft");
  draft.value = `Eigene Begründung zu ${lesson.title}: Ich erkläre den Zusammenhang in zwei vollständigen Sätzen.`;
  fire(draft, "input");
  $<HTMLButtonElement>("#compare-writing").click();
  all<HTMLInputElement>('[name="criterion"]').forEach((c) => {
    c.checked = true;
  });
  $<HTMLButtonElement>("#accept-writing").click();
  expect($("#completion-note").textContent, lesson.id).toContain("abgeschlossen");
}

beforeAll(async () => {
  document.body.innerHTML = '<div id="app"></div>';
  window.location.hash = "#lesson=" + LESSONS[0].id;
  window.scrollTo = () => {};
  await import("../src/main");
});

describe("a learner can finish every lesson through the page", () => {
  it("opens with the lesson a ZAM card links to", () => {
    expect($(".lesson-title").textContent).toBe(LESSONS[0].title);
    expect($("#progress-count").textContent).toBe(`0 / ${CORE_LESSONS.length}`);
  });
  it("keeps the lesson list behind a button on narrow screens and closes it after a choice", () => {
    const button = $<HTMLButtonElement>("#menu-button");
    expect($("#sidebar").classList.contains("open")).toBe(false);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    button.click();
    expect($("#sidebar").classList.contains("open")).toBe(true);
    expect($("#menu-button").getAttribute("aria-expanded")).toBe("true");
    $<HTMLButtonElement>("[data-lesson]").click();
    expect($("#sidebar").classList.contains("open")).toBe(false);
  });
  for (const lesson of LESSONS)
    it(`${lesson.id}: quick check, lab, sorting, case, calculations and reasoning`, () => {
      complete(lesson);
      const saved = parseProgress(localStorage.getItem(STORAGE_KEY));
      expect(isComplete(saved, lesson.id)).toBe(true);
    });
  it("counts exactly the core lessons as progress and celebrates a finished Lernbereich", () => {
    const saved = parseProgress(localStorage.getItem(STORAGE_KEY));
    expect(completion(saved)).toMatchObject({ done: CORE_LESSONS.length, total: CORE_LESSONS.length, percent: 100 });
    expect($("#progress-count").textContent).toBe(`${CORE_LESSONS.length} / ${CORE_LESSONS.length}`);
  });
  it("shows the map and links every lesson", () => {
    $<HTMLButtonElement>("#map-button").click();
    expect(all(".map-card").length).toBeGreaterThanOrEqual(4);
    expect(all(".map-lesson.done").length).toBe(CORE_LESSONS.length);
    expect(document.body.textContent).toContain("Alle Kernlektionen sind geschafft");
  });
});
