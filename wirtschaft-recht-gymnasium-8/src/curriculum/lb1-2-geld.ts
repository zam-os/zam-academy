import type { Lesson } from "../model/types";
import { check, decide, sort, term, write } from "./lesson-parts";

export const LB1_2: Lesson[] = [
  {
    id: "ge-geldfunktionen",
    lb: 1,
    unit: "1.2",
    title: "Wozu wir Geld brauchen: die Funktionen des Geldes",
    intro: "Stell dir vor, du müsstest dein Pausenbrot gegen Mathe-Nachhilfe tauschen. Geld macht das Leben einfacher.",
    paragraphs: [
      "Ohne Geld müssten Menschen Waren direkt gegeneinander tauschen, das nennt man **Naturaltausch**. Das ist mühsam: Wer Äpfel hat und Schuhe will, muss jemanden finden, der Schuhe hat und gerade Äpfel möchte. Geld löst dieses Problem, weil es drei **Funktionen** erfüllt.",
      "Erstens ist Geld **Tausch- und Zahlungsmittel**: Alle nehmen es im Tausch gegen Waren und Dienstleistungen an, und man kann damit Schulden begleichen. Zweitens ist Geld **Recheneinheit** oder Wertmaßstab: Weil alle Preise in Euro angegeben sind, kann man ein Fahrrad mit einem Handy oder einem Monatslohn vergleichen. Drittens ist Geld **Wertaufbewahrungsmittel**: Man kann es sparen und später ausgeben, anders als Äpfel, die verderben.",
      "Alle drei Funktionen hängen davon ab, dass die Menschen dem Geld **vertrauen**. Euro-Banknoten haben keinen nennenswerten Materialwert; sie gelten, weil alle sie annehmen und weil die Europäische Zentralbank für ihren Wert verantwortlich ist. Banknoten sind in Deutschland das einzige unbeschränkte gesetzliche Zahlungsmittel. Daneben gibt es **Buchgeld**, also Guthaben auf Konten, das man per Überweisung oder Karte bewegt. Heute ist der größte Teil des Geldes Buchgeld.",
      "Die Funktionen geraten in Gefahr, wenn Geld seinen Wert verliert. Steigen die Preise stark, taugt Geld schlecht zur Wertaufbewahrung, denn das Ersparte kauft später weniger. Steigen sie sehr schnell, wie in Deutschland 1923, versagt auch die Recheneinheit: Preise ändern sich stündlich, und Menschen kehren zum Tausch zurück. Deshalb ist ein stabiler Geldwert so wichtig, wie die nächste Lektion zeigt.",
    ],
    terms: [
      term("Tauschmittel", "Geld wird von allen im Austausch gegen Güter angenommen und dient zum Bezahlen."),
      term("Recheneinheit", "In Geld lassen sich die Werte aller Güter ausdrücken und vergleichen."),
      term("Wertaufbewahrungsmittel", "Geld lässt sich sparen, um später damit etwas zu kaufen."),
      term("Buchgeld", "Guthaben auf Bankkonten, über das man unbar verfügt, etwa per Überweisung oder Karte."),
    ],
    takeaway:
      "Geld ist Tauschmittel, Recheneinheit und Wertaufbewahrungsmittel. Alle drei Funktionen beruhen auf Vertrauen und funktionieren nur, solange der Geldwert stabil bleibt.",
    sourceIds: ["lp", "bbk-bargeld", "bbk-geldpolitik"],
    quiz: check(
      "Leonie vergleicht: Ein Konzertticket kostet 60 €, ein Paar Sneaker 120 €. Welche Funktion des Geldes nutzt sie dabei?",
      "Die Funktion als Recheneinheit, weil sich beide Preise in Euro vergleichen lassen.",
      ["Die Funktion als Wertaufbewahrungsmittel, weil sie das Geld erst sparen muss.", "Die Funktion als Tauschmittel, weil sie die Sneaker gegen Tickets tauschen will."],
      "Beim Vergleichen dient Geld als gemeinsamer Wertmaßstab. Gespart oder gezahlt wird in diesem Moment noch nichts.",
    ),
    workshop: sort(
      "Welche Funktion erfüllt das Geld?",
      "Ordne jede Situation der passenden Funktion des Geldes zu.",
      ["Tauschmittel", "Recheneinheit", "Wertaufbewahrung"],
      [
        ["Tarek bezahlt im Kiosk ein Getränk mit einer Zwei-Euro-Münze.", 0, "Er gibt Geld im Tausch gegen eine Ware."],
        ["Eine Speisekarte nennt für jedes Gericht einen Preis in Euro.", 1, "Die Preise machen die Gerichte vergleichbar."],
        ["Sophie legt jeden Monat 10 € für den Führerschein zurück.", 2, "Sie bewahrt Kaufkraft für später auf."],
        ["Ein Verkäufer berechnet, dass ein Fahrrad so viel kostet wie vier Paar Schuhe.", 1, "Er nutzt den Euro als Wertmaßstab."],
        ["Oma schenkt dir 50 €, die du erst in einem Jahr ausgibst.", 2, "Das Geld dient bis dahin als Wertspeicher."],
      ],
      "Oft erfüllt dasselbe Geld nacheinander mehrere Funktionen.",
    ),
    casework: {
      title: "Ein Dorf ohne Geld",
      story:
        "In einem ausgedachten Dorf gibt es **kein Geld**. **Bauer Huber** hat Kartoffeln und braucht neue Stiefel. Der **Schuster** braucht keine Kartoffeln, sondern Holz. Die **Försterin** hat Holz und möchte Kartoffeln.",
      steps: [
        decide("Warum kommt kein direkter Tausch zwischen Huber und dem Schuster zustande?", "Der Schuster braucht keine Kartoffeln, ihre Wünsche passen nicht zusammen.", "Kartoffeln sind weniger wert als Stiefel.", "Beim Naturaltausch müssen beide genau das wollen, was der andere hat."),
        decide("Wie könnte Huber trotzdem an Stiefel kommen?", "Über einen Ringtausch: Kartoffeln an die Försterin, Holz an den Schuster.", "Gar nicht, ohne Geld ist jeder Tausch unmöglich.", "Ein Ringtausch ist möglich, aber aufwendig, weil man erst alle passenden Partner finden muss."),
        decide("Welche Funktion des Geldes würde das Problem am direktesten lösen?", "Die Funktion als Tauschmittel", "Die Funktion als Wertaufbewahrungsmittel", "Wenn alle Geld annehmen, kann Huber Kartoffeln verkaufen und mit dem Geld Stiefel kaufen."),
      ],
      verdict: "Ohne Geld müssen die Wünsche der Tauschpartner zusammenpassen. Als allgemein anerkanntes Tauschmittel trennt Geld Verkauf und Kauf und spart so Zeit.",
    },
    tasks: {
      1: write(
        "Erkläre die drei Funktionen des Geldes an je einem Beispiel aus deinem Alltag.",
        ["Wann bezahlst du, wann vergleichst du Preise, wann sparst du?", "Was wäre ohne Geld schwieriger?"],
        "Als Tauschmittel nutze ich Geld, wenn ich in der Mensa mein Essen bezahle. Als Recheneinheit dient es mir, wenn ich zwei Handytarife vergleiche, weil beide in Euro pro Monat angegeben sind. Als Wertaufbewahrungsmittel nutze ich es, wenn ich mein Geburtstagsgeld auf das Sparkonto lege, um später ein Fahrrad zu kaufen. Ohne Geld müsste ich für jeden Einkauf jemanden finden, der genau das will, was ich anbieten kann.",
        ["Nennt alle drei Funktionen", "Gibt zu jeder ein passendes Beispiel", "Erklärt den Vorteil gegenüber dem Naturaltausch"],
      ),
      2: write(
        "Erkläre, warum Euro-Banknoten Geld sind, obwohl ihr Papier kaum etwas wert ist, und was passiert, wenn das Vertrauen in eine Währung schwindet.",
        ["Worauf beruht die Annahme von Geld?", "Welche Funktion leidet zuerst, wenn die Preise stark steigen?"],
        "Banknoten sind Geld, weil alle sie als Zahlungsmittel annehmen und darauf vertrauen, dass sie auch morgen noch etwas wert sind. Dieses Vertrauen stützt sich darauf, dass die Europäische Zentralbank für einen stabilen Geldwert sorgt. Schwindet das Vertrauen, weil die Preise stark steigen, will niemand mehr Geld sparen, und die Wertaufbewahrung versagt zuerst. Wird die Inflation extrem, wie 1923 in Deutschland, ändern sich Preise so schnell, dass auch die Recheneinheit versagt und die Menschen wieder tauschen.",
        ["Erklärt die Bedeutung des Vertrauens", "Nennt die Rolle der Zentralbank", "Beschreibt die Folgen für die Funktionen des Geldes"],
      ),
    },
  },

  {
    id: "ge-geldwert",
    lb: 1,
    unit: "1.2",
    title: "Geldwertstabilität: Inflation und Deflation",
    intro: "Wenn die Preise steigen, kauft dein Geld weniger. Wer gewinnt und wer verliert dabei?",
    paragraphs: [
      "Der Wert des Geldes zeigt sich in seiner **Kaufkraft**: Wie viele Waren und Dienstleistungen bekommst du für einen Euro? Steigt das allgemeine Preisniveau über längere Zeit, spricht man von **Inflation**; die Kaufkraft sinkt. Sinkt das Preisniveau, spricht man von **Deflation**. Das Statistische Bundesamt misst die Entwicklung mit dem **Verbraucherpreisindex**: Es beobachtet die Preise eines Warenkorbs aus vielen Gütern, die Haushalte typischerweise kaufen. Die prozentuale Veränderung gegenüber dem Vorjahr ist die **Inflationsrate**.",
      "Ein Beispiel: Der Warenkorb kostet 200 €, im nächsten Jahr bei 4 % Inflation 208 €. Für 200 € bekommst du dann nur noch etwa 96 % der früheren Menge, denn 200 : 1,04 ≈ 192,31 €. Die Europäische Zentralbank hat deshalb die Aufgabe, für **Preisstabilität** zu sorgen. Sie strebt mittelfristig eine Inflationsrate von 2 % an. Eine leichte, gut vorhersehbare Inflation gilt als unschädlich, eine hohe oder eine Deflation als gefährlich.",
      "Inflation trifft die **Wirtschaftssubjekte** unterschiedlich. **Sparer** verlieren, wenn die Zinsen unter der Inflationsrate liegen. **Schuldner** gewinnen, weil ihre Schulden real weniger wert werden. **Arbeitnehmer** verlieren Kaufkraft, wenn ihre Löhne langsamer steigen als die Preise: Ihr **Reallohn** sinkt. **Unternehmen** können schlechter planen, weil Kosten und Preise schwanken. Der **Staat** ist meist ein großer Schuldner und profitiert real, muss aber oft höhere Sozialleistungen zahlen und verliert bei hoher Inflation das Vertrauen der Bürger.",
      "Auch Deflation ist gefährlich. Wenn alle erwarten, dass Waren morgen billiger sind, schieben sie Käufe auf. Unternehmen verkaufen weniger, senken Preise und Löhne oder entlassen Beschäftigte, und die Nachfrage sinkt weiter. Diese **Abwärtsspirale** ist schwer zu stoppen. Ein stabiler Geldwert schützt also alle: Er macht Preise verlässlich, Sparen sinnvoll und Planen möglich.",
    ],
    terms: [
      term("Kaufkraft", "Menge an Gütern, die man für einen bestimmten Geldbetrag kaufen kann."),
      term("Inflation", "Anhaltender Anstieg des allgemeinen Preisniveaus; die Kaufkraft des Geldes sinkt."),
      term("Deflation", "Anhaltender Rückgang des allgemeinen Preisniveaus, oft verbunden mit Kaufzurückhaltung."),
      term("Verbraucherpreisindex", "Kennzahl, die die Preisentwicklung eines typischen Warenkorbs privater Haushalte misst."),
      term("Reallohn", "Lohn gemessen an seiner Kaufkraft, also unter Berücksichtigung der Preisentwicklung."),
    ],
    takeaway:
      "Geldwertstabilität sichert die Kaufkraft. Inflation schadet vor allem Sparern und Arbeitnehmern, deren Einkommen langsamer steigen, und nützt Schuldnern. Deflation kann eine Abwärtsspirale auslösen. Die EZB strebt mittelfristig 2 % Inflation an.",
    sourceIds: ["lp", "destatis-vpi", "ezb", "bbk-geldpolitik"],
    lab: "kaufkraft",
    practice: "kaufkraft",
    quiz: check(
      "Herr Kaya bekommt 3 % mehr Lohn, die Inflationsrate beträgt 5 %. Was passiert mit seinem Reallohn?",
      "Er sinkt, weil die Preise schneller steigen als sein Lohn.",
      ["Er steigt, weil Herr Kaya jetzt mehr Euro auf dem Konto hat als vorher.", "Er bleibt gleich, weil sich Lohnerhöhung und Preissteigerung gegenseitig aufheben."],
      "Der Reallohn misst die Kaufkraft. Mehr Euro bringen nichts, wenn die Preise noch stärker steigen. Gleich bliebe er nur, wenn Lohn und Preise gleich schnell stiegen.",
    ),
    workshop: sort(
      "Wer gewinnt, wer verliert bei Inflation?",
      "Ordne ein, wie sich eine hohe Inflation auf die jeweilige Person oder Einrichtung auswirkt.",
      ["Eher Nachteil", "Eher Vorteil"],
      [
        ["Eine Rentnerin hat 20.000 € auf einem Sparbuch, das fast keine Zinsen bringt.", 0, "Ihr Erspartes verliert real an Wert."],
        ["Eine Familie hat für ihr Haus einen Kredit mit festem Zins aufgenommen.", 1, "Ihre Schulden werden real weniger wert."],
        ["Ein Azubi bekommt seit zwei Jahren dieselbe Vergütung.", 0, "Seine Kaufkraft sinkt, sein Reallohn fällt."],
        ["Ein Staat mit hohen Schulden, deren Zinsen fest vereinbart sind.", 1, "Auch der Staat profitiert real als Schuldner."],
        ["Ein Unternehmen, das langfristige Verträge zu festen Preisen abgeschlossen hat.", 0, "Seine Kosten steigen, die Einnahmen bleiben gleich."],
      ],
      "Inflation verteilt Kaufkraft um: von Gläubigern zu Schuldnern.",
    ),
    casework: {
      title: "Das Sparbuch der Großeltern",
      story:
        "Die Großeltern schenken **Mia** zur Geburt **1.000 €** auf ein Sparbuch. Das Konto bringt **kaum Zinsen**. In den folgenden Jahren steigen die Preise im Schnitt um **2 % im Jahr**, in einigen Jahren deutlich stärker.",
      steps: [
        decide("Was passiert mit der Kaufkraft der 1.000 €?", "Sie sinkt, weil die Preise steigen und das Geld kaum Zinsen bringt.", "Sie bleibt gleich, weil auf dem Konto weiterhin 1.000 € stehen.", "Entscheidend ist, was man für das Geld kaufen kann, nicht der Kontostand."),
        decide("Welche Funktion des Geldes leidet vor allem?", "Die Wertaufbewahrung", "Die Recheneinheit", "Geld, das an Kaufkraft verliert, eignet sich schlechter zum Sparen."),
        decide("Wann würde die Kaufkraft gleich bleiben?", "Wenn der Zinssatz so hoch ist wie die Inflationsrate.", "Wenn Mia das Geld als Bargeld zu Hause aufbewahrt.", "Bargeld bringt gar keine Zinsen. Nur ein Zins in Höhe der Inflation gleicht den Verlust aus."),
      ],
      verdict: "Der Kontostand bleibt, die Kaufkraft schrumpft. Wer spart, sollte Zinsen und Inflationsrate vergleichen.",
    },
    tasks: {
      1: write(
        "Erkläre an einem Rechenbeispiel, was eine Inflationsrate von 5 % für dein Erspartes von 500 € bedeutet, wenn du keine Zinsen bekommst.",
        ["Wie viel kostet ein Warenkorb von 500 € ein Jahr später?", "Was kannst du mit deinen 500 € dann noch kaufen?"],
        "Bei 5 % Inflation kostet ein Warenkorb, der heute 500 € kostet, in einem Jahr 525 €. Meine 500 € reichen dann nicht mehr für den ganzen Korb. In heutigen Preisen sind sie nur noch etwa 500 : 1,05 ≈ 476,19 € wert. Ich habe also rund 24 € Kaufkraft verloren, obwohl auf meinem Konto weiterhin 500 € stehen.",
        ["Rechnet den neuen Preis richtig aus", "Erklärt den Verlust an Kaufkraft", "Unterscheidet Kontostand und Kaufkraft"],
      ),
      2: write(
        "Schätze die Bedeutung der Geldwertstabilität aus der Sicht von zwei verschiedenen Wirtschaftssubjekten ein und begründe, warum die EZB weder Inflation noch Deflation will.",
        ["Wähle zum Beispiel einen Sparer, einen Arbeitnehmer, ein Unternehmen oder den Staat.", "Was passiert bei Deflation mit dem Kaufverhalten?"],
        "Für einen Arbeitnehmer ist Geldwertstabilität sehr wichtig: Steigen die Preise schneller als sein Lohn, sinkt sein Reallohn, und er kann sich weniger leisten. Für ein Unternehmen ist sie wichtig, weil es nur mit stabilen Preisen Kosten und Einnahmen verlässlich planen kann. Die EZB will keine hohe Inflation, weil sie Sparer und Lohnempfänger trifft und das Vertrauen ins Geld zerstört. Sie will aber auch keine Deflation, weil die Menschen dann Käufe aufschieben, Unternehmen weniger verkaufen und Arbeitsplätze verloren gehen. Deshalb strebt sie mittelfristig eine niedrige, stabile Rate von 2 % an.",
        ["Betrachtet zwei Wirtschaftssubjekte", "Begründet die Ablehnung hoher Inflation", "Begründet die Ablehnung von Deflation"],
      ),
    },
  },

  {
    id: "ge-zahlungsarten",
    lb: 1,
    unit: "1.2",
    title: "Zahlungsarten im Überblick und richtig wählen",
    intro: "Bar, mit Karte, per Überweisung oder Lastschrift: Jede Zahlungsart passt zu anderen Situationen.",
    paragraphs: [
      "Bei der **Barzahlung** wechseln Münzen und Banknoten den Besitzer. Sie ist schnell, du behältst den Überblick, und niemand speichert, was du kaufst. Dafür kann Bargeld verloren gehen oder gestohlen werden, und für große Beträge oder Käufe im Internet ist es unpraktisch. Bei **unbaren Zahlungen** wird Buchgeld von einem Girokonto auf ein anderes übertragen. Dafür brauchst du ein **Girokonto**; Jugendliche können meist mit Zustimmung der Eltern ein Konto ohne Überziehungsmöglichkeit eröffnen.",
      "Mit einer **Überweisung** beauftragst du deine Bank, einen Betrag auf das Konto des Empfängers zu buchen; du brauchst dafür seine IBAN. Bei der **Echtzeitüberweisung** ist das Geld innerhalb von Sekunden da. Ein **Dauerauftrag** überweist regelmäßig denselben Betrag, etwa die Miete. Bei der **SEPA-Lastschrift** erteilst du dem Empfänger ein Mandat, den Betrag von deinem Konto einzuziehen; das passt zu wechselnden Beträgen wie der Stromrechnung. Eine berechtigte Lastschrift kannst du innerhalb von acht Wochen zurückbuchen lassen.",
      "Mit der **Debitkarte**, in Deutschland oft die Girocard, zahlst du im Geschäft; der Betrag wird sofort oder nach wenigen Tagen von deinem Konto abgebucht. Bei der **Kreditkarte** sammelt die Bank die Zahlungen eines Monats und bucht sie gesammelt ab. Du bekommst also einen kurzen Kredit; wer die Abrechnung nicht vollständig bezahlt, zahlt oft hohe Zinsen. Kreditkarten erhalten in der Regel nur Volljährige, für Jugendliche gibt es Prepaid-Karten mit vorher aufgeladenem Guthaben.",
      "Welche Zahlungsart passt, hängt von drei **Kriterien** ab. Die **Sicherheit** fragt, wie gut du vor Verlust, Betrug und Fehlbuchungen geschützt bist. Die **Kosten** fragen nach Kontoführungs- oder Kartengebühren. Die **Zweckmäßigkeit** fragt, ob die Zahlungsart zur Situation passt: Ein Kaugummi am Kiosk bezahlt man anders als die monatliche Handyrechnung oder eine Bestellung in einem unbekannten Onlineshop.",
    ],
    terms: [
      term("Girokonto", "Bankkonto für den täglichen Zahlungsverkehr, über das Überweisungen, Lastschriften und Kartenzahlungen laufen."),
      term("Dauerauftrag", "Auftrag an die Bank, regelmäßig einen gleichen Betrag an denselben Empfänger zu überweisen."),
      term("SEPA-Lastschrift", "Der Empfänger zieht mit deinem Mandat einen Betrag von deinem Konto ein."),
      term("Debitkarte", "Bankkarte, mit der Zahlungen direkt vom Girokonto abgebucht werden."),
      term("Kreditkarte", "Karte, bei der Zahlungen gesammelt und später abgerechnet werden; die Bank gewährt kurzfristig Kredit."),
    ],
    takeaway:
      "Bargeld, Überweisung, Dauerauftrag, Lastschrift, Debit- und Kreditkarte haben je eigene Stärken. Wähle die Zahlungsart nach Sicherheit, Kosten und Zweckmäßigkeit für die konkrete Situation.",
    sourceIds: ["lp", "bbk-zahlungsverkehr", "bbk-bargeld", "vz"],
    quiz: check(
      "Welche Zahlungsart eignet sich am besten für den monatlichen Beitrag im Sportverein, der immer gleich hoch ist?",
      "Ein Dauerauftrag, weil er denselben Betrag regelmäßig und automatisch überweist.",
      ["Eine Kreditkarte, weil dann alle Beiträge erst am Ende des Jahres bezahlt werden.", "Barzahlung beim Training, weil Bargeld die sicherste Zahlungsart überhaupt ist."],
      "Für gleichbleibende, regelmäßige Beträge ist der Dauerauftrag gemacht. Eine Kreditkarte rechnet monatlich ab, und Bargeld ist nicht in jeder Lage am sichersten.",
    ),
    workshop: sort(
      "Welche Zahlungsart passt?",
      "Ordne jeder Situation die zweckmäßigste Zahlungsart zu.",
      ["Barzahlung", "Dauerauftrag", "SEPA-Lastschrift", "Debitkarte"],
      [
        ["Du kaufst auf dem Flohmarkt ein gebrauchtes Buch für 2 €.", 0, "Kleine Beträge unter Privatleuten zahlt man am einfachsten bar."],
        ["Die Eltern zahlen jeden Monat 650 € Miete an den Vermieter.", 1, "Gleicher Betrag, gleicher Empfänger, jeden Monat: ein Dauerauftrag."],
        ["Die Stromrechnung ist jeden Monat ein wenig anders hoch.", 2, "Bei wechselnden Beträgen zieht der Anbieter mit Mandat den richtigen Betrag ein."],
        ["Im Elektronikmarkt bezahlst du Kopfhörer für 89 €.", 3, "Im Geschäft ist die Kartenzahlung schnell und sicher."],
      ],
      "Die beste Zahlungsart hängt vom Betrag, vom Empfänger und von der Regelmäßigkeit ab.",
    ),
    casework: {
      title: "Der erste Monat mit eigenem Konto",
      story:
        "**Jonas (15)** hat ein **Jugendkonto mit Debitkarte** bekommen. Er zahlt **jeden Monat 10 €** für sein Handy-Prepaid-Guthaben, kauft **täglich** in der Pause etwas für **2 €** und möchte einmalig einen **Fußballschuh online** für 70 € bestellen.",
      steps: [
        decide("Wie bezahlt Jonas sein Pausenbrot am zweckmäßigsten?", "Bar oder mit der Debitkarte, je nachdem, was der Kiosk annimmt.", "Per Überweisung, weil sie am sichersten ist.", "Für kleine, spontane Beträge sind Bargeld und Karte praktisch."),
        decide("Was ist für die monatlichen 10 € Handyguthaben sinnvoll?", "Ein Dauerauftrag oder eine automatische Aufladung", "Eine Kreditkarte mit hohem Verfügungsrahmen", "Regelmäßige, gleiche Beträge lassen sich automatisieren; eine Kreditkarte bekommt Jonas in der Regel nicht."),
        decide("Warum kann Jonas sein Konto nicht überziehen?", "Jugendkonten werden meist nur auf Guthabenbasis geführt.", "Weil Debitkarten grundsätzlich nur Bargeld auszahlen.", "Minderjährige sollen sich nicht verschulden; deshalb gibt es keinen Dispositionskredit."),
      ],
      verdict: "Jonas kombiniert Zahlungsarten: bar oder Karte für den Alltag, Automatik für Regelmäßiges. Das Guthabenkonto schützt ihn vor Schulden.",
    },
    tasks: {
      1: write(
        "Vergleiche Barzahlung und Zahlung mit der Debitkarte anhand der Kriterien Sicherheit, Kosten und Zweckmäßigkeit.",
        ["Was passiert, wenn du dein Portemonnaie oder deine Karte verlierst?", "Wo kannst du nur mit Karte zahlen?"],
        "Bei der Sicherheit hat die Karte Vorteile: Verliere ich sie, kann ich sie sperren lassen, verlorenes Bargeld ist dagegen weg. Dafür hinterlässt die Karte Datenspuren, Bargeld nicht. Bei den Kosten fallen für Bargeld meist keine Gebühren an, für ein Konto mit Karte eventuell Kontoführungsgebühren, Jugendkonten sind aber oft kostenlos. Zweckmäßig ist Bargeld für kleine Beträge auf dem Flohmarkt, die Karte für größere Beträge im Geschäft. Ich nutze beides je nach Situation.",
        ["Vergleicht die Sicherheit", "Vergleicht die Kosten", "Beurteilt die Zweckmäßigkeit in Situationen"],
      ),
      2: write(
        "Du bestellst zum ersten Mal in einem Onlineshop, den du nicht kennst. Begründe, welche Zahlungsart du wählen würdest und welche du vermeiden solltest.",
        ["Bei welcher Zahlungsart kannst du dein Geld zurückholen?", "Was bedeutet Vorkasse per Überweisung für dich?"],
        "Bei einem unbekannten Shop würde ich möglichst auf Rechnung zahlen, denn dann bezahle ich erst, wenn die Ware angekommen ist. Geht das nicht, wähle ich die SEPA-Lastschrift, weil ich eine Lastschrift innerhalb von acht Wochen zurückbuchen lassen kann. Vermeiden würde ich Vorkasse per Überweisung, denn eine ausgeführte Überweisung kann ich nicht einfach zurückholen; bei einem Fake-Shop wäre das Geld verloren. Sicherheit geht bei unbekannten Händlern vor Bequemlichkeit.",
        ["Nennt eine geeignete Zahlungsart mit Begründung", "Nennt eine ungeeignete Zahlungsart mit Begründung", "Bezieht das Kriterium Sicherheit ein"],
      ),
    },
  },

  {
    id: "ge-digital",
    lb: 1,
    unit: "1.2",
    title: "Digital bezahlen: Möglichkeiten und Risiken",
    intro: "Handy an das Terminal halten, fertig. Digitales Bezahlen ist bequem, aber nicht ohne Risiken.",
    paragraphs: [
      "Der Zahlungsverkehr verändert sich schnell. Beim **mobilen Bezahlen** speichert man eine Karte digital im Smartphone oder in der Smartwatch und hält das Gerät an das Kassenterminal; die Daten werden per Funk über kurze Distanz übertragen. **Online-Bezahldienste** verknüpfen ein Nutzerkonto mit Bankkonto oder Karte, sodass man im Internet mit E-Mail-Adresse und Passwort zahlen kann. Bei **Echtzeitüberweisungen** ist das Geld in Sekunden beim Empfänger, auch zwischen Freunden per App.",
      "Diese Verfahren bieten echte **Möglichkeiten**: Sie sind schnell und bequem, funktionieren rund um die Uhr, und man braucht kein Bargeld. Viele Apps zeigen sofort jede Ausgabe an, was den Überblick erleichtern kann. Banken müssen bei Onlinezahlungen eine **starke Kundenauthentifizierung** verlangen: Man bestätigt eine Zahlung mit zwei unabhängigen Merkmalen, etwa dem Handy und einem Fingerabdruck oder einer PIN.",
      "Den Chancen stehen **Risiken** gegenüber. Beim **Phishing** versuchen Betrüger mit gefälschten E-Mails, Nachrichten oder Webseiten, Passwörter und Zugangsdaten abzugreifen. Seriöse Banken fragen nie per Mail oder Telefon nach PIN oder TAN. Digitale Zahlungen hinterlassen **Daten**: Anbieter erfahren, was, wann und wo du kaufst. Und weil man das Geld nicht mehr sieht, verliert man leichter den **Überblick**. Besonders verführerisch sind Angebote wie „Jetzt kaufen, später bezahlen“, bei denen sich kleine Beträge unbemerkt zu Schulden summieren.",
      "Sicher bezahlst du digital mit einigen Regeln: starke, unterschiedliche Passwörter und Zwei-Faktor-Bestätigung nutzen, Apps nur aus offiziellen Stores laden, Links in unerwarteten Nachrichten nicht anklicken, Kontoauszüge regelmäßig prüfen und Ausgabenlimits setzen. Wird eine Karte gestohlen oder ein Zugang missbraucht, solltest du ihn sofort sperren lassen.",
    ],
    terms: [
      term("Mobiles Bezahlen", "Bezahlen mit Smartphone oder Smartwatch, in denen eine Karte digital gespeichert ist."),
      term("Phishing", "Betrugsversuch, bei dem Täter mit gefälschten Nachrichten oder Seiten Zugangsdaten abfangen."),
      term("Starke Kundenauthentifizierung", "Bestätigung einer Zahlung mit zwei unabhängigen Merkmalen, etwa Gerät und PIN oder Fingerabdruck."),
    ],
    takeaway:
      "Digitales Bezahlen ist schnell und bequem, birgt aber Risiken wie Phishing, Datenspuren und den Verlust des Überblicks. Zwei-Faktor-Bestätigung, Vorsicht bei Links und regelmäßige Kontrolle machen es sicherer.",
    sourceIds: ["lp", "bsi-phishing", "bbk-zahlungsverkehr", "vz"],
    quiz: check(
      "Du bekommst eine SMS: „Ihr Konto wird gesperrt. Bestätigen Sie hier Ihre Zugangsdaten.“ Was solltest du tun?",
      "Den Link nicht öffnen und bei Zweifel die Bank über die bekannte offizielle Nummer anrufen.",
      ["Schnell die Daten eingeben, damit das Konto nicht gesperrt und die Karte nicht ungültig wird.", "Auf die SMS antworten und nachfragen, ob die Nachricht wirklich von der Bank stammt."],
      "Das ist ein typischer Phishing-Versuch mit Zeitdruck. Banken fragen nie per SMS nach Zugangsdaten. Eine Antwort bestätigt den Betrügern nur, dass die Nummer aktiv ist.",
    ),
    workshop: sort(
      "Chance oder Risiko?",
      "Ordne jede Eigenschaft digitaler Zahlungsverfahren ein.",
      ["Chance", "Risiko"],
      [
        ["Eine App zeigt sofort nach dem Bezahlen an, wie viel Geld noch auf dem Konto ist.", 0, "Sofortige Übersicht hilft beim Planen."],
        ["Ein Anbieter speichert, wann und wo du was gekauft hast.", 1, "Die Daten verraten viel über dein Leben."],
        ["Freunde schicken sich das Kinogeld per Echtzeitüberweisung in Sekunden.", 0, "Schnelle Zahlungen ohne Bargeld sind bequem."],
        ["Eine gefälschte Seite sieht aus wie dein Bezahldienst und fragt nach dem Passwort.", 1, "Phishing zielt auf deine Zugangsdaten."],
        ["„Jetzt kaufen, später zahlen“ lockt mit vielen kleinen Beträgen.", 1, "Viele kleine Raten summieren sich leicht zu Schulden."],
      ],
      "Digitale Verfahren sind Werkzeuge: Ihre Sicherheit hängt auch von deinem Verhalten ab.",
    ),
    casework: {
      title: "Der verlockende Link",
      story:
        "**Amira** bekommt eine E-Mail, die genau wie die ihres **Bezahldienstes** aussieht: „Ungewöhnliche Aktivität entdeckt! Melden Sie sich **innerhalb von 24 Stunden** an, sonst wird Ihr Konto gesperrt.“ Der Link führt zu einer Seite mit fast gleicher Adresse.",
      steps: [
        decide("Woran erkennt Amira den Betrugsversuch?", "Am künstlichen Zeitdruck und an der leicht veränderten Adresse.", "Daran, dass die E-Mail das richtige Logo zeigt.", "Logos lassen sich leicht kopieren. Zeitdruck und falsche Adressen sind typische Phishing-Merkmale."),
        decide("Was sollte sie tun?", "Die Mail nicht beantworten und die App oder Seite selbst direkt aufrufen.", "Sich über den Link anmelden, um nachzusehen, was los ist.", "Wer selbst die bekannte Adresse eingibt, landet sicher beim echten Anbieter."),
        decide("Was schützt Amira zusätzlich, falls ihr Passwort doch gestohlen wird?", "Die Zwei-Faktor-Bestätigung mit einem zweiten Merkmal", "Ein besonders kurzes, leicht zu merkendes Passwort", "Mit einem zweiten Merkmal kommt ein Täter trotz Passwort nicht weiter."),
      ],
      verdict: "Amira fällt nicht auf das Phishing herein. Sie prüft Absender und Adresse, nutzt den direkten Weg und hat zusätzlich einen zweiten Faktor eingerichtet.",
    },
    tasks: {
      1: write(
        "Erkläre zwei Möglichkeiten und zwei Risiken digitaler Zahlungsverfahren an Beispielen aus deinem Alltag.",
        ["Wie bezahlen deine Eltern oder du heute im Geschäft und online?", "Was könnte schiefgehen?"],
        "Eine Möglichkeit ist die Schnelligkeit: Mit dem Handy bezahle ich an der Kasse in einer Sekunde, ohne Kleingeld zu suchen. Eine zweite ist der Überblick, weil die App jede Ausgabe sofort anzeigt. Ein Risiko ist Phishing: Eine gefälschte Nachricht könnte mein Passwort abgreifen. Ein zweites Risiko ist, dass ich das Geld nicht mehr sehe und deshalb mehr ausgebe, besonders bei Angeboten wie später bezahlen.",
        ["Nennt zwei Möglichkeiten mit Beispiel", "Nennt zwei Risiken mit Beispiel", "Bezieht sich auf den eigenen Alltag"],
      ),
      2: write(
        "Deine jüngere Schwester bekommt ihr erstes Handy mit Bezahlfunktion. Formuliere für sie fünf Sicherheitsregeln und begründe jeweils kurz.",
        ["Denke an Passwörter, Links, Apps, Kontrolle und Limits.", "Was tut man, wenn etwas schiefgeht?"],
        "Erstens: Nutze ein eigenes, langes Passwort und die Zwei-Faktor-Bestätigung, damit ein gestohlenes Passwort allein nicht reicht. Zweitens: Klicke nie auf Links in unerwarteten Nachrichten, denn so arbeiten Phishing-Betrüger. Drittens: Lade Apps nur aus dem offiziellen Store, weil gefälschte Apps Daten stehlen können. Viertens: Schau einmal pro Woche in die Kontoübersicht, damit du Fehlbuchungen schnell bemerkst. Fünftens: Setze ein Ausgabenlimit und lass Karte oder Zugang bei Verlust sofort sperren, damit der Schaden klein bleibt.",
        ["Nennt fünf verständliche Regeln", "Begründet jede Regel", "Berücksichtigt das Vorgehen im Notfall"],
      ),
    },
  },

  {
    id: "ge-haushaltsplan",
    lb: 1,
    unit: "1.2",
    title: "Den Haushaltsplan mit der Tabellenkalkulation führen",
    intro: "Wohin verschwindet mein Taschengeld? Ein Haushaltsplan zeigt es und hilft dir, dein Sparziel zu erreichen.",
    paragraphs: [
      "Ein **Haushaltsplan** stellt die erwarteten **Einnahmen** eines Monats den geplanten **Ausgaben** gegenüber. Bei Jugendlichen sind Einnahmen etwa Taschengeld, Geldgeschenke oder ein Nebenjob. Bei den Ausgaben unterscheidet man **fixe Ausgaben**, die jeden Monat gleich anfallen und sich kurzfristig kaum ändern lassen, wie ein Handyvertrag oder der Vereinsbeitrag, von **variablen Ausgaben** wie Snacks, Kino oder Kleidung, die du selbst steuern kannst.",
      "Die Differenz aus Einnahmen und Ausgaben ist der **Überschuss**, den du sparen kannst, oder das **Defizit**, wenn du mehr ausgibst, als du einnimmst. Ein Defizit lässt sich nur durch Erspartes, geliehenes Geld oder durch Änderungen am Plan ausgleichen. Wer ein **Sparziel** hat, etwa 240 € für ein Fahrrad, plant die Sparrate so, dass das Ziel in einer sinnvollen Zeit erreicht wird: Bei 30 € im Monat sind es acht Monate.",
      "Ein **Tabellenkalkulationsprogramm** nimmt dir das Rechnen ab. Jede Zelle hat eine Adresse aus Spalte und Zeile, etwa B4. In Zellen stehen Zahlen, Texte oder **Formeln**, die immer mit einem Gleichheitszeichen beginnen. Die Formel =SUMME(B2:B3) addiert die Zellen B2 bis B3. Mit =B4-B8 ziehst du die Ausgaben von den Einnahmen ab; das Minuszeichen gibst du mit der normalen Tastatur ein. Änderst du eine Zahl, rechnet das Programm alle Formeln sofort neu. So kannst du ausprobieren, was passiert, wenn du weniger für Snacks ausgibst.",
      "Ein Haushaltsplan wirkt nur, wenn du ihn mit der Wirklichkeit vergleichst. Notiere deshalb einige Wochen lang alle Ausgaben, etwa in einem **Haushaltsbuch** oder einer App, und trage sie in eine Spalte „Ist“ neben die geplanten Werte. Wo Plan und Ist stark abweichen, liegt meist dein größtes Sparpotenzial. Plane außerdem einen kleinen Puffer für Unerwartetes ein.",
    ],
    terms: [
      term("Haushaltsplan", "Gegenüberstellung der erwarteten Einnahmen und geplanten Ausgaben für einen Zeitraum."),
      term("Fixe Ausgaben", "Ausgaben, die regelmäßig in gleicher Höhe anfallen und kurzfristig kaum veränderbar sind."),
      term("Variable Ausgaben", "Ausgaben, deren Höhe man selbst von Monat zu Monat steuern kann."),
      term("Formel", "Rechenanweisung in einer Zelle, die mit einem Gleichheitszeichen beginnt, etwa =SUMME(B2:B3)."),
    ],
    takeaway:
      "Ein Haushaltsplan stellt Einnahmen und fixe sowie variable Ausgaben gegenüber und zeigt Überschuss oder Defizit. Eine Tabellenkalkulation rechnet mit Formeln automatisch und macht sichtbar, wie Änderungen dein Sparziel beeinflussen.",
    sourceIds: ["lp", "vz", "schuldnerberatung"],
    lab: "budget",
    practice: "haushalt",
    quiz: check(
      "In Zelle B4 stehen die Einnahmen, in B8 die Ausgaben. Welche Formel berechnet den Überschuss?",
      "=B4-B8, denn der Überschuss ist Einnahmen minus Ausgaben.",
      ["=SUMME(B4:B8), denn dann sind alle Werte von Einnahmen bis Ausgaben enthalten.", "B4-B8 ohne Gleichheitszeichen, weil die Zellen schon Zahlen enthalten."],
      "Formeln beginnen mit einem Gleichheitszeichen. SUMME(B4:B8) würde Einnahmen und Ausgaben addieren und dazu alle Zellen dazwischen.",
    ),
    workshop: sort(
      "Einnahme, fixe oder variable Ausgabe?",
      "Ordne jeden Posten in Leas Haushaltsplan richtig ein.",
      ["Einnahme", "Fixe Ausgabe", "Variable Ausgabe"],
      [
        ["Das monatliche Taschengeld der Eltern von 40 €", 0, "Geld, das Lea zufließt, ist eine Einnahme."],
        ["Der Handyvertrag, der jeden Monat 15 € kostet", 1, "Der Betrag steht vertraglich fest."],
        ["Der Monatsbeitrag im Turnverein von 12 €", 1, "Auch der Vereinsbeitrag fällt regelmäßig gleich an."],
        ["Ausgaben für Snacks und Getränke nach der Schule", 2, "Wie viel Lea dafür ausgibt, entscheidet sie selbst."],
        ["Das Geld für Babysitten bei den Nachbarn", 0, "Ein Lohn ist eine Einnahme."],
      ],
      "Sparen kannst du kurzfristig vor allem bei den variablen Ausgaben.",
    ),
    casework: {
      title: "Leas Fahrradplan",
      story:
        "**Lea** bekommt **40 € Taschengeld** im Monat. Sie gibt **15 €** für ihren Handyvertrag, **30 €** für Freizeit und **15 €** für Snacks aus. Sie möchte ein gebrauchtes **Fahrrad für 240 €** kaufen.",
      steps: [
        decide("Wie hoch ist Leas monatliches Ergebnis?", "Ein Defizit von 20 €", "Ein Überschuss von 20 €", "40 − 15 − 30 − 15 = −20. Lea gibt 20 € mehr aus, als sie einnimmt."),
        decide("Wo kann Lea kurzfristig am leichtesten sparen?", "Bei Freizeit und Snacks, den variablen Ausgaben", "Beim Handyvertrag, den sie sofort kündigen kann", "Der Vertrag ist fix und läuft meist noch eine Weile; variable Ausgaben steuert sie selbst."),
        decide("Lea senkt Freizeit auf 5 € und Snacks auf 0 €. Wie lange dauert es bis zum Fahrrad?", "Zwölf Monate, denn sie spart 20 € im Monat.", "Sechs Monate, denn sie spart 40 € im Monat.", "40 − 15 − 5 − 0 = 20 € Überschuss; 240 : 20 = 12 Monate."),
      ],
      verdict: "Leas Plan zeigt ein Defizit. Erst wenn sie die variablen Ausgaben senkt, entsteht eine Sparrate, mit der sie ihr Ziel in einem Jahr erreicht.",
    },
    tasks: {
      1: write(
        "Beschreibe, wie du deinen eigenen Haushaltsplan in einer Tabellenkalkulation aufbauen würdest. Nenne die Zeilen und mindestens zwei Formeln.",
        ["Welche Einnahmen und Ausgaben hast du?", "Wie berechnest du Summen und Überschuss?"],
        "In Spalte A schreibe ich die Posten, in Spalte B die Beträge. In B2 und B3 stehen Taschengeld und das Geld vom Rasenmähen, in B4 die Formel =SUMME(B2:B3). Darunter kommen die Ausgaben: Handy als fixe Ausgabe, Freizeit und Snacks als variable Ausgaben. In B8 berechnet =SUMME(B5:B7) alle Ausgaben, und in B9 zeigt =B4-B8 meinen Überschuss. In einer weiteren Zeile teile ich mein Sparziel durch den Überschuss, um zu sehen, wie viele Monate ich brauche.",
        ["Beschreibt den Aufbau mit Einnahmen und Ausgaben", "Nennt mindestens zwei richtige Formeln", "Bezieht ein Sparziel ein"],
      ),
      2: write(
        "Lukas plant jeden Monat einen Überschuss von 25 €, hat aber nach drei Monaten nichts gespart. Erkläre mögliche Ursachen und wie er seinen Haushaltsplan verbessern kann.",
        ["Was zeigt ein Vergleich von Plan und Ist?", "Welche Ausgaben vergisst man leicht?"],
        "Wahrscheinlich hat Lukas mehr ausgegeben als geplant. Oft unterschätzt man kleine variable Ausgaben wie Getränke, Apps oder Spontankäufe, die sich über den Monat summieren. Vielleicht hat er auch unregelmäßige Ausgaben vergessen, etwa Geschenke oder einen Ausflug. Verbessern kann er seinen Plan, indem er einige Wochen jede Ausgabe in einer Ist-Spalte notiert und mit dem Plan vergleicht. Dort, wo die Abweichung am größten ist, setzt er ein Limit, und er plant einen kleinen Puffer für Unerwartetes ein. Außerdem kann er die Sparrate gleich zu Monatsbeginn zur Seite legen.",
        ["Nennt plausible Ursachen", "Schlägt den Plan-Ist-Vergleich vor", "Gibt konkrete Verbesserungen an"],
      ),
    },
  },

  {
    id: "ge-ueberschuldung",
    lb: 1,
    unit: "1.2",
    title: "Überschuldung: Ursachen, Folgen und Hilfe",
    intro: "Schulden zu haben ist nicht dasselbe wie überschuldet zu sein. Der Unterschied kann ein Leben verändern.",
    paragraphs: [
      "**Schulden** hat, wer Geld zurückzahlen muss, etwa für einen Kredit oder einen Ratenkauf. Das ist nicht automatisch schlimm, wenn die Raten sicher aus dem Einkommen bezahlt werden können. **Überschuldet** ist ein Haushalt erst, wenn die Einnahmen und das Vermögen über längere Zeit nicht ausreichen, um alle Zahlungsverpflichtungen zu erfüllen, obwohl er seine Lebenshaltung schon eingeschränkt hat.",
      "Die häufigsten **Ursachen** sind Ereignisse, die man nicht planen kann: **Arbeitslosigkeit**, **Krankheit**, **Trennung** oder eine gescheiterte Selbstständigkeit. Dazu kommen eine unwirtschaftliche Haushaltsführung und ein **Konsumverhalten**, das über die Verhältnisse geht. Bei jungen Menschen spielen Handyverträge, Ratenkäufe, Kreditkarten, In-App-Käufe und Angebote wie „Jetzt kaufen, später bezahlen“ eine große Rolle. Viele kleine Verpflichtungen sehen einzeln harmlos aus, binden aber zusammen einen großen Teil des Einkommens.",
      "Die **Folgen** sind schwer. Auf unbezahlte Rechnungen folgen Mahnungen und Mahngebühren, dann oft ein **Inkassounternehmen** und schließlich ein gerichtlicher Mahnbescheid. Mit einem Vollstreckungstitel kann ein Gerichtsvollzieher pfänden, auch ein Teil des Lohns. Ein negativer Eintrag bei einer **Auskunftei** wie der SCHUFA erschwert Mietverträge, Handyverträge und Kredite. Hinzu kommen Stress, Scham und Streit in der Familie.",
      "Wer in Schwierigkeiten gerät, sollte früh handeln: Post öffnen, alle Schulden auflisten und sich an eine kostenlose **Schuldnerberatung** wenden, etwa bei Verbraucherzentralen, Wohlfahrtsverbänden oder Kommunen. Als letzter Ausweg gibt es das Verbraucherinsolvenzverfahren, nach dem Restschulden erlassen werden können. Am besten ist Vorbeugung: Ratenkäufe auf das Nötigste beschränken, Gesamtkosten statt Monatsraten vergleichen und mit einem Haushaltsplan einen Puffer aufbauen.",
    ],
    terms: [
      term("Überschuldung", "Einkommen und Vermögen reichen dauerhaft nicht aus, um alle fälligen Zahlungen zu leisten."),
      term("Ratenkauf", "Kauf, bei dem der Preis in Teilbeträgen bezahlt wird, meist mit Zinsen und Gebühren."),
      term("Schuldnerberatung", "Kostenlose Beratung, die überschuldeten Menschen hilft, einen Weg aus den Schulden zu finden."),
      term("Auskunftei", "Unternehmen, das Daten über die Zahlungsfähigkeit von Personen sammelt und weitergibt, etwa die SCHUFA."),
    ],
    takeaway:
      "Überschuldet ist, wer seine Zahlungen dauerhaft nicht mehr leisten kann. Häufige Ursachen sind Arbeitslosigkeit, Krankheit und Trennung, aber auch Ratenkäufe und Verträge. Früh handeln, Schuldnerberatung nutzen und Gesamtkosten statt Raten vergleichen schützt.",
    sourceIds: ["lp", "vz-schulden", "schuldnerberatung"],
    lab: "kredit",
    practice: "ratenkauf",
    quiz: check(
      "Ab wann gilt ein Haushalt als überschuldet?",
      "Wenn Einkommen und Vermögen dauerhaft nicht ausreichen, um alle fälligen Zahlungen zu leisten.",
      ["Sobald er überhaupt einen Kredit aufgenommen hat, egal wie hoch er ist.", "Wenn er in einem Monat einmal eine Rechnung zu spät bezahlt hat."],
      "Schulden allein sind keine Überschuldung, solange die Raten sicher bezahlt werden. Eine einzelne verspätete Zahlung ist noch keine dauerhafte Zahlungsunfähigkeit.",
    ),
    workshop: sort(
      "Ursache, Folge oder Hilfe?",
      "Ordne jede Aussage zum Thema Überschuldung ein.",
      ["Ursache", "Folge", "Hilfe"],
      [
        ["Nach einem Unfall kann Herr Brandt monatelang nicht arbeiten.", 0, "Krankheit gehört zu den häufigsten Auslösern."],
        ["Ein Inkassobüro schreibt und verlangt zusätzliche Gebühren.", 1, "Inkasso folgt auf unbezahlte Rechnungen."],
        ["Eine Beraterin der Verbraucherzentrale listet mit Jana alle Schulden auf.", 2, "Schuldnerberatung verschafft Überblick und einen Plan."],
        ["Tim schließt drei Ratenkäufe und zwei Handyverträge gleichzeitig ab.", 0, "Viele Verpflichtungen zusammen überfordern das Budget."],
        ["Wegen eines negativen Eintrags bekommt Frau Lenz keinen Mietvertrag.", 1, "Auskunfteien beeinflussen Verträge und Kredite."],
      ],
      "Wer Ursachen kennt und Hilfe früh nutzt, verhindert die schweren Folgen.",
    ),
    casework: {
      title: "Viele kleine Raten",
      story:
        "**Kevin (19)** verdient als Azubi **900 € netto**. Er zahlt **60 €** für den Handyvertrag, **45 €** Rate für einen Fernseher, **35 €** für eine Spielkonsole, **80 €** Rate für ein Motorrad und hat **„später bezahlen“-Käufe** über 300 € offen. Dazu kommen **450 €** für Miete und Fahrkarte.",
      steps: [
        decide("Wie viel Geld bleibt Kevin nach den festen Zahlungen für Essen und alles andere?", "230 €", "530 €", "900 − 60 − 45 − 35 − 80 − 450 = 230 €; davon müssen auch die offenen 300 € bezahlt werden."),
        decide("Was ist das größte Risiko in Kevins Lage?", "Ein unerwartetes Ereignis, etwa eine Reparatur, bringt ihn in Zahlungsverzug.", "Dass seine Raten im Laufe der Zeit von selbst kleiner werden.", "Ohne Puffer reicht schon eine kleine Störung, um eine Rate nicht mehr zahlen zu können."),
        decide("Was sollte Kevin als Erstes tun?", "Alle Verpflichtungen auflisten und sich bei einer Schuldnerberatung beraten lassen.", "Einen neuen Kredit aufnehmen, um alle Raten auf einmal zu bezahlen.", "Ein neuer Kredit verschiebt das Problem meist nur; eine Beratung hilft, einen Plan zu machen."),
      ],
      verdict: "Kevin ist noch nicht überschuldet, aber gefährdet. Viele kleine Raten haben seinen Spielraum aufgezehrt. Ein Überblick und frühe Beratung helfen ihm, gegenzusteuern.",
    },
    tasks: {
      1: write(
        "Erkläre den Unterschied zwischen Verschuldung und Überschuldung und nenne drei häufige Ursachen für Überschuldung.",
        ["Wann sind Schulden noch kein Problem?", "Welche Ereignisse kann man nicht planen?"],
        "Verschuldet ist man, sobald man Geld zurückzahlen muss, etwa für einen Ratenkauf. Das ist kein Problem, solange man die Raten sicher aus dem Einkommen zahlen kann. Überschuldet ist man erst, wenn Einkommen und Vermögen dauerhaft nicht mehr ausreichen, um alle Zahlungen zu leisten. Häufige Ursachen sind Arbeitslosigkeit, Krankheit und Trennung. Bei jungen Menschen kommen viele gleichzeitige Ratenkäufe und Verträge dazu.",
        ["Unterscheidet beide Begriffe richtig", "Nennt drei Ursachen", "Bezieht das Konsumverhalten ein"],
      ),
      2: write(
        "Ein Elektronikmarkt wirbt: „Kaufe jetzt, zahle in 30 Tagen, oder in bequemen Raten!“ Beurteile die finanziellen Konsequenzen eines solchen Angebots für Jugendliche und junge Erwachsene.",
        ["Was passiert, wenn man in 30 Tagen nicht zahlen kann?", "Was zeigt dir das Labor über lange Laufzeiten?"],
        "Das Angebot ist bequem, verschiebt die Zahlung aber nur. Wer in 30 Tagen nicht zahlen kann, rutscht oft in eine Ratenzahlung mit Zinsen oder in Mahngebühren. Wer mehrere solcher Angebote nebeneinander nutzt, verliert leicht den Überblick, und der Spielraum im Budget schrumpft. Das Labor zeigt, dass eine lange Laufzeit die Monatsrate senkt, die Gesamtkosten aber erhöht. Für junge Menschen mit kleinem Einkommen ist das riskant, weil schon eine unerwartete Ausgabe zum Zahlungsverzug und zu einem Eintrag bei einer Auskunftei führen kann. Ich würde nur kaufen, was ich auch sofort bezahlen könnte.",
        ["Erklärt den Aufschub und seine Folgen", "Bezieht Gesamtkosten und Laufzeit ein", "Kommt zu einem begründeten Urteil"],
      ),
    },
  },
];
