import { circle, line, open, rect, text } from "./svg";

/**
 * Spielfeld- und Bewegungsmodell für die Lernfigur Karo.
 * Spalten heißen A, B, C, … von links, Zeilen 1, 2, 3, … von oben.
 * „vor“ gegen eine Wand oder ein Hindernis lässt die Figur stehen und zählt als Zusammenstoß.
 */

export type Command = "vor" | "links" | "rechts";
export type Heading = 0 | 1 | 2 | 3; // 0: Norden, 1: Osten, 2: Süden, 3: Westen

export interface CellPos {
  x: number;
  y: number;
}

export interface FigureState {
  x: number;
  y: number;
  heading: Heading;
  bumps: number;
  steps: number;
  path: CellPos[];
}

export interface Field {
  size: number;
  obstacles: CellPos[];
  stars?: CellPos[];
}

export const HEADING_NAMES = ["Norden", "Osten", "Süden", "Westen"] as const;
export const HEADING_ARROWS = ["↑", "→", "↓", "←"] as const;
export const FIELD_DX = [0, 1, 0, -1] as const;
export const FIELD_DY = [-1, 0, 1, 0] as const;

export function startAt(x: number, y: number, heading: Heading = 0): FigureState {
  return { x, y, heading, bumps: 0, steps: 0, path: [{ x, y }] };
}

export function fieldLabel(x: number, y: number): string {
  return `${String.fromCharCode(65 + x)}${y + 1}`;
}

export function isBlocked(field: Field, x: number, y: number): boolean {
  return (
    x < 0 ||
    y < 0 ||
    x >= field.size ||
    y >= field.size ||
    field.obstacles.some((o) => o.x === x && o.y === y)
  );
}

export function cellAhead(state: FigureState): CellPos {
  return {
    x: state.x + FIELD_DX[state.heading],
    y: state.y + FIELD_DY[state.heading],
  };
}

export function frontFree(field: Field, state: FigureState): boolean {
  const ahead = cellAhead(state);
  return !isBlocked(field, ahead.x, ahead.y);
}

export function frontObstacle(field: Field, state: FigureState): boolean {
  return !frontFree(field, state);
}

export function atEdge(field: Field, state: FigureState): boolean {
  return (
    state.x === 0 ||
    state.y === 0 ||
    state.x === field.size - 1 ||
    state.y === field.size - 1
  );
}

export function onStar(field: Field, state: FigureState): boolean {
  return Boolean(field.stars?.some((s) => s.x === state.x && s.y === state.y));
}

export function stepFigure(field: Field, state: FigureState, command: Command): FigureState {
  if (command === "links") {
    return { ...state, heading: ((state.heading + 3) % 4) as Heading, steps: state.steps + 1 };
  }
  if (command === "rechts") {
    return { ...state, heading: ((state.heading + 1) % 4) as Heading, steps: state.steps + 1 };
  }
  const ahead = cellAhead(state);
  if (isBlocked(field, ahead.x, ahead.y)) {
    return { ...state, bumps: state.bumps + 1, steps: state.steps + 1 };
  }
  return {
    ...state,
    x: ahead.x,
    y: ahead.y,
    steps: state.steps + 1,
    path: [...state.path, ahead],
  };
}

export function runSequence(field: Field, program: Command[], from: FigureState): FigureState {
  return program.reduce((state, cmd) => stepFigure(field, state, cmd), from);
}

export interface LoopExecution {
  state: FigureState;
  rounds: number;
  endless: boolean;
}

export function runRepeatTimes(
  field: Field,
  body: Command[],
  times: number,
  from: FigureState,
): LoopExecution {
  let state = from;
  for (let i = 0; i < times; i++) {
    state = runSequence(field, body, state);
  }
  return { state, rounds: times, endless: false };
}

export function runWhileCondition(
  field: Field,
  condition: (f: Field, s: FigureState) => boolean,
  body: Command[],
  from: FigureState,
  limit = 40,
): LoopExecution {
  let state = from;
  let rounds = 0;
  const seen = new Set<string>();
  while (condition(field, state)) {
    const key = `${state.x},${state.y},${state.heading}`;
    if (rounds >= limit || seen.has(key)) {
      return { state, rounds, endless: true };
    }
    seen.add(key);
    state = runSequence(field, body, state);
    rounds += 1;
  }
  return { state, rounds, endless: false };
}

