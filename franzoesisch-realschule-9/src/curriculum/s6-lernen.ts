import type { Lesson } from "../model/types";

/**
 * Stufe 6: Lernen lernen (Lernbereich 4, Methodische Kompetenzen, Kompetenzerwartungen 4.1 bis 4.7):
 * Wortschatzarbeit und Strategien, Sprachvergleich, digitale Hilfsmittel und Quellen sowie Fehleranalyse.
 */
export const S6: Lesson[] = [
  {
    id: "fr-lerntechniken",
    lb: 6,
    unit: "4",
    covers: ["4.1", "4.3"],
    title: "Wortschatz dauerhaft lernen und Strategien nutzen",
    intro:
      "Mit Karteikarten, Wortfeldern und festen Strategien beim Hören, Lesen, Sprechen und Schreiben behältst du Vokabeln und arbeitest selbstständiger.",
    paragraphs: [
      "Vokabeln bleiben im Gedächtnis, wenn du sie **mit Kontext** lernst und **wiederholst**. Schreibe ein Wort mit einem kurzen Beispielsatz auf eine Karteikarte (« un stage – Je cherche un stage à Lyon. ») und ordne neue Wörter in **Wortfeldern** (Reisen, Beruf, Schule) oder einer Mindmap. Wiederhole in wachsenden Abständen: nach einem Tag, nach drei Tagen, nach einer Woche, nach einem Monat. Genau dafür sind Karteisysteme und Wiederholungsprogramme wie ZAM gemacht.",
      "Es gibt mehrere **Lerntypen**: Manche prägen sich Wörter besser ein, wenn sie sie aufschreiben, andere, wenn sie sie laut sagen, wieder andere mit Bildern oder Gesten. Probiere verschiedene Methoden aus und wähle die, die zu dir passt. Computerprogramme und Apps helfen beim Abfragen, ersetzen aber nicht das aktive Verwenden der Wörter in eigenen Sätzen.",
      "Auch für die Fertigkeiten gibt es Strategien. **Hören:** vor dem Hören Fragen lesen, beim ersten Hören Gesamtzusammenhang erfassen. **Lesen:** Überschrift und Bilder nutzen, Schlüsselwörter markieren. **Sprechen:** Stichpunkte notieren, Redemittel vorbereiten, bei Lücken umschreiben. **Schreiben:** planen, schreiben, überarbeiten (Verben, Angleichung, Akzente). Wende diese Schritte gezielt an und kontrolliere dich selbst.",
      "Typische Fehler sind das Lernen von Wortlisten ohne Kontext, einmaliges Lernen vor der Probe, ohne Wiederholung, und das Vermeiden von schwierigen Aufgaben. Plane feste Zeiten (zum Beispiel zehn Minuten täglich), prüfe nach einigen Tagen, was du noch weißt, und vermerke, was du wiederholen musst.",
    ],
    terms: [
      { term: "Wortfeld", text: "Eine Gruppe von Wörtern zu einem Thema, zum Beispiel Reisen oder Schule. Wörter in Wortfeldern prägen sich besser ein." },
      { term: "Wiederholen in Abständen", text: "Wörter nach einem Tag, nach drei Tagen, nach einer Woche wieder abfragen. So wandern sie ins Langzeitgedächtnis." },
      { term: "Lernstrategie", text: "Ein fester Ablauf für eine Fertigkeit, zum Beispiel: vor dem Lesen Überschrift und Bilder ansehen, dann markieren und kontrollieren." },
    ],
    takeaway:
      "Lerne Vokabeln mit Beispielsatz, in Wortfeldern und mit Wiederholung in wachsenden Abständen. Nutze feste Strategien für Hören, Lesen, Sprechen und Schreiben und prüfe dich selbst.",
    sourceIds: ["lp", "lepointdufle", "dfjw"],
    quiz: {
      question: "Wie lernst du ein neues Wort am besten?",
      answer: "Mit Beispielsatz, Wortfeld und Wiederholung.",
      wrong: ["Einmal abschreiben und nie wieder ansehen.", "Nur die deutsche Übersetzung auswendig lernen."],
      explanation:
        "Kontext, Wortfeld und Wiederholung bringen das Wort ins Langzeitgedächtnis. Einmaliges Abschreiben und Übersetzungen ohne Kontext werden schnell vergessen.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Strategie ist das?",
      instruction: "Ordne jede Strategie der Fertigkeit oder dem Bereich zu, den sie unterstützt.",
      categories: ["Wortschatz", "Hören", "Lesen", "Schreiben"],
      entries: [
        { text: "Ich schreibe jedes neue Wort mit einem Beispielsatz auf eine Karteikarte.", target: 0, feedback: "Kontext und Karteikarte unterstützen das Wortschatzlernen." },
        { text: "Vor dem Hören lese ich die Aufgaben und überlege, worum es gehen wird.", target: 1, feedback: "Das Vorbereiten vor dem Hören ist eine Hörstrategie." },
        { text: "Ich sehe mir zuerst Überschrift und Bilder an und lese dann den ganzen Text.", target: 2, feedback: "Überschrift und Bilder helfen beim Globalverstehen eines Lesetexts." },
        { text: "Nach dem Schreiben prüfe ich Verben, Angleichung und Akzente einzeln.", target: 3, feedback: "Das Überarbeiten in Schritten ist eine Schreibstrategie." },
        { text: "Ich lerne Wörter in Wortfeldern und male dazu eine Mindmap.", target: 0, feedback: "Wortfelder und Mindmaps sind Methoden zum Wortschatzlernen." },
        { text: "Ich markiere im Text die Schlüsselwörter und suche dann die gefragten Informationen.", target: 2, feedback: "Schlüsselwörter zu markieren ist eine Lesestrategie." },
      ],
      conclusion: "Für jede Fertigkeit gibt es passende Strategien. Wähle gezielt, was zu deiner Aufgabe passt.",
    },
    casework: {
      title: "Ein Lernplan für die Woche",
      story:
        "Du hast eine Woche Zeit, um 30 neue Wörter zu lernen. Deine Lehrerin rät: « Lerne täglich zehn Minuten, schreibe Beispielsätze und frage dich nach drei Tagen noch einmal ab. »",
      steps: [
        {
          question: "Warum lernst du täglich zehn Minuten?",
          options: ["Regelmäßig lernen hilft dem Gedächtnis.", "Zehn Minuten sind die vorgeschriebene Mindestzeit.", "Länger als zehn Minuten darf man nicht lernen."],
          answer: 0,
          explanation: "Regelmäßiges kurzes Lernen ist wirkungsvoller als eine lange Lernphase kurz vor der Probe.",
        },
        {
          question: "Wozu schreibst du Beispielsätze?",
          options: ["So bleibt das Wort im Zusammenhang.", "Die Sätze sind kürzer als einzelne Wörter.", "Die Lehrkraft verlangt sie in jeder Stunde."],
          answer: 0,
          explanation: "Mit Kontext behältst du Bedeutung und Gebrauch eines Wortes leichter.",
        },
        {
          question: "Was machst du nach drei Tagen?",
          options: ["Ich frage mich noch einmal ab.", "Ich höre mit dem Lernen auf.", "Ich lerne neue Wörter ohne zu wiederholen."],
          answer: 0,
          explanation: "Wiederholung in wachsenden Abständen bringt Wörter ins Langzeitgedächtnis.",
        },
      ],
      verdict:
        "Mit kurzen täglichen Einheiten, Beispielsätzen und Wiederholung hältst du die 30 Wörter dauerhaft fest.",
    },
    tasks: {
      1: {
        prompt:
          "Wähle fünf Wörter aus dem Wortschatz dieser App und schreibe für jedes eine Karteikarte: Wort, Übersetzung, Beispielsatz auf Französisch.",
        hints: [
          "Der Beispielsatz soll das Wort im Zusammenhang zeigen.",
          "Schreibe Verben im Infinitiv und mit einem Beispiel.",
        ],
        model:
          "un stage – Praktikum – Je cherche un stage à Lyon. postuler – sich bewerben – Je postule pour un stage. un billet – Fahrkarte – J’achète un billet de train. une valise – Koffer – Ma valise est lourde. réserver – buchen – Nous réservons une chambre. Jede Karte hat Wort, Übersetzung und einen Beispielsatz.",
        criteria: [
          "Fünf Karteikarten mit Wort, Übersetzung und Beispielsatz.",
          "Die Beispielsätze sind korrekt und sinnvoll.",
          "Die Wörter gehören zu einem gemeinsamen Thema.",
        ],
      },
      2: {
        prompt:
          "Erstelle einen Lernplan für zwei Wochen, um den Wortschatz und die Grammatik dieses Jahres zu festigen. Nenne fünf Strategien (Wortschatz, Hören, Lesen, Sprechen, Schreiben), feste Zeiten und eine Kontrolle nach einer Woche. Schreibe auf Deutsch, aber nenne mindestens drei französische Beispiele.",
        hints: [
          "Plane kurze tägliche Einheiten.",
          "Lege fest, woran du erkennst, dass du etwas gelernt hast.",
        ],
        model:
          "Woche 1: Täglich zehn Minuten Wortschatz mit Karteikarten (z. B. un billet, un stage). Montag und Donnerstag zehn Minuten Hören mit einem Transkript. Dienstag Lesen eines kurzen Textes mit Schlüsselwörtern. Mittwoch Sprechen mit Stichpunkten (Je me lève à sept heures). Freitag Schreiben und Überarbeiten in vier Schritten. Kontrolle am Ende der Woche: Ich frage mich 20 Wörter ab. Woche 2: Wiederholung der schwachen Wörter und eine neue Schreibaufgabe.",
        criteria: [
          "Fünf Strategien sind genannt und passen zu den Fertigkeiten.",
          "Feste Zeiten und eine Kontrolle sind eingeplant.",
          "Mindestens drei französische Beispiele kommen vor.",
        ],
      },
    },
  },
  {
    id: "fr-sprachvergleich",
    lb: 6,
    unit: "4",
    covers: ["4.2"],
    title: "Sprachen vergleichen: Deutsch, Englisch, Französisch",
    intro:
      "Wer Deutsch und Englisch kennt, kann Französisch leichter erschließen. Du vergleichst Regeln und nutzt Gemeinsamkeiten.",
    paragraphs: [
      "Du lernst Französisch als dritte Sprache neben Deutsch und Englisch. Das hilft: Viele Regeln kennst du schon und musst sie nur wiedererkennen. Ein Beispiel aus dem Lehrplan ist der Bedingungssatz: **Englisch** « If you come, we will go to the cinema. » **Französisch** « Si tu viens, nous irons au cinéma. » In beiden Sprachen steht im Bedingungssatz das Präsens, im Hauptsatz das Futur. Im Deutschen sagst du dagegen oft zweimal das Präsens oder wenn … dann.",
      "**Gemeinsamkeiten mit Deutsch:** Nomen haben ein grammatisches Geschlecht (le livre, la table; das Buch, die Tür), Verben mit Bewegung bilden das Perfekt mit „sein“ (ich bin gegangen, je suis allé). **Gemeinsamkeiten mit Englisch:** Der Plural wird mit -s gebildet (des amis, friends), viele Wörter ähneln sich (important, information, restaurant). **Besonderheiten im Französischen:** Das Adjektiv steht meist nach dem Nomen (une voiture rouge), die Verneinung hat zwei Teile (ne … pas), und viele Endungen werden nicht gesprochen.",
      "Beim Vergleich fragst du: Wo ist es gleich, wo ist es anders? Eine **Vergleichstabelle** (Deutsch, Englisch, Französisch) hilft: ein Wort, ein Satz, eine Regel pro Zeile. Du erkennst Muster und prüfst, wo dir die Muttersprache oder das Englische eine Brücke bauen und wo sie dich in die Irre führen (faux amis, Wortstellung).",
      "Typische Fehler sind das **Übertragen** einer Regel in eine Sprache, in der sie nicht gilt (Adjektiv vor dem Nomen: « une rouge voiture »), und das Übertragen von Wortbedeutungen (« actuellement » = tatsächlich). Darum prüfst du jede Übertragung an einem Beispiel und schlägst im Zweifel nach.",
    ],
    terms: [
      { term: "Vergleichstabelle", text: "Eine Tabelle mit Deutsch, Englisch und Französisch, in der du Wörter, Sätze und Regeln nebeneinanderstellst." },
      { term: "Brücke", text: "Eine Gemeinsamkeit zwischen Sprachen, die dir das Lernen erleichtert, zum Beispiel der Bedingungssatz mit if und si." },
      { term: "Interferenz", text: "Ein Fehler, der entsteht, wenn du eine Regel aus einer anderen Sprache überträgst, zum Beispiel das Adjektiv vor das Nomen." },
    ],
    takeaway:
      "Vergleiche Regeln mit Deutsch und Englisch: Der Bedingungssatz entspricht if + Präsens, will. Nomen haben ein Geschlecht wie im Deutschen. Adjektive stehen meist nach dem Nomen. Prüfe jede Übertragung an Beispielen.",
    sourceIds: ["lp", "lingolia", "cnrtl"],
    quiz: {
      question: "Welche Regel gilt im Französischen wie im Englischen?",
      answer: "Nach si steht das Präsens, danach das Futur.",
      wrong: ["Das Adjektiv steht immer vor dem Nomen.", "Die Verneinung besteht nur aus einem Wort."],
      explanation:
        "Si tu viens, nous irons entspricht if you come, we will go. Adjektive stehen im Französischen meist nach dem Nomen, die Verneinung hat meist zwei Teile (ne … pas).",
    },
    workshop: {
      kind: "classify",
      title: "Wie im Englischen, wie im Deutschen oder nur im Französischen?",
      instruction: "Ordne jede Regel der Sprache zu, mit der sie übereinstimmt.",
      categories: ["Wie im Englischen", "Wie im Deutschen", "Nur im Französischen"],
      entries: [
        { text: "Nach si steht das Präsens, genau wie nach if im Englischen: si tu viens, if you come.", target: 0, feedback: "Die Struktur ist im Englischen und Französischen gleich." },
        { text: "Verben der Bewegung bilden das Perfekt mit sein: ich bin gegangen, je suis allé.", target: 1, feedback: "Hier stimmen Deutsch und Französisch überein." },
        { text: "Das Adjektiv steht meist nach dem Nomen: une voiture rouge, anders als in beiden Sprachen.", target: 2, feedback: "Die Stellung nach dem Nomen ist eine französische Besonderheit." },
        { text: "Der Plural wird mit einem s gebildet, das man oft nicht hört, wie bei des amis und friends.", target: 0, feedback: "Die Pluralbildung mit s entspricht dem Englischen." },
        { text: "Alle Nomen haben ein grammatisches Geschlecht, auch Dinge: le livre, la table, wie der Tisch, die Tür.", target: 1, feedback: "Ein grammatisches Geschlecht kennt auch das Deutsche." },
        { text: "Die Verneinung hat zwei Teile um das Verb: ne … pas, das gibt es so in keiner der beiden Sprachen.", target: 2, feedback: "Die doppelte Verneinung ist typisch französisch." },
      ],
      conclusion: "Sprachvergleich hilft: Er zeigt Brücken und Fallen auf dem Weg zum Französischen.",
    },
    casework: {
      title: "Ein Satz im Dreisprachenvergleich",
      story:
        "Du vergleichst: Deutsch « Wenn es regnet, bleiben wir zu Hause. » Englisch « If it rains, we will stay at home. » Französisch « S’il pleut, nous resterons à la maison. »",
      steps: [
        {
          question: "Welche Gemeinsamkeit haben Englisch und Französisch?",
          options: ["Präsens nach if und si, dann Futur.", "Die Wortstellung ist in allen Sätzen gleich.", "Die Aussprache der beiden Sätze ist gleich."],
          answer: 0,
          explanation: "If it rains, we will stay und s’il pleut, nous resterons folgen demselben Muster.",
        },
        {
          question: "Was fällt im Französischen an « s’il » auf?",
          options: ["Si wird vor il zu s’.", "Si wird immer zu s’.", "Il fällt weg."],
          answer: 0,
          explanation: "Die Verkürzung gibt es nur vor il und ils.",
        },
        {
          question: "Was unterscheidet das Deutsche?",
          options: ["Oft steht auch im Hauptsatz das Präsens.", "Der Bedingungssatz steht nie am Satzanfang.", "Es gibt im Deutschen keinen Nebensatz dafür."],
          answer: 0,
          explanation: "Im Deutschen sagst du oft „bleiben wir“ im Präsens, im Französischen und Englischen steht dort das Futur.",
        },
      ],
      verdict:
        "Der Vergleich zeigt, dass Französisch und Englisch hier ähnlicher sind als Französisch und Deutsch. So nutzt du bekanntes Wissen.",
    },
    tasks: {
      1: {
        prompt:
          "Lege eine Vergleichstabelle mit drei Zeilen an: der Bedingungssatz, die Stellung des Adjektivs und der Plural. Schreibe zu jeder Zeile ein Beispiel in Deutsch, Englisch und Französisch.",
        hints: [
          "Nutze si tu viens, une voiture rouge und des amis.",
          "Markiere, wo Gemeinsamkeiten und Unterschiede liegen.",
        ],
        model:
          "Bedingungssatz: Wenn du kommst, gehen wir. – If you come, we will go. – Si tu viens, nous irons. Adjektiv: ein rotes Auto – a red car – une voiture rouge (nach dem Nomen). Plural: Freunde – friends – des amis (stummes s). Der Bedingungssatz ist wie im Englischen, das Adjektiv ist anders als in beiden Sprachen.",
        criteria: [
          "Drei Zeilen mit Beispielen in drei Sprachen.",
          "Gemeinsamkeiten und Unterschiede werden benannt.",
          "Die französischen Beispiele sind korrekt.",
        ],
      },
      2: {
        prompt:
          "Schreibe einen Text von sechs bis acht Sätzen auf Deutsch: Wo hilft dir Englisch beim Französischlernen, wo führt dich Deutsch oder Englisch in die Irre? Nenne fünf konkrete französische Beispiele (Wörter oder Sätze).",
        hints: [
          "Denke an Ähnlichkeiten (important) und an Fallen (actuellement).",
          "Erkläre kurz, wie du eine Falle erkennst.",
        ],
        model:
          "Englisch hilft mir bei Wörtern wie important, information und restaurant, die im Französischen ähnlich geschrieben werden. Auch der Bedingungssatz Si tu viens, nous irons ist wie im Englischen. Dagegen führt mich das Deutsche in die Irre bei actuellement, das zurzeit bedeutet und nicht tatsächlich. Auch une voiture rouge steht anders als im Deutschen und Englischen. Wenn ich unsicher bin, schlage ich nach.",
        criteria: [
          "Hilfreiche Gemeinsamkeiten und Fallen werden benannt.",
          "Fünf französische Beispiele sind korrekt angegeben.",
          "Der Text begründet, wie die Fallen erkannt werden.",
        ],
      },
    },
  },
  {
    id: "fr-hilfsmittel-digital",
    lb: 6,
    unit: "4",
    covers: ["4.4", "4.5", "4.6"],
    title: "Hilfsmittel, Quellen und digitale Prüfung nutzen",
    intro:
      "Online-Wörterbücher, Konjugationstabellen und Enzyklopädien helfen beim Lernen. Rechtschreibprüfung hilft, ersetzt aber das eigene Prüfen nicht.",
    paragraphs: [
      "Für das Nachschlagen gibt es verschiedene **Hilfsmittel**. Ein Online-Wörterbuch (zum Beispiel Larousse oder CNRTL) zeigt Bedeutung, Beispiele, Aussprache und Wortfamilie. Eine **Konjugationstabelle** (zum Beispiel leconjugueur.com oder Lingolia) zeigt alle Formen eines Verbs. Eine **Grammatikseite** erklärt Regeln mit Beispielen. Wähle das Hilfsmittel nach der Frage: Bedeutung, Form oder Regel?",
      "Für Informationen über Themen (Paris, Belgien, Berufe) nutzt du **Quellen**: Enzyklopädien, offizielle Seiten von Institutionen (Tourismus, Schulen, Behörden) und seriöse Zeitungen. Prüfe, wer die Seite schreibt, wann sie aktualisiert wurde und wozu sie dient (informieren oder verkaufen). Notiere dir die Quelle, damit du sie später angeben kannst.",
      "Beim Schreiben am Computer kannst du **Rechtschreib- und Grammatikprüfung** einschalten. Sie erkennt viele Fehler (falsche Akzente, fehlende Angleichung), aber nicht alle: Wörter wie « a » und « à » oder « ou » und « où » können beide richtig geschrieben sein und trotzdem an der falschen Stelle stehen. Auch Eigennamen, Zahlen oder Satzbau prüft das Programm nicht zuverlässig.",
      "Typische Fehler sind blindes Vertrauen in die Prüfung, die Übernahme einer ersten Übersetzung ohne Beispiel und das Verwenden von Quellen ohne Datum oder Autor. Gehe nach dem Muster vor: nachschlagen, Beispiele ansehen, selbst prüfen, Quelle notieren.",
    ],
    terms: [
      { term: "Online-Wörterbuch", text: "Ein digitales Nachschlagewerk mit Bedeutung, Beispielen und oft Hörproben. Nutze die Beispielsätze, nicht nur die Übersetzung." },
      { term: "Konjugationstabelle", text: "Eine Übersicht aller Formen eines Verbs. Sie hilft bei unregelmäßigen Verben und Zeiten." },
      { term: "Quelle prüfen", text: "Frage nach Autor, Datum und Zweck einer Seite und notiere, woher du eine Information hast." },
    ],
    takeaway:
      "Wähle das passende Hilfsmittel (Wörterbuch, Konjugationstabelle, Grammatikseite, Enzyklopädie). Prüfe Quellen auf Autor, Datum und Zweck. Rechtschreibprüfung hilft, findet aber nicht alle Fehler.",
    sourceIds: ["lp", "larousse", "cnrtl", "lingolia"],
    quiz: {
      question: "Was findet ein Rechtschreibprogramm oft nicht?",
      answer: "Ein richtig geschriebenes, aber falsch gesetztes Wort.",
      wrong: ["Ein vollständig fehlendes Satzzeichen am Satzende eines Satzes.", "Ein Wort, das mit zwei Rechtschreibfehlern geschrieben ist."],
      explanation:
        "A und à sind beide korrekt geschrieben, nur der Sinn entscheidet. Programme erkennen solche Verwechslungen oft nicht.",
    },
    workshop: {
      kind: "classify",
      title: "Welches Hilfsmittel passt?",
      instruction: "Ordne jede Frage dem Hilfsmittel zu, mit dem du sie am besten beantwortest.",
      categories: ["Wörterbuch", "Enzyklopädie", "Konjugationstabelle", "Prüfprogramm"],
      entries: [
        { text: "Ich möchte wissen, was das Wort « composter » bedeutet.", target: 0, feedback: "Die Bedeutung eines Wortes schlägst du im Wörterbuch nach." },
        { text: "Ich suche Informationen über die Geschichte von Lyon.", target: 1, feedback: "Hintergrundwissen zu einer Stadt findest du in einer Enzyklopädie." },
        { text: "Ich muss wissen, wie der futur simple von aller heißt.", target: 2, feedback: "Alle Verbformen findest du in einer Konjugationstabelle." },
        { text: "Ich will prüfen, ob in meinem Text Akzente fehlen.", target: 3, feedback: "Ein Prüfprogramm erkennt fehlende Akzente." },
        { text: "Ich möchte ein Beispiel für das Wort « stage » in einem Satz sehen.", target: 0, feedback: "Beispielsätze stehen im Wörterbuch." },
        { text: "Ich will wissen, wo das Louvre liegt und seit wann es ein Museum ist.", target: 1, feedback: "Das ist eine Sachfrage, die eine Enzyklopädie beantwortet." },
      ],
      conclusion: "Wörterbuch für Bedeutungen, Enzyklopädie für Sachwissen, Konjugationstabelle für Verbformen, Prüfprogramm für Schreibfehler.",
    },
    casework: {
      title: "Ein Referat vorbereiten",
      story:
        "Du bereitest ein Referat über Paris vor. Du suchst Informationen über den Louvre, willst ein unbekanntes Wort klären und deinen Text auf Fehler prüfen.",
      steps: [
        {
          question: "Wo suchst du Informationen über den Louvre?",
          options: ["Bei einer offiziellen Seite.", "Auf einer Seite ohne Autor und Datum.", "In einem Werbebanner im Internet."],
          answer: 0,
          explanation: "Enzyklopädien und offizielle Seiten sind verlässlicher als anonyme oder werbende Seiten.",
        },
        {
          question: "Wie klärst du ein unbekanntes Wort?",
          options: ["Im Wörterbuch, mit Beispielsätzen.", "Ich nehme einfach die erste Übersetzung.", "Ich lasse das unbekannte Wort einfach weg."],
          answer: 0,
          explanation: "Beispielsätze zeigen, ob das Wort im Zusammenhang passt.",
        },
        {
          question: "Was machst du nach der Rechtschreibprüfung?",
          options: ["Ich lese den Text selbst noch einmal.", "Ich gebe den Text sofort bei der Lehrerin ab.", "Ich lösche alle Vorschläge des Programms."],
          answer: 0,
          explanation: "Das Programm findet nicht alle Fehler, deshalb prüfst du selbst nach.",
        },
      ],
      verdict:
        "Mit verlässlichen Quellen, Beispielsätzen im Wörterbuch und eigener Endkontrolle bereitest du ein gutes Referat vor.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe fünf kurze Fragen aus deiner Schulpraxis (zum Beispiel: Wie heißt die Verbform von prendre im futur simple für nous?) und nenne jeweils das passende Hilfsmittel.",
        hints: [
          "Wörterbuch, Konjugationstabelle, Enzyklopädie, Prüfprogramm.",
          "Eine Frage darf mehrere Hilfsmittel nutzen.",
        ],
        model:
          "1. Was heißt « un billet »? Wörterbuch. 2. Wie heißt prendre im futur simple für nous? Konjugationstabelle. 3. Wann wurde der Eiffelturm gebaut? Enzyklopädie. 4. Fehlen in meinem Text Akzente? Prüfprogramm. 5. Wie spricht man « haricot » aus? Wörterbuch mit Hörprobe.",
        criteria: [
          "Fünf Fragen mit passendem Hilfsmittel.",
          "Mindestens drei verschiedene Hilfsmittel kommen vor.",
          "Die Fragen sind sinnvoll formuliert.",
        ],
      },
      2: {
        prompt:
          "Schreibe auf Deutsch einen kurzen Leitfaden von sechs bis acht Sätzen für Mitschüler: Wie prüft man eine Quelle für ein Referat über Frankreich, und wie nutzt man Wörterbuch und Rechtschreibprüfung richtig? Nenne drei Beispiele für Fehler, die ein Programm nicht erkennt.",
        hints: [
          "Autor, Datum, Zweck.",
          "Denke an a und à, ou und où und Angleichung.",
        ],
        model:
          "Prüfe bei jeder Seite, wer sie geschrieben hat, wann sie aktualisiert wurde und ob sie informieren oder verkaufen will. Notiere dir die Quelle. Schlage Wörter im Wörterbuch nach und lies die Beispielsätze. Eine Rechtschreibprüfung findet viele Fehler, aber nicht alle: Sie erkennt oft nicht, ob a oder à richtig ist, ob ou oder où passt und ob das Partizip an das Subjekt angeglichen ist. Lies deshalb deinen Text immer noch einmal selbst.",
        criteria: [
          "Autor, Datum und Zweck werden genannt.",
          "Drei Beispiele für nicht erkannte Fehler sind richtig.",
          "Der Leitfaden ist verständlich und hilfreich.",
        ],
      },
    },
  },
  {
    id: "fr-fehleranalyse",
    lb: 6,
    unit: "4",
    covers: ["4.7"],
    title: "Fehler erkennen, ordnen und gezielt üben",
    intro:
      "Mit einem Fehlerprotokoll und Checklisten (fiches d’écriture) erkennst du deine häufigsten Fehler und übst gezielt.",
    paragraphs: [
      "Fehler sind Hinweise, was du noch üben kannst. Der erste Schritt ist, sie zu **ordnen**: **Rechtschreibung** (Akzent, Großschreibung, Apostroph: « je vais a Paris »), **Grammatik** (Angleichung, Zeitform, Präposition: « elles sont parti »), **Wortwahl** (falscher Freund: « je deviens un cadeau » statt « je reçois ») und **Satzbau** (Stellung von Pronomen und Verneinung). Je nach Fehlerart hilfst du dir unterschiedlich.",
      "Ein **Fehlerprotokoll** ist eine kleine Tabelle: Fehler, Berichtigung, Fehlerart, Regel. Du sammelst Fehler aus eigenen Texten und siehst nach einigen Wochen, welche häufig vorkommen. Schreibe zu jeder Fehlerart eine kurze Regel und ein Beispiel auf. Aus dem Protokoll leitest du ab, was du gezielt üben musst.",
      "Eine **fiche d’écriture** ist eine Checkliste für das Überarbeiten: Habe ich Subjekt und Verb zugeordnet? Sind Adjektive und Partizipien angeglichen? Stehen die Akzente? Habe ich die richtigen Zeiten gewählt? Stimmen die Konnektoren? Lies den Text mehrmals mit je einem Fokus, laut oder von hinten nach vorn, und lasse ihn von einem Partner prüfen.",
      "Typische Fehler beim Üben sind, Fehler nur zu korrigieren, ohne die Regel zu verstehen, und alle Fehler gleichzeitig verbessern zu wollen. Nimm dir pro Woche ein bis zwei Fehlerarten vor, schreibe neue Beispielsätze und kontrolliere dich im nächsten Text.",
    ],
    terms: [
      { term: "Fehlerprotokoll", text: "Eine Tabelle mit Fehler, Berichtigung, Fehlerart und Regel. Sie zeigt, welche Fehler häufig auftreten." },
      { term: "fiche d’écriture", text: "Eine Checkliste zum Überarbeiten: Verben, Angleichung, Akzente, Zeiten und Konnektoren der Reihe nach prüfen." },
      { term: "Fehlerart", text: "Rechtschreibung, Grammatik, Wortwahl oder Satzbau. Mit der Art weißt du, wie du gezielt übst." },
    ],
    takeaway:
      "Ordne Fehler nach Art (Rechtschreibung, Grammatik, Wortwahl, Satzbau), führe ein Fehlerprotokoll mit Regel und Beispiel und überarbeite mit einer Checkliste. Übe pro Woche ein bis zwei Fehlerarten gezielt.",
    sourceIds: ["lp", "lepointdufle", "cnrtl"],
    quiz: {
      question: "Was gehört in ein Fehlerprotokoll?",
      answer: "Fehler, Berichtigung, Fehlerart und Regel.",
      wrong: ["Nur die richtige Lösung ohne den Fehler.", "Nur die Note der Klassenarbeit."],
      explanation:
        "Das Protokoll zeigt, was falsch war, wie es richtig heißt, welche Art von Fehler es ist und welche Regel gilt. Nur die Lösung oder die Note reichen nicht.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Fehlerart ist das?",
      instruction: "Ordne jeden fehlerhaften Satz der Fehlerart zu.",
      categories: ["Rechtschreibung", "Grammatik", "Wortwahl"],
      entries: [
        { text: "Je vais a Paris avec ma sœur. (statt à)", target: 0, feedback: "Der accent grave fehlt: Das ist ein Rechtschreibfehler." },
        { text: "Elles sont parti hier soir. (statt parties)", target: 1, feedback: "Das Partizip passt sich dem Subjekt nicht an: Das ist ein Grammatikfehler." },
        { text: "Je suis allé au gymnase pour apprendre le latin. (gemeint: Gymnasium)", target: 2, feedback: "Gymnase ist die Turnhalle: Das ist ein falscher Freund, also Wortwahl." },
        { text: "Mardi, je vais au Cinéma. (statt cinéma)", target: 0, feedback: "Hier ist die Großschreibung falsch: ein Rechtschreibfehler." },
        { text: "Elle joue de football avec ses amis. (statt au)", target: 1, feedback: "Die Präposition jouer à gehört zu Sportarten: ein Grammatikfehler." },
        { text: "Pour mon anniversaire, je deviens un livre de mon oncle. (gemeint: bekommen)", target: 2, feedback: "Devenir heißt werden, nicht bekommen: falsches Wort, also Wortwahl." },
      ],
      conclusion: "Die Fehlerart zeigt dir, wie du gezielt übst: Akzente, Regeln oder Wortschatz.",
    },
    casework: {
      title: "Fehlerprotokoll nach einem Test",
      story:
        "Nach einem Test notierst du drei Fehler: « J’ai allé au cinéma », « les filles sont parti », « un billet de gymnase pour le lycée ». Du erstellst daraus ein Fehlerprotokoll.",
      steps: [
        {
          question: "Warum ist « J’ai allé » falsch?",
          options: ["Aller bildet das passé composé mit être.", "Aller bildet kein passé composé im Französischen.", "Das Verb steht hier im Plural statt Singular."],
          answer: 0,
          explanation: "Richtig ist je suis allé. Das ist ein Grammatikfehler beim Hilfsverb.",
        },
        {
          question: "Was ist an « les filles sont parti » falsch?",
          options: ["Das Partizip: parties.", "Das Hilfsverb: ont statt sont.", "Das Subjekt: elle statt les filles."],
          answer: 0,
          explanation: "Das Partizip passt sich nach être dem weiblichen Plural an: parties.",
        },
        {
          question: "Welche Fehlerart ist « un billet de gymnase pour le lycée »?",
          options: ["Wortwahl, falscher Freund.", "Rechtschreibung der Akzente.", "Satzbau und Wortstellung."],
          answer: 0,
          explanation: "Gymnase heißt Turnhalle, das Gymnasium heißt lycée. Es ist ein Wortwahlfehler.",
        },
      ],
      verdict:
        "Aus drei Fehlern ergeben sich drei Fehlerarten und konkrete Übungen: Hilfsverb, Angleichung und falsche Freunde.",
    },
    tasks: {
      1: {
        prompt:
          "Erstelle ein Fehlerprotokoll mit drei Zeilen für die Fehler: 1. Je vais a Lyon. 2. Elles sont parti. 3. Il joue de football. Schreibe Fehler, Berichtigung, Fehlerart und Regel auf.",
        hints: [
          "Ordne jeden Fehler einer Art zu.",
          "Formuliere die Regel in einem kurzen Satz.",
        ],
        model:
          "1. à Lyon (statt a) – Rechtschreibung – Zu heißt à mit accent grave. 2. elles sont parties – Grammatik – Das Partizip nach être passt sich dem Subjekt an. 3. il joue au football – Grammatik – Sportarten stehen mit jouer à. Jede Zeile enthält Fehler, Berichtigung, Art und Regel.",
        criteria: [
          "Fehler, Berichtigung, Fehlerart und Regel stehen in jeder Zeile.",
          "Die Fehlerarten sind richtig zugeordnet.",
          "Die Regeln sind verständlich formuliert.",
        ],
      },
      2: {
        prompt:
          "Schreibe einen Text von sechs bis acht Sätzen über dein Wochenende. Überarbeite ihn mit einer eigenen Checkliste (fiche d’écriture) mit mindestens fünf Punkten, notiere gefundene Fehler in einem Protokoll und nenne eine Fehlerart, die du nächste Woche gezielt übst.",
        hints: [
          "Prüfe Verben, Angleichung, Akzente, Zeiten und Konnektoren der Reihe nach.",
          "Notiere nur Fehler, die du wirklich gefunden hast.",
        ],
        model:
          "Samedi, je suis allé à Munich avec mes parents. Nous avons visité un musée et nous avons mangé dans un petit restaurant. Ma sœur est restée à la maison parce qu’elle était malade. Dimanche, nous avons joué au tennis. Checkliste: Verb und Subjekt, Hilfsverb, Angleichung, Akzente, Konnektoren. Protokoll: je suis allé a Munich → à Munich (Akzent). Nächste Woche übe ich Akzente bei à, où und é.",
        criteria: [
          "Eine Checkliste mit mindestens fünf Punkten ist angegeben.",
          "Gefundene Fehler stehen im Protokoll mit Berichtigung.",
          "Eine Übung für die nächste Woche ist genannt.",
        ],
      },
    },
  },
];
