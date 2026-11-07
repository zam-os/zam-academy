import { fmt } from "../exercises/format";
import { clean, roundSchool } from "../models";
import { fillHeight } from "../lab/views-proportion";
import { choiceField as pick, numberField as num, yesNo } from "./helpers";
import {
  choice as c,
  lab,
  makeLesson,
  makeStage,
  output as o,
  range as r,
  task,
} from "./builders";

const L = (step: number, content: Parameters<typeof makeLesson>[2]) =>
  makeLesson(6, step, content);

const VESSELS = ["gerade Röhre", "unten weit, oben eng", "unten eng, oben weit"];

const zuordnungen = L(1, {
  id: "dp-1-zuordnungen",
  title: "6.1 Zuordnungen und Füllgraphen",
  subtitle: "Zusammenhänge in Tabelle und Graph lesen",
  whyItMatters:
    "Wie schnell steigt das Wasser in der Vase? Welche Temperatur hat es um 14 Uhr? Zuordnungen beschreiben solche Zusammenhänge im Alltag.",
  explanationHtml: `<p>Eine <strong>Zuordnung</strong> ordnet einer Größe eine andere zu: der Zeit eine Temperatur, einer Menge einen Preis. Du kannst sie als <strong>Tabelle</strong> oder als <strong>Graph</strong> darstellen. Auf der Rechtsachse steht die Ausgangsgröße, auf der Hochachse die zugeordnete Größe.</p><p>Ein <strong>Füllgraph</strong> zeigt, wie hoch das Wasser nach einer bestimmten Zeit steht, wenn gleichmäßig Wasser einläuft. In einem weiten Gefäßteil steigt das Wasser langsam, der Graph ist flach. In einem engen Teil steigt es schnell, der Graph ist steil.</p><div class="example">Ein Gefäß ist unten weit und oben eng. Der Graph steigt zunächst flach und ab dem Knick steil. Der Knick zeigt die Stelle, an der sich die Breite des Gefäßes ändert.</div><div class="merke"><strong>Merke:</strong> Flach bedeutet langsame Änderung, steil bedeutet schnelle Änderung, waagerecht bedeutet keine Änderung.</div>`,
  formulas: [
    {
      name: "Zuordnung",
      html: "Ausgangsgröße → zugeordnete Größe",
      quantities: "als Tabelle oder Graph, zum Beispiel Zeit → Höhe",
    },
  ],
  quiz: {
    question: "Wasser läuft gleichmäßig in ein Gefäß, das unten eng und oben weit ist. Wie verläuft der Füllgraph?",
    options: ["erst steil, dann flacher", "erst flach, dann steiler", "überall gleich steil"],
    correctIndex: 0,
    explanation: "Im engen Teil steigt das Wasser schnell, im weiten Teil langsam.",
  },
  lab: lab(
    "fill-graph",
    "Gefäß füllen",
    "Wähle ein Gefäß und ziehe die Zeit. Vergleiche, wie das Wasser steigt und wie der Graph aussieht.",
    [c("vessel", "Gefäß", VESSELS), r("t", "Zeit", 0, 10, 0, 0.5, "min")],
    [
      o("vesselName", "Gefäß", (v) => VESSELS[v.vessel]),
      o("height", "Höhe des Wassers", (v) => fillHeight(v.vessel, v.t), "cm", 1),
      o("speed", "Das Wasser steigt gerade", (v) => {
        if (v.vessel === 0) return "gleichmäßig";
        const narrow = v.vessel === 1 ? v.t > 7.5 : v.t < 2.5;
        return narrow ? "schnell, enger Teil" : "langsam, weiter Teil";
      }),
    ],
    [
      {
        id: "roehre",
        text: "Fülle die gerade Röhre ganz: ein gleichmäßiger Graph.",
        check: (v) => v.vessel === 0 && v.t === 10,
      },
      {
        id: "knick-spaet",
        text: "Finde beim Gefäß „unten weit, oben eng“ den Knick im Graphen.",
        check: (v) => v.vessel === 1 && v.t === 7.5,
      },
      {
        id: "knick-frueh",
        text: "Finde beim Gefäß „unten eng, oben weit“ den Knick im Graphen.",
        check: (v) => v.vessel === 2 && v.t === 2.5,
      },
    ],
  ),
  exercises: [
    {
      id: "tabelle-lesen",
      make: (rng, level) => {
        const start = rng.int(4, 14);
        const steps = [0, rng.int(1, 4), rng.int(1, 4), -rng.int(1, 3)];
        const temps = steps.map((_, i) => start + steps.slice(0, i + 1).reduce((a, b) => a + b, 0));
        const hours = [8, 10, 12, 14];
        const index = rng.int(0, 3);
        if (level === 1)
          return task(
            level,
            `Eine Tabelle ordnet der Uhrzeit die Temperatur zu: 8 Uhr: ${temps[0]} °C, 10 Uhr: ${temps[1]} °C, 12 Uhr: ${temps[2]} °C, 14 Uhr: ${temps[3]} °C. Welche Temperatur gehört zu ${hours[index]} Uhr?`,
            "",
            [num("Temperatur =", temps[index], "°C", 0)],
            "Suche die Uhrzeit in der Tabelle und lies den zugeordneten Wert ab.",
            `Zu ${hours[index]} Uhr gehören ${temps[index]} °C.`,
            `${temps[index]} °C.`,
            { index },
          );
        return task(
          level,
          "",
          `Eine Tabelle zeigt: 8 Uhr: ${temps[0]} °C, 10 Uhr: ${temps[1]} °C, 12 Uhr: ${temps[2]} °C, 14 Uhr: ${temps[3]} °C. Um wie viel Grad ändert sich die Temperatur zwischen 12 und 14 Uhr? Wie groß ist die höchste Temperatur?`,
          [num("Änderung =", temps[3] - temps[2], "°C", 0), num("Höchstwert =", Math.max(...temps), "°C", 0)],
          "Spätere Temperatur minus frühere Temperatur. Eine Abnahme ist negativ.",
          `${temps[3]} − ${temps[2]}.`,
          `${fmt(temps[3] - temps[2])} °C und ${Math.max(...temps)} °C.`,
          { start },
        );
      },
    },
    {
      id: "fuellgraph",
      make: (rng, level) => {
        const vessel = rng.int(0, 2);
        const minutes = rng.int(2, 9);
        const shapes = ["überall gleich steil", "erst flach, dann steil", "erst steil, dann flach"];
        if (level === 1)
          return task(
            level,
            `Wasser läuft gleichmäßig in ein Gefäß. Es ist ${VESSELS[vessel]}. Wie sieht der Füllgraph aus?`,
            "",
            [pick("Graph", shapes, vessel)],
            "Enger Teil: Wasser steigt schnell und der Graph ist steil. Weiter Teil: Der Graph ist flach.",
            `Das Gefäß ist ${VESSELS[vessel]}.`,
            `${shapes[vessel]}.`,
            { vessel },
          );
        return task(
          level,
          "",
          `Ein Füllgraph verläuft ${shapes[vessel]}. Welches Gefäß gehört dazu? Bei gleichmäßigem Zufluss steigt das Wasser in der Röhre in 10 min um 10 cm. Wie hoch steht es dort nach ${minutes} min?`,
          [pick("Gefäß", VESSELS, vessel), num("Höhe =", minutes, "cm", 0)],
          "Lies den Graphen von links nach rechts. Flach bedeutet weit, steil bedeutet eng.",
          `In der Röhre: 1 cm pro Minute.`,
          `${VESSELS[vessel]}; ${minutes} cm.`,
          { vessel },
        );
      },
    },
  ],
});

