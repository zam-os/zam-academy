import { fmt } from "../exercises/format";
import { solveRatio } from "../math";
import {
  choice,
  choiceField,
  defineLesson,
  numberField,
  range,
  stage,
  task,
  yesNo,
} from "./helpers";

const domain = defineLesson("br-1-definitionsmenge", {
  subtitle: "Nenner null ist verboten – auch nach dem Kürzen",
  whyItMatters:
    "Eine schöne Umformung darf keine Zahlen erlauben, für die der ursprüngliche Bruch gar nicht existiert.",
  explanationHtml: `<p>Ein Bruchterm enthält eine Variable im Nenner. Seine Definitionsmenge besteht aus den Zahlen der Grundmenge, für die kein Nenner null wird. Untersuche immer den <strong>ursprünglichen</strong> Nenner.</p><div class="example">T(x) = (x + 3)/(2x − 8), G = ℚ: 2x − 8 = 0 bei x = 4. Daher D = ℚ ∖ {4}. Der Zähler darf null werden; nur der Nenner ist entscheidend.</div><p>Bei (x − 2)/((x − 2)(x + 1)) kannst du den gemeinsamen Faktor für zulässige x kürzen. Trotzdem bleiben 2 und −1 ausgeschlossen. Summanden darfst du nicht kürzen.</p>`,
  formulas: [
    {
      name: "Nennerbedingung",
      html: "Nenner ≠ 0",
      quantities: "Ausschlüsse bleiben nach jeder erlaubten Umformung erhalten.",
    },
  ],
  quiz: {
    question: "Welche Zahl bleibt bei (x − 2)/(x − 2) nach dem Kürzen ausgeschlossen?",
    options: ["0", "2", "keine"],
    correctIndex: 1,
    explanation:
      "Bei x = 2 stand im ursprünglichen Nenner null. Der gekürzte Ausdruck 1 gilt nur für x ≠ 2.",
  },
  lab: {
    kind: "domain",
    title: "Den ursprünglichen Nenner prüfen",
    intro:
      "Untersuche (x − p)/((x − p)(x − q)). Die markierten Löcher bleiben erhalten, wenn du einen Faktor kürzt.",
    params: [
      range("p", "Ausschluss p", -4, 4, 2),
      range("q", "Ausschluss q", -4, 4, -1),
      range("x", "Prüfwert x", -5, 5, 0, 0.5),
      choice("cancel", "Darstellung", ["ursprünglich", "gekürzt"]),
    ],
    readouts: [
      {
        key: "domain",
        label: "Definitionsmenge über ℚ",
        compute: (v) => `ℚ ohne ${v.p === v.q ? fmt(v.p) : `${fmt(v.p)} und ${fmt(v.q)}`}`,
      },
      {
        key: "valid",
        label: "Prüfwert",
        compute: (v) =>
          v.x === v.p || v.x === v.q
            ? "nicht definiert"
            : `erlaubt; Wert ${fmt(1 / (v.x - v.q), 2)}`,
      },
    ],
    goals: [
      {
        id: "loch",
        text: "Kürze bei p = 2, q = −1 und prüfe x = 2: Die Stelle bleibt verboten.",
        check: (v) => v.p === 2 && v.q === -1 && v.x === 2 && v.cancel === 1,
      },
      {
        id: "nullzaehler",
        text: "Prüfe bei p = 3, q = −2 den zulässigen Wert x = 1 in der ursprünglichen Darstellung.",
        check: (v) => v.p === 3 && v.q === -2 && v.x === 1 && v.cancel === 0,
      },
    ],
  },
  exercises: [
    {
      id: "ausschluesse",
      make: (rng, level) => {
        const p = rng.int(-5, 5),
          q = p + rng.int(1, 5),
          multiplier = rng.int(2, 6);
        if (level === 1)
          return task(
            `Bestimme den Ausschluss für T(x) = (x + 3)/(${multiplier}x − (${fmt(multiplier * p)})) über G = ℚ.`,
            [numberField("verbotenes x =", p, "", 0)],
            [
              `Setze nur den Nenner gleich null: ${multiplier}x − (${fmt(multiplier * p)}) = 0.`,
              `<strong>D = ℚ ohne ${fmt(p)}.</strong>`,
            ],
            "Nenner = 0 lösen, diese Zahl ausschließen.",
            { p, multiplier },
          );
        return task(
          `Ein Rechenprogramm kürzt (x − (${fmt(p)}))/((x − (${fmt(p)}))(x − (${fmt(q)}))). Welche beiden Zahlen bleiben ausgeschlossen? Darf die zuerst gekürzte Stelle später eingesetzt werden?`,
          [
            numberField("erster Ausschluss:", p, "", 0),
            numberField("zweiter Ausschluss:", q, "", 0),
            yesNo("Gekürzte Stelle wieder zulassen?", false),
          ],
          [
            `Der ursprüngliche Nenner wird bei ${fmt(p)} und ${fmt(q)} null.`,
            `<strong>Beide Ausschlüsse bleiben.</strong> Kürzen verändert die Definitionsmenge nicht.`,
          ],
          undefined,
          { p, q },
        );
      },
    },
  ],
});

