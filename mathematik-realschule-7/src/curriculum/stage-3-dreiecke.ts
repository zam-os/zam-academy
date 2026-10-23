import { fmt } from "../exercises/format";
import { validTriangle } from "../models";
import { numberField as num, choiceField as pick } from "./helpers";
import {
  lab,
  range as r,
  output as o,
  makeLesson as lesson,
  makeStage,
  task,
} from "./builders";
const L = (step: number, content: Parameters<typeof lesson>[3]) =>
  lesson(3, step, [3, null], content);

const existenz = L(1, {
  id: "dr-1-existenz",
  title: "3.1 Wann existiert ein Dreieck?",
  subtitle: "Dreiecksungleichung und Winkel prüfen",
  whyItMatters:
    "Bevor du konstruierst, prüfst du, ob die Angaben überhaupt eine Figur zulassen. Das spart vergebliche Konstruktionsversuche.",
  explanationHtml: `<p>In jedem Dreieck ist jede Seite kürzer als die Summe der beiden anderen. Es reicht, die <strong>längste</strong> Seite mit der Summe der beiden kürzeren zu vergleichen. Gleichheit ergibt nur eine gestreckte Strecke, kein Dreieck. Alle Seiten müssen positiv sein.</p><p>Außerdem liegt der größeren Seite stets der größere Winkel gegenüber; gleichen Seiten liegen gleiche Winkel gegenüber. Ein Dreieck mit a &gt; b und zugleich α &lt; β ist deshalb unmöglich. Auch Winkelangaben müssen zusammenpassen: Jeder Innenwinkel liegt zwischen 0° und 180°; ihre Summe beträgt 180°. Bei zwei Winkeln muss ihre Summe kleiner als 180° sein.</p><div class="example">3 cm, 4 cm und 8 cm: 3 + 4 = 7 &lt; 8, also kein Dreieck. Bei 3 cm, 4 cm und 6 cm gilt 7 &gt; 6, also ist ein Dreieck möglich. Bei α = 50° und β = 70° bleibt γ = 60°.</div><div class="merke"><strong>Merke:</strong> Die Summe der beiden kürzeren Seiten muss größer als die längste sein. Ein Winkelrest von 0° reicht nicht.</div>`,
  formulas: [
    {
      name: "Dreiecksungleichung",
      html: "a + b &gt; c; a + c &gt; b; b + c &gt; a",
      quantities: "positive Seitenlängen",
    },
    {
      name: "Winkelbedingung",
      html: "α + β + γ = 180°; α, β, γ &gt; 0°",
      quantities: "Innenwinkel",
    },
  ],
  quiz: {
    question: "Welche Seitenlängen lassen ein Dreieck zu?",
    options: ["3 cm, 4 cm, 6 cm", "3 cm, 4 cm, 7 cm", "3 cm, 4 cm, 8 cm"],
    correctIndex: 0,
    explanation: "Nur bei 6 cm ist die längste Seite kürzer als 3 cm + 4 cm.",
  },
  lab: lab(
    "triangle-existence",
    "Seitenlängen testen",
    "Ändere die Seiten. Die Kreisbögen schneiden sich bei einem möglichen Dreieck; bei Gleichheit liegen die Punkte auf einer Geraden.",
    [
      r("a", "Seite a", 1, 9, 3),
      r("b", "Seite b", 1, 9, 4),
      r("c", "Seite c", 1, 9, 5),
    ],
    [
      o("possible", "Dreieck", (v) =>
        validTriangle(v.a, v.b, v.c) ? "möglich" : "nicht möglich",
      ),
      o(
        "gap",
        "Summe der kürzeren minus längste Seite",
        (v) => v.a + v.b + v.c - 2 * Math.max(v.a, v.b, v.c),
        "cm",
      ),
    ],
    [
      {
        id: "grenze",
        text: "Stelle a = 3 cm, b = 4 cm, c = 7 cm ein: Grenzfall ohne Dreieck.",
        check: (v) => v.a === 3 && v.b === 4 && v.c === 7,
      },
      {
        id: "unmoeglich",
        text: "Finde einen Fall, in dem die längste Seite größer als die Summe der anderen ist.",
        check: (v) => v.a + v.b + v.c < 2 * Math.max(v.a, v.b, v.c),
      },
      {
        id: "gleichseitig",
        text: "Erzeuge ein gleichseitiges Dreieck mit 4 cm Seitenlänge.",
        check: (v) => v.a === 4 && v.b === 4 && v.c === 4,
      },
    ],
  ),
  exercises: [
    {
      id: "seiten-pruefen",
      make: (rng, level) => {
        const a = rng.int(2, 5),
          b = rng.int(3, 6),
          delta = rng.pick([-1, 0, 1]),
          c = a + b + delta;
        return task(
          level,
          `Prüfe die Seiten ${a} cm, ${b} cm und ${c} cm. Ist ein Dreieck möglich?`,
          `Zwei Stäbe sind ${a} cm und ${b} cm lang. Ein dritter soll ganzzahlig sein. Gib die größte mögliche Länge an und entscheide, ob ${c} cm zulässig wären.`,
          [
            ...(level === 2 ? [num("größte Länge =", a + b - 1, "cm", 0)] : []),
            pick(
              "Dreieck mit den drei genannten Längen?",
              ["möglich", "nicht möglich"],
              delta < 0 ? 0 : 1,
            ),
          ],
          "Vergleiche die längste Seite mit der Summe der beiden anderen.",
          `${a} + ${b} = ${a + b}. Die dritte Seite muss kleiner als diese Summe und größer als ${Math.abs(a - b)} sein.`,
          `${delta < 0 ? "Dreieck möglich" : "Kein Dreieck"}; größte ganzzahlige Länge ${a + b - 1} cm.`,
          { a, b, c },
        );
      },
    },
    {
      id: "winkel-pruefen",
      make: (rng, level) => {
        const a = rng.int(4, 10) * 10,
          b = rng.int(4, 10) * 10,
          g = 180 - a - b;
        return task(
          level,
          `Ein Dreieck soll α = ${a}° und β = ${b}° haben. Berechne den Winkelrest und entscheide, ob das möglich ist.`,
          `Eine Konstruktion liefert α = ${a}° und β = ${b}°. Ein Mitschüler akzeptiert auch einen Winkelrest von 0°. Berechne den Rest und prüfe seine Aussage für diese Angaben.`,
          [
            num("Winkelrest =", g, "°", 0),
            pick(
              "Angaben möglich?",
              ["ja, drei positive Winkel", "nein, Rest ist nicht positiv"],
              g > 0 ? 0 : 1,
            ),
          ],
          "Rest = 180° − α − β; der Rest muss positiv sein.",
          `180° − ${a}° − ${b}° = ${fmt(g)}°. Ein Nullwinkel ist kein Innenwinkel eines Dreiecks.`,
          `${fmt(g)}°; ${g > 0 ? "möglich" : "nicht möglich"}.`,
          { a, b, g },
        );
      },
    },
    {
      id: "seiten-winkel-ordnung",
      make: (rng, level) => {
        const a = rng.int(6, 9),
          b = rng.int(2, 4),
          correct = rng.pick([true, false]),
          alpha = correct ? 80 : 40,
          beta = correct ? 40 : 80;
        return task(
          level,
          `Prüfe die Reihenfolge: a = ${a} cm > b = ${b} cm, α = ${alpha}°, β = ${beta}°. Passt die Seiten-Winkel-Ordnung?`,
          `Ein Dreieck soll a = ${a} cm, b = ${b} cm, α = ${alpha}° und β = ${beta}° haben. Prüfe einen Widerspruch zur Seiten-Winkel-Ordnung und entscheide, ob das allein eine vollständige Konstruktionsprüfung ersetzt.`,
          [
            pick("Reihenfolge passt?", ["ja", "nein"], correct ? 0 : 1),
            ...(level === 2
              ? [
                  pick(
                    "Reihenfolge allein genügt als vollständiger Existenznachweis?",
                    ["nein", "ja"],
                    0,
                  ),
                ]
              : []),
          ],
          "Der größeren Seite liegt der größere Winkel gegenüber.",
          `Weil a > b, muss α > β gelten. Das ist hier ${correct ? "erfüllt" : "nicht erfüllt"}. Eine erfüllte Reihenfolge ersetzt nicht die Prüfung aller gegebenen Größen.`,
          `${correct ? "Kein Widerspruch aus der Reihenfolge" : "Widerspruch: kein solches Dreieck"}.`,
          { a, b, alpha, beta },
        );
      },
    },
  ],
});

