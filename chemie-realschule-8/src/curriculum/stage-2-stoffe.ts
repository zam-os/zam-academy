import {
  fmtTemp,
  LINDE_GASES,
  PHASE_SUBSTANCES,
  SUBSTANCES,
} from "../chemistry/model";
import { fmt, round } from "../exercises/format";
import { makeLab } from "../lab/definitions";
import type { Stage } from "../model/types";
import { cases, cc, lesson, numberField, withSlips } from "./helpers";

const id = "stoffe";

export const STAGE_STOFFE: Stage = {
  id,
  stageNumber: 2,
  title: "Stoffe und ihre Eigenschaften",
  subtitle: "Kenngrößen, Nachweise, Teilchenmodell und Trennverfahren",
  icon: "🧪",
  accent: "#2563eb",
  badgeTitle: "Stoffdetektiv",
  lehrplanLabel: "C8 LB 2 (I)",
  lessons: [
    lesson(id, 1, {
      id: "ch-sinne-kenngroessen",
      title: "Sinneseindrücke und messbare Kenngrößen",
      subtitle: "Grenzen der Sinne, Schmelz-/Siedetemperatur, Löslichkeit, Leitfähigkeit und Dichte",
      bindings: { I: 2 },
      why: "Weißes Pulver kann Puderzucker, Kochsalz oder ein Giftstoff sein — erst messbare Kenngrößen identifizieren einen Stoff objektiv und gefahrlos.",
      html: "<p>Im ersten Schritt nimmst du Stoffe mit den <strong>Sinnesorganen</strong> wahr: Farbe, Oberflächenglanz, Kristallform oder (nur nach Freigabe durch Zufächeln!) den Geruch. Doch Sinneseindrücke stoßen rasch an <strong>Grenzen</strong>: Sie sind subjektiv, viele Gase und Lösungen sehen völlig gleich aus, und Geschmacks- oder Tastproben sind im Chemielabor wegen Verätzungs- und Vergiftungsgefahr streng verboten.</p><p>Exakt und reproduzierbar beschreibst du einen Reinstoff über experimentell messbare <strong>Kenngrößen</strong> (spezifische Stoffeigenschaften, die bei gegebenem Druck bzw. gegebener Temperatur unabhängig von der Stoffportion sind): <strong>Schmelztemperatur θ<sub>S</sub></strong>, <strong>Siedetemperatur θ<sub>B</sub></strong>, <strong>Dichte ρ = m / V</strong>, <strong>Löslichkeit</strong> in einem Lösungsmittel sowie die <strong>elektrische Leitfähigkeit</strong> im festen und flüssigen Zustand.</p><div class=\"example\"><strong>Beispiel:</strong> Ein Metallwürfel hat die Masse m = 54,0 g und das Volumen V = 20,0 cm³. Seine Dichte beträgt ρ = 54,0 g / 20,0 cm³ = 2,70 g/cm³ — zusammen mit dem silbrigen Glanz und θ<sub>S</sub> = 660 °C weist das auf Aluminium hin.</div>",
      rule: "Sinne liefern nur erste Hinweise (nie kosten!) · Kenngrößen (θ<sub>S</sub>, θ<sub>B</sub>, ρ = m / V, Löslichkeit, Leitfähigkeit) kennzeichnen Reinstoffe eindeutig",
      terms: [
        ["Dichte", "ρ = m / V", "ρ Dichte (g/cm³), m Masse (g), V Volumen (cm³ = ml)"],
        ["Schmelz- / Siedetemperatur", "θ<sub>S</sub> (fest ↔ flüssig) · θ<sub>B</sub> (flüssig ↔ gasförmig)", "bei Normaldruck charakteristisch für jeden Reinstoff"],
        ["Leitfähigkeit & Löslichkeit", "Prüfung im festen und flüssigen Zustand bzw. in Wasser", "trennt Metalle, Salze und molekulare Stoffe"],
      ],
      quiz: [
        "Zwei farblose, geruchlose Flüssigkeiten stehen im Labor. Warum entscheidest du dich für die Bestimmung von Dichte und Siedetemperatur statt einer Geschmacksprobe?",
        "Geschmacksproben sind lebensgefährlich; Dichte und Siedetemperatur sind objektive, messbare Kenngrößen.",
        "Weil alle Flüssigkeiten die exakt gleiche Dichte von 1,00 g/cm³ besitzen.",
        "Sinneseindrücke täuschen und gefährden die Gesundheit; Kenngrößen unterscheiden z. B. Wasser (ρ = 1,00 g/cm³, θ_B = 100 °C) und Ethanol (ρ = 0,79 g/cm³, θ_B = 78 °C) eindeutig.",
      ],
      lab: makeLab("kenngroessen"),
      exercises: [
        {
          id: "dichte-berechnen",
          make(rng, level) {
            const sample = rng.pick(SUBSTANCES);
            const volume = rng.int(8, 35);
            const mass = round(sample.density * volume, 1);
            if (level === 1) {
              const rho = round(mass / volume, 2);
              return {
                prompt: `Ein Werkstück bzw. eine Probe aus <strong>${sample.name}</strong> hat die Masse m = ${fmt(mass, 1)} g und verdrängt im Messzylinder das Volumen V = ${volume} cm³. Berechne die Dichte ρ auf zwei Nachkommastellen.`,
                given: [`m = ${fmt(mass, 1)} g`, `V = ${volume} cm³`],
                formulaHint: "ρ = m / V",
                fields: [
                  withSlips(
                    numberField("ρ =", rho, "g/cm³", 2),
                    [round(volume / mass, 2), "Du hast V / m statt m / V gerechnet."],
                    [round(mass * volume, 2), "Masse durch Volumen teilen, nicht multiplizieren."],
                  ),
                ],
                steps: [
                  "Formel für die Dichte aufstellen: ρ = m / V.",
                  `Werte einsetzen: ρ = ${fmt(mass, 1)} g / ${volume} cm³ = ${fmt(rho, 2)} g/cm³.`,
                  `<strong>ρ = ${fmt(rho, 2)} g/cm³</strong>`,
                ],
              };
            }
            // Level 2: Transfer — berechne Masse m aus Dichte und Volumen oder Volumen V aus Masse und Dichte
            const askVolume = rng.int(0, 1) === 1;
            if (askVolume) {
              const vCalc = round(mass / sample.density, 1);
              return {
                prompt: `Eine Probe aus reinem <strong>${sample.name}</strong> (Dichte ρ = ${fmt(sample.density, 2)} g/cm³) hat die Masse m = ${fmt(mass, 1)} g. Welches Volumen V in cm³ nimmt diese Stoffportion ein? Runde auf eine Nachkommastelle.`,
                given: [],
                formulaHint: "ρ = m / V nach V umstellen: V = m / ρ",
                fields: [
                  withSlips(
                    numberField("V =", vCalc, "cm³", 1),
                    [round(mass * sample.density, 1), "Stelle ρ = m / V nach V um: V = m / ρ (dividieren, nicht multiplizieren)."],
                    [round(sample.density / mass, 2), "Teile die Masse m durch die Dichte ρ, nicht umgekehrt."],
                  ),
                ],
                steps: [
                  "Aus ρ = m / V folgt durch Umstellen: V = m / ρ.",
                  `V = ${fmt(mass, 1)} g / ${fmt(sample.density, 2)} g/cm³ = ${fmt(vCalc, 1)} cm³.`,
                  `<strong>V = ${fmt(vCalc, 1)} cm³</strong>`,
                ],
              };
            }
            const mCalc = round(sample.density * volume, 1);
            return {
              prompt: `Im Messzylinder befinden sich V = ${volume} cm³ (bzw. ein massiver Körper mit V = ${volume} cm³) aus <strong>${sample.name}</strong> mit der Dichte ρ = ${fmt(sample.density, 2)} g/cm³. Berechne die Masse m der Probe in Gramm (auf eine Nachkommastelle).`,
              given: [],
              formulaHint: "ρ = m / V nach m umstellen: m = ρ · V",
              fields: [
                withSlips(
                  numberField("m =", mCalc, "g", 1),
                  [round(volume / sample.density, 1), "Multipliziere Dichte und Volumen: m = ρ · V."],
                  [round(sample.density / volume, 2), "Multipliziere ρ · V statt zu dividieren."],
                ),
              ],
              steps: [
                "Aus ρ = m / V folgt durch Umstellen: m = ρ · V.",
                `m = ${fmt(sample.density, 2)} g/cm³ · ${volume} cm³ = ${fmt(mCalc, 1)} g.`,
                `<strong>m = ${fmt(mCalc, 1)} g</strong>`,
              ],
            };
          },
        },
        cases(
          "sinne-kenngroessen",
          [
            cc(
              "Welche Eigenschaft ist eine von der Portionsgröße unabhängige Kenngröße eines Reinstoffs?",
              "Die Dichte ρ bei 20 °C",
              ["Die Masse m eines Probestücks", "Das Volumen V in einem Becherglas"],
              "Masse und Volumen verdoppeln sich mit der Portionsgröße; ihr Quotient ρ = m / V bleibt für den Reinstoff konstant.",
              "Was bleibt gleich, wenn du einen Eisenblock halbierst?",
            ),
            cc(
              "Wie unterscheidet sich Kochsalz (Natriumchlorid) bei der Leitfähigkeitsprüfung von Kupfer?",
              "Kupfer leitet fest und flüssig; Kochsalz leitet im festen Zustand nicht, wohl aber als Schmelze oder wässrige Lösung.",
              ["Kochsalz leitet nur als trockener Kristall, nicht gelöst.", "Weder Kupfer noch geschmolzenes Kochsalz leiten elektrischen Strom."],
              "Im festen Salzkristall sitzen die Ionen fest im Gitter; erst beim Schmelzen oder Lösen werden sie beweglich.",
              "Wann sind die Ladungsträger in einem Salz beweglich?",
            ),
          ],
          [
            cc(
              "Ein silbrig glänzender Ring hat m = 10,8 g und verdrängt V = 4,0 cm³ Wasser. Der Verkäufer behauptet, es sei reines Silber (ρ = 10,5 g/cm³). Was ergibt deine Überprüfung?",
              "Die gemessene Dichte beträgt nur 2,7 g/cm³ (typisch für Aluminium) — der Ring besteht nicht aus reinem Silber.",
              ["Der Ring besteht aus reinem Silber, weil die Farbe silbrig glänzt.", "Die Dichte lässt sich erst nach dem Einschmelzen des Rings berechnen."],
              "Mit ρ = 10,8 g / 4,0 cm³ = 2,7 g/cm³ entlarvt das Archimedische Prinzip die Täuschung zerstörungsfrei.",
              "Berechne ρ = m / V und vergleiche mit 10,5 g/cm³.",
            ),
            cc(
              "Warum genügt die Löslichkeit in Wasser allein nicht, um Puderzucker und feines Kochsalz zu unterscheiden?",
              "Beide weißen Feststoffe lösen sich gut in Wasser; erst Leitfähigkeit der Lösung oder Schmelztemperatur trennt sie eindeutig.",
              ["Weil sich weder Zucker noch Kochsalz in Wasser lösen.", "Weil Zuckerlösung und Salzwasser unterschiedliche Farben haben."],
              "Zur sicheren Stoffidentifizierung kombiniert man mehrere unabhängige Kenngrößen.",
              "Wie verhalten sich Salzwasser und Zuckerwasser bei der Leitfähigkeitsprüfung?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, 2, {
      id: "ch-nachweisreaktionen",
      title: "Nachweisreaktionen für Gase und Wasser",
      subtitle: "Glimmspan-, Knallgas- und Kalkwasserprobe sowie Wassernachweis durchführen",
      bindings: { I: 2 },
      why: "Sauerstoff, Wasserstoff und Kohlenstoffdioxid sind alle drei farblos und geruchlos — erst gezielte Nachweisreaktionen machen sie unterscheidbar.",
      html: "<p>Wenn bei einem Experiment ein farbloses Gas entsteht oder eine farblose Flüssigkeit kondensiert, identifizierst du den Stoff mithilfe einer spezifischen <strong>Nachweisreaktion</strong>:</p><ul><li><strong>Sauerstoff (O<sub>2</sub>) — Glimmspanprobe:</strong> Einen nur noch glimmenden Holzspan in das Reagenzglas einführen → der Span <strong>flammt hell wieder auf</strong> (Sauerstoff wirkt brandfördernd).</li><li><strong>Wasserstoff (H<sub>2</sub>) — Knallgasprobe:</strong> Gas im Reagenzglas mit der Öffnung nach unten (H<sub>2</sub> hat eine viel geringere Dichte als Luft!) auffangen und an eine Flamme nähern → ein <strong>pfeifendes Geräusch</strong> zeigt ein Wasserstoff-Luft-Gemisch an, ein leises ‚Plopp‘ fast reinen Wasserstoff.</li><li><strong>Kohlenstoffdioxid (CO<sub>2</sub>) — Kalkwasserprobe:</strong> Das Gas in klares Kalkwasser (Calciumhydroxidlösung) einleiten → es entsteht ein <strong>weißer Niederschlag (milchige Trübung)</strong>.</li><li><strong>Wasser (H<sub>2</sub>O) — Nachweisreagenz:</strong> Einen Tropfen auf <strong>weißes, wasserfreies Kupfersulfat</strong> geben → <strong>Blaufärbung</strong> unter Erwärmung (alternativ färbt sich blaues Cobaltchloridpapier mit Wasser rosa).</li></ul><div class=\"example\"><strong>Beispiel:</strong> Beim Ausatmen durch einen Trinkhalm in klares Kalkwasser trübt sich die Lösung weiß — die Ausatemluft enthält nachweislich Kohlenstoffdioxid.</div>",
      rule: "O<sub>2</sub> → Glimmspan flammt auf · H<sub>2</sub> → Knallgasprobe (Pfeifen / ‚Plopp‘) · CO<sub>2</sub> → Kalkwasser trübt sich weiß · H<sub>2</sub>O → weißes Kupfersulfat wird blau",
      terms: [
        ["Glimmspanprobe", "Nachweis für Sauerstoff (O<sub>2</sub>)", "glimmender Holzspan flammt hell auf"],
        ["Knallgasprobe", "Nachweis für Wasserstoff (H<sub>2</sub>)", "Reagenzglas Öffnung nach unten an Flamme → Pfeifen / ‚Plopp‘"],
        ["Kalkwasserprobe", "Nachweis für Kohlenstoffdioxid (CO<sub>2</sub>)", "klares Kalkwasser bildet weißen Niederschlag"],
        ["Wassernachweis", "weißes, wasserfreies Kupfersulfat → blau", "spezifisch für Wasser, nicht für Benzin/Öl"],
      ],
      quiz: [
        "Warum hältst du das Reagenzglas beim Auffangen von Wasserstoff für die Knallgasprobe mit der Öffnung nach unten?",
        "Wasserstoff besitzt eine deutlich geringere Dichte als Luft und steigt deshalb nach oben ins Glas.",
        "Wasserstoff ist schwerer als Luft und würde sonst durch den Glasboden diffundieren.",
        "Mit ρ(H₂) ≈ 0,09 g/l gegenüber ρ(Luft) ≈ 1,29 g/l steigt Wasserstoff nach oben und bleibt im umgedrehten Reagenzglas gefangen.",
      ],
      lab: makeLab("nachweise"),
      exercises: [
        cases(
          "gasnachweise-durchfuehrung",
          [
            cc(
              "Welches Gas weist du nach, wenn ein glimmender Holzspan beim Eintauchen in das Reagenzglas sofort hell aufflammt?",
              "Sauerstoff (O₂)",
              ["Kohlenstoffdioxid (CO₂)", "Stickstoff (N₂)"],
              "Reiner Sauerstoff fördert die Verbrennung stark und lässt den glimmenden Span wieder entflammen.",
              "Welches Gas wirkt brandfördernd?",
            ),
            cc(
              "Was beobachtest du, wenn Kohlenstoffdioxid in klares Kalkwasser eingeleitet wird?",
              "Es bildet sich eine weiße, milchige Trübung (feiner weißer Niederschlag).",
              ["Die Lösung färbt sich tiefviolett und siedet.", "Ein glimmender Span flammt in der Flüssigkeit auf."],
              "Kohlenstoffdioxid reagiert mit Calciumhydroxidlösung zu schwer löslichem, weißem Calciumcarbonat.",
              "Wie sieht Kalkwasser nach positivem CO₂-Nachweis aus?",
            ),
            cc(
              "Mit welchem Nachweisreagenz prüfst du im Schullabor eindeutig, ob flüssige Tropfen am Reagenzglasrand wirklich aus Wasser bestehen?",
              "Mit weißem, wasserfreiem Kupfersulfat, das sich bei Kontakt mit Wasser blau färbt.",
              ["Mit einem Hufeisenmagneten von außen.", "Durch eine Geschmacksprobe mit dem Finger."],
              "Wasserfreies Kupfersulfat ist weiß und bildet speziell mit Wasser blaues wasserhaltiges Kupfersulfat.",
              "Welche Farbänderung zeigt das Nachweisreagenz für Wasser?",
            ),
          ],
          [
            cc(
              "Bei einer Elektrolyse willst du ein Reagenzglas mit abgeleitetem Wasserstoff an einer offenen Apparatur direkt entzünden. Warum führst du vorher zwingend die Knallgasprobe im kleinen Reagenzglas durch?",
              "Ein pfeifender Ton warnt vor explosivem Wasserstoff-Luft-Gemisch; erst beim leisen ‚Plopp‘ ist die Luft vollständig verdrängt.",
              ["Um die Temperatur des Gases auf 500 °C vorzuheizen.", "Weil reiner Wasserstoff überhaupt nicht brennbar ist."],
              "Solange noch Luftsauerstoff beigemischt ist, würde beim Entzünden an der Apparatur eine Rückschlag-Explosion drohen.",
              "Unterscheide positive, laute Knallgasprobe (Gemisch) und ruhiges Abbrennen (reines H₂).",
            ),
            cc(
              "Du führst einen glimmenden Holzspan in ein unbekanntes farbloses Gas ein, und die Glut erlischt sofort. Darfst du daraus allein schließen, dass es sich sicher um Kohlenstoffdioxid handelt?",
              "Nein — auch in Stickstoff oder Argon erlischt der Span; für CO₂ ist zusätzlich die Kalkwasserprobe nötig.",
              ["Ja, denn Kohlenstoffdioxid ist das einzige Gas, in dem ein Span erlischt.", "Nein, denn in Kohlenstoffdioxid müsste der Span hell aufflammen."],
              "Das Erlöschen zeigt nur das Fehlen eines brandfördernden Gases; erst die weiße Trübung von Kalkwasser beweist CO₂ spezifisch.",
              "Welches Hauptbestandteil-Gas der Luft erstickt eine Flamme ebenfalls?",
            ),
          ],
        ),
        cases(
          "nachweise-kombination",
          [
            cc(
              "Beim Verbrennen einer Kerze hältst du ein kaltes Becherglas kurz über die Flamme. Innen bildet sich ein Beschlag, der weißes Kupfersulfat blau färbt. Was ist nachgewiesen?",
              "Bei der Verbrennung von Kerzenwachs entsteht Wasser.",
              ["Das Kerzenwachs besteht aus reinem Kupfer.", "Die Flamme verbraucht Stickstoff."],
              "Kondensierender Dampf, der weißes wasserfreies Kupfersulfat blau färbt, ist eindeutig Wasser.",
              "Welchen Stoff weist die Blaufärbung von wasserfreiem Kupfersulfat nach?",
            ),
            cc(
              "Wie unterscheidest du drei beschriftungslose Gasstandzylinder mit Luft, Sauerstoff und Kohlenstoffdioxid in zwei Schritten?",
              "Glimmspanprobe (flammt in O₂ auf, brennt in Luft kurz weiter, erlischt in CO₂) und Bestätigung von CO₂ mit Kalkwasser.",
              ["Alle drei Zylinder wiegen gleich viel und lassen sich nicht unterscheiden.", "Knallgasprobe an allen drei Zylindern durchführen."],
              "Sauerstoff liefert eine positive Glimmspanprobe; Kalkwasser bestätigt eindeutig Kohlenstoffdioxid gegenüber Luft.",
              "Kombiniere Glimmspanprobe und Kalkwasserprobe.",
            ),
          ],
          [
            cc(
              "Eine farblose Flüssigkeit siedet bei etwa 78 °C und verändert die Farbe von weißem, wasserfreiem Kupfersulfat nicht. Welche Schlussfolgerung passt?",
              "Es handelt sich um eine wasserfreie Flüssigkeit (z. B. reines Ethanol), nicht um Wasser.",
              ["Es handelt sich um destilliertes Wasser, weil es farblos ist.", "Das Reagenz weist nur Gase nach, niemals Flüssigkeiten."],
              "Sowohl die Siedetemperatur (78 °C ≠ 100 °C) als auch der negative Wassernachweis schließen Wasser aus.",
              "Prüfe sowohl die Kenngröße θ_B als auch das Nachweisergebnis.",
            ),
            cc(
              "Bei der Zersetzung eines weißen Pulvers beim Erhitzen trübt das entweichende Gas Kalkwasser milchig weiß, während am oberen kühlen Glasrand Tropfen kondensieren, die weißes Kupfersulfat blau färben. Welche Produkte sind entstanden?",
              "Kohlenstoffdioxid und Wasser",
              ["Wasserstoff und Sauerstoff", "Stickstoff und Ethanol"],
              "Kalkwassertrübung beweist CO₂, Blaufärbung von weißem Kupfersulfat beweist H₂O.",
              "Ordne jedem der beiden Nachweise sein Reaktionsprodukt zu.",
            ),
          ],
        ),
      ],
    }),
    lesson(id, 3, {
      id: "ch-reinstoffe-gemische",
      title: "Reinstoffe sowie homogene und heterogene Gemische",
      subtitle: "Konstante Siedetemperatur vs. Siedebereich, Mischungsarten im Alltag",
      bindings: { I: 2 },
      why: "Ob Leitungswasser, Milch, Nebel oder Messing: Fast alles im Alltag ist ein Stoffgemisch mit veränderbaren Eigenschaften.",
      html: "<p>Ein <strong>Reinstoff</strong> besteht nur aus einer einzigen Stoffart und besitzt bei gegebenem Druck <strong>konstante Kenngrößen</strong> — etwa einen scharfen Schmelz- und Siedepunkt (destilliertes Wasser siedet bei Normaldruck konstant bei 100 °C). Ein <strong>Stoffgemisch</strong> besteht aus mindestens zwei Reinstoffen, deren Mengenverhältnis variieren kann. Deshalb besitzt ein Gemisch <strong>veränderbare Eigenschaften</strong> und statt eines festen Siedepunkts einen <strong>Siedebereich</strong> (Salzwasser beginnt erst oberhalb von 100 °C zu sieden, und die Temperatur steigt beim Eindampfen weiter an).</p><p>Nach dem Erscheinungsbild teilst du Gemische ein in:</p><ul><li><strong>Homogene Gemische</strong> (einheitlich, auch unter dem Lichtmikroskop keine Phasengrenzen erkennbar): <em>Gasgemisch</em> (saubere Luft), <em>Lösung</em> (Salzwasser, Zuckerwasser), <em>Legierung</em> (Messing aus Kupfer und Zink, Bronze).</li><li><strong>Heterogene Gemische</strong> (uneinheitlich, Phasen unterscheidbar): <em>Gemenge</em> (fest/fest, z.&nbsp;B. Granit, Müsli, Eisen-Schwefel-Pulver), <em>Suspension</em> (fest/flüssig, z.&nbsp;B. Sandwasser, Schlamm), <em>Emulsion</em> (flüssig/flüssig, z.&nbsp;B. Milch, Öl-Essig), <em>Rauch</em> (fest/gasförmig), <em>Nebel</em> (flüssig/gasförmig), <em>Schaum</em> (gasförmig/flüssig oder fest).</li></ul><div class=\"example\"><strong>Beispiel:</strong> Klare Apfelschorle ist bezüglich Wasser und gelöstem Zucker eine homogene Lösung, aufsteigende CO<sub>2</sub>-Bläschen bilden darin kurzzeitig ein heterogenes Gas-Flüssig-Gemisch.</div>",
      rule: "Reinstoff: 1 Stoffart, konstante Kenngrößen (fester Siedepunkt) · Gemisch: ≥ 2 Reinstoffe, veränderbare Kenngrößen (Siedebereich), homogen oder heterogen",
      terms: [
        ["Homogene Gemische", "Lösung, Gasgemisch, Legierung", "nur eine Phase sichtbar"],
        ["Heterogene Gemische", "Gemenge (f/f) · Suspension (f/fl) · Emulsion (fl/fl) · Nebel (fl/g) · Rauch (f/g)", "mehrere Phasen erkennbar"],
        ["Massenanteil", "w(Stoff) = m(Stoff) / m(Gemisch)", "als Dezimalzahl oder in Prozent"],
      ],
      quiz: [
        "Woran erkennst du im Temperatur-Zeit-Diagramm beim Sieden, dass eine klare Flüssigkeit Salzwasser (Gemisch) und kein destilliertes Wasser (Reinstoff) ist?",
        "Die Flüssigkeit siedet erst oberhalb von 100 °C und ihre Temperatur steigt während des Siedens weiter an (Siedebereich).",
        "Die Flüssigkeit siedet exakt und waagrecht bei 100,0 °C, bis der letzte Tropfen verdampft ist.",
        "Reinstoffe haben einen konstanten Siedepunkt; Lösungen zeigen Siedepunktserhöhung und einen ansteigenden Siedebereich.",
      ],
      lab: makeLab("siedekurve"),
      exercises: [
        {
          id: "massenanteil-gemisch",
          make(rng, level) {
            const saltG = rng.pick([5, 8, 10, 12, 15, 20, 25, 30]);
            const totalG = rng.pick([100, 200, 250]);
            const waterG = totalG - saltG;
            const pct = round((saltG / totalG) * 100, 1);
            if (level === 1) {
              return {
                prompt: `Du stellst eine homogene Salzlösung her, indem du m(Salz) = ${saltG} g Kochsalz in m(Wasser) = ${waterG} g destilliertem Wasser vollständig auflöst. Wie viel Prozent beträgt der Massenanteil w(Salz) in der Lösung?`,
                given: [`m(Salz) = ${saltG} g`, `m(Wasser) = ${waterG} g`, `m(Lösung) = ${totalG} g`],
                formulaHint: "w(Salz) = m(Salz) / (m(Salz) + m(Wasser)) · 100 %",
                fields: [
                  withSlips(
                    numberField("w(Salz) =", pct, "%", 1),
                    [round((saltG / waterG) * 100, 1), "Teile durch die Gesamtmasse der Lösung (Salz + Wasser), nicht nur durch die Wassermasse."],
                    [saltG, "Rechne auf 100 g Gesamtlösung um: m(Salz) / m(Lösung) · 100 %."],
                  ),
                ],
                steps: [
                  `Gesamtmasse der Lösung: m(Lösung) = ${saltG} g + ${waterG} g = ${totalG} g.`,
                  `Massenanteil: w = ${saltG} g / ${totalG} g · 100 % = ${fmt(pct, 1)} %.`,
                  `<strong>w(Salz) = ${fmt(pct, 1)} %</strong>`,
                ],
              };
            }
            return {
              prompt: `Für einen Siedebereichs-Versuch benötigst du m(Lösung) = ${totalG} g einer Kochsalzlösung mit einem Massenanteil von w(Salz) = ${fmt(pct, 1)} %. Welche Masse m(Wasser) an destilliertem Wasser musst du zum abgewogenen Salz geben?`,
              given: [],
              formulaHint: "Erst m(Salz) = w · m(Lösung), dann m(Wasser) = m(Lösung) − m(Salz)",
              fields: [
                withSlips(
                  numberField("m(Wasser) =", waterG, "g", 0),
                  [saltG, `Das ist die Salzmasse (${saltG} g) — gefragt ist die Masse des Wassers.`],
                  [totalG, `Ziehe die Salzmasse (${saltG} g) von der Gesamtmasse (${totalG} g) ab.`],
                ),
              ],
              steps: [
                `Salzmasse berechnen: m(Salz) = ${fmt(pct / 100, 3)} · ${totalG} g = ${saltG} g.`,
                `Wassermasse berechnen: m(Wasser) = ${totalG} g − ${saltG} g = ${waterG} g.`,
                `<strong>m(Wasser) = ${waterG} g</strong>`,
              ],
            };
          },
        },
        cases(
          "reinstoff-gemisch",
          [
            cc(
              "Welcher Fachbegriff beschreibt ein heterogenes Gemisch aus einem unlöslichen Feststoff in einer Flüssigkeit (z. B. Kreidepulver in Wasser)?",
              "Suspension",
              ["Emulsion", "Legierung"],
              "Feststoffteilchen in einer Flüssigkeit bilden eine Suspension; zwei nicht mischbare Flüssigkeiten bilden eine Emulsion.",
              "Feststoff in Flüssigkeit = ?",
            ),
            cc(
              "Welcher Gemischart ordnest du Milch (feinste Fetttröpfchen in Wasser verteilt) zu?",
              "Emulsion (heterogenes Gemisch zweier Flüssigkeiten)",
              ["Homogene Lösung", "Gemenge zweier Feststoffe"],
              "Unter dem Mikroskop erkennt man die einzelnen Fetttröpfchen in der wässrigen Phase: flüssig in flüssig = Emulsion.",
              "Fetttröpfchen (flüssig) in Wasser (flüssig).",
            ),
            cc(
              "Was ist Messing (ein zusammengeschmolzener Werkstoff aus Kupfer und Zink)?",
              "Eine Legierung, also ein homogenes Feststoffgemisch aus Metallen.",
              ["Ein Reinstoff mit eigenem Elementsymbol.", "Ein Rauch aus Metalloxidteilchen in Luft."],
              "Legierungen sind homogene Mischungen zweier oder mehrerer Metalle mit einstellbarer Härte und Schmelztemperatur.",
              "Wie nennt man homogene Metallmischungen?",
            ),
          ],
          [
            cc(
              "Auf einer Flasche Mineralwasser steht ‚100 % natürlich‘. Warum ist Mineralwasser im Sinn der Chemie dennoch kein Reinstoff?",
              "Es enthält neben Wasser verschiedene gelöste Mineralsalze und oft Kohlenstoffdioxid — ist also ein Stoffgemisch.",
              ["Weil natürliches Wasser überhaupt keine H₂O-Moleküle enthält.", "Weil Flüssigkeiten grundsätzlich niemals Reinstoffe sein können."],
              "Im Alltag meint ‚rein/natürlich‘ frei von Schadstoffen; in der Chemie bedeutet ‚Reinstoff‘ genau eine einzige Stoffart.",
              "Bleibt beim Eindampfen von Mineralwasser ein Salzrückstand übrig?",
            ),
            cc(
              "Dichter Küstennebel schränkt die Sicht ein. Aus welchen Phasen besteht Nebel?",
              "Feinste Flüssigkeitströpfchen in einem Gas (heterogenes Gemisch flüssig/gasförmig).",
              ["Feststoffpartikel in einer Flüssigkeit (Suspension).", "Homogenes Gasgemisch aus reinem Wasserdampf."],
              "Reiner Wasserdampf ist unsichtbar; sichtbar sind kondensierte Wassertröpfchen in der Luft (Nebel), während Feststoff in Gas Rauch heißt.",
              "Warum sieht man Nebel, reinen Wasserdampf aber nicht?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, 4, {
      id: "ch-teilchenmodell-phasen",
      title: "Teilchenmodell und Aggregatzustandsänderungen",
      subtitle: "Abstand, Bewegung und Anziehung in fest, flüssig und gasförmig",
      bindings: { I: 2 },
      why: "Ein einziges Modell aus kleinsten, bewegten Kugeln erklärt Schmelzen, Sieden, Sublimieren und warum sich Duftstoffe im Raum verteilen.",
      html: "<p>Nach dem <strong>Teilchenmodell</strong> bestehen alle Stoffe aus winzigen Teilchen (im Modell als starre Kugeln gezeichnet), zwischen denen <strong>leerer Raum</strong> liegt, <strong>Anziehungskräfte</strong> wirken und die sich umso heftiger bewegen, je höher die <strong>Temperatur</strong> ist. Bei allen physikalischen Vorgängen bleiben die Teilchen selbst unverändert!</p><ul><li><strong>Fest (s):</strong> Teilchen sitzen dicht gepackt an festen Plätzen im regelmäßigen Gitter, starke Anziehung, sie schwingen nur um ihre Ruhelage → feste Form, festes Volumen.</li><li><strong>Flüssig (l):</strong> Teilchen liegen noch dicht beieinander, können ihre Plätze aber wechseln (mittlere Anziehung) → festes Volumen, veränderbare Gestalt, selbstständige Durchmischung (<strong>Diffusion</strong>).</li><li><strong>Gasförmig (g):</strong> Große Teilchenabstände, kaum noch wirksame Anziehung, schnelle geradlinige Bewegung in alle Richtungen → weder feste Form noch festes Volumen, gut komprimierbar.</li></ul><p>Die sechs Phasenübergänge heißen <strong>Schmelzen</strong> (s → l) / <strong>Erstarren</strong> (l → s), <strong>Verdampfen bzw. Sieden</strong> (l → g) / <strong>Kondensieren</strong> (g → l) sowie direkt zwischen fest und gasförmig <strong>Sublimieren</strong> (s → g, z.&nbsp;B. Trockeneis oder Iod) und <strong>Resublimieren</strong> (g → s, z.&nbsp;B. Raureif).</p><div class=\"example\"><strong>Beispiel:</strong> Ethanol schmilzt bei −114 °C und siedet bei 78 °C. Bei −50 °C liegt Ethanol flüssig vor, weil −114 °C &lt; −50 °C &lt; 78 °C gilt.</div>",
      rule: "Höhere Temperatur → schnellere Teilchenbewegung · Schmelzen/Sieden überwindet Anziehungskräfte, die Teilchen selbst ändern weder Größe noch Masse",
      terms: [
        ["fest ↔ flüssig", "Schmelzen (Wärmezufuhr) · Erstarren (Wärmeabgabe)", "bei der Schmelztemperatur θ<sub>S</sub>"],
        ["flüssig ↔ gasförmig", "Verdampfen / Sieden · Kondensieren", "Sieden im gesamten Volumen bei θ<sub>B</sub>"],
        ["fest ↔ gasförmig", "Sublimieren (fest → gasförmig) · Resublimieren (gasförmig → fest)", "z. B. Iodkristalle, Trockeneis (CO<sub>2</sub>)"],
      ],
      quiz: [
        "Ein geschlossener Kolben mit einem Gas wird erwärmt und dehnt sich aus. Was passiert dabei auf der Teilchenebene?",
        "Die Teilchen bewegen sich schneller und ihre mittleren Abstände vergrößern sich; die einzelnen Teilchen bleiben gleich groß.",
        "Jedes einzelne Gasteilchen bläht sich durch die Wärme auf das doppelte Volumen auf.",
        "Teilchen selbst dehnen sich nicht aus — nur ihre Bewegungsenergie und der leere Raum zwischen ihnen nehmen zu.",
      ],
      lab: makeLab("teilchenmodell"),
      exercises: [
        {
          id: "temperaturspanne",
          make(rng, level) {
            const subItem = rng.pick([
              { name: "Ethanol", mp: -114, bp: 78 },
              { name: "Quecksilber", mp: -39, bp: 357 },
              { name: "Brom", mp: -7, bp: 59 },
              { name: "Ammoniak", mp: -78, bp: -33 },
              { name: "Wasser", mp: 0, bp: 100 },
            ]);
            const spanLiquid = subItem.bp - subItem.mp;
            if (level === 1) {
              return {
                prompt: `<strong>${subItem.name}</strong> besitzt bei Normaldruck die Schmelztemperatur θ<sub>S</sub> = ${fmtTemp(subItem.mp)} und die Siedetemperatur θ<sub>B</sub> = ${fmtTemp(subItem.bp)}. Über welche Temperaturspanne Δθ (in °C) liegt ${subItem.name} flüssig vor?`,
                given: [`θ<sub>S</sub> = ${fmtTemp(subItem.mp)}`, `θ<sub>B</sub> = ${fmtTemp(subItem.bp)}`],
                formulaHint: "Δθ = θ_B − θ_S (Vorzeichen beachten!)",
                fields: [
                  withSlips(
                    numberField("Δθ =", spanLiquid, "°C", 0),
                    [Math.abs(Math.abs(subItem.bp) - Math.abs(subItem.mp)), "Vorsicht beim Minuszeichen: θ_B − (−|θ_S|) = θ_B + |θ_S|."],
                    [-spanLiquid, "Eine Temperaturspanne Δθ = θ_B − θ_S ist positiv."],
                  ),
                ],
                steps: [
                  `Ansatz: Δθ = θ_B − θ_S.`,
                  `Einsetzen: Δθ = ${fmtTemp(subItem.bp)} − (${fmtTemp(subItem.mp)}) = ${spanLiquid} °C.`,
                  `<strong>Δθ = ${spanLiquid} °C</strong>`,
                ],
              };
            }
            const tStart = rng.int(subItem.mp - 35, subItem.mp - 10);
            const deltaToBoil = subItem.bp - tStart;
            return {
              prompt: `Eine Probe aus festem <strong>${subItem.name}</strong> (θ<sub>S</sub> = ${fmtTemp(subItem.mp)}, θ<sub>B</sub> = ${fmtTemp(subItem.bp)}) hat aktuell die Temperatur θ<sub>1</sub> = ${fmtTemp(tStart)}. Um wie viele Grad Celsius Δθ muss die Probe mindestens erwärmt werden, damit die Siedetemperatur erreicht wird?`,
              given: [],
              formulaHint: "Δθ = θ_B − θ_1",
              fields: [
                withSlips(
                  numberField("Δθ =", deltaToBoil, "°C", 0),
                  [Math.abs(subItem.bp + tStart), "Achte auf das negative Vorzeichen der Starttemperatur: Minus mal Minus ergibt Plus."],
                  [subItem.mp - tStart, "Das erwärmt nur bis zur Schmelztemperatur θ_S — gefragt ist die Erwärmung bis zur Siedetemperatur θ_B."],
                ),
              ],
              steps: [
                `Gesucht ist der Temperaturunterschied von θ_1 = ${fmtTemp(tStart)} bis θ_B = ${fmtTemp(subItem.bp)}.`,
                `Δθ = ${fmtTemp(subItem.bp)} − (${fmtTemp(tStart)}) = ${deltaToBoil} °C.`,
                `<strong>Δθ = ${deltaToBoil} °C</strong>`,
              ],
            };
          },
        },
        cases(
          "phasen-diffusion",
          [
            cc(
              "Wie heißt der direkte Phasenübergang eines Stoffes vom festen in den gasförmigen Zustand ohne Schmelze?",
              "Sublimieren (Sublimation)",
              ["Kondensieren", "Erstarren"],
              `Stoffe wie ${PHASE_SUBSTANCES[2].name} oder ${PHASE_SUBSTANCES[3].name} gehen beim Erwärmen im offenen Gefäß direkt in den Gaszustand über.`,
              "Fest → gasförmig ohne flüssige Zwischenstufe.",
            ),
            cc(
              "Im Winter bildet sich an kalten Zweigen aus dem Wasserdampf der Luft direkt fester Raureif. Welcher Phasenübergang liegt vor?",
              "Resublimieren (Resublimation)",
              ["Schmelzen", "Verdampfen"],
              "Der Übergang direkt von gasförmig zu fest ist die Umkehrung der Sublimation und heißt Resublimation.",
              "Gasförmig → fest.",
            ),
          ],
          [
            cc(
              "Ein Kristall Kaliumpermanganat färbt heißes Wasser viel schneller gleichmäßig violett als kaltes Wasser, obwohl nicht umgerührt wird. Wie erklärst du das mit dem Teilchenmodell?",
              "Bei höherer Temperatur bewegen sich die Wassermoleküle schneller und verteilen die gelösten Teilchen durch Stöße rascher (schnellere Diffusion).",
              ["In heißem Wasser verschwinden die Anziehungskräfte vollständig wie im Vakuum.", "Die violetten Teilchen vermehren sich durch die Wärme."],
              "Diffusion beruht auf der Eigenbewegung der Teilchen, die mit steigender Temperatur zunimmt.",
              "Wie hängt die Teilchengeschwindigkeit mit der Temperatur zusammen?",
            ),
            cc(
              "Mischt man 50 ml Ethanol und 50 ml Wasser, beträgt das Gesamtvolumen nur rund 96 ml statt 100 ml. Wie deutet das Teilchenmodell diese Volumenkontraktion?",
              "Unterschiedlich große Moleküle lagern sich in die freien Zwischenräume zwischen den jeweils anderen Teilchen ein.",
              ["Ein Teil der Moleküle wird beim Mischen vernichtet; die Gesamtmasse sinkt.", "Das Glasgefäß dehnt sich durch die Flüssigkeit aus."],
              "Die Gesamtmasse bleibt exakt erhalten; kleinere Teilchen füllen Lücken zwischen größeren (Modellversuch: Erbsen und Senfkörner).",
              "Denke an den Modellversuch mit großen Erbsen und kleinen Senfkörnern!",
            ),
          ],
        ),
      ],
    }),
    lesson(id, 5, {
      id: "ch-trennverfahren",
      title: "Physikalische Trennverfahren",
      subtitle: "Filtration, Destillation, Magnetscheiden und Extraktion gezielt kombinieren",
      bindings: { I: 2 },
      why: "Von der Trinkwasseraufbereitung bis zum Kaffeekochen: Jedes Trennverfahren nutzt genau eine Stoffeigenschaft, in der sich die Gemischbestandteile unterscheiden.",
      html: "<p>Stoffgemische lassen sich durch <strong>physikalische Trennverfahren</strong> wieder in ihre Reinstoffe zerlegen, ohne dass neue Stoffe entstehen. Entscheidend ist die ausgenutzte <strong>Trenn-Eigenschaft</strong>:</p><ul><li><strong>Magnetscheiden:</strong> Trennt ferromagnetische Stoffe (Eisen, Cobalt, Nickel) von unmagnetischen Bestandteilen — z.&nbsp;B. Eisenpulver aus Schwefelpulver (Ausnutzung der <em>Magnetisierbarkeit</em>).</li><li><strong>Filtration:</strong> Trennt eine Suspension (Feststoff in Flüssigkeit). Im Teilchenmodell passieren die winzigen Flüssigkeitsmoleküle (und darin gelöste Teilchen!) die Filterporen als <strong>Filtrat</strong>, während die groben Feststoffkörner als <strong>Filterrückstand</strong> zurückbleiben (Ausnutzung der <em>Teilchen-/Korngröße</em>).</li><li><strong>Extraktion (Herauslösen):</strong> Ein geeignetes Lösungsmittel löst gezielt nur eine Komponente aus einem Gemisch heraus — z.&nbsp;B. Wasser löst Salz aus einem Sand-Salz-Gemenge (Ausnutzung der unterschiedlichen <em>Löslichkeit</em>).</li><li><strong>Destillation:</strong> Trennt eine Lösung oder ein Flüssigkeitsgemisch durch Verdampfen der leichter siedenden Komponente und anschließendes Kondensieren im Kühler zum <strong>Destillat</strong> (Ausnutzung unterschiedlicher <em>Siedetemperaturen</em>).</li></ul><div class=\"example\"><strong>Beispiel:</strong> Trennung eines Gemenges aus Eisenspänen, Sand und Kochsalz: 1. Magnetscheiden (Eisen abgetrennt) → 2. Extraktion mit Wasser (Salz löst sich) → 3. Filtration (Sand im Filter) → 4. Eindampfen/Destillation des Filtrats (reines Kochsalz im Kolben, destilliertes Wasser als Destillat).</div>",
      rule: "Magnetscheiden (Magnetisierbarkeit) · Filtration (Teilchengröße vs. Porengröße) · Extraktion (Löslichkeit) · Destillation (Siedetemperatur)",
      terms: [
        ["Filtration", "Suspension → Filterrückstand + klares Filtrat", "trennt keine gelösten Stoffe ab!"],
        ["Destillation", "Verdampfen + Kondensieren im Liebig-Kühler", "liefert das Destillat (niedriger siedender Stoff)"],
        ["Extraktion / Magnetscheiden", "Löslichkeit im Lösungsmittel / Ferromagnetismus", "oft erste Schritte bei Mehrstoffgemischen"],
      ],
      quiz: [
        "Warum lässt sich gelöstes Kochsalz aus Meerwasser nicht durch einfaches Filtrieren mit Filterpapier abtrennen?",
        "Die gelösten, hydratisierten Ionen sind ebenso winzig wie die Wassermoleküle und passen ungehindert durch die Filterporen.",
        "Kochsalz wird durch das Filterpapier magnetisch angezogen und verstopft den Trichter.",
        "Filtration trennt nur ungelöste Feststoffpartikel einer Suspension; gelöste Stoffe erfordern Eindampfen oder Destillation.",
      ],
      lab: makeLab("trennwerkstatt"),
      exercises: [
        {
          id: "trennausbeute",
          make(rng, level) {
            const mIron = rng.int(4, 12);
            const mSand = rng.int(10, 25);
            const mSalt = rng.int(6, 18);
            const mTotal = mIron + mSand + mSalt;
            if (level === 1) {
              return {
                prompt: `Ein trockenes Dreistoffgemenge wiegt insgesamt m(Gemisch) = ${mTotal} g. Durch Magnetscheiden gewinnst du m(Eisen) = ${mIron} g Eisen zurück; nach Zugabe von Wasser, Filtration und Trocknen bleiben m(Sand) = ${mSand} g Sand im Filter. Welche Masse m(Salz) bleibt beim vollständigen Eindampfen des Filtrats zurück (verlustfreies Arbeiten)?`,
                given: [`m(Gemisch) = ${mTotal} g`, `m(Eisen) = ${mIron} g`, `m(Sand) = ${mSand} g`],
                formulaHint: "m(Salz) = m(Gemisch) − m(Eisen) − m(Sand)",
                fields: [
                  withSlips(
                    numberField("m(Salz) =", mSalt, "g", 0),
                    [mTotal - mSand, "Ziehe auch die bereits mit dem Magneten abgetrennte Eisenmasse ab."],
                    [mIron + mSand, "Das ist die Summe aus Eisen und Sand — ziehe sie von der Gesamtmasse ab."],
                  ),
                ],
                steps: [
                  `Bereits abgetrennte Feststoffe: ${mIron} g + ${mSand} g = ${mIron + mSand} g.`,
                  `Im Filtrat gelöstes Salz: ${mTotal} g − ${mIron + mSand} g = ${mSalt} g.`,
                  `<strong>m(Salz) = ${mSalt} g</strong>`,
                ],
              };
            }
            const pctSalt = round((mSalt / mTotal) * 100, 1);
            return {
              prompt: `Bei der Trennung von m(Gemisch) = ${mTotal} g eines Gemenges aus Eisen (${mIron} g), Sand (${mSand} g) und Kochsalz dampfst du das klare Filtrat vollständig ein. Berechne den prozentualen Massenanteil w(Salz) im ursprünglichen Dreistoffgemisch auf eine Nachkommastelle.`,
              given: [],
              formulaHint: "Erst m(Salz) = m(Gemisch) − m(Eisen) − m(Sand), dann w(Salz) = m(Salz) / m(Gemisch) · 100 %",
              fields: [
                withSlips(
                  numberField("w(Salz) =", pctSalt, "%", 1),
                  [mSalt, "Gefragt ist der prozentuale Massenanteil w(Salz) in %, nicht die Masse in Gramm."],
                  [round(((mIron + mSand) / mTotal) * 100, 1), "Das ist der Anteil von Eisen und Sand — gesucht ist der Anteil von Kochsalz."],
                ),
              ],
              steps: [
                `Salzmasse bestimmen: m(Salz) = ${mTotal} g − ${mIron} g − ${mSand} g = ${mSalt} g.`,
                `Massenanteil berechnen: w(Salz) = ${mSalt} g / ${mTotal} g · 100 % = ${fmt(pctSalt, 1)} %.`,
                `<strong>w(Salz) = ${fmt(pctSalt, 1)} %</strong>`,
              ],
            };
          },
        },
        cases(
          "trennprinzipien",
          [
            cc(
              "Welche Stoffeigenschaft nutzt die Destillation von Rotwein oder Ethanol-Wasser-Gemischen aus?",
              "Die unterschiedlichen Siedetemperaturen der Gemischbestandteile (Ethanol 78 °C, Wasser 100 °C).",
              ["Die unterschiedliche Magnetisierbarkeit von Ethanol und Wasser.", "Die unterschiedliche Korngröße im trockenen Zustand."],
              "Beim vorsichtigen Erhitzen verdampft vorrangig das niedriger siedende Ethanol und kondensiert im Kühler als Destillat.",
              "Warum verdampft ein Stoff im Gemisch früher als der andere?",
            ),
            cc(
              "Beim Aufbrühen von Filterkaffee lösen sich Aroma- und Farbstoffe in heißem Wasser, während das Kaffeemehl im Papierfilter bleibt. Welche zwei Trennverfahren laufen nacheinander ab?",
              "Zuerst Extraktion (Herauslösen mit heißem Wasser), dann Filtration (Abtrennen des Kaffeesatzes).",
              ["Zuerst Magnetscheiden, dann Destillation.", "Zuerst Sublimation, dann Resublimation."],
              "Heißes Wasser extrahiert die wasserlöslichen Kaffeebestandteile; das Filterpapier hält das unlösliche Pulver zurück.",
              "1. Herauslösen aus dem Pulver → 2. Feststoff im Filter zurückhalten.",
            ),
          ],
          [
            cc(
              "Du willst aus Meerwasser auf einer Insel trinkbares Süßwasser gewinnen. Warum reicht bloßes Eindampfen in einer offenen Schale nicht aus?",
              "Beim offenen Eindampfen entweicht das reine Wasser als Dampf in die Luft und zurück bleibt nur das ungenießbare Salz — du brauchst eine Kondensation (Destillation).",
              ["Weil beim Eindampfen das Salz verdampft und das Wasser in der Schale bleibt.", "Weil Meerwasser überhaupt nicht zum Sieden gebracht werden kann."],
              "Um das Lösungsmittel Wasser aufzufangen, muss der Wasserdampf an einer kühlen Fläche wieder kondensieren.",
              "Welchen Teil des Gemisches möchtest du gewinnen: den Feststoff oder das Lösungsmittel?",
            ),
            cc(
              "Warum schließt man das Kühlwasser an einem Liebig-Kühler bei der Destillation stets nach dem Gegenstromprinzip (unten hinein, oben hinaus) an?",
              "Damit das Mantelrohr vollständig mit Kühlwasser gefüllt bleibt und der Dampf kurz vor dem Ausgang auf das kälteste Wasser trifft.",
              ["Damit sich das Kühlwasser mit dem Destillat im Innenrohr vermischt.", "Weil Wasser nur bergauf fließen kann."],
              "Gegenstrom sorgt für vollständige Füllung ohne Luftblasen und für maximale Kühlwirkung über die gesamte Kühlerlänge.",
              "Wo soll das Kühlwasser am kältesten sein?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, 6, {
      id: "ch-luft-linde",
      title: "Zusammensetzung der Luft und Linde-Verfahren",
      subtitle: "Gasgemisch Luft verflüssigen und durch fraktionierte Destillation zerlegen",
      bindings: { I: 2 },
      why: "Krankenhäuser brauchen reinen Sauerstoff, die Chipindustrie reinen Stickstoff und Schweißbetriebe Argon — der Rohstoff dafür umgibt uns überall kostenlos.",
      html: "<p>Trockene, saubere <strong>Luft</strong> ist kein Reinstoff, sondern ein <strong>homogenes Gasgemisch</strong>. Nach Volumenanteilen besteht sie aus rund <strong>78 % Stickstoff (N<sub>2</sub>)</strong>, <strong>21 % Sauerstoff (O<sub>2</sub>)</strong>, <strong>ca. 0,9 % Edelgasen</strong> (vor allem Argon, Ar) und <strong>ca. 0,04 % Kohlenstoffdioxid (CO<sub>2</sub>)</strong>.</p><p>Großtechnisch gewinnt man Stickstoff, Sauerstoff und Edelgase mit dem <strong>Linde-Verfahren</strong>:</p><ol><li><strong>Reinigung &amp; Trocknung:</strong> Staub, Wasserdampf und Kohlenstoffdioxid werden vorab abgetrennt, weil H<sub>2</sub>O und CO<sub>2</sub> beim starken Abkühlen fest werden und die Rohre verstopfen würden.</li><li><strong>Luftverflüssigung (Gegenstrom-Entspannung):</strong> Luft wird stark verdichtet (erwärmt sich), im Kühler abgekühlt und anschließend durch ein Drosselventil entspannt — dabei kühlt sie sich stark ab (Joule-Thomson-Effekt) und kühlt im Gegenstrom nachströmende Luft vor, bis unterhalb von −196 °C <strong>flüssige Luft</strong> entsteht.</li><li><strong>Fraktionierte Destillation:</strong> Beim langsamen Erwärmen in der Trennkolonne siedet zuerst <strong>Stickstoff (θ<sub>B</sub> = −196 °C)</strong> am Kolonnenkopf ab, während <strong>Argon (−186 °C)</strong> und <strong>Sauerstoff (θ<sub>B</sub> = −183 °C)</strong> länger flüssig im Sumpf zurückbleiben.</li></ol><div class=\"example\"><strong>Beispiel:</strong> Bei −190 °C gilt −196 °C &lt; −190 °C &lt; −186 °C &lt; −183 °C: Stickstoff ist bereits gasförmig, Argon und Sauerstoff sind noch flüssig!</div>",
      rule: "Trockene Luft: 78 % N<sub>2</sub>, 21 % O<sub>2</sub>, ~0,9 % Edelgase (Ar), ~0,04 % CO<sub>2</sub> · Linde-Verfahren trennt flüssige Luft nach den Siedetemperaturen (−196 °C N<sub>2</sub> vor −186 °C Ar vor −183 °C O<sub>2</sub>)",
      terms: [
        ["Luftzusammensetzung", "78 % N<sub>2</sub> · 21 % O<sub>2</sub> · 0,9 % Edelgase · 0,04 % CO<sub>2</sub>", "Volumenanteile trockener Luft"],
        ["Siedepunkte der Luftgase", `N<sub>2</sub>: ${fmtTemp(LINDE_GASES[0].bp)} · Ar: ${fmtTemp(LINDE_GASES[1].bp)} · O<sub>2</sub>: ${fmtTemp(LINDE_GASES[2].bp)}`, "je weniger negativ, desto höher der Siedepunkt"],
      ],
      quiz: [
        "Welches Gas entweicht in der Trennkolonne des Linde-Verfahrens beim langsamen Erwärmen flüssiger Luft (von −200 °C ausgehend) als erstes gasförmig nach oben?",
        "Stickstoff (N₂), weil er mit −196 °C die niedrigste Siedetemperatur hat.",
        "Sauerstoff (O₂), weil −183 °C kleiner als −196 °C sei.",
        "Auf der Zahlengeraden gilt −196 °C < −186 °C < −183 °C; Stickstoff erreicht seinen Siedepunkt zuerst.",
      ],
      lab: makeLab("linde"),
      exercises: [
        {
          id: "luft-volumenanteil",
          make(rng, level) {
            const roomM3 = rng.pick([40, 50, 60, 80, 120, 150, 200]);
            const gas = rng.pick([
              { name: "Stickstoff (N₂)", pct: 78 },
              { name: "Sauerstoff (O₂)", pct: 21 },
            ]);
            const volGas = round((roomM3 * gas.pct) / 100, 1);
            if (level === 1) {
              return {
                prompt: `Ein Klassenzimmer enthält V(Luft) = ${roomM3} m³ trockene Luft. Welches Volumen V an <strong>${gas.name}</strong> (Volumenanteil φ = ${gas.pct} %) befindet sich darin?`,
                given: [`V(Luft) = ${roomM3} m³`, `φ = ${gas.pct} %`],
                formulaHint: "V(Gas) = V(Luft) · φ / 100 %",
                fields: [
                  withSlips(
                    numberField("V =", volGas, "m³", 1),
                    [round((roomM3 * (gas.pct === 78 ? 21 : 78)) / 100, 1), `Verwechsle nicht Stickstoff (78 %) und Sauerstoff (21 %) — gefragt ist ${gas.name}.`],
                    [gas.pct, `Rechne den Prozentwert auf das Raumvolumen ${roomM3} m³ um.`],
                  ),
                ],
                steps: [
                  `Der Volumenanteil von ${gas.name} in trockener Luft beträgt ${gas.pct} %.`,
                  `V = ${roomM3} m³ · ${fmt(gas.pct / 100, 2)} = ${fmt(volGas, 1)} m³.`,
                  `<strong>V = ${fmt(volGas, 1)} m³</strong>`,
                ],
              };
            }
            const targetO2Liters = rng.pick([42, 63, 84, 105, 126, 210]);
            const airLiters = Math.round(targetO2Liters / 0.21);
            return {
              prompt: `In einer Linde-Anlage sollen V(O<sub>2</sub>) = ${targetO2Liters} l gasförmiger Sauerstoff (Volumenanteil in trockener Luft: 21 %) verlustfrei gewonnen werden. Welches Mindestvolumen V(Luft) in Litern muss dafür verarbeitet werden?`,
              given: [],
              formulaHint: "V(O₂) = 0,21 · V(Luft)  ⇒  V(Luft) = V(O₂) / 0,21",
              fields: [
                withSlips(
                  numberField("V(Luft) =", airLiters, "l", 0),
                  [round(targetO2Liters * 0.21, 1), "Teile durch 0,21 statt mit 0,21 zu multiplizieren — die benötigte Luftmenge muss größer sein als das Sauerstoffvolumen!"],
                  [round(targetO2Liters / 0.78, 0), "21 % ist der Anteil von Sauerstoff (78 % wäre Stickstoff)."],
                ),
              ],
              steps: [
                "Trockene Luft enthält 21 % Sauerstoff, also φ(O₂) = 0,21.",
                `Nach V(Luft) umstellen: V(Luft) = ${targetO2Liters} l / 0,21 = ${airLiters} l.`,
                `<strong>V(Luft) = ${airLiters} l</strong>`,
              ],
            };
          },
        },
        cases(
          "linde-ablauf",
          [
            cc(
              "Warum müssen Wasserdampf und Kohlenstoffdioxid vor der Verflüssigung der Luft im Linde-Verfahren entfernt werden?",
              "Beide Stoffe würden beim Abkühlen auf unter −196 °C zu Eis bzw. Trockeneis erstarren und Ventile sowie Rohrleitungen verstopfen.",
              ["Weil Kohlenstoffdioxid mit Stickstoff explosionsartig reagiert.", "Weil Wasserdampf erst unterhalb von −250 °C flüssig wird."],
              "Wasser erstarrt bei 0 °C, Kohlenstoffdioxid resublimiert bei −78,5 °C zu festem Trockeneis.",
              "Was passiert mit H₂O und CO₂ bei −196 °C?",
            ),
            cc(
              "Welches physikalische Trennprinzip nutzt die Trennkolonne im zweiten Teil des Linde-Verfahrens?",
              "Fraktionierte Destillation aufgrund der unterschiedlichen Siedetemperaturen von N₂ (−196 °C), Ar (−186 °C) und O₂ (−183 °C).",
              ["Filtration durch feine Papierporen.", "Magnetscheiden mit Elektromagneten."],
              "Wie bei jeder Destillation trennt die Kolonne ein Flüssigkeitsgemisch nach seinen Siedetemperaturen.",
              "Flüssigkeitsgemisch nach Siedetemperaturen trennen = ?",
            ),
          ],
          [
            cc(
              "Eine Probe flüssiger Luft hat in einem Dewar-Gefäß eine Temperatur von −190 °C und dampft langsam ab. Warum reichert sich im verbleibenden flüssigen Rest zunehmend bläulicher Sauerstoff an, sodass ein glimmender Span darüber heftig aufflammt?",
              "Stickstoff (−196 °C) ist bei −190 °C bereits verdampft, während Sauerstoff (−183 °C) noch flüssig zurückbleibt.",
              ["Sauerstoff entsteht erst durch die Kälte neu aus Stickstoff.", "Sauerstoff hat den niedrigeren Siedepunkt und verdampft zuerst."],
              "Da −196 °C < −190 °C < −183 °C gilt, siedet N₂ bevorzugt ab; zurück bleibt flüssiger, stark brandfördernder Sauerstoff.",
              "Vergleiche −190 °C mit den beiden Siedepunkten −196 °C (N₂) und −183 °C (O₂).",
            ),
            cc(
              "Wofür wird das beim Linde-Verfahren gewonnene Edelgas Argon (ca. 0,9 % der Luft) in der Technik vor allem eingesetzt?",
              "Als reaktionsträges Schutzgas beim Schweißen oder in Spezialglühlampen, damit heiße Metalle nicht mit Sauerstoff reagieren.",
              ["Als besonders energiereicher Brennstoff in Heizkesseln.", "Als Nachweisreagenz für Wasser."],
              "Edelgase gehen unter normalen Bedingungen keine chemischen Reaktionen ein und verdrängen den Luftsauerstoff.",
              "Wie verhalten sich Edelgase chemisch?",
            ),
          ],
        ),
      ],
    }),
  ],
};
