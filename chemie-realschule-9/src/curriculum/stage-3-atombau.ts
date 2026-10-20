import { element, ELEMENTS, shells } from "../chemistry/model";
import type { Stage } from "../model/types";
import { makeLab } from "../lab/definitions";
import { cases, lesson, numberField } from "./helpers";

const id = "atombau";
export const STAGE_ATOMBAU: Stage = {
  id,
  stageNumber: 3,
  title: "Atombau und Periodensystem",
  subtitle: "Vom Streuversuch zu Valenzelektronen",
  icon: "⚛️",
  accent: "#7c3aed",
  badgeTitle: "Atomarchitekt",
  lehrplanLabel: "C9 LB 5 (II/III) · für I freiwillige Wiederholung",
  lessons: [
    lesson(id, 1, {
      id: "ch-rutherford",
      title: "Rutherfords Streuversuch",
      subtitle: "Aus Spuren auf den Aufbau schließen",
      bindings: { II_III: 5 },
      why: "Ein Modell muss zu allen Beobachtungen passen, auch zu seltenen.",
      html: "<p>Beim historischen Streuversuch durchdrangen die meisten positiv geladenen Alphateilchen eine dünne Goldfolie nahezu ungehindert. Wenige wurden stark abgelenkt oder zurückgestreut.</p><p>Daraus entstand das Kern-Hülle-Modell: Ein winziger positiver Kern enthält fast die gesamte Masse; die ausgedehnte Hülle enthält die Elektronen. Das Modell beschreibt die Größenordnung des Aufbaus, erklärt aber noch keine Energiestufen oder chemische Bindung.</p>",
      rule: "Meist gerade → ausgedehnte Hülle · selten stark abgelenkt → kleiner positiver Kern",
      quiz: [
        "Wo sitzt fast die gesamte Masse eines Atoms?",
        "Im kleinen Atomkern.",
        "Gleichmäßig in der ganzen Hülle verteilt.",
        "Protonen und Neutronen sind viel schwerer als Elektronen.",
      ],
      lab: makeLab("rutherford"),
      exercises: [
        cases("streuung", [
          {
            prompt: "Fast alle Alphateilchen passieren die Folie. Welche Folgerung passt dazu?",
            answer: "Der massereiche Kern nimmt nur einen winzigen Raumanteil ein.",
            others: [
              "Die Masse ist als kompakte Kugel über das Atom verteilt.",
              "Atome besitzen keine Ladungen.",
            ],
            why: "Die meisten Flugbahnen führen weit am kleinen Kern vorbei.",
            hint: "Betrachte häufige und seltene Beobachtungen gemeinsam.",
          },
          {
            prompt: "Einige positive Alphateilchen werden stark abgelenkt. Welche Deutung passt?",
            answer: "Sie kommen einer konzentrierten positiven Kernladung nahe.",
            others: [
              "Eine diffuse negative Wolke stößt sie positiv ab.",
              "Die Goldfolie enthält nur neutrale Vollkugeln.",
            ],
            why: "Gleichnamige positive Ladungen stoßen einander ab.",
            hint: "Die Ladung der Sonde ist positiv.",
          },
        ]),
      ],
    }),
    lesson(id, 2, {
      id: "ch-atomteilchen",
      title: "Protonen, Neutronen und Elektronen",
      subtitle: "Element, Isotop und Ion auseinanderhalten",
      bindings: { II_III: 5 },
      why: "Drei Teilchenzahlen beantworten drei verschiedene Fragen.",
      html: "<p>Protonen tragen eine positive, Elektronen eine negative Elementarladung. Neutronen sind elektrisch neutral. Protonen und Neutronen sitzen im Kern und besitzen jeweils ungefähr eine atomare Masseneinheit; Elektronen sind wesentlich leichter.</p><p>Die Protonenzahl Z bestimmt das Element. Die Massenzahl A zählt Protonen und Neutronen. Isotope haben dieselbe Protonenzahl, aber verschiedene Neutronenzahlen. Ein Ion besitzt gegenüber dem neutralen Atom eine veränderte Elektronenzahl.</p>",
      rule: "A = Protonen + Neutronen · Ladungszahl = Protonen − Elektronen",
      quiz: [
        "Welche Zahl bestimmt das chemische Element?",
        "Die Protonenzahl.",
        "Die Neutronenzahl.",
        "Andere Neutronenzahlen ergeben Isotope desselben Elements.",
      ],
      lab: makeLab("atom"),
      exercises: [
        {
          id: "teilchen-zaehlen",
          make(rng, level) {
            const a = rng.pick(ELEMENTS.filter((entry) => entry.z > 2));
            const charge = rng.pick([-1, 0, 1, 2]);
            const mass = a.massNumber + rng.int(0, 2);
            return {
              prompt:
                level === 1
                  ? `Bestimme die Teilchenzahlen für ${a.name}.`
                  : `Eine ${a.name}-Teilchenart hat die Ordnungszahl ${a.z}, die Massenzahl ${mass} und die Ladungszahl ${charge > 0 ? "+" : ""}${charge}. Bestimme Neutronen- und Elektronenzahl.`,
              given: level === 1 ? [`Z = ${a.z}`, `A = ${mass}`, `Ladungszahl = ${charge}`] : [],
              formulaHint: "Neutronen = A − Z · Elektronen = Z − Ladungszahl",
              fields: [
                numberField("Neutronen", mass - a.z),
                numberField("Elektronen", a.z - charge),
              ],
              steps: [
                "Die Massenzahl zählt beide Kernteilchenarten.",
                "Positive Ladung bedeutet Elektronenmangel; negative Ladung Elektronenüberschuss.",
                `<strong>${mass - a.z} Neutronen und ${a.z - charge} Elektronen</strong>`,
              ],
              meta: { protons: a.z, mass, charge },
            };
          },
        },
      ],
    }),
    lesson(id, 3, {
      id: "ch-energiestufen",
      title: "Energiestufen und Außenelektronen",
      subtitle: "Ein Modell ist keine Planetenbahn",
      bindings: { II_III: 5 },
      why: "Die äußere Elektronenbesetzung hilft, Bindungsverhalten zu verstehen.",
      html: "<p>Elektronen können nur bestimmte Energiezustände einnehmen. Wird Energie aufgenommen, kann ein Elektron einen höheren Zustand erreichen oder das Atom ganz verlassen. Beim Übergang zurück kann Licht entstehen; charakteristische Farben geben Hinweise auf Energiestufen.</p><p>Das Schalenbild ist eine vereinfachte Darstellung. Für die ersten zwanzig neutralen Atome genügt hier die Besetzung 2, 8, 8, 2. Das ist keine allgemeine Kapazitätsregel: Im Bohr-Modell passen maximal 2n² Elektronen in die n-te Schale. Die Valenzelektronen gehören zur äußersten besetzten Schale.</p>",
      rule: "Bohr-Kapazität: 2n² · tatsächliche Besetzung hängt vom Atom ab",
      quiz: [
        "Wie viele Elektronen passen maximal in die K-Schale des Bohr-Modells?",
        "Zwei Elektronen.",
        "Acht Elektronen.",
        "Für n = 1 ergibt 2n² den Wert zwei.",
      ],
      lab: makeLab("shells"),
      exercises: [
        {
          id: "besetzung",
          make(rng, level) {
            const z = rng.int(3, 20);
            const distribution = shells(z);
            return {
              prompt:
                level === 1
                  ? `Lies für ${element(z).name} die Schalenbesetzung ${distribution.join(" | ")}.`
                  : `Das neutrale ${element(z).name}-Atom besitzt ${z} Elektronen. Verteile sie im Modell der ersten 20 Elemente auf die Energiestufen. Wie viele Stufen sind besetzt und wie viele Elektronen sind außen?`,
              given: [],
              formulaHint: "Erste 20 Atome: erst 2, dann 8, dann 8, dann bis zu 2",
              fields: [
                numberField("Besetzte Energiestufen", distribution.length),
                numberField("Außenelektronen", distribution.at(-1) ?? 0),
              ],
              steps: [
                "Verteile die Elektronen auf die Stufen des begrenzten Modells.",
                distribution.join(" | "),
                `<strong>${distribution.length} Stufen; ${distribution.at(-1)} Außenelektronen</strong>`,
              ],
            };
          },
        },
      ],
    }),
    lesson(id, 4, {
      id: "ch-periodensystem",
      title: "Das Periodensystem lesen",
      subtitle: "Perioden, Hauptgruppen und die Helium-Ausnahme",
      bindings: { II_III: 5 },
      why: "Das PSE ordnet Elemente und liefert Hinweise auf ihre Elektronenbesetzung.",
      html: "<p>Die Ordnungszahl ist die Protonenzahl. Die Periodennummer zeigt bei den hier betrachteten Grundzuständen, wie viele Energiestufen besetzt sind. Bei Hauptgruppenelementen entspricht die alte Hauptgruppennummer I bis VIII meist der Zahl der Außenelektronen.</p><p><strong>Helium ist die Ausnahme:</strong> Es steht bei den Edelgasen in Hauptgruppe VIII, besitzt aber nur zwei Elektronen. Die Edelgasregel ist ein Modell für viele einfache Bindungen; Wasserstoff und Helium erfüllen eine Zweierregel statt eines Oktetts.</p>",
      rule: "Periode → besetzte Energiestufen · Hauptgruppe → Valenzelektronen, Ausnahme Helium",
      quiz: [
        "Wie viele Außenelektronen hat Helium?",
        "Zwei, trotz seiner Stellung bei den Edelgasen.",
        "Acht, weil es in Hauptgruppe VIII steht.",
        "Seine erste und einzige Schale ist mit zwei Elektronen voll besetzt.",
      ],
      lab: makeLab("periodic"),
      exercises: [
        {
          id: "pse",
          make(rng, level) {
            const a = rng.pick(ELEMENTS);
            const distribution = shells(a.z);
            return {
              prompt: `${a.name} steht in Periode ${distribution.length} und Hauptgruppe ${a.group}. Wie viele besetzte Energiestufen und Außenelektronen besitzt das neutrale Atom?`,
              given:
                level === 1 ? [`Ordnungszahl ${a.z}`, "Beachte bei Helium die Zweierregel."] : [],
              formulaHint: "Periode = Stufenzahl · Hauptgruppe = Außenelektronen, außer He",
              fields: [
                numberField("Besetzte Energiestufen", distribution.length),
                numberField("Außenelektronen", distribution.at(-1) ?? 0),
              ],
              steps: [
                "Lies die Periode als Zahl der besetzten Stufen.",
                a.z === 2
                  ? "Helium besitzt zwei Elektronen in seiner einzigen Schale."
                  : "Nutze die Hauptgruppennummer für die Außenelektronen.",
                `<strong>${distribution.length} Stufen; ${distribution.at(-1)} Außenelektronen</strong>`,
              ],
            };
          },
        },
      ],
    }),
    lesson(id, 5, {
      id: "ch-kugelwolken",
      title: "Kugelwolken und Elektronenpaare",
      subtitle: "Erst einzeln, dann paarweise",
      bindings: { II_III: 5 },
      why: "Das Valenzschalenmodell bereitet das Zeichnen von Molekülen vor.",
      html: "<p>Das vereinfachte Kugelwolkenmodell verteilt die Valenzelektronen der hier betrachteten Hauptgruppenelemente auf vier Wolken. Jede Wolke fasst höchstens zwei Elektronen. Zuerst werden die Wolken einzeln besetzt; danach entstehen Paare.</p><p>Für Kohlenstoff ergibt das vier einfach besetzte Wolken, für Sauerstoff zwei Paare und zwei einzeln besetzte Wolken. Die Wolken beschreiben Aufenthaltsbereiche, keine Bahnen. Die Zweielektronenschale von Helium ist ein gesonderter Fall.</p>",
      rule: "Vier Valenzwolken · höchstens zwei Elektronen je Wolke",
      quiz: [
        "Wie werden vier Valenzwolken zunächst mit vier Elektronen besetzt?",
        "Jede Wolke erhält ein Elektron.",
        "Zwei Wolken werden sofort doppelt besetzt.",
        "Einfachbesetzung geht im vereinfachten Modell der Paarbildung voraus.",
      ],
      lab: makeLab("clouds"),
      exercises: [
        {
          id: "wolken",
          make(rng, level) {
            const count = rng.int(4, 8);
            const pairs = count - 4;
            const singles = 8 - count;
            return {
              prompt: `Verteile ${count} Valenzelektronen auf vier Kugelwolken. Wie viele Wolken sind doppelt und wie viele einfach besetzt?`,
              given: level === 1 ? ["Besetze alle vier Wolken zunächst einzeln."] : [],
              formulaHint: "Zuerst vier einzelne Elektronen; weitere Elektronen bilden Paare.",
              fields: [
                numberField("Doppelt besetzte Wolken", pairs),
                numberField("Einfach besetzte Wolken", singles),
              ],
              steps: [
                "Vier Elektronen verteilen sich zunächst auf vier Wolken.",
                `Die weiteren ${count - 4} Elektronen bilden ebenso viele Paare.`,
                `<strong>${pairs} Paare; ${singles} einfach besetzte Wolken</strong>`,
              ],
            };
          },
        },
        cases("modellgrenze", [
          {
            prompt: "Was stellt eine Kugelwolke dar?",
            answer: "Einen vereinfachten Aufenthaltsbereich für Elektronen.",
            others: [
              "Eine feste Kreisbahn eines Elektrons.",
              "Einen zusätzlichen positiv geladenen Kern.",
            ],
            why: "Ein Elektronenmodell ist keine maßstäbliche mechanische Bahnzeichnung.",
            hint: "Wolke und Planetenbahn sind unterschiedliche Modellideen.",
          },
        ]),
      ],
    }),
  ],
};
