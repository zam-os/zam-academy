import { esc, fmt } from "./html";
import {
  EVALUATION,
  FEATURE_LABEL,
  type Feature,
  LEARNING_STARTER,
  learningGoal,
  scoreTree,
  TRAINING,
  type Tree,
  trainTree,
} from "./labs/learning";
import {
  type Bit,
  checkLogic,
  evaluateLogic,
  type Inputs,
  LOGIC_TASKS,
  type LogicNode,
  logicLabel,
  rsLatch,
} from "./labs/logic";
import {
  checkNetwork,
  NETWORK_STARTER,
  type Rule,
  type TlsSettings,
} from "./labs/network";
import { OBJECT_TASKS, testObjects } from "./labs/objects";
import {
  BOARDS,
  type Board,
  checkRobot,
  ROBOT_SOLUTION,
  ROBOT_STARTER,
  type RobotStep,
  thermostat,
} from "./labs/robot";
import { invalidateLab, type Progress } from "./progress";

export const LABS = [
  {
    id: "network-web",
    module: "netze",
    title: "Webzugang absichern",
    description:
      "Filter und Zertifikatsprüfung mit erwünschten und unerwünschten Verbindungen testen.",
  },
  ...OBJECT_TASKS.map((task) => ({
    id: task.id,
    module: "objekte",
    title: task.title,
    description: task.task,
  })),
  ...LOGIC_TASKS.map((task) => ({
    id: task.id,
    module: "logik",
    title: task.title,
    description: task.task,
  })),
  {
    id: "robot-route",
    module: "robotik",
    title: "Den ersten Hof durchqueren",
    description:
      "Ein eigenes Bewegungsprogramm bis zum Ziel ausführen und seine Spur lesen.",
  },
  {
    id: "robot-sensor",
    module: "robotik",
    title: "Auf Hindernisse reagieren",
    description:
      "Dasselbe Sensorprogramm auf drei unterschiedlichen Höfen prüfen.",
  },
  {
    id: "ki-model",
    module: "ki",
    title: "Einen Entscheidungsbaum trainieren",
    description:
      "Trainingsdaten auswählen, einen Baum lernen und mit getrennten Beispielen vergleichen.",
  },
];
const options = (
  values: readonly string[],
  selected: string,
  labels: readonly string[] = values,
) =>
  values
    .map(
      (value, index) =>
        `<option value="${esc(value)}"${value === selected ? " selected" : ""}>${esc(labels[index])}</option>`,
    )
    .join("");
const feedback = (message: string, passed: boolean) =>
  `<p class="feedback ${passed ? "success" : "warning"}" role="status">${esc(message)}</p>`;
const errorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Die Eingabe konnte nicht geprüft werden.";
function readDraft(progress: Progress, id: string): unknown {
  try {
    return JSON.parse(progress.labDrafts[id] ?? "null");
  } catch {
    return null;
  }
}
const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

export function mountLab(
  host: HTMLElement,
  id: string,
  progress: Progress,
  update: () => void,
): void {
  const lab = LABS.find((entry) => entry.id === id);
  if (!lab) {
    host.innerHTML = feedback("Diese Werkstatt ist nicht vorhanden.", false);
    return;
  }
  const finish = (passed: boolean) => {
    invalidateLab(progress, id);
    if (passed) progress.labs.push(id);
    update();
  };
  const dirty = (draft: unknown, raw = false) => {
    progress.labDrafts[id] = raw
      ? String(draft).slice(0, 12000)
      : JSON.stringify(draft);
    invalidateLab(progress, id);
    const result = host.querySelector<HTMLElement>("#lab-result");
    if (result) result.innerHTML = "";
    update();
  };
  if (id === "network-web")
    mountNetwork(host, readDraft(progress, id), dirty, finish);
  else if (id.startsWith("objects-"))
    mountObjects(host, id, progress.labDrafts[id], dirty, finish);
  else if (id.startsWith("logic-"))
    mountLogic(host, id, readDraft(progress, id), dirty, finish);
  else if (id.startsWith("robot-"))
    mountRobot(
      host,
      id as "robot-route" | "robot-sensor",
      progress.labDrafts[id],
      dirty,
      finish,
    );
  else mountLearning(host, readDraft(progress, id), dirty, finish);
}

type Dirty = (draft: unknown, raw?: boolean) => void;
type Finish = (passed: boolean) => void;

