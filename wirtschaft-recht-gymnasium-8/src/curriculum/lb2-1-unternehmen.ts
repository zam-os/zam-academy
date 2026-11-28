import type { Lesson } from "../model/types";
import { check, decide, sort, term, write } from "./lesson-parts";

export const LB2_1: Lesson[] = [
  {
    id: "un-arbeitsteilung",
    lb: 2,
    unit: "2.1",
    title: "Arbeitsteilung: Spezialisierung, Kooperation, Koordination",
    intro: "Ein Schulfest, ein Waffelstand, sechs Helfer: Wer macht was? Arbeitsteilung beginnt im eigenen Umfeld.",
    paragraphs: [
      "Wenn mehrere Menschen eine Aufgabe gemeinsam erledigen, können sie sie aufteilen. **Arbeitsteilung** beruht auf drei Grundprinzipien. Bei der **Spezialisierung** wird eine Gesamtaufgabe in Teilaufgaben zerlegt, und jede Person übernimmt einen Teil, den sie besonders gut kann oder durch Übung immer besser beherrscht. Am Waffelstand rührt einer den Teig, eine zweite backt, ein dritter kassiert.",
      "Spezialisierung allein reicht nicht. Die Teilergebnisse müssen zusammenkommen: Der Teig muss zum Waffeleisen, die Waffeln zur Kasse. Diese Zusammenarbeit heißt **Kooperation**. Damit niemand wartet oder doppelt arbeitet, braucht es **Koordination**, also Abstimmung: Wer macht wann was, wie viel Teig wird gebraucht, wer springt ein, wenn jemand Pause macht? Koordination geschieht durch Pläne, Absprachen oder eine Person, die den Überblick behält.",
      "Arbeitsteilung begegnet dir überall in deinem Lebensumfeld. In der Familie kocht einer, eine räumt auf, ein anderer kauft ein. Bei einem Gruppenreferat recherchiert jeder ein Teilthema, und am Ende fügt die Gruppe die Teile zusammen. Wie gut das gelingt, hängt davon ab, ob die Aufgaben sinnvoll verteilt sind, ob jeder weiß, was er beitragen soll, und ob jemand die Teile rechtzeitig zusammenführt.",
      "Ein Beispiel zeigt die Wirkung: Allein schafft eine Person am Waffelstand vielleicht 8 Waffeln pro Stunde, weil sie ständig zwischen Rühren, Backen und Kassieren wechselt. Drei Spezialisten mit gutem Plan schaffen zusammen 36, also 12 pro Person. Ohne Absprache dagegen warten die Bäcker auf Teig, und an der Kasse staut es sich. Spezialisierung, Kooperation und Koordination wirken nur gemeinsam.",
    ],
    terms: [
      term("Spezialisierung", "Eine Gesamtaufgabe wird in Teilaufgaben zerlegt, die verschiedene Personen übernehmen."),
      term("Kooperation", "Zusammenarbeit, bei der die Teilergebnisse zu einem gemeinsamen Ergebnis zusammengeführt werden."),
      term("Koordination", "Abstimmung, wer wann welche Teilaufgabe übernimmt, damit Leerlauf und Doppelarbeit vermieden werden."),
    ],
    takeaway:
      "Arbeitsteilung beruht auf Spezialisierung, Kooperation und Koordination. Erst wenn Aufgaben sinnvoll aufgeteilt, Teilergebnisse zusammengeführt und alle Schritte abgestimmt sind, entsteht ein Vorteil.",
    sourceIds: ["lp"],
    lab: "arbeitsteilung",
    quiz: check(
      "Bei einem Gruppenreferat recherchiert jeder ein Teilthema, aber niemand legt fest, bis wann die Teile fertig sein sollen. Welches Prinzip fehlt?",
      "Die Koordination, denn es gibt keine Abstimmung über Zeitpunkte und Abläufe.",
      ["Die Spezialisierung, denn jeder müsste eigentlich das ganze Thema allein bearbeiten.", "Die Kooperation, denn bei einem Referat arbeitet man grundsätzlich nicht zusammen."],
      "Die Aufgaben sind schon verteilt, das ist Spezialisierung. Es fehlt die Abstimmung, die das Zusammenführen rechtzeitig möglich macht.",
    ),
    workshop: sort(
      "Welches Prinzip ist gemeint?",
      "Ordne jede Situation bei der Organisation eines Klassenfrühstücks einem Prinzip zu.",
      ["Spezialisierung", "Kooperation", "Koordination"],
      [
        ["Mira backt Brötchen, Can schneidet Obst, Elif kocht Tee.", 0, "Die Gesamtaufgabe wird in Teile zerlegt."],
        ["Alle bringen ihre Beiträge um 7:45 Uhr in den Klassenraum, wo sie zusammen aufgebaut werden.", 1, "Die Teilergebnisse werden zusammengeführt."],
        ["Eine Liste legt fest, wer was mitbringt und wer den Tisch deckt.", 2, "Der Plan stimmt die Teilaufgaben aufeinander ab."],
        ["Jonas übernimmt das Getränkebuffet, weil er schon dreimal dafür zuständig war.", 0, "Er spezialisiert sich auf das, was er geübt hat."],
        ["Kurz vorher prüft die Klassensprecherin per Nachricht, ob alles klappt.", 2, "Kontrolle und Abstimmung sind Koordination."],
      ],
      "Erst wenn alle drei Prinzipien greifen, wird das Frühstück pünktlich fertig.",
    ),
    casework: {
      title: "Chaos beim Kuchenverkauf",
      story:
        "Die **8b** verkauft beim Elternabend Kuchen. **Fünf Schüler** stehen gleichzeitig am Tisch, jeder schneidet, verkauft und kassiert. Teller fehlen, das Wechselgeld liegt durcheinander, und Eltern warten lange.",
      steps: [
        decide("Was ist das Hauptproblem?", "Es gibt weder klare Teilaufgaben noch eine Abstimmung.", "Es sind zu wenige Helfer am Stand.", "Fünf Helfer reichen; sie arbeiten nur durcheinander statt arbeitsteilig."),
        decide("Wie könnte die Klasse die Spezialisierung verbessern?", "Feste Rollen verteilen: zwei schneiden, zwei verkaufen, eine kassiert.", "Alle machen weiterhin alles, nur schneller.", "Klare Rollen nutzen Übung und vermeiden, dass sich alle gegenseitig im Weg stehen."),
        decide("Was gehört zur Koordination?", "Ein Plan, wer die Teller nachholt und wer die Kasse übernimmt, wenn jemand Pause macht.", "Dass jeder selbst entscheidet, was gerade fehlt.", "Koordination legt Abläufe und Vertretungen vorher fest."),
      ],
      verdict: "Die Klasse hatte genug Leute, aber keine Arbeitsteilung. Mit festen Rollen, Zusammenarbeit und einem einfachen Plan läuft der Verkauf.",
    },
    tasks: {
      1: write(
        "Beschreibe eine Aufgabe aus deinem Lebensumfeld, bei der ihr die Arbeit geteilt habt, und erkläre daran Spezialisierung, Kooperation und Koordination.",
        ["Denke an Familie, Schule oder Verein.", "Wer hat was übernommen, und wie wurde es abgestimmt?"],
        "Beim Umzug meiner Tante haben wir die Arbeit geteilt. Spezialisierung: Mein Vater hat Möbel abgebaut, ich habe Kartons gepackt, meine Mutter hat beschriftet. Kooperation: Wir haben alle Kartons zum Transporter gebracht, wo mein Onkel sie eingeladen hat. Koordination: Meine Tante hatte einen Plan, welches Zimmer zuerst dran war und wann der Transporter kommt. Ohne den Plan hätten wir uns gegenseitig behindert.",
        ["Beschreibt eine konkrete Aufgabe", "Erklärt alle drei Prinzipien am Beispiel", "Zeigt, was ohne eines der Prinzipien schiefgegangen wäre"],
      ),
      2: write(
        "Eure Klasse plant einen Spendenlauf. Entwickle einen Vorschlag, wie ihr die Arbeit nach den drei Grundprinzipien der Arbeitsteilung organisiert, und begründe ihn.",
        ["Welche Teilaufgaben gibt es von der Werbung bis zur Abrechnung?", "Wie stellt ihr sicher, dass alles zusammenpasst?"],
        "Zur Spezialisierung bilden wir vier Teams: Werbung und Sponsoren, Strecke und Sicherheit, Verpflegung sowie Zählen und Abrechnung. So kann jedes Team sich auf seine Aufgabe konzentrieren. Zur Kooperation treffen sich die Teams am Lauftag: Die Zähler geben ihre Listen an das Abrechnungsteam, die Verpflegung versorgt die Läufer an der Strecke. Zur Koordination gibt es einen Zeitplan mit Fristen und je eine Sprecherin pro Team, die sich wöchentlich mit der Klassenleitung abstimmt. So vermeiden wir Doppelarbeit und Lücken.",
        ["Teilt die Gesamtaufgabe sinnvoll auf", "Beschreibt das Zusammenführen der Ergebnisse", "Legt eine überzeugende Koordination fest"],
      ),
    },
  },

  {
    id: "un-arbeitsteilung-folgen",
    lb: 2,
    unit: "2.1",
    title: "Vorteile und Probleme der Arbeitsteilung",
    intro: "Arbeitsteilung macht Unternehmen produktiver. Doch sie hat auch eine Kehrseite für Menschen und Betriebe.",
    paragraphs: [
      "Unternehmen handeln nach dem **ökonomischen Prinzip**: Sie wollen mit ihren Mitteln möglichst viel herstellen oder ein Ergebnis mit möglichst wenig Aufwand erreichen. Arbeitsteilung hilft dabei. Wie gut, zeigen zwei Kennzahlen. Die **Produktivität** setzt die hergestellte Menge ins Verhältnis zum Einsatz, etwa Stück je Arbeitsstunde. Die **Wirtschaftlichkeit** vergleicht in Euro den Ertrag mit dem Aufwand: Ertrag geteilt durch Aufwand. Ein Wert über 1 bedeutet, dass der Ertrag den Aufwand übersteigt.",
      "Die **Vorteile** der Arbeitsteilung sind groß. Wer immer dieselbe Tätigkeit ausführt, wird durch **Übung** schneller und macht weniger Fehler. Es entfallen Zeiten für das Wechseln zwischen Tätigkeiten und Werkzeugen. Menschen können nach ihren **Fähigkeiten** eingesetzt werden, und zerlegte Teilaufgaben lassen sich leichter durch **Maschinen** unterstützen. Das senkt die Kosten je Stück und macht Produkte billiger.",
      "Doch Arbeitsteilung hat auch **Probleme**. Immer gleiche Handgriffe führen zu **Monotonie** und einseitiger körperlicher Belastung. Wer nur einen kleinen Teil eines Produkts herstellt, erlebt seine Arbeit oft als wenig sinnvoll und identifiziert sich weniger damit. Der Betrieb wird **abhängig**: Fällt eine spezialisierte Stelle aus, steht die ganze Kette still. Und je stärker eine Arbeit zerlegt ist, desto mehr Aufwand kostet die **Koordination**.",
      "Ein Beispiel: In einer Schülerfirma bauen drei Personen in drei Stunden Vogelhäuser. Macht jede alles selbst, schaffen sie 54 Stück, also 54 : 9 = 6 Stück je Arbeitsstunde. Nach der Arbeitsteilung sind es 81 Stück, also 9 Stück je Arbeitsstunde: Die Produktivität steigt um 50 %. Unternehmen begegnen den Problemen zum Beispiel mit **Jobrotation**, bei der Beschäftigte regelmäßig die Tätigkeit wechseln.",
    ],
    terms: [
      term("Produktivität", "Verhältnis von hergestellter Menge zum Mengeneinsatz, etwa Stück je Arbeitsstunde."),
      term("Wirtschaftlichkeit", "Verhältnis von Ertrag zu Aufwand in Euro; ein Wert über 1 zeigt, dass sich eine Tätigkeit lohnt."),
      term("Monotonie", "Gleichförmigkeit immer gleicher Tätigkeiten, die ermüdet und die Motivation senkt."),
      term("Jobrotation", "Planmäßiger Wechsel zwischen verschiedenen Arbeitsplätzen oder Tätigkeiten."),
    ],
    takeaway:
      "Arbeitsteilung steigert Produktivität und Wirtschaftlichkeit durch Übung, Zeitersparnis und Maschineneinsatz. Ihre Kehrseite sind Monotonie, Abhängigkeit und Koordinationsaufwand. Produktivität ist Menge je Einsatz, Wirtschaftlichkeit ist Ertrag durch Aufwand.",
    sourceIds: ["lp"],
    practice: "produktivitaet",
    quiz: check(
      "Ein Café nimmt an einem Tag 1.200 € ein, die Kosten betragen 960 €. Wie hoch ist die Wirtschaftlichkeit?",
      "1,25, denn 1.200 € geteilt durch 960 € ergibt 1,25.",
      ["240, denn 1.200 € minus 960 € ergibt einen Gewinn von 240 €.", "0,8, denn 960 € geteilt durch 1.200 € ergibt 0,8."],
      "Wirtschaftlichkeit ist Ertrag geteilt durch Aufwand. 240 € ist der Gewinn, eine andere Kennzahl. 0,8 entsteht, wenn man die beiden Größen vertauscht.",
    ),
    workshop: sort(
      "Vorteil oder Problem?",
      "Ordne jede Folge der Arbeitsteilung in einer Fahrradfabrik ein.",
      ["Vorteil", "Problem"],
      [
        ["Eine Mitarbeiterin montiert seit Jahren nur Bremsen und macht kaum noch Fehler.", 0, "Übung steigert Tempo und Qualität."],
        ["Ein Mitarbeiter zieht acht Stunden täglich dieselben Schrauben an und langweilt sich.", 1, "Monotonie belastet und demotiviert."],
        ["Weil die Lackiererei ausfällt, stehen alle anderen Stationen still.", 1, "Arbeitsteilung macht Betriebe abhängig."],
        ["Ein Roboter übernimmt das Schweißen der Rahmen, das sich in kleine Schritte zerlegen ließ.", 0, "Zerlegte Aufgaben lassen sich leichter automatisieren."],
        ["Durch die Spezialisierung sinken die Kosten je Fahrrad deutlich.", 0, "Höhere Produktivität senkt die Stückkosten."],
      ],
      "Arbeitsteilung lohnt sich, wenn ein Betrieb ihre Probleme gezielt abfedert.",
    ),
    casework: {
      title: "Die Vogelhaus-Schülerfirma",
      story:
        "In der Schülerfirma bauen **3 Personen** in **3 Stunden** zunächst **54 Vogelhäuser**, jede baut alles selbst. Nach der Einführung von Arbeitsteilung sind es in derselben Zeit **81 Stück**. Ein Mitglied klagt: „Ich schleife nur noch, das ist total öde.“",
      steps: [
        decide("Wie hoch war die Produktivität vorher?", "6 Stück je Arbeitsstunde", "18 Stück je Arbeitsstunde", "54 Stück : (3 Personen · 3 Stunden) = 6. Die 18 entsteht, wenn man nur durch die Stunden teilt."),
        decide("Um wie viel Prozent ist die Produktivität gestiegen?", "Um 50 %", "Um 27 %", "Nachher 81 : 9 = 9 Stück. (9 − 6) : 6 · 100 = 50 %."),
        decide("Wie kann die Firma auf die Klage reagieren?", "Mit Jobrotation: Die Tätigkeiten wechseln regelmäßig.", "Mit noch stärkerer Spezialisierung auf einzelne Handgriffe.", "Jobrotation verringert Monotonie, ohne die Vorteile ganz aufzugeben."),
      ],
      verdict: "Die Arbeitsteilung hat die Produktivität um die Hälfte gesteigert. Gegen die Monotonie hilft ein regelmäßiger Wechsel der Aufgaben.",
    },
    tasks: {
      1: write(
        "Erkläre zwei Vorteile und zwei Probleme der Arbeitsteilung an einem Unternehmen deiner Wahl.",
        ["Denke an eine Bäckerei, eine Autofabrik oder ein Krankenhaus.", "Was gewinnt das Unternehmen, was verlieren die Beschäftigten?"],
        "In einer Großbäckerei arbeitet jede Person an einer eigenen Station. Ein Vorteil ist die Übung: Wer täglich Brezen schlingt, wird sehr schnell. Ein zweiter Vorteil ist der Maschineneinsatz, denn Teigteilen übernimmt eine Maschine. Ein Problem ist die Monotonie, weil die Beschäftigten stundenlang dieselben Handgriffe machen. Ein zweites Problem ist die Abhängigkeit: Fällt der Ofen aus, stehen auch alle anderen Stationen still.",
        ["Nennt ein konkretes Unternehmen", "Erklärt zwei Vorteile", "Erklärt zwei Probleme"],
      ),
      2: write(
        "Ein Unternehmen hat seine Produktivität durch stärkere Arbeitsteilung um 30 % gesteigert, gleichzeitig steigen die Krankmeldungen. Beurteile die Entwicklung aus Sicht der Unternehmensleitung und der Beschäftigten und schlage eine Lösung vor.",
        ["Welche Kosten entstehen durch Krankmeldungen?", "Wie lassen sich Vorteile erhalten und Belastungen senken?"],
        "Aus Sicht der Leitung ist die höhere Produktivität ein Erfolg, weil die Kosten je Stück sinken. Die steigenden Krankmeldungen kosten aber Geld und gefährden die Abläufe, denn bei starker Arbeitsteilung fehlt bei jedem Ausfall eine spezialisierte Kraft. Für die Beschäftigten bedeuten monotone, einseitige Tätigkeiten Belastung und weniger Freude an der Arbeit. Ich schlage Jobrotation und Gruppenarbeit vor, bei denen Beschäftigte mehrere Tätigkeiten beherrschen. So bleiben viele Vorteile erhalten, Ausfälle lassen sich leichter ausgleichen, und die Belastung sinkt.",
        ["Beurteilt die Sicht der Leitung", "Beurteilt die Sicht der Beschäftigten", "Schlägt eine begründete Lösung vor"],
      ),
    },
  },

  {
    id: "un-aufbau",
    lb: 2,
    unit: "2.1",
    title: "Der Aufbau eines Unternehmens",
    intro: "Wer entscheidet, wer kauft ein, wer verkauft? Die Aufbauorganisation ordnet die Aufgaben im Unternehmen.",
    paragraphs: [
      "Ein Unternehmen erfüllt viele Aufgaben. Die **Aufbauorganisation** legt fest, wer welche Aufgaben dauerhaft übernimmt und wer wem Anweisungen geben darf. Die kleinste Einheit ist die **Stelle**, der Aufgabenbereich einer Person, etwa „Einkauf Holz“. Mehrere Stellen mit verwandten Aufgaben bilden eine **Abteilung**. Stellen mit Leitungsbefugnis heißen **Instanzen**; von ihnen aus laufen die **Weisungswege**.",
      "Häufig ist ein Unternehmen nach **Funktionsbereichen** gegliedert. Die **Beschaffung** besorgt Rohstoffe, Material und Waren. Die **Produktion** stellt daraus die Erzeugnisse her. Der **Absatz** verkauft sie und kümmert sich um Marketing und Kunden. Diese drei Bereiche bilden den Kern. Hinzu kommen die **Verwaltung**, etwa Personal und Rechnungswesen, und die **Leitung**, die Ziele setzt, entscheidet und die Bereiche steuert.",
      "Grafisch stellt man die Aufbauorganisation im **Organigramm** dar. Oben steht die Geschäftsleitung, darunter stehen die Bereiche und Abteilungen, Linien zeigen die Weisungswege. In einem kleinen Handwerksbetrieb übernimmt oft eine Person mehrere Bereiche: Die Meisterin kauft ein, arbeitet in der Werkstatt mit und schreibt die Rechnungen. In einem Großunternehmen gibt es dafür ganze Abteilungen mit vielen Stellen.",
      "Beispiel: Eine Möbelfirma mit 40 Beschäftigten hat eine Geschäftsführerin. Ihr unterstehen die Leiter von Einkauf, Fertigung, Vertrieb und Verwaltung. Der Fertigungsleiter gibt den Tischlern Anweisungen, nicht aber den Vertriebsmitarbeitern. So weiß jeder, wofür er zuständig ist und an wen er sich wenden muss.",
    ],
    terms: [
      term("Aufbauorganisation", "Dauerhafte Ordnung der Aufgaben, Stellen und Weisungsbefugnisse in einem Unternehmen."),
      term("Stelle", "Kleinste organisatorische Einheit: der Aufgabenbereich einer Person."),
      term("Instanz", "Stelle mit Leitungs- und Weisungsbefugnis gegenüber anderen Stellen."),
      term("Organigramm", "Schaubild, das Bereiche, Abteilungen, Stellen und Weisungswege eines Unternehmens zeigt."),
    ],
    takeaway:
      "Die Aufbauorganisation verteilt die Aufgaben auf Stellen und Abteilungen und regelt die Weisungswege. Typische Funktionsbereiche sind Beschaffung, Produktion und Absatz, ergänzt durch Verwaltung und Leitung; das Organigramm macht den Aufbau sichtbar.",
    sourceIds: ["lp"],
    visual: { title: "Ein einfaches Organigramm", steps: ["Leitung · Geschäftsführung", "Beschaffung · Produktion · Absatz", "Verwaltung · Personal und Rechnungswesen"] },
    quiz: check(
      "Zu welchem Funktionsbereich gehört es, Holz für die Produktion von Stühlen einzukaufen?",
      "Zur Beschaffung, weil sie Material für die Produktion besorgt.",
      ["Zum Absatz, weil beim Holzkauf Geld an einen Lieferanten bezahlt wird.", "Zur Leitung, weil nur die Geschäftsführung Einkäufe tätigen darf."],
      "Die Beschaffung sorgt für Rohstoffe und Material. Der Absatz verkauft die fertigen Produkte, und die Leitung delegiert solche Aufgaben in der Regel.",
    ),
    workshop: sort(
      "Welcher Bereich ist zuständig?",
      "Ordne jede Aufgabe in einem Fahrradhersteller dem passenden Funktionsbereich zu.",
      ["Beschaffung", "Produktion", "Absatz", "Verwaltung"],
      [
        ["Rahmenrohre und Reifen bei Lieferanten bestellen", 0, "Material besorgen ist Aufgabe der Beschaffung."],
        ["Die Fahrräder aus Rahmen, Rädern und Bremsen montieren", 1, "Hier entsteht das Erzeugnis."],
        ["Fahrradhändler besuchen und neue Modelle vorstellen", 2, "Verkaufen und Kunden betreuen gehören zum Absatz."],
        ["Die Löhne der Beschäftigten abrechnen", 3, "Personal und Rechnungswesen sind Verwaltung."],
        ["Eine Werbekampagne für das neue E-Bike planen", 2, "Marketing ist Teil des Absatzes."],
      ],
      "Jeder Bereich hat seine Aufgabe, und die Leitung hält sie zusammen.",
    ),
    casework: {
      title: "Wer ist zuständig?",
      story:
        "In der **Tischlerei Holzmann** (25 Beschäftigte) beschwert sich ein Kunde, dass sein Esstisch zu spät kommt. Die **Verkäuferin** verspricht einen neuen Termin, der **Werkstattleiter** weiß davon nichts, und der **Einkäufer** hat das Holz noch nicht bestellt.",
      steps: [
        decide("Welcher Bereich ist für den Kunden der erste Ansprechpartner?", "Der Absatz, der Aufträge annimmt und Kunden betreut.", "Die Produktion, weil dort der Tisch gebaut wird.", "Der Absatz hält den Kontakt zum Kunden und gibt die Aufträge weiter."),
        decide("Wer darf dem Werkstattleiter die Reihenfolge der Aufträge vorgeben?", "Die Geschäftsleitung als übergeordnete Instanz", "Die Verkäuferin, weil sie den Termin versprochen hat", "Weisungen laufen über die Instanzen, nicht quer zwischen den Bereichen."),
        decide("Was zeigt der Fall über die Aufbauorganisation?", "Zuständigkeiten sind klar, aber die Bereiche müssen sich besser abstimmen.", "Eine Tischlerei braucht keine Aufbauorganisation.", "Die Aufbauorganisation regelt das Wer; für das reibungslose Wie braucht es auch gute Abläufe."),
      ],
      verdict: "Jeder Bereich hat seine Aufgabe, doch ohne Abstimmung zwischen Absatz, Beschaffung und Produktion kommt es zu Verzögerungen. Das führt zur Ablauforganisation.",
    },
    tasks: {
      1: write(
        "Stelle den Aufbau eines Unternehmens deiner Wahl in Worten als Organigramm dar und nenne für jeden Funktionsbereich eine typische Aufgabe.",
        ["Wer steht ganz oben?", "Welche Bereiche gibt es darunter?"],
        "Ich beschreibe eine Getränkefirma. Ganz oben steht die Geschäftsführung als oberste Instanz. Darunter gibt es fünf Bereiche. Die Beschaffung kauft Früchte, Zucker und Flaschen ein. Die Produktion mischt die Getränke und füllt sie ab. Der Absatz verkauft an Supermärkte und plant Werbung. Die Verwaltung rechnet Löhne ab und führt die Buchhaltung. Die Linien im Organigramm laufen von der Geschäftsführung zu jedem Bereich.",
        ["Nennt eine Leitung an der Spitze", "Nennt die Funktionsbereiche", "Gibt jedem Bereich eine passende Aufgabe"],
      ),
      2: write(
        "Vergleiche die Aufbauorganisation eines kleinen Handwerksbetriebs mit der eines Großunternehmens und erkläre, warum sie sich unterscheiden.",
        ["Wie viele Aufgaben übernimmt eine Person jeweils?", "Wann lohnt es sich, eigene Abteilungen zu bilden?"],
        "Im kleinen Handwerksbetrieb übernimmt eine Person oft mehrere Funktionsbereiche: Der Meister kauft Material ein, arbeitet in der Werkstatt mit, berät Kunden und schreibt Rechnungen. Die Wege sind kurz, und alle sprechen direkt miteinander. Im Großunternehmen gibt es für jeden Bereich eigene Abteilungen mit vielen spezialisierten Stellen und mehreren Leitungsebenen. Der Grund ist die Menge der Aufgaben: Erst wenn es genug Arbeit gibt, lohnt sich die Spezialisierung. Dafür braucht das Großunternehmen klare Weisungswege und mehr Koordination.",
        ["Beschreibt den Kleinbetrieb", "Beschreibt das Großunternehmen", "Erklärt den Unterschied mit der Menge der Aufgaben und der Spezialisierung"],
      ),
    },
  },

  {
    id: "un-ablauf",
    lb: 2,
    unit: "2.1",
    title: "Abläufe im Unternehmen: Kernprozesse und unterstützende Prozesse",
    intro: "Vom Auftrag bis zur Lieferung: Die Ablauforganisation sorgt dafür, dass alles in der richtigen Reihenfolge passiert.",
    paragraphs: [
      "Während die Aufbauorganisation festlegt, wer wofür zuständig ist, regelt die **Ablauforganisation**, wie, wann und in welcher Reihenfolge die Arbeit erledigt wird. Sie beschreibt **Geschäftsprozesse**: Folgen von Tätigkeiten, die mit einem Auslöser beginnen und mit einem Ergebnis enden, etwa vom Eingang einer Bestellung bis zur bezahlten Rechnung.",
      "**Kernprozesse** sind die Abläufe, mit denen ein Unternehmen seine eigentliche Leistung erstellt und die der Kunde bezahlt. In einer Möbelfirma sind das zum Beispiel: Auftrag annehmen, Material beschaffen, Möbel fertigen, ausliefern und abrechnen. Sie laufen quer durch die Funktionsbereiche. **Unterstützende Prozesse** schaffen die Voraussetzungen dafür, ohne selbst die Leistung für den Kunden zu erstellen: Personal einstellen, Maschinen warten, die IT betreuen oder die Buchhaltung führen.",
      "Aufbau- und Ablauforganisation greifen ineinander. Ein Kernprozess durchläuft mehrere Abteilungen: Der Vertrieb nimmt den Auftrag an, der Einkauf bestellt Holz, die Fertigung baut, das Lager versendet. An jeder Schnittstelle können Informationen verloren gehen. Gute Abläufe legen fest, wer was an wen weitergibt, damit Aufträge nicht liegen bleiben.",
      "Hier hilft **Informationstechnologie**. Ein **Warenwirtschaftssystem** zeigt, welches Material vorrätig ist, und löst Bestellungen aus. Eine gemeinsame Unternehmenssoftware, oft ERP-System genannt, verbindet Vertrieb, Einkauf, Fertigung und Buchhaltung: Gibt der Vertrieb einen Auftrag ein, sehen ihn alle anderen Bereiche sofort. Scanner erfassen Waren beim Ein- und Ausgang. Das spart Zeit, vermeidet Fehler und macht jeden Schritt nachvollziehbar.",
    ],
    terms: [
      term("Ablauforganisation", "Regelung von Reihenfolge, Zeit und Ort der Arbeitsschritte in einem Unternehmen."),
      term("Kernprozess", "Ablauf, mit dem ein Unternehmen seine eigentliche Leistung für die Kunden erstellt."),
      term("Unterstützender Prozess", "Ablauf, der die Kernprozesse ermöglicht, etwa Personalverwaltung, Wartung oder IT."),
      term("Warenwirtschaftssystem", "Software, die Bestände, Bestellungen und Warenbewegungen erfasst und steuert."),
    ],
    takeaway:
      "Die Ablauforganisation regelt, wie die Arbeit von Schritt zu Schritt läuft. Kernprozesse erstellen die Leistung für den Kunden, unterstützende Prozesse ermöglichen sie. IT verbindet die Abteilungen und macht Abläufe schneller und weniger fehleranfällig.",
    sourceIds: ["lp"],
    quiz: check(
      "Welcher Ablauf ist in einem Fahrradladen mit Werkstatt ein unterstützender Prozess?",
      "Die Gehaltsabrechnung für die Beschäftigten am Monatsende",
      ["Ein Fahrrad reparieren, das ein Kunde gebracht hat", "Einem Kunden ein neues Fahrrad verkaufen und übergeben"],
      "Reparatur und Verkauf erbringen die Leistung, die der Kunde bezahlt: Das sind Kernprozesse. Die Gehaltsabrechnung ist nötig, aber keine Leistung für den Kunden.",
    ),
    workshop: {
      kind: "timeline",
      title: "Der Kernprozess einer Bestellung",
      instruction: "Bringe die Schritte vom Auftrag bis zur Bezahlung bei einer Möbelfirma in die richtige Reihenfolge.",
      categories: [],
      entries: [
        { text: "Der Vertrieb nimmt die Bestellung eines Kunden für einen Schrank entgegen.", target: 0, feedback: "Der Auftrag löst den Prozess aus." },
        { text: "Das Warenwirtschaftssystem zeigt, dass Holz fehlt; der Einkauf bestellt es.", target: 1, feedback: "Ohne Material kann nicht produziert werden." },
        { text: "Die Fertigung baut den Schrank nach den Maßen des Kunden.", target: 2, feedback: "Jetzt entsteht die eigentliche Leistung." },
        { text: "Das Lager verpackt den Schrank, und eine Spedition liefert ihn aus.", target: 3, feedback: "Das fertige Produkt geht zum Kunden." },
        { text: "Die Buchhaltung schreibt die Rechnung und prüft den Zahlungseingang.", target: 4, feedback: "Der Prozess endet mit der Bezahlung." },
      ],
      conclusion: "Der Kernprozess läuft quer durch alle Bereiche: Jede Schnittstelle braucht klare Übergaben.",
    },
    casework: {
      title: "Die verschwundene Bestellung",
      story:
        "Ein Kunde bestellt im **Onlineshop eines Sportgeschäfts** Laufschuhe. Die Bestellung landet im **E-Mail-Postfach** einer Mitarbeiterin, die krank ist. Erst nach einer Woche fragt der Kunde nach. Inzwischen sind die Schuhe im **Lager** ausverkauft, obwohl die Bestellung früher eingegangen war.",
      steps: [
        decide("Welcher Prozess ist hier gestört?", "Ein Kernprozess, denn die Leistung für den Kunden kommt nicht zustande.", "Ein unterstützender Prozess, denn es geht nur um E-Mails.", "Bestellung, Versand und Lieferung gehören zur eigentlichen Leistung."),
        decide("Wo liegt die Schwachstelle?", "An der Schnittstelle: Die Bestellung hängt an einer einzigen Person.", "Im Lager, weil es zu wenige Schuhe bestellt hat.", "Ein Ablauf, der von einem Postfach abhängt, bricht bei Krankheit zusammen."),
        decide("Wie kann IT den Ablauf verbessern?", "Ein System, das Bestellungen automatisch erfasst, den Bestand reserviert und dem Versand meldet.", "Mehr E-Mail-Postfächer für jede Mitarbeiterin.", "Automatische Erfassung und Reservierung verbinden die Bereiche ohne Lücke."),
      ],
      verdict: "Die Bestellung ging an einer Schnittstelle verloren. Ein klarer Ablauf mit IT-Unterstützung hätte den Bestand reserviert und den Versand sofort informiert.",
    },
    tasks: {
      1: write(
        "Beschreibe den Kernprozess einer Pizzeria vom Anruf eines Kunden bis zur Bezahlung und nenne zwei unterstützende Prozesse.",
        ["Welche Schritte erlebt der Kunde?", "Was muss im Hintergrund passieren, damit das klappt?"],
        "Der Kernprozess beginnt, wenn ein Kunde anruft und eine Pizza bestellt. Die Bestellung wird notiert und an die Küche gegeben, dort wird die Pizza belegt und gebacken. Ein Fahrer liefert sie aus, und der Kunde bezahlt bei der Übergabe. Zwei unterstützende Prozesse sind der Einkauf von Mehl, Käse und Tomaten sowie die Reinigung und Wartung des Pizzaofens. Sie erstellen selbst keine Pizza, sind aber Voraussetzung dafür.",
        ["Beschreibt die Schritte des Kernprozesses in richtiger Reihenfolge", "Nennt zwei passende unterstützende Prozesse", "Grenzt beide Prozessarten ab"],
      ),
      2: write(
        "Erläutere am Beispiel eines Onlineshops, wie Aufbau- und Ablauforganisation zusammenspielen und welchen Mehrwert eine gemeinsame Unternehmenssoftware bringt.",
        ["Welche Abteilungen durchläuft eine Bestellung?", "Was passiert an den Schnittstellen ohne gemeinsame Software?"],
        "Die Aufbauorganisation verteilt die Aufgaben auf Abteilungen: Kundenservice, Einkauf, Lager, Versand und Buchhaltung. Die Ablauforganisation legt fest, wie eine Bestellung diese Abteilungen nacheinander durchläuft. Ohne gemeinsame Software müsste jede Abteilung Informationen per Mail oder Zettel weitergeben, was Zeit kostet und Fehler verursacht. Mit einer gemeinsamen Unternehmenssoftware sieht das Lager eine Bestellung sofort, der Bestand wird automatisch reduziert, und die Buchhaltung kann die Rechnung erstellen. So wird der Ablauf schneller, und jeder Schritt bleibt nachvollziehbar.",
        ["Beschreibt das Zusammenspiel beider Organisationsformen", "Nennt die Probleme an Schnittstellen", "Erklärt den Mehrwert der Software"],
      ),
    },
  },

  {
    id: "un-fertigungstypen",
    lb: 2,
    unit: "2.1",
    title: "Fertigungstypen: Einzel-, Varianten- und Massenfertigung",
    intro: "Eine Hochzeitstorte, ein Auto nach Wunsch, eine Million Schrauben: Jedes Produkt verlangt eine andere Fertigung.",
    paragraphs: [
      "Unternehmen stellen ihre Produkte in sehr unterschiedlichen Mengen her. Nach der Zahl gleicher Stücke unterscheidet man **Fertigungstypen**. Bei der **Einzelfertigung** entsteht jedes Produkt nur einmal, meist nach den Wünschen eines bestimmten Kunden: ein Maßanzug, eine Brücke, eine Hochzeitstorte. Die Fertigung braucht viel Fachwissen, die Kosten je Stück sind hoch, dafür erhält der Kunde genau, was er möchte.",
      "Bei der **Massenfertigung** wird dasselbe Produkt in sehr großen Mengen über lange Zeit hergestellt, etwa Schrauben, Getränkedosen oder Zahnpasta. Weil sich die Fixkosten für Maschinen auf sehr viele Stücke verteilen, sind die **Kosten je Stück** niedrig. Dafür ist die Fertigung wenig flexibel: Individuelle Wünsche sind nicht möglich.",
      "Dazwischen liegt die **Variantenfertigung**: Ein Grundprodukt wird in verschiedenen Ausführungen hergestellt. Ein Autohersteller baut dasselbe Modell mit unterschiedlicher Farbe, Motor und Ausstattung, ein Müsli-Hersteller lässt Kunden ihre Zutaten wählen. So verbindet die Variantenfertigung die niedrigen Kosten großer Stückzahlen mit einer gewissen Auswahl für die Kunden. Werden gleiche Produkte in begrenzter Zahl gefertigt, spricht man auch von Serienfertigung.",
      "Welcher Typ passt, hängt vor allem von zwei Fragen ab: Wie viele Stück werden verkauft, und wie stark bestimmen die Kunden über die Gestaltung mit? Viele Unternehmen kombinieren die Typen. Eine Schreinerei fertigt Einbauschränke nach Maß, kauft die Scharniere aber aus Massenfertigung ein.",
    ],
    terms: [
      term("Einzelfertigung", "Herstellung eines einzelnen Produkts, meist nach individuellem Kundenwunsch."),
      term("Variantenfertigung", "Herstellung eines Grundprodukts in mehreren Ausführungen, aus denen Kunden wählen."),
      term("Massenfertigung", "Herstellung sehr großer Mengen gleicher Produkte über lange Zeit."),
    ],
    takeaway:
      "Einzelfertigung erfüllt individuelle Wünsche zu hohen Stückkosten, Massenfertigung senkt die Stückkosten durch große Mengen gleicher Produkte, und die Variantenfertigung verbindet beides. Die Wahl hängt von Stückzahl und Kundenwunsch ab.",
    sourceIds: ["lp"],
    lab: "fertigung",
    labGoals: ["einzel", "varianten", "masse"],
    quiz: check(
      "Ein Hersteller von E-Bikes baut ein Grundmodell, das Kunden mit drei Akkugrößen und fünf Farben bestellen können. Welcher Fertigungstyp liegt vor?",
      "Variantenfertigung, weil ein Grundprodukt in wählbaren Ausführungen entsteht.",
      ["Einzelfertigung, weil jedes E-Bike für einen bestimmten Kunden bestellt wird.", "Massenfertigung, weil alle E-Bikes auf demselben Grundmodell beruhen."],
      "Das Grundmodell bleibt gleich, die Ausführungen variieren. Echte Einzelfertigung wäre ein völlig eigenes Rad, Massenfertigung böte keine Wahl.",
    ),
    workshop: sort(
      "Welcher Fertigungstyp?",
      "Ordne jedes Produkt dem passenden Fertigungstyp zu.",
      ["Einzelfertigung", "Variantenfertigung", "Massenfertigung"],
      [
        ["Ein Architekt plant ein Einfamilienhaus genau nach den Wünschen einer Familie.", 0, "Das Haus entsteht nur einmal."],
        ["Eine Brauerei füllt täglich Hunderttausende gleiche Flaschen Mineralwasser ab.", 2, "Große Mengen eines gleichen Produkts."],
        ["Ein Sportschuh wird in vielen Größen und Farben aus demselben Schnitt gefertigt.", 1, "Ein Grundprodukt in mehreren Ausführungen."],
        ["Eine Goldschmiedin fertigt einen Verlobungsring nach eigener Zeichnung des Paares.", 0, "Ein Einzelstück nach Kundenwunsch."],
        ["Ein Hersteller produziert Milliarden gleicher Büroklammern.", 2, "Gleiches Produkt in riesiger Stückzahl."],
      ],
      "Stückzahl und Kundenwunsch bestimmen den Fertigungstyp.",
    ),
    casework: {
      title: "Ein Startup für Skateboards",
      story:
        "**Lena und Ole** gründen eine kleine Firma. Zuerst bauen sie **Skateboards nach Kundenwunsch** mit eigenem Design. Weil sie bekannter werden, wollen sie **mehrere Tausend Boards im Jahr** verkaufen und überlegen, wie sie die Fertigung umstellen.",
      steps: [
        decide("Welcher Fertigungstyp liegt am Anfang vor?", "Einzelfertigung", "Massenfertigung", "Jedes Board ist ein Einzelstück nach Kundenwunsch."),
        decide("Welcher Typ passt, wenn Kunden aus fünf Designs und drei Größen wählen sollen?", "Variantenfertigung", "Einzelfertigung", "Ein Grundboard in festgelegten Varianten lässt sich in größeren Mengen herstellen."),
        decide("Was ändert sich bei den Kosten je Stück, wenn die Stückzahl stark steigt?", "Sie sinken, weil sich Fixkosten auf mehr Boards verteilen.", "Sie steigen, weil mehr Material verbraucht wird.", "Mehr Material steigert die Gesamtkosten, die Kosten je Board sinken aber durch die Verteilung der Fixkosten."),
      ],
      verdict: "Mit wachsender Nachfrage wechseln Lena und Ole von der Einzel- zur Variantenfertigung. Die Kunden behalten eine Auswahl, und die Kosten je Board sinken.",
    },
    tasks: {
      1: write(
        "Erkläre die drei Fertigungstypen an je einem eigenen Beispiel und nenne jeweils einen Vorteil.",
        ["Denke an Produkte aus Küche, Kleidung und Technik.", "Wem nützt welcher Typ?"],
        "Einzelfertigung: Ein Schneider näht ein Hochzeitskleid nach den Maßen der Braut. Vorteil: Es passt genau und ist einzigartig. Variantenfertigung: Ein Möbelhaus verkauft ein Sofa in vier Stoffen und drei Größen. Vorteil: Kunden haben Auswahl, trotzdem bleibt der Preis bezahlbar. Massenfertigung: Ein Hersteller produziert Millionen gleicher Kugelschreiber. Vorteil: Die Kosten je Stück sind sehr niedrig, deshalb ist der Kugelschreiber billig.",
        ["Erklärt alle drei Typen", "Gibt zu jedem ein passendes Beispiel", "Nennt je einen Vorteil"],
      ),
      2: write(
        "Ein Hersteller von Maßschuhen überlegt, künftig auch Schuhe in Variantenfertigung anzubieten. Beurteile Chancen und Risiken dieser Entscheidung.",
        ["Was gewinnt er an Kunden und Kosten?", "Was könnte er an Image und Kundenbindung verlieren?"],
        "Eine Chance ist, mehr Kunden zu erreichen: Varianten in festen Größen und Farben sind günstiger, weil sich die Fixkosten auf viele Paare verteilen. Dadurch könnten auch Menschen kaufen, denen Maßschuhe zu teuer sind. Ein Risiko ist, dass der Hersteller sein Image als exklusiver Handwerksbetrieb verliert und mit großen Marken konkurrieren muss. Außerdem braucht er neue Maschinen und Lagerflächen. Ich halte die Entscheidung für sinnvoll, wenn er die Maßschuhe als Premiumangebot behält und die Varianten unter einer eigenen Linie verkauft.",
        ["Nennt Chancen", "Nennt Risiken", "Kommt zu einem begründeten Urteil"],
      ),
    },
  },

  {
    id: "un-fertigungsverfahren",
    lb: 2,
    unit: "2.1",
    title: "Fertigungsverfahren: Werkstatt- und Fließfertigung",
    intro: "Wandert das Werkstück durch Werkstätten oder läuft es auf dem Band? Die Anordnung der Fertigung entscheidet über Tempo und Flexibilität.",
    paragraphs: [
      "Fertigungsverfahren beschreiben, wie Maschinen und Arbeitsplätze angeordnet sind. Bei der **Werkstattfertigung** stehen gleichartige Maschinen in einer Werkstatt zusammen: alle Sägen in der Sägerei, alle Bohrmaschinen in der Bohrerei. Das Werkstück wandert von Werkstatt zu Werkstatt, je nachdem, welche Bearbeitung es braucht. Das Verfahren ist **flexibel**: Jeder Auftrag kann einen eigenen Weg nehmen. Dafür entstehen **lange Transportwege**, Wartezeiten und Zwischenlager. Werkstattfertigung passt zu Einzelfertigung und kleinen Serien.",
      "Bei der **Fließfertigung** sind die Arbeitsplätze in der Reihenfolge der Arbeitsschritte angeordnet. Das Werkstück läuft, oft auf einem Fließband, in einem festen **Takt** von Station zu Station. Wege und Wartezeiten sind kurz, die Kosten je Stück niedrig, und große Stückzahlen sind möglich. Dafür sind die Anlagen teuer und **unflexibel**: Ein anderes Produkt verlangt oft einen Umbau der ganzen Linie. Fällt eine Station aus, steht das ganze Band. Die Arbeit ist meist stark zerlegt und monoton.",
      "Die Wahl des Verfahrens hängt eng mit dem Fertigungstyp zusammen. Massenfertigung und Variantenfertigung in großen Mengen laufen meist in Fließfertigung, wie in der Autoindustrie: Moderne Bänder bauen dabei verschiedene Varianten nacheinander, weil eine Software jeder Station sagt, was sie montieren soll. Einzelstücke und wechselnde kleine Aufträge passen besser zur Werkstattfertigung.",
      "Einen guten Einblick gibt eine **Betriebserkundung**. Achte dabei auf Fragen wie: Wie sind die Maschinen angeordnet? Wie kommt ein Werkstück von einem Arbeitsplatz zum nächsten? Wie viele Stück entstehen am Tag, und wie viele Varianten gibt es? Welche Aufgaben übernimmt die IT, etwa bei der Steuerung des Bandes oder der Lagerhaltung? Mit diesen Beobachtungen kannst du Fertigungstyp und Verfahren des Betriebs bestimmen.",
    ],
    terms: [
      term("Werkstattfertigung", "Gleichartige Maschinen stehen in Werkstätten zusammen; das Werkstück wandert je nach Bedarf."),
      term("Fließfertigung", "Arbeitsplätze sind nach dem Arbeitsablauf angeordnet; das Werkstück läuft im Takt weiter."),
      term("Takt", "Feste Zeit, die jede Station für ihren Arbeitsschritt hat, bevor das Werkstück weiterläuft."),
    ],
    takeaway:
      "Werkstattfertigung ist flexibel, aber langsam und teuer je Stück; sie passt zu Einzelstücken und kleinen Serien. Fließfertigung ist schnell und günstig je Stück, aber unflexibel und teuer in der Anschaffung; sie passt zu großen Stückzahlen.",
    sourceIds: ["lp"],
    lab: "fertigung",
    labGoals: ["einzel", "masse", "fehlgriff"],
    quiz: check(
      "Warum eignet sich die Fließfertigung schlecht für Einzelstücke?",
      "Weil die teure, starre Anlage sich nur bei großen Stückzahlen gleichartiger Produkte lohnt.",
      ["Weil auf einem Fließband nur Lebensmittel und keine anderen Waren gefertigt werden dürfen.", "Weil die Transportwege auf dem Band viel länger sind als in einer Werkstatt."],
      "Fließfertigung verteilt hohe Anschaffungskosten auf viele gleiche Stücke. Ein Einzelstück würde einen Umbau verlangen. Die Wege sind dort gerade kurz.",
    ),
    workshop: sort(
      "Werkstatt oder Fließband?",
      "Ordne jedes Merkmal dem passenden Fertigungsverfahren zu.",
      ["Werkstattfertigung", "Fließfertigung"],
      [
        ["Das Werkstück läuft im festen Takt von Station zu Station.", 1, "Der Takt ist typisch für das Band."],
        ["Alle Drehmaschinen stehen zusammen in einer Halle.", 0, "Gleichartige Maschinen bilden eine Werkstatt."],
        ["Jeder Auftrag kann einen eigenen Weg durch die Fertigung nehmen.", 0, "Diese Flexibilität bietet die Werkstattfertigung."],
        ["Fällt eine Station aus, steht die gesamte Produktion still.", 1, "Am Band hängt jeder Schritt vom vorigen ab."],
        ["Zwischen den Bearbeitungen liegen Teile oft länger im Zwischenlager.", 0, "Lange Wege und Wartezeiten kennzeichnen die Werkstatt."],
      ],
      "Flexibilität gegen Tempo: Das ist der Kern der Entscheidung.",
    ),
    casework: {
      title: "Die Fahrradmanufaktur wächst",
      story:
        "Eine **Fahrradmanufaktur** baut bisher **200 Räder im Jahr**, viele nach Kundenwunsch, in **Werkstattfertigung**. Ein großer Händler will **20.000 gleiche Stadträder im Jahr** abnehmen.",
      steps: [
        decide("Warum passt die Werkstattfertigung bisher gut?", "Weil jedes Rad einen eigenen Weg durch die Werkstätten nehmen kann.", "Weil sie die geringsten Kosten je Stück hat.", "Für viele unterschiedliche Aufträge ist ihre Flexibilität ideal; günstig je Stück ist sie nicht."),
        decide("Welches Verfahren passt zum Großauftrag?", "Fließfertigung", "Werkstattfertigung", "20.000 gleiche Räder rechtfertigen eine Fertigungslinie mit festem Takt."),
        decide("Welches Risiko bringt die Umstellung?", "Hohe Investitionen und Abhängigkeit von einem Großkunden", "Dass die Räder durch das Band automatisch schlechter werden", "Die Linie ist teuer; springt der Händler ab, steht sie still."),
      ],
      verdict: "Für den Großauftrag lohnt sich eine Fließfertigung. Die Manufaktur sollte aber prüfen, ob sie die Werkstatt für Sonderwünsche behält und die Investition tragen kann.",
    },
    tasks: {
      1: write(
        "Vergleiche Werkstatt- und Fließfertigung anhand von drei Merkmalen und nenne zu jedem Verfahren ein passendes Produkt.",
        ["Denke an Flexibilität, Kosten je Stück und Transportwege.", "Welche Produkte entstehen in großer Zahl?"],
        "Bei der Flexibilität ist die Werkstattfertigung überlegen, weil jeder Auftrag seinen eigenen Weg nehmen kann; die Fließfertigung ist auf ein Produkt ausgerichtet. Bei den Kosten je Stück ist die Fließfertigung günstiger, weil große Mengen im Takt laufen. Bei den Transportwegen ist die Fließfertigung besser, weil die Stationen in der Reihenfolge des Ablaufs stehen. Eine Werkstattfertigung passt zu einer Schlosserei, die Treppengeländer nach Maß baut, eine Fließfertigung zur Herstellung von Smartphones.",
        ["Vergleicht drei Merkmale", "Ordnet die Merkmale richtig zu", "Nennt je ein passendes Produkt"],
      ),
      2: write(
        "Plane für eine Betriebserkundung fünf Beobachtungsfragen, mit denen ihr Fertigungstyp und Fertigungsverfahren des Betriebs bestimmen könnt, und begründe sie.",
        ["Was müsst ihr sehen oder erfragen, um den Typ zu bestimmen?", "Woran erkennt ihr das Verfahren?"],
        "Erstens: Wie viele Stück eines Produkts stellt der Betrieb am Tag her? Daran erkennen wir, ob Einzel- oder Massenfertigung vorliegt. Zweitens: Können Kunden Ausstattung oder Farbe wählen? Das zeigt eine Variantenfertigung. Drittens: Sind die Maschinen nach Art oder nach Ablauf angeordnet? Daran erkennen wir Werkstatt- oder Fließfertigung. Viertens: Wie kommt ein Werkstück zur nächsten Station, auf einem Band oder mit dem Hubwagen? Fünftens: Welche Aufgaben übernimmt die IT, zum Beispiel bei der Steuerung des Bandes? Daran sehen wir, wie die Abläufe koordiniert werden.",
        ["Formuliert fünf sinnvolle Fragen", "Ordnet Fragen dem Typ und dem Verfahren zu", "Begründet jede Frage"],
      ),
    },
  },
];
