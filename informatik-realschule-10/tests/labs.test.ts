import { describe, expect, it } from "vitest";
import {
  EVALUATION,
  gini,
  LEARNING_STARTER,
  learningGoal,
  predict,
  scoreTree,
  TRAINING,
  trainTree,
} from "../src/labs/learning";
import {
  checkLogic,
  evaluateLogic,
  INPUT_ROWS,
  LOGIC_TASKS,
  parseLogic,
  rsLatch,
} from "../src/labs/logic";
import {
  checkNetwork,
  filterPacket,
  NETWORK_CASES,
  type Rule,
  tlsResult,
} from "../src/labs/network";
import {
  OBJECT_TASKS,
  parseClass,
  runtime,
  testObjects,
} from "../src/labs/objects";
import {
  BOARDS,
  checkRobot,
  parseRobot,
  ROBOT_SOLUTION,
  ROBOT_STARTER,
  runRobot,
  thermostat,
} from "../src/labs/robot";

describe("packet filtering and separate TLS trust", () => {
  const rules: Rule[] = [
    { direction: "out", protocol: "TCP", port: 443, action: "allow" },
    { direction: "out", protocol: "UDP", port: 53, action: "allow" },
  ];
  const secure = {
    encrypted: true,
    trusted: true,
    matchesHost: true,
    expired: false,
  };
  it("allows exactly the intended packet cases, including direction and transport", () => {
    const result = checkNetwork(rules, secure);
    expect(result.passed).toBe(true);
    expect(
      result.results
        .slice(0, NETWORK_CASES.length)
        .map((packet) => packet.allowed),
    ).toEqual(NETWORK_CASES.map((packet) => packet.expected));
    expect(checkNetwork([], secure).passed).toBe(false);
  });
  it("rejects extra allowed ports even when all seven demonstration cases match", () => {
    const broad: Rule[] = [
      { direction: "out", protocol: "TCP", port: 80, action: "deny" },
      { direction: "out", protocol: "TCP", port: 53, action: "deny" },
      { direction: "out", protocol: "TCP", port: "any", action: "allow" },
      { direction: "out", protocol: "UDP", port: 53, action: "allow" },
    ];
    expect(checkNetwork(broad, secure).passed).toBe(false);
    for (const port of [22, 123, 65535])
      expect(
        checkNetwork(
          [
            ...rules,
            { direction: "out", protocol: "UDP", port, action: "allow" },
          ],
          secure,
        ).passed,
      ).toBe(false);
  });
  it("honors the first rule rather than preferring a later denial", () => {
    const packet = NETWORK_CASES[3];
    const allow: Rule = {
      direction: "any",
      protocol: "any",
      port: "any",
      action: "allow",
    };
    const deny: Rule = { ...allow, action: "deny" };
    expect(filterPacket(packet, [allow, deny])).toEqual({
      allowed: true,
      rule: 1,
    });
    expect(filterPacket(packet, [deny, allow])).toEqual({
      allowed: false,
      rule: 1,
    });
    expect(filterPacket(packet, [])).toEqual({ allowed: false, rule: null });
  });
  it.each(["encrypted", "trusted", "matchesHost"] as const)(
    "cannot pass with %s missing",
    (key) => {
      expect(checkNetwork(rules, { ...secure, [key]: false }).passed).toBe(
        false,
      );
    },
  );
  it("rejects expired certificates and impossible ports", () => {
    expect(tlsResult({ ...secure, expired: true }).secure).toBe(false);
    expect(() =>
      filterPacket({ ...NETWORK_CASES[0], port: 0 }, rules),
    ).toThrow();
    expect(() =>
      filterPacket({ ...NETWORK_CASES[0], port: 65536 }, rules),
    ).toThrow();
  });
});

