import { fmt } from "../html";

// A deliberately small class language. It parses and interprets its own AST;
// learner text never reaches eval, Function, a script element or native property lookup.
type Expr =
  | { kind: "number"; value: number }
  | { kind: "name"; name: string }
  | { kind: "field"; object: string; field: string }
  | { kind: "unary"; op: string; child: Expr }
  | { kind: "binary"; op: string; left: Expr; right: Expr }
  | { kind: "new"; name: string; args: Expr[] };
type Statement =
  | { kind: "assign"; field: string; value: Expr }
  | { kind: "return"; value: Expr }
  | { kind: "if"; test: Expr; yes: Statement[]; no: Statement[] };
interface Method {
  params: string[];
  body: Statement[];
}
export interface ClassModel {
  name: string;
  methods: Map<string, Method>;
}
export interface Instance {
  className: string;
  fields: Map<string, Value>;
}
type Value = number | boolean | Instance;
const forbidden = new Set([
  "__proto__",
  "prototype",
  "eval",
  "Function",
  "window",
  "globalThis",
  "fetch",
]);
const priorities: Record<string, number> = {
  "||": 1,
  "&&": 2,
  "===": 3,
  "!==": 3,
  "<": 4,
  ">": 4,
  "<=": 4,
  ">=": 4,
  "+": 5,
  "-": 5,
  "*": 6,
  "/": 6,
  "%": 6,
};

