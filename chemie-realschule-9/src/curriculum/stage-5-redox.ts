import { saltRatio } from "../chemistry/model";
import { makeLab } from "../lab/definitions";
import type { Stage } from "../model/types";
import { cases, lesson, numberField } from "./helpers";

const id = "redox";
export const STAGE_REDOX: Stage = {
  id,
  stageNumber: 5,
  title: "Elektronenübergänge",
  subtitle: "Donator, Akzeptor und ausgeglichene Bilanz",
  icon: "⇄",
  accent: "#d97706",
  badgeTitle: "Elektronenbilanzierer",
  lehrplanLabel: "C9 LB 3 (I)",
  lessons: [
    lesson(id, 1, {
      id: "ch-elektronenuebergang",
      title: "Oxidation und Reduktion",
      subtitle: "Zwei Seiten desselben Elektronenübergangs",
      bindings: { I: 3 },
      why: "Bei einer Redoxreaktion gibt ein Partner die Elektronen ab, die der andere aufnimmt.",
      html: "<p>Oxidation bedeutet Elektronenabgabe, Reduktion Elektronenaufnahme. Der Elektronendonator wird selbst oxidiert und heißt Reduktionsmittel. Der Elektronenakzeptor wird reduziert und heißt Oxidationsmittel.</p><p>Bei der Bildung eines Salzes werden beispielsweise Metallatome zu Kationen und Nichtmetallatome zu Anionen. Das anschließende Zusammenlagern der Ionen setzt Gitterenergie frei. Sauerstoff ist für die allgemeine Definition einer Redoxreaktion nicht erforderlich.</p>",
      rule: "Oxidation: e⁻ abgeben · Reduktion: e⁻ aufnehmen",
      quiz: [
        "Was geschieht bei einer Reduktion?",
        "Ein Teilchen nimmt Elektronen auf.",
        "Ein Teilchen gibt Elektronen ab.",
        "Aufnahme bedeutet Reduktion; Abgabe bedeutet Oxidation.",
      ],
      lab: makeLab("redox"),
      exercises: [
        cases("donator", [
          {
            prompt: "Ein Zinkatom wird zum Zinkion mit Ladung +2. Welcher Vorgang liegt vor?",
            answer: "Oxidation durch Abgabe von zwei Elektronen.",
            others: [
              "Reduktion durch Aufnahme von zwei Elektronen.",
              "Eine Änderung der Protonenzahl.",
            ],
            why: "Positive Ladung entsteht hier durch Elektronenmangel.",
            hint: "Kernladung bleibt gleich; nur Elektronen werden übertragen.",
          },
          {
            prompt:
              "Ein Kupferion nimmt zwei Elektronen auf und wird zum Kupferatom. Welche Rolle hat es?",
            answer: "Es ist Elektronenakzeptor und wird reduziert.",
            others: ["Es ist Elektronendonator und wird oxidiert.", "Es liefert neue Atomkerne."],
            why: "Aufnahme von Elektronen ist die Reduktion.",
            hint: "Die Teilchenrolle und der Vorgang gehören zusammen.",
          },
          {
            prompt:
              "Wie heißt ein Stoff, der den Partner reduziert und dabei selbst Elektronen abgibt?",
            answer: "Reduktionsmittel",
            others: ["Oxidationsmittel", "Protonenakzeptor"],
            why: "Der Elektronendonator wird selbst oxidiert.",
            hint: "Der Name beschreibt die Wirkung auf den Partner.",
          },
        ]),
      ],
    }),
    lesson(id, 2, {
      id: "ch-oxidationszahlen",
      title: "Oxidationszahlen und Molekülionen",
      subtitle: "Formale Zuordnung, echte Ladungsbilanz",
      bindings: { I: 3 },
      why: "Oxidationszahlen helfen, Elektronenübergänge auch in Verbindungen zu verfolgen.",
      html: "<p>Eine Oxidationszahl ist eine formale Elektronenzuordnung, nicht automatisch eine echte Atomladung. Die Summe aller Oxidationszahlen entspricht der Gesamtladung eines Teilchens. Elemente im elementaren Zustand besitzen Oxidationszahl null.</p><p>In vielen Verbindungen trägt H die Oxidationszahl +I und O die Oxidationszahl −II. Es gibt Ausnahmen: In Peroxiden hat O −I; in Metallhydriden hat H −I. Auch Molekülionen wie Sulfat, Carbonat und Ammonium haben eine bestimmte Gesamtladung, die aus der Formel eines neutralen Salzes erschlossen werden kann.</p>",
      rule: "Summe der Oxidationszahlen = Gesamtladung · Regeln mit Ausnahmen verwenden",
      quiz: [
        "Welche Oxidationszahl hat O in Wasserstoffperoxid?",
        "Minus I.",
        "Ausnahmslos minus II.",
        "Peroxide sind eine wichtige Ausnahme zur häufigen Sauerstoffregel.",
      ],
      lab: makeLab("oxidation"),
      exercises: [
        {
          id: "oz-summe",
          make(rng, level) {
            const [formula, h, o, answer] = rng.pick<[string, number, number, number]>([
              ["H₂SO₄", 2, 4, 6],
              ["H₂CO₃", 2, 3, 4],
              ["HNO₃", 1, 3, 5],
            ]);
            return {
              prompt: `Bestimme die Oxidationszahl des Zentralatoms in ${formula}. Nutze H = +I und O = −II.`,
              given: level === 1 ? ["Die Verbindung ist elektrisch neutral."] : [],
              formulaHint: `${h} · (+I) + x + ${o} · (−II) = 0`,
              fields: [numberField("Oxidationszahl als vorzeichenbehaftete Zahl", answer)],
              steps: [
                "Die Summe muss null sein.",
                `${h} + x − ${o * 2} = 0`,
                `<strong>+${answer}</strong>`,
              ],
            };
          },
        },
        cases("molekuelion", [
          {
            prompt:
              "Na₂SO₄ ist neutral und enthält zwei Natriumionen mit je +1. Welche Ladung besitzt das Sulfation?",
            answer: "Zweifach negativ.",
            others: ["Einfach positiv.", "Elektrisch neutral."],
            why: "Zweimal +1 muss durch −2 ausgeglichen werden.",
            hint: "Die Ladung des ganzen Salzes ist null.",
          },
          {
            prompt:
              "NH₄Cl ist neutral und Chlorid hat die Ladung −1. Welche Ladung hat das Ammoniumion?",
            answer: "Einfach positiv.",
            others: ["Einfach negativ.", "Zweifach positiv."],
            why: "Die entgegengesetzte Gesamtladung muss +1 betragen.",
            hint: "Gleiche die Gesamtladungen der Ionen aus.",
          },
        ]),
      ],
    }),
    lesson(id, 3, {
      id: "ch-redoxgleichungen",
      title: "Teilgleichungen zusammenführen",
      subtitle: "Atome und Ladungen bleiben bilanziert",
      bindings: { I: 3 },
      why: "Eine Gesamtgleichung darf keine verschwundenen Elektronen enthalten.",
      html: "<p>Schreibe Oxidation und Reduktion zuerst getrennt. Multipliziere sie so, dass gleich viele Elektronen abgegeben und aufgenommen werden. Addiere anschließend beide Teilgleichungen und kürze die Elektronen.</p><p>Bei der Reaktion von Aluminium mit Kupferionen gibt ein Al-Atom drei Elektronen ab, ein Cu²⁺-Ion nimmt zwei auf. Die kleinste gemeinsame Elektronenzahl ist sechs: zwei Al-Atome und drei Cu²⁺-Ionen. Prüfe am Ende sowohl Atomzahlen als auch Gesamtladungen.</p>",
      rule: "2 Al + 3 Cu²⁺ → 2 Al³⁺ + 3 Cu",
      quiz: [
        "Warum werden Redoxteilgleichungen vor dem Addieren vervielfacht?",
        "Damit Elektronenabgabe und -aufnahme gleich groß sind.",
        "Damit auf einer Seite mehr Elektronen verschwinden.",
        "Die Elektronen werden übertragen, nicht vernichtet.",
      ],
      lab: makeLab("redox"),
      exercises: [
        {
          id: "elektronenfaktoren",
          make(rng, level) {
            const donor = rng.int(1, 3);
            const acceptor = rng.int(1, 3);
            const [d, a] = saltRatio(donor, acceptor);
            return {
              prompt: `Ein Donatorteilchen gibt ${donor} Elektronen ab; ein Akzeptorteilchen nimmt ${acceptor} auf. Bestimme die kleinsten Faktoren beider Teilgleichungen.`,
              given:
                level === 1
                  ? ["Abgegebene und aufgenommene Elektronenzahl müssen gleich groß sein."]
                  : [],
              formulaHint: "Donatorfaktor · Abgabe = Akzeptorfaktor · Aufnahme",
              fields: [
                numberField("Faktor der Oxidation", d),
                numberField("Faktor der Reduktion", a),
              ],
              steps: [
                "Suche das kleinste gemeinsame Vielfache beider Elektronenzahlen.",
                `${donor} · ${d} = ${acceptor} · ${a}`,
                `<strong>Oxidation × ${d}; Reduktion × ${a}</strong>`,
              ],
              meta: { donor, acceptor },
            };
          },
        },
      ],
    }),
    lesson(id, 4, {
      id: "ch-salze-loesen",
      title: "Salze lösen und hydratisieren",
      subtitle: "Zwei Energiebeiträge, eine Bilanz",
      bindings: { I: 3 },
      why: "Nicht jeder Lösungsvorgang erwärmt die Umgebung.",
      html: "<p>Um Ionen aus ihrem Gitter zu trennen, muss Energie aufgewendet werden. Lagern sich Wassermoleküle um die frei werdenden Ionen, entsteht eine Hydrathülle; dabei wird Energie frei. Am Kation ist die Sauerstoffseite des Wassers bevorzugt zum Ion orientiert, am Anion die Wasserstoffseite.</p><p>Überwiegt der Aufwand zum Gittertrennen, nimmt das System Energie aus der Umgebung auf. Überwiegt die frei werdende Hydratationsenergie, erwärmt sich die Umgebung. Die Ionen bleiben beim Lösen geladen und werden nicht zu neutralen Atomen.</p>",
      rule: "Lösungsenergie = Aufwand fürs Gittertrennen − freigesetzte Hydratationsenergie",
      quiz: [
        "Kann das Lösen eines Salzes Wasser abkühlen?",
        "Ja, wenn zum Gittertrennen mehr Energie nötig ist als frei wird.",
        "Nein, beim Lösen wird immer nur Energie frei.",
        "Die Bilanz beider Energiebeiträge entscheidet.",
      ],
      lab: makeLab("salt-solution"),
      exercises: [
        {
          id: "loesungsenergie",
          make(rng, level) {
            const lattice = rng.int(5, 9) * 100;
            const hydration = lattice + rng.pick([-200, -100, 100, 200]);
            const delta = lattice - hydration;
            return {
              prompt: `Für das Gittertrennen werden ${lattice} kJ/mol benötigt; bei der Hydratation werden ${hydration} kJ/mol frei. Bestimme die Lösungsenergie mit Vorzeichen aus Sicht des Systems.`,
              given: level === 1 ? ["Energieaufnahme positiv, Energieabgabe negativ."] : [],
              formulaHint: "ΔE = Gitteraufwand − Hydratationsbetrag",
              fields: [numberField("Lösungsenergie", delta, "kJ/mol")],
              steps: [
                "Verwende für den Hydratationsbeitrag das negative Vorzeichen.",
                `${lattice} − ${hydration}`,
                `<strong>${delta} kJ/mol; ${delta > 0 ? "endotherm" : "exotherm"}</strong>`,
              ],
            };
          },
        },
      ],
    }),
  ],
};