describe("Boolean circuits and sequential memory", () => {
  it.each(LOGIC_TASKS)(
    "checks every input for $title and catches the starter error",
    (task) => {
      expect(checkLogic(task.id, [...task.solutions]).passed).toBe(true);
      expect(checkLogic(task.id, [...task.starter]).passed).toBe(false);
    },
  );
  it("agrees with integer addition for every full-adder input", () => {
    const result = checkLogic("logic-adder", [
      "A XOR B XOR C",
      "(A AND B) OR (A AND C) OR (B AND C)",
    ]);
    expect(result.passed).toBe(true);
    for (const row of result.rows)
      expect(row.values[0] + 2 * row.values[1]).toBe(
        row.inputs.A + row.inputs.B + row.inputs.C,
      );
  });
  it("handles inversion, precedence, equivalence and De Morgan for all rows", () => {
    for (const inputs of INPUT_ROWS) {
      expect(evaluateLogic(parseLogic("A NAND B"), inputs)).toBe(
        evaluateLogic(parseLogic("NOT A OR NOT B"), inputs),
      );
      expect(evaluateLogic(parseLogic("A NOR B"), inputs)).toBe(
        evaluateLogic(parseLogic("NOT A AND NOT B"), inputs),
      );
      expect(evaluateLogic(parseLogic("A XNOR B"), inputs)).toBe(
        inputs.A === inputs.B ? 1 : 0,
      );
      expect(evaluateLogic(parseLogic("A OR B AND C"), inputs)).toBe(
        evaluateLogic(parseLogic("A OR (B AND C)"), inputs),
      );
    }
  });
  it.each([
    "A; fetch()",
    "D",
    "A AND",
    "(A OR B",
    "A B",
    `${"NOT ".repeat(30)}A`,
    "A".repeat(601),
  ])("rejects malformed or excessive Boolean text: %s", (source) =>
    expect(() => parseLogic(source)).toThrow(),
  );
  it("does not turn an invalid NOR-RS state into a known stored value", () => {
    expect(rsLatch(0, 1, 0).q).toBe(1);
    expect(rsLatch(1, 0, 0).q).toBe(1);
    const invalid = rsLatch(1, 1, 1);
    expect(invalid).toMatchObject({ q: null, valid: false });
    expect(rsLatch(invalid.q, 0, 0)).toMatchObject({ q: null, valid: false });
    expect(rsLatch(null, 0, 1)).toMatchObject({ q: 0, valid: true });
    expect(rsLatch(null, 1, 0)).toMatchObject({ q: 1, valid: true });
  });
});

