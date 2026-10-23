import type { ExerciseTask, NumberField } from "../model/types";
import { round } from "./format";

/**
 * Every reading of a plain number the way a learner types it: "2,5", "2.5",
 * "1 500", "1.234,5", "-3,2". A comma is always the decimal separator;
 * several points group thousands. A single point followed by exactly three
 * digits is ambiguous ("1.500" is 1,5 or the German thousands 1500), so both
 * readings are returned, the decimal one first.
 */
function plainCandidates(text: string): number[] {
  if (!/^[+-]?[0-9.,]+$/.test(text)) return [];
  const hasComma = text.includes(",");
  const hasPoint = text.includes(".");
  const candidates: string[] = [];
  if (hasComma && hasPoint) {
    // The last separator is the decimal one, the others group thousands.
    const lastComma = text.lastIndexOf(",");
    const lastPoint = text.lastIndexOf(".");
    const decimal = lastComma > lastPoint ? "," : ".";
    const grouping = decimal === "," ? "." : ",";
    candidates.push(text.split(grouping).join("").replace(decimal, "."));
  } else if (hasComma) {
    if (text.indexOf(",") !== text.lastIndexOf(",")) return [];
    candidates.push(text.replace(",", "."));
  } else if (hasPoint) {
    const single = text.indexOf(".") === text.lastIndexOf(".");
    const grouped = /^[+-]?\d{1,3}(\.\d{3})+$/.test(text);
    if (single) candidates.push(text);
    if (grouped) candidates.push(text.split(".").join(""));
    if (candidates.length === 0) return [];
  } else {
    candidates.push(text);
  }
  return candidates.map(Number).filter((value) => Number.isFinite(value));
}

/** A plain number or a multiple of π: "4π", "-π", "2,5π". */
function simpleCandidates(text: string): number[] {
  const at = text.indexOf("π");
  if (at < 0) return plainCandidates(text);
  if (text.indexOf("π", at + 1) >= 0 || at !== text.length - 1) return [];
  const before = text.slice(0, at);
  if (before === "" || before === "+") return [Math.PI];
  if (before === "-") return [-Math.PI];
  return plainCandidates(before).map((value) => value * Math.PI);
}

/**
 * Every reading of what a learner typed into a number field: a decimal
 * number, a fraction ("3/5", "-7/2"), a multiple of π ("12π", "π/2"), or a
 * percentage ("60 %", read as 0,6 unless the field's unit is %). A leading
 * "x =" and a trailing unit are ignored. Empty when there is no number.
 */
export function parseNumberCandidates(raw: string, unit = ""): number[] {
  let text = raw
    .trim()
    .replace(/[−–]/g, "-")
    .replace(/\s+/g, "")
    .replace(/pi/gi, "π")
    .replace(/(\d)[·*]π/g, "$1π");
  if (!text) return [];
  // "x=3" or "c=7,2": keep what follows the last "=".
  if (text.includes("=")) text = text.slice(text.lastIndexOf("=") + 1);
  let percent = false;
  if (text.endsWith("%")) {
    percent = unit !== "%";
    text = text.slice(0, -1);
  }
  // Drop a trailing unit such as "cm²" or "m³", but keep digits, signs, π and "/".
  text = text.replace(/[^0-9.,+\-π/]+$/u, "");
  if (!text) return [];

  let values: number[];
  const slash = text.indexOf("/");
  if (slash >= 0) {
    if (text.indexOf("/", slash + 1) >= 0) return [];
    let top = text.slice(0, slash);
    let bottom = text.slice(slash + 1);
    // "4/3π" is written for 4/3 · π, as in V = 4/3 πr³.
    if (bottom.length > 1 && bottom.endsWith("π") && !top.includes("π")) {
      top = `${top}π`;
      bottom = bottom.slice(0, -1);
    }
    const numerators = simpleCandidates(top);
    const denominators = simpleCandidates(bottom);
    values = numerators.flatMap((n) => denominators.filter((d) => d !== 0).map((d) => n / d));
  } else {
    values = simpleCandidates(text);
  }
  if (percent) values = values.map((value) => value / 100);
  return [...new Set(values.filter((value) => Number.isFinite(value)))];
}

