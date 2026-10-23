import { fmt, sum } from "../exercises/format";
import { angle } from "../models";
import { numberField as num, choiceField as pick } from "./helpers";
import {
  lab,
  range as r,
  choice as c,
  output as o,
  makeLesson as lesson,
  makeStage,
  task,
} from "./builders";
const L = (step: number, content: Parameters<typeof lesson>[3]) =>
  lesson(5, step, [5, 3], content);
const circleDistance = (v: Record<string, number>) => Math.hypot(v.x, v.y);

const kreis = L(1, {
  id: "ol-1-kreisbereiche",
  title: "5.1 Kreislinie und Kreisbereiche",
  subtitle: "Genau, höchstens und mindestens als Abstand",
  whyItMatters:
    "Ein Sicherheitsabstand oder ein Funkbereich beschreibt viele mögliche Standorte. Die Wörter im Auftrag entscheiden, ob der Rand dazugehört.",
  explanationHtml: `<p>Die Kreislinie k(M; r) enthält genau die Punkte P mit Abstand MP = r. Die Kreisscheibe einschließlich Rand erfüllt MP ≤ r. „Weniger als r“ beschreibt das Innere ohne Rand; „mindestens r“ das Äußere einschließlich Kreislinie.</p><div class="example">Ein Sender erreicht alle Orte höchstens 3 km entfernt. Zeichne um den Sender einen Kreis mit Radius 3 km und markiere die Fläche innen samt Rand. Ein Ort genau 3 km entfernt gehört dazu. Bei „weniger als 3 km“ gehörte er nicht dazu.</div><p>Zeichne in einem Plan zuerst den Radius im Maßstab: Bei 1 cm für 1 km sind 3 km als 3 cm darzustellen. Die Kreislinie ist eine Ortslinie; eine ganze markierte Fläche ist ein Ortsbereich.</p><div class="merke"><strong>Merke:</strong> Genau: =; höchstens: ≤; mindestens: ≥; weniger als: &lt;; mehr als: &gt;. Prüfe den Rand ausdrücklich.</div>`,
  formulas: [
    {
      name: "Kreis und Bereiche",
      html: "MP = r · MP ≤ r · MP ≥ r",
      quantities: "Abstand zum Mittelpunkt; Rand je nach Zeichen enthalten",
    },
  ],
  quiz: {
    question:
      "„Mindestens 4 m Abstand“: Gehört ein Punkt genau 4 m entfernt dazu?",
    options: [
      "Ja, der Rand gehört dazu.",
      "Nein, nur das Innere.",
      "Nein, mindestens bedeutet mehr als.",
    ],
    correctIndex: 0,
    explanation: "Mindestens heißt größer oder gleich: MP ≥ 4 m.",
  },
  lab: lab(
    "circle-locus",
    "Abstand und Rand",
    "Ziehe P und wähle die Bedingung. Der Bereich ist farbig, die Rückmeldung entscheidet auch auf dem Rand.",
    [
      r("x", "x von P", -5, 5, 1),
      r("y", "y von P", -5, 5, 1),
      r("radius", "Radius", 1, 4, 3),
      c(
        "mode",
        "Bedingung",
        ["genau r", "höchstens r", "mindestens r", "weniger als r"],
        0,
      ),
    ],
    [
      o("distance", "Abstand MP", circleDistance, "LE"),
      o("belongs", "P erfüllt Bedingung", (v) => {
        const d = circleDistance(v);
        return [
          Math.abs(d - v.radius) < 1e-8,
          d <= v.radius,
          d >= v.radius,
          d < v.radius,
        ][v.mode]
          ? "ja"
          : "nein";
      }),
    ],
    [
      {
        id: "rand",
        text: "Setze P(3 | 0) bei r = 3 auf die Kreislinie (genau).",
        check: (v) => v.x === 3 && v.y === 0 && v.radius === 3 && v.mode === 0,
      },
      {
        id: "innen",
        text: "Wähle höchstens 3 und P(1 | 2).",
        check: (v) => v.x === 1 && v.y === 2 && v.radius === 3 && v.mode === 1,
      },
      {
        id: "aussen",
        text: "Wähle mindestens 3 und P(4 | 0).",
        check: (v) => v.x === 4 && v.y === 0 && v.radius === 3 && v.mode === 2,
      },
    ],
  ),
  exercises: [
    {
      id: "abstand",
      make: (rng, level) => {
        const radius = rng.int(2, 6),
          mode = rng.int(0, 2),
          d = radius + rng.pick([-1, 0, 1]),
          words = ["genau", "höchstens", "mindestens"],
          yes = [d === radius, d <= radius, d >= radius][mode];
        return task(
          level,
          `Gesucht sind Orte ${words[mode]} ${radius} m von M entfernt. Gehört ein Punkt mit Abstand ${d} m dazu?`,
          `Auf einem Plan sind Orte ${words[mode]} ${radius} km vom Sender erlaubt. P ist ${d} km entfernt. Entscheide über P und den Rand des markierten Bereichs.`,
          [
            pick("P gehört dazu?", ["ja", "nein"], yes ? 0 : 1),
            ...(level === 2
              ? [pick("Rand eingeschlossen?", ["ja", "nein"], 0)]
              : []),
          ],
          "Übersetze genau, höchstens oder mindestens in ein Vergleichszeichen.",
          `Vergleiche ${d} mit ${radius}: ${["=", "≤", "≥"][mode]}. Bei allen drei genannten Bedingungen ist der Rand eingeschlossen.`,
          `P: ${yes ? "ja" : "nein"}; Rand eingeschlossen.`,
          { radius, mode, d },
        );
      },
    },
    {
      id: "massstab-rand",
      make: (rng, level) => {
        const radius = rng.int(2, 8),
          scale = rng.pick([1, 2]);
        return task(
          level,
          `Ein Plan verwendet 1 cm für ${scale} km. Du markierst Orte weniger als ${radius} km von M entfernt. Berechne den Planradius.`,
          `Ein Rettungsbereich umfasst Orte mehr als ${radius} km von M entfernt. Im Plan entspricht 1 cm genau ${scale} km. Berechne den Radius der Grenzlinie und entscheide, ob sie zum Bereich gehört.`,
          [
            num("Planradius =", radius / scale, "cm", 1),
            pick("Grenzlinie gehört dazu?", ["nein", "ja"], 0),
          ],
          "Realen Radius durch die Kilometer je Zentimeter teilen; streng bedeutet ohne Rand.",
          `${radius} : ${scale} = ${fmt(radius / scale)}. Die Wörter „weniger als“ und „mehr als“ schließen den Rand aus.`,
          `Radius ${fmt(radius / scale)} cm; Rand nicht enthalten.`,
          { radius, scale },
        );
      },
    },
  ],
});