describe("bounded object language", () => {
  it.each(OBJECT_TASKS)(
    "executes $title and distinguishes the incorrect starter",
    (task) => {
      expect(testObjects(task.id, task.starter).passed).toBe(false);
      expect(testObjects(task.id, task.solution).passed).toBe(true);
    },
  );
  it("keeps fields independent across instances and respects early return", () => {
    const vm = runtime(
      parseClass(
        "class Beispiel { constructor(start) { this.wert = start; } absolut() { if (this.wert < 0) { return -this.wert; } return this.wert; } }",
      ),
    );
    const a = vm.create([-3]);
    const b = vm.create([7]);
    expect(vm.call(a, "absolut", [])).toBe(3);
    expect(vm.call(b, "absolut", [])).toBe(7);
    expect(a.fields.get("wert")).toBe(-3);
  });
  it("short-circuits conditions rather than reading an unnecessary missing field", () => {
    const vm = runtime(
      parseClass(
        "class Kurz { constructor() { this.wert = 1; } test() { if (false && this.fehlt > 0) { return 2; } return 1; } }",
      ),
    );
    expect(vm.call(vm.create([]), "test", [])).toBe(1);
  });
  it.each([
    "class X { constructor() { this.wert = fetch(1); } }",
    "class X { constructor() { this.__proto__ = 1; } }",
    "class X { constructor() { window.wert = 1; } }",
    "class X { constructor() { this.wert = 1; } } alert(1);",
    "class X { constructor() {} test(a, a) { return 1; } }",
    "class X { constructor(this) {} }",
    "class X { constructor() {} constructor() {} }",
    'class X { constructor() { this.wert = \\"text\\"; } }',
  ])("never executes unsupported source: %s", (source) =>
    expect(() => parseClass(source)).toThrow(),
  );
  it("bounds recursively constructed objects and nested syntax", () => {
    expect(() =>
      runtime(
        parseClass("class X { constructor() { this.kind = new X(); } }"),
      ).create([]),
    ).toThrow(/Objekte|Rechengrenze/);
    const nested = `${"new X(".repeat(30)}0${")".repeat(30)}`;
    expect(() =>
      parseClass(`class X { constructor() { this.wert = ${nested}; } }`),
    ).toThrow(/verschachtelt/);
  });
  it("rejects division by zero, implicit coercion and wrong call arity", () => {
    const vm = runtime(
      parseClass("class X { constructor() {} teilen(a, b) { return a / b; } }"),
    );
    const instance = vm.create([]);
    expect(() => vm.call(instance, "teilen", [1, 0])).toThrow(/null/);
    expect(() => vm.call(instance, "teilen", [true, 2])).toThrow(/Zahl/);
    expect(() => vm.call(instance, "teilen", [1])).toThrow(/Argumente/);
  });
  it("rejects a constant withdrawal limit after the balance changes", () => {
    const bad =
      "class Konto { constructor(start) { this.guthaben = start; } abheben(betrag) { if (betrag > 0 && betrag <= 100) { this.guthaben = this.guthaben - betrag; } } }";
    expect(testObjects("objects-account", bad).passed).toBe(false);
  });
  it("does not accept numerically correct results that mutate the input fractions", () => {
    const bad =
      "class Bruch { constructor(zaehler, nenner) { this.zaehler = zaehler; this.nenner = nenner; } addiere(anderer) { this.zaehler = this.zaehler * anderer.nenner + anderer.zaehler * this.nenner; this.nenner = this.nenner * anderer.nenner; return this; } }";
    expect(testObjects("objects-fraction", bad).passed).toBe(false);
  });
});

describe("robot traces and feedback", () => {
  it("requires a change to the starter for either goal", () => {
    expect(checkRobot(ROBOT_STARTER, "robot-route").passed).toBe(false);
    expect(checkRobot(ROBOT_STARTER, "robot-sensor").passed).toBe(false);
    expect(checkRobot(ROBOT_SOLUTION, "robot-route").passed).toBe(true);
    const fixed = "wiederhole(4) { vor(); } rechts(); wiederhole(4) { vor(); }";
    expect(checkRobot(fixed, "robot-route").passed).toBe(true);
    const result = checkRobot(fixed, "robot-sensor");
    expect(result.passed).toBe(false);
    expect(result.results.some((entry) => entry.collision)).toBe(true);
  });
  it("runs the sensor solution on all three maps and keeps the trace inside the board", () => {
    const result = checkRobot(ROBOT_SOLUTION, "robot-sensor");
    expect(result.passed).toBe(true);
    for (const entry of result.results) {
      expect(entry.trace.at(-1)).toMatchObject({
        x: entry.board.goal[0],
        y: entry.board.goal[1],
      });
      for (const step of entry.trace) {
        expect(step.x).toBeGreaterThanOrEqual(0);
        expect(step.x).toBeLessThan(entry.board.width);
        expect(step.y).toBeGreaterThanOrEqual(0);
        expect(step.y).toBeLessThan(entry.board.height);
      }
    }
  });
  it("stops collisions and bounds a non-progressing nested program", () => {
    expect(
      runRobot(parseRobot("links(); vor(); vor();"), BOARDS[0]).collision,
    ).toBe(true);
    const result = runRobot(
      parseRobot("wiederhole(100) { wiederhole(100) { rechts(); } }"),
      BOARDS[0],
    );
    expect(result.reached).toBe(false);
    expect(result.trace.length).toBeLessThanOrEqual(302);
  });
  it.each([
    "",
    "wiederhole(0) { vor(); }",
    "wiederhole(101) { vor(); }",
    "vor(); }",
    "fetch();",
    "wennFrei { vor(); }",
    "wiederhole(2) { vor();",
  ])("rejects malformed robot instructions: %s", (source) =>
    expect(() => parseRobot(source)).toThrow(),
  );
  it("retains the previous actuator state throughout the hysteresis band", () => {
    expect(thermostat(18, 20, 1, false)).toBe(true);
    expect(thermostat(22, 20, 1, true)).toBe(false);
    for (const temperature of [19, 20, 21]) {
      expect(thermostat(temperature, 20, 1, false)).toBe(false);
      expect(thermostat(temperature, 20, 1, true)).toBe(true);
    }
    expect(() => thermostat(NaN, 20, 1, false)).toThrow();
  });
});

