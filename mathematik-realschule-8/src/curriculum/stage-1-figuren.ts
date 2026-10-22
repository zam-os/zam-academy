import { fmt } from "../exercises/format";
import { QUADS, QUAD_FACTS, triangleExists } from "../math";
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

export const CONGRUENCE_CASES = [
  {
    label: "SSS",
    given: "Drei Seiten: 5 cm, 6 cm, 7 cm",
    certain: true,
    reason: "Drei zulässige Seiten legen die Form bis auf Spiegelung eindeutig fest.",
  },
  {
    label: "SWS",
    given: "Zwei Seiten: 5 cm, 7 cm; eingeschlossener Winkel: 50°",
    certain: true,
    reason: "Der gegebene Winkel liegt zwischen den beiden gegebenen Seiten.",
  },
  {
    label: "WSW",
    given: "Eine Seite: 6 cm; die beiden anliegenden Winkel: 45° und 65°",
    certain: true,
    reason: "Mit der Winkelsumme ist auch der dritte Winkel festgelegt.",
  },
  {
    label: "SsW",
    given: "Seiten: 7 cm und 5 cm; Winkel gegenüber der längeren Seite: 70°",
    certain: true,
    reason: "Beim SsW-Satz muss der gegebene Winkel der längeren gegebenen Seite gegenüberliegen.",
  },
  {
    label: "ssW, mehrdeutig",
    given: "Seiten: 5 cm und 7 cm; Winkel gegenüber der kürzeren Seite: 30°",
    certain: false,
    reason:
      "Hier sind zwei nicht kongruente Dreiecke möglich: Der Kreis schneidet den Strahl zweimal.",
  },
  {
    label: "WWW",
    given: "Drei Winkel: 40°, 60°, 80°",
    certain: false,
    reason: "Die Winkel legen keine Größe fest. Verschieden große Dreiecke haben diese Winkel.",
  },
] as const;

const existence = defineLesson("dv-1-dreiecksungleichung", {
  subtitle: "Drei Stäbe müssen sich schließen lassen",
  whyItMatters: "Vor einer Konstruktion prüfst du, ob die Angaben überhaupt ein Dreieck erlauben.",
  explanationHtml: `<p>In einem echten Dreieck ist jede Seite kürzer als die Summe der beiden anderen. Sortiere die Seiten: Es genügt, die längste gegen die Summe der beiden kürzeren zu prüfen. Gleichheit ergibt eine gerade Strecke, kein Dreieck.</p><p>Außerdem gilt: Der längeren Seite liegt der größere Winkel gegenüber. Gleich lange Seiten haben gleich große Gegenwinkel.</p><div class="example">3 cm, 4 cm, 7 cm: 3 + 4 = 7, also kein Dreieck. 3 cm, 4 cm, 6 cm: 3 + 4 &gt; 6, also möglich.</div>`,
  formulas: [
    {
      name: "Dreiecksungleichung",
      html: "a + b &gt; c, a + c &gt; b, b + c &gt; a",
      quantities: "a, b, c sind positive Seitenlängen",
    },
  ],
  quiz: {
    question: "Können Seiten der Länge 2 cm, 3 cm und 5 cm ein echtes Dreieck bilden?",
    options: [
      "Ja, weil 2 + 3 = 5.",
      "Nein, sie liegen nur auf einer Geraden.",
      "Nur mit einem rechten Winkel.",
    ],
    correctIndex: 1,
    explanation: "Die Summe muss strikt größer sein; Gleichheit reicht nicht.",
  },
  lab: {
    kind: "triangle-existence",
    title: "Schließen sich die Stäbe?",
    intro: "Verändere die drei Seiten. Die Kreise zeigen, ob sich ein Eckpunkt finden lässt.",
    params: [
      range("a", "Seite a", 1, 10, 3, 0.5, "cm"),
      range("b", "Seite b", 1, 10, 4, 0.5, "cm"),
      range("c", "Seite c", 1, 12, 9, 0.5, "cm"),
    ],
    readouts: [
      {
        key: "possible",
        label: "Dreieck",
        compute: (v) => (triangleExists(v.a, v.b, v.c) ? "möglich" : "nicht möglich"),
      },
      {
        key: "margin",
        label: "Summe der kürzeren minus längste Seite",
        unit: "cm",
        compute: (v) => v.a + v.b + v.c - 2 * Math.max(v.a, v.b, v.c),
      },
    ],
    goals: [
      {
        id: "geschlossen",
        text: "Baue das Dreieck mit a = 5 cm, b = 6 cm, c = 7 cm.",
        check: (v) => v.a === 5 && v.b === 6 && v.c === 7,
      },
      {
        id: "grenzfall",
        text: "Erzeuge den Grenzfall: Die längste Seite ist die Summe der beiden anderen.",
        check: (v) => near(v.a + v.b + v.c, 2 * Math.max(v.a, v.b, v.c)),
      },
    ],
  },
  exercises: [
    {
      id: "existenz",
      make: (rng, level) => {
        const a = rng.int(3, 8),
          b = a + rng.int(1, 4),
          c = rng.pick([b - a, a + b, a + b - 1, a + b + 1]);
        if (level === 1)
          return task(
            `Sind ${a} cm, ${b} cm und ${c} cm als Dreiecksseiten möglich?`,
            [
              yesNo("Echtes Dreieck?", triangleExists(a, b, c)),
              numberField("Summe der zwei kürzesten:", a + b + c - Math.max(a, b, c), "cm", 0),
            ],
            [
              `Sortiere die Seiten; vergleiche die längste Seite mit der Summe der beiden anderen.`,
              `<strong>${triangleExists(a, b, c) ? "Möglich" : "Nicht möglich"}</strong>, denn die Summe ist ${triangleExists(a, b, c) ? "größer" : "nicht größer"} als die längste Seite.`,
            ],
            "Längste Seite < Summe der beiden anderen",
            { a, b, c },
          );
        return task(
          `Zwei Stäbe sind ${a} cm und ${b} cm lang. Der dritte soll eine ganze Zentimeterzahl haben. Bestimme die kleinste und die größte mögliche Länge für ein echtes Dreieck.`,
          [
            numberField("kleinste Länge:", b - a + 1, "cm", 0),
            numberField("größte Länge:", a + b - 1, "cm", 0),
            choiceField(
              "Größter Winkel gegenüber",
              ["der längsten Seite", "der kürzesten Seite"],
              0,
            ),
          ],
          [
            `Die dritte Länge muss größer als ${b - a} und kleiner als ${a + b} sein.`,
            `<strong>Von ${b - a + 1} cm bis ${a + b - 1} cm.</strong> Der größten Seite liegt der größte Winkel gegenüber.`,
          ],
          undefined,
          { a, b },
        );
      },
    },
  ],
});

