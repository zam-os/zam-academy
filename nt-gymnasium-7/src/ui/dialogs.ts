import { esc } from "../exercises/format";
import type { Stage } from "../model/types";
import { ZAM_CELL_TITLE } from "../zam/zam-link";

function mountDialog(id: string, innerHtml: string): HTMLDialogElement {
  document.getElementById(id)?.remove();
  const dialog = document.createElement("dialog");
  dialog.id = id;
  dialog.className = "app-dialog";
  dialog.innerHTML = innerHtml;
  document.body.appendChild(dialog);
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "true");
  const close = () => {
    dialog.close?.();
    dialog.remove();
  };
  dialog.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", close);
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });
  return dialog;
}

/**
 * Explains how ZAM keeps what this app taught: the learner takes the cell
 * in ZAM Studio or asks their agent, and every card links back to its
 * lesson here.
 */
export function showZamDialog(): void {
  mountDialog(
    "zam-dialog",
    `
    <div class="dialog-inner">
      <div class="dialog-header">
        <h2 class="dialog-title">Informatik 7 mit ZAM behalten</h2>
        <button type="button" class="icon-btn" data-close aria-label="Schließen">✕</button>
      </div>
      <p>Die Lernkarten zu „${esc(ZAM_CELL_TITLE)}“ gehören zu diesem Entwurf. Die Aufnahme über den Academy-Katalog ist nach der Veröffentlichung möglich.</p>
      <div class="dialog-actions">
        <button type="button" class="btn btn-primary" data-close>Zurück zum Üben</button>
      </div>
    </div>`,
  );
}

/** Celebrates a finished stage. */
export function showStageCelebration(
  stage: Stage,
  onContinue: () => void,
  lessonCount = stage.lessons.length,
): void {
  const dialog = mountDialog(
    "stage-dialog",
    `
    <div class="dialog-inner celebration">
      <div class="celebration-icon" aria-hidden="true">${stage.icon}</div>
      <span class="dialog-kicker">ETAPPE ${stage.stageNumber} GESCHAFFT</span>
      <h2 class="dialog-title">${esc(stage.badgeTitle)}</h2>
      <p>Du hast alle ${lessonCount} Lektionen von „${esc(stage.title)}“ abgeschlossen: Schnellcheck, Werkstattaufträge und Aufgaben.</p>
      <p class="dialog-alt">Im Fachbegriffe-Register findest du die Merksätze dieser Etappe.</p>
      <div class="dialog-actions">
        <button type="button" class="btn btn-secondary" id="stage-zam-btn">🧠 In ZAM festigen</button>
        <button type="button" class="btn btn-primary" data-close>Weiter</button>
      </div>
    </div>`,
  );
  dialog.querySelector("#stage-zam-btn")?.addEventListener("click", () => {
    dialog.close?.();
    dialog.remove();
    showZamDialog();
  });
  dialog.addEventListener("close", onContinue, { once: true });
}

/** Asks before progress is wiped. */
export function confirmReset(onConfirm: () => void): void {
  const dialog = mountDialog(
    "reset-dialog",
    `
    <div class="dialog-inner">
      <h2 class="dialog-title">Fortschritt zurücksetzen?</h2>
      <p>Alle Schnellchecks, Werkstattaufträge und gelösten Aufgaben werden gelöscht. Das lässt sich nicht rückgängig machen.</p>
      <div class="dialog-actions">
        <button type="button" class="btn btn-secondary" data-close>Abbrechen</button>
        <button type="button" class="btn btn-danger" id="reset-confirm-btn">Zurücksetzen</button>
      </div>
    </div>`,
  );
  dialog.querySelector("#reset-confirm-btn")?.addEventListener("click", () => {
    dialog.close?.();
    dialog.remove();
    onConfirm();
  });
}
