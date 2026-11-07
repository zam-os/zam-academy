import { fmt } from "../exercises/format";
import { CHART_KEYS, CHART_NAMES, seemingRatio } from "../lab/views-daten";
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
  makeLesson(6, step, null, content);
const values = (v: Record<string, number>) => CHART_KEYS.map((key) => v[key]);

const diagramme = L(1, {
  id: "da-1-diagramme",
  title: "6.1 Strichlisten, Tabellen und Diagramme",
  subtitle: "Daten ablesen und in andere Darstellungen übertragen",
  whyItMatters:
    "Zeitungen, Apps und Klassenumfragen zeigen Zahlen als Bilder. Du lernst, aus ihnen das Richtige herauszulesen.",
  explanationHtml: `<p>Daten kannst du verschieden darstellen. In einer <strong>Strichliste</strong> machst du für jede Antwort einen Strich, je fünf werden gebündelt. In einer <strong>Tabelle</strong> stehen die Anzahlen als Zahlen. Im <strong>Säulendiagramm</strong> und im <strong>Balkendiagramm</strong> entspricht die Länge der Säule oder des Balkens der Anzahl.</p><p>Beim Ablesen schaust du zuerst auf die Beschriftung: Was wird gezählt? Wie ist die Achse eingeteilt? Beim Übertragen wählst du eine Einteilung, auf die alle Werte passen.</p><div class="example">Umfrage: 5 Stimmen für Sport, 3 für Kunst, 8 für Musik. Summe: 16 Kinder. Musik hat die meisten Stimmen, 5 mehr als Kunst. Im Säulendiagramm ist die Musiksäule am höchsten.</div><div class="merke"><strong>Merke:</strong> Erst Beschriftung und Einteilung lesen, dann die Werte. Alle Darstellungen zeigen dieselben Daten.</div>`,
  formulas: [
    { name: "Summe der Daten", html: "Summe = alle Anzahlen zusammen", quantities: "Zahl aller Befragten oder Zählungen" },
  ],
  quiz: {
    question: "Du siehst eine Strichliste mit zwei Bündeln und 3 Strichen. Für welche Zahl steht das?",
    options: ["13", "5", "23"],
    correctIndex: 0,
    explanation: "Zwei Bündel sind 2 · 5 = 10, und 3 Striche dazu: 13.",
  },
  lab: lab(
    "chart",
    "Dieselben Daten, drei Bilder",
    "Wechsle die Darstellung. Bei Säulen kannst du auch direkt an den Griffen ziehen.",
    [c("type", "Darstellung", ["Strichliste", "Säulendiagramm", "Balkendiagramm"]), ...CHART_NAMES.map((name, i) => r(CHART_KEYS[i], name, 0, 10, [2, 4, 1, 3, 6][i]))],
    [
      o("summe", "Summe", (v) => values(v).reduce((a, b) => a + b, 0)),
      o("meist", "Am häufigsten", (v) => {
        const list = values(v);
        const top = Math.max(...list);
        return CHART_NAMES.filter((_, i) => list[i] === top).join(", ");
      }),
    ],
    [
      { id: "tabelle", text: "Übertrage diese Tabelle ins Säulendiagramm: Sport 5, Kunst 3, Musik 8, Mathe 2, Deutsch 4.", check: (v) => v.type === 1 && v.a === 5 && v.b === 3 && v.c === 8 && v.d === 2 && v.e === 4 },
      { id: "gleich", text: "Zeige in der Strichliste 30 Stimmen, die sich gleichmäßig auf alle Fächer verteilen.", check: (v) => v.type === 0 && values(v).every((x) => x === 6) },
      { id: "balken", text: "Zeige im Balkendiagramm: Sport hat alleine die meisten Stimmen, nämlich 10.", check: (v) => v.type === 2 && v.a === 10 && values(v).slice(1).every((x) => x < 10) },
    ],
  ),
  exercises: [
    {
      id: "strichliste-lesen",
      make: (rng, level) => {
        const a = rng.int(6, 19);
        const drawn = rng.int(6, 19);
        const b = drawn === a ? drawn + 1 : drawn;
        const bundles = Math.floor(a / 5), rest = a % 5;
        if (level === 1)
          return task(
            level,
            `Eine Strichliste zeigt ${bundles} ${bundles === 1 ? "volles Fünferbündel" : "volle Fünferbündel"} und ${rest === 0 ? "keine einzelnen Striche" : `${rest} ${rest === 1 ? "einzelner Strich" : "einzelne Striche"}`}. Wie viele Stimmen sind das?`,
            "",
            [num("Stimmen:", a, "", 0)],
            "Ein Bündel sind 5 Striche.",
            `${bundles} · 5 + ${rest} = ${a}.`,
            `${a} Stimmen`,
            { a },
          );
        const big = Math.max(a, b), small = Math.min(a, b);
        const first = a >= b ? "Hund" : "Katze";
        return task(
          level,
          "",
          `In einer Umfrage stimmten ${a} Kinder für den Hund und ${b} für die Katze. Übertrage das in Gedanken in zwei Säulen. Wie viele Kinder wurden gefragt, und um wie viele Stimmen ist die höhere Säule größer?`,
          [num("Befragte:", a + b, "", 0), num("Unterschied:", big - small, "", 0)],
          `Die höhere Säule gehört zu: ${first}.`,
          `${a} + ${b} = ${a + b}. ${big} − ${small} = ${big - small}.`,
          `${a + b} Befragte, Unterschied ${big - small}`,
          { a, b },
        );
      },
    },
    {
      id: "saeule-einteilung",
      make: (rng, level) => {
        const step = rng.pick([2, 5, 10]);
        const lines = rng.int(2, 9);
        const value = step * lines;
        if (level === 1)
          return task(
            level,
            `In einem Säulendiagramm bedeutet ein Teilstrich ${step} Kinder. Eine Säule reicht bis zum ${lines}. Strich. Wie viele Kinder sind das?`,
            "",
            [num("Kinder:", value, "", 0, { slips: [{ value: lines, hint: `Das ist die Anzahl der Striche. Ein Strich bedeutet ${step} Kinder.` }] })],
            "Striche · Wert eines Strichs",
            `${lines} · ${step} = ${value}.`,
            `${value} Kinder`,
            { step, lines },
          );
        const fitting = rng.pick([5, 10, 20, 50]);
        const top = fitting * rng.int(8, 10);
        const data = rng.shuffle([rng.int(2, 3) * fitting, rng.int(4, 6) * fitting, top]);
        const options = [`${fitting} pro Strich`, "1 pro Strich", `${n0(fitting * 50)} pro Strich`];
        return task(
          level,
          "",
          `Du sollst ${data.join(", ")} als Säulen auf ein Blatt zeichnen, mit etwa 10 Teilstrichen. Welche Einteilung passt?`,
          [pick("Einteilung:", options, 0)],
          "Der größte Wert muss noch auf das Blatt passen.",
          `Bei ${fitting} pro Strich passt ${top} auf ${top / fitting} Striche. Mit 1 pro Strich wären es viel zu viele, mit ${n0(fitting * 50)} pro Strich wären alle Säulen winzig.`,
          `${fitting} pro Strich`,
          { top },
        );
      },
    },
  ],
});