const construction = defineLesson("dv-2-dreieckskonstruktion", {
  subtitle: "Planen, zeichnen, beschreiben und kontrollieren",
  whyItMatters:
    "Ein Bauplan muss alle Angaben verwenden. Eine passende Skizze zeigt, welche Kreise oder Winkel du brauchst.",
  explanationHtml: `<p><strong>SSS:</strong> Zeichne AB = c. Zeichne um A einen Kreis mit Radius b und um B einen Kreis mit Radius a. Ein Schnittpunkt ist C. Der zweite liefert das gespiegelte, kongruente Dreieck.</p><p><strong>SWS:</strong> Zeichne eine Seite, trage am passenden Ende den eingeschlossenen Winkel ab, miss auf dem Schenkel die zweite Seite und verbinde. <strong>WSW:</strong> Zeichne die gegebene Seite und an ihren Enden die gegebenen Winkel; der Schnitt der Schenkel ist C.</p><p><strong>SsW:</strong> Zeichne die Seite am gegebenen Winkel und schneide den zweiten Winkelschenkel mit dem Kreis für die gegenüberliegende Seite. Die längere gegebene Seite muss dem gegebenen Winkel gegenüberliegen, damit der Satz Eindeutigkeit sichert.</p><div class="merke">Auf Papier: Konstruiere ABC mit a = 5 cm, b = 6 cm, c = 7 cm mit Zirkel und Geodreieck. Beschreibe die Schritte und miss zur Kontrolle. Im Labor kannst du den Bauplan vorher verändern.</div>`,
  formulas: [
    {
      name: "Seitenbezeichnung",
      html: "a = BC, b = AC, c = AB",
      quantities: "Die Seite a liegt gegenüber von A; entsprechend b und c.",
    },
  ],
  quiz: {
    question: "Welchen Radius hat der Kreis um A bei einer SSS-Konstruktion?",
    options: ["a = BC", "b = AC", "die halbe Grundseite"],
    correctIndex: 1,
    explanation: "C hat zu A den Abstand b. Der Kreis um B hat den Radius a.",
  },
  lab: {
    kind: "triangle-construction",
    title: "Konstruktion mit zwei Kreisen",
    intro:
      "Wähle die Seiten, dann blende die Konstruktionsschritte ein. Übertrage einen Bauplan auf Papier.",
    params: [
      range("a", "a = BC", 2, 9, 5, 0.5, "cm"),
      range("b", "b = AC", 2, 9, 6, 0.5, "cm"),
      range("c", "c = AB", 2, 10, 7, 0.5, "cm"),
      range("step", "Konstruktionsschritt", 1, 4, 1),
    ],
    readouts: [
      {
        key: "plan",
        label: "Schritt",
        compute: (v) =>
          [
            "",
            "1. Grundseite AB zeichnen",
            "2. Kreis um A mit Radius b",
            "3. Kreis um B mit Radius a",
            "4. Schnittpunkt C verbinden",
          ][v.step],
      },
      {
        key: "possible",
        label: "Angaben",
        compute: (v) => (triangleExists(v.a, v.b, v.c) ? "zulässig" : "kein echtes Dreieck"),
      },
    ],
    goals: [
      {
        id: "sss",
        text: "Konstruiere 5–6–7 bis zum letzten Schritt.",
        check: (v) => v.a === 5 && v.b === 6 && v.c === 7 && v.step === 4,
      },
      {
        id: "gleichschenklig",
        text: "Konstruiere ein gleichschenkliges Dreieck mit a = b = 5 cm und c = 6 cm.",
        check: (v) => v.a === 5 && v.b === 5 && v.c === 6 && v.step === 4,
      },
    ],
  },
  exercises: [
    {
      id: "bauplan",
      make: (rng, level) => {
        const a = rng.int(4, 7),
          b = a + 1,
          c = a + 2;
        if (level === 1)
          return task(
            `Du konstruierst ABC mit a = ${a} cm, b = ${b} cm, c = ${c} cm. Welche Radien brauchst du?`,
            [
              numberField("Kreis um A:", b, "cm", 0),
              numberField("Kreis um B:", a, "cm", 0),
              choiceField("Anzahl möglicher Eckpunkte C", ["0", "1", "2"], 2),
            ],
            [
              `AC = b = ${b}, BC = a = ${a}.`,
              `<strong>Radien ${b} cm um A und ${a} cm um B; zwei gespiegelte Schnittpunkte.</strong>`,
            ],
            "a liegt gegenüber A, b gegenüber B",
            { a, b, c },
          );
        const alpha = rng.int(35, 70),
          beta = rng.int(40, 70);
        return task(
          `Eine dreieckige Scheibe hat eine bekannte Kante von ${c} cm. An den Enden dieser Kante liegen Winkel von ${alpha}° und ${beta}°. Welcher Bauplan passt und wie groß ist der dritte Winkel?`,
          [
            choiceField("Konstruktionsfall", ["SSS", "SWS", "WSW"], 2),
            numberField("dritter Winkel:", 180 - alpha - beta, "°", 0),
          ],
          [
            `Die bekannte Seite liegt zwischen den beiden bekannten Winkeln: WSW.`,
            `<strong>Dritter Winkel = 180° − ${alpha}° − ${beta}° = ${180 - alpha - beta}°.</strong> Zeichne die Kante und die beiden Winkelschenkel.`,
          ],
          undefined,
          { alpha, beta },
        );
      },
    },
  ],
});

