export type Action = "vor" | "links" | "rechts";
type Instruction =
  | { kind: "action"; action: Action }
  | { kind: "repeat"; count: number; body: Instruction[] }
  | { kind: "sensor"; yes: Instruction[]; no: Instruction[] };
export interface Board {
  id: string;
  title: string;
  width: number;
  height: number;
  walls: [number, number][];
  start: [number, number];
  direction: number;
  goal: [number, number];
}
export interface RobotState {
  x: number;
  y: number;
  direction: number;
}
export interface RobotStep extends RobotState {
  action: string;
  clear: boolean;
}
export interface RobotResult {
  reached: boolean;
  collision: boolean;
  trace: RobotStep[];
  message: string;
}
export const BOARDS: Board[] = [
  {
    id: "frei",
    title: "Freier Schulhof",
    width: 5,
    height: 5,
    walls: [],
    start: [0, 4],
    direction: 0,
    goal: [4, 0],
  },
  {
    id: "wand",
    title: "Eine veränderte Startposition",
    width: 5,
    height: 5,
    walls: [[0, 1]],
    start: [0, 4],
    direction: 0,
    goal: [4, 2],
  },
  {
    id: "kurz",
    title: "Kleinerer Hof",
    width: 4,
    height: 4,
    walls: [],
    start: [0, 3],
    direction: 0,
    goal: [3, 0],
  },
];
export const ROBOT_STARTER =
  "wiederhole(2) {\n  vor();\n}\nrechts();\nwiederhole(2) {\n  vor();\n}";
export const ROBOT_SOLUTION =
  "wiederhole(30) {\n  wennFrei {\n    vor();\n  } sonst {\n    rechts();\n  }\n}";

export function parseRobot(source: string): Instruction[] {
  if (source.length > 6000)
    throw new Error("Höchstens 6.000 Zeichen im Roboterprogramm.");
  const clean = source.replace(/\/\/[^\n]*/g, "");
  const tokens = clean.match(/\s+|[a-zA-Z]+|\d+|[{}();]/g) ?? [];
  if (tokens.join("") !== clean)
    throw new Error(
      "Nutze die Befehle vor(), links(), rechts(), wiederhole(n) und wennFrei { … } sonst { … }.",
    );
  const words = tokens.filter((token) => token.trim());
  let at = 0;
  let nodes = 0;
  const expect = (word: string) => {
    if (words[at++] !== word) throw new Error(`Erwartet: ${word}.`);
  };
  function block(depth: number, nested: boolean): Instruction[] {
    if (depth > 8) throw new Error("Höchstens acht verschachtelte Blöcke.");
    if (nested) expect("{");
    const body: Instruction[] = [];
    while (at < words.length && words[at] !== "}") {
      if (++nodes > 200) throw new Error("Zu viele Programmanweisungen.");
      const word = words[at++];
      if (word === "vor" || word === "links" || word === "rechts") {
        expect("(");
        expect(")");
        expect(";");
        body.push({ kind: "action", action: word });
      } else if (word === "wiederhole") {
        expect("(");
        const count = Number(words[at++]);
        expect(")");
        if (!Number.isInteger(count) || count < 1 || count > 100)
          throw new Error(
            "Wiederholungen brauchen eine ganze Anzahl von 1 bis 100.",
          );
        body.push({ kind: "repeat", count, body: block(depth + 1, true) });
      } else if (word === "wennFrei") {
        const yes = block(depth + 1, true);
        expect("sonst");
        body.push({ kind: "sensor", yes, no: block(depth + 1, true) });
      } else throw new Error(`Unbekannter Befehl: ${word}.`);
    }
    if (nested) expect("}");
    return body;
  }
  const program = block(0, false);
  if (at !== words.length || !program.length)
    throw new Error("Prüfe die Klammern und gib mindestens einen Befehl ein.");
  return program;
}

const vectors = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];
export function frontClear(board: Board, state: RobotState): boolean {
  const [dx, dy] = vectors[state.direction];
  const x = state.x + dx;
  const y = state.y + dy;
  return (
    x >= 0 &&
    y >= 0 &&
    x < board.width &&
    y < board.height &&
    !board.walls.some(([wx, wy]) => wx === x && wy === y)
  );
}

export function runRobot(program: Instruction[], board: Board): RobotResult {
  const state: RobotState = {
    x: board.start[0],
    y: board.start[1],
    direction: board.direction,
  };
  const trace: RobotStep[] = [
    { ...state, action: "Start", clear: frontClear(board, state) },
  ];
  let collision = false;
  let stopped = false;
  let instructions = 0;
  const reached = () => state.x === board.goal[0] && state.y === board.goal[1];
  function execute(body: Instruction[]) {
    for (const item of body) {
      if (stopped || reached()) return;
      if (++instructions > 1500 || trace.length > 300) {
        stopped = true;
        return;
      }
      if (item.kind === "repeat") {
        for (let count = 0; count < item.count; count++) {
          execute(item.body);
          if (stopped || reached()) break;
        }
      } else if (item.kind === "sensor")
        execute(frontClear(board, state) ? item.yes : item.no);
      else {
        if (item.action === "vor") {
          if (!frontClear(board, state)) {
            collision = true;
            stopped = true;
          } else {
            state.x += vectors[state.direction][0];
            state.y += vectors[state.direction][1];
          }
        } else
          state.direction =
            (state.direction + (item.action === "rechts" ? 1 : 3)) % 4;
        trace.push({
          ...state,
          action: collision ? "Kollision – angehalten" : item.action,
          clear: frontClear(board, state),
        });
      }
    }
  }
  execute(program);
  return {
    reached: reached() && !collision,
    collision,
    trace,
    message: collision
      ? "Der Roboter fährt gegen ein Hindernis. Werte den Sensor vor dem Schritt aus."
      : reached()
        ? "Ziel erreicht. Der Zielkontakt beendet den Modelllauf automatisch."
        : stopped
          ? "Schrittgrenze erreicht. Der Roboter hat das Ziel nicht erreicht."
          : "Programm beendet, Ziel noch nicht erreicht.",
  };
}

export function checkRobot(
  source: string,
  task: "robot-route" | "robot-sensor",
) {
  const program = parseRobot(source);
  const boards = task === "robot-route" ? BOARDS.slice(0, 1) : BOARDS;
  const results = boards.map((board) => ({
    board,
    ...runRobot(program, board),
  }));
  return { passed: results.every((result) => result.reached), results };
}

/** A discrete two-point feedback controller, no simulation of real heating hardware. */
export function thermostat(
  temperature: number,
  target: number,
  band: number,
  wasOn: boolean,
): boolean {
  if (![temperature, target, band].every(Number.isFinite) || band < 0)
    throw new Error(
      "Temperatur, Ziel und ein nicht negatives Hystereseband sind nötig.",
    );
  if (temperature < target - band) return true;
  if (temperature > target + band) return false;
  return wasOn;
}
