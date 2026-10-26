import {
  ANIONS,
  binaryMoleculeFormula,
  binaryNonmetalName,
  CATIONS,
  ELEMENT_SYSTEM,
  ionText,
  moleculeRatio,
  NONMETAL_BINDIGKEIT,
  saltFormula,
  saltName,
  saltRatio,
} from "../chemistry/model";
import { fmt, round } from "../exercises/format";
import { makeLab } from "../lab/definitions";
import type { Stage } from "../model/types";
import { cases, cc, choiceField, lesson, numberField, withSlips } from "./helpers";

const id = "materie";

const NONMETAL_FORMULA_CASES: ReadonlyArray<{
  firstIdx: number; // index in NONMETAL_BINDIGKEIT
  secondIdx: number; // index in NONMETAL_BINDIGKEIT
  trivialNote?: string;
}> = [
  { firstIdx: 0, secondIdx: 6, trivialNote: "Methan" }, // CH4
  { firstIdx: 2, secondIdx: 6, trivialNote: "Ammoniak" }, // NH3
  { firstIdx: 5, secondIdx: 6, trivialNote: "Wasser" }, // OH2 -> H2O? Let's keep standard order below!
  { firstIdx: 0, secondIdx: 5 }, // CO2
  { firstIdx: 1, secondIdx: 5 }, // SiO2
  { firstIdx: 2, secondIdx: 7 }, // NCl3
  { firstIdx: 3, secondIdx: 7 }, // PCl3
  { firstIdx: 0, secondIdx: 7 }, // CCl4
  { firstIdx: 2, secondIdx: 5 }, // N2O3
  { firstIdx: 3, secondIdx: 5 }, // P2O3
  { firstIdx: 1, secondIdx: 7 }, // SiCl4
  { firstIdx: 4, secondIdx: 6 }, // H2S -> wait: firstIdx=6 (H), secondIdx=4 (S)!
];

const CLEAN_MOLECULE_PAIRS: ReadonlyArray<{
  aIdx: number;
  bIdx: number;
  formulaOverride?: string;
  displayName: string;
}> = [
  { aIdx: 0, bIdx: 6, displayName: "Methan (CH₄)" },
  { aIdx: 2, bIdx: 6, displayName: "Ammoniak (NH₃)" },
  { aIdx: 6, bIdx: 5, displayName: "Wasser (H₂O)" },
  { aIdx: 6, bIdx: 4, displayName: "Schwefelwasserstoff (H₂S)" },
  { aIdx: 6, bIdx: 7, displayName: "Chlorwasserstoff (HCl)" },
  { aIdx: 0, bIdx: 5, displayName: "Kohlenstoffdioxid (CO₂)" },
  { aIdx: 0, bIdx: 7, displayName: "Tetrachlormethan / Kohlenstofftetrachlorid (CCl₄)" },
  { aIdx: 3, bIdx: 7, displayName: "Phosphortrichlorid (PCl₃)" },
  { aIdx: 2, bIdx: 5, displayName: "Distickstofftrioxid (N₂O₃)" },
  { aIdx: 1, bIdx: 7, displayName: "Siliciumtetrachlorid (SiCl₄)" },
];