const konstruktion = L(2, {
  id: "dr-2-konstruktion",
  title: "3.2 Dreiecke konstruieren",
  subtitle: "SSS, SWS und WSW mit Zirkel, Lineal und Software",
  whyItMatters:
    "Eine Konstruktion muss sich aus den gegebenen Größen ergeben. Eine Skizze nach Augenmaß kann die Angaben nur ungefähr treffen.",
  explanationHtml: `<p>Beginne mit einer Planfigur und markiere Gegebenes. <strong>SSS:</strong> Zeichne AB = c. Zeichne um A einen Kreis mit Radius b und um B einen Kreis mit Radius a. Ein Schnittpunkt ist C. Die beiden Schnittpunkte ergeben spiegelbildliche, kongruente Dreiecke.</p><p><strong>SWS:</strong> Zeichne die erste Seite, trage an ihrem Ende den eingeschlossenen Winkel ab und auf dessen Schenkel die zweite Seite. Verbinde zum dritten Eckpunkt. <strong>WSW:</strong> Zeichne die eingeschlossene Seite, trage an beiden Enden die gegebenen Winkel auf derselben Seite von AB ab. Der Schnitt der Schenkel ist C. Bei SWW berechnest du zunächst den fehlenden Winkel.</p><p>In Geometriesoftware verwendest du Strecke fester Länge, Kreis und Schnittpunkt bzw. Strahl mit festem Winkel. Verschiebe die Grundstrecke zur Kontrolle: Die abhängigen Punkte müssen die Bedingungen weiter erfüllen. Im Labor zeigt der Schieberegler die Konstruktionsschritte; führe danach eine Konstruktion mit Zirkel und Geodreieck aus.</p><div class="example">SSS mit a = 4 cm, b = 5 cm, c = 6 cm: AB = 6 cm; Kreis um A mit r = 5 cm; Kreis um B mit r = 4 cm; Schnittpunkt C wählen und verbinden. Kontrolliere BC = 4 cm und AC = 5 cm.</div><div class="merke"><strong>Merke:</strong> Beschreibe die Konstruktionsschritte und kontrolliere alle Vorgaben. Der Winkel bei SWS liegt zwischen den beiden gegebenen Seiten.</div>`,
  formulas: [
    {
      name: "SSS",
      html: "Grundseite → zwei Kreise → Schnittpunkt",
      quantities: "drei Seiten",
    },
    {
      name: "SWS / WSW",
      html: "eingeschlossener Winkel / eingeschlossene Seite",
      quantities: "Lage der gegebenen Größen beachten",
    },
  ],
  quiz: {
    question: "Welche Radien braucht die SSS-Konstruktion über AB = c?",
    options: [
      "Kreis um A: b; Kreis um B: a",
      "Beide Kreise: c",
      "Kreis um A: a; Kreis um B: b",
    ],
    correctIndex: 0,
    explanation:
      "AC = b ist der Abstand von C zu A; BC = a ist der Abstand zu B.",
  },
  lab: lab(
    "triangle-construction",
    "Konstruktionsfolge SSS",
    "Die Schritte zeigen Grundseite, Kreisbögen und Schnittpunkt. Wähle passende Seiten und überprüfe die Konstruktion anschließend auf Papier.",
    [
      r("a", "a", 2, 7, 4),
      r("b", "b", 2, 7, 5),
      r("c", "c", 2, 7, 6),
      r("step", "Konstruktionsschritt", 1, 4, 1),
    ],
    [
      o("possible", "Angaben", (v) =>
        validTriangle(v.a, v.b, v.c) ? "konstruierbar" : "nicht konstruierbar",
      ),
    ],
    [
      {
        id: "kreise",
        text: "Zeige im Beispiel 4–5–6 beide Konstruktionskreise (Schritt 3).",
        check: (v) => v.a === 4 && v.b === 5 && v.c === 6 && v.step === 3,
      },
      {
        id: "gleichseitig",
        text: "Konstruiere ein gleichseitiges Dreieck mit 5 cm (Schritt 4).",
        check: (v) => v.a === 5 && v.b === 5 && v.c === 5 && v.step === 4,
      },
      {
        id: "grenze",
        text: "Zeige in Schritt 3, warum 2–3–5 kein Dreieck ergibt.",
        check: (v) => v.a === 2 && v.b === 3 && v.c === 5 && v.step === 3,
      },
    ],
  ),
  exercises: [
    {
      id: "konstruktionsplan",
      make: (rng, level) => {
        const a = rng.int(3, 5),
          b = rng.int(4, 6),
          c = rng.int(4, 6);
        return task(
          level,
          `Du konstruierst SSS mit a = ${a} cm, b = ${b} cm, c = ${c} cm. Welche Radien verwendest du um A und B?`,
          `Eine Software zeichnet AB = ${c} cm und soll AC = ${b} cm sowie BC = ${a} cm sicher einhalten. Wähle die abhängige Konstruktion und gib beide Kreisradien an.`,
          [
            num("Radius um A =", b, "cm", 0),
            num("Radius um B =", a, "cm", 0),
            ...(level === 2
              ? [
                  pick(
                    "Punkt C erzeugen durch …",
                    [
                      "Schnittpunkt beider Kreise",
                      "freien Punkt nach Augenmaß",
                      "Mittelpunkt von AB",
                    ],
                    0,
                  ),
                ]
              : []),
          ],
          "C hat von A den Abstand b und von B den Abstand a.",
          "Zuerst AB zeichnen, dann beide Abstandskreise. Der Schnittpunkt erfüllt beide Bedingungen zugleich.",
          `r_A = ${b} cm, r_B = ${a} cm; C ist ein Kreisschnittpunkt.`,
          { a, b, c },
        );
      },
    },
    {
      id: "winkelplan",
      make: (rng, level) => {
        const a = rng.int(3, 7) * 10,
          b = rng.int(3, 7) * 10,
          g = 180 - a - b;
        return task(
          level,
          `Gegeben sind c = 6 cm, α = ${a}° und β = ${b}°. Welcher Konstruktionsfall liegt vor und wie groß ist γ?`,
          `Gegeben sind c = 6 cm, α = ${a}° und γ = ${g}°. Berechne β, damit du über AB mit WSW konstruieren kannst. Wo treffen sich die Winkelschenkel?`,
          [
            num(level === 1 ? "γ =" : "β =", level === 1 ? g : b, "°", 0),
            pick(
              level === 1 ? "Fall" : "Punkt C ist …",
              level === 1
                ? ["WSW", "SSS", "SWS"]
                : [
                    "Schnittpunkt der Schenkel bei A und B",
                    "Mittelpunkt von AB",
                    "beliebiger Punkt auf einem Kreis",
                  ],
              0,
            ),
          ],
          "Innenwinkelsumme 180°; die Seite c liegt zwischen α und β.",
          `Die Winkel ergänzen sich zu 180°. Die Schenkel bei A und B auf derselben Seite der Grundstrecke schneiden sich in C.`,
          `${level === 1 ? `γ = ${g}°; WSW` : `β = ${b}°; C ist der Schenkelschnittpunkt`}.`,
          { a, b, g },
        );
      },
    },
  ],
});

