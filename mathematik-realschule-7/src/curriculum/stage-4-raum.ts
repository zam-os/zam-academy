import { fmt } from "../exercises/format";
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
  lesson(4, step, [4, null], content);

const lagen = L(1, {
  id: "rg-1-lagebeziehungen",
  title: "4.1 Geraden und Ebenen im Raum",
  subtitle: "Schnitt, Parallelität und Winkel unterscheiden",
  whyItMatters:
    "In einer flachen Zeichnung scheinen sich auch Kanten zu schneiden, die im Raum gar keinen gemeinsamen Punkt haben. Beschriftete Körper helfen bei der Entscheidung.",
  explanationHtml: `<p>Geraden im Raum können identisch, parallel, sich schneidend oder <strong>windschief</strong> sein. Windschiefe Geraden haben keinen Schnittpunkt und sind nicht parallel. Eine Gerade liegt in einer Ebene, ist zu ihr echt parallel oder schneidet sie in genau einem Punkt. Zwei verschiedene Ebenen sind parallel oder schneiden sich in einer Geraden.</p><p>Der <strong>Winkel zwischen Gerade und Ebene</strong> ist der kleinere Winkel zwischen der Geraden und ihrer senkrechten Projektion auf die Ebene. Eine zur Ebene senkrechte Gerade bildet 90°. Bei zwei sich schneidenden Ebenen zeichnest du in beiden Ebenen am gleichen Punkt Senkrechte zur Schnittgeraden. Der kleinere Winkel dieser beiden Geraden ist der Ebenenwinkel.</p><div class="example">Am Quader ABCD–EFGH liegt E über A, F über B, G über C, H über D. AB und GH sind parallel. AB und CG sind windschief. AE schneidet die Grundebene ABCD senkrecht in A. Die Ebenen ABCD und ABFE schneiden sich in AB im Winkel 90°.</div><div class="merke"><strong>Merke:</strong> Entscheide im räumlichen Modell, nicht nach einem scheinbaren Schnitt im Schrägbild. Einen Ebenenwinkel misst du in einem Schnitt senkrecht zur Schnittgeraden.</div>`,
  formulas: [
    {
      name: "Geraden im Raum",
      html: "identisch · parallel · schneidend · windschief",
      quantities: "gemeinsame Punkte und Richtung prüfen",
    },
    {
      name: "Räumliche Winkel",
      html: "Gerade–Ebene: Projektionswinkel; Ebene–Ebene: Normalschnitt",
      quantities: "jeweils der kleinere Winkel, 0° bis 90°",
    },
  ],
  quiz: {
    question: "AB und CG am Quader ABCD–EFGH sind …",
    options: ["windschief", "parallel", "sich schneidend"],
    correctIndex: 0,
    explanation:
      "Sie sind weder parallel noch haben sie einen gemeinsamen Punkt, auch wenn das Bild einen Schnitt vortäuschen könnte.",
  },
  lab: lab(
    "space-relations",
    "Quader untersuchen",
    "Drehe das Schrägbild mit dem Regler. Wähle hervorgehobene Geraden oder Ebenen. Die räumliche Lage ändert sich durch eine andere Ansicht nicht.",
    [
      c(
        "case",
        "Untersuchung",
        [
          "AB und GH",
          "AB und CG",
          "AE und Grundebene",
          "Grundebene und Vorderfläche",
        ],
        0,
      ),
      r("angle", "Ansichtswinkel", 20, 70, 40, 5, "°"),
    ],
    [
      o(
        "relation",
        "Lage",
        (v) =>
          [
            "parallel",
            "windschief",
            "senkrecht, Schnitt in A",
            "Schnittgerade AB, Winkel 90°",
          ][v.case],
      ),
    ],
    [
      {
        id: "windschief",
        text: "Wähle AB und CG und betrachte die Ansicht bei 60°.",
        check: (v) => v.case === 1 && v.angle === 60,
      },
      {
        id: "senkrecht",
        text: "Zeige AE mit der Grundebene in der Ansicht bei 30°.",
        check: (v) => v.case === 2 && v.angle === 30,
      },
      {
        id: "ebenen",
        text: "Zeige den rechten Winkel von Grundebene und Vorderfläche bei 45°.",
        check: (v) => v.case === 3 && v.angle === 45,
      },
    ],
  ),
  exercises: [
    {
      id: "geraden-ebenen",
      make: (rng, level) => {
        const mode = rng.int(0, 3),
          pairs = ["AB und GH", "AB und CG", "AB und AE", "AE und BF"],
          answers = [0, 2, 1, 0];
        return task(
          level,
          `Quader ABCD–EFGH: E liegt über A usw. Bestimme die Lage von ${pairs[mode]}.`,
          `Bei einem Quader ABCD–EFGH (E über A usw.) wird das Bild schräger gezeichnet. Bestimme die Lage von ${pairs[mode]} und entscheide, ob die neue Ansicht sie verändern kann.`,
          [
            pick(
              "Geraden sind …",
              ["parallel", "sich schneidend", "windschief"],
              answers[mode],
            ),
            ...(level === 2
              ? [
                  pick(
                    "Andere Ansicht verändert die Lage?",
                    ["nein", "ja, immer", "nur bei verdeckten Kanten"],
                    0,
                  ),
                ]
              : []),
          ],
          "Prüfe gemeinsame Punkte und Richtung im Quader.",
          "AB und GH sowie AE und BF haben gleiche Richtung; AB und AE treffen sich in A; AB und CG sind weder parallel noch haben sie einen Schnittpunkt.",
          `${pairs[mode]}: ${["parallel", "sich schneidend", "windschief"][answers[mode]]}.`,
          { mode },
        );
      },
    },
    {
      id: "winkel-definition",
      make: (rng, level) => {
        const mode = rng.int(0, 1);
        return task(
          level,
          mode === 0
            ? "Wie groß ist der Winkel zwischen der Quaderkante AE und der Grundebene ABCD? Begründe mit der Lage der Kante."
            : "Wie groß ist der Winkel zwischen Grundebene ABCD und Vorderfläche ABFE eines Quaders? Nenne auch ihre Schnittgerade.",
          mode === 0
            ? "Eine schräge Gerade trifft eine Ebene. Welche Hilfslinie brauchst du zum Bestimmen des Winkels zwischen Gerade und Ebene? Wie groß wäre er bei einer Senkrechten?"
            : "Zwei Ebenen schneiden sich in g. Welche Geraden zeichnest du in beiden Ebenen, um den Ebenenwinkel zu konstruieren? Wie groß ist er bei benachbarten Quaderflächen?",
          [
            num("Winkel am Quader =", 90, "°", 0),
            pick(
              level === 1 ? "Begründung / Schnittgerade" : "Konstruktionsidee",
              level === 1
                ? mode === 0
                  ? [
                      "AE steht senkrecht auf der Grundebene",
                      "AE liegt in der Grundebene",
                      "scheinbarer Winkel im Bild",
                    ]
                  : ["Schnittgerade AB", "Schnittpunkt E", "Schnittgerade CG"]
                : mode === 0
                  ? [
                      "senkrechte Projektion der Geraden auf die Ebene",
                      "beliebige Linie in der Ebene",
                      "eine Parallele zur Geraden",
                    ]
                  : [
                      "in beiden Ebenen Senkrechte zu g im selben Punkt",
                      "zwei beliebige Kanten",
                      "zwei Parallele zu g",
                    ],
              0,
            ),
          ],
          "Am Quader stehen benachbarte Flächen und die Höhenkanten zur Grundfläche senkrecht.",
          mode === 0
            ? "Der Winkel zur Ebene wird über die senkrechte Projektion bestimmt; im Sonderfall der senkrechten Kante beträgt er 90°."
            : "Die Ebenen schneiden sich in AB. Senkrechte zu AB in beiden Ebenen bilden hier einen rechten Winkel.",
          "Am Quader: 90°. Die Konstruktion benötigt einen passenden senkrechten Hilfsschnitt.",
          { mode },
        );
      },
    },
  ],
});

