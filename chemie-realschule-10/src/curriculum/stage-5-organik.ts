import {
  acidName,
  alkanolName,
  carbonOxidation,
  esterName,
  functionalCarbon,
  oxidationStepFormula,
  oxidationStepName,
  oxText,
  stem,
  sub,
} from "../chemistry/model";
import { ALCOHOLS, COMPARE_SUBSTANCES, makeLab, OX_MOLECULES } from "../lab/definitions";
import type { Stage } from "../model/types";
import { cases, cc, choiceField, lesson, numberField } from "./helpers";

const id = "organik";
export const STAGE_ORGANIK: Stage = {
  id,
  stageNumber: 5,
  title: "Reaktionen organischer Moleküle",
  subtitle: "Addition, Substitution, Oxidation, Ester",
  icon: "⚗️",
  accent: "#ea580c",
  badgeTitle: "Reaktionsdeuter",
  lehrplanLabel: "C10 LB 4 (I) · C10 LB 5 (II/III)",
  lessons: [
    lesson(id, 1, {
      id: "ch-addition",
      title: "Bromwasserprobe und Addition",
      subtitle: "Doppelbindungen nachweisen",
      bindings: { I: 4, II_III: 5 },
      why: "Mit Bromwasser unterscheidest du gesättigte von ungesättigten Kohlenwasserstoffen.",
      html: "<p>Schüttelt man ein Alken wie Ethen oder Hexen mit braunem Bromwasser, entfärbt es sich sofort; ein Alkan wie Hexan entfärbt es im Dunkeln nicht. Die Brommoleküle lagern sich an die C=C-Doppelbindung an: Die Doppelbindung wird zur Einfachbindung, jedes der beiden C-Atome bindet ein Bromatom. Diesen Reaktionstyp nennt man <strong>Addition</strong>; aus zwei Molekülen entsteht eines, ohne Nebenprodukt. Aus Ethen entsteht 1,2-Dibromethan. Die <strong>Bromwasserprobe</strong> ist damit ein Nachweis für C=C-Doppelbindungen.</p><p><strong>Mechanismus</strong> (Zweig I): Die Elektronen der Doppelbindung polarisieren das Brommolekül (Brδ+–Brδ−). Das positivierte Bromatom bindet an ein C-Atom; es entsteht ein positiv geladenes Zwischenteilchen (vereinfacht ein Carbokation) und ein Bromidion. Im zweiten Schritt bindet das Bromidion an das positiv geladene C-Atom.</p><div class=\"example\"><strong>Beispiel:</strong> CH₂=CH₂ + Br₂ → CH₂Br–CH₂Br (Ethen + Brom → 1,2-Dibromethan).</div>",
      rule: "Alken + Br₂ → Dibromalkan · Bromwasser wird entfärbt ⇔ C=C-Doppelbindung",
      terms: [["Addition", "A + B → AB: Anlagerung an eine Mehrfachbindung", "kein Nebenprodukt"]],
      quiz: [
        "Welcher Stoff entfärbt Bromwasser im Dunkeln?",
        "Propen",
        "Propan",
        "Nur Propen hat eine C=C-Doppelbindung, an die Brom addiert wird.",
      ],
      lab: makeLab("addition"),
      exercises: [
        {
          id: "additionsprodukt",
          make(rng, level) {
            const n = rng.int(2, 6);
            const product = `1,2-Dibrom${stem(n).toLowerCase()}an`;
            const others = [`1,1-Dibrom${stem(n).toLowerCase()}an`, `${stem(n)}en und Bromwasserstoff`];
            const alkene = n === 2 ? "Ethen" : `${stem(n)}-1-en`;
            return {
              prompt:
                level === 1
                  ? `${alkene} reagiert mit Brom. Welches Produkt entsteht?`
                  : `Ein unbekannter Kohlenwasserstoff C${sub(n)}H${sub(2 * n)} entfärbt Bromwasser; die Doppelbindung liegt am Kettenende. Benenne das Reaktionsprodukt.`,
              given: level === 1 ? ["Die Bromatome binden an beide C-Atome der früheren Doppelbindung."] : [],
              formulaHint: "Addition: ein Bromatom an jedes C-Atom der Doppelbindung",
              fields: [choiceField(rng, "Produkt", product, others)],
              steps: [
                `${alkene} hat die Doppelbindung zwischen C1 und C2.`,
                "Je ein Bromatom bindet an C1 und C2; es entsteht kein Nebenprodukt.",
                `<strong>${product}</strong>`,
              ],
            };
          },
        },
        cases(
          "bromwasser",
          [
            cc("Was zeigt die Entfärbung von Bromwasser?", "Eine C=C-Doppelbindung im Molekül.", ["Eine Hydroxygruppe.", "Ein Salz."], "Brom wird an die Doppelbindung addiert und verbraucht.", "Was wird verbraucht?"),
            cc("Welches Nebenprodukt entsteht bei der Addition von Brom an Ethen?", "Keines.", ["Bromwasserstoff", "Wasser"], "Bei der Addition werden zwei Moleküle zu einem.", "A + B → AB."),
          ],
          [
            cc("Im ersten Schritt der Addition wird das Brommolekül polarisiert. Wodurch?", "Durch die Elektronen der C=C-Doppelbindung.", ["Durch Licht.", "Durch das Wasser im Bromwasser."], "Die elektronenreiche Doppelbindung verschiebt die Elektronen im Br₂.", "Wo sitzen viele Elektronen?"),
            cc("Ein Öl entfärbt Bromwasser, ein festes Fett nicht. Was folgt?", "Das Öl enthält C=C-Doppelbindungen, das Fett nicht.", ["Das Fett enthält mehr Doppelbindungen.", "Bromwasser reagiert nur mit Flüssigkeiten."], "Ungesättigte Fettsäurereste addieren Brom.", "Bromwasserprobe deuten."),
          ],
        ),
      ],
    }),
    lesson(id, 2, {
      id: "ch-substitution",
      title: "Radikalische Substitution",
      subtitle: "Alkane und Halogene im Licht",
      bindings: { I: 4 },
      why: "Alkane reagieren nur unter Licht mit Halogenen, und zwar in einer Kettenreaktion.",
      html: "<p>Alkane haben nur Einfachbindungen; Brom kann sich nicht anlagern. Im Licht entfärbt sich eine Lösung von Brom in Hexan trotzdem langsam, und es entsteht Bromwasserstoff (feuchtes Indikatorpapier wird rot). Ein H-Atom des Alkans wird durch ein Bromatom ersetzt: <strong>Substitution</strong>. Aus Methan entsteht Brommethan: CH₄ + Br₂ → CH₃Br + HBr.</p><p>Der Mechanismus ist eine <strong>Radikal-Kettenreaktion</strong>. Radikale sind Teilchen mit einem ungepaarten Elektron (Punkt). <strong>Start:</strong> Licht spaltet Br₂ in zwei Bromradikale Br·. <strong>Kette:</strong> Br· + CH₄ → HBr + ·CH₃, dann ·CH₃ + Br₂ → CH₃Br + Br·. Das neue Bromradikal setzt die Kette fort. <strong>Abbruch:</strong> Zwei Radikale verbinden sich, z. B. Br· + Br· → Br₂ oder ·CH₃ + ·CH₃ → C₂H₆. Weitere Substitutionen liefern auch Dibrommethan und mehr.</p><div class=\"example\"><strong>Beispiel:</strong> Ein einziges Startradikal kann viele Kettenschritte auslösen, bis ein Abbruch die Radikale verbraucht.</div>",
      rule: "Start (Licht): X₂ → 2 X· · Kette: X· + RH → HX + R·, R· + X₂ → RX + X· · Abbruch: zwei Radikale verbinden sich",
      terms: [
        ["Substitution", "Ersatz eines Atoms durch ein anderes", "CH₄ + Br₂ → CH₃Br + HBr"],
        ["Radikal", "Teilchen mit ungepaartem Elektron", "z. B. Br·, ·CH₃"],
      ],
      quiz: [
        "Warum braucht die Bromierung von Methan Licht?",
        "Licht spaltet Brommoleküle in Bromradikale (Startreaktion).",
        "Licht spaltet die C=C-Doppelbindung des Methans.",
        "Ohne Startradikale beginnt keine Kettenreaktion; Methan hat keine Doppelbindung.",
      ],
      lab: makeLab("substitution"),
      exercises: [
        cases(
          "schritte",
          [
            cc("Welcher Schritt ist eine Abbruchreaktion?", "Br· + ·CH₃ → CH₃Br", ["Br₂ → 2 Br·", "Br· + CH₄ → HBr + ·CH₃"], "Zwei Radikale verbinden sich; die Zahl der Radikale sinkt.", "Wo verschwinden Radikale?"),
            cc("Welches Gas entsteht bei der Substitution neben dem Brommethan?", "Bromwasserstoff", ["Wasserstoff", "Sauerstoff"], "Das ersetzte H-Atom verlässt das Molekül als HBr.", "Wohin geht das H-Atom?"),
            cc("Welcher Schritt ist die Startreaktion?", "Br₂ → 2 Br· (unter Licht)", ["·CH₃ + Br₂ → CH₃Br + Br·", "Br· + Br· → Br₂"], "Aus einem Molekül entstehen zwei Radikale.", "Wo entstehen die ersten Radikale?"),
          ],
          [
            cc("Warum spricht man von einer Kettenreaktion?", "Jeder Kettenschritt erzeugt wieder ein Radikal, das den nächsten Schritt auslöst.", ["Weil Methanmoleküle Ketten bilden.", "Weil das Licht ständig neu gespalten wird."], "Br· verbraucht sich im ersten und entsteht im zweiten Kettenschritt.", "Radikalbilanz eines Kettendurchlaufs."),
            cc("Wie unterscheiden sich Addition und Substitution bei Bromierungen?", "Addition: kein Nebenprodukt, braucht C=C · Substitution: HBr entsteht, braucht Licht.", ["Beide brauchen Licht und liefern HBr.", "Addition läuft nur bei Alkanen."], "Die Reaktionstypen unterscheiden sich in Bedingungen und Produkten.", "Doppelbindung? Nebenprodukt?"),
          ],
        ),
        cases(
          "produkte",
          [
            cc("Was entsteht, wenn sich zwei Methylradikale ·CH₃ verbinden?", "Ethan C₂H₆", ["Methan CH₄", "Ethen C₂H₄"], "Zwei CH₃-Gruppen bilden eine C–C-Bindung.", "Atome zählen."),
            cc("Wie weist man den bei der Substitution entstehenden Bromwasserstoff nach?", "Feuchtes Indikatorpapier färbt sich rot.", ["Kalkwasser wird trüb.", "Bromwasser wird braun."], "HBr bildet mit Wasser eine saure Lösung.", "Säure nachweisen."),
          ],
          [
            cc("Warum entstehen bei längerer Belichtung auch Dibrommethan und Tribrommethan?", "Bromradikale greifen auch schon bromierte Moleküle an und ersetzen weitere H-Atome.", ["Weil sich die Moleküle im Dunkeln teilen.", "Weil Brom addiert wird."], "Substitution kann mehrfach am selben Molekül stattfinden.", "Wie viele H-Atome sind ersetzbar?"),
            cc("Chlor reagiert mit Ethan im Licht. Welches Hauptprodukt erwartest du beim ersten Schritt?", "Chlorethan und Chlorwasserstoff", ["1,2-Dichlorethen", "Ethen und Chlor"], "Ein H-Atom wird durch Cl ersetzt.", "Gleicher Mechanismus, anderes Halogen."),
          ],
        ),
      ],
    }),
    lesson(id, 3, {
      id: "ch-oxidationszahlen-organisch",
      title: "Oxidationszahlen in organischen Molekülen",
      subtitle: "Bindungen zählen statt Ladungen",
      bindings: { I: 4, II_III: 5 },
      why: "Mit Oxidationszahlen erkennst du, dass die Oxidation von Alkoholen eine Redoxreaktion ist.",
      html: "<p>Oxidationszahlen sind gedachte Ladungen. Man ordnet die Bindungselektronen jeder Bindung vollständig dem elektronegativeren Partner zu: Sauerstoff ist elektronegativer als Kohlenstoff, Kohlenstoff etwas elektronegativer als Wasserstoff. Bei Bindungen zwischen gleichen Atomen wird geteilt. <strong>Regeln:</strong> Elemente haben 0; H hat in Verbindungen meist +I, O meist −II; in einem neutralen Molekül ist die Summe 0.</p><p>Für ein einzelnes C-Atom gilt dann: Jede Bindung zu einem O-Atom zählt +1 (eine Doppelbindung +2), jedes gebundene H-Atom −1, Bindungen zu anderen C-Atomen 0. Methan hat −IV, Methanol −II, Methanal 0, Methansäure +II, Kohlenstoffdioxid +IV. Steigt die Oxidationszahl eines C-Atoms, wurde es oxidiert.</p><div class=\"example\"><strong>Beispiel:</strong> C1 im Ethanol CH₃–CH₂–OH: zwei H-Atome (−2), eine Bindung zu O (+1), eine zu C (0) → −I.</div>",
      rule: "OZ(C) = Zahl der Bindungen zu O − Zahl der gebundenen H-Atome · Bindungen C–C zählen 0",
      terms: [["Regeln", "Element 0 · H +I · O −II · Summe im Molekül 0", "Ausnahmen wie Peroxide nicht in C10"]],
      quiz: [
        "Welche Oxidationszahl hat das C-Atom in Methanal H–CHO?",
        "0",
        "+II",
        "Zwei H-Atome (−2) und eine Doppelbindung zu O (+2) ergeben 0.",
      ],
      lab: makeLab("oxzahl"),
      exercises: [
        {
          id: "oz-kohlenstoff",
          make(rng, level) {
            const m = rng.pick(OX_MOLECULES);
            const answer = carbonOxidation(m.h, m.o);
            if (level === 2) {
              const others = OX_MOLECULES.filter((o) => carbonOxidation(o.h, o.o) !== answer);
              return {
                prompt: `In welchem Molekül hat das betrachtete C-Atom die Oxidationszahl ${oxText(answer)}?`,
                given: [],
                formulaHint: "Bindungen zu O zählen +1, H-Atome −1, C–C 0",
                fields: [choiceField(rng, "Molekül", `${m.name}, ${m.atom}`, rng.shuffle(others).slice(0, 2).map((o) => `${o.name}, ${o.atom}`))],
                steps: [
                  "Für jedes Molekül Bindungen zu O und H-Atome am betrachteten C-Atom zählen.",
                  `${m.name}: +${m.o} − ${m.h} = ${answer}`,
                  `<strong>${m.name}</strong>`,
                ],
              };
            }
            return {
              prompt: `Bestimme die Oxidationszahl des Atoms ${m.atom} in ${m.name}.`,
              given: [`${m.h} H-Atom(e), ${m.o} Bindung(en) zu O`],
              formulaHint: "Bindungen zu O zählen +1, H-Atome −1, C–C 0",
              fields: [numberField("Oxidationszahl", answer)],
              steps: [
                `Bindungen zu O: +${m.o}`,
                `H-Atome: −${m.h}`,
                `<strong>${oxText(answer)}</strong>`,
              ],
              meta: { answer },
            };
          },
        },
        cases(
          "redox-organisch",
          [
            cc("Die Oxidationszahl eines C-Atoms steigt von −I auf +I. Was liegt vor?", "Eine Oxidation des C-Atoms.", ["Eine Reduktion des C-Atoms.", "Gar keine Reaktion."], "Steigende Oxidationszahl bedeutet Elektronenabgabe.", "Richtung der Änderung."),
            cc("Welche Oxidationszahl hat Sauerstoff in fast allen organischen Molekülen?", "−II", ["+II", "0"], "Sauerstoff ist elektronegativer als C und H.", "Regel für O."),
          ],
          [
            cc("Warum ist die Verbrennung von Methan zu CO₂ eine Oxidation des Kohlenstoffs?", "Die Oxidationszahl von C steigt von −IV auf +IV.", ["Weil Sauerstoff reduziert wird und C unverändert bleibt.", "Weil die Oxidationszahl von C sinkt."], "Acht Elektronen werden formal abgegeben.", "OZ vorher und nachher."),
            cc("Kupfer(II)-oxid oxidiert Ethanol. Was geschieht mit dem Kupfer?", "Cu²⁺ wird zu Cu reduziert (+II → 0).", ["Kupfer wird ebenfalls oxidiert.", "Kupfer bleibt unverändert, es ist nur Katalysator."], "Ein Oxidationsmittel wird selbst reduziert.", "Wer nimmt die Elektronen auf?"),
          ],
        ),
      ],
    }),
    lesson(id, 4, {
      id: "ch-alkanole-oxidation",
      title: "Vom Alkanol zur Alkansäure",
      subtitle: "Primäre Alkanole schrittweise oxidieren",
      bindings: { I: 4, II_III: 5 },
      why: "Wein wird zu Essig: Die Oxidation primärer Alkanole führt über Alkanale zu Alkansäuren.",
      html: "<p>Taucht man ein heißes, schwarz oxidiertes Kupferblech in Ethanol, wird es wieder kupferrot, und es riecht stechend nach Ethanal. Kupfer(II)-oxid ist das <strong>Oxidationsmittel</strong>: Cu²⁺ wird zu Cu reduziert, das C-Atom mit der OH-Gruppe wird oxidiert. Aus einem <strong>primären Alkanol</strong> (die OH-Gruppe sitzt an einem C-Atom mit höchstens einem C-Nachbarn) entsteht ein <strong>Alkanal</strong> mit der Aldehydgruppe –CHO.</p><p>Alkanale lassen sich weiter zur <strong>Alkansäure</strong> mit der Carboxygruppe –COOH oxidieren. Die Oxidationszahl des funktionellen C-Atoms steigt dabei: Ethanol −I → Ethanal +I → Ethansäure +III. So entsteht Essig aus Wein, wenn Essigsäurebakterien mit Luftsauerstoff arbeiten. Die Namen folgen der Kette: Ethanol, Ethanal, Ethansäure; Propan-1-ol, Propanal, Propansäure.</p><div class=\"example\"><strong>Beispiel:</strong> CH₃–CH₂–OH + CuO → CH₃–CHO + Cu + H₂O.</div>",
      rule: "primäres Alkanol (–CH₂OH) → Alkanal (–CHO) → Alkansäure (–COOH) · OZ des C-Atoms: −I → +I → +III",
      terms: [
        ["Alkanal", "Aldehydgruppe –CHO", "Ethanal CH₃–CHO"],
        ["Alkansäure", "Carboxygruppe –COOH", "Ethansäure CH₃–COOH"],
      ],
      quiz: [
        "Welcher Stoff entsteht bei der ersten Oxidation von Propan-1-ol?",
        "Propanal",
        "Propanon",
        "Propan-1-ol ist ein primäres Alkanol; aus –CH₂OH wird –CHO.",
      ],
      lab: makeLab("alkanol"),
      exercises: [
        {
          id: "oxidationsprodukt",
          make(rng, level) {
            const n = rng.int(1, 4);
            const step = rng.int(1, 2);
            const name = oxidationStepName(n, step);
            const others = [oxidationStepName(n, step === 1 ? 2 : 1), `${stem(n)}anon`];
            if (level === 1)
              return {
                prompt: `${alkanolName(n)} wird ${step === 1 ? "einmal" : "zweimal"} oxidiert. Welcher Stoff entsteht?`,
                given: [`Ausgang: ${oxidationStepFormula(n, 0)}`],
                formulaHint: "Alkanol → Alkanal → Alkansäure",
                fields: [choiceField(rng, "Produkt", name, others)],
                steps: ["Primäre Alkanole werden zuerst zum Alkanal oxidiert.", "Das Alkanal wird zur Alkansäure oxidiert.", `<strong>${name} ${oxidationStepFormula(n, step)}</strong>`],
              };
            const before = carbonOxidation(functionalCarbon(n, 0).h, functionalCarbon(n, 0).o);
            const after = carbonOxidation(functionalCarbon(n, step).h, functionalCarbon(n, step).o);
            return {
              prompt: `${alkanolName(n)} wird zu ${name} oxidiert. Um wie viel steigt die Oxidationszahl des funktionellen C-Atoms?`,
              given: [],
              formulaHint: "OZ vorher und nachher bestimmen, Differenz bilden",
              fields: [numberField("Zunahme", after - before)],
              steps: [`${alkanolName(n)}: ${oxText(before)}`, `${name}: ${oxText(after)}`, `<strong>um ${after - before}</strong>`],
            };
          },
        },
        cases(
          "oxidation-alltag",
          [
            cc("Warum wird offener Wein mit der Zeit sauer?", "Ethanol wird zu Ethansäure oxidiert.", ["Ethanol verdampft und hinterlässt Zucker.", "Der Wein nimmt Kohlenstoffdioxid auf und wird alkalisch."], "Essigsäurebakterien oxidieren Ethanol mit Luftsauerstoff.", "Alkanol → Alkansäure."),
            cc("Welche funktionelle Gruppe hat ein Alkanal?", "Die Aldehydgruppe –CHO.", ["Die Hydroxygruppe –OH.", "Die Carboxygruppe –COOH."], "Alkanale stehen zwischen Alkanol und Alkansäure.", "Endung ‚-al‘."),
          ],
          [
            cc("Ein Kupferblech wird geglüht und in Methanol getaucht. Warum wird es wieder rot?", "Methanol reduziert Kupfer(II)-oxid zu Kupfer und wird selbst zu Methanal oxidiert.", ["Methanol reinigt das Blech, ohne zu reagieren.", "Kupfer wird oxidiert."], "Redoxreaktion: Cu²⁺ nimmt Elektronen auf.", "Was passiert mit dem schwarzen Belag?"),
            cc("Wodurch unterscheiden sich Ethanal und Ethansäure in der Oxidationszahl des C1-Atoms?", "Ethanal +I, Ethansäure +III.", ["Beide 0.", "Ethanal +III, Ethansäure +I."], "Eine weitere Bindung zu O ersetzt eine Bindung zu H: +2.", "Bindungen zu O zählen."),
          ],
        ),
      ],
    }),
    lesson(id, 5, {
      id: "ch-alkanone",
      title: "Sekundäre Alkanole und Alkanone",
      subtitle: "Wo die OH-Gruppe sitzt, entscheidet",
      bindings: { I: 4 },
      why: "Ob ein Alkanal oder ein Alkanon entsteht, hängt von der Stellung der OH-Gruppe ab.",
      html: "<p>Bei einem <strong>sekundären Alkanol</strong> sitzt die OH-Gruppe an einem C-Atom mit zwei C-Nachbarn, z. B. bei Propan-2-ol CH₃–CH(OH)–CH₃. Bei der Oxidation verliert dieses C-Atom sein einziges H-Atom; es entsteht eine C=O-Gruppe in der Kettenmitte, die <strong>Ketogruppe</strong>. Die Stoffklasse heißt <strong>Alkanone</strong>; Propan-2-ol wird zu Propanon (Aceton), Butan-2-ol zu Butanon.</p><p>Die Oxidationszahl des C-Atoms steigt von 0 auf +II. Anders als Alkanale lassen sich Alkanone unter Schulbedingungen nicht weiter oxidieren, weil am Carbonyl-C-Atom kein H-Atom mehr sitzt. Das primäre Isomer Propan-1-ol liefert dagegen Propanal und weiter Propansäure. Propanon ist ein wichtiges Lösungsmittel, z. B. in Nagellackentferner.</p><div class=\"example\"><strong>Beispiel:</strong> CH₃–CH(OH)–CH₃ + CuO → CH₃–CO–CH₃ + Cu + H₂O.</div>",
      rule: "sekundäres Alkanol → Alkanon (C=O in der Kette) · OZ des C-Atoms 0 → +II · keine weitere Oxidation",
      terms: [["Alkanon", "Ketogruppe C=O innerhalb der Kette", "Propanon CH₃–CO–CH₃"]],
      quiz: [
        "Welches Produkt entsteht bei der Oxidation von Butan-2-ol?",
        "Butanon",
        "Butanal",
        "Die OH-Gruppe sitzt an C2, einem C-Atom mit zwei C-Nachbarn.",
      ],
      lab: makeLab("alkanon"),
      exercises: [
        {
          id: "primaer-sekundaer",
          make(rng, level) {
            const alcohol = rng.pick(ALCOHOLS);
            const other = ALCOHOLS.find((a) => a.type !== alcohol.type && a.name.slice(0, 4) === alcohol.name.slice(0, 4)) ?? ALCOHOLS.find((a) => a.type !== alcohol.type)!;
            if (level === 1)
              return {
                prompt: `${alcohol.name} ist ein ${alcohol.type}es Alkanol. Welches Produkt entsteht bei einmaliger Oxidation?`,
                given: [],
                formulaHint: "primär → Alkanal · sekundär → Alkanon",
                fields: [choiceField(rng, "Produkt", alcohol.product, [other.product, `${alcohol.name.slice(0, alcohol.name.indexOf("an") + 2)}säure`])],
                steps: [`${alcohol.name}: ${alcohol.type}.`, alcohol.type === "primär" ? "Primäre Alkanole liefern Alkanale." : "Sekundäre Alkanole liefern Alkanone.", `<strong>${alcohol.product}</strong>`],
              };
            const delta = alcohol.after - alcohol.before;
            return {
              prompt: `${alcohol.name} wird zu ${alcohol.product} oxidiert. Um wie viel ändert sich die Oxidationszahl des C-Atoms, das die OH-Gruppe trug?`,
              given: [],
              formulaHint: "OZ vorher und nachher bestimmen",
              fields: [numberField("Änderung", delta)],
              steps: [`vorher: ${oxText(alcohol.before)}`, `nachher: ${oxText(alcohol.after)}`, `<strong>+${delta}</strong>`],
            };
          },
        },
        cases(
          "alkanon-fall",
          [
            cc("Woran erkennt man ein sekundäres Alkanol?", "Das C-Atom mit der OH-Gruppe hat zwei C-Nachbarn.", ["Es hat zwei OH-Gruppen.", "Die OH-Gruppe sitzt am Kettenende."], "Die Stellung der OH-Gruppe bestimmt die Klasse.", "Nachbarn des C-Atoms zählen."),
            cc("Warum wird Propanon nicht weiter zur Säure oxidiert?", "Am C-Atom der Ketogruppe sitzt kein H-Atom mehr.", ["Weil Propanon kein Sauerstoffatom hat.", "Weil Propanon ein Salz ist."], "Für eine weitere Oxidation müsste eine C–C-Bindung brechen.", "Was fehlt am C2?"),
          ],
          [
            cc("Zwei Isomere C₃H₇OH werden oxidiert; nur eines liefert eine saure Lösung nach weiterer Oxidation. Welches?", "Propan-1-ol: über Propanal zur Propansäure.", ["Propan-2-ol: über Propanon zur Propansäure.", "Beide gleich."], "Nur primäre Alkanole führen zur Alkansäure.", "Primär oder sekundär?"),
            cc("Nagellackentferner enthält Propanon. Aus welchem Alkanol kann es durch Oxidation hergestellt werden?", "Propan-2-ol", ["Propan-1-ol", "Ethanol"], "Die Ketogruppe entsteht an C2.", "Wo sitzt die C=O-Gruppe?"),
          ],
        ),
      ],
    }),
    lesson(id, 6, {
      id: "ch-estersynthese",
      title: "Estersynthese",
      subtitle: "Alkansäure + Alkanol ⇌ Ester + Wasser",
      bindings: { I: 4, II_III: 5 },
      why: "Fruchtaromen, Lösungsmittel und Fette sind Ester.",
      html: "<p>Erhitzt man Ethansäure und Ethanol mit einigen Tropfen konzentrierter Schwefelsäure als Katalysator, riecht es danach fruchtig nach Klebstoff. Es ist <strong>Ethansäureethylester</strong> entstanden. Die Carboxygruppe der Säure und die Hydroxygruppe des Alkanols reagieren; ein Wassermolekül wird abgespalten. Eine Reaktion, bei der sich zwei Moleküle unter Abspaltung eines kleinen Moleküls verbinden, heißt <strong>Kondensation</strong>. Die neue Gruppe –COO– ist die <strong>Estergruppe</strong>.</p><p>Die Estersynthese ist umkehrbar: Wasser kann den Ester wieder in Säure und Alkanol spalten (Esterspaltung). Man schreibt deshalb den Doppelpfeil ⇌. Der Name setzt sich aus Säure, Alkylrest des Alkanols und ‚ester‘ zusammen: Ethansäure + Methanol → Ethansäuremethylester.</p><div class=\"example\"><strong>Beispiel:</strong> CH₃–COOH + HO–CH₂–CH₃ ⇌ CH₃–COO–CH₂–CH₃ + H₂O.</div>",
      rule: "Alkansäure + Alkanol ⇌ Ester + Wasser (Kondensation, umkehrbar)",
      terms: [
        ["Estergruppe", "–COO–", ""],
        ["Kondensation", "Verknüpfung unter Abspaltung eines kleinen Moleküls (meist H₂O)", ""],
      ],
      quiz: [
        "Welches kleine Molekül wird bei der Estersynthese abgespalten?",
        "Wasser",
        "Kohlenstoffdioxid",
        "Die OH-Gruppe der Säure und das H-Atom der Hydroxygruppe bilden H₂O.",
      ],
      lab: makeLab("ester"),
      exercises: [
        {
          id: "estername",
          make(rng, level) {
            const n = rng.int(1, 4);
            const m = rng.int(1, 4);
            const name = esterName(n, m);
            if (level === 1)
              return {
                prompt: `${acidName(n)} reagiert mit ${alkanolName(m)}. Wie heißt der Ester?`,
                given: ["Name: Säure + Alkylrest + ester"],
                formulaHint: "Methyl-, Ethyl-, Propyl-, Butyl-",
                fields: [choiceField(rng, "Ester", name, [esterName(m === n ? (n % 4) + 1 : m, n), `${alkanolName(m)}${acidName(n).toLowerCase()}`])],
                steps: [`Säure: ${acidName(n)}.`, `Alkylrest von ${alkanolName(m)}: ${["Methyl", "Ethyl", "Propyl", "Butyl"][m - 1]}.`, `<strong>${name}</strong>`],
              };
            return {
              prompt: `Aus welchen Ausgangsstoffen wird ${name} hergestellt?`,
              given: [],
              formulaHint: "Vorderer Namensteil: Säure · Alkylrest: Alkanol",
              fields: [
                choiceField(rng, "Ausgangsstoffe", `${acidName(n)} und ${alkanolName(m)}`, [
                  `${acidName(m === n ? (n % 4) + 1 : m)} und ${alkanolName(n === m ? (m % 4) + 1 : n)}`,
                  `${alkanolName(n)} und Wasser`,
                ]),
              ],
              steps: ["Der Ester wird gedanklich an der Estergruppe gespalten.", `Säureteil: ${acidName(n)} · Alkoholteil: ${alkanolName(m)}.`, `<strong>${acidName(n)} und ${alkanolName(m)}</strong>`],
            };
          },
        },
        cases(
          "kondensation",
          [
            cc("Welche Rolle spielt die konzentrierte Schwefelsäure bei der Estersynthese?", "Sie wirkt als Katalysator.", ["Sie ist Ausgangsstoff und wird zum Ester.", "Sie neutralisiert den Ester."], "Sie beschleunigt die Reaktion, ohne verbraucht zu werden.", "Wird sie verbraucht?"),
            cc("Welche funktionellen Gruppen reagieren bei der Estersynthese?", "Carboxygruppe und Hydroxygruppe.", ["Aldehydgruppe und Aminogruppe.", "Zwei Carboxygruppen."], "Säure und Alkanol tragen –COOH und –OH.", "Welche Stoffe reagieren?"),
          ],
          [
            cc("Warum steht in der Gleichung der Estersynthese ein Doppelpfeil?", "Die Reaktion ist umkehrbar: Ester und Wasser bilden wieder Säure und Alkanol.", ["Weil zwei Ester entstehen.", "Weil die Reaktion nur in eine Richtung abläuft."], "Estersynthese und Esterspaltung laufen gleichzeitig ab.", "Hin- und Rückreaktion."),
            cc("Warum ist die Estersynthese eine Kondensation und keine Addition?", "Beim Verknüpfen wird Wasser abgespalten.", ["Weil eine Doppelbindung geöffnet wird.", "Weil Licht nötig ist."], "Addition liefert kein Nebenprodukt, Kondensation schon.", "Nebenprodukt?"),
          ],
        ),
      ],
    }),
    lesson(id, 7, {
      id: "ch-ester-eigenschaften",
      title: "Eigenschaften der Ester",
      subtitle: "Siedetemperatur, Löslichkeit und Geruch",
      bindings: { I: 4, II_III: 5 },
      why: "Ester riechen fruchtig und sieden niedrig, weil ihnen die OH-Gruppe fehlt.",
      html: "<p>Vergleicht man Stoffe mit fast gleicher Molekülmasse, zeigen sich große Unterschiede. Propansäure (74 u) siedet bei 141 °C, Butan-1-ol (74 u) bei 118 °C, Ethansäuremethylester (74 u) schon bei 57 °C. Säure- und Alkanolmoleküle bilden untereinander <strong>Wasserstoffbrücken</strong> über ihre OH-Gruppen. Estermoleküle haben keine O–H-Bindung; zwischen ihnen wirken nur schwächere Dipol-Dipol- und Van-der-Waals-Kräfte. Deshalb sind Ester leichtflüchtig und riechen intensiv.</p><p>Kurzkettige Ester lösen sich mäßig in Wasser: Ihre O-Atome können Wasserstoffbrücken von Wassermolekülen annehmen. Mit wachsendem Alkylrest überwiegt der unpolare Teil; Ester lösen sich dann gut in unpolaren Lösungsmitteln und lösen selbst Fette und Lacke. Viele Ester sind Aromastoffe: Butansäureethylester riecht nach Ananas, Ethansäurepentylester nach Banane.</p><div class=\"example\"><strong>Beispiel:</strong> Ethansäureethylester (Siedetemperatur 77 °C) siedet tiefer als Ethansäure (118 °C), obwohl sein Molekül größer ist.</div>",
      rule: "Ester: keine H-Brücken untereinander → niedrigere Siedetemperatur als Säure und Alkanol ähnlicher Masse",
      terms: [["Wasserstoffbrücke", "Anziehung zwischen δ+-H einer O–H-Gruppe und einem freien Elektronenpaar eines O-Atoms", ""]],
      quiz: [
        "Warum siedet Ethansäuremethylester tiefer als Propansäure mit gleicher Molekülmasse?",
        "Estermoleküle bilden untereinander keine Wasserstoffbrücken.",
        "Estermoleküle sind schwerer.",
        "Die Säure bildet über ihre OH-Gruppen Wasserstoffbrücken; dem Ester fehlt die O–H-Bindung.",
      ],
      lab: makeLab("ester-eig"),
      exercises: [
        {
          id: "siedevergleich",
          make(rng, level) {
            const [a, b] = rng.shuffle([0, 1, 2, 3]).slice(0, 2).map((i) => COMPARE_SUBSTANCES[i]);
            const higher = a.boiling > b.boiling ? a : b;
            const lower = higher === a ? b : a;
            if (level === 1)
              return {
                prompt: `Welcher Stoff hat die höhere Siedetemperatur: ${a.name} oder ${b.name}?`,
                given: [`${a.name}: H-Brücken ${a.bridges ? "ja" : "nein"}`, `${b.name}: H-Brücken ${b.bridges ? "ja" : "nein"}`],
                formulaHint: "Ähnliche Masse: Entscheidend sind die zwischenmolekularen Kräfte.",
                fields: [choiceField(rng, "Höhere Siedetemperatur", higher.name, [lower.name, "beide gleich"])],
                steps: ["Alle Stoffe haben fast dieselbe Molekülmasse.", "Mehr bzw. stärkere Wasserstoffbrücken → höhere Siedetemperatur.", `<strong>${higher.name}</strong> (${higher.boiling} °C gegenüber ${lower.boiling} °C)`],
              };
            const reason = higher.bridges && !lower.bridges
              ? `Zwischen den Molekülen von ${higher.name} wirken Wasserstoffbrücken, zwischen denen von ${lower.name} nicht.`
              : higher.bridges && lower.bridges
                ? `Beide bilden Wasserstoffbrücken; ${higher.name} bildet über die Carboxygruppe stärkere bzw. mehr davon.`
                : `Beide bilden keine Wasserstoffbrücken; ${higher.name} ist polar und hat zusätzlich Dipol-Dipol-Kräfte.`;
            return {
              prompt: `${higher.name} siedet bei ${higher.boiling} °C, ${lower.name} bei ${lower.boiling} °C. Welche Begründung ist fachlich richtig?`,
              given: [],
              formulaHint: "H-Brücken > Dipol-Dipol > Van-der-Waals bei ähnlicher Masse",
              fields: [choiceField(rng, "Begründung", reason, [`${higher.name} hat die deutlich größere Molekülmasse.`, `${lower.name} enthält Ionen.`])],
              steps: ["Die Molekülmassen sind fast gleich (72–74 u).", "Entscheidend sind die zwischenmolekularen Wechselwirkungen.", `<strong>${reason}</strong>`],
            };
          },
        },
        cases(
          "ester-alltag",
          [
            cc("Warum riechen viele Ester intensiv?", "Sie sind leichtflüchtig, weil zwischen ihren Molekülen nur schwache Kräfte wirken.", ["Weil sie Salze sind.", "Weil sie sehr hohe Siedetemperaturen haben."], "Flüchtige Stoffe erreichen leicht die Nase.", "Siedetemperatur."),
            cc("Wozu wird Ethansäureethylester im Alltag verwendet?", "Als Lösungsmittel in Klebstoffen und Nagellackentferner.", ["Als Speisesalz.", "Als Säure im Entkalker."], "Ester lösen Lacke und Fette.", "Klebstoffgeruch."),
          ],
          [
            cc("Ein langkettiger Ester löst sich kaum in Wasser, aber gut in Speiseöl. Warum?", "Der große unpolare Alkylteil überwiegt; gleiches löst sich in gleichem.", ["Ester sind Ionenverbindungen.", "Wasser zersetzt den Ester sofort."], "Polarität des gesamten Moleküls entscheidet.", "Polarer und unpolarer Anteil."),
            cc("Der Ester riecht nach Ananas, die Ausgangsstoffe Butansäure und Ethanol riechen ranzig bzw. alkoholisch. Was zeigt das?", "Es ist ein neuer Stoff mit neuen Eigenschaften entstanden.", ["Es liegt nur ein Gemisch vor.", "Der Geruch stammt vom Katalysator."], "Chemische Reaktion: neue Stoffe mit neuen Eigenschaften.", "Gemisch oder Reaktion?"),
          ],
        ),
      ],
    }),
  ],
};
