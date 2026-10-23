import { describe, expect, it } from "vitest";
import { CATEGORY_OPTIONS, STAGE_DATEN_ZUFALL } from "../src/curriculum/stage-7-daten-zufall";
import { createRng, seedFrom } from "../src/exercises/rng";
import { applyAction, computeReadouts, defaultLabValues, withChanges } from "../src/lab/engine";
import { outcomeRecord, outcomeSeries, stageBranches, treePaths } from "../src/lab/views-daten-zufall";
import type { ChoiceField, DifficultyLevel, ExerciseTask, LabDefinition, LabValues, Lesson } from "../src/model/types";

const IDS = ["dz-1-ergebnis-ereignis", "dz-2-baumdiagramm", "dz-3-vierfeldertafel", "dz-4-haeufigkeiten"];
const SEEDS = Array.from({ length: 200 }, (_, i) => seedFrom(`stage-7:${i}`));

const lessons = STAGE_DATEN_ZUFALL.lessons;
const lesson = (id: string): Lesson => {
  const found = lessons.find((l) => l.id === id);
  if (!found) throw new Error(id);
  return found;
};

function tasks(lessonId: string, generatorId: string, level: DifficultyLevel): ExerciseTask[] {
  const generator = lesson(lessonId).exercises.find((e) => e.id === generatorId);
  if (!generator) throw new Error(`${lessonId}/${generatorId}`);
  return SEEDS.map((seed) => generator.make(createRng(seed), level));
}

function num(task: ExerciseTask, index: number): number {
  const field = task.fields[index];
  if (field?.kind !== "number") throw new Error(`field ${index} of ${task.prompt} is no number`);
  return field.answer;
}

function choice(task: ExerciseTask, index: number): ChoiceField {
  const field = task.fields[index];
  if (field?.kind !== "choice") throw new Error(`field ${index} of ${task.prompt} is no choice`);
  return field;
}

/** The text of the right option of a choice field. */
const picked = (task: ExerciseTask, index: number) => choice(task, index).options[choice(task, index).correctIndex];
const meta = (task: ExerciseTask) => task.meta ?? {};
const plain = (html: string) => html.replace(/<[^>]+>/g, " ");
const upTo = (n: number) => Array.from({ length: n }, (_, i) => i + 1);
const setOf = (items: Array<string | number>) => (items.length === 0 ? "{ }" : `{${items.join("; ")}}`);

const at = (lab: LabDefinition, values: Partial<LabValues>) => {
  const v = { ...defaultLabValues(lab), ...values } as LabValues;
  return { v, r: computeReadouts(lab, v) };
};

function allTexts(task: ExerciseTask): string {
  return [
    task.prompt,
    ...task.given,
    task.formulaHint ?? "",
    ...task.steps,
    ...task.fields.flatMap((f) => (f.kind === "number" ? [f.label, ...(f.slips ?? []).map((s) => s.hint)] : [f.label, ...f.options])),
  ]
    .map(plain)
    .join(" \n ");
}

// ─── Independent readings of the statements in the prompts ─────────────────

function isPrimeNumber(n: number): boolean {
  if (n < 2) return false;
  for (let d = 2; d < n; d++) if (n % d === 0) return false;
  return true;
}

