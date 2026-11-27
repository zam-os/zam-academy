import type { ChoiceParam, LabAction, LabGoal, LabReadout, LabValues, RangeParam } from "../model/types";
import { esc } from "../exercises/format";

export function select(key: string, label: string, labels: string[], value = 0): ChoiceParam {
  return { type: "choice", key, label, value, options: labels.map((label, value) => ({ label, value })) };
}

export function slider(key: string, label: string, min: number, max: number, value: number, unit = ""): RangeParam {
  return { type: "range", key, label, min, max, value, unit, step: 1, digits: 0 };
}

export function action(id: string, label: string, apply: LabAction["apply"]): LabAction {
  return { id, label, apply };
}

export function goal(id: string, text: string, check: (v: LabValues) => boolean): LabGoal {
  return { id, text, check };
}

export function readout(key: string, label: string, compute: LabReadout["compute"]): LabReadout {
  return { key, label, compute, digits: 0 };
}

export function panel(title: string, detail: string, active = false): string {
  return `<div class="viz-panel${active ? " is-highlighted" : ""}"><strong>${esc(title)}</strong><span>${esc(detail)}</span></div>`;
}
