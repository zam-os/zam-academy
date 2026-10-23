import { esc, shuffle } from "./format";
import type { ChooseItem, CommaItem, MarkWorkshop } from "./model/types";
import type { Marking } from "./workshop";

/**
 * HTML and readers for the three answer forms of the Werkstatt and the
 * practice rounds. `prefix` keeps the two apart on one page: "w" for the
 * Werkstatt, "p" for the practice round.
 */

/** A sentence whose gaps between the words are buttons; a pressed gap is a comma. */
export function commaItemHtml(item: CommaItem, prefix: string, index: number, locked = false): string {
  const last = item.words.length - 1;
  const words = item.words
    .map(
      (word, j) =>
        `<span class="w">${esc(word)}</span>${
          j < last
            ? `<button type="button" class="gap" data-gap="${prefix}:${index}:${j}" aria-pressed="false" aria-label="Komma nach „${esc(word)}“" ${locked ? "disabled" : ""}><span aria-hidden="true">,</span></button>`
            : ""
        }`,
    )
    .join(" ");
  return `<div class="comma-item"><p class="comma-sentence"><span class="item-no">${index + 1}</span> ${words}</p><p class="small item-feedback" id="${prefix}-feedback-${index}"></p></div>`;
}

export function readCommas(prefix: string, index: number): number[] {
  return [...document.querySelectorAll<HTMLElement>(`[data-gap^="${prefix}:${index}:"]`)]
    .filter((gap) => gap.getAttribute("aria-pressed") === "true")
    .map((gap) => Number((gap.dataset.gap ?? "").split(":")[2]));
}

/** Shows the commas of a sentence on its gaps, for the solution. */
export function setCommas(prefix: string, index: number, commas: number[]) {
  document.querySelectorAll<HTMLElement>(`[data-gap^="${prefix}:${index}:"]`).forEach((gap) => {
    const on = commas.includes(Number((gap.dataset.gap ?? "").split(":")[2]));
    gap.setAttribute("aria-pressed", String(on));
    gap.classList.toggle("on", on);
  });
}

/** Gaps toggle by click; one listener on the container serves all of its gaps. */
export function bindGaps(root: Element) {
  root.addEventListener("click", (event) => {
    const gap = (event.target as Element).closest<HTMLElement>(".gap");
    if (!gap || (gap as HTMLButtonElement).disabled) return;
    const on = gap.getAttribute("aria-pressed") !== "true";
    gap.setAttribute("aria-pressed", String(on));
    gap.classList.toggle("on", on);
  });
}

/** Longer options than this do not fit into a drop-down inside a sentence on a phone; they become a list of radio buttons. */
export const LONG_OPTION = 30;

/**
 * A sentence with a gap; the options appear in a fixed shuffled order, the value is the index in the data.
 * Short options sit in a drop-down inside the sentence, long ones in a radio list below it.
 */
export function chooseItemHtml(item: ChooseItem, prefix: string, index: number, key: string, locked = false): string {
  const order = shuffle(
    item.options.map((_, i) => i),
    `${key}:choose:${index}`,
  );
  const name = `${prefix}-choose-${index}`;
  const feedback = `<p class="small item-feedback" id="${prefix}-feedback-${index}"></p>`;
  if (item.options.some((option) => option.length > LONG_OPTION))
    return `<div class="choose-item choose-long"><fieldset ${locked ? "disabled" : ""}><legend><span class="item-no">${index + 1}</span> ${esc(item.before)}<span class="gap-mark" aria-label="Lücke">…</span>${esc(item.after)}</legend>${order.map((i) => `<label class="option"><input type="radio" name="${name}" value="${i}"> <span>${esc(item.options[i])}</span></label>`).join("")}</fieldset>${feedback}</div>`;
  return `<div class="choose-item"><p><span class="item-no">${index + 1}</span> ${esc(item.before)}<select name="${name}" aria-label="Lücke in Satz ${index + 1}" ${locked ? "disabled" : ""}><option value="">…</option>${order.map((i) => `<option value="${i}">${esc(item.options[i])}</option>`).join("")}</select>${esc(item.after)}</p>${feedback}</div>`;
}

/** The index in the data of the option chosen in a sentence, or -1 when none is chosen. */
export function readChoose(prefix: string, index: number): number {
  const name = `${prefix}-choose-${index}`;
  const radio = document.querySelector<HTMLInputElement>(`input[type="radio"][name="${name}"]:checked`);
  const value = radio?.value ?? document.querySelector<HTMLSelectElement>(`select[name="${name}"]`)?.value ?? "";
  return value === "" ? -1 : Number(value);
}

export function setChoose(prefix: string, index: number, answer: number) {
  const name = `${prefix}-choose-${index}`;
  const select = document.querySelector<HTMLSelectElement>(`select[name="${name}"]`);
  if (select) select.value = String(answer);
  document.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${name}"]`).forEach((radio) => {
    radio.checked = Number(radio.value) === answer;
  });
}

/** The palette and the text of a Markieren-Werkstatt; `marking` holds what the learner has marked so far. */
export function markHtml(w: MarkWorkshop, marking: Marking, active: number): string {
  const palette = `<fieldset class="mark-palette"><legend>Markiere als:</legend>${w.labels
    .map(
      (label, i) =>
        `<label class="mark-label mk-${i}"><input type="radio" name="mark-label" value="${i}" ${i === active ? "checked" : ""}><span class="mark-dot" aria-hidden="true">${i + 1}</span> ${esc(label)}</label>`,
    )
    .join("")}</fieldset>`;
  const text = w.text
    .map((segment, i) => {
      const lead = segment.t.match(/^\s*/)?.[0] ?? "";
      const trail = segment.t.slice(lead.length).match(/\s*$/)?.[0] ?? "";
      const core = segment.t.slice(lead.length, segment.t.length - trail.length);
      // Spaces and bare punctuation are not worth a click; they stay plain text.
      if (!/[\p{L}\p{N}]/u.test(core)) return esc(segment.t);
      const label = marking[i];
      const marked = label !== undefined;
      return `${esc(lead)}<button type="button" class="seg ${marked ? `mk-${label}` : ""}" data-seg="${i}" aria-pressed="${marked}" ${marked ? `aria-label="${esc(core)}, markiert als ${esc(w.labels[label])}"` : ""}>${esc(core)}${marked ? `<sup class="seg-no" aria-hidden="true">${(label ?? 0) + 1}</sup>` : ""}</button>${esc(trail)}`;
    })
    .join("");
  return `${palette}<p class="mark-text" id="mark-text">${text}</p><div class="actions"><button type="button" id="check-marks">Markierung prüfen</button><button type="button" id="clear-marks" class="quiet">Alles zurücksetzen</button></div>`;
}
