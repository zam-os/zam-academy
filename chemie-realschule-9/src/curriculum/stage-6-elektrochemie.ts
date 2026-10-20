import { makeLab } from "../lab/definitions";
import type { Stage } from "../model/types";
import { cases, choiceField, lesson, numberField } from "./helpers";

const id = "elektrochemie";
export const STAGE_ELEKTROCHEMIE: Stage = {
  id,
  stageNumber: 6,
  title: "Redoxreaktionen im Alltag",
  subtitle: "Strom gewinnen, Reaktionen antreiben, Metalle schützen",
  icon: "🔋",
  accent: "#16a34a",
  badgeTitle: "Energieversteher",
  lehrplanLabel: "C9 LB 4 (I)",
  lessons: [
    lesson(id, 1, {
      id: "ch-batterie-akku",
      title: "Batterie und Akkumulator",
      subtitle: "Freiwillige und erzwungene Reaktion",
      bindings: { I: 4 },
      why: "Eine Batterie speichert keine Portion Strom, sondern stellt chemische Energie bereit.",
      html: "<p>Eine galvanische Zelle wandelt bei einer freiwilligen Redoxreaktion chemische in elektrische Energie um. Elektronen fließen außen vom Donator zur Akzeptorseite; in der Lösung bewegen sich Ionen.</p><p>An der Anode läuft immer Oxidation, an der Kathode immer Reduktion. Die Vorzeichen hängen vom Betrieb ab. Ein Akku nutzt Reaktionen, die sich durch Zufuhr elektrischer Energie ausreichend umkehren lassen. ‚Leer‘ bedeutet nicht stoffleer: Die für die Entladung geeigneten Stoffanteile wurden umgesetzt.</p>",
      rule: "Anode: Oxidation · Kathode: Reduktion · Vorzeichen hängen vom Betrieb ab",
      quiz: [
        "Welche Energieumwandlung liefert eine galvanische Zelle?",
        "Chemische in elektrische Energie.",
        "Elektrische in chemische Energie ohne äußere Quelle.",
        "Die freiwillige Redoxreaktion treibt den äußeren Strom.",
      ],
      lab: makeLab("cell"),
      exercises: [
        cases("zelle", [
          {
            prompt: "Was wird beim Laden eines Akkus hauptsächlich zugeführt und gespeichert?",
            answer: "Elektrische Energie wird in chemische Energie umgewandelt.",
            others: [
              "Elektronen werden in Atomkerne gepresst.",
              "Der Akku wird mit Strom als Stoff aufgefüllt.",
            ],
            why: "Das Laden treibt eine chemische Rückreaktion an.",
            hint: "Vergleiche freiwillige Entladung und erzwungene Umkehrung.",
          },
          {
            prompt: "Wo findet auch bei wechselnder Betriebsart immer die Oxidation statt?",
            answer: "An der Anode.",
            others: [
              "Immer am positiven Pol, unabhängig vom Betrieb.",
              "In einem neutralen Atomkern.",
            ],
            why: "Die Definition der Anode bezieht sich auf den Vorgang, nicht auf ein festes Vorzeichen.",
            hint: "Anode und Oxidation gehören zusammen.",
          },
          {
            prompt: "Welche Teilchen transportieren im Elektrolyten die Ladung?",
            answer: "Bewegliche Ionen.",
            others: ["Freie Elektronen wie im Draht.", "Elektrisch neutrale Protonen."],
            why: "Die innere und äußere Ladungsleitung haben verschiedene Ladungsträger.",
            hint: "Draht und Lösung unterscheiden.",
          },
        ]),
      ],
    }),
    lesson(id, 2, {
      id: "ch-elektrolyse",
      title: "Elektrolyse und Galvanisieren",
      subtitle: "Elektrische Energie erzwingt Stoffumwandlung",
      bindings: { I: 4 },
      why: "Elektrische Energie kann Metalle abscheiden und Oberflächen beschichten.",
      html: "<p>Bei der Elektrolyse erzwingt eine äußere Stromquelle eine Redoxreaktion. Die Kathode ist dabei negativ: Kationen können dort Elektronen aufnehmen und als Metall abgeschieden werden. An der positiven Anode findet Oxidation statt.</p><p>Beim Galvanisieren dient das zu beschichtende leitfähige Werkstück als Kathode. Im einfachen Kupfer-Modell werden Kupferionen zu Kupfer reduziert. Welche Produkte tatsächlich entstehen, hängt von Lösung, Elektroden und Bedingungen ab; nicht jede wässrige Salzlösung scheidet automatisch das Metall ab.</p>",
      rule: "Galvanisieren: Werkstück an die Kathode; Metallionen nehmen Elektronen auf",
      quiz: [
        "An welchem Pol wird ein Werkstück bei einer galvanischen Metallbeschichtung angeschlossen?",
        "An der negativen Kathode der Elektrolyse.",
        "An der positiven Anode, an der es oxidiert.",
        "Die Metallionen werden durch Elektronenaufnahme auf dem Werkstück reduziert.",
      ],
      lab: makeLab("electrolysis"),
      exercises: [
        {
          id: "elektroden",
          make(rng, level) {
            const reduction = rng.int(0, 1) === 1;
            return {
              prompt: `Bei einer Elektrolyse soll an einer Elektrode ${reduction ? "ein Kupferion Elektronen aufnehmen" : "ein geeigneter Partner Elektronen abgeben"}. Benenne die Elektrode und ihr Vorzeichen.`,
              given: level === 1 ? ["Kathode: Reduktion; Anode: Oxidation."] : [],
              formulaHint: "Die äußere Quelle macht die Kathode negativ und die Anode positiv.",
              fields: [
                choiceField(
                  rng,
                  "Elektrode",
                  reduction ? "Kathode, negativ" : "Anode, positiv",
                  reduction
                    ? ["Anode, positiv", "Kathode, positiv"]
                    : ["Kathode, negativ", "Anode, negativ"],
                ),
              ],
              steps: [
                "Ordne zuerst Aufnahme oder Abgabe zu.",
                reduction ? "Elektronenaufnahme ist Reduktion." : "Elektronenabgabe ist Oxidation.",
                `<strong>${reduction ? "Kathode, negativ" : "Anode, positiv"}</strong>`,
              ],
            };
          },
        },
      ],
    }),
    lesson(id, 3, {
      id: "ch-korrosion",
      title: "Redoxreihe und Korrosionsschutz",
      subtitle: "Unedle Metalle geben leichter Elektronen ab",
      bindings: { I: 4 },
      why: "Die Redoxreihe hilft, Metallabscheidung und Opferanoden zu erklären.",
      html: "<p>Unedlere Metallatome geben leichter Elektronen ab als edlere. Eisen kann beispielsweise Kupferionen reduzieren und dabei selbst als Eisenion in Lösung gehen. Umgekehrt läuft die entsprechende Reaktion unter vergleichbaren Bedingungen nicht freiwillig.</p><p>Ein unedleres Schutzmetall kann als Opferanode oxidiert werden und damit ein verbundenes Eisenstück schützen. Beschichtungen können zusätzlich den Kontakt mit Wasser und Sauerstoff erschweren. Schutzschichten und die konkrete Umgebung beeinflussen reale Korrosionsvorgänge; eine Reihenfolge allein beschreibt nicht jede Geschwindigkeit.</p>",
      rule: "Opferanode: unedleres Metall wird bevorzugt oxidiert",
      quiz: [
        "Welches Metall kann Eisen als Opferanode schützen?",
        "Ein geeignetes unedleres Metall, etwa Zink.",
        "Jedes edlere Metall schützt bei beschädigter Beschichtung automatisch.",
        "Zink wird bevorzugt oxidiert und liefert Elektronen.",
      ],
      lab: makeLab("corrosion"),
      exercises: [
        cases("metallreihe", [
          {
            prompt:
              "Eisen wird in eine Kupferionenlösung gegeben. Welche Deutung passt zum einfachen Redoxmodell?",
            answer: "Eisen wird oxidiert, Kupferionen werden reduziert.",
            others: [
              "Kupferionen geben Elektronen an Eisenkerne ab.",
              "Beide Teilchenarten müssen Elektronen abgeben.",
            ],
            why: "Eisen ist der Elektronendonator, Kupferionen sind Akzeptoren.",
            hint: "Unedleres Metall und edlere Metallionen vergleichen.",
          },
          {
            prompt: "Eine Zink-Opferanode an einem Eisenbauteil wird kleiner. Was erklärt das?",
            answer: "Zink wird oxidiert und als Ion abgegeben.",
            others: [
              "Zink fängt alle Eisenatomkerne ein.",
              "Zink wird ohne chemische Änderung nur magnetisch.",
            ],
            why: "Die Schutzwirkung verbraucht das unedlere Metall.",
            hint: "Die Opferanode wird selbst umgesetzt.",
          },
          {
            prompt:
              "Eine Redoxreihe sagt eine freiwillige Reaktion voraus. Beweist das auch eine hohe Reaktionsgeschwindigkeit?",
            answer: "Nein, Schutzschichten und Bedingungen können sie verlangsamen.",
            others: [
              "Ja, jede solche Reaktion läuft sofort vollständig ab.",
              "Ja, Temperatur und Oberfläche spielen nie eine Rolle.",
            ],
            why: "Energetische Möglichkeit und Geschwindigkeit sind unterschiedliche Fragen.",
            hint: "Ein Modell für die Richtung ist kein vollständiges Geschwindigkeitsmodell.",
          },
        ]),
      ],
    }),
    lesson(id, 4, {
      id: "ch-brennstoffzelle",
      title: "Brennstoffzelle und Wasserstoff",
      subtitle: "Energieträger statt Energiequelle",
      bindings: { I: 4 },
      why: "Die Umweltbilanz beginnt bei der Herstellung des Wasserstoffs.",
      html: "<p>Eine Wasserstoff-Sauerstoff-Brennstoffzelle setzt zugeführten Wasserstoff und Sauerstoff zu Wasser um und wandelt einen Teil der chemischen Energie in elektrische Energie um. An der Wasserstoffseite läuft Oxidation, an der Sauerstoffseite Reduktion.</p><p>Wasserstoff ist ein Energieträger: Seine Herstellung benötigt Energie. Stammt diese aus erneuerbaren Quellen, kann das zur Verringerung fossiler Emissionen beitragen. Herstellung, Transport und Wirkungsgrad müssen in eine Gesamtbetrachtung eingehen. Methanol oder Ethanol können in passenden anderen Brennstoffzelltypen ebenfalls Energieträger sein.</p>",
      rule: "2 H<sub>2</sub> + O<sub>2</sub> → 2 H<sub>2</sub>O · elektrische Nutzenergie < chemische Zufuhr",
      quiz: [
        "Warum ist Wasserstoff keine kostenlose primäre Energiequelle?",
        "Weil seine Herstellung Energie benötigt.",
        "Weil seine Kerne beim Betrieb verschwinden.",
        "Wasserstoff transportiert zuvor bereitgestellte Energie.",
      ],
      lab: makeLab("fuelcell"),
      exercises: [
        {
          id: "stoffbilanz-brennstoff",
          make(rng, level) {
            const oxygen = rng.int(1, 6);
            const energy = rng.int(2, 8) * 100;
            const efficiency = rng.pick([40, 50, 60, 70]);
            return {
              prompt:
                level === 1
                  ? "Ergänze Stoffbilanz und elektrische Nutzenergie im Modell."
                  : `Eine Brennstoffzelle setzt ${oxygen} mol O₂ vollständig um. Für einen Energieumsatz von ${energy} kJ beträgt der elektrische Wirkungsgrad ${efficiency} %. Bestimme die benötigte H₂-Menge und die elektrische Nutzenergie.`,
              given:
                level === 1
                  ? [
                      `O₂: ${oxygen} mol`,
                      `Chemische Energie: ${energy} kJ`,
                      `Elektrischer Wirkungsgrad: ${efficiency} %`,
                    ]
                  : [],
              formulaHint: "H₂ : O₂ = 2 : 1 · Nutzenergie = Zufuhr · Wirkungsgrad",
              fields: [
                numberField("Wasserstoff", oxygen * 2, "mol"),
                numberField("Elektrische Nutzenergie", (energy * efficiency) / 100, "kJ"),
              ],
              steps: [
                "Nutze das Verhältnis zwei zu eins für die Stoffmenge.",
                `Für die Nutzenergie gilt ${energy} · ${efficiency} / 100.`,
                `<strong>${oxygen * 2} mol H₂ und ${(energy * efficiency) / 100} kJ</strong>`,
              ],
            };
          },
        },
      ],
    }),
  ],
};
