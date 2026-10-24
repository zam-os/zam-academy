import { CONDENSATES, makeLab, POLYMERS, siliconeType } from "../lab/definitions";
import type { Stage } from "../model/types";
import { cases, cc, choiceField, lesson, numberField, withSlips } from "./helpers";

const id = "werkstoffe";
const KUNSTSTOFFE = "C10 LB 6 (I) · C10 LB 6.5 (II/III), Wahlbereich";

export const STAGE_WERKSTOFFE: Stage = {
  id,
  stageNumber: 7,
  title: "Kunststoffe und Silikone",
  subtitle: "Moderne Werkstoffe herstellen, ordnen und bewerten",
  icon: "🧴",
  accent: "#2563eb",
  badgeTitle: "Werkstoffkenner",
  lehrplanLabel: "C10 LB 6 (I) · C10 LB 6.5 (II/III)",
  lessons: [
    lesson(id, 1, {
      id: "ch-polymerisation",
      title: "Radikalische Polymerisation",
      subtitle: "Aus Doppelbindungen werden lange Ketten",
      bindings: { I: 6, II_III: 6 },
      lehrplan: KUNSTSTOFFE,
      why: "PE, PP, PVC und PS, die häufigsten Kunststoffe, entstehen alle auf diesem Weg.",
      html: "<p>Kunststoffe bestehen aus Riesenmolekülen, den <strong>Polymeren</strong>, die aus vielen kleinen Bausteinen, den <strong>Monomeren</strong>, aufgebaut sind. Monomere mit einer C=C-Doppelbindung, z. B. Ethen, Propen, Chlorethen (Vinylchlorid) oder Styrol, verknüpfen sich durch <strong>Polymerisation</strong>: Die Doppelbindungen öffnen sich, und die Monomere lagern sich aneinander. Es entsteht kein Nebenprodukt.</p><p>Bei der <strong>radikalischen Polymerisation</strong> zerfällt zuerst ein Starter in Radikale (Start). Ein Radikal öffnet die Doppelbindung eines Monomers und bindet an ein C-Atom; das andere C-Atom wird zum neuen Radikal, das das nächste Monomer angreift (Kettenwachstum). Treffen zwei Radikalenden aufeinander, verbinden sie sich (Abbruch). In der Strukturformel des Polymers erkennt man die <strong>Wiederholungseinheit</strong> in eckigen Klammern mit Index n. Umgekehrt findet man das Monomer, indem man eine Wiederholungseinheit herausschneidet und zwischen ihren beiden C-Atomen eine Doppelbindung zeichnet.</p><div class=\"example\"><strong>Beispiel:</strong> n CH₂=CHCl → [–CH₂–CHCl–]ₙ: aus Chlorethen entsteht Polyvinylchlorid (PVC).</div>",
      rule: "n Monomere mit C=C → [Wiederholungseinheit]ₙ · Start → Kettenwachstum → Abbruch · kein Nebenprodukt",
      terms: [
        ["PE", "[–CH₂–CH₂–]ₙ aus Ethen", ""],
        ["PP", "[–CH₂–CH(CH₃)–]ₙ aus Propen", ""],
        ["PVC", "[–CH₂–CHCl–]ₙ aus Chlorethen", ""],
        ["PS", "[–CH₂–CH(C₆H₅)–]ₙ aus Styrol", ""],
      ],
      quiz: [
        "Welche Voraussetzung muss ein Monomer für die Polymerisation erfüllen?",
        "Es braucht eine C=C-Doppelbindung.",
        "Es braucht zwei Carboxygruppen.",
        "Die Doppelbindung wird geöffnet; ihre Elektronen bilden die neuen Bindungen zur Kette.",
      ],
      lab: makeLab("polymerisation"),
      exercises: [
        {
          id: "monomer-polymer",
          make(rng, level) {
            const index = rng.int(0, POLYMERS.length - 1);
            const p = POLYMERS[index];
            const others = POLYMERS.filter((_, i) => i !== index);
            if (level === 1)
              return {
                prompt: `Welches Polymer entsteht durch Polymerisation von ${p.monomer}?`,
                given: [`Wiederholungseinheit: [${p.unit}]ₙ`],
                formulaHint: "Polymer = ‚Poly‘ + Name des Monomers",
                fields: [choiceField(rng, "Polymer", p.polymer, rng.shuffle(others).slice(0, 2).map((o) => o.polymer))],
                steps: [`Die Doppelbindung von ${p.monomer} öffnet sich.`, `Wiederholungseinheit [${p.unit}]ₙ.`, `<strong>${p.polymer}</strong>`],
              };
            return {
              prompt: `Ein Kunststoff hat die Wiederholungseinheit [${p.unit}]ₙ. Aus welchem Monomer wurde er hergestellt?`,
              given: [],
              formulaHint: "Eine Einheit herausschneiden, C=C einzeichnen",
              fields: [choiceField(rng, "Monomer", p.monomer, rng.shuffle(others).slice(0, 2).map((o) => o.monomer))],
              steps: ["Die beiden C-Atome der Hauptkette in der Einheit stammen aus der Doppelbindung.", `Zwischen ihnen wieder eine Doppelbindung zeichnen.`, `<strong>${p.monomer}</strong>`],
            };
          },
        },
        cases(
          "mechanismus",
          [
            cc("Was geschieht beim Kettenwachstum der radikalischen Polymerisation?", "Das Radikal am Kettenende öffnet die Doppelbindung des nächsten Monomers.", ["Zwei Monomere spalten Wasser ab.", "Die Kette zerfällt in Monomere."], "Das Radikal wandert ans neue Kettenende.", "Wo sitzt das ungepaarte Elektron?"),
            cc("Wodurch endet das Kettenwachstum?", "Zwei Radikale verbinden sich (Abbruch).", ["Durch Zugabe von Wasser.", "Gar nicht; die Kette wächst unendlich."], "Ohne Radikal kein weiteres Wachstum.", "Radikal + Radikal."),
          ],
          [
            cc("Warum entsteht bei der Polymerisation kein Nebenprodukt, bei der Polykondensation aber Wasser?", "Polymerisation ist eine Folge von Additionen; bei Kondensationen wird ein kleines Molekül abgespalten.", ["Weil Polymerisation nur im Wasser abläuft.", "Weil bei der Polykondensation Doppelbindungen geöffnet werden."], "Reaktionstyp bestimmt die Bilanz.", "Addition oder Kondensation?"),
            cc("Ein Polymer zeigt die Einheit –CH₂–CH(CH₃)–. Warum ist es kein Polyethen?", "Jede zweite Kohlenstoffeinheit trägt eine CH₃-Gruppe: Das Monomer war Propen.", ["Weil Polyethen keinen Kohlenstoff enthält.", "Weil Polyethen nur aus CH₃-Gruppen besteht."], "Die Seitengruppe verrät das Monomer.", "Seitengruppen lesen."),
          ],
        ),
      ],
    }),
    lesson(id, 2, {
      id: "ch-polykondensation",
      title: "Polykondensation",
      subtitle: "Polyester und Polyamide",
      bindings: { I: 6, II_III: 6 },
      lehrplan: KUNSTSTOFFE,
      why: "PET-Flaschen und Nylonstrümpfe entstehen, wenn Monomere mit zwei funktionellen Gruppen kondensieren.",
      html: "<p>Bei der <strong>Polykondensation</strong> verknüpfen sich Monomere, die jeweils <strong>zwei funktionelle Gruppen</strong> tragen; bei jeder Verknüpfung wird ein kleines Molekül, meist Wasser, abgespalten. Ein Diol (zwei OH-Gruppen) und eine Dicarbonsäure (zwei COOH-Gruppen) bilden einen <strong>Polyester</strong>, z. B. PET aus Ethandiol und Benzol-1,4-dicarbonsäure. Ein Diamin (zwei NH₂-Gruppen) und eine Dicarbonsäure bilden ein <strong>Polyamid</strong>, z. B. Nylon; die Amidbindung –CO–NH– gleicht der Peptidbindung.</p><p>Auch ein Monomer mit zwei verschiedenen Gruppen funktioniert: Milchsäure trägt eine OH- und eine COOH-Gruppe und bildet den Polyester Polymilchsäure (PLA). Hätte ein Monomer nur eine funktionelle Gruppe, entstünde nur ein kleines Molekül, keine Kette. Umgekehrt findet man die Monomere, indem man die Ester- oder Amidbindungen gedanklich spaltet und Wasser wieder anfügt.</p><div class=\"example\"><strong>Beispiel:</strong> HO–CH₂–CH₂–OH + HOOC–R–COOH → …–O–CH₂–CH₂–O–CO–R–CO–… + H₂O je Verknüpfung.</div>",
      rule: "Monomere mit je zwei funktionellen Gruppen → Polymer + kleine Moleküle (H₂O) · Diol + Dicarbonsäure → Polyester · Diamin + Dicarbonsäure → Polyamid",
      terms: [
        ["Polyester", "Esterbindung –CO–O–", "PET, PLA"],
        ["Polyamid", "Amidbindung –CO–NH–", "Nylon"],
      ],
      quiz: [
        "Warum braucht jedes Monomer der Polykondensation zwei funktionelle Gruppen?",
        "Nur so kann die Kette an beiden Enden weiterwachsen.",
        "Damit eine Doppelbindung geöffnet werden kann.",
        "Mit nur einer Gruppe wäre nach der ersten Verknüpfung Schluss.",
      ],
      lab: makeLab("polykondensation"),
      exercises: [
        {
          id: "kondensat",
          make(rng, level) {
            if (level === 1) {
              const links = rng.int(4, 40);
              return {
                prompt: `Bei der Bildung eines Polyesterausschnitts entstehen ${links} Esterbindungen. Wie viele Wassermoleküle werden abgespalten?`,
                given: ["Jede Esterbindung: ein H₂O"],
                formulaHint: "Zahl der Wassermoleküle = Zahl der neuen Bindungen",
                fields: [numberField("Wassermoleküle", links)],
                steps: ["Bei jeder Verknüpfung wird ein Wassermolekül frei.", `${links} Bindungen.`, `<strong>${links} H₂O</strong>`],
              };
            }
            const index = rng.int(0, CONDENSATES.length - 1);
            const c = CONDENSATES[index];
            return {
              prompt: `Ein Kunststoff enthält in der Kette wiederkehrende ${c.bond}en. Welche Monomere kommen dafür in Frage?`,
              given: [],
              formulaHint: "Esterbindung: OH + COOH · Amidbindung: NH₂ + COOH",
              fields: [
                choiceField(rng, "Monomere", c.monomers, CONDENSATES.filter((o) => o.bond !== c.bond).map((o) => o.monomers).concat(["Ethen und Propen"]).slice(0, 2)),
              ],
              steps: ["Die Bindung gedanklich spalten und Wasser anfügen.", c.bond === "Esterbindung" ? "Es entstehen OH- und COOH-Gruppen." : "Es entstehen NH₂- und COOH-Gruppen.", `<strong>${c.monomers}</strong>`],
            };
          },
        },
        cases(
          "polyester-polyamid",
          [
            cc("Welche Monomere bilden einen Polyester?", "Ein Diol und eine Dicarbonsäure.", ["Ein Alken und Wasserstoff.", "Zwei Monoalkohole."], "OH und COOH bilden Esterbindungen.", "Ester aus Alkohol und Säure."),
            cc("Welcher Bindung in Proteinen gleicht die Amidbindung im Nylon?", "Der Peptidbindung.", ["Der Wasserstoffbrücke.", "Der Ionenbindung."], "Beide haben die Gruppe –CO–NH–.", "Struktur vergleichen."),
          ],
          [
            cc("Warum kann Ethanol nicht als Monomer für einen Polyester dienen?", "Es hat nur eine OH-Gruppe; die Kette könnte nicht weiterwachsen.", ["Weil Ethanol keine OH-Gruppe hat.", "Weil Ethanol eine Doppelbindung hat."], "Für Ketten braucht jedes Monomer zwei reaktive Enden.", "Funktionelle Gruppen zählen."),
            cc("PLA wird aus Milchsäure hergestellt. Warum genügt ein einziges Monomer?", "Milchsäure trägt eine OH- und eine COOH-Gruppe und kann mit sich selbst kondensieren.", ["Weil Milchsäure eine C=C-Doppelbindung hat.", "Weil PLA kein Polymer ist."], "Zwei verschiedene funktionelle Gruppen in einem Molekül.", "Gruppen der Milchsäure."),
          ],
        ),
      ],
    }),
    lesson(id, 3, {
      id: "ch-kunststoffklassen",
      title: "Thermoplaste, Duroplaste, Elastomere",
      subtitle: "Vernetzung bestimmt das Verhalten",
      bindings: { I: 6, II_III: 6 },
      lehrplan: KUNSTSTOFFE,
      why: "Ob ein Kunststoff schmilzt, elastisch ist oder hart bleibt, hängt von der Vernetzung seiner Ketten ab.",
      html: "<p><strong>Thermoplaste</strong> bestehen aus unvernetzten, linearen oder wenig verzweigten Ketten, die nur durch zwischenmolekulare Kräfte zusammenhalten. Beim Erwärmen werden sie weich und formbar, beim Abkühlen wieder fest; man kann sie schweißen und einschmelzen (PE, PP, PET, PVC, PS). <strong>Elastomere</strong> sind <strong>weitmaschig vernetzt</strong>: Wenige Bindungen zwischen den Ketten erlauben Dehnen, ziehen das Material aber in die Ausgangsform zurück (Gummi). <strong>Duroplaste</strong> sind <strong>engmaschig vernetzt</strong>: Sie sind hart und spröde und erweichen beim Erhitzen nicht; bei starker Hitze zersetzen sie sich (Steckdosen, Pfannengriffe).</p><p>Die Vernetzung erklärt also typische Eigenschaften: Verformbarkeit, Temperaturbeständigkeit und Recyclingfähigkeit. Nur Thermoplaste lassen sich einschmelzen und neu formen; Elastomere und Duroplaste nicht.</p><div class=\"example\"><strong>Beispiel:</strong> Ein Pfannengriff muss hitzefest sein: Er ist ein Duroplast. Eine Getränkeflasche soll einschmelzbar sein: PET ist ein Thermoplast.</div>",
      rule: "unvernetzt → Thermoplast (schmelzbar) · weitmaschig → Elastomer (elastisch) · engmaschig → Duroplast (hart, nicht schmelzbar)",
      terms: [["Vernetzung", "Atombindungen zwischen den Polymerketten", "weitmaschig oder engmaschig"]],
      quiz: [
        "Warum lässt sich ein Duroplast nicht einschmelzen?",
        "Seine Ketten sind engmaschig durch Atombindungen vernetzt.",
        "Seine Ketten halten nur durch schwache Kräfte zusammen.",
        "Vor dem Erweichen müssten Atombindungen brechen; der Stoff zersetzt sich.",
      ],
      lab: makeLab("vernetzung"),
      exercises: [
        cases(
          "einordnen",
          [
            cc("Ein Kunststoff wird beim Erwärmen weich und lässt sich neu formen. Welche Klasse?", "Thermoplast", ["Duroplast", "Elastomer"], "Unvernetzte Ketten gleiten bei Wärme aneinander vorbei.", "Schmelzbar?"),
            cc("Ein Gummiband lässt sich dehnen und springt zurück. Welche Klasse?", "Elastomer", ["Thermoplast", "Duroplast"], "Weitmaschige Vernetzung zieht die Ketten zurück.", "Elastisch?"),
            cc("Ein Steckdosengehäuse wird bei Hitze nicht weich. Welche Klasse?", "Duroplast", ["Thermoplast", "Elastomer"], "Engmaschige Vernetzung verhindert das Erweichen.", "Hitzefest?"),
          ],
          [
            cc("Warum bestehen Autoreifen aus einem Elastomer und nicht aus einem Thermoplast?", "Sie müssen sich elastisch verformen und dürfen bei Wärme nicht erweichen.", ["Weil Thermoplaste zu leicht sind.", "Weil Elastomere sich gut einschmelzen lassen."], "Weitmaschige Vernetzung: elastisch und formbeständig.", "Anforderungen an den Reifen."),
            cc("Ein Recyclinghof kann PET einschmelzen, alte Steckdosen nicht. Warum?", "PET ist ein Thermoplast, die Steckdose ein Duroplast.", ["PET ist ein Duroplast.", "Steckdosen enthalten keinen Kunststoff."], "Nur unvernetzte Ketten lassen sich aufschmelzen.", "Vernetzung."),
          ],
        ),
        cases(
          "struktur-eigenschaft",
          [
            cc("Was hält die Ketten eines Thermoplasten zusammen?", "Zwischenmolekulare Kräfte.", ["Ionenbindungen.", "Engmaschige Atombindungen."], "Wärme kann diese Kräfte überwinden.", "Schwache Kräfte."),
            cc("Wodurch unterscheiden sich Elastomere und Duroplaste?", "Elastomere sind weitmaschig, Duroplaste engmaschig vernetzt.", ["Elastomere sind gar nicht vernetzt.", "Duroplaste sind weitmaschig vernetzt."], "Der Vernetzungsgrad entscheidet.", "Maschenweite."),
          ],
          [
            cc("Ein Kunststoff verbrennt mit rußender Flamme und tropft brennend ab. Was folgt für seine Klasse?", "Er schmilzt vor dem Verbrennen: ein Thermoplast.", ["Er ist ein Duroplast.", "Er ist ein Silikonharz."], "Abtropfen zeigt Schmelzen.", "Schmilzt er?"),
            cc("Ein Kunststoffhersteller will eine flexible, aber hitzebeständige Dichtung. Welche Struktur wählt er?", "Weitmaschig vernetzte Ketten (Elastomer).", ["Unvernetzte Ketten (Thermoplast).", "Kleine Moleküle ohne Kette."], "Elastizität und Formbeständigkeit verlangen wenige Vernetzungsstellen.", "Elastisch und formstabil."),
          ],
        ),
      ],
    }),
    lesson(id, 4, {
      id: "ch-silikone",
      title: "Silikone",
      subtitle: "Kunststoffe mit Si–O-Gerüst",
      bindings: { I: 6 },
      why: "Silikone dichten Bäder ab, entschäumen Frittierfett und halten Backofenhitze aus.",
      html: "<p><strong>Silikone</strong> haben ein Gerüst aus abwechselnden Silicium- und Sauerstoffatomen (–Si–O–Si–), an dem Methylgruppen hängen. Hergestellt werden sie aus <strong>Chlormethylsilanen</strong>. Mit Wasser wird jede Si–Cl-Bindung zu Si–OH, dabei entsteht Chlorwasserstoff. Zwei Si–OH-Gruppen verknüpfen sich unter Abspaltung von Wasser zu Si–O–Si (Kondensation). (CH₃)₂SiCl₂ mit zwei Cl-Atomen bildet Kettenglieder, (CH₃)₃SiCl mit einem Cl-Atom Kettenenden, CH₃SiCl₃ mit drei Cl-Atomen Verzweigungen und Vernetzungen.</p><p>Nach der Vernetzung unterscheidet man <strong>Silikonöle</strong> (unvernetzte Ketten, flüssig), <strong>Silikonelastomere</strong> (weitmaschig vernetzt, gummiartig, z. B. Fugendichtmasse, Backformen) und <strong>Silikonharze</strong> (engmaschig vernetzt, hart, z. B. hitzebeständige Lacke). Silikonöle nehmen eine <strong>Sonderstellung</strong> ein: Sie sind keine Thermoplaste, sondern bleiben flüssig. Silikone sind hydrophob, temperaturbeständig, chemisch beständig und wirken entschäumend; die Viskosität der Öle steigt mit der Kettenlänge.</p><div class=\"example\"><strong>Beispiel:</strong> Viel (CH₃)₂SiCl₂ mit etwas (CH₃)₃SiCl als Kettenende ergibt ein Silikonöl; mischt man wenig CH₃SiCl₃ zu, entsteht ein Elastomer.</div>",
      rule: "Si–Cl + H₂O → Si–OH + HCl · 2 Si–OH → Si–O–Si + H₂O · Öl (unvernetzt) · Elastomer (weitmaschig) · Harz (engmaschig)",
      terms: [
        ["Silikongerüst", "–Si–O–Si–O– mit CH₃-Gruppen", ""],
        ["Bausteine", "(CH₃)₃SiCl Ende · (CH₃)₂SiCl₂ Kette · CH₃SiCl₃ Vernetzung", ""],
      ],
      quiz: [
        "Welcher Baustein sorgt bei Silikonen für Vernetzung?",
        "CH₃SiCl₃ mit drei reaktiven Cl-Atomen.",
        "(CH₃)₃SiCl mit einem Cl-Atom.",
        "Drei Si–OH-Gruppen können drei Si–O–Si-Brücken bilden: eine Verzweigung.",
      ],
      lab: makeLab("silikon"),
      exercises: [
        {
          id: "chlorwasserstoff",
          make(rng, level) {
            const mono = rng.int(1, 4);
            const di = rng.int(2, 20);
            const tri = rng.int(0, 4);
            const hcl = mono + 2 * di + 3 * tri;
            if (level === 1)
              return {
                prompt: `Ein Gemisch aus ${mono} (CH₃)₃SiCl, ${di} (CH₃)₂SiCl₂ und ${tri} CH₃SiCl₃ wird vollständig mit Wasser umgesetzt. Wie viele HCl-Moleküle entstehen?`,
                given: ["Jede Si–Cl-Bindung liefert ein HCl."],
                formulaHint: "Cl-Atome zählen: 1 · a + 2 · b + 3 · c",
                fields: [withSlips(numberField("HCl", hcl), [mono + di + tri, "Zähle die Cl-Atome, nicht die Moleküle: Jede Si–Cl-Bindung liefert ein HCl."])],
                steps: [`${mono} · 1 + ${di} · 2 + ${tri} · 3`, `${mono} + ${2 * di} + ${3 * tri}`, `<strong>${hcl} HCl</strong>`],
              };
            // Level 2 uses at least four chain links, so the lab's rule
            // (siliconeType) always names one of the three silicone types.
            const chain = Math.max(4, di);
            const type = siliconeType(mono, chain, tri).split(":")[0];
            return {
              prompt: `Aus ${chain} (CH₃)₂SiCl₂, ${tri} CH₃SiCl₃ und Kettenenden entsteht ein Silikon. Welcher Typ ist zu erwarten?`,
              given: [],
              formulaHint: "Kein Vernetzer → Öl · wenig → Elastomer · viel → Harz (Modell: Vernetzeranteil bis 20 % → Elastomer)",
              fields: [choiceField(rng, "Typ", type, ["Silikonöl", "Silikonelastomer", "Silikonharz"].filter((t) => t !== type))],
              steps: [`Vernetzeranteil: ${tri} von ${chain + tri} Bausteinen.`, tri === 0 ? "Ohne Vernetzer bleiben lineare Ketten." : "CH₃SiCl₃ verknüpft Ketten miteinander.", `<strong>${type}</strong>`],
            };
          },
        },
        cases(
          "silikon-eigenschaften",
          [
            cc("Warum perlt Wasser von einer Silikonfuge ab?", "Die nach außen zeigenden Methylgruppen machen Silikone hydrophob.", ["Silikone sind Salze.", "Silikone enthalten viele OH-Gruppen."], "Unpolare Oberflächen stoßen Wasser ab.", "Was zeigt nach außen?"),
            cc("Welches Silikon ist bei Raumtemperatur flüssig?", "Silikonöl", ["Silikonharz", "Silikonelastomer"], "Unvernetzte Ketten gleiten aneinander vorbei.", "Vernetzung."),
          ],
          [
            cc("Warum nehmen Silikonöle eine Sonderstellung bei der Einteilung in Thermo-, Duroplaste und Elastomere ein?", "Sie sind unvernetzt, aber flüssig und kein fester formbarer Werkstoff.", ["Sie sind engmaschig vernetzt.", "Sie enthalten keinen Sauerstoff."], "Die Klassen beschreiben feste Kunststoffe.", "Aggregatzustand."),
            cc("Silikonbackformen halten 230 °C aus, PE-Dosen nicht. Woran liegt das vor allem?", "Am stabilen Si–O-Gerüst und der Vernetzung des Silikonelastomers.", ["Am höheren Wassergehalt.", "Daran, dass Silikone Metalle sind."], "Si–O-Bindungen sind sehr stabil; PE ist ein Thermoplast.", "Gerüst und Vernetzung."),
          ],
        ),
      ],
    }),
    lesson(id, 5, {
      id: "ch-kunststoffabfall",
      title: "Kunststoffabfälle verwerten",
      subtitle: "Recycling, Pyrolyse, Verbrennung",
      bindings: { I: 6, II_III: 6 },
      lehrplan: KUNSTSTOFFE,
      why: "Kunststoffe verrotten kaum, deshalb braucht jede Tonne Abfall einen sinnvollen Weg.",
      html: "<p>Die meisten Kunststoffe werden von Mikroorganismen kaum abgebaut. Gelangen sie in die Umwelt, zerfallen sie über Jahrzehnte zu <strong>Mikroplastik</strong>, das sich in Böden, Meeren und Lebewesen anreichert; Meerestiere verfangen sich in Netzen oder halten Plastikteile für Nahrung.</p><p>Für Kunststoffabfälle gibt es drei Wege. <strong>Werkstoffliches Recycling</strong>: Sortenreine Thermoplaste werden gewaschen, zerkleinert und eingeschmolzen; die Polymerketten bleiben erhalten. <strong>Rohstoffliches Recycling</strong>, z. B. <strong>Pyrolyse</strong>: Unter Luftausschluss erhitzt zerfallen die Ketten in Öle und Gase, aus denen wieder Chemikalien entstehen. <strong>Energetische Verwertung</strong>: Verbrennung im Müllheizkraftwerk liefert Wärme und Strom, setzt aber CO₂ frei, und der Rohstoff ist verloren. Am besten ist es, Abfall zu vermeiden und Produkte länger zu nutzen.</p><div class=\"example\"><strong>Beispiel:</strong> Sortenreine PET-Flaschen werden wieder zu Flaschen oder Fasern; gemischte Folienreste gehen eher in die Pyrolyse oder Verbrennung.</div>",
      rule: "Vermeiden > werkstofflich recyceln > rohstofflich (Pyrolyse) > energetisch verwerten",
      terms: [["Pyrolyse", "Zersetzung durch Erhitzen unter Luftausschluss", "liefert Öle und Gase"]],
      quiz: [
        "Welche Verwertung erhält die Polymerketten?",
        "Werkstoffliches Recycling.",
        "Energetische Verwertung.",
        "Beim Einschmelzen bleiben die Ketten erhalten; bei Pyrolyse und Verbrennung werden sie zerstört.",
      ],
      lab: makeLab("verwertung"),
      exercises: [
        cases(
          "verwertungsweg",
          [
            cc("Was geschieht bei der Pyrolyse von Kunststoffen?", "Die Ketten zerfallen unter Luftausschluss in Öle und Gase.", ["Sie werden zu Granulat eingeschmolzen.", "Sie verbrennen zu CO₂ und Wasser."], "Rohstoffliches Recycling gewinnt chemische Rohstoffe zurück.", "Ohne Sauerstoff erhitzen."),
            cc("Welche Kunststoffe eignen sich für werkstoffliches Recycling?", "Sortenreine Thermoplaste.", ["Duroplaste.", "Gemischte, verschmutzte Elastomere."], "Nur Thermoplaste lassen sich einschmelzen.", "Klasse und Reinheit."),
          ],
          [
            cc("Warum ist energetische Verwertung nur die letzte Wahl?", "Der Rohstoff geht verloren und es entsteht zusätzliches CO₂.", ["Weil dabei keine Energie entsteht.", "Weil Kunststoffe nicht brennen."], "Die Ketten werden vollständig zerstört.", "Was bleibt übrig?"),
            cc("Warum sortiert man Kunststoffabfälle vor dem Recycling?", "Gemischte Kunststoffe ergeben beim Einschmelzen minderwertige Werkstoffe.", ["Weil alle Kunststoffe gleich schmelzen.", "Weil Sortieren die Polymerketten verlängert."], "Verschiedene Polymere vertragen sich im Gemisch schlecht.", "Sortenreinheit."),
          ],
        ),
        cases(
          "umwelt",
          [
            cc("Was ist Mikroplastik?", "Kleinste Kunststoffteilchen, die z. B. beim Zerfall von Abfällen entstehen.", ["Ein besonders kleines Atom.", "Biologisch abbaubarer Zucker."], "Kunststoffe zerfallen mechanisch, ohne chemisch abgebaut zu werden.", "Zerfall in der Umwelt."),
            cc("Warum ist Plastik im Meer ein Problem für Tiere?", "Tiere verfangen sich oder fressen Teile, die sie nicht verdauen können.", ["Plastik macht Meerwasser sauer.", "Plastik löst sich sofort im Wasser."], "Kunststoffe werden kaum abgebaut.", "Langlebigkeit."),
          ],
          [
            cc("Eine Firma ersetzt Einwegbecher durch Mehrwegbecher. Wie ist das einzuordnen?", "Abfallvermeidung, die oberste Stufe der Rangfolge.", ["Energetische Verwertung.", "Rohstoffliches Recycling."], "Vermeiden steht vor jeder Verwertung.", "Rangfolge."),
            cc("Warum ist ‚wir verbrennen den Plastikmüll, dann ist er weg‘ fachlich unvollständig?", "Es entstehen CO₂ und Rauchgase, und der Rohstoff ist verloren.", ["Beim Verbrennen entsteht nichts.", "Verbrennen ist werkstoffliches Recycling."], "Massenerhaltung: Die Atome bleiben, nur in anderen Stoffen.", "Was entsteht?"),
          ],
        ),
      ],
    }),
    lesson(id, 6, {
      id: "ch-biokunststoff-oekobilanz",
      title: "Biogene Kunststoffe und Ökobilanz",
      subtitle: "PLA, Erdöl-PE und Silikon vergleichen",
      bindings: { I: 6 },
      why: "‚Bio‘ auf der Verpackung sagt noch nicht, ob ein Werkstoff insgesamt umweltfreundlicher ist.",
      html: "<p><strong>Biogene Kunststoffe</strong> werden aus nachwachsenden Rohstoffen hergestellt. <strong>Polymilchsäure (PLA)</strong> entsteht so: Stärke aus Mais oder Zuckerrohr wird zu Glucose abgebaut, Bakterien vergären sie zu Milchsäure, und diese wird durch Polykondensation zu PLA verknüpft. <strong>Celluloseacetat</strong> entsteht aus Cellulose von Holz oder Baumwolle durch Veresterung mit Essigsäure.</p><p>Eine vereinfachte <strong>Ökobilanz</strong> vergleicht Werkstoffe über ihren ganzen Lebensweg: Rohstoff und Anbau (Fläche, Dünger, Wasser), Energiebedarf der Herstellung, Nutzungsdauer und Entsorgung. PLA spart fossile Rohstoffe, braucht aber Ackerfläche und ist nur in Industrieanlagen kompostierbar. PE aus Erdöl ist billig und leicht, beruht aber auf fossilen Rohstoffen und verrottet nicht. Silikone brauchen bei der Herstellung aus Quarzsand viel Energie, halten aber sehr lange. Welcher Werkstoff am besten abschneidet, hängt vom Einsatzzweck ab.</p><div class=\"example\"><strong>Beispiel:</strong> Für eine Einwegverpackung kann PLA günstiger sein, für eine Backform, die zehn Jahre hält, eher Silikon.</div>",
      rule: "Ökobilanz: Rohstoff → Herstellung → Nutzung → Entsorgung, immer für einen bestimmten Zweck",
      terms: [["PLA", "Stärke → Glucose → Milchsäure → Polymilchsäure", "Polyester aus nachwachsenden Rohstoffen"]],
      quiz: [
        "Welche Aussage über PLA ist fachlich richtig?",
        "PLA wird aus nachwachsenden Rohstoffen hergestellt, ist aber meist nur industriell kompostierbar.",
        "PLA verrottet in jedem Gartenkompost innerhalb weniger Tage.",
        "‚Bio‘ beschreibt hier den Rohstoff; die Entsorgung braucht hohe Temperaturen.",
      ],
      lab: makeLab("oekobilanz"),
      exercises: [
        cases(
          "herstellung",
          [
            cc("Welcher Weg führt zu PLA?", "Stärke → Glucose → Milchsäure → Polymilchsäure", ["Erdöl → Ethen → Polyethen", "Quarzsand → Silicium → Silikon"], "PLA ist ein Polyester aus Milchsäure.", "Rohstoff Stärke."),
            cc("Aus welchem Rohstoff wird Celluloseacetat hergestellt?", "Aus Cellulose, z. B. von Holz oder Baumwolle.", ["Aus Erdgas.", "Aus Quarzsand."], "Cellulose wird mit Essigsäure verestert.", "Name lesen."),
          ],
          [
            cc("Was bedeutet ‚vereinfachte Ökobilanz‘?", "Ein Vergleich der Umweltwirkungen eines Werkstoffs von der Rohstoffgewinnung bis zur Entsorgung.", ["Der Preis des Werkstoffs im Laden.", "Nur die CO₂-Emission beim Verbrennen."], "Mehrere Lebensphasen werden betrachtet.", "Ganzer Lebensweg."),
            cc("Warum kann ein biogener Kunststoff trotzdem eine schlechtere Ökobilanz haben als ein erdölbasierter?", "Anbau, Dünger, Fläche und Verarbeitung können viel Energie und Ressourcen kosten.", ["Weil biogene Kunststoffe radioaktiv sind.", "Weil Pflanzen kein CO₂ binden."], "Der Rohstoff allein entscheidet nicht über die Bilanz.", "Alle Lebensphasen."),
          ],
        ),
        cases(
          "bewerten",
          [
            cc("Welcher Vorteil spricht für Silikon-Backformen trotz energieaufwendiger Herstellung?", "Sie sind hitzebeständig und halten sehr lange.", ["Sie sind im Gartenkompost abbaubar.", "Sie bestehen aus Erdöl."], "Lange Nutzung verteilt den Herstellungsaufwand.", "Nutzungsdauer."),
            cc("Welcher Nachteil gilt für PE aus Erdöl?", "Es beruht auf einem fossilen Rohstoff und verrottet praktisch nicht.", ["Es ist schwer und teuer.", "Es zersetzt sich in Wasser."], "Fossiler Rohstoff und Langlebigkeit in der Umwelt.", "Rohstoff und Entsorgung."),
          ],
          [
            cc("Eine Werbung sagt: „Unsere Tüte ist bio, also kannst du sie in die Natur werfen.“ Wie bewertest du das?", "Falsch: Biogene Kunststoffe zerfallen in der Natur meist kaum; sie gehören in die passende Entsorgung.", ["Richtig, bio bedeutet immer sofort abbaubar.", "Richtig, weil PLA wasserlöslich ist."], "Abbaubarkeit hängt von Bedingungen wie Temperatur ab.", "Rohstoff ≠ Entsorgung."),
            cc("Du sollst für Einweggeschirr bei einem Schulfest einen Werkstoff vorschlagen. Welche Begründung ist ökologisch am stärksten?", "Mehrweggeschirr vermeidet Abfall; wenn Einweg, dann PLA mit industrieller Kompostierung.", ["PE, weil es billig ist.", "Silikon, weil es energieaufwendig ist."], "Vermeiden schlägt jede Werkstoffwahl.", "Rangfolge und Zweck."),
          ],
        ),
      ],
    }),
  ],
};
