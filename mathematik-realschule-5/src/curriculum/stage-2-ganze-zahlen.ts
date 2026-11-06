import { fmt, paren } from "../exercises/format";
import { intTermSteps } from "../lab/views-ganz";
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
const L = (step: number, content: Parameters<typeof makeLesson>[3]) =>
  makeLesson(2, step, null, content);

const negativeZahlen = L(1, {
  id: "gz-1-negative-zahlen",
  title: "2.1 Warum negative Zahlen?",
  subtitle: "Temperatur, Kontostand und Stockwerke",
  whyItMatters:
    "3 − 5 hat in den natürlichen Zahlen keine Lösung. Trotzdem kann es morgens 3 °C haben und abends 5 Grad kälter sein.",
  explanationHtml: `<p>Mit natürlichen Zahlen kannst du nicht jede Subtraktion ausführen: 3 − 5 geht nicht. Darum <strong>erweitern</strong> wir den Zahlenbereich um die <strong>negativen Zahlen</strong> −1, −2, −3, … Zusammen mit der 0 und den positiven Zahlen ergeben sie die <strong>ganzen Zahlen</strong> ℤ = {…; −2; −1; 0; 1; 2; …}.</p><p>Negative Zahlen beschreiben alles, was unter einem Nullpunkt liegt: Temperaturen unter 0 °C, Schulden auf dem Konto, Stockwerke unter dem Erdgeschoss, Orte unter dem Meeresspiegel, die Tordifferenz einer Mannschaft.</p><div class="example">Morgens 3 °C, bis zum Abend 5 Grad kälter: 3 − 5 = −2. Abends sind es −2 °C. Wer 20 € auf dem Konto hat und 50 € abhebt, steht bei −30 €.</div><div class="merke"><strong>Merke:</strong> Ganze Zahlen reichen in beide Richtungen ohne Ende. Die 0 selbst ist weder positiv noch negativ.</div>`,
  formulas: [
    { name: "Ganze Zahlen", html: "ℤ = {…; −2; −1; 0; 1; 2; …}", quantities: "ℕ ist ein Teil davon." },
  ],
  quiz: {
    question: "Warum reichen die natürlichen Zahlen nicht aus?",
    options: [
      "Weil zum Beispiel 3 − 5 keine natürliche Zahl ergibt.",
      "Weil es nur endlich viele natürliche Zahlen gibt.",
      "Weil man natürliche Zahlen nicht addieren kann.",
    ],
    correctIndex: 0,
    explanation: "Das Ergebnis −2 liegt außerhalb von ℕ. Mit den ganzen Zahlen geht jede Subtraktion auf.",
  },
  lab: lab(
    "thermometer",
    "Unter der Null",
    "Wähle eine Situation und ziehe den Wert. Du siehst, wann die Zahl negativ wird.",
    [c("ctx", "Situation", ["Temperatur", "Kontostand", "Stockwerk"]), r("t", "Wert", -20, 30, 5)],
    [
      o("art", "Art der Zahl", (v) => (v.t < 0 ? "negativ" : v.t > 0 ? "positiv" : "weder noch")),
      o("satz", "Bedeutung", (v) => {
        if (v.ctx === 0) return v.t < 0 ? `${-v.t} Grad unter dem Gefrierpunkt` : `${v.t} Grad über dem Gefrierpunkt`;
        if (v.ctx === 1) return v.t < 0 ? `${-v.t} € Schulden` : `${v.t} € Guthaben`;
        return v.t < 0 ? `${-v.t}. Untergeschoss` : v.t === 0 ? "Erdgeschoss" : `${v.t}. Obergeschoss`;
      }),
    ],
    [
      { id: "frost", text: "Stelle starken Frost ein: −12 °C.", check: (v) => v.ctx === 0 && v.t === -12 },
      { id: "schulden", text: "Stelle 20 € Schulden ein.", check: (v) => v.ctx === 1 && v.t === -20 },
      { id: "keller", text: "Fahre mit dem Aufzug in das 3. Untergeschoss.", check: (v) => v.ctx === 2 && v.t === -3 },
    ],
  ),
  exercises: [
    {
      id: "temperatur",
      make: (rng, level) => {
        const start = rng.int(1, 9), drop = start + rng.int(1, 9);
        const end = start - drop;
        if (level === 1)
          return task(
            level,
            `Am Morgen zeigt das Thermometer ${start} °C. Bis zum Abend wird es ${drop} Grad kälter. Wie warm ist es dann?`,
            "",
            [num("Temperatur:", end, "°C", 0, { slips: [{ value: -end, hint: "Das Ergebnis liegt unter null. Vergiss das Minuszeichen nicht." }] })],
            `Rechne ${start} − ${drop}.`,
            `Bis 0 °C sind es ${start} Grad. Dann fehlen noch ${drop - start} Grad.`,
            `Es sind ${n0(end)} °C.`,
            { start, drop },
          );
        const rise = rng.int(3, 15);
        return task(
          level,
          "",
          `In der Nacht hat es ${n0(end)} °C. Bis zum Mittag steigt die Temperatur um ${rise} Grad, am Abend fällt sie wieder um ${drop} Grad. Welche Temperatur ist am Abend?`,
          [num("Temperatur:", end + rise - drop, "°C", 0)],
          "Rechne Schritt für Schritt auf der Zahlengeraden.",
          `${n0(end)} + ${rise} = ${n0(end + rise)}, dann ${n0(end + rise)} − ${drop} = ${n0(end + rise - drop)}.`,
          `Am Abend sind es ${n0(end + rise - drop)} °C.`,
          { end, rise, drop },
        );
      },
    },
    {
      id: "situation",
      make: (rng, level) => {
        const amount = rng.int(5, 90);
        const items = [
          [`${amount} € Schulden`, -amount],
          [`${amount} € Guthaben`, amount],
          [`${amount} m unter dem Meeresspiegel`, -amount],
          [`${amount} m über dem Meeresspiegel`, amount],
        ] as const;
        const [label, value] = rng.pick(items);
        if (level === 1)
          return task(
            level,
            `Schreibe „${label}“ als ganze Zahl.`,
            "",
            [num("Zahl:", value, "", 0, { slips: [{ value: -value, hint: "Prüfe das Vorzeichen: Liegt der Wert über oder unter der Null?" }] })],
            "Unter der Null: negativ. Über der Null: positiv.",
            `„${label}“ liegt ${value < 0 ? "unter" : "über"} dem Nullpunkt.`,
            `Die Zahl ist ${n0(value)}.`,
            { value },
          );
        const pay = amount + rng.int(5, 60);
        return task(
          level,
          "",
          `Auf dem Konto von Lena sind ${amount} €. Sie bezahlt ein Rad für ${pay} €. Wie sieht der Kontostand danach aus?`,
          [num("Kontostand:", amount - pay, "€", 0, { slips: [{ value: pay - amount, hint: "Dann hätte Lena Guthaben. Sie hat aber mehr ausgegeben, als da war." }] })],
          "Mehr ausgegeben als da war: negativer Kontostand.",
          `${amount} − ${pay} = ${n0(amount - pay)}.`,
          `Der Kontostand ist ${n0(amount - pay)} €.`,
          { amount, pay },
        );
      },
    },
  ],
});