const congruence = defineLesson("dv-3-kongruenz", {
  subtitle: "Gleiche Form und gleiche Größe",
  whyItMatters: "Du erkennst, wann ein Dreiecksplan eindeutig ist und wann Angaben fehlen.",
  explanationHtml: `<p>Kongruente Dreiecke lassen sich durch Verschieben, Drehen oder Spiegeln zur Deckung bringen. Die Seiten und Winkel stimmen passend zugeordnet überein.</p><p>Die Kongruenzsätze heißen <strong>SSS, SWS, WSW und SsW</strong>. Bei SWS muss der Winkel eingeschlossen sein. Bei SsW liegt er gegenüber der längeren gegebenen Seite. Drei Winkel allein sichern nur gleiche Form; die Größe ist noch frei.</p><div class="example">5 cm und 7 cm sowie 30° gegenüber der 5-cm-Seite lassen zwei verschiedene Dreiecke zu. Das ist kein sicherer SsW-Fall.</div>`,
  formulas: [
    {
      name: "Sichere Fälle",
      html: "SSS · SWS · WSW · SsW",
      quantities: "SsW: Winkel gegenüber der längeren gegebenen Seite",
    },
  ],
  quiz: {
    question: "Warum ist WWW kein Kongruenzsatz?",
    options: [
      "Die Winkel müssen verschieden sein.",
      "Die Größe ist durch die Winkel nicht festgelegt.",
      "Jedes Dreieck hat vier Winkel.",
    ],
    correctIndex: 1,
    explanation: "Man kann ein Dreieck vergrößern und dabei alle Winkel beibehalten.",
  },
  lab: {
    kind: "congruence",
    title: "Reichen die Angaben?",
    intro: "Vergleiche die Baupläne. Prüfe bei jedem Winkel, wo er liegt.",
    params: [
      choice(
        "case",
        "Gegebene Angaben",
        CONGRUENCE_CASES.map((c) => c.label),
      ),
    ],
    readouts: [
      { key: "given", label: "Gegeben", compute: (v) => CONGRUENCE_CASES[v.case].given },
      {
        key: "certain",
        label: "Kongruenz gesichert?",
        compute: (v) => (CONGRUENCE_CASES[v.case].certain ? "ja" : "nein"),
      },
      { key: "reason", label: "Begründung", compute: (v) => CONGRUENCE_CASES[v.case].reason },
    ],
    goals: [
      { id: "ssw", text: "Untersuche den sicheren SsW-Fall.", check: (v) => v.case === 3 },
      {
        id: "mehrdeutig",
        text: "Finde den Fall mit zwei nicht kongruenten Lösungen trotz zweier Seiten und eines Winkels.",
        check: (v) => v.case === 4,
      },
    ],
  },
  exercises: [
    {
      id: "kongruenzsatz",
      make: (rng, level) => {
        const n = rng.int(0, 5),
          c = CONGRUENCE_CASES[n];
        return task(
          `${level === 1 ? "Prüfe die Angaben" : "Eine Werkstatt soll mehrere deckungsgleiche Dreiecksplatten fertigen. Reicht der Plan sicher aus"}? ${c.given}.`,
          [
            yesNo("Form und Größe eindeutig?", c.certain),
            choiceField(
              "Passende Begründung",
              [
                "Drei zulässige Seiten legen die Form fest.",
                "Zwei Seiten mit eingeschlossenem Winkel reichen.",
                "Eine Seite mit ihren beiden anliegenden Winkeln reicht.",
                "Der Winkel liegt gegenüber der längeren gegebenen Seite.",
                "Es können zwei unterschiedliche Dreiecke entstehen.",
                "Die Größe bleibt frei.",
              ],
              n,
            ),
          ],
          [
            c.reason,
            `<strong>${c.certain ? "Kongruenz ist gesichert" : "Kongruenz ist nicht gesichert"}.</strong> ${level === 2 ? "Skizziere einen zweiten möglichen Plan oder begründe seine Unmöglichkeit." : "Ordne die Seiten und Winkel einander zu."}`,
          ],
          level === 1 ? "Prüfe SSS, SWS, WSW oder SsW." : undefined,
          { case: n },
        );
      },
    },
  ],
});

