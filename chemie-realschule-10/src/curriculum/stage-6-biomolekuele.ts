import { FATTY_ACIDS, fatState } from "../chemistry/model";
import { fmt } from "../exercises/format";
import { makeLab } from "../lab/definitions";
import type { Stage } from "../model/types";
import { cases, cc, choiceField, lesson, numberField, withSlips } from "./helpers";

const id = "biomolekuele";
const PROTEINE = "C10 LB 5.1 (I) · C10 LB 6.2 (II/III), Wahlbereich";
const KOHLENHYDRATE = "C10 LB 5.2 (I) · C10 LB 6.3 (II/III), Wahlbereich";
const FETTE = "C10 LB 5.3 (I) · C10 LB 6.4 (II/III), Wahlbereich";

export const STAGE_BIOMOLEKUELE: Stage = {
  id,
  stageNumber: 6,
  title: "Biomoleküle",
  subtitle: "Proteine, Kohlenhydrate, Fette (Wahlbereich: deine Lehrkraft wählt zwei)",
  icon: "🧬",
  accent: "#ca8a04",
  badgeTitle: "Biomolekülbauer",
  lehrplanLabel: "C10 LB 5 (I) · C10 LB 6.2–6.4 (II/III)",
  lessons: [
    lesson(id, 1, {
      id: "ch-aminosaeuren",
      title: "Aminosäuren",
      subtitle: "Zwei funktionelle Gruppen in einem Molekül",
      bindings: { I: 5, II_III: 6 },
      lehrplan: PROTEINE,
      why: "Aminosäuren sind die Bausteine aller Proteine; ihre zwei Gruppen machen die Verknüpfung möglich.",
      html: "<p>Ein Aminosäuremolekül trägt an einem C-Atom eine <strong>Aminogruppe</strong> –NH₂ und eine <strong>Carboxygruppe</strong> –COOH, dazu ein H-Atom und einen Rest R. Die einfachste ist Glycin (R = H): H₂N–CH₂–COOH. In Proteinen kommen 20 verschiedene Aminosäuren vor; sie unterscheiden sich im Rest R, der polar, unpolar, sauer oder basisch sein kann.</p><p>Die funktionellen Gruppen lassen sich nachweisen. Erhitzt man Glycin trocken im Reagenzglas, entweicht Ammoniak, das angefeuchtetes Universalindikatorpapier blau färbt: Das Molekül enthält Stickstoff in einer Aminogruppe. Ein zweiter Nachweis der Aminogruppe ist die <strong>Ninhydrinreaktion</strong>: Mit Ninhydrin färbt sich eine Aminosäurelösung beim Erwärmen violett. Die Carboxygruppe gibt Protonen ab: Eine Aminosäurelösung reagiert mit einem unedlen Metall wie Magnesium, das entstehende Gas zeigt die Knallgasprobe als Wasserstoff. Aminosäuren mit einer zusätzlichen Carboxygruppe, wie Glutaminsäure, färben Universalindikator orange-rot. Einige Aminosäuren kann der Mensch nicht selbst herstellen; sie müssen mit der Nahrung aufgenommen werden (essenzielle Aminosäuren).</p><div class=\"example\"><strong>Beispiel:</strong> Alanin H₂N–CH(CH₃)–COOH: Rest R = CH₃.</div>",
      rule: "Aminosäure = Aminogruppe –NH₂ + Carboxygruppe –COOH + Rest R an einem C-Atom",
      terms: [
        ["Aminogruppe", "–NH₂", "Nachweis: trockenes Erhitzen (Indikatorpapier blau) oder Ninhydrin (violett)"],
        ["Carboxygruppe", "–COOH", "saure Reaktion"],
      ],
      quiz: [
        "Welche beiden funktionellen Gruppen hat jede Aminosäure?",
        "Aminogruppe und Carboxygruppe.",
        "Hydroxygruppe und Aldehydgruppe.",
        "Der Name verrät beide: Amino- und -säure.",
      ],
      lab: makeLab("aminogruppen"),
      exercises: [
        cases(
          "gruppen",
          [
            cc("Welche Gruppe ist in H₂N–CH₂–COOH für die saure Wirkung verantwortlich?", "Die Carboxygruppe –COOH.", ["Die Aminogruppe –NH₂.", "Die CH₂-Gruppe."], "Die O–H-Bindung der Carboxygruppe kann ein Proton abgeben.", "Säuregruppe suchen."),
            cc("Worin unterscheiden sich die 20 proteinogenen Aminosäuren?", "Im Rest R.", ["In der Zahl der Carboxygruppen am zentralen C-Atom.", "Sie unterscheiden sich gar nicht."], "Aminogruppe, Carboxygruppe und H-Atom sind bei allen gleich.", "Was ist variabel?"),
            cc("Welcher Befund zeigt Stickstoff in Glycin?", "Beim trockenen Erhitzen färbt sich angefeuchtetes Universalindikatorpapier blau.", ["Glycin entfärbt Bromwasser.", "Glycin trübt Kalkwasser ohne Verbrennung."], "Es entweicht Ammoniak NH₃.", "Welches Gas ist alkalisch?"),
          ],
          [
            cc("Warum muss der Mensch bestimmte Aminosäuren mit der Nahrung aufnehmen?", "Er kann diese essenziellen Aminosäuren nicht selbst herstellen.", ["Weil Aminosäuren im Körper nicht vorkommen.", "Weil sie nur als Energiequelle dienen."], "Ohne sie können bestimmte Proteine nicht gebildet werden.", "Was heißt essenziell?"),
            cc("Glutaminsäure färbt Universalindikator rot-orange, Glycin kaum. Was folgt für die Struktur?", "Glutaminsäure hat eine zusätzliche Carboxygruppe im Rest.", ["Glycin hat keine Aminogruppe.", "Glutaminsäure ist ein Salz."], "Der Rest R kann saure Gruppen enthalten.", "Unterschied im Rest."),
          ],
        ),
        cases(
          "aminosaeure-erkennen",
          [
            cc("Welche Formel zeigt eine Aminosäure?", "H₂N–CH(CH₃)–COOH", ["CH₃–CH₂–OH", "CH₃–COO–CH₃"], "Amino- und Carboxygruppe am selben C-Atom.", "Beide Gruppen suchen."),
            cc("Wie heißt die einfachste Aminosäure?", "Glycin", ["Glucose", "Glycerin"], "Bei Glycin ist der Rest ein H-Atom.", "Nicht mit Zucker und Glycerin verwechseln."),
          ],
          [
            cc("Ein Stoff enthält C, H, O und N, reagiert sauer und färbt sich mit Ninhydrin violett. Was ist er vermutlich?", "Eine Aminosäure mit zusätzlicher Säuregruppe.", ["Ein Fett.", "Ein Kohlenhydrat."], "Fette und Kohlenhydrate enthalten keinen Stickstoff.", "Welche Biomoleküle enthalten N?"),
            cc("Warum spielt die Kombination aus Amino- und Carboxygruppe eine Schlüsselrolle für Proteine?", "Die Gruppen zweier Aminosäuren können sich zu einer Peptidbindung verknüpfen.", ["Sie verhindern jede Verknüpfung.", "Sie machen Aminosäuren zu Fetten."], "Kondensation zwischen –COOH und –NH₂.", "Wie entstehen Ketten?"),
          ],
        ),
      ],
    }),
    lesson(id, 2, {
      id: "ch-peptide",
      title: "Peptidbindung und Primärstruktur",
      subtitle: "Aminosäuren zu Ketten verknüpfen",
      bindings: { I: 5, II_III: 6 },
      lehrplan: PROTEINE,
      why: "Die Reihenfolge der Aminosäuren macht jedes Protein einzigartig.",
      html: "<p>Die Carboxygruppe einer Aminosäure reagiert mit der Aminogruppe einer zweiten; dabei wird ein Wassermolekül abgespalten (<strong>Kondensation</strong>). Es entsteht die <strong>Peptidbindung</strong> –CO–NH–. Zwei Aminosäuren bilden ein Dipeptid, drei ein Tripeptid; viele Aminosäuren bilden Polypeptide und Proteine. Für n Aminosäuren entstehen n − 1 Peptidbindungen und n − 1 Wassermoleküle.</p><p>Die Reihenfolge der Aminosäuren heißt <strong>Primärstruktur</strong> (Aminosäuresequenz). Sie ist für jedes Protein festgelegt; tauscht man eine Aminosäure aus, kann das Protein seine Funktion verlieren. Mit 20 Aminosäuren gibt es für eine Kette aus n Bausteinen 20ⁿ mögliche Sequenzen. Proteine weist man mit der <strong>Biuret-Probe</strong> nach: Mit Natronlauge und wenig Kupfer(II)-sulfat-Lösung färben Moleküle mit mindestens zwei Peptidbindungen die Lösung violett.</p><div class=\"example\"><strong>Beispiel:</strong> Glycin + Alanin → Gly-Ala + H₂O: H₂N–CH₂–CO–NH–CH(CH₃)–COOH.</div>",
      rule: "–COOH + H₂N– → –CO–NH– + H₂O · n Aminosäuren → n − 1 Peptidbindungen",
      terms: [
        ["Peptidbindung", "–CO–NH–", "entsteht durch Kondensation"],
        ["Biuret-Probe", "violett", "ab zwei Peptidbindungen im Molekül"],
      ],
      quiz: [
        "Was versteht man unter der Primärstruktur eines Proteins?",
        "Die Reihenfolge der Aminosäuren in der Kette.",
        "Die schraubenförmige Windung der Kette.",
        "Die Sequenz ist die erste Ebene; Helix und Faltblatt sind Sekundärstruktur.",
      ],
      lab: makeLab("peptid"),
      exercises: [
        {
          id: "peptidbindungen",
          make(rng, level) {
            if (level === 1) {
              const n = rng.int(3, 12);
              return {
                prompt: `Ein Peptid besteht aus ${n} Aminosäuren. Wie viele Peptidbindungen enthält es, und wie viele Wassermoleküle wurden abgespalten?`,
                given: ["Jede Verknüpfung: eine Peptidbindung, ein H₂O"],
                formulaHint: "n Bausteine → n − 1 Verknüpfungen",
                fields: [withSlips(numberField("Peptidbindungen", n - 1), [n, "Eine Kette aus n Gliedern hat nur n − 1 Verbindungsstellen."]), withSlips(numberField("Wassermoleküle", n - 1), [n, "Jede Peptidbindung spaltet ein H₂O ab: so viele wie Bindungen, nicht wie Aminosäuren."])],
                steps: [`${n} Aminosäuren in einer Kette.`, `${n} − 1 = ${n - 1} Verknüpfungen.`, `<strong>${n - 1} und ${n - 1}</strong>`],
              };
            }
            const k = rng.int(2, 4);
            const count = [1, 1, 2, 6, 24][k];
            return {
              prompt: `Aus ${k} verschiedenen Aminosäuren soll ein Peptid entstehen, in dem jede genau einmal vorkommt. Wie viele verschiedene Primärstrukturen sind möglich?`,
              given: [],
              formulaHint: "Für die erste Stelle k Möglichkeiten, für die zweite k − 1, …",
              fields: [withSlips(numberField("Sequenzen", count), [k, "Die Reihenfolge zählt: Für jede Stelle gibt es eine Möglichkeit weniger. Multipliziere."])],
              steps: ["Die Reihenfolge zählt: Gly-Ala ist nicht Ala-Gly.", `${Array.from({ length: k }, (_, i) => k - i).join(" · ")}`, `<strong>${count}</strong>`],
            };
          },
        },
        cases(
          "kondensation-biuret",
          [
            cc("Welche Gruppen reagieren bei der Bildung einer Peptidbindung?", "Carboxygruppe der einen und Aminogruppe der anderen Aminosäure.", ["Zwei Aminogruppen.", "Zwei Carboxygruppen."], "Kondensation unter Wasserabspaltung.", "–COOH + H₂N–."),
            cc("Welche Farbe zeigt die Biuret-Probe bei Eiklar?", "Violett", ["Blau bleibt unverändert", "Rot"], "Proteine haben viele Peptidbindungen.", "Positiver Befund."),
          ],
          [
            cc("Warum ist die Biuret-Probe mit einer Glycin-Lösung negativ?", "Eine einzelne Aminosäure hat keine Peptidbindung.", ["Weil Glycin keinen Stickstoff enthält.", "Weil Glycin zu sauer ist."], "Die Probe zeigt Peptidbindungen, nicht Aminosäuren.", "Was weist die Probe nach?"),
            cc("Bei einer Erbkrankheit ist in einem Protein eine einzige Aminosäure ausgetauscht. Warum kann das Folgen haben?", "Die veränderte Primärstruktur kann Raumstruktur und Funktion verändern.", ["Ein Austausch ändert nie etwas.", "Das Protein wird dadurch zum Fett."], "Die Sequenz bestimmt, wie sich die Kette faltet.", "Struktur → Funktion."),
          ],
        ),
      ],
    }),
    lesson(id, 3, {
      id: "ch-proteinstruktur",
      title: "Sekundärstruktur und Denaturierung",
      subtitle: "Helix, Faltblatt und was sie zerstört",
      bindings: { I: 5, II_III: 6 },
      lehrplan: PROTEINE,
      why: "Hitze, Alkohol oder Schwermetalle zerstören die Raumstruktur von Proteinen, auch in deinem Körper.",
      html: "<p>Die Peptidkette faltet sich. <strong>Wasserstoffbrücken</strong> zwischen den C=O- und N–H-Gruppen der Peptidbindungen bilden die <strong>Sekundärstruktur</strong>: die schraubenförmige <strong>α-Helix</strong> oder das <strong>β-Faltblatt</strong> aus nebeneinanderliegenden Kettenabschnitten. Die Helix lässt sich dehnen wie eine Feder (z. B. Keratin in Haaren); das Faltblatt ist zugfest, aber kaum dehnbar (z. B. Seide). Die Primärstruktur legt fest, welche Sekundärstruktur entsteht.</p><p>Bei der <strong>Denaturierung</strong> werden diese Wechselwirkungen gestört; das Protein verliert seine Raumstruktur und meist seine Funktion. Ursachen sind hohe Temperatur, Ethanol, saure und alkalische Lösungen, Schwermetallionen (z. B. Blei-, Quecksilber- oder Kupferionen) und energiereiche Strahlung wie UV- oder Röntgenstrahlung. Die Peptidbindungen und damit die Primärstruktur bleiben dabei erhalten. Deshalb sind Schwermetallsalze giftig und Sonnenbrand schädigt Hautzellen.</p><div class=\"example\"><strong>Beispiel:</strong> Ein gekochtes Ei wird beim Abkühlen nicht wieder flüssig: Die Denaturierung ist hier nicht umkehrbar.</div>",
      rule: "Sekundärstruktur: H-Brücken → α-Helix (dehnbar) oder β-Faltblatt (zugfest) · Denaturierung: Raumstruktur zerstört, Sequenz bleibt",
      terms: [["Denaturierung", "Verlust der Raumstruktur", "Hitze, Ethanol, saure/alkalische Lösungen, Schwermetallionen, Strahlung"]],
      quiz: [
        "Was bleibt beim Denaturieren eines Proteins erhalten?",
        "Die Aminosäuresequenz (Primärstruktur).",
        "Die α-Helix.",
        "Denaturierung zerstört Wasserstoffbrücken und andere Wechselwirkungen, nicht die Peptidbindungen.",
      ],
      lab: makeLab("denaturierung"),
      exercises: [
        cases(
          "sekundaer",
          [
            cc("Welche Wechselwirkung hält die α-Helix zusammen?", "Wasserstoffbrücken zwischen Peptidbindungen.", ["Ionenbindungen zwischen Metallionen.", "Peptidbindungen zwischen Helixwindungen."], "C=O und N–H verschiedener Windungen bilden H-Brücken.", "Welche Gruppen liegen sich gegenüber?"),
            cc("Welche Struktur macht Seide zugfest, aber wenig dehnbar?", "β-Faltblatt", ["α-Helix", "Primärstruktur allein"], "Gestreckte, parallel liegende Ketten.", "Gestreckt oder gewunden?"),
          ],
          [
            cc("Haare lassen sich nass dehnen und springen zurück. Welche Struktur erklärt das?", "Die α-Helix des Keratins wirkt wie eine Feder.", ["Das β-Faltblatt, weil es dehnbar ist.", "Die Peptidbindungen brechen und bilden sich neu."], "Die Helix kann gestreckt werden, ohne dass die Kette bricht.", "Feder-Vergleich."),
            cc("Wodurch unterscheiden sich Primär- und Sekundärstruktur?", "Primär: Reihenfolge der Aminosäuren · sekundär: räumliche Faltung über H-Brücken.", ["Beide beschreiben die Reihenfolge.", "Primär: Faltung · sekundär: Reihenfolge."], "Zwei verschiedene Strukturebenen.", "Sequenz oder Form?"),
          ],
        ),
        cases(
          "denaturierung-fall",
          [
            cc("Warum desinfiziert Ethanol?", "Es denaturiert Proteine von Bakterien.", ["Es löst Bakterien in Ionen auf.", "Es spaltet alle Peptidbindungen."], "Ohne Raumstruktur funktionieren die Proteine nicht.", "Wirkung auf Proteine."),
            cc("Warum ist eine Bleisalzlösung giftig?", "Schwermetallionen denaturieren lebenswichtige Proteine.", ["Weil sie stark sauer ist.", "Weil sie radioaktiv ist."], "Schwermetallionen stören die Raumstruktur.", "Welche Ursache der Denaturierung?"),
          ],
          [
            cc("Warum ist hohes Fieber über 42 °C lebensgefährlich?", "Körpereigene Proteine beginnen zu denaturieren und verlieren ihre Funktion.", ["Weil Wasser im Körper siedet.", "Weil Peptidbindungen zu Fetten werden."], "Hitze stört die Wechselwirkungen der Raumstruktur.", "Temperatur und Proteine."),
            cc("Warum schützt Sonnencreme auch die Proteine der Haut?", "Sie hält energiereiche UV-Strahlung ab, die Proteine schädigt.", ["Sie liefert neue Aminosäuren.", "Sie neutralisiert Säuren."], "Energiereiche Strahlung denaturiert Proteine.", "Strahlung als Ursache."),
          ],
        ),
      ],
    }),
    lesson(id, 4, {
      id: "ch-glucose-fructose",
      title: "Glucose und Fructose",
      subtitle: "Zwei Zucker unterscheiden",
      bindings: { I: 5, II_III: 6 },
      lehrplan: KOHLENHYDRATE,
      why: "Glucose und Fructose haben dieselbe Summenformel, aber verschiedene Strukturen und Nachweise.",
      html: "<p><strong>Glucose</strong> (Traubenzucker) und <strong>Fructose</strong> (Fruchtzucker) haben beide die Summenformel C₆H₁₂O₆; sie sind Isomere. In Wasser liegen sie überwiegend als Ringe vor. In der <strong>Haworth-Projektion</strong> zeichnet man den Ring flach und schräg von vorne; alle Atomsymbole werden angegeben, die OH-Gruppen zeigen nach oben oder unten. Glucose bildet einen Sechsring aus fünf C-Atomen und einem O-Atom. Fructose zeichnet man als Fünfring aus vier C-Atomen und einem O-Atom, so wie sie in der Saccharose gebunden ist; gelöst liegt sie auch als Sechsring vor. Viele OH-Gruppen machen beide gut wasserlöslich und süß.</p><p>Zur Unterscheidung nutzt man zwei Nachweise. <strong>Glucoseteststäbchen</strong> enthalten ein Enzym, das nur Glucose umsetzt; die Testzone verfärbt sich. Die <strong>Seliwanow-Reaktion</strong> (Erhitzen mit Resorcin in Salzsäure) färbt Fructose schnell rot, Glucose in derselben Zeit nicht.</p><div class=\"example\"><strong>Beispiel:</strong> Honig: Teststäbchen positiv und Seliwanow positiv, er enthält Glucose und Fructose.</div>",
      rule: "Glucose: Sechsring, Teststäbchen positiv · Fructose: Fünfring, Seliwanow schnell rot · beide C₆H₁₂O₆",
      terms: [
        ["Glucose", "C₆H₁₂O₆, Sechsring (5 C + 1 O)", "Glucoseteststäbchen"],
        ["Fructose", "C₆H₁₂O₆, Fünfring (4 C + 1 O)", "Seliwanow-Reaktion"],
      ],
      quiz: [
        "Mit welchem Nachweis unterscheidest du Fructose von Glucose?",
        "Seliwanow-Reaktion: Fructose färbt sich schnell rot.",
        "Bromwasserprobe: Fructose entfärbt sie.",
        "Die Seliwanow-Reaktion verläuft mit Fructose schnell, mit Glucose nicht in derselben Zeit.",
      ],
      lab: makeLab("zucker"),
      exercises: [
        cases(
          "zucker-nachweis",
          [
            cc("Ein Glucoseteststäbchen verfärbt sich in einer Probe. Was ist nachgewiesen?", "Glucose", ["Fructose", "Stärke"], "Das Enzym auf dem Stäbchen setzt nur Glucose um.", "Name des Teststäbchens."),
            cc("Welche Summenformel haben Glucose und Fructose?", "C₆H₁₂O₆", ["C₁₂H₂₂O₁₁", "C₆H₁₀O₅"], "Beide sind Isomere mit gleicher Summenformel.", "Monosaccharide mit sechs C-Atomen."),
          ],
          [
            cc("Eine Probe: Teststäbchen negativ, Seliwanow rot, auch nach Kochen mit Säure bleibt das Teststäbchen negativ. Was enthält sie?", "Fructose, keine Glucose.", ["Saccharose.", "Glucose."], "Saccharose würde nach der Spaltung Glucose liefern.", "Was zeigt die Säurespaltung?"),
            cc("Warum lösen sich Glucose und Fructose gut in Wasser?", "Ihre vielen OH-Gruppen bilden Wasserstoffbrücken mit Wasser.", ["Sie zerfallen in Ionen.", "Sie sind unpolare Moleküle."], "Hydroxygruppen sind hydrophil.", "Funktionelle Gruppen."),
          ],
        ),
        cases(
          "haworth",
          [
            cc("Welcher Ring kennzeichnet Glucose in der Haworth-Projektion?", "Ein Sechsring aus fünf C-Atomen und einem O-Atom.", ["Ein Fünfring aus fünf C-Atomen.", "Ein Sechsring nur aus C-Atomen wie bei Benzol."], "Der Ring-Sauerstoff gehört zum Ring.", "Atome im Ring zählen."),
            cc("Was gibt man in der Haworth-Projektion nach LehrplanPLUS an?", "Alle Atomsymbole einschließlich der H-Atome und OH-Gruppen.", ["Nur die C-Atome.", "Nur die Summenformel."], "Die Darstellung soll die vollständige Struktur zeigen.", "Vollständigkeit."),
          ],
          [
            cc("Glucose und Fructose haben dieselbe Summenformel. Warum sind es trotzdem verschiedene Stoffe?", "Ihre Atome sind verschieden verknüpft (Isomere).", ["Sie haben verschiedene Molekülmassen.", "Fructose enthält Stickstoff."], "Gleiche Summenformel, andere Struktur, andere Eigenschaften.", "Was unterscheidet Isomere?"),
            cc("Wie viele Atome bilden den Ring der Fructose in der Haworth-Projektion?", "Fünf: vier C-Atome und ein O-Atom.", ["Sechs: fünf C-Atome und ein O-Atom.", "Sechs C-Atome."], "Fructose bildet in Lösung bevorzugt einen Fünfring.", "Fünf- oder Sechsring?"),
          ],
        ),
      ],
    }),
    lesson(id, 5, {
      id: "ch-saccharose-polysaccharide",
      title: "Saccharose, Stärke und Cellulose",
      subtitle: "Kondensation zu Di- und Polysacchariden",
      bindings: { I: 5, II_III: 6 },
      lehrplan: KOHLENHYDRATE,
      why: "Aus denselben Glucosebausteinen entstehen Energiespeicher und Pflanzenfasern.",
      html: "<p>Haushaltszucker <strong>Saccharose</strong> C₁₂H₂₂O₁₁ ist ein Disaccharid: Ein Glucose- und ein Fructosemolekül sind unter Abspaltung von Wasser verknüpft (<strong>Kondensation</strong>). Kocht man Saccharose mit verdünnter Säure, wird sie wieder gespalten: Danach sind Glucose und Fructose nachweisbar.</p><p>Viele Glucosebausteine verknüpfen sich zu Polysacchariden (<strong>Polykondensation</strong>). <strong>Amylose</strong>, ein Bestandteil der Stärke, bildet eine schraubenförmige Kette; sie dient Pflanzen als Energiespeicher und uns als Nahrung. Iod-Kaliumiodid-Lösung färbt sie blau-violett, weil sich Iod in die Schraube einlagert. <strong>Cellulose</strong> besteht aus gestreckten Ketten, die durch Wasserstoffbrücken zu reißfesten Fasern gebündelt sind; sie ist Gerüststoff der Zellwand und für uns unverdaulicher Ballaststoff. Chlorzinkiod-Lösung färbt Cellulose blau-violett. Der Unterschied liegt in der Art, wie die Glucosebausteine verknüpft sind.</p><div class=\"example\"><strong>Beispiel:</strong> Aus 10 Glucosemolekülen entsteht ein Kettenausschnitt mit 9 Verknüpfungen; 9 Wassermoleküle werden frei.</div>",
      rule: "Glucose + Fructose → Saccharose + H₂O · n Glucose → Polysaccharid + (n − 1) H₂O",
      terms: [
        ["Saccharose", "C₁₂H₂₂O₁₁ = Glucose + Fructose − H₂O", ""],
        ["Nachweise", "Amylose: Iod-Kaliumiodid blau-violett · Cellulose: Chlorzinkiod blau-violett", ""],
      ],
      quiz: [
        "Warum kann der Mensch Stärke verdauen, Cellulose aber nicht, obwohl beide aus Glucose bestehen?",
        "Die Glucosebausteine sind verschieden verknüpft; unsere Enzyme spalten nur die Verknüpfung der Stärke.",
        "Cellulose enthält keine Glucose.",
        "Gleiche Bausteine, andere Verknüpfung: andere Struktur und andere biologische Bedeutung.",
      ],
      lab: makeLab("polysaccharid"),
      exercises: [
        {
          id: "kondensation-zucker",
          make(rng, level) {
            const n = rng.int(3, 20);
            if (level === 1)
              return {
                prompt: `Ein Amylose-Ausschnitt besteht aus ${n} Glucosebausteinen. Wie viele Wassermoleküle wurden bei seiner Bildung abgespalten?`,
                given: ["Jede Verknüpfung spaltet ein H₂O ab."],
                formulaHint: "n Bausteine → n − 1 Verknüpfungen",
                fields: [withSlips(numberField("Wassermoleküle", n - 1), [n, "Eine Kette aus n Bausteinen hat nur n − 1 Verknüpfungen."])],
                steps: [`${n} Glucosebausteine.`, `${n} − 1 = ${n - 1} Verknüpfungen.`, `<strong>${n - 1} H₂O</strong>`],
              };
            const mass = n * 180 - (n - 1) * 18;
            return {
              prompt: `Berechne die molare Masse eines Kettenausschnitts aus ${n} Glucosebausteinen (M(Glucose) = 180 g/mol, M(Wasser) = 18 g/mol).`,
              given: [],
              formulaHint: "n · 180 g/mol − (n − 1) · 18 g/mol",
              fields: [withSlips(numberField("M", mass, "g/mol"), [n * 180, "Bei jeder Verknüpfung wird ein Wassermolekül abgespalten: Ziehe (n − 1) · 18 g/mol ab."], [n * 180 - n * 18, "Es gibt nur n − 1 Verknüpfungen, also n − 1 abgespaltene Wassermoleküle."])],
              steps: [`${n} · 180 g/mol = ${fmt(n * 180, 0)} g/mol`, `− ${n - 1} · 18 g/mol = − ${fmt((n - 1) * 18, 0)} g/mol`, `<strong>${fmt(mass, 0)} g/mol</strong>`],
            };
          },
        },
        cases(
          "staerke-cellulose",
          [
            cc("Welcher Nachweis zeigt Stärke in einer Kartoffel?", "Iod-Kaliumiodid-Lösung färbt sich blau-violett.", ["Bromwasser wird entfärbt.", "Glucoseteststäbchen verfärbt sich sofort."], "Iod lagert sich in die Amyloseschraube ein.", "Iodprobe."),
            cc("Aus welchen Bausteinen besteht Saccharose?", "Glucose und Fructose", ["Zwei Glucosebausteine", "Glycerin und Fettsäuren"], "Saccharose ist ein Disaccharid aus zwei verschiedenen Monosacchariden.", "Seliwanow und Teststäbchen nach Spaltung."),
          ],
          [
            cc("Warum ist Cellulose reißfester als Stärke?", "Gestreckte Ketten liegen parallel und sind über viele Wasserstoffbrücken zu Fasern verbunden.", ["Cellulose enthält Metallionen.", "Stärke besteht aus Ionen."], "Struktur bestimmt die Eigenschaft.", "Gestreckt oder schraubig?"),
            cc("Warum ist Saccharose-Lösung mit dem Glucoseteststäbchen negativ, nach Kochen mit Säure aber positiv?", "Die Säure spaltet Saccharose; erst dann liegt freie Glucose vor.", ["Säure verwandelt Fructose in Salz.", "Das Teststäbchen reagiert nur bei Wärme."], "Hydrolyse ist die Umkehr der Kondensation.", "Was macht die Säure?"),
          ],
        ),
      ],
    }),
    lesson(id, 6, {
      id: "ch-glycerin",
      title: "Glycerin",
      subtitle: "Ein Alkohol mit drei OH-Gruppen",
      bindings: { I: 5, II_III: 6 },
      lehrplan: FETTE,
      why: "Glycerin ist das Grundgerüst aller Fette, und seine Eigenschaften verraten seine Struktur.",
      html: "<p><strong>Glycerin</strong> (Propan-1,2,3-triol) hat die Formel HO–CH₂–CH(OH)–CH₂–OH: An jedem der drei C-Atome sitzt eine Hydroxygruppe. Experimentelle Befunde bestätigen das. Glycerin verbrennt, und das Abgas trübt Kalkwasser: Es ist eine Kohlenstoffverbindung. Es mischt sich in jedem Verhältnis mit Wasser, aber kaum mit Heptan: Das Molekül ist stark polar. Es ist zähflüssig und siedet erst bei etwa 290 °C, obwohl seine Molekülmasse (92 u) klein ist.</p><p>Die Erklärung liefern die drei OH-Gruppen: Jedes Molekül bildet viele <strong>Wasserstoffbrücken</strong> zu Nachbarmolekülen und zu Wasser. Glycerin hält deshalb Feuchtigkeit fest und wird in Hautcremes, Zahnpasta und Lebensmitteln (E 422) verwendet. In Fetten ist jede OH-Gruppe mit einer Fettsäure verestert.</p><div class=\"example\"><strong>Beispiel:</strong> Propan-1-ol (60 u, eine OH-Gruppe) siedet bei 97 °C, Glycerin (92 u, drei OH-Gruppen) bei etwa 290 °C.</div>",
      rule: "Glycerin = Propan-1,2,3-triol: drei OH-Gruppen → viele H-Brücken → zähflüssig, hohe Siedetemperatur, wasserlöslich",
      terms: [["Glycerin", "HO–CH₂–CH(OH)–CH₂–OH", "Propan-1,2,3-triol"]],
      quiz: [
        "Warum ist Glycerin zähflüssig?",
        "Seine Moleküle bilden über drei OH-Gruppen viele Wasserstoffbrücken.",
        "Glycerin ist ein Salz mit Ionengitter.",
        "Viele starke zwischenmolekulare Kräfte behindern das Aneinandervorbeigleiten.",
      ],
      lab: makeLab("glycerin"),
      exercises: [
        cases(
          "glycerin-befund",
          [
            cc("Wie viele Hydroxygruppen hat ein Glycerinmolekül?", "Drei", ["Eine", "Zwei"], "An jedem C-Atom sitzt eine OH-Gruppe: Propan-1,2,3-triol.", "Endung ‚-triol‘."),
            cc("Welcher Befund zeigt, dass Glycerin polar ist?", "Es mischt sich in jedem Verhältnis mit Wasser.", ["Es verbrennt mit Flamme.", "Es ist farblos."], "Gleiches löst sich in gleichem.", "Löslichkeit."),
          ],
          [
            cc("Glycerin siedet viel höher als Propan-1-ol, obwohl beide drei C-Atome haben. Warum?", "Drei OH-Gruppen bilden deutlich mehr Wasserstoffbrücken als eine.", ["Glycerin ist ein Ionengitter.", "Propan-1-ol hat keine OH-Gruppe."], "Mehr H-Brücken je Molekül → stärkerer Zusammenhalt.", "OH-Gruppen zählen."),
            cc("Warum wird Glycerin in Hautcremes als Feuchthaltemittel eingesetzt?", "Seine OH-Gruppen binden Wassermoleküle über Wasserstoffbrücken.", ["Es macht die Haut alkalisch.", "Es verdunstet sofort und kühlt."], "Hygroskopisch durch viele OH-Gruppen.", "Struktur → Verwendung."),
          ],
        ),
        cases(
          "glycerin-struktur",
          [
            cc("Welche Formel beschreibt Glycerin?", "HO–CH₂–CH(OH)–CH₂–OH", ["CH₃–CH₂–CH₂–OH", "HOOC–CH₂–COOH"], "Drei C-Atome, jedes mit einer OH-Gruppe.", "Triol."),
            cc("Welche Stoffklasse ist Glycerin?", "Ein Alkohol (Alkanol mit drei OH-Gruppen).", ["Eine Carbonsäure.", "Ein Ester."], "Die funktionelle Gruppe ist –OH.", "Funktionelle Gruppe bestimmen."),
          ],
          [
            cc("Glycerin brennt, Kochsalz nicht. Was folgt für Glycerin?", "Es ist eine organische Verbindung mit Kohlenstoffgerüst.", ["Es ist ein Metall.", "Es enthält kein Wasserstoffatom."], "Verbrennung + Kalkwassertrübung zeigen Kohlenstoff.", "Organisch oder anorganisch?"),
            cc("Welche Rolle spielt Glycerin in einem Fettmolekül?", "Es ist der Alkohol, dessen drei OH-Gruppen mit Fettsäuren verestert sind.", ["Es ist die Säure des Esters.", "Es ist im Fett nur gelöst."], "Fette sind Triester des Glycerins.", "Ester aus Alkohol und Säure."),
          ],
        ),
      ],
    }),
    lesson(id, 7, {
      id: "ch-fette",
      title: "Fette und fette Öle",
      subtitle: "Trifettsäureglycerinester",
      bindings: { I: 5, II_III: 6 },
      lehrplan: FETTE,
      why: "Ob ein Fett fest oder flüssig ist und wie gesund es ist, hängt an seinen Fettsäuren.",
      html: "<p>Ein Fettmolekül ist ein <strong>Ester</strong> aus einem Glycerinmolekül und drei Fettsäuremolekülen (<strong>Trifettsäureglycerinester</strong>); bei seiner Bildung werden drei Wassermoleküle abgespalten. Fettsäuren sind langkettige Alkansäuren. <strong>Gesättigte</strong> Fettsäuren wie Stearinsäure haben nur Einfachbindungen; ihre gestreckten Ketten lagern sich dicht aneinander, die Van-der-Waals-Kräfte sind stark: Das Fett ist bei Raumtemperatur fest. <strong>Ungesättigte</strong> Fettsäuren wie Ölsäure haben C=C-Doppelbindungen, die einen Knick in die Kette bringen; die Moleküle liegen lockerer: fette Öle sind flüssig. Doppelbindungen entfärben Bromwasser.</p><p>Fette sind unpolar: Sie lösen sich nicht in Wasser, aber in Heptan. Sie sind brennbar und liefern rund 37 kJ/g. Als Nahrungsmittel liefern sie Energie und lebenswichtige mehrfach ungesättigte Fettsäuren; zu viel gesättigtes Fett gilt als ungesund. Als nachwachsender Rohstoff dienen fette Öle für Biodiesel, Seifen und Schmierstoffe; dabei konkurrieren sie mit der Ernährung.</p><div class=\"example\"><strong>Beispiel:</strong> Tristearin C₅₇H₁₁₀O₆ ist fest; Triolein mit drei Ölsäureresten ist flüssig und entfärbt Bromwasser.</div>",
      rule: "Glycerin + 3 Fettsäuren → Fett + 3 H₂O · höchstens ein ungesättigter Rest → eher fest · zwei oder drei ungesättigte Reste (C=C) → eher flüssig",
      terms: [
        ["Fett", "Trifettsäureglycerinester", "Glycerin + 3 Fettsäuren − 3 H₂O"],
        ["Fettsäuren", "Palmitinsäure C₁₅H₃₁COOH · Stearinsäure C₁₇H₃₅COOH · Ölsäure C₁₇H₃₃COOH", ""],
      ],
      quiz: [
        "Warum ist Olivenöl bei Raumtemperatur flüssig, Butterfett eher fest?",
        "Olivenöl enthält mehr ungesättigte Fettsäurereste mit geknickten Ketten.",
        "Olivenöl enthält Wasser zwischen den Molekülen.",
        "Geknickte Ketten lagern sich weniger dicht; die Van-der-Waals-Kräfte sind schwächer.",
      ],
      lab: makeLab("fett"),
      exercises: [
        {
          id: "fett-bau",
          make(rng, level) {
            const acids = [rng.pick(FATTY_ACIDS), rng.pick(FATTY_ACIDS), rng.pick(FATTY_ACIDS)];
            const bonds = acids.reduce((n, a) => n + a.doubleBonds, 0);
            const names = acids.map((a) => a.name).join(", ");
            if (level === 1)
              return {
                prompt: `Ein Fettmolekül enthält die Reste von ${names}. Wie viele C=C-Doppelbindungen hat es?`,
                given: acids.map((a) => `${a.name}: ${a.doubleBonds} C=C`),
                formulaHint: "Doppelbindungen der drei Reste addieren",
                fields: [withSlips(numberField("C=C", bonds), [acids.filter((a) => a.doubleBonds > 0).length, "Linolsäure und Linolensäure haben mehr als eine Doppelbindung: Addiere die Zahlen."])],
                steps: ["Glycerin selbst hat keine Doppelbindung.", acids.map((a) => a.doubleBonds).join(" + "), `<strong>${bonds}</strong>`],
              };
            const unsaturated = acids.filter((a) => a.doubleBonds > 0).length;
            const state = fatState(acids) === "fest" ? "eher fest" : "eher flüssig";
            const bromine = bonds > 0 ? "entfärbt" : "bleibt braun";
            return {
              prompt: `Ein Fettmolekül enthält die Reste von ${names}. Ist es bei 20 °C eher fest oder flüssig, und wie verhält es sich gegenüber Bromwasser?`,
              given: [],
              formulaHint: "Ungesättigte Reste zählen: ab zwei eher flüssig; Doppelbindungen entfärben Bromwasser.",
              fields: [
                choiceField(rng, "Bei 20 °C", state, [state === "eher fest" ? "eher flüssig" : "eher fest", "gasförmig"]),
                choiceField(rng, "Bromwasser", bromine, [bonds > 0 ? "bleibt braun" : "entfärbt", "wird blau"]),
              ],
              steps: [
                `Ungesättigte Reste: ${unsaturated}, Doppelbindungen: ${bonds}.`,
                `${unsaturated >= 2 ? "Zwei oder drei geknickte Ketten → lockere Packung → eher flüssig" : "Höchstens eine geknickte Kette → dichte Packung → eher fest"}; ${bonds > 0 ? "C=C addiert Brom" : "ohne C=C wird kein Brom addiert"}.`,
                `<strong>${state}; Bromwasser ${bromine}</strong>`,
              ],
            };
          },
        },
        cases(
          "fett-bedeutung",
          [
            cc("Welche Produkte entstehen neben dem Fett bei der Veresterung von Glycerin mit drei Fettsäuren?", "Drei Wassermoleküle.", ["Ein Wassermolekül.", "Drei Kohlenstoffdioxidmoleküle."], "Jede der drei Esterbindungen spaltet ein H₂O ab.", "Kondensation dreimal."),
            cc("Warum löst sich Fett nicht in Wasser?", "Fettmoleküle sind überwiegend unpolar.", ["Fett besteht aus Ionen.", "Fett ist schwerer als Wasser."], "Lange Kohlenwasserstoffketten sind unpolar.", "Polarität."),
          ],
          [
            cc("Rapsöl kann als Speiseöl oder als Biodiesel genutzt werden. Welche Abwägung ist sachgerecht?", "Biodiesel aus Raps spart fossile Rohstoffe, konkurriert aber mit Nahrungsmitteln um Ackerfläche.", ["Raps hat als Nahrungsmittel keinen Wert.", "Biodiesel ist völlig emissionsfrei."], "Nahrungsmittel gegen Energieträger abwägen.", "Teller oder Tank."),
            cc("Ernährungsempfehlungen raten zu Ölen mit mehrfach ungesättigten Fettsäuren. Woran erkennt man sie im Versuch?", "Sie entfärben viel Bromwasser, weil sie viele C=C-Doppelbindungen haben.", ["Sie trüben Kalkwasser stärker.", "Sie färben Iodlösung blau."], "Je mehr Doppelbindungen, desto mehr Brom wird addiert.", "Bromwasserprobe."),
          ],
        ),
      ],
    }),
  ],
};
