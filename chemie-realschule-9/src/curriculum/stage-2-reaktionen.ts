import type { Stage } from "../model/types";
import { makeLab } from "../lab/definitions";
import { cases, lesson, numberField } from "./helpers";

const id = "reaktionen";
export const STAGE_REAKTIONEN: Stage = {
  id,
  stageNumber: 2,
  title: "Teilchenverbände und Reaktionen",
  subtitle: "Formeln, Energie und Stoffmenge",
  icon: "⚗️",
  accent: "#0284c7",
  badgeTitle: "Reaktionsforscher",
  lehrplanLabel: "C9 LB 3–4 (II/III)",
  lessons: [
    lesson(id, 1, {
      id: "ch-teilchenverbaende",
      title: "Atome, Moleküle und Gitter",
      subtitle: "Daltons Modell gezielt erweitern",
      bindings: { II_III: 3 },
      why: "Nicht jede Formel beschreibt ein einzelnes Molekül.",
      html: "<p>Daltons Kugelmodell unterscheidet Atomsorten. Für Moleküle werden Atome zu abgegrenzten Gruppen verbunden. Salze und Metalle bilden dagegen ausgedehnte Verbände.</p><p>Eine Molekülformel nennt die Atomzahlen eines Moleküls. Die Verhältnisformel eines Salzes nennt das kleinste Zahlenverhältnis seiner Ionen. Das einfache Kugelmodell erklärt weder elektrische Ladungen noch die innere Struktur eines Atoms.</p>",
      rule: "Molekülformel: einzelnes Molekül · Verhältnisformel: kleinstes Ionenverhältnis",
      quiz: [
        "Beschreibt NaCl ein einzelnes Kochsalzmolekül?",
        "Nein, es nennt das Ionenverhältnis im Gitter.",
        "Ja, jedes Salz besteht aus einzelnen NaCl-Molekülen.",
        "Salze bilden Ionengitter; NaCl steht für ein Verhältnis von 1 : 1.",
      ],
      lab: makeLab("structure"),
      exercises: [
        cases("verbaende", [
          {
            prompt: "Was sagt die Formel CO₂ über ein Kohlenstoffdioxidmolekül?",
            answer: "Ein C-Atom ist mit zwei O-Atomen verbunden.",
            others: ["Es enthält zwei Kohlenstoffatome.", "Es ist ein Metallgitter."],
            why: "Der Index gehört zum vorangehenden Elementsymbol.",
            hint: "Ein fehlender Index bedeutet eins.",
          },
          {
            prompt: "Warum ist MgCl₂ eine Verhältnisformel?",
            answer: "Sie beschreibt das kleinste Verhältnis der Ionen im Gitter.",
            others: [
              "Sie beschreibt einen Metallblock ohne Ladung.",
              "Sie beweist einzelne MgCl₂-Moleküle im Kristall.",
            ],
            why: "Ein Salz besteht aus vielen Kationen und Anionen in einem Verband.",
            hint: "Ionengitter sind keine Ansammlung einzelner Salzmoleküle.",
          },
          {
            prompt: "Welche Frage kann Daltons einfaches Kugelmodell nicht beantworten?",
            answer: "Wie Protonen und Elektronen im Atom angeordnet sind.",
            others: [
              "Dass verschiedene Atomsorten existieren.",
              "Dass Atome bei einer Reaktion neu angeordnet werden.",
            ],
            why: "Der innere Atombau gehört zu späteren Modellen.",
            hint: "Jedes Modell hat einen Gültigkeitsbereich.",
          },
        ]),
      ],
    }),
    lesson(id, 2, {
      id: "ch-reaktionsgleichungen",
      title: "Reaktionsgleichungen ausgleichen",
      subtitle: "Die Atombilanz muss stimmen",
      bindings: { II_III: 4 },
      why: "Ausgeglichene Gleichungen machen die Erhaltung der Atome sichtbar.",
      html: "<p>Bei einer chemischen Reaktion entstehen andere Stoffe. Die Atome werden neu verbunden; ihre Anzahl je Elementsorte bleibt in einem geschlossenen System gleich.</p><p>Zum Ausgleichen änderst du die <strong>Koeffizienten vor den Formeln</strong>, niemals die Indizes innerhalb einer Formel. Eine Synthese bildet aus Ausgangsstoffen eine Verbindung; bei einer Analyse wird eine Verbindung zerlegt.</p>",
      rule: "2 H<sub>2</sub> + O<sub>2</sub> → 2 H<sub>2</sub>O",
      quiz: [
        "Was darfst du zum Ausgleichen verändern?",
        "Die Zahlen vor den Formeln.",
        "Die Indizes in den Molekülformeln.",
        "Andere Indizes würden andere Stoffe bedeuten.",
      ],
      lab: makeLab("reaction"),
      exercises: [
        {
          id: "atombilanz",
          make(rng, level) {
            const oxygen = rng.int(1, 6);
            return {
              prompt:
                level === 1
                  ? `Es reagieren ${oxygen} Sauerstoffmoleküle vollständig mit Wasserstoff. Wie viele H₂ und H₂O gehören dazu?`
                  : `Ein geschlossenes Modell enthält ${oxygen * 2} Wasserstoffmoleküle. Ergänze die passende Sauerstoffmenge und die Zahl entstehender Wassermoleküle, wenn nichts übrig bleibt.`,
              given: [],
              formulaHint: "2 H₂ + O₂ → 2 H₂O",
              fields:
                level === 1
                  ? [
                      numberField("H₂-Moleküle", oxygen * 2),
                      numberField("H₂O-Moleküle", oxygen * 2),
                    ]
                  : [numberField("O₂-Moleküle", oxygen), numberField("H₂O-Moleküle", oxygen * 2)],
              steps: [
                "Pro zwei H₂ wird ein O₂ benötigt.",
                "Die Wasserstoff- und Sauerstoffatomzahlen müssen erhalten bleiben.",
                `<strong>${oxygen * 2} H₂ + ${oxygen} O₂ → ${oxygen * 2} H₂O</strong>`,
              ],
              meta: { oxygen },
            };
          },
        },
        cases("synthese", [
          {
            prompt:
              "Aus Wasserstoff und Sauerstoff entsteht Wasser. Welcher Reaktionstyp liegt vor?",
            answer: "Synthese",
            others: ["Analyse", "Filtration"],
            why: "Aus den Ausgangsstoffen entsteht die Verbindung Wasser.",
            hint: "Synthese baut eine Verbindung auf.",
          },
          {
            prompt:
              "Wasser wird durch elektrische Energie in Wasserstoff und Sauerstoff zerlegt. Welcher Reaktionstyp liegt vor?",
            answer: "Analyse",
            others: ["Destillation", "Synthese"],
            why: "Eine chemische Verbindung wird in andere Stoffe zerlegt.",
            hint: "Eine chemische Zerlegung ist keine physikalische Trennung.",
          },
        ]),
      ],
    }),
    lesson(id, 3, {
      id: "ch-energie-katalyse",
      title: "Energie und Katalysatoren",
      subtitle: "Startbarriere und Energiebilanz unterscheiden",
      bindings: { II_III: 4 },
      why: "Auch eine energieliefernde Reaktion braucht oft einen Anstoß.",
      html: "<p>Eine exotherme Reaktion gibt Energie an die Umgebung ab; die Produkte liegen energetisch tiefer. Eine endotherme Reaktion nimmt Energie auf. Die Aktivierungsenergie ist die Barriere auf dem Reaktionsweg.</p><p>Ein Katalysator eröffnet einen anderen Weg mit geringerer Aktivierungsenergie. Er verändert weder die Energiebilanz noch die Ausgangs- und Endstoffe. Eine vollständige Verbrennung eines Kohlenwasserstoffs liefert Kohlenstoffdioxid und Wasser; bei Sauerstoffmangel können gefährliches Kohlenstoffmonoxid und Ruß entstehen.</p>",
      rule: "Reaktionsenergie = Energie der Produkte − Energie der Edukte",
      quiz: [
        "Welche Größe verändert ein Katalysator?",
        "Die Aktivierungsenergie.",
        "Die Energiedifferenz zwischen Produkten und Edukten.",
        "Der günstigere Reaktionsweg hat eine kleinere Startbarriere.",
      ],
      lab: makeLab("energy"),
      exercises: [
        {
          id: "energiebilanz",
          make(rng, level) {
            const start = rng.int(3, 10) * 10;
            const delta = rng.pick([-40, -20, 20, 40]);
            return {
              prompt:
                level === 1
                  ? "Berechne die Energieänderung aus den Modellwerten."
                  : `Die Ausgangsstoffe eines Modells liegen bei ${start} kJ und die Produkte bei ${start + delta} kJ. Wie viel Energie beträgt die Änderung aus Sicht des Systems?`,
              given: level === 1 ? [`Edukte: ${start} kJ`, `Produkte: ${start + delta} kJ`] : [],
              formulaHint: "ΔE = E(Produkte) − E(Edukte)",
              fields: [numberField("ΔE", delta, "kJ")],
              steps: [
                "Ziehe die Energie der Ausgangsstoffe von der der Produkte ab.",
                `${start + delta} − ${start}`,
                `<strong>${delta} kJ: ${delta < 0 ? "exotherm" : "endotherm"}</strong>`,
              ],
            };
          },
        },
        cases("katalyse", [
          {
            prompt: "Ein Abgaskatalysator erleichtert eine Reaktion. Was bleibt dabei unverändert?",
            answer: "Die Energiedifferenz zwischen Edukten und Produkten.",
            others: [
              "Die Aktivierungsenergie muss größer werden.",
              "Der Katalysator liefert sämtliche Reaktionsenergie.",
            ],
            why: "Katalyse verändert den Weg, nicht die Energiebilanz.",
            hint: "Trenne Startbarriere und Energieumsatz.",
          },
          {
            prompt:
              "Bei einer Verbrennung steht zu wenig Sauerstoff zur Verfügung. Welche Stoffe können zusätzlich entstehen?",
            answer: "Kohlenstoffmonoxid und Ruß.",
            others: [
              "Nur reiner Sauerstoff.",
              "Immer ausschließlich Wasser und Kohlenstoffdioxid.",
            ],
            why: "Unvollständige Verbrennung kann giftiges Kohlenstoffmonoxid freisetzen.",
            hint: "Vollständige und unvollständige Verbrennung unterscheiden sich.",
          },
        ]),
      ],
    }),
    lesson(id, 4, {
      id: "ch-stoffmenge",
      title: "Masse, Stoffmenge und Teilchenzahl",
      subtitle: "Ein mol ist eine Anzahlportion",
      bindings: { II_III: 4 },
      why: "Die gleiche Teilchenzahl bedeutet bei unterschiedlichen Stoffen nicht die gleiche Masse.",
      html: "<p>Die Stoffmenge n wird in mol angegeben. Ein mol enthält genau 6,02214076 · 10²³ festgelegte Teilchen. Welche Teilchen gemeint sind, musst du benennen.</p><p>Die molare Masse M verbindet Stoffmenge und Masse. Mit Schulwerten hat Wasser etwa 18 g/mol, Kohlenstoffdioxid etwa 44 g/mol. Zwei Portionen mit je einem mol besitzen gleich viele Moleküle, aber verschiedene Massen. Bei einer Stoffbilanz bleiben die Atome erhalten; der Kohlenstoff einer Verbrennung verschwindet nicht, sondern kann als CO₂ weitergegeben werden.</p>",
      rule: "n = m / M · N = n · N<sub>A</sub>",
      quiz: [
        "Enthalten 1 mol Wasser und 1 mol CO₂ gleich viele Moleküle?",
        "Ja, aber sie haben verschiedene Massen.",
        "Nein, schwerere Moleküle ergeben immer weniger Teilchen pro mol.",
        "Das mol ist über die Teilchenzahl definiert.",
      ],
      lab: makeLab("amount"),
      exercises: [
        {
          id: "mol-masse",
          make(rng, level) {
            const [name, molar] = rng.pick<[string, number]>([
              ["Wasser", 18],
              ["Kohlenstoffdioxid", 44],
              ["Sauerstoffmoleküle", 32],
            ]);
            const n = rng.pick([0.5, 1, 1.5, 2, 3]);
            return {
              prompt:
                level === 1
                  ? `Berechne die Stoffmenge von ${name}.`
                  : `Eine Probe aus ${name} hat eine Masse von ${molar * n} g. Wie groß ist ihre Stoffmenge? Nutze M = ${molar} g/mol.`,
              given: level === 1 ? [`m = ${molar * n} g`, `M = ${molar} g/mol`] : [],
              formulaHint: "n = m / M",
              fields: [numberField("Stoffmenge n", n, "mol", 1)],
              steps: [
                "Masse und molare Masse müssen dieselbe Masseneinheit verwenden.",
                `${molar * n} / ${molar}`,
                `<strong>${String(n).replace(".", ",")} mol</strong>`,
              ],
              meta: { molar, mass: molar * n },
            };
          },
        },
      ],
    }),
  ],
};