const vierfelder = L(2, {
  id: "da-2-vierfeldertafel",
  title: "6.2 Vierfeldertafel und sinnvolle Fragen",
  subtitle: "Daten nach zwei Merkmalen ordnen, Fragen stellen und beantworten",
  whyItMatters:
    "Wer zwei Merkmale gleichzeitig betrachtet, sieht mehr. Und wer selbst passende Fragen stellt, versteht die Daten wirklich.",
  explanationHtml: `<p>Eine <strong>Vierfeldertafel</strong> ordnet Daten nach <strong>zwei Merkmalen</strong>. Vier Felder enthalten die Anzahlen für jede Kombination, die Randfelder enthalten die Summen, unten rechts steht die Gesamtzahl. Fehlende Werte rechnest du über Zeilen- und Spaltensummen aus.</p><p>Zu einer Tabelle oder einem Diagramm kannst du eigene <strong>Fragen</strong> stellen. Eine mathematisch sinnvolle Frage lässt sich mit den Daten beantworten, und du kannst die Antwort begründen: „Fahren mehr Kinder mit dem Bus als mit dem Fahrrad?“ Dagegen geht „Warum mögen sie den Bus?“ nicht, denn dazu stehen keine Zahlen in der Tafel.</p><div class="example">6 Mädchen und 9 Jungen fahren Bus, 8 Mädchen und 7 Jungen Fahrrad. Bus zusammen 15, Fahrrad zusammen 15, gesamt 30. Frage: Wie viele Jungen sind es? 9 + 7 = 16. Begründung: Summe der Jungenzeile.</div><div class="merke"><strong>Merke:</strong> Zeilen und Spalten müssen zur Gesamtzahl passen. Eine sinnvolle Frage kann man aus den Daten beantworten.</div>`,
  formulas: [
    { name: "Vierfeldertafel", html: "Zeilensummen und Spaltensummen ergeben dieselbe Gesamtzahl.", quantities: "a + b + c + d = Gesamt" },
  ],
  quiz: {
    question: "Welche Frage kannst du mit einer Tafel aus Bus/Fahrrad und Mädchen/Jungen beantworten?",
    options: ["Wie viele Mädchen fahren mit dem Bus?", "Wie weit ist der Schulweg?", "Welches Fahrrad ist am schönsten?"],
    correctIndex: 0,
    explanation: "Nur die Anzahl steht in der Tafel. Entfernung und Schönheit kommen darin nicht vor.",
  },
  lab: lab(
    "four-field",
    "Vierfeldertafel füllen",
    "Stelle die vier Anzahlen ein. Summen und Gesamtzahl rechnet das Labor. Prüfe, welche Aussagen dann stimmen.",
    [r("a", "Mädchen, Bus", 0, 20, 3), r("b", "Mädchen, Fahrrad", 0, 20, 4), r("c", "Jungen, Bus", 0, 20, 2), r("d", "Jungen, Fahrrad", 0, 20, 6)],
    [
      o("bus", "Bus gesamt", (v) => v.a + v.c),
      o("rad", "Fahrrad gesamt", (v) => v.b + v.d),
      o("gesamt", "Gesamt", (v) => v.a + v.b + v.c + v.d),
    ],
    [
      { id: "beispiel", text: "Stelle das Beispiel ein: 6, 8, 9 und 7. Die Gesamtzahl ist 30.", check: (v) => v.a === 6 && v.b === 8 && v.c === 9 && v.d === 7 },
      { id: "bus", text: "Bei insgesamt 30 Kindern sollen 20 mit dem Bus fahren.", check: (v) => v.a + v.b + v.c + v.d === 30 && v.a + v.c === 20 },
      { id: "gleich-viele", text: "Es sollen gleich viele Mädchen und Jungen sein, aber verschieden viele im Bus.", check: (v) => v.a + v.b === v.c + v.d && v.a !== v.c },
    ],
  ),
  exercises: [
    {
      id: "fehlender-wert",
      make: (rng, level) => {
        const a = rng.int(3, 14), b = rng.int(3, 14), d = rng.int(3, 14), e = rng.int(3, 14);
        const total = a + b + d + e;
        if (level === 1)
          return task(
            level,
            `In einer Vierfeldertafel: Mädchen Bus ${a}, Mädchen Fahrrad ${b}, Jungen Bus ${d}, Jungen Fahrrad ${e}. Wie viele Kinder fahren insgesamt mit dem Bus?`,
            "",
            [num("Bus:", a + d, "", 0, { slips: [{ value: a + b, hint: "Das ist die Zeile der Mädchen. Für den Bus addierst du die Spalte." }] })],
            "Addiere die Spalte Bus.",
            `${a} + ${d} = ${a + d}.`,
            `${a + d} Kinder`,
            { a, d },
          );
        return task(
          level,
          "",
          `Von ${total} Kindern fahren ${a + d} mit dem Bus. Es gibt ${a + b} Mädchen, davon fahren ${a} Bus. Wie viele Jungen fahren Fahrrad?`,
          [num("Jungen, Fahrrad:", e, "", 0)],
          "Fülle die Tafel Schritt für Schritt aus.",
          `Mädchen Fahrrad: ${a + b} − ${a} = ${b}. Fahrrad gesamt: ${total} − ${a + d} = ${b + e}. Jungen Fahrrad: ${b + e} − ${b} = ${e}.`,
          `${e} Jungen fahren Fahrrad.`,
          { a, b, d, e },
        );
      },
    },
    {
      id: "fragen",
      make: (rng, level) => {
        const good = rng.pick([
          "Wie viele Kinder wurden insgesamt befragt?",
          "Fahren mehr Mädchen oder mehr Jungen mit dem Bus?",
          "Wie viele Kinder fahren Fahrrad?",
        ]);
        const bad = rng.shuffle([
          "Warum fahren Kinder gern Fahrrad?",
          "Wie alt ist der Busfahrer?",
          "Wie lang dauert der Schulweg?",
          "Welche Farbe hat der Bus?",
        ]).slice(0, 2);
        const bus = rng.int(4, 18), rad = rng.int(4, 18);
        return task(
          level,
          `Eine Tafel zeigt, wie viele Mädchen und Jungen mit Bus oder Fahrrad kommen. Welche Frage kannst du damit beantworten?`,
          `Eine Tafel zeigt ${bus} Kinder mit dem Bus und ${rad} mit dem Fahrrad. Wie viele Kinder sind es, und welche Aussage kannst du begründen?`,
          level === 1
            ? [pick("Sinnvolle Frage:", [good, ...bad], 0)]
            : [
                num("Kinder:", bus + rad, "", 0),
                pick(
                  "Begründbare Aussage:",
                  bus === rad
                    ? ["Beide Gruppen sind gleich groß.", "Bus ist beliebter, weil er bequem ist.", "Mit dem Fahrrad ist man schneller."]
                    : [`${Math.abs(bus - rad) === 1 ? "Es kommt 1 Kind" : `Es kommen ${Math.abs(bus - rad)} Kinder`} mehr mit ${bus > rad ? "dem Bus" : "dem Fahrrad"}.`, "Der Schulweg ist für alle gleich lang.", "Mit dem Fahrrad ist man schneller."],
                  0,
                ),
              ],
          "Sinnvoll ist eine Frage, wenn die Antwort in den Daten steht.",
          level === 1 ? "Die anderen Fragen betreffen Dinge, die nicht in der Tafel stehen." : `${bus} + ${rad} = ${bus + rad}.`,
          level === 1 ? good : `${bus + rad} Kinder`,
          { bus, rad },
        );
      },
    },
  ],
});

