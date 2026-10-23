import type { Lesson } from "../model/types";

/** Lernbereich 4, zweiter Teil: Stilmittel und Stilarten (4.2.4) und Richtig schreiben (4.3). */
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
      "Stilmittel sind sprachliche Mittel, die man bewusst einsetzt, um einen Text anschaulicher, eindringlicher oder überzeugender zu machen. Sie zu erkennen ist nur der erste Schritt. Die entscheidende Frage lautet immer: **Was bewirkt dieses Mittel an dieser Stelle?** Ein guter Satz in einer Textbeschreibung besteht deshalb aus drei Teilen: Du nennst das Stilmittel, zitierst die Stelle und erklärst die Wirkung auf die Aussage des Textes.",
      "Bildhafte Mittel machen Gedanken anschaulich. Die **Metapher** setzt zwei Dinge ohne Vergleichswort gleich („Der Nebel ist eine graue Zuckerwatte“), der **Vergleich** verbindet sie mit „wie“ oder „als ob“ („steif wie Bretter“). Die **Hyperbel** übertreibt stark („seit einer Ewigkeit warten“) und lenkt den Blick auf ein Gefühl oder einen Eindruck. Alle drei sprechen die Vorstellungskraft an: Du sollst etwas nicht nur wissen, sondern vor dir sehen oder spüren.",
      "Andere Mittel wirken über Wortwahl und Satzbau. Die **Anapher** wiederholt dasselbe Wort am Anfang aufeinanderfolgender Sätze oder Satzteile („Ich friere. Ich zittere. Ich zähle …“) und steigert oder betont einen Gedanken. Die **Interjektion** ist ein Ausruf wie „Pfui!“ oder „Ach!“. Sie zeigt ein Gefühl, ohne es zu erklären, und zieht die Lesenden sofort in den Text. Der **Neologismus** ist ein neu gebildetes Wort („Smombie“ für jemanden, der nur auf sein Smartphone starrt). Er bringt etwas Neues auf den Punkt und weckt Aufmerksamkeit.",
      "Die Wirkung hängt von der Textsorte ab. In einer Werbung sollen Übertreibungen und neue Wörter auffallen und Lust auf das Produkt machen. In einem Kommentar sollen Wiederholungen und Ausrufe überzeugen und Gefühle wecken. In einem Bericht dagegen stören sie meist, weil er genau und sachlich informieren soll. Beschreibe ein Stilmittel darum nie allein, sondern immer im Zusammenhang mit Text und Absicht.",
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
        text: "Pfui! Schon wieder liegt der Pausenhof voller Müll. Wir sehen ihn, wir riechen ihn, wir ärgern uns – aber wir heben ihn nicht auf. Dieser Hof ist ein Berg aus Verpackungen, und wir sind seine Erbauer. Es hilft nur eine Entscheidung: aufheben statt liegen lassen!",
        analysis:
          "Die **Interjektion** „Pfui!“ zeigt Ekel, bevor ein Argument fällt, und holt die Lesenden sofort ab. Die **Anapher** „Wir sehen ihn, wir riechen ihn, wir ärgern uns“ reiht drei Eindrücke aneinander und lässt den Ärger wachsen. Die **Metapher** „ein Berg aus Verpackungen“ setzt den Müll mit einem Berg gleich, macht die Menge sichtbar und übertreibt dabei. Alle drei Mittel passen zu einem Kommentar, der wachrütteln will.",
      },
    ],
    takeaway:
      "Ein Stilmittel beschreibst du in drei Schritten: nennen, zitieren, Wirkung erklären. Mit „wie“ ist es ein Vergleich, ohne „wie“ eine Metapher. Eine starke Übertreibung ist eine Hyperbel, die Wiederholung am Satzanfang eine Anapher.",
    sourceIds: ["lp", "owid"],
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
        "Wähle oben ein Stilmittel aus und klicke dann im Text die Stelle an, die es zeigt. Die Anapher erkennst du an den wiederholten Satzanfängen: Markiere jeden dieser Anfänge einzeln. Steht „wie“ im Bild, ist es ein Vergleich, auch wenn es übertreibt. Nicht jede Stelle ist ein Stilmittel.",
      labels: ["Metapher", "Vergleich", "Hyperbel", "Anapher"],
      text: [
        { t: "Montagmorgen, " },
        { t: "kurz nach sechs. " },
        { t: "Über dem Dorf liegt der Nebel, " },
        {
          t: "eine graue Zuckerwatte",
          label: 0,
          feedback:
            "Der Nebel wird ohne „wie“ mit Zuckerwatte gleichgesetzt. Das Bild macht ihn weich, flockig und grau.",
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
            "Dreimal beginnt ein Satz mit „Ich“. Die Wiederholung steigert die Kälte Schritt für Schritt.",
        },
        { t: " friere. " },
        { t: "Ich", label: 3, feedback: "Zweiter wiederholter Satzanfang der Anapher." },
        { t: " zittere. " },
        { t: "Ich", label: 3, feedback: "Dritter wiederholter Satzanfang der Anapher." },
        { t: " trete von einem Bein auf das andere. " },
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
          options: [
            "Ein Neologismus: ein neu gebildetes, ungewohntes Wort",
            "Eine Anapher: Ein Wort steht am Satzanfang mehrfach",
            "Eine Interjektion: ein Ausruf, der ein Gefühl zeigt",
          ],
          answer: 0,
          explanation:
            "Das Wort ist aus „Durstlöscher“ und „Held“ neu zusammengesetzt und gehört nicht zum üblichen Wortschatz. Das ist ein Neologismus.",
        },
        {
          question: "Welches Stilmittel steckt in „die Limo, die dich bis zum Mond trägt“?",
          options: [
            "Ein Vergleich, denn die Limo und der Mond werden nebeneinandergestellt",
            "Eine Hyperbel: Die Wirkung wird stark übertrieben",
            "Eine Interjektion, denn der Satz drückt ein Gefühl aus",
          ],
          answer: 1,
          explanation:
            "Keine Limo trägt jemanden zum Mond. Die Übertreibung soll das Getränk besonders stark erscheinen lassen. Ein Vergleich bräuchte „wie“ oder „als ob“.",
        },
        {
          question: "Welche Wirkung haben Übertreibung und Wortneuschöpfung in einer Werbung?",
          options: [
            "Sie sollen das Produkt auffallen lassen und Lust darauf machen.",
            "Sie sollen genau über die Inhaltsstoffe und den Preis informieren.",
            "Sie sollen beide Seiten einer Streitfrage fair gegeneinander abwägen.",
          ],
          answer: 0,
          explanation:
            "Werbung will Aufmerksamkeit und Kaufwunsch erzeugen. Die Stilmittel dienen dieser Absicht, nicht der Information.",
        },
        {
          question: "Warum passt eine Hyperbel in einen Zeitungsbericht schlecht?",
          options: [
            "Weil Hyperbeln nur in Gedichten, Liedern und Romanen erlaubt sind",
            "Weil sie den Text für Jugendliche schwer verständlich und lang machen",
            "Weil ein Bericht genau informieren soll und Übertreibung Fakten verzerrt",
          ],
          answer: 2,
          explanation:
            "Ein Bericht soll Sachverhalte nachprüfbar darstellen. Eine Übertreibung würde sie verzerren. Verboten ist sie nirgends, sie passt nur nicht zur Absicht.",
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
          "In dem Text steht die Metapher „eine graue Zuckerwatte“. Der Nebel wird ohne „wie“ mit Zuckerwatte gleichgesetzt. Zuckerwatte ist weich und flockig und hüllt alles ein, und genau so wirkt auch der Nebel. Das Bild macht die Szene anschaulich und zeigt einen stillen, aber ungemütlichen Morgen.",
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
    id: "de-stilarten",
    lb: 4,
    unit: "4.2",
    covers: ["4.2.4"],
    title: "Nominalstil und Verbalstil unterscheiden und einsetzen",
    intro:
      "Ob ein Text sachlich oder lebendig wirkt, hängt oft davon ab, ob Substantive oder Verben überwiegen. Du setzt beide Stile gezielt ein.",
    paragraphs: [
      "Vergleiche zwei Sätze: „Nach der Beendigung der Veranstaltung erfolgt die Rückgabe der Schlüssel.“ und „Wenn die Veranstaltung zu Ende ist, geben wir die Schlüssel zurück.“ Beide sagen dasselbe, doch der erste klingt wie ein Amtsschreiben. Er ist im **Nominalstil** geschrieben: Er enthält viele Substantive, vor allem **Nominalisierungen**, also Verben oder Adjektive, die zu Substantiven geworden sind („beenden“ wird zu „Beendigung“, „zurückgeben“ zu „Rückgabe“). Typisch sind auch **Funktionsverbgefüge**: Ein Verb mit blasser Bedeutung verbindet sich mit einem Substantiv, das den Inhalt trägt („zur Anwendung bringen“ statt „anwenden“, „eine Entscheidung treffen“ statt „entscheiden“). Aus Klasse 8 kennst du Häufungen einer Wortart in Texten; hier ist es die Häufung der Substantive.",
      "Der Nominalstil wirkt **sachlich, knapp und genau**: Viel Information passt in wenige Wörter. Deshalb ist er in Gesetzen, Verträgen, Behördenschreiben und Fachtexten üblich. Er hat aber einen Preis: Die Sätze werden abstrakt und schwerfällig, und oft bleibt offen, wer eigentlich handelt („Die Rückgabe erfolgt …“ – durch wen?). Der **Verbalstil** nennt dagegen Handelnde und Handlungen: „Wir geben die Schlüssel zurück.“ Er wirkt **lebendig, anschaulich und leicht verständlich**, ähnlich wie gesprochene Sprache. Zu viele Verben und Nebensätze können aber wieder lang und umständlich werden. Keiner der beiden Stile ist also besser; entscheidend ist, ob er zur Situation passt.",
      "Wähle den Stil nach Leserschaft und Absicht. Ein Behördenschreiben, ein Gesetz oder ein Fachbericht soll knapp und sachlich informieren; hier passt der Nominalstil. Eine Gebrauchsanweisung, eine Erzählung oder ein Gespräch soll verständlich sein und mitnehmen; hier passt der Verbalstil. In einer Anleitung ist oft die Befehlsform am besten: „Drücke die Taste, bis die Lampe leuchtet.“ statt „Die Betätigung der Taste ist bis zum Aufleuchten der Lampe fortzusetzen.“ In einer Bewerbung wirkt ein überwiegend verbaler Stil persönlich und konkret („Ich habe Kinder betreut.“ statt „Meine Tätigkeit bestand in der Betreuung von Kindern.“). Beim Sprechen gilt das noch stärker: Zuhörende können nicht zurückblättern und verstehen kurze Sätze mit Verben besser als lange Substantivketten.",
      "So formst du um. **Vom Nominalstil zum Verbalstil:** Suche die Nominalisierungen und Funktionsverbgefüge, mache sie wieder zu Verben und frage: Wer tut was? Aus einer Substantivgruppe wird oft ein Nebensatz. Aus „Bei Nichteinhaltung der Frist wird eine Gebühr erhoben.“ wird „Wer die Frist nicht einhält, muss eine Gebühr zahlen.“ **Vom Verbalstil zum Nominalstil:** Fasse Verben zu Substantiven zusammen, wenn der Text knapper und sachlicher werden soll: „Als wir die Daten geprüft hatten, gaben wir sie frei.“ wird zu „Nach der Prüfung der Daten erfolgte die Freigabe.“ Beim Umformen muss die Aussage gleich bleiben.",
    ],
    terms: [
      {
        term: "Nominalstil",
        text: "Ein Stil mit vielen Substantiven, der sachlich und knapp, aber oft abstrakt und schwerfällig wirkt.",
      },
      {
        term: "Verbalstil",
        text: "Ein Stil, in dem Verben die Handlung tragen und der lebendig, anschaulich und leicht verständlich wirkt.",
      },
      {
        term: "Nominalisierung",
        text: "Ein Verb oder Adjektiv, das zum Substantiv gemacht wurde, zum Beispiel „prüfen“ zu „die Prüfung“.",
      },
      {
        term: "Funktionsverbgefüge",
        text: "Ein Verb mit einem Substantiv, das zusammen so viel wie ein einzelnes Verb bedeutet, zum Beispiel „zur Anwendung bringen“ für „anwenden“.",
      },
    ],
    examples: [
      {
        title: "Dieselbe Mitteilung in zwei Stilen (eigens verfasst)",
        text: "Nominalstil: Bei Überschreitung der Rückgabefrist erfolgt die Berechnung einer Mahngebühr durch die Bibliothek.\nVerbalstil: Wenn du ein Buch zu spät zurückgibst, berechnet die Bibliothek eine Mahngebühr.",
        analysis:
          "Der erste Satz hat die Nominalisierungen „Überschreitung“ und „Berechnung“ und das blasse Verb „erfolgt“. Wer handelt, steht erst am Ende („durch die Bibliothek“). Der zweite Satz nennt Handelnde („du“, „die Bibliothek“) und Handlungen („zurückgibst“, „berechnet“). Er ist kürzer und verständlicher; der erste klingt amtlicher und passt in eine Gebührenordnung.",
      },
    ],
    takeaway:
      "Nominalstil (viele Substantive) wirkt sachlich und knapp, aber oft schwerfällig. Verbalstil (viele Verben) wirkt lebendig und verständlich. Wähle nach Leserschaft und Absicht und forme um, indem du Nominalisierungen zu Verben machst oder umgekehrt.",
    sourceIds: ["lp"],
    quiz: {
      question: "Welcher Satz ist im Nominalstil geschrieben?",
      answer: "Nach Prüfung der Unterlagen erfolgt die Zusage durch die Firma.",
      wrong: [
        "Wenn die Firma die Unterlagen geprüft hat, meldet sie sich bei dir.",
        "Die Firma prüft deine Unterlagen und sagt dir danach zu.",
      ],
      explanation:
        "Nur der erste Satz verpackt die Handlungen in Substantive („Prüfung“, „Zusage“) und nutzt das blasse Verb „erfolgt“. Die beiden anderen nennen Handelnde und Handlungen mit Verben („prüft“, „meldet sich“, „sagt zu“). Das ist Verbalstil.",
    },
    workshop: {
      kind: "mark",
      title: "Nominalisierungen und Funktionsverbgefüge finden",
      instruction:
        "Der Aushang ist im Nominalstil geschrieben. Wähle oben eine Kategorie und klicke die passenden Stellen an. Eine Nominalisierung ist ein einzelnes Substantiv, das aus einem Verb entstanden ist, meist auf -ung. Ein Funktionsverbgefüge ist ein Verb mit Substantiv, das zusammen nur ein Tun ausdrückt, zum Beispiel „Hilfe leisten“ für „helfen“. Du klickst es immer als ganze Verbindung an, auch wenn darin ein Substantiv auf -ung steckt. Nicht jede Stelle gehört dazu.",
      labels: ["Nominalisierung", "Funktionsverbgefüge"],
      text: [
        { t: "Der Elternbeirat " },
        {
          t: "trifft eine Entscheidung",
          label: 1,
          feedback:
            "„eine Entscheidung treffen“ heißt nur „entscheiden“. Das Verb „trifft“ sagt kaum etwas, die Bedeutung steckt im Substantiv.",
        },
        { t: " nach " },
        {
          t: "Beendigung",
          label: 0,
          feedback:
            "„Beendigung“ ist aus dem Verb „beenden“ gebildet. Im Verbalstil hieße es „wenn der Elternabend zu Ende ist“.",
        },
        { t: " des Elternabends. " },
        { t: "Die Hausmeisterin ist für die " },
        {
          t: "Reinigung",
          label: 0,
          feedback:
            "„Reinigung“ kommt von „reinigen“. Im Verbalstil: „Die Hausmeisterin reinigt die Flure.“",
        },
        { t: " der Flure zuständig. " },
        { t: "Ab Montag sollen die neuen Schulregeln " },
        {
          t: "Anwendung finden",
          label: 1,
          feedback:
            "„Anwendung finden“ bedeutet „angewendet werden“. Das Verb „finden“ trägt keine eigene Bedeutung.",
        },
        { t: ". " },
        { t: "Bei " },
        {
          t: "Verspätung",
          label: 0,
          feedback:
            "„Verspätung“ ist aus „sich verspäten“ entstanden. Im Verbalstil: „Wer sich verspätet, meldet sich im Sekretariat.“",
        },
        { t: " meldet man sich im Sekretariat. " },
        { t: "Das Sanitätsteam " },
        {
          t: "leistet Hilfe",
          label: 1,
          feedback:
            "„Hilfe leisten“ ist ein Funktionsverbgefüge für „helfen“. Das Verb „leistet“ stützt nur das Substantiv.",
        },
        { t: " in den großen Pausen." },
      ],
      conclusion:
        "Nominalisierungen und Funktionsverbgefüge verraten den Nominalstil. Du kannst sie in Verben zurückverwandeln und den Satz dadurch lebendiger und klarer machen.",
    },
    casework: {
      title: "Eine Spielanleitung, die niemand versteht",
      story:
        "Anna schreibt eine Anleitung für das Kartenspiel „Fuchsjagd“, das Kinder ab acht Jahren spielen sollen. Der erste Satz lautet: **„Nach Entnahme der Karten aus der Schachtel erfolgt die Verteilung von fünf Karten an jede Person am Tisch unter Beachtung des Uhrzeigersinns.“**",
      steps: [
        {
          question: "Welcher Stil herrscht in diesem Satz vor?",
          options: [
            "Nominalstil: Substantive wie „Entnahme“ und „Verteilung“ tragen den Inhalt",
            "Verbalstil: Verben beschreiben genau, was die Spielenden nacheinander tun",
            "Umgangssprache: Der Satz klingt wie ein lockeres Gespräch unter Freunden",
          ],
          answer: 0,
          explanation:
            "Die Handlungen stecken in Nominalisierungen („Entnahme“, „Verteilung“, „Beachtung“), das einzige Verb „erfolgt“ sagt fast nichts. Das ist Nominalstil.",
        },
        {
          question: "Wie wirkt dieser Stil auf Kinder ab acht Jahren?",
          options: [
            "Schwer verständlich, weil unklar bleibt, wer was tun soll",
            "Besonders anschaulich, weil viele Informationen in einem Satz stehen",
            "Sehr persönlich, weil die Lesenden direkt angesprochen werden",
          ],
          answer: 0,
          explanation:
            "Niemand wird angesprochen, und die Handlungen sind abstrakt verpackt. Für Kinder ist das schwer zu lesen.",
        },
        {
          question: "Welche Umformung ersetzt die Nominalisierungen durch Verben?",
          options: [
            "Nimm die Karten aus der Schachtel und gib allen reihum im Uhrzeigersinn je fünf Karten.",
            "Nach der Entnahme der Karten wird deren Verteilung vorgenommen: je fünf Karten pro Person.",
            "Man nehme die Karten und verteile sie, wobei die Beachtung des Uhrzeigersinns geboten ist.",
          ],
          answer: 0,
          explanation:
            "Nur die erste Fassung macht aus „Entnahme“, „Verteilung“ und „Beachtung“ wieder Verben und spricht die Spielenden an. Die anderen behalten Nominalisierungen.",
        },
        {
          question: "Für welchen Text wäre der ursprüngliche Nominalstil dagegen passend?",
          options: [
            "Für die Spielordnung eines Vereins, die als Regelwerk gelten soll",
            "Für eine lockere Nachricht an eine Freundin über das Wochenende",
            "Für eine spannende Erzählung über einen Ausflug mit der Klasse",
          ],
          answer: 0,
          explanation:
            "Regelwerke und Ordnungen sollen knapp und sachlich festlegen, was gilt. Nachricht und Erzählung leben von Handelnden und Handlungen.",
        },
      ],
      verdict:
        "Der Satz ist im Nominalstil geschrieben und für Kinder zu schwerfällig. Im Verbalstil („Nimm die Karten …“) wird die Anleitung verständlich. In der Ordnung eines Vereins wäre der Nominalstil dagegen passend.",
    },
    tasks: {
      1: {
        prompt:
          "Forme zwei Sätze in den Verbalstil um. a) „Nach Abschluss der Reparatur erfolgt die Rückgabe des Fahrrads an Sie.“ b) „Bei Nichteinhaltung der Frist wird eine Gebühr erhoben.“ Nenne zuerst die Nominalisierungen.",
        hints: [
          "Suche die Substantive, die aus Verben entstanden sind, und mache sie wieder zu Verben.",
          "Frage: Wer tut was? Setze diese Person als Subjekt in den neuen Satz, zum Beispiel mit einem Nebensatz mit „wenn“ oder „wer“.",
        ],
        model:
          "a) Nominalisierungen: „Abschluss“, „Reparatur“, „Rückgabe“. Verbalstil: Wenn die Werkstatt das Fahrrad repariert hat, gibt sie es Ihnen zurück. b) Nominalisierung: „Nichteinhaltung“. Verbalstil: Wer die Frist nicht einhält, muss eine Gebühr zahlen. In beiden Sätzen steht jetzt, wer handelt, und die Aussage ist gleich geblieben.",
        criteria: [
          "Nennt die Nominalisierungen beider Sätze.",
          "Macht aus ihnen Verben und nennt, wer handelt.",
          "Behält die Aussage der Sätze bei.",
        ],
      },
      2: {
        prompt:
          "Die Busfahrerin ist krank, und der Schulbus fällt am Freitag aus. Schreibe diese Mitteilung zweimal: als Eintrag im Amtsblatt der Gemeinde (Nominalstil) und als Nachricht an deine Klasse (Verbalstil). Erkläre in zwei Sätzen, warum jede Fassung zu ihrem Zweck passt.",
        hints: [
          "Für das Amtsblatt eignen sich Substantive wie „Erkrankung“, „Ausfall“ und „Beförderung“. Für die Nachricht sprichst du die Klasse direkt an und nutzt Verben.",
          "Begründe mit Leserschaft und Absicht: Wer liest, und was sollen die Lesenden erfahren?",
        ],
        model:
          "Amtsblatt: Wegen der Erkrankung der Busfahrerin entfällt am Freitag die Schülerbeförderung. Nachricht: Der Schulbus fährt am Freitag nicht, weil die Busfahrerin krank ist. Fragt zu Hause, ob euch jemand fahren kann. Das Amtsblatt informiert viele Menschen knapp und sachlich, deshalb passt der Nominalstil. Die Nachricht soll meine Klasse sofort verstehen und zum Handeln bringen, deshalb passt der Verbalstil.",
        criteria: [
          "Die erste Fassung enthält Nominalisierungen und wirkt sachlich.",
          "Die zweite Fassung nennt Handelnde und nutzt Verben.",
          "Die Begründung nennt Leserschaft und Absicht.",
        ],
      },
    },
  },
  {
    id: "de-rechtschreibstrategien",
    lb: 4,
    unit: "4.3",
    covers: ["4.3.1"],
    title: "Rechtschreibstrategien und Proben gegen Fehlerschwerpunkte",
    intro:
      "Wer Strategien und Proben kennt, muss Wörter nicht raten. Du nutzt sie zügig, um deine eigenen Fehlerschwerpunkte zu beheben.",
    paragraphs: [
      "Fast alle machen bestimmte Fehler immer wieder, zum Beispiel bei „das“ und „dass“, bei Groß- und Kleinschreibung oder bei s, ss und ß. Solche wiederkehrenden Fehler heißen **Fehlerschwerpunkte**. Du findest deine eigenen, indem du die Fehler aus mehreren Texten sammelst und nach ihrer Art ordnest. Danach hilft gezieltes Üben mehr als allgemeines Lernen: Zu jedem Fehlerschwerpunkt gehört eine passende Strategie oder Probe. Wichtig ist, dass du sie schnell anwenden kannst, auch in einer Klassenarbeit. Vieles davon kennst du aus Klasse 8 (Wiederholung); jetzt geht es um Sicherheit und Tempo.",
      "Diese fünf Strategien helfen dir beim Schreiben. **Mitsprechen:** Du sprichst das Wort deutlich in Silben und schreibst, was du hörst. Das klappt bei Wörtern wie „Lam-pe“. **Ableiten:** Du suchst ein verwandtes Wort mit demselben Stamm: „Bäume“ schreibst du mit äu, weil es von „Baum“ kommt. **Verlängern:** Du bildest die Mehrzahl oder eine andere Form, bis du den Laut hörst: „Hund“ mit d wegen „Hunde“, „Korb“ mit b wegen „Körbe“. **Merken:** Manche Wörter folgen keiner Regel, du prägst sie dir ein. **Nachschlagen:** Wenn nichts hilft, schlägst du im Wörterbuch oder online im DWDS oder bei Duden nach.",
      "Proben prüfen eine grammatische Frage am Satz. Die **Artikelprobe** zeigt, ob ein Wort großgeschrieben wird: Passt ein Artikel davor („die Lampe“, „das Lesen“), ist es ein Substantiv oder wird wie eines gebraucht. Bei „das“ oder „dass“ hilft die **Ersatzprobe**: Kannst du „dieses“, „jenes“ oder „welches“ einsetzen, schreibst du „das“ („Ich lese das Buch.“ – „dieses Buch“). Passt keines davon, ist es die Konjunktion „dass“, die einen Nebensatz einleitet („Ich hoffe, dass du kommst.“). Mit der **Umstellprobe** findest du heraus, welche Wörter zusammengehören: Was du nur gemeinsam verschieben kannst, bildet ein Satzglied.",
      "Achte außerdem auf diese Fälle. Bei **e oder ä** und **eu oder äu** hilft Ableiten („Häuser“ von „Haus“). Bei **d oder t**, **b oder p** und **g oder k** am Wortende hilft Verlängern. Bei **s, ss und ß** hörst du zuerst, ob der s-Laut scharf klingt. Nach kurzem Vokal steht dann „ss“ („Fluss“, „muss“), nach langem Vokal oder Zwielaut „ß“ („Fuß“, „heiß“). Bei der **Getrennt- und Zusammenschreibung** schlägst du nach. Auch Rechtschreibprogramme übersehen manches, denn ein falsch gesetztes „das“ ist ein richtiges Wort und fällt nicht immer auf. Notiere deine Fehlerwörter mit der passenden Strategie und übe sie in kurzen Runden.",
    ],
    terms: [
      {
        term: "Fehlerschwerpunkt",
        text: "Eine Art von Fehler, die bei dir immer wieder vorkommt, zum Beispiel „das“ statt „dass“.",
      },
      {
        term: "Ableiten",
        text: "Ein verwandtes Wort mit demselben Stamm suchen, zum Beispiel „Baum“ für „Bäume“.",
      },
      {
        term: "Verlängern",
        text: "Die Mehrzahl oder eine andere Form bilden, damit du den Laut am Wortende hörst, zum Beispiel „Hunde“ für „Hund“.",
      },
      {
        term: "Artikelprobe",
        text: "Du setzt „der“, „die“, „das“ oder „ein“ vor ein Wort: Passt es, schreibst du das Wort groß.",
      },
      {
        term: "Ersatzprobe",
        text: "Du setzt „dieses“, „jenes“ oder „welches“ für „das“ ein: Passt es, schreibst du „das“, sonst „dass“.",
      },
    ],
    examples: [
      {
        title: "Drei Fehler, drei Strategien (eigens verfasst)",
        text: "Ich hoffe das du kommst. → „dieses“ passt nicht → dass\nIm Herbst werden die Beume kahl. → Baum → Bäume\nDer Hunt bellt im Garten. → Mehrzahl „Hunde“ → Hund",
        analysis:
          "Jeder Fehler hat eine eigene Lösung. Beim ersten Satz entscheidet die Ersatzprobe: „dieses“ passt nicht, also steht dort die Konjunktion „dass“. Beim zweiten Satz führt das verwandte Wort „Baum“ zu ä. Beim dritten Satz hörst du in „Hunde“ ein d. Wer weiß, welche Strategie zu welchem Fehler gehört, muss nicht raten.",
      },
    ],
    takeaway:
      "Ordne deine Fehler nach Art und wähle dazu die passende Hilfe: Ableiten bei e oder ä, Verlängern bei d oder t, Artikelprobe bei Groß und Klein, Ersatzprobe bei „das“ und „dass“. Wenn nichts hilft, schlägst du nach.",
    sourceIds: ["lp", "regelwerk", "dwds"],
    quiz: {
      question: "Wie entscheidest du bei „Ich hoffe, … du bald kommst“ sicher zwischen „das“ und „dass“?",
      answer: "Ich setze „dieses“ oder „welches“ ein: Passt es nicht, schreibe ich „dass“.",
      wrong: [
        "Ich bilde die Mehrzahl des Wortes: Passt sie nicht, schreibe ich „dass“.",
        "Ich setze „der“, „die“ oder „ein“ davor: Passt es, schreibe ich „dass“.",
      ],
      explanation:
        "Die Ersatzprobe mit „dieses“ oder „welches“ trennt „das“ von „dass“. Die Mehrzahl hilft bei d und t am Wortende, die Artikelprobe bei der Großschreibung. Beide sagen nichts über „das“ und „dass“.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Strategie oder Probe hilft?",
      instruction:
        "Jeder Eintrag beschreibt einen Zweifel beim Schreiben und die Lösung, die jemand gewählt hat. Ordne ihn der Strategie oder Probe zu, die dahintersteckt.",
      categories: ["Verlängern", "Ableiten", "Ersatzprobe", "Artikelprobe"],
      entries: [
        {
          text: "Du weißt nicht, ob „Korb“ am Ende mit b oder p steht. Du bildest die Mehrzahl „Körbe“ und hörst ein b.",
          target: 0,
          feedback: "Du bildest eine längere Form des Wortes, um den Laut zu hören. Das ist Verlängern.",
        },
        {
          text: "Du bist unsicher, ob „Bäume“ mit eu oder äu geschrieben wird. Du denkst an „Baum“ und entscheidest dich für äu.",
          target: 1,
          feedback: "Du suchst ein verwandtes Wort mit demselben Stamm. Das ist Ableiten.",
        },
        {
          text: "Du schwankst bei „Tag“ zwischen g und k am Ende. Du bildest „Tage“ und hörst ein g.",
          target: 0,
          feedback: "Die Mehrzahl macht den Laut am Wortende hörbar. Das ist Verlängern.",
        },
        {
          text: "Du fragst dich, ob in „Ich hoffe, ... du kommst“ „das“ oder „dass“ steht. Mit „dieses“ klingt der Satz falsch.",
          target: 2,
          feedback: "Du setzt ein Ersatzwort ein und prüfst, ob der Satz noch stimmt. Das ist die Ersatzprobe.",
        },
        {
          text: "Du bist unsicher, ob „lesen“ in „Beim lesen vergesse ich die Zeit“ klein oder groß steht. Du prüfst, ob „das Lesen“ möglich ist.",
          target: 3,
          feedback: "Du setzt einen Artikel vor das Wort. Das ist die Artikelprobe.",
        },
        {
          text: "Du zweifelst, ob „Äpfel“ mit ä oder e beginnt. Du suchst das verwandte Wort „Apfel“.",
          target: 1,
          feedback: "Das Wort „Apfel“ hat denselben Stamm und zeigt das a. Das ist Ableiten.",
        },
      ],
      conclusion:
        "Verlängern und Ableiten helfen bei Lauten, die Artikelprobe bei Groß und Klein, die Ersatzprobe bei „das“ und „dass“. Wer die Hilfe zum Fehler kennt, spart Zeit.",
    },
    casework: {
      title: "Jonas sucht seinen Fehlerschwerpunkt",
      story:
        "Jonas hat aus drei Aufsätzen diese Fehler gesammelt: **„Ich hoffe, das du kommst.“ – „Es ist schade, das es regnet.“ – „Er sagt, das er müde ist.“ – „Der Hunt bellt laut.“** Jetzt will er seine Fehler gezielt beheben.",
      steps: [
        {
          question: "Welcher Fehlerschwerpunkt kommt in Jonas’ Liste dreimal vor?",
          options: [
            "„das“ statt „dass“",
            "Groß- und Kleinschreibung",
            "Verwechslung von d und t am Wortende",
          ],
          answer: 0,
          explanation:
            "In den ersten drei Sätzen steht „das“, wo die Konjunktion „dass“ nötig ist. Der vierte Satz hat einen anderen Fehler.",
        },
        {
          question: "Welche Probe hilft Jonas, diesen Fehlerschwerpunkt zu beheben?",
          options: [
            "Die Ersatzprobe mit „dieses“, „jenes“ oder „welches“",
            "Die Verlängerungsprobe mit der Mehrzahl des Wortes",
            "Die Artikelprobe mit „der“, „die“, „das“ oder „ein“",
          ],
          answer: 0,
          explanation:
            "Passt „dieses“ nicht, steht „dass“. Verlängern und Artikelprobe klären andere Fragen: Laute am Wortende und Großschreibung.",
        },
        {
          question: "Welche Strategie löst den vierten Fehler („Der Hunt bellt laut.“)?",
          options: [
            "Verlängern: In „Hunde“ hört man ein d",
            "Ableiten: Man sucht ein Wort mit gleichem Stamm und a oder au",
            "Merken: Das Wort folgt keiner Regel und muss gelernt werden",
          ],
          answer: 0,
          explanation:
            "Bei d oder t am Wortende bildest du die Mehrzahl und hörst, welcher Laut folgt. Hier ist es ein d. Merken ist nicht nötig, weil eine Strategie hilft.",
        },
        {
          question: "Wie behebt Jonas seinen Fehlerschwerpunkt auf Dauer am besten?",
          options: [
            "Er sammelt Fehlerwörter, übt sie mit der passenden Probe und prüft neue Texte",
            "Er lernt jede Woche eine lange Liste schwieriger Wörter auswendig und schreibt sie ab",
            "Er verlässt sich auf das Rechtschreibprogramm, das ihm alle Fehler anzeigt",
          ],
          answer: 0,
          explanation:
            "Gezieltes Üben mit einer passenden Probe wirkt am besten. Ein Programm übersieht Fehler wie „das“ statt „dass“ oft, weil beide Wörter richtig geschrieben sind.",
        },
      ],
      verdict:
        "Jonas findet seinen Fehlerschwerpunkt („das“ statt „dass“), wählt die Ersatzprobe und behebt den Fehler im vierten Satz mit Verlängern. So passt jede Hilfe zu einem Fehler.",
    },
    practice: {
      kind: "choose",
      title: "Rechtschreibung: drei Sätze pro Runde",
      instruction:
        "Wähle für jede Lücke die richtige Schreibweise. Wenn du unsicher bist, nutze eine Strategie oder Probe aus der Lektion. Eine Runde zählt, wenn alle drei Sätze stimmen.",
      pool: {
        1: [
          {
            before: "Ich hoffe, ",
            options: ["dass", "das"],
            answer: 0,
            after: " du bald wiederkommst.",
            feedback:
              "Ersatzprobe: Passt „dieses“ oder „welches“, schreibst du „das“, sonst „dass“. Ein „dass“-Satz wird vom Hauptsatz durch ein Komma getrennt.",
          },
          {
            before: "Das Fahrrad, ",
            options: ["das", "dass"],
            answer: 0,
            after: " ich gestern gekauft habe, ist rot.",
            feedback:
              "Ersatzprobe: Für „das“ kannst du „welches“ einsetzen. Prüfe, ob das Wort sich auf ein Substantiv bezieht.",
          },
          {
            before: "Im Herbst fallen die Blätter von den ",
            options: ["Bäumen", "Beumen"],
            answer: 0,
            after: ".",
            feedback:
              "Ableiten: Suche ein verwandtes Wort mit demselben Stamm und prüfe, ob dort ein a oder au steht.",
          },
          {
            before: "Der ",
            options: ["Hund", "Hunt"],
            answer: 0,
            after: " bellt laut im Garten.",
            feedback:
              "Verlängern: Bilde die Mehrzahl oder eine andere Form und höre auf den Laut vor der Endung.",
          },
          {
            before: "Im Dorf stehen viele alte ",
            options: ["Häuser", "Heuser"],
            answer: 0,
            after: ".",
            feedback:
              "Ableiten: Suche das Wort in der Einzahl und achte darauf, ob dort ein au vorkommt.",
          },
          {
            before: "Das ",
            options: ["Lesen", "lesen"],
            answer: 0,
            after: " macht mir großen Spaß.",
            feedback:
              "Artikelprobe: Steht ein Artikel davor, wird das Wort wie ein Substantiv gebraucht und großgeschrieben.",
          },
          {
            before: "Der ",
            options: ["Fluss", "Fluß"],
            answer: 0,
            after: " ist nach dem Regen angeschwollen.",
            feedback:
              "Nach kurzem Vokal steht „ss“, nach langem Vokal oder Zwielaut „ß“. Sprich das Wort deutlich und achte auf den Vokal.",
          },
          {
            before: "Wir sehen uns bald ",
            options: ["wieder", "wider"],
            answer: 0,
            after: ".",
            feedback:
              "Bedeutung prüfen: „wieder“ meint noch einmal, „wider“ meint gegen. Im Zweifel hilft ein Wörterbuch.",
          },
          {
            before: "Am Wochenende wollen wir zusammen ",
            options: ["Rad fahren", "radfahren"],
            answer: 0,
            after: " und danach schwimmen.",
            feedback:
              "Verbindungen aus Substantiv und Verb schreibt man in der Regel getrennt. Das Substantiv bleibt dabei groß.",
          },
          {
            before: "Zum Frühstück trinke ich ein Glas ",
            options: ["Wasser", "Waser"],
            answer: 0,
            after: ".",
            feedback:
              "Mitsprechen in Silben und auf den Vokal achten: Nach kurzem, betontem Vokal steht meist ein doppelter Konsonant.",
          },
        ],
        2: [
          {
            before: "Als wir nach der Wanderung am Gipfel ankamen, merkten wir, ",
            options: ["dass", "das"],
            answer: 0,
            after: " das Wetter umschlug.",
            feedback:
              "Ersatzprobe: Setze „dieses“ oder „welches“ ein und achte darauf, welches der beiden Wörter einen Nebensatz einleitet.",
          },
          {
            before: "Die Lehrerin lobte das Referat, ",
            options: ["das", "dass"],
            answer: 0,
            after: " Mia in der letzten Woche vorbereitet hatte.",
            feedback:
              "Ersatzprobe: Prüfe, ob „welches“ passt und ob sich das Wort auf ein Substantiv davor bezieht.",
          },
          {
            before: "Beim ",
            options: ["Backen", "backen"],
            answer: 0,
            after: " des Kuchens hat sich die ganze Familie in der Küche versammelt.",
            feedback:
              "Artikelprobe: „beim“ ist „bei dem“. Prüfe, ob ein Artikel davor stehen kann.",
          },
          {
            before: "Seit dem Umzug in die neue Stadt hat er ",
            options: ["viel Neues", "viel neues"],
            answer: 0,
            after: " erlebt.",
            feedback:
              "Nach „viel“, „wenig“, „etwas“, „nichts“ oder „alles“ werden Adjektive wie Substantive gebraucht und großgeschrieben.",
          },
          {
            before: "Meine Schwester hat in einem ",
            options: ["Gebäude", "Gebeude"],
            answer: 0,
            after: " ganz in der Nähe unserer Schule ein Praktikum gemacht.",
            feedback:
              "Ableiten: Suche das Verb oder Substantiv, von dem das Wort kommt, und achte auf den Stamm.",
          },
          {
            before: "Wer die Prüfung bestehen will, ",
            options: ["muss", "mus"],
            answer: 0,
            after: " rechtzeitig mit dem Lernen beginnen.",
            feedback:
              "Sprich das Wort und achte auf den Vokal: Nach kurzem Vokal steht ein doppelter Konsonant, hier ein „ss“.",
          },
          {
            before: "Mein Bruder übt jeden Samstag mit seinem Vater ",
            options: ["Auto fahren", "autofahren"],
            answer: 0,
            after: ", bis er die Prüfung machen darf.",
            feedback:
              "Prüfe, ob Substantiv und Verb zwei eigene Wörter sind: Dann bleibt das Substantiv großgeschrieben.",
          },
          {
            before: "Ihr ",
            options: ["seid", "seit"],
            answer: 0,
            after: " heute die Ersten, die im Klassenzimmer sind.",
            feedback:
              "Prüfe, welche Wortart nötig ist: eine Form von „sein“ oder ein Wort, das einen Zeitpunkt angibt.",
          },
          {
            before: "Ich habe ",
            options: ["heute Morgen", "heute morgen"],
            answer: 0,
            after: " beim Bäcker frische Brötchen für das Frühstück geholt.",
            feedback:
              "Nach Wörtern wie „gestern“, „heute“ oder „morgen“ werden Tageszeiten wie „Morgen“, „Mittag“ oder „Abend“ großgeschrieben.",
          },
          {
            before: "Es ist erstaunlich, wie viele Menschen glauben, ",
            options: ["dass", "das"],
            answer: 0,
            after: " man im Internet alles ungeprüft übernehmen kann.",
            feedback:
              "Ersatzprobe: Prüfe, ob „dieses“ oder „welches“ passt. Hier beginnt ein Nebensatz mit dem Verb am Ende.",
          },
        ],
      },
    },
    tasks: {
      1: {
        prompt:
          "Schreibe die drei Sätze richtig auf und nenne dazu die Strategie oder Probe, mit der du entschieden hast. 1) „Er sagt das er keine Zeit hat.“ 2) „Der Korp steht im Keller.“ 3) „Beim schwimmen im See habe ich meine Brille verloren.“",
        hints: [
          "Gehe jeden Satz einzeln durch: Welches Wort ist unsicher, und welche Strategie passt dazu?",
          "Schreibe hinter jeden Satz die Strategie. So findest du sie beim nächsten Mal schneller wieder.",
        ],
        model:
          "1) Er sagt, dass er keine Zeit hat. Mit der Ersatzprobe passt „dieses“ nicht, also steht „dass“, und davor kommt ein Komma. 2) Der Korb steht im Keller. Beim Verlängern höre ich in „Körbe“ ein b. 3) Beim Schwimmen im See habe ich meine Brille verloren. Mit der Artikelprobe passt „das Schwimmen“, also wird das Wort großgeschrieben.",
        criteria: [
          "Schreibt alle drei Sätze richtig.",
          "Nennt zu jedem Satz eine passende Strategie oder Probe.",
          "Setzt auch das Komma vor „dass“.",
        ],
      },
      2: {
        prompt:
          "Stelle einen Plan gegen einen eigenen Fehlerschwerpunkt auf. Beschreibe einen Fehler, der dir oft passiert, oder wähle einen aus der Lektion. Nenne die passende Strategie oder Probe, ein Nachschlagewerk und drei Übungssätze, in denen der Fehlerschwerpunkt vorkommt.",
        hints: [
          "Ordne den Fehler einer Art zu, zum Beispiel „das“ und „dass“, e und ä oder Groß- und Kleinschreibung.",
          "Die Übungssätze sollen den Fehler enthalten, den du üben willst. Notiere dazu, wie du jeden Satz prüfst.",
        ],
        model:
          "Mein Fehlerschwerpunkt ist „das“ statt „dass“. Dagegen nutze ich die Ersatzprobe: Passt „dieses“ oder „welches“, schreibe ich „das“, sonst „dass“. Bei Zweifeln schlage ich im DWDS nach. Übungssätze: 1) Ich glaube, dass du recht hast. 2) Das Buch, das du mir geliehen hast, gefällt mir. 3) Es ist schön, dass wir uns sehen. Jede Woche prüfe ich einen neuen Text gezielt auf dieses Wort.",
        criteria: [
          "Benennt den Fehlerschwerpunkt genau.",
          "Ordnet ihm eine passende Strategie oder Probe zu und nennt ein Nachschlagewerk.",
          "Enthält drei Übungssätze, in denen der Fehlerschwerpunkt vorkommt.",
        ],
      },
    },
  },
  {
    id: "de-fremdwoerter-schreiben",
    lb: 4,
    unit: "4.3",
    covers: ["4.3.2"],
    title: "Fremdwörter aus Wortbausteinen ableiten und beugen",
    intro:
      "Viele Fremdwörter bestehen aus griechischen und lateinischen Bausteinen. Wer sie kennt, leitet Bedeutung, Schreibung und Beugung ab.",
    paragraphs: [
      "Telefon, Mikroskop, Antibiotikum: Diese Wörter wirken fremd, bestehen aber aus wenigen Bausteinen, die du immer wieder findest. Viele stammen aus dem Griechischen oder Lateinischen. Wer die Bausteine kennt, versteht ein neues Fremdwort schneller und schreibt es sicherer. Aus „tele-“ („fern“) und „-fon“ („Klang, Stimme“) wird das Telefon, aus „mikro-“ („klein“) und „-skop“ („betrachten“) das Mikroskop, aus „anti-“ („gegen“) und „bio-“ („Leben“) das Antibiotikum.",
      "Einige häufige Bausteine: **pro-** („vor, voran, für“: Programm, Projekt), **anti-** („gegen“: Antibiotikum, Antipathie), **re-** („zurück, wieder“: Reaktion, reparieren), **tele-** („fern“: Teleskop), **mikro-** („klein“: Mikroskop), **graf-** oder **graph-** („schreiben, zeichnen“: Biografie, Grafik) und **fon-** oder **phon-** („Klang, Stimme“: Telefon). Die Vorsilbe **in-** bedeutet „nicht“ (inaktiv) oder „hinein“ (Injektion). Vor l, m und r gleicht sie sich an: in + legal wird **il**legal, in + mobil wird **im**mobil, in + relevant wird **ir**relevant. Darum steht dort ein doppelter Konsonant. Vor b und p wird aus in- ein im-, so entsteht zum Beispiel „Import“.",
      "Auch die Endungen verraten viel. **-ion** bildet Substantive („Information“, „Reaktion“) mit der Mehrzahl auf -ionen, **-ik** bezeichnet Fächer und Künste („Mathematik“, „Musik“), **-ismus** eine Haltung oder Richtung („Optimismus“, „Realismus“) und **-ieren** macht Verben („kopieren“, „telefonieren“). Aus dem Griechischen stammen Schreibungen, die anders klingen, als man sie schreibt: **ph** klingt wie f („Philosophie“, „Physik“), **th** wie t („Theater“, „Mathematik“), **rh** wie r („Rhythmus“, „Rhetorik“) und **y** wie ü („System“, „Gymnasium“). Bei Bausteinen wie -graph-, -phon- und -photo- sind in vielen Wörtern ph und f erlaubt („Grafik“ oder „Graphik“, „Mikrofon“ oder „Mikrophon“), bei anderen gilt nur eine Schreibung („Telefon“, „telefonieren“, „fotografieren“). Im Zweifel schlägst du nach. In den Übungen stehen nur Wörter mit einer einzigen richtigen Schreibung.",
      "Fremdwörter werden wie deutsche Wörter gebeugt, haben aber oft eigene Formen. Bei Substantiven auf -um lautet die Mehrzahl meist -a oder -en: das Praktikum – die Praktika, das Museum – die Museen. „Computer“ bleibt in der Mehrzahl gleich: zwei Computer, aber „mit den Computern“. **Verben auf -ieren** konjugierst du regelmäßig: ich kopiere, du kopierst, er kopiert, im Präteritum er kopierte. Weil die Betonung auf -ie- liegt, bekommt das Partizip II kein ge-: „Ich habe die Seite kopiert“, nicht „gekopiert“. Dasselbe gilt für telefoniert, studiert und fotografiert.",
    ],
    terms: [
      {
        term: "Wortbaustein",
        text: "Ein Teil eines Wortes mit eigener Bedeutung, zum Beispiel „tele-“ für „fern“ oder „-skop“ für „betrachten“.",
      },
      {
        term: "Fremdwort",
        text: "Ein Wort, das aus einer anderen Sprache stammt und oft noch an seiner Schreibung zu erkennen ist, zum Beispiel „Philosophie“.",
      },
      {
        term: "Konjugieren",
        text: "Ein Verb nach Person und Zeit beugen, zum Beispiel „ich kopiere, du kopierst, er kopiert“.",
      },
      {
        term: "Deklinieren",
        text: "Ein Substantiv nach Fall und Zahl beugen, zum Beispiel „das Museum, des Museums, die Museen“.",
      },
    ],
    examples: [
      {
        title: "Fremdwörter in Bausteine zerlegen (eigens verfasst)",
        text: "Mikroskop = mikro- („klein“) + -skop („betrachten“)\nTeleskop = tele- („fern“) + -skop („betrachten“)\nTelefon = tele- („fern“) + -fon („Klang, Stimme“)\nAntibiotikum = anti- („gegen“) + bio- („Leben“) + -tikum",
        analysis:
          "Die Zerlegung zeigt zweierlei: Du erkennst die Bedeutung (Mikroskop: ein Gerät für kleine Dinge, Teleskop: ein Gerät für weit Entferntes), und du siehst, wie jeder Baustein geschrieben wird. Der Baustein -skop kommt in zwei Wörtern vor und wird immer mit k geschrieben. Bei Wörtern auf -um wie „Antibiotikum“ endet die Mehrzahl auf -a: die Antibiotika.",
      },
    ],
    takeaway:
      "Zerlege ein Fremdwort in seine Bausteine: Sie verraten Bedeutung und Schreibung, zum Beispiel il-, im- und ir- aus in-. Verben auf -ieren bilden das Partizip II ohne ge-, Substantive auf -um die Mehrzahl oft mit -a oder -en.",
    sourceIds: ["lp", "regelwerk", "dwds"],
    quiz: {
      question: "Welcher Satz ist richtig geschrieben?",
      answer: "Gestern hat sie lange mit ihrer Cousine telefoniert.",
      wrong: [
        "Gestern hat sie lange mit ihrer Cousine getelefoniert.",
        "Gestern hat sie lange mit ihrer Cousine telephoniert.",
      ],
      explanation:
        "Verben auf -ieren bilden das Partizip II ohne ge-: telefoniert. Die Schreibung mit ph ist bei „telefonieren“ nicht gültig, der Baustein wird hier mit f geschrieben.",
    },
    workshop: {
      kind: "classify",
      title: "Welcher Baustein steckt im Wort?",
      instruction:
        "In jedem Satz steht ein Fremdwort. Ordne es dem Baustein zu, der seine Bedeutung bestimmt. Die Bedeutungen: tele- „fern“, mikro- „klein“, anti- „gegen“, graf- „schreiben, zeichnen“.",
      categories: ["tele-", "mikro-", "anti-", "graf-"],
      entries: [
        {
          text: "Mit dem Teleskop beobachtet die Klasse den Mond.",
          target: 0,
          feedback: "Ein Teleskop lässt weit Entferntes erkennen. Der Baustein tele- bedeutet „fern“.",
        },
        {
          text: "Unter dem Mikroskop sieht man winzige Zellen.",
          target: 1,
          feedback: "Ein Mikroskop macht Kleines sichtbar. Der Baustein mikro- bedeutet „klein“.",
        },
        {
          text: "Das Antibiotikum wirkt gegen Bakterien.",
          target: 2,
          feedback: "Ein Antibiotikum richtet sich gegen Lebewesen wie Bakterien. Der Baustein anti- bedeutet „gegen“.",
        },
        {
          text: "Die Biografie beschreibt das Leben einer Dichterin.",
          target: 3,
          feedback: "Die Biografie ist eine Lebensbeschreibung. Der Baustein -graf- bedeutet „schreiben“.",
        },
        {
          text: "Zwischen den beiden herrschte große Antipathie.",
          target: 2,
          feedback: "Antipathie ist eine Abneigung, ein Gefühl gegen jemanden. Der Baustein anti- bedeutet „gegen“.",
        },
        {
          text: "Die Grafik zeigt, wie sich die Preise entwickeln.",
          target: 3,
          feedback: "Eine Grafik ist eine Zeichnung oder Darstellung. Der Baustein graf- bedeutet „zeichnen, schreiben“.",
        },
      ],
      conclusion:
        "Mit tele-, mikro-, anti- und graf- kennst du vier Bausteine, die in vielen Fremdwörtern stecken. Wer sie erkennt, erschließt Bedeutung und Schreibung.",
    },
    casework: {
      title: "Mias Praktikumsbericht",
      story:
        "Mia schreibt einen Bericht über ihre zwei Praktika in der Stadtbibliothek. Im Entwurf steht: **„Ich habe Bücher kopiert, am Telefon Auskünfte erteilt und mit den Computer die Ausleihe geprüft. Am Ende bekam ich ein Zeugnis über beide Praktikas.“** Sie prüft die Fremdwörter.",
      steps: [
        {
          question: "Was stimmt in „mit den Computer“ nicht?",
          options: [
            "Im Dativ Plural fehlt das -n: mit den Computern",
            "Die Mehrzahl heißt „Computers“: mit den Computers",
            "Nichts, denn „Computer“ bleibt in allen Fällen gleich",
          ],
          answer: 0,
          explanation:
            "Die Mehrzahl von „Computer“ lautet „Computer“, im Dativ Plural kommt aber ein -n dazu: mit den Computern. „Computers“ ist keine deutsche Mehrzahl.",
        },
        {
          question: "Wie heißt die Mehrzahl von „Praktikum“?",
          options: ["Praktika", "Praktikas", "Praktikume"],
          answer: 0,
          explanation:
            "Bei Wörtern auf -um wird die Mehrzahl mit -a oder -en gebildet, nicht mit -s: das Praktikum, die Praktika.",
        },
        {
          question: "Warum heißt es „Ich habe Bücher kopiert“ und nicht „gekopiert“?",
          options: [
            "Verben auf -ieren bekommen im Partizip II kein ge-",
            "Weil „kopieren“ ein unregelmäßiges Verb mit eigener Form ist",
            "Weil das Wort aus dem Englischen stammt",
          ],
          answer: 0,
          explanation:
            "Bei Verben auf -ieren liegt die Betonung auf -ie-, deshalb fehlt das ge-: kopiert, telefoniert, studiert.",
        },
        {
          question: "Was verrät der Baustein tele- im Wort „Telefon“?",
          options: [
            "Das Gerät überträgt Klang in die Ferne („fern“ + „Klang“)",
            "Das Gerät ist besonders klein („klein“ + „Klang“)",
            "Das Gerät richtet sich gegen Lärm („gegen“ + „Klang“)",
          ],
          answer: 0,
          explanation:
            "tele- heißt „fern“, -fon heißt „Klang, Stimme“. Ein Telefon überträgt also die Stimme in die Ferne.",
        },
      ],
      verdict:
        "Mia verbessert „mit den Computern“ und „beide Praktika“. „Kopiert“ war schon richtig, weil Verben auf -ieren kein ge- bekommen. Die Bausteine verraten, was ein Wort bedeutet und wie man es beugt.",
    },
    practice: {
      kind: "choose",
      title: "Fremdwörter: drei Sätze pro Runde",
      instruction:
        "Wähle für jede Lücke die richtige Schreibung oder Form. Zerlege das Wort in Bausteine und denke an die Regeln für Mehrzahl und Partizip. Eine Runde zählt, wenn alle drei Sätze stimmen.",
      pool: {
        1: [
          {
            before: "Die Klasse sieht sich am Freitag im ",
            options: ["Theater", "Teater"],
            answer: 0,
            after: " ein Stück an.",
            feedback:
              "Wörter aus dem Griechischen haben für den Laut t oft ein th, zum Beispiel Thema und Mathematik.",
          },
          {
            before: "Im Deutschunterricht sprechen wir über den ",
            options: ["Rhythmus", "Rythmus"],
            answer: 0,
            after: " eines Gedichts.",
            feedback:
              "Fremdwörter aus dem Griechischen haben manchmal ein h, das man nicht hört. Im Wörterbuch kannst du die Schreibung prüfen.",
          },
          {
            before: "Auf dem ",
            options: ["Programm", "Program"],
            answer: 0,
            after: " der Klassenfahrt steht eine Wanderung.",
            feedback:
              "Der Baustein -gramm („Geschriebenes“) steckt auch in Diagramm und Telegramm. Achte darauf, wie er geschrieben wird.",
          },
          {
            before: "Parken auf dem Gehweg ist ",
            options: ["illegal", "ilegal"],
            answer: 0,
            after: ".",
            feedback:
              "Die Vorsilbe in- („nicht“) gleicht sich an den folgenden Buchstaben an. Zerlege das Wort in Vorsilbe und Stamm.",
          },
          {
            before: "Für unsere Frage ist sein Einwand ",
            options: ["irrelevant", "irelevant"],
            answer: 0,
            after: ".",
            feedback:
              "Die Vorsilbe in- („nicht“) gleicht sich an den folgenden Buchstaben an. Zerlege das Wort in Vorsilbe und Stamm.",
          },
          {
            before: "Unter dem ",
            options: ["Mikroskop", "Mikroscop"],
            answer: 0,
            after: " erkennt man winzige Zellen.",
            feedback:
              "Der Baustein -skop („betrachten“) kommt auch in Teleskop vor. Vergleiche die Schreibung beider Wörter.",
          },
          {
            before: "Viele Jugendliche machen in der neunten Klasse ihre ",
            options: ["Praktika", "Praktikas"],
            answer: 0,
            after: " in Betrieben der Region.",
            feedback:
              "Bei Wörtern auf -um bildest du die Mehrzahl meist mit -a oder -en, nicht mit -s.",
          },
          {
            before: "Im Informatikraum stehen zwanzig ",
            options: ["Computer", "Computers"],
            answer: 0,
            after: ".",
            feedback:
              "Substantive auf -er bleiben in der Mehrzahl meist unverändert. Prüfe, ob die englische Endung nötig ist.",
          },
          {
            before: "Gestern hat sie viele Seiten ",
            options: ["kopiert", "gekopiert"],
            answer: 0,
            after: ".",
            feedback:
              "Verben auf -ieren bilden das Partizip II ohne ge-, weil die Betonung auf -ie- liegt.",
          },
          {
            before: "In unserer Stadt gibt es drei ",
            options: ["Museen", "Museums"],
            answer: 0,
            after: ".",
            feedback:
              "Prüfe, welche Form die Mehrzahl ist und welche der Genitiv Singular. Ein Wörterbuch zeigt beide.",
          },
        ],
        2: [
          {
            before: "Zwischen den beiden Mannschaften herrschte schon vor dem Spiel gegenseitige ",
            options: ["Antipathie", "Antiphatie"],
            answer: 0,
            after: ", obwohl sie sich kaum kannten.",
            feedback:
              "Zerlege das Wort: anti- („gegen“) und -pathie („Gefühl“). Der zweite Baustein steckt auch in Sympathie.",
          },
          {
            before: "Nach dem Sturm sprach der Bürgermeister von einer ",
            options: ["Katastrophe", "Katastrofe"],
            answer: 0,
            after: ", weil mehrere Straßen unter Wasser standen.",
            feedback:
              "Das Wort stammt aus dem Griechischen und hat wie Strophe und Apostroph ein ph, das man wie f spricht.",
          },
          {
            before: "Im Wahlfach ",
            options: ["Philosophie", "Filosofie"],
            answer: 0,
            after: " diskutieren wir, was ein gutes Leben ausmacht.",
            feedback:
              "Das Wort stammt aus dem Griechischen („Liebe zur Weisheit“). Wörter wie Philosophie und Physik behalten dort ihre fremde Schreibung.",
          },
          {
            before: "Seit einer Stunde ",
            options: ["telefoniert", "telephoniert"],
            answer: 0,
            after: " meine Schwester mit ihrer Brieffreundin in Spanien.",
            feedback:
              "Zerlege das Wort in tele- („fern“), -fon („Klang, Stimme“) und -ieren. Prüfe im Wörterbuch, welche Schreibung gültig ist.",
          },
          {
            before: "Nach dem Abitur hat meine Cousine in München Medizin ",
            options: ["studiert", "gestudiert"],
            answer: 0,
            after: ", bevor sie nach Hamburg zog.",
            feedback:
              "Verben auf -ieren bilden das Partizip II ohne ge-. Prüfe, wo die Betonung liegt.",
          },
          {
            before: "Beim Arbeiten mit den ",
            options: ["Computern", "Computer"],
            answer: 0,
            after: " im Medienraum darf nicht gegessen werden.",
            feedback:
              "Im Dativ Plural bekommen Substantive, deren Mehrzahl nicht auf -n endet, meist ein -n.",
          },
          {
            before: "In der Pause habe ich schnell die Hausaufgaben ",
            options: ["kontrolliert", "gekontrolliert"],
            answer: 0,
            after: ", bevor der Unterricht begann.",
            feedback:
              "Verben auf -ieren bilden das Partizip II ohne ge-. Prüfe, wo die Betonung liegt.",
          },
          {
            before: "In den ",
            options: ["Zentren", "Zentrums"],
            answer: 0,
            after: " der großen Städte ist der Verkehr besonders dicht.",
            feedback:
              "Bei Wörtern auf -um steht in der Mehrzahl oft -en oder -a, im Genitiv Singular -s. Prüfe, welche Form gefragt ist.",
          },
          {
            before: "Prüfe zuerst, ob alle ",
            options: ["Daten", "Datums"],
            answer: 0,
            after: " in der Tabelle vollständig sind.",
            feedback:
              "Prüfe, ob eine Mehrzahl oder ein Genitiv Singular gebraucht wird. Ein Wörterbuch zeigt beide Formen.",
          },
          {
            before: "Meine Schwester besucht in der Nachbarstadt eines der beiden ",
            options: ["Gymnasien", "Gymnasiums"],
            answer: 0,
            after: ".",
            feedback:
              "Hinter „eines der beiden“ steht die Mehrzahl. Bei Wörtern auf -um lautet sie oft -en, -ien oder -a.",
          },
        ],
      },
    },
    tasks: {
      1: {
        prompt:
          "Zerlege die Wörter Teleskop, Mikroskop und Antibiotikum in ihre Bausteine und erkläre mit ihrer Hilfe, was sie bedeuten. Bilde zu jedem Wort einen Satz mit der Mehrzahl.",
        hints: [
          "Die Bausteine kennst du aus der Lektion: tele-, mikro-, anti- und -skop.",
          "Für die Mehrzahl: Teleskop und Mikroskop bekommen ein -e, bei Wörtern auf -um steht in der Mehrzahl meist -a.",
        ],
        model:
          "Teleskop = tele- („fern“) + -skop („betrachten“): ein Gerät, mit dem man weit Entferntes betrachtet. Die Schule besitzt zwei Teleskope. Mikroskop = mikro- („klein“) + -skop: ein Gerät für kleine Dinge. Im Labor stehen viele Mikroskope. Antibiotikum = anti- („gegen“) + bio- („Leben“): ein Mittel gegen Krankheitserreger. Ärzte verschreiben Antibiotika bei bakteriellen Infektionen.",
        criteria: [
          "Zerlegt alle drei Wörter in Bausteine.",
          "Erklärt die Bedeutung aus den Bausteinen.",
          "Bildet zu jedem Wort einen Satz mit der richtigen Mehrzahl.",
        ],
      },
      2: {
        prompt:
          "Schreibe fünf zusammenhängende Sätze über einen Praktikumsalltag in einer Bibliothek, einem Büro oder einer Werkstatt. Beuge dabei mindestens vier dieser Fremdwörter richtig: Praktikum, Computer, kopieren, telefonieren, Museum.",
        hints: [
          "Überlege, welche Form jeweils gebraucht wird: Mehrzahl, Dativ Plural oder Partizip II.",
          "Unterstreiche die gebeugten Formen und prüfe sie: Verben auf -ieren bekommen im Partizip II kein ge-.",
        ],
        model:
          "In meinem Praktikum im Büro der Stadtverwaltung habe ich viele Akten kopiert. Mit den Computern im Nachbarraum erfasste ich die Daten neuer Anträge. Am Nachmittag habe ich lange mit Besuchern telefoniert, die Fragen zu ihren Unterlagen hatten. Am Freitag besuchten wir ein Museum der Stadt. Nach den zwei Praktika dieses Jahres weiß ich, dass ich gern im Büro arbeite.",
        criteria: [
          "Verwendet mindestens vier der genannten Fremdwörter.",
          "Bildet Mehrzahl, Dativ Plural und Partizip II richtig.",
          "Die Sätze ergeben einen zusammenhängenden Praktikumsalltag.",
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
      "Das Komma gliedert einen Satz und macht ihn lesbar. Die Regeln kennst du aus Klasse 8; hier wiederholst du sie und festigst sie. Sie sind keine Geschmackssache, sondern amtlich geregelt, und die meisten lassen sich auf wenige Fälle zurückführen. Bevor du ein Komma setzt, frage dich: Wo endet ein Teilsatz, wo steht eine Aufzählung, wo ist etwas eingeschoben? Zähle dazu die gebeugten Verben. Zu jedem gebeugten Verb gehört ein Teilsatz. Zwischen Teilsätzen steht in der Regel ein Komma. Verbindet „und“ oder „oder“ zwei gleichrangige Teilsätze, ersetzt dieses Wort das Komma; nur zwischen zwei vollständigen Hauptsätzen darf zusätzlich eines davorstehen, wenn es den Satz übersichtlicher macht.",
      "**Aufzählung:** Gleichrangige Wörter oder Wortgruppen werden durch Kommas getrennt („Brot, Käse und Tomaten“). Vor „und“, „oder“ und „sowie“ steht kein Komma. **Hauptsatz und Nebensatz:** Ein Nebensatz wird vom Hauptsatz durch ein Komma abgetrennt, am Anfang, am Ende oder mitten im Satz. Du erkennst Nebensätze an einleitenden Wörtern wie „dass“, „weil“, „nachdem“ oder „obwohl“ und am gebeugten Verb am Ende des Teilsatzes („Ich weiß, dass du recht hast.“). Steht der Nebensatz mitten im Hauptsatz, braucht er davor und danach ein Komma.",
      "**Eingeschobenes:** Zusätze, Nachträge und Relativsätze werden von beiden Seiten durch Kommas eingeschlossen („Tom, der Klassensprecher, hält die Rede.“ und „Das Buch, das ich gestern gelesen habe, war spannend.“). **Gegensatz:** Vor „aber“, „sondern“ und „doch“ steht ein Komma („Nicht der Lärm, sondern die Hitze …“). **Infinitivgruppen:** Eine Gruppe mit „um“, „ohne“, „statt“ oder „anstatt“ und „zu“ wird immer durch ein Komma abgetrennt („Er lernt, um die Prüfung zu bestehen.“). Auch bei anderen Infinitivgruppen mit „zu“ („Er hofft, die Prüfung zu bestehen.“) verlangt das Amtliche Regelwerk seit Juli 2024 grundsätzlich ein Komma (§ 73); früher war es dort oft freiwillig. Ausnahmen: Bei einem einzelnen „zu“ mit Verb ist das Komma freiwillig („Kim hat versucht(,) abzunehmen.“), bei Verbindungen wie „Der Regel ist zu folgen.“ steht keines. Hier übst du nur die Fälle, die immer ein Komma verlangen.",
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
        text: "Ein Nebensatz mit „der“, „die“, „das“ oder „welche“, der sich auf ein Substantiv bezieht und, wenn er mitten im Satz steht, von Kommas eingeschlossen wird.",
      },
      {
        term: "Einschub",
        text: "Ein Zusatz oder Nachtrag mitten im Satz, den Kommas von beiden Seiten einschließen.",
      },
      {
        term: "Infinitivgruppe",
        text: "Eine Wortgruppe mit „zu“ und dem Verb im Infinitiv wie „die Prüfung zu bestehen“; mit „um“, „ohne“, „statt“ oder „anstatt“ wird sie immer durch ein Komma abgetrennt.",
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
          words: ["Das", "Buch", "das", "ich", "gestern", "gelesen", "habe", "war", "spannend."],
          commas: [1, 6],
          feedback:
            "Der Relativsatz „das ich gestern gelesen habe“ ist eingeschoben und wird von beiden Seiten durch Kommas eingeschlossen.",
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
          {
            words: ["Wir", "besuchen", "das", "Museum", "das", "gestern", "eröffnet", "wurde."],
            commas: [3],
            feedback: "Der Relativsatz am Satzende wird vom Hauptsatz durch ein Komma abgetrennt.",
          },
          {
            words: ["Ich", "weiß", "wo", "der", "Schlüssel", "liegt."],
            commas: [1],
            feedback: "Auch ein Nebensatz mit einem Fragewort wie „wo“ wird durch ein Komma abgetrennt.",
          },
        ],
        2: [
          {
            words: ["Weil", "der", "Zug", "Verspätung", "hatte", "und", "es", "außerdem", "stark", "regnete", "kam", "Jonas", "erst", "nach", "neun", "Uhr", "an."],
            commas: [9],
            feedback: "Beide Nebensätze sind mit „und“ verbunden, davor steht kein Komma. Erst nach dem zweiten Nebensatz folgt das Komma vor dem Hauptsatz.",
          },
          {
            words: ["Die", "Lehrerin", "die", "uns", "Deutsch", "unterrichtet", "gab", "gestern", "die", "Aufsätze", "zurück."],
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
            words: ["Nicht", "der", "Lärm", "sondern", "die", "Hitze", "störte", "uns", "beim", "Lernen."],
            commas: [2],
            feedback: "Vor „sondern“ steht ein Komma.",
          },
          {
            words: ["Sie", "öffnete", "das", "Fenster", "damit", "frische", "Luft", "hereinkam."],
            commas: [3],
            feedback: "Der Nebensatz mit „damit“ wird vom Hauptsatz abgetrennt.",
          },
          {
            words: ["Das", "Buch", "das", "ich", "dir", "geliehen", "habe", "ist", "spannend", "aber", "sehr", "lang."],
            commas: [1, 6, 8],
            feedback: "Der Relativsatz wird von beiden Seiten eingeschlossen, und vor „aber“ steht ein Komma.",
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
  {
    id: "de-gliederungen-aufzaehlungen",
    lb: 4,
    unit: "4.3",
    covers: ["4.3.3"],
    title: "Gliederungen und Aufzählungen richtig schreiben",
    intro:
      "Listen und Gliederungen helfen nur, wenn sie einheitlich gebaut sind. Du schreibst ihre Anfänge, Zeichen und Enden nach festen Regeln.",
    paragraphs: [
      "Eine Liste oder Gliederung ordnet Gedanken auf einen Blick. Damit sie das leistet, muss sie einheitlich gebaut sein. **Aufzählungszeichen** wie • oder – stehen vor Punkten, deren Reihenfolge keine Rolle spielt. **Gliederungsangaben** wie 1., 1.1 oder a) nutzt du, wenn die Reihenfolge wichtig ist oder du auf einen Punkt verweisen willst, etwa in der Gliederung einer Erörterung. Innerhalb einer Liste verwendest du immer dasselbe Zeichen. Alle Punkte haben außerdem dieselbe Form: Es sind entweder lauter Stichwörter, lauter ganze Sätze oder lauter Teile eines Satzes.",
      "Das Amtliche Regelwerk legt für Gliederungen zwei Dinge fest. Erstens (§ 54, Absatz 5): Ziffern und Buchstaben als Gliederungsangaben gehören nicht zum folgenden Satz, deshalb schreibst du das Wort danach groß: „3. Die Teilnehmenden melden sich bis Freitag an.“, „2.1 Der Aufbau der Zelle“. Dasselbe gilt für Überschriften, ebenso „b) Neue Regeln für den Pausenhof“, auch wenn „neue“ in einem Satz klein wäre. Zweitens (§ 67, E2): Eine Überschrift oder ein Titel in einer freistehenden Zeile endet ohne Punkt. Das gilt in der Praxis auch für die Zeilen einer Gliederung und einer Stichwortliste.",
      "Wie es in einer Liste weitergeht, hängt davon ab, was die Punkte sind. Das Amtliche Regelwerk regelt Listen nur in Teilen; sonst gelten die gewöhnlichen Regeln für Kommas und Satzanfänge und die übliche Praxis. **Stichwörter** (Wörter und Wortgruppen) stehen ohne Satzzeichen am Ende („Bewerbungsmappe“, „Arbeitskleidung“). **Ganze Sätze** beginnen groß. Üblich ist es, sie auch in der Liste mit ihrem Schlusszeichen zu beenden, so empfehlen es auch Hinweise zur Schreibnorm DIN 5008. **Teile eines Satzes** setzen einen Satz fort, der vor der Liste beginnt: Sie beginnen klein (Substantive bleiben natürlich groß), werden wie in einer Aufzählung durch Kommas getrennt (vor dem letzten „und“ oder „oder“ steht keines), und nach dem letzten Punkt steht der Punkt.",
      "Kündigt ein Satz oder eine Wortgruppe die Liste nur an, steht davor ein Doppelpunkt: „Zum Praktikum bitte mitbringen:“. Setzt die Liste den Satz fort („Eine Bewerbung ist vollständig, wenn“), steht keiner. Nach dem Doppelpunkt entscheidet die Art des Angekündigten über die Großschreibung (Amtliches Regelwerk, § 75): Folgt ein ganzer Satz, schreibst du das erste Wort groß („Die Schulordnung besagt: Wer ein Handy mitbringt, schaltet es im Unterricht aus.“). Folgen Wörter oder Wortgruppen, schreibst du klein; Substantive und Namen bleiben natürlich groß („Für den Versuch brauchst du Folgendes: einen Becher, Wasser und Salz.“). Prüfe vor dem Abgeben deines Textes, ob jede Liste in sich einheitlich ist.",
    ],
    terms: [
      {
        term: "Aufzählungszeichen",
        text: "Ein Zeichen wie • oder – vor einem Punkt einer Liste, bei der die Reihenfolge keine Rolle spielt.",
      },
      {
        term: "Gliederungsangabe",
        text: "Eine Ziffer oder ein Buchstabe wie 1., 2.1 oder a) vor einem Gliederungspunkt.",
      },
      {
        term: "Stichwort",
        text: "Ein Wort oder eine kurze Wortgruppe ohne vollständigen Satz, zum Beispiel „Arbeitskleidung“.",
      },
    ],
    examples: [
      {
        title: "Drei Listen, drei Formen (eigens verfasst)",
        text: "Zum Praktikum bitte mitbringen:\n• Bewerbungsmappe\n• Arbeitskleidung\n• Schreibblock\nDie Schulordnung besagt:\n• Handys bleiben im Unterricht ausgeschaltet.\n• Pausen verbringen alle auf dem Hof.\nEine Bewerbung ist vollständig, wenn\n– der Lebenslauf beiliegt,\n– das Anschreiben unterschrieben ist und\n– die Zeugnisse angehängt sind.",
        analysis:
          "Die erste Liste besteht aus Stichwörtern: Sie enden ohne Satzzeichen, die Substantive sind großgeschrieben. In der zweiten Liste ist jeder Punkt ein ganzer Satz: Er beginnt groß und endet üblicherweise mit einem Punkt. In der dritten Liste setzen die Punkte den Satz „Eine Bewerbung ist vollständig, wenn“ fort: Sie beginnen klein, werden durch Kommas getrennt, vor „und“ steht keines, und am Schluss steht der Punkt.",
      },
      {
        title: "Gliederung einer Erörterung (eigens verfasst)",
        text: "Thema: Schuluniformen\nA. Einleitung\nB. Hauptteil\n1. Argumente dafür\na) Gleiche Chancen für alle\nb) Weniger Streit um Marken\n2. Argumente dagegen\na) Verlust der eigenen Persönlichkeit\nb) Kosten für die Eltern\nC. Schluss",
        analysis:
          "Jede Gliederungszeile beginnt nach der Ziffer oder dem Buchstaben mit einem Großbuchstaben, auch wenn das erste Wort wie „Gleiche“ kein Substantiv ist. Am Zeilenende steht kein Punkt. Die Ebenen sind einheitlich: A., B., C. für die Teile, 1. und 2. für die Gruppen, a) und b) für die einzelnen Punkte.",
      },
    ],
    takeaway:
      "Gliederungspunkte beginnen nach Ziffer oder Buchstabe mit einem Großbuchstaben, Stichwortzeilen enden ohne Satzzeichen. Ganze Sätze beginnen groß und enden üblicherweise mit einem Punkt, Teile eines Satzes beginnen klein, werden mit Kommas getrennt und enden mit einem Punkt.",
    sourceIds: ["lp", "regelwerk", "duden", "passau"],
    quiz: {
      question: "Wie schreibst du die Liste, die den Satz „Für die Bewerbung brauchst du“ fortsetzt, richtig?",
      answer: "– einen Lebenslauf, – ein Anschreiben und – deine Zeugnisse.",
      wrong: [
        "– Einen Lebenslauf. – Ein Anschreiben. – Deine Zeugnisse.",
        "– einen Lebenslauf, – ein Anschreiben, und – deine Zeugnisse.",
      ],
      explanation:
        "Die Punkte setzen den Satz fort, darum beginnen sie klein und werden wie in einer Aufzählung durch Kommas getrennt. Vor „und“ steht kein Komma, am Schluss ein Punkt. Große Anfänge und Punkte nach jedem Punkt passen zu ganzen Sätzen. Ganz ohne Satzzeichen kommen nur freistehende Stichwortlisten aus.",
    },
    workshop: {
      kind: "mark",
      title: "Fehler in einer Gliederung finden",
      instruction:
        "Diese Gliederung enthält Fehler. Die erste Zeile ist ihre Überschrift. Wähle oben die Art des Fehlers und klicke die Zeile an, die ihn zeigt. Nicht jede Zeile ist falsch.",
      labels: ["Kleiner Anfang", "Punkt am Zeilenende"],
      text: [
        { t: "Gliederung: Handys in der Schule\n" },
        { t: "A. Einleitung\n" },
        { t: "B. Hauptteil\n" },
        { t: "1. Vorteile\n" },
        {
          t: "a) schnelle Information\n",
          label: 0,
          feedback:
            "Nach der Gliederungsangabe „a)“ beginnt der Punkt wie eine Überschrift mit einem Großbuchstaben: „Schnelle Information“.",
        },
        { t: "b) Hilfe im Notfall\n" },
        { t: "2. Nachteile\n" },
        {
          t: "a) Ablenkung im Unterricht.\n",
          label: 1,
          feedback:
            "Eine Gliederungszeile ist wie eine Überschrift und endet ohne Punkt. Der Punkt gehört zu Sätzen im Fließtext.",
        },
        {
          t: "b) die Gefahr von Mobbing\n",
          label: 0,
          feedback:
            "Auch hier muss der Gliederungspunkt nach „b)“ mit einem Großbuchstaben beginnen: „Die Gefahr von Mobbing“.",
        },
        { t: "C. Schluss" },
      ],
      conclusion:
        "Gliederungspunkte beginnen groß und enden ohne Punkt. Prüfe beides Zeile für Zeile, bevor du eine Gliederung abgibst.",
    },
    casework: {
      title: "Lenas Checkliste für Ferienjobs",
      story:
        "Lena schreibt für die Schülerzeitung eine Hilfe zur Bewerbung. Ihr Entwurf lautet: **„Für die Bewerbung um einen Ferienjob brauchst du • einen Lebenslauf • ein Anschreiben und • deine letzten Zeugnisse“** Die Satzzeichen am Ende der Punkte fehlen noch.",
      steps: [
        {
          question: "Wie sind die Punkte von Lenas Liste gebaut?",
          options: [
            "Sie setzen den Satz „Für die Bewerbung … brauchst du“ fort: Satzteile.",
            "Es sind ganze Sätze, jeder mit eigenem Verb und eigenem Subjekt.",
            "Es sind Überschriften einer Gliederung, die jeweils ein Kapitel nennen.",
          ],
          answer: 0,
          explanation:
            "Jeder Punkt ergänzt „brauchst du“ und hat kein eigenes Verb. Die Liste ist also die Fortsetzung eines Satzes.",
        },
        {
          question: "Wie beginnen die Punkte?",
          options: [
            "Klein, weil der Satz weitergeht",
            "Groß, weil jede Zeile neu beginnt",
            "Groß, aber nur beim ersten Punkt",
          ],
          answer: 0,
          explanation:
            "Ein Satz wird nicht durch den Zeilenumbruch neu begonnen. Deshalb schreibst du die Anfänge klein, wenn kein Substantiv am Anfang steht.",
        },
        {
          question: "Welche Zeichen stehen am Ende der Punkte?",
          options: [
            "Kommas zwischen den Punkten, vor „und“ keines, am Ende ein Punkt",
            "Nach jedem Punkt ein Punkt, damit jeder für sich endet",
            "Gar keine Zeichen, weil Listenpunkte immer ohne Satzzeichen stehen",
          ],
          answer: 0,
          explanation:
            "Die Liste setzt den Satz fort und folgt den Regeln einer Aufzählung: Kommas zwischen den Gliedern, kein Komma vor „und“, am Satzende ein Punkt. Ganz ohne Zeichen kommen nur freistehende Stichwortlisten aus.",
        },
        {
          question: "Lena macht aus den Punkten ganze Sätze („Du brauchst einen Lebenslauf.“ und so weiter). Was ist dann üblich?",
          options: [
            "Jeder Punkt beginnt groß und endet mit einem Punkt",
            "Jeder Punkt beginnt klein und endet mit einem Komma",
            "Nur der erste Punkt beginnt groß, der Rest bleibt klein",
          ],
          answer: 0,
          explanation:
            "Ein ganzer Satz beginnt immer groß. Üblich ist außerdem, dass er auch in einer Liste mit seinem Schlusszeichen endet.",
        },
      ],
      verdict:
        "Lenas Punkte sind Satzteile: Sie beginnen klein, werden durch Kommas getrennt, vor „und“ steht kein Komma, und nach dem letzten Punkt steht ein Punkt. Als ganze Sätze würden sie groß beginnen und üblicherweise jeweils mit einem Punkt enden.",
    },
    practice: {
      kind: "choose",
      title: "Gliederungen und Listen: drei Sätze pro Runde",
      instruction:
        "Wähle für jede Lücke die richtige Schreibweise. Es geht um Anfänge nach Gliederungsangaben, um Zeilenenden und um die Schreibung nach einem Doppelpunkt. Zeilen aus Gliederungen und Inhaltsverzeichnissen stehen frei in einer eigenen Zeile und sind keine Sätze im Fließtext. Eine Runde zählt, wenn alle drei Sätze stimmen.",
      pool: {
        1: [
          {
            before: "In der Gliederung steht die Zeile „2.2 ",
            options: ["Die Rolle der Eltern", "die Rolle der Eltern"],
            answer: 0,
            after: "“.",
            feedback:
              "Ziffern und Buchstaben in Gliederungen gehören nicht zum folgenden Wort. Prüfe, wie der Gliederungspunkt beginnt.",
          },
          {
            before: "In der Gliederung steht als letzte Zeile „C. ",
            options: ["Schluss", "Schluss."],
            answer: 0,
            after: "“.",
            feedback:
              "Eine freistehende Zeile steht wie eine Überschrift für sich. Prüfe, ob an ihrem Ende ein Satzzeichen gebraucht wird.",
          },
          {
            before: "Im Inhaltsverzeichnis steht „3. ",
            options: ["Die Folgen für die Umwelt", "die Folgen für die Umwelt"],
            answer: 0,
            after: "“.",
            feedback:
              "Nach einer Gliederungsangabe wird das nächste Wort großgeschrieben, auch wenn es ein Artikel ist.",
          },
          {
            before: "In der Anleitung steht der Satz „Zum Praktikum mitbringen: ",
            options: ["Arbeitskleidung, Schreibblock und Bewerbungsmappe", "Arbeitskleidung, Schreibblock, und Bewerbungsmappe"],
            answer: 0,
            after: ".“",
            feedback:
              "Reihungen folgen den gewöhnlichen Kommaregeln. Prüfe, wie die Glieder verbunden sind und ob das Wort „und“ das Komma ersetzt.",
          },
          {
            before: "Für den Versuch brauchst du Folgendes: ",
            options: ["einen Becher", "Einen Becher"],
            answer: 0,
            after: ", Wasser und Salz.",
            feedback:
              "Nach einem Doppelpunkt entscheidet die Art des Angekündigten: Folgt ein ganzer Satz, schreibst du groß, folgen Wörter oder Wortgruppen, schreibst du klein.",
          },
          {
            before: "Die Regel lautet: ",
            options: ["Wer viel liest, schreibt besser", "wer viel liest, schreibt besser"],
            answer: 0,
            after: ".",
            feedback:
              "Nach einem Doppelpunkt entscheidet die Art des Angekündigten: Folgt ein ganzer Satz, schreibst du groß, folgen Wörter oder Wortgruppen, schreibst du klein.",
          },
          {
            before: "Die Zeile einer Gliederung heißt „b) ",
            options: ["Kosten für die Eltern", "Kosten für die Eltern."],
            answer: 0,
            after: "“.",
            feedback:
              "Zeilen einer Gliederung sind wie Überschriften. Prüfe, ob am Ende ein Satzzeichen stehen muss.",
          },
          {
            before: "Im Inhaltsverzeichnis steht „1.2 ",
            options: ["Schnelle Hilfe im Notfall", "schnelle Hilfe im Notfall"],
            answer: 0,
            after: "“.",
            feedback:
              "Nach der Gliederungsangabe gehört das erste Wort zum neuen Gliederungspunkt. Prüfe, wie er beginnt.",
          },
        ],
        2: [
          {
            before: "Im Entwurf für die Erörterung über Hausaufgaben steht eine Zeile „a) ",
            options: ["Mehr Zeit für Hobbys und Familie", "mehr Zeit für Hobbys und Familie"],
            answer: 0,
            after: "“, danach folgt „b) Weniger Stress vor Klassenarbeiten“.",
            feedback:
              "Nach jeder Gliederungsangabe, auch nach „a)“ und „b)“, beginnt der Gliederungspunkt wie eine Überschrift mit einem Großbuchstaben.",
          },
          {
            before: "Der Teil gegen Hausaufgaben beginnt in der Gliederung mit der Zeile „2. ",
            options: ["Argumente gegen Hausaufgaben", "Argumente gegen Hausaufgaben."],
            answer: 0,
            after: "“.",
            feedback:
              "Eine Gliederungszeile steht für sich wie eine Überschrift. Entscheide, ob an ihrem Ende ein Punkt gebraucht wird.",
          },
          {
            before: "In der Anleitung kündigt ein Satz eine Liste an: „Die Gruppe prüft drei Dinge: ",
            options: ["das Material, den Zeitplan und die Kosten", "Das Material, den Zeitplan und die Kosten"],
            answer: 0,
            after: ".“",
            feedback:
              "Nach dem Doppelpunkt folgen Wortgruppen. Prüfe, wie ein Satzbeginn nach einem Doppelpunkt geschrieben wird, wenn kein ganzer Satz folgt.",
          },
          {
            before: "Der Aushang der Schule lautet: „Wichtige Mitteilung: ",
            options: ["Der Unterricht endet am Freitag um 11 Uhr", "der Unterricht endet am Freitag um 11 Uhr"],
            answer: 0,
            after: ".“",
            feedback:
              "Folgt nach dem Doppelpunkt ein vollständiger Satz, beginnt er mit einem Großbuchstaben.",
          },
          {
            before: "Im Inhaltsverzeichnis der Facharbeit steht die Zeile „4.3 ",
            options: ["Auswertung der Umfrage", "Auswertung der Umfrage."],
            answer: 0,
            after: "“, gefolgt von der Zeile „4.4 Fazit“.",
            feedback:
              "Zeilen eines Inhaltsverzeichnisses stehen für sich wie Überschriften. Prüfe, ob an ihrem Ende ein Satzzeichen gebraucht wird.",
          },
          {
            before: "Im Entwurf für das Referat über Vulkane steht als dritter Punkt der Ebene „1.“ die Zeile „c) ",
            options: ["Wie Vulkane entstehen", "wie Vulkane entstehen"],
            answer: 0,
            after: "“.",
            feedback:
              "Das Wort nach einer Gliederungsangabe beginnt wie bei einer Überschrift mit einem Großbuchstaben, egal welche Wortart es ist.",
          },
          {
            before: "Im Protokoll heißt es: „Die Mitglieder beschließen zwei Dinge: ",
            options: ["Der Beitrag steigt, und das Heft erscheint ab Herbst monatlich", "der Beitrag steigt, und das Heft erscheint ab Herbst monatlich"],
            answer: 0,
            after: ".“",
            feedback:
              "Nach dem Doppelpunkt entscheidet die Art des Angekündigten über die Groß- oder Kleinschreibung. Prüfe, ob ein vollständiger Satz folgt.",
          },
          {
            before: "In der Gliederung eines Referats lautet der letzte Punkt „5. ",
            options: ["Quellen und Fotonachweise", "Quellen und Fotonachweise."],
            answer: 0,
            after: "“, danach beginnt der Anhang auf einer neuen Seite.",
            feedback:
              "Eine freistehende Zeile in einer Gliederung steht wie eine Überschrift ohne Schlusspunkt.",
          },
        ],
      },
    },
    tasks: {
      1: {
        prompt:
          "Schreibe eine Gliederung für eine Erörterung zum Thema „Soll es an unserer Schule ein Fach Finanzbildung geben?“ mit Einleitung, Hauptteil (zwei Argumente dafür, zwei dagegen) und Schluss. Nutze einheitliche Gliederungsangaben, beginne jede Zeile groß und setze am Zeilenende keinen Punkt.",
        hints: [
          "Nutze A., B. und C. für die Teile, 1. und 2. für dafür und dagegen und a) und b) für die einzelnen Argumente.",
          "Prüfe jede Zeile: Beginnt sie nach der Gliederungsangabe groß? Sind alle Punkte Stichwörter? Fehlt der Punkt am Ende?",
        ],
        model:
          "Thema: Fach Finanzbildung / A. Einleitung / B. Hauptteil / 1. Argumente dafür / a) Umgang mit Geld im Alltag / b) Schutz vor Schulden / 2. Argumente dagegen / a) Voller Stundenplan / b) Fehlende Fachlehrkräfte / C. Schluss. Die Schrägstriche trennen hier die Zeilen. Jede Zeile beginnt nach der Gliederungsangabe mit einem Großbuchstaben, alle Punkte sind Stichwörter, und am Zeilenende steht kein Punkt.",
        criteria: [
          "Nutzt einheitliche Gliederungsangaben (A., 1., a)).",
          "Beginnt jede Zeile groß und setzt am Zeilenende keinen Punkt.",
          "Enthält Einleitung, Hauptteil mit Argumenten dafür und dagegen sowie Schluss.",
        ],
      },
      2: {
        prompt:
          "Schreibe eine Checkliste für deinen ersten Tag im Praktikum zweimal: einmal mit Stichwörtern und einmal als Liste, die den Satz „Am ersten Tag solltest du“ fortsetzt. Erkläre in zwei Sätzen, was sich bei Großschreibung und Satzzeichen unterscheidet.",
        hints: [
          "Bei der Stichwortliste kündigst du die Punkte mit einem Doppelpunkt an und lässt die Zeilenenden frei.",
          "Bei der zweiten Liste liest du Satz und Punkte zusammen: Es muss ein richtiger Satz mit Kommas und einem Punkt am Schluss ergeben.",
        ],
        model:
          "Stichwörter: Am ersten Tag mitbringen: • Personalausweis • Arbeitskleidung • Block und Stift (alle Zeilen ohne Satzzeichen am Ende). Fortgesetzter Satz: Am ersten Tag solltest du • pünktlich erscheinen, • dich im Team vorstellen und • Fragen stellen. Bei den Stichwörtern beginnen die Punkte groß, weil es Substantive sind, und enden ohne Satzzeichen. Bei der zweiten Liste setzen die Punkte meinen Satz fort: Sie beginnen klein, werden durch Kommas getrennt, vor „und“ steht keines, und am Schluss steht ein Punkt.",
        criteria: [
          "Die Stichwortliste endet ohne Satzzeichen und beginnt mit Großbuchstaben.",
          "Die zweite Liste setzt den Satz fort: klein, Kommas, kein Komma vor „und“, Punkt am Schluss.",
          "Die Erklärung nennt beide Unterschiede.",
        ],
      },
    },
  },
];