const halbierende = L(2, {
  id: "ol-2-abstandsorte",
  title: "5.2 Mittelsenkrechte, Winkelhalbierende und Parallelenpaar",
  subtitle: "Gleiche Abstände konstruieren",
  whyItMatters:
    "Ein Treffpunkt gleich weit von zwei Orten liegt nicht irgendwo. Ortslinien machen aus einer Bedingung eine konstruierbare Menge.",
  explanationHtml: `<p>Alle Punkte mit gleichem Abstand von A und B liegen auf der <strong>Mittelsenkrechten</strong> von AB. Zeichne um A und B gleich große Kreisbögen mit Radius größer als die halbe Strecke. Die Verbindung ihrer Schnittpunkte ist die Mittelsenkrechte. Punkte näher an A als an B liegen auf der A-Seite der Mittelsenkrechten, ohne die Grenzgerade.</p><p>Im Inneren eines Winkels liegen die Punkte mit gleichem <em>senkrechtem</em> Abstand von beiden Schenkeln auf der Winkelhalbierenden. Trage von der Ecke gleiche Strecken auf den Schenkeln ab, zeichne darum gleich große Kreisbögen und verbinde die Ecke mit deren Schnittpunkt. Bei zwei ganzen sich schneidenden Geraden gibt es zwei zueinander senkrechte Winkelhalbierende.</p><p>Alle Punkte im festen Abstand d &gt; 0 von einer Geraden liegen auf zwei zu ihr parallelen Geraden, je eine auf jeder Seite. Der Abstand ist immer die kürzeste, senkrechte Strecke. Höchstens d ergibt den Streifen zwischen beiden Parallelen samt Rand. Mindestens d ergibt die beiden äußeren Bereiche samt Rand. Strenge Ungleichungen schließen den jeweiligen Rand aus.</p><div class="example">A(−3 | 0), B(3 | 0): die Mittelsenkrechte ist die y-Achse. Näher an A heißt x &lt; 0. Der Abstand 2 LE zur x-Achse liefert y = 2 oder y = −2; höchstens 2 LE heißt −2 ≤ y ≤ 2. Im ersten Quadranten halbiert y = x den rechten Winkel der Achsen.</div><div class="merke"><strong>Merke:</strong> Zwei Punkte → Mittelsenkrechte. Zwei Winkelschenkel → Winkelhalbierende. Fester Abstand zu einer Geraden → Parallelenpaar; Ungleichungen beschreiben die angrenzenden Bereiche.</div>`,
  formulas: [
    {
      name: "Gleich weit von A und B",
      html: "PA = PB ⇔ P auf der Mittelsenkrechten",
      quantities: "Umkehrung gilt ebenfalls",
    },
    {
      name: "Geradenabstand",
      html: "Abstand d zu g → zwei Parallele",
      quantities: "senkrecht messen",
    },
  ],
  quiz: {
    question: "Wo liegen alle Punkte im Abstand 2 cm von einer Geraden?",
    options: [
      "Auf zwei Parallelen im Abstand 2 cm.",
      "Auf einem Kreis mit Radius 2 cm.",
      "Nur auf einer der beiden Parallelen.",
    ],
    correctIndex: 0,
    explanation: "Auf jeder Seite der Geraden gibt es eine passende Parallele.",
  },
  lab: lab(
    "bisector-locus",
    "Abstandsorte vergleichen",
    "Wähle die Ortslinie oder den Bereich und ziehe P. Bei den Winkelschenkeln betrachten wir nur den ersten Quadranten.",
    [
      r("x", "x von P", -4, 4, 1),
      r("y", "y von P", -4, 4, 3),
      c(
        "mode",
        "Ortslinie / Bereich",
        [
          "Mittelsenkrechte von A(−3|0), B(3|0)",
          "Winkelhalbierende im 1. Quadranten",
          "Abstand 2 zur x-Achse",
          "näher an A als an B",
          "höchstens 2 zur x-Achse",
          "mindestens 2 zur x-Achse",
        ],
        0,
      ),
    ],
    [
      o("belongs", "P erfüllt Bedingung", (v) =>
        [
          v.x === 0,
          v.x === v.y && v.x >= 0,
          Math.abs(v.y) === 2,
          v.x < 0,
          Math.abs(v.y) <= 2,
          Math.abs(v.y) >= 2,
        ][v.mode]
          ? "ja"
          : "nein",
      ),
    ],
    [
      {
        id: "mitte",
        text: "Setze P(0 | 3) auf die Mittelsenkrechte.",
        check: (v) => v.mode === 0 && v.x === 0 && v.y === 3,
      },
      {
        id: "winkel",
        text: "Setze P(3 | 3) auf die Winkelhalbierende.",
        check: (v) => v.mode === 1 && v.x === 3 && v.y === 3,
      },
      {
        id: "parallel",
        text: "Finde P(1 | −2) auf der unteren Abstandsparallelen.",
        check: (v) => v.mode === 2 && v.x === 1 && v.y === -2,
      },
    ],
  ),
  exercises: [
    {
      id: "ortslinie-waehlen",
      make: (rng, level) => {
        const mode = rng.int(0, 2),
          d = rng.int(2, 5),
          contexts = [
            "P soll gleich weit von A und B entfernt sein.",
            "P liegt im Winkelinneren gleich weit von beiden Schenkeln entfernt.",
            `P soll den Abstand ${d} cm von einer Geraden haben.`,
          ];
        return task(
          level,
          `Wähle die passende Ortslinie: ${contexts[mode]}`,
          `Ein Standort erfüllt diese Bedingung: ${contexts[mode]} Wähle die Ortslinie und entscheide, wie du den Abstand zu einer Geraden misst.`,
          [
            pick(
              "Ortslinie",
              ["Mittelsenkrechte", "Winkelhalbierende", "Parallelenpaar"],
              mode,
            ),
            ...(level === 2
              ? [
                  pick(
                    "Geradenabstand",
                    [
                      "senkrecht zur Geraden",
                      "entlang der Geraden",
                      "beliebig schräg zur Geraden",
                    ],
                    0,
                  ),
                ]
              : []),
          ],
          "Unterscheide Abstand zu Punkten und Abstand zu Geraden.",
          "Die Mittelsenkrechte vergleicht zwei Punktabstände; die Winkelhalbierende zwei senkrechte Schenkelabstände; das Parallelenpaar hält einen festen Geradenabstand ein.",
          `${["Mittelsenkrechte", "Winkelhalbierende", "Parallelenpaar"][mode]}; Geradenabstände senkrecht messen.`,
          { mode, d },
        );
      },
    },
    {
      id: "konstruieren",
      make: (rng, level) => {
        const a = rng.int(2, 6);
        return task(
          level,
          `A(−${a} | 0) und B(${a} | 0) sind gegeben. Bestimme die x-Koordinate jedes Punktes ihrer Mittelsenkrechten.`,
          `Ein Punkt liegt zugleich auf der Mittelsenkrechten von A(−${a} | 0), B(${a} | 0) und im Abstand 2 LE zur x-Achse. Wie viele Punkte gibt es, und welche x-Koordinate haben sie?`,
          [
            num("x =", 0, "", 0),
            ...(level === 2 ? [num("Anzahl =", 2, "", 0)] : []),
          ],
          "Der Mittelpunkt liegt bei (0|0); die Mittelsenkrechte steht senkrecht auf AB.",
          "Die Mittelsenkrechte ist x = 0. Die Abstandsparallelen y = 2 und y = −2 schneiden sie in zwei Punkten.",
          `x = 0${level === 2 ? "; P(0|2) und Q(0|−2), also 2 Punkte" : ""}.`,
          { a },
        );
      },
    },
    {
      id: "bereiche",
      make: (rng, level) => {
        const x = rng.int(-3, 3),
          y = rng.int(-3, 3),
          allowed = x < 0 && Math.abs(y) <= 2;
        return task(
          level,
          `P(${fmt(x)}|${fmt(y)}) soll höchstens 2 LE von der x-Achse entfernt sein. Gehört P zum Streifen?`,
          `P(${fmt(x)}|${fmt(y)}) soll näher an A(−3|0) als an B(3|0) und zugleich höchstens 2 LE von der x-Achse entfernt sein. Gehört P zum Bereich?`,
          [
            pick(
              "P gehört dazu?",
              ["ja", "nein"],
              (level === 1 ? Math.abs(y) <= 2 : allowed) ? 0 : 1,
            ),
          ],
          "Geradenabstand ist |y|; näher an A heißt x < 0.",
          `Der Streifen erfüllt −2 ≤ y ≤ 2. ${level === 2 ? "Zusätzlich muss x < 0 gelten; die Mittelsenkrechte selbst ist ausgeschlossen." : "Die Randparallelen sind eingeschlossen."}`,
          `${(level === 1 ? Math.abs(y) <= 2 : allowed) ? "P gehört dazu" : "P gehört nicht dazu"}.`,
          { x, y },
        );
      },
    },
  ],
});

