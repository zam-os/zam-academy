import { makeLab } from "../lab/definitions";
import type { Stage } from "../model/types";
import { cases, cc, lesson, numberField, withSlips } from "./helpers";

const id = "redoxanwendungen";
const REDOX = "C10 LB 6.1 (II/III), Wahlbereich";

export const STAGE_REDOXANWENDUNGEN: Stage = {
  id,
  stageNumber: 8,
  title: "Redoxanwendungen",
  subtitle: "Batterie, Akku und Brennstoffzelle (Wahlbereich)",
  icon: "🔋",
  accent: "#0891b2",
  badgeTitle: "Energiewandler",
  lehrplanLabel: "C10 LB 6.1 (II/III)",
  lessons: [
    lesson(id, 1, {
      id: "ch-batterie-akku",
      title: "Batterie, Akku und Elektrolyse",
      subtitle: "Freiwillige und erzwungene Redoxreaktionen",
      bindings: { II_III: 6 },
      lehrplan: REDOX,
      why: "Ein Akku ist eine Batterie, deren Redoxreaktion sich durch Laden umkehren lässt.",
      html: "<p>In einer <strong>Batterie</strong> läuft eine Redoxreaktion freiwillig ab, aber räumlich getrennt: In der Zink-Iod-Batterie gibt Zink an der einen Elektrode Elektronen ab (Zn → Zn²⁺ + 2 e⁻, Oxidation). Die Elektronen fließen über den äußeren Leiter zur anderen Elektrode, wo Iod sie aufnimmt (I₂ + 2 e⁻ → 2 I⁻, Reduktion). Chemische Energie wird in elektrische Energie umgewandelt. In der Lösung wandern Ionen und schließen den Stromkreis.</p><p>Legt man eine äußere Spannung an, kann man die Reaktion umkehren: An der Zinkelektrode scheidet sich Zink ab, an der anderen bildet sich Iod. Diese <strong>erzwungene Redoxreaktion</strong> heißt <strong>Elektrolyse</strong>, z. B. die Elektrolyse einer Zinkiodid-Lösung. Ein <strong>Akkumulator</strong> nutzt genau das: Entladen = freiwillige Reaktion, Laden = Elektrolyse. Die Alltagssprache ist ungenau: Eine ‚leere Batterie‘ enthält nicht weniger Elektronen, sondern ihre Ausgangsstoffe sind umgesetzt; ein ‚geladener Akku‘ hat seine energiereichen Ausgangsstoffe zurückgebildet, nicht Strom gespeichert.</p><div class=\"example\"><strong>Beispiel:</strong> Entladen: Zn + I₂ → Zn²⁺ + 2 I⁻. Laden: Zn²⁺ + 2 I⁻ → Zn + I₂.</div>",
      rule: "Entladen: freiwillige Redoxreaktion (chemische → elektrische Energie) · Laden: Elektrolyse (erzwungen, elektrische → chemische Energie)",
      terms: [
        ["Zink-Iod-Akku", "Zn + I₂ ⇌ Zn²⁺ + 2 I⁻", "→ Entladen, ← Laden"],
        ["Elektrolyse", "durch elektrische Energie erzwungene Redoxreaktion", ""],
      ],
      quiz: [
        "Was geschieht beim Laden eines Zink-Iod-Akkus an der Zinkelektrode?",
        "Zinkionen nehmen Elektronen auf; Zink scheidet sich ab.",
        "Zink gibt Elektronen ab und geht in Lösung.",
        "Beim Laden wird die Entladereaktion durch die Spannungsquelle umgekehrt.",
      ],
      lab: makeLab("akku"),
      exercises: [
        cases(
          "freiwillig-erzwungen",
          [
            cc("Welcher Vorgang ist eine erzwungene Redoxreaktion?", "Das Laden eines Akkus.", ["Das Entladen einer Batterie.", "Das Rosten von Eisen."], "Eine äußere Spannungsquelle treibt die Reaktion an.", "Braucht es Energie von außen?"),
            cc("Was nimmt beim Entladen der Zink-Iod-Batterie Elektronen auf?", "Iod", ["Zink", "Wasser"], "I₂ + 2 e⁻ → 2 I⁻ ist die Reduktion.", "Wer wird reduziert?"),
            cc("Welche Energieumwandlung findet beim Entladen statt?", "Chemische Energie → elektrische Energie.", ["Elektrische Energie → chemische Energie.", "Lichtenergie → chemische Energie."], "Die freiwillige Reaktion liefert Strom.", "Richtung der Umwandlung."),
          ],
          [
            cc("Warum ist ‚Der Akku ist voller Strom‘ fachlich ungenau?", "Gespeichert sind energiereiche Stoffe (Zink und Iod), keine Elektronen oder Ströme.", ["Weil Akkus nie Energie speichern.", "Weil Strom aus Wasser entsteht."], "Elektrische Energie wird in chemische Energie umgewandelt.", "Was ist im Akku?"),
            cc("Warum lässt sich eine ‚leere‘ Zink-Iod-Batterie mit einer Spannungsquelle wieder nutzbar machen?", "Die Elektrolyse bildet Zink und Iod aus den Ionen zurück.", ["Die Spannungsquelle füllt Elektronen nach.", "Wasser wird zu Zink."], "Die Reaktion ist umkehrbar.", "Reversibilität."),
          ],
        ),
        cases(
          "ionenwanderung",
          [
            cc("Was transportiert in der Elektrolytlösung die Ladung?", "Wandernde Ionen.", ["Freie Elektronen.", "Ungeladene Moleküle."], "Elektronen fließen im Draht, Ionen in der Lösung.", "Draht oder Lösung?"),
            cc("Wohin wandern Zinkionen bei der Elektrolyse von Zinkiodid-Lösung?", "Zur negativ geladenen Elektrode.", ["Zur positiv geladenen Elektrode.", "Sie bleiben stehen."], "Kationen werden von der negativen Elektrode angezogen.", "Ladungen ziehen sich an."),
          ],
          [
            cc("Bei der Elektrolyse von Zinkiodid-Lösung färbt sich die Lösung an einer Elektrode braun. Was entsteht dort?", "Iod, durch Oxidation von Iodidionen.", ["Zink, durch Reduktion.", "Wasserstoff."], "2 I⁻ → I₂ + 2 e⁻ an der positiven Elektrode.", "Welcher Stoff ist braun?"),
            cc("Warum gehören Akkus nicht in den Hausmüll?", "Sie enthalten Metalle und Stoffe, die recycelt werden können und die Umwelt belasten.", ["Weil sie im Müll explodieren müssen.", "Weil sie Elektronen verlieren."], "Rohstoffe zurückgewinnen, Schadstoffe vermeiden.", "Umwelt und Rohstoffe."),
          ],
        ),
      ],
    }),
    lesson(id, 2, {
      id: "ch-brennstoffzelle",
      title: "Wasserstoff/Sauerstoff-Brennstoffzelle",
      subtitle: "Strom aus Wasserstoff",
      bindings: { II_III: 6 },
      lehrplan: REDOX,
      why: "Mit regenerativ erzeugtem Wasserstoff kann eine Brennstoffzelle Fahrzeuge fast ohne Abgase antreiben.",
      html: "<p>In einer <strong>Brennstoffzelle</strong> reagieren Wasserstoff und Sauerstoff zu Wasser, aber nicht in einer Flamme: Die Teilreaktionen laufen an zwei getrennten Elektroden ab. Am Minuspol wird Wasserstoff oxidiert (H₂ → 2 H⁺ + 2 e⁻), am Pluspol wird Sauerstoff reduziert (O₂ + 4 H⁺ + 4 e⁻ → 2 H₂O). Eine Membran lässt nur die H⁺-Ionen durch; die Elektronen fließen über den äußeren Stromkreis und treiben einen Motor an. Gesamt: 2 H₂ + O₂ → 2 H₂O. Chemische Energie wird direkt in elektrische Energie umgewandelt.</p><p>Die Brennstoffzelle selbst stößt nur Wasser aus. Ihr ökologischer Nutzen hängt aber davon ab, wie der Wasserstoff hergestellt wird. Gewinnt man ihn durch Elektrolyse von Wasser mit Strom aus Wind oder Sonne, ist er ein <strong>regenerativ gewonnener Energieträger</strong>. Stammt er aus Erdgas, entsteht bei seiner Herstellung CO₂. Wasserstoff ist zudem schwierig zu speichern und zu transportieren, und bei jeder Umwandlung geht Energie verloren.</p><div class=\"example\"><strong>Beispiel:</strong> 2 H₂-Moleküle und 1 O₂-Molekül bilden 2 H₂O; dabei fließen 4 Elektronen durch den äußeren Stromkreis.</div>",
      rule: "Minuspol: H₂ → 2 H⁺ + 2 e⁻ · Pluspol: O₂ + 4 H⁺ + 4 e⁻ → 2 H₂O · gesamt: 2 H₂ + O₂ → 2 H₂O",
      terms: [["Brennstoffzelle", "2 H₂ + O₂ → 2 H₂O", "chemische → elektrische Energie, 2 e⁻ je H₂"]],
      quiz: [
        "Warum ist eine Brennstoffzelle nur dann klimafreundlich, wenn der Wasserstoff ‚grün‘ ist?",
        "Bei der Herstellung von Wasserstoff aus Erdgas entsteht CO₂.",
        "Weil die Brennstoffzelle selbst CO₂ ausstößt.",
        "Die Zelle gibt nur Wasser ab; entscheidend ist die Herstellung des Wasserstoffs.",
      ],
      lab: makeLab("brennstoffzelle"),
      exercises: [
        {
          id: "elektronen-h2",
          make(rng, level) {
            const h2 = 2 * rng.int(1, 12);
            if (level === 1)
              return {
                prompt: `In einer Brennstoffzelle reagieren ${h2} Wasserstoffmoleküle vollständig. Wie viele Elektronen fließen durch den äußeren Stromkreis, und wie viele O₂-Moleküle werden verbraucht?`,
                given: ["H₂ → 2 H⁺ + 2 e⁻", "2 H₂ + O₂ → 2 H₂O"],
                formulaHint: "2 e⁻ je H₂ · ein O₂ je zwei H₂",
                fields: [withSlips(numberField("Elektronen", 2 * h2), [h2, "Jedes H₂-Molekül gibt zwei Elektronen ab."]), withSlips(numberField("O₂-Moleküle", h2 / 2), [h2, "Ein O₂ reagiert mit zwei H₂: Teile durch 2."])],
                steps: [`${h2} · 2 = ${2 * h2} Elektronen`, `${h2} : 2 = ${h2 / 2} O₂`, `<strong>${2 * h2} e⁻ und ${h2 / 2} O₂</strong>`],
              };
            const volume = rng.pick([2, 4, 6, 10]);
            return {
              prompt: `Eine Brennstoffzelle verbraucht ${volume} l Wasserstoff. Wie viel Liter Sauerstoff braucht sie bei gleichen Bedingungen?`,
              given: [],
              formulaHint: "Gleiche Bedingungen: Volumenverhältnis = Teilchenverhältnis",
              fields: [withSlips(numberField("V(O₂)", volume / 2, "l", 1), [volume * 2, "Sauerstoff wird nur halb so viel gebraucht wie Wasserstoff: 2 H₂ + O₂."], [volume, "Das Verhältnis ist 2 : 1, nicht 1 : 1."])],
              steps: ["2 H₂ + O₂ → 2 H₂O: Verhältnis 2 : 1.", `${volume} l : 2`, `<strong>${volume / 2} l</strong>`],
            };
          },
        },
        cases(
          "wasserstoff-bewerten",
          [
            cc("Welcher Stoff verlässt eine Wasserstoff-Brennstoffzelle als einziges Reaktionsprodukt?", "Wasser", ["Kohlenstoffdioxid", "Stickoxide"], "2 H₂ + O₂ → 2 H₂O.", "Gesamtgleichung."),
            cc("An welchem Pol wird in der Brennstoffzelle Wasserstoff oxidiert?", "Am Minuspol.", ["Am Pluspol.", "In der Membran."], "Dort werden die Elektronen abgegeben und fließen in den Leiter.", "Wo entstehen Elektronen?"),
          ],
          [
            cc("Wann ist Wasserstoff ein regenerativ gewonnener Energieträger?", "Wenn er durch Elektrolyse von Wasser mit Strom aus Wind oder Sonne hergestellt wird.", ["Wenn er aus Erdgas gewonnen wird.", "Immer, weil Wasserstoff im Wasser vorkommt."], "Die Energiequelle der Herstellung entscheidet.", "Woher kommt die Energie?"),
            cc("Warum reagieren Wasserstoff und Sauerstoff in der Brennstoffzelle nicht explosionsartig?", "Die Gase sind durch die Membran getrennt; die Teilreaktionen laufen an verschiedenen Elektroden ab.", ["Weil Wasserstoff in der Zelle nicht brennbar ist.", "Weil kein Sauerstoff beteiligt ist."], "Räumlich getrennte Oxidation und Reduktion.", "Aufbau der Zelle."),
          ],
        ),
      ],
    }),
  ],
};
