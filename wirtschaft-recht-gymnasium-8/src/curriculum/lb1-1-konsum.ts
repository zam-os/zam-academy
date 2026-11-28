import type { Lesson } from "../model/types";
import { check, decide, sort, term, write } from "./lesson-parts";

export const LB1_1: Lesson[] = [
  {
    id: "ko-knappheit",
    lb: 1,
    unit: "1.1",
    title: "Knappheit, Bedürfnisse und das ökonomische Prinzip",
    intro: "Du möchtest viel, aber Geld und Zeit reichen nie für alles. Genau hier beginnt Wirtschaften.",
    paragraphs: [
      "Ein **Bedürfnis** ist das Gefühl eines Mangels, verbunden mit dem Wunsch, ihn zu beseitigen: Hunger, der Wunsch nach neuen Kopfhörern oder nach Anerkennung. Man unterscheidet **Existenzbedürfnisse** wie Essen, Kleidung und Wohnen, ohne die man nicht leben kann, von **Kultur- und Luxusbedürfnissen** wie Kino, Markenkleidung oder Fernreisen. Die Bedürfnisse eines Menschen sind praktisch unbegrenzt: Ist ein Wunsch erfüllt, taucht der nächste auf.",
      "Die Mittel, um Bedürfnisse zu befriedigen, sind dagegen begrenzt. Dein Taschengeld reicht nur für einen Teil deiner Wünsche, und auch deine Zeit ist **knapp**: Ein Nachmittag lässt sich nur einmal verbringen. Diese **Knappheit** zwingt zu Entscheidungen. Wer seine Wünsche mit Geld erfüllen will und kann, äußert einen **Bedarf**, also ein kaufkraftgedecktes Bedürfnis. Kommt er damit auf den Markt, wird daraus Nachfrage.",
      "Damit die knappen Mittel möglichst viel bewirken, handeln Menschen nach dem **ökonomischen Prinzip**, auch Wirtschaftlichkeitsprinzip genannt. Es hat zwei Formen. Beim **Maximalprinzip** ist das Mittel fest vorgegeben und man holt das bestmögliche Ergebnis heraus: Mit 30 Euro Budget kaufst du die beste Sporthose, die du dafür findest. Beim **Minimalprinzip** ist das Ziel fest vorgegeben und man setzt so wenig Mittel wie möglich ein: Du willst genau diese Sporthose und suchst den günstigsten Anbieter.",
      "Wichtig ist, dass immer nur eine Größe festliegt. Die Aussage „mit möglichst wenig Geld möglichst viel kaufen“ klingt klug, ist aber unmöglich: Wer gar kein Geld ausgibt, bekommt nichts. Das ökonomische Prinzip sagt außerdem nichts darüber, ob ein Wunsch sinnvoll ist. Ob du eine Hose überhaupt brauchst, musst du vorher selbst entscheiden.",
    ],
    terms: [
      term("Bedürfnis", "Gefühl eines Mangels, verbunden mit dem Wunsch, ihn zu beseitigen."),
      term("Bedarf", "Bedürfnis, für das jemand genug Geld hat und das er am Markt erfüllen will."),
      term("Knappheit", "Die Mittel wie Geld und Zeit reichen nicht aus, um alle Bedürfnisse zu befriedigen."),
      term("Maximalprinzip", "Mit festen Mitteln ein möglichst großes Ergebnis erreichen."),
      term("Minimalprinzip", "Ein festes Ziel mit möglichst geringem Mitteleinsatz erreichen."),
    ],
    takeaway:
      "Bedürfnisse sind unbegrenzt, Mittel sind knapp. Nach dem ökonomischen Prinzip holst du entweder aus festen Mitteln das Beste heraus (Maximalprinzip) oder erreichst ein festes Ziel mit möglichst wenig Mitteln (Minimalprinzip).",
    sourceIds: ["lp"],
    quiz: check(
      "Ella will genau ein bestimmtes Paar Laufschuhe und vergleicht fünf Onlineshops, um den niedrigsten Preis zu finden. Nach welchem Prinzip handelt sie?",
      "Nach dem Minimalprinzip: Das Ziel steht fest, der Geldeinsatz soll möglichst klein sein.",
      [
        "Nach dem Maximalprinzip: Das Budget steht fest, das Ergebnis soll möglichst groß sein.",
        "Nach keinem Prinzip, denn wer vergleicht, verschwendet nur seine knappe Zeit.",
      ],
      "Das gewünschte Ergebnis, die bestimmten Schuhe, ist vorgegeben. Ella minimiert den Mitteleinsatz. Beim Maximalprinzip wäre der Betrag fest und das Ergebnis offen.",
    ),
    workshop: sort(
      "Maximal oder minimal?",
      "Ordne jede Entscheidung dem Maximal- oder dem Minimalprinzip zu.",
      ["Maximalprinzip", "Minimalprinzip"],
      [
        ["Mit 20 Euro Geburtstagsgeld möchte Nils so viele Comics wie möglich kaufen.", 0, "Das Budget ist fest, das Ergebnis soll möglichst groß sein."],
        ["Anna braucht ein bestimmtes Ladekabel und sucht den günstigsten Laden.", 1, "Das Ziel ist fest, der Geldeinsatz soll klein sein."],
        ["Für die Klassenfahrt sollen 600 Kilometer mit möglichst wenig Fahrtkosten zurückgelegt werden.", 1, "Strecke und Ziel stehen fest, gesucht ist der geringste Aufwand."],
        ["In zwei Stunden Lernzeit will Malik möglichst viele Vokabeln wiederholen.", 0, "Die Zeit ist das feste Mittel, das Ergebnis soll möglichst groß sein."],
        ["Eine Familie will ihr Bad renovieren lassen und holt drei Angebote für genau diese Arbeit ein.", 1, "Die Leistung ist festgelegt, das günstigste Angebot wird gesucht."],
      ],
      "Prüfe immer, was feststeht: das Mittel oder das Ziel.",
    ),
    casework: {
      title: "Ein Samstag, 25 Euro",
      story:
        "**Lina** hat am Samstag **25 Euro** und **einen freien Nachmittag**. Sie möchte ins Kino (12 Euro), eine neue Handyhülle (15 Euro) und mit Freunden Pizza essen (10 Euro). Ihre Schwester sagt: „Kauf einfach möglichst viel mit möglichst wenig Geld.“",
      steps: [
        decide("Was zwingt Lina zu einer Entscheidung?", "Ihre Mittel Geld und Zeit sind knapp: Alle drei Wünsche kosten 37 Euro.", "Ihre Bedürfnisse sind zu klein, um alle zu erfüllen.", "37 Euro übersteigen ihr Budget von 25 Euro, und der Nachmittag reicht nicht für alles. Das ist Knappheit."),
        decide("Was ist am Rat der Schwester falsch?", "Man kann nicht zugleich das Ergebnis maximieren und den Einsatz minimieren.", "Nichts, das ist genau das ökonomische Prinzip.", "Beim ökonomischen Prinzip liegt immer eine Größe fest. Beides gleichzeitig zu optimieren ist unmöglich."),
        decide("Lina legt die 25 Euro fest und sucht die beste Kombination. Welches Prinzip ist das?", "Das Maximalprinzip", "Das Minimalprinzip", "Das Budget steht fest, sie sucht den größten Nutzen daraus."),
      ],
      verdict: "Knappheit zwingt Lina zur Auswahl. Mit dem Maximalprinzip wählt sie aus ihren 25 Euro die Kombination mit dem größten Nutzen, etwa Kino und Pizza.",
    },
    tasks: {
      1: write(
        "Erkläre an einem eigenen Beispiel den Unterschied zwischen Bedürfnis und Bedarf und zeige, warum Knappheit dich zu einer Entscheidung zwingt.",
        ["Was wünschst du dir gerade, und was davon kannst du bezahlen?", "Welche Mittel sind bei dir knapp: Geld, Zeit oder beides?"],
        "Ich habe das Bedürfnis nach einer Spielkonsole und nach einem neuen Fahrrad. Für die Konsole habe ich gespart, für sie habe ich also einen Bedarf. Für das Fahrrad reicht mein Geld nicht, es bleibt ein Bedürfnis. Weil mein Geld knapp ist, muss ich mich entscheiden: Kaufe ich die Konsole, verzichte ich noch länger auf das Fahrrad.",
        ["Unterscheidet Bedürfnis und Bedarf richtig", "Nennt ein knappes Mittel", "Zeigt die Entscheidung, die daraus folgt"],
      ),
      2: write(
        "Ein Werbeslogan lautet: „Bei uns bekommst du maximale Leistung zum minimalen Preis!“ Beurteile den Slogan mithilfe des ökonomischen Prinzips.",
        ["Was müsste beim Maximal- und was beim Minimalprinzip festliegen?", "Was will die Werbung bei dir auslösen?"],
        "Der Slogan verlangt zwei Dinge gleichzeitig: das größte Ergebnis und den kleinsten Einsatz. Nach dem ökonomischen Prinzip liegt aber immer eine Größe fest, entweder das Budget (Maximalprinzip) oder das Ziel (Minimalprinzip). Wer nichts zahlt, bekommt nichts, deshalb ist das Versprechen unmöglich. Es soll nur den Eindruck eines besonders guten Angebots erzeugen. Ich prüfe besser, ob ein konkretes Produkt zu meinem Ziel oder meinem Budget passt.",
        ["Erklärt beide Formen des ökonomischen Prinzips", "Zeigt, warum beides zugleich unmöglich ist", "Beurteilt die Absicht des Slogans"],
      ),
    },
  },

  {
    id: "ko-opportunitaetskosten",
    lb: 1,
    unit: "1.1",
    title: "Opportunitätskosten und Kosten-Nutzen-Analyse",
    intro: "Jede Entscheidung hat einen Preis, den kein Kassenzettel zeigt: das, worauf du verzichtest.",
    paragraphs: [
      "Wer sich für etwas entscheidet, entscheidet sich zugleich gegen etwas anderes. Den Nutzen der besten Alternative, auf die man verzichtet, nennt man **Opportunitätskosten**. Gibt Tom 60 Euro für ein Konzertticket aus, kann er das Geld nicht mehr für die neue Jacke verwenden: Die Jacke sind seine Opportunitätskosten. Auch Zeit hat Opportunitätskosten. Wer am Samstag sechs Stunden zockt, kann in dieser Zeit nicht im Café jobben und 72 Euro verdienen.",
      "Eine **Kosten-Nutzen-Analyse** hilft, solche Entscheidungen bewusst zu treffen. Auf der einen Seite stehen die **Kosten**: der Preis, aber auch Zeit, Folgekosten wie ein Abo oder Strom und die Opportunitätskosten. Auf der anderen Seite steht der **Nutzen**: wie stark und wie lange ein Kauf dein Bedürfnis befriedigt. Lohnend ist eine Entscheidung, wenn der erwartete Nutzen die gesamten Kosten übersteigt.",
      "Was dir nützt, hängt auch von deinen **Anreizen** ab. Anreize sind Umstände, die ein Verhalten belohnen oder bestrafen und dadurch beeinflussen. Ein Rabatt, Treuepunkte, Lob von Freunden oder das Gefühl, dazuzugehören, wirken als Anreiz zum Kauf. Eine Pfandflasche dagegen belohnt das Zurückbringen. Wer seine persönlichen Anreize kennt, merkt eher, wann er etwas kauft, weil andere es haben oder weil ein Angebot gerade lockt, und nicht, weil er es wirklich braucht.",
      "Ein Beispiel: Sara überlegt, ob sie ein Streaming-Abo für 13 Euro im Monat abschließt. Im Jahr kostet es 156 Euro. Dafür könnte sie sich zwei Konzertbesuche leisten. Sie schaut etwa vier Stunden pro Woche. Sie fragt sich: Ist mir das Abo mehr wert als die Konzerte? Erst diese Frage macht die Opportunitätskosten sichtbar, und erst dann ist die Entscheidung überlegt.",
    ],
    terms: [
      term("Opportunitätskosten", "Der entgangene Nutzen der besten Alternative, auf die man durch eine Entscheidung verzichtet."),
      term("Kosten-Nutzen-Analyse", "Gegenüberstellung aller Kosten und des erwarteten Nutzens einer Entscheidung."),
      term("Anreiz", "Umstand, der ein bestimmtes Verhalten belohnt oder bestraft und es dadurch wahrscheinlicher macht."),
    ],
    takeaway:
      "Die wahren Kosten einer Entscheidung umfassen auch den entgangenen Nutzen der besten Alternative. Wer Kosten und Nutzen ehrlich gegenüberstellt und seine Anreize kennt, entscheidet überlegter.",
    sourceIds: ["lp", "vz"],
    quiz: check(
      "Jana könnte am Samstag fünf Stunden babysitten und 60 Euro verdienen. Sie geht stattdessen mit Freunden ins Freibad, Eintritt 5 Euro. Wie hoch sind ihre Opportunitätskosten?",
      "Die 60 Euro, die sie beim Babysitten verdient hätte, also der Nutzen der besten Alternative.",
      ["Nur die 5 Euro Eintritt, denn nur dieses Geld gibt sie wirklich aus.", "Keine, denn ein schöner Tag im Freibad kostet einen nichts."],
      "Opportunitätskosten sind der entgangene Nutzen der besten Alternative. Der Eintritt sind die direkten Kosten; dazu kommt der Lohn, auf den sie verzichtet.",
    ),
    workshop: sort(
      "Kosten, Nutzen oder Anreiz?",
      "Ordne jede Überlegung vor dem Kauf einer Spielkonsole zu.",
      ["Kosten", "Nutzen", "Anreiz"],
      [
        ["Für die Spiele fällt monatlich eine Abo-Gebühr von 9 Euro an.", 0, "Folgekosten gehören zu den Kosten einer Entscheidung."],
        ["Mit dem Geld könnte ich stattdessen den Kletterkurs bezahlen.", 0, "Der Kletterkurs ist die entgangene Alternative, also Opportunitätskosten."],
        ["Ich kann abends online mit meinen Freunden spielen.", 1, "Das beschreibt, wie der Kauf ein Bedürfnis befriedigt."],
        ["Diese Woche gibt es die Konsole mit einem Spiel gratis dazu.", 2, "Die Zugabe lockt zum schnellen Kauf: Sie ist ein Anreiz."],
        ["Alle in meiner Klasse haben schon eine, ich will nicht außen vor sein.", 2, "Gruppenzugehörigkeit ist ein starker persönlicher Anreiz."],
      ],
      "Wer Anreize erkennt, kann prüfen, ob der Nutzen wirklich die Kosten übersteigt.",
    ),
    casework: {
      title: "Ferienjob oder Sprachreise?",
      story:
        "**Deniz** hat in den Sommerferien zwei Möglichkeiten: Er kann **drei Wochen** im Supermarkt jobben und **900 Euro** verdienen oder an einer **Sprachreise** nach England teilnehmen, die seine Eltern bezahlen. Er kann nur eines davon machen.",
      steps: [
        decide("Was sind die Opportunitätskosten der Sprachreise?", "Die 900 Euro Lohn aus dem Ferienjob, auf die er verzichtet.", "Nichts, weil die Eltern die Reise bezahlen.", "Auch wenn andere zahlen, verzichtet Deniz auf den Lohn: Das sind seine Opportunitätskosten."),
        decide("Was gehört auf die Nutzenseite der Sprachreise?", "Bessere Englischkenntnisse und neue Erfahrungen", "Der Lohn aus dem Supermarkt", "Der Nutzen beschreibt, was die Reise ihm bringt. Der Lohn ist der Nutzen der Alternative."),
        decide("Wann ist die Sprachreise für Deniz die bessere Wahl?", "Wenn ihm ihr Nutzen mehr wert ist als die 900 Euro und die Arbeitserfahrung.", "Immer, weil eine Reise teurer ist als ein Job.", "Entscheidend ist der Vergleich von Nutzen und allen Kosten, nicht der Preis allein."),
      ],
      verdict: "Auch eine bezahlte Reise hat Kosten: den entgangenen Lohn. Deniz entscheidet überlegt, wenn er diesen Verzicht ehrlich mit dem Nutzen der Reise vergleicht.",
    },
    tasks: {
      1: write(
        "Beschreibe eine Entscheidung aus deinem Alltag und nenne ihre Opportunitätskosten. Erkläre, warum sie auf keinem Kassenzettel stehen.",
        ["Wofür hast du zuletzt Geld oder Zeit eingesetzt?", "Was hättest du stattdessen tun oder kaufen können?"],
        "Letzte Woche habe ich 40 Euro für ein Videospiel ausgegeben. Mit dem Geld hätte ich auch den Eintritt für ein Fußballspiel mit meinem Vater bezahlen können. Dieses Spiel ist meine beste Alternative und damit meine Opportunitätskosten. Auf dem Kassenzettel steht nur der Preis von 40 Euro, denn der Verzicht auf die Alternative findet nur in meinem Kopf statt.",
        ["Beschreibt eine konkrete Entscheidung", "Nennt die beste Alternative als Opportunitätskosten", "Erklärt, warum diese Kosten unsichtbar bleiben"],
      ),
      2: write(
        "Ein Mobilfunkanbieter lockt Jugendliche mit einem Gratis-Smartphone, wenn sie einen Vertrag über 24 Monate zu 30 Euro im Monat abschließen. Führe eine Kosten-Nutzen-Analyse durch und beurteile das Angebot.",
        ["Rechne aus, was der Vertrag insgesamt kostet.", "Welcher Anreiz soll dich zum Abschluss bewegen?"],
        "Der Vertrag kostet 24 · 30 Euro = 720 Euro. Das Smartphone ist also nicht gratis, sein Preis steckt in der Grundgebühr. Der Nutzen ist ein neues Gerät und eine Flatrate. Als Kosten kommen die lange Bindung und die Opportunitätskosten hinzu: Mit einem günstigeren Tarif und einem gebrauchten Handy bliebe vielleicht Geld für anderes übrig. Das Wort gratis ist ein Anreiz, der die Gesamtkosten verdeckt. Das Angebot lohnt sich nur, wenn ein vergleichbares Gerät mit günstigem Tarif zusammen mehr kosten würde.",
        ["Berechnet die Gesamtkosten", "Erkennt das Gratis-Angebot als Anreiz", "Kommt zu einem begründeten Urteil mit Vergleich"],
      ),
    },
  },

  {
    id: "ko-nachhaltigkeit",
    lb: 1,
    unit: "1.1",
    title: "Nachhaltig konsumieren: drei Dimensionen",
    intro: "Ein T-Shirt für 5 Euro ist billig, aber für wen? Nachhaltigkeit fragt nach allen Folgen eines Kaufs.",
    paragraphs: [
      "Das **Prinzip der Nachhaltigkeit** stammt aus der Forstwirtschaft: Man soll nur so viel Holz schlagen, wie nachwächst. Heute meint es, so zu wirtschaften, dass die Bedürfnisse der heute lebenden Menschen befriedigt werden, ohne die Möglichkeiten künftiger Generationen zu gefährden. Nachhaltigkeit hat drei Dimensionen, die man oft als Säulen darstellt: eine **ökonomische**, eine **ökologische** und eine **soziale**.",
      "Die **ökologische Dimension** fragt nach der Natur: Wie viel Energie, Wasser und Rohstoffe verbraucht ein Produkt, wie viel CO₂ entsteht bei Herstellung und Transport, lässt es sich reparieren oder recyceln? Die **soziale Dimension** fragt nach den Menschen: Bekommen die Näherinnen einen Lohn, von dem sie leben können? Gibt es Kinderarbeit, sind die Arbeitsplätze sicher? Die **ökonomische Dimension** fragt, ob sich etwas auf Dauer rechnet, für Unternehmen ebenso wie für dich: Ein haltbarer Schuh, der dreimal so lange hält, kann auf Dauer günstiger sein als ein billiger.",
      "Die drei Dimensionen geraten oft in Konflikt. Bio-Baumwolle und faire Löhne machen ein Shirt teurer, und nicht jeder kann oder will das bezahlen. Ein günstiger Flug in den Urlaub schont den Geldbeutel, belastet aber das Klima. Nachhaltig zu konsumieren heißt deshalb nicht, immer das teuerste Produkt zu kaufen, sondern die Folgen abzuwägen. Oft ist der nachhaltigste Kauf der, den man gar nicht tätigt, weil man etwas leiht, gebraucht kauft oder repariert.",
      "Beispiel: Für eine Party braucht Mila ein Kleid, das sie wohl nur einmal trägt. Neu kostet es 45 Euro. Sie könnte es auch gebraucht für 15 Euro kaufen oder von ihrer Cousine leihen. Ökologisch ist Leihen am besten, ökonomisch auch. Sozial ist schwer zu beurteilen, weil sie nicht weiß, wie das neue Kleid hergestellt wurde. Ihre Entscheidung wird bewusster, wenn sie alle drei Fragen stellt.",
    ],
    terms: [
      term("Nachhaltigkeit", "Wirtschaften, das heutige Bedürfnisse befriedigt, ohne künftigen Generationen die Lebensgrundlagen zu nehmen."),
      term("Ökologische Dimension", "Folgen für Umwelt und Klima, etwa Rohstoffverbrauch, Emissionen und Abfall."),
      term("Soziale Dimension", "Folgen für Menschen, etwa faire Löhne, sichere Arbeitsplätze und keine Kinderarbeit."),
      term("Ökonomische Dimension", "Ob sich eine Entscheidung auf Dauer wirtschaftlich trägt, für Haushalte und Unternehmen."),
    ],
    takeaway:
      "Nachhaltig konsumieren heißt, die ökonomischen, ökologischen und sozialen Folgen eines Kaufs abzuwägen. Die drei Dimensionen stehen oft in Konflikt; manchmal ist Leihen, Reparieren oder Verzichten die beste Lösung.",
    sourceIds: ["lp", "uba", "vz"],
    quiz: check(
      "Ein Smartphone-Hersteller bietet Ersatzteile und Reparaturanleitungen an, damit Geräte länger halten. Welche Dimension der Nachhaltigkeit spricht das vor allem an?",
      "Die ökologische, weil weniger Rohstoffe verbraucht und weniger Altgeräte entsorgt werden.",
      [
        "Die soziale, weil die Beschäftigten in den Fabriken dadurch einen höheren Lohn bekommen.",
        "Keine, denn Reparaturen schaden dem Unternehmen und haben mit Nachhaltigkeit nichts zu tun.",
      ],
      "Längere Nutzung spart Rohstoffe und Abfall, das ist der Kern der ökologischen Dimension. Löhne in der Fabrik betreffen die soziale Dimension; sie ändern sich durch Reparierbarkeit nicht automatisch.",
    ),
    workshop: sort(
      "Welche Dimension ist gemeint?",
      "Ordne jede Frage vor dem Kauf einer Jeans der passenden Dimension zu.",
      ["Ökonomisch", "Ökologisch", "Sozial"],
      [
        ["Wie viel Wasser wurde für den Anbau der Baumwolle verbraucht?", 1, "Der Wasserverbrauch betrifft die Umwelt."],
        ["Erhalten die Arbeiterinnen in der Näherei einen existenzsichernden Lohn?", 2, "Lohn und Arbeitsbedingungen betreffen die Menschen."],
        ["Hält die teurere Jeans so lange, dass sie mich pro Jahr weniger kostet?", 0, "Die Kosten über die Nutzungsdauer sind eine wirtschaftliche Frage."],
        ["Wurde die Jeans mit gefährlichen Chemikalien gefärbt, die ins Abwasser gelangen?", 1, "Chemikalien im Abwasser schaden der Natur."],
        ["Gibt es in der Lieferkette Kinderarbeit?", 2, "Kinderarbeit ist eine Frage der sozialen Gerechtigkeit."],
      ],
      "Erst alle drei Fragen zusammen zeigen, wie nachhaltig ein Kauf ist.",
    ),
    casework: {
      title: "Das Fünf-Euro-Shirt",
      story:
        "Ein Modegeschäft verkauft T-Shirts für **5 Euro**. Ein anderes bietet ein **fair gehandeltes Bio-Shirt** für **25 Euro** an. **Paul** hat 30 Euro und braucht zwei Shirts für den Sportunterricht.",
      steps: [
        decide("Welche Dimension spricht für das 5-Euro-Shirt?", "Die ökonomische: Paul kann mit seinem Geld beide Shirts kaufen.", "Die soziale: Bei so niedrigen Preisen sind die Löhne sicher fair.", "Der niedrige Preis schont sein Budget. Über faire Löhne sagt er nichts, eher im Gegenteil."),
        decide("Welche Frage sollte Paul zum Bio-Shirt stellen?", "Ob ein Siegel die Herstellungsbedingungen unabhängig prüft.", "Ob es teurer ist als das andere Shirt.", "Ein glaubwürdiges Siegel zeigt, ob ökologische und soziale Versprechen kontrolliert werden."),
        decide("Was wäre ein Kompromiss, der alle drei Dimensionen beachtet?", "Ein faires Shirt kaufen und ein zweites gebraucht oder geliehen besorgen.", "Zehn billige Shirts kaufen, damit er nie wieder einkaufen muss.", "So bleibt Paul im Budget, und er senkt Rohstoffverbrauch und Risiken für die Beschäftigten."),
      ],
      verdict: "Der Preis allein sagt nicht, wie nachhaltig ein Kauf ist. Paul wägt Budget, Umwelt und Arbeitsbedingungen ab und findet einen Kompromiss.",
    },
    tasks: {
      1: write(
        "Wähle ein Produkt, das du oft kaufst, und stelle zu jeder der drei Dimensionen der Nachhaltigkeit eine Frage, die du dir vor dem Kauf stellen könntest.",
        ["Denke an Herstellung, Transport, Nutzung und Entsorgung.", "Wer ist alles an der Herstellung beteiligt?"],
        "Ich kaufe oft Turnschuhe. Ökonomisch frage ich: Wie lange halten sie, und was kosten sie mich pro Jahr? Ökologisch frage ich: Aus welchem Material sind sie, wie weit wurden sie transportiert, und kann man sie reparieren oder recyceln? Sozial frage ich: Unter welchen Bedingungen und zu welchem Lohn arbeiten die Menschen in der Schuhfabrik? Wenn ich alle drei Fragen stelle, sehe ich mehr als nur den Preis.",
        ["Nennt ein konkretes Produkt", "Stellt zu jeder Dimension eine passende Frage", "Zeigt, was die Fragen zusätzlich zum Preis sichtbar machen"],
      ),
      2: write(
        "„Nachhaltig einkaufen können sich nur Reiche leisten.“ Nimm Stellung zu dieser Aussage und beziehe die drei Dimensionen der Nachhaltigkeit ein.",
        ["Welche nachhaltigen Möglichkeiten kosten wenig oder nichts?", "Ist ein billiges Produkt auf Dauer wirklich billig?"],
        "Die Aussage stimmt nur zum Teil. Fair und ökologisch hergestellte Produkte sind oft teurer, und Menschen mit wenig Geld können sie sich seltener leisten; das ist ein echter Konflikt zwischen ökonomischer und sozialer oder ökologischer Dimension. Nachhaltig handeln heißt aber nicht nur teuer kaufen. Gebraucht kaufen, leihen, reparieren und auf unnötige Käufe verzichten spart Geld und Rohstoffe zugleich. Außerdem sind haltbare Produkte über ihre Nutzungsdauer oft günstiger. Mein Urteil: Geld erleichtert nachhaltigen Konsum, ist aber keine Voraussetzung dafür.",
        ["Bezieht klar Stellung", "Nennt den Zielkonflikt zwischen den Dimensionen", "Zeigt günstige nachhaltige Alternativen auf"],
      ),
    },
  },

  {
    id: "ko-information",
    lb: 1,
    unit: "1.1",
    title: "Testberichte, Vergleichsportale und Labels",
    intro: "Vor dem Kauf kannst du dich informieren. Doch nicht jede Information ist neutral.",
    paragraphs: [
      "Verbraucherinnen und Verbraucher wissen über ein Produkt meist weniger als der Hersteller. Diese Lücke können verschiedene **Informationsquellen** verkleinern. **Testberichte** unabhängiger Einrichtungen wie der Stiftung Warentest prüfen Produkte im Labor nach festgelegten Kriterien und veröffentlichen die Methode. Die **Verbraucherzentralen** beraten und warnen vor unseriösen Angeboten. Daneben gibt es **Erfahrungsberichte** anderer Kunden, Videos und Beratung im Laden.",
      "**Vergleichsportale** im Internet stellen Preise und Merkmale vieler Anbieter nebeneinander, etwa für Handytarife, Flüge oder Elektronik. Sie sparen Zeit und machen Preisunterschiede sichtbar. Doch viele Portale verdienen an **Provisionen**: Schließt du über sie einen Vertrag ab, zahlt ihnen der Anbieter Geld. Nicht jedes Portal zeigt alle Anbieter, und die Reihenfolge der Treffer kann bezahlt sein. Prüfe deshalb, wer hinter einem Portal steht, und vergleiche mehrere Quellen.",
      "**Öko- und Soziallabels** sollen auf einen Blick zeigen, ob ein Produkt umweltfreundlich oder unter fairen Bedingungen hergestellt wurde. Staatliche Zeichen wie das EU-Bio-Siegel oder der Blaue Engel beruhen auf festgelegten Kriterien und Kontrollen. Daneben gibt es viele Labels, die Unternehmen selbst erfunden haben und die niemand unabhängig überprüft. Ein glaubwürdiges Label nennt seine Kriterien öffentlich, wird von einer unabhängigen Stelle vergeben und regelmäßig kontrolliert. Das Portal Siegelklarheit der Bundesregierung bewertet viele Siegel nach solchen Maßstäben.",
      "Auch **Kundenbewertungen** sind mit Vorsicht zu lesen. Es gibt gekaufte oder gefälschte Bewertungen, und auffällig viele Fünf-Sterne-Urteile mit ähnlichem Wortlaut sind ein Warnzeichen. Hilfreich sind Bewertungen, die konkret beschreiben, was gut oder schlecht war. Am verlässlichsten wird dein Urteil, wenn du mehrere unabhängige Quellen kombinierst.",
    ],
    terms: [
      term("Testbericht", "Ergebnis einer Produktprüfung nach offengelegten Kriterien, etwa durch die Stiftung Warentest."),
      term("Vergleichsportal", "Internetseite, die Angebote vieler Anbieter vergleicht und sich oft über Provisionen finanziert."),
      term("Label", "Zeichen auf einem Produkt, das bestimmte ökologische oder soziale Eigenschaften verspricht."),
    ],
    takeaway:
      "Unabhängige Testberichte, Vergleichsportale und glaubwürdige Labels helfen bei der Kaufentscheidung. Prüfe immer, wer hinter einer Information steht, wie sie entstanden ist und ob jemand daran verdient.",
    sourceIds: ["lp", "test", "vz", "siegelklarheit"],
    quiz: check(
      "Woran erkennst du am ehesten, dass ein Siegel glaubwürdig ist?",
      "Seine Kriterien sind öffentlich, und eine unabhängige Stelle kontrolliert sie regelmäßig.",
      ["Es ist groß, grün und steht gut sichtbar vorne auf der Verpackung.", "Der Hersteller hat es selbst entworfen, weil er sein Produkt am besten kennt."],
      "Ein Siegel ist nur so gut wie seine Kriterien und deren Kontrolle. Farbe und Größe sagen nichts, und ein selbst vergebenes Zeichen prüft niemand von außen.",
    ),
    workshop: sort(
      "Wie verlässlich ist die Quelle?",
      "Ordne jede Information ein: eher verlässlich oder mit Vorsicht zu genießen.",
      ["Eher verlässlich", "Mit Vorsicht genießen"],
      [
        ["Ein Warentest, der seine Prüfmethode offenlegt und keine Werbung annimmt.", 0, "Unabhängigkeit und offene Methode machen Tests verlässlich."],
        ["Ein Vergleichsportal, das bei jedem Abschluss eine Provision vom Anbieter bekommt.", 1, "Wer an Abschlüssen verdient, ist nicht ganz neutral."],
        ["Ein Siegel, das der Hersteller selbst erfunden hat und das niemand kontrolliert.", 1, "Ohne unabhängige Kontrolle ist das Versprechen nicht überprüfbar."],
        ["Das EU-Bio-Siegel mit gesetzlich festgelegten Kriterien und Kontrollen.", 0, "Staatlich festgelegte und kontrollierte Kriterien sind verlässlich."],
        ["Fünfzig Fünf-Sterne-Bewertungen, alle am selben Tag und fast gleich formuliert.", 1, "Gleichzeitige, ähnliche Bewertungen deuten auf Fälschung hin."],
      ],
      "Frage bei jeder Information: Wer steht dahinter, und wer verdient daran?",
    ),
    casework: {
      title: "Die beste Powerbank",
      story:
        "**Emre** sucht eine Powerbank. Ein **Vergleichsportal** zeigt ganz oben das Modell X mit dem Hinweis „Unser Tipp“. Ein **Testbericht** einer Verbraucherzeitschrift nennt ein anderes Modell Testsieger. In einem Onlineshop hat Modell X **800 Fünf-Sterne-Bewertungen**.",
      steps: [
        decide("Warum könnte Modell X im Portal ganz oben stehen?", "Weil der Anbieter für die Platzierung oder für Abschlüsse bezahlt.", "Weil Portale immer das objektiv beste Produkt zuerst zeigen.", "Viele Portale finanzieren sich über Provisionen oder bezahlte Platzierungen."),
        decide("Welche Quelle ist hier am unabhängigsten?", "Der Testbericht mit offengelegter Prüfmethode", "Die vielen Sternebewertungen im Shop", "Ein unabhängiger Test nach festen Kriterien ist kaum käuflich; Sterne können gefälscht sein."),
        decide("Was sollte Emre tun, bevor er kauft?", "Mehrere Quellen vergleichen und die Prüfkriterien lesen.", "Das Produkt mit den meisten Sternen kaufen.", "Erst der Vergleich mehrerer unabhängiger Quellen ergibt ein belastbares Urteil."),
      ],
      verdict: "Emre vertraut nicht der erstbesten Quelle. Er prüft, wer hinter den Informationen steht, und stützt sich vor allem auf den unabhängigen Test.",
    },
    tasks: {
      1: write(
        "Nenne drei Informationsquellen, die du vor dem Kauf eines Handys nutzen könntest, und erkläre jeweils einen Vorteil und eine Schwäche.",
        ["Denke an Tests, Portale, Bewertungen und Beratung.", "Wer verdient an welcher Quelle?"],
        "Erstens ein Testbericht der Stiftung Warentest: Er prüft unabhängig nach festen Kriterien, ist aber manchmal schon einige Monate alt. Zweitens ein Vergleichsportal: Es zeigt schnell viele Preise, verdient aber oft an Provisionen und zeigt vielleicht nicht alle Anbieter. Drittens Kundenbewertungen: Sie berichten aus dem Alltag, können aber gefälscht sein. Am besten kombiniere ich alle drei.",
        ["Nennt drei verschiedene Quellen", "Gibt je einen Vorteil und eine Schwäche an", "Zieht einen Schluss für die Nutzung"],
      ),
      2: write(
        "Ein Schokoladenhersteller druckt ein selbst entworfenes Zeichen „Fair für Kakaobauern“ auf seine Tafeln. Beurteile, ob du dem Zeichen vertrauen kannst, und begründe anhand von Kriterien für glaubwürdige Labels.",
        ["Wer hat das Zeichen erfunden, und wer kontrolliert es?", "Wo könntest du nachprüfen, was dahintersteckt?"],
        "Ich kann dem Zeichen nicht ohne Weiteres vertrauen. Ein glaubwürdiges Label hat öffentliche Kriterien, wird von einer unabhängigen Stelle vergeben und regelmäßig kontrolliert. Hier hat der Hersteller das Zeichen selbst entworfen, und es ist nicht bekannt, was fair genau bedeutet und wer das prüft. Das Versprechen kann stimmen, ist aber nicht überprüfbar. Ich würde auf der Seite Siegelklarheit oder beim Hersteller nach den Kriterien suchen oder eine Schokolade mit einem unabhängig kontrollierten Siegel wählen.",
        ["Nennt Kriterien glaubwürdiger Labels", "Wendet sie auf das Herstellerzeichen an", "Zeigt einen Weg zur Überprüfung oder Alternative"],
      ),
    },
  },

  {
    id: "ko-entscheidungsmatrix",
    lb: 1,
    unit: "1.1",
    title: "Mit der Entscheidungsmatrix wählen",
    intro: "Drei Angebote, vier Kriterien, kein klarer Sieger? Eine Entscheidungsmatrix ordnet deine Gedanken.",
    paragraphs: [
      "Bei wichtigen Käufen spielen mehrere Kriterien eine Rolle: Preis, Qualität, Nachhaltigkeit, Design. Die **Entscheidungsmatrix**, auch Nutzwertanalyse genannt, macht eine solche Entscheidung nachvollziehbar. Du gehst in vier Schritten vor. Erstens legst du die **Kriterien** fest, die dir wichtig sind. Zweitens **gewichtest** du sie, etwa in Prozent oder mit Punkten von 1 bis 5. Drittens **bewertest** du jede Alternative bei jedem Kriterium. Viertens berechnest du den **Nutzwert**.",
      "Den Nutzwert bekommst du, indem du jede Bewertung mit dem Gewicht ihres Kriteriums multiplizierst und die Produkte addierst. Beispiel: Preis zählt 50 %, Qualität 30 % und Nachhaltigkeit 20 %. Rucksack A erhält 4, 3 und 2 Punkte, also 0,5 · 4 + 0,3 · 3 + 0,2 · 2 = 3,3. Rucksack B erhält 2, 5 und 4 Punkte, also 0,5 · 2 + 0,3 · 5 + 0,2 · 4 = 3,3. Gleichstand! Würdest du Nachhaltigkeit stärker gewichten, läge B vorne.",
      "Das Beispiel zeigt die Stärke und die Grenze der Methode. Sie zwingt dich, deine Kriterien offenzulegen, und macht die Entscheidung überprüfbar, auch für andere. Aber die Gewichte und Bewertungen sind **subjektiv**: Sie spiegeln deine persönlichen Anreize und Werte. Wer die Gewichte verändert, verändert das Ergebnis. Die Matrix rechnet deshalb nicht die eine richtige Antwort aus, sondern zeigt, welche Alternative zu deinen eigenen Prioritäten passt.",
      "Achte darauf, dass sich Kriterien nicht überschneiden, sonst zählst du etwas doppelt, etwa Haltbarkeit und Qualität. Lege außerdem Mindestanforderungen vorher fest: Ein Fahrradhelm ohne Prüfnorm scheidet aus, egal wie viele Punkte er sonst bekommt. Prüfe am Ende, ob das Ergebnis deinem Bauchgefühl widerspricht. Wenn ja, fehlt vielleicht ein Kriterium.",
    ],
    terms: [
      term("Entscheidungsmatrix", "Tabelle, in der Alternativen nach gewichteten Kriterien bewertet und verglichen werden."),
      term("Gewichtung", "Festlegung, wie wichtig ein Kriterium im Verhältnis zu den anderen ist."),
      term("Nutzwert", "Summe der mit ihren Gewichten multiplizierten Bewertungen einer Alternative."),
    ],
    takeaway:
      "Die Entscheidungsmatrix gewichtet Kriterien, bewertet Alternativen und berechnet daraus Nutzwerte. Sie macht deine Entscheidung nachvollziehbar, bleibt aber so subjektiv wie deine Gewichte.",
    sourceIds: ["lp", "test"],
    quiz: check(
      "Zwei Handys liegen in der Entscheidungsmatrix gleichauf. Was ändert das Ergebnis am wahrscheinlichsten?",
      "Eine andere Gewichtung der Kriterien, die zeigt, was dir besonders wichtig ist.",
      ["Eine größere Tabelle mit mehr Zeilen, auch wenn die Kriterien dieselben bleiben.", "Nichts, denn bei Gleichstand sind beide Handys objektiv gleich gut."],
      "Gewichte bestimmen, welche Stärken zählen. Schon eine kleine Verschiebung kann einen klaren Sieger ergeben. Objektiv gleich gut sind die Handys deshalb noch nicht.",
    ),
    workshop: {
      kind: "timeline",
      title: "Schritte der Entscheidungsmatrix",
      instruction: "Bringe die Schritte in die richtige Reihenfolge.",
      categories: [],
      entries: [
        { text: "Kriterien festlegen, die für die Entscheidung wichtig sind", target: 0, feedback: "Ohne Kriterien gibt es nichts zu bewerten." },
        { text: "Kriterien gewichten, etwa in Prozent, die zusammen 100 % ergeben", target: 1, feedback: "Die Gewichte zeigen deine Prioritäten." },
        { text: "Jede Alternative bei jedem Kriterium mit Punkten bewerten", target: 2, feedback: "Erst jetzt kommen die Angebote ins Spiel." },
        { text: "Bewertung mal Gewicht rechnen und je Alternative addieren", target: 3, feedback: "Daraus entsteht der Nutzwert." },
        { text: "Ergebnis prüfen und die Alternative mit dem höchsten Nutzwert wählen", target: 4, feedback: "Zum Schluss steht eine begründete Entscheidung." },
      ],
      conclusion: "Wer diese Reihenfolge einhält, entscheidet transparent und überprüfbar.",
    },
    casework: {
      title: "Welcher Rucksack für die Klassenfahrt?",
      story:
        "**Ben** vergleicht zwei Rucksäcke. Gewichte: **Preis 50 %**, **Qualität 30 %**, **Nachhaltigkeit 20 %**. Rucksack A bekommt die Punkte **4, 3, 2**, Rucksack B **2, 5, 4** (von 1 bis 5).",
      steps: [
        decide("Welchen Nutzwert hat Rucksack A?", "3,3", "9", "0,5 · 4 + 0,3 · 3 + 0,2 · 2 = 2 + 0,9 + 0,4 = 3,3. Die 9 entsteht, wenn man die Punkte ohne Gewichte addiert."),
        decide("Welchen Nutzwert hat Rucksack B?", "3,3", "3,9", "0,5 · 2 + 0,3 · 5 + 0,2 · 4 = 1 + 1,5 + 0,8 = 3,3."),
        decide("Ben gewichtet Nachhaltigkeit nun mit 30 % und den Preis mit 40 %. Wer liegt vorne?", "Rucksack B", "Rucksack A", "A: 0,4 · 4 + 0,3 · 3 + 0,3 · 2 = 3,1. B: 0,4 · 2 + 0,3 · 5 + 0,3 · 4 = 3,5."),
      ],
      verdict: "Bei der ersten Gewichtung herrscht Gleichstand. Erst als Ben Nachhaltigkeit stärker gewichtet, liegt Rucksack B vorne. Die Gewichte entscheiden.",
    },
    tasks: {
      1: write(
        "Erstelle in Worten eine kleine Entscheidungsmatrix für eine eigene Kaufentscheidung mit zwei Alternativen und drei gewichteten Kriterien. Berechne die Nutzwerte.",
        ["Wähle Kriterien, die sich nicht überschneiden.", "Achte darauf, dass die Gewichte zusammen 100 % ergeben."],
        "Ich vergleiche zwei Fahrradschlösser. Kriterien: Sicherheit 50 %, Preis 30 %, Gewicht 20 %. Schloss A erhält 5, 2 und 2 Punkte, Nutzwert 0,5 · 5 + 0,3 · 2 + 0,2 · 2 = 3,5. Schloss B erhält 3, 4 und 4 Punkte, Nutzwert 0,5 · 3 + 0,3 · 4 + 0,2 · 4 = 3,5. Gleichstand. Da mir ein gestohlenes Fahrrad am meisten schaden würde, erhöhe ich die Sicherheit auf 60 %: Dann liegt A mit 3,8 vor B mit 3,4.",
        ["Nennt zwei Alternativen und drei Kriterien mit Gewichten", "Rechnet die Nutzwerte richtig aus", "Begründet die Entscheidung"],
      ),
      2: write(
        "Ein Freund sagt: „Die Entscheidungsmatrix ist objektiv, weil sie rechnet.“ Beurteile diese Aussage.",
        ["Wer legt Kriterien, Gewichte und Punkte fest?", "Was zeigt dir das Labor, wenn du ein Gewicht veränderst?"],
        "Die Aussage stimmt nicht. Die Rechnung selbst ist zwar eindeutig, aber Kriterien, Gewichte und Bewertungen legt man selbst fest. Sie spiegeln persönliche Werte und Anreize. Im Labor hat schon ein einziges geändertes Gewicht einen anderen Sieger ergeben. Der Vorteil der Matrix ist nicht Objektivität, sondern Transparenz: Jeder kann sehen, warum ich mich so entschieden habe, und meine Gewichte hinterfragen. Damit wird die Entscheidung überlegter, aber nicht neutral.",
        ["Unterscheidet Rechnung und subjektive Eingaben", "Nennt das Beispiel der veränderten Gewichte", "Zeigt den eigentlichen Vorteil der Methode"],
      ),
    },
    lab: "nutzwert",
    practice: "nutzwert",
  },

  {
    id: "ko-werbung",
    lb: 1,
    unit: "1.1",
    title: "Werbung und Verkaufspsychologie",
    intro: "Werbung will auffallen, Wünsche wecken und zum Kauf bewegen. Der Laden selbst arbeitet mit.",
    paragraphs: [
      "**Werbung** soll Aufmerksamkeit erregen und zum Kauf bewegen. Ein bekanntes Modell beschreibt ihre Wirkung in vier Stufen, die **AIDA-Formel**: **A**ttention (Aufmerksamkeit wecken, etwa durch einen schrillen Clip), **I**nterest (Interesse erzeugen, etwa durch eine Geschichte), **D**esire (den Wunsch wecken, das Produkt zu besitzen) und **A**ction (zum Handeln auffordern: „Nur heute bestellen!“). **Informative Werbung** nennt Eigenschaften und Preise. **Emotionale Werbung** verknüpft ein Produkt mit Gefühlen wie Freiheit, Freundschaft oder Erfolg, die mit dem Produkt selbst wenig zu tun haben.",
      "Besonders wirksam ist Werbung, die nicht wie Werbung aussieht. **Influencer** empfehlen Produkte, als wären es persönliche Tipps; beim **Product Placement** taucht eine Marke wie zufällig in einem Film oder Video auf. Bezahlte Beiträge müssen deshalb als Werbung oder Anzeige gekennzeichnet sein; das Gesetz gegen den unlauteren Wettbewerb verbietet es, den kommerziellen Zweck zu verschleiern.",
      "Auch im Geschäft wirken **verkaufspsychologische Maßnahmen**. Teure Markenartikel stehen in der **Sichtzone** auf Augenhöhe, günstige Eigenmarken in der Bückzone weiter unten. Grundnahrungsmittel wie Milch liegen oft weit hinten, damit Kunden an vielen anderen Waren vorbeigehen. An der Kasse warten **Quengelwaren** wie Süßigkeiten, die Kinder in der Wartezeit entdecken. Ruhige Musik verlangsamt das Tempo, der Duft frischer Brötchen weckt Appetit, und Sonderangebote auf Aktionsflächen wirken wie Schnäppchen, auch wenn sie es nicht sind.",
      "Werbung ist nicht verboten oder grundsätzlich schlecht: Sie informiert über neue Produkte und ermöglicht kostenlose Angebote wie werbefinanzierte Apps. Problematisch wird sie, wenn sie Unsicherheiten ausnutzt oder Bedürfnisse erst schafft, die man ohne sie nicht hätte. Wer die Techniken kennt, kann innehalten und fragen: Will ich das wirklich, oder wurde mir der Wunsch gerade eingepflanzt?",
    ],
    terms: [
      term("AIDA-Formel", "Werbemodell mit den Stufen Aufmerksamkeit, Interesse, Wunsch und Handlung."),
      term("Emotionale Werbung", "Werbung, die ein Produkt mit Gefühlen und Lebensstilen statt mit Sachinformationen verbindet."),
      term("Quengelware", "Kleine, verlockende Artikel im Kassenbereich, die zu Spontankäufen verleiten."),
      term("Sichtzone", "Regalbereich auf Augenhöhe, in dem besonders gewinnbringende Waren stehen."),
    ],
    takeaway:
      "Werbung folgt oft der AIDA-Formel und arbeitet mit Gefühlen. Im Laden lenken Regalplatzierung, Laufwege und Quengelware das Verhalten. Wer die Techniken kennt, kann seine Wünsche prüfen.",
    sourceIds: ["lp", "vz", "uwg"],
    quiz: check(
      "In einem Video schwärmt eine Influencerin von einem Energydrink. Unten steht klein „Anzeige“. Was bedeutet das?",
      "Sie wurde für den Beitrag bezahlt oder belohnt, der Beitrag ist also Werbung.",
      ["Der Drink wurde von einer unabhängigen Stelle getestet und für gut befunden.", "Die Influencerin kauft den Drink regelmäßig selbst und empfiehlt ihn deshalb."],
      "Die Kennzeichnung zeigt einen kommerziellen Zweck. Sie sagt nichts über Qualität oder über die persönliche Meinung der Influencerin.",
    ),
    workshop: sort(
      "Welche Stufe der AIDA-Formel?",
      "Ordne jede Maßnahme eines Werbespots für Sportschuhe der passenden Stufe zu.",
      ["Attention", "Interest", "Desire", "Action"],
      [
        ["Der Spot beginnt mit einem lauten Knall und einem Sprung in Zeitlupe.", 0, "Ein überraschender Einstieg soll Aufmerksamkeit wecken."],
        ["Eine Läuferin erzählt, wie sie trotz Verletzung ihr erstes Rennen gewann.", 1, "Die Geschichte erzeugt Interesse am Produkt."],
        ["Man sieht, wie alle Freunde die Läuferin für ihre Schuhe bewundern.", 2, "Der Wunsch nach Anerkennung wird mit dem Schuh verknüpft."],
        ["Zum Schluss: „Nur bis Sonntag 20 % Rabatt, jetzt im Shop sichern!“", 3, "Ein Zeitdruck fordert zum sofortigen Kauf auf."],
      ],
      "Jede Stufe hat eine eigene Aufgabe auf dem Weg zum Kauf.",
    ),
    casework: {
      title: "Ein Gang durch den Supermarkt",
      story:
        "**Frau Wagner** will nur schnell **Milch** kaufen. Am Eingang duftet es nach frischen Brötchen. Die Milch steht ganz hinten im Laden. Auf Augenhöhe stehen teure Marken, unten die Eigenmarke. An der Kasse greift ihr **Sohn** nach einem Überraschungsei.",
      steps: [
        decide("Warum steht die Milch ganz hinten?", "Kunden sollen an möglichst vielen anderen Waren vorbeigehen.", "Milch muss aus hygienischen Gründen immer hinten stehen.", "Lange Laufwege erhöhen die Zahl der Spontankäufe."),
        decide("Was bezweckt die Platzierung auf Augenhöhe?", "Die Waren mit dem höchsten Gewinn sollen zuerst ins Auge fallen.", "Ältere Kunden sollen die Produkte leichter erreichen.", "Die Sichtzone ist der wertvollste Platz im Regal."),
        decide("Welche Maßnahme ist das Überraschungsei an der Kasse?", "Quengelware", "Informative Werbung", "Die Ware wartet dort, wo Kinder in der Schlange Zeit haben und quengeln."),
      ],
      verdict: "Der ganze Laden ist auf Spontankäufe ausgelegt. Wer die Maßnahmen erkennt, kauft eher nur, was er wirklich braucht.",
    },
    tasks: {
      1: write(
        "Beschreibe einen Werbespot oder Beitrag, den du kennst, und erkläre, wie er die vier Stufen der AIDA-Formel umsetzt.",
        ["Womit beginnt die Werbung, und womit endet sie?", "Welches Gefühl soll das Produkt auslösen?"],
        "Ein Spot für ein Handyspiel beginnt mit einer Explosion auf dem Bildschirm: Das weckt meine Aufmerksamkeit. Dann sieht man, wie ein Spieler eine schwierige Stufe meistert, das macht mich neugierig. Seine Freunde jubeln ihm zu, und ich wünsche mir, auch so gut zu sein. Zum Schluss erscheint der Hinweis, dass das Spiel heute kostenlos ist und ich es sofort herunterladen soll. So durchläuft der Spot alle vier Stufen bis zur Handlung.",
        ["Nennt einen konkreten Spot", "Ordnet alle vier Stufen richtig zu", "Benennt das angesprochene Gefühl"],
      ),
      2: write(
        "Sollten Quengelwaren an Supermarktkassen verboten werden? Erörtere die Frage aus Sicht von Eltern und Händlern und komme zu einem Urteil.",
        ["Was gewinnt der Händler, was verlieren Eltern?", "Welche Freiheit hätte ein Verbot, welche Nachteile?"],
        "Aus Sicht vieler Eltern sind Quengelwaren ein Ärgernis: Ihre Kinder sehen in der Wartezeit Süßigkeiten, und es kommt zu Streit oder zu Käufen, die gar nicht geplant waren. Aus Sicht der Händler bringen gerade diese Artikel hohe Gewinne, und sie berufen sich darauf, dass niemand zum Kauf gezwungen wird. Ein Verbot würde Kinder vor Verführung und ungesunder Ernährung schützen, schränkt aber die Freiheit der Händler ein. Ich halte ein Verbot für unnötig, aber Kassen ohne Süßwaren als Angebot für Familien für sinnvoll.",
        ["Stellt die Sicht der Eltern dar", "Stellt die Sicht der Händler dar", "Kommt zu einem begründeten Urteil"],
      ),
    },
  },

  {
    id: "ko-verhaltensoekonomie",
    lb: 1,
    unit: "1.1",
    title: "Verhaltensökonomie: Wie Preise uns täuschen",
    intro: "19,99 € wirkt billiger als 20 €. Die Verhaltensökonomie erklärt, warum wir nicht immer rational entscheiden.",
    paragraphs: [
      "Klassische Wirtschaftsmodelle gehen davon aus, dass Menschen alle Informationen abwägen und rational entscheiden. Die **Verhaltensökonomie** untersucht, wie Menschen sich tatsächlich verhalten. Sie zeigt: Wir nutzen Faustregeln, lassen uns von Gefühlen und vom ersten Eindruck leiten und machen dabei typische, vorhersagbare Fehler. Unternehmen kennen diese **verhaltensökonomischen Effekte** und nutzen sie gezielt.",
      "Der **Schwelleneffekt** ist der bekannteste. Wir lesen von links nach rechts, und die erste Ziffer prägt unseren Eindruck. Ein Preis von 19,99 € wirkt deutlich billiger als 20,00 €, obwohl nur ein Cent fehlt. Deshalb enden so viele Preise auf ,99 oder ,95. Der **Ankereffekt** wirkt ähnlich: Ein durchgestrichener früherer Preis von 49 € setzt einen Vergleichsmaßstab, und der neue Preis von 29 € wirkt wie ein Schnäppchen, auch wenn andere Händler das Produkt immer für 25 € verkaufen.",
      "Bei der **Preis-Qualitäts-Illusion** schließen Käufer vom Preis auf die Qualität: Was teurer ist, muss besser sein. Tests zeigen oft das Gegenteil, etwa wenn ein günstiges Sonnenspray genauso gut schützt wie ein teures Markenprodukt. Weitere Effekte sind die **künstliche Verknappung** („Nur noch 2 Zimmer verfügbar!“), die Angst auslöst, etwas zu verpassen, und **Voreinstellungen**: Ist bei einer Bestellung die Versicherung schon angekreuzt, behalten viele sie einfach bei.",
      "Diese Effekte wirken auch bei Menschen, die von ihnen wissen. Helfen kann eine einfache Gegenstrategie: Preise auf eine runde Zahl aufrunden, Streichpreise ignorieren und stattdessen bei mehreren Händlern vergleichen, Testberichte lesen statt vom Preis auf die Qualität zu schließen und bei Zeitdruck eine Nacht über den Kauf schlafen.",
    ],
    terms: [
      term("Schwelleneffekt", "Preise knapp unter einer runden Zahl wirken deutlich günstiger, weil die erste Ziffer den Eindruck prägt."),
      term("Ankereffekt", "Eine zuerst gesehene Zahl, etwa ein Streichpreis, beeinflusst, wie wir spätere Zahlen bewerten."),
      term("Preis-Qualitäts-Illusion", "Der Fehlschluss, ein teureres Produkt sei automatisch von höherer Qualität."),
      term("Künstliche Verknappung", "Hinweise auf geringe Mengen oder knappe Zeit, die zu schnellen Käufen drängen."),
    ],
    takeaway:
      "Menschen entscheiden nicht immer rational. Schwellenpreise, Streichpreise als Anker, die Preis-Qualitäts-Illusion und künstliche Verknappung lenken Kaufentscheidungen. Aufrunden, vergleichen und Zeit lassen hilft dagegen.",
    sourceIds: ["lp", "vz", "test", "pangv"],
    lab: "preisschild",
    quiz: check(
      "Ein Laden verlangt für einen Rucksack 39,90 € statt 40 €. Welchen Effekt nutzt er?",
      "Den Schwelleneffekt: Die 3 vorne lässt den Preis deutlich niedriger wirken.",
      ["Den Ankereffekt: Der alte Preis von 40 € steht durchgestrichen daneben.", "Die Preis-Qualitäts-Illusion: Ein so genauer Preis wirkt besonders hochwertig."],
      "Der Preis liegt knapp unter der runden Schwelle von 40 €. Einen Streichpreis gibt es im Beispiel nicht, und die Illusion schließt von einem hohen Preis auf hohe Qualität.",
    ),
    workshop: sort(
      "Welcher Effekt steckt dahinter?",
      "Ordne jede Verkaufsmaßnahme dem passenden verhaltensökonomischen Effekt zu.",
      ["Schwelleneffekt", "Ankereffekt", "Preis-Qualitäts-Illusion", "Künstliche Verknappung"],
      [
        ["Ein Kopfhörer kostet 99,95 € statt 100 €.", 0, "Die erste Ziffer wechselt von 1 auf 9."],
        ["Statt 79 € nur 49 €: Der alte Preis steht groß und durchgestrichen daneben.", 1, "Der Streichpreis setzt den Vergleichsmaßstab."],
        ["Ein Hotelportal blinkt: „Nur noch 1 Zimmer zu diesem Preis!“", 3, "Der Hinweis auf knappe Mengen erzeugt Zeitdruck."],
        ["Ein Kunde nimmt das teuerste Olivenöl, weil teuer bestimmt besser schmeckt.", 2, "Er schließt vom Preis auf die Qualität."],
        ["Ein Spiel kostet 9,99 € und wirkt dadurch billiger als eines für 10 €.", 0, "Wieder entscheidet die erste Ziffer."],
      ],
      "Wer den Effekt benennen kann, lässt sich weniger leicht steuern.",
    ),
    casework: {
      title: "Der Black-Friday-Deal",
      story:
        "Ein Onlineshop zeigt Kopfhörer: **„statt 149 € nur 89,99 €“**, dazu ein Countdown **„Angebot endet in 02:59 Minuten“**. **Selin** findet in einem Preisvergleich, dass die Kopfhörer seit Monaten bei mehreren Händlern **um 85 €** kosten.",
      steps: [
        decide("Welche Funktion hat der Preis von 149 €?", "Er ist ein Anker, der den Rabatt größer erscheinen lässt.", "Er beweist, dass die Kopfhörer besonders hochwertig sind.", "Der Streichpreis setzt einen Maßstab. Der Vergleich zeigt, dass kaum jemand 149 € verlangt."),
        decide("Welcher Effekt steckt im Countdown?", "Künstliche Verknappung von Zeit", "Der Schwelleneffekt", "Der Zeitdruck soll verhindern, dass Selin vergleicht."),
        decide("Ist das Angebot ein Schnäppchen?", "Nein, es ist sogar teurer als der übliche Preis anderer Händler.", "Ja, denn 89,99 € sind 40 % weniger als 149 €.", "Entscheidend ist der Vergleich mit dem Marktpreis von etwa 85 €, nicht mit dem Anker."),
      ],
      verdict: "Anker und Countdown erzeugen den Eindruck eines Schnäppchens. Erst der Preisvergleich zeigt, dass Selin bei anderen Händlern günstiger kauft.",
    },
    tasks: {
      1: write(
        "Erkläre den Schwelleneffekt und den Ankereffekt jeweils an einem eigenen Beispiel aus einem Laden oder Onlineshop.",
        ["Achte auf die Endziffern von Preisen.", "Wo hast du schon einmal einen durchgestrichenen Preis gesehen?"],
        "Beim Schwelleneffekt wirkt ein Preis knapp unter einer runden Zahl viel günstiger. Im Sportgeschäft kostet ein Ball 29,99 €; ich nehme ihn als „irgendwas mit zwanzig“ wahr, obwohl er fast 30 € kostet. Beim Ankereffekt beeinflusst eine zuerst gesehene Zahl mein Urteil. In einem Onlineshop stand bei einer Jacke „statt 120 € nur 70 €“. Durch die 120 wirkten 70 € billig, obwohl ich nicht wusste, ob die Jacke je 120 € gekostet hat.",
        ["Erklärt beide Effekte richtig", "Gibt je ein konkretes Beispiel", "Zeigt, wie der Effekt die Wahrnehmung verändert"],
      ),
      2: write(
        "Entwickle drei Regeln, mit denen du dich beim Onlineshopping gegen verhaltensökonomische Effekte schützen kannst, und begründe jede Regel.",
        ["Gegen welchen Effekt hilft welche Regel?", "Was ändert eine Pause vor dem Kauf?"],
        "Erstens runde ich jeden Preis auf die nächste runde Zahl auf, denn so verliert der Schwelleneffekt seine Wirkung. Zweitens ignoriere ich Streichpreise und vergleiche stattdessen den Preis bei mindestens zwei anderen Händlern, weil der Anker sonst mein Urteil verzerrt. Drittens kaufe ich bei Countdowns oder Hinweisen wie „nur noch zwei verfügbar“ nicht sofort, sondern warte einen Tag, denn künstliche Verknappung soll genau das Nachdenken verhindern. Diese Regeln kosten wenig Zeit und schützen mein Budget.",
        ["Nennt drei konkrete Regeln", "Ordnet jeder Regel einen Effekt zu", "Begründet, warum die Regel wirkt"],
      ),
    },
  },
];