const kongruenz = L(3, {
  id: "dr-3-kongruenz",
  title: "3.3 Kongruenzsätze sicher unterscheiden",
  subtitle: "Auch der Sonderfall SsW hat eine Bedingung",
  whyItMatters:
    "Drei Angaben machen ein Dreieck nicht automatisch eindeutig. Kongruenzsätze zeigen, wann zwei Dreiecke deckungsgleich sein müssen.",
  explanationHtml: `<p>Deckungsgleiche Dreiecke heißen <strong>kongruent</strong>. SSS, SWS und WSW (auch SWW nach Ergänzung des dritten Winkels) legen ein Dreieck bis auf seine Lage und eine Spiegelung eindeutig fest.</p><p>Bei <strong>SsW</strong> sind zwei Seiten und ein nicht eingeschlossener Winkel gegeben. Eindeutigkeit besteht, wenn der Winkel der <em>längeren</em> gegebenen Seite gegenüberliegt. Ist der Winkel der kürzeren Seite gegenüber, können zwei verschiedene Dreiecke entstehen. WWW legt nur die Form fest, nicht die Größe.</p><div class="example">a = 6 cm, b = 4 cm und α = 50°: α liegt der längeren gegebenen Seite a gegenüber, also SsW. Dagegen a = 4 cm, b = 6 cm und α = 30°: Ein Kreis um B mit Radius 4 cm schneidet den Winkelschenkel von A zweimal; zwei nicht kongruente Dreiecke sind möglich.</div><div class="merke"><strong>Merke:</strong> Prüfe bei SWS den eingeschlossenen Winkel und bei SsW die gegenüberliegende längere Seite. WWW ist kein Kongruenzsatz.</div>`,
  formulas: [
    {
      name: "Kongruenzsätze",
      html: "SSS · SWS · WSW · SsW",
      quantities: "bei SsW: Winkel gegenüber der längeren gegebenen Seite",
    },
  ],
  quiz: {
    question: "Warum ist WWW kein Kongruenzsatz?",
    options: [
      "Die Seitenlängen können verschieden groß sein.",
      "Die Winkelsumme ist dann nicht 180°.",
      "Ein Dreieck hat nur zwei Winkel.",
    ],
    correctIndex: 0,
    explanation:
      "Dreiecke mit gleichen Winkeln können verschieden groß sein, z. B. gleichseitige Dreiecke mit 3 cm und 6 cm.",
  },
  lab: lab(
    "triangle-ssw",
    "Zweideutigkeit entdecken",
    "AB = 6 cm und α = 30° bleiben fest. Der Kreis mit Radius a schneidet den Winkelschenkel von A. Zähle die nicht entarteten Lösungen.",
    [
      r("a", "Gegenüberliegende Seite a", 2, 8, 4),
      r("step", "Sichtbare Konstruktion", 1, 3, 1),
    ],
    [
      o("count", "Lösungen", (v) =>
        v.a < 3 ? 0 : v.a === 3 ? 1 : v.a < 6 ? 2 : 1,
      ),
    ],
    [
      {
        id: "zwei",
        text: "Zeige bei a = 4 cm in Schritt 3 beide möglichen Dreiecke.",
        check: (v) => v.a === 4 && v.step === 3,
      },
      {
        id: "eine",
        text: "Zeige bei a = 7 cm die eindeutige SsW-Konstruktion (Schritt 3).",
        check: (v) => v.a === 7 && v.step === 3,
      },
      {
        id: "keine",
        text: "Finde bei a = 2 cm und Schritt 3 einen Fall ohne Lösung.",
        check: (v) => v.a === 2 && v.step === 3,
      },
    ],
  ),
  exercises: [
    {
      id: "satz-erkennen",
      make: (rng, level) => {
        const mode = rng.int(0, 2),
          angle = rng.int(4, 8) * 10;
        const specs = [
          `a = 4 cm, b = 5 cm, c = 6 cm`,
          `b = 4 cm, c = 6 cm, α = ${angle}°`,
          `c = 6 cm, α = ${angle}°, β = 50°`,
        ];
        return task(
          level,
          `Entscheide den Kongruenzsatz für diese Angaben: ${specs[mode]}.`,
          `Zwei Dreiecke stimmen in folgenden Größen überein: ${specs[mode]}. Wähle den Kongruenzsatz und entscheide, ob auch die übrigen entsprechenden Größen gleich sind.`,
          [
            pick("Kongruenzsatz", ["SSS", "SWS", "WSW"], mode),
            ...(level === 2
              ? [
                  pick(
                    "Übrige entsprechende Seiten und Winkel",
                    [
                      "müssen gleich sein",
                      "dürfen beliebig sein",
                      "nur Winkel sind gleich",
                    ],
                    0,
                  ),
                ]
              : []),
          ],
          "Ordne die gegebenen Seiten und Winkel in einer Planfigur an.",
          `Die Angaben erfüllen ${["SSS", "SWS", "WSW"][mode]}. Eine Kongruenzabbildung erhält alle entsprechenden Seiten und Winkel.`,
          `${["SSS", "SWS", "WSW"][mode]}: Dreiecke sind kongruent.`,
          { mode, angle },
        );
      },
    },
    {
      id: "ssw-pruefen",
      make: (rng, level) => {
        const long = rng.int(6, 9),
          short = rng.int(3, 5),
          oppositeLong = rng.pick([true, false]);
        return task(
          level,
          `Gegeben sind zwei Seiten ${short} cm und ${long} cm sowie ein Winkel gegenüber der ${oppositeLong ? "längeren" : "kürzeren"} Seite. Garantiert SsW die Eindeutigkeit?`,
          `Eine Schülerin behauptet, zwei Seiten ${short} cm und ${long} cm und jeder nicht eingeschlossene Winkel ergäben immer genau ein Dreieck. Der Winkel liegt gegenüber der ${oppositeLong ? "längeren" : "kürzeren"} Seite. Prüfe den Kongruenznachweis und nenne die entscheidende Bedingung.`,
          [
            pick(
              "SsW-Kongruenzsatz anwendbar?",
              ["ja, gegenüber der längeren Seite", "nicht garantiert"],
              oppositeLong ? 0 : 1,
            ),
            ...(level === 2
              ? [
                  pick(
                    "Für den Satz entscheidend ist …",
                    [
                      "welcher gegebenen Seite der Winkel gegenüberliegt",
                      "die Lage auf dem Zeichenblatt",
                      "die Farbe der beiden Seiten",
                    ],
                    0,
                  ),
                ]
              : []),
          ],
          "Das große S bezeichnet die längere der beiden gegebenen Seiten.",
          "Gegenüber der längeren Seite genügt der Winkel. Gegenüber der kürzeren ist ohne weitere Prüfung kein Eindeutigkeitsnachweis möglich.",
          `${oppositeLong ? "SsW anwendbar" : "Kein gesicherter Kongruenznachweis"}.`,
          { long, short, oppositeLong: Number(oppositeLong) },
        );
      },
    },
  ],
});