function mountNetwork(
  host: HTMLElement,
  raw: unknown,
  dirty: Dirty,
  finish: Finish,
): void {
  interface RuleDraft {
    direction: string;
    protocol: string;
    port: string;
    action: string;
  }
  const data = record(raw);
  let rules: RuleDraft[] =
    Array.isArray(data.rules) && data.rules.length <= 8
      ? data.rules.map((value) => {
          const row = record(value);
          return {
            direction: ["in", "out", "any"].includes(String(row.direction))
              ? String(row.direction)
              : "out",
            protocol: ["TCP", "UDP", "any"].includes(String(row.protocol))
              ? String(row.protocol)
              : "TCP",
            port: typeof row.port === "string" ? row.port.slice(0, 5) : "443",
            action: row.action === "deny" ? "deny" : "allow",
          };
        })
      : NETWORK_STARTER.map((rule) => ({ ...rule, port: String(rule.port) }));
  const savedTls = record(data.tls);
  const tls: TlsSettings = {
    encrypted: savedTls.encrypted !== false,
    trusted: savedTls.trusted !== false,
    matchesHost: savedTls.matchesHost === true,
    expired: savedTls.expired === true,
  };
  const save = () => dirty({ rules, tls });
  const render = () => {
    host.innerHTML = `<p class="task">Prüfe die Anfragepakete einer eingeschränkten Freigabe: Erlaube nur ausgehendes TCP 443 und UDP 53. Sperre in dieser Übung alles andere. Prüfe die TLS-Eigenschaften getrennt; der Filter simuliert keinen vollständigen Verbindungsaufbau.</p><p>Die erste passende Regel entscheidet. Ohne Treffer: <strong>abweisen</strong>. Portfeld: eine Zahl von 1 bis 65535 oder „any“.</p><div class="table-scroll"><table class="rule-table"><thead><tr><th>Nr.</th><th>Richtung</th><th>Protokoll</th><th>Zielport</th><th>Aktion</th><th>Reihenfolge</th></tr></thead><tbody>${rules.map((rule, index) => `<tr data-rule="${index}"><td>${index + 1}</td><td><select data-field="direction" aria-label="Richtung Regel ${index + 1}">${options(["out", "in", "any"], rule.direction, ["ausgehend", "eingehend", "beide"])}</select></td><td><select data-field="protocol" aria-label="Protokoll Regel ${index + 1}">${options(["TCP", "UDP", "any"], rule.protocol, ["TCP", "UDP", "alle"])}</select></td><td><input data-field="port" aria-label="Zielport Regel ${index + 1}" value="${esc(rule.port)}" maxlength="5" size="5" /></td><td><select data-field="action" aria-label="Aktion Regel ${index + 1}">${options(["allow", "deny"], rule.action, ["erlauben", "abweisen"])}</select></td><td class="rule-actions"><button data-up="${index}" aria-label="Regel ${index + 1} nach oben" ${index === 0 ? "disabled" : ""}>↑</button><button data-down="${index}" aria-label="Regel ${index + 1} nach unten" ${index === rules.length - 1 ? "disabled" : ""}>↓</button><button data-remove="${index}" aria-label="Regel ${index + 1} entfernen">×</button></td></tr>`).join("")}</tbody></table></div><button class="button secondary" id="add-rule" ${rules.length >= 8 ? "disabled" : ""}>Regel hinzufügen</button><fieldset class="tls"><legend>Geschützte Verbindung prüfen</legend>${(
      [
        ["encrypted", "Verschlüsselte Verbindung"],
        ["trusted", "Vertrauenswürdige Zertifikatskette"],
        ["matchesHost", "Zertifikat passt zum Hostnamen"],
        ["expired", "Zertifikat ist abgelaufen"],
      ] as const
    )
      .map(
        ([key, label]) =>
          `<label><input type="checkbox" data-tls="${key}" ${tls[key] ? "checked" : ""}>${label}</label>`,
      )
      .join(
        "",
      )}</fieldset><button class="button" id="run-network">Alle Verbindungen prüfen</button><div id="lab-result" aria-live="polite"></div><p class="limit">Zustandsloses Paketmodell: Der Auftrag bildet nur die Freigabe von Anfragepaketen ab. Auch mögliche Antworten an Clientports werden gesperrt; so kommt keine nutzbare Verbindung zustande. Der Filter kennt nur Richtung, Protokoll und Zielport und kann Antworten nicht von anderen eingehenden Paketen unterscheiden. Für echte Verbindungen braucht es passende Rückverkehrsregeln oder Zustandsverfolgung. Die TLS-Schalter beschreiben davon getrennte Eigenschaften, keinen ausgeführten Handshake. Kein vollständiger DNS-Dienst, kein TLS-Handshake, keine Prüfung von Webinhalten. DNS kann in der Praxis auch TCP benötigen; der Auftrag erlaubt hier bewusst nur UDP 53.</p>`;
    host
      .querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-field]")
      .forEach((input) => {
        input.addEventListener("input", () => {
          const index = Number(
            input.closest<HTMLElement>("[data-rule]")!.dataset.rule,
          );
          rules[index][input.dataset.field as keyof RuleDraft] = input.value;
          save();
        });
      });
    host.querySelectorAll<HTMLInputElement>("[data-tls]").forEach((input) => {
      input.addEventListener("change", () => {
        tls[input.dataset.tls as keyof TlsSettings] = input.checked;
        save();
      });
    });
    host
      .querySelectorAll<HTMLButtonElement>(
        "[data-up], [data-down], [data-remove]",
      )
      .forEach((button) => {
        button.addEventListener("click", () => {
          const index = Number(
            button.dataset.up ?? button.dataset.down ?? button.dataset.remove,
          );
          if (button.dataset.remove !== undefined)
            rules = rules.filter((_, position) => position !== index);
          else {
            const target = index + (button.dataset.up !== undefined ? -1 : 1);
            [rules[index], rules[target]] = [rules[target], rules[index]];
          }
          save();
          render();
        });
      });
    host.querySelector("#add-rule")!.addEventListener("click", () => {
      rules.push({
        direction: "out",
        protocol: "TCP",
        port: "443",
        action: "allow",
      });
      save();
      render();
    });
    host.querySelector("#run-network")!.addEventListener("click", () => {
      const resultHost = host.querySelector("#lab-result")!;
      try {
        const parsed = rules.map((rule): Rule => {
          if (
            rule.port !== "any" &&
            (!/^\d+$/.test(rule.port) ||
              Number(rule.port) < 1 ||
              Number(rule.port) > 65535)
          )
            throw new Error(
              "Jede Regel braucht einen Port von 1 bis 65535 oder any.",
            );
          return {
            direction: rule.direction as Rule["direction"],
            protocol: rule.protocol as Rule["protocol"],
            port: rule.port === "any" ? "any" : Number(rule.port),
            action: rule.action as Rule["action"],
          };
        });
        const result = checkNetwork(parsed, tls);
        finish(result.passed);
        resultHost.innerHTML =
          feedback(
            result.passed
              ? "Auftrag erfüllt: erwünschte und unerwünschte Fälle stimmen, die Gegenstelle ist im Modell geprüft."
              : "Noch nicht alle Bedingungen stimmen. Vergleiche die Fälle und die Zertifikatsprüfung.",
            result.passed,
          ) +
          `<div class="table-scroll"><table><thead><tr><th>Test</th><th>Erwartet</th><th>Beobachtet</th><th>Regel</th></tr></thead><tbody>${result.results.map((entry) => `<tr class="${entry.correct ? "ok" : "bad"}"><td>${esc(entry.label)}<small>${entry.direction === "out" ? "aus" : "ein"} · ${entry.protocol} ${entry.port}</small></td><td>${entry.expected ? "erlauben" : "abweisen"}</td><td>${entry.allowed ? "erlaubt" : "abgewiesen"} ${entry.correct ? "✓" : "✗"}</td><td>${entry.rule ?? "Standard"}</td></tr>`).join("")}</tbody></table></div>` +
          feedback(result.tls.message, result.tls.secure);
      } catch (error) {
        finish(false);
        resultHost.innerHTML = feedback(errorMessage(error), false);
      }
    });
  };
  render();
}

