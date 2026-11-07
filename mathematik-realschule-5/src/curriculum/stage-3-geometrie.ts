import { fmt } from "../exercises/format";
import {
  angleKind,
  angleName,
  NET_PATTERNS,
  oppositeFace,
  quadrilateral,
  sideKind,
  SOLIDS,
  validTriangle,
} from "../models";
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
const L = (step: number, content: Parameters<typeof makeLesson>[3]) =>
  makeLesson(3, step, null, content);

const grundbegriffe = L(1, {
  id: "ge-1-grundbegriffe",
  title: "3.1 Punkt, Strecke, Halbgerade, Gerade",
  subtitle: "Geometrische Grundbegriffe und ihre Schreibweisen",
  whyItMatters:
    "Damit andere deine Zeichnung genau verstehen, brauchst du klare Wörter und Schreibweisen.",
  explanationHtml: `<p>Ein <strong>Punkt</strong> hat keine Ausdehnung. Du benennst ihn mit einem Großbuchstaben: A, B, P.</p><p>Eine <strong>Strecke [AB]</strong> ist die gerade Verbindung von A nach B. Sie hat zwei Endpunkte und eine Länge, zum Beispiel |AB| = 5 cm. Sie ist die kürzeste Verbindung der beiden Punkte, und ihre Länge heißt auch <strong>Entfernung</strong> von A und B.</p><p>Eine <strong>Halbgerade [AB</strong> (auch Strahl) beginnt in A, geht durch B und endet nicht. Eine <strong>Gerade AB</strong> hat gar keinen Endpunkt. Geraden kannst du auch mit kleinen Buchstaben benennen: g, h. Halbgeraden und Geraden haben keine Länge, du zeichnest nur einen Teil.</p><div class="example">Punkte A und B liegen 3 cm auseinander. [AB] endet in A und B. [AB beginnt in A und läuft über B hinaus. Die Gerade AB läuft in beide Richtungen weiter. Für A und B allein gibt es genau eine Gerade.</div><div class="merke"><strong>Merke:</strong> Strecke: zwei Endpunkte. Halbgerade: ein Anfangspunkt. Gerade: kein Endpunkt.</div>`,
  formulas: [
    { name: "Schreibweisen", html: "Strecke [AB], Halbgerade [AB, Gerade AB", quantities: "Die eckige Klammer steht an einem festen Endpunkt." },
    { name: "Länge", html: "|AB| = 5 cm", quantities: "Nur eine Strecke hat eine Länge." },
  ],
  quiz: {
    question: "Welche Linie hat genau einen Anfangspunkt und kein Ende?",
    options: ["Halbgerade", "Strecke", "Gerade"],
    correctIndex: 0,
    explanation: "Die Halbgerade startet in einem Punkt und läuft ohne Ende weiter. Die Strecke hat zwei Endpunkte, die Gerade keinen.",
  },
  lab: lab(
    "line-kinds",
    "Linien auf Karopapier",
    "Wähle die Art der Linie und ziehe A und B. Ein Kästchen auf dem Bild steht hier für 1 cm.",
    [c("kind", "Art", ["Strecke", "Halbgerade", "Gerade"]), r("ax", "A nach rechts", 0, 8, 1), r("ay", "A nach oben", 0, 6, 1), r("bx", "B nach rechts", 0, 8, 4), r("by", "B nach oben", 0, 6, 2)],
    [
      o("name", "Schreibweise", (v) => ["[AB]", "[AB", "AB"][v.kind]),
      o("laenge", "Länge", (v) => {
        if (v.ax === v.bx && v.ay === v.by) return "A und B fallen zusammen";
        return v.kind === 0 ? `${fmt(Math.hypot(v.ax - v.bx, v.ay - v.by), 1)} cm` : "keine Länge, sie endet nicht";
      }),
    ],
    [
      { id: "fuenf", text: "Zeichne eine Strecke mit der Länge 5 cm.", check: (v) => v.kind === 0 && Math.hypot(v.ax - v.bx, v.ay - v.by) === 5 },
      { id: "strahl", text: "Zeichne eine Halbgerade, die waagrecht nach rechts läuft.", check: (v) => v.kind === 1 && v.ay === v.by && v.bx > v.ax },
      { id: "senkrecht", text: "Zeichne eine Gerade, die genau von oben nach unten läuft.", check: (v) => v.kind === 2 && v.ax === v.bx && v.ay !== v.by },
    ],
  ),
  exercises: [
    {
      id: "begriff",
      make: (rng, level) => {
        const items = [
          ["hat zwei Endpunkte und eine messbare Länge", 0],
          ["beginnt in einem Punkt und läuft ohne Ende weiter", 1],
          ["hat keinen Anfang und kein Ende", 2],
        ] as const;
        const [text, index] = rng.pick(items);
        const notation = rng.pick([["[PQ]", 0], ["[PQ", 1], ["PQ", 2]] as const);
        const names = ["Strecke", "Halbgerade", "Gerade"];
        return task(
          level,
          `Welche Linie ${text}?`,
          `In einer Zeichnung steht ${notation[0]}. Welche Linie ist gemeint, und wie viele Endpunkte hat sie?`,
          level === 1
            ? [pick("Linie:", names, index)]
            : [pick("Linie:", names, notation[1]), num("Endpunkte:", 2 - notation[1], "", 0)],
          "Zähle die festen Endpunkte: Strecke 2, Halbgerade 1, Gerade 0.",
          "Eine eckige Klammer markiert einen festen Endpunkt.",
          level === 1 ? `Das ist eine ${names[index]}.` : `${notation[0]} ist eine ${names[notation[1]]}.`,
          {},
        );
      },
    },
    {
      id: "strecken-auf-gerade",
      make: (rng, level) => {
        const a = rng.int(2, 9), b = rng.int(2, 9);
        if (level === 1)
          return task(
            level,
            `Auf einer Geraden liegen die Punkte A, B und C in dieser Reihenfolge. Es gilt |AB| = ${a} cm und |BC| = ${b} cm. Wie lang ist die Strecke [AC]?`,
            "",
            [num("|AC| =", a + b, "cm", 0)],
            "Die Teilstrecken werden addiert.",
            `${a} cm + ${b} cm.`,
            `|AC| = ${a + b} cm`,
            { a, b },
          );
        const big = a + b + rng.int(1, 6);
        return task(
          level,
          "",
          `Punkt B liegt auf der Strecke [AC]. Die Strecke ist ${big} cm lang, und |AB| = ${a} cm. Wie lang ist [BC]? Wie viele verschiedene Geraden gehen durch A und C?`,
          [num("|BC| =", big - a, "cm", 0), num("Geraden:", 1, "", 0)],
          "Vom Ganzen ziehst du das Teilstück ab.",
          `${big} cm − ${a} cm = ${big - a} cm. Durch zwei Punkte geht genau eine Gerade.`,
          `|BC| = ${big - a} cm, genau eine Gerade`,
          { a, big },
        );
      },
    },
  ],
});

