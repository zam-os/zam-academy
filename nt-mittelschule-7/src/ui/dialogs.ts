import { ZAM_CELL_TITLE, zamEnrolRequest } from "../zam/zam-link";
import { esc } from "../exercises/format";
import type { Stage } from "../model/types";

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

/** Connects lesson practice to the cell available in the Academy catalog. */
export function showZamDialog(): void {
  const dialog = mountDialog("zam-dialog", `
    <div class="dialog-inner">
      <h2 class="dialog-title">Natur und Technik 7 mit ZAM wiederholen</h2>
      <p>Zu jeder Lektion gibt es drei Wiederholungskarten. Jede Karte führt zur passenden Lektion zurück.</p>
      <p>Öffne in ZAM Studio <strong>Lern-Karten → Importieren → Aus der ZAM Academy</strong> und wähle <strong>${esc(ZAM_CELL_TITLE)}</strong>.</p>
      <p>Für deinen ZAM-Agenten kannst du diesen Auftrag kopieren.</p>
      <div class="code-row"><code>${esc(zamEnrolRequest())}</code><button type="button" class="btn btn-secondary" id="zam-copy-request">Kopieren</button></div>
      <p role="status" id="zam-copy-status"></p>
      <div class="dialog-actions">
        <button type="button" class="btn btn-primary" data-close>Zurück zum Üben</button>
      </div>
    </div>`);
  dialog.querySelector("#zam-copy-request")?.addEventListener("click", async () => {
    const status = dialog.querySelector("#zam-copy-status");
    if (!status) return;
    try {
      await navigator.clipboard.writeText(zamEnrolRequest());
      status.textContent = "Auftrag kopiert.";
    } catch {
      status.textContent = "Markiere den Auftrag und kopiere ihn manuell.";
    }
  });
}

/** Celebrates a finished stage; `lessonCount` is how many lessons counted for this learner's track. */
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
      <p>Du hast alle ${lessonCount} Lektionen von „${esc(stage.title)}“ für deine Klasse abgeschlossen: Schnellcheck, Laboraufträge und Aufgaben.</p>
      <p class="dialog-alt">Mit den ZAM-Karten kannst du später die wichtigsten Zusammenhänge der Etappe wiederholen.</p>
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