const begriffe = L(2, {
  id: "gz-2-begriffe",
  title: "2.2 Vorzeichen, Gegenzahl und Betrag",
  subtitle: "Die Fachbegriffe der ganzen Zahlen",
  whyItMatters:
    "Diese Begriffe brauchst du für alle Rechenregeln der nächsten Lektionen.",
  explanationHtml: `<p>Das <strong>Vorzeichen</strong> sagt, auf welcher Seite der Null eine Zahl liegt: + oder −. <strong>Positive ganze Zahlen</strong> sind 1, 2, 3, …; <strong>negative ganze Zahlen</strong> sind −1, −2, −3, … Das Plus lässt man meist weg.</p><p>Die <strong>Gegenzahl</strong> hat denselben Abstand zur Null, liegt aber auf der anderen Seite: Die Gegenzahl von 7 ist −7, die von −7 ist 7. Der <strong>Betrag</strong> ist der Abstand zur Null. Er ist nie negativ und wird mit senkrechten Strichen geschrieben.</p><div class="example">|−7| = 7 und |7| = 7. Die Gegenzahl von −12 ist 12. Die Gegenzahl von 0 ist 0, und |0| = 0.</div><div class="merke"><strong>Merke:</strong> Gegenzahl: Vorzeichen wechseln. Betrag: Abstand zur Null, also ohne Minus.</div>`,
  formulas: [
    { name: "Betrag", html: "|−7| = 7, |7| = 7", quantities: "Abstand zur Null, nie negativ" },
    { name: "Gegenzahl", html: "−(−7) = 7", quantities: "Gleicher Abstand, andere Seite" },
  ],
  quiz: {
    question: "Was ist die Gegenzahl von −9?",
    options: ["9", "−9", "0"],
    correctIndex: 0,
    explanation: "Die Gegenzahl liegt auf der anderen Seite der Null im gleichen Abstand. Das ist 9.",
  },
  lab: lab(
    "opposite",
    "Spiegelbild an der Null",
    "Ziehe die Zahl auf der Geraden. Der Bogen zeigt den Betrag, der orange Punkt die Gegenzahl.",
    [r("z", "Zahl", -20, 20, 5)],
    [
      o("vorzeichen", "Vorzeichen", (v) => (v.z > 0 ? "plus" : v.z < 0 ? "minus" : "keines")),
      o("gegenzahl", "Gegenzahl", (v) => n0(-v.z)),
      o("betrag", "Betrag", (v) => Math.abs(v.z)),
    ],
    [
      { id: "minus-sieben", text: "Stelle −7 ein: Betrag 7, Gegenzahl 7.", check: (v) => v.z === -7 },
      { id: "null", text: "Stelle die Zahl ein, die ihre eigene Gegenzahl ist.", check: (v) => v.z === 0 },
      { id: "zwoelf", text: "Stelle die positive Zahl ein, deren Gegenzahl −12 ist.", check: (v) => v.z === 12 },
    ],
  ),
  exercises: [
    {
      id: "gegenzahl-betrag",
      make: (rng, level) => {
        const z = rng.sign() * rng.int(3, level === 1 ? 30 : 400);
        return task(
          level,
          `Gib zu ${n0(z)} die Gegenzahl und den Betrag an.`,
          `An der Zahlengeraden liegt ${n0(z)}. Eine zweite Zahl liegt im selben Abstand auf der anderen Seite der Null. Wie heißt sie, und wie groß ist ihr Abstand zur Null?`,
          [num("Gegenzahl:", -z, "", 0), num("Betrag:", Math.abs(z), "", 0)],
          "Gegenzahl: Vorzeichen wechseln. Betrag: Abstand zur Null.",
          `Die andere Seite der Null: ${n0(-z)}. Abstand zur Null: ${Math.abs(z)}.`,
          `Gegenzahl ${n0(-z)}, Betrag ${Math.abs(z)}`,
          { z },
        );
      },
    },
    {
      id: "wahr-falsch",
      make: (rng, level) => {
        const z = rng.int(2, 25);
        const items = [
          [`|−${z}| = ${z}`, true],
          [`|−${z}| = −${z}`, false],
          [`Die Gegenzahl von −${z} ist ${z}.`, true],
          [`Der Betrag einer Zahl kann negativ sein.`, false],
          ["Die Null hat kein Vorzeichen.", true],
          ["Jede ganze Zahl ist entweder positiv oder negativ.", false],
        ] as const;
        const [claim, truth] = rng.pick(items);
        if (level === 1)
          return task(
            level,
            `Stimmt diese Aussage über ganze Zahlen? ${claim}`,
            "",
            [pick("Die Aussage ist …", ["wahr", "falsch"], truth ? 0 : 1)],
            "Betrag: Abstand zur Null. Gegenzahl: anderes Vorzeichen.",
            truth ? "Das passt zu den Begriffen." : "Das widerspricht den Begriffen.",
            truth ? "Wahr." : "Falsch.",
            { z },
          );
        const b = rng.int(3, 18);
        return task(
          level,
          "",
          `Wie viele ganze Zahlen haben den Betrag ${b}? Wie weit liegen sie auf der Zahlengeraden auseinander?`,
          [num("Anzahl:", 2, "", 0), num("Abstand:", 2 * b, "", 0, { slips: [{ value: b, hint: "Das ist der Abstand zur Null. Die beiden Zahlen liegen auf verschiedenen Seiten." }] })],
          "Eine liegt links, eine rechts der Null.",
          `${b} und −${b} haben beide den Betrag ${b}. Ihr Abstand ist ${b} + ${b}.`,
          `2 Zahlen, Abstand ${2 * b}`,
          { b },
        );
      },
    },
  ],
});

