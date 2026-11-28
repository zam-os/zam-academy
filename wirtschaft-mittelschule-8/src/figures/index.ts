import { esc } from "../workshop";
import { type ConceptFigure, renderStageArt, stageIcon, STEP_ICONS } from "./draw";
import { LB1_2_FIGURES } from "./lb1-2";
import { LB3_FIGURES } from "./lb3";
import { LB4_5_FIGURES } from "./lb4-5";

export { renderStageArt, stageIcon, STEP_ICONS, type ConceptFigure };

export const FIGURES: Record<string, ConceptFigure> = {
  ...LB1_2_FIGURES,
  ...LB3_FIGURES,
  ...LB4_5_FIGURES,
};

const DEFAULT_NOTE =
  "Wähle einen Bildteil im Schaubild oder über die Tasten. Mit „Alles ansehen“ hebst du alle Teile wieder hervor.";

export function renderFigure(lessonId: string, requestedFocus = 0): string {
  const figure = Object.hasOwn(FIGURES, lessonId) ? FIGURES[lessonId] : undefined;
  if (!figure) return "";
  const focus =
    Number.isInteger(requestedFocus) &&
    requestedFocus >= 0 &&
    requestedFocus <= figure.parts.length
      ? requestedFocus
      : 0;
  const titleId = `${lessonId}-figure-title`;
  const descriptionId = `${lessonId}-figure-description`;
  const drawing = figure
    .draw()
    .replace(
      /class="visual-part" data-part="(\d+)"/g,
      (_match, partIndex: string) =>
        `class="visual-part${focus && Number(partIndex) !== focus ? " is-muted" : ""}" data-part="${partIndex}"`,
    );
  const activePart = focus ? figure.parts[focus - 1] : undefined;
  return `<figure class="concept-figure" data-figure="${esc(lessonId)}" data-focus="${focus}">
    <figcaption><div class="eyebrow">${STEP_ICONS.figure}<span>Im Bild verstehen</span></div><h3 id="${titleId}">${esc(figure.title)}</h3><p class="figure-question">${esc(figure.question)}</p></figcaption>
    <div class="figure-scroll" tabindex="0" role="region" aria-label="${esc(figure.title)} · bei schmalem Bildschirm seitlich verschieben"><svg class="concept-svg" viewBox="0 0 760 270" role="img" aria-labelledby="${titleId} ${descriptionId}"><desc id="${descriptionId}">${esc(figure.alt)}</desc>${drawing}</svg></div>
    <p class="figure-pan-hint small">Bei schmalem Bildschirm kannst du das Schaubild seitlich verschieben.</p>
    <div class="figure-controls" role="group" aria-label="Bildteile hervorheben"><button type="button" data-figure-focus="0" aria-pressed="${focus === 0}">Alles ansehen</button>${figure.parts.map((entry, i) => `<button type="button" data-figure-focus="${i + 1}" aria-pressed="${focus === i + 1}"><span aria-hidden="true">${i + 1}</span> ${esc(entry.label)}</button>`).join("")}</div>
    <p class="figure-note" role="status" aria-live="polite">${activePart ? `<strong>${esc(activePart.label)}:</strong> ${esc(activePart.note)}` : DEFAULT_NOTE}</p>
    <p class="figure-caption small">${esc(figure.caption)}</p>
  </figure>`;
}

export function bindFigure(lessonId: string, figureFocus: Map<string, number>): void {
  const figure = document.querySelector<HTMLElement>(".concept-figure");
  const definition = Object.hasOwn(FIGURES, lessonId) ? FIGURES[lessonId] : undefined;
  if (!figure || !definition) return;

  const panToPart = (focus: number): void => {
    const viewport = figure.querySelector<HTMLElement>(".figure-scroll");
    if (!viewport || viewport.scrollWidth <= viewport.clientWidth) return;
    if (focus === 0) {
      viewport.scrollLeft = 0;
      return;
    }
    const bounds = Array.from(
      figure.querySelectorAll<SVGGElement>(`[data-part="${focus}"]`),
      (entry) => entry.getBoundingClientRect(),
    );
    if (!bounds.length) return;
    const center =
      (Math.min(...bounds.map((b) => b.left)) + Math.max(...bounds.map((b) => b.right))) / 2;
    viewport.scrollLeft += center - viewport.getBoundingClientRect().left - viewport.clientWidth / 2;
  };

  const applyFocus = (focus: number): void => {
    if (!Number.isInteger(focus) || focus < 0 || focus > definition.parts.length) return;
    figureFocus.set(lessonId, focus);
    figure.dataset.focus = String(focus);
    panToPart(focus);
    figure.querySelectorAll<HTMLButtonElement>("[data-figure-focus]").forEach((entry) => {
      entry.setAttribute("aria-pressed", String(Number(entry.dataset.figureFocus) === focus));
    });
    figure.querySelectorAll<SVGGElement>(".visual-part").forEach((entry) => {
      entry.classList.toggle("is-muted", focus !== 0 && Number(entry.dataset.part) !== focus);
    });
    const note = figure.querySelector(".figure-note");
    if (note) {
      if (focus) {
        const selected = definition.parts[focus - 1];
        const heading = document.createElement("strong");
        heading.textContent = `${selected.label}:`;
        note.replaceChildren(heading, document.createTextNode(` ${selected.note}`));
      } else {
        note.textContent = DEFAULT_NOTE;
      }
    }
  };

  panToPart(figureFocus.get(lessonId) ?? 0);

  figure.querySelectorAll<HTMLButtonElement>("[data-figure-focus]").forEach((button) => {
    button.addEventListener("click", () => {
      applyFocus(Number(button.dataset.figureFocus));
    });
  });

  figure.querySelectorAll<SVGGElement>(".visual-part[data-part]").forEach((part) => {
    part.addEventListener("click", () => {
      const partIndex = Number(part.dataset.part);
      const current = figureFocus.get(lessonId) ?? 0;
      applyFocus(current === partIndex ? 0 : partIndex);
    });
  });
}
