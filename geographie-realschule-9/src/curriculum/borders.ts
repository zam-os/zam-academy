import type { Lesson } from "../model/types";
import { check, classify, tasks, timeline } from "./helpers";

export const borders: Lesson[] = [
  {
    id: "geo-eu-karte",
    lb: 6,
    title: "Europa ist mehr als die Europäische Union",
    period: "Mitgliedstaaten · Vielfalt · Karten",
    model: "europe",
    intro:
      "Europa ist ein geographischer und historisch unterschiedlich abgegrenzter Raum. Die EU ist ein politischer Zusammenschluss mit festgelegter Mitgliedschaft.",
    paragraphs: [
      "Die Europäische Union hat beim Redaktionsstand 20. Oktober 2026 27 Mitgliedstaaten. Deutschland gehört dazu, Norwegen, die Schweiz und das Vereinigte Königreich gehören nicht dazu. Ein europäischer Staat ist also nicht automatisch EU-Mitglied. Auch Eurogebiet und Schengenraum sind andere Zusammenschlüsse mit teilweise unterschiedlicher Mitgliedschaft.",
      "Die EU umfasst unterschiedliche Sprachen, Landschaften, Wirtschafts- und Lebensbedingungen. Eine Länderkarte zeigt politische Flächen, keine einheitlichen Kulturen. Die Übersicht verwendet stark vereinfachte Natural-Earth-Umrisse und eine zusätzliche vollständige Staatenliste; kleine Inselstaaten sind über Marker erreichbar. Überseegebiete und rechtliche Grenzfragen lassen sich damit nicht vollständig darstellen.",
    ],
    takeaway:
      "Unterscheide Europa, EU, Eurogebiet und Schengenraum und prüfe jeweils den Datenstand.",
    sourceIds: ["eu-members", "eu-schengen", "naturalearth"],
    quiz: check(
      "Welcher Staat gehört beim Stand 20. Oktober 2026 zur EU?",
      "Kroatien",
      ["Norwegen", "Island"],
      "Kroatien ist seit 2013 Mitglied. Europa und EU sind nicht deckungsgleich.",
    ),
    workshop: classify(
      "Mitgliedschaft unterscheiden",
      ["EU-Mitglied", "Europäischer Staat außerhalb der EU"],
      [
        ["Deutschland", 0, "Deutschland gehört zu den Mitgliedstaaten der EU."],
        ["Norwegen", 1, "Norwegen liegt in Europa, ist aber kein EU-Mitglied."],
        ["Kroatien", 0, "Kroatien trat 2013 bei."],
        ["Vereinigtes Königreich", 1, "Es verließ die EU 2020."],
      ],
      "Die Zuordnung betrifft EU-Mitgliedschaft zum angegebenen Stand, nicht Euro oder Schengen.",
    ),
    tasks: tasks(
      "Erkläre mit zwei Staaten, warum Europa und EU nicht gleichbedeutend sind.",
      "Deutschland ist ein europäischer Staat und EU-Mitglied. Norwegen liegt ebenfalls in Europa, gehört aber nicht zur EU. Europa beschreibt einen räumlich-historischen Zusammenhang, die EU eine bestimmte politische Mitgliedschaft. Auch Schengenraum und Eurogebiet sind gesondert zu prüfen.",
      [
        "Ich nenne ein Mitglied und ein Nichtmitglied.",
        "Ich unterscheide Raum und politischen Zusammenschluss.",
        "Ich benenne den zeitlichen Stand.",
      ],
      "Eine Karte färbt alle Schengenstaaten als EU ein. Wie prüfst und korrigierst du sie?",
      "Ich vergleiche ihre Legende und ihr Datum mit offiziellen Mitgliederlisten beider Zusammenschlüsse. Schengen betrifft den gemeinsamen Raum ohne reguläre innere Grenzkontrollen, die EU eine weitergehende politische Mitgliedschaft. Die Mengen überlappen, sind aber nicht identisch; deshalb brauche ich getrennte Zeichen.",
      [
        "Ich prüfe Legende und Stand.",
        "Ich unterscheide die Zusammenschlüsse.",
        "Ich schlage eine eindeutige Kartendarstellung vor.",
      ],
    ),
  },
  {
    id: "geo-eu-erweiterung",
    lb: 6,
    title: "Wie EU-Erweiterung Räume verändert",
    period: "Erweiterungsschritte · Kandidaten · Alltag",
    intro:
      "Ein Beitrittskandidat ist noch kein Mitglied. Erweiterungen verbinden politische Bedingungen mit Veränderungen im Alltag.",
    paragraphs: [
      "Die europäische Integration begann mit sechs Staaten. Weitere Beitritte, darunter 1995 Österreich, Finnland und Schweden, die große Erweiterung 2004 und Kroatien 2013, veränderten den gemeinsamen Raum. Das Vereinigte Königreich verließ die EU 2020. Mitgliedschaft ist damit ein historischer Prozess und keine naturgegebene Grenze Europas.",
      "Beim Redaktionsstand 20. Oktober 2026 führt der Rat neun Kandidaten: Albanien, Bosnien und Herzegowina, Georgien, Moldau, Montenegro, Nordmazedonien, Serbien, Türkiye und Ukraine. Kandidatenstatus bedeutet weder einen garantierten Beitrittstermin noch denselben Verhandlungsstand. Erweiterung kann Handel, Lernen und Mobilität erleichtern, erfordert aber auch Anpassungen und eine Prüfung politischer und wirtschaftlicher Voraussetzungen. Interessen unterscheiden sich nach Region und Gruppe.",
    ],
    takeaway:
      "Ein Zukunftsurteil trennt geltende Mitgliedschaft, laufende Verfahren und mögliche Folgen.",
    sourceIds: ["eu-enlargement", "eu-history"],
    quiz: check(
      "Was bedeutet der EU-Kandidatenstatus?",
      "Ein Staat ist im Beitrittsprozess, aber noch kein Mitglied",
      [
        "Der Staat erhält automatisch am nächsten Tag Mitgliedschaft",
        "Alle Kandidaten haben bereits dieselben Rechte wie Mitglieder",
      ],
      "Beitritt setzt weitere Bedingungen und Entscheidungen voraus. Der Verhandlungsstand ist bei den Kandidaten verschieden.",
    ),
    workshop: timeline(
      [
        [
          "Beginn der europäischen Gemeinschaften mit sechs Staaten",
          "Die heutige EU entwickelte sich aus früheren Gemeinschaften.",
        ],
        ["Beitritt Österreichs, Finnlands und Schwedens 1995", "Diese Erweiterung liegt vor 2004."],
        [
          "Erweiterung um zehn Staaten 2004",
          "Der gemeinsame politische und wirtschaftliche Raum wurde deutlich größer.",
        ],
        [
          "Beitritt Kroatiens 2013",
          "Kroatien ist beim Redaktionsstand das zuletzt beigetretene Mitglied.",
        ],
        [
          "Austritt des Vereinigten Königreichs 2020",
          "Der Austritt zeigt, dass Grenzen eines Zusammenschlusses veränderlich sind.",
        ],
      ],
      "Die Auswahl ist keine vollständige Beitrittsliste. Prüfe für aktuelle Verfahren die datierte Quelle.",
    ),
    tasks: tasks(
      "Erläutere eine mögliche Chance und eine Herausforderung einer EU-Erweiterung für den Alltag.",
      "Ein größerer gemeinsamer Raum kann Austausch, Lernen und Handel erleichtern. Gleichzeitig müssen Institutionen und Betriebe Regeln umsetzen und unterschiedliche Ausgangsbedingungen berücksichtigen. Ich unterscheide geltende Rechte von möglichen zukünftigen Folgen und berücksichtige verschiedene betroffene Gruppen.",
      [
        "Ich nenne eine konkrete Chance.",
        "Ich erkläre eine Herausforderung.",
        "Ich trenne heutige Mitgliedschaft und Zukunft.",
      ],
      "Eine Meldung nennt einen Kandidaten bereits neues EU-Mitglied. Welche Prüfung brauchst du?",
      "Ich prüfe bei Rat oder Kommission den aktuellen Status und das Datum. Kandidatenstatus, eröffnete Verhandlungen und vollzogener Beitritt sind unterschiedliche Schritte. Ohne bestätigten Beitritt formuliere ich die Meldung als laufendes Verfahren und verzichte auf ein erfundenes Eintrittsdatum.",
      [
        "Ich nutze eine offizielle datierte Quelle.",
        "Ich unterscheide Verfahrensschritte.",
        "Ich korrigiere die Gewissheitsbehauptung.",
      ],
    ),
  },
  {
    id: "geo-globalisierung-bayern",
    lb: 6,
    title: "Von Donauwörth in die Welt",
    period: "Global Player · Wertschöpfung · Perspektiven",
    intro:
      "Globalisierung wird vor Ort sichtbar: in Arbeit, Produkten, Verkehr, Kommunikation und politischen Verflechtungen.",
    paragraphs: [
      "Airbus nennt Donauwörth als wichtigen deutschen Standort seiner Hubschrauberfertigung mit Montage und Erprobung ziviler und militärischer Modelle. Der bayerische Standort ist in internationale Liefer-, Wissens- und Absatzbeziehungen eingebunden. Die Unternehmensquelle belegt eigene Standorte und Tätigkeiten, bewertet deren gesellschaftliche Folgen aber aus einer interessengeleiteten Perspektive.",
      "Eine Wertschöpfungskette verbindet Rohstoffe, Bauteile, Entwicklung, Montage, Nutzung und Entsorgung. Internationale Arbeitsteilung kann Spezialisierung und Arbeitsplätze ermöglichen, zugleich entstehen Abhängigkeiten, Transportbelastungen und ungleiche Arbeitsbedingungen. Für ein Urteil betrachte ökologische, wirtschaftliche, soziale, kulturelle und politische Aspekte. Nicht jede Zulieferung eines konkreten Modells darf ohne Beleg einem bestimmten Land zugeordnet werden.",
    ],
    takeaway:
      "Globalisierung verbindet lokale Entscheidungen mit Folgen an anderen Orten; Quellen haben dabei unterschiedliche Perspektiven.",
    sourceIds: ["airbus", "fao-sustain", "lehrplan"],
    quiz: check(
      "Was zeigt das Beispiel Donauwörth geographisch besonders?",
      "Ein bayerischer Standort ist in internationale Beziehungen eingebunden",
      [
        "Jedes Bauteil wird sicher im selben Ort hergestellt",
        "Globalisierung betrifft ausschließlich weit entfernte Hauptstädte",
      ],
      "Globale Wertschöpfung und lokale Arbeit sind miteinander verbunden. Die konkrete Lieferkette muss belegt werden.",
    ),
    workshop: classify(
      "Folgen räumlich und fachlich ordnen",
      ["Wirtschaftlich", "Ökologisch", "Politisch oder sozial-kulturell"],
      [
        [
          "Spezialisierte Arbeitsplätze und Abhängigkeit von Absatzmärkten",
          0,
          "Chancen und Risiken betreffen Einkommen und Produktion.",
        ],
        [
          "Ressourcenbedarf und Emissionen über den Lebenszyklus",
          1,
          "Die Umweltwirkung reicht über die Montage hinaus.",
        ],
        [
          "Exportentscheidungen, Arbeitsbedingungen und internationale Zusammenarbeit",
          2,
          "Regeln und menschliche Beziehungen prägen die Verflechtung.",
        ],
      ],
      "Eine Unternehmensmeldung ist ein Ausgangspunkt, kein vollständiger Wirkungsnachweis.",
    ),
    tasks: tasks(
      "Erkläre am Beispiel Donauwörth eine lokale Chance und eine überörtliche Abhängigkeit der Globalisierung.",
      "Die Hubschrauberfertigung kann am Standort spezialisierte Arbeitsplätze und Wissen bündeln. Zugleich ist sie von internationalen Zulieferungen, Absatzbedingungen und politischen Regeln abhängig. Ich prüfe die konkrete Beziehung mit Quellen und ergänze die Unternehmenssicht durch andere Perspektiven.",
      [
        "Ich nenne den bayerischen Standort.",
        "Ich verknüpfe lokale Chance und externe Abhängigkeit.",
        "Ich ordne die Unternehmensquelle ein.",
      ],
      "Ein Betrieb nennt nur die Emissionen der Endmontage. Reicht das für die Klimabilanz eines Produkts?",
      "Die Endmontage ist nur ein Teil des Lebenszyklus. Rohstoffe, Bauteile, Transporte, Nutzung und Entsorgung können weitere Emissionen verursachen. Ich brauche eine klar abgegrenzte Gesamtbilanz und vergleiche dieselbe Funktion und Nutzungsdauer, bevor ich die Umweltwirkung beurteile.",
      [
        "Ich benenne fehlende Prozessschritte.",
        "Ich erkläre die Systemgrenze.",
        "Ich fordere einen vergleichbaren Maßstab.",
      ],
    ),
  },
  {
    id: "geo-fussabdruck",
    lb: 6,
    title: "Was der ökologische Fußabdruck misst",
    period: "Ressourcen · Nachhaltigkeit · Grenzen einer Kennzahl",
    intro:
      "Der ökologische Fußabdruck übersetzt einen Teil des Ressourcenverbrauchs in Flächenbedarf. Er ist eine Hilfe, keine vollständige Umweltbilanz.",
    paragraphs: [
      "Der ökologische Fußabdruck beschreibt den rechnerischen Bedarf an biologisch produktiven Land- und Wasserflächen für konsumierte Ressourcen und bestimmte Abfälle, besonders für die Aufnahme von Kohlendioxid. Verglichen wird dieser Bedarf mit der Biokapazität. Häufig wird in globalen Hektar gerechnet; das ist eine standardisierte Flächeneinheit, nicht einfach die Grundstücksfläche eines Haushalts.",
      "Die Kennzahl erfasst nicht sämtliche Schadstoffe, Wasserprobleme oder Aspekte der Artenvielfalt. Ein kleinerer Fußabdruck beweist deshalb nicht allein vollständige Nachhaltigkeit. Für Entscheidungen werden ökologische Grenzen mit wirtschaftlicher Tragfähigkeit und sozialer Gerechtigkeit verbunden. Prüfe Datenjahr, Konsumzuordnung und Systemgrenze; ein symbolischer Erdanzahlwert ist keine genaue Vorhersage eines Zusammenbruchsdatums.",
    ],
    takeaway:
      "Der Fußabdruck ist ein bestimmter Flächenindikator; Nachhaltigkeit braucht zusätzliche ökologische und soziale Kriterien.",
    sourceIds: ["footprint", "fao-sustain"],
    quiz: check(
      "Wie heißt der Indikator für den rechnerischen Bedarf an biologisch produktiver Fläche für einen Lebensstil?",
      "Der ökologische Fußabdruck",
      ["Die jährliche Niederschlagssumme", "Der Saldo der Binnenwanderung"],
      "Der ökologische Fußabdruck setzt Ressourcenverbrauch und bestimmte Abfälle in einen standardisierten Flächenbezug. Er misst nicht alle Umweltwirkungen.",
    ),
    workshop: classify(
      "Was kann die Kennzahl zeigen?",
      ["Teil des Indikators", "Zusätzlich zu untersuchen"],
      [
        [
          "Rechnerisch beanspruchte biologisch produktive Fläche",
          0,
          "Das ist der Kern des Flächenindikators.",
        ],
        [
          "Alle Folgen eines giftigen Stoffes für jede Tierart",
          1,
          "Eine Flächenkennzahl bildet nicht jede Schadstoffwirkung ab.",
        ],
        [
          "Soziale Gerechtigkeit und faire Arbeitsbedingungen",
          1,
          "Diese Nachhaltigkeitsfragen brauchen weitere Maßstäbe.",
        ],
      ],
      "Das Benennen von Grenzen macht einen Indikator sinnvoll nutzbar, statt ihn als Gesamturteil zu überdehnen.",
    ),
    tasks: tasks(
      "Erkläre den ökologischen Fußabdruck und nenne eine wichtige Aussagegrenze.",
      "Der ökologische Fußabdruck schätzt den Bedarf an biologisch produktiver Fläche für Ressourcen und bestimmte Abfälle, insbesondere Kohlendioxid. Er kann mit der Biokapazität verglichen werden. Er bildet jedoch nicht alle Schadstoffe, Artenverluste oder sozialen Bedingungen ab; dafür brauche ich zusätzliche Informationen.",
      [
        "Ich benenne den Flächenbezug.",
        "Ich erkläre Bedarf und Biokapazität.",
        "Ich nenne eine konkrete Grenze.",
      ],
      "Zwei Produkte haben denselben Fußabdruck, aber unterschiedliche Arbeitsbedingungen. Sind sie gleich nachhaltig?",
      "Der gleiche Flächenindikator entscheidet nicht über soziale Bedingungen und erfasst auch nicht jede Umweltwirkung. Ich ergänze faire Arbeit, Schadstoffe, Haltbarkeit und weitere relevante Kriterien. Mein Urteil nennt die Gewichtung und berücksichtigt, dass eine Kennzahl nur einen Teil der Nachhaltigkeit beschreibt.",
      [
        "Ich begrenze die Gleichsetzung.",
        "Ich ergänze soziale und ökologische Kriterien.",
        "Ich begründe mein Urteil mit offenem Maßstab.",
      ],
    ),
  },
  {
    id: "geo-grenzenwandel",
    lb: 6,
    title: "Grenzen entstehen und verlieren Bedeutung",
    period: "Deutschland · Europa · weltweites Beispiel",
    intro:
      "Grenzen sind politische und historische Ergebnisse. Ihr Verlauf, ihre Durchlässigkeit und ihre Wirkung können sich verschieden verändern.",
    paragraphs: [
      "In Deutschland verlor die innerdeutsche Grenze mit der staatlichen Einheit am 3. Oktober 1990 ihre Funktion als Staatsgrenze. In Europa verändert der Schengenraum die Bedeutung vieler Binnengrenzen für den Alltag; die Staatsgrenzen und unterschiedliche Rechtsordnungen bestehen weiter. EU-Mitgliedschaft und Schengenmitgliedschaft sind nicht dasselbe, und Kontrollen können unter bestimmten Bedingungen wieder auftreten.",
      "Als weltweites Beispiel schuf die Teilung Britisch-Indiens 1947 neue Staaten und Grenzen; sie war mit massenhafter Flucht und Gewalt verbunden. Der Konflikt um Kaschmir zeigt, dass Grenzfragen langfristig umstritten bleiben können. Das Beispiel steht nicht für alle Grenzen. Vergleiche jeweils Entstehung, betroffene Gruppen und spätere Veränderungen, statt nur Linien auf Karten auswendig zu lernen.",
    ],
    takeaway:
      "Grenzverlauf, staatliche Zugehörigkeit und alltägliche Durchlässigkeit sind getrennt zu untersuchen.",
    sourceIds: ["einheit", "eu-schengen", "partition", "kaschmir"],
    quiz: check(
      "Was verändert Schengen an einer Binnengrenze grundsätzlich?",
      "Die Durchführung regulärer Personengrenzkontrollen",
      ["Die Existenz aller beteiligten Staaten", "Automatisch jede Sprache und jedes Landesgesetz"],
      "Schengen verändert die Grenzpraxis, hebt aber die Staaten und ihre sämtlichen Unterschiede nicht auf.",
    ),
    workshop: classify(
      "Drei räumliche Ebenen",
      ["Deutschland", "Europa", "Weltweites Vergleichsbeispiel"],
      [
        [
          "Die innerdeutsche Grenze verliert 1990 ihre Staatsgrenzfunktion.",
          0,
          "Die staatliche Einheit verändert die politische Grenze.",
        ],
        [
          "Schengen verändert den Alltag an vielen Binnengrenzen.",
          1,
          "Der gemeinsame Kontrollraum ist von EU-Mitgliedschaft zu unterscheiden.",
        ],
        [
          "Die Teilung Britisch-Indiens 1947 schafft neue Grenzen.",
          2,
          "Das Beispiel zeigt Grenzentstehung und weitreichende Folgen außerhalb Europas.",
        ],
      ],
      "Grenzöffnung und Grenzauflösung sind verschiedene Vorgänge.",
    ),
    tasks: tasks(
      "Vergleiche den Wandel der innerdeutschen Grenze mit einer Schengen-Binnengrenze.",
      "Mit der deutschen Einheit 1990 endete die Staatsgrenzfunktion der innerdeutschen Grenze. Im Schengenraum bestehen Staatsgrenzen weiter, während reguläre Personenkontrollen an den Binnengrenzen grundsätzlich entfallen. Politischer Grenzverlauf und praktische Durchlässigkeit verändern sich also nicht auf dieselbe Weise.",
      [
        "Ich ordne die deutsche Einheit zeitlich ein.",
        "Ich unterscheide Auflösung und Kontrollpraxis.",
        "Ich erkläre eine Alltagsfolge.",
      ],
      "Was ergänzt der Vergleich mit der Teilung Britisch-Indiens 1947 zu einer europäischen Grenzkarte?",
      "Er zeigt, dass neue politische Grenzen mit Flucht, Gewalt und langfristigen Streitfragen verbunden sein können. Ich vergleiche Entstehungsbedingungen und Betroffenenperspektiven, ohne alle historischen Fälle gleichzusetzen. Eine heutige Linie allein erklärt weder ihre Entstehung noch ihre Folgen.",
      [
        "Ich benenne Grenzentstehung und Folgen.",
        "Ich berücksichtige Betroffene und historischen Kontext.",
        "Ich vermeide eine pauschale Gleichsetzung.",
      ],
    ),
  },
];