const zahlengerade = L(3, {
  id: "gz-3-zahlengerade",
  title: "2.3 Die Zahlengerade",
  subtitle: "Ablesen, vergleichen und passend einteilen",
  whyItMatters:
    "Auf der Zahlengeraden wird dir schnell klar, warum −10 kleiner ist als −2, obwohl die 10 größer aussieht.",
  explanationHtml: `<p>Die <strong>Zahlengerade</strong> verlängert den Zahlenstrahl nach links. Rechts von der Null stehen die positiven, links die negativen Zahlen. Auch hier gilt: Weiter rechts bedeutet größer.</p><p>Darum ist bei negativen Zahlen die mit dem größeren Betrag die <strong>kleinere</strong>: −10 &lt; −2. Jede negative Zahl ist kleiner als jede positive. Wie beim Zahlenstrahl klärst du zuerst den Wert eines Teilstrichs und wählst eine <strong>Skalierung</strong>, auf die alle Zahlen passen.</p><div class="example">Ordne −40, 15, −5 und 0: Die Reihenfolge ist −40 &lt; −5 &lt; 0 &lt; 15. Passend ist eine Einteilung mit 5 pro Strich.</div><div class="merke"><strong>Merke:</strong> Rechts ist immer größer. Bei negativen Zahlen gilt: je größer der Betrag, desto kleiner die Zahl.</div>`,
  formulas: [
    { name: "Vergleich", html: "−10 &lt; −2 &lt; 0 &lt; 3", quantities: "Von links nach rechts wird es größer." },
  ],
  quiz: {
    question: "Was ist richtig?",
    options: ["−8 < −3", "−8 > −3", "−3 < −8"],
    correctIndex: 0,
    explanation: "−8 liegt links von −3 und ist daher die kleinere Zahl.",
  },
  lab: lab(
    "integer-line",
    "Zwei Punkte vergleichen",
    "Wähle die Einteilung und ziehe beide Punkte. Unten steht das richtige Vergleichszeichen.",
    [c("scale", "Ein Teilstrich", ["1", "5", "10", "100"]), r("a", "Strich von a", -10, 10, -3), r("b", "Strich von b", -10, 10, 2)],
    [
      o("a", "a", (v) => n0(v.a * [1, 5, 10, 100][v.scale])),
      o("b", "b", (v) => n0(v.b * [1, 5, 10, 100][v.scale])),
      o("abstand", "Abstand", (v) => n0(Math.abs(v.a - v.b) * [1, 5, 10, 100][v.scale])),
    ],
    [
      { id: "beide-negativ", text: "Zeige −40 < −10 mit der Einteilung 10.", check: (v) => v.scale === 2 && v.a === -4 && v.b === -1 },
      { id: "hundert", text: "Zeige −300 < 200 mit der Einteilung 100.", check: (v) => v.scale === 3 && v.a === -3 && v.b === 2 },
      { id: "gleich", text: "Lege beide Punkte auf −25.", check: (v) => v.scale === 1 && v.a === -5 && v.b === -5 },
    ],
  ),
  exercises: [
    {
      id: "ablesen",
      make: (rng, level) => {
        const step = level === 1 ? rng.pick([1, 2, 5]) : rng.pick([25, 50, 100]);
        const k = rng.sign() * rng.int(1, 9);
        const value = k * step;
        return task(
          level,
          `Auf einer Zahlengeraden bedeutet ein Teilstrich ${step}. Ein Punkt liegt ${Math.abs(k)} Striche ${k < 0 ? "links" : "rechts"} von der Null. Welche Zahl ist das?`,
          `Eine Skala für Höhen zeigt 0 m auf Meereshöhe, ein Strich bedeutet ${step} m. ${k < 0 ? "Ein U-Boot" : "Ein Berggipfel"} liegt ${Math.abs(k)} Striche ${k < 0 ? "unter" : "über"} der Null. Welche Höhe ist das?`,
          [num("Zahl:", value, level === 1 ? "" : "m", 0, { slips: [{ value: -value, hint: "Prüfe die Seite: Liegt der Punkt links oder rechts der Null?" }, { value: k, hint: "Du hast nur die Striche gezählt. Multipliziere noch mit dem Wert eines Strichs." }] })],
          "Anzahl der Striche · Wert eines Strichs, Vorzeichen nach der Seite.",
          `${Math.abs(k)} · ${step} = ${Math.abs(value)}, ${k < 0 ? "negativ" : "positiv"}.`,
          `Die Zahl ist ${n0(value)}.`,
          { step, k },
        );
      },
    },
    {
      id: "vergleichen",
      make: (rng, level) => {
        const scale = level === 1 ? 1 : 100;
        const a = -rng.int(2, 12) * scale, b = -rng.int(13, 30) * scale, d = rng.int(1, 9) * scale;
        const smallest = Math.min(a, b, d);
        if (level === 1)
          return task(
            level,
            `Welches Zeichen gehört zwischen ${n0(a)} und ${n0(b)}?`,
            "",
            [pick(`${n0(a)} … ${n0(b)}`, ["<", ">", "="], 1)],
            "Die weiter rechts liegende Zahl ist größer.",
            `${n0(b)} liegt weiter links als ${n0(a)}.`,
            `${n0(a)} > ${n0(b)}`,
            { a, b },
          );
        return task(
          level,
          "",
          `An drei Orten werden die Höhen ${n0(a)} m, ${n0(b)} m und ${n0(d)} m gemessen. Welcher Ort liegt am tiefsten, und wie groß ist der Abstand zum höchsten Ort?`,
          [num("Tiefster Ort:", smallest, "m", 0, { slips: [{ value: a, hint: "Bei negativen Zahlen ist die mit dem größeren Betrag die kleinere." }] }), num("Abstand:", d - b, "m", 0)],
          "Am weitesten links liegt der tiefste Ort.",
          `Von ${n0(b)} bis 0 sind es ${n0(-b)} m, dann noch ${n0(d)} m.`,
          `Tiefster Ort ${n0(b)} m, Abstand ${n0(d - b)} m`,
          { a, b, d },
        );
      },
    },
  ],
});