/** The most likely reading of a typed number, or null when there is none. */
export function parseNumber(raw: string, unit = ""): number | null {
  return parseNumberCandidates(raw, unit)[0] ?? null;
}

/**
 * The tolerance a number field accepts. An answer that is exact at its shown
 * decimals (x = 3, P = 0,6) must be typed exactly; any other may be rounded
 * to the shown decimals or be off by the relative tolerance (default 1 %).
 */
export function toleranceOf(field: NumberField): number {
  const scale = Math.abs(field.answer);
  const exact = Math.abs(field.answer - round(field.answer, field.digits)) < 1e-9;
  const relative = field.tolerance !== undefined ? field.tolerance * scale : exact ? 0 : 0.01 * scale;
  const rounding = exact ? 1e-9 * Math.max(1, scale) : 0.51 * 10 ** -field.digits;
  return Math.max(relative, rounding, field.absTolerance ?? 0);
}

export type FieldStatus = "correct" | "wrong" | "invalid";

export interface FieldResult {
  status: FieldStatus;
  /** The number read (closest reading to the answer), or the option chosen. */
  parsed: number | null;
}

export interface TaskResult {
  status: FieldStatus;
  fields: FieldResult[];
}

function checkNumber(field: NumberField, answer: number, raw: string): FieldResult {
  const candidates = parseNumberCandidates(raw, field.unit);
  if (candidates.length === 0) return { status: "invalid", parsed: null };
  const tolerance = toleranceOf({ ...field, answer });
  const hit = candidates.find((value) => Math.abs(value - answer) <= tolerance);
  if (hit !== undefined) return { status: "correct", parsed: hit };
  const parsed = candidates.reduce((best, value) =>
    Math.abs(value - answer) < Math.abs(best - answer) ? value : best,
  );
  return { status: "wrong", parsed };
}

function permutations(items: number[]): number[][] {
  if (items.length <= 1) return [items];
  return items.flatMap((item, index) =>
    permutations([...items.slice(0, index), ...items.slice(index + 1)]).map((rest) => [item, ...rest]),
  );
}

/**
 * Checks every field of a task. `inputs` holds the typed text of each number
 * field and the chosen option index (as text, empty when none) of each choice
 * field. The fields named in `anyOrder` may hold their answers in any order.
 */
export function checkTask(task: ExerciseTask, inputs: string[]): TaskResult {
  const swappable = (task.anyOrder ?? []).filter((index) => task.fields[index]?.kind === "number");
  const orders = swappable.length > 1 ? permutations(swappable) : [swappable];
  let best: FieldResult[] | null = null;
  let bestScore = -1;
  for (const order of orders) {
    const results = task.fields.map((field, index): FieldResult => {
      const raw = inputs[index] ?? "";
      if (field.kind === "choice") {
        if (raw === "") return { status: "invalid", parsed: null };
        const chosen = Number(raw);
        return { status: chosen === field.correctIndex ? "correct" : "wrong", parsed: chosen };
      }
      const at = swappable.indexOf(index);
      const source = task.fields[at >= 0 ? order[at] : index] as NumberField;
      return checkNumber(field, source.answer, raw);
    });
    const score = results.filter((result) => result.status === "correct").length;
    if (score > bestScore) {
      best = results;
      bestScore = score;
    }
  }
  const fields = best ?? [];
  const status: FieldStatus = fields.some((f) => f.status === "invalid")
    ? "invalid"
    : fields.every((f) => f.status === "correct")
      ? "correct"
      : "wrong";
  return { status, fields };
}

/**
 * A field label as plain text for a hint. A vector name drawn with its arrow
 * above (the stages' `vn()`: an aria-hidden arrow span before the name) reads
 * "BC→", not "⟶BC".
 */
const plain = (html: string) =>
  html
    .replace(/<span aria-hidden="true"[^>]*>[⟶→]<\/span>((?:[^<]|<su[bp]>[^<]*<\/su[bp]>)*)/g, "$1→")
    .replace(/<[^>]+>/g, "")
    .replace(/\s*=\s*$/, "")
    .trim();

