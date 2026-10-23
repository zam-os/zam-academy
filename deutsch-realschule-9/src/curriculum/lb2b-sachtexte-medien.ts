import type { Lesson } from "../model/types";

/** Lernbereich 2, zweiter Teil: Sachtexte und weitere Medien (2.3 und 2.4). */
export const LB2B: Lesson[] = [
  {
    id: "de-schaubild-karikatur",
    lb: 2,
    unit: "2.3",
    covers: ["2.3.1"],
    title: "Schaubilder, Statistiken und Karikaturen auswerten",
    intro:
      "Zahlen und Zeichnungen wollen etwas erreichen. Du liest sie genau, beschreibst ihre Absicht und nutzt ihre Informationen in eigenen Texten.",
    paragraphs: [
      "Ein Schaubild, eine Statistik oder ein Diagramm ist ein **nicht-linearer Text**: Du liest ihn nicht von oben nach unten, sondern suchst gezielt Informationen. In Klasse 8 hast du einfache Diagramme ausgewertet; jetzt kommt die Frage nach der Absicht dazu. Gehe in dieser Reihenfolge vor: Titel und Thema, Quelle und Zeitraum, Einheit und Achsen, dann die Zahlen selbst (größter und kleinster Wert, Entwicklung) und zuletzt die Aussage in einem Satz. Die Art des Diagramms verrät, was gezeigt werden soll. Ein **Säulendiagramm** (liegend: Balkendiagramm) vergleicht meist Werte verschiedener Gruppen, ein **Liniendiagramm** zeigt eine Entwicklung über die Zeit, ein **Kreisdiagramm** zeigt Anteile an einem Ganzen, die zusammen 100 Prozent ergeben.",
      "Zahlen können informieren, aber auch lenken. Beginnt die senkrechte Achse nicht bei null, wirken kleine Unterschiede groß; bei Säulen führt das besonders in die Irre, weil ihre Höhe dann nicht mehr zum Wert passt. Eine Überschrift wie „Verkauf explodiert!“ legt dir eine Deutung nahe, die die Zahlen vielleicht nicht tragen. Prüfe darum auch: Wer hat die Grafik erstellt, und was soll sie bei den Lesenden bewirken? Achte außerdem auf die Größe der Gruppe: Eine Umfrage unter 25 Personen sagt nur wenig darüber, wie alle Jugendlichen denken. Wenn du die Information in einem eigenen Text nutzt, nennst du Quelle und Werte und behauptest nicht mehr, als die Zahlen zeigen.",
      "Eine **Karikatur** ist eine gezeichnete, bewusst übertriebene Darstellung, die etwas kritisiert oder verspottet. Das Wort stammt aus dem Italienischen und bedeutet ursprünglich „Überladung, Übertreibung“. Du erkennst eine Karikatur meist an drei Merkmalen: Sie **übertreibt** (etwas ist viel zu groß, zu viel oder zu schnell), sie arbeitet mit **Symbolen**, also mit Gegenständen, die für einen anderen Gedanken stehen (eine Glühbirne für eine Idee, eine Waage für Gerechtigkeit), und sie hat eine **Beschriftung** wie Titel, Schild oder Sprechblase, die das Bild erklärt oder ihm widerspricht. Wichtig: Eine Karikatur ist keine neutrale Information, sondern eine Meinung in Bildform.",
      "So wertest du eine Karikatur aus: Zuerst **beschreibst** du, was zu sehen ist, ohne es zu deuten. Dann **deutest** du die Übertreibungen, Symbole und Beschriftungen. Danach formulierst du die **Aussage und Kritik** der Zeichnerin oder des Zeichners in einem Satz: Was wird kritisiert, und warum? Zum Schluss prüfst du die Kritik. Ist sie berechtigt, oder zeigt die Karikatur nur eine Seite? Du darfst zustimmen oder widersprechen, musst es aber begründen. Das gilt auch für Statistiken: Sie liefern Informationen, die du abwägen und in eigenen Texten nutzen kannst.",
    ],
    terms: [
      {
        term: "Nicht-linearer Text",
        text: "Ein Text wie ein Schaubild, ein Diagramm oder eine Tabelle, den du nicht von oben nach unten liest, sondern gezielt nach Informationen absuchst.",
      },
      {
        term: "Säulendiagramm",
        text: "Ein Diagramm, in dem die Höhe der Säulen die Werte verschiedener Gruppen vergleichbar macht.",
      },
      {
        term: "Liniendiagramm",
        text: "Ein Diagramm, dessen Linie zeigt, wie sich ein Wert über einen Zeitraum verändert.",
      },
      {
        term: "Kreisdiagramm",
        text: "Ein Diagramm, dessen Kreisstücke zeigen, welchen Anteil jeder Teil an einem Ganzen hat.",
      },
      {
        term: "Karikatur",
        text: "Eine gezeichnete Darstellung, die durch Übertreibung etwas kritisiert oder verspottet.",
      },
      {
        term: "Symbol",
        text: "Ein Bild oder Gegenstand, der für einen anderen Gedanken steht, zum Beispiel eine Waage für Gerechtigkeit.",
      },
    ],
    examples: [
      {
        title: "Eine Umfrage der Schülerzeitung (erfundene Zahlen)",
        text: "Säulendiagramm „Wie kommen die Jugendlichen der 9b zur Schule?“\nQuelle: Umfrage der Schülerzeitung, 25 Befragte (angenommene Zahlen)\nBus: 12 Personen\nFahrrad: 6 Personen\nZu Fuß: 4 Personen\nAuto: 3 Personen",
        analysis:
          "Thema und Quelle stehen im Titel und in der Zeile darunter. Der größte Wert ist der Bus mit 12 von 25, also knapp die Hälfte; der kleinste ist das Auto mit 3. Die Aussage lautet: Die meisten Befragten fahren mit dem Bus. Für einen eigenen Text brauchst du Quelle und Zahlen: „Laut einer Umfrage der Schülerzeitung fahren 12 von 25 Befragten mit dem Bus.“",
      },
    ],
    takeaway:
      "Bei einem Schaubild prüfst du zuerst Titel, Quelle, Einheit und Achsen und liest dann die Zahlen. Eine Karikatur übertreibt mit Symbolen und Beschriftung, um etwas zu kritisieren. Du beschreibst, deutest und formulierst die Kritik, bevor du urteilst.",
    sourceIds: ["lp", "dwds"],
    quiz: {
      question: "Was will eine Karikatur in der Regel erreichen?",
      answer: "Sie will durch Übertreibung eine Situation oder ein Verhalten kritisieren.",
      wrong: [
        "Sie will ein Ereignis genau abbilden, damit sich alle selbst eine Meinung bilden.",
        "Sie will Zahlen anschaulich darstellen, damit Werte gut vergleichbar sind.",
      ],
      explanation:
        "Eine Karikatur ist eine Meinung in Bildform: Sie übertreibt, um zu kritisieren. Ein genaues Abbild wäre eine Zeichnung ohne Übertreibung, und Werte zu vergleichen ist die Aufgabe eines Diagramms.",
    },
    workshop: {
      kind: "mark",
      title: "Merkmale einer Karikatur finden",
      instruction:
        "Hier ist eine Karikatur als Text beschrieben. Wähle oben eine Bezeichnung und klicke die Stelle an, die sie zeigt. Ein Symbol steht für einen Gedanken, eine Übertreibung macht etwas viel zu groß oder zu viel. Nicht jede Stelle ist ein Merkmal.",
      labels: ["Übertreibung", "Symbol", "Beschriftung"],
      text: [
        { t: "Die Zeichnung trägt den Titel " },
        {
          t: "„Wissensdurst“",
          label: 2,
          feedback:
            "Der Titel ist eine Beschriftung. Er klingt nach Lust aufs Lernen und steht im Gegensatz zum Bild, das Überforderung zeigt.",
        },
        { t: ". " },
        { t: "Die Szene spielt in einem Klassenzimmer" },
        { t: ". " },
        { t: "Ein Schüler sitzt an seinem Pult" },
        { t: ". " },
        {
          t: "Vor ihm türmt sich ein Stapel Hefte bis unter die Decke",
          label: 0,
          feedback:
            "Der Heftestapel reicht bis unter die Decke. Diese Übertreibung macht die Menge an Lernstoff sichtbar.",
        },
        { t: ". " },
        { t: "Über seinem Kopf hängt " },
        {
          t: "eine Glühbirne, die fast erloschen ist",
          label: 1,
          feedback:
            "Die Glühbirne steht als Symbol für Ideen und Lernlust. Dass sie fast erloschen ist, deutet auf schwindende Motivation.",
        },
        { t: ". " },
        { t: "An der Tafel steht " },
        {
          t: "„Lernstoff bis Freitag“",
          label: 2,
          feedback:
            "Die Tafelaufschrift ist eine Beschriftung. Sie nennt die Anforderung, die auf dem Schüler lastet.",
        },
        { t: ". " },
        { t: "Die Lehrerin steht neben der Tafel" },
        { t: ". " },
        { t: "Die Zeichnung besteht nur aus schwarzen Linien" },
        { t: "." },
      ],
      conclusion:
        "Eine Karikatur übertreibt, arbeitet mit Symbolen und nutzt Beschriftungen, um eine Kritik zu zeigen. Hier könnte sie lauten: Zu viel Lernstoff nimmt die Lust am Lernen.",
    },
    casework: {
      title: "Eine Grafik mit starker Überschrift",
      story:
        "In der Schülerzeitung erscheint ein Liniendiagramm mit der Überschrift **„Pausenbrot-Boom: Verkauf explodiert!“**. Die Quelle lautet: eigene Zählung der SMV, angenommene Zahlen. Die senkrechte Achse zeigt verkaufte Brote pro Woche und **beginnt bei 80**, die waagrechte Achse zeigt fünf aufeinanderfolgende Wochen. Die Werte sind **85, 87, 90, 94 und 99**.",
      steps: [
        {
          question: "Was zeigt ein Liniendiagramm wie dieses vor allem?",
          options: [
            "Die Entwicklung des Verkaufs über fünf Wochen",
            "Den Anteil jeder Woche am gesamten Verkauf",
            "Den Vergleich zweier Kioske miteinander",
          ],
          answer: 0,
          explanation:
            "Die Linie verbindet die Werte der fünf Wochen und macht so den Verlauf über die Zeit sichtbar. Anteile an einem Ganzen zeigt ein Kreisdiagramm.",
        },
        {
          question: "Die senkrechte Achse beginnt bei 80 statt bei 0. Welche Folge hat das für den Eindruck?",
          options: [
            "Der Anstieg wirkt steiler, als es im Verhältnis zu den Zahlen angemessen ist.",
            "Der Anstieg wirkt flacher, weil die Linie dadurch kürzer wird.",
            "Der Eindruck bleibt gleich, weil die Werte dieselben sind.",
          ],
          answer: 0,
          explanation:
            "Weil der untere Teil der Achse fehlt, nimmt schon ein kleiner Zuwachs viel Platz ein. Die Werte bleiben gleich, aber der Eindruck ändert sich.",
        },
        {
          question: "Um wie viel ist der Verkauf in den fünf Wochen laut den Zahlen gestiegen?",
          options: [
            "Um 14 Brote pro Woche, von 85 auf 99",
            "Um 99 Brote pro Woche",
            "Er hat sich ungefähr verdoppelt",
          ],
          answer: 0,
          explanation: "99 minus 85 ergibt 14. Verdoppelt hätte sich der Verkauf erst bei etwa 170 Broten pro Woche.",
        },
        {
          question: "Welcher Satz nutzt die Information in einem eigenen Text richtig?",
          options: [
            "Laut der Zählung der SMV stieg der Verkauf von 85 auf 99 Brote pro Woche.",
            "Der Verkauf explodiert, wie die Grafik beweist.",
            "Alle Schülerinnen und Schüler kaufen jetzt Pausenbrote am Kiosk.",
          ],
          answer: 0,
          explanation:
            "Der richtige Satz nennt Quelle und Werte und bleibt bei dem, was die Zahlen zeigen. „Explodiert“ ist eine Wertung der Überschrift, und über „alle“ sagen die Zahlen nichts.",
        },
      ],
      verdict:
        "Die Zahlen belegen einen Anstieg von 85 auf 99 Brote pro Woche; Achse und Überschrift lassen ihn größer wirken, als die Zahlen es hergeben. In eigenen Texten nennst du Quelle und Werte und übernimmst die Wertung der Überschrift nicht ungeprüft.",
    },
    tasks: {
      1: {
        prompt:
          "Eine Umfrage der Schülerzeitung unter 40 Befragten (angenommene Zahlen) zeigt als Säulendiagramm, wie viele Stunden pro Woche sie Sport treiben: bis 2 Stunden: 10 Personen, mehr als 2 bis 5 Stunden: 18 Personen, mehr als 5 Stunden: 12 Personen. Beschreibe das Diagramm in drei bis vier Sätzen für einen Artikel der Schülerzeitung.",
        hints: [
          "Beginne mit Thema und Quelle und nenne dann den größten Wert zusammen mit der Gesamtzahl der Befragten.",
          "Mache aus der Zahl eine Aussage: Welchen Anteil haben 18 von 40, und was sagt das nur über diese Gruppe aus?",
        ],
        model:
          "Das Säulendiagramm der Schülerzeitung zeigt, wie viele Stunden pro Woche 40 befragte Jugendliche Sport treiben. Die größte Gruppe, nämlich 18 von 40, treibt mehr als zwei bis fünf Stunden Sport, das sind 45 Prozent. 12 Befragte sind mehr als fünf Stunden aktiv, 10 höchstens zwei Stunden. Die Umfrage zeigt also, wie sich diese 40 Personen verhalten; über alle Jugendlichen sagt sie wegen der kleinen Zahl der Befragten nur begrenzt etwas aus.",
        criteria: [
          "Nennt Thema und Quelle des Diagramms.",
          "Nennt den größten Wert mit der Gesamtzahl der Befragten.",
          "Formuliert eine Aussage, die nicht mehr behauptet, als die Zahlen zeigen.",
        ],
      },
      2: {
        prompt:
          "Eine Karikatur trägt den Titel „Pause“. Auf einem Schulhof sitzen alle Jugendlichen in einer Reihe auf einer Bank und blicken auf ihre Handys. Ein Basketballkorb in der Mitte ist von dicken Spinnweben überzogen, am Boden liegt ein vergessener Ball. Schreibe eine Auswertung in fünf bis sechs Sätzen: Beschreibe, deute und nenne die Kritik. Sage zum Schluss, ob du die Kritik berechtigt findest, und begründe das.",
        hints: [
          "Beschreibe zuerst nur, was zu sehen ist, und deute danach. Frage dich, was die Spinnweben am Korb bedeuten.",
          "Formuliere die Kritik in einem Satz („Die Zeichnerin oder der Zeichner kritisiert, dass …“). Überlege dann, ob sie auf alle zutrifft oder nur auf manche.",
        ],
        model:
          "Die Karikatur „Pause“ zeigt einen Schulhof, auf dem alle Jugendlichen nebeneinander auf einer Bank sitzen und auf ihre Handys schauen. Der Basketballkorb in der Mitte ist von Spinnweben überzogen, und ein Ball liegt vergessen am Boden. Die Spinnweben sind eine Übertreibung: Sie zeigen, dass der Korb scheinbar seit Ewigkeiten nicht benutzt wurde. Die Zeichnung kritisiert, dass Pausen nur noch am Bildschirm statt in Bewegung und im Gespräch verbracht werden. Ich halte die Kritik für teilweise berechtigt, denn viele nutzen die Pause für das Handy. Sie trifft aber nicht auf alle zu, weil manche über das Handy auch mit Freundinnen und Freunden in Kontakt sind.",
        criteria: [
          "Beschreibt zuerst, was zu sehen ist, ohne es zu deuten.",
          "Deutet mindestens eine Übertreibung oder ein Symbol und nennt die Kritik.",
          "Begründet, ob die Kritik berechtigt ist.",
        ],
      },
    },
  },
  {
    id: "de-reportage-kommentar",
    lb: 2,
    unit: "2.3",
    covers: ["2.3.2"],
    title: "Reportage und Kommentar unterscheiden",
    intro:
      "Reportage und Kommentar können vom selben Thema handeln, wollen aber Verschiedenes. An Aufbau und Sprache erkennst du ihre Absicht.",
    paragraphs: [
      "Zeitungen und Nachrichtenseiten verwenden verschiedene Textsorten, weil sie Verschiedenes erreichen wollen. Diese Absicht heißt **Textintention**. Der **Bericht** (Wiederholung aus Klasse 8) informiert sachlich und knapp über ein Ereignis und beantwortet die W-Fragen: wer, was, wann, wo, wie, warum. Die **Reportage** lässt die Lesenden ein Geschehen miterleben. Der **Kommentar** äußert eine Meinung und will überzeugen. Frage dich beim Lesen darum immer: Was soll der Text bei mir bewirken? Soll er mich informieren, mich ins Geschehen holen oder mich von einer Meinung überzeugen?",
      "Die **Reportage** ist am Ort des Geschehens entstanden, und das merkt man ihr an. Formal beginnt sie oft mit einem **szenischen Einstieg**: Statt einer Zusammenfassung stehen Zeit, Ort und Sinneseindrücke am Anfang. Sie lässt meist Menschen in **wörtlicher Rede** zu Wort kommen und mischt Beschreibung mit Fakten. Sprachlich fallen anschauliche Verben und Adjektive, Vergleiche und oft das Präsens auf. Alles dient einer Absicht: Die Lesenden sollen das Geschehen miterleben, mehr verstehen und Anteil nehmen. Wer schreibt, ist als Beobachterin oder Beobachter spürbar, aber im Mittelpunkt stehen die Menschen und die Szene.",
      "Der **Kommentar** ist ein Meinungstext. Formal ist er oft klar gebaut: Er nennt einen Anlass, formuliert eine **These**, stützt sie mit Argumenten und Beispielen, geht manchmal auf eine Gegenposition ein und endet mit einem Fazit oder einer Forderung. Die Autorin oder der Autor kann als „ich“ oder „wir“ auftreten. Sprachlich findest du wertende Wörter, Ausrufe, Appelle wie „Die Stadt muss handeln!“ und **rhetorische Fragen** (Fragen, die keine Antwort erwarten, sondern etwas betonen). Die Absicht ist, zu überzeugen und zum Nachdenken anzuregen. Weil ein Kommentar nur eine Sichtweise zeigt, prüfst du seine Argumente, statt sie zu übernehmen.",
      "Wenn du einen Text beschreibst, verknüpfst du Merkmal und Absicht. Das gelingt in drei Schritten: Du nennst das Merkmal mit seinem Fachbegriff, belegst es mit einer Textstelle und erklärst die Wirkung. Zum Beispiel: „Der szenische Einstieg ‚Kurz vor acht riecht es in der Fahrradwerkstatt nach Öl und Gummi‘ holt die Lesenden mitten ins Geschehen; so will die Reportage Anteilnahme wecken.“ Vorher gibst du den Inhalt in eigenen Worten wieder, im Präsens und ohne Wertung: Worum geht es, und was sind die wichtigsten Informationen oder die These? So zeigst du, dass du den Text verstanden hast, bevor du ihn untersuchst.",
    ],
    terms: [
      {
        term: "Textintention",
        text: "Die Absicht eines Textes: Er will zum Beispiel informieren, die Lesenden miterleben lassen oder sie überzeugen.",
      },
      {
        term: "Reportage",
        text: "Ein anschaulicher Text vom Ort des Geschehens, der Beschreibung, Fakten und wörtliche Rede verbindet.",
      },
      {
        term: "Kommentar",
        text: "Ein Meinungstext, in dem die Autorin oder der Autor zu einem aktuellen Thema Stellung nimmt und die Meinung begründet.",
      },
      {
        term: "Szenischer Einstieg",
        text: "Ein Textanfang, der mitten im Geschehen mit Zeit, Ort und Sinneseindrücken beginnt.",
      },
      {
        term: "These",
        text: "Die Hauptaussage oder Forderung eines Kommentars, die durch Argumente gestützt wird.",
      },
      {
        term: "Rhetorische Frage",
        text: "Eine Frage, die keine Antwort erwartet, sondern eine Aussage betont oder zum Nachdenken anregt.",
      },
    ],
    examples: [
      {
        title: "Der Einstieg einer Reportage (eigens verfasst)",
        text: "Kurz vor acht riecht es in der Fahrradwerkstatt nach Öl und Gummi. Samira dreht ein Rad, bis die Speichen sirren. „Wenn es wieder rollt, ist es wie ein kleiner Sieg“, sagt sie.",
        analysis:
          "Der **szenische Einstieg** nennt Zeit und Ort und spricht mehrere Sinne an („riecht“, „sirren“). Die **wörtliche Rede** lässt eine Person selbst zu Wort kommen. Beides holt die Lesenden mitten ins Geschehen und soll Anteilnahme wecken. Eine Zusammenfassung der Informationen käme erst danach.",
      },
    ],
    takeaway:
      "Ein Bericht informiert sachlich, eine Reportage lässt die Lesenden das Geschehen miterleben, ein Kommentar will mit einer begründeten Meinung überzeugen. Beschreibe Merkmale mit Fachbegriff, Textstelle und Wirkung auf die Absicht des Textes.",
    sourceIds: ["lp"],
    quiz: {
      question: "Woran erkennst du am sichersten, dass ein Text ein Kommentar ist?",
      answer: "Der Text bezieht Stellung, begründet eine Meinung und will die Lesenden überzeugen.",
      wrong: [
        "Der Text beginnt mitten im Geschehen und beschreibt Eindrücke vor Ort.",
        "Der Text beantwortet sachlich die W-Fragen und nennt nur Fakten.",
      ],
      explanation:
        "Ein Kommentar ist ein Meinungstext mit These und Argumenten. Der Einstieg mitten im Geschehen ist typisch für die Reportage, die sachliche Antwort auf die W-Fragen für den Bericht.",
    },
    workshop: {
      kind: "classify",
      title: "Bericht, Reportage oder Kommentar?",
      instruction:
        "Alle Sätze stammen aus Texten über dieselbe erfundene Skateanlage. Ordne jeden Satz der Textsorte zu, zu der er am besten passt.",
      categories: ["Bericht", "Reportage", "Kommentar"],
      entries: [
        {
          text: "Der Stadtrat hat am Dienstag beschlossen, die Skateanlage am Sportplatz um zwei Rampen zu erweitern.",
          target: 0,
          feedback: "Der Satz nennt sachlich, wer was wann beschlossen hat, und wertet nicht. Das ist typisch für einen Bericht.",
        },
        {
          text: "Die Bauarbeiten sollen laut Stadtverwaltung im Frühjahr beginnen und einige Wochen dauern.",
          target: 0,
          feedback: "Eine Quellenangabe („laut Stadtverwaltung“) und nüchterne Fakten kennzeichnen den Bericht.",
        },
        {
          text: "Es ist kurz nach vier, der Beton der Skateanlage ist noch warm, und Leon rollt zum dritten Mal auf die Rampe zu.",
          target: 1,
          feedback: "Der Satz beginnt mitten im Geschehen mit Zeit, Ort und Sinneseindruck. Das ist ein szenischer Einstieg.",
        },
        {
          text: "„Hier vergesse ich alles andere“, sagt Leon und wischt sich die staubigen Hände an der Hose ab, während hinter ihm die Rollen klacken.",
          target: 1,
          feedback: "Wörtliche Rede und anschauliche Einzelheiten lassen die Lesenden die Szene miterleben.",
        },
        {
          text: "Die Stadt sollte die Skateanlage ausbauen, denn Jugendliche brauchen Orte, an denen sie sich treffen können.",
          target: 2,
          feedback: "Der Satz enthält eine These („sollte“) und eine Begründung („denn“). Die Meinung steht im Mittelpunkt.",
        },
        {
          text: "Wer die Erweiterung zu teuer findet, sollte sich fragen: Was kostet es, wenn Jugendliche keinen Treffpunkt haben?",
          target: 2,
          feedback: "Die rhetorische Frage verlangt keine Antwort, sondern soll die Lesenden überzeugen.",
        },
      ],
      conclusion:
        "Der Bericht informiert nüchtern, die Reportage holt die Lesenden in die Szene, der Kommentar begründet eine Meinung. Merkmale und Absicht gehören immer zusammen.",
    },
    casework: {
      title: "Ein Text aus der Schülerzeitung",
      story:
        "In der Schülerzeitung steht unter dem Kürzel „L. K.“ ein Text mit der Überschrift „Wo bleiben die Fahrradständer?“: **„Jeden Morgen dasselbe: Wer mit dem Rad kommt, kämpft sich durch einen Wirrwarr aus Lenkern und Pedalen. Das kann nicht so bleiben! Die Schulleitung muss endlich neue Ständer aufstellen, denn nur so bleiben die Räder heil und der Weg frei. Oder will jemand wirklich erst handeln, wenn das erste Rad zu Bruch gegangen ist?“**",
      steps: [
        {
          question: "Welche Textsorte liegt vor?",
          options: [
            "Ein Kommentar, weil der Text eine Meinung vertritt und eine Forderung stellt",
            "Ein Bericht, weil der Text ein Problem an der Schule nennt",
            "Eine Reportage, weil der Text die Lage am Morgen schildert",
          ],
          answer: 0,
          explanation:
            "Der Text fordert etwas („muss endlich“) und begründet es. Ein Bericht würde ohne Wertung informieren, eine Reportage würde eine Szene mit Personen und wörtlicher Rede erzählen.",
        },
        {
          question: "Welcher Satz formuliert die These des Textes?",
          options: [
            "Die Schulleitung muss endlich neue Ständer aufstellen.",
            "Jeden Morgen dasselbe: Wer mit dem Rad kommt, kämpft sich durch einen Wirrwarr aus Lenkern und Pedalen.",
            "Oder will jemand wirklich erst handeln, wenn das erste Rad zu Bruch gegangen ist?",
          ],
          answer: 0,
          explanation:
            "Die These ist die Forderung, die der Text begründet. Der Anfang schildert nur den Anlass, die Schlussfrage verstärkt die Forderung.",
        },
        {
          question: "Welche Wirkung hat die Frage am Ende des Textes?",
          options: [
            "Eine rhetorische Frage: Sie erwartet keine Antwort, sondern unterstreicht die Forderung.",
            "Eine offene Frage: Der Text erwartet, dass die Lesenden schriftlich antworten.",
            "Eine Information: Sie meldet, dass bereits ein Rad kaputtgegangen ist.",
          ],
          answer: 0,
          explanation:
            "Die Frage ist so gestellt, dass die Antwort „nein“ lautet. Sie betont die Forderung und appelliert an die Verantwortung der Schulleitung.",
        },
        {
          question: "Welche Wiedergabe gibt den Inhalt sachlich und in eigenen Worten wieder?",
          options: [
            "Der Text fordert, dass die Schulleitung neue Fahrradständer aufstellt, weil die Räder sonst beschädigt werden und der Weg versperrt ist.",
            "Die Schulleitung tut nichts und ist schuld, wenn Räder kaputtgehen.",
            "Jeden Morgen dasselbe: Wer mit dem Rad kommt, kämpft sich durch einen Wirrwarr.",
          ],
          answer: 0,
          explanation:
            "Eine Inhaltsangabe nennt Thema und These im Präsens, ohne die Wertungen des Textes zu übernehmen. Die zweite Antwort wertet selbst, die dritte schreibt nur ab.",
        },
      ],
      verdict:
        "Der Text ist ein Kommentar: Er stellt eine Forderung, begründet sie und verstärkt sie mit einer rhetorischen Frage. Seine Absicht ist es, die Lesenden und die Schulleitung zu überzeugen.",
    },
    tasks: {
      1: {
        prompt:
          "Lies diesen Anfang einer Reportage: „Kurz nach sechs zischt in der Schulküche die erste Pfanne. Küchenchefin Ina Brandt schüttet Nudeln ins dampfende Wasser. ‚Wenn um halb zwölf die Klingel geht, muss alles fertig sein‘, sagt sie und rührt weiter.“ Gib den Inhalt in einem Satz wieder. Beschreibe dann in zwei Sätzen mit einem Fachbegriff, wie der Anfang die Lesenden anspricht.",
        hints: [
          "Gib den Inhalt im Präsens und ohne Wertung wieder: Wer macht was, wann und wo?",
          "Nenne den Fachbegriff „szenischer Einstieg“ oder „wörtliche Rede“, zitiere die Stelle und erkläre, was sie bei den Lesenden bewirkt.",
        ],
        model:
          "Inhalt: Die Küchenchefin Ina Brandt bereitet morgens in der Schulküche das Mittagessen vor und muss bis halb zwölf fertig sein. Der Text beginnt mit einem szenischen Einstieg: „Kurz nach sechs zischt in der Schulküche die erste Pfanne.“ Zeit, Ort und Geräusch holen die Lesenden mitten ins Geschehen. Die wörtliche Rede der Küchenchefin zeigt den Zeitdruck aus ihrer Sicht und macht die Szene lebendig.",
        criteria: [
          "Gibt den Inhalt im Präsens und ohne Wertung wieder.",
          "Nennt einen Fachbegriff und zitiert die passende Textstelle.",
          "Erklärt die Wirkung auf die Lesenden.",
        ],
      },
      2: {
        prompt:
          "Wähle ein Thema aus deinem Schulalltag, zum Beispiel den Schulkiosk oder den Pausenhof. Schreibe dazu zwei kurze Texte: einen Reportage-Anfang mit szenischem Einstieg und wörtlicher Rede (zwei bis drei Sätze) und einen Kommentar-Ausschnitt mit These und rhetorischer Frage (zwei bis drei Sätze). Erkläre danach in zwei Sätzen, wie sich die Absicht der beiden Texte unterscheidet.",
        hints: [
          "Beginne die Reportage mit Zeit, Ort und einem Sinneseindruck und lass eine Person sprechen.",
          "Formuliere im Kommentar zuerst deine Forderung als These. Die rhetorische Frage soll keine Antwort verlangen, sondern die These betonen.",
        ],
        model:
          "Reportage: Kurz nach halb zehn riecht es am Schulkiosk nach warmen Brezeln, und die Schlange reicht bis zur Treppe. „Wenn ich nicht gleich drankomme, bleibt mir kaum Zeit zum Essen“, sagt Mila und schaut auf die Uhr. Kommentar: Der Schulkiosk braucht eine zweite Kasse, denn niemand sollte seine Pause in einer Schlange verbringen. Ist das wirklich zu viel verlangt? Die Reportage will die Lesenden die Situation miterleben lassen und Verständnis wecken. Der Kommentar will sie davon überzeugen, dass die Schule handeln sollte.",
        criteria: [
          "Die Reportage beginnt mit einem szenischen Einstieg und enthält wörtliche Rede.",
          "Der Kommentar enthält eine These und eine rhetorische Frage.",
          "Die Erklärung beschreibt die unterschiedliche Absicht beider Texte.",
        ],
      },
    },
  },
  {
    id: "de-information-meinung",
    lb: 2,
    unit: "2.3",
    covers: ["2.3.3"],
    title: "Information und Meinung im Text unterscheiden",
    intro:
      "Texte mischen oft Fakten und Wertungen. Wenn du beides trennst, erkennst du Standpunkte und kannst deine eigene Meinung begründen.",
    paragraphs: [
      "Jeder Text hat eine Funktion. Manche Sätze **informieren**: Sie nennen Tatsachen, die du prüfen kannst, etwa „Die Mensa öffnet um 11.30 Uhr.“ Andere sagen, was die Autorin oder der Autor **meint**: „Das Essen ist leider eintönig.“ Eine Meinung lässt sich nicht nachmessen, sondern nur begründen oder bestreiten. Frage dich bei jedem Satz: Kann ich das nachprüfen, zum Beispiel an einer Zahl, einem Datum oder einer Quelle? Dann ist es eine Information. Eine Information muss dabei nicht stimmen, sie kann auch falsch sein, aber man kann sie prüfen. Eine Meinung prüfst du anders: Du fragst, ob sie gut begründet ist.",
      "Es gibt Signale, an denen du eine Meinung erkennst. **Wertende Wörter** wie „leider“, „schwerer Fehler“ oder „endlich“ zeigen, wie jemand etwas findet. Wörter der **Forderung** wie „muss“ oder „sollte“ sagen, was geschehen soll. Auch „Ich finde“ und „meiner Meinung nach“ kündigen ein Urteil an. Für eine Information sprechen dagegen Zahlen, Daten, Namen und Quellenangaben wie „laut Umfrage“. Eine Besonderheit ist die **indirekte Rede**: Wer wiedergibt, was jemand gesagt hat, verwendet oft den Konjunktiv I („Die Leiterin erklärte, zwei Stellen seien weggefallen.“). Er zeigt, dass eine andere Person das gesagt hat. Ob es stimmt, verrät der Konjunktiv für sich allein nicht.",
      "Ein **Standpunkt** ist die Antwort eines Textes auf eine Streitfrage, zum Beispiel: „Sollen Hausaufgaben am Wochenende wegfallen?“ So findest du ihn: Formuliere zuerst die Streitfrage. Suche dann die Antwort des Textes, seine These, und die Begründungen dazu. Oft nennt ein Kommentar auch ein **Gegenargument** und entkräftet es („Natürlich wird eingewendet … Das stimmt, aber …“). Wenn du zwei Texte vergleichst, stellst du die Informationen nebeneinander und fragst: Was folgert jeder Text daraus? Dieselben Fakten können zu verschiedenen Standpunkten führen.",
      "Deine eigene Meinung begründest du in vier Bausteinen: Standpunkt („Ich bin dafür, dass …“), Begründung („weil …“), Beleg oder Beispiel („Zum Beispiel …“) und, wenn möglich, ein Gegenargument, auf das du eingehst („Dagegen spricht …, aber …“). Eine Meinung ist nicht beliebig: Sie überzeugt, wenn andere deine Begründung nachvollziehen können, auch wenn sie anderer Ansicht sind. Beachte außerdem den Unterschied zwischen Wertung und Argument: „Das ist doof“ ist nur eine Wertung, „Das ist ungerecht, weil nicht alle dieselbe Chance haben“ ist ein Argument.",
    ],
    terms: [
      {
        term: "Information",
        text: "Eine Aussage, die du an Zahlen, Daten oder Quellen prüfen kannst.",
      },
      {
        term: "Meinung",
        text: "Ein Urteil, das sich nicht nachmessen, sondern nur begründen oder bestreiten lässt.",
      },
      {
        term: "Wertendes Wort",
        text: "Ein Wort wie „leider“, „schwerer Fehler“ oder „endlich“, das zeigt, wie jemand etwas beurteilt.",
      },
      {
        term: "Indirekte Rede",
        text: "Die Wiedergabe einer fremden Aussage, oft im Konjunktiv I („Er sagte, er sei müde.“).",
      },
      {
        term: "Standpunkt",
        text: "Die Position, die ein Text oder eine Person zu einer Streitfrage einnimmt und begründet.",
      },
      {
        term: "Gegenargument",
        text: "Ein Einwand gegen die eigene These, den ein Text nennt und entkräftet oder dem er zustimmt.",
      },
    ],
    examples: [
      {
        title: "Dieselbe Sache als Information und als Meinung (eigens verfasst)",
        text: "Information: Die Schulbibliothek ist montags bis donnerstags bis 16 Uhr geöffnet.\nMeinung: Das ist leider viel zu kurz für alle, die erst nach dem Sportunterricht Zeit haben.",
        analysis:
          "Der erste Satz lässt sich prüfen, etwa mit einem Blick auf den Aushang. Der zweite Satz wertet: „leider“ und „viel zu kurz“ zeigen, wie die Öffnungszeiten beurteilt werden. Dahinter steht eine Begründung („für alle, die erst nach dem Sportunterricht Zeit haben“), die man diskutieren kann.",
      },
    ],
    takeaway:
      "Informationen kannst du prüfen, Meinungen kannst du nur begründen oder bestreiten. Wertende Wörter, Forderungen wie „muss“ und „Ich finde“ zeigen Meinung; der Konjunktiv I kennzeichnet fremde Aussagen. Eigene Meinung begründest du mit Standpunkt, Begründung, Beleg und Gegenargument.",
    sourceIds: ["lp", "duden"],
    quiz: {
      question: "Woran erkennst du, dass ein Satz eine Meinung und keine Information ausdrückt?",
      answer: "Er enthält Wertungen, die man nicht nachprüfen, sondern nur begründen oder bestreiten kann.",
      wrong: [
        "Er steht im Konjunktiv, weil Meinungen immer im Konjunktiv ausgedrückt werden.",
        "Er enthält keine Zahlen, denn Meinungen werden nie mit Zahlen belegt.",
      ],
      explanation:
        "Eine Meinung erkennst du an ihrer Wertung. Der Konjunktiv I zeigt nur, dass jemand etwas wiedergibt, und auch eine Meinung kann sich auf Zahlen stützen.",
    },
    workshop: {
      kind: "mark",
      title: "Wertung, Forderung und fremde Aussage finden",
      instruction:
        "Text und Zahl sind erfunden. Wähle oben eine Bezeichnung und klicke im Text die Stelle an, die dazu passt. Sachliche Angaben mit Zahl oder Quelle sind keine Wertung und bleiben unmarkiert.",
      labels: ["Wertendes Wort", "Forderung", "Konjunktiv I (fremde Aussage)"],
      text: [
        { t: "Die Stadtbibliothek schließt samstags künftig ganz" },
        { t: ". " },
        { t: "Die Leiterin erklärte, " },
        {
          t: "zwei Stellen seien weggefallen",
          label: 2,
          feedback:
            "„seien“ ist Konjunktiv I. Er zeigt, dass die Leiterin das gesagt hat und der Text es nur wiedergibt.",
        },
        { t: ". " },
        { t: "Laut Besucherzählung kamen samstags zuletzt durchschnittlich 40 Personen" },
        { t: ". " },
        { t: "Das ist " },
        {
          t: "leider",
          label: 0,
          feedback: "„leider“ zeigt, wie die Nachricht beurteilt wird. Das Wort bewertet und informiert nicht.",
        },
        { t: " ein " },
        {
          t: "schwerer Fehler",
          label: 0,
          feedback:
            "„schwerer Fehler“ ist ein Urteil. Man kann es begründen oder bestreiten, aber nicht nachmessen.",
        },
        { t: ". " },
        { t: "Jugendliche lernen dort für Klassenarbeiten" },
        { t: ". " },
        { t: "Die Stadt " },
        {
          t: "muss die Entscheidung überdenken",
          label: 1,
          feedback:
            "„muss“ drückt eine Forderung aus. Der Text sagt, was geschehen soll, und nimmt damit Stellung.",
        },
        { t: "." },
      ],
      conclusion:
        "Wertende Wörter und Forderungen zeigen eine Meinung, der Konjunktiv I kennzeichnet wiedergegebene Aussagen. Sachliche Angaben mit Zahl oder Quelle kommen ohne solche Signale aus.",
    },
    casework: {
      title: "Hausaufgaben am Wochenende",
      story:
        "In der Schülerzeitung steht ein Beitrag zu einer Frage, die an der Schule gerade diskutiert wird: Sollen Hausaufgaben am Wochenende wegfallen? **„Laut Umfrage der SMV sind 60 von 100 Befragten dafür. Ich finde, das ist längst überfällig, denn wer auch am Wochenende lernen muss, kann sich kaum erholen. Natürlich werden manche Lehrkräfte einwenden, dass dann unter der Woche mehr anfällt. Das stimmt, aber die Aufgaben lassen sich besser über die Woche verteilen.“** (Zahlen angenommen)",
      steps: [
        {
          question: "Welcher Satz ist eine prüfbare Information?",
          options: [
            "Laut Umfrage der SMV sind 60 von 100 Befragten dafür.",
            "Ich finde, das ist längst überfällig.",
            "Die Aufgaben lassen sich besser über die Woche verteilen.",
          ],
          answer: 0,
          explanation:
            "Quelle und Zahl lassen sich prüfen, etwa durch einen Blick in die Umfrage. Der zweite Satz ist ein Urteil, und der dritte wertet mit „besser“.",
        },
        {
          question: "Woran erkennst du in „Ich finde, das ist längst überfällig“ die Meinung?",
          options: [
            "An „Ich finde“ und an dem wertenden Ausdruck „längst überfällig“",
            "Daran, dass der Satz eine Quelle nennt",
            "Am Konjunktiv I, mit dem eine fremde Aussage wiedergegeben wird",
          ],
          answer: 0,
          explanation:
            "„Ich finde“ kündigt ein Urteil an, und „längst überfällig“ wertet. Eine Quelle oder ein Konjunktiv I kommen in dem Satz nicht vor.",
        },
        {
          question: "Welchen Standpunkt vertritt der Text zur Frage, ob Hausaufgaben am Wochenende wegfallen sollen?",
          options: ["Sie sollen wegfallen.", "Sie sollen bleiben.", "Er lässt die Frage offen."],
          answer: 0,
          explanation:
            "Die These steht in „Ich finde, das ist längst überfällig“: Der Text hält die Abschaffung für richtig und begründet das mit der Erholung am Wochenende.",
        },
        {
          question: "Wie geht der Text mit dem Einwand der Lehrkräfte um?",
          options: [
            "Er nennt den Einwand und entkräftet ihn mit einem eigenen Argument.",
            "Er verschweigt den Einwand, damit der Text überzeugender wirkt.",
            "Er gibt dem Einwand recht und ändert daraufhin seinen Standpunkt.",
          ],
          answer: 0,
          explanation:
            "Der Text räumt den Einwand ein („Das stimmt“) und setzt ihm ein Argument entgegen („aber …“). So wirkt seine Begründung gründlicher.",
        },
      ],
      verdict:
        "Der Text mischt eine Information (die Umfrage) mit einem begründeten Standpunkt und geht auf einen Einwand ein. Wer ihn prüft, trennt die Zahl vom Urteil und fragt, ob die Begründung überzeugt.",
    },
    tasks: {
      1: {
        prompt:
          "Ordne diese drei Sätze zu: Information, Meinung oder fremde Aussage in indirekter Rede. Nenne zu jedem Satz das Signal, an dem du es erkennst. (a) Das Freibad hat im Sommer täglich bis 20 Uhr geöffnet. (b) Das Freibad ist leider viel zu teuer. (c) Die Betreiberin sagte, die Preise seien wegen höherer Kosten gestiegen.",
        hints: [
          "Frage dich bei jedem Satz: Kann ich das nachprüfen, oder bewertet der Satz?",
          "Achte auf wertende Wörter und auf den Konjunktiv I. Welche Verbform steht in Satz (c)?",
        ],
        model:
          "(a) ist eine Information: Die Öffnungszeit lässt sich prüfen, zum Beispiel am Eingang des Freibads. (b) ist eine Meinung: „leider“ und „viel zu teuer“ sind wertende Wörter, die man nicht nachmessen, sondern nur begründen oder bestreiten kann. (c) ist eine fremde Aussage in indirekter Rede: Der Konjunktiv I („seien … gestiegen“) zeigt, dass die Betreiberin das gesagt hat. Ob es stimmt, verrät der Konjunktiv nicht.",
        criteria: [
          "Ordnet jeden der drei Sätze richtig zu.",
          "Nennt zu jedem Satz ein erkennbares Signal.",
          "Erklärt, was der Konjunktiv I in Satz (c) zeigt.",
        ],
      },
      2: {
        prompt:
          "Die Frage lautet: Sollte an eurer Schule einmal im Jahr ein Tag ohne Unterricht für ein gemeinsames Sportfest stattfinden? Schreibe deine Meinung in fünf bis sechs Sätzen. Nenne deinen Standpunkt, zwei Begründungen und ein Beispiel und gehe auf ein Gegenargument ein.",
        hints: [
          "Beginne mit einem klaren Standpunkt, zum Beispiel „Ich bin dafür, dass …“, und verbinde jede Begründung mit „weil“ oder „denn“.",
          "Überlege dir einen Einwand, den andere bringen könnten, und entkräfte ihn mit „Das stimmt zwar, aber …“.",
        ],
        model:
          "Ich bin dafür, dass an unserer Schule einmal im Jahr ein Tag ohne Unterricht für ein gemeinsames Sportfest stattfindet. Erstens lernen sich Schülerinnen und Schüler aus verschiedenen Klassen kennen, weil sie in gemischten Teams spielen. Zweitens bewegen sich viele an diesem Tag mehr als an einem normalen Schultag. Bei einem Fußballturnier in der Pause kann man zum Beispiel sehen, wie Klassen gemeinsam jubeln. Natürlich geht dadurch ein Unterrichtstag verloren. Das stimmt, aber der Stoff lässt sich nachholen, und das Gemeinschaftsgefühl bleibt.",
        criteria: [
          "Nennt einen klaren Standpunkt.",
          "Begründet ihn mit mindestens zwei Argumenten und einem Beispiel.",
          "Geht auf ein Gegenargument ein und entkräftet es.",
        ],
      },
    },
  },
  {
    id: "de-medien-risiken",
    lb: 2,
    unit: "2.4",
    covers: ["2.4.1"],
    title: "Chancen und Risiken der Mediennutzung abwägen",
    intro:
      "Soziale Netzwerke, Datenschutz und Werbung haben gute und schwierige Seiten. Du wägst ab und entscheidest begründet selbst.",
    paragraphs: [
      "Medien gehören zum Alltag von Jugendlichen. In dieser Lektion geht es nicht darum, sie zu loben oder zu verbieten, sondern darum, sie **selbstbestimmt** zu nutzen: Du kennst Chancen und Risiken und wählst bewusst aus. Nimm als Beispiel die erfundene App „Plauderei“, ein soziales Netzwerk. Zu den **Chancen** gehört, dass du mit Freundinnen und Freunden in Kontakt bleibst, auch wenn sie weit weg wohnen, dass du Interessen teilst und dass du Informationen und Erklärvideos findest. **Risiken** sind zum Beispiel, dass sich Inhalte kopieren und weiterleiten lassen, dass Beleidigungen schnell viele erreichen und dass manche Beiträge falsche oder einseitige Informationen enthalten. Beides stimmt gleichzeitig; auf das Abwägen kommt es an.",
      "Beim **Datenschutz** geht es um deine **personenbezogenen Daten**. Das sind alle Angaben, die sich auf dich beziehen lassen, etwa Name, Adresse, Standort und auch Fotos, auf denen du zu erkennen bist. Viele Apps kosten kein Geld. Oft verdienen die Anbieter trotzdem, zum Beispiel mit Werbung, die zu deinen Vorlieben passt, und dafür sammeln sie Daten über dich. Das ist ein Geschäftsmodell, über das du Bescheid wissen solltest. In der Europäischen Union haben Unternehmen Pflichten: Sie müssen dich informieren, wozu sie deine Daten verarbeiten, und dir auf Nachfrage sagen, welche Daten sie über dich gespeichert haben. Du selbst kannst viel tun: Prüfe die Datenschutz-Einstellungen, erlaube nur Zugriffe, die die App für ihre Aufgabe braucht, und überlege vor jedem Beitrag, wer ihn sehen kann.",
      "**Werbung** will Produkte bekannt machen und zum Kauf anregen. Das kann nützlich sein, wenn du so ein Angebot kennenlernst, das dir hilft. Schwierig wird es, wenn du Werbung nicht als Werbung erkennst. Im Netz ist sie oft in Beiträge eingebaut, zum Beispiel wenn jemand ein Produkt zeigt und dafür Geld oder einen anderen Vorteil bekommt, etwa das Produkt selbst. Dann muss der Beitrag als Werbung erkennbar sein, zum Beispiel durch einen deutlichen Hinweis wie „Werbung“ oder „Anzeige“ zu Beginn. Frage dich bei jedem Beitrag: Wer verdient daran, wenn ich das kaufe oder anklicke? So liest du auch Beiträge ohne Hinweis kritischer.",
      "Abwägen bedeutet: Du beschreibst die Nutzung, stellst Chancen und Risiken gegenüber und kommst zu einer **begründeten eigenen Entscheidung**. Sie kann unterschiedlich ausfallen. Eine Person nutzt ein Netzwerk mit privatem Profil, eine andere verzichtet auf Fotos, eine dritte nutzt es nur für die Klasse. Entscheidend ist, dass du deine Entscheidung begründen kannst und dass sie zu dem passt, was dir wichtig ist. Wenn dich etwas im Netz belastet, sprich mit einer Person, der du vertraust, zum Beispiel mit deinen Eltern, einer Lehrkraft oder der Schulsozialarbeit. Informationen für Jugendliche und Eltern bietet die EU-Initiative klicksafe.",
    ],
    terms: [
      {
        term: "Soziales Netzwerk",
        text: "Ein Online-Angebot, in dem Menschen Profile anlegen, Beiträge teilen und miteinander in Kontakt bleiben.",
      },
      {
        term: "Personenbezogene Daten",
        text: "Alle Angaben, die sich auf eine bestimmte Person beziehen, zum Beispiel Name, Adresse, Standort und Fotos, auf denen jemand erkennbar ist.",
      },
      {
        term: "Datenschutz-Einstellungen",
        text: "Die Einstellungen einer App, mit denen du mitbestimmst, welche Daten sie sammelt und wer deine Beiträge sehen kann.",
      },
      {
        term: "Werbekennzeichnung",
        text: "Der deutliche Hinweis, dass ein Beitrag Werbung ist, etwa mit dem Wort „Werbung“ oder „Anzeige“.",
      },
      {
        term: "Abwägen",
        text: "Chancen und Risiken gegenüberstellen und danach eine begründete eigene Entscheidung treffen.",
      },
    ],
    examples: [
      {
        title: "Eine Abwägung zur App „Plauderei“ (eigens verfasst)",
        text: "Chance: Ich bleibe mit meiner Cousine in Kontakt, die weit weg wohnt.\nRisiko: Fotos lassen sich kopieren und weiterleiten.\nEntscheidung: Ich nutze die App, stelle mein Profil auf privat und poste keine Fotos von anderen ohne Erlaubnis.",
        analysis:
          "Die Abwägung nennt eine Chance und ein Risiko und zieht daraus eine Entscheidung mit passenden Schutzmaßnahmen. Eine andere Person könnte anders entscheiden, zum Beispiel ganz auf Fotos verzichten. Entscheidend ist, dass die Begründung nachvollziehbar ist.",
      },
    ],
    takeaway:
      "Abwägen heißt: Chancen und Risiken gegenüberstellen und dann eine begründete eigene Entscheidung treffen. Prüfe Datenschutz-Einstellungen, teile sparsam und frage bei Beiträgen, wer an ihnen verdient. Werbung muss als Werbung erkennbar sein.",
    sourceIds: ["lp", "klicksafe", "youngdata", "medienanstalten", "gesetze"],
    quiz: {
      question: "Was bedeutet es, Chancen und Risiken einer App abzuwägen?",
      answer: "Ich stelle Vorteile und Gefahren gegenüber und entscheide dann begründet selbst, ob und wie ich die App nutze.",
      wrong: [
        "Ich nutze nur Apps, die keinerlei Risiken haben, und lehne alle anderen ab.",
        "Ich übernehme die Entscheidung der Mehrheit in meinem Freundeskreis, weil dort die Vorteile überwiegen.",
      ],
      explanation:
        "Abwägen heißt, Vorteile und Gefahren gegenüberzustellen und dann selbst zu entscheiden. Kein Angebot ist völlig ohne Risiko, und der Mehrheit zu folgen ist keine eigene, begründete Entscheidung.",
    },
    workshop: {
      kind: "classify",
      title: "Chance, Risiko oder Schutzmaßnahme?",
      instruction:
        "Alle Situationen sind erfunden und stammen aus dem Alltag von Jugendlichen. Ordne jede Situation zu: Ist sie eine Chance, ein Risiko oder eine Schutzmaßnahme?",
      categories: ["Chance", "Risiko", "Schutzmaßnahme"],
      entries: [
        {
          text: "In der Gruppe „9b“ der Quasselbox-App klären alle schnell, wer die Hausaufgaben mitbringt.",
          target: 0,
          feedback: "Das Netzwerk erleichtert den Austausch in der Klasse und spart Zeit.",
        },
        {
          text: "Ein peinliches Foto aus dem Sportunterricht wird auf Quasselbox weitergeleitet und lässt sich kaum noch zurückholen.",
          target: 1,
          feedback: "Beiträge lassen sich kopieren und weiterleiten; die betroffene Person verliert die Kontrolle.",
        },
        {
          text: "Mia stellt ihr Profil auf „privat“ und prüft, wer ihre Beiträge sehen darf.",
          target: 2,
          feedback: "Sie nutzt die Datenschutz-Einstellungen, um das Risiko zu verringern.",
        },
        {
          text: "Jonas findet in einer Video-App Erklärvideos, die ihm bei Mathe weiterhelfen.",
          target: 0,
          feedback: "Medien können das Lernen unterstützen und Wissen leicht zugänglich machen.",
        },
        {
          text: "Eine Wetter-App will auf Kontakte und Fotos zugreifen, obwohl sie diese Daten für die Wettervorhersage nicht braucht.",
          target: 1,
          feedback: "Die App sammelt mehr Daten, als sie für ihre Aufgabe braucht.",
        },
        {
          text: "Vor dem Posten fragt Ben die Freundin auf dem Foto, ob sie damit einverstanden ist.",
          target: 2,
          feedback: "Er achtet das Recht der Freundin am eigenen Bild und beugt Ärger vor.",
        },
      ],
      conclusion:
        "Dieselbe Mediennutzung hat Chancen und Risiken. Schutzmaßnahmen verringern Risiken, ohne die Chancen aufzugeben; ob sie dir reichen, entscheidest du.",
    },
    casework: {
      title: "Eine neue Foto-App",
      story:
        "Lina will die neue Foto-App **„Fotojagd“** (erfunden) ausprobieren. Sie ist kostenlos. Bei der Anmeldung verlangt sie **Namen, Geburtstag, Standort und Zugriff auf alle Kontakte**. Ein Freund sagt: „Alle nutzen sie, installier sie einfach.“ Später sieht Lina in der App Beiträge mit dem Hinweis **„Anzeige“**.",
      steps: [
        {
          question: "Wie finanzieren sich viele kostenlose Apps?",
          options: [
            "Oft durch Werbung, die zu den gesammelten Daten der Nutzenden passt",
            "Immer durch freiwillige Spenden der Nutzerinnen und Nutzer",
            "Gar nicht, die Anbieter verlieren dabei meist Geld",
          ],
          answer: 0,
          explanation:
            "Viele Anbieter verdienen mit Werbung, und je besser sie ihre Nutzenden kennen, desto gezielter können sie werben. Deshalb lohnt sich der Blick auf die Daten.",
        },
        {
          question: "Welche Frage hilft Lina, ihre Daten zu schützen?",
          options: [
            "Braucht die App diese Angaben, damit sie funktioniert?",
            "Wie viele aus ihrem Freundeskreis nutzen die App schon?",
            "Wie viele Filter bietet die App an?",
          ],
          answer: 0,
          explanation:
            "Eine App sollte nur die Daten verlangen, die sie für ihre Aufgabe braucht. Ob Freundinnen und Freunde die App nutzen oder wie viele Filter sie hat, sagt darüber nichts aus.",
        },
        {
          question: "Welche Entscheidung ist am besten begründet?",
          options: [
            "Sie erlaubt nur, was die App zum Funktionieren braucht, und prüft die Datenschutz-Einstellungen.",
            "Sie erlaubt alles, weil die App kostenlos ist und alle sie nutzen.",
            "Sie verzichtet auf jede App, weil jede App Daten missbraucht.",
          ],
          answer: 0,
          explanation:
            "Die erste Entscheidung nutzt die Chance und begrenzt das Risiko. Die zweite folgt nur der Mehrheit, die dritte übertreibt, denn nicht jede App ist gleich.",
        },
        {
          question: "Wozu dient der Hinweis „Anzeige“ bei einem Beitrag?",
          options: [
            "Er zeigt, dass der Beitrag Werbung ist.",
            "Er zeigt, dass der Beitrag von der App geprüft wurde.",
            "Er zeigt, dass der Beitrag besonders viele Personen erreicht hat.",
          ],
          answer: 0,
          explanation:
            "„Anzeige“ oder „Werbung“ kennzeichnet Werbung, damit du sie als Werbung erkennst. Mit einer Prüfung oder mit Beliebtheit hat der Hinweis nichts zu tun.",
        },
      ],
      verdict:
        "Lina nutzt den Nutzen der App, gibt aber nicht mehr Daten frei als nötig und erkennt Werbung am Hinweis. So trifft sie eine eigene, begründete Entscheidung; eine andere Person könnte ebenso begründet verzichten.",
    },
    tasks: {
      1: {
        prompt:
          "Die erfundene Video-App „Klippkiste“ zeigt kurze Videos. Schreibe in vier bis fünf Sätzen eine Abwägung: Nenne eine Chance und ein Risiko und triff eine begründete Entscheidung, wie du die App nutzen würdest.",
        hints: [
          "Nenne eine konkrete Chance und ein konkretes Risiko, nicht nur „gut“ und „schlecht“.",
          "Deine Entscheidung braucht eine Begründung und mindestens eine Maßnahme, zum Beispiel eine Einstellung.",
        ],
        model:
          "Die erfundene App „Klippkiste“ zeigt kurze Videos. Eine Chance ist, dass ich dort Tricks für die Schule oder den Alltag lerne, die ich sonst nicht kennen würde. Ein Risiko ist, dass die App viel Zeit verbraucht, wenn ein Video nach dem anderen von selbst startet. Ich würde die App nutzen, aber die automatische Wiedergabe ausschalten und mir eine feste Zeit setzen. So behalte ich den Nutzen, ohne dass die App meinen Nachmittag bestimmt.",
        criteria: [
          "Nennt eine konkrete Chance und ein konkretes Risiko.",
          "Trifft eine eigene Entscheidung.",
          "Begründet die Entscheidung und nennt eine Maßnahme.",
        ],
      },
      2: {
        prompt:
          "Ein Mitschüler namens Tom stellt ein Video von der Klassenfahrt öffentlich ins Netz, in dem du gut zu erkennen bist. In einem anderen Beitrag stellt er Kopfhörer vor, die ihm der Hersteller dafür kostenlos geschickt hat, und erwähnt das nicht. Schreibe ihm eine sachliche Nachricht in vier bis sechs Sätzen: Nenne, was du am Video gut findest, was dich stört und was er bei den Kopfhörern ändern sollte.",
        hints: [
          "Nenne zuerst, was am Video gut ist, und erkläre dann, welches Problem es für dich gibt.",
          "Achte beim zweiten Beitrag darauf, ob andere erkennen können, dass Werbung dahintersteckt.",
        ],
        model:
          "Hallo Tom, ich fand die Klassenfahrt auch toll, und das Video hält schöne Erinnerungen fest. Trotzdem bin ich darin gut zu erkennen, und du hast mich vorher nicht gefragt. Bitte nimm das Video aus dem öffentlichen Bereich, denn wer erkennbar zu sehen ist, muss grundsätzlich vorher einwilligen. Wenn du es wieder zeigen willst, frag mich bitte vorher. Bei den Kopfhörern solltest du zu Beginn „Werbung“ dazuschreiben, weil du sie kostenlos vom Hersteller bekommen hast. Sonst können andere nicht erkennen, dass ein Interesse dahintersteckt.",
        criteria: [
          "Nennt eine Chance und ein Problem des Videos.",
          "Begründet, warum er vor der Veröffentlichung hätte fragen sollen.",
          "Erklärt, warum der Beitrag über die Kopfhörer als Werbung erkennbar sein sollte.",
        ],
      },
    },
  },
  {
    id: "de-filmsprache",
    lb: 2,
    unit: "2.4",
    covers: ["2.4.2"],
    title: "Filmsprache: Wirkung von Bild, Schnitt und Ton",
    intro:
      "Ein Film erzählt mit Bild, Schnitt und Ton. Wer diese Mittel erkennt, versteht, warum eine Szene spannend oder traurig wirkt.",
    paragraphs: [
      "Ein Film erzählt nicht nur mit Handlung und Dialogen, sondern mit seiner **Filmsprache**: mit dem Bildausschnitt, mit der Perspektive, mit dem Schnitt und mit dem Ton. Diese Mittel sind kein Zufall, sondern Entscheidungen des Filmteams. Um sie zu beurteilen, gehst du in drei Schritten vor: Du beschreibst, was du siehst und hörst, du benennst das Mittel mit dem Fachbegriff, und du erklärst die Wirkung. Die Wirkung ist keine feste Regel, denn dieselbe Einstellung kann in einer anderen Szene anders wirken. Du begründest sie deshalb immer mit der Szene.",
      "Die **Einstellungsgröße** legt fest, wie viel das Bild zeigt. Die **Totale** gibt einen Überblick über den Ort, die **Halbtotale** zeigt Personen ganz in ihrer Umgebung. Die **Halbnah**-Einstellung zeigt eine Person ungefähr von Kopf bis Hüfte oder bis zu den Knien und lässt die Gestik erkennen, die **Nah**-Einstellung zeigt Kopf und Brust. Die Grenzen zwischen den Größen sind nur Richtwerte. In der **Großaufnahme** füllt das Gesicht das Bild, sodass du die Mimik und die Gefühle der Figur siehst. Die **Detailaufnahme** zeigt nur einen Ausschnitt, etwa ein Auge oder eine Hand, und lenkt den Blick auf etwas Wichtiges. Je näher die Kamera rückt, desto mehr rückt meist die Figur selbst in den Mittelpunkt.",
      "Die **Kameraperspektive** ist der Blickwinkel. Bei der **Normalsicht** blickt die Kamera auf Augenhöhe der Figuren. Die **Vogelperspektive** blickt von oben herab: Eine Figur wirkt dann oft klein, schwach oder verloren. Die **Froschperspektive** blickt von unten hinauf: Eine Figur wirkt oft groß, mächtig oder bedrohlich. Auch Licht und Farben gehören zu den Bildeffekten. Dunkle Bilder wirken oft geheimnisvoll oder gefährlich, helle und warme oft freundlich. Wie bei allen Mitteln gilt: Prüfe, ob die Wirkung zur Szene passt.",
      "Der **Schnitt** verbindet die einzelnen Einstellungen zu einer Szene. Viele schnelle Schnitte erzeugen oft Tempo und Spannung, lange Einstellungen wirken meist ruhig. Beim harten Schnitt wechselt das Bild abrupt, bei der Überblendung geht es sanft ineinander über. Beim **Schuss-Gegenschuss** wechselt das Bild zwischen zwei Personen im Gespräch, bei der **Parallelmontage** springt der Film zwischen zwei Handlungen, die gleichzeitig ablaufen, und baut so oft Spannung auf. Zum Film gehört auch der **Ton**: Filmmusik beeinflusst die Stimmung, Geräusche können eine Szene wirklich oder bedrohlich wirken lassen, Sprache liefert Informationen, und selbst Stille ist ein Mittel. Bild und Ton wirken zusammen.",
    ],
    terms: [
      {
        term: "Einstellungsgröße",
        text: "Der Bildausschnitt einer Einstellung, von der Totale über Nah und Groß bis zur Detailaufnahme.",
      },
      {
        term: "Kameraperspektive",
        text: "Der Blickwinkel der Kamera: auf Augenhöhe (Normalsicht), von oben (Vogelperspektive) oder von unten (Froschperspektive).",
      },
      {
        term: "Schnitt",
        text: "Die Verbindung zweier Einstellungen, die Tempo, Zusammenhang und Spannung einer Szene bestimmt.",
      },
      {
        term: "Schuss-Gegenschuss",
        text: "Ein Wechsel des Bildes zwischen zwei Personen, meist bei einem Gespräch.",
      },
      {
        term: "Parallelmontage",
        text: "Der Wechsel zwischen zwei Handlungen, die gleichzeitig an verschiedenen Orten ablaufen.",
      },
      {
        term: "Filmton",
        text: "Alles, was du in einem Film hörst: Musik, Geräusche, Sprache und auch bewusste Stille.",
      },
    ],
    examples: [
      {
        title: "Drei Einstellungen, drei Wirkungen (eigens verfasst)",
        text: "Totale: Ein Schüler steht allein auf dem leeren Sportplatz.\nGroß: Seine Lippen sind zusammengepresst.\nDetail: Seine Hand zerknüllt einen Zettel.",
        analysis:
          "Die Totale zeigt den ganzen Platz und lässt den Schüler klein und einsam wirken. Die Großaufnahme rückt an sein Gesicht und zeigt seine Anspannung. Die Detailaufnahme lenkt den Blick auf den Zettel, der offenbar wichtig ist. Die drei Einstellungen führen von der Situation zu den Gefühlen und dann zum Auslöser.",
      },
    ],
    takeaway:
      "Film wirkt durch Bild, Schnitt und Ton: Einstellungsgröße und Perspektive bestimmen Nähe und Eindruck, der Schnitt Tempo und Zusammenhang, der Ton die Stimmung. Beschreibe, benenne das Mittel und erkläre die Wirkung in der Szene.",
    sourceIds: ["lp", "bpb", "kinofenster"],
    quiz: {
      question: "Die Kamera blickt von unten zu einer Figur hinauf. Welche Wirkung ist typisch?",
      answer: "Die Figur wirkt groß, mächtig oder bedrohlich.",
      wrong: [
        "Die Figur wirkt klein, schwach oder verloren.",
        "Die Figur wirkt neutral, so wie man sie auf Augenhöhe sieht.",
      ],
      explanation:
        "Der Blick von unten ist die Froschperspektive und lässt Figuren oft mächtig wirken. Der Blick von oben (Vogelperspektive) lässt sie eher klein wirken, die Normalsicht auf Augenhöhe wirkt neutral.",
    },
    workshop: {
      kind: "mark",
      title: "Filmische Mittel in einer Szene finden",
      instruction:
        "Hier ist eine Szene eines erfundenen Jugendfilms als Text beschrieben. Wähle oben ein Mittel und klicke die Stelle an, die es zeigt. Was die Figuren tun, ist kein filmisches Mittel und bleibt unmarkiert.",
      labels: ["Einstellungsgröße", "Perspektive", "Schnitt oder Übergang", "Ton"],
      text: [
        { t: "Szene 7, Turnhalle, abends" },
        { t: ". " },
        {
          t: "Totale",
          label: 0,
          feedback: "Die Totale zeigt den ganzen Raum und gibt einen Überblick über den Ort.",
        },
        { t: ": " },
        { t: "Die große Halle liegt im Dunkeln" },
        { t: ". " },
        {
          t: "Man hört nur das leise Summen der Lampen",
          label: 3,
          feedback:
            "Das Summen ist ein Geräusch. Weil es sonst still ist, macht es die leere Halle hörbar und unheimlich.",
        },
        { t: ". " },
        { t: "Mia betritt die Halle" },
        { t: ". " },
        {
          t: "Halbnah",
          label: 0,
          feedback: "Halbnah zeigt Mia ungefähr von Kopf bis Hüfte oder bis zu den Knien. Man sieht ihre Gestik und noch etwas vom Raum.",
        },
        { t: ": " },
        { t: "Mia sucht mit der Taschenlampe den Boden ab" },
        { t: ". " },
        { t: "Plötzlich rollt hinter ihr ein Ball über den Boden" },
        { t: ". " },
        {
          t: "Harter Schnitt",
          label: 2,
          feedback: "Beim harten Schnitt wechselt das Bild abrupt. Das passt zum plötzlichen Schreck.",
        },
        { t: ". " },
        {
          t: "Großaufnahme",
          label: 0,
          feedback: "In der Großaufnahme füllt Mias Gesicht das Bild. Man sieht ihre Angst in den Augen.",
        },
        { t: ": " },
        { t: "Mias Gesicht, die Augen weit aufgerissen" },
        { t: ". " },
        {
          t: "Die Musik setzt mit tiefen, langsamen Tönen ein",
          label: 3,
          feedback: "Filmmusik lenkt die Stimmung. Tiefe, langsame Töne wirken hier bedrohlich.",
        },
        { t: ". " },
        {
          t: "Froschperspektive",
          label: 1,
          feedback: "Die Kamera blickt von unten hinauf. Die Gestalt wirkt dadurch groß und bedrohlich.",
        },
        { t: ": " },
        { t: "Eine Gestalt tritt aus dem Schatten und ragt über Mia auf" },
        { t: ". " },
        {
          t: "Weiche Überblendung",
          label: 2,
          feedback: "Bei der Überblendung gehen zwei Bilder sanft ineinander über. Sie verbindet hier zwei Zeitpunkte.",
        },
        { t: ": " },
        { t: "Am nächsten Morgen lacht Mia im Klassenzimmer über den Schreck" },
        { t: "." },
      ],
      conclusion:
        "Einstellungsgröße, Perspektive, Schnitt und Ton wirken zusammen: Die Szene steigert die Spannung und löst sie danach mit einem sanften Übergang wieder auf.",
    },
    casework: {
      title: "Eine Szene auf der Tribüne",
      story:
        "In einem erfundenen Jugendfilm sitzt Tom allein auf der Tribüne des Sportplatzes. Die Kamera zeigt ihn zuerst **von weit oben in einer Totale**: Er wirkt winzig zwischen den leeren Reihen. Dann folgt eine **Detailaufnahme** seiner Hand, die ein Handy hält, auf dem keine neue Nachricht erscheint. Zu hören ist **nur das Ticken einer Uhr**, keine Musik. Danach folgt ein **harter Schnitt** zu seiner Klasse, die lachend im Bus sitzt.",
      steps: [
        {
          question: "Welche Perspektive und Einstellungsgröße zeigen Tom zu Beginn?",
          options: [
            "Vogelperspektive in der Totale",
            "Froschperspektive in der Großaufnahme",
            "Normalsicht in der Halbnah-Einstellung",
          ],
          answer: 0,
          explanation:
            "„Von weit oben“ ist die Vogelperspektive, und dass Tom zwischen den leeren Reihen winzig wirkt, spricht für die Totale.",
        },
        {
          question: "Welche Wirkung hat diese Wahl?",
          options: [
            "Tom wirkt klein und verloren auf der leeren Tribüne.",
            "Tom wirkt mächtig und überlegen.",
            "Tom wirkt neutral, die Wahl hat keine besondere Wirkung.",
          ],
          answer: 0,
          explanation:
            "Der Blick von oben und der Überblick über die leere Tribüne betonen Toms Einsamkeit. Mächtig würde er aus der Froschperspektive wirken.",
        },
        {
          question: "Wozu dient das Ticken der Uhr ohne Musik?",
          options: [
            "Es macht das Warten und die Stille spürbar.",
            "Es zeigt, dass gleich etwas Gefährliches passiert.",
            "Es hat keine Bedeutung, denn im Film wirkt nur Musik.",
          ],
          answer: 0,
          explanation:
            "Das einzelne Geräusch füllt die Stille und lässt die Zeit zäh vergehen. Auch Geräusche und Stille sind Mittel, nicht nur Musik.",
        },
        {
          question: "Was bewirkt der harte Schnitt auf die lachende Klasse?",
          options: [
            "Er stellt Toms Einsamkeit der Gemeinschaft der anderen gegenüber.",
            "Er zeigt, dass die Klasse Tom bewusst ausgrenzt.",
            "Er geht sanft in eine Erinnerung von Tom über.",
          ],
          answer: 0,
          explanation:
            "Der abrupte Wechsel setzt zwei Bilder gegeneinander und macht den Kontrast deutlich. Dass die anderen ihn ausgrenzen, zeigt der Film nicht, und ein sanfter Übergang wäre eine Überblendung.",
        },
      ],
      verdict:
        "Der Film erzählt Toms Einsamkeit fast ohne Worte: Vogelperspektive und Totale machen ihn klein, die Stille macht das Warten hörbar, der harte Schnitt setzt die Gemeinschaft der anderen dagegen.",
    },
    tasks: {
      1: {
        prompt:
          "In einer erfundenen Filmszene sieht man zuerst in Großaufnahme Leas zitternde Hände, die einen Brief öffnen. Dann folgt ein schneller Schnitt zu Lea selbst in der Naheinstellung (Kopf und Brust). Dazu hört man nur ihren schnellen Atem. Nenne zwei filmische Mittel dieser Szene und beschreibe in vier bis fünf Sätzen jeweils ihre Wirkung.",
        hints: [
          "Benenne die Mittel mit Fachbegriffen: Einstellungsgröße, Schnitt oder Ton.",
          "Frage dich bei jedem Mittel: Was erfahre ich über Lea, und welches Gefühl entsteht bei mir?",
        ],
        model:
          "In der Szene werden mehrere Mittel eingesetzt. Die Großaufnahme der zitternden Hände zeigt Leas Anspannung, ohne dass sie etwas sagen muss; das Publikum sieht, wie wichtig der Brief für sie ist. Der schnelle Atem als einziger Ton macht die Stille um sie herum hörbar und lässt die Spannung steigen, weil man darauf wartet, was im Brief steht. Der schnelle Schnitt zu Lea in der Naheinstellung verstärkt das Tempo und zeigt, wie sie auf den Inhalt reagiert.",
        criteria: [
          "Nennt zwei filmische Mittel mit Fachbegriff.",
          "Belegt jedes Mittel mit einer Stelle der Szene.",
          "Erklärt zu jedem Mittel die Wirkung auf Figur oder Publikum.",
        ],
      },
      2: {
        prompt:
          "Du planst eine Szene für einen eigenen Kurzfilm: Eine Figur soll auf das Publikum mächtig und ein wenig bedrohlich wirken, als sie einen Raum betritt. Beschreibe in vier bis fünf Sätzen, welche Einstellungsgröße, welche Perspektive und welchen Ton du wählst, und begründe jede Wahl mit ihrer Wirkung. Beurteile am Ende, ob die Mittel zur Absicht passen.",
        hints: [
          "Überlege, aus welcher Perspektive eine Figur groß und mächtig wirkt, und welche Einstellungsgröße das verstärkt.",
          "Wähle einen Ton, der zur Bedrohung passt, zum Beispiel Musik, Geräusche oder Stille, und erkläre seine Wirkung.",
        ],
        model:
          "Als der Trainer die Umkleide betritt, zeige ich ihn in der Froschperspektive, damit er über den anderen aufzuragen scheint und mächtig wirkt. Ich wähle eine Halbnah-Einstellung, weil man so seine breite Haltung sieht und noch den Raum um ihn erkennt. Als Ton setze ich langsame, tiefe Schritte und keine Musik, damit jeder Schritt hörbar wird und Spannung aufbaut. Ich beurteile die Wahl als passend: Perspektive und Ton wirken zusammen und lassen den Trainer überlegen und leicht bedrohlich wirken.",
        criteria: [
          "Wählt Einstellungsgröße, Perspektive und Ton für die Szene.",
          "Begründet jede Wahl mit ihrer Wirkung.",
          "Beurteilt, ob die Mittel zur Absicht der Szene passen.",
        ],
      },
    },
  },
  {
    id: "de-medien-gestalten",
    lb: 2,
    unit: "2.4",
    covers: ["2.4.2", "2.4.3"],
    title: "Einen Podcast oder eine Filmsequenz planen",
    intro:
      "Eigene Medien entstehen in Schritten: von der Idee über Exposé, Skript und Aufnahme bis zum Schnitt und zur Veröffentlichung.",
    paragraphs: [
      "Wenn du ein Thema aus einem Fach oder einem Projekt präsentieren willst, kannst du statt eines Vortrags ein eigenes Medium gestalten, zum Beispiel einen **Podcast** (nur Ton) oder eine **Filmsequenz** (Bild und Ton). Welches Format passt, hängt vom Ziel, von der Zielgruppe und von euren Möglichkeiten ab: Ein Podcast braucht Sprache und Geräusche, ein Film zusätzlich Bilder, Orte und Darstellende. Im Team verteilt ihr Aufgaben, zum Beispiel Idee und Text, Aufnahme, Schnitt und Organisation. Der Weg zum fertigen Medium hat typische Stationen: Idee, Exposé, Skript oder Drehbuch (bei Filmen mit Storyboard), Aufnahme, Schnitt und Veröffentlichung.",
      "Am Anfang steht die **Idee**: Was wollt ihr erzählen oder erklären, für wen, und in welchem Format? Das **Exposé** hält die Idee kurz fest: Thema, Zielgruppe, Handlung oder Ablauf, Figuren oder Sprechende und die geplante Länge. Wer einen Film mit Handlung plant, entwirft den **dramaturgischen Ablauf**: einen Anfang, der Figuren und Situation vorstellt, eine Mitte, in der ein Problem Spannung erzeugt, und ein Ende mit einer Lösung oder Pointe. Figuren brauchen ein Ziel („Was will sie?“), und ihre Dialoge sollen kurz und gut sprechbar sein. Ein Wissensformat folgt demselben Prinzip: Es beginnt mit einem Einstieg, erklärt in Schritten und endet mit einer Zusammenfassung.",
      "Aus dem Exposé wird das **Skript**. Bei einem Podcast ist das der ausgeschriebene Sprechtext mit Hinweisen zu Musik und Geräuschen. Bei einem Film ist es das **Drehbuch**, das Szene für Szene Ort, Zeit, Handlung und Dialog festhält. Ein **Storyboard** zeigt die Einstellungen als Skizzen, oft mit Angaben zu Einstellungsgröße, Perspektive und Ton; hier nutzt du, was du über Filmsprache weißt. Bei der Aufnahme hilft eine Probe: Ein ruhiger Raum und geprüfter Ton ersparen später viel Arbeit. Im Schnitt kürzt ihr Fehler und Längen, ordnet die Teile und fügt Musik oder Geräusche ein. Rhythmus und Ton bestimmen auch hier die Wirkung.",
      "Bevor du etwas veröffentlichst, klärst du die Rechte. Wer in einem Foto oder Video erkennbar ist, muss grundsätzlich einwilligen, bevor es verbreitet wird; das gilt auch für das Hochladen ins Internet und schützt das **Recht am eigenen Bild**. Frage darum vor dem Dreh alle, die zu sehen oder zu hören sind. Fremde Musik, Bilder und Videos gehören in der Regel anderen: Du brauchst deren Erlaubnis oder nimmst Material, dessen Nutzung ausdrücklich erlaubt ist, und beachtest die Bedingungen. Gib außerdem nicht mehr persönliche Angaben preis als nötig, etwa Adressen. Wo und wie ihr euer Ergebnis zeigen dürft, klärt ihr mit eurer Lehrkraft. Erst dann veröffentlicht ihr.",
    ],
    terms: [
      {
        term: "Exposé",
        text: "Eine kurze Zusammenfassung der Idee mit Thema, Zielgruppe, Ablauf, Figuren oder Sprechenden und Länge.",
      },
      {
        term: "Skript",
        text: "Der ausgeschriebene Text eines Podcasts oder Videos mit Hinweisen zu Ton und Ablauf.",
      },
      {
        term: "Drehbuch",
        text: "Der Plan eines Films, der Szene für Szene Ort, Zeit, Handlung und Dialoge festhält.",
      },
      {
        term: "Storyboard",
        text: "Eine Folge von Skizzen, die jede geplante Einstellung zeigt, oft mit Angaben zu Bildausschnitt, Perspektive und Ton.",
      },
      {
        term: "Dramaturgischer Ablauf",
        text: "Der Aufbau einer Geschichte aus Anfang, Mitte mit Spannung und Ende mit Lösung oder Pointe.",
      },
      {
        term: "Recht am eigenen Bild",
        text: "Das Recht jeder Person, mitzuentscheiden, ob Bilder von ihr verbreitet werden.",
      },
    ],
    examples: [
      {
        title: "Ein Exposé in fünf Zeilen (eigens verfasst)",
        text: "Thema: Wie funktioniert eine Solaranlage auf dem Schuldach?\nFormat: Podcast, etwa vier Minuten, für die achte Klasse\nAufbau: Einstiegsfrage, Erklärung in zwei Schritten, ein Beispiel von unserer Schule, Merksatz\nSprechende: zwei Personen, eine fragt, eine erklärt\nMaterial: eigene Aufnahmen, keine fremde Musik",
        analysis:
          "Das Exposé nennt Thema, Format, Zielgruppe, Aufbau und Sprechende auf wenigen Zeilen. Daraus lässt sich später das Skript schreiben. Die Angabe „keine fremde Musik“ zeigt, dass das Team die Rechte schon bei der Planung bedacht hat.",
      },
    ],
    takeaway:
      "Ein eigenes Medium entsteht in Schritten: Idee, Exposé, Skript oder Drehbuch mit Storyboard, Aufnahme, Schnitt und Veröffentlichung. Klärt vorher die Einwilligung aller Gezeigten und die Rechte an fremder Musik und fremden Bildern.",
    sourceIds: ["lp", "bpb", "dwds", "youngdata", "gesetze", "blm"],
    quiz: {
      question: "Wozu dient ein Storyboard?",
      answer: "Es plant einen Film Bild für Bild mit Skizzen und Angaben zu Einstellung und Ton.",
      wrong: [
        "Es fasst die Idee des Films kurz zusammen, damit andere sie beurteilen können.",
        "Es enthält den vollständigen gesprochenen Text des Films mit allen Rollen.",
      ],
      explanation:
        "Ein Storyboard zeigt die geplanten Einstellungen als Skizzen. Die Zusammenfassung der Idee ist das Exposé, der ausgeschriebene Text das Skript oder Drehbuch.",
    },
    workshop: {
      kind: "timeline",
      title: "Vom Einfall zum fertigen Beitrag",
      instruction:
        "Bringe die Arbeitsschritte eines Teams in die richtige Reihenfolge, vom ersten Schritt oben bis zur Veröffentlichung unten.",
      categories: [],
      entries: [
        {
          text: "Das Team einigt sich auf Thema, Zielgruppe und Format, zum Beispiel einen Podcast für die achte Klasse.",
          target: 0,
          feedback: "Am Anfang steht die Idee: Ohne Ziel und Zielgruppe lässt sich nichts weiter planen.",
        },
        {
          text: "Ein Exposé hält Idee, Ablauf und Sprechende oder Figuren kurz fest.",
          target: 1,
          feedback: "Das Exposé fasst die Idee zusammen, bevor das Team Text oder Bilder ausarbeitet.",
        },
        {
          text: "Aus dem Exposé entstehen das Skript oder Drehbuch und, bei einem Film, ein Storyboard mit den geplanten Einstellungen.",
          target: 2,
          feedback: "Erst wenn der Plan steht, werden Text und Szenenfolge ausgearbeitet.",
        },
        {
          text: "Das Team klärt, wer einwilligen muss, und nimmt dann Ton oder Bild auf, zuerst als Probe.",
          target: 3,
          feedback:
            "Einwilligungen werden vor der Aufnahme geklärt; eine Probe zeigt früh, ob Ton und Bild gelingen.",
        },
        {
          text: "Beim Schnitt wird das Material gekürzt, geordnet und mit Musik oder Geräuschen ergänzt, die das Team nutzen darf.",
          target: 4,
          feedback: "Der Schnitt kommt nach der Aufnahme, weil er mit dem fertigen Material arbeitet.",
        },
        {
          text: "Vor der Veröffentlichung prüft das Team die Rechte noch einmal und klärt mit der Lehrkraft, wo das Ergebnis gezeigt wird.",
          target: 5,
          feedback: "Veröffentlicht wird erst am Ende, wenn Einwilligungen und Rechte geklärt sind.",
        },
      ],
      conclusion:
        "Die Reihenfolge schützt vor Arbeit, die später verloren geht: erst planen, dann aufnehmen, dann schneiden, zuletzt veröffentlichen. Die Rechte klärst du vor der Aufnahme und noch einmal vor der Veröffentlichung.",
    },
    casework: {
      title: "Ein Erklärvideo für die Projektpräsentation",
      story:
        "Das Team 9c plant für die Projektpräsentation ein dreiminütiges Erklärvideo über Mülltrennung. Aus den Notizen: **Drehort Pausenhof. Mitspielende: Finn und Aylin, außerdem filmen wir Schülerinnen und Schüler, die zufällig vorbeikommen und im Bild gut zu erkennen sind. Musik: ein bekannter Hit aus dem Radio. Das fertige Video laden wir sofort auf den öffentlichen Kanal der Klasse hoch.**",
      steps: [
        {
          question: "Was ist an den zufällig gefilmten Schülerinnen und Schülern für die geplante Veröffentlichung ein Problem?",
          options: [
            "Wer erkennbar zu sehen ist, muss in der Regel vor der Veröffentlichung einwilligen.",
            "Nichts, weil das Video ja nur für die Schule gedacht ist.",
            "Nichts, weil auf dem Pausenhof ohnehin alle gefilmt werden dürfen.",
          ],
          answer: 0,
          explanation:
            "Wer erkennbar abgebildet ist, entscheidet grundsätzlich mit, ob ein Video verbreitet wird. Ausnahmen gibt es nur in wenigen Fällen, deshalb fragt das Team lieber. Ein öffentlicher Kanal erreicht außerdem viel mehr Menschen als nur die Schule.",
        },
        {
          question: "Was ist beim bekannten Hit aus dem Radio zu beachten?",
          options: [
            "Fremde Musik darf nicht ohne Weiteres verwendet werden; das Team braucht Erlaubnis oder nimmt Musik, deren Nutzung erlaubt ist.",
            "Der Hit darf frei verwendet werden, wenn er nur wenige Sekunden läuft.",
            "Der Hit darf verwendet werden, wenn der Name der Sängerin im Abspann steht.",
          ],
          answer: 0,
          explanation:
            "Musik gehört in der Regel den Urhebern und Rechteinhabern. Eine Sekundengrenze, ab der Musik frei ist, gibt es nicht, und der Name der Sängerin im Abspann ist keine Erlaubnis.",
        },
        {
          question: "Was fehlt in den Notizen noch, bevor gedreht wird?",
          options: [
            "Ein Skript oder Drehbuch, das Ablauf und Texte festlegt",
            "Ein fertiger Schnitt des Videos",
            "Die Veröffentlichung auf dem Kanal der Klasse",
          ],
          answer: 0,
          explanation:
            "Vor dem Dreh brauchen die Teammitglieder einen Plan: Ablauf, Texte und Einstellungen. Schnitt und Veröffentlichung folgen erst nach der Aufnahme.",
        },
        {
          question: "Was sollte das Team vor dem Hochladen mit der Lehrkraft klären?",
          options: [
            "Wo das Video gezeigt werden darf und ob alle Einwilligungen vorliegen",
            "Wie viele Personen das Video am Ende anschauen sollen",
            "Welche Musik zurzeit am beliebtesten ist",
          ],
          answer: 0,
          explanation:
            "Vor der Veröffentlichung geht es um Ort und Rechte: Wo darf das Video gezeigt werden, und haben alle Gezeigten zugestimmt?",
        },
      ],
      verdict:
        "Das Team hat Thema und Drehort, aber noch keinen Plan und keine geklärten Rechte. Erst mit Skript, Einwilligungen und erlaubter Musik kann es sinnvoll drehen und veröffentlichen.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe ein Exposé für einen Podcast von etwa drei Minuten, mit dem ihr ein Thema aus einem Schulfach vorstellt, zum Beispiel „Wie entsteht ein Gewitter?“ Halte Thema, Zielgruppe, Aufbau mit Anfang, Mitte und Ende, Sprechende und Material in fünf bis sechs Sätzen fest.",
        hints: [
          "Überlege zuerst, für wen der Podcast ist, und wähle dann einen Einstieg, der diese Gruppe anspricht.",
          "Plane einen Anfang mit einer Frage, eine Mitte mit einer Erklärung in Schritten und ein Ende mit einem Merksatz. Denke auch an das Material, zum Beispiel eigene Geräusche statt fremder Musik.",
        ],
        model:
          "Thema: Wie entsteht ein Gewitter? Zielgruppe sind Schülerinnen und Schüler der sechsten Klasse, deshalb erklären wir in einfacher Sprache. Der Podcast dauert etwa drei Minuten. Er beginnt mit einer Frage („Warum donnert es nach dem Blitz?“), erklärt in der Mitte in zwei Schritten, wie Blitz und Donner entstehen, und endet mit einem Merksatz. Zwei Personen führen ein Gespräch: Die eine fragt, die andere erklärt. Als Geräusche nehmen wir Regen und Wind selbst auf und verwenden keine fremde Musik.",
        criteria: [
          "Nennt Thema und Zielgruppe.",
          "Beschreibt Anfang, Mitte und Ende des Podcasts.",
          "Legt Sprechende und Material fest und beachtet dabei die Rechte.",
        ],
      },
      2: {
        prompt:
          "Übertrage eine Idee in eine kurze Filmsequenz: Zwei Freundinnen streiten, weil die eine ein Foto der anderen ohne Nachfrage online gestellt hat. Schreibe den Anfang eines Drehbuchs mit Ort und Zeit, den Figuren und ihren Zielen, einem Dialog von vier bis sechs Zeilen und zwei Kameraanweisungen.",
        hints: [
          "Lege fest, was jede Figur will, und lass den Dialog diesen Konflikt zeigen.",
          "Wähle die Kameraanweisungen so, dass Einstellungsgröße und Perspektive die Stimmung der Szene unterstützen.",
        ],
        model:
          "Szene 1, Schulhof, Pause. Lea will, dass das Foto verschwindet, Nora will keinen größeren Streit. Halbnah: Lea hält Nora ihr Handy hin. LEA: „Du hast das Foto hochgeladen, ohne mich zu fragen!“ NORA: „Es sah doch lustig aus. Ich dachte, das ist okay.“ LEA: „Ich will aber nicht, dass es jeder sieht. Lösch es, bitte.“ NORA: „Gut, ich nehme es raus.“ Großaufnahme: Leas Gesicht, ihre Anspannung löst sich. Vor dem Dreh würde das Team alle Darstellenden um ihre Erlaubnis bitten.",
        criteria: [
          "Nennt Ort, Zeit und das Ziel beider Figuren.",
          "Schreibt einen kurzen, sprechbaren Dialog, der den Konflikt zeigt.",
          "Nennt zwei Kameraanweisungen mit Einstellungsgröße oder Perspektive.",
        ],
      },
    },
  },
];
