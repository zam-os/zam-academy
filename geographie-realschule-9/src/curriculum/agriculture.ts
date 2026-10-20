import type { Lesson } from "../model/types";
import { check, classify, tasks } from "./helpers";

export const agriculture: Lesson[] = [
  {
    id: "geo-landwirtschaft-faktoren",
    lb: 3,
    title: "Was Landwirtschaft an einem Standort braucht",
    period: "Naturfaktoren · Betriebsentscheidungen",
    intro:
      "Ein Acker ist zugleich Naturraum, Arbeitsplatz und Teil eines Marktes. Seine Nutzung lässt sich nicht allein aus dem Wetter erklären.",
    paragraphs: [
      "Boden, Wasser, Temperatur, Relief und Vegetationsdauer beeinflussen, welche Kulturen wachsen können. Ein steiler Hang erschwert den Maschineneinsatz, ein fruchtbarer Boden garantiert bei Wassermangel noch keine gute Ernte. Natürliche Voraussetzungen setzen Möglichkeiten und Grenzen; Bewässerung, Sortenwahl oder Technik können sie verändern, benötigen aber Ressourcen.",
      "Arbeitskräfte, Wissen, Kapital, Verkehrswege, Preise und politische Regeln beeinflussen die Betriebsentscheidung ebenfalls. Landwirtschaft erzeugt Nahrungsmittel und Rohstoffe, prägt Kulturlandschaften und kann Arbeitsplätze sowie Lebensräume erhalten. Diese Funktionen können in Konflikt geraten, etwa wenn hohe Erträge durch eine sehr einseitige Nutzung erzielt werden sollen.",
    ],
    takeaway:
      "Eine Standortanalyse verbindet Naturbedingungen mit wirtschaftlichen und gesellschaftlichen Faktoren.",
    sourceIds: ["uba-landwirtschaft", "fao-sustain"],
    quiz: check(
      "Welche Angabe ist ein wirtschaftlicher statt eines natürlichen Standortfaktors?",
      "Die erreichbaren Absatzpreise",
      ["Die Hangneigung des Feldes", "Die Länge der frostfreien Zeit"],
      "Preise entstehen in Märkten und beeinflussen Einnahmen. Hangneigung und Vegetationsdauer gehören zu den Naturbedingungen.",
    ),
    workshop: classify(
      "Faktoren und Funktionen",
      [
        "Natürlicher Faktor",
        "Wirtschaftlich-gesellschaftlicher Faktor",
        "Funktion der Landwirtschaft",
      ],
      [
        [
          "Wasserspeichervermögen des Bodens",
          0,
          "Es beeinflusst die Wasserversorgung der Pflanzen.",
        ],
        [
          "Nähe zu einer Molkerei und deren Abnahmepreis",
          1,
          "Verarbeitung, Verkehr und Markt wirken zusammen.",
        ],
        [
          "Nahrungsmittel erzeugen und Kulturlandschaft pflegen",
          2,
          "Eine Tätigkeit kann mehrere Funktionen erfüllen.",
        ],
      ],
      "Faktoren erklären Voraussetzungen, Funktionen beschreiben Leistungen und Wirkungen.",
    ),
    tasks: tasks(
      "Erkläre an einem Beispiel, warum gutes Wetter allein keinen erfolgreichen Betrieb garantiert.",
      "Ein Betrieb kann trotz günstiger Temperatur wenig verdienen, wenn Böden geschädigt sind, Wasser fehlt oder die Absatzpreise niedrig sind. Die Ernte hängt von Naturbedingungen und Bewirtschaftung ab; das Einkommen zusätzlich von Kosten und Markt. Ich muss beide Ebenen untersuchen.",
      [
        "Ich nenne einen weiteren Naturfaktor.",
        "Ich beziehe Kosten oder Markt ein.",
        "Ich unterscheide Ernte und Einkommen.",
      ],
      "Soll ein steiler Hang zu einem großen Maisacker umgebaut werden? Nenne nötige Prüfkriterien.",
      "Ich prüfe Boden und Erosionsgefährdung, mögliche Erträge und Maschinenkosten sowie Auswirkungen auf Wasser und Lebensräume. Ich vergleiche Alternativen wie dauerhafte Bodenbedeckung oder andere Nutzungen. Eine hohe Verkaufserwartung allein reicht als Begründung nicht.",
      [
        "Ich prüfe Hang und Boden.",
        "Ich berücksichtige wirtschaftliche und ökologische Folgen.",
        "Ich vergleiche eine Alternative.",
      ],
    ),
  },
  {
    id: "geo-konventionell-bio",
    lb: 3,
    title: "Konventionell und ökologisch vergleichen",
    period: "Anbauweisen · mehrere Bewertungsmaßstäbe",
    intro:
      "Betriebe unterscheiden sich stärker als zwei Etiketten vermuten lassen. Ein Vergleich braucht klare Regeln und passende Bezugsgrößen.",
    paragraphs: [
      "Ökologischer Landbau folgt besonderen Vorgaben, etwa zum Verzicht auf chemisch-synthetische Pflanzenschutzmittel und leicht lösliche mineralische Stickstoffdünger. Fruchtfolgen und organische Düngung spielen eine wichtige Rolle. Auch konventionelle Betriebe müssen Umweltregeln beachten und können sehr verschieden wirtschaften. Weder Bio noch konventionell bezeichnet einen einzigen einheitlichen Hof.",
      "Vergleiche Boden, Wasser, Artenvielfalt, Tierhaltung, Ertrag, Flächenbedarf, Arbeitsaufwand und Preis. Eine geringere Belastung je Hektar bedeutet nicht automatisch eine geringere Belastung je Kilogramm Produkt, wenn die Erträge verschieden sind. Höhere Flächenansprüche und Vorteile für Artenvielfalt können gleichzeitig bestehen; ein Urteil nennt deshalb seinen Maßstab.",
    ],
    takeaway:
      "Je Hektar und je Kilogramm sind unterschiedliche Vergleiche; kein einzelner Kennwert ersetzt die Gesamtabwägung.",
    sourceIds: ["uba-bio", "uba-landwirtschaft"],
    quiz: check(
      "Was muss bei einem Umweltvergleich zweier Anbauweisen angegeben werden?",
      "Die Bezugsgröße der Umweltbelastung",
      ["Nur die Farbe der Verpackung", "Ausschließlich der Name des Hofes"],
      "Eine Aussage je Fläche kann anders ausfallen als eine Aussage je Produktmenge. Beides muss transparent sein.",
    ),
    workshop: classify(
      "Vergleich prüfen",
      ["Geeignetes Kriterium", "Unbelegte Pauschalaussage"],
      [
        [
          "Stickstoffüberschuss je Hektar und Jahr vergleichen",
          0,
          "Einheit und Zeitraum machen den Vergleich prüfbar.",
        ],
        [
          "Jedes Bio-Produkt hat unter allen Bedingungen die kleinste Klimawirkung.",
          1,
          "Transport, Ertrag, Produktart und weitere Faktoren werden ausgeblendet.",
        ],
        [
          "Ertrag, Fläche und Artenvielfalt gemeinsam betrachten",
          0,
          "Mehrere Kriterien zeigen mögliche Zielkonflikte.",
        ],
      ],
      "Eine differenzierte Bewertung ist möglich, ohne Unterschiede der Anbauweisen zu verwischen.",
    ),
    tasks: tasks(
      "Vergleiche zwei Anbauweisen mit zwei Umweltkriterien und einer wirtschaftlichen Frage.",
      "Ich vergleiche zum Beispiel Stickstoffverluste und Artenvielfalt auf ähnlich geeigneten Standorten. Zusätzlich prüfe ich Erträge, Aufwand und Verkaufserlöse. Ich gebe an, ob die Umweltwerte je Hektar oder je Produktmenge gelten, und begründe mein Urteil aus diesen Kriterien.",
      [
        "Ich nenne zwei Umweltkriterien.",
        "Ich ergänze eine wirtschaftliche Frage.",
        "Ich benenne die Bezugsgröße.",
      ],
      "Ein Hof belastet je Hektar weniger, erntet aber auch weniger. Welche Daten fehlen für die Aussage je Kilogramm?",
      "Ich brauche die genaue Belastung und den marktfähigen Ertrag im selben Zeitraum sowie dieselbe Systemgrenze. Erst die Division durch die Produktmenge ergibt den Wert je Kilogramm. Weitere Leistungen wie Lebensräume werden dadurch nicht automatisch mitbewertet.",
      [
        "Ich fordere vergleichbare Mengen und Zeiträume.",
        "Ich erkläre die Umrechnung je Produkt.",
        "Ich nenne eine Grenze dieses Kennwerts.",
      ],
    ),
  },
  {
    id: "geo-boden-ernaehrung",
    lb: 3,
    title: "Was auf dem Teller mit dem Boden zu tun hat",
    period: "Mais · Tierhaltung · Wasser und Vielfalt",
    intro:
      "Boden bildet sich langsam und erfüllt viele Aufgaben. Anbau und Ernährung beeinflussen, wie stark er beansprucht wird.",
    paragraphs: [
      "Böden speichern Wasser und Nährstoffe, sind Lebensraum und Grundlage der Produktion. Unbedeckte Ackerflächen können bei Starkregen Boden verlieren; vielfältige Fruchtfolgen und Zwischenfrüchte können die Bedeckung verbessern. Bei Mais hängt das Risiko unter anderem von Reihenabstand, Hanglage und Bearbeitung ab. Die Kulturart allein erklärt nicht jede Erosion.",
      "Düngung versorgt Pflanzen, doch überschüssige Nährstoffe können in Gewässer gelangen oder als Gase entweichen. Hohe Tierbestände können regional große Güllemengen erzeugen; Futtermittel beanspruchen Flächen auch außerhalb der Region. Die Produktion tierischer Lebensmittel benötigt häufig mehr Futter- und Flächenressourcen als die direkte pflanzliche Ernährung, unterscheidet sich aber nach Produkt und Haltung. Für ein Urteil sind Mengen, Standort und Bewirtschaftung wichtig.",
    ],
    takeaway:
      "Boden-, Wasser- und Artenschutz hängen mit Anbauweise, Tierbestand und Nachfrage zusammen.",
    sourceIds: ["boden", "uba-landwirtschaft", "uba-ernaehrung"],
    quiz: check(
      "Welche Bewirtschaftung kann Erosion auf einem gefährdeten Acker verringern?",
      "Eine möglichst dauerhafte Bodenbedeckung",
      ["Jede Vegetation lange vollständig entfernen", "Abflussrinnen am Hang gezielt offen halten"],
      "Bodenbedeckung kann Regentropfen abfangen und den Abfluss bremsen. Die konkrete Wirkung bleibt standortabhängig.",
    ),
    workshop: classify(
      "Ursachen und Schutzmöglichkeiten",
      ["Mögliches Belastungsrisiko", "Möglicher Schutz"],
      [
        [
          "Düngung deutlich über den Bedarf der Pflanzen hinaus",
          0,
          "Ein Überschuss erhöht das Risiko von Nährstoffverlusten.",
        ],
        [
          "Zwischenfrüchte und vielfältige Fruchtfolgen",
          1,
          "Sie können Bedeckung und Bodenstruktur fördern.",
        ],
        [
          "Hohe Viehdichte ohne ausreichendes Nährstoffmanagement",
          0,
          "Anfallende Nährstoffmengen müssen zur verfügbaren Nutzung passen.",
        ],
      ],
      "Ein Belastungsrisiko ist noch keine Messung der tatsächlichen Gewässerqualität.",
    ),
    tasks: tasks(
      "Beschreibe eine Wirkungskette von landwirtschaftlicher Nutzung zu einem Umweltproblem und eine Gegenmaßnahme.",
      "Ein offener Acker am Hang kann bei Starkregen Boden verlieren. Der Abfluss transportiert Sediment und daran gebundene Nährstoffe in ein Gewässer. Eine geeignete Bodenbedeckung und Pufferstreifen können diesen Weg bremsen; Lage und Bewirtschaftung müssen dafür berücksichtigt werden.",
      [
        "Ich benenne einen konkreten Ausgangspunkt.",
        "Ich erkläre den Transport oder Wirkungsweg.",
        "Ich begründe eine passende Gegenmaßnahme.",
      ],
      "Warum reicht die Aussage regionales Fleisch schützt immer den Boden für ein Urteil nicht aus?",
      "Regional beschreibt zunächst eine Herkunft beziehungsweise Entfernung, nicht Tierbestand, Futterherkunft oder Nährstoffbilanz. Ich prüfe Haltung, Futtermittel, Mengen und Flächennutzung. Kürzere Wege können ein Vorteil sein, beantworten aber nicht allein die Fragen nach Boden, Wasser und Gesamtressourcen.",
      [
        "Ich trenne Herkunft und Produktionsweise.",
        "Ich nenne mindestens zwei weitere Faktoren.",
        "Ich wäge einen Vorteil gegen die Aussagegrenze ab.",
      ],
    ),
  },
  {
    id: "geo-agrarhandel",
    lb: 3,
    title: "Vom Weltmarkt zum Einkaufskorb",
    period: "EU-Agrarpolitik · regional · fair",
    intro:
      "Was Landwirtschaft produziert, hängt auch von Förderregeln, Handel und Nachfrage ab. Ein günstiger Preis zeigt nicht alle Kosten.",
    paragraphs: [
      "Die Gemeinsame Agrarpolitik der EU beeinflusst Einkommen, Flächennutzung und Umweltleistungen. Förderungen, Anforderungen und Marktzugang verändern sich; aktuelle Einzelregeln müssen an einer datierten offiziellen Quelle geprüft werden. Weltmarktpreise und Handel können Versorgung ermöglichen, aber auch Abhängigkeiten und Konkurrenz verschärfen. Die Folgen unterscheiden sich für Produzierende und Kaufende.",
      "Regionale Vermarktung kann Wege verkürzen und Beziehungen stärken, garantiert aber nicht automatisch die beste Umweltbilanz. Saison, Lagerung und Produktionsweise wirken mit. Fairer Handel zielt unter anderem auf Handelsbedingungen und soziale Standards; die Anforderungen unterscheiden sich je Siegel. Prüfe deshalb Herkunft, Standard, Preisbildung und unabhängige Informationen, statt einem Werbewort alle gewünschten Eigenschaften zuzuschreiben.",
    ],
    takeaway:
      "Ein begründeter Einkauf vergleicht ökologische, wirtschaftliche und soziale Kriterien anhand überprüfbarer Informationen.",
    sourceIds: ["eu-gap", "fao-sustain", "uba-ernaehrung"],
    quiz: check(
      "Was belegt das Wort regional auf einem Produkt allein noch nicht?",
      "Faire Arbeitsbedingungen und geringe Gesamtbelastung",
      [
        "Dass eine räumliche Herkunft behauptet wird",
        "Dass eine Herkunftsangabe geprüft werden sollte",
      ],
      "Die räumliche Nähe ersetzt keine Angaben über Produktion, soziale Bedingungen oder die gesamte Umweltwirkung.",
    ),
    workshop: classify(
      "Information oder weiter prüfen?",
      ["Prüfbare Angabe", "Pauschales Versprechen"],
      [
        [
          "Ernteort, Saison und Art der Lagerung sind angegeben.",
          0,
          "Diese Angaben lassen sich mit weiteren Quellen überprüfen.",
        ],
        [
          "Regional bedeutet immer emissionsfrei und sozial gerecht.",
          1,
          "Das sind zusätzliche Eigenschaften, die die Herkunft allein nicht belegt.",
        ],
        [
          "Ein Siegel nennt öffentlich seine Kriterien und Kontrolle.",
          0,
          "Transparente Standards ermöglichen eine Prüfung, garantieren aber nicht jedes Wunschziel.",
        ],
      ],
      "Unterscheide Produzenteninformation, politisches Ziel und unabhängig geprüfte Wirkung.",
    ),
    tasks: tasks(
      "Vergleiche regional und fair als Einkaufskriterien, ohne sie gleichzusetzen.",
      "Regional betrifft die räumliche Herkunft und kann kürzere Wege ermöglichen. Fairer Handel betrifft bestimmte Handels- und Sozialstandards, die ich am jeweiligen Siegel prüfe. Für ein Urteil ergänze ich Saison, Produktionsweise, Preis und Kontrolle; kein einzelnes Kriterium beantwortet alle Fragen.",
      [
        "Ich erkläre beide Kriterien unterschiedlich.",
        "Ich nenne nötige zusätzliche Angaben.",
        "Ich formuliere ein begründetes Urteil.",
      ],
      "Eine neue Förderung belohnt Hecken auf Äckern. Wer könnte welche Interessen haben und wie prüfst du die Wirkung?",
      "Ein Betrieb kann zusätzlichen Aufwand und Flächenverlust gegen Zahlungen abwägen, Naturschutzakteure erwarten Lebensräume, die Öffentlichkeit begründet den Mitteleinsatz. Ich prüfe Standort, Pflege, Einkommenseffekt und beobachtete ökologische Wirkung statt nur die Förderabsicht zu übernehmen.",
      [
        "Ich berücksichtige mehrere Beteiligte.",
        "Ich trenne Förderziel und gemessene Wirkung.",
        "Ich nenne wirtschaftliche und ökologische Prüfkriterien.",
      ],
    ),
  },
  {
    id: "geo-hunger",
    lb: 3,
    title: "Warum vorhandenes Essen nicht alle satt macht",
    period: "Ernährungssicherheit · Konflikte · Migration",
    intro:
      "Hunger entsteht nicht nur durch zu kleine Ernten. Zugang, Nutzung und Verlässlichkeit der Versorgung sind ebenso wichtig.",
    paragraphs: [
      "Ernährungssicherheit umfasst ausreichende Verfügbarkeit, wirtschaftlichen und räumlichen Zugang, eine angemessene Nutzung einschließlich gesunder Ernährung sowie Stabilität über die Zeit. Ein voller Markt hilft einer Familie nicht, wenn sie die Lebensmittel nicht bezahlen kann. Sauberes Wasser, Gesundheit und Lagerung beeinflussen, ob Nahrung tatsächlich genutzt werden kann.",
      "Dürre, Bodenschäden, Armut, Krieg, unterbrochene Verkehrswege und politische Entscheidungen können sich gegenseitig verstärken. Hunger kann zur Migration beitragen, aber nicht jede betroffene Person kann oder will den Ort verlassen; Migration hat meist mehrere Ursachen. Kurzfristige Hilfe und langfristige Maßnahmen an Einkommen, Frieden, Infrastruktur und angepasster Landwirtschaft erfüllen unterschiedliche Aufgaben.",
    ],
    takeaway:
      "Ernährungssicherheit ist mehr als globale Produktionsmenge; Menschen brauchen auch Zugang und dauerhafte Bedingungen.",
    sourceIds: ["fao-foodsecurity", "wfp-hunger", "iom"],
    quiz: check(
      "Was fehlt einer Familie, wenn Essen vorhanden, für sie aber unbezahlbar ist?",
      "Der wirtschaftliche Zugang zu Nahrung",
      ["Zwingend jede weltweite Nahrungsproduktion", "Ausschließlich ein anderer Monatskalender"],
      "Verfügbarkeit im Markt und bezahlbarer Zugang für Menschen sind verschiedene Dimensionen der Ernährungssicherheit.",
    ),
    workshop: classify(
      "Versorgungshürden erkennen",
      ["Verfügbarkeit", "Zugang", "Nutzung oder Stabilität"],
      [
        [
          "Eine Ernte fällt großflächig aus und Lieferwege fehlen.",
          0,
          "Es steht vor Ort weniger Nahrung zur Verfügung.",
        ],
        [
          "Ein Haushalt kann vorhandenes Getreide nicht bezahlen.",
          1,
          "Das Problem liegt hier beim wirtschaftlichen Zugang.",
        ],
        [
          "Unsicheres Wasser und wiederkehrende Unterbrechungen der Versorgung",
          2,
          "Gesunde Nutzung und dauerhafte Versorgung sind beeinträchtigt.",
        ],
      ],
      "Ein Fall kann mehrere Dimensionen zugleich betreffen; hier wird die ausdrücklich beschriebene Hürde geordnet.",
    ),
    tasks: tasks(
      "Erkläre an einem Beispiel, warum mehr Produktion allein Hunger nicht sicher beendet.",
      "Auch bei vorhandenen Lebensmitteln kann ein Haushalt hungern, wenn Einkommen oder sichere Wege zum Markt fehlen. Krankheiten und unsauberes Wasser erschweren die Nutzung der Nahrung. Eine Lösung muss daher zusätzlich Zugang, Gesundheit und die Verlässlichkeit der Versorgung verbessern.",
      [
        "Ich unterscheide Verfügbarkeit und Zugang.",
        "Ich ergänze Nutzung oder Stabilität.",
        "Ich leite eine passende Maßnahme ab.",
      ],
      "Eine Schlagzeile behauptet, jede Dürre führe zwangsläufig zu internationaler Flucht. Wie prüfst du sie?",
      "Dürre kann Lebensgrundlagen beeinträchtigen, doch Einkommen, Konflikte, Hilfen, familiäre Netze und Handlungsmöglichkeiten wirken mit. Manche Menschen ziehen innerhalb des Landes um, andere bleiben oder können nicht gehen. Ich suche konkrete Daten und Perspektiven, statt aus einem Naturereignis einen einzigen Migrationsweg abzuleiten.",
      [
        "Ich nenne mehrere Einflussfaktoren.",
        "Ich unterscheide mögliche Reaktionen.",
        "Ich fordere fallbezogene Belege.",
      ],
    ),
  },
  {
    id: "geo-hydroponik",
    lb: 3,
    title: "Gemüse ohne Ackerboden?",
    period: "Hydroponik · Chancen und Grenzen",
    intro:
      "In einer Hydroponik erhalten Pflanzen Wasser und gelöste Nährstoffe gezielt. Eine neue Technik muss zum Standort und zum Ziel passen.",
    paragraphs: [
      "Hydroponik ist Pflanzenanbau ohne Boden als Nährstoffquelle; die Wurzeln werden mit einer Nährlösung versorgt und können in einem Trägermaterial stehen. In geschlossenen Systemen lässt sich Wasser wiederverwenden. Das kann bei knapper Fläche oder ungeeigneten Böden hilfreich sein. Ein Gewächshaus, künstliches Licht oder eine Pumpe sind mögliche, aber nicht in jedem System identische Bestandteile.",
      "Die Technik erfordert Wissen, Investitionen und verlässliches Management von Wasser, Nährstoffen und Gesundheit der Pflanzen. Energiebedarf hängt stark von Klima, Beleuchtung und Anlagenbau ab. Ein Kreislauf kann Wasser sparen und dennoch hohe Energie- oder Anschaffungskosten verursachen. Vergleiche deshalb dieselbe Kultur, Menge und Systemgrenze; Hydroponik löst nicht allein Armut, Konflikte oder den Zugang zu Nahrung.",
    ],
    takeaway:
      "Eine Innovation bewertet man an konkreten Ressourcen, Kosten und Risiken, nicht allein an ihrem Namen.",
    sourceIds: ["fao-hydroponik", "fao-grenada", "fao-foodsecurity"],
    quiz: check(
      "Wodurch erhalten Pflanzen in einer Hydroponik ihre Mineralnährstoffe?",
      "Durch eine gezielt zusammengesetzte Nährlösung",
      [
        "Ausschließlich durch Licht ohne weitere Stoffe",
        "Grundsätzlich nur durch ungefiltertes Meerwasser",
      ],
      "Licht liefert Energie; Wasser und gelöste Mineralstoffe müssen passend bereitgestellt werden.",
    ),
    workshop: classify(
      "Chancen und Bedingungen",
      ["Mögliche Chance", "Zu prüfende Grenze"],
      [
        [
          "Wasser in einem geeigneten Kreislauf wiederverwenden",
          0,
          "Das kann den Wasserbedarf gegenüber einer Vergleichsnutzung senken.",
        ],
        [
          "Investition, Fachwissen und mögliche technische Ausfälle",
          1,
          "Diese Bedingungen können einen Betrieb begrenzen.",
        ],
        [
          "Strombedarf für Beleuchtung und Klimatisierung",
          1,
          "Der Bedarf ist standort- und systemabhängig und gehört in die Bilanz.",
        ],
      ],
      "Wassereffizienz und Energieeffizienz sind verschiedene Größen.",
    ),
    tasks: tasks(
      "Nenne zwei Chancen und zwei Bedingungen für Hydroponik an einem trockenen Standort.",
      "Ein geeigneter Kreislauf kann Wasser wiederverwenden und Anbau auf begrenzter Fläche ermöglichen. Gleichzeitig braucht er verlässliches Nährstoffmanagement, Wissen und finanzierbare Technik; je nach Ausführung kommt Energiebedarf hinzu. Ich vergleiche die tatsächliche Bilanz mit einer realistischen Alternative.",
      [
        "Ich nenne zwei plausible Chancen.",
        "Ich nenne zwei Bedingungen oder Risiken.",
        "Ich beziehe den Standort und eine Alternative ein.",
      ],
      "Ein Angebot verspricht wasserarmes Gemüse aus einem ganzjährig beleuchteten Gebäude. Wie bewertest du die Nachhaltigkeit?",
      "Ich prüfe Wasserverbrauch, Stromherkunft und -menge, Ertrag, Materialien, Kosten und Arbeitsbedingungen über denselben Zeitraum. Geringerer Wasserbedarf kann ein Vorteil sein, während Energie und Anschaffung stark ins Gewicht fallen. Ich vergleiche eine saisonale Alternative, bevor ich ein Gesamturteil bilde.",
      [
        "Ich betrachte mehrere Ressourcen.",
        "Ich verwende eine gemeinsame Systemgrenze.",
        "Ich begründe einen Vergleich statt eines Pauschalurteils.",
      ],
    ),
  },
];
