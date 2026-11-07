import { fmt } from "../exercises/format";
import { rung } from "../lab/views-groessen";
import { tileCount, TILES } from "../lab/views-flaechen";
import { AREA, convert, notchArea, notchPerimeter } from "../models";
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
  makeLesson(5, step, null, content);

const umfang = L(1, {
  id: "uf-1-umfang",
  title: "5.1 Umfang von Rechteck und Quadrat",
  subtitle: "Die Länge des Randes, auch rückwärts gerechnet",
  whyItMatters:
    "Wie viel Band brauchst du für den Rand eines Tischtuchs? Der Umfang sagt es dir.",
  explanationHtml: `<p>Der <strong>Umfang U</strong> ist die Länge des gesamten Randes einer Figur. Du addierst alle Seiten.</p><p>Beim <strong>Rechteck</strong> kommen die Seiten a und b je zweimal vor: U = 2 · a + 2 · b = 2 · (a + b). Beim <strong>Quadrat</strong> sind alle vier Seiten gleich: U = 4 · a. Der Umfang ist eine Länge, also zum Beispiel in cm oder m.</p><p><strong>Rückwärts:</strong> Du kennst U und eine Seite. Dann ist die halbe Summe U : 2 = a + b, und du ziehst die bekannte Seite ab. Beim Quadrat ist a = U : 4.</p><div class="example">Rechteck mit a = 6 cm und b = 3 cm: U = 2 · (6 cm + 3 cm) = 18 cm. Umgekehrt: U = 24 cm und a = 8 cm. Dann ist a + b = 12 cm, also b = 4 cm.</div><div class="merke"><strong>Merke:</strong> Rechteck: U = 2 · (a + b). Quadrat: U = 4 · a. Der Umfang wird in Längeneinheiten angegeben.</div>`,
  formulas: [
    { name: "Umfang Rechteck", html: "U = 2 · (a + b)", quantities: "a, b Seitenlängen" },
    { name: "Umfang Quadrat", html: "U = 4 · a", quantities: "a Seitenlänge" },
    { name: "Seite aus dem Umfang", html: "b = U : 2 − a", quantities: "Beim Quadrat a = U : 4" },
  ],
  quiz: {
    question: "Ein Rechteck ist 5 cm lang und 2 cm breit. Wie groß ist der Umfang?",
    options: ["14 cm", "10 cm", "7 cm"],
    correctIndex: 0,
    explanation: "2 · (5 cm + 2 cm) = 14 cm. 10 wäre das Produkt, 7 nur die halbe Runde.",
  },
  lab: lab(
    "perimeter",
    "Rechteck ziehen",
    "Ziehe die Ecke. Beobachte, wie sich der Umfang mit den Seiten verändert.",
    [r("a", "Seite a", 1, 12, 6, 1, "cm"), r("b", "Seite b", 1, 12, 3, 1, "cm")],
    [
      o("u", "Umfang", (v) => 2 * (v.a + v.b), "cm"),
      o("form", "Form", (v) => (v.a === v.b ? "Quadrat" : "Rechteck")),
    ],
    [
      { id: "quadrat", text: "Forme ein Quadrat mit dem Umfang 20 cm.", check: (v) => v.a === v.b && 2 * (v.a + v.b) === 20 },
      { id: "rueckwaerts", text: "Stelle a = 8 cm ein und erreiche den Umfang 24 cm.", check: (v) => v.a === 8 && 2 * (v.a + v.b) === 24 },
      { id: "dreissig", text: "Finde ein Rechteck mit dem Umfang 30 cm.", check: (v) => 2 * (v.a + v.b) === 30 },
    ],
  ),
  exercises: [
    {
      id: "umfang-berechnen",
      make: (rng, level) => {
        const a = rng.int(3, 25), b = rng.int(2, a - 1);
        const square = rng.int(0, 2) === 0;
        const value = square ? 4 * a : 2 * (a + b);
        return task(
          level,
          square ? `Berechne den Umfang eines Quadrats mit a = ${a} cm.` : `Berechne den Umfang eines Rechtecks mit a = ${a} cm und b = ${b} cm.`,
          square ? `Ein quadratisches Beet hat die Seitenlänge ${a} m. Wie viele Meter Beeteinfassung braucht es?` : `Um ein ${a} m langes und ${b} m breites Spielfeld soll ein Band gelegt werden. Wie lang muss das Band mindestens sein?`,
          [num("U =", value, level === 1 ? "cm" : "m", 0, { slips: [{ value: square ? a * a : a * b, hint: "Das ist die Fläche. Für den Umfang addierst du alle Seiten." }, ...(square ? [] : [{ value: a + b, hint: "Du hast nur zwei Seiten addiert. Das Rechteck hat vier." }])] })],
          square ? "U = 4 · a" : "U = 2 · (a + b)",
          square ? `4 · ${a} = ${value}.` : `2 · (${a} + ${b}) = 2 · ${a + b} = ${value}.`,
          `U = ${value} ${level === 1 ? "cm" : "m"}`,
          { a, b },
        );
      },
    },
    {
      id: "seite-rueckwaerts",
      make: (rng, level) => {
        const a = rng.int(5, 30), b = rng.int(2, a);
        const value = 2 * (a + b);
        const side = rng.int(2, 30);
        if (level === 1)
          return task(
            level,
            `Der Umfang eines Quadrats ist ${4 * side} cm. Wie lang ist eine Seite?`,
            "",
            [num("a =", side, "cm", 0, { slips: [{ value: 2 * side, hint: "Ein Quadrat hat vier gleiche Seiten. Teile durch 4." }] })],
            "a = U : 4",
            `${4 * side} cm : 4.`,
            `a = ${side} cm`,
            { side },
          );
        return task(
          level,
          "",
          `Für einen rechteckigen Hof reichen genau ${value} m Zaun. Der Hof ist ${a} m lang. Wie breit ist er?`,
          [num("b =", b, "m", 0, { slips: [{ value: value - a, hint: "Die Länge kommt zweimal vor. Rechne zuerst die halbe Runde: U : 2." }] })],
          "b = U : 2 − a",
          `${value} m : 2 = ${value / 2} m. ${value / 2} m − ${a} m = ${b} m.`,
          `Der Hof ist ${b} m breit.`,
          { a, b },
        );
      },
    },
  ],
});