const quadrilaterals = defineLesson("dv-4-vierecke", {
  subtitle: "Eigenschaften können sich vererben",
  whyItMatters:
    "Ein Quadrat hat viele Namen. Mit passenden Oberbegriffen nutzt du bekannte Eigenschaften weiter.",
  explanationHtml: `<p>Hier bedeutet <strong>Trapez: mindestens ein Paar paralleler Gegenseiten</strong>. Deshalb gehört jedes Parallelogramm auch zu den Trapezen. Ein Quadrat ist zugleich Rechteck und Raute; beide sind Parallelogramme. Eine Raute ist auch ein Drachenviereck.</p><ul>${QUADS.map((q, i) => `<li><strong>${q}:</strong> ${QUAD_FACTS[i]}</li>`).join("")}</ul><p>Die Innenwinkelsumme jedes einfachen Vierecks ist 360°. Eine Diagonale zerlegt es in zwei Dreiecke. Das allgemeine Trapez muss keine Symmetrieachse haben; ein gleichschenkliges Trapez hat eine Achse senkrecht zu den parallelen Seiten.</p>`,
  formulas: [
    { name: "Winkelsumme", html: "α + β + γ + δ = 360°", quantities: "einfaches Viereck" },
  ],
  quiz: {
    question: "Welche Aussage gilt für jedes Quadrat?",
    options: [
      "Es ist ein Rechteck und eine Raute.",
      "Es ist niemals ein Trapez.",
      "Seine Diagonalen sind verschieden lang.",
    ],
    correctIndex: 0,
    explanation: "Vier rechte Winkel machen es zum Rechteck, vier gleiche Seiten zur Raute.",
  },
  lab: {
    kind: "quadrilaterals",
    title: "Das Viereck untersuchen",
    intro:
      "Wähle eine Familie und blende ihre Diagonalen ein. Achte auf parallele Seiten und Symmetrie.",
    params: [
      choice("shape", "Viereck", [...QUADS]),
      choice("diagonals", "Diagonalen", ["ausblenden", "einblenden"]),
    ],
    readouts: [
      { key: "name", label: "Familie", compute: (v) => QUADS[v.shape] },
      { key: "property", label: "Eigenschaften", compute: (v) => QUAD_FACTS[v.shape] },
    ],
    goals: [
      {
        id: "raute",
        text: "Untersuche die senkrechten, sich halbierenden Diagonalen der Raute.",
        check: (v) => v.shape === 3 && v.diagonals === 1,
      },
      {
        id: "rechteck",
        text: "Vergleiche sie mit den gleich langen Diagonalen des Rechtecks.",
        check: (v) => v.shape === 4 && v.diagonals === 1,
      },
    ],
  },
  exercises: [
    {
      id: "eigenschaften",
      make: (rng, level) => {
        if (level === 1) {
          const alpha = rng.int(60, 120),
            beta = rng.int(60, 100),
            gamma = rng.int(60, 100);
          return task(
            `Drei Innenwinkel eines Vierecks messen ${alpha}°, ${beta}° und ${gamma}°. Berechne den vierten.`,
            [numberField("δ =", 360 - alpha - beta - gamma, "°", 0)],
            [
              `Zusammen haben die vier Winkel 360°.`,
              `<strong>δ = 360° − ${alpha}° − ${beta}° − ${gamma}° = ${360 - alpha - beta - gamma}°.</strong>`,
            ],
            "α + β + γ + δ = 360°",
            { alpha, beta, gamma },
          );
        }
        const n = rng.pick([0, 1, 2, 3, 4, 5]);
        return task(
          `Welche Beschreibung kennzeichnet genau die Familie „${QUADS[n]}“? Suche ihre vollständige Definition, auch wenn schwächere Aussagen ebenfalls zutreffen.`,
          [
            choiceField(
              "Definition der Familie",
              [
                "mindestens ein Paar paralleler Gegenseiten",
                "zwei Paare gleich langer benachbarter Seiten",
                "beide Gegenseitenpaare parallel",
                "vier gleich lange Seiten",
                "vier rechte Winkel",
                "vier gleiche Seiten und vier rechte Winkel",
              ],
              n,
            ),
          ],
          [
            `Eine Definition muss die ganze Familie und nur diese Familie erfassen.`,
            `<strong>${QUAD_FACTS[n]}</strong>`,
          ],
          undefined,
          { shape: n },
        );
      },
    },
  ],
});

