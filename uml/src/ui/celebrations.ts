import type { LearningStage } from "../curriculum/learning-path";
import type { AppLocale } from "../i18n/translations";
import {
  ZAM_UML_CELL_TITLE,
  zamEnrolRequest,
} from "../zam/zam-link";

/**
 * Plays a pleasant, subtle WebAudio harmonic chord when a lesson or stage is mastered.
 */
export function playCelebrationSound(
  type: "lesson" | "stage",
  enabled = true,
): void {
  if (!enabled || typeof window === "undefined") return;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return;

  try {
    const ctx = new AudioCtx();
    const notes =
      type === "stage"
        ? [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
        : [587.33, 880.0]; // D5, A5

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(
        0.12,
        ctx.currentTime + idx * 0.08 + 0.03,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + idx * 0.08 + 0.45,
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.48);
    });
  } catch {
    // AudioContext blocked or unsupported
  }
}

/**
 * Launches a lightweight, high-FPS confetti burst across the viewport.
 * Respects `prefers-reduced-motion: reduce`.
 */
export function launchConfettiBurst(
  intensity: "small" | "grand" = "grand",
): void {
  if (
    typeof window === "undefined" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.className = "confetti-overlay-canvas";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const colors = [
    "#2563eb",
    "#7c3aed",
    "#059669",
    "#d97706",
    "#e11d48",
    "#0284c7",
    "#f59e0b",
  ];
  const count = intensity === "grand" ? 110 : 45;

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    vRot: number;
    alpha: number;
  }

  const particles: Particle[] = Array.from({ length: count }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.3;
    const speed = 6 + Math.random() * 11;
    return {
      x: canvas.width * (0.35 + Math.random() * 0.3),
      y: canvas.height * 0.55,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)]!,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.22,
      alpha: 1,
    };
  });

  let frame = 0;
  const maxFrames = intensity === "grand" ? 130 : 75;

  function step() {
    frame += 1;
    ctx!.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28; // gravity
      p.vx *= 0.99;
      p.rotation += p.vRot;
      if (frame > maxFrames * 0.65) {
        p.alpha = Math.max(0, p.alpha - 0.035);
      }

      ctx!.save();
      ctx!.globalAlpha = p.alpha;
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rotation);
      ctx!.fillStyle = p.color;
      ctx!.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
      ctx!.restore();
    }

    if (frame < maxFrames) {
      requestAnimationFrame(step);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(step);
}

let toastSeq = 0;

/**
 * Displays a non-intrusive toast notification using `popover="manual"`
 * per modern-web-guidance `persistent-toast-notifications`.
 */
export function showToastNotification(
  message: string,
  tone: "success" | "info" | "warning" = "info",
  durationMs = 3800,
): void {
  const stack = document.getElementById("toast-stack");
  if (!stack) return;

  toastSeq += 1;
  const toastId = `uml-toast-${toastSeq}`;
  const toast = document.createElement("div");
  toast.id = toastId;
  toast.setAttribute("popover", "manual");
  toast.className = `toast-popover toast-${tone}`;
  toast.setAttribute("role", "status");

  const icon = tone === "success" ? "🎉" : tone === "warning" ? "💡" : "✨";

  const textSpan = document.createElement("span");
  textSpan.className = "toast-text";
  textSpan.textContent = `${icon} ${message}`;

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "toast-close-btn";
  closeBtn.setAttribute("popovertarget", toastId);
  closeBtn.setAttribute("popovertargetaction", "hide");
  closeBtn.setAttribute("aria-label", "Hinweis schließen");
  closeBtn.textContent = "×";

  closeBtn.addEventListener("click", () => {
    try {
      if ("hidePopover" in toast && typeof toast.hidePopover === "function") {
        toast.hidePopover();
      }
    } catch {
      // ignore
    }
    toast.remove();
  });

  toast.append(textSpan, closeBtn);
  stack.appendChild(toast);

  try {
    if ("showPopover" in toast && typeof toast.showPopover === "function") {
      toast.showPopover();
    } else {
      toast.classList.add(":popover-open");
    }
  } catch {
    toast.classList.add(":popover-open");
  }

  window.setTimeout(() => {
    try {
      if ("hidePopover" in toast && typeof toast.hidePopover === "function") {
        toast.hidePopover();
      }
    } catch {
      // ignore
    }
    toast.remove();
  }, durationMs);
}

