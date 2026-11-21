import type { ChoiceParam, LabDefinition, LabGoal, LabValues } from "../model/types";
import { choices } from "./diagrams";
import { circle, open, rect, text } from "./svg";

type Command = "—" | "→ Rechts" | "↑ Hoch" | "● Markieren";
type Position = { x: number; y: number; marked: boolean; blocked: boolean };
type Mode = "sequence" | "branch" | "count" | "until";

const COMMANDS: Command[] = ["—", "→ Rechts", "↑ Hoch", "● Markieren"];
const ORIGIN: Position = { x: 0, y: 2, marked: false, blocked: false };
const X_LIMIT = 4;
const move = (p: Position, command: Command, wall: (x: number, y: number) => boolean): Position => {
  if (command === "● Markieren") return { ...p, marked: true };
  if (command === "—") return p;
  const x = p.x + Number(command === "→ Rechts");
  const y = p.y - Number(command === "↑ Hoch");
  if (x > X_LIMIT || y < 0 || wall(x, y)) return { ...p, blocked: true };
  return { ...p, x, y, marked: false };
};

function program(
  mode: Mode,
  v: LabValues,
): Array<{ command: Command; explanation: string; block: number }> {
  if (mode === "sequence")
    return [v.first, v.second, v.third].flatMap((i, block) =>
      i
        ? [
            {
              command: COMMANDS[i],
              explanation: `Platz ${block + 1}`,
              block,
            },
          ]
        : [],
    );
  if (mode === "branch")
    return [
      {
        command: COMMANDS[v.wall ? v.yes : v.no],
        explanation: v.wall
          ? "Bedingung wahr: Weg rechts versperrt"
          : "Bedingung falsch: Weg rechts frei",
        block: v.wall ? 1 : 2,
      },
    ];
  const steps = [];
  let current = ORIGIN;
  const goal = target(mode, v);
  const limit = mode === "count" ? v.amount + 1 : 5;
  for (let index = 0; index < limit; index++) {
    if (mode === "until" && (current.blocked || (current.x === goal?.[0] && current.y === goal?.[1])))
      break;
    const command = COMMANDS[v.body];
    const explanation =
      mode === "count"
        ? `Durchlauf ${index + 1} von ${limit}`
        : `Prüfung ${index + 1}: Ziel noch nicht erreicht`;
    steps.push({ command, explanation, block: 1 });
    current = move(current, command, () => false);
  }
  return steps;
}

function trace(mode: Mode, v: LabValues): Position[] {
  const wall = (x: number, y: number) =>
    (mode === "sequence" && x === 0 && y === 1) ||
    (mode === "branch" && v.wall === 1 && x === 1 && y === 2);
  const path = [ORIGIN];
  for (const instruction of program(mode, v).slice(0, v.step)) {
    const current = path[path.length - 1];
    if (current.blocked) break;
    path.push(move(current, instruction.command, wall));
  }
  return path;
}

const position = (mode: Mode, v: LabValues): Position => trace(mode, v).at(-1) ?? ORIGIN;
const ran = (v: LabValues) => v.started === 1;
const finished = (mode: Mode, v: LabValues) => ran(v) && v.step >= program(mode, v).length;
const at = (mode: Mode, v: LabValues, x: number, y: number) => {
  const p = position(mode, v);
  return ran(v) && p.x === x && p.y === y && !p.blocked;
};

const SETTINGS: Record<
  Mode,
  { title: string; intro: string; controls: ChoiceParam[]; goals: LabGoal[] }