const umfangVielecke = L(2, {
  id: "uf-2-umfang-vielecke",
  title: "5.2 Umfang von Vielecken",
  subtitle: "Alle Seiten addieren und Zäune planen",
  whyItMatters:
    "Grundstücke sind selten genau rechteckig. Mit dem Umfang planst du Zäune, Hecken und Wege.",
  explanationHtml: `<p>Bei jedem <strong>Vieleck</strong> addierst du alle Seiten: Das ist der Umfang. Fehlt eine Seite, kannst du sie oft aus den anderen berechnen. Achte darauf, dass alle Längen dieselbe Einheit haben.</p><p>Ein schöner Trick: Schneidest du aus einem Rechteck eine Ecke heraus, ist der Umfang des L-förmigen Rests <strong>genauso groß</strong> wie beim ganzen Rechteck. Die beiden neuen Kanten ersetzen genau die weggefallenen Stücke.</p><p>Bei einem Zaun ziehst du die Breite eines Tors ab.</p><div class="example">Grundstück in L-Form, 10 m lang und 6 m breit, mit herausgeschnittener Ecke: U = 2 · (10 m + 6 m) = 32 m. Mit einem Tor von 2 m Breite brauchst du 30 m Zaun.</div><div class="merke"><strong>Merke:</strong> Umfang = Summe aller Seiten. Beim L aus einem Rechteck bleibt der Umfang gleich.</div>`,
  formulas: [
    { name: "Umfang Vieleck", html: "U = a + b + c + …", quantities: "Alle Seiten in derselben Einheit" },
    { name: "Zaunlänge", html: "Zaun = U − Tor", quantities: "Das Tor wird nicht umzäunt." },
  ],
  quiz: {
    question: "Aus einem Rechteck wird eine rechteckige Ecke herausgeschnitten. Was passiert mit dem Umfang?",
    options: ["Er bleibt gleich.", "Er wird kleiner.", "Er wird immer doppelt so groß."],
    correctIndex: 0,
    explanation: "Die neuen Kanten sind genauso lang wie die Stücke, die wegfallen.",
  },
  lab: lab(
    "polygon-perimeter",
    "Grundstück einzäunen",
    "Ändere Größe, Ausschnitt und Tor. Prüfe, was den Umfang wirklich verändert.",
    [r("w", "Länge", 4, 12, 6, 1, "m"), r("h", "Breite", 3, 10, 4, 1, "m"), r("cw", "Ausschnitt lang", 0, 3, 1, 1, "m"), r("ch", "Ausschnitt breit", 0, 2, 1, 1, "m"), r("t", "Tor", 0, 4, 1, 1, "m")],
    [
      o("u", "Umfang", (v) => notchPerimeter(v.w, v.h), "m"),
      o("zaun", "Zaun", (v) => notchPerimeter(v.w, v.h) - v.t, "m"),
    ],
    [
      { id: "dreissig", text: "Plane genau 30 m Zaun.", check: (v) => notchPerimeter(v.w, v.h) - v.t === 30 },
      { id: "l-form", text: "Schneide eine Ecke von 3 m mal 2 m aus einem 8 m mal 6 m großen Grundstück. Der Umfang bleibt 28 m.", check: (v) => v.w === 8 && v.h === 6 && v.cw === 3 && v.ch === 2 },
      { id: "tor", text: "Baue ein 4 m breites Tor ein und plane genau 20 m Zaun.", check: (v) => v.t === 4 && notchPerimeter(v.w, v.h) - v.t === 20 },
    ],
  ),
  exercises: [
    {
      id: "vieleck",
      make: (rng, level) => {
        const sides = Array.from({ length: level === 1 ? 5 : 6 }, () => rng.int(5, 12));
        const total = sides.reduce((a, b) => a + b, 0);
        if (level === 1)
          return task(
            level,
            `Ein Fünfeck hat die Seiten ${sides.join(" cm, ")} cm. Berechne seinen Umfang.`,
            "",
            [num("U =", total, "cm", 0)],
            "Alle Seiten addieren",
            `${sides.join(" + ")} = ${total}.`,
            `U = ${total} cm`,
            { total },
          );
        const gate = rng.int(1, 3);
        return task(
          level,
          "",
          `Ein Grundstück hat sechs Seiten: ${sides.join(" m, ")} m. Es bekommt einen Zaun mit einem ${gate} m breiten Tor. Wie viele Meter Zaun braucht man?`,
          [num("Zaun:", total - gate, "m", 0, { slips: [{ value: total, hint: "Das ist der ganze Umfang. Das Tor braucht keinen Zaun." }] })],
          "Umfang minus Tor",
          `U = ${total} m. ${total} m − ${gate} m.`,
          `${total - gate} m Zaun`,
          { total, gate },
        );
      },
    },
    {
      id: "l-form",
      make: (rng, level) => {
        const w = rng.int(6, 20), h = rng.int(5, 15), cw = rng.int(2, 4), ch = rng.int(2, 4);
        const u = notchPerimeter(w, h);
        if (level === 1)
          return task(
            level,
            `Aus einem Rechteck mit ${w} m Länge und ${h} m Breite wird eine Ecke von ${cw} m mal ${ch} m herausgeschnitten. Wie groß ist der Umfang des Rests?`,
            "",
            [num("U =", u, "m", 0, { slips: [{ value: u - 2 * (cw + ch), hint: "Der Ausschnitt nimmt Stücke weg, bringt aber gleich lange neue Kanten dazu." }] })],
            "Der Umfang bleibt wie beim ganzen Rechteck.",
            `2 · (${w} + ${h}) = ${u}.`,
            `U = ${u} m`,
            { w, h },
          );
        const price = rng.int(5, 15);
        return task(
          level,
          "",
          `Ein L-förmiger Garten entsteht aus einem Rechteck, ${w} m mal ${h} m, mit einer fehlenden Ecke von ${cw} m mal ${ch} m. Ein Meter Hecke kostet ${price} €. Wie viel kostet die Hecke rundherum?`,
          [num("Kosten:", u * price, "€", 0)],
          "Erst den Umfang, dann mal Preis pro Meter.",
          `U = 2 · (${w} + ${h}) = ${u}. ${u} · ${price} = ${u * price}.`,
          `${n0(u * price)} €`,
          { w, h, price },
        );
      },
    },
  ],
});