export function runNestedLoop(
  field: Field,
  outerCondition: (f: Field, s: FigureState) => boolean,
  innerCondition: (f: Field, s: FigureState) => boolean,
  thenBranch: Command[],
  elseBranch: Command[],
  from: FigureState,
  limit = 40,
): LoopExecution {
  let state = from;
  let rounds = 0;
  const seen = new Set<string>();
  while (outerCondition(field, state)) {
    const key = `${state.x},${state.y},${state.heading}`;
    if (rounds >= limit || seen.has(key)) {
      return { state, rounds, endless: true };
    }
    seen.add(key);
    const branch = innerCondition(field, state) ? thenBranch : elseBranch;
    state = runSequence(field, branch, state);
    rounds += 1;
  }
  return { state, rounds, endless: false };
}

export interface FieldMark {
  x: number;
  y: number;
  label: string;
  reached?: boolean;
  tone?: "ok" | "goal" | "probe" | "bad";
}

export function drawFieldCells(
  field: Field,
  state: FigureState,
  marks: FieldMark[],
  options: { left?: number; top?: number; maxSpan?: number; caption?: string } = {},
): string {
  const maxSpan = options.maxSpan ?? 215;
  const cell = Math.min(44, maxSpan / field.size);
  const left = options.left ?? 260 - (cell * field.size) / 2;
  const top = options.top ?? 24;
  let out = "";

  for (let y = 0; y < field.size; y++) {
    for (let x = 0; x < field.size; x++) {
      const obstacle = field.obstacles.some((o) => o.x === x && o.y === y);
      const star = field.stars?.some((s) => s.x === x && s.y === y);
      const cx = left + x * cell;
      const cy = top + y * cell;
      out += rect(
        cx,
        cy,
        cell - 2,
        cell - 2,
        obstacle ? "lab-fill-b" : star ? "lab-fill-c" : "lab-shape",
        'rx="5"',
      );
      if (obstacle) {
        out += text(cx + (cell - 2) / 2, cy + (cell - 2) / 2 + 4, "Stein", "lab-text-small", "middle");
      } else if (star) {
        out += text(cx + (cell - 2) / 2, cy + (cell - 2) / 2 + 5, "★", "lab-text-c", "middle");
      }
    }
    out += text(left - 10, top + y * cell + (cell - 2) / 2 + 4, String(y + 1), "lab-text-tick", "middle");
  }

  for (let x = 0; x < field.size; x++) {
    out += text(
      left + x * cell + (cell - 2) / 2,
      top + field.size * cell + 14,
      String.fromCharCode(65 + x),
      "lab-text-tick",
      "middle",
    );
  }

  for (const mark of marks) {
    if (mark.x < 0 || mark.y < 0 || mark.x >= field.size || mark.y >= field.size) continue;
    const cls =
      mark.reached || mark.tone === "ok"
        ? "lab-fill-ok"
        : mark.tone === "bad"
          ? "lab-bad"
          : mark.tone === "probe"
            ? "lab-fill-a"
            : "lab-fill-c";
    const cx = left + mark.x * cell;
    const cy = top + mark.y * cell;
    out += rect(cx + 3, cy + 3, cell - 8, cell - 8, cls, 'rx="5"');
    if (mark.label) {
      out += text(cx + (cell - 2) / 2, cy + 16, mark.label, "lab-text-small", "middle");
    }
  }

  const center = (p: CellPos) => ({
    x: left + p.x * cell + (cell - 2) / 2,
    y: top + p.y * cell + (cell - 2) / 2,
  });

  for (let i = 1; i < state.path.length; i++) {
    const a = center(state.path[i - 1]);
    const b = center(state.path[i]);
    out += line(a.x, a.y, b.x, b.y, "lab-curve");
  }

  const pos = center(state);
  out += circle(pos.x, pos.y, cell * 0.32, "lab-fill-a");
  out += text(pos.x, pos.y + 6, HEADING_ARROWS[state.heading], "lab-text-big", "middle");

  if (options.caption) {
    out += text(left + (field.size * cell) / 2, top + field.size * cell + 34, options.caption, "lab-text-small", "middle");
  }
  return out;
}

export function drawField(
  label: string,
  field: Field,
  state: FigureState,
  marks: FieldMark[],
  caption: string,
): string {
  return `${open(label)}${drawFieldCells(field, state, marks, { caption })}</svg>`;
}