/** The results 1 … size for which the quoted statement holds, read from its words. */
function statementResults(words: string, size: number): number[] {
  const all = upTo(size);
  let m: RegExpExecArray | null;
  if ((m = /^(?:Augenzahl|Zahl) mindestens (\d+)$/.exec(words))) return all.filter((e) => e >= Number(m![1]));
  if ((m = /^(?:Augenzahl|Zahl) größer als (\d+)$/.exec(words))) return all.filter((e) => e > Number(m![1]));
  if ((m = /^(?:Augenzahl|Zahl) höchstens (\d+)$/.exec(words))) return all.filter((e) => e <= Number(m![1]));
  if ((m = /^(?:Augenzahl|Zahl) kleiner als (\d+)$/.exec(words))) return all.filter((e) => e < Number(m![1]));
  if ((m = /^(?:Augenzahl|Zahl) durch (\d+) teilbar$/.exec(words))) return all.filter((e) => e % Number(m![1]) === 0);
  if ((m = /^(?:Augenzahl|Zahl) (\d+)$/.exec(words))) return all.filter((e) => e === Number(m![1]));
  if (/^gerade (Augenzahl|Zahl)$/.test(words)) return all.filter((e) => e % 2 === 0);
  if (/^ungerade (Augenzahl|Zahl)$/.test(words)) return all.filter((e) => e % 2 === 1);
  if (/ist eine Primzahl$/.test(words)) return all.filter(isPrimeNumber);
  if (/ist eine Quadratzahl$/.test(words)) return all.filter((e) => [1, 4, 9, 16].includes(e));
  throw new Error(`unknown statement ${words}`);
}

/** The quoted Ereignis E: „…“ of a prompt. */
function quoted(prompt: string): string {
  const m = /E: „([^“]+)“/.exec(prompt);
  if (!m) throw new Error(`no quoted Ereignis in ${prompt}`);
  return m[1];
}

/** The number of results 1 … n in the experiment of a prompt. */
function sizeOf(prompt: string): number {
  if (prompt.startsWith("Ein Würfel")) return 6;
  const m = /(?:Zahlen|beschriftet mit) 1 bis (\d+)/.exec(prompt);
  if (!m) throw new Error(`no size in ${prompt}`);
  return Number(m[1]);
}

const PAIRS = upTo(6).flatMap((a) => upTo(6).map((b) => [a, b]));
const pairEvent = (words: string): ((a: number, b: number) => boolean) => {
  let m: RegExpExecArray | null;
  if ((m = /^Augensumme (\d+)$/.exec(words))) return (a, b) => a + b === Number(m![1]);
  if (words.startsWith("Pasch")) return (a, b) => a === b;
  if (words === "mindestens eine Sechs") return (a, b) => a === 6 || b === 6;
  if (words === "beide Augenzahlen gerade") return (a, b) => a % 2 === 0 && b % 2 === 0;
  if (words === "die erste Augenzahl ist größer als die zweite") return (a, b) => a > b;
  if (words === "Augensumme höchstens 4") return (a, b) => a + b <= 4;
  throw new Error(words);
};
const sumEvent = (words: string): ((sum: number) => boolean) => {
  let m: RegExpExecArray | null;
  if ((m = /^Augensumme mindestens (\d+)$/.exec(words))) return (s) => s >= Number(m![1]);
  if ((m = /^Augensumme kleiner als (\d+)$/.exec(words))) return (s) => s < Number(m![1]);
  if (words === "gerade Augensumme") return (s) => s % 2 === 0;
  if (words === "Augensumme ist eine Primzahl") return isPrimeNumber;
  throw new Error(words);
};
/** Cards as [suit, value]: suits Kreuz, Pik, Herz, Karo; values 7, 8, 9, 10, Bube, Dame, König, Ass. */
const CARDS = [0, 1, 2, 3].flatMap((suit) => [0, 1, 2, 3, 4, 5, 6, 7].map((value) => [suit, value]));
const SKAT: Record<string, (suit: number, value: number) => boolean> = {
  "eine Herzkarte": (s) => s === 2,
  "ein Ass": (_, v) => v === 7,
  "eine rote Karte": (s) => s === 2 || s === 3,
  "ein Bild (Bube, Dame oder König)": (_, v) => v === 4 || v === 5 || v === 6,
  "eine Herzkarte oder eine Dame": (s, v) => s === 2 || v === 5,
  "eine schwarze Karte oder ein Ass": (s, v) => s <= 1 || v === 7,
  "eine Zahlenkarte (7, 8, 9 oder 10)": (_, v) => v <= 3,
  "ein roter König": (s, v) => s >= 2 && v === 6,
  "keine Herzkarte": (s) => s !== 2,
  "eine Pikkarte mit einer Zahl (7 bis 10)": (s, v) => s === 1 && v <= 3,
};