const lagebeziehungen = L(2, {
  id: "ge-2-lagebeziehungen",
  title: "3.2 Lagebeziehungen",
  subtitle: "Parallel, senkrecht, schneidend und der Abstand",
  whyItMatters:
    "Straßenkreuzungen, Heftlinien und Zimmerecken: Überall liegen Geraden in besonderer Lage zueinander.",
  explanationHtml: `<p>Zwei Geraden in einer Ebene <strong>schneiden</strong> sich in einem Punkt oder sie sind <strong>parallel</strong> (g ∥ h): Sie haben überall den gleichen Abstand. Schneiden sie sich im rechten Winkel, stehen sie <strong>senkrecht</strong> aufeinander (g ⊥ h).</p><p>Ein Punkt liegt <strong>auf</strong> einer Geraden (P ∈ g) oder nicht (P ∉ g). Sein <strong>Abstand</strong> von der Geraden ist die Länge der kürzesten Verbindung. Diese steht senkrecht auf der Geraden. Mit dem Geodreieck zeichnest du Senkrechte über die Mittellinie und Parallele über die Hilfslinien.</p><div class="example">g und h sind parallel und 3 cm voneinander entfernt. Die Gerade k steht senkrecht auf g, also auch auf h. Punkt P hat von g den Abstand 2 cm, wenn das Lot von P auf g 2 cm lang ist.</div><div class="merke"><strong>Merke:</strong> Abstand messen heißt immer senkrecht messen.</div>`,
  formulas: [
    { name: "Parallel", html: "g ∥ h", quantities: "Überall gleicher Abstand, kein Schnittpunkt" },
    { name: "Senkrecht", html: "g ⊥ h", quantities: "Schnitt im rechten Winkel (90°)" },
    { name: "Punkt und Gerade", html: "P ∈ g, Q ∉ g", quantities: "P liegt auf g, Q liegt nicht auf g." },
  ],
  quiz: {
    question: "Wie misst du den Abstand eines Punktes von einer Geraden?",
    options: ["Entlang der kürzesten Verbindung, also senkrecht zur Geraden.", "Von dem Punkt schräg zu irgendeinem Punkt der Geraden.", "Parallel zur Geraden."],
    correctIndex: 0,
    explanation: "Jede schräge Verbindung ist länger. Der Abstand ist die kürzeste, und die steht senkrecht.",
  },
  lab: lab(
    "line-relations",
    "Gerade drehen",
    "Drehe die Gerade h am orangen Griff und ziehe den Punkt P. Oben steht die Lagebeziehung.",
    [r("angle", "Winkel von h", 0, 175, 30, 5, "°"), r("d", "Abstand bei parallel", 1, 5, 2, 1, "cm"), r("p", "P über g", -4, 4, 2, 1, "cm")],
    [
      o("lage", "g und h", (v) => (v.angle === 0 ? "parallel" : v.angle === 90 ? "senkrecht" : "schneiden sich")),
      o("abstand", "Abstand von P zu g", (v) => Math.abs(v.p), "cm"),
      o("auf", "P liegt auf g?", (v) => (v.p === 0 ? "ja" : "nein")),
    ],
    [
      { id: "parallel", text: "Mache g und h parallel mit 3 cm Abstand.", check: (v) => v.angle === 0 && v.d === 3 },
      { id: "senkrecht", text: "Stelle h senkrecht zu g.", check: (v) => v.angle === 90 },
      { id: "auf", text: "Lege den Punkt P auf die Gerade g.", check: (v) => v.p === 0 },
    ],
  ),
  exercises: [
    {
      id: "lage",
      make: (rng, level) => {
        const items = [
          ["Die beiden Geraden haben überall den gleichen Abstand.", 0],
          ["Die beiden Geraden schneiden sich im rechten Winkel.", 1],
          ["Die beiden Geraden treffen sich unter einem Winkel von 40°.", 2],
        ] as const;
        const [text, index] = rng.pick(items);
        const names = ["parallel", "senkrecht", "schneidend, aber nicht senkrecht"];
        const sentence = rng.pick([
          ["Die Längsseiten deines Hefts", 0],
          ["Die senkrechte Kante einer Zimmerecke und die Kante am Boden", 1],
          ["Zwei Straßen an einer schrägen Kreuzung", 2],
        ] as const);
        return task(
          level,
          `${text} Wie liegen sie zueinander?`,
          `Stelle dir beide als Geraden vor: ${sentence[0]}. Wie liegen sie zueinander?`,
          [pick("Lage:", names, level === 1 ? index : sentence[1])],
          "Gleicher Abstand: parallel. 90°: senkrecht.",
          "Prüfe zuerst den Abstand, dann den Winkel.",
          `Die Lage ist: ${names[level === 1 ? index : sentence[1]]}.`,
          {},
        );
      },
    },
    {
      id: "abstand",
      make: (rng, level) => {
        const a = rng.int(2, 6), b = rng.int(2, 6);
        const between = rng.int(0, 1) === 0;
        const bb = between || a !== b ? b : b + 1;
        const answer = between ? a + bb : Math.abs(a - bb);
        if (level === 1)
          return task(
            level,
            `Punkt P liegt ${a} cm über der Geraden g. Punkt Q liegt genau darunter, ${b} cm unter g. Wie weit sind P und Q voneinander entfernt?`,
            "",
            [num("Zusammen:", a + b, "cm", 0)],
            "Beide Abstände liegen auf verschiedenen Seiten von g.",
            `${a} cm + ${b} cm.`,
            `Zusammen ${a + b} cm`,
            { a, b },
          );
        return task(
          level,
          "",
          `Die Geraden g, h und k sind parallel. h hat von g den Abstand ${a} cm, k hat von g den Abstand ${bb} cm. ${between ? "h und k liegen auf verschiedenen Seiten von g." : "h und k liegen auf derselben Seite von g."} Wie groß ist der Abstand von h und k?`,
          [num("Abstand:", answer, "cm", 0)],
          "Zeichne eine Skizze: Liegen die Geraden auf verschiedenen Seiten, addierst du.",
          between ? `${a} cm + ${bb} cm.` : `Größerer minus kleinerer Abstand: ${Math.max(a, bb)} cm − ${Math.min(a, bb)} cm.`,
          `Der Abstand ist ${answer} cm.`,
          { a, bb },
        );
      },
    },
  ],
});

const kreis = L(3, {
  id: "ge-3-kreis",
  title: "3.3 Der Kreis",
  subtitle: "Kreislinie, Kreisfläche, Radius, Durchmesser, Kreissektor",
  whyItMatters:
    "Mit dem Zirkel zeichnest du alle Punkte mit dem gleichen Abstand von einem Mittelpunkt.",
  explanationHtml: `<p>Eine <strong>Kreislinie</strong> besteht aus allen Punkten, die vom <strong>Mittelpunkt M</strong> denselben Abstand haben. Dieser Abstand heißt <strong>Radius r</strong>. Eine Strecke durch M von Rand zu Rand ist der <strong>Durchmesser d</strong>, er ist doppelt so lang wie der Radius.</p><p>Die <strong>Kreisfläche</strong> ist die Fläche innerhalb der Kreislinie. Ein <strong>Kreissektor</strong> ist ein „Tortenstück“: begrenzt von zwei Radien und einem Stück Kreislinie.</p><p>Ein Punkt liegt innerhalb des Kreises, wenn sein Abstand von M kleiner als r ist, außerhalb, wenn er größer ist, und genau auf der Kreislinie, wenn er gleich r ist.</p><div class="example">Ein Kreis mit r = 3 cm hat d = 6 cm. Ein Punkt mit 4 cm Abstand von M liegt außerhalb. Teilst du den Kreis in 4 gleiche Sektoren, hat jeder 360° : 4 = 90°.</div><div class="merke"><strong>Merke:</strong> d = 2 · r. Alle Punkte der Kreislinie haben von M den Abstand r.</div>`,
  formulas: [
    { name: "Durchmesser", html: "d = 2 · r", quantities: "r Radius, d Durchmesser" },
    { name: "Gleiche Sektoren", html: "Winkel = 360° : Anzahl", quantities: "Ein voller Kreis hat 360°." },
  ],
  quiz: {
    question: "Ein Kreis hat den Durchmesser 10 cm. Wie groß ist der Radius?",
    options: ["5 cm", "20 cm", "10 cm"],
    correctIndex: 0,
    explanation: "Der Radius ist halb so lang wie der Durchmesser.",
  },
  lab: lab(
    "circle-parts",
    "Kreis untersuchen",
    "Ziehe den Radius und den Punkt P. Mit dem Regler stellst du den orangen Sektor ein.",
    [r("r", "Radius", 1, 5, 2, 1, "cm"), r("sector", "Sektor", 0, 360, 60, 15, "°"), r("p", "Abstand von P", 0, 6, 1, 0.5, "cm")],
    [
      o("d", "Durchmesser", (v) => 2 * v.r, "cm"),
      o("lage", "P liegt", (v) => (v.p < v.r ? "innerhalb" : v.p > v.r ? "außerhalb" : "auf der Kreislinie")),
    ],
    [
      { id: "durchmesser", text: "Stelle den Kreis so ein, dass der Durchmesser 8 cm ist.", check: (v) => v.r === 4 },
      { id: "viertel", text: "Stelle einen Viertelkreis als Sektor ein.", check: (v) => v.sector === 90 },
      { id: "auf-linie", text: "Lege den Punkt P genau auf die Kreislinie, bei einem Radius von 3 cm.", check: (v) => v.r === 3 && v.p === 3 },
    ],
  ),
  exercises: [
    {
      id: "radius-durchmesser",
      make: (rng, level) => {
        const radius = rng.int(2, level === 1 ? 12 : 40);
        const askD = rng.int(0, 1) === 0;
        return task(
          level,
          askD ? `Ein Kreis hat den Radius ${radius} cm. Wie groß ist sein Durchmesser?` : `Ein Kreis hat den Durchmesser ${2 * radius} cm. Wie groß ist sein Radius?`,
          askD ? `Eine Tischplatte soll ${radius} cm vom Mittelpunkt bis zum Rand messen. Wie breit ist die Platte an der breitesten Stelle?` : `Ein rundes Becken ist an der breitesten Stelle ${2 * radius} cm breit. Wie weit ist es vom Mittelpunkt bis zum Rand?`,
          [num(askD ? "d =" : "r =", askD ? 2 * radius : radius, "cm", 0, { slips: [{ value: askD ? radius / 2 : 4 * radius, hint: "Prüfe die Richtung: Der Durchmesser ist doppelt so lang wie der Radius." }] })],
          "d = 2 · r",
          askD ? `2 · ${radius} cm.` : `${2 * radius} cm : 2.`,
          askD ? `d = ${2 * radius} cm` : `r = ${radius} cm`,
          { radius },
        );
      },
    },
    {
      id: "sektoren",
      make: (rng, level) => {
        const parts = rng.pick([2, 3, 4, 5, 6, 8, 9, 10, 12]);
        const angle = 360 / parts;
        const take = rng.int(1, parts - 1);
        return task(
          level,
          `Ein Kreis wird in ${parts} gleich große Sektoren geteilt. Wie groß ist der Winkel eines Sektors?`,
          `Eine runde Pizza wird in ${parts} gleiche Stücke geschnitten. Du nimmst ${take} davon. Wie groß ist der Winkel deines Teils zusammen?`,
          [num("Winkel:", level === 1 ? angle : take * angle, "°", 0)],
          "Winkel = 360° : Anzahl der Sektoren",
          `360° : ${parts} = ${angle}°${level === 2 ? `, und ${take} · ${angle}°` : ""}.`,
          `Der Winkel ist ${level === 1 ? angle : take * angle}°.`,
          { parts },
        );
      },
    },
  ],
});