const ratios = defineLesson("br-2-verhaeltnisgleichungen", {
  subtitle: "Mit erlaubten Nennern multiplizieren und die Probe machen",
  whyItMatters:
    "Verhältnisse führen oft auf Bruchgleichungen; ein rechnerischer Kandidat ist erst nach der Definitionsprüfung eine Lösung.",
  explanationHtml: `<ol><li>Bestimme die Definitionsmenge aus allen Nennern.</li><li>Multipliziere mit dem Hauptnenner. Innerhalb von D ist er nicht null.</li><li>Löse die entstandene lineare Gleichung.</li><li>Prüfe den Kandidaten in D und in der ursprünglichen Gleichung.</li></ol><div class="example">6/(x − 2) = 4/(x + 1): D = ℚ ∖ {−1, 2}. Multiplikation mit (x − 2)(x + 1) liefert 6(x + 1) = 4(x − 2). Daraus folgt x = −7. Probe: Beide Brüche sind −2/3.</div><p>Bei 2/(x − 1) = 3/(x − 1) ergibt die Kreuzmultiplikation den verbotenen Kandidaten x = 1. Die ursprüngliche Gleichung hat keine Lösung.</p>`,
  formulas: [
    {
      name: "Verhältnisgleichung",
      html: "a/(x − p) = b/(x − q) ⇒ a(x − q) = b(x − p)",
      quantities: "nur für x ≠ p und x ≠ q",
    },
  ],
  quiz: {
    question:
      "Nach dem Beseitigen der Nenner erhältst du einen Kandidaten außerhalb von D. Was tust du?",
    options: ["Als Lösung übernehmen.", "Den Ausschluss löschen.", "Den Kandidaten verwerfen."],
    correctIndex: 2,
    explanation: "Ein Wert ohne definierte Ausgangsbrüche kann keine Lösung sein.",
  },
  lab: {
    kind: "rational-equation",
    title: "Kandidat oder Lösung?",
    intro:
      "Untersuche a/(x − p) = b/(x − q). Auch gleiche Nenner oder gleiche Zähler sind möglich.",
    params: [
      range("a", "Zähler a", 1, 6, 3),
      range("b", "Zähler b", 1, 6, 2),
      range("p", "Ausschluss p", -3, 3, 2),
      range("q", "Ausschluss q", -3, 3, -1),
    ],
    readouts: [
      {
        key: "domain",
        label: "Ausgeschlossen",
        compute: (v) => (v.p === v.q ? fmt(v.p) : `${fmt(v.p)} und ${fmt(v.q)}`),
      },
      {
        key: "solution",
        label: "Lösung exakt",
        compute: (v) => {
          const s = solveRatio(v.a, v.p, v.b, v.q);
          return s.kind === "one"
            ? `x = (${v.a * v.q - v.b * v.p})/(${v.a - v.b})`
            : s.kind === "all"
              ? "alle Zahlen aus D"
              : "keine Lösung";
        },
      },
    ],
    goals: [
      {
        id: "loesen",
        text: "Löse 6/(x − 2) = 4/(x + 1).",
        check: (v) => v.a === 6 && v.b === 4 && v.p === 2 && v.q === -1,
      },
      {
        id: "verboten",
        text: "Erzeuge 2/(x − 1) = 3/(x − 1): Der rechnerische Kandidat ist verboten.",
        check: (v) => v.a === 2 && v.b === 3 && v.p === 1 && v.q === 1,
      },
    ],
  },
  exercises: [
    {
      id: "bruchgleichung",
      make: (rng, level) => {
        const a = rng.int(1, 5),
          b = a + rng.int(1, 3),
          p = rng.int(-4, 4),
          q = level === 2 && rng.next() < 0.3 ? p : p + rng.int(1, 4),
          s = solveRatio(a, p, b, q);
        return task(
          `Löse über G = ℚ: ${a}/(x − (${fmt(p)})) = ${b}/(x − (${fmt(q)})). Bestimme die Ausschlüsse vor dem Rechnen.`,
          [
            numberField("Ausschluss aus linkem Nenner:", p, "", 0),
            numberField("Ausschluss aus rechtem Nenner:", q, "", 0),
            choiceField(
              "Lösungsfall",
              ["eine zulässige Lösung", "keine Lösung"],
              s.kind === "one" ? 0 : 1,
            ),
          ],
          [
            `D = ℚ ohne ${p === q ? fmt(p) : `${fmt(p)} und ${fmt(q)}`}.`,
            `${a}(x − (${fmt(q)})) = ${b}(x − (${fmt(p)})).`,
            s.kind === "one"
              ? `<strong>x = ${fmt(s.x, 2)} liegt in D.</strong> Beide Ausgangsbrüche haben denselben Wert ${fmt(a / (s.x - p), 2)}.`
              : `<strong>Keine Lösung.</strong> Der rechnerische Kandidat ist der gemeinsame Ausschluss ${fmt(p)}.`,
          ],
          level === 1
            ? "Mit beiden Nennern multiplizieren, dann linear lösen und D prüfen."
            : undefined,
          { a, b, p, q },
        );
      },
    },
    {
      id: "verhaeltnis-loesen",
      make: (rng, level) => {
        const a = rng.int(1, 5),
          b = a + rng.int(1, 3),
          p = rng.int(-4, 4),
          q = p + rng.int(1, 4);
        const x = (a * q - b * p) / (a - b);
        return task(
          `${level === 1 ? "Löse die Verhältnisgleichung" : "Bestimme den zulässigen Wert im Verhältnis-Modell"}: ${a}/(x − (${fmt(p)})) = ${b}/(x − (${fmt(q)})), G = ℚ. Gib zuerst die Nennerausschlüsse an. Runde erst das Endergebnis, falls nötig, auf zwei Nachkommastellen.`,
          [
            numberField("linker Ausschluss:", p, "", 0),
            numberField("rechter Ausschluss:", q, "", 0),
            numberField("x =", x, "", 2),
          ],
          [
            `D = ℚ ohne ${fmt(p)} und ${fmt(q)}.`,
            `${a}(x − (${fmt(q)})) = ${b}(x − (${fmt(p)})) ⇒ ${a - b}x = ${fmt(a * q - b * p)}.`,
            `<strong>x = ${fmt(x, 2)}${Math.abs(x * 100 - Math.round(x * 100)) > 1e-8 ? " (gerundet)" : ""}.</strong> Der exakte Kandidat ist zulässig und liefert in beiden Ausgangsbrüchen denselben Wert.`,
          ],
          level === 1 ? "Definitionsmenge; Hauptnenner; lineare Gleichung; Probe." : undefined,
          { a, b, p, q },
        );
      },
    },
  ],
});