const schraeg = L(2, {
  id: "rg-2-schraegbilder",
  title: "4.2 Schrägbilder zeichnen",
  subtitle: "Prisma und Pyramide mit Winkel und Faktor",
  whyItMatters:
    "Ein Schrägbild zeigt einen Körper auf einem Blatt. Damit die Zeichnung eindeutig ist, legst du fest, welche Richtung verkürzt wird.",
  explanationHtml: `<p>Beim Schrägbild liegt eine <strong>Frontfläche parallel zur Zeichenebene</strong>; ihre Strecken und Winkel erscheinen in wahrer Größe. Zur Tiefe laufende, zur Front senkrechte Strecken zeichnest du parallel, im Verzerrungswinkel ω und mit dem Verkürzungsfaktor q. Nur für diese gewählte Tiefenrichtung gilt Bildlänge = q · wahre Länge.</p><p>Für ein gerades Prisma zeichnest du zunächst die Front, dann die parallelen Tiefenstrecken und verbindest die zugehörigen Eckpunkte. Beim geraden Pyramidenmodell zeichnest du die Grundfläche als Parallelogramm, bestimmst ihren Diagonalenschnitt M und trägst die zur Front parallele Körperhöhe über M senkrecht in wahrer Länge ab. Verbinde die Spitze mit den Grundflächenecken; verdeckte Kanten werden gestrichelt.</p><div class="example">Ein Quader mit Breite 6 cm, Höhe 4 cm und Tiefe 5 cm wird mit ω = 45° und q = 0,5 dargestellt. Die Front ist 6 cm × 4 cm. Die Tiefenpfeile sind 2,5 cm lang und liegen bei 45°. Der scheinbare Winkel im Bild ist kein räumlicher Flächenwinkel.</div><div class="merke"><strong>Merke:</strong> Gib Front, ω und q an. Verkürze nicht jede Kante, sondern nur die zur gewählten Tiefenachse parallelen Strecken.</div>`,
  formulas: [
    {
      name: "Tiefenrichtung",
      html: "s<sub>Bild</sub> = q · s<sub>wahr</sub>",
      quantities: "q Verkürzungsfaktor; nur gewählte Tiefenrichtung",
    },
  ],
  quiz: {
    question: "Welche Strecken werden mit q verkürzt?",
    options: [
      "Strecken parallel zur gewählten Tiefenachse.",
      "Alle Kanten des Körpers.",
      "Nur die senkrechten Höhenkanten.",
    ],
    correctIndex: 0,
    explanation:
      "Strecken parallel zur Zeichenebene bleiben in wahrer Länge; die Regel q gilt für die Tiefenachse.",
  },
  lab: lab(
    "oblique",
    "Prisma und Pyramide",
    "Wähle den Körper und ziehe den Endpunkt der Tiefenachse. Winkel und Verkürzung ändern das Bild, nicht den Körper.",
    [
      c("shape", "Körper", ["Quader / Prisma", "Gerade Pyramide"], 0),
      r("width", "Breite", 3, 7, 5),
      r("depth", "Tiefe", 2, 6, 4),
      r("height", "Höhe", 2, 5, 3),
      r("q", "Verkürzungsfaktor", 0.25, 0.75, 0.5, 0.25),
      r("angle", "Verzerrungswinkel", 30, 60, 45, 15, "°"),
    ],
    [
      o("image", "Gezeichnete Tiefenlänge", (v) => v.q * v.depth, "cm"),
      o("front", "Frontbreite", (v) => v.width, "cm"),
    ],
    [
      {
        id: "quader",
        text: "Zeichne einen Quader 6 × 4 × 4 cm mit q = 0,5 und ω = 45°.",
        check: (v) =>
          v.shape === 0 &&
          v.width === 6 &&
          v.depth === 4 &&
          v.height === 4 &&
          v.q === 0.5 &&
          v.angle === 45,
      },
      {
        id: "pyramide",
        text: "Zeichne eine Pyramide: Breite 4, Tiefe 4, Höhe 3, q = 0,5, ω = 30°.",
        check: (v) =>
          v.shape === 1 &&
          v.width === 4 &&
          v.depth === 4 &&
          v.height === 3 &&
          v.q === 0.5 &&
          v.angle === 30,
      },
      {
        id: "verkürzt",
        text: "Zeichne ein Prisma mit Tiefe 6 und q = 0,25; Breite 5, Höhe 3, ω = 60°.",
        check: (v) =>
          v.shape === 0 &&
          v.width === 5 &&
          v.depth === 6 &&
          v.height === 3 &&
          v.q === 0.25 &&
          v.angle === 60,
      },
    ],
  ),
  exercises: [
    {
      id: "tiefenkante",
      make: (rng, level) => {
        const d = rng.int(3, 8),
          q = rng.pick([0.25, 0.5, 0.75]);
        return task(
          level,
          `Eine Tiefenkante ist ${d} cm lang. Mit q = ${fmt(q)}: Wie lang zeichnest du sie?`,
          `Eine gerade Pyramide hat eine quadratische Grundfläche mit Seitenlänge ${d} cm und Höhe 5 cm. Ihre Tiefenrichtung wird mit q = ${fmt(q)} verkürzt; die Höhenrichtung liegt parallel zur Zeichenebene. Bestimme gezeichnete Tiefe und gezeichnete Höhe.`,
          [
            num("Tiefe im Bild =", d * q, "cm", 2),
            ...(level === 2 ? [num("Höhe im Bild =", 5, "cm", 0)] : []),
          ],
          "Multipliziere nur die Tiefenlänge mit q.",
          `${d} · ${fmt(q)} = ${fmt(d * q)}. Die Höhenstrecke liegt parallel zur Zeichenebene und bleibt unverändert.`,
          `Bildtiefe ${fmt(d * q)} cm; Höhe 5 cm.`,
          { d, q },
        );
      },
    },
    {
      id: "einstellungen",
      make: (rng, level) => {
        const d = rng.int(4, 8),
          q = rng.pick([0.25, 0.5]);
        return task(
          level,
          `Eine wahre Tiefenlänge ${d} cm erscheint im Schrägbild mit ${fmt(d * q)} cm. Bestimme q.`,
          `Ein Schrägbild zeigt eine Tiefenkante mit ${fmt(d * q)} cm bei q = ${fmt(q)}. Bestimme ihre wahre Länge und beurteile, ob ein im Bild gemessener Flächenwinkel automatisch wahr ist.`,
          [
            num(
              level === 1 ? "q =" : "wahre Tiefe =",
              level === 1 ? q : d,
              level === 1 ? "" : "cm",
              2,
            ),
            ...(level === 2
              ? [
                  pick(
                    "Bildwinkel ist immer wahr?",
                    ["nein", "ja", "nur bei q = 0,5"],
                    0,
                  ),
                ]
              : []),
          ],
          "q = Bildlänge : wahre Länge.",
          `Bildlänge = q · wahre Länge. Umstellen durch Division; räumliche Winkel können durch die Projektion verzerrt sein.`,
          level === 1
            ? `q = ${fmt(q)}.`
            : `Tiefe ${d} cm; Bildwinkel nicht ungeprüft übernehmen.`,
          { d, q },
        );
      },
    },
  ],
});