const dreiecke = L(4, {
  id: "ge-4-dreiecke",
  title: "3.4 Dreiecke",
  subtitle: "Arten nach Seiten und Winkeln",
  whyItMatters:
    "Dreiecke halten Brücken und Dächer stabil. Du lernst, sie an ihren Eigenschaften zu erkennen.",
  explanationHtml: `<p>Ein <strong>Dreieck</strong> hat drei Ecken und drei Seiten. Du erzeugst es durch Zeichnen, Falten, Spannen am Geobrett oder mit Geometriesoftware.</p><p><strong>Nach den Seiten:</strong> Ein <strong>gleichseitiges</strong> Dreieck hat drei gleich lange Seiten, ein <strong>gleichschenkliges</strong> mindestens zwei, ein <strong>unregelmäßiges</strong> keine gleichen Seiten. Jedes gleichseitige Dreieck ist also auch gleichschenklig. Du nennst immer den genauesten Namen, das ist der, der am meisten über die Figur sagt.</p><p><strong>Nach den Winkeln:</strong> Ein <strong>spitzwinkliges</strong> Dreieck hat nur spitze Winkel, ein <strong>rechtwinkliges</strong> einen rechten Winkel, ein <strong>stumpfwinkliges</strong> einen stumpfen Winkel.</p><div class="example">Seiten 5 cm, 5 cm und 5 cm: gleichseitig. Seiten 3 cm, 4 cm und 5 cm: unregelmäßig und rechtwinklig. Seiten 3 cm, 3 cm und 5 cm: gleichschenklig und stumpfwinklig.</div><div class="merke"><strong>Merke:</strong> Ein Dreieck bekommt zwei Namen: einen nach den Seiten und einen nach den Winkeln.</div>`,
  formulas: [
    { name: "Nach Seiten", html: "gleichseitig, gleichschenklig, unregelmäßig", quantities: "Zähle die gleich langen Seiten." },
    { name: "Nach Winkeln", html: "spitzwinklig, rechtwinklig, stumpfwinklig", quantities: "Der größte Winkel entscheidet." },
  ],
  quiz: {
    question: "Wie heißt ein Dreieck mit den Seiten 4 cm, 4 cm und 6 cm?",
    options: ["gleichschenklig", "gleichseitig", "unregelmäßig"],
    correctIndex: 0,
    explanation: "Zwei Seiten sind gleich lang, die dritte nicht.",
  },
  lab: lab(
    "triangle-types",
    "Dreieck bauen",
    "Stelle die drei Seitenlängen ein. Das Labor zeichnet das Dreieck und nennt seine Art.",
    [r("a", "Seite a", 2, 8, 4, 1, "cm"), r("b", "Seite b", 2, 8, 5, 1, "cm"), r("c", "Seite c", 2, 8, 6, 1, "cm")],
    [
      o("seiten", "Nach Seiten", (v) => (validTriangle(v.a, v.b, v.c) ? sideKind(v.a, v.b, v.c) : "kein Dreieck")),
      o("winkel", "Nach Winkeln", (v) => (validTriangle(v.a, v.b, v.c) ? angleKind(v.a, v.b, v.c) : "kein Dreieck")),
    ],
    [
      { id: "gleichseitig", text: "Baue ein gleichseitiges Dreieck mit der Seitenlänge 5 cm.", check: (v) => v.a === 5 && v.b === 5 && v.c === 5 },
      { id: "rechtwinklig", text: "Baue ein rechtwinkliges Dreieck aus 3 cm, 4 cm und 5 cm.", check: (v) => validTriangle(v.a, v.b, v.c) && angleKind(v.a, v.b, v.c) === "rechtwinklig" && v.a + v.b + v.c === 12 },
      { id: "stumpf", text: "Baue ein gleichschenkliges und stumpfwinkliges Dreieck.", check: (v) => validTriangle(v.a, v.b, v.c) && sideKind(v.a, v.b, v.c) === "gleichschenklig" && angleKind(v.a, v.b, v.c) === "stumpfwinklig" },
    ],
  ),
  exercises: [
    {
      id: "nach-seiten",
      make: (rng, level) => {
        const form = rng.int(0, 2);
        const a = rng.int(3, 9);
        const sides = form === 0 ? [a, a, a] : form === 1 ? [a, a, a + rng.int(1, 2)] : [a, a + 1, a + 3];
        const shown = rng.shuffle(sides);
        const name = sideKind(shown[0], shown[1], shown[2]);
        const names = ["gleichseitig", "gleichschenklig", "unregelmäßig"];
        const u = shown[0] + shown[1] + shown[2];
        return task(
          level,
          `Ein Dreieck hat die Seiten ${shown.join(" cm, ")} cm. Wie heißt es nach seinen Seiten am genauesten?`,
          `Ein Draht wird zu einem Dreieck mit den Seiten ${shown.join(" cm, ")} cm gebogen. Wie heißt das Dreieck am genauesten, und wie lang ist der Draht?`,
          [pick("Art:", names, names.indexOf(name)), ...(level === 2 ? [num("Drahtlänge:", u, "cm", 0)] : [])],
          "Zähle die gleich langen Seiten.",
          `Gleich lange Seiten: ${form === 0 ? "drei" : form === 1 ? "zwei" : "keine"}.`,
          `Das Dreieck ist ${name}.`,
          { a },
        );
      },
    },
    {
      id: "nach-winkeln",
      make: (rng, level) => {
        const angle = rng.pick([65, 70, 75, 80, 85, 90, 90, 100, 110, 120, 130]);
        const names = ["spitzwinklig", "rechtwinklig", "stumpfwinklig"];
        const index = angle === 90 ? 1 : angle > 90 ? 2 : 0;
        const claims = [
          ["Sina sagt: „Ein Dreieck kann zwei rechte Winkel haben.“ Stimmt das?", false, "Zwei rechte Winkel an einer Seite: Die anderen Seiten wären parallel und träfen sich nie."],
          ["Tom sagt: „Ein gleichseitiges Dreieck kann auch rechtwinklig sein.“ Stimmt das?", false, "In einem gleichseitigen Dreieck sind alle Winkel gleich groß, und zwar 60°."],
          ["Mia sagt: „Ein rechtwinkliges Dreieck kann zugleich gleichschenklig sein.“ Stimmt das?", true, "Falte ein Quadrat entlang der Diagonale: Das Dreieck hat einen rechten Winkel und zwei gleich lange Seiten."],
          ["Ben sagt: „Ein stumpfwinkliges Dreieck kann zugleich gleichschenklig sein.“ Stimmt das?", true, "Die Seiten 3 cm, 3 cm und 5 cm ergeben ein solches Dreieck."],
        ] as const;
        const [claim, truth, reason] = rng.pick(claims);
        if (level === 1)
          return task(
            level,
            `Der größte Winkel eines Dreiecks ist ${angle}°. Wie heißt das Dreieck nach seinen Winkeln?`,
            "",
            [pick("Art:", names, index)],
            "Unter 90°: spitz. Genau 90°: recht. Über 90°: stumpf.",
            `${angle}° ist ${angleName(angle)}.`,
            `Das Dreieck ist ${names[index]}.`,
            { angle },
          );
        return task(
          level,
          "",
          claim,
          [pick("Antwort:", ["ja", "nein"], truth ? 0 : 1)],
          "Versuche, das Dreieck zu zeichnen.",
          reason,
          truth ? "Ja, das stimmt." : "Nein, das stimmt nicht.",
          {},
        );
      },
    },
  ],
});

