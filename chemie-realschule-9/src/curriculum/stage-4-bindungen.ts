import { hydrocarbon, MOLECULES, saltRatio, SHAPES } from "../chemistry/model";
import { makeLab } from "../lab/definitions";
import type { Stage } from "../model/types";
import { cases, choiceField, lesson, numberField } from "./helpers";

const id = "bindungen";
const common = { I: 2, II_III: 6 };
export const STAGE_BINDUNGEN: Stage = {
  id,
  stageNumber: 4,
  title: "Bindungen und Stoffeigenschaften",
  subtitle: "Von Ionen bis zu organischen Molekülen",
  icon: "🔗",
  accent: "#db2777",
  badgeTitle: "Molekülbaumeister",
  lehrplanLabel: "C9 LB 2–3 (I) · LB 3 und 6 (II/III)",
  lessons: [
    lesson(id, 1, {
      id: "ch-ionen-salze",
      title: "Ionen und Verhältnisformeln",
      subtitle: "Ladungen müssen sich ausgleichen",
      bindings: { I: 3, II_III: 3 },
      why: "Aus Ionenladungen lassen sich Salzformeln begründet ableiten.",
      html: "<p>Bei Elektronenabgabe entstehen positive Kationen, bei Elektronenaufnahme negative Anionen. Natrium gibt bei der Salzbildung ein Elektron ab, Chlor nimmt es auf. Entgegengesetzt geladene Ionen ziehen einander an und bilden ein Gitter.</p><p>Im neutralen Salz ist die positive Gesamtladung gleich dem Betrag der negativen Gesamtladung. Die Verhältnisformel verwendet das kleinste ganzzahlige Verhältnis: Magnesiumionen mit Ladung +2 brauchen zwei Chloridionen mit Ladung −1. Werden Gitterebenen gegeneinander verschoben, können gleichnamige Ladungen nebeneinander geraten: Das erklärt die Sprödigkeit.</p>",
      rule: "Summe positiver und negativer Ladungszahlen = 0",
      quiz: [
        "Welches Verhältnis passt zu Mg²⁺ und Cl⁻?",
        "Ein Magnesiumion zu zwei Chloridionen.",
        "Zwei Magnesiumionen zu einem Chloridion.",
        "Eine Ladung +2 wird durch zweimal −1 ausgeglichen.",
      ],
      lab: makeLab("ionic"),
      exercises: [
        {
          id: "salzformel",
          make(rng, level) {
            const positive = rng.int(1, 3);
            const negative = rng.int(1, 3);
            const [c, a] = saltRatio(positive, negative);
            return {
              prompt:
                level === 1
                  ? "Bestimme das kleinste neutrale Zahlenverhältnis der Ionen."
                  : `Ein Salz enthält Kationen mit Ladungszahl +${positive} und Anionen mit Ladungszahl −${negative}. Wie viele Ionen jeder Art stehen in seiner kleinsten Verhältnisformel?`,
              given: level === 1 ? [`Kation: +${positive}`, `Anion: −${negative}`] : [],
              formulaHint:
                "Kationenzahl · positive Ladung = Anionenzahl · Betrag der negativen Ladung",
              fields: [numberField("Kationen", c), numberField("Anionen", a)],
              steps: [
                "Suche gleiche Beträge für positive und negative Gesamtladung.",
                "Kürze auf das kleinste ganzzahlige Verhältnis.",
                `<strong>${c} : ${a}</strong>`,
              ],
              meta: { positive, negative },
            };
          },
        },
        cases("ionengitter", [
          {
            prompt: "Warum bricht ein Salzkristall beim Verschieben bestimmter Gitterebenen?",
            answer: "Gleichnamige Ladungen kommen nebeneinander und stoßen sich ab.",
            others: [
              "Alle Ionen werden elektrisch neutral.",
              "Jede Bindung wird zu einer Metallbindung.",
            ],
            why: "Im verschobenen Gitter können Abstoßungen die Trennung begünstigen.",
            hint: "Achte auf die Nachbarschaft der Ladungen.",
          },
        ]),
      ],
    }),
    lesson(id, 2, {
      id: "ch-metallbindung",
      title: "Metallbindung und Leitfähigkeit",
      subtitle: "Welche Ladungsträger können sich bewegen?",
      bindings: common,
      why: "Metall und Salz können beide leiten, aber unter anderen Bedingungen und mit anderen Ladungsträgern.",
      html: "<p>Im Elektronengasmodell sind positive Metallatomrümpfe von delokalisierten Elektronen umgeben. Die Elektronen können sich auch im festen Metall bewegen und elektrische Ladung transportieren. Das Modell erklärt außerdem, warum Metalle verformbar sind.</p><p>In einem festen Salzkristall sind die Ionen an Gitterplätze gebunden. Erst in der Schmelze oder in wässriger Lösung sind sie beweglich. Dort übernehmen <strong>Ionen</strong> die Ladungsleitung, im Metall sind es <strong>Elektronen</strong>.</p>",
      rule: "Metall: bewegliche Elektronen · Salzschmelze / Salzlösung: bewegliche Ionen",
      quiz: [
        "Leitet ein fester Kochsalzkristall unter üblichen Bedingungen gut?",
        "Nein, seine Ionen sind nicht frei beweglich.",
        "Ja, weil jedes Ion geladen ist.",
        "Ladung allein reicht nicht: Die Ladungsträger müssen sich bewegen können.",
      ],
      lab: makeLab("metal"),
      exercises: [
        cases("ladungstraeger", [
          {
            prompt: "Ein Kupferdraht leitet Strom. Welche Teilchen transportieren die Ladung?",
            answer: "Delokalisierte Elektronen.",
            others: ["Wandernde Kupferkerne.", "Frei fließende Protonen."],
            why: "Die Atomrümpfe bleiben im Verband; bewegliche Elektronen leiten.",
            hint: "Nutze das Elektronengasmodell.",
          },
          {
            prompt: "Eine Salzschmelze leitet. Welche Ladungsträger sind beweglich?",
            answer: "Kationen und Anionen.",
            others: ["Nur ungeladene Salzmoleküle.", "Freie Protonen aus den Atomkernen."],
            why: "Das starre Ionengitter ist aufgelöst.",
            hint: "In einer Schmelze können sich Ionen bewegen.",
          },
          {
            prompt: "Warum ist ein festes Metall verformbar, während ein Salzkristall oft bricht?",
            answer: "Das Elektronengas hält den Metallverband auch bei Verschiebung zusammen.",
            others: [
              "Metalle enthalten keine Ladungen.",
              "Im Salz sind die Elektronen frei beweglich.",
            ],
            why: "Das Modell der Metallbindung erlaubt eine andere Reaktion auf verschobene Schichten.",
            hint: "Vergleiche Elektronengas und wechselnde Ionennachbarschaft.",
          },
        ]),
      ],
    }),
    lesson(id, 3, {
      id: "ch-elektronenpaare",
      title: "Elektronenpaarbindung und Lewis-Bilder",
      subtitle: "Gemeinsame und freie Paare",
      bindings: common,
      why: "Ein Valenzstrichbild macht sichtbar, wie Atome Elektronenpaare gemeinsam nutzen.",
      html: "<p>Bei einer Elektronenpaarbindung wird ein bindendes Elektronenpaar von zwei Atomkernen angezogen. Ein gemeinsames Paar wird als Strich gezeichnet; zwei oder drei gemeinsame Paare ergeben Doppel- beziehungsweise Dreifachbindungen.</p><p>Wasser besitzt zwei bindende Paare und zwei freie Paare am Sauerstoffatom. Methan hat vier bindende Paare und keine freien Paare am Kohlenstoff. Im Stickstoffmolekül verbinden drei gemeinsame Paare die beiden Atome; an jedem N-Atom verbleibt ein freies Paar.</p>",
      rule: "Ein Strich = ein Elektronenpaar · N≡N: drei bindende Paare",
      quiz: [
        "Wie viele bindende Elektronenpaare besitzt N₂?",
        "Drei bindende Paare.",
        "Zwei bindende Paare.",
        "Die Dreifachbindung enthält drei gemeinsame Elektronenpaare.",
      ],
      lab: makeLab("lewis"),
      exercises: [
        {
          id: "lewis-paare",
          make(rng, level) {
            const m = rng.pick(MOLECULES);
            return {
              prompt: `Betrachte ${m.formula}. Bestimme die bindenden Paare im ganzen Molekül und die freien Paare am bezeichneten ${m.center}-Atom.`,
              given:
                level === 1
                  ? [
                      "H: 1, C: 4, N: 5, O: 6 Valenzelektronen",
                      "Bei zwei gleichen Atomen sind die freien Paare nur an einem der Atome gefragt.",
                    ]
                  : [],
              formulaHint: "H bildet meist eine, C vier, N drei und O zwei Bindungen.",
              fields: [
                numberField("Bindende Paare im Molekül", m.bonds),
                numberField(`Freie Paare am ${m.center}-Atom`, m.lone),
              ],
              steps: [
                "Erfülle für H die Zweierregel und für die übrigen Atome hier die Oktettregel.",
                "Jede Bindungslinie zählt als ein gemeinsames Paar.",
                `<strong>${m.bonds} bindende Paare; ${m.lone} freie Paare am bezeichneten Atom</strong>`,
              ],
            };
          },
        },
      ],
    }),
    lesson(id, 4, {
      id: "ch-molekuelgestalt",
      title: "Die räumliche Gestalt von Molekülen",
      subtitle: "Elektronenbereiche stoßen sich ab",
      bindings: common,
      why: "Die Form entscheidet mit darüber, wie sich ein Stoff verhält.",
      html: "<p>Elektronenbereiche ordnen sich mit möglichst großem Abstand an. Eine Mehrfachbindung zählt dabei als ein Bereich. Vier Bereiche um ein Zentrum liegen ungefähr tetraedrisch.</p><p>Methan ist tetraedrisch. Bei Ammoniak besetzt ein freies Paar eine Richtung: Die Atomgestalt ist pyramidal. Wasser hat zwei freie Paare am Sauerstoff und ist gewinkelt. Kohlenstoffdioxid besitzt zwei Bindungsbereiche am C-Atom und ist linear. Ein ebenes Valenzstrichbild zeigt nicht automatisch die Raumgestalt.</p>",
      rule: "Bindungsbereiche + freie Paare → Elektronenanordnung → Molekülgestalt",
      quiz: [
        "Warum ist Wasser nicht linear?",
        "Zwei freie Elektronenpaare am O beeinflussen die Anordnung.",
        "Alle drei Atome müssen auf einer Geraden liegen.",
        "Die vier Elektronenbereiche liegen ungefähr tetraedrisch; die Atome bilden einen Winkel.",
      ],
      lab: makeLab("geometry"),
      exercises: [
        {
          id: "gestalt",
          make(rng, level) {
            const m = rng.pick(
              MOLECULES.filter((entry) => ["H₂O", "NH₃", "CH₄", "CO₂"].includes(entry.formula)),
            );
            return {
              prompt: `Welche Molekülgestalt besitzt ${m.formula}?`,
              given:
                level === 1
                  ? [
                      `Am Zentralatom: ${m.domains} Bindungsbereiche und ${m.lone} freie Elektronenpaare.`,
                    ]
                  : [],
              formulaHint: "Mehrfachbindungen zählen als ein Bereich; freie Paare mitdenken.",
              fields: [
                choiceField(
                  rng,
                  "Molekülgestalt",
                  m.shape,
                  SHAPES.filter((shape) => shape !== m.shape),
                ),
              ],
              steps: [
                "Zähle die Elektronenbereiche am Zentralatom.",
                `${m.domains} Bindungsbereiche und ${m.lone} freie Paare.`,
                `<strong>${m.shape}</strong>`,
              ],
            };
          },
        },
      ],
    }),
    lesson(id, 5, {
      id: "ch-polaritaet",
      title: "Polare Bindungen und Dipolmoleküle",
      subtitle: "Eine polare Bindung reicht nicht",
      bindings: common,
      why: "Wasser ist ein Dipol, Kohlenstoffdioxid trotz polarer Bindungen nicht.",
      html: "<p>Die Elektronegativität beschreibt, wie stark ein gebundenes Atom gemeinsame Bindungselektronen anzieht. Unterschiedliche Anziehung führt zu Partialladungen. Eine feste EN-Grenzzahl entscheidet nicht universell zwischen allen Bindungsarten.</p><p>Ob das ganze Molekül ein Dipol ist, hängt auch vom räumlichen Bau ab. Im linearen CO₂ heben sich die gleich starken Bindungsdipole auf. Im gewinkelten Wassermolekül bleibt eine resultierende Ladungstrennung: O trägt δ−, die H-Atome δ+.</p>",
      rule: "Dipolmolekül: polare Bindungen + keine vollständige Aufhebung ihrer Dipole",
      quiz: [
        "Ist ein Wassermolekül ein permanenter Dipol?",
        "Ja, wegen polarer Bindungen und gewinkelter Form.",
        "Nein, weil es insgesamt elektrisch neutral ist.",
        "Ein neutrales Molekül kann räumlich getrennte Partialladungen haben.",
      ],
      lab: makeLab("polarity"),
      exercises: [
        cases("dipole", [
          {
            prompt:
              "CO₂ besitzt zwei polare C=O-Bindungen. Warum ist das Molekül trotzdem kein permanenter Dipol?",
            answer: "Die Bindungsdipole heben sich im linearen symmetrischen Bau auf.",
            others: [
              "Sauerstoff zieht keine Elektronen an.",
              "Jedes Molekül mit polaren Bindungen ist ein Dipol.",
            ],
            why: "Der Gesamtbau und die Richtung der Dipole gehören zur Beurteilung dazu.",
            hint: "Addiere die gerichteten Bindungsdipole.",
          },
          {
            prompt: "Am Sauerstoff eines Wassermoleküls liegt welche Partialladung vor?",
            answer: "Eine negative Partialladung.",
            others: ["Eine positive Partialladung.", "Immer eine volle Ladung von minus zwei."],
            why: "Sauerstoff zieht die gemeinsamen Elektronen stärker an als Wasserstoff.",
            hint: "Partialladung und volle Ionenladung unterscheiden.",
          },
          {
            prompt:
              "Eine Verbindung hat eine größere EN-Differenz als eine andere. Was lässt sich daraus sicher ableiten?",
            answer: "Die EN-Differenz allein entscheidet die gesamte Stoffstruktur nicht.",
            others: [
              "Jede Differenz über 1,7 beweist ausnahmslos ein Ionengitter.",
              "Alle Moleküle werden dadurch automatisch Dipole.",
            ],
            why: "EN-Werte sind ein Modellbaustein; Geometrie und Stoffkontext bleiben nötig.",
            hint: "Es gibt keinen universellen Schalter bei einer einzelnen Grenzzahl.",
          },
        ]),
      ],
    }),
    lesson(id, 6, {
      id: "ch-zwischenmolekulare-kraefte",
      title: "Zwischenmolekulare Kräfte und Wasser",
      subtitle: "London-Kräfte, Dipole und Wasserstoffbrücken",
      bindings: common,
      why: "Stoffeigenschaften entstehen nicht nur aus den Bindungen im einzelnen Molekül.",
      html: "<p>London-Dispersionskräfte wirken zwischen allen Molekülen. Permanente Dipole ermöglichen zusätzlich Dipol-Dipol-Wechselwirkungen. Ein an N, O oder F gebundenes H-Atom kann mit einem freien Elektronenpaar eines Nachbarmoleküls eine Wasserstoffbrücke bilden.</p><p>Wasserstoffbrücken tragen zur für seine Molekülgröße hohen Siedetemperatur von Wasser bei. Im Eis entsteht eine offenere Struktur: Eis ist weniger dicht als flüssiges Wasser. Die Stärke verschiedener Wechselwirkungen hat keine allgemeingültige Rangfolge unabhängig von Molekülgröße und Kontaktfläche.</p>",
      rule: "Beim Sieden überwiegend Kräfte zwischen Molekülen überwinden, nicht die Moleküle zerlegen",
      quiz: [
        "Welche Wechselwirkung trägt wesentlich zur hohen Siedetemperatur von Wasser bei?",
        "Wasserstoffbrücken zwischen Wassermolekülen.",
        "Eine metallische Bindung zwischen Sauerstoffkernen.",
        "Wasserstoffbrücken wirken zwischen den Molekülen, die O–H-Bindungen innerhalb des Moleküls bleiben erhalten.",
      ],
      lab: makeLab("forces"),
      exercises: [
        cases("kraefte", [
          {
            prompt: "Wasser siedet. Welche Veränderung ist für den Übergang entscheidend?",
            answer: "Die Moleküle überwinden ihre gegenseitigen Anziehungen.",
            others: [
              "Jede O–H-Bindung im Molekül wird getrennt.",
              "Sauerstoffkerne wandeln sich in Wasserstoff um.",
            ],
            why: "Sieden ist ein physikalischer Vorgang; die Wassermoleküle bleiben erhalten.",
            hint: "Unterscheide intramolekulare Bindung und zwischenmolekulare Wechselwirkung.",
          },
          {
            prompt: "Warum schwimmt Eis auf flüssigem Wasser?",
            answer: "Die offenere Struktur macht Eis weniger dicht.",
            others: [
              "Einzelne Wassermoleküle verlieren im Eis ihre Masse.",
              "Eis enthält keine Wasserstoffbrücken.",
            ],
            why: "Die kristalline Struktur benötigt mehr Raum für dieselbe Masse.",
            hint: "Betrachte Struktur und Dichte.",
          },
          {
            prompt:
              "Zwei unpolare Alkane unterscheiden sich deutlich in Kettenlänge. Welches hat häufig die höhere Siedetemperatur?",
            answer: "Das längere Molekül wegen stärkerer London-Wechselwirkungen.",
            others: [
              "Immer das kürzere Molekül.",
              "Beide müssen dieselbe Siedetemperatur besitzen.",
            ],
            why: "Größe, Polarisierbarkeit und Kontaktfläche beeinflussen Dispersionskräfte.",
            hint: "Unpolar bedeutet nicht ohne Anziehung.",
          },
        ]),
      ],
    }),
    lesson(id, 7, {
      id: "ch-kohlenwasserstoffe",
      title: "Kohlenwasserstoffe und Isomerie",
      subtitle: "Kettenlänge, Bindung und Verzweigung",
      bindings: common,
      why: "Die gleiche Summenformel kann zu unterschiedlichen Strukturen gehören.",
      html: "<p>Alkane besitzen in offenen gesättigten Ketten nur Einfachbindungen und die Summenformel CₙH₂ₙ₊₂. Eine offene Kette mit genau einer Doppelbindung gehört zu den Alkenen und hat CₙH₂ₙ. Diese Formeln setzen den genannten Bau voraus; Ringe verändern die Zuordnung.</p><p>Butan und 2-Methylpropan besitzen beide C₄H₁₀, aber unterschiedliche Verknüpfungen: Sie sind Konstitutionsisomere. Längere unverzweigte Ketten zeigen meist stärkere London-Kräfte; Verzweigung beeinflusst die Kontaktfläche und damit die Siedetemperatur.</p>",
      rule: "Offenes Alkan: C<sub>n</sub>H<sub>2n+2</sub> · offenes Alken mit einer Doppelbindung: C<sub>n</sub>H<sub>2n</sub>",
      quiz: [
        "Müssen zwei Moleküle mit derselben Summenformel gleich verknüpft sein?",
        "Nein, es können Isomere vorliegen.",
        "Ja, die Summenformel zeigt jede Bindung.",
        "Die Summenformel nennt Atomzahlen, nicht alle Verknüpfungen.",
      ],
      lab: makeLab("organic"),
      exercises: [
        {
          id: "kohlenwasserstoff",
          make(rng, level) {
            const carbons = rng.int(2, 6);
            const bond = rng.pick([1, 2]);
            const result = hydrocarbon(carbons, bond);
            return {
              prompt:
                level === 1
                  ? `Wie viele H-Atome hat eine offene Kette mit ${carbons} C-Atomen ${bond === 1 ? "und nur Einfachbindungen" : "und genau einer Doppelbindung"}?`
                  : `Ein Molekül ist acyclisch, enthält ${carbons} Kohlenstoffatome und ${bond === 1 ? "ausschließlich Einfachbindungen" : "genau eine Doppelbindung"}. Bestimme die Zahl seiner Wasserstoffatome.`,
              given: [],
              formulaHint: bond === 1 ? "H-Zahl = 2 · C-Zahl + 2" : "H-Zahl = 2 · C-Zahl",
              fields: [numberField("Wasserstoffatome", result.h)],
              steps: [
                "Prüfe zuerst die Bindungsart und den Ausschluss von Ringen.",
                bond === 1 ? `2 · ${carbons} + 2` : `2 · ${carbons}`,
                `<strong>${result.formula}: ${result.h} H-Atome</strong>`,
              ],
              meta: { carbons, bond },
            };
          },
        },
        cases("isomerie", [
          {
            prompt: "Butan und 2-Methylpropan haben beide C₄H₁₀. Was unterscheidet sie?",
            answer: "Die Verknüpfung ihrer Atome.",
            others: ["Die Gesamtzahl der C-Atome.", "Die Ladung jedes Atomkerns."],
            why: "Gleiche Summenformel bei anderer Verknüpfung kennzeichnet Konstitutionsisomere.",
            hint: "Vergleiche Summenformel und Strukturformel.",
          },
        ]),
      ],
    }),
    lesson(id, 8, {
      id: "ch-funktionelle-gruppen",
      title: "Funktionelle Gruppen und Nachweise",
      subtitle: "Vom Bau zur Stoffklasse",
      bindings: common,
      why: "Eine kleine Gruppe von Atomen kann Löslichkeit und Reaktionsverhalten stark ändern.",
      html: "<p>Eine Hydroxygruppe kennzeichnet Alkanole, eine endständige Aldehydgruppe Alkanale, eine Carboxygruppe Alkansäuren. Doppelbindungen gehören zu den Merkmalen der Alkene.</p><p>Kurzkettige Alkohole können mit Wasser Wasserstoffbrücken bilden; eine lange unpolare Kohlenwasserstoffkette verringert die Wasserlöslichkeit. Hydrophil bedeutet wasserliebend, hydrophob wassermeidend; amphiphile Moleküle besitzen beide Bereiche. Nachweise liefern zusätzliche Hinweise: etwa die Entfärbung von Bromwasser bei C=C-Bindungen oder eine positive Fehlingprobe bei geeigneten Aldehyden. Die Reagenzien und Versuche gehören in den beaufsichtigten Unterricht.</p>",
      rule: "Hydroxygruppe → Alkanol · Aldehydgruppe → Alkanal · Carboxygruppe → Alkansäure",
      quiz: [
        "Welche Gruppe kennzeichnet eine Carbonsäure?",
        "Die Carboxygruppe.",
        "Eine einzelne C–C-Einfachbindung.",
        "Die Carboxygruppe kann ein Proton abgeben und beeinflusst dadurch das Verhalten in Wasser.",
      ],
      lab: makeLab("functional"),
      exercises: [
        cases("gruppen", [
          {
            prompt: "CH₃–CH₂–OH gehört zu welcher Stoffklasse?",
            answer: "Alkanole",
            others: ["Alkanale", "Alkansäuren"],
            why: "Die Hydroxygruppe am gesättigten Kohlenstoffgerüst kennzeichnet Ethanol.",
            hint: "Suche die funktionelle Gruppe.",
          },
          {
            prompt: "CH₃–CHO kann eine positive Fehlingprobe ergeben. Welche Gruppe passt dazu?",
            answer: "Eine Aldehydgruppe.",
            others: ["Nur eine C–C-Einfachbindung.", "Eine metallische Atomrumpfgruppe."],
            why: "Ethanal ist ein Alkanal mit endständiger Carbonylgruppe.",
            hint: "Endständiges –CHO und mittiges –CO– unterscheiden.",
          },
          {
            prompt: "Warum ist ein langkettiger Alkohol oft weniger wasserlöslich als Ethanol?",
            answer: "Der unpolare Kettenanteil wird im Verhältnis zur Hydroxygruppe größer.",
            others: [
              "Die Hydroxygruppe wird zu einem Metallion.",
              "Lange Ketten besitzen überhaupt keine Wechselwirkungen.",
            ],
            why: "Polare und unpolare Molekülbereiche tragen unterschiedlich zur Löslichkeit bei.",
            hint: "Betrachte das Verhältnis von Kopfgruppe und Kohlenwasserstoffrest.",
          },
          {
            prompt:
              "Ein Molekül besitzt einen gut wasserverträglichen Kopf und einen unpolaren langen Rest. Wie wird dieser Bau bezeichnet?",
            answer: "Amphiphil",
            others: ["Ausschließlich hydrophil", "Ein Edelgasatom"],
            why: "Das Molekül verbindet einen hydrophilen mit einem hydrophoben Bereich.",
            hint: "Beide Arten von Bereichen sind vorhanden.",
          },
        ]),
      ],
    }),
    lesson(id, 9, {
      id: "ch-organik-vertiefung",
      title: "Organik vertiefen: Namen und Struktur",
      subtitle: "Zusatzumfang in Zweig I",
      bindings: { I: 2 },
      why: "Systematische Namen beschreiben Struktur, statt nur eine Summenformel zu wiederholen.",
      html: "<p>Ein offenes Alkin mit genau einer Dreifachbindung besitzt CₙH₂ₙ₋₂. Beim Benennen wird die längste passende Kette gewählt; Positionen von Mehrfachbindungen, Verzweigungen und funktionellen Gruppen werden angegeben.</p><p>Bei einem Alkanon liegt eine Carbonylgruppe innerhalb der Kette, bei einem Alkanal am Kettenende. Die Fehlingprobe unterscheidet geeignete Alkanale von einfachen Alkanonen. Ein Alkohol ist primär, sekundär oder tertiär, je nachdem, ob das C-Atom mit Hydroxygruppe an ein, zwei oder drei weitere C-Atome gebunden ist. Methanol wird als gesonderter einfachster Alkohol behandelt.</p>",
      rule: "Name und Positionszahlen müssen zur gezeichneten Struktur passen",
      quiz: [
        "Welche Gruppe enthält Propanon?",
        "Eine Carbonylgruppe innerhalb der Kohlenstoffkette.",
        "Eine endständige Aldehydgruppe.",
        "Propanon ist ein Alkanon; die C=O-Gruppe liegt zwischen zwei C-Resten.",
      ],
      lab: makeLab("organic", true),
      exercises: [
        cases("iupac", [
          {
            prompt: "CH₃–CH(OH)–CH₃: Wie wird die Alkoholgruppe eingeordnet?",
            answer: "Sekundärer Alkohol",
            others: ["Primärer Alkohol", "Tertiärer Alkohol"],
            why: "Das C-Atom mit OH ist an zwei weitere C-Atome gebunden.",
            hint: "Zähle C-Nachbarn des C-Atoms, das OH trägt.",
          },
          {
            prompt: "CH₃–CH₂–CH₂–OH: Wie wird die Alkoholgruppe eingeordnet?",
            answer: "Primärer Alkohol",
            others: ["Sekundärer Alkohol", "Alkanon"],
            why: "Das OH-tragende C-Atom ist an ein weiteres C-Atom gebunden.",
            hint: "Zähle die C-Nachbarn direkt am OH-tragenden Atom.",
          },
          {
            prompt:
              "CH₃–CO–CH₃ zeigt unter geeigneten Bedingungen keine positive Fehlingprobe. Welche Stoffklasse passt?",
            answer: "Alkanon",
            others: ["Alkanal", "Alkansäure"],
            why: "Die Carbonylgruppe liegt innerhalb der Kette.",
            hint: "Prüfe, ob die Carbonylgruppe endständig ist.",
          },
          {
            prompt:
              "Welche Summenformel hat ein offenes Alkin mit genau einer Dreifachbindung und drei C-Atomen?",
            answer: "C₃H₄",
            others: ["C₃H₈", "C₃H₆"],
            why: "Für dieses begrenzte Strukturmodell gilt H-Zahl = 2n − 2.",
            hint: "Ringe und zusätzliche Mehrfachbindungen sind ausgeschlossen.",
          },
          {
            prompt:
              "Welche Benennung passt zu einer Kette aus vier C-Atomen mit Doppelbindung zwischen C1 und C2?",
            answer: "But-1-en",
            others: ["Butan", "Propen"],
            why: "Vier C-Atome liefern den Stamm But-, Position 1 und -en beschreiben die Doppelbindung.",
            hint: "Kettenlänge und Lage der Doppelbindung gehören in den Namen.",
          },
        ]),
      ],
    }),
  ],
};