> = {
  sequence: {
    title: "Roboterbefehle ordnen",
    intro:
      "Das Feld direkt über dem Start ist gesperrt. Bestücke die drei Plätze mit Blöcken und führe dein Programm Schritt für Schritt aus.",
    controls: [
      choices("first", "Erster Block", COMMANDS),
      choices("second", "Zweiter Block", COMMANDS),
      choices("third", "Dritter Block", COMMANDS),
    ],
    goals: [
      {
        id: "detour",
        text: "Fahre zuerst nach rechts, damit der Roboter dem Hindernis ausweicht.",
        check: (v) => v.first === 1 && v.step === 1 && at("sequence", v, 1, 2),
      },
      {
        id: "target",
        text: "Fahre anschließend hoch zur Zielkachel.",
        check: (v) => at("sequence", v, 1, 1),
      },
      {
        id: "stamp",
        text: "Markiere die Zielkachel als letzten Schritt.",
        check: (v) => at("sequence", v, 1, 1) && position("sequence", v).marked,
      },
    ],
  },
  branch: {
    title: "Der Roboter prüft den Weg",
    intro:
      "Die Bedingung lautet „Ist rechts eine Wand?“. Setze die Blöcke für den Dann- und den Sonst-Zweig. Teste dein Programm mit freiem Weg und mit Wand.",
    controls: [
      choices("wall", "Testsituation", ["Rechts frei", "Rechts versperrt"]),
      choices("yes", "Dann-Block", COMMANDS),
      choices("no", "Sonst-Block", COMMANDS),
    ],
    goals: [
      {
        id: "when-true",
        text: "Weiche bei einer Wand nach oben aus.",
        check: (v) => v.wall === 1 && at("branch", v, 0, 1),
      },
      {
        id: "without-else",
        text: "Setze „Hoch“ nur in den Dann-Zweig. Teste, dass der Roboter bei freiem Weg am Start bleibt.",
        check: (v) =>
          v.wall === 0 && v.yes === 2 && v.no === 0 && finished("branch", v) && at("branch", v, 0, 2),
      },
      {
        id: "with-else",
        text: "Ergänze den Sonst-Block, damit er bei freiem Weg nach rechts fährt.",
        check: (v) => v.wall === 0 && v.yes === 2 && at("branch", v, 1, 2),
      },
    ],
  },
  count: {
    title: "Einen Block mehrfach ausführen",
    intro:
      "Wähle einen Block und eine feste Anzahl. Halte nach dem ersten Schritt an, bevor du bis zum Ziel weiterfährst.",
    controls: [
      choices("body", "Block in der Schleife", COMMANDS),
      choices("amount", "Anzahl Durchläufe", ["1", "2", "3", "4"]),
    ],
    goals: [
      {
        id: "first",
        text: "Beobachte den ersten von drei Schritten nach rechts.",
        check: (v) => v.amount === 2 && v.step === 1 && at("count", v, 1, 2),
      },
      {
        id: "three",
        text: "Erreiche mit drei Durchläufen die Zielkachel.",
        check: (v) => v.amount === 2 && finished("count", v) && at("count", v, 3, 2),
      },
      {
        id: "short",
        text: "Verkürze die Schleife auf zwei Durchläufe und bleibe ein Feld vorher stehen.",
        check: (v) => v.amount === 1 && finished("count", v) && at("count", v, 2, 2),
      },
    ],
  },
  until: {
    title: "Bei wechselnden Zielen anhalten",
    intro:
      "Das Programm prüft vor jedem Schritt: „Ist die Zielmarke noch nicht erreicht?“. Verschiebe die Marke und teste denselben Schleifenblock erneut.",
    controls: [
      choices("target", "Position der Zielmarke", [
        "Zwei Felder rechts",
        "Vier Felder rechts",
        "Am Start",
      ]),
      choices("body", "Block in der Schleife", COMMANDS),
    ],
    goals: [
      {
        id: "near",
        text: "Fahre zur nahen Zielmarke und halte dort an.",
        check: (v) => v.target === 0 && finished("until", v) && at("until", v, 2, 2),
      },
      {
        id: "far",
        text: "Nutze denselben Block für die weiter entfernte Zielmarke.",
        check: (v) => v.target === 1 && finished("until", v) && at("until", v, 4, 2),
      },
      {
        id: "zero",
        text: "Starte auf der Marke und beobachte die Schleife ohne Durchlauf.",
        check: (v) => v.target === 2 && v.body === 1 && finished("until", v) && v.step === 0,
      },
    ],
  },
};

function target(mode: Mode, v: LabValues): [number, number] | undefined {
  if (mode === "sequence") return [1, 1];
  if (mode === "count") return [3, 2];
  if (mode === "until")
    return [
      [2, 2],
      [4, 2],
      [0, 2],
    ][v.target] as [number, number];
  return undefined;
}

function summary(mode: Mode, v: LabValues): string {
  const p = position(mode, v);
  if (!ran(v)) return "Bereit. Führe den ersten Schritt aus.";
  if (p.blocked) return "Stopp: Der Roboter fährt gegen eine Wand oder an den Rand.";
  if (mode === "until" && finished(mode, v)) {
    const [x, y] = target(mode, v) ?? [0, 2];
    if (p.x === x && p.y === y) return `Ziel erreicht. Durchläufe: ${v.step}.`;
    return "Die Bedingung bleibt wahr. Ohne die Grenze des Modells würde dieses Programm weiterlaufen. Das Modell stoppt nach fünf Durchläufen.";
  }
  if (finished(mode, v)) return "Programm beendet.";
  return "Nächster Schritt ist bereit.";
}