const vierecke = L(5, {
  id: "ge-5-vierecke",
  title: "3.5 Vierecke",
  subtitle: "Quadrat, Rechteck, Parallelogramm, Raute, Trapez, Drachenviereck",
  whyItMatters:
    "Jedes Viereck hat einen Namen, der genau sagt, was an ihm besonders ist. Damit beschreibst du Figuren kurz und eindeutig.",
  explanationHtml: `<p>Ein <strong>Viereck</strong> hat vier Ecken und vier Seiten. Du erkennst besondere Vierecke an ihren Eigenschaften:</p><p><strong>Quadrat:</strong> vier gleich lange Seiten, vier rechte Winkel. <strong>Rechteck:</strong> vier rechte Winkel, gegenüberliegende Seiten gleich lang. <strong>Parallelogramm:</strong> gegenüberliegende Seiten parallel und gleich lang. <strong>Raute:</strong> vier gleich lange Seiten. <strong>Trapez:</strong> mindestens ein Paar paralleler Seiten. <strong>Drachenviereck:</strong> zwei Paare gleich langer Nachbarseiten.</p><p>Jedes Quadrat ist auch ein Rechteck und eine Raute. Jedes Rechteck ist auch ein Parallelogramm, und jedes Parallelogramm ist auch ein Trapez. Umgekehrt gilt das nicht. Eine Figur kann also mehrere Namen tragen. Du nennst immer den genauesten, das ist der, der am meisten über sie sagt: Ein Viereck mit genau einem Paar paralleler Seiten heißt Trapez, eines mit zwei Paaren mindestens Parallelogramm. Figuren kannst du zeichnen, falten oder am Geobrett spannen.</p><div class="example">Figur mit vier gleich langen Seiten, aber ohne rechte Winkel: eine Raute. Genauester Name einer Figur mit genau einem Paar paralleler Seiten: Trapez.</div><div class="merke"><strong>Merke:</strong> Prüfe der Reihe nach: gleich lange Seiten, parallele Seiten, rechte Winkel. Dann nenne den genauesten Namen.</div>`,
  formulas: [
    { name: "Besondere Vierecke", html: "Quadrat → Rechteck → Parallelogramm → Trapez", quantities: "Jede Figur ist auch die nächste, aber nicht umgekehrt. Du nennst den genauesten Namen." },
  ],
  quiz: {
    question: "Welche Aussage stimmt?",
    options: ["Jedes Quadrat ist ein Rechteck.", "Jedes Rechteck ist ein Quadrat.", "Jede Raute ist ein Quadrat."],
    correctIndex: 0,
    explanation: "Ein Quadrat hat vier rechte Winkel und ist daher ein Rechteck. Umgekehrt muss ein Rechteck keine gleich langen Seiten haben.",
  },
  lab: lab(
    "quad-types",
    "Viereck verformen",
    "Ziehe die Ecken B und D, oder kürze mit dem Regler die obere Seite. Oben steht, welches Viereck entstanden ist.",
    [r("w", "Grundseite", 2, 8, 6, 1, "cm"), r("h", "Höhe", 1, 5, 3, 1, "cm"), r("s", "Verschieben", -3, 3, 0, 1, "cm"), r("t", "Oben kürzen", 0, 2, 0, 1, "cm")],
    [
      o("name", "Name", (v) => quadrilateral(v.w, v.h, v.s, v.t).name),
      o("eigenschaft", "Parallele Seitenpaare", (v) => (Math.min(v.t, Math.floor((v.w - 1) / 2)) > 0 ? "ein Paar" : "zwei Paare")),
    ],
    [
      { id: "quadrat", text: "Mache aus dem Viereck ein Quadrat.", check: (v) => quadrilateral(v.w, v.h, v.s, v.t).name === "Quadrat" },
      { id: "parallelogramm", text: "Schiebe die obere Seite, sodass ein Parallelogramm entsteht.", check: (v) => quadrilateral(v.w, v.h, v.s, v.t).name === "Parallelogramm" },
      { id: "raute", text: "Baue eine Raute: Grundseite 5 cm, Höhe 4 cm, um 3 cm verschoben.", check: (v) => quadrilateral(v.w, v.h, v.s, v.t).name === "Raute" },
    ],
  ),
  exercises: [
    {
      id: "eigenschaft-name",
      make: (rng, level) => {
        const items = [
          ["vier rechte Winkel und vier gleich lange Seiten", "Quadrat"],
          ["vier rechte Winkel, aber nicht vier gleich lange Seiten", "Rechteck"],
          ["vier gleich lange Seiten, aber keine rechten Winkel", "Raute"],
          ["zwei Paare paralleler Seiten, aber keine rechten Winkel und nicht vier gleich lange Seiten", "Parallelogramm"],
          ["genau ein Paar paralleler Seiten", "Trapez"],
          ["zwei Paare gleich langer Nachbarseiten, aber keine parallelen Seiten", "Drachenviereck"],
        ] as const;
        const [text, name] = rng.pick(items);
        const others = rng.shuffle(items.map(([, n]) => n).filter((n) => n !== name)).slice(0, 2);
        return task(
          level,
          `Wie heißt ein Viereck am genauesten, das ${text} hat?`,
          `Du spannst am Geobrett ein Viereck mit dieser Eigenschaft: ${text}. Welcher Name passt am genauesten?`,
          [pick("Name:", [name, ...others], 0)],
          "Prüfe Seiten, Parallelen und Winkel.",
          `Das beschreibt genau die Eigenschaften dieser Figur.`,
          `Die Figur heißt ${name}.`,
          {},
        );
      },
    },
    {
      id: "wahr-falsch",
      make: (rng, level) => {
        const items = [
          ["Jedes Quadrat ist ein Rechteck.", true],
          ["Jedes Rechteck ist ein Parallelogramm.", true],
          ["Jedes Quadrat ist eine Raute.", true],
          ["Jedes Parallelogramm ist ein Trapez.", true],
          ["Jedes Rechteck ist ein Quadrat.", false],
          ["Jede Raute ist ein Quadrat.", false],
          ["Jedes Parallelogramm ist ein Rechteck.", false],
        ] as const;
        const [claim, truth] = rng.pick(items);
        const w = rng.int(3, 8), h = rng.int(1, 5);
        const name = quadrilateral(w, h, 0, 0).name;
        if (level === 1)
          return task(
            level,
            `Stimmt die Aussage? ${claim}`,
            "",
            [pick("Die Aussage ist …", ["wahr", "falsch"], truth ? 0 : 1)],
            "Überlege, welche Eigenschaften die erste Figur immer hat.",
            truth ? "Die erste Figur hat alle Eigenschaften der zweiten." : "Die erste Figur muss nicht alle Eigenschaften der zweiten haben.",
            truth ? "Wahr." : "Falsch.",
            {},
          );
        return task(
          level,
          "",
          `Du faltest ein Papier zu einer Figur mit vier rechten Winkeln. Sie ist ${w} cm breit und ${h} cm hoch. Wie heißt sie am genauesten, und wie viele rechte Winkel hat sie?`,
          [pick("Name:", ["Quadrat", "Rechteck", "Raute"], name === "Quadrat" ? 0 : 1), num("Rechte Winkel:", 4, "", 0)],
          "Sind alle Seiten gleich lang?",
          w === h ? "Beide Seiten sind gleich lang." : "Die Seiten sind verschieden lang.",
          `Es ist ein ${name} mit 4 rechten Winkeln.`,
          { w, h },
        );
      },
    },
  ],
});

const koordinaten = L(6, {
  id: "ge-6-koordinatensystem",
  title: "3.6 Das Koordinatensystem",
  subtitle: "Punkte festlegen und Figuren darstellen",
  whyItMatters:
    "Mit zwei Zahlen sagst du genau, wo ein Punkt liegt. So funktionieren Karten, Schiffe versenken und Computergrafik.",
  explanationHtml: `<p>Das <strong>Koordinatensystem</strong> hat zwei senkrechte Achsen: die waagrechte <strong>x-Achse</strong> und die senkrechte <strong>y-Achse</strong>. Sie schneiden sich im <strong>Ursprung O(0|0)</strong>.</p><p>Ein Punkt hat zwei <strong>Koordinaten</strong>: P(x|y). Die erste Zahl sagt, wie weit du nach rechts (oder bei einer negativen Zahl nach links) gehst. Die zweite sagt, wie weit nach oben (oder unten). Reihenfolge merken: „erst rechts, dann hoch“.</p><p>Verbindest du Punkte, entstehen Figuren, deren Eigenschaften du prüfen kannst.</p><div class="example">P(3|−2): 3 nach rechts, 2 nach unten. Die Punkte A(1|1), B(5|1), C(5|4) und D(1|4) bilden ein Rechteck mit den Seiten 4 und 3.</div><div class="merke"><strong>Merke:</strong> P(x|y): erst x, dann y. Punkte auf der y-Achse haben x = 0, Punkte auf der x-Achse haben y = 0.</div>`,
  formulas: [
    { name: "Punkt", html: "P(x|y)", quantities: "x nach rechts, y nach oben" },
    { name: "Ursprung", html: "O(0|0)", quantities: "Schnittpunkt der Achsen" },
  ],
  quiz: {
    question: "Wo liegt der Punkt P(0|4)?",
    options: ["Auf der y-Achse", "Auf der x-Achse", "Im Ursprung"],
    correctIndex: 0,
    explanation: "x = 0 bedeutet: nicht nach rechts oder links. Der Punkt liegt 4 hoch, also auf der y-Achse.",
  },
  lab: lab(
    "coords",
    "Punkte und Rechteck",
    "Ziehe die Punkte A und C. Daraus entsteht ein Rechteck, dessen Seiten parallel zu den Achsen liegen.",
    [r("ax", "x von A", -6, 6, 1), r("ay", "y von A", -5, 5, 1), r("bx", "x von C", -6, 6, 3), r("by", "y von C", -5, 5, 2)],
    [
      o("punkte", "Eckpunkte", (v) => `A(${n0(v.ax)}|${n0(v.ay)}), B(${n0(v.bx)}|${n0(v.ay)}), C(${n0(v.bx)}|${n0(v.by)}), D(${n0(v.ax)}|${n0(v.by)})`),
      o("breite", "Breite", (v) => Math.abs(v.bx - v.ax)),
      o("hoehe", "Höhe", (v) => Math.abs(v.by - v.ay)),
    ],
    [
      { id: "punkt", text: "Setze A auf den Punkt (2|3).", check: (v) => v.ax === 2 && v.ay === 3 },
      { id: "achse", text: "Setze C auf die y-Achse, auf den Punkt (0|−4).", check: (v) => v.bx === 0 && v.by === -4 },
      { id: "quadrat", text: "Forme ein Quadrat mit der Seitenlänge 4.", check: (v) => Math.abs(v.bx - v.ax) === 4 && Math.abs(v.by - v.ay) === 4 },
    ],
  ),
  exercises: [
    {
      id: "koordinaten-lesen",
      make: (rng, level) => {
        const x = level === 1 ? rng.int(1, 9) : rng.sign() * rng.int(1, 9);
        const y = level === 1 ? rng.int(1, 9) : rng.sign() * rng.int(1, 9);
        const sideX = x < 0 ? "links" : "rechts";
        const sideY = y < 0 ? "unten" : "oben";
        return task(
          level,
          `Vom Ursprung gehst du ${Math.abs(x)} Einheiten nach ${sideX} und ${Math.abs(y)} nach ${sideY}. Gib die Koordinaten an.`,
          `Ein Schatz liegt ${Math.abs(y)} Felder ${sideY === "oben" ? "nördlich" : "südlich"} und ${Math.abs(x)} Felder ${sideX === "rechts" ? "östlich" : "westlich"} vom Ursprung. Rechts ist Osten, oben Norden. Gib die Koordinaten an.`,
          [
            num("x =", x, "", 0, { slips: Math.abs(x) !== Math.abs(y) ? [{ value: y, hint: "Du hast x und y vertauscht. Erst rechts oder links, dann hoch oder runter." }] : [] }),
            num("y =", y, "", 0),
          ],
          "P(x|y): erst rechts oder links, dann hoch oder runter",
          `Nach ${sideX} bestimmt x, nach ${sideY} bestimmt y.`,
          `P(${n0(x)}|${n0(y)})`,
          { x, y },
        );
      },
    },
    {
      id: "vierter-punkt",
      make: (rng, level) => {
        const ax = rng.int(-4, 2), ay = rng.int(-4, 2);
        const w = rng.int(2, 4), h = rng.int(2, 3);
        if (level === 1) {
          const n = rng.int(1, 8), m = rng.int(1, 8), k = rng.int(2, 6);
          return task(
            level,
            `Die Punkte A(${n}|${m}) und B(${n + k}|${m}) liegen auf einer waagrechten Linie. Wie lang ist die Strecke [AB]?`,
            "",
            [num("Länge:", k, "LE", 0)],
            "Gleiche y-Koordinate: Abstand der x-Werte",
            `${n + k} − ${n} = ${k}.`,
            `Die Strecke ist ${k} Längeneinheiten lang.`,
            { n, m, k },
          );
        }
        return task(
          level,
          "",
          `A(${n0(ax)}|${n0(ay)}), B(${n0(ax + w)}|${n0(ay)}) und C(${n0(ax + w)}|${n0(ay + h)}) sind Ecken eines Rechtecks. Welche Koordinaten hat die vierte Ecke D?`,
          [num("x =", ax, "", 0), num("y =", ay + h, "", 0)],
          "D liegt über A und auf gleicher Höhe wie C.",
          `D hat das x von A und das y von C.`,
          `D(${n0(ax)}|${n0(ay + h)})`,
          { ax, ay, w, h },
        );
      },
    },
  ],
});