const formulas = defineLesson("br-3-formeln", {
  subtitle: "Eine gesuchte Größe freistellen",
  whyItMatters:
    "Einheiten und Definitionsbedingungen helfen beim Umstellen von Formeln in Naturwissenschaft und Alltag.",
  explanationHtml: `<p>Bei v = s/t ist t ≠ 0 nötig. Multipliziere mit t: vt = s. Für die Umstellung t = s/v brauchst du zusätzlich v ≠ 0. In einer Weg-Zeit-Aufgabe mit positivem Weg und positiver Geschwindigkeit ist die berechnete Zeit positiv.</p><p>Die Einheiten bleiben Teil der Rechnung: (km)/(km/h) = h. Eine Verdopplung der Geschwindigkeit halbiert bei festem Weg die Zeit; eine Verdopplung des Weges verdoppelt bei fester Geschwindigkeit die Zeit.</p><div class="example">Eine Modellfahrt legt 90 km mit gleichbleibenden 60 km/h zurück: t = 90/60 h = 1,5 h. Das Modell nimmt konstante Geschwindigkeit an und enthält keine Pause.</div>`,
  formulas: [
    {
      name: "Geschwindigkeit",
      html: "v = s/t; s = vt; t = s/v",
      quantities: "t ≠ 0, zum Teilen durch v zusätzlich v ≠ 0",
    },
    {
      name: "Einheiten",
      html: "km / (km/h) = h",
      quantities: "vor dem Rechnen passende Einheiten verwenden",
    },
  ],
  quiz: {
    question: "Welche Zusatzbedingung brauchst du, um aus vt = s die Formel t = s/v zu bilden?",
    options: ["v ≠ 0", "s = 0", "t = 1"],
    correctIndex: 0,
    explanation: "Durch v darf nur geteilt werden, wenn v nicht null ist.",
  },
  lab: {
    kind: "rearrange",
    title: "Gleicher Weg, andere Zeit",
    intro:
      "Vergleiche bei konstantem Weg verschiedene Geschwindigkeiten. Alle Fahrten sind vereinfachte Modelle ohne Pausen.",
    params: [
      range("distance", "Weg s", 30, 240, 90, 15, "km"),
      range("speed", "Geschwindigkeit v", 30, 120, 60, 10, "km/h"),
    ],
    readouts: [
      { key: "time", label: "Zeit t", unit: "h", digits: 2, compute: (v) => v.distance / v.speed },
    ],
    goals: [
      {
        id: "anderthalb",
        text: "Erzeuge eine Fahrt über 120 km mit einer Dauer von 1,5 Stunden.",
        check: (v) => v.distance === 120 && v.speed === 80,
      },
      {
        id: "halbieren",
        text: "Verdopple für 90 km die anfängliche Geschwindigkeit von 60 auf 120 km/h. Die Zeit halbiert sich auf 0,75 h.",
        check: (v) => v.distance === 90 && v.speed === 120,
      },
    ],
  },
  exercises: [
    {
      id: "formel-umstellen",
      make: (rng, level) => {
        const speed = rng.pick([40, 50, 60, 80]),
          time = rng.pick([0.5, 1.5, 2, 2.5]),
          distance = speed * time;
        if (level === 1)
          return task(
            `Eine Modellfahrt hat s = ${distance} km und v = ${speed} km/h. Bestimme t in Stunden.`,
            [numberField("t =", time, "h", 2), yesNo("Darf durch v geteilt werden?", true)],
            [
              `v = s/t ⇒ vt = s ⇒ t = s/v.`,
              `<strong>t = ${distance}/${speed} h = ${fmt(time, 2)} h.</strong> v ist nicht null.`,
            ],
            "t = s/v",
            { speed, time, distance },
          );
        return task(
          `Eine Modellfahrt ohne Pause über ${distance} km soll ${fmt(time / 2, 2)} Stunden dauern. Welche konstante Geschwindigkeit ist erforderlich, und um welchen Faktor ist sie größer als ${speed} km/h?`,
          [numberField("Geschwindigkeit:", speed * 2, "km/h", 0), numberField("Faktor:", 2, "", 0)],
          [
            `v = s/t = ${distance}/${fmt(time / 2, 2)}.`,
            `<strong>v = ${2 * speed} km/h, also Faktor 2.</strong> Bei gleicher Strecke erfordert die halbe Zeit die doppelte Geschwindigkeit.`,
          ],
          undefined,
          { speed, time, distance },
        );
      },
    },
  ],
});

export const STAGE_BRUECHE = stage("bruchgleichungen", [domain, ratios, formulas]);
