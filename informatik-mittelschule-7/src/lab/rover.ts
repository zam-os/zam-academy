import type { LabDefinition, LabGoal, LabParam, LabValues } from "../model/types";
import { esc } from "../exercises/format";
import { action, goal, readout, select, slider } from "./workbench";

interface Rover {
  created: boolean;
  field: number;
  lamp: boolean;
  points: number;
  message: string;
}

type Block =
  | { id: string; kind: "command"; label: string; apply: (rover: Rover) => Rover }
  | { id: string; kind: "if"; label: string; test: (rover: Rover) => boolean; yes: Block[]; no: Block[] }
  | { id: string; kind: "loop"; count: number; body: Block[] };

interface Frame {
  id: string;
  rover: Rover;
  note: string;
}

function command(id: string, label: string, apply: (rover: Rover) => Rover): Block {
  return { id, kind: "command", label, apply };
}

const create = command("create", "Rover erzeugen", (r) => ({ ...r, created: true }));
const forward = command("move", "rover.fahre()", (r) => ({ ...r, field: r.field + 1 }));
const lamp = command("lamp", "rover.lichtAn()", (r) => ({ ...r, lamp: true }));
const stop = command("stop", "rover.warte()", (r) => r);
const pick = command("pick", "rover.sammle()", (r) => ({ ...r, points: r.points + 1 }));
const initial: Rover = { created: false, field: 0, lamp: false, points: 0, message: "–" };

function traceProgram(program: Block[]): Frame[] {
  const frames: Frame[] = [{ id: "", rover: initial, note: "Startbereit" }];
  let rover = initial;
  function visit(blocks: Block[]) {
    for (const block of blocks) {
      switch (block.kind) {
        case "command":
          rover = block.apply(rover);
          frames.push({ id: block.id, rover, note: block.label });
          break;
        case "if": {
          const yes = block.test(rover);
          frames.push({ id: block.id, rover, note: `${block.label} · ${yes ? "wahr" : "falsch"}` });
          visit(yes ? block.yes : block.no);
          break;
        }
        case "loop":
          for (let i = 0; i < block.count; i++) {
            frames.push({ id: block.id, rover, note: `Durchlauf ${i + 1} von ${block.count}` });
            visit(block.body);
          }
          break;
      }
    }
  }
  visit(program);
  return frames;
}

function diagram(blocks: Block[], highlight: string): string {
  return blocks.map((block) => {
    const active = block.id === highlight ? " is-active-step" : "";
    switch (block.kind) {
      case "command":
        return `<div class="code-block${active}">${esc(block.label)}</div>`;
      case "if":
        return `<div class="code-branch"><div class="code-heading${active}">${esc(block.label)}</div><div class="code-branches"><div><strong>Ja</strong>${diagram(block.yes, highlight)}</div><div><strong>Nein</strong>${block.no.length ? diagram(block.no, highlight) : '<div class="code-block">–</div>'}</div></div></div>`;
      case "loop":
        return `<div class="code-loop"><div class="code-heading${active}">Wiederhole ${block.count}×</div><div class="code-inner">${diagram(block.body, highlight)}</div></div>`;
    }
  }).join("");
}

interface RoverLab {
  kind: string;
  title: string;
  intro: string;
  params: LabParam[];
  program: (values: LabValues) => Block[];
  goals: LabGoal[];
  markers?: (values: LabValues, field: number) => string;
  extra?: (frame: (v: LabValues) => Frame) => LabDefinition["readouts"];
}

