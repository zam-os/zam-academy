import { fmt } from "../exercises/format";
import {
  LADDERS_GZH,
  LADDERS_LM,
  MEASURE_OBJECTS,
  MEASURE_UNITS,
  PACK_SIZES,
  rung,
  toMetres,
} from "../lab/views-groessen";
import { convert, LENGTH, MASS, TIME, VOLUME } from "../models";
import {
  choice as c,
  lab,
  makeLesson,
  output as o,
  range as r,
  task,
} from "./builders";
import { numberField as num, choiceField as pick } from "./helpers";

const n0 = (value: number) => fmt(value, 0);
const L = (step: number, content: Parameters<typeof makeLesson>[3]) =>
  makeLesson(5, step, null, content);

const masszahl = L(1, {
  id: "gr-1-masszahl-schaetzen",
  title: "5.1 Maßzahl, Maßeinheit und Schätzen",
  subtitle: "Passende Einheiten wählen und Größen einschätzen",
  whyItMatters:
    "„Der Tisch ist 2 lang“ sagt nichts. Erst mit der Einheit wird daraus eine Größe, und mit etwas Gefühl erkennst du Unsinn sofort.",
  explanationHtml: `<p>Eine <strong>Größe</strong> besteht aus <strong>Maßzahl</strong> und <strong>Maßeinheit</strong>: In 75 cm ist 75 die Maßzahl und cm die Maßeinheit. Dieselbe Länge kannst du verschieden schreiben: 75 cm = 750 mm. Die Maßzahl ändert sich mit der Einheit, die Länge nicht.</p><p>Wähle die Einheit passend zur Situation: Den Weg nach Hamburg misst du in km, ein Heft in cm, eine Tablette in mg. <strong>Schätzen</strong> geht mit Vergleichsgrößen: Eine Tür ist etwa 2 m hoch, ein Daumen etwa 2 cm breit, ein Liter Wasser wiegt etwa 1 kg, eine Tafel Schokolade 100 g.</p><div class="example">Wie hoch ist ein Bus? Etwa eineinhalb Türen, also rund 3 m. Eine Angabe wie 300 m oder 30 cm kann nicht stimmen.</div><div class="merke"><strong>Merke:</strong> Größe = Maßzahl · Maßeinheit. Schätze mit Dingen, die du kennst.</div>`,
  formulas: [
    {
      name: "Größe",
      html: "75 cm = 75 · 1 cm",
      quantities: "75 Maßzahl, cm Maßeinheit",
    },
    {
      name: "Vergleichsgrößen",
      html: "Tür etwa 2 m, Daumen etwa 2 cm, 1 Liter Wasser etwa 1 kg",
      quantities: "Damit schätzt du.",
    },
  ],
  quiz: {
    question: "Welche Einheit passt am besten für die Masse eines Apfels?",
    options: ["Gramm", "Tonne", "Milligramm"],
    correctIndex: 0,
    explanation:
      "Ein Apfel wiegt etwa 150 g. In Tonnen oder Milligramm wäre die Zahl sehr unhandlich.",
  },
  lab: lab(
    "measure-sense",
    "Größen einschätzen",
    "Wähle einen Gegenstand, eine Maßzahl und eine Einheit. Der grüne Bereich zeigt, was passt.",
    [
      c(
        "object",
        "Gegenstand",
        MEASURE_OBJECTS.map((m) => m.name),
      ),
      r("value", "Maßzahl", 1, 1000, 5),
      c("unit", "Einheit", MEASURE_UNITS, 2),
    ],
    [
      o(
        "groesse",
        "Deine Angabe",
        (v) => `${n0(v.value)} ${MEASURE_UNITS[v.unit]}`,
      ),
      o("urteil", "Urteil", (v) => {
        const m = toMetres(v.value, v.unit);
        const t = MEASURE_OBJECTS[v.object];
        return m >= t.low && m <= t.high
          ? "passt"
          : m > t.high
            ? "viel zu groß"
            : "viel zu klein";
      }),
    ],
    [
      {
        id: "stift",
        text: "Gib die Länge eines Bleistifts passend an.",
        check: (v) =>
          v.object === 0 &&
          toMetres(v.value, v.unit) >= 0.1 &&
          toMetres(v.value, v.unit) <= 0.25,
      },
      {
        id: "tuer",
        text: "Gib die Höhe einer Tür passend an.",
        check: (v) =>
          v.object === 1 &&
          toMetres(v.value, v.unit) >= 1.8 &&
          toMetres(v.value, v.unit) <= 2.5,
      },
      {
        id: "weg",
        text: "Gib den Weg von München nach Nürnberg passend an.",
        check: (v) =>
          v.object === 2 &&
          toMetres(v.value, v.unit) >= 150000 &&
          toMetres(v.value, v.unit) <= 200000,
      },
    ],
  ),
  exercises: [
    {
      id: "einheit-waehlen",
      make: (rng, level) => {
        const items = [
          ["die Länge eines Fußballfelds", "m", ["mm", "km"]],
          ["die Dicke einer Münze", "mm", ["m", "km"]],
          ["die Masse eines Lastwagens", "t", ["g", "mg"]],
          ["die Masse einer Tafel Schokolade", "g", ["t", "mg"]],
          ["die Dauer eines Films", "min", ["s", "d"]],
          ["die Füllmenge einer Badewanne", "l", ["ml", "cm"]],
        ] as const;
        const [text, unit, others] = rng.pick(items);
        const amounts = rng.pick([
          [
            "Ein Kind ist etwa 1,4 m groß. Wie viele Zentimeter sind das?",
            140,
            "cm",
          ],
          [
            "Eine Tür ist etwa 2 m hoch. Wie viele Zentimeter sind das?",
            200,
            "cm",
          ],
          [
            "Ein Liter Wasser wiegt etwa 1 kg. Wie viele Gramm wiegen 3 Liter?",
            3000,
            "g",
          ],
        ] as const);
        return task(
          level,
          `Welche Einheit passt am besten für ${text}?`,
          amounts[0],
          level === 1
            ? [pick("Einheit:", [unit, ...others], 0)]
            : [num("Maßzahl:", amounts[1], amounts[2], 0)],
          "Stelle dir die Sache vor: Die Maßzahl soll weder winzig noch riesig sein.",
          level === 1
            ? `Für ${text} ist ${unit} handlich.`
            : "Rechne über die Vergleichsgröße um.",
          level === 1
            ? `Am besten passt ${unit}.`
            : `${n0(amounts[1])} ${amounts[2]}`,
          {},
        );
      },
    },
    {
      id: "schaetzen",
      make: (rng, level) => {
        const items = [
          [
            "Wie hoch ist ein Klassenzimmer?",
            "etwa 3 m",
            ["etwa 30 m", "etwa 30 cm"],
          ],
          [
            "Wie schwer ist ein Fahrrad?",
            "etwa 15 kg",
            ["etwa 150 kg", "etwa 15 g"],
          ],
          ["Wie lang dauert eine Schulstunde?", "45 min", ["45 s", "45 h"]],
          [
            "Wie viel passt in einen Trinkbecher?",
            "etwa 200 ml",
            ["etwa 200 l", "etwa 2 ml"],
          ],
          [
            "Wie lang ist ein Schulweg zu Fuß meistens?",
            "etwa 1 km",
            ["etwa 1 mm", "etwa 1.000 km"],
          ],
        ] as const;
        const [question, right, wrong] = rng.pick(items);
        const size = rng.int(3, 6);
        return task(
          level,
          `${question} Wähle die sinnvolle Angabe.`,
          `Eine Tür ist etwa 2 m hoch. Ein Haus ist etwa ${size}-mal so hoch wie die Tür. Schätze die Höhe des Hauses.`,
          level === 1
            ? [pick("Antwort:", [right, ...wrong], 0)]
            : [num("Höhe:", 2 * size, "m", 0)],
          "Vergleiche mit Dingen, die du kennst.",
          level === 1
            ? "Die anderen Angaben passen nicht zur Wirklichkeit."
            : `${size} · 2 m.`,
          level === 1 ? right : `Etwa ${2 * size} m`,
          { size },
        );
      },
    },
  ],
});

