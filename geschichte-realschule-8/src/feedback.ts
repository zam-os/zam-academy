import type { Check, Workshop } from "./model/types";
import { checkWorkshop, esc } from "./workshop";

/** A wrong attempt gets another attempt, without revealing the explanation. */
export function renderQuizFeedback(quiz: Check, selected?: number): string {
  if (selected === undefined) return "";
  return selected === 0
    ? `<p class="feedback success" role="status"><strong>Richtig. </strong>${esc(quiz.explanation)}</p>`
    : '<p class="feedback hint" role="status"><strong>Die Antwort stimmt noch nicht. </strong>Prüfe die Möglichkeiten noch einmal.</p>';
}

/** Explain only entries that are correctly placed; the conclusion needs a full solution. */
export function renderWorkshopFeedback(
  workshop: Workshop,
  answer: number[],
): string {
  const results = checkWorkshop(workshop, answer);
  const solved = results.every(Boolean);
  const entries =
    workshop.kind === "timeline" ? answer : workshop.entries.map((_, i) => i);
  return `<div class="feedback ${solved ? "success" : "hint"}" role="status"><strong>${solved ? "Die Zuordnung stimmt." : `${results.filter(Boolean).length} von ${results.length} stimmen. Prüfe die übrigen noch einmal.`}</strong><ul>${results.map((correct, position) => `<li>${correct ? `✓ ${esc(workshop.entries[entries[position]].feedback)}` : `→ Zuordnung ${position + 1} stimmt noch nicht.`}</li>`).join("")}</ul>${solved ? `<p>${esc(workshop.conclusion)}</p>` : ""}</div>`;
}
