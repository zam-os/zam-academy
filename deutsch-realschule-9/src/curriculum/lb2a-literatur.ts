import type { Lesson } from "../model/types";

/** Lernbereich 2, erster Teil: Lesetechniken und literarische Texte (2.1 und 2.2). */
export const LB2A: Lesson[] = [
  {
    id: "de-lesestrategien",
    lb: 2,
    unit: "2.1",
    covers: ["2.1.1"],
    title: "Lesetechniken und Lesestrategien flexibel einsetzen",
    intro:
      "Nicht jeder Text will gleich gelesen werden. Du wählst die Technik nach deinem Ziel und nach den Anforderungen des Textes.",
    paragraphs: [
      "Bevor du liest, frage dich: **Warum lese ich diesen Text?** Dieses Ziel heißt **Leseintention**. Willst du wissen, ob ein Artikel zu deinem Referatsthema passt? Suchst du eine Uhrzeit im Fahrplan? Oder musst du verstehen, wie jemand argumentiert? Je nach Ziel brauchst du eine andere Technik. Beim **orientierenden Lesen**, auch überfliegendes Lesen genannt, verschaffst du dir einen Überblick: Du siehst dir Überschrift, Zwischenüberschriften, Bilder und Fettgedrucktes an und fragst: Worum geht es? Beim **selektiven Lesen** suchst du gezielt eine Information und folgst dabei Schlüsselwörtern und der Gliederung; nur an der Fundstelle liest du genau. Beim **genauen Lesen** gehst du Satz für Satz vor, bis du Inhalt und Aussage verstanden hast. Gute Leserinnen und Leser wechseln zwischen diesen Techniken, je nachdem, was sie vom Text wollen. Manche Bücher nennen auch die gezielte Suche „orientierendes Lesen“. Achte deshalb darauf, ob ein Überblick oder eine gezielte Suche gemeint ist.",
      "Für anspruchsvolle Texte hilft dir die **Fünf-Schritt-Lesemethode**. Sie lehnt sich an die SQ3R-Methode an, die Francis P. Robinson in seinem Buch „Effective Study“ (1946) beschrieben hat. **Erstens** verschaffst du dir einen Überblick über Titel, Zwischenüberschriften und Bilder. **Zweitens** stellst du Fragen an den Text, zum Beispiel: Was will der Text erklären? **Drittens** liest du abschnittsweise genau und markierst Schlüsselwörter. **Viertens** gibst du jeden Abschnitt mit eigenen Worten wieder, ohne hinzusehen. **Fünftens** blickst du zurück: Hast du deine Fragen beantwortet? Was ist die Kernaussage? Die Schritte brauchen Zeit, aber du behältst mehr, weil du aktiv mit dem Text arbeitest.",
      "Vor dem Lesen aktivierst du dein **Vorwissen**: Was weiß ich schon über das Thema? Was erwarte ich nach Titel und Bild? So kannst du Neues einordnen und merkst, wenn der Text etwas anderes sagt. Beim Lesen **klärst du Unklares**, statt darüber hinwegzulesen. Ein unbekanntes Wort versuchst du aus dem Satz zu erschließen und schlägst es im Zweifel nach, zum Beispiel im DWDS. Einen schwierigen Satz liest du noch einmal langsamer; manchmal hilft es, ihn in zwei kürzere Sätze zu zerlegen. Auch der Text bestimmt mit, wie du liest: Je dichter er ist, etwa durch viele Fachwörter oder durch Andeutungen in einer Erzählung, desto langsamer und genauer musst du lesen.",
      "Lesen ist auch eine Sache des Austauschs. Nach dem Lesen vergleichst du mit einer Partnerin oder einem Partner, was ihr verstanden habt: Was ist die Kernaussage? Welche Technik hat geholfen? Wo habt ihr gestockt? Aus Klasse 8 kennst du das **reziproke Lesen**: Ihr lest abschnittsweise und wechselt euch in vier Aufgaben ab, nämlich zusammenfassen, Fragen stellen, Unklares klären und vorhersagen, wie es weitergeht. Solche Gespräche zeigen dir, dass zwei Menschen denselben Text unterschiedlich lesen können. Sie helfen dir außerdem, deine eigene Technik zu verbessern. Halte am Ende fest, was du beim nächsten Mal wieder oder anders machst.",
    ],
    terms: [
      {
        term: "Leseintention",
        text: "Das Ziel, mit dem du einen Text liest, zum Beispiel etwas suchen, verstehen oder dich informieren.",
      },
      {
        term: "Orientierendes Lesen",
        text: "Schnelles Ansehen von Überschriften, Bildern und Hervorhebungen, um einen Überblick zu bekommen; auch überfliegendes Lesen genannt.",
      },
      {
        term: "Selektives Lesen",
        text: "Gezieltes Suchen einer Information mithilfe von Schlüsselwörtern und Gliederung; nur die Fundstelle wird genau gelesen.",
      },
      {
        term: "Genaues Lesen",
        text: "Langsames, abschnittsweises Lesen, bis Inhalt und Aussage verstanden und Unklares geklärt sind.",
      },
      {
        term: "Fünf-Schritt-Lesemethode",
        text: "Eine Lesemethode in fünf Schritten: Überblick, Fragen, genaues Lesen, mit eigenen Worten wiedergeben, Rückblick.",
      },
      {
        term: "Vorwissen",
        text: "Das, was du schon über ein Thema weißt und womit du Neues aus dem Text verknüpfst.",
      },
    ],
    examples: [
      {
        title: "Die fünf Schritte an einem Zeitungsartikel (eigens verfasst)",
        text: "Artikel: „Warum sich Mehrwegbecher lohnen“\n1. Überblick: Titel, drei Zwischenüberschriften, ein Foto von Bechern\n2. Frage: Welche Vorteile nennt der Text, und wer bekommt das Pfand zurück?\n3. Genau lesen: „Pfandsystem“ markiert und aus dem Satz erschlossen: Geld, das man zurückbekommt\n4. Eigene Worte: Einwegbecher erzeugen viel Müll, Mehrwegbecher werden immer wieder benutzt.\n5. Rückblick: Beide Fragen beantwortet. Kernaussage: Mehrweg spart Müll.",
        analysis:
          "Die Notizen zeigen alle fünf Schritte: Zuerst steht ein **Überblick**, dann eine **Frage** an den Text. Beim genauen Lesen wird ein unbekanntes Wort geklärt. Danach gibt die Leserin den Inhalt mit **eigenen Worten** wieder und prüft im **Rückblick**, ob ihre Fragen beantwortet sind. So entsteht aus dem Lesen ein Ergebnis, über das du dich mit anderen austauschen kannst.",
      },
    ],
    takeaway:
      "Das Ziel bestimmt die Technik: orientierendes Lesen für den Überblick, selektives Lesen für die gezielte Suche, genaues Lesen zum Verstehen. Bei schwierigen Texten helfen die fünf Schritte, dein Vorwissen und das Klären von Unklarem. Danach tauschst du dich über deine Ergebnisse aus.",
    sourceIds: ["lp", "palincsar"],
    quiz: {
      question: "Du suchst in einem langen Zeitungsartikel nur die Uhrzeit, zu der ein Konzert beginnt. Wie liest du?",
      answer: "Ich suche mit Schlüsselwörtern gezielt die Stelle und lese nur dort genau.",
      wrong: [
        "Ich lese den ganzen Artikel Satz für Satz, damit mir nichts entgeht.",
        "Ich sehe mir nur Überschrift und Bilder an und rate die Uhrzeit.",
      ],
      explanation:
        "Wer nur eine bestimmte Information braucht, liest selektiv: Schlüsselwörter führen zur Stelle. Den ganzen Artikel genau zu lesen kostet Zeit, die das Ziel nicht verlangt. Überschrift und Bilder allein liefern keine Uhrzeit, die im Text steht.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Lesetechnik passt?",
      instruction:
        "Lies jede Situation und ordne sie der Lesetechnik zu, die zum Ziel passt. Hier gilt: Orientierendes Lesen verschafft einen Überblick, selektives Lesen sucht gezielt eine Information.",
      categories: ["Orientierendes Lesen", "Selektives Lesen", "Genaues Lesen"],
      entries: [
        {
          text: "Du bekommst einen langen Artikel für ein Referat und willst in einer Minute wissen, ob er zu deinem Thema passt.",
          target: 0,
          feedback: "Du brauchst nur einen ersten Überblick: Überschrift, Bilder und Zwischenüberschriften genügen.",
        },
        {
          text: "Im Fahrplan suchst du nur die Abfahrtszeit des Busses nach Neustadt und übergehst alles andere.",
          target: 1,
          feedback: "Du suchst eine einzelne Information und folgst Schlüsselwörtern; nur die Fundstelle liest du genau.",
        },
        {
          text: "Für die Klassenarbeit musst du erklären, mit welchen Argumenten ein Kommentar überzeugen will.",
          target: 2,
          feedback: "Du willst Aussage und Aufbau verstehen und prüfen, deshalb liest du Satz für Satz und notierst.",
        },
        {
          text: "Du blätterst durch ein Schulbuchkapitel und siehst dir Überschriften und Abbildungen an, um zu erkennen, worum es geht.",
          target: 0,
          feedback: "Du sammelst erste Eindrücke aus Überschriften und Bildern, ohne ganze Sätze zu lesen.",
        },
        {
          text: "In der Gebrauchsanweisung suchst du nur die Stelle, an der steht, wie du das Gerät zurücksetzt.",
          target: 1,
          feedback: "Auch hier suchst du gezielt eine einzige Information und liest nur diese Stelle genau.",
        },
        {
          text: "Du liest eine Kurzgeschichte und willst verstehen, warum die Hauptfigur am Ende so handelt.",
          target: 2,
          feedback: "Um Gründe und Zusammenhänge zu verstehen, liest du genau und klärst Unklares.",
        },
      ],
      conclusion:
        "Das Ziel bestimmt die Technik: Überblick, gezielte Suche oder Verstehen. Wer gut liest, wechselt je nach Ziel zwischen den Techniken.",
    },
    casework: {
      title: "Ein Zeitungsartikel über ein Reparatur-Café",
      story:
        "Jonas soll im Deutschunterricht in zwanzig Minuten einen Zeitungsartikel über ein **Reparatur-Café** lesen und der Klasse danach erklären, was dort passiert. Der Artikel hat **vier Spalten, drei Zwischenüberschriften und ein Bild**. Im Text steht der Satz: **„Ehrenamtliche helfen beim Reparieren und verlangen kein Geld.“** Das Wort „Ehrenamtliche“ kennt Jonas nicht genau.",
      steps: [
        {
          question: "Was tut Jonas als Erstes?",
          options: [
            "Er verschafft sich einen Überblick über Überschrift, Zwischenüberschriften und Bild.",
            "Er liest sofort den ersten Satz und hört erst am Ende des Artikels auf zu lesen.",
            "Er sucht nur das Wort „Reparatur“ und liest dort genau.",
          ],
          answer: 0,
          explanation:
            "Vor dem genauen Lesen steht der Überblick. Er zeigt, worum es geht, und hilft Jonas, Fragen zu stellen. Nur ein Wort zu suchen reicht nicht, denn er soll später erklären, was im Café passiert.",
        },
        {
          question: "Welche Frage an den Text passt zu seinem Ziel?",
          options: [
            "Wer hilft dort wem, und wie läuft ein Besuch ab?",
            "Welche Zeitung hat den Artikel gedruckt, und wie lange gibt es sie?",
            "Wie viele Menschen leben in der Stadt, in der das Café steht?",
          ],
          answer: 0,
          explanation:
            "Jonas will später erklären, was im Café passiert. Deshalb fragt er nach den Beteiligten und dem Ablauf. Die anderen Fragen betreffen Nebensachen, die dafür nichts beitragen.",
        },
        {
          question: "Wie klärt Jonas das Wort „Ehrenamtliche“?",
          options: [
            "Er liest weiter und lässt das Wort einfach aus, weil es für den Rest nicht wichtig scheint.",
            "Er erschließt die Bedeutung aus dem Satz und schlägt sie bei Bedarf nach.",
            "Er bricht ab und sucht sich einen leichteren Text, weil er das Wort nicht kennt.",
          ],
          answer: 1,
          explanation:
            "Der Satz verrät: Sie helfen und verlangen kein Geld. Daraus kann Jonas die Bedeutung erschließen und im Zweifel nachschlagen. Unklares einfach zu überspringen oder aufzugeben hilft nicht beim Verstehen.",
        },
        {
          question: "Nach dem Lesen vergleicht Jonas seine Notizen mit denen von Aylin. Wozu ist das nützlich?",
          options: [
            "Sie sehen, ob sie dieselbe Kernaussage verstanden haben, und klären Unterschiede.",
            "Sie suchen den besseren der beiden Zettel heraus und behalten künftig nur noch diesen einen.",
            "Sie sparen Zeit, weil künftig nur noch einer von beiden lesen muss.",
          ],
          answer: 0,
          explanation:
            "Der Austausch zeigt, wo sich das Verständnis unterscheidet, und hilft, Missverständnisse zu klären. Es geht nicht darum, einen Zettel zu bewerten oder Arbeit zu verteilen.",
        },
      ],
      verdict:
        "Jonas verschafft sich zuerst einen Überblick, stellt eine Frage, liest genau und klärt dabei Unklares. Danach tauscht er sich aus. So passt seine Technik zu seinem Ziel, dem Erklären.",
    },
    tasks: {
      1: {
        prompt:
          "Du sollst einen Zeitungsartikel über ein neues Jugendzentrum lesen und danach der Klasse davon berichten. Beschreibe in vier bis fünf Sätzen, welche Lesetechniken du in welcher Reihenfolge einsetzt.",
        hints: [
          "Beginne mit der Technik für den Überblick und nenne, worauf du dabei achtest.",
          "Nenne mindestens eine Stelle, an der du Unklares klärst, und sage, wie du es tust.",
        ],
        model:
          "Zuerst lese ich orientierend: Ich sehe mir Überschrift, Zwischenüberschriften und Bild an, um zu wissen, worum es geht. Dann stelle ich eine Frage, die ich mit dem Text beantworten will, zum Beispiel: Wer darf das Jugendzentrum nutzen, und was wird dort angeboten? Danach lese ich genau, Abschnitt für Abschnitt, weil ich den Inhalt verstehen und der Klasse erklären will, und markiere Schlüsselwörter. Unbekannte Wörter erschließe ich aus dem Satz und schlage sie sonst nach. Zum Schluss gebe ich die Kernaussage mit eigenen Worten wieder und prüfe, ob meine Frage beantwortet ist.",
        criteria: [
          "Nennt mindestens zwei Lesetechniken mit ihrem Fachbegriff.",
          "Ordnet jeder Technik ein Ziel zu.",
          "Beschreibt, wie Unklares geklärt wird.",
        ],
      },
      2: {
        prompt:
          "Du liest mit einer Mitschülerin oder einem Mitschüler einen schwierigen Sachtext. Entwirf für das Gespräch danach einen Leitfaden mit vier Fragen und begründe zu jeder Frage in einem Satz, wozu sie dient.",
        hints: [
          "Eine Frage prüft, ob ihr dieselbe Kernaussage verstanden habt.",
          "Eine andere Frage betrifft die Technik: Was hat euch beim Verstehen geholfen oder gebremst?",
        ],
        model:
          "1. Was ist die Kernaussage des Textes in einem Satz? So sehen wir, ob wir dasselbe verstanden haben. 2. Welche Stelle war am schwersten, und wie haben wir sie geklärt? So erkennen wir Unklares und gute Lösungen. 3. Welche Technik hat uns geholfen: Überblick, Fragen oder Zusammenfassen? So lernen wir, was zu schwierigen Texten passt. 4. Was machen wir beim nächsten Text anders? So halten wir fest, was wir verbessern wollen.",
        criteria: [
          "Enthält vier Fragen zu Inhalt oder Lesetechnik.",
          "Begründet zu jeder Frage ihren Zweck.",
          "Bezieht mindestens eine Frage auf das Klären von Unklarem.",
        ],
      },
    },
  },
  {
    id: "de-texterschliessung",
    lb: 2,
    unit: "2.1",
    covers: ["2.1.2"],
    title: "Texte erschließen: Fragen, Bezüge, Belege und Skizzen",
    intro:
      "Wer einen Text erschließt, arbeitet mit ihm. Du stellst Fragen, hältst Zusammenhänge fest und prüfst Aussagen am Wortlaut.",
    paragraphs: [
      "Einen Text zu **erschließen** heißt, ihn Schritt für Schritt zu verstehen. Dafür helfen dir vier Verfahren. Erstens leitest du **Fragen aus dem Text ab** und beantwortest sie: Aus einer Überschrift wie „Trainer dringend gesucht“ wird die Frage: Warum fehlen Trainer? Zweitens stellst du **Bezüge zwischen den Textteilen** her: Ein Wort wie „deshalb“ verweist auf einen Grund weiter vorn, und ein Schlussabsatz greift oft die Einleitung wieder auf. Drittens **erklärst du Aussagen mit eigenen Worten**. Das gelingt nur, wenn du sie wirklich verstanden hast. Viertens **prüfst du Aussagen am Text**: Du suchst die Stelle, die eine Behauptung belegt oder widerlegt, und gibst sie als Zitat oder mit einer Zeilenangabe an.",
      "Dazu kommen Techniken, die Ordnung schaffen. Mit **Symbolen** markierst du am Rand, was du gefunden hast, zum Beispiel ein Ausrufezeichen für Wichtiges, ein Fragezeichen für Unklares und einen Pfeil für eine Folge. Welche Zeichen du nimmst, ist deine Sache; wichtig ist, dass du sie immer gleich benutzt. Ein **Beziehungsgeflecht** skizzierst du, wenn viele Personen oder Begriffe zusammenhängen: Du schreibst sie in Kästchen und beschriftest die Pfeile mit der Beziehung, etwa „bedroht“ oder „verursacht“. Eine **Gliederung** entsteht, wenn du den Text in Sinnabschnitte teilst und jedem eine kurze Überschrift gibst. So siehst du den Aufbau auf einen Blick.",
      "Warum der Aufwand? Deine Ergebnisse sind die Grundlage für ein Gespräch und für deine eigene Meinung. Wer belegen kann, was im Text steht, diskutiert genauer: „Der Text behauptet, dass …“ ist etwas anderes als „Ich finde, dass …“. Trenne beides bewusst. Zuerst hältst du fest, was der Text sagt, dann beurteilst du es. Dabei darfst du zu einem anderen Ergebnis kommen als eine Mitschülerin oder ein Mitschüler, solange du es am Text begründen kannst. Texterschließung ist also kein Selbstzweck: Sie macht dich in Diskussionen sicherer.",
    ],
    terms: [
      {
        term: "Texterschließung",
        text: "Das schrittweise Verstehen eines Textes mit Fragen, Bezügen, eigenen Worten und Belegen.",
      },
      {
        term: "Textbeleg",
        text: "Eine Stelle im Text, mit der du eine Aussage nachweist, als Zitat oder mit Zeilenangabe.",
      },
      {
        term: "Paraphrase",
        text: "Eine Textaussage mit eigenen Worten wiedergeben, ohne den Sinn zu verändern.",
      },
      {
        term: "Beziehungsgeflecht",
        text: "Eine Skizze aus Kästchen und beschrifteten Pfeilen, die zeigt, wie Personen oder Begriffe zusammenhängen.",
      },
      {
        term: "Gliederung",
        text: "Die Einteilung eines Textes in Sinnabschnitte, die jeweils eine eigene Überschrift erhalten.",
      },
    ],
    examples: [
      {
        title: "Ein Absatz und seine Erschließung (eigens verfasst)",
        text: "Viele Vereine in Neustadt suchen Trainer. Deshalb startet die Stadt ein Programm: Jugendliche ab 15 Jahren werden zu Übungsleitern ausgebildet. Die Stadt bezahlt den Kurs, die Vereine versprechen dafür eine Stelle.",
        analysis:
          "Eine **Frage aus dem Text**: Warum startet die Stadt das Programm? Der **Bezug**: „Deshalb“ verweist auf den Satz davor, in dem steht, dass Trainer fehlen. Das ist der Grund. **Mit eigenen Worten**: Weil Trainer fehlen, bildet die Stadt Jugendliche aus. **Am Text geprüft**: Die Aussage „Der Kurs kostet die Jugendlichen nichts“ stimmt, denn der Text sagt, dass die Stadt den Kurs bezahlt.",
      },
    ],
    takeaway:
      "Du erschließt einen Text mit Fragen, Bezügen, eigenen Worten und Belegen. Symbole, Skizzen und Gliederungen schaffen Ordnung. Halte erst fest, was der Text sagt, und beurteile es danach, denn nur so ist deine Meinung am Text begründet.",
    sourceIds: ["lp"],
    quiz: {
      question: "Ein Mitschüler behauptet: „Der Autor lehnt Handys im Unterricht ganz ab.“ Wie prüfst du das?",
      answer: "Ich suche die Stelle im Text, die das belegt oder widerlegt, und zitiere sie.",
      wrong: [
        "Ich frage ihn, woher er das weiß, und glaube ihm, wenn er überzeugt klingt.",
        "Ich überlege, ob ich selbst Handys im Unterricht erlauben würde.",
      ],
      explanation:
        "Eine Aussage über einen Text prüfst du am Text selbst. Ob jemand überzeugt klingt, sagt nichts darüber, ob es stimmt, und deine eigene Meinung zu Handys beantwortet nicht, was der Autor geschrieben hat.",
    },
    workshop: {
      kind: "classify",
      title: "Welches Verfahren ist das?",
      instruction:
        "Ordne jede Handlung dem Verfahren der Texterschließung zu, das sie beschreibt: Fragen ableiten, Bezüge herstellen, mit eigenen Worten erklären oder am Text überprüfen.",
      categories: ["Fragen ableiten", "Bezüge herstellen", "Mit eigenen Worten erklären", "Am Text überprüfen"],
      entries: [
        {
          text: "Zur Überschrift eines Absatzes schreibst du zwei W-Fragen auf und liest dann, um sie zu beantworten.",
          target: 0,
          feedback: "Du leitest Fragen aus dem Text ab und suchst beim Lesen ihre Antworten.",
        },
        {
          text: "Du erkennst, dass „deshalb“ im dritten Absatz auf einen Grund im zweiten Absatz zurückweist.",
          target: 1,
          feedback: "Ein Verweiswort verbindet zwei Textteile: Du stellst den Bezug zwischen ihnen her.",
        },
        {
          text: "Du erklärst deiner Banknachbarin die Kernaussage eines Absatzes, ohne Sätze aus dem Text zu übernehmen.",
          target: 2,
          feedback: "Du gibst die Aussage mit eigenen Worten wieder und zeigst damit, dass du sie verstanden hast.",
        },
        {
          text: "Eine Mitschülerin behauptet, die Autorin sei gegen Hausaufgaben. Du suchst die Stelle, die das beweist oder widerlegt.",
          target: 3,
          feedback: "Du prüfst eine Aussage an einer Textstelle und gibst sie als Beleg an.",
        },
        {
          text: "Du stellst fest, dass der Schlussabsatz das Beispiel aus der Einleitung wieder aufgreift und zu Ende führt.",
          target: 1,
          feedback: "Einleitung und Schluss gehören zusammen: Du hast einen Bezug zwischen zwei Textteilen erkannt.",
        },
        {
          text: "Du formulierst einen schwierigen Satz so um, dass ihn dein kleiner Bruder versteht.",
          target: 2,
          feedback: "Das Umformulieren in einfache eigene Worte ist eine Paraphrase.",
        },
      ],
      conclusion:
        "Vier Verfahren, vier Blickrichtungen: Fragen lenken das Lesen, Bezüge zeigen den Zusammenhang, eigene Worte beweisen Verständnis, und Belege sichern ab, was du behauptest.",
    },
    casework: {
      title: "Ein Blogbeitrag und eine Behauptung",
      story:
        "Im Schulblog steht ein Kommentar: **„Die Stadtbibliothek soll sonntags öffnen. Bisher kam sonntags niemand, weil die Bibliothek geschlossen war. Eine Umfrage unter 200 Jugendlichen zeigt aber: 140 würden sonntags zum Lernen kommen. Deshalb sollte die Stadt den Versuch wagen.“** Jonas sagt: „Der Text beweist, dass sonntags 140 Jugendliche in die Bibliothek gehen.“",
      steps: [
        {
          question: "Stimmt Jonas’ Behauptung, wenn du sie am Text prüfst?",
          options: [
            "Nein: Der Text sagt nur, dass 140 Jugendliche kommen würden, nicht dass sie es tun.",
            "Ja, denn der Text nennt die Zahl 140 als Ergebnis einer Umfrage unter 200 Jugendlichen.",
            "Das lässt sich am Text nicht prüfen, weil man dafür die Umfrage selbst kennen müsste.",
          ],
          answer: 0,
          explanation:
            "Im Text steht „würden … kommen“, also eine Möglichkeit und keine Tatsache. Eine Umfrage zeigt, was Menschen sagen, nicht, was sie tun. Das lässt sich sehr wohl am Wortlaut prüfen.",
        },
        {
          question: "Worauf bezieht sich „Deshalb“ im letzten Satz?",
          options: [
            "Auf das Umfrageergebnis davor: Es ist der Grund für die Forderung.",
            "Nur auf den ersten Satz über die Öffnung der Bibliothek am Sonntag.",
            "Auf die Zahl 200 allein, denn sie steht im Satz direkt davor.",
          ],
          answer: 0,
          explanation:
            "„Deshalb“ verweist auf das, was unmittelbar davor steht: Weil 140 von 200 kommen würden, soll die Stadt den Versuch wagen.",
        },
        {
          question: "Welche Gliederung gibt den Aufbau des Textes in seiner Reihenfolge wieder?",
          options: [
            "Forderung, Ausgangslage, Beleg durch die Umfrage, Schlussfolgerung",
            "Beleg durch die Umfrage, Forderung, Ausgangslage, Schlussfolgerung",
            "Ausgangslage, Schlussfolgerung, Forderung, Beleg durch die Umfrage",
          ],
          answer: 0,
          explanation:
            "Der Text beginnt mit der Forderung, nennt dann die Ausgangslage, stützt sich auf die Umfrage und endet mit der Schlussfolgerung. Die anderen Gliederungen ändern die Reihenfolge.",
        },
        {
          question: "Welcher Satz gibt die Textaussage wieder und nicht eine eigene Meinung?",
          options: [
            "Der Text fordert einen Versuch, weil laut Umfrage viele Jugendliche sonntags kommen würden.",
            "Ich finde, die Bibliothek sollte sonntags öffnen, weil das Lernen dort für alle leichter wird.",
            "Die Umfrage ist bestimmt zugunsten der Bibliothek ausgefallen.",
          ],
          answer: 0,
          explanation:
            "Der erste Satz hält fest, was im Text steht, und gibt es mit eigenen Worten wieder. Die anderen beiden Sätze enthalten eine Meinung oder eine Vermutung, die der Text nicht belegt.",
        },
      ],
      verdict:
        "Jonas hat zu viel aus dem Text gelesen. Wer Aussagen am Wortlaut prüft, Bezüge beachtet und die Textaussage von der eigenen Meinung trennt, bleibt genau.",
    },
    tasks: {
      1: {
        prompt:
          "Lies diesen Absatz: „Immer mehr Schulen führen eine Ruhezone ein. Dort darf man nicht reden und kein Handy benutzen. Deshalb sinkt der Lärm im Gebäude, und viele Schülerinnen und Schüler berichten von weniger Stress.“ Formuliere eine Frage an den Text, beantworte sie mit eigenen Worten und gib einen Beleg an.",
        hints: [
          "Eine gute Frage beginnt mit „Warum“ oder „Wie“ und lässt sich nur mit dem Text beantworten.",
          "Ein Beleg ist ein Zitat oder die Angabe des Satzes, in dem die Antwort steht.",
        ],
        model:
          "Frage: Warum sinkt der Lärm in Schulen mit Ruhezone? Antwort mit eigenen Worten: Dort ist Reden und Handynutzung untersagt, also wird es leiser, und das entlastet die Schülerinnen und Schüler. Beleg: Im dritten Satz steht „Deshalb sinkt der Lärm im Gebäude“. Das Wort „Deshalb“ bezieht sich auf die Regel im zweiten Satz, dass man nicht reden und kein Handy benutzen darf.",
        criteria: [
          "Stellt eine Frage, die der Text beantwortet.",
          "Beantwortet sie mit eigenen Worten.",
          "Gibt einen Beleg aus dem Text an.",
        ],
      },
      2: {
        prompt:
          "Du sollst einen Zeitungsartikel zur Frage lesen, ob Hausaufgaben abgeschafft werden sollten, und danach in der Klasse Stellung nehmen. Beschreibe in fünf bis sechs Sätzen, welche Verfahren und Techniken du anwendest und wie du aus den Ergebnissen deine Meinung entwickelst.",
        hints: [
          "Nenne mindestens zwei Verfahren, zum Beispiel Fragen ableiten und Belege suchen, und eine organisierende Technik.",
          "Trenne, was der Text sagt, von dem, was du selbst meinst.",
        ],
        model:
          "Zuerst gliedere ich den Artikel in Sinnabschnitte und gebe jedem eine Überschrift, so erkenne ich den Aufbau. Aus der Überschrift leite ich die Frage ab: Welche Gründe nennt der Autor für und gegen Hausaufgaben? Wichtige Argumente markiere ich mit einem Ausrufezeichen, Unklares mit einem Fragezeichen. Jede Behauptung, die ich später nennen will, belege ich mit einer Textstelle. Dann fasse ich die Argumente mit eigenen Worten zusammen. Erst danach überlege ich, welche überzeugen, und notiere meine Meinung getrennt von der Textaussage, damit ich sie in der Diskussion begründen kann.",
        criteria: [
          "Nennt mindestens zwei Verfahren der Texterschließung.",
          "Nennt eine organisierende Technik wie Symbole, Skizze oder Gliederung.",
          "Trennt die Textaussage von der eigenen Meinung.",
        ],
      },
    },
  },
  {
    id: "de-novelle",
    lb: 2,
    unit: "2.2",
    covers: ["2.2.1"],
    title: "Die Novelle: Merkmale erkennen und Haltungen vergleichen",
    intro:
      "Die Novelle erzählt ein ungewöhnliches Ereignis knapp und streng gebaut. Du erkennst ihre Merkmale und vergleichst Haltungen mit deiner.",
    paragraphs: [
      "Eine **Novelle** ist eine Erzählung in Prosa, die meist kürzer ist als ein Roman. Im Mittelpunkt steht ein einzelnes ungewöhnliches Ereignis. Das Wort kommt vom italienischen „novella“ für „kurze Erzählung“, und das stammt von „neu“ ab. Goethe sagte 1827 zu seinem Gesprächspartner Johann Peter Eckermann, eine Novelle sei „eine sich ereignete, unerhörte Begebenheit“. „Unerhört“ meint hier nicht „empörend“, sondern „noch nie gehört“, also außergewöhnlich. Bekannte Novellen sind zum Beispiel Kleists „Das Erdbeben in Chili“ (erstmals 1807), Kellers „Kleider machen Leute“ (1874) und Storms „Der Schimmelreiter“ (1888).",
      "Der Aufbau ist meist straff. Die Novelle führt schnell in die Lage ein und steuert auf einen **Wendepunkt** zu, an dem sich die Lage der Figuren oder der Verlauf der Handlung entscheidend dreht. Oft hängt er eng mit der unerhörten Begebenheit zusammen oder fällt mit ihr zusammen. Danach klingt die Handlung meist schnell aus. Manche Novellen haben eine **Rahmenerzählung**: Eine Erzählerfigur berichtet, wie sie die eigentliche Geschichte erfahren hat, und die Haupthandlung steht gleichsam im Rahmen. Storms „Schimmelreiter“ hat sogar mehrere Rahmen. Storm schrieb 1881, die „heutige Novelle“ sei „die Schwester des Dramas und die strengste Form der Prosadichtung“: Wie das Drama brauche sie einen Konflikt im Mittelpunkt und eine geschlossene Form.",
      "Novellen arbeiten oft mit wiederkehrenden Zeichen. Ein **Dingsymbol** ist etwas Greifbares, zum Beispiel ein Gegenstand, ein Tier oder eine Pflanze, das mehrmals auftaucht und für etwas Größeres steht. Das bekannteste Beispiel ist der Falke in einer Novelle des italienischen Dichters Giovanni Boccaccio. Der Schriftsteller Paul Heyse (1830 bis 1914) riet Novellenschreibern 1871, sich zu fragen, wo „der Falke“ sei, also das Besondere, das die Geschichte von tausend anderen unterscheidet („Falkentheorie“). Später deutete man den Falken als Dingsymbol. Ein **Leitmotiv** ist allgemeiner: Ein Wort, ein Bild oder ein Gedanke kehrt in einem Werk immer wieder und trägt dessen Aussage mit. Frage dich also: Was kommt wieder vor, und wofür steht es? Ein Dingsymbol ist kein Pflichtmerkmal: Nicht jede Novelle hat eines, und die Forschung hält es nicht für nötig.",
      "Eine Novelle zeigt Menschen in einer Ausnahmesituation. Wie sie sich dort entscheiden, verrät ihre **Werthaltung** (was ihnen wichtig ist) und ihre **Lebenseinstellung** (wie sie dem Leben begegnen). Das kannst du mit deiner eigenen Haltung vergleichen: Was hätte ich getan? Was ist mir wichtig, und was war es der Figur? Wo sind wir uns ähnlich, wo nicht? Beachte dabei, dass die Figuren in ihrer Zeit leben. Ein Urteil gelingt besser, wenn du erst fragst, warum jemand so handelt, und dann, ob du es auch tun würdest. Du musst dafür nicht jede Novelle ganz lesen: Auszüge oder eine Inhaltszusammenfassung genügen, wenn du Wendepunkt, Dingsymbol und die Haltung der Hauptfigur erkennst.",
    ],
    terms: [
      {
        term: "Novelle",
        text: "Eine kürzere Prosaerzählung, die ein einzelnes ungewöhnliches Ereignis klar aufgebaut erzählt.",
      },
      {
        term: "Unerhörte Begebenheit",
        text: "Ein außergewöhnliches, bisher nie gehörtes Ereignis, das im Mittelpunkt der Novelle steht (so Goethe 1827).",
      },
      {
        term: "Wendepunkt",
        text: "Die Stelle, an der sich die Lage der Figuren oder der Verlauf der Handlung entscheidend dreht.",
      },
      {
        term: "Dingsymbol",
        text: "Etwas Greifbares wie ein Gegenstand, ein Tier oder eine Pflanze, das mehrmals auftaucht und für etwas Größeres steht.",
      },
      {
        term: "Leitmotiv",
        text: "Etwas, das in einem Werk immer wiederkehrt und dessen Aussage mitträgt: ein Wort, ein Bild oder ein Gedanke.",
      },
      {
        term: "Rahmenerzählung",
        text: "Eine Erzählung, die die Haupthandlung umgibt, zum Beispiel indem jemand berichtet, wie er sie erfahren hat.",
      },
    ],
    examples: [
      {
        title: "Goethe über die Novelle (1827)",
        text: "„… denn was ist eine Novelle anders als eine sich ereignete, unerhörte Begebenheit.“",
        analysis:
          "Goethe sprach mit Eckermann über den Titel einer eigenen Erzählung, die dann „Novelle“ hieß. Er nannte die **unerhörte Begebenheit** den eigentlichen Begriff der Novelle. „Unerhört“ heißt hier: noch nie gehört, ungewöhnlich. Der Satz ist eine berühmte Kurzdefinition, aber nicht die ganze Wahrheit: Storm schrieb 1881, die Novelle sei nicht mehr nur die Darstellung einer ungewöhnlichen Begebenheit, sondern „die Schwester des Dramas“.",
        source:
          "Johann Peter Eckermann: Gespräche mit Goethe in den letzten Jahren seines Lebens (erschienen 1836 bis 1848), Gespräch vom Januar 1827; Text und Kommasetzung nach Projekt Gutenberg",
      },
      {
        title: "Der Falke in Boccaccios Novelle (zusammengefasst)",
        text: "Ein verarmter Edelmann besitzt nur noch einen kleinen Hof und seinen Jagdfalken. Als die Frau, die er liebt, ihn besucht, lässt er den Falken zubereiten und setzt ihn ihr vor, weil er sonst nichts hat. Sie war gekommen, um den Falken für ihren kranken Sohn zu erbitten.",
        analysis:
          "Der Falke ist der kostbarste Besitz des Edelmanns und kommt immer wieder vor: als sein letzter Schatz, als Wunsch des kranken Sohnes und als Gastmahl. Deshalb deutet man ihn als **Dingsymbol**. Als **Wendepunkt** kann man den Moment sehen, in dem sie ihre Bitte nennt und er gestehen muss, dass der Falke schon aufgegessen ist. Paul Heyse hat an dieser Novelle seine „Falkentheorie“ entwickelt.",
        source:
          "Giovanni Boccaccio: Decamerone, fünfter Tag, neunte Novelle (Falkennovelle); eigene Zusammenfassung",
      },
    ],
    takeaway:
      "Eine Novelle erzählt knapp und straff eine unerhörte Begebenheit, also ein außergewöhnliches Ereignis. Typisch sind ein Wendepunkt, oft eine Rahmenerzählung und ein Dingsymbol oder Leitmotiv. Die Haltung der Figuren in der Ausnahmesituation kannst du mit deiner eigenen vergleichen.",
    sourceIds: ["lp", "dwds", "gutenberg", "storm1881", "muehlherr"],
    quiz: {
      question: "Was meint Goethe mit der „unerhörten Begebenheit“, die eine Novelle erzählt?",
      answer: "Ein außergewöhnliches Ereignis, von dem man so noch nie gehört hat.",
      wrong: [
        "Ein empörendes Ereignis, über das sich die Figuren aufregen.",
        "Ein alltägliches Ereignis, das der Erzähler besonders ausführlich schildert.",
      ],
      explanation:
        "Im Alltag heißt „unerhört“ oft „empörend“, bei Goethe aber „noch nie gehört“, also außergewöhnlich. Die Novelle erzählt gerade kein alltägliches Geschehen, sondern ein einzelnes Ereignis, das aus dem Rahmen fällt.",
    },
    workshop: {
      kind: "mark",
      title: "Merkmale einer Novelle im Text finden (erfundene Novelle)",
      instruction:
        "Wähle oben ein Merkmal und klicke dann im Text die passende Stelle an. Beim Dingsymbol markierst du nur den Gegenstand selbst, mit seinem Artikel, und er kommt mehr als einmal vor. Der Wendepunkt ist die Stelle, an der sich das Verhalten der Hauptfigur ändert. Nicht jeder Satz ist ein Merkmal.",
      labels: ["Dingsymbol", "Unerhörte Begebenheit", "Wendepunkt"],
      text: [
        { t: "Seit dem Streit vor dreißig Jahren spricht Großvater Kern nicht mehr von seinem Sohn. " },
        {
          t: "Die Standuhr",
          label: 0,
          feedback:
            "Die Standuhr steht im ganzen Text für den Stillstand zwischen Vater und Sohn. Sie taucht mehrmals auf und trägt die Bedeutung.",
        },
        { t: " im Flur geht seither falsch, und niemand darf sie anrühren. " },
        {
          t: "Eines Nachts schlägt es dreizehn, und im selben Augenblick klopft es an der Tür: Draußen steht der verschollene Sohn. ",
          label: 1,
          feedback:
            "Dreizehn Schläge und die Heimkehr des Sohnes im selben Augenblick: ein außergewöhnliches Ereignis, um das die Erzählung kreist.",
        },
        { t: "Der Großvater sitzt reglos am Tisch und starrt auf die Tür. " },
        {
          t: "Da steht er auf, geht hinaus und umarmt seinen Sohn. ",
          label: 2,
          feedback:
            "Hier dreht sich die Lage: Der Großvater, der nie von seinem Sohn sprach, öffnet ihm die Arme. Danach klingt die Handlung aus.",
        },
        { t: "Am nächsten Morgen lässt er " },
        {
          t: "die Standuhr",
          label: 0,
          feedback: "Das Dingsymbol kehrt wieder: Mit der Reparatur der Uhr endet der Stillstand zwischen Vater und Sohn.",
        },
        { t: " endlich reparieren. Seitdem wird im Haus wieder gesprochen." },
      ],
      conclusion:
        "Das Dingsymbol kehrt wieder, die unerhörte Begebenheit bringt die Handlung in Gang, und am Wendepunkt dreht sich die Lage der Figuren.",
    },
    casework: {
      title: "Die Kupferkanne: eine Novelle vergleichen",
      story:
        "In der erfundenen Novelle „Die Kupferkanne“ trinkt in einem Fischerdorf jeder vor der Ausfahrt aus der Kupferkanne der Wirtin, das bringe Glück. **Als ein Sturm aufzieht, bleibt der junge Jonas an Land, obwohl alle ihn drängen. Der Sturm vernichtet die ganze Flotte, nur Jonas überlebt.** Das Dorf spricht von einem Wunder. Jonas sagt: „Ich habe auf den Himmel geschaut, nicht auf die Kanne.“ Die Kanne hängt seitdem leer an der Wand.",
      steps: [
        {
          question: "Welches Ereignis ist die unerhörte Begebenheit?",
          options: [
            "Der Sturm vernichtet die Flotte, nur Jonas, der an Land blieb, überlebt.",
            "Die Fischer trinken vor jeder Ausfahrt aus der Kupferkanne der Wirtin.",
            "Die Kanne hängt seitdem leer an der Wand, und das Dorf spricht von einem Wunder.",
          ],
          answer: 0,
          explanation:
            "Außergewöhnlich und im Mittelpunkt ist der Sturm mit seinem seltsamen Ausgang. Das Trinken aus der Kanne ist ein Brauch, und die leere Kanne ist der Schluss.",
        },
        {
          question: "Wofür steht die Kupferkanne?",
          options: [
            "Für den Glauben an Bräuche, auf die sich das ganze Dorf verlässt.",
            "Für den Wohlstand der Wirtin, die mit der Kanne ein gutes Geschäft macht.",
            "Für nichts Bestimmtes, sie gehört nur zur Kulisse eines Fischerdorfs.",
          ],
          answer: 0,
          explanation:
            "Die Kanne taucht am Anfang und am Ende auf und steht für das Vertrauen auf Brauch und Glück: Sie ist das Dingsymbol der Geschichte.",
        },
        {
          question: "Welche Haltung zeigt Jonas?",
          options: [
            "Er verlässt sich auf eigene Beobachtung statt auf Brauch und Gruppendruck.",
            "Er hält die anderen Fischer für dumm und verachtet sie wegen ihres Glaubens.",
            "Er glaubt noch stärker als die anderen an die Kraft der Kanne und bleibt deshalb an Land.",
          ],
          answer: 0,
          explanation:
            "Jonas schaut auf den Himmel und hält dem Druck der anderen stand. Dass er andere verachtet, steht nicht im Text, und der Kanne vertraut er gerade nicht.",
        },
        {
          question: "Wie vergleichst du Jonas’ Haltung sinnvoll mit deiner eigenen?",
          options: [
            "Ich frage, wann ich selbst gegen Gruppendruck entschieden habe, und begründe meinen Vergleich.",
            "Ich übernehme seine Haltung ohne weitere Prüfung, weil er am Ende als Einziger überlebt.",
            "Ich lehne sie ab, weil Menschen früher abergläubisch waren und so etwas heute nicht mehr vorkommt.",
          ],
          answer: 0,
          explanation:
            "Ein Vergleich fragt nach Gründen und eigener Erfahrung. Allein vom Ausgang auf die Haltung zu schließen oder sie wegen der Zeit abzulehnen, ersetzt das Nachdenken nicht.",
        },
      ],
      verdict:
        "Die Novelle erzählt eine außergewöhnliche Begebenheit, die Kupferkanne ist ihr Dingsymbol, und Jonas steht für eine Haltung, die du mit deiner eigenen abwägen kannst. Wichtig ist, nicht nach dem Ausgang, sondern nach den Gründen zu urteilen.",
    },
    tasks: {
      1: {
        prompt:
          "Lies die Inhaltsangabe der Novelle „Die Kupferkanne“ im Textfall. Schreibe in vier bis fünf Sätzen auf, welche unerhörte Begebenheit sie erzählt, welches Dingsymbol sie hat und welche Haltung Jonas zeigt.",
        hints: [
          "Nenne zuerst die unerhörte Begebenheit und gib sie mit eigenen Worten wieder.",
          "Frage beim Dingsymbol: Was taucht mehrmals auf, und wofür steht es?",
        ],
        model:
          "In „Die Kupferkanne“ erzählt der Text eine unerhörte Begebenheit: Ein Sturm vernichtet die ganze Fischerflotte, und nur Jonas, der an Land geblieben ist, überlebt. Die Kupferkanne ist das Dingsymbol. Sie wird am Anfang und am Ende erwähnt und steht für den Glauben des Dorfes an Bräuche und Glück. Jonas zeigt die Haltung, sich auf eigene Beobachtung zu verlassen, statt dem Druck der anderen zu folgen. Dadurch wird er zum Gegenbild des Dorfes.",
        criteria: [
          "Nennt die unerhörte Begebenheit mit eigenen Worten.",
          "Benennt das Dingsymbol und seine Bedeutung.",
          "Beschreibt die Haltung der Hauptfigur.",
        ],
      },
      2: {
        prompt:
          "Erfinde eine Mini-Novelle: Schreibe in sechs bis acht Sätzen eine Erzählung mit einer unerhörten Begebenheit, einem Dingsymbol und einem Wendepunkt. Kennzeichne die drei Stellen danach in Klammern.",
        hints: [
          "Überlege zuerst das ungewöhnliche Ereignis und wähle dann einen Gegenstand, der mehrmals vorkommt.",
          "Der Wendepunkt ist die Stelle, an der sich die Haltung der Hauptfigur oder die Lage ändert.",
        ],
        model:
          "Seit Jahren hängt im Flur der alte Regenschirm meines Opas, den niemand benutzen darf (Dingsymbol). Eines Tages regnet es mitten im Sommer nur auf unser Haus, während die Straße trocken bleibt (unerhörte Begebenheit). Opa steht am Fenster und wird blass, denn er erinnert sich an das Versprechen, das er Oma gegeben hat: den Schirm nie zu verleihen. Da nimmt er den Schirm, geht hinaus und hält ihn über die Nachbarin, die vor ihrer Tür wartet (Wendepunkt). Zum ersten Mal seit Omas Tod lächelt er. Der Schirm hängt wieder im Flur, aber er darf nun benutzt werden.",
        criteria: [
          "Enthält ein außergewöhnliches Ereignis als Mittelpunkt.",
          "Enthält einen Gegenstand, der mehrmals vorkommt und etwas bedeutet.",
          "Enthält einen Wendepunkt, an dem sich die Lage der Figur ändert.",
        ],
      },
    },
  },
  {
    id: "de-drama",
    lb: 2,
    unit: "2.2",
    covers: ["2.2.1"],
    title: "Dramatische Texte: Bausteine und klassischer Aufbau",
    intro:
      "Ein Drama besteht aus Rede und Gegenrede. Du erkennst seine Bausteine und den klassischen Aufbau von der Exposition bis zum Schluss.",
    paragraphs: [
      "Ein **Drama** ist ein Text, der gespielt werden soll. Es hat meist keinen Erzähler; die Handlung entsteht, indem die Figuren sprechen und handeln. Äußerlich gliedert sich ein Drama in **Akte** (auch Aufzüge genannt), die in **Szenen** (Auftritte) unterteilt sind. Eine Szene endet oft, wenn eine Figur auftritt oder abgeht oder der Ort wechselt. Viele Dramen haben fünf Akte, zum Beispiel Gerhart Hauptmanns „Die Weber“ (1892). Der Text ist die Vorlage für eine Aufführung: Erst durch Schauspielerinnen, Schauspieler und eine Regie wird er auf der Bühne lebendig.",
      "Der Text eines Dramas besteht aus zwei Schichten. Der **Haupttext** ist die **Figurenrede**: Im **Dialog** sprechen mindestens zwei Figuren miteinander, im **Monolog** spricht eine Figur allein oder zu sich selbst und lässt uns ihre Gedanken und Zweifel hören. Beides kennst du aus Klasse 8. Der **Nebentext** besteht aus den **Regieanweisungen**: Sie nennen Ort, Zeit und Auftritte und sagen, wie gesprochen oder gespielt wird, oft in Klammern, etwa „(leise)“ oder „(geht zur Tür)“. Regieanweisungen werden nicht gesprochen, aber sie steuern Spiel und Stimmung. Wer ein Drama erschließen will, achtet auf beide Schichten.",
      "Viele Dramen folgen einem klassischen Aufbau, den Gustav Freytag 1863 in seinem Buch „Die Technik des Dramas“ als Pyramide beschrieb. Freytag selbst sprach zum Beispiel von „Einleitung“, „Steigerung“, „Umkehr“ und „Katastrophe“; die Namen unten sind die in der Schule üblichen. **Erstens** die **Exposition**: Sie führt in Ort, Zeit, Figuren und Ausgangslage ein. **Zweitens** die **steigende Handlung**: Ein erster Anstoß lässt den Konflikt entstehen, und er spitzt sich zu. **Drittens** der **Höhepunkt**: Hier fällt die Entscheidung, und der Verlauf kippt. **Viertens** die **fallende Handlung**: Die Folgen der Entscheidung zeigen sich, manchmal gibt es noch einmal einen Hoffnungsschimmer. **Fünftens** die **Lösung** oder die **Katastrophe**. Bei einer Tragödie endet das Stück mit der Katastrophe, dem Untergang der Hauptfigur, bei anderen Dramen mit einer Lösung des Konflikts.",
      "Der Aufbau ist ein Raster, kein Gesetz: Nicht jedes Drama hält sich daran. Frage dich beim Untersuchen eines Dramas: Wo setzt der Konflikt ein? Welche Entscheidung ist der Höhepunkt? Was verraten Dialoge und Monologe über die Haltung der Figuren? Welche Haltungen kannst du nachvollziehen, welche nicht, und warum? So vergleichst du die Lebenseinstellungen der Figuren mit deiner eigenen.",
    ],
    terms: [
      {
        term: "Akt",
        text: "Ein großer Abschnitt eines Dramas, auch Aufzug genannt; er besteht aus mehreren Szenen.",
      },
      {
        term: "Szene",
        text: "Ein kleinerer Abschnitt innerhalb eines Aktes, oft begrenzt durch Auftritt, Abgang oder Ortswechsel.",
      },
      {
        term: "Monolog",
        text: "Das Sprechen einer Figur allein oder zu sich selbst, das ihre Gedanken und Gefühle zeigt.",
      },
      {
        term: "Regieanweisung",
        text: "Ein Hinweis im Nebentext zu Ort, Auftritt, Spielweise oder Tonfall, der nicht gesprochen wird.",
      },
      {
        term: "Exposition",
        text: "Der einführende Teil eines Dramas, der Ort, Zeit, Figuren und Ausgangslage vorstellt.",
      },
      {
        term: "Katastrophe",
        text: "Im Drama der tragische Schluss mit dem Untergang der Hauptfigur; bei anderen Stücken steht dort eine Lösung.",
      },
    ],
    examples: [
      {
        title: "Nebentext und Monolog: Fausts erster Monolog (Auszug)",
        text: "In einem hochgewölbten, engen gotischen Zimmer Faust, unruhig auf seinem Sessel am Pulte.\nFaust:\nHabe nun, ach! Philosophie,\nJuristerei und Medizin,\n…\nDa steh ich nun, ich armer Tor!\nUnd bin so klug als wie zuvor;",
        analysis:
          "Die erste Zeile ist eine **Regieanweisung** (Nebentext): Sie nennt Ort und Fausts Haltung, wird aber nicht gesprochen. Danach folgt Figurenrede (Haupttext). Faust ist allein, also ist es ein **Monolog**: Wir erfahren seine Gedanken und seine Unzufriedenheit trotz aller Gelehrsamkeit. So zeigt der Monolog die Ausgangslage der Hauptfigur.",
        source:
          "Johann Wolfgang von Goethe: Faust. Der Tragödie erster Teil (1808), Szene „Nacht“, gekürzt; Text nach Projekt Gutenberg",
      },
    ],
    takeaway:
      "Im Drama sprechen die Figuren selbst: Haupttext ist die Figurenrede mit Dialog und Monolog, Nebentext sind die Regieanweisungen. Der klassische Aufbau führt von der Exposition über steigende Handlung und Höhepunkt zur fallenden Handlung und zum Schluss als Lösung oder Katastrophe.",
    sourceIds: ["lp", "dwds", "gutenberg", "freytag", "wikisource"],
    quiz: {
      question: "Was ist der Höhepunkt im klassischen Aufbau eines Dramas?",
      answer: "Die Stelle, an der die Entscheidung fällt und der Verlauf der Handlung kippt.",
      wrong: [
        "Der Anfang, an dem Figuren, Ort und Ausgangslage vorgestellt werden.",
        "Der Schluss, an dem der Konflikt gelöst wird oder die Hauptfigur untergeht.",
      ],
      explanation:
        "Der Höhepunkt liegt in der Mitte der Pyramide: Bis dahin steigt die Handlung, danach fällt sie. Die Vorstellung der Figuren ist die Exposition, und der Schluss ist die Lösung oder die Katastrophe.",
    },
    workshop: {
      kind: "timeline",
      title: "Den Aufbau eines Dramas ordnen",
      instruction:
        "Ein erfundenes Drama erzählt vom Streit zwischen einer Journalistin und einem Bürgermeister. Bringe die fünf Teile der Handlung in die richtige Reihenfolge des klassischen Aufbaus.",
      categories: [],
      entries: [
        {
          text: "Die Journalistin Mia zieht in eine Kleinstadt, in der der Bürgermeister als unantastbar gilt.",
          target: 0,
          feedback: "Hier werden Figuren, Ort und Machtverhältnisse vorgestellt: die Exposition.",
        },
        {
          text: "Mia entdeckt gefälschte Rechnungen, der Bürgermeister droht ihr, und der Streit spitzt sich Szene für Szene zu.",
          target: 1,
          feedback: "Der Konflikt entsteht und wächst: die steigende Handlung.",
        },
        {
          text: "In der Ratssitzung legt Mia ihre Belege vor, und der Bürgermeister kann sie nicht mehr entkräften: Das Blatt wendet sich.",
          target: 2,
          feedback: "Die Entscheidung fällt, und die Lage kippt: der Höhepunkt.",
        },
        {
          text: "Seine Verbündeten wenden sich ab, und sein letzter Versuch, die Vorwürfe als Lüge darzustellen, scheitert.",
          target: 3,
          feedback: "Die Folgen der Entscheidung zeigen sich, und der Gegner verliert Halt: die fallende Handlung.",
        },
        {
          text: "Am Ende tritt der Bürgermeister zurück, und der Konflikt ist gelöst.",
          target: 4,
          feedback: "Der Konflikt findet sein Ende: Hier steht die Lösung.",
        },
      ],
      conclusion:
        "Exposition, steigende Handlung, Höhepunkt, fallende Handlung und Lösung oder Katastrophe bilden zusammen die Pyramide des klassischen Dramas.",
    },
    casework: {
      title: "Ein Ausschnitt aus einem Schulstück",
      story:
        "In einem erfundenen Schulstück sitzt Lena früh am Morgen allein auf einer Bank auf dem Pausenhof. **LENA (leise, zu sich selbst): „Wenn ich sage, wer das Foto gepostet hat, bin ich die Verräterin. Wenn ich schweige, trifft es Ben.“** (Ben tritt hastig auf.) BEN: „Hast du das Foto gesehen? Alle sagen, ich hätte es gepostet.“ LENA (weicht seinem Blick aus): „Ich … habe nichts gesehen.“",
      steps: [
        {
          question: "Wie heißen Angaben wie „(leise, zu sich selbst)“ und „(weicht seinem Blick aus)“?",
          options: [
            "Regieanweisungen, sie gehören zum Nebentext.",
            "Figurenrede, sie gehört zum Haupttext.",
            "Szenenüberschriften, sie gliedern das Stück.",
          ],
          answer: 0,
          explanation:
            "Die Angaben in Klammern werden nicht gesprochen. Sie sagen, wie gesprochen oder gespielt wird, und sind deshalb Regieanweisungen.",
        },
        {
          question: "Welche Redeform ist Lenas erster Auftritt?",
          options: [
            "Ein Monolog: Sie spricht allein zu sich selbst.",
            "Ein Dialog, weil sie laut und deutlich für das Publikum spricht.",
            "Eine Regieanweisung, weil sie leise spricht und nicht gehört werden soll.",
          ],
          answer: 0,
          explanation:
            "Lena ist allein und spricht zu sich selbst, also ist es ein Monolog. Ein Dialog braucht mindestens zwei Sprechende, und „leise“ ist ein Hinweis im Nebentext.",
        },
        {
          question: "Was erfahren die Zuschauer durch den Monolog, was Ben nicht weiß?",
          options: [
            "Lena weiß, wer das Foto gepostet hat, und schwankt zwischen Sagen und Schweigen.",
            "Lena hat das Foto absichtlich gepostet, um sich an Ben zu rächen, und ist stolz darauf.",
            "Lena und Ben haben sich abgesprochen, wie sie dem Gerücht begegnen wollen.",
          ],
          answer: 0,
          explanation:
            "Der Monolog zeigt, dass Lena mehr weiß, als sie Ben sagt, und zwischen Wahrheit und Schweigen schwankt. Dass sie sich an Ben rächen will oder sich mit ihm abgesprochen hat, widerspricht dem Text.",
        },
        {
          question: "Wie vergleichst du Lenas Haltung am besten mit deiner eigenen?",
          options: [
            "Ich frage mich, was mir wichtiger wäre: Fairness gegenüber Ben oder Rücksicht auf die andere Person.",
            "Ich gebe ihr recht, weil sie die Hauptfigur ist und deshalb immer richtig entscheidet.",
            "Ich urteile nicht, weil Figuren erfunden sind und ihre Entscheidungen mich nichts angehen.",
          ],
          answer: 0,
          explanation:
            "Beim Vergleich fragst du nach den Werten hinter der Entscheidung und stellst sie deinen eigenen gegenüber. Dass jemand Hauptfigur ist oder erfunden wurde, macht ein Urteil weder richtig noch unmöglich.",
        },
      ],
      verdict:
        "Die Regieanweisungen verraten, wie gespielt wird, und der Monolog öffnet den Blick in Lenas Kopf. So erkennst du den Konflikt und kannst die Haltung der Figur mit deiner vergleichen.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe einen Monolog von drei bis vier Sätzen für eine Figur, die vor einer schwierigen Entscheidung steht. Füge mindestens zwei Regieanweisungen in Klammern ein.",
        hints: [
          "Überlege, was die Figur im Moment fühlt und wovor sie Angst hat.",
          "Regieanweisungen sagen, wie gesprochen wird oder was die Figur tut, zum Beispiel „(zögert)“.",
        ],
        model:
          "MIRA (steht am Fenster, leise): „Wenn ich das Angebot annehme, muss ich die Stadt verlassen. (Sie dreht sich um und sieht auf das Foto an der Wand.) Wenn ich bleibe, bleibt alles, wie es ist. Aber wer will ich in fünf Jahren sein?“ (Pause. Sie greift zum Telefon.)",
        criteria: [
          "Der Text ist ein Monolog: Eine Figur spricht allein.",
          "Er enthält mindestens zwei Regieanweisungen in Klammern.",
          "Er zeigt die Entscheidung oder den Zwiespalt der Figur.",
        ],
      },
      2: {
        prompt:
          "Wähle ein Märchen oder einen Film, den du gut kennst. Ordne seine Handlung in die fünf Teile des klassischen Aufbaus ein und nenne eine Stelle, die nicht gut zu dem Schema passt.",
        hints: [
          "Frage dich: Wann beginnt der eigentliche Konflikt, und welche Entscheidung kippt die Lage?",
          "Prüfe, ob der Schluss eine Lösung oder eine Katastrophe ist.",
        ],
        model:
          "Ich nehme das Märchen „Rotkäppchen“. Exposition: Die Mutter schickt Rotkäppchen mit Kuchen und Wein zur kranken Großmutter und warnt sie, vom Weg abzugehen. Steigende Handlung: Rotkäppchen trifft den Wolf und lässt sich vom Weg abbringen; der Wolf verschlingt die Großmutter. Höhepunkt: Der Wolf verschlingt auch Rotkäppchen. Fallende Handlung: Ein Jäger hört das laute Schnarchen und schaut nach. Lösung: Er schneidet den Wolf auf und rettet beide. Nicht gut passt, dass ein Erzähler die Handlung berichtet: In einem Drama zeigen die Figuren sie selbst durch Reden und Handeln.",
        criteria: [
          "Ordnet alle fünf Teile des Aufbaus der Handlung zu.",
          "Nennt den Höhepunkt als Stelle der Entscheidung.",
          "Benennt eine Stelle, die nicht zum Schema passt.",
        ],
      },
    },
  },
  {
    id: "de-figuren-zeit-motive",
    lb: 2,
    unit: "2.2",
    covers: ["2.2.2"],
    title: "Zeitgestaltung, Figurenkonstellation und Motive herausarbeiten",
    intro:
      "Wie ein Text mit der Zeit umgeht, wie die Figuren zusammenhängen und was wiederkehrt, zeigt dir, wie er gebaut ist.",
    paragraphs: [
      "Jede Erzählung hat zwei Zeiten. Die **Erzählzeit** ist die Zeit, die du zum Lesen oder Hören brauchst. Die **erzählte Zeit** ist der Zeitraum, über den sich die Handlung erstreckt. Das kennst du aus Klasse 8. Meist passen die beiden nicht zusammen. Bei der **Zeitraffung** ist die Erzählzeit kürzer als die erzählte Zeit: „Sieben Jahre vergingen.“ Ein ganzer Zeitraum steckt in einem Satz. Bei der **Zeitdehnung** ist die Erzählzeit länger: Ein kurzer Moment, etwa der Pfiff vor einem Elfmeter, wird über viele Sätze erzählt. Bei der **Zeitdeckung** sind beide etwa gleich lang, zum Beispiel in einem Dialog. Raffung treibt die Handlung voran, Dehnung hebt Wichtiges hervor.",
      "Auch die Reihenfolge kann verändert sein. Eine **Rückblende** unterbricht die Handlung und erzählt Früheres, zum Beispiel: „Vor zehn Jahren hatte sie hier zum letzten Mal gestanden.“ Sie erklärt oft, warum eine Figur so handelt. Eine **Vorausdeutung** weist auf Späteres hin: „Dass es ihre wichtigste Fahrt werden würde, ahnte sie nicht.“ Sie weckt Spannung, weil du wissen willst, wie es dazu kommt. Fachsprachlich heißen Rückblende und Vorausdeutung auch Analepse und Prolepse. Wenn du einen Text untersuchst, markiere solche Stellen und frage, welche Wirkung sie haben: Wird etwas erklärt, hervorgehoben oder spannend gemacht?",
      "Die **Figurenkonstellation** beschreibt, wie die Figuren zueinander stehen: Wer ist Hauptfigur, wer Gegenspieler, wer Freund oder Vertrauter? Dazu gehört die Art der Beziehung, etwa Freundschaft, Rivalität, Abhängigkeit oder Streit. Du kannst sie als Beziehungsgeflecht skizzieren: Figuren in Kästchen, Pfeile mit kurzer Beschriftung wie „misstraut“ oder „hilft“. Achte darauf, ob sich die Beziehungen im Verlauf ändern, denn oft liegt gerade darin die Handlung: Aus Freunden werden Gegner, aus Fremden Verbündete. Das kennst du als Personenkonstellation aus Klasse 8.",
      "Ein **Motiv** ist ein inhaltlicher Baustein, der in vielen Texten vorkommt. Es ist kleiner als eine ganze Handlung, aber man erkennt es wieder. Typische Motive sind feindliche Brüder (von Kain und Abel in der Bibel bis zu Schillers „Die Räuber“), der Doppelgänger, der Heimkehrer, die Eifersucht, das Verbrechen, das ans Licht kommt, oder der Wettlauf mit der Zeit. Wenn du ein Motiv erkennst, kannst du Texte vergleichen: Wie wird dasselbe Motiv hier anders gestaltet? Ein **Leitmotiv** ist ein Motiv, das innerhalb eines Werkes immer wiederkehrt.",
    ],
    terms: [
      {
        term: "Zeitraffung",
        text: "Ein langer Zeitraum wird in wenigen Sätzen erzählt, die Erzählzeit ist kürzer als die erzählte Zeit.",
      },
      {
        term: "Zeitdehnung",
        text: "Ein kurzer Moment wird ausführlich erzählt, die Erzählzeit ist länger als die erzählte Zeit.",
      },
      {
        term: "Rückblende",
        text: "Eine Stelle, die die Handlung unterbricht und Früheres erzählt, um etwas zu erklären.",
      },
      {
        term: "Vorausdeutung",
        text: "Ein Hinweis auf spätere Ereignisse, der Neugier und Spannung weckt.",
      },
      {
        term: "Figurenkonstellation",
        text: "Das Beziehungsgeflecht, in dem die Figuren eines Textes zueinander stehen, etwa als Hauptfigur, Gegenspieler oder Vertrauensperson.",
      },
      {
        term: "Motiv",
        text: "Ein wiederkehrender inhaltlicher Baustein, etwa feindliche Brüder oder der Doppelgänger, kleiner als eine ganze Handlung.",
      },
    ],
    examples: [
      {
        title: "Beziehungsgeflecht zu „Rotkäppchen“ (eigene Skizze in Worten)",
        text: "Mutter und Rotkäppchen: Die Mutter erteilt den Auftrag und warnt.\nWolf und Rotkäppchen: Der Wolf täuscht sie und verschlingt sie.\nWolf und Großmutter: Der Wolf verschlingt sie.\nJäger und Wolf: Der Jäger schneidet den Wolf auf und rettet beide.",
        analysis:
          "Die Hauptfigur ist Rotkäppchen. Der Wolf ist der **Gegenspieler**, die Mutter gibt den Anstoß, der Jäger löst den Konflikt. Die Beziehung zwischen Wolf und Rotkäppchen ist die wichtigste, denn sie treibt die Handlung. Als **Motiv** erkennst du das Kind, das vor einer Gefahr gewarnt wird und die Warnung missachtet.",
        source: "Brüder Grimm: Kinder- und Hausmärchen, „Rotkäppchen“; Skizze in Worten",
      },
    ],
    takeaway:
      "Raffung kürzt, Dehnung weitet die Zeit; Rückblende und Vorausdeutung ändern die Reihenfolge. Die Figurenkonstellation zeigt, wer zu wem in welcher Beziehung steht. Ein Motiv ist ein wiederkehrender Baustein wie feindliche Brüder. Mit diesen Fachbegriffen beschreibst du genau, wie ein Text gebaut ist.",
    sourceIds: ["lp", "dwds", "wikisource"],
    quiz: {
      question:
        "Ein Text erzählt zehn Jahre in einem Satz („Zehn Jahre vergingen.“) und eine Sekunde über eine halbe Seite. Wie heißen die beiden Techniken?",
      answer: "Zeitraffung für die zehn Jahre, Zeitdehnung für die eine Sekunde.",
      wrong: [
        "Zeitdehnung für die zehn Jahre, Zeitraffung für die eine Sekunde.",
        "Rückblende für die zehn Jahre, Vorausdeutung für die eine Sekunde.",
      ],
      explanation:
        "Wer eine lange Zeit knapp erzählt, rafft sie. Wer einen kurzen Moment breit ausführt, dehnt ihn. Rückblende und Vorausdeutung betreffen nicht das Tempo, sondern die Reihenfolge: früher oder später als der Handlungsverlauf.",
    },
    workshop: {
      kind: "mark",
      title: "Zeitgestaltung im Text finden",
      instruction:
        "Wähle oben eine Technik und klicke dann im Text die passende Stelle an. Eine Zeitraffung bringt die Handlung in wenigen Worten voran, eine Rückblende springt zurück. Nicht jeder Satz zeigt eine dieser Techniken.",
      labels: ["Zeitraffung", "Zeitdehnung", "Rückblende", "Vorausdeutung"],
      text: [
        { t: "Lena steht am Bahnsteig und wartet auf den Zug. " },
        { t: "Es ist ein kühler Oktobermorgen, und der Himmel ist grau. " },
        { t: "Der Zug hat zehn Minuten Verspätung. " },
        {
          t: "Vor zehn Jahren stand sie hier zum letzten Mal, den Rucksack auf dem Rücken, und winkte ihrer Mutter zu. ",
          label: 2,
          feedback:
            "„Vor zehn Jahren stand sie hier zum letzten Mal“ springt in die Vergangenheit und erklärt, warum der Ort wichtig ist.",
        },
        {
          t: "Jetzt rollt der Zug ein: Die Türen gleiten auf, Lena hört das Zischen der Bremsen, spürt den kühlen Wind im Gesicht, zögert. Ihr Fuß schwebt über der ersten Stufe, eine Sekunde, noch eine Sekunde, noch eine, dann setzt sie ihn auf. ",
          label: 1,
          feedback:
            "Wenige Sekunden füllen mehrere Sätze mit Geräuschen, Gefühlen und gezählten Augenblicken. Die Erzählzeit ist länger als die erzählte Zeit.",
        },
        {
          t: "Dass es die wichtigste Fahrt ihres Lebens wird, ahnt sie noch nicht. ",
          label: 3,
          feedback: "Der Satz deutet voraus, dass die Fahrt wichtig wird, und macht neugierig, wie es dazu kommt.",
        },
        {
          t: "Sechs Stunden und drei Umstiege später steht sie in der fremden Stadt. ",
          label: 0,
          feedback:
            "Sechs Stunden und drei Umstiege stehen in einem Satz: Die Erzählzeit ist viel kürzer als die erzählte Zeit.",
        },
        { t: "Niemand wartet am Gleis auf sie." },
      ],
      conclusion:
        "Zeitraffung verkürzt, Zeitdehnung verlängert, die Rückblende blickt zurück, die Vorausdeutung blickt voraus. Jede Technik steuert, worauf du achtest.",
    },
    casework: {
      title: "Ben, Max und der Streit von damals",
      story:
        "In einer erfundenen Kurzgeschichte trifft Ben nach drei Jahren seinen früheren besten Freund Max wieder. **Der Text erzählt den Streit von damals in drei Sätzen als Erinnerung, das Wiedersehen aber über vier Seiten, obwohl es nur eine halbe Minute dauert.** Damals hatten sich beide in Anna verliebt, und Max war aus Eifersucht weggezogen. Ben erzählt alles seiner Schwester Mila, die ihn als Einzige versteht. Am Ende reichen sich Ben und Max die Hand.",
      steps: [
        {
          question: "Wie heißt die Technik, wenn der Text die Handlung unterbricht und vom Streit vor drei Jahren erzählt?",
          options: ["Rückblende", "Vorausdeutung", "Zeitdeckung"],
          answer: 0,
          explanation:
            "Der Text blickt auf Früheres zurück und erklärt damit, warum die Freunde sich getrennt haben: eine Rückblende. Eine Vorausdeutung wäre ein Hinweis auf Späteres.",
        },
        {
          question: "Das Wiedersehen dauert eine halbe Minute, wird aber über vier Seiten erzählt. Was ist das?",
          options: ["Zeitdehnung", "Zeitraffung", "Rückblende"],
          answer: 0,
          explanation:
            "Ein kurzer Moment wird sehr ausführlich erzählt: Die Erzählzeit ist viel länger als die erzählte Zeit. Das ist Zeitdehnung und hebt die Bedeutung des Wiedersehens hervor.",
        },
        {
          question: "Welche Beziehung bildet den Kern der Figurenkonstellation?",
          options: [
            "Die Freundschaft von Ben und Max, die durch Eifersucht zerbrach und neu beginnt.",
            "Die Rivalität zwischen Ben und seiner Schwester Mila, die ihn nicht versteht.",
            "Die Abhängigkeit von Max und Anna, wegen der er schließlich wegzieht.",
          ],
          answer: 0,
          explanation:
            "Der Text dreht sich um Bens und Max’ Freundschaft: Streit, Trennung, Wiedersehen. Mila ist Bens Vertraute, nicht seine Gegnerin, und von einer Abhängigkeit zwischen Max und Anna steht nichts im Text.",
        },
        {
          question: "Welches Motiv steckt in der Geschichte?",
          options: [
            "Eifersucht, die eine Freundschaft zerbrechen lässt, bis sie neu beginnt.",
            "Das Verbrechen, das ans Licht kommt und die Täter am Ende überführt.",
            "Der Wettlauf mit der Zeit, bei dem die Freunde das Wiedersehen noch erreichen müssen.",
          ],
          answer: 0,
          explanation:
            "Von einer Straftat oder einem Wettlauf ist keine Rede. Der wiederkehrende Baustein ist die Eifersucht, die die Freundschaft zerbrechen lässt, bis sich beide wieder die Hand reichen.",
        },
      ],
      verdict:
        "Die Geschichte nutzt eine Rückblende für den Streit und dehnt das Wiedersehen. Die Figurenkonstellation und das Motiv der Eifersucht, die eine Freundschaft zerbrechen lässt, zeigen, worum es dem Text geht.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe eine kurze Erzählung von sechs bis acht Sätzen über den Beginn einer Prüfung. Sie soll eine Zeitraffung und eine Zeitdehnung enthalten. Setze danach die Fachbegriffe in Klammern hinter die beiden Stellen.",
        hints: [
          "Raffe zum Beispiel die Wochen vor der Prüfung in einem Satz.",
          "Dehne einen kurzen Moment, etwa das Umdrehen des Aufgabenblatts, über mehrere Sätze.",
        ],
        model:
          "Wochenlang hatte Jonas gelernt, und dann war der Prüfungstag da (Zeitraffung). Er saß an seinem Platz und starrte auf das umgedrehte Blatt. Seine Hand lag darauf, die Finger waren kalt. Die Uhr an der Wand tickte laut, und irgendwo hustete jemand. Er atmete ein, atmete aus, drehte das Blatt langsam um und las die erste Aufgabe, Wort für Wort (Zeitdehnung). Dann begann er zu schreiben.",
        criteria: [
          "Enthält eine erkennbare Zeitraffung.",
          "Enthält eine erkennbare Zeitdehnung.",
          "Benennt beide Stellen mit dem Fachbegriff.",
        ],
      },
      2: {
        prompt:
          "Wähle ein Buch, einen Film oder ein Märchen. Beschreibe die Figurenkonstellation mit mindestens vier Figuren und ihren Beziehungen und nenne ein Motiv. Erkläre in zwei Sätzen, wie sich eine Beziehung im Verlauf verändert.",
        hints: [
          "Beschreibe jede Beziehung mit einem Verb, zum Beispiel „hilft“, „bedroht“ oder „misstraut“.",
          "Prüfe, ob das Motiv auch in anderen Geschichten vorkommt.",
        ],
        model:
          "Ich wähle „Aschenputtel“ der Brüder Grimm. Die Hauptfigur wird von der Stiefmutter und den Stiefschwestern gedemütigt und zur Arbeit gezwungen. Hilfe bekommt Aschenputtel von den Tauben, die ihr beim Auslesen der Linsen helfen. Der Prinz sucht die unbekannte Tänzerin. Ein Motiv ist das Wiedererkennen: Der Schuh passt, und der Prinz erkennt die Tänzerin wieder. Die Beziehung zum Prinzen verändert sich vom flüchtigen Tanzpartner zum Ehemann, und die Rollen gegenüber den Schwestern kehren sich um, weil Aschenputtel am Ende höher steht.",
        criteria: [
          "Beschreibt mindestens vier Figuren mit ihren Beziehungen.",
          "Nennt ein typisches Motiv.",
          "Erklärt, wie sich eine Beziehung im Verlauf verändert.",
        ],
      },
    },
  },
  {
    id: "de-produktives-lesen",
    lb: 2,
    unit: "2.2",
    covers: ["2.2.3"],
    title: "Produktives Lesen: Weiterschreiben, Dialog, Hörspiel- und Filmszene",
    intro:
      "Wer einen Text selbst gestaltet, merkt, was darin steht und was offenbleibt. So verstehst du ihn tiefer und lernst dabei über dich.",
    paragraphs: [
      "Bei **produktiven Methoden** liest du nicht nur, du gestaltest selbst mit. Das ist kein Spiel, sondern eine Form des Verstehens: Wer eine Geschichte weiterschreibt, muss genau wissen, wie die Figuren sind und was der Text bisher gezeigt hat. Texte lassen oft etwas offen, zum Beispiel, was eine Figur denkt oder was zwischen zwei Szenen geschieht. Solche **Leerstellen** füllst du mit eigenen Ideen. Dabei gilt: Deine Ergänzung muss zum Text passen. Erst genau lesen, dann gestalten. Hier lernst du drei Methoden kennen: eine Geschichte weiterschreiben, einen fiktiven Dialog zwischen Figuren verfassen und einen Text in eine Hörspiel- oder Filmszene übertragen.",
      "Beim **Weiterschreiben** knüpfst du direkt an die letzte Zeile an. Du übernimmst Figuren, Ton und Zeitform und greifst Hinweise auf, die der Text gibt, zum Beispiel einen Gegenstand, einen Streit oder ein Versprechen. Beim **fiktiven Dialog** lässt du zwei Figuren miteinander sprechen, die im Text nicht oder nicht so miteinander reden, etwa zwei Geschwister nach einem Streit. Jede Figur spricht so, wie der Text sie zeigt: Wer im Text knapp und zurückhaltend redet, wird auch im Dialog nicht plötzlich redselig. Ein Dialog zeigt besonders gut den Konflikt und die Haltungen der Figuren.",
      "Bei der **Übertragung in eine Hörspielszene** gibt es nur Ton: Sprecherinnen und Sprecher, Geräusche und Musik. Alles, was in der Vorlage beschrieben wird, musst du hörbar machen: Ein Ort entsteht durch Geräusche, ein Gefühl durch Stimme, Atem oder Pausen. Beim **Film** kommen Bilder hinzu: Du legst fest, was zu sehen ist, und lässt Gedanken durch Mimik, Handlung oder Musik erkennbar werden, statt sie zu erklären. In beiden Fällen schreibst du ein kurzes Skript aus Sprechtext, Geräuschen und Anweisungen in Klammern. Dabei entscheidest du, was wichtig ist, und lässt Unwichtiges weg.",
      "Danach kommt der wichtigste Schritt: das **Nachdenken**. Vergleiche mit dem Text: Was habe ich übernommen, was ergänzt, und passt es dazu? Frage dich, was du über die Figur herausgefunden hast, das du beim ersten Lesen übersehen hast. Und frage dich auch: Was hat das mit mir zu tun? Vielleicht hast du beim Schreiben des Dialogs gemerkt, wie du selbst bei einem Streit reagierst oder was dir an einer Freundschaft wichtig ist. Solche Erkenntnisse helfen dir, dich selbst besser zu verstehen. Gute Arbeiten erkennst du an drei Dingen: Sie passen zum Text, sie sind stimmig, und sie bringen etwas Eigenes ein.",
    ],
    terms: [
      {
        term: "Produktive Methode",
        text: "Eine Arbeitsweise, bei der du einen Text selbst gestaltest, zum Beispiel weiterschreibst oder umsetzt, um ihn besser zu verstehen.",
      },
      {
        term: "Leerstelle",
        text: "Eine Stelle, an der der Text etwas offenlässt, das du dir mit eigenen Ideen ausmalen musst.",
      },
      {
        term: "Fiktiver Dialog",
        text: "Ein erfundenes Gespräch zwischen Figuren, das so im Text nicht vorkommt, aber zu ihnen passt.",
      },
      {
        term: "Hörspielszene",
        text: "Eine Szene, die nur aus Sprechtext, Geräuschen und Musik besteht und alles Wichtige hörbar macht.",
      },
      {
        term: "Textnähe",
        text: "Die Eigenschaft einer eigenen Gestaltung, zu Figuren, Ton und Handlung der Vorlage zu passen.",
      },
    ],
    examples: [
      {
        title: "Ein fiktiver Dialog zu einem Textanfang (eigens verfasst)",
        text: "Vorlage: Anna sah Tom nach, wie er den Hof verließ. Dann ging sie ins Haus und schloss die Tür.\nDialog:\nANNA: Du bist einfach gegangen, ohne ein Wort.\nTOM: Ich wusste nicht, was ich sagen sollte.\nANNA: Dann hättest du es sagen müssen.",
        analysis:
          "Die Vorlage lässt offen, warum Tom geht und was Anna dabei denkt. Der Dialog füllt diese **Leerstelle**: Er zeigt Annas Kränkung und Toms Hilflosigkeit. Die Figuren sprechen knapp, wie es zur Stimmung der Vorlage passt. Beim Schreiben merkst du außerdem, dass die Vorlage den Grund des Streits nicht verrät. Das ist schon eine Erkenntnis über den Text.",
      },
    ],
    takeaway:
      "Produktive Methoden verlangen genaues Lesen: Du schreibst weiter, lässt Figuren sprechen oder machst eine Szene hörbar und füllst Leerstellen passend zum Text. Danach vergleichst du mit der Vorlage und fragst, was du über die Figur und über dich erfahren hast.",
    sourceIds: ["lp"],
    quiz: {
      question: "Warum verstehst du einen Text besser, wenn du ihn weiterschreibst?",
      answer: "Ich muss die Figuren und das Offene im Text genau kennen, damit die Fortsetzung passt.",
      wrong: [
        "Ich lerne den Text dabei auswendig, weil ich ihn dafür mehrmals abschreibe.",
        "Ich darf den Text frei verändern und umschreiben, bis er mir persönlich besser gefällt.",
      ],
      explanation:
        "Eine Fortsetzung gelingt nur, wenn sie zu Figuren, Ton und Handlung passt. Deshalb musst du den Text genau lesen und erkennen, was er offenlässt. Auswendiglernen und beliebiges Verändern sind keine Methoden des Verstehens.",
    },
    workshop: {
      kind: "classify",
      title: "Welche produktive Methode ist das?",
      instruction:
        "Lies jeden Ausschnitt aus einer Schülerarbeit und ordne ihn der produktiven Methode zu, die er zeigt. Eine Hörspiel- oder Filmszene erkennst du an Geräuschen, Einstellungen oder Spielanweisungen. Reine Rede mit Sprechernamen, aber ohne solche Angaben, ist ein Dialog.",
      categories: ["Geschichte weiterschreiben", "Fiktiver Dialog", "Hörspiel- oder Filmszene"],
      entries: [
        {
          text: "Am nächsten Morgen wachte Jonas früh auf. Er wusste, dass er heute mit seinem Vater sprechen musste.",
          target: 0,
          feedback: "Der Text knüpft an die Geschichte an und erzählt, was danach geschieht.",
        },
        {
          text: "LENA: Du hast mich gestern stehen lassen. – ANNA: Ich wusste nicht, was ich sagen sollte.",
          target: 1,
          feedback: "Zwei Figuren sprechen miteinander, und niemand erzählt dazwischen: Das ist ein Dialog.",
        },
        {
          text: "SPRECHER (ruhig): Es ist Nacht. GERÄUSCH: Schritte auf Kies, eine Tür quietscht. LENA (flüsternd): Ist da jemand?",
          target: 2,
          feedback: "Sprecher, Geräusche und Anweisungen machen alles hörbar: Das ist eine Hörspielszene.",
        },
        {
          text: "Einstellung: Totale, Pausenhof, früher Morgen. Lena sitzt allein auf einer Bank und sieht auf ihr Handy.",
          target: 2,
          feedback: "Die Einstellung und das, was zu sehen ist, werden festgelegt: Das ist eine Filmszene.",
        },
        {
          text: "Der Brief lag noch immer ungeöffnet auf dem Tisch. Mira nahm ihn und trug ihn zu ihrer Großmutter.",
          target: 0,
          feedback: "Die Erzählung geht weiter und bleibt in Zeitform und Ton bei der Vorlage.",
        },
        {
          text: "TOM: Warum hast du mir nichts gesagt? – JULE: Weil du dann nicht mehr mein Freund gewesen wärst.",
          target: 1,
          feedback: "Ein erfundenes Gespräch zwischen zwei Figuren zeigt ihren Konflikt: ein fiktiver Dialog.",
        },
      ],
      conclusion:
        "Weiterschreiben erzählt fort, der fiktive Dialog lässt Figuren sprechen, und Hörspiel oder Film machen aus Erzähltext hörbare oder sichtbare Szenen.",
    },
    casework: {
      title: "Miras Brief: vier Arten, den Text zu nutzen",
      story:
        "Eine Kurzgeschichte endet so: **„Mira weiß, was in dem Brief steht: Ihre beste Freundin Jule zieht in eine andere Stadt. Sie legt den Umschlag ungeöffnet auf den Tisch, nimmt ihre Jacke und geht.“** Im Unterricht sollen die Lernenden die Geschichte weiterschreiben, einen Dialog zwischen Mira und Jule verfassen und die Szene als Hörspiel umsetzen.",
      steps: [
        {
          question: "Welche Fortsetzung passt am besten zum Ende des Textes?",
          options: [
            "Mira geht die Straße entlang und überlegt, was sie Jule beim Abschied sagen soll.",
            "Plötzlich landet ein Raumschiff vor ihr auf der Straße, und Außerirdische laden Mira ein.",
            "Mira ist erleichtert, freut sich, dass Jule wegzieht, und ruft gleich ihre anderen Freunde an.",
          ],
          answer: 0,
          explanation:
            "Die erste Fortsetzung knüpft an Miras Gefühl an und führt es fort. Das Raumschiff bricht mit dem Ton der Geschichte, und dass sie sich freut, passt weder zu einer besten Freundin noch zum ungeöffneten Brief.",
        },
        {
          question: "Welche Zeile passt zu einem fiktiven Dialog zwischen Mira und Jule?",
          options: [
            "MIRA: Wann wolltest du mir eigentlich sagen, dass du wegziehst?",
            "JULE: Hurra, ich ziehe um, endlich bin ich dich und deine ewigen Fragen los!",
            "MIRA: Heute ist Mittwoch, und morgen scheint die Sonne, das Wetter bleibt gut.",
          ],
          answer: 0,
          explanation:
            "Die erste Zeile passt zur Beziehung der beiden und zeigt den Konflikt. Dass Jule froh ist, sie loszuwerden, widerspricht ihrer Freundschaft, und die dritte Zeile hat mit der Situation nichts zu tun.",
        },
        {
          question: "Wie wird Miras Gefühl in einer Hörspielszene hörbar, ohne dass nur erzählt wird?",
          options: [
            "Der Umschlag raschelt, die Tür fällt hart ins Schloss, und Mira atmet hörbar aus.",
            "Ein Sprecher liest zuerst eine lange Beschreibung ihres Zimmers und der Möbel darin vor.",
            "Ein Sprecher erklärt in einem Satz, dass Mira traurig ist und gleich gehen will.",
          ],
          answer: 0,
          explanation:
            "Im Hörspiel zeigen Geräusche und Stimme, wie es Mira geht. Eine Beschreibung oder eine Erklärung durch den Sprecher erzählt nur darüber, statt es hörbar zu machen.",
        },
        {
          question: "Was gewinnst du durch diese produktive Arbeit für dein Textverständnis?",
          options: [
            "Ich erkenne, was der Text offenlässt, und kann Miras Gefühl besser nachvollziehen.",
            "Ich weiß jetzt sicher, wie die Geschichte nach dem Ende des Textes wirklich weitergeht.",
            "Ich muss den Originaltext nicht mehr lesen, weil meine Fassung ihn ersetzt.",
          ],
          answer: 0,
          explanation:
            "Das Gestalten macht Leerstellen sichtbar und lässt dich die Figur genauer verstehen. Wie die Geschichte wirklich weitergeht, erfährst du dadurch nicht, und das Original bleibt der Maßstab.",
        },
      ],
      verdict:
        "Fortsetzung, Dialog und Hörspiel passen nur, wenn sie zu Ton und Figuren des Textes passen. Dabei entdeckst du Leerstellen und lernst vielleicht, wie du selbst auf einen Abschied reagierst.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe die Geschichte weiter: „Tim saß auf dem Bahnsteig, den Koffer neben sich. Der Zug nach Hamburg war schon vor zehn Minuten abgefahren, doch er hatte sich nicht gerührt.“ Verfasse vier bis fünf Sätze und nenne danach zwei Hinweise aus dem Text, die du aufgegriffen hast.",
        hints: [
          "Überlege, warum Tim nicht eingestiegen ist: Was verrät der Text darüber?",
          "Behalte Zeitform und Ton bei: Die Geschichte ist in der Vergangenheit erzählt.",
        ],
        model:
          "Ein Mann mit einem Hund ging an ihm vorbei und warf ihm einen fragenden Blick zu. Tim nickte nur. Er dachte an den Brief in seiner Jackentasche und an den Satz, mit dem sein Vater ihn beendet hatte: „Du musst nicht kommen.“ Langsam zog er den Brief hervor und las ihn noch einmal. Dann stand er auf, nahm den Koffer und ging zum Schalter, um nach dem nächsten Zug zu fragen. Aufgegriffen habe ich den Koffer, den Tim am Ende mitnimmt, und sein Sitzenbleiben nach der Abfahrt des Zuges: Beides zeigt, dass er sich lange nicht entscheiden konnte.",
        criteria: [
          "Die Fortsetzung knüpft direkt an die letzte Zeile an.",
          "Figuren, Ton und Zeitform passen zur Vorlage.",
          "Mindestens zwei Hinweise aus dem Text werden aufgegriffen und genannt.",
        ],
      },
      2: {
        prompt:
          "Übertrage diese Textstelle in eine Hörspielszene mit Sprechtext, Geräuschen und Regieanweisungen: „Es war Nacht. Leni hörte Schritte im Flur. Sie hielt den Atem an und tastete nach dem Lichtschalter. Die Tür öffnete sich, und ihr Bruder stand da, barfuß und mit dem Handy in der Hand.“",
        hints: [
          "Mache Ort und Zeit durch Geräusche hörbar, zum Beispiel durch Schritte oder Atem.",
          "Gedanken und Gefühle brauchen Stimme, Pausen oder Geräusche; schreibe sie nicht als Erzählertext.",
        ],
        model:
          "GERÄUSCH: Eine Uhr tickt leise im Dunkeln. Stille. GERÄUSCH: Schritte auf Holzboden, langsam, näher kommend. LENI (flüsternd, hörbar atmend): Wer ist da? GERÄUSCH: Eine Hand tastet über die Wand, die Schritte verstummen. GERÄUSCH: Eine Tür quietscht. BRUDER (verschlafen, leise): Ich bin’s. Ich konnte nicht schlafen. LENI (erleichtert ausatmend): Du hast mich zu Tode erschreckt.",
        criteria: [
          "Ort und Zeit werden durch Geräusche hörbar.",
          "Gefühle zeigen sich in Stimme und Regieanweisungen.",
          "Der Text enthält Sprechtext, Geräusche und Anweisungen in Klammern.",
        ],
      },
    },
  },
  {
    id: "de-gesellschaftskritik",
    lb: 2,
    unit: "2.2",
    covers: ["2.2.4"],
    title: "Gesellschaftskritik in Werken des 19. und 20. Jahrhunderts",
    intro:
      "Literatur kann Missstände aufdecken. Du ordnest Werke nach Zeit, Epoche und Form der Kritik ein und nimmst begründet Stellung.",
    paragraphs: [
      "**Gesellschaftskritik** bedeutet, dass ein Werk Missstände seiner Zeit zeigt, zum Beispiel Armut, Ungerechtigkeit oder starre Regeln. Um ein solches Werk **literaturgeschichtlich einzuordnen**, stellst du drei Fragen. **Wann** ist es entstanden, und zu welcher **Epoche** gehört es? Maßgeblich ist die Entstehungszeit und nicht die Zeit, in der die Handlung spielt, denn eine Epoche beschreibt, wie in einer bestimmten Zeit geschrieben und gedacht wurde. **Was** wird kritisiert? **Wie** wird kritisiert: durch offene Anklage, durch genaue Schilderung der Lebensverhältnisse, durch das Schicksal einer Figur oder durch Spott? Diese vier Formen sind eine Einteilung für den Unterricht und keine festen Fachbegriffe; viele Werke mischen sie. Epochen sind Zeitabschnitte mit ähnlichen Themen und Formen. Ihre Grenzen sind nur ungefähr bestimmt und in Handbüchern nicht überall gleich, deshalb steht bei Jahreszahlen oft „etwa“.",
      "Der **Vormärz** nennt die Jahre vor der Märzrevolution von 1848, meist ab etwa 1830. Es war die Zeit der beginnenden Industrialisierung mit viel Armut, aber auch von Zensur und politischer Verfolgung. Heinrich Heines Gedicht „Die schlesischen Weber“ erschien 1844 zuerst unter dem Titel „Die armen Weber“. Es greift den Aufstand der schlesischen Weber von 1844 auf und **klagt direkt an**: Die Weber verfluchen Gott, den König und das „falsche Vaterland“. In Preußen wurde das Gedicht verboten. Ein Rezitator, der es im Herbst 1846 in einem Berliner Lokal vortrug, wurde wegen Majestätsbeleidigung, also wegen Beleidigung des Königs, angeklagt.",
      "Derselbe Aufstand ist der Stoff von Gerhart Hauptmanns Drama „Die Weber“, das 1892 erschien. Es gehört zum **Naturalismus**, einer Strömung ab etwa 1880, die Wirklichkeit und aktuelle Zeitprobleme genau beobachtet und darstellt. In fünf Akten zeigt Hauptmann, wie hungernde Weber leben und schließlich aufbegehren: eine **Milieuschilderung**. Der **Realismus** (auch Bürgerlicher oder Poetischer Realismus) reicht etwa von der Märzrevolution 1848 bis gegen Ende des 19. Jahrhunderts und überschneidet sich zuletzt mit dem Naturalismus. Theodor Fontanes Roman „Effi Briest“ gehört zum Realismus. Er erschien 1894/95 in Fortsetzungen und 1895 als Buch (auf dem Titelblatt steht 1896). Darin geht es um eine junge Frau, die gesellschaftlich geächtet wird, weil ein überholter Ehrenkodex es verlangt. Die Kritik liegt im **Schicksal der Figur**.",
      "Im 20. Jahrhundert spottet Heinrich Mann in seinem Roman „Der Untertan“, der 1918 als Buch erschien, über das Kaiserreich unter Wilhelm II. Er erzählt vom angepassten Karrieristen Diederich Heßling. Das ist eine **Satire**: Sie macht durch Übertreibung und Spott lächerlich. Wenn du Stellung nimmst, trennst du Beschreibung und Urteil: Erst sagst du, was kritisiert wird und wie, dann prüfst du, ob die Kritik berechtigt war und ob das Problem heute noch eine Rolle spielt. Bedenke, dass Werke zuspitzen und auswählen: Ein Roman ist kein Geschichtsbuch. Eine gute Stellungnahme darf auch lauten: Damals war die Kritik berechtigt, heute trifft sie anders zu.",
    ],
    terms: [
      {
        term: "Gesellschaftskritik",
        text: "Die Darstellung und Kritik von Missständen einer Gesellschaft in einem Werk.",
      },
      {
        term: "Epoche",
        text: "Ein Zeitabschnitt der Literaturgeschichte mit ähnlichen Themen und Formen, dessen Grenzen nur ungefähr festliegen.",
      },
      {
        term: "Vormärz",
        text: "Die Jahre vor der Märzrevolution von 1848, meist ab etwa 1830, geprägt von Armut, Zensur und politischem Streit.",
      },
      {
        term: "Realismus",
        text: "Die Epoche etwa von der Märzrevolution 1848 bis gegen Ende des 19. Jahrhunderts, die die bürgerliche Wirklichkeit darstellt.",
      },
      {
        term: "Naturalismus",
        text: "Eine Strömung ab etwa 1880, die Wirklichkeit und aktuelle Zeitprobleme möglichst genau beobachtet und darstellt.",
      },
      {
        term: "Satire",
        text: "Eine Darstellung, die Missstände oder Personen durch Spott und Übertreibung lächerlich macht.",
      },
    ],
    examples: [
      {
        title: "Direkte Anklage im Vormärz: Heines „Weber“ (Auszug)",
        text: "Ein Fluch dem König, dem König der Reichen,\nDen unser Elend nicht konnte erweichen,\n…\nWir weben, wir weben!",
        analysis:
          "Der Sprecher klagt den König direkt an: Er sei „der König der Reichen“, den das Elend der Weber nicht erweicht habe. Das ist eine **direkte Anklage**. Der Refrain „Wir weben, wir weben!“ kehrt nach jeder Strophe wieder und klingt wie der Takt der Webarbeit. Das Gedicht gehört in den **Vormärz** (1844), kritisiert die Verhältnisse im Staat und drängt auf Veränderung.",
        source:
          "Heinrich Heine: Die schlesischen Weber (zuerst 1844 als „Die armen Weber“; hier Heines überarbeitete Fassung, gedruckt in H. Püttmann: Album, 1846/47), gekürzt; Text nach Wikisource",
      },
    ],
    takeaway:
      "Du ordnest ein Werk mit drei Fragen ein: Wann und in welcher Epoche ist es entstanden, was kritisiert es, und wie? Entscheidend ist die Entstehungszeit. Danach prüfst du die Kritik und nimmst begründet Stellung, auch dazu, ob sie heute noch gilt.",
    sourceIds: ["lp", "wikisource", "heine-institut"],
    quiz: {
      question: "Welche Zuordnung von Werk und Epoche stimmt?",
      answer: "Heines „Die schlesischen Weber“ (1844) gehört zum Vormärz.",
      wrong: [
        "Hauptmanns „Die Weber“ (1892) gehört zum Vormärz, weil es 1844 spielt.",
        "Fontanes „Effi Briest“ (1895) gehört zum Naturalismus, weil es Missstände zeigt.",
      ],
      explanation:
        "Maßgeblich ist die Entstehungszeit: Heines Gedicht von 1844 gehört zum Vormärz. Hauptmanns Drama spielt zwar 1844, entstand aber 1892 und gilt als naturalistisch. Fontanes Roman von 1895 wird dem Realismus zugerechnet.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Form der Kritik ist das?",
      instruction:
        "Ordne jede Beschreibung der Form der Gesellschaftskritik zu, die sie zeigt: Direkte Anklage, Milieuschilderung, Schicksal einer Figur oder Satire.",
      categories: ["Direkte Anklage", "Milieuschilderung", "Schicksal einer Figur", "Satire"],
      entries: [
        {
          text: "Ein Gedicht von 1844 verflucht im Namen der Weber Gott, König und Vaterland und klagt sie als Schuldige an der Not an.",
          target: 0,
          feedback: "Der Sprecher nennt die Schuldigen offen und klagt sie an.",
        },
        {
          text: "Ein Drama von 1892 zeigt in fünf Akten genau, wie hungernde Weber leben, sprechen und schließlich aufbegehren.",
          target: 1,
          feedback: "Der Text schildert die Lebensverhältnisse möglichst genau und lässt die Not für sich sprechen.",
        },
        {
          text: "Ein Roman von 1895 erzählt, wie eine junge Frau gesellschaftlich geächtet wird, weil ein überholter Ehrenkodex es verlangt.",
          target: 2,
          feedback: "Die Kritik zeigt sich im Lebensweg der Hauptfigur und nicht in einer Anklage.",
        },
        {
          text: "Ein Roman von 1918 macht einen angepassten Karrieristen im Kaiserreich durch Spott und Übertreibung lächerlich.",
          target: 3,
          feedback: "Spott und Übertreibung sind die Mittel der Satire.",
        },
        {
          text: "In einem erfundenen Gedicht ruft der Sprecher den Fabrikbesitzern zu: „Ihr seid schuld an unserer Not! Ändert das!“",
          target: 0,
          feedback: "Der Sprecher nennt die Schuldigen und fordert eine Änderung: eine direkte Anklage.",
        },
        {
          text: "Eine erfundene Erzählung begleitet nur das Mädchen Lea: Wegen eines Gerüchts wird sie von allen gemieden und zieht schließlich weg.",
          target: 2,
          feedback: "Die Erzählung folgt einer einzigen Figur; die Kritik steckt in ihrem Schicksal, ohne dass jemand ausdrücklich angeklagt wird.",
        },
      ],
      conclusion:
        "Vier Formen, vier Zugriffe: Die Anklage nennt Schuldige, die Milieuschilderung zeigt die Lage, das Schicksal einer Figur lässt die Lesenden urteilen, und die Satire stellt durch Spott bloß.",
    },
    casework: {
      title: "Kleider machen Leute: eine Novelle einordnen",
      story:
        "Eine Schülerin fasst für ihr Lesetagebuch zusammen: **In Gottfried Kellers Novelle „Kleider machen Leute“ (1874) hält eine Stadt einen armen Schneidergesellen wegen seines Mantels und der Kutsche für einen polnischen Grafen.** Er wagt nicht zu widersprechen und verlobt sich mit der Tochter eines Amtsrats. Bei der Verlobungsfeier führt ein Maskenzug sein Spiel vor, und die Verwechslung kommt ans Licht. Am Ende heiratet ihn die Braut trotzdem.",
      steps: [
        {
          question: "In welche Epoche gehört die Novelle von 1874?",
          options: ["Vormärz", "Realismus", "Naturalismus"],
          answer: 1,
          explanation:
            "1874 liegt zwischen der Märzrevolution 1848 und dem Ende des 19. Jahrhunderts: Das ist die Zeit des Realismus. Der Vormärz endet mit der Märzrevolution 1848, der Naturalismus beginnt erst etwa 1880.",
        },
        {
          question: "Was kritisiert die Novelle vor allem?",
          options: [
            "Dass Menschen nach Kleidung und Auftreten statt nach ihrem Wesen beurteilt werden.",
            "Dass Weber in Schlesien für einen sehr niedrigen Lohn arbeiten und hungern müssen.",
            "Dass ein Kaiser sein Volk zu gehorsamen Untertanen erzieht.",
          ],
          answer: 0,
          explanation:
            "Eine ganze Stadt hält den Schneider wegen Mantel und Kutsche für einen Grafen. Von Webern und Kaiser ist in der Zusammenfassung keine Rede.",
        },
        {
          question: "Wie kritisiert die Novelle am ehesten?",
          options: [
            "Sie zeigt am Schicksal des Schneiders, wie leicht sich eine Stadt täuschen lässt.",
            "Sie klagt offen die Schuldigen an, nennt sie beim Namen und fordert eine Änderung.",
            "Sie schildert genau und ungeschönt das Elend der Armen in der Stadt.",
          ],
          answer: 0,
          explanation:
            "Die Kritik steckt im Geschehen um den Schneider und den Maskenzug; der Erzähler blickt dabei mit ironischem Lächeln auf die Leichtgläubigkeit der Stadt. Eine offene Anklage oder eine Schilderung von Elend gibt es in der Zusammenfassung nicht.",
        },
        {
          question: "Welche Stellungnahme ist am besten begründet?",
          options: [
            "Das Thema ist noch aktuell: Auch wir urteilen oft nach dem ersten Eindruck, etwa nach Fotos im Netz.",
            "Die Novelle ist über hundert Jahre alt und erzählt von einer anderen Zeit, deshalb ist sie für uns unwichtig.",
            "Die Kritik stimmt nicht, weil heute kein Mensch mehr nach Kleidung urteilt und alle gleich behandelt werden.",
          ],
          answer: 0,
          explanation:
            "Eine begründete Stellungnahme prüft, ob das Problem heute noch eine Rolle spielt, und belegt es mit einem Beispiel. Alter allein macht ein Werk nicht unwichtig, und dass heute kein Mensch mehr nach Kleidung urteile, ist nicht belegt.",
        },
      ],
      verdict:
        "Die Novelle gehört in den Realismus, kritisiert das Urteilen nach dem Schein und tut das durch die Handlung. Eine gute Stellungnahme prüft, ob dieses Problem heute noch eine Rolle spielt, und begründet ihr Urteil.",
    },
    tasks: {
      1: {
        prompt:
          "Wähle eines der Werke aus dieser Lektion und beantworte in vier bis fünf Sätzen die drei Einordnungsfragen: Wann ist es entstanden, und zu welcher Epoche gehört es? Was kritisiert es? Wie kritisiert es?",
        hints: [
          "Gib Autor, Titel und Entstehungsjahr an, bevor du die Epoche nennst.",
          "Nenne bei der Frage nach dem Wie eine der vier Formen und begründe sie mit einem Beispiel aus der Lektion.",
        ],
        model:
          "Hauptmanns Drama „Die Weber“ erschien 1892 und gehört zum Naturalismus, der ab etwa 1880 aktuelle Zeitprobleme genau darstellt. Es spielt zwar 1844, ist aber in der Zeit des Naturalismus entstanden. Kritisiert werden die Armut und die Ausbeutung der Weber durch die Fabrikbesitzer. Das Stück tut das als Milieuschilderung: In fünf Akten zeigt es genau, wie die Weber leben und schließlich aufbegehren.",
        criteria: [
          "Nennt Autor, Titel, Entstehungsjahr und Epoche.",
          "Benennt, was kritisiert wird.",
          "Benennt die Form der Kritik und belegt sie.",
        ],
      },
      2: {
        prompt:
          "Heines Gedicht „Die schlesischen Weber“ wurde in Preußen verboten, und ein Rezitator, der es 1846 in Berlin vortrug, wurde wegen Majestätsbeleidigung angeklagt. Schreibe für die Schülerzeitung in sechs bis acht Sätzen eine Stellungnahme zur Frage, ob Literatur Missstände so scharf anklagen darf. Wäge zwei Sichtweisen ab.",
        hints: [
          "Nenne zuerst ein Argument dafür, dass Literatur scharf anklagen darf, und eines dagegen.",
          "Beziehe dich auf das Gedicht und begründe dein Urteil. Es darf auch für die damalige und die heutige Zeit unterschiedlich ausfallen.",
        ],
        model:
          "Für scharfe Anklage spricht, dass Missstände erst durch Aufmerksamkeit veränderbar werden. Heines Gedicht lenkte den Blick auf die Not der Weber, als die Presse unter Zensur stand. Dagegen lässt sich sagen, dass eine so harte Anklage die Gegenseite nicht zum Zuhören bewegt. Außerdem ist ein Gedicht einseitig und zeigt nur die Sicht der Weber. Ich meine, dass Literatur scharf anklagen darf, wenn sie wirkliche Missstände benennt. Das Verbot war damals ein Mittel, Kritik zu unterdrücken. Heute schützt das Grundgesetz die Meinungs- und Kunstfreiheit, auch wenn sie Grenzen hat. Wichtig bleibt, dass wir die Kritik prüfen und nicht blind übernehmen.",
        criteria: [
          "Nennt ein Argument dafür und eines dagegen.",
          "Bezieht sich auf das Gedicht oder seine Verbotsgeschichte.",
          "Kommt zu einem begründeten eigenen Urteil.",
        ],
      },
    },
  },
  {
    id: "de-sehnsucht-fantasie",
    lb: 2,
    unit: "2.2",
    covers: ["2.2.5"],
    title: "Fantasie, Sehnsucht und Traum in Romantik und Gegenwart",
    intro:
      "Texte erzählen auch von Wünschen, Träumen und Unwirklichem. Du beschreibst, wie das gestaltet ist und was es über Menschen zeigt.",
    paragraphs: [
      "Menschen träumen, wünschen und stellen sich Dinge vor, die es nicht gibt. Auch Literatur tut das. **Sehnsucht** ist ein starkes Verlangen nach etwas, das fehlt oder fern ist, zum Beispiel nach Heimat, Liebe oder Freiheit. Ein **Traum** ist ein Geschehen im Schlaf oder im Tagtraum; Texte rahmen ihn oft durch Wörter wie „einschlafen“ oder „aufwachen“. **Fantasie** meint Vorstellungen davon, wie etwas sein könnte, und **Irreales** ist, was es in der Wirklichkeit nicht gibt, etwa ein sprechender Spiegel oder eine Stadt unter dem Meer. Wenn du eine solche Stelle untersuchst, frage: Woran erkenne ich, dass es nicht wirklich ist? Welches Gefühl steckt dahinter?",
      "In der **Romantik** (in der Literatur ungefähr von 1795 bis in die 1830er-Jahre) spielt die Sehnsucht eine große Rolle. Ihr Zeichen ist die **blaue Blume**, die für Sehnsucht, Liebe und das Streben nach dem Unendlichen steht. Novalis hat sie in seinem Romanfragment „Heinrich von Ofterdingen“ zum Sinnbild gemacht; das Werk erschien 1802 nach seinem Tod. Joseph von Eichendorffs Gedicht „Mondnacht“, um 1835 entstanden und 1837 in seinen „Gedichten“ gedruckt, zeigt Sehnsucht in einem Bild: Die Seele „flog durch die stillen Lande, / Als flöge sie nach Haus“. Achte auf das Wörtchen „als“ und die Form „flöge“. Der **Konjunktiv II** (Wiederholung aus Klasse 8) zeigt: Das ist ein Bild, ein Gefühl, kein wirklicher Flug.",
      "Auch in der Gegenwart erzählen Texte von Unwirklichem. Michael Endes Roman „Die unendliche Geschichte“ (1979) schickt den Jungen Bastian in die Fantasiewelt Phantásien. Er liest ein Buch, und die Geschichte wird für ihn immer mehr zur Wirklichkeit, bis er kurz davor steht, sich in ihr zu verlieren. Hier zeigt das Irreale die Kraft der Fantasie und zugleich ihre Gefahr. Die **Science-Fiction** denkt dagegen Zukünftiges weiter: Sie fragt oft „Was wäre, wenn …?“. Marc-Uwe Klings Roman „QualityLand“ (2017) ist eine satirische **Dystopie**, also die Darstellung einer bedrohlichen Zukunft: Dort optimieren Algorithmen Arbeit, Freizeit und Beziehungen, und ein Händler liefert Waren, die niemand bestellt hat. So spiegelt der Roman Hoffnungen und Ängste unserer Gegenwart.",
      "Warum erzählen Menschen so? Fantasien, Sehnsüchte und Träume gehören zum Menschsein dazu. Sie zeigen, was Menschen vermissen, erhoffen und befürchten. Sie können trösten und Mut machen, sie können aber auch dazu verleiten, der Wirklichkeit auszuweichen; die Texte zeigen beides. Wenn du eine solche Darstellung beschreibst, gehst du in drei Schritten vor: Du erkennst, was unwirklich ist, du benennst das Gefühl oder den Wunsch dahinter, und du fragst, was das über Menschen im Allgemeinen sagt, auch über dich.",
    ],
    terms: [
      {
        term: "Sehnsucht",
        text: "Ein starkes Verlangen nach etwas Fernem oder Fehlendem, zum Beispiel nach Heimat, Liebe oder Freiheit.",
      },
      {
        term: "Irreales",
        text: "Alles, was es in der Wirklichkeit nicht gibt und was ein Text dennoch als Teil seiner Welt erzählt.",
      },
      {
        term: "Romantik",
        text: "Eine Epoche um 1800 und danach, in der Gefühl, Natur, Traum und Sehnsucht eine große Rolle spielen.",
      },
      {
        term: "Konjunktiv II",
        text: "Eine Verbform wie „flöge“ oder „hätte“, mit der etwas als nur vorgestellt oder unwirklich dargestellt wird.",
      },
      {
        term: "Science-Fiction",
        text: "Erzählungen, die mögliche Zukünfte oder andere Welten mit Wissenschaft und Technik als Gedankenspiel entwerfen.",
      },
      {
        term: "Dystopie",
        text: "Die Darstellung einer bedrohlichen oder schlechten Zukunft, oft als Warnung vor heutigen Entwicklungen.",
      },
    ],
    examples: [
      {
        title: "Sehnsucht im Bild: Eichendorffs „Mondnacht“ (letzte Strophe)",
        text: "Und meine Seele spannte\nWeit ihre Flügel aus,\nFlog durch die stillen Lande,\nAls flöge sie nach Haus.",
        analysis:
          "Die Seele breitet ihre Flügel aus und fliegt durch die „stillen Lande“. Ihr Ziel ist „Haus“. Das Bild zeigt **Sehnsucht** nach Geborgenheit und Ferne zugleich. Das Wort „als“ mit dem **Konjunktiv II** „flöge“ macht deutlich, dass es nur ein Gefühl ist: Die Seele fliegt nicht wirklich, sie fühlt sich so. Die „stillen Lande“ passen zur Stimmung der Nacht.",
        source:
          "Joseph von Eichendorff: Mondnacht (um 1835 entstanden, 1837 in den „Gedichten“ gedruckt), letzte Strophe; Text nach Wikisource",
      },
    ],
    takeaway:
      "Texte stellen Sehnsüchte, Träume und Irreales mit Bildern, Signalwörtern und dem Konjunktiv II dar. Die Romantik zeigt Sehnsucht, etwa in der blauen Blume, die Science-Fiction denkt die Zukunft weiter. Beides verrät, was Menschen wünschen und fürchten.",
    sourceIds: ["lp", "wikisource", "dta"],
    quiz: {
      question: "Was zeigt der Konjunktiv II in „Als flöge sie nach Haus“?",
      answer: "Das Geschehen wird nur vorgestellt, nicht als wirklich dargestellt.",
      wrong: [
        "Das Geschehen liegt weit in der Vergangenheit und ist längst vorbei.",
        "Das Geschehen wird als sicher und bereits erledigt dargestellt.",
      ],
      explanation:
        "Der Konjunktiv II mit „als“ drückt aus, dass etwas nur vorgestellt oder verglichen wird, wie bei „als ob“. Mit der Vergangenheit hat das nichts zu tun, und er behauptet auch nicht, dass es wirklich geschieht.",
    },
    workshop: {
      kind: "classify",
      title: "Sehnsucht, Traum, Irreales oder Zukunftsvision?",
      instruction:
        "Lies jeden Satz aus einer erfundenen Erzählung und ordne ihn der Darstellung zu, die er zeigt.",
      categories: ["Sehnsucht", "Traum", "Irreales", "Zukunftsvision"],
      entries: [
        {
          text: "Jeden Abend steht Jonas am Hafen und wünscht sich, auf einem der Schiffe fortzufahren, irgendwohin, wo alles anders ist.",
          target: 0,
          feedback: "Jonas verlangt nach etwas Fernem und Fehlendem; dabei geschieht nichts Unwirkliches.",
        },
        {
          text: "Dann wachte Ben auf: Die Treppe, die endlos in die Tiefe geführt hatte, war nur ein Traum gewesen.",
          target: 1,
          feedback: "Das Aufwachen rahmt das Geschehen als Traum.",
        },
        {
          text: "Der Spiegel im Flur sprach plötzlich mit Lena, und niemand im Haus fand das seltsam.",
          target: 2,
          feedback: "Ein sprechender Spiegel kommt in der Wirklichkeit nicht vor und wird doch selbstverständlich erzählt.",
        },
        {
          text: "Im Jahr 2150 entscheidet ein Rechner anhand von Daten, wer in der Stadt wohnen darf, und niemand kann ihm widersprechen.",
          target: 3,
          feedback: "Der Text denkt eine mögliche Zukunft mit Technik weiter, wie es die Science-Fiction tut.",
        },
        {
          text: "Er sehnte sich nach einem Ort, den er nie gesehen hatte und der doch wie Heimat klang.",
          target: 0,
          feedback: "Das Verlangen nach einem fernen, unbekannten Ort ist Sehnsucht.",
        },
        {
          text: "Im Jahr 2200 haben Menschen auf dem Mars eine Stadt gebaut, in der Roboter fast alle Arbeiten übernehmen.",
          target: 3,
          feedback: "Eine Stadt auf dem Mars mit Robotern gehört zu einer möglichen technischen Zukunft: eine Zukunftsvision.",
        },
      ],
      conclusion:
        "Sehnsucht ist ein Gefühl, ein Traum ist durch Einschlafen und Aufwachen gerahmt, Irreales gehört selbstverständlich zur erzählten Welt, und Zukunftsvisionen denken Technik weiter.",
    },
    casework: {
      title: "Miras Traum vom See",
      story:
        "In einer erfundenen Erzählung heißt es: **„Seit Wochen träumt Mira jede Nacht dasselbe: Sie steht am Ufer eines Sees, der bis zum Horizont silbern leuchtet, und eine Stimme ruft sie beim Namen.“** Morgens, beim Aufwachen, spürt sie ein Ziehen in der Brust, als hätte sie etwas Wichtiges verloren. In der Schule zeichnet sie den See in jedes Heft.",
      steps: [
        {
          question: "Woran erkennst du, dass es sich um einen Traum handelt?",
          options: [
            "An „träumt“ und „beim Aufwachen“, die das Geschehen einrahmen.",
            "An der geheimnisvollen Stimme, die Mira am Seeufer beim Namen ruft.",
            "An der Zeichnung des Sees, die Mira in jedes ihrer Hefte malt.",
          ],
          answer: 0,
          explanation:
            "Wörter wie „träumt“ und „beim Aufwachen“ rahmen das Geschehen als Traum. Eine Stimme oder eine Zeichnung allein wären auch in einer wirklichen Szene möglich.",
        },
        {
          question: "Was verrät das „Ziehen in der Brust, als hätte sie etwas Wichtiges verloren“?",
          options: [
            "Eine Sehnsucht nach etwas, das fehlt und das Mira nicht benennen kann.",
            "Eine konkrete Angst vor dem tiefen Wasser, die Mira im Traum überfällt.",
            "Eine Erinnerung an einen wirklichen Urlaub am Meer, den Mira vergessen hat.",
          ],
          answer: 0,
          explanation:
            "Das Gefühl, etwas verloren zu haben, ohne zu wissen was, ist typisch für Sehnsucht. Von Angst oder einem Urlaub steht im Text nichts, und der Konjunktiv II „hätte“ zeigt, dass es nur ein Gefühl ist.",
        },
        {
          question: "Welche Funktion hat der Traum für die Figur?",
          options: [
            "Er zeigt einen inneren Wunsch nach Weite, der im Alltag keinen Platz hat.",
            "Er liefert Hinweise auf einen wirklich existierenden Ort in der Nähe.",
            "Er verschönert die Erzählung, hat aber keine Bedeutung für Mira.",
          ],
          answer: 0,
          explanation:
            "Der Traum kehrt jede Nacht wieder und prägt Miras Tage bis in ihre Hefte. Er macht sichtbar, was in ihr vorgeht, und ist deshalb mehr als Schmuck.",
        },
        {
          question: "Warum darf man solche Darstellungen als Facette menschlicher Existenz sehen?",
          options: [
            "Weil viele Menschen Sehnsüchte kennen und der Text sie fassbar macht.",
            "Weil Träume immer die Zukunft vorhersagen und deshalb für alle Menschen wichtig sind.",
            "Weil nur Schriftstellerinnen und Schriftsteller solche Gefühle haben und sie aufschreiben.",
          ],
          answer: 0,
          explanation:
            "Sehnsüchte und Träume gehören zum Menschsein, und die Literatur gibt ihnen ein Bild. Dass Träume die Zukunft vorhersagen, ist nicht belegt, und solche Gefühle haben nicht nur Schreibende.",
        },
      ],
      verdict:
        "Der Text rahmt den Traum durch Einschlafen und Aufwachen und zeigt in einem Bild eine Sehnsucht, die Mira nicht benennen kann. Solche Darstellungen machen innere Wünsche sichtbar, die viele Menschen kennen.",
    },
    tasks: {
      1: {
        prompt:
          "Beschreibe in vier bis fünf Sätzen, wie in der Strophe aus Eichendorffs „Mondnacht“ Sehnsucht dargestellt wird. Gehe auf das Bild der Seele und auf den Konjunktiv II ein.",
        hints: [
          "Nenne, was die Seele im Bild tut und wohin sie fliegt.",
          "Erkläre, was das Wort „als“ mit dem Konjunktiv II „flöge“ bewirkt.",
        ],
        model:
          "In der Strophe wird die Seele wie ein Vogel dargestellt: Sie spannt weit ihre Flügel aus und fliegt durch die „stillen Lande“. Ihr Ziel ist „Haus“, also Geborgenheit und Heimat; darin liegt die Sehnsucht. Der Konjunktiv II in „Als flöge sie nach Haus“ macht deutlich, dass es kein wirklicher Flug ist, sondern ein Gefühl, das sich so anfühlt. Die ruhigen Bilder zeigen, dass diese Sehnsucht nicht schmerzt, sondern friedlich wirkt.",
        criteria: [
          "Beschreibt das Bild der Seele mit eigenen Worten.",
          "Benennt das Gefühl der Sehnsucht und sein Ziel.",
          "Erklärt die Wirkung des Konjunktivs II.",
        ],
      },
      2: {
        prompt:
          "Entwirf eine Idee für eine Science-Fiction-Geschichte in vier bis fünf Sätzen. Beginne mit „Was wäre, wenn …?“ und erkläre, welche Hoffnung oder Angst unserer Gegenwart sie spiegelt.",
        hints: [
          "Wähle eine heutige Entwicklung, zum Beispiel Smartphones, künstliche Intelligenz oder den Klimawandel, und denke sie weiter.",
          "Beschreibe, wie sich die Menschen in deiner Zukunft fühlen: Sind sie zufrieden oder bedroht?",
        ],
        model:
          "Was wäre, wenn jede Schülerin und jeder Schüler einen digitalen Assistenten hätte, der alle Hausaufgaben löst? In meiner Geschichte merkt eine Klasse nach einem Jahr, dass kaum noch jemand selbst denkt, und einer Schülerin fällt auf, dass sie nichts mehr wirklich versteht. Sie beschließt, wieder selbst zu rechnen. Die Geschichte spiegelt die Sorge, dass uns Technik das Denken abnimmt und wir dadurch etwas verlernen, aber auch die Hoffnung, dass Menschen sich bewusst dagegen entscheiden können.",
        criteria: [
          "Beginnt mit einer „Was wäre, wenn“-Frage und denkt eine Entwicklung weiter.",
          "Beschreibt, wie es den Menschen in dieser Zukunft geht.",
          "Benennt eine Hoffnung oder Angst der Gegenwart.",
        ],
      },
    },
  },
  {
    id: "de-buch-und-inszenierung",
    lb: 2,
    unit: "2.2",
    covers: ["2.2.6"],
    title: "Buch, Theater und Film vergleichen",
    intro:
      "Ein Buch wird anders erzählt als ein Film oder eine Aufführung. Mit klaren Kriterien vergleichst du Vorlage und Umsetzung.",
    paragraphs: [
      "Eine Geschichte kann in mehreren Medien erzählt werden: als **Buch**, als **Theaterinszenierung** auf der Bühne oder als **Verfilmung**. Wolfgang Herrndorfs Jugendroman „Tschick“ erschien 2010. 2011 wurde eine Bühnenfassung des Romans am Staatsschauspiel Dresden uraufgeführt, und 2016 kam der Film von Fatih Akin ins Kino. Der Stoff bleibt derselbe, aber jedes Medium erzählt anders. Beim Vergleich fragst du nicht, welches „richtiger“ ist, sondern was jedes Medium anders macht und welche Wirkung dadurch entsteht.",
      "Damit dein Vergleich nicht beliebig wird, nutzt du fünf **Vergleichskriterien**, wie sie im Unterricht üblich sind. **Handlung:** Was wird übernommen, gekürzt, verändert oder ergänzt? **Figuren:** Wie werden sie gezeigt, und wie werden ihre Gedanken und Gefühle erkennbar? **Raum und Zeit:** Wo und wann spielt es, und wie wird das dargestellt, durch Beschreibung, Bühnenbild oder Drehorte? **Mittel:** Womit wird erzählt: Sprache, Kamera, Schnitt, Musik, Licht, Kostüme? **Wirkung:** Was fühlst und denkst du, und was bleibt offen? Notiere zu jedem Kriterium eine Beobachtung aus dem Buch und eine aus der Umsetzung.",
      "Jedes Medium hat Besonderheiten. Im **Buch** erfährst du Gedanken in Worten und stellst dir Gesichter, Stimmen und Orte selbst vor. Du bestimmst das Lesetempo. Der **Film** arbeitet mit Bild und Ton: Kamera und Schnitt lenken deinen Blick, Musik verstärkt die Stimmung, und ein Film muss meist kürzen. Der Film „Die unendliche Geschichte“ von 1984 erzählt zum Beispiel nur den ersten Teil des Romans von Michael Ende (1979). Das **Theater** spielt live: Schauspielerinnen und Schauspieler stehen vor dir auf der Bühne, jede Aufführung ist ein wenig anders, und wegen der begrenzten Bühne wechseln Orte oft durch Licht, Umbau oder Andeutung.",
      "Ein faires Urteil braucht Kriterien. „Der Film weicht vom Buch ab“ ist noch kein Urteil, denn Abweichung ist nicht schon Schwäche. Frage: Was will diese Umsetzung erreichen, und gelingt es ihr? Manchmal sind Autorinnen und Autoren mit einer Verfilmung ihres Buches nicht zufrieden, manchmal gefällt sie ihnen gerade in neuer Form. Das zeigt, dass es verschiedene Sichtweisen gibt. Du darfst deine eigene haben, wenn du sie mit Beobachtungen aus Buch und Umsetzung belegst.",
    ],
    terms: [
      {
        term: "Inszenierung",
        text: "Die Umsetzung eines Stücks oder Textes auf der Bühne mit Regie, Schauspiel, Bühnenbild, Licht und Musik.",
      },
      {
        term: "Verfilmung",
        text: "Die Umsetzung eines Buches als Film mit Bild, Ton, Schnitt und Schauspiel.",
      },
      {
        term: "Bühnenfassung",
        text: "Die für das Theater bearbeitete Fassung eines Romans, die kürzt und die Handlung in spielbare Szenen überträgt.",
      },
      {
        term: "Vergleichskriterien",
        text: "Die fünf Fragen, mit denen du Buch und Umsetzung vergleichst: Handlung, Figuren, Raum und Zeit, Mittel, Wirkung.",
      },
      {
        term: "Kürzung",
        text: "Das Weglassen von Teilen der Vorlage, weil Film oder Bühne weniger Zeit haben als ein Buch.",
      },
    ],
    examples: [
      {
        title: "Eine Vergleichsnotiz zu „Die unendliche Geschichte“",
        text: "Handlung: Der Roman von Michael Ende (1979) wird im Film von Wolfgang Petersen (1984) nur zum Teil erzählt, nämlich der erste Teil.\nFiguren: Im Buch liest man, was Bastian denkt und fühlt; im Film erkennt man es an Gesicht, Stimme und Musik.\nMittel: Im Buch entsteht Phantásien durch Sprache und Vorstellungskraft, im Film durch Bilder und Ton.",
        analysis:
          "Die Notiz ordnet jede Beobachtung einem Kriterium zu und nennt zu Buch und Film je eine Seite. Sie urteilt nicht, sondern beschreibt, wie sich die Mittel unterscheiden. Die **Kürzung** auf den ersten Teil ist eine Besonderheit des Films, der weniger Zeit hat als ein Buch. Aus solchen Beobachtungen kannst du später ein begründetes Urteil entwickeln.",
        source:
          "Michael Ende: Die unendliche Geschichte (Roman, 1979); Wolfgang Petersen: Die unendliche Geschichte (Film, 1984); eigene Notiz; Angaben zu Regie und Jahr nach filmportal.de",
      },
    ],
    takeaway:
      "Du vergleichst Buch und Umsetzung mit fünf Kriterien: Handlung, Figuren, Raum und Zeit, Mittel und Wirkung. Jedes Medium hat eigene Stärken: Das Buch lebt von Sprache und Vorstellung, der Film von Bild und Ton, das Theater vom Spiel vor Publikum. Ein Urteil begründest du mit Beobachtungen.",
    sourceIds: ["lp", "filmportal"],
    quiz: {
      question: "Welches Kriterium betrifft die Frage, ob eine Umsetzung Ereignisse des Buches kürzt oder verändert?",
      answer: "Die Handlung: Was wird übernommen, gekürzt, verändert oder ergänzt?",
      wrong: [
        "Die Mittel: Womit wird erzählt, etwa mit Kamera, Schnitt oder Musik?",
        "Die Wirkung: Was empfindet das Publikum, und was bleibt offen?",
      ],
      explanation:
        "Das Kürzen und Verändern von Ereignissen betrifft die Handlung. Die Mittel fragen nach der Erzählweise, zum Beispiel nach Kamera oder Musik, und die Wirkung danach, was das Publikum empfindet.",
    },
    workshop: {
      kind: "classify",
      title: "Buch, Theater oder Film?",
      instruction:
        "Ordne jede Beobachtung dem Medium zu, auf das sie am besten zutrifft: Buch, Theater oder Film.",
      categories: ["Buch", "Theater", "Film"],
      entries: [
        {
          text: "Beim Lesen stellst du dir Gesichter, Stimmen und Orte selbst vor und bestimmst das Lesetempo.",
          target: 0,
          feedback: "Nur das Buch überlässt Bilder und Stimmen deiner Vorstellung und deinem Tempo.",
        },
        {
          text: "Die Schauspielerinnen und Schauspieler stehen live auf der Bühne, und jede Aufführung ist ein wenig anders.",
          target: 1,
          feedback: "Das Spiel vor Publikum, bei dem jeder Abend anders ist, kennzeichnet das Theater.",
        },
        {
          text: "Eine Nahaufnahme zeigt das Gesicht der Figur genau, und die Kamera folgt ihr danach durch eine Straße.",
          target: 2,
          feedback: "Die Nahaufnahme ist ein Mittel der Kamera und gehört zum Film.",
        },
        {
          text: "Die Gedanken der Hauptfigur stehen als Text auf der Seite, und du liest sie Wort für Wort.",
          target: 0,
          feedback: "Gedanken in Worten auf der Seite mitzuteilen ist die Stärke des erzählenden Textes.",
        },
        {
          text: "Ein Szenenwechsel gelingt durch Licht, Umbau oder wenige Requisiten, weil die Bühne nicht beliebig viele Orte zeigen kann.",
          target: 1,
          feedback: "Die begrenzte Bühne zwingt das Theater, Orte anzudeuten.",
        },
        {
          text: "Der Schnitt wechselt in Sekunden zwischen zwei Orten und lenkt den Blick des Publikums.",
          target: 2,
          feedback: "Der Schnitt ist ein typisches Mittel des Films.",
        },
      ],
      conclusion:
        "Jedes Medium hat eigene Mittel: Das Buch arbeitet mit Sprache und Vorstellung, das Theater mit Spiel und Bühne, der Film mit Bild, Ton und Schnitt.",
    },
    casework: {
      title: "Der Sommer der Möwen: Buch und Film im Vergleich",
      story:
        "In einer Klassenarbeit sollen Lernende Buch und Film zu einem erfundenen Jugendroman vergleichen: **Im Buch „Der Sommer der Möwen“ verbringt der 14-jährige Tom die Ferien bei seinem Opa am Meer, und wir lesen seine Gedanken über die Trennung seiner Eltern. Im Film sieht man Tom oft schweigend am Strand, dazu läuft ruhige Musik. Die Elternszenen fehlen, dafür gibt es eine Verfolgungsjagd mit Booten.**",
      steps: [
        {
          question: "Welches Kriterium betrifft die fehlenden Elternszenen und die neue Verfolgungsjagd?",
          options: ["Die Handlung", "Die Mittel", "Raum und Zeit"],
          answer: 0,
          explanation:
            "Es geht darum, was übernommen, gekürzt und ergänzt wurde: Das ist die Handlung. Die Mittel fragen dagegen nach Kamera, Musik oder Sprache.",
        },
        {
          question: "Wie macht der Film Toms Gefühle erkennbar, obwohl man seine Gedanken nicht liest?",
          options: [
            "Durch Bilder, Mimik und Musik, zum Beispiel durch Toms Schweigen am Strand.",
            "Durch einen langen Text auf dem Bildschirm, der alle Gedanken erklärt.",
            "Gar nicht, denn Gefühle lassen sich nur in Worten ausdrücken und also nur lesen.",
          ],
          answer: 0,
          explanation:
            "Der Film zeigt Gefühle mit seinen eigenen Mitteln: Bild, Gesicht und Musik. Ein langer erklärender Text auf dem Bildschirm ist kein typisches Mittel des Films, und dass Gefühle nur lesbar seien, stimmt nicht.",
        },
        {
          question: "Welche Wirkung hat die Verfolgungsjagd wahrscheinlich?",
          options: [
            "Sie bringt Tempo und Spannung, nimmt aber Raum für Toms innere Entwicklung.",
            "Sie macht den Film langsamer und ruhiger und gibt den Gedanken mehr Raum.",
            "Sie ändert nichts an der Wirkung, weil nur die Handlung des Films betroffen ist.",
          ],
          answer: 0,
          explanation:
            "Eine Verfolgungsjagd erhöht meist Tempo und Spannung. Dafür bleibt weniger Zeit für Toms Gedanken, die im Buch eine große Rolle spielen.",
        },
        {
          question: "Welches Urteil ist am besten begründet?",
          options: [
            "Der Film ist anders: Er gewinnt Spannung, verliert aber Toms Gedanken; ob das gelingt, hängt vom Ziel ab.",
            "Der Film ist schlecht, weil er vom Buch abweicht und Szenen weglässt, die im Buch wichtig sind.",
            "Der Film ist besser, weil er kürzer ist und schneller erzählt, ohne lange Gedanken der Figur.",
          ],
          answer: 0,
          explanation:
            "Ein gutes Urteil beschreibt Gewinn und Verlust und fragt nach der Absicht der Umsetzung. Abweichung allein oder Kürze allein sind keine Begründung.",
        },
      ],
      verdict:
        "Der Vergleich zeigt: Die Umsetzung verändert die Handlung und nutzt andere Mittel, und damit verändert sich die Wirkung. Dein Urteil begründest du mit diesen Beobachtungen und nicht mit „besser“ oder „schlechter“.",
    },
    tasks: {
      1: {
        prompt:
          "Vergleiche das Buch „Die unendliche Geschichte“ (Michael Ende, 1979) mit dem Film von 1984 in vier bis fünf Sätzen nach den Kriterien Handlung und Mittel. Nutze die Angaben im Beispiel dieser Lektion.",
        hints: [
          "Nenne, welchen Teil des Romans der Film erzählt und was deshalb fehlt.",
          "Beschreibe zum Kriterium Mittel, womit das Buch und womit der Film seine Welt entstehen lässt.",
        ],
        model:
          "Kriterium Handlung: Der Film von 1984 erzählt nur den ersten Teil des Romans. Deshalb fehlt, was später im Buch geschieht, und die Geschichte endet früher. Kriterium Mittel: Im Buch entsteht die Welt Phantásien allein durch Sprache, und jede Leserin und jeder Leser stellt sie sich anders vor. Im Film sehen und hören wir dagegen Landschaften, Figuren und Musik, die die Regie festgelegt hat. Das ist ein Gewinn an Anschaulichkeit, aber die eigene Vorstellung hat weniger Raum.",
        criteria: [
          "Nennt, welchen Teil des Romans der Film erzählt.",
          "Vergleicht die Mittel von Buch und Film.",
          "Urteilt mit Bezug auf die Kriterien statt nur mit „besser“ oder „schlechter“.",
        ],
      },
      2: {
        prompt:
          "Eine Theatergruppe will einen Roman, der auf einer langen Reise durch mehrere Länder spielt, als Bühnenstück zeigen. Schreibe einen Rat in fünf bis sechs Sätzen: Was muss sie beim Übertragen verändern oder weglassen? Begründe mit mindestens zwei Kriterien.",
        hints: [
          "Überlege, wie die Bühne viele Orte zeigen kann und was dafür gekürzt werden muss.",
          "Frage dich, wie die Gedanken der Hauptfigur auf der Bühne hörbar oder sichtbar werden.",
        ],
        model:
          "Die Gruppe sollte die Handlung kürzen und nur die wichtigsten Stationen der Reise zeigen, denn ein Stück dauert nur wenige Stunden, und die Bühne kann nicht jeden Ort nachbauen. Für Raum und Zeit helfen Licht, ein drehbares Bühnenbild oder wenige Requisiten, die einen Ort andeuten. Die Gedanken der Hauptfigur, die im Roman erzählt werden, können durch einen Monolog oder durch ein Gespräch mit einer anderen Figur hörbar werden. Wichtig ist, dass die Wirkung erhalten bleibt: Das Publikum soll die Sehnsucht nach der Ferne spüren, auch wenn die Reise nur auf einer kleinen Bühne stattfindet.",
        criteria: [
          "Nennt mindestens zwei Vergleichskriterien beim Namen.",
          "Schlägt konkrete Veränderungen für die Bühne vor.",
          "Begründet jeden Vorschlag mit einer Besonderheit des Theaters.",
        ],
      },
    },
  },
  {
    id: "de-leseportfolio",
    lb: 2,
    unit: "2.2",
    covers: ["2.2.7"],
    title: "Leseerfahrungen dokumentieren: Portfolio, Wandzeitung, Filmprojekt",
    intro:
      "Ein Leseportfolio sammelt, was du gelesen und gedacht hast. So wird aus deinem Lesen ein Nachweis deiner Leseerfahrung.",
    paragraphs: [
      "Wer viel liest, vergisst leicht, was er gelesen und gedacht hat. Deshalb **dokumentierst** du deine **Leseerfahrungen**: Du hältst fest, was du gelesen hast, was dir aufgefallen ist und was du daraus mitnimmst. Der Lehrplan nennt als Formen zum Beispiel eine Wandzeitung, ein Lektüreportfolio oder ein Filmprojekt. Zu deinen Leseerfahrungen soll mindestens eine **Ganzschrift** gehören, also ein Buch, das du ganz liest. Es stammt von einem deutschsprachigen Autor oder einer deutschsprachigen Autorin des 19. oder angehenden 20. Jahrhunderts und hat eine jugendnahe oder aktuelle Thematik. Der Lehrplan schreibt kein bestimmtes Werk vor. Zwei mögliche Beispiele sind Theodor Storms Novelle „Pole Poppenspäler“ (1874) und Joseph von Eichendorffs Novelle „Aus dem Leben eines Taugenichts“ (1826). Welche Ganzschrift du liest, klärst du mit deiner Lehrkraft.",
      "Wie sieht eine gute Dokumentation aus? Ein **Leseportfolio** ist eine Mappe oder Datei, die du nach und nach füllst. Sie enthält meist ein **Deckblatt**, ein **Inhaltsverzeichnis**, eine **Leseliste** mit Autor, Titel und Erscheinungsjahr aller Bücher und zu jedem wichtigen Buch mehrere Beiträge, zum Beispiel eine kurze Inhaltsangabe, ein Figurenporträt, eine Lieblingsstelle als Zitat mit Seitenangabe und deine begründete Meinung. Am Ende steht ein **Rückblick**, in dem du dein Lesen bewertest. Eine **Wandzeitung** zeigt dasselbe auf einem Plakat für die Klasse, mit Titelbild, Kurzinhalt, Zitat und Bewertung. Ein **Filmprojekt** stellt ein Buch in einem kurzen Video vor, zum Beispiel mit Titelbild, gesprochenem Kurzinhalt, einem vorgelesenen Zitat und deiner Meinung.",
      "Woran erkennst du eine gelungene Dokumentation? Du kannst vier Kriterien prüfen. **Richtig:** Autor, Titel und Jahr stimmen, Zitate sind wörtlich übernommen und mit Seitenzahl belegt. **Eigenständig:** Du erzählst nicht nur nach, sondern bringst eigene Gedanken, eine begründete Meinung und Fragen ein. **Übersichtlich:** Gliederung, Überschriften und eine lesbare Gestaltung helfen allen, die dein Portfolio ansehen. **Vielfältig:** Du zeigst unterschiedliche Leseerfahrungen, zum Beispiel einen Roman, ein Gedicht und einen Sachtext. Mit einer solchen Checkliste überprüfst du dein Portfolio, bevor du es abgibst.",
      "Der wichtigste Teil ist die **Reflexion** deiner Leseerfahrungen. Frage dich: Was hat mich überrascht? Was habe ich über Menschen oder über mich gelernt? Was würde ich weiterempfehlen, und warum? Wie lese ich am liebsten, und was könnte ich ausprobieren? Schon in Klasse 8 hast du mit einem Lesejournal oder einem digitalen Portfolio dokumentiert, was du liest, und dich mit anderen darüber ausgetauscht (Wiederholung). Jetzt gehst du weiter: Du vergleichst, wie sich dein Lesen verändert hat, und verbindest deine Beobachtungen mit dem, was du über Literatur gelernt hast, etwa über Novelle, Motive oder Gesellschaftskritik.",
    ],
    terms: [
      {
        term: "Ganzschrift",
        text: "Ein Buch oder Werk, das du vollständig liest und nicht nur in Auszügen kennenlernst.",
      },
      {
        term: "Lektüreportfolio",
        text: "Eine Mappe oder Datei, in der du Leseliste, Beiträge zu Büchern und einen Rückblick sammelst.",
      },
      {
        term: "Wandzeitung",
        text: "Ein Plakat, das ein Buch mit Titelbild, Kurzinhalt, Zitat und Bewertung für die Klasse vorstellt.",
      },
      {
        term: "Leseliste",
        text: "Eine Übersicht aller gelesenen Bücher mit Autor, Titel und Erscheinungsjahr.",
      },
      {
        term: "Reflexion",
        text: "Das Nachdenken über das eigene Lesen: was überrascht hat, was du gelernt hast und was du empfiehlst.",
      },
    ],
    examples: [
      {
        title: "Ein Eintrag im Lesetagebuch (eigene Beispielseite)",
        text: "Autor und Titel: Theodor Storm: Pole Poppenspäler (1874)\nInhalt in zwei Sätzen: Paul lernt als Junge Lisei kennen, die Tochter eines fahrenden Puppenspielers. Als er eine Puppe beschädigt, bekennt er sich später zu seinem Fehler und schützt Lisei vor Strafe.\nMeine Frage: Warum traut sich Paul, den Fehler zuzugeben?\nMeine Meinung: Mir gefällt, dass Paul seinen Fehler zugibt, obwohl er Ärger riskiert. Damit schützt er Lisei vor der Strafe.",
        analysis:
          "Der Eintrag nennt Autor, Titel und Jahr, fasst knapp zusammen, stellt eine Frage und begründet die Meinung mit einer Handlung der Figur. Das ist mehr als eine Nacherzählung. Zu einer Lieblingsstelle gehört außerdem ein wörtliches Zitat mit Seitenzahl aus deiner Ausgabe, das du selbst ergänzt.",
        source: "Theodor Storm: Pole Poppenspäler (Novelle, 1874); Inhaltsangabe und Eintrag eigens verfasst, Inhalt nach dem Text auf Wikisource",
      },
    ],
    takeaway:
      "Du dokumentierst deine Leseerfahrungen in einer Wandzeitung, einem Lektüreportfolio oder einem Filmprojekt, darunter mindestens eine Ganzschrift. Gut ist eine Dokumentation, wenn sie richtig, eigenständig, übersichtlich und vielfältig ist und mit einer Reflexion endet.",
    sourceIds: ["lp", "wikisource"],
    quiz: {
      question: "Was unterscheidet eine Dokumentation der Leseerfahrung von einer reinen Nacherzählung?",
      answer: "Sie enthält zusätzlich eine begründete Meinung und einen Rückblick.",
      wrong: [
        "Sie ist deutlich länger und gibt jede Szene des Buches Satz für Satz wieder.",
        "Sie verzichtet auf Angaben zu Autor, Titel und Erscheinungsjahr.",
      ],
      explanation:
        "Eine Dokumentation zeigt, was du gelesen und gedacht hast: Sie enthält deine Meinung mit Begründung und eine Reflexion. Länge und Vollständigkeit der Nacherzählung machen das nicht aus, und ohne Angaben zum Buch ist sie unvollständig.",
    },
    workshop: {
      kind: "timeline",
      title: "Ein Leseportfolio Schritt für Schritt aufbauen",
      instruction:
        "Bringe die fünf Arbeitsschritte, mit denen du ein Leseportfolio zu einer Ganzschrift anlegst, in die Reihenfolge, in der du sie nacheinander erledigst: Jeder Schritt baut auf dem vorigen auf.",
      categories: [],
      entries: [
        {
          text: "Du legst eine Leseliste an und wählst eine Ganzschrift aus, die zu deinem Interesse und zur Vorgabe passt.",
          target: 0,
          feedback: "Am Anfang steht die Auswahl: Ohne Buch und Ziel kannst du nichts dokumentieren.",
        },
        {
          text: "Beim Lesen notierst du Eindrücke, Fragen und Zitate mit Seitenangabe in deinem Lesetagebuch.",
          target: 1,
          feedback: "Während des Lesens sammelst du das Material, aus dem später die Beiträge entstehen.",
        },
        {
          text: "Aus deinen Notizen arbeitest du die Beiträge aus, zum Beispiel Inhaltsangabe, Figurenporträt und begründete Meinung.",
          target: 2,
          feedback: "Erst mit den Notizen kannst du die Beiträge schreiben.",
        },
        {
          text: "Du ordnest die Beiträge, legst das Inhaltsverzeichnis an und gestaltest das Deckblatt.",
          target: 3,
          feedback: "Verzeichnis und Deckblatt entstehen, wenn du weißt, welche Beiträge das Portfolio enthält.",
        },
        {
          text: "Du prüfst das fertige Portfolio an einer Checkliste und überarbeitest, was noch fehlt.",
          target: 4,
          feedback: "Zum Schluss kontrollierst du Richtigkeit, Eigenständigkeit, Übersichtlichkeit und Vielfalt.",
        },
      ],
      conclusion:
        "Auswahl, Notizen, Beiträge, Ordnung und Prüfung bauen aufeinander auf: Jeder Schritt braucht das Ergebnis des vorigen.",
    },
    casework: {
      title: "Bens Seite für das Lektüreportfolio",
      story:
        "Ben gibt für sein Lektüreportfolio diese Seite ab: **„Das Buch ist gut. Es geht um einen Jungen und ein Mädchen. Am Ende sind sie zusammen. Ich fand es gut, weil es spannend war. Quelle: Internet.“** Seine Lehrerin bittet ihn, die Seite zu überarbeiten, damit sie als Dokumentation einer Leseerfahrung taugt.",
      steps: [
        {
          question: "Welche Angaben braucht Ben mindestens, damit klar ist, welches Buch gemeint ist?",
          options: [
            "Autor, Titel und Erscheinungsjahr.",
            "Die Seitenzahl und das Gewicht des Buches.",
            "Der Preis und die Regalnummer in der Schulbibliothek.",
          ],
          answer: 0,
          explanation:
            "Ohne Autor, Titel und Jahr weiß niemand, welches Buch gemeint ist. Seitenzahl, Gewicht, Preis und Regalnummer gehören nicht zur Dokumentation der Leseerfahrung.",
        },
        {
          question: "Wie verbessert Ben seine Meinung „Ich fand es gut, weil es spannend war“?",
          options: [
            "Er zitiert eine Stelle mit Seitenangabe und erklärt, was sie spannend macht.",
            "Er schreibt „sehr gut“ statt „gut“ und setzt zur Verstärkung ein Ausrufezeichen.",
            "Er streicht die Meinung, weil eine Dokumentation sachlich bleiben soll.",
          ],
          answer: 0,
          explanation:
            "Eine Meinung wird überzeugend, wenn sie sich auf eine Textstelle stützt. Ein stärkeres Wort oder ein Ausrufezeichen begründet nichts, und eine Dokumentation der Leseerfahrung will gerade die eigene Meinung zeigen.",
        },
        {
          question: "Wie geht Ben mit „Quelle: Internet“ um?",
          options: [
            "Er nennt die genaue Adresse mit Abrufdatum und trennt Fremdes von Eigenem.",
            "Er lässt es stehen, weil Quellen nur bei gedruckten Büchern nötig sind.",
            "Er löscht den Satz, damit niemand merkt, woher seine Angaben stammen.",
          ],
          answer: 0,
          explanation:
            "Fremde Angaben belegst du genau und kennzeichnest sie. Auch Internetquellen gehören dazu, und Verschweigen wäre unredlich.",
        },
        {
          question: "Welche Ergänzung macht aus der Seite eine Reflexion der Leseerfahrung?",
          options: [
            "Ein Absatz dazu, was ihn überrascht und was er über sich gelernt hat.",
            "Eine zweite Inhaltsangabe, in der er die Handlung mit anderen Worten wiedergibt.",
            "Ein Foto vom Buchcover mit Titel und dem Namen des Autors.",
          ],
          answer: 0,
          explanation:
            "Reflexion heißt nachdenken: Was hat mich überrascht, und was nehme ich mit? Eine zweite Inhaltsangabe oder ein Foto zeigen das nicht.",
        },
      ],
      verdict:
        "Bens Seite wird zur Dokumentation, wenn sie das Buch genau nennt, die Meinung am Text begründet, Quellen belegt und mit einer Reflexion endet. So zeigt sie, was er gelesen und gedacht hat.",
    },
    tasks: {
      1: {
        prompt:
          "Entwirf das Inhaltsverzeichnis eines Leseportfolios zu einer Ganzschrift mit sechs bis acht Punkten. Begründe zwei Punkte in je einem Satz.",
        hints: [
          "Denke an Deckblatt, Leseliste, Beiträge zum Buch und einen Rückblick.",
          "Begründe, was der Punkt für diejenigen leistet, die dein Portfolio lesen.",
        ],
        model:
          "1. Deckblatt mit Titel, Name und Datum. 2. Inhaltsverzeichnis. 3. Leseliste mit Autor, Titel und Jahr. 4. Inhaltsangabe zur Ganzschrift. 5. Figurenporträt der Hauptfigur. 6. Lieblingsstelle mit Zitat und Seitenangabe. 7. Meine begründete Meinung. 8. Rückblick auf meine Leseerfahrung. Die Leseliste zeigt auf einen Blick, was ich gelesen habe. Der Rückblick ist wichtig, weil dort steht, was ich aus dem Lesen für mich mitnehme und nicht nur, was im Buch steht.",
        criteria: [
          "Enthält mindestens sechs sinnvolle Punkte.",
          "Enthält Beiträge mit eigener Meinung und einen Rückblick.",
          "Begründet zwei Punkte.",
        ],
      },
      2: {
        prompt:
          "Du sollst dein Lieblingsbuch auf einer Wandzeitung vorstellen. Beschreibe in fünf bis sechs Sätzen, welche Elemente du aufnimmst, wie du sie anordnest und woran du erkennst, dass die Wandzeitung gelungen ist.",
        hints: [
          "Denke an Titelbild, Kurzinhalt, Zitat, Meinung und Bewertung.",
          "Überlege, was jemand, der vorbeigeht, in zwei Minuten verstehen soll.",
        ],
        model:
          "In der Mitte der Wandzeitung steht das Titelbild mit Autor, Titel und Erscheinungsjahr. Links daneben steht ein kurzer Inhalt in drei Sätzen, ohne das Ende zu verraten. Darunter kommt ein Zitat mit Seitenangabe, das für mich die Stimmung des Buches zeigt. Rechts schreibe ich meine begründete Meinung und eine Bewertung mit Sternen. Gelungen ist die Wandzeitung, wenn man in zwei Minuten versteht, worum es geht und warum das Buch lesenswert ist, wenn die Angaben stimmen und wenn mein eigener Gedanke erkennbar ist.",
        criteria: [
          "Nennt mindestens vier Elemente der Wandzeitung.",
          "Erklärt die Anordnung oder den Zweck der Elemente.",
          "Nennt Kriterien, an denen sich eine gelungene Wandzeitung zeigt.",
        ],
      },
    },
  },
];