const addSub = L(4, {
  id: "gz-4-addieren-subtrahieren",
  title: "2.4 Ganze Zahlen addieren und subtrahieren",
  subtitle: "Pfeile auf der Zahlengeraden, Vorzeichenregeln",
  whyItMatters:
    "Kontostände und Temperaturen ändern sich ständig. Mit diesen Regeln rechnest du sicher, auch über die Null hinweg.",
  explanationHtml: `<p>Stell dir die Rechnung als Bewegung vor. <strong>Plus eine positive Zahl:</strong> nach rechts. <strong>Minus eine positive Zahl:</strong> nach links. Eine negative Zahl dreht die Richtung um: <strong>Eine negative Zahl zu subtrahieren ist dasselbe, wie ihre Gegenzahl zu addieren.</strong></p><p>Gleiche Vorzeichen: Beträge addieren, Vorzeichen behalten. Verschiedene Vorzeichen: Beträge subtrahieren, das Vorzeichen der Zahl mit dem größeren Betrag bleibt. Zwei Rechenzeichen schreibst du nicht direkt hintereinander, sondern setzt eine Klammer.</p><div class="example">(−5) + 8 = 3. Und 3 − 7 = −4. Und (−4) − (−6) = (−4) + 6 = 2. Und (−5) + (−3) = −8.</div><div class="merke"><strong>Merke:</strong> + (−3) wirkt wie − 3, und − (−3) wirkt wie + 3.</div>`,
  formulas: [
    { name: "Negative Zahl addieren", html: "a + (−b) = a − b", quantities: "Plus und Minus zusammen wirken wie Minus." },
    { name: "Negative Zahl subtrahieren", html: "a − (−b) = a + b", quantities: "Zweimal Minus wirkt wie Plus." },
  ],
  quiz: {
    question: "Was ergibt 4 − (−3)?",
    options: ["7", "1", "−7"],
    correctIndex: 0,
    explanation: "Die Gegenzahl von −3 ist 3, also 4 + 3 = 7.",
  },
  lab: lab(
    "int-add",
    "Pfeil auf der Zahlengeraden",
    "Stelle Startzahl, Rechenart und zweite Zahl ein. Der Pfeil zeigt, in welche Richtung es geht.",
    [r("a", "Startzahl", -15, 15, 2), c("op", "Rechenart", ["plus", "minus"]), r("b", "Zweite Zahl", -15, 15, 3)],
    [
      o("rechnung", "Rechnung", (v) => `${p0(v.a)} ${v.op === 0 ? "+" : "−"} ${p0(v.b)}`),
      o("ergebnis", "Ergebnis", (v) => n0(v.op === 0 ? v.a + v.b : v.a - v.b)),
    ],
    [
      { id: "ueber-null", text: "Rechne (−5) + 8. Der Pfeil geht über die Null.", check: (v) => v.a === -5 && v.op === 0 && v.b === 8 },
      { id: "unter-null", text: "Rechne 3 − 7. Das Ergebnis ist negativ.", check: (v) => v.a === 3 && v.op === 1 && v.b === 7 },
      { id: "minus-minus", text: "Rechne (−4) − (−6). Der Pfeil zeigt nach rechts.", check: (v) => v.a === -4 && v.op === 1 && v.b === -6 },
    ],
  ),
  exercises: [
    {
      id: "plus-minus",
      make: (rng, level) => {
        const max = level === 1 ? 20 : 300;
        const a = rng.sign() * rng.int(3, max), b = rng.sign() * rng.int(3, max);
        const plus = rng.int(0, 1) === 0;
        const value = plus ? a + b : a - b;
        const shown = `${p0(a)} ${plus ? "+" : "−"} ${p0(b)}`;
        return task(
          level,
          `Berechne die Aufgabe im Kopf oder schriftlich: ${shown}.`,
          `Berechne ohne Taschenrechner: ${shown}. Überlege zuerst, ob das Ergebnis positiv oder negativ wird.`,
          [num("Ergebnis:", value, "", 0, { slips: [{ value: plus ? a - b : a + b, hint: "Achte auf das Vorzeichen in der Klammer: Minus und Minus wirken wie Plus." }, { value: -value, hint: "Der Betrag stimmt, das Vorzeichen nicht." }] })],
          plus ? "+ (−b) wirkt wie − b." : "− (−b) wirkt wie + b.",
          `Schreibe: ${n0(a)} ${(plus ? b : -b) < 0 ? "−" : "+"} ${Math.abs(b)}.`,
          `${shown} = ${n0(value)}`,
          { a, b },
        );
      },
    },
    {
      id: "konto",
      make: (rng, level) => {
        const start = rng.sign() * rng.int(20, 90);
        const deposit = rng.int(10, 80);
        const debit = rng.int(10, 120);
        const value = level === 1 ? start + deposit : start + deposit - debit;
        return task(
          level,
          `Ein Konto steht bei ${n0(start)} €. Es werden ${deposit} € eingezahlt. Wie lautet der neue Kontostand?`,
          `Ein Konto steht bei ${n0(start)} €. Es werden ${deposit} € eingezahlt und dann ${debit} € abgebucht. Wie lautet der neue Kontostand?`,
          [num("Kontostand:", value, "€", 0)],
          "Einzahlung: plus. Abbuchung: minus.",
          level === 1 ? `${n0(start)} + ${deposit} = ${n0(value)}.` : `${n0(start)} + ${deposit} = ${n0(start + deposit)}, dann ${n0(start + deposit)} − ${debit} = ${n0(value)}.`,
          `Der Kontostand ist ${n0(value)} €.`,
          { start, deposit },
        );
      },
    },
  ],
});