const erkennen = L(2, {
  id: "dp-2-erkennen",
  title: "6.2 Direkt proportional oder nicht?",
  subtitle: "Quotientengleich und Ursprungshalbgerade",
  whyItMatters:
    "Doppelt so viel, doppelt so teuer: Das gilt oft, aber nicht immer. Beim Taxi mit Grundgebühr ist es falsch. Du lernst, das sicher zu prüfen.",
  explanationHtml: `<p>Eine Zuordnung x → y heißt <strong>direkt proportional</strong>, wenn zum Doppelten, Dreifachen, … von x das Doppelte, Dreifache, … von y gehört. Das erkennst du an drei Dingen:</p><p><strong>Tabelle:</strong> Alle Wertepaare sind <strong>quotientengleich</strong>: y : x hat immer denselben Wert, den <strong>Proportionalitätsfaktor</strong> k. <strong>Graph:</strong> Die Punkte liegen auf einer <strong>Ursprungshalbgeraden</strong>, also einer Halbgeraden, die in (0 | 0) beginnt. <strong>Formel:</strong> y = k · x.</p><div class="example">3 kg kosten 7,50 €, 4 kg kosten 10 €: 7,5 : 3 = 2,5 und 10 : 4 = 2,5. Direkt proportional, k = 2,5 € pro kg. Taxi: 5 km für 13 €, 10 km für 23 €: 13 : 5 = 2,6 und 23 : 10 = 2,3. Nicht direkt proportional, denn es gibt eine Grundgebühr.</div><div class="merke"><strong>Merke:</strong> Prüfe alle Quotienten. Ein Graph, der nicht im Ursprung beginnt, oder eine krumme Linie bedeutet: nicht direkt proportional.</div>`,
  formulas: [
    {
      name: "Direkte Proportionalität",
      html: "y = k · x",
      quantities: "k der Proportionalitätsfaktor",
    },
    {
      name: "Quotientengleichheit",
      html: "y₁ : x₁ = y₂ : x₂ = k",
      quantities: "gilt für alle Wertepaare",
    },
  ],
  quiz: {
    question: "Welche Zuordnung ist direkt proportional?",
    options: [
      "Anzahl gleicher Hefte → Gesamtpreis",
      "Alter einer Person → Körpergröße",
      "Taxistrecke → Preis mit Grundgebühr",
    ],
    correctIndex: 0,
    explanation: "Doppelt so viele gleiche Hefte kosten doppelt so viel. Beim Taxi kommt die Grundgebühr dazu, beim Wachsen gibt es keinen festen Faktor.",
  },
  lab: lab(
    "proportion-check",
    "Quotienten prüfen",
    "Verändere den Faktor und den festen Betrag. Beobachte die letzte Spalte und den Startpunkt des Graphen.",
    [
      r("k", "Faktor k", 0.5, 4, 1, 0.5),
      r("b", "Fester Betrag", 0, 4, 1),
      r("x", "Markiertes x", 1, 6, 1),
    ],
    [
      o("y", "y am markierten x", (v) => v.k * v.x + v.b),
      o("quot", "y : x", (v) => (v.k * v.x + v.b) / v.x),
      o("verdict", "Direkt proportional?", (v) =>
        v.b === 0 ? `Ja, Faktor ${fmt(v.k)}.` : "Nein, Quotienten verschieden.",
      ),
    ],
    [
      {
        id: "faktor",
        text: "Erzeuge eine direkt proportionale Zuordnung mit dem Faktor 1,5.",
        check: (v) => v.k === 1.5 && v.b === 0,
      },
      {
        id: "nicht",
        text: "Erzeuge eine Gerade mit dem Faktor 2, die nicht im Ursprung beginnt.",
        check: (v) => v.k === 2 && v.b === 2,
      },
      {
        id: "wert",
        text: "Finde bei k = 2,5 ohne festen Betrag den Punkt mit y = 10.",
        check: (v) => v.k === 2.5 && v.b === 0 && v.x === 4,
      },
    ],
  ),
  exercises: [
    {
      id: "pruefen",
      make: (rng, level) => {
        const k = rng.pick([1.5, 2, 2.5, 3, 4]);
        const proportional = rng.pick([true, false]);
        const b = proportional ? 0 : rng.int(1, 5);
        const xs = rng.shuffle([1, 2, 3, 4, 5, 6, 8, 10]).slice(0, 3).sort((p, q) => p - q);
        const ys = xs.map((x) => clean(k * x + b));
        const pairs = xs.map((x, i) => `${x} → ${fmt(ys[i])}`).join("; ");
        if (level === 1)
          return task(
            level,
            `Prüfe die Wertepaare: ${pairs}. Ist die Zuordnung direkt proportional? Gib den Quotienten des ersten Paars an.`,
            "",
            [yesNo("Direkt proportional?", proportional), num("y : x (1. Paar) =", ys[0] / xs[0], "", 2)],
            "Bilde y : x für jedes Paar. Alle Quotienten müssen gleich sein.",
            `Quotienten: ${ys.map((y, i) => fmt(y / xs[i])).join("; ")}.`,
            proportional ? `Ja, k = ${fmt(k)}.` : "Nein, die Quotienten unterscheiden sich.",
            { k, b },
          );
        return task(
          level,
          "",
          `Ein Taxi kostet ${b} € Grundgebühr und ${fmt(k)} € pro Kilometer. Berechne den Preis für ${xs[0]} km und ${2 * xs[0]} km. Ist der Preis direkt proportional zur Strecke?`,
          [
            num(`Preis für ${xs[0]} km =`, clean(k * xs[0] + b), "€", 2),
            num(`Preis für ${2 * xs[0]} km =`, clean(2 * k * xs[0] + b), "€", 2),
            yesNo("Direkt proportional?", b === 0),
          ],
          "Vergleiche: Führt die doppelte Strecke zum doppelten Preis?",
          `${fmt(k)} · ${xs[0]} + ${b} und ${fmt(k)} · ${2 * xs[0]} + ${b}.`,
          b === 0 ? "Ohne Grundgebühr ist der Preis direkt proportional." : "Nicht direkt proportional, wegen der Grundgebühr.",
          { k, b },
        );
      },
    },
    {
      id: "faktor",
      make: (rng, level) => {
        const k = rng.pick([0.5, 1.2, 1.5, 2, 2.4, 3, 3.5]);
        const x = rng.int(2, 10);
        const y = clean(k * x);
        const x2 = x + rng.int(1, 8);
        if (level === 1)
          return task(
            level,
            `Eine direkt proportionale Zuordnung enthält das Paar ${x} → ${fmt(y)}. Bestimme den Proportionalitätsfaktor und den Wert zu x = ${x2}.`,
            "",
            [num("k =", k, "", 2), num("y =", clean(k * x2), "", 2)],
            "k = y : x, dann y = k · x.",
            `k = ${fmt(y)} : ${x} = ${fmt(k)}.`,
            `k = ${fmt(k)}; y = ${fmt(k * x2)}.`,
            { k, x, x2 },
          );
        return task(
          level,
          "",
          `Der Punkt P(${x} | ${fmt(y)}) liegt auf einer Ursprungshalbgeraden. Welchen y-Wert hat der Punkt mit x = ${x2}? Liegt Q(${2 * x} | ${fmt(2 * y + 1)}) auch darauf?`,
          [num("y =", clean(k * x2), "", 2), yesNo("Q liegt darauf?", false)],
          "Auf der Ursprungshalbgeraden ist y : x überall gleich.",
          `k = ${fmt(k)}; zu ${2 * x} gehört ${fmt(2 * y)}.`,
          `y = ${fmt(k * x2)}; Q liegt nicht darauf.`,
          { k, x, x2 },
        );
      },
    },
  ],
});

