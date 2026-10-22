import { esc } from "../exercises/format";
import type { Stage } from "../model/types";
import { ZAM_CELL_TITLE, zamEnrolRequest } from "../zam/zam-link";
import { showToast } from "./toast";

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
  const request = zamEnrolRequest();
  const dialog = mountDialog(
    "zam-dialog",
    `
    <div class="dialog-inner">
      <div class="dialog-header">
        <div>
          <span class="dialog-kicker">🧠 HIER ÜBEN → IN ZAM BEHALTEN</span>
          <h2 class="dialog-title">Mathematik 10 mit ZAM behalten</h2>
        </div>
        <button type="button" class="icon-btn" data-close aria-label="Schließen">✕</button>
      </div>
      <div class="phase-row">
        <div class="phase-box">
          <strong>1️⃣ Hier üben</strong>
          <p>Ziehe Punkte, verändere Figuren und Graphen, rechne, bis du die Zusammenhänge verstanden hast.</p>
        </div>
        <div class="phase-arrow" aria-hidden="true">➔</div>
        <div class="phase-box is-zam">
          <strong>2️⃣ In ZAM behalten</strong>
          <p>ZAM fragt kurz nach, bevor du es vergessen würdest. Jede Karte verlinkt die Lektion, in der du geübt hast.</p>
        </div>
      </div>
      <div class="action-card">
        <h3>So kommt die Zelle in dein ZAM</h3>
        <ol class="dialog-steps">
          <li>Öffne ZAM Studio → <strong>Lern-Karten</strong> → Importieren → <strong>„Aus der ZAM Academy“</strong>.</li>
          <li>Wähle <strong>„${esc(ZAM_CELL_TITLE)}“</strong> und klicke <strong>„Aufnehmen“</strong>.</li>
        </ol>
        <p class="dialog-alt">Oder sag deinem Agenten in ZAM:</p>
        <div class="code-row">
          <code id="zam-enrol-request">${esc(request)}</code>
          <button type="button" class="btn btn-secondary btn-sm" id="zam-copy-request-btn">📋 Kopieren</button>
        </div>
        <small class="dialog-note">Die Karten fragen je einen Punkt ab, zum Beispiel eine Formel, einen Lösungsfall oder einen Zusammenhang aus dem Labor.</small>
      </div>
      <div class="dialog-actions">
        <button type="button" class="btn btn-primary" data-close>Zurück zum Üben</button>
      </div>
    </div>`,
  );
  dialog.querySelector("#zam-copy-request-btn")?.addEventListener("click", () => {
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(request).catch(() => {});
    }
    showToast("Kopiert.", "success");
  });
}

/** Celebrates a finished stage; `lessonCount` is how many lessons counted for this learner's Zweig. */
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
      <p>Du hast alle ${lessonCount} Lektionen von „${esc(stage.title)}“ für deinen Zweig abgeschlossen: Schnellcheck, Laboraufträge und Aufgaben.</p>
      <p class="dialog-alt">Damit es bleibt: In ZAM fragt dich eine Karte nach jedem Punkt dieser Etappe genau dann, wenn du ihn vergessen würdest.</p>
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
      <p>Alle Schnellchecks, Laboraufträge und gelösten Aufgaben werden gelöscht. Das lässt sich nicht rückgängig machen.</p>
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