const winkel = L(7, {
  id: "ge-7-winkel",
  title: "3.7 Winkel messen und zeichnen",
  subtitle: "Winkel von 0° bis 360° mit Fachbegriffen",
  whyItMatters:
    "Vom Schnittmuster bis zum Dachbalken: Mit dem Geodreieck bestimmst du, wie stark zwei Richtungen voneinander abweichen.",
  explanationHtml: `<p>Ein <strong>Winkel</strong> besteht aus einem <strong>Scheitel</strong> S und zwei <strong>Schenkeln</strong> (Halbgeraden). Du benennst ihn mit griechischen Buchstaben α, β, γ. Gemessen wird in Grad, ein voller Kreis hat 360°.</p><p><strong>Winkelarten:</strong> Nullwinkel (genau 0°), spitz (über 0° und unter 90°), recht (genau 90°), stumpf (über 90° und unter 180°), gestreckt (genau 180°), überstumpf (über 180° und unter 360°), Vollwinkel (genau 360°).</p><p><strong>Messen mit dem Geodreieck:</strong> Lege den Nullpunkt auf den Scheitel und die lange Kante auf einen Schenkel. Lies an der richtigen Skala ab, wo der andere Schenkel liegt. Ein überstumpfer Winkel: Miss den Rest bis 360° und ziehe ab.</p><div class="example">Der kleine Winkel zwischen zwei Schenkeln misst 70°. Der überstumpfe Winkel dazu ist 360° − 70° = 290°.</div><div class="merke"><strong>Merke:</strong> 0° &lt; spitz &lt; 90° &lt; stumpf &lt; 180° &lt; überstumpf &lt; 360°. Genau auf den Grenzen liegen Nullwinkel, rechter Winkel, gestreckter Winkel und Vollwinkel.</div>`,
  formulas: [
    { name: "Winkelarten", html: "Nullwinkel (0°), spitz, recht (90°), stumpf, gestreckt (180°), überstumpf, Vollwinkel (360°)", quantities: "α, β, γ benennen Winkel." },
    { name: "Überstumpfer Winkel", html: "α = 360° − kleiner Winkel", quantities: "Beide zusammen ergeben einen Vollwinkel." },
  ],
  quiz: {
    question: "Welche Art hat ein Winkel von 135°?",
    options: ["stumpf", "spitz", "überstumpf"],
    correctIndex: 0,
    explanation: "135° liegt zwischen 90° und 180°.",
  },
  lab: lab(
    "angle",
    "Winkel drehen",
    "Ziehe den Griff am freien Schenkel. Du siehst die Größe und den Namen des Winkels.",
    [r("a", "Winkel", 0, 360, 40, 5, "°")],
    [
      o("name", "Winkelart", (v) => angleName(v.a)),
      o("rest", "Rest bis 360°", (v) => 360 - v.a, "°"),
    ],
    [
      { id: "stumpf", text: "Stelle einen stumpfen Winkel von 135° ein.", check: (v) => v.a === 135 },
      { id: "gestreckt", text: "Stelle einen gestreckten Winkel ein.", check: (v) => v.a === 180 },
      { id: "ueberstumpf", text: "Stelle einen überstumpfen Winkel von 270° ein.", check: (v) => v.a === 270 },
    ],
  ),
  exercises: [
    {
      id: "winkelart",
      make: (rng, level) => {
        const a = rng.pick([20, 45, 70, 90, 110, 150, 180, 200, 270, 300, 360]);
        const names = ["spitzer Winkel", "rechter Winkel", "stumpfer Winkel", "gestreckter Winkel", "überstumpfer Winkel", "Vollwinkel"];
        const name = angleName(a);
        const others = rng.shuffle(names.filter((n) => n !== name)).slice(0, 2);
        if (level === 1)
          return task(
            level,
            `Welche Art hat ein Winkel von ${a}°?`,
            "",
            [pick("Art:", [name, ...others], 0)],
            "Vergleiche mit 90°, 180° und 360°.",
            `${a}° einordnen: Grenzen sind 90°, 180°, 360°.`,
            `${a}° ist ein ${name}.`,
            { a },
          );
        const b = rng.int(4, 34) * 5;
        return task(
          level,
          "",
          `Der kleinere Winkel zwischen zwei Schenkeln misst ${b}°. Wie groß ist der überstumpfe Winkel, der mit ihm einen Vollwinkel bildet?`,
          [num("Winkel:", 360 - b, "°", 0, { slips: [{ value: 180 - b, hint: "Das wäre der Rest bis 180°. Ein Vollwinkel hat 360°." }] })],
          "Beide zusammen ergeben 360°.",
          `360° − ${b}° = ${360 - b}°.`,
          `Der überstumpfe Winkel misst ${360 - b}°.`,
          { b },
        );
      },
    },
    {
      id: "uhr",
      make: (rng, level) => {
        const hour = rng.int(1, 5);
        if (level === 1) {
          const parts = rng.pick([2, 3, 4, 6]);
          return task(
            level,
            `Ein voller Kreis wird in ${parts} gleiche Winkel geteilt. Wie groß ist einer davon?`,
            "",
            [num("Winkel:", 360 / parts, "°", 0)],
            "360° : Anzahl der Teile",
            `360° : ${parts} = ${360 / parts}°.`,
            `Ein Winkel misst ${360 / parts}°.`,
            { parts },
          );
        }
        return task(
          level,
          "",
          `Der große Zeiger einer Uhr steht auf 12, der kleine auf ${hour}. Der Abstand zwischen zwei Zahlen auf dem Zifferblatt beträgt 30°. Welchen Winkel schließen die Zeiger ein?`,
          [num("Winkel:", hour * 30, "°", 0)],
          "Zähle die Abstände zwischen den Zeigern.",
          `${hour} · 30° = ${hour * 30}°.`,
          `Der Winkel ist ${hour * 30}°.`,
          { hour },
        );
      },
    },
  ],
});

