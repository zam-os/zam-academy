import { classify, lesson } from "./helpers";

export const industry = [
  lesson(4, {
    id: "fabrik-alltag", title: "Vom Heimgewerbe zur Fabrik", period: "Ende des 18. und 19. Jahrhundert", sourceIds: ["industry", "bavarian-industry"],
    intro: "Vergleiche Arbeit, Wohnen und Umweltbedingungen vor und während der Industrialisierung.",
    paragraphs: [
      "Vor der Industrialisierung arbeiteten viele Menschen in der Landwirtschaft, im Handwerk oder im Heimgewerbe. In Heimarbeit spannen oder webten Familien häufig für Händler. Ihre Arbeitszeit konnte durch Aufträge und Not bestimmt sein, auch wenn kein Fabriktor den Beginn der Schicht festlegte.",
      "In der Industrialisierung konzentrierten Maschinen, Energieversorgung und Arbeitsteilung die Produktion zunehmend in Fabriken. Uhr und Aufsicht bestimmten den Arbeitsrhythmus. Menschen zogen auf der Suche nach Arbeit in Städte. Viele dortige Wohnungen waren eng, und Kohlerauch sowie Abwasser belasteten die Umwelt.",
      "Denk an einen Weber: Zu Hause hängt sein Verdienst oft von Bestellungen und Stücklohn ab. In der Fabrik bedient er eine Maschine im Rhythmus der Schicht. Beide Formen können knappe Einkommen erzeugen, aber Arbeitsort, Kontrolle und Produktionsmenge verändern sich.",
    ],
    takeaway: "Industrialisierung veränderte Technik, Alltag, Siedlungen und Umwelt zugleich.",
    check: ["Welcher Wandel zeigt, dass Industrialisierung über neue Maschinen hinausging?", "Fabrikorte wuchsen und Schichten änderten den Arbeitsalltag.", ["Alle Menschen zogen sofort in Städte.", "Heimgewerbe entstand erst mit der Dampfmaschine."], "Neue Arbeitsorte und Zeitregeln änderten das Zusammenleben. Ältere Arbeitsformen bestanden weiterhin."],
    workshop: classify("Arbeits- und Lebenswelten vergleichen", ["Heimgewerbe", "Arbeit in der Fabrik", "Folgen im Stadtviertel"], [
      ["Die Familie spinnt zu Hause Garn für einen Händler.", 0, "Produktion und Haushalt liegen am selben Ort."],
      ["Eine feste Schicht und die Maschine geben den Arbeitsrhythmus vor.", 1, "In der Fabrik wird Arbeit räumlich und zeitlich organisiert."],
      ["Viele neue Haushalte teilen sich wenige Wasserstellen.", 2, "Rasches Stadtwachstum kann Infrastruktur überlasten."],
      ["Rauch aus kohlebefeuerten Anlagen belastet die Luft.", 2, "Hier zeigt sich eine Umweltfolge über den Betrieb hinaus."],
    ], "Ein technischer Wandel verändert auch Beziehungen zwischen Arbeit, Wohnen und Umwelt."),
    guided: ["Erkläre an einem Beispiel, wie sich der Alltag einer Weberfamilie bei einem Wechsel in die Fabrik ändern konnte.", ["Wer bestimmt Arbeitsort und Zeit?", "Wie kann sich das Wohnen verändern?"], "In der Fabrik musste die Familie die Schichtzeiten einhalten und einen getrennten Arbeitsplatz aufsuchen. Zog sie in die Stadt, konnte sie näher am Betrieb wohnen, aber weniger Platz als bisher haben.", ["Früher und später verglichen", "Arbeitsrhythmus berücksichtigt", "Mögliche Wohnfolge erklärt"]],
    transfer: ["Vergleiche die Einführung von Fabrikmaschinen und digital gesteuerten Arbeitsabläufen. Nenne eine Ähnlichkeit und eine Grenze des Vergleichs.", ["Wer kann Tempo und Aufgaben bestimmen?", "Erfordert die neue Arbeit einen gemeinsamen Arbeitsort?"], "In beiden Fällen kann Technik den Takt vorgeben und Arbeitsaufgaben neu verteilen. Fabrikmaschinen bündelten Arbeit oft an einem Ort. Digitale Werkzeuge können in manchen Berufen Zusammenarbeit über verschiedene Orte erleichtern. Welche Folgen eintreten, hängt auch von Regeln und Entscheidungen ab.", ["Ähnlichkeit erläutert", "Konkreter Unterschied", "Vergleich begrenzt"]],
  }),
  lesson(4, {
    id: "industrie-vergleich", title: "Warum begann der Wandel in England früher?", period: "18. und 19. Jahrhundert", sourceIds: ["bavarian-industry", "industry", "curriculum"],
    intro: "Baue aus Rohstoffen, Absatzmärkten, Kapital und Verkehr eine Erklärung für unterschiedliche Entwicklungen.",
    paragraphs: [
      "In England erleichterten Kohle, Kapital, Handel, wachsende Märkte und technische Entwicklungen den frühen Übergang zur Fabrikproduktion. Koloniale Handelsbeziehungen lieferten unter anderem Rohstoffe und Absatzmöglichkeiten. Keine einzelne Erfindung erklärt den ganzen Wandel.",
      "In den deutschen Staaten erschwerten im frühen 19. Jahrhundert Zollgrenzen und zersplitterte Märkte den Handel. Der Deutsche Zollverein ab 1834 und der Ausbau der Eisenbahn erleichterten den Absatz. In Bayern setzte der Wandel vor allem in einzelnen Zentren ein, etwa in der Textilindustrie Augsburgs und der Metall- und Maschinenindustrie Nürnbergs.",
      "1835 verband eine Eisenbahn Nürnberg und Fürth. Das zeigt Verkehrsinnovation in Bayern. Ob eine Bahn Industrie fördert, hängt zusätzlich von Anschlüssen, Kundschaft, Investitionen und Rohstoffen ab. In weniger gut verbundenen Gebieten blieb die Landwirtschaft länger besonders wichtig.",
    ],
    takeaway: "Erkläre Industrialisierung durch mehrere Antriebe und Hemmnisse. Berücksichtige regionale Unterschiede.",
    check: ["Warum kann eine Bahnverbindung Industrialisierung fördern?", "Sie kann Transporte beschleunigen und mehr Märkte erreichbar machen.", ["Sie sorgt unabhängig von Kundschaft für Gewinn.", "Sie ersetzt Investitionen und Rohstoffe."], "Verkehr erleichtert den Austausch. Produktion braucht auch Nachfrage, Rohstoffe und Kapital."],
    workshop: classify("Faktoren für den Wandel zuordnen", ["Früher Antrieb in England", "Hemmnis in deutschen Staaten", "Späterer Antrieb in Deutschland und Bayern"], [
      ["Kohle und Handelsnetze unterstützen die frühe englische Industrie.", 0, "Energie und Märkte wirkten zusammen."],
      ["Viele Zollgrenzen verteuern den Handel zwischen deutschen Staaten.", 1, "Die Zersplitterung kann den Absatz erschweren."],
      ["Der Zollverein senkt viele Binnenhandelsbarrieren.", 2, "Ein größerer gemeinsamer Markt erleichtert den Handel."],
      ["Die Bahn zwischen Nürnberg und Fürth entsteht.", 2, "Sie ist ein frühes Beispiel des bayerischen Bahnbaus."],
    ], "Ein Faktor hilft erst im Zusammenspiel mit weiteren Bedingungen."),
    guided: ["Erkläre, wie Zollverein und Bahnbau gemeinsam einem bayerischen Hersteller helfen konnten.", ["Was kostete der Handel vorher zusätzlich?", "Was verändert die Bahn beim Transport?"], "Der Zollverein senkte Handelsbarrieren zwischen Mitgliedstaaten. Der Bahnbau konnte Lieferungen beschleunigen. Zusammen konnten beide Veränderungen für einen Hersteller einen größeren Markt erreichbar machen.", ["Zollverein erklärt", "Wirkung der Bahn erklärt", "Beide Faktoren verbunden"]],
    transfer: ["Eine Region hat eine neue Bahn, aber kaum Kapital und wenig Nachfrage. Prüfe die Aussage, sie werde sich genauso entwickeln wie ein frühes englisches Industriegebiet.", ["Welche Voraussetzung liegt vor?", "Welche Faktoren fehlen?"], "Die Bahn erleichtert Transporte. Wenig Kapital erschwert den Kauf von Maschinen, und geringe Nachfrage macht Investitionen riskant. Gegenüber einem englischen Industriegebiet mit mehreren günstigen Voraussetzungen bleibt die Entwicklung deshalb offen.", ["Vorhandener Faktor", "Zwei begründete Hemmnisse", "Vergleichsurteil"]],
  }),
  lesson(4, {
    id: "industrie-daten", title: "Was zeigen Daten über den Strukturwandel?", period: "Deutsches Reich 1882–1907", sourceIds: ["occupations", "industry"],
    intro: "Lies eine historische Statistik und unterscheide Anteile, absolute Zahlen und mögliche Erklärungen.",
    paragraphs: [
      "Eine Statistik fasst erhobene Daten zusammen. Lies zuerst Titel, Zeitraum, Raum, Einheit und Kategorien. In dieser Darstellung bedeutet ein Prozentwert den Anteil an den erfassten Erwerbstätigen, die einem Wirtschaftsbereich zugeordnet wurden.",
      "Wenn der Anteil in Industrie, Handwerk, Bergbau und Bau wächst, verschiebt sich das Gewicht dieses Bereichs. Ein sinkender Anteil in der Landwirtschaft beweist für sich genommen nicht, dass dort absolut weniger Menschen arbeiteten: Die Gesamtzahl der Erwerbstätigen kann steigen.",
      "Beispiel: In einer Modellstadt sind 50 von 100 Personen in der Landwirtschaft tätig. Später sind es 60 von 200. Der Anteil fällt von 50 auf 30 Prozent, obwohl die absolute Zahl steigt. Für Ursachen brauchst du weitere Belege wie Berichte über Maschinen, Investitionen oder Wanderung.",
    ],
    takeaway: "Vergleiche zuerst gleiche Einheiten. Ein Anteil beschreibt eine Verteilung, die Ursache braucht weitere Belege.",
    check: ["Was gilt bei einem sinkenden landwirtschaftlichen Anteil?", "Die absolute Zahl kann trotzdem steigen.", ["Die absolute Zahl sinkt immer im gleichen Maß.", "Die Bevölkerung muss insgesamt sinken."], "Der Anteil hängt von der Größe der Gesamtgruppe ab. Deshalb kann sich die absolute Zahl anders entwickeln."],
    workshop: {
      ...classify("Beschreibung und Erklärung unterscheiden", ["Aus der Grafik ablesbar", "Mit der Grafik allein nicht entscheidbar"], [
        ["Der Anteil der Erwerbstätigen in der Landwirtschaft ist 1907 niedriger als 1882.", 0, "Die beiden Balken zeigen dieselbe Einheit für unterschiedliche Jahre."],
        ["Alle Landarbeiter zogen in große Städte.", 1, "Die Statistik verfolgt keine einzelnen Menschen."],
        ["Der Anteil in Industrie und Handwerk liegt 1907 höher als 1882.", 0, "Die Balken dieser Kategorie lassen sich vergleichen."],
        ["Die Eisenbahn war die einzige Ursache für den Wandel.", 1, "Aus zeitlichen Verläufen allein lässt sich keine eindeutige Ursache ableiten."],
      ], "Eine Statistik liefert einen Befund. Eine Erklärung verknüpft ihn mit anderen historischen Belegen."),
      dataTable: { title: "Erwerbstätige im Deutschen Reich", unit: "Anteil an den Erwerbstätigen in Prozent", rows: [
        { label: "Landwirtschaft 1882", value: 43.4 }, { label: "Landwirtschaft 1907", value: 35.2 },
        { label: "Industrie, Handwerk, Bergbau, Bau 1882", value: 33.7 }, { label: "Industrie, Handwerk, Bergbau, Bau 1907", value: 40.1 },
      ], sourceId: "occupations", note: "Anteile berechnet aus den Erwerbstätigen der Sektoren A bis E. Die Erfassung mithelfender Frauen in der Landwirtschaft änderte sich. Auswahl zweier Wirtschaftsbereiche. Die Anteile der zwei gezeigten Bereiche ergeben deshalb je Jahr weniger als 100 Prozent." },
    },
    guided: ["Beschreibe je eine Veränderung in der Landwirtschaft und in Industrie, Handwerk, Bergbau und Bau. Verwende die richtige Einheit.", ["Welche Balken gehören zusammen?", "Welcher Anteil steigt oder sinkt?"], "Der Anteil der Landwirtschaft sinkt von 43,4 auf 35,2 Prozent. Der Anteil von Industrie, Handwerk, Bergbau und Bau steigt von 33,7 auf 40,1 Prozent. Die Verteilung der erfassten Erwerbstätigen verändert sich.", ["Zwei Bereiche beschrieben", "Werte richtig übernommen", "Anteile benannt"]],
    transfer: ["Skizziere ein eigenes Diagramm mit den zwei Branchen und erkläre, welche zusätzliche Zahl du für absolute Vergleiche brauchst.", ["Welche Achse trägt die Anteile?", "Wie kommst du vom Anteil zur Zahl der Menschen?"], "Ich zeichne je Bereich zwei Balken mit einer von null beginnenden Prozentachse und einer Legende für die beiden Jahre. Für absolute Zahlen brauche ich die Gesamtzahl der Erwerbstätigen in jedem Jahr, mit der ich die jeweiligen Anteile verrechne.", ["Eigene grafische Darstellung geplant", "Vergleichbare Skala und Legende", "Zusatzangabe begründet"]],
  }),
  lesson(4, {
    id: "soziale-frage", title: "Wer sollte die Soziale Frage lösen?", period: "19. Jahrhundert", sourceIds: ["industry", "kaiserreich", "curriculum"],
    intro: "Vergleiche, was Gewerkschaften, Betriebe, Staat und sozialistische Bewegungen verändern wollten.",
    paragraphs: [
      "Die Soziale Frage bündelt Probleme wie sehr niedrige Löhne, lange Arbeitszeit, Wohnungsnot und fehlende Absicherung bei Krankheit oder Unfall. Familien mussten bei einem Verdienstausfall oft selbst für das Einkommen aufkommen.",
      "Gewerkschaften organisierten Beschäftigte für bessere Arbeitsbedingungen. Manche Unternehmer bauten Werkswohnungen oder unterstützten Beschäftigte freiwillig. Kirchen und Vereine halfen in Notlagen. Der Staat konnte Schutzregeln und Versicherungen gesetzlich einführen.",
      "Sozialismus bezeichnet unterschiedliche Ideen für eine gerechtere Ordnung, die wirtschaftliche Ungleichheit grundlegend ändern wollen. Marx und Engels kritisierten den Gegensatz zwischen Kapital und Lohnarbeit. Kommunismus bezeichnet in dieser Tradition das Ziel einer klassenlosen Gesellschaft mit gemeinschaftlichem Eigentum an Produktionsmitteln.",
      "Beispiel: Eine Werkswohnung hilft einer Familie, kann sie aber stärker an den Betrieb binden. Ein gesetzlicher Anspruch lässt sich unabhängig vom guten Willen eines einzelnen Unternehmers durchsetzen. Er kann trotzdem nur bestimmte Gruppen einschließen.",
    ],
    takeaway: "Vergleiche Lösungen danach, wer sie trägt, wem sie helfen und welche Abhängigkeiten bleiben.",
    check: ["Welche Lösung ist kollektive Selbsthilfe von Beschäftigten?", "Beschäftigte schließen sich für Verhandlungen und bessere Arbeitsbedingungen zusammen.", ["Der Betrieb vergibt freiwillig Werkswohnungen.", "Der Staat führt eine Pflichtversicherung ein."], "Hier handeln die Beschäftigten selbst gemeinsam. Die anderen Ansätze haben andere Träger."],
    workshop: classify("Lösungsansätze zur Sozialen Frage", ["Selbstorganisation", "Hilfe des Betriebs oder Vereins", "Staatliche Regelung", "Umbau der Gesellschaft"], [
      ["Beschäftigte gründen eine Gewerkschaft.", 0, "Sie bündeln ihre Interessen selbst."],
      ["Ein Betrieb baut Wohnungen für seine Belegschaft.", 1, "Die Hilfe hängt vom Betrieb und seinem Angebot ab."],
      ["Das Reich führt eine Pflichtversicherung ein.", 2, "Ein Gesetz legt Schutz und Beiträge fest."],
      ["Produktionsmittel sollen gemeinschaftlich besessen werden.", 3, "Dieses Ziel greift bei den Eigentumsverhältnissen an."],
    ], "Jeder Ansatz verändert andere Ursachen oder Folgen sozialer Unsicherheit."),
    guided: ["Vergleiche eine Werkswohnung und Gewerkschaftsarbeit aus Sicht einer Arbeiterfamilie.", ["Welche Hilfe kommt sofort an?", "Welche Abhängigkeit oder Hürde bleibt?"], "Die Werkswohnung verbessert möglicherweise das Wohnen, bindet es aber an den Arbeitgeber. Die Gewerkschaft kann mit anderen Beschäftigten für bessere Bedingungen kämpfen, garantiert aber keinen unmittelbaren Erfolg. Beide Ansätze helfen auf unterschiedliche Weise.", ["Zwei Ansätze verglichen", "Nutzen und Grenzen", "Perspektive der Familie"]],
    transfer: ["In einem heutigen Lieferdienst fehlt Schutz bei einem Arbeitsunfall. Beurteile zwei historische Lösungsansätze als Vergleich und erkläre eine Grenze.", ["Was würde eine Versicherung abdecken?", "Was könnte gemeinsame Interessenvertretung erreichen?"], "Eine gesetzliche Versicherung könnte einen berechenbaren Anspruch bei einem Unfall sichern. Eine Interessenvertretung könnte bessere Schutzregeln fordern. Die heutige Rechtslage unterscheidet sich vom 19. Jahrhundert, deshalb muss ich prüfen, wer tatsächlich erfasst ist.", ["Zwei Ansätze übertragen", "Konkrete Wirkungen", "Grenze des historischen Vergleichs"]],
  }),
];