const thales = L(3, {
  id: "ol-3-thales",
  title: "5.3 Der Satz des Thales",
  subtitle: "Rechte Winkel auf dem Kreis über dem Durchmesser",
  whyItMatters:
    "Mit dem Thaleskreis kannst du einen rechten Winkel konstruieren, ohne ihn mit dem Geodreieck abzutragen. Die Umkehrung hilft beim Finden eines Punktes.",
  explanationHtml: `<p>Liegt C auf dem Kreis mit Durchmesser AB und ist C weder A noch B, dann gilt ∠ACB = 90°. Umgekehrt liegt jeder Punkt C mit rechtem Winkel ACB auf diesem Kreis. Beide Richtungen zusammen beschreiben eine Ortslinie.</p><p>Begründung: Verbinde den Kreismittelpunkt M mit C. MA = MC = MB sind Radien. Die Dreiecke AMC und BMC sind gleichschenklig. Ihre Basiswinkel ergeben bei A und B zusammen α + β und bei C ebenfalls α + β. Mit der Winkelsumme 2(α + β) = 180° folgt ∠ACB = 90°.</p><div class="example">AB = 8 cm: M ist die Mitte, r = 4 cm. Jeder andere Kreispunkt C bildet mit A und B ein rechtwinkliges Dreieck; AB liegt dem rechten Winkel gegenüber. C = A oder C = B ergibt kein Dreieck und muss ausgeschlossen werden.</div><div class="merke"><strong>Merke:</strong> Rechter Winkel bei C ⇔ C auf dem Thaleskreis über AB, C ≠ A, B. AB ist der Durchmesser, nicht der Radius.</div>`,
  formulas: [
    {
      name: "Thaleskreis",
      html: "∠ACB = 90° ⇔ C ∈ k(M; AB : 2)",
      quantities: "M Mitte von AB; C verschieden von A und B",
    },
  ],
  quiz: {
    question:
      "AB = 10 cm ist der Durchmesser eines Thaleskreises. Wie groß ist sein Radius?",
    options: ["5 cm", "10 cm", "20 cm"],
    correctIndex: 0,
    explanation: "Der Radius ist die Hälfte des Durchmessers.",
  },
  lab: lab(
    "thales-locus",
    "Winkel über einer Strecke",
    "A(−4|0) und B(4|0) bleiben fest. Ziehe C über die obere Halbebene. Vergleiche Punkte auf, innerhalb und außerhalb des Thaleskreises.",
    [r("x", "x von C", -4, 4, 1, 0.1), r("y", "y von C", 0, 5, 2, 0.1)],
    [
      o("angle", "Winkel ACB", (v) =>
        v.y === 0
          ? "kein Dreieck"
          : fmt(angle({ x: -4, y: 0 }, { x: v.x, y: v.y }, { x: 4, y: 0 }), 1) +
            "°",
      ),
      o("on", "Thaleskreis", (v) =>
        v.y > 0 && Math.abs(v.x * v.x + v.y * v.y - 16) < 1e-8
          ? "auf dem Kreis"
          : "nicht auf dem Kreis",
      ),
    ],
    [
      {
        id: "recht",
        text: "Setze C(0 | 4): rechter Winkel auf dem Kreis.",
        check: (v) => v.x === 0 && v.y === 4,
      },
      {
        id: "innen",
        text: "Setze C(0 | 2) innerhalb des Kreises: der Winkel ist stumpf.",
        check: (v) => v.x === 0 && v.y === 2,
      },
      {
        id: "aussen",
        text: "Setze C(0 | 5) außerhalb des Kreises: der Winkel ist spitz.",
        check: (v) => v.x === 0 && v.y === 5,
      },
    ],
  ),
  exercises: [
    {
      id: "radius-winkel",
      make: (rng, level) => {
        const radius = rng.int(2, 6);
        return task(
          level,
          `C liegt auf dem Thaleskreis über AB = ${2 * radius} cm, C ≠ A, B. Bestimme Radius und Winkel ACB.`,
          `Ein Dreieck hat bei C einen rechten Winkel und AB = ${2 * radius} cm. Konstruiere gedanklich die Ortslinie für C: Bestimme Radius und entscheide, ob A und B als C erlaubt sind.`,
          [
            num("Radius =", radius, "cm", 0),
            ...(level === 1
              ? [num("Winkel ACB =", 90, "°", 0)]
              : [
                  pick(
                    "C darf A oder B sein?",
                    [
                      "nein, kein Dreieck",
                      "ja, weil beide auf dem Kreis liegen",
                      "nur A",
                    ],
                    0,
                  ),
                ]),
          ],
          "Durchmesser halbieren; Thaleswinkel ist 90°.",
          "M ist die Mitte von AB. Der Kreis um M mit halber Streckenlänge liefert alle rechten Winkel, außer an den entarteten Endpunkten.",
          `r = ${radius} cm; ∠ACB = 90°; A und B ausgeschlossen.`,
          { radius },
        );
      },
    },
    {
      id: "begruendung",
      make: (rng, level) => {
        const a = rng.int(2, 7) * 10,
          b = 90 - a;
        return task(
          level,
          `In der Thalesbegründung sind die Basiswinkel bei A und B ${a}° und ${b}°. Wie groß ist ihr Anteil zusammen am Winkel C?`,
          `Im Beweis des Thalessatzes heißen die Basiswinkel α = ${a}° und β = ${b}°. Nutze die gleichen Radien und die Dreieckswinkelsumme: Bestimme ∠ACB und wähle den Grund für die gleichen Teilwinkel.`,
          [
            num("Winkel C =", a + b, "°", 0),
            ...(level === 2
              ? [
                  pick(
                    "Gleiche Teilwinkel wegen …",
                    [
                      "gleicher Basiswinkel in gleichschenkligen Teildreiecken",
                      "gleich großer Mittelpunktswinkel bei beliebiger Lage von C",
                      "paralleler Radien an beliebigen Endpunkten eines Kreisbogens",
                    ],
                    0,
                  ),
                ]
              : []),
          ],
          "Gleiche Radien liefern gleiche Basiswinkel; bei C stehen α und β nebeneinander.",
          `Winkel C = α + β = ${a}° + ${b}°. Zusammen mit A und B ergibt sich 2(α + β) = 180°.`,
          `∠ACB = ${a + b}°.`,
          { a, b },
        );
      },
    },
  ],
});

