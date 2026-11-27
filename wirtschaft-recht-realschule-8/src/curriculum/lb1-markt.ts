import type { Lesson } from "../model/types";
import { check, decide, sort, term, write } from "./lesson-parts";

export const LB1: Lesson[] = [
  {
    id: "wh-prinzip",
    lb: 1,
    unit: "1",
    title: "Bedürfnisse, Knappheit und ökonomisches Prinzip",
    intro: "Wünsche gibt es viele, Geld und Zeit sind begrenzt. Wie man damit klug entscheidet.",
    paragraphs: [
      "Lena hat Hunger, wünscht sich neue Kopfhörer und träumt von einem Urlaub am Meer. Solche Wünsche heißen **Bedürfnisse**: Man spürt, dass einem etwas fehlt. Nach der Dringlichkeit unterscheidet man **Existenzbedürfnisse** (Essen, Kleidung, Wohnen), **Kulturbedürfnisse** (Bildung, Kino, Musik) und **Luxusbedürfnisse**, die weit über das Übliche hinausgehen. Wo die Grenzen liegen, sieht jeder etwas anders. Und kaum ist ein Wunsch erfüllt, meldet sich der nächste: Bedürfnisse sind praktisch unbegrenzt.",
      "Dem stehen begrenzte Mittel gegenüber: Geld, Zeit, Rohstoffe und Arbeitskraft sind **knapp**. Mittel, die Bedürfnisse befriedigen, heißen **Güter**. Das können Sachgüter (ein Fahrrad) oder Dienstleistungen (ein Haarschnitt) sein. Nur wenige Güter sind **freie Güter**, die ohne Aufwand in ausreichender Menge da sind, etwa die Atemluft, auch wenn saubere Luft in Städten knapp werden kann. Fast alle anderen sind **wirtschaftliche Güter**: Sie sind knapp und kosten deshalb etwas. Weil Wünsche und Mittel nicht zusammenpassen, müssen wir auswählen und auf manches verzichten. Genau das ist Wirtschaften.",
      "Das **ökonomische Prinzip** gibt dafür eine Faustregel: Setze deine knappen Mittel so ein, dass Aufwand und Ertrag möglichst günstig zueinander stehen. Es gibt zwei Formen. Beim **Minimalprinzip** steht das Ziel fest, und man setzt möglichst wenig Mittel ein: Bastian will genau diese Sneaker und sucht den günstigsten Laden. Beim **Maximalprinzip** stehen die Mittel fest, und man holt möglichst viel heraus: Mit 50 Euro für ein Geburtstagsgeschenk sucht Hanna das Beste, was sie dafür bekommt. Beides zugleich geht nicht: Man kann nicht das beste Ergebnis und den geringsten Einsatz verlangen.",
      "Auf das eigene Konsumverhalten übertragen heißt das: Wer 30 Euro Taschengeld im Monat hat, besitzt ein kleines **Budget** und muss Prioritäten setzen. Jeder Euro für Snacks fehlt für das Konzert im nächsten Monat. Hilfreich sind Preisvergleiche, ein Blick auf die Qualität, Sparen auf größere Wünsche und die Frage: Brauche ich das wirklich, oder will ich es nur gerade haben? Das ökonomische Prinzip verlangt also nicht, geizig zu sein, sondern bewusst zu entscheiden, was einem das knappe Geld wert ist.",
    ],
    terms: [
      { term: "Bedürfnis", text: "Das Gefühl, dass einem etwas fehlt, verbunden mit dem Wunsch, diesen Mangel zu beseitigen." },
      { term: "Knappheit", text: "Die vorhandenen Mittel reichen nicht aus, um alle Bedürfnisse zu befriedigen." },
      { term: "Wirtschaftliches Gut", text: "Ein Gut, das knapp ist und deshalb etwas kostet, im Gegensatz zu freien Gütern wie der Atemluft." },
      { term: "Minimalprinzip", text: "Ein festgelegtes Ziel wird mit möglichst geringem Einsatz an Mitteln erreicht." },
      { term: "Maximalprinzip", text: "Mit gegebenen Mitteln wird ein möglichst großer Erfolg erzielt." },
    ],
    takeaway:
      "Bedürfnisse sind unbegrenzt, die Mittel dagegen knapp. Das ökonomische Prinzip hilft zu entscheiden: ein festes Ziel mit möglichst wenig Mitteln erreichen (Minimalprinzip) oder mit festen Mitteln möglichst viel erreichen (Maximalprinzip).",
    sourceIds: ["lp"],
    quiz: {
      question: "Welches Beispiel zeigt das Maximalprinzip?",
      answer: "Die Klasse hat 60 Euro für ein Fest und holt damit so viel Programm heraus wie möglich.",
      wrong: [
        "Die Klasse will genau dieses Programm und sucht den Anbieter mit dem niedrigsten Preis.",
        "Die Klasse will das beste Programm und möglichst wenig dafür bezahlen.",
      ],
      explanation:
        "Beim Maximalprinzip sind die Mittel (60 Euro) vorgegeben, und man holt das Beste heraus. Wer das Ziel festlegt und den Preis drückt, folgt dem Minimalprinzip. Beides zugleich, bestes Ergebnis bei geringstem Einsatz, lässt sich nicht verlangen.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Art von Bedürfnis ist das?",
      instruction:
        "Ordne jeden Wunsch einer Bedürfnisart zu. Frage dich: Ist es zum Überleben nötig, gehört es zum Leben in der Gesellschaft, oder geht es weit darüber hinaus?",
      categories: ["Existenzbedürfnis", "Kulturbedürfnis", "Luxusbedürfnis"],
      entries: [
        {
          text: "Nele isst morgens ein Brot und trinkt etwas, damit sie gut durch den Schultag kommt.",
          target: 0,
          feedback: "Essen und Trinken sichern das Überleben.",
        },
        {
          text: "Ole lernt Gitarre und geht einmal im Monat zu einem Konzert.",
          target: 1,
          feedback: "Musik und Kultur bereichern das Leben, sind aber nicht zum Überleben nötig.",
        },
        {
          text: "Ein Unternehmer kauft eine Armbanduhr für 80.000 Euro, obwohl seine alte Uhr noch gut funktioniert.",
          target: 2,
          feedback: "Das geht weit über das Übliche hinaus: ein Luxusbedürfnis.",
        },
        {
          text: "Familie Yilmaz mietet eine Wohnung, damit alle ein Dach über dem Kopf haben.",
          target: 0,
          feedback: "Wohnen gehört zu den Grundbedürfnissen, die das Überleben sichern.",
        },
        {
          text: "Ayşe besucht mit ihrer Klasse ein Theaterstück und liest danach das Buch dazu.",
          target: 1,
          feedback: "Bildung und Theater gehören zum kulturellen Leben.",
        },
        {
          text: "Ein Geschäftsmann lässt sich eine Privatyacht bauen, die er nur zwei Wochen im Jahr nutzt.",
          target: 2,
          feedback: "Eine eigene Yacht übersteigt jedes übliche Maß: Luxus.",
        },
      ],
      conclusion:
        "Die Grenzen sind fließend: Was für eine Person Luxus ist, gehört für eine andere zum Alltag. Sicher ist nur, dass alle drei Arten um dasselbe knappe Geld konkurrieren.",
    },
    casework: {
      title: "Tims Skateboard",
      story:
        "Tim (15) bekommt **40 Euro Taschengeld** im Monat und spart auf ein Skateboard. Im Laden in der Stadt kostet es **90 Euro**, ein Onlineshop bietet genau dasselbe Modell für **75 Euro** an. Tim kann pro Monat höchstens **25 Euro** zurücklegen.",
      steps: [
        {
          question: "Tim will genau dieses Skateboard und sucht den günstigsten Anbieter. Welches Prinzip wendet er an?",
          options: [
            "Das Minimalprinzip: Das Ziel steht fest, die Mittel sollen möglichst klein sein.",
            "Das Maximalprinzip: Die Mittel stehen fest, der Ertrag soll möglichst groß sein.",
            "Kein Prinzip, denn Tim richtet sich nur nach dem Preis.",
          ],
          answer: 0,
          explanation: "Das Ziel (genau dieses Board) steht fest, und Tim senkt den Mitteleinsatz von 90 auf 75 Euro.",
        },
        {
          question: "Wie viele Monate muss Tim mindestens sparen, um das günstigere Angebot zu bezahlen?",
          options: [
            "Drei Monate, denn 3 mal 25 Euro sind 75 Euro.",
            "Zwei Monate, denn 2 mal 40 Euro Taschengeld sind 80 Euro.",
            "Vier Monate, denn er braucht 90 Euro für das Board.",
          ],
          answer: 0,
          explanation:
            "Tim kann nur 25 Euro im Monat zurücklegen, nicht sein ganzes Taschengeld. Für 75 Euro braucht er daher drei Monate. Der Preis von 90 Euro gilt nur im Laden.",
        },
        {
          question: "Tim möchte außerdem jeden Monat zweimal ins Kino (je 10 Euro). Was folgt aus seinem Budget?",
          options: [
            "Er muss sich entscheiden: Sparen und Kino kosten zusammen 45 Euro und übersteigen sein Taschengeld.",
            "Er kann beides, weil Sparen und Kino aus verschiedenen Töpfen bezahlt werden.",
            "Er muss auf das Kino ganz verzichten, weil Kultur nie wichtig sein kann.",
          ],
          answer: 0,
          explanation:
            "25 Euro Sparen und 20 Euro Kino ergeben 45 Euro, aber es sind nur 40 Euro da. Das ist Knappheit: Tim muss Prioritäten setzen, also weniger Kino oder länger sparen.",
        },
      ],
      verdict:
        "Mit dem Minimalprinzip kommt Tim nach drei Monaten ans Ziel. Weil sein Taschengeld knapp ist, muss er aber abwägen: weniger Kino oder ein späterer Kauf.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre, warum Menschen wirtschaften müssen, und beschreibe das Minimalprinzip und das Maximalprinzip, jeweils mit einem Beispiel aus deinem Alltag.",
        hints: ["Was ist unbegrenzt, und was ist begrenzt?", "Was steht beim Minimalprinzip fest, und was beim Maximalprinzip?"],
        model:
          "Menschen müssen wirtschaften, weil ihre Bedürfnisse unbegrenzt sind, ihre Mittel wie Geld und Zeit aber knapp. Deshalb müssen sie auswählen. Beim Minimalprinzip steht das Ziel fest und der Einsatz soll klein sein: Ich will ein bestimmtes Spiel und kaufe es beim günstigsten Händler. Beim Maximalprinzip steht das Budget fest und der Ertrag soll groß sein: Für 20 Euro Taschengeld suche ich mir die Snacks, die am längsten satt machen.",
        criteria: [
          "Nennt die Knappheit der Mittel als Grund für das Wirtschaften",
          "Erklärt Minimal- und Maximalprinzip richtig (was ist jeweils festgelegt)",
          "Gibt zu beiden Prinzipien ein passendes Alltagsbeispiel",
        ],
      },
      2: {
        prompt:
          "Kai sagt: „Das ökonomische Prinzip heißt, immer das Billigste zu kaufen.“ Er kauft eine Handyhülle für 2 Euro, die nach drei Wochen kaputtgeht. Beurteile, ob Kai nach dem ökonomischen Prinzip gehandelt hat.",
        hints: [
          "Was muss beim Minimalprinzip gleich bleiben, wenn man Preise vergleicht?",
          "Was kostet Kai die billige Hülle auf lange Sicht?",
        ],
        model:
          "Kai hat das Prinzip missverstanden. Beim Minimalprinzip bleibt das Ziel gleich, hier eine Hülle, die das Handy dauerhaft schützt. Die Hülle für 2 Euro erreicht dieses Ziel nicht, denn sie hält nur drei Wochen, sodass Kai bald eine neue kaufen muss und auf Dauer mehr ausgibt. Günstig ist also nur, was bei gleicher Leistung weniger kostet. Klug ist, Preis und Qualität zu vergleichen.",
        criteria: [
          "Erklärt, dass beim Minimalprinzip das Ziel (die Qualität) gleich bleiben muss",
          "Wendet das auf Kais Handyhülle an",
          "Begründet ein eigenes Urteil mit der Folge auf lange Sicht",
        ],
      },
    },
  },

  {
    id: "wh-globalisierung", lb: 1, unit: "1", title: "Von der Selbstversorgung zur Globalisierung",
    intro: "Dein T-Shirt verbindet mehrere Orte. Verfolge den Weg vom Rohstoff bis zum Laden und wäge die Folgen ab.",
    paragraphs: [
      "Bei der **Selbstversorgung** erzeugt ein Haushalt möglichst vieles selbst. Bei der **Fremdversorgung** stellen andere her, was du brauchst. Wer sich auf eine Tätigkeit spezialisiert, gewinnt Übung und kann mehr herstellen. Überschüsse können getauscht werden. Geld erleichtert den Tausch, weil eine Schneiderin dann Kundinnen Geld abnehmen und davon anderswo Brot kaufen kann.",
      "Bei **internationaler Arbeitsteilung** laufen einzelne Schritte in verschiedenen Ländern ab. Beispiel: Baumwolle wird in Indien angebaut, in Bangladesch verarbeitet und genäht und in Deutschland verkauft. Unternehmen wählen Standorte nach Kosten, verfügbaren Fachkräften, Infrastruktur und Marktnähe. Auch Dienstleistungen und Ideen werden über Grenzen ausgetauscht. Diese wachsende Verflechtung heißt **Globalisierung**.",
      "Ein neuer Auftrag kann am Produktionsort Einkommen schaffen und den Preis für Käufer senken. Gleichzeitig können langer Transport, schlechte Arbeitsbedingungen und die Abhängigkeit von einzelnen Zulieferern zum Problem werden. Wäge die Folgen für Beschäftigte, Betriebe, Kunden und Umwelt ab. Nutze für ein aktuelles Beispiel eine datierte Quelle und unterscheide Zahlen, Vermutungen und dein Urteil.",
    ],
    terms: [term("Arbeitsteilung", "Ein Gut entsteht in mehreren spezialisierten Arbeitsschritten."), term("Lieferkette", "Verbund der Stationen vom Rohstoff über die Fertigung bis zum Verkauf.")],
    visual: { title: "Der Weg eines T-Shirts", steps: ["Indien · Baumwolle anbauen", "Bangladesch · Stoff herstellen und nähen", "Deutschland · verkaufen"] },
    takeaway: "Arbeitsteilung kann Kosten senken und Einkommen schaffen. Wer ihre Folgen beurteilt, betrachtet mehrere Beteiligte und die gesamte Lieferkette.",
    sourceIds: ["lp", "destatis"],
    quiz: check("Was zeigt die Fremdversorgung?", "Der Haushalt kauft Brot von einer Bäckerei.", ["Der Haushalt bäckt Brot fürs eigene Frühstück.", "Der Haushalt lagert sein selbst gebackenes Brot."], "Eine andere Person oder ein Betrieb stellt das Gut für den Haushalt her."),
    workshop: sort("Folgen einer Standortverlagerung", "Ordne die Folgen für die Beteiligten ein.", ["Chance", "Risiko"], [
      ["Eine Näherei nimmt mehr Aufträge an und stellt örtliche Fachkräfte ein.", 0, "Die zusätzlichen Aufträge können Arbeitsplätze schaffen."],
      ["Ein Hochwasser unterbricht die Lieferung des einzigen Zulieferers.", 1, "Ohne Ersatzstandort kann die ganze Kette stillstehen."],
      ["Ein Betrieb nutzt die Erfahrung eines spezialisierten Stoffherstellers.", 0, "Spezialisierung kann die Qualität der Ware verbessern."],
      ["Eine lange Transportstrecke erhöht den Energiebedarf je Lieferung.", 1, "Zusätzlicher Energieverbrauch belastet die Umwelt."],
    ], "Dieselbe Entscheidung kann für verschiedene Gruppen unterschiedliche Folgen haben."),
    casework: { title: "Ein neuer Lieferant", story: "Eine Schulklasse bestellt T-Shirts. Der Händler bietet einen niedrigeren Preis an, weil er jetzt bei einer neuen Näherei im Ausland bestellt. Zu Löhnen und Arbeitszeiten legt er keine Angaben vor.", steps: [
      decide("Welche Form liegt vor?", "Internationale Arbeitsteilung", "Selbstversorgung", "Die Schule kauft ein Produkt aus einer Kette von Betrieben in mehreren Ländern."),
      decide("Welche Folge lässt sich aus dem Angebot ablesen?", "Der Preis für die Klasse sinkt.", "Die Löhne in der Näherei steigen.", "Der Preis ist bekannt. Über die Arbeitsbedingungen fehlt bisher die Auskunft."),
      decide("Was sollte die Klasse vor der Entscheidung erfragen?", "Nachvollziehbare Informationen zu Herstellung und Arbeitsbedingungen", "Nur die Zahl der verkauften T-Shirts", "Angaben entlang der Lieferkette helfen, die Folgen für die Beschäftigten zu beurteilen."),
    ], verdict: "Der günstigere Preis ist ein Vorteil für die Klasse. Für ein Gesamturteil braucht sie belastbare Informationen zu weiteren Folgen." },
    tasks: {
      1: write("Erkläre am T-Shirt drei Stationen internationaler Arbeitsteilung und nenne je eine Chance und ein Risiko.", ["Beginne beim Rohstoff.", "Wechsle zwischen der Sicht von Betrieben und der Umwelt."], "In Indien wächst Baumwolle. Eine Näherei in Bangladesch verarbeitet Stoff und näht daraus T-Shirts. Ein Laden in Deutschland verkauft sie. Die Näherei kann durch neue Aufträge Arbeitsplätze schaffen. Der zusätzliche Transport kann aber mehr Energie benötigen und mehr Treibhausgase verursachen.", ["Drei Stationen", "Eine begründete Chance", "Ein begründetes Risiko"]),
      2: write("Recherchiere eine aktuelle Änderung im Außenhandel und begründe eine Reaktion aus zwei Perspektiven.", ["Nutze eine datierte Quelle, etwa das Statistische Bundesamt.", "Was ändert sich für Betriebe und Beschäftigte oder Verbraucher?"], "Ein fiktives Muster: Ein Bericht meldet, dass sich ein wichtiger Transportweg verteuert hat. Ein Händler könnte einen Teil seiner Ware künftig näher einkaufen. Das stabilisiert Lieferzeiten, kann aber den Einkaufspreis erhöhen. Für Kundinnen sind zuverlässigere Lieferungen ein Vorteil. Deshalb würde ich zuerst mehrere Bezugsquellen vergleichen.", ["Datierte Quelle und Beobachtung", "Zwei Perspektiven", "Begründete Reaktion"]),
    },
  },
  {
    id: "wh-angebot-nachfrage",
    lb: 1,
    unit: "1",
    title: "Einflussfaktoren auf Angebot und Nachfrage",
    intro: "Warum wir bei Rabatten zugreifen und warum Anbieter bei hohen Preisen gern mehr verkaufen.",
    paragraphs: [
      "Wünsche allein bewegen den Markt nicht: Ein Bedürfnis wird zum **Bedarf**, wenn man dafür Geld hat, und zur **Nachfrage**, wenn man zu einem bestimmten Preis wirklich kaufen will. Die Nachfrage ist also die Menge eines Gutes, die Käufer bei diesem Preis kaufen wollen und bezahlen können. Am stärksten wirkt der **Preis** des Gutes selbst: Je teurer es ist, desto weniger wird nachgefragt, wenn alles andere gleich bleibt. Weitere Einflüsse sind das **Einkommen** (wer mehr Geld hat, kauft meist mehr), die **Preise anderer Güter** (wird Butter teurer, kaufen manche Margarine), Bedürfnisse und **Mode** sowie **Erwartungen**: Wer steigende Preise erwartet, kauft lieber heute.",
      "Das **Angebot** ist die Menge, die Anbieter bei einem bestimmten Preis verkaufen wollen. Auch hier zählt zuerst der **Preis**: Je mehr man pro Stück verdient, desto mehr lohnt sich das Verkaufen, und desto mehr Anbieter machen mit. Dazu kommen die **Kosten** (steigen Löhne, Energie oder Rohstoffe, lohnt sich die Herstellung weniger), die **Technik** (neue Maschinen machen die Herstellung schneller und billiger) und die **Zahl der Anbieter**: Mehr Anbieter bringen eine größere Menge auf den Markt.",
      "Daraus ergibt sich das typische Verhalten: Käufer wollen für ihr Geld möglichst viel und achten auf den Preis. Anbieter wollen möglichst viel verdienen, also hoch verkaufen, ohne Kunden zu verlieren. Im Alltag sieht man das überall. Im Sommerschlussverkauf sinken die Preise, und die Läden füllen sich. Tomaten vom Feld sind im Sommer billig, weil viele Anbieter viel liefern, im Winter dagegen teuer. Auf dem Gebrauchtmarkt verlangen Verkäufer erst viel, und Käufer handeln, bis beide zufrieden sind.",
      "Trägt man das in ein Schaubild ein, steht die Menge auf der waagrechten und der Preis auf der senkrechten Achse. Die **Nachfragekurve** fällt von links oben nach rechts unten, denn bei hohen Preisen wird wenig gekauft. Die **Angebotskurve** steigt, denn bei hohen Preisen wird viel angeboten. Ändert sich der Preis, wandert man auf der Kurve entlang. Ändert sich ein anderer Einfluss, etwa das Einkommen oder die Kosten, verschiebt sich die ganze Kurve. Das zeigt die Lektion über Verschiebungen.",
    ],
    terms: [
      { term: "Bedarf", text: "Ein Bedürfnis, für das man Geld hat. Wer dann auch wirklich kaufen will, fragt nach: Das ist die Nachfrage." },
      { term: "Nachfrage", text: "Die Menge eines Gutes, die Käufer bei einem bestimmten Preis kaufen wollen und bezahlen können." },
      { term: "Angebot", text: "Die Menge eines Gutes, die Anbieter bei einem bestimmten Preis verkaufen wollen." },
      { term: "Ersatzgut", text: "Ein Gut, das ein anderes ersetzen kann. Wird das eine teurer, steigt die Nachfrage nach dem anderen." },
      {
        term: "Ergänzungsgut",
        text: "Ein Gut, das man zusammen mit einem anderen braucht, etwa Drucker und Tinte. Wird das eine teurer, sinkt oft auch die Nachfrage nach dem anderen.",
      },
    ],
    takeaway:
      "Aus einem Bedürfnis wird mit Kaufkraft Bedarf und beim Kauf Nachfrage. Die Nachfrage hängt von Preis, Einkommen, Preisen anderer Güter, Bedürfnissen, Mode und Erwartungen ab, das Angebot von Preis, Kosten, Technik und Zahl der Anbieter. Steigt der Preis, sinkt die nachgefragte Menge und steigt die angebotene Menge.",
    sourceIds: ["lp"],
    quiz: {
      question: "Wie verändert sich die nachgefragte Menge eines Gutes, wenn sein Preis steigt und alle anderen Bedingungen gleich bleiben?",
      answer: "Sie sinkt, weil mehr Käufer zu dem höheren Preis verzichten oder auf andere Güter ausweichen.",
      wrong: [
        "Sie steigt, weil ein hoher Preis den Käufern zeigt, dass das Gut besonders wertvoll ist.",
        "Sie bleibt gleich, weil die Bedürfnisse der Käufer unverändert sind.",
      ],
      explanation:
        "Bei einem höheren Preis überlegen viele Käufer, ob sich der Kauf noch lohnt, und weichen aus. Gleiche Bedürfnisse bedeuten nicht gleiche Nachfrage, denn nachgefragt wird nur, was man auch bezahlen kann und will.",
    },
    workshop: {
      kind: "classify",
      title: "Nachfrage oder Angebot?",
      instruction: "Entscheide bei jedem Ereignis, ob zuerst die Käufer (Nachfrage) oder die Verkäufer (Angebot) ihr Verhalten ändern.",
      categories: ["Nachfrage", "Angebot"],
      entries: [
        {
          text: "Ein neuer Roboter lässt eine Bäckerei Brötchen schneller und billiger backen.",
          target: 1,
          feedback: "Neue Technik senkt die Kosten der Anbieter.",
        },
        {
          text: "Ein bekannter Streamer trägt eine bestimmte Mütze, und plötzlich wollen viele Jugendliche sie haben.",
          target: 0,
          feedback: "Mode und Trends ändern die Wünsche der Käufer.",
        },
        {
          text: "Mehl, Butter und Strom werden für alle Bäckereien deutlich teurer.",
          target: 1,
          feedback: "Höhere Kosten ändern das Verhalten der Anbieter.",
        },
        {
          text: "In vielen Familien steigt der Lohn, und sie leisten sich öfter einen Restaurantbesuch.",
          target: 0,
          feedback: "Mehr Einkommen ändert, was Käufer sich leisten können und wollen.",
        },
        {
          text: "In der Fußgängerzone eröffnen drei weitere Eisdielen.",
          target: 1,
          feedback: "Mehr Anbieter vergrößern das Angebot.",
        },
        {
          text: "Die Zeitung meldet, dass Benzin ab nächster Woche teurer wird, und viele Autofahrer tanken noch heute.",
          target: 0,
          feedback: "Die Erwartung künftiger Preise verändert die Nachfrage.",
        },
      ],
      conclusion:
        "Käufer und Verkäufer reagieren auf verschiedene Einflüsse: Einkommen, Mode und Erwartungen bewegen die Nachfrage, Kosten, Technik und Zahl der Anbieter das Angebot.",
    },
    casework: {
      title: "Skijacken im April",
      story:
        "Im April räumt ein Sportgeschäft sein Lager und verkauft Skijacken mit **40 Prozent Rabatt**. Im Oktober, kurz vor Beginn der Wintersaison, verlangt es wieder den vollen Preis. Karim weiß das und kauft schon im April eine Jacke, obwohl er sie erst im Winter braucht.",
      steps: [
        {
          question: "Warum senkt das Geschäft im April den Preis?",
          options: [
            "Im Frühjahr fragen nur wenige Skijacken nach; der Rabatt soll Käufer locken und das Lager leeren.",
            "Im April hat das Geschäft besonders viele Kunden und kann sich deshalb Rabatte leisten.",
            "Im April sind die Herstellungskosten der Jacken gesunken, daher kann das Geschäft billiger anbieten.",
          ],
          answer: 0,
          explanation:
            "Im Frühjahr ist das Bedürfnis nach Skijacken gering. Ein niedrigerer Preis lockt mehr Käufer an, denn die Nachfragekurve fällt.",
        },
        {
          question: "Welcher Einfluss erklärt neben dem Rabatt, warum Karim schon im April kauft?",
          options: [
            "Die Erwartung: Er rechnet damit, dass die Jacke im Winter wieder teurer ist.",
            "Das Einkommen: Im April hat er mehr Geld als im Winter.",
            "Die Mode: Skijacken sind im April gerade modern geworden.",
          ],
          answer: 0,
          explanation:
            "Der Rabatt senkt den Preis und lockt Käufer. Dass Karim schon jetzt kauft, liegt an seiner Erwartung: Er weiß, dass die Jacke bald wieder mehr kostet, und kauft vor. Nichts in der Geschichte deutet auf mehr Einkommen oder einen Modetrend hin.",
        },
        {
          question: "Was geschieht im Oktober, wenn viele Menschen ihren Winterurlaub planen?",
          options: [
            "Die Nachfrage nach Skijacken steigt, und das Geschäft kann wieder den vollen Preis verlangen.",
            "Die Nachfrage sinkt, weil der Preis wieder höher ist, und das Geschäft muss neu rabattieren.",
            "Die Nachfrage bleibt gleich, weil allein das Geschäft den Preis bestimmt.",
          ],
          answer: 0,
          explanation:
            "Vor der Saison wollen mehr Menschen Skijacken. Bei steigender Nachfrage können Anbieter höhere Preise durchsetzen. Der höhere Preis ist die Folge der Nachfrage, nicht ihre Ursache.",
        },
      ],
      verdict:
        "Der Preis folgt der Nachfrage: Im Frühjahr locken Rabatte, vor der Saison steigt die Nachfrage und mit ihr der Preis. Wer das weiß, kann klüger einkaufen.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre, warum die Nachfragekurve fällt und die Angebotskurve steigt. Gehe dabei auf das Verhalten von Käufern und von Verkäufern ein.",
        hints: ["Was tun Käufer, wenn etwas teurer wird?", "Was verspricht sich ein Anbieter von einem höheren Preis?"],
        model:
          "Wird ein Gut teurer, verzichten viele Käufer oder weichen auf andere Güter aus. Deshalb sinkt die nachgefragte Menge, und die Nachfragekurve fällt. Für Anbieter lohnt sich das Verkaufen bei einem höheren Preis mehr, denn sie verdienen pro Stück mehr und neue Anbieter kommen dazu. Deshalb steigt die angebotene Menge, und die Angebotskurve steigt. Käufer und Verkäufer verfolgen also gegensätzliche Interessen.",
        criteria: [
          "Erklärt das Verhalten der Käufer bei steigendem Preis",
          "Erklärt das Verhalten der Anbieter bei steigendem Preis",
          "Verbindet beides mit dem Verlauf der jeweiligen Kurve",
        ],
      },
      2: {
        prompt:
          "Du willst dein gebrauchtes Fahrrad verkaufen und überlegst, ob du bis zum Frühjahr oder bis zum Herbst wartest. Begründe mit den Einflüssen auf Angebot und Nachfrage, wann du wohl einen besseren Preis bekommst.",
        hints: ["Wann wollen mehr Menschen ein Fahrrad kaufen?", "Wann bieten viele andere ebenfalls ihre Räder an?"],
        model:
          "Im Frühjahr ist die Nachfrage nach Fahrrädern höher, weil das Wetter besser wird und viele Lust aufs Radfahren haben. Allerdings bieten dann auch mehr Menschen ihre alten Räder an, sodass die Konkurrenz größer ist. Im Herbst gibt es weniger Interessenten und dafür auch weniger Anbieter. Ich vermute, dass im Frühjahr die Nachfrage stärker wächst als das Angebot, und würde dann verkaufen. Den Preis setze ich etwas höher an, weil die Käufer ohnehin handeln werden.",
        criteria: [
          "Nennt mindestens einen Einfluss auf die Nachfrage und einen auf das Angebot",
          "Ordnet die Jahreszeit der Nachfrage- oder der Angebotsseite zu",
          "Begründet die eigene Entscheidung und das erwartete Verhalten der Käufer (jede begründete Entscheidung ist gleichwertig)",
        ],
      },
    },
  },

  {
    id: "wh-gleichgewicht",
    lb: 1,
    unit: "1",
    title: "Der Gleichgewichtspreis",
    intro: "Wie ein Markt aus vielen einzelnen Entscheidungen einen Preis findet.",
    paragraphs: [
      "Auf einem Markt treffen **Nachfrager** (Käufer) und **Anbieter** (Verkäufer) aufeinander. Im Schaubild steht die Menge auf der waagrechten, der Preis auf der senkrechten Achse. Je höher der Preis, desto weniger Menschen wollen kaufen: Die **Nachfragekurve** fällt. Je höher der Preis, desto mehr lohnt sich das Verkaufen: Die **Angebotskurve** steigt. Beide Kurven zeigen, welche Menge bei jedem Preis gewollt wird.",
      "Dort, wo sich beide Kurven schneiden, stimmen die gewünschte Kaufmenge und die gewünschte Verkaufsmenge überein. Das ist das **Marktgleichgewicht** mit **Gleichgewichtspreis** und **Gleichgewichtsmenge**. Bei diesem Preis ist der Markt geräumt: Jeder, der zu diesem Preis kaufen will, bekommt Ware, und kein Verkäufer bleibt auf seiner Ware sitzen.",
      "Liegt der Preis darüber, wird mehr angeboten, als Käufer kaufen wollen: Es entsteht ein **Angebotsüberhang**, und die Anbieter senken ihre Preise. Liegt der Preis darunter, entsteht ein **Nachfrageüberhang**: Käufer überbieten sich, und der Preis steigt. So zieht der Wettbewerb den Preis zum Gleichgewicht, ohne dass jemand ihn festlegen muss.",
    ],
    terms: [
      { term: "Gleichgewichtspreis", text: "Der Preis, bei dem angebotene und nachgefragte Menge gleich groß sind." },
      { term: "Angebotsüberhang", text: "Bei dem Preis wird mehr angeboten als nachgefragt. Der Preis sinkt." },
      { term: "Nachfrageüberhang", text: "Bei dem Preis wird mehr nachgefragt als angeboten. Der Preis steigt." },
    ],
    takeaway:
      "Beim Gleichgewichtspreis sind angebotene und nachgefragte Menge gleich groß; darüber entsteht ein Angebotsüberhang und der Preis sinkt, darunter ein Nachfrageüberhang und der Preis steigt.",
    sourceIds: ["lp", "bpb"],
    quiz: {
      question: "Was geschieht auf einem Markt, wenn der Preis über dem Gleichgewichtspreis liegt?",
      answer: "Es wird mehr angeboten als nachgefragt; der Preis gerät unter Druck nach unten.",
      wrong: [
        "Es wird mehr nachgefragt als angeboten; der Preis steigt weiter.",
        "Angebot und Nachfrage sind gleich groß; der Preis bleibt stehen.",
      ],
      explanation:
        "Über dem Gleichgewichtspreis wollen die Käufer weniger kaufen, als die Verkäufer loswerden wollen. Die Anbieter senken ihre Preise.",
    },
    lab: "markt",
    labGoals: ["ueberschuss", "knappheit", "gleichgewicht"],
    workshop: {
      kind: "classify",
      title: "Welche Marktlage liegt vor?",
      instruction: "Ordne jede Situation der passenden Marktlage zu.",
      categories: ["Angebotsüberhang", "Nachfrageüberhang", "Gleichgewicht"],
      entries: [
        {
          text: "Ein Bäcker verlangt 3 Euro für ein Brot. Bei diesem Preis möchte er 100 Brote verkaufen, aber nur 60 werden gekauft.",
          target: 0,
          feedback: "Die Käufer wollen weniger, als angeboten wird.",
        },
        {
          text: "Eine Konzertkarte kostet 40 Euro. 5.000 Fans wollen kaufen, aber es gibt nur 3.000 Karten.",
          target: 1,
          feedback: "Es wollen mehr kaufen, als Ware da ist.",
        },
        {
          text: "Am Ende des Markttages sind alle Erdbeeren verkauft, und kein Kunde ist leer ausgegangen.",
          target: 2,
          feedback: "Der Markt ist geräumt: Angebot und Nachfrage passen zusammen.",
        },
        {
          text: "Nach einem Frosteinbruch gibt es kaum Äpfel. Viele Käufer überbieten sich.",
          target: 1,
          feedback: "Das Angebot ist gesunken, die Nachfrage nicht: Käufer überbieten sich.",
        },
        {
          text: "Ein Händler sitzt im Mai noch auf 40 Winterjacken, die niemand mehr kaufen will.",
          target: 0,
          feedback: "Zu dem Preis wird mehr angeboten, als jemand kaufen möchte.",
        },
      ],
      conclusion: "Der Vergleich von angebotener und nachgefragter Menge bei einem Preis zeigt, in welche Richtung er sich bewegt.",
    },
    casework: {
      title: "Der Flohmarkt-Preis",
      story:
        "Mila verkauft auf dem Schulflohmarkt gebrauchte Comics. Sie hat genau **8 Hefte** und möchte alle verkaufen. Bei **5 Euro** wollen 20 Kinder kaufen, bei **8 Euro** noch 8 Kinder, bei **10 Euro** nur noch 1 Kind.",
      steps: [
        {
          question: "Was gilt bei einem Preis von 5 Euro?",
          options: [
            "Nachfrageüberhang: 20 Kinder wollen kaufen, aber es gibt nur 8 Hefte.",
            "Angebotsüberhang: Mila bleibt auf ihren Heften sitzen.",
            "Gleichgewicht: Alle Wünsche passen zusammen.",
          ],
          answer: 0,
          explanation: "20 Nachfragern stehen nur 8 Hefte gegenüber, also wird mehr nachgefragt als angeboten.",
        },
        {
          question: "Welcher Preis ist hier der Gleichgewichtspreis?",
          options: ["8 Euro", "5 Euro", "10 Euro"],
          answer: 0,
          explanation: "Bei 8 Euro wollen 8 Kinder kaufen, und Mila hat 8 Hefte: Angebot und Nachfrage sind gleich groß.",
        },
        {
          question: "Was passiert bei 10 Euro?",
          options: [
            "Angebotsüberhang von 7 Heften: Mila muss den Preis senken, wenn sie alle verkaufen will.",
            "Nachfrageüberhang: Mila kann den Preis noch erhöhen.",
            "Es ändert sich nichts, weil Mila den Preis bestimmt.",
          ],
          answer: 0,
          explanation: "Nur 1 Kind will kaufen, aber 8 Hefte sind da. Der Überhang von 7 Heften drückt den Preis.",
        },
      ],
      verdict:
        "Der Preis zeigt Mila, wo sie verkaufen kann: Zu niedrig lockt zu viele Käufer an, zu hoch bleibt sie sitzen. Bei 8 Euro passen beide Seiten zusammen.",
    },
    practice: "gleichgewicht",
    tasks: {
      1: {
        prompt:
          "Erkläre in eigenen Worten, wie sich der Preis entwickelt, wenn auf einem Markt ein Angebotsüberhang besteht, und warum der Markt dadurch zum Gleichgewicht findet.",
        hints: ["Wer will mehr, wer will weniger?", "Wie reagieren die Anbieter?"],
        model:
          "Bei einem Angebotsüberhang wollen die Anbieter mehr verkaufen, als die Käufer zu diesem Preis kaufen möchten. Wer auf seiner Ware sitzen bleibt, senkt den Preis. Bei einem niedrigeren Preis kaufen mehr Menschen und weniger Anbieter wollen verkaufen. Das geht so lange weiter, bis beide Mengen gleich groß sind: Der Markt ist im Gleichgewicht.",
        criteria: [
          "Den Überhang richtig beschreibt (mehr Angebot als Nachfrage)",
          "Die Reaktion der Anbieter (Preis senken) erklärt",
          "Das Ergebnis, ein neues Gleichgewicht, benennt",
        ],
      },
      2: {
        prompt:
          "Ein Politiker fordert, den Preis für Festivalkarten gesetzlich auf 20 Euro zu senken. Bei 60 Euro waren die Karten gerade ausverkauft. Beurteile mit dem Modell von Angebot und Nachfrage, was passieren würde.",
        hints: ["Was bedeutet 60 Euro im Modell?", "Was passiert mit der Nachfrage bei 20 Euro, wenn das Angebot gleich bleibt?"],
        model:
          "Bei 60 Euro war der Markt im Gleichgewicht. Bei 20 Euro würden viel mehr Menschen Karten wollen, aber es gibt nicht mehr Plätze: Es entsteht ein Nachfrageüberhang. Der Preis darf nicht steigen, deshalb müssen die Karten anders verteilt werden, etwa nach Schnelligkeit, und sie werden womöglich auf dem Schwarzmarkt teurer weiterverkauft. Der niedrige Preis hilft also nur denen, die Glück haben.",
        criteria: [
          "Den Preis von 60 Euro als Gleichgewicht einordnet",
          "Den Nachfrageüberhang bei 20 Euro erklärt",
          "Eine Folge des erzwungenen Preises begründet (Verteilungsproblem oder Schwarzmarkt)",
        ],
      },
    },
  },

  {
    id: "wh-verschiebung",
    lb: 1,
    unit: "1",
    title: "Verschiebungen und die Rolle des Gleichgewichtspreises",
    intro: "Mode, Wetter, Kosten: Wie sich der Preis neu einpendelt und wozu eine Wirtschaft ihn braucht.",
    paragraphs: [
      "Ändert sich der Preis, bewegt man sich entlang der Kurve. Ändert sich ein anderer Einfluss, **verschiebt sich** die ganze Kurve. Ein Beispiel: Ein Trend macht Bucket Hats begehrt. Bei jedem Preis wollen nun mehr Menschen kaufen, die Nachfragekurve rückt nach rechts. Das Angebot bleibt gleich, also herrscht beim alten Preis ein Nachfrageüberhang. Der Preis steigt, und zugleich wird mehr produziert. Es entsteht ein **neues Gleichgewicht** mit höherem Preis und größerer Menge. Sinkt die Nachfrage, etwa weil der Trend vorbei ist oder das Einkommen fällt, kehrt sich beides um.",
      "Auch das Angebot kann sich verschieben. Zerstört ein Hagelsturm einen Teil der Kirschernte oder steigen die Energiekosten, wird bei jedem Preis weniger angeboten: Die Angebotskurve rückt nach links. Der Gleichgewichtspreis steigt, die Menge sinkt. Machen neue Maschinen die Herstellung billiger oder kommen neue Anbieter dazu, rückt die Kurve nach rechts: Der Preis sinkt, die Menge steigt. So gehst du vor: Erst fragst du, welche Seite betroffen ist, dann, in welche Richtung sich die Kurve schiebt, und zuletzt, wo der neue Schnittpunkt liegt. Das Modell unten lässt dich beides ausprobieren.",
      "Warum ist der Gleichgewichtspreis für die ganze Wirtschaft wichtig? Er erfüllt vor allem drei Aufgaben. Er **informiert**: Ein hoher Preis zeigt, dass ein Gut knapp und begehrt ist, ein niedriger, dass reichlich davon da ist. Er **lenkt** die Produktion: Unternehmen stellen mehr her, wo der Preis weit über den Kosten liegt und Gewinn verspricht, und Arbeit und Rohstoffe fließen dorthin, wo sie gebraucht werden. Und er **gleicht aus**: Er bringt die Wünsche von Käufern und Verkäufern zusammen, sodass der Markt geräumt ist.",
      "Der Preis hat aber Grenzen. Er richtet sich nach der Kaufkraft: Wer sich den Preis nicht leisten kann, geht leer aus, auch bei wichtigen Gütern. Deshalb greift der Staat manchmal in Preise ein. Ein **Höchstpreis** soll Käufer schützen und wirkt nur, wenn er unter dem Gleichgewichtspreis liegt: Dann entsteht ein Nachfrageüberhang. Ein **Mindestpreis** soll Anbieter schützen und wirkt nur über dem Gleichgewichtspreis: Dann entsteht ein Angebotsüberhang. Ob solche Eingriffe sinnvoll sind, beurteilen Fachleute und Politik unterschiedlich. Umweltschäden zeigt der Preis ebenfalls nicht; dafür gibt es andere Mittel, etwa Abgaben.",
    ],
    terms: [
      {
        term: "Verschiebung der Kurve",
        text: "Ändert sich ein Einfluss außer dem Preis, gilt bei jedem Preis eine andere Menge: Die ganze Kurve rückt nach rechts oder links.",
      },
      {
        term: "Lenkungsfunktion",
        text: "Hohe Preise ziehen Produktion und Mittel dorthin, wo ein Gut gebraucht wird; niedrige Preise ziehen sie ab.",
      },
      {
        term: "Ausgleichsfunktion",
        text: "Der Preis bringt angebotene und nachgefragte Menge zusammen, bis der Markt geräumt ist.",
      },
      {
        term: "Höchstpreis",
        text: "Ein vom Staat festgelegter Preis, der nicht überschritten werden darf. Liegt er unter dem Gleichgewichtspreis, entsteht ein Nachfrageüberhang.",
      },
      {
        term: "Mindestpreis",
        text: "Ein vom Staat festgelegter Preis, der nicht unterschritten werden darf. Liegt er über dem Gleichgewichtspreis, entsteht ein Angebotsüberhang.",
      },
    ],
    takeaway:
      "Ändert sich ein Einfluss außer dem Preis, verschiebt sich eine Kurve, und es entsteht ein neues Gleichgewicht. Der Preis informiert über Knappheit, lenkt die Produktion und gleicht Angebot und Nachfrage aus; wirksame Höchst- und Mindestpreise setzen diesen Ausgleich außer Kraft und führen zu Überhängen.",
    sourceIds: ["lp", "bpb"],
    quiz: {
      question: "Was geschieht mit Gleichgewichtspreis und Gleichgewichtsmenge, wenn die Nachfrage steigt und das Angebot unverändert bleibt?",
      answer: "Beide steigen: Der Preis steigt, und zu dem höheren Preis wird auch mehr angeboten und verkauft.",
      wrong: [
        "Der Preis steigt, aber die Menge bleibt gleich, weil sich das Angebot nicht verändert hat.",
        "Der Preis bleibt gleich, und die Anbieter bieten einfach mehr an, weil mehr Käufer da sind.",
      ],
      explanation:
        "Die Nachfragekurve rückt nach rechts, und der Schnittpunkt wandert auf der Angebotskurve nach oben. Die Angebotskurve selbst verschiebt sich nicht, doch bei höherem Preis lohnt sich mehr Angebot, und die Menge wächst.",
    },
    lab: "markt",
    labGoals: ["nachfrage-steigt", "angebot-steigt"],
    workshop: {
      kind: "classify",
      title: "Welche Kurve verschiebt sich wohin?",
      instruction: "Ordne jedes Ereignis der Verschiebung zu, die es auslöst.",
      categories: ["Nachfrage steigt", "Nachfrage sinkt", "Angebot steigt", "Angebot sinkt"],
      entries: [
        {
          text: "Ein Kinofilm wird zum Hit, und plötzlich wollen alle das passende Fan-Shirt.",
          target: 0,
          feedback: "Ein Trend lässt bei jedem Preis mehr Menschen kaufen.",
        },
        {
          text: "Nach einer Wirtschaftskrise haben viele Haushalte weniger Einkommen und gehen seltener ins Restaurant.",
          target: 1,
          feedback: "Weniger Einkommen senkt die Nachfrage bei jedem Preis.",
        },
        {
          text: "Ein neues Werk stellt Fahrradreifen mit modernen Maschinen schneller und billiger her.",
          target: 2,
          feedback: "Neue Technik und niedrigere Kosten erhöhen das Angebot.",
        },
        {
          text: "Ein Hagelsturm zerstört einen großen Teil der Kirschernte.",
          target: 3,
          feedback: "Das Wetter verringert die Ernte: Bei jedem Preis ist weniger da.",
        },
        {
          text: "Drei neue Hersteller steigen in den Markt für E-Scooter ein.",
          target: 2,
          feedback: "Mehr Anbieter vergrößern die angebotene Menge.",
        },
        {
          text: "Ein Trend ist vorbei: Kaum noch jemand will Fidget-Spinner kaufen.",
          target: 1,
          feedback: "Wenn die Mode wechselt, sinkt die Nachfrage bei jedem Preis.",
        },
      ],
      conclusion: "Erst die Seite bestimmen, dann die Richtung: So findet man das neue Gleichgewicht, ohne zu rechnen.",
    },
    casework: {
      title: "Hitzewelle in Neustadt",
      story:
        "In Neustadt verkaufen mehrere Eisdielen eine Kugel Eis für **1,50 Euro**. Dann beginnt eine wochenlange **Hitzewelle**. Die Eisdielen, ihre Maschinen und ihre Kosten bleiben unverändert.",
      steps: [
        {
          question: "Welche Kurve verschiebt sich durch die Hitze, und in welche Richtung?",
          options: [
            "Die Nachfragekurve rückt nach rechts: Bei jedem Preis wollen mehr Menschen Eis.",
            "Die Angebotskurve rückt nach rechts: Bei jedem Preis wird mehr Eis angeboten.",
            "Keine Kurve verschiebt sich, nur der Preis auf der Kurve ändert sich.",
          ],
          answer: 0,
          explanation: "Das Wetter verändert die Wünsche der Käufer, nicht die Kosten der Anbieter. Also verschiebt sich die Nachfrage.",
        },
        {
          question: "Was geschieht mit dem Gleichgewichtspreis und der Gleichgewichtsmenge?",
          options: [
            "Beide steigen: Die Käufer überbieten sich, und zu höheren Preisen wird mehr verkauft.",
            "Der Preis steigt, die Menge bleibt gleich, weil das Angebot unverändert ist.",
            "Der Preis sinkt, weil mehr Menschen Eis kaufen.",
          ],
          answer: 0,
          explanation:
            "Beim alten Preis entsteht ein Nachfrageüberhang. Der Preis steigt, und weil sich Verkaufen nun mehr lohnt, wird auch mehr Eis angeboten.",
        },
        {
          question: "Der hohe Eispreis lockt einen Studenten, der einen Eiswagen eröffnet. Was zeigt das?",
          options: [
            "Die Lenkungsfunktion: Hohe Preise und Gewinne ziehen neue Anbieter in den Markt.",
            "Die Informationsfunktion fällt aus, weil der Preis nichts mehr über Knappheit sagt.",
            "Der Staat lenkt die Produktion, indem er Eiswagen erlaubt.",
          ],
          answer: 0,
          explanation:
            "Der Preis lenkt Unternehmer dorthin, wo ein Gut gebraucht wird. Das zusätzliche Angebot lässt den Preis später wieder etwas sinken.",
        },
        {
          question: "Die Stadt will, dass sich alle Eis leisten können, und setzt einen Höchstpreis von 1 Euro fest. Was folgt?",
          options: [
            "Es entsteht ein Nachfrageüberhang: Mehr Menschen wollen Eis, als angeboten wird.",
            "Es entsteht ein Angebotsüberhang: Die Eisdielen bleiben auf ihrem Eis sitzen.",
            "Der Markt bleibt im Gleichgewicht, weil der Preis jetzt niedriger ist.",
          ],
          answer: 0,
          explanation:
            "Der Höchstpreis liegt unter dem neuen Gleichgewichtspreis. Dann wollen mehr kaufen, als verkauft wird, und die Ware muss anders verteilt werden, zum Beispiel nach Schnelligkeit.",
        },
      ],
      verdict:
        "Die Hitze verschiebt die Nachfragekurve nach rechts: Preis und Menge steigen, und der hohe Preis lockt neue Anbieter. Ein Höchstpreis unter dem Gleichgewicht löst das Knappheitsproblem nicht, sondern macht daraus ein Verteilungsproblem.",
    },
    practice: "ueberhang",
    tasks: {
      1: {
        prompt:
          "Erkläre, was mit Gleichgewichtspreis und Gleichgewichtsmenge geschieht, wenn in einer Branche die Herstellungskosten steigen, weil Rohstoffe teurer werden.",
        hints: ["Welche Kurve verschiebt sich, und in welche Richtung?", "Was gilt beim alten Preis: Überhang oder Mangel?"],
        model:
          "Steigen die Kosten, lohnt sich das Herstellen weniger. Bei jedem Preis bieten die Unternehmen nun weniger an, die Angebotskurve rückt nach links. Beim alten Preis wollen mehr Käufer kaufen, als es Ware gibt: Es entsteht ein Nachfrageüberhang. Der Preis steigt, und weil dadurch weniger Menschen kaufen, sinkt die Menge. Im neuen Gleichgewicht ist der Preis höher und die Menge kleiner.",
        criteria: [
          "Ordnet die höheren Kosten der Angebotsseite zu und nennt die Richtung der Verschiebung",
          "Beschreibt den Überhang beim alten Preis",
          "Nennt die neue Lage: höherer Preis und geringere Menge",
        ],
      },
      2: {
        prompt:
          "Eine Region legt für Milch einen Mindestpreis fest, der über dem bisherigen Gleichgewichtspreis liegt, um die Landwirte zu schützen. Beurteile, was am Markt geschieht und wer Vor- und Nachteile hat.",
        hints: [
          "Was bedeutet ein Preis über dem Gleichgewicht für Angebot und Nachfrage?",
          "Wer profitiert, wer zahlt drauf, und was geschieht mit überschüssiger Milch?",
        ],
        model:
          "Beim Mindestpreis über dem Gleichgewicht wollen die Landwirte mehr Milch verkaufen, als die Käufer zu diesem Preis kaufen: Es entsteht ein Angebotsüberhang. Die Milch bleibt übrig, wenn der Staat sie nicht aufkauft oder die Menge begrenzt. Landwirte, die verkaufen können, verdienen mehr, doch die Käufer zahlen höhere Preise und kaufen weniger. Greift der Staat ein, kostet der Überschuss außerdem Steuergeld. Der Mindestpreis hilft also einer Gruppe auf Kosten anderer; ob das gerechtfertigt ist, bleibt eine politische Abwägung.",
        criteria: [
          "Erkennt den Angebotsüberhang beim Mindestpreis über dem Gleichgewicht",
          "Nennt Gewinner und Verlierer des Eingriffs",
          "Gibt ein begründetes Urteil oder eine ausgewogene Abwägung ab (jedes begründete Urteil ist gleichwertig)",
        ],
      },
    },
  },

  {
    id: "wh-kreislauf",
    lb: 1,
    unit: "1",
    title: "Der einfache Wirtschaftskreislauf",
    intro: "Wie Haushalte und Unternehmen voneinander leben, und was das Modell zeigt und verschweigt.",
    paragraphs: [
      "Eine Bäckerei braucht Beschäftigte und Kunden, und die Beschäftigten brauchen Brot und Einkommen. Solche Abhängigkeiten zeigt der **Wirtschaftskreislauf**, ein **Modell**: ein bewusst vereinfachtes Bild der Wirklichkeit. Im einfachen Kreislauf gibt es nur zwei Gruppen. Die **privaten Haushalte** (alle Menschen, die konsumieren) stellen ihre Arbeitskraft zur Verfügung und kaufen Güter. Die **Unternehmen** setzen die Arbeit ein, stellen Güter und Dienstleistungen her und verkaufen sie an die Haushalte. Beide sind aufeinander angewiesen.",
      "Zwischen beiden fließen vier Ströme. Die Haushalte liefern ihre **Arbeitsleistung** an die Unternehmen und erhalten dafür **Einkommen**, vor allem Löhne und Gehälter. Die Unternehmen liefern **Güter und Dienstleistungen** an die Haushalte und erhalten dafür **Konsumausgaben**. Arbeit sowie Güter und Dienstleistungen bilden den **Güterstrom**, Einkommen und Konsumausgaben den **Geldstrom**. Der Geldstrom fließt immer in die Gegenrichtung der Leistung, für die er bezahlt wird.",
      "Das Modell erlaubt Rückschlüsse. Gibt jeder Haushalt sein ganzes Einkommen aus, ist der Kreislauf geschlossen: Die Ausgaben der Haushalte sind genau der Umsatz der Unternehmen, und diesen Umsatz zahlen die Unternehmen wieder als Einkommen aus, im Modell vereinfacht als Löhne, Gehälter und ausgezahlte Gewinne. Alles, was hergestellt wird, wird auch gekauft. Kaufen die Haushalte aber weniger, sinkt der Umsatz. Die Unternehmen zahlen weniger Löhne, die Haushalte haben weniger Geld, und die Ausgaben sinken weiter. Im Modell unten kannst du einstellen, wie viel die Haushalte ausgeben, und das Schrumpfen beobachten.",
      "Taugt das Modell als Abbild der Wirklichkeit? Nur begrenzt, denn es lässt vieles weg. Es kennt kein **Sparen** und keine **Banken**: In Wirklichkeit legen Haushalte Geld zurück, und Banken verleihen es an Unternehmen, die damit investieren. Es kennt keinen **Staat**, der Steuern erhebt, Schulen baut und Sozialleistungen zahlt. Und es kennt kein **Ausland**, mit dem Deutschland Waren handelt. Wer nur dieses Modell nutzt, kann deshalb keine verlässlichen Voraussagen über die Wirtschaft treffen. Ein Modell ist nur so gut wie die Annahmen, auf denen es beruht.",
    ],
    terms: [
      {
        term: "Güterstrom",
        text: "Der Fluss von Arbeitsleistung, Gütern und Dienstleistungen zwischen Haushalten und Unternehmen.",
      },
      {
        term: "Geldstrom",
        text: "Der Fluss von Geld in die Gegenrichtung: Einkommen an die Haushalte, Konsumausgaben an die Unternehmen.",
      },
      {
        term: "Konsumausgaben",
        text: "Das Geld, das die privaten Haushalte für Güter und Dienstleistungen ausgeben.",
      },
      {
        term: "Wirtschaftsmodell",
        text: "Ein bewusst vereinfachtes Bild der Wirklichkeit, das nur die wichtigsten Zusammenhänge zeigt.",
      },
    ],
    takeaway:
      "Im einfachen Wirtschaftskreislauf tauschen Haushalte und Unternehmen Arbeitsleistung gegen Einkommen und Güter gegen Konsumausgaben. Das Modell zeigt, wie alles zusammenhängt, lässt aber Sparen, Banken, Staat und Ausland weg.",
    sourceIds: ["lp"],
    quiz: {
      question: "Welcher Geldstrom fließt im einfachen Wirtschaftskreislauf von den Unternehmen zu den privaten Haushalten?",
      answer: "Das Einkommen, also Löhne und Gehälter für die Arbeitsleistung der Haushalte.",
      wrong: [
        "Die Konsumausgaben, mit denen die Haushalte ihre Einkäufe bei den Unternehmen bezahlen.",
        "Die Güter und Dienstleistungen, die die Unternehmen für die Haushalte herstellen.",
      ],
      explanation:
        "Die Unternehmen bezahlen die Arbeitsleistung mit Einkommen. Konsumausgaben fließen in die Gegenrichtung, von den Haushalten zu den Unternehmen. Güter und Dienstleistungen fließen zwar auch zu den Haushalten, bilden aber den Güterstrom und sind kein Geld.",
    },
    lab: "kreislauf",
    workshop: {
      kind: "classify",
      title: "Welcher Strom fließt hier?",
      instruction: "Ordne jeden Vorgang einem der vier Ströme des einfachen Wirtschaftskreislaufs zu.",
      categories: ["Arbeitsleistung", "Einkommen", "Konsumausgaben", "Güter und Dienstleistungen"],
      entries: [
        {
          text: "Mara arbeitet samstags im Supermarkt und füllt Regale auf.",
          target: 0,
          feedback: "Die Haushalte stellen den Unternehmen ihre Arbeitskraft zur Verfügung.",
        },
        {
          text: "Am Monatsende überweist der Supermarkt Mara 450 Euro.",
          target: 1,
          feedback: "Das Unternehmen bezahlt die Arbeitsleistung mit Einkommen.",
        },
        {
          text: "Familie Brandt bezahlt an der Kasse ihren Wocheneinkauf.",
          target: 2,
          feedback: "Die Haushalte geben ihr Einkommen für Güter aus: Konsumausgaben.",
        },
        {
          text: "Der Friseursalon schneidet Lukas die Haare.",
          target: 3,
          feedback: "Das Unternehmen liefert eine Dienstleistung an den Haushalt.",
        },
        {
          text: "Ein Handwerksbetrieb zahlt seinem Gesellen den Lohn aus.",
          target: 1,
          feedback: "Der Lohn ist das Einkommen, das von den Unternehmen zu den Haushalten fließt.",
        },
        {
          text: "Ein Lagerarbeiter packt für seinen Arbeitgeber Pakete.",
          target: 0,
          feedback: "Er liefert dem Unternehmen seine Arbeitsleistung.",
        },
      ],
      conclusion: "Jede Leistung hat einen Gegenstrom aus Geld: Arbeit gegen Einkommen, Güter gegen Konsumausgaben.",
    },
    casework: {
      title: "Das Sparschwein-Dorf",
      story:
        "In Haldenau leben alle Haushalte vom Lohn des örtlichen Betriebs, und alles Geld wird in den Läden des Ortes ausgegeben. Aus Sorge um die Zukunft beschließen die Haushalte, nur noch **80 Prozent** ihres Einkommens auszugeben und den Rest ins Sparschwein zu stecken.",
      steps: [
        {
          question: "Was geschieht zuerst mit dem Umsatz der Unternehmen?",
          options: [
            "Er sinkt, weil die Konsumausgaben der Haushalte kleiner werden.",
            "Er steigt, weil die Haushalte besser planen.",
            "Er bleibt gleich, weil die Läden ihre Preise erhöhen.",
          ],
          answer: 0,
          explanation: "Die Konsumausgaben der Haushalte sind der Umsatz der Unternehmen. Geben die Haushalte weniger aus, nehmen die Unternehmen weniger ein.",
        },
        {
          question: "Wie wirkt sich das in der nächsten Runde auf die Einkommen aus?",
          options: [
            "Sie sinken, weil die Unternehmen aus geringeren Einnahmen auch weniger Löhne zahlen können.",
            "Sie steigen, weil die Unternehmen weniger Ware herstellen und Kosten sparen.",
            "Sie bleiben gleich, weil das Sparen die Unternehmen nicht betrifft.",
          ],
          answer: 0,
          explanation:
            "Aus kleineren Einnahmen können die Unternehmen nur kleinere Einkommen auszahlen. Dann haben die Haushalte noch weniger zum Ausgeben, und der Kreislauf schrumpft.",
        },
        {
          question: "Warum würde das Ergebnis in der Wirklichkeit meist schwächer ausfallen als im Modell?",
          options: [
            "Banken leihen Erspartes weiter, und Staatsausgaben und Exporte bringen zusätzliches Geld in den Kreislauf.",
            "In Wirklichkeit sparen Haushalte nie, weil sie immer ihr ganzes Einkommen ausgeben.",
            "In Wirklichkeit sind Unternehmen unabhängig von ihren Kunden und produzieren auch ohne Nachfrage.",
          ],
          answer: 0,
          explanation:
            "Das einfache Modell lässt Banken, Staat und Ausland weg. In Wirklichkeit fließt gespartes Geld über Kredite wieder in den Kreislauf, und Staatsausgaben und Exporte bringen zusätzliches Geld hinein. Steuern und Importe entziehen dem Kreislauf allerdings Geld, deshalb bleibt es bei einer groben Richtung.",
        },
      ],
      verdict:
        "Im einfachen Modell fehlt gespartes Geld im Kreislauf, und die Einkommen schrumpfen von Runde zu Runde. In Wirklichkeit gleichen Kredite der Banken, Staatsausgaben und Exporte einen Teil aus, während Steuern und Importe Geld entziehen: Das Modell zeigt die Richtung, nicht die genaue Größe.",
    },
    tasks: {
      1: {
        prompt: "Beschreibe den einfachen Wirtschaftskreislauf: Nenne die beiden Akteure und erkläre die vier Ströme, die zwischen ihnen fließen.",
        hints: [
          "Was geben die Haushalte den Unternehmen, und was bekommen sie dafür?",
          "Welche Ströme bestehen aus Geld, welche aus Arbeit, Gütern oder Dienstleistungen?",
        ],
        model:
          "Im einfachen Wirtschaftskreislauf gibt es private Haushalte und Unternehmen. Die Haushalte liefern ihre Arbeitsleistung an die Unternehmen und bekommen dafür Einkommen. Die Unternehmen liefern Güter und Dienstleistungen an die Haushalte und erhalten dafür Konsumausgaben. Arbeit, Güter und Dienstleistungen bilden den Güterstrom, Einkommen und Konsumausgaben den Geldstrom in der Gegenrichtung.",
        criteria: [
          "Nennt die beiden Akteure Haushalte und Unternehmen",
          "Beschreibt alle vier Ströme richtig",
          "Unterscheidet Güterstrom und Geldstrom und nennt deren Richtung",
        ],
      },
      2: {
        prompt:
          "Ein Mitschüler sagt: „Der Kreislauf beweist, dass Sparen der Wirtschaft schadet, weil dann Geld fehlt.“ Beurteile diese Aussage und begründe, was am Modell zu kurz greift.",
        hints: ["Was geschieht im Modell mit gespartem Geld?", "Was geschieht in der Wirklichkeit mit Geld auf einem Sparkonto?"],
        model:
          "Im einfachen Modell stimmt die Aussage: Gespartes Geld verlässt den Kreislauf, die Umsätze sinken und mit ihnen die Einkommen. Das Modell hat aber keine Banken. In Wirklichkeit verleihen Banken das Ersparte an Unternehmen, die damit Maschinen kaufen oder Betriebe erweitern, sodass das Geld weiter arbeitet. Sparen kann sogar nützlich sein, weil es Investitionen finanziert. Die Aussage ist also zu pauschal, denn das Modell blendet Banken, Staat und Ausland aus.",
        criteria: [
          "Erklärt, was im Modell mit gespartem Geld geschieht",
          "Nennt mindestens eine weggelassene Größe (Banken, Staat oder Ausland)",
          "Begründet, warum die Aussage in der Wirklichkeit zu pauschal ist",
        ],
      },
    },
  },

  {
    id: "wh-vollkommener-markt", lb: 1, unit: "1", title: "Das Modell des vollkommenen Marktes",
    intro: "Ein Marktmodell blendet Unterschiede aus. Prüfe an einem Wochenmarkt, wann das hilft und wo es täuscht.",
    paragraphs: [
      "Im **vollkommenen Markt** sind die angebotenen Güter gleichartig, alle kennen Preise und Angebote (**Markttransparenz**), und niemand bevorzugt Anbietende wegen der Person, des Orts oder der Zeit. Die Modellteilnehmer können unmittelbar auf Preisänderungen reagieren. Käufer wechseln bei gleichem Gut ohne Nachteile zum günstigeren Angebot.",
      "Beispiel: Zwei Stände verkaufen zur selben Zeit identische Äpfel. Die Klasse sieht beide Preise direkt und beide Stände sind gleich gut erreichbar. Ist ein Stand günstiger und kann alle bedienen, kaufen die Schülerinnen und Schüler dort. Der andere Stand gerät unter Druck, seinen Preis zu senken. Das Modell erklärt, warum sich Preise unter solchen Bedingungen annähern.",
      "Auf einem echten Wochenmarkt unterscheiden sich etwa Herkunft, Qualität und Entfernung. Ein teurerer Stand kann trotzdem verkaufen, wenn er näher liegt oder eine beliebte Sorte hat. Wenn du ein Marktmodell verwendest, benenne zuerst seine Annahmen und dann den Unterschied zur Wirklichkeit. So kannst du erklären, wann eine Vorhersage trägt.",
    ],
    terms: [term("Homogenes Gut", "Ein Gut, dessen Einheiten aus Sicht der Käufer gleichartig sind."), term("Markttransparenz", "Käufer und Verkäufer können relevante Preise und Bedingungen überblicken.")],
    takeaway: "Das Marktmodell erklärt Preiswirkungen unter klaren Annahmen. Prüfe bei einem echten Markt, welche Annahme aus welchem Grund nicht erfüllt ist.",
    sourceIds: ["lp"],
    quiz: check("Woran erkennst du Markttransparenz?", "Alle können die vergleichbaren Angebote einsehen.", ["Viele Läden liegen im selben Stadtteil.", "Alle Händler verkaufen die gleiche Apfelsorte."], "Transparenz beschreibt den Zugang zu Informationen über die Angebote."),
    workshop: sort("Ein Modell prüfen", "Welche Beobachtung passt zu den Annahmen?", ["Passt", "Widerspricht"], [
      ["An beiden Ständen stehen exakt dieselbe Sorte und Qualität zum Verkauf.", 0, "Die Äpfel sind für diesen Vergleich gleichartig."],
      ["Die Preise erfährst du erst nach dem Bezahlen an der Kasse.", 1, "Du kannst die Angebote vorher nicht vergleichen."],
      ["Alle Käufer sehen alle Preise und können ohne Aufwand wechseln.", 0, "Preise sind sichtbar und ein Wechsel ist einfach."],
      ["Kunden bleiben wegen des Vertrauens zu einer Verkäuferin bei ihr.", 1, "Eine persönliche Vorliebe beeinflusst die Wahl."],
    ], "Ob das Modell passt, hängt von den Annahmen im konkreten Fall ab."),
    casework: { title: "Zwei Apfelstände", story: "Mira sieht am Samstag zwei Apfelstände mit derselben Sorte. Stand A ist günstiger. Stand B ist am Bahnhof, hat bis abends offen und verkauft auch einzeln statt nur im Kilobeutel.", steps: [
      decide("Welche Modellannahme erfüllt ein sichtbares Preisschild?", "Preise sind transparent.", "Der Ort ist unwichtig.", "Das Schild macht das Angebot sichtbar. Über den Standort sagt es nichts."),
      decide("Warum kann Mira trotzdem bei B kaufen?", "Ort, Öffnungszeit oder Packungsgröße sind ihr wichtig.", "Die Markttransparenz erzwingt den teureren Einkauf.", "Verschiedene Angebote und Vorlieben können einen Preisunterschied erklären."),
      decide("Welche Modellprognose ist hier eingeschränkt?", "Alle Käufer wechseln zum niedrigeren Preis.", "Der Preis kann mit anderen Ständen verglichen werden.", "Ein Vergleich ist möglich. Ob Mira wechselt, hängt aber auch von anderen Bedingungen ab."),
    ], verdict: "Der Preis ist ein Signal. Miras Entscheidung lässt sich erst erklären, wenn man auch Ort, Uhrzeit und Verkaufsmenge betrachtet." },
    tasks: {
      1: write("Beschreibe zwei Annahmen des vollkommenen Marktes und prüfe sie am Beispiel der Apfelstände.", ["Sind die Angebote vollständig gleich?", "Wer kennt die Preise?"], "Vollkommene Markttransparenz bedeutet, dass die Beteiligten die Angebote kennen. Sichtbare Preise helfen dabei. Homogenität bedeutet, dass die Güter austauschbar sind. Hier ist die Sorte gleich, aber die Mindestmenge unterscheidet sich. Für Mira sind die Angebote deshalb nicht ganz gleichwertig.", ["Zwei Annahmen", "Bezug zu den Ständen", "Folge für den Vergleich"]),
      2: write("Erkläre, warum Konzertkarten trotz sichtbarer Preise unterschiedlich teuer sein können, und beurteile das Marktmodell.", ["Vergleiche Sitzplätze und Termine.", "Unter welchen Bedingungen wären Preise eher vergleichbar?"], "Der Preis allein sagt wenig, wenn eine Karte einen Platz mit freier Sicht und die andere einen Platz weit hinten bietet. Termine verändern die Nachfrage zusätzlich. Das Modell zeigt den Preisdruck bei gleichen Karten für dieselbe Veranstaltung. Zwischen verschiedenen Plätzen und Terminen ist seine Vorhersage eingeschränkt.", ["Konkreter Unterschied", "Modellannahme", "Begründetes Urteil"]),
    },
  },
  {
    id: "wh-marktformen", lb: 1, unit: "1", title: "Monopol, Oligopol und Polypol",
    intro: "Wie viele Verkäufer stehen zur Wahl? Die Marktform hilft dir, Preisspielraum und Wettbewerb einzuschätzen.",
    paragraphs: [
      "Wir betrachten hier die **Angebotsseite** eines abgegrenzten Markts mit vielen Nachfragern. Beim **Monopol** bietet nur ein Unternehmen an, beim **Oligopol** sind es wenige und beim **Polypol** viele. Abgegrenzt wird nach Produkt und Gebiet. Ein einziges Freibad im Ort kann für Ortsansässige anders dastehen als ein Freibad in einer Region mit vielen Bädern.",
      "Bei vielen Anbietern können Käufer leichter wechseln. Wettbewerb kann Preise unter Druck setzen und bessere Qualität oder neue Angebote fördern. Wenige Anbieter beobachten einander genau. Senkt einer den Preis, könnten andere folgen. Beim Monopol fehlen direkte Alternativen. Die Nachfrage, mögliche Ersatzprodukte und manchmal staatliche Regeln begrenzen trotzdem den Preisspielraum.",
      "Beispiel: An einem abgelegenen Badesee gibt es nur einen Kiosk. In der Innenstadt bieten viele Kioske ähnliche Snacks an. Für eine faire Entscheidung vergleichst du neben dem Preis auch Anfahrt, Menge und Qualität. Wer eigene Snacks mitbringen kann, hat sogar am See eine Ausweichmöglichkeit.",
    ],
    terms: [term("Angebotsmonopol", "Ein Anbieter steht auf dem betrachteten Markt vielen Käufern gegenüber."), term("Angebotsoligopol", "Wenige Anbieter stehen vielen Käufern gegenüber."), term("Angebotspolypol", "Viele Anbieter stehen vielen Käufern gegenüber.")],
    visual: { title: "Anbieter auf einem Markt mit vielen Käufern", layout: "comparison", steps: ["● · ein Anbieter · Monopol", "● ● ● · wenige Anbieter · Oligopol", "● ● ● ● ● ● · viele Anbieter · Polypol"] },
    takeaway: "Die Zahl der Anbieter beeinflusst die Wechselmöglichkeiten der Käufer. Für eine Einordnung muss klar sein, welchen Markt du betrachtest.",
    sourceIds: ["lp"],
    quiz: check("Welche Marktform liegt bei drei Anbietern und vielen Nachfragern vor?", "Ein Angebotsoligopol", ["Ein Angebotspolypol", "Ein Angebotsmonopol"], "Wenige Anbieter und viele Käufer kennzeichnen das Angebotsoligopol."),
    workshop: sort("Märkte abgrenzen und zuordnen", "Ordne nach der Zahl der Anbieter im beschriebenen Gebiet.", ["Monopol", "Oligopol", "Polypol"], [
      ["Ein Betrieb verkauft als einziger Getränke im Stadion.", 0, "Innerhalb des Stadions gibt es nur einen Anbieter."],
      ["Drei Firmen bieten in der Gemeinde Glasfaseranschlüsse an.", 1, "Wenige Firmen teilen sich den abgegrenzten Markt."],
      ["Auf dem Flohmarkt bieten viele Stände gebrauchte Bücher an.", 2, "Viele Stände stehen im Wettbewerb um Käufer."],
      ["Am anderen Ufer der Insel gibt es nur einen Fahrradverleih.", 0, "Für dieses Ufer nennt die Aufgabe einen einzigen Verleih."],
    ], "Eine andere räumliche Abgrenzung kann zu einer anderen Marktform führen."),
    casework: { title: "Eis am See", story: "Am See kaufen viele Familien Eis an einem einzigen Stand. In der Stadt gibt es zwölf Stände. Nächsten Sommer sollen am See zwei weitere Stände eröffnen.", steps: [
      decide("Welche Form hat der Markt am See heute?", "Angebotsmonopol", "Angebotspolypol", "Am See steht ein Anbieter vielen Käuferinnen und Käufern gegenüber."),
      decide("Welche Wirkung kann der Eintritt weiterer Stände haben?", "Die Kundschaft kann leichter Preise vergleichen oder wechseln.", "Die Stände müssen in jedem Fall den gleichen Preis verlangen.", "Mehr Wechselmöglichkeiten erhöhen den Druck. Die Preise können sich weiter unterscheiden."),
      decide("Was vergleichst du bei unterschiedlichen Eissorten und Portionsgrößen?", "Preis, Menge und Qualität", "Nur die Zahl der Eisschilder", "Vergleichbare Mengen und Qualität helfen, den Preis einzuordnen."),
    ], verdict: "Drei Stände schaffen Auswahl. Ob sie günstiger werden, hängt auch von Kosten, Nachfrage und Unterschieden zwischen den Angeboten ab." },
    tasks: {
      1: write("Ordne den Eismarkt am See vor und nach der Eröffnung ein und erkläre eine mögliche Preiswirkung.", ["Zähle die Anbieter.", "Welche Ausweichmöglichkeiten haben Käufer?"], "Vor der Eröffnung gibt es einen Verkäufer und viele Käufer, also ein Monopol. Danach verkaufen drei Betriebe Eis. Das ist ein Oligopol. Ein Stand kann Marktanteile gewinnen, indem er weniger verlangt oder größere Portionen anbietet. Dadurch geraten die anderen unter Wettbewerbsdruck.", ["Marktgrenze", "Beide Marktformen", "Mögliche Wettbewerbswirkung"]),
      2: write("Ein Dorf hat nur einen Kiosk, aber zwei Supermärkte liegen im Nachbarort. Beurteile die Aussage, im Dorf herrsche ein Monopol für Getränke.", ["Lege ein Gebiet und ein Produkt fest.", "Wann sind die Supermärkte echte Alternativen?"], "Innerhalb des Dorfes ist der Kiosk der einzige Getränkeanbieter. Für Menschen ohne Auto können die Supermärkte weit weg und damit kaum eine Alternative sein. Wer ohnehin ins Nachbardorf fährt, kann dort einkaufen. Die Aussage kann also für einen engen Markt stimmen. Für den größeren Markt muss man die Alternativen mitzählen.", ["Abgegrenzter Markt", "Unterschiedliche Käuferlagen", "Bedingtes Urteil"]),
    },
  },
];