/** Every ordered sequence of `depth` symbols; with counts, an urn that loses each ball drawn. */
function sequences(symbols: string[], counts: number[] | null, depth: number): string[] {
  if (depth === 0) return [""];
  const out: string[] = [];
  symbols.forEach((sym, i) => {
    if (counts && counts[i] === 0) return;
    const rest = counts ? counts.map((c, j) => (j === i ? c - 1 : c)) : null;
    for (const tail of sequences(symbols, rest, depth - 1)) out.push(sym + tail);
  });
  return out;
}
const countIn = (p: string, c: string) => [...p].filter((x) => x === c).length;
const PATH_EVENTS: Record<string, (p: string) => boolean> = {
  "genau einmal Kopf": (p) => countIn(p, "K") === 1,
  "mindestens einmal Kopf": (p) => countIn(p, "K") >= 1,
  "genau zweimal Kopf": (p) => countIn(p, "K") === 2,
  "mindestens zweimal Kopf": (p) => countIn(p, "K") >= 2,
  "höchstens einmal Kopf": (p) => countIn(p, "K") <= 1,
  "jedes Mal dieselbe Seite": (p) => new Set(p).size === 1,
  "der erste und der letzte Wurf zeigen dieselbe Seite": (p) => p[0] === p[p.length - 1],
  "genau eine rote Kugel": (p) => countIn(p, "r") === 1,
  "mindestens eine rote Kugel": (p) => countIn(p, "r") >= 1,
  "keine rote Kugel": (p) => countIn(p, "r") === 0,
  "höchstens eine rote Kugel": (p) => countIn(p, "r") <= 1,
  "jedes Mal dieselbe Farbe": (p) => new Set(p).size === 1,
  "lauter gleichfarbige Kugeln": (p) => new Set(p).size === 1,
  "die letzte Kugel ist blau": (p) => p[p.length - 1] === "b",
  "die erste Kugel ist blau": (p) => p[0] === "b",
  "mindestens zwei verschiedene Farben": (p) => new Set(p).size >= 2,
};

// ─── The stage ─────────────────────────────────────────────────────────────