export function parseClass(source: string): ClassModel {
  if (source.length > 12000)
    throw new Error("Höchstens 12.000 Zeichen pro Programm.");
  const pattern =
    /\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/|\d+(?:\.\d+)?|[A-Za-z_][A-Za-z_0-9]*|===|!==|<=|>=|&&|\|\||[{}().,;=+*/%<>!-]/gy;
  const tokens: string[] = [];
  let cursor = 0;
  while (cursor < source.length) {
    pattern.lastIndex = cursor;
    const match = pattern.exec(source);
    if (!match)
      throw new Error(
        `Unbekanntes Zeichen bei Position ${cursor + 1}. Texte, Arrays und frei aufrufbare Funktionen gehören nicht zu dieser Werkstattsprache.`,
      );
    cursor = pattern.lastIndex;
    if (!/^\s|^\/\//.test(match[0]) && !match[0].startsWith("/*"))
      tokens.push(match[0]);
  }
  let at = 0;
  let nodes = 0;
  const take = () => tokens[at++];
  const expect = (token: string) => {
    if (take() !== token)
      throw new Error(`Erwartet: ${token} (nahe Wort ${at}).`);
  };
  const identifier = () => {
    const word = take();
    if (!word || !/^[A-Za-z_][A-Za-z_0-9]*$/.test(word) || forbidden.has(word))
      throw new Error("Hier ist ein einfacher, erlaubter Bezeichner nötig.");
    return word;
  };
  function args(depth: number): Expr[] {
    const result: Expr[] = [];
    expect("(");
    if (tokens[at] !== ")") {
      do {
        if (result.length >= 6) throw new Error("Höchstens sechs Argumente.");
        result.push(expression(0, depth + 1));
      } while (tokens[at] === "," && take());
    }
    expect(")");
    return result;
  }
  function expression(min = 0, depth = 0): Expr {
    if (++nodes > 1000 || depth > 20)
      throw new Error("Das Programm ist zu groß oder zu tief verschachtelt.");
    const token = take();
    let left: Expr;
    if (token === "-" || token === "!")
      left = { kind: "unary", op: token, child: expression(7, depth + 1) };
    else if (token === "(") {
      left = expression(0, depth + 1);
      expect(")");
    } else if (token && /^\d/.test(token))
      left = { kind: "number", value: Number(token) };
    else if (token === "new") {
      const name = identifier();
      left = { kind: "new", name, args: args(depth + 1) };
    } else {
      at--;
      const name = identifier();
      if (tokens[at] === ".") {
        take();
        left = { kind: "field", object: name, field: identifier() };
      } else left = { kind: "name", name };
    }
    while (at < tokens.length) {
      const op = tokens[at];
      const priority = priorities[op];
      if (priority === undefined || priority < min) break;
      take();
      left = {
        kind: "binary",
        op,
        left,
        right: expression(priority + 1, depth + 1),
      };
    }
    return left;
  }
  function block(depth = 0): Statement[] {
    if (depth > 12) throw new Error("Zu viele verschachtelte Blöcke.");
    const body: Statement[] = [];
    expect("{");
    while (tokens[at] !== "}") {
      if (at >= tokens.length || body.length > 60)
        throw new Error("Ein Block endet nicht oder ist zu groß.");
      if (tokens[at] === "return") {
        take();
        body.push({ kind: "return", value: expression() });
        expect(";");
      } else if (tokens[at] === "if") {
        take();
        expect("(");
        const test = expression();
        expect(")");
        const yes = block(depth + 1);
        let no: Statement[] = [];
        if (tokens[at] === "else") {
          take();
          no = block(depth + 1);
        }
        body.push({ kind: "if", test, yes, no });
      } else {
        expect("this");
        expect(".");
        const field = identifier();
        expect("=");
        body.push({ kind: "assign", field, value: expression() });
        expect(";");
      }
    }
    expect("}");
    return body;
  }
  expect("class");
  const name = identifier();
  expect("{");
  const methods = new Map<string, Method>();
  while (tokens[at] !== "}") {
    if (at >= tokens.length || methods.size > 12)
      throw new Error("Die Klasse endet nicht oder hat zu viele Methoden.");
    const method = identifier();
    if (methods.has(method))
      throw new Error(`Die Methode ${method} ist doppelt definiert.`);
    expect("(");
    const params: string[] = [];
    if (tokens[at] !== ")") {
      do {
        if (params.length >= 6) throw new Error("Höchstens sechs Parameter.");
        const param = identifier();
        if (["this", "true", "false"].includes(param))
          throw new Error("Dieser Parametername ist reserviert.");
        params.push(param);
      } while (tokens[at] === "," && take());
    }
    if (new Set(params).size !== params.length)
      throw new Error("Parameternamen müssen verschieden sein.");
    expect(")");
    methods.set(method, { params, body: block() });
  }
  expect("}");
  if (at !== tokens.length)
    throw new Error(
      "Schreibe genau eine Klasse. Aufrufe übernimmt der Testbereich.",
    );
  if (!methods.has("constructor"))
    throw new Error(
      "Die Klasse braucht in dieser Werkstatt einen constructor.",
    );
  return { name, methods };
}

export function runtime(model: ClassModel) {
  let steps = 0;
  let allocations = 0;
  const tick = () => {
    if (++steps > 2000)
      throw new Error("Rechengrenze erreicht. Vereinfache das Programm.");
  };
  const numeric = (value: Value): number => {
    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      Math.abs(value) > 1e9
    )
      throw new Error(
        "Hier ist eine endliche Zahl im Lernbereich bis eine Milliarde nötig.",
      );
    return value;
  };
  const logical = (value: Value): boolean => {
    if (typeof value !== "boolean")
      throw new Error(
        "Eine Bedingung muss hier ausdrücklich wahr oder falsch sein.",
      );
    return value;
  };
  function evaluate(
    expr: Expr,
    scope: Map<string, Value>,
    depth: number,
  ): Value {
    tick();
    if (depth > 20) throw new Error("Zu viele verschachtelte Objekte.");
    if (expr.kind === "number") return numeric(expr.value);
    if (expr.kind === "name") {
      if (expr.name === "true" || expr.name === "false")
        return expr.name === "true";
      const value = scope.get(expr.name);
      if (value === undefined)
        throw new Error(`Unbekannter Name: ${expr.name}.`);
      return value;
    }
    if (expr.kind === "field") {
      const object = scope.get(expr.object);
      if (!object || typeof object !== "object")
        throw new Error(`${expr.object} ist kein Objekt.`);
      const value = object.fields.get(expr.field);
      if (value === undefined)
        throw new Error(`Das Attribut ${expr.field} wurde nicht angelegt.`);
      return value;
    }
    if (expr.kind === "new") {
      if (expr.name !== model.name)
        throw new Error("new kann nur die eigene Klasse erzeugen.");
      return create(
        expr.args.map((arg) => evaluate(arg, scope, depth + 1)),
        depth + 1,
      );
    }
    if (expr.kind === "unary") {
      const value = evaluate(expr.child, scope, depth + 1);
      return expr.op === "!" ? !logical(value) : numeric(-numeric(value));
    }
    const left = evaluate(expr.left, scope, depth + 1);
    if (expr.op === "&&")
      return logical(left) && logical(evaluate(expr.right, scope, depth + 1));
    if (expr.op === "||")
      return logical(left) || logical(evaluate(expr.right, scope, depth + 1));
    const right = evaluate(expr.right, scope, depth + 1);
    switch (expr.op) {
      case "===":
        return left === right;
      case "!==":
        return left !== right;
      case "<":
        return numeric(left) < numeric(right);
      case ">":
        return numeric(left) > numeric(right);
      case "<=":
        return numeric(left) <= numeric(right);
      case ">=":
        return numeric(left) >= numeric(right);
      case "+":
        return numeric(numeric(left) + numeric(right));
      case "-":
        return numeric(numeric(left) - numeric(right));
      case "*":
        return numeric(numeric(left) * numeric(right));
      case "/":
        if (numeric(right) === 0) throw new Error("Division durch null.");
        return numeric(numeric(left) / numeric(right));
      case "%":
        if (numeric(right) === 0) throw new Error("Restbildung durch null.");
        return numeric(numeric(left) % numeric(right));
      default:
        throw new Error("Unbekannter Operator.");
    }
  }
  function execute(
    body: Statement[],
    scope: Map<string, Value>,
    self: Instance,
    depth: number,
  ): { value?: Value; returned: boolean } {
    for (const statement of body) {
      tick();
      if (statement.kind === "assign")
        self.fields.set(
          statement.field,
          evaluate(statement.value, scope, depth + 1),
        );
      else if (statement.kind === "return")
        return {
          returned: true,
          value: evaluate(statement.value, scope, depth + 1),
        };
      else {
        const branch = logical(evaluate(statement.test, scope, depth + 1))
          ? statement.yes
          : statement.no;
        const result = execute(branch, scope, self, depth + 1);
        if (result.returned) return result;
      }
    }
    return { returned: false };
  }
  function call(
    self: Instance,
    methodName: string,
    args: Value[],
    depth = 0,
  ): Value | undefined {
    tick();
    const method = model.methods.get(methodName);
    if (!method) throw new Error(`Methode ${methodName} fehlt.`);
    if (method.params.length !== args.length)
      throw new Error(
        `${methodName} braucht ${method.params.length} Argumente.`,
      );
    const scope = new Map<string, Value>([
      ["this", self],
      ...method.params.map(
        (name, index) => [name, args[index]] as [string, Value],
      ),
    ]);
    return execute(method.body, scope, self, depth).value;
  }
  function create(args: Value[], depth = 0): Instance {
    if (++allocations > 60 || depth > 20)
      throw new Error("Zu viele neue Objekte.");
    const self: Instance = { className: model.name, fields: new Map() };
    if (call(self, "constructor", args, depth) !== undefined)
      throw new Error("Der constructor soll hier keinen Rückgabewert haben.");
    return self;
  }
  return { create, call };
}