function lineOfCode(mode: Mode, v: LabValues): string[] {
  if (mode === "sequence") return [v.first, v.second, v.third].map((i) => COMMANDS[i]);
  if (mode === "branch")
    return ["WENN rechts versperrt", `DANN ${COMMANDS[v.yes]}`, `SONST ${COMMANDS[v.no]}`];
  if (mode === "count") return [`WIEDERHOLE ${v.amount + 1} MAL`, COMMANDS[v.body]];
  return ["SOLANGE Ziel fehlt", COMMANDS[v.body]];
}

export function robotLab(mode: Mode): LabDefinition {
  const settings = SETTINGS[mode];
  return {
    kind: `robot-${mode}`,
    title: settings.title,
    intro: settings.intro,
    goals: settings.goals,
    params: [
      ...settings.controls,
      { type: "state", key: "step", value: 0, resetOnChange: true },
      { type: "state", key: "started", value: 0, resetOnChange: true },
    ],
    actions: [
      {
        id: "step",
        label: "Nächster Schritt",
        apply: (v) => ({
          ...v,
          started: 1,
          step: position(mode, v).blocked ? v.step : Math.min(v.step + 1, program(mode, v).length),
        }),
      },
      { id: "replay", label: "Roboter zum Start", apply: (v) => ({ ...v, started: 0, step: 0 }) },
    ],
    readouts: [
      { key: "status", label: "Programmzustand", compute: (v) => summary(mode, v), emphasis: true },
      {
        key: "position",
        label: "Roboterposition",
        compute: (v) => {
          const p = position(mode, v);
          return `Spalte ${p.x + 1}, Zeile ${p.y + 1}${p.marked ? " · markiert" : ""}`;
        },
      },
      {
        key: "last",
        label: "Letzte Aktion",
        compute: (v) => {
          const last = program(mode, v)[v.step - 1];
          return last
            ? `${last.explanation} · ${last.command === "—" ? "kein Block" : last.command}`
            : "Noch kein Block ausgeführt";
        },
      },
    ],
    view: {
      render(v) {
        const route = trace(mode, v);
        const p = route.at(-1) ?? ORIGIN;
        const goal = target(mode, v);
        let out = open(`Programmsimulation. Roboter in Spalte ${p.x + 1}, Zeile ${p.y + 1}.`);
        out += text(19, 58, "Spielfeld", "lab-text");
        out += text(293, 58, "Deine Programmblöcke", "lab-text");
        const cell = 47;
        for (let y = 0; y <= 2; y++) {
          for (let x = 0; x <= X_LIMIT; x++) {
            const px = 18 + x * (cell + 2);
            const py = 85 + y * (cell + 2);
            const wall =
              (mode === "sequence" && x === 0 && y === 1) ||
              (mode === "branch" && v.wall === 1 && x === 1 && y === 2);
            const visited = route.some((point) => point.x === x && point.y === y);
            const isGoal = goal?.[0] === x && goal[1] === y;
            out += rect(
              px,
              py,
              cell,
              cell,
              wall ? "lab-fill-b" : visited ? "lab-soft-a" : "lab-panel",
              'rx="7"',
            );
            if (p.x === x && p.y === y) {
              out += circle(px + 23.5, py + 23.5, 15, "lab-fill-ok");
              out += text(px + 23.5, py + 29, p.marked ? "✓" : "R", "lab-text", "middle");
              if (isGoal) out += text(px + 39, py + 13, "★", "lab-text-small", "middle");
            } else if (wall || isGoal) {
              out += text(px + 23.5, py + 29, wall ? "■" : "★", "lab-text", "middle");
            }
          }
        }
        lineOfCode(mode, v).forEach((label, index) => {
          const y = 85 + 46 * index;
          const current = program(mode, v)[v.step - 1]?.block === index;
          out += rect(
            288 + (mode === "sequence" || !index ? 0 : 12),
            y,
            mode === "sequence" || !index ? 214 : 202,
            39,
            current ? "lab-fill-ok" : "lab-soft-a",
            'rx="8"',
          );
          out += text(308, y + 25, label, "lab-text");
        });
        out += text(18, 267, "R Roboter · ★ Ziel · ■ Wand", "lab-text-small");
        out += text(18, 297, `Ausgeführte Schritte: ${v.step}`, "lab-text");
        return out + "</svg>";
      },
    },
  };
}