describe("Etappe 7: Daten und Zufall", () => {
  it("has its lessons in order, for both Zweige, with the Lernbereiche of the curriculum", () => {
    expect(STAGE_DATEN_ZUFALL.id).toBe("stage-7-daten-zufall");
    expect(STAGE_DATEN_ZUFALL.stageNumber).toBe(7);
    expect(STAGE_DATEN_ZUFALL.accent).toBe("#dc2626");
    expect(lessons.map((l) => l.id)).toEqual(IDS.slice(0, lessons.length));
    expect(lessons.map((l) => l.lab.kind)).toEqual(["outcome-event", "tree-diagram", "two-way-table", "frequency-simulation"].slice(0, lessons.length));
    lessons.forEach((l, index) => {
      expect(l.stageId).toBe("stage-7-daten-zufall");
      expect(l.stepNumber).toBe(index + 1);
      expect(l.title.startsWith(`7.${index + 1} `), l.title).toBe(true);
      expect(l.tracks).toEqual(["I", "II_III"]);
      expect(l.lehrplan.startsWith("M8 LB 7 (I) · M8 LB 6 (II/III): "), l.lehrplan).toBe(true);
      expect(l.lab.goals).toHaveLength(3);
      expect(l.exercises.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("stays in grade 8: no probability as a number, no Ergebnisraum, no Laplace (all M9 and later)", () => {
    for (const l of lessons) {
      const texts = [l.whyItMatters, l.explanationHtml, l.quiz.question, ...l.quiz.options, l.quiz.explanation, l.lab.intro, ...l.lab.goals.map((g) => g.text), ...l.formulas.map((f) => `${f.name} ${f.html} ${f.quantities}`)];
      for (const g of l.exercises) for (const level of [1, 2] as const) for (const task of tasks(l.id, g.id, level).slice(0, 60)) texts.push(allTexts(task));
      const text = plain(texts.join(" \n "));
      expect(text, l.id).not.toMatch(/Ω|Laplace|Ergebnisraum|Gegenereignis|Pfadregel|P\(|Teilmenge/);
      // "Wahrscheinlichkeit" only in a marked outlook on grade 9
      for (const sentence of text.split(/(?<=[.!?])\s+/)) {
        if (/Wahrscheinlichkeit/.test(sentence)) expect(sentence, l.id).toMatch(/Klasse 9/);
      }
    }
  });

  it("writes its tasks without programmer notation, hyphens as minus or decimal points", () => {
    for (const l of lessons) {
      for (const g of l.exercises) {
        for (const level of [1, 2] as const) {
          for (const task of tasks(l.id, g.id, level)) {
            const text = allTexts(task);
            expect(text, `${l.id}/${g.id}: y_P or a backslash`).not.toMatch(/[a-z]_[A-Za-z]|\\/);
            expect(text, `${l.id}/${g.id}: hyphen as minus`).not.toMatch(/(^|[\s(=:|,{±;[\]])-\d/);
            expect(text, `${l.id}/${g.id}: decimal point`).not.toMatch(/\d\.(\d{1,2}|\d{4,})(?!\d)/);
            expect(text, `${l.id}/${g.id}: "1 Punkte", "1 Ergebnissen"`).not.toMatch(/(^|[^\d,])1 (Punkte|Ergebnissen|Pfaden)\b/);
          }
        }
      }
    }
  });
});

// ─── 7.1 Ergebnis und Ereignis ─────────────────────────────────────────────

describe("7.1 Ergebnis und Ereignis: the lab", () => {
  const lab = lesson("dz-1-ergebnis-ereignis").lab;

  it("reads the Ereignis and its results at known settings", () => {
    expect(at(lab, {}).r.ereignis).toBe("„Augenzahl mindestens 5“ = {5; 6}");
    expect(at(lab, { art: 1, k: 5 }).r.ereignis).toBe("„Augenzahl größer als 5“ = {6}");
    expect(at(lab, { art: 7 }).r.ereignis).toBe("„Augenzahl ist eine Primzahl“ = {2; 3; 5}");
    expect(at(lab, { exp: 1, art: 7 }).r.ereignis).toBe("„Zahl ist eine Primzahl“ = {2; 3; 5; 7}");
    expect(at(lab, { art: 0, k: 7 }).r.art).toBe("unmögliches Ereignis, kein Ergebnis");
    expect(at(lab, { exp: 1, art: 4, k: 1 }).r.art).toBe("sicheres Ereignis, alle 8 Ergebnisse");
    expect(at(lab, { exp: 1, art: 4, k: 3 }).r.ereignis).toBe("„Zahl durch 3 teilbar“ = {3; 6}");
  });

  it("tallies the replayed results, keeps the tally when only the Ereignis changes, and starts anew on request", () => {
    let v = defaultLabValues(lab);
    for (let i = 0; i < 4; i++) v = applyAction(lab, v, "zehn");
    v = applyAction(lab, v, "eins");
    const record = outcomeRecord(v);
    expect(record.n).toBe(41);
    expect(record.tally.reduce((a, b) => a + b, 0)).toBe(41);
    expect(record.series).toEqual(outcomeSeries(v.s0, 41, 6));
    expect(record.series.every((e) => e >= 1 && e <= 6)).toBe(true);
    expect(record.hits).toBe(record.tally[5] + record.tally[6]);
    // another Ereignis: same tally, other count
    const other = withChanges(lab, v, { art: 5 });
    expect(outcomeRecord(other).tally).toEqual(record.tally);
    expect(outcomeRecord(other).hits).toBe(record.tally[2] + record.tally[4] + record.tally[6]);
    // the wheel keeps its own tally
    const wheel = withChanges(lab, v, { exp: 1 });
    expect(outcomeRecord(wheel).n).toBe(0);
    expect(outcomeRecord(withChanges(lab, applyAction(lab, wheel, "zehn"), { exp: 0 })).n).toBe(41);
    // a new tally: no trials, another sequence
    const fresh = applyAction(lab, v, "neu");
    expect(outcomeRecord(fresh).n).toBe(0);
    expect(fresh.s0).not.toBe(v.s0);
    expect(outcomeSeries(fresh.s0, 41, 6)).not.toEqual(record.series);
  });

  it("shows results that occur about equally often over many trials (a fair replay)", () => {
    const series = outcomeSeries(71001, 6000, 6);
    for (const e of upTo(6)) {
      const share = series.filter((x) => x === e).length / 6000;
      expect(share).toBeGreaterThan(0.14);
      expect(share).toBeLessThan(0.195);
    }
  });
});

describe("7.1 Ergebnis und Ereignis: the tasks compute right", () => {
  it("Level 1: the results of a statement, the right set among tempting ones", () => {
    const kinds = new Set<number>();
    for (const task of tasks("dz-1-ergebnis-ereignis", "ergebnisse", 1)) {
      const size = sizeOf(task.prompt);
      expect(size).toBe(meta(task).size);
      const E = statementResults(quoted(task.prompt), size);
      expect(E.length, task.prompt).toBeGreaterThan(0);
      expect(E.length, task.prompt).toBeLessThan(size);
      expect(picked(task, 0), task.prompt).toBe(setOf(E));
      expect(new Set(choice(task, 0).options).size).toBe(3);
      expect(num(task, 1), task.prompt).toBe(E.length);
      kinds.add(meta(task).kind);
    }
    expect(kinds.size).toBeGreaterThanOrEqual(8);
  });

  it("Level 2: two dice as pair or sum, a Skat deck: all results and those of E", () => {
    const contexts = [0, 0, 0];
    for (const task of tasks("dz-1-ergebnis-ereignis", "ergebnisse", 2)) {
      const words = quoted(task.prompt);
      const m = meta(task);
      contexts[m.context] += 1;
      if (m.context === 0) {
        expect(num(task, 0)).toBe(36);
        expect(num(task, 1), words).toBe(PAIRS.filter(([a, b]) => pairEvent(words)(a, b)).length);
      } else if (m.context === 1) {
        expect(num(task, 0)).toBe(11);
        expect(num(task, 1), words).toBe(upTo(11).map((i) => i + 1).filter(sumEvent(words)).length);
      } else {
        expect(num(task, 0)).toBe(32);
        expect(num(task, 1), words).toBe(CARDS.filter(([s, v]) => SKAT[words](s, v)).length);
      }
    }
    for (const c of contexts) expect(c).toBeGreaterThan(40);
  });

  it("Level 1: how often E occurred in ten results, and whether at a given trial", () => {
    let yes = 0;
    for (const task of tasks("dz-1-ergebnis-ereignis", "eintreten", 1)) {
      const m = meta(task);
      const results = upTo(10).map((i) => m[`r${i - 1}`]);
      expect(task.given[0]).toBe(`Ergebnisse: ${results.join(", ")}`);
      const E = statementResults(quoted(task.prompt), sizeOf(task.prompt));
      const hits = results.filter((r) => E.includes(r)).length;
      expect(num(task, 0), task.prompt).toBe(hits);
      expect(hits).toBeGreaterThan(0);
      expect(hits).toBeLessThan(10);
      const occurred = E.includes(results[m.j - 1]);
      expect(choice(task, 1).correctIndex, task.prompt).toBe(occurred ? 0 : 1);
      if (occurred) yes += 1;
    }
    expect(yes).toBeGreaterThan(70);
    expect(yes).toBeLessThan(130);
  });

  it("Level 2: two players' points from ten throws of two dice", () => {
    const rules: Array<(a: number, b: number) => boolean> = [
      (a, b) => a === b,
      (a, b) => a + b >= 9,
      (a, b) => a === 6 || b === 6,
      (a, b) => a + b === 7,
      (a, b) => a % 2 === 1 && b % 2 === 1,
      (a, b) => a + b <= 5,
    ];
    const winners = [0, 0, 0];
    for (const task of tasks("dz-1-ergebnis-ereignis", "eintreten", 2)) {
      const m = meta(task);
      const throws = upTo(10).map((i) => [m[`a${i - 1}`], m[`b${i - 1}`]]);
      const w1 = throws.filter(([a, b]) => rules[m.i1](a, b)).length;
      const w2 = throws.filter(([a, b]) => rules[m.i2](a, b)).length;
      expect(num(task, 0)).toBe(w1);
      expect(num(task, 1)).toBe(w2);
      expect(w1 * w2).toBeGreaterThan(0);
      expect(choice(task, 2).correctIndex).toBe(w1 > w2 ? 0 : w2 > w1 ? 1 : 2);
      winners[choice(task, 2).correctIndex] += 1;
    }
    expect(winners[0]).toBeGreaterThan(40);
    expect(winners[1]).toBeGreaterThan(40);
  });

  it("Level 1: sicheres, unmögliches Ereignis, one or several results", () => {
    const categories = [0, 0, 0, 0];
    for (const task of tasks("dz-1-ergebnis-ereignis", "begriff", 1)) {
      const size = sizeOf(task.prompt);
      const E = statementResults(quoted(task.prompt), size);
      const category = E.length === size ? 0 : E.length === 0 ? 1 : E.length === 1 ? 2 : 3;
      expect(choice(task, 0).options).toEqual(CATEGORY_OPTIONS);
      expect(choice(task, 0).correctIndex, task.prompt).toBe(category);
      expect(num(task, 1)).toBe(E.length);
      categories[category] += 1;
    }
    for (const c of categories) expect(c).toBeGreaterThan(25);
  });

  it("Level 2: what counts as a result depends on what is noted", () => {
    for (const task of tasks("dz-1-ergebnis-ereignis", "begriff", 2)) {
      const m = meta(task);
      const expected: Record<number, [number, number]> = { 0: [3, 4], 1: [4, 8], 2: [11, 36], 3: [3, 8], 4: [2, 6] };
      expect([num(task, 0), num(task, 1)]).toEqual(expected[m.kind]);
      const part = /Ergebnis „([^“]+)“/.exec(task.prompt)![1];
      let partCount: number;
      if (m.kind === 0 || m.kind === 1) partCount = sequences(["K", "Z"], null, m.kind === 0 ? 2 : 3).filter((p) => countIn(p, "K") === (part.startsWith("einmal") ? 1 : 2)).length;
      else if (m.kind === 2) partCount = PAIRS.filter(([a, b]) => a + b === Number(/Augensumme (\d+)/.exec(part)![1])).length;
      else if (m.kind === 3) {
        const colour = { Rot: "rot", Blau: "blau", Grün: "grün" }[part]!;
        const fields = new RegExp(`(?:Felder |, |und )([\\d, und]+?) (?:sind )?${colour}`).exec(task.prompt)![1];
        partCount = fields.split(/, | und /).length;
      } else partCount = 5;
      expect(num(task, 2), task.prompt).toBe(partCount);
    }
  });
});

// ─── 7.2 Baumdiagramme ─────────────────────────────────────────────────────

describe("7.2 Baumdiagramme: the lab", () => {
  const lab = lesson("dz-2-baumdiagramm").lab;
  const setup = (v: Partial<LabValues>) => ({ exp: 0, stages: 2, red: 2, blue: 2, green: 0, ...v });

  it("counts the paths of known trees, with and without replacement", () => {
    expect(treePaths(setup({ stages: 3 })).length).toBe(8);
    expect(treePaths(setup({ exp: 1, red: 1, blue: 1, green: 1, stages: 2 })).length).toBe(9);
    expect(treePaths(setup({ exp: 2, red: 1, blue: 1, green: 1, stages: 2 })).length).toBe(6);
    expect(treePaths(setup({ exp: 2, red: 1, blue: 1, green: 1, stages: 3 })).length).toBe(6);
    expect(treePaths(setup({ exp: 2, red: 2, blue: 1, green: 0, stages: 2 })).map((p) => p.join(""))).toEqual(["rr", "rb", "br"]);
    expect(treePaths(setup({ exp: 2, red: 2, blue: 1, green: 1, stages: 3 })).length).toBe(12);
    expect(treePaths(setup({ exp: 2, red: 2, blue: 2, green: 0, stages: 3 })).length).toBe(6);
    // an urn of two balls is empty after two draws
    expect(treePaths(setup({ exp: 2, red: 1, blue: 1, green: 0, stages: 3 })).map((p) => p.join(""))).toEqual(["rb", "br"]);
    // the same every time against fewer branches once a colour is used up
    expect(stageBranches(treePaths(setup({ exp: 2, red: 1, blue: 1, green: 1, stages: 3 })), 3)).toEqual([3, 2, 1]);
    expect(stageBranches(treePaths(setup({ exp: 2, red: 2, blue: 1, green: 0, stages: 2 })), 2)).toBeNull();
    // independent count: every lab setting against an urn drawn ball by ball
    for (const exp of [1, 2])
      for (const stages of [1, 2, 3])
        for (const red of [1, 2, 3])
          for (const blue of [1, 2, 3])
            for (const green of [0, 1, 2]) {
              const symbols = ["r", "b", "g"].filter((_, i) => [red, blue, green][i] > 0);
              const counts = [red, blue, green].filter((c) => c > 0);
              const depth = exp === 2 ? Math.min(stages, red + blue + green) : stages;
              expect(treePaths({ exp, stages, red, blue, green }).map((p) => p.join(""))).toEqual(sequences(symbols, exp === 2 ? counts : null, depth));
            }
  });

  it("reads the Ereignis and the comparison at known settings", () => {
    expect(at(lab, {}).r.ereignis).toBe("„genau einmal Kopf“: 2 von 4 Pfaden");
    expect(at(lab, {}).r.liste).toBe("{KZ; ZK}");
    expect(at(lab, { stufen: 3, ereignis: 1 }).r.ereignis).toBe("„mindestens einmal Kopf“: 7 von 8 Pfaden");
    expect(at(lab, { stufen: 3 }).r.anzahl).toBe("2 · 2 · 2 = 8");
    expect(at(lab, { exp: 2, rot: 2, blau: 1, gruen: 0 }).r.vergleich).toBe("mit Zurücklegen: 4 Pfade");
    expect(at(lab, { exp: 1, rot: 1, blau: 1, gruen: 1, stufen: 3 }).r.vergleich).toBe("ohne Zurücklegen: 6 Pfade");
    expect(at(lab, { exp: 2, rot: 2, blau: 1, gruen: 0, ereignis: 0 }).r.ereignis).toBe("„genau eine rote Kugel“: 2 von 3 Pfaden");
  });
});

describe("7.2 Baumdiagramme: the tasks compute right", () => {
  it("Level 1: branches per stage and the Zählprinzip", () => {
    for (const task of tasks("dz-2-baumdiagramm", "anzahl", 1)) {
      const m = meta(task);
      const fields = task.fields.length;
      const total = num(task, fields - 1);
      if (m.context <= 1) {
        expect(num(task, 0)).toBe(m.context === 0 ? 2 : m.m);
        expect(total).toBe(num(task, 0) ** m.s);
        expect(task.prompt).toMatch(m.context === 0 ? /Münze/ : new RegExp(`${m.m} gleich große Felder`));
      } else {
        const branches = upTo(m.s).map((k) => num(task, k - 1));
        expect(total).toBe(branches.reduce((a, b) => a * b, 1));
        if (m.context === 2) branches.forEach((b, k) => expect(b).toBe(branches[0] - k));
        if (m.context === 3) branches.forEach((b) => expect(b).toBe(branches[0]));
        if (m.context === 2 || m.context === 3) expect(task.prompt).toContain(`${branches[0]} Kugeln in verschiedenen Farben`);
        if (m.context === 4) expect(branches.map((b) => (b === 6 ? "W" : "M")).join("")).toBe(task.prompt.includes("danach eine Münze") ? "WM" : task.prompt.includes("zum Schluss") ? "MWM" : "MW");
      }
    }
  });

  it("Level 2: codes, lots, menus, relay orders and pairs of dice", () => {
    const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
    for (const task of tasks("dz-2-baumdiagramm", "anzahl", 2)) {
      const m = meta(task);
      const [first, second] = [num(task, 0), num(task, 1)];
      if (m.context === 0) {
        expect(first).toBe(10 ** m.k);
        expect(second).toBe(fact(10) / fact(10 - m.k));
      } else if (m.context === 1) {
        expect(first).toBe(m.n * (m.n - 1) * (m.n - 2));
        expect(second).toBe(m.n ** 3);
      } else if (m.context === 2) {
        expect(first).toBe(m.a * m.b * m.c);
        expect(second).toBe(m.a * m.b);
      } else if (m.context === 3) {
        expect(first).toBe(fact(m.n));
        expect(second).toBe(fact(m.n - 1));
      } else {
        expect(first).toBe(36);
        expect(second).toBe(PAIRS.filter(([a, b]) => a !== b).length);
      }
    }
  });

  it("Level 1: the paths of an Ereignis, the right set among tempting ones", () => {
    let urn = 0;
    for (const task of tasks("dz-2-baumdiagramm", "pfade", 1)) {
      const m = meta(task);
      const paths = sequences(m.urn ? ["r", "b"] : ["K", "Z"], null, m.s);
      expect(task.given[0]).toBe(`alle Pfade: ${setOf(paths)}`);
      const E = paths.filter(PATH_EVENTS[quoted(task.prompt)]);
      expect(E.length).toBeGreaterThan(0);
      expect(picked(task, 0), task.prompt).toBe(setOf(E));
      expect(new Set(choice(task, 0).options).size).toBe(3);
      expect(num(task, 1)).toBe(E.length);
      urn += m.urn;
    }
    expect(urn).toBeGreaterThan(50);
    expect(urn).toBeLessThan(120);
  });

  it("Level 2: without replacement, the paths that remain, those of E and one that is impossible", () => {
    for (const task of tasks("dz-2-baumdiagramm", "pfade", 2)) {
      const m = meta(task);
      const symbols = ["r", "b", "g"].filter((_, i) => [m.red, m.blue, m.green][i] > 0);
      const counts = [m.red, m.blue, m.green].filter((c) => c > 0);
      const paths = sequences(symbols, counts, m.s);
      const full = sequences(symbols, null, m.s);
      expect(paths.length).toBeLessThan(full.length);
      expect(num(task, 0)).toBe(paths.length);
      const words = /Ereignis „([^“]+)“/.exec(task.prompt)![1];
      const E = paths.filter(PATH_EVENTS[words]);
      expect(num(task, 1), task.prompt).toBe(E.length);
      expect(E.length).toBeGreaterThan(0);
      expect(E.length).toBeLessThan(paths.length);
      const options = choice(task, 2).options;
      options.forEach((o, i) => expect(paths.includes(o), `${o} in ${task.prompt}`).toBe(i !== choice(task, 2).correctIndex));
      expect(full).toContain(picked(task, 2));
    }
  });
});
