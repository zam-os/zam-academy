import type { Lesson } from "../model/types";
import { check, classify, tasks, timeline } from "./helpers";

export const climate: Lesson[] = [
  {
    id: "geo-wetter-klima",
    lb: 2,
    title: "Wetter beobachten, Klima vergleichen",
    period: "Deutschland und Europa · Daten lesen",
    model: "climate",
    intro:
      "Ein regnerischer Dienstag beschreibt das Wetter. Für Klima brauchst du viele Jahre und eine eindeutige Bezugsperiode.",
    paragraphs: [
      "Wetter ist der momentane Zustand der Atmosphäre an einem Ort. Klima beschreibt Verteilungen, Mittelwerte und Schwankungen über längere Zeiträume; für Klimanormalwerte verwendet man üblicherweise 30 Jahre. Ein Klimadiagramm zeigt häufig Monatsmittel der Temperatur und Monatssummen des Niederschlags im langjährigen Mittel. Einheit, Zeitraum und Messort gehören zur Aussage.",
      "Breitenlage, Höhe, Entfernung zum Meer, Meeresströmungen und Relief beeinflussen das Klima. Westeuropa erhält häufig milde, feuchte Atlantikluft; weiter im Inneren des Kontinents können die jahreszeitlichen Temperaturunterschiede größer sein. Gebirge können Niederschlag auf der Luvseite fördern und die Leeseite trockener halten. Das sind Muster, keine Garantie für jeden Tag.",
      "Der DWD gibt für Deutschland 2024 eine Jahresmitteltemperatur von 10,9 °C an, gegenüber 8,2 °C in der Referenzperiode 1961–1990. Die Differenz beträgt 2,7 Kelvin beziehungsweise 2,7 °C Temperaturunterschied. Das ist ein Jahreswert, kein Monatsdiagramm und keine Aussage über jeden einzelnen Ort. Die beiden Diagramme im Modell sind ausdrücklich erfundene Übungsdaten, keine Stationsmessungen.",
    ],
    takeaway:
      "Vergleiche nur Daten mit klaren Einheiten, Orten und Zeiträumen; ein Wetterereignis allein belegt keinen Klimatrend.",
    sourceIds: ["dwd2024", "dwd-klima"],
    quiz: check(
      "Welche Angabe beschreibt Klima statt eines einzelnen Wetterereignisses?",
      "Monatsmittel über dreißig Jahre",
      ["Ein Gewitter am Dienstagnachmittag", "Die Temperatur um acht Uhr heute"],
      "Klima bezieht sich auf längerfristige statistische Eigenschaften und umfasst auch Schwankungen.",
    ),
    workshop: classify(
      "Was lässt sich aus Daten ableiten?",
      ["Belegt", "Nicht durch diese Daten belegt"],
      [
        [
          "Deutschland war 2024 im Flächenmittel 2,7 K wärmer als 1961–1990.",
          0,
          "10,9 minus 8,2 ergibt den Temperaturunterschied von 2,7 K.",
        ],
        [
          "Jeder Tag 2024 war an jedem Ort genau 2,7 K wärmer.",
          1,
          "Ein Jahres- und Flächenmittel macht keine solche Einzelangabe.",
        ],
        [
          "Eine einzelne kalte Woche widerlegt den langfristigen Erwärmungstrend.",
          1,
          "Witterungsschwankungen und langjährige Trends sind verschiedene Zeitskalen.",
        ],
      ],
      "Ein Mittelwert ist eine Zusammenfassung; er bewahrt nicht jede Einzelinformation.",
    ),
    tasks: tasks(
      "Erkläre den Unterschied zwischen Wetter und Klima an einem eigenen Beispiel und ordne den DWD-Wert 2024 ein.",
      "Ein kalter Morgen beschreibt Wetter an einem Ort und Zeitpunkt. Klima beschreibt dagegen die längerfristige Verteilung des Wetters. Die 10,9 °C für Deutschland 2024 sind ein Jahres- und Flächenmittel; der Vergleich mit 1961–1990 ergibt 2,7 K Unterschied, aber keine gleiche Erwärmung an jedem Tag.",
      [
        "Ich unterscheide die Zeitskalen.",
        "Ich benenne Ort, Jahr und Referenzperiode.",
        "Ich begrenze die Aussage des Mittelwerts.",
      ],
      "Zwei Städte liegen auf gleicher Breite, eine am Atlantik, die andere weit im Binnenland. Welche Klimahypothese würdest du mit Diagrammen prüfen?",
      "Ich erwarte am Meer eher kleinere jahreszeitliche Temperaturunterschiede und einen stärkeren maritimen Einfluss. Ich vergleiche Diagramme derselben Bezugsperiode und prüfe zusätzlich Höhe und Relief. Die Breitenlage allein erklärt nicht alle Unterschiede; eine Hypothese muss an Daten geprüft werden.",
      [
        "Ich formuliere eine prüfbare Vermutung.",
        "Ich verwende vergleichbare Diagramme.",
        "Ich berücksichtige weitere Klimafaktoren.",
      ],
    ),
  },
  {
    id: "geo-grosswetterlagen",
    lb: 2,
    title: "Atlantiktief oder Hoch über Osteuropa?",
    period: "Großwetterlagen · vernetzte Atmosphäre",
    intro:
      "Luftdruckgebiete organisieren Wetter über große Räume. Dieselbe Drucklage kann im Sommer und Winter sehr verschiedene Folgen haben.",
    paragraphs: [
      "In einem Tief steigt Luft häufig auf, kühlt sich ab und kann Wolken und Niederschlag bilden. Atlantische Tiefs bringen mit westlicher Strömung oft wechselhaftes Wetter nach Mitteleuropa. Fronten trennen unterschiedlich temperierte Luftmassen; der Durchzug kann Wind, Temperatur und Niederschlag rasch verändern.",
      "Ein länger bestehendes Hoch über Osteuropa kann westliche Tiefs blockieren. Absinkende Luft und geringe Wolkenbildung begünstigen im Sommer Hitze und Trockenheit; im Winter können kalte kontinentale Luft und bodennahe Inversionslagen auftreten. Entscheidend sind Lage, Jahreszeit und Herkunft der Luft. Ein Hoch bedeutet daher nicht immer warmes Wetter und ein Tief nicht an jedem Ort Dauerregen.",
    ],
    takeaway:
      "Druckverteilung, Luftströmung und Jahreszeit gehören gemeinsam zur Erklärung einer Wetterlage.",
    sourceIds: ["dwd-lagen"],
    quiz: check(
      "Warum bedeutet ein Hoch über Osteuropa nicht in jeder Jahreszeit Hitze?",
      "Die Herkunft der Luft und die Jahreszeit wirken mit",
      [
        "Hochdruck verhindert grundsätzlich jede Abkühlung",
        "Der Luftdruck legt die Temperatur allein fest",
      ],
      "Kontinentale Luft kann im Winter kalt und im Sommer warm sein. Die Drucklage allein bestimmt die Temperatur nicht.",
    ),
    workshop: classify(
      "Wetterlage erklären",
      ["Atlantische Westlage", "Blockierendes Hoch", "Aus der Angabe allein nicht ableitbar"],
      [
        [
          "Mehrere Tiefs ziehen vom Atlantik mit Fronten heran.",
          0,
          "Die westliche Strömung transportiert maritime Luft und Fronten.",
        ],
        [
          "Ein beständiges Hoch hält heranziehende Tiefs auf Abstand.",
          1,
          "Eine solche Lage kann die Zufuhr von Niederschlägen länger unterbrechen.",
        ],
        [
          "Morgen um 14 Uhr fallen in meinem Ort genau 12 mm Regen.",
          2,
          "Eine grobe Wetterlage liefert keine genaue lokale Niederschlagsmenge.",
        ],
      ],
      "Eine Wetterkarte liefert räumliche Zusammenhänge, keine unbegrenzt genauen Vorhersagen.",
    ),
    tasks: tasks(
      "Vergleiche mögliche Folgen einer Atlantik-Westlage und eines länger anhaltenden Sommerhochs.",
      "Eine Westlage kann milde, feuchte Atlantikluft und rasch wechselnde Fronten heranführen. Ein blockierendes Sommerhoch kann Niederschläge länger fernhalten und Hitze sowie Trockenheit begünstigen. Die genaue Wirkung hängt von Lage, Dauer und örtlichem Relief ab.",
      [
        "Ich beschreibe die Luftzufuhr.",
        "Ich verknüpfe Dauer und mögliche Folgen.",
        "Ich vermeide absolute Wetterregeln.",
      ],
      "Nach einer trockenen Woche behauptet jemand, Deutschland habe nun dauerhaft Wüstenklima. Wie entgegnest du fachlich?",
      "Eine Woche gehört zur Witterung und kann durch eine blockierende Lage entstehen. Ein dauerhafter Klimatyp lässt sich nur aus langfristigen Daten beurteilen. Ich prüfe die aktuelle Wetterkarte und daneben langjährige Temperatur- und Niederschlagsverteilungen, statt beide Zeitskalen gleichzusetzen.",
      [
        "Ich unterscheide Witterung und Klima.",
        "Ich nenne eine mögliche Wetterlage.",
        "Ich fordere passende langfristige Daten.",
      ],
    ),
  },
  {
    id: "geo-treibhauseffekt",
    lb: 2,
    title: "Wie Treibhausgase die Energiebilanz verändern",
    period: "Natürlicher und anthropogener Treibhauseffekt",
    model: "greenhouse",
    intro:
      "Die Erde erhält Energie von der Sonne und gibt Energie ins All ab. Treibhausgase beeinflussen vor allem die langwellige Wärmestrahlung.",
    paragraphs: [
      "Ein Teil der kurzwelligen Sonnenstrahlung wird reflektiert, ein anderer erwärmt Oberfläche und Atmosphäre. Die Erde sendet langwellige Infrarotstrahlung aus. Treibhausgase und Wolken absorbieren davon einen Teil und emittieren ebenfalls Infrarotstrahlung in verschiedene Richtungen. Dadurch ist die Oberfläche im natürlichen Gleichgewicht wärmer als ohne diesen Strahlungseffekt.",
      "Menschen erhöhen durch die Verbrennung fossiler Energieträger, Landnutzungsänderungen und weitere Tätigkeiten die Konzentration von Treibhausgasen, darunter Kohlendioxid und Methan. Die veränderte Strahlungsbilanz führt zur Erwärmung, bis mehr Energie wieder abgegeben werden kann. Wasserdampf wirkt dabei auch als Rückkopplung. Es entsteht keine luftdichte Decke, und das Ozonloch ist nicht die Hauptursache der heutigen Erwärmung.",
      "Das interaktive Ein-Schicht-Modell lässt nur einen abstrakten Absorptionsanteil ändern. Es ist eine idealisierte Energiebilanz ohne Wolken, Wetter, Ozeane oder Rückkopplungen. Der Regler entspricht keiner CO₂-Konzentration; die angezeigten Temperaturen sind Modellwerte und keine Klimaprognose.",
      "Nachhaltige Entwicklung verbindet den Schutz ökologischer Lebensgrundlagen, dauerhaft tragfähiges Wirtschaften und soziale Gerechtigkeit auch gegenüber künftigen Generationen. Das Drei-Säulen-Modell ordnet diese Perspektiven; Zielkonflikte müssen konkret begründet und planetare Grenzen beachtet werden. Ein Klimaschutzprojekt ist deshalb auch auf Kosten, Zugang und faire Verteilung zu prüfen.",
    ],
    takeaway:
      "Zusätzliche Treibhausgase verändern die Abgabe von Wärmestrahlung; sie erzeugen keine zusätzliche Sonnenenergie.",
    sourceIds: ["ipcc-greenhouse", "ipcc-ar6", "fao-sustain"],
    quiz: check(
      "Welche Strahlung absorbieren Treibhausgase bei diesem Prozess besonders?",
      "Langwellige Infrarotstrahlung der Erde",
      ["Ausschließlich sichtbares grünes Sonnenlicht", "Nur Radiowellen von Mobilfunkmasten"],
      "Treibhausgase absorbieren und emittieren in bestimmten Infrarotbereichen; die Energiebilanz verschiebt sich.",
    ),
    workshop: timeline(
      [
        [
          "Sonnenenergie wird teilweise an der Erdoberfläche aufgenommen",
          "Ein anderer Teil wird reflektiert; nicht jede Strahlung wird absorbiert.",
        ],
        [
          "Die erwärmte Oberfläche emittiert langwellige Strahlung",
          "Die Strahlungsart hängt unter anderem von der Temperatur des Körpers ab.",
        ],
        [
          "Treibhausgase absorbieren und emittieren einen Teil der Infrarotstrahlung",
          "Die Emission erfolgt in verschiedene Richtungen, auch zur Oberfläche.",
        ],
        [
          "Nach einer Störung passt sich die Temperatur bis zu einer neuen Energiebilanz an",
          "Rückkopplungen und Wärmespeicher beeinflussen den realen zeitlichen Verlauf.",
        ],
      ],
      "Die Reihenfolge ordnet eine Erklärung; in der Realität laufen diese Strahlungsprozesse gleichzeitig ab.",
    ),
    tasks: tasks(
      "Erkläre den natürlichen Treibhauseffekt und seine Verstärkung durch menschliche Tätigkeiten.",
      "Die Oberfläche nimmt Sonnenenergie auf und gibt langwellige Wärmestrahlung ab. Treibhausgase absorbieren und emittieren einen Teil davon, auch zurück zur Oberfläche. Zusätzliche Treibhausgase aus menschlichen Tätigkeiten verändern die Energiebilanz und verstärken die Erwärmung. Der natürliche Effekt bestand schon vorher.",
      [
        "Ich unterscheide kurz- und langwellige Strahlung.",
        "Ich beschreibe Absorption und Emission.",
        "Ich erkläre den zusätzlichen menschlichen Einfluss.",
      ],
      "Im Modell erwärmt ein höherer Absorptionsanteil die Oberfläche. Warum darfst du daraus nicht eine genaue Erwärmung bei doppeltem CO₂ ausrechnen?",
      "Der Regler ist ein abstrakter Anteil und keine gemessene CO₂-Konzentration. Das Ein-Schicht-Modell lässt unter anderem Rückkopplungen, Wolken und Wärmespeicherung weg. Es zeigt die Richtung eines vereinfachten Zusammenhangs, liefert aber keine belastbare Klimasensitivität oder zeitliche Vorhersage.",
      [
        "Ich erkläre die Bedeutung des Reglers.",
        "Ich nenne ausgelassene Prozesse.",
        "Ich unterscheide Modellzusammenhang und Prognose.",
      ],
    ),
  },
  {
    id: "geo-klimafolgen",
    lb: 2,
    title: "Wenn Atmosphäre, Wasser, Eis und Leben zusammenwirken",
    period: "Geosphären · Folgen und Rückkopplungen",
    intro:
      "Klimawandel betrifft mehrere Geosphären zugleich. Eine Wirkung kann weitere Veränderungen verstärken oder abschwächen.",
    paragraphs: [
      "Erwärmung verändert Verdunstung und Niederschlagsmuster, Gletscher verlieren Masse und Meerwasser dehnt sich bei Erwärmung aus. Das betrifft Hydrosphäre, Kryosphäre, Böden und Lebewesen. Schwindet helles Eis, kann die dunklere Oberfläche mehr Sonnenenergie aufnehmen: eine verstärkende Eis-Albedo-Rückkopplung. Regional können Veränderungen sehr verschieden ausfallen.",
      "Für Menschen können sich Wasserverfügbarkeit, Ernten, Hitzebelastung, Infrastruktur und Küstenrisiken verändern. Das Risiko hängt neben der Naturgefahr auch davon ab, wer und was exponiert ist und wie verletzlich diese Menschen oder Einrichtungen sind. Ein globaler Temperaturmittelwert beschreibt deshalb nicht allein die örtlichen Schäden. Aussagen zu einzelnen Ereignissen brauchen eigene Untersuchungen.",
    ],
    takeaway:
      "Klimafolgen entstehen durch verknüpfte Naturprozesse und gesellschaftliche Bedingungen.",
    sourceIds: ["ipcc-ar6", "hochwasser"],
    quiz: check(
      "Was verstärkt die Erwärmung bei der Eis-Albedo-Rückkopplung?",
      "Dunklere Flächen nehmen mehr Sonnenenergie auf",
      [
        "Weniger Eis reflektiert immer mehr Sonnenlicht",
        "Das Verschwinden von Eis beendet jede Verdunstung",
      ],
      "Dunkles Wasser oder Land reflektiert oft weniger als helles Eis und kann dadurch zusätzliche Energie aufnehmen.",
    ),
    workshop: classify(
      "Geosphären verknüpfen",
      ["Atmosphäre", "Hydro- und Kryosphäre", "Bio- und Pedosphäre"],
      [
        [
          "Die bodennahe Luft wird im langjährigen Mittel wärmer.",
          0,
          "Hier wird die Lufthülle beschrieben.",
        ],
        [
          "Gletscher verlieren Masse und Meerwasser erwärmt sich.",
          1,
          "Wasser und Eis reagieren auf die veränderte Energiebilanz.",
        ],
        [
          "Trockenstress verändert Vegetation und Bodenbedeckung.",
          2,
          "Lebewesen und Böden sind betroffen; die Sphären wirken weiter zusammen.",
        ],
      ],
      "Die Kategorien helfen beim Ordnen, trennen die Wirkungszusammenhänge aber nicht in unabhängige Systeme.",
    ),
    tasks: tasks(
      "Beschreibe eine Wirkungskette von Erwärmung über Eisverlust zu einer verstärkenden Rückkopplung.",
      "Erwärmung kann helle Eisflächen verkleinern. Die frei werdende dunklere Oberfläche reflektiert weniger Sonnenstrahlung und nimmt mehr Energie auf. Das kann die Erwärmung verstärken und weiteren Eisverlust begünstigen. Das ist eine Rückkopplung, nicht die ursprüngliche Ursache aller Erwärmung.",
      [
        "Ich verbinde mindestens drei Schritte.",
        "Ich erkläre die geänderte Reflexion.",
        "Ich unterscheide Ursache und Rückkopplung.",
      ],
      "Zwei Orte erleben dieselbe Hitze, aber sehr unterschiedliche Folgen. Welche zusätzlichen Informationen brauchst du?",
      "Ich brauche Angaben zu betroffenen Menschen und ihrer Verletzlichkeit, etwa Altersstruktur, Wohnbedingungen, Schatten, Trinkwasser und erreichbaren kühlen Räumen. Ebenso sind Dauer und nächtliche Abkühlung wichtig. Gleiche Lufttemperatur bedeutet deshalb nicht automatisch gleiche Belastung oder gleiche Schäden.",
      [
        "Ich berücksichtige Exposition und Verletzlichkeit.",
        "Ich nenne räumliche oder soziale Unterschiede.",
        "Ich begrenze eine Aussage allein aus Temperaturdaten.",
      ],
    ),
  },
  {
    id: "geo-extremereignisse",
    lb: 2,
    title: "Sturm, Dürre und Hochwasser untersuchen",
    period: "Ursachen · Folgen · Schutz",
    intro:
      "Extremereignisse haben unterschiedliche Ursachen. Schutz beginnt damit, Gefahr, Exposition und Verletzlichkeit auseinanderzuhalten.",
    paragraphs: [
      "Sturm entsteht bei großen Luftdruckunterschieden und kann Gebäude und Wälder schädigen. Längerer Niederschlagsmangel kann Dürre begünstigen; Hitze und hohe Verdunstung können sie verschärfen. Starkregen, Schneeschmelze, gesättigte Böden und ein dicht bebautes Einzugsgebiet können zu Hochwasser beitragen. Bei Sturzfluten ist oft auch die schnelle Konzentration des Abflusses entscheidend.",
      "Warnsysteme, geeignete Bau- und Raumplanung, Wasserrückhalt, angepasste Bewirtschaftung und technische Anlagen können Risiken mindern. Sie beseitigen nicht jede Gefahr. Unterscheide in einer Nachricht die gemessene Regenmenge, die Gefahrenkarte und den tatsächlich eingetretenen Schaden. Diese App liefert keine aktuelle Warnung; für ein reales Ereignis gelten die Informationen der zuständigen Warn- und Katastrophenschutzstellen.",
    ],
    takeaway:
      "Risiko wächst nicht allein mit der Naturgefahr, sondern auch mit gefährdeten Nutzungen und ihrer Verletzlichkeit.",
    sourceIds: ["hochwasser", "dwd-lagen", "bbk"],
    quiz: check(
      "Welche Angabe beschreibt Exposition gegenüber Hochwasser?",
      "Eine Schule liegt im möglichen Überschwemmungsgebiet",
      [
        "Die Luft hat heute einen bestimmten Druck",
        "Ein Fluss trägt seit Jahrhunderten denselben Namen",
      ],
      "Exposition beschreibt, welche Menschen, Gebäude oder Werte einer Gefahr räumlich ausgesetzt sind.",
    ),
    workshop: classify(
      "Risiko und Vorsorge",
      ["Gefahr", "Exposition", "Vorsorge"],
      [
        [
          "Sehr starker Regen trifft auf bereits gesättigte Böden.",
          0,
          "Das beschreibt Bedingungen für einen gefährlichen Abfluss.",
        ],
        [
          "Wohnhäuser stehen in einer überflutbaren Aue.",
          1,
          "Die Häuser sind der möglichen Überflutung ausgesetzt.",
        ],
        [
          "Freigehaltene Rückhalteflächen und ein eingeübter Warnablauf",
          2,
          "Beides kann das Risiko mindern; es ist kein Schutzversprechen.",
        ],
      ],
      "Für Entscheidungen sind örtliche Gefahrenkarten und zuständige Stellen maßgeblich, keine vereinfachte Schulrechnung.",
    ),
    tasks: tasks(
      "Erkläre, warum Starkregen nicht überall dieselben Hochwasserschäden verursacht.",
      "Vorfeuchte, Relief, Versiegelung und Gewässer beeinflussen, wie Wasser abfließt. Schäden hängen zusätzlich davon ab, ob Gebäude und Menschen im betroffenen Raum liegen und wie verletzlich sie sind. Rückhalt und Vorsorge können Folgen mindern, garantieren aber keine vollständige Sicherheit.",
      [
        "Ich nenne Abflussbedingungen.",
        "Ich berücksichtige Exposition und Verletzlichkeit.",
        "Ich nenne eine Vorsorge mit begrenzter Wirkung.",
      ],
      "Eine Nachricht erklärt einen einzelnen Sturm allein mit dem Klimawandel. Wie formulierst du eine fachlich vorsichtige Prüfung?",
      "Ich trenne die unmittelbare Wetterlage von möglichen langfristigen Änderungen der Wahrscheinlichkeit oder Stärke solcher Ereignisse. Für eine Zuordnung dieses Sturms brauche ich Messdaten und eine geeignete Attributionsstudie. Der allgemeine Erwärmungstrend allein ersetzt diese Untersuchung nicht.",
      [
        "Ich trenne Wetterursache und Klimatrend.",
        "Ich fordere geeignete Daten oder Studien.",
        "Ich vermeide einen unbelegten Einzelereignisschluss.",
      ],
    ),
  },
  {
    id: "geo-klimaschutz-anpassung",
    lb: 2,
    title: "Klimaschutz und Anpassung abwägen",
    period: "Politik · Alltag · unterschiedliche Interessen",
    intro:
      "Emissionen verringern und mit Folgen umgehen sind zwei Aufgaben, die sich ergänzen. Ihre Kosten und Nutzen sind ungleich verteilt.",
    paragraphs: [
      "Klimaschutz begrenzt die Ursachen der Erwärmung, etwa durch geringeren Verbrauch fossiler Energie oder den Erhalt von Kohlenstoffspeichern. Anpassung mindert die Folgen veränderter Bedingungen, etwa durch Schatten, Wasserrückhalt oder hitzeangepasste Stadtplanung. Ein entsiegelter, begrünter Platz kann mehreren Zielen dienen, ersetzt jedoch nicht jede Emissionsminderung.",
      "Für eine begründete Entscheidung vergleicht man Wirkung, Kosten, soziale Verteilung, Zeitrahmen und Umsetzbarkeit. Eine Kommune, ein Betrieb und ein Haushalt haben unterschiedliche Handlungsmöglichkeiten. Prüfe bei einem Klimaversprechen die Systemgrenze: Ist Herstellung einbezogen? Wird nur eine Menge je Produkt oder die Gesamtmenge betrachtet? Individuelle Entscheidungen und politische Infrastruktur beeinflussen sich gegenseitig.",
    ],
    takeaway:
      "Ein Urteil nennt einen Maßstab, wägt Perspektiven ab und legt offen, welche Informationen fehlen.",
    sourceIds: ["ipcc-ar6", "muenchen-step", "uba-klima"],
    quiz: check(
      "Welche Maßnahme dient vor allem der Klimaanpassung?",
      "Mehr schattige Aufenthaltsorte bei Hitze schaffen",
      [
        "Fossile Brennstoffe durch erneuerbare Energie ersetzen",
        "Emissionen einer Fabrik an der Quelle vermeiden",
      ],
      "Schatten mindert eine Folge von Hitze. Die anderen Beispiele zielen vorrangig auf die Ursachen der Erwärmung.",
    ),
    workshop: classify(
      "Ziele einer Maßnahme",
      ["Vorwiegend Klimaschutz", "Vorwiegend Anpassung", "Beides möglich"],
      [
        [
          "Ölverbrauch durch eine geeignete erneuerbare Wärmeversorgung senken",
          0,
          "Weniger fossile Verbrennung kann die Treibhausgasemissionen vermindern.",
        ],
        [
          "Ein Hitzeaktionsplan für gefährdete Gruppen",
          1,
          "Er soll gesundheitliche Folgen hoher Temperaturen begrenzen.",
        ],
        [
          "Stadtbäume erhalten, die Kohlenstoff speichern und Schatten spenden",
          2,
          "Speicherung und Kühlung verbinden beide Ziele, mit Grenzen bei Trockenheit und Platz.",
        ],
      ],
      "Die Wirkung muss im konkreten Lebenszyklus und Standort geprüft werden.",
    ),
    tasks: tasks(
      "Vergleiche je eine Maßnahme für Klimaschutz und Anpassung an einer Schule.",
      "Eine geeignete Wärmeversorgung mit weniger fossilem Energieverbrauch kann Emissionen senken und dient dem Klimaschutz. Beschattung und ein Hitzekonzept erleichtern den Umgang mit heißen Tagen und dienen der Anpassung. Ich vergleiche Kosten, tatsächliche Wirkung und die Bedürfnisse der besonders betroffenen Schülerinnen und Schüler.",
      [
        "Ich unterscheide Ursachen und Folgen.",
        "Ich wende beide Ziele auf die Schule an.",
        "Ich nenne einen Entscheidungsmaßstab.",
      ],
      "Ein Betrieb wirbt mit zehn Prozent weniger Emissionen je Produkt, produziert aber deutlich mehr. Was musst du prüfen?",
      "Die Emissionen je Stück können sinken, während die Gesamtmenge durch höhere Produktion wächst. Ich brauche Produktionsmenge, Ausgangsjahr, erfasste Prozessschritte und absolute Emissionen. Erst damit kann ich das Versprechen beurteilen und fragen, wie Nutzen und Kosten verteilt sind.",
      [
        "Ich unterscheide relative und absolute Mengen.",
        "Ich prüfe Zeitraum und Systemgrenze.",
        "Ich begründe, warum die Werbung allein nicht genügt.",
      ],
    ),
  },
  {
    id: "geo-ozon",
    lb: 2,
    title: "Ozon: Auf die Höhe kommt es an",
    period: "Atmosphäre · Schadstoff und Schutzschicht",
    intro:
      "Dasselbe Molekül kann je nach Ort unterschiedliche Wirkungen haben. Ozon in Bodennähe und die Ozonschicht sind auseinanderzuhalten.",
    paragraphs: [
      "In der Stratosphäre absorbiert Ozon einen Teil der energiereichen UV-Strahlung und schützt so das Leben an der Oberfläche. Der Abbau dieser Schicht durch bestimmte langlebige Stoffe wird als Ozonabbau beschrieben. Das ist ein anderer Hauptmechanismus als die Verstärkung des Treibhauseffekts durch zusätzliche Treibhausgase.",
      "Bodennahes Ozon entsteht bei intensiver Sonneneinstrahlung durch chemische Reaktionen aus Vorläuferstoffen, unter anderem Stickstoffoxiden und flüchtigen organischen Verbindungen. Es kann Menschen und Pflanzen belasten. Ozon ist zugleich ein Treibhausgas; deshalb sind die Themen verknüpft, aber nicht identisch. Eine Aussage muss Höhe, Bildungsprozess und betrachtete Wirkung nennen.",
    ],
    takeaway:
      "Ozonschutz, Luftreinhaltung und Klimaschutz haben Schnittstellen, lassen sich aber nicht gleichsetzen.",
    sourceIds: ["uba-ozon", "wmo-ozon", "ipcc-greenhouse"],
    quiz: check(
      "Welche Aussage zur stratosphärischen Ozonschicht trifft zu?",
      "Sie absorbiert einen Teil der UV-Strahlung",
      [
        "Sie ist die Hauptquelle des fossilen Kohlendioxids",
        "Sie verhindert jede langwellige Ausstrahlung",
      ],
      "Die UV-Absorption der Ozonschicht unterscheidet sich vom infraroten Strahlungseffekt der Treibhausgase.",
    ),
    workshop: classify(
      "Wirkungen auseinanderhalten",
      ["Stratosphärisches Ozon", "Bodennahes Ozon", "Zusätzliche Treibhausgase allgemein"],
      [
        [
          "Schutz durch Aufnahme eines Teils der UV-Strahlung",
          0,
          "Die Höhe der Ozonschicht ist entscheidend für diese Schutzfunktion.",
        ],
        [
          "Sommerliche Bildung aus Vorläuferstoffen bei Sonnenlicht",
          1,
          "Ozon wird bodennah meist nicht direkt ausgestoßen, sondern chemisch gebildet.",
        ],
        [
          "Veränderte Abgabe von Infrarotstrahlung bei erhöhten Konzentrationen",
          2,
          "Das ist der Zusammenhang mit dem verstärkten Treibhauseffekt.",
        ],
      ],
      "Ozon kann auch ein Treibhausgas sein; hier werden die jeweils beschriebenen Hauptwirkungen zugeordnet.",
    ),
    tasks: tasks(
      "Erkläre, warum weniger Ozon nicht überall dasselbe Ziel ist.",
      "In der Stratosphäre schützt Ozon vor einem Teil der UV-Strahlung, deshalb soll diese Schicht erhalten werden. In Bodennähe kann Ozon als Schadstoff Menschen und Pflanzen belasten; dort soll seine Entstehung aus Vorläuferstoffen begrenzt werden. Höhe und Wirkung sind also entscheidend.",
      [
        "Ich nenne beide Atmosphärenbereiche.",
        "Ich erläutere Schutz und Belastung.",
        "Ich unterscheide die entsprechenden Ziele.",
      ],
      "Ein Plakat sagt: Das Ozonloch lässt zusätzliche Wärme herein und verursacht deshalb die gesamte Erwärmung. Wie korrigierst du es?",
      "Der Ozonabbau betrifft vor allem den Schutz vor UV-Strahlung. Die heutige globale Erwärmung wird vor allem durch den menschlichen Anstieg von Treibhausgasen und die dadurch veränderte Infrarot-Energiebilanz erklärt. Es gibt Verknüpfungen, doch das Plakat setzt unterschiedliche Prozesse fälschlich gleich.",
      [
        "Ich benenne den UV-Zusammenhang.",
        "Ich erkläre die veränderte Infrarotbilanz.",
        "Ich ersetze die pauschale Gleichsetzung.",
      ],
    ),
  },
];