const multDiv = L(5, {
  id: "gz-5-multiplizieren-dividieren",
  title: "2.5 Ganze Zahlen multiplizieren und dividieren",
  subtitle: "Gleiche Vorzeichen, verschiedene Vorzeichen",
  whyItMatters:
    "Für Mal und Geteilt gibt es eine einzige kurze Regel. Sie gilt immer, auch später bei den Brüchen.",
  explanationHtml: `<p>Rechne zuerst mit den Beträgen und bestimme dann das Vorzeichen: <strong>Gleiche Vorzeichen ergeben Plus, verschiedene Vorzeichen ergeben Minus.</strong> Das gilt für Multiplikation und Division.</p><p>Warum ist Minus mal Minus Plus? Schau auf die Reihe: (−3) · 2 = −6, (−3) · 1 = −3, (−3) · 0 = 0. Das Ergebnis wird jedes Mal um 3 größer. Also geht es weiter: (−3) · (−1) = 3. Und 0 geteilt durch eine Zahl ist 0, aber durch 0 darfst du nie teilen.</p><div class="example">(−3) · (−4) = 12. Und (−6) · 7 = −42. Und (−24) : 6 = −4. Und (−24) : (−6) = 4.</div><div class="merke"><strong>Merke:</strong> Gleich: plus. Verschieden: minus. Der Rest ist wie bei den natürlichen Zahlen.</div>`,
  formulas: [
    { name: "Vorzeichenregel", html: "(+) · (+) = +, (−) · (−) = +, (+) · (−) = −, (−) · (+) = −", quantities: "Gilt genauso für die Division" },
  ],
  quiz: {
    question: "Was ergibt (−5) · (−6)?",
    options: ["30", "−30", "−11"],
    correctIndex: 0,
    explanation: "Gleiche Vorzeichen ergeben Plus: 5 · 6 = 30.",
  },
  lab: lab(
    "int-mult",
    "Vorzeichentabelle",
    "Stelle zwei Zahlen und die Rechenart ein. Bei der Division wird a · b durch b geteilt, damit es aufgeht.",
    [c("op", "Rechenart", ["mal", "geteilt"]), r("a", "a", -12, 12, 3), r("b", "b", -12, 12, 2)],
    [
      o("rechnung", "Rechnung", (v) => (v.op === 0 ? `${p0(v.a)} · ${p0(v.b)}` : `${p0(v.a * v.b)} : ${p0(v.b)}`)),
      o("ergebnis", "Ergebnis", (v) => (v.op === 0 ? n0(v.a * v.b) : v.b === 0 ? "nicht erlaubt" : n0(v.a))),
    ],
    [
      { id: "minus-mal-minus", text: "Rechne (−3) · (−4).", check: (v) => v.op === 0 && v.a === -3 && v.b === -4 },
      { id: "geteilt", text: "Rechne (−24) : 6.", check: (v) => v.op === 1 && v.a === -4 && v.b === 6 },
      { id: "verschieden", text: "Rechne (−6) · 7.", check: (v) => v.op === 0 && v.a === -6 && v.b === 7 },
    ],
  ),
  exercises: [
    {
      id: "produkt",
      make: (rng, level) => {
        const a = rng.sign() * rng.int(2, level === 1 ? 12 : 25);
        const b = rng.sign() * rng.int(2, level === 1 ? 12 : 25);
        const d = level === 2 ? rng.sign() * rng.int(2, 5) : 1;
        const value = a * b * d;
        return task(
          level,
          `Multipliziere die beiden ganzen Zahlen: ${p0(a)} · ${p0(b)}.`,
          `Berechne: ${p0(a)} · ${p0(b)} · ${p0(d)}. Überlege zuerst, welches Vorzeichen das Ergebnis hat.`,
          [num("Ergebnis:", value, "", 0, { slips: [{ value: -value, hint: "Der Betrag stimmt. Prüfe die Vorzeichen: Gleiche ergeben Plus, verschiedene Minus." }] })],
          "Gleiche Vorzeichen: plus. Verschiedene Vorzeichen: minus.",
          level === 1 ? `${Math.abs(a)} · ${Math.abs(b)} = ${Math.abs(value)}.` : `Beträge: ${Math.abs(a)} · ${Math.abs(b)} · ${Math.abs(d)} = ${Math.abs(value)}. ${[a, b, d].filter((x) => x < 0).length} negative Faktoren.`,
          `Das Ergebnis ist ${n0(value)}.`,
          { a, b, d },
        );
      },
    },
    {
      id: "quotient",
      make: (rng, level) => {
        const q = rng.sign() * rng.int(2, 15), b = rng.sign() * rng.int(2, 12);
        const a = q * b;
        if (level === 1)
          return task(
            level,
            `Dividiere die beiden ganzen Zahlen: ${p0(a)} : ${p0(b)}.`,
            "",
            [num("Ergebnis:", q, "", 0, { slips: [{ value: -q, hint: "Prüfe das Vorzeichen." }] })],
            "Beträge teilen, dann das Vorzeichen bestimmen.",
            `${Math.abs(a)} : ${Math.abs(b)} = ${Math.abs(q)}.`,
            `Das Ergebnis ist ${n0(q)}.`,
            { a, b },
          );
        const days = rng.int(3, 7), perDay = rng.int(2, 9);
        const total = -days * perDay;
        return task(
          level,
          "",
          `Die Temperatur hat sich in ${days} Tagen um insgesamt ${n0(total)} Grad verändert, jeden Tag gleich viel. Um wie viel Grad änderte sie sich pro Tag?`,
          [num("Änderung pro Tag:", -perDay, "Grad", 0, { slips: [{ value: perDay, hint: "Es wurde kälter. Die Änderung ist also negativ." }] })],
          "Gesamtänderung : Anzahl der Tage",
          `${p0(total)} : ${days} = ${n0(-perDay)}.`,
          `Pro Tag ${n0(-perDay)} Grad.`,
          { days, perDay },
        );
      },
    },
  ],
});

