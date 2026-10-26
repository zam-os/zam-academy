import { ALKANE_NAMES, alkaneFormula, alkaneMolarMass } from "../chemistry/model";
import { fmt, round } from "../exercises/format";
import { makeLab } from "../lab/definitions";
import type { Lesson } from "../model/types";
import { cases, cc, lesson, numberField, withSlips } from "./helpers";

const stageId = "reaktion";

export const REAKTION_LESSONS_C: Lesson[] = [
  lesson(stageId, 10, {
    id: "ch-alkane-verbrennung",
    title: "Homologe Reihe der Alkane und ihre Verbrennung",
    subtitle: "Summenformeln von Methan bis Octan, vollständige und unvollständige Verbrennung",
    bindings: { I: 4 },
    why: "Erdgas, Flüssiggas im Campingkocher, Feuerzeuggas und Benzin bestehen aus Alkanen — wie viel Luft hinzutritt, entscheidet über harmlose Wärme oder tödliches Atemgift!",
    html: "<p>Die einfachsten organischen Kohlenwasserstoffe bilden die <strong>homologe Reihe der Alkane</strong> mit der allgemeinen Summenformel <strong>C<sub>n</sub>H<sub>2n+2</sub></strong>: Jedes folgende Glied unterscheidet sich vom vorherigen um eine <strong>CH<sub>2</sub>-Gruppe</strong>. Du kennst die Namen von n = 1 bis n = 8: <strong>Methan (CH<sub>4</sub>)</strong>, <strong>Ethan (C<sub>2</sub>H<sub>6</sub>)</strong>, <strong>Propan (C<sub>3</sub>H<sub>8</sub>)</strong>, <strong>Butan (C<sub>4</sub>H<sub>10</sub>)</strong>, <strong>Pentan (C<sub>5</sub>H<sub>12</sub>)</strong>, <strong>Hexan (C<sub>6</sub>H<sub>14</sub>)</strong>, <strong>Heptan (C<sub>7</sub>H<sub>16</sub>)</strong> und <strong>Octan (C<sub>8</sub>H<sub>18</sub>)</strong>.</p><p>Je nach Sauerstoffangebot verläuft die Verbrennung eines Alkans unterschiedlich:</p><ul><li><strong>Vollständige Verbrennung</strong> (ausreichend O<sub>2</sub>, geöffnete Luftzufuhr am Brenner, blaue nicht rußende Flamme): Es entstehen ausschließlich <strong>Kohlenstoffdioxid (CO<sub>2</sub>) und Wasser (H<sub>2</sub>O)</strong> — z.&nbsp;B. CH<sub>4</sub> + 2 O<sub>2</sub> → CO<sub>2</sub> + 2 H<sub>2</sub>O.</li><li><strong>Unvollständige Verbrennung</strong> (Sauerstoffmangel, geschlossene Luftzufuhr, gelb leuchtende Flamme): Neben Wasser entstehen das farb- und geruchlose, stark giftige <strong>Kohlenstoffmonoxid (CO)</strong> (blockiert den Sauerstofftransport des Hämoglobins im Blut!) und schwarzer <strong>Ruß (Kohlenstoff C)</strong>.</li></ul><div class=\"example\"><strong>Beispiel:</strong> Propan (n = 3 → C<sub>3</sub>H<sub>8</sub>) verbrennt vollständig nach <strong>C<sub>3</sub>H<sub>8</sub> + 5 O<sub>2</sub> → 3 CO<sub>2</sub> + 4 H<sub>2</sub>O</strong>, bei starkem Sauerstoffmangel dagegen rußend nach C<sub>3</sub>H<sub>8</sub> + 2 O<sub>2</sub> → 3 C + 4 H<sub>2</sub>O.</div>",
    rule: "Alkane: C<sub>n</sub>H<sub>2n+2</sub> (Methan bis Octan) · Vollständige Verbrennung (+ genug O<sub>2</sub>) → CO<sub>2</sub> + H<sub>2</sub>O · Unvollständige Verbrennung (O<sub>2</sub>-Mangel) → CO (Atemgift!) und/oder Ruß (C) + H<sub>2</sub>O",
    terms: [
      ["Alkane n = 1..4", "CH<sub>4</sub> Methan · C<sub>2</sub>H<sub>6</sub> Ethan · C<sub>3</sub>H<sub>8</sub> Propan · C<sub>4</sub>H<sub>10</sub> Butan", "bei 20 °C gasförmig"],
      ["Alkane n = 5..8", "C<sub>5</sub>H<sub>12</sub> Pentan · C<sub>6</sub>H<sub>14</sub> Hexan · C<sub>7</sub>H<sub>16</sub> Heptan · C<sub>8</sub>H<sub>18</sub> Octan", "bei 20 °C flüssig (Benzinbestandteile)"],
      ["Allgemeine Summenformel", "C<sub>n</sub>H<sub>2n+2</sub>", "Differenz zweier Nachbarglieder: CH<sub>2</sub>"],
    ],
    quiz: [
      "Welche Summenformel besitzt Pentan (5 Kohlenstoffatome) in der homologen Reihe der Alkane?",
      "C₅H₁₂ — denn 2 · 5 + 2 = 12 Wasserstoffatome.",
      "C₅H₁₀ — weil immer doppelt so viele H- wie C-Atome vorliegen.",
      "Einsetzen von n = 5 in C_nH_{2n+2} ergibt C₅H₁₂.",
    ],
    lab: makeLab("alkanverbrennung"),
    exercises: [
      {
        id: "alkan-atome-sauerstoff",
        make(rng, level) {
          const n = rng.int(1, 8);
          const name = ALKANE_NAMES[n];
          const hCount = 2 * n + 2;
          const formula = alkaneFormula(n);
          if (level === 1) {
            const M = alkaneMolarMass(n);
            return {
              prompt: `Das Alkan <strong>${name}</strong> besitzt n = ${n} Kohlenstoffatom(e). Bestimme mithilfe der allgemeinen Summenformel C<sub>n</sub>H<sub>2n+2</sub> die <strong>Anzahl der Wasserstoffatome</strong> im Molekül sowie die <strong>molare Masse M(${formula})</strong> (mit M(C) = 12 g/mol, M(H) = 1 g/mol).`,
              given: [`n(C-Atome) = ${n}`, "Allgemeine Formel: C<sub>n</sub>H<sub>2n+2</sub>", "M(C) = 12 g/mol, M(H) = 1 g/mol"],
              formulaHint: "Anzahl(H) = 2 · n + 2  und  M = 12 · n + 1 · (2n + 2) g/mol",
              fields: [
                withSlips(
                  numberField("H-Atome =", hCount),
                  [2 * n, "Vergiss die + 2 an den beiden Kettenenden nicht: 2 · n + 2!"],
                ),
                withSlips(
                  numberField("M =", M, "g/mol", 0),
                  [12 * n + 2 * n, `Rechne mit ${hCount} H-Atomen, nicht mit ${2 * n}.`],
                ),
              ],
              steps: [
                `Für ${name} (n = ${n}) gilt: 2 · ${n} + 2 = ${hCount} H-Atome → Summenformel ${formula}.`,
                `Molare Masse: M(${formula}) = ${n} · 12 g/mol + ${hCount} · 1 g/mol = ${M} g/mol.`,
                `<strong>${hCount} H-Atome (${formula}), M = ${M} g/mol</strong>`,
              ],
            };
          }
          // Level 2: Vollständige Verbrennung eines ungeradzahligen Alkans (n = 1, 3, 5, 7): 1 Molekül verbraucht (3n+1)/2 O2!
          const nOdd = rng.pick([1, 3, 5, 7]);
          const oddName = ALKANE_NAMES[nOdd];
          const oddFormula = alkaneFormula(nOdd);
          const o2PerMol = (3 * nOdd + 1) / 2;
          return {
            prompt: `Stelle die Reaktionsgleichung für die <strong>vollständige Verbrennung</strong> von 1 mol <strong>${oddName} (${oddFormula})</strong> zu CO<sub>2</sub> und H<sub>2</sub>O auf. Wie viele Mol Sauerstoffmoleküle <strong>n(O<sub>2</sub>)</strong> werden für die vollständige Verbrennung von 1 mol ${oddFormula} benötigt?`,
            given: [],
            formulaHint: "Aus n C entstehen n CO₂ (2n O-Atome), aus (2n+2) H entstehen (n+1) H₂O ((n+1) O-Atome); teile die Summe der O-Atome durch 2 für O₂!",
            fields: [
              withSlips(
                numberField("n(O₂) =", o2PerMol, "mol", 0),
                [2 * o2PerMol, `Das sind die einzelnen O-Atome (${2 * o2PerMol}) — teile durch 2, weil Sauerstoff als O₂-Molekül vorliegt!`],
                [nOdd, `Berücksichtige neben den ${nOdd} CO₂-Molekülen auch den Sauerstoff für die ${nOdd + 1} H₂O-Moleküle!`],
              ),
            ],
            steps: [
              `1 mol ${oddFormula} bildet ${nOdd} mol CO₂ und ${nOdd + 1} mol H₂O.`,
              `Benötigte O-Atome rechts: ${nOdd} · 2 + ${nOdd + 1} · 1 = ${3 * nOdd + 1} mol O-Atome.`,
              `Da Sauerstoff als O₂ vorliegt: (${3 * nOdd + 1}) / 2 = <strong>${o2PerMol} mol O₂</strong>.`,
            ],
          };
        },
      },
      cases(
        "verbrennung-voll-unvoll",
        [
          cc(
            "Warum darf man einen Holzkohlegrill oder Gasheizstrahler niemals in geschlossenen, unbelüfteten Innenräumen betreiben?",
            "Bei sinkendem Sauerstoffgehalt entsteht durch unvollständige Verbrennung farb- und geruchloses, tödliches Kohlenstoffmonoxid (CO).",
            ["Weil Kohlenstoffdioxid nach faulen Eiern riecht.", "Weil Holzkohle im Zimmer endotherm gefriert."],
            "Kohlenstoffmonoxid ist mit den Sinnen nicht wahrnehmbar und blockiert den Sauerstofftransport im Blut.",
            "Welches heimtückische Atemgift entsteht bei Sauerstoffmangel?",
          ),
          cc(
            "Was verursacht das gelbe Leuchten und das Schwärzen einer kalten Porzellanschale in der leuchtenden Brennerflamme (geschlossene Luftzufuhr)?",
            "Glühende, feinste Rußpartikel (Kohlenstoff C) aus der unvollständigen Verbrennung des Brenngases.",
            ["Flüssiges Gold aus dem Brennerrohr.", "Reiner Wasserdampf."],
            "Ohne vorgemischte Luft reicht der Sauerstoff im Flammeninneren nicht aus; es bildet sich glühender Kohlenstoff (Ruß).",
            "Welcher schwarze Feststoff schlägt sich an der kalten Schale nieder?",
          ),
        ],
        [
          cc(
            "Du öffnest am Gasbrenner die Luftregulierung vollständig. Wie verändern sich Flammenbild und Reaktionsprodukte?",
            "Die Flamme wird blau, heiß und rauschend; das Alkan verbrennt nun vollständig zu CO₂ und H₂O ohne Rußbildung.",
            ["Die Flamme wird dunkelrot und produziert ausschließlich Ruß.", "Die Flamme erlischt zwingend, weil Sauerstoff Brände erstickt."],
            "Vorgemischter Luftsauerstoff sorgt für vollständige Oxidation aller C-Atome zu CO₂.",
            "Ausreichend O₂ im Gasbrenner → vollständig oder unvollständig?",
          ),
          cc(
            "Wie verändern sich Schmelz- und Siedetemperatur innerhalb der homologen Reihe der Alkane von Methan (CH₄) bis Octan (C₈H₁₈)?",
            "Mit wachsender Kettenlänge nehmen die zwischenmolekularen Anziehungskräfte zu, sodass Schmelz- und Siedetemperaturen ansteigen (Methan bis Butan gasförmig, ab Pentan flüssig).",
            ["Alle Alkane sieden exakt bei −162 °C.", "Octan ist ein Gas, während Methan bei Raumtemperatur fest ist."],
            "Größere Moleküle ziehen einander stärker an → mehr thermische Energie zum Verdampfen nötig.",
            "Vergleiche Feuerzeuggas (Butan) mit Benzin (Octan) bei 20 °C!",
          ),
        ],
      ),
    ],
  }),
  lesson(stageId, 11, {
    id: "ch-abgaskatalysator-partikelfilter",
    title: "Abgaskatalysator und Partikelfilter",
    subtitle: "Schadstoffe aus Verbrennungsmotoren katalytisch umwandeln und Ruß abscheiden",
    bindings: { I: 4 },
    why: "Weil im Motor Millisekunden für die Verbrennung bleiben, entstehen CO, Kohlenwasserstoffreste, Stickoxide und Ruß — erst die Abgasnachbehandlung schützt Atemwege und Umwelt.",
    html: "<p>In Verbrennungsmotoren verläuft die Verbrennung wegen extrem kurzer Reaktionszeiten und hoher Spitzentemperaturen nie ideal: Im Rohabgas treten giftiges <strong>Kohlenstoffmonoxid (CO)</strong>, unverbrannte <strong>Kohlenwasserstoffe (C<sub>x</sub>H<sub>y</sub>)</strong>, aus Luftstickstoff und Sauerstoff gebildete <strong>Stickoxide (NO<sub>x</sub>)</strong> sowie feinste, lungengängige <strong>Rußpartikel (C, Feinstaub)</strong> auf. Der Nachweis von CO und Ruß begründet unmittelbar die technische Abgasreinigung:</p><ul><li><strong>Drei-Wege-Abgaskatalysator:</strong> Ein hitzebeständiger Keramik-Wabenkörper mit riesiger innerer Oberfläche ist hauchdünn mit Edelmetallen (Platin, Rhodium, Palladium) beschichtet. Ab der Betriebstemperatur (~300 °C) laufen drei Schadstoffumwandlungen gleichzeitig ab: 1.&nbsp;<strong>2 CO + O<sub>2</sub> → 2 CO<sub>2</sub></strong>, 2.&nbsp;Rest-Kohlenwasserstoffe + O<sub>2</sub> → <strong>CO<sub>2</sub> + H<sub>2</sub>O</strong>, 3.&nbsp;<strong>2 NO + 2 CO → N<sub>2</sub> + 2 CO<sub>2</sub></strong>.</li><li><strong>Partikelfilter (Diesel- &amp; Ottopartikelfilter):</strong> Ein poröser Wandstromfilter hält feste <strong>Rußpartikel</strong> mechanisch zurück und brennt sie in regelmäßigen Regenerationsphasen bei hoher Abgastemperatur mit Sauerstoff zu gasförmigem CO<sub>2</sub> ab (C + O<sub>2</sub> → CO<sub>2</sub>).</li></ul><div class=\"example\"><strong>Beispiel:</strong> Auf winterlichen Ultrakurzstrecken (1 km zum Bäcker) erreicht der Abgaskatalysator seine Anspringtemperatur von rund 300 °C kaum — in dieser Kaltstartphase entweicht deutlich mehr CO als bei warmem Motor.</div>",
    rule: "Drei-Wege-Katalysator wandelt gasförmige Schadstoffe (CO, C<sub>x</sub>H<sub>y</sub>, NO<sub>x</sub>) in CO<sub>2</sub>, H<sub>2</sub>O und N<sub>2</sub> um · Partikelfilter hält festen Ruß (Feinstaub) zurück",
    terms: [
      ["Drei-Wege-Katalysator", "beseitigt CO, C<sub>x</sub>H<sub>y</sub> und NO<sub>x</sub> gleichzeitig", "Wabenkörper mit Pt/Rh/Pd für riesige Oberfläche"],
      ["Partikelfilter", "filtert feste Rußpartikel (C) aus dem Abgas", "Regeneration oxidiert Ruß zu CO<sub>2</sub>"],
      ["Grenze der Abgasreinigung", "Kohlenstoffdioxid (CO<sub>2</sub>) bleibt erhalten bzw. entsteht dabei", "löst nicht das Klimaproblem fossiler Kraftstoffe"],
    ],
    quiz: [
      "Warum benötigt ein modernes Fahrzeug sowohl einen Abgaskatalysator als auch (je nach Motortyp) einen Partikelfilter?",
      "Der Katalysator wandelt gasförmige Schadstoffe (CO, NO_x, C_xH_y) an der Edelmetalloberfläche um, während der Partikelfilter feste, krebserregende Rußteilchen zurückhält.",
      "Weil der Partikelfilter aus Kohlenstoffdioxid wieder flüssiges Benzin herstellt.",
      "Gasförmige Schadstoffmoleküle und feste Rußpartikel erfordern zwei ergänzende Reinigungsprinzipien.",
    ],
    lab: makeLab("abgasreinigung"),
    exercises: [
      cases(
        "katalysator-partikelfilter",
        [
          cc(
            "Welche drei ungefährlicheren Stoffe verlassen den gereinigten Drei-Wege-Abgaskatalysator anstelle von CO, C_xH_y und NO_x?",
            "Kohlenstoffdioxid (CO₂), Wasserdampf (H₂O) und elementarer Stickstoff (N₂).",
            ["Kohlenstoffmonoxid (CO), Ruß (C) und Ozon (O₃).", "Methan (CH₄), Wasserstoff (H₂) und Chlor (Cl₂)."],
            "CO und Kohlenwasserstoffe werden zu CO₂ und H₂O oxidiert; Stickoxide reagieren zu Luftstickstoff N₂.",
            "In welche Hauptbestandteile der Luft bzw. Verbrennungsprodukte werden C, H und N überführt?",
          ),
          cc(
            "Warum ist Ruß aus unvollständiger Verbrennung gesundheitlich besonders bedenklich, sodass Partikelfilter gesetzlich vorgeschrieben sind?",
            "Feinste Rußpartikel (Feinstaub) dringen tief in die Lungenbläschen ein, schädigen Atemwege und Herz-Kreislauf-System und wirken krebserregend.",
            ["Ruß ist ein Edelgas, das den Luftsauerstoff aus großen Räumen verdrängt.", "Ruß löst sich im Regen sofort zu Kochsalz auf."],
            "Lungengängige Feinstaubpartikel und daran haftende Kohlenwasserstoffe belasten Atemwege dauerhaft.",
            "Was bewirkt Feinstaub beim Einatmen in der Lunge?",
          ),
          cc(
            "Was geschieht bei der sogenannten Regeneration eines vollen Rußpartikelfilters während einer längeren Fahrt?",
            "Der abgeschiedene Kohlenstoff (Ruß) wird bei erhöhter Abgastemperatur zu gasförmigem Kohlenstoffdioxid abgebrannt (C + O₂ → CO₂).",
            ["Der Ruß verwandelt sich zurück in Dieselkraftstoff.", "Der Filter wirft den gesammelten Ruß als schwarzen Block auf die Straße."],
            "Durch gezielte Temperaturerhöhung oxidiert der angesammelte Ruß im Filter zu CO₂, sodass die Poren wieder frei werden.",
            "Wie lässt sich fester Kohlenstoff chemisch aus den Filterporen entfernen?",
          ),
        ],
        [
          cc(
            "Ein Autofahrer meint: ‚Mein Wagen hat einen Drei-Wege-Kat und einen Partikelfilter — er stößt also keinerlei klimawirksame Gase mehr aus!‘ Warum ist das ein Irrtum?",
            "Der Katalysator beseitigt zwar Giftstoffe wie CO und NO_x, wandelt den Kohlenstoff des Kraftstoffs aber gerade in das Treibhausgas Kohlenstoffdioxid (CO₂) um!",
            ["Ein Drei-Wege-Katalysator fängt das gesamte CO₂ als Feststoff im Kofferraum auf.", "Autos mit Katalysator verbrauchen gar keinen Sauerstoff mehr."],
            "Massenerhaltung: Jedes C-Atom des verbrannten Benzins/Diesels verlässt den Auspuff letztlich als CO₂.",
            "Verschwinden die C-Atome des fossilen Kraftstoffs im Katalysator?",
          ),
          cc(
            "Warum steigt unmittelbar nach dem Kaltstart eines Verbrennungsmotors auf den ersten hundert Metern besonders viel Kohlenstoffmonoxid aus dem Auspuff?",
            "Weil der Edelmetall-Katalysator erst seine Betriebstemperatur von rund 300 °C erreichen muss, damit die Oberflächenreaktion schnell genug abläuft.",
            ["Weil kalte Luft überhaupt keinen Sauerstoff enthält.", "Weil Benzin im kalten Tank aus Kohlenstoffmonoxid besteht."],
            "Auch katalysierte Reaktionen besitzen noch eine (kleinere) Aktivierungsenergie, für die eine Mindesttemperatur nötig ist.",
            "Arbeitet der Abgaskatalysator bei −5 °C schon mit vollem Umsatz?",
          ),
        ],
      ),
      cases(
        "abgas-reaktionsgleichungen",
        [
          cc(
            "Welche ausgeglichene Formelgleichung beschreibt den Abbau von giftigem Stickstoffmonoxid (NO) mit Kohlenstoffmonoxid (CO) im Drei-Wege-Katalysator?",
            "2 NO + 2 CO → N₂ + 2 CO₂",
            ["NO + CO → N₂O₂ + C", "2 NO + O₂ → 2 NO₂"],
            "Links: 2 N, 2 C, 4 O; rechts: 2 N (in N₂), 2 C und 4 O (in 2 CO₂) — zwei Schadstoffe entgiften sich gegenseitig!",
            "Prüfe N-, C- und O-Bilanz sowie die harmlosen Produkte N₂ und CO₂!",
          ),
          cc(
            "Warum regelt die Lambdasonde vor dem Drei-Wege-Katalysator das Kraftstoff-Luft-Verhältnis ganz genau?",
            "Bei zu viel Sauerstoff ließen sich Stickoxide (NO_x) nicht zu N₂ abbauen; bei zu wenig Sauerstoff blieben CO und Kohlenwasserstoffe übrig.",
            ["Sie misst die Profiltiefe der Reifen.", "Sie kühlt das Abgas mit flüssigem Stickstoff."],
            "Nur im schmalen ‚Lambda-Fenster‘ laufen Oxidation von CO/C_xH_y und Reduktion/Abbau von NO_x gleichzeitig vollständig ab.",
            "Drei Reaktionen gleichzeitig erfordern genau dosierten Restsauerstoff!",
          ),
        ],
        [
          cc(
            "Im Abgastest eines defekten Heizkessels wird Kohlenstoffmonoxid nachgewiesen. Welche Ursache liegt vor und welche Maßnahme ist nötig?",
            "Unvollständige Verbrennung durch Sauerstoffmangel oder verschmutzten Brenner — Anlage abschalten, lüften und Luftzufuhr vom Fachbetrieb einstellen lassen.",
            ["Vollständige Verbrennung — Luftzufuhr noch weiter schließen.", "Zu viel Stickstoff im Erdgas — Wasser in den Brenner gießen."],
            "CO im Abgas einer Heizung ist ein akutes Warnsignal für unvollständige Verbrennung und Lebensgefahr.",
            "CO = unvollständige Verbrennung → Sauerstoffmangel beheben!",
          ),
          cc(
            "Warum besteht der Trägerkörper eines Abgaskatalysators aus tausenden feinen Keramikkanälen statt aus einem glatten Rohr?",
            "Die Wabenstruktur vergrößert die Kontaktfläche zwischen strömendem Abgas und Edelmetallbeschichtung auf die Fläche eines Fußballfelds.",
            ["Damit der Abgasstrom komplett gestoppt wird.", "Weil Keramik selbst zu Kohlenstoffdioxid verbrennt."],
            "Nur Moleküle, die tatsächlich auf die Katalysatoroberfläche treffen und adsorbieren, können umgesetzt werden.",
            "Oberflächenkatalyse braucht maximale Kontaktfläche bei geringem Strömungswiderstand.",
          ),
        ],
      ),
    ],
  }),
  lesson(stageId, 12, {
    id: "ch-verbrennung-explosion-brandschutz",
    title: "Verbrennungsbedingungen, Explosion und Brandschutz",
    subtitle: "Sauerstoffgehalt, Zerteilungsgrad, Explosionsbereich, Zellatmung und Löschregeln",
    bindings: { I: 4 },
    why: "Wer das Verbrennungsdreieck, die Rolle von Oberfläche und Sauerstoffgehalt sowie Explosionsgrenzen kennt, kann Brände und Staubexplosionen wirksam verhindern.",
    html: "<p>Eine Verbrennung läuft nur ab, wenn alle drei Bedingungen des <strong>Verbrennungsdreiecks</strong> gleichzeitig erfüllt sind: 1.&nbsp;<strong>brennbarer Stoff</strong>, 2.&nbsp;<strong>Sauerstoff</strong> (brandfördernd), 3.&nbsp;Erreichen der stoffspezifischen <strong>Zündtemperatur</strong>. Fehlt auch nur eine Bedingung, erlischt das Feuer — darauf beruht jede <strong>Brandbekämpfung</strong> (Kühlen mit Wasser unter die Zündtemperatur, Ersticken mit Löschdecke/CO<sub>2</sub>-Löscher, Entfernen von Brandgut; <em>niemals Wasser in brennendes Fett oder Öl gießen</em> → schlagartige Verdampfung reißt brennende Fetttröpfchen zur Fettexplosion auseinander!).</p><p>Wie heftig eine Verbrennung abläuft, bestimmen vor allem zwei Faktoren: der <strong>Sauerstoffgehalt</strong> (Eisenwolle glimmt an Luft mit 21 % O<sub>2</sub> nur, verbrennt in reinem Sauerstoff mit 100 % O<sub>2</sub> aber sprühend hell, weil viel mehr O<sub>2</sub>-Moleküle pro Sekunde auftreffen) und der <strong>Zerteilungsgrad (Oberfläche)</strong>: Ein massiver Eisennagel glüht nur, feine Eisenwolle brennt; kompaktes Mehl verkohlt kaum, aufgewirbelter Mehlstaub in Luft führt zur <strong>Staubexplosion</strong>! Gas-Luft-Gemische explodieren nur innerhalb ihres <strong>Explosionsbereichs</strong> zwischen unterer (zu mager) und oberer Explosionsgrenze (zu fett). Im Kontrast zur offenen Flamme ist die <strong>Zellatmung</strong> eine langsame, durch Enzyme gesteuerte ‚stille Verbrennung‘ von Traubenzucker mit Sauerstoff bei 37 °C zur Energieversorgung unseres Körpers.</p><div class=\"example\"><strong>Beispiel:</strong> In Getreidemühlen und Schreinereien verhindern Staubabsaugung, Rauchverbot und funkenfreie Schalter gefährliche Staubexplosionen.</div>",
    rule: "Verbrennungsdreieck: Brennstoff + O<sub>2</sub> + Zündtemperatur · Höherer O<sub>2</sub>-Gehalt & größere Oberfläche beschleunigen drastisch · Explosion nur im Explosionsbereich; Fettbrand ersticken, nie mit Wasser löschen!",
    terms: [
      ["Verbrennungsdreieck", "brennbarer Stoff · Sauerstoff · Zündtemperatur", "Löschen = mindestens 1 Ecke entziehen"],
      ["Besondere Erscheinungen", "Verbrennung in reinem O<sub>2</sub> · Staub-/Gasexplosion · Zellatmung", "abhängig von O<sub>2</sub>-Konzentration, Oberfläche & Katalyse"],
      ["Explosionsbereich", "zwischen unterer (UEG) und oberer Explosionsgrenze (OEG)", "außerhalb zu wenig Brennstoff bzw. zu wenig O<sub>2</sub>"],
    ],
    quiz: [
      "Warum verbrennt aufgewirbeltes Bärlappsporen- oder Mehlpulver an einer Kerzenflamme schlagartig in einem Feuerball, während ein Häufchen Mehl auf dem Blech kaum brennt?",
      "Durch das Aufwirbeln entsteht eine riesige Gesamtoberfläche, bei der jedes feine Staubkorn gleichzeitig ringsum von Luftsauerstoff umgeben ist.",
      "Mehl verwandelt sich beim Aufwirbeln chemisch in flüssiges Benzin.",
      "Großer Zerteilungsgrad = riesige Kontaktfläche zwischen Brennstoff und Luftsauerstoff → extrem hohe Reaktionsgeschwindigkeit (Staubexplosion).",
    ],
    lab: makeLab("verbrennungsfaktoren"),
    exercises: [
      cases(
        "faktoren-brandschutz",
        [
          cc(
            "In einer Pfanne auf dem Herd hat sich überhitztes Speiseöl entzündet. Welche Löschmaßnahme ist richtig — und warum?",
            "Herdplatte ausschalten und die Pfanne mit einem passenden Deckel oder einer Löschdecke abdecken (Ersticken durch Sauerstoffentzug) — niemals Wasser hineinschütten!",
            ["Einen Eimer kaltes Wasser in die Pfanne schütten.", "Die brennende Pfanne schnell durch das Treppenhaus nach draußen tragen."],
            "1 Liter Wasser verdampft im > 300 °C heißen Öl schlagartig zu ~1700 Litern Wasserdampf und schleudert brennende Öltröpfchen als Feuerwalze in den Raum (Fettexplosion).",
            "Was passiert mit flüssigem Wasser unter 300 °C heißem, leichtem Öl?",
          ),
          cc(
            "Warum verbrennt ein glimmender Holzspan oder glühende Stahlwolle in einem Standzylinder mit reinem Sauerstoff viel heftiger als an der Raumluft?",
            "In reinem Sauerstoff (100 % O₂ statt 21 % O₂ in Luft) treffen pro Zeiteinheit rund fünfmal so viele Sauerstoffmoleküle ohne bremsende Stickstoffmoleküle auf die Oberfläche.",
            ["Weil reiner Sauerstoff eine Temperatur von +500 °C besitzt.", "Weil Stickstoff in der Luft selbst mitverbrennt."],
            "Höhere Teilchendichte des Reaktionspartners O₂ erhöht die Stoßhäufigkeit und damit die Reaktionsgeschwindigkeit drastisch.",
            "Vergleiche 21 % O₂ (Luft) mit 100 % O₂ auf Teilchenebene!",
          ),
          cc(
            "Auf welchem Prinzip des Verbrennungsdreiecks beruht das Löschen eines Lagerfeuers mit viel Wasser hauptsächlich?",
            "Abkühlen des Brennstoffs unter seine Zündtemperatur (und zusätzliches Abschirmen durch Wasserdampf).",
            ["Entfernen des Kohlenstoffs aus dem Holz.", "Erhöhen der Zündtemperatur von Holz auf 5000 °C."],
            "Verdampfendes Wasser nimmt sehr viel Wärme auf und senkt die Temperatur unter die Zündtemperatur.",
            "Welche Ecke des Verbrennungsdreiecks nimmt kaltes Wasser weg?",
          ),
        ],
        [
          cc(
            "Erdgas (Methan) hat in Luft einen Explosionsbereich von ca. 4,4 Vol.-% bis 16,5 Vol.-%. Was passiert, wenn in einem Rohr 95 % Methan und nur 5 % Luft (also ~1 % O₂) vorliegen und ein Funke überspringt?",
            "Es findet im Rohr keine Explosion statt, weil das Gemisch oberhalb der oberen Explosionsgrenze liegt (Sauerstoffmangel).",
            ["Die Explosion ist doppelt so stark wie bei 10 % Methan.", "Das Methan zerfällt ohne Sauerstoff zu Wasser."],
            "Oberhalb der oberen Explosionsgrenze ist das Gemisch ‚zu fett‘ — es fehlt der Reaktionspartner Sauerstoff! Gefährlich wird es erst, wenn beim Lüften Luft hinzutritt und der Explosionsbereich durchschritten wird.",
            "Liegen 95 % Methan innerhalb oder oberhalb von 4,4–16,5 %?",
          ),
          cc(
            "Welche vorbeugenden Explosionsschutz-Maßnahmen leitest du für ein Getreidesilo oder ein Sägewerk ab?",
            "Regelmäßige Staubabsaugung/Vermeidung von Staubaufwirbelung, striktes Verbot offener Flammen/Rauchen sowie explosionsgeschützte, funkenfreie Elektrogeräte.",
            ["Fenster dauerhaft schließen und mit reinem Sauerstoff fluten.", "Mehlstaub mit einem Laubbläser im Raum verteilen."],
            "Man verhindert gleichzeitig das Entstehen eines zündfähigen Staub-Luft-Gemischs UND jede Zündquelle.",
            "Wie vermeidest du explosionsfähiges Staub-Luft-Gemisch + Zündfunken?",
          ),
        ],
      ),
      cases(
        "atmung-und-verbrennung",
        [
          cc(
            "Welche Gemeinsamkeiten verbinden die Zellatmung im menschlichen Körper mit der Verbrennung von Traubenzucker im Labor?",
            "Beide setzen organische Stoffe mit Sauerstoff (O₂) exotherm zu Kohlenstoffdioxid (CO₂) und Wasser (H₂O) um.",
            ["Beide laufen mit offener Flamme bei 600 °C ab.", "Bei der Zellatmung wird Sauerstoff erzeugt statt verbraucht."],
            "Ausatemluft enthält weniger O₂ (~16 %) und rund hundertmal mehr CO₂ (~4 %) als Einatemluft — Nachweis mit Kalkwasser!",
            "Vergleiche Edukte, Produkte und Energiebilanz von Zellatmung und Verbrennung!",
          ),
          cc(
            "Worin unterscheidet sich die Zellatmung entscheidend von einer offenen Verbrennung?",
            "Enzyme steuern den Abbau in vielen kleinen Teilschritten bei 37 °C ohne Flamme, sodass die Energie gezielt für Lebensvorgänge und Körperwärme nutzbar wird.",
            ["Bei der Zellatmung gilt die Massenerhaltung nicht.", "Die Zellatmung ist stark endotherm und kühlt den Körper auf 0 °C ab."],
            "Biokatalysatoren (Enzyme) senken die Aktivierungsenergie jedes Einzelschritts auf Körpertemperatur.",
            "Warum entsteht in unseren Zellen keine Flamme?",
          ),
        ],
        [
          cc(
            "Warum nutzt man in Serverräumen und Chemielaboren bei Bränden elektrischer Anlagen bevorzugt einen Kohlenstoffdioxid-Löscher statt Wasser?",
            "CO₂ leitet keinen Strom, hinterlässt keine Löschwasserschäden und erstickt die Flamme, indem es als schweres Gas den Luftsauerstoff verdrängt.",
            ["CO₂ verbrennt selbst mit dem Feuer zu unschädlichem Stickstoff.", "CO₂ ist leichter als Wasserstoff und zieht die Flamme nach oben ab."],
            "Mit M = 44 g/mol ist CO₂ schwerer als Luft, legt sich über den Brandherd (Sauerstoffentzug) und ist elektrisch isolierend.",
            "Leitfähigkeit + Dichte von CO₂ + Rückstandsfreiheit!",
          ),
          cc(
            "Magnesiumband brennt selbst in einem Standzylinder mit Kohlenstoffdioxid weiter und hinterlässt weißes Magnesiumoxid sowie schwarze Flocken an der Glaswand. Welche Löschregel folgt daraus für Metallbrände?",
            "Brennende unedle Metalle wie Magnesium dürfen weder mit Wasser noch mit CO₂ gelöscht werden (sie entreißen beiden den Sauerstoff), sondern nur mit speziellem Metallbrandpulver oder trockenem Sand.",
            ["Metallbrände löscht man am besten mit reinem Sauerstoff.", "Schwarze Flocken sind gefrorenes Wasser."],
            "2 Mg + CO₂ → 2 MgO + C (schwarzer Ruß!): Magnesium reagiert so heftig, dass selbst CO₂ als Sauerstofflieferant wirkt.",
            "Woraus bestehen die schwarzen Flocken bei 2 Mg + CO₂ → 2 MgO + C?",
          ),
        ],
      ),
    ],
  }),
  lesson(stageId, 13, {
    id: "ch-co2-bilanz-kohlenstoffkreislauf",
    title: "CO₂-Bilanz von Brennstoffen und Kohlenstoffkreislauf",
    subtitle: "Energieträger vergleichen und den CO₂-Anstieg in der Atmosphäre begründen",
    bindings: { I: 4 },
    why: "Kohle, Erdgas, Holz oder grüner Wasserstoff: Ein Blick auf die Reaktionsgleichung und den Kohlenstoffkreislauf zeigt sofort, warum fossile Brennstoffe das Klima aufheizen.",
    html: "<p>Im natürlichen <strong>Kohlenstoff-Kreislauf</strong> stehen Bindung und Freisetzung von Kohlenstoffdioxid im Gleichgewicht: Grüne Pflanzen und Algen nehmen bei der <strong>Fotosynthese</strong> mithilfe von Lichtenergie CO<sub>2</sub> aus der Atmosphäre auf und bauen Biomasse auf; <strong>Zellatmung</strong> von Tieren, Pflanzen und Destruenten (Verwesung) sowie natürliche Waldbrände geben dieselbe Menge CO<sub>2</sub> wieder an die Atmosphäre zurück — auch die <strong>Ozeane</strong> tauschen ständig große Mengen gelöstes CO<sub>2</sub> mit der Luft aus.</p><p>Durch das Verbrennen <strong>fossiler Energieträger</strong> (Kohle, Erdöl, Erdgas), die vor Jahrmillionen dem Kreislauf entzogen und in der Erdkruste gespeichert wurden, gelangt <em>zusätzliches</em> CO<sub>2</sub> in die Atmosphäre: Das Gleichgewicht wird gestört, die atmosphärische CO<sub>2</sub>-Konzentration steigt messbar an und verstärkt den anthropogenen Treibhauseffekt. Beim Vergleich der <strong>CO<sub>2</sub>-Bilanz verschiedener Brennstoffe</strong> hilft die Stöchiometrie: Kohle (fast reines C) liefert pro freigesetzter Wärmemenge deutlich mehr CO<sub>2</sub> als <strong>Methan/Erdgas (CH<sub>4</sub>)</strong>, weil in CH<sub>4</sub> vier Wasserstoffatome zu klimaneutralem H<sub>2</sub>O mitverbrennen. <strong>Nachwachsende Biomasse</strong> (Holz, Biogas) gibt nur so viel CO<sub>2</sub> frei, wie die Pflanze zuvor gebunden hat (sofern nicht mehr gerodet als nachgepflanzt wird); <strong>grüner Wasserstoff</strong> (2 H<sub>2</sub> + O<sub>2</sub> → 2 H<sub>2</sub>O, aus Wind-/Solarstrom elektrolysiert) setzt bei der Verbrennung gar kein CO<sub>2</sub> frei.</p><div class=\"example\"><strong>Beispiel:</strong> 12 g Kohlenstoff (1 mol C) bilden bei der Verbrennung genau 1 mol CO<sub>2</sub> = <strong>44 g CO<sub>2</sub></strong> — das Gas wiegt also das 3,67-Fache des verbrannten Kohlenstoffs, weil je C-Atom zwei schwere O-Atome aus der Luft hinzukommen!</div>",
    rule: "Natürlicher C-Kreislauf: Fotosynthese ↔ Atmung/Verwesung im Gleichgewicht · Fossile Brennstoffe setzen Jahrmillionen-Kohlenstoff zusätzlich als CO<sub>2</sub> frei · Grüner H<sub>2</sub> verbrennt nur zu H<sub>2</sub>O",
    terms: [
      ["Kohlenstoff-Senken", "Fotosynthese der Pflanzen · Lösung in Ozeanen", "nehmen CO<sub>2</sub> aus der Atmosphäre auf"],
      ["Kohlenstoff-Quellen", "Zellatmung, Verwesung · Verbrennung fossiler Energieträger", "geben CO<sub>2</sub> in die Atmosphäre ab"],
      ["Brennstoffvergleich", "Kohle (viel CO<sub>2</sub>/MJ) > Heizöl/Benzin > Erdgas (CH<sub>4</sub>) > grüner H<sub>2</sub> (0 g CO<sub>2</sub> am Ort)", "Herstellung & Nachhaltigkeit immer mitbewerten!"],
    ],
    quiz: [
      "Warum wiegt das bei der vollständigen Verbrennung von 1,0 kg reinem Kohlenstoff entstehende Kohlenstoffdioxid rund 3,67 kg — also mehr als dreimal so viel wie die verbrannte Kohle?",
      "Weil sich jedes Kohlenstoffatom (12 u) mit zwei Sauerstoffatomen aus der Luft (2 · 16 u = 32 u) zu CO₂ (44 u) verbindet: 44 / 12 ≈ 3,67.",
      "Weil bei der Verbrennung die Masse der Kohlenstoffatome von 12 u auf 44 u anwächst.",
      "Aus C + O₂ → CO₂ folgt mit M(C) = 12 g/mol und M(CO₂) = 44 g/mol direkt m(CO₂) = (44 / 12) · m(C) ≈ 3,67 · m(C).",
    ],
    lab: makeLab("kohlenstoffkreislauf"),
    exercises: [
      {
        id: "co2-masse-brennstoff",
        make(rng, level) {
          if (level === 1) {
            const mCarbonKg = rng.pick([3, 6, 9, 12, 18, 24]);
            const mCO2Kg = round((mCarbonKg / 12) * 44, 1);
            return {
              prompt: `Beim Heizen wird eine Kohleportion mit m(C) = ${mCarbonKg} kg reinem Kohlenstoff vollständig nach <strong>C + O<sub>2</sub> → CO<sub>2</sub></strong> verbrannt (M(C) = 12 g/mol, M(CO<sub>2</sub>) = 44 g/mol). Welche Masse <strong>m(CO<sub>2</sub>)</strong> in Kilogramm gelangt dadurch in die Atmosphäre?`,
              given: [`m(C) = ${mCarbonKg} kg`, "M(C) = 12 g/mol, M(CO₂) = 44 g/mol", "Reaktionsgleichung: C + O₂ → CO₂ (1 : 1)"],
              formulaHint: "m(CO₂) = m(C) · M(CO₂) / M(C) = m(C) · 44 / 12",
              fields: [
                withSlips(
                  numberField("m(CO₂) =", mCO2Kg, "kg", 1),
                  [mCarbonKg, "Rechne die Masse der zwei aufgenommenen Sauerstoffatome je C-Atom mit ein: Faktor 44 / 12!"],
                  [round((mCarbonKg * 12) / 44, 2), "Multipliziere mit 44 / 12 statt mit 12 / 44 — CO₂ ist schwerer als C!"],
                ),
              ],
              steps: [
                `Stoffmengenverhältnis laut C + O₂ → CO₂ ist 1 : 1.`,
                `Massenfaktor M(CO₂) / M(C) = 44 / 12 → m(CO₂) = ${mCarbonKg} kg · 44 / 12 = ${fmt(mCO2Kg, 1)} kg.`,
                `<strong>m(CO₂) = ${fmt(mCO2Kg, 1)} kg</strong>`,
              ],
            };
          }
          // Level 2: Vollständige Verbrennung eines Alkans m(CH4) oder m(C3H8) -> m(CO2)!
          const fuel = rng.pick([
            { name: "Methan (Erdgas)", formula: "CH₄", M: 16, nuCO2: 1 },
            { name: "Propan (Flüssiggas)", formula: "C₃H₈", M: 44, nuCO2: 3 },
          ]);
          const mols = rng.pick([5, 10, 20, 25, 50]);
          const mFuel = mols * fuel.M;
          const mCO2 = mols * fuel.nuCO2 * 44;
          return {
            prompt: `Bei der vollständigen Verbrennung von m(${fuel.formula}) = ${mFuel} g <strong>${fuel.name} (${fuel.formula}, M = ${fuel.M} g/mol)</strong> entsteht Kohlenstoffdioxid (M(CO<sub>2</sub>) = 44 g/mol). Berechne die entstehende Masse <strong>m(CO<sub>2</sub>)</strong> in Gramm.`,
            given: [],
            formulaHint: `Aus 1 mol ${fuel.formula} entstehen ${fuel.nuCO2} mol CO₂ → 1. n(${fuel.formula}) = m / M, 2. n(CO₂) = ${fuel.nuCO2} · n(${fuel.formula}), 3. m(CO₂) = n(CO₂) · 44 g/mol`,
            fields: [
              withSlips(
                numberField("m(CO₂) =", mCO2, "g", 0),
                [mols * 44, fuel.nuCO2 > 1 ? `1 Molekül ${fuel.formula} enthält ${fuel.nuCO2} C-Atome → es entstehen ${fuel.nuCO2} mol CO₂ je Mol Brennstoff!` : "Prüfe Schritt 1: n = m / M."],
                [mols * fuel.nuCO2, "Multipliziere die Stoffmenge n(CO₂) noch mit M(CO₂) = 44 g/mol!"],
              ),
            ],
            steps: [
              `1. Stoffmenge Brennstoff: n(${fuel.formula}) = ${mFuel} g / ${fuel.M} g/mol = ${mols} mol.`,
              `2. Da 1 Molekül ${fuel.formula} genau ${fuel.nuCO2} C-Atom(e) besitzt, entstehen n(CO₂) = ${fuel.nuCO2} · ${mols} mol = ${mols * fuel.nuCO2} mol.`,
              `3. Masse: m(CO₂) = ${mols * fuel.nuCO2} mol · 44 g/mol = <strong>${mCO2} g</strong>.`,
            ],
          };
        },
      },
      cases(
        "kohlenstoffkreislauf-bewertung",
        [
          cc(
            "Warum führt das Verbrennen fossiler Energieträger (Kohle, Erdöl, Erdgas) zu einem Anstieg der CO₂-Konzentration in der Atmosphäre, das Verrotten von Herbstlaub im Wald aber nicht?",
            "Fossile Brennstoffe setzen Kohlenstoff frei, der über Jahrmillionen außerhalb des aktiven Kreislaufs in der Erdkruste festgelegt war, während Herbstlaub nur das im selben Jahr per Fotosynthese gebundene CO₂ zurückgibt.",
            ["Weil fossiles CO₂ aus schwereren Atomen besteht, die keine Pflanze aufnehmen kann.", "Weil beim Verrotten überhaupt kein Kohlenstoffdioxid entsteht."],
            "Zusätzlicher Zufluss aus fossilen Lagerstätten übersteigt das Aufnahmevermögen der natürlichen Senken (Wälder, Ozeane).",
            "Kurzgeschlossener Kreislauf heute vs. Öffnen eines Jahrmillionen-Speichers!",
          ),
          cc(
            "Warum setzt Erdgas (Hauptbestandteil Methan, CH₄) pro gewonnener Wärmemenge deutlich weniger CO₂ frei als Braunkohle?",
            "In CH₄ kommen auf 1 C-Atom vier H-Atome, deren Verbrennung zu H₂O ebenfalls viel Wärme liefert, ohne CO₂ zu bilden.",
            ["Weil Methan bei der Verbrennung Stickstoff statt CO₂ bildet.", "Weil Braunkohle überhaupt keinen Kohlenstoff enthält."],
            "Je höher das H : C-Verhältnis im Brennstoff, desto größer ist der Wärmeanteil aus der Wasserbildung.",
            "Was entsteht aus den 4 H-Atomen von CH₄ beim Verbrennen?",
          ),
        ],
        [
          cc(
            "Wasserstoffautos stoßen am Auspuff nur Wasserdampf aus (2 H₂ + O₂ → 2 H₂O). Unter welcher Bedingung ist Wasserstoff als Energieträger tatsächlich nahezu klimaneutral?",
            "Wenn der Wasserstoff durch Elektrolyse von Wasser mit Strom aus erneuerbaren Energien (Wind, Sonne, Wasserkraft) hergestellt wurde (‚grüner Wasserstoff‘), nicht aus Erdgas oder Kohlestrom.",
            ["Wasserstoff kommt in großen unterirdischen Quellen rein auf der Erde vor und muss nie hergestellt werden.", "Auch Wasserstoff aus Kohlekraftwerken hat immer eine CO₂-Bilanz von null."],
            "Zur nachhaltigen Bewertung eines Energieträgers gehört neben der Nutzung immer auch seine Gewinnung und Bereitstellung!",
            "Bewerte nicht nur den Auspuff, sondern auch die Herstellung des Energieträgers!",
          ),
          cc(
            "Wann verliert selbst der nachwachsende Brennstoff Holz seinen Vorteil im Kohlenstoffkreislauf?",
            "Wenn weltweit schneller Wälder gerodet und verbrannt werden, als junge Bäume nachwachsen, und wenn bei unvollständiger Verbrennung viel Feinstaub/Ruß entsteht.",
            ["Holz setzt beim Verbrennen gar kein Kohlenstoffdioxid frei.", "Bäume nehmen nachts zehnmal mehr CO₂ auf als tagsüber bei Sonnenschein."],
            "Nachhaltigkeit erfordert, dass Entnahmerate ≤ Nachwachsrate bleibt und Schadstoffemissionen (Feinstaub) minimiert werden.",
            "Wie lange braucht ein gefällter Baum, um dieselbe Menge CO₂ wieder einzubinden?",
          ),
        ],
      ),
    ],
  }),
];