function mountObjects(
  host: HTMLElement,
  id: string,
  draft: string | undefined,
  dirty: Dirty,
  finish: Finish,
): void {
  const task = OBJECT_TASKS.find((entry) => entry.id === id)!;
  host.innerHTML = `<p class="task">${esc(task.task)}</p><label class="field-label" for="object-code">Deine Klasse</label><textarea id="object-code" class="code" spellcheck="false" maxlength="12000" rows="14">${esc(draft ?? task.starter)}</textarea><div class="actions"><button class="button" id="run-objects">Programm testen</button><details><summary>Musterlösung ansehen</summary><pre>${esc(task.solution)}</pre><p>Verändere den Code selbst und führe die Tests erneut aus.</p></details></div><div id="lab-result" aria-live="polite"></div><details class="syntax"><summary>Was die Werkstattsprache kann</summary><p>Eine Klasse mit constructor und Methoden; Parameter, Zahlen, true/false, this.attribute und parameter.attribute; Zuweisung, return, if/else, + − * / %, Vergleiche mit === und !==, &amp;&amp; und ||, sowie new für die eigene Klasse. Jede Zuweisung und Rückgabe endet mit Semikolon. Klammern um if-Bedingungen sind nötig. Kommentare: // oder /* … */.</p><p>Keine Texte, Arrays, Schleifen, lokalen Variablen, freien Funktionen oder Methodenaufrufe im Programm. Die Testumgebung erzeugt Objekte und ruft Methoden auf. Attribute sind hier öffentlich; Invariantenprüfung ist keine technische Privatsphäre.</p></details><p class="limit">Begrenzter JavaScript-Ausschnitt mit eigenem Interpreter, keine vollständige Entwicklungsumgebung. 12.000 Zeichen, 2.000 Rechenschritte und höchstens 60 neue Objekte pro Testlauf. Beispieltests beweisen keine allgemeine Korrektheit.</p>`;
  const editor = host.querySelector<HTMLTextAreaElement>("#object-code")!;
  editor.addEventListener("input", () => dirty(editor.value, true));
  host.querySelector("#run-objects")!.addEventListener("click", () => {
    const resultHost = host.querySelector("#lab-result")!;
    try {
      dirty(editor.value, true);
      const result = testObjects(id, editor.value);
      finish(result.passed);
      resultHost.innerHTML =
        feedback(
          result.passed
            ? "Alle Beispieltests bestanden. Prüfe zusätzlich eigene Fälle und begründe die Lösung."
            : "Mindestens ein Test zeigt eine Abweichung. Vergleiche Soll und Ist.",
          result.passed,
        ) +
        `<div class="object-model"><strong>${esc(result.model.name)}</strong><span>${esc([...result.model.methods].map(([name, method]) => `${name}(${method.params.join(", ")})`).join(" · "))}</span></div><ul class="test-list">${result.tests.map((test) => `<li class="${test.passed ? "ok" : "bad"}"><strong>${test.passed ? "✓" : "✗"} ${esc(test.label)}</strong><span>Beobachtet: ${esc(test.actual)}</span></li>`).join("")}</ul>`;
    } catch (error) {
      finish(false);
      resultHost.innerHTML = feedback(errorMessage(error), false);
    }
  });
}