const wahr = L(3, {
  id: "rg-3-wahre-groessen",
  title: "4.3 Wahre Längen und Winkel konstruieren",
  subtitle: "Hilfsdreiecke aus dem Schrägbild herausklappen",
  whyItMatters:
    "Schräg gezeichnete Diagonalen darfst du nicht einfach mit dem Lineal als wahre Länge übernehmen. Du brauchst eine unverzerrte Hilfsfigur.",
  explanationHtml: `<p>Rekonstruiere zunächst die wahren Maße: Frontstrecken werden übernommen; Tiefenstrecken erhältst du aus Bildlänge : q. Für eine Grundflächendiagonale eines Quaders zeichnest du dann das Rechteck aus wahrer Breite und wahrer Tiefe in der Zeichenebene. Seine Diagonale kannst du in wahrer Länge messen.</p><p>Für eine Raumdiagonale zeichnest du ein zweites Hilfsdreieck: eine Kathete ist die konstruierte Grundflächendiagonale, die andere die Körperhöhe. Die Verbindung ist die wahre Raumdiagonale. Ihr Winkel zur Grundebene liegt zwischen Raumdiagonale und Grundflächendiagonale. Bei einer geraden Pyramide liefert der Schnitt durch Spitze, Grundflächenmitte und Kantenmitte einen senkrechten Hilfsschnitt: Körperhöhe und halbe Grundflächentiefe bestimmen darin Seitenhöhe und Flächenwinkel.</p><div class="example">Im Schrägbild sind Breite 4 cm und Bildtiefe 1,5 cm bei q = 0,5 gegeben. Die wahre Tiefe ist 3 cm. Konstruiere ein Rechteck 4 cm × 3 cm; seine Diagonale misst 5 cm. Mit einer Körperhöhe von 2 cm konstruierst du daran das Hilfsdreieck der Raumdiagonale. Miss Länge und Winkel in diesem Hilfsdreieck, nicht im Schrägbild.</div><div class="merke"><strong>Merke:</strong> Wahre Maße → unverzerrte Hilfsfigur → Länge oder Winkel messen. Hier brauchst du noch keinen Satz des Pythagoras und keine Winkelfunktionen.</div>`,
  formulas: [
    {
      name: "Wahre Tiefe",
      html: "s<sub>wahr</sub> = s<sub>Bild</sub> : q",
      quantities: "Strecke parallel zur Tiefenachse",
    },
    {
      name: "Hilfsdreieck",
      html: "Grundflächendiagonale ⟂ Körperhöhe",
      quantities:
        "rechtwinkliger Schnitt für Raumdiagonale und ihren Neigungswinkel",
    },
  ],
  quiz: {
    question:
      "Wo misst du den wahren Neigungswinkel einer Raumdiagonale zur Grundebene?",
    options: [
      "Im unverzerrten Hilfsdreieck mit ihrer Projektion auf die Grundebene.",
      "Direkt im beliebigen Schrägbild.",
      "Immer zwischen zwei Grundkanten.",
    ],
    correctIndex: 0,
    explanation:
      "Die senkrechte Projektion ist hier die Grundflächendiagonale. Beide gehören in einen unverzerrten Schnitt.",
  },
  lab: lab(
    "true-size",
    "Vom Bild zur Hilfsfigur",
    "Wähle den Hilfsschnitt. Die Grundmaße bleiben wahr; die schräge Ansicht ist zum Vergleichen daneben dargestellt. Konstruiere und miss die Hilfsfigur anschließend auf Papier.",
    [
      r("width", "Wahre Breite", 2, 6, 4),
      r("depth", "Wahre Tiefe", 2, 6, 3),
      r("height", "Körperhöhe", 1, 5, 2),
      r("q", "Verkürzungsfaktor", 0.25, 0.75, 0.5, 0.25),
      c(
        "section",
        "Hilfsfigur",
        ["Grundfläche", "Raumdiagonale", "Pyramiden-Seitenhöhe"],
        0,
      ),
    ],
    [
      o("image", "Bildtiefe", (v) => v.depth * v.q, "cm"),
      o("true", "Wahre Tiefe", (v) => v.depth, "cm"),
      o(
        "method",
        "Konstruktion",
        (v) =>
          [
            "Rechteck aus Breite und Tiefe",
            "rechtwinkliges Dreieck: Grunddiagonale und Höhe",
            "rechtwinkliges Dreieck: halbe Tiefe und Höhe",
          ][v.section],
      ),
      o(
        "measuredLength",
        "Kontrollmessung Hilfsstrecke",
        (v) => {
          const base =
            v.section === 0
              ? v.width
              : v.section === 1
                ? Math.hypot(v.width, v.depth)
                : v.depth / 2;
          return Math.hypot(base, v.section === 0 ? v.depth : v.height);
        },
        "cm",
        1,
      ),
      o(
        "measuredAngle",
        "Kontrollmessung Winkel",
        (v) => {
          const base =
            v.section === 0
              ? v.width
              : v.section === 1
                ? Math.hypot(v.width, v.depth)
                : v.depth / 2;
          return (
            (Math.atan2(v.section === 0 ? v.depth : v.height, base) * 180) /
            Math.PI
          );
        },
        "°",
        1,
      ),
    ],
    [
      {
        id: "grund",
        text: "Zeige die Grundfläche 3 × 4 cm bei Höhe 2 und q = 0,25.",
        check: (v) =>
          v.section === 0 &&
          v.width === 3 &&
          v.depth === 4 &&
          v.height === 2 &&
          v.q === 0.25,
      },
      {
        id: "raum",
        text: "Zeige den Raumdiagonalenschnitt bei 4 × 3 × 2 cm und q = 0,5.",
        check: (v) =>
          v.section === 1 &&
          v.width === 4 &&
          v.depth === 3 &&
          v.height === 2 &&
          v.q === 0.5,
      },
      {
        id: "pyramide",
        text: "Zeige den Pyramidenschnitt bei Breite 4, Tiefe 6, Höhe 4, q = 0,5.",
        check: (v) =>
          v.section === 2 &&
          v.width === 4 &&
          v.depth === 6 &&
          v.height === 4 &&
          v.q === 0.5,
      },
    ],
  ),
  exercises: [
    {
      id: "hilfsfigur",
      make: (rng, level) => {
        const w = rng.int(3, 7),
          d = rng.int(2, 6),
          q = rng.pick([0.25, 0.5]);
        return task(
          level,
          `Im Schrägbild ist die Frontbreite ${w} cm, die Bildtiefe ${fmt(d * q)} cm und q = ${fmt(q)}. Welche wahren Seitenlängen hat das Hilfsrechteck der Grundfläche?`,
          `Ein Quader ist vorne ${w} cm breit und 3 cm hoch. Die Bildtiefe beträgt ${fmt(d * q)} cm bei q = ${fmt(q)}. Berechne die wahre Tiefe und wähle das Hilfsdreieck für die Raumdiagonale.`,
          [
            num("wahre Tiefe =", d, "cm", 2),
            ...(level === 1
              ? [num("wahre Breite =", w, "cm", 0)]
              : [
                  pick(
                    "Katheten des Hilfsdreiecks",
                    [
                      "Grundflächendiagonale und Körperhöhe",
                      "Bildtiefe und Körperhöhe",
                      "Breite und Bildtiefe",
                    ],
                    0,
                  ),
                ]),
          ],
          "Tiefe durch q teilen; Frontbreite bleibt wahr.",
          `${fmt(d * q)} : ${fmt(q)} = ${d}. Zuerst das wahre Grundrechteck zeichnen und dessen Diagonale konstruieren.`,
          level === 1
            ? `Hilfsrechteck: ${w} cm × ${d} cm.`
            : `Tiefe ${d} cm; Grunddiagonale und Höhe bilden die Katheten.`,
          { w, d, q },
        );
      },
    },
    {
      id: "pyramiden-schnitt",
      make: (rng, level) => {
        const side = rng.int(2, 5) * 2,
          h = rng.int(3, 6);
        return task(
          level,
          `Eine gerade quadratische Pyramide hat Grundkante ${side} cm und Höhe ${h} cm. Welche waagrechte Kathete hat der senkrechte Schnitt zur Kantenmitte?`,
          `Du sollst den Winkel zwischen einer Seitenfläche und der Grundfläche einer geraden quadratischen Pyramide bestimmen (Grundkante ${side} cm, Höhe ${h} cm). Gib die beiden Katheten des wahren Hilfsdreiecks an und wähle den Messwinkel.`,
          [
            num("waagrechte Kathete =", side / 2, "cm", 0),
            ...(level === 2
              ? [
                  num("senkrechte Kathete =", h, "cm", 0),
                  pick(
                    "Gesuchter Winkel liegt zwischen …",
                    [
                      "Seitenhöhe und halber Grundkante",
                      "Seitenkante und ganzer Grundkante",
                      "Körperhöhe und Seitenkante",
                    ],
                    0,
                  ),
                ]
              : []),
          ],
          "Der Mittelpunkt der Grundfläche liegt eine halbe Grundkante von der Kantenmitte entfernt.",
          "Der Schnitt steht senkrecht auf der betreffenden Grundkante. Darin liegt der wahre Flächenwinkel an der Kantenmitte.",
          `Hilfsdreieck: ${side / 2} cm waagrecht und ${h} cm senkrecht; Winkel an der Kantenmitte.`,
          { side, h },
        );
      },
    },
    {
      id: "wahre-winkel",
      make: (rng, level) => {
        const a = rng.int(2, 5),
          q = rng.pick([0.25, 0.5]);
        return task(
          level,
          `Eine quadratische Grundfläche ist ${a} cm breit; ihre Bildtiefe ist ${fmt(a * q)} cm bei q = ${fmt(q)}. Konstruiere das wahre Quadrat und bestimme den Winkel seiner Diagonale zu einer Seite.`,
          `Eine gerade quadratische Pyramide hat Grundkante ${2 * a} cm und Körperhöhe ${a} cm. Konstruiere den senkrechten Schnitt durch Spitze, Grundflächenmitte und Kantenmitte. Bestimme den Winkel zwischen Seitenfläche und Grundfläche.`,
          [
            num("Wahrer Winkel =", 45, "°", 0),
            ...(level === 2 ? [num("waagrechte Kathete =", a, "cm", 0)] : []),
          ],
          "Die Bildtiefe durch q teilen. Die Diagonale eines Quadrats halbiert den rechten Winkel.",
          level === 1
            ? `Die wahre Tiefe beträgt ${a} cm, also ist die Grundfläche ein Quadrat. Seine Diagonale erzeugt zwei kongruente rechtwinklige Dreiecke mit je zwei gleichen Katheten.`
            : `Im Normalschnitt ist die halbe Grundkante ${a} cm genauso lang wie die Höhe. Das Hilfsdreieck ist rechtwinklig und gleichschenklig.`,
          `Die beiden spitzen Winkel sind gleich und ergänzen sich zu 90°, also jeweils 45°.`,
          { a, q },
        );
      },
    },
  ],
});
export const STAGE_RAUM = makeStage(
  4,
  "Raumgeometrie",
  "Lagebeziehungen, Schrägbilder und wahre Größen",
  "#c026d3",
  "▱",
  [4, null],
  [lagen, schraeg, wahr],
);
