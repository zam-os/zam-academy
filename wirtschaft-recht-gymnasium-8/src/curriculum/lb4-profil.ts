import type { Lesson } from "../model/types";
import { check, decide, sort, term, write } from "./lesson-parts";

/** Profilbereich am WWG: each class chooses from these areas. */
export const LB4: Lesson[] = [
  {
    id: "pr-zeitmanagement",
    lb: 4,
    unit: "4.1",
    title: "Persönliches Zeitmanagement",
    intro: "Auch Zeit ist knapp. Wer sie plant wie ein Budget, schafft mehr und hat trotzdem frei.",
    paragraphs: [
      "Zeit ist ein knappes Gut wie Geld: Jeder Tag hat 24 Stunden, und jede Stunde lässt sich nur einmal verwenden. Wer drei Stunden mit Videos verbringt, kann in dieser Zeit nicht lernen, trainieren oder Freunde treffen. Das sind die **Opportunitätskosten der Zeit**. **Zeitmanagement** heißt, die eigene Zeit bewusst zu planen, damit das Wichtige erledigt wird und genug Raum für Erholung bleibt.",
      "Ein bekanntes Werkzeug ist die **Eisenhower-Matrix**. Sie ordnet Aufgaben nach zwei Fragen: Ist sie **wichtig**, bringt sie mich also meinen Zielen näher? Ist sie **dringend**, muss sie also bald erledigt sein? Wichtiges und Dringendes erledigst du sofort, etwa das Lernen für die morgige Schulaufgabe. Wichtiges, nicht Dringendes planst du fest ein, etwa das Referat in drei Wochen. Dringendes, nicht Wichtiges gibst du ab oder erledigst es kurz. Was weder wichtig noch dringend ist, lässt du weg.",
      "Für die Tagesplanung hilft die **ALPEN-Methode**: **A**ufgaben aufschreiben, **L**änge jeder Aufgabe schätzen, **P**ufferzeiten einplanen, denn vieles dauert länger als gedacht, **E**ntscheidungen über Prioritäten treffen und am Abend **N**achkontrolle halten: Was hat geklappt, was verschiebe ich? Eine Faustregel lautet, nur etwa 60 % der Zeit fest zu verplanen.",
      "Typische **Zeitdiebe** sind das Smartphone mit ständigen Benachrichtigungen, fehlende Ordnung am Schreibtisch und das Aufschieben unangenehmer Aufgaben. Gegenmittel sind feste Lernzeiten, das Handy in einem anderen Raum und das Zerlegen großer Aufgaben in kleine Schritte. Zeitmanagement ist kein Selbstzweck: Es soll Stress verringern und Zeit für das schaffen, was dir wirklich wichtig ist.",
    ],
    terms: [
      term("Zeitmanagement", "Bewusstes Planen der eigenen Zeit, damit Wichtiges erledigt wird und Freiraum bleibt."),
      term("Eisenhower-Matrix", "Werkzeug, das Aufgaben nach Wichtigkeit und Dringlichkeit in vier Felder ordnet."),
      term("ALPEN-Methode", "Tagesplanung in fünf Schritten: Aufgaben, Länge, Puffer, Entscheidungen, Nachkontrolle."),
    ],
    takeaway:
      "Zeit ist knapp und hat Opportunitätskosten. Die Eisenhower-Matrix ordnet Aufgaben nach Wichtigkeit und Dringlichkeit, die ALPEN-Methode plant den Tag mit Puffer. Wer Zeitdiebe kennt, gewinnt Zeit für das Wesentliche.",
    sourceIds: ["lp"],
    quiz: check(
      "In welches Feld der Eisenhower-Matrix gehört ein Referat, das in drei Wochen fällig ist und zählt?",
      "Wichtig, aber nicht dringend: fest einplanen und rechtzeitig beginnen.",
      ["Wichtig und dringend: sofort heute Abend alles erledigen und dafür alles andere liegen lassen.", "Weder wichtig noch dringend: weglassen, weil der Termin noch lange hin ist."],
      "Das Referat zählt, ist also wichtig, aber noch nicht dringend. Wer es fest einplant, verhindert, dass es kurz vor dem Termin dringend wird.",
    ),
    workshop: sort(
      "Welches Feld der Eisenhower-Matrix?",
      "Ordne jede Aufgabe von Hannah dem passenden Feld zu.",
      ["Sofort erledigen", "Fest einplanen", "Abgeben oder kurz erledigen", "Weglassen"],
      [
        ["Für die Mathe-Schulaufgabe morgen früh lernen", 0, "Wichtig und dringend."],
        ["Für die Sprachprüfung in sechs Wochen jede Woche Vokabeln wiederholen", 1, "Wichtig, aber noch nicht dringend."],
        ["Auf eine Nachricht im Klassenchat zu einer Terminabfrage antworten", 2, "Dringend, aber nicht besonders wichtig: kurz erledigen."],
        ["Zum fünften Mal heute durch kurze Videos scrollen", 3, "Weder wichtig noch dringend."],
        ["Das Trikot für das Spiel heute Nachmittag waschen", 0, "Wichtig und dringend, weil das Spiel heute ist."],
      ],
      "Wer Wichtiges rechtzeitig plant, muss seltener in Hektik geraten.",
    ),
    casework: {
      title: "Ein voller Mittwoch",
      story:
        "**Can** hat am Mittwoch **Schule bis 15 Uhr**, **Fußballtraining von 17 bis 18:30 Uhr** und morgen eine **Englisch-Ex**. Außerdem will er ein neues Spiel ausprobieren und muss seiner Oma beim Einkaufen helfen. Er hat schon zwei Stunden am Handy verbracht.",
      steps: [
        decide("Was sollte Can zuerst einplanen?", "Die Vorbereitung auf die Englisch-Ex, weil sie wichtig und dringend ist.", "Das neue Spiel, weil es am meisten Spaß macht.", "Wichtiges und Dringendes kommt nach der Eisenhower-Matrix zuerst."),
        decide("Warum sollte Can einen Puffer einplanen?", "Weil viele Aufgaben länger dauern als geschätzt.", "Weil er dann mehr Zeit für das Handy hat.", "Pufferzeiten fangen Unerwartetes auf, so sieht es die ALPEN-Methode vor."),
        decide("Welcher Zeitdieb hat Can schon am meisten gekostet?", "Das Smartphone", "Das Fußballtraining", "Zwei Stunden am Handy fehlen jetzt für Lernen oder Erholung; das Training war fest geplant."),
      ],
      verdict: "Can lernt zuerst Englisch, plant Puffer und das Helfen bei der Oma ein. Das Spiel verschiebt er. Das Handy hat ihn schon zwei Stunden gekostet.",
    },
    tasks: {
      1: write(
        "Ordne fünf Aufgaben deiner kommenden Woche in die Eisenhower-Matrix ein und begründe die Einordnung.",
        ["Was zählt für deine Ziele, was drängt nur zeitlich?", "Was könntest du weglassen?"],
        "Wichtig und dringend ist das Lernen für den Biologie-Test am Donnerstag, das erledige ich sofort. Wichtig, aber nicht dringend ist das Training für den Lauf in einem Monat; ich plane drei feste Einheiten ein. Dringend, aber nicht so wichtig ist die Rückmeldung zur Klassenfeier, die schreibe ich kurz heute. Ebenfalls nicht wichtig, aber zeitgebunden ist eine Umfrage im Verein, die gebe ich an meinen Bruder ab. Weder wichtig noch dringend ist das Aufräumen meiner alten Fotos auf dem Handy; das lasse ich diese Woche weg.",
        ["Nennt fünf eigene Aufgaben", "Ordnet sie richtig in die vier Felder", "Begründet jede Einordnung"],
      ),
      2: write(
        "Beurteile, ob Zeitmanagement-Methoden Jugendlichen wirklich helfen oder nur zusätzlichen Druck erzeugen.",
        ["Was gewinnt man durch Planung?", "Wann wird Planung selbst zur Belastung?"],
        "Zeitmanagement hilft, wenn es richtig genutzt wird. Wer seine Aufgaben aufschreibt und nach Wichtigkeit ordnet, vergisst weniger, lernt rechtzeitig und hat dadurch weniger Stress vor Prüfungen. Methoden wie ALPEN planen Pufferzeiten ein und lassen bewusst Raum für Freizeit. Zum Druck wird Zeitmanagement, wenn man jede Minute verplant oder sich schlecht fühlt, sobald ein Plan nicht klappt. Mein Urteil: Die Methoden sind nützlich, solange sie Freiraum schaffen und nicht jede Stunde verplanen.",
        ["Nennt Vorteile", "Nennt Grenzen und Risiken", "Kommt zu einem begründeten Urteil"],
      ),
    },
  },

  {
    id: "pr-grafiken",
    lb: 4,
    unit: "4.1",
    title: "Grafiken zum Konsumverhalten auswerten und erstellen",
    intro: "Kreis, Säule oder Linie? Und wo beginnt die Achse? Grafiken können informieren oder täuschen.",
    paragraphs: [
      "Daten zum Konsumverhalten, etwa wofür Jugendliche ihr Geld ausgeben, werden oft als **Diagramm** dargestellt. Jeder Typ beantwortet eine andere Frage. Ein **Kreisdiagramm** zeigt Anteile an einem Ganzen, die zusammen 100 % ergeben. Ein **Säulen- oder Balkendiagramm** vergleicht Werte miteinander, etwa die Ausgaben verschiedener Altersgruppen. Ein **Liniendiagramm** zeigt Entwicklungen über die Zeit, etwa wie sich die Ausgaben für Streamingdienste in fünf Jahren verändern.",
      "Beim **Auswerten** gehst du in Schritten vor. Zuerst prüfst du das **Thema**, die **Quelle** und das **Jahr** der Daten. Dann klärst du, was die Achsen zeigen und in welcher **Einheit**: Euro, Prozent oder Anzahl? Wichtig ist der Unterschied zwischen **absoluten Zahlen**, etwa 30 € für Snacks, und **relativen Zahlen**, etwa 30 % des Taschengelds. Danach beschreibst du die wichtigsten Aussagen, etwa den größten Anteil oder den stärksten Anstieg, und erst zum Schluss deutest du sie.",
      "Grafiken können **manipulieren**. Der häufigste Trick ist eine **abgeschnittene Achse**: Beginnt die Hochachse nicht bei 0, sondern kurz unter dem kleinsten Wert, wirkt ein Anstieg von 8 € auf 9,20 €, also um 15 %, wie eine Verdopplung. Auch fehlende Quellen, ungleiche Abstände auf der Zeitachse, dreidimensionale Kreise, die vordere Stücke größer wirken lassen, und weggelassene Jahre verzerren das Bild.",
      "Selbst eine Grafik **erstellen** kannst du mit einer Tabellenkalkulation: Daten in eine Tabelle eintragen, markieren und einen passenden Diagrammtyp wählen. Gib der Grafik einen aussagekräftigen Titel, beschrifte die Achsen mit Einheiten, lass Säulen bei 0 beginnen und nenne die Quelle. So wird deine Grafik verständlich und ehrlich.",
    ],
    terms: [
      term("Kreisdiagramm", "Diagramm, das Anteile an einem Ganzen zeigt; alle Teile ergeben 100 %."),
      term("Liniendiagramm", "Diagramm, das die Entwicklung eines Werts über die Zeit zeigt."),
      term("Absolute Zahl", "Wert in seiner ursprünglichen Einheit, etwa Euro oder Stück."),
      term("Relative Zahl", "Wert im Verhältnis zu einem Ganzen, meist in Prozent angegeben."),
    ],
    takeaway:
      "Kreisdiagramme zeigen Anteile, Säulen vergleichen, Linien zeigen Entwicklungen. Wer Grafiken auswertet, prüft Quelle, Einheiten, absolute und relative Zahlen und den Beginn der Achse, denn abgeschnittene Achsen übertreiben Unterschiede.",
    sourceIds: ["lp", "destatis-vpi"],
    lab: "diagramm",
    quiz: check(
      "Ein Diagramm zeigt die Ausgaben für Snacks von Januar bis April. Die Achse beginnt bei 7 €. Was solltest du beachten?",
      "Die abgeschnittene Achse lässt den Anstieg viel größer wirken, als er tatsächlich ist.",
      ["Eine Achse ab 7 € zeigt die Werte genauer, deshalb wirkt der Anstieg realistischer.", "Der Beginn der Achse spielt keine Rolle, weil die Zahlen ja gleich bleiben."],
      "Die Zahlen bleiben gleich, ihr Bild nicht: Je höher die Achse beginnt, desto größer erscheinen Unterschiede. Prüfe deshalb immer den Achsenbeginn.",
    ),
    workshop: sort(
      "Welcher Diagrammtyp passt?",
      "Ordne jeder Fragestellung den am besten geeigneten Diagrammtyp zu.",
      ["Kreisdiagramm", "Säulendiagramm", "Liniendiagramm"],
      [
        ["Welchen Anteil seines Taschengelds gibt ein Schüler für Kleidung, Essen und Freizeit aus?", 0, "Anteile an einem Ganzen zeigt der Kreis."],
        ["Wie haben sich die Ausgaben für Handyverträge von 2015 bis 2025 entwickelt?", 2, "Eine Entwicklung über die Zeit zeigt die Linie."],
        ["Wie viel geben 12-, 14- und 16-Jährige im Monat aus?", 1, "Werte verschiedener Gruppen vergleicht man mit Säulen."],
        ["Wie verteilt sich der Umsatz einer Klassenfirma auf vier Produkte?", 0, "Auch das sind Anteile eines Ganzen."],
        ["Wie unterscheiden sich die Preise eines Kopfhörers bei fünf Händlern?", 1, "Ein direkter Vergleich passt zu Säulen oder Balken."],
      ],
      "Erst die Frage, dann der Diagrammtyp.",
    ),
    casework: {
      title: "Die Grafik in der Schülerzeitung",
      story:
        "Die **Schülerzeitung** titelt: „**Snack-Wahnsinn!** Ausgaben explodieren!“ Darunter zeigt ein Säulendiagramm die Snackausgaben der Klasse: **8,00 €** im Januar, **9,20 €** im April. Die Hochachse beginnt bei **7 €**. Eine Quelle fehlt.",
      steps: [
        decide("Wie stark sind die Ausgaben tatsächlich gestiegen?", "Um 15 %", "Um mehr als 100 %", "(9,20 − 8,00) : 8,00 · 100 = 15 %. Die Säulen wirken durch die Achse wie mehr als doppelt so hoch."),
        decide("Was ist der Hauptfehler der Grafik?", "Die abgeschnittene Achse übertreibt den Anstieg.", "Säulendiagramme dürfen nie Geldbeträge zeigen.", "Säulen sind für den Vergleich geeignet, sollten aber bei 0 beginnen."),
        decide("Was fehlt außerdem?", "Eine Quellenangabe, damit man die Daten prüfen kann", "Ein dreidimensionaler Effekt", "Ohne Quelle lässt sich nicht nachprüfen, woher die Zahlen stammen."),
      ],
      verdict: "Der Anstieg beträgt nur 15 %. Die abgeschnittene Achse und die fehlende Quelle machen aus einer moderaten Veränderung eine Schlagzeile.",
    },
    tasks: {
      1: write(
        "Beschreibe die Schritte, mit denen du eine Grafik zum Konsumverhalten auswertest, und wende sie auf die Daten des Labors an.",
        ["Womit beginnst du, womit hörst du auf?", "Welche Zahlen sind absolut, welche relativ?"],
        "Zuerst prüfe ich Thema, Quelle und Jahr. Im Labor geht es um erfundene Daten einer 8. Klasse, eine echte Quelle gibt es also nicht. Dann kläre ich Diagrammtyp und Einheiten: Die Verwendung des Taschengelds ist in Prozent angegeben, also relativ; die Snackausgaben sind in Euro, also absolut. Danach beschreibe ich die Hauptaussagen: Snacks haben mit 30 % den größten Anteil, und die wöchentlichen Snackausgaben steigen von 8 € auf 9,20 €, also um 15 %. Zum Schluss deute ich: Ein großer Teil des Taschengelds geht für Snacks drauf, und die Ausgaben steigen leicht.",
        ["Nennt die Auswertungsschritte in sinnvoller Reihenfolge", "Unterscheidet absolute und relative Zahlen", "Wendet die Schritte richtig auf die Daten an"],
      ),
      2: write(
        "Erstelle in Worten eine Anleitung für eine ehrliche Grafik zu deinen eigenen Ausgaben eines Monats in einer Tabellenkalkulation.",
        ["Welcher Diagrammtyp passt zu deiner Frage?", "Was gehört zu einer vollständigen Beschriftung?"],
        "Zuerst lege ich die Frage fest: Wofür gebe ich mein Geld aus? Dann trage ich in Spalte A die Kategorien und in Spalte B die Beträge eines Monats ein. Weil es um Anteile am Ganzen geht, wähle ich ein Kreisdiagramm; wollte ich mehrere Monate vergleichen, nähme ich Säulen. Ich gebe einen klaren Titel wie „Meine Ausgaben im Oktober“, beschrifte die Werte mit Prozent und Euro und nenne als Quelle mein Haushaltsbuch. Bei Säulen lasse ich die Achse bei 0 beginnen und verzichte auf 3D-Effekte, damit nichts verzerrt wird.",
        ["Wählt den Diagrammtyp begründet", "Nennt Titel, Beschriftung und Quelle", "Vermeidet Manipulationen ausdrücklich"],
      ),
    },
  },

  {
    id: "pr-geldgeschichte",
    lb: 4,
    unit: "4.1",
    title: "Die Geschichte des Geldes und seine Eigenschaften",
    intro: "Muscheln, Salz, Münzen, Scheine, Zahlen auf dem Handy: Geld hat sich immer wieder verwandelt.",
    paragraphs: [
      "Am Anfang stand der **Naturaltausch**: Ware gegen Ware. Weil das mühsam war, setzten sich Güter durch, die viele haben wollten und als Zwischentauschmittel annahmen. Dieses **Warengeld** waren je nach Region Muscheln, Salz, Vieh, Getreide oder Metallstücke. Es hatte einen eigenen Gebrauchswert, war aber oft unhandlich oder verderblich.",
      "In Kleinasien, im Königreich Lydien, prägte man vor über 2.600 Jahren die ersten **Münzen** aus Edelmetall. Der Stempel garantierte Gewicht und Echtheit, man musste das Metall also nicht mehr wiegen. In China gab es vor etwa tausend Jahren erstes **Papiergeld**, in Europa verbreiteten sich Banknoten seit dem 17. Jahrhundert. Lange konnte man Banknoten bei der Bank in Gold oder Silber eintauschen. Heute ist das nicht mehr so: Unser Geld hat keinen Materialwert, sondern gilt, weil alle darauf vertrauen.",
      "Mit Bankkonten entstand das **Buchgeld**, das nur als Zahl auf einem Konto existiert und per Überweisung oder Karte bewegt wird. Heute läuft ein großer Teil der Zahlungen digital, mit Karte, Smartphone oder Online-Bezahldiensten. Den Euro gibt es seit 1999 als Buchgeld und seit 2002 auch als Bargeld.",
      "Damit etwas als Geld taugt, braucht es bestimmte **Eigenschaften**. Es muss **allgemein anerkannt** sein, damit jeder es annimmt. Es muss **knapp** sein, sonst verliert es seinen Wert. Es soll **haltbar** sein und nicht verderben, **teilbar**, damit man kleine und große Beträge zahlen kann, **leicht transportierbar** und **schwer zu fälschen**. Muscheln waren haltbar, aber nicht fälschungssicher; Vieh war wertvoll, aber kaum teilbar. Moderne Banknoten haben viele Sicherheitsmerkmale, damit Fälschungen auffallen.",
    ],
    terms: [
      term("Warengeld", "Güter mit eigenem Gebrauchswert, die als Zwischentauschmittel dienten, etwa Salz oder Vieh."),
      term("Münzgeld", "Geprägte Metallstücke, deren Stempel Gewicht und Echtheit garantierte."),
      term("Papiergeld", "Banknoten, die heute keinen Materialwert haben und auf Vertrauen beruhen."),
      term("Geldeigenschaften", "Merkmale, die gutes Geld braucht: anerkannt, knapp, haltbar, teilbar, transportierbar, fälschungssicher."),
    ],
    takeaway:
      "Geld entwickelte sich vom Naturaltausch über Warengeld, Münzen und Papiergeld zum Buchgeld und zu digitalen Zahlungen. Gutes Geld ist allgemein anerkannt, knapp, haltbar, teilbar, leicht zu transportieren und schwer zu fälschen.",
    sourceIds: ["lp", "bbk-geldmuseum", "bbk-bargeld"],
    quiz: check(
      "Warum eignete sich Vieh schlecht als Geld, obwohl es sehr wertvoll war?",
      "Es ließ sich kaum teilen und schlecht transportieren.",
      ["Es war zu wenig wert, um damit größere Einkäufe bezahlen zu können.", "Es war zu leicht zu fälschen, weil jeder Kühe züchten konnte."],
      "Für kleine Beträge kann man keine halbe Kuh geben, und Herden lassen sich schlecht mitnehmen. Teilbarkeit und Transportierbarkeit sind wichtige Geldeigenschaften.",
    ),
    workshop: {
      kind: "timeline",
      title: "Vom Tausch zum digitalen Geld",
      instruction: "Bringe die Stufen der Geldgeschichte in die richtige Reihenfolge.",
      categories: [],
      entries: [
        { text: "Naturaltausch: Ein Bauer tauscht Getreide direkt gegen einen Krug.", target: 0, feedback: "Am Anfang steht der direkte Tausch." },
        { text: "Warengeld: Salz und Muscheln dienen als Zwischentauschmittel.", target: 1, feedback: "Begehrte Güter übernehmen die Rolle des Geldes." },
        { text: "Münzgeld: In Lydien prägt man Münzen aus Edelmetall.", target: 2, feedback: "Der Stempel garantiert Gewicht und Echtheit." },
        { text: "Papiergeld: Banknoten verbreiten sich, zuerst in China, später in Europa.", target: 3, feedback: "Papier ist leichter als Metall." },
        { text: "Buchgeld und digitales Bezahlen: Zahlen wechseln per Überweisung, Karte oder Smartphone das Konto.", target: 4, feedback: "Heute existiert der größte Teil des Geldes nur noch als Buchgeld." },
      ],
      conclusion: "Mit jeder Stufe wurde Geld leichter, handlicher und abstrakter, und umso wichtiger wurde das Vertrauen.",
    },
    casework: {
      title: "Ein neues Klassengeld",
      story:
        "Für den **Klassenflohmarkt** will die 8c ein eigenes **Klassengeld** einführen. Vorschläge: **Kastanien**, **selbst gebastelte Papierscheine** ohne Kennzeichen oder **nummerierte Gutscheine mit Stempel der Klassenleitung**.",
      steps: [
        decide("Warum taugen Kastanien schlecht als Klassengeld?", "Jeder kann im Herbst beliebig viele sammeln, sie sind nicht knapp.", "Sie sind zu schwer, um sie in die Schule zu bringen.", "Ein Geld, das jeder unbegrenzt besorgen kann, verliert seinen Wert."),
        decide("Was ist das Problem bei den Papierscheinen ohne Kennzeichen?", "Sie sind leicht zu fälschen.", "Sie lassen sich nicht in kleine Beträge teilen.", "Ohne Sicherheitsmerkmal kann jeder eigene Scheine basteln."),
        decide("Warum sind die gestempelten Gutscheine am besten geeignet?", "Sie sind knapp, schwer zu fälschen und von allen anerkannt.", "Weil sie aus besonders teurem Papier bestehen.", "Stempel und Nummer sichern Knappheit und Echtheit; die Anerkennung schafft Vertrauen."),
      ],
      verdict: "Gutes Geld braucht Knappheit, Fälschungssicherheit und Anerkennung. Die gestempelten Gutscheine erfüllen diese Eigenschaften am besten.",
    },
    tasks: {
      1: write(
        "Beschreibe die Entwicklung des Geldes in fünf Stufen und erkläre, welches Problem jede neue Stufe gelöst hat.",
        ["Was war am Naturaltausch mühsam?", "Was erleichterten Münzen, Papiergeld und Buchgeld?"],
        "Beim Naturaltausch musste man einen Partner finden, der genau das wollte, was man hatte. Warengeld wie Salz löste das, weil viele es annahmen, war aber oft unhandlich. Münzen mit Stempel lösten das Problem, das Metall jedes Mal wiegen zu müssen. Papiergeld war leichter zu transportieren als schwere Münzen. Buchgeld und digitales Bezahlen machen es möglich, große Beträge schnell über weite Entfernungen zu bezahlen, ohne Bargeld zu tragen.",
        ["Nennt fünf Stufen in richtiger Reihenfolge", "Nennt das gelöste Problem jeder Stufe", "Zeigt den roten Faden der Entwicklung"],
      ),
      2: write(
        "Prüfe anhand der Eigenschaften guten Geldes, ob ein ausgedachtes „Pausenpunkte-System“ der Schule, bei dem man Punkte für den Kiosk sammelt, als Geld taugen würde.",
        ["Gehe die Eigenschaften einzeln durch.", "Wer müsste das System anerkennen?"],
        "Allgemein anerkannt wären die Punkte nur am Schulkiosk, nicht außerhalb, sie wären also nur ein begrenztes Geld. Knapp wären sie, wenn die Schule kontrolliert, wie viele Punkte es gibt. Als digitale Punkte wären sie haltbar, gut teilbar und leicht zu übertragen. Schwer zu fälschen wären sie, wenn das System gut gesichert ist. Insgesamt erfüllt das System viele Eigenschaften, taugt aber nur innerhalb der Schule als Tauschmittel, weil die allgemeine Anerkennung fehlt.",
        ["Prüft mehrere Eigenschaften", "Erkennt die Bedeutung der allgemeinen Anerkennung", "Kommt zu einem begründeten Ergebnis"],
      ),
    },
  },

  {
    id: "pr-kredit",
    lb: 4,
    unit: "4.1",
    title: "Kredite aufnehmen und absichern",
    intro: "Ein Kredit erfüllt Wünsche sofort und kostet dafür Zinsen. Banken wollen außerdem wissen: Was, wenn du nicht zahlst?",
    paragraphs: [
      "Ein **Kredit** ist geliehenes Geld, das man mit **Zinsen** zurückzahlt. Es gibt verschiedene Formen. Beim **Dispositionskredit** darf man sein Girokonto bis zu einem Rahmen überziehen; er ist bequem, aber meist sehr teuer. Beim **Ratenkredit** leiht man einen festen Betrag und zahlt ihn in gleichen Monatsraten zurück, etwa für ein Auto. Bei der **Händlerfinanzierung** bietet ein Geschäft an, einen Kauf in Raten zu bezahlen. Für Häuser gibt es **Baufinanzierungen** über viele Jahre.",
      "Vergleichen lassen sich Kredite über den **effektiven Jahreszins**. Er enthält nicht nur den Sollzins, sondern auch bestimmte Kosten wie Bearbeitungsgebühren und muss genannt werden, sobald ein Anbieter mit Zahlen zu den Kosten eines Kredits wirbt. Wichtig ist außerdem der **Gesamtbetrag**: Eine lange Laufzeit senkt die Monatsrate, erhöht aber die Summe der Zinsen. Vor der Vergabe prüft die Bank die **Kreditwürdigkeit**: Einkommen, Ausgaben und Auskünfte, etwa bei der SCHUFA.",
      "Weil der Kreditgeber ein Risiko trägt, verlangt er oft **Kreditsicherheiten**. Bei der **Bürgschaft** verpflichtet sich eine andere Person, etwa ein Elternteil, für die Schulden einzustehen, wenn der Kreditnehmer nicht zahlt. Bei der **Sicherungsübereignung** wird das finanzierte Auto als Sicherheit an die Bank übereignet; der Käufer darf es nutzen, aber die Bank kann es verwerten, wenn er nicht zahlt. Bei Immobilien sichert eine **Grundschuld** im Grundbuch den Kredit ab.",
      "Für Minderjährige gelten strenge Regeln: Einen Kreditvertrag können sie nicht ohne die Zustimmung der Eltern und zusätzlich die Genehmigung des Familiengerichts schließen. Banken bieten Jugendlichen deshalb keine Kredite an, und Jugendkonten lassen sich nicht überziehen. Wer volljährig ist, sollte vor jedem Kredit fragen: Brauche ich das wirklich jetzt? Passt die Rate auch, wenn mein Einkommen sinkt? Und was kostet der Kredit insgesamt?",
    ],
    terms: [
      term("Dispositionskredit", "Möglichkeit, das Girokonto bis zu einem Rahmen zu überziehen; meist mit hohen Zinsen."),
      term("Effektiver Jahreszins", "Zinssatz, der die jährlichen Gesamtkosten eines Kredits einschließlich bestimmter Gebühren angibt."),
      term("Bürgschaft", "Verpflichtung einer anderen Person, für die Schulden einzustehen, wenn der Kreditnehmer nicht zahlt."),
      term("Sicherungsübereignung", "Eine Sache, etwa ein Auto, wird der Bank als Sicherheit übereignet, bleibt aber beim Kreditnehmer."),
    ],
    takeaway:
      "Kredite wie Dispo-, Raten- und Händlerkredit kosten Zinsen; vergleichen lassen sie sich über den effektiven Jahreszins und den Gesamtbetrag. Banken sichern sich mit Bürgschaft, Sicherungsübereignung oder Grundschuld ab. Minderjährige können Kredite nur mit gerichtlicher Genehmigung aufnehmen.",
    sourceIds: ["lp", "vz-schulden", "pangv", "bgb"],
    lab: "kredit",
    quiz: check(
      "Warum sollte man Kreditangebote über den effektiven Jahreszins vergleichen und nicht nur über den Sollzins?",
      "Weil der effektive Jahreszins auch bestimmte Kosten wie Gebühren enthält.",
      ["Weil der effektive Jahreszins immer niedriger ist als der Sollzins und Kredite günstiger macht.", "Weil der Sollzins nur für Händlerfinanzierungen gilt und nicht für Bankkredite."],
      "Der effektive Jahreszins zeigt die jährlichen Gesamtkosten und ist meist gleich hoch oder höher als der Sollzins. Er gilt für alle Verbraucherkredite.",
    ),
    workshop: sort(
      "Welche Kreditsicherheit liegt vor?",
      "Ordne jede Situation der passenden Kreditsicherheit zu.",
      ["Bürgschaft", "Sicherungsübereignung", "Grundschuld"],
      [
        ["Die Mutter unterschreibt, dass sie zahlt, falls ihr Sohn seinen Kredit nicht zurückzahlt.", 0, "Eine andere Person steht für die Schulden ein."],
        ["Die Bank wird Eigentümerin des finanzierten Autos, der Käufer fährt es aber.", 1, "Die Sache dient als Sicherheit."],
        ["Für den Hauskredit wird im Grundbuch ein Recht der Bank eingetragen.", 2, "Bei Immobilien sichert eine Grundschuld."],
        ["Ein Freund verpflichtet sich, für den Kredit einer Bekannten einzustehen.", 0, "Auch das ist eine Bürgschaft, oft ein großes Risiko für den Bürgen."],
      ],
      "Jede Sicherheit verringert das Risiko der Bank, verlagert es aber auf den Kreditnehmer oder einen Dritten.",
    ),
    casework: {
      title: "Das erste Auto",
      story:
        "**Sina (19)** macht eine Ausbildung und will ein gebrauchtes **Auto für 8.000 €** finanzieren. Die Bank bietet einen **Ratenkredit über 48 Monate** an und verlangt, dass ihr **Vater bürgt**. Außerdem soll das Auto der Bank **zur Sicherheit übereignet** werden.",
      steps: [
        decide("Was bedeutet die Bürgschaft für den Vater?", "Er muss zahlen, wenn Sina die Raten nicht mehr leisten kann.", "Er wird automatisch Eigentümer des Autos.", "Der Bürge haftet für fremde Schulden; Eigentümer wird die Bank."),
        decide("Wer ist Eigentümer des Autos während der Laufzeit?", "Die Bank, Sina darf es aber fahren.", "Sina, denn sie hat es gekauft.", "Bei der Sicherungsübereignung bleibt die Bank bis zur Rückzahlung Eigentümerin."),
        decide("Was sollte Sina vor der Unterschrift prüfen?", "Ob die Rate auch bei unerwarteten Ausgaben in ihr Budget passt und was der Kredit insgesamt kostet.", "Nur die Farbe und den Kilometerstand des Autos.", "Gesamtkosten und Belastbarkeit des Budgets entscheiden, ob der Kredit vernünftig ist."),
      ],
      verdict: "Der Kredit ist doppelt gesichert: durch die Bürgschaft des Vaters und die Sicherungsübereignung. Sina sollte Gesamtkosten und ihren Spielraum genau prüfen.",
    },
    tasks: {
      1: write(
        "Vergleiche Dispositionskredit und Ratenkredit und erkläre, für welchen Zweck welcher Kredit eher geeignet ist.",
        ["Wie hoch sind die Zinsen jeweils?", "Wie lange und wofür braucht man das Geld?"],
        "Beim Dispositionskredit überzieht man sein Girokonto bis zu einem vereinbarten Rahmen. Er ist flexibel und schnell verfügbar, kostet aber meist sehr hohe Zinsen. Er eignet sich nur, um kurzfristige Engpässe von wenigen Tagen oder Wochen zu überbrücken. Beim Ratenkredit leiht man einen festen Betrag und zahlt ihn in gleichen Raten über eine feste Laufzeit zurück. Er ist meist günstiger und planbar und eignet sich für größere Anschaffungen wie ein Auto. Für langfristige Wünsche ist der Dispo zu teuer.",
        ["Beschreibt beide Kreditformen", "Vergleicht Kosten und Flexibilität", "Ordnet passende Zwecke zu"],
      ),
      2: write(
        "Ein Freund bittet dich mit 18, für seinen Kredit zu bürgen. Beurteile das Risiko und begründe deine Entscheidung.",
        ["Was passiert, wenn der Freund nicht zahlt?", "Welche Fragen solltest du vorher stellen?"],
        "Eine Bürgschaft ist ein großes Risiko. Kann mein Freund die Raten nicht mehr zahlen, muss ich für seine Schulden einstehen, auch wenn ich selbst kaum Geld habe. Ich hätte dabei keinen Vorteil, denn das gekaufte Gut gehört ihm. Vorher müsste ich wissen, wie hoch der Kredit ist, wofür er gedacht ist, wie sicher sein Einkommen ist und ob er schon andere Schulden hat. Ich würde in der Regel nicht bürgen, höchstens für einen kleinen Betrag, den ich notfalls selbst zahlen könnte. Eine Freundschaft sollte nicht an fremden Schulden zerbrechen.",
        ["Erklärt das Risiko des Bürgen", "Nennt sinnvolle Prüffragen", "Trifft eine begründete Entscheidung"],
      ),
    },
  },

  {
    id: "pr-fertigungsverfahren",
    lb: 4,
    unit: "4.2",
    title: "Weitere Fertigungsverfahren: Baustellen- und Inselfertigung",
    intro: "Ein Schiff passt auf kein Fließband. Und manche Teams bauen ein Produkt lieber ganz selbst.",
    paragraphs: [
      "Neben Werkstatt- und Fließfertigung gibt es weitere **Fertigungsverfahren**. Bei der **Baustellenfertigung** ist das Produkt so groß oder ortsgebunden, dass es nicht bewegt werden kann. Deshalb kommen Arbeitskräfte, Maschinen und Material zum Werkstück. Typische Beispiele sind Häuser, Brücken, Schiffe, Windkraftanlagen oder große Flugzeuge.",
      "Die Baustellenfertigung ist meist **Einzelfertigung**. Sie verlangt eine sorgfältige Planung, weil viele Gewerke nacheinander und nebeneinander arbeiten: Beim Hausbau folgen Fundament, Mauern, Dach, Elektrik und Innenausbau aufeinander. Transport und Aufbau von Maschinen sind teuer, und Wetter oder Lieferverzögerungen können den ganzen Ablauf aufhalten.",
      "Bei der **Inselfertigung**, auch Gruppenfertigung genannt, bildet ein Team eine **Fertigungsinsel**: Alle Maschinen, die für ein Teil oder ein ganzes Produkt nötig sind, stehen dort beieinander. Die Gruppe stellt das Produkt weitgehend **vollständig** her und organisiert sich selbst: Sie verteilt die Aufgaben, wechselt Tätigkeiten und kontrolliert die Qualität. Die Inselfertigung verbindet die kurzen Wege der Fließfertigung mit mehr Flexibilität.",
      "Für die Beschäftigten hat die Inselfertigung Vorteile: Die Arbeit ist **abwechslungsreicher**, die Verantwortung größer, und man sieht das Ergebnis der eigenen Arbeit. Das wirkt Monotonie entgegen und steigert oft die Motivation und die Qualität. Dafür brauchen alle Gruppenmitglieder breitere Kenntnisse, und das Unternehmen muss mehrere gleichartige Maschinen anschaffen. Inselfertigung passt zu Variantenfertigung und mittleren Stückzahlen.",
    ],
    terms: [
      term("Baustellenfertigung", "Verfahren, bei dem Arbeitskräfte und Maschinen zum ortsgebundenen Produkt kommen."),
      term("Inselfertigung", "Eine Gruppe stellt in einer Fertigungsinsel mit allen nötigen Maschinen ein Produkt weitgehend selbst her."),
      term("Gewerk", "Fachbereich auf einer Baustelle, etwa Maurer-, Elektro- oder Dachdeckerarbeiten."),
    ],
    takeaway:
      "Bei der Baustellenfertigung kommen Menschen und Maschinen zum großen, ortsgebundenen Produkt. Bei der Inselfertigung stellt eine selbst organisierte Gruppe ein Produkt weitgehend vollständig her, was die Arbeit abwechslungsreicher macht.",
    sourceIds: ["lp"],
    quiz: check(
      "Welches Fertigungsverfahren nutzt eine Werft, die ein Kreuzfahrtschiff baut?",
      "Die Baustellenfertigung, weil das Schiff zu groß ist, um es zu bewegen.",
      ["Die Fließfertigung, weil viele Arbeitsschritte nacheinander im festen Takt ausgeführt werden.", "Die Inselfertigung, weil kleine Gruppen das Schiff jeweils allein fertigen."],
      "Beim Schiff kommen Arbeitskräfte und Maschinen zum Werkstück. Ein Fließband ist für so große Produkte unmöglich.",
    ),
    workshop: sort(
      "Welches Fertigungsverfahren?",
      "Ordne jedes Beispiel dem passenden Verfahren zu.",
      ["Werkstattfertigung", "Fließfertigung", "Baustellenfertigung", "Inselfertigung"],
      [
        ["Eine Brücke über einen Fluss wird vor Ort gebaut.", 2, "Das Produkt ist ortsgebunden."],
        ["Ein Team von sechs Personen montiert in seiner Zelle E-Bike-Motoren vollständig und prüft sie selbst.", 3, "Eine Gruppe fertigt weitgehend komplett."],
        ["Smartphones laufen im Minutentakt von Station zu Station.", 1, "Fester Takt, große Stückzahl."],
        ["In einer Schlosserei wandert jedes Werkstück zwischen Säge, Bohrerei und Schweißerei.", 0, "Gleichartige Maschinen in Werkstätten."],
        ["Ein Windrad wird auf einem Feld aus Einzelteilen errichtet.", 2, "Auch das Windrad entsteht an seinem Standort."],
      ],
      "Größe des Produkts, Stückzahl und Arbeitsorganisation bestimmen das passende Verfahren.",
    ),
    casework: {
      title: "Motoren im Team",
      story:
        "Ein Hersteller von **E-Bike-Motoren** fertigt bisher am **Fließband**, an dem jede Person nur einen Handgriff macht. Die Fehlerquote ist hoch, viele Beschäftigte klagen über **Langeweile**. Die Leitung überlegt, auf **Fertigungsinseln** umzustellen.",
      steps: [
        decide("Was ändert sich für die Beschäftigten in einer Fertigungsinsel?", "Sie bauen den Motor als Gruppe weitgehend komplett und wechseln Tätigkeiten.", "Sie arbeiten weiterhin jeder an nur einem Handgriff.", "Die Gruppe verantwortet das ganze Produkt und organisiert sich selbst."),
        decide("Warum könnte die Fehlerquote sinken?", "Die Gruppe kontrolliert ihre Qualität selbst und fühlt sich für das Ergebnis verantwortlich.", "Weil in Inseln keine Maschinen eingesetzt werden.", "Verantwortung und Überblick fördern Sorgfalt."),
        decide("Welchen Nachteil hat die Umstellung?", "Alle brauchen breitere Kenntnisse, und es sind mehr Maschinen nötig.", "Die Produkte werden automatisch teurer und schlechter.", "Schulungen und zusätzliche Maschinen kosten Geld."),
      ],
      verdict: "Fertigungsinseln machen die Arbeit abwechslungsreicher und können die Qualität verbessern. Dafür muss das Unternehmen in Schulungen und Maschinen investieren.",
    },
    tasks: {
      1: write(
        "Erkläre Baustellen- und Inselfertigung an je einem Beispiel und grenze sie von der Fließfertigung ab.",
        ["Wohin bewegt sich bei jedem Verfahren das Werkstück?", "Wer organisiert die Arbeit?"],
        "Bei der Baustellenfertigung bewegt sich das Werkstück nicht; Arbeitskräfte und Maschinen kommen zu ihm, wie beim Bau eines Mehrfamilienhauses. Bei der Inselfertigung baut eine Gruppe in einer Fertigungsinsel ein Produkt weitgehend selbst, etwa ein Team, das Schaltschränke komplett verdrahtet und prüft. Bei der Fließfertigung dagegen läuft das Werkstück im festen Takt von Station zu Station, und jede Person übernimmt nur einen kleinen Schritt. Die Inselfertigung gibt den Beschäftigten mehr Verantwortung, die Baustellenfertigung passt zu großen Einzelstücken.",
        ["Erklärt beide Verfahren mit Beispiel", "Grenzt sie von der Fließfertigung ab", "Nennt einen typischen Einsatzbereich"],
      ),
      2: write(
        "Beurteile, ob die Inselfertigung die Probleme der Arbeitsteilung lösen kann, die du aus LB 2 kennst.",
        ["Welche Probleme hatte die starke Arbeitsteilung?", "Was gewinnt und was verliert ein Unternehmen?"],
        "Starke Arbeitsteilung führt zu Monotonie, wenig Verantwortung und Abhängigkeit, wenn eine Station ausfällt. Die Inselfertigung mildert diese Probleme: Die Gruppe wechselt Tätigkeiten, was Monotonie verringert, sie verantwortet das ganze Produkt, und fällt jemand aus, können andere einspringen. Dafür verliert das Unternehmen einen Teil der Vorteile der Spezialisierung, und es braucht mehr Maschinen und Schulungen. Ich halte die Inselfertigung für eine gute Lösung bei mittleren Stückzahlen; bei Massenware bleibt die Fließfertigung wirtschaftlicher.",
        ["Nennt die Probleme der Arbeitsteilung", "Zeigt, welche die Inselfertigung löst", "Kommt zu einem abgewogenen Urteil"],
      ),
    },
  },

  {
    id: "pr-marketingformen",
    lb: 4,
    unit: "4.2",
    title: "Virales Marketing, Neuromarketing und Guerillamarketing",
    intro: "Ein Video geht um die Welt, ein Duft lockt in den Laden, ein Zebrastreifen wird zur Werbung. Neue Marketingformen überraschen.",
    paragraphs: [
      "Neben klassischer Werbung nutzen Unternehmen neue Formen des Marketings. Beim **viralen Marketing** soll sich eine Botschaft wie ein Virus von selbst verbreiten: Menschen teilen ein lustiges Video, machen bei einer Challenge mit oder schicken einen Link weiter. Das Unternehmen erreicht so mit wenig Geld sehr viele Menschen. Der Erfolg lässt sich aber kaum planen, und das Unternehmen verliert die Kontrolle darüber, wie seine Botschaft weitergetragen und kommentiert wird.",
      "Das **Neuromarketing** nutzt Erkenntnisse der Hirnforschung und Psychologie. Forscher messen etwa mit Blickverfolgung, wohin Menschen auf einer Verpackung schauen, oder untersuchen, welche Reize Gefühle auslösen. Unternehmen gestalten daraufhin Farben, Musik, Düfte, Logos und Ladengestaltung so, dass sie unbewusst positiv wirken. Kritiker fragen, wie weit es gehen darf, Kaufentscheidungen auf diese Weise zu beeinflussen.",
      "**Guerillamarketing** setzt auf ungewöhnliche, überraschende und meist günstige Aktionen, oft im öffentlichen Raum. Ein Beispiel ist ein Zebrastreifen, der wie eine Pommes-Packung bemalt ist, oder eine Bank an der Bushaltestelle, die wie eine Schokoladentafel aussieht. Die Überraschung sorgt dafür, dass Menschen Fotos machen und darüber reden, sodass die Aktion zusätzlich viral wird.",
      "Alle drei Formen haben **Chancen und Risiken**. Sie erzeugen Aufmerksamkeit, wo klassische Werbung übersehen wird, und sind oft günstig. Doch eine Aktion kann missverstanden werden und einen **Shitstorm** auslösen. Rechtliche Grenzen gelten auch hier: Wer öffentlichen Raum nutzen will, braucht oft eine Genehmigung, Sachbeschädigung ist verboten, und Werbung muss als Werbung erkennbar sein.",
    ],
    terms: [
      term("Virales Marketing", "Marketing, bei dem sich eine Botschaft durch Teilen und Weiterleiten von selbst verbreitet."),
      term("Neuromarketing", "Nutzung von Erkenntnissen der Hirnforschung, um Produkte und Werbung wirksamer zu gestalten."),
      term("Guerillamarketing", "Ungewöhnliche, überraschende und meist günstige Werbeaktionen, oft im öffentlichen Raum."),
    ],
    takeaway:
      "Virales Marketing setzt auf Teilen, Neuromarketing auf Erkenntnisse der Hirnforschung, Guerillamarketing auf Überraschung im öffentlichen Raum. Sie erzeugen viel Aufmerksamkeit mit wenig Geld, bergen aber Kontrollverlust, ethische Fragen und rechtliche Grenzen.",
    sourceIds: ["lp", "uwg", "vz"],
    quiz: check(
      "Ein Sportartikelhersteller stellt nachts überdimensionale Fußballschuhe auf einen Marktplatz. Am Morgen fotografieren viele Passanten die Aktion. Welche Marketingform ist das?",
      "Guerillamarketing, weil eine überraschende Aktion im öffentlichen Raum Aufmerksamkeit erzeugt.",
      ["Neuromarketing, weil Forscher dabei die Hirnströme der Passanten genau messen.", "Klassische Mediawerbung, weil das Unternehmen einen Fernsehspot dafür bezahlt."],
      "Überraschung im öffentlichen Raum ist typisch für Guerillamarketing. Werden die Fotos geteilt, kommt ein viraler Effekt hinzu.",
    ),
    workshop: sort(
      "Welche Marketingform?",
      "Ordne jede Maßnahme der passenden Marketingform zu.",
      ["Virales Marketing", "Neuromarketing", "Guerillamarketing"],
      [
        ["Eine Tanz-Challenge mit einem Song aus einem Werbespot verbreitet sich in sozialen Netzwerken.", 0, "Menschen verbreiten die Botschaft selbst weiter."],
        ["Ein Hersteller testet mit Blickverfolgung, welche Verpackung Kunden zuerst ansehen.", 1, "Messungen der Wahrnehmung sind Neuromarketing."],
        ["Ein Treppenaufgang am Bahnhof wird als riesiges Klavier mit Logo gestaltet.", 2, "Eine überraschende Aktion im öffentlichen Raum."],
        ["Ein Supermarkt wählt Musik und Duft so, dass Kunden länger bleiben.", 1, "Unbewusste Reize werden gezielt eingesetzt."],
        ["Ein kurzes, witziges Video wird bewusst so gestaltet, dass man es gerne teilt.", 0, "Ziel ist die Verbreitung durch die Zuschauer."],
      ],
      "Die neuen Formen ergänzen klassische Werbung, ersetzen sie aber selten ganz.",
    ),
    casework: {
      title: "Die Challenge geht schief",
      story:
        "Ein Getränkehersteller startet eine **Challenge**: Wer ein Video mit dem Getränk in einer gewagten Situation postet, kann gewinnen. Die Aktion verbreitet sich rasant. Dann tauchen Videos auf, in denen sich Jugendliche **in Gefahr bringen**, und es hagelt Kritik.",
      steps: [
        decide("Welche Marketingform hat der Hersteller genutzt?", "Virales Marketing", "Neuromarketing", "Die Botschaft verbreitet sich über das Teilen der Nutzer."),
        decide("Welches Risiko ist eingetreten?", "Kontrollverlust: Die Nutzer gestalten die Botschaft anders, als geplant.", "Die Aktion war zu teuer für das Unternehmen.", "Virale Aktionen lassen sich nicht steuern, sobald sie laufen."),
        decide("Wie sollte der Hersteller reagieren?", "Die Aktion stoppen, vor Gefahren warnen und sich öffentlich erklären.", "Die gefährlichsten Videos zusätzlich belohnen, um Aufmerksamkeit zu halten.", "Verantwortung zeigen begrenzt den Schaden für Menschen und Image."),
      ],
      verdict: "Virales Marketing brachte Reichweite, aber auch Kontrollverlust. Das Unternehmen muss Verantwortung übernehmen und die Aktion stoppen.",
    },
    tasks: {
      1: write(
        "Erkläre die drei Marketingformen an je einem eigenen Beispiel und nenne jeweils einen Vorteil für das Unternehmen.",
        ["Was hast du online oder in der Stadt schon gesehen?", "Warum sind diese Formen oft günstig?"],
        "Virales Marketing: Ein Hersteller veröffentlicht ein witziges Video über einen Hund, der Schuhe aussucht, und Tausende teilen es. Vorteil: große Reichweite fast ohne Werbekosten. Neuromarketing: Ein Supermarkt stellt Blumen an den Eingang und lässt ruhige Musik laufen, weil Studien zeigen, dass Kunden sich dann wohler fühlen. Vorteil: Kunden bleiben länger und kaufen mehr. Guerillamarketing: Ein Eishersteller lässt Gullydeckel wie Eiswaffeln bemalen. Vorteil: Die Überraschung bleibt im Gedächtnis und wird fotografiert.",
        ["Erklärt alle drei Formen", "Gibt eigene Beispiele", "Nennt je einen Vorteil"],
      ),
      2: write(
        "Beurteile das Neuromarketing aus Sicht von Verbraucherinnen und Verbrauchern. Ist es eine legitime Verkaufsmethode oder eine unzulässige Manipulation?",
        ["Was wissen Kunden über diese Einflüsse?", "Wo verläuft die Grenze zwischen Gestalten und Täuschen?"],
        "Neuromarketing ist zunächst eine Weiterentwicklung dessen, was Händler immer tun: Produkte ansprechend gestalten. Problematisch ist, dass es unbewusste Reize nutzt, die Kunden kaum bemerken und deshalb schwer kritisch prüfen können. Solange Farben, Musik oder Düfte nur eine angenehme Atmosphäre schaffen, halte ich das für legitim. Unzulässig wird es, wenn Schwächen gezielt ausgenutzt oder Menschen über ein Produkt getäuscht werden. Verbraucher schützen sich, indem sie die Methoden kennen, vor dem Einkauf einen Plan machen und Preise vergleichen.",
        ["Beschreibt die Wirkungsweise", "Wägt Legitimität und Manipulation ab", "Kommt zu einem begründeten Urteil mit Folgerung"],
      ),
    },
  },

  {
    id: "pr-jugendschutz",
    lb: 4,
    unit: "4.3",
    title: "Das Jugendschutzgesetz",
    intro: "Disco bis Mitternacht, Bier mit den Eltern, Film ab 16: Das Jugendschutzgesetz regelt, was in der Öffentlichkeit erlaubt ist.",
    paragraphs: [
      "Das **Jugendschutzgesetz** (JuSchG) schützt Kinder und Jugendliche in der **Öffentlichkeit** vor Gefahren für ihre Entwicklung und Gesundheit. **Kinder** sind nach dem Gesetz Personen unter 14 Jahren, **Jugendliche** sind 14 bis 17 Jahre alt. Das Gesetz richtet sich vor allem an **Erwachsene**: Gastwirte, Verkäufer, Veranstalter und Kinobetreiber müssen die Regeln einhalten und dürfen sich bei Zweifeln den Ausweis zeigen lassen. Wer gegen das Gesetz verstößt, riskiert ein Bußgeld. Die Jugendlichen selbst werden nicht bestraft.",
      "Beim **Alkohol** unterscheidet das Gesetz. **Bier, Wein und Sekt** dürfen an Jugendliche ab 16 Jahren abgegeben werden. Mit 14 und 15 Jahren ist das nur erlaubt, wenn eine **personensorgeberechtigte Person**, meist ein Elternteil, dabei ist. **Branntwein** und Getränke, die Branntwein enthalten, etwa Mixgetränke mit Schnaps, gibt es erst ab 18 Jahren. **Tabakwaren** und andere nikotinhaltige Produkte, auch **E-Zigaretten** und **E-Shishas**, dürfen erst an Volljährige abgegeben werden, und das Rauchen in der Öffentlichkeit ist Kindern und Jugendlichen nicht gestattet.",
      "Auch für **Veranstaltungen** gibt es Regeln. Öffentliche **Tanzveranstaltungen** wie Discos dürfen Kinder und Jugendliche unter 16 Jahren nur in Begleitung einer personensorgeberechtigten oder erziehungsbeauftragten Person besuchen; ab 16 Jahren ist der Besuch ohne Begleitung bis 24 Uhr erlaubt. Ausnahmen gelten etwa für Veranstaltungen anerkannter Träger der Jugendhilfe. Im **Kino** dürfen Kinder und Jugendliche nur Filme sehen, die für ihr Alter freigegeben sind; bei Filmen ab 12 dürfen Kinder ab 6 Jahren in Begleitung der Eltern hinein. Ohne Begleitung muss die Vorstellung für Jugendliche unter 16 um 22 Uhr, ab 16 um 24 Uhr beendet sein.",
      "Für **Filme und Spiele** auf Datenträgern und online gibt es **Altersfreigaben** der FSK und der USK, etwa „ab 12“ oder „ab 16“. Händler dürfen solche Medien nur an Personen des freigegebenen Alters verkaufen. Das Gesetz will nicht bevormunden, sondern Schutzräume schaffen, solange junge Menschen Risiken noch nicht voll einschätzen können.",
    ],
    terms: [
      term("Jugendschutzgesetz", "Bundesgesetz, das Kinder und Jugendliche in der Öffentlichkeit und vor ungeeigneten Medien schützt."),
      term("Personensorgeberechtigte Person", "Person, der die elterliche Sorge zusteht, meist Mutter oder Vater."),
      term("Erziehungsbeauftragte Person", "Volljährige Person, die mit Zustimmung der Eltern Erziehungsaufgaben übernimmt, etwa bei einem Discobesuch."),
      term("Altersfreigabe", "Kennzeichnung von Filmen und Spielen durch FSK oder USK, ab welchem Alter sie geeignet sind."),
    ],
    law: [
      {
        ref: "§ 9 JuSchG",
        text: "Bier, Wein und Sekt dürfen an unter 16-Jährige nicht abgegeben werden, außer Jugendliche ab 14 sind mit einer personensorgeberechtigten Person unterwegs. Andere alkoholische Getränke sind für alle unter 18 verboten.",
        url: "https://www.gesetze-im-internet.de/juschg/__9.html",
      },
      {
        ref: "§ 5 JuSchG",
        text: "Ohne Begleitung dürfen unter 16-Jährige keine öffentliche Tanzveranstaltung besuchen; ab 16 ist der Besuch ohne Begleitung bis 24 Uhr erlaubt.",
        url: "https://www.gesetze-im-internet.de/juschg/__5.html",
      },
    ],
    takeaway:
      "Das Jugendschutzgesetz verpflichtet vor allem Erwachsene. Bier und Wein gibt es ab 16 oder mit 14 und 15 in Begleitung der Eltern, Schnaps, Tabak und E-Zigaretten erst ab 18. Discos sind ab 16 bis 24 Uhr ohne Begleitung erlaubt, Filme und Spiele nach Altersfreigabe.",
    sourceIds: ["lp", "juschg", "fsk", "usk"],
    lab: "jugendschutz",
    quiz: check(
      "Ein 17-Jähriger möchte in Begleitung seines Vaters in einer Bar einen Cocktail mit Rum trinken. Ist das erlaubt?",
      "Nein, Getränke mit Branntwein sind für alle unter 18 verboten, auch in Begleitung der Eltern.",
      ["Ja, weil der Vater dabei ist und damit die volle Verantwortung für den Sohn übernimmt.", "Ja, weil Jugendliche ab 16 Jahren grundsätzlich jede Art von Alkohol trinken dürfen."],
      "Die Ausnahme mit Begleitung gilt nur für Bier, Wein und Sekt bei 14- und 15-Jährigen. Branntwein bleibt bis 18 verboten.",
    ),
    workshop: sort(
      "Erlaubt oder nicht erlaubt?",
      "Ordne jede Situation nach dem Jugendschutzgesetz ein.",
      ["Erlaubt", "Nicht erlaubt"],
      [
        ["Eine 16-Jährige bestellt in einer Gaststätte ein Radler.", 0, "Bier und Biermischgetränke sind ab 16 erlaubt."],
        ["Ein 15-Jähriger kauft im Kiosk eine E-Zigarette.", 1, "Nikotinhaltige Produkte gibt es erst ab 18."],
        ["Ein 14-Jähriger trinkt beim Essen im Restaurant ein Glas Wein in Begleitung seiner Mutter.", 0, "Mit 14 und 15 ist das in Begleitung einer personensorgeberechtigten Person erlaubt."],
        ["Eine 15-Jährige geht allein bis 23 Uhr in eine öffentliche Disco.", 1, "Unter 16 ist der Discobesuch ohne Begleitung nicht erlaubt."],
        ["Ein 16-Jähriger besucht allein eine Disco bis 24 Uhr.", 0, "Ab 16 ist das ohne Begleitung bis 24 Uhr erlaubt."],
      ],
      "Alter, Art des Getränks und Begleitung entscheiden.",
    ),
    casework: {
      title: "Der Kinoabend",
      story:
        "**Mara (15)** und **Luis (16)** wollen ins Kino. Der Film ist **ab 16** freigegeben und endet um **21:30 Uhr**. Danach wollen sie in einer Bar noch etwas trinken. Maras Mutter bietet an, mitzukommen.",
      steps: [
        decide("Darf Luis den Film allein sehen?", "Ja, er ist 16, und die Vorstellung endet vor 24 Uhr.", "Nein, Jugendliche dürfen Filme ab 16 nur mit den Eltern sehen.", "Für Luis passt die Altersfreigabe, und die Uhrzeit liegt im erlaubten Rahmen."),
        decide("Darf Mara den Film in Begleitung ihrer Mutter sehen?", "Nein, die Altersfreigabe ab 16 gilt auch in Begleitung.", "Ja, mit der Mutter darf sie jeden Film sehen.", "Nur bei Filmen ab 12 gibt es eine Ausnahme für Begleitung."),
        decide("Was darf Mara danach in der Bar in Begleitung ihrer Mutter trinken?", "Bier, Wein oder Sekt, aber keine Getränke mit Branntwein", "Alles, was auch ihre Mutter trinkt", "Mit 14 und 15 erlaubt die Begleitung nur die leichteren alkoholischen Getränke."),
      ],
      verdict: "Luis darf den Film sehen, Mara nicht, auch nicht mit ihrer Mutter. In der Bar darf Mara in Begleitung Bier oder Wein trinken, aber keinen Schnaps.",
    },
    tasks: {
      1: write(
        "Erkläre die Regeln des Jugendschutzgesetzes zu Alkohol, Tabak und Discobesuch und gib zu jeder Regel ein Beispiel.",
        ["Welche Altersgrenzen gibt es bei 14, 16 und 18?", "Welche Rolle spielt die Begleitung?"],
        "Bier, Wein und Sekt dürfen Jugendliche ab 16 trinken; mit 14 und 15 nur in Begleitung der Eltern, etwa ein Glas Wein beim Familienessen. Branntwein und Mixgetränke mit Schnaps sind bis 18 verboten, auch in Begleitung. Tabak und E-Zigaretten dürfen erst an Volljährige verkauft werden, ein 17-Jähriger bekommt im Kiosk also keine. In eine öffentliche Disco dürfen unter 16-Jährige nur mit Begleitung, ab 16 allein bis 24 Uhr. Das Gesetz verpflichtet vor allem Wirte und Verkäufer.",
        ["Erklärt die Regeln zu Alkohol", "Erklärt die Regeln zu Tabak und Disco", "Gibt passende Beispiele"],
      ),
      2: write(
        "„Das Jugendschutzgesetz bevormundet Jugendliche.“ Nimm Stellung zu dieser Aussage und beziehe die Schutzfunktion des Rechts ein.",
        ["Wovor sollen die Regeln schützen?", "An wen richtet sich das Gesetz eigentlich?"],
        "Ich teile die Aussage nur teilweise. Das Gesetz schränkt Jugendliche ein, etwa beim Alkohol oder beim Discobesuch. Es erfüllt aber die Schutzfunktion des Rechts: Alkohol und Nikotin schaden dem wachsenden Körper besonders, und junge Menschen schätzen Risiken oft noch nicht voll ein. Außerdem richtet sich das Gesetz vor allem an Erwachsene wie Wirte und Verkäufer, Jugendliche selbst werden nicht bestraft. Die Begleitung durch Eltern eröffnet Spielräume. Ich sehe darin eher einen Schutzraum als eine Bevormundung.",
        ["Nimmt Stellung", "Bezieht die Schutzfunktion ein", "Berücksichtigt, wen das Gesetz verpflichtet"],
      ),
    },
  },

  {
    id: "pr-gericht",
    lb: 4,
    unit: "4.3",
    title: "Strafverfahren und Zivilprozess",
    intro: "Wie läuft ein Prozess ab? Wer sitzt wo im Gerichtssaal? Ein Blick auf zwei Verfahren.",
    paragraphs: [
      "Ein **Strafverfahren** beginnt mit dem **Ermittlungsverfahren**. Polizei und Staatsanwaltschaft sammeln Beweise, vernehmen Zeugen und den **Beschuldigten**. Reichen die Beweise, erhebt die Staatsanwaltschaft **Anklage**; sonst stellt sie das Verfahren ein. Im **Zwischenverfahren** prüft das Gericht, ob die Anklage zugelassen wird. Im **Hauptverfahren** findet die **Hauptverhandlung** statt: Die Staatsanwältin verliest die Anklage, der **Angeklagte** kann sich äußern, Zeugen werden gehört und Beweise geprüft. Nach den Schlussvorträgen hat der Angeklagte das letzte Wort, dann verkündet das Gericht das **Urteil**.",
      "Im Strafverfahren gelten wichtige **Grundsätze**. Bis zur Verurteilung gilt die **Unschuldsvermutung**, und im Zweifel ist für den Angeklagten zu entscheiden. Der Angeklagte muss sich nicht selbst belasten und darf einen **Verteidiger** haben. Bei Jugendlichen verhandelt das **Jugendgericht**, und die Verhandlung ist nicht öffentlich, um sie zu schützen. Die Jugendgerichtshilfe berichtet über die Lebensumstände des Jugendlichen. Gegen ein Urteil kann man **Rechtsmittel** wie Berufung oder Revision einlegen.",
      "Ein **Zivilprozess** beginnt nicht von Amts wegen, sondern mit einer **Klage**: Der **Kläger** reicht eine Klageschrift beim Gericht ein, in der er sagt, was er vom **Beklagten** verlangt. Bei Streitwerten bis 10.000 € ist in der Regel das **Amtsgericht** zuständig, darüber das **Landgericht**, wo man einen Anwalt braucht. Der Beklagte antwortet mit der Klageerwiderung. Vor der mündlichen Verhandlung findet meist eine **Güteverhandlung** statt, in der das Gericht eine Einigung versucht.",
      "Kommt es zu keiner Einigung, folgen die mündliche Verhandlung und die **Beweisaufnahme**, etwa durch Zeugen oder Gutachter. Am Ende steht ein **Urteil** oder ein **Vergleich**, bei dem beide Seiten nachgeben. Wer verliert, trägt in der Regel die Kosten. Verhandlungen vor Erwachsenengerichten sind meist **öffentlich**: Bei einem Besuch einer Gerichtsverhandlung kannst du die Abläufe selbst beobachten.",
    ],
    terms: [
      term("Ermittlungsverfahren", "Erster Abschnitt des Strafverfahrens, in dem Polizei und Staatsanwaltschaft Beweise sammeln."),
      term("Unschuldsvermutung", "Jeder gilt als unschuldig, bis seine Schuld in einem Urteil festgestellt ist."),
      term("Klage", "Antrag an das Gericht, mit dem ein Zivilprozess beginnt."),
      term("Vergleich", "Einigung der Parteien vor Gericht, bei der beide Seiten nachgeben."),
    ],
    takeaway:
      "Ein Strafverfahren läuft vom Ermittlungs- über das Zwischen- zum Hauptverfahren; es gilt die Unschuldsvermutung. Ein Zivilprozess beginnt mit der Klage, oft mit einer Güteverhandlung, und endet mit Urteil oder Vergleich. Bis 10.000 € ist meist das Amtsgericht zuständig.",
    sourceIds: ["lp", "stpo", "zpo", "jgg"],
    quiz: check(
      "Wodurch beginnt ein Zivilprozess?",
      "Durch die Klage einer Partei, die etwas von einer anderen verlangt.",
      ["Durch die Anklage der Staatsanwaltschaft, die vorher von sich aus ermittelt hat.", "Durch eine Festnahme der Polizei, nachdem ein Zeuge eine Straftat gemeldet hat."],
      "Im Zivilrecht entscheidet der Betroffene selbst, ob er klagt. Anklage und Ermittlungen gehören zum Strafverfahren.",
    ),
    workshop: {
      kind: "timeline",
      title: "Der Ablauf eines Strafverfahrens",
      instruction: "Bringe die Schritte eines Strafverfahrens in die richtige Reihenfolge.",
      categories: [],
      entries: [
        { text: "Die Polizei nimmt eine Anzeige auf und sichert Spuren.", target: 0, feedback: "Ein Verdacht löst die Ermittlungen aus." },
        { text: "Die Staatsanwaltschaft wertet die Beweise aus und erhebt Anklage.", target: 1, feedback: "Ohne ausreichenden Verdacht würde sie einstellen." },
        { text: "Das Gericht prüft im Zwischenverfahren, ob es die Anklage zulässt.", target: 2, feedback: "Erst dann kommt es zur Hauptverhandlung." },
        { text: "In der Hauptverhandlung werden Zeugen gehört und Beweise geprüft.", target: 3, feedback: "Hier wird der Fall öffentlich verhandelt, bei Jugendlichen nicht öffentlich." },
        { text: "Nach dem letzten Wort des Angeklagten verkündet das Gericht das Urteil.", target: 4, feedback: "Gegen das Urteil sind Rechtsmittel möglich." },
      ],
      conclusion: "Jeder Schritt schützt die Rechte des Beschuldigten und sorgt für ein faires Verfahren.",
    },
    casework: {
      title: "Streit um ein gebrauchtes Handy",
      story:
        "**Frau Krüger** hat ein gebrauchtes Handy für **450 €** verkauft. Der Käufer **Herr Wolf** zahlt nicht, weil das Display angeblich schon kaputt war. Frau Krüger will ihr Geld und geht vor Gericht.",
      steps: [
        decide("Welches Gericht ist zuständig?", "Das Amtsgericht, weil der Streitwert unter 10.000 € liegt.", "Das Landgericht, weil es um Geld geht.", "Bei Streitwerten bis 10.000 € ist in der Regel das Amtsgericht zuständig."),
        decide("Wer ist in diesem Prozess Kläger?", "Frau Krüger", "Die Staatsanwaltschaft", "Wer etwas verlangt, klagt; die Staatsanwaltschaft ist nur im Strafverfahren beteiligt."),
        decide("Was versucht das Gericht meist zuerst?", "Eine gütliche Einigung in einer Güteverhandlung", "Herrn Wolf sofort zu einer Strafe zu verurteilen", "Im Zivilprozess geht der Verhandlung meist eine Güteverhandlung voraus; Strafen gibt es hier nicht."),
      ],
      verdict: "Frau Krüger klagt vor dem Amtsgericht. Das Gericht versucht zuerst eine Einigung; gelingt sie nicht, klärt die Beweisaufnahme, ob das Display schon kaputt war.",
    },
    tasks: {
      1: write(
        "Vergleiche Strafverfahren und Zivilprozess anhand von Beginn, Beteiligten und Ende.",
        ["Wer bringt das Verfahren ins Rollen?", "Womit endet es?"],
        "Ein Strafverfahren beginnt von Amts wegen, wenn Polizei oder Staatsanwaltschaft von einer Straftat erfahren; ein Zivilprozess beginnt erst, wenn eine Partei Klage erhebt. Im Strafverfahren stehen sich Staatsanwaltschaft und Angeklagter gegenüber, oft mit Verteidiger; im Zivilprozess Kläger und Beklagter. Das Strafverfahren endet mit einem Urteil, das etwa eine Strafe oder einen Freispruch ausspricht, oder mit einer Einstellung. Der Zivilprozess endet mit einem Urteil oder einem Vergleich, und die unterlegene Seite trägt meist die Kosten.",
        ["Vergleicht den Beginn", "Vergleicht die Beteiligten", "Vergleicht das Ende"],
      ),
      2: write(
        "Bereite einen Besuch einer öffentlichen Gerichtsverhandlung vor: Formuliere vier Beobachtungsaufgaben und erkläre, warum Verhandlungen gegen Jugendliche nicht öffentlich sind.",
        ["Worauf willst du im Saal achten?", "Wen schützt die Nichtöffentlichkeit?"],
        "Erstens beobachte ich, wer im Saal welche Rolle hat und wo er sitzt: Richterin, Staatsanwalt, Angeklagter, Verteidiger, Zeugen. Zweitens notiere ich, in welcher Reihenfolge die Verhandlung abläuft, von der Anklage bis zum Urteil. Drittens achte ich darauf, wie das Gericht die Rechte des Angeklagten wahrt, etwa ob er sich äußern darf und das letzte Wort hat. Viertens halte ich fest, wie das Urteil begründet wird. Verhandlungen gegen Jugendliche sind nicht öffentlich, damit ihre Entwicklung geschützt wird und ein Fehler sie nicht dauerhaft in der Öffentlichkeit brandmarkt.",
        ["Formuliert vier sinnvolle Beobachtungsaufgaben", "Bezieht Rollen und Ablauf ein", "Begründet die Nichtöffentlichkeit bei Jugendlichen"],
      ),
    },
  },

  {
    id: "pr-jugendarbeit",
    lb: 4,
    unit: "4.3",
    title: "Jobben als Minderjähriger: das Jugendarbeitsschutzgesetz",
    intro: "Zeitungen austragen, babysitten, im Ferienjob jobben: Was darfst du mit 13, 15 oder 17?",
    paragraphs: [
      "Das **Jugendarbeitsschutzgesetz** (JArbSchG) schützt junge Menschen vor Arbeit, die ihrer Gesundheit, Entwicklung oder Schule schadet. Es unterscheidet **Kinder**, die noch nicht 15 Jahre alt sind, und **Jugendliche** von 15 bis 17 Jahren. Wichtig: Wer noch **vollzeitschulpflichtig** ist, wird wie ein Kind behandelt, auch wenn er schon 15 oder 16 ist.",
      "Die **Beschäftigung von Kindern ist grundsätzlich verboten**. Ab **13 Jahren** sind mit **Einwilligung der Eltern** nur leichte Tätigkeiten erlaubt, die die **Kinderarbeitsschutzverordnung** abschließend aufzählt: etwa Zeitungen austragen, Nachhilfe geben, Babysitten, Hilfe in Haushalt und Garten von Privatleuten, in der Landwirtschaft oder bei nichtgewerblichen Vereinsfesten. Arbeit in einem Geschäft, Café oder Supermarkt gehört nicht dazu. Dabei gilt: höchstens **zwei Stunden täglich** (in landwirtschaftlichen Familienbetrieben drei), nicht zwischen **18 und 8 Uhr** und nicht vor oder während des Unterrichts. Diese Regeln gelten auch in den Ferien. Erst **vollzeitschulpflichtige Jugendliche ab 15** dürfen in den **Schulferien** bis zu **vier Wochen im Jahr** arbeiten, dann nach den Regeln für Jugendliche.",
      "Für **Jugendliche**, etwa Auszubildende, gelten feste Grenzen. Sie dürfen höchstens **acht Stunden am Tag** und **40 Stunden in der Woche** arbeiten, nur an **fünf Tagen** in der Woche und grundsätzlich nur zwischen **6 und 20 Uhr**; für Ältere gibt es Ausnahmen, etwa in der Gastronomie bis 22 Uhr. Bei mehr als viereinhalb Stunden Arbeit steht ihnen eine **Pause** von mindestens 30 Minuten zu, bei mehr als sechs Stunden von 60 Minuten. Der **Urlaub** beträgt je nach Alter 25 bis 30 Werktage.",
      "Gefährliche Arbeiten, etwa mit giftigen Stoffen oder an gefährlichen Maschinen, und Akkordarbeit sind für Jugendliche grundsätzlich verboten. Der **Arbeitgeber** ist für die Einhaltung verantwortlich. Bevor du einen Nebenjob annimmst, solltest du mit deinen Eltern sprechen, Arbeitszeiten und Lohn schriftlich festhalten und prüfen, ob der Job neben der Schule noch genug Zeit zum Lernen lässt.",
    ],
    terms: [
      term("Jugendarbeitsschutzgesetz", "Gesetz, das Kinder und Jugendliche vor gesundheitsschädlicher und übermäßiger Arbeit schützt."),
      term("Kind im Arbeitsschutz", "Wer noch nicht 15 Jahre alt oder noch vollzeitschulpflichtig ist."),
      term("Leichte Arbeit", "Tätigkeit, die Gesundheit, Entwicklung und Schulbesuch nicht beeinträchtigt, etwa Zeitungen austragen."),
    ],
    law: [
      {
        ref: "§ 5 Abs. 3 JArbSchG",
        text: "Kinder ab 13 dürfen mit Einwilligung der Eltern leichte, geeignete Arbeiten übernehmen, höchstens zwei Stunden täglich (in landwirtschaftlichen Familienbetrieben drei), nicht zwischen 18 und 8 Uhr und nicht vor oder während des Unterrichts. Schulpflichtige Jugendliche ab 15 dürfen in den Ferien bis zu vier Wochen im Jahr arbeiten (Abs. 4).",
        url: "https://www.gesetze-im-internet.de/jarbschg/__5.html",
      },
      {
        ref: "§ 2 KindArbSchV",
        text: "Die Verordnung zählt die erlaubten leichten Tätigkeiten auf, etwa Zeitungen austragen, Hilfe in privaten Haushalten und Gärten, Nachhilfe, Betreuung von Kindern und Haustieren, Hilfe in der Landwirtschaft und bei nichtgewerblichen Aktionen von Vereinen.",
        url: "https://www.gesetze-im-internet.de/kindarbschv/__2.html",
      },
      {
        ref: "§ 8 JArbSchG",
        text: "Jugendliche dürfen höchstens acht Stunden täglich und 40 Stunden wöchentlich beschäftigt werden.",
        url: "https://www.gesetze-im-internet.de/jarbschg/__8.html",
      },
    ],
    takeaway:
      "Kinderarbeit ist verboten; ab 13 sind mit Einwilligung der Eltern nur die leichten Tätigkeiten der Kinderarbeitsschutzverordnung erlaubt, höchstens zwei Stunden täglich und nicht zwischen 18 und 8 Uhr, auch in den Ferien. Schulpflichtige Jugendliche ab 15 dürfen in den Ferien bis vier Wochen jobben. Jugendliche arbeiten höchstens 8 Stunden täglich und 40 Stunden wöchentlich.",
    sourceIds: ["lp", "jarbschg", "kindarbschv", "bmas-jarbschg"],
    quiz: check(
      "Die 13-jährige Lea möchte nach der Schule von 18 bis 20 Uhr Zeitungen austragen. Ist das erlaubt?",
      "Nein, Kinder dürfen nicht zwischen 18 und 8 Uhr beschäftigt werden.",
      ["Ja, weil Zeitungen austragen eine leichte Tätigkeit ist und nur zwei Stunden dauert.", "Ja, sobald ihre Eltern der Arbeit am Abend ausdrücklich zugestimmt haben."],
      "Die Tätigkeit ist leicht und dauert zwei Stunden, aber die Uhrzeit ist verboten. Die Einwilligung der Eltern ersetzt diese Grenze nicht.",
    ),
    workshop: sort(
      "Erlaubt oder nicht?",
      "Ordne jeden Nebenjob nach dem Jugendarbeitsschutzgesetz ein.",
      ["Erlaubt", "Nicht erlaubt"],
      [
        ["Ein 14-Jähriger gibt mit Einwilligung der Eltern zweimal pro Woche eine Stunde Nachhilfe am Nachmittag.", 0, "Leichte Arbeit ab 13, unter zwei Stunden, zur erlaubten Zeit."],
        ["Eine 12-Jährige trägt jeden Morgen um 6 Uhr Prospekte aus.", 1, "Unter 13 ist die Beschäftigung verboten, und die Uhrzeit wäre es auch."],
        ["Ein schulpflichtiger 15-Jähriger jobbt in den Sommerferien drei Wochen in einer Gärtnerei.", 0, "Schulpflichtige Jugendliche ab 15 dürfen in den Ferien bis vier Wochen im Jahr arbeiten."],
        ["Ein 13-Jähriger hilft mit Einwilligung der Eltern täglich drei Stunden im Supermarkt.", 1, "Arbeit im Supermarkt gehört nicht zu den erlaubten leichten Tätigkeiten, und drei Stunden wären ohnehin zu lang."],
        ["Eine 16-jährige Auszubildende arbeitet acht Stunden am Tag, fünf Tage die Woche.", 0, "Das entspricht den Grenzen für Jugendliche."],
      ],
      "Alter, Dauer, Uhrzeit und Art der Arbeit entscheiden.",
    ),
    casework: {
      title: "Der Job im Eiscafé",
      story:
        "**Emil (14)** geht in die 8. Klasse. Ein **Eiscafé** bietet ihm einen Job an: an **Wochentagen von 17 bis 20 Uhr** Eis verkaufen und in den **Sommerferien sechs Wochen** jeden Tag aushelfen. Seine Eltern sind einverstanden.",
      steps: [
        decide("Gilt Emil nach dem Gesetz als Kind oder Jugendlicher?", "Als Kind, weil er noch nicht 15 und vollzeitschulpflichtig ist.", "Als Jugendlicher, weil er schon 14 ist.", "Im Arbeitsschutz ist Kind, wer unter 15 oder vollzeitschulpflichtig ist."),
        decide("Darf Emil unter der Woche im Eiscafé Eis verkaufen?", "Nein: Verkaufen in einem Café gehört nicht zu den erlaubten leichten Tätigkeiten, und 17 bis 20 Uhr wäre zu lang und zu spät.", "Ja, weil seine Eltern zugestimmt haben.", "Die Einwilligung der Eltern ist nötig, reicht aber nicht. Die Kinderarbeitsschutzverordnung zählt die erlaubten Tätigkeiten abschließend auf, und Kinder dürfen höchstens zwei Stunden und nicht nach 18 Uhr arbeiten."),
        decide("Darf Emil in den Sommerferien im Eiscafé aushelfen?", "Nein, auch in den Ferien gelten für ihn die Regeln für Kinder.", "Ja, aber höchstens vier Wochen statt sechs.", "Die Vier-Wochen-Regel gilt erst für schulpflichtige Jugendliche ab 15. Mit 14 darf Emil auch in den Ferien nur leichte Tätigkeiten wie Nachhilfe oder Babysitten übernehmen, höchstens zwei Stunden täglich."),
      ],
      verdict: "Das Angebot verstößt gegen das Jugendarbeitsschutzgesetz. Mit 14 darf Emil zum Beispiel Zeitungen austragen oder Nachhilfe geben, höchstens zwei Stunden täglich vor 18 Uhr, auch in den Ferien. Einen Ferienjob im Eiscafé kann er frühestens mit 15 annehmen.",
    },
    tasks: {
      1: write(
        "Erkläre, welche Nebenjobs du mit 13 oder 14 Jahren annehmen darfst und welche Grenzen dabei gelten.",
        ["Was ist eine leichte Arbeit?", "Welche Zeiten und welche Dauer sind erlaubt?"],
        "Mit 13 oder 14 bin ich nach dem Jugendarbeitsschutzgesetz noch ein Kind, für das Arbeit grundsätzlich verboten ist. Ab 13 darf ich mit Einwilligung meiner Eltern aber leichte und geeignete Tätigkeiten übernehmen, etwa Zeitungen austragen, babysitten, Nachhilfe geben oder Rasen mähen. Ich darf höchstens zwei Stunden täglich arbeiten, nicht zwischen 18 und 8 Uhr und nicht vor oder während der Schule. Diese Grenzen gelten auch in den Ferien. In einem Geschäft oder Café darf ich erst ab 15 arbeiten, und als Schüler dann in den Ferien höchstens vier Wochen im Jahr.",
        ["Nennt passende leichte Tätigkeiten", "Nennt die Grenzen zu Dauer und Uhrzeit", "Bezieht Einwilligung und Ferien ein"],
      ),
      2: write(
        "Beurteile, ob die strengen Regeln des Jugendarbeitsschutzgesetzes heute noch zeitgemäß sind, wenn viele Jugendliche gern mehr Geld verdienen würden.",
        ["Was soll das Gesetz schützen?", "Welche Interessen haben Jugendliche und Arbeitgeber?"],
        "Viele Jugendliche möchten mehr arbeiten, um sich Wünsche zu erfüllen, und manche Arbeitgeber suchen Aushilfen. Das Gesetz schützt aber Werte, die heute noch genauso wichtig sind: die Gesundheit, genug Schlaf und Freizeit und vor allem die Schule, die Grundlage für die berufliche Zukunft ist. Ohne Grenzen könnten Arbeitgeber junge Menschen als billige Arbeitskräfte ausnutzen. Die Regeln lassen trotzdem Spielraum, etwa für Ferienjobs und leichte Arbeiten ab 13. Ich halte sie deshalb für zeitgemäß; diskutieren könnte man allenfalls einzelne Grenzen, nicht den Schutzgedanken.",
        ["Stellt die Interessen dar", "Erklärt den Schutzzweck", "Kommt zu einem begründeten Urteil"],
      ),
    },
  },

  {
    id: "pr-projekt",
    lb: 4,
    unit: "4.4",
    title: "Projekt: Unternehmenspräsentation, Fallstudie und Planspiel",
    intro: "Jetzt wirst du selbst aktiv: ein Unternehmen präsentieren, eine Fallstudie lösen oder in einem Planspiel entscheiden.",
    paragraphs: [
      "Im **Projekt** des Profilbereichs wendest du an, was du gelernt hast. Ein Projekt hat ein klares **Ziel**, einen **Zeitplan** und verteilte **Aufgaben**, und es läuft in Phasen ab: Idee und Ziel festlegen, planen, durchführen, die Ergebnisse präsentieren und am Ende **reflektieren**, was gut lief und was ihr verbessern würdet. Hier helfen dir Arbeitsteilung, Zeitmanagement und Präsentationsregeln aus den anderen Lektionen.",
      "Eine Möglichkeit ist eine **Unternehmenspräsentation** mit digitalen Medien. Zuerst **recherchiert** ihr: Welche Produkte hat das Unternehmen, wie ist es aufgebaut, wie betreibt es Marketing? Nutzt mehrere Quellen, prüft, wer sie verfasst hat und wie aktuell sie sind, und notiert jede Quelle. Unternehmensseiten zeigen ein geschöntes Bild, deshalb gehören auch unabhängige Berichte dazu. Für die Präsentation gelten die bekannten Regeln: Zielgruppe, Reduktion, Visualisierung, Sprache. Bilder dürft ihr nur mit passender Lizenz verwenden.",
      "Eine zweite Möglichkeit ist eine **ökonomische Fallstudie**. Ihr erhaltet einen realistischen Fall, etwa ein Unternehmen mit sinkendem Umsatz. Ihr erfasst das **Problem**, sammelt **Informationen**, entwickelt mehrere **Lösungen**, entscheidet euch begründet für eine und vergleicht sie am Ende mit der tatsächlichen Entscheidung. In einem **Planspiel** übernehmt ihr Rollen, etwa als Geschäftsleitung konkurrierender Firmen, und trefft in mehreren Runden Entscheidungen über Preise, Werbung und Produktion. Nach jeder Runde seht ihr die Folgen und könnt euer Vorgehen anpassen.",
      "Eine dritte Möglichkeit ist die Teilnahme an einem **ökonomischen Wettbewerb**, etwa zu nachhaltigem Verbraucherverhalten oder zu Schülerfirmen. Ob ein solches Projekt zustande kommt, entscheidet deine Lehrkraft mit der Klasse. Diese App kann das Projekt nicht ersetzen. Sie hilft dir aber, es vorzubereiten: Nutze die Praxisnotiz unter „Quellen & Praxis“, um Frage, Quellen, Beobachtungen und Ergebnis festzuhalten.",
    ],
    terms: [
      term("Projekt", "Vorhaben mit klarem Ziel, Zeitplan und verteilten Aufgaben, das in Phasen bis zur Reflexion abläuft."),
      term("Fallstudie", "Bearbeitung eines realistischen Falls von der Problemanalyse bis zur begründeten Entscheidung."),
      term("Planspiel", "Simulation, in der Teilnehmende in Rollen über mehrere Runden Entscheidungen treffen und deren Folgen erleben."),
    ],
    takeaway:
      "Ein Projekt läuft von Ziel und Planung über Durchführung und Präsentation bis zur Reflexion. Unternehmenspräsentation, Fallstudie, Planspiel und Wettbewerb verbinden Recherche, Entscheidung und Präsentation; die App hilft bei der Vorbereitung, ersetzt das Projekt aber nicht.",
    sourceIds: ["lp", "cc", "bpb"],
    quiz: check(
      "Was unterscheidet ein Planspiel von einer Fallstudie?",
      "Im Planspiel trefft ihr in Rollen über mehrere Runden Entscheidungen und erlebt deren Folgen.",
      ["Im Planspiel gibt es kein Problem, nur eine Präsentation, die man am Ende vor der Klasse hält.", "Eine Fallstudie dauert immer mehrere Wochen, ein Planspiel nur wenige Minuten."],
      "Ein Planspiel simuliert Entscheidungen und Rückmeldungen in Runden. Eine Fallstudie analysiert einen Fall bis zu einer begründeten Entscheidung, ohne Rollen und Runden.",
    ),
    workshop: {
      kind: "timeline",
      title: "Die Phasen eines Projekts",
      instruction: "Bringe die Phasen eines Projekts zur Unternehmenspräsentation in die richtige Reihenfolge.",
      categories: [],
      entries: [
        { text: "Ziel festlegen: Wir stellen ein regionales Unternehmen für Sechstklässler vor.", target: 0, feedback: "Ohne klares Ziel weiß niemand, wohin es geht." },
        { text: "Planen: Aufgaben verteilen und einen Zeitplan mit Zwischenterminen erstellen.", target: 1, feedback: "Planung verbindet Arbeitsteilung und Koordination." },
        { text: "Durchführen: recherchieren, Quellen prüfen und Folien gestalten.", target: 2, feedback: "Jetzt entsteht das Ergebnis." },
        { text: "Präsentieren: die Präsentation vor der Zielgruppe halten.", target: 3, feedback: "Das Ergebnis wird sichtbar." },
        { text: "Reflektieren: besprechen, was gut lief und was wir beim nächsten Mal ändern.", target: 4, feedback: "Aus der Reflexion lernt das Team am meisten." },
      ],
      conclusion: "Wer die Phasen kennt, kann Projekte planbar und erfolgreich gestalten.",
    },
    casework: {
      title: "Die Präsentation über eine Brauerei",
      story:
        "Eine Gruppe soll ein **regionales Unternehmen** vor der Klasse präsentieren. **Tom** will nur die Website der Brauerei abschreiben. **Aylin** schlägt vor, auch einen Zeitungsartikel und ein Interview mit einer Mitarbeiterin zu nutzen. **Ben** möchte Fotos aus einer Suchmaschine verwenden.",
      steps: [
        decide("Warum reicht die Website allein nicht aus?", "Sie zeigt nur, was das Unternehmen selbst über sich sagen will.", "Websites sind grundsätzlich falsch.", "Unternehmensseiten sind nicht falsch, aber einseitig; unabhängige Quellen ergänzen das Bild."),
        decide("Was ist bei Bens Fotos zu beachten?", "Er braucht eine Lizenz oder Bilder mit freier Lizenz und nennt die Urheber.", "Nichts, im Unterricht darf man jedes Bild zeigen.", "Für die Präsentation gelten Urheberrecht und Lizenzbedingungen; eigene Fotos sind eine gute Alternative."),
        decide("Was gehört zu einer guten Recherche?", "Mehrere Quellen prüfen und jede Quelle notieren.", "Möglichst viel Text kopieren, damit nichts fehlt.", "Quellenvielfalt und Quellenangaben machen eine Präsentation verlässlich."),
      ],
      verdict: "Die Gruppe kombiniert Unternehmensseite, unabhängige Quellen und ein Interview, verwendet nur lizenzierte Bilder und notiert alle Quellen. So entsteht eine ausgewogene Präsentation.",
    },
    tasks: {
      1: write(
        "Plane in Stichpunkten ein Projekt zur Präsentation eines Unternehmens aus deiner Region: Ziel, Aufgabenverteilung, Zeitplan und Quellen.",
        ["Für wen präsentiert ihr?", "Welche Quellen sind unabhängig?"],
        "Ziel: Wir stellen die Bäckerei Huber unserer Klasse in zehn Minuten vor und zeigen Aufbau, Produktion und Marketing. Aufgaben: Lena recherchiert die Geschichte und den Aufbau, Jonas die Produktion, ich das Marketing, und Mia gestaltet die Folien. Zeitplan: In Woche 1 recherchieren wir, in Woche 2 führen wir ein Interview mit der Inhaberin, in Woche 3 erstellen wir die Folien und proben. Quellen: die Website der Bäckerei, ein Artikel der Lokalzeitung, das Interview und eigene Fotos, für die wir die Erlaubnis einholen.",
        ["Nennt ein klares Ziel", "Verteilt Aufgaben und legt einen Zeitplan fest", "Nennt mehrere, auch unabhängige Quellen"],
      ),
      2: write(
        "Reflektiere, welche Kompetenzen aus dem Fach Wirtschaft und Recht du in einem Planspiel zu konkurrierenden Unternehmen einsetzen würdest.",
        ["Denke an Marketing, Preiskalkulation und Arbeitsteilung.", "Was lernst du aus den Rückmeldungen nach jeder Runde?"],
        "In einem Planspiel würde ich zuerst die Marktanalyse nutzen, um Zielgruppe und Konkurrenz einzuschätzen. Bei den Preisentscheidungen würde ich mit Selbstkosten und Gewinnzuschlag kalkulieren und eine passende Preisstrategie wählen. Für Werbung und Vertrieb würde ich den Marketing-Mix abstimmen und die Phase im Produktlebenszyklus beachten. Im Team würden wir die Arbeit nach den Prinzipien der Arbeitsteilung verteilen und koordinieren. Nach jeder Runde zeigt die Auswertung, ob unsere Entscheidungen gewirkt haben, und wir können sie anpassen. So erlebe ich, wie Entscheidungen zusammenhängen.",
        ["Nennt mehrere passende Fachkompetenzen", "Ordnet sie Entscheidungen im Planspiel zu", "Reflektiert das Lernen aus Rückmeldungen"],
      ),
    },
  },
];
