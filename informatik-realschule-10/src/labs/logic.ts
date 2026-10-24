export type Bit = 0 | 1;
export type Inputs = { A: Bit; B: Bit; C: Bit };
export type LogicNode =
  | { kind: "input"; name: keyof Inputs }
  | { kind: "not"; child: LogicNode }
  | { kind: "gate"; gate: string; left: LogicNode; right: LogicNode };
const aliases: Record<string, string> = {
  UND: "AND",
  ODER: "OR",
  NICHT: "NOT",
  "!": "NOT",
  "&&": "AND",
  "||": "OR",
};
export const logicLabel = (gate: string): string =>
  ({ AND: "UND", OR: "ODER", NOT: "NICHT" })[gate] ?? gate;
const precedences: Record<string, number> = {
  OR: 1,
  NOR: 1,
  XOR: 2,
  XNOR: 2,
  AND: 3,
  NAND: 3,
};

/** Bounded Boolean parser; neither JavaScript nor strings are evaluated. */
export function parseLogic(source: string): LogicNode {
  if (source.length > 600)
    throw new Error("Der Term darf höchstens 600 Zeichen lang sein.");
  const tokens = source.toUpperCase().match(/\s+|[A-Z]+|&&|\|\||[!()]/g) ?? [];
  if (tokens.join("") !== source.toUpperCase())
    throw new Error(
      "Erlaubt sind A, B, C, NICHT, UND, ODER, XOR, NAND, NOR, XNOR und Klammern.",
    );
  const words = tokens
    .filter((token) => token.trim())
    .map((token) => aliases[token] ?? token);
  let position = 0;
  let nodes = 0;
  function expression(minimum = 0, depth = 0): LogicNode {
    if (depth > 24 || ++nodes > 120)
      throw new Error("Der Term ist zu tief verschachtelt.");
    const token = words[position++];
    let left: LogicNode;
    if (token === "NOT")
      left = { kind: "not", child: expression(4, depth + 1) };
    else if (token === "(") {
      left = expression(0, depth + 1);
      if (words[position++] !== ")")
        throw new Error("Eine schließende Klammer fehlt.");
    } else if (token === "A" || token === "B" || token === "C")
      left = { kind: "input", name: token };
    else throw new Error("Hier fehlt ein Eingang A, B oder C.");
    while (position < words.length) {
      const gate = words[position];
      const precedence = precedences[gate];
      if (precedence === undefined || precedence < minimum) break;
      position++;
      left = {
        kind: "gate",
        gate,
        left,
        right: expression(precedence + 1, depth + 1),
      };
    }
    return left;
  }
  const node = expression();
  if (position !== words.length)
    throw new Error(`Unerwartetes Zeichen: ${words[position]}.`);
  return node;
}

export function evaluateLogic(node: LogicNode, inputs: Inputs): Bit {
  if (node.kind === "input") return inputs[node.name];
  if (node.kind === "not")
    return (1 - evaluateLogic(node.child, inputs)) as Bit;
  const left = evaluateLogic(node.left, inputs);
  const right = evaluateLogic(node.right, inputs);
  switch (node.gate) {
    case "AND":
      return (left & right) as Bit;
    case "OR":
      return (left | right) as Bit;
    case "XOR":
      return (left ^ right) as Bit;
    case "NAND":
      return (1 - (left & right)) as Bit;
    case "NOR":
      return (1 - (left | right)) as Bit;
    case "XNOR":
      return (1 - (left ^ right)) as Bit;
    default:
      throw new Error("Unbekanntes Gatter.");
  }
}

export const INPUT_ROWS: Inputs[] = Array.from({ length: 8 }, (_, index) => ({
  A: (index >> 2) as Bit,
  B: ((index >> 1) & 1) as Bit,
  C: (index & 1) as Bit,
}));
export const LOGIC_TASKS = [
  {
    id: "logic-schutz",
    title: "Schutzschaltung",
    task: "Der Motor läuft genau dann, wenn Start A an ist und die offene Schutztür B nicht gemeldet wird. C wird nicht gebraucht.",
    outputs: ["Motor"],
    solutions: ["A UND NICHT B"],
    starter: ["A ODER B"],
  },
  {
    id: "logic-xor",
    title: "Treppenlicht",
    task: "Das Licht leuchtet genau dann, wenn die beiden Schalter A und B verschieden stehen. C wird nicht gebraucht.",
    outputs: ["Licht"],
    solutions: ["A XOR B"],
    starter: ["A ODER B"],
  },
  {
    id: "logic-adder",
    title: "Volladdierer",
    task: "Addiere A, B und den Eingangsübertrag C. Entwickle einen Term für das Summenbit und einen für den Ausgangsübertrag.",
    outputs: ["Summe", "Übertrag"],
    solutions: ["A XOR B XOR C", "(A UND B) ODER (C UND (A XOR B))"],
    starter: ["A XOR B", "A UND B"],
  },
] as const;

export function checkLogic(taskId: string, sources: string[]) {
  const task = LOGIC_TASKS.find((entry) => entry.id === taskId);
  if (!task || sources.length !== task.outputs.length)
    throw new Error("Wähle eine gültige Aufgabe und fülle alle Ausgänge aus.");
  const actual = sources.map(parseLogic);
  const expected = task.solutions.map(parseLogic);
  const rows = INPUT_ROWS.map((inputs) => {
    const values = actual.map((node) => evaluateLogic(node, inputs));
    const targets = expected.map((node) => evaluateLogic(node, inputs));
    return {
      inputs,
      values,
      targets,
      correct: values.every((value, index) => value === targets[index]),
    };
  });
  return { passed: rows.every((row) => row.correct), rows, nodes: actual };
}

/** NOR RS latch: S=R=1 is forbidden; it is never presented as a valid stored bit. */
export function rsLatch(
  previous: Bit | null,
  set: Bit,
  reset: Bit,
): { q: Bit | null; valid: boolean; message: string } {
  if (set && reset)
    return {
      q: null,
      valid: false,
      message:
        "Verbotener Eingangszustand beim NOR-RS-Speicher. Nach gleichzeitigem Loslassen ist der Folgezustand nicht festgelegt.",
    };
  const q = set ? 1 : reset ? 0 : previous;
  if (q === null)
    return {
      q: null,
      valid: false,
      message:
        "Nach dem verbotenen Zustand ist der Wert noch unbestimmt. Setze oder lösche den Speicher mit einer eindeutigen Eingabe.",
    };
  return {
    q,
    valid: true,
    message: set
      ? "Gesetzt"
      : reset
        ? "Zurückgesetzt"
        : "Gespeicherter Zustand bleibt",
  };
}
