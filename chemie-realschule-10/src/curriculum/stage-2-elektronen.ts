import {
  ANIONS,
  CATIONS,
  formulaWith,
  ionFormula,
  LATTICE_SALTS,
  saltFormula,
  saltName,
  saltRatio,
} from "../chemistry/model";
import { ION_METALS, ION_NONMETALS, makeLab, REDOX_REACTIONS } from "../lab/definitions";
import type { Stage } from "../model/types";
import { cases, cc, choiceField, lesson, numberField } from "./helpers";

const id = "elektronen";

/** Two salts whose lattice energies differ for a reason learners can name: charge or ion size. */
const LATTICE_PAIRS: Array<[number, number, string]> = [
  [6, 1, "Die Ionen von MgO sind doppelt geladen."],
  [7, 4, "Die Ionen von CaO sind doppelt geladen."],
  [0, 1, "Das Fluoridion ist kleiner als das Chloridion: kleinerer Abstand."],
  [1, 2, "Das Chloridion ist kleiner als das Bromidion: kleinerer Abstand."],
  [1, 4, "Das Natriumion ist kleiner als das Kaliumion: kleinerer Abstand."],
  [6, 7, "Das Magnesiumion ist kleiner als das Calciumion: kleinerer Abstand."],
];

export const STAGE_ELEKTRONEN: Stage = {
  id,
  stageNumber: 2,
  title: "Elektronenübergänge",
  subtitle: "Ionenbildung, Redox und Salze",
  icon: "⚡",
  accent: "#7c3aed",
  badgeTitle: "Elektronenlotse",
  lehrplanLabel: "C10 LB 2 (II/III)",
  lessons: [
    lesson(id, 1, {
      id: "ch-ionenbildung",
      title: "Ionenbildung aus den Elementen",
      subtitle: "Metall gibt ab, Nichtmetall nimmt auf",
      bindings: { II_III: 2 },
      why: "Salze entstehen, wenn Elektronen von Metall- auf Nichtmetallatome übergehen.",
      html: "<p>Erhitzt man Natrium in Chlor, verbrennt es mit heller Flamme zu weißem Natriumchlorid. Eisen und Schwefel glühen nach dem Zünden von selbst weiter und bilden Eisen(II)-sulfid; Magnesium verbrennt an der Luft zu Magnesiumoxid. Alle drei Reaktionen sind exotherm.</p><p>Nach dem <strong>Donator-Akzeptor-Konzept</strong> geben die Metallatome Elektronen ab (Elektronendonatoren) und werden zu positiv geladenen <strong>Metallkationen</strong>. Die Nichtmetallatome nehmen die Elektronen auf (Elektronenakzeptoren) und werden zu negativ geladenen <strong>Nichtmetallanionen</strong>. Beide erreichen dabei meist die Elektronenanordnung eines Edelgases. Die Ladungszahl folgt aus der Hauptgruppe: Gruppe I bis III gibt 1 bis 3 Elektronen ab, Gruppe V bis VII nimmt 3 bis 1 auf (Wiederholung aus C9).</p><div class=\"example\"><strong>Beispiel:</strong> Mg → Mg²⁺ + 2 e⁻ und O + 2 e⁻ → O²⁻. Ein Magnesiumatom gibt zwei Elektronen an ein Sauerstoffatom ab: MgO.</div>",
      rule: "Metallatom → Kation + Elektronen · Nichtmetallatom + Elektronen → Anion",
      terms: [
        ["Elektronendonator", "Teilchen, das Elektronen abgibt", "z. B. Na-Atom"],
        ["Elektronenakzeptor", "Teilchen, das Elektronen aufnimmt", "z. B. Cl-Atom"],
      ],
      quiz: [
        "Welche Rolle spielt das Chloratom bei der Bildung von Natriumchlorid?",
        "Elektronenakzeptor: Es nimmt ein Elektron auf und wird zum Chloridion.",
        "Elektronendonator: Es gibt ein Elektron ab und wird zum Kation.",
        "Chlor steht in Gruppe VII; mit einem zusätzlichen Elektron erreicht es die Edelgasanordnung.",
      ],
      lab: makeLab("ionenbildung"),
      exercises: [
        {
          id: "elektronen-je-formeleinheit",
          make(rng, level) {
            const metal = rng.pick(ION_METALS);
            const nonmetal = rng.pick(ION_NONMETALS);
            const [c, a] = saltRatio(metal.charge, nonmetal.charge);
            const electrons = c * metal.charge;
            const nonmetalName = ["Chlor", "Brom", "Sauerstoff", "Schwefel"][ION_NONMETALS.indexOf(nonmetal)];
            if (level === 1)
              return {
                prompt: `${metal.element} reagiert mit ${nonmetalName} zu ${saltFormula(metal, nonmetal)}. Wie viele Elektronen gehen je Formeleinheit über?`,
                given: [`Ionen: ${ionFormula(metal)} und ${ionFormula(nonmetal)}`, `Verhältnis ${c} : ${a}`],
                formulaHint: "Elektronen = Zahl der Kationen · Ladungszahl des Kations",
                fields: [numberField("Elektronen", electrons)],
                steps: [
                  `Die Ionen sind ${ionFormula(metal)} und ${ionFormula(nonmetal)}.`,
                  `${c} Kation(en) zu ${a} Anion(en): ${c} · ${metal.charge} = ${a} · ${-nonmetal.charge} Ladungen gleichen sich aus.`,
                  `<strong>${electrons} Elektronen</strong>`,
                ],
              };
            const units = rng.int(2, 5);
            return {
              prompt: `Aus den Elementen ${metal.element} und ${nonmetalName} werden ${units} Formeleinheiten ${saltFormula(metal, nonmetal)} gebildet. Wie viele Elektronen werden dabei insgesamt übertragen?`,
              given: [],
              formulaHint: "Erst Elektronen je Formeleinheit, dann mit der Zahl der Formeleinheiten multiplizieren",
              fields: [numberField("Elektronen", units * electrons)],
              steps: [
                `Ionen ${ionFormula(metal)} und ${ionFormula(nonmetal)}: je Formeleinheit ${c} · ${metal.charge} = ${electrons} e⁻.`,
                `${units} · ${electrons}`,
                `<strong>${units * electrons} Elektronen</strong>`,
              ],
              meta: { electrons },
            };
          },
        },
        cases(
          "donator-akzeptor",
          [
            cc("Was geschieht mit einem Magnesiumatom bei der Reaktion mit Sauerstoff?", "Es gibt zwei Elektronen ab und wird zum Mg²⁺-Ion.", ["Es nimmt zwei Elektronen auf und wird zum Mg²⁻-Ion.", "Es teilt sich ein Elektronenpaar mit dem Sauerstoffatom."], "Magnesium steht in Gruppe II und ist Elektronendonator.", "Metall oder Nichtmetall?"),
            cc("Welche Ladung erhält ein Schwefelatom in Eisen(II)-sulfid?", "2−", ["2+", "6−"], "Schwefel (Gruppe VI) nimmt zwei Elektronen auf.", "Wie viele Elektronen fehlen bis zur Edelgasanordnung?"),
          ],
          [
            cc("Warum entsteht aus Natrium und Chlor kein Molekül, sondern ein Salz?", "Elektronen gehen vollständig vom Metall- auf das Nichtmetallatom über; es entstehen Ionen.", ["Natrium und Chlor teilen sich ein Elektronenpaar.", "Beide Atome geben Elektronen ab."], "Metall und Nichtmetall bilden durch Elektronenübergang Ionen.", "Wer ist Donator, wer Akzeptor?"),
            cc("Ein Schüler sagt: „Bei der Salzbildung entstehen Elektronen.“ Was ist richtig?", "Elektronen werden nur übertragen; ihre Zahl bleibt gleich.", ["Elektronen entstehen aus der Reaktionswärme.", "Nichtmetallatome erzeugen Elektronen."], "Abgegebene und aufgenommene Elektronen sind gleich viele.", "Bilanz der Elektronen."),
          ],
        ),
      ],
    }),
    lesson(id, 2, {
      id: "ch-redox-teilgleichungen",
      title: "Redoxreaktionen in Teilgleichungen",
      subtitle: "Oxidation, Reduktion und Oxidationszahlen",
      bindings: { II_III: 2 },
      why: "Teilgleichungen zeigen, wer Elektronen abgibt und wer sie aufnimmt.",
      html: "<p>Die <strong>Oxidation</strong> ist die Elektronenabgabe, die <strong>Reduktion</strong> die Elektronenaufnahme. Beide laufen immer gleichzeitig ab: eine <strong>Redoxreaktion</strong>. Man formuliert sie in zwei <strong>Teilgleichungen</strong> und gleicht so aus, dass gleich viele Elektronen abgegeben wie aufgenommen werden. Addiert ergibt sich die Gesamtgleichung, in der keine Elektronen mehr stehen.</p><p><strong>Oxidationszahlen</strong> machen das sichtbar: Elemente haben die Oxidationszahl 0, einatomige Ionen ihre Ladung. Steigt die Oxidationszahl, liegt eine Oxidation vor; sinkt sie, eine Reduktion. Nichtmetalle wie Chlor oder Sauerstoff liegen als Moleküle Cl₂ und O₂ vor; das muss in den Teilgleichungen stehen.</p><div class=\"example\"><strong>Beispiel:</strong> Oxidation: 2 Na → 2 Na⁺ + 2 e⁻. Reduktion: Cl₂ + 2 e⁻ → 2 Cl⁻. Gesamt: 2 Na + Cl₂ → 2 NaCl. Natrium: 0 → +I, Chlor: 0 → −I.</div>",
      rule: "Oxidation = Elektronenabgabe (OZ steigt) · Reduktion = Elektronenaufnahme (OZ sinkt) · abgegebene e⁻ = aufgenommene e⁻",
      terms: [
        ["Oxidationszahl", "Element: 0 · einatomiges Ion: seine Ladung", "Summe in einer Verbindung: 0"],
        ["Gesamtgleichung", "Teilgleichungen so multiplizieren, dass die Elektronen gleich sind, dann addieren", ""],
      ],
      quiz: [
        "Welche Teilgleichung beschreibt eine Reduktion?",
        "O₂ + 4 e⁻ → 2 O²⁻",
        "Mg → Mg²⁺ + 2 e⁻",
        "Sauerstoff nimmt Elektronen auf; seine Oxidationszahl sinkt von 0 auf −II.",
      ],
      lab: makeLab("teilgleichung"),
      exercises: [
        {
          id: "faktor-oxidation",
          make(rng, level) {
            const index = rng.int(0, REDOX_REACTIONS.length - 1);
            const r = REDOX_REACTIONS[index];
            const lcm = (a: number, b: number): number => {
              let x = a;
              while (x % b) x += a;
              return x;
            };
            const electrons = lcm(r.charge, r.accepts);
            const ox = electrons / r.charge;
            const red = electrons / r.accepts;
            return {
              prompt:
                level === 1
                  ? `Gleiche die Teilgleichungen für ${r.name} aus. Mit welchem Faktor muss die Oxidationsteilgleichung multipliziert werden, und wie viele Elektronen werden insgesamt übertragen?`
                  : `Stelle die Gesamtgleichung der Reaktion ${r.name} über Teilgleichungen auf. Gib den Faktor der Oxidation und die Zahl der übertragenen Elektronen an.`,
              given:
                level === 1
                  ? [`Oxidation: ${r.metal} → ${r.metal}${["", "⁺", "²⁺", "³⁺"][r.charge]} + ${r.charge} e⁻`, `Reduktion: ${r.nonmetal} + ${r.accepts} e⁻ → ${r.ions === 1 ? "" : r.ions + " "}${r.ion}`]
                  : [],
              formulaHint: "Kleinstes gemeinsames Vielfaches der Elektronenzahlen beider Teilgleichungen",
              fields: [numberField("Faktor Oxidation", ox), numberField("übertragene Elektronen", electrons)],
              steps: [
                `Ein ${r.metal}-Atom gibt ${r.charge} e⁻ ab; ein ${r.nonmetal}-Teilchen nimmt ${r.accepts} e⁻ auf.`,
                `Kleinstes gemeinsames Vielfaches: ${electrons} e⁻ → Oxidation · ${ox}, Reduktion · ${red}.`,
                `<strong>Faktor ${ox}, ${electrons} Elektronen</strong>`,
              ],
            };
          },
        },
        cases(
          "oxidationszahlen",
          [
            cc("Welche Oxidationszahl hat Chlor im Chlormolekül Cl₂?", "0", ["−I", "+I"], "Elemente haben die Oxidationszahl 0.", "Liegt ein Element oder ein Ion vor?"),
            cc("Welche Oxidationszahl hat Aluminium im Al³⁺-Ion?", "+III", ["−III", "0"], "Bei einatomigen Ionen entspricht die Oxidationszahl der Ladung.", "Ladung ablesen."),
            cc("Die Oxidationszahl von Eisen steigt von 0 auf +II. Was liegt vor?", "Eine Oxidation.", ["Eine Reduktion.", "Kein Redoxvorgang."], "Steigende Oxidationszahl bedeutet Elektronenabgabe.", "Abgabe oder Aufnahme?"),
          ],
          [
            cc("Kupfer(II)-oxid reagiert mit Eisen zu Kupfer und Eisen(II)-oxid. Welcher Stoff wird reduziert?", "Kupfer(II)-oxid: Cu²⁺ nimmt Elektronen auf und wird zu Cu.", ["Eisen: es gibt Elektronen ab.", "Sauerstoff: seine Oxidationszahl steigt."], "Die Oxidationszahl von Kupfer sinkt von +II auf 0.", "Verfolge die Oxidationszahl von Kupfer."),
            cc("Warum darf in der Gesamtgleichung einer Redoxreaktion kein Elektron stehen?", "Alle abgegebenen Elektronen werden vom Partner aufgenommen.", ["Elektronen sind zu klein, um sie aufzuschreiben.", "Elektronen werden bei der Reaktion vernichtet."], "Die Teilgleichungen sind so multipliziert, dass sich die Elektronen herauskürzen.", "Elektronenbilanz."),
          ],
        ),
      ],
    }),
    lesson(id, 3, {
      id: "ch-salzformeln",
      title: "Verhältnisformeln und Salznamen",
      subtitle: "Aus Ionenladungen zur Formel und zurück",
      bindings: { II_III: 2 },
      why: "Aus den Ionenladungen ergibt sich die Formel eines Salzes, aus dem Namen die Ladungen.",
      html: "<p>Ein Salz ist nach außen elektrisch neutral. Die <strong>Verhältnisformel</strong> gibt das kleinste ganzzahlige Verhältnis von Kationen zu Anionen im Ionengitter an: Al³⁺ und O²⁻ gleichen sich im Verhältnis 2 : 3 aus, also Al₂O₃. Mehratomige Ionen wie Sulfat SO₄²⁻ setzt man in Klammern, wenn mehrere davon vorkommen: Al₂(SO₄)₃.</p><p>Der Name nennt zuerst das Metall mit seiner Oxidationszahl in römischen Ziffern, dann das Anion: Eisen(III)-oxid, Natrium(I)-chlorid. Bei Metallen mit nur einer üblichen Ionenladung lässt man die Zahl im Alltag oft weg (Natriumchlorid); bei Eisen oder Kupfer ist sie nötig. Anders als eine <strong>Molekülformel</strong> (H₂O beschreibt ein einzelnes Molekül) beschreibt die Verhältnisformel kein einzelnes Teilchen, sondern ein Zahlenverhältnis im Gitter.</p><div class=\"example\"><strong>Beispiel:</strong> Eisen(III)-sulfat: Fe³⁺ und SO₄²⁻ → 2 · (+3) = 3 · (−2) → Fe₂(SO₄)₃.</div>",
      rule: "Summe der Ladungen = 0 → kleinstes ganzzahliges Verhältnis · Name: Metall(Oxidationszahl)-Anion",
      terms: [
        ["Verhältnisformel", "Kationen : Anionen im Gitter, kleinste ganze Zahlen", "z. B. MgCl₂"],
        ["Molekülformel", "Atome eines einzelnen Moleküls", "z. B. H₂O, CO₂"],
        ["Anionen", "Chlorid Cl⁻ · Oxid O²⁻ · Sulfid S²⁻ · Hydroxid OH⁻ · Nitrat NO₃⁻ · Sulfat SO₄²⁻ · Carbonat CO₃²⁻ · Phosphat PO₄³⁻", ""],
      ],
      quiz: [
        "Was gibt die Formel MgCl₂ an?",
        "Im Gitter kommen auf ein Magnesiumion zwei Chloridionen.",
        "Ein MgCl₂-Molekül besteht aus drei gebundenen Atomen.",
        "Salze bestehen nicht aus Molekülen; die Formel ist ein Verhältnis.",
      ],
      lab: makeLab("salzformel"),
      exercises: [
        {
          id: "formel-aus-ionen",
          make(rng, level) {
            const cation = rng.pick(CATIONS);
            const anion = rng.pick(ANIONS.filter((a) => a.charge !== -1 || cation.charge !== 1));
            const answer = saltFormula(cation, anion);
            const [c, a] = saltRatio(cation.charge, anion.charge);
            const others = [
              formulaWith(cation, anion, a, c),
              formulaWith(cation, anion, -anion.charge, cation.charge),
              formulaWith(cation, anion, 1, 1),
              formulaWith(cation, anion, c + 1, a),
            ].filter((o, i, all) => o !== answer && all.indexOf(o) === i);
            const name = saltName(cation, anion);
            return {
              prompt:
                level === 1
                  ? `Welche Verhältnisformel hat das Salz aus ${ionFormula(cation)} und ${ionFormula(anion)}?`
                  : `Welche Verhältnisformel hat ${name}?`,
              given: level === 1 ? [`Ladungen: ${cation.charge}+ und ${-anion.charge}−`] : [],
              formulaHint: "Ladungen über Kreuz: kleinstes gemeinsames Vielfaches",
              fields: [choiceField(rng, "Formel", answer, others.slice(0, 2))],
              steps: [
                `${name}: Ionen ${ionFormula(cation)} und ${ionFormula(anion)}.`,
                `${c} · ${cation.charge} = ${a} · ${-anion.charge}: Verhältnis ${c} : ${a}.`,
                `<strong>${answer}</strong>`,
              ],
            };
          },
        },
        cases(
          "name-formel",
          [
            cc("Wie heißt FeCl₃?", "Eisen(III)-chlorid", ["Eisen(II)-chlorid", "Eisentrichlorid(II)"], "Drei Cl⁻ gleichen +3 aus: Fe³⁺.", "Ladung des Eisens aus den Chloridionen bestimmen."),
            cc("Wie heißt CuO?", "Kupfer(II)-oxid", ["Kupfer(I)-oxid", "Kupferoxid(I)"], "O²⁻ verlangt Cu²⁺ im Verhältnis 1 : 1.", "Ladung des Oxidions."),
            cc("Welche Formel hat Calciumhydroxid?", "Ca(OH)₂", ["CaOH₂", "CaOH"], "Ca²⁺ braucht zwei OH⁻; das mehratomige Ion steht in Klammern.", "Mehratomige Ionen in Klammern."),
          ],
          [
            cc("Warum muss man bei Eisenoxid die Oxidationszahl im Namen angeben?", "Eisen bildet Fe²⁺ und Fe³⁺; FeO und Fe₂O₃ sind verschiedene Stoffe.", ["Weil Eisen ein Nichtmetall ist.", "Weil die Zahl die Zahl der Sauerstoffatome angibt."], "Die römische Ziffer nennt die Ladung des Metallions.", "Welche Ionen kann Eisen bilden?"),
            cc("Wasser H₂O und Natriumsulfid Na₂S haben ähnliche Formeln. Was unterscheidet sie?", "H₂O beschreibt ein Molekül, Na₂S ein Ionenverhältnis im Gitter.", ["Beide sind Moleküle aus drei Atomen.", "Beide sind Salze, weil sie Wasserstoff bzw. Natrium enthalten."], "Molekülformel und Verhältnisformel beschreiben verschiedene Teilchenverbände.", "Nichtmetall + Nichtmetall oder Metall + Nichtmetall?"),
          ],
        ),
      ],
    }),
    lesson(id, 4, {
      id: "ch-gitterenergie",
      title: "Ionengitter und Gitterenergie",
      subtitle: "Warum Salze hoch schmelzen",
      bindings: { II_III: 2 },
      why: "Die Gitterenergie erklärt, warum die Salzbildung exotherm ist und Salze erst bei hohen Temperaturen schmelzen.",
      html: "<p>Kationen und Anionen ziehen sich elektrostatisch an, und zwar in alle Richtungen. Deshalb ordnen sie sich zu einem regelmäßigen <strong>Ionengitter</strong>: Jedes Ion ist von entgegengesetzt geladenen Ionen umgeben. Diese Anziehung nennt man <strong>Ionenbindung</strong>. Beim Aufbau des Gitters aus freien Ionen wird viel Energie frei, die <strong>Gitterenergie</strong>. Sie ist ein wichtiger Grund dafür, dass die Bildung von Salzen aus den Elementen exotherm verläuft.</p><p>Die Gitterenergie ist umso größer, je höher die Ionenladungen und je kleiner die Ionen sind (kleinerer Abstand). Um ein Salz zu <strong>schmelzen</strong>, muss ein Teil dieser Anziehung überwunden werden; erst dann sind die Ionen frei beweglich und die Schmelze leitet den Strom. Darum schmilzt MgO (2852 °C) viel höher als NaCl (801 °C).</p><div class=\"example\"><strong>Beispiel:</strong> NaF und NaCl: gleiche Ladungen, aber F⁻ ist kleiner als Cl⁻. NaF hat die größere Gitterenergie (923 statt 786 kJ/mol).</div>",
      rule: "Höhere Ionenladungen und kleinere Ionen → größere Gitterenergie → höhere Schmelztemperatur",
      terms: [["Gitterenergie", "Energie, die beim Bilden des Gitters aus freien Ionen frei wird", "in kJ/mol"]],
      quiz: [
        "Warum leitet geschmolzenes Natriumchlorid den Strom, festes aber nicht?",
        "In der Schmelze sind die Ionen frei beweglich.",
        "Beim Schmelzen entstehen freie Elektronen aus den Ionen.",
        "Im festen Gitter sitzen die Ionen fest; die Schmelze enthält bewegliche Ladungsträger.",
      ],
      lab: makeLab("gitter"),
      exercises: [
        {
          id: "gitter-vergleich",
          make(rng, level) {
            const [hi, lo, reason] = rng.pick(LATTICE_PAIRS);
            const salts = rng.shuffle([LATTICE_SALTS[hi], LATTICE_SALTS[lo]]);
            const answer = LATTICE_SALTS[hi].formula;
            return {
              prompt:
                level === 1
                  ? `Welches Salz hat die größere Gitterenergie: ${salts[0].formula} oder ${salts[1].formula}?`
                  : `${salts[0].formula} und ${salts[1].formula} werden erhitzt. Welches Salz schmilzt erst bei der höheren Temperatur?`,
              given:
                level === 1
                  ? salts.map((s) => `${s.formula}: Ladungen ±${s.cation}, Ionenabstand ${s.distance} pm`)
                  : [],
              formulaHint: "Erst Ladungen vergleichen, dann die Ionengröße",
              fields: [
                choiceField(rng, level === 1 ? "Größere Gitterenergie" : "Höhere Schmelztemperatur", answer, [LATTICE_SALTS[lo].formula, "beide gleich"]),
              ],
              steps: [
                "Höhere Ladungen wirken stärker als kleinere Abstände.",
                reason,
                level === 1
                  ? `<strong>${answer}</strong> (${LATTICE_SALTS[hi].energy} kJ/mol)`
                  : `<strong>${answer}</strong>: größere Gitterenergie, Schmelztemperatur ${LATTICE_SALTS[hi].melting} °C`,
              ],
            };
          },
        },
        cases(
          "gitter-schmelzen",
          [
            cc("Was muss beim Schmelzen eines Salzes überwunden werden?", "Die elektrostatische Anziehung zwischen den Ionen.", ["Die Elektronenpaarbindungen in Molekülen.", "Die Anziehung zwischen Atomkern und Elektronen."], "Salze bestehen aus Ionen im Gitter.", "Welche Teilchen bilden das Gitter?"),
            cc("Wie verläuft die Bildung eines Ionengitters aus freien Ionen?", "Exotherm: Gitterenergie wird frei.", ["Endotherm: Gitterenergie wird verbraucht.", "Ohne Energieumsatz."], "Entgegengesetzte Ladungen nähern sich an; Energie wird abgegeben.", "Anziehung führt zu Energieabgabe."),
          ],
          [
            cc("Warum ist Natriumchlorid spröde, obwohl die Ionenbindung stark ist?", "Verschiebt man Gitterebenen, liegen gleichnamige Ionen nebeneinander und stoßen sich ab.", ["Die Ionenbindung bricht schon bei leichtem Druck.", "Zwischen den Ionen wirken nur schwache Kräfte."], "Die Sprödigkeit folgt aus der Anordnung der Ladungen.", "Was passiert nach einer Verschiebung um eine Ionenlage?"),
            cc("Calciumoxid wird als Auskleidung von Hochöfen genutzt. Welche Eigenschaft passt dazu?", "Sehr hohe Schmelztemperatur durch doppelt geladene Ionen.", ["Gute Wasserlöslichkeit.", "Gute elektrische Leitfähigkeit im festen Zustand."], "Ca²⁺ und O²⁻ ergeben eine große Gitterenergie.", "Ladungen der Ionen."),
          ],
        ),
      ],
    }),
    lesson(id, 5, {
      id: "ch-hydratation",
      title: "Salze lösen: Hydrathülle",
      subtitle: "Gitterenergie gegen Hydratationsenergie",
      bindings: { II_III: 2 },
      why: "Ob sich eine Lösung erwärmt oder abkühlt, entscheidet der Vergleich zweier Energien.",
      html: "<p>Gibt man ein Salz in Wasser, lagern sich die polaren Wassermoleküle an die Ionen an der Kristalloberfläche: mit dem negativ teilgeladenen Sauerstoffatom an Kationen, mit den positiv teilgeladenen Wasserstoffatomen an Anionen. Die Ionen werden aus dem Gitter gelöst und von einer <strong>Hydrathülle</strong> umgeben. Dabei wird <strong>Hydratationsenergie</strong> frei.</p><p>Zum Lösen muss die Gitterenergie aufgebracht werden. Ist die Hydratationsenergie größer, erwärmt sich die Lösung (z. B. Calciumchlorid); ist sie kleiner, kühlt die Lösung ab (z. B. Ammoniumnitrat im Kältepack). Bei Natriumchlorid sind beide fast gleich groß. In der Lösung sind die hydratisierten Ionen frei beweglich; sie leitet den Strom.</p><div class=\"example\"><strong>Beispiel:</strong> Gitterenergie 700 kJ/mol, Hydratationsenergie 680 kJ/mol: Bilanz +20 kJ/mol, die Lösung kühlt etwas ab.</div>",
      rule: "Energiebilanz des Lösens = Gitterenergie − Hydratationsenergie · positiv: Lösung kühlt ab · negativ: Lösung erwärmt sich",
      terms: [["Hydrathülle", "Wassermoleküle, die ein gelöstes Ion umgeben", ""]],
      quiz: [
        "Wie richten sich Wassermoleküle um ein Chloridion aus?",
        "Mit den positiv teilgeladenen Wasserstoffatomen zum Ion.",
        "Mit dem negativ teilgeladenen Sauerstoffatom zum Ion.",
        "Entgegengesetzte Ladungen ziehen sich an: Cl⁻ zieht die δ+-H-Atome an.",
      ],
      lab: makeLab("loesen"),
      exercises: [
        {
          id: "loesebilanz",
          make(rng, level) {
            const lattice = rng.int(24, 36) * 25;
            const hydration = lattice + rng.pick([-75, -50, -25, 25, 50, 75]);
            const delta = lattice - hydration;
            if (level === 1)
              return {
                prompt: `Ein Salz hat eine Gitterenergie von ${lattice} kJ/mol, seine Ionen setzen ${hydration} kJ/mol Hydratationsenergie frei. Berechne die Energiebilanz des Lösens.`,
                given: [`Gitterenergie ${lattice} kJ/mol`, `Hydratationsenergie ${hydration} kJ/mol`],
                formulaHint: "Bilanz = Gitterenergie − Hydratationsenergie",
                fields: [numberField("Bilanz", delta, "kJ/mol")],
                steps: [
                  "Zum Lösen wird die Gitterenergie aufgewendet, die Hydratationsenergie wird frei.",
                  `${lattice} − ${hydration} = ${delta}`,
                  `<strong>${delta > 0 ? "+" : ""}${delta} kJ/mol</strong>: Die Lösung ${delta > 0 ? "kühlt ab" : "erwärmt sich"}.`,
                ],
              };
            return {
              prompt: `Beim Lösen eines Salzes ${delta > 0 ? "kühlt" : "erwärmt"} sich das Wasser; die Energiebilanz beträgt ${delta > 0 ? "+" : "−"}${Math.abs(delta)} kJ/mol. Die Hydratationsenergie beträgt ${hydration} kJ/mol. Wie groß ist die Gitterenergie?`,
              given: [],
              formulaHint: "Bilanz = Gitterenergie − Hydratationsenergie",
              fields: [numberField("Gitterenergie", lattice, "kJ/mol")],
              steps: [
                "Gitterenergie = Bilanz + Hydratationsenergie",
                `${delta} + ${hydration} = ${lattice}`,
                `<strong>${lattice} kJ/mol</strong>`,
              ],
            };
          },
        },
        cases(
          "hydrathuelle",
          [
            cc("Warum löst sich Kochsalz in Wasser, aber nicht in Heptan?", "Nur polare Wassermoleküle können Hydrathüllen um die Ionen bilden.", ["Heptan ist zu heiß.", "Kochsalz besteht aus unpolaren Molekülen."], "Ionen werden von Dipolen angezogen, nicht von unpolaren Molekülen.", "Polar oder unpolar?"),
            cc("Eine Salzlösung wird beim Lösen kalt. Was folgt daraus?", "Die Gitterenergie ist größer als die Hydratationsenergie.", ["Die Hydratationsenergie ist größer als die Gitterenergie.", "Beim Lösen wird keine Energie umgesetzt."], "Fehlende Energie wird der Umgebung entzogen.", "Welche Energie überwiegt?"),
          ],
          [
            cc("Ein Kältepack enthält Ammoniumnitrat und Wasser getrennt. Warum wird es nach dem Knicken kalt?", "Das Lösen ist endotherm: Die Gitterenergie übersteigt die Hydratationsenergie.", ["Ammoniumnitrat reagiert mit Wasser zu Eis.", "Das Wasser verdampft beim Knicken."], "Die fehlende Energie wird der Umgebung als Wärme entzogen.", "Energiebilanz des Lösens."),
            cc("Warum leitet eine Kochsalzlösung den Strom, Zuckerlösung aber nicht?", "Im Salzwasser liegen hydratisierte, frei bewegliche Ionen vor; Zucker löst sich als Moleküle.", ["Zucker zersetzt sich im Wasser.", "Kochsalz gibt freie Elektronen ins Wasser ab."], "Leitfähigkeit braucht bewegliche Ladungsträger.", "Ionen oder Moleküle?"),
          ],
        ),
      ],
    }),
  ],
};