const flaechenVergleichen = L(3, {
  id: "uf-3-flaechen-vergleichen",
  title: "5.3 Flächen vergleichen",
  subtitle: "Mit Kästchen, Fliesen und Einheitsquadraten auslegen",
  whyItMatters:
    "Welches Zimmer ist größer? Bevor du Formeln nutzt, siehst du hier, was ein Flächeninhalt überhaupt bedeutet.",
  explanationHtml: `<p>Der <strong>Flächeninhalt</strong> sagt, wie viel Platz eine Figur einnimmt. Zwei Figuren vergleichst du, indem du sie mit gleichen Stücken <strong>auslegst</strong>. Das können <strong>ungenormte Einheiten</strong> sein (Fliesen, Karos, Bierdeckel) oder <strong>genormte</strong> wie das Quadrat mit 1 cm Seitenlänge: 1 cm².</p><p>Zerlege schwierige Figuren in <strong>Teilfiguren</strong> und setze sie neu zusammen. Dabei bleibt der Flächeninhalt gleich, auch wenn die Form sich ändert. Verschiedene Formen können also gleich groß sein.</p><p>Ungenormte Einheiten haben einen Nachteil: Wer andere Fliesen nimmt, bekommt eine andere Zahl. Darum wurde genormt.</p><div class="example">Figur A: 3 mal 5 Kästchen, also 15. Figur B: 4 mal 4 Kästchen ohne eine Ecke, also 16 − 1 = 15. Beide sind gleich groß, aber verschieden geformt.</div><div class="merke"><strong>Merke:</strong> Gleiche Fläche heißt nicht gleiche Form. Zerlegen ändert den Flächeninhalt nicht.</div>`,
  formulas: [
    { name: "Flächeninhalt", html: "Anzahl der Einheitsquadrate", quantities: "1 cm² ist ein Quadrat mit 1 cm Seitenlänge." },
  ],
  quiz: {
    question: "Warum nimmt man genormte Einheiten wie cm²?",
    options: [
      "Damit alle dieselbe Zahl für dieselbe Fläche bekommen.",
      "Weil Fliesen sonst nicht passen würden.",
      "Weil Flächen ohne Einheit größer wären.",
    ],
    correctIndex: 0,
    explanation: "Mit Fliesen beliebiger Größe bekommt jeder eine andere Zahl. Genormte Einheiten sind überall gleich.",
  },
  lab: lab(
    "tile-compare",
    "Zwei Figuren auslegen",
    "Baue Figur A und Figur B aus Kästchen. Wähle auch, womit du zählst.",
    [c("unit", "Zählen mit", TILES.map((t) => t.label)), r("a", "Breite von A", 2, 8, 3), r("b", "Höhe von A", 2, 6, 4), r("d", "Breite von B", 2, 8, 4), r("e", "Höhe von B", 2, 6, 4), r("k", "Ecke fehlt bei B", 0, 2, 1)],
    [
      o("a", "Fläche A", (v) => tileCount(v.a * v.b, TILES[v.unit].size)),
      o("b", "Fläche B", (v) => tileCount(v.d * v.e - v.k * v.k, TILES[v.unit].size)),
    ],
    [
      { id: "gleich", text: "Mache beide Figuren gleich groß, obwohl B eine Ecke fehlt.", check: (v) => v.k > 0 && v.a * v.b === v.d * v.e - v.k * v.k },
      { id: "zweier", text: "Lege A mit genau 12 Zweier-Fliesen aus.", check: (v) => v.unit === 1 && v.a * v.b === 24 },
      { id: "vierer", text: "Lege B mit genau 5 Vierer-Fliesen aus und lasse eine Ecke von 2 mal 2 Kästchen fehlen.", check: (v) => v.unit === 2 && v.k === 2 && v.d * v.e - v.k * v.k === 20 },
    ],
  ),
  exercises: [
    {
      id: "kaestchen-zaehlen",
      make: (rng, level) => {
        const a = rng.int(3, 9), b = rng.int(3, 9), k = rng.int(1, 2);
        const area = a * b - k * k;
        if (level === 1)
          return task(
            level,
            `Eine Figur besteht aus ${a} mal ${b} Kästchen. Eine Ecke von ${k} mal ${k} Kästchen fehlt. Wie viele Kästchen hat sie?`,
            "",
            [num("Kästchen:", area, "", 0, { slips: [{ value: a * b, hint: "Die fehlende Ecke musst du noch abziehen." }] })],
            "Alle Kästchen minus fehlende Kästchen",
            `${a} · ${b} − ${k} · ${k} = ${a * b} − ${k * k}.`,
            `${area} Kästchen`,
            { a, b, k },
          );
        const size = rng.pick([2, 4]);
        const c2 = rng.int(2, 5) * size;
        const karosB = c2 * size + rng.pick([-size, 0, size]);
        const verdict = c2 * size > karosB ? 0 : c2 * size < karosB ? 1 : 2;
        return task(
          level,
          "",
          `Boden A besteht aus ${c2} Fliesen zu je ${size} Karos. Boden B besteht aus ${karosB} einzelnen Karos. Welcher Boden ist größer?`,
          [pick("Größer ist …", ["Boden A", "Boden B", "keiner, sie sind gleich groß"], verdict), num("Karos von Boden A:", c2 * size, "", 0)],
          "Rechne beide auf dieselbe Einheit um.",
          `${c2} · ${size} = ${c2 * size} Karos, dazu ${karosB} Karos bei Boden B.`,
          ["Boden A ist größer.", "Boden B ist größer.", "Beide Böden sind gleich groß."][verdict],
          { c2, size, karosB },
        );
      },
    },
    {
      id: "fliesen",
      make: (rng, level) => {
        const a = rng.int(2, 6) * 2, b = rng.int(2, 6) * 2;
        const size = level === 1 ? 2 : 4;
        return task(
          level,
          `Ein Feld hat ${a} mal ${b} Kästchen. Wie viele Zweier-Fliesen braucht man zum Auslegen?`,
          `Eine Terrasse misst ${a} mal ${b} Karos. Eine Fliese bedeckt 2 mal 2 Karos. Wie viele Fliesen braucht man?`,
          [num("Fliesen:", (a * b) / size, "", 0, { slips: [{ value: a * b, hint: `Das sind die Karos. Eine Fliese bedeckt ${size} davon.` }] })],
          "Fläche in Karos : Karos pro Fliese",
          `${a} · ${b} = ${a * b}. ${a * b} : ${size} = ${(a * b) / size}.`,
          `${(a * b) / size} Fliesen`,
          { a, b },
        );
      },
    },
  ],
});