function circuit(node: LogicNode, inputs: Inputs): string {
  const label =
    node.kind === "input"
      ? node.name
      : node.kind === "not"
        ? "NICHT"
        : logicLabel(node.gate);
  const children =
    node.kind === "input"
      ? ""
      : node.kind === "not"
        ? circuit(node.child, inputs)
        : circuit(node.left, inputs) + circuit(node.right, inputs);
  return `<li><span class="gate ${evaluateLogic(node, inputs) ? "on" : ""}">${esc(label)} <b>${evaluateLogic(node, inputs)}</b></span>${children ? `<ul>${children}</ul>` : ""}</li>`;
}

function mountLogic(
  host: HTMLElement,
  id: string,
  raw: unknown,
  dirty: Dirty,
  finish: Finish,
): void {
  const task = LOGIC_TASKS.find((entry) => entry.id === id)!;
  const data = record(raw);
  const saved = Array.isArray(data.terms) ? data.terms : [];
  const terms = task.starter.map((starter, index) =>
    typeof saved[index] === "string"
      ? String(saved[index]).slice(0, 600)
      : starter,
  );
  host.innerHTML = `<p class="task">${esc(task.task)}</p><p>Erlaubt: A, B, C, NICHT, UND, ODER, XOR, NAND, NOR, XNOR und Klammern. NOT, AND und OR funktionieren auch als englische Schreibweisen. Klammern machen zusammengesetzte Verknüpfungen eindeutig.</p>${task.outputs.map((output, index) => `<label class="field-label" for="term-${index}">Term für ${esc(output)}</label><input id="term-${index}" class="term" data-term="${index}" value="${esc(terms[index])}" maxlength="600" spellcheck="false">`).join("")}<button class="button" id="run-logic">Alle Eingangskombinationen prüfen</button><div id="lab-result" aria-live="polite"></div><details class="extra"><summary>NOR-RS-Speicher ausprobieren</summary><p>Startzustand Q = 0. S setzt, R löscht; 00 hält. 11 ist verboten.</p><div class="actions"><label><input id="rs-set" type="checkbox">S</label><label><input id="rs-reset" type="checkbox">R</label></div><output id="rs-value">Q = 0 · Anfangszustand</output></details><p class="limit">Ideale Bits ohne elektrische Pegel, Laufzeiten oder Kontaktprellen. Der Gatterbaum zeigt die logische Verknüpfung; ein vollständiger normgerechter Schaltplan bleibt eine zusätzliche Zeichenaufgabe.</p>`;
  host.querySelectorAll<HTMLInputElement>("[data-term]").forEach((input) => {
    input.addEventListener("input", () => {
      terms[Number(input.dataset.term)] = input.value;
      dirty({ terms });
    });
  });
  host.querySelector("#run-logic")!.addEventListener("click", () => {
    const resultHost = host.querySelector("#lab-result")!;
    try {
      const result = checkLogic(id, terms);
      finish(result.passed);
      resultHost.innerHTML =
        feedback(
          result.passed
            ? "Alle acht Belegungen stimmen mit dem Auftrag überein."
            : "Die markierten Belegungen zeigen noch einen Unterschied zum Auftrag.",
          result.passed,
        ) +
        `<div class="table-scroll"><table><thead><tr><th>A</th><th>B</th><th>C</th>${task.outputs.map((output) => `<th>${esc(output)} · Ist / Soll</th>`).join("")}</tr></thead><tbody>${result.rows.map((row) => `<tr class="${row.correct ? "ok" : "bad"}"><td>${row.inputs.A}</td><td>${row.inputs.B}</td><td>${row.inputs.C}</td>${row.values.map((value, index) => `<td>${value} / ${row.targets[index]} ${value === row.targets[index] ? "✓" : "✗"}</td>`).join("")}</tr>`).join("")}</tbody></table></div><h3>Dein Gatterbaum</h3><p>Wähle die Eingänge und verfolge die Werte bis zum Ausgang.</p><div id="logic-inputs" class="actions">${["A", "B", "C"].map((name) => `<label><input type="checkbox" data-bit="${name}">${name}</label>`).join("")}</div><div id="circuit"></div>`;
      const inputs: Inputs = { A: 0, B: 0, C: 0 };
      const renderCircuit = () => {
        resultHost.querySelector("#circuit")!.innerHTML = result.nodes
          .map(
            (node, index) =>
              `<h4>${esc(task.outputs[index])}</h4><ul class="circuit-tree">${circuit(node, inputs)}</ul>`,
          )
          .join("");
      };
      resultHost
        .querySelectorAll<HTMLInputElement>("[data-bit]")
        .forEach((input) => {
          input.addEventListener("change", () => {
            inputs[input.dataset.bit as keyof Inputs] = input.checked ? 1 : 0;
            renderCircuit();
          });
        });
      renderCircuit();
    } catch (error) {
      finish(false);
      resultHost.innerHTML = feedback(errorMessage(error), false);
    }
  });
  let q: Bit | null = 0;
  const latch = () => {
    const result = rsLatch(
      q,
      host.querySelector<HTMLInputElement>("#rs-set")!.checked ? 1 : 0,
      host.querySelector<HTMLInputElement>("#rs-reset")!.checked ? 1 : 0,
    );
    q = result.q;
    host.querySelector("#rs-value")!.textContent =
      `Q = ${q ?? "unbestimmt"} · ${result.message}`;
  };
  host.querySelector("#rs-set")!.addEventListener("change", latch);
  host.querySelector("#rs-reset")!.addEventListener("change", latch);
}

