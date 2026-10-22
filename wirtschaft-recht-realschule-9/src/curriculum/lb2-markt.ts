import type { Lesson } from "../model/types";

export const LB2: Lesson[] = [
  {
    id: "wh-prinzip",
    lb: 2,
    unit: "2.1",
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
    id: "wh-angebot-nachfrage",
    lb: 2,
    unit: "2.1",
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
    lb: 2,
    unit: "2.1",
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
    lb: 2,
    unit: "2.1",
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
    lb: 2,
    unit: "2.1",
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
    id: "sm-ordnungen",
    lb: 2,
    unit: "2.2",
    title: "Wirtschaftsordnungen im Vergleich",
    intro: "Wer entscheidet, was hergestellt wird: der Staat, der Markt oder beide? Drei Ordnungen im Vergleich.",
    paragraphs: [
      "Jede Gesellschaft muss klären: Was wird hergestellt, wie und für wen? Die **Wirtschaftsordnung** legt die Regeln dafür fest: Wem gehören die Betriebe? Wer plant? Wer bestimmt die Preise? Zwei Extreme stehen sich gegenüber: die **Zentralverwaltungswirtschaft**, in der der Staat plant, und die **freie Marktwirtschaft**, in der Angebot und Nachfrage entscheiden. Dazwischen liegt die **Soziale Marktwirtschaft**, die Deutschland heute prägt. Reine Formen gibt es in der Wirklichkeit kaum, es sind Modelle zum Vergleichen.",
      "In der Zentralverwaltungswirtschaft legt eine staatliche Behörde in einem Plan fest, was, wie viel und für wen hergestellt wird. Die Betriebe gehören meist dem Staat, und die Preise werden festgesetzt. Der Gedanke: Alle sollen versorgt sein, niemand soll am Markt scheitern. In der Praxis kennt die Behörde die Wünsche von Millionen Menschen aber nicht genau. Es gibt Mangel an Gefragtem und Überschüsse an Ungefragtem, und wer sich anstrengt, hat wenig davon. Die DDR und die Sowjetunion waren so organisiert; beide Staaten gibt es nicht mehr.",
      "In der freien (liberalen) Marktwirtschaft gehören die Betriebe Privatleuten, die Preise bilden sich frei am Markt, und der Staat sorgt nur für den Rahmen: Er schützt Eigentum und Verträge. Das bringt viel Freiheit, Anreize zu Leistung und Ideen und ein vielfältiges Angebot. Wer aber krank, alt oder arbeitslos wird, steht ohne Absicherung da. Große Unternehmen können den Wettbewerb ausschalten, und Umweltschäden bleiben unbeachtet. Befürworter sehen darin den Preis der Freiheit, Kritiker Gründe für staatliche Regeln.",
      "Die Soziale Marktwirtschaft verbindet beides. Wie in der freien Marktwirtschaft gelten Privateigentum, Wettbewerb und freie Preisbildung. Zusätzlich setzt der Staat Regeln: Er schützt den Wettbewerb, sichert Menschen durch Sozialversicherungen und Schutzgesetze ab und gleicht Härten aus. Das kostet Steuern und Beiträge und kann Anreize dämpfen. Wie viel Staat nötig ist, wird politisch unterschiedlich gesehen. Das Grundgesetz nennt Deutschland einen sozialen Bundesstaat, schreibt aber keine bestimmte Wirtschaftsordnung vor.",
    ],
    terms: [
      {
        term: "Wirtschaftsordnung",
        text: "Die Gesamtheit der Regeln, die festlegen, wer in einem Land über Produktion, Preise und Verteilung entscheidet.",
      },
      {
        term: "Zentralverwaltungswirtschaft",
        text: "Eine staatliche Behörde plant Produktion und Preise im Voraus; die Betriebe gehören meist dem Staat.",
      },
      {
        term: "Freie Marktwirtschaft",
        text: "Privatleute entscheiden, die Preise bilden sich am Markt, und der Staat setzt nur einen engen Rahmen.",
      },
      {
        term: "Soziale Marktwirtschaft",
        text: "Markt und Wettbewerb bilden die Grundlage, der Staat schützt den Wettbewerb und sorgt für sozialen Ausgleich.",
      },
    ],
    law: [
      {
        ref: "Art. 20 Abs. 1 GG",
        text: "Die Bundesrepublik Deutschland ist ein demokratischer und sozialer Bundesstaat. Das verpflichtet den Staat auf soziale Verantwortung. Eine bestimmte Wirtschaftsordnung schreibt das Grundgesetz damit aber nicht vor.",
        url: "https://www.gesetze-im-internet.de/gg/art_20.html",
      },
    ],
    takeaway:
      "In der Zentralverwaltungswirtschaft plant der Staat, in der freien Marktwirtschaft entscheidet allein der Markt. Die Soziale Marktwirtschaft nutzt Wettbewerb und freie Preise, ergänzt sie aber durch Wettbewerbsschutz und sozialen Ausgleich durch den Staat.",
    sourceIds: ["lp", "bpb", "gg"],
    quiz: {
      question: "Was unterscheidet die Soziale Marktwirtschaft von der freien Marktwirtschaft?",
      answer: "Der Staat schützt den Wettbewerb und sorgt zusätzlich für einen sozialen Ausgleich.",
      wrong: [
        "Der Staat plant die Produktion in einem Plan und legt dafür alle Preise fest.",
        "Der Staat greift in die Preise ein und garantiert jedem ein gleich hohes Einkommen.",
      ],
      explanation:
        "Auch die Soziale Marktwirtschaft beruht auf Markt, Wettbewerb und freien Preisen. Zusätzlich setzt der Staat Regeln und sichert Menschen ab. Planung aller Preise gehört zur Zentralverwaltungswirtschaft, und gleiche Einkommen für alle sind kein Ziel.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Wirtschaftsordnung ist das?",
      instruction: "Ordne jede Beschreibung der Wirtschaftsordnung zu, zu der sie am besten passt.",
      categories: ["Zentralverwaltungswirtschaft", "Freie Marktwirtschaft", "Soziale Marktwirtschaft"],
      entries: [
        {
          text: "Eine staatliche Planungsbehörde legt fest, wie viele Schuhe hergestellt werden und was sie kosten.",
          target: 0,
          feedback: "Planung von Produktion und Preisen durch den Staat kennzeichnet die Zentralverwaltungswirtschaft.",
        },
        {
          text: "Der Staat schützt nur Eigentum und Verträge; wer krank wird und kein Geld hat, ist auf private Hilfe angewiesen.",
          target: 1,
          feedback: "Ein Staat, der nur den Rahmen setzt und nicht absichert, entspricht der freien Marktwirtschaft.",
        },
        {
          text: "Die Preise bilden sich am Markt, aber eine Pflichtversicherung sichert alle Beschäftigten bei Krankheit ab.",
          target: 2,
          feedback: "Markt plus soziale Absicherung durch den Staat: das ist die Soziale Marktwirtschaft.",
        },
        {
          text: "Fast alle Betriebe gehören dem Staat und müssen ihre Ware nach staatlichen Plänen abliefern.",
          target: 0,
          feedback: "Staatseigentum und Plan statt Markt sind Merkmale der Zentralverwaltungswirtschaft.",
        },
        {
          text: "Ein Unternehmer ist der einzige Anbieter in der Region und darf die Preise beliebig erhöhen, kein Gesetz bremst ihn.",
          target: 1,
          feedback: "Ohne staatlichen Schutz des Wettbewerbs gilt das Recht des Stärkeren: freie Marktwirtschaft.",
        },
        {
          text: "Eine Behörde verbietet Unternehmen, ihre Preise heimlich abzusprechen, um den Wettbewerb zu schützen.",
          target: 2,
          feedback: "Der Staat sichert den Wettbewerb, ohne zu planen: typisch für die Soziale Marktwirtschaft.",
        },
      ],
      conclusion: "Entscheidend ist, wer plant und welche Rolle der Staat hat: planen, nur den Rahmen setzen oder den Rahmen setzen und sozial ausgleichen.",
    },
    casework: {
      title: "Drei Länder, drei Ordnungen",
      story:
        "In **Aria** legt eine Planungsbehörde fest, was die Betriebe herstellen und was alles kostet. In **Boria** entscheiden allein die Märkte, und der Staat schützt nur Eigentum und Verträge. In **Corda** bilden sich die Preise am Markt, aber eine Behörde wacht über den Wettbewerb, und alle Beschäftigten sind gegen Krankheit und Arbeitslosigkeit versichert.",
      steps: [
        {
          question: "Welches Land entspricht der Sozialen Marktwirtschaft?",
          options: [
            "Corda: freie Preise, geschützter Wettbewerb und soziale Absicherung",
            "Boria: Der Markt entscheidet, und der Staat hält sich heraus",
            "Aria: Der Staat plant, damit alle gleich versorgt werden",
          ],
          answer: 0,
          explanation: "Die Soziale Marktwirtschaft verbindet den Markt mit Wettbewerbsschutz und sozialer Absicherung. Das trifft nur auf Corda zu.",
        },
        {
          question: "Welches Risiko trägt eine Beschäftigte in Boria, wenn sie schwer erkrankt?",
          options: [
            "Sie muss die Behandlung selbst bezahlen oder auf private Hilfe hoffen, weil der Staat nicht absichert.",
            "Sie hat keine Sorgen, weil die Unternehmen in Boria alle Kosten ihrer Beschäftigten übernehmen müssen.",
            "Sie bekommt Hilfe von der Planungsbehörde, die jedem die nötige Behandlung zuteilt.",
          ],
          answer: 0,
          explanation:
            "In der freien Marktwirtschaft sorgt jeder zunächst selbst vor. Eine staatliche Absicherung fehlt, und Hilfe ist freiwillig. Die Zuteilung durch eine Behörde gehört zu Aria.",
        },
        {
          question: "Welchen Nachteil hat die Planung in Aria?",
          options: [
            "Die Behörde kennt die Wünsche der Menschen nicht genau, deshalb gibt es Mangel und Überschüsse.",
            "Die Preise schwanken ständig, weil Angebot und Nachfrage sie bestimmen.",
            "Große Unternehmen können den Wettbewerb nach Belieben ausschalten.",
          ],
          answer: 0,
          explanation:
            "Ein Plan kann die Wünsche von Millionen Menschen kaum treffen. Schwankende Preise und Marktmacht sind Probleme des Marktes, nicht der Planung.",
        },
      ],
      verdict:
        "Corda zeigt die Soziale Marktwirtschaft: Markt und Wettbewerb als Grundlage, dazu Regeln und Absicherung durch den Staat. In Aria fehlt die Freiheit des Marktes, in Boria die soziale Absicherung.",
    },
    tasks: {
      1: {
        prompt: "Vergleiche die Zentralverwaltungswirtschaft und die freie Marktwirtschaft: Wer entscheidet jeweils, was hergestellt wird, und wie entstehen die Preise?",
        hints: ["Treffen eine Behörde oder viele einzelne Unternehmen und Haushalte die Entscheidungen?", "Werden die Preise festgelegt, oder entstehen sie am Markt?"],
        model:
          "In der Zentralverwaltungswirtschaft legt eine staatliche Planungsbehörde fest, was und wie viel produziert wird, und sie setzt auch die Preise fest. In der freien Marktwirtschaft entscheiden viele einzelne Unternehmen und Haushalte selbst. Die Preise entstehen am Markt aus Angebot und Nachfrage und zeigen den Unternehmen, was gefragt ist. Der Staat setzt dort nur den Rahmen, zum Beispiel für Eigentum und Verträge.",
        criteria: [
          "Beschreibt, wer in der Planwirtschaft über Produktion und Preise entscheidet",
          "Beschreibt Entscheidung und Preisbildung in der freien Marktwirtschaft",
          "Stellt beide Ordnungen gegenüber (Behörde und Markt)",
        ],
      },
      2: {
        prompt:
          "Jemand behauptet: „Die Soziale Marktwirtschaft nimmt das Beste aus beiden Welten.“ Nenne einen Vorteil und eine mögliche Schwäche und beurteile die Aussage.",
        hints: [
          "Was übernimmt die Soziale Marktwirtschaft vom Markt, und was fügt der Staat hinzu?",
          "Welche Kosten oder Nebenwirkungen können staatliche Eingriffe haben?",
        ],
        model:
          "Ein Vorteil ist, dass Wettbewerb und freie Preise Leistung und Ideen belohnen, während Sozialversicherungen Menschen in Notlagen absichern. Eine Schwäche ist, dass die Absicherung Steuern und Beiträge kostet und Anreize zur Eigenleistung schwächen kann. Ich halte die Aussage deshalb für teilweise richtig: Die Ordnung verbindet Vorteile beider Seiten, muss aber ständig abwägen, wie viel Schutz sie sich leisten kann. Wo man die Grenze zieht, ist eine politische Frage, bei der unterschiedliche Meinungen vertretbar sind.",
        criteria: [
          "Nennt einen Vorteil der Sozialen Marktwirtschaft",
          "Nennt eine mögliche Schwäche oder Nebenwirkung staatlicher Eingriffe",
          "Begründet ein eigenes Urteil zur Aussage (jedes begründete Urteil ist gleichwertig)",
        ],
      },
    },
  },
  {
    id: "sm-ziele",
    lb: 2,
    unit: "2.2",
    title: "Entstehung und Ziele der Sozialen Marktwirtschaft",
    intro: "Warum Deutschland nach 1948 auf Markt und sozialen Ausgleich setzte und welche Fragen heute offen sind.",
    paragraphs: [
      "Nach dem Zweiten Weltkrieg ging es vielen Menschen schlecht. Lebensmittel waren rationiert, der Staat legte die Preise fest, und die Reichsmark war fast wertlos; getauscht wurde auf dem Schwarzmarkt. Am 20. Juni 1948 führten die westlichen Besatzungszonen die Deutsche Mark ein: die **Währungsreform**. Wenige Tage später hob Ludwig Erhard, Direktor der Verwaltung für Wirtschaft in der Bizone, dem gemeinsamen Gebiet der amerikanischen und britischen Zone, viele Preisbindungen auf; Grundnahrungsmittel und Mieten blieben zunächst gebunden. Zurückgehaltene Waren kamen in die Läden, und Arbeit lohnte sich wieder, weil man sich vom Geld etwas kaufen konnte.",
      "Das Konzept dahinter geht vor allem auf den Volkswirt **Alfred Müller-Armack** zurück, der um 1946/47 den Begriff Soziale Marktwirtschaft prägte und Ideen anderer Ökonomen wie Walter Eucken aufgriff: Der Markt soll Freiheit und Wohlstand schaffen, der Staat den Wettbewerb schützen und für sozialen Ausgleich sorgen. **Ludwig Erhard** setzte die Idee politisch um, ab 1949 als erster Bundeswirtschaftsminister. Der schnelle Aufschwung der 1950er-Jahre erhielt den Namen **Wirtschaftswunder**. Damit der Markt funktioniert, braucht er einen **Ordnungsrahmen**: den Schutz von Eigentum und Verträgen, einen Staat, der den Wettbewerb sichert, und stabiles Geld, für das eine unabhängige Zentralbank sorgt.",
      "Welche Ziele verfolgt die Soziale Marktwirtschaft? Grundidee ist Wohlstand durch Wettbewerb, verbunden mit sozialer Sicherheit und Gerechtigkeit. Das Stabilitätsgesetz von 1967 nennt vier Ziele, die der Staat zugleich anstreben soll: stabile Preise, einen hohen Beschäftigungsstand, ein außenwirtschaftliches Gleichgewicht (Ein- und Ausfuhren halten sich ungefähr die Waage) und stetiges, angemessenes Wachstum. Heute zählen viele auch Umweltschutz und eine faire Verteilung dazu. Die Ziele können einander im Weg stehen, etwa Wachstum und Umweltschutz, deshalb muss die Politik abwägen.",
      "Aktuelle Entwicklungen stellen die Ordnung vor neue Fragen. Die **Globalisierung** bringt Konkurrenz aus aller Welt: Das macht vieles billiger, kann aber Arbeitsplätze kosten. Die **Digitalisierung** schafft neue Berufe und mächtige Internetkonzerne, lässt aber andere Tätigkeiten verschwinden. Der **Klimawandel** zeigt, dass Preise Umweltschäden oft nicht abbilden. Die **soziale Ungleichheit** wirft die Frage auf, wie gerecht Einkommen und Vermögen verteilt sind. Wie der Staat darauf antworten soll, mit mehr Regeln oder mit mehr Freiraum für den Markt, wird unterschiedlich beurteilt.",
    ],
    terms: [
      {
        term: "Währungsreform",
        text: "Der Umtausch der fast wertlosen Reichsmark in die Deutsche Mark am 20. Juni 1948 in den westlichen Besatzungszonen.",
      },
      { term: "Wirtschaftswunder", text: "Der schnelle Wirtschaftsaufschwung der 1950er-Jahre in der Bundesrepublik Deutschland." },
      {
        term: "Ordnungsrahmen",
        text: "Die Regeln des Staates, die den Markt erst möglich machen: Eigentum, Verträge, Wettbewerbsschutz und stabiles Geld.",
      },
      { term: "Globalisierung", text: "Die wachsende weltweite Verflechtung von Handel, Produktion und Finanzen." },
    ],
    law: [
      {
        ref: "§ 1 StabG",
        text: "Bund und Länder sollen ihre Wirtschafts- und Finanzpolitik so ausrichten, dass sie im Rahmen der marktwirtschaftlichen Ordnung gleichzeitig zu stabilen Preisen, hoher Beschäftigung und außenwirtschaftlichem Gleichgewicht bei stetigem und angemessenem Wachstum beitragen.",
        url: "https://www.gesetze-im-internet.de/stabg/__1.html",
      },
    ],
    takeaway:
      "Die Soziale Marktwirtschaft entstand nach 1945: Die Währungsreform 1948 und Ludwig Erhards Preisfreigabe schufen wieder einen Markt, Alfred Müller-Armack prägte das Konzept. Ihr Ziel ist Wohlstand durch Wettbewerb bei sozialer Sicherheit.",
    sourceIds: ["lp", "bpb", "bundesbank", "stabg"],
    quiz: {
      question: "Welche Voraussetzung braucht die Soziale Marktwirtschaft, damit der Markt funktioniert?",
      answer: "Einen Rechtsrahmen, der Eigentum und Verträge schützt, den Wettbewerb sichert und stabiles Geld gewährleistet.",
      wrong: [
        "Eine staatliche Planungsbehörde, die Produktion und Preise aller Güter vorgibt.",
        "Einen Staat, der sich vollständig aus der Wirtschaft heraushält und alles dem Markt überlässt.",
      ],
      explanation:
        "Der Markt braucht verlässliche Regeln: Eigentum, Verträge, Wettbewerbsschutz und stabiles Geld. Ein Staat, der alles plant, ersetzt den Markt, und ein Staat, der nichts regelt, schützt weder Wettbewerb noch Absicherung.",
    },
    workshop: {
      kind: "timeline",
      title: "Von der Not zur Sozialen Marktwirtschaft",
      instruction: "Bringe die fünf Ereignisse in die richtige zeitliche Reihenfolge.",
      categories: [],
      entries: [
        {
          text: "Lebensmittel sind rationiert, der Staat legt die Preise fest, und die Reichsmark ist fast wertlos.",
          target: 0,
          feedback: "Nach 1945 waren Mangel und Zwangswirtschaft der Ausgangspunkt.",
        },
        {
          text: "Die Westzonen führen die Deutsche Mark ein, und Ludwig Erhard hebt wenige Tage später viele Preisbindungen auf.",
          target: 1,
          feedback: "1948: Währungsreform und Preisfreigabe machten den Markt wieder möglich.",
        },
        {
          text: "Die Bundesrepublik Deutschland wird gegründet, und Ludwig Erhard wird ihr erster Bundeswirtschaftsminister.",
          target: 2,
          feedback: "1949: Erhard setzt die Soziale Marktwirtschaft in der Regierung um.",
        },
        {
          text: "Das Gesetz gegen Wettbewerbsbeschränkungen tritt in Kraft, und das Bundeskartellamt beginnt zu arbeiten.",
          target: 3,
          feedback: "1958: Der Wettbewerb wird rechtlich geschützt.",
        },
        {
          text: "Mit dem Vertrag über die Währungs-, Wirtschafts- und Sozialunion übernimmt die DDR die Soziale Marktwirtschaft.",
          target: 4,
          feedback: "1990: Die Soziale Marktwirtschaft wird gemeinsame Wirtschaftsordnung beider deutscher Staaten.",
        },
      ],
      conclusion:
        "Die Soziale Marktwirtschaft entstand nicht an einem Tag: Auf Währungsreform und Preisfreigabe folgten der Schutz des Wettbewerbs und schließlich die Ausdehnung auf ganz Deutschland.",
    },
    casework: {
      title: "Die Weberei Kranz",
      story:
        "Die Weberei Kranz in einer Kleinstadt stellt seit Jahrzehnten Stoffe her. Importe aus Übersee sind inzwischen deutlich billiger, und die Kundschaft wandert ab. Von den **60 Beschäftigten** droht der Hälfte die Kündigung.",
      steps: [
        {
          question: "Welche aktuelle Entwicklung trifft die Weberei vor allem?",
          options: [
            "Die Globalisierung: Anbieter aus aller Welt konkurrieren um dieselben Kunden.",
            "Der Klimawandel: Die Kunden wollen nur noch umweltschonende Stoffe.",
            "Die Digitalisierung: Roboter haben alle Webstühle ersetzt.",
          ],
          answer: 0,
          explanation: "Billigere Importe zeigen den weltweiten Wettbewerb. Von Klima oder Digitalisierung ist in der Geschichte keine Rede.",
        },
        {
          question: "Wer hat in diesem Fall Vorteile, und wer trägt Nachteile?",
          options: [
            "Verbraucher profitieren von niedrigeren Preisen, die Beschäftigten der Weberei tragen das Risiko.",
            "Alle profitieren gleichermaßen, weil Wettbewerb nie jemandem schadet.",
            "Nur die Weberei verliert, denn die Beschäftigten behalten bei einer Kündigung ihr Einkommen.",
          ],
          answer: 0,
          explanation:
            "Wettbewerb verteilt Chancen und Risiken verschieden: Käufer zahlen weniger, die Beschäftigten müssen um ihre Arbeitsplätze fürchten.",
        },
        {
          question: "Welche Antwort passt am besten zu den Zielen der Sozialen Marktwirtschaft?",
          options: [
            "Beschäftigte absichern und Weiterbildung fördern, ohne den Wettbewerb außer Kraft zu setzen.",
            "Alle Importe verbieten, damit die Weberei ihre Preise nie senken muss.",
            "Die Weberei verstaatlichen und ihre Produktion von einer Behörde planen lassen.",
          ],
          answer: 0,
          explanation:
            "Die Soziale Marktwirtschaft will den Markt erhalten und Härten abfedern. Ein Importverbot oder staatliche Planung würde den Wettbewerb ausschalten.",
        },
      ],
      verdict:
        "Wettbewerb bringt Chancen und Härten. Die Soziale Marktwirtschaft sucht Antworten, die den Markt erhalten und zugleich Betroffene absichern; wie weit der Staat dabei gehen soll, bleibt eine politische Streitfrage.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre, warum die Währungsreform und die Freigabe der Preise 1948 als wichtige Voraussetzungen für die Soziale Marktwirtschaft gelten.",
        hints: ["Wie war die Lage bei Geld, Waren und Preisen vor 1948?", "Was ermöglichen stabiles Geld und freie Preise einem Markt?"],
        model:
          "Vor 1948 war die Reichsmark fast wertlos, Waren waren rationiert, und der Staat legte die Preise fest. Wer arbeitete, konnte sich für sein Geld wenig kaufen, und viele Waren wurden zurückgehalten. Die Deutsche Mark stellte stabiles Geld wieder her, und freie Preise zeigten wieder, was knapp und gefragt war. So lohnte sich Arbeit, Unternehmen produzierten für den Markt, und die Läden füllten sich. Auf dieser Grundlage konnte der Wettbewerb funktionieren.",
        criteria: [
          "Beschreibt die Lage vor 1948 (wertloses Geld, Rationierung, feste Preise)",
          "Erklärt die Wirkung von stabilem Geld und freien Preisen",
          "Verknüpft beides mit dem Funktionieren eines Marktes",
        ],
      },
      2: {
        prompt:
          "Wähle eine aktuelle Entwicklung (Globalisierung, Digitalisierung, Klimawandel oder soziale Ungleichheit). Beschreibe die Herausforderung für die Soziale Marktwirtschaft und stelle zwei unterschiedliche Antworten gegenüber.",
        hints: ["Welche Chance und welches Risiko bringt die Entwicklung?", "Wer will mehr staatliche Regeln, wer mehr Freiraum für den Markt, und warum?"],
        model:
          "Beim Klimawandel ist die Herausforderung, dass Preise Umweltschäden oft nicht ganz enthalten: Wer Kohlendioxid ausstößt, zahlt dafür bisher nicht den vollen Schaden. Eine Antwort ist ein höherer Preis für den Ausstoß, wie ihn der Emissionshandel schon vorsieht, damit der Markt günstigere, sauberere Wege findet. Eine andere ist, Grenzwerte und Verbote festzulegen, damit das Ziel sicher erreicht wird. Der Preis lässt dem Markt mehr Freiheit, feste Regeln wirken verlässlicher, nehmen aber Flexibilität. Beide Wege passen zur Sozialen Marktwirtschaft, solange sie den Wettbewerb nicht abschaffen.",
        criteria: [
          "Beschreibt eine aktuelle Herausforderung nachvollziehbar",
          "Stellt zwei verschiedene Antworten gegenüber",
          "Bleibt sachlich und begründet beide Positionen",
        ],
      },
    },
  },
  {
    id: "sm-freiheit",
    lb: 2,
    unit: "2.2",
    title: "Freiheit, Wettbewerb und Nachhaltigkeit",
    intro: "Eigentum, Verträge, Wettbewerb: Welche Freiheiten der Markt braucht, wem sie nützen und wo sie Grenzen haben.",
    paragraphs: [
      "Die Soziale Marktwirtschaft beruht auf Freiheiten. Mit **Privateigentum** darfst du besitzen, nutzen und verkaufen, was dir gehört. Mit der **Vertragsfreiheit** entscheidest du, mit wem du welchen Vertrag schließt. Die **Berufs- und Gewerbefreiheit** erlaubt dir, Beruf und Arbeitsplatz frei zu wählen und ein Gewerbe zu gründen. Dazu kommen der **Wettbewerb** zwischen den Anbietern, die **freie Preisbildung** und die **Konsumfreiheit**: Jeder entscheidet selbst, was er kauft. Das Grundgesetz schützt einiges davon ausdrücklich, doch Eigentum verpflichtet auch: Es soll zugleich der Allgemeinheit dienen.",
      "Diese Freiheiten eröffnen Chancen, bergen aber Risiken. Für **Konsumenten** bedeuten Wettbewerb und freie Preise große Auswahl, Preisvergleiche und oft niedrige Preise. Risiken sind Werbedruck, Spontankäufe auf Pump und Anbieter, die den Überblick erschweren. Für **Produzenten** eröffnet die Freiheit die Chance, ein Unternehmen zu gründen, Gewinne zu machen und mit guten Ideen Kunden zu gewinnen. Das Risiko: Wer im Wettbewerb nicht mithält, macht Verluste und muss im Extremfall schließen.",
      "Wettbewerb nützt aber nur, solange er stattfindet. Unternehmen können versucht sein, ihn auszuschalten: Sprechen Konkurrenten ihre Preise heimlich ab, bilden sie ein **Kartell**, und die Käufer zahlen mehr, ohne ausweichen zu können. Deshalb schützt der Staat den Wettbewerb. Das Gesetz gegen Wettbewerbsbeschränkungen verbietet solche Absprachen und den Missbrauch von Marktmacht und lässt große Firmenzusammenschlüsse prüfen. Über die Einhaltung wacht das **Bundeskartellamt** mit Sitz in Bonn.",
      "Freiheit im Markt hat noch eine Grenze: Preise zeigen nicht alle Kosten. Verschmutzt eine Fabrik die Luft, trägt die Allgemeinheit den Schaden. **Nachhaltiges Wirtschaften** will deshalb dreierlei verbinden: **ökonomisch**, also dauerhaft erfolgreich und wettbewerbsfähig; **ökologisch**, also Natur und Rohstoffe so nutzen, dass sie erhalten bleiben; und **sozial**, also fair gegenüber Beschäftigten und Lieferanten, etwa mit angemessenen Löhnen und sicheren Arbeitsplätzen. Notwendig ist das, weil Rohstoffe knapp sind und wir künftigen Generationen keine geplünderte Welt hinterlassen wollen. Auch Unternehmen profitieren, etwa durch geringeren Rohstoffverbrauch.",
    ],
    terms: [
      {
        term: "Vertragsfreiheit",
        text: "Jeder darf frei entscheiden, ob, mit wem und mit welchem Inhalt er einen Vertrag schließt, solange er sich an die Gesetze hält.",
      },
      {
        term: "Kartell",
        text: "Eine Absprache zwischen Konkurrenten, die den Wettbewerb einschränkt, zum Beispiel über gemeinsame Preise. Preisabsprachen sind verboten.",
      },
      {
        term: "Bundeskartellamt",
        text: "Die Bundesbehörde in Bonn, die Kartelle verfolgt, Marktmissbrauch prüft und große Firmenzusammenschlüsse kontrolliert.",
      },
      {
        term: "Nachhaltiges Wirtschaften",
        text: "Wirtschaften, das ökonomische, ökologische und soziale Folgen zugleich beachtet, damit auch künftige Generationen gut leben können.",
      },
    ],
    law: [
      {
        ref: "Art. 12 Abs. 1, Art. 14 Abs. 1 und 2 GG",
        text: "Alle Deutschen dürfen Beruf, Arbeitsplatz und Ausbildungsstätte frei wählen. Das Eigentum wird gewährleistet, verpflichtet aber auch: Sein Gebrauch soll zugleich dem Wohle der Allgemeinheit dienen.",
        url: "https://www.gesetze-im-internet.de/gg/art_14.html",
      },
      {
        ref: "§ 1 GWB",
        text: "Absprachen zwischen Unternehmen, die den Wettbewerb verhindern, einschränken oder verfälschen, sind verboten. Für bestimmte Kooperationen, etwa kleinerer und mittlerer Unternehmen, gibt es Ausnahmen.",
        url: "https://www.gesetze-im-internet.de/gwb/__1.html",
      },
    ],
    takeaway:
      "Privateigentum, Vertrags-, Berufs- und Konsumfreiheit, Wettbewerb und freie Preise schaffen Chancen für Konsumenten und Produzenten, bergen aber auch Risiken. Der Staat schützt den Wettbewerb durch das Kartellrecht, und Nachhaltigkeit verlangt, Wirtschaft, Umwelt und Soziales gemeinsam zu beachten.",
    sourceIds: ["lp", "bpb", "gg", "gwb"],
    quiz: {
      question: "Warum verbietet der Staat Preisabsprachen zwischen Konkurrenten?",
      answer: "Ohne Wettbewerb können Anbieter die Preise hoch halten, und die Käufer haben keine Wahl.",
      wrong: [
        "Weil Preise in der Sozialen Marktwirtschaft grundsätzlich vom Staat festgelegt werden.",
        "Weil Unternehmen untereinander niemals zusammenarbeiten dürfen, auch nicht bei der Forschung.",
      ],
      explanation:
        "Absprachen schalten den Wettbewerb aus, und genau er hält Preise niedrig und Qualität hoch. Der Staat legt Preise nicht fest, und Zusammenarbeit ist erlaubt, solange sie den Wettbewerb nicht beschränkt.",
    },
    workshop: {
      kind: "classify",
      title: "Chance oder Risiko, Konsument oder Produzent?",
      instruction: "Ordne jeden Fall zu: Aus wessen Sicht wird er erzählt, und ist der Markt für diese Person eine Chance oder ein Risiko?",
      categories: ["Chance für Konsumenten", "Risiko für Konsumenten", "Chance für Produzenten", "Risiko für Produzenten"],
      entries: [
        {
          text: "Beim Preisvergleich im Internet findet Selin dieselben Kopfhörer für 20 Euro günstiger.",
          target: 0,
          feedback: "Wettbewerb drückt die Preise: eine Chance für Käufer.",
        },
        {
          text: "Durch ständige Werbung kauft Paul spontan Dinge, die er nicht braucht, und ist am Monatsende pleite.",
          target: 1,
          feedback: "Konsumfreiheit schließt Fehlentscheidungen ein; Werbung erhöht den Kaufdruck.",
        },
        {
          text: "Lea gründet eine kleine Nähwerkstatt und darf ihre Preise selbst bestimmen.",
          target: 2,
          feedback: "Gewerbefreiheit und freie Preisbildung ermöglichen den Schritt in die Selbstständigkeit.",
        },
        {
          text: "Eine neue Bäckerei eröffnet gegenüber, und Herr Öztürk verliert viele Stammkunden.",
          target: 3,
          feedback: "Wettbewerb kann Anbieter Kunden und Gewinne kosten.",
        },
        {
          text: "Ein Studententeam entwickelt eine Lern-App, die besser ist als alle anderen, und gewinnt viele Nutzer.",
          target: 2,
          feedback: "Wer die bessere Idee hat, kann im Wettbewerb gewinnen.",
        },
        {
          text: "In Franzis Dorf gibt es nur einen Handwerksbetrieb, und sie muss für eine Reparatur einen hohen Preis zahlen, weil sie nirgends sonst hingehen kann.",
          target: 1,
          feedback: "Ohne Konkurrenz fehlt der Käuferin die Wahl.",
        },
      ],
      conclusion: "Dieselbe Freiheit nützt dem einen und schadet dem anderen: Der Markt verteilt Chancen und Risiken zugleich.",
    },
    casework: {
      title: "Die Pizza-Absprache",
      story:
        "In diesem erfundenen Fall treffen sich die drei größten Hersteller von Tiefkühlpizza in Deutschland, **Pizzaglut**, **Ofenmeister** und **Teigkönig**, heimlich. Sie vereinbaren, ihre Preise im nächsten Monat gleichzeitig um **30 Cent** je Packung anzuheben. Ein Mitarbeiter meldet die Absprache bei der Behörde.",
      steps: [
        {
          question: "Wie nennt man eine solche Absprache?",
          options: ["Kartell", "Fusion", "Monopol"],
          answer: 0,
          explanation:
            "Ein Kartell ist eine Absprache zwischen Konkurrenten. Eine Fusion ist der Zusammenschluss von Unternehmen, ein Monopol der Markt mit nur einem Anbieter.",
        },
        {
          question: "Warum schadet die Absprache den Käufern?",
          options: [
            "Sie können nicht ausweichen, weil alle Konkurrenten gleichzeitig die Preise erhöhen.",
            "Sie zahlen automatisch weniger, weil sich die Hersteller die Kosten teilen.",
            "Sie merken nichts, weil die Absprache nur die Hersteller betrifft.",
          ],
          answer: 0,
          explanation:
            "Ohne Wettbewerb fehlt der Druck, Preise niedrig zu halten. Die Käufer zahlen mehr, auch wenn die Kosten der Hersteller gar nicht gestiegen sind.",
        },
        {
          question: "Welche Stelle prüft solche Fälle in ganz Deutschland, und was gilt?",
          options: [
            "Das Bundeskartellamt: Absprachen, die den Wettbewerb einschränken, sind nach dem Kartellgesetz verboten.",
            "Die Verbraucherzentrale: Sie darf die Preiserhöhung selbst verbieten und bestrafen.",
            "Das Finanzamt: Preisabsprachen sind erlaubt, aber die Gewinne werden besteuert.",
          ],
          answer: 0,
          explanation:
            "Das Bundeskartellamt wacht über das Gesetz gegen Wettbewerbsbeschränkungen und kann bei Verstößen Bußgelder verhängen. Verbraucherzentralen informieren und beraten, verhängen aber keine Strafen.",
        },
      ],
      verdict:
        "Die Preisabsprache ist ein Kartell und nach dem Gesetz gegen Wettbewerbsbeschränkungen verboten. Das Bundeskartellamt schützt so den Wettbewerb, von dem die Käufer durch Auswahl und faire Preise profitieren.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre zwei freiheitliche Bausteine der Sozialen Marktwirtschaft und nenne zu jedem eine Chance und ein Risiko, entweder für Konsumenten oder für Produzenten.",
        hints: ["Wähle zwei Bausteine, etwa Wettbewerb, freie Preisbildung oder Gewerbefreiheit.", "Frage dich: Wem nützt der Baustein, und wem kann er schaden?"],
        model:
          "Die freie Preisbildung bedeutet, dass Anbieter ihre Preise selbst festlegen. Das ist eine Chance für Produzenten, die mit guten Ideen höhere Preise erzielen, aber ein Risiko für Konsumenten, wenn ein Anbieter ohne Konkurrenz sehr hohe Preise verlangt. Beim Wettbewerb konkurrieren viele Anbieter um Kunden. Konsumenten profitieren von Auswahl und niedrigen Preisen, doch Produzenten, die nicht mithalten, verlieren Kunden und müssen im Extremfall schließen.",
        criteria: [
          "Erklärt zwei Bausteine richtig",
          "Nennt zu jedem Baustein eine Chance",
          "Nennt zu jedem Baustein ein Risiko",
        ],
      },
      2: {
        prompt:
          "Ein Textilunternehmen kann billiger produzieren, wenn es in Fabriken mit niedrigen Löhnen und ohne Umweltschutz nähen lässt. Beurteile, ob das wirtschaftlich vernünftig ist, und beziehe die drei Seiten des nachhaltigen Wirtschaftens ein.",
        hints: [
          "Was spart das Unternehmen kurzfristig, und wer trägt die Kosten, die der Preis nicht zeigt?",
          "Prüfe nacheinander die ökonomische, die ökologische und die soziale Seite.",
        ],
        model:
          "Kurzfristig spart das Unternehmen Kosten und kann günstige Preise verlangen, das spricht ökonomisch dafür. Ökologisch und sozial trägt aber die Allgemeinheit die Kosten: Flüsse werden verschmutzt, und Beschäftigte arbeiten unter schlechten Bedingungen. Langfristig kann es auch dem Unternehmen schaden, etwa durch Skandale, strengere Gesetze oder Käufer, die faire Ware bevorzugen. Ich halte das Vorgehen daher nur kurzfristig für vernünftig. Nachhaltig wirtschaftet es erst, wenn es alle drei Seiten beachtet.",
        criteria: [
          "Nennt den kurzfristigen wirtschaftlichen Vorteil",
          "Prüft ökologische und soziale Folgen",
          "Begründet ein eigenes Urteil mit Blick auf die lange Sicht (jedes begründete Urteil ist gleichwertig)",
        ],
      },
    },
  },
  {
    id: "sm-sozial",
    lb: 2,
    unit: "2.2",
    title: "Soziale Sicherung und Sozialversicherung",
    intro: "Krank, arbeitslos, im Alter: Wie die Sozialversicherung typische Lebensrisiken gemeinsam absichert.",
    paragraphs: [
      "Auch in der Marktwirtschaft kann jedem etwas zustoßen: eine schwere Krankheit, ein Unfall, der Verlust der Arbeit, Pflegebedürftigkeit im Alter. Das könnten Einzelne kaum allein bezahlen. Deshalb gibt es die **Sozialversicherung** mit fünf Zweigen. Beschäftigte, auch Auszubildende, sind gesetzlich versichert: Es besteht **Versicherungspflicht**. Nur so verteilt sich das Risiko auf viele: Niemand kann sich dem Beitrag entziehen und im Notfall trotzdem auf die anderen zählen. Beamte, Selbstständige und Gutverdienende können teils anders vorsorgen.",
      "Die **Krankenversicherung** bezahlt Arztbesuche, Medikamente und Krankenhaus, auch nach Unfällen in der Freizeit. Die **Pflegeversicherung** hilft, wenn jemand dauerhaft Unterstützung im Alltag braucht, etwa durch einen Pflegedienst. Die **Rentenversicherung** zahlt Altersrenten, außerdem Renten bei Erwerbsminderung und für Hinterbliebene, und sie fördert Rehabilitation. Zusammen sichern diese drei die Risiken Krankheit, Pflegebedürftigkeit und Alter ab.",
      "Die **Arbeitslosenversicherung** zahlt für begrenzte Zeit Arbeitslosengeld, wenn man vorher lange genug versichert war, und hilft mit Vermittlung und Weiterbildung. Die **Unfallversicherung** greift bei Arbeitsunfällen, Wegeunfällen auf dem Weg zur Arbeit und Berufskrankheiten. Sie bezahlt Behandlung und Rehabilitation und bei dauerhaften Folgen auch Renten. Auch Schülerinnen und Schüler sind in der Schule und auf dem Schulweg versichert. Unfälle in der Freizeit gehören dagegen zur Krankenversicherung.",
      "Finanziert wird die Sozialversicherung überwiegend durch **Beiträge**, meist ein Prozentsatz vom Bruttolohn; die aktuellen Sätze nennen die Versicherungsträger. Bei Kranken-, Pflege-, Renten- und Arbeitslosenversicherung zahlen Beschäftigte und Arbeitgeber die Beiträge in der Regel je zur Hälfte, Ausnahmen gibt es etwa bei Minijobs. Die Beiträge zur Unfallversicherung zahlt der Arbeitgeber allein. Wer trotzdem nicht genug zum Leben hat, bekommt die **Grundsicherung**: für Arbeitsuchende das Grundsicherungsgeld, früher Bürgergeld genannt, im Alter und bei Erwerbsminderung die Grundsicherung der Sozialhilfe. Sie zahlt der Staat aus Steuern, nicht aus Beiträgen, und sie ist an Bedürftigkeit geknüpft.",
    ],
    terms: [
      {
        term: "Sozialversicherung",
        text: "Die gesetzliche Pflichtversicherung gegen Krankheit, Pflegebedürftigkeit, Alter, Arbeitslosigkeit und Unfall.",
      },
      {
        term: "Versicherungspflicht",
        text: "Die gesetzliche Pflicht, sich zu versichern: Beschäftigte können nicht frei wählen, ob sie dabei sind.",
      },
      {
        term: "Sozialabgaben",
        text: "Die Beiträge zur Sozialversicherung, die als Prozentsatz vom Bruttolohn berechnet und vom Lohn abgezogen werden.",
      },
      {
        term: "Grundsicherung",
        text: "Staatliche Hilfe aus Steuern für Menschen, die ihren Lebensunterhalt nicht selbst bestreiten können: für Arbeitsuchende das Grundsicherungsgeld (SGB II), im Alter und bei Erwerbsminderung die Grundsicherung nach SGB XII.",
      },
    ],
    law: [
      {
        ref: "§ 249 SGB V und § 168 SGB VI",
        text: "Beschäftigte und ihre Arbeitgeber tragen die Beiträge zur Kranken- und zur Rentenversicherung grundsätzlich je zur Hälfte.",
        url: "https://www.gesetze-im-internet.de/sgb_5/__249.html",
      },
      {
        ref: "§ 150 SGB VII",
        text: "Beitragspflichtig in der gesetzlichen Unfallversicherung sind die Unternehmer, in deren Betrieb Versicherte tätig sind. Beschäftigte zahlen dafür keinen Beitrag.",
        url: "https://www.gesetze-im-internet.de/sgb_7/__150.html",
      },
    ],
    takeaway:
      "Die fünf Zweige der Sozialversicherung sichern Krankheit, Pflegebedürftigkeit, Alter, Arbeitslosigkeit und Unfälle ab. Beschäftigte sind pflichtversichert; die Beiträge zahlen Arbeitnehmer und Arbeitgeber meist je zur Hälfte, die Unfallversicherung allein der Arbeitgeber.",
    sourceIds: ["lp", "sgb5", "sgb6", "sgb7", "sgb11", "sgb3", "sgb2", "sgb12"],
    quiz: {
      question: "Wer zahlt in der Regel die Beiträge zur gesetzlichen Unfallversicherung?",
      answer: "Allein der Arbeitgeber; die Beschäftigten zahlen dafür keinen Beitrag.",
      wrong: [
        "Arbeitgeber und Beschäftigte je zur Hälfte, wie bei der Rentenversicherung.",
        "Allein die Beschäftigten, weil sie bei Arbeitsunfällen selbst betroffen sind.",
      ],
      explanation:
        "Die Unfallversicherung ist die Ausnahme: Beitragspflichtig sind die Unternehmer. Bei der Kranken-, Pflege-, Renten- und Arbeitslosenversicherung teilen sich Beschäftigte und Arbeitgeber die Beiträge dagegen in der Regel hälftig.",
    },
    practice: "sozialabgaben",
    workshop: {
      kind: "classify",
      title: "Welche Versicherung hilft?",
      instruction: "Ordne jede Situation der Versicherung zu, die zuständig ist.",
      categories: ["Krankenversicherung", "Pflegeversicherung", "Rentenversicherung", "Arbeitslosenversicherung"],
      entries: [
        {
          text: "Lisa bricht sich beim Skifahren in den Ferien das Bein und wird operiert.",
          target: 0,
          feedback: "Unfälle in der Freizeit bezahlt die Krankenversicherung.",
        },
        {
          text: "Frau Bauer ist 80 und braucht Hilfe beim Waschen und Anziehen; täglich kommt ein Pflegedienst.",
          target: 1,
          feedback: "Dauerhafte Hilfe im Alltag gehört zur Pflegeversicherung.",
        },
        {
          text: "Herr Demir geht nach 45 Berufsjahren in den Ruhestand und bekommt jeden Monat Geld.",
          target: 2,
          feedback: "Die Altersrente zahlt die Rentenversicherung.",
        },
        {
          text: "Tom hat seine Stelle verloren und bekommt während der Jobsuche monatlich Geld von der Agentur für Arbeit.",
          target: 3,
          feedback: "Das Arbeitslosengeld kommt aus der Arbeitslosenversicherung.",
        },
        {
          text: "Nach einem Schlaganfall kann Herr Wolf nicht mehr arbeiten und erhält eine Erwerbsminderungsrente.",
          target: 2,
          feedback: "Auch bei Erwerbsminderung zahlt die Rentenversicherung.",
        },
        {
          text: "Frau Kaya hat ihre Stelle verloren, und die Agentur für Arbeit bezahlt ihr eine Weiterbildung.",
          target: 3,
          feedback: "Die Arbeitslosenversicherung fördert auch die Weiterbildung.",
        },
      ],
      conclusion: "Jeder Zweig deckt ein eigenes Risiko ab; wichtig ist, die Ursache zu erkennen: Krankheit, Pflege, Alter oder Arbeitslosigkeit.",
    },
    casework: {
      title: "Maliks Fahrradsturz",
      story:
        "Malik (17) macht eine Ausbildung zum Elektroniker. Auf dem direkten Weg zum Ausbildungsbetrieb stürzt er mit dem Fahrrad und bricht sich den Arm. Nach der Ausbildung wird er nicht übernommen und ist **arbeitslos**.",
      steps: [
        {
          question: "Welche Versicherung ist für die Behandlung des Armbruchs zuständig?",
          options: [
            "Die Unfallversicherung, denn es war ein Wegeunfall auf dem Weg zur Ausbildung.",
            "Die Krankenversicherung, denn jede Verletzung zählt als Krankheit.",
            "Die Pflegeversicherung, denn Malik braucht vorübergehend Hilfe im Alltag.",
          ],
          answer: 0,
          explanation:
            "Der direkte Weg zur Ausbildung ist über die Unfallversicherung abgesichert. Die Krankenversicherung zahlt dagegen bei Unfällen in der Freizeit.",
        },
        {
          question: "Wer zahlt die Beiträge für diese Versicherung?",
          options: [
            "Der Ausbildungsbetrieb allein.",
            "Malik und sein Betrieb je zur Hälfte.",
            "Maliks Eltern als seine gesetzlichen Vertreter.",
          ],
          answer: 0,
          explanation: "In der Unfallversicherung sind die Unternehmer beitragspflichtig. Malik zahlt dafür nichts.",
        },
        {
          question: "Nach der Ausbildung ist Malik arbeitslos. Welche Leistung bekommt er zuerst, wenn er vorher lange genug versichert war?",
          options: [
            "Arbeitslosengeld aus der Arbeitslosenversicherung.",
            "Grundsicherung aus Steuermitteln.",
            "Eine Rente aus der Rentenversicherung.",
          ],
          answer: 0,
          explanation:
            "Malik hat in die Arbeitslosenversicherung eingezahlt und erwirbt daraus einen Anspruch. Die steuerfinanzierte Grundsicherung kommt erst, wenn das nicht reicht.",
        },
        {
          question: "Das Arbeitslosengeld läuft aus, und Malik hat noch keine Stelle und kein Geld zum Leben. Was gilt dann?",
          options: [
            "Er kann Grundsicherung beantragen, die der Staat bei Bedürftigkeit aus Steuern zahlt.",
            "Er bekommt weiter Arbeitslosengeld, weil Versicherungen unbegrenzt zahlen.",
            "Er ist auf Hilfe seines früheren Betriebs angewiesen, denn der Staat hilft nie.",
          ],
          answer: 0,
          explanation:
            "Versicherungsleistungen sind zeitlich begrenzt. Wer dann nicht genug zum Leben hat, bekommt Grundsicherung. Sie ist keine Versicherung, sondern wird bei Bedürftigkeit aus Steuern gezahlt.",
        },
      ],
      verdict:
        "Der Sturz auf dem Weg zur Ausbildung ist ein Wegeunfall: Die Unfallversicherung zahlt, und der Betrieb allein finanziert sie. Bei Arbeitslosigkeit hilft zuerst die Arbeitslosenversicherung, erst danach springt die steuerfinanzierte Grundsicherung ein.",
    },
    tasks: {
      1: {
        prompt:
          "Auf der Gehaltsabrechnung von Selin stehen Abzüge für Kranken-, Pflege-, Renten- und Arbeitslosenversicherung, aber keiner für die Unfallversicherung. Erkläre, wofür diese Beiträge sind und warum die Unfallversicherung fehlt.",
        hints: ["Wofür sorgt jede der vier Versicherungen?", "Wer zahlt die Beiträge zur Unfallversicherung?"],
        model:
          "Die Krankenversicherung bezahlt Behandlungen, die Pflegeversicherung Hilfe bei dauerhaftem Pflegebedarf, die Rentenversicherung die Rente im Alter oder bei Erwerbsminderung und die Arbeitslosenversicherung das Arbeitslosengeld. Diese Beiträge teilen sich Selin und ihr Arbeitgeber in der Regel je zur Hälfte, deshalb steht ihr Anteil auf der Abrechnung. Die Beiträge zur Unfallversicherung zahlt dagegen der Arbeitgeber allein. Selin zahlt dafür nichts, ist aber bei Arbeits- und Wegeunfällen trotzdem abgesichert.",
        criteria: [
          "Beschreibt die Aufgabe von mindestens drei Versicherungen richtig",
          "Erklärt die in der Regel hälftige Beitragsteilung bei den vier Versicherungen",
          "Begründet, dass der Arbeitgeber die Unfallversicherung allein zahlt",
        ],
      },
      2: {
        prompt:
          "Ein Freund sagt: „Ich möchte selbst entscheiden, ob ich mich versichere. Dann bleibt mir mehr netto.“ Beurteile, ob die Versicherungspflicht gerechtfertigt ist.",
        hints: ["Was geschieht, wenn jemand ohne Versicherung schwer krank wird?", "Was würde geschehen, wenn nur noch Menschen mit hohem Risiko versichert wären?"],
        model:
          "Mehr Netto klingt gut, aber wer sich nicht versichert, trägt ein großes Risiko: Eine schwere Krankheit oder ein Unfall kann Zehntausende Euro kosten. Wer das nicht bezahlen kann, müsste am Ende doch von der Allgemeinheit unterstützt werden. Blieben nur Menschen mit hohem Risiko versichert, würden die Beiträge stark steigen. Die Pflicht sorgt dafür, dass viele zahlen und das Risiko gemeinsam tragen. Ich halte sie deshalb für gerechtfertigt, auch wenn sie die Freiheit einschränkt, über das eigene Geld zu verfügen.",
        criteria: [
          "Nennt das Risiko ohne Versicherung",
          "Erklärt, warum die Pflicht das Risiko auf viele verteilt",
          "Wägt Freiheit und Sicherheit ab und kommt zu einem begründeten Urteil (jedes begründete Urteil ist gleichwertig)",
        ],
      },
    },
  },
  {
    id: "sm-solidar",
    lb: 2,
    unit: "2.2",
    title: "Solidarprinzip und Altersvorsorge",
    intro: "Starke tragen mehr, die Jungen zahlen für die Alten: Wo das Prinzip der Solidarität an Grenzen stößt.",
    paragraphs: [
      "Zwei Beschäftigte sind gesetzlich krankenversichert. Frau Brandt verdient viel, Herr Koch wenig. Frau Brandt zahlt einen höheren Beitrag, doch beide bekommen bei Krankheit dieselbe Behandlung. Kinder und Ehepartner ohne nennenswertes Einkommen sind sogar beitragsfrei mitversichert. Das ist das **Solidarprinzip**: Die Gemeinschaft trägt das Risiko gemeinsam, der Beitrag richtet sich nach der Leistungsfähigkeit (bis zu einer Obergrenze), die Leistung nach dem Bedarf, und die Starken tragen mehr. Das Gegenstück ist das **Äquivalenzprinzip**: Wer mehr Risiko mitbringt, zahlt mehr, und die Leistung entspricht dem Beitrag. Es prägt die Privatversicherung, teilweise auch die Rente: Wer mehr eingezahlt hat, bekommt später mehr.",
      "Auch die gesetzliche Rente beruht auf Solidarität zwischen den Generationen. Im **Umlageverfahren** zahlen die heutigen Beschäftigten mit ihren Beiträgen die Renten der heutigen Rentner. Wer einzahlt, erwirbt den Anspruch, später von der nächsten Generation versorgt zu werden: der **Generationenvertrag**, kein Vertrag im Rechtssinn. Doch der **demografische Wandel** verschiebt das Verhältnis: Die Menschen leben länger, es werden weniger Kinder geboren, und die geburtenstarken Jahrgänge gehen in Rente. Laut Vorausberechnung des Statistischen Bundesamts wird 2035 jede vierte Person mindestens 67 Jahre alt sein. Auf 100 Beitragszahler kommen dann mehr Rentner, und bei gleichem **Rentenniveau** (Rente im Vergleich zum Durchschnittslohn) müsste der Beitragssatz steigen. Das Modell unten rechnet das vor.",
      "Wie die Last verteilt werden soll, ist politisch umstritten. Die einen wollen das Rentenniveau halten und dafür höhere Beiträge oder mehr Steuergeld in Kauf nehmen. Andere setzen auf ein späteres Rentenalter oder ein niedrigeres Rentenniveau, um Beschäftigte zu entlasten. Wieder andere wollen mehr Beitragszahler, etwa durch die Einbeziehung weiterer Berufsgruppen, oder mehr **Kapitaldeckung**, bei der jeder selbst Geld für die eigene Rente anlegt. Jeder Weg hat Vorteile und Kosten, und wer ihn bevorzugt, hängt davon ab, ob man Beschäftigte, Rentner, Betriebe oder künftige Generationen stärker gewichtet. Irgendwann stößt jede Belastung an ihre **Grenze**.",
      "Unabhängig vom Streit raten viele Fachleute zur eigenen Vorsorge, damit die Rente im Alter nicht die einzige Einnahmequelle bleibt. Man spricht von **drei Schichten**: Die erste ist die Basisversorgung, vor allem die gesetzliche Rente. Die zweite bilden die betriebliche Altersvorsorge und geförderte private Verträge wie die Riester-Rente. Die dritte besteht aus weiterem Sparen und Anlegen ohne besondere Förderung, etwa in einem Fondssparplan. Wer früh beginnt, braucht jeden Monat weniger. Verbraucherzentralen und Stiftung Warentest informieren über Möglichkeiten und Kosten.",
    ],
    terms: [
      {
        term: "Solidarprinzip",
        text: "Die Gemeinschaft trägt ein Risiko gemeinsam: Der Beitrag richtet sich nach der Leistungsfähigkeit, die Leistung nach dem Bedarf.",
      },
      {
        term: "Äquivalenzprinzip",
        text: "Beitrag und Leistung entsprechen einander: Wer ein höheres Risiko hat oder mehr Leistung will, zahlt mehr. In der Rente bekommt, wer mehr einzahlt, mehr zurück.",
      },
      {
        term: "Umlageverfahren",
        text: "Die Renten werden aus den laufenden Beiträgen der heutigen Beschäftigten bezahlt, ergänzt durch Zuschüsse des Bundes.",
      },
      {
        term: "Demografischer Wandel",
        text: "Die Veränderung der Altersstruktur: Die Bevölkerung wird im Durchschnitt älter, und es gibt relativ weniger junge Menschen.",
      },
      {
        term: "Drei Schichten der Altersvorsorge",
        text: "Basisversorgung (vor allem die gesetzliche Rente), betriebliche Vorsorge und geförderte private Verträge sowie ungefördertes Sparen und Anlegen.",
      },
    ],
    law: [
      {
        ref: "§ 1 SGB V",
        text: "Die Krankenversicherung versteht sich als Solidargemeinschaft: Sie soll die Gesundheit der Versicherten erhalten, wiederherstellen oder bessern. Die Versicherten sind aber auch selbst für ihre Gesundheit mitverantwortlich.",
        url: "https://www.gesetze-im-internet.de/sgb_5/__1.html",
      },
      {
        ref: "§ 153 SGB VI",
        text: "In der Rentenversicherung werden die Ausgaben eines Jahres durch die Einnahmen desselben Jahres gedeckt (Umlageverfahren). Nur bei Bedarf wird die Nachhaltigkeitsrücklage angegriffen.",
        url: "https://www.gesetze-im-internet.de/sgb_6/__153.html",
      },
    ],
    takeaway:
      "Nach dem Solidarprinzip trägt die Gemeinschaft das Risiko und die Starken tragen mehr, nach dem Äquivalenzprinzip zahlt jeder für sein eigenes Risiko. Die Rente beruht auf dem Umlageverfahren, das durch den demografischen Wandel an Grenzen stößt; deshalb braucht es zusätzlich private und betriebliche Vorsorge.",
    sourceIds: ["lp", "sgb5", "sgb6", "destatis"],
    quiz: {
      question: "Was kennzeichnet das Solidarprinzip in der gesetzlichen Krankenversicherung?",
      answer: "Der Beitrag richtet sich nach dem Einkommen, die Leistung nach dem Bedarf der Kranken.",
      wrong: [
        "Der Beitrag richtet sich nach dem persönlichen Krankheitsrisiko, die Leistung nach der Beitragshöhe.",
        "Alle zahlen denselben Euro-Betrag, und Gutverdienende erhalten dafür bessere Leistungen.",
      ],
      explanation:
        "Beim Solidarprinzip zahlen Besserverdienende mehr, aber alle erhalten die Leistung, die sie brauchen. Risiko- und beitragsabhängige Leistungen sind das Äquivalenzprinzip der Privatversicherung.",
    },
    lab: "generationen",
    workshop: {
      kind: "classify",
      title: "Solidar- oder Äquivalenzprinzip?",
      instruction: "Entscheide bei jedem Fall, welches Prinzip dahintersteht.",
      categories: ["Solidarprinzip", "Äquivalenzprinzip"],
      entries: [
        {
          text: "Der Beitrag zur Krankenversicherung steigt mit dem Einkommen, die Behandlung hängt aber nur von der Krankheit ab.",
          target: 0,
          feedback: "Beitrag nach Leistungsfähigkeit, Leistung nach Bedarf: Solidarprinzip.",
        },
        {
          text: "Eine Autoversicherung verlangt von einem Fahranfänger mit hohem Unfallrisiko mehr Geld als von einer erfahrenen Fahrerin.",
          target: 1,
          feedback: "Der Beitrag richtet sich nach dem eigenen Risiko: Äquivalenzprinzip.",
        },
        {
          text: "Kinder sind in der gesetzlichen Krankenversicherung ohne eigenen Beitrag über ihre Eltern mitversichert.",
          target: 0,
          feedback: "Die Gemeinschaft trägt den Schutz der Kinder mit: Solidarprinzip.",
        },
        {
          text: "Wer sein Sammlerstück in einer privaten Versicherung höher versichert, zahlt einen höheren Beitrag und bekommt im Schaden mehr.",
          target: 1,
          feedback: "Beitrag und Leistung entsprechen sich: Äquivalenzprinzip.",
        },
        {
          text: "Wer in der Rentenversicherung über viele Jahre mit höherem Lohn einzahlt, erhält später in der Regel eine höhere Rente.",
          target: 1,
          feedback: "Die Rentenhöhe hängt von den eigenen Beiträgen ab: Äquivalenzprinzip.",
        },
        {
          text: "Wer nie krank wird, bekommt seine Beiträge nicht zurück; sie bezahlen die Behandlung anderer.",
          target: 0,
          feedback: "Die Gemeinschaft trägt das Risiko, nicht der Einzelne: Solidarprinzip.",
        },
      ],
      conclusion: "Die Sozialversicherung mischt beide Prinzipien, mit mehr Solidarität bei Krankheit und mehr Äquivalenz bei der Rentenhöhe.",
    },
    casework: {
      title: "Die Rentenrechnung von Nordmark",
      story:
        "Im erfundenen Land Nordmark zahlen 100 Beschäftigte Rentenbeiträge, und 40 Rentner bekommen eine Rente von **50 Prozent** des Durchschnittslohns. Im vereinfachten Lernmodell braucht man dafür einen Beitragssatz von **20 Prozent** (40 Rentner je 100 Beschäftigte mal 50 Prozent). Dreißig Jahre später kommen auf 100 Beschäftigte **60 Rentner**.",
      steps: [
        {
          question: "Wie wird die Rente in Nordmark finanziert?",
          options: [
            "Im Umlageverfahren: Die heutigen Beschäftigten zahlen mit ihren Beiträgen die heutigen Renten.",
            "Jeder spart auf einem eigenen Konto, aus dem später seine Rente kommt.",
            "Der Staat zahlt alle Renten allein aus Steuern, Beiträge gibt es nicht.",
          ],
          answer: 0,
          explanation:
            "Die Beiträge der Beschäftigten bezahlen die laufenden Renten. Ein eigenes Konto wäre Kapitaldeckung. Auch in Deutschland tragen vor allem Beiträge die Rente, ergänzt durch Zuschüsse des Bundes aus Steuern (etwa ein Fünftel bis ein Viertel der Einnahmen).",
        },
        {
          question: "Wie hoch müsste der Beitragssatz bei 60 Rentnern je 100 Beschäftigten sein, wenn die Rente bei 50 Prozent bleibt?",
          options: [
            "30 Prozent, denn 60 Rentner je 100 Beschäftigte mal 50 Prozent ergeben 30 Prozent.",
            "20 Prozent, denn der Beitragssatz hängt nur vom Rentenniveau ab.",
            "10 Prozent, denn mehr Rentner teilen sich die Kosten.",
          ],
          answer: 0,
          explanation:
            "Mehr Rentner je Beschäftigte bedeuten höhere Kosten pro Beitragszahler: 0,6 mal 50 Prozent sind 30 Prozent. Die Anzahl der Rentner zählt also mit.",
        },
        {
          question: "Welche Grenze der Belastbarkeit zeigt das Beispiel?",
          options: [
            "Steigen die Beiträge immer weiter, bleibt Beschäftigten weniger netto, und Arbeit wird für Betriebe teurer.",
            "Rentner können nicht mehr als 50 Prozent des Durchschnittslohns beziehen, weil das Gesetz es verbietet.",
            "Der Staat darf keine Zuschüsse zahlen, weil Renten nur aus Beiträgen bestehen dürfen.",
          ],
          answer: 0,
          explanation:
            "Wer die Last allein über Beiträge verteilt, belastet Beschäftigte und Betriebe immer stärker. Auch Zuschüsse und Kürzungen haben Grenzen, deshalb wird über die richtige Mischung gestritten.",
        },
      ],
      verdict:
        "Im Umlageverfahren zahlen die Jüngeren die Renten der Älteren. Kommen mehr Rentner auf 100 Beschäftigte, muss bei gleichem Rentenniveau der Beitragssatz steigen. Weil die Belastung der Beschäftigten Grenzen hat, ergänzen viele die gesetzliche Rente durch eigene Vorsorge.",
    },
    tasks: {
      1: {
        prompt: "Erkläre das Umlageverfahren der gesetzlichen Rente und begründe, warum man vom „Generationenvertrag“ spricht.",
        hints: ["Wer zahlt heute die Renten, und woher kommt das Geld?", "Warum hängt die eigene Rente später von der nächsten Generation ab?"],
        model:
          "Im Umlageverfahren werden die Renten nicht aus angespartem Geld bezahlt, sondern aus den laufenden Beiträgen der heutigen Beschäftigten, ergänzt durch Zuschüsse des Bundes. Wer heute einzahlt, finanziert also die Renten der Älteren. Später ist er selbst darauf angewiesen, dass die nächste Generation einzahlt. Man spricht vom Generationenvertrag, weil Jung und Alt sich gegenseitig versprechen, füreinander einzustehen, auch wenn es kein Vertrag im Rechtssinn ist.",
        criteria: [
          "Beschreibt, woher das Geld für die laufenden Renten kommt",
          "Erklärt die Abhängigkeit der Generationen voneinander",
          "Erklärt den Begriff Generationenvertrag",
        ],
      },
      2: {
        prompt:
          "Um die Rente langfristig zu sichern, werden unter anderem ein späteres Rentenalter, höhere Beiträge oder ein niedrigeres Rentenniveau diskutiert. Wähle einen Vorschlag, nenne Vor- und Nachteil und erkläre, wen er belastet. Entscheide dann, ob du zusätzliche eigene Vorsorge für nötig hältst.",
        hints: ["Wer würde bei deinem Vorschlag mehr zahlen oder weniger bekommen?", "Was sagt der demografische Wandel über die gesetzliche Rente in einigen Jahrzehnten?"],
        model:
          "Ein späteres Rentenalter entlastet die Rentenkasse, weil Menschen länger einzahlen und kürzer Rente beziehen. Nachteil ist, dass vor allem Menschen mit körperlich schwerer Arbeit kaum länger durchhalten und die Älteren die Last tragen. Höhere Beiträge würden dagegen Beschäftigte und Betriebe belasten, ein niedrigeres Rentenniveau die Rentner. Ich halte es für sinnvoll, zusätzlich privat oder betrieblich vorzusorgen, denn wie auch immer die Last verteilt wird, möchte ich im Alter nicht von einer einzigen Einnahmequelle abhängen.",
        criteria: [
          "Nennt Vor- und Nachteil des gewählten Vorschlags",
          "Beschreibt, welche Gruppe belastet wird",
          "Begründet ein Urteil zur eigenen Vorsorge (jedes begründete Urteil ist gleichwertig)",
        ],
      },
    },
  },
];