const quadConstruction = defineLesson("dv-5-viereckskonstruktion", {
  subtitle: "Parallelen, Senkrechte, Diagonalen und Flächen",
  whyItMatters:
    "Eigenschaften werden zu Werkzeugen: Mit ihnen zeichnest du eine Figur und findest ihre Fläche.",
  explanationHtml: `<p><strong>Parallelogramm:</strong> Zeichne zwei benachbarte Seiten; ergänze mit Parallelen. Für ein Rechteck verwende einen rechten Winkel, für eine Raute gleiche Seiten, für ein Quadrat beides.</p><p><strong>Trapez:</strong> Zeichne eine Grundseite und im Abstand h die Parallele für die zweite Grundseite. Verschieben dieser Grundseite verändert die Fläche nicht. <strong>Drachenviereck:</strong> Zeichne die Symmetriediagonale, markiere den Schnittpunkt und konstruiere dort die Senkrechte; trage die halbe andere Diagonale in beide Richtungen ab. Die Mittelsenkrechte und Kreise helfen beim Konstruieren einer Raute.</p><p>Zwei gleiche Trapeze ergeben ein Parallelogramm mit Grundseite a + c und Höhe h. Beim Drachen ergeben die rechtwinkligen Teildreiecke zusammen die halbe Diagonalenproduktfläche.</p><div class="merke">Zeichne auf Papier ein Trapez mit a = 8 cm, c = 4 cm und h = 3 cm sowie einen Drachen mit e = 8 cm und f = 6 cm. Beschreibe, welche Angaben mehrere Lösungen zulassen. Prüfe das Ergebnis mit dem Labor.</div>`,
  formulas: [
    { name: "Parallelogramm", html: "A = a · h", quantities: "h steht senkrecht auf a" },
    { name: "Trapez", html: "A = (a + c) · h / 2", quantities: "a und c parallel" },
    {
      name: "Drachenviereck / Raute",
      html: "A = e · f / 2",
      quantities: "e, f sind die senkrechten Diagonalen",
    },
  ],
  quiz: {
    question: "Welche Länge ist die Höhe eines Parallelogramms zur Grundseite a?",
    options: [
      "Immer die schräge Seitenlänge.",
      "Der senkrechte Abstand zwischen den parallelen Grundseiten.",
      "Eine beliebige Diagonale.",
    ],
    correctIndex: 1,
    explanation: "Die Höhe misst den kürzesten, senkrechten Abstand.",
  },
  lab: {
    kind: "quad-construction",
    title: "Die Fläche bleibt – oder ändert sich",
    intro:
      "Baue ein Parallelogramm, Trapez oder Drachenviereck. Beim Drachen heißen die Maße e und f; bei den anderen a, c und h.",
    params: [
      choice("shape", "Bauplan", ["Parallelogramm", "Trapez", "Drachenviereck"]),
      range("a", "a oder Diagonale e", 2, 10, 6, 1, "cm"),
      range("c", "c (nur Trapez)", 2, 10, 4, 1, "cm"),
      range("h", "h oder Diagonale f", 2, 8, 3, 1, "cm"),
      range("shift", "Verschiebung oben / Diagonalenschnitt", 1, 4, 1),
    ],
    readouts: [
      {
        key: "area",
        label: "Fläche",
        unit: "cm²",
        compute: (v) =>
          v.shape === 0 ? v.a * v.h : v.shape === 1 ? ((v.a + v.c) * v.h) / 2 : (v.a * v.h) / 2,
      },
    ],
    goals: [
      {
        id: "trapez",
        text: "Baue das Trapez mit a = 8, c = 4, h = 3; verschiebe die Oberseite um 3 Einheiten.",
        check: (v) => v.shape === 1 && v.a === 8 && v.c === 4 && v.h === 3 && v.shift === 3,
      },
      {
        id: "drache",
        text: "Baue einen Drachen mit e = 8 und f = 6. Seine Fläche ist 24 cm².",
        check: (v) => v.shape === 2 && v.a === 8 && v.h === 6,
      },
    ],
  },
  exercises: [
    {
      id: "flaechen",
      make: (rng, level) => {
        const a = rng.int(5, 12),
          c = rng.int(2, 5),
          h = rng.int(2, 8);
        if (level === 1)
          return task(
            `Ein Trapez hat parallele Seiten a = ${a} cm und c = ${c} cm. Der senkrechte Abstand beträgt ${h} cm. Berechne seine Fläche und die Fläche eines Drachen mit Diagonalen ${a} cm und ${h} cm.`,
            [
              numberField("Trapez:", ((a + c) * h) / 2, "cm²", 1),
              numberField("Drache:", (a * h) / 2, "cm²", 1),
            ],
            [
              `Trapez: (${a} + ${c}) · ${h} / 2. Drache: ${a} · ${h} / 2.`,
              `<strong>Trapez ${fmt(((a + c) * h) / 2, 1)} cm²; Drache ${fmt((a * h) / 2, 1)} cm².</strong>`,
            ],
            "Trapez: (a + c)h/2; Drache: ef/2",
            { a, c, h },
          );
        return task(
          `Ein Beet ist trapezförmig: Die parallelen Ränder sind ${a} m und ${c} m lang, die Fläche beträgt ${((a + c) * h) / 2} m². Wie weit liegen die Ränder senkrecht auseinander? Ändert sich die Fläche, wenn der kurze Rand parallel verschoben wird und sein Abstand gleich bleibt?`,
          [numberField("Abstand:", h, "m", 0), yesNo("Fläche ändert sich?", false)],
          [
            `A = (a + c)h/2, also h = 2A/(a + c).`,
            `<strong>h = ${h} m.</strong> Gleiche Grundseiten und gleiche Höhe ergeben dieselbe Fläche.`,
          ],
          undefined,
          { a, c, h },
        );
      },
    },
  ],
});

export const STAGE_FIGUREN = stage("dreiecke-vierecke", [
  existence,
  construction,
  congruence,
  quadrilaterals,
  quadConstruction,
]);