const laengeMasse = L(2, {
  id: "gr-2-laenge-masse",
  title: "5.2 Länge und Masse umrechnen",
  subtitle: "mm, cm, dm, m, km und mg, g, kg, t",
  whyItMatters:
    "Eine Tür misst 2 m oder 200 cm. Wer sicher umrechnet, kann Größen vergleichen und addieren.",
  explanationHtml: `<p><strong>Längen:</strong> 1 km = 1.000 m, 1 m = 10 dm, 1 dm = 10 cm, 1 cm = 10 mm. Also auch 1 m = 100 cm = 1.000 mm. <strong>Massen:</strong> 1 t = 1.000 kg, 1 kg = 1.000 g, 1 g = 1.000 mg.</p><p>Beim Umrechnen in eine <strong>kleinere</strong> Einheit wird die Maßzahl größer: Du multiplizierst. Beim Umrechnen in eine <strong>größere</strong> Einheit wird sie kleiner: Du dividierst. Zum Vergleichen oder Addieren rechnest du erst in die gleiche Einheit um.</p><div class="example">3 km 45 m = 3.000 m + 45 m = 3.045 m. Und 2.500 g = 2 kg 500 g. Und 750 g + 2 kg = 750 g + 2.000 g = 2.750 g.</div><div class="merke"><strong>Merke:</strong> Kleinere Einheit: größere Maßzahl. Länge meist Schritte mit 10, Masse immer mit 1.000.</div>`,
  formulas: [
    {
      name: "Längen",
      html: "1 km = 1.000 m, 1 m = 10 dm = 100 cm = 1.000 mm",
      quantities: "Zwischen m und km ist die Umrechnungszahl 1.000.",
    },
    {
      name: "Massen",
      html: "1 t = 1.000 kg, 1 kg = 1.000 g, 1 g = 1.000 mg",
      quantities: "Immer die Umrechnungszahl 1.000",
    },
  ],
  quiz: {
    question: "Wie viele Gramm sind 3 kg?",
    options: ["3.000 g", "300 g", "30 g"],
    correctIndex: 0,
    explanation: "1 kg = 1.000 g, also 3 · 1.000 g.",
  },
  lab: lab(
    "ladder-length-mass",
    "Einheitenleiter",
    "Wähle Länge oder Masse, Maßzahl und zwei Einheiten. Die Leiter zeigt die Umrechnungszahlen.",
    [
      c("kind", "Größe", ["Länge", "Masse"]),
      r("amount", "Maßzahl", 1, 5000, 2),
      r("from", "Von Einheit Nummer", 0, 4, 1),
      r("to", "Nach Einheit Nummer", 0, 4, 0),
    ],
    [
      o(
        "von",
        "Von",
        (v) => LADDERS_LM[v.kind].units[rung(LADDERS_LM[v.kind], v.from)],
      ),
      o(
        "nach",
        "Nach",
        (v) => LADDERS_LM[v.kind].units[rung(LADDERS_LM[v.kind], v.to)],
      ),
      o("wert", "Ergebnis", (v) =>
        fmt(
          convert(
            LADDERS_LM[v.kind],
            v.amount,
            rung(LADDERS_LM[v.kind], v.from),
            rung(LADDERS_LM[v.kind], v.to),
          ),
          12,
        ),
      ),
    ],
    [
      {
        id: "kilometer",
        text: "Rechne 3 km in m um.",
        check: (v) =>
          v.kind === 0 &&
          v.amount === 3 &&
          rung(LENGTH, v.from) === 4 &&
          rung(LENGTH, v.to) === 3,
      },
      {
        id: "gramm",
        text: "Rechne 2.500 g in kg um.",
        check: (v) =>
          v.kind === 1 &&
          v.amount === 2500 &&
          rung(MASS, v.from) === 1 &&
          rung(MASS, v.to) === 2,
      },
      {
        id: "tonne",
        text: "Rechne 4 t in kg um.",
        check: (v) =>
          v.kind === 1 &&
          v.amount === 4 &&
          rung(MASS, v.from) === 3 &&
          rung(MASS, v.to) === 2,
      },
    ],
  ),
  exercises: [
    {
      id: "umrechnen",
      make: (rng, level) => {
        const mass = rng.int(0, 1) === 0;
        const ladder = mass ? MASS : LENGTH;
        const from = rng.int(1, ladder.units.length - 1);
        const to = rng.int(Math.max(0, from - 2), from - 1);
        const amount = level === 1 ? rng.int(2, 9) : rng.int(11, 99);
        const value = convert(ladder, amount, from, to);
        return task(
          level,
          `Rechne in die andere Einheit um: ${amount} ${ladder.units[from]} in ${ladder.units[to]}.`,
          `Ein Datenblatt nennt ${amount} ${ladder.units[from]}. Das Programm braucht die Angabe in ${ladder.units[to]}. Welche Zahl gibst du ein?`,
          [
            num("Ergebnis:", value, ladder.units[to], 0, {
              slips: [
                {
                  value: convert(ladder, amount, to, from),
                  hint: "Zur kleineren Einheit wird die Maßzahl größer.",
                },
              ],
            }),
          ],
          "Zur kleineren Einheit: multiplizieren.",
          `Multipliziere ${amount} mit den Umrechnungszahlen von ${ladder.units[from]} bis ${ladder.units[to]}.`,
          `${amount} ${ladder.units[from]} = ${n0(value)} ${ladder.units[to]}`,
          { amount },
        );
      },
    },
    {
      id: "gemischt",
      make: (rng, level) => {
        const kg = rng.int(1, 9),
          g = rng.int(1, 9) * 50;
        const km = rng.int(1, 9),
          m = rng.int(1, 9) * 100;
        if (level === 1)
          return task(
            level,
            `Schreibe die Länge ${km} km ${m} m nur in Metern.`,
            "",
            [
              num("Länge:", km * 1000 + m, "m", 0, {
                slips: [
                  {
                    value: km * 100 + m,
                    hint: "1 km sind 1.000 m, nicht 100 m.",
                  },
                ],
              }),
            ],
            "1 km = 1.000 m",
            `${km} · 1.000 m + ${m} m.`,
            `${n0(km * 1000 + m)} m`,
            { km, m },
          );
        const bags = rng.int(2, 6);
        const total = bags * (kg * 1000 + g);
        return task(
          level,
          "",
          `Ein Sack Erde wiegt ${kg} kg ${g} g. Wie schwer sind ${bags} Säcke zusammen? Gib das Ergebnis in Gramm an.`,
          [num("Masse:", total, "g", 0)],
          "Erst in Gramm umrechnen, dann multiplizieren.",
          `${kg} kg ${g} g = ${n0(kg * 1000 + g)} g, dann ${bags} · ${n0(kg * 1000 + g)} g.`,
          `${n0(total)} g`,
          { kg, g, bags },
        );
      },
    },
  ],
});

