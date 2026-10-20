import type { Stage } from "../model/types";
import { makeLab } from "../lab/definitions";
import { cases, choiceField, lesson, numberField } from "./helpers";

const id = "forschen";
export const STAGE_STOFFE: Stage = {
  id,
  stageNumber: 1,
  title: "Sicher forschen und Stoffe unterscheiden",
  subtitle: "Beobachten, messen, trennen",
  icon: "🔬",
  accent: "#0d9488",
  badgeTitle: "Stoffdetektiv",
  lehrplanLabel: "C9 LB 1 (I) · LB 1–2 (II/III)",
  lessons: [
    lesson(id, 1, {
      id: "ch-sicher-arbeiten",
      title: "Sicher arbeiten und genau beobachten",
      subtitle: "Eine Beobachtung ist noch keine Erklärung",
      bindings: { I: 1, II_III: 1 },
      why: "Gute Chemie beginnt mit einer prüfbaren Frage und einer sicheren Vorgehensweise.",
      html: "<p>Eine <strong>Beobachtung</strong> beschreibt, was wahrgenommen oder gemessen wurde. Eine <strong>Deutung</strong> erklärt es mit einem Modell. Formuliere zuerst eine Vermutung, prüfe sie und halte auch widersprechende Ergebnisse fest.</p><p>Gefahrstoffsymbole beschreiben Gefahren, keine Freigabe zum Ausprobieren. Echte Versuche gehören unter fachkundige Aufsicht. Unbekannte Stoffe werden niemals gekostet. Hier arbeitest du ausschließlich mit digitalen Modellen.</p>",
      rule: "Frage → Vermutung → sichere Untersuchung → Beobachtung → begründete Deutung",
      quiz: [
        "Welche Aussage ist eine Beobachtung?",
        "Die Flüssigkeit wird blau.",
        "Es müssen neue Teilchen entstanden sein.",
        "Eine sichtbare Farbänderung ist eine Beobachtung; ihre Erklärung ist eine Deutung.",
      ],
      lab: makeLab("safety"),
      exercises: [
        cases("beobachtung", [
          {
            prompt: "Im Protokoll steht: ‚Die Temperatur steigt von 20 °C auf 28 °C.‘ Was ist das?",
            answer: "Eine Beobachtung",
            others: ["Eine Teilchendeutung", "Eine unprüfbare Behauptung"],
            why: "Die Temperatur ist ein Messwert. Der Satz erklärt die Ursache noch nicht.",
            hint: "Trenne Messwert und Erklärung.",
          },
          {
            prompt:
              "Eine Schülerin schreibt: ‚Die Teilchen stoßen häufiger zusammen.‘ Welche Ebene ist gemeint?",
            answer: "Eine Deutung im Teilchenmodell",
            others: ["Eine direkt sichtbare Beobachtung", "Eine Gefahrstoffkennzeichnung"],
            why: "Die Teilchenbewegung wird aus einem Modell erschlossen, nicht mit dem Auge beobachtet.",
            hint: "Ein Modell erklärt Beobachtungen.",
          },
          {
            prompt: "Ein unbekannter Stoff sieht aus wie Zucker. Wie gehst du vor?",
            answer: "Nicht kosten; die Lehrkraft und Kennzeichnung nutzen",
            others: ["Eine kleine Menge probieren", "Ohne Kennzeichnung erhitzen"],
            why: "Das Aussehen beweist weder Identität noch Ungefährlichkeit.",
            hint: "Unbekannte Chemikalien werden nicht gekostet.",
          },
        ]),
      ],
    }),
    lesson(id, 2, {
      id: "ch-stoffeigenschaften",
      title: "Stoffeigenschaften messen",
      subtitle: "Reinstoff oder Gemisch?",
      bindings: { II_III: 2 },
      why: "Ähnlich aussehende Stoffe lassen sich mit mehreren Kenngrößen unterscheiden.",
      html: "<p>Farbe allein reicht selten zur Stofferkennung. Prüfe mehrere Eigenschaften wie Schmelztemperatur, Siedetemperatur, Löslichkeit und elektrische Leitfähigkeit. Messbedingungen wie Druck und Temperatur gehören dazu.</p><p>Ein Reinstoff hat unter festgelegten Bedingungen charakteristische Kenngrößen. Bei Gemischen hängen viele Eigenschaften von der Zusammensetzung ab. Ein homogenes Gemisch kann trotzdem mehrere Stoffe enthalten.</p>",
      rule: "Stoff erkennen: mehrere Kenngrößen + Messbedingungen",
      quiz: [
        "Ist eine klare Salzlösung ein Reinstoff?",
        "Nein, sie ist ein homogenes Gemisch.",
        "Ja, weil sie überall gleich aussieht.",
        "Gelöstes Salz und Wasser sind zwei Stoffe; gleichmäßiges Aussehen macht keinen Reinstoff.",
      ],
      lab: makeLab("particles"),
      exercises: [
        {
          id: "dichte",
          make(rng, level) {
            const volume = rng.int(2, 12) * 5;
            const density = rng.pick([1, 2, 3, 4]);
            const mass = volume * density;
            return {
              prompt:
                level === 1
                  ? "Bestimme die Dichte einer Probe aus Masse und Volumen."
                  : `Eine Materialprobe verdrängt ${volume} cm³ Wasser und wiegt ${mass} g. Welche Dichte ergibt sich?`,
              given: level === 1 ? [`Masse: ${mass} g`, `Volumen: ${volume} cm³`] : [],
              formulaHint: "Dichte = Masse / Volumen",
              fields: [
                {
                  ...numberField("Dichte", density, "g/cm³", 1),
                  slips: [
                    {
                      value: volume / mass,
                      hint: "Prüfe den Quotienten: Die Dichte ist Masse geteilt durch Volumen, nicht umgekehrt.",
                    },
                  ],
                },
              ],
              steps: [
                "Beziehe die Masse auf eine Volumeneinheit.",
                `${mass} g / ${volume} cm³`,
                `<strong>${density} g/cm³</strong>`,
              ],
              meta: { volume, mass },
            };
          },
        },
        cases("reinstoff", [
          {
            prompt:
              "Zwei klare Salzlösungen haben unterschiedliche Salzanteile. Warum kann ihre Siedetemperatur verschieden sein?",
            answer: "Die Zusammensetzung des Gemisches ist verschieden.",
            others: [
              "Die Wasserteilchen wurden größer.",
              "Klare Flüssigkeiten haben immer dieselbe Siedetemperatur.",
            ],
            why: "Gemische haben zusammensetzungsabhängige Kenngrößen.",
            hint: "Klar und homogen bedeutet nicht rein.",
          },
          {
            prompt: "Zwei Proben haben dieselbe Farbe. Ist damit ihre Stoffidentität bewiesen?",
            answer: "Nein, weitere Kenngrößen müssen verglichen werden.",
            others: ["Ja, Farbe ist immer eindeutig.", "Ja, wenn beide fest sind."],
            why: "Mehrere unabhängige Eigenschaften stützen eine Stoffzuordnung.",
            hint: "Eine einzelne Eigenschaft ist oft nicht eindeutig.",
          },
        ]),
      ],
    }),
    lesson(id, 3, {
      id: "ch-teilchenmodell",
      title: "Teilchenmodell und Aggregatzustände",
      subtitle: "Gleiche Teilchen, andere Anordnung",
      bindings: { II_III: 2 },
      why: "Das Modell erklärt Schmelzen und Verdampfen ohne neue Stoffe zu erfinden.",
      html: "<p>Im Feststoff schwingen Teilchen an geordneten Plätzen. In einer Flüssigkeit bleiben sie nah beieinander und wechseln ihre Nachbarn. Im Gas bewegen sie sich weit voneinander entfernt.</p><p>Beim Verdampfen werden Wassermoleküle voneinander getrennt, nicht in Wasserstoff und Sauerstoff zerlegt. Das Modell verwendet Punkte oder Kugeln; deren gezeichnete Größe ist keine messbare Molekülgröße.</p>",
      rule: "Physikalische Zustandsänderung: Teilchenart bleibt erhalten",
      quiz: [
        "Was ändert sich beim Verdampfen von Wasser?",
        "Abstand und Beweglichkeit der Wassermoleküle.",
        "Wassermoleküle werden zu Sauerstoffatomen.",
        "Wasser bleibt Wasser; Anordnung und Bewegung ändern sich.",
      ],
      lab: makeLab("particles"),
      exercises: [
        cases("zustandsaenderung", [
          {
            prompt: "Wasserdampf kondensiert. Was geschieht auf Teilchenebene?",
            answer: "Wassermoleküle kommen wieder näher zusammen.",
            others: ["Die Moleküle werden zu einzelnen Atomen.", "Jedes Molekül wird größer."],
            why: "Die Molekülart bleibt beim Kondensieren erhalten.",
            hint: "Ein Zustandswechsel ist keine chemische Zerlegung.",
          },
          {
            prompt: "Ein Eiswürfel schmilzt. Welche Aussage passt?",
            answer: "Die Teilchen verlassen ihre festen Plätze.",
            others: [
              "Die Teilchen selbst schmelzen zu Flüssigkeit.",
              "Die Sauerstoffatome verlassen die Wassermoleküle.",
            ],
            why: "Der Stoff ändert die Anordnung seiner Teilchen, nicht deren Identität.",
            hint: "Stoffeigenschaften und Teilcheneigenschaften sind verschiedene Ebenen.",
          },
          {
            prompt: "Luft lässt sich stark zusammendrücken, flüssiges Wasser kaum. Warum?",
            answer: "Zwischen Gasteilchen ist viel freier Raum.",
            others: ["Gasteilchen sind weich und schrumpfen.", "Wasser besitzt keine Teilchen."],
            why: "Das Teilchenmodell erklärt die Kompressibilität über den Abstand.",
            hint: "Betrachte die Abstände, nicht die Größe der Teilchen.",
          },
        ]),
      ],
    }),
    lesson(id, 4, {
      id: "ch-trennverfahren",
      title: "Gemische gezielt trennen",
      subtitle: "Eine Eigenschaft macht den Unterschied",
      bindings: { II_III: 2 },
      why: "Filtration, Destillation und Extraktion nutzen unterschiedliche Stoffeigenschaften.",
      html: "<p>Ein Filter hält ungelöste Feststoffteilchen zurück. Gelöstes Salz passiert gewöhnliches Filterpapier mit dem Wasser. Bei einer Destillation wird eine flüchtige Komponente verdampft und ihr Dampf wieder kondensiert.</p><p>Magnetscheiden nutzt magnetische Eigenschaften. Extraktion nutzt unterschiedliche Löslichkeiten. Ein Verfahren passt nur, wenn die gesuchte Eigenschaft die Komponenten wirklich unterscheidet.</p>",
      rule: "Trennverfahren auswählen → unterschiedliche Stoffeigenschaft benennen",
      quiz: [
        "Lässt sich gelöstes Kochsalz mit gewöhnlichem Filterpapier aus Wasser abtrennen?",
        "Nein, gelöstes Salz passiert den Filter.",
        "Ja, Salz bleibt wie Sand im Filter.",
        "Filtration trennt ungelöste Feststoffe, nicht gelöste Ionen.",
      ],
      lab: makeLab("separation"),
      exercises: [
        cases("trennen", [
          {
            prompt:
              "Du möchtest aus Meerwasser flüssiges Wasser gewinnen. Welches Verfahren passt?",
            answer: "Destillation",
            others: ["Filtration", "Magnetscheiden"],
            why: "Das Wasser wird verdampft und kondensiert; das Salz bleibt zurück.",
            hint: "Gesucht ist das flüchtige Lösungsmittel.",
          },
          {
            prompt: "Sand soll aus Wasser entfernt werden. Welches Verfahren passt?",
            answer: "Filtration",
            others: ["Magnetscheiden", "Extraktion des Wassers"],
            why: "Sand ist ungelöst und kann im Filter zurückgehalten werden.",
            hint: "Unterscheide gelöst und ungelöst.",
          },
          {
            prompt:
              "Eisenpulver und Schwefelpulver wurden nur vermischt. Welches Verfahren nutzt eine besondere Eigenschaft des Eisens?",
            answer: "Magnetscheiden",
            others: ["Destillation", "Kondensation"],
            why: "Eisen wird vom Magneten angezogen.",
            hint: "Es ist noch ein Gemisch, keine neue Verbindung.",
          },
          {
            prompt:
              "Ein löslicher Farbstoff soll aus Pflanzenmaterial herausgelöst werden. Wie heißt das Grundprinzip?",
            answer: "Extraktion",
            others: ["Elektrolyse", "Schmelzen"],
            why: "Ein geeignetes Lösungsmittel nimmt den Stoff selektiv auf.",
            hint: "Nutze unterschiedliche Löslichkeit.",
          },
        ]),
      ],
    }),
    lesson(id, 5, {
      id: "ch-nachweise",
      title: "Nachweisreaktionen auswerten",
      subtitle: "Welche Beobachtung spricht für welchen Stoff?",
      bindings: { II_III: 2 },
      why: "Ein Nachweis verknüpft eine charakteristische Beobachtung mit einer begründeten Zuordnung.",
      html: "<p>Ein aufglimmender Span spricht für Sauerstoff. Eine positive Knallgasprobe weist Wasserstoff nach; trübes Kalkwasser zeigt Kohlenstoffdioxid an. Wasserfreies Kupfersulfat wird bei Kontakt mit Wasser blau.</p><p>Hier wertest du ausschließlich digitale Beobachtungen aus. Ein Nachweis braucht geeignete Bedingungen und eine Vergleichsprobe; ein einzelnes Geräusch oder eine zufällige Trübung beweist für sich noch keine Stoffidentität.</p>",
      rule: "Nachweis = charakteristische Reaktion unter passenden Bedingungen",
      quiz: [
        "Welches Gas macht Kalkwasser bei einer positiven Nachweisprobe trüb?",
        "Kohlenstoffdioxid",
        "Sauerstoff",
        "Die Trübung entsteht durch einen schwer löslichen Stoff bei der Reaktion mit Kohlenstoffdioxid.",
      ],
      lab: makeLab("gas-test"),
      exercises: [
        {
          id: "nachweis-fall",
          make(rng, level) {
            const bank = [
              ["Ein glimmender Span flammt wieder auf.", "Sauerstoff"],
              ["Die fachgerecht durchgeführte Knallgasprobe ist positiv.", "Wasserstoff"],
              ["Kalkwasser wird beim Einleiten des Gases milchig.", "Kohlenstoffdioxid"],
              ["Weißes wasserfreies Kupfersulfat färbt sich blau.", "Wasser"],
            ];
            const item = rng.pick(bank);
            return {
              prompt: `${item[0]} Welcher Stoff wird damit nachgewiesen?`,
              given: level === 1 ? ["Ordne die charakteristische Beobachtung zu."] : [],
              formulaHint: "Glimmspan: O₂ · Knallgas: H₂ · Kalkwasser: CO₂ · Kupfersulfat: Wasser",
              fields: [
                choiceField(
                  rng,
                  "Nachgewiesener Stoff",
                  item[1],
                  bank.map((row) => row[1]).filter((s) => s !== item[1]),
                ),
              ],
              steps: [
                "Nutze die spezifische Beobachtung des Nachweises.",
                "Die Zuordnung gilt bei sachgerecht durchgeführter Probe.",
                `<strong>${item[1]}</strong>`,
              ],
            };
          },
        },
      ],
    }),
  ],
};