const verbindungen = L(6, {
  id: "gz-6-verbindungen",
  title: "2.6 Alle Rechenarten verbinden",
  subtitle: "Rechenregeln, Rechengesetze und Alltagsaufgaben",
  whyItMatters:
    "Jetzt kommt alles zusammen. Die Regeln aus den natürlichen Zahlen gelten unverändert auch hier.",
  explanationHtml: `<p>Auch bei ganzen Zahlen gilt: <strong>Klammer vor Potenz vor Punkt vor Strich</strong>, sonst von links nach rechts. Die Rechengesetze helfen zusätzlich beim <strong>vorteilhaften Rechnen</strong>: Vertausche die Summanden so, dass sich Zahlen und ihre Gegenzahlen aufheben.</p><p>Eine Differenz kannst du als Summe schreiben: a − b = a + (−b). Dann darfst du wieder vertauschen. Bei Alltagsaufgaben übersetzt du die Geschichte zuerst in eine Rechnung.</p><div class="example">(−5) + 3 · (−2) = (−5) + (−6) = −11. Vorteilhaft: 17 + (−38) + (−17) = 17 + (−17) + (−38) = 0 + (−38) = −38. Mit Distributivgesetz: (−7) · 12 + (−7) · 8 = (−7) · 20 = −140.</div><div class="merke"><strong>Merke:</strong> Erst die Reihenfolge klären, dann für jede Rechnung das Vorzeichen bestimmen.</div>`,
  formulas: [
    { name: "Differenz als Summe", html: "a − b = a + (−b)", quantities: "Dann gelten Vertauschen und Verbinden." },
    { name: "Reihenfolge", html: "( ) → Potenz → · und : → + und −", quantities: "Wie bei den natürlichen Zahlen" },
  ],
  quiz: {
    question: "Was ergibt (−2) + 3 · (−4)?",
    options: ["−14", "4", "−20"],
    correctIndex: 0,
    explanation: "Punkt vor Strich: 3 · (−4) = −12. Dann (−2) + (−12) = −14.",
  },
  lab: lab(
    "int-mixed",
    "Schritte mit ganzen Zahlen",
    "Wähle einen Term und drei Zahlen. Die Zeilen zeigen die Rechnung in der richtigen Reihenfolge.",
    [c("term", "Term", ["a + b · d", "(a + b) · d", "a − b · d"]), r("a", "a", -20, 20, 2), r("b", "b", -9, 9, 1), r("d", "d", -9, 9, 1)],
    [o("wert", "Wert", (v) => n0(intTermSteps(v.term, v.a, v.b, v.d).value))],
    [
      { id: "erste", text: "Rechne (−5) + 3 · (−2).", check: (v) => v.term === 0 && v.a === -5 && v.b === 3 && v.d === -2 },
      { id: "klammer", text: "Rechne ((−4) + 1) · (−3).", check: (v) => v.term === 1 && v.a === -4 && v.b === 1 && v.d === -3 },
      { id: "minus", text: "Rechne (−2) − (−3) · (−4).", check: (v) => v.term === 2 && v.a === -2 && v.b === -3 && v.d === -4 },
    ],
  ),
  exercises: [
    {
      id: "gemischt",
      make: (rng, level) => {
        const a = rng.sign() * rng.int(2, 15), b = rng.sign() * rng.int(2, 9), d = rng.sign() * rng.int(2, 9);
        const term = level === 1 ? 0 : rng.int(1, 2);
        const t = intTermSteps(term, a, b, d);
        const slip = term === 0 ? (a + b) * d : term === 1 ? a + b * d : (a - b) * d;
        return task(
          level,
          `Berechne in der richtigen Reihenfolge: ${t.text}.`,
          `Berechne: ${t.text}. Erst die Reihenfolge klären, dann die Vorzeichen.`,
          [num("Wert:", t.value, "", 0, { slips: [{ value: slip, hint: term === 1 ? "Die Klammer musst du zuerst ausrechnen." : "Punkt geht vor Strich." }] })],
          "Klammer, Punkt, Strich",
          `${t.text} = ${t.steps.join(" = ")}.`,
          `Der Wert ist ${n0(t.value)}.`,
          { a, b, d },
        );
      },
    },
    {
      id: "vorteilhaft-alltag",
      make: (rng, level) => {
        const a = rng.int(11, 49), b = rng.int(11, 49);
        if (level === 1) {
          const value = -b;
          return task(
            level,
            `Rechne vorteilhaft: ${a} + ${p0(-b)} + ${p0(-a)}.`,
            "",
            [num("Wert:", value, "", 0)],
            "Eine Zahl und ihre Gegenzahl ergeben zusammen 0.",
            `${a} + ${p0(-a)} = 0. Übrig bleibt ${p0(-b)}.`,
            `Der Wert ist ${n0(value)}.`,
            { a, b },
          );
        }
        const games = rng.int(3, 6), wins = rng.int(2, 3), lose = rng.int(2, 4);
        const points = wins * 3 - lose * 2 * games;
        return task(
          level,
          "",
          `In einem Spiel gibt es für jedes richtige Rätsel 3 Punkte. In jeder der ${games} Runden gibt es außerdem ${lose} Strafen mit je ${p0(-2)} Punkten. Du löst ${wins} Rätsel. Wie viele Punkte hast du am Ende?`,
          [num("Punkte:", points, "", 0)],
          "Rätselpunkte plus Strafpunkte aller Runden.",
          `${wins} · 3 + ${games} · ${lose} · ${p0(-2)} = ${wins * 3} + ${p0(-lose * 2 * games)}.`,
          `Du hast ${n0(points)} Punkte.`,
          { games, wins, lose },
        );
      },
    },
  ],
});

export const STAGE_GANZ = makeStage(
  2,
  "Zahlen unter der Null, Betrag, Vorzeichenregeln und gemischte Rechnungen",
  "#dc2626",
  "🌡️",
  [negativeZahlen, begriffe, zahlengerade, addSub, multDiv, verbindungen],
);