const geldZeit = L(3, {
  id: "gr-3-geld-zeit-hohlmass",
  title: "5.3 Geld, Zeit und Hohlmaße umrechnen",
  subtitle: "ct und €, s bis d, ml und l",
  whyItMatters:
    "Beim Einkaufen, beim Blick auf den Busfahrplan und beim Kochen rechnest du ständig mit diesen Einheiten.",
  explanationHtml: `<p><strong>Geld:</strong> 1 € = 100 ct. <strong>Hohlmaße:</strong> 1 l = 1.000 ml.</p><p><strong>Zeit:</strong> 1 d = 24 h, 1 h = 60 min, 1 min = 60 s. Hier gibt es keine Zehnerschritte! 1 h 30 min ist darum nicht 1,3 h. Dazu kommen 1 Woche = 7 Tage und 1 Jahr = 12 Monate und 365 Tage (im Schaltjahr 366). Monate haben je nach Monat 28, 29, 30 oder 31 Tage; rechne Monate nie pauschal mit 30 Tagen um.</p><p>Eine <strong>Zeitspanne</strong> rechnest du am besten in Schritten über volle Stunden.</p><div class="example">2 h 15 min = 120 min + 15 min = 135 min. Der Zug fährt um 8:47 Uhr ab und kommt um 10:12 Uhr an: bis 9:00 Uhr sind es 13 min, bis 10:00 Uhr noch 60 min, bis 10:12 Uhr noch 12 min, zusammen 85 min = 1 h 25 min.</div><div class="merke"><strong>Merke:</strong> Geld: 100. Hohlmaß: 1.000. Zeit: 60, 60 und 24.</div>`,
  formulas: [
    { name: "Geld", html: "1 € = 100 ct", quantities: "ct Cent" },
    {
      name: "Zeit",
      html: "1 d = 24 h, 1 h = 60 min, 1 min = 60 s",
      quantities: "d Tag, h Stunde, min Minute, s Sekunde",
    },
    {
      name: "Hohlmaße",
      html: "1 l = 1.000 ml",
      quantities: "l Liter, ml Milliliter",
    },
  ],
  quiz: {
    question: "Wie viele Minuten sind 2 h 15 min?",
    options: ["135 min", "215 min", "35 min"],
    correctIndex: 0,
    explanation: "1 h = 60 min, also 2 · 60 min + 15 min = 135 min.",
  },
  lab: lab(
    "ladder-money-time",
    "Noch mehr Leitern",
    "Wähle Geld, Zeit oder Hohlmaß. Achte auf die Umrechnungszahlen bei der Zeit.",
    [
      c("kind", "Größe", ["Geld", "Zeit", "Hohlmaß"]),
      r("amount", "Maßzahl", 1, 5000, 3),
      r("from", "Von Einheit Nummer", 0, 3, 0),
      r("to", "Nach Einheit Nummer", 0, 3, 1),
    ],
    [
      o(
        "von",
        "Von",
        (v) => LADDERS_GZH[v.kind].units[rung(LADDERS_GZH[v.kind], v.from)],
      ),
      o(
        "nach",
        "Nach",
        (v) => LADDERS_GZH[v.kind].units[rung(LADDERS_GZH[v.kind], v.to)],
      ),
      o("wert", "Ergebnis", (v) =>
        fmt(
          convert(
            LADDERS_GZH[v.kind],
            v.amount,
            rung(LADDERS_GZH[v.kind], v.from),
            rung(LADDERS_GZH[v.kind], v.to),
          ),
          8,
        ),
      ),
    ],
    [
      {
        id: "stunden",
        text: "Rechne 2 h in min um.",
        check: (v) =>
          v.kind === 1 &&
          v.amount === 2 &&
          rung(TIME, v.from) === 2 &&
          rung(TIME, v.to) === 1,
      },
      {
        id: "euro",
        text: "Rechne 5 € in ct um.",
        check: (v) =>
          v.kind === 0 && v.amount === 5 && v.from >= 1 && v.to === 0,
      },
      {
        id: "liter",
        text: "Rechne 2 l in ml um.",
        check: (v) =>
          v.kind === 2 &&
          v.amount === 2 &&
          rung(VOLUME, v.from) === 1 &&
          rung(VOLUME, v.to) === 0,
      },
    ],
  ),
  exercises: [
    {
      id: "zeitspanne",
      make: (rng, level) => {
        const startH = rng.int(7, 15),
          startM = rng.int(1, 11) * 5;
        const len = level === 1 ? rng.int(2, 11) * 5 : rng.int(13, 35) * 5;
        const endTotal = startH * 60 + startM + len;
        const endH = Math.floor(endTotal / 60),
          endM = endTotal % 60;
        const pad = (m: number) => String(m).padStart(2, "0");
        return task(
          level,
          `Ein Film beginnt um ${startH}:${pad(startM)} Uhr und endet um ${endH}:${pad(endM)} Uhr. Wie viele Minuten dauert er?`,
          `Der Bus fährt um ${startH}:${pad(startM)} Uhr ab und kommt um ${endH}:${pad(endM)} Uhr an. Wie lange dauert die Fahrt in Minuten?`,
          [
            num("Dauer:", len, "min", 0, {
              slips: [
                {
                  value: (endH - startH) * 100 + endM - startM,
                  hint: "Eine Stunde hat 60 Minuten, nicht 100.",
                },
              ],
            }),
          ],
          endH === startH
            ? "Beide Zeiten liegen in derselben Stunde: Ziehe die Minuten ab."
            : "Rechne in Schritten über die volle Stunde.",
          endH === startH
            ? `${endM} − ${startM} = ${len}, denn beide Zeiten liegen in derselben Stunde.`
            : `Von ${startH}:${pad(startM)} bis ${startH + 1}:00 sind es ${60 - startM} min.${endH > startH + 1 ? ` Bis ${endH}:00 kommen ${(endH - startH - 1) * 60} min dazu.` : ""}${endM > 0 ? ` Bis ${endH}:${pad(endM)} kommen ${endM} min dazu.` : ""}`,
          `Die Dauer ist ${len} min.`,
          { len },
        );
      },
    },
    {
      id: "geld-hohlmass",
      make: (rng, level) => {
        const euro = rng.int(2, 19),
          ct = rng.int(1, 19) * 5;
        if (level === 1) {
          const amount = euro * 100 + ct;
          return task(
            level,
            `Wie viele Cent sind zusammen ${euro} € ${ct} ct?`,
            "",
            [num("Betrag:", amount, "ct", 0)],
            "1 € = 100 ct",
            `${euro} · 100 ct + ${ct} ct.`,
            `${n0(amount)} ct`,
            { euro, ct },
          );
        }
        const bottle = rng.pick([250, 500, 750]);
        const liters = rng.int(3, 15);
        const count = (liters * 1000) / bottle;
        const whole = Math.floor(count);
        return task(
          level,
          "",
          `Ein Kanister enthält ${liters} l Saft. Der Saft wird in Flaschen mit je ${bottle} ml gefüllt. Wie viele volle Flaschen entstehen?`,
          [
            num("Flaschen:", whole, "", 0, {
              slips: [
                {
                  value: Math.floor(liters / bottle),
                  hint: "Rechne erst die Liter in Milliliter um.",
                },
              ],
            }),
          ],
          "Erst in ml umrechnen, dann teilen.",
          `${liters} l = ${n0(liters * 1000)} ml. ${n0(liters * 1000)} : ${bottle} ${count === whole ? "=" : "≈"} ${fmt(count, 3)}${count !== whole ? ", davon zählen nur die vollen Flaschen" : ""}.`,
          `${whole} volle Flaschen`,
          { liters, bottle },
        );
      },
    },
  ],
});

