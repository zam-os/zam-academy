// @vitest-environment jsdom
import { beforeAll, describe, expect, it } from "vitest";
import { CORE_LESSONS, findLesson, LESSONS } from "../src/curriculum";
import { createRound, REQUIRED_ROUNDS } from "../src/exercises/practice";
import type { Lesson } from "../src/model/types";
import { completion, isComplete, keyOf, parseProgress, STORAGE_KEY } from "../src/storage/progress";
import { quizOptions, shownOptions } from "../src/workshop";

const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s) as T;
const all = <T extends Element = HTMLElement>(s: string) => [...document.querySelectorAll<T>(s)];
const fire = (el: Element, type: string) => el.dispatchEvent(new Event(type, { bubbles: true, cancelable: true }));
const submit = (form: Element) => form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
const click = (el: Element) => (el as HTMLElement).click();

function open(id: string) {
  window.location.hash = `#lesson=${id}`;
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

/** The index of the right option of a lesson's quick check as the page shows it. */
function shownQuizAnswer(lesson: Lesson) {
  return quizOptions(lesson).answer;
}

/** Answers a gap that is a drop-down or, for long options, a list of radio buttons. */
function choose(name: string, answer: number) {
  const radio = document.querySelector<HTMLInputElement>(`input[type="radio"][name="${name}"][value="${answer}"]`);
  if (radio) radio.checked = true;
  else $<HTMLSelectElement>(`select[name="${name}"]`).value = String(answer);
}

function solveWorkshop(lesson: Lesson) {
  const w = lesson.workshop;
  if (w.kind === "classify") {
    w.entries.forEach((entry, i) => {
      $<HTMLSelectElement>(`[name="case-${i}"]`).value = String(entry.target);
    });
    submit($("#workshop"));
  } else if (w.kind === "timeline") {
    const desired = [...w.entries].sort((a, b) => a.target - b.target).map((e) => e.text);
    for (let i = 0; i < desired.length; i++) {
      let rows = all(".order-row > span:first-child").map((s) => s.textContent);
      let j = rows.indexOf(desired[i]);
      while (j > i) {
        click($(`[data-move="${j}:-1"]`));
        rows = all(".order-row > span:first-child").map((s) => s.textContent);
        j = rows.indexOf(desired[i]);
      }
    }
    click($("#check-order"));
  } else if (w.kind === "mark") {
    w.text.forEach((segment, i) => {
      if (segment.label === undefined) return;
      const radio = $<HTMLInputElement>(`input[name="mark-label"][value="${segment.label}"]`);
      radio.checked = true;
      fire(radio, "change");
      click($(`[data-seg="${i}"]`));
    });
    click($("#check-marks"));
  } else if (w.kind === "commas") {
    w.items.forEach((item, i) => {
      for (const gap of item.commas) click($(`[data-gap="w:${i}:${gap}"]`));
    });
    click($("#check-commas"));
  } else {
    w.items.forEach((item, i) => choose(`w-choose-${i}`, item.answer));
    click($("#check-choose"));
  }
}

function solvePracticeRound(lesson: Lesson) {
  // The page draws a round from the lesson, the level and the saved counter; the test draws the same one.
  const saved = parseProgress(localStorage.getItem(STORAGE_KEY));
  const round = createRound(saved, lesson, 1);
  if (round.kind === "commas")
    round.items.forEach((item, i) => {
      for (const gap of item.commas) click($(`[data-gap="p:${i}:${gap}"]`));
    });
  else
    round.items.forEach((item, i) => choose(`p-choose-${i}`, item.answer));
  click($("#check-practice"));
}

function complete(lesson: Lesson) {
  open(lesson.id);
  expect($(".lesson-title").textContent, lesson.id).toBe(lesson.title);
  // Quick check.
  const right = all<HTMLLabelElement>("#quiz .option").find((l) => l.textContent?.trim() === lesson.quiz.answer);
  (right?.querySelector("input") as HTMLInputElement).checked = true;
  submit($("#quiz"));
  expect($("#quiz-feedback").textContent).toContain("Richtig");
  // Workshop.
  solveWorkshop(lesson);
  expect($("#workshop-feedback").textContent, `${lesson.id} workshop`).toContain("Alles richtig");
  // Text case.
  lesson.casework.steps.forEach((_, i) => {
    const { answer } = shownOptions(lesson.casework, i, lesson.id);
    all<HTMLInputElement>(`input[name="step-${i}"]`)[answer].checked = true;
  });
  submit($("#casework"));
  expect($("#case-feedback").textContent, `${lesson.id} case`).toContain("Textfall gelöst");
  // Practice rounds.
  if (lesson.practice)
    for (let n = 0; n < REQUIRED_ROUNDS; n++) {
      solvePracticeRound(lesson);
      expect($("#practice-feedback").textContent, `${lesson.id} practice`).toContain("Gezählt");
      if (n < REQUIRED_ROUNDS - 1) click($("#new-round"));
    }
  // Written text with a self-assessment.
  const draft = $<HTMLTextAreaElement>("#draft");
  draft.value = `Eigener Text zu ${lesson.title}: Ich schreibe zwei vollständige Sätze dazu.`;
  fire(draft, "input");
  click($("#compare-writing"));
  all<HTMLInputElement>('[name="criterion"]').forEach((c) => {
    c.checked = true;
  });
  click($("#accept-writing"));
  expect($("#completion-note").textContent, lesson.id).toContain("abgeschlossen");
}

beforeAll(async () => {
  document.body.innerHTML = '<div id="app"></div>';
  window.location.hash = "#lesson=" + LESSONS[0].id;
  window.scrollTo = () => {};
  // Newer Node versions define their own, unusable localStorage on globalThis, which jsdom then leaves alone.
  Object.defineProperty(globalThis, "localStorage", {
    value: window.localStorage,
    configurable: true,
    writable: true,
  });
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

  describe("and a wrong answer does not count", () => {
    it("rejects a marking that misses a target and a piece that should stay clear", () => {
      const lesson = findLesson("de-stilmittel");
      if (!lesson || lesson.workshop.kind !== "mark") throw new Error("de-stilmittel needs a marking workshop");
      open(lesson.id);
      const first = lesson.workshop.text.findIndex((s) => s.label !== undefined);
      const radio = $<HTMLInputElement>('input[name="mark-label"][value="0"]');
      radio.checked = true;
      fire(radio, "change");
      click($(`[data-seg="${first}"]`));
      click($("#check-marks"));
      expect($("#workshop-feedback").textContent).toContain("Noch nicht alles stimmt");
      // Nothing marked is wrong here, so it says only that marks are missing, not how many or which.
      expect($("#workshop-feedback").textContent).toContain("Es fehlen noch Markierungen");
      expect($("#workshop-feedback").textContent).not.toContain("Noch zu finden");
      expect($("#workshop-feedback").textContent).not.toContain("graue Zuckerwatte");
      expect(isComplete(parseProgress(localStorage.getItem(STORAGE_KEY)), lesson.id)).toBe(false);
      expect(parseProgress(localStorage.getItem(STORAGE_KEY)).workshop).not.toContain(lesson.id);
      // The mark survives a repaint and a second click takes it away.
      expect($(`[data-seg="${first}"]`).getAttribute("aria-pressed")).toBe("true");
      click($(`[data-seg="${first}"]`));
      expect($(`[data-seg="${first}"]`).getAttribute("aria-pressed")).toBe("false");
      // The message of the last check does not outlive the marks it described.
      expect($("#workshop-feedback").textContent).toBe("");
      click($("#clear-marks"));
    });
    for (const id of ["de-stilmittel", "de-sprachebenen", "de-gliederungen-aufzaehlungen"])
      it(`${id}: a wrong marking says nothing about targets, other labels or how many are missing`, () => {
        const lesson = findLesson(id);
        if (!lesson || lesson.workshop.kind !== "mark") throw new Error(`${id} needs a marking workshop`);
        const w = lesson.workshop;
        open(id);
        // Mark every piece one can click with the first label, then check.
        const radio = $<HTMLInputElement>('input[name="mark-label"][value="0"]');
        radio.checked = true;
        fire(radio, "change");
        all("[data-seg]").forEach((piece) => {
          click($(`[data-seg="${piece.getAttribute("data-seg")}"]`));
        });
        click($("#check-marks"));
        const lines = all(".mark-feedback li").map((li) => li.textContent ?? "");
        expect(lines.length).toBeGreaterThan(0);
        // Every wrong mark gets the same sentence, whether the piece is a target of another label or no target at all.
        for (const line of lines) expect(line).toMatch(/^✗ „[\s\S]+“: Diese Markierung stimmt noch nicht\.$/);
        const said = $("#workshop-feedback").textContent ?? "";
        expect(said).not.toContain("kein anderes");
        expect(said).not.toContain("Noch zu finden");
        expect(said).not.toContain("×");
        for (const label of w.labels) expect(said).not.toContain(`„${label}“`);
        expect(parseProgress(localStorage.getItem(STORAGE_KEY)).workshop).not.toContain(id);
        click($("#clear-marks"));
      });
    it("a wrong quick check does not explain the right answer and does not count", () => {
      const lesson = LESSONS[3];
      open(lesson.id);
      const right = shownQuizAnswer(lesson);
      const inputs = all<HTMLInputElement>('input[name="quiz"]');
      inputs[(right + 1) % inputs.length].checked = true;
      submit($("#quiz"));
      expect($("#quiz-feedback").textContent).toBe("Noch nicht. Lies die Frage und alle Antworten noch einmal.");
      expect($("#quiz-feedback").textContent).not.toContain(lesson.quiz.explanation.slice(0, 40));
      expect(parseProgress(localStorage.getItem(STORAGE_KEY)).quiz).not.toContain(lesson.id);
      inputs[right].checked = true;
      submit($("#quiz"));
      expect($("#quiz-feedback").textContent).toContain(lesson.quiz.explanation);
    });
    it("never names the category or the place of a wrong entry (Zuordnen and Ordnen)", () => {
      const classify = findLesson("de-zuhoeren-reagieren");
      if (!classify || classify.workshop.kind !== "classify") throw new Error("de-zuhoeren-reagieren needs a classify workshop");
      const w = classify.workshop;
      open(classify.id);
      submit($("#workshop"));
      all("[id^='case-feedback-']").forEach((el) => expect(el.textContent).toBe("Wähle eine Zuordnung."));
      w.entries.forEach((entry, i) => {
        $<HTMLSelectElement>(`[name="case-${i}"]`).value = String((entry.target + 1) % w.categories.length);
      });
      submit($("#workshop"));
      const said = all("[id^='case-feedback-']").map((el) => el.textContent ?? "");
      expect(said).toHaveLength(w.entries.length);
      for (const text of said) for (const entry of w.entries) expect(text).not.toContain(entry.feedback);
      for (const text of said) expect(text).toContain("Noch einmal prüfen");
      expect(parseProgress(localStorage.getItem(STORAGE_KEY)).workshop).not.toContain(classify.id);

      const order = findLesson("de-praesentation");
      if (!order || order.workshop.kind !== "timeline") throw new Error("de-praesentation needs a timeline workshop");
      open(order.id);
      click($("#check-order"));
      const lines = all("[id^='case-feedback-']").map((el) => el.textContent ?? "");
      const wrong = lines.filter((text) => text.startsWith("Noch einmal prüfen"));
      expect(wrong.length).toBeGreaterThan(0);
      for (const text of wrong) for (const entry of order.workshop.entries) expect(text).not.toContain(entry.feedback);
    });
    it("keeps what is typed in or chosen when the level changes, and skipping to the content does not reload the page", () => {
      const lesson = findLesson("de-zeichensetzung");
      if (!lesson) throw new Error("de-zeichensetzung missing");
      open(lesson.id);
      click($('[data-gap="w:0:0"]'));
      const radio = all<HTMLInputElement>('input[name="quiz"]')[0];
      radio.checked = true;
      const level = $<HTMLSelectElement>("#level");
      level.value = "2";
      fire(level, "change");
      expect($('[data-gap="w:0:0"]').getAttribute("aria-pressed")).toBe("true");
      expect(all<HTMLInputElement>('input[name="quiz"]')[0].checked).toBe(true);
      expect($("#practice .eyebrow").textContent).toContain("Niveau 2");
      expect($("#writing .eyebrow").textContent).toContain("Niveau 2");
      expect($("#writing summary").textContent).toBe("Hinweise");
      level.value = "1";
      fire(level, "change");
      expect($("#writing .eyebrow").textContent).toContain("Niveau 1");
      expect($("#writing summary").textContent).toBe("Leitfragen");
      const hash = window.location.hash;
      click($(".skip-link"));
      expect(window.location.hash).toBe(hash);
      expect($('[data-gap="w:0:0"]').getAttribute("aria-pressed")).toBe("true");
      click($('[data-gap="w:0:0"]'));
    });
    it("keeps the clicks of an open practice round when the level is switched and back, and names the task of the round", () => {
      const lesson = findLesson("de-zeichensetzung");
      if (!lesson?.practice) throw new Error("de-zeichensetzung needs a practice round");
      open(lesson.id);
      expect($("#practice-feedback").textContent).toContain("Setze in jedem Satz die Kommas");
      expect($("#practice-feedback").textContent).not.toContain("wähle");
      click($('[data-gap="p:0:0"]'));
      const level = $<HTMLSelectElement>("#level");
      level.value = "2";
      fire(level, "change");
      expect($("#practice .eyebrow").textContent).toContain("Niveau 2");
      expect($('[data-gap="p:0:0"]').getAttribute("aria-pressed")).toBe("false");
      level.value = "1";
      fire(level, "change");
      expect($("#practice .eyebrow").textContent).toContain("Niveau 1");
      expect($('[data-gap="p:0:0"]').getAttribute("aria-pressed")).toBe("true");
      click($('[data-gap="p:0:0"]'));
      const choose = findLesson("de-fremdwoerter-schreiben");
      if (!choose?.practice || choose.practice.kind !== "choose") throw new Error("de-fremdwoerter-schreiben needs a choose round");
      open(choose.id);
      expect($("#practice-feedback").textContent).toContain("Wähle in jedem Satz die passende Möglichkeit");
    });
    it("has one level-one heading, a title per lesson and long options as a list of radio buttons", () => {
      const lesson = findLesson("de-gespraechsverhalten");
      if (!lesson) throw new Error("de-gespraechsverhalten missing");
      open(lesson.id);
      expect(all("h1")).toHaveLength(1);
      expect(document.title).toContain(lesson.title);
      expect(all('.choose-long input[type="radio"]').length).toBeGreaterThan(0);
      expect(all(".choose-long select")).toHaveLength(0);
    });
    it("does not open the comparison for a text that is one letter repeated", () => {
      open(LESSONS[1].id);
      const draft = $<HTMLTextAreaElement>("#draft");
      draft.value = "a".repeat(40);
      fire(draft, "input");
      expect($<HTMLButtonElement>("#compare-writing").disabled).toBe(true);
      draft.value = "Ich schreibe hier einen ersten ganzen Satz zum Thema.";
      fire(draft, "input");
      expect($<HTMLButtonElement>("#compare-writing").disabled).toBe(false);
      draft.value = "";
      fire(draft, "input");
    });
    it("rejects a comma in the wrong place and does not count a round whose solution was shown", () => {
      const lesson = findLesson("de-zeichensetzung");
      if (!lesson || lesson.workshop.kind !== "commas") throw new Error("de-zeichensetzung needs a comma workshop");
      open(lesson.id);
      click($('[data-gap="w:0:0"]'));
      click($("#check-commas"));
      expect($("#workshop-feedback").textContent).toContain("Mindestens ein Satz");
      expect($("#w-feedback-0").textContent).toContain("Noch einmal prüfen");
      expect(parseProgress(localStorage.getItem(STORAGE_KEY)).workshop).not.toContain(lesson.id);

      // A wrong round is not counted; looking at the solution closes it without credit.
      click($("#check-practice"));
      expect($("#practice-feedback").textContent).toContain("Noch nicht alle drei Sätze");
      click($("#solution-button"));
      expect($("#practice-feedback").textContent).toContain("Lösung angesehen");
      expect(all<HTMLButtonElement>(".gap").every((g) => g.disabled || !g.closest("#practice"))).toBe(true);
      expect(parseProgress(localStorage.getItem(STORAGE_KEY)).solved[keyOf(lesson.id, 1)] ?? 0).toBe(0);
    });
    it("shows a text case step as wrong without completing the lesson", () => {
      const lesson = LESSONS[0];
      open(lesson.id);
      lesson.casework.steps.forEach((_, i) => {
        const { answer } = shownOptions(lesson.casework, i, lesson.id);
        const inputs = all<HTMLInputElement>(`input[name="step-${i}"]`);
        inputs[(answer + 1) % inputs.length].checked = true;
      });
      submit($("#casework"));
      expect($("#case-feedback").textContent).toContain("stimmt noch nicht");
    });
  });

  for (const lesson of LESSONS)
    it(`${lesson.id}: quick check, ${lesson.workshop.kind} workshop, text case${lesson.practice ? ", practice rounds" : ""} and own text`, () => {
      complete(lesson);
      const saved = parseProgress(localStorage.getItem(STORAGE_KEY));
      expect(isComplete(saved, lesson.id)).toBe(true);
    });

  it("counts exactly the lessons as progress and celebrates a finished Lernbereich", () => {
    const saved = parseProgress(localStorage.getItem(STORAGE_KEY));
    expect(completion(saved)).toMatchObject({ done: CORE_LESSONS.length, total: CORE_LESSONS.length, percent: 100 });
    expect($("#progress-count").textContent).toBe(`${CORE_LESSONS.length} / ${CORE_LESSONS.length}`);
  });
  it("shows the map and links every lesson", () => {
    click($("#map-button"));
    expect(all(".map-card")).toHaveLength(4);
    expect(all(".map-lesson.done").length).toBe(CORE_LESSONS.length);
    expect(document.body.textContent).toContain("Alle Lektionen sind geschafft");
  });
  it("puts the focus back on a button of the practice round after it was drawn again", () => {
    const lesson = findLesson("de-zeichensetzung");
    if (!lesson?.practice) throw new Error("de-zeichensetzung needs a practice round");
    open(lesson.id);
    solvePracticeRound(lesson);
    expect(document.activeElement?.id).toBe("new-round");
    click($("#new-round"));
    expect(document.activeElement?.id).toBe("check-practice");
    click($("#solution-button"));
    expect(document.activeElement?.id).toBe("new-round");
    click($("#map-button"));
  });
  it("does not lose progress when another tab saves older progress", () => {
    // A second tab that opened early saves a state with nothing done; this tab must keep all lessons and save them again.
    const stale = JSON.stringify(parseProgress(null));
    localStorage.setItem(STORAGE_KEY, stale);
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: stale }));
    expect(all(".map-lesson.done").length).toBe(CORE_LESSONS.length);
    expect(completion(parseProgress(localStorage.getItem(STORAGE_KEY))).done).toBe(0);
    click($("[data-lesson]"));
    expect(completion(parseProgress(localStorage.getItem(STORAGE_KEY))).done).toBe(CORE_LESSONS.length);
  });
});