const flaecheneinheiten = L(4, {
  id: "uf-4-flaecheneinheiten",
  title: "5.4 Flächeneinheiten",
  subtitle: "mm², cm², dm², m², a, ha, km² und die Umrechnungszahl 100",
  whyItMatters:
    "Eine Briefmarke misst man in cm², einen Wald in Hektar. Du lernst, sicher zwischen den Einheiten zu wechseln.",
  explanationHtml: `<p>Die Einheiten heißen 1 mm², 1 cm², 1 dm², 1 m², 1 a (Ar), 1 ha (Hektar) und 1 km². Die <strong>Umrechnungszahl ist immer 100</strong>: 1 cm² = 100 mm², 1 dm² = 100 cm², 1 m² = 100 dm², 1 a = 100 m², 1 ha = 100 a, 1 km² = 100 ha.</p><p>Warum 100? Ein Quadrat mit 1 dm Seitenlänge hat 10 cm mal 10 cm, also 100 cm². Bei den Längen ist die Zahl 10, bei den Flächen 10 · 10.</p><p>Wähle die Einheit passend: Zimmer in m², Grundstück in a, Bauernhof in ha, Land in km². Bevor du Flächen addierst oder vergleichst, rechnest du in die gleiche Einheit um.</p><div class="example">3 m² = 300 dm² = 30.000 cm². Und 5 ha = 500 a = 50.000 m². Und 450 m² + 2 a = 450 m² + 200 m² = 650 m².</div><div class="merke"><strong>Merke:</strong> Flächeneinheiten: immer mal 100 oder durch 100 pro Stufe.</div>`,
  formulas: [
    { name: "Umrechnung", html: "1 km² = 100 ha, 1 ha = 100 a, 1 a = 100 m², 1 m² = 100 dm², 1 dm² = 100 cm², 1 cm² = 100 mm²", quantities: "a Ar, ha Hektar" },
  ],
  quiz: {
    question: "Wie viele Quadratzentimeter hat 1 dm²?",
    options: ["100", "10", "1.000"],
    correctIndex: 0,
    explanation: "1 dm = 10 cm, also 10 cm · 10 cm = 100 cm².",
  },
  lab: lab(
    "area-ladder",
    "Einheitenleiter für Flächen",
    "Stelle Maßzahl und Einheiten ein. Jede Stufe bedeutet mal 100 oder durch 100.",
    [r("amount", "Maßzahl", 1, 5000, 1), r("from", "Von Einheit Nummer", 0, 6, 3), r("to", "Nach Einheit Nummer", 0, 6, 2)],
    [
      o("von", "Von", (v) => AREA.units[rung(AREA, v.from)]),
      o("nach", "Nach", (v) => AREA.units[rung(AREA, v.to)]),
      o("wert", "Ergebnis", (v) => fmt(convert(AREA, v.amount, v.from, v.to), 12)),
    ],
    [
      { id: "meter", text: "Rechne 3 m² in dm² um.", check: (v) => v.amount === 3 && v.from === 3 && v.to === 2 },
      { id: "hektar", text: "Rechne 5 ha in a um.", check: (v) => v.amount === 5 && v.from === 5 && v.to === 4 },
      { id: "kilometer", text: "Rechne 2 km² in ha um.", check: (v) => v.amount === 2 && v.from === 6 && v.to === 5 },
    ],
  ),
  exercises: [
    {
      id: "umrechnen",
      make: (rng, level) => {
        const to = rng.int(0, 4);
        const steps = level === 1 ? 1 : 2;
        const from = to + steps;
        const amount = rng.int(2, 90);
        const value = convert(AREA, amount, from, to);
        return task(
          level,
          `Rechne in die andere Einheit um: ${amount} ${AREA.units[from]} in ${AREA.units[to]}.`,
          `Auf einem Plan steht die Fläche ${amount} ${AREA.units[from]}. Rechne sie in ${AREA.units[to]} um.`,
          [num("Ergebnis:", value, AREA.units[to], 0, { slips: [{ value: amount * 10 ** steps, hint: "Bei Flächen ist die Umrechnungszahl 100, nicht 10." }] })],
          "Jede Stufe: mal 100",
          `${amount} · ${steps === 1 ? "100" : "100 · 100"} = ${n0(value)}.`,
          `${amount} ${AREA.units[from]} = ${n0(value)} ${AREA.units[to]}`,
          { amount, from },
        );
      },
    },
    {
      id: "vergleichen-addieren",
      make: (rng, level) => {
        const a = rng.int(120, 480), ar = rng.int(2, 8);
        const total = a + ar * 100;
        if (level === 1)
          return task(
            level,
            `Addiere: ${a} m² + ${ar} a. Gib das Ergebnis in m² an.`,
            "",
            [num("Summe:", total, "m²", 0, { slips: [{ value: a + ar, hint: "Rechne die Ar zuerst in m² um: 1 a = 100 m²." }] })],
            "1 a = 100 m²",
            `${ar} a = ${ar * 100} m². ${a} m² + ${ar * 100} m².`,
            `${n0(total)} m²`,
            { a, ar },
          );
        const ha = rng.int(2, 9);
        const part = rng.int(10, 90);
        const rest = ha * 100 - part;
        return task(
          level,
          "",
          `Ein Bauernhof hat ${ha} ha Land. Davon sind ${part} a Wiese, der Rest ist Acker. Wie groß ist der Acker in Ar?`,
          [num("Acker:", rest, "a", 0)],
          "Erst in Ar umrechnen, dann abziehen.",
          `${ha} ha = ${ha * 100} a. ${ha * 100} a − ${part} a.`,
          `${rest} a`,
          { ha, part },
        );
      },
    },
  ],
});

