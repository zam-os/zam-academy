import { fmt, paren } from "../exercises/format";
import { angleName, circleLine, quadName, twoCircles, type GridPoint } from "../models";
import { quadPoints } from "../lab/views-gym";
import { numberField as num, choiceField as pick } from "./helpers";
import {
  lab,
  range as r,
  choice as c,
  output as o,
  makeLesson,
  makeStage,
  task,
} from "./builders";

const n0 = (value: number) => fmt(value, 0);
const p0 = (value: number) => paren(value, 0);
const pt = (x: number, y: number) => `(${n0(x)}|${n0(y)})`;
const L = (step: number, content: Parameters<typeof makeLesson>[3]) => makeLesson(2, step, null, content);

const koordinaten = L(1, {
  id: "ge-1-koordinaten",
  title: "2.1 Das Koordinatensystem",
  subtitle: "Punkte mit zwei Zahlen genau angeben",
  whyItMatters:
    "„Der Punkt da oben rechts“ ist ungenau. Mit zwei Zahlen weiß jeder sofort, welcher Punkt gemeint ist.",
  explanationHtml: `<p>Das <strong>kartesische Koordinatensystem</strong> besteht aus zwei Zahlengeraden, die senkrecht aufeinander stehen: der <strong>x-Achse</strong> (Rechtsachse) und der <strong>y-Achse</strong> (Hochachse). Sie schneiden sich im <strong>Ursprung</strong> O(0|0).</p><p>Ein Punkt hat zwei Koordinaten: P(x|y). Zuerst gehst du um x nach rechts (bei negativem x nach links), dann um y nach oben (bei negativem y nach unten). Die Achsen teilen die Ebene in vier Felder, die <strong>Quadranten</strong>.</p><div class="example">A(3|2) liegt rechts oben, B(−4|1) links oben, C(−2|−3) links unten, D(5|−1) rechts unten. E(0|4) liegt auf der y-Achse.</div><div class="merke"><strong>Merke:</strong> Zuerst x, dann y: P(x|y). Die Reihenfolge ist wichtig, denn A(3|2) und B(2|3) sind verschiedene Punkte.</div>`,
  formulas: [
    { name: "Punkt", html: "P(x|y)", quantities: "x: nach rechts oder links, y: nach oben oder unten" },
    { name: "Ursprung", html: "O(0|0)", quantities: "Schnittpunkt der Achsen" },
  ],
  quiz: {
    question: "Wo liegt der Punkt P(−3|4)?",
    options: ["Links oben", "Rechts oben", "Links unten"],
    correctIndex: 0,
    explanation: "x = −3 bedeutet 3 nach links, y = 4 bedeutet 4 nach oben.",
  },
  lab: lab(
    "coords",
    "Punkte und Rechteck",
    "Ziehe A und C. Die beiden Punkte legen ein Rechteck mit achsenparallelen Seiten fest.",
    [r("ax", "x von A", -6, 6, 1), r("ay", "y von A", -5, 5, 1), r("bx", "x von C", -6, 6, 3), r("by", "y von C", -5, 5, 2)],
    [
      o("a", "A", (v) => `A${pt(v.ax, v.ay)}`),
      o("c", "C", (v) => `C${pt(v.bx, v.by)}`),
      o("breite", "Breite", (v) => Math.abs(v.bx - v.ax), "Kästchen", 0),
      o("hoehe", "Höhe", (v) => Math.abs(v.by - v.ay), "Kästchen", 0),
    ],
    [
      { id: "links-unten", text: "Lege A in den Bereich links unten: A(−4|−2).", check: (v) => v.ax === -4 && v.ay === -2 },
      { id: "ursprung", text: "Lege C auf den Ursprung.", check: (v) => v.bx === 0 && v.by === 0 },
      { id: "quadrat", text: "Forme ein Quadrat mit 4 Kästchen Seitenlänge.", check: (v) => Math.abs(v.bx - v.ax) === 4 && Math.abs(v.by - v.ay) === 4 },
    ],
  ),
  exercises: [
    {
      id: "punkt-verschieben",
      make: (rng, level) => {
        const x = rng.int(-8, 8), y = rng.int(-8, 8), dx = rng.int(2, 7), dy = rng.int(2, 7);
        const signX = rng.sign(), signY = rng.sign();
        if (level === 1)
          return task(
            level,
            `Du startest bei P${pt(x, y)} und gehst ${dx} nach ${signX > 0 ? "rechts" : "links"} und ${dy} nach ${signY > 0 ? "oben" : "unten"}. Wo kommst du an?`,
            "",
            [num("x =", x + signX * dx, "", 0), num("y =", y + signY * dy, "", 0)],
            "Rechts und oben: addieren. Links und unten: subtrahieren.",
            `x: ${n0(x)} ${signX > 0 ? "+" : "−"} ${dx} = ${n0(x + signX * dx)}. y: ${n0(y)} ${signY > 0 ? "+" : "−"} ${dy} = ${n0(y + signY * dy)}.`,
            `Du kommst bei ${pt(x + signX * dx, y + signY * dy)} an.`,
            { x, y, dx, dy },
          );
        const bx = x + dx, by = y + dy;
        return task(
          level,
          "",
          `Ein Rechteck ABCD hat achsenparallele Seiten. Gegeben sind A${pt(x, y)} und C${pt(bx, by)}. Gib die Koordinaten der Ecke B an, die rechts neben A liegt.`,
          [num("x =", bx, "", 0), num("y =", y, "", 0)],
          "B liegt auf derselben Höhe wie A und genau unter C.",
          `B hat die x-Koordinate von C und die y-Koordinate von A.`,
          `B${pt(bx, y)}`,
          { x, y, dx, dy },
        );
      },
    },
    {
      id: "achsen-abstand",
      make: (rng, level) => {
        const x = rng.sign() * rng.int(1, 9), y = rng.sign() * rng.int(1, 9);
        if (level === 1) {
          const places = ["rechts oben", "links oben", "links unten", "rechts unten"];
          const place = x > 0 ? (y > 0 ? 0 : 3) : y > 0 ? 1 : 2;
          return task(
            level,
            `In welchem Bereich des Koordinatensystems liegt P${pt(x, y)}?`,
            "",
            [pick("P liegt …", places, place)],
            "x sagt rechts oder links, y sagt oben oder unten.",
            `x = ${n0(x)} heißt ${x > 0 ? "rechts" : "links"}, y = ${n0(y)} heißt ${y > 0 ? "oben" : "unten"}.`,
            `P liegt ${places[place]}.`,
            { x, y },
          );
        }
        const ax = rng.int(-9, 8), same = rng.int(-9, 9);
        const bx = ax + rng.int(1, 9 - ax);
        return task(
          level,
          "",
          `Die Punkte A${pt(ax, same)} und B${pt(bx, same)} liegen auf derselben Höhe. Wie lang ist die Strecke [AB] in Kästchen, wenn 1 Kästchen für eine Einheit steht?`,
          [num("Länge:", bx - ax, "Kästchen", 0, { slips: [{ value: Math.abs(bx + ax), hint: "Subtrahiere die x-Koordinaten. Achte auf negative Zahlen." }] })],
          "Die Länge ist der Abstand der x-Koordinaten.",
          `${n0(bx)} − ${p0(ax)} = ${bx - ax}.`,
          `[AB] ist ${bx - ax} Kästchen lang.`,
          { ax, bx },
        );
      },
    },
  ],
});

