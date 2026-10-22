import { fmt } from "../exercises/format";
import { determinant, lineFromPoints } from "../math";
import {
  choice,
  choiceField,
  defineLesson,
  near,
  numberField,
  range,
  stage,
  task,
  yesNo,
} from "./helpers";

export const MAPPINGS = [
  {
    name: "jedes x genau ein y",
    pairs: [
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    valid: true,
  },
  {
    name: "verschiedene x, gleicher Wert",
    pairs: [
      [1, 2],
      [2, 2],
      [3, 1],
    ],
    valid: true,
  },
  {
    name: "ein x mit zwei Werten",
    pairs: [
      [1, 1],
      [1, 2],
      [2, 2],
      [3, 3],
    ],
    valid: false,
  },
  {
    name: "für x = 3 fehlt ein Wert",
    pairs: [
      [1, 1],
      [2, 2],
    ],
    valid: false,
  },
] as const;
export const relationSlopes = [-3, -2, -1, -0.5, 0.5, 1, 2, 3];
export const functionValue = (mode: number, x: number): number =>
  mode === 0 ? x * x : mode === 1 ? 2 * x : 2;

const mapping = defineLesson("fu-1-zuordnungen", {
  subtitle: "Jedem erlaubten Eingang genau einen Wert zuordnen",
  whyItMatters: "Ein Rechenmodell muss eindeutig sagen, welcher Wert zu einer Eingabe gehört.",
  explanationHtml: `<p>Eine Funktion ordnet jedem x der Definitionsmenge D <strong>genau einen</strong> Wert y zu. Verschiedene x dürfen denselben Wert haben. Die Wertemenge W enthält alle tatsächlich angenommenen Funktionswerte.</p><p>Bei D = {1, 2, 3} ist 1 → 4, 2 → 4, 3 → 9 eine Funktion. Zwei Pfeile von 1 zu verschiedenen Werten wären keine Funktion auf D. Auch ein fehlender Pfeil für 3 würde den angegebenen Definitionsbereich nicht erfüllen.</p><p>Bei einem Graphen darf eine senkrechte Gerade über einem erlaubten x genau einen Punkt treffen. Das sagt nichts darüber aus, wie viele x zum gleichen y führen.</p>`,
  formulas: [
    {
      name: "Funktion",
      html: "x ∈ D → genau ein f(x)",
      quantities: "W = Menge der tatsächlich angenommenen Werte",
    },
  ],
  quiz: {
    question: "Dürfen zwei verschiedene x denselben Funktionswert haben?",
    options: ["Ja, das ist erlaubt.", "Nein, dann ist es keine Funktion.", "Nur bei x = 0."],
    correctIndex: 0,
    explanation:
      "Die Eindeutigkeit bezieht sich auf den Wert zu einem festen x, nicht auf verschiedene x.",
  },
  lab: {
    kind: "mapping",
    title: "Pfeile untersuchen",
    intro: "Für alle Baupläne ist D = {1, 2, 3}. Prüfe jeden Eingang einzeln.",
    params: [
      choice(
        "mode",
        "Zuordnung",
        MAPPINGS.map((m) => m.name),
      ),
    ],
    readouts: [
      {
        key: "function",
        label: "Funktion auf D?",
        compute: (v) => (MAPPINGS[v.mode].valid ? "ja" : "nein"),
      },
    ],
    goals: [
      {
        id: "gleicher-wert",
        text: "Finde eine Funktion, bei der verschiedene Eingänge denselben Wert haben.",
        check: (v) => v.mode === 1,
      },
      {
        id: "mehrdeutig",
        text: "Finde den Plan mit zwei verschiedenen Werten für denselben Eingang.",
        check: (v) => v.mode === 2,
      },
    ],
  },
  exercises: [
    {
      id: "eindeutigkeit",
      make: (rng, level) => {
        const mode = rng.int(0, 3),
          shift = rng.int(1, 5),
          entries = MAPPINGS[mode].pairs.map(([x, y]) => `${x} → ${y + shift}`).join(", ");
        return task(
          `${level === 1 ? "Untersuche die Zuordnung" : "Eine Messvorschrift soll zu jeder der drei Einstellungen genau einen angezeigten Wert liefern"}. D = {1, 2, 3}; Einträge: ${entries}.`,
          [
            yesNo("Funktion auf D?", MAPPINGS[mode].valid),
            choiceField(
              "Entscheidender Grund",
              [
                "Zu jedem x steht genau ein y; alle Werte verschieden.",
                "Zu jedem x steht genau ein y; gleiche Werte sind erlaubt.",
                "Zu einem x stehen zwei verschiedene y.",
                "Zu einem x fehlt ein y.",
              ],
              mode,
            ),
          ],
          [
            `Prüfe für jedes x aus D die Zahl der zugeordneten Werte.`,
            `<strong>${MAPPINGS[mode].valid ? "Funktion" : "Keine Funktion auf D"}.</strong> ${MAPPINGS[mode].name}.`,
          ],
          level === 1 ? "Genau ein Wert zu jedem erlaubten Eingang." : undefined,
          { mode, shift },
        );
      },
    },
  ],
});

const representations = defineLesson("fu-2-darstellungen", {
  subtitle: "Dieselbe Funktion in vier Sprachen",
  whyItMatters:
    "Eine Tabelle zeigt konkrete Werte, ein Term die Rechenregel und ein Graph den Zusammenhang.",
  explanationHtml: `<p>Eine Funktion lässt sich in Worten, als Term, als Wertetabelle und als Graph beschreiben. Bei f(x) = x² lautet die Wortregel „Quadriere die Eingabe“. Ein Punkt des Graphen hat die Koordinaten (x|f(x)).</p><p>Die Definitionsmenge gehört zur Angabe. Für D = {−2, −1, 0, 1, 2} ist W = {0, 1, 4}. Der Graph besteht hier aus fünf einzelnen Punkten; du darfst nicht einfach alle Zwischenwerte ergänzen.</p><p>Eine Nullstelle ist ein <strong>x-Wert</strong> mit f(x) = 0. Bei der konstanten Funktion f(x) = 2 gibt es keine Nullstelle; bei f(x) = 0 wären alle erlaubten Eingaben Nullstellen.</p>`,
  formulas: [
    { name: "Funktionswert", html: "y = f(x)", quantities: "Graphenpunkt (x | f(x))" },
    {
      name: "Nullstelle",
      html: "f(x₀) = 0, x₀ ∈ D",
      quantities: "x₀ bezeichnet die Stelle, nicht den y-Wert.",
    },
  ],
  quiz: {
    question: "Welche Wertemenge hat f(x) = x² für D = {−1, 0, 1}?",
    options: ["{−1, 0, 1}", "{0, 1}", "{−1, 1}"],
    correctIndex: 1,
    explanation: "−1 und 1 liefern beide den Wert 1; in einer Menge wird er nur einmal genannt.",
  },
  lab: {
    kind: "representations",
    title: "Term, Tabelle und Punkte",
    intro:
      "D ist die endliche Menge {−2, −1, 0, 1, 2}. Wähle eine Regel und einen hervorgehobenen Punkt.",
    params: [choice("mode", "f(x)", ["x²", "2x", "2"]), range("x", "Eingabe x", -2, 2, 1)],
    readouts: [
      { key: "value", label: "f(x)", compute: (v) => functionValue(v.mode, v.x) },
      {
        key: "range",
        label: "W",
        compute: (v) =>
          `{${[...new Set([-2, -1, 0, 1, 2].map((x) => functionValue(v.mode, x)))]
            .sort((a, b) => a - b)
            .map((x) => fmt(x))
            .join(", ")}}`,
      },
      {
        key: "zeros",
        label: "Nullstellen in D",
        compute: (v) => (v.mode === 2 ? "keine" : "x = 0"),
      },
    ],
    goals: [
      {
        id: "quadrat",
        text: "Markiere bei f(x) = x² den Punkt zu x = −2.",
        check: (v) => v.mode === 0 && v.x === -2,
      },
      {
        id: "konstant",
        text: "Untersuche bei f(x) = 2 die Eingabe x = 0: Sie ist keine Nullstelle.",
        check: (v) => v.mode === 2 && v.x === 0,
      },
    ],
  },
  exercises: [
    {
      id: "darstellungswechsel",
      make: (rng, level) => {
        const mode = rng.int(0, 2),
          x = rng.int(-4, 4),
          names = ["x²", "2x", "2"],
          value = functionValue(mode, x);
        if (level === 1)
          return task(
            `Für f(x) = ${names[mode]} ist x = ${fmt(x)} erlaubt. Berechne den Funktionswert. Ist diese Eingabe eine Nullstelle?`,
            [numberField("f(x) =", value, "", 0), yesNo("Nullstelle?", value === 0)],
            [
              `Setze ${fmt(x)} für x ein.`,
              `<strong>f(${fmt(x)}) = ${fmt(value)}.</strong> ${value === 0 ? "Der Funktionswert ist null: eine Nullstelle." : "Der Funktionswert ist nicht null."}`,
            ],
            "Die Stelle ist x; der Wert ist f(x).",
            { mode, x },
          );
        const n = rng.int(2, 5);
        return task(
          `Eine Tabelle der Regel „Quadriere die Eingabe“ erlaubt genau die ganzen Zahlen von −${n} bis ${n}. Wie viele Eingaben und wie viele verschiedene Ausgaben gibt es? Ist 0 eine Nullstelle?`,
          [
            numberField("Anzahl Eingaben:", 2 * n + 1, "", 0),
            numberField("Anzahl verschiedener Ausgaben:", n + 1, "", 0),
            yesNo("0 ist Nullstelle?", true),
          ],
          [
            `D enthält ${2 * n + 1} Zahlen. Positive und negative Gegenzahlen haben dasselbe Quadrat.`,
            `<strong>W enthält ${n + 1} Werte: 0², 1², …, ${n}².</strong> Die erlaubte Eingabe 0 liefert den Wert 0.`,
          ],
          undefined,
          { n },
        );
      },
    },
  ],
});

const origin = defineLesson("fu-3-ursprungsgeraden", {
  subtitle: "Die Steigung ist Änderung nach oben durch Änderung nach rechts",
  whyItMatters:
    "Bei direkter Proportionalität beschreibt eine einzige Zahl den ganzen Zusammenhang.",
  explanationHtml: `<p>Der Graph von y = mx ist eine Ursprungsgerade. Der Parameter m ist die Steigung. Ein Steigungsdreieck zeigt: m = Δy/Δx mit Δx ≠ 0. Bei m &gt; 0 steigt die Gerade, bei m &lt; 0 fällt sie. Für m = 0 ist sie die x-Achse.</p><p>Zum Zeichnen markierst du den Ursprung und einen zweiten Punkt. Für m = −2/3 gehst du drei Einheiten nach rechts und zwei nach unten. Vom Graphen liest du genau umgekehrt ein Steigungsdreieck ab.</p><div class="example">Ein erfundener Materialpreis von 2,50 € je Meter ergibt K(x) = 2,5x. Er gilt nur im beschriebenen Bereich und ohne Grundpreis.</div>`,
  formulas: [
    {
      name: "Ursprungsgerade",
      html: "y = mx",
      quantities: "m ist die Steigung; der Ursprung liegt auf dem Graphen.",
    },
    {
      name: "Steigungsdreieck",
      html: "m = Δy / Δx",
      quantities: "Δx ≠ 0; Vorzeichen der Änderungen beachten",
    },
  ],
  quiz: {
    question:
      "Ein Steigungsdreieck geht 4 nach rechts und 2 nach unten. Welche Steigung hat die Gerade?",
    options: ["2", "−0,5", "0,5"],
    correctIndex: 1,
    explanation: "Δy/Δx = −2/4 = −0,5.",
  },
  lab: {
    kind: "origin-line",
    title: "Die Steigung anfassen",
    intro:
      "Ziehe den zweiten Punkt oder ändere Δx und Δy. Die Gerade geht immer durch den Ursprung.",
    params: [range("run", "Δx", 1, 5, 3), range("rise", "Δy", -5, 5, 2)],
    readouts: [{ key: "m", label: "m = Δy/Δx", digits: 2, compute: (v) => v.rise / v.run }],
    goals: [
      {
        id: "steigend",
        text: "Zeichne die Steigung 2 mit Δx = 2 und Δy = 4.",
        check: (v) => v.run === 2 && v.rise === 4,
      },
      {
        id: "fallend",
        text: "Zeichne die Steigung −1/2 mit Δx = 4 und Δy = −2.",
        check: (v) => v.run === 4 && v.rise === -2,
      },
    ],
  },
  exercises: [
    {
      id: "steigung",
      make: (rng, level) => {
        const run = rng.int(1, 6),
          rise = rng.int(1, 6) * rng.sign(),
          x = rng.int(2, 9);
        if (level === 1)
          return task(
            `Eine Ursprungsgerade enthält P(${run}|${fmt(rise)}). Bestimme m und den Funktionswert für x = ${x}.`,
            [
              numberField("m =", rise / run, "", 2),
              numberField(`f(${x}) =`, (rise / run) * x, "", 2),
            ],
            [
              `m = ${fmt(rise)}/${run}; f(${x}) = m · ${x}.`,
              `<strong>m = ${fmt(rise / run, 2)}; f(${x}) = ${fmt((rise / run) * x, 2)}.</strong>`,
            ],
            "m = Δy/Δx; y = mx",
            { run, rise, x },
          );
        const price = rng.pick([1.5, 2.5, 3, 4.5]);
        return task(
          `Ohne Grundgebühr kosten ${run} Meter Material ${fmt(run * price, 2)} €. Beschreibe das proportionale Kostenmodell und berechne den Preis für ${x} Meter.`,
          [
            numberField("Steigung / Preis je Meter:", price, "€/m", 2),
            numberField("Preis:", price * x, "€", 2),
          ],
          [
            `Der Quotient Preis/Länge ist ${fmt(run * price, 2)}/${run} = ${fmt(price, 2)}.`,
            `<strong>K(x) = ${fmt(price, 2)}x, Preis ${fmt(price * x, 2)} €.</strong>`,
          ],
          undefined,
          { run, price, x },
        );
      },
    },
  ],
});

const relations = defineLesson("fu-4-geradenlagen", {
  subtitle: "Senkrechte Geraden haben negative Kehrwerte als Steigungen",
  whyItMatters: "Mit der Steigung prüfst du einen rechten Winkel auch ohne Winkelmesser.",
  explanationHtml: `<p>Für zwei nicht achsenparallele Geraden mit Steigungen m₁ und m₂ gilt bei Orthogonalität m₁ · m₂ = −1. Um eine senkrechte Ursprungsgerade zu finden, nimmst du den negativen Kehrwert: Aus 2 wird −1/2, aus −3/4 wird 4/3.</p><p>Das Labor zeigt nur Ursprungsgeraden, wie in Klasse 8 II/III. Gleiche Steigungen liefern dort dieselbe Gerade. Im Zweig I kommen im nächsten Schritt verschobene Geraden hinzu; gleiche Steigungen können dann auch echt parallele Geraden ergeben.</p><p>Die x-Achse und die y-Achse sind ebenfalls senkrecht, aber für die y-Achse gibt es keine endliche Steigung; die Produktregel ist auf dieses Paar nicht anwendbar.</p>`,
  formulas: [
    {
      name: "Orthogonalität",
      html: "m₁ · m₂ = −1; m₂ = −1/m₁",
      quantities: "m₁ ≠ 0; beide Geraden haben eine endliche Steigung.",
    },
  ],
  quiz: {
    question: "Welche Steigung ist senkrecht zu m = −2?",
    options: ["2", "−0,5", "0,5"],
    correctIndex: 2,
    explanation: "Der negative Kehrwert ist +1/2; (−2) · (1/2) = −1.",
  },
  lab: {
    kind: "line-relations",
    title: "Zwei Ursprungsgeraden",
    intro:
      "Wähle die Steigungen und beobachte ihren Schnittwinkel. Das Produkt entscheidet über Orthogonalität.",
    params: [
      choice(
        "first",
        "m₁",
        relationSlopes.map((m) => fmt(m, 1)),
        5,
      ),
      choice(
        "second",
        "m₂",
        relationSlopes.map((m) => fmt(m, 1)),
        6,
      ),
    ],
    readouts: [
      {
        key: "product",
        label: "m₁ · m₂",
        digits: 2,
        compute: (v) => relationSlopes[v.first] * relationSlopes[v.second],
      },
      {
        key: "relation",
        label: "Lage",
        compute: (v) =>
          near(relationSlopes[v.first] * relationSlopes[v.second], -1)
            ? "senkrecht"
            : v.first === v.second
              ? "identisch"
              : "schneidend, nicht senkrecht",
      },
    ],
    goals: [
      {
        id: "zwei",
        text: "Finde die Senkrechte zu m₁ = 2.",
        check: (v) => v.first === 6 && v.second === 3,
      },
      {
        id: "minus-zwei",
        text: "Finde die Senkrechte zu m₁ = −2.",
        check: (v) => v.first === 1 && v.second === 4,
      },
    ],
  },
  exercises: [
    {
      id: "orthogonal",
      make: (rng, level) => {
        const run = rng.int(1, 6),
          rise = rng.int(1, 6) * rng.sign(),
          m = rise / run;
        return task(
          level === 1
            ? `Die Gerade g hat Steigung m = ${fmt(rise)}/${run}. Bestimme die Steigung einer senkrechten Geraden.`
            : `Ein Muster besteht aus Ursprungsgeraden. Eine davon geht durch P(${run}|${fmt(rise)}). Eine zweite soll genau senkrecht dazu verlaufen. Bestimme ihre Steigung und ihren y-Wert bei x = ${Math.abs(rise)}.`,
          [
            numberField("senkrechte Steigung:", -run / rise, "", 2),
            ...(level === 2 ? [numberField("y =", (-run / rise) * Math.abs(rise), "", 0)] : []),
          ],
          [
            `m₁ = ${fmt(m, 2)}; negativer Kehrwert m₂ = −${run}/(${fmt(rise)}).`,
            `<strong>m₂ = ${fmt(-run / rise, 2)}.</strong> Kontrolle: m₁ · m₂ = −1.${level === 2 ? ` Der y-Wert ist ${fmt((-run / rise) * Math.abs(rise))}.` : ""}`,
          ],
          level === 1 ? "m₂ = −1/m₁" : undefined,
          { run, rise },
        );
      },
    },
  ],
});

const intercept = defineLesson("fu-5-achsenabschnitt", {
  subtitle: "Zweig I: Die Gerade muss nicht durch den Ursprung gehen",
  whyItMatters:
    "Ein Startbetrag oder eine Anfangshöhe verschiebt eine Ursprungsgerade nach oben oder unten.",
  explanationHtml: `<p>In y = mx + t beschreibt m die Steigung und t den y-Achsenabschnitt. Die Gerade enthält (0|t). Zeichne zuerst diesen Punkt und dann ein Steigungsdreieck.</p><p>Bei m ≠ 0 erhältst du die Nullstelle aus 0 = mx + t, also x₀ = −t/m. Für m = 0 ist der Graph waagerecht: Bei t ≠ 0 hat er keine Nullstelle, bei t = 0 ist jedes x Nullstelle.</p><p>Eine senkrechte Gerade x = c ist keine Funktion y = f(x) auf der reellen x-Achse: Zu x = c gehören viele y, zu anderen x keine. Waagerechte Geraden y = t sind dagegen Funktionen.</p><div class="example">y = −0,5x + 3 geht durch (0|3). Zwei Schritte nach rechts und ein Schritt nach unten führen zum nächsten Punkt. Die Nullstelle ist x₀ = 6.</div>`,
  formulas: [
    {
      name: "Allgemeine Gerade",
      html: "y = mx + t",
      quantities: "m: Steigung; t: y-Achsenabschnitt",
    },
    { name: "Nullstelle", html: "x₀ = −t/m", quantities: "nur für m ≠ 0" },
  ],
  quiz: {
    question: "Welcher Punkt liegt sicher auf y = 2x − 3?",
    options: ["(0|−3)", "(−3|0)", "(0|2)"],
    correctIndex: 0,
    explanation: "Setze x = 0 ein: y = −3. Der Achsenabschnitt ist eine y-Koordinate.",
  },
  lab: {
    kind: "intercept",
    title: "Steigung und Startwert",
    intro:
      "Wähle eine Funktionsgerade oder die Sonderform x = t. Bei m = 0 untersuchst du die waagerechten Geraden.",
    params: [
      choice("mode", "Gleichungsart", ["y = mx + t", "x = t (senkrecht)"]),
      range("m", "m", -3, 3, 1, 0.5),
      range("t", "t", -4, 4, 2),
    ],
    readouts: [
      {
        key: "type",
        label: "Graph",
        compute: (v) =>
          v.mode === 1
            ? "senkrecht; keine Funktion y = f(x)"
            : v.m === 0
              ? "waagerechte Funktionsgerade"
              : "Funktionsgerade",
      },
      {
        key: "zero",
        label: "Nullstelle der Funktion",
        compute: (v) =>
          v.mode === 1
            ? "nicht anwendbar"
            : v.m === 0
              ? v.t === 0
                ? "jedes reelle x"
                : "keine"
              : `x₀ = ${fmt(-v.t / v.m, 2)}`,
      },
    ],
    goals: [
      {
        id: "waagerecht",
        text: "Zeichne die waagerechte Funktion y = 2.",
        check: (v) => v.mode === 0 && v.m === 0 && v.t === 2,
      },
      {
        id: "senkrecht",
        text: "Zeichne x = 3 und vergleiche: Sie ist keine Funktion y = f(x).",
        check: (v) => v.mode === 1 && v.t === 3,
      },
    ],
  },
  exercises: [
    {
      id: "achse-nullstelle",
      make: (rng, level) => {
        const m = rng.pick([-3, -2, -0.5, 0.5, 2, 3]),
          zero = rng.int(-6, 6),
          t = -m * zero,
          x = rng.int(-4, 4);
        return task(
          level === 1
            ? `Gegeben ist y = ${fmt(m, 1)}x + (${fmt(t, 1)}). Bestimme Achsenabschnitt, Nullstelle und y für x = ${fmt(x)}.`
            : `Ein vereinfachtes Höhenmodell beginnt bei ${fmt(t, 1)} m und ändert sich je Schritt um ${fmt(m, 1)} m. Für diese mathematische Modellgerade sind alle reellen Schritte erlaubt. Bestimme Startwert, Nullstelle und den Wert bei ${fmt(x)} Schritten.`,
          [
            numberField("y-Achsenabschnitt t =", t, "", 2),
            numberField("Nullstelle x₀ =", zero, "", 0),
            numberField("y =", m * x + t, "", 2),
          ],
          [
            `Bei x = 0 ist y = ${fmt(t, 1)}. Für die Nullstelle: ${fmt(m, 1)}x = ${fmt(-t, 1)}.`,
            `<strong>t = ${fmt(t, 1)}, x₀ = ${zero}, y(${fmt(x)}) = ${fmt(m * x + t, 2)}.</strong>`,
          ],
          level === 1 ? "t ablesen; x₀ = −t/m; x einsetzen." : undefined,
          { m, t, zero, x },
        );
      },
    },
  ],
});

const determine = defineLesson("fu-6-geraden-bestimmen", {
  subtitle: "Zwei Punkte oder ein Punkt und die Steigung",
  whyItMatters:
    "Aus Messpunkten entwickelst du ein lineares Modell und prüfst, ob weitere Werte dazu passen.",
  explanationHtml: `<p>Für P(x₁|y₁) und Q(x₂|y₂) mit x₁ ≠ x₂ ist m = (y₂ − y₁)/(x₂ − x₁). Setze einen der Punkte in y = mx + t ein: t = y₁ − mx₁. Bei bekanntem m und einem Punkt genügt der zweite Schritt.</p><p>Gleiche x-Koordinaten und verschiedene y-Koordinaten ergeben eine senkrechte Gerade. Zwei identische Punkte legen noch keine eindeutige Gerade fest.</p><p>Eine Parallelenschar y = mx + t hält m fest und verändert t. Verschiedene t ergeben echt parallele Geraden; gleiches m und t ergeben dieselbe Gerade. Für eine senkrechte Gerade nutzt du die negative Kehrwertsteigung und anschließend den gegebenen Punkt.</p><div class="example">A(2|−1), B(6|7): m = 8/4 = 2; t = −1 − 2 · 2 = −5. Punktprobe P(10|15): 2 · 10 − 5 = 15.</div>`,
  formulas: [
    { name: "Zwei Punkte", html: "m = (y₂ − y₁)/(x₂ − x₁); t = y₁ − mx₁", quantities: "x₂ ≠ x₁" },
  ],
  quiz: {
    question: "Zwei echt parallele Geraden haben …",
    options: [
      "gleiche Steigung und verschiedene y-Achsenabschnitte.",
      "verschiedene Steigungen.",
      "immer dieselbe Gleichung.",
    ],
    correctIndex: 0,
    explanation: "Das gleiche m hält die Richtung fest; verschiedene t verschieben die Geraden.",
  },
  lab: {
    kind: "line-from-points",
    title: "Zwei Punkte bestimmen die Gerade",
    intro:
      "Ziehe P und Q. Prüfe auch, was bei gleichen x-Koordinaten und bei identischen Punkten geschieht.",
    params: [
      range("x1", "P: x", -4, 4, -2),
      range("y1", "P: y", -4, 5, 1),
      range("x2", "Q: x", -4, 4, 3),
      range("y2", "Q: y", -4, 5, 2),
    ],
    readouts: [
      {
        key: "line",
        label: "Gerade",
        compute: (v) => {
          const l = lineFromPoints({ x: v.x1, y: v.y1 }, { x: v.x2, y: v.y2 });
          return l
            ? `y = ${fmt(l.m, 2)}x + (${fmt(l.t, 2)})`
            : v.y1 === v.y2
              ? "identische Punkte: nicht eindeutig"
              : `senkrecht: x = ${v.x1}`;
        },
      },
    ],
    goals: [
      {
        id: "zwei-punkte",
        text: "Bestimme die Gerade durch P(0|1) und Q(2|5).",
        check: (v) => v.x1 === 0 && v.y1 === 1 && v.x2 === 2 && v.y2 === 5,
      },
      {
        id: "vertikal",
        text: "Stelle P(2|1) und Q(2|−3) ein: Die Gerade ist senkrecht.",
        check: (v) => v.x1 === 2 && v.y1 === 1 && v.x2 === 2 && v.y2 === -3,
      },
    ],
  },
  exercises: [
    {
      id: "geradengleichung",
      make: (rng, level) => {
        const m = rng.pick([-3, -2, -1, 1, 2, 3]),
          t = rng.int(-5, 5),
          x1 = rng.int(-4, 2),
          x2 = x1 + rng.int(1, 5),
          y1 = m * x1 + t,
          y2 = m * x2 + t;
        if (level === 1)
          return task(
            `Bestimme y = mx + t durch P(${x1}|${y1}) und Q(${x2}|${y2}).`,
            [numberField("m =", m, "", 0), numberField("t =", t, "", 0)],
            [
              `m = (${y2} − (${y1}))/(${x2} − (${x1})) = ${m}.`,
              `t = ${y1} − ${m} · (${x1}) = ${t}.`,
              `<strong>y = ${m}x + (${t}).</strong> Beide Punkte erfüllen die Gleichung.`,
            ],
            "Differenzenquotient; dann einen Punkt einsetzen.",
            { m, t, x1, x2, y1, y2 },
          );
        const shifted = t + rng.int(1, 5),
          pointY = m * x1 + shifted;
        return task(
          `Zu g: y = ${m}x + (${t}) soll eine echt parallele Gerade durch P(${x1}|${pointY}) gezeichnet werden. Bestimme ihre Parameter.`,
          [
            numberField("m =", m, "", 0),
            numberField("t =", shifted, "", 0),
            yesNo("P liegt auf g?", false),
          ],
          [
            `Parallel bedeutet gleiche Steigung ${m}.`,
            `Punktprobe liefert t = ${pointY} − ${m} · (${x1}) = ${shifted}.`,
            `<strong>y = ${m}x + (${shifted}).</strong> Der andere Achsenabschnitt macht sie echt parallel; P liegt nicht auf g.`,
          ],
          undefined,
          { m, t, shifted, x1, pointY },
        );
      },
    },
  ],
});

const area = defineLesson("fu-7-flaechenmodelle", {
  subtitle: "Zweig I: Modelle deuten und Flächen aus Koordinaten finden",
  whyItMatters:
    "Funktionale Abhängigkeiten verbinden Messwerte, geometrische Figuren und sinnvolle Bereiche.",
  explanationHtml: `<p>Ein lineares Modell beschreibt eine konstante Änderung und einen Anfangswert. Beispielsweise K(x) = 2x + 5 für einen erfundenen Preis mit 5 € Grundbetrag und 2 € je Einheit. Der Kontext legt fest, welche x erlaubt sind; negative Stückzahlen passen hier nicht.</p><p>Für ein Dreieck OAB mit O(0|0), A(u₁|u₂), B(v₁|v₂) berechnet die zweireihige Determinante den orientierten Flächeninhalt des aufgespannten Parallelogramms: det = u₁v₂ − u₂v₁. Der Dreiecksinhalt ist die Hälfte des Betrags. Bei einem anderen Ursprung verwendest du zuerst die Verbindungsvektoren vom gewählten Eckpunkt.</p><div class="example">A(x|0), B(x|8 − x) mit 0 &lt; x &lt; 8: A<sub>Δ</sub>(x) = x(8 − x)/2 = −(x − 4)²/2 + 8. Obwohl B auf einer Geraden liegt, ist die Fläche quadratisch von x abhängig.</div>`,
  formulas: [
    {
      name: "Determinante",
      html: "det(u, v) = u₁v₂ − u₂v₁",
      quantities: "Vorzeichen hängt von der Reihenfolge ab.",
    },
    {
      name: "Dreiecksfläche",
      html: "A<sub>Δ</sub> = |det(u, v)| / 2",
      quantities: "Verbindungsvektoren vom selben Eckpunkt verwenden.",
    },
  ],
  quiz: {
    question: "Was ändert sich beim Vertauschen der beiden Vektoren in der Determinante?",
    options: [
      "Die Dreiecksfläche wird negativ.",
      "Nur das Vorzeichen der Determinante; die Fläche bleibt gleich.",
      "Die Fläche verdoppelt sich.",
    ],
    correctIndex: 1,
    explanation: "Der Betrag der Determinante bleibt gleich. Flächeninhalte sind nicht negativ.",
  },
  lab: {
    kind: "functional-area",
    title: "Punkt auf einer Geraden – veränderliche Fläche",
    intro: "A(x|0) und B(x|8 − x) bewegen sich gemeinsam. Ziehe A entlang der x-Achse.",
    params: [range("x", "x", 1, 7, 2, 0.5)],
    readouts: [
      { key: "height", label: "Höhe 8 − x", compute: (v) => 8 - v.x },
      { key: "det", label: "Determinante", compute: (v) => v.x * (8 - v.x) },
      {
        key: "area",
        label: "Dreiecksfläche",
        emphasis: true,
        compute: (v) => (v.x * (8 - v.x)) / 2,
      },
    ],
    goals: [
      { id: "maximal", text: "Finde die größte Dreiecksfläche.", check: (v) => v.x === 4 },
      {
        id: "spiegelwert",
        text: "Stelle x = 6 ein und vergleiche die Fläche mit der Anfangsstellung x = 2.",
        check: (v) => v.x === 6,
      },
    ],
  },
  exercises: [
    {
      id: "determinante",
      make: (rng, level) => {
        if (level === 1) {
          let ux: number, uy: number, vx: number, vy: number, det: number;
          do {
            ux = rng.int(-5, 5);
            uy = rng.int(-5, 5);
            vx = rng.int(-5, 5);
            vy = rng.int(-5, 5);
            det = determinant({ x: ux, y: uy }, { x: vx, y: vy });
          } while (det === 0);
          return task(
            `Bestimme die Determinante der Vektoren (${ux}|${uy}) und (${vx}|${vy}) sowie die Fläche des Dreiecks, das sie vom Ursprung aus aufspannen.`,
            [
              numberField("Determinante:", det, "", 0),
              numberField("Dreiecksfläche:", Math.abs(det) / 2, "FE", 1),
            ],
            [
              `det = ${ux} · (${vy}) − ${uy} · (${vx}) = ${det}.`,
              `<strong>Dreiecksfläche |${det}|/2 = ${fmt(Math.abs(det) / 2, 1)} FE.</strong>`,
            ],
            "det = u₁v₂ − u₂v₁; Fläche = |det|/2",
            { ux, uy, vx, vy },
          );
        }
        const length = 2 * rng.int(4, 10);
        return task(
          `O(0|0), A(x|0) und B(x|${length} − x) bilden ein Dreieck, 0 < x < ${length}. Für welches x ist die Fläche am größten, und wie groß ist sie?`,
          [
            numberField("x =", length / 2, "", 0),
            numberField("größte Fläche:", (length * length) / 8, "FE", 1),
          ],
          [
            `A(x) = x(${length} − x)/2.`,
            `Quadratische Ergänzung: A(x) = −(x − ${length / 2})²/2 + ${(length * length) / 8}.`,
            `<strong>x = ${length / 2}, Fläche ${fmt((length * length) / 8, 1)} FE.</strong> Die Stelle liegt im erlaubten Bereich.`,
          ],
          undefined,
          { length },
        );
      },
    },
    {
      id: "lineares-modell",
      make: (rng, level) => {
        const base = rng.int(2, 10),
          rate = rng.int(1, 6),
          count = rng.int(3, 12),
          cost = base + rate * count;
        return task(
          level === 1
            ? `Ein erfundener Preis folgt K(x) = ${rate}x + ${base}. Berechne K(${count}) und den Startwert K(0).`
            : `Eine Rechnung enthält ${base} € Grundbetrag und ${rate} € je ausgeliehener Einheit. Für ${cost} € Gesamtbetrag: Wie viele Einheiten sind enthalten? Sind negative Anzahlen im Modell sinnvoll?`,
          level === 1
            ? [numberField("K(x) =", cost, "€", 0), numberField("K(0) =", base, "€", 0)]
            : [numberField("Anzahl:", count, "", 0), yesNo("Negative Anzahlen sinnvoll?", false)],
          [
            `K(x) = ${rate}x + ${base}; der Anfangswert ist ${base}.`,
            `<strong>${level === 1 ? `K(${count}) = ${cost} €` : `x = (${cost} − ${base})/${rate} = ${count}`}.</strong> Hier sind nur nichtnegative ganze Anzahlen sinnvoll.`,
          ],
          level === 1 ? "x in die Kostenfunktion einsetzen." : undefined,
          { base, rate, count, cost },
        );
      },
    },
  ],
});

export const STAGE_FUNKTIONEN = stage("funktionen", [
  mapping,
  representations,
  origin,
  relations,
  intercept,
  determine,
  area,
]);
