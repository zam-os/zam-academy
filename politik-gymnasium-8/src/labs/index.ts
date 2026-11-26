/**
 * Registry and DOM wiring of the 18 interactive models across LB 1–5 and Profil 6.1–6.5.
 */
import type { LabKind } from "../model/types";
import { esc } from "../workshop";
import {
  applyControl,
  type LabControl,
  type LabDef,
  type LabState,
} from "./core";
export type { LabState };
import {
  identitaetWaage,
  influencerStrategie,
  jugendWerteBarometer,
  konfliktEskalation,
  popularitaetSpektrum,
  sozialisationsNetz,
} from "./jugend";
import {
  grenzKonfliktLoesung,
  kompromissRat,
  kooperationsEbenen,
  politikKreislauf,
} from "./politik";
import {
  fuehrungsStile,
  gesundheitsDreieck,
  heimatKompass,
  medienVergleich,
  pausenbrotTeller,
  regionZukunft,
  soziogrammLabor,
  umfrageAuswerter,
} from "./profil";

export const LABS: Record<LabKind, LabDef> = {
  jugendWerteBarometer,
  identitaetWaage,
  sozialisationsNetz,
  konfliktEskalation,
  popularitaetSpektrum,
  influencerStrategie,
  politikKreislauf,
  kompromissRat,
  kooperationsEbenen,
  grenzKonfliktLoesung,
  heimatKompass,
  regionZukunft,
  medienVergleich,
  umfrageAuswerter,
  soziogrammLabor,
  fuehrungsStile,
  gesundheitsDreieck,
  pausenbrotTeller,
};

export function freshLab(kind: LabKind): LabState {
  return LABS[kind].init();
}

function renderControl(control: LabControl, state: LabState): string {
  if (control.type === "range") {
    const value = Number(state[control.key]);
    return `<label class="lab-range" data-lab-label="${control.key}">${esc(control.label)}: <strong>${esc(control.format(value))}</strong><input type="range" data-lab-range="${control.key}" min="${control.min}" max="${control.max}" step="${control.step}" value="${value}"></label>`;
  }
  if (control.type === "toggle") {
    const checked = Boolean(state[control.key]);
    return `<label class="lab-toggle"><input type="checkbox" data-lab-check="${control.key}" ${checked ? "checked" : ""}>${esc(control.label)}</label>`;
  }
  const pressed = (value: string) =>
    control.type === "choice"
      ? ` aria-pressed="${String(state[control.key]) === value}"`
      : "";
  return `<div class="lab-choice" role="group" aria-label="${esc(control.label)}"><span class="small">${esc(control.label)}</span><div class="chip-row">${control.options
    .map(
      (option) =>
        `<button type="button" class="chip${control.type === "actions" ? " action" : ""}" data-lab-set="${control.key}" data-lab-value="${esc(option.value)}"${pressed(option.value)}>${esc(option.label)}</button>`,
    )
    .join("")}</div></div>`;
}

export function trackedGoals(def: LabDef, state: LabState) {
  const reached = new Set(
    String(state.__reached ?? "")
      .split(",")
      .filter(Boolean),
  );
  const goals = def.goals(state).map((goal, i) => {
    if (goal.met) reached.add(String(i));
    return { ...goal, met: goal.met || reached.has(String(i)) };
  });
  state.__reached = [...reached].sort().join(",");
  return goals;
}

function renderGoals(def: LabDef, state: LabState): string {
  return trackedGoals(def, state)
    .map(
      (goal) =>
        `<li class="${goal.met ? "met" : ""}">${goal.met ? "✓" : "○"} ${esc(goal.text)}</li>`,
    )
    .join("");
}

function counter(def: LabDef, state: LabState): string {
  const goals = trackedGoals(def, state);
  return `${goals.filter((goal) => goal.met).length} / ${goals.length} Erkundungsziele`;
}

export function renderLab(kind: LabKind, state: LabState): string {
  const def = LABS[kind];
  return `<section class="lab" data-lab="${kind}" aria-label="Interaktives Labor: ${esc(def.title)}">
    <div class="panel-heading"><span class="eyebrow">INTERAKTIVES LABOR · ${esc(def.title.toUpperCase())}</span><span class="done-mark" data-lab-count>${counter(def, state)}</span></div>
    <p class="lab-prompt">${esc(def.prompt)}</p>
    <div class="lab-stage" data-lab-stage>${def.draw(state)}</div>
    <p class="lab-readout" data-lab-readout role="status">${esc(def.readout(state))}</p>
    <div class="lab-controls" data-lab-controls>${def
      .controls(state)
      .map((control) => renderControl(control, state))
      .join("")}</div>
    <ul class="lab-goals" data-lab-goals>${renderGoals(def, state)}</ul>
  </section>`;
}

export function mountLab(
  host: HTMLElement,
  kind: LabKind,
  state: LabState,
): void {
  const def = LABS[kind];
  const refresh = (rebuildControls: boolean) => {
    host.querySelector("[data-lab-stage]")!.innerHTML = def.draw(state);
    host.querySelector("[data-lab-readout]")!.textContent = def.readout(state);
    host.querySelector("[data-lab-goals]")!.innerHTML = renderGoals(def, state);
    host.querySelector("[data-lab-count]")!.textContent = counter(def, state);
    if (rebuildControls) {
      const active = document.activeElement as HTMLElement | null;
      const focusKey = active?.dataset.labSet ?? active?.dataset.labCheck;
      const focusValue = active?.dataset.labValue;
      host.querySelector("[data-lab-controls]")!.innerHTML = def
        .controls(state)
        .map((control) => renderControl(control, state))
        .join("");
      bind();
      if (focusKey) {
        const selector = focusValue
          ? `[data-lab-set="${focusKey}"][data-lab-value="${CSS.escape(focusValue)}"]`
          : `[data-lab-check="${focusKey}"]`;
        host
          .querySelector<HTMLElement>(selector)
          ?.focus({ preventScroll: true });
      }
    } else {
      for (const control of def.controls(state)) {
        if (control.type !== "range") continue;
        const labelEl = host.querySelector(
          `[data-lab-label="${control.key}"] strong`,
        );
        if (labelEl)
          labelEl.textContent = control.format(Number(state[control.key]));
      }
    }
  };
  const bind = () => {
    host
      .querySelectorAll<HTMLInputElement>("[data-lab-range]")
      .forEach((input) => {
        input.addEventListener("input", () => {
          applyControl(def, state, input.dataset.labRange!, Number(input.value));
          refresh(false);
        });
      });
    host
      .querySelectorAll<HTMLInputElement>("[data-lab-check]")
      .forEach((input) => {
        input.addEventListener("change", () => {
          applyControl(def, state, input.dataset.labCheck!, input.checked);
          refresh(true);
        });
      });
    host
      .querySelectorAll<HTMLButtonElement>("[data-lab-set]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          applyControl(
            def,
            state,
            button.dataset.labSet!,
            button.dataset.labValue!,
          );
          refresh(true);
        });
      });
  };
  bind();
}