export const OBJECT_TASKS = [
  {
    id: "objects-counter",
    name: "Zaehler",
    title: "Zwei unabhängige Zähler",
    task: "Implementiere addiere(schritt), sodass der bisherige Wert um schritt steigt. Eine zweite Instanz darf sich dabei nicht ändern.",
    starter:
      "class Zaehler {\n  constructor(start) {\n    this.wert = start;\n  }\n  addiere(schritt) {\n    this.wert = schritt;\n  }\n}",
    solution:
      "class Zaehler {\n  constructor(start) { this.wert = start; }\n  addiere(schritt) { this.wert = this.wert + schritt; }\n}",
  },
  {
    id: "objects-account",
    name: "Konto",
    title: "Zustand schützen",
    task: "abheben(betrag) verändert guthaben nur bei einem positiven Betrag, der nicht größer als das Guthaben ist. Alle anderen Aufrufe lassen den Zustand unverändert.",
    starter:
      "class Konto {\n  constructor(start) { this.guthaben = start; }\n  abheben(betrag) {\n    this.guthaben = this.guthaben - betrag;\n  }\n}",
    solution:
      "class Konto {\n  constructor(start) { this.guthaben = start; }\n  abheben(betrag) {\n    if (betrag > 0 && betrag <= this.guthaben) {\n      this.guthaben = this.guthaben - betrag;\n    }\n  }\n}",
  },
  {
    id: "objects-fraction",
    name: "Bruch",
    title: "Brüche als Objekte",
    task: "addiere(anderer) gibt einen neuen Bruch mit dem korrekten Summenwert zurück. Beide Ausgangsbrüche bleiben unverändert. Die Testnenner sind positiv; Kürzen ist nicht verlangt.",
    starter:
      "class Bruch {\n  constructor(zaehler, nenner) {\n    this.zaehler = zaehler;\n    this.nenner = nenner;\n  }\n  addiere(anderer) {\n    return new Bruch(this.zaehler + anderer.zaehler, this.nenner + anderer.nenner);\n  }\n}",
    solution:
      "class Bruch {\n  constructor(zaehler, nenner) {\n    this.zaehler = zaehler;\n    this.nenner = nenner;\n  }\n  addiere(anderer) {\n    return new Bruch(\n      this.zaehler * anderer.nenner + anderer.zaehler * this.nenner,\n      this.nenner * anderer.nenner\n    );\n  }\n}",
  },
] as const;

