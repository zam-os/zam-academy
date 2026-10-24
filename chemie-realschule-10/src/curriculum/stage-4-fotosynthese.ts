import { C_WATER, FUELS } from "../chemistry/model";
import { fmt, round } from "../exercises/format";
import { makeLab } from "../lab/definitions";
import type { Stage } from "../model/types";
import { cases, cc, lesson, numberField } from "./helpers";

const id = "fotosynthese";
export const STAGE_FOTOSYNTHESE: Stage = {
  id,
  stageNumber: 4,
  title: "Herkunft organischer Verbindungen",
  subtitle: "Fotosynthese, Energieträger und Rohstoffe",
  icon: "🌱",
  accent: "#16a34a",
  badgeTitle: "Kohlenstoffkreisläufer",
  lehrplanLabel: "C10 LB 3 (I) · C10 LB 4 (II/III)",
  lessons: [
    lesson(id, 1, {
      id: "ch-kohlenstoff-nachweis",
      title: "Kohlenstoff als Grundbaustein",
      subtitle: "Verkohlung und Kalkwasserprobe",
      bindings: { I: 3, II_III: 4 },
      why: "Alle organischen Stoffe enthalten Kohlenstoff, und zwei einfache Versuche zeigen ihn.",
      html: "<p>Organische Verbindungen sind Kohlenstoffverbindungen: Zucker, Fette, Eiweiße, Holz, Erdöl und Kunststoffe. Kohlenstoff lässt sich auf zwei Wegen nachweisen. Bei der <strong>Verkohlung</strong> erhitzt man einen Stoff unter Luftmangel stark: Ein schwarzer Rückstand aus Kohlenstoff bleibt zurück, oft kondensiert zusätzlich Wasser. Bei der <strong>Kalkwasserprobe</strong> verbrennt man den Stoff und leitet die Abgase in Kalkwasser: Es trübt sich, weil Kohlenstoffdioxid mit Calciumhydroxid schwer lösliches Calciumcarbonat bildet.</p><p>Die Verkohlung zeigt den Kohlenstoff direkt, die Kalkwasserprobe indirekt über das Verbrennungsprodukt CO₂. Ausnahmen wie Kohlenstoffdioxid, Carbonate und Kohlenstoffmonooxid zählt man trotz Kohlenstoff zu den anorganischen Stoffen.</p><div class=\"example\"><strong>Beispiel:</strong> Mehl verkohlt beim Erhitzen; die Abgase einer brennenden Kerze trüben Kalkwasser: CO₂ + Ca(OH)₂ → CaCO₃ + H₂O.</div>",
      rule: "Verkohlung: schwarzer Rückstand = C · Kalkwasser trüb: CO₂ aus dem Kohlenstoff des Stoffes",
      terms: [["Kalkwasserprobe", "CO₂ + Ca(OH)₂ → CaCO₃ + H₂O", "Trübung durch Calciumcarbonat"]],
      quiz: [
        "Was zeigt eine Trübung des Kalkwassers über einer Flamme an?",
        "Der verbrannte Stoff enthielt Kohlenstoff; es entstand CO₂.",
        "Der verbrannte Stoff enthielt Wasserstoff.",
        "Kalkwasser reagiert mit CO₂ zu schwer löslichem Calciumcarbonat.",
      ],
      lab: makeLab("kohlenstoff"),
      exercises: [
        cases(
          "nachweis",
          [
            cc("Welcher Versuch zeigt Kohlenstoff in Zucker direkt?", "Starkes Erhitzen: Es bleibt ein schwarzer Rückstand.", ["Lösen in Wasser: Die Lösung bleibt klar.", "Glimmspanprobe: Der Span flammt auf."], "Die Verkohlung lässt Kohlenstoff als Feststoff zurück.", "Was bleibt beim Erhitzen übrig?"),
            cc("Welches Gas trübt Kalkwasser?", "Kohlenstoffdioxid", ["Sauerstoff", "Wasserstoff"], "CO₂ bildet mit Calciumhydroxid Calciumcarbonat.", "Was entsteht beim Verbrennen von C?"),
          ],
          [
            cc("Beim Erhitzen von Holz bildet sich am kalten Glas ein Beschlag. Was schließt du daraus?", "Holz enthält auch Wasserstoff und Sauerstoff; es entsteht Wasser.", ["Holz enthält keinen Kohlenstoff.", "Das Glas schmilzt."], "Der Beschlag ist kondensiertes Wasser.", "Welcher Stoff kondensiert?"),
            cc("Warum ist die Kalkwasserprobe ein indirekter Kohlenstoffnachweis?", "Nachgewiesen wird das Verbrennungsprodukt CO₂, nicht der Kohlenstoff selbst.", ["Weil Kalkwasser Kohlenstoff enthält.", "Weil sie nur bei Metallen funktioniert."], "Man schließt vom Produkt auf das Element.", "Was trübt das Kalkwasser?"),
          ],
        ),
        cases(
          "organisch-anorganisch",
          [
            cc("Welcher Stoff ist organisch?", "Traubenzucker", ["Kochsalz", "Kohlenstoffdioxid"], "Traubenzucker ist eine Kohlenstoffverbindung mit C–H-Bindungen.", "Ausnahmen beachten."),
            cc("Warum zählt Kalk (CaCO₃) nicht zu den organischen Stoffen?", "Carbonate werden trotz Kohlenstoff zur anorganischen Chemie gezählt.", ["Weil Kalk keinen Kohlenstoff enthält.", "Weil Kalk ein Metall ist."], "CO₂, CO und Carbonate sind die klassischen Ausnahmen.", "Formel lesen."),
          ],
          [
            cc("Ein unbekanntes weißes Pulver verkohlt nicht und liefert kein CO₂. Was folgt?", "Es ist vermutlich ein anorganischer Stoff ohne Kohlenstoff.", ["Es ist sicher Zucker.", "Es ist ein Kunststoff."], "Beide Kohlenstoffnachweise sind negativ.", "Zwei negative Befunde."),
            cc("Kerzenwachs und Kochsalz werden in getrennten Versuchen verbrannt bzw. erhitzt. Wo erwartest du eine Kalkwassertrübung?", "Nur beim Kerzenwachs.", ["Nur beim Kochsalz.", "Bei beiden."], "Nur Wachs ist eine Kohlenstoffverbindung.", "Welcher Stoff enthält C?"),
          ],
        ),
      ],
    }),
    lesson(id, 2, {
      id: "ch-fotosynthese",
      title: "Fotosynthese",
      subtitle: "Lichtenergie wird chemische Energie",
      bindings: { I: 3, II_III: 4 },
      why: "Fast alle organischen Stoffe, auch Erdöl und Kohle, gehen auf die Fotosynthese zurück.",
      html: "<p>Grüne Pflanzen, Algen und manche Bakterien bauen mithilfe von Lichtenergie und Chlorophyll aus Kohlenstoffdioxid und Wasser Glucose auf; Sauerstoff wird frei: <strong>6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂</strong>. Die Reaktion ist endotherm; die Lichtenergie wird als chemische Energie in der Glucose gespeichert.</p><p>Aus Glucose bilden Pflanzen weitere Stoffe: Stärke als Speicher, Cellulose als Gerüst, außerdem Fette und mit Stickstoffverbindungen Eiweiße. Diese <strong>Biomasse</strong> dient Lebewesen als Bau- und Betriebsstoff. Über Millionen Jahre entstanden aus Biomasse die <strong>fossilen</strong> Energieträger Kohle, Erdöl und Erdgas; heutige Biomasse wie Holz, Stärke oder Cellulose ist ein <strong>nichtfossiler</strong> Energieträger. Bei der Zellatmung und bei Verbrennungen wird die gespeicherte Energie wieder frei.</p><div class=\"example\"><strong>Beispiel:</strong> Für ein Glucosemolekül braucht die Pflanze sechs CO₂-Moleküle und sechs H₂O-Moleküle; sechs O₂-Moleküle werden frei.</div>",
      rule: "6 CO₂ + 6 H₂O + Lichtenergie → C₆H₁₂O₆ + 6 O₂",
      terms: [["Fotosynthese", "6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂", "endotherm, Licht und Chlorophyll"]],
      quiz: [
        "Woher stammt die Energie, die in Glucose gespeichert ist?",
        "Aus dem Sonnenlicht.",
        "Aus dem Sauerstoff der Luft.",
        "Die Fotosynthese ist endotherm; Lichtenergie wird in chemische Energie umgewandelt.",
      ],
      lab: makeLab("fotosynthese"),
      exercises: [
        {
          id: "fotosynthese-bilanz",
          make(rng, level) {
            const glucose = rng.int(1, 5);
            if (level === 1)
              return {
                prompt: `Eine Pflanze bildet ${glucose} Glucosemolekül${glucose > 1 ? "e" : ""}. Wie viele CO₂-Moleküle verbraucht sie, und wie viele O₂-Moleküle werden frei?`,
                given: ["6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂"],
                formulaHint: "Je Glucosemolekül: 6 CO₂ und 6 O₂",
                fields: [numberField("CO₂-Moleküle", 6 * glucose), numberField("O₂-Moleküle", 6 * glucose)],
                steps: ["Die Gleichung gilt für ein Glucosemolekül.", `${glucose} · 6 = ${6 * glucose}`, `<strong>${6 * glucose} CO₂ und ${6 * glucose} O₂</strong>`],
              };
            const co2 = rng.pick([44, 88, 132, 264]);
            const mass = round((co2 / 44 / 6) * 180, 1);
            return {
              prompt: `Ein Blatt nimmt ${co2} g Kohlenstoffdioxid auf (M = 44 g/mol). Wie viel Gramm Glucose (M = 180 g/mol) kann es daraus höchstens bilden?`,
              given: [],
              formulaHint: "n(CO₂) → n(Glucose) = n(CO₂) : 6 → m = n · M",
              fields: [{ ...numberField("m(Glucose)", mass, "g", 1), tolerance: 0.01 }],
              steps: [`n(CO₂) = ${co2} g : 44 g/mol = ${fmt(co2 / 44, 0)} mol`, `n(Glucose) = ${fmt(co2 / 44, 0)} mol : 6`, `<strong>m = ${fmt(mass, 1)} g</strong>`],
            };
          },
        },
        cases(
          "biomasse",
          [
            cc("Welcher Stoff dient der Pflanze als Energiespeicher?", "Stärke", ["Cellulose", "Sauerstoff"], "Stärke wird aus Glucose aufgebaut und bei Bedarf abgebaut.", "Speicher oder Gerüst?"),
            cc("Welche Stoffe braucht die Fotosynthese als Ausgangsstoffe?", "Kohlenstoffdioxid und Wasser.", ["Glucose und Sauerstoff.", "Stickstoff und Wasser."], "CO₂ und H₂O werden mit Lichtenergie umgesetzt.", "Linke Seite der Gleichung."),
          ],
          [
            cc("Warum nennt man Erdöl ‚gespeicherte Sonnenenergie‘?", "Es entstand aus Biomasse, deren Energie aus der Fotosynthese stammt.", ["Weil es sich in der Sonne erwärmt.", "Weil es Licht ausstrahlt."], "Die Energie fossiler Stoffe geht auf frühere Fotosynthese zurück.", "Woher kommt die Biomasse?"),
            cc("Zellatmung und Fotosynthese im Vergleich: Welche Aussage stimmt?", "Die Zellatmung setzt die in Glucose gespeicherte Energie wieder frei.", ["Die Zellatmung speichert Lichtenergie.", "Beide Vorgänge verbrauchen Sauerstoff und Licht."], "Zellatmung: C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O, exotherm.", "Umkehrung der Bilanz."),
          ],
        ),
      ],
    }),
    lesson(id, 3, {
      id: "ch-energiegehalt",
      title: "Energiegehalt organischer Stoffe",
      subtitle: "Erdnuss, Zucker und Öl verbrennen",
      bindings: { I: 3, II_III: 4 },
      why: "Der Energiegehalt erklärt, warum Fette sättigen und Biomasse als Brennstoff taugt.",
      html: "<p>Verbrennt man eine Erdnuss, ein Stück Zucker oder einen Docht mit Pflanzenöl unter einem Gefäß mit Wasser, erwärmt sich das Wasser. Die bei der Verbrennung frei werdende Energie war in den Stoffen chemisch gespeichert; sie geht auf die Fotosynthese zurück. Aus der Temperaturerhöhung berechnet man die aufgenommene Wärme: <strong>Q = c · m · ΔT</strong> mit c(Wasser) = 4,19 J/(g·K).</p><p>Fette liefern pro Gramm etwa doppelt so viel Energie (rund 37 kJ/g) wie Kohlenhydrate (rund 17 kJ/g). Im einfachen Schulversuch geht ein großer Teil der Wärme an Luft und Gefäß verloren; die gemessenen Werte sind daher kleiner als die Tabellenwerte. Ein Vergleich verschiedener Stoffe im gleichen Aufbau ist trotzdem aussagekräftig.</p><div class=\"example\"><strong>Beispiel:</strong> 200 g Wasser erwärmen sich um 12 K: Q = 4,19 J/(g·K) · 200 g · 12 K ≈ 10 056 J ≈ 10,1 kJ.</div>",
      rule: "Q = c · m · ΔT · Fett ≈ 37 kJ/g · Kohlenhydrat ≈ 17 kJ/g",
      terms: [["Wärme", "Q = c · m · ΔT", "c(Wasser) = 4,19 J/(g·K), m Wasser in g, ΔT in K"]],
      quiz: [
        "Warum misst man im einfachen Schulversuch weniger Energie als in der Nährwerttabelle?",
        "Ein Teil der Wärme geht an Luft und Gefäß verloren.",
        "Die Erdnuss enthält im Labor weniger Energie.",
        "Der Aufbau ist kein geschlossenes Kalorimeter.",
      ],
      lab: makeLab("kalorimetrie"),
      exercises: [
        {
          id: "waerme",
          make(rng, level) {
            const water = rng.pick([100, 150, 200, 250]);
            const rise = rng.int(5, 30);
            const q = (C_WATER * water * rise) / 1000;
            if (level === 1)
              return {
                prompt: `${water} g Wasser erwärmen sich beim Verbrennen einer Probe um ${rise} K. Berechne die vom Wasser aufgenommene Wärme in kJ.`,
                given: ["c(Wasser) = 4,19 J/(g·K)", `m = ${water} g`, `ΔT = ${rise} K`],
                formulaHint: "Q = c · m · ΔT",
                fields: [{ ...numberField("Q", round(q, 2), "kJ", 2), tolerance: 0.01 }],
                steps: [`Q = 4,19 J/(g·K) · ${water} g · ${rise} K`, `Q = ${fmt(q * 1000, 0)} J`, `<strong>${fmt(q, 2)} kJ</strong>`],
              };
            const sample = rng.pick([0.5, 0.8, 1, 1.2]);
            const perGram = q / sample;
            return {
              prompt: `Eine Erdnuss mit ${fmt(sample, 1)} g erwärmt beim Verbrennen ${water} g Wasser um ${rise} K. Welchen Energiegehalt in kJ/g ergibt dieser Versuch?`,
              given: [],
              formulaHint: "Erst Q = c · m · ΔT, dann durch die Probenmasse teilen",
              fields: [{ ...numberField("Energiegehalt", round(perGram, 1), "kJ/g", 1), tolerance: 0.02 }],
              steps: [`Q = 4,19 · ${water} · ${rise} J = ${fmt(q, 2)} kJ`, `${fmt(q, 2)} kJ : ${fmt(sample, 1)} g`, `<strong>${fmt(perGram, 1)} kJ/g</strong> (kleiner als der Tabellenwert 25 kJ/g wegen Wärmeverlusten)`],
            };
          },
        },
        cases(
          "energietraeger",
          [
            cc(`Welcher Stoff hat pro Gramm den höchsten Energiegehalt?`, `${FUELS[2].name}`, [FUELS[0].name, FUELS[1].name], "Fette und fette Öle liefern etwa 37 kJ/g.", "Fett oder Kohlenhydrat?"),
            cc("Woher stammt die Energie, die beim Verbrennen von Holz frei wird?", "Aus der Fotosynthese: Lichtenergie wurde in Biomasse gespeichert.", ["Aus dem Feuerzeug.", "Aus dem Wasser im Holz."], "Biomasse ist gespeicherte Sonnenenergie.", "Wie entstand das Holz?"),
          ],
          [
            cc("Ein Schüler misst für Zucker 9 kJ/g statt 17 kJ/g. Welche Erklärung ist fachlich am besten?", "Wärmeverluste an Luft und Gefäß; ein Teil der Energie erwärmt nicht das Wasser.", ["Zucker enthält in Wahrheit nur 9 kJ/g.", "Wasser speichert keine Wärme."], "Offene Aufbauten sind keine verlustfreien Kalorimeter.", "Wohin geht die Wärme noch?"),
            cc("Warum speichern Tiere Energie lieber als Fett statt als Kohlenhydrat?", "Fett speichert pro Gramm etwa doppelt so viel Energie.", ["Fett ist wasserlöslich.", "Kohlenhydrate enthalten keine Energie."], "Hoher Energiegehalt bei geringer Masse.", "kJ pro Gramm vergleichen."),
          ],
        ),
      ],
    }),
    lesson(id, 4, {
      id: "ch-rohstoffe",
      title: "Fossile und nachwachsende Rohstoffe",
      subtitle: "Kohle, Erdöl, Erdgas und Biomasse bewerten",
      bindings: { I: 3, II_III: 4 },
      why: "Ob Tank, Teller oder Chemiefabrik: Rohstoffentscheidungen haben ökologische, ökonomische und ethische Folgen.",
      html: "<p><strong>Kohle</strong> entstand aus Landpflanzen, die in Sümpfen unter Luftabschluss, Druck und Wärme über Jahrmillionen inkohlten. <strong>Erdöl</strong> und <strong>Erdgas</strong> entstanden aus abgestorbenem Plankton am Meeresboden. Erdöl ist ein Gemisch vieler Kohlenwasserstoffe; es wird durch Destillation in Benzin, Diesel, Heizöl und Rohstoffe für Kunststoffe getrennt. Erdgas besteht überwiegend aus Methan. Diese Rohstoffe sind begrenzt.</p><p>Beim Verbrennen fossiler Stoffe gelangt Kohlenstoff, der Millionen Jahre gebunden war, als CO₂ in die Atmosphäre. Das verstärkt den <strong>Treibhauseffekt</strong>: CO₂ absorbiert Wärmestrahlung der Erde, die mittlere Temperatur steigt. <strong>Nachwachsende Rohstoffe</strong> wie Raps, Mais, Holz oder Zuckerrüben binden beim Wachsen so viel CO₂, wie beim Verbrennen frei wird; Anbau, Dünger und Transport verursachen trotzdem Emissionen. Ihre Fläche kann als Nahrungsmittel, Energieträger oder Rohstoff für die chemische Industrie genutzt werden; diese Nutzungen konkurrieren.</p><div class=\"example\"><strong>Beispiel:</strong> Mais für Biogas: Der Rohstoff wächst nach, aber die Ackerfläche fehlt für Nahrungsmittel (‚Teller oder Tank‘).</div>",
      rule: "Fossil: begrenzt, zusätzliches CO₂ · nachwachsend: CO₂-ärmer, aber Flächenkonkurrenz",
      terms: [["Treibhauseffekt", "CO₂ und andere Gase absorbieren Wärmestrahlung der Erde", ""]],
      quiz: [
        "Warum gelten nachwachsende Rohstoffe beim Verbrennen als annähernd klimaneutral?",
        "Die Pflanzen haben beim Wachsen etwa so viel CO₂ gebunden, wie beim Verbrennen frei wird.",
        "Beim Verbrennen von Pflanzen entsteht kein CO₂.",
        "Der Kohlenstoff stammt aus dem aktuellen Kreislauf, nicht aus Lagerstätten; Anbau und Transport verursachen trotzdem Emissionen.",
      ],
      lab: makeLab("rohstoffe"),
      exercises: [
        cases(
          "entstehung",
          [
            cc("Woraus ist Erdöl entstanden?", "Aus abgestorbenem Plankton unter Luftabschluss.", ["Aus Vulkangestein.", "Aus Kohlenstoffdioxid der heutigen Luft."], "Meeresorganismen wurden über Jahrmillionen umgewandelt.", "Biomasse am Meeresboden."),
            cc("Welcher Hauptbestandteil prägt Erdgas?", "Methan", ["Sauerstoff", "Propanol"], "Erdgas besteht überwiegend aus Methan CH₄.", "Einfachster Kohlenwasserstoff."),
            cc("Wie trennt man Erdöl in Benzin, Diesel und andere Fraktionen?", "Durch Destillation nach Siedebereichen.", ["Durch Filtration.", "Durch Magnetscheiden."], "Die Bestandteile haben unterschiedliche Siedetemperaturen.", "Siedetemperatur."),
          ],
          [
            cc("Warum verstärkt das Verbrennen von Kohle den Treibhauseffekt stärker als das Verbrennen von Holz aus nachhaltiger Forstwirtschaft?", "Kohle setzt Kohlenstoff frei, der seit Jahrmillionen gebunden war.", ["Holz enthält keinen Kohlenstoff.", "Kohle verbrennt ohne CO₂."], "Fossiler Kohlenstoff erhöht den CO₂-Gehalt zusätzlich.", "Woher stammt der Kohlenstoff?"),
            cc("Warum wird Erdöl auch als Rohstoff der chemischen Industrie geschätzt?", "Aus ihm werden Kunststoffe, Farbstoffe und Medikamente hergestellt.", ["Weil es nur Wasser enthält.", "Weil es unbegrenzt vorhanden ist."], "Verbrennen vernichtet einen wertvollen Kohlenstoffrohstoff.", "Mehr als ein Brennstoff."),
          ],
        ),
        cases(
          "bewerten",
          [
            cc("Was bedeutet ‚Teller oder Tank‘?", "Ackerflächen können Nahrungsmittel oder Energiepflanzen tragen; beides konkurriert.", ["Biokraftstoff schmeckt nach Essen.", "Tanks werden aus Tellern hergestellt."], "Ethischer Aspekt nachwachsender Rohstoffe.", "Flächenkonkurrenz."),
            cc("Welcher Aspekt ist ökonomisch?", "Preis und Verfügbarkeit des Rohstoffs.", ["CO₂-Ausstoß beim Verbrennen.", "Gerechtigkeit gegenüber hungernden Menschen."], "Ökonomie betrifft Kosten und Märkte.", "Geld und Markt."),
          ],
          [
            cc("Eine Firma wirbt: „Biodiesel ist völlig CO₂-frei.“ Wie bewertest du das?", "Falsch: Anbau, Dünger, Verarbeitung und Transport verursachen Emissionen.", ["Richtig, weil Raps keinen Kohlenstoff enthält.", "Richtig, weil Biodiesel nicht brennt."], "Nachwachsend heißt nicht emissionsfrei.", "Gesamte Herstellungskette."),
            cc("Ein Land will Regenwald für Palmölplantagen roden, um Biodiesel zu erzeugen. Welcher Einwand ist ökologisch?", "Die Rodung setzt viel gebundenes CO₂ frei und zerstört Lebensräume.", ["Palmöl ist zu billig.", "Biodiesel ist nicht flüssig."], "Ökologische Aspekte betreffen Klima und Artenvielfalt.", "Was passiert mit dem Wald?"),
          ],
        ),
      ],
    }),
  ],
};