const kreisgerade = L(4, {
  id: "ol-4-kreis-gerade",
  title: "5.4 Kreis und Gerade",
  subtitle: "Sekante, Tangente und Passante",
  whyItMatters:
    "Eine Berührung hat genau eine besondere Richtung. Der senkrechte Abstand des Mittelpunkts entscheidet, ob eine Gerade den Kreis trifft.",
  explanationHtml: `<p>Vergleiche den senkrechten Abstand d des Mittelpunkts M von einer Geraden g mit dem Radius r: d &lt; r liefert zwei Schnittpunkte (Sekante), d = r genau einen Berührpunkt T (Tangente), d &gt; r keinen Schnittpunkt (Passante).</p><p>Die Tangente steht im Berührpunkt senkrecht auf dem Radius MT. Umgekehrt ist eine Gerade durch einen Kreispunkt T, die senkrecht auf MT steht, eine Tangente. Ist der Abstand kleiner als r, ist die Gerade keine Tangente, auch wenn du nur einen Ausschnitt siehst.</p><div class="example">Ein Kreis hat Radius 3 cm. Eine Gerade mit Mittelpunktabstand 2 cm ist eine Sekante; mit Abstand 3 cm Tangente; mit Abstand 4 cm Passante. Beim Tangentenfall liegt der Lotfuß des Mittelpunkts auf dem Kreis.</div><div class="merke"><strong>Merke:</strong> Sekante: 2; Tangente: 1; Passante: 0 Schnittpunkte. An der Tangente gilt MT ⟂ g.</div>`,
  formulas: [
    {
      name: "Kreis–Gerade",
      html: "d &lt; r: Sekante · d = r: Tangente · d &gt; r: Passante",
      quantities: "d senkrechter Mittelpunktabstand",
    },
  ],
  quiz: {
    question: "Welchen Winkel bilden Tangente und Berührradius?",
    options: ["90°", "0°", "45°"],
    correctIndex: 0,
    explanation: "Der Radius zum Berührpunkt steht senkrecht auf der Tangente.",
  },
  lab: lab(
    "circle-line",
    "Gerade verschieben",
    "Ziehe die horizontale Gerade und verändere den Radius. Der Mittelpunkt bleibt im Ursprung.",
    [r("radius", "Radius", 1, 5, 3), r("d", "Höhe der Geraden", -6, 6, 1)],
    [
      o("distance", "Mittelpunktabstand", (v) => Math.abs(v.d), "LE"),
      o("kind", "Lage", (v) =>
        Math.abs(v.d) < v.radius
          ? "Sekante"
          : Math.abs(v.d) === v.radius
            ? "Tangente"
            : "Passante",
      ),
      o("count", "Schnittpunkte", (v) =>
        Math.abs(v.d) < v.radius ? 2 : Math.abs(v.d) === v.radius ? 1 : 0,
      ),
    ],
    [
      {
        id: "tangente",
        text: "Erzeuge bei r = 3 eine Tangente oberhalb des Kreises.",
        check: (v) => v.radius === 3 && v.d === 3,
      },
      {
        id: "passante",
        text: "Erzeuge bei r = 2 eine Passante auf Höhe 4.",
        check: (v) => v.radius === 2 && v.d === 4,
      },
      {
        id: "sekante",
        text: "Zeige bei r = 4 die Sekante auf Höhe −2.",
        check: (v) => v.radius === 4 && v.d === -2,
      },
    ],
  ),
  exercises: [
    {
      id: "schnittzahl",
      make: (rng, level) => {
        const radius = rng.int(2, 6),
          delta = rng.pick([-1, 0, 1]),
          d = radius + delta,
          index = delta + 1;
        return task(
          level,
          `Ein Kreis hat Radius ${radius} cm. Eine Gerade hat Abstand ${d} cm vom Mittelpunkt. Bestimme Lage und Schnittzahl.`,
          `Eine horizontale Trasse liegt ${d} km vom Mittelpunkt eines kreisförmigen Gebiets mit Radius ${radius} km entfernt. Wie oft trifft sie den Rand, und ist sie eine Tangente?`,
          [
            num("Schnittpunkte =", delta < 0 ? 2 : delta === 0 ? 1 : 0, "", 0),
            pick("Lage", ["Sekante", "Tangente", "Passante"], index),
          ],
          "Vergleiche Abstand d und Radius r.",
          `${d} ${delta < 0 ? "<" : delta === 0 ? "=" : ">"} ${radius}. Der kürzeste Abstand entscheidet über die Schnittzahl.`,
          `${["Sekante: 2", "Tangente: 1", "Passante: 0"][index]} Schnittpunkte.`,
          { radius, d },
        );
      },
    },
    {
      id: "tangentenbedingung",
      make: (rng, level) => {
        const radius = rng.int(2, 8);
        return task(
          level,
          `Ein Kreis hat Radius ${radius} cm. Welchen Mittelpunktabstand hat jede Tangente, und welchen Winkel bildet sie mit dem Berührradius?`,
          `Eine Gerade durch einen Kreispunkt T steht senkrecht auf MT, |MT| = ${radius} cm. Begründe ihre Lage zum Kreis und gib den Mittelpunktabstand an.`,
          [
            num("Abstand =", radius, "cm", 0),
            ...(level === 1
              ? [num("Winkel =", 90, "°", 0)]
              : [
                  pick(
                    "Die Gerade ist …",
                    ["Tangente", "Sekante", "Passante"],
                    0,
                  ),
                ]),
          ],
          "Am Berührpunkt steht der Radius senkrecht auf der Tangente.",
          "Der Lotfuß ist T und liegt auf dem Kreis. Deshalb ist der Geradenabstand gleich dem Radius.",
          `Tangente; d = ${radius} cm, Winkel 90°.`,
          { radius },
        );
      },
    },
  ],
});