/**
 * Opens the full-stage Celebration Modal when a learner completes all 4 lessons of a stage.
 */
export function showStageCelebrationModal(
  stage: LearningStage,
  onContinue: () => void,
  locale: AppLocale = "de",
  onOpenZamConsolidation?: (stageId: string) => void,
): void {
  const existing = document.getElementById("stage-celebration-dialog");
  if (existing) existing.remove();

  const isEn = locale === "en";
  const dialog = document.createElement("dialog");
  dialog.id = "stage-celebration-dialog";
  dialog.className = "celebration-dialog";

  dialog.innerHTML = `
    <div class="celebration-dialog-inner">
      <div class="celebration-badge-orb" style="--stage-accent: ${stage.colorAccent}">
        <span class="celebration-badge-emoji">${stage.badgeIcon}</span>
      </div>
      <div class="celebration-kicker">${isEn ? `STAGE ${stage.stageNumber} CELEBRATED & COMPLETED` : `ETAPPE ${stage.stageNumber} GEFEIERT & ABGESCHLOSSEN`}</div>
      <h2 class="celebration-title">${stage.celebrationHeadline}</h2>
      <div class="celebration-award-pill">
        🏆 ${isEn ? "New Badge Earned:" : "Neues Abzeichen errungen:"} <strong>${stage.badgeTitle}</strong>
      </div>
      <p class="celebration-body">${stage.celebrationBody}</p>
      <div class="celebration-toolbox">
        <h3>${isEn ? "Your New Visual Toolbox:" : "Dein neuer visueller Werkzeugkasten:"}</h3>
        <ul>
          ${stage.unlockedElementsSummary.map((item) => `<li>✅ ${item}</li>`).join("")}
        </ul>
      </div>
      <div class="celebration-zam-callout">
        <span>🧠 ${
          isEn
            ? `Stage ${stage.stageNumber} mastered! Want to prevent forgetting this knowledge long-term?`
            : `Etappe ${stage.stageNumber} gemeistert! Möchtest du dieses Wissen dauerhaft gegen das Vergessen sichern?`
        }</span>
        <button type="button" class="btn-secondary btn-sm" id="celebration-zam-btn">
          🧠 ${isEn ? "Consolidate in ZAM" : "In ZAM festigen"}
        </button>
      </div>
      <div class="celebration-actions">
        <button type="button" class="btn-primary btn-large" id="celebration-continue-btn">
          ${isEn ? "Continue on the Learning Path 🚀" : "Weiter auf dem Lernpfad 🚀"}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "true");
  }

  const zamBtn = dialog.querySelector("#celebration-zam-btn");
  zamBtn?.addEventListener("click", () => {
    dialog.close?.();
    dialog.remove();
    if (onOpenZamConsolidation) {
      onOpenZamConsolidation(stage.id);
    }
  });

  const continueBtn = dialog.querySelector("#celebration-continue-btn");
  continueBtn?.addEventListener("click", () => {
    dialog.close?.();
    dialog.remove();
    onContinue();
  });
}

/**
 * Explains how ZAM keeps what this app taught: the learner takes the cell in
 * ZAM Studio („Aus der ZAM Academy“) or asks their agent, and every card
 * links back to its lesson here.
 */
export function showZamConsolidationModal(options: {
  locale: AppLocale;
}): void {
  const existing = document.getElementById("zam-consolidation-dialog");
  if (existing) existing.remove();

  const isEn = options.locale === "en";
  const request = zamEnrolRequest(options.locale);

  const dialog = document.createElement("dialog");
  dialog.id = "zam-consolidation-dialog";
  dialog.className = "celebration-dialog zam-consolidation-dialog";

  dialog.innerHTML = `
    <div class="zam-dialog-inner">
      <div class="zam-dialog-header">
        <div>
          <span class="celebration-kicker">🧠 ${
            isEn ? "PRACTISE HERE → KEEP IT IN ZAM" : "HIER ÜBEN → IN ZAM BEHALTEN"
          }</span>
          <h2 class="celebration-title" style="margin-top: 0.35rem;">
            ${isEn ? "Keep UML 2.5.1 with ZAM" : "UML 2.5.1 mit ZAM behalten"}
          </h2>
        </div>
        <button type="button" class="icon-btn" id="zam-modal-close-btn" aria-label="${
          isEn ? "Close" : "Schließen"
        }">✕</button>
      </div>

      <div class="zam-phases-banner">
        <div class="zam-phase-box">
          <strong>1️⃣ ${isEn ? "Practise here" : "Hier üben"}</strong>
          <p>${
            isEn
              ? "Draw the elements and connections until a real system turns into a correct UML diagram."
              : "Zeichne Elemente und Verbindungen, bis aus einem echten System ein korrektes UML-Diagramm wird."
          }</p>
        </div>
        <div class="zam-phase-arrow" aria-hidden="true">➔</div>
        <div class="zam-phase-box is-zam-phase">
          <strong>2️⃣ ${isEn ? "Keep it in ZAM" : "In ZAM behalten"}</strong>
          <p>${
            isEn
              ? "ZAM asks short questions just before you would forget. Each card links back to the lesson where you practised it."
              : "ZAM fragt nach, kurz bevor du es vergessen würdest. Jede Karte verlinkt die Lektion, in der du es geübt hast."
          }</p>
        </div>
      </div>

      <div class="zam-action-card">
        <h3>${isEn ? "How to start in ZAM" : "So startest du in ZAM"}</h3>
        <p id="zam-studio-path">${
          isEn
            ? `In ZAM Studio, open <strong>Learning Content → Import → From the ZAM Academy</strong> and click <strong>Take</strong> next to “${escapeText(ZAM_UML_CELL_TITLE)}”. In the ZAM phone app, “From the ZAM Academy” is next to “Choose curriculum”.`
            : `Öffne in ZAM Studio <strong>Lerninhalte → Importieren → Aus der ZAM Academy</strong> und klicke bei „${escapeText(ZAM_UML_CELL_TITLE)}“ auf <strong>Aufnehmen</strong>. In der ZAM-App auf dem Handy steht „Aus der ZAM Academy“ neben „Lehrplan auswählen“.`
        }</p>
        <p>${isEn ? "Or tell your agent in ZAM:" : "Oder sag deinem Agenten in ZAM:"}</p>
        <div class="zam-code-row">
          <code id="zam-enrol-request">${escapeText(request)}</code>
          <button type="button" class="btn-secondary btn-sm" id="zam-copy-request-btn">
            📋 ${isEn ? "Copy" : "Kopieren"}
          </button>
        </div>
        <small class="zam-hint-note">${
          isEn
            ? `The cell comes with ZAM; “From the ZAM Academy” is there from ZAM 0.54 on.`
            : `Die Zelle ist in ZAM enthalten; „Aus der ZAM Academy“ gibt es ab ZAM 0.54.`
        }</small>
      </div>

      <div class="celebration-actions" style="margin-top: 1.1rem;">
        <button type="button" class="btn-primary" id="zam-modal-done-btn">
          ${isEn ? "Back to practice" : "Zurück zum Üben"}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "true");
  }

  const closeDialog = () => {
    dialog.close?.();
    dialog.remove();
  };

  dialog
    .querySelector("#zam-modal-close-btn")
    ?.addEventListener("click", closeDialog);
  dialog
    .querySelector("#zam-modal-done-btn")
    ?.addEventListener("click", closeDialog);

  dialog
    .querySelector("#zam-copy-request-btn")
    ?.addEventListener("click", () => {
      if (navigator.clipboard?.writeText) {
        void navigator.clipboard.writeText(request);
      }
      showToastNotification(isEn ? "Copied." : "Kopiert.", "success");
    });
}

function escapeText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