function roverLab(config: RoverLab): LabDefinition {
  const trace = (v: LabValues) => traceProgram(config.program(v));
  const frame = (v: LabValues) => trace(v)[v.step];
  return {
    ...config,
    params: [...config.params, { type: "state", key: "step", value: 0, resetOnChange: true }],
    actions: [
      action("step", "Nächster Schritt", (v) => ({ ...v, step: Math.min(v.step + 1, trace(v).length - 1) })),
      action("run", "Bis zum Ende ausführen", (v) => ({ ...v, step: trace(v).length - 1 })),
      action("restart", "Lauf zurücksetzen", (v) => ({ ...v, step: 0 })),
    ],
    readouts: [
      readout("activity", "Ausgeführter Schritt", (v) => frame(v).note),
      readout("state", "Rover", (v) => {
        const r = frame(v).rover;
        return r.created ? `Feld ${r.field} · Licht ${r.lamp ? "an" : "aus"}` : "Noch nicht erzeugt";
      }),
      ...(config.extra?.(frame) ?? []),
    ],
    view: {
      render(v) {
        const { rover, id } = frame(v);
        return `<div class="rover-workbench">
          <div class="rover-track" aria-label="Felder 0 bis 5">
            ${Array.from({ length: 6 }, (_, i) => `<div class="rover-cell">${config.markers?.(v, i) ?? ""}
              ${rover.created && rover.field === i ? `<span class="rover-token${rover.lamp ? " rover-lit" : ""}" aria-label="Rover auf Feld ${i}, Licht ${rover.lamp ? "an" : "aus"}">▰</span>` : ""}
              <span class="rover-number">${i}</span></div>`).join("")}
          </div><div class="code-diagram" aria-label="Struktogramm">${diagram(config.program(v), id)}</div>
        </div>`;
      },
    },
  };
}

export const sequenceLab = roverLab({
  kind: "rover-sequenz", title: "Objekt und Befehlsfolge",
  intro: "Wähle die Reihenfolge der Methoden. Führe den Rover zuerst Schritt für Schritt und danach bis zum Ende aus.",
  params: [select("order", "Nach dem Erzeugen", ["Fahren → Licht an", "Licht an → Fahren", "Fahren → Fahren"])],
  program: (v) => [create, ...[[forward, lamp], [lamp, forward], [forward, { ...forward, id: "move-again" }]][v.order]],
  goals: [
    goal("create", "Führe allein den Schritt zum Erzeugen des Rovers aus.", (v) => v.step === 1),
    goal("lamp-first", "Schalte auf Feld 0 das Licht ein. Halte vor dem Fahren an.", (v) => v.order === 1 && v.step === 2),
    goal("move-twice", "Richte die Befehlsfolge so ein, dass der Rover am Ende Feld 2 erreicht.", (v) => v.order === 2 && v.step === 3),
  ],
});

export const branchLab = roverLab({
  kind: "rover-alternative", title: "Zwei Wege durch eine Alternative",
  intro: "Stelle ein, was bei einem Hindernis passieren soll. Teste denselben Code je einmal mit und ohne Hindernis.",
  params: [select("blocked", "Hindernis voraus", ["Nein", "Ja"]), select("law", "Wenn Hindernis erkannt", ["Fahren, sonst warten", "Warten mit Licht, sonst fahren"])],
  markers: (v, field) => v.blocked && field === 1 ? '<span class="rover-warning" aria-label="Hindernis">◆</span>' : "",
  program: (v) => [create, {
    id: "branch", kind: "if", label: "Hindernis voraus?", test: () => v.blocked === 1,
    yes: v.law === 1 ? [lamp, stop] : [forward], no: v.law === 1 ? [forward] : [stop],
  }],
  goals: [
    goal("see-test", "Stelle ein Hindernis ein und halte an der Prüfung der Bedingung an.", (v) => v.blocked === 1 && v.step === 2),
    goal("safe-stop", "Teste mit Hindernis: Der Rover bleibt mit Licht auf Feld 0 stehen.", (v) => v.blocked === 1 && v.law === 1 && v.step === 4),
    goal("drive", "Teste die passende Regel ohne Hindernis: Der Rover fährt bis Feld 1.", (v) => v.blocked === 0 && v.law === 1 && v.step === 3),
  ],
});