const tangenten = L(5, {
  id: "ol-5-tangenten-konstruktion",
  title: "5.5 Tangenten von einem äußeren Punkt",
  subtitle: "Thaleskreis als Konstruktionshilfe",
  tracks: ["I"],
  whyItMatters:
    "Der Berührpunkt ist zunächst unbekannt. Die rechte Winkelbedingung macht ihn mit dem Thaleskreis konstruierbar.",
  explanationHtml: `<p>Gegeben sind ein Kreis k(M; r) und ein äußerer Punkt P. Gesucht sind die Tangenten von P an k. Für einen Berührpunkt T muss MT senkrecht zu PT sein. Damit liegt T zugleich auf k und auf dem Thaleskreis über MP.</p><p><strong>Konstruktion:</strong> Verbinde M und P; konstruiere die Mitte H von MP; zeichne den Kreis um H mit Radius HM; schneide ihn mit k in T₁ und T₂; zeichne PT₁ und PT₂. Kontrolliere den rechten Winkel an jedem Berührpunkt.</p><div class="example">MP = 8 cm, r = 3 cm. Der Hilfskreis hat Mittelpunkt H im Abstand 4 cm von M und Radius 4 cm. Seine Schnittpunkte mit k liefern die beiden Berührpunkte. Du brauchst deren Koordinaten nicht auszurechnen.</div><p>Von einem äußeren Punkt gibt es zwei Tangenten; auf der Kreislinie eine und im Kreisinneren keine. Die beiden Tangentenabschnitte PT₁ und PT₂ sind gleich lang (rechtwinklige Dreiecke mit gemeinsamer Seite MP und gleichen Radien, SsW).</p><div class="merke"><strong>Merke:</strong> Schnitt von gegebenem Kreis und Thaleskreis über MP → Berührpunkte → Tangenten durch P.</div>`,
  formulas: [
    {
      name: "Tangenten-Konstruktion",
      html: "MT ⟂ PT ⇒ T auf dem Thaleskreis über MP",
      quantities: "P außerhalb des gegebenen Kreises",
    },
  ],
  quiz: {
    question: "Welcher Kreis hilft bei der Tangentenkonstruktion von P?",
    options: [
      "Thaleskreis über MP",
      "Kreis um P mit Radius r",
      "Kreis um M mit Radius MP",
    ],
    correctIndex: 0,
    explanation:
      "Am Berührpunkt liegt der rechte Winkel des Dreiecks MTP; deshalb ist MP der Thalesdurchmesser.",
  },
  lab: lab(
    "tangent-construction",
    "Berührpunkte finden",
    "Ziehe P auf der waagrechten Achse und blende die Konstruktionsschritte ein. Alle angebotenen P liegen außerhalb des Kreises.",
    [
      r("radius", "Radius", 2, 4, 3),
      r("d", "Abstand MP", 5, 9, 7),
      r("step", "Konstruktionsschritt", 1, 4, 1),
    ],
    [
      o("helper", "Radius des Thaleskreises", (v) => v.d / 2, "cm"),
      o("count", "Tangenten von P", () => 2),
    ],
    [
      {
        id: "hilfskreis",
        text: "Zeige bei r = 3, MP = 8 den Hilfskreis (Schritt 2).",
        check: (v) => v.radius === 3 && v.d === 8 && v.step === 2,
      },
      {
        id: "beruehrpunkte",
        text: "Zeige bei r = 2, MP = 6 beide Berührpunkte (Schritt 3).",
        check: (v) => v.radius === 2 && v.d === 6 && v.step === 3,
      },
      {
        id: "tangenten",
        text: "Zeige bei r = 4, MP = 9 die fertigen Tangenten (Schritt 4).",
        check: (v) => v.radius === 4 && v.d === 9 && v.step === 4,
      },
    ],
  ),
  exercises: [
    {
      id: "hilfskreis",
      make: (rng, level) => {
        const d = rng.int(6, 10),
          radius = rng.int(2, 4);
        return task(
          level,
          `MP = ${d} cm und r = ${radius} cm. Für Tangenten von P wird der Thaleskreis über MP gezeichnet. Bestimme seinen Radius.`,
          `Von P mit MP = ${d} cm sollen Tangenten an k(M; ${radius} cm) konstruiert werden. Bestimme den Hilfskreisradius und wähle, welche Schnittpunkte die Berührpunkte liefern.`,
          [
            num("Hilfskreisradius =", d / 2, "cm", 1),
            ...(level === 2
              ? [
                  pick(
                    "Berührpunkte sind …",
                    [
                      "Schnittpunkte von k und dem Thaleskreis über MP",
                      "M und P",
                      "die Endpunkte eines beliebigen Durchmessers von k",
                    ],
                    0,
                  ),
                ]
              : []),
          ],
          "MP ist der Durchmesser des Hilfskreises, nicht sein Radius.",
          "Halbiere MP. Die Schnittpunkte der beiden Kreise erfüllen Kreisbedingung und rechten Winkel zugleich.",
          `Hilfskreisradius ${fmt(d / 2)} cm; Schnitt mit k liefert T₁ und T₂.`,
          { d, radius },
        );
      },
    },
    {
      id: "anzahl-begruenden",
      make: (rng, level) => {
        const radius = rng.int(3, 6),
          delta = rng.pick([-1, 0, 2]),
          d = radius + delta,
          count = delta < 0 ? 0 : delta === 0 ? 1 : 2;
        return task(
          level,
          `Ein Punkt P hat MP = ${d} cm bei Kreisradius ${radius} cm. Wie viele Tangenten gehen durch P?`,
          `P liegt ${d} cm von M entfernt, der Radius ist ${radius} cm. Bestimme die Tangentenzahl. Falls zwei Tangenten existieren: Was gilt für ihre Abschnitte von P bis zum Berührpunkt?`,
          [
            num("Tangenten =", count, "", 0),
            ...(level === 2
              ? [
                  pick(
                    "Bei zwei Tangenten sind die Abschnitte …",
                    [
                      "gleich lang",
                      "immer verschieden lang",
                      "beide gleich dem Radius",
                    ],
                    0,
                  ),
                ]
              : []),
          ],
          "Innen: keine; auf dem Kreis: eine; außen: zwei.",
          `${d} ${delta < 0 ? "<" : delta === 0 ? "=" : ">"} ${radius}. Bei zwei Tangenten sind die rechtwinkligen Teildreiecke über MP kongruent.`,
          `${count} Tangenten; im äußeren Fall gleich lange Tangentenabschnitte.`,
          { radius, d },
        );
      },
    },
  ],
});