function boardView(board: Board, step: RobotStep): string {
  return `<table class="robot-board" aria-label="${esc(board.title)}. Pfeil zeigt die Blickrichtung."><tbody>${Array.from(
    { length: board.height },
    (_, y) =>
      `<tr>${Array.from({ length: board.width }, (_, x) => {
        const robot = step.x === x && step.y === y;
        const wall = board.walls.some(([wx, wy]) => wx === x && wy === y);
        const goal = board.goal[0] === x && board.goal[1] === y;
        return `<td class="${wall ? "wall" : goal ? "goal" : ""}" aria-label="Spalte ${x + 1}, Zeile ${y + 1}${wall ? ", Hindernis" : ""}${goal ? ", Ziel" : ""}${robot ? `, Roboter Richtung ${["Nord", "Ost", "Süd", "West"][step.direction]}` : ""}">${robot ? `<span class="robot">${["↑", "→", "↓", "←"][step.direction]}</span>` : wall ? "■" : goal ? "Ziel" : "·"}</td>`;
      }).join("")}</tr>`,
  ).join("")}</tbody></table>`;
}

function mountRobot(
  host: HTMLElement,
  id: "robot-route" | "robot-sensor",
  draft: string | undefined,
  dirty: Dirty,
  finish: Finish,
): void {
  host.innerHTML = `<p class="task">${id === "robot-route" ? "Erreiche das Ziel im freien Hof. Der Roboter startet links unten und blickt nach Norden." : "Schreibe ein Programm, das auf allen drei Höfen ohne Kollision das Ziel erreicht. Nutze den Freisensor vor der Bewegung und reagiere auf eine blockierte Front mit einem anderen Bewegungsweg."}</p><div class="robot-layout"><div><label class="field-label" for="robot-code">Dein Roboterprogramm</label><textarea id="robot-code" class="code" spellcheck="false" rows="13" maxlength="6000">${esc(draft ?? ROBOT_STARTER)}</textarea><button class="button" id="run-robot">${id === "robot-route" ? "Hof testen" : "Alle drei Höfe testen"}</button></div><div id="robot-preview">${boardView(BOARDS[0], { x: 0, y: 4, direction: 0, action: "Start", clear: true })}</div></div><details><summary>Befehle und Lösungsansatz</summary><p>vor(); links(); rechts(); wiederhole(4) { … }; eine Wiederholung endet mit der schließenden Klammer ohne Semikolon. Bedingungen: wennFrei { … } sonst { … }. // beginnt einen Kommentar. Das ist eine eigene Werkstattsprache.</p><p>Für die Sensoraufgabe: Prüfe vor jedem Vorwärtsschritt, ob der Weg frei ist. Drehe sonst nach rechts.</p><pre>${esc(ROBOT_SOLUTION)}</pre><p>Die Strategie ist für die drei Übungshöfe geeignet. Sie findet nicht in jedem Labyrinth einen Weg.</p></details><div id="lab-result" aria-live="polite"></div><details class="extra"><summary>Rückkopplung am Modellthermostat</summary><p>Sollwert 20, Hystereseband 1. Unter 19 ein, über 21 aus. Im Zwischenbereich bleibt der vorherige Zustand erhalten.</p><label for="temperature">Isttemperatur <output id="temperature-label">18</output></label><input id="temperature" type="range" min="16" max="24" step="0.5" value="18"><output id="heating">Heizung an</output></details><p class="limit">Rastermodell mit idealem Freisensor, ohne echte Hardware, Sensorstreuung, Radschlupf oder Heizphysik. Zielkontakt beendet den Lauf automatisch. Höchstens 1.500 Anweisungen und 300 Bewegungen. Montage und reale Erprobung bleiben eigene Aufgaben.</p>`;
  const editor = host.querySelector<HTMLTextAreaElement>("#robot-code")!;
  editor.addEventListener("input", () => {
    dirty(editor.value, true);
    host.querySelector("#robot-preview")!.innerHTML =
      "<p>Programm geändert. Führe die Höfe erneut aus, um eine aktuelle Spur zu sehen.</p>";
  });
  host.querySelector("#run-robot")!.addEventListener("click", () => {
    const resultHost = host.querySelector("#lab-result")!;
    try {
      dirty(editor.value, true);
      const result = checkRobot(editor.value, id);
      finish(result.passed);
      resultHost.innerHTML =
        feedback(
          result.passed
            ? "Alle geforderten Höfe erreicht. Vergleiche die Spur und benenne die Grenzen deiner Strategie."
            : result.results.every((entry) => entry.reached)
              ? "Alle Ziele erreicht, aber der Freisensor verändert den Bewegungsweg noch nicht. Ein fester Weg oder gleiche Aktionen in beiden Zweigen erfüllen die Sensoraufgabe nicht."
              : "Mindestens ein Hof ist noch nicht geschafft. Wähle ihn aus und verfolge die erste Abweichung.",
          result.passed,
        ) +
        `<div class="actions">${result.results.map((entry, index) => `<button class="button secondary" data-board="${index}">${entry.reached ? "✓" : "✗"} ${esc(entry.board.title)}</button>`).join("")}</div><div id="trace-view"></div>`;
      const select = (index: number) => {
        const entry = result.results[index];
        const trace = resultHost.querySelector("#trace-view")!;
        trace.innerHTML = `<h3>${esc(entry.board.title)}</h3><p>${esc(entry.message)}</p><label for="robot-step">Ablaufspur · Schritt <output id="step-number">0</output> von ${entry.trace.length - 1}</label><input id="robot-step" type="range" min="0" max="${entry.trace.length - 1}" value="0"><p id="step-info"></p>`;
        const renderStep = (at: number) => {
          const step = entry.trace[at];
          host.querySelector("#robot-preview")!.innerHTML = boardView(
            entry.board,
            step,
          );
          trace.querySelector("#step-number")!.textContent = String(at);
          trace.querySelector("#step-info")!.textContent =
            `${step.action} · Position (${step.x}, ${step.y}) · Blick ${["Nord", "Ost", "Süd", "West"][step.direction]} · Front danach ${step.clear ? "frei" : "blockiert"}`;
        };
        trace
          .querySelector<HTMLInputElement>("#robot-step")!
          .addEventListener("input", (event) =>
            renderStep(Number((event.target as HTMLInputElement).value)),
          );
        renderStep(0);
      };
      resultHost
        .querySelectorAll<HTMLButtonElement>("[data-board]")
        .forEach((button) => {
          button.addEventListener("click", () =>
            select(Number(button.dataset.board)),
          );
        });
      select(0);
    } catch (error) {
      finish(false);
      resultHost.innerHTML = feedback(errorMessage(error), false);
    }
  });
  let on = true;
  host
    .querySelector<HTMLInputElement>("#temperature")!
    .addEventListener("input", (event) => {
      const value = Number((event.target as HTMLInputElement).value);
      on = thermostat(value, 20, 1, on);
      host.querySelector("#temperature-label")!.textContent = fmt(value);
      host.querySelector("#heating")!.textContent =
        `Heizung ${on ? "an" : "aus"}`;
    });
}

