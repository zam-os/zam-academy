import type { Lesson } from "../model/types";

/** Lernbereich 1: Sprechen und Zuhören (Einheiten 1.1 bis 1.4). */
export const LB1: Lesson[] = [
  {
    id: "de-zuhoeren-reagieren",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.1"],
    title: "Aktiv zuhören und angemessen reagieren",
    intro:
      "Wer gut zuhört, versteht nicht nur Inhalte, sondern auch, was jemand von dir will. Dann kannst du passend antworten.",
    paragraphs: [
      "Zuhören ist mehr als stilles Dabeisitzen. Wer aktiv zuhört, verfolgt den Beitrag konzentriert, merkt sich die Kernaussagen und achtet darauf, **was** jemand sagt und **was damit erreicht werden soll**. Dahinter steckt oft ein kommunikativer Zusammenhang: Eine **Aufforderung** („Räum bitte endlich dein Zeug weg!“) verlangt eine Handlung, eine **Provokation** („Du verstehst das sowieso nicht.“) will dich aus der Ruhe bringen, eine Information will verstanden werden. Erst wenn du diese Absicht erkennst, kannst du angemessen reagieren.",
      "Für die Reaktion hast du mehrere Werkzeuge, von denen du einige aus Klasse 8 wiederholst. Mit einer **Nachfrage** klärst du Unklares oder bittest um ein Beispiel („Was meinst du mit ‚unfair‘?“). Mit einer **Paraphrase** gibst du das Gehörte mit eigenen Worten wieder („Du meinst also, dass der Termin zu kurzfristig ist?“) und zeigst, dass du verstanden hast; die andere Person kann dich korrigieren. Mit einem **Gegenargument** widersprichst du sachlich und begründest, warum du eine andere Position hast. Welches Werkzeug passt, hängt davon ab, ob du noch etwas verstehen musst oder schon urteilen kannst.",
      "Auch eine Rückmeldung nach einem Vortrag oder einer Diskussionsrunde ist eine Reaktion. Sie hilft, wenn sie **konstruktiv** ist. Bewährt hat sich dieser Aufbau: Du nennst zuerst, was gelungen ist, beschreibst dann konkret eine Stelle, die besser werden kann, und sagst, wie. „Du sprichst zu schnell“ ist ein Vorwurf. „Bei den Zahlen sprichst du schnell, eine Pause danach würde mir beim Mitschreiben helfen“ ist eine Rückmeldung, mit der die andere Person etwas anfangen kann. Bleib dabei sachlich und sprich von deinem Eindruck, nicht über die Person. Danach lohnt sich ein kurzer Blick auf dich selbst: Habe ich die Absicht richtig erkannt, und hat meine Reaktion zum Anlass gepasst?",
    ],
    terms: [
      {
        term: "Aktives Zuhören",
        text: "Konzentriertes Zuhören, bei dem du Inhalt und Absicht der sprechenden Person erfasst und zeigst, dass du folgst.",
      },
      {
        term: "Nachfrage",
        text: "Eine Frage, die Unklares klärt oder einen Gedanken vertieft, etwa nach einem Beispiel oder einer Begründung.",
      },
      {
        term: "Paraphrase",
        text: "Das Gehörte mit eigenen Worten wiedergeben, um das Verständnis abzusichern.",
      },
      {
        term: "Gegenargument",
        text: "Ein begründeter Einwand, der eine Behauptung einer anderen Person sachlich infrage stellt.",
      },
      {
        term: "Konstruktive Rückmeldung",
        text: "Eine Rückmeldung, die Gelungenes nennt und eine konkrete Verbesserung vorschlägt.",
      },
    ],
    examples: [
      {
        title: "Ein Gespräch über Handys in der Schule (eigens verfasst)",
        text: "Sven: „Handys gehören an der Schule verboten. Sie lenken nur ab.“\nLena: „Du meinst also, dass Handys im Unterricht stören?“\nSven: „Genau, und in den Pausen auch.“\nLena: „Was meinst du mit ‚auch in den Pausen‘? Wo stören sie da?“",
        analysis:
          "Lena fasst Svens Aussage zuerst mit eigenen Worten zusammen (**Paraphrase**) und gibt ihm so die Chance, sie zu korrigieren. Dann fragt sie an einer konkreten Stelle nach (**Nachfrage**). Sie widerspricht noch nicht: Erst verstehen, dann urteilen.",
      },
    ],
    takeaway:
      "Aktiv zuhören heißt, Inhalt **und** Absicht zu erfassen. Dann wählst du die passende Reaktion: Nachfrage bei Unklarem, Paraphrase zur Absicherung, Gegenargument für den sachlichen Widerspruch und eine Rückmeldung, die Gelungenes nennt und Konkretes verbessert.",
    sourceIds: ["lp"],
    quiz: {
      question: "Wie sicherst du ab, dass du eine Aussage richtig verstanden hast?",
      answer: "Ich gebe sie mit eigenen Worten wieder und frage, ob es so gemeint war.",
      wrong: [
        "Ich antworte sofort mit meiner eigenen Meinung zum Thema der Aussage.",
        "Ich bitte die andere Person, die Aussage noch einmal wörtlich zu wiederholen.",
      ],
      explanation:
        "Eine Paraphrase zeigt, dass du verstanden hast, und gibt der anderen Person die Chance, dich zu korrigieren. Wer sofort die eigene Meinung sagt, überspringt das Verstehen. Eine wörtliche Wiederholung prüft das Gedächtnis, nicht das Verständnis.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Reaktion ist das?",
      instruction:
        "In der Klasse sagt jemand: „Wir sollten den Ausflug in den Wald statt ins Museum machen, weil das billiger ist.“ Ordne jede Antwort der Reaktion zu, die sie darstellt. Eine Rückmeldung bewertet den Beitrag selbst und gibt einen Tipp, ein Gegenargument widerspricht dem Vorschlag.",
      categories: ["Nachfrage", "Paraphrase", "Gegenargument", "Konstruktive Rückmeldung"],
      entries: [
        {
          text: "„Wie viel billiger wäre der Wald denn im Vergleich zum Museum?“",
          target: 0,
          feedback: "Sie fragt nach einer genaueren Angabe zu einer Behauptung und will etwas klären.",
        },
        {
          text: "„Wenn ich dich richtig verstehe, möchtest du in den Wald, weil das Geld spart.“",
          target: 1,
          feedback: "Sie gibt die Aussage mit eigenen Worten wieder, um das Verständnis abzusichern.",
        },
        {
          text: "„Billiger stimmt, aber bei Regen fällt der Ausflug aus, und dann zahlen wir für nichts.“",
          target: 2,
          feedback: "Sie widerspricht sachlich und liefert eine Begründung für die andere Position.",
        },
        {
          text: "„Dein Vorschlag ist gut begründet. Wenn du noch eine Zahl nennst, überzeugt er noch mehr.“",
          target: 3,
          feedback: "Sie nennt zuerst eine Stärke und schlägt dann eine konkrete Verbesserung vor.",
        },
        {
          text: "„Was genau heißt ‚billiger‘: die Kosten für alle zusammen oder pro Kopf?“",
          target: 0,
          feedback: "Sie fragt an einem Wort der Aussage nach, das unklar ist, und gibt nichts mit eigenen Worten wieder.",
        },
        {
          text: "„Der Wald ist zwar günstig, aber nicht barrierefrei, und dann könnte Jonas nicht mitkommen.“",
          target: 2,
          feedback: "Sie widerspricht mit einem Grund, der den Vorschlag infrage stellt.",
        },
      ],
      conclusion:
        "Nachfrage, Paraphrase, Gegenargument und Rückmeldung haben jeweils einen eigenen Zweck. Die passende Reaktion hängt davon ab, ob du gerade Verständnis oder ein Urteil brauchst.",
    },
    casework: {
      title: "Provokation oder Aufforderung?",
      story:
        "In der AG der Schülerzeitung sagt Jonas zu Aylin: **„Du schreibst doch eh immer nur Kurzes. Mach endlich mal den Bericht über den Sporttag fertig!“** Abgabetermin für den Bericht ist Donnerstag. Aylin zählt innerlich bis fünf.",
      steps: [
        {
          question: "Welche Absicht steckt im ersten Satz („Du schreibst doch eh immer nur Kurzes.“)?",
          options: [
            "Eine Provokation: Jonas stichelt und will Aylin aus der Ruhe bringen.",
            "Eine Information: Jonas beschreibt sachlich und ohne Wertung, wie Aylin arbeitet.",
            "Eine Bitte: Jonas hofft auf Hilfe bei einem längeren Text.",
          ],
          answer: 0,
          explanation:
            "Das Wort „eh“ und das „immer nur“ klingen abwertend. Der Satz soll nicht informieren, sondern treffen.",
        },
        {
          question: "Welche Absicht steckt im zweiten Satz („Mach endlich mal den Bericht über den Sporttag fertig!“)?",
          options: [
            "Eine Frage: Jonas will wissen, wie weit Aylin mit dem Bericht ist.",
            "Eine Aufforderung: Aylin soll den Bericht endlich abgeben.",
            "Ein Lob: Jonas würdigt Aylins bisherige Arbeit für die Zeitung.",
          ],
          answer: 1,
          explanation:
            "Der Befehlssatz verlangt eine Handlung. Auch wenn der Ton unfreundlich ist, steckt hier ein sachliches Anliegen.",
        },
        {
          question: "Aylin will nur die Aufforderung beantworten und die Stichelei übergehen. Welche Reaktion ist angemessen und sachlich?",
          options: [
            "„Mach du doch erst mal deinen eigenen Teil fertig, du Besserwisser, bevor du mich anmachst!“",
            "„Du möchtest den Bericht bald haben? Bis Donnerstag liegt er bei dir.“",
            "„Wenn du das so sagst, schreibe ich am besten gar nichts mehr.“",
          ],
          answer: 1,
          explanation:
            "Aylin überhört den Stich, gibt die Aufforderung mit eigenen Worten wieder und sagt konkret zu. Das hält das Gespräch sachlich. Die anderen Antworten geben die Stichelei zurück oder drohen mit Rückzug.",
        },
        {
          question: "Aylin will die Provokation nicht übergehen. Welche Reaktion entschärft sie, ohne zu streiten?",
          options: [
            "Sie gibt zurück: „Du schreibst ja nicht mal Kurzes, du Meckerer!“",
            "Sie fragt nach: „Was meinst du damit, dass ich immer nur Kurzes schreibe?“",
            "Sie lacht spöttisch und sagt, dass Jonas ohnehin nichts verstehe.",
          ],
          answer: 1,
          explanation:
            "Eine Nachfrage zwingt Jonas, seine Behauptung zu erklären. Das nimmt dem Stich die Schärfe und bringt das Gespräch zurück zur Sache.",
        },
      ],
      verdict:
        "Aylin trennt Provokation und Auftrag: Sie nimmt die Aufforderung ernst und antwortet mit einer klaren Zusage. Will sie den Stich nicht übergehen, fragt sie nach, statt zurückzustechen.",
    },
    tasks: {
      1: {
        prompt:
          "Lena sagt: „Handys im Unterricht sind total unfair, weil manche eines haben und andere nicht.“ Schreibe eine Paraphrase und eine Nachfrage dazu.",
        hints: [
          "Beginne die Paraphrase mit „Du meinst also, …“ und nutze eigene Worte.",
          "Eine gute Nachfrage bezieht sich auf ein Wort oder eine Behauptung von Lena, zum Beispiel auf „unfair“.",
        ],
        model:
          "Paraphrase: „Du meinst also, dass es ungerecht ist, wenn nur manche Schülerinnen und Schüler im Unterricht ein Handy nutzen können?“ Nachfrage: „Was genau findest du daran unfair: dass manche Zugang zu Informationen haben oder dass andere ausgeschlossen sind?“ So zeige ich Lena, dass ich ihren Gedanken verstanden habe, und gebe ihr die Gelegenheit, ihn genauer zu erklären.",
        criteria: [
          "Die Paraphrase gibt Lenas Aussage mit eigenen Worten wieder.",
          "Die Nachfrage bezieht sich auf eine konkrete Stelle der Aussage.",
          "Der Ton ist sachlich und enthält keine Wertung gegen Lena.",
        ],
      },
      2: {
        prompt:
          "Eine Mitschülerin hat einen Vortrag über Plastikmüll gehalten. Sie sprach leise und schnell, ihre Folien waren aber sehr anschaulich. Schreibe eine konstruktive Rückmeldung in vier bis fünf Sätzen.",
        hints: [
          "Beginne mit einer konkreten Stärke und nenne eine Stelle, an der du sie erkannt hast.",
          "Beschreibe die Schwäche als Beobachtung („Bei den Zahlen habe ich dich schlecht verstanden …“) und schlage eine Verbesserung vor.",
        ],
        model:
          "Deine Folien mit den Fotos vom Strand haben mir das Thema sofort anschaulich gemacht, das fand ich sehr gelungen. Bei den Zahlen zur Müllmenge habe ich dich nur schwer verstanden, weil du schnell und leise gesprochen hast. Wenn du nach jeder Zahl kurz Pause machst und etwas lauter sprichst, kann ich besser mitschreiben. Mit dieser Änderung wäre dein Vortrag noch überzeugender.",
        criteria: [
          "Nennt zuerst eine konkrete Stärke.",
          "Beschreibt eine Schwäche als Beobachtung und nicht als Vorwurf.",
          "Macht einen Vorschlag, den die Mitschülerin umsetzen kann.",
        ],
      },
    },
  },
  {
    id: "de-hoertexte-notieren",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.2"],
    title: "Hör- und Filmtexte in Notizen und Protokollen sichern",
    intro:
      "Gehörtes verfliegt schnell. Mit Stichwortnotiz und Protokoll hältst du fest, was du später für Diskussion und Referat brauchst.",
    paragraphs: [
      "Reportagen, Interviews, Gesprächsrunden im Radio, Auszüge aus Hörbüchern, Reden oder Dokumentarfilme hörst und siehst du meist nur einmal. Sprechen ist schneller als Schreiben, deshalb kannst du nicht alles mitschreiben. Das musst du auch nicht. Du hältst fest, was du später brauchst: **Kernaussagen**, Namen, Zahlen, Daten und Fachbegriffe. Vorher notierst du das Thema und eine Frage, auf die du eine Antwort suchst. Beim Hören schreibst du **Stichwörter** statt ganzer Sätze, nutzt Abkürzungen („z. B.“, „u. a.“) und eigene Zeichen und lässt rechts einen Rand für Fragen. Bei Filmen notierst du die Minute, damit du die Stelle wiederfindest. Direkt nach dem Hören ergänzt du Lücken und machst die Notiz lesbar, solange du dich noch erinnerst.",
      "Die **Stichwortnotiz** ist deine eigene Gedächtnisstütze. Nur du musst sie verstehen, deshalb sind Abkürzungen, Pfeile und eigene Ordnung erlaubt. Ein **Protokoll** dagegen schreibst du für andere; das Protokollieren kennst du aus Klasse 8. Es ist sachlich, steht meist im Präsens und enthält keine eigene Wertung. Im Protokollkopf stehen Thema, Datum, Ort sowie Beginn und Ende. Bei einem Hörtext nennst du außerdem die Quelle, zum Beispiel Titel und Sendung, und wer protokolliert. Aussagen anderer gibst du sinngemäß wieder, meist in indirekter Rede mit dem Konjunktiv I (Wiederholung aus Klasse 8): „Die Stadtverwaltung erklärt, die Nutzung koste 300 Euro im Jahr.“",
      "Man unterscheidet vor allem zwei Protokollformen. Das **Verlaufsprotokoll** gibt wieder, wie ein Gespräch abläuft: in der zeitlichen Reihenfolge und mit den einzelnen Beiträgen, auf das Wesentliche gekürzt, sodass man sieht, wer was gesagt hat. Es eignet sich für Interviews und Gesprächsrunden. Das **Ergebnisprotokoll** gibt die Beiträge nicht einzeln wieder. Es fasst die Kerninhalte zusammen und hält fest, was beschlossen wurde, oft auch, wer etwas übernimmt und bis wann. Es eignet sich für Sitzungen und Absprachen. Beide Formen bleiben sachlich und stehen meist im Präsens. Sie unterscheiden sich darin, wie viel vom Verlauf erhalten bleibt.",
      "Notizen und Protokolle sind Arbeitsgrundlagen. Für eine Diskussion brauchst du Aussagen mit Quelle: Wer hat das gesagt, und woher weiß die Person es? Trenne dabei Tatsachen („Es gibt 24 Räder“) von Meinungen („Das ist zu wenig“). Für ein Referat ordnest du die Stichwörter unter Überschriften, übernimmst Zahlen und Zitate mit Quellenangabe und erhältst so deine Gliederung. Prüfe immer, ob deine Notiz auch in zwei Wochen noch verständlich ist. Wenn nicht, ergänze sie jetzt.",
    ],
    terms: [
      {
        term: "Stichwortnotiz",
        text: "Eine kurze Mitschrift aus Stichwörtern und Abkürzungen, die du für dich selbst anlegst.",
      },
      {
        term: "Protokollkopf",
        text: "Der Kopf eines Protokolls mit Thema, Datum, Ort, Beginn und Ende sowie den Beteiligten oder der Quelle.",
      },
      {
        term: "Verlaufsprotokoll",
        text: "Ein Protokoll, das den Ablauf eines Gesprächs mit den einzelnen Beiträgen in zeitlicher Reihenfolge wiedergibt.",
      },
      {
        term: "Ergebnisprotokoll",
        text: "Ein Protokoll, das die Kerninhalte und Beschlüsse zusammenfasst, ohne die einzelnen Beiträge wiederzugeben.",
      },
      {
        term: "Indirekte Rede",
        text: "Die sinngemäße Wiedergabe einer Aussage, bei der das Verb meist im Konjunktiv I steht: Er sagt, es sei zu spät.",
      },
    ],
    examples: [
      {
        title: "Aus einer Meldung werden Notiz und Protokoll (eigens verfasst)",
        text: "Gehört: „Der Naturschutzverein hat im Frühjahr 40 Nistkästen im Stadtpark aufgehängt. Bis Juni waren 27 davon bewohnt, vor allem von Kohlmeisen.“\nNotiz: Nistkästen – Stadtpark – Frühjahr – 40 Stück – bis Juni 27 bewohnt – v. a. Kohlmeisen\nProtokoll: Die Meldung berichtet, der Verein habe im Frühjahr 40 Nistkästen im Stadtpark aufgehängt. Bis Juni seien 27 bewohnt gewesen, vor allem von Kohlmeisen.",
        analysis:
          "Die Notiz lässt alles weg, was du aus dem Zusammenhang ergänzen kannst: Verben, Artikel und Füllwörter bleiben draußen, Zahlen und Namen stehen. Das Protokoll gibt dieselbe Aussage in ganzen Sätzen, sachlich und in **indirekter Rede** wieder. So entstehen aus einer Information zwei Texte für zwei Zwecke: eine Gedächtnisstütze für dich und ein Text für andere.",
      },
    ],
    takeaway:
      "Beim Hören notierst du Stichwörter, Zahlen und Namen und ergänzt sie sofort. Ein Verlaufsprotokoll hält den Ablauf mit den Beiträgen fest, ein Ergebnisprotokoll die Kerninhalte und Beschlüsse. Beide sind sachlich und stehen meist im Präsens.",
    sourceIds: ["lp", "duden"],
    quiz: {
      question: "Was unterscheidet ein Ergebnisprotokoll von einem Verlaufsprotokoll?",
      answer: "Es fasst Kerninhalte und Beschlüsse zusammen, statt jeden Beitrag wiederzugeben.",
      wrong: [
        "Es gibt die Beiträge in der Reihenfolge wieder, in der sie gesprochen wurden.",
        "Es besteht nur aus Stichwörtern, die allein die schreibende Person verstehen muss.",
      ],
      explanation:
        "Das Ergebnisprotokoll fasst zusammen, was besprochen und beschlossen wurde. Die Wiedergabe in zeitlicher Reihenfolge kennzeichnet das Verlaufsprotokoll, die persönliche Stichwortsammlung die Stichwortnotiz.",
    },
    workshop: {
      kind: "classify",
      title: "Notiz oder Protokoll?",
      instruction:
        "Ordne jeden Eintrag der Form zu, zu der er passt. Manche Einträge sind Beispieltexte, andere beschreiben ein Merkmal.",
      categories: ["Stichwortnotiz", "Verlaufsprotokoll", "Ergebnisprotokoll"],
      entries: [
        {
          text: "Leihräder – Start Mai – 24 Stück – 300 € im Jahr – Herbst doppelt so viele",
          target: 0,
          feedback: "Nur Stichwörter, Zahlen und Gedankenstriche: Das ist eine Notiz für dich selbst.",
        },
        {
          text: "Diese Form ist nur für dich bestimmt, deshalb sind Abkürzungen und eigene Zeichen erlaubt.",
          target: 0,
          feedback: "Abkürzungen und eigene Zeichen darf nur eine Notiz für dich selbst enthalten.",
        },
        {
          text: "Zuerst fragt die Moderatorin nach den Kosten. Die Stadtverwaltung antwortet, die Nutzung koste 300 Euro im Jahr. Danach geht es um die Zahl der Räder.",
          target: 1,
          feedback: "Die Beiträge stehen in der Reihenfolge des Gesprächs und nennen, wer spricht: ein Verlaufsprotokoll.",
        },
        {
          text: "Diese Form gibt den Gesprächsverlauf in zeitlicher Reihenfolge wieder und nennt, wer was gesagt hat.",
          target: 1,
          feedback: "Reihenfolge und Sprecher gehören zum Verlaufsprotokoll.",
        },
        {
          text: "Beschluss: Die Stadt stellt bis zum Herbst 24 weitere Leihräder auf. Zuständig ist Herr Brandt, Frist ist der 15. September.",
          target: 2,
          feedback: "Beschluss, Zuständigkeit und Frist sind typisch für ein Ergebnisprotokoll.",
        },
        {
          text: "Diese Form fasst die Kerninhalte zusammen und hält fest, was beschlossen wurde, wer es übernimmt und bis wann.",
          target: 2,
          feedback: "Kerninhalte, Beschlüsse und Zuständigkeiten ohne einzelne Beiträge: Ergebnisprotokoll.",
        },
      ],
      conclusion:
        "Die Notiz ist für dich, das Verlaufsprotokoll zeigt den Ablauf, das Ergebnisprotokoll hält fest, was gilt. Die Form richtet sich nach dem Zweck.",
    },
    casework: {
      title: "Eine Gesprächsrunde im Radio",
      story:
        "In einer Radio-Gesprächsrunde fragt Moderatorin Keller: „Warum braucht unsere Stadt einen Skatepark?“ Tim Sander von der Schülervertretung antwortet: „Weil wir bisher nur den Parkplatz am Supermarkt haben. Dort ist es gefährlich.“ Stadtplanerin Roth entgegnet: „Ein Park braucht Platz und kostet Geld. Der Standort am Sportplatz liegt nah an Wohnhäusern, deshalb müssen wir den Lärm zuerst prüfen.“ Am Ende einigen sich beide: **Die Stadt prüft den Standort, und Frau Roth meldet sich bis Ende März bei der Schülervertretung.**",
      steps: [
        {
          question: "Was schreibst du beim Hören der Runde auf?",
          options: [
            "Stichwörter und Namen: Skatepark, Parkplatz gefährlich, Sportplatz nah an Häusern, Lärm prüfen",
            "Jeden Satz Wort für Wort, möglichst in Schönschrift, damit nichts verloren geht, auch wenn ich nicht alles schaffe",
            "Nur das Ergebnis am Ende, weil alles Davorliegende für die Notiz keine Rolle spielt",
          ],
          answer: 0,
          explanation:
            "Stichwörter, Namen und Zahlen genügen, wenn du sie sofort ergänzt. Wörtlich mitschreiben schaffst du nicht, und das Ergebnis allein verrät dir nicht, wie es dazu kam.",
        },
        {
          question: "Du schreibst ein Verlaufsprotokoll der Runde. Welcher Satz gehört hinein?",
          options: [
            "Frau Roth erklärt, der Standort liege nah an Wohnhäusern; der Lärm müsse zuerst geprüft werden.",
            "Frau Roth war ziemlich genervt von Tims Idee und hat sie eigentlich nicht ernst genommen.",
            "Skatepark – Sportplatz – Lärm – prüfen – Ende März – Schülervertretung – Roth – Sander",
          ],
          answer: 0,
          explanation:
            "Das Verlaufsprotokoll gibt Beiträge sachlich, meist im Präsens und in indirekter Rede wieder. „Genervt“ ist eine Wertung, und bloße Stichwörter versteht später niemand.",
        },
        {
          question: "Welcher Satz gehört in ein Ergebnisprotokoll der Runde?",
          options: [
            "Beschluss: Die Stadt prüft den Standort. Frau Roth meldet sich bis Ende März.",
            "Tim Sander von der Schülervertretung erklärt, der Parkplatz am Supermarkt sei gefährlich.",
            "Die Moderatorin eröffnet die Runde mit der Frage, warum die Stadt einen Skatepark braucht.",
          ],
          answer: 0,
          explanation:
            "Ein Ergebnisprotokoll hält Beschluss, Zuständigkeit und Frist fest. Die anderen Sätze geben einzelne Beiträge wieder und gehören ins Verlaufsprotokoll.",
        },
        {
          question: "Du hältst später ein Referat über Freizeitangebote. Wie nutzt du deine Notizen?",
          options: [
            "Ich ordne die Stichwörter unter Überschriften und übernehme Aussagen mit Namen und Quelle.",
            "Ich lese die Notizen im Vortrag nacheinander vor, damit nichts verfälscht wird.",
            "Ich schreibe sie wörtlich ab, ohne sie zu ordnen, damit sie vollständig bleiben.",
          ],
          answer: 0,
          explanation:
            "Notizen sind Rohmaterial. Erst durch Ordnen und eine Quellenangabe werden sie zur Grundlage für Gliederung, Aussagen und Belege.",
        },
      ],
      verdict:
        "Aus derselben Gesprächsrunde entstehen drei brauchbare Texte: eine Stichwortnotiz beim Hören, ein Verlaufsprotokoll für den Ablauf und ein Ergebnisprotokoll für das, was gilt. Alle bleiben sachlich.",
    },
    tasks: {
      1: {
        prompt:
          "Du hörst im Radio: „Der Verein Lesezeit bietet ab Oktober jeden Dienstag eine Vorlesestunde für Kinder an. Sie beginnt um 15 Uhr in der Stadtbücherei und dauert 45 Minuten. Die Teilnahme kostet nichts, man muss sich aber bis Freitag anmelden.“ Schreibe eine Stichwortnotiz mit höchstens acht Stichwörtern und danach zwei Protokollsätze, die dieselben Angaben sachlich wiedergeben.",
        hints: [
          "Streiche, was du aus dem Zusammenhang ergänzen kannst: Artikel, Verben und Füllwörter.",
          "Prüfe an deiner Notiz: Stehen Veranstalter, Zeit, Ort, Dauer, Kosten und Anmeldung darin?",
        ],
        model:
          "Notiz: Verein Lesezeit – ab Oktober – dienstags 15 Uhr – Stadtbücherei – 45 Min. – kostenlos – Anmeldung bis Fr. Protokoll: Die Sendung berichtet, der Verein Lesezeit biete ab Oktober jeden Dienstag um 15 Uhr in der Stadtbücherei eine Vorlesestunde für Kinder an. Sie dauere 45 Minuten und sei kostenlos, eine Anmeldung sei bis Freitag nötig.",
        criteria: [
          "Die Notiz besteht aus Stichwörtern ohne ganze Sätze und nennt Veranstalter, Zeit, Ort, Dauer, Kosten und Anmeldung.",
          "Die Protokollsätze sind sachlich, stehen im Präsens und enthalten keine eigene Meinung.",
          "Die Protokollsätze geben nur Angaben aus dem Hörtext wieder.",
        ],
      },
      2: {
        prompt:
          "Deine Gruppe plant ein Referat zum Thema „Nachhaltig einkaufen“. Im Radio läuft dazu eine Gesprächsrunde von 20 Minuten mit drei Gästen. Beschreibe in fünf bis sieben Sätzen, wie du vorgehst: Wie bereitest du dich vor, wie notierst du beim Hören, welche Protokollform wählst du und warum, und wie nutzt du die Notizen danach?",
        hints: [
          "Denke an die vier Schritte: vor dem Hören, beim Hören, direkt danach und später im Referat.",
          "Begründe die Protokollform mit dem Zweck: Soll man den Ablauf nachvollziehen oder nur wissen, was gilt?",
        ],
        model:
          "Vor dem Hören notiere ich das Thema und zwei Fragen, auf die ich eine Antwort suche. Beim Hören schreibe ich nur Stichwörter, Namen und Zahlen auf und lasse rechts Platz für Fragen. Direkt danach ergänze ich Lücken und notiere, welche Person was gesagt hat. Als Protokoll wähle ich ein Verlaufsprotokoll, weil die Gäste unterschiedlicher Meinung sind und man ihren Gedankengang nachvollziehen soll. Für das Referat ordne ich die Stichwörter unter Überschriften und übernehme Aussagen mit dem Namen der Person und der Sendung als Quelle.",
        criteria: [
          "Nennt mindestens zwei Techniken beim Mitschreiben, zum Beispiel Stichwörter, Abkürzungen oder einen Rand für Fragen.",
          "Wählt eine Protokollform und begründet die Wahl mit dem Zweck.",
          "Beschreibt, wie die Notizen für das Referat geordnet und weiterverwendet werden.",
        ],
      },
    },
  },
  {
    id: "de-vortraege-beurteilen",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.3"],
    title: "Vorträge und Gespräche nach Kriterien beurteilen",
    intro:
      "Ein Vortrag wirkt durch Worte, Stimme und Körper. Mit Kriterien beurteilst du fair und hilfst dir und anderen, besser zu werden.",
    paragraphs: [
      "Wenn du sagst, ein Vortrag war „gut“ oder „langweilig“, hast du einen Eindruck. Eine Beurteilung braucht mehr: Kriterien, an denen du prüfst, und Beobachtungen, die dein Urteil belegen. Typische Kriterien sind Inhalt und Aufbau (richtig, vollständig, verständlich geordnet), Sprache (Wortwahl, Satzbau, erklärte Fachbegriffe) und Vortragsweise (Stimme, Körpersprache, Blickkontakt). Ein **Beobachtungsbogen** hilft dabei: Zu jedem Kriterium notierst du, was du genau gesehen oder gehört hast, wie du es beurteilst und was besser werden könnte. So wird dein Urteil nachvollziehbar, und du schärfst dein Gespür für gute Redebeiträge, auch für deine eigenen.",
      "Kommunikation läuft über drei Kanäle. Die **verbale** Ebene sind die Wörter: Inhalt, Wortwahl und Aufbau. Die **paraverbale** Ebene ist die Stimme: Sprechtempo, Lautstärke, Betonung und Pausen, also das Wie des Sprechens. Die **nonverbale** Ebene ist die Körpersprache: Mimik, Gestik, Blickkontakt und Haltung. Manchmal wird die Stimme auch zur nonverbalen Kommunikation gezählt; hier trennen wir sie von der Körpersprache. Wichtig ist, dass du alle Kanäle im Blick hast, denn zusammen bestimmen sie, wie ein Vortrag wirkt.",
      "Nonverbale Signale beeinflussen, wie viel von einer Information ankommt. Passen sie zu den Worten, unterstützen sie sie: Eine Handbewegung zeigt, wie groß etwas ist, und Blickkontakt zeigt, dass du die Zuhörenden meinst. Widersprechen sie den Worten, wirkt der Vortrag oft unglaubwürdig. Wer „Ich freue mich auf eure Fragen“ sagt und dabei zur Wand blickt, verwirrt das Publikum. Auch Stimme und Blick spielen eine Rolle: Wer zum Zettel spricht, wird oft schlechter verstanden, und wer eintönig spricht, verliert leicht die Aufmerksamkeit. Vorsicht bei Deutungen: Verschränkte Arme können Ablehnung bedeuten, aber auch, dass jemandem kalt ist. Beschreibe darum zuerst, was du siehst („Sie hält die Karten vors Gesicht“), und deute erst dann vorsichtig („Dadurch wirkt sie unsicher“).",
      "Dasselbe gilt für Gesprächsverläufe. Du kannst beobachten: Wer spricht wie lange? Werden Beiträge aufgegriffen, oder reden alle aneinander vorbei? Fällt jemand anderen ins Wort? Bleibt das Gespräch beim Thema und sachlich? Am Ende suchst du dir ein bis zwei Dinge aus, die du im nächsten eigenen Beitrag verbessern willst, zum Beispiel öfter aufschauen oder bei Zahlen langsamer sprechen. Deine Rückmeldung an andere gibst du wie beim aktiven Zuhören: zuerst die Stärke, dann eine konkrete Verbesserung.",
    ],
    terms: [
      {
        term: "Beurteilungskriterium",
        text: "Ein Maßstab, an dem du einen Beitrag prüfst, zum Beispiel Aufbau, Verständlichkeit oder Blickkontakt.",
      },
      {
        term: "Verbale Kommunikation",
        text: "Die Verständigung durch Wörter und Sätze, also Inhalt, Wortwahl und Aufbau.",
      },
      {
        term: "Paraverbale Kommunikation",
        text: "Die Art, wie etwas gesagt wird: Sprechtempo, Lautstärke, Betonung, Stimmführung und Pausen.",
      },
      {
        term: "Nonverbale Kommunikation",
        text: "Die Verständigung ohne Worte durch Körpersprache: Mimik, Gestik, Blickkontakt und Haltung.",
      },
      {
        term: "Beobachtung und Deutung",
        text: "Eine Beobachtung beschreibt, was du siehst oder hörst; eine Deutung schließt daraus auf Gefühle oder Absichten.",
      },
    ],
    examples: [
      {
        title: "Beobachtung oder Deutung? (eigens verfasst)",
        text: "Beobachtung: Mia schaut beim Vortrag fast nur auf ihre Karten.\nDeutung: Mia ist schlecht vorbereitet.\nBesser: Mia schaut fast nur auf ihre Karten. Dadurch wirkt sie unsicher, und ich fühle mich nicht angesprochen.",
        analysis:
          "Die Beobachtung lässt sich prüfen: Alle im Raum können sehen, wohin Mia schaut. Die Deutung dagegen kann falsch sein, denn Mia kann gut vorbereitet und nur aufgeregt sein. Die bessere Rückmeldung nennt zuerst die Beobachtung und beschreibt danach die Wirkung als eigenen Eindruck.",
      },
    ],
    takeaway:
      "Beurteile nach Kriterien und trenne Beobachtung von Deutung. Achte auf Wörter (verbal), Stimme (paraverbal) und Körpersprache (nonverbal): Passen sie zusammen, unterstützen sie die Information, widersprechen sie einander, wirkt der Vortrag oft unglaubwürdig.",
    sourceIds: ["lp"],
    quiz: {
      question: "Welcher Satz ist eine Beobachtung und kein Urteil?",
      answer: "Nico sieht beim Sprechen die ganze Zeit zur Tafel und nicht zur Klasse.",
      wrong: [
        "Nico hat überhaupt kein Interesse an seinem Thema und wirkt gelangweilt.",
        "Nicos Vortrag war einfach schlecht, das hat jeder gemerkt.",
      ],
      explanation:
        "Nur der erste Satz beschreibt, was man sehen kann. Die anderen beiden schließen auf Gefühle oder fällen ein Urteil, ohne eine Beobachtung zu nennen.",
    },
    workshop: {
      kind: "mark",
      title: "Einen Beobachtungsbogen auswerten",
      instruction:
        "Hier siehst du die Aufzeichnung einer Beobachterin. Wähle oben einen Kanal und klicke die Sätze an, die dazu passen: verbal sind die Wörter, paraverbal die Stimme, nonverbal der Körper. Nicht jeder Satz gehört zu einem Kanal.",
      labels: ["Verbal (Wörter)", "Paraverbal (Stimme)", "Nonverbal (Körper)"],
      text: [
        { t: "Beobachtungsbogen zum Vortrag über Solarenergie, Dienstag, dritte Stunde, zwölf Zuhörende. " },
        {
          t: "Tom erklärt den Begriff ‚Photovoltaik‘ mit dem Beispiel eines Garagendachs. ",
          label: 0,
          feedback:
            "Inhalt und Wortwahl gehören zur verbalen Ebene: Tom erklärt einen Fachbegriff mit einem Beispiel.",
        },
        {
          t: "Er spricht ruhig und betont die wichtigen Wörter. ",
          label: 1,
          feedback: "Wie jemand spricht, ruhig und mit Betonung, ist die Stimme und damit paraverbal.",
        },
        {
          t: "Er steht aufrecht und blickt immer wieder in die Klasse. ",
          label: 2,
          feedback: "Aufrechte Haltung und Blick in die Klasse sind Körpersprache, also nonverbal.",
        },
        { t: "Der Vortrag findet im Klassenzimmer statt. " },
        {
          t: "Vor jeder Zahl macht er eine kurze Pause. ",
          label: 1,
          feedback: "Eine Pause vor Zahlen ist ein Mittel der Stimme: Sie gehört zur paraverbalen Ebene.",
        },
        {
          t: "Mit den Händen zeigt er, wie groß ein Solarmodul ist. ",
          label: 2,
          feedback: "Die Handbewegung veranschaulicht die Größe, das ist Gestik und damit nonverbal.",
        },
        {
          t: "Er sagt zu Beginn: „Ich stelle euch drei Punkte vor.“ ",
          label: 0,
          feedback: "Mit diesen Worten kündigt er den Aufbau an. Was gesagt wird, gehört zur verbalen Ebene.",
        },
        { t: "Die Beobachterin sitzt in der letzten Reihe. " },
        {
          t: "Bei der Folie dreht er sich zur Wand. ",
          label: 2,
          feedback: "Dass er sich zur Wand dreht, betrifft Körperhaltung und Blickkontakt: Das ist nonverbal.",
        },
        {
          t: "Zum Schluss wird er schneller und leiser. ",
          label: 1,
          feedback: "Wechselndes Tempo und wechselnde Lautstärke sind paraverbale Mittel der Stimme.",
        },
        { t: "Danach beginnt die Fragerunde." },
      ],
      conclusion:
        "Wörter, Stimme und Körper wirken zusammen. Beschreibe bei jedem Kanal zuerst, was du wahrnimmst, und beurteile erst danach.",
    },
    casework: {
      title: "Wenn Worte und Körper nicht zusammenpassen",
      story:
        "Im Klassenrat geht es um die Gestaltung der hinteren Wand. Mo (lacht, sieht in die Runde) schlägt vor: „Wir gestalten die Wand mit Fotos von der Klassenfahrt.“ **Jana (verschränkt die Arme, schaut aus dem Fenster): „Ja, super Idee, finde ich echt klasse.“** Mo (wird leiser): „Dann stimmen wir gleich ab?“ Jana (seufzt): „Von mir aus.“",
      steps: [
        {
          question: "Was passt bei Jana nicht zusammen?",
          options: [
            "Ihre Worte klingen begeistert, aber Körpersprache und Seufzer zeigen Desinteresse.",
            "Sie spricht viel zu laut für einen Klassenraum und stört dadurch die ganze Runde beim Zuhören.",
            "Sie nennt Argumente, die gar nicht zu Mos Vorschlag mit den Fotos passen.",
          ],
          answer: 0,
          explanation:
            "Verbal sagt Jana „klasse“, mit Körper und Stimme zeigt sie das Gegenteil. Solche Widersprüche machen eine Nachricht unklar.",
        },
        {
          question: "Welche Aussage ist eine Beobachtung und keine Deutung?",
          options: [
            "Jana verschränkt die Arme und schaut aus dem Fenster.",
            "Jana hat keine Lust auf Mos Idee und ist genervt von der Runde.",
            "Jana will Mo absichtlich ärgern, damit die Abstimmung scheitert.",
          ],
          answer: 0,
          explanation:
            "Nur der erste Satz beschreibt, was jeder sehen kann. Dass Jana keine Lust hat oder Mo ärgern will, sind Deutungen, die falsch sein könnten.",
        },
        {
          question: "Wie beeinflusst der Widerspruch den Gesprächsverlauf?",
          options: [
            "Mo wird unsicher und leiser, weil er nicht weiß, ob die Idee Zustimmung findet.",
            "Mo fühlt sich bestätigt und plant schon die Fotos für die Wand, ohne weiter nachzufragen.",
            "Der Verlauf bleibt gleich, weil in einem Gespräch nur die Worte zählen.",
          ],
          answer: 0,
          explanation:
            "Der Widerspruch zwischen Worten und Körper verunsichert Mo, die Information über die Zustimmung bleibt unklar. Dass nur Worte zählen, stimmt nicht.",
        },
        {
          question: "Welche Rückmeldung an Jana ist konstruktiv und beruht auf Beobachtung?",
          options: [
            "Du sagst „klasse“, schaust aber aus dem Fenster. Ich bin nicht sicher, ob du zustimmst. Was stört dich?",
            "Du bist unhöflich und hörst nie zu, das merkt wirklich jeder hier in der Klasse, nicht nur ich.",
            "Beim nächsten Mal sagst du bitte nichts, wenn du nicht dafür bist, und seufzt auch nicht so laut.",
          ],
          answer: 0,
          explanation:
            "Die Rückmeldung beschreibt zuerst, was zu sehen und zu hören war, nennt den eigenen Eindruck und fragt nach. Die anderen Sätze greifen Jana an oder geben einen Befehl.",
        },
      ],
      verdict:
        "Janas Worte und ihre Körpersprache widersprechen sich. Wer erst beschreibt, was zu sehen und zu hören ist, und dann nachfragt, klärt den Widerspruch, ohne die Person anzugreifen.",
    },
    tasks: {
      1: {
        prompt:
          "Mara hält einen Vortrag über ihr Praktikum in einer Bäckerei. Sie liest fast jeden Satz vom Zettel ab und sieht kaum auf. Ihre Stimme ist leise und gleichmäßig. Ihre Folien sind übersichtlich, und sie erklärt Fachbegriffe wie „Teigruhe“ mit Beispielen. Schreibe einen Beobachtungsbogen mit je einer Beobachtung, einem Urteil und einem Vorschlag zu den Bereichen verbal, paraverbal und nonverbal.",
        hints: [
          "Ordne zuerst jede Information einem Bereich zu: Wörter und Folien, Stimme, Körper und Blick.",
          "Formuliere die Beobachtung so, dass eine andere Person sie nachprüfen kann, und beurteile erst danach.",
        ],
        model:
          "Verbal: Mara erklärt Fachbegriffe mit Beispielen, und ihre Folien sind übersichtlich. Das ist gelungen, weil man ihr gut folgen kann. Paraverbal: Ihre Stimme ist leise und gleichmäßig. Dadurch fällt es schwer, die wichtigen Stellen zu erkennen. Sie könnte bei Kernaussagen lauter und langsamer sprechen. Nonverbal: Sie liest fast alles vom Zettel ab und sieht kaum auf. So entsteht kein Kontakt zum Publikum. Besser wäre es, nur Stichwörter auf Karten zu haben und in jedem Abschnitt einmal in die Klasse zu blicken.",
        criteria: [
          "Ordnet jede Beobachtung dem richtigen Bereich zu: verbal, paraverbal oder nonverbal.",
          "Trennt Beobachtung und Urteil, zum Beispiel mit „Sie liest vom Zettel ab. Dadurch …“.",
          "Macht zu jedem Bereich einen Vorschlag, den Mara umsetzen kann.",
        ],
      },
      2: {
        prompt:
          "Du möchtest dein eigenes Redeverhalten verbessern. Entwirf einen Beobachtungsbogen mit vier Kriterien, den eine Mitschülerin bei deinem nächsten Kurzvortrag ausfüllen kann. Begründe in zwei Sätzen, warum du genau diese vier Kriterien gewählt hast.",
        hints: [
          "Nimm mindestens ein Kriterium zu den Wörtern, eins zur Stimme und eins zur Körpersprache.",
          "Formuliere jedes Kriterium so, dass man es beobachten kann, zum Beispiel: Wie oft schaut die sprechende Person in die Klasse?",
        ],
        model:
          "1. Aufbau: Sind Einstieg, Hauptteil und Schluss zu erkennen? 2. Sprechtempo und Pausen: Kann man bei Zahlen mitschreiben? 3. Blickkontakt: Schaue ich mindestens einmal pro Abschnitt in die Klasse? 4. Gestik und Haltung: Stehe ich ruhig und zeige ich mit den Händen etwas? Ich habe diese vier gewählt, weil sie alle drei Kanäle abdecken und weil ich bisher zu schnell spreche und zu viel auf meinen Zettel sehe. So bekomme ich Rückmeldung genau zu den Stellen, an denen ich besser werden will.",
        criteria: [
          "Enthält vier Kriterien, die mindestens zwei der drei Kanäle abdecken.",
          "Jedes Kriterium ist so formuliert, dass man es beobachten kann.",
          "Begründet die Auswahl mit dem eigenen Verbesserungsziel.",
        ],
      },
    },
  },
  {
    id: "de-kommunikation-konflikte",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.4"],
    title: "Gespräche gelingen lassen: Vier-Seiten-Modell und Konflikte",
    intro:
      "Jede Nachricht hat vier Seiten. Wer sie kennt, versteht Missverständnisse und findet Wege aus Konflikten.",
    paragraphs: [
      "Ben sagt zu Ayla: „Die Folien sind noch nicht fertig.“ Ayla ist beleidigt. Hat Ben etwas Falsches gesagt? Nein, aber sie hat etwas anderes gehört, als er meinte. Gespräche gelingen eher, wenn einige Bedingungen erfüllt sind: Alle kennen Ziel und Thema, die Beteiligten lassen einander ausreden und hören zu, sie fragen nach, wenn etwas unklar ist, und sie bleiben sachlich und respektvoll. Auch Ort und Zeit zählen: Ein ruhiges Gespräch gelingt selten zwischen Tür und Angel.",
      "Ein Kommunikationsmodell zeigt, warum Missverständnisse entstehen. Bekannt ist das **Vier-Seiten-Modell**, auch Nachrichtenquadrat genannt, das der Psychologe Friedemann Schulz von Thun 1981 veröffentlicht hat. Es besagt: Jede Nachricht hat vier Seiten. Drei davon kennst du schon aus Klasse 8 (Information, Gefühle, Appell), die Beziehungsseite kommt dazu. Der **Sachinhalt** sagt, worüber informiert wird. In der **Selbstoffenbarung** zeigt die sprechende Person etwas von sich, etwa ein Gefühl oder ein Bedürfnis. Die **Beziehungsseite** zeigt, wie die sprechende Person zur anderen Person steht und was sie von ihr hält. Der **Appell** sagt, was die andere Person tun oder lassen soll. Bei „Die Folien sind noch nicht fertig“ lautet der Sachinhalt: Es fehlen Folien. Die Selbstoffenbarung: Ben macht sich Sorgen um die Zeit. Der Appell: Mach sie fertig! Und die Beziehung? Sie steckt vor allem im Ton.",
      "Missverständnisse entstehen, weil die hörende Person alle vier Seiten wahrnimmt und sich oft eine herausgreift. Ayla hört vielleicht vor allem die Beziehungsseite („Ben traut mir nicht zu, dass ich fertig werde“) oder den Appell („Ich soll mich beeilen“), obwohl Ben nur den Sachinhalt meinte. Dann reden beide aneinander vorbei. Weitere Ursachen von **Konflikten** sind unterschiedliche Ziele oder Interessen, unklare Absprachen und Vorwürfe, die die Person treffen statt der Sache („Du bist immer zu spät!“). Wörter wie „immer“ und „nie“ verschärfen den Streit oft, weil die andere Person sich verteidigen muss. Frage dich nach einem Streit auch selbst: Welche Seite habe ich betont, und habe ich nachgefragt?",
      "Für Konflikte gibt es Lösungsstrategien. Mit **Nachfragen** klärst du, was gemeint war: „Meinst du, ich soll mich beeilen?“ In einer **Ich-Botschaft** sagst du, was du beobachtest, wie es dir damit geht und was du dir wünschst, ohne die andere Person anzugreifen: „Ich mache mir Sorgen, dass die Zeit knapp wird. Kannst du mir sagen, wann die Folien fertig sind?“ Bei unterschiedlichen Interessen hilft ein **Kompromiss**, bei dem beide ein Stück nachgeben, zum Beispiel: Ayla gibt die Folien bis Mittwoch ab, dafür übernimmt Ben die Quellenangaben. Wichtig ist, dass die Lösung gemeinsam erarbeitet wird und beide sie einhalten.",
    ],
    terms: [
      {
        term: "Vier-Seiten-Modell",
        text: "Ein Modell, nach dem jede Nachricht vier Seiten hat: Sachinhalt, Selbstoffenbarung, Beziehung und Appell.",
      },
      {
        term: "Selbstoffenbarung",
        text: "Die Seite einer Nachricht, auf der die sprechende Person etwas von sich zeigt, zum Beispiel ein Gefühl.",
      },
      {
        term: "Beziehungsseite",
        text: "Die Seite einer Nachricht, die zeigt, wie die sprechende Person zur anderen Person steht und was sie von ihr hält.",
      },
      {
        term: "Appell",
        text: "Die Seite einer Nachricht, die ausdrückt, was die andere Person tun, lassen oder denken soll.",
      },
      {
        term: "Ich-Botschaft",
        text: "Eine Aussage über das eigene Erleben und Wünschen statt eines Vorwurfs an die andere Person.",
      },
      {
        term: "Kompromiss",
        text: "Eine Lösung, bei der beide Seiten einen Teil ihrer Wünsche aufgeben, um sich zu einigen.",
      },
    ],
    examples: [
      {
        title: "Eine Nachricht, vier Seiten (eigens verfasst)",
        text: "Jan sagt im Bus zu Eva: „Dein Rucksack steht auf dem Sitz.“",
        analysis:
          "**Sachinhalt:** Der Rucksack steht auf dem freien Platz. **Selbstoffenbarung:** Jan möchte sich setzen und ist müde. **Beziehung:** Je nach Ton klingt es wie eine Bitte unter Gleichen oder wie der Vorwurf, dass Eva rücksichtslos ist. **Appell:** Nimm den Rucksack bitte weg! Eva kann die Nachricht auf jeder dieser Seiten hören. Missverständnisse entstehen, wenn sie eine andere Seite hört als die, die Jan betonen wollte.",
      },
    ],
    takeaway:
      "Jede Nachricht hat vier Seiten: Sachinhalt, Selbstoffenbarung, Beziehung und Appell. Missverständnisse entstehen, wenn die sprechende und die hörende Person verschiedene Seiten betonen. Nachfragen, Ich-Botschaften und Kompromisse lösen Konflikte, ohne die Person anzugreifen.",
    sourceIds: ["lp", "schulzvonthun"],
    quiz: {
      question: "Welche Seite einer Nachricht zeigt, was die sprechende Person von der anderen Person hält?",
      answer: "Die Beziehungsseite: Sie zeigt, wie die sprechende Person zur anderen Person steht.",
      wrong: [
        "Die Selbstoffenbarung: Sie zeigt, was die sprechende Person von sich preisgibt.",
        "Der Appell: Sie zeigt, was die sprechende Person bei der anderen Person erreichen will.",
      ],
      explanation:
        "Was jemand von der anderen Person hält und wie beide zueinander stehen, steckt auf der Beziehungsseite, oft im Ton. Die Selbstoffenbarung zeigt etwas über die sprechende Person selbst, der Appell nennt, was die andere Person tun soll.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Seite hörst du heraus?",
      instruction:
        "Ben sagt zu Ayla: „Die Folien sind noch nicht fertig.“ Ordne jede mögliche Botschaft der Seite zu, auf der sie steckt.",
      categories: ["Sachinhalt", "Selbstoffenbarung", "Beziehung", "Appell"],
      entries: [
        {
          text: "Ein Teil der Folien für den Vortrag fehlt noch.",
          target: 0,
          feedback: "Das ist eine Information über die Sache, ohne Gefühl und ohne Aufforderung.",
        },
        {
          text: "Ben macht sich Sorgen, dass die Zeit knapp wird.",
          target: 1,
          feedback: "Er zeigt etwas von sich selbst, nämlich seine Sorge.",
        },
        {
          text: "Ben traut Ayla nicht zu, dass sie rechtzeitig fertig wird.",
          target: 2,
          feedback: "Das sagt etwas darüber, was Ben von Ayla hält, also über die Beziehung.",
        },
        {
          text: "Ayla soll die restlichen Folien so bald wie möglich erstellen.",
          target: 3,
          feedback: "Das ist die Aufforderung, etwas zu tun: der Appell.",
        },
        {
          text: "Ben ist gestresst und fühlt sich selbst unter großem Druck.",
          target: 1,
          feedback: "Gefühle der sprechenden Person gehören zur Selbstoffenbarung.",
        },
        {
          text: "Der Ton klingt, als stünde Ben über Ayla und dürfe ihre Arbeit kontrollieren.",
          target: 2,
          feedback: "Der Ton zeigt, wie Ben zu Ayla steht und wer über wem steht: die Beziehungsseite.",
        },
      ],
      conclusion:
        "In einer einzigen Nachricht stecken alle vier Seiten. Welche davon bei der hörenden Person ankommt, entscheidet, ob das Gespräch gelingt oder ein Missverständnis entsteht.",
    },
    casework: {
      title: "Streit in der Projektgruppe",
      story:
        "In der Projektgruppe streiten Sara und Kerem, weil Kerem wieder zu spät kam. Sara: **„Du bist immer zu spät! Wegen dir verlieren wir jedes Mal Zeit.“** Kerem: „Mir ist der Bus ausgefallen, und du machst gleich wieder einen Aufstand.“ Sara: „Das sagst du jedes Mal.“",
      steps: [
        {
          question: "Welche Seite von Saras Satz „Du bist immer zu spät!“ trifft Kerem am stärksten?",
          options: [
            "Die Beziehungsseite: Sie spricht über Kerem als Person und wertet ihn ab.",
            "Der Sachinhalt: Sie nennt nur sachlich die Uhrzeit, zu der Kerem kam, und sonst nichts.",
            "Die Selbstoffenbarung: Sie sagt nur, wie sie sich fühlt, und spricht nicht über Kerem.",
          ],
          answer: 0,
          explanation:
            "„Du“ und „immer“ treffen die Person, nicht die Sache. Deshalb hört Kerem vor allem den Vorwurf über sich und verteidigt sich.",
        },
        {
          question: "Was ist die Ursache des Streits?",
          options: [
            "Der Vorwurf trifft die Person, und Kerem verteidigt sich, statt über die Sache zu sprechen.",
            "Kerem hat die Aufgabe nicht verstanden und fragt auch nicht nach, wie es weitergeht.",
            "Beide haben einen Termin vergessen, den vorher niemand in den Kalender eingetragen hat.",
          ],
          answer: 0,
          explanation:
            "Der Streit entsteht auf der Beziehungsseite: Statt über das Problem zu reden, greifen beide einander an. Die anderen Ursachen kommen im Streit nicht vor.",
        },
        {
          question: "Welche Aussage von Sara ist eine Ich-Botschaft?",
          options: [
            "Ich ärgere mich, wenn wir warten müssen. Ich wünsche mir, dass du vorher Bescheid sagst.",
            "Du musst endlich lernen, pünktlich zu sein, sonst fliegst du aus der Gruppe.",
            "Man kann sich auf dich einfach nicht verlassen, und das merkt auch die ganze Gruppe schon lange.",
          ],
          answer: 0,
          explanation:
            "Eine Ich-Botschaft beschreibt Beobachtung, Gefühl und Wunsch. Die anderen Sätze sind Vorwürfe und befehlen oder bewerten die Person.",
        },
        {
          question: "Welche Lösung ist ein Kompromiss?",
          options: [
            "Sara verschiebt den Beginn um zehn Minuten, und Kerem meldet sich vorher, wenn es doch nicht klappt.",
            "Kerem verspricht, nie wieder zu spät zu kommen, und Sara muss sich um nichts mehr kümmern, auch nicht ums Erinnern.",
            "Beide sprechen nie wieder darüber, damit der Streit nicht neu beginnt.",
          ],
          answer: 0,
          explanation:
            "Im Kompromiss geben beide etwas nach: Sara verschiebt den Beginn, Kerem sagt Bescheid. In den anderen Lösungen gibt nur einer nach, oder das Problem wird vermieden.",
        },
      ],
      verdict:
        "Der Streit entsteht auf der Beziehungsseite: Ein Vorwurf trifft die Person statt der Sache. Mit einer Ich-Botschaft und einem Kompromiss kommen Sara und Kerem zurück zum Sachinhalt.",
    },
    tasks: {
      1: {
        prompt:
          "Lena sagt zu Tom: „Du hast schon wieder deinen Teil der Gruppenarbeit nicht abgegeben.“ Schreibe auf, was Tom auf den vier Seiten der Nachricht hören könnte, und formuliere dann eine Antwort von Tom mit einer Nachfrage.",
        hints: [
          "Frage dich bei jeder Seite: Welche Information, welches Gefühl, welche Haltung zu mir und welche Aufforderung steckt im Satz?",
          "Eine Nachfrage beginnt zum Beispiel mit „Meinst du, dass …?“ oder „Was genau stört dich?“.",
        ],
        model:
          "Sachinhalt: Toms Teil ist nicht abgegeben. Selbstoffenbarung: Lena ist verärgert und macht sich Sorgen um die Note der Gruppe. Beziehung: Mit „schon wieder“ klingt es, als halte Lena Tom für unzuverlässig. Appell: Tom soll seinen Teil sofort abgeben. Toms Antwort: „Meinst du, dass ich den Teil bis heute Abend abgeben soll? Was genau stört dich daran, dass er fehlt?“ So klärt Tom, was Lena möchte, und geht nicht auf den Vorwurf ein.",
        criteria: [
          "Nennt zu jeder der vier Seiten einen passenden Satz.",
          "Erkennt, dass „schon wieder“ die Beziehungsseite berührt.",
          "Formuliert eine Nachfrage, die den Vorwurf nicht zurückgibt.",
        ],
      },
      2: {
        prompt:
          "Du ärgerst dich, weil dein Bruder dein Ladekabel immer wieder mitnimmt und nicht zurücklegt. Schreibe zuerst den Vorwurf, den du im Ärger sagen würdest. Formuliere dann eine Ich-Botschaft und einen Kompromissvorschlag, der für beide fair ist.",
        hints: [
          "Eine Ich-Botschaft besteht meist aus drei Teilen: was du beobachtest, wie es dir damit geht und was du dir wünschst.",
          "Ein Kompromiss muss beiden etwas bringen: Was gibst du auf, und was gibt dein Bruder auf?",
        ],
        model:
          "Vorwurf: „Du nimmst immer mein Kabel und denkst nie daran!“ Ich-Botschaft: „Wenn mein Kabel fehlt, kann ich mein Handy nicht laden und ärgere mich. Ich wünsche mir, dass du es zurücklegst.“ Kompromiss: Wir kaufen ein zweites Kabel für dein Zimmer, und ich lege meins nach dem Laden immer an denselben Platz, damit du es nicht suchen musst. Dafür sagst du mir Bescheid, wenn du es einmal brauchst.",
        criteria: [
          "Trennt den Vorwurf klar von der Ich-Botschaft.",
          "Die Ich-Botschaft nennt Beobachtung, Gefühl und Wunsch.",
          "Der Kompromiss verlangt von beiden Seiten etwas.",
        ],
      },
    },
  },
  {
    id: "de-praesentation",
    lb: 1,
    unit: "1.2",
    covers: ["1.2.1"],
    title: "Präsentieren: Aufbau, Medien und Aufmerksamkeit",
    intro:
      "Ein Thema präsentierst du überzeugend, wenn du auswählst, klar gliederst und Medien gezielt einsetzt.",
    paragraphs: [
      "Bei einem komplexen Thema, etwa einem Berufsbild oder einem Projektergebnis, kannst du nicht alles sagen. Du **wählst aus** und **strukturierst**. Frage dich zuerst: Was soll die Klasse am Ende wissen oder tun? Formuliere diese **Kernaussage** in einem Satz. Wähle dann zwei bis vier Aspekte, die sie stützen, und lege die Reihenfolge fest, zum Beispiel vom Allgemeinen zum Besonderen oder nach Wichtigkeit. Zu jedem Aspekt gehört ein Beispiel oder ein Beleg. Was nicht zur Kernaussage passt, lässt du weg, auch wenn du viel darüber weißt.",
      "Der Aufbau hat drei Teile (Wiederholung aus Klasse 8). Im **Einstieg** begrüßt du, weckst Interesse mit einer Frage, einem Bild oder einem Beispiel und nennst das Thema. Danach gibst du einen **Überblick**: Du sagst, über welche Punkte du sprichst. Im **Hauptteil** behandelst du diese Punkte nacheinander. Überleitungen („Nach den Kosten komme ich zur Ausbildung“) halten den **roten Faden** sichtbar. Im **Schluss** fasst du die Kernaussage in ein bis zwei Sätzen zusammen und gibst einen Ausblick oder einen Appell. Danach bedankst du dich und lädst zu Fragen ein.",
      "Medien sind kein Schmuck, sie haben einen Zweck. Ob Folie, Plakat, Bild oder Modell: Du setzt sie ein, um **Zusammenhänge zu veranschaulichen** (ein Schaubild, ein Modell), um **Aufmerksamkeit zu erlangen** (ein Foto oder ein Gegenstand zu Beginn) und um **Wichtiges hervorzuheben** (eine große Zahl, eine Farbe). Dafür gelten einfache Regeln: ein Gedanke pro Folie, Stichwörter statt ganzer Sätze, gut lesbare Schrift, wenige Farben, Bilder mit Quellenangabe. Eine Folie ersetzt dich nicht. Du liest sie nicht vor, sondern ergänzt sie mit deinen Worten, denn das Publikum liest meist schneller, als du sprichst.",
      "Die App kann dein Sprechen nicht prüfen, aber du kannst deine Präsentation schriftlich planen. Schreibe einen **Stichwortzettel** oder Karteikarten: eine Karte pro Abschnitt, mit Stichwörtern und dem Vermerk, wann welches Medium erscheint. Formuliere die ersten zwei Sätze wörtlich aus, denn der Anfang fällt am schwersten. Plane die Zeit pro Abschnitt und probe mit der Uhr. In einer Gruppe legt ihr fest, wer welchen Teil übernimmt und wie ihr übergebt.",
    ],
    terms: [
      {
        term: "Kernaussage",
        text: "Der eine Satz, den die Zuhörenden am Ende der Präsentation behalten sollen.",
      },
      {
        term: "Einstieg",
        text: "Der Anfang einer Präsentation, der Interesse weckt und zum Thema führt.",
      },
      {
        term: "Roter Faden",
        text: "Der logische Zusammenhang, der die Teile einer Präsentation durch Überleitungen verbindet.",
      },
      {
        term: "Visualisieren",
        text: "Etwas durch Bilder, Schaubilder oder Hervorhebungen sichtbar machen, damit es leichter verstanden wird.",
      },
      {
        term: "Stichwortzettel",
        text: "Eine Gedächtnisstütze aus Stichwörtern, mit der du frei sprichst, statt abzulesen.",
      },
    ],
    examples: [
      {
        title: "Eine Folie vorher und nachher (eigens verfasst)",
        text: "Vorher: „Mechatronik verbindet Maschinenbau, Elektrotechnik und Informatik. Mechatronikerinnen und Mechatroniker montieren Anlagen, programmieren Steuerungen, warten Maschinen und prüfen ihre Funktion. Sie arbeiten in Werkstätten und manchmal bei der Kundschaft vor Ort.“\nNachher: Überschrift „Mechatronik“, darunter vier Stichwörter: montieren – programmieren – warten – prüfen, daneben ein Foto einer Fertigungsanlage.",
        analysis:
          "Die erste Folie ist ein Textblock, den das Publikum liest, statt zuzuhören. Die zweite hebt vier Tätigkeiten als Stichwörter hervor, und das Foto veranschaulicht, wo die Arbeit stattfindet. Alles Weitere sagst du mit eigenen Worten dazu. So ergänzen sich Folie und Vortrag.",
      },
    ],
    takeaway:
      "Wähle eine Kernaussage und gliedere in Einstieg, Hauptteil und Schluss. Setze Medien ein, um Zusammenhänge zu veranschaulichen, Aufmerksamkeit zu erlangen oder Wichtiges hervorzuheben. Eine Folie trägt Stichwörter und Bilder, du liest sie nicht vor.",
    sourceIds: ["lp", "dwds"],
    quiz: {
      question: "Welche Folie unterstützt eine Präsentation am besten?",
      answer: "Eine Folie mit einer großen Zahl und einem Foto, die den Kernpunkt hervorheben.",
      wrong: [
        "Eine Folie mit dem ganzen Vortragstext, damit nichts Wichtiges vergessen wird.",
        "Eine Folie mit vielen Bildern und Farben, damit sie möglichst auffällt.",
      ],
      explanation:
        "Eine gute Folie hebt wenig hervor und veranschaulicht es. Ein ganzer Text wird vorgelesen oder abgelesen, und zu viele Bilder und Farben lenken vom Kernpunkt ab.",
    },
    workshop: {
      kind: "timeline",
      title: "Der Aufbau eines Kurzvortrags",
      instruction:
        "Bringe die Teile eines Kurzvortrags in die richtige Reihenfolge. Jeder Teil setzt voraus, was davor schon gesagt wurde. Benutze die Pfeile, um einen Eintrag nach oben oder unten zu schieben.",
      categories: [],
      entries: [
        {
          text: "Einstieg: Du begrüßt die Klasse, weckst Interesse, zum Beispiel mit einem Foto oder einer Frage, und nennst das Thema.",
          target: 0,
          feedback: "Am Anfang stehen Begrüßung, Interesse und Thema: Ohne bekanntes Thema gibt es nichts zu gliedern.",
        },
        {
          text: "Überblick: Jetzt, wo das Thema bekannt ist, sagst du, über welche zwei oder drei Punkte du sprichst.",
          target: 1,
          feedback: "Der Überblick setzt das genannte Thema voraus und kündigt an, was im Hauptteil kommt.",
        },
        {
          text: "Hauptteil: Du behandelst die angekündigten Punkte nacheinander und stützt jeden mit einem Beispiel oder Bild.",
          target: 2,
          feedback: "Der Hauptteil arbeitet die Punkte ab, die der Überblick angekündigt hat.",
        },
        {
          text: "Schluss: Du fasst zusammen, was du im Hauptteil gezeigt hast, und gibst einen Ausblick oder Appell.",
          target: 3,
          feedback: "Zusammenfassen kannst du erst, wenn der Hauptteil gesprochen ist.",
        },
        {
          text: "Dank und Fragen: Wenn inhaltlich alles gesagt ist, bedankst du dich und lädst zu Fragen ein.",
          target: 4,
          feedback: "Dank und Einladung zu Fragen folgen erst, wenn der Vortrag inhaltlich zu Ende ist.",
        },
      ],
      conclusion:
        "Einstieg, Überblick, Hauptteil, Schluss, Dank und Fragen: Diese Reihenfolge gibt deiner Präsentation einen roten Faden, dem das Publikum leicht folgen kann.",
    },
    casework: {
      title: "Eine Folie zum Praktikum",
      story:
        "Lara stellt ihr Praktikum in einem Tierheim vor. Auf Folie 3 stehen 14 Zeilen Fließtext in kleiner Schrift, drei Diagramme und Wörter in Rot, Grün und Gelb auf blauem Grund. **Lara liest die Folie vor und blickt dabei zur Wand.** Auf Folie 1 zeigt sie dagegen ein großes Foto eines Hundes, bevor sie ein Wort sagt.",
      steps: [
        {
          question: "Was ist an Folie 3 das größte Problem?",
          options: [
            "Sie bietet zu viel auf einmal, deshalb liest das Publikum, statt zuzuhören.",
            "Sie nennt zu wenige Zahlen, deshalb wirkt das Praktikum unwichtig.",
            "Sie enthält Diagramme, und Diagramme gehören grundsätzlich nicht in eine Präsentation.",
          ],
          answer: 0,
          explanation:
            "Text, Diagramme und Farben konkurrieren miteinander, und die Zuhörenden wissen nicht, wohin sie schauen sollen. Diagramme sind dagegen gute Medien, wenn sie einzeln und klar eingesetzt werden.",
        },
        {
          question: "Wie sieht eine bessere Folie 3 aus, wenn sie nur noch einen Schwerpunkt haben soll?",
          options: [
            "Ein Gedanke, drei Stichwörter und ein Diagramm in gut lesbarer Schrift.",
            "Derselbe Text in größerer Schrift, sodass er die ganze Folie füllt.",
            "Nur ein großes Foto ohne Beschriftung, das jeder auf seine Weise deuten kann.",
          ],
          answer: 0,
          explanation:
            "Eine Folie braucht einen klaren Schwerpunkt: wenige Stichwörter und ein Bild oder Diagramm. Mehr Text in größerer Schrift bleibt ein Textblock, und ein Foto allein sagt nicht, worauf es ankommt.",
        },
        {
          question: "Wozu dient das große Hundefoto auf Folie 1?",
          options: [
            "Es erregt Aufmerksamkeit und führt anschaulich zum Thema.",
            "Es ersetzt die Einleitung, sodass Lara nichts sagen muss.",
            "Es hebt eine wichtige Zahl aus der Auswertung des Praktikums hervor.",
          ],
          answer: 0,
          explanation:
            "Ein Bild zu Beginn weckt Interesse und macht das Thema greifbar. Es ersetzt Laras Einstieg nicht, und es zeigt einen Hund, keine Zahl, die etwas hervorheben könnte.",
        },
        {
          question: "Was sollte Lara bei jeder Folie anders machen?",
          options: [
            "Sie sollte frei sprechen und ergänzen, was die Folie zeigt, statt sie vorzulesen.",
            "Sie sollte jede Folie deutlich länger zeigen, damit alle sie in Ruhe lesen können.",
            "Sie sollte alles, was auf der Folie steht, noch einmal ganz wörtlich und langsam wiederholen.",
          ],
          answer: 0,
          explanation:
            "Die Folie zeigt, die Sprecherin erklärt und ergänzt. Vorlesen und Wiederholen langweilen das Publikum, und der Blick zur Wand nimmt den Kontakt zu den Zuhörenden.",
        },
      ],
      verdict:
        "Lara kann ihre Präsentation retten: weniger auf der Folie, Medien mit klarem Zweck und ein Blick zum Publikum. Die Folie unterstützt ihre Worte und ersetzt sie nicht.",
    },
    tasks: {
      1: {
        prompt:
          "Du sollst fünf Minuten lang einen Beruf deiner Wahl vorstellen. Schreibe deinen Stichwortzettel: einen Einstiegssatz, drei Hauptpunkte als Stichwörter und für jeden Punkt ein Medium mit seinem Zweck (zum Beispiel Foto, Diagramm, Gegenstand).",
        hints: [
          "Der Einstieg weckt Interesse, zum Beispiel mit einer Frage oder einem Bild.",
          "Frage dich bei jedem Medium: Soll es etwas veranschaulichen, Aufmerksamkeit wecken oder etwas hervorheben?",
        ],
        model:
          "Beruf: Tierpflege. Einstieg: „Wer von euch hat schon einmal ein Tier tagelang versorgt? Genau das tun Tierpflegerinnen und Tierpfleger jeden Tag.“ Punkt 1: Aufgaben – füttern, Gehege reinigen, Tiere beobachten (Foto einer Fütterung, um die Arbeit zu veranschaulichen). Punkt 2: Ausbildung – Praxis im Betrieb, Unterricht in der Berufsschule (Zeitstrahl, um den Ablauf zu zeigen). Punkt 3: Voraussetzungen – Geduld, Verantwortung, Freude an Tieren (großes Wort „Verantwortung“ auf der Folie, um es hervorzuheben).",
        criteria: [
          "Der Einstiegssatz weckt Interesse, zum Beispiel mit einer Frage oder einem Bild.",
          "Die drei Hauptpunkte stehen als Stichwörter, nicht als ganze Sätze.",
          "Zu jedem Medium steht, was es veranschaulicht, hervorhebt oder bewirkt.",
        ],
      },
      2: {
        prompt:
          "Deine Gruppe stellt ein Projektergebnis vor: Eine Woche lang habt ihr den Müll auf dem Pausenhof gezählt. Ergebnis: 312 Teile, davon 140 Verpackungen von Getränken. Plane die Präsentation für sechs Minuten in sechs Zeilen: Aufbau mit Zeitangaben, ein Medium pro Teil und wer in der Gruppe spricht.",
        hints: [
          "Teile die sechs Minuten auf Einstieg, Hauptteil und Schluss auf und gib jedem Teil eine Zeit.",
          "Wähle für die Zahl 140 von 312 ein Medium, das sie hervorhebt, und lege fest, wer übergibt.",
        ],
        model:
          "1. Einstieg (30 Sekunden, Ida): Foto vom Pausenhof am Montag, Frage „Wie viel Müll liegt hier in einer Woche?“ 2. Überblick (30 Sekunden, Ida): drei Punkte nennen, Folie mit drei Stichwörtern. 3. Vorgehen (1 Minute, Jan): die Zählung erklären, Foto der Zählung. 4. Ergebnis (2 Minuten, Jan): Balkendiagramm, 140 von 312 Teilen rot hervorgehoben. 5. Ideen (1 Minute, Mia): Vorschläge auf einem Plakat. 6. Schluss (1 Minute, Mia): Kernaussage, Appell, Fragen.",
        criteria: [
          "Der Plan enthält Einstieg, Hauptteil und Schluss mit Zeitangaben, die zusammen sechs Minuten ergeben.",
          "Zu jedem Teil ist ein sinnvolles Medium genannt.",
          "Die Gruppenmitglieder sind eingeteilt und die Übergaben sind klar.",
        ],
      },
    },
  },
  {
    id: "de-argumentieren-rhetorik",
    lb: 1,
    unit: "1.2",
    covers: ["1.2.2"],
    title: "Überzeugend sprechen: Argumentieren, Appellieren, Rhetorik",
    intro:
      "Wer überzeugen will, baut Argumente auf, geht auf das Gegenüber ein und setzt rhetorische Mittel sparsam ein.",
    paragraphs: [
      "Argumentieren heißt, eine Meinung mit Gründen zu stützen. Das kennst du aus Klasse 8. Ein gutes Argument besteht meist aus drei Teilen: einer **Behauptung**, einer **Begründung** und einem **Beleg**, zum Beispiel ein Beispiel, eine Zahl oder eine Erfahrung. Dazu kommt oft ein **Appell**, also die Aufforderung, etwas zu tun. Im Beispiel unten findest du alle Teile. Wenn du mehrere Argumente nennst, ordnest du sie: zum Beispiel das stärkste zuerst oder zum Schluss, damit es im Gedächtnis bleibt.",
      "In Debatten und Diskussionen argumentierst du nicht allein. Du gehst auf die Argumente deines Gegenübers ein. Zuerst hörst du genau zu und gibst den Einwand in eigenen Worten wieder („Du sagst, dass …“). Dann stimmst du einem berechtigten Teil zu („Das stimmt, …“) und widersprichst mit einem eigenen Grund („… aber …, weil …“). So wirkst du fair, und dein Gegenargument hat oft mehr Gewicht. Greife die Sache an, nie die Person. Kriterien wie Argumentationsaufbau und der Umgang mit fremden Argumenten kannst du in der Klasse gemeinsam festlegen und danach Beiträge prüfen. Vorgegebene Informationen, zum Beispiel Zahlen aus einem Material, verbindest du mit deinen eigenen Gedanken.",
      "Die **Rhetorik** ist die Kunst der wirkungsvollen Rede. Zwei ihrer Mittel brauchst du hier. Die **rhetorische Frage** ist eine Frage, auf die niemand eine Antwort erwartet, weil sie schon klar ist: „Wer sitzt schon gern im Müll?“ Sie bindet die Zuhörenden ein und behauptet etwas, ohne es auszusprechen. Die **Ironie** meint meist das Gegenteil von dem, was gesagt wird, und Tonfall oder Zusammenhang verraten es: „Na klar, bei Dauerregen macht das Sportfest besonders viel Spaß.“ Ironie kann spitz und witzig sein, wird aber leicht missverstanden oder verletzt. Setze beide Mittel sparsam ein und nicht gegen Personen.",
      "Zum Überzeugen gehören auch außersprachliche Mittel: Blickkontakt, eine feste Haltung, Gestik und eine Stimme, die Wichtiges betont. Am Ende steht oft der Appell, der die Zuhörenden aktiviert: „Unterschreibt bis Freitag!“ Plane deinen Beitrag schriftlich: Schreibe auf den Stichwortzettel deine Behauptung, zwei Argumente mit Beleg, einen erwarteten Einwand mit deiner Antwort und den Appell. Die schriftliche Argumentation übst du in Lernbereich 3, hier geht es um das Sprechen.",
    ],
    terms: [
      {
        term: "Argument",
        text: "Eine Behauptung, die durch eine Begründung und einen Beleg gestützt wird.",
      },
      {
        term: "Beleg",
        text: "Ein Beispiel, eine Zahl oder eine Erfahrung, die eine Begründung stützt.",
      },
      {
        term: "Appell",
        text: "Eine Aufforderung, die Zuhörende zu einer Handlung bewegen soll.",
      },
      {
        term: "Rhetorische Frage",
        text: "Eine Frage, auf die keine Antwort erwartet wird, weil sie schon klar ist oder etwas behauptet.",
      },
      {
        term: "Ironie",
        text: "Eine Aussage, die meist das Gegenteil von dem meint, was sie sagt, erkennbar an Ton oder Zusammenhang.",
      },
    ],
    examples: [
      {
        title: "Ein Redebeitrag und seine Teile (eigens verfasst)",
        text: "Die Sporthalle sollte mittwochs nachmittags offen sein, weil viele von uns sonst kaum Bewegung haben. In meiner Klasse sind nur acht von 25 in einem Verein. Natürlich braucht eine offene Halle Aufsicht, aber ältere Schülerinnen und Schüler könnten sie übernehmen. Darum bitte ich die Schulleitung: Probieren wir es ein Halbjahr lang aus!",
        analysis:
          "Der erste Satz enthält die **Behauptung** und die **Begründung**. Die Zahl im zweiten Satz ist der **Beleg**. Im dritten Satz nimmt der Beitrag einen Einwand vorweg: Er gibt ihm recht („Natürlich …“) und widerspricht mit einem Vorschlag („aber …“). Der letzte Satz ist ein **Appell**, der konkret sagt, was geschehen soll.",
      },
    ],
    takeaway:
      "Ein Argument besteht meist aus Behauptung, Begründung und Beleg. Gehe auf Einwände ein: zusammenfassen, teilweise zustimmen, mit einem Grund widersprechen. Rhetorische Fragen und Ironie setzt du sparsam ein, und ein Appell am Ende sagt, was die Zuhörenden tun sollen.",
    sourceIds: ["lp", "dwds"],
    quiz: {
      question: "Welcher Satz ist eine rhetorische Frage?",
      answer: "Wer möchte schon jeden Tag zwischen Müllbergen sitzen?",
      wrong: [
        "Wie viele Mülleimer stehen zurzeit auf dem Pausenhof?",
        "Hat jemand von euch den Plan der Schulleitung gelesen?",
      ],
      explanation:
        "Auf die erste Frage erwartet niemand eine Antwort, weil sie klar ist: Keiner möchte das. Die beiden anderen Fragen sind echte Fragen, auf die man eine Auskunft bekommen kann.",
    },
    workshop: {
      kind: "mark",
      title: "Eine Rede genau lesen",
      instruction:
        "Wähle oben ein Mittel aus und klicke im Text die passenden Stellen an. Nicht jeder Satz ist ein rhetorisches Mittel: Sachliche Angaben bleiben unmarkiert.",
      labels: ["Rhetorische Frage", "Ironie", "Appell"],
      text: [
        { t: "Liebe Mitschülerinnen und Mitschüler, " },
        {
          t: "wer stellt schon gern ein Fahrrad in den Regen? ",
          label: 0,
          feedback:
            "Niemand stellt gern ein Rad in den Regen. Die Antwort ist klar, deshalb ist es eine rhetorische Frage.",
        },
        { t: "Unsere Fahrradständer bieten Platz für 40 Räder, aber jeden Morgen kommen im Schnitt 120. " },
        {
          t: "Natürlich ist es ein tolles Training, sich jeden Morgen zwischen die Lenker zu quetschen. ",
          label: 1,
          feedback:
            "Gemeint ist das Gegenteil: Das Gequetsche ist kein Training, sondern ein Ärgernis. Das ist Ironie.",
        },
        { t: "Im Mai hat uns die Verwaltung neue Ständer zugesagt. " },
        { t: "Seitdem ist nichts passiert. " },
        {
          t: "Wie lange sollen wir noch warten? ",
          label: 0,
          feedback:
            "Hier erwartet niemand eine Antwort. Die Frage sagt: Wir warten schon viel zu lange. Das ist eine rhetorische Frage.",
        },
        { t: "Die Unterschriftenliste liegt im Sekretariat, und 63 von uns haben schon unterschrieben. " },
        {
          t: "Unterschreibt bis Freitag, damit die Schulleitung sieht, wie viele von uns sichere Ständer wollen! ",
          label: 2,
          feedback: "Der Satz fordert zu einer Handlung auf, nämlich zum Unterschreiben: ein Appell.",
        },
        {
          t: "Und sagt den Verantwortlichen: Wir wollen sichere Ständer, und zwar jetzt!",
          label: 2,
          feedback: "Auch dieser Satz fordert die Zuhörenden auf, selbst aktiv zu werden und etwas zu verlangen: ein Appell.",
        },
      ],
      conclusion:
        "Rhetorische Fragen, Ironie und Appelle geben einer Rede Wirkung. Sachliche Angaben dazwischen machen sie glaubwürdig.",
    },
    casework: {
      title: "Streit um den Schulkiosk",
      story:
        "In einer Diskussion über den Schulkiosk sagt Emre: **„Der Kiosk sollte nur noch Obst und Brote verkaufen, denn Zucker macht müde und unkonzentriert.“** Paula antwortet: „Du meinst also, wir dürfen nichts mehr aussuchen? Ein Kiosk ohne Auswahl, das wäre ja wirklich ein Fortschritt!“ Emre entgegnet: „Es geht nicht um Verbote, sondern um ein besseres Angebot. Im Probemonat wurde bei mehr als der Hälfte der Einkäufe Obst gewählt.“",
      steps: [
        {
          question: "Wie ist Emres erster Satz aufgebaut?",
          options: [
            "Er nennt eine Behauptung und eine Begründung.",
            "Er nennt nur eine Behauptung ohne Begründung.",
            "Er beginnt mit einer Frage und nennt dann einen Beleg.",
          ],
          answer: 0,
          explanation:
            "Der Satz fordert etwas (Behauptung) und begründet es mit „denn“ (Begründung). Ein Beleg wie eine Zahl fehlt noch, und eine Frage steht nicht am Anfang.",
        },
        {
          question: "Welches Mittel steckt in Paulas Satz „Das wäre ja wirklich ein Fortschritt!“?",
          options: [
            "Ironie: Sie meint das Gegenteil, denn sie hält den Vorschlag nicht für gut.",
            "Eine rhetorische Frage, weil Paula keine Antwort von Emre erwartet.",
            "Ein Appell, weil sie Emre zu einer Handlung auffordern will.",
          ],
          answer: 0,
          explanation:
            "Paula sagt „Fortschritt“ und meint das Gegenteil. Das erkennt man am Zusammenhang davor. Eine Frage oder eine Aufforderung ist der Satz nicht.",
        },
        {
          question: "Wie geht Emre mit Paulas Einwand um?",
          options: [
            "Er stellt klar, was er meint, und nennt einen Beleg aus dem Probemonat.",
            "Er greift Paula persönlich an und erklärt ihre Aussage für unsinnig.",
            "Er wiederholt seine Behauptung unverändert und lauter als zuvor.",
          ],
          answer: 0,
          explanation:
            "Emre bleibt sachlich: Er räumt das Missverständnis aus und liefert eine Zahl. Persönliche Angriffe oder bloßes Wiederholen würden Paulas Einwand nicht entkräften.",
        },
        {
          question: "Welcher Schlusssatz wäre für Emre ein Appell?",
          options: [
            "Gebt dem neuen Angebot einen Monat Zeit und stimmt dann ab!",
            "Wer isst schon gern Dinge, die einen müde und unkonzentriert machen?",
            "Der Kiosk verkauft derzeit auch Brötchen und belegte Baguettes.",
          ],
          answer: 0,
          explanation:
            "Ein Appell fordert zu einer Handlung auf. Der zweite Satz ist eine rhetorische Frage, der dritte eine sachliche Angabe.",
        },
      ],
      verdict:
        "Emre baut sein Argument auf und antwortet auf Paulas Ironie sachlich mit einem Beleg. Ein Appell am Ende würde sagen, was die Zuhörenden tun sollen.",
    },
    tasks: {
      1: {
        prompt:
          "In der SV-Sitzung hast du 90 Sekunden Redezeit. Du sollst dafür sprechen, dass die Mittagspause um 15 Minuten verlängert wird. Vorgegebene Informationen: Die Schlange in der Mensa dauert bis zu zehn Minuten, und viele essen im Gehen. Schreibe deine Rede in vier bis fünf Sätzen mit Behauptung, Begründung, Beleg und Appell. Baue eine rhetorische Frage ein.",
        hints: [
          "Beginne mit der Behauptung und stütze sie mit den vorgegebenen Informationen als Beleg.",
          "Eine rhetorische Frage sagt etwas, ohne es auszusprechen, zum Beispiel: Wer isst schon gern im Gehen?",
        ],
        model:
          "Die Mittagspause sollte um 15 Minuten länger dauern, weil wir sonst keine Zeit zum Essen haben. In der Mensa steht man bis zu zehn Minuten an, und deshalb essen viele im Gehen. Wer isst schon gern im Gehen, zwischen Tür und Angel? Darum bitte ich euch: Stimmt heute für die längere Pause!",
        criteria: [
          "Enthält Behauptung, Begründung, Beleg und einen Appell.",
          "Enthält eine rhetorische Frage, auf die keine Antwort erwartet wird.",
          "Nutzt die vorgegebenen Informationen aus der Aufgabe.",
        ],
      },
      2: {
        prompt:
          "Bei der Planung des Schulfests schlägst du vor, auf Einwegbecher zu verzichten. Eine Mitschülerin wendet ein: „Das ist viel zu teuer.“ Schreibe in fünf bis sechs Sätzen, wie du ihren Einwand aufgreifst und entkräftest, und schließe mit einem Appell. Erkläre danach in einem Satz, ob Ironie hier klug wäre.",
        hints: [
          "Gib ihren Einwand kurz mit eigenen Worten wieder und stimme dem berechtigten Teil zu.",
          "Widersprich mit einem eigenen Grund und einem Beleg, zum Beispiel einer Rechnung oder einem Beispiel.",
        ],
        model:
          "Du sagst, dass Mehrwegbecher mehr kosten als Einwegbecher. Das stimmt, denn wir müssten sie einmal kaufen. Aber wir können sie mit einem Euro Pfand ausgeben und nach dem Fest wiederverwenden, und die Entsorgung von mehreren hundert Bechern entfällt. Beim Sommerfest im letzten Jahr lag der Pausenhof am Ende voller Plastik. Darum bitte ich euch: Probieren wir es dieses Jahr mit Pfandbechern aus! Ironie wäre hier nicht klug, denn sie würde die Mitschülerin treffen und das Gespräch über die Sache beenden.",
        criteria: [
          "Gibt den Einwand mit eigenen Worten wieder und stimmt einem Teil zu.",
          "Widerspricht mit einem eigenen Grund und einem Beleg.",
          "Endet mit einem Appell und begründet, ob Ironie hier passt.",
        ],
      },
    },
  },
  {
    id: "de-vortragen-sprechweise",
    lb: 1,
    unit: "1.2",
    covers: ["1.2.3"],
    title: "Texte aufbereiten und mit der Stimme vortragen",
    intro:
      "Mit Markierungen und Randbemerkungen bereitest du einen Text vor. Tempo, Lautstärke, Stimmführung und Pausen machen den Vortrag lebendig.",
    paragraphs: [
      "Wer einen Text vorträgt, liest ihn nicht einfach ab. Zuerst verstehst du ihn: Kläre unbekannte Wörter und ihre Aussprache und überlege, was der Text sagen oder bewirken will. Dann bereitest du ihn auf. Teile ihn in **Sinnabschnitte**, zum Beispiel mit einem Schrägstrich für eine kurze und zwei Schrägstrichen für eine längere Pause. Unterstreiche wichtige Wörter, die du betonen willst. Notiere am Rand kurze Anweisungen wie „leiser“, „langsam“ oder „aufschauen“. Auch eine kleine Skizze kann helfen, etwa ein Zeitstrahl oder eine Mindmap, wenn du eigene Gedanken oder Informationen frei vorträgst. Wichtig ist, dass du dein System verstehst und immer gleich benutzt.",
      "Ein Vortrag wirkt nur, wenn man ihn versteht. Dazu gehört die **Artikulation**: Du öffnest den Mund, sprichst Wortenden vollständig aus und nuschelst nicht. Außerdem trägst du **interpretierend** vor. Das heißt: Du zeigst mit deiner Sprechweise, wie du den Text verstehst. Eine Spannungsstelle klingt anders als eine Beschreibung oder ein Witz. Wer alles im gleichen Ton liest, nimmt dem Text die Wirkung, auch wenn jedes Wort richtig gelesen ist.",
      "Dafür nutzt du die paraverbalen Mittel. Die folgenden Hinweise sind Empfehlungen, keine festen Regeln: Text und Anlass entscheiden. **Sprechtempo:** Wichtiges, Zahlen und Spannungsstellen sprichst du meist langsamer, Nebensächliches darf zügiger kommen. **Lautstärke:** Du sprichst so laut, dass man dich in der letzten Reihe versteht. Wenn du leiser wirst, kann das Spannung erzeugen. **Stimmführung:** Die Stimme steigt und fällt, damit der Satz Melodie hat. Am Ende einer Aussage senkst du sie meist, weil das Ende dann abgeschlossen klingt. Bei Unabgeschlossenem, etwa mitten in einer Aufzählung, bleibt sie oben. **Betonung:** Du hebst die wichtigsten Wörter eines Satzes hervor. **Pausen:** Eine kurze Pause vor und nach einer wichtigen Stelle lässt die Zuhörenden mitdenken. Übe sie bewusst, zum Beispiel mit stillem Zählen bis zwei.",
      "Du kannst allein oder im Team vortragen. Im Team sprecht ihr ab, wer welchen Abschnitt übernimmt, wie ihr übergebt und wie laut ihr sprecht, damit der Wechsel nicht auffällt. Übe laut, nicht nur im Kopf. Nimm dich mit dem Handy auf und höre die Aufnahme an. Achte auf Tempo, Verständlichkeit und Pausen. Bitte eine Person, die zuhört, um eine Rückmeldung. Ändere danach deine Markierungen und übe noch einmal.",
    ],
    terms: [
      {
        term: "Sinnabschnitt",
        text: "Ein Teil des Textes, der inhaltlich zusammengehört und in einem Zug gesprochen wird.",
      },
      {
        term: "Artikulation",
        text: "Das deutliche Aussprechen der Laute und Wortenden, sodass man dich gut versteht.",
      },
      {
        term: "Sprechtempo",
        text: "Die Geschwindigkeit, mit der du sprichst; sie passt sich dem Inhalt an.",
      },
      {
        term: "Stimmführung",
        text: "Das Heben und Senken der Stimme, das einem Satz Melodie und Sinn gibt.",
      },
      {
        term: "Betonung",
        text: "Die Hervorhebung wichtiger Wörter oder Silben durch Stärke, Höhe oder Dehnung der Stimme.",
      },
    ],
    examples: [
      {
        title: "Ein Text mit Markierungen (eigens verfasst)",
        text: "Der **Nebel** / lag **schwer** über dem See // und plötzlich wurde es **ganz still**.\nRand: langsam, dann leiser",
        analysis:
          "Der einfache Schrägstrich steht für eine kurze, der doppelte für eine längere Pause. Fett gedruckt sind die Wörter, die du betonst. Die Randbemerkung legt Tempo und Lautstärke fest: Der Satz beginnt langsam und wird zum Ende leiser, damit die Stille hörbar wird. Die Zeichen sind persönliche Hilfen. Du kannst auch eigene benutzen, wenn du sie immer gleich einsetzt.",
      },
    ],
    takeaway:
      "Bereite einen Text mit Sinnabschnitten, Betonungen und Randbemerkungen auf und sprich deutlich. Setze Tempo, Lautstärke, Stimmführung, Betonung und Pausen gezielt ein: Sie zeigen, wie du den Text verstehst. Übe laut und höre dich an.",
    sourceIds: ["lp"],
    quiz: {
      question: "Was bedeutet es, einen Text interpretierend vorzutragen?",
      answer: "Du zeigst durch Tempo, Betonung und Pausen, wie du den Text verstehst.",
      wrong: [
        "Du liest jedes Wort gleich laut und gleich schnell, damit nichts verfälscht wird.",
        "Du erzählst den Inhalt mit eigenen Worten, statt den Text zu lesen.",
      ],
      explanation:
        "Interpretierend vortragen heißt, dem Text mit der Stimme einen Sinn zu geben. Gleichmäßiges Lesen lässt die Stimmung verschwinden, und der Inhalt in eigenen Worten ist eine Nacherzählung, kein Vortrag des Textes.",
    },
    workshop: {
      kind: "classify",
      title: "Welches Mittel hilft?",
      instruction:
        "Eine Probelesung wurde aufgenommen und angehört. Ordne jede Beobachtung dem Mittel zu, mit dem du das Problem verbessern kannst.",
      categories: ["Sprechtempo", "Lautstärke", "Stimmführung und Betonung", "Pausen"],
      entries: [
        {
          text: "Du sprichst die Zahlen im Eiltempo, sodass niemand mitschreiben kann.",
          target: 0,
          feedback: "Das Tempo ist das Problem: Bei Zahlen sprichst du langsamer.",
        },
        {
          text: "In der letzten Reihe versteht man nur jedes zweite Wort, weil du zu leise sprichst.",
          target: 1,
          feedback: "Die Lautstärke fehlt: Du musst so laut sprechen, dass man dich hinten versteht.",
        },
        {
          text: "Jeder Satz klingt gleich, weil die Stimme nie steigt oder fällt.",
          target: 2,
          feedback: "Die Stimme hat keine Melodie. Mit Heben und Senken wird der Text lebendig.",
        },
        {
          text: "Nach dem wichtigsten Satz machst du keine Pause, sondern sprichst sofort weiter, sodass er im nächsten untergeht.",
          target: 3,
          feedback: "Eine Pause nach der wichtigen Stelle gibt den Zuhörenden Zeit zum Mitdenken.",
        },
        {
          text: "Die spannende Stelle rauscht vorbei, weil du sie genauso schnell liest wie den Anfang.",
          target: 0,
          feedback: "Spannung braucht Zeit: Langsameres Sprechen lässt sie wirken.",
        },
        {
          text: "Alle Wörter eines Satzes sind gleich stark, deshalb weiß niemand, welches Wort wichtig ist.",
          target: 2,
          feedback: "Die Betonung fehlt: Du hebst das wichtigste Wort durch Stärke oder Höhe hervor.",
        },
      ],
      conclusion:
        "Zu jeder Beobachtung gehört ein Mittel: Tempo, Lautstärke, Stimmführung und Betonung oder Pausen. Wer sie gezielt wählt, trägt wirkungsvoller vor.",
    },
    casework: {
      title: "Lea bereitet den Anfang einer Lesung vor",
      story:
        "Lea soll den Anfang einer Geschichte vorlesen: **„Es war still im Haus. Dann klopfte es. Dreimal. Langsam ging die Tür auf.“** Auf ihrem Blatt steht am Rand: „schnell lesen, laut“. Sie liest den Text so zweimal durch, nimmt sich auf und hört die Aufnahme an.",
      steps: [
        {
          question: "Welche Randbemerkung passt zur stillen, spannenden Stimmung der Stelle?",
          options: [
            "leise und langsam, vor „Dreimal“ eine Pause",
            "schnell und laut, damit es spannend wirkt",
            "gleichmäßig und neutral, damit nichts verfälscht wird",
          ],
          answer: 0,
          explanation:
            "Die Stelle lebt von Stille und Spannung. Leises, langsames Sprechen mit Pausen unterstützt sie. Eile und Lautstärke zerstören die Stimmung, und gleichmäßiges Lesen lässt sie verschwinden.",
        },
        {
          question: "Welche Aufbereitung des Textes hilft Lea am meisten?",
          options: [
            "Sinnabschnitte trennen, wichtige Wörter unterstreichen und Randbemerkungen notieren",
            "Den Text auswendig lernen und alle Markierungen weglassen, damit sie frei spricht",
            "Nur eine große Schrift wählen, damit sie den Text schneller lesen kann",
          ],
          answer: 0,
          explanation:
            "Markierungen und Randbemerkungen machen aus dem Text eine Vorlage für den Vortrag. Auswendiglernen ohne Gestaltungsplan und große Schrift allein helfen nicht, die Wirkung zu planen.",
        },
        {
          question: "Wie kann Lea das Wort „Dreimal“ besonders wirkungsvoll sprechen?",
          options: [
            "Mit einer Pause davor und danach, langsam und deutlich betont",
            "Schnell und ohne Pause, im Anschluss an den vorigen Satz",
            "Laut und mit hoher Stimme, wie einen Ausruf",
          ],
          answer: 0,
          explanation:
            "Ein einzelnes Wort steigert die Spannung, wenn es freigestellt wird: Pausen davor und danach und langsames Sprechen geben ihm Gewicht.",
        },
        {
          question: "Warum nimmt Lea sich auf und hört die Aufnahme an?",
          options: [
            "Sie hört, wie ihr Vortrag klingt, und kann Tempo und Pausen prüfen.",
            "Die Aufnahme soll beim Vortrag vor dem Publikum vorgespielt werden.",
            "Ohne Aufnahme darf man einen Vortrag nicht bewerten oder verbessern.",
          ],
          answer: 0,
          explanation:
            "Die eigene Stimme klingt beim Sprechen anders als von außen. Mit der Aufnahme erkennt Lea, was sie ändern muss, und kann ihre Markierungen anpassen.",
        },
      ],
      verdict:
        "Leas Randbemerkung passte nicht zum Text. Mit leisem, langsamem Sprechen, einer Pause vor „Dreimal“ und einer Aufnahme zur Kontrolle gewinnt der Anfang an Spannung.",
    },
    tasks: {
      1: {
        prompt:
          "Bereite diesen Text zum Vortragen vor: „Am Montag begann der Regen. Er hörte nicht mehr auf. Am Mittwoch stand das Wasser auf der Straße, und am Donnerstag kam der Bus nicht mehr.“ Schreibe ihn ab, setze Schrägstriche für Pausen und GROSSBUCHSTABEN für zwei bis drei betonte Wörter. Ergänze in Klammern zwei Randbemerkungen zu Tempo, Lautstärke oder Stimmführung.",
        hints: [
          "Teile den Text in Sinnabschnitte: Wo würdest du kurz, wo länger innehalten?",
          "Überlege, welche Wörter die Steigerung zeigen: Der Regen wird von Tag zu Tag schlimmer.",
        ],
        model:
          "Am MONTAG begann der Regen. / Er hörte NICHT mehr auf. (langsamer werden) // Am Mittwoch stand das WASSER auf der Straße, / und am Donnerstag kam der Bus nicht mehr. (Stimme am Ende senken, Pause danach) Die Betonungen zeigen, wie die Lage von Tag zu Tag schlimmer wird. Die Pause nach dem letzten Satz gibt den Zuhörenden Zeit, sich die Folgen vorzustellen.",
        criteria: [
          "Der Text ist in Sinnabschnitte mit Schrägstrichen gegliedert.",
          "Zwei bis drei Wörter sind betont, und die Auswahl lässt sich begründen.",
          "Die Randbemerkungen nennen konkrete Mittel wie Tempo, Lautstärke, Stimmführung oder Pause.",
        ],
      },
      2: {
        prompt:
          "Zwei Personen vom Schulradio sprechen diese Durchsage zum Schulfest: „Liebe Schülerinnen und Schüler, am Freitag um 16 Uhr beginnt unser Schulfest. Es gibt Musik, Spiele und ein Buffet. Bitte bringt Becher mit. Der Eintritt ist frei.“ Plane den Vortrag: Wer spricht welchen Teil? Welches paraverbale Mittel setzt ihr bei welchem Satz ein, und warum? Schreibe sechs bis acht Sätze.",
        hints: [
          "Teile die Durchsage in zwei Abschnitte und lege die Übergabe fest.",
          "Überlege, welche Information die Zuhörenden sich merken sollen, und wähle dafür Tempo, Betonung oder Pause.",
        ],
        model:
          "Person A liest die Begrüßung und den ersten Satz, Person B übernimmt ab „Es gibt Musik“. Die Begrüßung sprechen wir freundlich und etwas lauter, damit alle aufmerksam werden. Bei „am Freitag um 16 Uhr“ sprechen wir langsam und betonen Tag und Uhrzeit, danach machen wir eine kurze Pause, weil sich das alle merken sollen. Bei der Aufzählung „Musik, Spiele und ein Buffet“ bleibt die Stimme bei „Musik“ und „Spiele“ oben und fällt erst bei „Buffet“, und kleine Pausen dazwischen machen sie lebendig. „Bitte bringt Becher mit“ betonen wir deutlich, weil es eine Aufforderung ist. Beim letzten Satz „Der Eintritt ist frei“ senken wir die Stimme am Ende, damit er abgeschlossen klingt. Vorher üben wir laut und nehmen uns auf.",
        criteria: [
          "Teilt die Durchsage auf die zwei sprechenden Personen auf und beschreibt die Übergabe.",
          "Nennt mindestens drei paraverbale Mittel an konkreten Stellen.",
          "Begründet jedes Mittel damit, was die Zuhörenden verstehen oder behalten sollen.",
        ],
      },
    },
  },
  {
    id: "de-berufliche-gespraeche",
    lb: 1,
    unit: "1.3",
    covers: ["1.3.1"],
    title: "Berufliche Gespräche: Bewerbung, Beschwerde und Antrag",
    intro:
      "In beruflichen und öffentlichen Gesprächen überzeugst du mit klarem Anliegen, Belegen und höflichem Ton.",
    paragraphs: [
      "Bewerbungsgespräch, Beschwerde, Antrag: In diesen Gesprächen entscheidet jemand anderes, ob du bekommst, was du willst. Du willst die Person für deine Position gewinnen. Dafür hilft eine Strategie. Kläre vorher dein Ziel: Was will ich erreichen, und was wäre mein Mindestergebnis? Überlege, was dein Gegenüber braucht, um zuzustimmen. Notiere die wichtigsten Punkte auf einem Stichwortzettel. Im Gespräch begrüßt du freundlich, nennst dein Anliegen früh und hörst genau zu. In der Regel sprichst du Standardsprache und siezt, wenn nichts anderes vereinbart ist.",
      "Im **Bewerbungsgespräch** prüft der Betrieb, ob du passt, und du prüfst, ob der Betrieb zu dir passt. Typische Fragen sind: „Erzählen Sie etwas über sich“, „Warum möchten Sie diesen Beruf lernen?“ und „Was sind Ihre Stärken?“ Die wichtigste Technik ist **Behauptung plus Beleg**. „Ich bin zuverlässig“ sagt jeder. Überzeugend wird es mit einem Beispiel: „Im Praktikum war ich in drei Wochen nie unpünktlich.“ Zeige, dass du dich über den Betrieb informiert hast, bleibe bei der Wahrheit, auch bei Schwächen, und nenne, was du dagegen tust. Bereite eine eigene Frage vor.",
      "Eine **Beschwerde** kennst du aus Klasse 8. Du bringst sie sachlich vor, damit dein Gegenüber dir helfen kann. Bewährt hat sich ein Aufbau in drei Teilen: Du schilderst den **Sachverhalt** mit Datum und Angaben („Am 12. Mai habe ich bestellt und bezahlt, geliefert wurde nichts“), du nennst die **Begründung**, warum das ein Problem ist, und du formulierst eine **Forderung** mit Frist („Bitte liefern Sie bis Freitag oder erstatten Sie den Betrag“). Bleibe höflich und bestimmt. Beschimpfungen und Verallgemeinerungen wie „Bei Ihnen läuft alles schief“ führen dazu, dass dein Gegenüber sich verteidigt, statt zu helfen. Sagt dein Gegenüber nein, frage nach den Gründen, biete einen Kompromiss an oder bitte um eine zuständige Person.",
      "Bei einem **Antrag** gilt Ähnliches: Du nennst dein Anliegen gleich am Anfang („Ich möchte beantragen, dass …“), begründest es mit sachlichen Argumenten, bietest Nachweise an und fragst am Ende, bis wann du mit einer Entscheidung rechnen kannst. Rechne mit Einwänden und überlege vorher, wie du sie entkräftest oder ihnen entgegenkommst. Weil die App kein Sprechen prüft, übst du hier schriftlich: Du schreibst einen Gesprächsleitfaden und prüfst ihn an den Kriterien. Das schriftliche Bewerben mit Lebenslauf und Anschreiben gehört in Lernbereich 3.",
    ],
    terms: [
      {
        term: "Anliegen",
        text: "Das, was du in einem Gespräch erreichen möchtest, klar und früh formuliert.",
      },
      {
        term: "Sachverhalt",
        text: "Die Tatsachen eines Falls mit Datum und Angaben, sachlich und ohne Wertung geschildert.",
      },
      {
        term: "Forderung",
        text: "Das, was dein Gegenüber tun soll, konkret und mit Frist formuliert.",
      },
      {
        term: "Beleg",
        text: "Ein Beispiel oder Nachweis, der eine Aussage über dich oder dein Anliegen stützt.",
      },
      {
        term: "Kompromissangebot",
        text: "Ein Vorschlag, mit dem du deinem Gegenüber entgegenkommst, um eine Einigung zu erreichen.",
      },
    ],
    examples: [
      {
        title: "Behauptung ohne und mit Beleg (eigens verfasst)",
        text: "Schwach: „Ich bin zuverlässig und teamfähig, und ich arbeite gern.“\nStark: „Ich bin zuverlässig: In meinem Praktikum in der Schreinerei war ich in drei Wochen nie zu spät. Teamfähig bin ich auch, denn beim Schulfest habe ich mit fünf anderen den Aufbau geplant.“",
        analysis:
          "Die erste Antwort enthält nur Behauptungen, die in jeder Bewerbung stehen könnten. Die zweite stützt jede Behauptung mit einem Beleg aus dem eigenen Leben, der konkret und überprüfbar ist. Das macht die Stärken glaubwürdig und bleibt im Gedächtnis.",
      },
    ],
    takeaway:
      "Kläre vorher dein Ziel und bleibe sachlich und höflich. Im Bewerbungsgespräch stützt du jede Stärke mit einem Beleg, in der Beschwerde schilderst du den Sachverhalt, begründest und forderst konkret, im Antrag nennst du das Anliegen früh.",
    sourceIds: ["lp"],
    quiz: {
      question: "Wie begründest du im Bewerbungsgespräch die Stärke „zuverlässig“ am überzeugendsten?",
      answer: "Mit einem konkreten Beispiel, etwa: Im Praktikum kam ich nie zu spät.",
      wrong: [
        "Mit dem Hinweis, dass jeder Betrieb zuverlässige Leute sucht und braucht.",
        "Mit der Aussage, dass du zuverlässiger bist als die meisten anderen Bewerbenden.",
      ],
      explanation:
        "Ein Beleg macht die Behauptung überprüfbar. Der Hinweis auf die Wünsche des Betriebs sagt nichts über dich, und ein Vergleich mit anderen Bewerbenden wirkt überheblich und lässt sich nicht belegen.",
    },
    workshop: {
      kind: "mark",
      title: "Eine Beschwerde auf das Wesentliche prüfen",
      instruction:
        "Nora hat sich ein Telefonat mit einem Fahrradladen aufgeschrieben. Wähle oben einen Teil der Beschwerde und klicke die passenden Sätze an. Sätze, die in keinen der drei Teile gehören, lässt du unmarkiert.",
      labels: ["Sachverhalt", "Begründung", "Forderung"],
      text: [
        { t: "Guten Tag, hier spricht Nora Weiss. " },
        {
          t: "Ich habe am 12. Mai ein Fahrrad bei Ihnen bestellt und sofort bezahlt. ",
          label: 0,
          feedback: "Datum, Bestellung und Zahlung sind Tatsachen, die den Fall beschreiben: Sachverhalt.",
        },
        {
          t: "Bis heute, den 9. Juni, ist es nicht geliefert worden. ",
          label: 0,
          feedback: "Auch dass das Rad bis heute nicht geliefert wurde, ist eine Tatsache: Sachverhalt.",
        },
        {
          t: "Das ist ein Problem, weil ich das Rad für meinen Schulweg brauche und seit Wochen mit dem Bus fahren muss. ",
          label: 1,
          feedback:
            "Der Satz erklärt, warum die Verspätung ein Problem ist: Er nennt die Folge für Nora. Das ist die Begründung.",
        },
        { t: "Bei Ihnen läuft ja sowieso alles schief! " },
        { t: "Das ist eine Frechheit! " },
        {
          t: "Ich bitte Sie, mir das Rad bis nächsten Freitag zu liefern. ",
          label: 2,
          feedback: "Hier steht, was die Firma tun soll, und bis wann: eine Forderung mit Frist.",
        },
        {
          t: "Falls das nicht möglich ist, möchte ich mein Geld zurück. ",
          label: 2,
          feedback: "Der Wunsch für den Fall, dass die Lieferung nicht klappt, ist ebenfalls eine Forderung.",
        },
        { t: "Vielen Dank für Ihre Hilfe, auf Wiederhören." },
      ],
      conclusion:
        "Sachverhalt, Begründung und Forderung machen die Beschwerde klar. Vorwürfe und Beschimpfungen tragen nichts dazu bei und schaden dem Anliegen.",
    },
    casework: {
      title: "Ein Vorstellungsgespräch im Einzelhandel",
      story:
        "Frau Kern fragt Jonas: „Warum möchten Sie eine Ausbildung im Einzelhandel machen?“ Jonas antwortet: „Ich arbeite gern mit Menschen. **Im Praktikum im Sportgeschäft habe ich Kundinnen und Kunden beraten**, und das Feedback war gut. Außerdem sagt man mir zu Hause, dass ich geduldig bin.“ Frau Kern fragt weiter: „Was sind Ihre Schwächen?“ Jonas sagt: „Ich kontrolliere manchmal alles dreimal und brauche dann zu lange. **Deshalb arbeite ich jetzt mit einer Checkliste.**“",
      steps: [
        {
          question: "Wie stützt Jonas seine Behauptung, dass er gern mit Menschen arbeitet?",
          options: [
            "Mit einem Beispiel aus dem Praktikum im Sportgeschäft",
            "Mit dem Hinweis, dass alle in seiner Familie so sind",
            "Mit der Wiederholung desselben Satzes in anderen Worten",
          ],
          answer: 0,
          explanation:
            "Jonas nennt einen konkreten Beleg aus einer beruflichen Situation. So wird aus der Behauptung eine überprüfbare Aussage.",
        },
        {
          question: "Welche Angabe in Jonas’ Antwort lässt sich am schlechtesten überprüfen?",
          options: [
            "Dass man ihm zu Hause sagt, er sei geduldig",
            "Dass er im Praktikum Kundschaft beraten hat",
            "Dass er sein Praktikum in einem Sportgeschäft gemacht hat",
          ],
          answer: 0,
          explanation:
            "Was man zu Hause sagt, lässt sich nicht prüfen und hat mit dem Beruf wenig zu tun. Das Praktikum im Sportgeschäft ist konkret und berufsnah, der Betrieb kann es bestätigen.",
        },
        {
          question: "Wie geht Jonas mit der Frage nach seinen Schwächen um?",
          options: [
            "Er nennt eine echte Schwäche und sagt, was er dagegen tut.",
            "Er sagt, dass er keine Schwächen hat.",
            "Er nennt eine Stärke und tut so, als wäre sie eine Schwäche.",
          ],
          answer: 0,
          explanation:
            "Jonas bleibt ehrlich und zeigt zugleich, dass er an der Schwäche arbeitet. Das wirkt glaubwürdig. Keine Schwächen zu haben oder Stärken als Schwächen auszugeben, überzeugt weniger.",
        },
        {
          question: "Welche Sprache passt zu diesem Gespräch?",
          options: [
            "Standardsprache mit höflicher Anrede",
            "Umgangssprache wie unter Freunden",
            "Fachsprache, die möglichst kompliziert klingt",
          ],
          answer: 0,
          explanation:
            "In einem beruflichen Gespräch passt die Standardsprache mit höflicher Anrede. Umgangssprache wirkt zu locker, und Fachsprache ohne Grund wirkt gekünstelt.",
        },
      ],
      verdict:
        "Jonas überzeugt mit Beispielen aus dem Praktikum und geht ehrlich mit seiner Schwäche um. Ein einziger vager Beleg fällt im Vergleich auf. Deshalb lohnt sich die Vorbereitung.",
    },
    tasks: {
      1: {
        prompt:
          "Du hast am 3. März Kopfhörer in einem Online-Shop bestellt und bezahlt. Heute ist der 2. April, und sie sind nicht angekommen. Du rufst beim Kundenservice an. Schreibe einen Gesprächsleitfaden in vier bis sechs Sätzen: Begrüßung, Sachverhalt, Begründung, Forderung mit Frist.",
        hints: [
          "Nenne Datum und Bestellung genau und lass Vorwürfe weg.",
          "Eine Forderung sagt, was geschehen soll und bis wann, zum Beispiel Lieferung oder Erstattung.",
        ],
        model:
          "Guten Tag, hier spricht Jan Berger. Ich habe am 3. März Kopfhörer bei Ihnen bestellt und sofort bezahlt, geliefert wurde bisher nichts. Das ist ein Problem, weil ich sie für die Prüfungsvorbereitung brauche und seit Wochen warte. Ich bitte Sie, mir die Kopfhörer bis nächsten Freitag zu schicken. Falls das nicht möglich ist, erstatten Sie mir bitte den Betrag. Vielen Dank für Ihre Hilfe.",
        criteria: [
          "Schildert den Sachverhalt mit Datum und ohne Vorwurf.",
          "Nennt eine Begründung, warum das ein Problem ist.",
          "Formuliert eine konkrete Forderung mit Frist.",
        ],
      },
      2: {
        prompt:
          "Du möchtest beim Schulleiter, Herrn Aigner, beantragen, dass der Kunstraum in den Mittagspausen als Arbeitsraum genutzt werden darf. Schreibe, was du in dem Gespräch sagst, in fünf bis sechs Sätzen: Anliegen, zwei Argumente mit Beleg, Umgang mit einem möglichen Einwand und die Frage nach der Entscheidung.",
        hints: [
          "Nenne dein Anliegen gleich am Anfang.",
          "Überlege, welcher Einwand zu erwarten ist, zum Beispiel die Aufsicht, und biete eine Lösung an.",
        ],
        model:
          "Guten Tag, Herr Aigner. Ich möchte beantragen, dass wir den Kunstraum in den Mittagspausen als Arbeitsraum nutzen dürfen. Viele von uns brauchen einen ruhigen Ort für Gruppenarbeiten, denn im Klassenzimmer ist es zu laut. In der letzten Woche haben sich zwölf Schülerinnen und Schüler in die Bibliothek gedrängt, die nur Platz für acht hat. Mir ist klar, dass dort Aufsicht nötig ist. Wir könnten uns eintragen, und eine Lehrkraft schaut nur zwischendurch vorbei. Bis wann können wir mit Ihrer Entscheidung rechnen?",
        criteria: [
          "Nennt das Anliegen gleich am Anfang.",
          "Stützt das Anliegen mit zwei Argumenten und mindestens einem Beleg.",
          "Geht auf einen möglichen Einwand ein und fragt nach der Entscheidung.",
        ],
      },
    },
  },
  {
    id: "de-gespraechsverhalten",
    lb: 1,
    unit: "1.3",
    covers: ["1.3.2"],
    title: "In Gesprächen und Diskussionen angemessen reagieren",
    intro:
      "Wie du reagierst, hängt von der Situation ab. Sprachebene, Körpersprache und der Bezug auf andere gehören dazu.",
    paragraphs: [
      "Eine angemessene Reaktion richtet sich nach der Situation. Drei Fragen helfen: Was will ich erreichen? Wer hört zu? Wie förmlich ist der Anlass? Eine **sachliche** Reaktion nennt Informationen und Argumente ruhig und ohne Angriffe. Sie passt, wenn etwas geklärt werden soll. Eine **appellative** Reaktion fordert auf, etwas zu tun: „Lasst uns am Samstag den Pausenhof säubern, jede Hand zählt!“ Sie passt, wenn du andere zum Mitmachen bewegen willst, aber nicht, wenn jemand erst verstehen soll, worum es geht.",
      "Zu jeder Reaktion gehören verbale und nonverbale Aspekte. Die **Sprachebene** muss zur Situation passen: Unter Freunden ist Umgangssprache in Ordnung, vor Eltern, in einer Podiumsdiskussion oder in einer Behörde sprichst du in der Regel Standardsprache und wählst Wörter, die niemanden abwerten. Deine **Körpersprache** zeigt, ob du zuhörst: Du wendest dich der sprechenden Person zu, hältst Blickkontakt und nickst, wenn du etwas verstehst. Auch die Stimme sagt etwas: Ein genervter Ton macht aus einem sachlichen Satz schnell einen Vorwurf.",
      "Gespräche gelingen, wenn du den Verlauf mitsteuerst. Lass andere ausreden und melde dich, bevor du sprichst. Wenn das Gespräch vom Thema abkommt, kannst du es zurückholen: „Das ist wichtig, aber wir wollten zuerst über den Wandertag sprechen.“ Als Gesprächsleitung erteilst du das Wort und achtest darauf, dass alle zu Wort kommen. Besonders wichtig ist das **Anknüpfen**: Du greifst eine Äußerung auf, bevor du deine eigene sagst: „Du hast gerade gesagt, dass Gruppenarbeit anstrengend ist. Ich sehe das anders, weil …“ So hängen die Beiträge zusammen, und die anderen merken, dass du zuhörst.",
      "Dein Gesprächsverhalten kannst du kritisch hinterfragen. Besonders aufschlussreich ist ein **Video-Feedback**: Mit Einverständnis aller Beteiligten nehmt ihr eine Diskussion auf und schaut sie gemeinsam an. Du erkennst Dinge, die du im Gespräch nicht bemerkst, zum Beispiel Füllwörter, Unterbrechungen oder fehlenden Blickkontakt. Fragen für die Auswertung: Wie viel habe ich gesprochen? Bin ich anderen ins Wort gefallen? Habe ich an Beiträge angeknüpft? Passte meine Sprachebene? Wähle danach ein bis zwei Ziele für das nächste Gespräch. Die Aufnahme bleibt in der Gruppe und wird nicht weitergegeben.",
    ],
    terms: [
      {
        term: "Sachliche Reaktion",
        text: "Eine Reaktion, die ruhig Informationen und Argumente nennt und niemanden angreift.",
      },
      {
        term: "Appellative Reaktion",
        text: "Eine Reaktion, die andere auffordert, etwas zu tun oder zu lassen.",
      },
      {
        term: "Sprachebene",
        text: "Die Stilschicht der Sprache, zum Beispiel Umgangssprache oder Standardsprache, die zur Situation passen muss.",
      },
      {
        term: "Anknüpfen",
        text: "Eine Äußerung einer anderen Person aufgreifen und von ihr aus den eigenen Beitrag entwickeln.",
      },
      {
        term: "Video-Feedback",
        text: "Die gemeinsame Auswertung einer Aufnahme, um das eigene Gesprächsverhalten zu überprüfen.",
      },
    ],
    examples: [
      {
        title: "Anknüpfen in einer Diskussion (eigens verfasst)",
        text: "Mia: „Ich bin für Berlin, weil es dort die meisten Museen gibt.“\nTim: „Du hast gesagt, dass dir die Museen wichtig sind. Das verstehe ich. Ich denke aber an die Kosten: Die Zugfahrt nach Berlin ist teuer.“",
        analysis:
          "Tim knüpft mit „Du hast gesagt“ an Mias Satz an und zeigt, dass er sie verstanden hat. Er stimmt einem Teil zu („Das verstehe ich“) und widerspricht dann sachlich mit einem eigenen Grund. So bleibt das Gespräch zusammenhängend und freundlich, obwohl die beiden unterschiedlicher Meinung sind.",
      },
    ],
    takeaway:
      "Wähle die Reaktion nach der Situation: sachlich zum Klären, appellativ zum Aufrufen. Achte auf Sprachebene, Körpersprache und Gesprächsverlauf und knüpfe an Äußerungen anderer an. Überprüfe dein Verhalten kritisch, zum Beispiel mit Video-Feedback.",
    sourceIds: ["lp"],
    quiz: {
      question: "Wie knüpfst du in einer Diskussion an einen Beitrag an?",
      answer: "Ich greife einen Gedanken der anderen Person auf und sage, ob und warum ich zustimme oder widerspreche.",
      wrong: [
        "Ich warte, bis die andere Person fertig ist, und trage dann meinen vorbereiteten Beitrag vor.",
        "Ich widerspreche sofort, damit mein Standpunkt zuerst gehört wird.",
      ],
      explanation:
        "Anknüpfen heißt, die Äußerung der anderen Person aufzunehmen. Wer nur den eigenen Beitrag vorträgt oder sofort widerspricht, geht nicht auf die andere Person ein, und das Gespräch zerfällt in einzelne Statements.",
    },
    workshop: {
      kind: "choose",
      title: "Welche Reaktion passt?",
      instruction:
        "Wähle in jedem Satz die Reaktion, die zur Situation passt. Achte auf die Absicht, die Sachlichkeit, die Sprachebene und den Bezug auf andere.",
      items: [
        {
          before: "Paul fällt dir im Klassenrat ins Wort. Du sagst: „",
          options: [
            "Lass mich bitte kurz ausreden, dann höre ich dir zu.",
            "Halt doch mal den Mund, du Quatschkopf!",
            "Typisch, du hörst ja sowieso nie zu.",
          ],
          answer: 0,
          after: "“",
          feedback: "Sachlich und höflich: Du sagst, was du brauchst, und greifst Paul nicht persönlich an.",
        },
        {
          before: "Du stellst bei einem Elternabend dein Projekt vor. Du beginnst mit: „",
          options: [
            "Guten Abend, ich freue mich, dass Sie gekommen sind.",
            "Hey Leute, cool, dass ihr da seid.",
          ],
          answer: 0,
          after: "“",
          feedback: "Vor Eltern und in einer öffentlichen Situation passt die Standardsprache mit höflicher Anrede.",
        },
        {
          before: "Lena hat gerade gesagt, dass sie Gruppenarbeit anstrengend findet. Du antwortest: „",
          options: [
            "Du hast gerade gesagt, dass dich Gruppenarbeit anstrengt. Was genau fällt dir schwer?",
            "Ich mag Einzelarbeit sowieso lieber, egal was ihr sagt.",
            "Darüber reden wir jetzt nicht, ich habe ein anderes Thema.",
          ],
          answer: 0,
          after: "“",
          feedback: "Du greifst Lenas Aussage auf und fragst nach. So knüpfst du an und zeigst, dass du zuhörst.",
        },
        {
          before: "Die Diskussion schweift vom Wandertag zum Pausenverkauf ab. Als Gesprächsleitung sagst du: „",
          options: [
            "Danke für den Hinweis, den Pausenverkauf besprechen wir später. Jetzt zurück zum Wandertag.",
            "Mir ist egal, worüber ihr redet.",
            "Ihr redet alle nur Unsinn.",
          ],
          answer: 0,
          after: "“",
          feedback:
            "Du würdigst den Beitrag und holst das Gespräch freundlich zum Thema zurück: So steuerst du den Verlauf.",
        },
        {
          before: "Du möchtest, dass die Klasse bei einer Müllsammelaktion mitmacht. Du forderst sie dazu auf: „",
          options: [
            "Lasst uns am Samstag gemeinsam den Pausenhof säubern, jede Hand zählt!",
            "Der Pausenhof war am Montag voller Verpackungen.",
            "Es wäre ja vielleicht möglich, dass man irgendwann etwas tun könnte.",
          ],
          answer: 0,
          after: "“",
          feedback:
            "Ein Appell fordert konkret zum Mitmachen auf. Die Information nennt nur den Zustand, und der dritte Satz ist zu vage.",
        },
      ],
      conclusion:
        "Eine angemessene Reaktion ist sachlich, passt zur Situation und knüpft an das an, was die anderen gesagt haben.",
    },
    casework: {
      title: "Eine Diskussion vor dem Jahrgang",
      story:
        "Bei einer Diskussion vor dem ganzen Jahrgang geht es um das Ziel des Wandertags. Ben (spricht schnell, schaut zur Decke): „Also, ich find den Freizeitpark mega, weil da halt voll viel geht.“ Mara: „Da geht ja nur Geld drauf.“ Ben (unterbricht): „Das ist doch Quatsch!“ Mara: **„Lass mich bitte ausreden. Du hast gesagt, dass dort viel geboten ist. Das stimmt, aber der Eintritt kostet 38 Euro.“** Moderator Eric: „Danke euch beiden. Ich fasse zusammen: Ben nennt das Angebot, Mara die Kosten. Wer kennt eine Lösung dazwischen?“",
      steps: [
        {
          question: "Was fällt an Bens erstem Beitrag auf?",
          options: [
            "Er spricht umgangssprachlich und sieht zur Decke, nicht zu den Zuhörenden.",
            "Er spricht sehr förmlich und zu leise, sodass man ihn in der letzten Reihe kaum versteht.",
            "Er begründet seine Meinung ausführlich mit Zahlen und Belegen aus dem Prospekt des Parks.",
          ],
          answer: 0,
          explanation:
            "Wörter wie „mega“, „halt“ und „voll“ passen nicht zu einer Diskussion vor dem Jahrgang, und der Blick zur Decke nimmt den Kontakt zum Publikum.",
        },
        {
          question: "Welcher Satz von Mara knüpft sachlich an Ben an?",
          options: [
            "„Du hast gesagt, dass dort viel geboten ist. Das stimmt, aber der Eintritt kostet 38 Euro.“",
            "„Dort geht ja nur Geld drauf, und irgendein anderes Ziel wäre sowieso viel besser für uns alle.“",
            "„Ich habe schon gesagt, dass ich dagegen bin, und dabei bleibe ich auch, egal was ihr sagt.“",
          ],
          answer: 0,
          explanation:
            "Nur der erste Satz greift Bens Aussage auf, stimmt einem Teil zu und widerspricht mit einem Grund. Die anderen Sätze gehen nicht auf das ein, was Ben gesagt hat.",
        },
        {
          question: "Wie steuert Eric den Gesprächsverlauf?",
          options: [
            "Er dankt, fasst beide Positionen zusammen und fragt nach einer Lösung.",
            "Er stimmt Ben zu, weil dieser zuerst gesprochen hat, und beendet die Diskussion.",
            "Er schweigt und wartet ab, bis sich beide wieder beruhigt haben.",
          ],
          answer: 0,
          explanation:
            "Eric würdigt beide Beiträge, ordnet sie und führt das Gespräch mit einer offenen Frage weiter. So bleibt es sachlich und zielgerichtet.",
        },
        {
          question: "Was zeigt dir ein Video-Feedback über Ben, das er im Gespräch kaum merkt?",
          options: [
            "Auffälligkeiten wie Füllwörter und fehlenden Blickkontakt",
            "Welche der beiden Seiten im Streit recht hat und warum",
            "Was er während des Gesprächs gefühlt und gedacht hat",
          ],
          answer: 0,
          explanation:
            "Eine Aufnahme zeigt sichtbares und hörbares Verhalten. Wer recht hat, entscheiden Argumente, nicht die Aufnahme, und was Ben gefühlt und gedacht hat, kann nur er selbst sagen.",
        },
      ],
      verdict:
        "Mara und Eric führen das Gespräch auf die Sache zurück: Sie knüpfen an, bleiben sachlich und steuern den Verlauf. Ben kann mit Video-Feedback an Sprachebene und Blickkontakt arbeiten.",
    },
    tasks: {
      1: {
        prompt:
          "In einer Diskussion über das Schulfest sagt jemand aus deiner Klasse: „Ein Eintrittspreis ist unfair, weil dann ärmere Familien nicht kommen können.“ Schreibe zwei Reaktionen: erst eine sachliche, die an diese Aussage anknüpft, dann eine appellative, die zu einer Handlung auffordert.",
        hints: [
          "Beginne die sachliche Reaktion mit „Du hast gesagt, dass …“ und nenne dann deinen Grund.",
          "Eine appellative Reaktion ruft zu etwas auf, zum Beispiel mit „Lasst uns …“ oder „Bitte …“.",
        ],
        model:
          "Sachlich: „Du hast gesagt, dass ein Eintrittspreis ärmere Familien ausschließen kann. Das sehe ich auch so. Ich schlage deshalb vor, dass die Preise freiwillig sind und jede Person gibt, was sie kann.“ Appellativ: „Lasst uns beim Schulfest einen Spendentopf aufstellen, damit niemand draußen bleiben muss. Bitte meldet euch, wenn ihr beim Aufbau helfen wollt!“",
        criteria: [
          "Die sachliche Reaktion knüpft mit eigenen Worten an die Aussage an.",
          "Die sachliche Reaktion nennt einen Grund oder Vorschlag und bleibt ruhig.",
          "Die appellative Reaktion fordert konkret zu einer Handlung auf.",
        ],
      },
      2: {
        prompt:
          "Deine Gruppe hat eine Diskussion gefilmt (alle sind einverstanden) und wertet sie gemeinsam aus. Schreibe fünf Beobachtungsfragen für die Auswertung, darunter mindestens eine zur Sprachebene oder Wortwahl, eine zur Körpersprache und eine zum Anknüpfen. Formuliere danach zwei konkrete Ziele für das nächste Gespräch.",
        hints: [
          "Formuliere die Fragen so, dass man sie mit dem Video beantworten kann, zum Beispiel mit einer Zahl.",
          "Ein Ziel ist konkret, wenn man es überprüfen kann, zum Beispiel „dreimal an eine Aussage anknüpfen“.",
        ],
        model:
          "1. Wie oft habe ich einen anderen unterbrochen? 2. Habe ich Standardsprache benutzt oder Wörter wie „halt“ und „voll“ gesagt? 3. Habe ich beim Sprechen zu den anderen gesehen? 4. Wie oft habe ich an eine Aussage angeknüpft, bevor ich meinen Beitrag sagte? 5. Wie viel Zeit habe ich im Vergleich zu den anderen gesprochen? Meine Ziele: Ich knüpfe in der nächsten Diskussion mindestens dreimal an eine Aussage an. Außerdem lasse ich alle ausreden und zähle bis zwei, bevor ich antworte.",
        criteria: [
          "Enthält fünf Fragen, die man am Video beantworten kann.",
          "Deckt Sprachebene oder Wortwahl, Körpersprache und Anknüpfen ab.",
          "Die zwei Ziele sind konkret und überprüfbar.",
        ],
      },
    },
  },
  {
    id: "de-debatte-rollen",
    lb: 1,
    unit: "1.3",
    covers: ["1.3.3"],
    title: "Debatte: Standpunkte, Rollen und Ablauf",
    intro:
      "In einer Debatte vertrittst du einen Standpunkt, auch wenn er nicht deiner ist. So lernst du ein Thema von mehreren Seiten kennen.",
    paragraphs: [
      "In einer **Diskussion** tauschen Menschen offen Meinungen aus. Eine **Debatte** ist in der Schule meist strenger geregelt: Zwei Seiten, **Pro** und **Contra**, vertreten gegensätzliche Standpunkte zu einer **Streitfrage**, zum Beispiel: „Soll die Schule alle Hausaufgaben abschaffen?“ Es gibt feste Rollen, Regeln und Redezeiten, und am Ende kann das Publikum abstimmen. Debatten kennst du aus Klasse 8, hier vertiefst du die Rollen. Sie werden oft zugeteilt. Das ist kein Zufall: Wer eine Seite vertreten muss, die nicht die eigene ist, lernt ihre Argumente kennen. Dieser **Perspektivwechsel** hilft dir, ein Thema von verschiedenen Seiten zu sehen und deine eigene Meinung besser zu begründen.",
      "Die wichtigsten Rollen: Die **Pro-Seite** und die **Contra-Seite** bereiten Argumente vor und tragen sie vor. Die **Moderation** leitet die Debatte, bleibt neutral, nennt die Streitfrage, erteilt das Wort und achtet auf die Regeln. Die Person, die die Zeit nimmt, achtet auf die Redezeiten. Das Publikum hört zu und stimmt am Ende ab oder bewertet die Argumente nach Kriterien. Wer die eigene Rolle kennt, kann sich auf die zugehörige Aufgabe konzentrieren.",
      "Ein möglicher Ablauf: Die Moderation eröffnet, nennt die Streitfrage, die Regeln und die Redezeiten. Dann tragen Pro und Contra nacheinander ihre Eröffnungsstatements vor. Im Schlagabtausch antworten die Seiten mit Argument und Gegenargument, jeweils wenn die Moderation das Wort erteilt. Danach fasst jede Seite in einem Schlussstatement ihre stärksten Argumente zusammen. Anschließend stimmt das Publikum ab. Am Ende steht die Auswertung: Was hat überzeugt, und wie haben die Rollen funktioniert? Je nach Regeln der Klasse kann die Reihenfolge leicht abweichen.",
      "In der Debatte erprobst du Argumentationstechniken. Ordne deine Argumente nach Stärke und belege jedes mit einem Beispiel. Nimm Einwände vorweg („Man könnte einwenden, dass …“) und halte eine Antwort bereit. Gib berechtigten Punkten der Gegenseite recht („Das stimmt, aber …“) und nutze Fragen, die die Gegenseite zu einer Antwort zwingen. Eine **Rollenkarte** hilft bei der Vorbereitung: Sie enthält deine Rolle, deinen Standpunkt in einem Satz, drei Argumente mit Beleg und zwei erwartete Einwände mit deiner Antwort. Nach der Debatte fragst du dich: Hat sich meine eigene Meinung verändert, und warum?",
    ],
    terms: [
      {
        term: "Debatte",
        text: "Ein geregelter Schlagabtausch, in dem zwei Seiten gegensätzliche Standpunkte zu einer Streitfrage vertreten.",
      },
      {
        term: "Streitfrage",
        text: "Die Frage, über die die Debatte geführt wird; man kann sie mit Ja oder Nein beantworten.",
      },
      {
        term: "Moderation",
        text: "Die neutrale Leitung der Debatte: Sie erteilt das Wort und achtet auf die Regeln.",
      },
      {
        term: "Perspektivwechsel",
        text: "Das Einnehmen eines fremden Standpunkts, um ein Thema von mehreren Seiten zu verstehen.",
      },
      {
        term: "Rollenkarte",
        text: "Eine Karte mit Rolle, Standpunkt, Argumenten und erwarteten Einwänden zur Vorbereitung auf die Debatte.",
      },
    ],
    examples: [
      {
        title: "Eine Rollenkarte (eigens verfasst)",
        text: "Rolle: Contra\nStreitfrage: Soll die Schule alle Hausaufgaben abschaffen?\nStandpunkt: Hausaufgaben sollen bleiben, aber kürzer werden.\nArgument 1: Wiederholung festigt den Stoff. Beleg: Vokabeln lernt man durch Wiederholen.\nArgument 2: Hausaufgaben üben selbstständiges Arbeiten. Beleg: Im Beruf plant man Aufgaben ohne Aufsicht.\nErwarteter Einwand: Hausaufgaben stressen. Meine Antwort: Deshalb sollen sie kürzer werden.",
        analysis:
          "Die Karte zeigt auf einen Blick, was du in der Debatte brauchst: eine Rolle, einen Standpunkt in einem Satz, Argumente mit Belegen und eine Antwort auf einen erwarteten Einwand. Wer so vorbereitet ist, kann im Schlagabtausch ruhig reagieren. Die Rolle muss nicht deine eigene Meinung sein.",
      },
    ],
    takeaway:
      "Eine Debatte hat Rollen, Regeln und einen festen Ablauf. Du vertrittst einen zugeteilten Standpunkt, um andere Perspektiven kennenzulernen. Bereite Argumente mit Belegen und Antworten auf Einwände vor, am besten auf einer Rollenkarte.",
    sourceIds: ["lp"],
    quiz: {
      question: "Warum vertrittst du in einer Debatte manchmal einen Standpunkt, der nicht deiner ist?",
      answer: "Weil du so die Argumente der anderen Seite kennenlernst und deine eigenen prüfst.",
      wrong: [
        "Weil die Klasse sonst keine Rolle übernehmen will und die Debatte ausfällt.",
        "Weil du so die Gegenseite am besten überstimmen und die Abstimmung gewinnen kannst.",
      ],
      explanation:
        "Der Perspektivwechsel ist der Sinn der Übung: Du lernst Argumente der anderen Seite kennen und prüfst deine eigene Meinung. Eine Debatte soll Standpunkte erproben, nicht nur gewinnen.",
    },
    workshop: {
      kind: "timeline",
      title: "Der Ablauf einer Debatte",
      instruction:
        "Ordne die Phasen dieser Debatte in ihrer Reihenfolge. Jede Phase setzt voraus, was davor geschehen ist. Benutze die Pfeile, um einen Eintrag nach oben oder unten zu schieben.",
      categories: [],
      entries: [
        {
          text: "Eröffnung: Die Moderation nennt die Streitfrage, die Regeln und die Redezeiten, noch bevor eine Seite spricht.",
          target: 0,
          feedback: "Am Anfang erklärt die Moderation, worum es geht und wie die Debatte läuft. Ohne Streitfrage gibt es nichts zu debattieren.",
        },
        {
          text: "Eröffnungsstatements: Nach der Eröffnung tragen Pro und Contra nacheinander ihre Position mit den wichtigsten Argumenten vor.",
          target: 1,
          feedback: "Erst müssen beide Positionen bekannt sein, bevor die Seiten aufeinander antworten können.",
        },
        {
          text: "Schlagabtausch: Die Seiten antworten auf die vorgetragenen Positionen mit Argument und Gegenargument, wenn die Moderation das Wort erteilt.",
          target: 2,
          feedback: "Der Schlagabtausch setzt voraus, dass beide Positionen vorgetragen wurden.",
        },
        {
          text: "Schlussstatements: Jede Seite fasst zusammen, was sich im Schlagabtausch gezeigt hat und welche ihrer Argumente am stärksten sind.",
          target: 3,
          feedback: "Zusammenfassen lässt sich erst, was im Schlagabtausch gesagt wurde.",
        },
        {
          text: "Abstimmung: Nachdem beide Schlussstatements gehört sind, stimmt das Publikum über die Streitfrage ab.",
          target: 4,
          feedback: "Abgestimmt wird erst, wenn alle Argumente und beide Schlussstatements gehört sind.",
        },
        {
          text: "Auswertung: Wenn das Ergebnis der Abstimmung feststeht, fragen alle: Was hat überzeugt, und wie haben die Rollen funktioniert?",
          target: 5,
          feedback: "Die Auswertung blickt auf Debatte und Ergebnis zurück und steht deshalb am Ende.",
        },
      ],
      conclusion:
        "Eröffnung, Statements, Schlagabtausch, Schlussstatements, Abstimmung und Auswertung geben der Debatte eine faire und nachvollziehbare Ordnung.",
    },
    casework: {
      title: "Eine Debatte über den Schulgarten",
      story:
        "Streitfrage: Soll die Schule jede Woche eine Stunde für den Schulgarten freihalten? Die Eröffnungsstatements sind gehalten, jetzt läuft der Schlagabtausch. Moderatorin Ida: „Pro, bitte beginne.“ Sam (Pro): „Der Garten verbindet Lernen und Bewegung, denn wer Beete anlegt, lernt Biologie mit den Händen.“ Yara (Contra): **„Sam sagt, dass der Garten Lernen und Bewegung verbindet. Das stimmt. Aber die Stunde fehlt dann in Mathematik und Deutsch. Man könnte den Garten auch in einer AG pflegen.“** Pia (Zeit): „Noch dreißig Sekunden.“",
      steps: [
        {
          question: "Welche Aufgabe hat Ida?",
          options: [
            "Sie leitet die Debatte neutral, nennt die Regeln und erteilt das Wort.",
            "Sie vertritt die Pro-Seite und trägt für sie das Schlussstatement vor.",
            "Sie entscheidet am Ende allein, welche Seite recht hat und gewonnen hat.",
          ],
          answer: 0,
          explanation:
            "Die Moderation eröffnet, leitet und bleibt neutral. Sie vertritt keine Seite, und über das Ergebnis stimmt das Publikum ab.",
        },
        {
          question: "Wie geht Yara mit Sams Argument um?",
          options: [
            "Sie gibt ihm in einem Punkt recht und widerspricht mit einem eigenen Grund.",
            "Sie überhört es und beginnt stattdessen mit einem ganz neuen Thema.",
            "Sie wiederholt es wörtlich und stimmt Sam in jedem Punkt vollständig zu, ohne zu widersprechen.",
          ],
          answer: 0,
          explanation:
            "Yara zeigt, dass sie zugehört hat, und widerspricht mit einem Grund, der zur Streitfrage passt. So bleibt der Schlagabtausch sachlich.",
        },
        {
          question: "Welche Technik nutzt Yara mit dem Satz „Man könnte den Garten auch in einer AG pflegen“?",
          options: [
            "Sie schlägt eine Alternative vor, die das Anliegen der Pro-Seite erhält.",
            "Sie greift Sam persönlich an und stellt seine Absicht infrage.",
            "Sie stellt eine rhetorische Frage, auf die sie von Sam keine Antwort erwartet.",
          ],
          answer: 0,
          explanation:
            "Yara nimmt Sams Anliegen auf und zeigt einen anderen Weg. Das ist eine Alternative und kein persönlicher Angriff. Eine Frage stellt sie nicht.",
        },
        {
          question: "Was sollte Sam auf seiner Rollenkarte vorbereitet haben, um Yara zu antworten?",
          options: [
            "Eine Antwort auf den Einwand, dass die Stunde in anderen Fächern fehlt",
            "Noch mehr Argumente derselben Art, aber keine Antwort auf mögliche Einwände der Gegenseite",
            "Seine private Meinung zum Fach Biologie und zum Schulgarten, unabhängig von seiner Rolle",
          ],
          answer: 0,
          explanation:
            "Wer Einwände vorhersieht, kann ruhig antworten. Weitere Argumente ohne Antwort auf Einwände helfen im Schlagabtausch nicht, und die private Meinung zählt in der Rolle nicht.",
        },
      ],
      verdict:
        "Die Debatte zeigt, wie die Rollen zusammenarbeiten: Die Moderation leitet, die Seiten argumentieren und gehen auf die Argumente der anderen ein. Wer Einwände vorhersieht, antwortet ruhiger.",
    },
    tasks: {
      1: {
        prompt:
          "Du bist in der Contra-Rolle bei der Streitfrage: „Soll es in der Mensa einen festen Tag pro Woche ohne Fleisch geben?“ Die Rolle muss nicht deine Meinung sein. Schreibe deine Rollenkarte: deinen Standpunkt in einem Satz, drei Argumente mit je einem Beleg und einen erwarteten Einwand der Pro-Seite mit deiner Antwort.",
        hints: [
          "Überlege, was für Contra spricht, zum Beispiel Wahlfreiheit, Geschmack oder Ernährung.",
          "Frage dich: Was würde die Pro-Seite entgegnen, und wie kannst du darauf antworten?",
        ],
        model:
          "Rolle: Contra. Standpunkt: Die Mensa soll weiterhin jeden Tag Wahlmöglichkeiten anbieten. Argument 1: Wahlfreiheit. Beleg: Wer keinen fleischlosen Tag will, müsste an diesem Tag auswärts essen. Argument 2: Beliebtheit. Beleg: In unserer Klasse holen sich viele am liebsten Nudeln mit Fleischsoße. Argument 3: Alternative. Beleg: Ein fleischloses Gericht kann jeden Tag zusätzlich angeboten werden. Erwarteter Einwand: Weniger Fleisch ist besser für das Klima. Meine Antwort: Das stimmt, aber ein zusätzliches Angebot erreicht das auch, ohne jemanden zu zwingen.",
        criteria: [
          "Der Standpunkt steht in einem Satz.",
          "Jedes der drei Argumente hat einen Beleg.",
          "Der erwartete Einwand wird mit einer Antwort entkräftet.",
        ],
      },
      2: {
        prompt:
          "Du moderierst eine Debatte zur Streitfrage „Soll das Schulfest im Sommer statt im Herbst stattfinden?“ Schreibe deine Eröffnung in drei bis vier Sätzen (Begrüßung, Streitfrage, Regeln, Redezeit) und drei Eingriffe, mit denen du die Debatte lenkst: wenn jemand zu lange spricht, wenn jemand abschweift und wenn jemand persönlich wird.",
        hints: [
          "Als Moderation bleibst du neutral und äußerst keine eigene Meinung.",
          "Ein Eingriff ist höflich, klar und nennt die Regel, auf die du dich beziehst.",
        ],
        model:
          "Eröffnung: Herzlich willkommen zur Debatte. Die Streitfrage lautet: Soll das Schulfest im Sommer statt im Herbst stattfinden? Pro und Contra haben je zwei Minuten für das Eröffnungsstatement, danach folgt der Schlagabtausch, und ich erteile das Wort. Eingriff 1: Entschuldige, deine Zeit ist um, bitte komm zum Schluss. Eingriff 2: Das ist ein interessanter Punkt, aber unsere Streitfrage ist der Termin. Bitte bleibt dabei. Eingriff 3: Wir sprechen über die Sache, nicht über die Person. Bitte formuliere deinen Einwand noch einmal sachlich.",
        criteria: [
          "Die Eröffnung nennt die Streitfrage, die Regeln und die Redezeit.",
          "Jeder der drei Eingriffe passt zu seinem Anlass und ist höflich.",
          "Die Moderation bleibt neutral.",
        ],
      },
    },
  },
  {
    id: "de-szenisch-gestalten",
    lb: 1,
    unit: "1.4",
    covers: ["1.4.1", "1.4.2"],
    title: "Szenisch gestalten: Standbild, Sketch und Auswertung",
    intro:
      "Wenn du einen Text spielst, verstehst du Figuren und Konflikte neu. Du planst eine Szene und wertest sie danach gemeinsam aus.",
    paragraphs: [
      "Texte erschließt du nicht nur durch Lesen. Wenn du eine Szene spielst, musst du Entscheidungen treffen: Wie steht die Figur da? Was will sie? Wie spricht sie? So wird ein Konflikt oder eine Beziehung sichtbar. Geeignet sind Texte mit einer klaren Situation, einem Konflikt und mindestens zwei Figuren, zum Beispiel ein Auszug aus einer Erzählung oder einem Jugendbuch. Die App kann das Spielen nicht ersetzen, denn du spielst mit anderen. Sie hilft dir aber beim Planen und beim Auswerten.",
      "Zwei einfache Formen eignen sich besonders. Im **Standbild** erstarren die Spielenden wie auf einem Foto, ohne Bewegung und ohne Worte. Es zeigt eine Situation und die Beziehungen zwischen den Figuren: Haltung, Gestik, Mimik, Abstand und Blickrichtung erzählen, wie sie zueinander stehen. Oft darf zusätzlich auf ein Zeichen eine Figur einen Satz sagen, der ihren Gedanken zeigt. Ein **Sketch** ist eine kurze, oft humorvolle Spielszene mit Dialog, meist mit einer Pointe am Ende. Er bringt ein Thema pointiert auf den Punkt.",
      "Für die Planung brauchst du eine Reihenfolge. Zuerst bestimmst du im Text den Konflikt: Wer will was, und was steht im Weg? Dann schreibst du für jede Figur eine **Figurenkarte** mit Ziel, Gefühl und Gedanken. Danach wählst du die Form und entwirfst die Szene: beim Standbild Positionen und Haltungen, beim Sketch Anfang, Wendepunkt und Schluss. Es folgen Proben, in denen ihr Haltung, Stimme und Raum anpasst. Dann spielt ihr die Szene vor. Fotos oder Videos davon macht ihr nur, wenn alle einverstanden sind. Am Ende steht die Auswertung.",
      "Bei der Auswertung gehst du in drei Schritten vor. Erst **beschreibst** du, was zu sehen und zu hören war. Dann **deutest** du: Welches **Handlungsmotiv** hat eine Figur, also warum handelt sie so, und wie denkt sie? Woran erkennst du das, zum Beispiel an Haltung oder Stimme? Zuletzt gibst du **Rückmeldung** zur Darstellung, nicht zur Person: zuerst, was gut wirkt, dann einen Vorschlag. Dieselben Fragen helfen dir, wenn du ein Theaterstück oder einen Film ansiehst: Wie zeigen die Spielenden Gefühle, und welche Mittel unterstützen das?",
    ],
    terms: [
      {
        term: "Standbild",
        text: "Im szenischen Spiel eine eingefrorene Szene, in der Haltung, Mimik und Abstand die Situation zeigen.",
      },
      {
        term: "Sketch",
        text: "Eine kurze, oft humorvolle Spielszene mit Dialog, meist mit einer Pointe am Ende.",
      },
      {
        term: "Figurenkarte",
        text: "Eine Karte, auf der du Ziel, Gefühl und Gedanken einer Figur festhältst.",
      },
      {
        term: "Handlungsmotiv",
        text: "Der Grund, aus dem eine Figur etwas tut, zum Beispiel Angst, ein Wunsch oder ein Ziel.",
      },
      {
        term: "Denkweise",
        text: "Die Art, wie eine Figur die Welt und ihre Lage sieht und bewertet.",
      },
    ],
    examples: [
      {
        title: "Eine Figurenkarte (eigens verfasst)",
        text: "Figur: Mehmet, 15 Jahre\nZiel: Er möchte im Verein Fußball spielen.\nGefühl: Er ist unsicher, weil er neu in der Stadt ist.\nGedanke im Standbild: „Was, wenn mich keiner in die Mannschaft wählt?“",
        analysis:
          "Die Karte hält Mehmets Ziel, sein Gefühl und seinen Gedanken fest. Daraus folgt sein Handlungsmotiv: Er will dazugehören, hat aber Angst vor einer Absage. Im Standbild könnte er deshalb am Rand stehen, mit gesenktem Blick, und doch zur Gruppe hinsehen. Haltung und Blick zeigen dann, was die Figur denkt.",
      },
    ],
    takeaway:
      "Texte erschließt du szenisch, wenn du den Konflikt bestimmst, Figuren klärst und die Szene als Standbild oder Sketch planst. Bei der Auswertung beschreibst du erst, deutest dann Handlungsmotive und Denkweisen und gibst zuletzt Rückmeldung zur Darstellung.",
    sourceIds: ["lp", "dwds", "oldenburg"],
    quiz: {
      question: "Was ist ein Standbild im szenischen Spiel?",
      answer: "Eine eingefrorene Szene ohne Worte, in der Haltung, Mimik und Abstand die Situation zeigen.",
      wrong: [
        "Eine kurze, oft humorvolle Spielszene mit Dialog, die meist mit einer Pointe endet.",
        "Ein Foto, das nach der Aufführung gemacht und später mit der Klasse gemeinsam ausgewertet wird.",
      ],
      explanation:
        "Ein Standbild kommt ohne Bewegung und Worte aus: Die Körper erzählen. Die kurze Szene mit Dialog und Pointe ist ein Sketch. Ein Foto der Aufführung kann bei der Auswertung helfen, ist aber kein Standbild.",
    },
    workshop: {
      kind: "timeline",
      title: "Von der Textstelle zur Szene und zurück",
      instruction:
        "Bringe die Schritte einer Szenenarbeit in die richtige Reihenfolge, von der Textstelle bis zur Auswertung. Jeder Schritt baut auf dem vorigen auf. Benutze die Pfeile, um einen Eintrag zu verschieben.",
      categories: [],
      entries: [
        {
          text: "Textausschnitt lesen und den Konflikt bestimmen: Wer will was, und was steht im Weg?",
          target: 0,
          feedback: "Ohne Textverständnis kannst du keine Szene planen.",
        },
        {
          text: "Aus dem Konflikt für jede Figur eine Figurenkarte schreiben: Ziel, Gefühl und Gedanken.",
          target: 1,
          feedback: "Ziel, Gefühl und Gedanken einer Figur ergeben sich erst aus dem bestimmten Konflikt.",
        },
        {
          text: "Anhand der Figurenkarten die Szene entwerfen und die Form wählen: Haltung und Abstand beim Standbild, Anfang, Wendepunkt und Schluss beim Sketch.",
          target: 2,
          feedback: "Der Entwurf stützt sich auf die Figurenkarten, die Haltung und Handlung der Figuren begründen.",
        },
        {
          text: "Den Entwurf mit verteilten Rollen proben und Haltung, Stimme und Raum anpassen.",
          target: 3,
          feedback: "Geprobt wird, was zuvor entworfen wurde.",
        },
        {
          text: "Die geprobte Szene vorspielen und, wenn alle einverstanden sind, fotografieren oder filmen.",
          target: 4,
          feedback: "Vorgespielt wird, was vorher geprobt wurde.",
        },
        {
          text: "Das Vorgespielte gemeinsam auswerten: beschreiben, Handlungsmotive deuten und Rückmeldung zur Darstellung geben.",
          target: 5,
          feedback: "Ausgewertet werden kann erst, was gespielt wurde, ob mit Aufnahme oder ohne.",
        },
      ],
      conclusion:
        "Lesen, Figuren klären, entwerfen, proben, vorspielen und auswerten: Diese Reihenfolge führt vom Text zur Szene und von der Szene zurück zum Text.",
    },
    casework: {
      title: "Auswertung einer gespielten Szene",
      story:
        "Eine Gruppe hat einen Auszug aus einer erfundenen Erzählung gespielt: Jana erfährt von ihrem Freund Max, dass er in eine andere Stadt zieht. Im Video sieht man: **Jana steht mit verschränkten Armen am Fenster, sagt nur „Ach so.“ und schaut zu Boden. Ihre Stimme zittert leicht.** Max redet viel und lacht laut, schaut Jana dabei aber kaum an.",
      steps: [
        {
          question: "Welcher Satz beschreibt nur, was im Video zu sehen und zu hören ist?",
          options: [
            "Jana steht mit verschränkten Armen am Fenster und sagt nur „Ach so.“",
            "Jana ist traurig und wütend, weil Max wegzieht und sie allein lässt.",
            "Die Darstellung der beiden war schwach und wenig überzeugend.",
          ],
          answer: 0,
          explanation:
            "Der erste Satz beschreibt, was jeder sehen und hören kann. Der zweite deutet Gefühle, der dritte bewertet die Darstellung.",
        },
        {
          question: "Welche Deutung von Janas Reaktion ist durch das Video am besten begründet?",
          options: [
            "Sie ist getroffen und zeigt es nicht: Sie verschränkt die Arme, blickt zu Boden, die Stimme zittert.",
            "Sie freut sich für Max und will ihn nicht aufhalten, denn sie reagiert nur ruhig und kurz.",
            "Es ist ihr gleichgültig, denn sie sagt nur zwei Wörter und redet danach nicht mehr mit Max.",
          ],
          answer: 0,
          explanation:
            "Die Deutung stützt sich auf Haltung, Blick und die zitternde Stimme und passt zum Motiv, nichts zu zeigen. Wer sich freut, verhält sich anders, und zu Gleichgültigkeit passen die zitternde Stimme und der gesenkte Blick schlecht.",
        },
        {
          question: "Welche Rückmeldung an die Person, die Max spielt, ist konstruktiv?",
          options: [
            "Dass du laut lachst und Jana kaum ansiehst, wirkt überspielt und passt gut zur Szene. Ein kurzes Stocken könnte das verstärken.",
            "Du hast insgesamt schlecht gespielt, das war einfach nicht gut und nicht überzeugend, und alle haben es gemerkt.",
            "Du lachst immer so komisch, das nervt alle und ist völlig unglaubwürdig, lass es lieber sein, sonst wird das nichts.",
          ],
          answer: 0,
          explanation:
            "Die Rückmeldung nennt zuerst, was gut wirkt, und macht einen konkreten Vorschlag zur Darstellung. Die anderen Sätze urteilen pauschal oder über die Person.",
        },
        {
          question: "Wie wendest du dieselben Fragen auf einen Film an?",
          options: [
            "Du achtest darauf, wie Mimik, Gestik und Stimme der Spielenden Gefühle zeigen.",
            "Du prüfst nur, ob der Film lang genug ist, um eine ganze Handlung zu erzählen.",
            "Du achtest nur auf die Handlung und nicht auf die Darstellung der Figuren durch die Spielenden.",
          ],
          answer: 0,
          explanation:
            "Beschreiben, Deuten und Rückmeldung funktionieren auch bei Filmen und Aufführungen. Gerade die Darstellung der Spielenden zeigt, was die Figuren denken und wollen.",
        },
      ],
      verdict:
        "Die Gruppe beschreibt zuerst, deutet dann Janas Motiv und gibt danach eine Rückmeldung zur Darstellung. Dieselben Schritte helfen auch bei Theateraufführungen und Filmen.",
    },
    tasks: {
      1: {
        prompt:
          "Szene: Im Zug streiten Kim und Leo um den einzigen freien Fensterplatz. Eine ältere Frau schaut zu. Plane ein Standbild mit diesen drei Figuren: Beschreibe für jede Figur Haltung, Blick und Abstand zu den anderen und schreibe für jede einen Gedankensatz, den sie auf ein Zeichen sagt.",
        hints: [
          "Überlege, was jede Figur will und was ihr im Weg steht.",
          "Zeige den Konflikt durch Haltung und Abstand, nicht durch Worte.",
        ],
        model:
          "Kim steht dicht am Fensterplatz, eine Hand auf der Lehne, der Blick geht fest zu Leo. Gedanke: „Ich war zuerst da.“ Leo steht Kim gegenüber, die Arme verschränkt, das Kinn nach vorn, ebenfalls am Platz. Gedanke: „Ich gebe nicht nach.“ Die ältere Frau sitzt zwei Schritte entfernt, leicht nach vorn gebeugt, und blickt von einem zum anderen. Gedanke: „Hoffentlich wird es nicht lauter.“ Im Standbild erkennt man den Streit am kurzen Abstand zwischen Kim und Leo und an der angespannten Haltung, auch ohne ein Wort.",
        criteria: [
          "Beschreibt für alle drei Figuren Haltung, Blick oder Abstand.",
          "Jeder Gedankensatz zeigt das Motiv der Figur.",
          "Das Standbild zeigt den Konflikt auch ohne Worte.",
        ],
      },
      2: {
        prompt:
          "Deine Gruppe hat einen Sketch gespielt und gefilmt (alle sind einverstanden): Ein Kunde reklamiert in einer Bäckerei ein Brötchen, die Verkäuferin versteht ihn absichtlich falsch, und am Ende backen beide ein neues. Schreibe einen Auswertungsbogen mit sechs Fragen: je zwei zum Beschreiben, zum Deuten der Handlungsmotive und zur Rückmeldung an die Spielenden.",
        hints: [
          "Beschreiben fragt nach dem, was man sieht und hört, Deuten nach dem Warum.",
          "Die Rückmeldung nennt zuerst eine Stärke und dann einen Vorschlag.",
        ],
        model:
          "Beschreiben: 1. Wie steht der Kunde zu Beginn da, und wie spricht er? 2. Was tut die Verkäuferin, als sie ihn falsch versteht? Deuten: 3. Warum versteht sie ihn absichtlich falsch, und welche Denkweise zeigt das? 4. Warum ändert der Kunde am Ende sein Verhalten? Rückmeldung: 5. Was hat in der Darstellung des Kunden gut gewirkt? 6. Welchen konkreten Vorschlag gibst du der Verkäuferin, damit die Pointe noch deutlicher wird?",
        criteria: [
          "Enthält je zwei Fragen zu Beschreiben, Deuten und Rückmeldung.",
          "Die Fragen zum Deuten fragen nach Handlungsmotiven oder Denkweisen.",
          "Die Rückmeldungsfragen verlangen eine Stärke und einen konkreten Vorschlag.",
        ],
      },
    },
  },
];
