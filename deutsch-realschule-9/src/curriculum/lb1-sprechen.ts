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
      "Zuhören ist mehr als stilles Dabeisitzen. Wer aktiv zuhört, verfolgt den Beitrag konzentriert, merkt sich die Kernaussagen und achtet darauf, **was** jemand sagt und **was er damit erreichen will**. Dahinter steckt oft ein kommunikativer Zusammenhang: Eine **Aufforderung** („Räum bitte endlich dein Zeug weg!“) verlangt eine Handlung, eine **Provokation** („Du verstehst das sowieso nicht.“) will dich aus der Ruhe bringen, eine Information will verstanden werden. Erst wenn du diese Absicht erkennst, kannst du angemessen reagieren.",
      "Für die Reaktion hast du mehrere Werkzeuge. Mit einer **Nachfrage** klärst du Unklares oder bittest um ein Beispiel („Was meinst du mit „unfair“?“). Mit einer **Paraphrase** gibst du das Gehörte mit eigenen Worten wieder („Du meinst also, dass der Termin zu kurzfristig ist?“) und zeigst, dass du verstanden hast; der andere kann dich korrigieren. Mit einem **Gegenargument** widersprichst du sachlich und begründest, warum du eine andere Position hast. Welches Werkzeug passt, hängt davon ab, ob du noch etwas verstehen musst oder schon urteilen kannst.",
      "Auch eine Rückmeldung nach einem Vortrag oder einer Diskussionsrunde ist eine Reaktion. Sie hilft, wenn sie **konstruktiv** ist: Du nennst zuerst, was gelungen ist, beschreibst dann konkret eine Stelle, die besser werden kann, und sagst, wie. „Du sprichst zu schnell“ ist ein Vorwurf. „Bei den Zahlen sprichst du schnell, eine Pause danach würde mir beim Mitschreiben helfen“ ist eine Rückmeldung, mit der der andere etwas anfangen kann. Bleib dabei sachlich und sprich von deinem Eindruck, nicht über die Person.",
    ],
    terms: [
      {
        term: "Aktives Zuhören",
        text: "Konzentriertes Zuhören, bei dem du Inhalt und Absicht des anderen erfasst und zeigst, dass du folgst.",
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
        text: "Ein begründeter Einwand, der eine Behauptung des anderen sachlich infrage stellt.",
      },
      {
        term: "Konstruktive Rückmeldung",
        text: "Eine Rückmeldung, die Gelungenes nennt und eine konkrete Verbesserung vorschlägt.",
      },
    ],
    examples: [
      {
        title: "Ein Gespräch über Handys in der Schule (eigens verfasst)",
        text: "Sven: „Handys gehören an der Schule verboten. Sie lenken nur ab.“\nLena: „Du meinst also, dass Handys im Unterricht stören?“\nSven: „Genau, und in den Pausen auch.“\nLena: „Was meinst du mit „auch in den Pausen“? Wo stören sie da?“",
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
        "Ich bitte den anderen, die Aussage noch einmal wörtlich zu wiederholen.",
      ],
      explanation:
        "Eine Paraphrase zeigt, dass du verstanden hast, und gibt dem anderen die Chance zu korrigieren. Sofort die eigene Meinung zu sagen überspringt das Verstehen. Eine wörtliche Wiederholung prüft das Gedächtnis, nicht das Verständnis.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Reaktion ist das?",
      instruction:
        "Ein Mitschüler sagt: „Wir sollten den Ausflug in den Wald machen, weil das billiger ist.“ Ordne jede Antwort der Reaktion zu, die sie darstellt.",
      categories: ["Nachfrage", "Paraphrase", "Gegenargument", "Konstruktive Rückmeldung"],
      entries: [
        {
          text: "„Wie viel billiger wäre der Wald denn im Vergleich zum Museum?“",
          target: 0,
          feedback: "Sie fragt nach einer genaueren Angabe zu einer Behauptung und will etwas klären.",
        },
        {
          text: "„Du schlägst also den Wald vor, weil er weniger kostet?“",
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
          text: "„Meinst du mit „billiger“ die Kosten für alle zusammen oder pro Kopf?“",
          target: 0,
          feedback: "Sie fragt an einem Wort der Aussage nach, das unklar ist.",
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
        "In der AG der Schülerzeitung sagt Jonas zu Aylin: **„Du schreibst doch eh immer nur Kurzes. Mach endlich mal den Bericht über den Sporttag fertig!“** Aylin zählt innerlich bis fünf.",
      steps: [
        {
          question: "Welche Absicht steckt im ersten Satz („Du schreibst doch eh immer nur Kurzes.“)?",
          options: [
            "Eine Provokation: Jonas stichelt und will Aylin aus der Ruhe bringen.",
            "Eine Information über die Arbeitsweise von Aylin.",
            "Eine Bitte um Hilfe bei einem langen Text.",
          ],
          answer: 0,
          explanation:
            "Das Wort „eh“ und das „immer nur“ klingen abwertend. Der Satz soll nicht informieren, sondern treffen.",
        },
        {
          question: "Welche Absicht steckt im zweiten Satz („Mach endlich mal den Bericht über den Sporttag fertig!“)?",
          options: [
            "Eine Frage nach dem Stand des Berichts.",
            "Eine Aufforderung: Aylin soll den Bericht abgeben.",
            "Ein Lob für Aylins bisherige Arbeit.",
          ],
          answer: 1,
          explanation:
            "Der Befehlssatz verlangt eine Handlung. Auch wenn der Ton unfreundlich ist, steckt hier ein sachliches Anliegen.",
        },
        {
          question: "Welche Reaktion von Aylin ist angemessen und sachlich?",
          options: [
            "„Dann schreib ihn doch selbst, du Besserwisser!“",
            "„Du willst, dass der Bericht bald fertig wird? Bis Donnerstag schaffe ich das.“",
            "Sie sagt nichts und verlässt den Raum.",
          ],
          answer: 1,
          explanation:
            "Aylin überhört den Stich, gibt die Aufforderung mit eigenen Worten wieder und sagt konkret zu. Das hält das Gespräch sachlich.",
        },
        {
          question: "Wie könnte Aylin die Provokation entschärfen, ohne zu streiten?",
          options: [
            "Sie antwortet ebenfalls mit einer Stichelei.",
            "Sie fragt nach: „Was meinst du damit, dass ich nur Kurzes schreibe?“",
            "Sie tut so, als hätte sie nichts gehört.",
          ],
          answer: 1,
          explanation:
            "Eine Nachfrage zwingt Jonas, seine Behauptung zu erklären. Das nimmt dem Stich die Schärfe und bringt das Gespräch zurück zur Sache.",
        },
      ],
      verdict:
        "Aylin trennt Provokation und Auftrag: Sie überhört den Stich, nimmt die Aufforderung ernst und antwortet mit einer klaren Zusage. So bleibt das Gespräch sachlich.",
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
          "Paraphrase: „Du meinst also, dass es ungerecht ist, wenn nur manche Schüler im Unterricht ein Handy nutzen können?“ Nachfrage: „Was genau findest du daran unfair: dass manche Zugang zu Informationen haben oder dass andere ausgeschlossen sind?“ So zeige ich Lena, dass ich ihren Gedanken verstanden habe, und gebe ihr die Gelegenheit, ihn genauer zu erklären.",
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
];