export const STAGE_MATERIE: Stage = {
  id,
  stageNumber: 3,
  title: "Aufbau der Materie",
  subtitle: "Dalton-Modell, Teilchenverbände, Bindigkeit und binäre Salze",
  icon: "🧱",
  accent: "#7c3aed",
  badgeTitle: "Strukturbaumeister",
  lehrplanLabel: "C8 LB 3 (I)",
  lessons: [
    lesson(id, 1, {
      id: "ch-dalton-elementklassen",
      title: "Daltonsches Atommodell und Elementklassen",
      subtitle: "Atomsorten unterscheiden, Elemente in Metalle und Nichtmetalle ordnen",
      bindings: { I: 3 },
      why: "Über 100 Elemente bilden Millionen Stoffe — schon zwei große Stoffklassen (Metalle und Nichtmetalle) schaffen sofort Überblick.",
      html: "<p>John Dalton erweiterte 1808 das einfache Teilchenmodell zum <strong>Daltonschen Atommodell</strong> mit vier Kernaussagen: 1.&nbsp;Jeder Stoff besteht aus kleinsten, kugelförmigen, nicht weiter teilbaren Bausteinen, den <strong>Atomen</strong>. 2.&nbsp;Es gibt so viele verschiedene <strong>Atomsorten</strong> wie chemische Elemente. 3.&nbsp;Alle Atome <em>derselben</em> Atomsorte stimmen in Größe und Masse überein; Atome <em>verschiedener</em> Elemente unterscheiden sich in Größe und Masse. 4.&nbsp;Atome können durch chemische Reaktionen weder erschaffen noch vernichtet, sondern nur neu kombiniert werden.</p><p>Anhand ihrer messbaren Eigenschaften (Glanz, Verformbarkeit, elektrische und thermische Leitfähigkeit, Dichte, Schmelz- und Siedetemperatur) ordnet ein <strong>stoffbezogenes Ordnungssystem</strong> die Elemente in zwei Hauptklassen: <strong>Metalle</strong> (metallischer Glanz, elektrisch leitfähig, verformbar; fast alle bei 20 °C fest — Ausnahme: flüssiges Quecksilber) und <strong>Nichtmetalle</strong> (meist Nichtleiter — Ausnahme: Kohlenstoff als Graphit; spröde als Feststoff wie Schwefel und Iod, flüssig wie Brom oder gasförmig wie Sauerstoff, Stickstoff, Wasserstoff und Edelgase).</p><div class=\"example\"><strong>Beispiel:</strong> Gelber Schwefel (ρ = 2,07 g/cm³, θ<sub>S</sub> = 115 °C, spröde, Nichtleiter) ist ein typisches Nichtmetall; rötliches Kupfer (ρ = 8,96 g/cm³, θ<sub>S</sub> = 1085 °C, dehnbar, sehr guter Leiter) ist ein Metall.</div>",
      rule: "Dalton: 1 Element = 1 Atomsorte mit eigener Größe & Masse · Metalle glänzen, leiten Strom/Wärme und sind verformbar; Nichtmetalle leiten (außer Graphit) nicht",
      terms: [
        ["Daltonsches Atommodell", "Atome als unteilbare, unveränderliche Kugeln je Atomsorte", "gleiche Sorte → gleiche Größe & Masse"],
        ["Metalle", "Glanz, Strom- & Wärmeleiter, dehnbar/verformbar", "z. B. Fe, Cu, Al, Hg (bei 20 °C flüssig)"],
        ["Nichtmetalle", "Isolatoren (Ausnahme: Graphit), fest/spröde, flüssig (Br<sub>2</sub>) oder gasförmig", "z. B. S, I<sub>2</sub>, C, O<sub>2</sub>, N<sub>2</sub>, H<sub>2</sub>"],
      ],
      quiz: [
        "Welches Element bildet unter den Nichtmetallen die berühmte Ausnahme bei der elektrischen Leitfähigkeit?",
        "Kohlenstoff in der Erscheinungsform Graphit leitet den elektrischen Strom.",
        "Schwefel leitet als gelber Kristall den Strom besser als Kupfer.",
        "Graphit (z. B. in Bleistiftminen und Elektroden) ist ein Nichtmetall, leitet aber den elektrischen Strom.",
      ],
      lab: makeLab("elementklassen"),
      exercises: [
        {
          id: "element-masse-volumen",
          make(rng, level) {
            const el = rng.pick(ELEMENT_SYSTEM);
            const vol = rng.int(5, 25);
            const mass = round(el.density * vol, 1);
            if (level === 1) {
              return {
                prompt: `Im stoffbezogenen Ordnungssystem steht für das ${el.kind} <strong>${el.name} (${el.symbol})</strong> die Dichte ρ = ${fmt(el.density, 2)} g/cm³. Welche Masse m in Gramm hat ein kompaktes Probestück mit dem Volumen V = ${vol} cm³? Runde auf eine Nachkommastelle.`,
                given: [`ρ(${el.symbol}) = ${fmt(el.density, 2)} g/cm³`, `V = ${vol} cm³`],
                formulaHint: "m = ρ · V",
                fields: [
                  withSlips(
                    numberField("m =", mass, "g", 1),
                    [round(vol / el.density, 2), "Multipliziere Dichte und Volumen: m = ρ · V."],
                    [round(el.density / vol, 2), "Multipliziere ρ · V statt zu dividieren."],
                  ),
                ],
                steps: [
                  "Aus ρ = m / V folgt m = ρ · V.",
                  `m = ${fmt(el.density, 2)} g/cm³ · ${vol} cm³ = ${fmt(mass, 1)} g.`,
                  `<strong>m = ${fmt(mass, 1)} g</strong>`,
                ],
              };
            }
            const metal = rng.pick(ELEMENT_SYSTEM.slice(0, 3)); // Al, Fe, Cu
            const sulfur = ELEMENT_SYSTEM[4]; // S
            const vSame = rng.pick([10, 15, 20, 30]);
            const diffMass = round((metal.density - sulfur.density) * vSame, 1);
            return {
              prompt: `Du vergleichst zwei gleich große Würfel (je V = ${vSame} cm³): einer besteht aus dem Metall <strong>${metal.name}</strong> (ρ = ${fmt(metal.density, 2)} g/cm³), der andere aus dem Nichtmetall <strong>Schwefel</strong> (ρ = ${fmt(sulfur.density, 2)} g/cm³). Um wie viel Gramm Δm ist der ${metal.name}würfel schwerer als der Schwefelwürfel? Runde auf eine Nachkommastelle.`,
              given: [],
              formulaHint: "Δm = (ρ(Metall) − ρ(Schwefel)) · V",
              fields: [
                withSlips(
                  numberField("Δm =", diffMass, "g", 1),
                  [round(metal.density - sulfur.density, 2), `Multipliziere die Dichtedifferenz noch mit dem Volumen V = ${vSame} cm³.`],
                  [round((metal.density + sulfur.density) * vSame, 1), "Ziehe die kleinere Masse von der größeren ab, statt beide zu addieren."],
                ),
              ],
              steps: [
                `m(${metal.symbol}) = ${fmt(metal.density, 2)} g/cm³ · ${vSame} cm³ = ${fmt(round(metal.density * vSame, 1), 1)} g; m(S) = ${fmt(sulfur.density, 2)} g/cm³ · ${vSame} cm³ = ${fmt(round(sulfur.density * vSame, 1), 1)} g.`,
                `Differenz: Δm = ${fmt(round(metal.density * vSame, 1), 1)} g − ${fmt(round(sulfur.density * vSame, 1), 1)} g = ${fmt(diffMass, 1)} g.`,
                `<strong>Δm = ${fmt(diffMass, 1)} g</strong>`,
              ],
            };
          },
        },
        cases(
          "dalton-elementklassen",
          [
            cc(
              "Was sagt das Daltonsche Atommodell über zwei Eisenatome im Vergleich zu einem Schwefelatom aus?",
              "Beide Eisenatome haben exakt gleiche Größe und Masse, unterscheiden sich aber in Größe und Masse vom Schwefelatom.",
              ["Alle Atome sämtlicher Elemente sind vollkommen gleich schwer.", "Eisenatome verwandeln sich beim Erhitzen in Schwefelatome."],
              "Nach Dalton gehört zu jedem Element genau eine eigene Atomsorte mit charakteristischer Masse und Größe.",
              "Gleiche Atomsorte vs. verschiedene Atomsorte bei Dalton.",
            ),
            cc(
              "Welches Element ist als einziges Metall schon bei Raumtemperatur (20 °C) flüssig?",
              "Quecksilber (Hg, θ_S = −39 °C)",
              ["Brom (Br₂, θ_S = −7 °C)", "Aluminium (Al, θ_S = 660 °C)"],
              "Quecksilber ist das einzige flüssige Metall bei 20 °C; Brom ist zwar ebenfalls flüssig, aber ein Nichtmetall.",
              "Vorsicht: Brom ist Nichtmetall, gesucht ist das Metall!",
            ),
          ],
          [
            cc(
              "Ein unbekanntes Element liegt bei 20 °C als rotbraune Flüssigkeit vor, leitet den elektrischen Strom nicht und siedet bereits bei 59 °C. Welcher Stoffklasse und welchem Element ordnest du es zu?",
              "Nichtmetall — es handelt sich um Brom (Br₂).",
              ["Metall — es handelt sich um flüssiges Quecksilber (Hg).", "Salz — es handelt sich um Natriumchlorid (NaCl)."],
              "Fehlende elektrische Leitfähigkeit und die rotbraune Farbe kennzeichnen das flüssige Nichtmetall Brom.",
              "Leitet die Flüssigkeit elektrischen Strom?",
            ),
            cc(
              "Wo stößt das Daltonsche Atommodell an seine Grenze?",
              "Es kann weder die Bildung elektrisch geladener Ionen noch die Flammenfärbung oder Isotopie erklären, weil es Atome als unteilbare Kugeln ohne innere Bausteine betrachtet.",
              ["Es kann nicht erklären, warum die Gesamtmasse bei einer Reaktion gleich bleibt.", "Es unterscheidet keine verschiedenen Elemente."],
              "Massenerhaltung und feste Zahlenverhältnisse erklärt Dalton hervorragend; für Ladungen und Spektren braucht man subatomare Teilchen.",
              "Kennt Dalton Elektronen, Protonen oder Neutronen?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, 2, {
      id: "ch-teilchenverbaende",
      title: "Grundbausteine, Anziehungskräfte und Teilchenverbände",
      subtitle: "Metallgitter, Moleküle, Ionengitter und atomar aufgebaute Stoffe abgrenzen",
      bindings: { I: 3 },
      why: "Aus welchen Grundbausteinen ein Stoff besteht und wie sie einander anziehen, entscheidet über den gesamten Aufbau der Materie.",
      html: "<p>Alle Stoffe der Chemie setzen sich aus drei Arten von <strong>Grundbausteinen</strong> zusammen: <strong>Metallatomen</strong>, <strong>Nichtmetallatomen</strong> und elektrisch geladenen <strong>Ionen</strong> (positiv geladene Kationen und negativ geladene Anionen). Je nach Kombination und Art der <strong>Anziehungskräfte</strong> entstehen vier grundlegende Bauprinzipien:</p><ul><li><strong>Atomar aufgebaute Stoffe (einzelne Atome):</strong> Edelgase wie Helium (He), Neon (Ne) oder Argon (Ar) liegen als isolierte Einzelatome vor; zwischen ihnen wirken nur extrem schwache Anziehungskräfte.</li><li><strong>Molekulare Stoffe (Moleküle):</strong> Nichtmetallatome verbinden sich durch <strong>gerichtete Anziehungskräfte</strong> zu klar abgegrenzten Teilchenverbänden fester Atomzahl — den <strong>Molekülen</strong> (z.&nbsp;B. H<sub>2</sub>, O<sub>2</sub>, H<sub>2</sub>O, CO<sub>2</sub>). Zwischen verschiedenen Molekülen wirken nur vergleichsweise schwache zwischenmolekulare Kräfte.</li><li><strong>Metalle (Metallgitter):</strong> Metallatome ordnen sich durch <strong>ungerichtete Anziehungskräfte</strong> regelmäßig in einem ausgedehnten <strong>Metallgitter</strong> an.</li><li><strong>Salze (Ionengitter):</strong> Kationen und Anionen (typischerweise aus Metall- und Nichtmetallteilchen entstanden) ziehen sich elektrisch in alle Raumrichtungen an (<strong>ungerichtete Anziehung</strong>) und bilden ein regelmäßiges <strong>Ionengitter</strong>.</li></ul><div class=\"example\"><strong>Beispiel:</strong> Kohlenstoffdioxid (CO<sub>2</sub>, Nichtmetall + Nichtmetall) besteht aus einzelnen dreiatomigen Molekülen mit gerichteter Anziehung im Molekül; Magnesiumoxid (MgO, Metallkation + Nichtmetallanion) bildet ein hochschmelzendes Ionengitter mit ungerichteter Anziehung.</div>",
      rule: "Edelgase → einzelne Atome · Nichtmetall + Nichtmetall → Moleküle (gerichtete Anziehung) · Metall → Metallgitter (ungerichtet) · Kationen + Anionen → Ionengitter (ungerichtet)",
      terms: [
        ["Gerichtete Anziehung", "wirkt gezielt zwischen bestimmten gebundenen Nichtmetallatomen", "führt zu abgegrenzten Molekülen (H<sub>2</sub>O, NH<sub>3</sub>)"],
        ["Ungerichtete Anziehung", "wirkt gleichmäßig in alle Raumrichtungen", "führt zu ausgedehnten Metall- und Ionengittern"],
        ["Vier Bauprinzipien", "atomar (Ar) · molekular (CO<sub>2</sub>) · Metallgitter (Cu) · Ionengitter (NaCl)", "erkennbar an den beteiligten Grundbausteinen"],
      ],
      quiz: [
        "Welche Art von Anziehungskraft hält Kationen und Anionen in einem Salzkristall wie Natriumchlorid zusammen?",
        "Eine starke, ungerichtete elektrische Anziehung in alle Raumrichtungen, wodurch ein ausgedehntes Ionengitter entsteht.",
        "Eine gerichtete Anziehung, die immer nur exakt ein Na⁺-Ion an ein einziges Cl⁻-Ion zu einem Gasmolekül koppelt.",
        "Elektrische Ladungen wirken kugelsymmetrisch in alle Richtungen — deshalb packen sich Kationen und Anionen zum Ionengitter.",
      ],
      lab: makeLab("teilchenverbaende"),
      exercises: [
        cases(
          "bausteine-zuordnen",
          [
            cc(
              "Welchen Aufbau besitzt das Edelgas Argon (Ar) bei Raumtemperatur?",
              "Atomar: Es liegt in Form einzelner, ungebundener Argonatome vor.",
              ["Als Ionengitter aus Ar⁺- und Ar⁻-Ionen.", "Als Metallgitter wie Eisen."],
              "Edelgase gehen unter Normalbedingungen keine Bindungen ein und bleiben atomar.",
              "Wie verhalten sich Edelgase?",
            ),
            cc(
              "Aus welchen Grundbausteinen und welchem Teilchenverband besteht Ammoniak (NH₃)?",
              "Aus Nichtmetallatomen (Stickstoff und Wasserstoff), die durch gerichtete Anziehung abgegrenzte Moleküle bilden.",
              ["Aus Kationen und Anionen in einem Ionengitter.", "Aus Metallatomen in einem Metallgitter."],
              "Stickstoff und Wasserstoff sind beide Nichtmetalle und bilden vieratomige NH₃-Moleküle.",
              "Sind Stickstoff und Wasserstoff Metalle oder Nichtmetalle?",
            ),
            cc(
              "Welcher Teilchenverband liegt in einem Stück Kupferdraht vor?",
              "Ein regelmäßiges Metallgitter mit ungerichteter Anziehung zwischen den Metallbausteinen.",
              ["Einzelne zweiatomige Cu₂-Gasmoleküle.", "Ein Ionengitter aus Cu²⁺- und O²⁻-Ionen."],
              "Reine Metalle bilden im festen Zustand ausgedehnte Metallgitter.",
              "Kupfer ist ein reines Metall.",
            ),
          ],
          [
            cc(
              "Du vergleichst Schwefeldioxid (SO₂) und Calciumoxid (CaO). Warum ist SO₂ bei 20 °C ein Gas, CaO aber ein Feststoff mit θ_S > 2500 °C?",
              "SO₂ besteht aus einzelnen Molekülen (Nichtmetall + Nichtmetall), zwischen denen nur schwache Kräfte wirken; CaO ist ein Salz mit starken ungerichteten Anziehungskräften im Ionengitter.",
              ["Weil Schwefel ein Metall und Calcium ein Edelgas ist.", "Weil CaO aus isolierten zweiatomigen Molekülen ohne Anziehung besteht."],
              "Beim Verdampfen von SO₂ müssen nur die schwachen Kräfte zwischen den Molekülen überwunden werden; beim Schmelzen von CaO die starke Ionenanziehung im Gitter.",
              "Prüfe für S, O und Ca jeweils Metall vs. Nichtmetall!",
            ),
            cc(
              "Warum entsteht bei gerichteter Anziehung zwischen Wasserstoff- und Sauerstoffatomen kein unendliches Kristallgitter aus lauter Einzelatomen, sondern H₂O-Moleküle?",
              "Weil die Bindungsfähigkeit jedes Nichtmetallatoms begrenzt und gerichtet ist: Ein O-Atom bindet genau zwei H-Atome zum abgeschlossenen Wassermolekül.",
              ["Weil Sauerstoff ein Edelgas ist und überhaupt keine Atome anzieht.", "Weil sich gleiche Atome im Gitter elektrisch aufladen."],
              "Gerichtete Anziehung ist abgesättigt, sobald die Bindigkeit erreicht ist — das ergibt abgeschlossene Moleküle.",
              "Was bewirkt eine gerichtete, absättigbare Anziehung?",
            ),
          ],
        ),
        cases(
          "modelle-teilchenverbaende",
          [
            cc(
              "Was stellen die Verbindungsstäbe in einem Kugel-Stab-Modell eines Ionengitters (z. B. NaCl) dar — und wo liegt die Modellgrenze?",
              "Sie halten das Anschauungsmodell mechanisch auf Abstand und zeigen Nachbarschaften; in Wirklichkeit gibt es keine gerichteten Einzelbindungen, sondern ungerichtete Ionenanziehung und dicht gepackte Ionen.",
              ["Sie zeigen echte feste Metalldrähte zwischen den Ionen.", "Sie beweisen, dass zwischen den Ionen riesige leere Tunnel liegen."],
              "Das Kalotten- bzw. Kugelpackungsmodell zeigt die dichte Packung besser, das Kugel-Stab-Modell dafür die Koordinationszahl im Inneren.",
              "Vergleiche Kugel-Stab-Modell und Kugelpackungsmodell beim Salzgitter!",
            ),
            cc(
              "Woran erkennst du schon an der chemischen Zusammensetzung sicher ein binäres Salz?",
              "An der Kombination eines Metalls (als Kation) mit einem Nichtmetall (als Anion), z. B. Kaliumbromid (KBr).",
              ["An der Kombination zweier Nichtmetalle, z. B. Kohlenstoffdioxid (CO₂).", "An einem einzelnen Edelgassymbol wie Ne."],
              "Metall + Nichtmetall bildet in der Regel ein Ionengitter (Salz); Nichtmetall + Nichtmetall bildet Moleküle.",
              "Welche Elementklassen treffen in NaCl, MgO oder KBr aufeinander?",
            ),
          ],
          [
            cc(
              "Ein Schüler zeichnet festes Helium nahe dem absoluten Nullpunkt als Ionengitter mit Plus- und Minuszeichen. Was stellst du richtig?",
              "Helium besteht aus neutralen Einzelatomen ohne Ionenladungen; es ist atomar aufgebaut.",
              ["Helium bildet zweiatomige He₂-Moleküle mit Dreifachbindung.", "Helium ist ein typisches Metall im Metallgitter."],
              "Edelgasatome geben weder Elektronen ab noch nehmen sie welche auf.",
              "Tragen Edelgasatome elektrische Ionenladungen?",
            ),
            cc(
              "Welches Anschauungsmodell eignet sich am besten, um den gewinkelten räumlichen Bau und die Raumerfüllung eines einzelnen Wassermoleküls darzustellen?",
              "Ein Kalottenmodell des H₂O-Moleküls aus einem roten O-Baustein und zwei weißen H-Bausteinen.",
              ["Ein ausgedehntes Metallgittermodell aus 27 gleich großen Silberkugeln.", "Ein einzelnes ungeladenes Kügelchen ohne Nachbaratome."],
              "Kalottenmodelle zeigen anschaulich die gegenseitige Durchdringung, den Bindungswinkel und die abgeschlossene Molekülgestalt.",
              "Welches Modell zeigt ein einzelnes dreiatomiges Molekül maßstabsnah?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, 3, {
      id: "ch-bindigkeit-molekuele",
      title: "Bindigkeit, Molekülformeln und Nichtmetallnamen",
      subtitle: "Aus Bindigkeitszahlen Molekülformeln ableiten und binäre Nichtmetallverbindungen benennen",
      bindings: { I: 3 },
      why: "Warum heißt Wasser H₂O, Ammoniak NH₃ und Methan CH₄ — und niemals HO oder NH? Die Bindigkeit der Nichtmetallatome liefert den Schlüssel.",
      html: "<p>Die <strong>Bindigkeit</strong> eines Nichtmetallatoms gibt an, wie viele Bindungen es zu Nachbaratomen eingehen kann: <strong>Wasserstoff (H)</strong> und die Halogene <strong>Fluor (F), Chlor (Cl), Iod (I)</strong> sind <strong>einbindig (1)</strong>, <strong>Sauerstoff (O)</strong> und <strong>Schwefel (S)</strong> sind in einfachen Hydriden/Oxiden oft <strong>zweibindig (2)</strong>, <strong>Stickstoff (N)</strong> und <strong>Phosphor (P)</strong> <strong>dreibindig (3)</strong>, <strong>Kohlenstoff (C)</strong> und <strong>Silicium (Si)</strong> <strong>vierbindig (4)</strong>. In einem Molekül müssen alle Bindigkeiten gegenseitig abgesättigt sein: Bei C (4) und H (1) ergibt das <strong>CH<sub>4</sub></strong>; bei N (3) und O (2) gleicht das kleinste gemeinsame Vielfache 6 die Bindigkeiten zu <strong>N<sub>2</sub>O<sub>3</sub></strong> aus (2 · 3 = 3 · 2). Auch viele Nichtmetallelemente bilden zweiatomige Moleküle: <strong>H<sub>2</sub>, N<sub>2</sub>, O<sub>2</sub>, F<sub>2</sub>, Cl<sub>2</sub>, Br<sub>2</sub>, I<sub>2</sub></strong>.</p><p><strong>Benennung binärer Nichtmetallverbindungen:</strong> Zuerst steht der deutsche Name des ersten Elements, danach der Wortstamm des zweiten Elements mit der Endung <strong>-id</strong> (<em>-oxid, -chlorid, -fluorid, -sulfid, -nitrid, -hydrid</em>). Die Atomzahlen gibst du mit <strong>griechischen Zahlwörtern</strong> an (<em>mono-, di-, tri-, tetra-, penta-, hexa-</em>), wobei <em>mono-</em> vor dem ersten Element weggelassen wird: CO = Kohlenstoffmonooxid, CO<sub>2</sub> = Kohlenstoffdioxid, N<sub>2</sub>O<sub>5</sub> = Distickstoffpentaoxid, PCl<sub>3</sub> = Phosphortrichlorid.</p><div class=\"example\"><strong>Beispiel:</strong> Silicium (4-bindig) und Chlor (1-bindig): 1 · 4 = 4 · 1 → Molekülformel <strong>SiCl<sub>4</sub></strong>, systematischer Name <strong>Siliciumtetrachlorid</strong>.</div>",
      rule: "Bindigkeit A · Anzahl A = Bindigkeit B · Anzahl B (kleinste ganze Zahlen) · Name: [Zahlwort]Element1 + [Zahlwort]Stamm2-id (ohne ‚Mono-‘ am Anfang)",
      terms: [
        ["Typische Bindigkeiten", "H, F, Cl, I: 1 · O, S: 2 · N, P: 3 · C, Si: 4", "Elementmoleküle: H<sub>2</sub>, N<sub>2</sub>, O<sub>2</sub>, F<sub>2</sub>, Cl<sub>2</sub>, Br<sub>2</sub>, I<sub>2</sub>"],
        ["Griechische Zahlwörter", "1 mono · 2 di · 3 tri · 4 tetra · 5 penta · 6 hexa", "‚mono-‘ steht nur vor dem zweiten Bestandteil (z. B. CO)"],
        ["Endungen 2. Element", "-oxid (O) · -chlorid (Cl) · -fluorid (F) · -sulfid (S) · -hydrid (H)", "Trivialnamen beachten: H<sub>2</sub>O Wasser, NH<sub>3</sub> Ammoniak, CH<sub>4</sub> Methan"],
      ],
      quiz: [
        "Stickstoff ist dreibindig (3), Wasserstoff einbindig (1). Welche Molekülformel ergibt sich daraus für Ammoniak?",
        "NH₃ — ein Stickstoffatom bindet drei Wasserstoffatome (1 · 3 = 3 · 1).",
        "N₃H — drei Stickstoffatome binden ein Wasserstoffatom.",
        "Jedes H-Atom hat Bindigkeit 1; um die 3 Bindungsstellen eines N-Atoms abzusättigen, werden 3 H-Atome benötigt: NH₃.",
      ],
      lab: makeLab("bindigkeit"),
      exercises: [
        {
          id: "molekuel-indizes",
          make(rng, level) {
            const pair = rng.pick(CLEAN_MOLECULE_PAIRS);
            const atomA = NONMETAL_BINDIGKEIT[pair.aIdx];
            const atomB = NONMETAL_BINDIGKEIT[pair.bIdx];
            const [nA, nB] = moleculeRatio(atomA.bindigkeit, atomB.bindigkeit);
            const formula = binaryMoleculeFormula(atomA.symbol, nA, atomB.symbol, nB);
            if (level === 1) {
              return {
                prompt: `Leite mithilfe der Bindigkeiten die Zusammensetzung eines Moleküls aus <strong>${atomA.name} (${atomA.symbol}, ${atomA.bindigkeit}-bindig)</strong> und <strong>${atomB.name} (${atomB.symbol}, ${atomB.bindigkeit}-bindig)</strong> ab. Wie viele ${atomA.symbol}-Atome und wie viele ${atomB.symbol}-Atome bilden das kleinste abgesättigte Molekül?`,
                given: [
                  `Bindigkeit(${atomA.symbol}) = ${atomA.bindigkeit}`,
                  `Bindigkeit(${atomB.symbol}) = ${atomB.bindigkeit}`,
                ],
                formulaHint: "Anzahl(A) · Bindigkeit(A) = Anzahl(B) · Bindigkeit(B) in kleinsten ganzen Zahlen",
                fields: [
                  withSlips(
                    numberField(`Anzahl ${atomA.symbol}`, nA),
                    [atomA.bindigkeit, "Verwechsle nicht die Bindigkeit selbst mit der Anzahl der Atome im Molekül (Überkreuzregel + Kürzen!)."],
                  ),
                  withSlips(
                    numberField(`Anzahl ${atomB.symbol}`, nB),
                    [atomB.bindigkeit, "Überkreuze die Bindigkeiten und kürze auf kleinste ganze Zahlen."],
                  ),
                ],
                steps: [
                  `${atomA.symbol} ist ${atomA.bindigkeit}-bindig, ${atomB.symbol} ist ${atomB.bindigkeit}-bindig.`,
                  `Abgleich: ${nA} · ${atomA.bindigkeit} = ${nB} · ${atomB.bindigkeit} = ${nA * atomA.bindigkeit} Bindungen → Molekülformel ${formula}.`,
                  `<strong>${nA} ${atomA.symbol}-Atom(e) und ${nB} ${atomB.symbol}-Atom(e) (${formula})</strong>`,
                ],
              };
            }
            // Level 2: Transfer — Wahl des richtigen systematischen Namens bzw. der Formel
            const nameItem = rng.pick(NONMETAL_FORMULA_CASES.filter((c) => c.secondIdx !== 6));
            const first = NONMETAL_BINDIGKEIT[nameItem.firstIdx];
            const second = NONMETAL_BINDIGKEIT[nameItem.secondIdx];
            const [c1, c2] = moleculeRatio(first.bindigkeit, second.bindigkeit);
            const fStr = binaryMoleculeFormula(first.symbol, c1, second.symbol, c2);
            const correctName = binaryNonmetalName(first.name, c1, second.stem, c2);
            const wrongNoPrefix = `${first.name}${second.stem}`;
            const wrongMono = `Mono${first.name.toLowerCase()}${c2 === 1 ? "di" : "mono"}${second.stem}`;
            return {
              prompt: `Aus ${first.name} (${first.bindigkeit}-bindig) und ${second.name} (${second.bindigkeit}-bindig) entsteht die binäre Nichtmetallverbindung <strong>${fStr}</strong>. Wie lautet ihr systematischer Name nach den Nomenklaturregeln?`,
              given: [],
              formulaHint: "Zahlwort + 1. Element (ohne ‚Mono-‘) + Zahlwort + Stamm des 2. Elements auf -id",
              fields: [
                choiceField(rng, "Systematischer Name", correctName, [wrongNoPrefix, wrongMono]),
              ],
              steps: [
                `In ${fStr} liegen ${c1} ${first.symbol}-Atom(e) und ${c2} ${second.symbol}-Atom(e) vor.`,
                "Bei binären Nichtmetallverbindungen geben griechische Zahlwörter die Indizes an (‚Mono-‘ am Wortanfang entfällt).",
                `<strong>${correctName}</strong>`,
              ],
            };
          },
        },
        cases(
          "binaere-nichtmetallnamen",
          [
            cc(
              "Wie lautet die korrekte Molekülformel von Distickstoffpentaoxid?",
              "N₂O₅",
              ["NO₅", "N₅O₂"],
              "‚Di-‘ steht für 2 Stickstoffatome (N₂), ‚penta-‘ für 5 Sauerstoffatome (O₅).",
              "Übersetze di = 2 und penta = 5 in tiefgestellte Indizes!",
            ),
            cc(
              "Wie heißt das giftige Gas mit der Molekülformel CO fachsprachlich exakt?",
              "Kohlenstoffmonooxid",
              ["Monokohlenstoffdioxid", "Kohlenstoffsulfid"],
              "Vor dem ersten Element entfällt ‚Mono-‘, vor dem einzelnen Sauerstoffatom steht ‚monooxid‘ zur Unterscheidung von CO₂.",
              "1 C-Atom und 1 O-Atom.",
            ),
            cc(
              "Welche sieben Nichtmetalle kommen als Elemente unter Standardbedingungen in Form zweiatomiger Moleküle vor?",
              "H₂, N₂, O₂, F₂, Cl₂, Br₂ und I₂",
              ["He₂, Ne₂, Ar₂, Fe₂, Cu₂, Al₂ und Mg₂", "C₂, Si₂, S₂, P₂, Na₂, K₂ und Ca₂"],
              "Wasserstoff, Stickstoff, Sauerstoff und die Halogene bilden zweiatomige Elementmoleküle (Merkhilfe: ‚HONClBrIF‘).",
              "Denke an Luftgase und Halogene — nicht an Edelgase oder Metalle!",
            ),
          ],
          [
            cc(
              "Kohlenstoff ist vierbindig (4), Sauerstoff zweibindig (2). Warum lautet die Molekülformel von Kohlenstoffdioxid CO₂ und nicht C₂O₄?",
              "Ein einzelnes C-Atom sättigt mit genau zwei O-Atomen (2 · 2 = 4) bereits alle vier Bindungsstellen zum kleinsten stabilen Molekül ab.",
              ["Weil Sauerstoff eigentlich vierbindig und Kohlenstoff einbindig ist.", "Weil CO₂ ein Salz mit Verhältnisformel ist."],
              "1 · 4 = 2 · 2 ist bereits durch 1 C-Atom und 2 O-Atome vollständig erfüllt.",
              "Wie viele zweibindige O-Atome braucht ein vierbindiges C-Atom?",
            ),
            cc(
              "Ein Mitschüler benennt Schwefeltrioxid (SO₃) versehentlich als ‚Schwefel(III)-oxid‘. Warum passt diese Benennungsweise hier nicht?",
              "Bei binären Nichtmetallverbindungen verwendet man griechische Zahlwörter (‚Schwefeltrioxid‘), während römische Ziffern die Ionenladung bei Salzen angeben.",
              ["Weil drei auf Griechisch ‚tetra‘ heißt.", "Weil Sauerstoff am Wortende immer ‚-sulfid‘ heißt."],
              "Schwefel und Sauerstoff sind beide Nichtmetalle → griechische Zahlwörter statt Salz-Nomenklatur.",
              "Nichtmetall + Nichtmetall → griechische Zahlwörter!",
            ),
          ],
        ),
      ],
    }),
    lesson(id, 4, {
      id: "ch-ionenverhaeltnis-salze",
      title: "Ionenladung und binäre Salze",
      subtitle: "Zahlenverhältnis im Ionengitter bestimmen, Verhältnisformeln und Salznamen bilden",
      bindings: { I: 3 },
      why: "Jeder Salzkristall ist nach außen elektrisch neutral — aus den Ionenladungen kannst du deshalb jede Salzformel ohne Auswendiglernen berechnen.",
      html: "<p><strong>Binäre Salze</strong> bestehen aus genau einer Sorte positiv geladener <strong>Metallkationen</strong> (z.&nbsp;B. Na<sup>+</sup>, Mg<sup>2+</sup>, Al<sup>3+</sup>, Fe<sup>2+</sup>, Fe<sup>3+</sup>) und einer Sorte negativ geladener <strong>Nichtmetallanionen</strong> (z.&nbsp;B. Chlorid Cl<sup>−</sup>, Fluorid F<sup>−</sup>, Bromid Br<sup>−</sup>, Iodid I<sup>−</sup>, Oxid O<sup>2−</sup>, Sulfid S<sup>2−</sup>, Nitrid N<sup>3−</sup>). Da jeder Salzkristall nach außen <strong>elektrisch neutral</strong> ist, müssen sich positive und negative Ladungen exakt zu null ausgleichen:</p><p style=\"text-align:center\"><strong>Anzahl(Kation) · Ladungszahl(Kation) = |Anzahl(Anion) · Ladungszahl(Anion)|</strong></p><p>Das kleinste ganzzahlige Zahlenverhältnis liefert die <strong>Verhältnisformel</strong>: Aus Al<sup>3+</sup> und O<sup>2−</sup> folgt 2 · (+3) + 3 · (−2) = 0 → Verhältnis 2 : 3 → <strong>Al<sub>2</sub>O<sub>3</sub></strong>. <strong>Benennung binärer Salze:</strong> Metallname + Nichtmetallstamm auf <strong>-id</strong>, ohne griechische Zahlwörter (z.&nbsp;B. MgCl<sub>2</sub> = <em>Magnesiumchlorid</em>, niemals ‚Magnesiumdichlorid‘!). Kann ein Metall verschieden geladene Kationen bilden (wie Eisen oder Kupfer), gibst du die <strong>Ionenladungszahl</strong> in römischen Ziffern in Klammern an: FeCl<sub>2</sub> = <em>Eisen(II)-chlorid</em>, FeCl<sub>3</sub> = <em>Eisen(III)-chlorid</em>.</p><div class=\"example\"><strong>Beispiel:</strong> Calciumion Ca<sup>2+</sup> und Nitridion N<sup>3−</sup>: kgV(2, 3) = 6 → 3 Ca<sup>2+</sup> (+6) und 2 N<sup>3−</sup> (−6) → Verhältnis 3 : 2, Verhältnisformel <strong>Ca<sub>3</sub>N<sub>2</sub></strong> (Calciumnitrid).</div>",
      rule: "Ladungssumme = 0 → kleinstes ganzzahliges Ionenverhältnis · Name binärer Salze: Metallname[(Ionenladung)] + Stamm-id (keine griechischen Zahlwörter!)",
      terms: [
        ["Wichtige Kationen", "Na<sup>+</sup>, K<sup>+</sup>, Ag<sup>+</sup> · Mg<sup>2+</sup>, Ca<sup>2+</sup>, Zn<sup>2+</sup> · Al<sup>3+</sup> · Cu<sup>+</sup>/Cu<sup>2+</sup> · Fe<sup>2+</sup>/Fe<sup>3+</sup>", "positiv geladene Metallionen"],
        ["Binäre Anionen", "F<sup>−</sup> Fluorid · Cl<sup>−</sup> Chlorid · Br<sup>−</sup> Bromid · I<sup>−</sup> Iodid · O<sup>2−</sup> Oxid · S<sup>2−</sup> Sulfid · N<sup>3−</sup> Nitrid", "negativ geladene Nichtmetallionen"],
        ["Salznamen-Regel", "Al<sub>2</sub>O<sub>3</sub> Aluminiumoxid · Fe<sub>2</sub>O<sub>3</sub> Eisen(III)-oxid", "keine griechischen Zahlwörter bei Salzen"],
      ],
      quiz: [
        "In welchem kleinsten ganzzahligen Zahlenverhältnis stehen Al³⁺-Ionen und S²⁻-Ionen im binären Salz Aluminiumsulfid?",
        "Al³⁺ : S²⁻ = 2 : 3 (Verhältnisformel Al₂S₃), denn 2 · (+3) + 3 · (−2) = 0.",
        "Al³⁺ : S²⁻ = 3 : 2 (Verhältnisformel Al₃S₂), weil die Ladungszahlen einfach abgeschrieben werden.",
        "Zwei dreifach positive Ionen (+6) gleichen genau drei zweifach negative Ionen (−6) elektrisch aus.",
      ],
      lab: makeLab("salzverhaeltnis"),
      exercises: [
        {
          id: "salz-zahlenverhaeltnis",
          make(rng, level) {
            const cation = rng.pick(CATIONS);
            const anion = rng.pick(ANIONS);
            const [nc, na] = saltRatio(cation.charge, anion.charge);
            const formula = saltFormula(cation, anion);
            const name = saltName(cation, anion);
            if (level === 1) {
              return {
                prompt: `Bestimme das kleinste ganzzahlige Zahlenverhältnis von Kationen zu Anionen im binären Salz aus <strong>${ionText(cation.symbol, cation.charge)}</strong> und <strong>${ionText(anion.symbol, anion.charge)}</strong> (${name}).`,
                given: [
                  `Kation: ${ionText(cation.symbol, cation.charge)} (Ladung +${cation.charge})`,
                  `Anion: ${ionText(anion.symbol, anion.charge)} (Ladung −${Math.abs(anion.charge)})`,
                ],
                formulaHint: "Ladungsausgleich: Anzahl(Kation) · (+q₁) + Anzahl(Anion) · (−q₂) = 0, auf kleinste ganze Zahlen kürzen",
                fields: [
                  withSlips(
                    numberField(`Anzahl ${ionText(cation.symbol, cation.charge)}`, nc),
                    [cation.charge, "Überkreuze die Beträge der Ladungszahlen und kürze anschließend!"],
                    [nc * 2, "Kürze das Zahlenverhältnis auf die kleinsten ganzen Zahlen!"],
                  ),
                  withSlips(
                    numberField(`Anzahl ${ionText(anion.symbol, anion.charge)}`, na),
                    [Math.abs(anion.charge), "Überkreuze die Beträge der Ladungszahlen und kürze auf kleinste ganze Zahlen."],
                    [na * 2, "Kürze das Zahlenverhältnis vollständig!"],
                  ),
                ],
                steps: [
                  `Kation ${ionText(cation.symbol, cation.charge)} trägt +${cation.charge}, Anion ${ionText(anion.symbol, anion.charge)} trägt −${Math.abs(anion.charge)}.`,
                  `Kleinstes gemeinsames Vielfaches der Ladungsbeträge: ${nc * cation.charge} → ${nc} · (+${cation.charge}) + ${na} · (−${Math.abs(anion.charge)}) = 0.`,
                  `<strong>Verhältnis ${nc} : ${na} → Verhältnisformel ${formula}</strong>`,
                ],
              };
            }
            // Level 2: Aus dem Salznamen auf Verhältnisformel oder Ionenverhältnis schließen
            const cat2 = rng.pick(CATIONS.filter((c) => c.charge >= 2 || c.variableCharge));
            const an2 = rng.pick(ANIONS.filter((a) => Math.abs(a.charge) !== cat2.charge));
            const [cCount, aCount] = saltRatio(cat2.charge, an2.charge);
            const f2 = saltFormula(cat2, an2);
            const sName = saltName(cat2, an2);
            const swapped = `${cat2.symbol}${aCount > 1 ? ["", "", "₂", "₃"][cCount] : ""}${an2.symbol}`;
            const unreduced = `${cat2.symbol}₂${an2.symbol}₄`;
            const wrong1 = swapped === f2 ? `${cat2.symbol}${an2.symbol}` : swapped;
            const wrong2 = unreduced === f2 || unreduced === wrong1 ? `${cat2.symbol}₃${an2.symbol}` : unreduced;
            return {
              prompt: `Wie lautet die korrekte Verhältnisformel des binären Salzes <strong>${sName}</strong> (Ionen: ${cat2.symbol}-Kation und ${ionText(an2.symbol, an2.charge)}-Anion)?`,
              given: [],
              formulaHint: "Bestimme die Ladung beider Ionen und gleiche die Summe der Ladungen zu 0 aus",
              fields: [choiceField(rng, "Verhältnisformel", f2, [wrong1, wrong2])],
              steps: [
                `${sName} besteht aus ${ionText(cat2.symbol, cat2.charge)} und ${ionText(an2.symbol, an2.charge)}.`,
                `Ladungsausgleich: ${cCount} · (+${cat2.charge}) + ${aCount} · (−${Math.abs(an2.charge)}) = 0.`,
                `<strong>${f2}</strong>`,
              ],
            };
          },
        },
        cases(
          "salznamen-binaer",
          [
            cc(
              "Wie heißt das binäre Salz mit der Verhältnisformel MgCl₂ fachsprachlich richtig?",
              "Magnesiumchlorid",
              ["Magnesiumdichlorid", "Monomagnesiumchlorid"],
              "Magnesium bildet nur Mg²⁺-Ionen; bei Salzen werden keine griechischen Zahlwörter verwendet.",
              "Metall + Nichtmetall = Salz → keine griechischen Zahlwörter!",
            ),
            cc(
              "Warum steht im Namen ‚Eisen(III)-oxid‘ (Fe₂O₃) eine römische Drei in Klammern?",
              "Sie gibt die Ionenladungszahl des Eisen-Kations (Fe³⁺) an, da Eisen auch Fe²⁺-Ionen bilden kann.",
              ["Sie gibt an, dass drei Eisenionen in der Formel stehen.", "Sie gibt an, dass drei Sauerstoffionen gebunden sind."],
              "In Fe₂O₃ kommen zwar 2 Fe³⁺-Ionen auf 3 O²⁻-Ionen, aber die Klammer (III) nennt immer die Ladung des einzelnen Kations (+3).",
              "Steht (III) für die Anzahl oder für die Ladung des Eisenions?",
            ),
          ],
          [
            cc(
              "Kupfer bildet zwei schwarze bzw. rötliche Oxide: Cu₂O und CuO. Wie heißen die beiden Verbindungen eindeutig?",
              "Cu₂O heißt Kupfer(I)-oxid, CuO heißt Kupfer(II)-oxid.",
              ["Cu₂O heißt Kupfer(II)-oxid, CuO heißt Kupfer(I)-oxid.", "Beide heißen unterschiedslos Kupfermonoxid."],
              "Mit O²⁻ (−2) muss in Cu₂O jedes Cu-Ion +1 tragen → Kupfer(I)-oxid; in CuO trägt das Cu-Ion +2 → Kupfer(II)-oxid.",
              "Leite die Ladung des Kupfer-Ions aus O²⁻ ab!",
            ),
            cc(
              "Ein Schüler schreibt für Magnesiumoxid aus Mg²⁺ und O²⁻ die Formel ‚Mg₂O₂‘. Warum korrigierst du zu MgO?",
              "Die Verhältnisformel eines Salzes gibt stets das kleinste ganzzahlige Zahlenverhältnis an — 2 : 2 wird zu 1 : 1 gekürzt.",
              ["Weil im Kristall insgesamt nur ein einziges Mg²⁺-Ion existiert.", "Weil Magnesium einfach positiv geladen ist."],
              "Schon 1 Mg²⁺ (+2) und 1 O²⁻ (−2) gleichen ihre Ladung zu 0 aus; das kleinste Verhältnis im Gitter ist 1 : 1.",
              "Was bedeutet ‚kleinstes ganzzahliges Verhältnis‘?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, 5, {
      id: "ch-verband-eigenschaften",
      title: "Eigenschaften von Metallen, Molekülstoffen und Salzen",
      subtitle: "Verformbarkeit, Sprödigkeit, Schmelztemperatur und Leitfähigkeit im Modell erklären",
      bindings: { I: 3 },
      why: "Warum verbiegt sich ein Kupferdraht unter dem Hammer, während ein Salzkristall schlagartig zerspringt und Kerzenwachs schon in der Hand weich wird?",
      html: "<p>Die experimentell messbaren Eigenschaften der drei großen Stoffgruppen lassen sich direkt aus dem <strong>Modell ihrer Teilchenverbände</strong> erklären:</p><ul><li><strong>Metalle (Metallgitter):</strong> Hohe Dichte, meist hohe Schmelz- und Siedetemperaturen, gute Wärme- und Stromleitung (fest und flüssig) sowie <strong>gute Verformbarkeit (Duktilität)</strong>. Verschiebt ein Hammerschlag eine Gitterebene im Metallgitter, bleibt die gleichmäßige, ungerichtete Anziehung zwischen den Metallbausteinen vollständig erhalten — das Metall verbiegt sich, ohne zu brechen.</li><li><strong>Salze (Ionengitter):</strong> Hohe Schmelz- und Siedetemperaturen, <strong>hart, aber spröde</strong>. Verschiebt eine Kraft eine Ionenschicht um nur eine halbe Gitterbreite, geraten plötzlich <strong>gleichnamig geladene Ionen</strong> (+ neben +, − neben −) direkt nebeneinander: Starke elektrische <strong>Abstoßung</strong> sprengt den Kristall entlang glatter Bruchkanten! Fest leiten Salze keinen Strom (Ionen ortsfest), geschmolzen oder gelöst dagegen gut (Ionen frei beweglich).</li><li><strong>Molekular aufgebaute Stoffe:</strong> Niedrige Schmelz- und Siedetemperaturen (oft Gase, Flüssigkeiten oder leicht schmelzende Feststoffe wie Wachs/Zucker) und <strong>keine elektrische Leitfähigkeit</strong> (neutrale Moleküle). Beim Schmelzen/Sieden werden nicht die starken Bindungen im Molekül gespalten, sondern nur die schwachen Kräfte <em>zwischen</em> den Molekülen überwunden.</li></ul><div class=\"example\"><strong>Beispiel:</strong> Kochsalz schmilzt erst bei 801 °C (starke Ionenanziehung im Gitter) und zersplittert unter dem Hammer; Wasser schmilzt schon bei 0 °C (schwache Kräfte zwischen neutralen H<sub>2</sub>O-Molekülen).</div>",
      rule: "Metall: Schichtverschiebung erhält Anziehung → verformbar · Salz: Schichtverschiebung bringt gleiche Ladungen zusammen → Abstoßung → spröde · Molekülstoff: schwache Zwischenmolekülkräfte → niedriges θ<sub>S</sub>/θ<sub>B</sub>, Nichtleiter",
      terms: [
        ["Sprödigkeit von Salzen", "Gitterverschiebung → + auf + und − auf − → Abstoßung", "Bruch entlang glatter Kristallflächen"],
        ["Verformbarkeit von Metallen", "Gitterebenen gleiten aneinander vorbei", "ungerichtete Anziehung bleibt erhalten"],
        ["Molekular gebaute Stoffe", "neutrale Moleküle, schwache Kräfte zwischen den Molekülen", "niedrige θ<sub>S</sub>/θ<sub>B</sub>, keine beweglichen Ladungsträger"],
      ],
      quiz: [
        "Warum zerspringt ein Steinsalzkristall bei einem kräftigen Schlag mit dem Hammer entlang glatter Flächen, statt sich wie ein Aluminiumblech zu verbiegen?",
        "Durch Verschieben einer Gitterebene treffen gleichnamig geladene Ionen aufeinander und stoßen sich schlagartig ab.",
        "Durch den Schlag verwandeln sich die Natriumionen spontan in gasförmiges Neon.",
        "Im Ionengitter wechseln sich + und − ab; verschiebt sich eine Schicht um eine Ionenbreite, stoßen sich +/+ und −/− ab.",
      ],
      lab: makeLab("gitterverschiebung"),
      exercises: [
        cases(
          "eigenschaften-deuten",
          [
            cc(
              "Warum besitzen Salze wie Magnesiumoxid oder Natriumchlorid sehr hohe Schmelztemperaturen?",
              "Im Ionengitter wirken in alle Raumrichtungen starke elektrische Anziehungskräfte zwischen Kationen und Anionen, für deren Überwindung viel thermische Energie nötig ist.",
              ["Weil zwischen einzelnen Salzmolekülen gar keine Anziehungskräfte wirken.", "Weil Salze bei Raumtemperatur schon gasförmig sind."],
              "Erst bei hohen Temperaturen schwingen die Ionen stark genug, um ihre festen Gitterplätze zu verlassen.",
              "Wie stark ist die elektrostatische Anziehung im Ionengitter?",
            ),
            cc(
              "Warum leitet reiner Traubenzucker weder als Feststoff noch in destilliertem Wasser gelöst den elektrischen Strom?",
              "Traubenzucker besteht aus elektrisch neutralen Molekülen; auch beim Lösen in Wasser entstehen keine frei beweglichen Ionen.",
              ["Weil sich Traubenzucker in Wasser überhaupt nicht löst.", "Weil Zuckermoleküle im Wasser ein starres Metallgitter aufbauen."],
              "Elektrische Leitfähigkeit erfordert frei bewegliche Ladungsträger — neutrale Moleküle transportieren keine Ladung.",
              "Welche Voraussetzung muss für elektrische Leitfähigkeit erfüllt sein?",
            ),
            cc(
              "Warum lässt sich ein glühendes Stück Eisen schmieden und Kupfer zu dünnen Drähten ziehen?",
              "Beim Verschieben der Gitterebenen im Metallgitter bleibt die ungerichtete Anziehung zwischen den Metallbausteinen in jeder Lage erhalten.",
              ["Weil Eisen und Kupfer aus isolierten Gasmolekülen bestehen.", "Weil sich gleiche Ladungen beim Schmieden abstoßen und das Metall zersprengen."],
              "Anders als im Ionengitter führt eine Gitterverschiebung im Metall nicht zu gleichnamiger Ladungsabstoßung.",
              "Was passiert im Metallgitter, wenn eine Atomlage um einen Platz weiterrutscht?",
            ),
          ],
          [
            cc(
              "Drei unbekannte feste Reinstoffe A, B und C werden untersucht: A schmilzt bei 65 °C und leitet weder fest noch flüssig; B schmilzt bei 801 °C und leitet erst als Schmelze; C schmilzt bei 1085 °C und leitet schon als Feststoff. Ordne A, B und C richtig zu!",
              "A = molekularer Stoff (z. B. Paraffinwachs), B = Salz (Natriumchlorid), C = Metall (Kupfer).",
              ["A = Salz, B = Metall, C = molekularer Stoff.", "A = Metall, B = molekularer Stoff, C = Salz."],
              "Niedriger Schmelzpunkt + Nichtleiter = Molekülstoff; hoher Schmelzpunkt + erst flüssig leitend = Salz; schon fest leitend = Metall.",
              "Nutze Schmelztemperatur und Leitfähigkeit (fest vs. flüssig) als Steckbrief!",
            ),
            cc(
              "Beim Sieden von Wasser bei 100 °C entweicht Wasserdampf. Werden dabei die gerichteten Bindungen innerhalb der H₂O-Moleküle gespalten?",
              "Nein — die H₂O-Moleküle bleiben vollständig intakt; überwunden werden nur die schwächeren Anziehungskräfte zwischen den Wassermolekülen.",
              ["Ja — beim Kochen im Wasserkocher zerfällt Wasser in Knallgas aus H₂ und O₂.", "Ja — jedes Sauerstoffatom verliert beim Sieden seine Wasserstoffatome."],
              "Sieden ist ein rein physikalischer Phasenübergang (H₂O(l) → H₂O(g)), keine chemische Zersetzung.",
              "Entsteht im Wasserkocher Wasserdampf oder explosives Knallgas?",
            ),
          ],
        ),
        cases(
          "leitfaehigkeit-gitter",
          [
            cc(
              "Wann leitet ein Salz wie Kaliumbromid den elektrischen Strom?",
              "Als Schmelze oder in Wasser gelöst, weil die Kationen und Anionen dann frei beweglich sind.",
              ["Nur als trockener, kalter Einkristall.", "Überhaupt nie, weil Salze keine Ladungsträger enthalten."],
              "Im festen Kristall sind Ionen zwar vorhanden, aber an feste Gitterplätze gebunden; erst Schmelzen oder Lösen macht sie beweglich.",
              "Zwei Bedingungen für Stromleitung: Ladungsträger vorhanden UND beweglich!",
            ),
            cc(
              "Welche Stoffeigenschaft haben Kohlenstoffdioxid, Methan und Stickstoff bei 20 °C gemeinsam — und warum?",
              "Alle drei sind gasförmig, weil zwischen ihren kleinen, ungeladenen Molekülen nur sehr schwache Anziehungskräfte wirken.",
              ["Alle drei sind spröde Kristalle mit Schmelzpunkten über 1000 °C.", "Alle drei sind silbrig glänzende elektrische Leiter."],
              "Schwache zwischenmolekulare Kräfte sind schon weit unterhalb der Raumtemperatur durch die Eigenbewegung überwunden.",
              "Welcher Teilchenverband liegt bei CO₂, CH₄ und N₂ vor?",
            ),
          ],
          [
            cc(
              "Diamant und Graphit bestehen beide nur aus Kohlenstoffatomen (Nichtmetall), schmelzen aber erst oberhalb von 3500 °C. Warum widerspricht das nicht dem Modell kleiner Moleküle?",
              "In Diamant und Graphit bilden die Kohlenstoffatome keine kleinen Einzelmoleküle, sondern riesige durchgehende Atomverbände mit starken gerichteten Bindungen.",
              ["Weil Kohlenstoff in Wirklichkeit ein flüssiges Alkalimetall ist.", "Weil Diamant aus Na⁺- und Cl⁻-Ionen besteht."],
              "Nur Stoffe aus kleinen, voneinander abgegrenzten Molekülen haben niedrige Schmelzpunkte; durchgehende Atomgitter sind extrem hochschmelzend.",
              "Liegen im Diamant kleine Einzelmoleküle oder ein durchgehendes Riesennetzwerk vor?",
            ),
            cc(
              "Warum darf ein brennendes elektrisches Gerät nicht mit Leitungswasser gelöscht werden, obwohl reinstes destilliertes Wasser den Strom kaum leitet?",
              "Leitungswasser ist eine Lösung mit gelösten Salzionen (z. B. Ca²⁺, Mg²⁺, Na⁺, Cl⁻) und leitet deshalb den elektrischen Strom gefährlich gut.",
              ["Weil destilliertes Wasser sofort zu brennen beginnt.", "Weil elektrischer Strom Wassermoleküle magnetisch macht."],
              "Gelöste Ionen im Leitungswasser dienen als frei bewegliche Ladungsträger und verursachen Stromschlaggefahr.",
              "Worin unterscheidet sich Leitungswasser von destilliertem Reinstwasser?",
            ),
          ],
        ),
      ],
    }),
  ],
};
