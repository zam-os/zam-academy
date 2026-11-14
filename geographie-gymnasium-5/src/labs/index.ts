import type { LabId } from "../model/types";
import { esc } from "../workshop";
import type { LabDef, LabState } from "./core";
import { gradnetz, hoehen, kompass, lebenszone, massstab, saeulen, schalen } from "./erde";
import { gezeiten, kartierung, landnutzung, pendler, planquadrat, wetterwoche } from "./raum";

export type { LabDef, LabState } from "./core";

export const LABS: Record<LabId, LabDef> = {
  kompass,
  gradnetz,
  massstab,
  hoehen,
  schalen,
  lebenszone,
  saeulen,
  wetterwoche,
  landnutzung,
  gezeiten,
  pendler,
  planquadrat,
  kartierung,
};

/** Apply a change and the lab's own bookkeeping. */
export function settle(lab: LabDef, state: LabState): LabState {
  return lab.update ? lab.update(state) : state;
}

export function reachedGoals(lab: LabDef, state: LabState): boolean[] {
  return lab.goals.map((goal) => goal.reached(state));
}

/**
 * The lab section of a lesson. `done` marks goals reached at any time
 * (stored progress); the list shows them with a tick.
 */
export function renderLab(lab: LabDef, state: LabState, done: boolean[]): string {
  return `<section class="panel lab" id="lab" aria-labelledby="lab-heading"><div class="panel-heading"><span class="eyebrow">LABOR · AUSPROBIEREN</span><span class="done-mark">${done.every(Boolean) ? "✓ Alle Ziele erreicht" : `${done.filter(Boolean).length} / 3 Ziele`}</span></div><h2 id="lab-heading">${esc(lab.title)}</h2><p>${esc(lab.intro)}</p><ol class="lab-goals">${lab.goals.map((goal, i) => `<li class="${done[i] ? "goal-done" : ""}"><span class="goal-mark" aria-hidden="true">${done[i] ? "✓" : i + 1}</span>${esc(goal.text)}${done[i] ? '<span class="visually-hidden"> (erreicht)</span>' : ""}</li>`).join("")}</ol><div class="lab-body" id="lab-body">${lab.render(state)}</div><p class="small lab-note">${esc(lab.note)}</p></section>`;
}
