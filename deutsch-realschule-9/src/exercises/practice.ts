import { shuffle } from "../format";
import type { ChooseItem, CommaItem, Lesson, Level } from "../model/types";
import { keyOf, type Progress } from "../storage/progress";

/** How many sentences one round has, and how many rounds on Niveau 1 finish a lesson. */
export const ROUND_SIZE = 3;
export const REQUIRED_ROUNDS = 2;

interface RoundState {
  key: string;
  finished: boolean;
  revealed: boolean;
  advanced: boolean;
  credited: boolean;
}

export type Round =
  | (RoundState & { kind: "commas"; items: CommaItem[] })
  | (RoundState & { kind: "choose"; items: ChooseItem[] });

/** The round the learner sees: the sentences are drawn from the pool by the lesson, the level and a counter. */
export function createRound(p: Progress, lesson: Lesson, level: Level): Round {
  const practice = lesson.practice;
  if (!practice) throw new Error("Diese Lektion besitzt keine Übung.");
  const key = keyOf(lesson.id, level);
  const state: RoundState = {
    key,
    finished: false,
    revealed: false,
    advanced: false,
    credited: false,
  };
  const seed = `${key}:${p.serial[key] ?? 0}`;
  if (practice.kind === "commas") {
    const pool = practice.pool[level];
    const order = shuffle(pool.map((_, i) => i), seed).slice(0, ROUND_SIZE);
    return { ...state, kind: "commas", items: order.map((i) => pool[i]) };
  }
  const pool = practice.pool[level];
  const order = shuffle(pool.map((_, i) => i), seed).slice(0, ROUND_SIZE);
  return { ...state, kind: "choose", items: order.map((i) => pool[i]) };
}

function advance(p: Progress, round: Round) {
  if (round.advanced) return;
  p.serial[round.key] = (p.serial[round.key] ?? 0) + 1;
  round.advanced = true;
}

/** A round counts when every sentence is right and the solution was not looked at. */
export function submitRound(p: Progress, round: Round, correct: boolean[]): boolean {
  if (round.finished) return false;
  if (correct.length !== round.items.length || !correct.every(Boolean)) return false;
  round.finished = true;
  round.credited = true;
  p.solved[round.key] = Math.min(3, (p.solved[round.key] ?? 0) + 1);
  advance(p, round);
  return true;
}

/** Caller persists the consumed serial before rendering a solution. */
export function revealRound(p: Progress, round: Round) {
  if (round.finished) return;
  round.finished = true;
  round.revealed = true;
  advance(p, round);
}

export function skipRound(p: Progress, round: Round) {
  round.finished = true;
  advance(p, round);
}
