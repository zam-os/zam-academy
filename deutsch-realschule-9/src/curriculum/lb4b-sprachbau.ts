import type { Lesson } from "../model/types";

/** Lernbereich 4, zweiter Teil: Satzbau, Stilmittel, Stilarten und Rechtschreibung (4.2 und 4.3). */
export const LB4B: Lesson[] = [
  {
    id: "de-stilmittel",
    lb: 4,
    unit: "4.2",
    covers: ["4.2.4"],
    title: "Stilmittel erkennen und ihre Wirkung beschreiben",
    intro:
      "Stilmittel sind bewusst gewählte sprachliche Mittel. Du erkennst sie am Text und erklärst, was sie dort bewirken.",
    paragraphs: [
      "Stilmittel sind sprachliche Mittel, die ein Autor oder eine Sprecherin bewusst einsetzt, um einen Text anschaulicher, eindringlicher oder überzeugender zu machen. Sie zu erkennen ist nur der erste Schritt. Die entscheidende Frage lautet immer: **Was bewirkt dieses Mittel an dieser Stelle?** Ein guter Satz in einer Textbeschreibung besteht deshalb aus drei Teilen: Du nennst das Stilmittel, zitierst die Stelle und erklärst die Wirkung auf die Aussage des Textes.",
      "Bildhafte Mittel machen Gedanken anschaulich. Die **Metapher** setzt zwei Dinge ohne Vergleichswort gleich („Der Nebel ist eine graue Zuckerwatte“), der **Vergleich** verbindet sie mit „wie“ oder „als ob“ („steif wie Bretter“). Die **Hyperbel** übertreibt stark („seit einer Ewigkeit warten“) und lenkt den Blick auf ein Gefühl oder einen Eindruck. Der **Neologismus** ist ein neu gebildetes Wort („Smombie“ für jemanden, der nur auf sein Smartphone starrt). Er bringt etwas Neues auf den Punkt und weckt Aufmerksamkeit.",
      "Andere Mittel wirken über Satzbau und Klang. Die **Anapher** wiederholt dasselbe Wort am Anfang aufeinanderfolgender Sätze oder Satzteile („Ich friere. Ich zittere. Ich zähle …“) und steigert oder betont einen Gedanken. Die **Interjektion** ist ein Ausruf wie „Pfui!“ oder „Ach!“. Sie zeigt ein Gefühl, ohne es zu erklären, und holt die Leserinnen und Leser sofort ab.",
      "Die Wirkung hängt von der Textsorte ab. In einer Werbung sollen Übertreibungen und neue Wörter auffallen und Lust auf das Produkt machen. In einem Kommentar sollen Wiederholungen und Ausrufe überzeugen und Gefühle wecken. In einem Bericht dagegen sind sie fehl am Platz, weil er genau und sachlich informieren soll. Beschreibe ein Stilmittel darum nie allein, sondern immer im Zusammenhang mit Text und Absicht.",
    ],
    terms: [
      {
        term: "Metapher",
        text: "Ein Bild, das zwei Dinge ohne „wie“ gleichsetzt, zum Beispiel „Zeit ist ein Dieb“.",
      },
      {
        term: "Vergleich",
        text: "Ein Bild mit „wie“ oder „als ob“, das zwei Dinge nebeneinanderstellt, zum Beispiel „schnell wie der Wind“.",
      },
      {
        term: "Hyperbel",
        text: "Eine starke Übertreibung, die etwas besonders betont, zum Beispiel „Ich habe es tausendmal gesagt“.",
      },
      {
        term: "Anapher",
        text: "Die Wiederholung desselben Wortes oder derselben Wortgruppe am Anfang aufeinanderfolgender Sätze oder Satzteile.",
      },
      {
        term: "Interjektion",
        text: "Ein Ausruf oder Empfindungswort wie „Ach!“, „Pfui!“ oder „Hurra!“, das ein Gefühl unmittelbar ausdrückt.",
      },
      {
        term: "Neologismus",
        text: "Ein neu gebildetes Wort, das noch neu wirkt, zum Beispiel „Smombie“ aus „Smartphone“ und „Zombie“.",
      },
    ],
    examples: [
      {
        title: "Ein Kommentar der Schülerzeitung (eigens verfasst)",
        text: "Pfui! Schon wieder liegt der Pausenhof voller Müll. Wir sehen ihn, wir riechen ihn, wir ärgern uns – aber wir heben ihn nicht auf. Dieser Hof ist ein Berg aus Verpackungen, und wir sind seine Erbauer. Es hilft nur eine Entscheidung: aufheben statt liegenlassen!",
        analysis:
          "Die **Interjektion** „Pfui!“ zeigt Ekel, bevor ein Argument fällt, und holt die Lesenden sofort ab. Die **Anapher** „Wir sehen ihn, wir riechen ihn, wir ärgern uns“ reiht drei Eindrücke aneinander und lässt den Ärger wachsen. Die **Metapher** „ein Berg aus Verpackungen“ macht die Menge des Mülls sichtbar. Alle drei Mittel passen zu einem Kommentar, der wachrütteln will.",
      },
    ],
    takeaway:
      "Ein Stilmittel beschreibst du in drei Schritten: nennen, zitieren, Wirkung erklären. Mit „wie“ ist es ein Vergleich, ohne „wie“ eine Metapher. Eine starke Übertreibung ist eine Hyperbel, die Wiederholung am Satzanfang eine Anapher.",
    sourceIds: ["lp"],
    quiz: {
      question: "Welcher Satz enthält eine Metapher?",
      answer: "Die Prüfung war ein Berg, den ich noch besteigen musste.",
      wrong: [
        "Die Prüfung war so schwer wie ein Berg, den ich besteigen sollte.",
        "Die Prüfung dauerte eine Ewigkeit, und ich hatte tausend Fragen.",
      ],
      explanation:
        "Nur im ersten Satz wird die Prüfung ohne Vergleichswort mit einem Berg gleichgesetzt. Der zweite Satz arbeitet mit „wie“ und ist ein Vergleich. Der dritte übertreibt und ist eine Hyperbel.",
    },
    workshop: {
      kind: "mark",
      title: "Stilmittel im Text finden",
      instruction:
        "Wähle oben ein Stilmittel aus und klicke dann im Text die Stelle an, die es zeigt. Die Anapher erkennst du an den wiederholten Satzanfängen. Nicht jede Stelle ist ein Stilmittel.",
      labels: ["Metapher", "Vergleich", "Hyperbel", "Anapher"],
      text: [
        { t: "Montagmorgen, " },
        { t: "kurz nach sechs. " },
        { t: "Über dem Dorf liegt der Nebel, " },
        {
          t: "eine graue Zuckerwatte",
          label: 0,
          feedback:
            "Der Nebel wird ohne „wie“ mit Zuckerwatte gleichgesetzt. Das Bild macht ihn weich, dicht und grau.",
        },
        { t: ". " },
        {
          t: "Seit einer Ewigkeit",
          label: 2,
          feedback:
            "Die Wartezeit wird stark übertrieben. Das zeigt, wie lang sie sich anfühlt.",
        },
        { t: " warte ich auf den Bus. " },
        {
          t: "So steif wie Bretter",
          label: 1,
          feedback:
            "„wie“ verbindet die Finger mit Brettern. Der Vergleich macht die Kälte körperlich spürbar.",
        },
        { t: " sind meine Finger. " },
        {
          t: "Ich",
          label: 3,
          feedback:
            "Dreimal beginnt ein Satz mit „Ich“. Die Wiederholung steigert das Frieren, Zittern und Warten.",
        },
        { t: " friere. " },
        { t: "Ich", label: 3, feedback: "Zweiter wiederholter Satzanfang der Anapher." },
        { t: " zittere. " },
        { t: "Ich", label: 3, feedback: "Dritter wiederholter Satzanfang der Anapher." },
        { t: " zähle die Minuten. " },
        { t: "Dann kommt endlich der Bus." },
      ],
      conclusion:
        "Mit „wie“ ist es ein Vergleich, ohne „wie“ eine Metapher, übertreibt jemand, ist es eine Hyperbel, und wiederholte Satzanfänge bilden eine Anapher.",
    },
    casework: {
      title: "Ein Werbetext und sein Zweck",
      story:
        "Auf einem Plakat steht: **„Frischer als alles andere: der Zitronen-Hammer! Probier die Limo, die dich bis zum Mond trägt, und werde zum Durstlöscher-Helden.“**",
      steps: [
        {
          question: "Welches Stilmittel ist „Durstlöscher-Held“?",
          options: ["Ein Neologismus: ein neu gebildetes Wort", "Eine Anapher", "Eine Interjektion"],
          answer: 0,
          explanation:
            "Das Wort ist aus „Durstlöscher“ und „Held“ neu zusammengesetzt und steht so in keinem Wörterbuch. Das ist ein Neologismus.",
        },
        {
          question: "Welches Stilmittel steckt in „die Limo, die dich bis zum Mond trägt“?",
          options: [
            "Ein Vergleich, weil ein Vergleichswort fehlt",
            "Eine Hyperbel: Die Wirkung wird stark übertrieben",
            "Eine Anapher, weil sich ein Wort wiederholt",
          ],
          answer: 1,
          explanation:
            "Keine Limo trägt jemanden zum Mond. Die Übertreibung soll das Getränk besonders stark erscheinen lassen.",
        },
        {
          question: "Welche Wirkung haben Übertreibung und Wortneuschöpfung in einer Werbung?",
          options: [
            "Sie sollen das Produkt auffallen lassen und Lust darauf machen.",
            "Sie sollen genau über die Inhaltsstoffe informieren.",
            "Sie sollen beide Seiten einer Streitfrage abwägen.",
          ],
          answer: 0,
          explanation:
            "Werbung will Aufmerksamkeit und Kaufwunsch erzeugen. Die Stilmittel dienen dieser Absicht, nicht der Information.",
        },
        {
          question: "Warum passt eine Hyperbel in einen Zeitungsbericht schlecht?",
          options: [
            "Weil Hyperbeln in Zeitungen verboten sind",
            "Weil sie falsch klingen, auch wenn sie stimmen",
            "Weil der Bericht genau informieren soll und Übertreibung die Genauigkeit verfälscht",
          ],
          answer: 2,
          explanation:
            "Ein Bericht soll Sachverhalte nachprüfbar darstellen. Eine Übertreibung würde sie verzerren.",
        },
      ],
      verdict:
        "Der Werbetext setzt Neologismus und Hyperbel ein, weil er auffallen und verkaufen will. Dieselben Mittel würden einen Bericht unglaubwürdig machen. Die Wirkung gehört immer zur Textsorte.",
    },
    tasks: {
      1: {
        prompt:
          "Beschreibe die Wirkung der Metapher „eine graue Zuckerwatte“ aus dem Text der Werkstatt in zwei bis drei Sätzen. Nenne das Stilmittel, zitiere und erkläre die Wirkung.",
        hints: [
          "Nenne zuerst das Stilmittel und setze die Textstelle in Anführungszeichen.",
          "Frage dich: Welche Eigenschaft von Zuckerwatte passt zum Nebel?",
        ],
        model:
          "In dem Text steht die Metapher „eine graue Zuckerwatte“. Der Nebel wird ohne „wie“ mit Zuckerwatte gleichgesetzt. Zuckerwatte ist weich, dicht und fast durchsichtig, und genau so wirkt auch der Nebel. Das Bild macht die Szene anschaulich und zeigt einen stillen, aber ungemütlichen Morgen.",
        criteria: [
          "Nennt das Stilmittel mit seinem Fachbegriff.",
          "Zitiert die Textstelle genau.",
          "Erklärt die Wirkung auf den Text und nicht nur das Stilmittel.",
        ],
      },
      2: {
        prompt:
          "Schreibe einen Text von drei bis vier Sätzen über deinen Schulweg, der eine Anapher und eine Hyperbel enthält. Erkläre danach in zwei Sätzen, was beide bewirken.",
        hints: [
          "Beginne mehrere Sätze mit demselben Wort oder derselben Wortgruppe.",
          "Übertreibe an einer Stelle bewusst, zum Beispiel bei einer Zeit oder Menge, und überlege, welches Gefühl du damit zeigst.",
        ],
        model:
          "Jeden Morgen renne ich zum Bus. Jeden Morgen verpasse ich ihn um Haaresbreite. Jeden Morgen warte ich eine Ewigkeit auf den nächsten. In meinem Text steht die Anapher „Jeden Morgen“. Sie betont, dass sich alles ständig wiederholt, und lässt meinen Ärger wachsen. Die Hyperbel „eine Ewigkeit“ übertreibt die Wartezeit und zeigt, wie lang sie mir vorkommt.",
        criteria: [
          "Der eigene Text enthält eine echte Anapher aus wiederholten Satzanfängen.",
          "Der eigene Text enthält eine erkennbare Übertreibung.",
          "Die Erklärung nennt zu beiden Mitteln eine Wirkung.",
        ],
      },
    },
  },
  {
    id: "de-zeichensetzung",
    lb: 4,
    unit: "4.3",
    covers: ["4.3.3"],
    title: "Zeichensetzung: Kommas sicher setzen",
    intro:
      "Die meisten Kommas folgen wenigen Regeln. Du findest sie, wenn du Teilsätze, Aufzählungen und Einschübe erkennst.",
    paragraphs: [
      "Das Komma gliedert einen Satz und macht ihn lesbar. Die Regeln dafür sind keine Geschmackssache, sondern amtlich geregelt, und die meisten lassen sich auf wenige Fälle zurückführen. Bevor du ein Komma setzt, frage dich: Wo endet ein Teilsatz, wo steht eine Aufzählung, wo ist etwas eingeschoben? Zähle dazu die gebeugten Verben. Zu jedem gebeugten Verb gehört ein Teilsatz, und zwischen Teilsätzen steht in der Regel ein Komma.",
      "**Aufzählung:** Gleichrangige Wörter oder Wortgruppen werden durch Kommas getrennt („Brot, Käse und Tomaten“). Vor „und“, „oder“ und „sowie“ steht kein Komma. **Hauptsatz und Nebensatz:** Ein Nebensatz wird vom Hauptsatz durch ein Komma abgetrennt, am Anfang, am Ende oder mitten im Satz. Du erkennst Nebensätze an einleitenden Wörtern wie „dass“, „weil“, „nachdem“ oder „obwohl“ und am gebeugten Verb am Ende des Teilsatzes („Ich weiß, dass du recht hast.“). Steht der Nebensatz mitten im Hauptsatz, braucht er davor und danach ein Komma.",
      "**Eingeschobenes:** Zusätze, Nachträge und Relativsätze werden von beiden Seiten durch Kommas eingeschlossen („Tom, der Klassensprecher, hält die Rede.“ und „Mia, die Medizin studiert, kommt.“). **Gegensatz:** Vor „aber“, „sondern“ und „doch“ steht ein Komma („Nicht der Lärm, sondern die Hitze …“). **Infinitivgruppen:** Eine Gruppe mit „um“, „ohne“, „statt“ oder „anstatt“ und „zu“ wird immer durch Komma abgetrennt („Er lernt, um die Prüfung zu bestehen.“). Bei anderen Infinitivgruppen ist das Komma oft freiwillig.",
    ],
    terms: [
      {
        term: "Aufzählung",
        text: "Mehrere gleichrangige Wörter oder Wortgruppen hintereinander, zwischen denen ein Komma steht, außer vor „und“ und „oder“.",
      },
      {
        term: "Nebensatz",
        text: "Ein Teilsatz, der ohne Hauptsatz nicht stehen kann, oft mit „dass“, „weil“ oder „nachdem“ eingeleitet und durch Komma abgetrennt.",
      },
      {
        term: "Relativsatz",
        text: "Ein Nebensatz mit „der“, „die“, „das“ oder „welche“, der sich auf ein Nomen bezieht und, wenn er mitten im Satz steht, von Kommas eingeschlossen wird.",
      },
      {
        term: "Einschub",
        text: "Ein Zusatz oder Nachtrag mitten im Satz, den Kommas von beiden Seiten einschließen.",
      },
      {
        term: "Infinitivgruppe",
        text: "Eine Wortgruppe mit „zu“ und dem Verb im Infinitiv wie „die Prüfung zu bestehen“; mit „um“, „ohne“, „statt“ oder „anstatt“ steht davor ein Komma.",
      },
    ],
    examples: [
      {
        title: "Drei Kommas und ihre Gründe",
        text: "Ich weiß, dass du recht hast.\nTom, der Klassensprecher, hält die Rede.\nEr lernt viel, um die Prüfung zu bestehen.",
        analysis:
          "Im ersten Satz trennt das Komma den Nebensatz mit „dass“ vom Hauptsatz ab. Im zweiten Satz schließen zwei Kommas den Zusatz „der Klassensprecher“ ein. Im dritten Satz steht vor der Infinitivgruppe mit „um … zu“ ein Pflichtkomma.",
      },
    ],
    takeaway:
      "Ein Komma steht zwischen Teilsätzen, zwischen gleichrangigen Gliedern einer Aufzählung (nicht vor „und“) und um Eingeschobenes herum. Zähle die gebeugten Verben: Jeder Teilsatz braucht eine Abgrenzung. Mit „um“, „ohne“ oder „statt“ vor „zu“ ist das Komma Pflicht.",
    sourceIds: ["lp", "regelwerk"],
    quiz: {
      question: "Welcher Satz ist richtig gesetzt?",
      answer: "Mia, die Medizin studiert, kommt am Samstag zu Besuch.",
      wrong: [
        "Mia die Medizin studiert, kommt am Samstag zu Besuch.",
        "Mia, die Medizin studiert kommt am Samstag zu Besuch.",
      ],
      explanation:
        "Der Relativsatz „die Medizin studiert“ ist mitten im Satz eingeschoben und wird auf beiden Seiten durch Kommas abgetrennt. In den anderen Sätzen fehlt je eines davon.",
    },
    workshop: {
      kind: "commas",
      title: "Setze die fehlenden Kommas",
      instruction:
        "Klicke in jedem Satz auf die Lücken zwischen den Wörtern, an denen ein Komma stehen muss. Ein zweiter Klick nimmt es wieder weg.",
      items: [
        {
          words: ["Wir", "haben", "Brot", "Käse", "und", "Tomaten", "gekauft."],
          commas: [2],
          feedback:
            "Aufzählung: Zwischen gleichrangigen Gliedern steht ein Komma, vor „und“ aber keines.",
        },
        {
          words: ["Ich", "weiß", "dass", "du", "recht", "hast."],
          commas: [1],
          feedback: "Der Nebensatz mit „dass“ wird vom Hauptsatz durch ein Komma abgetrennt.",
        },
        {
          words: ["Nachdem", "wir", "gegessen", "hatten", "räumten", "wir", "den", "Tisch", "ab."],
          commas: [3],
          feedback: "Der vorangestellte Nebensatz endet mit einem Komma, bevor der Hauptsatz beginnt.",
        },
        {
          words: ["Meine", "Cousine", "Mia", "die", "Medizin", "studiert", "kommt", "am", "Samstag."],
          commas: [2, 5],
          feedback:
            "Der Relativsatz „die Medizin studiert“ ist eingeschoben und wird von beiden Seiten durch Kommas eingeschlossen.",
        },
        {
          words: ["Er", "übt", "jeden", "Tag", "um", "die", "Prüfung", "zu", "bestehen."],
          commas: [3],
          feedback: "Vor einer Infinitivgruppe mit „um … zu“ steht immer ein Komma.",
        },
      ],
      conclusion:
        "Aufzählung, Nebensatz, Einschub und „um … zu“ sind die vier Stellen, an denen du fast jedes Komma findest.",
    },
    casework: {
      title: "Mias Nachricht an die Klassenlehrerin",
      story:
        "Mia schreibt ihrer Klassenlehrerin: **„Liebe Frau Brandt, ich war am Montag krank weil ich Fieber hatte. Mein Bruder der Arzt werden möchte hat mich untersucht.“** Bevor sie die Nachricht abschickt, prüft sie die Kommas.",
      steps: [
        {
          question: "Wo fehlt im ersten Satz („ich war am Montag krank weil ich Fieber hatte“) ein Komma?",
          options: [
            "Zwischen „krank“ und „weil“",
            "Zwischen „Montag“ und „krank“",
            "Zwischen „weil“ und „ich“",
          ],
          answer: 0,
          explanation:
            "„weil ich Fieber hatte“ ist ein Nebensatz. Er wird vom Hauptsatz „ich war am Montag krank“ durch ein Komma abgetrennt.",
        },
        {
          question: "Welcher Teil des zweiten Satzes ist eingeschoben („Mein Bruder der Arzt werden möchte hat mich untersucht“)?",
          options: [
            "„der Arzt werden möchte“",
            "„Mein Bruder“",
            "„hat mich untersucht“",
          ],
          answer: 0,
          explanation:
            "„der Arzt werden möchte“ ist ein Relativsatz, der sich auf „Mein Bruder“ bezieht. Er unterbricht den Hauptsatz „Mein Bruder hat mich untersucht“.",
        },
        {
          question: "Wie viele Kommas braucht dieser eingeschobene Relativsatz?",
          options: [
            "Zwei: eines davor und eines dahinter",
            "Eines, nur davor",
            "Keines, weil er mitten im Satz steht",
          ],
          answer: 0,
          explanation:
            "Ein Einschub wird von beiden Seiten abgetrennt: „Mein Bruder, der Arzt werden möchte, hat mich untersucht.“",
        },
      ],
      verdict:
        "Mias Nachricht braucht drei Kommas: eines vor „weil“ und zwei um den Relativsatz „der Arzt werden möchte“.",
    },
    practice: {
      kind: "commas",
      title: "Kommas setzen: drei Sätze pro Runde",
      instruction:
        "Setze in jedem Satz genau die Kommas, die fehlen. Klicke dazu auf die Lücke zwischen zwei Wörtern. Eine Runde zählt, wenn alle drei Sätze stimmen.",
      pool: {
        1: [
          {
            words: ["Ich", "habe", "Äpfel", "Birnen", "und", "Nüsse", "eingekauft."],
            commas: [2],
            feedback: "In der Aufzählung steht ein Komma zwischen „Äpfel“ und „Birnen“, vor „und“ keines.",
          },
          {
            words: ["Wir", "bleiben", "zu", "Hause", "weil", "es", "regnet."],
            commas: [3],
            feedback: "Der Nebensatz mit „weil“ wird abgetrennt.",
          },
          {
            words: ["Sie", "sagt", "dass", "sie", "müde", "ist."],
            commas: [1],
            feedback: "Der Nebensatz mit „dass“ wird abgetrennt.",
          },
          {
            words: ["Als", "es", "klingelte", "sprang", "Ben", "auf."],
            commas: [2],
            feedback: "Der vorangestellte Nebensatz mit „als“ endet mit einem Komma.",
          },
          {
            words: ["Leon", "der", "beste", "Läufer", "der", "Klasse", "gewann", "das", "Rennen."],
            commas: [0, 5],
            feedback: "Der Zusatz „der beste Läufer der Klasse“ wird von beiden Seiten durch Kommas eingeschlossen.",
          },
          {
            words: ["Es", "regnete", "aber", "wir", "gingen", "trotzdem", "spazieren."],
            commas: [1],
            feedback: "Vor „aber“ steht zwischen zwei Hauptsätzen ein Komma.",
          },
          {
            words: ["Sie", "lief", "schnell", "um", "den", "Bus", "zu", "erreichen."],
            commas: [2],
            feedback: "Vor einer Infinitivgruppe mit „um … zu“ steht immer ein Komma.",
          },
          {
            words: ["Ich", "möchte", "Rot", "Blau", "und", "Grün", "mischen."],
            commas: [2],
            feedback: "In der Aufzählung steht das Komma zwischen „Rot“ und „Blau“, vor „und“ keines.",
          },
        ],
        2: [
          {
            words: ["Weil", "der", "Zug", "Verspätung", "hatte", "und", "es", "außerdem", "stark", "regnete", "kam", "Jonas", "erst", "nach", "neun", "Uhr", "an."],
            commas: [9],
            feedback: "Beide Nebensätze sind mit „und“ verbunden, davor steht kein Komma. Erst nach dem zweiten Nebensatz folgt das Komma vor dem Hauptsatz.",
          },
          {
            words: ["Die", "Lehrerin", "die", "uns", "Deutsch", "unterrichtet", "hat", "gestern", "die", "Aufsätze", "zurückgegeben."],
            commas: [1, 5],
            feedback: "Der Relativsatz „die uns Deutsch unterrichtet“ ist eingeschoben und wird von beiden Seiten abgetrennt.",
          },
          {
            words: ["Ich", "glaube", "dass", "du", "recht", "hast", "aber", "ich", "bin", "mir", "nicht", "sicher."],
            commas: [1, 5],
            feedback: "Der „dass“-Satz wird vom Hauptsatz abgetrennt, und vor „aber“ steht ein Komma zwischen den Hauptsätzen.",
          },
          {
            words: ["Er", "wollte", "gehen", "ohne", "sich", "zu", "verabschieden."],
            commas: [2],
            feedback: "Vor einer Infinitivgruppe mit „ohne … zu“ steht immer ein Komma.",
          },
          {
            words: ["Anna", "Ben", "und", "Clara", "die", "alle", "in", "derselben", "Klasse", "sind", "planen", "eine", "Fahrt."],
            commas: [0, 3, 9],
            feedback: "Ein Komma trennt „Anna“ in der Aufzählung ab, zwei weitere schließen den Relativsatz „die alle in derselben Klasse sind“ ein.",
          },
          {
            words: ["Obwohl", "er", "müde", "war", "lernte", "er", "weiter", "weil", "die", "Prüfung", "nahte."],
            commas: [3, 6],
            feedback: "Der vorangestellte „obwohl“-Satz und der angehängte „weil“-Satz werden jeweils vom Hauptsatz abgetrennt.",
          },
          {
            words: ["Nicht", "der", "Lärm", "sondern", "die", "Hitze", "machte", "uns", "zu", "schaffen."],
            commas: [2],
            feedback: "Vor „sondern“ steht ein Komma.",
          },
          {
            words: ["Sie", "öffnete", "das", "Fenster", "damit", "frische", "Luft", "hereinkam."],
            commas: [3],
            feedback: "Der Nebensatz mit „damit“ wird vom Hauptsatz abgetrennt.",
          },
        ],
      },
    },
    tasks: {
      1: {
        prompt:
          "Schreibe drei Sätze, die jeweils eine andere Kommaregel zeigen: eine Aufzählung, einen Nebensatz mit „weil“ und eine Infinitivgruppe mit „um … zu“. Setze alle Kommas und erkläre kurz, warum sie stehen.",
        hints: [
          "Plane zuerst drei kurze Inhalte, zum Beispiel für eine Klassenfahrt, und baue dann die Sätze.",
          "Prüfe jeden Satz: Wo endet ein Teilsatz, wo steht eine Aufzählung, wo beginnt die Infinitivgruppe?",
        ],
        model:
          "Für die Klassenfahrt packe ich Hose, Pullover und Zahnbürste ein. Ich nehme eine Jacke mit, weil es abends kalt wird. Ich spare mein Taschengeld, um mir am Ziel ein Eis zu kaufen. Die Kommas stehen in der Aufzählung zwischen „Hose“ und „Pullover“ (vor „und“ keines), vor dem Nebensatz mit „weil“ und vor der Infinitivgruppe mit „um … zu“.",
        criteria: [
          "Enthält eine Aufzählung ohne Komma vor „und“.",
          "Enthält einen Nebensatz mit „weil“, der durch ein Komma abgetrennt ist.",
          "Enthält eine Infinitivgruppe mit „um … zu“ und erklärt die Kommas.",
        ],
      },
      2: {
        prompt:
          "Setze im folgenden Text die fehlenden Kommas und begründe jedes in einem Stichwort: „Leon der unsere Fußballmannschaft trainiert sagt dass wir am Samstag früher kommen müssen weil das Spiel um neun Uhr beginnt.“",
        hints: [
          "Suche zuerst die gebeugten Verben und zähle die Teilsätze.",
          "Prüfe, ob ein Teilsatz mitten in einem anderen steht. Dann braucht er zwei Kommas.",
        ],
        model:
          "Leon, der unsere Fußballmannschaft trainiert, sagt, dass wir am Samstag früher kommen müssen, weil das Spiel um neun Uhr beginnt. Das erste und das zweite Komma schließen den Relativsatz „der unsere Fußballmannschaft trainiert“ ein. Das dritte trennt den „dass“-Satz ab, das vierte den „weil“-Satz.",
        criteria: [
          "Setzt alle vier Kommas an der richtigen Stelle.",
          "Erkennt den Relativsatz als Einschub mit zwei Kommas.",
          "Begründet jedes Komma mit dem passenden Fachbegriff.",
        ],
      },
    },
  },
];
