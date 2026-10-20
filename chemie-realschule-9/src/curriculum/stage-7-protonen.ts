import { makeLab } from "../lab/definitions";
import type { Stage } from "../model/types";
import { cases, choiceField, lesson } from "./helpers";

const id = "protonen";
export const STAGE_PROTONEN: Stage = {
  id,
  stageNumber: 7,
  title: "Säuren, Basen und Protonenübergänge",
  subtitle: "Lösungseigenschaft und Teilchenrolle trennen",
  icon: "🧪",
  accent: "#e11d48",
  badgeTitle: "Protonenspurensucher",
  lehrplanLabel: "C9 LB 5 (I)",
  lessons: [
    lesson(id, 1, {
      id: "ch-ph-indikator",
      title: "Indikatoren und pH-Skala",
      subtitle: "Sauer, neutral oder alkalisch?",
      bindings: { I: 5 },
      why: "Ein Indikator macht eine Eigenschaft der Lösung sichtbar.",
      html: "<p>Bei etwa 25 °C werden wässrige Lösungen mit pH unter sieben als sauer, mit pH sieben als neutral und mit pH über sieben als alkalisch bezeichnet. Ein Indikator zeigt den Bereich durch einen Farbwechsel.</p><p>Saure Lösungen enthalten im Vergleich mehr Oxoniumionen, alkalische mehr Hydroxidionen. Auch eine neutrale Lösung enthält beide Ionenarten. Ein pH-Wert allein beschreibt weder die gesamte Stoffmenge noch die Gefährlichkeit eines Produkts. Der pH ist temperaturabhängig; der neutrale Wert sieben gilt nicht für jede Temperatur.</p>",
      rule: "Bei etwa 25 °C: pH < 7 sauer · pH = 7 neutral · pH > 7 alkalisch",
      quiz: [
        "Wie wird eine wässrige Lösung mit pH 11 bei 25 °C eingeordnet?",
        "Alkalisch",
        "Sauer",
        "Ein pH-Wert über sieben bedeutet unter diesen Bedingungen alkalisch.",
      ],
      lab: makeLab("indicator"),
      exercises: [
        {
          id: "ph-einordnen",
          make(rng, level) {
            const ph = rng.int(0, 14);
            const answer = ph < 7 ? "sauer" : ph > 7 ? "alkalisch" : "neutral";
            return {
              prompt: `Eine wässrige Lösung hat bei etwa 25 °C den pH-Wert ${ph}. Wie wird sie eingeordnet?`,
              given: level === 1 ? ["Vergleiche den Wert mit sieben."] : [],
              formulaHint: "Unter sieben sauer, über sieben alkalisch, sieben neutral.",
              fields: [
                choiceField(
                  rng,
                  "Lösung",
                  answer,
                  ["sauer", "neutral", "alkalisch"].filter((item) => item !== answer),
                ),
              ],
              steps: [
                "Die Temperaturbedingung ist festgelegt.",
                `Vergleiche ${ph} mit sieben.`,
                `<strong>${answer}</strong>`,
              ],
            };
          },
        },
      ],
    }),
    lesson(id, 2, {
      id: "ch-protonenuebergang",
      title: "Säure und Base nach Brönsted",
      subtitle: "Ein Proton erhält einen neuen Partner",
      bindings: { I: 5 },
      why: "Säure und Base bezeichnen Teilchenrollen in einer Reaktion.",
      html: "<p>Eine Brönsted-Säure gibt ein Proton ab; eine Brönsted-Base nimmt ein Proton auf. Wasser kann abhängig vom Partner beide Rollen einnehmen.</p><p>Chlorwasserstoff überträgt in Wasser ein Proton auf ein Wassermolekül: Es entstehen Chlorid- und Oxoniumionen. Bei Ammoniak mit Wasser übernimmt NH₃ das Proton; Wasser hinterlässt ein Hydroxidion. Elektrische Leitfähigkeit entsteht durch die dabei gebildeten beweglichen Ionen. Eine Säure als Teilchenart ist etwas anderes als eine saure Lösung als Stoffgemisch.</p>",
      rule: "Säure = Protonendonator · Base = Protonenakzeptor",
      quiz: [
        "Welche Rolle spielt Wasser gegenüber Ammoniak bei der Protonenübertragung?",
        "Wasser kann als Protonendonator reagieren.",
        "Wasser kann in keiner Reaktion Protonen abgeben.",
        "NH₃ nimmt hier ein Proton von Wasser auf; es entstehen Ammonium- und Hydroxidionen.",
      ],
      lab: makeLab("proton"),
      exercises: [
        cases("protolyse", [
          {
            prompt: "HCl reagiert mit Wasser zu Chlorid und Oxonium. Wer nimmt das Proton auf?",
            answer: "Das Wassermolekül.",
            others: ["Das Chloridion als entstehendes Proton.", "Ein Elektron im Atomkern."],
            why: "Wasser wird durch Protonenaufnahme zum Oxoniumion.",
            hint: "Suche den Protonenakzeptor.",
          },
          {
            prompt: "NH₃ reagiert mit Wasser zu Ammonium und Hydroxid. Welche Rolle spielt NH₃?",
            answer: "Base, weil es ein Proton aufnimmt.",
            others: ["Säure, weil es ein Elektron abgibt.", "Säure, weil es ein Proton abgibt."],
            why: "Protonenaufnahme ist die Brönsted-Basenrolle.",
            hint: "Redox- und Protonenübergang sind verschiedene Konzepte.",
          },
          {
            prompt: "Eine saure Lösung und ein Säureteilchen: Welche Aussage ist fachlich passend?",
            answer: "Die Lösung ist ein Stoffgemisch; die Säure ist ein Protonendonator.",
            others: [
              "Beide Begriffe bezeichnen immer dasselbe einzelne Teilchen.",
              "Eine saure Lösung enthält nur Protonen und keinen Stoff.",
            ],
            why: "Stoffebene und Teilchenebene erfüllen unterschiedliche Beschreibungsaufgaben.",
            hint: "Trenne die beobachtete Lösungseigenschaft von der Teilchenrolle.",
          },
        ]),
      ],
    }),
    lesson(id, 3, {
      id: "ch-saeurereste",
      title: "Säurereste und Carbonsäuren",
      subtitle: "Nach dem Protonenübergang bleibt ein Partner zurück",
      bindings: { I: 5 },
      why: "Säurerestionen lassen sich aus Protonenabgabe und Ladungsbilanz herleiten.",
      html: "<p>Gibt ein neutrales Säureteilchen ein positives Proton ab, bleibt ein einfach negativ geladenes Säurerestion. Aus Chlorwasserstoff entsteht Chlorid, aus Essigsäure das Acetation. Bei mehrprotonigen Säuren sind mehrere Schritte möglich; nach dem ersten Schritt der Kohlensäure entsteht Hydrogencarbonat.</p><p>Essigsäure kommt beispielsweise in Essig vor, Zitronensäure in Zitrusfrüchten. Ihre Carboxygruppen ermöglichen Protonenübergänge. Auch organische Säuren müssen über Struktur, Eigenschaften und Konzentration beurteilt werden; ‚natürlich‘ ist keine Ungefährlichkeitsgarantie.</p>",
      rule: "Abgabe eines H⁺: Ladungszahl des zurückbleibenden Teilchens sinkt um eins",
      quiz: [
        "Welches Ion bleibt nach Abgabe eines Protons aus Essigsäure?",
        "Das negativ geladene Acetation.",
        "Ein positiv geladenes Metallion.",
        "Die Elektronen bleiben beim Säurerest; nur das positive Proton wechselt den Partner.",
      ],
      lab: makeLab("acid-salts"),
      exercises: [
        cases("saeurerest", [
          {
            prompt: "Welche Teilchenart entsteht bei der ersten Protonenabgabe von Kohlensäure?",
            answer: "Hydrogencarbonation",
            others: ["Ammoniumion", "Natriumatom"],
            why: "Kohlensäure ist mehrprotonig; der erste Schritt liefert Hydrogencarbonat.",
            hint: "Ein Protonenübergang muss von einer vollständigen mehrstufigen Abgabe unterschieden werden.",
          },
          {
            prompt: "Ein neutrales Säureteilchen gibt ein H⁺ ab. Welche Gesamtladung hat der Rest?",
            answer: "Einfach negativ.",
            others: ["Einfach positiv.", "Unverändert neutral."],
            why: "Die Gesamtladung vor und nach dem Übergang muss bilanziert sein.",
            hint: "Ein positives Teilchen verlässt das neutrale Teilchen.",
          },
          {
            prompt: "Welche Struktur ermöglicht den typischen Protonenübergang von Essigsäure?",
            answer: "Die Carboxygruppe.",
            others: ["Eine Metallbindung.", "Ein Edelgasgitter."],
            why: "Die OH-Gruppe innerhalb der Carboxygruppe kann ein Proton abgeben.",
            hint: "Ordne die funktionelle Gruppe der Carbonsäure zu.",
          },
        ]),
      ],
    }),
    lesson(id, 4, {
      id: "ch-oxide-wasser",
      title: "Oxide und Wasser",
      subtitle: "Wege zu sauren und alkalischen Lösungen",
      bindings: { I: 5 },
      why: "Beobachtete Lösungseigenschaften lassen sich aus Stoffumwandlungen und Ionen erklären.",
      html: "<p>Kohlenstoffdioxid kann in Wasser über ein Gleichgewicht einen kleinen Anteil Kohlensäure bilden. Deren Protolyse erhöht den Oxoniumionenanteil. Calciumoxid reagiert mit Wasser zu Calciumhydroxid; der gelöste Anteil liefert Hydroxidionen.</p><p>Bei der Reaktion von Lithium mit Wasser entsteht unter anderem Lithiumhydroxid und Wasserstoff. Die Zuordnung ‚alle Nichtmetalloxide sauer, alle Metalloxide alkalisch‘ wäre zu grob: Hier werden konkrete Beispiele betrachtet, keine ausnahmslose Regel. Die Modelle ersetzen keine beaufsichtigten realen Versuche.</p>",
      rule: "Konkrete Reaktion prüfen → entstehende Ionen benennen → Lösung einordnen",
      quiz: [
        "Welche Ionen erklären die alkalische Wirkung gelösten Calciumhydroxids?",
        "Hydroxidionen.",
        "Neutrale Sauerstoffatome.",
        "Der gelöste Stoff liefert Hydroxidionen in die Lösung.",
      ],
      lab: makeLab("oxide"),
      exercises: [
        cases("oxide", [
          {
            prompt:
              "Kohlenstoffdioxid wird in Wasser eingeleitet. Welcher Prozess erklärt eine saure Lösung?",
            answer: "Über Kohlensäure entstehen durch Protolyse Oxoniumionen.",
            others: [
              "CO₂ wird vollständig zu Natriumhydroxid.",
              "Jedes Wassermolekül wird in Atome zerlegt.",
            ],
            why: "Ein Gleichgewicht und anschließende Protonenübergänge liefern die Teilchendeutung.",
            hint: "Nicht das Gas allein, sondern die Reaktion mit Wasser ist zu betrachten.",
          },
          {
            prompt: "Calciumoxid reagiert mit Wasser. Welche Aussage passt?",
            answer:
              "Es entsteht Calciumhydroxid; gelöste Hydroxidionen bewirken alkalische Eigenschaften.",
            others: [
              "Es entsteht ausschließlich Chlorwasserstoff.",
              "Es bilden sich keine neuen Stoffe.",
            ],
            why: "Hier liegt eine Stoffumwandlung vor, deren Produkt teilweise in Lösung geht.",
            hint: "Calciumoxid und Calciumhydroxid unterscheiden.",
          },
          {
            prompt:
              "Eine Lithium-Wasser-Reaktion liefert Wasserstoff und eine alkalische Lösung. Welche Teilchen erklären die Lösungseigenschaft?",
            answer: "Hydroxidionen.",
            others: ["Neutrale Lithiumkerne.", "Ausschließlich ungeladene Sauerstoffmoleküle."],
            why: "Lithiumhydroxid liefert in Wasser Lithium- und Hydroxidionen.",
            hint: "Die Lösungseigenschaft folgt aus den entstehenden Ionen.",
          },
        ]),
      ],
    }),
  ],
};