const dreisatz = L(3, {
  id: "dp-3-dreisatz",
  title: "6.3 Dreisatz und Verhältnisgleichung",
  subtitle: "Fehlende Größen berechnen",
  whyItMatters:
    "5 kg kosten 12 €, was kosten 8 kg? Mit dem Dreisatz gehst du den Umweg über eine Einheit. Die Verhältnisgleichung führt ohne Umweg zum Ziel.",
  explanationHtml: `<p>Den <strong>Dreisatz</strong> kennst du aus Klasse 5: Zuerst schließt du auf die Einheit, dann auf die gesuchte Menge. Er funktioniert bei direkt proportionalen Zuordnungen, weil der Faktor überall gleich ist.</p><div class="example">5 kg ≙ 12 €. 1 kg ≙ 12 € : 5 = 2,40 €. 8 kg ≙ 8 · 2,40 € = 19,20 €.</div><p>In einer <strong>Verhältnisgleichung</strong> sind die Verhältnisse gleich: x : 8 = 12 : 5. Du rechnest x = 12 : 5 · 8 = 19,2. Das ist dieselbe Rechnung in kürzerer Form.</p><div class="merke"><strong>Merke:</strong> Dreisatz: durch die gegebene Menge teilen, mit der gesuchten Menge malnehmen. Prüfe vorher, ob die Zuordnung direkt proportional ist.</div>`,
  formulas: [
    {
      name: "Dreisatz",
      html: "a ≙ b; 1 ≙ b : a; x ≙ b : a · x",
      quantities: "a, b gegebenes Paar; x gesuchte Menge",
    },
    {
      name: "Verhältnisgleichung",
      html: "y : x = b : a",
      quantities: "gleiche Verhältnisse bei direkter Proportionalität",
    },
  ],
  quiz: {
    question: "4 Hefte kosten 6 €. Was kosten 10 Hefte?",
    options: ["15 €", "12 €", "24 €"],
    correctIndex: 0,
    explanation: "1 Heft kostet 1,50 €, 10 Hefte kosten also 15 €. Die 12 € entstehen, wenn du einfach 6 addierst.",
  },
  lab: lab(
    "rule-of-three",
    "Drei Zeilen zum Ziel",
    "Stelle das gegebene Paar und die gesuchte Menge ein. Die mittlere Zeile zeigt den Wert für 1 kg.",
    [
      r("a", "Gegebene Menge in kg", 1, 10, 2),
      r("b", "Gegebener Preis in €", 1, 60, 4),
      r("x", "Gesuchte Menge in kg", 1, 12, 3),
    ],
    [
      o("unit", "Preis für 1 kg", (v) => v.b / v.a, "€"),
      o("result", "Gesuchter Preis", (v) => (v.b / v.a) * v.x, "€"),
      o("calc", "Rechnung", (v) => `${v.b} : ${v.a} · ${v.x} = ${fmt((v.b / v.a) * v.x)} €`),
    ],
    [
      {
        id: "beispiel",
        text: "Rechne: 5 kg kosten 12 €, was kosten 8 kg?",
        check: (v) => v.a === 5 && v.b === 12 && v.x === 8,
      },
      {
        id: "einheit",
        text: "Berechne den Preis für 1 kg, wenn 4 kg 6 € kosten: Wähle als gesuchte Menge 1 kg.",
        check: (v) => v.a === 4 && v.b === 6 && v.x === 1,
      },
      {
        id: "doppelt",
        text: "Zeige: Die doppelte Menge kostet das Doppelte. 3 kg für 9 €, gesucht 6 kg.",
        check: (v) => v.a === 3 && v.b === 9 && v.x === 6,
      },
    ],
  ),
  exercises: [
    {
      id: "dreisatz",
      make: (rng, level) => {
        const a = rng.int(2, 9);
        const unit = rng.pick([0.5, 1.2, 1.5, 2, 2.4, 3, 3.6]);
        const b = clean(a * unit);
        const x = rng.int(2, 15);
        if (level === 1)
          return task(
            level,
            `${a} kg kosten ${fmt(b)} €. Was kosten ${x} kg?`,
            "",
            [
              num("Preis für 1 kg =", unit, "€", 2),
              num(`Preis für ${x} kg =`, clean(unit * x), "€", 2),
            ],
            "Erst durch die gegebene Menge teilen, dann mit der gesuchten malnehmen.",
            `${fmt(b)} : ${a} = ${fmt(unit)}.`,
            `${fmt(unit * x)} €.`,
            { a, b, x },
          );
        const litres = rng.pick([4.5, 5, 6, 6.5, 7, 8]);
        const km = rng.pick([100, 200, 250]);
        const trip = rng.int(30, 480);
        const used = clean((litres / km) * trip);
        return task(
          level,
          "",
          `Ein Auto verbraucht ${fmt(litres)} l auf ${km} km. Wie viel verbraucht es auf ${trip} km? Runde sinnvoll auf eine Stelle. Wie viele ganze Kilometer kommt es mit genau 30 l?`,
          [
            num("Verbrauch =", roundSchool(used, 1), "l", 1),
            num("Strecke =", Math.floor((30 * km) / litres), "km", 0),
          ],
          "Schließe auf 1 km. Die Strecke mit 30 l rundest du ab.",
          `${fmt(litres)} : ${km} · ${trip} = ${fmt(used, 3)}; 30 : ${fmt(litres)} · ${km} = ${fmt((30 * km) / litres, 2)}.`,
          `≈ ${fmt(roundSchool(used, 1), 1)} l und ${Math.floor((30 * km) / litres)} km.`,
          { litres, km, trip },
        );
      },
    },
    {
      id: "verhaeltnis",
      make: (rng, level) => {
        const a = rng.pick([2, 3, 4, 5, 6, 8]);
        const b = rng.int(3, 20);
        const x = rng.int(2, 12) * a;
        if (level === 1)
          return task(
            level,
            `Löse die Verhältnisgleichung: y : ${x} = ${b} : ${a}.`,
            "",
            [num("y =", (b * x) / a, "", 2)],
            "y = b : a · x",
            `${b} : ${a} · ${x}.`,
            `y = ${fmt((b * x) / a)}.`,
            { a, b, x },
          );
        const portion = rng.pick([4, 6]);
        const flour = rng.pick([300, 360, 480, 600]);
        const milk = rng.pick([0.4, 0.5, 0.6, 0.75]);
        const people = rng.int(3, 15);
        return task(
          level,
          "",
          `Ein Rezept für ${portion} Personen braucht ${flour} g Mehl und ${fmt(milk)} l Milch. Wie viel brauchst du für ${people} Personen? Schreibe dazu eine Verhältnisgleichung auf.`,
          [
            num("Mehl =", (flour * people) / portion, "g", 2),
            num("Milch =", roundSchool((milk * people) / portion, 3), "l", 3),
          ],
          "Mehl : Personen ist überall gleich, ebenso Milch : Personen.",
          `x : ${people} = ${flour} : ${portion}.`,
          `${fmt((flour * people) / portion)} g und ${fmt(roundSchool((milk * people) / portion, 3), 3)} l.`,
          { portion, flour, milk, people },
        );
      },
    },
  ],
});