const sachaufgaben = L(4, {
  id: "gr-7-sachaufgaben",
  title: "5.4 Sachaufgaben mit Größen",
  subtitle: "Informationen aus Texten, Bildern und Tabellen nutzen",
  whyItMatters:
    "Im echten Leben stehen die Zahlen nicht fertig in einer Aufgabe. Du musst sie selbst finden, auswählen und ordnen.",
  explanationHtml: `<p>Bei Sachaufgaben aus dem Alltag musst du die <strong>wichtigen Angaben selbst heraussuchen</strong>: aus einem Text, einem Bild, einem Fahrplan oder einer Preistabelle. Manche Angaben brauchst du nicht, andere musst du dir überlegen.</p><p><strong>Mathematisch modellieren</strong> heißt: Du übersetzt die Situation in eine Rechnung, rechnest und prüfst, ob das Ergebnis zur Sache passt. Oft muss am Ende sinnvoll <strong>gerundet</strong> werden: Packungen gibt es nur ganz.</p><div class="example">25 Kinder essen je 2 Brötchen. Brötchen gibt es zu je 10 Stück. Bedarf: 25 · 2 = 50. Das sind genau 5 Packungen. Bei 26 Kindern wären es 52 Brötchen, also 6 Packungen, und 8 Brötchen bleiben übrig.</div><div class="merke"><strong>Merke:</strong> Angaben auswählen, Einheiten angleichen, rechnen, Ergebnis zur Sache prüfen. Oft wird aufgerundet.</div>`,
  formulas: [
    {
      name: "Vorgehen",
      html: "auswählen → angleichen → rechnen → prüfen",
      quantities: "Die Einheiten müssen zusammenpassen.",
    },
  ],
  quiz: {
    question:
      "Du brauchst 34 Eier. Eier gibt es zu je 6 Stück. Wie viele Packungen kaufst du?",
    options: ["6", "5", "7"],
    correctIndex: 0,
    explanation:
      "34 : 6 = 5 Rest 4. Für die restlichen 4 Eier brauchst du eine weitere Packung.",
  },
  lab: lab(
    "shopping",
    "Einkauf für das Klassenfest",
    "Stelle die Zahl der Kinder, die Brötchen pro Kind und die Packungsgröße ein. Du siehst Packungen und Rest.",
    [
      r("k", "Kinder", 2, 30, 10),
      r("s", "Brötchen pro Kind", 1, 4, 1),
      c(
        "pack",
        "Packung",
        PACK_SIZES.map((p) => `${p} Stück`),
      ),
    ],
    [
      o("bedarf", "Bedarf", (v) => v.k * v.s),
      o("packungen", "Packungen", (v) =>
        Math.ceil((v.k * v.s) / PACK_SIZES[v.pack]),
      ),
      o(
        "rest",
        "Übrig",
        (v) =>
          Math.ceil((v.k * v.s) / PACK_SIZES[v.pack]) * PACK_SIZES[v.pack] -
          v.k * v.s,
      ),
    ],
    [
      {
        id: "aufgehen",
        text: "Finde eine Einstellung mit Achterpackungen, bei der nichts übrig bleibt und über 20 Brötchen gebraucht werden.",
        check: (v) => v.pack === 1 && v.k * v.s > 20 && (v.k * v.s) % 8 === 0,
      },
      {
        id: "fuenf",
        text: "Stelle das Beispiel ein: 25 Kinder, 2 Brötchen, Zehnerpackung.",
        check: (v) => v.k === 25 && v.s === 2 && v.pack === 2,
      },
      {
        id: "rest",
        text: "Erreiche, dass mit Zehnerpackungen genau 7 Brötchen übrig bleiben.",
        check: (v) => v.pack === 2 && (10 - ((v.k * v.s) % 10)) % 10 === 7,
      },
    ],
  ),
  exercises: [
    {
      id: "packungen",
      make: (rng, level) => {
        const kids = rng.int(14, 32),
          each = rng.int(1, 3),
          size = rng.pick([6, 8, 10, 12]);
        const need = kids * each;
        const packs = Math.ceil(need / size);
        const price = rng.int(2, 6);
        return task(
          level,
          `${kids} Kinder bekommen je ${each} Müsliriegel. Riegel gibt es in Packungen zu ${size} Stück. Wie viele Packungen braucht ihr?`,
          `Für einen Wandertag bekommen ${kids} Kinder je ${each} Müsliriegel. Eine Packung mit ${size} Riegeln kostet ${price} €. Wie viel kostet der Einkauf?`,
          [
            num(
              level === 1 ? "Packungen:" : "Kosten:",
              level === 1 ? packs : packs * price,
              level === 1 ? "" : "€",
              0,
              {
                slips:
                  need % size
                    ? [
                        {
                          value:
                            level === 1
                              ? Math.floor(need / size)
                              : Math.floor(need / size) * price,
                          hint: "Dann reichen die Riegel nicht. Hier musst du aufrunden.",
                        },
                      ]
                    : [],
              },
            ),
          ],
          "Bedarf : Packungsgröße, dann aufrunden",
          `${kids} · ${each} = ${need}. ${need} : ${size} ergibt ${packs} Packungen${level === 2 ? `. ${packs} · ${price} € = ${packs * price} €` : ""}.`,
          level === 1 ? `${packs} Packungen` : `${packs * price} €`,
          { kids, each, size },
        );
      },
    },
    {
      id: "tabelle",
      make: (rng, level) => {
        const adult = rng.int(6, 14),
          child = rng.int(2, 5),
          adults = rng.int(1, 3),
          kids = rng.int(2, 5);
        const cost = adults * adult + kids * child;
        const grownUps = `${adults} ${adults === 1 ? "Erwachsener" : "Erwachsene"}`;
        const paid = (Math.floor(cost / 10) + 1) * 10;
        return task(
          level,
          `Preise im Schwimmbad: Erwachsene ${adult} €, Kinder ${child} €, Parken 2 €. Wie viel zahlen ${grownUps} und ${kids} Kinder für den Eintritt? Parken zählt nicht.`,
          `Preise im Schwimmbad: Erwachsene ${adult} €, Kinder ${child} €, Bademantel 8 €. ${grownUps} und ${kids} Kinder gehen hinein und geben an der Kasse ${paid} €. Wie viel Geld bekommen sie zurück?`,
          [
            num(
              level === 1 ? "Eintritt:" : "Rückgeld:",
              level === 1 ? cost : paid - cost,
              "€",
              0,
            ),
          ],
          "Nimm nur die Angaben, die du wirklich brauchst.",
          `${adults} · ${adult} + ${kids} · ${child} = ${cost}.${level === 2 ? ` ${paid} − ${cost} = ${paid - cost}.` : ""}`,
          level === 1 ? `${cost} €` : `${paid - cost} € zurück`,
          { adult, child },
        );
      },
    },
  ],
});

export const LESSONS = [masszahl, laengeMasse, geldZeit, sachaufgaben];