const winkelpaare = L(8, {
  id: "ge-8-winkelpaare",
  title: "3.8 Scheitelwinkel und Nebenwinkel",
  subtitle: "Winkelbeziehungen an sich schneidenden Geraden",
  whyItMatters:
    "Wenn sich zwei Geraden schneiden, kennst du mit einem Winkel gleich alle vier. Du sparst dir das Messen.",
  explanationHtml: `<p>Schneiden sich zwei Geraden, entstehen vier Winkel. Zwei <strong>gegenüberliegende</strong> Winkel heißen <strong>Scheitelwinkel</strong>. Sie sind immer gleich groß.</p><p>Zwei <strong>nebeneinanderliegende</strong> Winkel heißen <strong>Nebenwinkel</strong>. Zusammen bilden sie einen gestreckten Winkel, also 180°.</p><div class="example">Ist α = 50°, dann ist sein Scheitelwinkel γ = 50°. Die Nebenwinkel sind β = 180° − 50° = 130° und δ = 130°. Probe: 50° + 130° + 50° + 130° = 360°.</div><div class="merke"><strong>Merke:</strong> Scheitelwinkel sind gleich groß. Nebenwinkel ergeben zusammen 180°.</div>`,
  formulas: [
    { name: "Scheitelwinkel", html: "α = γ", quantities: "Gegenüberliegende Winkel" },
    { name: "Nebenwinkel", html: "α + β = 180°", quantities: "Nebeneinanderliegende Winkel" },
  ],
  quiz: {
    question: "Ein Winkel misst 65°. Wie groß ist sein Nebenwinkel?",
    options: ["115°", "65°", "25°"],
    correctIndex: 0,
    explanation: "Nebenwinkel ergeben 180°: 180° − 65° = 115°. 65° wäre der Scheitelwinkel.",
  },
  lab: lab(
    "angle-pairs",
    "Zwei Geraden",
    "Drehe die zweite Gerade am Griff. Grün sind α und sein Scheitelwinkel γ, schwarz die anderen beiden.",
    [r("a", "α", 5, 175, 50, 5, "°")],
    [
      o("alpha", "α und γ", (v) => v.a, "°"),
      o("beta", "β und δ", (v) => 180 - v.a, "°"),
      o("summe", "Summe aller vier", () => 360, "°"),
    ],
    [
      { id: "senkrecht", text: "Stelle die Geraden so ein, dass alle vier Winkel gleich groß sind.", check: (v) => v.a === 90 },
      { id: "sechzig", text: "Stelle α so ein, dass der Nebenwinkel 60° misst.", check: (v) => v.a === 120 },
      { id: "fuenfunddreissig", text: "Stelle α so ein, dass der Scheitelwinkel 35° misst.", check: (v) => v.a === 35 },
    ],
  ),
  exercises: [
    {
      id: "nebenwinkel-scheitelwinkel",
      make: (rng, level) => {
        const a = rng.int(4, 32) * 5;
        const kind = rng.int(0, 1);
        const answer = kind === 0 ? 180 - a : a;
        const word = kind === 0 ? "Nebenwinkel" : "Scheitelwinkel";
        return task(
          level,
          `Zwei Geraden schneiden sich. Ein Winkel misst ${a}°. Wie groß ist sein ${word}?`,
          `An einer Straßenkreuzung schneiden sich zwei gerade Straßen. Ein Winkel misst ${a}°. Wie groß ist der Winkel ${kind === 0 ? "direkt daneben" : "genau gegenüber"}?`,
          [num("Winkel:", answer, "°", 0, { slips: [{ value: kind === 0 ? a : 180 - a, hint: kind === 0 ? "Das wäre der Scheitelwinkel. Nebenwinkel ergeben zusammen 180°." : "Das wäre der Nebenwinkel. Scheitelwinkel sind gleich groß." }] })],
          "Scheitelwinkel: gleich groß. Nebenwinkel: zusammen 180°.",
          kind === 0 ? `180° − ${a}° = ${180 - a}°.` : "Gegenüberliegende Winkel sind gleich groß.",
          `Der Winkel misst ${answer}°.`,
          { a, kind },
        );
      },
    },
    {
      id: "alle-vier",
      make: (rng, level) => {
        const a = rng.int(4, 16) * 5;
        const sum = 2 * a;
        if (level === 1)
          return task(
            level,
            `Zwei Geraden schneiden sich, α = ${a}°. Wie groß sind β (Nebenwinkel) und γ (Scheitelwinkel)?`,
            "",
            [num("β =", 180 - a, "°", 0), num("γ =", a, "°", 0)],
            "β = 180° − α und γ = α",
            `180° − ${a}° = ${180 - a}°.`,
            `β = ${180 - a}°, γ = ${a}°`,
            { a },
          );
        return task(
          level,
          "",
          `Zwei Geraden schneiden sich. Zwei Scheitelwinkel sind zusammen ${sum}° groß. Wie groß ist jeder der anderen beiden Winkel?`,
          [num("Winkel:", 180 - a, "°", 0, { slips: [{ value: a, hint: "Das ist einer der beiden Scheitelwinkel selbst. Gesucht sind die anderen." }] })],
          "Halbiere zuerst die Summe, dann nutze die Nebenwinkel.",
          `${sum}° : 2 = ${a}°, dann 180° − ${a}° = ${180 - a}°.`,
          `Jeder misst ${180 - a}°.`,
          { a },
        );
      },
    },
  ],
});

const koerper = L(9, {
  id: "ge-9-koerper",
  title: "3.9 Körper erkennen",
  subtitle: "Ecken, Kanten und Begrenzungsflächen",
  whyItMatters:
    "Dosen, Würfel, Dächer und Bälle: Die Welt besteht aus Körpern. Du lernst, sie genau zu beschreiben.",
  explanationHtml: `<p>Körper beschreibst du mit der Anzahl ihrer <strong>Ecken</strong> und <strong>Kanten</strong> sowie mit Form und Lage ihrer <strong>Begrenzungsflächen</strong>.</p><p><strong>Würfel:</strong> 8 Ecken, 12 gleich lange Kanten, 6 Quadrate. <strong>Quader:</strong> 8 Ecken, 12 Kanten, 6 Rechtecke. <strong>Prisma:</strong> zwei gleiche, parallele Vielecke als Grund- und Deckfläche, außen Rechtecke. Das dreiseitige hat 6 Ecken, 9 Kanten, 5 Flächen. <strong>Pyramide:</strong> ein Vieleck als Grundfläche, außen Dreiecke, die sich in der Spitze treffen. Die viereckige hat 5 Ecken, 8 Kanten, 5 Flächen.</p><p><strong>Zylinder:</strong> 2 parallele Kreise, 1 gekrümmte Mantelfläche, 2 Kanten. <strong>Kegel:</strong> 1 Kreis, 1 gekrümmte Fläche, 1 Kante und eine Spitze. <strong>Kugel:</strong> nur 1 gekrümmte Fläche, keine Kante und keine Ecke.</p><div class="example">Eine Milchtüte ist ein Quader, eine Konservendose ein Zylinder, eine Eiswaffel ein Kegel.</div><div class="merke"><strong>Merke:</strong> Zähle Ecken und Kanten. Gekrümmte Flächen gibt es nur bei Zylinder, Kegel und Kugel.</div>`,
  formulas: [
    { name: "Quader und Würfel", html: "8 Ecken, 12 Kanten, 6 Flächen", quantities: "Beim Würfel sind alle Kanten gleich lang." },
    { name: "Dreiseitiges Prisma", html: "6 Ecken, 9 Kanten, 5 Flächen", quantities: "2 Dreiecke und 3 Rechtecke" },
    { name: "Viereckige Pyramide", html: "5 Ecken, 8 Kanten, 5 Flächen", quantities: "1 Viereck und 4 Dreiecke" },
  ],
  quiz: {
    question: "Welcher Körper hat keine Kante?",
    options: ["Kugel", "Zylinder", "Kegel"],
    correctIndex: 0,
    explanation: "Die Kugel hat nur eine gekrümmte Fläche. Zylinder und Kegel haben Kanten am Rand ihrer Kreise.",
  },
  lab: lab(
    "solids",
    "Körper ansehen",
    "Wähle einen Körper und was du hervorheben willst. Gestrichelte Linien sind verdeckt.",
    [c("body", "Körper", SOLIDS.map((s) => s.name)), c("show", "Hervorheben", ["Ecken", "Kanten"])],
    [
      o("ecken", "Ecken", (v) => SOLIDS[v.body].ecken),
      o("kanten", "Kanten", (v) => SOLIDS[v.body].kanten),
      o("flaechen", "Flächen", (v) => SOLIDS[v.body].flaechen),
    ],
    [
      { id: "prisma", text: "Finde den Körper mit 6 Ecken und 9 Kanten.", check: (v) => v.body === 2 },
      { id: "pyramide", text: "Finde den Körper mit 5 Ecken und 8 Kanten.", check: (v) => v.body === 3 },
      { id: "kegel", text: "Finde den Körper mit genau einer Kante und einer Spitze.", check: (v) => v.body === 5 },
    ],
  ),
  exercises: [
    {
      id: "zaehlen",
      make: (rng, level) => {
        const body = rng.pick(SOLIDS.slice(0, 4));
        const pickProp = rng.pick(["Ecken", "Kanten", "Flächen"] as const);
        const value = pickProp === "Ecken" ? body.ecken : pickProp === "Kanten" ? body.kanten : body.flaechen;
        if (level === 1)
          return task(
            level,
            `Wie viele ${pickProp} hat dieser Körper: ${body.name}?`,
            "",
            [num(`${pickProp}:`, value, "", 0)],
            "Stelle dir den Körper vor und zähle systematisch.",
            `${body.name}: ${body.ecken} Ecken, ${body.kanten} Kanten, ${body.flaechen} Flächen.`,
            `${value} ${pickProp}`,
            {},
          );
        const count = rng.int(2, 6);
        return task(
          level,
          "",
          `Du baust ${count} Modelle dieses Körpers aus Trinkhalmen und Knetkugeln: ${body.name}. Jede Kante ist ein Halm, jede Ecke eine Kugel. Wie viele Halme und wie viele Kugeln brauchst du?`,
          [num("Halme:", count * body.kanten, "", 0), num("Kugeln:", count * body.ecken, "", 0)],
          "Kanten und Ecken eines Modells mal Anzahl der Modelle.",
          `${count} · ${body.kanten} Halme und ${count} · ${body.ecken} Kugeln.`,
          `${count * body.kanten} Halme, ${count * body.ecken} Kugeln`,
          { count },
        );
      },
    },
    {
      id: "erkennen",
      make: (rng, level) => {
        const body = rng.pick(SOLIDS);
        const others = rng.shuffle(SOLIDS.filter((s) => s.name !== body.name && (s.ecken !== body.ecken || s.kanten !== body.kanten))).slice(0, 2);
        const objects: Array<[string, string]> = [
          ["eine Konservendose", "Zylinder"],
          ["eine Eiswaffel", "Kegel"],
          ["ein Fußball", "Kugel"],
          ["eine Milchtüte", "Quader"],
          ["ein Spielwürfel", "Würfel"],
          ["ein Zelt mit dreieckigem Eingang", "Prisma (dreiseitig)"],
        ];
        const [thing, shape] = rng.pick(objects);
        const options = [shape, ...rng.shuffle(SOLIDS.map((s) => s.name).filter((n) => n !== shape)).slice(0, 2)];
        return task(
          level,
          `Welcher Körper hat ${body.ecken} ${body.ecken === 1 ? "Ecke" : "Ecken"}, ${body.kanten} ${body.kanten === 1 ? "Kante" : "Kanten"} und ${body.flaechen} ${body.flaechen === 1 ? "Fläche" : "Flächen"}? Seine Begrenzung: ${body.form}.`,
          `Welche Körperform passt am genauesten zu diesem Gegenstand: ${thing}?`,
          [level === 1 ? pick("Körper:", [body.name, ...others.map((s) => s.name)], 0) : pick("Körper:", options, 0)],
          "Schau auf die Form der Flächen.",
          level === 1 ? body.form : `${thing} hat die Form: ${shape}.`,
          level === 1 ? `Das ist: ${body.name}.` : `Es ist: ${shape}.`,
          {},
        );
      },
    },
  ],
});