const prozentBegriffe = L(4, {
  id: "dp-4-prozent-begriffe",
  title: "6.4 Grundwert, Prozentsatz und Prozentwert",
  subtitle: "Die drei Größen im Text erkennen",
  whyItMatters:
    "„20 % Rabatt“, „von 80 Kindern“, „16 Kinder“: In jeder Prozentaufgabe stecken drei Größen. Erst wenn du sie benennen kannst, weißt du, was gesucht ist.",
  explanationHtml: `<p>Die Prozentrechnung ist eine direkt proportionale Zuordnung. Der <strong>Grundwert G</strong> ist das Ganze und entspricht 100 %. Der <strong>Prozentsatz p %</strong> gibt den Anteil an. Der <strong>Prozentwert W</strong> ist der Teil, also die Größe in € oder kg, die zum Prozentsatz gehört.</p><div class="example">„25 % von 80 € sind 20 €.“ G = 80 €, p % = 25 %, W = 20 €.</div><p>Achte auf Signalwörter: Nach „von“ steht oft der Grundwert. Der Prozentsatz erkennt man am %-Zeichen. Der Prozentwert hat dieselbe Einheit wie der Grundwert.</p><div class="merke"><strong>Merke:</strong> G entspricht 100 %, W entspricht p %. Ein Prozentwert kann größer als der Grundwert sein, wenn der Prozentsatz über 100 % liegt.</div>`,
  formulas: [
    {
      name: "Größen der Prozentrechnung",
      html: "G ≙ 100 %; W ≙ p %",
      quantities: "G Grundwert, W Prozentwert, p % Prozentsatz",
    },
    {
      name: "Verhältnisgleichung",
      html: "W : G = p : 100",
      quantities: "dasselbe Verhältnis auf beiden Seiten",
    },
  ],
  quiz: {
    question: "„30 von 120 Kindern fahren Bus, das sind 25 %.“ Was ist hier der Grundwert?",
    options: ["120 Kinder", "30 Kinder", "25 %"],
    correctIndex: 0,
    explanation: "Das Ganze sind die 120 Kinder, sie entsprechen 100 %. 30 Kinder ist der Prozentwert.",
  },
  lab: lab(
    "percent-terms",
    "Die drei Größen sehen",
    "Stelle Grundwert und Prozentsatz ein. Der obere Balken ist das Ganze, der untere der Prozentwert.",
    [
      r("G", "Grundwert G", 40, 400, 100, 20, "€"),
      r("p", "Prozentsatz p", 5, 100, 10, 5, "%"),
    ],
    [
      o("W", "Prozentwert W", (v) => (v.G * v.p) / 100, "€"),
      o("unit", "1 % entspricht", (v) => v.G / 100, "€"),
    ],
    [
      {
        id: "dreissig",
        text: "Zeige: 15 % von 200 € sind 30 €.",
        check: (v) => v.G === 200 && v.p === 15,
      },
      {
        id: "haelfte",
        text: "Stelle 50 % von 60 € ein.",
        check: (v) => v.G === 60 && v.p === 50,
      },
      {
        id: "alles",
        text: "Stelle bei 400 € den Prozentsatz ein, bei dem W = G gilt.",
        check: (v) => v.G === 400 && v.p === 100,
      },
    ],
  ),
  exercises: [
    {
      id: "erkennen",
      make: (rng, level) => {
        const G = rng.int(2, 20) * 20;
        const p = rng.pick([5, 10, 20, 25, 50, 75]);
        const W = (G * p) / 100;
        const kinds = ["Grundwert", "Prozentwert", "Prozentsatz"];
        const ask = rng.int(0, 2);
        const shown = [`${fmt(G)} €`, `${fmt(W)} €`, `${p} %`][ask];
        if (level === 1)
          return task(
            level,
            `„${p} % von ${fmt(G)} € sind ${fmt(W)} €.“ Welche Größe ist ${shown}?`,
            "",
            [pick("Größe", kinds, ask)],
            "Grundwert: das Ganze, nach „von“. Prozentsatz: mit %. Prozentwert: der Teil.",
            "Das Ganze entspricht 100 %.",
            `${shown} ist der ${kinds[ask]}.`,
            { G, p },
          );
        const contexts = [
          `Von ${fmt(G)} Losen sind ${fmt(W)} Gewinne, das sind ${p} %.`,
          `Ein Rad kostet ${fmt(G)} €. Beim Rabatt von ${p} % sparst du ${fmt(W)} €.`,
          `An der Schule mit ${fmt(G)} Kindern spielen ${fmt(W)} Kinder ein Instrument, also ${p} %.`,
        ];
        const shownContext = [`${fmt(G)}`, `${fmt(W)}`, `${p} %`][ask];
        return task(
          level,
          "",
          `${rng.pick(contexts)} Welche Größe ist ${shownContext}? Wie groß ist der Prozentwert von 1 %?`,
          [pick("Größe", kinds, ask), num("1 % entspricht", G / 100, "", 2)],
          "Frage dich: Was ist das Ganze, was der Teil?",
          `G = ${fmt(G)}; 1 % = ${fmt(G)} : 100.`,
          `${shownContext} ist der ${kinds[ask]}; 1 % = ${fmt(G / 100)}.`,
          { G, p },
        );
      },
    },
    {
      id: "anteil",
      make: (rng, level) => {
        // Multiples of 20 and of 5 keep every count of people and points whole.
        const G = rng.pick([20, 40, 80, 100, 200]);
        const p = rng.pick([5, 10, 20, 25, 30, 40, 50, 60, 75]);
        const W = (G * p) / 100;
        if (level === 1)
          return task(
            level,
            `${fmt(W)} von ${G} Punkten: Wie viel Prozent sind das? Bestimme zuerst das Verhältnis W : G als Dezimalzahl.`,
            "",
            [num("W : G =", p / 100, "", 2), num("p =", p, "%", 0)],
            "W : G rechnen und mit 100 malnehmen.",
            `${fmt(W)} : ${G} = ${fmt(p / 100)}.`,
            `${p} %.`,
            { G, p },
          );
        const q = rng.pick([5, 10, 20, 25].filter((value) => p + value <= 95));
        const rest = 100 - p - q;
        return task(
          level,
          "",
          `Bei einer Umfrage werden ${G} Personen gefragt. ${p} % sagen ja, ${q} % sagen nein, der Rest antwortet nicht. Wie viel Prozent sind das, und wie viele Personen antworten nicht?`,
          [
            num("Rest =", rest, "%", 0),
            num("Personen =", (G * rest) / 100, "", 0),
          ],
          "Alle zusammen sind 100 %.",
          `100 % − ${p} % − ${q} %.`,
          `${rest} %, das sind ${(G * rest) / 100} Personen.`,
          { G, p, q },
        );
      },
    },
  ],
});