const schnitt = L(6, {
  id: "ol-6-ortsschnitte",
  title: "5.6 Ortslinien und Bereiche schneiden",
  subtitle: "„Zugleich“ bedeutet Schnittmenge",
  whyItMatters:
    "Ein Standort muss oft mehrere Bedingungen gleichzeitig erfüllen. Jede Bedingung einzeln zu erfüllen reicht dabei nicht.",
  explanationHtml: `<p>Zeichne für jede Bedingung eine eigene Ortslinie oder einen Ortsbereich. Gesucht sind bei „zugleich“ nur die gemeinsamen Punkte: die <strong>Schnittmenge</strong>. Bei „oder“ genügt eine der Bedingungen, also die Vereinigung.</p><div class="example">Ein Ort soll höchstens 3 km von A und zugleich höchstens 3 km von B entfernt sein. Zeichne beide geschlossenen Kreisscheiben. Nur die linsenförmige Überlappung ist erlaubt. Die beiden Kreisbögen am Rand gehören dazu. Bei „weniger als“ wären die betreffenden Randbögen ausgeschlossen.</div><p>„Gleich weit von A und B und genau 4 cm von A“: Schneide die Mittelsenkrechte von AB mit dem Kreis um A. Je nach Abstand entstehen 0, 1 oder 2 Lösungen. Formuliere am Ende, welche Schnittpunkte beide Vorgaben erfüllen.</p><div class="merke"><strong>Merke:</strong> Und / zugleich → Schnittmenge. Oder → Vereinigung. Prüfe jeden Rand mit dem Wortlaut der jeweiligen Bedingung.</div>`,
  formulas: [
    {
      name: "Zugleich",
      html: "P ∈ A ∩ B",
      quantities: "P erfüllt beide Bedingungen",
    },
    {
      name: "Oder",
      html: "P ∈ A ∪ B",
      quantities: "P erfüllt mindestens eine Bedingung",
    },
  ],
  quiz: {
    question:
      "Ein Punkt erfüllt nur eine von zwei Bedingungen. Gehört er zur gesuchten Menge bei „zugleich“?",
    options: [
      "Nein, beide müssen erfüllt sein.",
      "Ja, eine reicht.",
      "Nur wenn er links im Bild liegt.",
    ],
    correctIndex: 0,
    explanation: "Zugleich verlangt die Schnittmenge, also beide Bedingungen.",
  },
  lab: lab(
    "locus-intersection",
    "Zwei Funkbereiche",
    "A(−2|0), B(2|0), beide Radien 3 LE. Ziehe P und vergleiche „zugleich“ mit „oder“.",
    [
      r("x", "x von P", -5, 5, -4),
      r("y", "y von P", -4, 4, 2),
      c(
        "mode",
        "Verknüpfung",
        [
          "höchstens 3 von A und B",
          "höchstens 3 von A oder B",
          "weniger als 3 von A und B",
        ],
        0,
      ),
    ],
    [
      o("a", "Abstand zu A", (v) => Math.hypot(v.x + 2, v.y), "LE"),
      o("b", "Abstand zu B", (v) => Math.hypot(v.x - 2, v.y), "LE"),
      o("belongs", "P erlaubt", (v) => {
        const a = Math.hypot(v.x + 2, v.y),
          b = Math.hypot(v.x - 2, v.y);
        return (
          v.mode === 0
            ? a <= 3 && b <= 3
            : v.mode === 1
              ? a <= 3 || b <= 3
              : a < 3 && b < 3
        )
          ? "ja"
          : "nein";
      }),
    ],
    [
      {
        id: "beide",
        text: "Setze P(0 | 1) in den gemeinsamen geschlossenen Bereich.",
        check: (v) => v.mode === 0 && v.x === 0 && v.y === 1,
      },
      {
        id: "oder",
        text: "Wähle „oder“ und P(−4 | 0). P erfüllt nur die Bedingung zu A.",
        check: (v) => v.mode === 1 && v.x === -4 && v.y === 0,
      },
      {
        id: "rand",
        text: "Wähle „weniger als“ und P(1 | 0). Prüfe den ausgeschlossenen Rand von A.",
        check: (v) => v.mode === 2 && v.x === 1 && v.y === 0,
      },
    ],
  ),
  exercises: [
    {
      id: "beide-bedingungen",
      make: (rng, level) => {
        const radius = rng.int(3, 6),
          a = radius + rng.pick([-1, 1]),
          b = radius + rng.pick([-1, 1]),
          and = rng.pick([true, false]),
          yes = and ? a <= radius && b <= radius : a <= radius || b <= radius;
        return task(
          level,
          `P ist ${a} km von A und ${b} km von B entfernt. Erlaubt sind höchstens ${radius} km von A ${and ? "und zugleich" : "oder"} von B. Ist P erlaubt?`,
          `Ein Versorgungsgebiet verlangt höchstens ${radius} km von A ${and ? "und zugleich" : "oder"} von B. P hat die Abstände ${a} km und ${b} km. Entscheide über P und wähle die passende Mengenverknüpfung.`,
          [
            pick("P erlaubt?", ["ja", "nein"], yes ? 0 : 1),
            ...(level === 2
              ? [
                  pick(
                    "Verknüpfung",
                    ["Schnittmenge", "Vereinigung"],
                    and ? 0 : 1,
                  ),
                ]
              : []),
          ],
          "Prüfe beide Vergleiche einzeln, danach und oder oder.",
          `${a} ≤ ${radius}: ${a <= radius ? "wahr" : "falsch"}; ${b} ≤ ${radius}: ${b <= radius ? "wahr" : "falsch"}. ${and ? "Beide müssen wahr sein." : "Mindestens eine wahre Bedingung reicht."}`,
          `P ${yes ? "erlaubt" : "nicht erlaubt"}; ${and ? "Schnittmenge" : "Vereinigung"}.`,
          { radius, a, b, and: Number(and) },
        );
      },
    },
    {
      id: "kreis-mitte",
      make: (rng, level) => {
        const half = rng.int(2, 5),
          mode = rng.int(0, 2),
          radius = half + mode - 1,
          count = mode === 0 ? 0 : mode === 1 ? 1 : 2;
        return task(
          level,
          `A und B sind ${2 * half} cm voneinander entfernt. Wie oft schneidet die Mittelsenkrechte von AB den Kreis um A mit Radius ${radius} cm?`,
          `Ein Ort soll gleich weit von A und B (${2 * half} cm Abstand) und genau ${radius} cm von A entfernt sein. Bestimme die Lösungszahl und wähle die Konstruktionsidee.`,
          [
            num("Lösungen =", count, "", 0),
            ...(level === 2
              ? [
                  pick(
                    "Konstruktion",
                    [
                      "Mittelsenkrechte ∩ Kreis um A",
                      "zwei beliebige parallele Geraden",
                      "nur Kreis um B",
                    ],
                    0,
                  ),
                ]
              : []),
          ],
          "Der kürzeste Abstand von A zur Mittelsenkrechten ist die halbe Strecke AB.",
          `Vergleiche r = ${radius} cm mit AB : 2 = ${half} cm. Unterhalb gibt es keinen, bei Gleichheit einen, darüber zwei Schnittpunkte.`,
          `${count} Lösungen.`,
          { half, radius },
        );
      },
    },
  ],
});

