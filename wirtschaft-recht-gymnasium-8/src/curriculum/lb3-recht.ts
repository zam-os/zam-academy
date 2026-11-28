import type { Lesson } from "../model/types";
import { check, decide, sort, term, write } from "./lesson-parts";

export const LB3: Lesson[] = [
  {
    id: "re-funktionen",
    lb: 3,
    unit: "3",
    title: "Wozu brauchen wir Recht? Die Funktionen des Rechts",
    intro: "Ohne Regeln würde sich der Stärkere durchsetzen. Das Recht ordnet das Zusammenleben und schützt jeden Einzelnen.",
    paragraphs: [
      "Überall, wo Menschen zusammenleben, braucht es **Regeln**: im Straßenverkehr, beim Einkaufen, in der Schule. Manche Regeln beruhen auf Sitte oder Anstand, etwa das Grüßen. **Rechtsnormen** unterscheiden sich davon, weil der Staat sie erlässt und notfalls mit Zwang durchsetzt, durch Gerichte, Polizei und Behörden. Alle Rechtsnormen zusammen bilden die **Rechtsordnung**.",
      "Das Recht erfüllt mehrere **Funktionen**. Die **Ordnungsfunktion** sorgt dafür, dass das Zusammenleben berechenbar ist: Jeder weiß, was er darf und was er von anderen erwarten kann, etwa dass im Straßenverkehr rechts gefahren wird. Die **Friedensfunktion** sorgt dafür, dass Streit nicht mit Gewalt, sondern vor Gericht gelöst wird. Der Staat hat dazu das **Gewaltmonopol**: Niemand darf sein Recht mit der Faust durchsetzen.",
      "Die **Schutzfunktion** bewahrt Leben, Gesundheit, Eigentum und Ehre und schützt besonders die Schwächeren, etwa Kinder und Jugendliche durch das Jugendschutzgesetz. Die **Freiheitssicherungsfunktion** garantiert jedem Menschen einen Raum, in dem er selbst entscheiden kann; die Grundrechte schützen dabei auch vor Übergriffen des Staates. Schließlich soll das Recht für **Gerechtigkeit** sorgen: Alle sind vor dem Gesetz gleich, und wer Schaden anrichtet, muss ihn ausgleichen.",
      "Rechtliche Regelungen sind deshalb notwendig, obwohl sie die Freiheit des Einzelnen auch einschränken. Die Freiheit des einen endet dort, wo die Rechte des anderen beginnen. Wer zum Beispiel laut Musik hören will, muss die Nachtruhe der Nachbarn achten. Das Recht gleicht solche Interessen aus. Ob eine Regel gut ist, lässt sich danach beurteilen, wie gut sie diese Funktionen erfüllt.",
    ],
    terms: [
      term("Rechtsordnung", "Gesamtheit aller Rechtsnormen, die der Staat erlässt und notfalls mit Zwang durchsetzt."),
      term("Friedensfunktion", "Das Recht sorgt dafür, dass Konflikte ohne Gewalt, notfalls vor Gericht, gelöst werden."),
      term("Schutzfunktion", "Das Recht schützt Leben, Gesundheit, Eigentum und Ehre, besonders der Schwächeren."),
      term("Gewaltmonopol", "Nur der Staat darf Zwang anwenden, um Recht durchzusetzen; Selbstjustiz ist verboten."),
    ],
    law: [
      {
        ref: "Art. 2 Abs. 1 GG",
        text: "Jeder hat das Recht, seine Persönlichkeit frei zu entfalten, soweit er nicht die Rechte anderer verletzt und nicht gegen die verfassungsmäßige Ordnung oder das Sittengesetz verstößt.",
        url: "https://www.gesetze-im-internet.de/gg/art_2.html",
      },
    ],
    takeaway:
      "Das Recht ordnet das Zusammenleben, sichert den Frieden, schützt die Schwächeren, garantiert Freiheit und soll für Gerechtigkeit sorgen. Weil die Freiheit des einen an den Rechten des anderen endet, sind rechtliche Regeln notwendig.",
    sourceIds: ["lp", "gg"],
    quiz: check(
      "Zwei Nachbarn streiten über einen Baum an der Grundstücksgrenze und lassen ein Gericht entscheiden, statt den Baum heimlich zu fällen. Welche Funktion des Rechts zeigt sich hier vor allem?",
      "Die Friedensfunktion, weil der Streit ohne Gewalt vor Gericht gelöst wird.",
      ["Die Freiheitssicherungsfunktion, weil jeder Nachbar mit seinem Grundstück tun darf, was er will.", "Die Schutzfunktion, weil Bäume als Schwächere besonders geschützt werden müssen."],
      "Der Konflikt wird geordnet und ohne Selbstjustiz entschieden. Die Freiheit endet an den Rechten des anderen, und die Schutzfunktion meint vor allem Menschen.",
    ),
    workshop: sort(
      "Welche Funktion erfüllt die Regel vor allem?",
      "Ordne jede Rechtsregel der Funktion zu, die sie vor allem erfüllt.",
      ["Ordnung", "Frieden", "Schutz", "Freiheit"],
      [
        ["Im Straßenverkehr gilt rechts vor links.", 0, "Die Regel macht das Verhalten aller berechenbar."],
        ["Wer sich gestohlenes Eigentum zurückholen will, muss die Polizei oder ein Gericht einschalten.", 1, "Der Staat verhindert Selbstjustiz."],
        ["Alkohol darf nicht an Kinder verkauft werden.", 2, "Die Regel schützt besonders Schwache."],
        ["Jeder darf seine Meinung frei äußern, ohne dass der Staat sie vorher prüft.", 3, "Die Meinungsfreiheit sichert einen Freiraum gegenüber dem Staat."],
        ["Eine Verkehrsampel regelt, wer wann über die Kreuzung fahren darf.", 0, "Klare Abläufe ordnen das Zusammenleben."],
      ],
      "Viele Regeln erfüllen mehrere Funktionen zugleich; hier zählt die wichtigste.",
    ),
    casework: {
      title: "Die Insel ohne Recht",
      story:
        "In einem Gedankenexperiment strandet eine Klasse auf einer **einsamen Insel**. Es gibt **keine Regeln**. Bald nimmt der stärkste Schüler die besten Früchte für sich, ein Streit um den Schlafplatz endet in einer Prügelei, und zwei Jüngere bekommen kaum etwas zu essen.",
      steps: [
        decide("Was fehlt auf der Insel vor allem?", "Eine Ordnung, die festlegt, was jeder darf und wie Streit gelöst wird.", "Mehr Früchte für alle Schüler.", "Auch bei genug Früchten bräuchte es Regeln für die Verteilung und für Konflikte."),
        decide("Welche Funktion des Rechts würde die Jüngeren schützen?", "Die Schutzfunktion", "Die Ordnungsfunktion allein", "Die Schutzfunktion verhindert, dass sich der Stärkere auf Kosten der Schwächeren durchsetzt."),
        decide("Wie sollte die Klasse künftig Streit lösen?", "Durch eine gewählte Schlichterin, deren Entscheidung alle akzeptieren", "Durch einen Ringkampf, den der Stärkere gewinnt", "Ein geordnetes Verfahren erfüllt die Friedensfunktion."),
      ],
      verdict: "Ohne Recht setzt sich der Stärkere durch. Regeln mit einer anerkannten Instanz zur Streitschlichtung erfüllen Ordnungs-, Friedens- und Schutzfunktion.",
    },
    tasks: {
      1: write(
        "Wähle drei Funktionen des Rechts und erkläre jede an einer Regel aus deinem Alltag.",
        ["Denke an Straßenverkehr, Schule, Einkaufen und Internet.", "Wen schützt die Regel, was ordnet sie?"],
        "Die Ordnungsfunktion zeigt sich an der Regel, dass Radfahrer bei Rot halten müssen: So weiß jeder, wer fahren darf. Die Friedensfunktion zeigt sich, wenn ein Verkäufer seinen Kaufpreis nicht mit Gewalt eintreiben darf, sondern vor Gericht klagen muss. Die Schutzfunktion zeigt sich am Verbot, Zigaretten an Jugendliche zu verkaufen: Es schützt uns vor Gesundheitsschäden, auch wenn wir die Gefahr vielleicht unterschätzen.",
        ["Nennt drei Funktionen", "Gibt zu jeder eine passende Regel", "Erklärt den Zusammenhang"],
      ),
      2: write(
        "Ein Mitschüler sagt: „Gesetze schränken nur meine Freiheit ein.“ Beurteile diese Aussage vor dem Hintergrund der Funktionen des Rechts.",
        ["Was wäre mit deiner Freiheit ohne Recht?", "Wie hilft Art. 2 GG bei der Antwort?"],
        "Die Aussage stimmt nur zum Teil. Gesetze schränken tatsächlich ein, etwa beim Tempolimit oder bei der Nachtruhe. Sie sichern aber zugleich meine Freiheit: Ohne Recht könnten andere mich bestehlen, bedrohen oder verdrängen, und der Stärkere würde bestimmen. Art. 2 GG garantiert mir die freie Entfaltung, solange ich die Rechte anderer nicht verletze. Das Recht gleicht also die Freiheit aller aus. Mein Urteil: Gesetze begrenzen Freiheit, damit sie für alle möglich bleibt.",
        ["Nimmt Stellung", "Bezieht Schutz- und Freiheitssicherungsfunktion ein", "Nutzt den Gedanken der begrenzten Freiheit"],
      ),
    },
  },

  {
    id: "re-zivil-straf",
    lb: 3,
    unit: "3",
    title: "Zivilrecht und Strafrecht unterscheiden",
    intro: "Ein zerkratztes Auto, zwei Verfahren: Der Besitzer will sein Geld, der Staat will den Täter zur Verantwortung ziehen.",
    paragraphs: [
      "Die Rechtsordnung teilt sich in zwei große Bereiche. Das **Zivilrecht**, auch Privatrecht genannt, regelt die Beziehungen zwischen gleichberechtigten Personen und Unternehmen, etwa beim Kauf, bei der Miete oder bei einem Schaden. Seine wichtigste Grundlage ist das **Bürgerliche Gesetzbuch** (BGB). Das **öffentliche Recht** regelt das Verhältnis zwischen Staat und Bürgern. Zu ihm gehört das **Strafrecht**, das festlegt, welches Verhalten als Straftat bestraft wird. Seine wichtigste Grundlage ist das **Strafgesetzbuch** (StGB).",
      "Die beiden Bereiche verfolgen unterschiedliche **Ziele**. Im Zivilrecht geht es um **Ausgleich**: Wer einem anderen schadet, muss den Schaden ersetzen, etwa die Reparatur bezahlen. Im Strafrecht geht es um **Strafe** und Vorbeugung: Der Staat reagiert auf Unrecht, um den Täter zu bessern und die Allgemeinheit zu schützen. Bei Jugendlichen steht die Erziehung im Vordergrund.",
      "Auch die **Verfahren** unterscheiden sich. Im Zivilrecht entscheidet der Geschädigte selbst, ob er sein Recht geltend macht; vor Gericht stehen sich **Kläger** und **Beklagter** gegenüber. Im Strafrecht ermitteln Polizei und **Staatsanwaltschaft** von sich aus, sobald sie von einer Straftat erfahren; die Staatsanwaltschaft erhebt Anklage gegen den **Angeklagten**. Einige Taten, etwa die Beleidigung, verfolgt der Staat nur, wenn der Verletzte einen **Strafantrag** stellt.",
      "Ein und dieselbe Handlung kann **beide Bereiche** betreffen. Zerkratzt ein 16-Jähriger absichtlich ein Auto, kann der Besitzer im Zivilrecht verlangen, dass er die Reparatur bezahlt. Zugleich ist die Tat eine Sachbeschädigung, für die er im Strafverfahren nach dem Jugendstrafrecht zur Verantwortung gezogen werden kann. Eine Strafe ersetzt den Schaden nicht, und der Schadensersatz ersetzt keine Strafe.",
    ],
    terms: [
      term("Zivilrecht", "Recht, das die Beziehungen zwischen gleichberechtigten Personen regelt; Ziel ist der Ausgleich."),
      term("Strafrecht", "Teil des öffentlichen Rechts, der Straftaten und ihre Strafen festlegt."),
      term("Staatsanwaltschaft", "Behörde, die Straftaten verfolgt, ermittelt und Anklage erhebt."),
      term("Kläger und Beklagter", "Die beiden Parteien eines Zivilprozesses: wer etwas verlangt und gegen wen."),
    ],
    takeaway:
      "Das Zivilrecht regelt Beziehungen zwischen Gleichberechtigten und zielt auf Ausgleich, das Strafrecht ahndet Straftaten im Namen des Staates. Dieselbe Tat kann zu Schadensersatz und zu einer Strafe führen.",
    sourceIds: ["lp", "bgb", "stgb"],
    visual: { title: "Eine Tat, zwei Bereiche", layout: "comparison", steps: ["Zivilrecht · Geschädigter gegen Schädiger · Ziel: Schadensersatz", "Strafrecht · Staatsanwaltschaft gegen Täter · Ziel: Strafe oder Erziehung"] },
    quiz: check(
      "Wer leitet im Strafrecht normalerweise das Verfahren gegen einen Täter ein?",
      "Die Staatsanwaltschaft, die von sich aus ermittelt und Anklage erhebt.",
      ["Der Geschädigte, der den Täter selbst vor Gericht verklagen muss, damit überhaupt etwas passiert.", "Der Täter selbst, der sich bei der Polizei melden und ein Verfahren beantragen muss."],
      "Im Strafrecht handelt der Staat. Nur bei Antragsdelikten wie der Beleidigung braucht er zusätzlich den Antrag des Verletzten.",
    ),
    workshop: sort(
      "Zivilrecht oder Strafrecht?",
      "Ordne jede Frage dem passenden Rechtsbereich zu.",
      ["Zivilrecht", "Strafrecht"],
      [
        ["Muss Paul seinem Nachbarn die zerbrochene Scheibe bezahlen?", 0, "Es geht um Ausgleich zwischen zwei Personen."],
        ["Muss Paul für den absichtlichen Steinwurf mit Sozialstunden rechnen?", 1, "Sozialstunden sind eine Folge im Jugendstrafrecht."],
        ["Darf der Vermieter die Kaution behalten, weil die Wohnung beschädigt ist?", 0, "Der Mietvertrag ist eine private Rechtsbeziehung."],
        ["Erhebt die Staatsanwaltschaft Anklage wegen Diebstahls?", 1, "Die Staatsanwaltschaft verfolgt Straftaten."],
        ["Bekommt eine Radfahrerin nach einem Unfall Schmerzensgeld?", 0, "Schmerzensgeld ist ein zivilrechtlicher Anspruch."],
      ],
      "Ausgleich zwischen Personen ist Zivilrecht, die Reaktion des Staates auf Unrecht ist Strafrecht.",
    ),
    casework: {
      title: "Das zerkratzte Auto",
      story:
        "**Felix (16)** zerkratzt aus Wut absichtlich mit einem Schlüssel das Auto von **Frau Demir**. Die Reparatur kostet **1.200 €**. Eine Nachbarin hat alles gesehen und ruft die Polizei.",
      steps: [
        decide("Was kann Frau Demir im Zivilrecht verlangen?", "Dass Felix die 1.200 € für die Reparatur ersetzt.", "Dass Felix ins Gefängnis kommt.", "Das Zivilrecht zielt auf Ausgleich des Schadens; Strafen verhängt nur ein Strafgericht."),
        decide("Wer verfolgt die Sachbeschädigung strafrechtlich?", "Polizei und Staatsanwaltschaft", "Frau Demir mit einer eigenen Klage", "Straftaten verfolgt der Staat; bei einer Sachbeschädigung ist in der Regel ein Strafantrag nötig, den Frau Demir stellen kann."),
        decide("Erledigt sich der Schadensersatz, wenn Felix verurteilt wird?", "Nein, Strafe und Schadensersatz sind zwei getrennte Folgen.", "Ja, mit der Strafe ist alles abgegolten.", "Eine Strafe ersetzt den Schaden nicht; beide Bereiche stehen nebeneinander."),
      ],
      verdict: "Felix muss mit zwei Folgen rechnen: Schadensersatz an Frau Demir im Zivilrecht und eine Reaktion des Jugendstrafrechts. Beide Verfahren laufen getrennt.",
    },
    tasks: {
      1: write(
        "Vergleiche Zivilrecht und Strafrecht anhand von Ziel, Beteiligten und Gesetzesgrundlage.",
        ["Wer steht sich jeweils gegenüber?", "Was soll am Ende erreicht werden?"],
        "Das Ziel des Zivilrechts ist der Ausgleich zwischen Personen, etwa Schadensersatz. Das Strafrecht will Unrecht ahnden, den Täter bessern und die Allgemeinheit schützen. Im Zivilrecht stehen sich Kläger und Beklagter als Gleichberechtigte gegenüber, und der Geschädigte entscheidet, ob er klagt. Im Strafrecht ermittelt die Staatsanwaltschaft gegen den Beschuldigten. Wichtigste Grundlage des Zivilrechts ist das BGB, die des Strafrechts das StGB.",
        ["Vergleicht das Ziel", "Vergleicht die Beteiligten", "Nennt die Gesetzesgrundlagen"],
      ),
      2: write(
        "Erläutere an einem selbst gewählten Fall, wie eine einzige Handlung sowohl zivilrechtliche als auch strafrechtliche Folgen haben kann.",
        ["Welcher Schaden entsteht, und welche Straftat liegt vor?", "Wer handelt in welchem Verfahren?"],
        "Lisa (17) schubst bei einem Streit absichtlich einen Mitschüler, der stürzt und sich den Arm bricht. Zivilrechtlich kann der Mitschüler von Lisa Schadensersatz für Behandlungskosten und ein Schmerzensgeld verlangen; er wäre Kläger, Lisa Beklagte. Strafrechtlich ist die Tat eine Körperverletzung. Die Staatsanwaltschaft kann ermitteln, und weil Lisa 17 ist, entscheidet ein Jugendgericht nach dem Jugendstrafrecht, etwa über Sozialstunden. Die beiden Verfahren laufen getrennt: Die Strafe entschädigt den Mitschüler nicht.",
        ["Beschreibt einen passenden Fall", "Nennt die zivilrechtliche Folge", "Nennt die strafrechtliche Folge und die Trennung der Verfahren"],
      ),
    },
  },

  {
    id: "re-normen",
    lb: 3,
    unit: "3",
    title: "Rechtsnormen lesen: Tatbestand und Rechtsfolge",
    intro: "Jede Rechtsnorm hat ein Wenn und ein Dann. Wer beides erkennt, kann einen Fall Schritt für Schritt prüfen.",
    paragraphs: [
      "Gesetze bestehen aus **Rechtsnormen**, die in **Paragrafen** (§) und Absätzen geordnet sind. Fast jede Norm folgt dem Muster „Wenn …, dann …“. Der **Tatbestand** nennt die Voraussetzungen, die erfüllt sein müssen, die **Tatbestandsmerkmale**. Die **Rechtsfolge** sagt, was dann gilt. Nur wenn alle Merkmale des Tatbestands vorliegen, tritt die Rechtsfolge ein.",
      "Ein Beispiel aus dem Strafrecht ist der Diebstahl nach § 242 StGB, hier vereinfacht: Wer eine **fremde bewegliche Sache** einem anderen **wegnimmt** und dabei die **Absicht** hat, sie sich rechtswidrig **zuzueignen**, wird bestraft. Die Rechtsfolge ist Freiheitsstrafe bis zu fünf Jahren oder Geldstrafe. Ein Beispiel aus dem Zivilrecht ist § 823 Abs. 1 BGB: Wer vorsätzlich oder fahrlässig das Leben, den Körper, die Gesundheit, die Freiheit, das Eigentum oder ein sonstiges Recht eines anderen widerrechtlich verletzt, muss den entstandenen Schaden ersetzen.",
      "Einen Fall löst man, indem man prüft, ob der Sachverhalt jedes Merkmal erfüllt; das nennt man **Subsumtion**. Man geht in vier Schritten vor: Erstens die Frage klären, etwa „Hat Jonas einen Diebstahl begangen?“. Zweitens die passende Norm suchen. Drittens Merkmal für Merkmal prüfen: Ist das Handy für Jonas fremd? Ist es beweglich? Hat er es weggenommen? Wollte er es behalten? Viertens das Ergebnis mit der Rechtsfolge formulieren.",
      "Fehlt auch nur ein Merkmal, tritt die Rechtsfolge nicht ein. Wer sich das Fahrrad eines Freundes ohne Erlaubnis nur für eine Stunde ausleiht und es zurückbringt, nimmt es zwar weg, will es aber nicht behalten. Ein Diebstahl liegt dann nicht vor; ob andere Normen greifen, ist gesondert zu prüfen. Genau darin liegt der Wert der Methode: Sie verhindert Urteile nach Gefühl.",
    ],
    terms: [
      term("Tatbestand", "Teil einer Rechtsnorm, der die Voraussetzungen nennt, die erfüllt sein müssen."),
      term("Rechtsfolge", "Teil einer Rechtsnorm, der festlegt, was gilt, wenn der Tatbestand erfüllt ist."),
      term("Tatbestandsmerkmal", "Einzelne Voraussetzung eines Tatbestands, etwa „fremde bewegliche Sache“."),
      term("Subsumtion", "Prüfung, ob ein Sachverhalt alle Merkmale eines Tatbestands erfüllt."),
    ],
    law: [
      {
        ref: "§ 242 Abs. 1 StGB",
        text: "Wer einem anderen eine fremde bewegliche Sache wegnimmt, um sie sich oder einem Dritten rechtswidrig zuzueignen, wird mit Freiheitsstrafe bis zu fünf Jahren oder mit Geldstrafe bestraft.",
        url: "https://www.gesetze-im-internet.de/stgb/__242.html",
      },
    ],
    takeaway:
      "Jede Rechtsnorm verbindet einen Tatbestand mit einer Rechtsfolge. Bei der Subsumtion prüfst du jedes Tatbestandsmerkmal am Sachverhalt; nur wenn alle erfüllt sind, tritt die Rechtsfolge ein.",
    sourceIds: ["lp", "stgb", "bgb"],
    quiz: check(
      "Was passiert, wenn bei einem Fall ein einziges Tatbestandsmerkmal einer Norm nicht erfüllt ist?",
      "Die Rechtsfolge dieser Norm tritt nicht ein; andere Normen können aber noch greifen.",
      ["Die Rechtsfolge tritt trotzdem ein, weil die meisten Merkmale ja vorliegen.", "Das Gericht entscheidet nach Gefühl, ob die Rechtsfolge eintreten soll."],
      "Eine Rechtsfolge setzt den vollständigen Tatbestand voraus. Gerichte urteilen nach den Merkmalen, nicht nach Gefühl, und prüfen bei Bedarf weitere Normen.",
    ),
    workshop: sort(
      "Tatbestand oder Rechtsfolge?",
      "Ordne jeden Bestandteil aus Normen des StGB und des BGB ein.",
      ["Tatbestand", "Rechtsfolge"],
      [
        ["… eine fremde bewegliche Sache einem anderen wegnimmt …", 0, "Das ist eine Voraussetzung des Diebstahls."],
        ["… wird mit Freiheitsstrafe bis zu fünf Jahren oder mit Geldstrafe bestraft.", 1, "Das ist die Folge der Tat."],
        ["… vorsätzlich oder fahrlässig das Eigentum eines anderen widerrechtlich verletzt …", 0, "Das sind Merkmale der unerlaubten Handlung."],
        ["… ist dem anderen zum Ersatz des daraus entstehenden Schadens verpflichtet.", 1, "Die Pflicht zum Schadensersatz ist die Rechtsfolge."],
        ["… in der Absicht, die Sache sich rechtswidrig zuzueignen …", 0, "Auch die Absicht gehört zum Tatbestand."],
      ],
      "Erst der vollständige Tatbestand löst die Rechtsfolge aus.",
    ),
    casework: {
      title: "Das geliehene Fahrrad",
      story:
        "**Jonas** nimmt ohne zu fragen das Fahrrad seines Klassenkameraden **Tim** vom Schulhof, um schnell zum Bäcker zu fahren. **Nach 20 Minuten** stellt er es unbeschädigt an dieselbe Stelle zurück. Tim ist empört: „Das ist Diebstahl!“",
      steps: [
        decide("Ist das Fahrrad für Jonas eine fremde bewegliche Sache?", "Ja, es gehört Tim und lässt sich bewegen.", "Nein, weil Jonas es nur kurz benutzt hat.", "Fremd und beweglich sind Eigenschaften der Sache, nicht der Dauer der Nutzung."),
        decide("Hatte Jonas die Absicht, sich das Fahrrad zuzueignen?", "Nein, er wollte es von Anfang an zurückbringen.", "Ja, denn wer etwas nimmt, will es immer behalten.", "Zueignung heißt, die Sache auf Dauer wie ein Eigentümer behalten zu wollen."),
        decide("Was ergibt die Subsumtion für § 242 StGB?", "Kein Diebstahl, weil das Merkmal der Zueignungsabsicht fehlt.", "Diebstahl, weil die meisten Merkmale erfüllt sind.", "Fehlt ein Merkmal, tritt die Rechtsfolge nicht ein. Ob eine andere Norm greift, wäre gesondert zu prüfen."),
      ],
      verdict: "Ein Diebstahl liegt nicht vor, weil Jonas das Rad nicht behalten wollte. Richtig war sein Verhalten trotzdem nicht; die Methode zeigt nur, dass § 242 StGB nicht passt.",
    },
    tasks: {
      1: write(
        "Erkläre Tatbestand und Rechtsfolge am Beispiel von § 823 Abs. 1 BGB und nenne die Tatbestandsmerkmale.",
        ["Was muss jemand getan haben?", "Was muss er dann tun?"],
        "§ 823 Abs. 1 BGB hat einen Tatbestand und eine Rechtsfolge. Der Tatbestand verlangt, dass jemand ein geschütztes Rechtsgut eines anderen verletzt, etwa Körper, Gesundheit oder Eigentum, dass er dies widerrechtlich tut und dass er vorsätzlich oder fahrlässig handelt. Außerdem muss durch die Verletzung ein Schaden entstanden sein. Die Rechtsfolge lautet: Er muss den entstandenen Schaden ersetzen. Fehlt eines der Merkmale, besteht kein Anspruch nach dieser Norm.",
        ["Nennt die Tatbestandsmerkmale", "Nennt die Rechtsfolge", "Erklärt die Bedeutung fehlender Merkmale"],
      ),
      2: write(
        "Prüfe in den vier Schritten der Subsumtion, ob Mila einen Diebstahl begangen hat: Sie steckt im Supermarkt einen Lippenstift ein, um ihn zu behalten, und geht ohne zu bezahlen hinaus.",
        ["Gehe die Merkmale von § 242 StGB einzeln durch.", "Formuliere am Ende Ergebnis und Rechtsfolge."],
        "Frage: Hat Mila einen Diebstahl nach § 242 StGB begangen? Norm: § 242 StGB. Prüfung: Der Lippenstift gehört dem Supermarkt, er ist also für Mila fremd, und er ist beweglich. Indem sie ihn einsteckt und den Laden verlässt, nimmt sie ihn dem Supermarkt weg. Sie will ihn behalten, also hat sie die Absicht, ihn sich rechtswidrig zuzueignen. Ergebnis: Alle Merkmale sind erfüllt, Mila hat einen Diebstahl begangen. Rechtsfolge: Freiheitsstrafe bis zu fünf Jahren oder Geldstrafe; ist sie Jugendliche, entscheidet ein Jugendgericht nach dem Jugendstrafrecht.",
        ["Arbeitet in vier Schritten", "Prüft alle Merkmale am Fall", "Nennt Ergebnis und Rechtsfolge"],
      ),
    },
  },

  {
    id: "re-unerlaubte-handlung",
    lb: 3,
    unit: "3",
    title: "Unerlaubte Handlung und Deliktsfähigkeit",
    intro: "Wer einem anderen Schaden zufügt, muss ihn ersetzen. Aber ab welchem Alter, und was ist mit den Eltern?",
    paragraphs: [
      "Eine **unerlaubte Handlung**, auch Delikt genannt, liegt im Zivilrecht vor, wenn jemand die Rechtsgüter eines anderen widerrechtlich und schuldhaft verletzt. Wichtigste Norm ist **§ 823 Abs. 1 BGB**. Sie verlangt eine **Verletzung** eines geschützten Rechtsguts wie Körper, Gesundheit oder Eigentum, eine **Handlung**, die diese Verletzung verursacht hat, **Widerrechtlichkeit** und **Verschulden**: Der Schädiger hat **vorsätzlich** gehandelt, also mit Wissen und Wollen, oder **fahrlässig**, also ohne die nötige Sorgfalt. Rechtsfolge ist der **Schadensersatz**, bei Verletzungen auch ein Schmerzensgeld.",
      "Verschulden setzt voraus, dass jemand überhaupt verantwortlich sein kann. Das ist die **Deliktsfähigkeit**, die § 828 BGB nach dem Alter regelt. Kinder unter **sieben Jahren** sind für Schäden nicht verantwortlich. Bei Unfällen mit einem Kraftfahrzeug, einer Schienenbahn oder einer Schwebebahn sind auch Kinder unter **zehn Jahren** nicht verantwortlich, außer sie handeln vorsätzlich. Zwischen 7 und 17 Jahren kommt es darauf an, ob der Minderjährige die **Einsicht** hatte, dass er für sein Handeln verantwortlich ist. Ab **18 Jahren** ist man voll deliktsfähig.",
      "Haftet das Kind nicht, bleibt der Geschädigte nicht immer ohne Ersatz. Eltern haften nach **§ 832 BGB**, wenn sie ihre **Aufsichtspflicht** verletzt haben. Wie viel Aufsicht nötig ist, hängt vom Alter und der Situation ab: Ein Dreijähriger braucht mehr Aufsicht als eine 14-Jährige. Haben die Eltern ihre Pflicht erfüllt, haften sie nicht. Eltern haften also nicht automatisch für ihre Kinder, auch wenn Schilder wie „Eltern haften für ihre Kinder“ das nahelegen.",
      "Weil Schäden teuer werden können, schließen viele Familien eine **private Haftpflichtversicherung** ab. Sie zahlt, wenn ein Familienmitglied einem anderen fahrlässig einen Schaden zufügt, etwa beim Fußballspielen eine Scheibe zerbricht. Vorsätzlich verursachte Schäden zahlt sie in der Regel nicht.",
    ],
    terms: [
      term("Unerlaubte Handlung", "Widerrechtliche und schuldhafte Verletzung fremder Rechtsgüter, die zum Schadensersatz verpflichtet."),
      term("Deliktsfähigkeit", "Fähigkeit, für einen verursachten Schaden zivilrechtlich verantwortlich zu sein."),
      term("Fahrlässigkeit", "Verschulden, bei dem jemand die erforderliche Sorgfalt außer Acht lässt."),
      term("Aufsichtspflicht", "Pflicht der Eltern, Minderjährige ihrem Alter entsprechend zu beaufsichtigen."),
    ],
    law: [
      {
        ref: "§ 828 BGB",
        text: "Wer noch nicht sieben ist, haftet nicht. Wer 7 bis 9 Jahre alt ist, haftet bei Unfällen mit Kraftfahrzeugen und Bahnen nur bei Vorsatz. Bis 17 Jahren haftet nicht, wem die nötige Einsicht in seine Verantwortlichkeit fehlte.",
        url: "https://www.gesetze-im-internet.de/bgb/__828.html",
      },
      {
        ref: "§ 823 Abs. 1 BGB",
        text: "Wer vorsätzlich oder fahrlässig Leben, Körper, Gesundheit, Freiheit, Eigentum oder ein sonstiges Recht eines anderen widerrechtlich verletzt, muss den daraus entstehenden Schaden ersetzen.",
        url: "https://www.gesetze-im-internet.de/bgb/__823.html",
      },
    ],
    takeaway:
      "Wer widerrechtlich und schuldhaft fremde Rechtsgüter verletzt, muss nach § 823 BGB Schadensersatz leisten. Unter 7 Jahren haftet niemand, zwischen 7 und 17 entscheidet die Einsicht, ab 18 haftet man voll. Bei Unfällen mit Kraftfahrzeugen oder Bahnen haften 7- bis 9-Jährige nur bei Vorsatz. Eltern haften nur bei verletzter Aufsichtspflicht.",
    sourceIds: ["lp", "bgb"],
    lab: "verantwortung",
    labGoals: ["kind", "nur-zivil", "jugendstrafrecht"],
    quiz: check(
      "Ein Fünfjähriger wirft beim Spielen einen Ball gegen das Fenster des Nachbarn. Muss er den Schaden selbst ersetzen?",
      "Nein, unter sieben Jahren ist man für Schäden nicht verantwortlich.",
      ["Ja, weil jeder Mensch für jeden Schaden haftet, den er anrichtet.", "Ja, aber nur, wenn er den Ball mit Absicht geworfen hat."],
      "Nach § 828 Abs. 1 BGB ist er nicht deliktsfähig, auch bei Absicht nicht. Zu prüfen bleibt, ob die Eltern ihre Aufsichtspflicht verletzt haben.",
    ),
    workshop: sort(
      "Haftet die Person selbst?",
      "Ordne ein, ob die Person für den Schaden nach § 828 BGB in der Regel selbst verantwortlich ist.",
      ["Haftet selbst", "Haftet nicht selbst"],
      [
        ["Ein 6-Jähriger kratzt mit einem Stein absichtlich über ein Auto.", 1, "Unter sieben Jahren ist man nicht deliktsfähig."],
        ["Eine 15-Jährige, die weiß, was sie tut, beschädigt das Handy einer Mitschülerin.", 0, "Mit der nötigen Einsicht haftet sie."],
        ["Ein 8-Jähriger fährt beim Spielen versehentlich mit dem Rad gegen ein fahrendes Auto.", 1, "Bei Unfällen mit Kraftfahrzeugen haftet man unter zehn nur bei Vorsatz."],
        ["Ein 19-Jähriger stößt beim Rangeln fahrlässig eine Vase um.", 0, "Volljährige sind voll deliktsfähig."],
        ["Ein 12-Jähriger, der die Gefahr wirklich nicht erkennen konnte, verursacht einen Schaden.", 1, "Ohne die nötige Einsicht haftet er nicht."],
      ],
      "Alter und Einsicht entscheiden, ob jemand selbst haftet; die Aufsichtspflicht der Eltern ist eine eigene Frage.",
    ),
    casework: {
      title: "Der Fußball und die Scheibe",
      story:
        "**Ben (12)** spielt im Hof Fußball, obwohl seine Eltern ihm erklärt haben, dass er dort wegen der Fenster nicht schießen soll. Ein harter Schuss zerbricht die **Scheibe der Nachbarin**. Die Reparatur kostet **400 €**.",
      steps: [
        decide("Welche Norm regelt den Anspruch der Nachbarin gegen Ben?", "§ 823 Abs. 1 BGB, die unerlaubte Handlung", "§ 242 StGB, der Diebstahl", "Es geht um Ersatz für ein verletztes Eigentum, also eine unerlaubte Handlung."),
        decide("Hat Ben schuldhaft gehandelt?", "Ja, fahrlässig, denn er kannte die Gefahr und hat trotzdem geschossen.", "Nein, weil er die Scheibe nicht absichtlich treffen wollte.", "Auch Fahrlässigkeit ist Verschulden; Absicht ist nicht nötig."),
        decide("Ist Ben mit 12 Jahren deliktsfähig?", "Ja, wenn er die Einsicht in seine Verantwortung hatte, und darauf deutet die Erklärung der Eltern hin.", "Nein, Kinder unter 14 sind nie verantwortlich.", "Die Grenze von 14 Jahren gilt im Strafrecht, nicht im Zivilrecht."),
      ],
      verdict: "Ben hat fahrlässig fremdes Eigentum verletzt und ist mit 12 Jahren deliktsfähig, weil er die Gefahr kannte. Er muss den Schaden ersetzen; oft zahlt die Haftpflichtversicherung der Familie.",
    },
    tasks: {
      1: write(
        "Erkläre die Altersstufen der Deliktsfähigkeit nach § 828 BGB und nenne zu jeder ein Beispiel.",
        ["Welche Grenzen gibt es bei 7, 10 und 18 Jahren?", "Welche Rolle spielt die Einsicht?"],
        "Unter sieben Jahren ist niemand für Schäden verantwortlich, etwa ein Fünfjähriger, der eine Vase umstößt. Zwischen sieben und neun Jahren haftet ein Kind bei Unfällen mit Autos oder Bahnen nur, wenn es vorsätzlich handelt, etwa wenn ein Achtjähriger aus Unachtsamkeit gegen ein fahrendes Auto radelt, haftet er nicht. Zwischen 7 und 17 Jahren haftet man, wenn man die Einsicht in seine Verantwortung hatte, wie eine 14-Jährige, die wissentlich ein fremdes Handy beschädigt. Ab 18 Jahren ist man voll deliktsfähig.",
        ["Nennt alle Altersstufen richtig", "Erklärt die Bedeutung der Einsicht", "Gibt passende Beispiele"],
      ),
      2: write(
        "An einem Bauzaun hängt das Schild „Eltern haften für ihre Kinder“. Beurteile, ob das Schild die Rechtslage richtig wiedergibt.",
        ["Wann haften Eltern nach § 832 BGB?", "Was gilt, wenn das Kind selbst deliktsfähig ist?"],
        "Das Schild gibt die Rechtslage nicht richtig wieder. Eltern haften nicht automatisch für alles, was ihre Kinder tun. Nach § 832 BGB haften sie nur, wenn sie ihre Aufsichtspflicht verletzt haben, und wie streng diese ist, hängt vom Alter und der Situation ab. Haben sie ihr Kind ausreichend beaufsichtigt und belehrt, haften sie nicht. Ist das Kind selbst deliktsfähig, etwa eine einsichtige 13-Jährige, kann es selbst zum Schadensersatz verpflichtet sein. Das Schild soll vor allem abschrecken; rechtlich ist es eine starke Vereinfachung.",
        ["Nimmt Stellung", "Erklärt die Haftung nach § 832 BGB", "Bezieht die eigene Haftung des Kindes ein"],
      ),
    },
  },

  {
    id: "re-straftat",
    lb: 3,
    unit: "3",
    title: "Straftat, Strafmündigkeit und Jugendstrafrecht",
    intro: "Ab 14 kann man bestraft werden, aber Jugendliche werden anders behandelt als Erwachsene. Warum?",
    paragraphs: [
      "Eine **Straftat** liegt vor, wenn ein Verhalten drei Bedingungen erfüllt. Es muss **tatbestandsmäßig** sein, also alle Merkmale einer Strafnorm erfüllen, etwa des Diebstahls. Es muss **rechtswidrig** sein, also nicht ausnahmsweise erlaubt, wie es bei Notwehr der Fall sein kann. Und der Täter muss **schuldhaft** gehandelt haben: Man muss ihm sein Verhalten persönlich vorwerfen können. Das setzt voraus, dass er alt und reif genug ist.",
      "Wer bei der Tat **noch nicht 14 Jahre** alt ist, ist nach § 19 StGB **schuldunfähig**, also **nicht strafmündig**. Gegen ihn gibt es kein Strafverfahren; das Jugendamt und das Familiengericht können aber Hilfen und Maßnahmen anordnen. **Jugendliche** von 14 bis 17 Jahren sind nach § 3 JGG strafrechtlich verantwortlich, wenn sie nach ihrer Entwicklung reif genug sind, das Unrecht ihrer Tat einzusehen und danach zu handeln. **Heranwachsende** von 18 bis 20 Jahren werden nach Jugendstrafrecht behandelt, wenn sie in ihrer Entwicklung noch einem Jugendlichen gleichstehen oder die Tat eine typische Jugendverfehlung ist; sonst gilt Erwachsenenstrafrecht.",
      "Das **Jugendstrafrecht** im Jugendgerichtsgesetz (JGG) verfolgt vor allem den **Erziehungsgedanken**: Es soll verhindern, dass ein junger Mensch erneut Straftaten begeht. Es kennt abgestufte Folgen. **Erziehungsmaßregeln** sind etwa Weisungen, an einem sozialen Trainingskurs teilzunehmen. **Zuchtmittel** sind die Verwarnung, Auflagen wie Arbeitsstunden oder eine Entschuldigung beim Opfer und der **Jugendarrest** von bis zu vier Wochen. Die **Jugendstrafe** im Gefängnis ist das letzte Mittel; sie dauert mindestens sechs Monate und meist höchstens fünf Jahre.",
      "Oft kommt es gar nicht zu einem Urteil: Bei leichteren Taten kann die Staatsanwaltschaft das Verfahren einstellen, etwa wenn der Jugendliche den Schaden wiedergutmacht. Trotzdem hat eine Straftat Folgen: Ein Verfahren belastet, Entscheidungen werden in einem Register vermerkt und können später etwa bei bestimmten Berufen eine Rolle spielen, und der Schadensersatz im Zivilrecht kommt hinzu.",
    ],
    terms: [
      term("Strafmündigkeit", "Mindestalter für strafrechtliche Verantwortung; in Deutschland ab 14 Jahren."),
      term("Jugendlicher", "Wer zur Zeit der Tat 14, aber noch nicht 18 Jahre alt ist."),
      term("Heranwachsender", "Wer zur Zeit der Tat 18, aber noch nicht 21 Jahre alt ist."),
      term("Erziehungsgedanke", "Leitidee des Jugendstrafrechts: neue Straftaten durch Erziehung statt Vergeltung verhindern."),
      term("Zuchtmittel", "Folgen im Jugendstrafrecht wie Verwarnung, Auflagen oder Jugendarrest."),
    ],
    law: [
      { ref: "§ 19 StGB", text: "Wer bei der Tat noch nicht 14 Jahre alt ist, ist schuldunfähig.", url: "https://www.gesetze-im-internet.de/stgb/__19.html" },
      {
        ref: "§ 3 JGG",
        text: "Ein Jugendlicher ist strafrechtlich verantwortlich, wenn er zur Zeit der Tat reif genug ist, das Unrecht einzusehen und danach zu handeln.",
        url: "https://www.gesetze-im-internet.de/jgg/__3.html",
      },
    ],
    takeaway:
      "Eine Straftat ist tatbestandsmäßig, rechtswidrig und schuldhaft. Strafmündig ist man ab 14 Jahren. Für Jugendliche und oft für Heranwachsende gilt das Jugendstrafrecht mit dem Erziehungsgedanken: Erziehungsmaßregeln, Zuchtmittel und als letztes Mittel die Jugendstrafe.",
    sourceIds: ["lp", "stgb", "jgg"],
    lab: "verantwortung",
    labGoals: ["nur-zivil", "jugendstrafrecht", "heranwachsend"],
    quiz: check(
      "Eine 13-Jährige stiehlt im Kaufhaus eine Jacke. Kann sie dafür bestraft werden?",
      "Nein, sie ist mit 13 Jahren noch nicht strafmündig; Jugendamt und Eltern können aber reagieren.",
      ["Ja, weil Diebstahl in jedem Alter bestraft wird, wenn er mit Absicht geschieht.", "Ja, aber nur mit einer Geldstrafe, die ihre Eltern bezahlen müssen."],
      "Unter 14 Jahren ist man nach § 19 StGB schuldunfähig. Eine Strafe gibt es nicht, zivilrechtliche Folgen und Hilfen des Jugendamts aber schon.",
    ),
    workshop: sort(
      "Welche Folge im Jugendstrafrecht?",
      "Ordne jede Maßnahme eines Jugendgerichts der passenden Art zu.",
      ["Erziehungsmaßregel", "Zuchtmittel", "Jugendstrafe"],
      [
        ["Die Weisung, an einem sozialen Trainingskurs teilzunehmen", 0, "Weisungen regeln die Lebensführung und sollen erziehen."],
        ["Eine förmliche Verwarnung durch die Richterin", 1, "Die Verwarnung ist ein Zuchtmittel."],
        ["Die Auflage, 40 Stunden gemeinnützige Arbeit zu leisten", 1, "Arbeitsauflagen gehören zu den Zuchtmitteln."],
        ["Ein Jahr und sechs Monate in einer Jugendstrafanstalt", 2, "Freiheitsentzug von mindestens sechs Monaten ist Jugendstrafe."],
        ["Zwei Wochen Jugendarrest am Stück", 1, "Der Jugendarrest ist ein Zuchtmittel, keine Jugendstrafe."],
      ],
      "Je schwerer die Tat und je größer die Wiederholungsgefahr, desto einschneidender die Folge.",
    ),
    casework: {
      title: "Graffiti an der Turnhalle",
      story:
        "**Leon (15)** und **Malte (19)** sprühen nachts **Graffiti** an die Turnhalle ihrer Schule. Beide wissen, dass das verboten ist. Die Reinigung kostet **2.500 €**. Für Leon ist es die erste Tat, Malte macht eine Ausbildung und lebt allein.",
      steps: [
        decide("Ist Leon strafrechtlich verantwortlich?", "Ja, wenn er reif genug war, das Unrecht einzusehen, und dafür spricht, dass er das Verbot kannte.", "Nein, Jugendliche unter 16 sind nie strafmündig.", "Ab 14 ist man strafmündig; § 3 JGG verlangt zusätzlich die nötige Reife."),
        decide("Welche Folge ist bei Leons erster Tat wahrscheinlich?", "Eine Auflage wie Arbeitsstunden oder die Wiedergutmachung des Schadens", "Eine Jugendstrafe von zwei Jahren", "Bei einer ersten, nicht schweren Tat reichen meist Erziehungsmaßregeln oder Zuchtmittel."),
        decide("Welches Recht gilt für Malte?", "Das Gericht prüft, ob es Jugend- oder Erwachsenenstrafrecht anwendet.", "Immer das Jugendstrafrecht, weil er noch keine 21 ist.", "Bei Heranwachsenden entscheidet das Gericht nach § 105 JGG anhand seiner Entwicklung und der Tat."),
      ],
      verdict: "Leon fällt unter das Jugendstrafrecht, das auf Erziehung setzt. Bei Malte prüft das Gericht, welches Recht passt. Für den Schaden haften beide zusätzlich zivilrechtlich.",
    },
    tasks: {
      1: write(
        "Erkläre die drei Altersstufen im Strafrecht und nenne jeweils, welches Recht gilt.",
        ["Welche Grenzen liegen bei 14, 18 und 21 Jahren?", "Was prüft das Gericht bei Heranwachsenden?"],
        "Wer bei der Tat jünger als 14 Jahre ist, ist schuldunfähig und kann nicht bestraft werden; das Jugendamt kann Hilfen anbieten. Jugendliche zwischen 14 und 17 Jahren sind strafmündig, wenn sie reif genug sind, das Unrecht einzusehen; für sie gilt das Jugendstrafrecht. Heranwachsende zwischen 18 und 20 Jahren werden nach Jugendstrafrecht behandelt, wenn sie in ihrer Entwicklung noch einem Jugendlichen gleichstehen oder eine typische Jugendverfehlung vorliegt, sonst nach Erwachsenenstrafrecht. Ab 21 gilt immer das allgemeine Strafrecht.",
        ["Nennt die Altersgrenzen", "Ordnet jeder Stufe das passende Recht zu", "Erklärt die Prüfung bei Heranwachsenden"],
      ),
      2: write(
        "„Das Jugendstrafrecht ist zu milde. Jugendliche sollten genauso bestraft werden wie Erwachsene.“ Nimm Stellung und beziehe den Erziehungsgedanken ein.",
        ["Was soll das Jugendstrafrecht erreichen?", "Welche Folgen hat eine Haftstrafe für einen jungen Menschen?"],
        "Ich teile die Aussage nicht. Das Jugendstrafrecht ist nicht einfach milder, sondern verfolgt ein anderes Ziel: Es soll durch Erziehung verhindern, dass junge Menschen erneut Straftaten begehen. Jugendliche sind in ihrer Entwicklung noch nicht abgeschlossen und können aus Fehlern lernen. Maßnahmen wie Trainingskurse, Arbeitsstunden oder ein Täter-Opfer-Ausgleich wirken oft besser als Gefängnis, das junge Menschen aus Schule und Ausbildung reißt und mit anderen Straftätern zusammenbringt. Bei schweren Taten gibt es auch im Jugendstrafrecht Jugendstrafe von mehreren Jahren. Gegen Wiederholungstaten ist Erziehung deshalb der wirksamere Weg.",
        ["Nimmt Stellung", "Erklärt den Erziehungsgedanken", "Wägt Wirkungen verschiedener Folgen ab"],
      ),
    },
  },

  {
    id: "re-internet",
    lb: 3,
    unit: "3",
    title: "Rechtssicher im Internet handeln",
    intro: "Ein Foto posten, einen Kommentar schreiben, einen Screenshot teilen: Auch im Netz gilt das Recht.",
    paragraphs: [
      "Das Internet ist kein rechtsfreier Raum. Jeder Mensch hat ein **allgemeines Persönlichkeitsrecht**, das das Grundgesetz aus der Menschenwürde und der freien Entfaltung der Persönlichkeit ableitet. Dazu gehört das **Recht am eigenen Bild**: Nach § 22 Kunsturhebergesetz dürfen Bilder, auf denen eine Person erkennbar ist, nur mit ihrer **Einwilligung** verbreitet oder öffentlich gezeigt werden. Wer ein peinliches Foto einer Mitschülerin ohne Erlaubnis in eine Gruppe stellt, verletzt dieses Recht und kann sich strafbar machen.",
      "Auch Worte haben Grenzen. Eine **Beleidigung** nach § 185 StGB, etwa ein Schimpfwort in einem Kommentar, ist strafbar, wird aber nur auf Antrag verfolgt. Wer über einen anderen unwahre, herabsetzende Tatsachen verbreitet, kann sich wegen **übler Nachrede** oder **Verleumdung** strafbar machen. Online verbreitete Beleidigungen werden härter bestraft, weil sie viele Menschen erreichen und kaum zu löschen sind. **Cybermobbing** ist kein eigener Straftatbestand, setzt sich aber oft aus strafbaren Handlungen wie Beleidigung, Bedrohung oder der Verbreitung von Bildern ohne Einwilligung zusammen.",
      "Auch deine eigenen **Daten** sind geschützt. Die Datenschutz-Grundverordnung der EU regelt, dass personenbezogene Daten wie Name, Adresse, Fotos oder Standort nur unter bestimmten Bedingungen verarbeitet werden dürfen. Für viele Online-Dienste ist in Deutschland bis zum Alter von **16 Jahren** die Zustimmung der Eltern nötig, wenn die Datenverarbeitung auf einer Einwilligung beruht. Viele Plattformen haben zusätzlich eigene **Altersgrenzen** in ihren Nutzungsbedingungen.",
      "Rechtssicher handelst du mit einigen Regeln: Fotos anderer nur mit deren Einwilligung posten, nichts schreiben, was du der Person nicht ins Gesicht sagen würdest, private Nachrichten und Screenshots nicht ohne Zustimmung weiterverbreiten, sparsam mit eigenen Daten umgehen und bei Beleidigungen oder Bedrohungen Beweise sichern, Erwachsene einschalten und den Beitrag beim Anbieter melden.",
    ],
    terms: [
      term("Persönlichkeitsrecht", "Recht jedes Menschen auf Schutz seiner Persönlichkeit, Ehre und Privatsphäre."),
      term("Recht am eigenen Bild", "Bilder einer erkennbaren Person dürfen grundsätzlich nur mit ihrer Einwilligung verbreitet werden."),
      term("Beleidigung", "Kundgabe von Missachtung gegenüber einer Person, etwa durch Schimpfwörter; strafbar nach § 185 StGB."),
      term("Personenbezogene Daten", "Informationen, die sich auf eine bestimmte oder bestimmbare Person beziehen, etwa Name oder Foto."),
    ],
    law: [
      {
        ref: "§ 22 KunstUrhG",
        text: "Bildnisse dürfen nur mit Einwilligung der abgebildeten Person verbreitet oder öffentlich zur Schau gestellt werden. Ausnahmen gelten etwa für Personen der Zeitgeschichte oder Menschen, die nur als Beiwerk erscheinen.",
        url: "https://www.gesetze-im-internet.de/kunsturhg/__22.html",
      },
      {
        ref: "§ 185 StGB",
        text: "Eine Beleidigung wird mit Freiheitsstrafe bis zu einem Jahr oder mit Geldstrafe bestraft; geschieht sie öffentlich oder durch Verbreiten eines Inhalts, mit bis zu zwei Jahren.",
        url: "https://www.gesetze-im-internet.de/stgb/__185.html",
      },
    ],
    takeaway:
      "Auch im Netz gelten Persönlichkeitsrecht, Recht am eigenen Bild, Strafrecht und Datenschutz. Poste Bilder anderer nur mit Einwilligung, beleidige niemanden, geh sparsam mit Daten um und sichere bei Angriffen Beweise.",
    sourceIds: ["lp", "kug", "stgb", "bfdi", "klicksafe"],
    quiz: check(
      "Darf Nora ein Gruppenfoto vom Klassenausflug, auf dem alle gut zu erkennen sind, in ihrem öffentlichen Profil posten?",
      "Nur wenn alle Abgebildeten eingewilligt haben, denn jeder hat ein Recht am eigenen Bild.",
      ["Ja, weil sie das Foto selbst gemacht hat und es deshalb ihr allein gehört.", "Ja, weil Fotos von Schulausflügen immer öffentlich gezeigt werden dürfen."],
      "Nora hat das Urheberrecht am Foto, aber die Abgebildeten haben das Recht am eigenen Bild. Für Ausflugsfotos gibt es keine allgemeine Ausnahme.",
    ),
    workshop: sort(
      "Erlaubt oder rechtlich problematisch?",
      "Ordne jede Handlung im Netz ein.",
      ["In Ordnung", "Rechtlich problematisch"],
      [
        ["Paula postet ein Selfie, auf dem nur sie selbst zu sehen ist.", 0, "Über ihr eigenes Bild entscheidet sie selbst."],
        ["Ein Schüler teilt ohne Erlaubnis ein peinliches Foto eines Mitschülers im Klassenchat.", 1, "Das verletzt das Recht am eigenen Bild."],
        ["In einem Kommentar wird eine Lehrerin mit Schimpfwörtern bedacht.", 1, "Das kann eine strafbare Beleidigung sein."],
        ["Zwei Freundinnen posten ein gemeinsames Foto, nachdem beide zugestimmt haben.", 0, "Mit Einwilligung ist das Posten erlaubt."],
        ["Jemand verbreitet das erfundene Gerücht, ein Mitschüler habe gestohlen.", 1, "Unwahre, herabsetzende Behauptungen können Verleumdung sein."],
      ],
      "Einwilligung und Respekt sind die wichtigsten Regeln im Netz.",
    ),
    casework: {
      title: "Der Screenshot im Klassenchat",
      story:
        "**Elif (14)** schreibt ihrer besten Freundin privat, dass sie in **Jonas** verliebt ist. Die Freundin macht einen **Screenshot** und stellt ihn mit einem spöttischen Kommentar in den **Klassenchat**. Andere schreiben beleidigende Sprüche darunter.",
      steps: [
        decide("Welches Recht von Elif ist betroffen?", "Ihr Persönlichkeitsrecht, weil eine private Mitteilung bloßgestellt wird.", "Ihr Urheberrecht an der Nachricht.", "Es geht um Privatsphäre und Ehre, also das Persönlichkeitsrecht."),
        decide("Wie sind die beleidigenden Sprüche einzuordnen?", "Sie können strafbare Beleidigungen sein, die auf Antrag verfolgt werden.", "Sie sind erlaubt, weil sie in einem geschlossenen Chat stehen.", "Auch in Gruppenchats gilt das Strafrecht; geschlossene Gruppen sind kein rechtsfreier Raum."),
        decide("Was sollte Elif tun?", "Screenshots als Beweise sichern, Eltern oder Lehrkräfte einschalten und die Beiträge melden.", "Sofort mit eigenen Beleidigungen zurückschlagen.", "Beweise und Hilfe von Erwachsenen sind der richtige Weg; Gegenbeleidigungen wären selbst strafbar."),
      ],
      verdict: "Das Weiterleiten verletzt Elifs Persönlichkeitsrecht, die Sprüche können Beleidigungen sein. Elif sichert Beweise und holt sich Hilfe, statt selbst zu beleidigen.",
    },
    tasks: {
      1: write(
        "Erkläre an zwei Beispielen, welche Rechtsnormen du beim Posten in sozialen Netzwerken beachten musst.",
        ["Denke an Fotos und an Kommentare.", "Welche Gesetze schützen die anderen?"],
        "Erstens das Recht am eigenen Bild nach § 22 Kunsturhebergesetz: Wenn ich ein Foto von einer Party poste, auf dem meine Freunde erkennbar sind, brauche ich ihre Einwilligung, sonst verletze ich ihre Rechte. Zweitens das Strafrecht: Schreibe ich unter einem Video einen Kommentar mit Schimpfwörtern über eine Person, kann das eine Beleidigung nach § 185 StGB sein. Weil sie öffentlich geschieht, droht sogar eine höhere Strafe. Ich frage deshalb vor dem Posten, ob alle einverstanden sind, und bleibe sachlich.",
        ["Nennt zwei passende Rechtsnormen", "Erklärt sie an Beispielen", "Leitet ein eigenes Verhalten ab"],
      ),
      2: write(
        "Entwirf fünf Regeln für einen Klassenchat, die rechtssicheres Handeln im Internet fördern, und begründe jede mit einer Rechtsnorm oder einem Recht.",
        ["Welche Probleme kommen in Klassenchats häufig vor?", "Welches Recht schützt dabei wen?"],
        "Erstens: Wir posten Fotos von anderen nur, wenn sie zugestimmt haben; Grundlage ist das Recht am eigenen Bild. Zweitens: Wir beleidigen niemanden, denn Beleidigungen sind nach § 185 StGB strafbar. Drittens: Wir leiten keine privaten Nachrichten oder Screenshots ohne Zustimmung weiter, weil das das Persönlichkeitsrecht verletzt. Viertens: Wir teilen keine Adressen oder Telefonnummern anderer, denn das sind geschützte personenbezogene Daten. Fünftens: Wer angegriffen wird, sichert Beweise und wendet sich an eine Lehrkraft, damit nicht mit neuen Beleidigungen reagiert wird.",
        ["Formuliert fünf klare Regeln", "Begründet jede mit einer Rechtsnorm oder einem Recht", "Die Regeln passen zu typischen Chatproblemen"],
      ),
    },
  },

  {
    id: "re-urheberrecht",
    lb: 3,
    unit: "3",
    title: "Geistiges Eigentum und Urheberrecht",
    intro: "Ein Song, ein Foto, ein Referat: Wer etwas erschafft, bestimmt, was damit geschieht. Das gilt auch für dich.",
    paragraphs: [
      "Nicht nur Dinge, auch Ideen und Werke können geschützt sein. Man spricht von **geistigem Eigentum**. Das **Urheberrechtsgesetz** schützt **Werke**: persönliche geistige Schöpfungen wie Texte, Musik, Fotos, Filme, Zeichnungen oder Computerprogramme. **Urheber** ist, wer das Werk geschaffen hat, auch wenn er erst 13 ist. Der Schutz entsteht automatisch mit der Schöpfung; man muss nichts anmelden. Er endet **70 Jahre nach dem Tod** des Urhebers.",
      "Der Urheber hat das **ausschließliche Recht**, über sein Werk zu bestimmen: Nur er darf es vervielfältigen, verbreiten und öffentlich zugänglich machen, etwa ins Internet stellen. Andere brauchen dafür seine Erlaubnis, eine **Lizenz**. Manche Urheber erlauben die Nutzung unter bestimmten Bedingungen, zum Beispiel mit **Creative-Commons-Lizenzen**, die oft nur die Nennung des Namens verlangen.",
      "Das Gesetz erlaubt bestimmte Nutzungen auch ohne Erlaubnis. Für den **privaten Gebrauch** darfst du einzelne Kopien machen, wenn die Vorlage nicht offensichtlich rechtswidrig ist. Beim **Zitat** darfst du Teile eines Werks übernehmen, wenn du dich damit auseinandersetzt, die Quelle angibst und nur so viel übernimmst, wie der Zweck rechtfertigt. Im **Unterricht** dürfen Lehrkräfte bis zu 15 % eines Werks für ihre Klasse nutzen. Wer dagegen ein fremdes Foto oder einen Song ohne Erlaubnis in sozialen Netzwerken veröffentlicht, verletzt das Urheberrecht.",
      "Die **Folgen** können teuer sein. Der Rechteinhaber kann verlangen, dass die Nutzung beseitigt und künftig unterlassen wird, und Schadensersatz fordern. Häufig verschicken Anwälte eine **Abmahnung** mit Kostenforderung. Vorsätzliche Verstöße können auch strafbar sein. Im Schulalltag bedeutet das: Quellen in Referaten angeben, Bilder aus lizenzfreien Quellen oder mit passender Lizenz nutzen und die Werke deiner Mitschüler ebenso achten wie deine eigenen.",
    ],
    terms: [
      term("Geistiges Eigentum", "Rechte an geistigen Schöpfungen wie Texten, Musik, Bildern oder Erfindungen."),
      term("Werk", "Persönliche geistige Schöpfung, die das Urheberrecht schützt, etwa ein Text, Foto oder Lied."),
      term("Lizenz", "Erlaubnis des Rechteinhabers, ein Werk auf bestimmte Weise zu nutzen."),
      term("Zitat", "Übernahme eines Werkteils zur Auseinandersetzung mit Quellenangabe, die das Gesetz erlaubt."),
      term("Abmahnung", "Aufforderung, eine Rechtsverletzung zu beenden, oft verbunden mit einer Kostenforderung."),
    ],
    law: [
      { ref: "§ 64 UrhG", text: "Das Urheberrecht erlischt 70 Jahre nach dem Tod des Urhebers.", url: "https://www.gesetze-im-internet.de/urhg/__64.html" },
      {
        ref: "§ 51 UrhG",
        text: "Ein veröffentlichtes Werk darf zum Zweck des Zitats genutzt werden, wenn der Umfang durch diesen Zweck gerechtfertigt ist; die Quelle ist anzugeben.",
        url: "https://www.gesetze-im-internet.de/urhg/__51.html",
      },
      {
        ref: "§ 97 UrhG",
        text: "Wer ein Urheberrecht widerrechtlich verletzt, kann auf Beseitigung und Unterlassung und bei Verschulden auf Schadensersatz in Anspruch genommen werden.",
        url: "https://www.gesetze-im-internet.de/urhg/__97.html",
      },
    ],
    takeaway:
      "Das Urheberrecht schützt Werke automatisch bis 70 Jahre nach dem Tod des Urhebers. Wer fremde Werke veröffentlicht, braucht eine Lizenz; erlaubt sind etwa Privatkopie, Zitat mit Quelle und Nutzung im Unterricht. Verstöße führen zu Abmahnung und Schadensersatz.",
    sourceIds: ["lp", "urhg", "cc", "klicksafe"],
    quiz: check(
      "Tobias lädt ein Lied seiner Lieblingsband als Hintergrundmusik zu seinem öffentlichen Video hoch, ohne um Erlaubnis zu fragen. Was gilt?",
      "Er verletzt das Urheberrecht, weil er das Werk ohne Lizenz öffentlich zugänglich macht.",
      ["Das ist erlaubt, weil er das Lied vorher legal gekauft hat und es daher nutzen darf.", "Das ist erlaubt, solange er den Namen der Band im Video nennt."],
      "Ein Kauf erlaubt die private Nutzung, nicht die Veröffentlichung. Die Namensnennung ersetzt keine Lizenz, außer eine Lizenz verlangt gerade nur das.",
    ),
    workshop: sort(
      "Erlaubt oder Urheberrechtsverletzung?",
      "Ordne jede Nutzung eines fremden Werks ein.",
      ["Erlaubt", "Verletzung"],
      [
        ["Lara kopiert eine gekaufte CD für sich selbst auf ihr Handy.", 0, "Einzelne Kopien zum privaten Gebrauch sind erlaubt."],
        ["Ein Schüler stellt einen kompletten Kinofilm zum Download ins Netz.", 1, "Das Werk wird ohne Erlaubnis öffentlich zugänglich gemacht."],
        ["In einem Referat zitiert Mia zwei Sätze aus einem Buch mit Quellenangabe, um sie zu besprechen.", 0, "Das ist ein zulässiges Zitat."],
        ["Ein Verein nutzt ein fremdes Foto aus einer Suchmaschine für sein Plakat.", 1, "Für die Veröffentlichung fehlt eine Lizenz."],
        ["Ein Blog nutzt ein Bild mit Creative-Commons-Lizenz und nennt den Fotografen wie verlangt.", 0, "Die Lizenzbedingungen sind erfüllt."],
      ],
      "Veröffentlichen braucht eine Erlaubnis, privat nutzen und richtig zitieren nicht.",
    ),
    casework: {
      title: "Das Plakat für das Schulfest",
      story:
        "Die **SMV** gestaltet ein **Plakat für das Schulfest**. **Kim** nimmt ein tolles Foto aus einer Suchmaschine. **Ali** zeichnet selbst ein Logo. Später entdeckt die SMV das Logo von Ali ohne seine Zustimmung auf den T-Shirts einer anderen Schule.",
      steps: [
        decide("Darf die SMV das Foto aus der Suchmaschine verwenden?", "Nur mit Lizenz des Fotografen oder wenn es unter einer passenden freien Lizenz steht.", "Ja, weil alles in einer Suchmaschine frei nutzbar ist.", "Auffindbar heißt nicht frei; der Fotograf entscheidet über die Veröffentlichung."),
        decide("Ist Ali Urheber seines Logos?", "Ja, es ist seine persönliche geistige Schöpfung, auch wenn er Schüler ist.", "Nein, Schüler können keine Urheber sein.", "Das Alter spielt keine Rolle; der Schutz entsteht mit der Schöpfung."),
        decide("Was kann Ali gegen die andere Schule verlangen?", "Dass die Nutzung beendet und unterlassen wird, eventuell auch Schadensersatz.", "Nichts, weil er das Logo nicht angemeldet hat.", "Das Urheberrecht entsteht ohne Anmeldung; § 97 UrhG gibt ihm Ansprüche."),
      ],
      verdict: "Für das Foto braucht die SMV eine Lizenz. Ali ist Urheber seines Logos und kann sich gegen die unerlaubte Nutzung wehren.",
    },
    tasks: {
      1: write(
        "Erkläre, was das Urheberrecht schützt, wer Urheber ist und wie lange der Schutz dauert. Nenne zwei Nutzungen, die ohne Erlaubnis erlaubt sind.",
        ["Was zählt als Werk?", "Was darfst du privat und im Referat?"],
        "Das Urheberrecht schützt Werke, also persönliche geistige Schöpfungen wie Texte, Lieder, Fotos, Filme oder Zeichnungen. Urheber ist, wer das Werk geschaffen hat, auch ein Schüler. Der Schutz entsteht automatisch und endet 70 Jahre nach dem Tod des Urhebers. Ohne Erlaubnis darf ich einzelne Kopien für den privaten Gebrauch machen, etwa ein gekauftes Lied auf mein Handy kopieren. Außerdem darf ich in einem Referat Teile eines Werks mit Quellenangabe zitieren, wenn ich mich damit auseinandersetze.",
        ["Erklärt Werk und Urheber", "Nennt die Schutzdauer", "Nennt zwei erlaubte Nutzungen"],
      ),
      2: write(
        "Deine Klasse erstellt eine Website über ihre Projektwoche. Reflektiere, wie ihr dabei geistiges Eigentum und Persönlichkeitsrechte schützt, und nenne konkrete Regeln.",
        ["Welche Bilder, Texte und Musik wollt ihr nutzen?", "Wer ist auf euren Fotos zu sehen?"],
        "Bei Bildern und Musik achten wir auf das Urheberrecht: Wir nutzen eigene Fotos und Texte oder Material mit freier Lizenz, zum Beispiel Creative Commons, und nennen die Urheber so, wie es die Lizenz verlangt. Fremde Inhalte aus Suchmaschinen verwenden wir nicht ohne Erlaubnis. Zitate aus Büchern kennzeichnen wir mit Quelle. Bei Fotos von Mitschülern und Lehrkräften achten wir auf das Recht am eigenen Bild: Wir veröffentlichen nur Bilder von Personen, die eingewilligt haben, bei Minderjährigen auch mit Zustimmung der Eltern. Außerdem nennen wir bei Texten von Mitschülern deren Namen, denn auch sie sind Urheber.",
        ["Bezieht das Urheberrecht ein", "Bezieht das Persönlichkeitsrecht ein", "Formuliert konkrete Regeln"],
      ),
    },
  },
];