const flaecheRechteck = L(5, {
  id: "uf-5-flaeche-rechteck",
  title: "5.5 Flächeninhalt von Rechteck und Quadrat",
  subtitle: "Die Formeln und das Rückwärtsrechnen",
  whyItMatters:
    "Teppich, Tapete oder Rasen: Mit der Rechteckformel weißt du, wie viel du kaufen musst.",
  explanationHtml: `<p>Ein Rechteck mit a = 5 cm und b = 3 cm lässt sich mit 3 Reihen zu je 5 Quadraten mit 1 cm Seitenlänge auslegen. Das sind 5 · 3 = 15 Quadrate. Darum gilt <strong>A = a · b</strong>. Beim Quadrat ist <strong>A = a · a = a²</strong>.</p><p>Beide Seiten müssen <strong>dieselbe Einheit</strong> haben. Das Ergebnis ist dann in der passenden Flächeneinheit: cm · cm = cm².</p><p><strong>Rückwärts:</strong> Kennst du A und a, ist b = A : a. Beim Quadrat suchst du die Zahl, die mit sich selbst den Flächeninhalt ergibt.</p><div class="example">Zimmer: a = 6 m, b = 4 m. A = 24 m². Ein Teppich mit 36 m² und a = 9 m hat b = 36 m² : 9 m = 4 m. Ein Quadrat mit A = 64 cm² hat a = 8 cm.</div><div class="merke"><strong>Merke:</strong> Rechteck: A = a · b. Quadrat: A = a². Flächen haben Quadrateinheiten, Umfänge haben Längeneinheiten.</div>`,
  formulas: [
    { name: "Flächeninhalt Rechteck", html: "A = a · b", quantities: "a, b Seitenlängen" },
    { name: "Flächeninhalt Quadrat", html: "A = a²", quantities: "a Seitenlänge" },
    { name: "Seite aus der Fläche", html: "b = A : a", quantities: "Bei gleicher Einheit" },
  ],
  quiz: {
    question: "Ein Rechteck hat a = 8 cm und b = 5 cm. Wie groß ist der Flächeninhalt?",
    options: ["40 cm²", "26 cm", "13 cm²"],
    correctIndex: 0,
    explanation: "8 · 5 = 40, die Einheit ist cm². 26 cm wäre der Umfang.",
  },
  lab: lab(
    "area-rect",
    "Quadrate zählen",
    "Ziehe die Ecke. Jedes Kästchen ist 1 cm² groß.",
    [r("a", "Seite a", 1, 12, 5, 1, "cm"), r("b", "Seite b", 1, 12, 2, 1, "cm")],
    [
      o("a2", "Flächeninhalt", (v) => v.a * v.b, "cm²"),
      o("u", "Umfang", (v) => 2 * (v.a + v.b), "cm"),
    ],
    [
      { id: "quadrat", text: "Forme ein Quadrat mit dem Flächeninhalt 36 cm².", check: (v) => v.a === v.b && v.a * v.b === 36 },
      { id: "rueckwaerts", text: "Stelle a = 8 cm ein und erreiche den Flächeninhalt 24 cm².", check: (v) => v.a === 8 && v.b === 3 },
      { id: "gleicher-umfang", text: "Finde ein Rechteck mit dem Umfang 20 cm und dem Flächeninhalt 16 cm².", check: (v) => 2 * (v.a + v.b) === 20 && v.a * v.b === 16 },
    ],
  ),
  exercises: [
    {
      id: "flaeche-berechnen",
      make: (rng, level) => {
        const a = rng.int(3, 25), b = rng.int(2, a);
        const value = a * b;
        const price = rng.int(3, 12);
        return task(
          level,
          `Berechne den Flächeninhalt eines Rechtecks mit a = ${a} cm und b = ${b} cm.`,
          `Ein Saal ist ${a} m lang und ${b} m breit. Ein Quadratmeter Boden kostet ${price} €. Wie teuer ist der Boden?`,
          [num(level === 1 ? "A =" : "Kosten:", level === 1 ? value : value * price, level === 1 ? "cm²" : "€", 0, { slips: level === 1 ? [{ value: 2 * (a + b), hint: "Das ist der Umfang. Für die Fläche multiplizierst du." }] : [{ value: 2 * (a + b) * price, hint: "Du hast den Umfang genommen. Hier zählt die Fläche." }] })],
          "A = a · b",
          level === 1 ? `${a} · ${b} = ${value}.` : `A = ${a} · ${b} = ${value} m². ${value} · ${price} = ${value * price}.`,
          level === 1 ? `A = ${value} cm²` : `${n0(value * price)} €`,
          { a, b },
        );
      },
    },
    {
      id: "seite-aus-flaeche",
      make: (rng, level) => {
        const a = rng.int(3, 20), b = rng.int(2, 15);
        if (level === 1)
          return task(
            level,
            `Ein Rechteck hat den Flächeninhalt ${a * b} cm² und die Seite a = ${a} cm. Wie lang ist b?`,
            "",
            [num("b =", b, "cm", 0, { slips: [{ value: a * b - a, hint: "Du hast abgezogen. Bei der Fläche wird geteilt: b = A : a." }] })],
            "b = A : a",
            `${a * b} : ${a} = ${b}.`,
            `b = ${b} cm`,
            { a, b },
          );
        const side = rng.int(4, 20);
        return task(
          level,
          "",
          `Ein quadratischer Garten hat ${side * side} m² Fläche. Er soll einen Zaun bekommen. Wie lang ist eine Seite, und wie viel Zaun braucht man?`,
          [num("Seite:", side, "m", 0), num("Zaun:", 4 * side, "m", 0)],
          "Welche Zahl mal sich selbst ergibt die Fläche?",
          `${side} · ${side} = ${side * side}. U = 4 · ${side}.`,
          `Seite ${side} m, Zaun ${4 * side} m`,
          { side },
        );
      },
    },
  ],
});

