import type { Lesson } from "../model/types";

export const LB3: Lesson[] = [
  {
    id: "vs-information",
    lb: 3,
    unit: "3",
    title: "Verbraucherinformationen kritisch bewerten",
    intro: "Wem kann man glauben, wenn viele etwas verkaufen wollen? Quellen prüfen, bevor man kauft.",
    paragraphs: [
      "Lena möchte Kopfhörer kaufen. Sie findet die Herstellerseite, das Video einer Influencerin, ein Vergleichsportal, einen Testbericht und viele Kundenrezensionen. Die Quellen sagen Verschiedenes, und das ist kein Zufall: Jede hat ein eigenes **Interesse**. Hersteller und Werbung wollen verkaufen, ein unabhängiger Test will vergleichen, und die Kundschaft schreibt aus ihrer eigenen Erfahrung. Wer Informationen nutzt, fragt deshalb zuerst: Wer sagt das, und was gewinnt die Quelle dadurch?",
      "Vier Fragen helfen bei der Prüfung. **Unabhängigkeit**: Wird die Quelle vom Verkäufer bezahlt, oder prüft sie neutral? **Aktualität**: Gilt der Bericht noch, oder gibt es längst ein neues Modell? **Methode**: Wurde nach klaren, offengelegten Kriterien getestet, oder ist es nur ein Eindruck? **Interessen**: Verdient die Quelle an deinem Kauf, etwa durch Provisionen für Links? Keine Quelle ist perfekt, aber je mehr dieser Fragen offen bleiben, desto vorsichtiger solltest du sein.",
      "Kundenrezensionen helfen, sind aber nicht immer echt. Es gibt **gekaufte oder gefälschte Bewertungen**: Manche Firmen lassen Lob schreiben oder drücken die Konkurrenz mit schlechten Sternen. Misstrauisch sollte man werden bei vielen gleich klingenden Fünf-Sterne-Texten am selben Tag, bei sehr allgemeinem Lob ohne Details und bei Bewertungen, die nur den Versand loben, aber nichts über das Produkt sagen. Hilfreicher sind Rezensionen mit konkreten Erfahrungen. Lies auch die mittleren und schlechten Bewertungen und achte darauf, was dort immer wieder auftaucht.",
      "Am Ende steht die Entscheidung. Sammle mindestens drei verschiedene Quellen und vergleiche, worin sie sich einig sind. Notiere dir, was dir selbst wichtig ist, zum Beispiel Preis, Haltbarkeit oder Akkulaufzeit. Nennen zwei unabhängige Quellen dasselbe Problem, ist das ein starkes Signal. Erst dann leitest du daraus ab, ob und was du kaufst. So wird aus vielen Informationen eine begründete **Konsumentscheidung**.",
    ],
    terms: [
      { term: "Interesse einer Quelle", text: "Der Vorteil, den eine Quelle von deiner Entscheidung hat, zum Beispiel Verkaufserlöse oder Provisionen." },
      { term: "Unabhängigkeit", text: "Eine Quelle ist unabhängig, wenn der Anbieter sie nicht bezahlt und sie nach offenen Kriterien neutral prüft." },
      { term: "Gefälschte Bewertung", text: "Eine bezahlte oder erfundene Bewertung, die ein Produkt besser oder die Konkurrenz schlechter erscheinen lässt." },
      { term: "Konsumentscheidung", text: "Die begründete Entscheidung, ob und was man kauft, auf Grundlage geprüfter Informationen." },
    ],
    takeaway:
      "Eine Information ist so viel wert wie ihre Quelle: Prüfe Unabhängigkeit, Aktualität, Methode und Interessen, vergleiche mehrere Quellen und entscheide erst dann.",
    sourceIds: ["lp", "vz", "test"],
    quiz: {
      question: "Woran erkennt man bei einem Kaufvergleich am ehesten eine glaubwürdige Informationsquelle?",
      answer: "Sie prüft unabhängig nach offengelegten Kriterien und verdient nicht am Verkauf des Produkts.",
      wrong: [
        "Sie zeigt sehr viele Bewertungen mit fünf Sternen und beschreibt das Produkt besonders ausführlich.",
        "Sie stammt vom Hersteller und nennt viele genaue technische Daten über das Produkt.",
      ],
      explanation:
        "Entscheidend sind Unabhängigkeit und eine nachvollziehbare Methode. Viele Bestnoten können gekauft sein, und selbst genaue Herstellerangaben dienen dem Verkauf.",
    },
    workshop: {
      kind: "classify",
      title: "Wie glaubwürdig ist die Quelle?",
      instruction:
        "Ordne jede Information ein. Eher glaubwürdig: unabhängig geprüft oder durch viele konkrete Erfahrungen gestützt. Mit Vorsicht lesen: Eigeninteresse oder fehlende Offenlegung. Verdächtig: Anzeichen für Täuschung, etwa gekaufte Bewertungen.",
      categories: ["Eher glaubwürdig", "Mit Vorsicht lesen", "Verdächtig"],
      entries: [
        {
          text: "Ein Verbrauchermagazin testet zehn Fahrradhelme nach veröffentlichten Kriterien, kauft sie selbst im Laden und nimmt keine Werbung der Hersteller an.",
          target: 0,
          feedback: "Die Prüfung ist unabhängig und die Methode ist offengelegt.",
        },
        {
          text: "Eine Influencerin zeigt neue Sneaker und sagt, dass sie über ihren Rabattcode bei jedem Kauf eine Provision erhält.",
          target: 1,
          feedback: "Das Interesse ist offen genannt, trotzdem verdient sie am Kauf.",
        },
        {
          text: "Im Shop erscheinen an einem Tag 40 Bewertungen mit fünf Sternen, alle mit dem Text „Super Produkt, sehr zufrieden“.",
          target: 2,
          feedback: "Gleich klingende Bestnoten am selben Tag deuten auf gekaufte Bewertungen hin.",
        },
        {
          text: "Ein Hersteller schreibt auf seiner Webseite, seine Powerbank sei „die beste der Welt“.",
          target: 1,
          feedback: "Das ist Eigenwerbung ohne Beleg, der Hersteller will verkaufen.",
        },
        {
          text: "Viele Rezensionen von verschiedenen Tagen und mit unterschiedlich vielen Sternen nennen übereinstimmend und genau, nach welcher Nutzungsdauer der Akku des Modells nachlässt.",
          target: 0,
          feedback: "Konkrete Erfahrungen von verschiedenen Tagen, auch mit kritischen Stimmen, sind glaubwürdiger als Pauschallob.",
        },
        {
          text: "Ein Vergleichsportal listet Handys in einer Rangliste, verrät aber nicht, wie sie entsteht und welche Anbieter dafür zahlen.",
          target: 1,
          feedback: "Ohne offene Methode und ohne Angabe der Geldgeber bleibt unklar, wessen Interessen zählen; eine Täuschung ist damit nicht belegt.",
        },
      ],
      conclusion: "Frage bei jeder Quelle nach Unabhängigkeit, Methode und Interesse, bevor du ihr vertraust.",
    },
    casework: {
      title: "Die Fitnessuhr",
      story:
        "Tarek (15) will eine Fitnessuhr kaufen. Der Hersteller wirbt mit „Testsieger“, ohne zu sagen, wer getestet hat. Im Onlineshop hat die Uhr **4,9 Sterne**, fast alle Bewertungen stammen **vom selben Wochenende**. Ein unabhängiger Testbericht nennt die Uhr nur „befriedigend“, ist aber **vier Jahre alt** und beschreibt das Vorgängermodell.",
      steps: [
        {
          question: "Wie ist der Hinweis „Testsieger“ des Herstellers einzuordnen?",
          options: [
            "Ein Qualitätsbeleg, denn mit einem Testergebnis wirbt niemand ohne guten Grund.",
            "Eigenwerbung: Ohne Angabe, wer nach welchen Kriterien getestet hat, sagt er wenig aus.",
            "Eine neutrale Information, weil Hersteller nur belegbare Aussagen machen.",
          ],
          answer: 1,
          explanation: "Die Quelle ist der Anbieter selbst und nennt weder Prüfer noch Methode. Das ist Werbung, kein unabhängiger Test.",
        },
        {
          question: "Was spricht gegen die 4,9 Sterne im Shop?",
          options: [
            "Sterne sind grundsätzlich wertlos, weil alle Bewertungen im Netz gefälscht sind.",
            "Eine sehr hohe Note bedeutet immer, dass das Produkt besonders billig ist.",
            "Fast alle Bewertungen kamen am selben Wochenende, was auf gekaufte Bewertungen hindeuten kann.",
          ],
          answer: 2,
          explanation: "Eine auffällige Häufung am selben Termin ist ein Warnzeichen. Es beweist keine Fälschung, verlangt aber weitere Prüfung.",
        },
        {
          question: "Wie sollte Tarek den alten Testbericht nutzen?",
          options: [
            "Als Hinweis auf Stärken und Schwächen der Marke, aber nicht als Urteil über das neue Modell, weil er nicht aktuell ist.",
            "Als verlässliches Urteil über die neue Uhr, denn Hersteller ändern ihre Produkte kaum.",
            "Gar nicht, denn ein Test gilt nur, wenn er nach dem Erscheinen des Produkts erneuert wurde.",
          ],
          answer: 0,
          explanation: "Aktualität ist ein Prüfkriterium. Der Bericht betrifft ein anderes Modell, kann aber Hinweise auf Verarbeitung und Akku geben.",
        },
        {
          question: "Was ist der sinnvollste nächste Schritt?",
          options: [
            "Sofort kaufen, weil die Mehrheit der Bewertungen positiv ist.",
            "Weitere Quellen suchen, etwa aktuelle unabhängige Tests und ausführliche Erfahrungsberichte, und dann vergleichen.",
            "Auf die Uhr verzichten, weil keine Quelle hundertprozentig sicher ist.",
          ],
          answer: 1,
          explanation: "Erst der Vergleich mehrerer unabhängiger Quellen gibt eine tragfähige Grundlage. Vollständige Sicherheit gibt es nie, deshalb ist Verzicht nicht nötig.",
        },
      ],
      verdict:
        "Keine der drei Quellen reicht allein: Die Werbung ist Eigeninteresse, die Sterne sind auffällig, der Test ist veraltet. Tarek entscheidet erst nach weiteren unabhängigen Informationen.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre, welche vier Fragen du an eine Informationsquelle stellst, bevor du ihr bei einem Kauf glaubst, und wende eine davon auf eine Werbeanzeige an.",
        hints: ["Denke an Unabhängigkeit, Aktualität, Methode und Interessen.", "Wer verdient an deinem Kauf?"],
        model:
          "Ich prüfe, ob die Quelle unabhängig ist, ob die Information aktuell ist, ob nach einer klaren Methode geprüft wurde und welche Interessen die Quelle hat. Bei einer Werbeanzeige für einen Rucksack ist die Unabhängigkeit gering: Der Anbieter bezahlt sie, weil er verkaufen möchte. Aussagen wie „der beste Rucksack“ sind nicht belegt. Deshalb nutze ich die Anzeige nur als Hinweis und suche einen unabhängigen Test.",
        criteria: [
          "Nennt die vier Prüffragen Unabhängigkeit, Aktualität, Methode und Interessen",
          "Wendet mindestens eine Frage auf das Beispiel der Werbeanzeige an",
          "Zieht daraus eine Folgerung für das eigene Vorgehen",
        ],
      },
      2: {
        prompt:
          "Ein Shop hat für ein Spiel mehr als 500 Bewertungen, fast alle mit fünf Sternen. Beurteile, wie sicher du dich auf diese Bewertungen verlassen kannst, und beschreibe, was du zusätzlich tust.",
        hints: ["Woran erkennt man gekaufte Bewertungen?", "Welche anderen Quellen gibt es außerhalb des Shops?"],
        model:
          "Viele Bestnoten sind noch kein Beleg, denn Bewertungen lassen sich kaufen oder erfinden. Ich schaue deshalb, ob die Texte konkret sind, ob sie am selben Tag erschienen sind und was in den schlechteren Bewertungen steht. Zusätzlich lese ich einen unabhängigen Test oder fremde Erfahrungsberichte. Wenn mehrere Quellen unabhängig voneinander dasselbe sagen, vertraue ich dem Ergebnis mehr, und erst dann entscheide ich über den Kauf.",
        criteria: [
          "Beurteilt die Verlässlichkeit der Bestnoten begründet",
          "Nennt Merkmale gekaufter oder gefälschter Bewertungen",
          "Beschreibt mindestens einen zusätzlichen Schritt mit anderen Quellen",
        ],
      },
    },
  },
  {
    id: "vs-nachhaltig",
    lb: 3,
    unit: "3",
    title: "Nachhaltig konsumieren und Siegel prüfen",
    intro: "Ein Kauf hat Folgen für Geldbeutel, Umwelt und Menschen. Siegel helfen, wenn man sie richtig liest.",
    paragraphs: [
      "Wer ein T-Shirt für 5 Euro kauft, zahlt wenig, doch der Preis verrät nicht, was bei der Herstellung geschah. Nachhaltiger Konsum fragt deshalb nach drei Seiten jeder Kaufentscheidung. **Ökonomisch**: Was kostet es insgesamt, und hält es lange? **Ökologisch**: Wie stark belastet es Klima, Wasser und Natur, von der Herstellung bis zur Entsorgung? **Sozial**: Unter welchen Bedingungen arbeiten die Menschen, die es herstellen? Nachhaltig konsumiert, wer alle drei Seiten im Blick hat und nicht auf Kosten künftiger Generationen lebt.",
      "Der **Faire Handel** will Erzeugern, etwa Kaffeebauern im Globalen Süden, verlässlichere Bedingungen geben. Das Fairtrade-Siegel steht zum Beispiel für Mindestpreise bei vielen Rohstoffen, eine zusätzliche Prämie für Gemeinschaftsprojekte, das Verbot ausbeuterischer Kinderarbeit und unabhängige Kontrollen. Es bezieht sich auf den gekennzeichneten Rohstoff, nicht auf das ganze Unternehmen. Außerdem ist ein Fairtrade-Produkt nicht automatisch bio, und ein Bio-Produkt nicht automatisch fair gehandelt.",
      "Siegel sollen Orientierung geben, aber jedes bestätigt etwas anderes. Der **Blaue Engel** ist das Umweltzeichen der Bundesregierung; er zeichnet Produkte aus, die nach festen Kriterien in Umwelt- und Gesundheitsfragen besser abschneiden als vergleichbare. Das **EU-Energielabel** ist für viele Geräte Pflicht; seine Klassen von A bis G zeigen die Energieeffizienz im Vergleich zu ähnlichen Geräten, nicht Qualität, Preis oder die ganze Umweltbilanz. Das **Bio-Siegel** steht für kontrollierte Erzeugung nach den EU-Regeln zum ökologischen Landbau, sagt aber nichts über faire Löhne. Prüfe also stets: Was genau wird bestätigt, und wer prüft es?",
      "Nicht jedes grüne Zeichen ist ein Siegel. Beim **Greenwashing** stellt sich ein Unternehmen umweltfreundlicher dar, als es ist: mit Blättern auf der Verpackung, mit selbst erfundenen Logos oder mit vagen Worten wie „natürlich“ und „klimafreundlich“. Misstrauisch machen Zeichen, bei denen unklar bleibt, wer sie vergibt und nach welchen Kriterien. Seit September 2026 verbietet das Wettbewerbsrecht Nachhaltigkeitssiegel, die weder auf einem Zertifizierungssystem beruhen noch staatlich festgelegt sind. Wer ein Siegel prüfen will, liest in Siegelportalen wie Siegelklarheit der Bundesregierung nach, was es verlangt. So wird aus gutem Willen eine begründete Entscheidung.",
    ],
    terms: [
      { term: "Nachhaltiger Konsum", text: "Kaufen mit Blick auf ökonomische, ökologische und soziale Folgen, auch für künftige Generationen." },
      { term: "Fairer Handel", text: "Handel, der Erzeugern bessere Preise und Bedingungen sichern will, zum Beispiel erkennbar am Fairtrade-Siegel." },
      { term: "Siegel", text: "Ein Zeichen auf dem Produkt, das erfüllte Kriterien bestätigt; es hilft nur, wenn eine unabhängige Stelle prüft." },
      { term: "Greenwashing", text: "Der Versuch, ein Produkt oder ein Unternehmen umweltfreundlicher darzustellen, als es tatsächlich ist." },
    ],
    law: [
      {
        ref: "§ 3 Abs. 3 UWG mit Anhang",
        text: "Gegenüber Verbrauchern ist es stets unzulässig, ein Nachhaltigkeitssiegel anzubringen, das weder auf einem Zertifizierungssystem beruht noch von staatlichen Stellen festgesetzt wurde. Auch allgemeine Umweltaussagen ohne Nachweis einer hervorragenden Umweltleistung sind verboten. Das gilt seit dem 27. September 2026.",
        url: "https://www.gesetze-im-internet.de/uwg_2004/",
      },
    ],
    takeaway:
      "Nachhaltig kaufen heißt, Kosten, Umwelt und soziale Bedingungen zusammen zu bedenken und Siegel nur zu glauben, wenn klar ist, was sie bestätigen und wer sie prüft.",
    sourceIds: ["lp", "fair", "vz", "uba", "siegelklarheit"],
    quiz: {
      question: "Was sagt das EU-Energielabel mit den Klassen A bis G über ein Gerät aus?",
      answer: "Wie energieeffizient das Gerät im Vergleich zu ähnlichen Geräten ist.",
      wrong: [
        "Wie gut das Gerät in unabhängigen Qualitätstests abgeschnitten hat.",
        "Wie umweltfreundlich das Gerät von der Herstellung bis zur Entsorgung ist.",
      ],
      explanation:
        "Die Klasse zeigt die Energieeffizienz im Betrieb im Vergleich zu ähnlichen Geräten. Sie ist kein Testergebnis und bewertet weder Preis noch die ganze Umweltbilanz; bei Smartphones stehen auf dem Label zusätzlich Angaben zu Akku und Reparierbarkeit.",
    },
    workshop: {
      kind: "classify",
      title: "Welches Siegel bestätigt das?",
      instruction: "Ordne jede Aussage dem Siegel zu, das sie tatsächlich bestätigt.",
      categories: ["Fairtrade", "Blauer Engel", "EU-Energielabel", "Bio-Siegel"],
      entries: [
        {
          text: "Eine Kaffeebäuerin erhält für ihre Bohnen einen Mindestpreis und eine Prämie für ein Schulprojekt im Dorf.",
          target: 0,
          feedback: "Mindestpreis und Prämie für die Erzeuger gehören zum Fairen Handel.",
        },
        {
          text: "Ein Kühlschrank trägt ein Etikett mit einer Skala von A bis G und einem Pfeil bei der Klasse D.",
          target: 2,
          feedback: "Die Skala von A bis G zeigt die Energieeffizienz des Geräts.",
        },
        {
          text: "Ein Schulheft aus Altpapier erfüllt strenge Vorgaben zu Rohstoffen und Schadstoffen, die eine unabhängige Jury festgelegt hat.",
          target: 1,
          feedback: "Das Umweltzeichen der Bundesregierung vergibt man nach festen Umweltkriterien.",
        },
        {
          text: "Ein Müsli stammt aus kontrolliertem ökologischem Anbau, ohne chemisch-synthetische Pflanzenschutzmittel und ohne Gentechnik.",
          target: 3,
          feedback: "Das beschreibt die Erzeugung nach den EU-Regeln für Bio-Produkte.",
        },
        {
          text: "Bei einer Schokolade stammt der Kakao aus einem Projekt, in dem ausbeuterische Kinderarbeit verboten ist und Mindestpreise gezahlt werden.",
          target: 0,
          feedback: "Soziale Standards und Mindestpreise bestätigt das Fairtrade-Siegel für den Rohstoff.",
        },
        {
          text: "Auf dem Etikett einer Waschmaschine steht die Klasse A, damit wird ihre Energieeffizienz im Vergleich zu anderen Maschinen angezeigt.",
          target: 2,
          feedback: "Das Energielabel zeigt die Energieeffizienz im Vergleich, es ist für diese Geräte Pflicht.",
        },
      ],
      conclusion: "Jedes Siegel bestätigt etwas anderes. Wer es kennt, kann Siegel richtig lesen und vergleichen.",
    },
    casework: {
      title: "Das T-Shirt-Dilemma",
      story:
        "Ida (16) braucht ein neues T-Shirt. Shirt A trägt ein grünes Blatt mit dem Wort „öko-geprüft“; auf der Rückseite steht klein, dass die Firma das Zeichen **selbst entworfen** hat. Shirt B hat das **Fairtrade-Siegel** für die Baumwolle und kostet **6 Euro** mehr. Ida möchte, dass Bauern und Näherinnen fair bezahlt werden und dass das Shirt lange hält.",
      steps: [
        {
          question: "Wie ist das Blatt-Zeichen auf Shirt A einzuordnen?",
          options: [
            "Es ist ein staatliches Siegel, weil es ein grünes Blatt zeigt und das Wort „öko“ enthält.",
            "Es ist ein Bio-Siegel, weil auf dem Etikett „öko-geprüft“ steht.",
            "Es ist ein Eigenlabel der Firma ohne unabhängige Prüfung und kann Greenwashing sein.",
          ],
          answer: 2,
          explanation: "Wer selbst ein Zeichen entwirft, bestätigt nur sich selbst. Eine unabhängige Prüfstelle fehlt, und seit September 2026 sind solche Eigenlabel im Wettbewerbsrecht ausdrücklich verboten.",
        },
        {
          question: "Was sagt das Fairtrade-Siegel auf Shirt B aus?",
          options: [
            "Die gekennzeichnete Baumwolle wurde nach Standards des Fairen Handels erzeugt und gehandelt; über die Näherinnen und die Haltbarkeit sagt es nichts.",
            "Das ganze Unternehmen ist als umweltfreundlich geprüft, weil das Siegel für die gesamte Firma gilt.",
            "Das Shirt ist bio und klimaneutral hergestellt, denn Fairtrade schließt beides ein.",
          ],
          answer: 0,
          explanation: "Das Siegel bezieht sich auf den Rohstoff und seine Bedingungen. Bio, Klimaneutralität, Haltbarkeit und die Bezahlung der Näherinnen bestätigt es nicht.",
        },
        {
          question: "Was gehört zur ökonomischen Seite von Idas Entscheidung?",
          options: [
            "Nur der Preis an der Kasse; wie lange das Shirt hält, spielt für die Kosten keine Rolle.",
            "Der Aufpreis von 6 Euro und die Frage, wie lange das Shirt hält und wie oft sie es ersetzen müsste.",
            "Allein die Frage, welche Marke bekannter ist und mehr Werbung macht.",
          ],
          answer: 1,
          explanation: "Ökonomisch zählen die gesamten Kosten über die Nutzungsdauer, nicht nur der Preis beim Kauf.",
        },
        {
          question: "Wie sollte Ida entscheiden?",
          options: [
            "Auf Siegel ganz verzichten, weil alle Siegel von den Firmen bezahlt werden und deshalb nichts taugen.",
            "Das Shirt mit dem größeren Logo nehmen, weil es zeigt, dass die Firma viel Aufwand betreibt.",
            "Die Siegel prüfen, die Haltbarkeit in Tests oder Bewertungen nachlesen und dann abwägen, welche Kriterien ihr am wichtigsten sind.",
          ],
          answer: 2,
          explanation: "Nachhaltige Entscheidungen verbinden geprüfte Informationen mit eigenen Prioritäten. Nicht jedes Siegel ist wertlos, aber nicht jedes Zeichen ist ein Siegel.",
        },
      ],
      verdict:
        "Shirt A hat nur ein selbst gestaltetes Zeichen, Shirt B einen unabhängig geprüften Nachweis für den fairen Handel der Baumwolle; zu den Näherinnen sagt er nichts. Ida gewichtet Fairness, Haltbarkeit und Preis selbst und entscheidet dann.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre, was mit den drei Aspekten einer nachhaltigen Kaufentscheidung gemeint ist, und zeige sie am Kauf eines Smartphones.",
        hints: ["Nenne den ökonomischen, den ökologischen und den sozialen Aspekt.", "Was kostet das Gerät über die ganze Nutzungsdauer, und wie wird es hergestellt?"],
        model:
          "Der ökonomische Aspekt betrifft die Kosten, bei einem Smartphone auch, wie lange es hält und ob man es reparieren kann. Der ökologische Aspekt fragt nach der Belastung von Umwelt und Klima durch Rohstoffe, Herstellung und Entsorgung. Der soziale Aspekt betrifft die Arbeitsbedingungen, zum Beispiel beim Abbau der Rohstoffe. Nachhaltig kauft, wer alle drei Seiten bedenkt und etwa ein langlebiges, reparierbares Gerät wählt.",
        criteria: [
          "Erklärt den ökonomischen, den ökologischen und den sozialen Aspekt",
          "Überträgt jeden Aspekt auf das Beispiel Smartphone",
          "Zeigt, was eine nachhaltige Entscheidung daraus macht",
        ],
      },
      2: {
        prompt:
          "Eine Firma wirbt für ihre Trinkflasche mit einem selbst gestalteten Logo „Natur pur“. Beurteile, ob das ein verlässliches Siegel ist, und erkläre, wie du das herausfindest.",
        hints: ["Wer vergibt das Zeichen, und wer prüft es?", "Wo kannst du nachlesen, welche Kriterien ein Siegel verlangt?"],
        model:
          "Das Logo ist vermutlich kein verlässliches Siegel, denn eine Firma bestätigt sich damit nur selbst. Ich würde herausfinden, wer das Zeichen vergibt, ob eine unabhängige Stelle prüft und welche Kriterien gelten. Dafür lese ich in einem unabhängigen Siegelportal nach oder suche auf der Verpackung nach bekannten Zeichen. Wenn das Logo keine Prüfstelle nennt und nur vage Worte wie „Natur pur“ benutzt, ist es wahrscheinlich Greenwashing.",
        criteria: [
          "Beurteilt das Logo als Eigenlabel ohne unabhängige Prüfung",
          "Nennt Fragen zur Prüfung, etwa wer vergibt und nach welchen Kriterien",
          "Verwendet den Begriff Greenwashing oder erklärt ihn richtig",
        ],
      },
    },
  },
  {
    id: "vs-schutz",
    lb: 3,
    unit: "3",
    title: "Verbraucherschutz: Regeln und Beratungsstellen",
    intro: "Preise, Widerruf und Streit: Welche Regeln schützen Käufer, und wer hilft im Streitfall?",
    paragraphs: [
      "Wer Preise vergleicht, soll nicht erst rechnen müssen, was am Ende wirklich zu zahlen ist. Deshalb verpflichtet die **Preisangabenverordnung** Unternehmer, gegenüber Verbrauchern den **Gesamtpreis** zu nennen: den Preis, der einschließlich Umsatzsteuer und sonstiger Preisbestandteile zu zahlen ist. Wird Ware nach Gewicht, Volumen, Länge oder Fläche verkauft, kommt der **Grundpreis** dazu, also der Preis je Mengeneinheit, zum Beispiel je Kilogramm oder je Liter. So lässt sich eine große Packung mit einer kleinen vergleichen. Im Onlinehandel muss man zudem erfahren, ob und wie hoch Versandkosten anfallen.",
      "Wer als Verbraucher im Internet, am Telefon oder per Katalog bei einem Unternehmer bestellt, hat ein **Widerrufsrecht**. Es gilt 14 Tage; bei Waren beginnt die Frist, sobald man selbst oder eine benannte Person die Ware erhalten hat, aber nicht vor der Belehrung über das Widerrufsrecht. Man braucht keinen Grund und erklärt den Widerruf dem Unternehmer klar. Ausnahmen gibt es, etwa bei Waren, die nach den eigenen Wünschen angefertigt wurden, oder bei schnell verderblichen Waren. Im Laden gilt dieses Recht nicht von selbst: Ein Umtausch dort ist ein Entgegenkommen des Geschäfts.",
      "Fast jeder Vertrag enthält **Allgemeine Geschäftsbedingungen**, kurz AGB: Vertragsbedingungen, die ein Unternehmen für viele Verträge vorformuliert und der anderen Seite stellt. Sie gelten nur, wenn man bei Vertragsschluss auf sie hingewiesen wird und sie zumutbar lesen kann. Klauseln, die die Kundschaft unangemessen benachteiligen, sind unwirksam, und ungewöhnliche Klauseln, mit denen niemand rechnen muss, werden nicht Vertragsbestandteil. Das Kleingedruckte lohnt sich also, besonders bei Laufzeit, Kündigung und Kosten.",
      "Neben Gesetzen helfen Einrichtungen. Die **Verbraucherzentralen** der Länder beraten zu Verträgen, Abos, Geld und Energie, teils kostenlos, teils gegen eine geringe Gebühr, und warnen öffentlich vor unseriösen Anbietern. Die **Stiftung Warentest** prüft Produkte und Dienstleistungen unabhängig nach festen Kriterien und veröffentlicht die Ergebnisse. Das **Europäische Verbraucherzentrum** hilft, wenn der Streit einen Händler in einem anderen EU-Land betrifft. Welche Stelle passt, hängt also von der Frage ab: beraten, vergleichen oder grenzüberschreitend streiten.",
    ],
    terms: [
      { term: "Gesamtpreis", text: "Der Preis, der einschließlich Umsatzsteuer und sonstiger Preisbestandteile für eine Ware tatsächlich zu zahlen ist." },
      { term: "Grundpreis", text: "Der Preis je Mengeneinheit, zum Beispiel je Kilogramm oder Liter, der Packungen unterschiedlicher Größe vergleichbar macht." },
      { term: "Widerrufsrecht", text: "Das Recht eines Verbrauchers, einen Fernabsatzvertrag mit einem Unternehmer innerhalb von 14 Tagen ohne Begründung zu widerrufen." },
      { term: "Allgemeine Geschäftsbedingungen", text: "Vorformulierte Vertragsbedingungen eines Unternehmens, die nur unter bestimmten Voraussetzungen gelten und fair sein müssen." },
    ],
    law: [
      {
        ref: "§§ 3 und 4 PAngV",
        text: "Unternehmer müssen Verbrauchern den Gesamtpreis nennen. Bei Waren nach Gewicht, Volumen, Länge oder Fläche kommt der Grundpreis hinzu, bei loser Ware reicht der Grundpreis.",
        url: "https://www.gesetze-im-internet.de/pangv_2022/__3.html",
      },
      {
        ref: "§§ 312g, 355 und 356 BGB",
        text: "Bei Fernabsatzverträgen können Verbraucher ihre Erklärung innerhalb von 14 Tagen ohne Begründung widerrufen. Die Frist beginnt bei Waren grundsätzlich mit dem Erhalt, aber nicht vor der ordnungsgemäßen Belehrung über das Widerrufsrecht.",
        url: "https://www.gesetze-im-internet.de/bgb/__312g.html",
      },
    ],
    takeaway:
      "Gesamtpreis, Grundpreis, Widerrufsrecht und faire AGB schützen Käufer; Verbraucherzentrale, Stiftung Warentest und Europäisches Verbraucherzentrum helfen bei unterschiedlichen Fragen.",
    sourceIds: ["lp", "pangv", "vz", "test", "evz", "bgb"],
    quiz: {
      question: "Was gilt, wenn man bei einem Unternehmen online Schuhe bestellt und widerrufen möchte?",
      answer: "Man darf ohne Angabe von Gründen innerhalb von 14 Tagen widerrufen; bei Waren beginnt die Frist mit dem Erhalt.",
      wrong: [
        "Man darf innerhalb von 14 Tagen widerrufen, muss aber einen triftigen Grund wie einen Mangel nennen.",
        "Man darf nur widerrufen, wenn der Händler im Vertrag zugestimmt hat; sonst bleibt der Kauf bindend.",
      ],
      explanation:
        "Das Widerrufsrecht bei Fernabsatzverträgen braucht keine Begründung und keine Zustimmung des Händlers. Die 14 Tage laufen bei Waren ab dem Erhalt.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Stelle hilft?",
      instruction: "Ordne jeden Fall der Einrichtung zu, die am besten weiterhilft.",
      categories: ["Verbraucherzentrale", "Stiftung Warentest", "Europäisches Verbraucherzentrum"],
      entries: [
        {
          text: "Ein Fitnessstudio verweigert die Kündigung und beruft sich auf eine Klausel im Kleingedruckten. Die Familie ist unsicher, ob sie gilt.",
          target: 0,
          feedback: "Fragen zu Verträgen und Klauseln klärt die Beratung der Verbraucherzentrale.",
        },
        {
          text: "Eine Familie möchte wissen, welche von zwölf Waschmaschinen im unabhängigen Vergleich am besten abgeschnitten hat.",
          target: 1,
          feedback: "Unabhängige Produktvergleiche mit festen Kriterien veröffentlicht die Stiftung Warentest.",
        },
        {
          text: "Ein Schüler hat Sportschuhe bei einem Onlinehändler in Spanien bezahlt. Sie wurden nie geliefert, und der Händler antwortet nicht.",
          target: 2,
          feedback: "Ein Händler in einem anderen EU-Land ist der Fall für das Europäische Verbraucherzentrum.",
        },
        {
          text: "Eine Auszubildende will vor dem Kauf einer Matratze wissen, wie die Haltbarkeit verschiedener Modelle im Labortest abgeschnitten hat.",
          target: 1,
          feedback: "Testergebnisse zu Haltbarkeit stammen aus Produkttests, wie die Stiftung Warentest sie macht.",
        },
        {
          text: "Ein Handyvertrag wurde nach der Probezeit plötzlich teurer, und der Anbieter reagiert nicht auf Beschwerden.",
          target: 0,
          feedback: "Zu Preiserhöhungen und Beschwerden berät die Verbraucherzentrale im eigenen Land.",
        },
        {
          text: "Ein Urlauber hat in Italien online ein Zugticket gekauft; nach der Stornierung erstattet der Anbieter mit Sitz in Italien das Geld nicht.",
          target: 2,
          feedback: "Auch hier sitzt der Anbieter in einem anderen EU-Land, deshalb hilft das Europäische Verbraucherzentrum.",
        },
      ],
      conclusion: "Beraten, vergleichen oder grenzüberschreitend streiten: Je nach Frage hilft eine andere Stelle.",
    },
    casework: {
      title: "Kaffee und Kaffeemaschine",
      story:
        "Mara bestellt am **1. März** online für ihren Vater eine Kaffeemaschine. Die Maschine kommt am **3. März** an. Für Bohnen vergleicht sie zwei Packungen: Packung A mit **500 Gramm für 6,50 Euro** und Packung B mit **1 Kilogramm für 12 Euro**. Am 10. März merkt sie, dass der Vater schon eine Maschine hat.",
      steps: [
        {
          question: "Welche Angabe hilft Mara, die beiden Kaffeepackungen sinnvoll zu vergleichen?",
          options: [
            "Der Gesamtpreis, denn er allein macht Packungen unterschiedlicher Größe vergleichbar.",
            "Der Grundpreis, also der Preis je Kilogramm.",
            "Die Herstellerangabe zur Röstung auf der Verpackung.",
          ],
          answer: 1,
          explanation: "Der Grundpreis bezieht beide Packungen auf dieselbe Mengeneinheit.",
        },
        {
          question: "Welche Packung ist günstiger?",
          options: [
            "Packung A, weil der Gesamtpreis mit 6,50 Euro niedriger ist.",
            "Beide kosten gleich viel, denn der Preis steigt mit der Menge.",
            "Packung B mit 12 Euro je Kilogramm, denn A kostet umgerechnet 13 Euro je Kilogramm.",
          ],
          answer: 2,
          explanation: "6,50 Euro für 500 Gramm sind 13 Euro je Kilogramm. Packung B kostet 12 Euro je Kilogramm und ist günstiger.",
        },
        {
          question: "Bis wann kann Mara die Kaffeemaschine widerrufen?",
          options: [
            "Bis zum 17. März, weil die Frist mit dem Erhalt der Ware am 3. März beginnt.",
            "Bis zum 15. März, weil die Frist mit der Bestellung am 1. März beginnt.",
            "Gar nicht, weil sie keinen Mangel nennen kann.",
          ],
          answer: 0,
          explanation: "Die 14 Tage laufen bei Waren ab dem Erhalt, der Tag des Erhalts zählt nicht mit. Einen Grund oder Mangel muss man für den Widerruf nicht nennen.",
        },
        {
          question: "Wohin kann sich Mara wenden, wenn der Händler den Widerruf ablehnt?",
          options: [
            "An die Stiftung Warentest, die ihren Fall vor Gericht vertritt.",
            "An die Verbraucherzentrale, die zur Rechtslage berät und ihr zeigt, wie sie vorgehen kann.",
            "An das Europäische Verbraucherzentrum, weil jeder Onlinekauf grenzüberschreitend ist.",
          ],
          answer: 1,
          explanation: "Die Verbraucherzentrale berät zu Verträgen im eigenen Land. Die Stiftung Warentest testet Produkte, und das Europäische Verbraucherzentrum ist nur bei Händlern im EU-Ausland nötig.",
        },
      ],
      verdict:
        "Der Grundpreis zeigt, dass die große Packung günstiger ist. Die Kaffeemaschine kann Mara bis zum 17. März ohne Begründung widerrufen, wenn sie ihre Erklärung bis dahin absendet. Bei Streit berät sie die Verbraucherzentrale.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre den Unterschied zwischen Gesamtpreis und Grundpreis und sage, wozu der Grundpreis beim Einkaufen nützt.",
        hints: ["Was ist im Gesamtpreis alles enthalten?", "Worauf bezieht sich der Grundpreis?"],
        model:
          "Der Gesamtpreis ist der Betrag, den man tatsächlich zahlt, einschließlich Umsatzsteuer und sonstiger Preisbestandteile. Der Grundpreis bezieht den Preis auf eine Mengeneinheit, zum Beispiel ein Kilogramm oder einen Liter. Er nützt beim Einkaufen, weil man damit Packungen unterschiedlicher Größe vergleichen kann: Eine große Flasche mit höherem Gesamtpreis kann je Liter günstiger sein als eine kleine.",
        criteria: [
          "Erklärt den Gesamtpreis richtig",
          "Erklärt den Grundpreis als Preis je Mengeneinheit",
          "Begründet den Nutzen des Grundpreises mit dem Vergleich unterschiedlicher Packungsgrößen",
        ],
      },
      2: {
        prompt:
          "Entscheide für drei Lagen, an wen du dich wendest, und begründe: (1) Du vergleichst drei Kopfhörer, (2) Ein Abo lässt sich nicht kündigen, (3) Eine Bestellung bei einem Händler im EU-Ausland kommt nicht an.",
        hints: ["Welche Stelle testet, welche berät, welche arbeitet über Grenzen hinweg?", "Was kann jede Stelle nicht leisten?"],
        model:
          "Für den Vergleich der Kopfhörer nutze ich Testergebnisse der Stiftung Warentest, weil sie unabhängig nach festen Kriterien prüft. Bei dem Abo, das sich nicht kündigen lässt, hole ich mir Rat bei der Verbraucherzentrale, die zu Verträgen und Klauseln berät. Wenn die Bestellung bei einem Händler im EU-Ausland nicht ankommt, ist das Europäische Verbraucherzentrum zuständig, weil es bei grenzüberschreitenden Streitfällen hilft. Keine der Stellen ersetzt aber meine eigene Prüfung.",
        criteria: [
          "Ordnet jede der drei Lagen einer passenden Stelle zu",
          "Begründet jede Zuordnung mit der Aufgabe der Stelle",
          "Zeigt, was die Stellen nicht leisten, oder bleibt kritisch",
        ],
      },
    },
  },
  {
    id: "vs-geldanlage",
    lb: 3,
    unit: "3",
    title: "Geldanlage im Vergleich",
    intro: "Wohin mit dem Ersparten? Rendite, Sicherheit und Verfügbarkeit lassen sich nicht alle zugleich maximieren.",
    paragraphs: [
      "Du hast 2.000 Euro gespart und willst sie anlegen. Jede Anlage misst man an drei Zielen: **Rendite** (wie viel Ertrag sie bringt), **Sicherheit** (wie verlässlich das Geld zurückkommt) und **Verfügbarkeit** (wie schnell du an das Geld kommst). Zusammen heißen sie das **magische Dreieck der Geldanlage**. Magisch ist es, weil sich nicht alle drei Ziele zugleich voll erreichen lassen: Wer eine hohe Rendite möchte, nimmt meist weniger Sicherheit oder Verfügbarkeit in Kauf. Eine Anlage ist dann gut, wenn sie zu deinem Ziel und deiner Zeit passt.",
      "Beim **Tagesgeld** kommst du jederzeit an dein Geld, doch die Bank kann den Zinssatz ändern. Beim **Festgeld** wird das Geld für eine feste Zeit zu einem festen Zinssatz gebunden; vorher ist es meist nicht verfügbar. Bei **Wertpapieren** kauft man Anteile oder Forderungen: **Aktien** sind Anteile an Unternehmen mit schwankendem Kurs und möglicher Dividende. **Anleihen** sind Kredite an Staaten oder Unternehmen, die Zinsen bringen und zurückgezahlt werden sollen. **Fonds** bündeln viele Wertpapiere und verteilen so das Risiko. Wertpapiere können mehr Ertrag bringen, aber auch Verluste.",
      "Zinsen sind der Preis für geliehenes Geld. Bleiben sie angelegt und werden mitverzinst, entsteht der **Zinseszins**: Mit angenommenen 3 Prozent wachsen 1.000 Euro nach einem Jahr auf 1.030 Euro und nach zwei Jahren auf 1.060,90 Euro, denn man rechnet Jahr für Jahr mal 1,03. Je länger die Laufzeit, desto stärker wirkt er. Die **Inflation**, also steigende Preise, bremst: Steigen die Preise schneller als dein Guthaben, kannst du später weniger kaufen. Im Modell siehst du das an der Linie „Kaufkraft von heute“.",
      "Was geschieht, wenn eine Bank pleitegeht? Für Tagesgeld, Festgeld und Guthaben auf dem Girokonto gilt in Deutschland die gesetzliche **Einlagensicherung**: Pro Kunde und Bank sind grundsätzlich bis zu 100.000 Euro geschützt. Daneben gibt es freiwillige Sicherungssysteme der Bankengruppen, die oft mehr abdecken, aber nicht auf diesem Gesetz beruhen. Für Aktien, Anleihen und Fonds gibt es keine Absicherung gegen Kursverluste. Die Bankenaufsicht BaFin und die Bundesbank informieren Verbraucher über solche Fragen. Dieser Text gibt keine Anlageempfehlung: Welche Anlage passt, hängt von Ziel, Zeit und Risikobereitschaft ab.",
    ],
    terms: [
      { term: "Magisches Dreieck", text: "Die drei Ziele Rendite, Sicherheit und Verfügbarkeit einer Geldanlage, die sich nicht alle zugleich voll erreichen lassen." },
      { term: "Zinseszins", text: "Zinsen, die selbst wieder verzinst werden, weil man sie angelegt lässt; dadurch wächst das Guthaben immer schneller." },
      { term: "Inflation", text: "Der allgemeine Anstieg der Preise, der dazu führt, dass man mit demselben Geld weniger kaufen kann." },
      { term: "Einlagensicherung", text: "Die gesetzliche Absicherung von Bankguthaben bis 100.000 Euro je Kunde und Bank, falls eine Bank zahlungsunfähig wird." },
    ],
    law: [
      {
        ref: "§ 8 EinSiG",
        text: "Bei Zahlungsunfähigkeit einer Bank ist die Entschädigung grundsätzlich auf 100.000 Euro je Einleger begrenzt. In bestimmten Ausnahmefällen gilt befristet ein höherer Betrag.",
        url: "https://www.gesetze-im-internet.de/einsig/__8.html",
      },
    ],
    takeaway:
      "Jede Geldanlage ist ein Kompromiss aus Rendite, Sicherheit und Verfügbarkeit; der Zinseszins vergrößert das Guthaben mit der Zeit, die Inflation mindert seine Kaufkraft.",
    sourceIds: ["lp", "bafin", "bundesbank"],
    lab: "geldanlage",
    practice: "zinseszins",
    quiz: {
      question: "Was besagt das magische Dreieck der Geldanlage?",
      answer: "Rendite, Sicherheit und Verfügbarkeit lassen sich nie alle zugleich voll erreichen, man muss abwägen.",
      wrong: [
        "Eine gute Anlage erreicht alle drei Ziele zugleich, man muss sie nur lange genug suchen.",
        "Es zählt allein die Rendite, denn Sicherheit und Verfügbarkeit ergeben sich dann von selbst.",
      ],
      explanation:
        "Die drei Ziele stehen im Konflikt: Mehr Ertrag bedeutet meist mehr Risiko oder weniger Zugriff. Deshalb entscheidet das eigene Ziel über die passende Anlage.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Anlage passt zum Ziel?",
      instruction: "Ordne jeden Fall der Anlage zu, die zum genannten Ziel am besten passt.",
      categories: ["Tagesgeld", "Festgeld", "Aktien oder Fonds"],
      entries: [
        {
          text: "Lea spart auf den Führerschein. Das Geld soll jederzeit abrufbar sein und darf keinen Kursschwankungen unterliegen.",
          target: 0,
          feedback: "Abrufbar jederzeit und ohne Kursrisiko ist das Merkmal von Tagesgeld.",
        },
        {
          text: "Samir braucht sein Erspartes drei Jahre lang nicht und möchte dafür einen vorher festgelegten Zinssatz.",
          target: 1,
          feedback: "Feste Laufzeit und fester Zins sind typisch für Festgeld.",
        },
        {
          text: "Hanna denkt an einen Zeitraum von 30 Jahren, kann Schwankungen des Werts aushalten und nimmt für mögliche höhere Erträge ein Verlustrisiko in Kauf.",
          target: 2,
          feedback: "Mehr Ertrag bei längerem Zeitraum bringen Wertpapiere, aber auch Kursrisiko.",
        },
        {
          text: "Ein Guthaben für unvorhergesehene Ausgaben wie eine Reparatur soll jederzeit zur Verfügung stehen, der Zins ist dabei zweitrangig.",
          target: 0,
          feedback: "Hier zählt die Verfügbarkeit, und sie bietet Tagesgeld.",
        },
        {
          text: "Lukas gibt sein Geld für zwei feste Jahre aus der Hand, weil ihm der garantierte Zinssatz wichtiger ist als der Zugriff.",
          target: 1,
          feedback: "Er opfert Verfügbarkeit für einen sicheren Zins, das ist Festgeld.",
        },
        {
          text: "Ein Fonds bündelt viele Aktien und verteilt so das Risiko, dennoch kann der Wert der Anteile sinken.",
          target: 2,
          feedback: "Fonds sind Wertpapiere: Streuung mindert das Risiko, schließt Verluste aber nicht aus.",
        },
      ],
      conclusion: "Die passende Anlage hängt von Ziel und Zeit ab. Eine Anlage für alle Fälle gibt es nicht.",
    },
    casework: {
      title: "Noras Festgeld",
      story:
        "Nora (16) bekommt zum Geburtstag **1.500 Euro**. Mit Zustimmung ihrer Eltern legt sie das Geld als Festgeld bei einer Bank an und bleibt zwei Jahre dabei. Angenommen sind **2 Prozent Zinsen** im Jahr, die jedes Jahr mitverzinst werden, und eine Inflation von ebenfalls **2 Prozent** im Jahr.",
      steps: [
        {
          question: "Wie heißt der Effekt, dass die Zinsen des ersten Jahres im zweiten Jahr selbst Zinsen bringen?",
          options: ["Inflation", "Zinseszins", "Einlagensicherung"],
          answer: 1,
          explanation: "Werden die Zinsen angelegt gelassen und mitverzinst, entsteht der Zinseszins.",
        },
        {
          question: "Wie hoch ist das Guthaben nach zwei Jahren mit Zinseszins?",
          options: ["1.560,00 Euro", "1.530,00 Euro", "1.560,60 Euro"],
          answer: 2,
          explanation: "Nach einem Jahr 1.500 Euro mal 1,02 = 1.530 Euro, nach dem zweiten Jahr 1.530 Euro mal 1,02 = 1.560,60 Euro. Ohne Zinseszins wären es 1.560 Euro.",
        },
        {
          question: "Was bedeutet es für Noras Kaufkraft, wenn die Inflation gleich hoch ist wie der Zinssatz?",
          options: [
            "Das Guthaben wächst auf dem Konto, doch sie kann nach zwei Jahren nicht mehr kaufen als heute.",
            "Die Kaufkraft steigt deutlich, weil das Guthaben auf dem Konto größer wird.",
            "Die Kaufkraft sinkt trotz der Zinsen deutlich, weil die Inflation Zinsen immer vollständig aufzehrt.",
          ],
          answer: 0,
          explanation: "Die Zinsen gleichen die Preissteigerung nur aus. Das Guthaben steigt nominal, die Kaufkraft bleibt ungefähr gleich.",
        },
        {
          question: "Ist Noras Festgeld bei einer Pleite der Bank geschützt?",
          options: [
            "Nein, die Einlagensicherung gilt nur für Wertpapiere.",
            "Ja, Guthaben bis 100.000 Euro je Kunde und Bank sind grundsätzlich gesetzlich abgesichert.",
            "Nur der Zinsbetrag, das eingezahlte Geld nicht.",
          ],
          answer: 1,
          explanation: "Festgeld zählt zu den abgesicherten Einlagen. Wertpapiere sind dagegen nicht vor Kursverlusten geschützt.",
        },
      ],
      verdict:
        "Nora hat nach zwei Jahren 1.560,60 Euro. Der Zinseszins bringt 60 Cent mehr als ausgezahlte Zinsen. Weil Inflation und Zins gleich hoch sind, bleibt ihre Kaufkraft etwa gleich.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre das magische Dreieck der Geldanlage mit eigenen Worten und ordne Tagesgeld und Aktien darin ein.",
        hints: ["Nenne die drei Ziele.", "Welche Anlage ist leicht verfügbar, bei welcher schwankt der Wert?"],
        model:
          "Das magische Dreieck besteht aus Rendite, Sicherheit und Verfügbarkeit. Man kann nicht alle drei zugleich voll erreichen und muss abwägen. Tagesgeld ist jederzeit verfügbar und durch die Einlagensicherung gut geschützt, bringt aber meist wenig Ertrag. Aktien können langfristig mehr Ertrag bringen, aber ihr Kurs schwankt, und man kann Geld verlieren. Welche Anlage passt, hängt davon ab, wofür und wie lange das Geld gebraucht wird.",
        criteria: [
          "Nennt die drei Ziele Rendite, Sicherheit und Verfügbarkeit",
          "Erklärt, dass sie sich nicht alle zugleich voll erreichen lassen",
          "Ordnet Tagesgeld und Aktien mit Begründung im Dreieck ein",
        ],
      },
      2: {
        prompt:
          "Erkläre an einem Beispiel mit 1.000 Euro, angenommenen 1 Prozent Zins und 3 Prozent Inflation, warum das Geld nach zehn Jahren weniger wert sein kann, obwohl auf dem Konto mehr steht.",
        hints: ["Was passiert mit den Preisen in dieser Zeit?", "Vergleiche den Zinssatz mit der Inflationsrate."],
        model:
          "Mit 1 Prozent Zins wächst das Guthaben in zehn Jahren auf etwas über 1.100 Euro. Gleichzeitig steigen die Preise jedes Jahr um 3 Prozent, also viel stärker. Wer damals für 1.000 Euro etwas kaufen konnte, braucht nach zehn Jahren über 1.300 Euro dafür. Das Guthaben ist damit nominal gewachsen, die Kaufkraft aber gesunken. Der Zinssatz liegt unter der Inflation, deshalb verliert das Geld real an Wert.",
        criteria: [
          "Beschreibt das Wachstum des Guthabens durch Zinsen",
          "Erklärt den Kaufkraftverlust durch die höhere Inflation",
          "Folgert, dass der Zinssatz unter der Inflation liegt und daher real ein Verlust entsteht",
        ],
      },
    },
  },
  {
    id: "vs-kredit",
    lb: 3,
    unit: "3",
    title: "Kredite des Alltags im Vergleich",
    intro: "Ratenkredit, Dispo, Ratenkauf und Kreditkarte: Was geliehenes Geld wirklich kostet.",
    paragraphs: [
      "Ein **Kredit** ist geliehenes Geld, das man mit Zinsen zurückzahlt. Im Alltag begegnen dir vier Arten. Der **Ratenkredit** hat eine feste Summe, eine feste Laufzeit und gleiche Monatsraten. Der **Dispokredit** ist eine vereinbarte Überziehung des Girokontos: Man nutzt ihn nach Bedarf und zahlt Zinsen auf den genutzten Betrag. Beim **Ratenkauf** zahlt man eine Ware in Teilbeträgen. Bei vielen Kreditkarten wird gesammelt abgerechnet; zahlt man dann nur einen Teil, läuft für den Rest ein Kredit mit Zinsen.",
      "Was ein Kredit kostet, zeigen mehrere Zahlen. Der **Sollzins** ist der Zinssatz auf das geliehene Geld. Der **effektive Jahreszins** enthält zusätzlich bestimmte Gebühren und eignet sich deshalb für den Vergleich. Die **Laufzeit** wirkt doppelt: Eine lange Laufzeit senkt die Monatsrate, erhöht aber die Gesamtkosten. Gebühren und eine **Restschuldversicherung**, die bei bestimmten Ereignissen wie Krankheit oder Arbeitslosigkeit die Raten übernimmt, verteuern den Kredit; ob sie sich lohnt, sollte man prüfen. Die Kreditkosten sind die Summe aller Raten abzüglich der geliehenen Summe.",
      "Die **0-Prozent-Finanzierung** klingt gratis: Der Sollzins ist null, und die Raten ergeben zusammen den Kaufpreis. Die Falle steckt im Kleingedruckten: Oft entfällt dafür ein Rabatt, den Barzahler bekommen, oder es wird zusätzlich eine Versicherung verkauft. Der Dispo ist praktisch für kurze Engpässe, aber oft deutlich teurer als ein Ratenkredit; eine Überziehung ohne Vereinbarung, die geduldete Überziehung, ist meist noch teurer. Im Modell verstellst du Summe, Laufzeit und Zinssatz. Achte darauf, wie Rate und Gesamtkosten gegenläufig reagieren.",
      "Ein sinnvoller **Kreditvergleich** folgt festen Schritten. Erstens: Brauche ich den Kauf wirklich, oder kann ich sparen? Zweitens: Wie hoch darf die Monatsrate sein, ohne dass der Haushaltsplan wackelt? Drittens: Vergleiche Angebote nach effektivem Jahreszins und Gesamtkosten, nicht nach der Rate. Viertens: Lies Zusatzkosten und Versicherungen. Im Modell und in den Aufgaben rechnest du mit angenommenen Werten: Zinssätze ändern sich ständig, die Rechenwege bleiben gleich. Bei einem Verbraucherdarlehen gibt es in der Regel ein Widerrufsrecht von 14 Tagen.",
    ],
    terms: [
      { term: "Ratenkredit", text: "Ein Kredit mit fester Summe und Laufzeit, der in gleichen Monatsraten zurückgezahlt wird." },
      { term: "Dispokredit", text: "Eine mit der Bank vereinbarte Überziehung des Girokontos, die nach Bedarf genutzt wird und meist hohe Zinsen kostet." },
      { term: "Effektiver Jahreszins", text: "Die Kosten des Kredits als Jahresprozentsatz inklusive bestimmter Gebühren; er eignet sich für den Vergleich von Angeboten." },
      { term: "Restschuldversicherung", text: "Eine Versicherung, die bei Ereignissen wie Krankheit oder Arbeitslosigkeit die Raten übernimmt, aber den Kredit verteuert." },
    ],
    law: [
      {
        ref: "§ 495 BGB",
        text: "Wer einen Verbraucherdarlehensvertrag schließt, kann ihn grundsätzlich widerrufen. Es gelten die allgemeinen 14 Tage für Verbraucherverträge, doch die Frist beginnt nicht vor der Aushändigung der Vertragsurkunde; einzelne Ausnahmen sind im Gesetz genannt.",
        url: "https://www.gesetze-im-internet.de/bgb/__495.html",
      },
    ],
    takeaway:
      "Vergleiche Kredite nach effektivem Jahreszins und Gesamtkosten, nicht nach der Rate: Eine längere Laufzeit macht die Rate kleiner, den Kredit aber teurer.",
    sourceIds: ["lp", "vz", "bgb"],
    lab: "kredit",
    practice: "ratenkredit",
    quiz: {
      question: "Welche Zahl eignet sich am besten, um zwei Kreditangebote zu vergleichen?",
      answer: "Der effektive Jahreszins, weil er auch bestimmte Gebühren als Jahresprozentsatz enthält.",
      wrong: [
        "Die Höhe der Monatsrate, weil sie zeigt, was der Kredit insgesamt kostet.",
        "Der Sollzins allein, weil in ihm alle Gebühren des Kredits schon enthalten sind.",
      ],
      explanation:
        "Die Rate sagt nichts über die Gesamtkosten, und der Sollzins lässt Gebühren weg. Der effektive Jahreszins macht Angebote vergleichbar.",
    },
    workshop: {
      kind: "classify",
      title: "Welcher Kredit ist gemeint?",
      instruction: "Ordne jeden Fall der Kreditart zu, die er beschreibt.",
      categories: ["Ratenkredit", "Dispokredit", "Ratenkauf mit 0 Prozent"],
      entries: [
        {
          text: "Aylins Bank erlaubt ihr, das Girokonto bis zu einer vereinbarten Grenze zu überziehen. Sie zahlt Zinsen nur für die Tage im Minus.",
          target: 1,
          feedback: "Eine vereinbarte Überziehung des Girokontos ist ein Dispokredit.",
        },
        {
          text: "Für einen Laptop vereinbart Jonas mit der Bank eine feste Summe, 24 gleiche Monatsraten und einen Sollzins.",
          target: 0,
          feedback: "Feste Summe, feste Laufzeit und gleiche Raten kennzeichnen den Ratenkredit.",
        },
        {
          text: "Ein Möbelhaus bietet eine Couch in 12 gleichen Monatsraten ohne Zinsen an, aber ohne den Rabatt, den Barzahler erhalten.",
          target: 2,
          feedback: "Ohne Zinsen, aber ohne Rabatt: eine Finanzierung mit 0 Prozent Sollzins hat oft einen Preis.",
        },
        {
          text: "Marie braucht zwei Wochen lang Geld für eine Reparatur, bis ihr Gehalt kommt, und überzieht kurz das Girokonto im vereinbarten Rahmen.",
          target: 1,
          feedback: "Für kurze Engpässe passt der Dispo, solange man ihn schnell ausgleicht.",
        },
        {
          text: "Ein Händler vermittelt Tom einen Kredit über 700 Euro, der in 18 festen Raten mit Sollzins und einer Restschuldversicherung zurückgezahlt wird.",
          target: 0,
          feedback: "Feste Raten, ein Sollzins und Zusatzkosten gehören zum Ratenkredit.",
        },
        {
          text: "Ein Fahrradladen wirbt mit „zinsfrei in 10 Raten“; wer bar zahlt, bekommt dagegen 100 Euro Nachlass.",
          target: 2,
          feedback: "Der entgangene Nachlass sind die versteckten Kosten der 0-Prozent-Finanzierung.",
        },
      ],
      conclusion: "Jede Kreditart hat ihren Zweck und ihren Preis. Wer sie unterscheidet, kann Kosten besser einschätzen.",
    },
    casework: {
      title: "Der Roller für den Arbeitsweg",
      story:
        "Selim (19) hat eine Ausbildung begonnen und braucht für den Arbeitsweg einen gebrauchten Roller für **3.000 Euro**. Die Bank bietet einen Ratenkredit mit **36 Monatsraten**. Der Händler bietet eine „0-Prozent-Finanzierung“ an, doch Barzahler bekommen **250 Euro Rabatt**. Sein Girokonto erlaubt eine Überziehung bis **1.000 Euro**.",
      steps: [
        {
          question: "Welche Angabe braucht Selim, um das Angebot der Bank mit dem des Händlers zu vergleichen?",
          options: [
            "Nur die Höhe der Monatsrate bei beiden Angeboten.",
            "Allein den Sollzins, weil er alles Wichtige enthält.",
            "Den effektiven Jahreszins und die Gesamtkosten beider Angebote.",
          ],
          answer: 2,
          explanation: "Nur der effektive Jahreszins und die Gesamtkosten zeigen, was ein Angebot insgesamt kostet. Die Rate allein täuscht über die Kosten.",
        },
        {
          question: "Was kostet die „0-Prozent-Finanzierung“ des Händlers?",
          options: [
            "0 Euro, denn ein Sollzins von null Prozent bedeutet, dass keinerlei Kosten entstehen.",
            "250 Euro, denn der Rabatt für Barzahler entfällt, obwohl der Sollzins null beträgt.",
            "750 Euro, denn der Rabatt entfällt für jedes der drei Jahre erneut.",
          ],
          answer: 1,
          explanation: "Der entgangene Rabatt ist der Preis der Finanzierung, auch wenn der Sollzins null ist. Eine jährliche Wiederholung steht nicht im Angebot.",
        },
        {
          question: "Warum ist die Überziehung über den Dispo für den ganzen Rollerpreis keine gute Lösung?",
          options: [
            "Weil der Dispo nur für Rechnungen und nicht für Käufe verwendet werden darf.",
            "Weil das Limit von 1.000 Euro nicht reicht und der Dispo oft deutlich teurer ist als ein Ratenkredit.",
            "Weil man den Dispo nur mit Zustimmung des Händlers nutzen kann.",
          ],
          answer: 1,
          explanation: "Das Limit deckt nur einen Teil, und die Zinsen sind meist hoch. Für größere Summen lohnt sich ein günstiger Ratenkredit eher.",
        },
        {
          question: "Was sollte Selim vor der Unterschrift noch prüfen?",
          options: [
            "Ob Zusatzkosten oder eine Restschuldversicherung enthalten sind und ob die Monatsrate dauerhaft in sein Budget passt.",
            "Ob die Bank bekannt ist, denn der Name bestimmt die Kosten.",
            "Nichts, denn mit dem Vergleich der Zinsen ist alles geprüft.",
          ],
          answer: 0,
          explanation: "Zusatzkosten und Versicherungen verteuern den Kredit, und die Rate muss auch bei Einkommensschwankungen tragbar bleiben.",
        },
      ],
      verdict:
        "Selim vergleicht beide Angebote nach Gesamtkosten und effektivem Jahreszins, rechnet den entgangenen Rabatt von 250 Euro ein und lässt den Dispo außen vor. Erst dann entscheidet er.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre, warum ein Kredit mit längerer Laufzeit eine niedrigere Monatsrate, aber höhere Gesamtkosten hat.",
        hints: ["Was passiert mit der Zahl der Raten?", "Wofür zahlt man Zinsen, solange noch Schulden bestehen?"],
        model:
          "Bei einer längeren Laufzeit verteilt sich die Rückzahlung auf mehr Monate, deshalb ist jede Rate kleiner. Solange noch ein Teil des Kredits offen ist, fallen aber Zinsen an. Je länger die Schuld besteht, desto mehr Zinsen kommen zusammen. Die Summe aller Raten, abzüglich der geliehenen Summe, wird also größer. Wer nur auf die Rate schaut, übersieht diese höheren Gesamtkosten.",
        criteria: [
          "Erklärt, warum die Rate bei längerer Laufzeit sinkt",
          "Erklärt, warum die Zinsen und Gesamtkosten steigen",
          "Zieht einen Schluss für den Vergleich von Kreditangeboten",
        ],
      },
      2: {
        prompt:
          "Ein Händler wirbt mit „0 Prozent Finanzierung“ für einen Fernseher. Beurteile, ob das Angebot wirklich gratis ist, und nenne drei Dinge, die du vor dem Kauf prüfst.",
        hints: ["Wo können versteckte Kosten liegen?", "Wie vergleichst du mit dem Barpreis?"],
        model:
          "Das Angebot ist nicht automatisch gratis, auch wenn der Sollzins null ist. Ich prüfe erstens, ob der Preis höher liegt als bei Barzahlung oder ein Rabatt entfällt. Zweitens schaue ich, ob zusätzliche Kosten oder eine Restschuldversicherung enthalten sind. Drittens rechne ich nach, ob die Monatsrate dauerhaft in meinen Haushaltsplan passt. Erst wenn die Gesamtkosten stimmen, entscheide ich mich für die Finanzierung.",
        criteria: [
          "Beurteilt, dass 0 Prozent Sollzins nicht automatisch kostenlos bedeutet",
          "Nennt drei konkrete Prüfpunkte",
          "Begründet, warum diese Punkte die Kosten beeinflussen",
        ],
      },
    },
  },
  {
    id: "vs-ueberschuldung",
    lb: 3,
    unit: "3",
    title: "Überschuldung: Ursachen, Folgen und Auswege",
    intro: "Schulden können jeden treffen. Wie es dazu kommt, was droht und wo es Hilfe gibt.",
    paragraphs: [
      "**Überschuldet** ist, wer über längere Zeit Rechnungen und Raten nicht mehr bezahlen kann, weil das Einkommen nach den Lebenshaltungskosten nicht reicht. Die Gründe sind vielfältig und treffen oft zusammen: **Arbeitslosigkeit** oder weniger Einkommen, **Trennung** oder Scheidung, **Krankheit** oder ein Unfall. Auch **Konsum auf Pump**, also Käufe auf Raten oder mit Kredit ohne Reserve im Haushaltsplan, kann beitragen. Meist ist es keine einzelne Entscheidung, sondern eine Kette von Ereignissen. Betroffene müssen sich deshalb nicht schämen.",
      "Wer eine Zahlung versäumt, bekommt zuerst eine **Mahnung**. Es kommen Mahngebühren und Verzugszinsen dazu, die die Schuld wachsen lassen. Zinsen berechnet man wie bei einem Guthaben: Betrag mal Zinssatz mal Zeit. Bei angenommenen 10 Prozent kosten 500 Euro in einem Jahr 50 Euro; der gesetzliche Verzugszins liegt bei Verbrauchern fünf Prozentpunkte über dem Basiszinssatz. Bleibt die Schuld offen, können Gläubiger nach einem gerichtlichen Verfahren Lohn oder Konto **pfänden** lassen. Unter bestimmten Voraussetzungen folgt ein negativer Eintrag bei der **Schufa**, der später einen Handyvertrag, eine Wohnung oder einen Kredit erschweren kann.",
      "Vorbeugen ist leichter als Aufräumen. Ein **Haushaltsplan** stellt Einnahmen (Taschengeld, Lohn, Ausbildungsvergütung) und Ausgaben gegenüber; was übrig bleibt, kann gespart werden. Eine **Rücklage** für Unerwartetes, etwa eine Reparatur, verhindert, dass dafür gleich ein Kredit nötig wird. Vor jedem Ratenkauf gilt: Passt die Rate dauerhaft in den Plan, auch wenn das Einkommen sinkt? Und wer merkt, dass das Geld knapp wird, sollte nicht warten: Je früher man sich Rat holt, desto mehr Möglichkeiten gibt es.",
      "Hilfe bieten **Schuldnerberatungsstellen**. Bei anerkannten gemeinnützigen oder kommunalen Stellen, zum Beispiel von Wohlfahrtsverbänden, ist die Beratung in der Regel kostenlos; sie verschafft einen Überblick, spricht mit den Gläubigern und erarbeitet einen Plan. Vorsicht bei Firmen, die Schuldenfreiheit gegen hohe Vorauszahlungen versprechen. Hilft nichts anderes, gibt es die **Verbraucherinsolvenz**: ein gerichtliches Verfahren, in dem man den pfändbaren Teil des Einkommens drei Jahre lang nach der Eröffnung des Verfahrens an einen Treuhänder abtritt. Danach kann die **Restschuldbefreiung** folgen; sie erfasst die meisten, aber nicht alle Schulden.",
    ],
    terms: [
      { term: "Überschuldung", text: "Ein Zustand, in dem das Einkommen über längere Zeit nicht reicht, um alle Zahlungspflichten zu erfüllen." },
      { term: "Pfändung", text: "Ein gerichtlich durchgesetzter Zugriff von Gläubigern auf Einkommen, Konto oder Vermögen der Schuldner." },
      { term: "Schuldnerberatung", text: "Eine Beratungsstelle, die Überblick schafft, mit Gläubigern verhandelt und Wege aus den Schulden zeigt; bei gemeinnützigen Trägern meist kostenlos." },
      { term: "Restschuldbefreiung", text: "Die Befreiung von den meisten übrigen Schulden nach dem Insolvenzverfahren, wenn die Voraussetzungen erfüllt sind; Geldstrafen bleiben zum Beispiel bestehen." },
    ],
    law: [
      {
        ref: "§ 287 InsO",
        text: "Wer Restschuldbefreiung beantragt, erklärt, dass er den pfändbaren Teil seines Einkommens für drei Jahre nach der Eröffnung des Insolvenzverfahrens an einen vom Gericht bestimmten Treuhänder abtritt. Wurde auf einen Antrag seit Oktober 2020 schon einmal Restschuldbefreiung erteilt, dauert die Abtretung in einem erneuten Verfahren fünf Jahre.",
        url: "https://www.gesetze-im-internet.de/inso/__287.html",
      },
    ],
    takeaway:
      "Überschuldung hat meist mehrere Ursachen und ist kein persönliches Versagen; wer früh eine Schuldnerberatung nutzt, einen Haushaltsplan führt und Rücklagen bildet, hat die besten Auswege.",
    sourceIds: ["lp", "vz"],
    practice: "zins",
    quiz: {
      question: "Wann ist der beste Zeitpunkt, eine Schuldnerberatung aufzusuchen?",
      answer: "Sobald absehbar ist, dass die Raten nicht mehr zu schaffen sind, damit noch viele Möglichkeiten offenstehen.",
      wrong: [
        "Erst nach der ersten Pfändung, denn vorher kann eine Beratungsstelle für Betroffene nichts tun.",
        "Erst kurz vor einem Gerichtsverfahren, weil die Stellen Fälle früher aus Zeitgründen nicht annehmen.",
      ],
      explanation:
        "Je früher man Hilfe holt, desto besser lassen sich Zahlungspläne verhandeln. Beratungsstellen helfen gerade vor Pfändung und Gerichtsverfahren.",
    },
    workshop: {
      kind: "classify",
      title: "Ursache, Folge oder Vorbeugung?",
      instruction: "Ordne jeden Fall zu: Was löst Zahlungsprobleme aus, was folgt daraus, was beugt vor?",
      categories: ["Ursache", "Folge", "Vorbeugung"],
      entries: [
        {
          text: "Nach einer Trennung muss Karim die Miete plötzlich allein zahlen, sein Einkommen bleibt aber gleich.",
          target: 0,
          feedback: "Ein Ereignis wie eine Trennung kann die Ausgaben stark erhöhen und Zahlungsprobleme auslösen.",
        },
        {
          text: "Ein Gläubiger hat ein Urteil und lässt einen Teil von Marlenes Lohn direkt vom Arbeitgeber einbehalten.",
          target: 1,
          feedback: "Die Lohnpfändung ist eine Folge, wenn Schulden nicht bezahlt werden.",
        },
        {
          text: "Tim notiert jeden Monat alle Einnahmen und Ausgaben und legt einen kleinen Betrag beiseite.",
          target: 2,
          feedback: "Ein Haushaltsplan mit Sparbetrag beugt Zahlungsproblemen vor.",
        },
        {
          text: "Wegen mehrerer unbezahlter Rechnungen wird eine Wohnungsbewerbung von Hana abgelehnt, weil ein negativer Schufa-Eintrag vorliegt.",
          target: 1,
          feedback: "Der negative Eintrag ist eine Folge, die später neue Verträge erschwert.",
        },
        {
          text: "Pia unterschreibt im Elektromarkt einen Ratenkauf, obwohl die Monatsrate schon jetzt kaum in ihr Budget passt.",
          target: 0,
          feedback: "Konsum auf Pump ohne Reserve kann Zahlungsprobleme mit auslösen.",
        },
        {
          text: "Ole bezahlt eine Reparatur aus dem Notgroschen, den er sich über zwei Jahre zurückgelegt hat, statt einen Kredit aufzunehmen.",
          target: 2,
          feedback: "Eine Rücklage verhindert, dass für Unerwartetes ein Kredit nötig wird.",
        },
      ],
      conclusion: "Überschuldung entsteht durch Ereignisse und Entscheidungen, hat spürbare Folgen und lässt sich oft vermeiden oder früh abfangen.",
    },
    casework: {
      title: "Die ungeöffneten Briefe",
      story:
        "Frau Novak verliert ihre Stelle. Das Arbeitslosengeld liegt unter ihrem früheren Gehalt. Sie hat einen Ratenkredit mit **220 Euro** Rate im Monat, dazu Miete und Rechnungen. Nach zwei Monaten kommen die ersten **Mahnungen**. Sie schämt sich und legt die Briefe ungeöffnet in eine Schublade.",
      steps: [
        {
          question: "Welche Ursache steht bei Frau Novak im Vordergrund?",
          options: [
            "Die Arbeitslosigkeit, durch die ihr Einkommen deutlich gesunken ist.",
            "Ein unüberlegter Kauf auf Raten, der von Anfang an nicht zu ihrem Einkommen passte.",
            "Eine Krankheit, die sie dauerhaft arbeitsunfähig gemacht hat.",
          ],
          answer: 0,
          explanation: "Das Einkommen ist weggefallen, die Raten laufen weiter. Eine persönliche Schuld liegt nicht nahe.",
        },
        {
          question: "Was ist das größere Risiko, wenn sie die Briefe weiter nicht öffnet?",
          options: [
            "Dass die Gläubiger die Forderung vergessen und die Schuld nach einigen Wochen erlischt.",
            "Dass Mahngebühren und Verzugszinsen wachsen und Gläubiger gerichtlich vorgehen können.",
            "Dass die Bank ihr das Girokonto sofort kündigen muss.",
          ],
          answer: 1,
          explanation: "Ungeöffnete Mahnungen verschwinden nicht. Die Kosten steigen, und Fristen können ablaufen.",
        },
        {
          question: "Was sollte sie als Nächstes tun?",
          options: [
            "Alle Briefe öffnen, eine Übersicht der Schulden anlegen und eine anerkannte Schuldnerberatung aufsuchen.",
            "Einen neuen Kredit aufnehmen, um die Raten des alten Kredits zu zahlen.",
            "Warten, bis eine Pfändung kommt, weil Beratungen erst danach helfen können.",
          ],
          answer: 0,
          explanation: "Überblick und frühe Beratung eröffnen die meisten Wege. Ein neuer Kredit verschiebt das Problem nur.",
        },
        {
          question: "Eine Firma verspricht ihr „schuldenfrei in 30 Tagen“ gegen eine Vorauszahlung von 800 Euro. Wie ist das einzuschätzen?",
          options: [
            "Als sicherer Weg, weil Firmen schneller sind als Beratungsstellen.",
            "Mit Misstrauen: Solche Angebote kosten viel und halten selten, was sie versprechen; kostenlose Beratung ist vorzuziehen.",
            "Als normale Gebühr, die jede Schuldnerberatung vor Beginn der Arbeit verlangt.",
          ],
          answer: 1,
          explanation: "Hohe Vorauszahlungen und schnelle Versprechen sind Warnzeichen. Gemeinnützige Stellen beraten in der Regel kostenlos.",
        },
      ],
      verdict:
        "Frau Novak ist nicht gescheitert, sondern in eine Lage geraten, die viele treffen kann. Mit geöffneten Briefen und einer anerkannten Beratung findet sie früh einen Weg.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre, welche typischen Ursachen zu Überschuldung führen können und warum Betroffene oft nicht allein schuld sind.",
        hints: ["Denke an Ereignisse im Leben, die das Einkommen verändern.", "Welche Rolle spielen Ratenzahlungen?"],
        model:
          "Typische Ursachen sind Arbeitslosigkeit, Trennung, Krankheit und Konsum auf Pump. Oft treffen mehrere Ereignisse zusammen, etwa ein Jobverlust und laufende Raten. Weil man viele dieser Ereignisse nicht selbst steuern kann, ist Überschuldung meist keine einzelne falsche Entscheidung. Deshalb sollte man Betroffene nicht beschuldigen, sondern Hilfe anbieten und früh Beratung nutzen.",
        criteria: [
          "Nennt mindestens drei typische Ursachen",
          "Erklärt, dass oft mehrere Ereignisse zusammenwirken",
          "Begründet, warum Betroffene nicht allein schuld sind",
        ],
      },
      2: {
        prompt:
          "Eine Freundin möchte ihre Finanzen ordnen, weil sie öfter im Minus ist. Nenne drei Maßnahmen zur Vorbeugung und beurteile, welche du zuerst empfiehlst.",
        hints: ["Denke an Haushaltsplan, Rücklage und Ratenkäufe.", "Was bringt sofort Überblick?"],
        model:
          "Ich würde erstens einen Haushaltsplan mit allen Einnahmen und Ausgaben vorschlagen, zweitens eine kleine Rücklage für Unerwartetes und drittens, vor neuen Ratenkäufen zu prüfen, ob die Rate dauerhaft passt. Zuerst empfehle ich den Haushaltsplan, weil er Überblick schafft und zeigt, wo Geld verloren geht. Erst auf dieser Grundlage kann sie sinnvoll Rücklagen bilden und Käufe planen. Wenn es schon Schulden gibt, würde ich zusätzlich eine Beratung empfehlen.",
        criteria: [
          "Nennt drei sinnvolle Maßnahmen zur Vorbeugung",
          "Beurteilt, welche Maßnahme zuerst kommt",
          "Begründet die Reihenfolge mit dem Nutzen der Maßnahme",
        ],
      },
    },
  },
  {
    id: "vs-zahlung",
    lb: 3,
    unit: "3",
    title: "Zahlungsmöglichkeiten situationsgerecht wählen",
    intro: "Bargeld, Karte, Handy oder Überweisung: Welche Zahlungsart passt zu welcher Situation?",
    paragraphs: [
      "Bezahlt wird heute auf viele Arten. **Bargeld** ist sofort und ohne Technik verfügbar, doch Verlust oder Diebstahl lassen sich kaum ausgleichen. Bei der **Überweisung** schickt man Geld von seinem Konto auf das des Empfängers; sie passt für Rechnungen und größere Beträge. Bei der **Lastschrift** darf der Empfänger den Betrag einziehen, nachdem man es erlaubt hat; praktisch ist sie für regelmäßige Zahlungen wie Beiträge. Mit der **Girocard** wird der Betrag direkt vom Girokonto abgebucht, meist mit PIN. Mit der **Kreditkarte** wird oft erst später abgerechnet.",
      "Neu hinzu kommen **mobiles Bezahlen** und digitale Bezahldienste. Beim mobilen Bezahlen hält man Smartphone oder Smartwatch an das Kassenterminal; die Karte ist in einer App hinterlegt, bestätigt wird oft mit Fingerabdruck, Gesicht oder PIN. **Digitale Bezahldienste** nutzt man vor allem in Onlineshops: Man zahlt über ein Konto beim Anbieter und gibt dem Shop oft keine Kartendaten. Beides ist bequem, doch man gibt Zahlungsdaten an weitere Unternehmen. Prüfe deshalb, was gespeichert wird und wie das Konto geschützt ist.",
      "Eine gute Wahl folgt vier **Kriterien**. **Praktikabilität**: Wird die Zahlungsart akzeptiert, und geht es schnell? **Gebühren**: Verlangt jemand Entgelte, etwa für die Kreditkarte oder das Abheben von Bargeld? **Sicherheit**: Wie gut ist die Zahlung gegen Betrug und Verlust geschützt, und lässt sich eine falsche Abbuchung zurückholen? **Datenschutz**: Wer erfährt, was ich kaufe? Bargeld hinterlässt die wenigsten Datenspuren, digitale Wege hinterlassen mehr.",
      "Moderne Medien bringen Chancen, aber auch Risiken. Beim **Phishing** schicken Betrüger gefälschte Mails, Nachrichten oder Webseiten, um Zugangsdaten, PIN oder TAN zu erschleichen. Banken fordern solche Daten nie per Mail, SMS oder Telefon an. Geht eine Karte verloren, gilt: sofort **sperren lassen**, zum Beispiel über den zentralen Sperr-Notruf 116 116 (für teilnehmende Kartenherausgeber) oder bei der eigenen Bank, die Kontoumsätze prüfen und bei Diebstahl danach die Polizei informieren. Wer rechtzeitig sperrt, haftet für spätere Missbräuche in der Regel nicht mehr.",
    ],
    terms: [
      { term: "Lastschrift", text: "Der Empfänger zieht einen Betrag vom Konto ein, nachdem man ihm das erlaubt hat; bei der SEPA-Basislastschrift lässt er sich acht Wochen lang zurückholen." },
      { term: "Girocard", text: "Eine Bankkarte, mit der man Beträge direkt vom Girokonto abbucht, meist mit PIN oder kontaktlos." },
      { term: "Mobiles Bezahlen", text: "Bezahlen mit Smartphone oder Smartwatch, wobei die Karte in einer App hinterlegt ist." },
      { term: "Phishing", text: "Der Versuch, über gefälschte Nachrichten oder Seiten Zugangsdaten, PIN oder TAN zu erschleichen." },
    ],
    law: [
      {
        ref: "§ 675v BGB",
        text: "Wird eine Karte gestohlen und missbraucht, trägt der Karteninhaber nur einen begrenzten Schaden von höchstens 50 Euro. Bei grober Fahrlässigkeit kann es mehr werden, und nach der Sperranzeige haftet man in der Regel nicht mehr.",
        url: "https://www.gesetze-im-internet.de/bgb/__675v.html",
      },
      {
        ref: "§§ 675x und 676b BGB",
        text: "Bei einer SEPA-Basislastschrift kann man den abgebuchten Betrag innerhalb von acht Wochen nach der Belastung ohne Angabe von Gründen von der Bank zurückfordern. Eine nicht erlaubte Abbuchung kann man noch bis 13 Monate nach der Belastung beanstanden.",
        url: "https://www.gesetze-im-internet.de/bgb/__675x.html",
      },
    ],
    takeaway:
      "Wähle die Zahlungsart nach Situation, Gebühren, Sicherheit und Datenschutz; gib PIN und TAN nie weiter und lass verlorene Karten sofort sperren.",
    sourceIds: ["lp", "bgb", "test", "vz", "sperrnotruf"],
    quiz: {
      question: "Wie verhält man sich richtig, wenn die Girocard verloren geht?",
      answer: "Die Karte sofort sperren lassen und danach die Kontoumsätze auf unbekannte Abbuchungen prüfen.",
      wrong: [
        "Ein paar Tage warten, ob sie wieder auftaucht, und erst dann die Bank informieren.",
        "Zuerst Anzeige bei der Polizei erstatten, denn die Bank sperrt erst nach einer Anzeige.",
      ],
      explanation:
        "Jede Stunde zählt: Bis zur Sperre kann jemand mit der Karte zahlen. Die Sperre geht sofort per Anruf; bei Diebstahl folgt danach die Anzeige bei der Polizei, sie ist aber keine Voraussetzung für die Sperre.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Zahlungsart passt?",
      instruction: "Ordne jede Situation der Zahlungsart zu, die am besten passt.",
      categories: ["Bargeld", "Überweisung", "Lastschrift", "Karte oder Handy"],
      entries: [
        {
          text: "Auf dem Wochenmarkt kauft Omid für 3 Euro Äpfel. Der Stand hat kein Kartenlesegerät.",
          target: 0,
          feedback: "Für kleine Beträge ohne Lesegerät ist Bargeld praktisch.",
        },
        {
          text: "Die Stromrechnung kommt mit einer IBAN, und die Familie möchte den Betrag selbst anweisen, ohne dem Versorger einen Einzug vom Konto zu erlauben.",
          target: 1,
          feedback: "Rechnungen mit Bankverbindung bezahlt man per Überweisung, auch zu einem selbst gewählten Zeitpunkt.",
        },
        {
          text: "Ein Verein zieht den Mitgliedsbeitrag jedes Jahr vom Konto ein, nachdem die Mitglieder dem zugestimmt haben.",
          target: 2,
          feedback: "Regelmäßige Beträge, die der Empfänger einzieht, laufen über die Lastschrift.",
        },
        {
          text: "An der Supermarktkasse hält Nele ihr Smartphone an das Terminal und bestätigt mit dem Fingerabdruck.",
          target: 3,
          feedback: "Das ist mobiles Bezahlen: schnell und kontaktlos, mit hinterlegter Karte.",
        },
        {
          text: "Auf dem Schulflohmarkt verkauft Kim ein Buch für 5 Euro und möchte nicht auf eine Kartenzahlung angewiesen sein.",
          target: 0,
          feedback: "Kleine Beträge zwischen Privatpersonen laufen meist am einfachsten mit Bargeld.",
        },
        {
          text: "Im Café mit Kartenterminal zahlt Anton 4,80 Euro, indem er seine Girocard an das Gerät hält.",
          target: 3,
          feedback: "Die Girocard ist im Laden schnell und braucht kein Bargeld.",
        },
      ],
      conclusion: "Je nach Betrag, Ort und Zeitpunkt passt eine andere Zahlungsart am besten.",
    },
    casework: {
      title: "Die SMS von der Bank",
      story:
        "Mia (16) erhält eine SMS: „Ihr Konto wird in 24 Stunden gesperrt. Bestätigen Sie jetzt Ihre Daten.“ Der Link führt zu einer Seite, die der Bankseite ähnelt, und fragt nach **Kartennummer, PIN und TAN**. Mia ist unsicher und klickt zunächst nicht weiter.",
      steps: [
        {
          question: "Woran erkennt man, dass es sich um einen Phishing-Versuch handeln kann?",
          options: [
            "Die Seite sieht der Bankseite ähnlich, deshalb ist sie sicher echt.",
            "Die Nachricht kommt unaufgefordert, setzt unter Zeitdruck und verlangt über einen Link PIN und TAN.",
            "Die Nachricht ist kurz, deshalb kann sie nicht von einer Bank sein.",
          ],
          answer: 1,
          explanation: "Unaufgeforderte Nachricht, Zeitdruck und die Forderung nach PIN und TAN sind typische Merkmale. Echte Banken fragen so nie nach diesen Daten.",
        },
        {
          question: "Was sollte Mia tun?",
          options: [
            "Die Daten eintragen, weil eine Sperrung sonst teuer wird.",
            "Den Link nicht öffnen, nichts eintragen, bei der Bank über die bekannte Nummer oder App nachfragen und die Nachricht löschen.",
            "Den Link nur einmal öffnen und die Daten erst eintragen, wenn die Seite vertrauenswürdig aussieht.",
          ],
          answer: 1,
          explanation: "Wer nichts eingibt, kann nichts verlieren. Rückfragen bei der Bank gehen über bekannte Wege, nicht über den Link.",
        },
        {
          question: "Mia hat die Daten schon eingegeben. Was ist jetzt am dringendsten?",
          options: [
            "Warten, ob sich etwas ändert, und die Kontoumsätze in einer Woche ansehen.",
            "Die Karte und den Online-Zugang sofort sperren lassen und die Bank informieren.",
            "Nur die PIN ändern, weil TAN und Kartennummer nicht gefährlich sind.",
          ],
          answer: 1,
          explanation: "Eine schnelle Sperre begrenzt den Schaden. Solange Betrüger alle Daten haben, reicht eine neue PIN nicht aus; danach gehört eine Anzeige bei der Polizei dazu.",
        },
        {
          question: "Was hilft Mia, künftig sicherer zu sein?",
          options: [
            "Zugangsdaten nie über Links in Nachrichten eingeben, sondern die Bank-App oder eine selbst eingetippte Adresse nutzen.",
            "Das Konto möglichst selten kontrollieren, damit weniger Daten sichtbar sind.",
            "PIN und TAN im Handy speichern, damit sie nie verloren gehen.",
          ],
          answer: 0,
          explanation: "Wer den Weg zur Bank selbst wählt, kann nicht auf gefälschte Seiten umgeleitet werden. Das Konto regelmäßig zu prüfen, hilft Fehler zu bemerken.",
        },
      ],
      verdict:
        "Die SMS trägt typische Merkmale von Phishing. Mia öffnet nichts, fragt über die bekannte Bank-App nach und gibt PIN und TAN nie weiter.",
    },
    tasks: {
      1: {
        prompt:
          "Vergleiche Bargeld und Kartenzahlung nach den Kriterien Praktikabilität, Gebühren, Sicherheit und Datenschutz.",
        hints: ["Wo entstehen Datenspuren?", "Was passiert bei Verlust oder Diebstahl?"],
        model:
          "Bargeld ist praktisch bei kleinen Beträgen und braucht keine Technik, es verursacht meist keine Gebühren und hinterlässt keine Datenspuren. Es lässt sich aber bei Verlust oder Diebstahl kaum ersetzen. Die Karte ist bei größeren Beträgen und im Netz praktischer. Verlorene Karten kann man sperren, und Abbuchungen lassen sich oft zurückholen. Dafür entstehen Daten über jeden Kauf, und manchmal gibt es Gebühren. Welche Zahlungsart besser ist, hängt von der Situation ab.",
        criteria: [
          "Vergleicht beide Zahlungsarten bei Praktikabilität und Gebühren",
          "Vergleicht Sicherheit und Datenschutz",
          "Zieht ein Fazit, das von der Situation abhängt",
        ],
      },
      2: {
        prompt:
          "Entscheide für drei Fälle, welche Zahlungsart du wählst, und begründe: (1) Du kaufst auf dem Flohmarkt ein Buch, (2) Du bestellst bei einem dir unbekannten Onlineshop, (3) Du zahlst den Jahresbeitrag im Verein.",
        hints: ["Denke an Betrag, Risiko und Rückholmöglichkeit.", "Welche Zahlungsarten bieten Schutz, wenn nichts ankommt?"],
        model:
          "Auf dem Flohmarkt zahle ich bar, denn der Betrag ist klein und es gibt keine Karte. Bei dem unbekannten Onlineshop vermeide ich Vorkasse, denn wenn nichts ankommt, ist das Geld schwer zurückzuholen. Ich wähle Kauf auf Rechnung oder eine Zahlung mit Rückholmöglichkeit oder Käuferschutz. Den Jahresbeitrag lasse ich per Lastschrift einziehen, weil das bequem ist und ich eine erlaubte Abbuchung innerhalb von acht Wochen ohne Begründung zurückholen und eine nicht erlaubte noch länger beanstanden kann.",
        criteria: [
          "Wählt für jeden der drei Fälle eine passende Zahlungsart",
          "Begründet jede Wahl mit Betrag, Risiko oder Bequemlichkeit",
          "Beachtet bei dem unbekannten Shop die Sicherheit oder Rückholmöglichkeit",
        ],
      },
    },
  },
  {
    id: "vs-ecommerce",
    lb: 3,
    unit: "3",
    title: "E-Commerce: Chancen und Gefahren",
    intro: "Einkaufen im Netz ist bequem und oft günstig, doch Fake-Shops und Abofallen warten auf Unvorsichtige.",
    paragraphs: [
      "Mit einer **Preissuchmaschine** vergleichst du in Sekunden, was ein Produkt bei vielen Händlern kostet. Das spart Geld, hat aber Fallen. Achte auf den **Gesamtpreis**: Ein Angebot für 49 Euro mit 8 Euro Versand ist teurer als eines für 52 Euro mit kostenlosem Versand. Beachte außerdem, ob der Händler seriös ist, wie lange die Lieferung dauert und ob die Rangliste durch Werbung beeinflusst sein kann. Nicht jeder Händler ist in jeder Preissuchmaschine gelistet.",
      "Auf **Verkaufsportalen** und **Marktplätzen** bieten viele Verkäufer an. Der Betreiber vermittelt nur, Vertragspartner ist der jeweilige Verkäufer. Wichtig ist, ob ein **gewerblicher** oder ein **privater** Verkäufer anbietet; wer regelmäßig verkauft, gilt oft als gewerblich. Gewerbliche Verkäufer müssen sich an die Verbraucherregeln halten, etwa das Widerrufsrecht. Bei privaten Verkäufern gelten diese Rechte in der Regel nicht. Sie dürfen die Gewährleistung ausschließen, aber keine Mängel arglistig verschweigen. Frage im Zweifel nach und prüfe den Verkäufer: seit wann dabei, welche Bewertungen?",
      "Zu den Zahlungswegen im Netz gehören Kauf auf Rechnung, Lastschrift, Kreditkarte und **Internetzahlungssysteme**, bei denen ein Zahlungsdienst zwischengeschaltet ist. Vorkasse ohne Schutz ist am riskantesten: Wer vorab überweist und nichts erhält, bekommt das Geld schwer zurück. Sicherer sind Wege mit Rückholmöglichkeit oder Käuferschutz. Gefahren sind **Fake-Shops**, die Ware gegen Vorkasse versprechen und nie liefern, **Abofallen**, bei denen ein vermeintlich kostenloser Dienst ein kostenpflichtiges Abo auslöst, und manipulierte Bewertungen.",
      "Schutz beginnt vor dem Kauf. Prüfe das **Impressum**: Name, Anschrift und Kontaktdaten gehören auf die Seite eines Anbieters. Misstraue Angeboten mit sehr niedrigen Preisen, fehlenden Kontaktdaten, nur einer Zahlungsart oder vielen Rechtschreibfehlern. Lies Bewertungen auch außerhalb des Shops. Nutze das **Widerrufsrecht**: Bei Onlinekäufen von Unternehmern hast du in der Regel 14 Tage Zeit. Vor der Bestellung muss der Button deutlich zeigen, dass du zahlst, zum Beispiel „zahlungspflichtig bestellen“. Seit dem 19. Juni 2026 müssen Onlinehändler außerdem eine Widerrufsfunktion bereitstellen, etwa „Vertrag widerrufen“; man kann aber weiterhin formlos widerrufen. Bewahre Bestätigungen auf.",
    ],
    terms: [
      { term: "Preissuchmaschine", text: "Eine Webseite, die Preise vieler Händler für ein Produkt vergleicht; entscheidend ist der Gesamtpreis mit Versand." },
      { term: "Marktplatz", text: "Eine Plattform, auf der viele gewerbliche und private Verkäufer anbieten, während der Betreiber nur vermittelt." },
      { term: "Fake-Shop", text: "Ein gefälschter Onlineshop, der Ware gegen Vorkasse anbietet, aber nicht liefert oder gefälschte Ware schickt." },
      { term: "Abofalle", text: "Ein vermeintlich kostenloses Angebot, bei dem man unbemerkt einen kostenpflichtigen Vertrag abschließt." },
    ],
    law: [
      {
        ref: "§ 312j BGB",
        text: "Wer online etwas bestellt und zahlen muss, muss das mit der Bestellung ausdrücklich bestätigen. Der Button muss deutlich zeigen, dass die Bestellung zahlungspflichtig ist; sonst kommt der Vertrag nicht zustande.",
        url: "https://www.gesetze-im-internet.de/bgb/__312j.html",
      },
      {
        ref: "§ 356a BGB",
        text: "Bei Fernabsatzverträgen, die über eine Webseite oder App geschlossen werden, muss der Unternehmer eine Widerrufsfunktion bereitstellen, beschriftet etwa „Vertrag widerrufen“. Sie muss während der Widerrufsfrist ständig verfügbar sein; danach folgen ein zweiter Schritt „Widerruf bestätigen“ und eine Eingangsbestätigung.",
        url: "https://www.gesetze-im-internet.de/bgb/__356a.html",
      },
    ],
    takeaway:
      "Vergleiche im Netz immer den Gesamtpreis, prüfe Impressum und Verkäufer, meide Vorkasse ohne Schutz und nutze das Widerrufsrecht, wenn ein Unternehmer verkauft.",
    sourceIds: ["lp", "evz", "vz", "bgb"],
    quiz: {
      question: "Ein Onlineshop bietet ein Smartphone 60 Prozent unter dem üblichen Preis an, nur gegen Vorkasse. Wie ist das einzuschätzen?",
      answer: "Das ist ein Warnzeichen für einen Fake-Shop, deshalb prüft man Impressum und Bewertungen außerhalb des Shops.",
      wrong: [
        "Das ist ein Schnäppchen, denn ein Shop mit Schloss-Symbol in der Adresszeile ist immer seriös.",
        "Das ist unbedenklich, denn Fake-Shops gibt es nur bei Angeboten mit unbekannten Marken.",
      ],
      explanation:
        "Sehr niedrige Preise bei nur einer Zahlungsart sind typische Zeichen. Ein Schloss-Symbol zeigt nur eine verschlüsselte Verbindung, nicht die Seriosität des Anbieters.",
    },
    workshop: {
      kind: "classify",
      title: "Seriös oder Falle?",
      instruction: "Ordne jedes Angebot als Fake-Shop, Abofalle oder seriöses Angebot ein.",
      categories: ["Fake-Shop", "Abofalle", "Seriöses Angebot"],
      entries: [
        {
          text: "Ein Shop verkauft Markensneaker für 30 Euro statt 130 Euro, nennt keine Anschrift und akzeptiert nur Vorkasse per Überweisung.",
          target: 0,
          feedback: "Extrem niedriger Preis, fehlende Anschrift und nur Vorkasse sind typische Fake-Shop-Zeichen.",
        },
        {
          text: "Eine Seite bietet „kostenlos“ Hausaufgabenhilfe an. Erst nach der Anmeldung steht klein, dass daraus nach drei Tagen ein Jahresabo für 9 Euro im Monat wird.",
          target: 1,
          feedback: "Das Angebot wirkt kostenlos, doch die Zahlungspflicht steht nur versteckt im Kleingedruckten.",
        },
        {
          text: "Ein Händler nennt Firma, Anschrift und E-Mail im Impressum, bietet Rechnungskauf an und nennt die Versandkosten vor der Bestellung.",
          target: 2,
          feedback: "Vollständige Angaben, sichere Zahlung und klare Kosten sprechen für Seriosität.",
        },
        {
          text: "Ein Gewinnspiel verspricht ein Gratis-Handy. Für die Teilnahme soll man sich registrieren, im Kleingedruckten steht ein kostenpflichtiger Vertrag.",
          target: 1,
          feedback: "Kostenlose Gewinne und versteckte Verträge sind das Muster einer Abofalle.",
        },
        {
          text: "Ein Händler auf einem Marktplatz ist als gewerblicher Verkäufer ausgewiesen, nennt seine Anschrift und weist auf das 14-tägige Widerrufsrecht hin.",
          target: 2,
          feedback: "Gewerblicher Status, Anschrift und Widerrufshinweis sind Zeichen eines regulären Händlers.",
        },
        {
          text: "Ein Shop kopiert Namen und Logo eines bekannten Händlers, hat eine ungewöhnliche Webadresse, nur Vorkasse und Bewertungen, die alle am selben Tag erschienen.",
          target: 0,
          feedback: "Gefälschte Aufmachung, seltsame Adresse und gefälschte Bewertungen sprechen für einen Fake-Shop.",
        },
      ],
      conclusion: "Auf wenige Merkmale kommt es an: Preis, Impressum, Zahlungsart, Kosten und Bewertungen außerhalb des Shops.",
    },
    casework: {
      title: "Die gebrauchte Kamera",
      story:
        "Yara (19) sucht in einer Preissuchmaschine eine Kamera. Angebot A: **329 Euro plus 12 Euro Versand**. Angebot B: **335 Euro mit kostenlosem Versand**. Auf einem Marktplatz bietet eine **Privatperson** dieselbe Kamera für **300 Euro** an, ohne Rücknahme.",
      steps: [
        {
          question: "Welches Händlerangebot ist günstiger, A oder B?",
          options: [
            "A, weil der Warenpreis mit 329 Euro niedriger ist.",
            "B, weil der Gesamtpreis mit 335 Euro unter den 341 Euro von A liegt.",
            "Beide gleich, weil Versandkosten nicht zum Preis zählen.",
          ],
          answer: 1,
          explanation: "A kostet mit Versand 329 plus 12 gleich 341 Euro. B kostet 335 Euro. Der Gesamtpreis entscheidet.",
        },
        {
          question: "Was fällt bei dem Angebot der Privatperson auf?",
          options: [
            "Die üblichen Verbraucherrechte wie das 14-tägige Widerrufsrecht gelten bei privaten Verkäufern in der Regel nicht.",
            "Für private Verkäufer gilt dasselbe Widerrufsrecht wie für Händler.",
            "Private Verkäufer müssen immer ein Impressum haben und die Versandkosten nennen.",
          ],
          answer: 0,
          explanation: "Das Widerrufsrecht im Fernabsatz besteht gegenüber Unternehmern. Auch Impressum und Preisangaben sind Pflichten gewerblicher Anbieter. Bei Privatverkäufen ist man weniger geschützt, deshalb ist Vorsicht nötig.",
        },
        {
          question: "Was sollte Yara vor dem Kauf bei Angebot B prüfen?",
          options: [
            "Nur, ob die Seite eine verschlüsselte Verbindung mit Schloss-Symbol hat.",
            "Das Impressum, Bewertungen außerhalb des Shops und die Zahlungsarten.",
            "Nur die Zahl der Sterne, die der Shop selbst anzeigt.",
          ],
          answer: 1,
          explanation: "Impressum, unabhängige Bewertungen und Zahlungsarten zeigen, ob der Händler seriös ist.",
        },
        {
          question: "Welche Zahlungsart ist bei einem Händler, den Yara nicht kennt, am sichersten?",
          options: [
            "Vorkasse per Überweisung, weil der Händler dann sofort liefert.",
            "Kauf auf Rechnung oder ein Weg mit Rückholmöglichkeit.",
            "Eine Zahlung in Gutscheinkarten, weil der Händler dann nicht an Kontodaten kommt.",
          ],
          answer: 1,
          explanation: "Wer erst nach Erhalt zahlt oder das Geld zurückholen kann, trägt weniger Risiko als bei Vorkasse.",
        },
      ],
      verdict:
        "Angebot B ist mit 335 Euro das günstigste Händlerangebot. Die Privatperson bietet weniger Schutz. Yara prüft Impressum und Bewertungen und zahlt auf Rechnung oder mit Rückholmöglichkeit.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre, warum man in einer Preissuchmaschine den Gesamtpreis vergleichen muss, und nenne zwei weitere Dinge, auf die du achtest.",
        hints: ["Was kommt zum Warenpreis noch dazu?", "Warum kann der erste Eintrag in der Liste trotzdem der teuerste sein?"],
        model:
          "In der Preissuchmaschine steht oft nur der Warenpreis, doch zum Gesamtpreis gehören auch Versandkosten. Ein niedriger Warenpreis kann durch hohe Versandkosten teurer sein als ein scheinbar teureres Angebot mit kostenlosem Versand. Außerdem achte ich darauf, ob der Händler seriös ist, zum Beispiel am Impressum und an Bewertungen. Ich prüfe auch die Lieferzeit, weil ein günstiges Angebot nichts nützt, wenn die Ware erst nach Wochen ankommt.",
        criteria: [
          "Erklärt, dass zum Gesamtpreis auch Versandkosten gehören",
          "Nennt zwei weitere Prüfpunkte",
          "Begründet, warum der niedrigste Warenpreis nicht der günstigste sein muss",
        ],
      },
      2: {
        prompt:
          "Eine Freundin will ein gebrauchtes Fahrrad von einer Privatperson auf einem Marktplatz kaufen. Beurteile Chancen und Risiken und nenne zwei Schutzmaßnahmen.",
        hints: ["Welche Rechte hat sie bei Privatverkäufern?", "Wie kann sie die Zahlung absichern?"],
        model:
          "Der Kauf kann günstig sein, und sie kann das Fahrrad vorher ansehen. Das Risiko liegt darin, dass sie bei einer Privatperson meist kein Widerrufsrecht hat und die Gewährleistung oft ausgeschlossen ist. Als Schutz würde ich raten, das Fahrrad vor dem Kauf anzusehen und auszuprobieren und bar bei der Übergabe zu bezahlen statt vorab zu überweisen. Außerdem sollte sie auf Hinweise achten, ob der Verkäufer echt ist, und sich Name und Anschrift geben lassen.",
        criteria: [
          "Nennt eine Chance und mindestens ein Risiko des Privatkaufs",
          "Benennt zwei sinnvolle Schutzmaßnahmen",
          "Begründet, warum Schutz bei Privatverkäufern wichtig ist",
        ],
      },
    },
  },
  {
    id: "vs-socialmedia",
    lb: 3,
    unit: "3",
    title: "Social Media bewerten: Recht, Geld und Daten",
    intro: "Beiträge, Fotos und Likes: Welche Regeln gelten online, und womit bezahlen wir kostenlose Dienste?",
    paragraphs: [
      "Im Netz gelten dieselben Regeln wie im echten Leben. Das **Recht am eigenen Bild** besagt: Fotos und Videos, auf denen Personen erkennbar sind, dürfen grundsätzlich nur mit deren Einwilligung verbreitet werden, bei Minderjährigen in der Regel auch mit der ihrer Eltern. Das **Urheberrecht** schützt Fotos, Videos, Musik und Texte: Wer etwas Fremdes hochlädt, braucht in der Regel die Erlaubnis der Urheber. Das **Persönlichkeitsrecht** schützt Ehre und Privatsphäre. Beleidigungen sind strafbar, auch im Chat, und werden auf Antrag verfolgt. Wiederholtes Schikanieren online heißt **Cybermobbing**; viele dieser Handlungen, etwa Beleidigung oder Bedrohung, sind Straftaten.",
      "Wer ein Profil anlegt, stimmt den **Nutzungsbedingungen** zu. Sie sind in der Regel Allgemeine Geschäftsbedingungen, also ein Vertrag, den kaum jemand liest. Dort steht zum Beispiel, wofür der Anbieter deine Inhalte nutzen darf und welche Daten er sammelt. Es lohnt sich, wenigstens die wichtigsten Punkte zu kennen: Welche Rechte räume ich dem Anbieter an meinen Fotos ein, und wie kann ich mein Konto wieder löschen?",
      "Soziale Netzwerke kosten oft kein Geld, doch sie sind kein Geschenk. Sie verdienen mit **Werbung**, die anhand deiner Daten, Interessen und Klicks ausgewählt wird. Du bezahlst also mit deinen Daten und deiner Aufmerksamkeit. **Influencer** verdienen an Reichweite: Sie bekommen Geld oder Produkte, wenn sie etwas empfehlen; Werbung muss als Werbung erkennbar sein. **In-App-Käufe** wie Münzen oder Extras bringen den Anbietern Geld und summieren sich schnell, weil man mit virtuellen Münzen den echten Preis leicht aus dem Blick verliert.",
      "Je mehr du von dir zeigst, desto mehr Daten gibt es. **Datensparsamkeit** heißt: nur so viel preisgeben wie nötig. Stelle die **Privatsphäre-Einstellungen** bewusst ein und prüfe, wer deine Beiträge sieht. Eine **Einwilligung** muss freiwillig und informiert sein und lässt sich widerrufen; bei Online-Diensten brauchen unter 16-Jährige dafür grundsätzlich die Zustimmung der Eltern. Nach der Datenschutz-Grundverordnung hast du ein **Auskunftsrecht** (Was ist über mich gespeichert?) und unter bestimmten Voraussetzungen ein Recht auf **Löschung**. Informationen dazu bietet die Bundesbeauftragte für den Datenschutz. Bedenke: Was einmal im Netz ist, lässt sich kaum zurückholen.",
    ],
    terms: [
      { term: "Recht am eigenen Bild", text: "Erkennbare Fotos oder Videos von Personen dürfen grundsätzlich nur mit deren Einwilligung verbreitet werden, bei Minderjährigen in der Regel auch der Eltern." },
      { term: "Urheberrecht", text: "Das Recht der Urheber an ihren Werken wie Fotos, Videos, Musik oder Texten; für die Nutzung braucht man in der Regel ihre Erlaubnis." },
      { term: "Cybermobbing", text: "Das wiederholte Beleidigen, Bloßstellen oder Bedrohen von Personen im Netz, das strafbare Handlungen einschließen kann." },
      { term: "Datensparsamkeit", text: "Der Grundsatz, nur so viele persönliche Daten preiszugeben, wie für den Zweck nötig sind." },
      { term: "Einwilligung", text: "Die freiwillige, informierte Zustimmung zur Verarbeitung von Daten, die man widerrufen kann." },
    ],
    law: [
      {
        ref: "§ 22 KUG",
        text: "Bildnisse von Personen dürfen nur mit Einwilligung der Abgebildeten verbreitet oder öffentlich gezeigt werden. Für einzelne Ausnahmen gibt es besondere Regeln.",
        url: "https://www.gesetze-im-internet.de/kunsturhg/__22.html",
      },
      {
        ref: "Art. 15 und 17 DSGVO",
        text: "Personen können von Anbietern Auskunft darüber verlangen, welche Daten über sie gespeichert sind. Unter bestimmten Voraussetzungen können sie auch die Löschung ihrer Daten verlangen.",
      },
    ],
    takeaway:
      "Auch online gelten Rechte am Bild, am Werk und an der Person; kostenlose Dienste bezahlt man mit Daten und Aufmerksamkeit, deshalb gilt: Daten sparsam preisgeben und Einstellungen prüfen.",
    sourceIds: ["lp", "bfdi", "bgb"],
    quiz: {
      question: "Fenja lädt ein Foto vom Schulausflug hoch, auf dem ihre Mitschülerin Ida gut erkennbar ist. Was braucht sie dafür grundsätzlich?",
      answer: "Idas Einwilligung, bei Minderjährigen auch die ihrer Eltern, selbst wenn Fenja das Foto gemacht hat.",
      wrong: [
        "Keine Einwilligung, weil sie selbst fotografiert hat und deshalb frei über das Bild entscheiden darf.",
        "Keine Einwilligung, solange sie keinen Namen zum Bild schreibt und Ida damit nicht erkennbar benennt.",
      ],
      explanation:
        "Das Urheberrecht liegt bei Fenja, aber das Recht am eigenen Bild schützt Ida. Wer erkennbar ist, muss auch ohne Namen einwilligen; bei Minderjährigen entscheiden in der Regel auch die Eltern mit.",
    },
    workshop: {
      kind: "classify",
      title: "Recht, Geld oder Daten?",
      instruction:
        "Ordne jeden Fall dem Aspekt zu, um den es vor allem geht. Rechtlicher Aspekt: Rechte und Pflichten gegenüber anderen Menschen, etwa Bild, Urheberrecht, Beleidigung. Ökonomischer Aspekt: womit Anbieter verdienen und was Nutzer ausgeben. Umgang mit Daten: die eigenen Daten schützen und kontrollieren, auch durch Auskunft und Löschung.",
      categories: ["Rechtlicher Aspekt", "Ökonomischer Aspekt", "Umgang mit Daten"],
      entries: [
        {
          text: "Ein Video eines Mitschülers wird ohne dessen Wissen hochgeladen und von anderen mit beleidigenden Kommentaren versehen.",
          target: 0,
          feedback: "Recht am eigenen Bild und Beleidigung sind rechtliche Fragen.",
        },
        {
          text: "Ein Spiel verkauft virtuelle Edelsteine für je 2 Euro. Kim gibt an einem Nachmittag 20 Euro aus, ohne es richtig zu merken.",
          target: 1,
          feedback: "In-App-Käufe sind ein Geschäftsmodell, bei dem Geld abfließt.",
        },
        {
          text: "Aiyla fragt bei einem Anbieter nach, welche Daten über sie gespeichert sind, und verlangt die Löschung eines alten Kontos.",
          target: 2,
          feedback: "Auskunft und Löschung gehören zum sensiblen Umgang mit eigenen Daten.",
        },
        {
          text: "Max benutzt für sein Video einen bekannten Song, ohne dass er die Rechte daran hat.",
          target: 0,
          feedback: "Fremde Musik zu nutzen betrifft das Urheberrecht.",
        },
        {
          text: "Ein Netzwerk verdient sein Geld damit, dass Firmen gezielt Werbung für bestimmte Gruppen schalten. Für die Nutzung muss niemand zahlen.",
          target: 1,
          feedback: "Werbung finanziert den Dienst, bezahlt wird mit Daten und Aufmerksamkeit.",
        },
        {
          text: "Lena gibt bei der Anmeldung nur den Vornamen an und stellt ihr Profil so ein, dass nur Freunde ihre Beiträge sehen.",
          target: 2,
          feedback: "Datensparsamkeit und Privatsphäre-Einstellungen schützen persönliche Daten.",
        },
      ],
      conclusion: "Soziale Netzwerke berühren Recht, Geld und Daten zugleich. Wer das weiß, bewertet Angebote bewusster.",
    },
    casework: {
      title: "Das Foto im Klassenchat",
      story:
        "Jan (15) teilt im Klassenchat mit 30 Personen ein Foto, auf dem **Selin** nach einem Sturz mit verschmiertem Gesicht zu sehen ist. Mehrere aus der Klasse schreiben **spöttische und beleidigende Kommentare**. Selin hat dem Foto **nie zugestimmt** und bittet darum, es zu löschen.",
      steps: [
        {
          question: "Welches Recht von Selin ist durch das Foto vor allem betroffen?",
          options: [
            "Das Recht am eigenen Bild, das zu ihrem Persönlichkeitsrecht gehört.",
            "Das Urheberrecht, denn Selin ist auf dem Foto abgebildet.",
            "Das Auskunftsrecht, denn Selin darf wissen, wer das Foto gesehen hat.",
          ],
          answer: 0,
          explanation: "Wer erkennbar abgebildet ist, muss dem Verbreiten zustimmen. Das Urheberrecht liegt bei der Person, die fotografiert hat.",
        },
        {
          question: "Wie sind die spöttischen und beleidigenden Kommentare zu bewerten?",
          options: [
            "Als Scherz, weil im Chat alles erlaubt ist.",
            "Als Ausübung der Meinungsfreiheit, die jede Äußerung schützt.",
            "Als mögliche Beleidigung; wiederholtes Schikanieren im Netz ist Cybermobbing.",
          ],
          answer: 2,
          explanation: "Beleidigungen sind auch im Chat strafbar und werden auf Antrag verfolgt. Die Meinungsfreiheit findet ihre Grenze im Recht der persönlichen Ehre (Art. 5 Abs. 2 GG).",
        },
        {
          question: "Was ist der beste nächste Schritt für Selin?",
          options: [
            "Die Kommentare ignorieren, bis sie von selbst aufhören.",
            "Beweise sichern, zum Beispiel mit Screenshots, eine Vertrauensperson oder die Schule informieren und die Löschung verlangen.",
            "Mit denselben Mitteln zurückschlagen und die Kommentare ihrerseits beleidigen.",
          ],
          answer: 1,
          explanation: "Beweise und Unterstützung helfen, die Löschung durchzusetzen. Zurückschlagen verschärft den Streit und kann selbst strafbar sein.",
        },
        {
          question: "Was sollte Jan jetzt tun?",
          options: [
            "Das Foto löschen und sich bei Selin entschuldigen.",
            "Das Foto behalten, weil er es selbst gemacht hat und damit das Recht daran besitzt.",
            "Das Foto lassen und nur die Kommentare melden, weil das Foto selbst harmlos ist.",
          ],
          answer: 0,
          explanation: "Ohne Einwilligung durfte Jan das Foto nicht verbreiten. Löschen und Entschuldigung begrenzen den Schaden.",
        },
      ],
      verdict:
        "Jan hat Selins Recht am eigenen Bild verletzt, die Kommentare können Beleidigungen und Cybermobbing sein. Selin sichert Beweise und holt Hilfe, Jan löscht das Foto.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre, womit man bei einem kostenlosen sozialen Netzwerk „bezahlt“ und wie sich das Netzwerk finanziert.",
        hints: ["Wer zahlt dem Netzwerk Geld?", "Welche Daten sind für Werbung nützlich?"],
        model:
          "Wer ein soziales Netzwerk nutzt, zahlt kein Geld, liefert aber Daten und Aufmerksamkeit. Das Netzwerk sammelt, was Menschen ansehen, liken und angeben, und zeigt ihnen dazu passende Werbung. Firmen zahlen dem Netzwerk dafür, dass sie ihre Zielgruppe gezielt erreichen. Dazu kommen In-App-Käufe und Einnahmen aus der Zusammenarbeit mit Influencern. Der Dienst ist also nicht umsonst, sondern wird über Daten und Werbung bezahlt.",
        criteria: [
          "Erklärt, dass man mit Daten und Aufmerksamkeit bezahlt",
          "Beschreibt, wie Werbung das Netzwerk finanziert",
          "Nennt eine weitere Einnahmequelle wie In-App-Käufe oder Influencer",
        ],
      },
      2: {
        prompt:
          "Beurteile, welche drei Einstellungen oder Verhaltensweisen du wählst, um deine Daten im Netz zu schützen, und begründe, welche dir am wichtigsten ist.",
        hints: ["Denke an Privatsphäre-Einstellungen und Datensparsamkeit.", "Welche Rechte helfen dir, wenn Daten schon gespeichert sind?"],
        model:
          "Ich würde mein Profil auf privat stellen, damit nur bestätigte Kontakte meine Beiträge sehen, bei der Anmeldung nur nötige Angaben machen und regelmäßig prüfen, welche Daten ein Anbieter über mich speichert. Am wichtigsten finde ich die Datensparsamkeit, denn was ich nicht preisgebe, kann nicht missbraucht werden. Wenn doch etwas gespeichert ist, kann ich Auskunft und unter Umständen Löschung verlangen.",
        criteria: [
          "Nennt drei geeignete Maßnahmen zum Schutz der Daten",
          "Beurteilt, welche Maßnahme am wichtigsten ist",
          "Begründet das Urteil mit dem Schutzzweck",
        ],
      },
    },
  },
];