const zentren = L(7, {
  id: "ol-7-umkreis-inkreis",
  title: "5.7 Umkreis und Inkreis",
  subtitle: "Die passende Halbierende wählt den Mittelpunkt",
  whyItMatters:
    "Ein Kreis durch alle Ecken und ein Kreis an allen Seiten brauchen verschiedene Mittelpunkte. Du findest sie als Schnitt passender Ortslinien.",
  explanationHtml: `<p>Der <strong>Umkreismittelpunkt U</strong> liegt gleich weit von allen drei Eckpunkten entfernt. Konstruiere zwei Mittelsenkrechte der Dreiecksseiten; ihr Schnitt ist U. Die dritte Mittelsenkrechte geht ebenfalls durch U. Der Kreis um U durch eine Ecke geht durch alle Ecken. U kann innen, außen oder beim rechtwinkligen Dreieck auf der Seitenmitte liegen.</p><p>Der <strong>Inkreismittelpunkt I</strong> liegt im Dreiecksinneren gleich weit von den drei Seiten entfernt. Konstruiere zwei innere Winkelhalbierende. Fälle von I ein Lot auf eine Seite: Diese Lotlänge ist der Inkreisradius. Verbinde I nicht einfach mit einer Ecke, um den Radius zu erhalten.</p><div class="example">Bei einem gleichseitigen Dreieck fallen U und I zusammen. Bei einem stumpfwinkligen Dreieck liegt U außerhalb, I weiterhin innerhalb. Für beide Konstruktionen reichen zwei Ortslinien; die dritte dient als Kontrolle.</div><div class="merke"><strong>Merke:</strong> Umkreis: Mittelsenkrechte, Abstand zu Ecken. Inkreis: Winkelhalbierende, senkrechter Abstand zu Seiten.</div>`,
  formulas: [
    {
      name: "Umkreismittelpunkt",
      html: "UA = UB = UC",
      quantities: "Schnitt der Mittelsenkrechten",
    },
    {
      name: "Inkreismittelpunkt",
      html: "d(I, AB) = d(I, BC) = d(I, CA)",
      quantities: "Schnitt der inneren Winkelhalbierenden",
    },
  ],
  quiz: {
    question: "Wie bestimmst du den Radius des Inkreises?",
    options: [
      "Lot vom Inkreismittelpunkt auf eine Seite.",
      "Strecke vom Inkreismittelpunkt zu einer Ecke.",
      "Halbe längste Dreiecksseite.",
    ],
    correctIndex: 0,
    explanation:
      "Der Kreis berührt die Seiten; der Berührradius steht senkrecht auf der Seite.",
  },
  lab: lab(
    "triangle-centres",
    "Dreieckskreise konstruieren",
    "A(−3|0), B(3|0), C(x|h). Ziehe C und wähle Umkreis oder Inkreis. Die Hilfslinien zeigen den Mittelpunkt.",
    [
      r("x", "x von C", -2, 2, 1),
      r("h", "Höhe von C", 1, 5, 3),
      c("mode", "Kreis", ["Umkreis", "Inkreis"], 0),
    ],
    [
      o("location", "Umkreismittelpunkt", (v) =>
        (v.x * v.x + v.h * v.h - 9) / (2 * v.h) < 0
          ? "unterhalb der Grundseite"
          : "auf / oberhalb der Grundseite",
      ),
      o("method", "Hilfslinien", (v) =>
        v.mode === 0 ? "Mittelsenkrechte" : "innere Winkelhalbierende",
      ),
    ],
    [
      {
        id: "aussen",
        text: "Zeige den Umkreis für C(0 | 1): Mittelpunkt außerhalb.",
        check: (v) => v.mode === 0 && v.x === 0 && v.h === 1,
      },
      {
        id: "recht",
        text: "Zeige den Umkreis für C(0 | 3): Mittelpunkt auf AB.",
        check: (v) => v.mode === 0 && v.x === 0 && v.h === 3,
      },
      {
        id: "inkreis",
        text: "Zeige den Inkreis für C(1 | 4).",
        check: (v) => v.mode === 1 && v.x === 1 && v.h === 4,
      },
    ],
  ),
  exercises: [
    {
      id: "mittelpunkt-waehlen",
      make: (rng, level) => {
        const mode = rng.int(0, 1);
        return task(
          level,
          `Du konstruierst den ${mode === 0 ? "Umkreis" : "Inkreis"} eines Dreiecks. Welche Hilfslinien brauchst du und wovon ist der Mittelpunkt gleich weit entfernt?`,
          `Ein Kreis soll ${mode === 0 ? "durch alle drei Dreiecksecken gehen" : "alle drei Dreiecksseiten berühren"}. Wähle die Konstruktion und die richtige Radiusbestimmung.`,
          [
            pick(
              "Hilfslinien",
              [
                "Mittelsenkrechte",
                "innere Winkelhalbierende",
                "Seitenhalbierende",
              ],
              mode,
            ),
            pick(
              "Radius",
              ["Abstand zur Ecke", "senkrechter Abstand zur Seite"],
              mode,
            ),
          ],
          "Unterscheide Punktabstände und Geradenabstände.",
          mode === 0
            ? "Die Mittelsenkrechten liefern gleiche Abstände zu A, B, C; der Radius führt zu einer Ecke."
            : "Die Winkelhalbierenden liefern gleiche senkrechte Abstände zu den Seiten; eine Lotstrecke ist der Radius.",
          `${mode === 0 ? "Umkreis: Mittelsenkrechte und Eckabstand" : "Inkreis: Winkelhalbierende und Lot auf eine Seite"}.`,
          { mode },
        );
      },
    },
    {
      id: "lage-kontrolle",
      make: (rng, level) => {
        const hyp = rng.int(3, 7) * 2;
        return task(
          level,
          `Ein rechtwinkliges Dreieck hat eine dem rechten Winkel gegenüberliegende Seite der Länge ${hyp} cm. Wo liegt U und wie groß ist der Umkreisradius?`,
          `Eine Schülerin sagt: „Umkreismittelpunkte liegen immer innen, Inkreismittelpunkte auch.“ Prüfe dies mit einem rechtwinkligen Dreieck, dessen längste Seite ${hyp} cm lang ist. Bestimme seinen Umkreisradius.`,
          [
            num("Umkreisradius =", hyp / 2, "cm", 0),
            pick(
              level === 1 ? "Lage von U" : "Aussage über beide Mittelpunkte",
              level === 1
                ? [
                    "Mitte der längsten Dreiecksseite",
                    "Innerer Schnittpunkt der drei Winkelhalbierenden",
                    "Rechter Eckpunkt des gegebenen Dreiecks",
                  ]
                : [
                    "U kann außen liegen; I liegt innen.",
                    "U liegt immer innen; I kann außen liegen.",
                    "U und I liegen bei jedem Dreieck innen.",
                  ],
              0,
            ),
          ],
          "Thaleskreis: Die längste Seite ist hier der Durchmesser.",
          "Beim rechtwinkligen Dreieck ist U die Mitte der längsten Seite. Bei stumpfwinkligen Dreiecken liegt U außen; I liegt immer innen.",
          `r = ${hyp / 2} cm; U liegt auf der Seitenmitte.`,
          { hyp },
        );
      },
    },
  ],
});