const percentModel = (v: Record<string, number>) => {
  if (v.mode === 0) return { G: v.a, pct: v.b, W: (v.a * v.b) / 100 };
  if (v.mode === 1) return { G: (100 * v.a) / v.b, pct: v.b, W: v.a };
  return { G: v.a, pct: (100 * v.b) / v.a, W: v.b };
};

const MODE_TASKS = [
  (v: Record<string, number>) => `Gesucht W: ${v.b} % von ${v.a} €`,
  (v: Record<string, number>) => `Gesucht G: ${v.b} % sind ${v.a} €`,
  (v: Record<string, number>) => `Gesucht p: ${v.b} € von ${v.a} €`,
];

const prozentRechnen = L(5, {
  id: "dp-5-prozent-rechnen",
  title: "6.5 Prozentaufgaben mit dem Dreisatz",
  subtitle: "Prozentwert, Grundwert und Prozentsatz berechnen",
  whyItMatters:
    "Rabatte, Umfragen und Noten: Mit dem Dreisatz oder einer Verhältnisgleichung löst du alle drei Aufgabentypen auf dieselbe Art.",
  explanationHtml: `<p>Schreibe die bekannten Paare untereinander und gehe über 1 % oder über den Grundwert.</p><div class="example"><strong>Prozentwert:</strong> 25 % von 240 €: 100 % ≙ 240 €, 1 % ≙ 2,40 €, 25 % ≙ 60 €.<br><strong>Grundwert:</strong> 20 % sind 60 €: 20 % ≙ 60 €, 1 % ≙ 3 €, 100 % ≙ 300 €.<br><strong>Prozentsatz:</strong> 50 € von 200 €: 200 € ≙ 100 %, 1 € ≙ 0,5 %, 50 € ≙ 25 %.</div><p>Mit einer <strong>Verhältnisgleichung</strong> geht es kürzer: W : G = p : 100. Setze die bekannten Größen ein und rechne die gesuchte aus: 50 : 200 = p : 100, also p = 25.</p><div class="merke"><strong>Merke:</strong> Prüfe zuerst, was gesucht ist. Der Prozentwert ist kleiner als der Grundwert, wenn der Prozentsatz unter 100 % liegt. So erkennst du falsche Ergebnisse.</div>`,
  formulas: [
    {
      name: "Prozentdreisatz",
      html: "100 % ≙ G; 1 % ≙ G : 100; p % ≙ G : 100 · p",
      quantities: "G Grundwert, W = G : 100 · p Prozentwert",
    },
    {
      name: "Verhältnisgleichung",
      html: "W : G = p : 100",
      quantities: "daraus W, G oder p bestimmen",
    },
  ],
  quiz: {
    question: "30 % einer Summe sind 90 €. Wie groß ist die Summe?",
    options: ["300 €", "27 €", "120 €"],
    correctIndex: 0,
    explanation: "1 % sind 3 €, also 100 % sind 300 €. 27 € wären 30 % von 90 €.",
  },
  lab: lab(
    "percent-calc",
    "Drei Aufgabentypen",
    "Wähle, was gesucht ist, und stelle die bekannten Werte ein. Die Zeilen zeigen den Dreisatz über 1 %.",
    [
      c("mode", "Gesucht ist", ["der Prozentwert W", "der Grundwert G", "der Prozentsatz p"]),
      r("a", "Erster Wert in €", 20, 400, 100, 20),
      r("b", "Zweiter Wert", 5, 100, 10, 5),
    ],
    [
      o("task", "Aufgabe", (v) => MODE_TASKS[v.mode](v)),
      o("G", "Grundwert G", (v) => percentModel(v).G, "€"),
      o("pct", "Prozentsatz p", (v) => percentModel(v).pct, "%"),
      o("W", "Prozentwert W", (v) => percentModel(v).W, "€"),
      o("proportion", "Verhältnisgleichung", (v) => {
        const m = percentModel(v);
        return `${fmt(m.W)} : ${fmt(m.G)} = ${fmt(m.pct)} : 100`;
      }),
    ],
    [
      {
        id: "wert",
        text: "Berechne 25 % von 240 €.",
        check: (v) => v.mode === 0 && v.a === 240 && v.b === 25,
      },
      {
        id: "grundwert",
        text: "Berechne den Grundwert: 20 % sind 60 €.",
        check: (v) => v.mode === 1 && v.a === 60 && v.b === 20,
      },
      {
        id: "satz",
        text: "Berechne den Prozentsatz: 50 € von 200 €.",
        check: (v) => v.mode === 2 && v.a === 200 && v.b === 50,
      },
    ],
  ),
  exercises: [
    {
      id: "prozentwert",
      make: (rng, level) => {
        const G = rng.int(2, 30) * 20;
        const p = rng.pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75]);
        const W = (G * p) / 100;
        if (level === 1)
          return task(
            level,
            `Berechne ${p} % von ${fmt(G)} €.`,
            "",
            [
              num("1 % =", G / 100, "€", 2),
              num("W =", W, "€", 2),
            ],
            "100 % ≙ G. Teile durch 100 und nimm mal p.",
            `${fmt(G)} : 100 = ${fmt(G / 100)}; ${fmt(G / 100)} · ${p}.`,
            `${fmt(W)} €.`,
            { G, p },
          );
        return task(
          level,
          "",
          `Ein Rad kostet ${fmt(G)} €. Im Sommer gibt es ${p} % Rabatt. Wie viel sparst du, und wie viel musst du noch bezahlen?`,
          [
            num("Ersparnis =", W, "€", 2),
            num("Neuer Preis =", G - W, "€", 2, {
              slips: [{ value: W, hint: "Das ist die Ersparnis. Der neue Preis ist Grundwert minus Ersparnis." }],
            }),
          ],
          "Rabatt ist der Prozentwert, der neue Preis ist G − W.",
          `${fmt(G)} : 100 · ${p} = ${fmt(W)}.`,
          `${fmt(W)} € gespart, ${fmt(G - W)} € zu zahlen.`,
          { G, p },
        );
      },
    },
    {
      id: "grundwert",
      make: (rng, level) => {
        const G = rng.int(2, 25) * 20;
        const p = rng.pick([5, 10, 20, 25, 40, 50]);
        const W = (G * p) / 100;
        if (level === 1)
          return task(
            level,
            `${p} % sind ${fmt(W)} €. Wie groß ist der Grundwert?`,
            "",
            [
              num("G =", G, "€", 2, {
                slips: [{ value: (W * p) / 100, hint: "Du hast noch einmal den Prozentwert berechnet. Gesucht ist das Ganze, also 100 %." }],
              }),
            ],
            "p % ≙ W, 1 % ≙ W : p, 100 % ≙ W : p · 100.",
            `${fmt(W)} : ${p} = ${fmt(W / p)}; ${fmt(W / p)} · 100.`,
            `${fmt(G)} €.`,
            { G, p },
          );
        return task(
          level,
          "",
          `In einer Schule fahren ${fmt(W)} Kinder mit dem Rad, das sind ${p} % aller Kinder. Wie viele Kinder hat die Schule, und wie viele fahren nicht mit dem Rad?`,
          [num("Alle Kinder =", G, "", 0), num("Nicht mit dem Rad =", G - W, "", 0)],
          "Die Radfahrer sind der Prozentwert. Bestimme zuerst 100 %.",
          `${fmt(W)} : ${p} · 100 = ${G}.`,
          `${G} Kinder; ${G - W} fahren nicht mit dem Rad.`,
          { G, p },
        );
      },
    },
    {
      id: "prozentsatz",
      make: (rng, level) => {
        const G = rng.pick([20, 25, 40, 50, 80, 120, 160, 200, 250, 400]);
        const p = rng.pick([5, 10, 20, 25, 30, 40, 50, 60, 75, 80]);
        const W = (G * p) / 100;
        if (level === 1)
          return task(
            level,
            `Wie viel Prozent sind ${fmt(W)} € von ${G} €?`,
            "",
            [num("p =", p, "%", 2)],
            "Verhältnisgleichung: W : G = p : 100.",
            `${fmt(W)} : ${G} = ${fmt(p / 100)}; das sind ${p} von 100.`,
            `${p} %.`,
            { G, p },
          );
        const scored = rng.pick([16, 18, 24, 27, 30, 36]);
        const total = rng.pick([40, 50, 60]);
        const pct = (100 * scored) / total;
        return task(
          level,
          "",
          `Ida erreicht im Test ${scored} von ${total} Punkten. Wie viel Prozent sind das? Für die Note 2 braucht sie 70 %. Hat sie die Note 2 erreicht?`,
          [num("p =", pct, "%", 2), yesNo("Mindestens 70 %?", pct >= 70)],
          "Teile die erreichten Punkte durch alle Punkte.",
          `${scored} : ${total} = ${fmt(scored / total, 2)}.`,
          `${fmt(pct)} %; ${pct >= 70 ? "erreicht" : "nicht erreicht"}.`,
          { scored, total },
        );
      },
    },
  ],
});

export const STAGE_PROPORTIONALITAET = makeStage(
  6,
  "Direkte Proportionalität",
  "Zuordnungen beschreiben, Dreisatz und Prozentrechnung nutzen",
  "#4d7c0f",
  "📈",
  [zuordnungen, erkennen, dreisatz, prozentBegriffe, prozentRechnen],
);
