import { esc } from "../exercises/format";

/**
 * Lesson texts are plain strings and use a short math notation:
 * `^{…}` or `^x` for a superscript, `_{…}` or `_0` for a subscript.
 * These helpers turn that notation into what the learner should see, so no
 * caret or underscore ever reaches the page.
 */

/** A hyphen before a digit at the start of a number is the minus sign "−". */
const HYPHEN_MINUS = /(^|[\s([{|=:;,/])-(?=\d)/g;

/** Sets the notation in an HTML string (it must not contain attributes with ^ or _). */
export function mathMarkup(html: string): string {
  return html
    .replace(/\^\{([^{}]*)\}/g, "<sup>$1</sup>")
    .replace(/\^([A-Za-z0-9−]+)/g, "<sup>$1</sup>")
    .replace(/_\{([^{}]*)\}/g, "<sub>$1</sub>")
    .replace(/_([A-Za-z0-9]+)/g, "<sub>$1</sub>");
}

/** Escapes a plain lesson text and sets its superscripts and subscripts. */
export function richText(text: string): string {
  return mathMarkup(esc(text.replace(HYPHEN_MINUS, "$1−")));
}

/** For places that show plain text only (toasts): drops the markers. */
export function plainMath(text: string): string {
  return text
    .replace(HYPHEN_MINUS, "$1−")
    .replace(/[\^_]\{([^{}]*)\}/g, "$1")
    .replace(/[\^_]([A-Za-z0-9−]+)/g, "$1");
}