const netze = L(10, {
  id: "ge-10-netze",
  title: "3.10 Netze von Quader und Würfel",
  subtitle: "Körper aufschneiden und flach legen",
  whyItMatters:
    "Jede Faltschachtel beginnt als flaches Netz. Wer Netze zeichnen kann, baut Körper selbst.",
  explanationHtml: `<p>Schneidest du einen Körper an einigen Kanten auf und legst ihn flach hin, entsteht sein <strong>Netz</strong>. Ein Quader hat 6 Rechtecke, davon sind je zwei gegenüberliegende gleich groß. Ein Würfel hat 6 gleich große Quadrate.</p><p><strong>So zeichnest du das Netz eines Quaders:</strong> Zeichne einen Streifen aus vier Rechtecken, die zusammen um den Körper reichen. Setze oben und unten je ein Rechteck für Deckel und Boden an.</p><p>Ein Quader mit den Kanten a, b und c hat 4 Kanten jeder Länge, zusammen also 4 · (a + b + c).</p><div class="example">Quader mit a = 4 cm, b = 3 cm, c = 2 cm: Der Streifen ist 2 · (4 + 2) = 12 cm breit und 3 cm hoch. Deckel und Boden sind 4 cm mal 2 cm groß. Gesamte Kantenlänge: 4 · 9 cm = 36 cm.</div><div class="merke"><strong>Merke:</strong> Im Netz gibt es jedes Rechteck des Quaders zweimal. Gesamte Kantenlänge = 4 · (a + b + c).</div>`,
  formulas: [
    { name: "Kantenlänge des Quaders", html: "4 · (a + b + c)", quantities: "a, b, c Kanten des Quaders" },
    { name: "Kantenlänge des Würfels", html: "12 · a", quantities: "a Kante des Würfels" },
  ],
  quiz: {
    question: "Aus wie vielen Flächen besteht das Netz eines Quaders?",
    options: ["6", "4", "12"],
    correctIndex: 0,
    explanation: "Ein Quader hat 6 Flächen. 12 ist die Zahl seiner Kanten.",
  },
  lab: lab(
    "box-net",
    "Quadernetz zeichnen",
    "Stelle die Kantenlängen ein. Gleiche Farbe bedeutet gleich große Rechtecke.",
    [r("a", "Länge a", 1, 5, 3, 1, "cm"), r("b", "Höhe b", 1, 5, 2, 1, "cm"), r("c", "Tiefe c", 1, 5, 1, 1, "cm")],
    [
      o("breite", "Breite des Netzes", (v) => 2 * (v.a + v.c), "cm"),
      o("hoehe", "Höhe des Netzes", (v) => v.b + 2 * v.c, "cm"),
      o("kanten", "Gesamte Kantenlänge", (v) => 4 * (v.a + v.b + v.c), "cm"),
    ],
    [
      { id: "wuerfel", text: "Mache daraus das Netz eines Würfels mit 3 cm Kantenlänge.", check: (v) => v.a === 3 && v.b === 3 && v.c === 3 },
      { id: "breit", text: "Stelle einen Quader ein, dessen Netz genau 14 cm breit und 5 cm hoch ist.", check: (v) => 2 * (v.a + v.c) === 14 && v.b + 2 * v.c === 5 },
      { id: "draht", text: "Finde einen Quader mit drei verschiedenen Kantenlängen und 48 cm Kantenlänge insgesamt.", check: (v) => 4 * (v.a + v.b + v.c) === 48 && v.a !== v.b && v.b !== v.c && v.a !== v.c },
    ],
  ),
  exercises: [
    {
      id: "kantenlaenge",
      make: (rng, level) => {
        const a = rng.int(2, 9), b = rng.int(2, 9), d = rng.int(2, 9);
        const cube = level === 1;
        const value = cube ? 12 * a : 4 * (a + b + d);
        return task(
          level,
          `Ein Würfel hat die Kantenlänge ${a} cm. Wie lang sind alle seine Kanten zusammen?`,
          `Für ein Kantenmodell eines Quaders mit den Maßen ${a} cm, ${b} cm und ${d} cm wird Draht gebraucht. Wie viel Draht ist das mindestens?`,
          [num("Länge:", value, "cm", 0, { slips: [{ value: cube ? 6 * a : a + b + d, hint: cube ? "Ein Würfel hat 12 Kanten, nicht 6." : "Jede Kantenlänge kommt viermal vor." }] })],
          cube ? "Gesamtlänge = 12 · Kante" : "Gesamtlänge = 4 · (a + b + c)",
          cube ? `12 · ${a} cm.` : `4 · (${a} + ${b} + ${d}) cm = 4 · ${a + b + d} cm.`,
          `Zusammen ${value} cm`,
          { a, b, d },
        );
      },
    },
    {
      id: "netzmasse",
      make: (rng, level) => {
        const a = rng.int(2, 8), b = rng.int(2, 8), d = rng.int(1, 5);
        const width = 2 * (a + d);
        const height = b + 2 * d;
        return task(
          level,
          `Ein Quader hat die Kanten a = ${a} cm, b = ${b} cm und c = ${d} cm. Wie breit ist der Streifen aus vier Rechtecken in seinem Netz? Rechne 2 · (a + c).`,
          `Du willst eine Schachtel mit den Maßen ${a} cm, ${b} cm (Höhe) und ${d} cm (Tiefe) falten. Wie breit und wie hoch muss das rechteckige Blatt für das Netz mindestens sein?`,
          [num("Breite:", width, "cm", 0), ...(level === 2 ? [num("Höhe:", height, "cm", 0)] : [])],
          "Breite 2 · (a + c), Höhe b + 2 · c",
          `Breite: 2 · (${a} + ${d}) = ${width}.${level === 2 ? ` Höhe: ${b} + 2 · ${d} = ${height}.` : ""}`,
          level === 1 ? `${width} cm` : `${width} cm breit und ${height} cm hoch`,
          { a, b, d },
        );
      },
    },
  ],
});

const schraegbild = L(11, {
  id: "ge-11-schraegbild",
  title: "3.11 Schrägbilder zeichnen",
  subtitle: "Quader und Würfel räumlich auf Papier",
  whyItMatters:
    "Auf dem flachen Papier soll ein Körper räumlich aussehen. Das Schrägbild ist die einfachste Methode dafür.",
  explanationHtml: `<p>Beim <strong>Schrägbild</strong> zeichnest du die Vorderseite in wahrer Größe. Alle Kanten, die nach hinten laufen, zeichnest du unter einem Winkel von <strong>45°</strong> und nur <strong>halb so lang</strong>. Auf Karopapier ist das einfach: die Diagonale eines Kästchens.</p><p><strong>Verdeckte Kanten</strong> zeichnest du gestrichelt. Beim Quader sind es von vorn drei.</p><p><strong>Reihenfolge:</strong> Vorderseite zeichnen, von jeder Ecke die Tiefe schräg antragen, die hinteren Ecken verbinden, verdeckte Kanten stricheln.</p><div class="example">Würfel mit a = 4 cm: Vorderseite 4 cm mal 4 cm. Tiefe gezeichnet 2 cm unter 45°.</div><div class="merke"><strong>Merke:</strong> Nach hinten: 45° und halbe Länge. Verdeckte Kanten: gestrichelt.</div>`,
  formulas: [
    { name: "Tiefe im Schrägbild", html: "gezeichnet = Tiefe : 2", quantities: "Unter 45° zur Vorderkante" },
  ],
  quiz: {
    question: "Ein Quader ist 6 cm tief. Wie lang zeichnest du die Tiefe im Schrägbild?",
    options: ["3 cm", "6 cm", "12 cm"],
    correctIndex: 0,
    explanation: "Kanten nach hinten werden im Schrägbild halb so lang gezeichnet.",
  },
  lab: lab(
    "oblique",
    "Schrägbild eines Quaders",
    "Ziehe die Ecke der Vorderseite und stelle mit dem Regler die Tiefe ein. Beobachte die gestrichelten Kanten.",
    [r("a", "Breite a", 1, 8, 3, 1, "cm"), r("b", "Höhe b", 1, 6, 2, 1, "cm"), r("c", "Tiefe c", 1, 8, 2, 1, "cm")],
    [
      o("tiefe", "Tiefe gezeichnet", (v) => v.c / 2, "cm", 1),
      o("verdeckt", "Verdeckte Kanten", () => 3),
      o("sichtbar", "Sichtbare Kanten", () => 9),
    ],
    [
      { id: "wuerfel", text: "Zeichne einen Würfel mit a = 4 cm.", check: (v) => v.a === 4 && v.b === 4 && v.c === 4 },
      { id: "quader", text: "Zeichne einen Quader, 6 cm breit, 3 cm hoch, 4 cm tief.", check: (v) => v.a === 6 && v.b === 3 && v.c === 4 },
      { id: "halb", text: "Stelle die Tiefe so ein, dass im Bild 1,5 cm gezeichnet werden.", check: (v) => v.c === 3 },
    ],
  ),
  exercises: [
    {
      id: "tiefe",
      make: (rng, level) => {
        const c2 = rng.int(1, 8);
        const c1 = 2 * c2;
        if (level === 1)
          return task(
            level,
            `Ein Quader ist ${c1} cm tief. Wie lang zeichnest du die schräge Kante im Schrägbild?`,
            "",
            [num("Länge:", c2, "cm", 0, { slips: [{ value: c1, hint: "Das ist die wahre Tiefe. Im Bild wird sie halb so lang." }] })],
            "Gezeichnete Tiefe = Tiefe : 2",
            `${c1} cm : 2.`,
            `${c2} cm`,
            { c1 },
          );
        return task(
          level,
          "",
          `Im Schrägbild eines Quaders ist die schräge Kante ${c2} cm lang. Wie tief ist der Quader in Wirklichkeit? Und unter welchem Winkel ist die Kante gezeichnet?`,
          [num("Tiefe:", c1, "cm", 0), num("Winkel:", 45, "°", 0)],
          "Umgekehrt: Du verdoppelst.",
          `${c2} cm · 2 = ${c1} cm.`,
          `${c1} cm tief, 45°`,
          { c2 },
        );
      },
    },
    {
      id: "kanten-im-bild",
      make: (rng, level) => {
        const a = rng.int(2, 9), b = rng.int(2, 9), d = rng.int(1, 8) * 2;
        const items = [["verdeckte Kanten", 3], ["sichtbare Kanten", 9], ["Kanten insgesamt", 12]] as const;
        const [word, count] = rng.pick(items);
        if (level === 1)
          return task(
            level,
            `Wie viele ${word} hat das Schrägbild eines Quaders, wenn du ihn von vorn oben ansiehst?`,
            "",
            [num("Kanten:", count, "", 0)],
            "Ein Quader hat 12 Kanten, 3 davon sind verdeckt.",
            "3 verdeckt + 9 sichtbar = 12.",
            `${count} Kanten`,
            {},
          );
        return task(
          level,
          "",
          `Du zeichnest einen Quader mit Breite ${a} cm, Höhe ${b} cm und Tiefe ${d} cm als Schrägbild. Wie lang wird im Bild jede der vier schrägen Kanten, und wie lang sind diese vier zusammen?`,
          [num("Eine Kante:", d / 2, "cm", 0), num("Alle vier:", 4 * (d / 2), "cm", 0)],
          "Jede schräge Kante ist halb so lang wie die Tiefe.",
          `${d} cm : 2 = ${d / 2} cm, und 4 · ${d / 2} cm = ${4 * (d / 2)} cm.`,
          `${d / 2} cm je Kante, zusammen ${4 * (d / 2)} cm`,
          { a, b, d },
        );
      },
    },
  ],
});