function treeView(tree: Tree): string {
  if (tree.kind === "leaf")
    return `<li><span class="tree-leaf">Klasse ${tree.prediction ? "B" : "A"}<small>${tree.samples} Beispiele · A:${tree.counts[0]} / B:${tree.counts[1]}</small></span></li>`;
  return `<li><span>${FEATURE_LABEL[tree.feature]} ≤ ${fmt(tree.threshold)}<small>${tree.samples} Beispiele</small></span><ul><li><b>Ja</b><ul>${treeView(tree.left)}</ul></li><li><b>Nein</b><ul>${treeView(tree.right)}</ul></li></ul></li>`;
}

function mountLearning(
  host: HTMLElement,
  raw: unknown,
  dirty: Dirty,
  finish: Finish,
): void {
  const data = record(raw);
  let selected = Array.isArray(data.selected)
    ? TRAINING.filter((entry) =>
        (data.selected as unknown[]).includes(entry.id),
      ).map((entry) => entry.id)
    : [...LEARNING_STARTER.selected];
  let features: Feature[] = Array.isArray(data.features)
    ? (["mass", "color"] as const).filter((feature) =>
        (data.features as unknown[]).includes(feature),
      )
    : ["mass", "color"];
  let depth =
    Number.isInteger(data.depth) &&
    Number(data.depth) >= 1 &&
    Number(data.depth) <= 4
      ? Number(data.depth)
      : 1;
  const comparisons: string[] = [];
  const save = () => dirty({ selected, features, depth });
  const render = () => {
    host.innerHTML = `<p class="task">Lerne aus mindestens sechs Beispielen mit beiden Klassen einen Baum. Erreiche mindestens fünf von sechs richtigen Vorhersagen auf den getrennten Vergleichsbeispielen. Diese Grenze gehört nur zur Übungsaufgabe.</p><p>Alle Objekte und Zahlen sind erfunden. Die Klassen A und B beschreiben keine Menschen oder wirklichen Früchte.</p><div class="actions"><button class="button secondary" id="all-data">Alle Trainingsbeispiele</button><button class="button secondary" id="biased-data">Nur leichte Objekte</button></div><div class="table-scroll"><table><thead><tr><th>Training</th><th>Massewert</th><th>Farbwert</th><th>Klasse</th></tr></thead><tbody>${TRAINING.map((entry) => `<tr><td><label><input type="checkbox" data-example="${entry.id}" ${selected.includes(entry.id) ? "checked" : ""}>${entry.id}</label></td><td>${fmt(entry.mass)}</td><td>${fmt(entry.color)}</td><td>${entry.label ? "B" : "A"}</td></tr>`).join("")}</tbody></table></div><fieldset><legend>Merkmale und Modellgröße</legend><div class="actions">${(["mass", "color"] as const).map((feature) => `<label><input type="checkbox" data-feature="${feature}" ${features.includes(feature) ? "checked" : ""}>${FEATURE_LABEL[feature]}</label>`).join("")}<label>Maximale Baumtiefe <select id="tree-depth">${options(["1", "2", "3", "4"], String(depth))}</select></label></div></fieldset><button class="button" id="run-learning">Baum lernen und vergleichen</button><div id="lab-result" aria-live="polite"></div><div id="comparisons"></div><p class="limit">Der kleine Baum lernt lokal mit Gini-Unreinheit. Vergleichsdaten werden nicht zum Trainieren benutzt. Wenn du die Ergebnisse wiederholt zur Modellwahl nutzt, werden sie zu Validierungsdaten. Ein unabhängiger Abschlusstest braucht frische Daten. Die kleine Übung ist keine Einsatzfreigabe und keine vollständige Fairnessprüfung.</p>`;
    host
      .querySelectorAll<HTMLInputElement>("[data-example]")
      .forEach((input) => {
        input.addEventListener("change", () => {
          const value = input.dataset.example!;
          selected = input.checked
            ? [...selected, value]
            : selected.filter((id) => id !== value);
          save();
        });
      });
    host
      .querySelectorAll<HTMLInputElement>("[data-feature]")
      .forEach((input) => {
        input.addEventListener("change", () => {
          const feature = input.dataset.feature as Feature;
          features = input.checked
            ? [...features, feature]
            : features.filter((value) => value !== feature);
          save();
        });
      });
    host
      .querySelector<HTMLSelectElement>("#tree-depth")!
      .addEventListener("change", (event) => {
        depth = Number((event.target as HTMLSelectElement).value);
        save();
      });
    host.querySelector("#all-data")!.addEventListener("click", () => {
      selected = TRAINING.map((entry) => entry.id);
      save();
      render();
    });
    host.querySelector("#biased-data")!.addEventListener("click", () => {
      selected = TRAINING.filter((entry) => entry.mass < 5).map(
        (entry) => entry.id,
      );
      save();
      render();
    });
    host.querySelector("#run-learning")!.addEventListener("click", () => {
      const resultHost = host.querySelector("#lab-result")!;
      try {
        const examples = TRAINING.filter((entry) =>
          selected.includes(entry.id),
        );
        const tree = trainTree(examples, features, depth);
        const training = scoreTree(tree, examples);
        const validation = scoreTree(tree, EVALUATION);
        const passed = learningGoal(examples, tree);
        finish(passed);
        resultHost.innerHTML =
          feedback(
            passed
              ? "Übungsziel erreicht. Vergleiche jetzt eine einseitige Auswahl und eine größere Baumtiefe."
              : "Das Übungsziel ist noch nicht erreicht. Prüfe Datenauswahl, Merkmale und Ergebnis für neue Beispiele.",
            passed,
          ) +
          `<div class="metrics"><div><strong>${training.correct}/${training.total}</strong><span>Training · bekannte Beispiele</span></div><div><strong>${validation.correct}/${validation.total}</strong><span>Getrennter Vergleich</span></div></div><h3>Dein gelernter Baum</h3><ul class="learned-tree">${treeView(tree)}</ul><h3>Getrennte Vergleichsbeispiele</h3><div class="table-scroll"><table><thead><tr><th>Beispiel</th><th>Masse</th><th>Farbe</th><th>Soll</th><th>Vorhersage</th></tr></thead><tbody>${validation.results.map((entry) => `<tr class="${entry.prediction === entry.label ? "ok" : "bad"}"><td>${entry.id}</td><td>${fmt(entry.mass)}</td><td>${fmt(entry.color)}</td><td>${entry.label ? "B" : "A"}</td><td>${entry.prediction ? "B" : "A"} ${entry.prediction === entry.label ? "✓" : "✗"}</td></tr>`).join("")}</tbody></table></div>`;
        comparisons.unshift(
          `${examples.length} Beispiele · ${features.map((feature) => FEATURE_LABEL[feature]).join(", ")} · Tiefe ${depth} → Training ${training.correct}/${training.total}, Vergleich ${validation.correct}/${validation.total}`,
        );
        comparisons.splice(5);
        renderComparisons();
      } catch (error) {
        finish(false);
        resultHost.innerHTML = feedback(errorMessage(error), false);
      }
    });
    renderComparisons();
  };
  const renderComparisons = () => {
    host.querySelector("#comparisons")!.innerHTML = comparisons.length
      ? `<h3>Deine letzten Vergleichsläufe</h3><ul>${comparisons.map((text) => `<li>${esc(text)}</li>`).join("")}</ul><p>Gibt es eine Lücke zwischen Training und Vergleich? Welche Fälle fehlen bei der einseitigen Auswahl?</p>`
      : "";
  };
  render();
}