export function testObjects(
  taskId: string,
  source: string,
): {
  passed: boolean;
  tests: { label: string; passed: boolean; actual: string }[];
  model: ClassModel;
} {
  const task = OBJECT_TASKS.find((entry) => entry.id === taskId);
  if (!task) throw new Error("Unbekannte Objektaufgabe.");
  const model = parseClass(source);
  if (model.name !== task.name)
    throw new Error(`Die Klasse muss ${task.name} heißen.`);
  const vm = runtime(model);
  const tests: { label: string; passed: boolean; actual: string }[] = [];
  if (taskId === "objects-counter") {
    const first = vm.create([10]);
    const other = vm.create([1]);
    vm.call(first, "addiere", [3]);
    tests.push({
      label: "10 plus 3 ergibt 13",
      passed: first.fields.get("wert") === 13,
      actual: observed(first.fields.get("wert")),
    });
    vm.call(first, "addiere", [2]);
    tests.push({
      label: "Noch einmal plus 2 ergibt 15",
      passed: first.fields.get("wert") === 15,
      actual: observed(first.fields.get("wert")),
    });
    tests.push({
      label: "Zweite Instanz bleibt bei 1",
      passed: other.fields.get("wert") === 1,
      actual: observed(other.fields.get("wert")),
    });
    const zero = vm.create([0]);
    vm.call(zero, "addiere", [-2]);
    tests.push({
      label: "Auch negative Schritte: 0 plus −2",
      passed: zero.fields.get("wert") === -2,
      actual: observed(zero.fields.get("wert")),
    });
  } else if (taskId === "objects-account") {
    for (const amount of [30, 101, -10, 0, 100]) {
      const account = vm.create([100]);
      vm.call(account, "abheben", [amount]);
      const expected = amount > 0 && amount <= 100 ? 100 - amount : 100;
      tests.push({
        label: `100 Guthaben, Aufruf mit ${fmt(amount)}: erwartet ${fmt(expected)}`,
        passed: account.fields.get("guthaben") === expected,
        actual: observed(account.fields.get("guthaben")),
      });
    }
    for (const start of [45, 150]) {
      const account = vm.create([start]);
      let balance = start;
      for (const amount of [30, 30, 70, 1, -5, 0]) {
        if (amount > 0 && amount <= balance) balance -= amount;
        vm.call(account, "abheben", [amount]);
        tests.push({
          label: `Start ${fmt(start)}, nächster Aufruf ${fmt(amount)}: erwartet ${fmt(balance)}`,
          passed: account.fields.get("guthaben") === balance,
          actual: observed(account.fields.get("guthaben")),
        });
      }
    }
  } else {
    for (const [a, b, c, d] of [
      [1, 2, 1, 3],
      [2, 5, 1, 5],
      [-1, 4, 1, 4],
      [0, 3, 2, 7],
      [3, 2, -1, 6],
    ]) {
      const left = vm.create([a, b]);
      const right = vm.create([c, d]);
      const result = vm.call(left, "addiere", [right]);
      const n =
        typeof result === "object" ? result.fields.get("zaehler") : undefined;
      const denominator =
        typeof result === "object" ? result.fields.get("nenner") : undefined;
      const valid =
        typeof n === "number" &&
        typeof denominator === "number" &&
        denominator !== 0 &&
        n * b * d === (a * d + c * b) * denominator;
      const unchanged =
        left.fields.get("zaehler") === a &&
        left.fields.get("nenner") === b &&
        right.fields.get("zaehler") === c &&
        right.fields.get("nenner") === d;
      tests.push({
        label: `${fmt(a)}/${fmt(b)} plus ${fmt(c)}/${fmt(d)}; neuer Bruch, Ausgangswerte erhalten`,
        passed: valid && unchanged && result !== left && result !== right,
        actual:
          n === undefined
            ? "Kein Ergebnisbruch"
            : `${observed(n)}/${observed(denominator)}${unchanged ? "" : " · Ausgangswert verändert"}`,
      });
    }
  }
  return { passed: tests.every((entry) => entry.passed), tests, model };
}

function observed(value: unknown): string {
  return typeof value === "number" ? fmt(value) : String(value);
}
