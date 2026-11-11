import { fmt } from "../exercises/format";
import {
  choice as c,
  lab,
  makeLesson,
  output as o,
  range as r,
  task,
} from "./builders";
import { numberField as num, choiceField as pick } from "./helpers";

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
    {
      name: "Schreibweisen",
      html: "Strecke [AB], Halbgerade [AB, Gerade AB",
      quantities: "Die eckige Klammer steht an einem festen Endpunkt.",
    },
    {
      name: "Länge",
      html: "|AB| = 5 cm",
      quantities: "Nur eine Strecke hat eine Länge.",
    },
  ],
  quiz: {
    question: "Welche Linie hat genau einen Anfangspunkt und kein Ende?",
    options: ["Halbgerade", "Strecke", "Gerade"],
    correctIndex: 0,
    explanation:
      "Die Halbgerade startet in einem Punkt und läuft ohne Ende weiter. Die Strecke hat zwei Endpunkte, die Gerade keinen.",
  },
  lab: lab(
    "line-kinds",
    "Linien auf Karopapier",
    "Wähle die Art der Linie und ziehe A und B. Ein Kästchen auf dem Bild steht hier für 1 cm.",
    [
      c("kind", "Art", ["Strecke", "Halbgerade", "Gerade"]),
      r("ax", "A nach rechts", 0, 8, 1),
      r("ay", "A nach oben", 0, 6, 1),
      r("bx", "B nach rechts", 0, 8, 4),
      r("by", "B nach oben", 0, 6, 2),
    ],
    [
      o("name", "Schreibweise", (v) => ["[AB]", "[AB", "AB"][v.kind]),
      o("laenge", "Länge", (v) => {
        if (v.ax === v.bx && v.ay === v.by) return "A und B fallen zusammen";
        return v.kind === 0
          ? `${fmt(Math.hypot(v.ax - v.bx, v.ay - v.by), 1)} cm`
          : "keine Länge, sie endet nicht";
      }),
    ],
    [
      {
        id: "fuenf",
        text: "Zeichne eine Strecke mit der Länge 5 cm.",
        check: (v) =>
          v.kind === 0 && Math.hypot(v.ax - v.bx, v.ay - v.by) === 5,
      },
      {
        id: "strahl",
        text: "Zeichne eine Halbgerade, die waagrecht nach rechts läuft.",
        check: (v) => v.kind === 1 && v.ay === v.by && v.bx > v.ax,
      },
      {
        id: "senkrecht",
        text: "Zeichne eine Gerade, die genau von oben nach unten läuft.",
        check: (v) => v.kind === 2 && v.ax === v.bx && v.ay !== v.by,
      },
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
        const notation = rng.pick([
          ["[PQ]", 0],
          ["[PQ", 1],
          ["PQ", 2],
        ] as const);
        const names = ["Strecke", "Halbgerade", "Gerade"];
        return task(
          level,
          `Welche Linie ${text}?`,
          `In einer Zeichnung steht ${notation[0]}. Welche Linie ist gemeint, und wie viele Endpunkte hat sie?`,
          level === 1
            ? [pick("Linie:", names, index)]
            : [
                pick("Linie:", names, notation[1]),
                num("Endpunkte:", 2 - notation[1], "", 0),
              ],
          "Zähle die festen Endpunkte: Strecke 2, Halbgerade 1, Gerade 0.",
          "Eine eckige Klammer markiert einen festen Endpunkt.",
          level === 1
            ? `Das ist eine ${names[index]}.`
            : `${notation[0]} ist eine ${names[notation[1]]}.`,
          {},
        );
      },
    },
    {
      id: "strecken-auf-gerade",
      make: (rng, level) => {
        const a = rng.int(2, 9),
          b = rng.int(2, 9);
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
    {
      name: "Parallel",
      html: "g ∥ h",
      quantities: "Überall gleicher Abstand, kein Schnittpunkt",
    },
    {
      name: "Senkrecht",
      html: "g ⊥ h",
      quantities: "Schnitt im rechten Winkel (90°)",
    },
    {
      name: "Punkt und Gerade",
      html: "P ∈ g, Q ∉ g",
      quantities: "P liegt auf g, Q liegt nicht auf g.",
    },
  ],
  quiz: {
    question: "Wie misst du den Abstand eines Punktes von einer Geraden?",
    options: [
      "Entlang der kürzesten Verbindung, also senkrecht zur Geraden.",
      "Von dem Punkt schräg zu irgendeinem Punkt der Geraden.",
      "Parallel zur Geraden.",
    ],
    correctIndex: 0,
    explanation:
      "Jede schräge Verbindung ist länger. Der Abstand ist die kürzeste, und die steht senkrecht.",
  },
  lab: lab(
    "line-relations",
    "Gerade drehen",
    "Drehe die Gerade h am orangen Griff und ziehe den Punkt P. Oben steht die Lagebeziehung.",
    [
      r("angle", "Winkel von h", 0, 175, 30, 5, "°"),
      r("d", "Abstand bei parallel", 1, 5, 2, 1, "cm"),
      r("p", "P über g", -4, 4, 2, 1, "cm"),
    ],
    [
      o("lage", "g und h", (v) =>
        v.angle === 0
          ? "parallel"
          : v.angle === 90
            ? "senkrecht"
            : "schneiden sich",
      ),
      o("abstand", "Abstand von P zu g", (v) => Math.abs(v.p), "cm"),
      o("auf", "P liegt auf g?", (v) => (v.p === 0 ? "ja" : "nein")),
    ],
    [
      {
        id: "parallel",
        text: "Mache g und h parallel mit 3 cm Abstand.",
        check: (v) => v.angle === 0 && v.d === 3,
      },
      {
        id: "senkrecht",
        text: "Stelle h senkrecht zu g.",
        check: (v) => v.angle === 90,
      },
      {
        id: "auf",
        text: "Lege den Punkt P auf die Gerade g.",
        check: (v) => v.p === 0,
      },
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
        const names = [
          "parallel",
          "senkrecht",
          "schneidend, aber nicht senkrecht",
        ];
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
        const a = rng.int(2, 6),
          b = rng.int(2, 6);
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
          between
            ? `${a} cm + ${bb} cm.`
            : `Größerer minus kleinerer Abstand: ${Math.max(a, bb)} cm − ${Math.min(a, bb)} cm.`,
          `Der Abstand ist ${answer} cm.`,
          { a, bb },
        );
      },
    },
  ],
});

export const LESSONS = [grundbegriffe, lagebeziehungen];
