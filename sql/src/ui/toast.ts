let toastSeq = 0;

export type ToastTone = "success" | "info" | "warning";

/** A short notice in the corner that closes itself. */
export function showToast(
  message: string,
  tone: ToastTone = "info",
  durationMs = 3600,
  closeLabel = "Close",
): void {
  const stack = document.getElementById("toast-stack");
  if (!stack) return;
  toastSeq += 1;
  const toast = document.createElement("div");
  toast.className = `toast toast-${tone}`;
  toast.setAttribute("role", "status");
  const icon = tone === "success" ? "🎉" : tone === "warning" ? "💡" : "✨";
  const span = document.createElement("span");
  span.className = "toast-text";
  span.textContent = `${icon} ${message}`;
  const close = document.createElement("button");
  close.type = "button";
  close.className = "toast-close";
  close.setAttribute("aria-label", closeLabel);
  close.textContent = "×";
  close.addEventListener("click", () => toast.remove());
  toast.append(span, close);
  stack.appendChild(toast);
  window.setTimeout(() => toast.remove(), durationMs);
}