const verzerrungen = L(3, {
  id: "da-3-verzerrungen",
  title: "6.3 Diagramme kritisch prüfen",
  subtitle: "Fehler und Verzerrungen erkennen und korrigieren",
  whyItMatters:
    "Werbung und Schlagzeilen zeigen Diagramme oft so, dass kleine Unterschiede riesig wirken. Lass dich nicht täuschen.",
  explanationHtml: `<p>Diagramme können täuschen. Prüfe immer:</p><p><strong>Beginnt die Achse bei 0?</strong> Schneidet man den unteren Teil ab, wirken kleine Unterschiede groß. <strong>Ist die Einteilung gleichmäßig?</strong> Alle Abstände müssen gleich viel bedeuten. <strong>Sind die Säulen gleich breit?</strong> <strong>Passen die Säulen zu den Zahlen?</strong> <strong>Fehlt die Beschriftung?</strong></p><p>Zum <strong>Korrigieren</strong> zeichnest du das Diagramm mit einer Achse ab 0 und gleichmäßiger Einteilung neu.</p><div class="example">Produkt A hat 90 Punkte, Produkt B 70 Punkte. Beginnt die Achse bei 50, ist die Säule A doppelt so hoch wie die von B, denn 40 ist das Doppelte von 20. In Wahrheit ist A nur wenig mehr als ein Viertel größer.</div><div class="merke"><strong>Merke:</strong> Achse ab 0, gleichmäßige Einteilung. Vertraue den Zahlen, nicht nur dem Bild.</div>`,
  formulas: [
    { name: "Ehrliche Achse", html: "Säulendiagramme beginnen bei 0.", quantities: "Sonst wirken Unterschiede größer, als sie sind." },
  ],
  quiz: {
    question: "Ein Diagramm zeigt 98 und 96 Punkte. Die eine Säule ist doppelt so hoch wie die andere. Was ist passiert?",
    options: ["Die Achse beginnt nicht bei 0.", "Die Säulen sind korrekt gezeichnet.", "96 ist die Hälfte von 98."],
    correctIndex: 0,
    explanation: "Beginnt die Achse bei 94, sind die Säulen 4 und 2 hoch. Die Zahlen unterscheiden sich aber kaum.",
  },
  lab: lab(
    "truncated-axis",
    "Die Achse verschieben",
    "Stelle zwei Werte ein und verschiebe den Beginn der Achse. Vergleiche, was das Bild zeigt und was die Zahlen sagen.",
    [r("a", "Wert A", 50, 100, 90), r("b", "Wert B", 50, 100, 70), r("start", "Achsenbeginn", 0, 45, 20, 5)],
    [
      o("wirkt", "A wirkt wie das …-fache", (v) => seemingRatio(v.a, v.b, v.start), "", 1),
      o("wahr", "A ist wirklich das …-fache", (v) => v.a / v.b, "", 1),
    ],
    [
      { id: "taeuschen", text: "Lasse Säule A mindestens doppelt so hoch wirken, obwohl A weniger als das 1,5-Fache von B ist.", check: (v) => seemingRatio(v.a, v.b, v.start) >= 2 && v.a / v.b < 1.5 },
      { id: "ehrlich", text: "Zeige ehrlich: A ist doppelt so groß wie B. Die Achse beginnt bei 0.", check: (v) => v.start === 0 && v.a === 2 * v.b },
      { id: "gleich", text: "Stelle zwei gleiche Werte von 80 ein, mit Achse ab 0.", check: (v) => v.start === 0 && v.a === 80 && v.b === 80 },
    ],
  ),
  exercises: [
    {
      id: "wirkung",
      make: (rng, level) => {
        const honest = level === 2 && rng.int(0, 2) === 0;
        const start = honest ? 0 : rng.pick([40, 50, 60]);
        const b = honest ? rng.int(2, 6) * 10 : start + rng.int(1, 3) * 10;
        const a = start + (b - start) * 2;
        return task(
          level,
          `Die Achse beginnt bei ${start}. Säule A zeigt ${a}, Säule B zeigt ${b}. Wie hoch ist Säule A im Bild, und wie hoch ist Säule B, gemessen ab dem Achsenbeginn?`,
          `Eine Werbung zeigt Säulen für ${a} und ${b} Punkte auf einer Achse ab ${start}. Die Säule von A wirkt doppelt so hoch. Ist A wirklich doppelt so gut wie B?`,
          level === 1
            ? [num("Höhe A:", a - start, "", 0), num("Höhe B:", b - start, "", 0)]
            : [pick("Wirklich doppelt so gut?", ["nein", "ja"], honest ? 1 : 0), num("Doppelter Wert von B wäre:", 2 * b, "", 0)],
          "Im Bild zählt nur der Teil ab dem Achsenbeginn.",
          `${a} − ${start} = ${a - start} und ${b} − ${start} = ${b - start}.${level === 2 ? ` Das Doppelte von ${b} wäre ${2 * b}.` : ""}`,
          level === 1 ? `A: ${a - start}, B: ${b - start}` : honest ? `Ja, die Achse beginnt bei 0, und ${a} ist das Doppelte von ${b}.` : `Nein, ${a} ist nicht das Doppelte von ${b}.`,
          { start, a, b },
        );
      },
    },
    {
      id: "fehler-finden",
      make: (rng, level) => {
        const items = [
          ["Die Achse beginnt bei 80 statt bei 0.", "Die Unterschiede wirken zu groß."],
          ["Die Abstände 10, 20, 30, 50, 100 sind gleich weit gezeichnet.", "Die Einteilung ist nicht gleichmäßig."],
          ["Eine Säule ist doppelt so breit wie die anderen.", "Die breite Säule wirkt zu groß."],
        ] as const;
        const [text, effect] = rng.pick(items);
        const others = items.map(([, e]) => e).filter((e) => e !== effect);
        const low = rng.int(40, 60), high = low + rng.int(2, 9) * 2;
        return task(
          level,
          `Prüfe das Diagramm: ${text} Was ist das Problem?`,
          `Ein Diagramm zeigt ${low} und ${high}. Um korrekt zu sein, zeichnest du es neu. Bei welcher Zahl beginnt die Achse, und wie groß ist der Unterschied?`,
          level === 1 ? [pick("Problem:", [effect, ...others], 0)] : [num("Achsenbeginn:", 0, "", 0), num("Unterschied:", high - low, "", 0)],
          "Prüfe Achse, Einteilung und Breite.",
          level === 1 ? text : `Eine ehrliche Säule beginnt bei 0. ${high} − ${low} = ${high - low}.`,
          level === 1 ? effect : `Achse ab 0, Unterschied ${high - low}`,
          { low, high },
        );
      },
    },
  ],
});

export const STAGE_DATEN = makeStage(
  6,
  "Strichlisten, Diagramme, Vierfeldertafeln und kritisches Prüfen",
  "#0891b2",
  "📊",
  [diagramme, vierfelder, verzerrungen],
);