function near(value: number, target: number, field: NumberField): boolean {
  if (!Number.isFinite(target)) return false;
  const tolerance = Math.max(0.01 * Math.abs(target), 0.51 * 10 ** -field.digits, 1e-9);
  return Math.abs(value - target) <= tolerance;
}

/**
 * A hint for a wrong answer without giving the result away: first the slips
 * the task itself predicts (RAD mode, c² instead of c, the diameter for the
 * radius), then the general ones (sign, swapped fields, π, 100, 2, square).
 */
export function wrongAnswerHint(task: ExerciseTask, result: TaskResult): string {
  if (result.status === "invalid") {
    return "Fülle jedes Feld aus: Zahlen mit Komma oder Brüche wie 3/5.";
  }
  if (result.status !== "wrong") return "";
  const numbers = task.fields
    .map((field, index) => ({ field, index }))
    .filter((entry): entry is { field: NumberField; index: number } => entry.field.kind === "number");
  const wrongNumbers = numbers.filter(({ index }) => result.fields[index].status === "wrong");

  for (const { field, index } of wrongNumbers) {
    const parsed = result.fields[index].parsed ?? Number.NaN;
    for (const slip of field.slips ?? []) {
      if (near(parsed, slip.value, field)) return slip.hint;
    }
  }

  if (!task.anyOrder?.length && numbers.length >= 2) {
    const [first, second] = numbers;
    const a = result.fields[first.index].parsed ?? Number.NaN;
    const b = result.fields[second.index].parsed ?? Number.NaN;
    if (
      result.fields[first.index].status === "wrong" &&
      result.fields[second.index].status === "wrong" &&
      near(a, second.field.answer, second.field) &&
      near(b, first.field.answer, first.field)
    ) {
      return `Die Werte stimmen, stehen aber vertauscht: Was gehört zu ${plain(first.field.label)}, was zu ${plain(second.field.label)}?`;
    }
  }

  const first = wrongNumbers[0];
  if (first) {
    const { field } = first;
    const parsed = result.fields[first.index].parsed ?? Number.NaN;
    const answer = field.answer;
    const name = plain(field.label) || "Der Wert";
    const where = numbers.length > 1 ? ` bei ${name}` : "";
    if (answer !== 0 && near(parsed, -answer, field)) return `Prüfe das Vorzeichen${where}.`;
    if (answer !== 0 && (near(parsed, answer * Math.PI, field) || near(parsed, answer / Math.PI, field))) {
      return `Um den Faktor π daneben${where}: π vergessen oder doppelt genommen?`;
    }
    if (answer !== 0 && (near(parsed, answer * 100, field) || near(parsed, answer / 100, field))) {
      return `Um den Faktor 100 daneben${where}: Prozent oder Dezimalzahl?`;
    }
    if (answer !== 0 && (near(parsed, answer * 2, field) || near(parsed, answer / 2, field))) {
      return `Genau doppelt oder halb so groß wie gesucht${where}: Radius oder Durchmesser? Die Hälfte vergessen?`;
    }
    if (Math.abs(answer) > 1.5 && (near(parsed, answer * answer, field) || (answer > 0 && near(parsed, Math.sqrt(answer), field)))) {
      return `Quadrat statt Wurzel, oder umgekehrt${where}?`;
    }
  }

  const correct = task.fields.filter((_, index) => result.fields[index].status === "correct");
  const wrongChoice = task.fields.find((field, index) => field.kind === "choice" && result.fields[index].status === "wrong");
  if (correct.length > 0) {
    const names = correct.map((field) => plain(field.label)).filter(Boolean);
    const missing = task.fields
      .filter((_, index) => result.fields[index].status !== "correct")
      .map((field) => plain(field.label))
      .filter(Boolean);
    if (names.length > 0 && missing.length > 0) {
      return `Teilweise richtig: ${names.join(", ")} stimmt schon, ${missing.join(", ")} noch nicht.`;
    }
  }
  if (wrongChoice) return `Die Auswahl bei „${plain(wrongChoice.label)}“ stimmt noch nicht.`;
  return "Nicht ganz. Geh den Rechenweg Schritt für Schritt durch, der Tipp hilft dabei.";
}
