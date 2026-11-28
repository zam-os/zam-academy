import type { Lesson } from "../model/types";
import { check, decide, sort, term, write } from "./lesson-parts";

export const LB2_2: Lesson[] = [
  {
    id: "ma-praesentation",
    lb: 2,
    unit: "2.2",
    title: "Unternehmenspräsentationen analysieren",
    intro: "Ein neues Produkt wird vorgestellt: Warum begeistert die eine Präsentation, während die andere langweilt?",
    paragraphs: [
      "Unternehmen präsentieren sich und ihre Produkte ständig: auf Messen, in Produktvideos, bei Investoren oder in der Schule bei der Berufsorientierung. Ob eine **Präsentation** wirkt, hängt weniger von der Technik ab als von einigen Grundregeln. Wer sie kennt, kann Präsentationen kritisch analysieren und selbst besser präsentieren.",
      "Die wichtigste Regel ist die **Zielgruppenorientierung**: Wer sitzt im Publikum, was weiß es schon, was interessiert es? Eine Präsentation für Jugendliche über ein neues Handy betont Kamera und Akku, eine für Händler die Gewinnspanne. Die zweite Regel ist die **Reduktion auf das Wesentliche**: Statt alles zu erzählen, wählt man wenige Kernbotschaften aus, die sich das Publikum merken kann.",
      "Die dritte Regel betrifft die **Visualisierung**. Bilder, Diagramme und kurze Stichworte unterstützen das Gesagte, volle Textfolien lenken ab, denn niemand kann gleichzeitig lesen und zuhören. Ein Diagramm sollte eine einzige Aussage zeigen. Die vierte Regel ist die **Sprache**: verständlich, anschaulich, ohne unnötige Fachwörter, mit Beispielen und Geschichten, die im Gedächtnis bleiben. Dazu kommen Körpersprache, Blickkontakt und ein klarer Aufbau mit Einstieg, Hauptteil und Schluss.",
      "Bei der Analyse einer Unternehmenspräsentation fragst du deshalb: Für wen ist sie gemacht? Welche Kernbotschaft bleibt hängen? Unterstützen die Bilder das Gesagte? Ist die Sprache verständlich? Und nicht zuletzt: Welche Absicht steckt dahinter? Unternehmen wollen überzeugen und verkaufen. Eine gute Präsentation kann auch ein mittelmäßiges Produkt glänzend erscheinen lassen.",
    ],
    terms: [
      term("Zielgruppenorientierung", "Ausrichtung einer Präsentation auf Vorwissen, Interessen und Bedürfnisse des Publikums."),
      term("Reduktion", "Beschränkung auf wenige, klare Kernbotschaften statt einer Fülle von Informationen."),
      term("Visualisierung", "Darstellung von Inhalten durch Bilder, Diagramme oder Symbole, die das Gesagte unterstützen."),
    ],
    takeaway:
      "Eine erfolgreiche Präsentation richtet sich an ihre Zielgruppe, beschränkt sich auf das Wesentliche, visualisiert klar und spricht verständlich. Wer Unternehmenspräsentationen analysiert, prüft diese Aspekte und die Absicht dahinter.",
    sourceIds: ["lp"],
    quiz: check(
      "Ein Start-up stellt Schülern seine Lern-App mit 18 Folien voller Text und Fachbegriffen vor. Welcher Aspekt einer erfolgreichen Präsentation wird vor allem verletzt?",
      "Die Reduktion auf das Wesentliche und die Zielgruppenorientierung",
      ["Die Visualisierung, weil Folien grundsätzlich nur Bilder zeigen dürfen und nie Text", "Keiner, denn viele Informationen machen eine Präsentation immer überzeugender"],
      "Zu viel Text und Fachsprache überfordern Schüler. Folien dürfen Stichworte enthalten, doch ganze Texte lenken vom Vortrag ab.",
    ),
    workshop: sort(
      "Welcher Aspekt ist gemeint?",
      "Ordne jede Rückmeldung zu einer Präsentation dem passenden Aspekt zu.",
      ["Zielgruppenorientierung", "Reduktion", "Visualisierung", "Sprache"],
      [
        ["„Ihr habt Rentnern erklärt, wie man Sneaker auf Social Media teilt. Das hat sie kaum interessiert.“", 0, "Inhalt und Publikum passten nicht zusammen."],
        ["„Nach 25 Fakten wusste ich nicht mehr, was das Wichtigste war.“", 1, "Weniger Botschaften bleiben besser hängen."],
        ["„Das Diagramm war so voll, dass ich nichts erkennen konnte.“", 2, "Eine Grafik sollte eine klare Aussage zeigen."],
        ["„Begriffe wie Supply Chain und KPI hat niemand erklärt.“", 3, "Unerklärte Fachwörter erschweren das Verstehen."],
        ["„Die Geschichte der Gründerin hat das Produkt lebendig gemacht.“", 3, "Anschauliche Sprache mit Beispielen wirkt."],
      ],
      "Alle vier Aspekte zusammen entscheiden über die Wirkung.",
    ),
    casework: {
      title: "Zwei Präsentationen, ein Produkt",
      story:
        "Zwei Gruppen stellen eine **wiederverwendbare Trinkflasche** vor. **Gruppe A** zeigt 12 Folien mit technischen Daten in kleiner Schrift und liest sie vor. **Gruppe B** beginnt mit einem Foto vom Müllberg nach dem Schulfest, nennt drei Vorteile und zeigt ein Diagramm mit einer Zahl.",
      steps: [
        decide("Welche Gruppe orientiert sich stärker an ihrem Publikum aus Mitschülern?", "Gruppe B, weil sie mit einer Situation aus deren Alltag einsteigt.", "Gruppe A, weil sie alle technischen Daten vollständig nennt.", "Ein Bezug zur Lebenswelt weckt Interesse; Vollständigkeit überfordert eher."),
        decide("Was ist das Problem beim Vorlesen von Folien?", "Das Publikum liest schneller, als vorgelesen wird, und hört nicht mehr zu.", "Vorlesen wirkt besonders kompetent.", "Doppelte Information lenkt ab; Folien sollen den Vortrag stützen, nicht ersetzen."),
        decide("Was leistet das Diagramm mit nur einer Zahl?", "Es visualisiert eine Kernbotschaft, die man sich merken kann.", "Es ist zu einfach und wirkt unprofessionell.", "Reduktion und klare Visualisierung machen eine Aussage einprägsam."),
      ],
      verdict: "Gruppe B überzeugt durch Zielgruppenbezug, wenige Kernbotschaften und eine klare Grafik. Gruppe A hat mehr Informationen, aber weniger Wirkung.",
    },
    tasks: {
      1: write(
        "Analysiere eine Produktpräsentation oder ein Produktvideo, das du kennst, anhand der vier Aspekte einer erfolgreichen Präsentation.",
        ["Für wen war die Präsentation gemacht?", "Was ist dir noch in Erinnerung?"],
        "Ich habe die Vorstellung einer neuen Spielkonsole angesehen. Die Zielgruppe waren junge Spieler, deshalb ging es vor allem um Grafik und Spiele, nicht um Technik im Detail. Die Präsentation war auf drei Kernbotschaften reduziert: schneller, leiser, mehr Spiele. Zur Visualisierung liefen kurze Spielszenen statt Textfolien. Die Sprache war locker und mit vielen Beispielen. Mir ist vor allem die Botschaft „doppelt so schnell“ in Erinnerung geblieben, was zeigt, dass die Reduktion funktioniert hat.",
        ["Bezieht alle vier Aspekte ein", "Belegt jeden Aspekt am Beispiel", "Beurteilt die Wirkung"],
      ),
      2: write(
        "Beurteile, ob eine sehr gute Präsentation ein Beweis für ein gutes Produkt ist. Begründe aus Sicht eines Käufers.",
        ["Welche Absicht verfolgen Unternehmen mit Präsentationen?", "Was müsstest du zusätzlich prüfen?"],
        "Eine gute Präsentation ist kein Beweis für ein gutes Produkt. Unternehmen präsentieren, um zu überzeugen und zu verkaufen; sie zeigen Stärken und lassen Schwächen weg. Eine geschickte Zielgruppenansprache, einprägsame Bilder und eine mitreißende Sprache können auch ein mittelmäßiges Produkt glänzen lassen. Als Käufer sollte ich deshalb zusätzlich unabhängige Testberichte lesen, Preise vergleichen und prüfen, ob die Versprechen konkret und überprüfbar sind. Die Präsentation zeigt mir, was das Unternehmen betonen will, mehr nicht.",
        ["Nimmt klar Stellung", "Nennt die Absicht von Unternehmen", "Zeigt zusätzliche Prüfschritte"],
      ),
    },
  },

  {
    id: "ma-marketing",
    lb: 2,
    unit: "2.2",
    title: "Marketing auf Käufermärkten",
    intro: "Früher reichte es, gute Produkte herzustellen. Heute entscheidet der Kunde, und das Unternehmen richtet sich nach ihm.",
    paragraphs: [
      "Auf einem **Verkäufermarkt** ist das Angebot knapp und die Nachfrage groß. Die Anbieter haben die stärkere Stellung: Was sie herstellen, verkaufen sie auch. So war es in Deutschland nach dem Zweiten Weltkrieg. Auf einem **Käufermarkt** ist es umgekehrt. Es gibt mehr Angebote, als nachgefragt werden, die Käufer können wählen, und die Anbieter müssen um sie werben. Die meisten Märkte für Konsumgüter sind heute Käufermärkte.",
      "Auf Käufermärkten genügt es nicht, ein Produkt herzustellen und auf Kunden zu warten. **Marketing** bedeutet deshalb mehr als Werbung: Es ist eine **marktorientierte Unternehmensphilosophie**. Das ganze Unternehmen richtet sein Handeln an den Bedürfnissen der Kunden aus, von der Entwicklung über den Preis bis zum Vertrieb. Am Anfang steht die Frage: Was wollen die Kunden, und wie können wir es besser anbieten als die Konkurrenz?",
      "Für den **Unternehmenserfolg** ist Marketing oft entscheidend. Zwei Trinkflaschen können technisch fast gleich sein. Erfolg hat die, deren Hersteller eine Zielgruppe genau versteht, ein ansprechendes Design wählt, den passenden Preis setzt, an den richtigen Orten verkauft und eine überzeugende Geschichte erzählt. Viele Produkte aus deiner Erfahrungswelt, von Sneakern bis Smartphones, verdanken ihren Erfolg weniger einer Erfindung als ihrem Marketing.",
      "Marketing kann aber auch scheitern. Ein Unternehmen, das die Wünsche seiner Kunden falsch einschätzt, bleibt trotz hoher Werbeausgaben auf seinen Produkten sitzen. Und es gibt Grenzen: Marketing darf nicht täuschen, und gutes Marketing ersetzt auf Dauer kein gutes Produkt. Wer enttäuscht, verliert Kunden und Vertrauen.",
    ],
    terms: [
      term("Verkäufermarkt", "Markt, auf dem die Nachfrage das Angebot übersteigt und die Anbieter die stärkere Stellung haben."),
      term("Käufermarkt", "Markt, auf dem das Angebot die Nachfrage übersteigt und die Käufer zwischen vielen Angeboten wählen."),
      term("Marketing", "Marktorientierte Unternehmensphilosophie, die alle Entscheidungen an den Kundenbedürfnissen ausrichtet."),
    ],
    takeaway:
      "Auf Käufermärkten haben die Kunden die Wahl. Marketing ist deshalb eine Unternehmensphilosophie, die alle Entscheidungen an den Kundenbedürfnissen ausrichtet, und oft der Schlüssel zum Unternehmenserfolg.",
    sourceIds: ["lp"],
    quiz: check(
      "Woran erkennst du einen Käufermarkt?",
      "Es gibt mehr Angebote als Nachfrage, und die Anbieter müssen um die Käufer werben.",
      ["Die Käufer stehen Schlange, weil die Ware knapp ist und schnell vergriffen sein wird.", "Es gibt nur einen einzigen Anbieter, der die Preise allein bestimmen kann."],
      "Auf einem Käufermarkt sind die Kunden in der stärkeren Stellung. Lange Schlangen zeigen eher einen Verkäufermarkt, ein einziger Anbieter ein Monopol.",
    ),
    workshop: sort(
      "Käufer- oder Verkäufermarkt?",
      "Ordne jede Marktsituation ein.",
      ["Käufermarkt", "Verkäufermarkt"],
      [
        ["Im Supermarkt stehen über 40 Sorten Joghurt nebeneinander.", 0, "Riesige Auswahl, die Käufer haben die Wahl."],
        ["Nach dem Krieg bekommt man Butter nur mit Bezugsschein.", 1, "Knappes Angebot, die Anbieter bestimmen."],
        ["Konzertkarten eines Weltstars sind in zwei Minuten ausverkauft.", 1, "Die Nachfrage übersteigt das Angebot deutlich."],
        ["Zehn Handyanbieter überbieten sich mit Rabatten für Neukunden.", 0, "Anbieter werben um Kunden."],
        ["In einer Großstadt gibt es Hunderte Pizzerien mit Lieferdienst.", 0, "Viele Anbieter, die Kunden wählen aus."],
      ],
      "Je größer die Auswahl der Kunden, desto wichtiger wird Marketing.",
    ),
    casework: {
      title: "Zwei Trinkflaschen",
      story:
        "Zwei Firmen bringen fast gleiche **Edelstahl-Trinkflaschen** auf den Markt. **Firma A** produziert die Flasche in einer Farbe und stellt sie in Baumärkte. **Firma B** fragt vorher **200 Schüler**, bietet zwölf Farben mit Stickern an, verkauft in Sportgeschäften und online und lässt Influencer berichten.",
      steps: [
        decide("Welche Firma handelt marktorientiert?", "Firma B, weil sie sich an den Wünschen ihrer Zielgruppe ausrichtet.", "Firma A, weil sie Kosten bei Farben und Werbung spart.", "Marktorientierung beginnt mit den Kundenbedürfnissen."),
        decide("Was zeigt die Befragung der Schüler?", "Marketing beginnt vor der Produktion mit der Analyse des Marktes.", "Marketing besteht nur aus Werbung nach dem Verkaufsstart.", "Marketing umfasst alle Entscheidungen, nicht nur die Werbung."),
        decide("Warum hat Firma B wahrscheinlich mehr Erfolg, obwohl die Flaschen fast gleich sind?", "Weil Design, Preis, Vertrieb und Kommunikation zur Zielgruppe passen.", "Weil ihre Flasche technisch viel besser ist.", "Auf Käufermärkten entscheidet oft das Marketing über den Erfolg."),
      ],
      verdict: "Bei fast gleichen Produkten macht das Marketing den Unterschied. Firma B richtet alle Entscheidungen an ihrer Zielgruppe aus.",
    },
    tasks: {
      1: write(
        "Erkläre den Unterschied zwischen Käufer- und Verkäufermarkt und warum Marketing auf Käufermärkten so wichtig ist.",
        ["Wer hat jeweils die stärkere Stellung?", "Was müssen Anbieter tun, wenn Kunden wählen können?"],
        "Auf einem Verkäufermarkt ist die Ware knapp, die Nachfrage groß, und die Anbieter haben die stärkere Stellung: Sie verkaufen fast alles, was sie herstellen. Auf einem Käufermarkt gibt es mehr Angebote, als nachgefragt werden, und die Kunden können wählen. Deshalb müssen Anbieter herausfinden, was ihre Kunden wollen, und ihr Angebot besser gestalten als die Konkurrenz. Marketing als marktorientierte Unternehmensphilosophie richtet dafür alle Entscheidungen an den Kunden aus.",
        ["Erklärt beide Marktformen", "Nennt, wer die stärkere Stellung hat", "Begründet die Bedeutung des Marketings"],
      ),
      2: write(
        "Schätze am Beispiel eines Produkts aus deiner Erfahrungswelt die Bedeutung des Marketings für den Unternehmenserfolg ein.",
        ["Warum kaufen viele genau dieses Produkt und nicht ein ähnliches?", "Was würde ohne Marketing passieren?"],
        "Ein Beispiel ist eine bekannte Sneaker-Marke. Technisch sind viele Sportschuhe ähnlich, aber diese Marke verkauft sich besonders gut. Das liegt an ihrem Marketing: limitierte Auflagen erzeugen Begehrlichkeit, Sportstars und Influencer tragen die Schuhe, und der Preis ist bewusst hoch, was den Schuh exklusiv wirken lässt. Ohne dieses Marketing wäre der Schuh vermutlich einer unter vielen. Ich schätze die Bedeutung des Marketings deshalb als sehr hoch ein, wobei die Qualität stimmen muss, damit Kunden wiederkommen.",
        ["Wählt ein konkretes Produkt", "Nennt Marketingmaßnahmen und ihre Wirkung", "Kommt zu einer begründeten Einschätzung"],
      ),
    },
  },

  {
    id: "ma-marktanalyse",
    lb: 2,
    unit: "2.2",
    title: "Marktanalyse und Marketing-Mix",
    intro: "Wer etwas verkaufen will, muss seinen Markt kennen. Dann setzt er vier Werkzeuge aufeinander abgestimmt ein.",
    paragraphs: [
      "Am Anfang jeder Marketingentscheidung steht die **Marktanalyse**. Das Unternehmen sammelt Informationen über Kunden, Konkurrenten und die Entwicklung des Marktes. Bei der **Primärforschung** erhebt es neue Daten selbst, etwa durch Befragungen, Beobachtungen oder Tests. Bei der **Sekundärforschung** wertet es vorhandene Daten aus, zum Beispiel Statistiken, Studien oder Verkaufszahlen. Ein zentrales Ergebnis ist die **Zielgruppe**: Welche Menschen sollen das Produkt kaufen, wie alt sind sie, was ist ihnen wichtig?",
      "Wichtige **Marktkennzahlen** beschreiben die Größe des Marktes. Das **Marktpotenzial** ist die größtmögliche Absatzmenge, wenn alle möglichen Käufer kaufen würden. Das **Marktvolumen** ist die tatsächlich verkaufte Menge aller Anbieter in einem Zeitraum. Der **Absatz** eines Unternehmens ist seine eigene verkaufte Menge. Daraus ergibt sich der **Marktanteil**: Absatz geteilt durch Marktvolumen mal 100. Verkauft ein Hersteller 50.000 von insgesamt 400.000 Trinkflaschen, hat er einen Marktanteil von 12,5 %.",
      "Mit den Ergebnissen der Analyse plant das Unternehmen den **Marketing-Mix**. Er besteht aus vier Instrumenten, die aufeinander abgestimmt sein müssen. Die **Produkt- und Sortimentspolitik** entscheidet, was angeboten wird. Die **Preispolitik** legt Preise und Konditionen fest. Die **Distributionspolitik** bestimmt, auf welchen Wegen das Produkt zum Kunden kommt. Die **Kommunikationspolitik** entscheidet, wie das Unternehmen mit seinen Kunden spricht, etwa durch Werbung.",
      "Die Instrumente wirken nur zusammen. Ein Luxusparfüm mit edlem Flakon passt nicht zu einem Dumpingpreis im Discounter und zu billiger Werbung. Ein stimmiger Mix richtet alle vier Instrumente auf dieselbe Zielgruppe und dasselbe Bild des Produkts aus.",
    ],
    terms: [
      term("Marktanalyse", "Systematische Untersuchung von Kunden, Konkurrenz und Marktentwicklung."),
      term("Marktvolumen", "Tatsächlich verkaufte Menge oder Umsatz aller Anbieter auf einem Markt in einem Zeitraum."),
      term("Marktanteil", "Anteil des eigenen Absatzes am Marktvolumen in Prozent."),
      term("Marketing-Mix", "Abgestimmter Einsatz von Produkt-, Preis-, Distributions- und Kommunikationspolitik."),
    ],
    takeaway:
      "Die Marktanalyse ermittelt Zielgruppe, Konkurrenz und Kennzahlen wie Marktvolumen und Marktanteil. Darauf baut der Marketing-Mix aus Produkt-, Preis-, Distributions- und Kommunikationspolitik auf, deren Instrumente zusammenpassen müssen.",
    sourceIds: ["lp"],
    practice: "marktanteil",
    visual: { title: "Die vier Instrumente des Marketing-Mix", layout: "comparison", steps: ["Produkt · Was bieten wir an?", "Preis · Was verlangen wir?", "Distribution · Wo verkaufen wir?", "Kommunikation · Wie sprechen wir die Kunden an?"] },
    quiz: check(
      "Auf einem Markt werden im Jahr 800.000 Fahrradhelme verkauft. Ein Hersteller verkauft 120.000 Stück. Wie hoch ist sein Marktanteil?",
      "15 %, denn 120.000 geteilt durch 800.000 mal 100 ergibt 15.",
      ["6,7 %, denn 800.000 geteilt durch 120.000 ergibt etwa 6,7.", "120.000 %, denn der Absatz selbst ist schon der Anteil."],
      "Marktanteil ist eigener Absatz geteilt durch Marktvolumen mal 100. Wer die Größen vertauscht, erhält einen falschen Wert.",
    ),
    workshop: sort(
      "Welches Instrument des Marketing-Mix?",
      "Ordne jede Entscheidung eines Herstellers von Müsliriegeln dem passenden Instrument zu.",
      ["Produktpolitik", "Preispolitik", "Distributionspolitik", "Kommunikationspolitik"],
      [
        ["Eine neue Sorte ohne Zuckerzusatz kommt ins Sortiment.", 0, "Es geht um das Angebot selbst."],
        ["Im ersten Monat kostet der Riegel nur 0,79 € statt 0,99 €.", 1, "Preise und Rabatte sind Preispolitik."],
        ["Die Riegel gibt es jetzt auch in Automaten an Bahnhöfen.", 2, "Ein neuer Weg zum Kunden."],
        ["Eine Kampagne in sozialen Medien zeigt Sportlerinnen mit dem Riegel.", 3, "Wie das Unternehmen mit Kunden spricht."],
        ["Die Verpackung wird kompostierbar und neu gestaltet.", 0, "Verpackung und Gestaltung gehören zur Produktpolitik."],
      ],
      "Erst wenn alle vier Instrumente zusammenpassen, entsteht ein stimmiger Marketing-Mix.",
    ),
    casework: {
      title: "Der Markt für Schul-Trinkflaschen",
      story:
        "Ein Start-up will Trinkflaschen für Schüler verkaufen. Es schätzt, dass **2 Millionen** Schüler eine solche Flasche kaufen würden. Tatsächlich werden im Jahr **800.000** Stück verkauft. Das Start-up selbst verkauft **40.000** Flaschen. Vorher hat es **300 Schüler befragt**.",
      steps: [
        decide("Was ist die Befragung der Schüler?", "Primärforschung, weil das Start-up die Daten selbst erhebt.", "Sekundärforschung, weil Schüler schon Flaschen kennen.", "Selbst erhobene Daten sind Primärforschung."),
        decide("Was sind die 2 Millionen?", "Das Marktpotenzial", "Das Marktvolumen", "Das Potenzial ist die größtmögliche Menge, das Volumen die tatsächlich verkaufte."),
        decide("Wie hoch ist der Marktanteil des Start-ups?", "5 %", "2 %", "40.000 : 800.000 · 100 = 5 %. Die 2 % entstehen, wenn man fälschlich durch das Marktpotenzial teilt."),
      ],
      verdict: "Das Start-up kennt seinen Markt: Potenzial 2 Millionen, Volumen 800.000, eigener Anteil 5 %. Der Markt ist noch nicht gesättigt, es gibt Wachstumschancen.",
    },
    tasks: {
      1: write(
        "Erkläre die Begriffe Marktpotenzial, Marktvolumen und Marktanteil an einem selbst gewählten Zahlenbeispiel.",
        ["Wähle einen Markt, etwa für Kopfhörer oder Fahrräder.", "Rechne den Marktanteil aus."],
        "Ich betrachte den Markt für kabellose Kopfhörer in einer Stadt. Würden alle 100.000 Einwohner, die Interesse haben, welche kaufen, wäre das Marktpotenzial 100.000 Stück. Tatsächlich werden im Jahr 60.000 Stück verkauft, das ist das Marktvolumen. Ein Hersteller verkauft davon 9.000 Stück. Sein Marktanteil beträgt 9.000 : 60.000 · 100 = 15 %. Der Unterschied zwischen Potenzial und Volumen zeigt, dass der Markt noch wachsen kann.",
        ["Erklärt alle drei Begriffe", "Rechnet den Marktanteil richtig aus", "Deutet den Abstand zwischen Potenzial und Volumen"],
      ),
      2: write(
        "Ein Hersteller von Luxusuhren plant, seine Uhren künftig auch im Discounter zu verkaufen. Beurteile diese Entscheidung mithilfe des Marketing-Mix.",
        ["Passt der neue Vertriebsweg zu Produkt, Preis und Kommunikation?", "Was erwarten die bisherigen Kunden?"],
        "Die Entscheidung betrifft die Distributionspolitik, passt aber nicht zu den anderen Instrumenten. Die Produktpolitik setzt auf hochwertige Uhren, die Preispolitik auf hohe Preise, und die Kommunikationspolitik vermittelt Exklusivität. Ein Verkauf im Discounter würde dieses Bild beschädigen, weil Luxus dort nicht erwartet wird. Bisherige Kunden könnten sich abwenden, weil die Marke ihren besonderen Ruf verliert. Kurzfristig steigt vielleicht der Absatz, langfristig schadet der unstimmige Marketing-Mix der Marke. Ich halte die Entscheidung daher für falsch.",
        ["Ordnet die Entscheidung einem Instrument zu", "Prüft die Abstimmung mit den anderen Instrumenten", "Kommt zu einem begründeten Urteil"],
      ),
    },
  },

  {
    id: "ma-produkt",
    lb: 2,
    unit: "2.2",
    title: "Produkt- und Sortimentspolitik: der Produktlebenszyklus",
    intro: "Produkte werden geboren, wachsen, altern und verschwinden. Wer den Lebenszyklus kennt, plant rechtzeitig.",
    paragraphs: [
      "Die **Produktpolitik** entscheidet, welche Produkte ein Unternehmen anbietet und wie sie gestaltet sind: Qualität, Design, Verpackung, Marke und Service. Ein wichtiges Werkzeug ist das Modell des **Produktlebenszyklus**. Es beschreibt, wie sich Umsatz und Gewinn eines Produkts von der Markteinführung bis zum Rückzug entwickeln, in fünf Phasen.",
      "In der **Einführungsphase** ist das Produkt neu und kaum bekannt. Der Umsatz ist niedrig, die Kosten für Entwicklung und Werbung sind hoch, der Gewinn ist meist negativ. In der **Wachstumsphase** steigt der Umsatz schnell, das Produkt erreicht die Gewinnzone, Nachahmer tauchen auf. In der **Reifephase** erreicht der Umsatz seinen Höhepunkt, der Gewinn beginnt bereits zu sinken, weil der Wettbewerb härter wird. In der **Sättigungsphase** haben die meisten Interessenten das Produkt, der Umsatz stagniert. In der **Rückgangsphase** sinken Umsatz und Gewinn deutlich.",
      "Je nach Phase trifft das Unternehmen andere Entscheidungen. Eine **Produktinnovation** bringt ein ganz neues Produkt auf den Markt. Eine **Produktvariation** verändert ein bestehendes Produkt, etwa durch eine neue Farbe, einen besseren Akku oder einen Relaunch mit neuem Design; so kann der Lebenszyklus verlängert werden. Bei der **Produktelimination** nimmt das Unternehmen ein Produkt vom Markt, wenn es sich nicht mehr lohnt.",
      "Zur **Sortimentspolitik** gehört die Entscheidung, wie breit und tief das Angebot ist. Ein **breites Sortiment** umfasst viele verschiedene Warengruppen, ein **tiefes Sortiment** viele Varianten innerhalb einer Gruppe. Eine starke **Marke** hilft in allen Phasen: Sie macht ein Produkt wiedererkennbar, schafft Vertrauen und erlaubt oft höhere Preise. Ein Unternehmen sollte Produkte in verschiedenen Phasen haben, damit die Gewinne der reifen Produkte die Einführung neuer finanzieren.",
    ],
    terms: [
      term("Produktlebenszyklus", "Modell, das die Entwicklung von Umsatz und Gewinn eines Produkts in fünf Phasen beschreibt."),
      term("Produktvariation", "Veränderung eines bestehenden Produkts, um seinen Lebenszyklus zu verlängern."),
      term("Produktelimination", "Herausnahme eines Produkts aus dem Angebot, wenn es sich nicht mehr lohnt."),
      term("Sortiment", "Gesamtheit der Produkte eines Anbieters; breit bei vielen Warengruppen, tief bei vielen Varianten."),
    ],
    takeaway:
      "Der Produktlebenszyklus hat die Phasen Einführung, Wachstum, Reife, Sättigung und Rückgang. Je nach Phase setzen Unternehmen auf Innovation, Variation oder Elimination und gestalten Sortiment und Marke so, dass Produkte in verschiedenen Phasen sich ergänzen.",
    sourceIds: ["lp"],
    lab: "lebenszyklus",
    labGoals: ["reife", "variation", "elimination"],
    quiz: check(
      "In welcher Phase des Produktlebenszyklus ist der Gewinn typischerweise negativ, obwohl schon verkauft wird?",
      "In der Einführungsphase, weil Entwicklung und Werbung hohe Kosten verursachen.",
      ["In der Reifephase, weil der Umsatz dort seinen Höhepunkt erreicht hat und dann fällt.", "In der Wachstumsphase, weil die Konkurrenz dort das Produkt bereits nachahmt."],
      "Am Anfang decken die Erlöse die hohen Startkosten noch nicht. In der Reife ist der Umsatz am höchsten, im Wachstum erreicht das Produkt die Gewinnzone.",
    ),
    workshop: {
      kind: "timeline",
      title: "Die Phasen des Produktlebenszyklus",
      instruction: "Bringe die Beschreibungen einer neuen Spielkonsole in die Reihenfolge des Lebenszyklus.",
      categories: [],
      entries: [
        { text: "Die Konsole kommt neu auf den Markt; Werbung macht sie bekannt, der Gewinn ist noch negativ.", target: 0, feedback: "Das ist die Einführung." },
        { text: "Immer mehr Spieler kaufen sie; der Umsatz steigt schnell, erste Gewinne entstehen.", target: 1, feedback: "Das ist das Wachstum." },
        { text: "Der Umsatz erreicht seinen Höhepunkt, Konkurrenten bieten ähnliche Geräte an.", target: 2, feedback: "Das ist die Reife." },
        { text: "Fast alle Interessierten haben eine Konsole; der Hersteller bringt eine neue Farbversion heraus.", target: 3, feedback: "In der Sättigung hilft eine Variation." },
        { text: "Die Nachfolgerin erscheint, der Umsatz bricht ein, die alte Konsole wird eingestellt.", target: 4, feedback: "Im Rückgang folgt die Elimination." },
      ],
      conclusion: "Jede Phase verlangt andere Entscheidungen der Produktpolitik.",
    },
    casework: {
      title: "Die Smartwatch wird älter",
      story:
        "Eine **Smartwatch** ist seit drei Jahren auf dem Markt. Der **Umsatz stagniert** seit Monaten, fast alle Stammkunden haben eine. Ein Konkurrent hat ein günstigeres Modell herausgebracht. Die Geschäftsführung überlegt, was zu tun ist.",
      steps: [
        decide("In welcher Phase befindet sich die Smartwatch?", "In der Sättigungsphase", "In der Einführungsphase", "Stagnierender Umsatz bei großer Verbreitung kennzeichnet die Sättigung."),
        decide("Welche Maßnahme kann den Lebenszyklus verlängern?", "Eine Produktvariation, etwa neue Armbänder und ein besserer Akku", "Die sofortige Produktelimination", "Eine Variation bietet neue Kaufgründe; eine Elimination wäre verfrüht."),
        decide("Warum braucht der Hersteller zugleich neue Produkte?", "Damit nach dem Rückgang dieser Uhr andere Produkte die Gewinne sichern.", "Weil das Gesetz vorschreibt, jedes Jahr neue Produkte anzubieten.", "Ein Sortiment mit Produkten in verschiedenen Phasen sichert den Erfolg."),
      ],
      verdict: "Die Smartwatch steckt in der Sättigung. Eine Variation kann sie verlängern, doch der Hersteller muss rechtzeitig Nachfolger entwickeln.",
    },
    tasks: {
      1: write(
        "Beschreibe die fünf Phasen des Produktlebenszyklus an einem Produkt, dessen Entwicklung du verfolgt hast, und nenne für zwei Phasen eine passende Maßnahme.",
        ["Denke an ein Spiel, ein Getränk oder ein Gerät.", "Wie hat sich der Umsatz verändert?"],
        "Ein Beispiel ist ein Handyspiel. In der Einführung kannten es nur wenige, der Hersteller machte viel Werbung. Im Wachstum luden es immer mehr Freunde herunter. In der Reife spielten es fast alle in meiner Klasse, und ähnliche Spiele kamen heraus. In der Sättigung wuchs die Zahl der Spieler kaum noch; der Hersteller brachte neue Level heraus, eine Produktvariation. Im Rückgang spielten es immer weniger, und schließlich wurde es eingestellt, eine Elimination.",
        ["Beschreibt alle fünf Phasen am Beispiel", "Nennt zwei passende Maßnahmen", "Ordnet die Maßnahmen den richtigen Phasen zu"],
      ),
      2: write(
        "Ein Getränkehersteller hat nur ein einziges, sehr erfolgreiches Produkt in der Reifephase. Beurteile seine Lage und gib eine Empfehlung für seine Produkt- und Sortimentspolitik.",
        ["Was passiert, wenn das Produkt in die Sättigung und den Rückgang kommt?", "Wie hilft ein breiteres oder tieferes Sortiment?"],
        "Die Lage ist kurzfristig gut, weil der Umsatz in der Reife am höchsten ist. Langfristig ist sie riskant: Kommt das Getränk in die Sättigung und den Rückgang, bricht der gesamte Umsatz des Herstellers weg, weil er kein anderes Produkt hat. Ich empfehle, die Gewinne der Reifephase in Innovationen zu investieren und das Sortiment zu vertiefen, etwa durch neue Sorten. So hat der Hersteller später Produkte in verschiedenen Phasen. Zusätzlich kann er das bekannte Getränk durch eine Variation, etwa eine zuckerfreie Version, verlängern.",
        ["Beurteilt kurz- und langfristige Lage", "Bezieht den Lebenszyklus ein", "Gibt eine begründete Empfehlung zu Sortiment und Innovation"],
      ),
    },
  },

  {
    id: "ma-portfolio",
    lb: 2,
    unit: "2.2",
    title: "Die Vier-Felder-Portfolioanalyse",
    intro: "Stars, Cash Cows, Question Marks und Poor Dogs: Die Portfolioanalyse ordnet alle Produkte eines Unternehmens.",
    paragraphs: [
      "Die meisten Unternehmen bieten mehrere Produkte an. Die **Vier-Felder-Portfolioanalyse** hilft zu entscheiden, in welche Produkte sie investieren sollen. Sie ordnet jedes Produkt nach zwei Merkmalen ein: dem **Marktwachstum**, also wie schnell der Markt wächst, und dem **relativen Marktanteil**. Der relative Marktanteil vergleicht den eigenen Marktanteil mit dem des größten Konkurrenten. Ein Wert über 1 bedeutet: Das Unternehmen ist Marktführer.",
      "Daraus ergeben sich vier Felder. **Question Marks** (Fragezeichen) stehen auf wachsenden Märkten, haben aber einen kleinen Anteil; sie sind oft neue Produkte mit ungewisser Zukunft. **Stars** haben einen hohen Anteil auf einem wachsenden Markt; sie sind erfolgreich, brauchen aber Investitionen, um vorne zu bleiben. **Cash Cows** (Melkkühe) haben einen hohen Anteil auf einem kaum noch wachsenden Markt; sie bringen hohe Überschüsse bei geringem Aufwand. **Poor Dogs** (arme Hunde) haben einen kleinen Anteil auf einem kaum wachsenden Markt.",
      "Für jedes Feld gibt es eine **Normstrategie**. Bei Question Marks muss das Unternehmen entscheiden: gezielt investieren, damit ein Star daraus wird, oder aufgeben. Stars werden gefördert. Cash Cows werden gehalten und „gemolken“: Ihre Gewinne finanzieren Question Marks und Stars. Bei Poor Dogs prüft das Unternehmen den Rückzug vom Markt, also die Elimination.",
      "Die Portfolioanalyse hängt eng mit dem Produktlebenszyklus zusammen: Neue Produkte starten oft als Question Marks, werden im besten Fall zu Stars, reifen zu Cash Cows und enden als Poor Dogs. Ein **ausgewogenes Portfolio** hat Produkte in mehreren Feldern. Die Grenzen der Methode: Sie vereinfacht stark, und die Grenzwerte zwischen den Feldern, etwa 10 % Marktwachstum, sind nur grobe Richtwerte.",
    ],
    terms: [
      term("Relativer Marktanteil", "Eigener Marktanteil geteilt durch den Marktanteil des größten Konkurrenten."),
      term("Star", "Produkt mit hohem relativem Marktanteil auf einem stark wachsenden Markt."),
      term("Cash Cow", "Produkt mit hohem relativem Marktanteil auf einem kaum wachsenden Markt; es bringt hohe Überschüsse."),
      term("Question Mark", "Produkt mit kleinem relativem Marktanteil auf einem wachsenden Markt; seine Zukunft ist offen."),
      term("Poor Dog", "Produkt mit kleinem relativem Marktanteil auf einem kaum wachsenden Markt."),
    ],
    takeaway:
      "Die Vier-Felder-Portfolioanalyse ordnet Produkte nach Marktwachstum und relativem Marktanteil in Question Marks, Stars, Cash Cows und Poor Dogs. Cash Cows finanzieren die Entwicklung neuer Produkte; ein ausgewogenes Portfolio verteilt die Risiken.",
    sourceIds: ["lp"],
    lab: "portfolio",
    quiz: check(
      "Ein Produkt hat einen relativen Marktanteil von 1,8 auf einem Markt, der nur noch um 2 % im Jahr wächst. In welchem Feld liegt es?",
      "Es ist eine Cash Cow: hoher Anteil auf einem kaum wachsenden Markt.",
      ["Es ist ein Star, weil sein relativer Marktanteil deutlich über 1 liegt und steigt.", "Es ist ein Poor Dog, weil der Markt mit 2 % kaum noch wächst und schrumpfen wird."],
      "Ein hoher relativer Marktanteil bei geringem Wachstum kennzeichnet die Cash Cow. Ein Star bräuchte einen stark wachsenden Markt, ein Poor Dog einen kleinen Anteil.",
    ),
    workshop: sort(
      "In welchem Feld liegt das Produkt?",
      "Ordne die Produkte eines Sportartikelherstellers den Feldern der Portfolioanalyse zu.",
      ["Question Mark", "Star", "Cash Cow", "Poor Dog"],
      [
        ["Ein neuer Padel-Schläger auf einem schnell wachsenden Markt, aber mit kleinem Anteil", 0, "Wachsender Markt, kleiner Anteil: Die Zukunft ist offen."],
        ["Laufschuhe, mit denen der Hersteller einen stark wachsenden Markt anführt", 1, "Hoher Anteil und starkes Wachstum."],
        ["Klassische Fußbälle, bei denen er seit Jahren Marktführer auf einem stabilen Markt ist", 2, "Hoher Anteil, kaum Wachstum: Sie bringen hohe Überschüsse."],
        ["Inlineskates mit kleinem Anteil auf einem schrumpfenden Markt", 3, "Kleiner Anteil, kein Wachstum."],
      ],
      "Jedes Feld verlangt eine andere Strategie.",
    ),
    casework: {
      title: "Das Portfolio eines Getränkeherstellers",
      story:
        "Ein Getränkehersteller hat drei Produkte: eine **klassische Limonade** (Marktführer, Markt wächst kaum), einen **neuen Eistee** (kleiner Anteil, Markt wächst um 15 % im Jahr) und einen **Malzdrink** (kleiner Anteil, Markt schrumpft).",
      steps: [
        decide("Welche Rolle spielt die Limonade?", "Sie ist eine Cash Cow und liefert Geld für andere Produkte.", "Sie ist ein Poor Dog, weil ihr Markt nicht wächst.", "Der hohe Marktanteil macht sie trotz geringen Wachstums zur Cash Cow."),
        decide("Was empfiehlt die Normstrategie für den Eistee?", "Gezielt investieren oder aufgeben, je nach Erfolgsaussicht", "Nichts tun und die Gewinne abschöpfen", "Ein Question Mark verlangt eine Entscheidung über Investition oder Rückzug."),
        decide("Was sollte mit dem Malzdrink geschehen?", "Den Rückzug vom Markt prüfen", "Massiv in Werbung investieren, damit er zum Star wird", "Bei kleinem Anteil auf einem schrumpfenden Markt sind Investitionen kaum aussichtsreich."),
      ],
      verdict: "Die Limonade als Cash Cow finanziert den Eistee als Question Mark. Für den Malzdrink als Poor Dog prüft das Unternehmen den Rückzug.",
    },
    tasks: {
      1: write(
        "Erkläre die vier Felder der Portfolioanalyse und ihre Normstrategien an je einem ausgedachten Beispiel.",
        ["Welche zwei Merkmale bestimmen das Feld?", "Welche Produkte brauchen Geld, welche bringen Geld?"],
        "Ein Question Mark ist etwa eine neue Smartwatch für Kinder auf einem schnell wachsenden Markt mit kleinem Anteil; das Unternehmen investiert gezielt oder gibt auf. Ein Star ist ein Kopfhörer, mit dem es einen wachsenden Markt anführt; es investiert weiter. Eine Cash Cow ist ein seit Jahren führendes Radio auf einem stabilen Markt; seine Gewinne werden abgeschöpft. Ein Poor Dog ist ein DVD-Player mit kleinem Anteil auf einem schrumpfenden Markt; das Unternehmen prüft den Rückzug.",
        ["Nennt die beiden Merkmale", "Erklärt alle vier Felder mit Beispiel", "Nennt die passende Normstrategie"],
      ),
      2: write(
        "Ein Unternehmen hat nur Stars und Question Marks, aber keine Cash Cows. Beurteile, ob das Portfolio ausgewogen ist.",
        ["Welche Produkte brauchen Investitionen?", "Woher kommt das Geld dafür?"],
        "Das Portfolio ist nicht ausgewogen. Stars und Question Marks stehen auf wachsenden Märkten und brauchen hohe Investitionen in Werbung, Entwicklung und Produktion. Normalerweise finanzieren Cash Cows diese Investitionen mit ihren Überschüssen. Fehlen sie, muss das Unternehmen Kredite aufnehmen oder Investoren finden, was riskant ist. Die Chancen sind groß, wenn die Stars später zu Cash Cows reifen. Bis dahin ist das Unternehmen aber stark gefährdet, wenn ein Produkt scheitert. Ein ausgewogenes Portfolio hätte auch Produkte, die sicher Geld verdienen.",
        ["Beurteilt die Ausgewogenheit", "Erklärt den Finanzierungsbedarf", "Bezieht Chancen und Risiken ein"],
      ),
    },
  },

  {
    id: "ma-preis",
    lb: 2,
    unit: "2.2",
    title: "Preispolitik: Strategien, Konditionen und Kalkulation",
    intro: "Wie viel darf ein Helm kosten? Der Preis muss die Kosten decken, zur Strategie passen und die Kunden überzeugen.",
    paragraphs: [
      "Die **Preispolitik** legt fest, zu welchem Preis und zu welchen Bedingungen ein Produkt verkauft wird. Grundlage ist die **Preiskalkulation**. Zu den **Selbstkosten**, die für Material, Löhne, Miete und Verwaltung je Stück anfallen, kommt ein **Gewinnzuschlag** in Prozent. Das ergibt den **Nettoverkaufspreis**. Darauf schlägt der Händler die **Umsatzsteuer** auf, meist 19 %, und erhält den **Bruttoverkaufspreis**, den der Kunde zahlt. Beispiel: Selbstkosten 40 €, Gewinnzuschlag 20 %, also 48 € netto; mit 19 % Umsatzsteuer 57,12 €.",
      "Bei der Wahl des Preises verfolgen Unternehmen eine **Preisstrategie**. Bei der **Hochpreisstrategie** setzen sie dauerhaft hohe Preise für hochwertige Markenprodukte, bei der **Niedrigpreisstrategie** dauerhaft niedrige Preise wie im Discounter. Bei der Einführung neuer Produkte gibt es zwei Wege: Die **Abschöpfungsstrategie** beginnt mit einem hohen Preis, den Technikfans zahlen, und senkt ihn später. Die **Durchdringungsstrategie** startet mit einem niedrigen Preis, um schnell viele Kunden zu gewinnen, und erhöht ihn später. Bei der **Preisdifferenzierung** verlangt ein Anbieter für dasselbe Produkt verschiedene Preise, etwa Schülertarife oder günstigere Kinokarten am Nachmittag.",
      "Zur Preispolitik gehört auch die **Konditionengestaltung**, also die Liefer- und Zahlungsbedingungen. Ein **Rabatt** ist ein Preisnachlass, etwa für große Mengen, Treue oder bei einer Aktion. Ein **Skonto** ist ein Nachlass für schnelle Zahlung, zum Beispiel 2 % bei Zahlung innerhalb von zehn Tagen. Dazu kommen Lieferbedingungen wie kostenloser Versand ab einem Mindestbestellwert oder Ratenzahlung.",
      "Wichtig ist: Ein Rabatt senkt nicht nur den Preis, sondern vor allem den Gewinn. Gibt der Laden auf den Helm aus dem Beispiel 20 % Rabatt, bleiben netto nur 38,40 €, weniger als die Selbstkosten von 40 €. Ein Unternehmen muss deshalb genau rechnen, bevor es Preise senkt. Gleichzeitig muss der Preis zur Nachfrage und zu den Preisen der Konkurrenz passen.",
    ],
    terms: [
      term("Selbstkosten", "Alle Kosten, die einem Unternehmen für ein Stück entstehen."),
      term("Gewinnzuschlag", "Prozentualer Aufschlag auf die Selbstkosten, der den Gewinn je Stück bildet."),
      term("Abschöpfungsstrategie", "Ein neues Produkt startet mit einem hohen Preis, der später gesenkt wird."),
      term("Durchdringungsstrategie", "Ein neues Produkt startet mit einem niedrigen Preis, um schnell Marktanteile zu gewinnen."),
      term("Skonto", "Preisnachlass für die Zahlung innerhalb einer kurzen Frist."),
    ],
    takeaway:
      "Der Bruttoverkaufspreis entsteht aus Selbstkosten, Gewinnzuschlag und Umsatzsteuer. Preisstrategien wie Abschöpfung, Durchdringung oder Preisdifferenzierung und Konditionen wie Rabatt und Skonto bestimmen, zu welchen Bedingungen verkauft wird.",
    sourceIds: ["lp", "pangv"],
    lab: "kalkulation",
    practice: "kalkulation",
    quiz: check(
      "Ein Hersteller bringt eine neue Spielkonsole zum Preis von 599 € auf den Markt und senkt den Preis nach einem Jahr auf 449 €. Welche Strategie verfolgt er?",
      "Die Abschöpfungsstrategie: hoch einsteigen und den Preis später senken.",
      ["Die Durchdringungsstrategie: mit dem Preis einsteigen und ihn später erhöhen.", "Die Niedrigpreisstrategie: dauerhaft so günstig wie möglich anbieten."],
      "Er schöpft zuerst die hohe Zahlungsbereitschaft der Fans ab und erreicht dann mit dem niedrigeren Preis weitere Käufer.",
    ),
    workshop: sort(
      "Strategie oder Kondition?",
      "Ordne jede Maßnahme der passenden Kategorie der Preispolitik zu.",
      ["Preisstrategie", "Kondition", "Kalkulation"],
      [
        ["Ein Streamingdienst startet mit 3 € im Monat und erhöht nach einem Jahr auf 9 €.", 0, "Niedrig einsteigen, später erhöhen: Durchdringung."],
        ["Bei Zahlung innerhalb von zehn Tagen gibt es 2 % Nachlass.", 1, "Das ist ein Skonto, eine Zahlungsbedingung."],
        ["Der Händler schlägt auf seine Selbstkosten 25 % Gewinn auf.", 2, "Der Gewinnzuschlag gehört zur Kalkulation."],
        ["Museen verlangen von Schülern weniger Eintritt als von Erwachsenen.", 0, "Unterschiedliche Preise je Gruppe: Preisdifferenzierung."],
        ["Ab 50 € Bestellwert ist der Versand kostenlos.", 1, "Eine Lieferbedingung ist eine Kondition."],
      ],
      "Kalkulation, Strategie und Konditionen bilden zusammen die Preispolitik.",
    ),
    casework: {
      title: "Der Fahrradhelm im Angebot",
      story:
        "Ein Fahrradladen hat für einen Helm **Selbstkosten von 40 €**. Er kalkuliert mit **20 % Gewinnzuschlag** und **19 % Umsatzsteuer**. Für eine Aktionswoche überlegt der Inhaber, **20 % Rabatt** zu geben.",
      steps: [
        decide("Wie hoch ist der Nettoverkaufspreis?", "48 €", "47,60 €", "40 € · 1,2 = 48 €. Die 47,60 € entstehen, wenn man fälschlich 19 % auf 40 € aufschlägt."),
        decide("Wie hoch ist der Bruttoverkaufspreis?", "57,12 €", "67,12 €", "Auf den Nettopreis kommen 19 % Umsatzsteuer: 48 € · 1,19 = 57,12 €."),
        decide("Lohnt sich der Rabatt von 20 % für den Laden?", "Nein, netto blieben 38,40 €, weniger als die Selbstkosten.", "Ja, weil der Laden dann mehr Helme verkauft und mehr verdient.", "48 € · 0,8 = 38,40 €: Jeder Helm würde 1,60 € Verlust bringen, es sei denn, der Rabatt lockt Kunden, die mehr kaufen."),
      ],
      verdict: "Der Helm kostet 57,12 €. Ein Rabatt von 20 % frisst den ganzen Gewinn und führt zu Verlust. Höchstens als Lockangebot mit weiteren Käufen wäre das sinnvoll.",
    },
    tasks: {
      1: write(
        "Erkläre den Unterschied zwischen Abschöpfungs- und Durchdringungsstrategie an je einem Beispiel und nenne jeweils einen Vorteil.",
        ["Wie entwickelt sich der Preis nach der Einführung?", "Welche Kunden sprechen die Strategien an?"],
        "Bei der Abschöpfungsstrategie startet ein Produkt mit einem hohen Preis, der später sinkt. Ein Beispiel ist ein neues Smartphone für 1.200 €, das nach einem Jahr 900 € kostet. Vorteil: Das Unternehmen verdient zuerst viel an Fans, die das Gerät sofort wollen, und deckt schnell die Entwicklungskosten. Bei der Durchdringungsstrategie startet ein Produkt günstig und wird später teurer. Ein Beispiel ist ein Streamingdienst, der im ersten Jahr 3 € kostet. Vorteil: Er gewinnt schnell viele Kunden und Marktanteile.",
        ["Erklärt beide Strategien", "Gibt je ein Beispiel", "Nennt je einen Vorteil"],
      ),
      2: write(
        "Ein Elektronikhändler will Kopfhörer mit Selbstkosten von 60 € verkaufen. Ein Konkurrent bietet ähnliche Kopfhörer für 79,99 € an. Kalkuliere einen Preis mit 25 % Gewinnzuschlag und beurteile, ob er wettbewerbsfähig ist.",
        ["Rechne Netto- und Bruttoverkaufspreis.", "Welche Spielräume hat der Händler, wenn er zu teuer ist?"],
        "Netto: 60 € · 1,25 = 75 €. Brutto: 75 € · 1,19 = 89,25 €. Damit ist der Händler fast 10 € teurer als der Konkurrent und wird es schwer haben. Er hat mehrere Möglichkeiten: Er kann einen geringeren Gewinnzuschlag wählen; bei 12 % käme er auf 67,20 € netto und 79,97 € brutto, knapp unter dem Konkurrenten. Er kann versuchen, seine Selbstkosten zu senken. Oder er bietet einen Mehrwert wie längere Garantie, der einen höheren Preis rechtfertigt. Ohne Änderung ist der Preis nicht wettbewerbsfähig.",
        ["Kalkuliert Netto- und Bruttopreis richtig", "Vergleicht mit dem Konkurrenzpreis", "Zeigt begründete Handlungsmöglichkeiten"],
      ),
    },
  },

  {
    id: "ma-distribution",
    lb: 2,
    unit: "2.2",
    title: "Distributionspolitik: Wie kommt das Produkt zum Kunden?",
    intro: "Werksverkauf, Fachhandel oder Supermarktregal: Der Absatzweg entscheidet, wo und wie Kunden ein Produkt finden.",
    paragraphs: [
      "Die **Distributionspolitik** entscheidet, auf welchen Wegen ein Produkt vom Hersteller zum Kunden gelangt. Beim **direkten Absatz** verkauft der Hersteller selbst an die Endkunden, ohne Händler dazwischen: im eigenen Laden, im Werksverkauf, im eigenen Onlineshop oder durch eigene Außendienstmitarbeiter. Ein Bäcker, der Brötchen in seiner Backstube verkauft, oder ein Hofladen sind typische Beispiele.",
      "Beim **indirekten Absatz** schalten Hersteller **Absatzmittler** ein, meist den **Großhandel** und den **Einzelhandel**. Der Großhandel kauft große Mengen bei vielen Herstellern und beliefert damit Geschäfte, der Einzelhandel verkauft an die Endkunden. Ein Joghurt-Hersteller verkauft so über Supermärkte im ganzen Land, ohne selbst Läden zu betreiben.",
      "Beide Wege haben **Vor- und Nachteile**. Der direkte Absatz bringt engen Kontakt zu den Kunden, volle Kontrolle über Preis und Präsentation und keine Handelsspanne, die an Händler geht. Dafür muss der Hersteller selbst Verkauf, Lager und Versand organisieren und erreicht oft nur wenige Kunden. Der indirekte Absatz erreicht viele Kunden an vielen Orten, und der Handel übernimmt Lager, Beratung und Verkauf. Dafür verdient der Handel mit, und der Hersteller hat weniger Einfluss darauf, wie sein Produkt präsentiert wird.",
      "Viele Unternehmen kombinieren heute mehrere Wege: Ein Sportartikelhersteller verkauft über Sportgeschäfte, gleichzeitig im eigenen Onlineshop und in eigenen Markenläden. Welcher Weg passt, hängt vom Produkt, von der Zielgruppe und vom Preis ab. Erklärungsbedürftige oder teure Produkte brauchen oft Beratung im Fachhandel, Alltagsprodukte müssen überall erhältlich sein.",
    ],
    terms: [
      term("Direkter Absatz", "Der Hersteller verkauft seine Produkte selbst an die Endkunden, ohne zwischengeschaltete Händler."),
      term("Indirekter Absatz", "Der Hersteller verkauft über Absatzmittler wie Groß- und Einzelhandel."),
      term("Absatzmittler", "Unternehmen des Handels, die Waren vom Hersteller zum Endkunden weitergeben."),
    ],
    takeaway:
      "Beim direkten Absatz verkauft der Hersteller selbst an die Endkunden, beim indirekten über Groß- und Einzelhandel. Direkt bringt Kontrolle und Kundennähe, indirekt große Reichweite. Viele Unternehmen kombinieren beide Wege.",
    sourceIds: ["lp"],
    visual: { title: "Direkter und indirekter Absatzweg", layout: "comparison", steps: ["Direkt · Hersteller → Endkunde", "Indirekt · Hersteller → Großhandel → Einzelhandel → Endkunde"] },
    quiz: check(
      "Ein Getränkehersteller verkauft seine Limonade über Supermärkte. Welcher Absatzweg liegt vor?",
      "Ein indirekter Absatzweg, weil der Einzelhandel als Absatzmittler dazwischengeschaltet ist.",
      ["Ein direkter Absatzweg, weil die Kunden die Limonade selbst aus dem Regal nehmen und bezahlen.", "Gar kein Absatzweg, weil Supermärkte die Limonade nur lagern und nicht verkaufen."],
      "Der Supermarkt kauft die Limonade und verkauft sie weiter. Direkt wäre der Absatz nur, wenn der Hersteller selbst an Endkunden verkauft.",
    ),
    workshop: sort(
      "Direkt oder indirekt?",
      "Ordne jeden Absatzweg richtig ein.",
      ["Direkter Absatz", "Indirekter Absatz"],
      [
        ["Ein Imker verkauft seinen Honig auf dem Wochenmarkt an seinem eigenen Stand.", 0, "Der Hersteller verkauft selbst an Endkunden."],
        ["Ein Spielzeughersteller beliefert Spielwarengeschäfte in ganz Deutschland.", 1, "Die Geschäfte verkaufen als Einzelhandel weiter."],
        ["Ein Fahrradhersteller verkauft Räder über den eigenen Onlineshop.", 0, "Kein Händler steht dazwischen."],
        ["Ein Nudelhersteller liefert an einen Großhändler, der Restaurants beliefert.", 1, "Der Großhandel ist Absatzmittler."],
        ["Eine Brauerei schenkt ihr Bier im eigenen Biergarten aus.", 0, "Direkter Verkauf durch den Hersteller."],
      ],
      "Entscheidend ist, ob ein Händler zwischen Hersteller und Endkunde steht.",
    ),
    casework: {
      title: "Die Manufaktur für Naturkosmetik",
      story:
        "Eine kleine **Manufaktur für Naturkosmetik** verkauft bisher nur im **eigenen Laden** und im **eigenen Onlineshop**. Eine große **Drogeriekette** bietet an, die Produkte bundesweit in 1.500 Filialen zu verkaufen, verlangt dafür aber einen deutlich niedrigeren Einkaufspreis.",
      steps: [
        decide("Welcher Absatzweg wird bisher genutzt?", "Ausschließlich der direkte Absatz", "Ausschließlich der indirekte Absatz", "Eigener Laden und eigener Onlineshop sind direkte Wege."),
        decide("Was ist der größte Vorteil des Angebots?", "Die Produkte erreichen sehr viele neue Kunden.", "Die Manufaktur verdient an jedem Stück mehr.", "Die Reichweite steigt stark, der Gewinn je Stück sinkt durch die Handelsspanne."),
        decide("Welches Risiko sollte die Manufaktur bedenken?", "Sie gibt Kontrolle über Preis und Präsentation ab und wird abhängig von der Kette.", "Sie darf danach keinen eigenen Laden mehr betreiben.", "Ein großer Abnehmer hat viel Verhandlungsmacht; der eigene Laden bleibt aber erlaubt."),
      ],
      verdict: "Der indirekte Absatz über die Kette bringt Reichweite, kostet aber Gewinn je Stück und Kontrolle. Eine Kombination beider Wege kann die Risiken mindern.",
    },
    tasks: {
      1: write(
        "Vergleiche direkten und indirekten Absatz anhand von je zwei Vor- und Nachteilen und nenne zu jedem Weg ein Beispiel aus deinem Umfeld.",
        ["Wo kaufst du Brötchen, wo Schokolade?", "Wer verdient am Verkauf mit?"],
        "Beim direkten Absatz verkauft der Hersteller selbst, wie meine Bäckerei, die ihre Brötchen im eigenen Laden verkauft. Vorteile sind der enge Kontakt zu den Kunden und dass kein Händler mitverdient. Nachteile sind die geringe Reichweite und der Aufwand für eigene Läden. Beim indirekten Absatz verkauft der Hersteller über den Handel, wie ein Schokoladenhersteller über Supermärkte. Vorteile sind die große Reichweite und dass der Handel Lager und Verkauf übernimmt. Nachteile sind die Handelsspanne und weniger Einfluss auf die Präsentation.",
        ["Nennt je zwei Vor- und Nachteile", "Gibt zu beiden Wegen ein Beispiel", "Ordnet die Merkmale richtig zu"],
      ),
      2: write(
        "Ein junges Unternehmen hat einen neuen Fahrradhelm mit eingebautem Licht entwickelt. Empfiehl einen Absatzweg und begründe deine Wahl mit Produkt und Zielgruppe.",
        ["Ist der Helm erklärungsbedürftig?", "Wie wichtig sind Reichweite und Beratung am Anfang?"],
        "Ich empfehle eine Kombination. Der Helm ist neu und erklärungsbedürftig: Kunden wollen ihn anprobieren und sich das Licht zeigen lassen. Deshalb sollte das Unternehmen ihn über ausgewählte Fahrradfachgeschäfte verkaufen, die beraten können. Das ist indirekter Absatz mit großer Reichweite. Zusätzlich lohnt ein eigener Onlineshop als direkter Weg, um Kundenkontakt aufzubauen, Rückmeldungen zu sammeln und ohne Handelsspanne zu verdienen. Ein Verkauf im Discounter passt dagegen nicht, weil dort Beratung fehlt.",
        ["Gibt eine klare Empfehlung", "Begründet mit Produkt und Zielgruppe", "Grenzt einen unpassenden Weg ab"],
      ),
    },
  },

  {
    id: "ma-kommunikation",
    lb: 2,
    unit: "2.2",
    title: "Kommunikationspolitik: Werbung, Verkaufsförderung und Öffentlichkeitsarbeit",
    intro: "Ein Produkt, das niemand kennt, kauft niemand. Die Kommunikationspolitik bringt es ins Gespräch.",
    paragraphs: [
      "Die **Kommunikationspolitik** umfasst alle Maßnahmen, mit denen ein Unternehmen mit Kunden und Öffentlichkeit in Kontakt tritt. Ihr wichtigstes Instrument ist die **Werbung**: Sie soll ein Produkt bekannt machen und zum Kauf anregen, etwa durch Anzeigen, Plakate, Radio- und Fernsehspots oder Onlinewerbung. Eine Werbeplanung legt fest, welche Zielgruppe erreicht werden soll, mit welcher Botschaft, in welchen Medien, wann und mit welchem Budget.",
      "Die **Verkaufsförderung** setzt direkt am Ort des Verkaufs an und soll kurzfristig den Absatz steigern: kostenlose Proben, Gewinnspiele, Verkostungen im Supermarkt, Sonderaufsteller oder Treuepunkte. Die **Öffentlichkeitsarbeit**, auch Public Relations genannt, wirbt nicht für ein einzelnes Produkt, sondern für das Ansehen des ganzen Unternehmens. Dazu gehören Pressemitteilungen, Tage der offenen Tür, ein Jahresbericht oder soziales Engagement. Häufig zählt man auch das **Sponsoring** dazu, bei dem ein Unternehmen etwa einen Sportverein unterstützt und dafür genannt wird.",
      "**Moderne Kommunikationsmittel** haben die Kommunikationspolitik stark verändert. In **sozialen Netzwerken** sprechen Unternehmen ihre Zielgruppe direkt an und erhalten sofort Rückmeldungen. Beim **Influencer-Marketing** stellen bekannte Personen Produkte in ihren Kanälen vor. Suchmaschinenwerbung erscheint, wenn jemand nach einem Begriff sucht. Newsletter dürfen nur verschickt werden, wenn die Empfänger zugestimmt haben, und bezahlte Beiträge müssen als Werbung erkennbar sein.",
      "Digitale Kommunikation hat Vorteile: Sie erreicht Zielgruppen genau, ist oft günstiger als Fernsehwerbung, und ihr Erfolg lässt sich messen, etwa an Klicks. Sie hat aber auch Risiken: Ein unbedachter Beitrag kann einen **Shitstorm** auslösen, und Datenschutzregeln setzen Grenzen. Welches Instrument passt, hängt von Zielgruppe, Produkt und Budget ab.",
    ],
    terms: [
      term("Werbung", "Gezielte Ansprache möglicher Kunden über Medien, um ein Produkt bekannt zu machen und zum Kauf anzuregen."),
      term("Verkaufsförderung", "Kurzfristige Maßnahmen am Ort des Verkaufs, etwa Proben, Gewinnspiele oder Aktionsstände."),
      term("Öffentlichkeitsarbeit", "Pflege des Ansehens des ganzen Unternehmens in der Öffentlichkeit."),
      term("Influencer-Marketing", "Produktvorstellung durch bekannte Personen in sozialen Medien, die als Werbung gekennzeichnet sein muss."),
    ],
    takeaway:
      "Die Kommunikationspolitik umfasst Werbung, Verkaufsförderung und Öffentlichkeitsarbeit. Moderne Mittel wie soziale Netzwerke und Influencer erreichen Zielgruppen genau, verlangen aber Kennzeichnung, Einwilligung und Vorsicht.",
    sourceIds: ["lp", "uwg"],
    quiz: check(
      "Ein Autohersteller lädt zum Tag der offenen Tür ins Werk ein und berichtet über seine Klimaschutzprojekte. Welches Instrument der Kommunikationspolitik ist das?",
      "Öffentlichkeitsarbeit, weil es um das Ansehen des ganzen Unternehmens geht.",
      ["Verkaufsförderung, weil dabei an Ort und Stelle Autos zu Sonderpreisen verkauft werden.", "Werbung, weil im Fernsehen ein neues Automodell mit seinem Preis gezeigt wird."],
      "Ein Tag der offenen Tür und Berichte über Engagement stärken das Image. Verkaufsförderung zielt auf kurzfristigen Absatz, Werbung auf ein Produkt.",
    ),
    workshop: sort(
      "Welches Instrument?",
      "Ordne jede Maßnahme eines Müsliherstellers dem passenden Instrument zu.",
      ["Werbung", "Verkaufsförderung", "Öffentlichkeitsarbeit"],
      [
        ["Ein Fernsehspot zeigt eine Familie beim Frühstück mit dem Müsli.", 0, "Mediawerbung für ein Produkt."],
        ["Im Supermarkt dürfen Kunden das neue Müsli kostenlos probieren.", 1, "Eine Verkostung am Verkaufsort."],
        ["Eine Pressemitteilung berichtet über die neue Solaranlage im Werk.", 2, "Es geht um das Ansehen des Unternehmens."],
        ["Auf jeder Packung ist ein Code für ein Gewinnspiel aufgedruckt.", 1, "Gewinnspiele sollen kurzfristig den Absatz steigern."],
        ["Das Unternehmen sponsert einen Kinderlauf und wird in der Zeitung genannt.", 2, "Sponsoring stärkt das Image."],
      ],
      "Werbung macht Produkte bekannt, Verkaufsförderung treibt den Absatz, Öffentlichkeitsarbeit pflegt den Ruf.",
    ),
    casework: {
      title: "Die neue Sportgetränk-Marke",
      story:
        "Ein Start-up bringt ein **Sportgetränk** für Jugendliche auf den Markt. Das Budget ist **klein**. Die Gründerinnen überlegen: **Fernsehwerbung**, eine Zusammenarbeit mit **Influencern** oder **Probierstände** bei Sportturnieren.",
      steps: [
        decide("Warum passt Fernsehwerbung kaum?", "Sie ist sehr teuer und erreicht die Zielgruppe ungenau.", "Weil Fernsehwerbung für Getränke verboten ist.", "Bei kleinem Budget sind gezieltere Mittel effizienter."),
        decide("Was müssen die Gründerinnen beim Influencer-Marketing beachten?", "Die Beiträge müssen als Werbung gekennzeichnet sein.", "Influencer dürfen das Getränk nur loben, wenn sie es selbst gekauft haben.", "Bezahlte Beiträge ohne Kennzeichnung sind unlautere Werbung."),
        decide("Was sind Probierstände bei Turnieren?", "Verkaufsförderung direkt bei der Zielgruppe", "Öffentlichkeitsarbeit für das ganze Unternehmen", "Proben am Ort, an dem die Zielgruppe ist, sollen schnell zum Kauf anregen."),
      ],
      verdict: "Mit kleinem Budget erreichen gekennzeichnetes Influencer-Marketing und Probierstände die jugendliche Zielgruppe gezielter als teure Fernsehspots.",
    },
    tasks: {
      1: write(
        "Erkläre die drei klassischen Instrumente der Kommunikationspolitik an je einem Beispiel und ordne ein modernes Kommunikationsmittel zu.",
        ["Was zielt auf ein Produkt, was auf das Unternehmen?", "Wo begegnen dir Unternehmen online?"],
        "Werbung macht ein Produkt bekannt, etwa ein Plakat für ein neues Handy. Verkaufsförderung wirkt am Verkaufsort und kurzfristig, zum Beispiel Gratisproben eines Joghurts im Supermarkt. Öffentlichkeitsarbeit pflegt das Ansehen des ganzen Unternehmens, etwa ein Bericht über eine Spende an die Tafel. Ein modernes Mittel ist ein Instagram-Kanal des Unternehmens: Er kann Werbung für Produkte zeigen, aber auch Einblicke hinter die Kulissen geben, die das Image stärken.",
        ["Erklärt alle drei Instrumente", "Gibt je ein Beispiel", "Ordnet ein modernes Mittel begründet zu"],
      ),
      2: write(
        "Beurteile Influencer-Marketing aus Sicht eines Unternehmens und aus Sicht jugendlicher Follower.",
        ["Was gewinnt das Unternehmen gegenüber klassischer Werbung?", "Woran erkennen Follower Werbung, und was macht sie anfällig?"],
        "Für Unternehmen ist Influencer-Marketing attraktiv: Es erreicht die Zielgruppe genau, wirkt glaubwürdiger als klassische Werbung, und der Erfolg lässt sich an Klicks messen. Ein Risiko ist, dass ein Skandal der Influencerin auf die Marke abfärbt. Für Follower ist es problematisch, weil Empfehlungen wie persönliche Tipps wirken, obwohl dafür bezahlt wird. Die Kennzeichnung als Werbung oder Anzeige ist Pflicht, wird aber leicht übersehen. Ich halte Influencer-Marketing für legitim, wenn es klar gekennzeichnet ist; Follower sollten bei jeder Empfehlung fragen, wer daran verdient.",
        ["Beurteilt die Sicht des Unternehmens", "Beurteilt die Sicht der Follower", "Bezieht die Kennzeichnungspflicht ein und urteilt"],
      ),
    },
  },

  {
    id: "ma-konzept",
    lb: 2,
    unit: "2.2",
    title: "Ein einfaches Marketingkonzept erstellen",
    intro: "Produkt, Preis, Absatzweg und Kommunikation: Jetzt stellst du alles zu einem stimmigen Konzept zusammen.",
    paragraphs: [
      "Ein **Marketingkonzept** bündelt alle Marketingentscheidungen für ein Produkt. Es beginnt mit der **Ausgangslage**: Was zeigt die Marktanalyse über Zielgruppe, Konkurrenz und Marktvolumen? Dann folgen die **Marketingziele**, etwa „Im ersten Jahr 5 % Marktanteil bei Schülern“. Schließlich werden die Maßnahmen aus allen vier Bereichen des Marketing-Mix ausgewählt und aufeinander abgestimmt.",
      "Damit die Maßnahmen zusammenpassen, braucht es **Auswahlkriterien**. Das wichtigste ist die **Zielgruppe**: Ein Produkt für Zwölfjährige verlangt andere Preise, Absatzwege und Kanäle als eines für Erwachsene. Ein zweites ist das **Marktvolumen**: Auf einem großen, umkämpften Markt braucht man andere Maßnahmen als in einer kleinen Nische. Ein drittes ist die **Phase im Produktlebenszyklus**: In der Einführung geht es darum, das Produkt bekannt zu machen; in der Reife darum, Kunden zu halten; im Rückgang darum, Restbestände abzuverkaufen oder neu zu starten.",
      "Ein Beispiel: Für eine neue, wiederverwendbare Brotdose für Schüler wählt ein Hersteller in der Einführung ein buntes, robustes Design (Produkt), einen leicht niedrigeren Einführungspreis von 12,90 € (Preis, Durchdringung), den Verkauf in Schreibwarenläden und online (Distribution) sowie kurze Videos und Proben bei Schulfesten (Kommunikation). Alle Maßnahmen zielen auf dieselbe Zielgruppe und dieselbe Botschaft: praktisch, nachhaltig, cool.",
      "Ein Konzept ist erst fertig, wenn es **begründet** ist: Zu jeder Maßnahme gehört die Antwort, warum sie zur Zielgruppe, zum Markt und zur Phase passt. Widersprüche zeigen sich schnell, etwa ein Luxuspreis bei einem Massenprodukt im Discounter. Ein gutes Konzept legt außerdem fest, woran man den Erfolg misst, etwa an Absatzzahlen oder Rückmeldungen.",
    ],
    terms: [
      term("Marketingkonzept", "Plan, der Ausgangslage, Ziele und abgestimmte Maßnahmen des Marketing-Mix für ein Produkt bündelt."),
      term("Marketingziel", "Messbares Ziel, das ein Unternehmen mit seinem Marketing erreichen will, etwa ein Marktanteil."),
      term("Auswahlkriterium", "Maßstab, nach dem Marketingmaßnahmen ausgewählt werden, etwa Zielgruppe, Marktvolumen oder Lebenszyklusphase."),
    ],
    takeaway:
      "Ein Marketingkonzept verbindet Ausgangslage, Ziele und abgestimmte Maßnahmen aus Produkt-, Preis-, Distributions- und Kommunikationspolitik. Zielgruppe, Marktvolumen und Phase im Produktlebenszyklus sind die wichtigsten Kriterien für die Auswahl.",
    sourceIds: ["lp"],
    lab: "lebenszyklus",
    labGoals: ["konzept-start", "konzept-reife", "konzept-ende"],
    quiz: check(
      "Welche Maßnahme passt am besten zur Einführungsphase eines neuen Produkts?",
      "Werbung und Proben, die das Produkt bei der Zielgruppe bekannt machen",
      ["Ein Abverkauf mit hohen Rabatten, um die Lagerbestände vor dem Ende loszuwerden", "Treueaktionen für Stammkunden, die das Produkt schon seit Jahren kaufen"],
      "In der Einführung kennt kaum jemand das Produkt, deshalb geht es um Bekanntheit. Abverkauf gehört zum Rückgang, Treueaktionen zur Reife.",
    ),
    workshop: sort(
      "Welches Kriterium begründet die Maßnahme?",
      "Ordne jede Begründung in einem Marketingkonzept dem Auswahlkriterium zu, auf das sie sich stützt.",
      ["Zielgruppe", "Marktvolumen", "Phase im Lebenszyklus"],
      [
        ["Weil unsere Käufer 12 bis 16 Jahre alt sind, werben wir in sozialen Netzwerken statt in der Zeitung.", 0, "Die Kanäle richten sich nach der Zielgruppe."],
        ["Weil das Produkt neu ist, setzen wir auf Proben und Einführungswerbung.", 2, "In der Einführung geht es um Bekanntheit."],
        ["Weil der Markt mit 10 Millionen Stück sehr groß ist, verkaufen wir über Supermärkte im ganzen Land.", 1, "Ein großer Markt verlangt große Reichweite."],
        ["Weil das Produkt im Rückgang ist, verkaufen wir die Restbestände mit Rabatt.", 2, "Abverkauf passt zum Ende des Zyklus."],
        ["Weil die Nische klein ist, verkaufen wir nur im eigenen Onlineshop.", 1, "Ein kleiner Markt rechtfertigt keinen teuren Handelsvertrieb."],
      ],
      "Jede Maßnahme braucht eine Begründung aus den Kriterien.",
    ),
    casework: {
      title: "Das Konzept für die Lern-App",
      story:
        "Drei Schüler haben eine **Vokabel-App** entwickelt. Zielgruppe sind **Schüler von 10 bis 16 Jahren**. Die App ist **neu**. Ihr erster Entwurf: Preis **29,99 €**, Verkauf nur über Fachbuchhandlungen, Werbung in einer Tageszeitung.",
      steps: [
        decide("Was passt beim Preis nicht?", "29,99 € ist für die Zielgruppe hoch und für eine neue App eher ungewöhnlich.", "Der Preis ist zu niedrig, weil Apps immer mehr kosten müssen.", "Jugendliche haben wenig Geld; für eine neue App passt eher eine günstige oder kostenlose Grundversion."),
        decide("Welcher Absatzweg passt besser?", "Die App-Stores, in denen die Zielgruppe ohnehin Apps lädt", "Ausschließlich Fachbuchhandlungen", "Apps werden über App-Stores vertrieben; dort sucht die Zielgruppe."),
        decide("Welche Kommunikation passt zur Einführungsphase und Zielgruppe?", "Kurze Videos in sozialen Netzwerken und Vorstellung an Schulen", "Eine Anzeige in einer Tageszeitung", "Bekanntheit bei Jugendlichen schafft man dort, wo sie sind."),
      ],
      verdict: "Der Entwurf passt nicht zur Zielgruppe. Ein stimmiges Konzept setzt auf einen niedrigen Einstieg, App-Stores und Kommunikation in den Kanälen der Jugendlichen.",
    },
    tasks: {
      1: write(
        "Stelle für ein selbst gewähltes Produkt ein einfaches Marketingkonzept für die Einführungsphase zusammen: Zielgruppe, Ziel und je eine Maßnahme aus den vier Bereichen des Marketing-Mix.",
        ["Für wen ist dein Produkt?", "Wie macht man ein neues Produkt bekannt?"],
        "Mein Produkt ist eine Handyhülle aus recyceltem Plastik. Zielgruppe sind Jugendliche von 13 bis 18 Jahren, die auf Umwelt und Design achten. Ziel: Im ersten Jahr 5.000 verkaufte Hüllen. Produkt: fünf auffällige Designs für gängige Handymodelle. Preis: 14,90 €, etwas unter Markenhüllen, um schnell Kunden zu gewinnen. Distribution: eigener Onlineshop und ausgewählte Handyläden. Kommunikation: kurze Videos in sozialen Netzwerken und gekennzeichnete Beiträge von Influencern, die das Recycling zeigen.",
        ["Nennt Zielgruppe und messbares Ziel", "Wählt je eine Maßnahme aus allen vier Bereichen", "Die Maßnahmen passen zur Einführungsphase"],
      ),
      2: write(
        "Begründe dein Marketingkonzept aus Aufgabe 1 kriterienbezogen und zeige, wie du es in der Reifephase anpassen würdest.",
        ["Beziehe Zielgruppe, Marktvolumen und Lebenszyklus ein.", "Was ändert sich, wenn das Produkt bekannt ist und Konkurrenz auftaucht?"],
        "Alle Maßnahmen richten sich nach der Zielgruppe: Jugendliche erreiche ich in sozialen Netzwerken, und der Preis passt zu ihrem Budget. Der Markt für Handyhüllen ist groß und umkämpft, deshalb brauche ich auffällige Designs und eine klare Botschaft, das Recycling. Die Einführungsphase verlangt Bekanntheit, deshalb setze ich auf Videos und Influencer. In der Reifephase ändere ich das Konzept: Ich binde Stammkunden mit einem Treueprogramm, halte den Preis stabil, erweitere das Sortiment um neue Handymodelle und gehe zusätzlich in Elektronikmärkte, um mehr Reichweite zu bekommen.",
        ["Begründet mit allen drei Kriterien", "Zeigt die Passung der Maßnahmen", "Passt das Konzept sinnvoll an die Reifephase an"],
      ),
    },
  },
];
