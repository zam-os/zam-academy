import { esc, fmt } from "../format";
import type { Lesson } from "../model/types";
import { goalKey } from "../storage/keys";
import type { Progress } from "../storage/progress";
import { clampState, goalsReached, initialState, type LabDef, type LabState } from "./engine";
import { goalsOf, LABS } from "./registry";

const sliderValue = (def: LabDef, key: string, value: number) => {
  const slider = def.sliders.find((s) => s.key === key);
  if (!slider) return fmt(value);
  return `${slider.show ? slider.show(value) : fmt(value)}${slider.unit ? ` ${slider.unit}` : ""}`;
};

export function labHtml(lesson: Lesson, p: Progress, number: string): string {
  if (!lesson.lab) return "";
  const def = LABS[lesson.lab];
  const state = initialState(def);
  const sliders = def.sliders
    .map(
      (s) =>
        `<label class="lab-control"><span>${esc(s.label)} <output data-out="${s.key}">${esc(sliderValue(def, s.key, state[s.key]))}</output></span><input type="range" data-key="${s.key}" min="${s.min}" max="${s.max}" step="${s.step}" value="${state[s.key]}" aria-label="${esc(s.label)}"></label>`,
    )
    .join("");
  const selects = def.selects
    .map(
      (s) =>
        `<label class="lab-control"><span>${esc(s.label)}</span><select data-key="${s.key}">${s.options.map((o) => `<option value="${o.value}" ${o.value === state[s.key] ? "selected" : ""}>${esc(o.label)}</option>`).join("")}</select></label>`,
    )
    .join("");
  const goals = goalsOf(lesson)
    .map((g) => {
      const done = p.goals.includes(goalKey(lesson.id, g.id));
      return `<li class="${done ? "done" : ""}" data-goal="${g.id}"><span aria-hidden="true">${done ? "✓" : "○"}</span> ${esc(g.text)}</li>`;
    })
    .join("");
  return `<section class="panel lab" id="lab"><div class="eyebrow">${number} · Ausprobieren</div><h2>${esc(def.title)}</h2><p>${esc(def.intro)}</p>
    <div class="lab-grid"><div class="lab-controls">${sliders}${selects}</div><div class="lab-stage"><div id="lab-figure"></div><dl class="lab-readouts" id="lab-readouts"></dl><p class="lab-note" id="lab-note" role="status"></p></div></div>
    <div class="lab-goals"><h3>Laboraufträge</h3><p class="small">Ändere die Regler. Ein Auftrag zählt, sobald das Modell seinen Zustand zeigt.</p><ul id="lab-goals">${goals}</ul></div></section>`;
}

/** Calls `onReached` after every control change that completes new assignments. */
export function bindLab(lesson: Lesson, p: Progress, onReached: () => void) {
  if (!lesson.lab) return;
  const def = LABS[lesson.lab];
  const section = document.querySelector<HTMLElement>("#lab");
  if (!section) return;
  let state: LabState = initialState(def);
  const wanted = goalsOf(lesson).map((g) => g.id);
  const draw = () => {
    const view = def.view(state);
    const figure = section.querySelector<HTMLElement>("#lab-figure");
    const readouts = section.querySelector<HTMLElement>("#lab-readouts");
    const note = section.querySelector<HTMLElement>("#lab-note");
    if (figure) figure.innerHTML = view.figure;
    if (readouts)
      readouts.innerHTML = view.readouts
        .map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`)
        .join("");
    if (note) note.textContent = view.note;
    for (const s of def.sliders) {
      const out = section.querySelector<HTMLElement>(`[data-out="${s.key}"]`);
      if (out) out.textContent = sliderValue(def, s.key, state[s.key]);
    }
  };
  const evaluate = () => {
    let changed = false;
    for (const id of goalsReached(def, state)) {
      if (!wanted.includes(id)) continue;
      const key = goalKey(lesson.id, id);
      if (!p.goals.includes(key)) {
        p.goals.push(key);
        changed = true;
      }
    }
    section.querySelectorAll<HTMLElement>("[data-goal]").forEach((item) => {
      const done = p.goals.includes(goalKey(lesson.id, item.dataset.goal ?? ""));
      item.classList.toggle("done", done);
      const mark = item.querySelector("span");
      if (mark) mark.textContent = done ? "✓" : "○";
    });
    if (changed) onReached();
  };
  section.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-key]").forEach((control) => {
    const event = control instanceof HTMLSelectElement ? "change" : "input";
    control.addEventListener(event, () => {
      const raw: LabState = { ...state };
      section.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-key]").forEach((c) => {
        raw[c.dataset.key ?? ""] = Number(c.value);
      });
      state = clampState(def, raw);
      draw();
      evaluate();
    });
  });
  draw();
}