const schwerpunkt = L(8, {
  id: "ol-8-schwerpunkt",
  title: "5.8 Seitenhalbierende und Schwerpunkt",
  subtitle: "Drei Verbindungen treffen sich im Verhältnis 2 : 1",
  tracks: ["I"],
  whyItMatters:
    "Der Schwerpunkt einer gleichmäßig dicken Dreiecksfläche ist ein geometrisch bestimmbarer Balancepunkt. Er ist nicht allgemein ein Kreismittelpunkt.",
  explanationHtml: `<p>Eine <strong>Seitenhalbierende</strong> verbindet einen Eckpunkt mit der Mitte der gegenüberliegenden Seite. Die drei Seitenhalbierenden treffen sich im Schwerpunkt S. Er liegt immer im Dreiecksinneren und teilt jede Seitenhalbierende im Verhältnis 2 : 1, vom Eckpunkt aus gesehen.</p><p>Für die Konstruktion bestimmst du zwei Seitenmitten und verbindest sie jeweils mit der gegenüberliegenden Ecke. Der Schnitt ist S; die dritte Seitenhalbierende dient zur Kontrolle. Bei Koordinaten ist S der Mittelwert der drei x- und der drei y-Koordinaten.</p><div class="example">Eine Seitenhalbierende CM ist 9 cm lang. Vom Eckpunkt C bis S sind es 6 cm, von S bis M 3 cm. Bei A(0|0), B(6|0), C(0|6) ist S(2|2).</div><div class="merke"><strong>Merke:</strong> Seitenhalbierende halbiert eine Seite, Winkelhalbierende einen Winkel, Mittelsenkrechte steht senkrecht auf einer Seite. Diese Geraden sind im Allgemeinen verschieden.</div>`,
  formulas: [
    {
      name: "Schwerpunkt",
      html: "CS : SM = 2 : 1; CS = ⅔ CM",
      quantities: "M Mitte der Seite AB",
    },
    {
      name: "Koordinaten",
      html: "S((x<sub>A</sub> + x<sub>B</sub> + x<sub>C</sub>) : 3 | (y<sub>A</sub> + y<sub>B</sub> + y<sub>C</sub>) : 3)",
      quantities: "Mittelwerte der drei Eckkoordinaten",
    },
  ],
  quiz: {
    question:
      "CM = 12 cm ist eine Seitenhalbierende. Wie weit liegt S vom Eckpunkt C entfernt?",
    options: ["8 cm", "6 cm", "4 cm"],
    correctIndex: 0,
    explanation:
      "Vom Eckpunkt aus sind es zwei der drei Teile: ⅔ · 12 cm = 8 cm.",
  },
  lab: lab(
    "centroid",
    "Seitenhalbierende ziehen",
    "A(−3|0), B(3|0) bleiben fest. Ziehe C. Der Schwerpunkt folgt, und alle drei Seitenhalbierenden schneiden sich weiterhin.",
    [r("x", "x von C", -3, 3, 1), r("h", "Höhe von C", 1, 6, 4)],
    [
      o("sx", "x von S", (v) => v.x / 3),
      o("sy", "y von S", (v) => v.h / 3),
      o("ratio", "Teilungsverhältnis von C aus", () => "2 : 1"),
    ],
    [
      {
        id: "symmetrisch",
        text: "Setze C(0 | 6) und lies S(0 | 2) ab.",
        check: (v) => v.x === 0 && v.h === 6,
      },
      {
        id: "rechts",
        text: "Setze C(3 | 3) und lies S(1 | 1) ab.",
        check: (v) => v.x === 3 && v.h === 3,
      },
      {
        id: "links",
        text: "Setze C(−3 | 6) und lies S(−1 | 2) ab.",
        check: (v) => v.x === -3 && v.h === 6,
      },
    ],
  ),
  exercises: [
    {
      id: "teilungsverhaeltnis",
      make: (rng, level) => {
        const part = rng.int(2, 6);
        return task(
          level,
          `Die Seitenhalbierende CM ist ${3 * part} cm lang. Berechne CS und SM, wobei S der Schwerpunkt ist.`,
          `Ein Schwerpunkt S liegt auf CM mit CS = ${2 * part} cm. Bestimme die ganze Seitenhalbierende und das Reststück SM.`,
          [
            num(
              level === 1 ? "CS =" : "CM =",
              level === 1 ? 2 * part : 3 * part,
              "cm",
              0,
            ),
            num("SM =", part, "cm", 0),
          ],
          "Vom Eckpunkt aus teilt S im Verhältnis 2 : 1.",
          "Zerlege die Seitenhalbierende in drei gleich große Teile; zwei liegen zwischen C und S.",
          `CM = ${3 * part} cm; CS = ${2 * part} cm; SM = ${part} cm.`,
          { part },
        );
      },
    },
    {
      id: "koordinaten",
      make: (rng, level) => {
        const b = rng.int(1, 4) * 3,
          x = rng.int(-2, 2) * 3,
          h = rng.int(1, 3) * 3;
        return task(
          level,
          `A(0|0), B(${b}|0), C(${fmt(x)}|${h}). Berechne den Schwerpunkt S.`,
          `Ein dreieckiges Schild hat Ecken A(0|0), B(${b}|0), C(${fmt(x)}|${h}). Bestimme seinen Schwerpunkt und entscheide, ob dieser zugleich immer der Umkreismittelpunkt ist.`,
          [
            num("x von S =", (b + x) / 3, "", 0),
            num("y von S =", h / 3, "", 0),
            ...(level === 2
              ? [
                  pick(
                    "S ist immer U?",
                    ["nein", "ja", "nur bei negativen Koordinaten"],
                    0,
                  ),
                ]
              : []),
          ],
          "Bilde den Mittelwert der drei x- und der drei y-Koordinaten.",
          `x_S = (${sum([
            [0, ""],
            [b, ""],
            [x, ""],
          ])}) : 3; y_S = ${h} : 3. Seitenhalbierende und Mittelsenkrechte sind verschiedene Konstruktionen.`,
          `S(${fmt((b + x) / 3)}|${h / 3}); nicht allgemein U.`,
          { b, x, h },
        );
      },
    },
  ],
});
export const STAGE_ORTSLINIEN = makeStage(
  5,
  "Geometrische Ortslinien und Ortsbereiche",
  "Abstandsbedingungen, Thales und Dreiecksmittelpunkte",
  "#059669",
  "◎",
  [5, 3],
  [
    kreis,
    halbierende,
    thales,
    kreisgerade,
    tangenten,
    schnitt,
    zentren,
    schwerpunkt,
  ],
);
