import {
  fmtSigned,
  molarMassFromParticleMassE24,
  PARTICLE_SPECIES,
  STOICH_REACTIONS,
  VM_NORM,
} from "../chemistry/model";
import { fmt, round } from "../exercises/format";
import { makeLab } from "../lab/definitions";
import type { Lesson } from "../model/types";
import { cases, cc, lesson, numberField, signed, withSlips } from "./helpers";

const stageId = "reaktion";

export const REAKTION_LESSONS_B: Lesson[] = [
  lesson(stageId, 5, {
    id: "ch-innere-energie-diagramm",
    title: "Innere Energie, Aktivierung und Energiediagramm",
    subtitle: "Exotherme und endotherme Reaktionen klassifizieren und grafisch darstellen",
    bindings: { I: 4 },
    why: "Warum brennt ein Streichholz erst nach dem Anreißen von selbst weiter, während Wasser nur fließt, solange Strom zugeführt wird?",
    html: "<p>Jeder Stoff besitzt aufgrund seiner chemischen Bindungen und der Bewegung seiner Teilchen einen charakteristischen Vorrat an <strong>innerer Energie E<sub>i</sub></strong>. Damit eine Reaktion überhaupt startet, müssen die Ausgangsstoffe zunächst auf einen Übergangszustand gebracht werden — dazu ist die <strong>Aktivierungsenergie E<sub>A</sub></strong> nötig (z.&nbsp;B. Reibungswärme am Streichholz oder Zündfunke).</p><p>Die Differenz <strong>ΔE<sub>i</sub> = E<sub>i</sub>(Produkte) − E<sub>i</sub>(Edukte)</strong> heißt <strong>Reaktionsenergie</strong>:</p><ul><li><strong>Exotherme Reaktion (ΔE<sub>i</sub> &lt; 0):</strong> Die Produkte sind energieärmer als die Edukte; insgesamt wird mehr Energie frei als zur Aktivierung aufgewendet wurde — die Reaktion gibt Energie (meist Wärme/Licht) an die Umgebung ab.</li><li><strong>Endotherme Reaktion (ΔE<sub>i</sub> &gt; 0):</strong> Die Produkte sind energiereicher als die Edukte; es muss dauerhaft Energie aus der Umgebung zugeführt werden (z.&nbsp;B. Wasserelektrolyse, Thermolyse von Diiodpentaoxid).</li></ul><p>Im <strong>Energiediagramm</strong> senkt ein <strong>Katalysator</strong> nur den Energieberg der Aktivierungsenergie <strong>E<sub>A</sub></strong> ab — die Niveaus von Edukten und Produkten und damit die Reaktionsenergie <strong>ΔE<sub>i</sub> bleiben völlig unverändert</strong>!</p><div class=\"example\"><strong>Beispiel:</strong> Liegt E<sub>i</sub>(Edukte) bei 80 kJ und E<sub>i</sub>(Produkte) bei 30 kJ, beträgt ΔE<sub>i</sub> = 30 kJ − 80 kJ = −50 kJ (exotherm).</div>",
    rule: "ΔE<sub>i</sub> = E<sub>i</sub>(Produkte) − E<sub>i</sub>(Edukte) · ΔE<sub>i</sub> &lt; 0 exotherm (Energieabgabe) · ΔE<sub>i</sub> &gt; 0 endotherm (Energieaufnahme) · Katalysator senkt E<sub>A</sub>, ändert ΔE<sub>i</sub> nicht",
    terms: [
      ["Reaktionsenergie ΔE<sub>i</sub>", "E<sub>i</sub>(Produkte) − E<sub>i</sub>(Edukte)", "negativ bei exotherm, positiv bei endotherm"],
      ["Aktivierungsenergie E<sub>A</sub>", "E<sub>i</sub>(Übergangszustand) − E<sub>i</sub>(Edukte)", "Energieberg zum Starten der Reaktion"],
      ["Katalysierte Kurve", "niedrigerer Gipfel E<sub>A,kat</sub> &lt; E<sub>A</sub>", "gleiche Start- und Endhöhe E<sub>i</sub>"],
    ],
    quiz: [
      "Wie verändert ein Katalysator das Energiediagramm einer exothermen Reaktion?",
      "Er verringert die Aktivierungsenergie E_A (flacherer Energieberg), lässt aber die Reaktionsenergie ΔE_i unverändert.",
      "Er verdoppelt den Betrag der frei werdenden Reaktionsenergie ΔE_i.",
      "Edukt- und Produktniveau hängen nur von den Stoffen selbst ab; der Katalysator eröffnet lediglich einen Reaktionsweg mit kleinerem E_A.",
    ],
    lab: makeLab("energiediagramm"),
    exercises: [
      {
        id: "reaktionsenergie-rechnen",
        make(rng, level) {
          const eEdukt = rng.pick([40, 60, 80, 100, 120]);
          const delta = rng.pick([-70, -50, -30, 30, 50, 70]);
          const eProdukt = eEdukt + delta;
          const ePeak = Math.max(eEdukt, eProdukt) + rng.pick([20, 30, 40]);
          const eA = ePeak - eEdukt;
          if (level === 1) {
            return {
              prompt: `In einem Energiediagramm liegt die innere Energie der Edukte bei E<sub>i</sub>(Edukte) = ${eEdukt} kJ, das Maximum des Übergangszustands bei E<sub>i</sub>(Max) = ${ePeak} kJ und die innere Energie der Produkte bei E<sub>i</sub>(Produkte) = ${signed(eProdukt)} kJ. Berechne die <strong>Aktivierungsenergie E<sub>A</sub></strong> und die vorzeichenbehaftete <strong>Reaktionsenergie ΔE<sub>i</sub></strong>.`,
              given: [`E<sub>i</sub>(Edukte) = ${eEdukt} kJ`, `E<sub>i</sub>(Max) = ${ePeak} kJ`, `E<sub>i</sub>(Produkte) = ${signed(eProdukt)} kJ`],
              formulaHint: "E_A = E_i(Max) − E_i(Edukte) · ΔE_i = E_i(Produkte) − E_i(Edukte)",
              fields: [
                withSlips(
                  numberField("E_A =", eA, "kJ", 0),
                  [ePeak - eProdukt, "Miss E_A vom Niveau der Edukte bis zum Maximum, nicht von den Produkten aus!"],
                ),
                withSlips(
                  numberField("ΔE_i =", delta, "kJ", 0),
                  [-delta, "Achte auf das Vorzeichen: ΔE_i = E_i(Produkte) − E_i(Edukte)!"],
                ),
              ],
              steps: [
                `Aktivierungsenergie: E_A = ${ePeak} kJ − ${eEdukt} kJ = ${eA} kJ.`,
                `Reaktionsenergie: ΔE_i = ${signed(eProdukt)} kJ − ${eEdukt} kJ = ${fmtSigned(delta, 0, "kJ")}.`,
                `<strong>E_A = ${eA} kJ, ΔE_i = ${signed(delta)} kJ</strong>`,
              ],
            };
          }
          const catReduction = rng.pick([10, 15, 20]);
          const eAKat = eA - catReduction;
          const peakKat = eEdukt + eAKat;
          return {
            prompt: `Ohne Katalysator startet eine Reaktion bei E<sub>i</sub>(Edukte) = ${eEdukt} kJ, überwindet den Gipfel E<sub>i</sub>(Max) = ${ePeak} kJ und endet bei E<sub>i</sub>(Produkte) = ${signed(eProdukt)} kJ. Ein Katalysator senkt die Aktivierungsenergie um ${catReduction} kJ. Auf welcher Höhe <strong>E<sub>i</sub>(Max, kat)</strong> liegt das neue Maximum, und wie groß bleibt <strong>ΔE<sub>i</sub></strong>?`,
            given: [],
            formulaHint: "Neues Maximum = E_i(Max) − Absenkung · ΔE_i bleibt mit Katalysator unverändert",
            fields: [
              withSlips(
                numberField("E_i(Max, kat) =", peakKat, "kJ", 0),
                [eAKat, `Gefragt ist die Energieniveau-Höhe im Diagramm (${eEdukt} + ${eAKat}), nicht nur E_A,kat allein.`],
              ),
              withSlips(
                numberField("ΔE_i =", delta, "kJ", 0),
                [delta - catReduction, "Der Katalysator ändert die Reaktionsenergie ΔE_i nicht!"],
                [-delta, "Vorzeichen beachten: E_i(Produkte) − E_i(Edukte)."],
              ),
            ],
            steps: [
              `Neues Maximum im Diagramm: ${ePeak} kJ − ${catReduction} kJ = ${peakKat} kJ (damit E_A,kat = ${eAKat} kJ).`,
              `Der Katalysator ändert weder Edukt- noch Produktniveau: ΔE_i = ${signed(eProdukt)} kJ − ${eEdukt} kJ = ${signed(delta)} kJ.`,
              `<strong>E_i(Max, kat) = ${peakKat} kJ, ΔE_i = ${signed(delta)} kJ</strong>`,
            ],
          };
        },
      },
      cases(
        "exotherm-endotherm",
        [
          cc(
            "Ein Taschenwärmer erwärmt bei der Reaktion seine Umgebung deutlich. Welches Vorzeichen hat ΔE_i und wie liegen die Energieniveaus?",
            "ΔE_i < 0 (exotherm): Die innere Energie der Produkte liegt tiefer als die der Edukte.",
            ["ΔE_i > 0 (endotherm): Die innere Energie der Produkte liegt höher als die der Edukte.", "ΔE_i = 0: Es findet kein Energieumsatz statt."],
            "Gibt das Reaktionssystem Wärme an die Umgebung ab, nimmt seine eigene innere Energie ab (ΔE_i negativ).",
            "Wärmeabgabe an die Umgebung → sinkt oder steigt die im Stoff gespeicherte innere Energie?",
          ),
          cc(
            "Warum explodiert ein Gemisch aus Methan und Luft bei Raumtemperatur nicht von selbst, obwohl die Verbrennung stark exotherm ist?",
            "Weil bei Raumtemperatur die Aktivierungsenergie E_A zum Aufbrechen erster Bindungen noch nicht erreicht ist.",
            ["Weil Methan bei 20 °C nicht brennbar ist.", "Weil die Verbrennung in Wirklichkeit endotherm ist."],
            "Die Aktivierungsenergie schützt energiereiche Stoffe vor spontanem Zerfall; erst ein Zündfunke liefert E_A.",
            "Welcher Energieberg verhindert den spontanen Reaktionsstart?",
          ),
        ],
        [
          cc(
            "Jemand behauptet: ‚Weil man das Eisen-Schwefel-Gemenge erst mit dem Brenner erhitzen muss, ist die Reaktion endotherm.‘ Was stellst du richtig?",
            "Das kurze Erhitzen liefert nur die Aktivierungsenergie E_A; da das Gemisch nach Wegnahme des Brenners von selbst hell weiterglüht, wird insgesamt Energie frei (exotherm, ΔE_i < 0).",
            ["Jede Reaktion, die einen Gasbrenner benötigt, ist zwingend endotherm.", "Exotherme Reaktionen haben niemals eine Aktivierungsenergie."],
            "Auch exotherme Reaktionen benötigen meist eine einmalige Aktivierung; entscheidend für exotherm/endotherm ist die Gesamtbilanz ΔE_i.",
            "Unterscheide einmaliges Zünden (E_A) und dauerhafte Energiezufuhr (ΔE_i > 0)!",
          ),
          cc(
            "Für die Elektrolyse von Wasser gilt ΔE_i = +572 kJ (pro 2 mol flüssigem Wasser). Welchen Betrag und welches Vorzeichen hat ΔE_i für die Umkehrreaktion (Synthese von 2 mol flüssigem Wasser aus Knallgas)?",
            "ΔE_i = −572 kJ (gleich großer Betrag, umgekehrtes Vorzeichen — stark exotherm).",
            ["ΔE_i = +572 kJ (ebenfalls endotherm).", "ΔE_i = 0 kJ."],
            "Bei Hin- und Rückreaktion tauschen Edukte und Produkte im Energiediagramm genau die Plätze.",
            "Tausche E_i(Edukte) und E_i(Produkte) in ΔE_i = E_i(Pr.) − E_i(Ed.)!",
          ),
        ],
      ),
    ],
  }),
  lesson(stageId, 6, {
    id: "ch-katalyse-oberflaeche",
    title: "Katalyse und Vorgänge an der Katalysatoroberfläche",
    subtitle: "Eigenschaften von Katalysatoren experimentell prüfen und im Teilchenmodell erklären",
    bindings: { I: 4 },
    why: "Von Enzymen in unseren Körperzellen bis zur Ammoniaksynthese und Abgasreinigung: Katalysatoren sparen Temperatur, Zeit und riesige Mengen Energie.",
    html: "<p>Im Experiment (z.&nbsp;B. Zersetzung von Wasserstoffperoxid durch Braunstein MnO<sub>2</sub> oder Entzünden von Wasserstoff an fein verteiltem Platin schon bei Raumtemperatur) ermittelst du die vier kennzeichnenden Eigenschaften eines <strong>Katalysators</strong>: 1.&nbsp;Er <strong>setzt die Aktivierungsenergie E<sub>A</sub> herab</strong>, sodass Reaktionen schon bei deutlich niedrigerer Temperatur ablaufen. 2.&nbsp;Er <strong>erhöht die Reaktionsgeschwindigkeit</strong>. 3.&nbsp;Er geht aus der Reaktion <strong>chemisch unverändert in gleicher Masse</strong> wieder hervor (wird nicht verbraucht). 4.&nbsp;Er ändert die Reaktionsenergie <strong>ΔE<sub>i</sub> nicht</strong>.</p><p>Auf der Teilchenebene läuft eine heterogene <strong>Oberflächenkatalyse</strong> (z.&nbsp;B. 2 CO + O<sub>2</sub> → 2 CO<sub>2</sub> an Platin) in Teilschritten ab: <strong>1.&nbsp;Adsorption</strong> (Eduktmoleküle lagern sich an aktive Zentren der Katalysatoroberfläche an) → <strong>2.&nbsp;Bindungslockerung &amp; Spaltung</strong> (z.&nbsp;B. wird die O–O-Bindung auf der Metalloberfläche geschwächt und in einzelne gebundene O-Atome getrennt — deshalb sinkt E<sub>A</sub>!) → <strong>3.&nbsp;Oberflächenreaktion</strong> (neue Bindung zum Produktmolekül CO<sub>2</sub>) → <strong>4.&nbsp;Desorption</strong> (Produktmoleküle lösen sich ab, die Katalysatoroberfläche ist wieder frei für den nächsten Zyklus).</p><div class=\"example\"><strong>Beispiel:</strong> Ein Stück Würfelzucker schmilzt am Streichholz nur, brennt aber nicht. Reibst du etwas mineralische Asche (Katalysator) auf eine Ecke, lässt sich der Würfelzucker sofort mit leuchtender Flamme entzünden!</div>",
    rule: "Katalysator senkt E<sub>A</sub>, beschleunigt die Reaktion und liegt am Ende unverändert vor · Oberflächenmodell: Adsorption → Bindungslockerung → Reaktion → Desorption",
    terms: [
      ["Katalysator", "Stoff, der E<sub>A</sub> senkt und unverändert aus der Reaktion hervorgeht", "steht über dem Reaktionspfeil, nicht als verbrauchtes Edukt"],
      ["Adsorption", "Anlagerung von Gasmolekülen an die Katalysatoroberfläche", "lockert bestehende Bindungen im Molekül"],
      ["Desorption", "Ablösen der gebildeten Produktmoleküle", "macht aktive Zentren für neue Edukte frei"],
    ],
    quiz: [
      "Du gibst 0,50 g schwarzes Mangandioxid (Braunstein) zu Wasserstoffperoxidlösung. Es schäumt heftig Sauerstoff auf. Welche Masse an Mangandioxid findest du nach vollständigem Abklingen der Reaktion nach Abfiltrieren und Trocknen wieder?",
      "Wieder 0,50 g Mangandioxid, denn ein Katalysator wird bei der Reaktion nicht verbraucht.",
      "0,00 g, weil sich der Katalysator vollständig in Sauerstoffgas umgewandelt hat.",
      "Ein Katalysator nimmt zwar über Zwischenstufen teil, liegt nach dem Zyklus aber in unveränderter Masse und Zusammensetzung wieder vor.",
    ],
    lab: makeLab("katalyse"),
    exercises: [
      cases(
        "katalysator-eigenschaften",
        [
          cc(
            "Wo notiert man einen Katalysator (z. B. Platin Pt) fachgerecht in einer chemischen Reaktionsgleichung?",
            "Über (oder unter) dem Reaktionspfeil, da er weder im Gesamtumsatz verbraucht noch neu gebildet wird.",
            ["Mit dem Koeffizienten 5 nur auf der Produktseite.", "Als Index unten rechts an die Produktformel gehängt."],
            "Da vor und nach der Reaktion dieselbe Katalysatormenge vorliegt, kürzt er sich aus der Netto-Stoffbilanz heraus und steht über dem Pfeil.",
            "Wird ein Katalysator insgesamt verbraucht?",
          ),
          cc(
            "Warum wird das Edelmetall Platin in technischen Katalysatoren als hauchdünne Schicht auf tausende feine Wabenkanäle aufgetragen statt als massiver Metallwürfel?",
            "Um eine möglichst große Katalysatoroberfläche mit sehr vielen gleichzeitig zugänglichen aktiven Zentren zu schaffen.",
            ["Weil ein massiver Platinwürfel bei 100 °C verdampfen würde.", "Damit die Abgase überhaupt nicht mit dem Platin in Kontakt kommen."],
            "Oberflächenkatalyse findet direkt an der Grenzfläche statt: Je größer die Oberfläche, desto mehr Moleküle können gleichzeitig adsorbieren.",
            "Wo genau finden Adsorption und Bindungslockerung statt?",
          ),
          cc(
            "Welche Reihenfolge beschreibt die Vorgänge an einer Katalysatoroberfläche im Teilchenmodell korrekt?",
            "Adsorption der Edukte → Bindungslockerung und Reaktion an der Oberfläche → Desorption der Produkte",
            ["Desorption der Edukte → Schmelzen des Katalysators → Verdampfen des Metalls", "Vernichtung der Atome → Neubildung aus Wärme → Adsorption"],
            "Erst anlagern (Adsorption), dann erleichtert umgruppieren, zuletzt ablösen (Desorption).",
            "Ad- (anlagern) kommt vor De- (ablösen)!",
          ),
        ],
        [
          cc(
            "Früher durften Autos mit Abgaskatalysator auf keinen Fall mit verbleitem Benzin betankt werden (‚Katalysatorvergiftung‘). Wie erklärst du das mit dem Oberflächenmodell?",
            "Bleiverbindungen belegen dauerhaft die aktiven Zentren der Platinoberfläche, sodass CO- und O₂-Moleküle dort nicht mehr adsorbieren können.",
            ["Blei kühlt das Abgas auf −100 °C ab.", "Blei verwandelt Platinatome durch Kernfusion in Gold."],
            "Sind die aktiven Oberflächenplätze dauerhaft blockiert, fällt die katalytische Wirkung aus.",
            "Was passiert, wenn die Plätze auf der Oberfläche dauerhaft besetzt bleiben?",
          ),
          cc(
            "Ein Werbetext verspricht: ‚Unser Wunder-Katalysator holt aus 1 Liter Heizöl doppelt so viel Verbrennungswärme heraus!‘ Warum ist diese Aussage naturwissenschaftlich falsch?",
            "Ein Katalysator senkt nur die Aktivierungsenergie E_A und beschleunigt den Umsatz, kann aber die Reaktionsenergie ΔE_i pro Mol Brennstoff niemals vergrößern.",
            ["Weil Katalysatoren Reaktionen immer nur verlangsamen.", "Weil Heizöl ohne Katalysator überhaupt keine innere Energie besitzt."],
            "ΔE_i = E_i(Produkte) − E_i(Edukte) ist durch Anfangs- und Endstoffe fest vorgegeben — auch mit Katalysator gilt Energieerhaltung.",
            "Ändert ein Katalysator ΔE_i?",
          ),
        ],
      ),
      cases(
        "katalyse-experimente",
        [
          cc(
            "Wie heißen die Biokatalysatoren aus Eiweißmolekülen, die in menschlichen Zellen den Abbau von Nährstoffen schon bei 37 °C ermöglichen?",
            "Enzyme",
            ["Edelgase", "Legierungen"],
            "Enzyme senken als hochspezifische Biokatalysatoren die Aktivierungsenergie biochemischer Reaktionen auf Körpertemperatur.",
            "Wie nennt die Biologie/Chemie Katalysatoren in Lebewesen?",
          ),
          cc(
            "Beim Döbereiner-Feuerzeug strömt kaltes Wasserstoffgas an der Luft auf fein verteiltes Platin (Platinschwamm) und entzündet sich ohne Funken. Warum?",
            "An der Platinoberfläche ist die Aktivierungsenergie für 2 H₂ + O₂ → 2 H₂O so stark herabgesetzt, dass die Reaktion schon bei Raumtemperatur anspringt und das Platin zum Glühen bringt.",
            ["Platin verbrennt dabei selbst vollständig zu gasförmigem Platinoxid.", "Wasserstoff gefriert am Platin und gibt Erstarrungswärme ab."],
            "Die stark exotherme Oberflächenreaktion erhitzt den Platinschwamm, bis die Zündtemperatur des nachströmenden Wasserstoffs erreicht ist.",
            "Wie wirkt der Platinschwamm auf E_A der Knallgasreaktion?",
          ),
        ],
        [
          cc(
            "Du möchtest im Experiment nachweisen, dass Braunstein (MnO₂) bei der Zersetzung von Wasserstoffperoxid wirklich als Katalysator und nicht als gewöhnliches Edukt gewirkt hat. Welche zwei Prüfungen gehören zusammen?",
            "1. Rückwiegen nach Trocknen zeigt unveränderte Masse; 2. Zugabe von frischem Wasserstoffperoxid zum abgetrennten Pulver löst erneut dieselbe heftige Sauerstoffentwicklung aus.",
            ["Nur die Farbe der Flüssigkeit schätzen.", "Das Reagenzglas nach dem Versuch wegwerfen."],
            "Unveränderte Masse UND erhaltene Wirksamkeit bei erneuter Eduktzugabe belegen die Katalysatoreigenschaft überzeugend.",
            "Was muss nach der Reaktion für Masse und Wirksamkeit des Stoffes gelten?",
          ),
          cc(
            "Kann ein Katalysator eine Reaktion erzwingen, für die die nötige Gesamtenergie ΔE_i > 0 bei einer stark endothermen Reaktion überhaupt nicht bereitsteht?",
            "Nein — ist die thermische Energie geringer als ΔE_i, liegt schon das Produktniveau unerreichbar hoch; auch der beste Katalysator kann E_A niemals unter ΔE_i drücken.",
            ["Ja — mit Katalysator läuft jede endotherme Reaktion bei −200 °C ohne Energiezufuhr ab.", "Ja — der Katalysator liefert die fehlende Energie aus seinen eigenen Kernen."],
            "Für jede endotherme Reaktion gilt im Energiediagramm zwingend E_A ≥ ΔE_i.",
            "Schau aufs Energiediagramm einer endothermen Reaktion: Kann der Gipfel tiefer liegen als die Produktstufe?",
          ),
        ],
      ),
    ],
  }),
  lesson(stageId, 7, {
    id: "ch-teilchenmasse-molare-masse",
    title: "Teilchenmasse, Avogadro-Konstante und molare Masse",
    subtitle: "Aus absoluten Atom- und Molekülmassen die molare Masse berechnen",
    bindings: { I: 4 },
    why: "Ein einzelnes Wassermolekül wiegt unvorstellbar winzige 2,99 · 10⁻²³ g — das ‚Chemiker-Paket‘ von 6,022 · 10²³ Teilchen macht daraus handliche 18,0 g auf der Laborwaage!",
    html: "<p>Die <strong>absolute Masse m(Teilchen)</strong> eines einzelnen Atoms oder Moleküls in Gramm ist extrem klein: Ein Wasserstoffatom wiegt rund <strong>1,66 · 10<sup>−24</sup> g</strong>, ein Kohlenstoffatom (<sup>12</sup>C) rund <strong>19,93 · 10<sup>−24</sup> g</strong>. Deshalb definiert man ein Zwölftel der Masse eines <sup>12</sup>C-Atoms als <strong>atomare Masseneinheit 1 u ≈ 1,6605 · 10<sup>−24</sup> g</strong>: Damit hat H die Teilchenmasse 1,0 u, O 16,0 u und ein Wassermolekül H<sub>2</sub>O genau 2 · 1,0 u + 16,0 u = <strong>18,0 u</strong> (bzw. dimensionslos als relative Molekülmasse M<sub>r</sub> = 18,0).</p><p>Wie viele Teilchen der Masse 1 u ergeben auf der Waage genau 1,00 g? Der Quotient 1 g / (1,66054 · 10<sup>−24</sup> g) liefert die <strong>Avogadro-Konstante N<sub>A</sub> ≈ 6,022 · 10<sup>23</sup> mol<sup>−1</sup></strong>! Fasst man genau N<sub>A</sub> Teilchen zu der Stoffmenge <strong>1 mol</strong> zusammen, so berechnet sich die <strong>molare Masse M</strong> direkt aus der absoluten Teilchenmasse:</p><p style=\"text-align:center\"><strong>M = m(Teilchen) · N<sub>A</sub></strong></p><p>Praktischer Clou: Der Zahlenwert der Teilchenmasse in <strong>u</strong> stimmt exakt mit dem Zahlenwert der molaren Masse <strong>M in g/mol</strong> überein (m(H<sub>2</sub>O) = 18,0 u ⇔ M(H<sub>2</sub>O) = 18,0 g/mol)!</p><div class=\"example\"><strong>Beispiel:</strong> Ein Methanmolekül (CH<sub>4</sub>) hat die absolute Masse m(CH<sub>4</sub>) = 26,57 · 10<sup>−24</sup> g. Multiplikation mit N<sub>A</sub> = 6,022 · 10<sup>23</sup> mol<sup>−1</sup> ergibt M(CH<sub>4</sub>) = 26,57 · 10<sup>−24</sup> g · 6,022 · 10<sup>23</sup> mol<sup>−1</sup> = 26,57 · 0,6022 g/mol ≈ <strong>16,0 g/mol</strong>.</div>",
    rule: "1 u ≈ 1,6605 · 10<sup>−24</sup> g · N<sub>A</sub> ≈ 6,022 · 10<sup>23</sup> mol<sup>−1</sup> · M = m(Teilchen) · N<sub>A</sub> (Zahlenwert in u = Zahlenwert in g/mol)",
    terms: [
      ["Atomare Masseneinheit u", "1 u = 1/12 · m(<sup>12</sup>C) ≈ 1,6605 · 10<sup>−24</sup> g", "für einzelne Atome und Moleküle"],
      ["Avogadro-Konstante N<sub>A</sub>", "N<sub>A</sub> = N / n ≈ 6,022 · 10<sup>23</sup> mol<sup>−1</sup>", "Teilchenzahl pro 1 mol Stoff"],
      ["Molare Masse M", "M = m(Teilchen) · N<sub>A</sub> = m / n", "Einheit: g/mol"],
    ],
    quiz: [
      "Ein Schwefeldioxidmolekül (SO₂) besitzt die Teilchenmasse 64,1 u. Wie groß ist die molare Masse M(SO₂)?",
      "64,1 g/mol — denn 1 u · N_A ergibt genau 1 g/mol.",
      "6,022 g/mol — denn alle Gase haben dieselbe molare Masse.",
      "Weil 1 u · 6,022 · 10²³ mol⁻¹ = 1 g/mol gilt, ist der Zahlenwert in u identisch mit dem Zahlenwert in g/mol.",
    ],
    lab: makeLab("molmasse"),
    exercises: [
      {
        id: "molmasse-aus-teilchenmasse",
        make(rng, level) {
          const sp = rng.pick(PARTICLE_SPECIES);
          const M = molarMassFromParticleMassE24(sp.massE24g);
          if (level === 1) {
            return {
              prompt: `Ein einzelnes <strong>${sp.name} (${sp.formula})</strong> besitzt die absolute Masse m(Teilchen) = ${fmt(sp.massE24g, 2)} · 10<sup>−24</sup> g. Berechne mithilfe der Avogadro-Konstante N<sub>A</sub> = 6,022 · 10<sup>23</sup> mol<sup>−1</sup> die <strong>molare Masse M(${sp.formula})</strong> in g/mol (auf eine Nachkommastelle).`,
              given: [
                `m(${sp.formula}) = ${fmt(sp.massE24g, 2)} · 10<sup>−24</sup> g`,
                "N<sub>A</sub> = 6,022 · 10<sup>23</sup> mol<sup>−1</sup>",
                "Zehnerpotenzen: 10<sup>−24</sup> · 10<sup>23</sup> = 10<sup>−1</sup> = 0,1",
              ],
              formulaHint: "M = m(Teilchen) · N_A = (Zahlenwert in 10⁻²⁴ g) · 0,6022 g/mol",
              fields: [
                withSlips(
                  numberField("M =", M, "g/mol", 1),
                  [round(M * 10, 1), "Zehnerpotenz-Check: 10⁻²⁴ · 10²³ = 10⁻¹ = 0,1 (Komma um eine Stelle nach links!)."],
                  [round(sp.massE24g / 0.6022, 1), "Multipliziere m(Teilchen) mit N_A, statt zu dividieren!"],
                ),
              ],
              steps: [
                "Ansatz: M = m(Teilchen) · N_A.",
                `Einsetzen: M = ${fmt(sp.massE24g, 2)} · 10⁻²⁴ g · 6,022 · 10²³ mol⁻¹ = ${fmt(sp.massE24g, 2)} · 0,6022 g/mol = ${fmt(M, 1)} g/mol.`,
                `<strong>M(${sp.formula}) = ${fmt(M, 1)} g/mol</strong>`,
              ],
            };
          }
          // Level 2: Rückrechnung aus molarer Masse M auf die absolute Teilchenmasse in 10^-24 g
          const molecules = rng.pick([
            { name: "Ethan (C₂H₆)", M: 30.0 },
            { name: "Propan (C₃H₈)", M: 44.0 },
            { name: "Stickstoffmonooxid (NO)", M: 30.0 },
            { name: "Schwefelwasserstoff (H₂S)", M: 34.1 },
            { name: "Wasserstoffperoxid (H₂O₂)", M: 34.0 },
          ]);
          const mE24 = round(molecules.M / 0.6022, 1);
          return {
            prompt: `Die Verbindung <strong>${molecules.name}</strong> hat die molare Masse M = ${fmt(molecules.M, 1)} g/mol. Berechne mit N<sub>A</sub> = 6,022 · 10<sup>23</sup> mol<sup>−1</sup> die absolute Masse eines einzelnen Moleküls in der Einheit <strong>10<sup>−24</sup> g</strong> (auf eine Nachkommastelle).`,
            given: [],
            formulaHint: "m(Teilchen) = M / N_A  ⇒  in 10⁻²⁴ g gilt: Zahlenwert = M / 0,6022",
            fields: [
              withSlips(
                numberField("m(Teilchen) =", mE24, "· 10⁻²⁴ g", 1),
                [round(molecules.M * 0.6022, 1), "Stelle M = m(Teilchen) · N_A nach m(Teilchen) um: m(Teilchen) = M / N_A!"],
                [round(mE24 / 10, 1), "Achte auf die Zehnerpotenz 10⁻²⁴ g: 1 / (6,022 · 10²³) = (1 / 0,6022) · 10⁻²⁴."],
              ),
            ],
            steps: [
              "Aus M = m(Teilchen) · N_A folgt m(Teilchen) = M / N_A.",
              `m(Teilchen) = ${fmt(molecules.M, 1)} g/mol / (6,022 · 10²³ mol⁻¹) = (${fmt(molecules.M, 1)} / 0,6022) · 10⁻²⁴ g ≈ ${fmt(mE24, 1)} · 10⁻²⁴ g.`,
              `<strong>m(Teilchen) = ${fmt(mE24, 1)} · 10⁻²⁴ g</strong>`,
            ],
          };
        },
      },
      cases(
        "avogadro-konzept",
        [
          cc(
            "Du wiegst im Labor 18,0 g Wasser (M = 18,0 g/mol) und 44,0 g Kohlenstoffdioxid (M = 44,0 g/mol) ab. Wie verhalten sich die Anzahlen der enthaltenen Moleküle?",
            "Beide Stoffportionen enthalten gleich viele Moleküle, nämlich jeweils 1 mol ≈ 6,022 · 10²³ Moleküle.",
            ["Im schwereren Kohlenstoffdioxid befinden sich mehr als doppelt so viele Moleküle.", "Im flüssigen Wasser befinden sich überhaupt keine abzählbaren Teilchen."],
            "n = m / M liefert für beide Portionen genau n = 1,0 mol und damit dieselbe Teilchenzahl N = N_A.",
            "Berechne für beide Portionen n = m / M!",
          ),
          cc(
            "Warum ist ein Sauerstoffmolekül (O₂, 32 u) sechzehnmal so schwer wie ein Wasserstoffmolekül (H₂, 2 u)?",
            "Weil jedes einzelne Sauerstoffatom (16 u) die 16-fache Masse eines Wasserstoffatoms (1 u) besitzt und beide Moleküle zweiatomig sind.",
            ["Weil Sauerstoff aus 16 Atomen pro Molekül besteht.", "Weil Wasserstoff keine Masse besitzt."],
            "2 · 16 u = 32 u gegenüber 2 · 1 u = 2 u ergibt das Massenverhältnis 32 : 2 = 16 : 1.",
            "Vergleiche 2 · 16 u mit 2 · 1 u!",
          ),
        ],
        [
          cc(
            "In 1,0 mol Ammoniakgas (NH₃) befinden sich rund 6,0 · 10²³ NH₃-Moleküle. Wie viele einzelne Atome (N und H zusammengerechnet) sind in diesem Mol enthalten?",
            "Viermal so viele, also rund 2,4 · 10²⁴ Atome (1 mol N-Atome + 3 mol H-Atome).",
            ["Genau 6,0 · 10²³ Atome.", "Nur ein Viertel, also 1,5 · 10²³ Atome."],
            "Jedes einzelne NH₃-Molekül besteht aus 1 + 3 = 4 Atomen → 4 · 6,0 · 10²³ = 24 · 10²³ = 2,4 · 10²⁴ Atome.",
            "Wie viele Atome sitzen in jedem einzelnen NH₃-Molekül?",
          ),
          cc(
            "Warum hat die relative Molekülmasse M_r keine Einheit, die molare Masse M aber die Einheit g/mol?",
            "M_r ist ein reines Zahlenverhältnis zur Masseneinheit u, während M = m / n den Quotienten aus Masse (g) und Stoffmenge (mol) angibt.",
            ["Weil Chemiker Einheiten nach Belieben weglassen dürfen.", "Weil g/mol dasselbe bedeutet wie Grad Celsius."],
            "Größengleichungen müssen einheitentreu sein: Masse in g geteilt durch Stoffmenge in mol ergibt zwingend g/mol.",
            "Schau auf die Definitionsgleichung M = m / n!",
          ),
        ],
      ),
    ],
  }),
  lesson(stageId, 8, {
    id: "ch-stoffmenge-molvolumen",
    title: "Stoffmenge, Masse, Teilchenzahl und molares Volumen",
    subtitle: "Mit den vier Quantitätsgrößen und ihren Umrechnungsgrößen sicher rechnen",
    bindings: { I: 4 },
    why: "Die Stoffmenge n ist das Drehkreuz der Chemie: Von ihr kommst du in einem Schritt zu Masse, Gasvolumen und Teilchenzahl!",
    html: "<p>Wie groß eine Stoffportion ist, beschreiben vier <strong>Quantitätsgrößen</strong>: die <strong>Stoffmenge n</strong> (in mol), die <strong>Masse m</strong> (in g), das <strong>Volumen V</strong> (in l oder cm³) und die <strong>Teilchenzahl N</strong>. Verbunden werden sie durch feste <strong>Umrechnungsgrößen</strong>:</p><ul><li>Zwischen Masse und Stoffmenge vermittelt die <strong>molare Masse</strong>: <strong>M = m / n</strong> ⇔ <strong>m = n · M</strong>.</li><li>Zwischen Teilchenzahl und Stoffmenge vermittelt die <strong>Avogadro-Konstante</strong>: <strong>N<sub>A</sub> = N / n</strong> ⇔ <strong>N = n · N<sub>A</sub></strong>.</li><li>Für alle (nahezu idealen) <strong>Gase</strong> gilt nach dem Satz von Avogadro bei gleicher Temperatur und gleichem Druck dasselbe <strong>molare Volumen V<sub>m</sub> = V / n</strong>! Im <strong>Normzustand</strong> (0 °C, 1013 hPa) nimmt 1 mol jedes Gases <strong>V<sub>m</sub> = 22,4 l/mol</strong> ein (bei Raumbedingungen 20 °C ca. 24 l/mol).</li><li>Zwischen Masse und Volumen vermittelt die <strong>Dichte ρ = m / V</strong> (für Gase gilt damit auch ρ = M / V<sub>m</sub>).</li></ul><div class=\"example\"><strong>Beispiel:</strong> n = 1,5 mol Sauerstoffgas (O<sub>2</sub>, M = 32 g/mol) haben die Masse m = 1,5 mol · 32 g/mol = <strong>48 g</strong> und nehmen im Normzustand das Volumen V = 1,5 mol · 22,4 l/mol = <strong>33,6 l</strong> ein.</div>",
    rule: "Drehkreuz Stoffmenge n: n = m / M = V(Gas) / V<sub>m</sub> = N / N<sub>A</sub> · Im Normzustand (0 °C, 1013 hPa) gilt für Gase V<sub>m</sub> = 22,4 l/mol",
    terms: [
      ["Masse ↔ Stoffmenge", "n = m / M · m = n · M", "m in g, M in g/mol, n in mol"],
      ["Gasvolumen ↔ Stoffmenge", "n = V / V<sub>m</sub> · V = n · V<sub>m</sub>", "Normzustand (0 °C, 1013 hPa): V<sub>m</sub> = 22,4 l/mol"],
      ["Teilchenzahl & Gasdichte", "N = n · N<sub>A</sub> · ρ(Gas) = m / V = M / V<sub>m</sub>", "ρ(Luft, 0 °C) ≈ 1,29 g/l zum Vergleich"],
    ],
    quiz: [
      "Im Normzustand (0 °C, 1013 hPa) sind ein Ballon mit 1,0 mol Wasserstoff (M = 2 g/mol) und ein Ballon mit 1,0 mol Kohlenstoffdioxid (M = 44 g/mol) gefüllt. Was gilt für Volumen und Masse?",
      "Beide haben dasselbe Volumen V = 22,4 l, aber verschiedene Massen (2 g vs. 44 g).",
      "Kohlenstoffdioxid nimmt das 22-fache Volumen von Wasserstoff ein.",
      "Im Gaszustand ist der mittlere Teilchenabstand viel größer als die Molekülgröße — daher hängt V = n · V_m nur von der Stoffmenge n ab!",
    ],
    lab: makeLab("quantitaetsgroessen"),
    exercises: [
      {
        id: "stoffmenge-volumen-masse",
        make(rng, level) {
          const gas = rng.pick([
            { name: "Sauerstoff", formula: "O₂", M: 32 },
            { name: "Stickstoff", formula: "N₂", M: 28 },
            { name: "Kohlenstoffdioxid", formula: "CO₂", M: 44 },
            { name: "Methan", formula: "CH₄", M: 16 },
            { name: "Wasserstoff", formula: "H₂", M: 2 },
          ]);
          const n = rng.pick([0.25, 0.5, 1.5, 2.0, 2.5, 3.0]);
          const mass = round(n * gas.M, 1);
          const vol = round(n * VM_NORM, 1);
          if (level === 1) {
            return {
              prompt: `Eine Gasflasche liefert n = ${fmt(n, 2)} mol <strong>${gas.name} (${gas.formula}, M = ${gas.M} g/mol)</strong> im Normzustand (V<sub>m</sub> = 22,4 l/mol). Berechne die <strong>Masse m</strong> in Gramm und das <strong>Gasvolumen V</strong> in Litern.`,
              given: [`n = ${fmt(n, 2)} mol`, `M(${gas.formula}) = ${gas.M} g/mol`, "V<sub>m</sub> = 22,4 l/mol"],
              formulaHint: "m = n · M  und  V = n · V_m",
              fields: [
                withSlips(
                  numberField("m =", mass, "g", 1),
                  [round(gas.M / n, 1), "Multipliziere n · M, statt M durch n zu teilen."],
                ),
                withSlips(
                  numberField("V =", vol, "l", 1),
                  [round(VM_NORM / n, 1), "Multipliziere n · V_m, statt V_m durch n zu teilen."],
                ),
              ],
              steps: [
                `Masse berechnen: m = n · M = ${fmt(n, 2)} mol · ${gas.M} g/mol = ${fmt(mass, 1)} g.`,
                `Gasvolumen berechnen: V = n · V_m = ${fmt(n, 2)} mol · 22,4 l/mol = ${fmt(vol, 1)} l.`,
                `<strong>m = ${fmt(mass, 1)} g, V = ${fmt(vol, 1)} l</strong>`,
              ],
            };
          }
          // Level 2: Von gegebenem Normvolumen V über n zur Masse m!
          return {
            prompt: `Ein Gassammelrohr enthält im Normzustand (0 °C, 1013 hPa; V<sub>m</sub> = 22,4 l/mol) genau V = ${fmt(vol, 1)} l <strong>${gas.name} (${gas.formula}, M = ${gas.M} g/mol)</strong>. Welche <strong>Masse m</strong> in Gramm besitzt diese Gasportion? Runde auf eine Nachkommastelle.`,
            given: [],
            formulaHint: "1. n = V / V_m  →  2. m = n · M",
            fields: [
              withSlips(
                numberField("m =", mass, "g", 1),
                [n, `Das ist die Stoffmenge n = ${fmt(n, 2)} mol — multipliziere sie noch mit M = ${gas.M} g/mol!`],
                [round((vol * VM_NORM) / gas.M, 1), "Rechne zuerst n = V / 22,4 l/mol und dann m = n · M."],
              ),
            ],
            steps: [
              `Stoffmenge berechnen: n = V / V_m = ${fmt(vol, 1)} l / 22,4 l/mol = ${fmt(n, 2)} mol.`,
              `Masse berechnen: m = n · M = ${fmt(n, 2)} mol · ${gas.M} g/mol = ${fmt(mass, 1)} g.`,
              `<strong>m = ${fmt(mass, 1)} g</strong>`,
            ],
          };
        },
      },
      cases(
        "molvolumen-wissen",
        [
          cc(
            "Darfst du für 1,0 mol flüssiges Wasser bei 20 °C mit V = n · 22,4 l/mol = 22,4 l rechnen?",
            "Nein — V_m = 22,4 l/mol gilt nur für Gase im Normzustand; 1 mol flüssiges Wasser wiegt 18 g und hat mit ρ = 1 g/cm³ nur 18 ml Volumen!",
            ["Ja — 1 mol jedes Feststoffs und jeder Flüssigkeit nimmt immer 22,4 l ein.", "Nein — 1 mol flüssiges Wasser hat 224 l Volumen."],
            "In Flüssigkeiten und Feststoffen liegen die Teilchen dicht gepackt; das universelle molare Volumen 22,4 l/mol gilt ausschließlich für Gase.",
            "Ist Wasser bei 20 °C ein Gas oder eine Flüssigkeit?",
          ),
          cc(
            "Welches der Gase H₂ (M = 2 g/mol), N₂ (M = 28 g/mol), O₂ (M = 32 g/mol) und CO₂ (M = 44 g/mol) sammelt sich am Boden eines offenen Becherglases, weil seine Dichte deutlich größer als die von Luft (M̄ ≈ 29 g/mol) ist?",
            "Kohlenstoffdioxid (CO₂), da aus M = 44 g/mol > 29 g/mol wegen ρ = M / V_m eine höhere Gasdichte folgt.",
            ["Wasserstoff (H₂), da er die kleinste molare Masse hat.", "Stickstoff (N₂), da er dreimal so schwer wie Luft ist."],
            "Bei gleichem molarem Volumen V_m entscheidet direkt die molare Masse M über die Gasdichte ρ = M / V_m: CO₂ (1,96 g/l) sinkt in Luft (1,29 g/l) nach unten.",
            "Vergleiche M des Gases mit dem Luft-Mittelwert 29 g/mol!",
          ),
        ],
        [
          cc(
            "Ein Wetterballon steigt mit Helium (He, M = 4 g/mol) ebenso gut auf wie mit Wasserstoff (H₂, M = 2 g/mol), ist aber viel sicherer. Warum nutzt man heute Helium?",
            "Beide haben eine viel kleinere Dichte als Luft (Auftrieb!), aber das Edelgas Helium ist im Gegensatz zu Wasserstoff unbrennbar.",
            ["Weil Helium mit Sauerstoff zu Wasser verbrennt.", "Weil 1 mol Helium ein zehnmal größeres Normvolumen als 1 mol Wasserstoff hat."],
            "Mit ρ(He) = 4 / 22,4 ≈ 0,18 g/l << ρ(Luft) ≈ 1,29 g/l trägt Helium stark nach oben, ohne Knallgasgefahr.",
            "Kombiniere Gasdichte ρ = M / V_m und Brennbarkeit!",
          ),
          cc(
            "Welche Größe ändert sich NICHT, wenn ein fest verschlossener Stahlzylinder mit 2,0 mol Stickstoffgas von 0 °C auf 80 °C erwärmt wird?",
            "Sowohl die Stoffmenge n = 2,0 mol als auch die Masse m = 56,0 g und die Teilchenzahl N bleiben exakt konstant.",
            ["Die Teilchenzahl N verdoppelt sich durch die Erwärmung.", "Die Masse m steigt mit dem Gasdruck an."],
            "Im geschlossenen, starren Gefäß steigen Druck und Teilchengeschwindigkeit, aber kein Molekül kommt hinzu oder verschwindet.",
            "Ändert Erwärmen im geschlossenen Zylinder die Anzahl der Moleküle?",
          ),
        ],
      ),
    ],
  }),
  lesson(stageId, 9, {
    id: "ch-stoffumsatz-rechnen",
    title: "Stoffumsatzberechnungen mit Größengleichungen",
    subtitle: "Massen und Gasvolumina bei einfachen Molekülreaktionen im Dreischritt berechnen",
    bindings: { I: 4 },
    why: "Wie viel Sauerstoff verbraucht eine Rakete, wie viel Ammoniak liefert ein Reaktor? Reaktionsgleichung + Dreischritt beantworten jede Mengenfrage.",
    html: "<p>Die Koeffizienten einer ausgeglichenen Formelgleichung geben direkt das <strong>Stoffmengenverhältnis</strong> der reagierenden und entstehenden Stoffe an — niemals direkt das Massenverhältnis! Deshalb löst du jede <strong>Stoffumsatzaufgabe</strong> zuverlässig im <strong>Dreischritt über Größengleichungen</strong>:</p><ol><li><strong>Gegebene Größe → Stoffmenge n<sub>1</sub>:</strong> Aus gegebener Masse m<sub>1</sub> rechnest du <strong>n<sub>1</sub> = m<sub>1</sub> / M<sub>1</sub></strong> (oder aus Gasvolumen n<sub>1</sub> = V<sub>1</sub> / V<sub>m</sub>).</li><li><strong>Stoffmengenverhältnis aus der Reaktionsgleichung:</strong> <strong>n<sub>2</sub> / n<sub>1</sub> = ν<sub>2</sub> / ν<sub>1</sub></strong> (Koeffizient des gesuchten Stoffes geteilt durch Koeffizient des bekannten Stoffes).</li><li><strong>Gesuchte Größe berechnen:</strong> Gesuchte Masse <strong>m<sub>2</sub> = n<sub>2</sub> · M<sub>2</sub></strong> oder gesuchtes Normgasvolumen <strong>V<sub>2</sub> = n<sub>2</sub> · V<sub>m</sub></strong>.</li></ol><div class=\"example\"><strong>Beispiel:</strong> Welche Masse Ammoniak (M = 17 g/mol) entsteht aus m(N<sub>2</sub>) = 14 g Stickstoff (M = 28 g/mol) nach <strong>N<sub>2</sub> + 3 H<sub>2</sub> → 2 NH<sub>3</sub></strong>?<br>1. n(N<sub>2</sub>) = 14 g / 28 g/mol = 0,50 mol · 2. n(NH<sub>3</sub>) = 2/1 · 0,50 mol = 1,0 mol · 3. m(NH<sub>3</sub>) = 1,0 mol · 17 g/mol = <strong>17 g</strong>.</div>",
    rule: "Stoffumsatz-Dreischritt: 1. n<sub>1</sub> = m<sub>1</sub> / M<sub>1</sub> → 2. n<sub>2</sub> = (ν<sub>2</sub> / ν<sub>1</sub>) · n<sub>1</sub> → 3. m<sub>2</sub> = n<sub>2</sub> · M<sub>2</sub> bzw. V<sub>2</sub> = n<sub>2</sub> · V<sub>m</sub>",
    terms: [
      ["Stoffmengenverhältnis", "n(gesucht) / n(bekannt) = ν(gesucht) / ν(bekannt)", "ν = Koeffizienten der ausgeglichenen Gleichung"],
      ["Gesuchte Masse", "m<sub>2</sub> = n<sub>2</sub> · M<sub>2</sub>", "Molare Masse OHNE den Koeffizienten ν berechnen!"],
      ["Gesuchtes Gasvolumen", "V<sub>2</sub> = n<sub>2</sub> · V<sub>m</sub>", "im Normzustand mit V<sub>m</sub> = 22,4 l/mol"],
    ],
    quiz: [
      "Bei der Reaktion N₂ + 3 H₂ → 2 NH₃ setzen sich n(N₂) = 2,0 mol Stickstoff vollständig um. Welche Stoffmenge n(NH₃) entsteht?",
      "4,0 mol NH₃, weil das Koeffizientenverhältnis ν(NH₃) : ν(N₂) = 2 : 1 beträgt.",
      "2,0 mol NH₃, weil die Stoffmenge bei jeder Reaktion gleich bleibt.",
      "Aus jedem einzelnen N₂-Molekül entstehen zwei NH₃-Moleküle: n(NH₃) = (2 / 1) · 2,0 mol = 4,0 mol.",
    ],
    lab: makeLab("stoffumsatz"),
    exercises: [
      {
        id: "stoffumsatz-molekuele",
        make(rng, level) {
          const rx = rng.pick(STOICH_REACTIONS);
          const factor = rng.pick([0.25, 0.5, 1.0, 1.5, 2.0]);
          const n1 = round(rx.eduktNu * factor, 2);
          const m1 = round(n1 * rx.eduktM, 1);
          const n2 = round(rx.produktNu * factor, 2);
          const m2 = round(n2 * rx.produktM, 1);
          if (level === 1) {
            return {
              prompt: `Nach der Reaktionsgleichung <strong>${rx.equation}</strong> reagieren m(${rx.eduktFormula}) = ${fmt(m1, 1)} g ${rx.eduktName} vollständig. Berechne die Masse <strong>m(${rx.produktFormula})</strong> an entstehendem ${rx.produktName} in Gramm.`,
              given: [
                `m(${rx.eduktFormula}) = ${fmt(m1, 1)} g, M(${rx.eduktFormula}) = ${rx.eduktM} g/mol`,
                `M(${rx.produktFormula}) = ${rx.produktM} g/mol`,
                `Koeffizientenverhältnis ν(${rx.produktFormula}) : ν(${rx.eduktFormula}) = ${rx.produktNu} : ${rx.eduktNu}`,
              ],
              formulaHint: "1. n₁ = m₁ / M₁  →  2. n₂ = (ν₂ / ν₁) · n₁  →  3. m₂ = n₂ · M₂",
              fields: [
                withSlips(
                  numberField(`m(${rx.produktFormula}) =`, m2, "g", 1),
                  [round(m2 * rx.produktNu, 1), `Die Koeffizienten stecken bereits im Stoffmengenverhältnis — multipliziere M(${rx.produktFormula}) = ${rx.produktM} g/mol NICHT noch einmal mit ${rx.produktNu}!`],
                  [round(n1 * rx.produktM, 1), `Beachte das Koeffizientenverhältnis ν₂ / ν₁ = ${rx.produktNu} / ${rx.eduktNu}!`],
                ),
              ],
              steps: [
                `1. Stoffmenge Edukt: n(${rx.eduktFormula}) = ${fmt(m1, 1)} g / ${rx.eduktM} g/mol = ${fmt(n1, 2)} mol.`,
                `2. Stoffmengenverhältnis: n(${rx.produktFormula}) = (${rx.produktNu} / ${rx.eduktNu}) · ${fmt(n1, 2)} mol = ${fmt(n2, 2)} mol.`,
                `3. Produktmasse: m(${rx.produktFormula}) = ${fmt(n2, 2)} mol · ${rx.produktM} g/mol = <strong>${fmt(m2, 1)} g</strong>.`,
              ],
            };
          }
          // Level 2: Gesucht ist das Gasvolumen im Normzustand bei einer Gasprodukt-Reaktion!
          const gasRx = rng.pick(STOICH_REACTIONS.filter((r) => r.produktIsGas));
          const f2 = rng.pick([0.5, 1.0, 1.5, 2.0]);
          const nEd = round(gasRx.eduktNu * f2, 2);
          const mEd = round(nEd * gasRx.eduktM, 1);
          const nPr = round(gasRx.produktNu * f2, 2);
          const vPr = round(nPr * VM_NORM, 1);
          return {
            prompt: `Bei der Reaktion <strong>${gasRx.equation}</strong> werden m(${gasRx.eduktFormula}) = ${fmt(mEd, 1)} g ${gasRx.eduktName} (M = ${gasRx.eduktM} g/mol) vollständig umgesetzt. Welches Gasvolumen <strong>V(${gasRx.produktFormula})</strong> an ${gasRx.produktName} entsteht dabei im Normzustand (V<sub>m</sub> = 22,4 l/mol)? Runde auf eine Nachkommastelle.`,
            given: [],
            formulaHint: "1. n(Edukt) = m / M  →  2. n(Produkt) über Koeffizientenverhältnis  →  3. V = n(Produkt) · 22,4 l/mol",
            fields: [
              withSlips(
                numberField(`V(${gasRx.produktFormula}) =`, vPr, "l", 1),
                [round(nPr * gasRx.produktM, 1), "Gefragt ist das Gasvolumen V in Litern (mit V_m = 22,4 l/mol), nicht die Masse in Gramm!"],
                [round(nEd * VM_NORM, 1), `Vergiss Schritt 2 nicht: Koeffizientenverhältnis ν(${gasRx.produktFormula}) / ν(${gasRx.eduktFormula}) = ${gasRx.produktNu} / ${gasRx.eduktNu}.`],
              ),
            ],
            steps: [
              `1. n(${gasRx.eduktFormula}) = ${fmt(mEd, 1)} g / ${gasRx.eduktM} g/mol = ${fmt(nEd, 2)} mol.`,
              `2. n(${gasRx.produktFormula}) = (${gasRx.produktNu} / ${gasRx.eduktNu}) · ${fmt(nEd, 2)} mol = ${fmt(nPr, 2)} mol.`,
              `3. V(${gasRx.produktFormula}) = ${fmt(nPr, 2)} mol · 22,4 l/mol = <strong>${fmt(vPr, 1)} l</strong>.`,
            ],
          };
        },
      },
      cases(
        "umsatz-dreischritt",
        [
          cc(
            "In 2 H₂ + O₂ → 2 H₂O steht vor H₂O der Koeffizient 2. Wie groß ist die molare Masse M(H₂O), die du in m = n · M einsetzt?",
            "M(H₂O) = 18 g/mol — die molare Masse bezieht sich immer auf 1 mol der Formel H₂O; der Koeffizient 2 wurde bereits im Stoffmengenverhältnis berücksichtigt!",
            ["M(2 H₂O) = 36 g/mol — man muss beides doppelt nehmen.", "M(H₂O) = 2 g/mol."],
            "Doppelte Berücksichtigung des Koeffizienten (erst bei n, dann noch einmal bei M) ist der häufigste Fehler beim chemischen Rechnen!",
            "Gehört die 2 vor H₂O zur Stoffformel oder zum Stoffmengenverhältnis?",
          ),
          cc(
            "Warum darf man aus 2 H₂ + O₂ → 2 H₂O NICHT schließen, dass 2 g Wasserstoff mit 1 g Sauerstoff zu 3 g Wasser reagieren?",
            "Die Gleichung gibt Teilchen- bzw. Stoffmengenverhältnisse (2 mol : 1 mol) an, aber O₂ (32 g/mol) ist 16-mal schwerer als H₂ (2 g/mol): 4 g H₂ reagieren mit 32 g O₂ zu 36 g H₂O!",
            ["Weil bei der Reaktion Masse vernichtet wird.", "Weil 2 g H₂ mit 1 g O₂ zu 100 g Wasser reagieren."],
            "2 mol H₂ wiegen 4 g, 1 mol O₂ wiegt 32 g → zusammen 36 g (= 2 mol H₂O).",
            "Übersetze 2 mol H₂ und 1 mol O₂ mithilfe von M in Gramm!",
          ),
        ],
        [
          cc(
            "Für CH₄ + 2 O₂ → CO₂ + 2 H₂O mischst du 1,0 mol Methan mit 2,0 mol Sauerstoff (beide Gase im selben Normzustand). Wie verhält sich das benötigte Sauerstoffvolumen zum Methanvolumen?",
            "Es wird genau das doppelte Sauerstoffvolumen benötigt: V(O₂) = 2 · V(CH₄), da bei Gasen unter gleichen Bedingungen V direkt proportional zu n ist.",
            ["Es wird nur halb so viel Sauerstoffvolumen benötigt.", "Die Volumina lassen sich für Gase nicht vergleichen."],
            "Wegen V = n · V_m gilt für Gase bei gleichem Druck und gleicher Temperatur: Volumenverhältnis = Stoffmengenverhältnis = 2 : 1.",
            "Setze V = n · V_m ins Verhältnis V(O₂) / V(CH₄) ein!",
          ),
          cc(
            "Du bringst 2,0 mol Wasserstoff (H₂) mit 2,0 mol Sauerstoff (O₂) zur Reaktion (2 H₂ + O₂ → 2 H₂O). Wie viel Wasser entsteht, und was bleibt übrig?",
            "Es entstehen 2,0 mol Wasser (36 g), und 1,0 mol Sauerstoff bleibt unverbraucht im Überschuss übrig.",
            ["Es entstehen 4,0 mol Wasser, weil insgesamt 4,0 mol Gas vorhanden waren.", "Gar nichts reagiert, wenn die Zahlen nicht exakt 2 : 1 sind."],
            "2,0 mol H₂ verbrauchen laut Gleichung (2 : 1) genau 1,0 mol O₂; das restliche 1,0 mol O₂ findet keinen Reaktionspartner mehr.",
            "Welcher Ausgangsstoff ist hier zuerst aufgebraucht?",
          ),
        ],
      ),
    ],
  }),
];