const begruenden = L(4, {
  id: "dr-4-begruenden",
  title: "3.4 Mit Kongruenz begründen",
  subtitle: "Aus gleichen Dreiecken neue Eigenschaften folgern",
  whyItMatters:
    "Ein Beweis erklärt, warum eine Eigenschaft für alle passenden Figuren gilt. Das Messen einer einzelnen Zeichnung kann das nicht leisten.",
  explanationHtml: `<p>Eine Kongruenzbegründung hat drei Schritte: <strong>passende Dreiecke benennen</strong>, drei entsprechende Größen mit ihrem Grund angeben, dann den Kongruenzsatz und die gesuchte Folgerung nennen.</p><div class="example">Im gleichschenkligen Dreieck ABC ist AC = BC. M ist die Mitte von AB. Für ACM und BCM gilt: AC = BC (gegeben), AM = BM (Mitte), CM = CM (gemeinsam). Nach SSS sind die Dreiecke kongruent. Also sind die Winkel AMC und BMC gleich. Als Nebenwinkel ergeben sie zusammen 180°, daher ist jeder 90°. CM steht senkrecht auf AB und halbiert auch den Winkel bei C.</div><p>Dasselbe Muster begründet: In einem Parallelogramm teilt eine Diagonale die Figur in zwei kongruente Dreiecke (Wechselwinkel an parallelen Seiten und gemeinsame Seite, WSW). Daraus folgen gleich lange gegenüberliegende Seiten. Schreibe die entsprechende Zuordnung genau auf.</p><div class="merke"><strong>Merke:</strong> „Sieht gleich aus“ ist kein Beweis. Jede verwendete Gleichheit braucht eine Angabe, Definition oder einen bereits begründeten Satz.</div>`,
  formulas: [
    {
      name: "Beweiskette",
      html: "Voraussetzungen → Kongruenzsatz → entsprechende Größen",
      quantities: "Dreiecke und Zuordnung nennen",
    },
  ],
  quiz: {
    question: "Warum gilt CM = CM in den Dreiecken ACM und BCM?",
    options: [
      "Es ist dieselbe gemeinsame Seite.",
      "Alle Dreiecksseiten sind immer gleich.",
      "Weil die Zeichnung symmetrisch aussieht.",
    ],
    correctIndex: 0,
    explanation:
      "Eine gemeinsame Strecke hat in beiden Dreiecken dieselbe Länge; dazu ist keine Messung nötig.",
  },
  lab: lab(
    "congruence",
    "Gleichschenkliges Dreieck prüfen",
    "Ziehe C. Nur bei gleicher Schenkellänge liegen die beiden Dreiecke passend zur Kongruenzbegründung. M bleibt der Mittelpunkt von AB.",
    [
      r("x", "x von C", -3, 3, 1),
      r("h", "Höhe von C", 1, 5, 2),
      r("half", "Halbe Basis", 1, 4, 2),
    ],
    [
      o("equal", "AC und BC", (v) =>
        v.x === 0 ? "gleich lang" : "verschieden lang",
      ),
      o("right", "CM senkrecht zu AB", (v) => (v.x === 0 ? "ja" : "nein")),
    ],
    [
      {
        id: "sss",
        text: "Erzeuge ein gleichschenkliges Dreieck mit halber Basis 3 und Höhe 4.",
        check: (v) => v.x === 0 && v.h === 4 && v.half === 3,
      },
      {
        id: "gegenbeispiel",
        text: "Setze C auf x = 2 und Höhe 3 bei halber Basis 2. Warum fehlt SSS?",
        check: (v) => v.x === 2 && v.h === 3 && v.half === 2,
      },
      {
        id: "zweites",
        text: "Prüfe den Beweis bei halber Basis 1, Höhe 2 und C über M.",
        check: (v) => v.x === 0 && v.h === 2 && v.half === 1,
      },
    ],
  ),
  exercises: [
    {
      id: "basiswinkel",
      make: (rng, level) => {
        const top = rng.int(3, 10) * 10,
          base = (180 - top) / 2;
        return task(
          level,
          `Im gleichschenkligen Dreieck gilt AC = BC und γ = ${top}°. Berechne die beiden Basiswinkel.`,
          `AC = BC, γ = ${top}° und M ist die Mitte von AB. Begründe die Kongruenz von ACM und BCM und berechne α.`,
          [
            num("α =", base, "°", 0),
            ...(level === 1
              ? [num("β =", base, "°", 0)]
              : [
                  pick(
                    "Begründung der Teilkongruenz",
                    [
                      "SSS: Schenkel, halbe Basis, gemeinsame Seite",
                      "WWW: gleiche Form reicht",
                      "gleiche Fläche reicht",
                    ],
                    0,
                  ),
                ]),
          ],
          "Die Basiswinkel sind wegen der Kongruenz gleich groß.",
          `AC = BC, AM = BM, CM gemeinsam ⇒ SSS. Daher α = β. (180° − ${top}°) : 2.`,
          `α = β = ${base}°.`,
          { top, base },
        );
      },
    },
    {
      id: "beweiskette",
      make: (rng, level) => {
        const half = rng.int(2, 5);
        return task(
          level,
          `AC = BC, M ist die Mitte von AB und AM = ${half} cm. Ergänze BM und den Kongruenzsatz für ACM und BCM.`,
          `Im Parallelogramm ABCD teilt AC die Figur. Welche Begründung zeigt die Kongruenz von ABC und CDA? Wenn AB = ${2 * half} cm ist, wie lang ist CD?`,
          level === 1
            ? [
                num("BM =", half, "cm", 0),
                pick("Kongruenzsatz", ["SSS", "WWW", "Flächengleichheit"], 0),
              ]
            : [
                pick(
                  "Begründung",
                  [
                    "WSW: zwei Wechselwinkelpaare und die gemeinsame Seite AC",
                    "WWW allein",
                    "die Diagonale halbiert jede Seite",
                  ],
                  0,
                ),
                num("CD =", 2 * half, "cm", 0),
              ],
          "Nutze gegebene Gleichheit, Mittelpunkt und gemeinsame Seite.",
          level === 1
            ? "Die Schenkel und die halben Basisstrecken sind gleich; CM ist gemeinsam. Das liefert SSS."
            : "AB ∥ CD und BC ∥ AD liefern zwei gleiche Wechselwinkelpaare. Mit der gemeinsamen Seite AC gilt WSW, dann AB = CD.",
          level === 1 ? `BM = ${half} cm; SSS.` : `WSW; CD = ${2 * half} cm.`,
          { half },
        );
      },
    },
  ],
});
export const STAGE_DREIECKE = makeStage(
  3,
  "Dreiecke",
  "Existenz, Konstruktion und Kongruenzbeweise",
  "#7c3aed",
  "△",
  [3, null],
  [existenz, konstruktion, kongruenz, begruenden],
);
