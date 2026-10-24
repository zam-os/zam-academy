import { WORKSHOPS } from "./curriculum";
import { esc, shuffled } from "./html";
import type { Progress } from "./progress";
import { checkWorkshop, workshopSolved } from "./workshop";

export function mountWorkshop(
  host: HTMLElement,
  id: string,
  progress: Progress,
  changed: () => void,
): void {
  const workshop = WORKSHOPS[id];
  const answers = progress.workshopDrafts[id] ?? workshop.entries.map(() => -1);
  progress.workshopDrafts[id] = answers;
  const categories = shuffled(
    workshop.categories.map((text, index) => ({ text, index })),
    `${id}:categories`,
  );
  const entries = shuffled(
    workshop.entries.map((entry, index) => ({ ...entry, index })),
    `${id}:cases`,
  );
  host.innerHTML = `<p class="eyebrow">02 · FALLWERKSTATT</p><h2>${esc(workshop.title)}</h2><p class="task">${esc(workshop.instruction)}</p><p class="small">Ziel: Ordne alle ${entries.length} Fälle passend zu. Die Rückmeldung erklärt jede Entscheidung.</p><div class="workshop-cases">${entries.map((entry) => `<div class="workshop-case"><label for="case-${entry.index}">${esc(entry.text)}</label><select id="case-${entry.index}" data-case="${entry.index}"><option value="-1" ${answers[entry.index] === -1 ? "selected" : ""}>Bitte zuordnen …</option>${categories.map((category) => `<option value="${category.index}" ${answers[entry.index] === category.index ? "selected" : ""}>${esc(category.text)}</option>`).join("")}</select><p data-case-feedback="${entry.index}" class="small"></p></div>`).join("")}</div><button class="button secondary" id="check-workshop">Zuordnung prüfen</button><p id="workshop-status" role="status">${progress.workshops.includes(id) ? "✓ Alle Fälle richtig zugeordnet." : ""}</p>`;
  host.querySelectorAll<HTMLSelectElement>("[data-case]").forEach((input) => {
    input.addEventListener("change", () => {
      answers[Number(input.dataset.case)] = Number(input.value);
      progress.workshops = progress.workshops.filter((entry) => entry !== id);
      host.querySelectorAll("[data-case-feedback]").forEach((element) => {
        element.textContent = "";
      });
      host.querySelector("#workshop-status")!.textContent =
        "Zuordnung geändert. Prüfe deine Entscheidungen erneut.";
      changed();
    });
  });
  host.querySelector("#check-workshop")!.addEventListener("click", () => {
    const results = checkWorkshop(workshop, answers);
    const passed = workshopSolved(workshop, answers);
    progress.workshops = progress.workshops.filter((entry) => entry !== id);
    if (passed) progress.workshops.push(id);
    workshop.entries.forEach((entry, index) => {
      const element = host.querySelector<HTMLElement>(
        `[data-case-feedback="${index}"]`,
      )!;
      element.className = `feedback ${results[index] ? "success" : "warning"}`;
      element.textContent = `${results[index] ? "✓ Passend zugeordnet." : answers[index] === -1 ? "Wähle eine Zuordnung." : "Prüfe deine Zuordnung noch einmal."} ${entry.feedback}`;
    });
    host.querySelector("#workshop-status")!.textContent = passed
      ? "✓ Alle Fälle richtig zugeordnet."
      : `${results.filter(Boolean).length} von ${results.length} Fällen passen. Überarbeite die offenen Entscheidungen.`;
    changed();
  });
}
