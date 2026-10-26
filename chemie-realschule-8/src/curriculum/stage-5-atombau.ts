import {
  averageMolarMass,
  ISOTOPE_PAIRS,
  kugelwolkenConfig,
  PSE_ELEMENTS,
  ROMAN_GROUP,
  supNum,
  valenceElectrons,
} from "../chemistry/model";
import { fmt, round } from "../exercises/format";
import { makeLab } from "../lab/definitions";
import type { Stage } from "../model/types";
import { cases, cc, lesson, numberField, signed, withSlips } from "./helpers";

const id = "atombau";

export const STAGE_ATOMBAU: Stage = {
  id,
  stageNumber: 5,
  title: "Atombau und Periodensystem der Elemente",
  subtitle: "Kern-Hülle-Modell, Energiestufen, PSE, Kugelwolken und Isotopie",
  icon: "⚛️",
  accent: "#be185d",
  badgeTitle: "Atomforscher",
  lehrplanLabel: "C8 LB 5 (I)",
  lessons: [
    lesson(id, 1, {
      id: "ch-rutherford-kern-huelle",
      title: "Rutherfordscher Streuversuch und Kern-Hülle-Modell",
      subtitle: "Aus Streubefunden Protonen, Neutronen und Elektronen ableiten",
      bindings: { I: 5 },
      why: "99,99 % eines Goldatoms sind nahezu leerer Raum — Rutherfords Goldfolienversuch sprengte Daltons Vollkugel-Vorstellung für immer.",
      html: "<p>Ernest Rutherford beschoss 1911 eine hauchdünne Goldfolie mit positiv geladenen <strong>α-Teilchen</strong> und beobachtete drei Befunde am Leuchtschirm: 1.&nbsp;Fast alle α-Teilchen durchdringen die Folie <strong>ungehindert geradlinig</strong> → das Atom besteht größtenteils aus fast leerem Raum (die <strong>Atomhülle</strong>). 2.&nbsp;Wenige werden seitlich abgelenkt, und etwa 1 von 10&nbsp;000 bis 100&nbsp;000 prallt sogar <strong>zurück</strong> → fast die gesamte Masse und die gesamte positive Ladung sitzen in einem winzigen, extrem dichten <strong>Atomkern</strong> (Durchmesser ca. 1/10&nbsp;000 bis 1/100&nbsp;000 des Atoms!).</p><p>Im <strong>Kern-Hülle-Modell</strong> sitzen im Atomkern zwei Arten von Kernbausteinen (<strong>Nukleonen</strong>): positiv geladene <strong>Protonen (p<sup>+</sup></strong>, Masse ≈ 1 u, Ladung 1+) und ungeladene <strong>Neutronen (n<sup>0</sup></strong>, Masse ≈ 1 u, Ladung 0). In der riesigen Atomhülle bewegen sich negativ geladene <strong>Elektronen (e<sup>−</sup></strong>, Masse ≈ 0,00055 u, Ladung 1−). In jedem elektrisch neutralen Atom gilt: <strong>Ordnungszahl Z = Protonenzahl = Elektronenzahl</strong>; die <strong>Massenzahl A = Protonenzahl Z + Neutronenzahl N</strong> gibt die Gesamtzahl der Nukleonen an (Schreibweise: <sup>A</sup><sub>Z</sub>X, z.&nbsp;B. <sup>23</sup><sub>11</sub>Na).</p><div class=\"example\"><strong>Beispiel:</strong> Ein neutrales Natriumatom <sup>23</sup><sub>11</sub>Na besitzt Z = 11 Protonen, 11 Elektronen und N = 23 − 11 = <strong>12 Neutronen</strong>.</div>",
      rule: "Rutherford: winziger, schwerer, positiver Atomkern (p<sup>+</sup> + n<sup>0</sup> = Nukleonen) + riesige Hülle (e<sup>−</sup>) · Neutrales Atom: p<sup>+</sup> = e<sup>−</sup> = Z und N = A − Z",
      terms: [
        ["Proton (p<sup>+</sup>) & Neutron (n<sup>0</sup>)", "Nukleonen im Atomkern (je ≈ 1 u)", "Proton 1+, Neutron elektrisch neutral (0)"],
        ["Elektron (e<sup>−</sup>)", "Baustein der Atomhülle (≈ 1/1836 u ≈ 0 u)", "Elementarladung 1−"],
        ["Ordnungszahl Z & Massenzahl A", "Z = Anzahl(p<sup>+</sup>) · A = Z + N", "N = A − Z = Anzahl der Neutronen"],
      ],
      quiz: [
        "Welcher Befund beim Rutherfordschen Streuversuch zwang zu dem Schluss, dass fast die gesamte Masse des Goldatoms in einem winzigen, positiv geladenen Kern konzentriert ist?",
        "Ein sehr kleiner Bruchteil der positiv geladenen α-Teilchen wurde an der Goldfolie stark abgelenkt oder nahezu zurückgeworfen.",
        "Die Goldfolie schmolz sofort zu flüssigem Gold zusammen.",
        "Nur ein extrem kleiner, schwerer und gleichnamig (positiv) geladener Kern kann schnelle, schwere α-Teilchen zurückstoßen.",
      ],
      lab: makeLab("rutherford"),
      exercises: [
        {
          id: "nukleonen-elektronen",
          make(rng, level) {
            const el = rng.pick(PSE_ELEMENTS.filter((e) => e.z >= 3));
            const neutrons = el.massNumber - el.z;
            if (level === 1) {
              return {
                prompt: `Bestimme für ein elektrisch neutrales Atom von <strong>${supNum(el.massNumber)}${el.symbol}</strong> (${el.name}, Ordnungszahl Z = ${el.z}, Massenzahl A = ${el.massNumber}) die Anzahl der <strong>Protonen</strong>, <strong>Elektronen</strong> und <strong>Neutronen</strong>.`,
                given: [`Ordnungszahl Z = ${el.z}`, `Massenzahl A = ${el.massNumber}`],
                formulaHint: "Protonen = Z · Elektronen (im neutralen Atom) = Z · Neutronen N = A − Z",
                fields: [
                  numberField("Protonen p⁺ =", el.z),
                  withSlips(
                    numberField("Elektronen e⁻ =", el.z),
                    [el.massNumber, "Im neutralen Atom gleicht die Elektronenzahl die Protonenzahl Z aus, nicht die Massenzahl A!"],
                  ),
                  withSlips(
                    numberField("Neutronen n⁰ =", neutrons),
                    [el.massNumber, "Ziehe die Protonenzahl Z von der Massenzahl A ab: N = A − Z!"],
                    [el.massNumber + el.z, "Rechne A − Z statt A + Z."],
                  ),
                ],
                steps: [
                  `Aus Z = ${el.z} folgen ${el.z} Protonen und im neutralen Atom ebenfalls ${el.z} Elektronen.`,
                  `Neutronenzahl: N = A − Z = ${el.massNumber} − ${el.z} = ${neutrons}.`,
                  `<strong>${el.z} p⁺, ${el.z} e⁻, ${neutrons} n⁰</strong>`,
                ],
              };
            }
            // Level 2: Ion gegeben! Bestimme Elektronenzahl und Massenzahl A aus p+, n0 und Ladung!
            const ionCandidates = PSE_ELEMENTS.filter((e) => e.ionCharge !== null && e.ionCharge !== 0 && e.z >= 3);
            const ionEl = rng.pick(ionCandidates);
            const q = ionEl.ionCharge as number;
            const nCount = ionEl.massNumber - ionEl.z;
            const eCount = ionEl.z - q;
            const qText = q > 0 ? `${q === 1 ? "" : q}+` : `${Math.abs(q) === 1 ? "" : Math.abs(q)}−`;
            return {
              prompt: `Ein Ion <strong>${ionEl.symbol}<sup>${qText}</sup></strong> (${ionEl.name}, Ordnungszahl Z = ${ionEl.z}) enthält im Atomkern N = ${nCount} Neutronen. Berechne die <strong>Massenzahl A</strong> (Zahl der Nukleonen) und die Anzahl der <strong>Elektronen e<sup>−</sup></strong> in der Ionenhülle!`,
              given: [],
              formulaHint: "A = Z + N · Bei positiver Ladung q+ fehlen q Elektronen (e⁻ = Z − q), bei negativer Ladung |q|− sind |q| Elektronen hinzugekommen",
              fields: [
                withSlips(
                  numberField("Massenzahl A =", ionEl.massNumber),
                  [nCount - ionEl.z, "Addiere Protonenzahl Z und Neutronenzahl N für die Nukleonenzahl A!"],
                ),
                withSlips(
                  numberField("Elektronen e⁻ =", eCount),
                  [ionEl.z, `Beachte die Ionenladung ${qText}: Es liegt kein neutrales Atom mehr vor!`],
                  [ionEl.z + q, "Elektronen sind negativ geladen: Kationen (+) haben WENIGER Elektronen als Protonen, Anionen (−) MEHR!"],
                ),
              ],
              steps: [
                `Massenzahl (Nukleonen im Kern): A = Z + N = ${ionEl.z} + ${nCount} = ${ionEl.massNumber}.`,
                `Elektronenzahl bei Ladung ${qText}: e⁻ = ${ionEl.z} − (${signed(q)}) = ${eCount}.`,
                `<strong>A = ${ionEl.massNumber}, ${eCount} Elektronen</strong>`,
              ],
            };
          },
        },
        cases(
          "rutherford-deutung",
          [
            cc(
              "Was beweist beim Rutherfordschen Streuversuch die Tatsache, dass über 99 % aller α-Teilchen die Goldfolie völlig unabgelenkt durchqueren?",
              "Die Atomhülle ist nahezu masselos und das Atom besteht zum allergrößten Teil aus leerem Raum.",
              ["Gold besteht überhaupt nicht aus Atomen.", "Die α-Teilchen lösen Löcher in die Goldatome."],
              "Wären Masse und positive Ladung wie bei einer massiven Kugel gleichmäßig verteilt, dürften weder fast alle Teilchen glatt durchgehen noch einzelne scharf zurückprallen.",
              "Wie muss ein Hindernis gebaut sein, damit fast jedes Geschoss glatt hindurchfliegt?",
            ),
            cc(
              "Warum trägt die Atomhülle trotz ihrer riesigen Ausdehnung kaum zur Gesamtmasse des Atoms bei?",
              "Ein Elektron besitzt nur etwa 1/1836 der Masse eines Protons oder Neutrons; fast 99,98 % der Atommasse stecken in den Nukleonen des Kerns.",
              ["Weil Elektronen eine negative Masse haben.", "Weil in der Hülle gar keine Teilchen vorkommen."],
              "m(p⁺) ≈ 1 u, m(n⁰) ≈ 1 u, aber m(e⁻) ≈ 0,00055 u.",
              "Vergleiche die Masse eines Elektrons mit der eines Nukleons!",
            ),
          ],
          [
            cc(
              "Wäre der Atomkern im Stadion-Vergleich so groß wie ein Stecknadelkopf auf dem Anstoßpunkt (ca. 2 mm), welchen Durchmesser hätte dann die Atomhülle ungefähr?",
              "Rund 100 m — also die Größenordnung eines ganzen Fußballstadions!",
              ["Nur 4 mm — direkt neben dem Stecknadelkopf.", "Mehrere Millionen Kilometer bis zur Sonne."],
              "Der Atomdurchmesser (~10⁻¹⁰ m) ist rund 10 000- bis 100 000-mal größer als der Kerndurchmesser (~10⁻¹⁴ bis 10⁻¹⁵ m).",
              "Rechne 2 mm · 50 000 in Meter um!",
            ),
            cc(
              "Wo liegt die Modellgrenze des reinen Kern-Hülle-Modells von Rutherford?",
              "Es erklärt noch nicht, wie die Elektronen in der Hülle energetisch angeordnet sind, warum bestimmte Elemente charakteristische Flammenfarben zeigen und wie die Bindigkeit zustande kommt.",
              ["Es kann Protonen und Elektronen noch nicht unterscheiden.", "Es hält Atome weiterhin für massive Vollkugeln."],
              "Für Flammenfärbung, Ionisierungsenergien und Valenzelektronen muss die Atomhülle im Energiestufenmodell weiter gegliedert werden.",
              "Sagt Rutherford schon etwas über verschiedene Energiestufen der Elektronen?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, 2, {
      id: "ch-energiestufen-flammen",
      title: "Energiestufenmodell, Flammenfärbung und Modellvergleich",
      subtitle: "Aus Flammenfärbung und Ionisierungsenergien die Elektronenkonfiguration ableiten",
      bindings: { I: 5 },
      why: "Karminrot bei Lithium, gelb-orange bei Natrium, violett bei Kalium: Farbiges Feuerwerkslicht verrät die unsichtbaren Energiestufen der Atomhülle!",
      html: "<p>Zwei Experimente führen vom einfachen Kern-Hülle-Modell zum <strong>Energiestufenmodell</strong> (Schalenmodell nach Bohr):</p><ul><li><strong>Flammenfärbung:</strong> Bringst du Salze bestimmter Metalle in die rauschende Brennerflamme, leuchtet die Flamme in elementtypischen Farben (Lithium <em>karminrot</em>, Natrium <em>gelb-orange</em>, Kalium <em>violett</em>, Calcium <em>ziegelrot</em>, Bor/Kupfer <em>grün</em>). Deutung: Wärme hebt Elektronen kurzzeitig auf eine <strong>höhere Energiestufe</strong>; beim Zurückfallen auf die tiefere Stufe senden sie genau die Energiedifferenz als farbiges Licht fester Wellenlänge aus!</li><li><strong>Ionisierungsenergie:</strong> Misst man die Energie, um nacheinander alle Elektronen eines Atoms abzuspalten, treten markante <strong>Energiesprünge</strong> auf — kernnahe Elektronen sind viel stärker gebunden als kernferne.</li></ul><p>Die Elektronen verteilen sich von innen nach außen auf diskrete <strong>Energiestufen</strong> (1.&nbsp;Stufe / K-Schale: maximal <strong>2 e<sup>−</sup></strong>; 2.&nbsp;Stufe / L-Schale: maximal <strong>8 e<sup>−</sup></strong>; bei den ersten 20 Elementen nimmt die äußerste Stufe nie mehr als <strong>8 Valenzelektronen</strong> auf: <strong>2 · n²-Regel</strong> für die Maximalbesetzung innen, z.&nbsp;B. Natrium Z = 11: <strong>2, 8, 1</strong>; Kalium Z = 19: <strong>2, 8, 8, 1</strong>).</p><div class=\"example\"><strong>Beispiel:</strong> Ein neutrales Chloratom (Z = 17) verteilt seine 17 Elektronen von innen nach außen als <strong>2 · 8 · 7</strong>: 3 besetzte Energiestufen und 7 Valenzelektronen (Außenelektronen).</div>",
      rule: "Flammenfärbung & Sprünge der Ionisierungsenergie → diskrete Energiestufen · Besetzung für Z = 1..20 von innen nach außen: 1. Stufe max. 2 e<sup>−</sup>, 2. Stufe max. 8 e<sup>−</sup>, Außenschale max. 8 Valenzelektronen",
      terms: [
        ["Flammenfärbungen", "Li karminrot · Na gelb-orange · K violett · Ca ziegelrot", "Rücksprung angeregter Elektronen sendet Licht aus"],
        ["Ionisierungsenergie", "Energie zum Abspalten eines Elektrons aus einem Atom/Ion", "große Sprünge beweisen den Wechsel zur nächsttieferen Energiestufe"],
        ["Valenzelektronen", "Elektronen auf der äußersten besetzten Energiestufe", "bestimmen das chemische Reaktionsverhalten"],
      ],
      quiz: [
        "Bei der schrittweisen Abspaltung der 11 Elektronen eines Natriumatoms liegt zwischen dem 1. und dem 2. Elektron ein gewaltiger Sprung der Ionisierungsenergie, ein zweiter Sprung erst nach 8 weiteren Elektronen (zwischen 9. und 10.). Was leitest du daraus ab?",
        "Das 1. Elektron sitzt allein weit außen (3. Energiestufe), 8 Elektronen auf der mittleren (2. Stufe) und 2 ganz nah am Kern (1. Stufe): Konfiguration 2 · 8 · 1.",
        "Alle 11 Elektronen haben exakt denselben Abstand und dieselbe Energie.",
        "Das am leichtesten abspaltbare Elektron ist das äußerste Valenzelektron; jeder große Sprung markiert den Übergang in eine kernnähere Energiestufe.",
      ],
      lab: makeLab("energiestufen"),
      exercises: [
        {
          id: "energiestufen-besetzung",
          make(rng, level) {
            const el = rng.pick(PSE_ELEMENTS.filter((e) => e.z >= 3));
            const nShells = el.shells.length;
            const valE = valenceElectrons(el);
            if (level === 1) {
              return {
                prompt: `Verteile die Elektronen eines neutralen <strong>${el.name}atoms (${el.symbol}, Ordnungszahl Z = ${el.z})</strong> im Energiestufenmodell. Auf wie viele <strong>besetzte Energiestufen</strong> verteilen sie sich, und wie viele <strong>Valenzelektronen (Außenelektronen)</strong> sitzen auf der äußersten Energiestufe?`,
                given: [`Ordnungszahl Z = ${el.z} → ${el.z} Elektronen`, "1. Energiestufe max. 2 e⁻, 2. Energiestufe max. 8 e⁻, äußerste Stufe max. 8 e⁻"],
                formulaHint: "Von innen nach außen auffüllen (2 → 8 → 8 → ...)",
                fields: [
                  numberField("Besetzte Energiestufen =", nShells),
                  withSlips(
                    numberField("Valenzelektronen =", valE),
                    [el.shells[0], "Gefragt sind die Elektronen auf der ÄUSSERSTEN Energiestufe, nicht auf der innersten (1.) Stufe!"],
                    [el.z, "Ziehe die Elektronen der inneren, voll besetzten Energiestufen ab!"],
                  ),
                ],
                steps: [
                  `Insgesamt sind ${el.z} Elektronen von innen nach außen zu verteilen.`,
                  `Elektronenkonfiguration: ${el.shells.join(" · ")} → ${nShells} besetzte Energiestufen.`,
                  `<strong>${nShells} Energiestufen, ${valE} Valenzelektron(en)</strong>`,
                ],
              };
            }
            // Level 2: Sprung in den Ionisierungsenergien vorhersagen!
            const elJump = rng.pick(PSE_ELEMENTS.filter((e) => e.z >= 3 && e.z <= 20 && valenceElectrons(e) <= 6));
            const vE = valenceElectrons(elJump);
            return {
              prompt: `Von einem neutralen <strong>${elJump.name}atom (${elJump.symbol}, Z = ${elJump.z})</strong> werden schrittweise Elektronen abgespalten. Nach dem wievielten abgespaltenen Elektron tritt der <strong>erste große Sprung</strong> der Ionisierungsenergie auf (weil danach eine kernnähere Energiestufe angebrochen werden muss)?`,
              given: [],
              formulaHint: "Zuerst werden alle Valenzelektronen der äußersten Energiestufe abgespalten — direkt danach folgt der große Sprung!",
              fields: [
                withSlips(
                  numberField("Sprung nach Elektron Nr.", vE),
                  [vE + 1, "Schon FÜR das nächste Elektron ist die Energie sprunghaft höher — der Sprung liegt also NACH den Valenzelektronen!"],
                  [elJump.z - vE, "Zuerst gehen die äußersten Elektronen (Valenzelektronen) verloren, nicht die innersten!"],
                ),
              ],
              steps: [
                `Elektronenkonfiguration von ${elJump.symbol} (Z = ${elJump.z}): ${elJump.shells.join(" · ")}.`,
                `Auf der äußersten Energiestufe sitzen ${vE} Valenzelektron(en); das (${vE + 1}). Elektron stammt bereits aus einer kernnäheren, stärker gebundenen Stufe.`,
                `<strong>Nach dem ${vE}. Elektron</strong>`,
              ],
            };
          },
        },
        cases(
          "flammen-modellvergleich",
          [
            cc(
              "Wie entsteht die charakteristische gelb-orange Flammenfärbung von Natriumsalzen im Energiestufenmodell?",
              "Durch Wärmezufuhr springen Elektronen auf höhere Energiestufen; beim Zurückfallen auf die niedrigere Stufe geben sie die feste Energiedifferenz als gelb-oranges Licht ab.",
              ["Die Natriumkerne verbrennen zu gelbem Schwefelpulver.", "Elektronen stürzen endgültig in den Atomkern und verschwinden."],
              "Nur weil die Abstände zwischen den Energiestufen fest vorgegeben sind, entstehen diskrete Spektralfarben statt beliebigem weißen Glühen.",
              "Anregung nach oben (Wärme) → Rücksprung nach unten (farbiges Licht)!",
            ),
            cc(
              "Eine unbekannte Salzprobe färbt die nichtleuchtende Brennerflamme intensiv violett (fahlviolett). Auf welche Metallionen deutet das hin?",
              "Kaliumionen (K⁺)",
              ["Natriumionen (Na⁺, gelb-orange)", "Lithiumionen (Li⁺, karminrot)"],
              "Kalium zeigt eine charakteristische violette Flammenfärbung, Lithium karminrot, Calcium ziegelrot, Natrium gelb-orange.",
              "Li = karminrot, Na = gelb-orange, K = violett, Ca = ziegelrot.",
            ),
          ],
          [
            cc(
              "Vergleiche Dalton-Modell, Kern-Hülle-Modell und Energiestufenmodell: Was leistet das Energiestufenmodell zusätzlich, und wo liegt wiederum seine Grenze?",
              "Es erklärt Flammenfärbung, Ionisierungsenergien und den Aufbau des PSE, zeigt aber noch nicht die räumliche Anordnung von Elektronenpaaren und Molekülwinkeln (dafür nutzt man das Kugelwolkenmodell).",
              ["Das Energiestufenmodell hat überhaupt keine Modellgrenzen und bildet Atome fotografisch exakt ab.", "Das Energiestufenmodell kennt keine Protonen mehr."],
              "Jedes Atommodell beantwortet bestimmte Fragen und vereinfacht andere: Für Molekülgeometrien und Elektronenpaare erweitert man die Energiestufen zu Kugelwolken.",
              "Zeigen konzentrische Kreise im Heft schon den räumlichen Bau eines Moleküls?",
            ),
            cc(
              "Warum ist die 1. Ionisierungsenergie von Helium (Z = 2) oder Neon (Z = 10) viel höher als die von Lithium (Z = 3) oder Natrium (Z = 11)?",
              "Bei Lithium und Natrium sitzt das einzelne Valenzelektron allein auf einer neuen, weiter vom Kern entfernten Energiestufe und lässt sich leicht abspalten; bei He und Ne ist die Stufe voll besetzt und stärker vom Kern angezogen.",
              ["Weil Helium und Neon überhaupt keine Elektronen besitzen.", "Weil Natriumatome kleiner als Heliumatome sind."],
              "Neue Schale = größerer Kernabstand + Abschirmung durch innere Elektronen → deutlich kleinere Ionisierungsenergie.",
              "Vergleiche die Elektronenkonfiguration von Ne (2 · 8) und Na (2 · 8 · 1)!",
            ),
          ],
        ),
      ],
    }),
    lesson(id, 3, {
      id: "ch-pse-edelgasregel-ionen",
      title: "Periodensystem, Edelgasregel und Ionenladung",
      subtitle: "Ordnungsprinzipien des PSE nutzen und Kationen- sowie Anionenladungen herleiten",
      bindings: { I: 5 },
      why: "Ein einziger Blick auf Zeile (Periode) und Spalte (Hauptgruppe) im Periodensystem verrät dir sofort Energiestufen, Valenzelektronen und die Ladung des Ions!",
      html: "<p>Im <strong>Periodensystem der Elemente (PSE)</strong> sind die Atomsorten nach aufsteigender <strong>Protonenzahl (Ordnungszahl Z)</strong> geordnet und in Zeilen (<strong>Perioden</strong> 1 bis 7) sowie Spalten (<strong>Hauptgruppen I bis VIII</strong> und dazwischenliegende <strong>Nebengruppen</strong>) gegliedert. Der direkte Zusammenhang zum Energiestufenmodell lautet:</p><ul><li><strong>Periodennummer = Anzahl der besetzten Energiestufen</strong> des neutralen Atoms (z.&nbsp;B. 3.&nbsp;Periode → 3 Energiestufen).</li><li><strong>Hauptgruppennummer = Anzahl der Valenzelektronen</strong> (wichtige Ausnahme: <strong>Helium He</strong> steht wegen seiner voll besetzten 1.&nbsp;Energiestufe bei den Edelgasen in Hauptgruppe VIII, besitzt aber nur <strong>2 Valenzelektronen</strong>!).</li></ul><p>Edelgase (VIII.&nbsp;Hauptgruppe: He mit 2, Ne/Ar/... mit 8 Valenzelektronen) sind besonders reaktionsträge (<strong>Edelgaskonfiguration</strong>). Nach der <strong>Edelgasregel (Oktett-/Duplettregel)</strong> streben Atome anderer Elemente bei der Ionenbildung diese stabile Edelgaskonfiguration an: <strong>Metallatome</strong> der Hauptgruppen I, II und III geben ihre 1, 2 bzw. 3 Valenzelektronen ab und bilden <strong>Kationen</strong> (Na<sup>+</sup>, Mg<sup>2+</sup>, Al<sup>3+</sup>); <strong>Nichtmetallatome</strong> der Hauptgruppen V, VI und VII nehmen 3, 2 bzw. 1 Elektron auf und bilden <strong>Anionen</strong> (N<sup>3−</sup>, O<sup>2−</sup>, Cl<sup>−</sup>).</p><div class=\"example\"><strong>Beispiel:</strong> Schwefel (<sub>16</sub>S) steht in der 3.&nbsp;Periode und VI.&nbsp;Hauptgruppe → Konfiguration 2 · 8 · 6. Durch Aufnahme von 2 Elektronen erreicht das Sulfid-Ion <strong>S<sup>2−</sup></strong> die Argon-Konfiguration 2 · 8 · 8!</div>",
      rule: "Periode = Zahl der Energiestufen · Hauptgruppe = Valenzelektronen (Ausnahme He: 2) · Edelgasregel: Metalle (I–III) geben e<sup>−</sup> ab → Kationen (+1..+3), Nichtmetalle (V–VII) nehmen e<sup>−</sup> auf → Anionen (−3..−1)",
      terms: [
        ["PSE-Koordinaten", "Ordnungszahl Z = p<sup>+</sup> · Periode = Energiestufen · Hauptgruppe = Valenzelektronen", "Nebengruppen liegen zwischen II. und III. Hauptgruppe (ab 4. Periode)"],
        ["Edelgaskonfiguration", "8 Valenzelektronen (Oktett) bzw. 2 bei Helium (Duplett)", "besonders energiearm und stabil"],
        ["Ionenladungszahl", "HG I → 1+, HG II → 2+, HG III (Al) → 3+ · HG V → 3−, HG VI → 2−, HG VII → 1−", "Protonenzahl Z im Kern bleibt unverändert!"],
      ],
      quiz: [
        "Warum steht Helium (Z = 2) im Periodensystem in der VIII. Hauptgruppe über Neon und Argon und nicht in der II. Hauptgruppe über Beryllium und Magnesium?",
        "Weil seine einzige (1.) Energiestufe mit 2 Elektronen bereits vollständig besetzt ist und Helium sich deshalb chemisch wie ein reaktionsträges Edelgas verhält.",
        "Weil ein Heliumatom in Wirklichkeit 8 Elektronen besitzt.",
        "Im PSE fasst eine Hauptgruppe Elemente mit ähnlichem chemischem Verhalten zusammen; mit voller 1. Stufe besitzt Helium Edelgaskonfiguration.",
      ],
      lab: makeLab("pse-ionen"),
      exercises: [
        {
          id: "pse-ionenladung-elektronen",
          make(rng, level) {
            const ionElements = PSE_ELEMENTS.filter(
              (e) => e.ionCharge !== null && e.ionCharge !== 0 && e.z >= 3,
            );
            const el = rng.pick(ionElements);
            const charge = el.ionCharge as number;
            const ionElectrons = el.z - charge;
            if (level === 1) {
              return {
                prompt: `Das Element <strong>${el.name} (${el.symbol}, Z = ${el.z})</strong> steht in der <strong>${el.period}. Periode</strong> und der <strong>${ROMAN_GROUP[el.hauptgruppe]}. Hauptgruppe</strong>. Welche vorzeichenbehaftete <strong>Ionenladungszahl</strong> erreicht sein Ion nach der Edelgasregel (z.&nbsp;B. 2 oder −2), und wie viele <strong>Elektronen</strong> besitzt dieses Ion insgesamt?`,
                given: [
                  `Z = ${el.z}, ${el.period}. Periode, ${ROMAN_GROUP[el.hauptgruppe]}. Hauptgruppe`,
                  `Valenzelektronen des Atoms: ${el.hauptgruppe}`,
                ],
                formulaHint: "HG I–III geben Valenzelektronen ab (Ladung +1..+3) · HG V–VII nehmen (8 − HG) Elektronen auf (Ladung −3..−1)",
                fields: [
                  withSlips(
                    numberField("Ionenladungszahl =", charge),
                    [-charge, "Achte auf das Vorzeichen: Elektronenabgabe ergibt + (Kation), Elektronenaufnahme ergibt − (Anion)!"],
                    [8 - el.hauptgruppe, charge < 0 ? "Bei Elektronenaufnahme wird das Ion NEGATIV geladen (Minuszeichen vor die Zahl setzen!)." : "Metalle geben ihre Valenzelektronen ab."],
                  ),
                  withSlips(
                    numberField("Elektronen im Ion =", ionElectrons),
                    [el.z, "Das ist die Elektronenzahl des neutralen Atoms — ziehe abgegebene ab bzw. addiere aufgenommene Elektronen (Edelgaszahl 2, 10 oder 18)!"],
                  ),
                ],
                steps: [
                  `In der ${ROMAN_GROUP[el.hauptgruppe]}. Hauptgruppe besitzt ${el.symbol} ${el.hauptgruppe} Valenzelektron(en).`,
                  charge > 0
                    ? `Es gibt ${charge} Elektron(en) ab → Kation mit Ladungszahl +${charge} und ${el.z} − ${charge} = ${ionElectrons} Elektronen.`
                    : `Es nimmt ${Math.abs(charge)} Elektron(en) bis zum Oktett auf → Anion mit Ladungszahl ${signed(charge)} und ${el.z} + ${Math.abs(charge)} = ${ionElectrons} Elektronen.`,
                  `<strong>Ladungszahl ${charge > 0 ? `+${charge}` : signed(charge)}, ${ionElectrons} Elektronen</strong>`,
                ],
              };
            }
            // Level 2: Rückschluss von Periode + Hauptgruppe auf Ordnungszahl Z und Neutronenzahl N (aus A)!
            const el2 = rng.pick(PSE_ELEMENTS.filter((e) => e.z >= 5 && e.z <= 20));
            const nNeutrons = el2.massNumber - el2.z;
            return {
              prompt: `Ein Hauptgruppenelement steht in der <strong>${el2.period}. Periode</strong> und der <strong>${ROMAN_GROUP[el2.hauptgruppe]}. Hauptgruppe</strong>; sein häufigstes Atom besitzt die Massenzahl A = ${el2.massNumber}. Ermittle ohne Nachschlagen aus dem Schalenaufbau seine <strong>Protonenzahl Z</strong> und seine <strong>Neutronenzahl N</strong>!`,
              given: [],
              formulaHint: "Innere Energiestufen sind voll besetzt (1. Stufe: 2, 2. Stufe: 8, bei 4. Periode auch 3. Stufe mit 8 vor der Außenschale), äußerste Stufe = Hauptgruppennummer; N = A − Z",
              fields: [
                withSlips(
                  numberField("Protonenzahl Z =", el2.z),
                  [el2.hauptgruppe, `Addiere zu den ${el2.hauptgruppe} Valenzelektronen auch die Elektronen der ${el2.period - 1} inneren Energiestufen!`],
                ),
                withSlips(
                  numberField("Neutronenzahl N =", nNeutrons),
                  [el2.massNumber, "Ziehe die ermittelte Protonenzahl Z von der Massenzahl A ab: N = A − Z!"],
                ),
              ],
              steps: [
                `${el2.period}. Periode und ${ROMAN_GROUP[el2.hauptgruppe]}. Hauptgruppe bedeutet Elektronenkonfiguration ${el2.shells.join(" · ")}.`,
                `Summe der Elektronen = Protonenzahl Z = ${el2.z} (${el2.name}); Neutronenzahl N = ${el2.massNumber} − ${el2.z} = ${nNeutrons}.`,
                `<strong>Z = ${el2.z}, N = ${nNeutrons}</strong>`,
              ],
            };
          },
        },
        cases(
          "pse-edelgasregel",
          [
            cc(
              "Ein Oxid-Ion (O²⁻, Z = 8), ein Fluorid-Ion (F⁻, Z = 9), ein Neonatom (Ne, Z = 10), ein Natrium-Ion (Na⁺, Z = 11) und ein Magnesium-Ion (Mg²⁺, Z = 12) werden verglichen. Was haben alle fünf Teilchen gemeinsam, und worin unterscheiden sie sich?",
              "Alle fünf besitzen exakt dieselbe Elektronenkonfiguration (2 · 8 = 10 Elektronen, Edelgaskonfiguration von Neon), unterscheiden sich aber in ihrer Protonenzahl Z im Kern!",
              ["Alle fünf haben 10 Protonen im Atomkern und sind daher Neonatome.", "Alle fünf sind elektrisch neutral."],
              "Bei der Ionenbildung ändert sich nur die Elektronenhülle; die Protonenzahl Z bleibt erhalten und bestimmt weiterhin das Element!",
              "Ändert sich bei der Ionenbildung der Atomkern oder nur die Atomhülle?",
            ),
            cc(
              "Wo stehen die Nebengruppenelemente (Übergangsmetalle wie Eisen, Kupfer, Zink, Silber) im Periodensystem?",
              "Ab der 4. Periode im Block zwischen der II. und der III. Hauptgruppe.",
              ["Ganz rechts hinter den Edelgasen.", "Ausschließlich in der 1. Periode zwischen Wasserstoff und Helium."],
              "Alle Nebengruppenelemente sind Metalle und stehen ab Periode 4 zwischen den Erdalkalimetallen (II) und der Borgruppe (III).",
              "Schau auf die 4. Periode zwischen Calcium (II) und Gallium (III)!",
            ),
          ],
          [
            cc(
              "Warum nimmt ein Magnesiumatom (Z = 12, II. Hauptgruppe) nicht 6 Elektronen zu Mg⁶⁻ auf, sondern gibt 2 Elektronen zu Mg²⁺ ab, um Edelgaskonfiguration zu erreichen?",
              "Die Abgabe von nur 2 Valenzelektronen zur Neon-Konfiguration (2 · 8) ist energetisch viel günstiger, als 6 gleichnamig negativ geladene Elektronen gegen steigende Abstoßung aufzunehmen.",
              ["Weil Metallatome auf der 3. Energiestufe maximal 2 Elektronen unterbringen könnten.", "Weil ein Mg⁶⁻-Ion sofort zu Kohlenstoff zerfallen würde."],
              "Auf der 2. und 3. Schale gilt: Bei 1–3 Valenzelektronen gibt das Atom Elektronen ab, bei 5–7 nimmt es Elektronen auf.",
              "Welcher Weg zum nächsten Edelgas (Z = 10 vs. Z = 18) ist deutlich kürzer?",
            ),
            cc(
              "Warum reagieren Alkalimetalle der I. Hauptgruppe (Li, Na, K) und Halogene der VII. Hauptgruppe (F₂, Cl₂, Br₂) besonders heftig miteinander zu Salzen?",
              "Den Alkalimetallen genügt die Abgabe eines einzigen Valenzelektrons und den Halogenen die Aufnahme genau eines Elektrons, damit beide sofort Edelgaskonfiguration erreichen.",
              ["Weil beide Gruppen schon vor der Reaktion 8 Valenzelektronen besitzen.", "Weil beide Gruppen Edelgase sind."],
              "1 Elektron zu viel trifft auf 1 Elektron zu wenig → stark exotherme Bildung von 1 : 1-Salzen wie NaCl oder KBr.",
              "Wie weit sind HG I und HG VII jeweils vom nächsten Edelgas entfernt?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, 4, {
      id: "ch-kugelwolkenmodell",
      title: "Das Kugelwolkenmodell",
      subtitle: "Elektronen der Energiestufen auf Kugelwolken verteilen und Bindigkeiten deuten",
      bindings: { I: 5 },
      why: "Kreisringe im Energiestufenmodell sind flach — erst das räumliche Kugelwolkenmodell erklärt auf einen Blick Elektronenpaare, einzelne Elektronen und die Bindigkeit!",
      html: "<p>Das <strong>Kugelwolkenmodell</strong> (nach Kimball) erweitert das Energiestufenmodell ins Dreidimensionale: Elektronen bewegen sich nicht auf flachen Kreisbahnen, sondern halten sich in kugelförmigen Aufenthaltsräumen — den <strong>Kugelwolken</strong> — auf, die sich aufgrund ihrer gleichen negativen Ladung <strong>gegenseitig möglichst weit abstoßen</strong>:</p><ul><li>Jede einzelne Kugelwolke fasst <strong>maximal 2 Elektronen</strong> (ein <strong>Elektronenpaar</strong>).</li><li>Die <strong>1.&nbsp;Energiestufe</strong> besteht aus nur <strong>1 Kugelwolke</strong> (max. 2 e<sup>−</sup>: H hat 1 einfach besetzte Kugelwolke, He 1 doppelt besetzte).</li><li>Ab der <strong>2.&nbsp;Energiestufe</strong> (2. und 3. Periode) stehen auf der äußeren Energiestufe <strong>4 gleichwertige Kugelwolken</strong> zur Verfügung, die sich im Raum wie die Ecken eines <strong>Tetraeders</strong> (Winkel 109,5°) anordnen.</li><li><strong>Besetzungsregel:</strong> Wegen der gegenseitigen Abstoßung werden die 4 äußeren Kugelwolken <strong>zuerst einzeln mit je 1 Elektron</strong> besetzt (1 bis 4 Valenzelektronen); erst ab dem 5.&nbsp;Valenzelektron bilden sich <strong>doppelt besetzte Kugelwolken (Elektronenpaare)</strong>!</li></ul><p>Damit erklärt sich sofort die <strong>Bindigkeit</strong> aus Lernbereich&nbsp;3: Die Zahl der <em>einfach besetzten Kugelwolken</em> entspricht bei C (4), N (3), O (2), F/Cl/H (1) und Ne/Ar (0) genau der typischen Bindigkeit!</p><div class=\"example\"><strong>Beispiel:</strong> Ein Sauerstoffatom (Z = 8, VI.&nbsp;Hauptgruppe, 6 Valenzelektronen) hat innen 1 doppelt besetzte Kugelwolke und außen auf seinen 4 Kugelwolken <strong>2 doppelt besetzte</strong> (Elektronenpaare) sowie <strong>2 einfach besetzte Kugelwolken</strong> → Sauerstoff ist <strong>zweibindig</strong>!</div>",
      rule: "Max. 2 e<sup>−</sup> je Kugelwolke · 1. Stufe: 1 Kugelwolke; ab 2. Stufe außen: 4 tetraedrisch angeordnete Kugelwolken · Erst alle 4 einzeln besetzen, ab dem 5. Valenzelektron paaren!",
      terms: [
        ["Aufbau der Kugelwolken", "1. Stufe: 1 Wolke (max. 2 e<sup>−</sup>) · 2./3. Stufe: 4 Wolken im Tetraeder (max. 8 e<sup>−</sup>)", "Abstoßung negativer Ladungen → maximaler Abstand"],
        ["Einfach vs. doppelt besetzt", "1–4 Valenzelektronen: 1–4 einzelne · 5–8 Valenzelektronen: (v − 4) Paare und (8 − v) einzelne", "z. B. N (5 VE): 1 Paar, 3 einzelne"],
        ["Deutung der Bindigkeit", "Anzahl einfach besetzter Kugelwolken = typische Bindigkeit", "C: 4, N: 3, O: 2, F/Cl/H: 1, Ne/Ar: 0"],
      ],
      quiz: [
        "Wie verteilen sich die 5 Valenzelektronen eines Stickstoffatoms (Z = 7, V. Hauptgruppe) auf die 4 Kugelwolken der 2. Energiestufe?",
        "1 doppelt besetzte Kugelwolke (Elektronenpaar) und 3 einfach besetzte Kugelwolken.",
        "2 doppelt besetzte Kugelwolken, 1 einfach besetzte und 1 leere Kugelwolke.",
        "Zuerst erhält jede der 4 Kugelwolken 1 Elektron; erst das 5. Elektron bildet in einer Wolke ein Elektronenpaar → 1 Paar und 3 einzelne (Stickstoff ist 3-bindig!).",
      ],
      lab: makeLab("kugelwolken"),
      exercises: [
        {
          id: "kugelwolken-paare-einzeln",
          make(rng, level) {
            const candidates = PSE_ELEMENTS.filter((e) => e.z >= 5 && e.z <= 18);
            const el = rng.pick(candidates);
            const cfg = kugelwolkenConfig(el.z);
            const v = valenceElectrons(el);
            if (level === 1) {
              return {
                prompt: `Ein neutrales <strong>${el.name}atom (${el.symbol}, Z = ${el.z})</strong> besitzt auf seiner äußersten (${el.period}.) Energiestufe <strong>${v} Valenzelektronen</strong>. Wie viele <strong>doppelt besetzte Kugelwolken (Elektronenpaare)</strong> und wie viele <strong>einfach besetzte Kugelwolken</strong> liegen in der Valenzschale vor?`,
                given: [
                  `${el.symbol}: ${el.period}. Periode, ${v} Valenzelektronen`,
                  "4 Kugelwolken der äußeren Stufe werden erst einzeln, ab dem 5. Elektron doppelt besetzt",
                ],
                formulaHint: "Erst 4 Wolken mit je 1 e⁻ füllen; jedes weitere Elektron über 4 hinaus paart eine Wolke",
                fields: [
                  withSlips(
                    numberField("Doppelt besetzte Wolken =", cfg.pairs),
                    [Math.floor(v / 2), "Paare die Elektronen NICHT sofort — zuerst wird jede der 4 Kugelwolken einzeln besetzt!"],
                  ),
                  withSlips(
                    numberField("Einfach besetzte Wolken =", cfg.singles),
                    [v % 2, "Bis 4 Valenzelektronen bleiben alle ungepaart; erst ab dem 5. Valenzelektron nimmt die Zahl der einfach besetzten Wolken wieder ab (8 − v)!"],
                  ),
                ],
                steps: [
                  `${el.symbol} hat ${v} Valenzelektronen auf 4 äußeren Kugelwolken.`,
                  v <= 4
                    ? `Da ${v} ≤ 4 gilt, werden ${v} Kugelwolken jeweils einfach besetzt (${cfg.pairs} Paare, ${cfg.singles} einzelne, ${cfg.empty} leer).`
                    : `Zuerst erhalten alle 4 Kugelwolken je 1 Elektron; die übrigen ${v} − 4 = ${cfg.pairs} Elektronen bilden Paare → ${cfg.pairs} doppelt und 4 − ${cfg.pairs} = ${cfg.singles} einfach besetzte Kugelwolken.`,
                  `<strong>${cfg.pairs} doppelt besetzt, ${cfg.singles} einfach besetzt</strong>`,
                ],
              };
            }
            // Level 2: Gesamtzahl ALLER besetzten Kugelwolken des gesamten Atoms (inkl. innerer Schalen!) + einfach besetzte Wolken
            const innerClouds = el.period === 2 ? 1 : 5; // 1. Schale = 1 Wolke; 1.+2. Schale = 1 + 4 = 5 Wolken
            const outerOccupied = cfg.pairs + cfg.singles;
            const totalOccupiedClouds = innerClouds + outerOccupied;
            return {
              prompt: `Betrachte ein vollständiges neutrales <strong>${el.name}atom (${el.symbol}, Z = ${el.z}, Konfiguration ${el.shells.join(" · ")})</strong> im Kugelwolkenmodell einschließlich aller inneren Energiestufen. Wie viele Kugelwolken sind im gesamten Atom <strong>insgesamt besetzt</strong> (einfach oder doppelt), und wie viele davon sind <strong>einfach besetzt</strong>?`,
              given: [],
              formulaHint: "1. Energiestufe = 1 doppelt besetzte Kugelwolke; volle 2. Energiestufe = 4 doppelt besetzte Kugelwolken; dazu die besetzten Wolken der Valenzschale",
              fields: [
                withSlips(
                  numberField("Besetzte Wolken gesamt =", totalOccupiedClouds),
                  [outerOccupied, `Zähle die ${innerClouds} voll besetzten inneren Kugelwolke(n) der inneren Energiestufe(n) mit!`],
                ),
                withSlips(
                  numberField("Davon einfach besetzt =", cfg.singles),
                  [Math.floor(v / 2), "Innere Wolken sind alle doppelt besetzt; außen erst einzeln auf 4 Wolken verteilen!"],
                ),
              ],
              steps: [
                `Innere Energiestufe(n) von ${el.symbol}: ${innerClouds} doppelt besetzte Kugelwolke(n).`,
                `Äußere (${el.period}.) Energiestufe (${v} VE): ${cfg.pairs} doppelt und ${cfg.singles} einfach besetzte Kugelwolke(n) → zusammen ${outerOccupied} besetzte äußere Wolken.`,
                `Gesamtsumme: ${innerClouds} + ${outerOccupied} = <strong>${totalOccupiedClouds} besetzte Kugelwolken, davon ${cfg.singles} einfach besetzt</strong>.`,
              ],
            };
          },
        },
        cases(
          "kugelwolken-bindung",
          [
            cc(
              "Warum besetzen 4 Valenzelektronen eines Kohlenstoffatoms (Z = 6) vier getrennte Kugelwolken statt zwei Kugelwolken doppelt?",
              "Weil sich gleichnamig negativ geladene Elektronen abstoßen und in vier getrennten, tetraedrisch angeordneten Kugelwolken den größtmöglichen Abstand voneinander einnehmen.",
              ["Weil in einer Kugelwolke grundsätzlich nur 1 Elektron Platz hat.", "Weil Kohlenstoffatome keine 2. Energiestufe besitzen."],
              "Auf getrennten Kugelwolken ist die gegenseitige elektrische Abstoßung deutlich geringer als zu zweit in derselben Wolke — und genau deshalb ist Kohlenstoff vierbindig!",
              "Wie verhalten sich gleiche negative Ladungen zueinander?",
            ),
            cc(
              "Wie erklärt das Kugelwolkenmodell, dass Neon (Z = 10) und Argon (Z = 18) als einatomige Edelgase vorliegen (Bindigkeit 0)?",
              "Alle vier äußeren Kugelwolken sind bereits mit je 2 Elektronen (insgesamt 8 Valenzelektronen) voll besetzt — es gibt keine einfach besetzte Kugelwolke zur Durchdringung mit anderen Atomen.",
              ["Neon und Argon besitzen gar keine Kugelwolken.", "Alle 8 Valenzelektronen sitzen in einer einzigen Kugelwolke."],
              "0 einfach besetzte Kugelwolken ⇒ Bindigkeit 0.",
              "Wie viele einfach besetzte Kugelwolken hat ein Edelgasatom?",
            ),
          ],
          [
            cc(
              "Wie deutet das Kugelwolkenmodell den gewinkelten Bau des Wassermoleküls (H₂O) statt einer geraden Linie H–O–H?",
              "Die 4 äußeren Kugelwolken des Sauerstoffatoms ordnen sich tetraedrisch im Raum an; zwei davon durchdringen sich mit den H-Kugelwolken, während die zwei freien Elektronenpaar-Wolken den Winkel gewinkelt (~104,5°) zusammendrücken.",
              ["Weil Wasserstoffatome einander magnetisch anziehen.", "Weil Sauerstoff nur zwei gegenüberliegende Kugelwolken besitzt."],
              "Da alle 4 äußeren Kugelwolken des O-Atoms nach den Ecken eines Tetraeders zeigen, liegen zwei Bindungswolken niemals auf einer 180°-Geraden!",
              "Welche räumliche Figur spannen 4 sich abstoßende Kugelwolken auf?",
            ),
            cc(
              "Ein Boratom (Z = 5, III. Hauptgruppe) hat 3 Valenzelektronen auf der 2. Energiestufe. Wie sieht seine Valenzschale im Kugelwolkenmodell aus?",
              "3 einfach besetzte Kugelwolken und 1 noch unbesetzte (leere) Kugelwolke.",
              ["1 doppelt besetzte, 1 einfach besetzte und 2 leere Kugelwolken.", "3 doppelt besetzte Kugelwolken."],
              "Bei weniger als 4 Valenzelektronen bleibt die restliche der 4 möglichen Kugelwolken unbesetzt.",
              "3 Elektronen auf 4 verfügbare Plätze einzeln verteilen!",
            ),
          ],
        ),
      ],
    }),
    lesson(id, 5, {
      id: "ch-isotopie-molare-masse",
      title: "Isotopie und nicht ganzzahlige molare Massen",
      subtitle: "Atome gleicher Protonenzahl mit verschiedener Neutronenzahl erklären krumme Molmassen",
      bindings: { I: 5 },
      why: "Warum steht im Periodensystem bei Chlor M = 35,45 g/mol — gibt es etwa halbe Neutronen? Nein: Das Geheimnis heißt Isotopie!",
      html: "<p>Im Periodensystem fällt sofort ein scheinbares Rätsel auf: Während Kohlenstoff fast glatt 12,0 g/mol und Sauerstoff 16,0 g/mol hat, steht bei <strong>Chlor M(Cl) = 35,45 g/mol</strong> und bei <strong>Kupfer M(Cu) = 63,55 g/mol</strong> — obwohl jedes einzelne Atom nur ganze Protonen (≈ 1 u) und ganze Neutronen (≈ 1 u) enthalten kann! Des Rätsels Lösung korrigiert Daltons Annahme, alle Atome eines Elements seien völlig gleich schwer:</p><p>Atome desselben Elements stimmen zwar zwingend in ihrer <strong>Protonenzahl Z</strong> überein, können sich aber in ihrer <strong>Neutronenzahl N</strong> und damit in ihrer <strong>Massenzahl A</strong> unterscheiden. Solche verschiedenen Atomsorten desselben Elements heißen <strong>Isotope</strong>! Natürliches Chlor ist ein Isotopengemisch aus rund <strong>75,8 % (≈ 3/4) <sup>35</sup><sub>17</sub>Cl</strong> (17 p<sup>+</sup>, 18 n<sup>0</sup>) und <strong>24,2 % (≈ 1/4) <sup>37</sup><sub>17</sub>Cl</strong> (17 p<sup>+</sup>, 20 n<sup>0</sup>). Weil in 1 mol natürlichem Chlor beide Isotope in genau diesem Häufigkeitsverhältnis vertreten sind, ergibt der <strong>gewichtete Mittelwert</strong>:</p><p style=\"text-align:center\"><strong>M̄ = x<sub>1</sub> · M<sub>1</sub> + x<sub>2</sub> · M<sub>2</sub> ≈ 0,76 · 35 g/mol + 0,24 · 37 g/mol ≈ 35,48 g/mol</strong></p><div class=\"example\"><strong>Beispiel:</strong> Die drei Wasserstoff-Isotope <sup>1</sup><sub>1</sub>H (Protium, 0 n<sup>0</sup>), <sup>2</sup><sub>1</sub>H (Deuterium, 1 n<sup>0</sup>) und <sup>3</sup><sub>1</sub>H (Tritium, 2 n<sup>0</sup>) besitzen alle Z = 1 Proton und 1 Elektron — deshalb reagieren sie chemisch nahezu identisch!</div>",
      rule: "Isotope = Atome desselben Elements mit gleicher Protonenzahl Z, aber verschiedener Neutronenzahl N (und Massenzahl A) · Nicht ganzzahlige molare Massen im PSE sind gewichtete Mittelwerte des natürlichen Isotopengemischs",
      terms: [
        ["Isotope", "gleiches Z (gleiches Element), verschiedenes N und A", "z. B. <sup>35</sup><sub>17</sub>Cl (18 n<sup>0</sup>) und <sup>37</sup><sub>17</sub>Cl (20 n<sup>0</sup>)"],
        ["Mittelwert der Molmasse", "M̄ = (Anteil<sub>1</sub> · A<sub>1</sub> + Anteil<sub>2</sub> · A<sub>2</sub>) g/mol", "erklärt Werte wie M(Cl) = 35,45 g/mol"],
        ["Wasserstoff-Isotope", "<sup>1</sup><sub>1</sub>H (0 n<sup>0</sup>) · <sup>2</sup><sub>1</sub>H (1 n<sup>0</sup>) · <sup>3</sup><sub>1</sub>H (2 n<sup>0</sup>)", "gleiche Elektronenhülle → gleiches chemisches Verhalten"],
      ],
      quiz: [
        "Worin stimmen die beiden Chlor-Isotope ³⁵₁₇Cl und ³⁷₁₇Cl überein, und worin unterscheiden sie sich?",
        "Beide haben 17 Protonen (und als neutrale Atome 17 Elektronen), aber ³⁵Cl besitzt 18 Neutronen und ³⁷Cl 20 Neutronen.",
        "³⁵Cl hat 17 Protonen und ³⁷Cl hat 19 Protonen.",
        "Die Protonenzahl Z = 17 legt das Element Chlor unverrückbar fest; der Massenunterschied von 2 u stammt von 2 zusätzlichen Neutronen.",
      ],
      lab: makeLab("isotopie"),
      exercises: [
        {
          id: "isotopen-mittelwert",
          make(rng, level) {
            const pair = rng.pick(ISOTOPE_PAIRS);
            const pct1 = level === 1 ? pair.naturalPct1 : rng.pick([20, 25, 30, 40, 60, 70, 75, 80]);
            const pct2 = 100 - pct1;
            const avgM = averageMolarMass(pair.a1, pair.a2, pct1);
            const simpleMean = round((pair.a1 + pair.a2) / 2, 2);
            if (level === 1) {
              return {
                prompt: `Natürliches <strong>${pair.name} (${pair.symbol}, Z = ${pair.z})</strong> besteht zu rund <strong>${pct1} %</strong> aus dem Isotop <sup>${pair.a1}</sup>${pair.symbol} und zu <strong>${pct2} %</strong> aus dem Isotop <sup>${pair.a2}</sup>${pair.symbol}. Berechne daraus näherungsweise die mittlere <strong>molare Masse M(${pair.symbol})</strong> in g/mol auf zwei Nachkommastellen!`,
                given: [
                  `${pct1} % <sup>${pair.a1}</sup>${pair.symbol} (M₁ ≈ ${pair.a1} g/mol)`,
                  `${pct2} % <sup>${pair.a2}</sup>${pair.symbol} (M₂ ≈ ${pair.a2} g/mol)`,
                ],
                formulaHint: "M = (pct₁ / 100) · A₁ + (pct₂ / 100) · A₂",
                fields: [
                  withSlips(
                    numberField("M =", avgM, "g/mol", 2),
                    [simpleMean, "Bilde nicht einfach den 50:50-Mittelwert, sondern gewichte mit den Häufigkeiten!"],
                    [averageMolarMass(pair.a1, pair.a2, pct2), "Du hast die beiden Prozentanteile der Isotope miteinander vertauscht!"],
                  ),
                ],
                steps: [
                  `Dezimalanteile: ${fmt(pct1 / 100, 2)} für <sup>${pair.a1}</sup>${pair.symbol} und ${fmt(pct2 / 100, 2)} für <sup>${pair.a2}</sup>${pair.symbol}.`,
                  `Gewichtetes Mittel: M = ${fmt(pct1 / 100, 2)} · ${pair.a1} g/mol + ${fmt(pct2 / 100, 2)} · ${pair.a2} g/mol = ${fmt(avgM, 2)} g/mol.`,
                  `<strong>M = ${fmt(avgM, 2)} g/mol</strong>`,
                ],
              };
            }
            // Level 2: Aus bekannter mittlerer Molmasse M auf den Prozentanteil des leichteren Isotops schließen!
            return {
              prompt: `In einer Gesteinsprobe besteht das Element <strong>${pair.name} (${pair.symbol})</strong> nur aus den beiden Isotopen <strong><sup>${pair.a1}</sup>${pair.symbol}</strong> und <strong><sup>${pair.a2}</sup>${pair.symbol}</strong>. Die Messung ergibt eine mittlere molare Masse von <strong>M = ${fmt(avgM, 2)} g/mol</strong>. Wie viel Prozent (%) der Atome entfallen auf das leichtere Isotop <strong><sup>${pair.a1}</sup>${pair.symbol}</strong>?`,
              given: [],
              formulaHint: "Ansatz mit Anteil x des leichteren Isotops: x · A₁ + (1 − x) · A₂ = M  ⇒  x = (A₂ − M) / (A₂ − A₁)",
              fields: [
                withSlips(
                  numberField(`Anteil <sup>${pair.a1}</sup>${pair.symbol} =`, pct1, "%", 0),
                  [pct2, `Das ist der Anteil des schwereren Isotops <sup>${pair.a2}</sup>${pair.symbol} — gefragt ist <sup>${pair.a1}</sup>${pair.symbol}!`],
                  [round(pct1 / 100, 2), "Gib das Ergebnis in Prozent (%) an, also mal 100!"],
                ),
              ],
              steps: [
                `Ansatz: x · ${pair.a1} + (1 − x) · ${pair.a2} = ${fmt(avgM, 2)} ⇒ ${pair.a2} − ${pair.a2 - pair.a1} · x = ${fmt(avgM, 2)}.`,
                `Auflösen nach x: x = (${pair.a2} − ${fmt(avgM, 2)}) / ${pair.a2 - pair.a1} = ${fmt(pct1 / 100, 2)} = ${pct1} %.`,
                `<strong>${pct1} % <sup>${pair.a1}</sup>${pair.symbol}</strong>`,
              ],
            };
          },
        },
        cases(
          "isotopie-begriff",
          [
            cc(
              "Welche Aussage des historischen Daltonschen Atommodells musste nach der Entdeckung der Isotopie präzisiert werden?",
              "Die Aussage, dass alle Atome desselben Elements exakt die gleiche Masse besitzen — tatsächlich stimmen sie in ihrer Protonenzahl Z überein, können aber verschiedene Neutronenzahlen haben.",
              ["Die Aussage, dass Atome überhaupt eine Masse besitzen.", "Die Aussage, dass es mehr als ein chemisches Element gibt."],
              "Heute definiert man ein chemisches Element als Gesamtheit aller Atome mit derselben Protonenzahl (Kernladungszahl) Z.",
              "Was macht heute ein Element aus: die Atommasse oder die Protonenzahl Z?",
            ),
            cc(
              "Zwei Atome haben die Nuklidzeichen ¹⁴₆C und ¹⁴₇N. Handelt es sich um Isotope desselben Elements?",
              "Nein — sie haben zwar zufällig dieselbe Massenzahl A = 14, aber verschiedene Protonenzahlen (Z = 6 Kohlenstoff vs. Z = 7 Stickstoff) und gehören daher zu zwei verschiedenen Elementen!",
              ["Ja — gleiche Massenzahl 14 bedeutet immer Isotope.", "Ja — Stickstoff ist ein Isotop von Kohlenstoff."],
              "Isotope müssen zwingend dieselbe Ordnungszahl Z (gleichen Platz im PSE: griech. ‚isos topos‘ = gleicher Platz) besitzen!",
              "Was bedeutet ‚iso-top‘ wörtlich im Periodensystem?",
            ),
          ],
          [
            cc(
              "Warum verhalten sich ³⁵Cl und ³⁷Cl bei chemischen Reaktionen (z. B. Bildung von NaCl) praktisch völlig gleich?",
              "Beide besitzen dieselbe Elektronenhülle mit 7 Valenzelektronen; für chemische Bindungen ist die Elektronenhülle ausschlaggebend, nicht die Zahl der Neutronen im Kern.",
              ["Weil 20 Neutronen negativ geladen sind.", "Weil ³⁷Cl bei der Reaktion sofort zwei Neutronen abgibt."],
              "Chemische Reaktionen sind Vorgänge in der Atomhülle; gleiche Elektronenkonfiguration bedeutet gleiches chemisches Verhalten.",
              "Welcher Teil des Atoms tritt bei chemischen Reaktionen mit Nachbaratomen in Wechselwirkung?",
            ),
            cc(
              "Gibt es in einer Chlorprobe auch nur ein einziges einzelnes Chloratom mit der Masse 35,45 u?",
              "Nein — jedes einzelne Chloratom wiegt entweder rund 35 u oder rund 37 u; der Wert 35,45 u bzw. 35,45 g/mol ist rein der statistische Durchschnitt über sehr viele Atome!",
              ["Ja — jedes einzelne Chloratom enthält genau 18,45 Neutronen.", "Ja — durch Erwärmen schmelzen 35 u und 37 u zu 35,45-u-Atomen zusammen."],
              "Wie bei einer Durchschnittsnote von 2,35 hat kein einzelner Test die Note 2,35, wohl aber der Durchschnitt der Klasse.",
              "Denke an den Notendurchschnitt einer Schulaufgabe!",
            ),
          ],
        ),
      ],
    }),
  ],
};