function loopProgram(count: number, collect: boolean, nested: boolean): Block[] {
  const check: Block = {
    id: "marker", kind: "if", label: "Ist hier eine Marke?", test: (r) => r.field % 2 === 1,
    yes: [collect ? pick : stop], no: [],
  };
  const loop: Block = { id: "loop", kind: "loop", count, body: nested ? [forward, check] : [forward] };
  return nested ? [create, loop] : [create, loop, check];
}

function loopFor(v: LabValues): Block[] {
  return loopProgram(v.count, v.collect === 1, v.nested === 1);
}

export const loopLab = roverLab({
  kind: "rover-schachtelung", title: "Sammelrunde mit Wiederholung",
  intro: "Baue eine Bedingung in die Wiederholung ein. Pro Durchlauf fährt der Rover weiter und prüft das neue Feld.",
  params: [slider("count", "Durchläufe", 1, 5, 1),
    select("nested", "Wo wird geprüft?", ["Nach der Wiederholung", "In jedem Durchlauf"]),
    select("collect", "Wenn hier eine Marke ist", ["Warten", "Einsammeln"])],
  markers: (_, field) => field % 2 === 1 ? '<span class="rover-mark" aria-label="Marke">✦</span>' : "",
  program: loopFor,
  extra: (frame) => [readout("collected", "Gesammelte Marken", (v) => frame(v).rover.points)],
  goals: [2, 3, 5].map((count) => goal(`runde-${count}`, `Fahre bis Feld ${count} und sammle alle Marken bis dorthin.`, (v) => {
    const end = traceProgram(loopFor(v));
    return v.count === count && v.step === end.length - 1 && end.at(-1)!.rover.points === Math.ceil(count / 2);
  })),
});

function scoreProgram(first: number, gain: number, inclusive: boolean): Block[] {
  return [
    create,
    command("init", `punkte ← ${first}`, (r) => ({ ...r, points: first })),
    command("gain", `punkte ← punkte + ${gain}`, (r) => ({ ...r, points: r.points + gain })),
    {
      id: "limit", kind: "if", label: inclusive ? "punkte ≥ 3?" : "punkte > 3?",
      test: (r) => inclusive ? r.points >= 3 : r.points > 3,
      yes: [command("win", "meldung ← „Ziel erreicht“", (r) => ({ ...r, message: "Ziel erreicht" }))],
      no: [command("try", "meldung ← „Weiter üben“", (r) => ({ ...r, message: "Weiter üben" }))],
    },
  ];
}

function scoreFor(v: LabValues): Block[] {
  return scoreProgram(v.first, v.gain, v.inclusive === 1);
}

export const variableLab = roverLab({
  kind: "rover-variablen", title: "Punktestand und Grenztest",
  intro: "Die Meldung soll ab 3 Punkten erscheinen. Korrigiere die Bedingung und prüfe Fälle knapp unter, genau an und über der Grenze.",
  params: [slider("first", "Startwert punkte", 0, 4, 0), slider("gain", "Neue Punkte", 0, 3, 1),
    select("inclusive", "Bedingung", ["punkte > 3", "punkte ≥ 3"])],
  program: scoreFor,
  extra: (frame) => [
    readout("points", "Variable punkte · Ganzzahl", (v) => v.step >= 2 ? frame(v).rover.points : "Noch nicht gesetzt"),
    readout("message", "Variable meldung · Text", (v) => frame(v).rover.message),
  ],
  goals: [
    goal("below", "Teste eine Summe von 2 mit der korrigierten Bedingung.", (v) => v.inclusive === 1 && v.first + v.gain === 2 && v.step === 5),
    goal("limit", "Teste genau 3 Punkte. „Ziel erreicht“ soll erscheinen.", (v) => v.inclusive === 1 && v.first + v.gain === 3 && v.step === 5),
    goal("above", "Teste 4 Punkte mit der korrigierten Bedingung.", (v) => v.inclusive === 1 && v.first + v.gain === 4 && v.step === 5),
  ],
});
