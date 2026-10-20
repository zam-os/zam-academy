import { esc } from "../exercises/format";
import { UI_STRINGS } from "../i18n/translations";
import type { AppLocale, Stage } from "../model/types";
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
export function showZamDialog(locale: AppLocale): void {
  const t = UI_STRINGS[locale];
  const request = zamEnrolRequest(locale);
  const dialog = mountDialog(
    "zam-dialog",
    `
    <div class="dialog-inner">
      <div class="dialog-header">
        <div>
          <span class="dialog-kicker">${esc(t.zamKicker)}</span>
          <h2 class="dialog-title">${esc(t.zamTitle)}</h2>
        </div>
        <button type="button" class="icon-btn" data-close aria-label="✕">✕</button>
      </div>
      <div class="phase-row">
        <div class="phase-box">
          <strong>${esc(t.zamPhase1Title)}</strong>
          <p>${esc(t.zamPhase1Text)}</p>
        </div>
        <div class="phase-arrow" aria-hidden="true">➔</div>
        <div class="phase-box is-zam">
          <strong>${esc(t.zamPhase2Title)}</strong>
          <p>${esc(t.zamPhase2Text)}</p>
        </div>
      </div>
      <div class="action-card">
        <h3>${esc(t.zamHowTitle)}</h3>
        <ol class="dialog-steps">
          <li>${t.zamStep1Html}</li>
          <li>${t.zamStep2Html(esc(ZAM_CELL_TITLE))}</li>
        </ol>
        <p class="dialog-alt">${esc(t.zamOrSay)}</p>
        <div class="code-row">
          <code id="zam-enrol-request">${esc(request)}</code>
          <button type="button" class="btn btn-secondary btn-sm" id="zam-copy-request-btn">${esc(t.zamCopy)}</button>
        </div>
        <small class="dialog-note">${esc(t.zamNote)}</small>
      </div>
      <div class="dialog-actions">
        <button type="button" class="btn btn-primary" data-close>${esc(t.zamBack)}</button>
      </div>
    </div>`,
  );
  dialog.querySelector("#zam-copy-request-btn")?.addEventListener("click", () => {
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(request).catch(() => {});
    }
    showToast(t.zamCopied, "success", 3600, t.closeToast);
  });
}

/** Celebrates a finished stage; `lessonCount` is how many lessons counted for this learner's scope. */
export function showStageCelebration(
  locale: AppLocale,
  stage: Stage,
  onContinue: () => void,
  lessonCount = stage.lessons.length,
): void {
  const t = UI_STRINGS[locale];
  const text = stage.text[locale];
  const dialog = mountDialog(
    "stage-dialog",
    `
    <div class="dialog-inner celebration">
      <div class="celebration-icon" aria-hidden="true">${stage.icon}</div>
      <span class="dialog-kicker">${esc(t.celebrationKicker(stage.stageNumber))}</span>
      <h2 class="dialog-title">${esc(text.badgeTitle)}</h2>
      <p>${esc(t.celebrationBody(lessonCount, text.title))}</p>
      <p class="dialog-alt">${esc(t.celebrationKeep)}</p>
      <div class="dialog-actions">
        <button type="button" class="btn btn-secondary" id="stage-zam-btn">${esc(t.celebrationZam)}</button>
        <button type="button" class="btn btn-primary" data-close>${esc(t.celebrationContinue)}</button>
      </div>
    </div>`,
  );
  dialog.querySelector("#stage-zam-btn")?.addEventListener("click", () => {
    dialog.close?.();
    dialog.remove();
    showZamDialog(locale);
  });
  dialog.addEventListener("close", onContinue, { once: true });
}

/** Asks before progress is wiped. */
export function confirmReset(locale: AppLocale, onConfirm: () => void): void {
  const t = UI_STRINGS[locale];
  const dialog = mountDialog(
    "reset-dialog",
    `
    <div class="dialog-inner">
      <h2 class="dialog-title">${esc(t.resetTitle)}</h2>
      <p>${esc(t.resetText)}</p>
      <div class="dialog-actions">
        <button type="button" class="btn btn-secondary" data-close>${esc(t.resetCancel)}</button>
        <button type="button" class="btn btn-danger" id="reset-confirm-btn">${esc(t.resetConfirm)}</button>
      </div>
    </div>`,
  );
  dialog.querySelector("#reset-confirm-btn")?.addEventListener("click", () => {
    dialog.close?.();
    dialog.remove();
    onConfirm();
  });
}
