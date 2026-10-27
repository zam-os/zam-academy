import { circle, line, open, rect, text } from "./svg";

/**
 * A garden robot on a square grid, for the programming lessons. Columns are
 * A, B, C, … from the left, rows 1, 2, 3, … from the top; the robot starts
 * in the lower left corner and faces north. "vor" into a wall or an obstacle
 * leaves it where it is and counts as a bump.
 */

export type Instruction = "vor" | "links" | "rechts";
export type Heading = 0 | 1 | 2 | 3; // north, east, south, west

export interface RobotState {
  x: number;
  y: number;
  heading: Heading;
  bumps: number;
  path: Array<{ x: number; y: number }>;
}

export interface Garden {
  size: number;
  obstacles: Array<{ x: number; y: number }>;
}

export const HEADING_NAMES = ["Norden", "Osten", "Süden", "Westen"] as const;
export const HEADING_ARROWS = ["↑", "→", "↓", "←"] as const;
const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];

export function startState(garden: Garden): RobotState {
  const y = garden.size - 1;
  return { x: 0, y, heading: 0, bumps: 0, path: [{ x: 0, y }] };
}

export function blocked(garden: Garden, x: number, y: number): boolean {
  return (
    x < 0 ||
    y < 0 ||
    x >= garden.size ||
    y >= garden.size ||
    garden.obstacles.some((o) => o.x === x && o.y === y)
  );
}

export function frontFree(garden: Garden, state: RobotState): boolean {
  return !blocked(garden, state.x + DX[state.heading], state.y + DY[state.heading]);
}

export function step(garden: Garden, state: RobotState, instruction: Instruction): RobotState {
  if (instruction === "links") return { ...state, heading: ((state.heading + 3) % 4) as Heading };
  if (instruction === "rechts") return { ...state, heading: ((state.heading + 1) % 4) as Heading };
  const x = state.x + DX[state.heading];
  const y = state.y + DY[state.heading];
  if (blocked(garden, x, y)) return { ...state, bumps: state.bumps + 1 };
  return { ...state, x, y, path: [...state.path, { x, y }] };
}

export function run(garden: Garden, program: Instruction[], from = startState(garden)): RobotState {
  return program.reduce((state, instruction) => step(garden, state, instruction), from);
}

/** "C3": column letter and row number, as on a chess board. */
export function fieldName(x: number, y: number): string {
  return `${String.fromCharCode(65 + x)}${y + 1}`;
}

export interface LoopResult {
  state: RobotState;
  rounds: number;
  /** True when the loop would never stop (cut off after `limit` rounds). */
  endless: boolean;
}

/** `wiederhole n-mal`: the body runs exactly n times. */
export function repeatTimes(garden: Garden, body: Instruction[], times: number): LoopResult {
  let state = startState(garden);
  for (let i = 0; i < times; i++) state = run(garden, body, state);
  return { state, rounds: times, endless: false };
}

/**
 * `wiederhole solange vorne frei`: the condition is checked before every
 * round (Wiederholung mit Anfangsbedingung). A body that never brings the
 * robot to a wall runs forever; the model stops after `limit` rounds.
 */
export function repeatWhileFree(garden: Garden, body: Instruction[], limit = 40): LoopResult {
  let state = startState(garden);
  let rounds = 0;
  const seen = new Set<string>();
  while (frontFree(garden, state)) {
    const key = `${state.x},${state.y},${state.heading}`;
    if (rounds >= limit || seen.has(key)) return { state, rounds, endless: true };
    seen.add(key);
    state = run(garden, body, state);
    rounds += 1;
  }
  return { state, rounds, endless: false };
}


/** The garden, its marked fields, the robot and the path it drove. */
export function drawGarden(
  garden: Garden,
  state: RobotState,
  marks: Array<{ x: number; y: number; label: string; reached: boolean }>,
  caption: string,
): string {
  const cell = Math.min(52, 280 / garden.size);
  const left = 260 - (cell * garden.size) / 2;
  const top = 24;
  let out = open("Garten mit Roboter");
  for (let y = 0; y < garden.size; y++) {
    for (let x = 0; x < garden.size; x++) {
      const isObstacle = garden.obstacles.some((o) => o.x === x && o.y === y);
      out += rect(left + x * cell, top + y * cell, cell - 2, cell - 2, isObstacle ? "lab-fill-b" : "lab-shape", 'rx="5"');
      if (isObstacle) out += text(left + x * cell + cell / 2 - 1, top + y * cell + cell / 2 + 4, "Stein", "lab-text-small", "middle");
    }
    out += text(left - 12, top + y * cell + cell / 2 + 4, String(y + 1), "lab-text-tick", "middle");
  }
  for (let x = 0; x < garden.size; x++) {
    out += text(left + x * cell + cell / 2 - 1, top + garden.size * cell + 14, String.fromCharCode(65 + x), "lab-text-tick", "middle");
  }
  for (const mark of marks) {
    out += rect(left + mark.x * cell + 3, top + mark.y * cell + 3, cell - 8, cell - 8, mark.reached ? "lab-fill-ok" : "lab-fill-c", 'rx="5"');
    out += text(left + mark.x * cell + cell / 2 - 1, top + mark.y * cell + 14, mark.label, "lab-text-small", "middle");
  }
  const centre = (p: { x: number; y: number }) => ({ x: left + p.x * cell + cell / 2 - 1, y: top + p.y * cell + cell / 2 - 1 });
  for (let i = 1; i < state.path.length; i++) {
    const a = centre(state.path[i - 1]);
    const b = centre(state.path[i]);
    out += line(a.x, a.y, b.x, b.y, "lab-curve");
  }
  const robot = centre(state);
  out += circle(robot.x, robot.y, cell * 0.32, "lab-fill-a");
  out += text(robot.x, robot.y + 6, HEADING_ARROWS[state.heading], "lab-text-big", "middle");
  out += text(260, top + garden.size * cell + 34, caption, "lab-text", "middle");
  return `${out}</svg>`;
}