const zusammengesetzt = L(6, {
  id: "uf-6-zusammengesetzt",
  title: "5.6 Flächen von Vielecken",
  subtitle: "Zerlegen oder ergänzen",
  whyItMatters:
    "Wohnungen haben selten vier gerade Wände. Du lernst, jede eckige Form in Rechtecke aufzuteilen.",
  explanationHtml: `<p>Für den Flächeninhalt eines Vielecks gibt es zwei Wege:</p><p><strong>Zerlegen:</strong> Teile die Figur in Rechtecke und addiere deren Flächen. <strong>Ergänzen:</strong> Ergänze die Figur zu einem großen Rechteck und ziehe das fehlende Stück ab. Beide Wege führen zum gleichen Ergebnis. Fehlende Seitenlängen rechnest du aus den anderen aus.</p><div class="example">L-Form, 10 m mal 8 m, mit fehlender Ecke von 4 m mal 3 m. Zerlegen: 10 m · 5 m + 6 m · 3 m = 50 m² + 18 m² = 68 m². Ergänzen: 10 m · 8 m − 4 m · 3 m = 80 m² − 12 m² = 68 m².</div><div class="merke"><strong>Merke:</strong> Zerlegen: addieren. Ergänzen: abziehen. Eine Skizze mit allen Längen hilft.</div>`,
  formulas: [
    { name: "Zerlegen", html: "A = A₁ + A₂", quantities: "Teilrechtecke addieren" },
    { name: "Ergänzen", html: "A = A<sub>groß</sub> − A<sub>klein</sub>", quantities: "Fehlendes Stück abziehen" },
  ],
  quiz: {
    question: "Ein 10 m mal 6 m großer Raum hat eine fehlende Ecke von 2 m mal 2 m. Wie groß ist er?",
    options: ["56 m²", "64 m²", "60 m²"],
    correctIndex: 0,
    explanation: "60 m² − 4 m² = 56 m².",
  },
  lab: lab(
    "composite",
    "Zerlegen oder ergänzen",
    "Wechsle die Methode und verändere die Figur. Das Ergebnis bleibt bei beiden Wegen gleich.",
    [c("method", "Methode", ["Zerlegen", "Ergänzen"]), r("w", "Breite", 5, 12, 6, 1, "m"), r("h", "Höhe", 4, 10, 5, 1, "m"), r("cw", "Ecke breit", 1, 4, 2, 1, "m"), r("ch", "Ecke hoch", 1, 3, 1, 1, "m")],
    [
      o("a", "Flächeninhalt", (v) => notchArea(v.w, v.h, v.cw, v.ch), "m²"),
      o("u", "Umfang", (v) => notchPerimeter(v.w, v.h), "m"),
    ],
    [
      { id: "beispiel", text: "Stelle das Beispiel ein: 10 m mal 8 m, Ecke 4 m mal 3 m.", check: (v) => v.w === 10 && v.h === 8 && v.cw === 4 && v.ch === 3 },
      { id: "achtundvierzig", text: "Erreiche 48 m² mit der Methode Ergänzen.", check: (v) => v.method === 1 && notchArea(v.w, v.h, v.cw, v.ch) === 48 },
      { id: "zerlegt", text: "Erreiche mit der Methode Zerlegen genau 100 m².", check: (v) => v.method === 0 && notchArea(v.w, v.h, v.cw, v.ch) === 100 },
    ],
  ),
  exercises: [
    {
      id: "l-form",
      make: (rng, level) => {
        const w = rng.int(8, 16), h = rng.int(6, 12), cw = rng.int(2, 5), ch = rng.int(2, 4);
        const area = notchArea(w, h, cw, ch);
        return task(
          level,
          `Eine Figur entsteht aus einem Rechteck mit ${w} m Breite und ${h} m Höhe, von dem eine Ecke mit ${cw} m mal ${ch} m fehlt. Berechne ihren Flächeninhalt.`,
          `Ein Erdgeschoss hat einen Grundriss aus einem Rechteck von ${w} m mal ${h} m, in dessen Ecke ein ${cw} m mal ${ch} m großer Schacht liegt. Wie groß ist die Wohnfläche?`,
          [num("A =", area, "m²", 0, { slips: [{ value: w * h, hint: "Das fehlende Stück musst du noch abziehen." }, { value: w * h + cw * ch, hint: "Du hast die Ecke addiert. Sie fehlt aber." }] })],
          "A = großes Rechteck − kleines Rechteck",
          `${w} · ${h} = ${w * h}. ${cw} · ${ch} = ${cw * ch}. ${w * h} − ${cw * ch} = ${area}.`,
          `A = ${area} m²`,
          { w, h, cw, ch },
        );
      },
    },
    {
      id: "wohnung",
      make: (rng, level) => {
        const a = rng.int(3, 6), b = rng.int(3, 5), d = rng.int(3, 6), e = rng.int(2, 4), g = rng.int(4, 6), f = rng.int(2, 4);
        const area = a * b + d * e + (level === 2 ? g * f : 0);
        if (level === 1)
          return task(
            level,
            `Eine Figur besteht aus zwei Rechtecken: ${a} m mal ${b} m und ${d} m mal ${e} m. Wie groß ist sie zusammen?`,
            "",
            [num("A =", area, "m²", 0)],
            "Teilflächen addieren",
            `${a} · ${b} + ${d} · ${e} = ${a * b} + ${d * e}.`,
            `A = ${area} m²`,
            { a, b },
          );
        return task(
          level,
          "",
          `Ein Wohnungsplan zeigt ein Wohnzimmer mit ${a} m mal ${b} m, eine Küche mit ${d} m mal ${e} m und einen Flur mit ${g} m mal ${f} m. Wie groß ist die Wohnung insgesamt?`,
          [num("A =", area, "m²", 0)],
          "Jeden Raum einzeln berechnen, dann addieren.",
          `${a * b} m² + ${d * e} m² + ${g * f} m².`,
          `A = ${area} m²`,
          { a, b, d, e, g, f },
        );
      },
    },
  ],
});

export const STAGE_FLAECHEN = makeStage(
  5,
  "Umfang und Flächeninhalt von Rechtecken, Quadraten und Vielecken",
  "#7c3aed",
  "📏",
  [umfang, umfangVielecke, flaechenVergleichen, flaecheneinheiten, flaecheRechteck, zusammengesetzt],
);
