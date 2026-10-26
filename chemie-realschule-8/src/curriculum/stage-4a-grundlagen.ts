import { EQUATION_REACTIONS } from "../chemistry/model";
import { fmt, round } from "../exercises/format";
import { makeLab } from "../lab/definitions";
import type { Lesson } from "../model/types";
import { cases, cc, lesson, numberField, withSlips } from "./helpers";

const stageId = "reaktion";

export const REAKTION_LESSONS_A: Lesson[] = [
  lesson(stageId, 1, {
    id: "ch-merkmale-umgruppierung",
    title: "Merkmale chemischer Reaktionen und Atomumgruppierung",
    subtitle: "Stoff- und Energieumsatz erkennen, chemische von physikalischen Vorgängen abgrenzen",
    bindings: { I: 4 },
    why: "Ob Eis schmilzt oder Holz verbrennt: Erst die Frage ‚Entsteht ein neuer Stoff durch Umgruppierung von Atomen?‘ trennt Physik von Chemie.",
    html: "<p>Eine <strong>chemische Reaktion</strong> ist immer durch zwei gemeinsame Merkmale gekennzeichnet: einen <strong>Stoffumsatz</strong> (aus Ausgangsstoffen/Edukten entstehen Reaktionsprodukte mit völlig neuen Kenngrößen wie Dichte, Farbe, Schmelztemperatur oder Magnetisierbarkeit) und einen <strong>Energieumsatz</strong> (Wärme, Licht, elektrische oder mechanische Energie wird abgegeben oder aufgenommen). Bei einem <strong>physikalischen Vorgang</strong> (z.&nbsp;B. Schmelzen von Wachs, Sieden von Wasser, Zerkleinern) ändern sich nur Aggregatzustand oder Zerteilungsgrad — der Stoff selbst bleibt derselbe.</p><p>Auf der Teilchenebene deutest du jede chemische Reaktion mit dem <strong>Daltonschen Atommodell</strong> als <strong>Umgruppierung (Umordnung) von Atomen</strong>: Bestehende Bindungen zwischen den Atomen der Edukte werden gelöst und zwischen denselben Atomen neu geknüpft. Kein einziges Atom verschwindet oder verwandelt sich in eine andere Atomsorte.</p><div class=\"example\"><strong>Beispiel:</strong> Wortgleichung: <em>Eisen + Schwefel → Eisen(II)-sulfid</em> (exotherm). Aus ferromagnetischen Fe-Atomen und gelben S-Atomen entsteht durch Umgruppierung ein schwarzer, spröder, unmagnetischer Feststoff (FeS).</div>",
    rule: "Chemische Reaktion = Stoffumsatz (neue Stoffe, neue Kenngrößen) + Energieumsatz · Teilchenebene (Dalton): Umgruppierung unveränderter Atome",
    terms: [
      ["Stoffumsatz", "Edukte (Ausgangsstoffe) → Produkte (Endstoffe)", "erkennbar an neuen Kenngrößen"],
      ["Energieumsatz", "Auftreten von Wärme, Licht, Strom oder Schall/Druck", "begleitet jede chemische Reaktion"],
      ["Atomumgruppierung", "Bindungen lösen sich und knüpfen sich neu", "Art und Anzahl der Atome bleiben erhalten"],
    ],
    quiz: [
      "Woran erkennst du eindeutig, dass beim Glühen eines Eisen-Schwefel-Gemenges eine chemische Reaktion und kein bloßes Schmelzen stattgefunden hat?",
      "Es entsteht unter starkem Aufglühen ein schwarzer, spröder Feststoff, der nicht mehr vom Magneten angezogen wird (neue Kenngrößen).",
      "Das Gemisch wird beim Erwärmen nur kurz flüssig und behält danach seine gelbe Farbe und Magnetisierbarkeit.",
      "Neue Stoffeigenschaften (unmagnetisch, neue Dichte, neue Farbe) plus Energieumsatz beweisen die Bildung des neuen Stoffes Eisen(II)-sulfid.",
    ],
    lab: makeLab("umgruppierung"),
    exercises: [
      cases(
        "chemisch-oder-physikalisch",
        [
          cc(
            "Kerzenwachs schmilzt in der Mulde unterhalb des Dochts zu einer klaren Flüssigkeit. Was liegt vor?",
            "Ein physikalischer Vorgang, weil sich nur der Aggregatzustand ändert und beim Erstarren wieder unverändertes Wachs vorliegt.",
            ["Eine chemische Reaktion, weil Wachs zu Kohlenstoffdioxid wird.", "Eine Kernspaltung der Kohlenstoffatome."],
            "Beim bloßen Schmelzen bleiben die Wachsmoleküle unverändert; erst in der Flamme verbrennt der Wachsdampf chemisch.",
            "Entsteht beim bloßen Schmelzen ein neuer Stoff?",
          ),
          cc(
            "Magnesiumband verbrennt mit grellweißem Licht zu einem weißen, spröden Pulver. Welche zwei Merkmale zeigen die chemische Reaktion?",
            "Stoffumsatz (metallisches Mg + O₂ → weißes Magnesiumoxid) und Energieumsatz (Licht- und Wärmeabgabe).",
            ["Nur eine Volumenänderung ohne neuen Stoff.", "Nur das Verdampfen von flüssigem Magnesium."],
            "Magnesiumoxid leitet im festen Zustand keinen Strom mehr und hat völlig andere Kenngrößen als Magnesium.",
            "Prüfe neuen Stoff + Energieerscheinung!",
          ),
          cc(
            "Wie erklärt das Daltonsche Atommodell die Bildung neuer Stoffe bei einer chemischen Reaktion?",
            "Durch Umgruppierung (Umordnung) der vorhandenen Atome zu neuen Teilchenverbänden.",
            ["Durch Umwandlung von Sauerstoffatomen in Kohlenstoffatome.", "Durch Vernichtung der Eduktatome in Wärme."],
            "Nach Dalton sind Atome unveränderlich; nur ihre Verknüpfung untereinander ändert sich.",
            "Was passiert mit den Kugeln im Dalton-Modell?",
          ),
        ],
        [
          cc(
            "Eine Brausetablette löst sich sprudelnd in Wasser auf; das entweichende Gas trübt Kalkwasser weiß und das Glas kühlt sich merklich ab. Warum ist das mehr als ein physikalischer Lösevorgang?",
            "Es entsteht ein neuer Stoff (Kohlenstoffdioxid, positiver Nachweis) begleitet von einem spürbaren Energieumsatz (Abkühlung).",
            ["Weil sich jedes Pulver in Wasser chemisch zersetzt.", "Es ist rein physikalisch, weil Wasser flüssig bleibt."],
            "Die Bildung von CO₂ beweist den Stoffumsatz, die Abkühlung den endothermen Energieumsatz.",
            "Achte auf den Gasnachweis und die Temperaturänderung!",
          ),
          cc(
            "In einer Taschenlampenbatterie läuft beim Einschalten eine chemische Reaktion ab. In welcher Hauptform wird die frei werdende Energie hier abgegeben?",
            "Als elektrische Energie (und zu einem kleinen Teil als Wärme).",
            ["Ausschließlich als violettes Leuchten im Batteriegehäuse.", "Überhaupt nicht — Batterien arbeiten ohne Energieumsatz."],
            "Chemische Reaktionen können Energie nicht nur als Wärme, sondern auch als Licht oder elektrische Energie umsetzen.",
            "Welche Energieform treibt die Lampe im Stromkreis an?",
          ),
        ],
      ),
      cases(
        "wortgleichung-deutung",
        [
          cc(
            "Wie lautet die korrekte Wortgleichung für die Verbrennung von Kohlenstoff in reinem Sauerstoff?",
            "Kohlenstoff + Sauerstoff → Kohlenstoffdioxid",
            ["Kohlenstoff + Luft → Rauch + Wärmeenergie", "Kohlenstoff = Sauerstoff + Kohlenstoffdioxid"],
            "Links stehen die Edukte, der Reaktionspfeil ‚→‘ heißt ‚reagiert zu‘, rechts steht das Produkt (kein Gleichheitszeichen!).",
            "Edukte links, Reaktionspfeil →, Produkt rechts.",
          ),
          cc(
            "Was bedeutet der Pfeil ‚→‘ in einer chemischen Wort- oder Formelgleichung?",
            "‚reagiert zu‘ bzw. ‚wandelt sich um in‘ — er trennt Ausgangsstoffe (Edukte) und Endstoffe (Produkte).",
            ["‚ist genau derselbe Stoff wie‘.", "‚wird physikalisch gemischt mit‘."],
            "Da links und rechts verschiedene Stoffe stehen, schreibt man in Reaktionsgleichungen einen Reaktionspfeil statt ‚=‘.",
            "Stehen links und rechts dieselben Stoffe?",
          ),
        ],
        [
          cc(
            "Beim Erhitzen von silbrigem Kupferblech an der Luft entsteht schwarzes Kupfer(II)-oxid. Ein Schüler meint: ‚Die Hitze hat das Kupfer einfach geschwärzt wie Ruß.‘ Wie widerlegst du das fachlich?",
            "Unter Luftabschluss (z. B. in reinem Argon oder Stickstoff) bleibt glühendes Kupfer blank — es reagiert chemisch mit dem Luftsauerstoff zu Kupfer(II)-oxid.",
            ["Kupfer schmilzt schon bei 80 °C zu schwarzem Wasser.", "Kupferatome färben sich ab 200 °C von innen schwarz."],
            "Ein Kontrollversuch ohne Sauerstoff beweist, dass Sauerstoff als Reaktionspartner eingebaut wird.",
            "Welcher Versuch zeigt die Rolle des Luftsauerstoffs?",
          ),
          cc(
            "Warum darf eine Energieangabe wie ‚exotherm‘ nicht als Stoff mit eigenem chemischem Symbol in die Stoffbilanz eingerechnet werden?",
            "Energie besitzt keine Atome; die Wortgleichung benennt die umgesetzten Stoffe, während der Energieumsatz zusätzlich angegeben wird.",
            ["Weil bei chemischen Reaktionen nie Energie umgesetzt wird.", "Weil Wärme aus Sauerstoffatomen besteht."],
            "Stoffbilanz (Atome) und Energiebilanz beschreiben zwei verschiedene Seiten derselben Reaktion.",
            "Besteht Wärme aus Dalton-Atomen?",
          ),
        ],
      ),
    ],
  }),
  lesson(stageId, 2, {
    id: "ch-elemente-verbindungen",
    title: "Elemente, Verbindungen und Stoffgemische",
    subtitle: "Reinstoffe in Elemente und Verbindungen einteilen und von Gemischen abgrenzen",
    bindings: { I: 4 },
    why: "Ein Gemisch aus Wasserstoff und Sauerstoff ist hochexplosiv, die Verbindung Wasser löscht Brände — derselbe Atomvorrat, aber völlig anderer Zustand!",
    html: "<p>In der Stoffsystematik teilst du die <strong>Reinstoffe</strong> anhand ihres Teilchenaufbaus und ihrer Zerlegbarkeit in zwei Gruppen ein:</p><ul><li><strong>Elemente:</strong> Reinstoffe, die aus nur <strong>einer einzigen Atomsorte</strong> bestehen (z.&nbsp;B. Eisen Fe, Schwefel S, Sauerstoff O<sub>2</sub>, Argon Ar). Sie lassen sich durch <em>keine</em> chemische Reaktion weiter in einfachere Stoffe zerlegen.</li><li><strong>Chemische Verbindungen:</strong> Reinstoffe, deren Teilchen aus <strong>mindestens zwei verschiedenen Atomsorten in einem festen Zahlenverhältnis</strong> aufgebaut sind (z.&nbsp;B. Wasser H<sub>2</sub>O im Verhältnis 2 : 1, Kohlenstoffdioxid CO<sub>2</sub> im Verhältnis 1 : 2, Eisen(II)-sulfid FeS im Verhältnis 1 : 1). Verbindungen besitzen eigene, konstante Kenngrößen und lassen sich nur durch <em>chemische Reaktionen (Analyse)</em> wieder in Elemente zerlegen.</li></ul><p>Im Gegensatz dazu enthält ein <strong>Stoffgemisch</strong> (z.&nbsp;B. Eisen-Schwefel-Gemenge, Knallgas aus H<sub>2</sub> und O<sub>2</sub>) mehrere Reinstoffe nebeneinander in variablem Verhältnis und lässt sich mit <em>physikalischen Trennverfahren</em> trennen.</p><div class=\"example\"><strong>Beispiel:</strong> Aus einem <em>Eisen-Schwefel-Gemenge</em> zieht ein Magnet das Eisen problemlos heraus. Nach der Reaktion zur Verbindung <em>Eisen(II)-sulfid (FeS)</em> haftet nichts mehr am Magneten!</div>",
    rule: "Gemisch (≥ 2 Stoffe, physikalisch trennbar) ↔ Reinstoff (konstante Kenngrößen): Element (1 Atomsorte, nicht zerlegbar) oder Verbindung (≥ 2 Atomsorten fest gebunden, chemisch zerlegbar)",
    terms: [
      ["Element", "Reinstoff aus nur einer Atomsorte", "z. B. Cu, Fe, O<sub>2</sub>, H<sub>2</sub>, Ne"],
      ["Verbindung", "Reinstoff aus ≥ 2 Atomsorten in festem Zahlenverhältnis", "z. B. H<sub>2</sub>O, CO<sub>2</sub>, NaCl, FeS"],
      ["Abgrenzung Gemisch", "variables Mischungsverhältnis, physikalisch trennbar", "z. B. Luft, Salzwasser, Fe/S-Gemenge"],
    ],
    quiz: [
      "Warum ist Sauerstoffgas (O₂) ein Element und keine Verbindung, obwohl jedes Molekül aus zwei Atomen besteht?",
      "Beide gebundenen Atome gehören derselben einzigen Atomsorte (Sauerstoff) an; eine Verbindung erfordert mindestens zwei verschiedene Atomsorten.",
      "Weil alle Gase grundsätzlich Elemente sind.",
      "Entscheidend für ein Element ist ‚nur eine einzige Atomsorte‘, nicht ob die Atome einzeln (Ar) oder als zweiatomiges Molekül (O₂) vorliegen.",
    ],
    lab: makeLab("stoffsystematik"),
    exercises: [
      cases(
        "stoffklassen-einordnen",
        [
          cc(
            "Ordne destilliertes Wasser (H₂O) in das Stammbaum-Schema der Stoffe ein!",
            "Reinstoff → chemische Verbindung (aus Wasserstoff- und Sauerstoffatomen im Verhältnis 2 : 1).",
            ["Reinstoff → chemisches Element.", "Homogenes Gasgemisch wie Luft."],
            "Wasser hat konstante Kenngrößen (Reinstoff) und besteht aus zwei verschiedenen gebundenen Atomsorten (Verbindung).",
            "Eine Stoffart mit zwei verschiedenen Atomsorten.",
          ),
          cc(
            "Ordne ein Gemisch aus Wasserstoffgas (H₂) und Sauerstoffgas (O₂) vor dem Entzünden (Knallgas) richtig ein!",
            "Homogenes Stoffgemisch (Gasgemisch aus zwei Elementen).",
            ["Chemische Verbindung mit der Formel H₂O.", "Chemisches Element Knallium."],
            "Vor der Zündung fliegen H₂- und O₂-Moleküle unverbunden durcheinander; erst durch die Synthese entsteht die Verbindung Wasser.",
            "Sind H₂ und O₂ vor der Zündung schon miteinander zu H₂O verbunden?",
          ),
          cc(
            "Wodurch unterscheidet sich eine chemische Verbindung grundlegend von einem Stoffgemisch aus denselben Elementen?",
            "Die Verbindung besitzt ein festes Atomzahlenverhältnis, eigene konstante Kenngrößen und ist nur chemisch (nicht physikalisch) zerlegbar.",
            ["Ein Gemisch hat immer eine höhere Dichte als jede Verbindung.", "Eine Verbindung lässt sich durch einfaches Filtrieren in ihre Elemente zerlegen."],
            "Im Gemisch bleiben die Kenngrößen der Einzelstoffe erhalten; in der Verbindung entstehen völlig neue Kenngrößen.",
            "Denke an Magnetscheiden beim Fe/S-Gemenge vs. FeS!",
          ),
        ],
        [
          cc(
            "Jemand bezeichnet ‚Luft, Wasser, Feuer und Erde‘ wie in der Antike als chemische Elemente. Warum scheiden Luft, Wasser und Ackererde nach heutigem Elementbegriff aus?",
            "Luft und Ackererde sind Stoffgemische; Wasser ist eine chemische Verbindung, die sich elektrolytisch in Wasserstoff und Sauerstoff zerlegen lässt.",
            ["Weil moderne Elemente nur Metalle sein dürfen.", "Weil Wasser nur aus einer einzigen Atomsorte besteht."],
            "Ein chemisches Element besteht aus genau einer Atomsorte; Feuer ist nicht einmal ein Stoff, sondern eine Energie-/Reaktionserscheinung.",
            "Prüfe jeden Begriff auf: Gemisch, Verbindung oder Prozess!",
          ),
          cc(
            "Diamant und Graphit verbrennen in reinem Sauerstoff beide ausschließlich zu Kohlenstoffdioxid (CO₂), wobei ihre Masse genau der im CO₂ enthaltenen Kohlenstoffmasse entspricht. Was beweist das?",
            "Beide Stoffe sind Erscheinungsformen (Modifikationen) desselben Elements Kohlenstoff und enthalten keine fremden Atomsorten.",
            ["Diamant ist eine Verbindung aus Kohlenstoff und Silber.", "Kohlenstoffdioxid ist ein chemisches Element."],
            "Da außer C-Atomen und dem zugeführten O₂ nichts auftritt, bestehen beide Reinstoffe nur aus der Atomsorte Kohlenstoff.",
            "Wie viele Atomsorten stecken in Diamant bzw. Graphit?",
          ),
        ],
      ),
      cases(
        "formel-stoffklasse",
        [
          cc(
            "Welche Auswahl enthält ausschließlich chemische Elemente?",
            "Fe, S₈, O₂, Ar",
            ["H₂O, CO₂, NH₃, CH₄", "Luft, Messing, Kochsalz, Bronze"],
            "Fe, S₈, O₂ und Ar enthalten jeweils nur eine einzige Atomsorte.",
            "Zähle die verschiedenen Elementsymbole je Formel!",
          ),
          cc(
            "Welche Auswahl enthält ausschließlich chemische Verbindungen?",
            "H₂O, CO₂, I₂O₅, MgO",
            ["N₂, O₂, H₂, Cl₂", "Granit, Milch, Nebel, Rauch"],
            "Jede der vier Formeln vereint zwei verschiedene Atomsorten in einem festen Zahlenverhältnis.",
            "Mindestens zwei Großbuchstaben verschiedener Elemente pro Formel!",
          ),
        ],
        [
          cc(
            "Ein weißes Pulver schmilzt scharf bei 801 °C und lässt sich weder durch Filtration noch durch Destillation trennen, wohl aber durch Schmelzflusselektrolyse in silbriges Natrium und grüngelbes Chlorgas zerlegen. Was liegt vor?",
            "Eine chemische Verbindung (Natriumchlorid), also ein Reinstoff aus zwei Elementen.",
            ["Ein heterogenes Gemenge aus Natriumspänen und Chlorgas.", "Ein chemisches Element, weil der Schmelzpunkt konstant ist."],
            "Konstanter Schmelzpunkt beweist den Reinstoff; die Zerlegbarkeit in zwei verschiedene Elemente beweist die Verbindung.",
            "Konstanter Schmelzpunkt + chemisch in 2 Elemente zerlegbar = ?",
          ),
          cc(
            "Warum schreibt man für ein Eisen-Schwefel-Gemenge keine Verhältnisformel wie ‚FeS‘, selbst wenn man zufällig genau im Teilchenverhältnis 1 : 1 abgewogen hat?",
            "Weil Fe- und S-Atome im Gemenge noch nicht chemisch miteinander zum gemeinsamen Teilchengitter verbunden sind.",
            ["Weil man Eisen im Labor nicht abwiegen kann.", "Weil Schwefel kein Elementsymbol besitzt."],
            "Eine Verbindungsformel wie FeS setzt voraus, dass die Reaktion stattgefunden hat und die Bausteine chemisch gebunden sind.",
            "Liegt vor dem Zünden schon das Ionengitter von FeS vor?",
          ),
        ],
      ),
    ],
  }),
  lesson(stageId, 3, {
    id: "ch-wasser-analyse-synthese",
    title: "Analyse, Synthese und Reversibilität am Beispiel Wasser",
    subtitle: "Hofmannscher Wasserzersetzungsapparat, Diiodpentaoxid und Knallgasreaktion",
    bindings: { I: 4 },
    why: "Das Volumenverhältnis 2 : 1 bei der Wasserelektrolyse macht die unsichtbare Molekülformel H₂O im Messrohr direkt ablesbar!",
    html: "<p>Zwei Grundtypen chemischer Reaktionen kehren einander um: Bei einer <strong>Analyse (Zerlegung)</strong> wird eine Verbindung in Elemente oder einfachere Verbindungen gespalten; bei einer <strong>Synthese (Bildung)</strong> vereinigen sich Elemente (oder einfachere Stoffe) zu einer Verbindung.</p><p>Im <strong>Hofmannschen Wasserzersetzungsapparat</strong> zerlegt Gleichstrom angesäuertes Wasser (endotherme Analyse): Am Minuspol (Kathode) entsteht <strong>Wasserstoff (H<sub>2</sub>)</strong>, am Pluspol (Anode) <strong>Sauerstoff (O<sub>2</sub>)</strong> — und zwar exakt im <strong>Volumenverhältnis V(H<sub>2</sub>) : V(O<sub>2</sub>) = 2 : 1</strong>! Da gleiche Gasvolumina bei gleichem Druck und gleicher Temperatur gleich viele Moleküle enthalten, entstehen doppelt so viele H<sub>2</sub>-Moleküle wie O<sub>2</sub>-Moleküle — das bestätigt die Molekülformel <strong>H<sub>2</sub>O</strong>: <strong>2 H<sub>2</sub>O → 2 H<sub>2</sub> + O<sub>2</sub></strong>. Eine zweite klassische Analyse ist die thermische Zerlegung (Thermolyse) von weißem <strong>Diiodpentaoxid</strong> im Reagenzglas zu violettem Ioddampf und Sauerstoff: <strong>2 I<sub>2</sub>O<sub>5</sub> → 2 I<sub>2</sub> + 5 O<sub>2</sub></strong>. Umgekehrt liefert die stark exotherme <strong>Synthese von Wasser</strong> (<strong>2 H<sub>2</sub> + O<sub>2</sub> → 2 H<sub>2</sub>O</strong>) oder von Kohlenstoffdioxid (<strong>C + O<sub>2</sub> → CO<sub>2</sub></strong>) wieder die Verbindung: Chemische Reaktionen sind grundsätzlich <strong>umkehrbar (reversibel)</strong>.</p><div class=\"example\"><strong>Beispiel:</strong> Sammeln sich bei der Wasserelektrolyse 36 ml Wasserstoff am Minuspol, so befinden sich am Pluspol gleichzeitig genau 18 ml Sauerstoff (Verhältnis 36 : 18 = 2 : 1).</div>",
    rule: "Analyse: Verbindung → Elemente (z. B. 2 H<sub>2</sub>O → 2 H<sub>2</sub> + O<sub>2</sub>, V(H<sub>2</sub>) : V(O<sub>2</sub>) = 2 : 1) · Synthese: Elemente → Verbindung (Umkehrreaktion, reversibel)",
    terms: [
      ["Wasseranalyse (Elektrolyse)", "2 H<sub>2</sub>O → 2 H<sub>2</sub> + O<sub>2</sub> (endotherm)", "V(H<sub>2</sub>) : V(O<sub>2</sub>) = 2 : 1 bestätigt H<sub>2</sub>O"],
      ["Thermolyse Diiodpentaoxid", "2 I<sub>2</sub>O<sub>5</sub> → 2 I<sub>2</sub> + 5 O<sub>2</sub> (endotherm)", "violetter Ioddampf + positive Glimmspanprobe"],
      ["Synthese & Reversibilität", "2 H<sub>2</sub> + O<sub>2</sub> → 2 H<sub>2</sub>O · C + O<sub>2</sub> → CO<sub>2</sub>", "Analyse und Synthese sind Umkehrreaktionen"],
    ],
    quiz: [
      "Im Hofmannschen Wasserzersetzungsapparat fängst du in einem Schenkel 24 ml Gas auf, im anderen 12 ml. Welches Gas befindet sich im Schenkel mit den 24 ml, und wie weist du es nach?",
      "Wasserstoff (H₂) — Nachweis durch eine positive Knallgasprobe.",
      "Sauerstoff (O₂) — Nachweis durch die Kalkwasserprobe.",
      "Aus 2 H₂O → 2 H₂ + O₂ folgt V(H₂) = 2 · V(O₂); das doppelt so große Volumen (24 ml) ist Wasserstoff.",
    ],
    lab: makeLab("hofmann"),
    exercises: [
      {
        id: "hofmann-gasvolumen",
        make(rng, level) {
          const vO2 = rng.int(6, 28);
          const vH2 = 2 * vO2;
          if (level === 1) {
            return {
              prompt: `Bei der Elektrolyse von Wasser im Hofmannschen Wasserzersetzungsapparat (2 H<sub>2</sub>O → 2 H<sub>2</sub> + O<sub>2</sub>) haben sich am Pluspol V(O<sub>2</sub>) = ${vO2} ml Sauerstoff gesammelt. Welches Volumen V(H<sub>2</sub>) an Wasserstoff liest du gleichzeitig am Minuspol ab?`,
              given: [`V(O<sub>2</sub>) = ${vO2} ml`, "Volumenverhältnis V(H₂) : V(O₂) = 2 : 1"],
              formulaHint: "V(H₂) = 2 · V(O₂)",
              fields: [
                withSlips(
                  numberField("V(H₂) =", vH2, "ml", 0),
                  [round(vO2 / 2, 1), "Wasserstoff hat das doppelt so große Volumen wie Sauerstoff, nicht das halbe!"],
                  [vO2, "Im Wassermolekül H₂O stecken doppelt so viele H-Atome wie O-Atome → V(H₂) = 2 · V(O₂)."],
                ),
              ],
              steps: [
                "Nach 2 H₂O → 2 H₂ + O₂ entstehen H₂ und O₂ im Volumenverhältnis 2 : 1.",
                `V(H₂) = 2 · ${vO2} ml = ${vH2} ml.`,
                `<strong>V(H₂) = ${vH2} ml</strong>`,
              ],
            };
          }
          const totalGas = 3 * vO2;
          return {
            prompt: `Bei einer Wasserelektrolyse fängst du in beiden Schenkeln des Hofmann-Apparats <em>zusammen</em> ein Gesamtgasvolumen von V(gesamt) = ${totalGas} ml auf (gleicher Druck, gleiche Temperatur). Wie viele Milliliter davon entfallen auf <strong>Wasserstoff V(H<sub>2</sub>)</strong> und wie viele auf <strong>Sauerstoff V(O<sub>2</sub>)</strong>?`,
            given: [],
            formulaHint: "V(H₂) : V(O₂) = 2 : 1 → 3 Volumenteile insgesamt (2 Teile H₂, 1 Teil O₂)",
            fields: [
              withSlips(
                numberField("V(H₂) =", vH2, "ml", 0),
                [vO2, "Wasserstoff macht 2 von 3 Teilen aus, Sauerstoff 1 von 3 Teilen."],
                [round(totalGas / 2, 1), "Das Verhältnis ist 2 : 1 (Drittelung), nicht 1 : 1 (Halbierung)."],
              ),
              withSlips(
                numberField("V(O₂) =", vO2, "ml", 0),
                [vH2, "Sauerstoff macht 1 Drittel des Gesamtvolumens aus."],
                [round(totalGas / 2, 1), "Teile das Gesamtvolumen im Verhältnis 2 : 1 auf."],
              ),
            ],
            steps: [
              `V(H₂) : V(O₂) = 2 : 1 bedeutet zusammen 2 + 1 = 3 gleiche Volumenteile.`,
              `1 Teil entspricht ${totalGas} ml / 3 = ${vO2} ml → V(O₂) = ${vO2} ml und V(H₂) = 2 · ${vO2} ml = ${vH2} ml.`,
              `<strong>V(H₂) = ${vH2} ml, V(O₂) = ${vO2} ml</strong>`,
            ],
          };
        },
      },
      cases(
        "analyse-synthese",
        [
          cc(
            "Was beobachtest du beim kräftigen Erhitzen von weißem Diiodpentaoxid (I₂O₅) im Reagenzglas, und welcher Reaktionstyp liegt vor?",
            "Es steigt violetter Ioddampf auf und ein glimmender Span flammt auf (Sauerstoff) — es ist eine thermische Analyse (2 I₂O₅ → 2 I₂ + 5 O₂).",
            ["Das weiße Pulver verwandelt sich in flüssiges Eisen — eine Synthese.", "Es entsteht nur Wasserdampf ohne Farbänderung."],
            "Diiodpentaoxid zerfällt beim Erhitzen endotherm in die beiden Elemente Iod und Sauerstoff.",
            "Zerlegung einer Verbindung durch Wärme = Thermolyse (Analyse).",
          ),
          cc(
            "Warum nennt man das Paar aus Wasserelektrolyse und Knallgasreaktion ein Paradebeispiel für die Reversibilität chemischer Reaktionen?",
            "Die Analyse zerlegt Wasser unter Energiezufuhr in H₂ und O₂; die Synthese vereint H₂ und O₂ unter Energieabgabe wieder zu Wasser.",
            ["Weil beide Reaktionen völlig ohne Energieumsatz ablaufen.", "Weil bei beiden Reaktionen Kohlenstoffdioxid entsteht."],
            "Hinreaktion (Synthese, exotherm) und Rückreaktion (Analyse, endotherm) kehren Stoff- und Energieumsatz genau um.",
            "Vergleiche Edukte, Produkte und Energierichtung von Hin- und Rückreaktion!",
          ),
        ],
        [
          cc(
            "Im realen Schulexperiment misst man am Anfang der Wasserelektrolyse manchmal z. B. 20,0 ml H₂, aber nur 9,4 ml O₂ statt exakt 10,0 ml. Woran liegt diese kleine Abweichung?",
            "Sauerstoff löst sich etwas besser in Wasser als Wasserstoff, sodass zu Beginn ein kleiner Teil des O₂ im Elektrolyten gelöst bleibt.",
            ["Die Formel von Wasser lautet in Wirklichkeit H₂,₁₃O.", "Sauerstoffatome werden durch den elektrischen Strom vernichtet."],
            "Sobald die Flüssigkeit mit Sauerstoff gesättigt ist, wachsen die Gasvolumina exakt im Verhältnis 2 : 1 weiter.",
            "Vergleiche die Wasserlöslichkeit von O₂ (Fische atmen im Wasser!) und H₂.",
          ),
          cc(
            "Welcher Reaktionstyp liegt bei der Reaktion C + O₂ → CO₂ vor, und wie unterscheidet sie sich von der Reaktion 2 CO + O₂ → 2 CO₂?",
            "Beides sind Synthesen: Einmal entsteht CO₂ direkt aus zwei Elementen, beim zweiten Mal aus einer Verbindung (CO) und einem Element (O₂).",
            ["Beides sind Analysen, weil rechts nur ein Stoff steht.", "Beides sind physikalische Trennverfahren."],
            "Vereinigen sich zwei Ausgangsstoffe zu einer einzigen Verbindung, spricht man von einer Synthese.",
            "Zwei Ausgangsstoffe → ein einziges Produkt = Synthese.",
          ),
        ],
      ),
    ],
  }),
  lesson(stageId, 4, {
    id: "ch-massenerhaltung-gleichungen",
    title: "Massenerhaltung und Ausgleichen von Formelgleichungen",
    subtitle: "Lavoisiers Gesetz im offenen und geschlossenen System, Koeffizienten bestimmen",
    bindings: { I: 4 },
    why: "Weil kein Atom aus dem Nichts entsteht oder spurlos verschwindet, muss jede Reaktionsgleichung links und rechts exakt dieselbe Atomzahl jeder Sorte zeigen.",
    html: "<p>Antoine Laurent de Lavoisier wies durch präzises Wiegen das <strong>Gesetz von der Erhaltung der Masse</strong> nach: <em>Bei allen chemischen Reaktionen im geschlossenen System ist die Gesamtmasse der Ausgangsstoffe gleich der Gesamtmasse der Reaktionsprodukte.</em> Daltons Atomhypothese liefert sofort die Erklärung: Da Atome weder vernichtet noch neu erschaffen, sondern nur umgruppiert werden, bleibt die Summe aller Atommassen konstant!</p><p>Scheinbare Ausnahmen treten nur im <strong>offenen System</strong> auf: Verbrennt Eisenwolle an der Luft auf einer Waage, wird sie <em>schwerer</em>, weil zuvor nicht mitgewogener Luftsauerstoff als festes Eisenoxid gebunden wird; verbrennt Holz im offenen Tiegel, wird die Asche <em>leichter</em>, weil gasförmiges CO<sub>2</sub> und Wasserdampf entweichen. In einer <strong>Formelgleichung</strong> stellst du die Massenerhaltung dar, indem du vor die Formeln passende ganzzahlige <strong>Koeffizienten</strong> setzt, bis von jeder Atomsorte links und rechts gleich viele Atome stehen — die tiefgestellten <strong>Indizes in einer Formel darfst du beim Ausgleichen niemals ändern</strong>, denn das würde den Stoff selbst verfälschen!</p><div class=\"example\"><strong>Beispiel:</strong> Aluminium + Sauerstoff → Aluminiumoxid: Rohansatz Al + O<sub>2</sub> → Al<sub>2</sub>O<sub>3</sub>. Sauerstoff ausgleichen (kgV von 2 und 3 ist 6): Al + <strong>3</strong> O<sub>2</sub> → <strong>2</strong> Al<sub>2</sub>O<sub>3</sub>. Jetzt Aluminium zählen (rechts 2 · 2 = 4): <strong>4 Al + 3 O<sub>2</sub> → 2 Al<sub>2</sub>O<sub>3</sub></strong>.</div>",
    rule: "Geschlossenes System: m(Edukte) = m(Produkte) · Beim Ausgleichen nur Koeffizienten vor den Formeln anpassen, niemals Indizes ändern!",
    terms: [
      ["Massenerhaltung (Lavoisier)", "m(Edukte) = m(Produkte) im geschlossenen System", "bestätigt Daltons Atomhypothese"],
      ["Offenes vs. geschlossenes System", "im offenen System können Gase entweichen oder aus der Luft hinzutreten", "täuscht Massenverlust/-zunahme vor"],
      ["Formelgleichung einrichten", "für jede Atomsorte: Summe Atome links = Summe Atome rechts", "kleinste ganzzahlige Koeffizienten"],
    ],
    quiz: [
      "Beim Ausgleichen von H₂ + O₂ → H₂O schreibt jemand H₂ + O₂ → H₂O₂. Welcher schwere Fehler wurde gemacht?",
      "Es wurde ein Index geändert und damit aus Wasser (H₂O) ein völlig anderer Stoff (Wasserstoffperoxid, H₂O₂) gemacht; richtig ist 2 H₂ + O₂ → 2 H₂O.",
      "Es hätten auf beiden Seiten alle Indizes gestrichen werden müssen: H + O → HO.",
      "Indizes gehören fest zur Formel des Stoffes; ausgeglichen wird ausschließlich mit Koeffizienten vor den Formeln.",
    ],
    lab: makeLab("gleichungswaage"),
    exercises: [
      {
        id: "massenerhaltung-koeffizienten",
        make(rng, level) {
          if (level === 1) {
            const rx = rng.pick(EQUATION_REACTIONS);
            const [a, b, c] = rx.target;
            const eqRaw = rx.isDecomposition
              ? `<em>c</em> ${rx.rightFormula} → <em>a</em> ${rx.leftFormulas[0]} + <em>b</em> ${rx.leftFormulas[1]}`
              : `<em>a</em> ${rx.leftFormulas[0]} + <em>b</em> ${rx.leftFormulas[1]} → <em>c</em> ${rx.rightFormula}`;
            return {
              prompt: `Gleiche die Formelgleichung für die <strong>${rx.title}</strong> mit kleinsten ganzzahligen Koeffizienten aus:<br>${eqRaw}`,
              given: rx.atoms.map(
                (at) => `${at.symbol}-Atome je Einheit: ${rx.leftFormulas[0]}=${at.counts[0]}, ${rx.leftFormulas[1]}=${at.counts[1]}, ${rx.rightFormula}=${at.counts[2]}`,
              ),
              formulaHint: "Von jeder Atomsorte müssen links und rechts gleich viele Atome stehen (kleinste ganze Zahlen)",
              fields: [
                withSlips(numberField("a =", a), [2 * a, "Kürze alle Koeffizienten auf kleinste ganze Zahlen!"]),
                withSlips(numberField("b =", b), [2 * b, "Kürze alle Koeffizienten auf kleinste ganze Zahlen!"]),
                withSlips(numberField("c =", c), [2 * c, "Kürze alle Koeffizienten auf kleinste ganze Zahlen!"]),
              ],
              steps: [
                `Rohansatz: ${rx.isDecomposition ? `${rx.rightFormula} → ${rx.leftFormulas[0]} + ${rx.leftFormulas[1]}` : `${rx.leftFormulas[0]} + ${rx.leftFormulas[1]} → ${rx.rightFormula}`}.`,
                `Atombilanz abgleichen: a = ${a}, b = ${b}, c = ${c}.`,
                `<strong>a = ${a}, b = ${b}, c = ${c}</strong>`,
              ],
            };
          }
          // Level 2: Lavoisier-Massenbilanz an einer Molekül- oder Metalloxidreaktion
          const mMetal = round(rng.int(12, 48) * 0.5, 1);
          const mOxide = round(mMetal * 1.4, 1);
          const mOxygen = round(mOxide - mMetal, 1);
          return {
            prompt: `In einem geschlossenen Kolben verbrennen m(Metall) = ${fmt(mMetal, 1)} g Kupfer vollständig mit Sauerstoff zu genau m(Oxid) = ${fmt(mOxide, 1)} g schwarzem Kupfer(II)-oxid. Welche Masse m(O<sub>2</sub>) an Sauerstoff wurde bei dieser Reaktion chemisch gebunden?`,
            given: [],
            formulaHint: "Massenerhaltung: m(Kupfer) + m(Sauerstoff) = m(Kupferoxid)",
            fields: [
              withSlips(
                numberField("m(O₂) =", mOxygen, "g", 1),
                [round(mOxide + mMetal, 1), "Sauerstoff und Kupfer ergeben zusammen das Oxid: Ziehe m(Metall) von m(Oxid) ab!"],
                [round(mMetal - mOxygen, 1), "Rechne m(Oxid) − m(Metall)."],
              ),
            ],
            steps: [
              "Nach dem Gesetz der Massenerhaltung gilt: m(Kupfer) + m(Sauerstoff) = m(Kupfer(II)-oxid).",
              `m(O₂) = ${fmt(mOxide, 1)} g − ${fmt(mMetal, 1)} g = ${fmt(mOxygen, 1)} g.`,
              `<strong>m(O₂) = ${fmt(mOxygen, 1)} g</strong>`,
            ],
          };
        },
      },
      cases(
        "lavoisier-systeme",
        [
          cc(
            "Auf einer offenen Balkenwaage wird ein Bausch feiner Eisenwolle entzündet. Während des Aufglühens senkt sich die Waagschale mit der Eisenwolle nach unten. Warum?",
            "Sauerstoffatome aus der Umgebungsluft verbinden sich mit den Eisenatomen zu festem Eisenoxid, dessen Masse nun mitgewogen wird.",
            ["Wärme hat ein eigenes Gewicht und drückt die Schale nach unten.", "Eisenatome vermehren sich beim Glühen von selbst."],
            "Im offenen System war das Gas Sauerstoff vorher nicht auf der Waagschale erfasst; im Produkt steckt es nun als Feststoff fest gebunden.",
            "Welcher Reaktionspartner kam aus der Luft hinzu?",
          ),
          cc(
            "Ein Streichholzkopf glüht in einem luftdicht verschlossenen, hitzefesten Glaskolben auf einer Feinwaage ab. Wie ändert sich die Anzeige der Waage nach dem Abkühlen?",
            "Gar nicht — im geschlossenen System bleibt die Gesamtmasse aller Stoffe exakt konstant.",
            ["Die Anzeige sinkt auf null, weil Rauch nichts wiegt.", "Die Anzeige verdoppelt sich durch das entstandene Gas."],
            "Im geschlossenen Gefäß können weder Gase entweichen noch eintreten; alle Atome bleiben im Kolben.",
            "Kann aus einem geschlossenen Glaskolben ein Atom entweichen?",
          ),
        ],
        [
          cc(
            "In einem offenen Becherglas auf der Waage tropfst du Salzsäure auf Kalkstein (Gesamtmasse zu Beginn: 125,0 g). Es sprudelt kräftig; am Ende zeigt die Waage 122,8 g. Ist Lavoisiers Gesetz widerlegt?",
            "Nein — es sind genau 2,2 g gasförmiges Kohlenstoffdioxid aus dem offenen Becherglas in die Raumluft entwichen.",
            ["Ja — bei Gasreaktionen verschwinden 2,2 g Atome spurlos.", "Nein — die Waage wird durch Kohlenstoffdioxid magnetisch abgestoßen."],
            "Fängt man das entweichende CO₂ in einem aufgesetzten Luftballon (geschlossenes System) auf, bleibt die Gesamtmasse (abzgl. Auftriebskorrektur im starren Gefäß) exakt 125,0 g.",
            "Offenes Gefäß + Gasentwicklung → wohin sind die fehlenden 2,2 g gegangen?",
          ),
          cc(
            "Wie bestätigt das Gesetz von der Erhaltung der Masse unmittelbar die Daltonsche Atomhypothese?",
            "Wenn jedes Atom seine unveränderliche Masse behält und bei Reaktionen nur Atome umgruppiert werden, muss die Summe aller Atommassen vor und nach der Reaktion identisch sein.",
            ["Weil nach Dalton alle Atome masselos sind.", "Weil Dalton annahm, dass Atome beim Erhitzen schwerer werden."],
            "Unveränderliche Teilchenanzahl je Sorte + konstante Atommasse je Sorte ⇒ konstante Gesamtmasse.",
            "Verknüpfe ‚konstante Atommasse‘ mit ‚konstanter Atomzahl‘!",
          ),
        ],
      ),
    ],
  }),
];