const schreibweisen = L(2, {
  id: "ge-2-schreibweisen",
  title: "2.2 Strecke, Halbgerade, Gerade, Kreis",
  subtitle: "Kurze Schreibweisen, die jeder versteht",
  whyItMatters:
    "Abkürzungen sparen viele Worte: [AB] oder k(M; 3 cm) sagen genau, welche Figur gemeint ist.",
  explanationHtml: `<p>Die <strong>Strecke</strong> [AB] hat zwei Endpunkte A und B und eine Länge. Die <strong>Halbgerade</strong> [AB beginnt in A, geht durch B und endet nie. Die <strong>Gerade</strong> AB ist nach beiden Seiten unbegrenzt und hat keine Endpunkte. Geraden und Strecken erhalten oft kleine Buchstaben wie g.</p><p>Ein <strong>Kreis</strong> k(M; r) besteht aus allen Punkten, die vom <strong>Mittelpunkt</strong> M genau den Abstand r haben (<strong>Radius</strong>). Der Durchmesser d ist doppelt so lang wie der Radius.</p><div class="example">k(M; 3 cm) ist ein Kreis um M mit Radius 3 cm und Durchmesser 6 cm. Ein Punkt 2 cm neben M liegt innerhalb, ein Punkt 5 cm neben M außerhalb.</div><div class="merke"><strong>Merke:</strong> Klammer zeigt Endpunkt: [AB] zwei Endpunkte, [AB ein Endpunkt, AB keiner. k(M; r): alle Punkte im Abstand r von M.</div>`,
  formulas: [
    { name: "Strecke", html: "[AB]", quantities: "Zwei Endpunkte" },
    { name: "Halbgerade", html: "[AB", quantities: "Ein Endpunkt, durch B unbegrenzt" },
    { name: "Gerade", html: "AB oder g", quantities: "Keine Endpunkte" },
    { name: "Kreis", html: "k(M; r), d = 2 · r", quantities: "M Mittelpunkt, r Radius, d Durchmesser" },
  ],
  quiz: {
    question: "Was bezeichnet [PQ?",
    options: ["Die Halbgerade, die in P beginnt und durch Q geht", "Die Strecke von P nach Q", "Die Gerade durch P und Q"],
    correctIndex: 0,
    explanation: "Nur eine eckige Klammer: ein Endpunkt P. Über Q hinaus geht es unbegrenzt weiter.",
  },
  lab: lab(
    "line-kinds",
    "Linien auf Karopapier",
    "Wähle die Art der Linie und ziehe die Punkte A und B.",
    [c("kind", "Art", ["Strecke", "Halbgerade", "Gerade"]), r("ax", "A nach rechts", 0, 8, 1), r("ay", "A nach oben", 0, 6, 1), r("bx", "B nach rechts", 0, 8, 4), r("by", "B nach oben", 0, 6, 2)],
    [
      o("name", "Schreibweise", (v) => ["[AB]", "[AB", "AB"][v.kind]),
      o("enden", "Endpunkte", (v) => 2 - v.kind),
    ],
    [
      { id: "strecke", text: "Zeichne eine waagrechte Strecke der Länge 5.", check: (v) => v.kind === 0 && v.ay === v.by && Math.abs(v.bx - v.ax) === 5 },
      { id: "halbgerade", text: "Zeichne eine Halbgerade, die senkrecht nach oben zeigt.", check: (v) => v.kind === 1 && v.ax === v.bx && v.by > v.ay },
      { id: "gerade", text: "Zeichne eine Gerade durch A(0|0) und B(4|4).", check: (v) => v.kind === 2 && v.ax === 0 && v.ay === 0 && v.bx === 4 && v.by === 4 },
    ],
  ),
  exercises: [
    {
      id: "schreibweise",
      make: (rng, level) => {
        const [p, q] = rng.pick([["A", "B"], ["P", "Q"], ["R", "S"], ["C", "D"]] as const);
        const names = ["Strecke", "Halbgerade", "Gerade"];
        const kind = rng.int(0, 2);
        const symbol = [`[${p}${q}]`, `[${p}${q}`, `${p}${q}`][kind];
        if (level === 1)
          return task(
            level,
            `Was bezeichnet die Schreibweise ${symbol}?`,
            "",
            [pick("Das ist eine …", names, kind)],
            "Zähle die eckigen Klammern: Jede markiert einen Endpunkt.",
            `${symbol} hat ${["zwei Endpunkte", "einen Endpunkt", "keinen Endpunkt"][kind]}.`,
            `${symbol} ist eine ${names[kind]}.`,
            { kind },
          );
        const scenes: Array<[string, number]> = [
          [`Ein Seil ist zwischen den Pfosten ${p} und ${q} gespannt.`, 0],
          [`Ein Laser in ${p} sendet einen Strahl durch ${q}, der immer weiterläuft.`, 1],
          [`Du denkst dir die Linie durch ${p} und ${q} nach beiden Seiten unbegrenzt verlängert.`, 2],
          [`Eine Sehne des Bogens reicht von ${p} bis ${q}.`, 0],
          [`Vom Leuchtturm ${p} aus geht ein Lichtstrahl über die Boje ${q} hinaus.`, 1],
        ];
        const [scene, answer] = rng.pick(scenes);
        return task(
          level,
          "",
          `${scene} Welche Schreibweise passt?`,
          [pick("Schreibweise:", [`[${p}${q}]`, `[${p}${q}`, `${p}${q}`], answer)],
          "Überlege, wo die Linie anfängt und wo sie aufhört.",
          `Die Linie hat ${["zwei Endpunkte", "einen Endpunkt", "keinen Endpunkt"][answer]}.`,
          `Es passt ${[`[${p}${q}]`, `[${p}${q}`, `${p}${q}`][answer]}.`,
          { answer },
        );
      },
    },
    {
      id: "kreis-lesen",
      make: (rng, level) => {
        const radius = rng.int(2, 12);
        if (level === 1) {
          const givenDiameter = rng.int(0, 1) === 0;
          return task(
            level,
            givenDiameter ? `Ein Kreis hat den Durchmesser ${2 * radius} cm. Wie groß ist sein Radius?` : `Gegeben ist k(M; ${radius} cm). Wie groß ist der Durchmesser?`,
            "",
            [num(givenDiameter ? "r =" : "d =", givenDiameter ? radius : 2 * radius, "cm", 0)],
            "Der Durchmesser ist doppelt so lang wie der Radius.",
            `d = 2 · r: ${2 * radius} = 2 · ${radius}.`,
            givenDiameter ? `r = ${radius} cm` : `d = ${2 * radius} cm`,
            { radius },
          );
        }
        const d = rng.int(1, 16);
        const options = ["innerhalb des Kreises", "auf der Kreislinie", "außerhalb des Kreises"];
        const place = d < radius ? 0 : d === radius ? 1 : 2;
        return task(
          level,
          "",
          `Gegeben ist k(M; ${radius} cm). Der Punkt P ist ${d} cm von M entfernt. Wo liegt P?`,
          [pick("P liegt …", options, place)],
          "Vergleiche den Abstand von M mit dem Radius.",
          `Abstand ${d} cm, Radius ${radius} cm.`,
          `P liegt ${options[place]}.`,
          { radius, d },
        );
      },
    },
  ],
});

const lotAbstand = L(3, {
  id: "ge-3-lot-abstand",
  title: "2.3 Parallel, senkrecht, Lot und Abstand",
  subtitle: "Lagebeziehungen von Punkt und Gerade und von zwei Geraden",
  whyItMatters:
    "Wie weit ist das Haus von der Straße entfernt? Gemeint ist der kürzeste Weg. Den liefert das Lot.",
  explanationHtml: `<p>Zwei Geraden in der Ebene <strong>schneiden</strong> sich in einem Punkt oder sie sind <strong>parallel</strong> (g ∥ h): Sie haben überall denselben Abstand. Schneiden sie sich im rechten Winkel, stehen sie <strong>senkrecht</strong> aufeinander (g ⊥ h).</p><p>Ein Punkt P liegt auf einer Geraden g oder nicht. Die Senkrechte von P auf g heißt <strong>Lot</strong>. Die Länge des Lots ist der <strong>Abstand</strong> des Punktes von der Geraden. Jede andere Verbindung von P zu g ist länger.</p><div class="example">Im Koordinatensystem ist die Gerade g die x-Achse. Der Punkt P(3|−4) hat von g den Abstand 4. Das Lot läuft von P senkrecht nach oben zum Punkt (3|0).</div><div class="merke"><strong>Merke:</strong> Abstand heißt immer: kürzester Weg, also senkrecht messen. Parallele Geraden haben überall denselben Abstand.</div>`,
  formulas: [
    { name: "Parallel", html: "g ∥ h", quantities: "Überall gleicher Abstand" },
    { name: "Senkrecht", html: "g ⊥ h", quantities: "Schnitt im rechten Winkel" },
  ],
  quiz: {
    question: "Was ist der Abstand eines Punktes P von einer Geraden g?",
    options: ["Die Länge des Lots von P auf g", "Die längste Verbindung von P zu g", "Die Länge von g"],
    correctIndex: 0,
    explanation: "Das Lot steht senkrecht auf g und ist die kürzeste Verbindung.",
  },
  lab: lab(
    "line-relations",
    "Gerade drehen",
    "Drehe die Gerade h und verschiebe den Punkt P. Beobachte Lage und Abstand.",
    [r("angle", "Winkel von h", 0, 175, 30, 5, "°"), r("d", "Abstand bei parallel", 1, 5, 2, 1, "cm"), r("p", "P über g", -4, 4, 2, 1, "cm")],
    [
      o("lage", "Lage von g und h", (v) => (v.angle === 0 ? "parallel" : v.angle === 90 ? "senkrecht" : "schneiden sich")),
      o("abstand", "Abstand von P zu g", (v) => Math.abs(v.p), "cm", 0),
    ],
    [
      { id: "senkrecht", text: "Stelle h senkrecht zu g ein.", check: (v) => v.angle === 90 },
      { id: "parallel", text: "Stelle h parallel zu g mit Abstand 4 cm ein.", check: (v) => v.angle === 0 && v.d === 4 },
      { id: "auf-g", text: "Lege P auf die Gerade g.", check: (v) => v.p === 0 },
    ],
  ),
  exercises: [
    {
      id: "abstand-ablesen",
      make: (rng, level) => {
        const x = rng.int(-9, 9), y = rng.sign() * rng.int(1, 9), c1 = rng.int(-6, 6);
        if (level === 1)
          return task(
            level,
            `Die Gerade g ist die x-Achse. Welchen Abstand hat P${pt(x, y)} von g?`,
            "",
            [num("Abstand:", Math.abs(y), "", 0, { slips: [{ value: Math.abs(x), hint: "Der Abstand von der x-Achse wird senkrecht dazu gemessen, also entlang der y-Richtung." }] })],
            "Das Lot auf die x-Achse läuft senkrecht nach oben oder unten.",
            `Das Lot trifft die x-Achse bei ${pt(x, 0)}, die Länge ist |${n0(y)}|.`,
            `Der Abstand ist ${Math.abs(y)}.`,
            { x, y },
          );
        const c2 = c1 + rng.sign() * rng.int(2, 7);
        return task(
          level,
          "",
          `Die Gerade g geht durch A${pt(-3, c1)} und B${pt(5, c1)}, die Gerade h durch C${pt(-2, c2)} und D${pt(4, c2)}. Welchen Abstand haben die beiden parallelen Geraden?`,
          [num("Abstand:", Math.abs(c2 - c1), "", 0)],
          "Beide Geraden verlaufen waagrecht. Vergleiche ihre y-Koordinaten.",
          `|${n0(c2)} − ${p0(c1)}| = ${Math.abs(c2 - c1)}.`,
          `Der Abstand ist ${Math.abs(c2 - c1)}.`,
          { c1, c2 },
        );
      },
    },
    {
      id: "lage-geraden",
      make: (rng, level) => {
        const options = ["parallel", "senkrecht zueinander"];
        if (level === 1) {
          const pick01 = rng.int(0, 1);
          const y = rng.int(-5, 5), x = rng.int(-5, 5), y2 = y + rng.int(1, 4);
          const text = pick01 === 0
            ? `g geht durch ${pt(-4, y)} und ${pt(3, y)}. h geht durch ${pt(-2, y2)} und ${pt(5, y2)}.`
            : `g geht durch ${pt(-4, y)} und ${pt(3, y)}. h geht durch ${pt(x, -6)} und ${pt(x, 6)}.`;
          return task(
            level,
            `${text} Wie liegen g und h zueinander?`,
            "",
            [pick("g und h sind …", options, pick01)],
            "Waagrecht bleibt die y-Koordinate gleich, senkrecht die x-Koordinate.",
            pick01 === 0 ? "Beide Geraden verlaufen waagrecht." : "g verläuft waagrecht, h senkrecht dazu.",
            `g und h sind ${options[pick01]}.`,
            { pick01 },
          );
        }
        const [first, second, answer, why] = rng.pick([
          ["g ∥ h", "h ∥ k", 0, "Alle drei Geraden verlaufen in derselben Richtung."],
          ["g ⊥ h", "h ⊥ k", 0, "Zwei Senkrechte auf derselben Geraden sind parallel."],
          ["g ∥ h", "h ⊥ k", 1, "k steht senkrecht auf h und damit auch auf der dazu parallelen Geraden g."],
          ["g ⊥ h", "h ∥ k", 1, "k verläuft wie h und steht darum ebenfalls senkrecht auf g."],
        ] as const);
        return task(
          level,
          "",
          `In einer Ebene gilt ${first} und ${second}. Wie liegen g und k zueinander?`,
          [pick("g und k sind …", options, answer)],
          "Zeichne eine kleine Skizze mit drei Geraden.",
          why,
          `g und k sind ${options[answer]}.`,
          { answer },
        );
      },
    },
  ],
});

const LINE_NAMES = ["Passante", "Tangente", "Sekante"] as const;
const kreisGerade = L(4, {
  id: "ge-4-kreis-gerade",
  title: "2.4 Kreis und Gerade",
  subtitle: "Passante, Tangente und Sekante",
  whyItMatters:
    "Trifft die Straße den Funkbereich eines Masten? Das entscheidet ein einfacher Vergleich von Abstand und Radius.",
  explanationHtml: `<p>Eine Gerade kann mit einem Kreis keinen, genau einen oder genau zwei Punkte gemeinsam haben. Entscheidend ist der <strong>Abstand d</strong> der Geraden vom Mittelpunkt und der <strong>Radius r</strong>.</p><p>Ist d größer als r, verfehlt die Gerade den Kreis: <strong>Passante</strong>. Ist d gleich r, berührt sie ihn in genau einem Punkt: <strong>Tangente</strong>. Ist d kleiner als r, schneidet sie ihn in zwei Punkten: <strong>Sekante</strong>.</p><p>Die Tangente steht im Berührpunkt senkrecht auf dem Radius.</p><div class="example">k(M; 3 cm). Eine Gerade mit Abstand 5 cm von M ist Passante, mit Abstand 3 cm Tangente, mit Abstand 1 cm Sekante.</div><div class="merke"><strong>Merke:</strong> d &gt; r: Passante (0 Punkte). d = r: Tangente (1 Punkt). d &lt; r: Sekante (2 Punkte).</div>`,
  formulas: [
    { name: "Passante", html: "d > r", quantities: "Kein gemeinsamer Punkt" },
    { name: "Tangente", html: "d = r", quantities: "Ein gemeinsamer Punkt, senkrecht zum Radius" },
    { name: "Sekante", html: "d < r", quantities: "Zwei gemeinsame Punkte" },
  ],
  quiz: {
    question: "Der Radius ist 4 cm, die Gerade hat vom Mittelpunkt den Abstand 4 cm. Wie heißt sie?",
    options: ["Tangente", "Sekante", "Passante"],
    correctIndex: 0,
    explanation: "Abstand und Radius sind gleich: Die Gerade berührt den Kreis in genau einem Punkt.",
  },
  lab: lab(
    "circle-line",
    "Gerade verschieben",
    "Verschiebe die Gerade und ändere den Radius. Oben steht, wie die Gerade heißt.",
    [r("r", "Radius", 1, 3, 2, 1, "cm"), r("d", "Abstand der Geraden", 0, 3, 3, 1, "cm")],
    [
      o("name", "Name", (v) => circleLine(v.d, v.r)),
      o("punkte", "Gemeinsame Punkte", (v) => (v.d > v.r ? 0 : v.d === v.r ? 1 : 2)),
    ],
    [
      { id: "tangente", text: "Mache die Gerade zur Tangente eines Kreises mit Radius 2 cm.", check: (v) => v.r === 2 && v.d === 2 },
      { id: "sekante", text: "Stelle eine Sekante ein, die durch den Mittelpunkt geht.", check: (v) => v.d === 0 },
      { id: "passante", text: "Stelle eine Passante beim Radius 1 cm ein.", check: (v) => v.r === 1 && v.d > 1 },
    ],
  ),
  exercises: [
    {
      id: "gerade-benennen",
      make: (rng, level) => {
        const radius = rng.int(2, 9);
        const d = rng.pick([radius, radius - 1, radius + rng.int(1, 4), Math.max(1, radius - rng.int(1, 2))]);
        const name = circleLine(d, radius);
        const index = LINE_NAMES.indexOf(name);
        if (level === 1)
          return task(
            level,
            `Gegeben ist k(M; ${radius} cm). Eine Gerade hat von M den Abstand ${d} cm. Wie heißt sie?`,
            "",
            [pick("Die Gerade ist eine …", [...LINE_NAMES], index)],
            "Vergleiche den Abstand d mit dem Radius r.",
            `d = ${d} cm, r = ${radius} cm.`,
            `Sie ist eine ${name}.`,
            { radius, d },
          );
        const mast = radius * 100, road = d * 100;
        return task(
          level,
          "",
          `Ein Funkmast erreicht alles im Umkreis von ${mast} m. Eine gerade Straße verläuft in ${n0(road)} m Abstand am Mast vorbei. An wie vielen Randpunkten des Funkbereichs trifft die Straße auf die Grenze?`,
          [num("Punkte:", d > radius ? 0 : d === radius ? 1 : 2, "", 0)],
          "Die Grenze des Funkbereichs ist ein Kreis, die Straße eine Gerade.",
          `Abstand ${n0(road)} m, Radius ${mast} m: Die Straße ist eine ${name}.`,
          `${d > radius ? "An keinem Punkt" : d === radius ? "An 1 Punkt" : "An 2 Punkten"}.`,
          { radius, d },
        );
      },
    },
    {
      id: "tangente-radius",
      make: (rng, level) => {
        const d = rng.int(2, 15);
        if (level === 1) {
          const tangent = rng.int(0, 1) === 0;
          return task(
            level,
            tangent
              ? `Eine Gerade hat vom Mittelpunkt eines Kreises den Abstand ${d} cm und ist eine Tangente. Wie groß ist der Radius?`
              : `Gegeben ist k(M; ${d} cm). Gib den Abstand einer Tangente vom Mittelpunkt an.`,
            "",
            [num(tangent ? "r =" : "Abstand:", d, "cm", 0)],
            "Bei einer Tangente sind Abstand und Radius gleich.",
            "Die Tangente berührt den Kreis in einem Punkt. Dieser Punkt liegt im Abstand r von M.",
            tangent ? `r = ${d} cm` : `Der Abstand ist ${d} cm.`,
            { d },
          );
        }
        const asked = rng.pick(["Sekante", "Passante"] as const);
        const value = asked === "Sekante" ? d + 1 : d - 1;
        return task(
          level,
          "",
          `Eine Gerade hat vom Mittelpunkt M den Abstand ${d} cm. Welchen ${asked === "Sekante" ? "kleinsten" : "größten"} ganzzahligen Radius in cm darf der Kreis haben, damit die Gerade eine ${asked} ist?`,
          [num("r =", value, "cm", 0, { slips: [{ value: d, hint: "Bei r = d wäre die Gerade eine Tangente." }] })],
          "Sekante: r > d. Passante: r < d.",
          asked === "Sekante" ? `Der Radius muss größer als ${d} cm sein.` : `Der Radius muss kleiner als ${d} cm sein.`,
          `r = ${value} cm`,
          { d },
        );
      },
    },
  ],
});

const CIRCLE_PLACES = [
  "liegen außerhalb voneinander",
  "berühren sich von außen",
  "schneiden sich",
  "berühren sich von innen",
  "einer liegt im anderen",
] as const;
const zweiKreise = L(5, {
  id: "ge-5-zwei-kreise",
  title: "2.5 Zwei Kreise",
  subtitle: "Abstand der Mittelpunkte und Radien vergleichen",
  whyItMatters:
    "Zwei Lampen, zwei Lichtkreise: Ob sie sich überlappen, kannst du mit den Radien und dem Abstand der Mittelpunkte vorhersagen.",
  explanationHtml: `<p>Für zwei Kreise mit den Radien r und s vergleichst du den <strong>Abstand d der Mittelpunkte</strong> mit der Summe und der Differenz der Radien.</p><p>d &gt; r + s: Die Kreise liegen außerhalb voneinander. d = r + s: Sie berühren sich von außen. Liegt d zwischen dem Unterschied der Radien und ihrer Summe, schneiden sie sich in zwei Punkten. Ist d gleich dem Unterschied der Radien, berühren sie sich von innen. Ist d noch kleiner, liegt ein Kreis ganz im anderen.</p><div class="example">Radien 3 cm und 2 cm. Bei d = 7 cm: außerhalb. Bei d = 5 cm: Berühren von außen. Bei d = 3 cm: Sie schneiden sich. Bei d = 1 cm: Berühren von innen.</div><div class="merke"><strong>Merke:</strong> Vergleiche d mit r + s und mit dem Unterschied der Radien. Zwei Kreise haben höchstens zwei gemeinsame Punkte, außer sie sind deckungsgleich.</div>`,
  formulas: [
    { name: "Berühren von außen", html: "d = r + s", quantities: "Ein gemeinsamer Punkt" },
    { name: "Berühren von innen", html: "d = Unterschied von r und s", quantities: "Ein gemeinsamer Punkt" },
  ],
  quiz: {
    question: "Zwei Kreise haben die Radien 4 cm und 3 cm, die Mittelpunkte sind 7 cm entfernt. Wie liegen sie?",
    options: ["Sie berühren sich von außen.", "Sie schneiden sich.", "Sie liegen außerhalb voneinander."],
    correctIndex: 0,
    explanation: "4 cm + 3 cm = 7 cm. Der Abstand ist genau die Summe der Radien.",
  },
  lab: lab(
    "two-circles",
    "Zwei Kreise verschieben",
    "Verschiebe den zweiten Kreis und ändere die Radien. Beobachte die gemeinsamen Punkte.",
    [r("r", "Radius 1", 1, 4, 3, 1, "cm"), r("s", "Radius 2", 1, 4, 2, 1, "cm"), r("d", "Abstand", 0, 9, 7, 1, "cm")],
    [
      o("lage", "Lage", (v) => `Die Kreise ${twoCircles(v.d, v.r, v.s)}.`),
      o("summe", "Summe der Radien", (v) => v.r + v.s, "cm", 0),
    ],
    [
      { id: "aussen", text: "Lasse Kreise mit r = 3 cm und s = 2 cm sich von außen berühren.", check: (v) => v.r === 3 && v.s === 2 && v.d === 5 },
      { id: "schneiden", text: "Stelle zwei Kreise ein, die sich schneiden.", check: (v) => twoCircles(v.d, v.r, v.s) === "schneiden sich" },
      { id: "innen", text: "Stelle Kreise ein, die sich von innen berühren.", check: (v) => twoCircles(v.d, v.r, v.s) === "berühren sich von innen" },
    ],
  ),
  exercises: [
    {
      id: "kreise-lage",
      make: (rng, level) => {
        const a = rng.int(2, 8), b = rng.int(1, a - 1);
        const d = rng.pick([a + b + rng.int(1, 4), a + b, a + b - 1, a - b, Math.max(1, a - b - 1)].filter((x) => x > 0));
        const place = twoCircles(d, a, b);
        const index = CIRCLE_PLACES.indexOf(place as (typeof CIRCLE_PLACES)[number]);
        if (level === 1)
          return task(
            level,
            `Zwei Kreise haben die Radien ${a} cm und ${b} cm, ihre Mittelpunkte sind ${d} cm entfernt. Wie liegen sie zueinander?`,
            "",
            [pick("Die Kreise …", [...CIRCLE_PLACES], index)],
            `Vergleiche ${d} cm mit ${a} + ${b} und mit ${a} − ${b}.`,
            `Summe ${a + b} cm, Unterschied ${a - b} cm, Abstand ${d} cm.`,
            `Die Kreise ${place}.`,
            { a, b, d },
          );
        const big = a * 2, small = b * 2, gap = d * 2;
        const points = place === "schneiden sich" ? 2 : place.startsWith("berühren") ? 1 : 0;
        return task(
          level,
          "",
          `Zwei Rasensprenger stehen ${gap} m auseinander. Der eine wässert im Umkreis von ${big} m, der andere im Umkreis von ${small} m. Wie viele Punkte haben die beiden Kreisränder gemeinsam?`,
          [num("Punkte:", points, "", 0)],
          "Vergleiche den Abstand mit der Summe und dem Unterschied der Radien.",
          `Summe ${big + small} m, Unterschied ${big - small} m, Abstand ${gap} m.`,
          `Sie haben ${points === 0 ? "keinen Punkt" : points === 1 ? "1 Punkt" : "2 Punkte"} gemeinsam.`,
          { a, b, d },
        );
      },
    },
    {
      id: "mittelpunktsabstand",
      make: (rng, level) => {
        const a = rng.int(3, 12), b = rng.int(1, a - 1);
        if (level === 1)
          return task(
            level,
            `Zwei Kreise mit den Radien ${a} cm und ${b} cm berühren sich von außen. Wie groß ist der Abstand der Mittelpunkte?`,
            "",
            [num("d =", a + b, "cm", 0, { slips: [{ value: a - b, hint: "Das wäre das Berühren von innen." }] })],
            "Von außen: Die beiden Radien liegen hintereinander.",
            `d = ${a} cm + ${b} cm.`,
            `d = ${a + b} cm`,
            { a, b },
          );
        return task(
          level,
          "",
          `Ein Kreis mit Radius ${b} cm berührt innen einen größeren Kreis mit Radius ${a} cm. Wie weit sind die Mittelpunkte voneinander entfernt?`,
          [num("d =", a - b, "cm", 0, { slips: [{ value: a + b, hint: "Das wäre das Berühren von außen." }] })],
          "Fertige eine Skizze: Der kleine Kreis liegt im großen.",
          `d = ${a} cm − ${b} cm.`,
          `d = ${a - b} cm`,
          { a, b },
        );
      },
    },
  ],
});

const orte = L(6, {
  id: "ge-6-punkte-bedingungen",
  title: "2.6 Punkte mit Bedingungen",
  subtitle: "Wo liegen alle Punkte mit einem bestimmten Abstand?",
  whyItMatters:
    "Eine Eisdiele höchstens 200 m vom Schwimmbad entfernt: Die Bedingung beschreibt einen ganzen Bereich. Mit Kreisen und Parallelen entscheidest du begründet, welche Orte infrage kommen.",
  explanationHtml: `<p><strong>Alle Punkte mit Abstand r von einem Punkt M</strong> liegen auf der Kreislinie k(M; r). Das ist die grundlegende Eigenschaft der Kreislinie. Punkte mit kleinerem Abstand liegen innerhalb, Punkte mit größerem Abstand außerhalb.</p><p><strong>Alle Punkte mit Abstand d von einer Geraden g</strong> liegen auf zwei <strong>Parallelen</strong> zu g, je eine auf jeder Seite. Punkte mit höchstens diesem Abstand liegen im Streifen dazwischen.</p><p>Müssen mehrere Bedingungen gelten, suchst du die <strong>gemeinsamen Punkte</strong> der Linien oder Bereiche.</p><div class="example">Gesucht: Punkte 5 km von A entfernt und 3 km von der Straße g, die durch A verläuft. Der Kreis um A und die beiden Parallelen schneiden sich in 4 Punkten.</div><div class="merke"><strong>Merke:</strong> Abstand von einem Punkt: Kreis. Abstand von einer Geraden: zwei Parallelen. Beide Bedingungen zugleich: Schnittpunkte.</div>`,
  formulas: [
    { name: "Abstand r von M", html: "Kreislinie k(M; r)", quantities: "Alle Punkte mit genau diesem Abstand" },
    { name: "Abstand d von g", html: "Zwei Parallelen zu g", quantities: "Eine auf jeder Seite" },
  ],
  quiz: {
    question: "Wo liegen alle Punkte, die von einer Geraden g genau 2 cm entfernt sind?",
    options: ["Auf zwei Parallelen zu g", "Auf einem Kreis", "Auf einer Senkrechten zu g"],
    correctIndex: 0,
    explanation: "Auf jeder Seite von g gibt es eine Parallele im Abstand 2 cm.",
  },
  lab: lab(
    "locus",
    "Punkt P suchen",
    "A liegt im Ursprung, die Gerade g ist die x-Achse. Stelle Radius und Abstand ein und ziehe P.",
    [r("r", "Radius um A", 1, 6, 3, 1, "km"), r("d", "Abstand von g", 1, 5, 1, 1, "km"), r("px", "x von P", -7, 7, 1), r("py", "y von P", -3, 6, 1)],
    [
      o("kreis", "P und Kreis", (v) => { const d = v.px ** 2 + v.py ** 2; return d === v.r ** 2 ? "auf der Kreislinie" : d < v.r ** 2 ? "innerhalb" : "außerhalb"; }),
      o("gerade", "Abstand von g", (v) => Math.abs(v.py), "km", 0),
    ],
    [
      { id: "kreis", text: "Lege P rechts oben auf die Kreislinie mit Radius 5 km.", check: (v) => v.r === 5 && v.px > 0 && v.py > 0 && v.px ** 2 + v.py ** 2 === 25 },
      { id: "parallele", text: "Lege P auf die untere Parallele mit Abstand 2 km von g.", check: (v) => v.d === 2 && v.py === -2 },
      { id: "beide", text: "Finde P mit 5 km Abstand von A und 4 km Abstand von g, links oben.", check: (v) => v.r === 5 && v.d === 4 && v.px === -3 && v.py === 4 },
    ],
  ),
  exercises: [
    {
      id: "wo-liegen-sie",
      make: (rng, level) => {
        const d = rng.int(2, 9);
        const options = ["Auf einer Kreislinie", "Auf zwei Parallelen", "Auf einer Parallelen genau in der Mitte"];
        if (level === 1) {
          const cases: Array<[string, number]> = [
            [`alle Punkte, die vom Punkt M genau ${d} cm entfernt sind`, 0],
            [`alle Punkte, die von der Geraden g genau ${d} cm entfernt sind`, 1],
            [`alle Punkte, die von den parallelen Geraden g und h gleich weit entfernt sind`, 2],
          ];
          const [text, answer] = rng.pick(cases);
          return task(
            level,
            `Wo liegen ${text}?`,
            "",
            [pick("Sie liegen …", options, answer)],
            "Punkt: Kreis. Gerade: Parallelen.",
            ["Das ist die Eigenschaft der Kreislinie.", "Auf jeder Seite von g liegt eine Parallele.", "Sie liegen auf der Parallelen genau zwischen g und h."][answer],
            `${options[answer]}.`,
            { d, answer },
          );
        }
        const r1 = rng.int(3, 9), dist = rng.int(1, 11);
        const answer = dist < r1 ? 4 : dist === r1 ? 2 : 0;
        return task(
          level,
          "",
          `Gesucht sind alle Punkte, die von M den Abstand ${r1} km haben und von der Geraden g durch M den Abstand ${dist} km. Wie viele solche Punkte gibt es?`,
          [num("Anzahl:", answer, "", 0)],
          "Zeichne den Kreis um M und die beiden Parallelen zu g. Zähle die Schnittpunkte.",
          dist < r1 ? "Jede Parallele schneidet den Kreis zweimal." : dist === r1 ? "Jede Parallele ist eine Tangente und berührt den Kreis einmal." : "Die Parallelen verfehlen den Kreis.",
          `Es gibt ${answer === 0 ? "keinen solchen Punkt" : `${answer} solche Punkte`}.`,
          { r1, dist },
        );
      },
    },
    {
      id: "entscheidung",
      make: (rng, level) => {
        if (level === 1) {
          const radius = rng.pick([5, 10, 13]);
          const [x, y] = rng.pick(radius === 13 ? [[5, 12], [3, 4], [12, 12]] : radius === 10 ? [[6, 8], [3, 4], [9, 9]] : [[3, 4], [1, 2], [4, 4]]);
          const inside = x * x + y * y <= radius * radius;
          return task(
            level,
            `Ein Kreis um A(0|0) hat den Radius ${radius}. Liegt der Punkt P${pt(x, y)} auf oder innerhalb des Kreises? Vergleiche, indem du die Figur auf Karopapier zeichnest und misst.`,
            "",
            [pick("P liegt auf oder innerhalb:", ["ja", "nein"], inside ? 0 : 1)],
            "Miss den Abstand von A zu P und vergleiche ihn mit dem Radius.",
            `Abstand von A zu P: ${Number.isInteger(Math.hypot(x, y)) ? `genau ${Math.hypot(x, y)}` : `${inside ? "kleiner" : "größer"} als ${radius}`}.`,
            inside ? "Ja, P liegt auf oder innerhalb." : "Nein, P liegt außerhalb.",
            { radius, x, y },
          );
        }
        const limit = rng.int(2, 6) * 100;
        const metres = rng.int(1, 9) * 100;
        const roadAllowed = metres <= limit;
        return task(
          level,
          "",
          `Eine Stadt erlaubt neue Spielplätze nur im Streifen von höchstens ${limit} m Abstand zur Hauptstraße g. Ein Grundstück liegt ${metres} m von g entfernt. Ist es zulässig?`,
          [pick("Zulässig:", ["ja", "nein"], roadAllowed ? 0 : 1)],
          "Alle zulässigen Orte liegen zwischen den beiden Parallelen im Abstand " + limit + " m.",
          `Das Grundstück hat ${metres} m Abstand, erlaubt sind höchstens ${limit} m.`,
          roadAllowed ? "Ja, das Grundstück ist zulässig." : "Nein, es liegt außerhalb des Streifens.",
          { limit, metres },
        );
      },
    },
  ],
});

const ANGLE_NAMES = ["spitzer Winkel", "rechter Winkel", "stumpfer Winkel", "gestreckter Winkel", "überstumpfer Winkel"];
const winkel = L(7, {
  id: "ge-7-winkel",
  title: "2.7 Winkel messen und benennen",
  subtitle: "Mit dem Geodreieck bis 360°",
  whyItMatters:
    "Vom Skateboard-Trick bis zur Uhr: Drehungen beschreibst du mit Winkeln. Das Geodreieck misst sie auf das Grad genau.",
  explanationHtml: `<p>Ein <strong>Winkel</strong> besteht aus einem <strong>Scheitel</strong> S und zwei <strong>Schenkeln</strong>. Du benennst ihn mit griechischen Buchstaben wie α und β. Eine volle Drehung hat 360°.</p><p>Ein Winkel über 0° und unter 90° heißt <strong>spitz</strong>, genau 90° <strong>recht</strong>, über 90° und unter 180° <strong>stumpf</strong>, genau 180° <strong>gestreckt</strong>, über 180° und unter 360° <strong>überstumpf</strong>, genau 360° <strong>Vollwinkel</strong>.</p><p>Beim Messen legst du die lange Kante des Geodreiecks an einen Schenkel, der Nullpunkt liegt auf dem Scheitel. Einen überstumpfen Winkel misst du, indem du den Winkel auf der anderen Seite misst und von 360° abziehst.</p><div class="example">Der andere Winkel misst 130°. Der überstumpfe Winkel ist 360° − 130° = 230°.</div><div class="merke"><strong>Merke:</strong> spitz, recht, stumpf, gestreckt, überstumpf: Jeder Winkel hat genau einen Namen.</div>`,
  formulas: [
    { name: "Winkelarten", html: "spitz &lt; 90° = recht &lt; stumpf &lt; 180° = gestreckt &lt; überstumpf &lt; 360°", quantities: "Vergleich mit 90°, 180° und 360°" },
    { name: "Überstumpfer Winkel", html: "360° − α", quantities: "α ist der Winkel auf der anderen Seite" },
  ],
  quiz: {
    question: "Welche Art Winkel hat 205°?",
    options: ["überstumpf", "stumpf", "gestreckt"],
    correctIndex: 0,
    explanation: "205° liegt zwischen 180° und 360°.",
  },
  lab: lab(
    "angle",
    "Winkel drehen",
    "Ziehe den Schenkel. Der Name des Winkels ändert sich an genau festen Grenzen.",
    [r("a", "Winkel", 0, 360, 40, 5, "°")],
    [
      o("name", "Name", (v) => angleName(v.a)),
      o("rest", "Anderer Winkel bis zum Vollwinkel", (v) => 360 - v.a, "°", 0),
    ],
    [
      { id: "recht", text: "Stelle einen rechten Winkel ein.", check: (v) => v.a === 90 },
      { id: "gestreckt", text: "Stelle einen gestreckten Winkel ein.", check: (v) => v.a === 180 },
      { id: "ueberstumpf", text: "Stelle 230° ein: ein überstumpfer Winkel.", check: (v) => v.a === 230 },
    ],
  ),
  exercises: [
    {
      id: "winkelart",
      make: (rng, level) => {
        if (level === 1) {
          const a = rng.pick([rng.int(1, 89), 90, rng.int(91, 179), 180, rng.int(181, 359)]);
          const name = angleName(a);
          return task(
            level,
            `Wie heißt ein Winkel mit der Größe ${a}°?`,
            "",
            [pick("Es ist ein …", ANGLE_NAMES, ANGLE_NAMES.indexOf(name))],
            "Vergleiche mit 90°, 180° und 360°.",
            `${a}° ${a < 90 ? "ist kleiner als 90°" : a === 90 ? "sind genau 90°" : a < 180 ? "liegt zwischen 90° und 180°" : a === 180 ? "sind genau 180°" : "liegt zwischen 180° und 360°"}.`,
            `Es ist ein ${name}.`,
            { a },
          );
        }
        const minutes = rng.pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
        const a = minutes * 6;
        return task(
          level,
          "",
          `Der große Zeiger einer Uhr dreht sich in 60 Minuten um 360°. Um wie viel Grad dreht er sich in ${minutes} Minuten?`,
          [num("Winkel:", a, "°", 0, { slips: [{ value: minutes, hint: "Eine Minute entspricht 6°." }] })],
          "360° : 60 = 6° pro Minute.",
          `${minutes} · 6° = ${a}°.`,
          `Der Zeiger dreht sich um ${a}°, das ist ein ${angleName(a)}.`,
          { minutes },
        );
      },
    },
    {
      id: "ueberstumpf-rechnen",
      make: (rng, level) => {
        const a = rng.int(10, 170);
        if (level === 1)
          return task(
            level,
            `Mit dem Geodreieck misst du den kleineren Winkel zwischen zwei Schenkeln: α = ${a}°. Wie groß ist der überstumpfe Winkel auf der anderen Seite?`,
            "",
            [num("Winkel:", 360 - a, "°", 0, { slips: [{ value: 180 - a, hint: "Eine volle Drehung hat 360°, nicht 180°." }] })],
            "Beide Winkel zusammen ergeben 360°.",
            `360° − ${a}° = ${360 - a}°.`,
            `Der überstumpfe Winkel hat ${360 - a}°.`,
            { a },
          );
        const hour = rng.int(1, 11);
        const smaller = Math.min(30 * hour, 360 - 30 * hour);
        return task(
          level,
          "",
          `Es ist genau ${hour} Uhr. Wie groß ist der kleinere Winkel zwischen den beiden Uhrzeigern?`,
          [num("Winkel:", smaller, "°", 0, { slips: [{ value: 360 - smaller, hint: "Das ist der größere Winkel. Gefragt ist der kleinere." }] })],
          "Zwischen zwei Stundenzahlen liegen 360° : 12 = 30°.",
          `${Math.min(hour, 12 - hour)} Stundenabschnitte zu je 30°.`,
          `Der Winkel ist ${smaller}°.`,
          { hour },
        );
      },
    },
  ],
});

const QUAD_NAMES = ["Quadrat", "Rechteck", "Raute", "Parallelogramm", "Drachenviereck", "Trapez"];
const QUAD_FACTS = [
  ["Alle vier Seiten sind gleich lang, und alle Winkel sind rechte Winkel.", 0],
  ["Gegenüberliegende Seiten sind gleich lang, benachbarte Seiten verschieden lang, und alle Winkel sind rechte Winkel.", 1],
  ["Alle vier Seiten sind gleich lang, aber es gibt keine rechten Winkel.", 2],
  ["Gegenüberliegende Seiten sind parallel und gleich lang, benachbarte Seiten sind verschieden lang, und es gibt keine rechten Winkel.", 3],
  ["Je zwei benachbarte Seiten sind gleich lang, die beiden Paare aber verschieden lang.", 4],
  ["Genau ein Paar gegenüberliegender Seiten ist parallel.", 5],
] as const;
const QUAD_OBJECTS = [
  ["ein Schachbrett von oben", 0],
  ["ein Blatt Papier im Format DIN A4", 1],
  ["ein auf die Spitze gestelltes Karo auf einer Spielkarte mit vier gleich langen Seiten ohne rechte Winkel", 2],
  ["ein klassischer Flugdrachen mit zwei kurzen und zwei langen Stäben als Rand", 4],
  ["die Vorderseite eines Dachs, unten länger als oben und oben und unten parallel, seitlich schräg", 5],
  ["ein schief gedrückter Bilderrahmen, bei dem gegenüberliegende Leisten parallel bleiben und benachbarte Leisten verschieden lang sind", 3],
] as const;

const vierecke = L(8, {
  id: "ge-8-vierecke",
  title: "2.8 Vierecke erkennen und erzeugen",
  subtitle: "Quadrat, Rechteck, Parallelogramm, Raute, Drachenviereck, Trapez",
  whyItMatters:
    "Fenster, Drachen und Dachflächen sind Vierecke mit besonderen Eigenschaften. Wer sie erkennt, kann über sie argumentieren.",
  explanationHtml: `<p>Die Vierecke unterscheidest du vor allem an ihren <strong>Seiten</strong>:</p><p><strong>Parallelogramm:</strong> Gegenüberliegende Seiten sind parallel und gleich lang. <strong>Rechteck:</strong> Parallelogramm mit vier rechten Winkeln. <strong>Raute:</strong> vier gleich lange Seiten. <strong>Quadrat:</strong> vier gleich lange Seiten und vier rechte Winkel. <strong>Drachenviereck:</strong> Je zwei benachbarte Seiten sind gleich lang. <strong>Trapez:</strong> mindestens ein Paar paralleler Seiten.</p><p>Eine Figur kann mehrere Namen tragen: Jedes Quadrat ist auch Rechteck und Raute. Darum fragst du nach dem <strong>genauesten Namen</strong>.</p><div class="example">Ecken A(1|1), B(5|1), C(4|4), D(1|5): AB und AD sind 4 lang, CB und CD gleich lang. Es ist ein Drachenviereck, kein Parallelogramm.</div><div class="merke"><strong>Merke:</strong> Prüfe Seitenlängen, Parallelen und rechte Winkel. Nenne dann den genauesten Namen.</div>`,
  formulas: [
    { name: "Parallelogramm", html: "Gegenseiten parallel und gleich lang", quantities: "Dazu gehören Rechteck, Raute und Quadrat" },
    { name: "Drachenviereck", html: "Zwei Paare benachbarter gleich langer Seiten", quantities: "Auch die Raute ist eines" },
    { name: "Trapez", html: "Mindestens ein Paar paralleler Seiten", quantities: "Auch das Parallelogramm ist eines" },
  ],
  quiz: {
    question: "Ein Viereck hat vier gleich lange Seiten, aber keinen rechten Winkel. Wie lautet sein genauester Name?",
    options: ["Raute", "Quadrat", "Rechteck"],
    correctIndex: 0,
    explanation: "Vier gleich lange Seiten ohne rechten Winkel kennzeichnen die Raute.",
  },
  lab: lab(
    "quad-lab",
    "Viereck verformen",
    "A bleibt fest. Ziehe B, C und D. Die App nennt den genauesten Namen.",
    [r("bx", "x von B", 2, 10, 5), r("cx", "x von C", 0, 11, 7), r("cy", "y von C", 2, 7, 4), r("dx", "x von D", 0, 10, 2), r("dy", "y von D", 2, 7, 5)],
    [o("name", "Genauester Name", (v) => quadName(quadPoints(v)))],
    [
      { id: "rechteck", text: "Forme ein Rechteck, das kein Quadrat ist.", check: (v) => quadName(quadPoints(v)) === "Rechteck" },
      { id: "trapez", text: "Forme ein Trapez, das kein Parallelogramm ist.", check: (v) => quadName(quadPoints(v)) === "Trapez" },
      { id: "drachen", text: "Forme ein Drachenviereck: A(1|1), B(5|1), C(4|4), D(1|5).", check: (v) => quadName(quadPoints(v)) === "Drachenviereck" },
    ],
  ),
  exercises: [
    {
      id: "name-finden",
      make: (rng, level) => {
        if (level === 1) {
          const [fact, answer] = rng.pick(QUAD_FACTS);
          return task(
            level,
            `Ein Viereck hat diese Eigenschaften: ${fact} Wie lautet sein genauester Name?`,
            "",
            [pick("Genauester Name:", QUAD_NAMES, answer)],
            "Prüfe Seitenlängen, parallele Seiten und rechte Winkel.",
            `Diese Eigenschaften passen genau zum ${QUAD_NAMES[answer]}.`.replace("zum Raute", "zur Raute"),
            `Genauester Name: ${QUAD_NAMES[answer]}`,
            { answer },
          );
        }
        const [object, answer] = rng.pick(QUAD_OBJECTS);
        return task(
          level,
          "",
          `Welchem Viereck ordnest du zu: ${object}? Gib den genauesten Namen an.`,
          [pick("Genauester Name:", QUAD_NAMES, answer)],
          "Stelle dir die Seiten vor und prüfe, welche gleich lang und welche parallel sind.",
          `Mit diesen Seiten und Winkeln ist der genaueste Name ${QUAD_NAMES[answer]}.`,
          `Genauester Name: ${QUAD_NAMES[answer]}`,
          { answer },
        );
      },
    },
    {
      id: "koordinaten-viereck",
      make: (rng, level) => {
        const w = rng.int(3, 6), h = rng.int(2, 5), s = rng.int(1, 3);
        const x0 = rng.int(-3, 2), y0 = rng.int(-3, 1);
        if (level === 1) {
          const shapes: GridPoint[][] = [
            [{ x: x0, y: y0 }, { x: x0 + w, y: y0 }, { x: x0 + w, y: y0 + h + w }, { x: x0, y: y0 + h + w }],
            [{ x: x0, y: y0 }, { x: x0 + w, y: y0 }, { x: x0 + w + s, y: y0 + h }, { x: x0 + s, y: y0 + h }],
            [{ x: x0, y: y0 }, { x: x0 + w + 2, y: y0 }, { x: x0 + w, y: y0 + h }, { x: x0 + 1, y: y0 + h }],
          ];
          const pts = rng.pick(shapes);
          const name = quadName(pts);
          return task(
            level,
            `Zeichne das Viereck mit A${pt(pts[0].x, pts[0].y)}, B${pt(pts[1].x, pts[1].y)}, C${pt(pts[2].x, pts[2].y)} und D${pt(pts[3].x, pts[3].y)}. Wie lautet sein genauester Name?`,
            "",
            [pick("Genauester Name:", QUAD_NAMES, QUAD_NAMES.indexOf(name))],
            "Zeichne die Punkte ins Koordinatensystem und prüfe die Seiten.",
            `Die Skizze zeigt die Eigenschaften: ${name}.`,
            `Genauester Name: ${name}`,
            { w, h, s },
          );
        }
        const cx = x0 + w + s, cy = y0 + h;
        return task(
          level,
          "",
          `A${pt(x0, y0)}, B${pt(x0 + w, y0)} und C${pt(cx, cy)} sind Ecken des Parallelogramms ABCD. Welche Koordinaten hat die Ecke D?`,
          [num("x =", x0 + s, "", 0), num("y =", cy, "", 0)],
          "Von A nach D gehst du genauso wie von B nach C.",
          `Von B nach C: ${s} nach rechts und ${h} nach oben. Dasselbe von A aus.`,
          `D${pt(x0 + s, cy)}`,
          { x0, y0, w, h, s },
        );
      },
    },
  ],
});

const VIERECK_TRUE = [
  ["Jedes Quadrat ist ein Rechteck.", true, "Ein Quadrat hat vier rechte Winkel."],
  ["Jedes Quadrat ist eine Raute.", true, "Ein Quadrat hat vier gleich lange Seiten."],
  ["Jedes Rechteck ist ein Parallelogramm.", true, "Gegenüberliegende Seiten eines Rechtecks sind parallel."],
  ["Jede Raute ist ein Drachenviereck.", true, "Bei einer Raute sind alle Seiten gleich lang, also auch benachbarte."],
  ["Jedes Rechteck ist ein Quadrat.", false, "Gegenbeispiel: ein Rechteck mit den Seiten 3 cm und 5 cm."],
  ["Jede Raute ist ein Quadrat.", false, "Eine Raute muss keinen rechten Winkel haben."],
  ["Jedes Parallelogramm ist ein Rechteck.", false, "Ein Parallelogramm muss keinen rechten Winkel haben."],
  ["Jedes Trapez ist ein Parallelogramm.", false, "Ein Trapez braucht nur ein Paar paralleler Seiten."],
  ["Jedes Drachenviereck ist eine Raute.", false, "Die beiden Paare gleich langer Seiten dürfen verschieden lang sein."],
] as const;
const eigenschaften = L(9, {
  id: "ge-9-viereck-eigenschaften",
  title: "2.9 Mit Vierecken argumentieren",
  subtitle: "Beziehungen und Kopfgeometrie",
  whyItMatters:
    "„Jedes Quadrat ist ein Rechteck, aber nicht umgekehrt.“ Solche Sätze begründest du mit den Eigenschaften der Vierecke, oft nur mit einem Bild im Kopf.",
  explanationHtml: `<p>Die Vierecke hängen zusammen. Das <strong>Quadrat</strong> erfüllt alles: Es ist Rechteck, Raute, Parallelogramm, Drachenviereck und Trapez. Das <strong>Rechteck</strong> und die <strong>Raute</strong> sind besondere Parallelogramme. Das <strong>Parallelogramm</strong> ist ein besonderes Trapez. Die Raute ist auch ein besonderes Drachenviereck.</p><p>Willst du zeigen, dass jedes X ein Y ist, prüfst du die Eigenschaften von Y an X. Willst du es widerlegen, genügt ein Gegenbeispiel.</p><p>Bei der <strong>Kopfgeometrie</strong> stellst du dir Figuren vor: Klappe ein Quadrat an einer Seite aus: Es entsteht ein Rechteck mit den Seiten a und 2a.</p><div class="example">Ein Rechteck ist 6 cm lang und 3 cm breit. Du legst zwei davon mit den langen Seiten aneinander. Es entsteht ein Quadrat mit Seitenlänge 6 cm.</div><div class="merke"><strong>Merke:</strong> Ein „Jedes …“-Satz gilt erst, wenn alle Eigenschaften passen. Ein Gegenbeispiel widerlegt ihn.</div>`,
  formulas: [
    { name: "Umfang mit gleichen Seiten", html: "Raute und Quadrat: 4 · a", quantities: "Vier gleich lange Seiten" },
    { name: "Umfang Drachenviereck", html: "2 · a + 2 · b", quantities: "Zwei Paare gleich langer Seiten" },
  ],
  quiz: {
    question: "Welche Aussage stimmt?",
    options: ["Jedes Rechteck ist ein Parallelogramm.", "Jedes Parallelogramm ist ein Rechteck.", "Jedes Trapez ist ein Rechteck."],
    correctIndex: 0,
    explanation: "Beim Rechteck sind die gegenüberliegenden Seiten parallel. Umgekehrt muss ein Parallelogramm keinen rechten Winkel haben.",
  },
  lab: lab(
    "quad-lab",
    "Vom Allgemeinen zum Besonderen",
    "A bleibt fest. Verforme das Viereck Schritt für Schritt zu immer genaueren Formen.",
    [r("bx", "x von B", 2, 10, 5), r("cx", "x von C", 0, 11, 7), r("cy", "y von C", 2, 7, 4), r("dx", "x von D", 0, 10, 2), r("dy", "y von D", 2, 7, 5)],
    [o("name", "Genauester Name", (v) => quadName(quadPoints(v)))],
    [
      { id: "parallelogramm", text: "Forme ein Parallelogramm ohne rechten Winkel und mit verschieden langen Nachbarseiten.", check: (v) => quadName(quadPoints(v)) === "Parallelogramm" },
      { id: "raute", text: "Forme eine Raute, die kein Quadrat ist: A(1|1), B(6|1), C(9|5), D(4|5).", check: (v) => quadName(quadPoints(v)) === "Raute" },
      { id: "quadrat", text: "Forme ein Quadrat.", check: (v) => quadName(quadPoints(v)) === "Quadrat" },
    ],
  ),
  exercises: [
    {
      id: "jedes-ist",
      make: (rng, level) => {
        const [claim, truth, why] = rng.pick(VIERECK_TRUE);
        return task(
          level,
          `Stimmt die Aussage? ${claim}`,
          `Prüfe mit den Eigenschaften der Vierecke und nenne im Kopf ein Gegenbeispiel, falls die Aussage falsch ist: ${claim}`,
          [pick("Die Aussage ist …", ["wahr", "falsch"], truth ? 0 : 1)],
          "Prüfe alle Eigenschaften der zweiten Figur an der ersten.",
          why,
          truth ? "Die Aussage ist wahr." : "Die Aussage ist falsch.",
          { truth: truth ? 1 : 0 },
        );
      },
    },
    {
      id: "kopfgeometrie",
      make: (rng, level) => {
        const a = rng.int(3, 15), b = rng.int(2, a - 1 > 2 ? a - 1 : 3);
        if (level === 1) {
          const kite = rng.int(0, 1) === 0;
          return task(
            level,
            kite ? `Ein Drachenviereck hat zwei Seiten mit ${a} cm und zwei Seiten mit ${b + a} cm. Wie groß ist sein Umfang?` : `Eine Raute hat die Seitenlänge ${a} cm. Wie groß ist ihr Umfang?`,
            "",
            [num("Umfang:", kite ? 2 * a + 2 * (a + b) : 4 * a, "cm", 0)],
            "Addiere alle vier Seiten.",
            kite ? `2 · ${a} cm + 2 · ${a + b} cm.` : `4 · ${a} cm.`,
            `Der Umfang ist ${kite ? 2 * a + 2 * (a + b) : 4 * a} cm.`,
            { a, b },
          );
        }
        return task(
          level,
          "",
          `Du legst zwei gleich große Quadrate mit der Seitenlänge ${a} cm nebeneinander, sodass sie eine ganze Seite gemeinsam haben. Wie groß ist der Umfang der neuen Figur? Rechne im Kopf.`,
          [num("Umfang:", 6 * a, "cm", 0, { slips: [{ value: 8 * a, hint: "Die gemeinsame Seite liegt innen und gehört nicht mehr zum Rand." }] })],
          "Es entsteht ein Rechteck. Die Seite in der Mitte zählt nicht mehr zum Rand.",
          `Rechteck mit ${2 * a} cm und ${a} cm: 2 · ${2 * a} cm + 2 · ${a} cm.`,
          `Der Umfang ist ${6 * a} cm.`,
          { a },
        );
      },
    },
  ],
});

export const STAGE_GEOMETRIE = makeStage(
  2,
  "Koordinatensystem, Lagebeziehungen, Kreise, Winkel und Vierecke",
  "#059669",
  "📐",
  [koordinaten, schreibweisen, lotAbstand, kreisGerade, zweiKreise, orte, winkel, vierecke, eigenschaften],
);
