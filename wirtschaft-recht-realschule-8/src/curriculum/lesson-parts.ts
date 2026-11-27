import type { CaseStep, Check, Term, Workshop, WrittenTask } from "../model/types";

export function check(question: string, answer: string, wrong: Check["wrong"], explanation: string): Check {
  return { question, answer, wrong, explanation };
}

export function decide(question: string, answer: string, wrong: string, explanation: string): CaseStep {
  return { question, options: [answer, wrong], answer: 0, explanation };
}

export function sort(
  title: string,
  instruction: string,
  categories: string[],
  entries: Array<[text: string, target: number, feedback: string]>,
  conclusion: string,
): Workshop {
  return {
    kind: "classify",
    title,
    instruction,
    categories,
    entries: entries.map(([text, target, feedback]) => ({ text, target, feedback })),
    conclusion,
  };
}

export function term(term: string, text: string): Term {
  return { term, text };
}

export function write(prompt: string, hints: WrittenTask["hints"], model: string, criteria: WrittenTask["criteria"]): WrittenTask {
  return { prompt, hints, model, criteria };
}