describe("learned classification tree", () => {
  it("starts below the goal and admits a tested correction", () => {
    const start = TRAINING.filter((entry) =>
      LEARNING_STARTER.selected.includes(entry.id),
    );
    expect(
      learningGoal(
        start,
        trainTree(start, LEARNING_STARTER.features, LEARNING_STARTER.depth),
      ),
    ).toBe(false);
    expect(
      learningGoal(TRAINING, trainTree(TRAINING, ["mass", "color"], 1)),
    ).toBe(true);
  });
  it("uses disjoint example records and features for training and comparison", () => {
    const training = new Set(
      TRAINING.map((entry) => `${entry.mass}:${entry.color}`),
    );
    for (const item of EVALUATION)
      expect(training.has(`${item.mass}:${item.color}`)).toBe(false);
  });
  it("learns a useful threshold without access to comparison labels", () => {
    const tree = trainTree(TRAINING, ["mass", "color"], 1);
    expect(tree).toMatchObject({
      kind: "split",
      feature: "mass",
      threshold: 5,
    });
    expect(scoreTree(tree, TRAINING).correct).toBe(11);
    expect(scoreTree(tree, EVALUATION).correct).toBe(6);
    expect(predict(tree, { mass: 2, color: 3 })).toBe(0);
  });
  it("shows the weakness of a deliberately biased training selection", () => {
    const selected = TRAINING.filter((entry) => entry.mass < 5);
    const biased = trainTree(selected, ["mass", "color"], 1);
    expect(scoreTree(biased, EVALUATION).correct).toBeLessThan(
      scoreTree(trainTree(TRAINING, ["mass", "color"], 1), EVALUATION).correct,
    );
  });
  it("selects deterministic majority labels and computes impurity", () => {
    expect(gini(TRAINING.slice(0, 3))).toBe(0);
    expect(
      gini([
        { ...TRAINING[0], label: 0 },
        { ...TRAINING[1], label: 1 },
      ]),
    ).toBe(0.5);
    const tree = trainTree(
      [
        { ...TRAINING[0], label: 0 },
        { ...TRAINING[0], id: "other", label: 1 },
      ],
      ["mass"],
      1,
    );
    expect(tree).toMatchObject({ kind: "leaf", prediction: 0 });
  });
  it("makes complexity experiments reproducible and refuses missing inputs", () => {
    const deep = trainTree(TRAINING, ["mass", "color"], 4);
    expect(scoreTree(deep, TRAINING).correct).toBe(12);
    expect(scoreTree(deep, EVALUATION).correct).toBe(5);
    expect(() => trainTree([], ["mass"], 1)).toThrow();
    expect(() => trainTree(TRAINING, [], 1)).toThrow();
    expect(() => trainTree(TRAINING, ["mass"], 10)).toThrow();
    expect(() =>
      predict(trainTree(TRAINING, ["mass"], 1), { mass: NaN, color: 0 }),
    ).toThrow();
  });
});