const kopfgeometrie = L(12, {
  id: "ge-12-kopfgeometrie",
  title: "3.12 Kopfgeometrie",
  subtitle: "Netze im Kopf falten und Körper drehen",
  whyItMatters:
    "Vorstellungskraft kannst du trainieren. Wer Körper im Kopf falten und drehen kann, löst Aufgaben schneller und braucht weniger Skizzen.",
  explanationHtml: `<p>Bei der <strong>Kopfgeometrie</strong> löst du Aufgaben in der Vorstellung, ohne zu zeichnen. Eine typische Frage: Ergibt ein Muster aus sechs Quadraten einen Würfel? Welche Fläche liegt welcher gegenüber?</p><p>Das hilft dir beim Falten im Kopf:</p><p><strong>In einer geraden Reihe</strong> liegen sich Quadrate gegenüber, zwischen denen genau ein Quadrat liegt. <strong>Vier Quadrate im Block</strong> (2 mal 2) gehen nie: Sie liegen nicht um eine Ecke. Eine <strong>Reihe aus fünf oder mehr</strong> Quadraten geht auch nicht, denn sie würde sich überlappen.</p><p>Auf einem Spielwürfel ergeben gegenüberliegende Augenzahlen zusammen immer 7.</p><div class="example">Im Kreuz stehen 2, 3, 4, 5 in einer Reihe, 1 darüber und 6 darunter (beide bei der 3). Gegenüber liegen 2 und 4, 3 und 5, 1 und 6.</div><div class="merke"><strong>Merke:</strong> Zwischen zwei Gegenüberliegenden in einer Reihe ist genau ein Quadrat. Kein Viererblock, keine Fünferreihe.</div>`,
  formulas: [
    { name: "Würfelnetz", html: "6 Quadrate, kein 2-mal-2-Block, keine Reihe aus 5 oder mehr", quantities: "Das schließt viele Muster aus. Es gibt genau 11 verschiedene Würfelnetze." },
    { name: "Spielwürfel", html: "Augen gegenüber: 1 + 6 = 2 + 5 = 3 + 4 = 7", quantities: "Immer 7" },
  ],
  quiz: {
    question: "Ein Spielwürfel zeigt oben eine 2. Wie viele Augen sind unten?",
    options: ["5", "4", "6"],
    correctIndex: 0,
    explanation: "Gegenüberliegende Seiten ergeben zusammen 7, und 7 − 2 = 5.",
  },
  lab: lab(
    "cube-net",
    "Netz im Kopf falten",
    "Wähle ein Muster und eine Fläche. Überlege zuerst, welche Fläche gegenüberliegt, dann schaue nach.",
    [c("pattern", "Muster", NET_PATTERNS.map((p) => p.name)), r("face", "Fläche", 1, 6, 3)],
    [
      o("netz", "Würfelnetz?", (v) => (oppositeFace(NET_PATTERNS[v.pattern], v.face) === null ? "nein" : "ja")),
      o("gegenueber", "Gegenüber", (v) => oppositeFace(NET_PATTERNS[v.pattern], v.face) ?? "kein Würfel"),
    ],
    [
      { id: "kreuz", text: "Zeige im Kreuz, welche Fläche der 1 gegenüberliegt.", check: (v) => v.pattern === 0 && v.face === 1 },
      { id: "kein-netz", text: "Finde das Muster aus zwei Dreierreihen. Es ergibt keinen Würfel.", check: (v) => v.pattern === 3 },
      { id: "treppe", text: "Zeige in der Treppe die Fläche, die der 5 gegenüberliegt, indem du die 2 wählst.", check: (v) => v.pattern === 1 && v.face === 2 },
    ],
  ),
  exercises: [
    {
      id: "spielwuerfel",
      make: (rng, level) => {
        const top = rng.int(1, 6);
        const tosses = rng.int(2, 5);
        if (level === 1)
          return task(
            level,
            `Ein Spielwürfel zeigt oben ${top} Augen. Wie viele Augen sind unten?`,
            "",
            [num("Augen:", 7 - top, "", 0)],
            "Gegenüberliegende Seiten ergeben 7.",
            `7 − ${top} = ${7 - top}.`,
            `Unten sind ${7 - top} Augen.`,
            { top },
          );
        const hidden = 21 - top;
        return task(
          level,
          "",
          `Du kippst einen Spielwürfel ${tosses}-mal und er zeigt am Ende oben ${top} Augen. Wie viele Augen zeigen dann alle anderen fünf Seiten zusammen? Alle Seiten zusammen haben 21 Augen.`,
          [num("Augen:", hidden, "", 0)],
          "1 + 2 + 3 + 4 + 5 + 6 = 21",
          `21 − ${top} = ${hidden}. Das Kippen ändert daran nichts.`,
          `${hidden} Augen`,
          { top, tosses },
        );
      },
    },
    {
      id: "netz-oder-nicht",
      make: (rng, level) => {
        const index = rng.int(0, NET_PATTERNS.length - 1);
        const pattern = NET_PATTERNS[index];
        const isNet = oppositeFace(pattern, 1) !== null;
        if (level === 1)
          return task(
            level,
            `Stelle dir das Muster „${pattern.name}“ aus sechs Quadraten vor. Du findest es im Labor dieser Lektion. Ergibt es einen Würfel?`,
            "",
            [pick("Antwort:", ["ja", "nein"], isNet ? 0 : 1)],
            "Kein 2-mal-2-Block und keine Reihe aus 5 oder mehr.",
            isNet ? "Es gibt weder einen Viererblock noch eine zu lange Reihe." : "Es gibt einen Viererblock oder eine zu lange Reihe.",
            isNet ? "Ja, das Muster ergibt einen Würfel." : "Nein, es ergibt keinen Würfel.",
            { index },
          );
        const face = rng.int(1, 6);
        const cross = NET_PATTERNS[0];
        const other = oppositeFace(cross, face)!;
        return task(
          level,
          "",
          `Im Kreuz stehen die Flächen 2, 3, 4 und 5 in einer Reihe, die 1 über der 3 und die 6 unter der 3. Du faltest den Würfel im Kopf. Welche Fläche liegt der ${face} gegenüber?`,
          [num("Fläche:", other, "", 0)],
          "In der Reihe liegt zwischen Gegenüberliegenden genau eine Fläche.",
          `Die Paare sind 1 und 6, 2 und 4, 3 und 5.`,
          `Gegenüber liegt die ${other}.`,
          { face },
        );
      },
    },
  ],
});

export const STAGE_GEOMETRIE = makeStage(
  3,
  "Linien, Kreise, Vielecke, Koordinaten, Winkel und Körper",
  "#059669",
  "📐",
  [
    grundbegriffe,
    lagebeziehungen,
    kreis,
    dreiecke,
    vierecke,
    koordinaten,
    winkel,
    winkelpaare,
    koerper,
    netze,
    schraegbild,
    kopfgeometrie,
  ],
);
